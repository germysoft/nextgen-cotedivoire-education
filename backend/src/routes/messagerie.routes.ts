import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(authenticate);

const messageSchema = z.object({
  destinataires: z.array(z.string()).min(1), // ids utilisateurs, ou "classe:<id>", "role:<role>"
  sujet: z.string().optional(),
  contenu: z.string().min(1),
  canal: z.enum(['interne', 'email', 'sms']).optional(),
});

router.post(
  '/messages',
  asyncHandler(async (req, res) => {
    const data = messageSchema.parse(req.body);
    const message = await prisma.message.create({
      data: { ...data, expediteurId: req.user!.id },
    });
    res.status(201).json(message);
  })
);

router.get(
  '/messages',
  asyncHandler(async (req, res) => {
    res.json(
      await prisma.message.findMany({
        where: { expediteurId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
    );
  })
);

router.get(
  '/notifications',
  asyncHandler(async (req, res) => {
    res.json(
      await prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
    );
  })
);

router.put(
  '/notifications/:id/lue',
  asyncHandler(async (req, res) => {
    const notif = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notif || notif.userId !== req.user!.id) throw new ApiError(404, 'Notification introuvable.');
    res.json(await prisma.notification.update({ where: { id: req.params.id }, data: { lue: true } }));
  })
);

// --- Campagnes SMS/Email : nécessitent le module messaging (staff uniquement) ---
const campagneSchema = z.object({
  contenu: z.string().min(1),
  destinataires: z.array(z.string()).min(1),
});
router.post(
  '/sms',
  requireModule('messaging'),
  asyncHandler(async (req, res) => {
    const data = campagneSchema.parse(req.body);
    // L'envoi effectif nécessite un fournisseur SMS tiers (Orange/MTN API, Twilio...) :
    // à brancher ici. On persiste la campagne en "Envoyée" une fois le fournisseur intégré.
    const campagne = await prisma.campagneSMS.create({
      data: { ...data, statut: 'Brouillon', nombreEnvoyes: 0 },
    });
    res.status(201).json(campagne);
  })
);

const campagneEmailSchema = z.object({
  objet: z.string().min(1),
  contenuHtml: z.string().min(1),
  destinataires: z.array(z.string()).min(1),
});
router.post(
  '/emails',
  requireModule('messaging'),
  asyncHandler(async (req, res) => {
    const data = campagneEmailSchema.parse(req.body);
    // Idem SMS : brancher un fournisseur SMTP/transactionnel (SendGrid, SES...) ici.
    const campagne = await prisma.campagneEmail.create({ data: { ...data, statut: 'Brouillon' } });
    res.status(201).json(campagne);
  })
);

// --- Forum ---
router.get(
  '/forum',
  asyncHandler(async (_req, res) => {
    res.json(await prisma.forumPost.findMany({ include: { reponses: true }, orderBy: { createdAt: 'desc' } }));
  })
);
router.post(
  '/forum',
  asyncHandler(async (req, res) => {
    const data = z.object({ titre: z.string(), contenu: z.string(), categorie: z.string().optional() }).parse(req.body);
    res.status(201).json(await prisma.forumPost.create({ data: { ...data, auteurId: req.user!.id } }));
  })
);

export default router;
