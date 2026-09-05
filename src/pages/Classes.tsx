import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Trash2, Users, GraduationCap, Clock, BarChart3, Loader2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Classe,
  nomJour,
  useAnneeScolaireActive,
  useClasseQuery,
  useClassesQuery,
  useCreateClasse,
  useDeleteClasse,
  useUpdateClasse,
} from "@/hooks/api/useClasses";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";

// Données d'exemple pour l'onglet "Performance" : l'agrégation réelle des
// moyennes par matière pour une classe n'est pas encore branchée (elle
// nécessiterait de croiser /api/notes/moyennes avec un historique de
// périodes) — voir MIGRATION.md. Le reste de la page utilise l'API réelle.
const performanceData = [
  { subject: "Maths", average: 13.5, classAvg: 12.8 },
  { subject: "Français", average: 12.8, classAvg: 11.9 },
  { subject: "Anglais", average: 14.2, classAvg: 13.5 },
  { subject: "Physique", average: 11.5, classAvg: 10.8 },
  { subject: "SVT", average: 15.1, classAvg: 14.2 },
];
const evolutionData = [
  { month: "Sept", moyenne: 11.2 },
  { month: "Oct", moyenne: 12.1 },
  { month: "Nov", moyenne: 12.8 },
  { month: "Déc", moyenne: 13.5 },
];

const CYCLES = ["1er Cycle", "2nd Cycle"];
const NIVEAUX = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Tle"];

const emptyForm = { nom: "", cycle: "", niveau: "", effectifMax: 45, professeurPrincipalId: "" };

export default function Classes() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClasseId, setSelectedClasseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [formData, setFormData] = useState(emptyForm);

  const { data: anneeActive } = useAnneeScolaireActive();
  const { data: classes = [], isLoading, isError } = useClassesQuery(anneeActive?.id);
  const { data: personnelData } = usePersonnelQuery({ categoriePersonnel: "Enseignant", pageSize: 200 });
  const enseignants = personnelData?.items ?? [];
  const createClasse = useCreateClasse();
  const updateClasse = useUpdateClasse();
  const deleteClasse = useDeleteClasse();

  const selectedClasse = classes.find((c) => c.id === selectedClasseId) ?? null;
  const { data: classeDetail } = useClasseQuery(viewMode === "detail" ? selectedClasseId ?? undefined : undefined);

  const filteredClasses = classes.filter((classe) => {
    const q = searchQuery.toLowerCase();
    return (
      classe.nom.toLowerCase().includes(q) ||
      classe.niveau.toLowerCase().includes(q) ||
      `${classe.professeurPrincipal?.nom ?? ""} ${classe.professeurPrincipal?.prenom ?? ""}`.toLowerCase().includes(q)
    );
  });

  const getOccupancyColor = (enrolled: number, capacity: number) => {
    const percentage = capacity > 0 ? (enrolled / capacity) * 100 : 0;
    if (percentage >= 95) return "destructive";
    if (percentage >= 80) return "default";
    return "secondary";
  };

  const totalStudents = classes.reduce((acc, c) => acc + (c._count?.inscriptions ?? 0), 0);
  const totalCapacity = classes.reduce((acc, c) => acc + c.effectifMax, 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;
  const niveauxDistincts = new Set(classes.map((c) => c.niveau)).size;
  const classesAvecProfPrincipal = classes.filter((c) => c.professeurPrincipalId).length;

  const handleViewClass = (classe: Classe) => {
    setSelectedClasseId(classe.id);
    setViewMode("detail");
  };

  const openAddDialog = () => {
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleAddClass = () => {
    if (!formData.nom.trim() || !formData.cycle || !formData.niveau) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }
    if (!anneeActive) {
      toast({ title: "Erreur", description: "Aucune année scolaire active n'est configurée (Paramétrage > Établissement).", variant: "destructive" });
      return;
    }
    createClasse.mutate(
      {
        nom: formData.nom.trim(),
        cycle: formData.cycle,
        niveau: formData.niveau,
        effectifMax: formData.effectifMax,
        professeurPrincipalId: formData.professeurPrincipalId || undefined,
        anneeScolaireId: anneeActive.id,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({ title: "Classe créée", description: `La classe ${formData.nom} a été ajoutée avec succès` });
        },
        onError: (err: any) => toast({ title: "Erreur", description: err?.response?.data?.error ?? "Échec de la création.", variant: "destructive" }),
      }
    );
  };

  const handleEditClass = (classe: Classe) => {
    setSelectedClasseId(classe.id);
    setFormData({
      nom: classe.nom,
      cycle: classe.cycle,
      niveau: classe.niveau,
      effectifMax: classe.effectifMax,
      professeurPrincipalId: classe.professeurPrincipalId ?? "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClass = () => {
    if (!selectedClasseId) return;
    updateClasse.mutate(
      {
        id: selectedClasseId,
        nom: formData.nom,
        cycle: formData.cycle,
        niveau: formData.niveau,
        effectifMax: formData.effectifMax,
        professeurPrincipalId: formData.professeurPrincipalId || undefined,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          toast({ title: "Classe modifiée", description: `La classe ${formData.nom} a été mise à jour` });
        },
        onError: (err: any) => toast({ title: "Erreur", description: err?.response?.data?.error ?? "Échec de la modification.", variant: "destructive" }),
      }
    );
  };

  const handleDeleteClass = (classe: Classe) => {
    setSelectedClasseId(classe.id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClass = () => {
    if (!selectedClasseId || !selectedClasse) return;
    deleteClasse.mutate(selectedClasseId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast({ title: "Classe supprimée", description: `La classe ${selectedClasse.nom} a été supprimée` });
      },
      onError: (err: any) =>
        toast({
          title: "Suppression impossible",
          description: err?.response?.data?.error ?? "Des élèves sont probablement encore inscrits dans cette classe.",
          variant: "destructive",
        }),
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liste des Classes", 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Classe', 'Niveau', 'Cycle', 'Effectif', 'Capacité', 'Professeur Principal']],
      body: classes.map((c) => [
        c.nom, c.niveau, c.cycle, String(c._count?.inscriptions ?? 0), String(c.effectifMax),
        c.professeurPrincipal ? `${c.professeurPrincipal.nom} ${c.professeurPrincipal.prenom}` : "Non assigné",
      ]),
    });

    doc.save('liste-classes.pdf');
    toast({ title: "Export réussi", description: "Le PDF a été généré" });
  };

  const teacherSelect = (value: string, onChange: (v: string) => void) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={t('common.select')} />
      </SelectTrigger>
      <SelectContent>
        {enseignants.map((p) => (
          <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('classes.title')}</h1>
              <p className="text-muted-foreground">{t('classes.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportPDF}>{t('common.export')}</Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('classes.addNew')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t('classes.addNew')}</DialogTitle>
                  </DialogHeader>
                  {!anneeActive && (
                    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      Aucune année scolaire active. Configurez-en une dans Paramétrage &gt; Établissement avant de créer une classe.
                    </div>
                  )}
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('common.name')}</Label>
                        <Input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex: 6ème A" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('academic.cycle')}</Label>
                        <Select value={formData.cycle} onValueChange={(v) => setFormData({ ...formData, cycle: v })}>
                          <SelectTrigger><SelectValue placeholder={t('common.select')} /></SelectTrigger>
                          <SelectContent>
                            {CYCLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('classes.level')}</Label>
                        <Select value={formData.niveau} onValueChange={(v) => setFormData({ ...formData, niveau: v })}>
                          <SelectTrigger><SelectValue placeholder={t('common.select')} /></SelectTrigger>
                          <SelectContent>
                            {NIVEAUX.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('classes.capacity')}</Label>
                        <Input type="number" value={formData.effectifMax} onChange={(e) => setFormData({ ...formData, effectifMax: parseInt(e.target.value) || 45 })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('classes.mainTeacher')}</Label>
                      {teacherSelect(formData.professeurPrincipalId, (v) => setFormData({ ...formData, professeurPrincipalId: v }))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel')}</Button>
                      <Button onClick={handleAddClass} disabled={createClasse.isPending || !anneeActive}>
                        {createClasse.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.save')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>Modifier la classe</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('common.name')}</Label>
                        <Input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('academic.cycle')}</Label>
                        <Select value={formData.cycle} onValueChange={(v) => setFormData({ ...formData, cycle: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{CYCLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('classes.level')}</Label>
                        <Select value={formData.niveau} onValueChange={(v) => setFormData({ ...formData, niveau: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{NIVEAUX.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('classes.capacity')}</Label>
                        <Input type="number" value={formData.effectifMax} onChange={(e) => setFormData({ ...formData, effectifMax: parseInt(e.target.value) || 45 })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('classes.mainTeacher')}</Label>
                      {teacherSelect(formData.professeurPrincipalId, (v) => setFormData({ ...formData, professeurPrincipalId: v }))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t('common.cancel')}</Button>
                      <Button onClick={handleUpdateClass} disabled={updateClasse.isPending}>
                        {updateClasse.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.save')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Supprimer la classe</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir supprimer la classe "{selectedClasse?.nom}" ? Impossible si des élèves y sont encore inscrits.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
                    <Button variant="destructive" onClick={confirmDeleteClass} disabled={deleteClasse.isPending}>
                      {deleteClasse.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.delete')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('common.total')} {t('dashboard.classes')}</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
                <p className="text-xs text-muted-foreground">{t('common.active')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.totalStudents')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">{t('students.enrolled')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('classes.capacity')}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgOccupancy}%</div>
                <Progress value={avgOccupancy} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Niveaux</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{niveauxDistincts}</div>
                <p className="text-xs text-muted-foreground">niveaux distincts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('classes.mainTeacher')}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classesAvecProfPrincipal}/{classes.length}</div>
                <p className="text-xs text-muted-foreground">classes avec titulaire assigné</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('students.list')}</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('common.search')} className="pl-8 w-[250px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" /> Chargement des classes…
                </div>
              )}
              {isError && <div className="py-16 text-center text-destructive">Impossible de contacter l'API.</div>}
              {!isLoading && !isError && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.name')}</TableHead>
                      <TableHead>{t('classes.level')}</TableHead>
                      <TableHead>{t('academic.cycle')}</TableHead>
                      <TableHead>{t('classes.mainTeacher')}</TableHead>
                      <TableHead>{t('classes.enrollment')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((classe) => (
                      <TableRow key={classe.id}>
                        <TableCell className="font-medium">{classe.nom}</TableCell>
                        <TableCell><Badge variant="outline">{classe.niveau}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{classe.cycle}</TableCell>
                        <TableCell>
                          {classe.professeurPrincipal ? `${classe.professeurPrincipal.nom} ${classe.professeurPrincipal.prenom}` : <span className="text-muted-foreground">Non assigné</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getOccupancyColor(classe._count?.inscriptions ?? 0, classe.effectifMax)}>
                            {classe._count?.inscriptions ?? 0}/{classe.effectifMax}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleViewClass(classe)} title={t('common.view')}><Eye className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEditClass(classe)} title={t('common.edit')}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteClass(classe)} title={t('common.delete')}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => setViewMode("list")} className="mb-2">← {t('common.back')}</Button>
              <h1 className="text-3xl font-bold">{t('students.class')} {selectedClasse?.nom}</h1>
              <p className="text-muted-foreground">
                {selectedClasse?.niveau} - {selectedClasse?.cycle} • {t('classes.mainTeacher')}: {selectedClasse?.professeurPrincipal ? `${selectedClasse.professeurPrincipal.nom} ${selectedClasse.professeurPrincipal.prenom}` : "Non assigné"}
              </p>
            </div>
          </div>

          <Tabs defaultValue="students" className="space-y-6">
            <TabsList>
              <TabsTrigger value="students">{t('nav.students')} ({classeDetail?.inscriptions.length ?? 0})</TabsTrigger>
              <TabsTrigger value="schedule">{t('schedule.title')}</TabsTrigger>
              <TabsTrigger value="performance">{t('reports.performance')}</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <Card>
                <CardHeader><CardTitle>{t('students.list')} - {selectedClasse?.nom}</CardTitle></CardHeader>
                <CardContent>
                  {!classeDetail ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('common.name')}</TableHead>
                          <TableHead>Matricule</TableHead>
                          <TableHead>{t('students.status')}</TableHead>
                          <TableHead className="text-right">{t('common.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classeDetail.inscriptions.map(({ eleve }) => (
                          <TableRow key={eleve.id}>
                            <TableCell className="font-medium">{eleve.nom} {eleve.prenom}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{eleve.matricule}</TableCell>
                            <TableCell>
                              <Badge variant={eleve.actif ? "default" : "secondary"}>{eleve.actif ? t('common.active') : "Inactif"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" onClick={() => navigate(`/students/${eleve.id}`)}>{t('common.view')}</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Moyennes, rangs et absences par élève : voir le module Notes (/notes/moyennes) pour cette classe.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader><CardTitle>{t('schedule.title')}</CardTitle></CardHeader>
                <CardContent>
                  {!classeDetail ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
                    </div>
                  ) : classeDetail.cours.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">Aucun cours planifié pour cette classe.</p>
                  ) : (
                    <div className="grid gap-4">
                      {[1, 2, 3, 4, 5, 6].map((jour) => {
                        const slots = classeDetail.cours
                          .filter((c) => c.jourSemaine === jour)
                          .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
                        if (slots.length === 0) return null;
                        return (
                          <div key={jour} className="border rounded-lg p-4">
                            <h3 className="font-bold mb-3">{nomJour(jour)}</h3>
                            <div className="grid gap-2 md:grid-cols-3">
                              {slots.map((slot) => (
                                <div key={slot.id} className="p-3 bg-muted rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-xs font-medium">{slot.heureDebut}-{slot.heureFin}</span>
                                  </div>
                                  <p className="font-semibold text-sm">{slot.matiere.nom}</p>
                                  <p className="text-xs text-muted-foreground">{slot.personnel.nom} {slot.personnel.prenom}{slot.salle ? ` • ${slot.salle.nom}` : ""}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <div className="mb-4 flex items-center gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Données d'exemple — l'agrégation réelle des moyennes par matière pour cette classe n'est pas encore branchée (voir MIGRATION.md).
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle>{t('reports.performance')}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 20]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="average" name={t('grades.average')} fill="#3b82f6" />
                          <Bar dataKey="classAvg" name={t('dashboard.classes')} fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>{t('dashboard.performanceEvolution')}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={evolutionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 20]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
