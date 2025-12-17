import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, Plus, Play, Pause, Trash2, Edit, 
  Mail, Download, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Settings, Bell, FileText, Users, History
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: string;
  nextRun: string;
  lastRun: string;
  lastStatus: 'success' | 'failed' | 'pending';
  recipients: string[];
  format: string;
  active: boolean;
  createdBy: string;
}

interface ExecutionHistory {
  id: string;
  reportName: string;
  executedAt: string;
  duration: string;
  status: 'success' | 'failed';
  recipients: number;
  error?: string;
}

export default function RapportsPlanifiesPage() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScheduledReport | null>(null);

  const [newReport, setNewReport] = useState({
    name: '',
    reportType: '',
    frequency: 'weekly',
    dayOfWeek: '1',
    dayOfMonth: '1',
    time: '08:00',
    format: 'pdf',
    recipients: '',
    includeAttachment: true,
    emailSubject: '',
    emailBody: '',
    active: true,
  });

  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    { id: '1', name: 'Rapport Hebdomadaire Notes', reportType: 'Notes par classe', frequency: 'Hebdomadaire (Lundi)', nextRun: '2025-12-02 08:00', lastRun: '2025-11-25 08:00', lastStatus: 'success', recipients: ['directeur@ecole.ci', 'pedagogie@ecole.ci'], format: 'pdf', active: true, createdBy: 'admin' },
    { id: '2', name: 'État Mensuel Paiements', reportType: 'État des paiements', frequency: 'Mensuel (1er)', nextRun: '2025-12-01 09:00', lastRun: '2025-11-01 09:00', lastStatus: 'success', recipients: ['comptabilite@ecole.ci', 'directeur@ecole.ci'], format: 'xlsx', active: true, createdBy: 'comptable' },
    { id: '3', name: 'Assiduité Quotidienne', reportType: 'Rapport d\'assiduité', frequency: 'Quotidien (17h)', nextRun: '2025-11-29 17:00', lastRun: '2025-11-28 17:00', lastStatus: 'success', recipients: ['surveillant@ecole.ci'], format: 'pdf', active: true, createdBy: 'admin' },
    { id: '4', name: 'Bilan Trimestriel', reportType: 'Bilan académique', frequency: 'Trimestriel', nextRun: '2025-12-20 10:00', lastRun: '2025-09-20 10:00', lastStatus: 'success', recipients: ['directeur@ecole.ci', 'conseil@ecole.ci'], format: 'pdf', active: true, createdBy: 'directeur' },
    { id: '5', name: 'Alertes Impayés', reportType: 'Élèves en retard de paiement', frequency: 'Hebdomadaire (Vendredi)', nextRun: '2025-11-29 14:00', lastRun: '2025-11-22 14:00', lastStatus: 'failed', recipients: ['comptabilite@ecole.ci'], format: 'xlsx', active: false, createdBy: 'comptable' },
  ]);

  const [executionHistory] = useState<ExecutionHistory[]>([
    { id: '1', reportName: 'Assiduité Quotidienne', executedAt: '2025-11-28 17:00', duration: '45s', status: 'success', recipients: 1 },
    { id: '2', reportName: 'Rapport Hebdomadaire Notes', executedAt: '2025-11-25 08:00', duration: '2m 15s', status: 'success', recipients: 2 },
    { id: '3', reportName: 'Alertes Impayés', executedAt: '2025-11-22 14:00', duration: '1m 30s', status: 'failed', recipients: 0, error: 'Erreur de connexion au serveur mail' },
    { id: '4', reportName: 'État Mensuel Paiements', executedAt: '2025-11-01 09:00', duration: '3m 45s', status: 'success', recipients: 2 },
    { id: '5', reportName: 'Assiduité Quotidienne', executedAt: '2025-11-27 17:00', duration: '42s', status: 'success', recipients: 1 },
  ]);

  const reportTypes = [
    'Notes par classe',
    'État des paiements',
    'Rapport d\'assiduité',
    'Bilan académique',
    'Liste des élèves',
    'Personnel enseignant',
    'Inventaire bibliothèque',
    'Statistiques globales',
  ];

  const handleToggleActive = (reportId: string) => {
    setScheduledReports(reports => 
      reports.map(r => r.id === reportId ? { ...r, active: !r.active } : r)
    );
    const report = scheduledReports.find(r => r.id === reportId);
    toast({
      title: report?.active ? "Rapport désactivé" : "Rapport activé",
      description: `Le rapport "${report?.name}" a été ${report?.active ? 'mis en pause' : 'réactivé'}.`,
    });
  };

  const handleRunNow = (report: ScheduledReport) => {
    toast({
      title: "Exécution lancée",
      description: `Le rapport "${report.name}" est en cours de génération...`,
    });
  };

  const handleDeleteReport = (reportId: string) => {
    const report = scheduledReports.find(r => r.id === reportId);
    setScheduledReports(reports => reports.filter(r => r.id !== reportId));
    toast({
      title: "Rapport supprimé",
      description: `Le rapport planifié "${report?.name}" a été supprimé.`,
    });
  };

  const handleCreateReport = () => {
    if (!newReport.name || !newReport.reportType || !newReport.recipients) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const newScheduledReport: ScheduledReport = {
      id: String(scheduledReports.length + 1),
      name: newReport.name,
      reportType: newReport.reportType,
      frequency: getFrequencyLabel(),
      nextRun: calculateNextRun(),
      lastRun: '-',
      lastStatus: 'pending',
      recipients: newReport.recipients.split(',').map(r => r.trim()),
      format: newReport.format,
      active: newReport.active,
      createdBy: 'admin',
    };

    setScheduledReports([...scheduledReports, newScheduledReport]);
    setIsCreateDialogOpen(false);
    resetNewReportForm();
    toast({
      title: "Rapport créé",
      description: `Le rapport planifié "${newReport.name}" a été créé avec succès.`,
    });
  };

  const getFrequencyLabel = () => {
    switch (newReport.frequency) {
      case 'daily':
        return `Quotidien (${newReport.time})`;
      case 'weekly':
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return `Hebdomadaire (${days[parseInt(newReport.dayOfWeek)]})`;
      case 'monthly':
        return `Mensuel (${newReport.dayOfMonth}${newReport.dayOfMonth === '1' ? 'er' : 'ème'})`;
      case 'trimesterly':
        return 'Trimestriel';
      default:
        return newReport.frequency;
    }
  };

  const calculateNextRun = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate() + 1).padStart(2, '0')} ${newReport.time}`;
  };

  const resetNewReportForm = () => {
    setNewReport({
      name: '',
      reportType: '',
      frequency: 'weekly',
      dayOfWeek: '1',
      dayOfMonth: '1',
      time: '08:00',
      format: 'pdf',
      recipients: '',
      includeAttachment: true,
      emailSubject: '',
      emailBody: '',
      active: true,
    });
  };

  const stats = {
    total: scheduledReports.length,
    active: scheduledReports.filter(r => r.active).length,
    success: executionHistory.filter(h => h.status === 'success').length,
    failed: executionHistory.filter(h => h.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports Planifiés</h1>
          <p className="text-muted-foreground mt-2">
            Automatisez la génération et l'envoi de vos rapports
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rapport Planifié
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.total}</div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">rapports configurés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.active}</div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">en cours d'exécution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Exécutions Réussies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.success}</div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Échecs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.failed}</div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">à vérifier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Rapports Planifiés</TabsTrigger>
          <TabsTrigger value="history">Historique d'Exécution</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports Programmés</CardTitle>
              <CardDescription>
                Liste de tous les rapports automatiques configurés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Rapport</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fréquence</TableHead>
                    <TableHead>Prochaine Exécution</TableHead>
                    <TableHead>Dernière Exécution</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map(report => (
                    <TableRow key={report.id} className={!report.active ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Clock className="mr-1 h-3 w-3" />
                          {report.frequency}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.active ? report.nextRun : '-'}</TableCell>
                      <TableCell>{report.lastRun}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{report.recipients.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.lastStatus === 'success' ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Succès
                          </Badge>
                        ) : report.lastStatus === 'failed' ? (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Échec
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            En attente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRunNow(report)}
                            disabled={!report.active}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(report.id)}
                          >
                            {report.active ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique d'Exécution</CardTitle>
              <CardDescription>
                Dernières exécutions des rapports planifiés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rapport</TableHead>
                    <TableHead>Date d'Exécution</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executionHistory.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.reportName}</TableCell>
                      <TableCell>{item.executedAt}</TableCell>
                      <TableCell>{item.duration}</TableCell>
                      <TableCell>{item.recipients} envoyé(s)</TableCell>
                      <TableCell>
                        {item.status === 'success' ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Succès
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Échec
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.error || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Rapport Planifié</DialogTitle>
            <DialogDescription>
              Configurez un nouveau rapport automatique
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du rapport *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Rapport hebdomadaire notes"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Type de rapport *</Label>
                <Select 
                  value={newReport.reportType}
                  onValueChange={(value) => setNewReport({ ...newReport, reportType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fréquence</Label>
                <Select 
                  value={newReport.frequency}
                  onValueChange={(value) => setNewReport({ ...newReport, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="trimesterly">Trimestriel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newReport.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Jour de la semaine</Label>
                  <Select 
                    value={newReport.dayOfWeek}
                    onValueChange={(value) => setNewReport({ ...newReport, dayOfWeek: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Lundi</SelectItem>
                      <SelectItem value="2">Mardi</SelectItem>
                      <SelectItem value="3">Mercredi</SelectItem>
                      <SelectItem value="4">Jeudi</SelectItem>
                      <SelectItem value="5">Vendredi</SelectItem>
                      <SelectItem value="6">Samedi</SelectItem>
                      <SelectItem value="0">Dimanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newReport.frequency === 'monthly' && (
                <div className="space-y-2">
                  <Label>Jour du mois</Label>
                  <Select 
                    value={newReport.dayOfMonth}
                    onValueChange={(value) => setNewReport({ ...newReport, dayOfMonth: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={String(day)}>
                          {day}{day === 1 ? 'er' : 'ème'} du mois
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Heure d'exécution</Label>
                <Input
                  type="time"
                  value={newReport.time}
                  onChange={(e) => setNewReport({ ...newReport, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select 
                  value={newReport.format}
                  onValueChange={(value) => setNewReport({ ...newReport, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Destinataires (emails) *</Label>
                <Textarea
                  id="recipients"
                  placeholder="email1@ecole.ci, email2@ecole.ci"
                  value={newReport.recipients}
                  onChange={(e) => setNewReport({ ...newReport, recipients: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Séparez les emails par des virgules
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet de l'email</Label>
                <Input
                  id="subject"
                  placeholder="Ex: [Auto] Rapport hebdomadaire"
                  value={newReport.emailSubject}
                  onChange={(e) => setNewReport({ ...newReport, emailSubject: e.target.value })}
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="attachment">Inclure le rapport en pièce jointe</Label>
                  <Switch
                    id="attachment"
                    checked={newReport.includeAttachment}
                    onCheckedChange={(checked) => setNewReport({ ...newReport, includeAttachment: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Activer immédiatement</Label>
                  <Switch
                    id="active"
                    checked={newReport.active}
                    onCheckedChange={(checked) => setNewReport({ ...newReport, active: checked })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateReport}>
              Créer le Rapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
