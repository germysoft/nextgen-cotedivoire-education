import { NextFunction, Request, Response } from 'express';
import { hasPermission, PermissionModule, UserRole } from '../lib/permissions';
import { ApiError } from '../utils/asyncHandler';

/** Exige que l'utilisateur ait accès au module donné (calqué sur le menu frontend). */
export function requireModule(module: PermissionModule) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentification requise.'));
    if (!hasPermission(req.user.role, module)) {
      return next(
        new ApiError(403, `Votre rôle (${req.user.role}) n'a pas accès au module "${module}".`)
      );
    }
    next();
  };
}

/** Exige que l'utilisateur ait l'un des rôles listés (pour des actions très sensibles). */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentification requise.'));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Action réservée à : ${roles.join(', ')}.`));
    }
    next();
  };
}
