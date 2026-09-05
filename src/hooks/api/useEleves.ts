import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';

export interface Classe {
  id: string;
  nom: string;
  niveau: string;
}

export interface Inscription {
  id: string;
  classeId: string;
  classe: Classe;
  dateInscription: string;
  statut: string;
}

export interface Eleve {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'Masculin' | 'Féminin';
  adresse?: string;
  groupeSanguin?: string;
  allergies?: string;
  actif: boolean;
  inscriptions?: Inscription[];
}

export interface ElevesQueryParams {
  q?: string;
  page?: number;
  pageSize?: number;
  classeId?: string;
}

export function useElevesQuery(params: ElevesQueryParams = {}) {
  return useQuery({
    queryKey: ['eleves', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Eleve>>('/eleves', { params });
      return data;
    },
    // Les données précédentes restent affichées pendant le chargement de la page suivante.
    placeholderData: (previous) => previous,
  });
}

export function useEleveQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['eleve', id],
    queryFn: async () => {
      const { data } = await api.get<Eleve>(`/eleves/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export interface CreateEleveInput {
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'Masculin' | 'Féminin';
  adresse?: string;
  classeId?: string;
  anneeScolaireId?: string;
}

export function useCreateEleve() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEleveInput) => {
      const { data } = await api.post<Eleve>('/eleves', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eleves'] }),
  });
}

export function useUpdateEleve() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateEleveInput> & { id: string }) => {
      const { data } = await api.put<Eleve>(`/eleves/${id}`, input);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['eleves'] });
      queryClient.invalidateQueries({ queryKey: ['eleve', variables.id] });
    },
  });
}

/** Désactivation logique (l'API ne supprime jamais physiquement un élève, pour la traçabilité MENA/archives). */
export function useDeactivateEleve() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/eleves/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eleves'] }),
  });
}
