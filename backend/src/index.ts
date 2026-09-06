import 'dotenv/config';
import { createApp } from './app';
import { ensureContainers } from './lib/blobStorage';

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

app.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`API NextGen Éducation en écoute sur http://localhost:${PORT}`);

  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    try {
      await ensureContainers();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("⚠️  Impossible de vérifier les conteneurs Azure Blob Storage :", (err as Error).message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('⚠️  AZURE_STORAGE_CONNECTION_STRING non défini — les uploads de photos/documents échoueront.');
  }
});
