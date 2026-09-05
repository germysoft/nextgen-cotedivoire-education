import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('pedagogie'));

// --- Classes ---
const classeSchema = z.object({
  nom: z.string().min(1),
  niveau: z.string(),
  cycle: z.string(),
  serie: z.string().optional(),
  effectifMax: z.number().int().optional(),
  anneeScolaireId: z.string().uuid(),
  professeurPrincipalId: z.string().uuid().optional(),
  salleAttitreeId: z.string().uuid().optional(),
});

router.get(
  '/classes',
  asyncHandler(async (req, res) => {
    const anneeScolaireId = req.query.anneeScolaireId as string | undefined;
    const classes = await prisma.classe.findMany({
      where: anneeScolaireId ? { anneeScolaireId } : undefined,
      include: { _count: { select: { inscriptions: true } }, professeurPrincipal: true },
      orderBy: { nom: 'asc' },
    });
    res.json(classes);
  })
);

router.get(
  '/classes/:id',
  asyncHandler(async (req, res) => {
    const classe = await prisma.classe.findUnique({
      where: { id: req.params.id },
      include: {
        inscriptions: { include: { eleve: true } },
        cours: { include: { matiere: true, personnel: true, salle: true } },
        salleAttitree: true,
        professeurPrincipal: true,
      },
    });
    if (!classe) throw new ApiError(404, 'Classe introuvable.');
    res.json(classe);
  })
);

router.post(
  '/classes',
  asyncHandler(async (req, res) => {
    const data = classeSchema.parse(req.body);
    const classe = await prisma.classe.create({ data });
    res.status(201).json(classe);
  })
);

router.put(
  '/classes/:id',
  asyncHandler(async (req, res) => {
    const data = classeSchema.partial().parse(req.body);
    const classe = await prisma.classe.update({ where: { id: req.params.id }, data });
    res.json(classe);
  })
);

router.delete(
  '/classes/:id',
  asyncHandler(async (req, res) => {
    await prisma.classe.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// --- Matières ---
router.get(
  '/matieres',
  asyncHandler(async (_req, res) => {
    res.json(await prisma.matiere.findMany({ orderBy: { nom: 'asc' } }));
  })
);
router.post(
  '/matieres',
  asyncHandler(async (req, res) => {
    const data = z.object({ nom: z.string(), code: z.string().optional(), coefficientDefaut: z.number().optional() }).parse(req.body);
    res.status(201).json(await prisma.matiere.create({ data }));
  })
);

// --- Affectations enseignant/classe/matière ---
const affectationSchema = z.object({
  personnelId: z.string().uuid(),
  classeId: z.string().uuid(),
  matiereId: z.string().uuid(),
  coefficient: z.number().optional(),
  chargeHoraireHebdo: z.number().optional(),
});
router.post(
  '/affectations',
  asyncHandler(async (req, res) => {
    const data = affectationSchema.parse(req.body);
    res.status(201).json(await prisma.affectation.create({ data }));
  })
);
router.get(
  '/affectations',
  asyncHandler(async (req, res) => {
    const personnelId = req.query.personnelId as string | undefined;
    const classeId = req.query.classeId as string | undefined;
    res.json(
      await prisma.affectation.findMany({
        where: { ...(personnelId && { personnelId }), ...(classeId && { classeId }) },
        include: { personnel: true, classe: true, matiere: true },
      })
    );
  })
);

// --- Emploi du temps (Cours) ---
const coursSchema = z.object({
  classeId: z.string().uuid(),
  matiereId: z.string().uuid(),
  personnelId: z.string().uuid(),
  salleId: z.string().uuid().optional(),
  jourSemaine: z.number().int().min(1).max(7),
  heureDebut: z.string(),
  heureFin: z.string(),
});
router.post(
  '/emploi-du-temps',
  asyncHandler(async (req, res) => {
    const data = coursSchema.parse(req.body);

    // Vérifie les conflits d'occupation de salle et de disponibilité enseignant.
    const conflit = await prisma.cours.findFirst({
      where: {
        jourSemaine: data.jourSemaine,
        OR: [{ personnelId: data.personnelId }, ...(data.salleId ? [{ salleId: data.salleId }] : [])],
        AND: [{ heureDebut: { lt: data.heureFin } }, { heureFin: { gt: data.heureDebut } }],
      },
    });
    if (conflit) throw new ApiError(409, "Conflit d'emploi du temps : enseignant ou salle déjà occupé(e) sur ce créneau.");

    const cours = await prisma.cours.create({ data });
    res.status(201).json(cours);
  })
);
router.get(
  '/emploi-du-temps',
  asyncHandler(async (req, res) => {
    const classeId = req.query.classeId as string | undefined;
    const personnelId = req.query.personnelId as string | undefined;
    res.json(
      await prisma.cours.findMany({
        where: { ...(classeId && { classeId }), ...(personnelId && { personnelId }) },
        include: { matiere: true, personnel: true, salle: true },
        orderBy: [{ jourSemaine: 'asc' }, { heureDebut: 'asc' }],
      })
    );
  })
);

// --- Discipline ---
const disciplineSchema = z.object({
  eleveId: z.string().uuid(),
  date: z.coerce.date(),
  type: z.string(),
  motif: z.string(),
  pointsRetires: z.number().int().optional(),
  traitantParId: z.string().uuid().optional(),
});
router.post(
  '/discipline',
  asyncHandler(async (req, res) => {
    res.status(201).json(await prisma.discipline.create({ data: disciplineSchema.parse(req.body) }));
  })
);
router.get(
  '/discipline',
  asyncHandler(async (req, res) => {
    const eleveId = req.query.eleveId as string | undefined;
    res.json(
      await prisma.discipline.findMany({
        where: eleveId ? { eleveId } : undefined,
        include: { eleve: true, traitantPar: true },
        orderBy: { date: 'desc' },
      })
    );
  })
);

export default router;
