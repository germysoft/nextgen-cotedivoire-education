import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, TrendingUp, Award, Calendar, Search, Edit, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Affectation {
  id: number;
  nom: string;
  poste: string;
  classe: string;
  statut: string;
  date_debut: string;
  anciennete: string;
  matiere?: string;
}

interface Promotion {
  id: number;
  nom: string;
  ancien_poste: string;
  nouveau_poste: string;
  date: string;
  raison: string;
  decision_reference?: string;
  observations?: string;
}

interface Evaluation {
  id: number;
  nom: string;
  poste: string;
  note: number;
  date: string;
  commentaire: string;
  competences_pedagogiques?: number;
  competences_relationnelles?: number;
  ponctualite?: number;
  engagement?: number;
  recommandations?: string;
}

const initialAffectations: Affectation[] = [
  { id: 1, nom: "KOUASSI Jean", poste: "Professeur Mathématiques", classe: "3ème A, B", statut: "active", date_debut: "2024-09-01", anciennete: "5 ans", matiere: "Mathématiques" },
  { id: 2, nom: "DIALLO Fatou", poste: "Professeur Français", classe: "4ème A, 5ème B", statut: "active", date_debut: "2023-09-01", anciennete: "2 ans", matiere: "Français" },
  { id: 3, nom: "TRAORE Mamadou", poste: "Professeur Physique", classe: "Terminale S", statut: "active", date_debut: "2022-09-01", anciennete: "3 ans", matiere: "Physique-Chimie" },
  { id: 4, nom: "KONE Marie", poste: "Professeur Anglais", classe: "6ème A, B, C", statut: "active", date_debut: "2024-01-15", anciennete: "1 an", matiere: "Anglais" },
];

const initialPromotions: Promotion[] = [
  { id: 1, nom: "SORO Ibrahim", ancien_poste: "Surveillant", nouveau_poste: "Censeur Adjoint", date: "2024-09-01", raison: "Mérite", decision_reference: "DEC-2024-001", observations: "Excellente performance sur les 3 dernières années" },
  { id: 2, nom: "BAMBA Aya", ancien_poste: "Prof. Français", nouveau_poste: "Prof. Principal 3ème", date: "2024-09-01", raison: "Ancienneté", decision_reference: "DEC-2024-002", observations: "10 ans d'expérience dans l'établissement" },
];

const initialEvaluations: Evaluation[] = [
  { id: 1, nom: "KOUASSI Jean", poste: "Prof. Maths", note: 18, date: "2024-06-15", commentaire: "Excellent pédagogue", competences_pedagogiques: 19, competences_relationnelles: 17, ponctualite: 18, engagement: 18, recommandations: "Encourager à mentorer les nouveaux enseignants" },
  { id: 2, nom: "DIALLO Fatou", poste: "Prof. Français", note: 16, date: "2024-06-15", commentaire: "Très bon engagement", competences_pedagogiques: 16, competences_relationnelles: 17, ponctualite: 15, engagement: 16, recommandations: "Formation continue en méthodologie" },
  { id: 3, nom: "TRAORE Mamadou", poste: "Prof. Physique", note: 17, date: "2024-06-15", commentaire: "Très investi", competences_pedagogiques: 17, competences_relationnelles: 18, ponctualite: 16, engagement: 17, recommandations: "Proposer pour la coordination pédagogique" },
];

const Affectations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for data
  const [affectations, setAffectations] = useState<Affectation[]>(initialAffectations);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  
  // Edit dialogs state
  const [editAffectationOpen, setEditAffectationOpen] = useState(false);
  const [editPromotionOpen, setEditPromotionOpen] = useState(false);
  const [editEvaluationOpen, setEditEvaluationOpen] = useState(false);
  const [newPromotionOpen, setNewPromotionOpen] = useState(false);
  const [newEvaluationOpen, setNewEvaluationOpen] = useState(false);
  
  // Selected items for editing
  const [selectedAffectation, setSelectedAffectation] = useState<Affectation | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    poste: "",
    classe: "",
    matiere: "",
    date_debut: "",
    statut: "active"
  });
  
  const [promotionForm, setPromotionForm] = useState({
    nom: "",
    ancien_poste: "",
    nouveau_poste: "",
    date: "",
    raison: "",
    decision_reference: "",
    observations: ""
  });
  
  const [evaluationForm, setEvaluationForm] = useState({
    nom: "",
    poste: "",
    note: 0,
    date: "",
    commentaire: "",
    competences_pedagogiques: 0,
    competences_relationnelles: 0,
    ponctualite: 0,
    engagement: 0,
    recommandations: ""
  });

  const handleNewAffectation = () => {
    toast.success("Nouvelle affectation créée avec succès");
    setIsDialogOpen(false);
  };
  
  // Open edit affectation dialog
  const handleEditAffectation = (affectation: Affectation) => {
    setSelectedAffectation(affectation);
    setEditForm({
      poste: affectation.poste,
      classe: affectation.classe,
      matiere: affectation.matiere || "",
      date_debut: affectation.date_debut,
      statut: affectation.statut
    });
    setEditAffectationOpen(true);
  };
  
  // Save affectation edit
  const handleSaveAffectation = () => {
    if (!selectedAffectation) return;
    
    setAffectations(prev => prev.map(a => 
      a.id === selectedAffectation.id 
        ? { ...a, ...editForm }
        : a
    ));
    
    toast.success(`Affectation de ${selectedAffectation.nom} mise à jour avec succès`);
    setEditAffectationOpen(false);
    setSelectedAffectation(null);
  };
  
  // View promotion details
  const handleViewPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setPromotionForm({
      nom: promotion.nom,
      ancien_poste: promotion.ancien_poste,
      nouveau_poste: promotion.nouveau_poste,
      date: promotion.date,
      raison: promotion.raison,
      decision_reference: promotion.decision_reference || "",
      observations: promotion.observations || ""
    });
    setEditPromotionOpen(true);
  };
  
  // Save promotion edit
  const handleSavePromotion = () => {
    if (!selectedPromotion) return;
    
    setPromotions(prev => prev.map(p => 
      p.id === selectedPromotion.id 
        ? { ...p, ...promotionForm }
        : p
    ));
    
    toast.success(`Promotion de ${selectedPromotion.nom} mise à jour avec succès`);
    setEditPromotionOpen(false);
    setSelectedPromotion(null);
  };
  
  // Create new promotion
  const handleCreatePromotion = () => {
    const newPromotion: Promotion = {
      id: Math.max(...promotions.map(p => p.id)) + 1,
      ...promotionForm
    };
    
    setPromotions(prev => [...prev, newPromotion]);
    toast.success(`Nouvelle promotion créée pour ${promotionForm.nom}`);
    setNewPromotionOpen(false);
    setPromotionForm({
      nom: "",
      ancien_poste: "",
      nouveau_poste: "",
      date: "",
      raison: "",
      decision_reference: "",
      observations: ""
    });
  };
  
  // View evaluation details
  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setEvaluationForm({
      nom: evaluation.nom,
      poste: evaluation.poste,
      note: evaluation.note,
      date: evaluation.date,
      commentaire: evaluation.commentaire,
      competences_pedagogiques: evaluation.competences_pedagogiques || 0,
      competences_relationnelles: evaluation.competences_relationnelles || 0,
      ponctualite: evaluation.ponctualite || 0,
      engagement: evaluation.engagement || 0,
      recommandations: evaluation.recommandations || ""
    });
    setEditEvaluationOpen(true);
  };
  
  // Save evaluation edit
  const handleSaveEvaluation = () => {
    if (!selectedEvaluation) return;
    
    const avgNote = Math.round(
      (evaluationForm.competences_pedagogiques + 
       evaluationForm.competences_relationnelles + 
       evaluationForm.ponctualite + 
       evaluationForm.engagement) / 4
    );
    
    setEvaluations(prev => prev.map(e => 
      e.id === selectedEvaluation.id 
        ? { ...e, ...evaluationForm, note: avgNote }
        : e
    ));
    
    toast.success(`Évaluation de ${selectedEvaluation.nom} mise à jour avec succès`);
    setEditEvaluationOpen(false);
    setSelectedEvaluation(null);
  };
  
  // Create new evaluation
  const handleCreateEvaluation = () => {
    const avgNote = Math.round(
      (evaluationForm.competences_pedagogiques + 
       evaluationForm.competences_relationnelles + 
       evaluationForm.ponctualite + 
       evaluationForm.engagement) / 4
    );
    
    const newEvaluation: Evaluation = {
      id: Math.max(...evaluations.map(e => e.id)) + 1,
      ...evaluationForm,
      note: avgNote
    };
    
    setEvaluations(prev => [...prev, newEvaluation]);
    toast.success(`Nouvelle évaluation créée pour ${evaluationForm.nom}`);
    setNewEvaluationOpen(false);
    setEvaluationForm({
      nom: "",
      poste: "",
      note: 0,
      date: "",
      commentaire: "",
      competences_pedagogiques: 0,
      competences_relationnelles: 0,
      ponctualite: 0,
      engagement: 0,
      recommandations: ""
    });
  };
  
  // Delete handlers
  const handleDeleteAffectation = (id: number) => {
    setAffectations(prev => prev.filter(a => a.id !== id));
    toast.success("Affectation supprimée");
    setEditAffectationOpen(false);
  };
  
  const handleDeletePromotion = (id: number) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    toast.success("Promotion supprimée");
    setEditPromotionOpen(false);
  };
  
  const handleDeleteEvaluation = (id: number) => {
    setEvaluations(prev => prev.filter(e => e.id !== id));
    toast.success("Évaluation supprimée");
    setEditEvaluationOpen(false);
  };
  
  // Filter affectations by search
  const filteredAffectations = affectations.filter(a => 
    a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.classe.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate average note
  const avgNote = evaluations.length > 0 
    ? Math.round(evaluations.reduce((sum, e) => sum + e.note, 0) / evaluations.length * 10) / 10
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Affectations & Promotions</h1>
          <p className="text-muted-foreground mt-2">Gestion des affectations, promotions et évaluations du personnel</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvelle Affectation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Affectation</DialogTitle>
              <DialogDescription>Affecter un membre du personnel à un poste</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Personnel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">KOUASSI Jean</SelectItem>
                      <SelectItem value="2">DIALLO Fatou</SelectItem>
                      <SelectItem value="3">TRAORE Mamadou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prof">Professeur</SelectItem>
                      <SelectItem value="censeur">Censeur</SelectItem>
                      <SelectItem value="surveillant">Surveillant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matière</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maths">Mathématiques</SelectItem>
                      <SelectItem value="francais">Français</SelectItem>
                      <SelectItem value="anglais">Anglais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Classes</Label>
                  <Input placeholder="Ex: 3ème A, B" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleNewAffectation}>Créer l'Affectation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affectations Actives</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affectations.length}</div>
            <p className="text-xs text-muted-foreground">Personnel en poste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotions Annuelles</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
            <p className="text-xs text-muted-foreground">Complétées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNote}/20</div>
            <p className="text-xs text-muted-foreground">Évaluation personnel</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="affectations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affectations">Affectations</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="affectations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Affectations</CardTitle>
                  <CardDescription>Personnel actuellement en poste</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Date Début</TableHead>
                    <TableHead>Ancienneté</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffectations.map((affectation) => (
                    <TableRow key={affectation.id}>
                      <TableCell className="font-medium">{affectation.nom}</TableCell>
                      <TableCell>{affectation.poste}</TableCell>
                      <TableCell>{affectation.classe}</TableCell>
                      <TableCell>{affectation.date_debut}</TableCell>
                      <TableCell>{affectation.anciennete}</TableCell>
                      <TableCell>
                        <Badge variant={affectation.statut === "active" ? "default" : "secondary"}>
                          {affectation.statut === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAffectation(affectation)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historique des Promotions</CardTitle>
                  <CardDescription>Évolution de carrière du personnel</CardDescription>
                </div>
                <Button onClick={() => {
                  setPromotionForm({
                    nom: "",
                    ancien_poste: "",
                    nouveau_poste: "",
                    date: new Date().toISOString().split('T')[0],
                    raison: "",
                    decision_reference: "",
                    observations: ""
                  });
                  setNewPromotionOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Promotion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ancien Poste</TableHead>
                    <TableHead>Nouveau Poste</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.nom}</TableCell>
                      <TableCell>{promotion.ancien_poste}</TableCell>
                      <TableCell>
                        <Badge variant="default">{promotion.nouveau_poste}</Badge>
                      </TableCell>
                      <TableCell>{promotion.date}</TableCell>
                      <TableCell>{promotion.raison}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPromotion(promotion)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Évaluations du Personnel</CardTitle>
                  <CardDescription>Performances et évaluations annuelles</CardDescription>
                </div>
                <Button onClick={() => {
                  setEvaluationForm({
                    nom: "",
                    poste: "",
                    note: 0,
                    date: new Date().toISOString().split('T')[0],
                    commentaire: "",
                    competences_pedagogiques: 15,
                    competences_relationnelles: 15,
                    ponctualite: 15,
                    engagement: 15,
                    recommandations: ""
                  });
                  setNewEvaluationOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Évaluation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.nom}</TableCell>
                      <TableCell>{evaluation.poste}</TableCell>
                      <TableCell>
                        <Badge variant={evaluation.note >= 16 ? "default" : evaluation.note >= 12 ? "secondary" : "destructive"}>
                          {evaluation.note}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{evaluation.commentaire}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewEvaluation(evaluation)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Voir Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Affectation Dialog */}
      <Dialog open={editAffectationOpen} onOpenChange={setEditAffectationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'Affectation</DialogTitle>
            <DialogDescription>
              Modifier les informations d'affectation de {selectedAffectation?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Poste</Label>
                <Select 
                  value={editForm.poste.includes("Professeur") ? "prof" : editForm.poste.toLowerCase()}
                  onValueChange={(value) => {
                    const postes: Record<string, string> = {
                      prof: "Professeur",
                      censeur: "Censeur",
                      surveillant: "Surveillant",
                      directeur: "Directeur"
                    };
                    setEditForm(prev => ({ ...prev, poste: postes[value] || value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prof">Professeur</SelectItem>
                    <SelectItem value="censeur">Censeur</SelectItem>
                    <SelectItem value="surveillant">Surveillant</SelectItem>
                    <SelectItem value="directeur">Directeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Matière</Label>
                <Select 
                  value={editForm.matiere.toLowerCase().replace("-", "").replace(" ", "")}
                  onValueChange={(value) => {
                    const matieres: Record<string, string> = {
                      mathematiques: "Mathématiques",
                      francais: "Français",
                      anglais: "Anglais",
                      physiquechimie: "Physique-Chimie",
                      svt: "SVT",
                      histoiregeo: "Histoire-Géographie"
                    };
                    setEditForm(prev => ({ ...prev, matiere: matieres[value] || value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematiques">Mathématiques</SelectItem>
                    <SelectItem value="francais">Français</SelectItem>
                    <SelectItem value="anglais">Anglais</SelectItem>
                    <SelectItem value="physiquechimie">Physique-Chimie</SelectItem>
                    <SelectItem value="svt">SVT</SelectItem>
                    <SelectItem value="histoiregeo">Histoire-Géographie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Classes</Label>
                <Input 
                  placeholder="Ex: 3ème A, B" 
                  value={editForm.classe}
                  onChange={(e) => setEditForm(prev => ({ ...prev, classe: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input 
                  type="date" 
                  value={editForm.date_debut}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date_debut: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select 
                value={editForm.statut}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, statut: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="conge">En congé</SelectItem>
                  <SelectItem value="mutation">En mutation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => selectedAffectation && handleDeleteAffectation(selectedAffectation.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditAffectationOpen(false)}>Annuler</Button>
              <Button onClick={handleSaveAffectation}>Enregistrer</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Promotion Dialog */}
      <Dialog open={editPromotionOpen} onOpenChange={setEditPromotionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Promotion</DialogTitle>
            <DialogDescription>
              Informations complètes sur la promotion de {selectedPromotion?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ancien Poste</Label>
                <Input 
                  value={promotionForm.ancien_poste}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, ancien_poste: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Nouveau Poste</Label>
                <Input 
                  value={promotionForm.nouveau_poste}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, nouveau_poste: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date d'effet</Label>
                <Input 
                  type="date" 
                  value={promotionForm.date}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Raison</Label>
                <Select 
                  value={promotionForm.raison}
                  onValueChange={(value) => setPromotionForm(prev => ({ ...prev, raison: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mérite">Mérite</SelectItem>
                    <SelectItem value="Ancienneté">Ancienneté</SelectItem>
                    <SelectItem value="Concours">Concours</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                    <SelectItem value="Réorganisation">Réorganisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Référence de la décision</Label>
              <Input 
                placeholder="Ex: DEC-2024-001"
                value={promotionForm.decision_reference}
                onChange={(e) => setPromotionForm(prev => ({ ...prev, decision_reference: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Observations</Label>
              <Textarea 
                placeholder="Notes et observations..."
                value={promotionForm.observations}
                onChange={(e) => setPromotionForm(prev => ({ ...prev, observations: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => selectedPromotion && handleDeletePromotion(selectedPromotion.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditPromotionOpen(false)}>Annuler</Button>
              <Button onClick={handleSavePromotion}>Enregistrer</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Promotion Dialog */}
      <Dialog open={newPromotionOpen} onOpenChange={setNewPromotionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Promotion</DialogTitle>
            <DialogDescription>Créer une nouvelle promotion pour un membre du personnel</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Personnel</Label>
              <Select 
                value={promotionForm.nom}
                onValueChange={(value) => setPromotionForm(prev => ({ ...prev, nom: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre du personnel..." />
                </SelectTrigger>
                <SelectContent>
                  {affectations.map(a => (
                    <SelectItem key={a.id} value={a.nom}>{a.nom} - {a.poste}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ancien Poste</Label>
                <Input 
                  value={promotionForm.ancien_poste}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, ancien_poste: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Nouveau Poste</Label>
                <Input 
                  value={promotionForm.nouveau_poste}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, nouveau_poste: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date d'effet</Label>
                <Input 
                  type="date" 
                  value={promotionForm.date}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Raison</Label>
                <Select 
                  value={promotionForm.raison}
                  onValueChange={(value) => setPromotionForm(prev => ({ ...prev, raison: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mérite">Mérite</SelectItem>
                    <SelectItem value="Ancienneté">Ancienneté</SelectItem>
                    <SelectItem value="Concours">Concours</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Référence de la décision</Label>
              <Input 
                placeholder="Ex: DEC-2024-001"
                value={promotionForm.decision_reference}
                onChange={(e) => setPromotionForm(prev => ({ ...prev, decision_reference: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Observations</Label>
              <Textarea 
                placeholder="Notes et observations..."
                value={promotionForm.observations}
                onChange={(e) => setPromotionForm(prev => ({ ...prev, observations: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPromotionOpen(false)}>Annuler</Button>
            <Button onClick={handleCreatePromotion}>Créer la Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Evaluation Dialog */}
      <Dialog open={editEvaluationOpen} onOpenChange={setEditEvaluationOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Évaluation</DialogTitle>
            <DialogDescription>
              Évaluation complète de {selectedEvaluation?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de l'évaluation</Label>
                <Input 
                  type="date" 
                  value={evaluationForm.date}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Note Globale</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={evaluationForm.note >= 16 ? "default" : evaluationForm.note >= 12 ? "secondary" : "destructive"} className="text-lg px-3 py-1">
                    {Math.round((evaluationForm.competences_pedagogiques + evaluationForm.competences_relationnelles + evaluationForm.ponctualite + evaluationForm.engagement) / 4)}/20
                  </Badge>
                  <span className="text-sm text-muted-foreground">(Calculée automatiquement)</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-semibold">Critères d'évaluation</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Compétences pédagogiques (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.competences_pedagogiques}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, competences_pedagogiques: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compétences relationnelles (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.competences_relationnelles}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, competences_relationnelles: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ponctualité et assiduité (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.ponctualite}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, ponctualite: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Engagement et initiative (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.engagement}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, engagement: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Commentaire général</Label>
              <Textarea 
                placeholder="Appréciation générale..."
                value={evaluationForm.commentaire}
                onChange={(e) => setEvaluationForm(prev => ({ ...prev, commentaire: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Recommandations</Label>
              <Textarea 
                placeholder="Recommandations pour l'amélioration..."
                value={evaluationForm.recommandations}
                onChange={(e) => setEvaluationForm(prev => ({ ...prev, recommandations: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => selectedEvaluation && handleDeleteEvaluation(selectedEvaluation.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditEvaluationOpen(false)}>Annuler</Button>
              <Button onClick={handleSaveEvaluation}>Enregistrer</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Evaluation Dialog */}
      <Dialog open={newEvaluationOpen} onOpenChange={setNewEvaluationOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Évaluation</DialogTitle>
            <DialogDescription>Créer une nouvelle évaluation pour un membre du personnel</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Personnel</Label>
                <Select 
                  value={evaluationForm.nom}
                  onValueChange={(value) => {
                    const personnel = affectations.find(a => a.nom === value);
                    setEvaluationForm(prev => ({ 
                      ...prev, 
                      nom: value,
                      poste: personnel?.poste || ""
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un membre du personnel..." />
                  </SelectTrigger>
                  <SelectContent>
                    {affectations.map(a => (
                      <SelectItem key={a.id} value={a.nom}>{a.nom} - {a.poste}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date de l'évaluation</Label>
                <Input 
                  type="date" 
                  value={evaluationForm.date}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-semibold">Critères d'évaluation</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Compétences pédagogiques (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.competences_pedagogiques}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, competences_pedagogiques: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compétences relationnelles (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.competences_relationnelles}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, competences_relationnelles: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ponctualité et assiduité (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.ponctualite}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, ponctualite: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Engagement et initiative (/20)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="20"
                    value={evaluationForm.engagement}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, engagement: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Note globale calculée: </span>
                <Badge className="ml-2">
                  {Math.round((evaluationForm.competences_pedagogiques + evaluationForm.competences_relationnelles + evaluationForm.ponctualite + evaluationForm.engagement) / 4)}/20
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Commentaire général</Label>
              <Textarea 
                placeholder="Appréciation générale..."
                value={evaluationForm.commentaire}
                onChange={(e) => setEvaluationForm(prev => ({ ...prev, commentaire: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Recommandations</Label>
              <Textarea 
                placeholder="Recommandations pour l'amélioration..."
                value={evaluationForm.recommandations}
                onChange={(e) => setEvaluationForm(prev => ({ ...prev, recommandations: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewEvaluationOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateEvaluation}>Créer l'Évaluation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Affectations;
