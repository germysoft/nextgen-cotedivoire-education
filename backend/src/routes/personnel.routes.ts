import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('rh'));

async function genererMatriculePersonnel(): Promise<string> {
  const annee = new Date().getFullYear();
  const count = await prisma.personnel.count({ where: { matricule: { startsWith: `PE${annee}` } } });
  return `PE${annee}-${String(count + 1).padStart(4, '0')}`;
}

const personnelSchema = z.object({
  civilite: z.string(),
  nom: z.string().min(1),
  prenom: z.string().min(1),
  dateNaissance: z.coerce.date(),
  sexe: z.enum(['Masculin', 'Féminin']),
  telephone: z.string(),
  email: z.string().email(),
  poste: z.string(),
  departement: z.string().optional(),
  categoriePersonnel: z.enum(['Enseignant', 'Administratif', 'Technique', 'Direction', 'Médical', 'Surveillance']),
  statut: z.enum(['Permanent', 'Vacataire', 'Contractuel', 'Stagiaire', 'Intérimaire']),
  typeContrat: z.string().optional(),
  dateEmbauche: z.coerce.date(),
  salaireBase: z.number().optional(),
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const pageSize = Math.min(200, Math.max(1, parseInt((req.query.pageSize as string) || '25', 10)));
    const q = req.query.q as string | undefined;
    const categorie = req.query.categoriePersonnel as string | undefined;

    const where: any = {
      ...(q && {
        OR: [
          { nom: { contains: q, mode: 'insensitive' } },
          { prenom: { contains: q, mode: 'insensitive' } },
          { matricule: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(categorie && { categoriePersonnel: categorie }),
    };

    const [items, total] = await Promise.all([
      prisma.personnel.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { nom: 'asc' },
        include: { affectations: { include: { matiere: true, classe: true } } },
      }),
      prisma.personnel.count({ where }),
    ]);
    res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const personnel = await prisma.personnel.findUnique({
      where: { id: req.params.id },
      include: { diplomes: true, contrats: true, conges: true, formations: true, affectations: { include: { classe: true, matiere: true } } },
    });
    if (!personnel) throw new ApiError(404, 'Membre du personnel introuvable.');
    res.json(personnel);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = personnelSchema.parse(req.body);
    const matricule = await genererMatriculePersonnel();
    const personnel = await prisma.personnel.create({ data: { ...data, matricule } });
    res.status(201).json(personnel);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const data = personnelSchema.partial().parse(req.body);
    const personnel = await prisma.personnel.update({ where: { id: req.params.id }, data });
    res.json(personnel);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await prisma.personnel.update({ where: { id: req.params.id }, data: { actif: false } });
    res.status(204).send();
  })
);

// --- Congés ---
const congeSchema = z.object({
  personnelId: z.string().uuid(),
  type: z.string(),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date(),
  motif: z.string().optional(),
  remplacantId: z.string().uuid().optional(),
  contact: z.string().optional(),
});
router.post(
  '/conges',
  asyncHandler(async (req, res) => {
    const data = congeSchema.parse(req.body);
    const nombreJours = Math.max(
      1,
      Math.ceil((data.dateFin.getTime() - data.dateDebut.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    const conge = await prisma.conge.create({ data: { ...data, nombreJours } });
    res.status(201).json(conge);
  })
);
router.put(
  '/conges/:id/statut',
  asyncHandler(async (req, res) => {
    const { statut, valideParId } = z
      .object({ statut: z.enum(['En attente', 'Validé', 'Refusé']), valideParId: z.string().uuid().optional() })
      .parse(req.body);
    const conge = await prisma.conge.update({ where: { id: req.params.id }, data: { statut, valideParId } });

    // Décrémente le solde de congés si validé.
    if (statut === 'Validé') {
      await prisma.personnel.update({
        where: { id: conge.personnelId },
        data: { soldeCongesAnnuels: { decrement: conge.nombreJours } },
      });
    }
    res.json(conge);
  })
);
router.get(
  '/conges/all',
  asyncHandler(async (req, res) => {
    const conges = await prisma.conge.findMany({ include: { personnel: true, remplacant: true }, orderBy: { createdAt: 'desc' } });
    res.json(conges);
  })
);

// --- Pointage ---
const pointageSchema = z.object({
  personnelId: z.string().uuid(),
  date: z.coerce.date(),
  heureArrivee: z.coerce.date().optional(),
  heureDepart: z.coerce.date().optional(),
  statut: z.enum(['Présent', 'Absent', 'Retard', 'Congé']).optional(),
});
router.post(
  '/pointage',
  asyncHandler(async (req, res) => {
    const data = pointageSchema.parse(req.body);
    const pointage = await prisma.pointage.create({ data });
    res.status(201).json(pointage);
  })
);
/**
 * Liste des pointages (le chemin est préfixé `/all` comme pour les congés,
 * afin de ne pas être capté par la route `GET /:id` du personnel).
 * Filtres : ?date=YYYY-MM-DD (journée complète) et ?personnelId=.
 */
router.get(
  '/pointage/all',
  asyncHandler(async (req, res) => {
    const dateStr = req.query.date as string | undefined;
    const personnelId = req.query.personnelId as string | undefined;

    let dateFilter: { gte: Date; lt: Date } | undefined;
    if (dateStr) {
      const debut = new Date(`${dateStr}T00:00:00.000Z`);
      const fin = new Date(debut);
      fin.setUTCDate(fin.getUTCDate() + 1);
      dateFilter = { gte: debut, lt: fin };
    }

    const pointages = await prisma.pointage.findMany({
      where: { ...(personnelId && { personnelId }), ...(dateFilter && { date: dateFilter }) },
      include: { personnel: true },
      orderBy: [{ date: 'desc' }, { heureArrivee: 'asc' }],
      take: 500,
    });
    res.json(pointages);
  })
);
router.put(
  '/pointage/:id',
  asyncHandler(async (req, res) => {
    const data = pointageSchema.partial().parse(req.body);
    res.json(await prisma.pointage.update({ where: { id: req.params.id }, data }));
  })
);
router.delete(
  '/pointage/:id',
  asyncHandler(async (req, res) => {
    await prisma.pointage.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);


// --- Évaluations ---
const evaluationSchema = z.object({
  personnelId: z.string().uuid(),
  evaluateurId: z.string().uuid(),
  periode: z.string(),
  dateEvaluation: z.coerce.date(),
  typeEvaluation: z.enum(['Annuelle', 'Semestrielle', 'Trimestrielle', 'Probatoire']),
  criteres: z.array(z.object({ categorie: z.string(), critere: z.string(), note: z.number(), poids: z.number() })),
  appreciationGenerale: z.string().optional(),
});
router.post(
  '/evaluations',
  asyncHandler(async (req, res) => {
    const data = evaluationSchema.parse(req.body);
    // Note globale = moyenne pondérée des critères.
    const totalPoids = data.criteres.reduce((s, c) => s + c.poids, 0) || 1;
    const noteGlobale = data.criteres.reduce((s, c) => s + c.note * c.poids, 0) / totalPoids;
    const evaluation = await prisma.evaluation.create({
      data: { ...data, criteres: data.criteres as any, noteGlobale, statut: 'Validée' },
    });
    res.status(201).json(evaluation);
  })
);

export default router;
