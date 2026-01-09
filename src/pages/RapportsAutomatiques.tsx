import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Mail, 
  Clock, 
  Calendar,
  BarChart3,
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// Types de rapports disponibles
interface ReportConfig {
  id: string;
  name: string;
  description: string;
  category: "academique" | "financier" | "rh" | "vie_scolaire";
  frequency: "quotidien" | "hebdomadaire" | "mensuel" | "trimestriel";
  isActive: boolean;
  lastGenerated?: string;
  nextGeneration?: string;
  recipients: string[];
  format: "pdf" | "excel" | "both";
}

const reportConfigs: ReportConfig[] = [
  {
    id: "1",
    name: "Rapport d'assiduité hebdomadaire",
    description: "Synthèse des absences et retards par classe",
    category: "vie_scolaire",
    frequency: "hebdomadaire",
    isActive: true,
    lastGenerated: "08/01/2025",
    nextGeneration: "15/01/2025",
    recipients: ["directeur@ecole.ci", "cpe@ecole.ci"],
    format: "pdf",
  },
  {
    id: "2",
    name: "État des paiements mensuel",
    description: "Récapitulatif des frais de scolarité et arriérés",
    category: "financier",
    frequency: "mensuel",
    isActive: true,
    lastGenerated: "01/01/2025",
    nextGeneration: "01/02/2025",
    recipients: ["comptable@ecole.ci", "directeur@ecole.ci"],
    format: "excel",
  },
  {
    id: "3",
    name: "Bulletin trimestriel des moyennes",
    description: "Moyennes par classe et par matière",
    category: "academique",
    frequency: "trimestriel",
    isActive: true,
    lastGenerated: "20/12/2024",
    nextGeneration: "28/03/2025",
    recipients: ["pedagogique@ecole.ci"],
    format: "both",
  },
  {
    id: "4",
    name: "Rapport de pointage enseignants",
    description: "Présences et heures effectuées par enseignant",
    category: "rh",
    frequency: "mensuel",
    isActive: true,
    lastGenerated: "01/01/2025",
    nextGeneration: "01/02/2025",
    recipients: ["rh@ecole.ci"],
    format: "excel",
  },
  {
    id: "5",
    name: "Alertes élèves en difficulté",
    description: "Liste des élèves nécessitant un suivi particulier",
    category: "academique",
    frequency: "hebdomadaire",
    isActive: false,
    lastGenerated: "25/12/2024",
    nextGeneration: "-",
    recipients: ["cpe@ecole.ci", "pedagogique@ecole.ci"],
    format: "pdf",
  },
  {
    id: "6",
    name: "Bilan financier quotidien",
    description: "Encaissements et dépenses du jour",
    category: "financier",
    frequency: "quotidien",
    isActive: true,
    lastGenerated: "09/01/2025",
    nextGeneration: "10/01/2025",
    recipients: ["comptable@ecole.ci"],
    format: "pdf",
  },
];

// Historique des rapports générés
const reportHistory = [
  { id: 1, name: "Rapport d'assiduité hebdomadaire", date: "08/01/2025", status: "success", size: "245 KB" },
  { id: 2, name: "Bilan financier quotidien", date: "09/01/2025", status: "success", size: "128 KB" },
  { id: 3, name: "État des paiements mensuel", date: "01/01/2025", status: "success", size: "512 KB" },
  { id: 4, name: "Rapport de pointage enseignants", date: "01/01/2025", status: "success", size: "348 KB" },
  { id: 5, name: "Alertes élèves en difficulté", date: "25/12/2024", status: "error", size: "-" },
];

// Modèles de rapports personnalisables
const reportTemplates = [
  { id: 1, name: "Récapitulatif mensuel personnalisé", fields: 12, lastUsed: "05/01/2025" },
  { id: 2, name: "Export élèves par classe", fields: 8, lastUsed: "03/01/2025" },
  { id: 3, name: "Suivi financier personnalisé", fields: 15, lastUsed: "01/01/2025" },
];

export default function RapportsAutomatiques() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<ReportConfig[]>(reportConfigs);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academique":
        return <GraduationCap className="h-4 w-4" />;
      case "financier":
        return <DollarSign className="h-4 w-4" />;
      case "rh":
        return <Users className="h-4 w-4" />;
      case "vie_scolaire":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "academique":
        return "Académique";
      case "financier":
        return "Financier";
      case "rh":
        return "Ressources Humaines";
      case "vie_scolaire":
        return "Vie Scolaire";
      default:
        return category;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "quotidien":
        return "Quotidien";
      case "hebdomadaire":
        return "Hebdomadaire";
      case "mensuel":
        return "Mensuel";
      case "trimestriel":
        return "Trimestriel";
      default:
        return frequency;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "quotidien":
        return "bg-destructive text-destructive-foreground";
      case "hebdomadaire":
        return "bg-warning text-warning-foreground";
      case "mensuel":
        return "bg-primary text-primary-foreground";
      case "trimestriel":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const toggleReport = (id: string) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
    toast.success("Configuration mise à jour");
  };

  const generateReport = async (id: string) => {
    setIsGenerating(id);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(null);
    toast.success("Rapport généré avec succès");
  };

  const activeReportsCount = reports.filter(r => r.isActive).length;
  const totalReportsGenerated = reportHistory.filter(r => r.status === "success").length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Rapports Automatiques</h1>
          <p className="text-muted-foreground mt-2">Configuration et génération automatique de rapports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports actifs</CardTitle>
            <Play className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReportsCount}/{reports.length}</div>
            <p className="text-xs text-muted-foreground">Configurations actives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Générés ce mois</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReportsGenerated}</div>
            <p className="text-xs text-muted-foreground">Rapports créés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails envoyés</CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochain rapport</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10/01</div>
            <p className="text-xs text-muted-foreground">Bilan financier quotidien</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="modeles">Modèles personnalisés</TabsTrigger>
          <TabsTrigger value="planification">Planification</TabsTrigger>
        </TabsList>

        {/* Onglet Configuration */}
        <TabsContent value="configuration" className="space-y-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className={!report.isActive ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${report.isActive ? "bg-primary/10" : "bg-muted"}`}>
                        {getCategoryIcon(report.category)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{report.name}</h3>
                          <Badge className={getFrequencyColor(report.frequency)}>
                            {getFrequencyLabel(report.frequency)}
                          </Badge>
                          <Badge variant="outline">{getCategoryLabel(report.category)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Dernier: {report.lastGenerated}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Prochain: {report.nextGeneration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {report.recipients.length} destinataire(s)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`switch-${report.id}`} className="text-sm">
                          {report.isActive ? "Actif" : "Inactif"}
                        </Label>
                        <Switch
                          id={`switch-${report.id}`}
                          checked={report.isActive}
                          onCheckedChange={() => toggleReport(report.id)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateReport(report.id)}
                        disabled={isGenerating === report.id}
                      >
                        {isGenerating === report.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="ml-2">Générer</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des rapports générés</CardTitle>
              <CardDescription>Rapports créés automatiquement ou manuellement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rapport</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportHistory.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        {report.status === "success" ? (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Succès
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Erreur
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {report.status === "success" && (
                            <>
                              <Button size="sm" variant="ghost" title="Voir">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Télécharger">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Renvoyer par email">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {report.status === "error" && (
                            <Button size="sm" variant="ghost" title="Réessayer">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Modèles */}
        <TabsContent value="modeles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.fields} champs configurés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Dernière utilisation: {template.lastUsed}
                    </span>
                    <Button size="sm" variant="outline">
                      Utiliser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[150px]">
              <div className="text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium">Créer un modèle</p>
                <p className="text-sm text-muted-foreground">Personnalisez votre rapport</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Planification */}
        <TabsContent value="planification" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rapports programmés cette semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Bilan financier quotidien</p>
                      <p className="text-sm text-muted-foreground">Tous les jours à 18h00</p>
                    </div>
                    <Badge className="bg-destructive text-destructive-foreground">Quotidien</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Rapport d'assiduité hebdomadaire</p>
                      <p className="text-sm text-muted-foreground">Vendredi 15/01 à 17h00</p>
                    </div>
                    <Badge className="bg-warning text-warning-foreground">Hebdomadaire</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques de génération</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Taux de réussite</span>
                      <span className="text-sm font-bold text-success">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Rapports envoyés par email</span>
                      <span className="text-sm font-bold">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Temps moyen de génération</span>
                      <span className="text-sm font-bold">2.3s</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
