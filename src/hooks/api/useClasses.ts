import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Eleve } from './useEleves';

export interface Classe {
  id: string;
  nom: string;
  niveau: string;
  cycle: string;
  serie?: string;
  effectifMax: number;
  anneeScolaireId: string;
  professeurPrincipalId?: string;
  professeurPrincipal?: { id: string; nom: string; prenom: string };
  _count?: { inscriptions: number };
}

export interface ClasseDetail extends Classe {
  inscriptions: Array<{ id: string; eleve: Eleve }>;
  cours: Array<{
    id: string;
    jourSemaine: number;
    heureDebut: string;
    heureFin: string;
    matiere: { id: string; nom: string };
    personnel: { id: string; nom: string; prenom: string };
    salle?: { id: string; nom: string };
  }>;
}

export interface AnneeScolaireActive {
  id: string;
  libelle: string;
  dateDebut: string;
  dateFin: string;
  periodes: Array<{ id: string; type: string; numero: number; dateDebut: string; dateFin: string }>;
}

export function useAnneeScolaireActive() {
  return useQuery({
    queryKey: ['annee-scolaire-active'],
    queryFn: async () => {
      const { data } = await api.get<AnneeScolaireActive>('/meta/annee-scolaire-active');
      return data;
    },
    // L'année active change rarement en cours de session : pas la peine de la re-fetch souvent.
    staleTime: 1000 * 60 * 30,
  });
}

export function useClassesQuery(anneeScolaireId?: string) {
  return useQuery({
    queryKey: ['classes', anneeScolaireId],
    queryFn: async () => {
      const { data } = await api.get<Classe[]>('/pedagogie/classes', { params: { anneeScolaireId } });
      return data;
    },
  });
}

export function useClasseQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['classe', id],
    queryFn: async () => {
      const { data } = await api.get<ClasseDetail>(`/pedagogie/classes/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export interface ClasseInput {
  nom: string;
  niveau: string;
  cycle: string;
  serie?: string;
  effectifMax?: number;
  anneeScolaireId: string;
  professeurPrincipalId?: string;
}

export function useCreateClasse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ClasseInput) => {
      const { data } = await api.post<Classe>('/pedagogie/classes', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });
}

export function useUpdateClasse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ClasseInput> & { id: string }) => {
      const { data } = await api.put<Classe>(`/pedagogie/classes/${id}`, input);
      return data;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classe', variables.id] });
    },
  });
}

/**
 * Suppression réelle (pas de désactivation logique côté backend pour les
 * classes) : échouera avec un message clair si des élèves y sont encore
 * inscrits (contrainte de clé étrangère), ce qui est le comportement voulu.
 */
export function useDeleteClasse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pedagogie/classes/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });
}

const JOURS = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export function nomJour(jourSemaine: number) {
  return JOURS[jourSemaine] ?? `Jour ${jourSemaine}`;
}
