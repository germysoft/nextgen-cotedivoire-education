import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, BookOpen, FileText, Video, Clock, Users, CheckCircle, 
  Search, Plus, Upload, Download, Eye, Edit, Trash2, Star
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Course {
  id: number;
  titre: string;
  classe: string;
  enseignant: string;
  modules: number;
  duree: string;
  completion: number;
  etudiants: number;
  statut: string;
  description?: string;
}

interface Resource {
  id: number;
  titre: string;
  type: string;
  taille: string;
  telechargements: number;
  date: string;
  courseId?: number;
}

interface Devoir {
  id: number;
  titre: string;
  classe: string;
  dateRemise: string;
  soumis: number;
  total: number;
  statut: string;
}

const initialCourses: Course[] = [
  { id: 1, titre: "Mathématiques - Fonctions", classe: "1ère C", enseignant: "M. KOFFI", modules: 8, duree: "6h30", completion: 75, etudiants: 45, statut: "En cours", description: "Cours sur les fonctions et dérivées" },
  { id: 2, titre: "Physique-Chimie - Électricité", classe: "Tle D", enseignant: "Mme DIALLO", modules: 6, duree: "4h20", completion: 100, etudiants: 38, statut: "Terminé", description: "Circuits électriques" },
  { id: 3, titre: "SVT - La Cellule", classe: "3ème", enseignant: "M. TOURÉ", modules: 5, duree: "3h45", completion: 40, etudiants: 52, statut: "En cours", description: "Structure cellulaire" },
  { id: 4, titre: "Français - Le Roman", classe: "2nde A", enseignant: "Mme SANOGO", modules: 10, duree: "8h15", completion: 60, etudiants: 48, statut: "En cours", description: "Analyse romanesque" },
  { id: 5, titre: "Anglais - Grammar Advanced", classe: "1ère A", enseignant: "M. JOHNSON", modules: 7, duree: "5h30", completion: 85, etudiants: 41, statut: "En cours", description: "Grammaire avancée" },
];

const initialResources: Resource[] = [
  { id: 1, titre: "Cours complet - Dérivées", type: "PDF", taille: "2.4 MB", telechargements: 156, date: "12 Déc 2024", courseId: 1 },
  { id: 2, titre: "Vidéo - Expérience loi d'Ohm", type: "Vidéo", taille: "45 MB", telechargements: 89, date: "10 Déc 2024", courseId: 2 },
  { id: 3, titre: "Exercices - La Cellule", type: "PDF", taille: "1.8 MB", telechargements: 124, date: "08 Déc 2024", courseId: 3 },
  { id: 4, titre: "QCM - Analyse grammaticale", type: "QCM", taille: "0.5 MB", telechargements: 203, date: "05 Déc 2024", courseId: 4 },
];

const initialDevoirs: Devoir[] = [
  { id: 1, titre: "Devoir Maison - Dérivées", classe: "1ère C", dateRemise: "20 Déc 2024", soumis: 32, total: 45, statut: "En cours" },
  { id: 2, titre: "TP - Circuit électrique", classe: "Tle D", dateRemise: "15 Déc 2024", soumis: 38, total: 38, statut: "Complété" },
  { id: 3, titre: "Dissertation - Le Roman", classe: "2nde A", dateRemise: "22 Déc 2024", soumis: 12, total: 48, statut: "En cours" },
  { id: 4, titre: "QCM - Grammar Test", classe: "1ère A", dateRemise: "18 Déc 2024", soumis: 41, total: 41, statut: "Complété" },
];

export default function Elearning() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [devoirs, setDevoirs] = useState<Devoir[]>(initialDevoirs);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isDevoirDialogOpen, setIsDevoirDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Forms
  const [courseForm, setCourseForm] = useState({
    titre: "", classe: "", enseignant: "", modules: "", duree: "", description: ""
  });
  const [resourceForm, setResourceForm] = useState({
    titre: "", type: "PDF", courseId: ""
  });
  const [devoirForm, setDevoirForm] = useState({
    titre: "", classe: "", dateRemise: ""
  });
  
  // Filter courses
  const filteredCourses = courses.filter(c => 
    c.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.classe.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Course CRUD
  const handleSaveCourse = () => {
    if (editingCourse) {
      setCourses(prev => prev.map(c => 
        c.id === editingCourse.id ? {
          ...c,
          titre: courseForm.titre,
          classe: courseForm.classe,
          enseignant: courseForm.enseignant,
          modules: Number(courseForm.modules),
          duree: courseForm.duree,
          description: courseForm.description,
        } : c
      ));
      toast.success("Cours modifié avec succès");
    } else {
      const newCourse: Course = {
        id: Math.max(...courses.map(c => c.id)) + 1,
        titre: courseForm.titre,
        classe: courseForm.classe,
        enseignant: courseForm.enseignant,
        modules: Number(courseForm.modules),
        duree: courseForm.duree,
        completion: 0,
        etudiants: 0,
        statut: "En cours",
        description: courseForm.description,
      };
      setCourses(prev => [...prev, newCourse]);
      toast.success("Nouveau cours créé avec succès");
    }
    setIsCourseDialogOpen(false);
    setEditingCourse(null);
    setCourseForm({ titre: "", classe: "", enseignant: "", modules: "", duree: "", description: "" });
  };
  
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      titre: course.titre,
      classe: course.classe,
      enseignant: course.enseignant,
      modules: String(course.modules),
      duree: course.duree,
      description: course.description || "",
    });
    setIsCourseDialogOpen(true);
  };
  
  const handleDeleteCourse = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setResources(prev => prev.filter(r => r.courseId !== id));
    toast.success("Cours supprimé");
  };
  
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };
  
  // Resource CRUD
  const handleAddResource = () => {
    const newResource: Resource = {
      id: Math.max(...resources.map(r => r.id), 0) + 1,
      titre: resourceForm.titre,
      type: resourceForm.type,
      taille: "1.0 MB",
      telechargements: 0,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      courseId: resourceForm.courseId ? Number(resourceForm.courseId) : undefined,
    };
    setResources(prev => [...prev, newResource]);
    toast.success("Ressource ajoutée");
    setIsResourceDialogOpen(false);
    setResourceForm({ titre: "", type: "PDF", courseId: "" });
  };
  
  const handleDeleteResource = (id: number) => {
    setResources(prev => prev.filter(r => r.id !== id));
    toast.success("Ressource supprimée");
  };
  
  // Devoir CRUD
  const handleAddDevoir = () => {
    const classStudents = courses.find(c => c.classe === devoirForm.classe)?.etudiants || 45;
    const newDevoir: Devoir = {
      id: Math.max(...devoirs.map(d => d.id), 0) + 1,
      titre: devoirForm.titre,
      classe: devoirForm.classe,
      dateRemise: devoirForm.dateRemise,
      soumis: 0,
      total: classStudents,
      statut: "En cours",
    };
    setDevoirs(prev => [...prev, newDevoir]);
    toast.success("Devoir créé");
    setIsDevoirDialogOpen(false);
    setDevoirForm({ titre: "", classe: "", dateRemise: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">E-Learning</h1>
          <p className="text-muted-foreground">Plateforme de cours en ligne et ressources pédagogiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsResourceDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importer Ressources
          </Button>
          <Button onClick={() => { setEditingCourse(null); setIsCourseDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Cours
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ressources</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">PDF, Vidéos, QCM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">524</div>
            <p className="text-xs text-green-600">+12% engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Complétion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Cours en Ligne</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
          <TabsTrigger value="devoirs">Devoirs</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un cours..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setIsDevoirDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Devoir
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cours</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.titre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.classe}</Badge>
                    </TableCell>
                    <TableCell>{course.enseignant}</TableCell>
                    <TableCell>{course.modules} modules</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duree}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{course.completion}%</span>
                        </div>
                        <Progress value={course.completion} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.etudiants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.statut === "Terminé" ? "default" : "secondary"}>
                        {course.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewCourse(course)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditCourse(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher une ressource..." className="pl-10" />
            </div>
            <Button variant="outline" onClick={() => setIsResourceDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter Ressource
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {resource.type === "Vidéo" ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : resource.type === "QCM" ? (
                        <FileText className="h-5 w-5 text-accent" />
                      ) : (
                        <FileText className="h-5 w-5 text-chart-2" />
                      )}
                      <div>
                        <CardTitle className="text-base">{resource.titre}</CardTitle>
                        <CardDescription className="mt-1">
                          {resource.type} • {resource.taille}
                        </CardDescription>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteResource(resource.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {resource.telechargements}
                      </div>
                      <span>{resource.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success(`Prévisualisation: ${resource.titre}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                      <Button size="sm" onClick={() => toast.success(`Téléchargement: ${resource.titre}`)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devoirs" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Devoir</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Date de Remise</TableHead>
                  <TableHead>Soumissions</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devoirs.map((devoir) => (
                  <TableRow key={devoir.id}>
                    <TableCell className="font-medium">{devoir.titre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{devoir.classe}</Badge>
                    </TableCell>
                    <TableCell>{devoir.dateRemise}</TableCell>
                    <TableCell>
                      {devoir.soumis}/{devoir.total}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{Math.round((devoir.soumis / devoir.total) * 100)}%</span>
                        </div>
                        <Progress value={(devoir.soumis / devoir.total) * 100} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={devoir.statut === "Complété" ? "default" : "secondary"}>
                        {devoir.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.success(`Affichage des soumissions pour ${devoir.titre}`)}>
                          Voir Soumissions
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Dialog */}
      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Modifier le Cours" : "Nouveau Cours"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Titre du cours</Label>
              <Input 
                placeholder="Ex: Mathématiques - Fonctions" 
                value={courseForm.titre}
                onChange={(e) => setCourseForm({...courseForm, titre: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Classe</Label>
                <Select value={courseForm.classe} onValueChange={(v) => setCourseForm({...courseForm, classe: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6ème A">6ème A</SelectItem>
                    <SelectItem value="5ème B">5ème B</SelectItem>
                    <SelectItem value="4ème C">4ème C</SelectItem>
                    <SelectItem value="3ème">3ème</SelectItem>
                    <SelectItem value="2nde A">2nde A</SelectItem>
                    <SelectItem value="1ère A">1ère A</SelectItem>
                    <SelectItem value="1ère C">1ère C</SelectItem>
                    <SelectItem value="Tle D">Tle D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Enseignant</Label>
                <Select value={courseForm.enseignant} onValueChange={(v) => setCourseForm({...courseForm, enseignant: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M. KOFFI">M. KOFFI</SelectItem>
                    <SelectItem value="Mme DIALLO">Mme DIALLO</SelectItem>
                    <SelectItem value="M. TOURÉ">M. TOURÉ</SelectItem>
                    <SelectItem value="Mme SANOGO">Mme SANOGO</SelectItem>
                    <SelectItem value="M. JOHNSON">M. JOHNSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre de modules</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 8" 
                  value={courseForm.modules}
                  onChange={(e) => setCourseForm({...courseForm, modules: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Durée totale</Label>
                <Input 
                  placeholder="Ex: 6h30" 
                  value={courseForm.duree}
                  onChange={(e) => setCourseForm({...courseForm, duree: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Description du cours..." 
                value={courseForm.description}
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveCourse}>{editingCourse ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une Ressource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Titre de la ressource</Label>
              <Input 
                placeholder="Ex: Cours complet - Dérivées" 
                value={resourceForm.titre}
                onChange={(e) => setResourceForm({...resourceForm, titre: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={resourceForm.type} onValueChange={(v) => setResourceForm({...resourceForm, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Vidéo">Vidéo</SelectItem>
                    <SelectItem value="QCM">QCM</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cours associé (optionnel)</Label>
                <Select value={resourceForm.courseId} onValueChange={(v) => setResourceForm({...resourceForm, courseId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun</SelectItem>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.titre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Cliquez ou glissez-déposez pour téléverser</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddResource}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Devoir Dialog */}
      <Dialog open={isDevoirDialogOpen} onOpenChange={setIsDevoirDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Devoir</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Titre du devoir</Label>
              <Input 
                placeholder="Ex: Devoir Maison - Dérivées" 
                value={devoirForm.titre}
                onChange={(e) => setDevoirForm({...devoirForm, titre: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Classe</Label>
                <Select value={devoirForm.classe} onValueChange={(v) => setDevoirForm({...devoirForm, classe: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6ème A">6ème A</SelectItem>
                    <SelectItem value="5ème B">5ème B</SelectItem>
                    <SelectItem value="4ème C">4ème C</SelectItem>
                    <SelectItem value="3ème">3ème</SelectItem>
                    <SelectItem value="2nde A">2nde A</SelectItem>
                    <SelectItem value="1ère A">1ère A</SelectItem>
                    <SelectItem value="1ère C">1ère C</SelectItem>
                    <SelectItem value="Tle D">Tle D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date de remise</Label>
                <Input 
                  type="date" 
                  value={devoirForm.dateRemise}
                  onChange={(e) => setDevoirForm({...devoirForm, dateRemise: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDevoirDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddDevoir}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Course Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.titre}</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Classe</Label>
                  <p className="font-medium">{selectedCourse.classe}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Enseignant</Label>
                  <p className="font-medium">{selectedCourse.enseignant}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Modules</Label>
                  <p className="font-medium">{selectedCourse.modules} modules</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Durée</Label>
                  <p className="font-medium">{selectedCourse.duree}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Étudiants inscrits</Label>
                  <p className="font-medium">{selectedCourse.etudiants} élèves</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Statut</Label>
                  <Badge variant={selectedCourse.statut === "Terminé" ? "default" : "secondary"}>
                    {selectedCourse.statut}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Progression</Label>
                <Progress value={selectedCourse.completion} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">{selectedCourse.completion}% complété</p>
              </div>
              {selectedCourse.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedCourse.description}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Ressources associées</Label>
                <div className="mt-2 space-y-2">
                  {resources.filter(r => r.courseId === selectedCourse.id).map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2 border rounded">
                      <span>{r.titre}</span>
                      <Badge variant="outline">{r.type}</Badge>
                    </div>
                  ))}
                  {resources.filter(r => r.courseId === selectedCourse.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucune ressource associée</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
