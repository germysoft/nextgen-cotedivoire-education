/**
 * Crée les partitions de l'année scolaire donnée pour les 5 tables
 * partitionnées (voir scripts/setup-partitioning.sql pour la mise en place
 * initiale). Idempotent : ne fait rien si la partition existe déjà.
 *
 * Usage :
 *   npm run partition:create -- 2027
 *   (crée les partitions couvrant l'année scolaire 2027-2028)
 */
import 'dotenv/config';
import { Client } from 'pg';

const TABLES = ['Note', 'Absence', 'Pointage', 'EcritureComptable', 'AuditLog'];

async function main() {
  const annee = parseInt(process.argv[2], 10);
  if (!annee || annee < 2000 || annee > 2100) {
    console.error('Usage: npm run partition:create -- <annee>  (ex: 2027)');
    process.exit(1);
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    for (const table of TABLES) {
      const partitionName = `${table}_${annee}`;
      const exists = await client.query(
        `SELECT 1 FROM pg_class WHERE relname = $1`,
        [partitionName]
      );
      if (exists.rowCount && exists.rowCount > 0) {
        console.log(`⏭️  ${partitionName} existe déjà, ignorée.`);
        continue;
      }
      await client.query(
        `CREATE TABLE "${partitionName}" PARTITION OF "${table}" FOR VALUES FROM (${annee}) TO (${annee + 1})`
      );
      console.log(`✅ ${partitionName} créée (année scolaire ${annee}-${annee + 1}).`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Échec de la création des partitions :', err.message);
  process.exit(1);
});
