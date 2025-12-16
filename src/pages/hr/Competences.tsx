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
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Star,
  Plus,
  Search,
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle,
  User,
  BarChart3,
  Lightbulb,
  Calendar,
  ArrowUpRight,
  Zap,
  Brain,
  Briefcase,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  FileText
} from "lucide-react";
import { format, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { mockPersonnel } from "@/data/mockPersonnel";

interface Competence {
  id: string;
  nom: string;
  categorie: string;
  description: string;
  niveauMax: number;
}

interface CompetenceEmploye {
  competenceId: string;
  niveauActuel: number;
  niveauCible: number;
  dateEvaluation: Date;
  commentaire?: string;
}

interface EmployeCompetences {
  personnelId: string;
  personnelNom: string;
  personnelPrenom: string;
  personnelPoste: string;
  departement: string;
  competences: CompetenceEmploye[];
}

interface ObjectifDeveloppement {
  id: string;
  personnelId: string;
  competenceId: string;
  titre: string;
  description: string;
  niveauDepart: number;
  niveauCible: number;
  dateDebut: Date;
  dateEcheance: Date;
  actions: ActionDeveloppement[];
  statut: 'planifie' | 'en_cours' | 'termine' | 'abandonne';
  progression: number;
}

interface ActionDeveloppement {
  id: string;
  titre: string;
  type: 'formation' | 'coaching' | 'projet' | 'autoformation' | 'mentorat';
  dateEcheance: Date;
  statut: 'a_faire' | 'en_cours' | 'termine';
  commentaire?: string;
}

const categoriesCompetences = [
  "Compétences Techniques",
  "Compétences Pédagogiques", 
  "Compétences Managériales",
  "Compétences Relationnelles",
  "Compétences Numériques",
  "Langues"
];

const mockCompetences: Competence[] = [
  { id: "C001", nom: "Maîtrise disciplinaire", categorie: "Compétences Techniques", description: "Expertise dans sa matière d'enseignement", niveauMax: 5 },
  { id: "C002", nom: "Pédagogie différenciée", categorie: "Compétences Pédagogiques", description: "Adapter son enseignement aux différents profils d'élèves", niveauMax: 5 },
  { id: "C003", nom: "Gestion de classe", categorie: "Compétences Pédagogiques", description: "Maintenir un environnement propice à l'apprentissage", niveauMax: 5 },
  { id: "C004", nom: "Évaluation des acquis", categorie: "Compétences Pédagogiques", description: "Concevoir et mettre en œuvre des évaluations pertinentes", niveauMax: 5 },
  { id: "C005", nom: "Leadership", categorie: "Compétences Managériales", description: "Capacité à diriger et motiver une équipe", niveauMax: 5 },
  { id: "C006", nom: "Communication orale", categorie: "Compétences Relationnelles", description: "S'exprimer clairement devant un public", niveauMax: 5 },
  { id: "C007", nom: "Communication écrite", categorie: "Compétences Relationnelles", description: "Rédiger des documents clairs et structurés", niveauMax: 5 },
  { id: "C008", nom: "Travail en équipe", categorie: "Compétences Relationnelles", description: "Collaborer efficacement avec ses collègues", niveauMax: 5 },
  { id: "C009", nom: "Outils bureautiques", categorie: "Compétences Numériques", description: "Maîtrise de Word, Excel, PowerPoint", niveauMax: 5 },
  { id: "C010", nom: "Outils numériques éducatifs", categorie: "Compétences Numériques", description: "Utilisation des plateformes e-learning et outils pédagogiques", niveauMax: 5 },
  { id: "C011", nom: "Français", categorie: "Langues", description: "Maîtrise du français oral et écrit", niveauMax: 5 },
  { id: "C012", nom: "Anglais", categorie: "Langues", description: "Niveau d'anglais professionnel", niveauMax: 5 },
  { id: "C013", nom: "Gestion du temps", categorie: "Compétences Managériales", description: "Organisation et priorisation des tâches", niveauMax: 5 },
  { id: "C014", nom: "Résolution de problèmes", categorie: "Compétences Techniques", description: "Analyser et résoudre des situations complexes", niveauMax: 5 },
  { id: "C015", nom: "Innovation pédagogique", categorie: "Compétences Pédagogiques", description: "Proposer et mettre en œuvre de nouvelles approches", niveauMax: 5 },
];

const mockEmployeCompetences: EmployeCompetences[] = [
  {
    personnelId: "P001",
    personnelNom: "Kouassi",
    personnelPrenom: "Amenan",
    personnelPoste: "Enseignant",
    departement: "Sciences",
    competences: [
      { competenceId: "C001", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 15) },
      { competenceId: "C002", niveauActuel: 3, niveauCible: 4, dateEvaluation: new Date(2024, 0, 15) },
      { competenceId: "C003", niveauActuel: 4, niveauCible: 4, dateEvaluation: new Date(2024, 0, 15) },
      { competenceId: "C006", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 15) },
      { competenceId: "C009", niveauActuel: 3, niveauCible: 4, dateEvaluation: new Date(2024, 0, 15) },
      { competenceId: "C010", niveauActuel: 2, niveauCible: 4, dateEvaluation: new Date(2024, 0, 15) },
      { competenceId: "C011", niveauActuel: 5, niveauCible: 5, dateEvaluation: new Date(2024, 0, 15) },
      { competenceId: "C012", niveauActuel: 2, niveauCible: 3, dateEvaluation: new Date(2024, 0, 15) },
    ]
  },
  {
    personnelId: "P002",
    personnelNom: "Konan",
    personnelPrenom: "Yves",
    personnelPoste: "Comptable",
    departement: "Administration",
    competences: [
      { competenceId: "C007", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 10) },
      { competenceId: "C009", niveauActuel: 5, niveauCible: 5, dateEvaluation: new Date(2024, 0, 10) },
      { competenceId: "C013", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 10) },
      { competenceId: "C014", niveauActuel: 3, niveauCible: 4, dateEvaluation: new Date(2024, 0, 10) },
      { competenceId: "C011", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 10) },
    ]
  },
  {
    personnelId: "P003",
    personnelNom: "Diallo",
    personnelPrenom: "Fatou",
    personnelPoste: "Secrétaire",
    departement: "Administration",
    competences: [
      { competenceId: "C006", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 12) },
      { competenceId: "C007", niveauActuel: 5, niveauCible: 5, dateEvaluation: new Date(2024, 0, 12) },
      { competenceId: "C008", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 12) },
      { competenceId: "C009", niveauActuel: 4, niveauCible: 5, dateEvaluation: new Date(2024, 0, 12) },
      { competenceId: "C013", niveauActuel: 3, niveauCible: 4, dateEvaluation: new Date(2024, 0, 12) },
    ]
  }
];

const mockPlansDeveloppement: ObjectifDeveloppement[] = [
  {
    id: "PD001",
    personnelId: "P001",
    competenceId: "C010",
    titre: "Maîtrise des outils numériques éducatifs",
    description: "Développer la capacité à utiliser efficacement les plateformes e-learning et outils pédagogiques numériques",
    niveauDepart: 2,
    niveauCible: 4,
    dateDebut: new Date(2024, 0, 1),
    dateEcheance: new Date(2024, 5, 30),
    statut: 'en_cours',
    progression: 50,
    actions: [
      { id: "A001", titre: "Formation Moodle", type: 'formation', dateEcheance: new Date(2024, 1, 28), statut: 'termine' },
      { id: "A002", titre: "Autoformation Google Classroom", type: 'autoformation', dateEcheance: new Date(2024, 2, 31), statut: 'termine' },
      { id: "A003", titre: "Projet pilote classe virtuelle", type: 'projet', dateEcheance: new Date(2024, 4, 15), statut: 'en_cours' },
      { id: "A004", titre: "Mentorat par M. Touré", type: 'mentorat', dateEcheance: new Date(2024, 5, 30), statut: 'a_faire' },
    ]
  },
  {
    id: "PD002",
    personnelId: "P001",
    competenceId: "C012",
    titre: "Amélioration de l'anglais professionnel",
    description: "Atteindre un niveau B1 en anglais pour communiquer avec les partenaires internationaux",
    niveauDepart: 2,
    niveauCible: 3,
    dateDebut: new Date(2024, 0, 15),
    dateEcheance: new Date(2024, 11, 31),
    statut: 'en_cours',
    progression: 25,
    actions: [
      { id: "A005", titre: "Cours d'anglais hebdomadaire", type: 'formation', dateEcheance: new Date(2024, 11, 31), statut: 'en_cours' },
      { id: "A006", titre: "Practice avec collègue anglophone", type: 'coaching', dateEcheance: new Date(2024, 6, 30), statut: 'a_faire' },
    ]
  },
  {
    id: "PD003",
    personnelId: "P002",
    competenceId: "C014",
    titre: "Développement des capacités d'analyse",
    description: "Renforcer les compétences en résolution de problèmes complexes",
    niveauDepart: 3,
    niveauCible: 4,
    dateDebut: new Date(2024, 1, 1),
    dateEcheance: new Date(2024, 7, 31),
    statut: 'planifie',
    progression: 0,
    actions: [
      { id: "A007", titre: "Formation Excel avancé", type: 'formation', dateEcheance: new Date(2024, 3, 30), statut: 'a_faire' },
      { id: "A008", titre: "Projet d'optimisation processus", type: 'projet', dateEcheance: new Date(2024, 6, 31), statut: 'a_faire' },
    ]
  }
];

const niveauxLabels = ["Non évalué", "Débutant", "Intermédiaire", "Confirmé", "Expert", "Maître"];
const niveauxColors = ["bg-gray-200", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-500"];

export default function Competences() {
  const [competences] = useState<Competence[]>(mockCompetences);
  const [employeCompetences, setEmployeCompetences] = useState<EmployeCompetences[]>(mockEmployeCompetences);
  const [plansDeveloppement, setPlansDeveloppement] = useState<ObjectifDeveloppement[]>(mockPlansDeveloppement);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartement, setFilterDepartement] = useState<string>("all");
  const [filterCategorie, setFilterCategorie] = useState<string>("all");
  const [selectedEmploye, setSelectedEmploye] = useState<EmployeCompetences | null>(null);
  const [showMatriceDialog, setShowMatriceDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ObjectifDeveloppement | null>(null);

  const [newPlan, setNewPlan] = useState({
    personnelId: "",
    competenceId: "",
    titre: "",
    description: "",
    niveauCible: 4,
    dateEcheance: addMonths(new Date(), 6)
  });

  // Stats
  const stats = {
    totalEmployes: employeCompetences.length,
    totalCompetences: competences.length,
    plansEnCours: plansDeveloppement.filter(p => p.statut === 'en_cours').length,
    plansTermines: plansDeveloppement.filter(p => p.statut === 'termine').length,
    tauxMoyenMaitrise: Math.round(
      employeCompetences.reduce((acc, e) => {
        const moyenne = e.competences.reduce((sum, c) => sum + c.niveauActuel, 0) / e.competences.length;
        return acc + moyenne;
      }, 0) / employeCompetences.length / 5 * 100
    ),
    competencesACibleAtteinte: employeCompetences.reduce((acc, e) => 
      acc + e.competences.filter(c => c.niveauActuel >= c.niveauCible).length, 0
    )
  };

  // Filtrage
  const filteredEmployes = employeCompetences.filter(e => {
    const matchSearch = e.personnelNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       e.personnelPrenom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDepartement === "all" || e.departement === filterDepartement;
    return matchSearch && matchDept;
  });

  const departements = [...new Set(employeCompetences.map(e => e.departement))];

  const getNiveauBadge = (niveau: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${niveauxColors[niveau]}`} />
        <span className="text-sm">{niveauxLabels[niveau]}</span>
      </div>
    );
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      planifie: { variant: "outline", label: "Planifié" },
      en_cours: { variant: "default", label: "En cours" },
      termine: { variant: "secondary", label: "Terminé" },
      abandonne: { variant: "destructive", label: "Abandonné" }
    };
    const config = variants[statut] || variants.planifie;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActionTypeBadge = (type: string) => {
    const types: Record<string, { icon: any, label: string, className: string }> = {
      formation: { icon: BookOpen, label: "Formation", className: "bg-blue-100 text-blue-800" },
      coaching: { icon: MessageSquare, label: "Coaching", className: "bg-purple-100 text-purple-800" },
      projet: { icon: Briefcase, label: "Projet", className: "bg-green-100 text-green-800" },
      autoformation: { icon: Brain, label: "Autoformation", className: "bg-orange-100 text-orange-800" },
      mentorat: { icon: Users, label: "Mentorat", className: "bg-pink-100 text-pink-800" }
    };
    const config = types[type] || types.formation;
    const Icon = config.icon;
    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleCreatePlan = () => {
    const employe = employeCompetences.find(e => e.personnelId === newPlan.personnelId);
    const competence = competences.find(c => c.id === newPlan.competenceId);
    const employeComp = employe?.competences.find(c => c.competenceId === newPlan.competenceId);
    
    if (!employe || !competence) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un employé et une compétence", variant: "destructive" });
      return;
    }

    const newPlanDev: ObjectifDeveloppement = {
      id: `PD${String(plansDeveloppement.length + 1).padStart(3, '0')}`,
      personnelId: newPlan.personnelId,
      competenceId: newPlan.competenceId,
      titre: newPlan.titre,
      description: newPlan.description,
      niveauDepart: employeComp?.niveauActuel || 1,
      niveauCible: newPlan.niveauCible,
      dateDebut: new Date(),
      dateEcheance: newPlan.dateEcheance,
      statut: 'planifie',
      progression: 0,
      actions: []
    };

    setPlansDeveloppement([...plansDeveloppement, newPlanDev]);
    setShowNewPlanDialog(false);
    toast({ title: "Plan créé", description: `Plan de développement créé pour ${employe.personnelPrenom} ${employe.personnelNom}` });
    
    setNewPlan({
      personnelId: "",
      competenceId: "",
      titre: "",
      description: "",
      niveauCible: 4,
      dateEcheance: addMonths(new Date(), 6)
    });
  };

  const handleUpdateActionStatut = (planId: string, actionId: string, newStatut: 'a_faire' | 'en_cours' | 'termine') => {
    setPlansDeveloppement(plansDeveloppement.map(p => {
      if (p.id === planId) {
        const updatedActions = p.actions.map(a => 
          a.id === actionId ? { ...a, statut: newStatut } : a
        );
        const actionsTerminees = updatedActions.filter(a => a.statut === 'termine').length;
        const progression = Math.round((actionsTerminees / updatedActions.length) * 100);
        return { ...p, actions: updatedActions, progression };
      }
      return p;
    }));
    toast({ title: "Action mise à jour" });
  };

  const openEmployeMatrice = (employe: EmployeCompetences) => {
    setSelectedEmploye(employe);
    setShowMatriceDialog(true);
  };

  const openPlanDetail = (plan: ObjectifDeveloppement) => {
    setSelectedPlan(plan);
    setShowPlanDialog(true);
  };

  const employePlans = selectedEmploye 
    ? plansDeveloppement.filter(p => p.personnelId === selectedEmploye.personnelId)
    : [];

  // Matrice globale des compétences
  const competencesByCategory = categoriesCompetences.map(cat => ({
    categorie: cat,
    competences: competences.filter(c => c.categorie === cat)
  })).filter(c => c.competences.length > 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Compétences</h1>
          <p className="text-muted-foreground">Matrice des compétences et plans de développement</p>
        </div>
        <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau plan de développement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer un plan de développement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Employé</Label>
                <Select value={newPlan.personnelId} onValueChange={(v) => setNewPlan({...newPlan, personnelId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeCompetences.map(e => (
                      <SelectItem key={e.personnelId} value={e.personnelId}>
                        {e.personnelPrenom} {e.personnelNom} - {e.personnelPoste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Compétence à développer</Label>
                <Select value={newPlan.competenceId} onValueChange={(v) => setNewPlan({...newPlan, competenceId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une compétence" />
                  </SelectTrigger>
                  <SelectContent>
                    {competences.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nom} ({c.categorie})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Titre du plan</Label>
                <Input 
                  value={newPlan.titre}
                  onChange={(e) => setNewPlan({...newPlan, titre: e.target.value})}
                  placeholder="Ex: Développement des compétences numériques"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  placeholder="Objectifs et contexte du plan..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Niveau cible: {niveauxLabels[newPlan.niveauCible]}</Label>
                <Slider
                  value={[newPlan.niveauCible]}
                  onValueChange={(v) => setNewPlan({...newPlan, niveauCible: v[0]})}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date d'échéance</Label>
                <Input 
                  type="date"
                  value={format(newPlan.dateEcheance, 'yyyy-MM-dd')}
                  onChange={(e) => setNewPlan({...newPlan, dateEcheance: new Date(e.target.value)})}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewPlanDialog(false)}>Annuler</Button>
                <Button onClick={handleCreatePlan}>Créer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalEmployes}</p>
                <p className="text-xs text-muted-foreground">Employés évalués</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCompetences}</p>
                <p className="text-xs text-muted-foreground">Compétences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.plansEnCours}</p>
                <p className="text-xs text-muted-foreground">Plans en cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.plansTermines}</p>
                <p className="text-xs text-muted-foreground">Plans terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.tauxMoyenMaitrise}%</p>
                <p className="text-xs text-muted-foreground">Maîtrise moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.competencesACibleAtteinte}</p>
                <p className="text-xs text-muted-foreground">Cibles atteintes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employes">Par employé</TabsTrigger>
          <TabsTrigger value="matrice">Matrice globale</TabsTrigger>
          <TabsTrigger value="plans">Plans de développement</TabsTrigger>
          <TabsTrigger value="referentiel">Référentiel</TabsTrigger>
        </TabsList>

        {/* Par employé */}
        <TabsContent value="employes" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un employé..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {departements.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployes.map(employe => {
              const moyenneNiveau = employe.competences.reduce((acc, c) => acc + c.niveauActuel, 0) / employe.competences.length;
              const ciblesAtteintes = employe.competences.filter(c => c.niveauActuel >= c.niveauCible).length;
              const plansEmploye = plansDeveloppement.filter(p => p.personnelId === employe.personnelId);
              
              return (
                <Card key={employe.personnelId} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{employe.personnelPrenom} {employe.personnelNom}</CardTitle>
                        <p className="text-sm text-muted-foreground">{employe.personnelPoste}</p>
                        <Badge variant="outline" className="mt-1">{employe.departement}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Niveau moyen</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(moyenneNiveau / 5) * 100} className="w-20 h-2" />
                          <span className="font-medium">{moyenneNiveau.toFixed(1)}/5</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Compétences évaluées</span>
                        <span className="font-medium">{employe.competences.length}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cibles atteintes</span>
                        <Badge variant={ciblesAtteintes === employe.competences.length ? "default" : "secondary"}>
                          {ciblesAtteintes}/{employe.competences.length}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Plans en cours</span>
                        <Badge variant="outline">{plansEmploye.filter(p => p.statut === 'en_cours').length}</Badge>
                      </div>

                      <Button className="w-full" onClick={() => openEmployeMatrice(employe)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir la matrice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Matrice globale */}
        <TabsContent value="matrice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matrice globale des compétences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium sticky left-0 bg-background">Compétence</th>
                      {employeCompetences.map(e => (
                        <th key={e.personnelId} className="text-center p-2 font-medium min-w-[100px]">
                          <div className="truncate">{e.personnelPrenom}</div>
                          <div className="text-xs text-muted-foreground truncate">{e.personnelNom}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {competencesByCategory.map(cat => (
                      <>
                        <tr key={cat.categorie} className="bg-muted/50">
                          <td colSpan={employeCompetences.length + 1} className="p-2 font-medium">
                            {cat.categorie}
                          </td>
                        </tr>
                        {cat.competences.map(comp => (
                          <tr key={comp.id} className="border-b hover:bg-muted/30">
                            <td className="p-2 sticky left-0 bg-background">{comp.nom}</td>
                            {employeCompetences.map(e => {
                              const empComp = e.competences.find(c => c.competenceId === comp.id);
                              return (
                                <td key={e.personnelId} className="text-center p-2">
                                  {empComp ? (
                                    <div className="flex justify-center">
                                      <div 
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${niveauxColors[empComp.niveauActuel]}`}
                                        title={niveauxLabels[empComp.niveauActuel]}
                                      >
                                        {empComp.niveauActuel}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Légende:</span>
                {niveauxLabels.slice(1).map((label, i) => (
                  <div key={label} className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded-full ${niveauxColors[i + 1]}`} />
                    <span className="text-sm">{i + 1} - {label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans de développement */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plansDeveloppement.map(plan => {
              const employe = employeCompetences.find(e => e.personnelId === plan.personnelId);
              const competence = competences.find(c => c.id === plan.competenceId);
              
              return (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.titre}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {employe?.personnelPrenom} {employe?.personnelNom} • {competence?.nom}
                        </p>
                      </div>
                      {getStatutBadge(plan.statut)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progression</span>
                        <div className="flex items-center gap-2">
                          <Progress value={plan.progression} className="w-24 h-2" />
                          <span className="font-medium">{plan.progression}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Niveau</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{plan.niveauDepart}</span>
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{plan.niveauCible}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Échéance</span>
                        <span className="text-sm">{format(plan.dateEcheance, 'dd/MM/yyyy', { locale: fr })}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Actions</span>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-green-600">
                            {plan.actions.filter(a => a.statut === 'termine').length} terminées
                          </Badge>
                          <Badge variant="outline">
                            {plan.actions.filter(a => a.statut !== 'termine').length} restantes
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4" variant="outline" onClick={() => openPlanDetail(plan)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir le détail
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Référentiel */}
        <TabsContent value="referentiel" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categoriesCompetences.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencesByCategory
              .filter(cat => filterCategorie === "all" || cat.categorie === filterCategorie)
              .map(cat => (
                <Card key={cat.categorie}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      {cat.categorie}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cat.competences.map(comp => (
                        <div key={comp.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{comp.nom}</p>
                              <p className="text-sm text-muted-foreground">{comp.description}</p>
                            </div>
                            <Badge variant="outline">Max: {comp.niveauMax}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog matrice employé */}
      <Dialog open={showMatriceDialog} onOpenChange={setShowMatriceDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedEmploye && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Matrice de compétences - {selectedEmploye.personnelPrenom} {selectedEmploye.personnelNom}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{selectedEmploye.personnelPrenom} {selectedEmploye.personnelNom}</p>
                    <p className="text-muted-foreground">{selectedEmploye.personnelPoste} • {selectedEmploye.departement}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {categoriesCompetences.map(cat => {
                    const catCompetences = selectedEmploye.competences.filter(ec => {
                      const comp = competences.find(c => c.id === ec.competenceId);
                      return comp?.categorie === cat;
                    });
                    
                    if (catCompetences.length === 0) return null;
                    
                    return (
                      <div key={cat}>
                        <h4 className="font-medium mb-2">{cat}</h4>
                        <div className="space-y-2">
                          {catCompetences.map(ec => {
                            const comp = competences.find(c => c.id === ec.competenceId);
                            const atteint = ec.niveauActuel >= ec.niveauCible;
                            return (
                              <div key={ec.competenceId} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{comp?.nom}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map(n => (
                                        <div
                                          key={n}
                                          className={`w-6 h-6 rounded ${
                                            n <= ec.niveauActuel ? niveauxColors[ec.niveauActuel] : 'bg-muted'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {niveauxLabels[ec.niveauActuel]}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm">Cible:</span>
                                    <Badge variant={atteint ? "default" : "outline"}>
                                      {ec.niveauCible}
                                    </Badge>
                                  </div>
                                  {atteint ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 ml-auto" />
                                  ) : (
                                    <ArrowUpRight className="h-5 w-5 text-orange-500 mt-1 ml-auto" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {employePlans.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Plans de développement</h4>
                    <div className="space-y-2">
                      {employePlans.map(plan => (
                        <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{plan.titre}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={plan.progression} className="w-24 h-2" />
                              <span className="text-sm text-muted-foreground">{plan.progression}%</span>
                            </div>
                          </div>
                          {getStatutBadge(plan.statut)}
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

      {/* Dialog détail plan */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPlan.titre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {getStatutBadge(selectedPlan.statut)}
                  <Badge variant="outline">
                    {format(selectedPlan.dateDebut, 'dd/MM/yyyy')} - {format(selectedPlan.dateEcheance, 'dd/MM/yyyy')}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">{selectedPlan.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Niveau de départ</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${niveauxColors[selectedPlan.niveauDepart]}`}>
                          {selectedPlan.niveauDepart}
                        </div>
                        <span>{niveauxLabels[selectedPlan.niveauDepart]}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Niveau cible</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${niveauxColors[selectedPlan.niveauCible]}`}>
                          {selectedPlan.niveauCible}
                        </div>
                        <span>{niveauxLabels[selectedPlan.niveauCible]}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Progression globale</h4>
                    <span className="font-bold">{selectedPlan.progression}%</span>
                  </div>
                  <Progress value={selectedPlan.progression} className="h-3" />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Actions de développement</h4>
                  <div className="space-y-3">
                    {selectedPlan.actions.map(action => (
                      <div key={action.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                          action.statut === 'termine' ? 'bg-green-500' :
                          action.statut === 'en_cours' ? 'bg-orange-500' : 'bg-gray-300'
                        }`}>
                          {action.statut === 'termine' && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{action.titre}</p>
                            {getActionTypeBadge(action.type)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Échéance: {format(action.dateEcheance, 'dd/MM/yyyy', { locale: fr })}
                          </p>
                        </div>
                        <Select 
                          value={action.statut}
                          onValueChange={(v: 'a_faire' | 'en_cours' | 'termine') => 
                            handleUpdateActionStatut(selectedPlan.id, action.id, v)
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a_faire">À faire</SelectItem>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="termine">Terminé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
