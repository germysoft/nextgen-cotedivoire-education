import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/asyncHandler';

/**
 * Restreint l'accès du Portail Parents/Élèves aux seules données des propres
 * enfants du parent connecté (ou à l'élève lui-même). Le staff (admin,
 * directeur, secrétaire...) passe librement — leur accès est déjà filtré par
 * requireModule('portailParents') en amont.
 *
 * Attend un paramètre de route :eleveId sur la requête.
 */
export function requireOwnChildOrStaff() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentification requise.'));

    if (req.user.role !== 'parent' && req.user.role !== 'eleve') {
      return next(); // staff : déjà filtré par requireModule en amont
    }

    const eleveId = req.params.eleveId || (req.body as any)?.eleveId;
    if (!eleveId) return next(new ApiError(400, 'Identifiant élève manquant.'));

    if (req.user.role === 'eleve') {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.eleveId !== eleveId) {
        return next(new ApiError(403, 'Vous ne pouvez consulter que vos propres données.'));
      }
      return next();
    }

    // role === 'parent'
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user?.parentId) return next(new ApiError(403, 'Profil parent introuvable.'));
    const lien = await prisma.elevePar.findFirst({ where: { parentId: user.parentId, eleveId } });
    if (!lien) return next(new ApiError(403, "Cet élève n'est pas rattaché à votre compte parent."));
    next();
  };
}
