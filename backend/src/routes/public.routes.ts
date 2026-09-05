import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { verifierConvocation } from './examens.routes';

const router = Router();

// GET /api/public/convocations/:code — vérification publique d'une convocation d'examen (QR code)
router.get('/convocations/:code', verifierConvocation);

// GET /api/public/reunions/:code — vérification publique d'un compte-rendu de réunion signé
router.get(
  '/reunions/:code',
  asyncHandler(async (req, res) => {
    const reunion = await prisma.reunionPartenariat.findUnique({ where: { codeVerification: req.params.code } });
    if (!reunion) throw new ApiError(404, 'Document introuvable ou code invalide.');
    res.json({
      valide: true,
      titre: reunion.titre,
      date: reunion.date,
      signatures: reunion.signatures,
    });
  })
);

export default router;
