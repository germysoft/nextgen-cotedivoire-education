import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, Calendar, GraduationCap, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Examen {
  id: number;
  type: string;
  annee: string;
  session: string;
  niveau: string;
  statut: string;
  nbCandidats: number;
  dateDebut?: string;
  series?: string;
}

interface Matiere {
  id: number;
  examen: string;
  matiere: string;
  coefficient: number;
  type: string;
  duree: string;
  dateProgrammee?: string;
  heureProgrammee?: string;
}

const initialExamens: Examen[] = [
  { id: 1, type: "BEPC", annee: "2024-2025", session: "Session 1", niveau: "National", statut: "En cours", nbCandidats: 250, dateDebut: "2025-06-15", series: "Toutes" },
  { id: 2, type: "BAC", annee: "2024-2025", session: "Session 1", niveau: "National", statut: "Programmé", nbCandidats: 180, dateDebut: "2025-07-01", series: "D" },
  { id: 3, type: "Blanc BEPC", annee: "2024-2025", session: "Mars 2025", niveau: "Interne", statut: "Terminé", nbCandidats: 245, dateDebut: "2025-03-10", series: "Toutes" },
];

const initialMatieres: Matiere[] = [
  { id: 1, examen: "BEPC", matiere: "Français", coefficient: 3, type: "Écrit", duree: "4h", dateProgrammee: "2025-06-15", heureProgrammee: "08:00" },
  { id: 2, examen: "BEPC", matiere: "Mathématiques", coefficient: 3, type: "Écrit", duree: "3h", dateProgrammee: "2025-06-16", heureProgrammee: "08:00" },
  { id: 3, examen: "BEPC", matiere: "Anglais", coefficient: 2, type: "Écrit + Oral", duree: "2h + 15min", dateProgrammee: "2025-06-17", heureProgrammee: "08:00" },
  { id: 4, examen: "BAC", matiere: "Philosophie", coefficient: 4, type: "Écrit", duree: "4h" },
  { id: 5, examen: "BAC", matiere: "Mathématiques", coefficient: 5, type: "Écrit", duree: "4h" },
];

export default function ParametrageExamens() {
  const [examens, setExamens] = useState<Examen[]>(initialExamens);
  const [matieres, setMatieres] = useState<Matiere[]>(initialMatieres);
  const [selectedExamen, setSelectedExamen] = useState("BEPC");
  
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [isMatiereDialogOpen, setIsMatiereDialogOpen] = useState(false);
  const [isPlanningDialogOpen, setIsPlanningDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Examen | null>(null);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);
  const [planningMatiere, setPlanningMatiere] = useState<Matiere | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "exam" | "matiere"; id: number } | null>(null);

  const [examForm, setExamForm] = useState({ type: "BEPC", annee: "2024-2025", session: "", niveau: "National", dateDebut: "", series: "Toutes" });
  const [matiereForm, setMatiereForm] = useState({ matiere: "", coefficient: "1", type: "Écrit", duree: "" });
  const [planningForm, setPlanningForm] = useState({ date: "", heure: "" });

  const handleSaveExam = () => {
    if (editingExam) {
      setExamens(prev => prev.map(e => e.id === editingExam.id ? {
        ...editingExam,
        type: examForm.type, annee: examForm.annee, session: examForm.session,
        niveau: examForm.niveau, dateDebut: examForm.dateDebut, series: examForm.series
      } : e));
      toast.success("Examen modifié");
    } else {
      const newExam: Examen = {
        id: Math.max(...examens.map(e => e.id), 0) + 1,
        type: examForm.type, annee: examForm.annee, session: examForm.session,
        niveau: examForm.niveau, statut: "Programmé", nbCandidats: 0,
        dateDebut: examForm.dateDebut, series: examForm.series
      };
      setExamens(prev => [...prev, newExam]);
      toast.success("Examen créé", { description: `${examForm.type} - ${examForm.session} ajouté` });
    }
    setIsExamDialogOpen(false);
    setEditingExam(null);
    setExamForm({ type: "BEPC", annee: "2024-2025", session: "", niveau: "National", dateDebut: "", series: "Toutes" });
  };

  const handleEditExam = (exam: Examen) => {
    setEditingExam(exam);
    setExamForm({ type: exam.type, annee: exam.annee, session: exam.session, niveau: exam.niveau, dateDebut: exam.dateDebut || "", series: exam.series || "Toutes" });
    setIsExamDialogOpen(true);
  };

  const handleSaveMatiere = () => {
    if (editingMatiere) {
      setMatieres(prev => prev.map(m => m.id === editingMatiere.id ? {
        ...editingMatiere, matiere: matiereForm.matiere,
        coefficient: Number(matiereForm.coefficient), type: matiereForm.type, duree: matiereForm.duree
      } : m));
      toast.success("Matière modifiée");
    } else {
      const newMatiere: Matiere = {
        id: Math.max(...matieres.map(m => m.id), 0) + 1,
        examen: selectedExamen, matiere: matiereForm.matiere,
        coefficient: Number(matiereForm.coefficient), type: matiereForm.type, duree: matiereForm.duree
      };
      setMatieres(prev => [...prev, newMatiere]);
      toast.success("Matière ajoutée", { description: `${matiereForm.matiere} (coef. ${matiereForm.coefficient})` });
    }
    setIsMatiereDialogOpen(false);
    setEditingMatiere(null);
    setMatiereForm({ matiere: "", coefficient: "1", type: "Écrit", duree: "" });
  };

  const handleEditMatiere = (matiere: Matiere) => {
    setEditingMatiere(matiere);
    setMatiereForm({ matiere: matiere.matiere, coefficient: String(matiere.coefficient), type: matiere.type, duree: matiere.duree });
    setIsMatiereDialogOpen(true);
  };

  const handleProgrammer = (matiere: Matiere) => {
    setPlanningMatiere(matiere);
    setPlanningForm({ date: matiere.dateProgrammee || "", heure: matiere.heureProgrammee || "" });
    setIsPlanningDialogOpen(true);
  };

  const handleSavePlanning = () => {
    if (!planningMatiere) return;
    setMatieres(prev => prev.map(m => m.id === planningMatiere.id ? {
      ...m, dateProgrammee: planningForm.date, heureProgrammee: planningForm.heure
    } : m));
    toast.success("Épreuve programmée", { description: `${planningMatiere.matiere}: ${planningForm.date} à ${planningForm.heure}` });
    setIsPlanningDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "exam") {
      setExamens(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success("Examen supprimé");
    } else {
      setMatieres(prev => prev.filter(m => m.id !== deleteTarget.id));
      toast.success("Matière supprimée");
    }
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleExportConfig = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("CONFIGURATION DES EXAMENS", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Année: 2024-2025 | Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 25);

    autoTable(doc, {
      startY: 35,
      head: [["Type", "Session", "Niveau", "Candidats", "Statut", "Date début"]],
      body: examens.map(e => [e.type, e.session, e.niveau, String(e.nbCandidats), e.statut, e.dateDebut || "-"]),
      headStyles: { fillColor: [59, 130, 246] },
    });

    let y = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Matières et Coefficients", 14, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Examen", "Matière", "Coef.", "Type", "Durée", "Date", "Heure"]],
      body: matieres.map(m => [m.examen, m.matiere, String(m.coefficient), m.type, m.duree, m.dateProgrammee || "-", m.heureProgrammee || "-"]),
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Configuration_Examens_2025.pdf");
    toast.success("Export réussi");
  };

  const filteredMatieres = matieres.filter(m => m.examen === selectedExamen);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Paramétrage des Examens
          </h1>
          <p className="text-muted-foreground mt-1">Configuration des examens officiels (BEPC, BAC) et examens blancs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="gap-2" onClick={() => { setEditingExam(null); setExamForm({ type: "BEPC", annee: "2024-2025", session: "", niveau: "National", dateDebut: "", series: "Toutes" }); setIsExamDialogOpen(true); }}>
            <Plus className="h-4 w-4" />
            Nouvel Examen
          </Button>
        </div>
      </div>

      <Tabs defaultValue="examens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="examens">Examens</TabsTrigger>
          <TabsTrigger value="matieres">Matières & Coefficients</TabsTrigger>
          <TabsTrigger value="planning">Planning Officiel</TabsTrigger>
        </TabsList>

        <TabsContent value="examens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Examens Configurés</CardTitle>
              <CardDescription>Gestion des examens nationaux, régionaux et blancs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Candidats</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examens.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.type}</TableCell>
                      <TableCell>{exam.annee}</TableCell>
                      <TableCell>{exam.session}</TableCell>
                      <TableCell>
                        <Badge variant={exam.niveau === "National" ? "default" : "secondary"}>{exam.niveau}</Badge>
                      </TableCell>
                      <TableCell>{exam.nbCandidats}</TableCell>
                      <TableCell>
                        <Badge variant={exam.statut === "En cours" ? "default" : exam.statut === "Terminé" ? "secondary" : "outline"}>
                          {exam.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditExam(exam)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { setDeleteTarget({ type: "exam", id: exam.id }); setIsDeleteDialogOpen(true); }}>
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

        <TabsContent value="matieres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matières et Coefficients Officiels</CardTitle>
              <CardDescription>Configuration des matières par type d'examen avec coefficients DECO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <Select value={selectedExamen} onValueChange={setSelectedExamen}>
                  <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEPC">BEPC</SelectItem>
                    <SelectItem value="BAC">BAC</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={() => { setEditingMatiere(null); setMatiereForm({ matiere: "", coefficient: "1", type: "Écrit", duree: "" }); setIsMatiereDialogOpen(true); }}>
                  <Plus className="h-4 w-4" />
                  Ajouter une Matière
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Type d'Épreuve</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatieres.map((matiere) => (
                    <TableRow key={matiere.id}>
                      <TableCell className="font-medium">{matiere.matiere}</TableCell>
                      <TableCell><Badge variant="outline">{matiere.coefficient}</Badge></TableCell>
                      <TableCell>{matiere.type}</TableCell>
                      <TableCell>{matiere.duree}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditMatiere(matiere)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { setDeleteTarget({ type: "matiere", id: matiere.id }); setIsDeleteDialogOpen(true); }}>
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

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planning Officiel des Épreuves
              </CardTitle>
              <CardDescription>Calendrier détaillé des examens par matière</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {matieres.map((matiere) => (
                  <Card key={matiere.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{matiere.matiere}</CardTitle>
                      <Badge variant="outline" className="w-fit">{matiere.examen}</Badge>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{matiere.dateProgrammee || "À programmer"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heure:</span>
                        <span className="font-medium">{matiere.heureProgrammee || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durée:</span>
                        <Badge variant="outline" className="text-xs">{matiere.duree}</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => handleProgrammer(matiere)}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {matiere.dateProgrammee ? "Modifier" : "Programmer"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Examen */}
      <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExam ? "Modifier l'examen" : "Nouvel Examen"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type d'Examen</Label>
                <Select value={examForm.type} onValueChange={v => setExamForm({ ...examForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEPC">BEPC</SelectItem>
                    <SelectItem value="BAC">BAC</SelectItem>
                    <SelectItem value="Blanc BEPC">Blanc BEPC</SelectItem>
                    <SelectItem value="Blanc BAC">Blanc BAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select value={examForm.niveau} onValueChange={v => setExamForm({ ...examForm, niveau: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="Régional">Régional</SelectItem>
                    <SelectItem value="Interne">Interne (Blanc)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Année Scolaire</Label>
                <Input value={examForm.annee} onChange={e => setExamForm({ ...examForm, annee: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Session</Label>
                <Input placeholder="Ex: Session 1" value={examForm.session} onChange={e => setExamForm({ ...examForm, session: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" value={examForm.dateDebut} onChange={e => setExamForm({ ...examForm, dateDebut: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Séries</Label>
                <Select value={examForm.series} onValueChange={v => setExamForm({ ...examForm, series: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toutes">Toutes</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExamDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveExam} disabled={!examForm.session}>
              <Save className="h-4 w-4 mr-2" />
              {editingExam ? "Modifier" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Matière */}
      <Dialog open={isMatiereDialogOpen} onOpenChange={setIsMatiereDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMatiere ? "Modifier la matière" : "Ajouter une Matière"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Matière</Label>
              <Input placeholder="Ex: Philosophie" value={matiereForm.matiere} onChange={e => setMatiereForm({ ...matiereForm, matiere: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Coefficient</Label>
                <Input type="number" min="1" max="10" value={matiereForm.coefficient} onChange={e => setMatiereForm({ ...matiereForm, coefficient: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={matiereForm.type} onValueChange={v => setMatiereForm({ ...matiereForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Écrit">Écrit</SelectItem>
                    <SelectItem value="Oral">Oral</SelectItem>
                    <SelectItem value="Écrit + Oral">Écrit + Oral</SelectItem>
                    <SelectItem value="Pratique">Pratique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Durée</Label>
                <Input placeholder="Ex: 4h" value={matiereForm.duree} onChange={e => setMatiereForm({ ...matiereForm, duree: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMatiereDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveMatiere} disabled={!matiereForm.matiere}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Planning */}
      <Dialog open={isPlanningDialogOpen} onOpenChange={setIsPlanningDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Programmer - {planningMatiere?.matiere}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Date de l'épreuve</Label>
              <Input type="date" value={planningForm.date} onChange={e => setPlanningForm({ ...planningForm, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Heure de début</Label>
              <Input type="time" value={planningForm.heure} onChange={e => setPlanningForm({ ...planningForm, heure: e.target.value })} />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm">
              <div className="flex justify-between"><span>Durée:</span><span className="font-medium">{planningMatiere?.duree}</span></div>
              <div className="flex justify-between mt-1"><span>Coefficient:</span><span className="font-medium">{planningMatiere?.coefficient}</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanningDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSavePlanning} disabled={!planningForm.date || !planningForm.heure}>Programmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Cette action est irréversible. Voulez-vous continuer ?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
