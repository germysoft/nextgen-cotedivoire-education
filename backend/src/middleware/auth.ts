import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import { UserRole } from '../lib/permissions';
import { ApiError } from '../utils/asyncHandler';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentification requise.'));
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(new ApiError(401, 'Token invalide ou expiré.'));
  }
}

/** Variante tolérante : n'échoue pas si le token est absent (routes publiques enrichies). */
export function authenticateOptional(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = verifyAccessToken(header.slice('Bearer '.length));
      req.user = { id: payload.sub, role: payload.role, email: payload.email };
    } catch {
      // ignoré : on continue sans utilisateur authentifié
    }
  }
  next();
}
