import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Conge {
  id: string;
  personnelId: string;
  personnel: { id: string; nom: string; prenom: string; poste: string };
  remplacantId?: string;
  remplacant?: { id: string; nom: string; prenom: string } | null;
  type: string;
  dateDebut: string;
  dateFin: string;
  nombreJours: number;
  motif?: string;
  contact?: string;
  statut: 'En attente' | 'Validé' | 'Refusé';
  createdAt: string;
}

export function useCongesQuery() {
  return useQuery({
    queryKey: ['conges'],
    queryFn: async () => {
      const { data } = await api.get<Conge[]>('/personnel/conges/all');
      return data;
    },
  });
}

export interface CreateCongeInput {
  personnelId: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  motif?: string;
  remplacantId?: string;
  contact?: string;
}

export function useCreateConge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCongeInput) => {
      const { data } = await api.post<Conge>('/personnel/conges', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conges'] }),
  });
}

export function useUpdateCongeStatut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: Conge['statut'] }) => {
      const { data } = await api.put<Conge>(`/personnel/conges/${id}/statut`, { statut });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conges'] });
      queryClient.invalidateQueries({ queryKey: ['personnel'] }); // le solde de congés change à la validation
    },
  });
}
