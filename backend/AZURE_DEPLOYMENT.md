# Déploiement sur Azure

Ce guide couvre le déploiement complet : base de données, stockage des
fichiers, hébergement de l'API et du frontend, et la maintenance annuelle
(partitionnement + archivage).

> Note sur les commandes `az` ci-dessous : Azure CLI a connu des changements
> de syntaxe sur le module `postgres flexible-server` courant 2026
> (renommage de certains arguments). Si une commande échoue, vérifiez
> d'abord `az postgres flexible-server <sous-commande> --help` — la version
> Portail (recommandée ci-dessous en premier) n'est pas affectée par ce
> genre de changement.

## 1. Base de données — Azure Database for PostgreSQL Flexible Server

### Via le Portail Azure (recommandé)
1. Portail Azure → **Créer une ressource** → **Azure Database for PostgreSQL flexible server**
2. Onglet Général : choisissez la région la plus proche (ex. France Central
   si vos utilisateurs sont en Afrique de l'Ouest francophone, ou une région
   Azure Africa si disponible pour votre offre), nommez le serveur (ex.
   `nextgen-education-db`), version PostgreSQL 16.
3. Onglet Calcul + stockage : niveau **Burstable, B1ms** pour démarrer
   (quelques dollars/mois) — vous pourrez monter en gamme plus tard sans
   recréer le serveur.
4. Onglet Mise en réseau : autorisez l'accès depuis les services Azure
   (pour que votre App Service puisse s'y connecter), et ajoutez votre IP
   pour l'administration depuis votre poste.
5. Créez, puis dans **Bases de données** du serveur créé, ajoutez une base
   nommée `nextgen_education`.
6. Récupérez la chaîne de connexion dans **Paramètres de connexion** —
   adaptez-la au format attendu par Prisma :
   ```
   postgresql://<user>:<password>@<server>.postgres.database.azure.com:5432/nextgen_education?sslmode=require
   ```
   (`sslmode=require` est obligatoire — Azure Postgres Flexible Server
   refuse les connexions non chiffrées par défaut.)

### Équivalent CLI (rapide, si vous préférez)
```bash
az postgres flexible-server create \
  --resource-group nextgen-education-rg \
  --name nextgen-education-db \
  --location francecentral \
  --tier Burstable --sku-name Standard_B1ms \
  --storage-size 32 \
  --version 16 \
  --admin-user adminschool --admin-password "<mot-de-passe-fort>"

az postgres flexible-server db create \
  --resource-group nextgen-education-rg \
  --server-name nextgen-education-db \
  --database-name nextgen_education
```

## 2. Stockage des fichiers — Azure Blob Storage

### Créer le compte de stockage
Portail Azure → **Créer une ressource** → **Compte de stockage** → même
groupe de ressources, niveau **Standard**, redondance **LRS** (suffisant
pour démarrer ; passez en GRS si vous voulez une réplication inter-région).

Une fois créé, dans **Sécurité + réseau → Clés d'accès**, copiez une chaîne
de connexion — c'est la valeur de `AZURE_STORAGE_CONNECTION_STRING` dans
`backend/.env`. Les conteneurs `photos` et `documents` sont créés
automatiquement au démarrage du serveur (voir `src/lib/blobStorage.ts`) ;
le conteneur `archives-annuelles` est créé automatiquement par
`scripts/archive-partition.ts` au premier archivage.

### Politique de cycle de vie (historisation automatique)
Dans le compte de stockage → **Gestion du cycle de vie** → **Ajouter une
règle** :
- Nom : `historisation-archives`
- Portée : conteneur `archives-annuelles`
- Action : après **90 jours** sans modification, basculer vers **Archive**
  (le niveau le moins cher, adapté à des données qu'on ne consulte quasiment
  jamais — une réhydratation prend quelques heures si besoin).

Vous pouvez ajouter une règle similaire sur `documents` (ex. bascule vers
**Cool** après 180 jours) si vous voulez aussi réduire le coût des vieux
bulletins sans les sortir du conteneur actif.

## 3. Hébergement de l'API (backend Express)

Option la plus simple : **Azure App Service** (Linux, Node 20).

```bash
az appservice plan create --name nextgen-plan --resource-group nextgen-education-rg --sku B1 --is-linux
az webapp create --resource-group nextgen-education-rg --plan nextgen-plan \
  --name nextgen-education-api --runtime "NODE:20-lts"
```

Configurez les variables d'environnement (Portail → votre App Service →
**Variables d'environnement**, ou en CLI) : toutes celles de
`backend/.env.example` (`DATABASE_URL`, `JWT_ACCESS_SECRET`,
`JWT_REFRESH_SECRET`, `AZURE_STORAGE_CONNECTION_STRING`, `CORS_ORIGIN` avec
l'URL de votre frontend déployé).

Déploiement du code : le plus simple est de connecter le dépôt GitHub
directement dans **Déploiement → Centre de déploiement** de l'App Service
(déploiement continu à chaque push sur `main`), en pointant sur le dossier
`backend/`. Azure exécute `npm install && npm run build` puis
`npm start` automatiquement pour un projet Node.

**Après le tout premier déploiement**, connectez-vous une fois en SSH
(Portail → App Service → **Console SSH**) ou exécutez en local avec
`DATABASE_URL` pointant vers Azure, pour :
```bash
npx prisma migrate deploy   # crée toutes les tables
npm run seed                 # comptes de démonstration (à adapter/retirer en prod réelle)
```
Puis appliquez **une seule fois** `scripts/setup-partitioning.sql` (voir
section 4) avec `psql` :
```bash
psql "$DATABASE_URL" -f scripts/setup-partitioning.sql
```

## 4. Partitionnement par année scolaire

Le schéma de données est conçu pour qu'une seule base vive dans la durée
(pas une nouvelle base chaque année — voir la discussion qui a motivé ce
choix). Les tables qui grossissent chaque année (`Note`, `Absence`,
`Pointage`, `EcritureComptable`, `AuditLog`) sont partitionnées nativement
par PostgreSQL, une partition par année scolaire.

- **Mise en place initiale** : `scripts/setup-partitioning.sql`, à exécuter
  une seule fois juste après le tout premier `prisma migrate deploy`.
- **Chaque nouvelle année scolaire** (ex. en août, avant la rentrée) :
  ```bash
  npm run partition:create -- 2027
  ```
  crée les partitions couvrant l'année scolaire 2027-2028. À automatiser
  via une tâche planifiée (Azure Automation, ou simplement un rappel
  annuel) si vous préférez ne pas y penser.
- **Ajout d'une colonne** à l'une de ces 5 tables plus tard : faites-le à la
  main (`ALTER TABLE ... ADD COLUMN`, sûr sur une table partitionnée)
  plutôt que de laisser `prisma migrate dev` recréer la table — ajustez
  aussi `schema.prisma` en conséquence pour que Prisma Client reste
  synchronisé.

## 5. Archivage annuel (historisation réelle)

Une fois qu'une année scolaire est bien terminée (délibérations closes,
bulletins envoyés), archivez ses partitions les plus anciennes :

```bash
npm run partition:archive -- Note 2022            # exporte + upload vers Azure Blob (Cool)
npm run partition:archive -- Note 2022 --drop      # + supprime la partition locale après vérification
```

À répéter pour chaque table (`Absence`, `Pointage`, `EcritureComptable`,
`AuditLog`). Le script ne supprime **jamais** de données sans avoir
d'abord vérifié que l'upload a réussi (taille du blob comparée à celle du
fichier exporté). Les données archivées restent restaurables via
`pg_restore` si besoin un jour (format `--format=custom` de `pg_dump`).

**Recommandation de calendrier** : gardez au moins 2-3 années scolaires
"chaudes" dans la base active (l'année en cours + les précédentes encore
consultées régulièrement pour des comparaisons), et archivez au-delà —
à ajuster selon vos obligations légales de conservation des dossiers
scolaires en Côte d'Ivoire, que je vous invite à vérifier auprès du
ministère (MENA) ou d'un juriste si un chiffre précis vous engage.

## 6. Frontend

Le frontend (Vite/React) se déploie séparément, par exemple sur **Azure
Static Web Apps** (gratuit pour un usage modéré, intègre CI/CD GitHub
directement) : Portail Azure → **Créer une ressource** → **Static Web App**
→ connectez le même dépôt GitHub, dossier d'app `/` (racine du repo,
puisque le frontend est à la racine), dossier de build `dist`, commande de
build `npm run build`. Ajoutez `VITE_API_URL` pointant vers l'URL de votre
App Service backend dans les paramètres de configuration de la Static Web
App.

## Résumé des ressources Azure créées

| Ressource | Rôle |
|---|---|
| Azure Database for PostgreSQL Flexible Server | Base de données relationnelle (élèves, notes, finance...) |
| Azure Blob Storage (comptes `photos`, `documents`, `archives-annuelles`) | Fichiers + historisation |
| Azure App Service (Linux, Node) | Hébergement de l'API backend |
| Azure Static Web Apps | Hébergement du frontend |
