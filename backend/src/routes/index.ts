import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireModule, requireRole } from '../middleware/rbac';
import { buildGenericRouters } from './generic.routes';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

import authRoutes from './auth.routes';
import publicRoutes from './public.routes';
import elevesRoutes from './eleves.routes';
import personnelRoutes from './personnel.routes';
import pedagogieRoutes from './pedagogie.routes';
import notesRoutes from './notes.routes';
import financeRoutes from './finance.routes';
import bibliothequeRoutes from './bibliotheque.routes';
import infirmerieRoutes from './infirmerie.routes';
import messagerieRoutes from './messagerie.routes';
import portailParentsRoutes from './portail-parents.routes';
import examensRoutes from './examens.routes';
import uploadsRoutes from './uploads.routes';

export const apiRouter = Router();

// --- Routes publiques (sans authentification) ---
apiRouter.use('/auth', authRoutes);
apiRouter.use('/public', publicRoutes);

// --- Tout le reste exige un utilisateur authentifié ---
apiRouter.use(authenticate);

// Utilitaire transverse : de nombreux formulaires (créer une classe, une
// échéance...) ont besoin de l'année scolaire active, indépendamment du
// module auquel appartient l'utilisateur — pas de garde de module ici.
apiRouter.get(
  '/meta/annee-scolaire-active',
  asyncHandler(async (_req, res) => {
    const annee = await prisma.anneeScolaire.findFirst({ where: { active: true }, include: { periodes: true } });
    if (!annee) throw new ApiError(404, "Aucune année scolaire active n'est configurée.");
    res.json(annee);
  })
);

apiRouter.use('/eleves', elevesRoutes);
apiRouter.use('/personnel', personnelRoutes);
apiRouter.use('/pedagogie', pedagogieRoutes);
apiRouter.use('/notes', notesRoutes);
apiRouter.use('/finance', financeRoutes);
apiRouter.use('/bibliotheque', bibliothequeRoutes);
apiRouter.use('/infirmerie', infirmerieRoutes);
apiRouter.use('/messagerie', messagerieRoutes);
apiRouter.use('/portail-parents', portailParentsRoutes);
apiRouter.use('/examens', examensRoutes);
apiRouter.use('/uploads', uploadsRoutes);

// --- Ressources génériques : chacune montée derrière le contrôle du module concerné ---
for (const resource of buildGenericRouters()) {
  const extraGuards =
    resource.path.includes('audit-logs') || resource.path.includes('api-keys') ? [requireRole('admin')] : [];
  apiRouter.use(resource.path, requireModule(resource.module), ...extraGuards, resource.router);
}

export default apiRouter;
