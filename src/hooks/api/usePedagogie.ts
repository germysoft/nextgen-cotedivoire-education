import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';

/**
 * Hooks React Query du module Pédagogie (src/pages/pedagogie/).
 *
 * Routes dédiées (backend/src/routes/pedagogie.routes.ts) — réponses en tableau, relations jointes :
 *   - /pedagogie/matieres         GET/POST/PUT/DELETE
 *   - /pedagogie/emploi-du-temps  GET/POST/PUT/DELETE (409 si conflit enseignant/salle)
 *   - /pedagogie/discipline       GET/POST/PUT/DELETE
 * Les affectations réutilisent les hooks existants de useRH.ts (useAffectationsQuery, etc.)
 * et la lecture des matières réutilise useMatieresQuery de useRH.ts (même clé ['matieres']).
 *
 * Routes génériques (crudFactory) — réponse paginée, AUCUNE relation jointe :
 *   - /pedagogie/salles           (module RBAC « infrastructures »)
 *   - /pedagogie/conseils-classe
 *   - /pedagogie/elearning
 */

export { useMatieresQuery, useAffectationsQuery, useCreateAffectation, useUpdateAffectation, useDeleteAffectation } from './useRH';
export type { Affectation, AffectationInput } from './useRH';

const invalidate = (keys: string[][]) => {
  const qc = useQueryClient();
  return { qc, onSuccess: () => keys.forEach((k) => qc.invalidateQueries({ queryKey: k })) };
};

// ------------------------------------------------------------------- Matières

export interface Matiere {
  id: string;
  nom: string;
  code?: string | null;
  coefficientDefaut: number;
}
export interface MatiereInput { nom: string; code?: string; coefficientDefaut?: number }

export function useCreateMatiere() {
  const { onSuccess } = invalidate([['matieres']]);
  return useMutation({
    mutationFn: async (input: MatiereInput) => (await api.post<Matiere>('/pedagogie/matieres', input)).data,
    onSuccess,
  });
}
export function useUpdateMatiere() {
  const { onSuccess } = invalidate([['matieres']]);
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<MatiereInput> & { id: string }) =>
      (await api.put<Matiere>(`/pedagogie/matieres/${id}`, input)).data,
    onSuccess,
  });
}
export function useDeleteMatiere() {
  const { onSuccess } = invalidate([['matieres']]);
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/pedagogie/matieres/${id}`); },
    onSuccess,
  });
}

// -------------------------------------------------------------- Emploi du temps

export interface Cours {
  id: string;
  classeId: string;
  matiereId: string;
  matiere: Matiere;
  personnelId: string;
  personnel: { id: string; nom: string; prenom: string };
  salleId?: string | null;
  salle?: { id: string; nom: string } | null;
  jourSemaine: number; // 1 = lundi … 7 = dimanche
  heureDebut: string; // "08:00"
  heureFin: string;
}
export interface CoursInput {
  classeId: string;
  matiereId: string;
  personnelId: string;
  salleId?: string;
  jourSemaine: number;
  heureDebut: string;
  heureFin: string;
}

export function useEmploiDuTempsQuery(params: { classeId?: string; personnelId?: string } = {}) {
  return useQuery({
    queryKey: ['emploi-du-temps', params],
    queryFn: async () => (await api.get<Cours[]>('/pedagogie/emploi-du-temps', { params })).data,
  });
}
export function useCreateCours() {
  const { onSuccess } = invalidate([['emploi-du-temps']]);
  return useMutation({
    mutationFn: async (input: CoursInput) => (await api.post<Cours>('/pedagogie/emploi-du-temps', input)).data,
    onSuccess,
  });
}
export function useUpdateCours() {
  const { onSuccess } = invalidate([['emploi-du-temps']]);
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CoursInput> & { id: string }) =>
      (await api.put<Cours>(`/pedagogie/emploi-du-temps/${id}`, input)).data,
    onSuccess,
  });
}
export function useDeleteCours() {
  const { onSuccess } = invalidate([['emploi-du-temps']]);
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/pedagogie/emploi-du-temps/${id}`); },
    onSuccess,
  });
}

// ------------------------------------------------------------------ Discipline

export interface Discipline {
  id: string;
  eleveId: string;
  eleve: { id: string; nom: string; prenom: string; matricule: string };
  date: string;
  type: string;
  motif: string;
  pointsRetires: number;
  traitantParId?: string | null;
  traitantPar?: { id: string; nom: string; prenom: string } | null;
  suiteDonnee?: string | null;
  createdAt: string;
}
export interface DisciplineInput {
  eleveId: string;
  date: string;
  type: string;
  motif: string;
  pointsRetires?: number;
  traitantParId?: string;
  suiteDonnee?: string;
}

export function useDisciplineQuery(eleveId?: string) {
  return useQuery({
    queryKey: ['discipline', eleveId],
    queryFn: async () => (await api.get<Discipline[]>('/pedagogie/discipline', { params: { eleveId } })).data,
  });
}
export function useCreateDiscipline() {
  const { onSuccess } = invalidate([['discipline']]);
  return useMutation({
    mutationFn: async (input: DisciplineInput) => (await api.post<Discipline>('/pedagogie/discipline', input)).data,
    onSuccess,
  });
}
export function useUpdateDiscipline() {
  const { onSuccess } = invalidate([['discipline']]);
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<DisciplineInput> & { id: string }) =>
      (await api.put<Discipline>(`/pedagogie/discipline/${id}`, input)).data,
    onSuccess,
  });
}
export function useDeleteDiscipline() {
  const { onSuccess } = invalidate([['discipline']]);
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/pedagogie/discipline/${id}`); },
    onSuccess,
  });
}

// ----------------------------------------------------------- CRUD génériques

function genericCrud<T, I>(path: string, key: string) {
  const useList = (enabled = true) =>
    useQuery({
      queryKey: [key],
      enabled,
      retry: false,
      queryFn: async () => (await api.get<PaginatedResponse<T>>(path, { params: { pageSize: 500 } })).data.items,
    });
  const useCreate = () => {
    const { onSuccess } = invalidate([[key]]);
    return useMutation({ mutationFn: async (input: I) => (await api.post<T>(path, input)).data, onSuccess });
  };
  const useUpdate = () => {
    const { onSuccess } = invalidate([[key]]);
    return useMutation({
      mutationFn: async ({ id, ...input }: Partial<I> & { id: string }) => (await api.put<T>(`${path}/${id}`, input)).data,
      onSuccess,
    });
  };
  const useDelete = () => {
    const { onSuccess } = invalidate([[key]]);
    return useMutation({ mutationFn: async (id: string) => { await api.delete(`${path}/${id}`); }, onSuccess });
  };
  return { useList, useCreate, useUpdate, useDelete };
}

export interface Salle {
  id: string;
  nom: string;
  batiment?: string | null;
  capacite: number;
  type: string;
  equipements?: string | null;
}
const salles = genericCrud<Salle, Omit<Salle, 'id'>>('/pedagogie/salles', 'salles');
/** Lecture seule ici : le CRUD des salles relève du module « infrastructures ». */
export const useSallesQuery = salles.useList;

export interface ConseilClasse {
  id: string;
  classeId: string;
  periodeId?: string | null;
  date: string;
  compteRendu?: string | null;
  decisions?: unknown;
  createdAt: string;
}
export interface ConseilClasseInput {
  classeId: string;
  periodeId?: string | null;
  date: string;
  compteRendu?: string | null;
  decisions?: unknown;
}
const conseils = genericCrud<ConseilClasse, ConseilClasseInput>('/pedagogie/conseils-classe', 'conseils-classe');
export const useConseilsClasseQuery = conseils.useList;
export const useCreateConseilClasse = conseils.useCreate;
export const useUpdateConseilClasse = conseils.useUpdate;
export const useDeleteConseilClasse = conseils.useDelete;

export interface RessourceElearning {
  id: string;
  titre: string;
  matiereId?: string | null;
  type: string; // Document, Vidéo, Exercice, QCM
  url?: string | null;
  niveau?: string | null;
  publieParId?: string | null;
  createdAt: string;
}
export interface RessourceElearningInput {
  titre: string;
  matiereId?: string | null;
  type: string;
  url?: string | null;
  niveau?: string | null;
}
const elearning = genericCrud<RessourceElearning, RessourceElearningInput>('/pedagogie/elearning', 'elearning');
export const useRessourcesElearningQuery = elearning.useList;
export const useCreateRessourceElearning = elearning.useCreate;
export const useUpdateRessourceElearning = elearning.useUpdate;
export const useDeleteRessourceElearning = elearning.useDelete;
