import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('infirmerie'));

// Liste de toutes les fiches (avec l'élève) — nécessaire à la page « Fiches de santé ».
router.get(
  '/fiches-sante',
  asyncHandler(async (_req, res) => {
    res.json(
      await prisma.ficheSante.findMany({
        include: { eleve: { select: { id: true, nom: true, prenom: true, matricule: true } } },
        orderBy: { updatedAt: 'desc' },
      })
    );
  })
);

router.get(
  '/fiches-sante/:eleveId',
  asyncHandler(async (req, res) => {
    const fiche = await prisma.ficheSante.findUnique({ where: { eleveId: req.params.eleveId } });
    res.json(fiche);
  })
);

const ficheSchema = z.object({
  eleveId: z.string().uuid(),
  groupeSanguin: z.string().optional(),
  allergies: z.string().optional(),
  maladiesChroniques: z.string().optional(),
  traitementEnCours: z.string().optional(),
  vaccinationsAJour: z.boolean().optional(),
  contactMedecin: z.string().optional(),
  observations: z.string().optional(),
});
router.put(
  '/fiches-sante/:eleveId',
  asyncHandler(async (req, res) => {
    const data = ficheSchema.omit({ eleveId: true }).parse(req.body);
    const fiche = await prisma.ficheSante.upsert({
      where: { eleveId: req.params.eleveId },
      create: { eleveId: req.params.eleveId, ...data },
      update: data,
    });
    res.json(fiche);
  })
);

const consultationSchema = z.object({
  eleveId: z.string().uuid(),
  motif: z.string(),
  diagnostic: z.string().optional(),
  traitement: z.string().optional(),
  infirmierId: z.string().uuid().optional(),
  necessiteSuivi: z.boolean().optional(),
});
router.post(
  '/consultations',
  asyncHandler(async (req, res) => {
    res.status(201).json(await prisma.consultation.create({ data: consultationSchema.parse(req.body) }));
  })
);
router.get(
  '/consultations',
  asyncHandler(async (req, res) => {
    const eleveId = req.query.eleveId as string | undefined;
    res.json(
      await prisma.consultation.findMany({
        where: eleveId ? { eleveId } : undefined,
        include: { eleve: true, infirmier: true, ordonnances: true },
        orderBy: { date: 'desc' },
      })
    );
  })
);

const alerteSchema = z.object({
  eleveId: z.string().uuid().optional(),
  type: z.string(),
  description: z.string(),
  niveau: z.enum(['Info', 'Attention', 'Urgent']).optional(),
});
router.post(
  '/alertes',
  asyncHandler(async (req, res) => {
    res.status(201).json(await prisma.alerteMedicale.create({ data: alerteSchema.parse(req.body) }));
  })
);
router.get(
  '/alertes',
  asyncHandler(async (_req, res) => {
    res.json(await prisma.alerteMedicale.findMany({ where: { resolue: false }, orderBy: { createdAt: 'desc' } }));
  })
);

router.put(
  '/consultations/:id',
  asyncHandler(async (req, res) => {
    const data = consultationSchema.partial().parse(req.body);
    const exists = await prisma.consultation.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Consultation introuvable.');
    res.json(await prisma.consultation.update({ where: { id: req.params.id }, data }));
  })
);
router.delete(
  '/consultations/:id',
  asyncHandler(async (req, res) => {
    const exists = await prisma.consultation.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Consultation introuvable.');
    // Les ordonnances liées sont supprimées en cascade (onDelete: Cascade).
    await prisma.consultation.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);

router.put(
  '/alertes/:id',
  asyncHandler(async (req, res) => {
    const data = alerteSchema.partial().extend({ resolue: z.boolean().optional() }).parse(req.body);
    const exists = await prisma.alerteMedicale.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Alerte introuvable.');
    res.json(await prisma.alerteMedicale.update({ where: { id: req.params.id }, data }));
  })
);
router.delete(
  '/alertes/:id',
  asyncHandler(async (req, res) => {
    const exists = await prisma.alerteMedicale.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Alerte introuvable.');
    await prisma.alerteMedicale.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);

export default router;
