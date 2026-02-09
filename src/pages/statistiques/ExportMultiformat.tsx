import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, FileSpreadsheet, FileText, FileImage, Printer,
  Settings, Calendar, Filter, CheckCircle2, Clock, History,
  Mail, Share2, Folder, File, Search
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  formats: string[];
  lastUsed: string;
  fields: string[];
}

interface ExportHistory {
  id: string;
  reportName: string;
  format: string;
  timestamp: string;
  size: string;
  status: 'completed' | 'failed' | 'pending';
  downloadUrl?: string;
}

export default function ExportMultiformatPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const [exportSettings, setExportSettings] = useState({
    format: 'xlsx',
    includeHeaders: true,
    includeCharts: true,
    dateRange: 'current-year',
    orientation: 'portrait',
    paperSize: 'A4',
    sendByEmail: false,
    emailRecipients: '',
  });

  const reportTemplates: ReportTemplate[] = [
    { id: '1', name: 'Liste des Élèves', category: 'Scolarité', description: 'Liste complète des élèves inscrits', formats: ['xlsx', 'pdf', 'csv'], lastUsed: '2025-11-29', fields: ['Matricule', 'Nom', 'Prénom', 'Classe', 'Date naissance'] },
    { id: '2', name: 'Bulletins Trimestriels', category: 'Notes', description: 'Bulletins de notes par trimestre', formats: ['pdf'], lastUsed: '2025-11-28', fields: ['Élève', 'Classe', 'Matières', 'Notes', 'Moyenne'] },
    { id: '3', name: 'État des Paiements', category: 'Finance', description: 'Situation des paiements de frais', formats: ['xlsx', 'pdf', 'csv'], lastUsed: '2025-11-27', fields: ['Élève', 'Montant dû', 'Payé', 'Reste', 'Statut'] },
    { id: '4', name: 'Rapport d\'Assiduité', category: 'Discipline', description: 'Absences et retards par période', formats: ['xlsx', 'pdf'], lastUsed: '2025-11-26', fields: ['Élève', 'Classe', 'Absences', 'Retards', 'Taux'] },
    { id: '5', name: 'Statistiques par Classe', category: 'Analyse', description: 'Performances par classe', formats: ['xlsx', 'pdf', 'png'], lastUsed: '2025-11-25', fields: ['Classe', 'Effectif', 'Moyenne', 'Min', 'Max'] },
    { id: '6', name: 'Fiche Personnel', category: 'RH', description: 'Liste du personnel enseignant', formats: ['xlsx', 'pdf', 'csv'], lastUsed: '2025-11-24', fields: ['Matricule', 'Nom', 'Poste', 'Département', 'Contact'] },
    { id: '7', name: 'Emplois du Temps', category: 'Planning', description: 'Emplois du temps par classe', formats: ['pdf', 'png'], lastUsed: '2025-11-23', fields: ['Classe', 'Jour', 'Heure', 'Matière', 'Enseignant'] },
    { id: '8', name: 'Bilan Financier', category: 'Finance', description: 'Bilan recettes/dépenses', formats: ['xlsx', 'pdf'], lastUsed: '2025-11-22', fields: ['Période', 'Recettes', 'Dépenses', 'Solde'] },
    { id: '9', name: 'Résultats Examens', category: 'Examens', description: 'Résultats et classements', formats: ['xlsx', 'pdf', 'csv'], lastUsed: '2025-11-21', fields: ['Candidat', 'Moyenne', 'Mention', 'Rang'] },
    { id: '10', name: 'Inventaire Bibliothèque', category: 'Bibliothèque', description: 'Stock de livres et emprunts', formats: ['xlsx', 'csv'], lastUsed: '2025-11-20', fields: ['ISBN', 'Titre', 'Auteur', 'Quantité', 'Emprunts'] },
  ];

  const [exportHistory] = useState<ExportHistory[]>([
    { id: '1', reportName: 'Liste des Élèves', format: 'xlsx', timestamp: '2025-11-29 15:30', size: '2.4 MB', status: 'completed', downloadUrl: '#' },
    { id: '2', reportName: 'Bulletins Trimestriels', format: 'pdf', timestamp: '2025-11-29 14:15', size: '15.8 MB', status: 'completed', downloadUrl: '#' },
    { id: '3', reportName: 'État des Paiements', format: 'csv', timestamp: '2025-11-29 12:00', size: '856 KB', status: 'completed', downloadUrl: '#' },
    { id: '4', reportName: 'Rapport d\'Assiduité', format: 'pdf', timestamp: '2025-11-28 16:45', size: '4.2 MB', status: 'failed' },
    { id: '5', reportName: 'Statistiques par Classe', format: 'xlsx', timestamp: '2025-11-28 10:30', size: '1.1 MB', status: 'completed', downloadUrl: '#' },
  ]);

  const categories = Array.from(new Set(reportTemplates.map(t => t.category)));

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-600" />;
      case 'png':
        return <FileImage className="h-4 w-4 text-blue-600" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'xlsx':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'csv':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
      case 'pdf':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'png':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return '';
    }
  };

  const handleOpenExportDialog = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setExportSettings({ ...exportSettings, format: template.formats[0] });
    setIsExportDialogOpen(true);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setIsExportDialogOpen(false);
          toast({
            title: "Export terminé",
            description: `Le rapport "${selectedTemplate?.name}" a été exporté en ${exportSettings.format.toUpperCase()}.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleQuickExport = (template: ReportTemplate, format: string) => {
    toast({
      title: "Export en cours",
      description: `Export ${format.toUpperCase()} de "${template.name}"...`,
    });
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: `Le fichier a été téléchargé.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export Multi-format</h1>
          <p className="text-muted-foreground mt-2">
            Exportez vos données dans différents formats (Excel, PDF, CSV, Image)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { const tabEl = document.querySelector('[data-state="inactive"][value="history"]') as HTMLElement; if (tabEl) tabEl.click(); }}>
            <History className="mr-2 h-4 w-4" />
            Historique
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rapports Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{reportTemplates.length}</div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">modèles configurés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Exports Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3</div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">fichiers générés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Formats Supportés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">4</div>
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">XLSX</Badge>
              <Badge variant="outline" className="text-xs">PDF</Badge>
              <Badge variant="outline" className="text-xs">CSV</Badge>
              <Badge variant="outline" className="text-xs">PNG</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Espace Utilisé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">24.3 MB</div>
              <Folder className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Modèles de Rapports</TabsTrigger>
          <TabsTrigger value="history">Historique des Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un rapport..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Report Templates Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Champs inclus:</Label>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.slice(0, 4).map(field => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                      {template.fields.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.fields.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Formats disponibles:</Label>
                    <div className="flex gap-2">
                      {template.formats.map(format => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleQuickExport(template, format)}
                        >
                          {getFormatIcon(format)}
                          <span className="ml-1 uppercase text-xs">{format}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Dernier export: {template.lastUsed}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenExportDialog(template)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Options
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Exports</CardTitle>
              <CardDescription>
                Vos 5 derniers exports avec possibilité de re-téléchargement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rapport</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportHistory.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.reportName}</TableCell>
                      <TableCell>
                        <Badge className={getFormatColor(item.format)}>
                          {getFormatIcon(item.format)}
                          <span className="ml-1 uppercase">{item.format}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>
                        {item.status === 'completed' ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Terminé
                          </Badge>
                        ) : item.status === 'pending' ? (
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            En cours
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Échoué
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === 'completed' && (
                         <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: "Téléchargement", description: `Re-téléchargement de "${item.reportName}" en cours...` })}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: "Email envoyé", description: `Rapport "${item.reportName}" envoyé par email` })}>
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(`https://app.school/export/${item.id}`); toast({ title: "Lien copié", description: "Lien de partage copié dans le presse-papiers" }); }}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {item.status === 'failed' && (
                          <Button variant="ghost" size="sm" onClick={() => toast({ title: "Réessai en cours", description: `Regénération de "${item.reportName}"...` })}>
                            Réessayer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Options d'Export</DialogTitle>
            <DialogDescription>
              Configurez les options pour "{selectedTemplate?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Format de sortie</Label>
              <Select 
                value={exportSettings.format} 
                onValueChange={(value) => setExportSettings({ ...exportSettings, format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedTemplate?.formats.map(format => (
                    <SelectItem key={format} value={format}>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(format)}
                        <span className="uppercase">{format}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
              <Select 
                value={exportSettings.dateRange}
                onValueChange={(value) => setExportSettings({ ...exportSettings, dateRange: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Mois en cours</SelectItem>
                  <SelectItem value="current-trimester">Trimestre en cours</SelectItem>
                  <SelectItem value="current-year">Année scolaire</SelectItem>
                  <SelectItem value="custom">Personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exportSettings.format === 'pdf' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Select 
                    value={exportSettings.orientation}
                    onValueChange={(value) => setExportSettings({ ...exportSettings, orientation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Paysage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format papier</Label>
                  <Select 
                    value={exportSettings.paperSize}
                    onValueChange={(value) => setExportSettings({ ...exportSettings, paperSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A3">A3</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="headers">Inclure les en-têtes</Label>
                <Switch
                  id="headers"
                  checked={exportSettings.includeHeaders}
                  onCheckedChange={(checked) => setExportSettings({ ...exportSettings, includeHeaders: checked })}
                />
              </div>
              
              {(exportSettings.format === 'pdf' || exportSettings.format === 'xlsx') && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="charts">Inclure les graphiques</Label>
                  <Switch
                    id="charts"
                    checked={exportSettings.includeCharts}
                    onCheckedChange={(checked) => setExportSettings({ ...exportSettings, includeCharts: checked })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="email">Envoyer par email</Label>
                <Switch
                  id="email"
                  checked={exportSettings.sendByEmail}
                  onCheckedChange={(checked) => setExportSettings({ ...exportSettings, sendByEmail: checked })}
                />
              </div>

              {exportSettings.sendByEmail && (
                <div className="space-y-2">
                  <Label>Destinataires</Label>
                  <Input
                    placeholder="email1@exemple.com, email2@exemple.com"
                    value={exportSettings.emailRecipients}
                    onChange={(e) => setExportSettings({ ...exportSettings, emailRecipients: e.target.value })}
                  />
                </div>
              )}
            </div>

            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Génération en cours...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} disabled={isExporting}>
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 'Export en cours...' : 'Exporter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
