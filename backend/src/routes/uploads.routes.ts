import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../lib/blobStorage';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 Mo, largement suffisant pour une photo ou un PDF de bulletin
});

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOCUMENT_TYPES = ['application/pdf'];

function extensionOf(mime: string): string {
  return { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' }[mime] ?? 'bin';
}

// POST /api/uploads/photo-eleve/:eleveId — remplace la photo d'un élève
router.post(
  '/photo-eleve/:eleveId',
  requireModule('scolarite'),
  upload.single('photo'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'Aucun fichier reçu (champ attendu : "photo").');
    if (!PHOTO_TYPES.includes(req.file.mimetype)) throw new ApiError(400, 'Format non supporté (jpg, png, webp).');

    const { url } = await uploadFile('photos', req.file.buffer, req.file.mimetype, extensionOf(req.file.mimetype));
    const eleve = await prisma.eleve.update({ where: { id: req.params.eleveId }, data: { photo: url } });
    res.json({ photo: eleve.photo });
  })
);

// POST /api/uploads/photo-personnel/:personnelId — remplace la photo d'un membre du personnel
router.post(
  '/photo-personnel/:personnelId',
  requireModule('rh'),
  upload.single('photo'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'Aucun fichier reçu (champ attendu : "photo").');
    if (!PHOTO_TYPES.includes(req.file.mimetype)) throw new ApiError(400, 'Format non supporté (jpg, png, webp).');

    const { url } = await uploadFile('photos', req.file.buffer, req.file.mimetype, extensionOf(req.file.mimetype));
    const personnel = await prisma.personnel.update({ where: { id: req.params.personnelId }, data: { photo: url } });
    res.json({ photo: personnel.photo });
  })
);

// POST /api/uploads/bulletin/:bulletinId — archive le PDF généré côté client (jsPDF) pour un bulletin existant
router.post(
  '/bulletin/:bulletinId',
  requireModule('notes'),
  upload.single('document'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'Aucun fichier reçu (champ attendu : "document").');
    if (!DOCUMENT_TYPES.includes(req.file.mimetype)) throw new ApiError(400, 'Seul le PDF est accepté.');

    const { url } = await uploadFile('documents', req.file.buffer, req.file.mimetype, 'pdf');
    const bulletin = await prisma.bulletin.update({ where: { id: req.params.bulletinId }, data: { documentUrl: url } });
    res.json({ documentUrl: bulletin.documentUrl });
  })
);

export default router;
