import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('scolarite'));

async function genererMatricule(): Promise<string> {
  const annee = new Date().getFullYear();
  const count = await prisma.eleve.count({ where: { matricule: { startsWith: `EL${annee}` } } });
  return `EL${annee}-${String(count + 1).padStart(5, '0')}`;
}

const eleveSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  dateNaissance: z.coerce.date(),
  lieuNaissance: z.string().optional(),
  sexe: z.enum(['Masculin', 'Féminin']),
  nationalite: z.string().optional(),
  adresse: z.string().optional(),
  groupeSanguin: z.string().optional(),
  allergies: z.string().optional(),
  contactUrgenceNom: z.string().optional(),
  contactUrgenceTelephone: z.string().optional(),
  // Inscription immédiate optionnelle
  classeId: z.string().uuid().optional(),
  anneeScolaireId: z.string().uuid().optional(),
});

// GET /api/eleves — liste paginée + recherche par nom/prénom/matricule
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const pageSize = Math.min(200, Math.max(1, parseInt((req.query.pageSize as string) || '25', 10)));
    const q = req.query.q as string | undefined;
    const classeId = req.query.classeId as string | undefined;

    const where: any = {
      ...(q && {
        OR: [
          { nom: { contains: q, mode: 'insensitive' } },
          { prenom: { contains: q, mode: 'insensitive' } },
          { matricule: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(classeId && { inscriptions: { some: { classeId } } }),
    };

    const [items, total] = await Promise.all([
      prisma.eleve.findMany({
        where,
        include: { inscriptions: { include: { classe: true }, orderBy: { dateInscription: 'desc' }, take: 1 } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { nom: 'asc' },
      }),
      prisma.eleve.count({ where }),
    ]);

    res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const eleve = await prisma.eleve.findUnique({
      where: { id: req.params.id },
      include: {
        inscriptions: { include: { classe: true } },
        parents: { include: { parent: true } },
        notes: { orderBy: { dateEvaluation: 'desc' }, take: 20 },
        absences: { orderBy: { date: 'desc' }, take: 20 },
        disciplines: true,
        echeances: true,
        paiements: true,
      },
    });
    if (!eleve) throw new ApiError(404, 'Élève introuvable.');
    res.json(eleve);
  })
);

// POST /api/eleves — création + inscription immédiate si classeId fourni
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = eleveSchema.parse(req.body);
    const matricule = await genererMatricule();

    const eleve = await prisma.eleve.create({
      data: {
        matricule,
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        lieuNaissance: data.lieuNaissance,
        sexe: data.sexe,
        nationalite: data.nationalite,
        adresse: data.adresse,
        groupeSanguin: data.groupeSanguin,
        allergies: data.allergies,
        contactUrgenceNom: data.contactUrgenceNom,
        contactUrgenceTelephone: data.contactUrgenceTelephone,
        ...(data.classeId &&
          data.anneeScolaireId && {
            inscriptions: {
              create: { classeId: data.classeId, anneeScolaireId: data.anneeScolaireId },
            },
          }),
      },
      include: { inscriptions: true },
    });

    res.status(201).json(eleve);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const data = eleveSchema.partial().parse(req.body);
    const { classeId, anneeScolaireId, ...eleveData } = data;
    const eleve = await prisma.eleve.update({ where: { id: req.params.id }, data: eleveData });
    res.json(eleve);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    // Désactivation logique plutôt que suppression physique (traçabilité MENA/archives).
    await prisma.eleve.update({ where: { id: req.params.id }, data: { actif: false } });
    res.status(204).send();
  })
);

// POST /api/eleves/:id/inscrire — inscrire/réinscrire un élève dans une classe
const inscrireSchema = z.object({ classeId: z.string().uuid(), anneeScolaireId: z.string().uuid() });
router.post(
  '/:id/inscrire',
  asyncHandler(async (req, res) => {
    const { classeId, anneeScolaireId } = inscrireSchema.parse(req.body);
    const inscription = await prisma.inscription.upsert({
      where: { eleveId_anneeScolaireId: { eleveId: req.params.id, anneeScolaireId } },
      create: { eleveId: req.params.id, classeId, anneeScolaireId },
      update: { classeId },
    });
    res.status(201).json(inscription);
  })
);

export default router;
