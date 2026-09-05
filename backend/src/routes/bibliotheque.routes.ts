import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('bibliotheque'));

const DUREE_EMPRUNT_JOURS = 14;
const PENALITE_PAR_JOUR = 100; // FCFA

// --- Catalogue ---
const livreSchema = z.object({
  isbn: z.string().optional(),
  titre: z.string().min(1),
  auteur: z.string().min(1),
  editeur: z.string().optional(),
  categorie: z.string().optional(),
  anneeEdition: z.number().int().optional(),
  nombreExemplaires: z.number().int().min(1).optional(),
});
router.get(
  '/livres',
  asyncHandler(async (req, res) => {
    const q = req.query.q as string | undefined;
    res.json(
      await prisma.livre.findMany({
        where: q
          ? { OR: [{ titre: { contains: q, mode: 'insensitive' } }, { auteur: { contains: q, mode: 'insensitive' } }] }
          : undefined,
        orderBy: { titre: 'asc' },
      })
    );
  })
);
router.post(
  '/livres',
  asyncHandler(async (req, res) => {
    const data = livreSchema.parse(req.body);
    const livre = await prisma.livre.create({
      data: { ...data, exemplairesDisponibles: data.nombreExemplaires ?? 1 },
    });
    res.status(201).json(livre);
  })
);

// --- Emprunts ---
const empruntSchema = z.object({
  livreId: z.string().uuid(),
  eleveId: z.string().uuid().optional(),
  carteLecteurId: z.string().uuid().optional(),
});
router.post(
  '/emprunts',
  asyncHandler(async (req, res) => {
    const data = empruntSchema.parse(req.body);

    const emprunt = await prisma.$transaction(async (tx) => {
      const livre = await tx.livre.findUnique({ where: { id: data.livreId } });
      if (!livre) throw new ApiError(404, 'Livre introuvable.');
      if (livre.exemplairesDisponibles <= 0) throw new ApiError(409, 'Aucun exemplaire disponible pour ce livre.');

      await tx.livre.update({ where: { id: data.livreId }, data: { exemplairesDisponibles: { decrement: 1 } } });

      const dateRetourPrevue = new Date();
      dateRetourPrevue.setDate(dateRetourPrevue.getDate() + DUREE_EMPRUNT_JOURS);

      return tx.emprunt.create({ data: { ...data, dateRetourPrevue } });
    });

    res.status(201).json(emprunt);
  })
);

router.post(
  '/emprunts/:id/retour',
  asyncHandler(async (req, res) => {
    const emprunt = await prisma.emprunt.findUnique({ where: { id: req.params.id } });
    if (!emprunt) throw new ApiError(404, 'Emprunt introuvable.');
    if (emprunt.statut !== 'En cours') throw new ApiError(400, 'Cet emprunt a déjà été clôturé.');

    const maintenant = new Date();
    const joursRetard = Math.max(
      0,
      Math.ceil((maintenant.getTime() - emprunt.dateRetourPrevue.getTime()) / (1000 * 60 * 60 * 24))
    );
    const penalite = joursRetard * PENALITE_PAR_JOUR;

    const [updated] = await prisma.$transaction([
      prisma.emprunt.update({
        where: { id: req.params.id },
        data: { dateRetourEffective: maintenant, statut: joursRetard > 0 ? 'En retard' : 'Retourné', penalite },
      }),
      prisma.livre.update({ where: { id: emprunt.livreId }, data: { exemplairesDisponibles: { increment: 1 } } }),
    ]);

    res.json({ ...updated, joursRetard, penalite });
  })
);

router.get(
  '/emprunts',
  asyncHandler(async (req, res) => {
    const statut = req.query.statut as string | undefined;
    const eleveId = req.query.eleveId as string | undefined;
    res.json(
      await prisma.emprunt.findMany({
        where: { ...(statut && { statut }), ...(eleveId && { eleveId }) },
        include: { livre: true, eleve: true },
        orderBy: { dateEmprunt: 'desc' },
      })
    );
  })
);

// GET /api/bibliotheque/alertes-retard — emprunts en cours dont la date de retour est dépassée
router.get(
  '/alertes-retard',
  asyncHandler(async (_req, res) => {
    res.json(
      await prisma.emprunt.findMany({
        where: { statut: 'En cours', dateRetourPrevue: { lt: new Date() } },
        include: { livre: true, eleve: true },
      })
    );
  })
);

export default router;
