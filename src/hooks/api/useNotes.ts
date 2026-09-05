import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface MatiereMoyenne {
  matiereId: string;
  matiere: string;
  moyenne: number | null;
}

export interface EleveMoyenne {
  eleveId: string;
  eleve: string;
  matieres: MatiereMoyenne[];
  moyenneGenerale: number;
  rang: number;
  effectifClasse: number;
}

export function useMoyennesQuery(classeId: string | undefined, periodeId: string | undefined) {
  return useQuery({
    queryKey: ['moyennes', classeId, periodeId],
    queryFn: async () => {
      const { data } = await api.get<EleveMoyenne[]>(`/notes/moyennes/${classeId}/${periodeId}`);
      return data;
    },
    enabled: !!classeId && !!periodeId,
  });
}
