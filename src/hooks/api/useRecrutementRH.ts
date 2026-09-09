import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';

/**
 * Hooks React Query pour les pages RH « Recrutement », « Entretiens » et
 * « Formations », branchées sur les routeurs CRUD génériques :
 *   - /api/rh/recrutements  → modèle Prisma `Recrutement`
 *   - /api/rh/candidatures  → modèle Prisma `Candidature`
 *   - /api/rh/entretiens    → modèle Prisma `Entretien`
 *   - /api/rh/formations    → modèle Prisma `Formation`
 *
 * Le routeur générique (backend/src/utils/crudFactory.ts) renvoie une réponse
 * paginée et NE JOINT AUCUNE RELATION : les pages recoupent donc les identifiants
 * (`recrutementId`, `candidatureId`, `personnelId`) avec les listes déjà chargées,
 * plutôt qu'une requête par ligne de tableau.
 *
 * Les types reflètent exactement les champs du schéma Prisma : aucun champ
 * supplémentaire n'est ajouté côté client.
 */

const PAGE = { params: { pageSize: 200 } };

// ----------------------------------------------------------------- Recrutements

export interface Recrutement {
  id: string;
  poste: string;
  departement?: string | null;
  description?: string | null;
  statut: string; // Ouvert, Fermé, Pourvu
  dateOuverture: string;
  dateCloture?: string | null;
}

export interface RecrutementInput {
  poste: string;
  departement?: string | null;
  description?: string | null;
  statut?: string;
  dateOuverture?: string;
  dateCloture?: string | null;
}

export function useRecrutementsQuery() {
  return useQuery({
    queryKey: ['recrutements'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Recrutement>>('/rh/recrutements', PAGE);
      return data.items;
    },
  });
}

export function useCreateRecrutement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecrutementInput) => (await api.post<Recrutement>('/rh/recrutements', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recrutements'] }),
  });
}

export function useUpdateRecrutement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<RecrutementInput> & { id: string }) =>
      (await api.put<Recrutement>(`/rh/recrutements/${id}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recrutements'] }),
  });
}

export function useDeleteRecrutement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/rh/recrutements/${id}`); },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recrutements'] });
      qc.invalidateQueries({ queryKey: ['candidatures'] });
    },
  });
}

// ----------------------------------------------------------------- Candidatures

export interface Candidature {
  id: string;
  recrutementId: string;
  personnelId?: string | null;
  nomCandidat: string;
  emailCandidat: string;
  telephoneCandidat?: string | null;
  cvUrl?: string | null;
  statut: string; // Reçue, Présélectionnée, Entretien, Acceptée, Refusée
  createdAt: string;
}

export interface CandidatureInput {
  recrutementId: string;
  nomCandidat: string;
  emailCandidat: string;
  telephoneCandidat?: string | null;
  cvUrl?: string | null;
  statut?: string;
}

export function useCandidaturesQuery() {
  return useQuery({
    queryKey: ['candidatures'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Candidature>>('/rh/candidatures', PAGE);
      return data.items;
    },
  });
}

export function useCreateCandidature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CandidatureInput) => (await api.post<Candidature>('/rh/candidatures', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidatures'] }),
  });
}

export function useUpdateCandidature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CandidatureInput> & { id: string }) =>
      (await api.put<Candidature>(`/rh/candidatures/${id}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidatures'] }),
  });
}

export function useDeleteCandidature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/rh/candidatures/${id}`); },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidatures'] });
      qc.invalidateQueries({ queryKey: ['entretiens'] });
    },
  });
}

// ------------------------------------------------------------------- Entretiens

export interface Entretien {
  id: string;
  candidatureId: string;
  intervieweurId?: string | null;
  dateEntretien: string;
  notes?: string | null;
  decision?: string | null; // Favorable, Défavorable, À revoir
}

export interface EntretienInput {
  candidatureId: string;
  intervieweurId?: string | null;
  dateEntretien: string;
  notes?: string | null;
  decision?: string | null;
}

export function useEntretiensQuery() {
  return useQuery({
    queryKey: ['entretiens'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Entretien>>('/rh/entretiens', PAGE);
      return data.items;
    },
  });
}

export function useCreateEntretien() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EntretienInput) => (await api.post<Entretien>('/rh/entretiens', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entretiens'] }),
  });
}

export function useUpdateEntretien() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<EntretienInput> & { id: string }) =>
      (await api.put<Entretien>(`/rh/entretiens/${id}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entretiens'] }),
  });
}

export function useDeleteEntretien() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/rh/entretiens/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entretiens'] }),
  });
}

// ------------------------------------------------------------------- Formations

export interface FormationRH {
  id: string;
  personnelId: string;
  intitule: string;
  organisme: string;
  dateDebut: string;
  dateFin: string;
  dureeHeures: number;
  certifiante: boolean;
  commentaire?: string | null;
}

export interface FormationInput {
  personnelId: string;
  intitule: string;
  organisme: string;
  dateDebut: string;
  dateFin: string;
  dureeHeures: number;
  certifiante?: boolean;
  commentaire?: string | null;
}

export function useFormationsQuery() {
  return useQuery({
    queryKey: ['formations'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<FormationRH>>('/rh/formations', PAGE);
      return data.items;
    },
  });
}

export function useCreateFormation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: FormationInput) => (await api.post<FormationRH>('/rh/formations', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['formations'] }),
  });
}

export function useUpdateFormation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<FormationInput> & { id: string }) =>
      (await api.put<FormationRH>(`/rh/formations/${id}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['formations'] }),
  });
}

export function useDeleteFormation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/rh/formations/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['formations'] }),
  });
}
