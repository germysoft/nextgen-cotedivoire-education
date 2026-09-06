-- ============================================================================
-- PARTITIONNEMENT PAR ANNÉE — à exécuter UNE SEULE FOIS, après le tout
-- premier `npx prisma migrate dev --name init` (donc sur des tables vides
-- ou en tout début de projet — voir AZURE_DEPLOYMENT.md pour la procédure
-- complète, y compris la variante "tables déjà remplies").
--
-- Pourquoi en dehors de Prisma Migrate ? Prisma ne sait pas générer de
-- tables PARTITION BY nativement. On sort donc ces 5 tables du circuit
-- normal de `prisma migrate dev` : Prisma continue de faire du CRUD dessus
-- normalement (INSERT/SELECT/UPDATE/DELETE fonctionnent à l'identique sur
-- une table partitionnée), mais si vous ajoutez une COLONNE à l'une de ces
-- 5 tables plus tard, faites-le à la main via `ALTER TABLE ... ADD COLUMN`
-- (safe sur une table partitionnée) plutôt que de laisser
-- `prisma migrate dev` recréer la table.
--
-- Tables concernées : celles qui grossissent chaque année scolaire.
-- Chaque table reçoit une colonne `annee` (INT), remplie automatiquement
-- par trigger à partir de sa date de référence, et devient PARTITION BY
-- RANGE (annee).
-- ============================================================================

-- Fonction générique : déduit l'année scolaire (sept. → août) à partir
-- d'une date. Le mois >= 9 (septembre) démarre l'année scolaire N ; sinon
-- on est encore dans l'année scolaire N-1 commencée en septembre précédent.
CREATE OR REPLACE FUNCTION annee_scolaire_de(d TIMESTAMP) RETURNS INT AS $$
BEGIN
  RETURN CASE WHEN EXTRACT(MONTH FROM d) >= 9
    THEN EXTRACT(YEAR FROM d)::INT
    ELSE EXTRACT(YEAR FROM d)::INT - 1
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ----------------------------------------------------------------------------
-- Gabarit appliqué à chaque table : renommer l'originale, créer la version
-- partitionnée avec les mêmes colonnes + `annee`, créer les partitions pour
-- l'année scolaire en cours et la suivante, copier les données existantes
-- (s'il y en a), puis supprimer l'ancienne table.
-- ----------------------------------------------------------------------------

-- === Note ===
ALTER TABLE "Note" RENAME TO "Note_old";
CREATE TABLE "Note" (
  LIKE "Note_old" INCLUDING ALL EXCLUDING INDEXES,
  "annee" INT NOT NULL DEFAULT 0
) PARTITION BY RANGE ("annee");

CREATE OR REPLACE FUNCTION trg_note_annee() RETURNS TRIGGER AS $$
BEGIN NEW."annee" := annee_scolaire_de(NEW."dateEvaluation"); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_annee_note BEFORE INSERT OR UPDATE ON "Note"
  FOR EACH ROW EXECUTE FUNCTION trg_note_annee();

INSERT INTO "Note" SELECT *, annee_scolaire_de("dateEvaluation") FROM "Note_old";
DROP TABLE "Note_old";
CREATE INDEX "Note_eleveId_periodeId_idx" ON "Note" ("eleveId", "periodeId");

-- === Absence ===
ALTER TABLE "Absence" RENAME TO "Absence_old";
CREATE TABLE "Absence" (
  LIKE "Absence_old" INCLUDING ALL EXCLUDING INDEXES,
  "annee" INT NOT NULL DEFAULT 0
) PARTITION BY RANGE ("annee");

CREATE OR REPLACE FUNCTION trg_absence_annee() RETURNS TRIGGER AS $$
BEGIN NEW."annee" := annee_scolaire_de(NEW."date"); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_annee_absence BEFORE INSERT OR UPDATE ON "Absence"
  FOR EACH ROW EXECUTE FUNCTION trg_absence_annee();

INSERT INTO "Absence" SELECT *, annee_scolaire_de("date") FROM "Absence_old";
DROP TABLE "Absence_old";
CREATE INDEX "Absence_eleveId_date_idx" ON "Absence" ("eleveId", "date");

-- === Pointage ===
ALTER TABLE "Pointage" RENAME TO "Pointage_old";
CREATE TABLE "Pointage" (
  LIKE "Pointage_old" INCLUDING ALL EXCLUDING INDEXES,
  "annee" INT NOT NULL DEFAULT 0
) PARTITION BY RANGE ("annee");

CREATE OR REPLACE FUNCTION trg_pointage_annee() RETURNS TRIGGER AS $$
BEGIN NEW."annee" := annee_scolaire_de(NEW."date"); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_annee_pointage BEFORE INSERT OR UPDATE ON "Pointage"
  FOR EACH ROW EXECUTE FUNCTION trg_pointage_annee();

INSERT INTO "Pointage" SELECT *, annee_scolaire_de("date") FROM "Pointage_old";
DROP TABLE "Pointage_old";
CREATE INDEX "Pointage_personnelId_date_idx" ON "Pointage" ("personnelId", "date");

-- === EcritureComptable ===
ALTER TABLE "EcritureComptable" RENAME TO "EcritureComptable_old";
CREATE TABLE "EcritureComptable" (
  LIKE "EcritureComptable_old" INCLUDING ALL EXCLUDING INDEXES,
  "annee" INT NOT NULL DEFAULT 0
) PARTITION BY RANGE ("annee");

CREATE OR REPLACE FUNCTION trg_ecriture_annee() RETURNS TRIGGER AS $$
BEGIN NEW."annee" := annee_scolaire_de(NEW."date"); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_annee_ecriture BEFORE INSERT OR UPDATE ON "EcritureComptable"
  FOR EACH ROW EXECUTE FUNCTION trg_ecriture_annee();

INSERT INTO "EcritureComptable" SELECT *, annee_scolaire_de("date") FROM "EcritureComptable_old";
DROP TABLE "EcritureComptable_old";

-- === AuditLog ===
ALTER TABLE "AuditLog" RENAME TO "AuditLog_old";
CREATE TABLE "AuditLog" (
  LIKE "AuditLog_old" INCLUDING ALL EXCLUDING INDEXES,
  "annee" INT NOT NULL DEFAULT 0
) PARTITION BY RANGE ("annee");

CREATE OR REPLACE FUNCTION trg_auditlog_annee() RETURNS TRIGGER AS $$
BEGIN NEW."annee" := annee_scolaire_de(NEW."createdAt"); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_annee_auditlog BEFORE INSERT OR UPDATE ON "AuditLog"
  FOR EACH ROW EXECUTE FUNCTION trg_auditlog_annee();

INSERT INTO "AuditLog" SELECT *, annee_scolaire_de("createdAt") FROM "AuditLog_old";
DROP TABLE "AuditLog_old";
CREATE INDEX "AuditLog_module_createdAt_idx" ON "AuditLog" ("module", "createdAt");

-- ----------------------------------------------------------------------------
-- Partitions pour l'année scolaire en cours et la suivante. Ajustez
-- l'année de départ si besoin ; ce script est idempotent grâce à
-- IF NOT EXISTS. Pour les années suivantes, utilisez plutôt
-- `npm run partition:create -- <annee>` (scripts/create-yearly-partition.ts),
-- qui fait exactement ceci de façon automatisée.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  annee_courante INT := annee_scolaire_de(NOW());
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['Note', 'Absence', 'Pointage', 'EcritureComptable', 'AuditLog']
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
      tbl || '_' || annee_courante, tbl, annee_courante, annee_courante + 1
    );
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
      tbl || '_' || (annee_courante + 1), tbl, annee_courante + 1, annee_courante + 2
    );
    -- Partition "fourre-tout" pour les données antérieures (import, historique repris) :
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (MINVALUE) TO (%L)',
      tbl || '_avant_' || annee_courante, tbl, annee_courante
    );
  END LOOP;
END $$;
