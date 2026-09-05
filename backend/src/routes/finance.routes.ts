import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('comptabilite'));

// --- Échéances ---
const echeanceSchema = z.object({
  eleveId: z.string().uuid(),
  libelle: z.string(),
  montantDu: z.number().positive(),
  dateEcheance: z.coerce.date(),
});
router.post(
  '/echeances',
  asyncHandler(async (req, res) => {
    res.status(201).json(await prisma.echeancePaiement.create({ data: echeanceSchema.parse(req.body) }));
  })
);
router.get(
  '/echeances',
  asyncHandler(async (req, res) => {
    const eleveId = req.query.eleveId as string | undefined;
    const statut = req.query.statut as string | undefined;
    res.json(
      await prisma.echeancePaiement.findMany({
        where: { ...(eleveId && { eleveId }), ...(statut && { statut }) },
        include: { eleve: true, paiements: true },
        orderBy: { dateEcheance: 'asc' },
      })
    );
  })
);

// --- Paiements + génération automatique de quittance ---
const paiementSchema = z.object({
  eleveId: z.string().uuid(),
  echeanceId: z.string().uuid().optional(),
  montant: z.number().positive(),
  modePaiement: z.enum(['Espèces', 'Chèque', 'Virement', 'Mobile Money']),
  reference: z.string().optional(),
  encaisseParId: z.string().uuid().optional(),
});

async function genererNumeroQuittance(): Promise<string> {
  const annee = new Date().getFullYear();
  const count = await prisma.quittance.count({ where: { numero: { startsWith: `QT${annee}` } } });
  return `QT${annee}-${String(count + 1).padStart(6, '0')}`;
}

router.post(
  '/paiements',
  asyncHandler(async (req, res) => {
    const data = paiementSchema.parse(req.body);

    const resultat = await prisma.$transaction(async (tx) => {
      const numero = await genererNumeroQuittance();
      const quittance = await tx.quittance.create({ data: { numero } });

      const paiement = await tx.paiementScolaire.create({
        data: { ...data, quittanceId: quittance.id },
      });

      if (data.echeanceId) {
        const echeance = await tx.echeancePaiement.findUnique({
          where: { id: data.echeanceId },
          include: { paiements: true },
        });
        if (echeance) {
          const totalPaye = echeance.paiements.reduce((s, p) => s + p.montant, 0) + data.montant;
          const statut = totalPaye >= echeance.montantDu ? 'Payée' : 'Partielle';
          await tx.echeancePaiement.update({ where: { id: data.echeanceId }, data: { statut } });
        }
      }

      return { paiement, quittance };
    });

    res.status(201).json(resultat);
  })
);

router.get(
  '/paiements',
  asyncHandler(async (req, res) => {
    const eleveId = req.query.eleveId as string | undefined;
    res.json(
      await prisma.paiementScolaire.findMany({
        where: eleveId ? { eleveId } : undefined,
        include: { eleve: true, quittance: true, echeance: true },
        orderBy: { datePaiement: 'desc' },
      })
    );
  })
);

// --- Comptabilité générale : écritures en partie double ---
const ecritureSchema = z.object({
  journalId: z.string().uuid(),
  date: z.coerce.date(),
  libelle: z.string(),
  compteDebitId: z.string().uuid(),
  compteCreditId: z.string().uuid(),
  montant: z.number().positive(),
  pieceJustificative: z.string().optional(),
  saisieParId: z.string().uuid().optional(),
});
router.post(
  '/ecritures',
  asyncHandler(async (req, res) => {
    const data = ecritureSchema.parse(req.body);
    if (data.compteDebitId === data.compteCreditId) {
      throw new ApiError(400, 'Le compte débité et le compte crédité doivent être différents.');
    }
    res.status(201).json(await prisma.ecritureComptable.create({ data }));
  })
);
router.get(
  '/ecritures',
  asyncHandler(async (req, res) => {
    const journalId = req.query.journalId as string | undefined;
    res.json(
      await prisma.ecritureComptable.findMany({
        where: journalId ? { journalId } : undefined,
        include: { journal: true, compteDebit: true, compteCredit: true },
        orderBy: { date: 'desc' },
      })
    );
  })
);

// --- Bilan (simplifié) : solde par compte, agrégé sur toutes les écritures ---
router.get(
  '/bilan',
  asyncHandler(async (_req, res) => {
    const comptes = await prisma.compteComptable.findMany({
      include: { ecrituresDebit: true, ecrituresCredit: true },
    });
    const bilan = comptes.map((c) => {
      const totalDebit = c.ecrituresDebit.reduce((s, e) => s + e.montant, 0);
      const totalCredit = c.ecrituresCredit.reduce((s, e) => s + e.montant, 0);
      return {
        compte: c.numero,
        libelle: c.libelle,
        classe: c.classe,
        totalDebit,
        totalCredit,
        solde: totalDebit - totalCredit,
      };
    });
    res.json(bilan);
  })
);

// --- Caisse : mouvements avec solde courant ---
const mouvementSchema = z.object({
  type: z.enum(['Entrée', 'Sortie']),
  montant: z.number().positive(),
  motif: z.string(),
  categorie: z.string().optional(),
  saisieParId: z.string().uuid().optional(),
});
router.post(
  '/caisse',
  asyncHandler(async (req, res) => {
    const data = mouvementSchema.parse(req.body);
    const dernier = await prisma.mouvementCaisse.findFirst({ orderBy: { date: 'desc' } });
    const soldeAvant = dernier?.soldeApres ?? 0;
    const soldeApres = data.type === 'Entrée' ? soldeAvant + data.montant : soldeAvant - data.montant;
    if (data.type === 'Sortie' && soldeApres < 0) {
      throw new ApiError(400, 'Solde de caisse insuffisant pour cette sortie.');
    }
    res.status(201).json(await prisma.mouvementCaisse.create({ data: { ...data, soldeApres } }));
  })
);
router.get(
  '/caisse',
  asyncHandler(async (_req, res) => {
    res.json(await prisma.mouvementCaisse.findMany({ orderBy: { date: 'desc' }, take: 200 }));
  })
);

export default router;
