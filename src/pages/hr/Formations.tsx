import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign,
  Plus,
  Search,
  Calendar,
  Award,
  Target,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  User,
  Building,
  BarChart3,
  Wallet,
  Eye,
  Edit,
  UserPlus
} from "lucide-react";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { mockPersonnel } from "@/data/mockPersonnel";

interface Formation {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  type: 'interne' | 'externe' | 'en_ligne';
  duree: number; // en heures
  cout: number; // en FCFA
  dateDebut: Date;
  dateFin: Date;
  lieu: string;
  formateur: string;
  placesMax: number;
  placesDisponibles: number;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  competences: string[];
  prerequis?: string[];
  objectifs: string[];
}

interface Inscription {
  id: string;
  formationId: string;
  personnelId: string;
  personnelNom: string;
  personnelPrenom: string;
  personnelPoste: string;
  dateInscription: Date;
  statut: 'en_attente' | 'validee' | 'refusee' | 'terminee' | 'abandon';
  heuresRealisees: number;
  noteEvaluation?: number;
  certificat?: boolean;
  commentaire?: string;
}

interface BudgetFormation {
  personnelId: string;
  personnelNom: string;
  personnelPrenom: string;
  personnelPoste: string;
  departement: string;
  budgetAnnuel: number;
  budgetUtilise: number;
  heuresPlanifiees: number;
  heuresRealisees: number;
  formationsTerminees: number;
  formationsEnCours: number;
}

const mockFormations: Formation[] = [
  {
    id: "F001",
    titre: "Pédagogie Active et Innovante",
    description: "Formation aux méthodes pédagogiques modernes et innovantes pour améliorer l'engagement des élèves.",
    categorie: "Pédagogie",
    type: 'interne',
    duree: 16,
    cout: 0,
    dateDebut: new Date(2024, 1, 15),
    dateFin: new Date(2024, 1, 17),
    lieu: "Salle de formation",
    formateur: "M. Koné Expert Pédagogique",
    placesMax: 20,
    placesDisponibles: 8,
    statut: 'planifiee',
    competences: ["Pédagogie", "Animation", "Évaluation"],
    objectifs: ["Maîtriser les techniques d'animation", "Créer des supports interactifs", "Évaluer les acquis"]
  },
  {
    id: "F002",
    titre: "Excel Avancé pour la Gestion Scolaire",
    description: "Maîtrise des fonctions avancées d'Excel pour l'analyse des données scolaires.",
    categorie: "Bureautique",
    type: 'externe',
    duree: 24,
    cout: 150000,
    dateDebut: new Date(2024, 2, 1),
    dateFin: new Date(2024, 2, 3),
    lieu: "Centre de formation CEFORP",
    formateur: "CEFORP Abidjan",
    placesMax: 15,
    placesDisponibles: 5,
    statut: 'planifiee',
    competences: ["Excel", "Analyse de données", "Reporting"],
    prerequis: ["Connaissance de base d'Excel"],
    objectifs: ["Utiliser les tableaux croisés dynamiques", "Créer des macros simples", "Générer des rapports automatisés"]
  },
  {
    id: "F003",
    titre: "Gestion du Stress et Bien-être au Travail",
    description: "Techniques de gestion du stress et amélioration du bien-être professionnel.",
    categorie: "Développement Personnel",
    type: 'interne',
    duree: 8,
    cout: 0,
    dateDebut: new Date(2024, 0, 20),
    dateFin: new Date(2024, 0, 20),
    lieu: "Salle polyvalente",
    formateur: "Dr. Coulibaly Psychologue",
    placesMax: 30,
    placesDisponibles: 0,
    statut: 'terminee',
    competences: ["Gestion du stress", "Communication", "Bien-être"],
    objectifs: ["Identifier les sources de stress", "Appliquer des techniques de relaxation", "Améliorer la communication"]
  },
  {
    id: "F004",
    titre: "Premiers Secours - PSC1",
    description: "Formation aux gestes de premiers secours et obtention du certificat PSC1.",
    categorie: "Sécurité",
    type: 'externe',
    duree: 7,
    cout: 75000,
    dateDebut: new Date(2024, 3, 10),
    dateFin: new Date(2024, 3, 10),
    lieu: "Croix-Rouge Ivoirienne",
    formateur: "Croix-Rouge CI",
    placesMax: 12,
    placesDisponibles: 12,
    statut: 'planifiee',
    competences: ["Premiers secours", "Sécurité"],
    objectifs: ["Alerter les secours", "Pratiquer les gestes d'urgence", "Utiliser un défibrillateur"]
  },
  {
    id: "F005",
    titre: "Management d'Équipe",
    description: "Développer ses compétences managériales pour mieux encadrer son équipe.",
    categorie: "Management",
    type: 'en_ligne',
    duree: 20,
    cout: 200000,
    dateDebut: new Date(2024, 1, 1),
    dateFin: new Date(2024, 2, 28),
    lieu: "En ligne (plateforme LMS)",
    formateur: "OpenClassrooms",
    placesMax: 50,
    placesDisponibles: 35,
    statut: 'en_cours',
    competences: ["Management", "Leadership", "Communication"],
    prerequis: ["Poste d'encadrement"],
    objectifs: ["Motiver son équipe", "Déléguer efficacement", "Gérer les conflits"]
  }
];

const mockInscriptions: Inscription[] = [
  {
    id: "INS001",
    formationId: "F001",
    personnelId: "P001",
    personnelNom: "Kouassi",
    personnelPrenom: "Amenan",
    personnelPoste: "Enseignant",
    dateInscription: new Date(2024, 0, 10),
    statut: 'validee',
    heuresRealisees: 0
  },
  {
    id: "INS002",
    formationId: "F003",
    personnelId: "P001",
    personnelNom: "Kouassi",
    personnelPrenom: "Amenan",
    personnelPoste: "Enseignant",
    dateInscription: new Date(2024, 0, 5),
    statut: 'terminee',
    heuresRealisees: 8,
    noteEvaluation: 85,
    certificat: true
  },
  {
    id: "INS003",
    formationId: "F002",
    personnelId: "P002",
    personnelNom: "Konan",
    personnelPrenom: "Yves",
    personnelPoste: "Comptable",
    dateInscription: new Date(2024, 1, 15),
    statut: 'validee',
    heuresRealisees: 0
  },
  {
    id: "INS004",
    formationId: "F005",
    personnelId: "P003",
    personnelNom: "Diallo",
    personnelPrenom: "Fatou",
    personnelPoste: "Secrétaire",
    dateInscription: new Date(2024, 1, 5),
    statut: 'validee',
    heuresRealisees: 12
  }
];

const mockBudgets: BudgetFormation[] = [
  {
    personnelId: "P001",
    personnelNom: "Kouassi",
    personnelPrenom: "Amenan",
    personnelPoste: "Enseignant",
    departement: "Sciences",
    budgetAnnuel: 500000,
    budgetUtilise: 75000,
    heuresPlanifiees: 24,
    heuresRealisees: 8,
    formationsTerminees: 1,
    formationsEnCours: 1
  },
  {
    personnelId: "P002",
    personnelNom: "Konan",
    personnelPrenom: "Yves",
    personnelPoste: "Comptable",
    departement: "Administration",
    budgetAnnuel: 400000,
    budgetUtilise: 150000,
    heuresPlanifiees: 24,
    heuresRealisees: 0,
    formationsTerminees: 0,
    formationsEnCours: 1
  },
  {
    personnelId: "P003",
    personnelNom: "Diallo",
    personnelPrenom: "Fatou",
    personnelPoste: "Secrétaire",
    departement: "Administration",
    budgetAnnuel: 300000,
    budgetUtilise: 200000,
    heuresPlanifiees: 20,
    heuresRealisees: 12,
    formationsTerminees: 0,
    formationsEnCours: 1
  },
  {
    personnelId: "P004",
    personnelNom: "Traoré",
    personnelPrenom: "Ibrahim",
    personnelPoste: "Enseignant",
    departement: "Lettres",
    budgetAnnuel: 500000,
    budgetUtilise: 0,
    heuresPlanifiees: 0,
    heuresRealisees: 0,
    formationsTerminees: 0,
    formationsEnCours: 0
  }
];

const categories = ["Pédagogie", "Bureautique", "Management", "Sécurité", "Développement Personnel", "Langues", "Technique"];

export default function Formations() {
  const [formations, setFormations] = useState<Formation[]>(mockFormations);
  const [inscriptions, setInscriptions] = useState<Inscription[]>(mockInscriptions);
  const [budgets] = useState<BudgetFormation[]>(mockBudgets);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategorie, setFilterCategorie] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showNewFormationDialog, setShowNewFormationDialog] = useState(false);
  const [showInscriptionDialog, setShowInscriptionDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  
  const [newFormation, setNewFormation] = useState({
    titre: "",
    description: "",
    categorie: "Pédagogie",
    type: 'interne' as const,
    duree: 8,
    cout: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    lieu: "",
    formateur: "",
    placesMax: 20,
    objectifs: ""
  });

  // Stats globales
  const stats = {
    totalFormations: formations.length,
    formationsEnCours: formations.filter(f => f.statut === 'en_cours').length,
    formationsTerminees: formations.filter(f => f.statut === 'terminee').length,
    formationsPlanifiees: formations.filter(f => f.statut === 'planifiee').length,
    totalInscrits: inscriptions.length,
    totalHeures: formations.reduce((acc, f) => acc + f.duree, 0),
    budgetTotal: budgets.reduce((acc, b) => acc + b.budgetAnnuel, 0),
    budgetUtilise: budgets.reduce((acc, b) => acc + b.budgetUtilise, 0),
    tauxRealisation: Math.round((budgets.reduce((acc, b) => acc + b.heuresRealisees, 0) / 
                     Math.max(budgets.reduce((acc, b) => acc + b.heuresPlanifiees, 0), 1)) * 100)
  };

  // Filtrage des formations
  const filteredFormations = formations.filter(f => {
    const matchSearch = f.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategorie = filterCategorie === "all" || f.categorie === filterCategorie;
    const matchStatut = filterStatut === "all" || f.statut === filterStatut;
    const matchType = filterType === "all" || f.type === filterType;
    return matchSearch && matchCategorie && matchStatut && matchType;
  });

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, className: string }> = {
      planifiee: { variant: "outline", label: "Planifiée", className: "text-blue-600 border-blue-600" },
      en_cours: { variant: "default", label: "En cours", className: "bg-orange-500" },
      terminee: { variant: "default", label: "Terminée", className: "bg-green-500" },
      annulee: { variant: "destructive", label: "Annulée", className: "" }
    };
    const config = variants[statut] || variants.planifiee;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, { label: string, className: string }> = {
      interne: { label: "Interne", className: "bg-purple-100 text-purple-800" },
      externe: { label: "Externe", className: "bg-blue-100 text-blue-800" },
      en_ligne: { label: "En ligne", className: "bg-green-100 text-green-800" }
    };
    const config = labels[type] || labels.interne;
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const getInscriptionStatutBadge = (statut: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      en_attente: { variant: "outline", label: "En attente" },
      validee: { variant: "default", label: "Validée" },
      refusee: { variant: "destructive", label: "Refusée" },
      terminee: { variant: "secondary", label: "Terminée" },
      abandon: { variant: "destructive", label: "Abandon" }
    };
    const config = variants[statut] || variants.en_attente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleCreateFormation = () => {
    const newF: Formation = {
      id: `F${String(formations.length + 1).padStart(3, '0')}`,
      titre: newFormation.titre,
      description: newFormation.description,
      categorie: newFormation.categorie,
      type: newFormation.type,
      duree: newFormation.duree,
      cout: newFormation.cout,
      dateDebut: newFormation.dateDebut,
      dateFin: newFormation.dateFin,
      lieu: newFormation.lieu,
      formateur: newFormation.formateur,
      placesMax: newFormation.placesMax,
      placesDisponibles: newFormation.placesMax,
      statut: 'planifiee',
      competences: [],
      objectifs: newFormation.objectifs.split('\n').filter(o => o.trim())
    };

    setFormations([...formations, newF]);
    setShowNewFormationDialog(false);
    toast({ title: "Formation créée", description: `"${newF.titre}" ajoutée au catalogue` });
    
    setNewFormation({
      titre: "",
      description: "",
      categorie: "Pédagogie",
      type: 'interne',
      duree: 8,
      cout: 0,
      dateDebut: new Date(),
      dateFin: new Date(),
      lieu: "",
      formateur: "",
      placesMax: 20,
      objectifs: ""
    });
  };

  const handleInscription = (formationId: string, personnelId: string) => {
    const personnel = mockPersonnel.find(p => p.id === personnelId);
    const formation = formations.find(f => f.id === formationId);
    
    if (!personnel || !formation) return;
    
    if (formation.placesDisponibles <= 0) {
      toast({ title: "Erreur", description: "Plus de places disponibles", variant: "destructive" });
      return;
    }

    const newInsc: Inscription = {
      id: `INS${String(inscriptions.length + 1).padStart(3, '0')}`,
      formationId,
      personnelId,
      personnelNom: personnel.nom,
      personnelPrenom: personnel.prenom,
      personnelPoste: personnel.poste,
      dateInscription: new Date(),
      statut: 'en_attente',
      heuresRealisees: 0
    };

    setInscriptions([...inscriptions, newInsc]);
    setFormations(formations.map(f => 
      f.id === formationId ? { ...f, placesDisponibles: f.placesDisponibles - 1 } : f
    ));
    toast({ title: "Inscription enregistrée", description: `${personnel.prenom} ${personnel.nom} inscrit(e) à "${formation.titre}"` });
  };

  const handleValiderInscription = (inscriptionId: string) => {
    setInscriptions(inscriptions.map(i => 
      i.id === inscriptionId ? { ...i, statut: 'validee' } : i
    ));
    toast({ title: "Inscription validée" });
  };

  const openFormationDetail = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowDetailDialog(true);
  };

  const formationInscrits = selectedFormation 
    ? inscriptions.filter(i => i.formationId === selectedFormation.id)
    : [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Formations</h1>
          <p className="text-muted-foreground">Catalogue, inscriptions et suivi des formations</p>
        </div>
        <Dialog open={showNewFormationDialog} onOpenChange={setShowNewFormationDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle formation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une formation</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="col-span-2 space-y-2">
                <Label>Titre de la formation</Label>
                <Input 
                  value={newFormation.titre}
                  onChange={(e) => setNewFormation({...newFormation, titre: e.target.value})}
                  placeholder="Ex: Pédagogie Active et Innovante"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={newFormation.description}
                  onChange={(e) => setNewFormation({...newFormation, description: e.target.value})}
                  placeholder="Description détaillée de la formation..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={newFormation.categorie} onValueChange={(v) => setNewFormation({...newFormation, categorie: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newFormation.type} onValueChange={(v: any) => setNewFormation({...newFormation, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interne">Interne</SelectItem>
                    <SelectItem value="externe">Externe</SelectItem>
                    <SelectItem value="en_ligne">En ligne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Durée (heures)</Label>
                <Input 
                  type="number"
                  value={newFormation.duree}
                  onChange={(e) => setNewFormation({...newFormation, duree: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Coût (FCFA)</Label>
                <Input 
                  type="number"
                  value={newFormation.cout}
                  onChange={(e) => setNewFormation({...newFormation, cout: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input 
                  type="date"
                  value={format(newFormation.dateDebut, 'yyyy-MM-dd')}
                  onChange={(e) => setNewFormation({...newFormation, dateDebut: new Date(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input 
                  type="date"
                  value={format(newFormation.dateFin, 'yyyy-MM-dd')}
                  onChange={(e) => setNewFormation({...newFormation, dateFin: new Date(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Lieu</Label>
                <Input 
                  value={newFormation.lieu}
                  onChange={(e) => setNewFormation({...newFormation, lieu: e.target.value})}
                  placeholder="Ex: Salle de formation"
                />
              </div>
              <div className="space-y-2">
                <Label>Formateur</Label>
                <Input 
                  value={newFormation.formateur}
                  onChange={(e) => setNewFormation({...newFormation, formateur: e.target.value})}
                  placeholder="Nom du formateur"
                />
              </div>
              <div className="space-y-2">
                <Label>Places maximum</Label>
                <Input 
                  type="number"
                  value={newFormation.placesMax}
                  onChange={(e) => setNewFormation({...newFormation, placesMax: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Objectifs (un par ligne)</Label>
                <Textarea 
                  value={newFormation.objectifs}
                  onChange={(e) => setNewFormation({...newFormation, objectifs: e.target.value})}
                  placeholder="Objectif 1&#10;Objectif 2&#10;Objectif 3"
                  rows={3}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewFormationDialog(false)}>Annuler</Button>
                <Button onClick={handleCreateFormation}>Créer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalFormations}</p>
                <p className="text-xs text-muted-foreground">Formations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Play className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.formationsEnCours}</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalInscrits}</p>
                <p className="text-xs text-muted-foreground">Inscrits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalHeures}h</p>
                <p className="text-xs text-muted-foreground">Heures totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wallet className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(stats.budgetUtilise / stats.budgetTotal * 100)}%</p>
                <p className="text-xs text-muted-foreground">Budget utilisé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalogue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          <TabsTrigger value="inscriptions">Inscriptions</TabsTrigger>
          <TabsTrigger value="suivi">Suivi des heures</TabsTrigger>
          <TabsTrigger value="budget">Budget par employé</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        {/* Catalogue */}
        <TabsContent value="catalogue" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher une formation..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="interne">Interne</SelectItem>
                    <SelectItem value="externe">Externe</SelectItem>
                    <SelectItem value="en_ligne">En ligne</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="planifiee">Planifiée</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFormations.map(formation => (
              <Card key={formation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{formation.titre}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {getTypeBadge(formation.type)}
                        {getStatutBadge(formation.statut)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{formation.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(formation.dateDebut, 'dd/MM/yyyy', { locale: fr })} - {format(formation.dateFin, 'dd/MM/yyyy', { locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formation.duree} heures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{formation.placesMax - formation.placesDisponibles}/{formation.placesMax} inscrits</span>
                    </div>
                    {formation.cout > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{formation.cout.toLocaleString()} FCFA</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openFormationDetail(formation)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    {formation.statut === 'planifiee' && formation.placesDisponibles > 0 && (
                      <Button size="sm" className="flex-1" onClick={() => {
                        setSelectedFormation(formation);
                        setShowInscriptionDialog(true);
                      }}>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Inscrire
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inscriptions */}
        <TabsContent value="inscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des inscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Employé</th>
                      <th className="text-left p-3 font-medium">Formation</th>
                      <th className="text-left p-3 font-medium">Date inscription</th>
                      <th className="text-left p-3 font-medium">Heures</th>
                      <th className="text-left p-3 font-medium">Statut</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscriptions.map(inscription => {
                      const formation = formations.find(f => f.id === inscription.formationId);
                      return (
                        <tr key={inscription.id} className="border-t hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{inscription.personnelPrenom} {inscription.personnelNom}</p>
                              <p className="text-sm text-muted-foreground">{inscription.personnelPoste}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-medium">{formation?.titre}</p>
                            <p className="text-sm text-muted-foreground">{formation?.duree}h</p>
                          </td>
                          <td className="p-3">{format(inscription.dateInscription, 'dd/MM/yyyy', { locale: fr })}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span>{inscription.heuresRealisees}/{formation?.duree}h</span>
                              <Progress value={(inscription.heuresRealisees / (formation?.duree || 1)) * 100} className="w-16 h-2" />
                            </div>
                          </td>
                          <td className="p-3">{getInscriptionStatutBadge(inscription.statut)}</td>
                          <td className="p-3">
                            {inscription.statut === 'en_attente' && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => handleValiderInscription(inscription.id)}>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  setInscriptions(inscriptions.map(i => 
                                    i.id === inscription.id ? { ...i, statut: 'refusee' } : i
                                  ));
                                }}>
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                            {inscription.certificat && (
                              <Badge variant="outline" className="text-green-600">
                                <Award className="h-3 w-3 mr-1" />
                                Certificat
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suivi des heures */}
        <TabsContent value="suivi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Heures de formation par employé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.map(budget => (
                    <div key={budget.personnelId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{budget.personnelPrenom} {budget.personnelNom}</p>
                          <p className="text-sm text-muted-foreground">{budget.personnelPoste} - {budget.departement}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{budget.heuresRealisees}h</p>
                          <p className="text-sm text-muted-foreground">/ {budget.heuresPlanifiees}h planifiées</p>
                        </div>
                      </div>
                      <Progress 
                        value={budget.heuresPlanifiees > 0 ? (budget.heuresRealisees / budget.heuresPlanifiees) * 100 : 0} 
                        className="h-2"
                      />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{budget.formationsTerminees} formation(s) terminée(s)</span>
                        <span>{budget.formationsEnCours} en cours</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Synthèse des heures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <p className="text-4xl font-bold text-primary">{budgets.reduce((acc, b) => acc + b.heuresRealisees, 0)}h</p>
                    <p className="text-muted-foreground">Heures de formation réalisées</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-2xl font-bold">{budgets.reduce((acc, b) => acc + b.heuresPlanifiees, 0)}h</p>
                      <p className="text-sm text-muted-foreground">Heures planifiées</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-2xl font-bold">{stats.tauxRealisation}%</p>
                      <p className="text-sm text-muted-foreground">Taux de réalisation</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Répartition par catégorie</p>
                    {categories.slice(0, 5).map(cat => {
                      const heures = formations.filter(f => f.categorie === cat).reduce((acc, f) => acc + f.duree, 0);
                      const total = formations.reduce((acc, f) => acc + f.duree, 0);
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cat}</span>
                            <span>{heures}h</span>
                          </div>
                          <Progress value={total > 0 ? (heures / total) * 100 : 0} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget */}
        <TabsContent value="budget" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget total annuel</p>
                    <p className="text-3xl font-bold">{stats.budgetTotal.toLocaleString()} FCFA</p>
                  </div>
                  <Wallet className="h-10 w-10 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget utilisé</p>
                    <p className="text-3xl font-bold text-green-600">{stats.budgetUtilise.toLocaleString()} FCFA</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget restant</p>
                    <p className="text-3xl font-bold text-blue-600">{(stats.budgetTotal - stats.budgetUtilise).toLocaleString()} FCFA</p>
                  </div>
                  <Target className="h-10 w-10 text-blue-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget formation par employé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Employé</th>
                      <th className="text-left p-3 font-medium">Département</th>
                      <th className="text-left p-3 font-medium">Budget annuel</th>
                      <th className="text-left p-3 font-medium">Utilisé</th>
                      <th className="text-left p-3 font-medium">Restant</th>
                      <th className="text-left p-3 font-medium">Taux</th>
                      <th className="text-left p-3 font-medium">Formations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.map(budget => {
                      const restant = budget.budgetAnnuel - budget.budgetUtilise;
                      const taux = Math.round((budget.budgetUtilise / budget.budgetAnnuel) * 100);
                      return (
                        <tr key={budget.personnelId} className="border-t hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{budget.personnelPrenom} {budget.personnelNom}</p>
                              <p className="text-sm text-muted-foreground">{budget.personnelPoste}</p>
                            </div>
                          </td>
                          <td className="p-3">{budget.departement}</td>
                          <td className="p-3 font-medium">{budget.budgetAnnuel.toLocaleString()} FCFA</td>
                          <td className="p-3 text-orange-600">{budget.budgetUtilise.toLocaleString()} FCFA</td>
                          <td className="p-3 text-green-600">{restant.toLocaleString()} FCFA</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Progress value={taux} className="w-16 h-2" />
                              <span className="text-sm">{taux}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Badge variant="outline">{budget.formationsTerminees} terminées</Badge>
                              <Badge variant="secondary">{budget.formationsEnCours} en cours</Badge>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistiques */}
        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de participation</p>
                    <p className="text-3xl font-bold">{Math.round((budgets.filter(b => b.formationsEnCours > 0 || b.formationsTerminees > 0).length / budgets.length) * 100)}%</p>
                  </div>
                  <Users className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Formations terminées</p>
                    <p className="text-3xl font-bold">{stats.formationsTerminees}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificats délivrés</p>
                    <p className="text-3xl font-bold">{inscriptions.filter(i => i.certificat).length}</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Note moyenne</p>
                    <p className="text-3xl font-bold">
                      {Math.round(inscriptions.filter(i => i.noteEvaluation).reduce((acc, i) => acc + (i.noteEvaluation || 0), 0) / 
                       Math.max(inscriptions.filter(i => i.noteEvaluation).length, 1))}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(cat => {
                    const count = formations.filter(f => f.categorie === cat).length;
                    const percentage = Math.round((count / formations.length) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between mb-1">
                          <span>{cat}</span>
                          <span className="text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: 'interne', label: 'Interne', color: 'bg-purple-500' },
                    { key: 'externe', label: 'Externe', color: 'bg-blue-500' },
                    { key: 'en_ligne', label: 'En ligne', color: 'bg-green-500' }
                  ].map(({ key, label, color }) => {
                    const count = formations.filter(f => f.type === key).length;
                    const percentage = Math.round((count / formations.length) * 100);
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span>{label}</span>
                          <span className="text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog détail formation */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          {selectedFormation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedFormation.titre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {getTypeBadge(selectedFormation.type)}
                  {getStatutBadge(selectedFormation.statut)}
                  <Badge variant="outline">{selectedFormation.categorie}</Badge>
                </div>
                
                <p className="text-muted-foreground">{selectedFormation.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(selectedFormation.dateDebut, 'dd/MM/yyyy')} - {format(selectedFormation.dateFin, 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFormation.duree} heures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFormation.lieu}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFormation.formateur}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFormation.placesMax - selectedFormation.placesDisponibles}/{selectedFormation.placesMax} inscrits</span>
                    </div>
                    {selectedFormation.cout > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedFormation.cout.toLocaleString()} FCFA</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedFormation.objectifs.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Objectifs</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedFormation.objectifs.map((obj, i) => (
                        <li key={i} className="text-sm">{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formationInscrits.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Participants ({formationInscrits.length})</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formationInscrits.map(insc => (
                        <div key={insc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span>{insc.personnelPrenom} {insc.personnelNom}</span>
                          {getInscriptionStatutBadge(insc.statut)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog inscription */}
      <Dialog open={showInscriptionDialog} onOpenChange={setShowInscriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscrire à la formation</DialogTitle>
          </DialogHeader>
          {selectedFormation && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedFormation.titre}</p>
              <div className="space-y-2">
                <Label>Sélectionner un employé</Label>
                <Select onValueChange={(v) => {
                  handleInscription(selectedFormation.id, v);
                  setShowInscriptionDialog(false);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPersonnel.slice(0, 10).map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.prenom} {p.nom} - {p.poste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
