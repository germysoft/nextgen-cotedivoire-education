import jwt from 'jsonwebtoken';
import { UserRole } from './permissions';

export interface AccessTokenPayload {
  sub: string; // userId
  role: UserRole;
  email: string;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  // On échoue vite et fort plutôt que de signer des tokens avec un secret vide.
  throw new Error(
    'JWT_ACCESS_SECRET et JWT_REFRESH_SECRET doivent être définis (voir .env.example).'
  );
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string };
}
