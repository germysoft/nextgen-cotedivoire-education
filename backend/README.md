# Backend — NextGen Côte d'Ivoire Éducation

API REST (Node.js + Express + TypeScript + Prisma + PostgreSQL) pour le
frontend [`nextgen-cotedivoire-education`](https://github.com/germysoft/nextgen-cotedivoire-education),
qui était jusqu'ici 100 % mock / frontend-only.

## 1. Démarrage rapide

```bash
cd backend
cp .env.example .env          # adapter les secrets si besoin
docker compose up -d          # PostgreSQL + Adminer (http://localhost:8080)
npm install
npm run prisma:migrate        # crée les tables (première fois : donnez un nom, ex. "init")
npm run seed                  # établissement + 1 compte par rôle + 1 élève + 1 parent
npm run dev                   # API sur http://localhost:4000
```

Vérification : `curl http://localhost:4000/health` doit répondre `{"status":"ok",...}`.

Comptes créés par le seed (mot de passe : `ChangeMoi123!`, à changer au 1er login) :
`admin@demo.ci`, `directeur@demo.ci`, `enseignant@demo.ci`, `comptable@demo.ci`,
`secretaire@demo.ci`, `surveillant@demo.ci`, `infirmier@demo.ci`,
`bibliothecaire@demo.ci`, `parent@demo.ci`.

## 2. Architecture

```
src/
  index.ts              point d'entrée (démarre le serveur)
  app.ts                configuration Express (middlewares, montage des routes)
  lib/
    prisma.ts           client Prisma singleton
    jwt.ts               signature/vérification des tokens
    permissions.ts        RBAC — copie exacte de src/types/roles.ts du frontend
  middleware/
    auth.ts               vérifie le JWT, peuple req.user
    rbac.ts                requireModule() / requireRole()
    ownership.ts           un parent ne voit que ses propres enfants
    errorHandler.ts        traduit erreurs Zod/Prisma/ApiError en réponses HTTP propres
  utils/
    crudFactory.ts          fabrique un routeur CRUD pour un modèle Prisma donné
    asyncHandler.ts         wrapper + classe ApiError
  routes/
    auth.routes.ts          login/refresh/logout/me/change-password/création de comptes
    eleves.routes.ts        élèves (matricule auto, inscription)
    personnel.routes.ts     RH : personnel, congés, pointage, évaluations
    pedagogie.routes.ts     classes, matières, affectations, emploi du temps, discipline
    notes.routes.ts         notes, calcul de moyennes/rang, génération de bulletins
    finance.routes.ts       échéances, paiements + quittances, comptabilité, caisse
    bibliotheque.routes.ts  catalogue, emprunts avec pénalités de retard
    infirmerie.routes.ts    fiches de santé, consultations, alertes
    messagerie.routes.ts    messages internes, SMS/email (brouillon), forum
    portail-parents.routes.ts  accès restreint aux données des propres enfants
    examens.routes.ts       examens officiels, convocations, délibérations
    generic.routes.ts       CRUD générique pour ~45 entités restantes
    public.routes.ts        vérification publique de documents (QR code)
prisma/
  schema.prisma           ~60 modèles couvrant tous les modules du frontend
  seed.ts
```

### Pourquoi un « CRUD générique » pour certains modules ?

Le frontend compte ~90 écrans. Écrire un contrôleur sur-mesure pour chacun
représenterait des mois de travail. Les modules à forte logique métier
(paiements, notes/bulletins, emprunts, examens, permissions parent...) ont un
contrôleur dédié avec de vraies règles (calculs, transactions, contrôles de
cohérence). Les modules plus « déclaratifs » (stocks, partenariats, MENA,
parascolaire...) utilisent `createCrudRouter()` : chaque entité y obtient un
**vrai** endpoint REST fonctionnel (liste paginée, recherche, création,
modification, suppression) branché sur la vraie base de données — ce n'est
pas une simulation, juste une logique CRUD standard plutôt que sur-mesure.
Vous pouvez remplacer n'importe quelle entrée de `generic.routes.ts` par un
contrôleur dédié au fur et à mesure des besoins, sans rien casser ailleurs.

## 3. Authentification & permissions

- JWT d'accès (15 min) + refresh token (7 jours, stocké hashé en base,
  révocable).
- `src/lib/permissions.ts` reproduit **exactement** `rolePermissions` de
  `src/types/roles.ts` côté frontend : un changement de permission doit être
  répercuté dans les deux fichiers pour rester cohérent.
- Deux rôles backend supplémentaires, absents du menu admin : `parent` et
  `eleve`, qui n'accèdent qu'à leurs propres données via le Portail
  Parents/Élèves (`middleware/ownership.ts`).

## 4. Brancher le frontend

Le frontend actuel n'a aucun client HTTP ni gestion de session réelle. Étapes
pour le connecter à cette API (à faire côté repo frontend) :

1. **Ajouter un client HTTP** (`axios` ou `fetch` wrappé) avec base URL
   `VITE_API_URL` (`.env` Vite), qui attache `Authorization: Bearer <token>`
   et gère le refresh automatique sur 401.
2. **Remplacer `RoleContext.tsx`** (`localStorage`) par un vrai
   `AuthContext` : `POST /api/auth/login`, stockage des tokens (idéalement
   refresh token en cookie httpOnly via un petit proxy, ou en mémoire +
   refresh silencieux), `GET /api/auth/me` au chargement.
3. **Remplacer les imports de `src/data/mock*.ts`** par des hooks
   `@tanstack/react-query` appelant les endpoints correspondants (le projet a
   déjà `@tanstack/react-query` en dépendance — actuellement inutilisé pour
   du HTTP réel).
4. **Protéger les routes** : ajouter un composant `<ProtectedRoute
   module="comptabilite">` dans `App.tsx` qui vérifie `hasPermission` via le
   nouveau `AuthContext` avant de rendre la page, pour corriger la faille
   relevée dans l'analyse (accès direct par URL non filtré).
5. Ajuster `App.tsx` : supprimer la route `/teachers` dupliquée (ligne 214 ou
   255), pointer `/schedule`, `/statistics`, `/messages`, `/infrastructure`
   vers leurs vraies pages, retirer les fichiers orphelins listés dans
   `ANALYSE.md`.

## 5. Déploiement

Voir **`AZURE_DEPLOYMENT.md`** pour le guide complet de déploiement sur
Azure (base de données, stockage des fichiers, hébergement, partitionnement
par année scolaire et archivage annuel).

Pour un déploiement générique ailleurs : `npm run build && npm start`
(Node), ou conteneuriser avec un `Dockerfile` standard `node:20-alpine` +
`npm ci && npm run build`. `npm run prisma:deploy` en production (n'invite
pas à nommer une migration, applique les migrations existantes). Pensez à
générer de vrais secrets JWT (`openssl rand -hex 64`) et à ne jamais
committer `.env`.

## 6. Limites connues de cette première version

- Les campagnes SMS/Email sont persistées mais **l'envoi réel** nécessite de
  brancher un fournisseur (Orange/MTN API, Twilio, SendGrid...) — les points
  d'intégration sont commentés dans `messagerie.routes.ts`.
- Le rapprochement DECO et la synchronisation MENA sont modélisés
  (`RapprochementDECO`, `SynchronisationMENA`) mais l'import/export de
  fichiers réels vers les systèmes du MENA n'est pas implémenté (format de
  fichier propre à l'administration, non documenté publiquement).
- Le plan comptable SYSCOHADA (`CompteComptable`) est un stockage générique :
  les comptes normalisés eux-mêmes ne sont pas préchargés, à ajouter via un
  script de seed comptable dédié.
- Pas de tests automatisés inclus dans cette première version.

## 7. Stockage des fichiers et déploiement Azure

Les photos (élèves, personnel) et documents (bulletins PDF) ne sont jamais
stockés en base — voir `src/lib/blobStorage.ts` et les routes
`src/routes/uploads.routes.ts`. Le partitionnement par année scolaire des
tables à forte volumétrie (`Note`, `Absence`, `Pointage`,
`EcritureComptable`, `AuditLog`) et l'archivage annuel vers Azure Blob
Storage sont scriptés dans `scripts/` — voir **`AZURE_DEPLOYMENT.md`** pour
la procédure complète de déploiement et la maintenance annuelle.
