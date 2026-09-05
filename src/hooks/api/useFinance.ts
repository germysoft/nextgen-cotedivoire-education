import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface MouvementCaisse {
  id: string;
  type: 'Entrée' | 'Sortie';
  montant: number;
  motif: string;
  categorie?: string;
  date: string;
  soldeApres?: number;
}

export function useMouvementsQuery() {
  return useQuery({
    queryKey: ['mouvements-caisse'],
    queryFn: async () => {
      const { data } = await api.get<MouvementCaisse[]>('/finance/caisse');
      return data;
    },
  });
}

export interface MouvementInput {
  type: 'Entrée' | 'Sortie';
  montant: number;
  motif: string;
  categorie?: string;
}

export function useCreateMouvement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MouvementInput) => {
      const { data } = await api.post<MouvementCaisse>('/finance/caisse', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mouvements-caisse'] }),
  });
}

export interface EcheancePaiement {
  id: string;
  eleveId: string;
  eleve: {
    id: string;
    nom: string;
    prenom: string;
    matricule: string;
    inscriptions?: Array<{ classe: { nom: string } }>;
  };
  libelle: string;
  montantDu: number;
  dateEcheance: string;
  statut: 'En attente' | 'Payée' | 'En retard' | 'Partielle';
  paiements: Array<{ montant: number }>;
}

export function useEcheancesQuery(statut?: string) {
  return useQuery({
    queryKey: ['echeances', statut],
    queryFn: async () => {
      const { data } = await api.get<EcheancePaiement[]>('/finance/echeances', { params: { statut } });
      return data;
    },
  });
}

export interface PaiementInput {
  eleveId: string;
  echeanceId?: string;
  montant: number;
  modePaiement: 'Espèces' | 'Chèque' | 'Virement' | 'Mobile Money';
}

export function useCreatePaiement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PaiementInput) => {
      const { data } = await api.post('/finance/paiements', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echeances'] });
    },
  });
}

/** Montant restant dû sur une échéance, après déduction des paiements déjà enregistrés. */
export function resteAPayer(echeance: EcheancePaiement): number {
  const paye = echeance.paiements.reduce((s, p) => s + p.montant, 0);
  return Math.max(0, echeance.montantDu - paye);
}
