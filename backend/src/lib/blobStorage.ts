import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';

/**
 * Intégration Azure Blob Storage. Les fichiers (photos, bulletins PDF,
 * documents) ne sont jamais stockés en base — seule leur URL l'est (champs
 * `photo`, `documentUrl`... dans schema.prisma). Voir AZURE_DEPLOYMENT.md
 * pour la création du compte de stockage et des règles de cycle de vie
 * (Hot → Cool → Archive) qui gèrent l'historisation des vieux documents.
 */

let blobServiceClient: BlobServiceClient | null = null;

function getBlobService(): BlobServiceClient {
  if (!blobServiceClient) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING n\'est pas défini (voir .env.example).');
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
  return blobServiceClient;
}

function getContainer(name: string): ContainerClient {
  return getBlobService().getContainerClient(name);
}

export const CONTAINERS = {
  photos: 'photos',
  documents: 'documents', // bulletins PDF, certificats, quittances...
} as const;

/** Garantit l'existence des conteneurs utilisés par l'application (à appeler une fois au démarrage). */
export async function ensureContainers(): Promise<void> {
  for (const name of Object.values(CONTAINERS)) {
    await getContainer(name).createIfNotExists();
  }
}

export interface UploadResult {
  url: string;
  blobName: string;
}

/**
 * Téléverse un fichier et retourne son URL publique (le conteneur doit être
 * configuré en accès public en lecture pour les photos/documents non
 * sensibles, ou utilisez generateSasUrl ci-dessous pour un accès temporaire
 * et contrôlé sur des documents sensibles comme les bulletins).
 */
export async function uploadFile(
  container: keyof typeof CONTAINERS,
  buffer: Buffer,
  contentType: string,
  extension: string
): Promise<UploadResult> {
  const blobName = `${randomUUID()}.${extension}`;
  const client = getContainer(CONTAINERS[container]);
  const blockBlob = client.getBlockBlobClient(blobName);
  await blockBlob.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType } });
  return { url: blockBlob.url, blobName };
}

export async function deleteFile(container: keyof typeof CONTAINERS, blobName: string): Promise<void> {
  const client = getContainer(CONTAINERS[container]);
  await client.getBlockBlobClient(blobName).deleteIfExists();
}
