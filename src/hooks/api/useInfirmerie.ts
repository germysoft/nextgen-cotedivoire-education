import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';

/**
 * Hooks Infirmerie — backend `infirmerie.routes.ts` (fiches, consultations, alertes)
 * + CRUD générique (ordonnances, stock-medicaments).
 * Données de santé sensibles : ne jamais les logguer dans la console.
 */

export interface EleveResume { id: string; nom: string; prenom: string; matricule?: string }
export interface InfirmierResume { id: string; nom: string; prenom: string }

// ---------------- Fiches de santé ----------------
export interface FicheSante {
  id: string;
  eleveId: string;
  eleve?: EleveResume;
  groupeSanguin?: string | null;
  allergies?: string | null;
  maladiesChroniques?: string | null;
  traitementEnCours?: string | null;
  vaccinationsAJour: boolean;
  contactMedecin?: string | null;
  observations?: string | null;
  updatedAt: string;
}
export type FicheSanteInput = Partial<Omit<FicheSante, 'id' | 'eleveId' | 'eleve' | 'updatedAt'>>;

export function useFichesSanteQuery() {
  return useQuery({
    queryKey: ['fiches-sante'],
    queryFn: async () => (await api.get<FicheSante[]>('/infirmerie/fiches-sante')).data,
  });
}

export function useFicheSanteQuery(eleveId?: string) {
  return useQuery({
    queryKey: ['fiches-sante', eleveId],
    enabled: !!eleveId,
    queryFn: async () => (await api.get<FicheSante | null>(`/infirmerie/fiches-sante/${eleveId}`)).data,
  });
}

/** Upsert : crée la fiche si elle n'existe pas. Le backend refuse les `null` → on envoie `undefined`. */
export function useUpsertFicheSante() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ eleveId, ...input }: FicheSanteInput & { eleveId: string }) =>
      (await api.put<FicheSante>(`/infirmerie/fiches-sante/${eleveId}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fiches-sante'] }),
  });
}

// ---------------- Ordonnances (générique) ----------------
export interface MedicamentPrescrit { nom: string; posologie: string; duree: string }
export interface Ordonnance {
  id: string;
  consultationId: string;
  medicaments: MedicamentPrescrit[];
  dateEmission: string;
}
export type OrdonnanceInput = { consultationId: string; medicaments: MedicamentPrescrit[]; dateEmission?: string };

// ---------------- Consultations ----------------
export interface Consultation {
  id: string;
  eleveId: string;
  eleve: EleveResume & Record<string, unknown>;
  date: string;
  motif: string;
  diagnostic?: string | null;
  traitement?: string | null;
  infirmierId?: string | null;
  infirmier?: InfirmierResume | null;
  necessiteSuivi: boolean;
  ordonnances: Ordonnance[];
}
export interface ConsultationInput {
  eleveId: string;
  motif: string;
  diagnostic?: string;
  traitement?: string;
  infirmierId?: string;
  necessiteSuivi?: boolean;
}

export function useConsultationsQuery(eleveId?: string) {
  return useQuery({
    queryKey: ['consultations', eleveId ?? 'all'],
    queryFn: async () =>
      (await api.get<Consultation[]>('/infirmerie/consultations', { params: eleveId ? { eleveId } : undefined })).data,
  });
}

export function useCreateConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ConsultationInput) => (await api.post<Consultation>('/infirmerie/consultations', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultations'] }),
  });
}

export function useUpdateConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ConsultationInput> & { id: string }) =>
      (await api.put<Consultation>(`/infirmerie/consultations/${id}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultations'] }),
  });
}

export function useDeleteConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/infirmerie/consultations/${id}`); },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['consultations'] });
      qc.invalidateQueries({ queryKey: ['ordonnances'] });
    },
  });
}

// ---------------- Alertes ----------------
export type NiveauAlerte = 'Info' | 'Attention' | 'Urgent';
export interface AlerteMedicale {
  id: string;
  eleveId?: string | null;
  type: string;
  description: string;
  niveau: NiveauAlerte;
  resolue: boolean;
  createdAt: string;
}
export interface AlerteInput { eleveId?: string; type: string; description: string; niveau?: NiveauAlerte }

/** Le backend ne renvoie que les alertes non résolues. */
export function useAlertesMedicalesQuery() {
  return useQuery({
    queryKey: ['alertes-medicales'],
    queryFn: async () => (await api.get<AlerteMedicale[]>('/infirmerie/alertes')).data,
  });
}

export function useCreateAlerteMedicale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AlerteInput) => (await api.post<AlerteMedicale>('/infirmerie/alertes', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alertes-medicales'] }),
  });
}

export function useUpdateAlerteMedicale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<AlerteInput> & { id: string; resolue?: boolean }) =>
      (await api.put<AlerteMedicale>(`/infirmerie/alertes/${id}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alertes-medicales'] }),
  });
}

export function useDeleteAlerteMedicale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/infirmerie/alertes/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alertes-medicales'] }),
  });
}

// ---------------- CRUD générique (filtres d'égalité serveur, pageSize ≤ 1000) ----------------
function genericCrud<T, I>(path: string, key: string) {
  return {
    useList: (filters: Record<string, string | number | boolean | undefined> = {}) =>
      useQuery({
        queryKey: [key, filters],
        queryFn: async () => {
          const { data } = await api.get<PaginatedResponse<T>>(path, { params: { pageSize: 1000, ...filters } });
          return data.items;
        },
      }),
    useCreate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (input: I) => (await api.post<T>(path, input)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
      });
    },
    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async ({ id, ...input }: Partial<I> & { id: string }) => (await api.put<T>(`${path}/${id}`, input)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
      });
    },
    useDelete: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (id: string) => { await api.delete(`${path}/${id}`); },
        onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
      });
    },
  };
}

const ordonnances = genericCrud<Ordonnance, OrdonnanceInput>('/infirmerie/ordonnances', 'ordonnances');
/** Ex. `useOrdonnancesQuery({ consultationId })` → filtre côté serveur. */
export const useOrdonnancesQuery = ordonnances.useList;
export const useCreateOrdonnance = ordonnances.useCreate;
export const useUpdateOrdonnance = ordonnances.useUpdate;
export const useDeleteOrdonnance = ordonnances.useDelete;

export interface StockMedicament {
  id: string;
  nom: string;
  quantiteStock: number;
  seuilAlerte: number;
  datePeremption?: string | null;
  fournisseur?: string | null;
}
export type StockMedicamentInput = Omit<StockMedicament, 'id'>;
const stock = genericCrud<StockMedicament, StockMedicamentInput>('/infirmerie/stock-medicaments', 'stock-medicaments');
export const useStockMedicamentsQuery = stock.useList;
export const useCreateStockMedicament = stock.useCreate;
export const useUpdateStockMedicament = stock.useUpdate;
export const useDeleteStockMedicament = stock.useDelete;

export const errMsg = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;
export const nomEleve = (e?: { nom: string; prenom: string } | null) => (e ? `${e.nom} ${e.prenom}` : '—');
