import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Database, HardDrive, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Backup {
  id: string;
  date: string;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed';
}

export default function SauvegardePage() {
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const backups: Backup[] = [
    { id: '1', date: '2025-11-29 14:30', size: '2.4 GB', type: 'auto', status: 'completed' },
    { id: '2', date: '2025-11-28 14:30', size: '2.3 GB', type: 'auto', status: 'completed' },
    { id: '3', date: '2025-11-27 15:45', size: '2.3 GB', type: 'manual', status: 'completed' },
    { id: '4', date: '2025-11-27 14:30', size: '2.2 GB', type: 'auto', status: 'completed' },
    { id: '5', date: '2025-11-26 14:30', size: '2.2 GB', type: 'auto', status: 'completed' },
    { id: '6', date: '2025-11-25 14:30', size: '2.1 GB', type: 'auto', status: 'failed' },
  ];

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      toast({
        title: "Sauvegarde créée",
        description: "La sauvegarde manuelle a été créée avec succès.",
      });
    }, 2000);
  };

  const handleRestore = (backupId: string) => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      toast({
        title: "Restauration terminée",
        description: `La base de données a été restaurée à partir de la sauvegarde ${backupId}.`,
      });
    }, 3000);
  };

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Le téléchargement de la sauvegarde va démarrer...",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sauvegarde & Restauration</h1>
        <p className="text-muted-foreground mt-2">
          Gestion des sauvegardes automatiques et manuelles de la base de données
        </p>
      </div>

      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>Mode Démonstration</AlertTitle>
        <AlertDescription>
          Avec Lovable Cloud, les sauvegardes sont automatiquement gérées par Supabase. 
          Cette interface permet de créer des sauvegardes manuelles supplémentaires.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dernière Sauvegarde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aujourd'hui</div>
            <p className="text-xs text-muted-foreground mt-1">
              29 Nov 2025 à 14:30
            </p>
            <Badge variant="default" className="mt-3">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Réussie
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Espace Utilisé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4 GB</div>
            <p className="text-xs text-muted-foreground mt-1">
              sur 50 GB disponibles
            </p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '25%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sauvegardes Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">
              dont 7 manuelles
            </p>
            <Badge variant="secondary" className="mt-3">
              <HardDrive className="mr-1 h-3 w-3" />
              Auto actif
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sauvegarde Manuelle</CardTitle>
            <CardDescription>
              Créer une sauvegarde complète de la base de données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Une sauvegarde manuelle inclut toutes les données :
              </p>
              <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                <li>• Base de données complète</li>
                <li>• Fichiers uploadés</li>
                <li>• Configuration système</li>
                <li>• Logs récents</li>
              </ul>
            </div>
            <Button 
              className="w-full" 
              onClick={handleBackup}
              disabled={isBackingUp}
            >
              <Download className="mr-2 h-4 w-4" />
              {isBackingUp ? 'Création en cours...' : 'Créer une Sauvegarde'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Auto</CardTitle>
            <CardDescription>
              Paramètres des sauvegardes automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Fréquence</p>
                <p className="text-xs text-muted-foreground">Sauvegarde quotidienne</p>
              </div>
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                14:30
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Rétention</p>
                <p className="text-xs text-muted-foreground">Conserver 30 jours</p>
              </div>
              <Badge variant="secondary">30 jours</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Statut</p>
                <p className="text-xs text-muted-foreground">Actif depuis 6 mois</p>
              </div>
              <Badge variant="default">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Actif
              </Badge>
            </div>

            <Button variant="outline" className="w-full">
              Modifier la Configuration
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Sauvegardes</CardTitle>
          <CardDescription>
            Liste des sauvegardes disponibles pour restauration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">
                    {backup.date}
                  </TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <Badge variant={backup.type === 'auto' ? 'secondary' : 'default'}>
                      {backup.type === 'auto' ? 'Automatique' : 'Manuelle'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {backup.status === 'completed' ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Réussie
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Échouée
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {backup.status === 'completed' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRestore(backup.id)}
                          disabled={isRestoring}
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          Restaurer
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleExport}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Télécharger
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
