import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Wrench, Plus, AlertTriangle, CheckCircle, Clock, Calendar, Search, Filter, Trash2, Edit, Eye, Building, User, FileText, Download, TrendingUp, AlertCircle, XCircle, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Intervention {
  id: number;
  type: "Urgent" | "Préventif" | "Réparation" | "Entretien" | "Installation";
  lieu: string;
  building: string;
  probleme: string;
  description: string;
  dateSignalement: string;
  dateIntervention?: string;
  priorite: "Haute" | "Normale" | "Basse";
  statut: "En cours" | "En attente" | "Planifié" | "Terminé" | "Annulé";
  technicien: string | null;
  signalePar: string;
  coutEstime?: number;
  coutReel?: number;
  photos?: string[];
  notes?: string;
}

const initialInterventions: Intervention[] = [
  { id: 1, type: "Urgent", lieu: "Classe 3ème A", building: "Bâtiment A", probleme: "Fuite d'eau au plafond", description: "Fuite importante détectée au niveau du plafond, probablement due à une canalisation défectueuse", dateSignalement: "15 Déc 2024", dateIntervention: "16 Déc 2024", priorite: "Haute", statut: "En cours", technicien: "M. DIABY", signalePar: "M. KOUAME", coutEstime: 150000 },
  { id: 2, type: "Préventif", lieu: "Laboratoire Physique", building: "Bâtiment B", probleme: "Révision électrique annuelle", description: "Contrôle et mise aux normes des installations électriques du laboratoire", dateSignalement: "14 Déc 2024", dateIntervention: "20 Déc 2024", priorite: "Normale", statut: "Planifié", technicien: "M. KOUADIO", signalePar: "Service Technique", coutEstime: 200000 },
  { id: 3, type: "Réparation", lieu: "Cantine", building: "Annexe", probleme: "Réfrigérateur en panne", description: "Le réfrigérateur principal ne refroidit plus correctement", dateSignalement: "13 Déc 2024", dateIntervention: "14 Déc 2024", priorite: "Haute", statut: "Terminé", technicien: "M. DIABY", signalePar: "Chef Cantine", coutEstime: 75000, coutReel: 68000 },
  { id: 4, type: "Entretien", lieu: "Cour de récréation", building: "Extérieur", probleme: "Peinture bancs", description: "Rafraîchissement de la peinture des bancs de la cour", dateSignalement: "12 Déc 2024", dateIntervention: "22 Déc 2024", priorite: "Basse", statut: "Planifié", technicien: "M. TRAORE", signalePar: "Direction", coutEstime: 50000 },
  { id: 5, type: "Urgent", lieu: "Salle Informatique", building: "Bâtiment C", probleme: "Climatisation défaillante", description: "La climatisation ne fonctionne plus, température élevée dans la salle", dateSignalement: "15 Déc 2024", priorite: "Haute", statut: "En attente", technicien: null, signalePar: "M. YAPI", coutEstime: 300000 },
  { id: 6, type: "Réparation", lieu: "Sanitaires Garçons", building: "Bâtiment A", probleme: "Chasse d'eau cassée", description: "La chasse d'eau ne fonctionne plus dans les toilettes du 1er étage", dateSignalement: "14 Déc 2024", priorite: "Normale", statut: "En attente", technicien: null, signalePar: "Surveillant", coutEstime: 25000 },
  { id: 7, type: "Installation", lieu: "Amphithéâtre", building: "Bâtiment A", probleme: "Nouveau vidéoprojecteur", description: "Installation d'un nouveau vidéoprojecteur HD et configuration du système", dateSignalement: "10 Déc 2024", dateIntervention: "18 Déc 2024", priorite: "Normale", statut: "Planifié", technicien: "M. KOUADIO", signalePar: "Direction", coutEstime: 500000 },
  { id: 8, type: "Entretien", lieu: "Toiture Bâtiment B", building: "Bâtiment B", probleme: "Nettoyage gouttières", description: "Nettoyage annuel des gouttières avant la saison des pluies", dateSignalement: "11 Déc 2024", dateIntervention: "19 Déc 2024", priorite: "Normale", statut: "Planifié", technicien: "M. TRAORE", signalePar: "Service Technique", coutEstime: 30000 },
];

const planning = [
  { date: "18 Déc 2024", tache: "Installation vidéoprojecteur", lieu: "Amphithéâtre", duree: "4h", technicien: "M. KOUADIO", type: "Installation" },
  { date: "19 Déc 2024", tache: "Nettoyage gouttières", lieu: "Bâtiment B", duree: "3h", technicien: "M. TRAORE", type: "Entretien" },
  { date: "20 Déc 2024", tache: "Révision électrique", lieu: "Labo Physique", duree: "6h", technicien: "M. KOUADIO", type: "Préventif" },
  { date: "22 Déc 2024", tache: "Peinture bancs", lieu: "Cour", duree: "8h", technicien: "M. TRAORE", type: "Entretien" },
  { date: "23 Déc 2024", tache: "Vérification extincteurs", lieu: "Tous bâtiments", duree: "4h", technicien: "M. DIABY", type: "Préventif" },
];

const techniciens = [
  { id: 1, nom: "M. DIABY Moussa", specialite: "Plomberie, Électricité", disponible: true, interventionsEnCours: 1 },
  { id: 2, nom: "M. KOUADIO Yao", specialite: "Électricité, Informatique", disponible: true, interventionsEnCours: 0 },
  { id: 3, nom: "M. TRAORE Ibrahim", specialite: "Peinture, Menuiserie", disponible: true, interventionsEnCours: 0 },
  { id: 4, nom: "M. BAMBA Sekou", specialite: "Climatisation, Froid", disponible: false, interventionsEnCours: 2 },
];

export default function Maintenance() {
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const stats = {
    enCours: interventions.filter(i => i.statut === "En cours").length,
    enAttente: interventions.filter(i => i.statut === "En attente").length,
    planifies: interventions.filter(i => i.statut === "Planifié").length,
    termines: interventions.filter(i => i.statut === "Terminé").length,
    urgents: interventions.filter(i => i.priorite === "Haute" && i.statut !== "Terminé").length,
    coutTotal: interventions.reduce((acc, i) => acc + (i.coutEstime || 0), 0),
  };

  const filteredInterventions = interventions.filter(i => {
    const matchesSearch = i.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         i.probleme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (i.technicien?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = filterStatus === "all" || i.statut === filterStatus;
    const matchesPriority = filterPriority === "all" || i.priorite === filterPriority;
    const matchesType = filterType === "all" || i.type === filterType;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "bg-blue-500 text-white";
      case "En attente": return "bg-yellow-500 text-white";
      case "Planifié": return "bg-purple-500 text-white";
      case "Terminé": return "bg-green-500 text-white";
      case "Annulé": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En cours": return <Wrench className="h-3 w-3" />;
      case "En attente": return <Clock className="h-3 w-3" />;
      case "Planifié": return <Calendar className="h-3 w-3" />;
      case "Terminé": return <CheckCircle className="h-3 w-3" />;
      case "Annulé": return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute": return "destructive";
      case "Normale": return "default";
      case "Basse": return "secondary";
      default: return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Urgent": return "bg-red-100 text-red-700";
      case "Préventif": return "bg-blue-100 text-blue-700";
      case "Réparation": return "bg-orange-100 text-orange-700";
      case "Entretien": return "bg-green-100 text-green-700";
      case "Installation": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleAddIntervention = () => {
    toast({
      title: "Intervention créée",
      description: "La nouvelle intervention a été enregistrée.",
    });
    setIsAddDialogOpen(false);
  };

  const handleAssignTechnician = (interventionId: number, technicien: string) => {
    setInterventions(interventions.map(i => 
      i.id === interventionId ? { ...i, technicien, statut: "En cours" as const } : i
    ));
    toast({
      title: "Technicien assigné",
      description: `${technicien} a été assigné à l'intervention.`,
    });
  };

  const handleCompleteIntervention = (interventionId: number) => {
    setInterventions(interventions.map(i => 
      i.id === interventionId ? { ...i, statut: "Terminé" as const } : i
    ));
    toast({
      title: "Intervention terminée",
      description: "L'intervention a été marquée comme terminée.",
    });
  };

  const handleViewIntervention = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance & Interventions</h1>
          <p className="text-muted-foreground">Gestion complète de l'entretien des infrastructures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Intervention
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Signaler une Intervention</DialogTitle>
                <DialogDescription>Décrivez le problème à résoudre</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'intervention</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="reparation">Réparation</SelectItem>
                        <SelectItem value="entretien">Entretien</SelectItem>
                        <SelectItem value="preventif">Préventif</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="haute">Haute</SelectItem>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="basse">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lieu">Lieu</Label>
                    <Input id="lieu" placeholder="Ex: Salle 101, Cantine..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building">Bâtiment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">Bâtiment A</SelectItem>
                        <SelectItem value="b">Bâtiment B</SelectItem>
                        <SelectItem value="c">Bâtiment C</SelectItem>
                        <SelectItem value="annexe">Annexe</SelectItem>
                        <SelectItem value="exterieur">Extérieur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probleme">Problème constaté</Label>
                  <Input id="probleme" placeholder="Description courte du problème" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée</Label>
                  <Textarea id="description" placeholder="Décrivez le problème en détail..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signalePar">Signalé par</Label>
                    <Input id="signalePar" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coutEstime">Coût estimé (FCFA)</Label>
                    <Input id="coutEstime" type="number" placeholder="0" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleAddIntervention}>Créer l'intervention</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
            <p className="text-xs text-muted-foreground">interventions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
            <p className="text-xs text-muted-foreground">à traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiées</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.planifies}</div>
            <p className="text-xs text-muted-foreground">programmées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.termines}</div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgents}</div>
            <p className="text-xs text-muted-foreground">haute priorité</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.coutTotal / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">FCFA estimé</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interventions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="techniciens">Techniciens</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Liste des Interventions</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[180px]"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Planifié">Planifié</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="Haute">Haute</SelectItem>
                      <SelectItem value="Normale">Normale</SelectItem>
                      <SelectItem value="Basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Réparation">Réparation</SelectItem>
                      <SelectItem value="Entretien">Entretien</SelectItem>
                      <SelectItem value="Préventif">Préventif</SelectItem>
                      <SelectItem value="Installation">Installation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Problème</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Technicien</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterventions.map((intervention) => (
                    <TableRow key={intervention.id}>
                      <TableCell>
                        <Badge className={getTypeColor(intervention.type)}>{intervention.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{intervention.lieu}</div>
                          <div className="text-xs text-muted-foreground">{intervention.building}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{intervention.probleme}</TableCell>
                      <TableCell>{intervention.dateSignalement}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(intervention.priorite) as any}>
                          {intervention.priorite === "Haute" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {intervention.priorite}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {intervention.technicien ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {intervention.technicien}
                          </div>
                        ) : (
                          <Select onValueChange={(value) => handleAssignTechnician(intervention.id, value)}>
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue placeholder="Assigner" />
                            </SelectTrigger>
                            <SelectContent>
                              {techniciens.filter(t => t.disponible).map(t => (
                                <SelectItem key={t.id} value={t.nom}>{t.nom}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(intervention.statut)}`}>
                          {getStatusIcon(intervention.statut)}
                          {intervention.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleViewIntervention(intervention)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {intervention.statut === "En cours" && (
                            <Button size="icon" variant="ghost" onClick={() => handleCompleteIntervention(intervention.id)}>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="planning" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Planning des Interventions</CardTitle>
                <CardDescription>Interventions programmées pour les prochains jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {planning.map((item, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-sm text-muted-foreground">{item.date.split(" ")[0]}</span>
                              <span className="text-2xl font-bold">{item.date.split(" ")[1]}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{item.tache}</p>
                                <Badge className={getTypeColor(item.type)} variant="outline">{item.type}</Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {item.lieu}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.duree}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {item.technicien}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Sélectionnez une date pour voir les interventions planifiées</p>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cette semaine</span>
                    <Badge>{planning.filter(p => true).length} interventions</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ce mois</span>
                    <Badge variant="secondary">12 interventions</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="techniciens" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {techniciens.map((tech) => (
              <Card key={tech.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tech.nom}</CardTitle>
                    <Badge variant={tech.disponible ? "default" : "secondary"}>
                      {tech.disponible ? "Disponible" : "Occupé"}
                    </Badge>
                  </div>
                  <CardDescription>{tech.specialite}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Interventions en cours</span>
                      <span className="font-medium">{tech.interventionsEnCours}</span>
                    </div>
                    <Progress value={tech.interventionsEnCours * 33} className="h-2" />
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir le planning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rapports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interventions réalisées</span>
                    <span className="font-bold text-green-600">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Temps moyen de résolution</span>
                    <span className="font-bold">2.3 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Coût total du mois</span>
                    <span className="font-bold">1,250,000 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Taux de résolution</span>
                    <span className="font-bold text-green-600">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "Réparation", count: 12, percent: 40 },
                    { type: "Entretien", count: 8, percent: 27 },
                    { type: "Préventif", count: 6, percent: 20 },
                    { type: "Urgent", count: 3, percent: 10 },
                    { type: "Installation", count: 1, percent: 3 },
                  ].map((item) => (
                    <div key={item.type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span className="text-muted-foreground">{item.count} ({item.percent}%)</span>
                      </div>
                      <Progress value={item.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Exporter les Rapports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Rapport mensuel (PDF)
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Historique interventions (Excel)
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analyse des coûts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Intervention Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Intervention</DialogTitle>
          </DialogHeader>
          {selectedIntervention && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Badge className={getTypeColor(selectedIntervention.type)}>{selectedIntervention.type}</Badge>
                <Badge className={getStatusColor(selectedIntervention.statut)}>
                  {selectedIntervention.statut}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Lieu</Label>
                  <p className="font-medium">{selectedIntervention.lieu}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Bâtiment</Label>
                  <p className="font-medium">{selectedIntervention.building}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Problème</Label>
                <p className="font-medium">{selectedIntervention.probleme}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedIntervention.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Date de signalement</Label>
                  <p className="font-medium">{selectedIntervention.dateSignalement}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Signalé par</Label>
                  <p className="font-medium">{selectedIntervention.signalePar}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Technicien assigné</Label>
                  <p className="font-medium">{selectedIntervention.technicien || "Non assigné"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Priorité</Label>
                  <Badge variant={getPriorityColor(selectedIntervention.priorite) as any}>
                    {selectedIntervention.priorite}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Coût estimé</Label>
                  <p className="font-medium">{selectedIntervention.coutEstime?.toLocaleString()} FCFA</p>
                </div>
                {selectedIntervention.coutReel && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Coût réel</Label>
                    <p className="font-medium">{selectedIntervention.coutReel.toLocaleString()} FCFA</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            {selectedIntervention?.statut === "En cours" && (
              <Button onClick={() => {
                handleCompleteIntervention(selectedIntervention.id);
                setIsViewDialogOpen(false);
              }}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer terminé
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
