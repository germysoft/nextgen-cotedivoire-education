import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { requireModule } from '../middleware/rbac';

const router = Router();
router.use(requireModule('notes'));

const noteSchema = z.object({
  eleveId: z.string().uuid(),
  matiereId: z.string().uuid(),
  enseignantId: z.string().uuid(),
  periodeId: z.string(),
  type: z.string(),
  valeur: z.number().min(0),
  noteMax: z.number().optional(),
  coefficient: z.number().optional(),
  dateEvaluation: z.coerce.date(),
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = noteSchema.parse(req.body);
    if (data.valeur > (data.noteMax ?? 20)) {
      throw new ApiError(400, 'La note ne peut pas dépasser le barème maximum.');
    }
    res.status(201).json(await prisma.note.create({ data }));
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { eleveId, classeId, matiereId, periodeId } = req.query as Record<string, string | undefined>;
    const where: any = {
      ...(eleveId && { eleveId }),
      ...(matiereId && { matiereId }),
      ...(periodeId && { periodeId }),
      ...(classeId && { eleve: { inscriptions: { some: { classeId } } } }),
    };
    res.json(await prisma.note.findMany({ where, include: { eleve: true, matiere: true }, orderBy: { dateEvaluation: 'desc' } }));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const data = noteSchema.partial().parse(req.body);
    res.json(await prisma.note.update({ where: { id: req.params.id }, data }));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// GET /api/notes/moyennes?classeId=&periodeId= — calcule les moyennes par élève et par matière
router.get(
  '/moyennes/:classeId/:periodeId',
  asyncHandler(async (req, res) => {
    const { classeId, periodeId } = req.params;
    const inscriptions = await prisma.inscription.findMany({ where: { classeId }, include: { eleve: true } });
    const eleveIds = inscriptions.map((i) => i.eleveId);

    const notes = await prisma.note.findMany({
      where: { eleveId: { in: eleveIds }, periodeId },
      include: { matiere: true },
    });

    const moyennesParEleve = inscriptions.map((insc) => {
      const notesEleve = notes.filter((n) => n.eleveId === insc.eleveId);
      const parMatiere = new Map<string, { total: number; poids: number; nom: string }>();
      for (const n of notesEleve) {
        const key = n.matiereId;
        const entry = parMatiere.get(key) || { total: 0, poids: 0, nom: n.matiere.nom };
        entry.total += (n.valeur / n.noteMax) * 20 * n.coefficient;
        entry.poids += n.coefficient;
        parMatiere.set(key, entry);
      }
      const matieres = Array.from(parMatiere.entries()).map(([matiereId, v]) => ({
        matiereId,
        matiere: v.nom,
        moyenne: v.poids > 0 ? Number((v.total / v.poids).toFixed(2)) : null,
      }));
      const totalPondere = matieres.reduce((s, m) => s + (m.moyenne ?? 0), 0);
      const moyenneGenerale = matieres.length > 0 ? Number((totalPondere / matieres.length).toFixed(2)) : 0;

      return {
        eleveId: insc.eleveId,
        eleve: `${insc.eleve.nom} ${insc.eleve.prenom}`,
        matieres,
        moyenneGenerale,
      };
    });

    // Classement
    const classes = [...moyennesParEleve].sort((a, b) => b.moyenneGenerale - a.moyenneGenerale);
    const avecRang = moyennesParEleve.map((m) => ({
      ...m,
      rang: classes.findIndex((c) => c.eleveId === m.eleveId) + 1,
      effectifClasse: moyennesParEleve.length,
    }));

    res.json(avecRang);
  })
);

// POST /api/notes/bulletins/generer — génère et persiste les bulletins d'une classe pour une période
const genererBulletinsSchema = z.object({
  classeId: z.string().uuid(),
  periodeId: z.string(),
  anneeScolaire: z.string(),
  templateUtilise: z.string().optional(),
});
router.post(
  '/bulletins/generer',
  asyncHandler(async (req, res) => {
    const { classeId, periodeId, anneeScolaire, templateUtilise } = genererBulletinsSchema.parse(req.body);

    // Réutilise le calcul de moyennes ci-dessus.
    const inscriptions = await prisma.inscription.findMany({ where: { classeId } });
    const eleveIds = inscriptions.map((i) => i.eleveId);
    const notes = await prisma.note.findMany({ where: { eleveId: { in: eleveIds }, periodeId }, include: { matiere: true } });

    const moyennes = eleveIds.map((eleveId) => {
      const notesEleve = notes.filter((n) => n.eleveId === eleveId);
      const parMatiere = new Map<string, { total: number; poids: number; nom: string; coefficient: number }>();
      for (const n of notesEleve) {
        const entry = parMatiere.get(n.matiereId) || { total: 0, poids: 0, nom: n.matiere.nom, coefficient: n.coefficient };
        entry.total += (n.valeur / n.noteMax) * 20 * n.coefficient;
        entry.poids += n.coefficient;
        parMatiere.set(n.matiereId, entry);
      }
      const detailMatieres = Array.from(parMatiere.entries()).map(([matiereId, v]) => ({
        matiereId,
        matiere: v.nom,
        moyenne: v.poids > 0 ? Number((v.total / v.poids).toFixed(2)) : 0,
        coefficient: v.coefficient,
      }));
      const moyenneGenerale =
        detailMatieres.length > 0
          ? Number((detailMatieres.reduce((s, m) => s + m.moyenne, 0) / detailMatieres.length).toFixed(2))
          : 0;
      return { eleveId, detailMatieres, moyenneGenerale };
    });

    const classement = [...moyennes].sort((a, b) => b.moyenneGenerale - a.moyenneGenerale);
    const moyenneClasse =
      moyennes.length > 0 ? Number((moyennes.reduce((s, m) => s + m.moyenneGenerale, 0) / moyennes.length).toFixed(2)) : 0;

    const bulletins = await Promise.all(
      moyennes.map((m) =>
        prisma.bulletin.upsert({
          where: { eleveId_periodeId: { eleveId: m.eleveId, periodeId } },
          create: {
            eleveId: m.eleveId,
            classeId,
            periodeId,
            anneeScolaire,
            moyenneGenerale: m.moyenneGenerale,
            moyenneClasse,
            rang: classement.findIndex((c) => c.eleveId === m.eleveId) + 1,
            effectifClasse: moyennes.length,
            detailMatieres: m.detailMatieres as any,
            templateUtilise: templateUtilise || 'classic',
          },
          update: {
            moyenneGenerale: m.moyenneGenerale,
            moyenneClasse,
            rang: classement.findIndex((c) => c.eleveId === m.eleveId) + 1,
            detailMatieres: m.detailMatieres as any,
          },
        })
      )
    );

    res.status(201).json({ genere: bulletins.length, bulletins });
  })
);

router.get(
  '/bulletins/:eleveId',
  asyncHandler(async (req, res) => {
    res.json(await prisma.bulletin.findMany({ where: { eleveId: req.params.eleveId }, orderBy: { genereLe: 'desc' } }));
  })
);

export default router;
