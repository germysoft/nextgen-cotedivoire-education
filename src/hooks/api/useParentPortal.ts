import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Eleve } from './useEleves';
import { EcheancePaiement } from './useFinance';

export function useEnfantsQuery() {
  return useQuery({
    queryKey: ['portail-enfants'],
    queryFn: async () => {
      const { data } = await api.get<Eleve[]>('/portail-parents/enfants');
      return data;
    },
  });
}

export interface NoteEnfant {
  id: string;
  matiere: { id: string; nom: string };
  type: string;
  valeur: number;
  noteMax: number;
  coefficient: number;
  dateEvaluation: string;
}

export function useNotesEnfantQuery(eleveId: string | undefined) {
  return useQuery({
    queryKey: ['portail-notes', eleveId],
    queryFn: async () => {
      const { data } = await api.get<NoteEnfant[]>(`/portail-parents/notes/${eleveId}`);
      return data;
    },
    enabled: !!eleveId,
  });
}

export interface AbsenceEnfant {
  id: string;
  date: string;
  justifiee: boolean;
  motif?: string;
  dureeHeures: number;
}

export function useAbsencesEnfantQuery(eleveId: string | undefined) {
  return useQuery({
    queryKey: ['portail-absences', eleveId],
    queryFn: async () => {
      const { data } = await api.get<AbsenceEnfant[]>(`/portail-parents/absences/${eleveId}`);
      return data;
    },
    enabled: !!eleveId,
  });
}

export function useEcheancesEnfantQuery(eleveId: string | undefined) {
  return useQuery({
    queryKey: ['portail-echeances', eleveId],
    queryFn: async () => {
      const { data } = await api.get<EcheancePaiement[]>(`/portail-parents/paiements/${eleveId}`);
      return data;
    },
    enabled: !!eleveId,
  });
}

export interface BulletinEnfant {
  id: string;
  periodeId: string;
  anneeScolaire: string;
  moyenneGenerale: number;
  rang?: number;
  effectifClasse?: number;
  genereLe: string;
  envoyeAuxParents: boolean;
  documentUrl?: string;
}

export function useBulletinsEnfantQuery(eleveId: string | undefined) {
  return useQuery({
    queryKey: ['portail-bulletins', eleveId],
    queryFn: async () => {
      const { data } = await api.get<BulletinEnfant[]>(`/portail-parents/bulletins/${eleveId}`);
      return data;
    },
    enabled: !!eleveId,
  });
}
