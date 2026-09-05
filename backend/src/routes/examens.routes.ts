import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('examens'));

const examenSchema = z.object({
  nom: z.string().min(1),
  type: z.string(),
  anneeScolaire: z.string(),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date(),
  parametres: z.record(z.any()).optional(),
});
router.post(
  '/',
  asyncHandler(async (req, res) => {
    res.status(201).json(await prisma.examen.create({ data: examenSchema.parse(req.body) }));
  })
);
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await prisma.examen.findMany({ orderBy: { dateDebut: 'desc' } }));
  })
);
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const examen = await prisma.examen.findUnique({
      where: { id: req.params.id },
      include: { candidats: { include: { eleve: true } }, salles: { include: { salle: true } }, jurys: true },
    });
    if (!examen) throw new ApiError(404, 'Examen introuvable.');
    res.json(examen);
  })
);

// --- Candidats ---
const candidatSchema = z.object({ eleveId: z.string().uuid().optional(), numeroTable: z.string().optional() });
router.post(
  '/:id/candidats',
  asyncHandler(async (req, res) => {
    const data = candidatSchema.parse(req.body);
    res.status(201).json(await prisma.candidatExamen.create({ data: { ...data, examenId: req.params.id } }));
  })
);

// --- Convocations : génération avec code de vérification unique (vérifiable publiquement) ---
const convocationSchema = z.object({ candidatId: z.string().uuid(), dateEpreuve: z.coerce.date(), lieu: z.string().optional() });
router.post(
  '/:id/convocations',
  asyncHandler(async (req, res) => {
    const data = convocationSchema.parse(req.body);
    const convocation = await prisma.convocationExamen.create({
      data: { ...data, examenId: req.params.id },
    });
    await prisma.candidatExamen.update({ where: { id: data.candidatId }, data: { statut: 'Convoqué' } });
    res.status(201).json(convocation);
  })
);

// GET public (pas de RBAC) : vérification d'une convocation par son code
export const verifierConvocation = asyncHandler(async (req, res) => {
  const convocation = await prisma.convocationExamen.findUnique({
    where: { codeVerification: req.params.code },
    include: { candidat: { include: { eleve: true } }, examen: true },
  });
  if (!convocation) throw new ApiError(404, 'Convocation introuvable ou code invalide.');
  res.json({
    valide: true,
    candidat: convocation.candidat.eleve ? `${convocation.candidat.eleve.nom} ${convocation.candidat.eleve.prenom}` : null,
    examen: convocation.examen.nom,
    dateEpreuve: convocation.dateEpreuve,
    lieu: convocation.lieu,
  });
});

// --- Notes d'examen ---
const noteExamenSchema = z.object({ candidatId: z.string().uuid(), epreuve: z.string(), valeur: z.number(), coefficient: z.number().optional() });
router.post(
  '/:id/notes',
  asyncHandler(async (req, res) => {
    const data = noteExamenSchema.parse(req.body);
    res.status(201).json(await prisma.noteExamen.create({ data: { ...data, examenId: req.params.id } }));
  })
);

// --- Délibération : calcule la moyenne pondérée et la décision d'admission ---
const SEUIL_ADMISSION = 10;
router.post(
  '/:id/deliberer',
  asyncHandler(async (req, res) => {
    const candidats = await prisma.candidatExamen.findMany({
      where: { examenId: req.params.id },
      include: { notes: true },
    });

    const resultats = await Promise.all(
      candidats.map(async (c) => {
        const totalPoids = c.notes.reduce((s, n) => s + n.coefficient, 0) || 1;
        const moyenne = c.notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / totalPoids;
        const decision = moyenne >= SEUIL_ADMISSION ? 'Admis' : moyenne >= SEUIL_ADMISSION - 2 ? 'Repêchage' : 'Ajourné';
        const mention =
          moyenne >= 16 ? 'Très Bien' : moyenne >= 14 ? 'Bien' : moyenne >= 12 ? 'Assez Bien' : moyenne >= 10 ? 'Passable' : undefined;

        return prisma.resultatExamen.upsert({
          where: { candidatId: c.id },
          create: {
            examenId: req.params.id,
            candidatId: c.id,
            eleveId: c.eleveId,
            moyenneGenerale: Number(moyenne.toFixed(2)),
            mention,
            decision,
          },
          update: { moyenneGenerale: Number(moyenne.toFixed(2)), mention, decision },
        });
      })
    );

    await prisma.examen.update({ where: { id: req.params.id }, data: { statut: 'Délibérations' } });
    res.json({ traites: resultats.length, resultats });
  })
);

router.get(
  '/:id/resultats',
  asyncHandler(async (req, res) => {
    res.json(
      await prisma.resultatExamen.findMany({
        where: { examenId: req.params.id },
        include: { eleve: true },
        orderBy: { moyenneGenerale: 'desc' },
      })
    );
  })
);

export default router;
