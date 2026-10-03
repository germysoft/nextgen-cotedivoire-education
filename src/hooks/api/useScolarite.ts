import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';

/**
 * Hooks React Query du module Scolarité (src/pages/scolarite/).
 *
 * Toutes les entités ci-dessous passent par le routeur CRUD générique
 * (backend/src/routes/generic.routes.ts → crudFactory) : réponse paginée
 * `{ items, total, ... }` et AUCUNE relation jointe. Les pages recoupent
 * `eleveId` / `classeId` / `parentId` avec useElevesQuery / useClassesQuery.
 *
 * Exception : l'inscription d'un élève dans une classe passe par l'endpoint
 * dédié POST /api/eleves/:id/inscrire (upsert sur eleveId + anneeScolaireId).
 */

function genericCrud<T, I>(path: string, key: string) {
  const useList = (params: Record<string, string | undefined> = {}) =>
    useQuery({
      queryKey: [key, params],
      queryFn: async () =>
        (await api.get<PaginatedResponse<T>>(path, { params: { pageSize: 500, ...params } })).data.items,
    });
  const useCreate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async (input: I) => (await api.post<T>(path, input)).data,
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  };
  const useUpdate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, ...input }: Partial<I> & { id: string }) => (await api.put<T>(`${path}/${id}`, input)).data,
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  };
  const useDelete = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => { await api.delete(`${path}/${id}`); },
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  };
  return { useList, useCreate, useUpdate, useDelete };
}

// --------------------------------------------------------------------- Absences

export interface Absence {
  id: string;
  eleveId: string;
  date: string;
  coursId?: string | null;
  justifiee: boolean;
  motif?: string | null;
  dureeHeures: number;
  saisiParId?: string | null;
  createdAt: string;
}
export interface AbsenceInput {
  eleveId: string;
  date: string;
  coursId?: string | null;
  justifiee?: boolean;
  motif?: string | null;
  dureeHeures?: number;
}
const absences = genericCrud<Absence, AbsenceInput>('/scolarite/absences', 'scolarite-absences');
export const useAbsencesQuery = absences.useList;
export const useCreateAbsence = absences.useCreate;
export const useUpdateAbsence = absences.useUpdate;
export const useDeleteAbsence = absences.useDelete;

// -------------------------------------------------------------------- Documents

export interface DocumentEleve {
  id: string;
  eleveId: string;
  type: string;
  nom: string;
  url?: string | null;
  dateAjout: string;
}
export interface DocumentEleveInput { eleveId: string; type: string; nom: string; url?: string | null }
const documents = genericCrud<DocumentEleve, DocumentEleveInput>('/scolarite/documents', 'scolarite-documents');
export const useDocumentsElevesQuery = documents.useList;
export const useCreateDocumentEleve = documents.useCreate;
export const useUpdateDocumentEleve = documents.useUpdate;
export const useDeleteDocumentEleve = documents.useDelete;

// ------------------------------------------------------------------ Certificats

export interface Certificat {
  id: string;
  eleveId: string;
  type: string;
  dateDelivrance: string;
  numeroReference: string;
  contenuHtml?: string | null;
  signePar?: string | null;
}
export interface CertificatInput {
  eleveId: string;
  type: string;
  numeroReference: string;
  dateDelivrance?: string;
  contenuHtml?: string | null;
  signePar?: string | null;
}
const certificats = genericCrud<Certificat, CertificatInput>('/scolarite/certificats', 'scolarite-certificats');
export const useCertificatsQuery = certificats.useList;
export const useCreateCertificat = certificats.useCreate;
export const useUpdateCertificat = certificats.useUpdate;
export const useDeleteCertificat = certificats.useDelete;

/** Référence unique générée côté client : PREFIXE-AAAAMMJJ-HHMMSS-XXX. */
export function genererNumeroReference(type: string) {
  const prefix = (type.normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 3) || 'CER').toUpperCase();
  const d = new Date();
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  return `${prefix}-${stamp}-${p(Math.floor(Math.random() * 1000), 3)}`;
}

// ----------------------------------------------------------------- Inscriptions

export interface Inscription {
  id: string;
  eleveId: string;
  classeId: string;
  anneeScolaireId: string;
  dateInscription: string;
  statut: string; // Inscrit, Redoublant, Transféré, Exclu, Abandonné
  numeroRedoublement: number;
}
export interface InscriptionInput { statut?: string; numeroRedoublement?: number; classeId?: string }
const inscriptions = genericCrud<Inscription, InscriptionInput>('/scolarite/inscriptions', 'scolarite-inscriptions');
export const useInscriptionsQuery = inscriptions.useList;
/** Mise à jour du statut / redoublement d'une inscription existante (générique). */
export const useUpdateInscription = inscriptions.useUpdate;
export const useDeleteInscription = inscriptions.useDelete;

/** Inscription / réinscription via l'endpoint dédié (upsert eleveId + anneeScolaireId). */
export function useInscrireEleve() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ eleveId, classeId, anneeScolaireId }: { eleveId: string; classeId: string; anneeScolaireId: string }) =>
      (await api.post<Inscription>(`/eleves/${eleveId}/inscrire`, { classeId, anneeScolaireId })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scolarite-inscriptions'] });
      qc.invalidateQueries({ queryKey: ['eleves'] });
    },
  });
}

// ------------------------------------------------------- Parents & liens parents
// Aucune page du dossier scolarite/ ne gère encore les parents : hooks prêts pour la suite.

export interface ParentProfil {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  profession?: string | null;
  adresse?: string | null;
  createdAt: string;
}
export type ParentProfilInput = Omit<ParentProfil, 'id' | 'createdAt'>;
const parents = genericCrud<ParentProfil, ParentProfilInput>('/scolarite/parents', 'scolarite-parents');
export const useParentsQuery = parents.useList;
export const useCreateParent = parents.useCreate;
export const useUpdateParent = parents.useUpdate;
export const useDeleteParent = parents.useDelete;

export interface LienParent {
  id: string;
  eleveId: string;
  parentId: string;
  lien: string; // Père, Mère, Tuteur...
  responsableLegal: boolean;
}
export type LienParentInput = Omit<LienParent, 'id'>;
const liens = genericCrud<LienParent, LienParentInput>('/scolarite/liens-parents', 'scolarite-liens-parents');
export const useLiensParentsQuery = liens.useList;
export const useCreateLienParent = liens.useCreate;
export const useUpdateLienParent = liens.useUpdate;
export const useDeleteLienParent = liens.useDelete;
