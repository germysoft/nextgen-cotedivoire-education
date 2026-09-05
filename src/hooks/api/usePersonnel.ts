import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';

export interface AffectationResume {
  id: string;
  matiere: { id: string; nom: string };
  classe: { id: string; nom: string };
}

export interface Personnel {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  poste: string;
  departement?: string;
  categoriePersonnel: 'Enseignant' | 'Administratif' | 'Technique' | 'Direction' | 'Médical' | 'Surveillance';
  statut: 'Permanent' | 'Vacataire' | 'Contractuel' | 'Stagiaire' | 'Intérimaire';
  actif: boolean;
  affectations?: AffectationResume[];
}

export interface PersonnelQueryParams {
  q?: string;
  page?: number;
  pageSize?: number;
  categoriePersonnel?: string;
}

export function usePersonnelQuery(params: PersonnelQueryParams = {}) {
  return useQuery({
    queryKey: ['personnel', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Personnel>>('/personnel', { params });
      return data;
    },
    placeholderData: (previous) => previous,
  });
}

export interface UpdatePersonnelInput {
  nom?: string;
  prenom?: string;
  telephone?: string;
  email?: string;
  statut?: Personnel['statut'];
}

export function useUpdatePersonnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdatePersonnelInput & { id: string }) => {
      const { data } = await api.put<Personnel>(`/personnel/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['personnel'] }),
  });
}

/** Désactivation logique (l'API ne supprime jamais physiquement un membre du personnel). */
export function useDeactivatePersonnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/personnel/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['personnel'] }),
  });
}
