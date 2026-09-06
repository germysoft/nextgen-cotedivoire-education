import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Livre {
  id: string;
  isbn?: string;
  titre: string;
  auteur: string;
  categorie?: string;
  exemplairesDisponibles: number;
  nombreExemplaires: number;
}

export function useLivresQuery(q?: string) {
  return useQuery({
    queryKey: ['livres', q],
    queryFn: async () => {
      const { data } = await api.get<Livre[]>('/bibliotheque/livres', { params: { q } });
      return data;
    },
  });
}

export interface Emprunt {
  id: string;
  livreId: string;
  livre: Livre;
  eleveId?: string;
  eleve?: {
    id: string;
    nom: string;
    prenom: string;
    inscriptions?: Array<{ classe: { nom: string } }>;
  };
  dateEmprunt: string;
  dateRetourPrevue: string;
  dateRetourEffective?: string;
  statut: 'En cours' | 'Retourné' | 'En retard' | 'Perdu';
  penalite?: number;
}

export function useEmpruntsQuery(statut?: string) {
  return useQuery({
    queryKey: ['emprunts', statut],
    queryFn: async () => {
      const { data } = await api.get<Emprunt[]>('/bibliotheque/emprunts', { params: { statut } });
      return data;
    },
  });
}

export interface CreateEmpruntInput {
  livreId: string;
  eleveId?: string;
  dureeJours?: number;
}

export function useCreateEmprunt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEmpruntInput) => {
      const { data } = await api.post<Emprunt>('/bibliotheque/emprunts', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprunts'] });
      queryClient.invalidateQueries({ queryKey: ['livres'] });
    },
  });
}

export function useRetournerEmprunt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Emprunt & { joursRetard: number }>(`/bibliotheque/emprunts/${id}/retour`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprunts'] });
      queryClient.invalidateQueries({ queryKey: ['livres'] });
    },
  });
}
