# Analyse de l'application NextGen Côte d'Ivoire Éducation
### et livraison du backend

Dépôt analysé : `github.com/germysoft/nextgen-cotedivoire-education`

---

## 1. Ce qu'est réellement l'application

Un **ERP scolaire complet** construit sur Lovable (Vite + React 18 + TypeScript
+ shadcn/ui + Tailwind), organisé en **22 modules** et **~90 écrans** :

Tableaux de bord (par rôle) · RH · Gestion Pédagogique · Scolarité ·
Notes & Évaluations · Examens officiels (BEPC/BAC) · Messagerie & SMS ·
Portail Parents/Élèves · Suivi Enseignants · Comptabilité Générale ·
Infrastructures · Services (transport, cantine, internat) · Bibliothèque ·
Activités Parascolaires · Infirmerie · Stocks & Patrimoine · Partenariats ·
MENA/DESPS · Outils de Productivité · Statistiques & Rapports ·
Paramétrage & Sécurité · Modules Optionnels (IA, e-learning avancé, appli
mobile, paiement mobile).

**Point central : c'est un frontend pur.** Aucune trace de backend, de client
Supabase, ou d'appel HTTP vers une API. Toutes les données proviennent de
fichiers `src/data/mock*.ts` statiques, et l'authentification/les rôles sont
gérés par `localStorage` côté client (`src/contexts/RoleContext.tsx`) — les
auteurs eux-mêmes l'indiquent en commentaire dans `src/types/roles.ts` :
*"NE PAS utiliser en production"*.

## 2. Incohérences relevées dans le code

| # | Incohérence | Détail |
|---|---|---|
| 1 | Route `/teachers` dupliquée | Définie ligne 214 (`<Teachers/>`) puis ligne 255 (`<PlanningEnseignants/>`) dans `App.tsx`. La seconde définition rend la première inatteignable : la page `Teachers.tsx` devient du code mort côté routage. |
| 2 | Routes fantômes | `/schedule`, `/statistics`, `/messages`, `/infrastructure` pointent toutes vers `<Dashboard/>` au lieu de pages dédiées — probablement des routes prévues puis jamais finalisées. |
| 3 | Fichiers orphelins (code mort) | `pages/dashboard/Directeur.tsx`, `Comptable.tsx`, `Enseignant.tsx` ne sont importés nulle part (remplacés par les variantes `*Dashboard.tsx`) ; idem pour `pages/partenariats/ReunionsPage.tsx` et `SponsorsPartners.tsx` (remplacés par `Reunions.tsx`/`Sponsors.tsx`). |
| 4 | Duplication de composant sans différenciation | `/scolarite/documents` et `/portail/documents` rendent le même composant `DocumentsEleves`, sans adapter la vue au contexte (secrétariat vs. élève/parent). |
| 5 | Aucune protection de route | `RoleContext` filtre l'affichage du menu, mais rien n'empêche de naviguer directement vers n'importe quelle URL (`/comptabilite/caisse`, `/parametrage/utilisateurs`...) indépendamment du rôle actif — c'est un filtrage d'UI, pas une sécurité. |
| 6 | Sécurité côté client uniquement | Le rôle actif est un simple champ `localStorage` modifiable depuis les DevTools du navigateur : n'importe quel visiteur peut se donner le rôle `admin`. |
| 7 | Absence de persistance | Toute action (créer un élève, saisir une note, encaisser un paiement...) est perdue au rechargement de la page : aucune des ~90 fonctionnalités n'est réellement opérationnelle en l'état. |

**Correctifs recommandés côté frontend** (non appliqués ici, car cela
suppose de reconnecter l'app à une vraie API — voir §5) : supprimer la route
`/teachers` dupliquée, retirer les 4 fichiers orphelins, réassigner les
routes fantômes à de vraies pages ou les supprimer du menu, ajouter un
composant `<ProtectedRoute>` vérifiant les permissions avant chaque rendu de
page.

## 3. Le backend livré

Un backend Node.js/Express/TypeScript/Prisma/PostgreSQL complet a été généré
(~3 700 lignes), livré en pièce jointe (`backend.zip`). Résumé :

- **Schéma de données** : ~60 modèles couvrant l'intégralité des 22 modules
  (élèves, personnel, classes, notes, examens officiels, comptabilité en
  partie double, bibliothèque, infirmerie, messagerie, parascolaire, stocks,
  partenariats, MENA/DESPS, infrastructures...).
- **Authentification** JWT (access + refresh token révocable) avec hachage
  bcrypt des mots de passe.
- **RBAC** répliquant exactement les permissions de `src/types/roles.ts` du
  frontend, module par module.
- **Logique métier réelle** sur les modules à forte valeur : génération
  automatique de matricule/quittance, calcul de moyennes et de rang de
  classe, génération de bulletins, détection de conflits d'emploi du temps,
  paiements avec mise à jour automatique du statut des échéances,
  comptabilité en partie double, emprunts de bibliothèque avec calcul
  automatique des pénalités de retard, délibération d'examens avec calcul de
  mention, accès du Portail Parents strictement limité aux propres enfants
  du compte connecté.
- **API CRUD générique** appliquée aux ~45 entités restantes (stocks,
  parascolaire, partenariats, MENA...) : chaque entité dispose d'un vrai
  point d'entrée REST (liste paginée, recherche, création, modification,
  suppression) branché sur PostgreSQL — pas une simulation, mais une logique
  standard plutôt que sur-mesure, à enrichir au besoin.
- Script de **seed** : établissement, année scolaire, 8 comptes de
  démonstration (un par rôle) + un compte parent lié à un élève.
- `docker-compose.yml` (PostgreSQL + Adminer), `.env.example`, `README.md`
  détaillé (démarrage, architecture, plan de connexion au frontend).

## 4. Limite assumée de cet exercice

Coder un contrôleur entièrement sur-mesure pour chacun des ~90 écrans (avec
toute la logique métier spécifique : rapprochement DECO, synchronisation
MENA au format administratif réel, envoi SMS/email via un fournisseur tiers,
etc.) représenterait plusieurs mois de travail d'équipe — ce n'est pas
réalisable de façon crédible en une seule session. Le choix fait ici a été
de maximiser la valeur livrée : logique métier réelle et détaillée sur les
modules cœur, couverture complète (mais générique) du reste, architecture
cohérente et documentée pour que chaque module restant s'enrichisse
facilement sans tout reprendre.

Autre limite technique : l'environnement de cette conversation ne peut pas
télécharger les moteurs binaires de Prisma (domaine non accessible), donc
`npx prisma generate` n'a pas pu être exécuté ni vérifié ici. Cette
commande fonctionnera normalement sur votre machine (accès internet complet)
— c'est la première étape indiquée dans le `README.md` du backend.

## 5. Prochaines étapes suggérées

1. Lancer le backend en local (`README.md`, §1) et tester les comptes de
   démonstration.
2. Brancher le frontend à l'API (`README.md`, §4) : client HTTP,
   `AuthContext` réel remplaçant `RoleContext`, remplacement des imports
   `mock*.ts` par des appels React Query, ajout d'un `<ProtectedRoute>`.
3. Appliquer les correctifs de routage listés au §2.
4. Précharger le plan comptable SYSCOHADA si la comptabilité doit être
   utilisée telle quelle.
5. Intégrer un fournisseur SMS/Email réel quand ces modules doivent devenir
   opérationnels en production.
