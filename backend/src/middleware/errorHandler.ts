import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/asyncHandler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Données invalides.', details: err.flatten() });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Valeur en conflit avec une contrainte d'unicité (${(err.meta?.target as string[])?.join(', ')}).`,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Ressource introuvable.' });
    }
    if (err.code === 'P2003') {
      return res.status(409).json({ error: 'Référence invalide vers une ressource liée.' });
    }
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: 'Erreur interne du serveur.' });
}
