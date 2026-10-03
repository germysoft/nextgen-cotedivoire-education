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
- **`src/pages/Grades.tsx`** + **`src/hooks/api/useNotes.ts`** : le tableau
  de notes par classe/période est branché sur `/api/notes/moyennes/:classeId/:periodeId`
  (moyennes, rang, classement réels). Le professeur affiché par matière est
  déduit de l'emploi du temps réel (`Classe.cours`), pas d'un champ séparé.
  L'assistant de saisie de notes (`GradeEntryWizard`) et l'éditeur de notes
  de conduite (`ConduiteEditor`) ne sont **pas** branchés dans cette passe
  (voir juste en dessous) — en attendant, on peut saisir des notes via
  `POST /api/notes` directement.
- **`src/pages/Finance.tsx`** + **`src/hooks/api/useFinance.ts`** : onglet
  "Transactions" branché sur `/api/finance/caisse` (mouvements de caisse
  Entrée/Sortie réels), onglet "Impayés" branché sur `/api/finance/echeances`
  (reste à payer calculé réellement à partir des paiements déjà enregistrés),
  enregistrement d'un paiement branché sur `/api/finance/paiements` (génère
  une vraie quittance côté backend). Les rapports PDF (mensuel, grand livre,
  situation financière) sont générés à partir de ces données réelles.
  Simplifications assumées : un mouvement de caisse n'a pas de "mode de
  paiement" dans le schéma actuel (seuls les paiements élèves en ont un) ;
  la "situation financière" est simplifiée (trésorerie + créances), pas un
  bilan SYSCOHADA normalisé — celui-ci existe déjà côté API
  (`GET /api/finance/bilan`) mais suppose un plan de comptes pré-chargé,
  absent du script de seed actuel.
- `GradeEntryWizard` (saisie de notes) et `ConduiteEditor` (notes de
  conduite) restent des composants non branchés. Le second suppose un
  modèle de "note de conduite" qui n'existe pas encore dans le schéma
  backend (seul `Discipline`, qui trace des incidents ponctuels, existe
  aujourd'hui) — à concevoir avant de le brancher.
- Les **~83 autres écrans** utilisent encore leurs fichiers `mock*.ts` /
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

Dans l'ordre où je les traiterais : `ParentPortal.tsx` (→
`/api/portail-parents`, en remplaçant aussi `ParentLogin.tsx` par un vrai
appel à `POST /api/auth/login` avec le rôle `parent`), puis
`bibliotheque/Emprunts.tsx` (→ `/api/bibliotheque`, déjà riche en logique
métier réelle côté backend : pénalités de retard automatiques).

## Déploiement Azure et stratégie de base de données

Le backend est prévu pour un déploiement sur **Azure** : Azure Database for
PostgreSQL Flexible Server (pas de changement de moteur nécessaire, le
schéma reste du Postgres standard) + Azure Blob Storage pour les fichiers
(photos, bulletins PDF). Voir `backend/AZURE_DEPLOYMENT.md` pour le guide
complet.

Sur la question de l'historisation par année scolaire : plutôt qu'une
nouvelle base de données chaque année (ce qui casserait les relations
multi-années élève/personnel et multiplierait les coûts d'infrastructure),
les tables à forte volumétrie (`Note`, `Absence`, `Pointage`,
`EcritureComptable`, `AuditLog`) sont **partitionnées nativement par
PostgreSQL**, une partition par année scolaire — voir
`backend/scripts/setup-partitioning.sql` (mise en place) et
`backend/scripts/create-yearly-partition.ts` /
`backend/scripts/archive-partition.ts` (maintenance annuelle : création de
la partition de l'année suivante, puis archivage réel des vieilles années
vers Azure Blob Storage une fois qu'elles ne sont plus consultées).

Les photos et documents (bulletins PDF) ne sont jamais stockés en base :
`src/lib/blobStorage.ts` + `src/routes/uploads.routes.ts` gèrent l'upload
vers Azure Blob Storage, seule l'URL est persistée (`Eleve.photo`,
`Personnel.photo`, `Bulletin.documentUrl`).

## ParentLogin.tsx / ParentPortal.tsx — branchés

- **`ParentLogin.tsx`** : connexion réelle via `POST /api/auth/login`
  (même endpoint que le staff, rôle `parent`/`eleve`).
- **`ParentPortal.tsx`** + **`src/hooks/api/useParentPortal.ts`** : sélecteur
  d'enfant réel (un parent peut avoir plusieurs enfants rattachés), notes,
  absences, échéances de paiement et bulletins tous branchés sur
  `/api/portail-parents/*`, avec l'accès strictement limité aux propres
  enfants du compte connecté (déjà garanti côté backend par
  `middleware/ownership.ts`).
- Correctif backend au passage : `GET /api/portail-parents/bulletins/:eleveId`
  ne renvoyait pas que les bulletins marqués `envoyeAuxParents: true` — un
  parent aurait pu voir un bulletin encore en préparation. Corrigé.
- Simplifications assumées : pas de colonne "Retard" distincte de
  "Absence" (le schéma `Absence` ne modélise que présent/absent avec
  justification, pas un troisième statut retard) ; le bouton "Payer
  maintenant" reste un message d'attente — l'intégration d'un vrai moyen
  de paiement en ligne (Mobile Money) est un projet à part entière, non
  couvert ici.

## bibliotheque/Emprunts.tsx — branché

- **`src/hooks/api/useBibliotheque.ts`** + **`Emprunts.tsx`** : catalogue et
  emprunts réels, branchés sur `/api/bibliotheque/*`. La création d'un
  emprunt vérifie la disponibilité réelle d'exemplaires (transaction
  atomique côté backend), et l'enregistrement d'un retour calcule
  réellement les jours de retard et la pénalité associée.
- Petit ajout backend : `POST /api/bibliotheque/emprunts` accepte
  désormais un `dureeJours` optionnel (7/14/21/30 jours au choix dans
  l'interface), au lieu d'une durée fixe de 14 jours.
- Les stats "Retours aujourd'hui" et "Taux de retour" (qui étaient des
  chiffres fixes non branchés) sont remplacées par des équivalents réels :
  retours des 7 derniers jours, et taux de retour *à temps* (sans
  pénalité) sur les emprunts déjà retournés.
- **Non repris** : la fonctionnalité "Relance SMS/Email" (bouton présent
  dans l'ancienne version mock) n'a pas d'équivalent propre dans le schéma
  actuel — les coordonnées de contact pertinentes sont celles du parent
  (`ParentProfil`, via la relation `ElevePar`), pas de l'élève directement,
  et le mock ne faisait de toute façon qu'un `toast` sans envoi réel. À
  reconcevoir si besoin, en s'appuyant sur `/api/messagerie/sms` et
  `/api/messagerie/emails` (déjà en place mais eux-mêmes en mode
  "brouillon", voir plus haut).

## hr/Conges.tsx — branché (partiellement)

- **`src/hooks/api/useConges.ts`** + **`Conges.tsx`** : onglet "Congés"
  entièrement branché sur `/api/personnel/conges` (création, validation,
  refus — avec décrément réel du solde de l'employé à la validation, déjà
  géré côté backend). Onglet "Soldes de Congés" branché sur le vrai champ
  `Personnel.soldeCongesAnnuels`.
- Ajout backend : le modèle `Conge` gagne deux champs (`remplacantId` →
  relation vers `Personnel`, `contact`) pour couvrir ce que l'interface
  demandait déjà.
- Libellés de statut alignés sur le schéma réel : "Approuvé"/"Rejeté"
  (mock) → "Validé"/"Refusé" (valeurs réelles de `Conge.statut`).
- **Non repris** : l'onglet "Soldes" ne montre plus le détail
  acquis/pris/report N-1 (fabriqué dans le mock) — seul le solde courant
  existe réellement dans le schéma (`soldeCongesAnnuels`, un compteur qui
  se décrémente, pas un historique décomposé). L'onglet "Absences
  quotidiennes" (retards/absences du personnel, distinct des congés) n'est
  **pas branché** : son schéma attendu (justificatif, motif détaillé, type
  Retard/Maladie...) ne correspond pas au modèle `Pointage` actuel
  (présent/absent/retard/congé + heure d'arrivée uniquement, pas de
  justificatif). Le point de départ existe déjà côté API
  (`POST /api/personnel/pointage`) mais manque une route de liste et les
  champs de justification — à concevoir si ce suivi est nécessaire.

## Déploiement de test sur Render (validation du circuit complet)

Avant de brancher Lovable sur l'API, un déploiement de test a été fait sur
Render (PostgreSQL + service web backend) pour valider que tout le circuit
fonctionne réellement, indépendamment d'Azure.

Deux corrections nécessaires découvertes à cette occasion (donc utiles
aussi pour le déploiement Azure) :
- **`backend/tsconfig.json`** : `moduleResolution: "node"` a été retiré
  (option dépréciée puis supprimée par une version récente de TypeScript,
  faisait échouer le build) ; `prisma/seed.ts` retiré de `include` (il
  violait `rootDir` — le seed s'exécute de toute façon via `ts-node
  --transpile-only`, pas via `tsc`, donc n'a pas besoin d'être inclus ici).
- **Aucun historique de migration Prisma n'existe dans le dépôt**
  (`prisma migrate dev` n'a jamais pu être exécuté dans l'environnement de
  développement utilisé jusqu'ici, qui n'a pas accès aux binaires moteur
  de Prisma). En conséquence, `prisma migrate deploy` ne crée aucune
  table ("No migration found"). Solution retenue pour ce déploiement de
  test : `prisma db push` à la place, qui synchronise directement le
  schéma sans historique de migrations. **Recommandation avant une mise
  en production réelle** : générer un historique de migrations propre
  avec `npx prisma migrate dev --name init` depuis un poste ayant accès
  à internet, committer le dossier `prisma/migrations/` généré, puis
  repasser sur `prisma migrate deploy` (plus sûr en production que
  `db push`, qui peut perdre des données sur certains changements de
  schéma).

## Lot RH — Affectations, Pointage, Contrats, Évaluations — branchés

- **`src/hooks/api/useRH.ts`** (nouveau) : hooks React Query typés sur la forme
  exacte renvoyée par les routes backend, pour les affectations
  (`/api/pedagogie/affectations`), le pointage (`/api/personnel/pointage`), les
  contrats (`/api/rh/contrats`, routeur CRUD générique) et les évaluations
  (`/api/personnel/evaluations`). `useMatieresQuery` (`/api/pedagogie/matieres`)
  alimente les formulaires d'affectation.
- **`src/pages/hr/Affectations.tsx`** : onglet **Affectations** entièrement
  branché (liste réelle enseignant / matière / classe / coefficient / charge
  horaire hebdomadaire, création, modification, suppression) et onglet
  **Évaluations** branché sur les évaluations réelles, avec critères pondérés et
  note globale calculée côté backend.
- **`src/pages/hr/Pointage.tsx`** : pointage réel du personnel par date
  (création, modification, suppression), statistiques du jour calculées sur les
  données réelles, états de chargement et d'erreur explicites.
- **`src/pages/hr/Contrats.tsx`** : contrats réels (création, modification,
  suppression, renouvellement, suivi des échéances), impression du contrat et
  génération d'attestations à partir des données persistées.

### Ajouts backend nécessaires

- `GET /api/personnel/pointage/all` (filtres `date` et `personnelId`, personnel
  joint, tri par date puis heure d'arrivée, 500 lignes max) : il n'existait que
  la création du pointage, pas de route de liste.
- `PUT` / `DELETE /api/personnel/pointage/:id` (correction et suppression d'un
  pointage) ; `commentaire` devient optionnel à la validation.
- `GET /api/personnel/evaluations/all` : liste des évaluations, nécessaire à
  l'onglet Évaluations.
- `PUT` / `DELETE /api/pedagogie/affectations/:id` : l'endpoint ne gérait que la
  création et la liste.

### Simplifications assumées

- L'onglet **Promotions** de la page Affectations a été **retiré** : aucun
  modèle `Promotion` n'existe dans `backend/prisma/schema.prisma` (l'historique
  de carrière n'est pas modélisé aujourd'hui). Plutôt que de fabriquer une
  donnée qui ne serait jamais persistée, l'onglet a disparu et un commentaire
  dans le fichier explique pourquoi.
- Les champs de contrat présents dans le mock mais absents du modèle `Contrat`
  ont été retirés : `poste` / `departement` (ils vivent sur `Personnel`, joint
  côté client pour l'affichage), `heuresHebdo`, `periodEssai`, `dateSignature`
  et l'historique des attestations émises. Le contrat réel ne porte que
  `personnelId`, `typeContrat`, `dateDebut`, `dateFin`, `salaire`,
  `documentUrl`, `statut`.
- Le routeur générique ne joint pas la relation `personnel` sur les contrats :
  la page recoupe `personnelId` avec la liste du personnel déjà chargée, plutôt
  qu'une requête par ligne de tableau.
- L'onglet "Absences quotidiennes" du module Congés reste non branché (voir la
  section `hr/Conges.tsx` plus haut) : le modèle `Pointage` ne porte pas de
  justificatif ni de motif détaillé.

## Lot RH 2 — Recrutement, Entretiens, Formations — branchés ; Compétences, Historique — mock

**Hooks** : `src/hooks/api/useRecrutementRH.ts` (fichier dédié pour la lisibilité). Query + create/update/delete pour :
- `/rh/recrutements` (modèle `Recrutement`)
- `/rh/candidatures` (modèle `Candidature`, liée à `Recrutement`, optionnellement à `Personnel`)
- `/rh/entretiens` (modèle `Entretien`, lié à `Candidature`)
- `/rh/formations` (modèle `Formation`, lié à `Personnel`)

Le routeur générique renvoie des réponses paginées : les hooks exposent `items`. Les relations ne sont pas jointes côté serveur ; les pages recroisent les IDs côté client (candidature → recrutement, entretien → candidature, formation → personnel).

**Pages branchées** (loading/erreur, toasts succès + `err?.response?.data?.error`) :
- `hr/Recrutement.tsx` — onglets Offres et Candidatures, CRUD complet, changement de statut.
- `hr/Entretiens.tsx` — planification, modification, suppression, notes et décision.
- `hr/Formations.tsx` — CRUD des formations par membre du personnel.

**Simplifications** : les champs mock sans équivalent Prisma ont été retirés (aucun champ inventé). Aucune route backend ajoutée : tout passe par `generic.routes.ts`.

**Restent en mock (bandeau jaune visible)** :
- `hr/Competences.tsx` — aucun modèle `Competence`/`Skill` dans `schema.prisma`.
- `hr/Historique.tsx` (historique de carrière) — aucun modèle `Carriere`/`Promotion` ; seuls les contrats sont modélisés.
Ces pages seront branchées après conception d'un modèle backend dédié.

**Permissions** : préfixe `/hr` déjà couvert par `{ prefix: '/hr', module: 'rh' }` dans `routePermissions.ts`.

## Lot Bibliothèque — Catalogue, Alertes, Réservations, Cartes, Acquisitions, Suggestions — branchés ; Inventaire — mock

**Routes backend ajoutées** (`backend/src/routes/bibliotheque.routes.ts`, même style zod/asyncHandler/ApiError) :
- `PUT /api/bibliotheque/livres/:id` — recalcule `exemplairesDisponibles` ; 409 si le nouveau total < exemplaires empruntés.
- `DELETE /api/bibliotheque/livres/:id` — 409 si le livre a des emprunts ou réservations ; détache les suggestions liées.
- `livreSchema` accepte désormais `emplacement` (déjà présent dans Prisma).

**Hooks** (`src/hooks/api/useBibliotheque.ts`, étendu) : `useCreateLivre/useUpdateLivre/useDeleteLivre`, `useAlertesRetardQuery`, et CRUD générique (réponse paginée → `items`) pour réservations, cartes lecteur, acquisitions, suggestions.

**Pages branchées** (loading/erreur, toasts avec `err?.response?.data?.error`) :
- `Catalogue.tsx` — CRUD livres. Retirés : résumé, langue, pages, note, mots-clés, cote.
- `AlertesRetard.tsx` — `GET /alertes-retard` + retour. Retirés : contacts parents, historique des relances.
- `Reservations.tsx` — `/reservations`. Retirés : expiration, position en file, notification.
- `CartesLecteur.tsx` — `/cartes-lecteur` (élèves). Retirés : photo, quota, type d'abonnement.
- `Acquisitions.tsx` — `/acquisitions`, lignes dans le JSON `lignes`, total recalculé. Retirés : budget, n° de bon, contact fournisseur. La réception ne crée pas les livres.
- `Suggestions.tsx` — `/suggestions` (titre libre ou livre existant). Retirés : auteur, justification, votes, priorité, prix.

Le routeur générique ne joint pas les relations : livres/élèves sont recoupés côté client.

**Reste en mock (bandeau jaune)** : `Inventaire.tsx` affiche des campagnes de comptage (attendu vs compté, écarts) ; ni `ExemplaireLivre` ni `Livre` ne modélisent cela, donc aucun rapprochement forcé.

**Permissions** : `/bibliotheque` déjà mappé au module `bibliotheque`.

## Lot Pédagogie — Matières, Attribution, Emplois du temps, Discipline, Conseils, E-learning — branchés ; Bulletins, Impression des listes — mock

**Routes backend ajoutées** (`pedagogie.routes.ts`, style zod/asyncHandler/ApiError) :
- `PUT/DELETE /pedagogie/matieres/:id` : la suppression renvoie 409 si la matière est utilisée (notes, cours, affectations).
- `PUT/DELETE /pedagogie/emploi-du-temps/:id` : le PUT refait le contrôle de conflit enseignant/salle (409) en excluant le cours modifié.
- `PUT/DELETE /pedagogie/discipline/:id` ; `disciplineSchema` accepte désormais `suiteDonnee` (déjà dans Prisma).

**Hooks** : `src/hooks/api/usePedagogie.ts`. Il réexporte les hooks affectations/matières de `useRH.ts` (pas de doublon) et ajoute matières, cours, discipline, ainsi que le CRUD générique (réponse paginée → `items`, sans relations) pour salles (lecture), conseils de classe et e-learning.

**Pages branchées** (loading/erreur, toasts `err?.response?.data?.error`, le 409 de conflit est affiché tel quel) :
- `Matieres.tsx` : CRUD. Le nombre d'enseignants et de classes est dérivé des affectations. Retirés : couleur, volume horaire par niveau, programme, département.
- `Attribution.tsx` : CRUD des affectations, avec la charge hebdo calculée par enseignant. Retirés : semestre, statut de validation, progression.
- `EmploisDuTemps.tsx` : grille par classe, ajout/modification/suppression d'un cours. Retirés : couleur, type de séance, semaines A/B.
- `Discipline.tsx` : CRUD des incidents. Retirés : gravité, lieu, témoins, convocation, workflow, pièces jointes.
- `Conseils.tsx` : CRUD générique, avec `decisions` (JSON) saisi comme une liste de lignes. Retirés : participants, salle/heure, mentions par élève, statistiques. `periodeId` n'est pas exposé.
- `Elearning.tsx` : CRUD générique de ressources sous forme de liens. Retirés : description, vues, notes, devoirs, forum, envoi de fichiers.

**Restent en mock (bandeau jaune)** :
- `Bulletins.tsx` : aucun endpoint pédagogie ne fournit de bulletin agrégé ; les vrais bulletins se font depuis `Grades.tsx`.
- `ImprimerListesPedagogie.tsx` : données générées par `generateMockData`, aucun export serveur.

**Classes** : déjà couvert par `Classes.tsx` à la racine (`/classes`), ignoré ici.

**Points d'attention** :
- `/pedagogie/salles` est rattaché au module RBAC `infrastructures`. Sans ce droit, la liste des salles de l'emploi du temps est vide ; la salle reste optionnelle.
- **Permissions** : `/pedagogie` est déjà mappé au module `pedagogie`.

## Lot Scolarité — Absences, Certificats, Documents, Historique — branchés ; Matricule, Paiements, Échéances, Alertes, MENA, Impression — mock

**Hooks** : `src/hooks/api/useScolarite.ts`. Il fournit le CRUD générique pour absences, documents, certificats, inscriptions, parents et liens-parents, plus `useInscrireEleve` (endpoint dédié `POST /eleves/:id/inscrire`) et `genererNumeroReference`. Élèves et classes réutilisent `useElevesQuery`, `useClassesQuery` et `useAnneeScolaireActive`.

**Aucune route backend ajoutée** : tout est couvert par `generic.routes.ts` et `eleves.routes.ts`.

**Pages branchées** :
- `Absences.tsx` : CRUD, bascule justifiée/non justifiée, filtres par classe et par statut. `coursId` n'est pas saisi. Retirés : type retard, pièce justificative, notification parent.
- `Certificats.tsx` : délivrance, impression et suppression. `numeroReference` est généré côté client (préfixe + horodatage + aléa) ; une collision renvoie l'erreur serveur dans le toast. `contenuHtml` fige le texte émis. Retirés : statut de demande, motif, nombre d'exemplaires.
- `Documents.tsx` : CRUD de documents sous forme de liens, sans envoi de fichier. Retirés : validation, expiration, pièces obligatoires.
- `Historique.tsx` : parcours d'un élève à partir de ses inscriptions. Inscription/réinscription via `POST /eleves/:id/inscrire` sur l'année active ; statut et redoublement via le PUT générique. Retirés : bulletins et moyennes (page Notes), établissement d'origine.

**Restent en mock (bandeau jaune)** :
- `Matricule` : aucun endpoint de génération.
- `Paiements`, `Echeances`, `Alertes` : relèvent du module Finance.
- `MENA` : aucun échange ministériel.
- `ImprimerListes` : données fictives.

**Hooks prêts sans page** : les parents (`/scolarite/parents`) et les liens-parents n'ont aucune page dans `scolarite/`.

**Limite connue** : `crudFactory` plafonne `pageSize` à 200 et n'accepte pas de filtre par `eleveId` ou `classeId`. Au-delà de 200 enregistrements, les listes sont tronquées. Les lots précédents qui passent par le générique sont concernés aussi. À prévoir : ajouter des filtres `where` dans `crudFactory`.

**Permissions** : `/scolarite` est déjà mappé au module `scolarite`.
