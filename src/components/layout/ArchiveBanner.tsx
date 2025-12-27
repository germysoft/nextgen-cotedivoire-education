import { Archive, X, Eye, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useArchives } from '@/contexts/ArchivesContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ArchiveBanner() {
  const { isArchiveMode, anneeConsultee, deconnecterArchive } = useArchives();

  if (!isArchiveMode || !anneeConsultee) {
    return null;
  }

  return (
    <div className="sticky top-16 z-50 w-full">
      <Alert className="rounded-none border-x-0 border-t-0 bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="h-5 w-5" />
            <AlertDescription className="flex items-center gap-2 font-medium">
              <Eye className="h-4 w-4" />
              Vous êtes connecté à l'année scolaire {anneeConsultee.libelle} (Archive)
              <span className="mx-2">•</span>
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Mode lecture seule - Aucune modification possible</span>
            </AlertDescription>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={deconnecterArchive}
            className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-800 dark:hover:bg-amber-900"
          >
            <X className="h-4 w-4 mr-1" />
            Revenir à l'année en cours
          </Button>
        </div>
      </Alert>
    </div>
  );
}
