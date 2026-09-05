# Migration frontend → backend réel

Ce document explique ce qui a été branché sur l'API dans cette passe, et
comment reproduire le même schéma sur le reste des ~90 écrans.

## Ce qui est fait

- **`src/lib/api.ts`** : client HTTP (axios) avec injection automatique du
  token, et rafraîchissement silencieux du token d'accès sur une réponse 401.
- **`src/contexts/AuthContext.tsx`** (nouveau) : vraie session, appuyée sur
  `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.
- **`src/contexts/RoleContext.tsx`** (réécrit) : le rôle vient désormais de
  l'utilisateur authentifié (`AuthContext`), plus de la case `localStorage`
  modifiable depuis les DevTools. Interface publique inchangée
  (`useRole()`, `hasPermission()`...) pour ne rien casser dans les ~90 pages
  qui la consomment déjà.
- **`src/components/layout/MainLayout.tsx`** : ajoute la protection de route
  qui manquait totalement (incohérence n°5 du rapport d'analyse) —
  redirection vers `/auth` si non connecté, écran "Accès refusé" si le rôle
  n'a pas la permission du module concerné. Un seul point d'entrée à
  maintenir (`src/lib/routePermissions.ts`) plutôt que 179 lignes de route à
  garder à jour une par une.
- **`src/pages/Auth.tsx`** : formulaire de connexion réellement branché sur
  l'API (avant : un simple `navigate("/dashboard")` sans vérification).
- **`src/pages/Students.tsx`** + **`src/hooks/api/useEleves.ts`** : exemple
  complet de bout en bout — liste paginée, recherche, édition, désactivation
  logique, toutes branchées sur `/api/eleves`.
- **`src/pages/Teachers.tsx`** + **`src/hooks/api/usePersonnel.ts`** : même
  schéma pour les enseignants, branché sur `/api/personnel` (filtré
  `categoriePersonnel=Enseignant`). A nécessité un petit ajout backend :
  `GET /api/personnel` inclut désormais les affectations (matière + classe)
  pour afficher ces colonnes sans requête supplémentaire par ligne.
- **`src/pages/Classes.tsx`** + **`src/hooks/api/useClasses.ts`** : liste
  réelle (élèves inscrits/capacité, professeur principal, niveau/cycle),
  création/édition/suppression, et vue détail avec onglets **élèves**
  (réels, via les inscriptions) et **emploi du temps** (réel, via
  `/api/pedagogie/emploi-du-temps`) branchés sur l'API. L'onglet
  **performance** (graphiques) reste sur des données d'exemple, clairement
  annoncées comme telles dans l'UI — l'agrégation des moyennes par matière
  et par classe n'est pas encore implémentée côté backend.
  A nécessité deux ajouts backend : `professeurPrincipalId` est devenu une
  vraie relation Prisma vers `Personnel` (au lieu d'un simple champ texte),
  et un nouvel endpoint `GET /api/meta/annee-scolaire-active` (accessible à
  tout utilisateur authentifié, sans garde de module) pour que les
  formulaires de création puissent toujours retrouver l'année scolaire en
  cours quel que soit le rôle.
- **Corrections de routage** (§2 de `ANALYSE.md`) : route `/teachers`
  dupliquée corrigée (la page `Planning enseignants` déplacée vers
  `/enseignants/planning`, sa vraie place), routes fantômes `/schedule`,
  `/statistics`, `/messages`, `/infrastructure` supprimées (aucune n'était
  référencée par un menu), et les 5 fichiers de code mort supprimés
  (`pages/dashboard/Directeur.tsx`, `Comptable.tsx`, `Enseignant.tsx`,
  `pages/partenariats/ReunionsPage.tsx`, `SponsorsPartners.tsx`).

## Ce qui n'est PAS encore fait

- **`AddStudentDialog.tsx`** / **`AddTeacherDialog.tsx`** (formulaires
  multi-onglets d'ajout, non branchés) : fonctionnent encore en simulation
  pure (toast de confirmation sans appel réseau). Je n'ai pas voulu les
  réécrire à l'aveugle sans validation — les connecter à `POST /api/eleves`
  / `POST /api/personnel` est la suite logique.
- **`Classes.tsx`** est fait (voir ci-dessus). Reste : brancher
  l'agrégation réelle des moyennes/rang par classe (onglet "performance" et
  colonnes moyenne/rang de l'onglet "élèves"), ce qui suppose de choisir
  une période active et de croiser avec `/api/notes/moyennes`.
- Les **~85 autres écrans** utilisent encore leurs fichiers `mock*.ts` /
  tableaux en dur. Le backend expose déjà un endpoint réel pour chacun
  (voir `backend/README.md`) ; il reste à répéter le schéma ci-dessous.
- Le statut de paiement par élève (colonne "fees" de l'ancienne version de
  `Students.tsx`) a été retiré de la liste : il vivra dans le module Finance
  / la fiche élève (`GET /api/finance/echeances?eleveId=`), pas dans la
  liste générale, pour éviter une requête supplémentaire par ligne de
  tableau.

## Comment reproduire le schéma sur un autre écran

1. Créer `src/hooks/api/use<Entité>.ts` sur le modèle de `useEleves.ts` :
   une interface TS reflétant la réponse de l'endpoint backend concerné
   (voir `backend/prisma/schema.prisma` pour les champs exacts), puis des
   hooks `useXQuery` / `useCreateX` / `useUpdateX` / `useDeleteX` avec
   `@tanstack/react-query` (déjà configuré dans `App.tsx`).
2. Dans la page, remplacer le tableau `mock*.ts` / `initialX` par l'appel
   du hook de liste, gérer les états `isLoading` / `isError` (voir
   `Students.tsx` pour le gabarit visuel), et brancher les actions
   créer/modifier/supprimer sur les mutations.
3. Vérifier dans `src/lib/routePermissions.ts` que le préfixe de route de
   la page est bien associé au bon module — sinon `MainLayout` bloquera
   l'accès à tort (ou, à l'inverse, laissera passer un rôle qui ne devrait
   pas y accéder).
4. Si la page a un formulaire de création complexe (à la manière
   d'`AddStudentDialog`), lui passer un callback `onCreated` (ou le
   connecter directement à la mutation `useCreateX`) plutôt que de se
   contenter d'un `toast.success` local.

## Pages prioritaires suggérées pour la suite

Dans l'ordre où je les traiterais : `Grades.tsx`/`notes/Moyennes.tsx` (→
`/api/notes`), `Finance.tsx`/`comptabilite/PaiementsScolaires.tsx` (→
`/api/finance`), puis `ParentPortal.tsx` (→ `/api/portail-parents`, en
remplaçant aussi `ParentLogin.tsx` par un vrai appel à `POST /api/auth/login`
avec le rôle `parent`).
