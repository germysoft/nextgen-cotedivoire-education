import { Router } from 'express';
import { ZodSchema } from 'zod';
import { asyncHandler, ApiError } from './asyncHandler';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';


const RESERVED_QUERY_PARAMS = new Set(['page', 'pageSize', 'q', 'orderBy', 'orderDir']);

/**
 * Construit des filtres d'égalité à partir des paramètres de requête
 * (ex. ?eleveId=...&justifiee=true). Seuls les champs SCALAIRES réellement
 * présents dans le modèle sont acceptés (on lit le DMMF de Prisma), et la
 * valeur est convertie vers le bon type — un paramètre inconnu est ignoré
 * plutôt que de provoquer une erreur ou d'ouvrir une injection de filtre.
 */
function buildFieldFilters(modelName: string, query: Record<string, unknown>): Record<string, unknown> {
  const filters: Record<string, unknown> = {};
  try {
    const dmmfModels = ((Prisma as any).dmmf?.datamodel?.models ?? []) as Array<{ name: string; fields: Array<{ name: string; kind: string; type: string }> }>;
    const wanted = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const model = dmmfModels.find((m) => m.name === wanted);
    if (!model) return filters;

    for (const [key, raw] of Object.entries(query)) {
      if (RESERVED_QUERY_PARAMS.has(key) || typeof raw !== 'string' || raw === '') continue;
      const field = model.fields.find((f) => f.name === key && (f.kind === 'scalar' || f.kind === 'enum'));
      if (!field) continue;
      if (field.type === 'Boolean') filters[key] = raw === 'true';
      else if (field.type === 'Int' || field.type === 'Float') {
        const n = Number(raw);
        if (!Number.isNaN(n)) filters[key] = n;
      } else if (field.type === 'DateTime') {
        const d = new Date(raw);
        if (!Number.isNaN(d.getTime())) filters[key] = d;
      } else filters[key] = raw;
    }
  } catch {
    // DMMF indisponible : on retombe sur "aucun filtre" plutôt que de casser la liste.
  }
  return filters;
}

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
      const pageSize = Math.min(1000, Math.max(1, parseInt((req.query.pageSize as string) || '25', 10)));
      const q = (req.query.q as string) || undefined;
      const orderByField = (req.query.orderBy as string) || undefined;
      const orderDir = (req.query.orderDir as string) === 'desc' ? 'desc' : 'asc';

      const fieldFilters = buildFieldFilters(String(modelName), req.query as Record<string, unknown>);
      const searchClause =
        q && options.searchableFields?.length
          ? {
              OR: options.searchableFields.map((field) => ({
                [field]: { contains: q, mode: 'insensitive' },
              })),
            }
          : {};
      const merged = { ...fieldFilters, ...searchClause };
      const where = Object.keys(merged).length > 0 ? merged : undefined;

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
