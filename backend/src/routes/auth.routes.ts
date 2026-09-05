import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../lib/permissions';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.actif) throw new ApiError(401, 'Identifiants invalides.');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new ApiError(401, 'Identifiants invalides.');

    const accessToken = signAccessToken({ sub: user.id, role: user.role as UserRole, email: user.email });
    const refreshToken = signRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
    await prisma.user.update({ where: { id: user.id }, data: { dernierLogin: new Date() } });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        doitChangerMdp: user.doitChangerMdp,
      },
    });
  })
);

const refreshSchema = z.object({ refreshToken: z.string() });

// POST /api/auth/refresh
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, 'Refresh token invalide ou expiré.');
    }

    const stored = await prisma.refreshToken.findFirst({
      where: { userId: payload.sub, tokenHash: hashToken(refreshToken), revoked: false },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new ApiError(401, 'Session expirée, veuillez vous reconnecter.');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.actif) throw new ApiError(401, 'Compte désactivé.');

    const accessToken = signAccessToken({ sub: user.id, role: user.role as UserRole, email: user.email });
    res.json({ accessToken });
  })
);

// POST /api/auth/logout
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    await prisma.refreshToken
      .updateMany({ where: { tokenHash: hashToken(refreshToken) }, data: { revoked: true } })
      .catch(() => undefined);
    res.status(204).send();
  })
);

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { personnel: true, eleve: true, parentProfil: true },
    });
    if (!user) throw new ApiError(404, 'Utilisateur introuvable.');
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  })
);

const changePasswordSchema = z.object({
  ancienMotDePasse: z.string(),
  nouveauMotDePasse: z.string().min(8),
});

// POST /api/auth/change-password
router.post(
  '/change-password',
  authenticate,
  asyncHandler(async (req, res) => {
    const { ancienMotDePasse, nouveauMotDePasse } = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new ApiError(404, 'Utilisateur introuvable.');

    const valid = await bcrypt.compare(ancienMotDePasse, user.passwordHash);
    if (!valid) throw new ApiError(401, 'Ancien mot de passe incorrect.');

    const passwordHash = await bcrypt.hash(nouveauMotDePasse, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, doitChangerMdp: false },
    });
    res.status(204).send();
  })
);

const createUserSchema = z.object({
  email: z.string().email(),
  role: z.enum([
    'admin', 'directeur', 'enseignant', 'comptable', 'secretaire',
    'surveillant', 'infirmier', 'bibliothecaire', 'parent', 'eleve',
  ]),
  motDePasseTemporaire: z.string().min(8),
  personnelId: z.string().uuid().optional(),
  eleveId: z.string().uuid().optional(),
  parentId: z.string().uuid().optional(),
});

// POST /api/auth/users — création de comptes, réservée à l'admin.
// (le paramétrage/utilisateurs du frontend appellera cette route)
router.post(
  '/users',
  authenticate,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createUserSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(data.motDePasseTemporaire, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        role: data.role,
        passwordHash,
        personnelId: data.personnelId,
        eleveId: data.eleveId,
        parentId: data.parentId,
        doitChangerMdp: true,
      },
    });
    const { passwordHash: _omit, ...safeUser } = user;
    res.status(201).json(safeUser);
  })
);

export default router;
