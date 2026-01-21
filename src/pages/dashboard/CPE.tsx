import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  UserX, 
  Clock, 
  TrendingDown, 
  MessageSquare, 
  Phone,
  Mail,
  Eye,
  FileText,
  Bell,
  Users,
  Calendar,
  Search,
  Download,
  Loader2,
  Plus
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateDashboardReport } from "@/components/dashboard/DashboardReportGenerator";

// Données de suivi des absences
const absenceData = [
  { semaine: "S1", absences: 45, retards: 23, justifiees: 38 },
  { semaine: "S2", absences: 52, retards: 28, justifiees: 41 },
  { semaine: "S3", absences: 38, retards: 19, justifiees: 35 },
  { semaine: "S4", absences: 41, retards: 25, justifiees: 32 },
];

// Élèves à risque
const elevesRisque = [
  { 
    id: 1, 
    nom: "KOUASSI Marcel", 
    classe: "3èmeA", 
    absences: 12, 
    retards: 8, 
    incidents: 3, 
    moyenneConduite: 8, 
    alerteType: "urgent",
    dernierContact: "Il y a 5 jours"
  },
  { 
    id: 2, 
    nom: "TRAORÉ Aminata", 
    classe: "5èmeB", 
    absences: 9, 
    retards: 5, 
    incidents: 2, 
    moyenneConduite: 10, 
    alerteType: "warning",
    dernierContact: "Il y a 3 jours"
  },
  { 
    id: 3, 
    nom: "BAMBA Koné", 
    classe: "4èmeC", 
    absences: 7, 
    retards: 4, 
    incidents: 1, 
    moyenneConduite: 11, 
    alerteType: "warning",
    dernierContact: "Il y a 1 semaine"
  },
  { 
    id: 4, 
    nom: "DIALLO Moussa", 
    classe: "6èmeA", 
    absences: 6, 
    retards: 10, 
    incidents: 0, 
    moyenneConduite: 12, 
    alerteType: "info",
    dernierContact: "Aujourd'hui"
  },
];

// Incidents récents
const incidentsRecents = [
  { 
    id: 1, 
    date: "15/01/2025", 
    eleve: "KOUASSI Marcel", 
    classe: "3èmeA", 
    type: "Bagarre",
    gravite: "grave",
    statut: "en_cours",
    mesure: "Convocation parents"
  },
  { 
    id: 2, 
    date: "14/01/2025", 
    eleve: "SANOGO Paul", 
    classe: "5èmeA", 
    type: "Insolence",
    gravite: "moyen",
    statut: "traite",
    mesure: "Avertissement écrit"
  },
  { 
    id: 3, 
    date: "13/01/2025", 
    eleve: "KOFFI Marie", 
    classe: "4èmeB", 
    type: "Retards répétés",
    gravite: "leger",
    statut: "traite",
    mesure: "Rappel à l'ordre"
  },
  { 
    id: 4, 
    date: "12/01/2025", 
    eleve: "YAO Jean", 
    classe: "2ndeC", 
    type: "Dégradation",
    gravite: "grave",
    statut: "en_cours",
    mesure: "Conseil de discipline"
  },
];

// Répartition des sanctions
const sanctionsData = [
  { name: "Avertissement oral", value: 45, color: "#22c55e" },
  { name: "Avertissement écrit", value: 28, color: "#f59e0b" },
  { name: "Retenue", value: 15, color: "#ef4444" },
  { name: "Exclusion temporaire", value: 8, color: "#7c3aed" },
  { name: "Conseil discipline", value: 4, color: "#dc2626" },
];

// Convocations en attente
const convocationsAttente = [
  { id: 1, eleve: "KOUASSI Marcel", parent: "M. KOUASSI", date: "17/01/2025", heure: "10:00", motif: "Comportement" },
  { id: 2, eleve: "TRAORÉ Aminata", parent: "Mme TRAORÉ", date: "18/01/2025", heure: "14:30", motif: "Absences répétées" },
  { id: 3, eleve: "BAMBA Koné", parent: "M. BAMBA", date: "19/01/2025", heure: "09:00", motif: "Difficultés scolaires" },
];

export default function CPEDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isNewConvocationOpen, setIsNewConvocationOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({ eleve: "", classe: "", type: "", gravite: "", description: "" });
  const [newConvocation, setNewConvocation] = useState({ eleve: "", parent: "", date: "", heure: "", motif: "" });
  
  const filteredElevesRisque = elevesRisque.filter(e => 
    e.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.classe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateWeeklyReport = async () => {
    setIsGeneratingReport(true);
    try {
      generateDashboardReport({
        title: "Rapport Hebdomadaire CPE",
        subtitle: "Suivi de la vie scolaire et de la discipline",
        establishment: "NextGen Éducation",
        period: "Semaine du 13 au 19 janvier 2025",
        kpis: [
          { label: "Élèves à risque", value: String(elevesRisque.length), trend: "down" },
          { label: "Absences ce mois", value: "176", change: "68 non justifiées" },
          { label: "Retards ce mois", value: "95", change: "-12%", trend: "up" },
          { label: "Incidents actifs", value: "7", change: "2 conseils à venir" },
          { label: "Convocations", value: String(convocationsAttente.length) },
        ],
        alerts: [
          { type: "urgent", message: `${elevesRisque.filter(e => e.alerteType === "urgent").length} élèves en alerte urgente` },
          { type: "warning", message: `${incidentsRecents.filter(i => i.statut === "en_cours").length} incidents en cours de traitement` },
          { type: "info", message: `${convocationsAttente.length} convocations programmées cette semaine` },
        ],
        tables: [
          {
            title: "Élèves à Risque",
            headers: ["Nom", "Classe", "Absences", "Retards", "Incidents", "Conduite", "Alerte"],
            rows: elevesRisque.map(e => [
              e.nom,
              e.classe,
              String(e.absences),
              String(e.retards),
              String(e.incidents),
              `${e.moyenneConduite}/20`,
              e.alerteType,
            ]),
          },
          {
            title: "Incidents Récents",
            headers: ["Date", "Élève", "Classe", "Type", "Gravité", "Mesure", "Statut"],
            rows: incidentsRecents.map(i => [
              i.date,
              i.eleve,
              i.classe,
              i.type,
              i.gravite,
              i.mesure,
              i.statut === "en_cours" ? "En cours" : "Traité",
            ]),
          },
          {
            title: "Convocations Programmées",
            headers: ["Élève", "Parent", "Date", "Heure", "Motif"],
            rows: convocationsAttente.map(c => [c.eleve, c.parent, c.date, c.heure, c.motif]),
          },
          {
            title: "Évolution des Absences (4 semaines)",
            headers: ["Semaine", "Absences", "Retards", "Justifiées"],
            rows: absenceData.map(a => [a.semaine, String(a.absences), String(a.retards), String(a.justifiees)]),
          },
        ],
        chartData: [
          {
            title: "Répartition des Sanctions",
            type: "pie",
            data: sanctionsData.map(s => ({ name: s.name, value: s.value })),
          },
        ],
        additionalInfo: [
          { label: "Taux justification", value: "68%" },
          { label: "Tendance absences", value: "En baisse" },
          { label: "Conseils à venir", value: "2" },
        ],
      });
      toast({
        title: "Rapport généré",
        description: "Le rapport hebdomadaire CPE a été téléchargé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleShowAlerts = () => {
    toast({
      title: "Alertes actives",
      description: `${elevesRisque.filter(e => e.alerteType === "urgent").length} élèves en alerte urgente, ${incidentsRecents.filter(i => i.statut === "en_cours").length} incidents en cours.`,
    });
  };

  const handleViewProfile = (eleve: typeof elevesRisque[0]) => {
    toast({ title: "Profil élève", description: `Ouverture du profil de ${eleve.nom}` });
    navigate(`/students`);
  };

  const handleCallParent = (nom: string) => {
    toast({ title: "Appel parent", description: `Initiation de l'appel pour le parent de ${nom}` });
  };

  const handleSendSMS = (nom: string) => {
    toast({ title: "SMS envoyé", description: `Rappel SMS envoyé au parent de ${nom}` });
  };

  const handleSendEmail = (nom: string) => {
    toast({ title: "Email envoyé", description: `Email de convocation envoyé au parent de ${nom}` });
  };

  const handleViewFiche = (nom: string) => {
    toast({ title: "Fiche de suivi", description: `Ouverture de la fiche de suivi pour ${nom}` });
  };

  const handleViewIncident = (incident: typeof incidentsRecents[0]) => {
    toast({ title: "Détails incident", description: `${incident.type} - ${incident.eleve}: ${incident.mesure}` });
  };

  const handleDownloadIncidentReport = (incident: typeof incidentsRecents[0]) => {
    toast({ title: "Téléchargement", description: `Rapport d'incident pour ${incident.eleve} téléchargé` });
  };

  const handleAddIncident = () => {
    if (newIncident.eleve && newIncident.type && newIncident.gravite) {
      toast({ title: "Incident enregistré", description: `Nouvel incident créé pour ${newIncident.eleve}` });
      setNewIncident({ eleve: "", classe: "", type: "", gravite: "", description: "" });
      setIsNewIncidentOpen(false);
    } else {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
    }
  };

  const handleAddConvocation = () => {
    if (newConvocation.eleve && newConvocation.parent && newConvocation.date) {
      toast({ title: "Convocation créée", description: `Rendez-vous planifié pour ${newConvocation.parent}` });
      setNewConvocation({ eleve: "", parent: "", date: "", heure: "", motif: "" });
      setIsNewConvocationOpen(false);
    } else {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">À surveiller</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getGraviteBadge = (gravite: string) => {
    switch (gravite) {
      case "grave":
        return <Badge variant="destructive">Grave</Badge>;
      case "moyen":
        return <Badge className="bg-warning text-warning-foreground">Moyen</Badge>;
      default:
        return <Badge variant="secondary">Léger</Badge>;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return <Badge className="bg-primary text-primary-foreground">En cours</Badge>;
      case "traite":
        return <Badge className="bg-success text-success-foreground">Traité</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Tableau de Bord CPE</h1>
          <p className="text-muted-foreground mt-2">Suivi de la vie scolaire et de la discipline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateWeeklyReport} disabled={isGeneratingReport}>
            {isGeneratingReport ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isGeneratingReport ? "Génération..." : "Rapport hebdo"}
          </Button>
          <Button onClick={handleShowAlerts}>
            <Bell className="mr-2 h-4 w-4" />
            Alertes ({elevesRisque.filter(e => e.alerteType === "urgent").length})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves à risque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{elevesRisque.length}</div>
            <p className="text-xs text-muted-foreground">Suivi prioritaire requis</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absences ce mois</CardTitle>
            <UserX className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">176</div>
            <p className="text-xs text-muted-foreground">68 non justifiées</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards ce mois</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">-12% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents actifs</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 conseils à venir</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convocations</CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convocationsAttente.length}</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="risque" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="risque">Élèves à risque</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="absences">Absences</TabsTrigger>
          <TabsTrigger value="convocations">Convocations</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        {/* Onglet Élèves à risque */}
        <TabsContent value="risque" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Élèves nécessitant un suivi prioritaire</CardTitle>
                  <CardDescription>Alertes automatiques basées sur absences, retards et incidents</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-center">Absences</TableHead>
                    <TableHead className="text-center">Retards</TableHead>
                    <TableHead className="text-center">Incidents</TableHead>
                    <TableHead className="text-center">Conduite</TableHead>
                    <TableHead>Alerte</TableHead>
                    <TableHead>Dernier contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElevesRisque.map((eleve) => (
                    <TableRow key={eleve.id} className={eleve.alerteType === "urgent" ? "bg-destructive/5" : ""}>
                      <TableCell className="font-medium">{eleve.nom}</TableCell>
                      <TableCell><Badge variant="outline">{eleve.classe}</Badge></TableCell>
                      <TableCell className="text-center">
                        <span className={eleve.absences >= 10 ? "text-destructive font-bold" : ""}>
                          {eleve.absences}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{eleve.retards}</TableCell>
                      <TableCell className="text-center">
                        <span className={eleve.incidents >= 2 ? "text-destructive font-bold" : ""}>
                          {eleve.incidents}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={eleve.moyenneConduite < 10 ? "destructive" : eleve.moyenneConduite < 12 ? "secondary" : "outline"}>
                          {eleve.moyenneConduite}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{getAlertBadge(eleve.alerteType)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{eleve.dernierContact}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Voir profil" onClick={() => handleViewProfile(eleve)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Appeler parent" onClick={() => handleCallParent(eleve.nom)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Envoyer SMS" onClick={() => handleSendSMS(eleve.nom)}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Fiche suivi" onClick={() => handleViewFiche(eleve.nom)}>
                            <FileText className="h-4 w-4" />
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

        {/* Onglet Incidents */}
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Incidents disciplinaires récents</CardTitle>
                  <CardDescription>Gestion et suivi des mesures disciplinaires</CardDescription>
                </div>
                <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvel incident
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Signaler un nouvel incident</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Élève *</Label>
                          <Input value={newIncident.eleve} onChange={(e) => setNewIncident({...newIncident, eleve: e.target.value})} placeholder="Nom de l'élève" />
                        </div>
                        <div className="space-y-2">
                          <Label>Classe</Label>
                          <Select onValueChange={(v) => setNewIncident({...newIncident, classe: v})}>
                            <SelectTrigger><SelectValue placeholder="Classe" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3emeA">3ème A</SelectItem>
                              <SelectItem value="4emeB">4ème B</SelectItem>
                              <SelectItem value="5emeA">5ème A</SelectItem>
                              <SelectItem value="6emeA">6ème A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type d'incident *</Label>
                          <Select onValueChange={(v) => setNewIncident({...newIncident, type: v})}>
                            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bagarre">Bagarre</SelectItem>
                              <SelectItem value="insolence">Insolence</SelectItem>
                              <SelectItem value="retards">Retards répétés</SelectItem>
                              <SelectItem value="degradation">Dégradation</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Gravité *</Label>
                          <Select onValueChange={(v) => setNewIncident({...newIncident, gravite: v})}>
                            <SelectTrigger><SelectValue placeholder="Gravité" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="leger">Léger</SelectItem>
                              <SelectItem value="moyen">Moyen</SelectItem>
                              <SelectItem value="grave">Grave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={newIncident.description} onChange={(e) => setNewIncident({...newIncident, description: e.target.value})} placeholder="Détails de l'incident..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewIncidentOpen(false)}>Annuler</Button>
                      <Button onClick={handleAddIncident}>Enregistrer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Mesure</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidentsRecents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.date}</TableCell>
                      <TableCell className="font-medium">{incident.eleve}</TableCell>
                      <TableCell><Badge variant="outline">{incident.classe}</Badge></TableCell>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell>{getGraviteBadge(incident.gravite)}</TableCell>
                      <TableCell className="text-sm">{incident.mesure}</TableCell>
                      <TableCell>{getStatutBadge(incident.statut)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Voir détails" onClick={() => handleViewIncident(incident)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Télécharger rapport" onClick={() => handleDownloadIncidentReport(incident)}>
                            <Download className="h-4 w-4" />
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

        {/* Onglet Absences */}
        <TabsContent value="absences" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution hebdomadaire</CardTitle>
                <CardDescription>Absences et retards par semaine</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={absenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semaine" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="absences" name="Absences" fill="hsl(var(--destructive))" />
                    <Bar dataKey="retards" name="Retards" fill="hsl(var(--warning))" />
                    <Bar dataKey="justifiees" name="Justifiées" fill="hsl(var(--success))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de justification</CardTitle>
                <CardDescription>Absences justifiées vs non justifiées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Absences justifiées</span>
                      <span className="text-sm font-bold text-success">68%</span>
                    </div>
                    <Progress value={68} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Absences non justifiées</span>
                      <span className="text-sm font-bold text-destructive">32%</span>
                    </div>
                    <Progress value={32} className="h-3 bg-muted [&>div]:bg-destructive" />
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Classes avec le plus d'absences</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>3èmeA</span>
                        <Badge variant="destructive">28 absences</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>5èmeB</span>
                        <Badge className="bg-warning text-warning-foreground">22 absences</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>4èmeC</span>
                        <Badge variant="secondary">18 absences</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Convocations */}
        <TabsContent value="convocations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Convocations parents planifiées</CardTitle>
                  <CardDescription>Rendez-vous à venir avec les parents</CardDescription>
                </div>
                <Dialog open={isNewConvocationOpen} onOpenChange={setIsNewConvocationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" />
                      Nouvelle convocation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Planifier une convocation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Élève *</Label>
                          <Input value={newConvocation.eleve} onChange={(e) => setNewConvocation({...newConvocation, eleve: e.target.value})} placeholder="Nom de l'élève" />
                        </div>
                        <div className="space-y-2">
                          <Label>Parent/Tuteur *</Label>
                          <Input value={newConvocation.parent} onChange={(e) => setNewConvocation({...newConvocation, parent: e.target.value})} placeholder="Nom du parent" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <Input type="date" value={newConvocation.date} onChange={(e) => setNewConvocation({...newConvocation, date: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Heure</Label>
                          <Input type="time" value={newConvocation.heure} onChange={(e) => setNewConvocation({...newConvocation, heure: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Motif</Label>
                        <Select onValueChange={(v) => setNewConvocation({...newConvocation, motif: v})}>
                          <SelectTrigger><SelectValue placeholder="Motif de convocation" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comportement">Comportement</SelectItem>
                            <SelectItem value="absences">Absences répétées</SelectItem>
                            <SelectItem value="difficultes">Difficultés scolaires</SelectItem>
                            <SelectItem value="incident">Suite à incident</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewConvocationOpen(false)}>Annuler</Button>
                      <Button onClick={handleAddConvocation}>Planifier</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Parent/Tuteur</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {convocationsAttente.map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell className="font-medium">{conv.date}</TableCell>
                      <TableCell>{conv.heure}</TableCell>
                      <TableCell>{conv.eleve}</TableCell>
                      <TableCell>{conv.parent}</TableCell>
                      <TableCell><Badge variant="outline">{conv.motif}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Appeler" onClick={() => handleCallParent(conv.parent)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Envoyer rappel SMS" onClick={() => handleSendSMS(conv.eleve)}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Envoyer email" onClick={() => handleSendEmail(conv.eleve)}>
                            <Mail className="h-4 w-4" />
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

        {/* Onglet Statistiques */}
        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des sanctions</CardTitle>
                <CardDescription>Types de sanctions appliquées ce trimestre</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sanctionsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sanctionsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs clés</CardTitle>
                <CardDescription>Performance vie scolaire</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de présence global</p>
                      <p className="text-3xl font-bold text-success">96.2%</p>
                    </div>
                    <Users className="h-10 w-10 text-success/50" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Moyenne conduite établissement</p>
                      <p className="text-3xl font-bold text-primary">14.8/20</p>
                    </div>
                    <TrendingDown className="h-10 w-10 text-primary/50" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de réponse parents</p>
                      <p className="text-3xl font-bold text-warning">78%</p>
                    </div>
                    <MessageSquare className="h-10 w-10 text-warning/50" />
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
