/**
 * Archive une partition annuelle : exporte les données via pg_dump (format
 * personnalisé, déjà compressé), les téléverse dans Azure Blob Storage, et
 * — uniquement si l'upload est confirmé et que --drop est passé — détache
 * puis supprime la partition locale.
 *
 * Nécessite `pg_dump` installé sur la machine qui exécute le script (client
 * PostgreSQL — `apt install postgresql-client` sous Debian/Ubuntu).
 *
 * Usage :
 *   npm run partition:archive -- Note 2022            # exporte + upload seulement
 *   npm run partition:archive -- Note 2022 --drop      # exporte + upload + supprime la partition locale
 *
 * Variables d'environnement requises : DATABASE_URL, AZURE_STORAGE_CONNECTION_STRING.
 * Conteneur cible : "archives-annuelles" (créé automatiquement s'il n'existe pas).
 */
import 'dotenv/config';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { Client } from 'pg';
import { BlobServiceClient } from '@azure/storage-blob';

const execFileAsync = promisify(execFile);
const CONTAINER = 'archives-annuelles';

async function main() {
  const [table, anneeStr, flag] = process.argv.slice(2);
  const annee = parseInt(anneeStr, 10);
  const drop = flag === '--drop';

  if (!table || !annee) {
    console.error('Usage: npm run partition:archive -- <Table> <annee> [--drop]');
    process.exit(1);
  }

  const partitionName = `${table}_${annee}`;
  const dumpPath = join(tmpdir(), `${partitionName}.dump`);
  const blobName = `${table}/${partitionName}.dump`;

  const dbUrl = process.env.DATABASE_URL;
  const storageConn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!dbUrl || !storageConn) {
    console.error('DATABASE_URL et AZURE_STORAGE_CONNECTION_STRING doivent être définis.');
    process.exit(1);
  }

  console.log(`📦 Export de ${partitionName} via pg_dump...`);
  await execFileAsync('pg_dump', [dbUrl, '--table', partitionName, '--format', 'custom', '--file', dumpPath]);

  const buffer = await readFile(dumpPath);
  console.log(`☁️  Upload vers Azure Blob Storage (${(buffer.length / 1024 / 1024).toFixed(2)} Mo)...`);

  const blobService = BlobServiceClient.fromConnectionString(storageConn);
  const container = blobService.getContainerClient(CONTAINER);
  await container.createIfNotExists();
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(buffer, {
    // Niveau "Cool" au dépôt : une politique de cycle de vie (voir
    // AZURE_DEPLOYMENT.md) le fait basculer vers "Archive" après quelques
    // mois d'inactivité — évite le coût de réhydratation si on doit encore
    // le consulter à court terme après l'archivage.
    tier: 'Cool',
  });

  // Vérification : le blob existe bien et a la bonne taille avant de toucher aux données locales.
  const properties = await blockBlob.getProperties();
  if (properties.contentLength !== buffer.length) {
    throw new Error("La vérification post-upload a échoué (taille du blob différente) — abandon, rien n'a été supprimé localement.");
  }
  console.log(`✅ Archivé avec succès : ${CONTAINER}/${blobName}`);

  await unlink(dumpPath);

  if (drop) {
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    try {
      console.log(`🗑️  Détachement et suppression de la partition locale ${partitionName}...`);
      await client.query(`ALTER TABLE "${table}" DETACH PARTITION "${partitionName}"`);
      await client.query(`DROP TABLE "${partitionName}"`);
      console.log(`✅ Partition locale supprimée. Les données restent disponibles dans ${CONTAINER}/${blobName}.`);
    } finally {
      await client.end();
    }
  } else {
    console.log('ℹ️  Partition locale conservée (relancez avec --drop pour la supprimer après vérification).');
  }
}

main().catch((err) => {
  console.error("Échec de l'archivage :", err.message);
  process.exit(1);
});
