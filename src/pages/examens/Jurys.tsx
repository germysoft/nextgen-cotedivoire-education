import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, AlertCircle, CheckCircle, Sparkles, Calendar, Clock, ShieldAlert, Search, Edit, Trash2, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Enseignant {
  id: string;
  nom: string;
  matiere: string;
  classesEnseignees: string[];
  disponible: boolean;
  affecte: boolean;
  photo: string;
}

interface Jury {
  id: string;
  enseignant: string;
  enseignantId: string;
  matiere: string;
  epreuve: string;
  salle: string;
  date: string;
  heure: string;
  nbCandidats: number;
  conflit: boolean;
  conflitDetail?: string;
  photo: string;
}

interface Planning {
  jour: string;
  epreuve: string;
  horaire: string;
  salles: string[];
  jurysRequis: number;
  jurysAffectes: number;
}

const initialEnseignants: Enseignant[] = [
  { id: "T001", nom: "KOUADIO Marie", matiere: "Français", classesEnseignees: ["3ème A", "3ème B"], disponible: true, affecte: false, photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces" },
  { id: "T002", nom: "BAMBA Serge", matiere: "Mathématiques", classesEnseignees: ["3ème A", "3ème C"], disponible: true, affecte: false, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" },
  { id: "T003", nom: "YAO Ange", matiere: "Anglais", classesEnseignees: ["3ème B", "3ème C"], disponible: true, affecte: false, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces" },
  { id: "T004", nom: "DIALLO Ibrahim", matiere: "Français", classesEnseignees: ["3ème C"], disponible: true, affecte: false, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces" },
  { id: "T005", nom: "KONE Aminata", matiere: "Histoire-Géo", classesEnseignees: ["3ème A"], disponible: false, affecte: false, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces" },
];

const initialJurys: Jury[] = [
  { id: "J001", enseignant: "KOUADIO Marie", enseignantId: "T001", matiere: "Français", epreuve: "Français Écrit", salle: "A101", date: "2025-06-15", heure: "08:00 - 12:00", nbCandidats: 40, conflit: false, photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces" },
  { id: "J002", enseignant: "BAMBA Serge", enseignantId: "T002", matiere: "Mathématiques", epreuve: "Mathématiques", salle: "B205", date: "2025-06-16", heure: "08:00 - 11:00", nbCandidats: 38, conflit: true, conflitDetail: "Enseigne la 3ème A (12 candidats présents)", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" },
  { id: "J003", enseignant: "YAO Ange", enseignantId: "T003", matiere: "Anglais", epreuve: "Anglais Écrit", salle: "C102", date: "2025-06-17", heure: "08:00 - 10:00", nbCandidats: 42, conflit: false, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces" },
];

const initialPlanning: Planning[] = [
  { jour: "Lundi 15/06", epreuve: "Français Écrit", horaire: "08:00-12:00", salles: ["A101", "A102", "A103"], jurysRequis: 9, jurysAffectes: 9 },
  { jour: "Mardi 16/06", epreuve: "Mathématiques", horaire: "08:00-11:00", salles: ["B201", "B202", "B203"], jurysRequis: 9, jurysAffectes: 8 },
  { jour: "Mercredi 17/06", epreuve: "Anglais Écrit", horaire: "08:00-10:00", salles: ["C101", "C102"], jurysRequis: 6, jurysAffectes: 6 },
  { jour: "Jeudi 18/06", epreuve: "Histoire-Géo", horaire: "08:00-10:00", salles: ["A101", "A102"], jurysRequis: 6, jurysAffectes: 4 },
];

const matieres = ["Français", "Mathématiques", "Anglais", "Histoire-Géo", "SVT", "Physique-Chimie"];
const epreuves = ["Français Écrit", "Mathématiques", "Anglais Écrit", "Anglais Oral", "Histoire-Géo", "SVT", "Physique-Chimie"];
const salles = ["A101", "A102", "A103", "B201", "B202", "B203", "C101", "C102"];

export default function JurysExamens() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>(initialEnseignants);
  const [jurys, setJurys] = useState<Jury[]>(initialJurys);
  const [planning, setPlanning] = useState<Planning[]>(initialPlanning);
  const [selectedMatiere, setSelectedMatiere] = useState("tous");
  const [showConflits, setShowConflits] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAffectDialogOpen, setIsAffectDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);
  const [selectedJury, setSelectedJury] = useState<Jury | null>(null);

  const [newAffectation, setNewAffectation] = useState({
    epreuve: "",
    salle: "",
    date: "",
    heure: "",
    nbCandidats: 30
  });

  // Stats
  const disponibles = enseignants.filter(e => e.disponible && !e.affecte).length;
  const affectes = enseignants.filter(e => e.affecte).length;
  const conflitsCount = jurys.filter(j => j.conflit).length;
  const totalJurysRequis = planning.reduce((sum, p) => sum + p.jurysRequis, 0);
  const totalJurysAffectes = planning.reduce((sum, p) => sum + p.jurysAffectes, 0);
  const tauxCouverture = totalJurysRequis > 0 ? Math.round((totalJurysAffectes / totalJurysRequis) * 100) : 0;

  // Filtrage
  const filteredJurys = jurys.filter(j => {
    const matchMatiere = selectedMatiere === "tous" || j.matiere === selectedMatiere;
    const matchSearch = j.enseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       j.epreuve.toLowerCase().includes(searchTerm.toLowerCase());
    return matchMatiere && matchSearch;
  });

  const filteredEnseignants = enseignants.filter(e => 
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.matiere.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAttributionAuto = () => {
    // Attribution automatique intelligente
    const nonAffectes = enseignants.filter(e => e.disponible && !e.affecte);
    let newJurys = [...jurys];
    let newEnseignants = [...enseignants];
    let newPlanning = [...planning];
    let affectations = 0;

    newPlanning.forEach((p, pi) => {
      const besoin = p.jurysRequis - p.jurysAffectes;
      if (besoin <= 0) return;

      for (let i = 0; i < besoin && i < nonAffectes.length; i++) {
        const ens = nonAffectes[i];
        // Vérifier si l'enseignant n'a pas de conflit
        const hasConflit = ens.classesEnseignees.some(classe => 
          p.epreuve.toLowerCase().includes(ens.matiere.toLowerCase())
        );

        if (!hasConflit || i >= nonAffectes.length - 1) {
          const newJury: Jury = {
            id: `J${String(newJurys.length + 1).padStart(3, '0')}`,
            enseignant: ens.nom,
            enseignantId: ens.id,
            matiere: ens.matiere,
            epreuve: p.epreuve,
            salle: p.salles[Math.floor(i / 3) % p.salles.length],
            date: `2025-06-${15 + pi}`,
            heure: p.horaire,
            nbCandidats: 35,
            conflit: hasConflit,
            conflitDetail: hasConflit ? `Enseigne ${ens.classesEnseignees.join(', ')}` : undefined,
            photo: ens.photo
          };
          newJurys.push(newJury);
          
          // Marquer l'enseignant comme affecté
          const ensIndex = newEnseignants.findIndex(e => e.id === ens.id);
          if (ensIndex !== -1) {
            newEnseignants[ensIndex] = { ...newEnseignants[ensIndex], affecte: true };
          }
          
          newPlanning[pi] = { ...p, jurysAffectes: p.jurysAffectes + 1 };
          affectations++;
        }
      }
    });

    setJurys(newJurys);
    setEnseignants(newEnseignants);
    setPlanning(newPlanning);
    
    toast.success("Attribution automatique lancée", {
      description: `${affectations} jury(s) affecté(s) en évitant les conflits d'enseignement`
    });
  };

  const handleVerifierConflits = () => {
    setShowConflits(true);
    const conflits = jurys.filter(j => j.conflit).length;
    if (conflits > 0) {
      toast.warning(`${conflits} conflit(s) détecté(s)`, {
        description: "Certains enseignants surveillent leurs propres élèves"
      });
    } else {
      toast.success("Aucun conflit détecté", {
        description: "Toutes les affectations sont conformes"
      });
    }
  };

  const handleAffecterEnseignant = () => {
    if (!selectedEnseignant || !newAffectation.epreuve || !newAffectation.salle) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const hasConflit = selectedEnseignant.classesEnseignees.some(classe => 
      newAffectation.epreuve.toLowerCase().includes(selectedEnseignant.matiere.toLowerCase())
    );

    const newJury: Jury = {
      id: `J${String(jurys.length + 1).padStart(3, '0')}`,
      enseignant: selectedEnseignant.nom,
      enseignantId: selectedEnseignant.id,
      matiere: selectedEnseignant.matiere,
      epreuve: newAffectation.epreuve,
      salle: newAffectation.salle,
      date: newAffectation.date || "2025-06-15",
      heure: newAffectation.heure || "08:00 - 12:00",
      nbCandidats: newAffectation.nbCandidats,
      conflit: hasConflit,
      conflitDetail: hasConflit ? `Enseigne ${selectedEnseignant.classesEnseignees.join(', ')}` : undefined,
      photo: selectedEnseignant.photo
    };

    setJurys(prev => [...prev, newJury]);
    setEnseignants(prev => prev.map(e => e.id === selectedEnseignant.id ? { ...e, affecte: true } : e));

    if (hasConflit) {
      toast.warning("Affectation avec conflit", {
        description: `${selectedEnseignant.nom} enseigne des candidats présents`
      });
    } else {
      toast.success("Jury affecté", {
        description: `${selectedEnseignant.nom} affecté à ${newAffectation.epreuve}`
      });
    }

    setIsAffectDialogOpen(false);
    setSelectedEnseignant(null);
    setNewAffectation({ epreuve: "", salle: "", date: "", heure: "", nbCandidats: 30 });
  };

  const handleEditJury = () => {
    if (!selectedJury) return;
    setJurys(prev => prev.map(j => j.id === selectedJury.id ? selectedJury : j));
    toast.success("Affectation modifiée", {
      description: `L'affectation de ${selectedJury.enseignant} a été mise à jour`
    });
    setIsEditDialogOpen(false);
    setSelectedJury(null);
  };

  const handleRemoveJury = () => {
    if (!selectedJury) return;
    setJurys(prev => prev.filter(j => j.id !== selectedJury.id));
    setEnseignants(prev => prev.map(e => e.id === selectedJury.enseignantId ? { ...e, affecte: false } : e));
    toast.success("Jury retiré", {
      description: `${selectedJury.enseignant} a été retiré de l'épreuve ${selectedJury.epreuve}`
    });
    setIsRemoveDialogOpen(false);
    setSelectedJury(null);
  };

  const handleReaffecterConflits = () => {
    const conflitJurys = jurys.filter(j => j.conflit);
    const nonAffectes = enseignants.filter(e => e.disponible && !e.affecte);

    let resolved = 0;
    conflitJurys.forEach(jury => {
      // Trouver un enseignant sans conflit
      const replacement = nonAffectes.find(e => 
        !e.classesEnseignees.some(classe => 
          jury.epreuve.toLowerCase().includes(e.matiere.toLowerCase())
        )
      );

      if (replacement) {
        setJurys(prev => prev.map(j => 
          j.id === jury.id 
            ? { ...j, enseignant: replacement.nom, enseignantId: replacement.id, conflit: false, conflitDetail: undefined, photo: replacement.photo }
            : j
        ));
        setEnseignants(prev => prev.map(e => {
          if (e.id === replacement.id) return { ...e, affecte: true };
          if (e.id === jury.enseignantId) return { ...e, affecte: false };
          return e;
        }));
        resolved++;
      }
    });

    if (resolved > 0) {
      toast.success(`${resolved} conflit(s) résolu(s)`, {
        description: "Les jurys en conflit ont été réaffectés"
      });
    } else {
      toast.info("Aucune réaffectation possible", {
        description: "Pas d'enseignants disponibles sans conflit"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Jurys & Examinateurs
          </h1>
          <p className="text-muted-foreground mt-1">
            Attribution intelligente des jurys avec vérification anti-conflit
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleVerifierConflits} className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Vérifier Conflits
          </Button>
          <Button onClick={handleAttributionAuto} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Attribution Auto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enseignants Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{disponibles}</div>
            <p className="text-xs text-muted-foreground mt-1">Sur {enseignants.length} au total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jurys Affectés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{jurys.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Sur {totalJurysRequis} postes requis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conflits Détectés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{conflitsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{conflitsCount > 0 ? "À résoudre" : "Aucun"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux Couverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{tauxCouverture}%</div>
            <p className="text-xs text-muted-foreground mt-1">{totalJurysRequis - totalJurysAffectes} postes restants</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Conflits */}
      {showConflits && conflitsCount > 0 && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Conflits d'Enseignement Détectés ({conflitsCount})</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Certains enseignants sont affectés à des épreuves où leurs propres élèves sont candidats.</span>
            <Button size="sm" variant="outline" onClick={handleReaffecterConflits}>
              Réaffecter Automatiquement
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="jurys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jurys">Jurys Affectés</TabsTrigger>
          <TabsTrigger value="enseignants">Enseignants Disponibles</TabsTrigger>
          <TabsTrigger value="planning">Planning Surveillance</TabsTrigger>
        </TabsList>

        <TabsContent value="jurys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Jurys Affectés</CardTitle>
                  <CardDescription>BEPC 2025 - Session 1</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-48"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedMatiere} onValueChange={setSelectedMatiere}>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes les matières</SelectItem>
                      {matieres.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Épreuve</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Salle</TableHead>
                    <TableHead>Candidats</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJurys.map((jury) => (
                    <TableRow key={jury.id} className={jury.conflit ? "bg-orange-50 dark:bg-orange-950/20" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={jury.photo} />
                            <AvatarFallback>{jury.enseignant.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{jury.enseignant}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{jury.matiere}</Badge></TableCell>
                      <TableCell>{jury.epreuve}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {jury.date}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {jury.heure}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{jury.salle}</TableCell>
                      <TableCell>{jury.nbCandidats}</TableCell>
                      <TableCell>
                        {jury.conflit ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Conflit
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                            <CheckCircle className="h-3 w-3" />
                            Validé
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setSelectedJury(jury); setIsEditDialogOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => { setSelectedJury(jury); setIsRemoveDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredJurys.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun jury affecté avec ces critères
                </div>
              )}

              {filteredJurys.some(j => j.conflit) && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100">Détails des Conflits</h4>
                      {filteredJurys.filter(j => j.conflit).map(j => (
                        <p key={j.id} className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                          • {j.enseignant}: {j.conflitDetail}
                        </p>
                      ))}
                      <Button size="sm" variant="outline" className="mt-3" onClick={handleReaffecterConflits}>
                        Réaffecter Automatiquement
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enseignants" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pool d'Enseignants Disponibles</CardTitle>
                  <CardDescription>Enseignants éligibles pour la surveillance d'examens</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière Enseignée</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Disponibilité</TableHead>
                    <TableHead>Affectation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnseignants.map((ens) => (
                    <TableRow key={ens.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={ens.photo} />
                            <AvatarFallback>{ens.nom.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{ens.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{ens.matiere}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ens.classesEnseignees.join(", ")}
                      </TableCell>
                      <TableCell>
                        <Badge className={ens.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {ens.disponible ? "Disponible" : "Indisponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ens.affecte ? (
                          <Badge>Affecté</Badge>
                        ) : (
                          <Badge variant="secondary">Non affecté</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={ens.affecte || !ens.disponible}
                          onClick={() => {
                            setSelectedEnseignant(ens);
                            setIsAffectDialogOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Affecter
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Attribution Automatique Intelligente</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Le système attribue automatiquement les jurys en respectant les règles suivantes :
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>Un enseignant ne surveille jamais ses propres élèves</li>
                      <li>Répartition équitable des charges de surveillance</li>
                      <li>Priorité aux enseignants de matières différentes</li>
                      <li>Respect des disponibilités déclarées</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planning de Surveillance
              </CardTitle>
              <CardDescription>Vue d'ensemble des besoins en jurys par jour et épreuve</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Épreuve</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Salles</TableHead>
                    <TableHead>Jurys Requis</TableHead>
                    <TableHead>Jurys Affectés</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planning.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{p.jour}</TableCell>
                      <TableCell>{p.epreuve}</TableCell>
                      <TableCell>{p.horaire}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.salles.map(s => (
                            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{p.jurysRequis}</TableCell>
                      <TableCell className={p.jurysAffectes < p.jurysRequis ? "text-orange-600 font-medium" : ""}>
                        {p.jurysAffectes}
                      </TableCell>
                      <TableCell>
                        {p.jurysAffectes >= p.jurysRequis ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complet
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-700">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {p.jurysRequis - p.jurysAffectes} manquant(s)
                          </Badge>
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

      {/* Dialog Affecter Enseignant */}
      <Dialog open={isAffectDialogOpen} onOpenChange={setIsAffectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Affecter {selectedEnseignant?.nom}</DialogTitle>
            <DialogDescription>Assignez cet enseignant à une épreuve</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Épreuve</Label>
              <Select value={newAffectation.epreuve} onValueChange={(v) => setNewAffectation({...newAffectation, epreuve: v})}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {epreuves.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salle</Label>
                <Select value={newAffectation.salle} onValueChange={(v) => setNewAffectation({...newAffectation, salle: v})}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {salles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nombre de candidats</Label>
                <Input 
                  type="number"
                  value={newAffectation.nbCandidats}
                  onChange={(e) => setNewAffectation({...newAffectation, nbCandidats: parseInt(e.target.value) || 30})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={newAffectation.date}
                  onChange={(e) => setNewAffectation({...newAffectation, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Horaire</Label>
                <Input 
                  placeholder="Ex: 08:00 - 12:00"
                  value={newAffectation.heure}
                  onChange={(e) => setNewAffectation({...newAffectation, heure: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAffectDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAffecterEnseignant}>Affecter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier Jury */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'Affectation</DialogTitle>
          </DialogHeader>
          {selectedJury && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Épreuve</Label>
                <Select value={selectedJury.epreuve} onValueChange={(v) => setSelectedJury({...selectedJury, epreuve: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {epreuves.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salle</Label>
                  <Select value={selectedJury.salle} onValueChange={(v) => setSelectedJury({...selectedJury, salle: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {salles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Candidats</Label>
                  <Input 
                    type="number"
                    value={selectedJury.nbCandidats}
                    onChange={(e) => setSelectedJury({...selectedJury, nbCandidats: parseInt(e.target.value) || 30})}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditJury}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Retirer Jury */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retirer le Jury</DialogTitle>
            <DialogDescription>
              Voulez-vous retirer {selectedJury?.enseignant} de l'épreuve {selectedJury?.epreuve} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleRemoveJury}>Retirer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
