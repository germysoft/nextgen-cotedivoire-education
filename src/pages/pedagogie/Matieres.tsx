import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Edit, Trash2, Search, FileText, ChevronDown, ChevronRight, CheckCircle, Clock, Download, Printer, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Matiere {
  id: number;
  nom: string;
  code: string;
  cycle: string;
  coefficient: number;
  heuresHebdo: number;
  type: string;
  obligatoire: boolean;
}

interface Chapitre {
  id: number;
  matiereId: number;
  titre: string;
  objectifs: string;
  progression: number;
  statut: "Non commencé" | "En cours" | "Terminé";
}

const initialMatieres: Matiere[] = [
  { id: 1, nom: "Mathématiques", code: "MATH", cycle: "Lycée", coefficient: 7, heuresHebdo: 8, type: "Scientifique", obligatoire: true },
  { id: 2, nom: "Physique-Chimie", code: "PC", cycle: "Lycée", coefficient: 6, heuresHebdo: 7, type: "Scientifique", obligatoire: true },
  { id: 3, nom: "SVT", code: "SVT", cycle: "Lycée", coefficient: 5, heuresHebdo: 5, type: "Scientifique", obligatoire: true },
  { id: 4, nom: "Français", code: "FR", cycle: "Lycée", coefficient: 4, heuresHebdo: 6, type: "Littéraire", obligatoire: true },
  { id: 5, nom: "Anglais", code: "ANG", cycle: "Lycée", coefficient: 3, heuresHebdo: 4, type: "Linguistique", obligatoire: true },
  { id: 6, nom: "Histoire-Géographie", code: "HG", cycle: "Lycée", coefficient: 2, heuresHebdo: 4, type: "Humanités", obligatoire: true },
  { id: 7, nom: "EPS", code: "EPS", cycle: "Lycée", coefficient: 2, heuresHebdo: 3, type: "Sport", obligatoire: true },
  { id: 8, nom: "Philosophie", code: "PHILO", cycle: "Lycée", coefficient: 5, heuresHebdo: 4, type: "Humanités", obligatoire: true },
];

const initialChapitres: Chapitre[] = [
  { id: 1, matiereId: 1, titre: "Suites numériques", objectifs: "Maîtriser les suites arithmétiques et géométriques", progression: 100, statut: "Terminé" },
  { id: 2, matiereId: 1, titre: "Fonctions exponentielles", objectifs: "Étudier les propriétés et applications", progression: 75, statut: "En cours" },
  { id: 3, matiereId: 1, titre: "Fonctions logarithmes", objectifs: "Comprendre le logarithme népérien", progression: 30, statut: "En cours" },
  { id: 4, matiereId: 1, titre: "Intégrales", objectifs: "Calculer des aires et primitives", progression: 0, statut: "Non commencé" },
  { id: 5, matiereId: 2, titre: "Mécanique newtonienne", objectifs: "Appliquer les lois de Newton", progression: 100, statut: "Terminé" },
  { id: 6, matiereId: 2, titre: "Électricité", objectifs: "Circuits et lois fondamentales", progression: 60, statut: "En cours" },
  { id: 7, matiereId: 3, titre: "La cellule", objectifs: "Structure et fonctionnement cellulaire", progression: 100, statut: "Terminé" },
  { id: 8, matiereId: 3, titre: "Génétique", objectifs: "Hérédité et mutations", progression: 45, statut: "En cours" },
];

const programmes = [
  { matiere: "Mathématiques Tle D", chapitres: 12, progression: 75, heuresRestantes: 24 },
  { matiere: "Physique-Chimie Tle D", chapitres: 10, progression: 68, heuresRestantes: 28 },
  { matiere: "SVT 1ère D", chapitres: 8, progression: 82, heuresRestantes: 15 },
  { matiere: "Français 2nde", chapitres: 15, progression: 55, heuresRestantes: 35 },
];

export default function Matieres() {
  const [matieres, setMatieres] = useState<Matiere[]>(initialMatieres);
  const [chapitres, setChapitres] = useState<Chapitre[]>(initialChapitres);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChapitreDialogOpen, setIsChapitreDialogOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);
  const [selectedMatiereForChapitre, setSelectedMatiereForChapitre] = useState<number | null>(null);

  const [matiereForm, setMatiereForm] = useState({
    nom: "", code: "", cycle: "", coefficient: "", heuresHebdo: "", type: "", obligatoire: true
  });

  const [chapitreForm, setChapitreForm] = useState({
    titre: "", objectifs: ""
  });

  const handleSaveMatiere = () => {
    if (editingMatiere) {
      setMatieres(prev => prev.map(m => 
        m.id === editingMatiere.id ? {
          ...m,
          ...matiereForm,
          coefficient: Number(matiereForm.coefficient),
          heuresHebdo: Number(matiereForm.heuresHebdo),
        } : m
      ));
      toast({ title: "Matière modifiée", description: "Les modifications ont été enregistrées" });
    } else {
      const newMatiere: Matiere = {
        id: Math.max(...matieres.map(m => m.id)) + 1,
        nom: matiereForm.nom,
        code: matiereForm.code,
        cycle: matiereForm.cycle,
        coefficient: Number(matiereForm.coefficient),
        heuresHebdo: Number(matiereForm.heuresHebdo),
        type: matiereForm.type,
        obligatoire: matiereForm.obligatoire,
      };
      setMatieres(prev => [...prev, newMatiere]);
      toast({ title: "Matière créée", description: "La nouvelle matière a été ajoutée" });
    }
    setIsDialogOpen(false);
    setEditingMatiere(null);
    setMatiereForm({ nom: "", code: "", cycle: "", coefficient: "", heuresHebdo: "", type: "", obligatoire: true });
  };

  const handleAddChapitre = () => {
    if (!selectedMatiereForChapitre) return;
    
    const newChapitre: Chapitre = {
      id: Math.max(...chapitres.map(c => c.id), 0) + 1,
      matiereId: selectedMatiereForChapitre,
      titre: chapitreForm.titre,
      objectifs: chapitreForm.objectifs,
      progression: 0,
      statut: "Non commencé",
    };
    setChapitres(prev => [...prev, newChapitre]);
    toast({ title: "Chapitre ajouté", description: "Le nouveau chapitre a été ajouté au programme" });
    setIsChapitreDialogOpen(false);
    setChapitreForm({ titre: "", objectifs: "" });
  };

  const handleUpdateChapitreStatus = (chapitreId: number, newStatut: Chapitre["statut"]) => {
    setChapitres(prev => prev.map(c => 
      c.id === chapitreId ? {
        ...c,
        statut: newStatut,
        progression: newStatut === "Terminé" ? 100 : newStatut === "En cours" ? 50 : 0,
      } : c
    ));
    toast({ title: "Statut mis à jour", description: `Le chapitre est maintenant "${newStatut}"` });
  };

  const handleEdit = (matiere: Matiere) => {
    setEditingMatiere(matiere);
    setMatiereForm({
      nom: matiere.nom,
      code: matiere.code,
      cycle: matiere.cycle,
      coefficient: String(matiere.coefficient),
      heuresHebdo: String(matiere.heuresHebdo),
      type: matiere.type,
      obligatoire: matiere.obligatoire,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setMatieres(prev => prev.filter(m => m.id !== id));
    setChapitres(prev => prev.filter(c => c.matiereId !== id));
    toast({ title: "Matière supprimée", description: "La matière et ses chapitres ont été supprimés" });
  };

  const filteredMatieres = matieres.filter(m => 
    m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalHeures = matieres.reduce((sum, m) => sum + m.heuresHebdo, 0);
  const avgProgression = Math.round(programmes.reduce((sum, p) => sum + p.progression, 0) / programmes.length);

  // PDF Export - Liste des matières
  const handleExportMatieresPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liste des Matières", 14, 22);
    doc.setFontSize(10);
    doc.text(`Total: ${matieres.length} matières | ${totalHeures}h/semaine`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [["Matière", "Code", "Cycle", "Type", "Coefficient", "Heures/sem", "Statut"]],
      body: matieres.map(m => [
        m.nom,
        m.code,
        m.cycle,
        m.type,
        `${m.coefficient}`,
        `${m.heuresHebdo}h`,
        m.obligatoire ? "Obligatoire" : "Optionnelle"
      ]),
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("liste-matieres.pdf");
    toast({ title: "Export réussi", description: "Liste des matières exportée en PDF" });
  };

  // PDF Export - Programmes et progression
  const handleExportProgrammesPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Progression des Programmes", 14, 22);
    doc.setFontSize(10);
    doc.text(`Progression moyenne: ${avgProgression}%`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [["Programme", "Chapitres", "Progression", "Heures Restantes"]],
      body: programmes.map(p => [
        p.matiere,
        `${p.chapitres}`,
        `${p.progression}%`,
        `${p.heuresRestantes}h`
      ]),
      headStyles: { fillColor: [16, 185, 129] },
    });

    // Ajouter les chapitres par matière
    matieres.forEach((matiere, index) => {
      const matChapitres = chapitres.filter(c => c.matiereId === matiere.id);
      if (matChapitres.length > 0) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 10,
          head: [[`${matiere.nom} - Chapitres`]],
          body: matChapitres.map(c => [
            `${c.titre} - ${c.statut} (${c.progression}%)`
          ]),
          headStyles: { fillColor: [139, 92, 246] },
        });
      }
    });

    doc.save("programmes-progression.pdf");
    toast({ title: "Export réussi", description: "Programmes exportés en PDF" });
  };

  // Dupliquer une matière
  const handleDuplicateMatiere = (matiere: Matiere) => {
    const newMatiere: Matiere = {
      ...matiere,
      id: Math.max(...matieres.map(m => m.id)) + 1,
      nom: `${matiere.nom} (copie)`,
      code: `${matiere.code}_CPY`
    };
    setMatieres([...matieres, newMatiere]);
    toast({ title: "Matière dupliquée", description: `${matiere.nom} a été dupliquée` });
  };

  // Supprimer un chapitre
  const handleDeleteChapitre = (chapitreId: number) => {
    setChapitres(prev => prev.filter(c => c.id !== chapitreId));
    toast({ title: "Chapitre supprimé", description: "Le chapitre a été supprimé" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matières & Programmes</h1>
          <p className="text-muted-foreground">Gestion des disciplines et contenus pédagogiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportMatieresPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exporter Matières
          </Button>
          <Button variant="outline" onClick={handleExportProgrammesPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Exporter Programmes
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingMatiere(null);
              setMatiereForm({ nom: "", code: "", cycle: "", coefficient: "", heuresHebdo: "", type: "", obligatoire: true });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Matière
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMatiere ? "Modifier la Matière" : "Nouvelle Matière"}</DialogTitle>
              </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de la matière</Label>
                  <Input 
                    placeholder="Ex: Mathématiques" 
                    value={matiereForm.nom}
                    onChange={(e) => setMatiereForm({...matiereForm, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input 
                    placeholder="Ex: MATH" 
                    value={matiereForm.code}
                    onChange={(e) => setMatiereForm({...matiereForm, code: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cycle</Label>
                  <Select value={matiereForm.cycle} onValueChange={(v) => setMatiereForm({...matiereForm, cycle: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Collège">Collège</SelectItem>
                      <SelectItem value="Lycée">Lycée</SelectItem>
                      <SelectItem value="Tous">Tous cycles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={matiereForm.type} onValueChange={(v) => setMatiereForm({...matiereForm, type: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scientifique">Scientifique</SelectItem>
                      <SelectItem value="Littéraire">Littéraire</SelectItem>
                      <SelectItem value="Linguistique">Linguistique</SelectItem>
                      <SelectItem value="Humanités">Humanités</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coefficient</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 5" 
                    value={matiereForm.coefficient}
                    onChange={(e) => setMatiereForm({...matiereForm, coefficient: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heures/semaine</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 4" 
                    value={matiereForm.heuresHebdo}
                    onChange={(e) => setMatiereForm({...matiereForm, heuresHebdo: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="obligatoire"
                  checked={matiereForm.obligatoire}
                  onChange={(e) => setMatiereForm({...matiereForm, obligatoire: e.target.checked})}
                />
                <Label htmlFor="obligatoire">Matière obligatoire</Label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSaveMatiere}>
                  {editingMatiere ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matières Total</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matieres.length}</div>
            <p className="text-xs text-muted-foreground">Tous cycles confondus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programmes Actifs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programmes.length}</div>
            <p className="text-xs text-muted-foreground">Matière-Niveau</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHeures}h</div>
            <p className="text-xs text-muted-foreground">Par semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgression}%</div>
            <Progress value={avgProgression} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matieres" className="space-y-6">
        <TabsList>
          <TabsTrigger value="matieres">Matières</TabsTrigger>
          <TabsTrigger value="programmes">Programmes</TabsTrigger>
          <TabsTrigger value="chapitres">Gestion Chapitres</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
        </TabsList>

        <TabsContent value="matieres">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Matières</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher une matière..." 
                    className="pl-10 w-64"
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
                    <TableHead>Matière</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Heures/sem</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatieres.map((matiere) => (
                    <TableRow key={matiere.id}>
                      <TableCell className="font-medium">{matiere.nom}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{matiere.code}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{matiere.cycle}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{matiere.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-base px-3">{matiere.coefficient}</Badge>
                      </TableCell>
                      <TableCell>{matiere.heuresHebdo}h</TableCell>
                      <TableCell>
                        <Badge variant={matiere.obligatoire ? "default" : "secondary"}>
                          {matiere.obligatoire ? "Obligatoire" : "Optionnelle"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleDuplicateMatiere(matiere)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(matiere)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(matiere.id)}>
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="programmes">
          <Card>
            <CardHeader>
              <CardTitle>Progression des Programmes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {programmes.map((prog, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{prog.matiere}</CardTitle>
                        <Badge variant="outline">{prog.chapitres} chapitres</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Progression</span>
                          <span className="text-lg font-bold">{prog.progression}%</span>
                        </div>
                        <Progress 
                          value={prog.progression} 
                          className={`h-3 ${
                            prog.progression >= 75 ? "[&>div]:bg-green-500" :
                            prog.progression >= 50 ? "[&>div]:bg-blue-500" :
                            "[&>div]:bg-orange-500"
                          }`}
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Heures restantes: {prog.heuresRestantes}h</span>
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-3 w-3" />
                            Voir Programme
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chapitres">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestion des Chapitres par Matière</CardTitle>
                <Dialog open={isChapitreDialogOpen} onOpenChange={setIsChapitreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter Chapitre
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouveau Chapitre</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Matière</Label>
                        <Select onValueChange={(v) => setSelectedMatiereForChapitre(Number(v))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une matière" />
                          </SelectTrigger>
                          <SelectContent>
                            {matieres.map(m => (
                              <SelectItem key={m.id} value={String(m.id)}>{m.nom}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Titre du chapitre</Label>
                        <Input 
                          placeholder="Ex: Les fonctions dérivées"
                          value={chapitreForm.titre}
                          onChange={(e) => setChapitreForm({...chapitreForm, titre: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Objectifs pédagogiques</Label>
                        <Input 
                          placeholder="Ex: Maîtriser le calcul des dérivées"
                          value={chapitreForm.objectifs}
                          onChange={(e) => setChapitreForm({...chapitreForm, objectifs: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsChapitreDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleAddChapitre}>Ajouter</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-2">
                {matieres.map(matiere => {
                  const matChapitres = chapitres.filter(c => c.matiereId === matiere.id);
                  if (matChapitres.length === 0) return null;
                  
                  return (
                    <AccordionItem key={matiere.id} value={String(matiere.id)} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4" />
                          <span className="font-semibold">{matiere.nom}</span>
                          <Badge variant="outline">{matChapitres.length} chapitres</Badge>
                          <Badge variant="secondary">
                            {Math.round(matChapitres.reduce((sum, c) => sum + c.progression, 0) / matChapitres.length)}% complété
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {matChapitres.map(chapitre => (
                            <div key={chapitre.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {chapitre.statut === "Terminé" ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : chapitre.statut === "En cours" ? (
                                    <Clock className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                                  )}
                                  <span className="font-medium">{chapitre.titre}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{chapitre.objectifs}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-24">
                                  <Progress value={chapitre.progression} className="h-2" />
                                </div>
                                <Select 
                                  value={chapitre.statut} 
                                  onValueChange={(v) => handleUpdateChapitreStatus(chapitre.id, v as Chapitre["statut"])}
                                >
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Non commencé">Non commencé</SelectItem>
                                    <SelectItem value="En cours">En cours</SelectItem>
                                    <SelectItem value="Terminé">Terminé</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horaires">
          <Card>
            <CardHeader>
              <CardTitle>Répartition Horaire Hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { categorie: "Sciences", heures: 25, percent: 32, color: "bg-blue-500" },
                  { categorie: "Littérature", heures: 18, percent: 23, color: "bg-purple-500" },
                  { categorie: "Langues", heures: 15, percent: 19, color: "bg-green-500" },
                  { categorie: "Humanités", heures: 12, percent: 15, color: "bg-yellow-500" },
                  { categorie: "Sport & Arts", heures: 8, percent: 11, color: "bg-orange-500" },
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                        <span className="font-medium">{cat.categorie}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{cat.heures}h</span>
                        <Badge variant="outline">{cat.percent}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={cat.color} style={{ width: `${cat.percent}%`, height: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}