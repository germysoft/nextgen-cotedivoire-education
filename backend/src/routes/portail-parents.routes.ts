import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { requireModule } from '../middleware/rbac';
import { requireOwnChildOrStaff } from '../middleware/ownership';

const router = Router();
router.use(authenticate, requireModule('portailParents'));

// GET /api/portail-parents/enfants — liste des enfants du parent connecté
router.get(
  '/enfants',
  asyncHandler(async (req, res) => {
    if (req.user!.role !== 'parent') {
      return res.json(await prisma.eleve.findMany({ take: 50 })); // vue staff
    }
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    const liens = await prisma.elevePar.findMany({
      where: { parentId: user?.parentId ?? '' },
      include: { eleve: { include: { inscriptions: { include: { classe: true }, take: 1, orderBy: { dateInscription: 'desc' } } } } },
    });
    res.json(liens.map((l) => l.eleve));
  })
);

router.get(
  '/notes/:eleveId',
  requireOwnChildOrStaff(),
  asyncHandler(async (req, res) => {
    res.json(
      await prisma.note.findMany({
        where: { eleveId: req.params.eleveId },
        include: { matiere: true },
        orderBy: { dateEvaluation: 'desc' },
      })
    );
  })
);

router.get(
  '/absences/:eleveId',
  requireOwnChildOrStaff(),
  asyncHandler(async (req, res) => {
    res.json(await prisma.absence.findMany({ where: { eleveId: req.params.eleveId }, orderBy: { date: 'desc' } }));
  })
);

router.get(
  '/paiements/:eleveId',
  requireOwnChildOrStaff(),
  asyncHandler(async (req, res) => {
    res.json(
      await prisma.echeancePaiement.findMany({
        where: { eleveId: req.params.eleveId },
        include: { paiements: true },
        orderBy: { dateEcheance: 'asc' },
      })
    );
  })
);

router.get(
  '/bulletins/:eleveId',
  requireOwnChildOrStaff(),
  asyncHandler(async (req, res) => {
    res.json(await prisma.bulletin.findMany({ where: { eleveId: req.params.eleveId }, orderBy: { genereLe: 'desc' } }));
  })
);

const chatSchema = z.object({ eleveId: z.string().uuid().optional(), contenu: z.string().min(1) });
router.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const { contenu } = chatSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user?.parentId) return res.status(403).json({ error: 'Profil parent requis.' });
    const message = await prisma.chatMessage.create({
      data: { parentId: user.parentId, contenu, envoyePar: 'parent' },
    });
    res.status(201).json(message);
  })
);
router.get(
  '/chat',
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user?.parentId) return res.json([]);
    res.json(await prisma.chatMessage.findMany({ where: { parentId: user.parentId }, orderBy: { createdAt: 'asc' } }));
  })
);

export default router;
