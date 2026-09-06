import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';
import { Personnel } from './usePersonnel';

/**
 * Hooks React Query pour les pages RH branchées sur l'API réelle :
 * - Affectations enseignant/classe/matière → /api/pedagogie/affectations
 * - Pointage du personnel                  → /api/personnel/pointage
 * - Contrats                               → /api/rh/contrats (routeur CRUD générique)
 * - Évaluations                            → /api/personnel/evaluations
 *
 * Les types reflètent exactement ce que renvoient ces routes (voir
 * backend/src/routes/pedagogie.routes.ts, personnel.routes.ts et
 * generic.routes.ts) : aucun champ n'est ajouté côté client.
 */

// ---------------------------------------------------------------- Affectations

export interface Affectation {
  id: string;
  personnelId: string;
  personnel: Personnel;
  classeId: string;
  classe: { id: string; nom: string; niveau: string; cycle: string };
  matiereId: string;
  matiere: { id: string; nom: string; code?: string | null };
  coefficient?: number | null;
  chargeHoraireHebdo: number;
}

export function useAffectationsQuery(params: { personnelId?: string; classeId?: string } = {}) {
  return useQuery({
    queryKey: ['affectations', params],
    queryFn: async () => {
      const { data } = await api.get<Affectation[]>('/pedagogie/affectations', { params });
      return data;
    },
  });
}

export interface AffectationInput {
  personnelId: string;
  classeId: string;
  matiereId: string;
  coefficient?: number;
  chargeHoraireHebdo?: number;
}

export function useCreateAffectation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AffectationInput) => {
      const { data } = await api.post<Affectation>('/pedagogie/affectations', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['affectations'] }),
  });
}

export function useUpdateAffectation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<AffectationInput> & { id: string }) => {
      const { data } = await api.put<Affectation>(`/pedagogie/affectations/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['affectations'] }),
  });
}

export function useDeleteAffectation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pedagogie/affectations/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['affectations'] }),
  });
}

/** Liste des matières réelles, nécessaire aux formulaires d'affectation. */
export function useMatieresQuery() {
  return useQuery({
    queryKey: ['matieres'],
    queryFn: async () => {
      const { data } = await api.get<Array<{ id: string; nom: string; code?: string | null }>>('/pedagogie/matieres');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

// ------------------------------------------------------------------- Pointage

export interface Pointage {
  id: string;
  personnelId: string;
  personnel: Personnel;
  date: string;
  heureArrivee?: string | null;
  heureDepart?: string | null;
  statut: 'Présent' | 'Absent' | 'Retard' | 'Congé';
  commentaire?: string | null;
}

export function usePointagesQuery(params: { date?: string; personnelId?: string } = {}) {
  return useQuery({
    queryKey: ['pointages', params],
    queryFn: async () => {
      const { data } = await api.get<Pointage[]>('/personnel/pointage/all', { params });
      return data;
    },
  });
}

export interface PointageInput {
  personnelId: string;
  date: string;
  heureArrivee?: string;
  heureDepart?: string;
  statut?: Pointage['statut'];
  commentaire?: string;
}

export function useCreatePointage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PointageInput) => {
      const { data } = await api.post<Pointage>('/personnel/pointage', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pointages'] }),
  });
}

export function useUpdatePointage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<PointageInput> & { id: string }) => {
      const { data } = await api.put<Pointage>(`/personnel/pointage/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pointages'] }),
  });
}

export function useDeletePointage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/personnel/pointage/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pointages'] }),
  });
}

// ------------------------------------------------------------------- Contrats

/**
 * Forme exacte du modèle Prisma `Contrat`. Le routeur générique ne joint pas
 * la relation `personnel` : la page recoupe `personnelId` avec la liste du
 * personnel déjà chargée.
 */
export interface Contrat {
  id: string;
  personnelId: string;
  typeContrat: string;
  dateDebut: string;
  dateFin?: string | null;
  salaire: number;
  documentUrl?: string | null;
  statut: string; // Actif, Terminé, Résilié
  createdAt: string;
}

export function useContratsQuery() {
  return useQuery({
    queryKey: ['contrats'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Contrat>>('/rh/contrats', { params: { pageSize: 200 } });
      return data.items;
    },
  });
}

export interface ContratInput {
  personnelId: string;
  typeContrat: string;
  dateDebut: string;
  dateFin?: string | null;
  salaire: number;
  statut?: string;
}

export function useCreateContrat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ContratInput) => {
      const { data } = await api.post<Contrat>('/rh/contrats', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contrats'] }),
  });
}

export function useUpdateContrat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ContratInput> & { id: string }) => {
      const { data } = await api.put<Contrat>(`/rh/contrats/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contrats'] }),
  });
}

export function useDeleteContrat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/rh/contrats/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contrats'] }),
  });
}

// ---------------------------------------------------------------- Évaluations

export interface CritereEvaluation {
  categorie: string;
  critere: string;
  note: number;
  poids: number;
}

export interface EvaluationRH {
  id: string;
  personnelId: string;
  personnel: Personnel;
  evaluateurId: string;
  evaluateur: Personnel;
  periode: string;
  dateEvaluation: string;
  typeEvaluation: 'Annuelle' | 'Semestrielle' | 'Trimestrielle' | 'Probatoire';
  statut: string;
  criteres: CritereEvaluation[];
  noteGlobale?: number | null;
  appreciationGenerale?: string | null;
  createdAt: string;
}

export function useEvaluationsRHQuery() {
  return useQuery({
    queryKey: ['evaluations-rh'],
    queryFn: async () => {
      const { data } = await api.get<EvaluationRH[]>('/personnel/evaluations/all');
      return data;
    },
  });
}

export interface EvaluationInput {
  personnelId: string;
  evaluateurId: string;
  periode: string;
  dateEvaluation: string;
  typeEvaluation: EvaluationRH['typeEvaluation'];
  criteres: CritereEvaluation[];
  appreciationGenerale?: string;
}

export function useCreateEvaluationRH() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EvaluationInput) => {
      const { data } = await api.post<EvaluationRH>('/personnel/evaluations', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['evaluations-rh'] }),
  });
}
