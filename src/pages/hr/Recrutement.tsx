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
import { toast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  Users, 
  UserPlus, 
  FileText,
  Plus,
  Search,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
  Star,
  ArrowRight,
  Building,
  GraduationCap,
  Filter,
  MoreHorizontal,
  Send,
  UserCheck,
  AlertCircle,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface OffreEmploi {
  id: string;
  titre: string;
  departement: string;
  type: 'CDI' | 'CDD' | 'Vacation' | 'Stage';
  description: string;
  responsabilites: string[];
  qualifications: string[];
  competences: string[];
  salaire?: { min: number; max: number };
  lieu: string;
  datePublication: Date;
  dateCloture: Date;
  statut: 'brouillon' | 'publiee' | 'cloturee' | 'pourvue';
  nombrePostes: number;
  candidatures: number;
}

interface Candidat {
  id: string;
  offreId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance?: Date;
  adresse?: string;
  diplome: string;
  experience: string;
  lettreMotivation?: string;
  cvUrl?: string;
  dateCandidature: Date;
  statut: 'nouveau' | 'preselection' | 'entretien_planifie' | 'entretien_realise' | 'retenu' | 'refuse' | 'desiste';
  etapeActuelle: number;
  notes?: string;
  evaluations: Evaluation[];
  entretiens: Entretien[];
}

interface Evaluation {
  id: string;
  evaluateurNom: string;
  date: Date;
  criteres: { nom: string; note: number }[];
  noteGlobale: number;
  commentaire: string;
  recommandation: 'favorable' | 'reserve' | 'defavorable';
}

interface Entretien {
  id: string;
  type: 'telephonique' | 'visio' | 'presentiel';
  date: Date;
  heure: string;
  duree: number;
  lieu?: string;
  evaluateurs: string[];
  statut: 'planifie' | 'realise' | 'annule';
  compte_rendu?: string;
}

const etapesRecrutement = [
  { id: 1, nom: "Candidature reçue", icon: FileText },
  { id: 2, nom: "Présélection", icon: Filter },
  { id: 3, nom: "Entretien RH", icon: Users },
  { id: 4, nom: "Entretien technique", icon: Briefcase },
  { id: 5, nom: "Décision finale", icon: CheckCircle }
];

const mockOffres: OffreEmploi[] = [
  {
    id: "OFF001",
    titre: "Enseignant(e) de Mathématiques",
    departement: "Sciences",
    type: 'CDI',
    description: "Nous recherchons un(e) enseignant(e) passionné(e) pour enseigner les mathématiques aux classes de collège et lycée.",
    responsabilites: [
      "Préparer et dispenser les cours de mathématiques",
      "Évaluer les élèves et assurer le suivi pédagogique",
      "Participer aux conseils de classe",
      "Collaborer avec l'équipe pédagogique"
    ],
    qualifications: [
      "Licence ou Master en Mathématiques",
      "CAPES ou équivalent souhaité",
      "Expérience d'enseignement de 2 ans minimum"
    ],
    competences: ["Pédagogie", "Mathématiques", "Communication", "Patience"],
    salaire: { min: 350000, max: 500000 },
    lieu: "Abidjan, Cocody",
    datePublication: new Date(2024, 0, 15),
    dateCloture: new Date(2024, 2, 15),
    statut: 'publiee',
    nombrePostes: 2,
    candidatures: 8
  },
  {
    id: "OFF002",
    titre: "Secrétaire Administrative",
    departement: "Administration",
    type: 'CDI',
    description: "Poste de secrétaire pour assurer la gestion administrative quotidienne de l'établissement.",
    responsabilites: [
      "Accueil et orientation des visiteurs",
      "Gestion du courrier et des appels",
      "Rédaction de documents administratifs",
      "Gestion des dossiers élèves"
    ],
    qualifications: [
      "BTS Secrétariat ou équivalent",
      "Maîtrise des outils bureautiques",
      "Expérience de 3 ans minimum"
    ],
    competences: ["Organisation", "Communication", "Bureautique", "Discrétion"],
    salaire: { min: 200000, max: 300000 },
    lieu: "Abidjan, Cocody",
    datePublication: new Date(2024, 0, 20),
    dateCloture: new Date(2024, 1, 28),
    statut: 'cloturee',
    nombrePostes: 1,
    candidatures: 15
  },
  {
    id: "OFF003",
    titre: "Surveillant(e) Général(e)",
    departement: "Vie scolaire",
    type: 'CDI',
    description: "Responsable de la surveillance et de l'encadrement des élèves au sein de l'établissement.",
    responsabilites: [
      "Assurer la discipline et la sécurité",
      "Gérer les absences et retards",
      "Encadrer les surveillants",
      "Liaison avec les parents"
    ],
    qualifications: [
      "Diplôme en éducation ou gestion",
      "Expérience en milieu scolaire",
      "Capacité de leadership"
    ],
    competences: ["Autorité", "Communication", "Gestion de conflits", "Organisation"],
    lieu: "Abidjan, Cocody",
    datePublication: new Date(2024, 1, 1),
    dateCloture: new Date(2024, 3, 1),
    statut: 'publiee',
    nombrePostes: 1,
    candidatures: 5
  }
];

const mockCandidats: Candidat[] = [
  {
    id: "CAND001",
    offreId: "OFF001",
    nom: "Koffi",
    prenom: "Jean-Marc",
    email: "jm.koffi@email.ci",
    telephone: "+225 07 12 34 56 78",
    diplome: "Master en Mathématiques",
    experience: "4 ans d'enseignement au Lycée Moderne de Bouaké",
    dateCandidature: new Date(2024, 0, 18),
    statut: 'entretien_realise',
    etapeActuelle: 4,
    notes: "Excellent profil, très motivé",
    evaluations: [
      {
        id: "E001",
        evaluateurNom: "Mme Bamba DRH",
        date: new Date(2024, 0, 25),
        criteres: [
          { nom: "Compétences techniques", note: 4 },
          { nom: "Communication", note: 5 },
          { nom: "Motivation", note: 5 }
        ],
        noteGlobale: 4.7,
        commentaire: "Candidat très prometteur avec une solide expérience",
        recommandation: 'favorable'
      }
    ],
    entretiens: [
      {
        id: "ENT001",
        type: 'presentiel',
        date: new Date(2024, 0, 25),
        heure: "10:00",
        duree: 45,
        lieu: "Bureau RH",
        evaluateurs: ["Mme Bamba DRH"],
        statut: 'realise',
        compte_rendu: "Entretien très positif. Le candidat démontre une excellente maîtrise de sa discipline."
      },
      {
        id: "ENT002",
        type: 'presentiel',
        date: new Date(2024, 1, 2),
        heure: "14:00",
        duree: 60,
        lieu: "Salle de réunion A",
        evaluateurs: ["M. Yao Directeur", "Mme Touré Responsable Pédagogique"],
        statut: 'realise'
      }
    ]
  },
  {
    id: "CAND002",
    offreId: "OFF001",
    nom: "Ouattara",
    prenom: "Aminata",
    email: "a.ouattara@email.ci",
    telephone: "+225 05 98 76 54 32",
    diplome: "Licence en Mathématiques",
    experience: "2 ans d'enseignement en école privée",
    dateCandidature: new Date(2024, 0, 20),
    statut: 'preselection',
    etapeActuelle: 2,
    evaluations: [],
    entretiens: []
  },
  {
    id: "CAND003",
    offreId: "OFF001",
    nom: "Diaby",
    prenom: "Mohamed",
    email: "m.diaby@email.ci",
    telephone: "+225 01 23 45 67 89",
    diplome: "Master en Mathématiques Appliquées",
    experience: "Débutant - stage de 6 mois",
    dateCandidature: new Date(2024, 0, 22),
    statut: 'nouveau',
    etapeActuelle: 1,
    evaluations: [],
    entretiens: []
  },
  {
    id: "CAND004",
    offreId: "OFF002",
    nom: "Yao",
    prenom: "Christelle",
    email: "c.yao@email.ci",
    telephone: "+225 07 11 22 33 44",
    diplome: "BTS Secrétariat de Direction",
    experience: "5 ans en entreprise",
    dateCandidature: new Date(2024, 0, 25),
    statut: 'retenu',
    etapeActuelle: 5,
    evaluations: [
      {
        id: "E002",
        evaluateurNom: "Mme Bamba DRH",
        date: new Date(2024, 1, 5),
        criteres: [
          { nom: "Compétences techniques", note: 5 },
          { nom: "Communication", note: 4 },
          { nom: "Organisation", note: 5 }
        ],
        noteGlobale: 4.7,
        commentaire: "Profil idéal pour le poste",
        recommandation: 'favorable'
      }
    ],
    entretiens: [
      {
        id: "ENT003",
        type: 'presentiel',
        date: new Date(2024, 1, 5),
        heure: "09:00",
        duree: 30,
        lieu: "Bureau RH",
        evaluateurs: ["Mme Bamba DRH"],
        statut: 'realise'
      }
    ]
  }
];

export default function Recrutement() {
  const [offres, setOffres] = useState<OffreEmploi[]>(mockOffres);
  const [candidats, setCandidats] = useState<Candidat[]>(mockCandidats);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterDepartement, setFilterDepartement] = useState<string>("all");
  const [showNewOffreDialog, setShowNewOffreDialog] = useState(false);
  const [showOffreDetailDialog, setShowOffreDetailDialog] = useState(false);
  const [showCandidatDialog, setShowCandidatDialog] = useState(false);
  const [showEntretienDialog, setShowEntretienDialog] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<OffreEmploi | null>(null);
  const [selectedCandidat, setSelectedCandidat] = useState<Candidat | null>(null);

  const [newOffre, setNewOffre] = useState({
    titre: "",
    departement: "Administration",
    type: 'CDI' as const,
    description: "",
    lieu: "Abidjan, Cocody",
    dateCloture: addDays(new Date(), 30),
    nombrePostes: 1
  });

  const [newEntretien, setNewEntretien] = useState({
    type: 'presentiel' as const,
    date: new Date(),
    heure: "09:00",
    duree: 45,
    lieu: "Bureau RH",
    evaluateurs: ""
  });

  // Stats
  const stats = {
    offresActives: offres.filter(o => o.statut === 'publiee').length,
    totalCandidatures: candidats.length,
    enAttente: candidats.filter(c => c.statut === 'nouveau').length,
    entretiensAPlanifier: candidats.filter(c => c.statut === 'preselection').length,
    retenus: candidats.filter(c => c.statut === 'retenu').length,
    tauxConversion: Math.round((candidats.filter(c => c.statut === 'retenu').length / Math.max(candidats.length, 1)) * 100)
  };

  const departements = [...new Set(offres.map(o => o.departement))];

  // Filtrage des offres
  const filteredOffres = offres.filter(o => {
    const matchSearch = o.titre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatut = filterStatut === "all" || o.statut === filterStatut;
    const matchDept = filterDepartement === "all" || o.departement === filterDepartement;
    return matchSearch && matchStatut && matchDept;
  });

  const getStatutOffreBadge = (statut: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, className: string }> = {
      brouillon: { variant: "outline", label: "Brouillon", className: "" },
      publiee: { variant: "default", label: "Publiée", className: "bg-green-500" },
      cloturee: { variant: "secondary", label: "Clôturée", className: "" },
      pourvue: { variant: "default", label: "Pourvue", className: "bg-blue-500" }
    };
    const config = variants[statut] || variants.brouillon;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getStatutCandidatBadge = (statut: string) => {
    const variants: Record<string, { label: string, className: string }> = {
      nouveau: { label: "Nouveau", className: "bg-blue-100 text-blue-800" },
      preselection: { label: "Présélectionné", className: "bg-purple-100 text-purple-800" },
      entretien_planifie: { label: "Entretien planifié", className: "bg-orange-100 text-orange-800" },
      entretien_realise: { label: "Entretien réalisé", className: "bg-yellow-100 text-yellow-800" },
      retenu: { label: "Retenu", className: "bg-green-100 text-green-800" },
      refuse: { label: "Refusé", className: "bg-red-100 text-red-800" },
      desiste: { label: "Désisté", className: "bg-gray-100 text-gray-800" }
    };
    const config = variants[statut] || variants.nouveau;
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      CDI: "bg-green-100 text-green-800",
      CDD: "bg-blue-100 text-blue-800",
      Vacation: "bg-orange-100 text-orange-800",
      Stage: "bg-purple-100 text-purple-800"
    };
    return <Badge variant="secondary" className={colors[type] || ""}>{type}</Badge>;
  };

  const handleCreateOffre = () => {
    if (!newOffre.titre.trim()) {
      toast({ title: "Erreur", description: "Le titre est requis", variant: "destructive" });
      return;
    }

    const offre: OffreEmploi = {
      id: `OFF${String(offres.length + 1).padStart(3, '0')}`,
      titre: newOffre.titre.trim(),
      departement: newOffre.departement,
      type: newOffre.type,
      description: newOffre.description.trim(),
      responsabilites: [],
      qualifications: [],
      competences: [],
      lieu: newOffre.lieu,
      datePublication: new Date(),
      dateCloture: newOffre.dateCloture,
      statut: 'brouillon',
      nombrePostes: newOffre.nombrePostes,
      candidatures: 0
    };

    setOffres([...offres, offre]);
    setShowNewOffreDialog(false);
    toast({ title: "Offre créée", description: `"${offre.titre}" ajoutée en brouillon` });
    
    setNewOffre({
      titre: "",
      departement: "Administration",
      type: 'CDI',
      description: "",
      lieu: "Abidjan, Cocody",
      dateCloture: addDays(new Date(), 30),
      nombrePostes: 1
    });
  };

  const handlePublierOffre = (id: string) => {
    setOffres(offres.map(o => o.id === id ? { ...o, statut: 'publiee', datePublication: new Date() } : o));
    toast({ title: "Offre publiée" });
  };

  const handleCloturerOffre = (id: string) => {
    setOffres(offres.map(o => o.id === id ? { ...o, statut: 'cloturee' } : o));
    toast({ title: "Offre clôturée" });
  };

  const handleUpdateCandidatStatut = (candidatId: string, newStatut: Candidat['statut'], newEtape?: number) => {
    setCandidats(candidats.map(c => {
      if (c.id === candidatId) {
        return { 
          ...c, 
          statut: newStatut, 
          etapeActuelle: newEtape !== undefined ? newEtape : c.etapeActuelle 
        };
      }
      return c;
    }));
    toast({ title: "Statut mis à jour" });
  };

  const handlePlanifierEntretien = () => {
    if (!selectedCandidat) return;

    const entretien: Entretien = {
      id: `ENT${String(Date.now()).slice(-6)}`,
      type: newEntretien.type,
      date: newEntretien.date,
      heure: newEntretien.heure,
      duree: newEntretien.duree,
      lieu: newEntretien.lieu,
      evaluateurs: newEntretien.evaluateurs.split(',').map(e => e.trim()).filter(e => e),
      statut: 'planifie'
    };

    setCandidats(candidats.map(c => {
      if (c.id === selectedCandidat.id) {
        return {
          ...c,
          entretiens: [...c.entretiens, entretien],
          statut: 'entretien_planifie',
          etapeActuelle: Math.max(c.etapeActuelle, 3)
        };
      }
      return c;
    }));

    setShowEntretienDialog(false);
    toast({ title: "Entretien planifié", description: `Entretien prévu le ${format(entretien.date, 'dd/MM/yyyy')} à ${entretien.heure}` });
  };

  const openOffreDetail = (offre: OffreEmploi) => {
    setSelectedOffre(offre);
    setShowOffreDetailDialog(true);
  };

  const openCandidatDetail = (candidat: Candidat) => {
    setSelectedCandidat(candidat);
    setShowCandidatDialog(true);
  };

  const offreCandidats = selectedOffre 
    ? candidats.filter(c => c.offreId === selectedOffre.id)
    : [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Recrutements</h1>
          <p className="text-muted-foreground">Offres d'emploi, candidatures et processus de sélection</p>
        </div>
        <Dialog open={showNewOffreDialog} onOpenChange={setShowNewOffreDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle offre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer une offre d'emploi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Titre du poste</Label>
                <Input 
                  value={newOffre.titre}
                  onChange={(e) => setNewOffre({...newOffre, titre: e.target.value})}
                  placeholder="Ex: Enseignant(e) de Français"
                  maxLength={100}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select value={newOffre.departement} onValueChange={(v) => setNewOffre({...newOffre, departement: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                      <SelectItem value="Lettres">Lettres</SelectItem>
                      <SelectItem value="Vie scolaire">Vie scolaire</SelectItem>
                      <SelectItem value="Technique">Technique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type de contrat</Label>
                  <Select value={newOffre.type} onValueChange={(v: any) => setNewOffre({...newOffre, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Vacation">Vacation</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={newOffre.description}
                  onChange={(e) => setNewOffre({...newOffre, description: e.target.value})}
                  placeholder="Description du poste..."
                  rows={4}
                  maxLength={1000}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lieu</Label>
                  <Input 
                    value={newOffre.lieu}
                    onChange={(e) => setNewOffre({...newOffre, lieu: e.target.value})}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre de postes</Label>
                  <Input 
                    type="number"
                    value={newOffre.nombrePostes}
                    onChange={(e) => setNewOffre({...newOffre, nombrePostes: Math.max(1, parseInt(e.target.value) || 1)})}
                    min={1}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Date de clôture</Label>
                <Input 
                  type="date"
                  value={format(newOffre.dateCloture, 'yyyy-MM-dd')}
                  onChange={(e) => setNewOffre({...newOffre, dateCloture: new Date(e.target.value)})}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewOffreDialog(false)}>Annuler</Button>
                <Button onClick={handleCreateOffre}>Créer</Button>
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
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.offresActives}</p>
                <p className="text-xs text-muted-foreground">Offres actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCandidatures}</p>
                <p className="text-xs text-muted-foreground">Candidatures</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.enAttente}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.entretiensAPlanifier}</p>
                <p className="text-xs text-muted-foreground">À planifier</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.retenus}</p>
                <p className="text-xs text-muted-foreground">Retenus</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.tauxConversion}%</p>
                <p className="text-xs text-muted-foreground">Taux conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="offres" className="space-y-4">
        <TabsList>
          <TabsTrigger value="offres">Offres d'emploi</TabsTrigger>
          <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        {/* Offres */}
        <TabsContent value="offres" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher une offre..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                    <SelectItem value="publiee">Publiée</SelectItem>
                    <SelectItem value="cloturee">Clôturée</SelectItem>
                    <SelectItem value="pourvue">Pourvue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                  <SelectTrigger className="w-[150px]">
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
            {filteredOffres.map(offre => {
              const joursRestants = differenceInDays(offre.dateCloture, new Date());
              
              return (
                <Card key={offre.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{offre.titre}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          {getTypeBadge(offre.type)}
                          {getStatutOffreBadge(offre.statut)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{offre.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{offre.departement}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{offre.lieu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{offre.candidatures} candidature(s) • {offre.nombrePostes} poste(s)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={joursRestants < 0 ? "text-red-500" : joursRestants < 7 ? "text-orange-500" : ""}>
                          {joursRestants < 0 ? "Clôturée" : `${joursRestants} jours restants`}
                        </span>
                      </div>
                      {offre.salaire && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">💰</span>
                          <span>{offre.salaire.min.toLocaleString()} - {offre.salaire.max.toLocaleString()} FCFA</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openOffreDetail(offre)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                      {offre.statut === 'brouillon' && (
                        <Button size="sm" className="flex-1" onClick={() => handlePublierOffre(offre.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          Publier
                        </Button>
                      )}
                      {offre.statut === 'publiee' && (
                        <Button size="sm" variant="secondary" onClick={() => handleCloturerOffre(offre.id)}>
                          Clôturer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Candidatures */}
        <TabsContent value="candidatures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les candidatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Candidat</th>
                      <th className="text-left p-3 font-medium">Poste</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Étape</th>
                      <th className="text-left p-3 font-medium">Statut</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidats.map(candidat => {
                      const offre = offres.find(o => o.id === candidat.offreId);
                      return (
                        <tr key={candidat.id} className="border-t hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{candidat.prenom} {candidat.nom}</p>
                              <p className="text-sm text-muted-foreground">{candidat.email}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-medium">{offre?.titre}</p>
                            <p className="text-sm text-muted-foreground">{offre?.departement}</p>
                          </td>
                          <td className="p-3">{format(candidat.dateCandidature, 'dd/MM/yyyy')}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Progress value={(candidat.etapeActuelle / 5) * 100} className="w-16 h-2" />
                              <span className="text-sm">{candidat.etapeActuelle}/5</span>
                            </div>
                          </td>
                          <td className="p-3">{getStatutCandidatBadge(candidat.statut)}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => openCandidatDetail(candidat)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {candidat.statut === 'nouveau' && (
                                <Button size="sm" variant="ghost" onClick={() => handleUpdateCandidatStatut(candidat.id, 'preselection', 2)}>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                              )}
                              {candidat.statut === 'preselection' && (
                                <Button size="sm" variant="ghost" onClick={() => {
                                  setSelectedCandidat(candidat);
                                  setShowEntretienDialog(true);
                                }}>
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
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

        {/* Pipeline */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {etapesRecrutement.map(etape => {
              const candidatsEtape = candidats.filter(c => c.etapeActuelle === etape.id && c.statut !== 'refuse' && c.statut !== 'desiste');
              const Icon = etape.icon;
              
              return (
                <Card key={etape.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {etape.nom}
                    </CardTitle>
                    <Badge variant="outline">{candidatsEtape.length}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {candidatsEtape.map(candidat => {
                      const offre = offres.find(o => o.id === candidat.offreId);
                      return (
                        <div 
                          key={candidat.id} 
                          className="p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                          onClick={() => openCandidatDetail(candidat)}
                        >
                          <p className="font-medium text-sm">{candidat.prenom} {candidat.nom}</p>
                          <p className="text-xs text-muted-foreground truncate">{offre?.titre}</p>
                        </div>
                      );
                    })}
                    {candidatsEtape.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucun candidat</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Statistiques */}
        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Offres publiées</p>
                    <p className="text-3xl font-bold">{offres.filter(o => o.statut !== 'brouillon').length}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Candidatures/Offre</p>
                    <p className="text-3xl font-bold">
                      {Math.round(candidats.length / Math.max(offres.filter(o => o.statut !== 'brouillon').length, 1))}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Délai moyen</p>
                    <p className="text-3xl font-bold">15j</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux d'embauche</p>
                    <p className="text-3xl font-bold">{stats.tauxConversion}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['nouveau', 'preselection', 'entretien_planifie', 'entretien_realise', 'retenu', 'refuse'].map(statut => {
                    const count = candidats.filter(c => c.statut === statut).length;
                    const percentage = Math.round((count / Math.max(candidats.length, 1)) * 100);
                    const labels: Record<string, string> = {
                      nouveau: "Nouveau",
                      preselection: "Présélectionné",
                      entretien_planifie: "Entretien planifié",
                      entretien_realise: "Entretien réalisé",
                      retenu: "Retenu",
                      refuse: "Refusé"
                    };
                    return (
                      <div key={statut}>
                        <div className="flex justify-between mb-1">
                          <span>{labels[statut]}</span>
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
                <CardTitle>Candidatures par département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departements.map(dept => {
                    const deptOffres = offres.filter(o => o.departement === dept);
                    const deptCandidats = candidats.filter(c => deptOffres.some(o => o.id === c.offreId));
                    const percentage = Math.round((deptCandidats.length / Math.max(candidats.length, 1)) * 100);
                    return (
                      <div key={dept}>
                        <div className="flex justify-between mb-1">
                          <span>{dept}</span>
                          <span className="text-muted-foreground">{deptCandidats.length} ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog détail offre */}
      <Dialog open={showOffreDetailDialog} onOpenChange={setShowOffreDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedOffre && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedOffre.titre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex gap-2">
                  {getTypeBadge(selectedOffre.type)}
                  {getStatutOffreBadge(selectedOffre.statut)}
                  <Badge variant="outline">{selectedOffre.departement}</Badge>
                </div>
                
                <p className="text-muted-foreground">{selectedOffre.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOffre.lieu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOffre.nombrePostes} poste(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Clôture: {format(selectedOffre.dateCloture, 'dd/MM/yyyy')}</span>
                  </div>
                  {selectedOffre.salaire && (
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span>{selectedOffre.salaire.min.toLocaleString()} - {selectedOffre.salaire.max.toLocaleString()} FCFA</span>
                    </div>
                  )}
                </div>

                {selectedOffre.responsabilites.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Responsabilités</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedOffre.responsabilites.map((r, i) => (
                        <li key={i} className="text-sm">{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedOffre.qualifications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Qualifications requises</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedOffre.qualifications.map((q, i) => (
                        <li key={i} className="text-sm">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Candidatures ({offreCandidats.length})</h4>
                  {offreCandidats.length > 0 ? (
                    <div className="space-y-2">
                      {offreCandidats.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div>
                            <p className="font-medium">{c.prenom} {c.nom}</p>
                            <p className="text-sm text-muted-foreground">{c.diplome}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatutCandidatBadge(c.statut)}
                            <Button size="sm" variant="ghost" onClick={() => {
                              setShowOffreDetailDialog(false);
                              openCandidatDetail(c);
                            }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune candidature</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog détail candidat */}
      <Dialog open={showCandidatDialog} onOpenChange={setShowCandidatDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedCandidat && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCandidat.prenom} {selectedCandidat.nom}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {getStatutCandidatBadge(selectedCandidat.statut)}
                  <span className="text-sm text-muted-foreground">
                    Candidature du {format(selectedCandidat.dateCandidature, 'dd/MM/yyyy')}
                  </span>
                </div>

                {/* Pipeline progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    {etapesRecrutement.map((etape, i) => {
                      const Icon = etape.icon;
                      const isActive = selectedCandidat.etapeActuelle >= etape.id;
                      return (
                        <div key={etape.id} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs mt-1 text-center max-w-[60px]">{etape.nom}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Progress value={(selectedCandidat.etapeActuelle / 5) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCandidat.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCandidat.telephone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCandidat.diplome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCandidat.experience}</span>
                    </div>
                  </div>
                </div>

                {selectedCandidat.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm">{selectedCandidat.notes}</p>
                  </div>
                )}

                {/* Entretiens */}
                {selectedCandidat.entretiens.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Entretiens</h4>
                    <div className="space-y-2">
                      {selectedCandidat.entretiens.map(e => (
                        <div key={e.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <Badge variant="outline" className="mb-1">
                                {e.type === 'telephonique' ? '📞 Téléphonique' : 
                                 e.type === 'visio' ? '💻 Visio' : '🏢 Présentiel'}
                              </Badge>
                              <p className="text-sm">{format(e.date, 'dd/MM/yyyy')} à {e.heure} ({e.duree} min)</p>
                              {e.lieu && <p className="text-xs text-muted-foreground">{e.lieu}</p>}
                            </div>
                            <Badge variant={e.statut === 'realise' ? 'default' : 'outline'}>
                              {e.statut === 'realise' ? 'Réalisé' : e.statut === 'planifie' ? 'Planifié' : 'Annulé'}
                            </Badge>
                          </div>
                          {e.compte_rendu && (
                            <p className="text-sm mt-2 p-2 bg-muted/50 rounded">{e.compte_rendu}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Évaluations */}
                {selectedCandidat.evaluations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Évaluations</h4>
                    {selectedCandidat.evaluations.map(ev => (
                      <Card key={ev.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{ev.evaluateurNom}</p>
                            <Badge variant={ev.recommandation === 'favorable' ? 'default' : ev.recommandation === 'reserve' ? 'secondary' : 'destructive'}>
                              {ev.recommandation === 'favorable' ? '👍 Favorable' : ev.recommandation === 'reserve' ? '🤔 Réservé' : '👎 Défavorable'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map(n => (
                                <Star key={n} className={`h-4 w-4 ${n <= ev.noteGlobale ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="font-medium">{ev.noteGlobale.toFixed(1)}/5</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{ev.commentaire}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {selectedCandidat.statut === 'nouveau' && (
                    <Button onClick={() => handleUpdateCandidatStatut(selectedCandidat.id, 'preselection', 2)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Présélectionner
                    </Button>
                  )}
                  {selectedCandidat.statut === 'preselection' && (
                    <Button onClick={() => {
                      setShowCandidatDialog(false);
                      setShowEntretienDialog(true);
                    }}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Planifier entretien
                    </Button>
                  )}
                  {(selectedCandidat.statut === 'entretien_realise' || selectedCandidat.etapeActuelle >= 4) && selectedCandidat.statut !== 'retenu' && (
                    <>
                      <Button onClick={() => handleUpdateCandidatStatut(selectedCandidat.id, 'retenu', 5)}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Retenir
                      </Button>
                      <Button variant="destructive" onClick={() => handleUpdateCandidatStatut(selectedCandidat.id, 'refuse', selectedCandidat.etapeActuelle)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Refuser
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog planifier entretien */}
      <Dialog open={showEntretienDialog} onOpenChange={setShowEntretienDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Planifier un entretien</DialogTitle>
          </DialogHeader>
          {selectedCandidat && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Entretien avec {selectedCandidat.prenom} {selectedCandidat.nom}
              </p>
              
              <div className="space-y-2">
                <Label>Type d'entretien</Label>
                <Select value={newEntretien.type} onValueChange={(v: any) => setNewEntretien({...newEntretien, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telephonique">Téléphonique</SelectItem>
                    <SelectItem value="visio">Visioconférence</SelectItem>
                    <SelectItem value="presentiel">Présentiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={format(newEntretien.date, 'yyyy-MM-dd')}
                    onChange={(e) => setNewEntretien({...newEntretien, date: new Date(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heure</Label>
                  <Input 
                    type="time"
                    value={newEntretien.heure}
                    onChange={(e) => setNewEntretien({...newEntretien, heure: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Durée (min)</Label>
                  <Select value={String(newEntretien.duree)} onValueChange={(v) => setNewEntretien({...newEntretien, duree: parseInt(v)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="90">1h30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lieu</Label>
                  <Input 
                    value={newEntretien.lieu}
                    onChange={(e) => setNewEntretien({...newEntretien, lieu: e.target.value})}
                    placeholder="Bureau RH"
                    maxLength={100}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Évaluateurs (séparés par virgule)</Label>
                <Input 
                  value={newEntretien.evaluateurs}
                  onChange={(e) => setNewEntretien({...newEntretien, evaluateurs: e.target.value})}
                  placeholder="M. Yao, Mme Bamba"
                  maxLength={200}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEntretienDialog(false)}>Annuler</Button>
                <Button onClick={handlePlanifierEntretien}>Planifier</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
