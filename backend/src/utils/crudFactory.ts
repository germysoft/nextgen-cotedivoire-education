import { Router } from 'express';
import { ZodSchema } from 'zod';
import { asyncHandler, ApiError } from './asyncHandler';
import { prisma } from '../lib/prisma';

/**
 * Fabrique un routeur CRUD (list/get/create/update/delete) pour un modèle
 * Prisma donné. Utilisée pour donner à CHAQUE entité du schéma un vrai
 * endpoint REST fonctionnel, y compris les modules périphériques qui n'ont
 * pas (encore) de logique métier sur-mesure. Les modules cœur (auth, élèves,
 * notes, finance, examens...) surchargent ou complètent ces routes avec des
 * contrôleurs dédiés — voir src/routes/*.
 *
 * @param modelName nom du modèle Prisma tel qu'exposé par le client (ex: 'eleve')
 * @param options.createSchema schéma Zod de validation à la création
 * @param options.updateSchema schéma Zod de validation à la mise à jour (partial)
 * @param options.searchableFields champs texte sur lesquels le paramètre ?q= effectue une recherche
 * @param options.defaultInclude relations à inclure par défaut dans les réponses
 */
export function createCrudRouter(
  modelName: keyof typeof prisma,
  options: {
    createSchema?: ZodSchema;
    updateSchema?: ZodSchema;
    searchableFields?: string[];
    defaultInclude?: Record<string, boolean>;
  } = {}
): Router {
  const router = Router();
  // Le délégué Prisma correspondant (prisma.eleve, prisma.note, ...)
  const model = prisma[modelName] as any;

  if (!model || typeof model.findMany !== 'function') {
    throw new Error(`Modèle Prisma inconnu pour createCrudRouter: ${String(modelName)}`);
  }

  // GET /  — liste paginée + recherche simple + tri
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
      const pageSize = Math.min(200, Math.max(1, parseInt((req.query.pageSize as string) || '25', 10)));
      const q = (req.query.q as string) || undefined;
      const orderByField = (req.query.orderBy as string) || undefined;
      const orderDir = (req.query.orderDir as string) === 'desc' ? 'desc' : 'asc';

      const where =
        q && options.searchableFields?.length
          ? {
              OR: options.searchableFields.map((field) => ({
                [field]: { contains: q, mode: 'insensitive' },
              })),
            }
          : undefined;

      const [items, total] = await Promise.all([
        model.findMany({
          where,
          include: options.defaultInclude,
          orderBy: orderByField ? { [orderByField]: orderDir } : undefined,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        model.count({ where }),
      ]);

      res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    })
  );

  // GET /:id
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const item = await model.findUnique({
        where: { id: req.params.id },
        include: options.defaultInclude,
      });
      if (!item) throw new ApiError(404, 'Ressource introuvable.');
      res.json(item);
    })
  );

  // POST /
  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const data = options.createSchema ? options.createSchema.parse(req.body) : req.body;
      const created = await model.create({ data });
      res.status(201).json(created);
    })
  );

  // PUT /:id
  router.put(
    '/:id',
    asyncHandler(async (req, res) => {
      const data = options.updateSchema ? options.updateSchema.parse(req.body) : req.body;
      const updated = await model.update({ where: { id: req.params.id }, data });
      res.json(updated);
    })
  );

  // DELETE /:id
  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await model.delete({ where: { id: req.params.id } });
      res.status(204).send();
    })
  );

  return router;
}
