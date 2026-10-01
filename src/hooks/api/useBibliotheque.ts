import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';

export interface Livre {
  id: string;
  isbn?: string;
  titre: string;
  auteur: string;
  editeur?: string | null;
  categorie?: string;
  anneeEdition?: number | null;
  emplacement?: string | null;
  couvertureUrl?: string | null;
  exemplairesDisponibles: number;
  nombreExemplaires: number;
}

/** Corps accepté par POST/PUT /bibliotheque/livres (livreSchema côté backend). */
export interface LivreInput {
  isbn?: string;
  titre: string;
  auteur: string;
  editeur?: string;
  categorie?: string;
  anneeEdition?: number;
  nombreExemplaires?: number;
  emplacement?: string;
}

export function useCreateLivre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LivreInput) => (await api.post<Livre>('/bibliotheque/livres', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['livres'] }),
  });
}

export function useUpdateLivre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<LivreInput> & { id: string }) =>
      (await api.put<Livre>(`/bibliotheque/livres/${id}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['livres'] }),
  });
}

export function useDeleteLivre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/bibliotheque/livres/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['livres'] }),
  });
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

export function useAlertesRetardQuery() {
  return useQuery({
    queryKey: ['alertes-retard'],
    queryFn: async () => (await api.get<Emprunt[]>('/bibliotheque/alertes-retard')).data,
  });
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

// ---------------------------------------------------------------------------
// Entités servies par le routeur CRUD générique (réponse paginée, sans relation
// jointe : les pages recoupent `livreId` / `eleveId` avec les listes chargées).
// ---------------------------------------------------------------------------

function genericCrud<T, I>(path: string, key: string) {
  const useList = () =>
    useQuery({
      queryKey: [key],
      queryFn: async () => (await api.get<PaginatedResponse<T>>(path, { params: { pageSize: 500 } })).data.items,
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

export interface Reservation {
  id: string;
  livreId: string;
  eleveId?: string | null;
  dateReservation: string;
  statut: string; // En attente, Disponible, Honorée, Annulée
}
export type ReservationInput = { livreId: string; eleveId?: string | null; statut?: string };
const reservations = genericCrud<Reservation, ReservationInput>('/bibliotheque/reservations', 'reservations');
export const useReservationsQuery = reservations.useList;
export const useCreateReservation = reservations.useCreate;
export const useUpdateReservation = reservations.useUpdate;
export const useDeleteReservation = reservations.useDelete;

export interface CarteLecteur {
  id: string;
  numeroCarte: string;
  eleveId?: string | null;
  personnelId?: string | null;
  dateEmission: string;
  dateExpiration?: string | null;
  active: boolean;
}
export type CarteLecteurInput = {
  numeroCarte: string;
  eleveId?: string | null;
  personnelId?: string | null;
  dateExpiration?: string | null;
  active?: boolean;
};
const cartes = genericCrud<CarteLecteur, CarteLecteurInput>('/bibliotheque/cartes-lecteur', 'cartes-lecteur');
export const useCartesLecteurQuery = cartes.useList;
export const useCreateCarteLecteur = cartes.useCreate;
export const useUpdateCarteLecteur = cartes.useUpdate;
export const useDeleteCarteLecteur = cartes.useDelete;

export interface LigneAcquisition { titre: string; quantite: number; prixUnitaire: number }
export interface AcquisitionLivre {
  id: string;
  fournisseur?: string | null;
  dateCommande: string;
  dateReception?: string | null;
  montantTotal: number;
  statut: string; // Commandée, Reçue, Annulée
  lignes: LigneAcquisition[];
}
export type AcquisitionInput = {
  fournisseur?: string | null;
  dateCommande?: string;
  dateReception?: string | null;
  montantTotal: number;
  statut?: string;
  lignes: LigneAcquisition[];
};
const acquisitions = genericCrud<AcquisitionLivre, AcquisitionInput>('/bibliotheque/acquisitions', 'acquisitions');
export const useAcquisitionsQuery = acquisitions.useList;
export const useCreateAcquisition = acquisitions.useCreate;
export const useUpdateAcquisition = acquisitions.useUpdate;
export const useDeleteAcquisition = acquisitions.useDelete;

export interface SuggestionAchat {
  id: string;
  livreId?: string | null;
  titreSuggere?: string | null;
  suggerePar?: string | null;
  statut: string; // Proposée, Validée, Achetée, Rejetée
  createdAt: string;
}
export type SuggestionInput = { livreId?: string | null; titreSuggere?: string | null; suggerePar?: string | null; statut?: string };
const suggestions = genericCrud<SuggestionAchat, SuggestionInput>('/bibliotheque/suggestions', 'suggestions');
export const useSuggestionsQuery = suggestions.useList;
export const useCreateSuggestion = suggestions.useCreate;
export const useUpdateSuggestion = suggestions.useUpdate;
export const useDeleteSuggestion = suggestions.useDelete;
