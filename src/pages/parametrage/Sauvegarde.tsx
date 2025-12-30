import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Database, HardDrive, CheckCircle2, FileText, Activity, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackupScheduler from "@/components/sauvegarde/BackupScheduler";
import { generateBackupReportPDF, BackupReportData } from "@/components/sauvegarde/BackupReportPDFGenerator";
import { useEtablissement } from "@/contexts/EtablissementContext";
import { BackupMonitoringDashboard } from "@/components/sauvegarde/BackupMonitoringDashboard";
import { EmailReportConfig } from "@/components/sauvegarde/EmailReportConfig";
import { BackupHistoryExport } from "@/components/sauvegarde/BackupHistoryExport";

interface Backup {
  id: string;
  date: string;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed';
}

export default function SauvegardePage() {
  const { toast } = useToast();
  const { configuration } = useEtablissement();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const backups: Backup[] = [
    { id: '1', date: '2025-12-29 14:30', size: '2.4 GB', type: 'auto', status: 'completed' },
    { id: '2', date: '2025-12-28 14:30', size: '2.3 GB', type: 'auto', status: 'completed' },
    { id: '3', date: '2025-12-27 15:45', size: '2.3 GB', type: 'manual', status: 'completed' },
    { id: '4', date: '2025-12-27 14:30', size: '2.2 GB', type: 'auto', status: 'completed' },
    { id: '5', date: '2025-12-26 14:30', size: '2.2 GB', type: 'auto', status: 'completed' },
    { id: '6', date: '2025-12-25 14:30', size: '2.1 GB', type: 'auto', status: 'failed' },
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

  const handleGenerateReport = () => {
    const reportData: BackupReportData = {
      etablissement: configuration.identite.nom || 'Établissement Scolaire',
      dateGeneration: new Date().toISOString(),
      periode: {
        debut: '25/12/2025',
        fin: '29/12/2025',
      },
      backups: backups.map(b => ({
        ...b,
        duration: b.status === 'completed' ? `${Math.floor(Math.random() * 10) + 5} min` : undefined,
        filesCount: b.status === 'completed' ? Math.floor(Math.random() * 5000) + 10000 : undefined,
      })),
      stats: {
        totalSpace: 50,
        usedSpace: 12.4,
        backupsCount: 42,
        manualBackupsCount: 7,
        autoBackupsCount: 35,
        successRate: 95.2,
        averageSize: '2.3 GB',
        lastBackupDate: '29/12/2025 14:30',
        retentionDays: configuration.parametresSauvegarde?.retentionJours || 30,
      },
      parametresSauvegarde: {
        frequence: configuration.parametresSauvegarde?.frequence || 'quotidienne',
        heureExecution: configuration.parametresSauvegarde?.heureExecution || '14:30',
        retentionJours: configuration.parametresSauvegarde?.retentionJours || 30,
        notificationEmail: configuration.parametresSauvegarde?.notificationEmail || false,
        emailsNotification: configuration.parametresSauvegarde?.emailsNotification || [],
      },
    };

    try {
      generateBackupReportPDF(reportData);
      toast({
        title: "Rapport généré",
        description: "Le rapport de sauvegarde PDF a été téléchargé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sauvegarde & Restauration</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des sauvegardes automatiques et manuelles de la base de données
          </p>
        </div>
        <Button onClick={handleGenerateReport} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Rapport PDF
        </Button>
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
              29 Déc 2025 à 14:30
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

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="monitoring">
            <Activity className="h-4 w-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="manual">Sauvegarde Manuelle</TabsTrigger>
          <TabsTrigger value="scheduler">Planification</TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Rapports Email
          </TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <BackupMonitoringDashboard />
        </TabsContent>

        <TabsContent value="manual">
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
        </TabsContent>

        <TabsContent value="scheduler">
          <BackupScheduler />
        </TabsContent>

        <TabsContent value="email">
          <EmailReportConfig />
        </TabsContent>

        <TabsContent value="history">
          <BackupHistoryExport 
            backups={backups}
            onRestore={handleRestore}
            onDownload={handleExport}
            isRestoring={isRestoring}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
