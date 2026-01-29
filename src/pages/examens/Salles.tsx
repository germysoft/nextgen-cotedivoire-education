import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Calendar, Users, Sparkles, AlertCircle, CheckCircle, MapPin, Clock, Search, Edit, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

interface Salle {
  id: string;
  nom: string;
  batiment: string;
  capacite: number;
  type: "Écrit" | "Pratique";
  equipement: string[];
  statut: "Disponible" | "En maintenance" | "Occupée";
  affectes: number;
}

interface Planning {
  id: string;
  jour: string;
  epreuve: string;
  horaire: string;
  salles: string[];
  candidats: number;
  capacite: number;
  conflit: boolean;
}

interface Affectation {
  salle: string;
  table: number;
  candidat: string;
  numero: string;
  epreuve: string;
}

const initialSalles: Salle[] = [
  { id: "S001", nom: "Salle A101", batiment: "Bâtiment A", capacite: 30, type: "Écrit", equipement: ["Tableaux", "Ventilation"], statut: "Disponible", affectes: 0 },
  { id: "S002", nom: "Salle A102", batiment: "Bâtiment A", capacite: 30, type: "Écrit", equipement: ["Tableaux", "Ventilation"], statut: "Disponible", affectes: 28 },
  { id: "S003", nom: "Salle A103", batiment: "Bâtiment A", capacite: 30, type: "Écrit", equipement: ["Tableaux", "Climatisation"], statut: "Disponible", affectes: 30 },
  { id: "S004", nom: "Salle B201", batiment: "Bâtiment B", capacite: 35, type: "Écrit", equipement: ["Tableaux", "Climatisation", "Vidéoprojecteur"], statut: "Disponible", affectes: 32 },
  { id: "S005", nom: "Labo Physique", batiment: "Bâtiment C", capacite: 20, type: "Pratique", equipement: ["Paillasses", "Matériel labo"], statut: "Disponible", affectes: 0 },
  { id: "S006", nom: "Labo Chimie", batiment: "Bâtiment C", capacite: 20, type: "Pratique", equipement: ["Paillasses", "Hotte"], statut: "En maintenance", affectes: 0 },
];

const initialPlanning: Planning[] = [
  { id: "P001", jour: "Lundi 15/06/2025", epreuve: "Français Écrit", horaire: "08:00 - 12:00", salles: ["A101", "A102", "A103"], candidats: 88, capacite: 90, conflit: false },
  { id: "P002", jour: "Lundi 15/06/2025", epreuve: "Anglais Oral", horaire: "14:00 - 18:00", salles: ["B201"], candidats: 30, capacite: 35, conflit: false },
  { id: "P003", jour: "Mardi 16/06/2025", epreuve: "Mathématiques", horaire: "08:00 - 11:00", salles: ["A101", "A102", "B201"], candidats: 95, capacite: 95, conflit: false },
  { id: "P004", jour: "Mardi 16/06/2025", epreuve: "Physique Pratique", horaire: "09:00 - 12:00", salles: ["Labo Physique"], candidats: 25, capacite: 20, conflit: true },
];

const initialAffectations: Affectation[] = [
  { salle: "A101", table: 1, candidat: "KOUASSI Jean", numero: "C2025001", epreuve: "Français" },
  { salle: "A101", table: 2, candidat: "TRAORÉ Marie", numero: "C2025002", epreuve: "Français" },
  { salle: "A101", table: 3, candidat: "YAO Pascal", numero: "C2025003", epreuve: "Français" },
  { salle: "A102", table: 1, candidat: "DIALLO Fatima", numero: "C2025004", epreuve: "Français" },
  { salle: "A102", table: 2, candidat: "BAMBA Serge", numero: "C2025005", epreuve: "Français" },
];

const batiments = ["Bâtiment A", "Bâtiment B", "Bâtiment C"];
const equipements = ["Tableaux", "Ventilation", "Climatisation", "Vidéoprojecteur", "Paillasses", "Matériel labo", "Hotte"];

export default function SallesExamens() {
  const [salles, setSalles] = useState<Salle[]>(initialSalles);
  const [planning, setPlanning] = useState<Planning[]>(initialPlanning);
  const [affectations, setAffectations] = useState<Affectation[]>(initialAffectations);
  const [selectedSalle, setSelectedSalle] = useState("A101");
  const [showConflits, setShowConflits] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [filterType, setFilterType] = useState("tous");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [selectedSalleObj, setSelectedSalleObj] = useState<Salle | null>(null);

  const [newSalle, setNewSalle] = useState({
    nom: "",
    batiment: "",
    capacite: 30,
    type: "Écrit" as "Écrit" | "Pratique",
    equipement: [] as string[],
    statut: "Disponible" as Salle["statut"]
  });

  // Stats
  const totalSalles = salles.length;
  const disponibles = salles.filter(s => s.statut === "Disponible").length;
  const capaciteTotale = salles.filter(s => s.statut === "Disponible").reduce((sum, s) => sum + s.capacite, 0);
  const candidatsAffectes = salles.reduce((sum, s) => sum + s.affectes, 0);
  const conflitsCount = planning.filter(p => p.conflit).length;

  // Filtrage
  const filteredSalles = salles.filter(s => {
    const matchSearch = s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.batiment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === "tous" || s.statut === filterStatut;
    const matchType = filterType === "tous" || s.type === filterType;
    return matchSearch && matchStatut && matchType;
  });

  const handleAffectationAuto = () => {
    // Simulation d'affectation automatique
    const newAffectations: Affectation[] = [];
    let candidatNum = 1;
    
    salles.filter(s => s.statut === "Disponible").forEach(salle => {
      for (let table = 1; table <= salle.capacite; table++) {
        newAffectations.push({
          salle: salle.nom.replace("Salle ", ""),
          table,
          candidat: `CANDIDAT ${candidatNum}`,
          numero: `C2025${String(candidatNum).padStart(3, '0')}`,
          epreuve: "BEPC 2025"
        });
        candidatNum++;
      }
    });

    const updatedSalles = salles.map(s => ({
      ...s,
      affectes: s.statut === "Disponible" ? s.capacite : 0
    }));

    setSalles(updatedSalles);
    setAffectations(newAffectations.slice(0, 150)); // Limiter pour l'affichage

    toast.success("Affectation automatique réussie", {
      description: `${candidatNum - 1} candidats répartis dans ${disponibles} salles`
    });
  };

  const handleVerifierConflits = () => {
    setShowConflits(true);
    const conflits = planning.filter(p => p.conflit).length;
    if (conflits > 0) {
      toast.warning(`${conflits} conflit(s) détecté(s)`, {
        description: "Vérifiez les chevauchements d'horaires et les surcharges"
      });
    } else {
      toast.success("Aucun conflit détecté", {
        description: "Toutes les affectations sont conformes"
      });
    }
  };

  const handleAddSalle = () => {
    if (!newSalle.nom || !newSalle.batiment) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const salle: Salle = {
      id: `S${String(salles.length + 1).padStart(3, '0')}`,
      nom: newSalle.nom,
      batiment: newSalle.batiment,
      capacite: newSalle.capacite,
      type: newSalle.type,
      equipement: newSalle.equipement,
      statut: newSalle.statut,
      affectes: 0
    };

    setSalles(prev => [...prev, salle]);
    toast.success("Salle ajoutée", { description: `${newSalle.nom} a été créée` });
    setIsAddDialogOpen(false);
    setNewSalle({ nom: "", batiment: "", capacite: 30, type: "Écrit", equipement: [], statut: "Disponible" });
  };

  const handleEditSalle = () => {
    if (!selectedSalleObj) return;
    setSalles(prev => prev.map(s => s.id === selectedSalleObj.id ? selectedSalleObj : s));
    toast.success("Salle modifiée", { description: `${selectedSalleObj.nom} a été mise à jour` });
    setIsEditDialogOpen(false);
    setSelectedSalleObj(null);
  };

  const handleDeleteSalle = () => {
    if (!selectedSalleObj) return;
    setSalles(prev => prev.filter(s => s.id !== selectedSalleObj.id));
    toast.success("Salle supprimée", { description: `${selectedSalleObj.nom} a été retirée` });
    setIsDeleteDialogOpen(false);
    setSelectedSalleObj(null);
  };

  const handleToggleEquipement = (equip: string) => {
    if (newSalle.equipement.includes(equip)) {
      setNewSalle({ ...newSalle, equipement: newSalle.equipement.filter(e => e !== equip) });
    } else {
      setNewSalle({ ...newSalle, equipement: [...newSalle.equipement, equip] });
    }
  };

  const handleResolveConflict = (planningId: string) => {
    setPlanning(prev => prev.map(p => {
      if (p.id === planningId && p.conflit) {
        return { ...p, conflit: false, salles: [...p.salles, "Labo Chimie"], capacite: p.capacite + 20 };
      }
      return p;
    }));
    toast.success("Conflit résolu", { description: "Une salle supplémentaire a été affectée" });
  };

  const salleAffectations = affectations.filter(a => a.salle === selectedSalle);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Salles & Planning
          </h1>
          <p className="text-muted-foreground mt-1">
            Affectation automatique des candidats et gestion des plannings d'épreuves
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleVerifierConflits} className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Vérifier Conflits
          </Button>
          <Button onClick={handleAffectationAuto} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Affectation Auto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Salles Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{disponibles}</div>
            <p className="text-xs text-muted-foreground mt-1">Sur {totalSalles} au total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Capacité Totale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{capaciteTotale}</div>
            <p className="text-xs text-muted-foreground mt-1">Places disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidats Affectés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{candidatsAffectes}</div>
            <p className="text-xs text-muted-foreground mt-1">Sur 254 candidats</p>
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
      </div>

      {/* Alert Conflits */}
      {showConflits && planning.some(p => p.conflit) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Conflits de Capacité Détectés</AlertTitle>
          <AlertDescription>
            {planning.filter(p => p.conflit).map(p => (
              <div key={p.id} className="flex items-center justify-between mt-2">
                <span>{p.epreuve} ({p.jour}): {p.candidats} candidats pour {p.capacite} places</span>
                <Button size="sm" variant="outline" onClick={() => handleResolveConflict(p.id)}>
                  Résoudre
                </Button>
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="salles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="salles">Salles Disponibles</TabsTrigger>
          <TabsTrigger value="planning">Planning Épreuves</TabsTrigger>
          <TabsTrigger value="affectations">Affectations Candidats</TabsTrigger>
          <TabsTrigger value="plan">Plan de Salle</TabsTrigger>
        </TabsList>

        <TabsContent value="salles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Salles</CardTitle>
                  <CardDescription>Gestion des salles de composition et pratique</CardDescription>
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
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous statuts</SelectItem>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="En maintenance">En maintenance</SelectItem>
                      <SelectItem value="Occupée">Occupée</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous types</SelectItem>
                      <SelectItem value="Écrit">Écrit</SelectItem>
                      <SelectItem value="Pratique">Pratique</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter Salle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Nouvelle Salle</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nom de la salle</Label>
                            <Input 
                              placeholder="Ex: Salle D301"
                              value={newSalle.nom}
                              onChange={(e) => setNewSalle({...newSalle, nom: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bâtiment</Label>
                            <Select value={newSalle.batiment} onValueChange={(v) => setNewSalle({...newSalle, batiment: v})}>
                              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                              <SelectContent>
                                {batiments.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Capacité</Label>
                            <Input 
                              type="number"
                              value={newSalle.capacite}
                              onChange={(e) => setNewSalle({...newSalle, capacite: parseInt(e.target.value) || 30})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={newSalle.type} onValueChange={(v: "Écrit" | "Pratique") => setNewSalle({...newSalle, type: v})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Écrit">Écrit</SelectItem>
                                <SelectItem value="Pratique">Pratique</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Équipements</Label>
                          <div className="flex flex-wrap gap-2">
                            {equipements.map(eq => (
                              <Badge 
                                key={eq}
                                variant={newSalle.equipement.includes(eq) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleToggleEquipement(eq)}
                              >
                                {eq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleAddSalle}>Créer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salle</TableHead>
                    <TableHead>Bâtiment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Affectés</TableHead>
                    <TableHead>Taux Remplissage</TableHead>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalles.map((salle) => {
                    const tauxRemplissage = (salle.affectes / salle.capacite) * 100;
                    
                    return (
                      <TableRow key={salle.id}>
                        <TableCell className="font-medium">{salle.nom}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{salle.batiment}</TableCell>
                        <TableCell>
                          <Badge variant={salle.type === "Pratique" ? "secondary" : "outline"}>
                            {salle.type}
                          </Badge>
                        </TableCell>
                        <TableCell><span className="font-medium">{salle.capacite}</span> places</TableCell>
                        <TableCell>
                          <span className={salle.affectes === salle.capacite ? "text-orange-600 font-medium" : ""}>
                            {salle.affectes}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={tauxRemplissage} className="w-20" />
                            <span className="text-xs text-muted-foreground">{Math.round(tauxRemplissage)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {salle.equipement.slice(0, 2).map((eq, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{eq}</Badge>
                            ))}
                            {salle.equipement.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{salle.equipement.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              salle.statut === "Disponible" 
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" 
                                : salle.statut === "En maintenance"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {salle.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedSalle(salle.nom.replace("Salle ", ""));
                                setIsPlanDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => { setSelectedSalleObj(salle); setIsEditDialogOpen(true); }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive"
                              onClick={() => { setSelectedSalleObj(salle); setIsDeleteDialogOpen(true); }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredSalles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune salle trouvée avec ces critères
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Configuration des Salles</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Chaque salle peut être configurée avec :
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>Capacité maximale pour épreuves écrites et pratiques</li>
                      <li>Équipements disponibles (climatisation, vidéoprojecteur, etc.)</li>
                      <li>Type d'épreuve autorisé (théorique ou pratique)</li>
                      <li>Indisponibilités pour maintenance</li>
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
                Planning des Épreuves
              </CardTitle>
              <CardDescription>Vue d'ensemble des épreuves avec affectation des salles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Jour</TableHead>
                    <TableHead>Épreuve</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Salles Affectées</TableHead>
                    <TableHead>Candidats</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planning.map((plan) => {
                    const surcharge = plan.candidats > plan.capacite;
                    
                    return (
                      <TableRow 
                        key={plan.id}
                        className={plan.conflit ? "bg-orange-50 dark:bg-orange-950/20" : ""}
                      >
                        <TableCell className="font-medium">{plan.jour}</TableCell>
                        <TableCell>{plan.epreuve}</TableCell>
                        <TableCell className="text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {plan.horaire}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {plan.salles.map(salle => (
                              <Badge key={salle} variant="outline" className="text-xs">{salle}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={surcharge ? "text-orange-600 font-medium" : "font-medium"}>
                            {plan.candidats}
                          </span>
                        </TableCell>
                        <TableCell>{plan.capacite}</TableCell>
                        <TableCell>
                          {plan.conflit ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Surcharge
                            </Badge>
                          ) : (
                            <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-950">
                              <CheckCircle className="h-3 w-3" />
                              OK
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {plan.conflit ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResolveConflict(plan.id)}
                            >
                              Résoudre
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">Gérer</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affectations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Affectations des Candidats</CardTitle>
                  <CardDescription>Répartition des candidats par salle et table</CardDescription>
                </div>
                <Select value={selectedSalle} onValueChange={setSelectedSalle}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {salles.filter(s => s.statut === "Disponible").map(s => (
                      <SelectItem key={s.id} value={s.nom.replace("Salle ", "")}>{s.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salle</TableHead>
                    <TableHead>N° Table</TableHead>
                    <TableHead>Candidat</TableHead>
                    <TableHead>N° Candidat</TableHead>
                    <TableHead>Épreuve</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salleAffectations.length > 0 ? salleAffectations.map((aff, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{aff.salle}</TableCell>
                      <TableCell className="font-mono">{aff.table}</TableCell>
                      <TableCell className="font-medium">{aff.candidat}</TableCell>
                      <TableCell className="font-mono text-sm">{aff.numero}</TableCell>
                      <TableCell>{aff.epreuve}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucune affectation pour cette salle. Cliquez sur "Affectation Auto" pour générer.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Plan de la Salle {selectedSalle}
                  </CardTitle>
                  <CardDescription>Vue interactive du placement des candidats</CardDescription>
                </div>
                <Select value={selectedSalle} onValueChange={setSelectedSalle}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {salles.filter(s => s.statut === "Disponible").map(s => (
                      <SelectItem key={s.id} value={s.nom.replace("Salle ", "")}>{s.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-center mb-4 p-2 bg-background rounded border">
                  <span className="text-sm font-medium">TABLEAU</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const affectation = salleAffectations.find(a => a.table === i + 1);
                    return (
                      <div 
                        key={i}
                        className={`p-2 rounded border text-center text-xs ${
                          affectation 
                            ? "bg-primary/10 border-primary" 
                            : "bg-background border-dashed"
                        }`}
                      >
                        <div className="font-mono font-bold">{i + 1}</div>
                        {affectation && (
                          <div className="truncate text-muted-foreground mt-1">
                            {affectation.candidat.split(' ')[0]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/10 border border-primary rounded"></div>
                    <span>Occupée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-background border border-dashed rounded"></div>
                    <span>Libre</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Modifier Salle */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la Salle</DialogTitle>
          </DialogHeader>
          {selectedSalleObj && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input 
                    value={selectedSalleObj.nom}
                    onChange={(e) => setSelectedSalleObj({...selectedSalleObj, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacité</Label>
                  <Input 
                    type="number"
                    value={selectedSalleObj.capacite}
                    onChange={(e) => setSelectedSalleObj({...selectedSalleObj, capacite: parseInt(e.target.value) || 30})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select 
                  value={selectedSalleObj.statut} 
                  onValueChange={(v: Salle["statut"]) => setSelectedSalleObj({...selectedSalleObj, statut: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="En maintenance">En maintenance</SelectItem>
                    <SelectItem value="Occupée">Occupée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditSalle}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Supprimer Salle */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer la salle {selectedSalleObj?.nom} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteSalle}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Plan de Salle */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Plan de la Salle {selectedSalle}</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-center mb-4 p-2 bg-background rounded border">
              <span className="text-sm font-medium">TABLEAU</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const affectation = salleAffectations.find(a => a.table === i + 1);
                return (
                  <div 
                    key={i}
                    className={`p-2 rounded border text-center text-xs ${
                      affectation 
                        ? "bg-primary/10 border-primary" 
                        : "bg-background border-dashed"
                    }`}
                  >
                    <div className="font-mono font-bold">{i + 1}</div>
                    {affectation && (
                      <div className="truncate text-muted-foreground mt-1">
                        {affectation.numero}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>Fermer</Button>
            <Button onClick={() => toast.info("Plan exporté en PDF")}>Exporter PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
