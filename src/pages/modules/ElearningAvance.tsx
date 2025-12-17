import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, Pause, BookOpen, Video, FileText, CheckCircle, Clock, Users, 
  Plus, Upload, BarChart3, Award, MessageSquare, Download, Eye, 
  Settings, Trash2, Edit, Star, ChevronRight, Volume2, Maximize,
  PlayCircle, PauseCircle, SkipForward, SkipBack
} from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface Course {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  thumbnail: string;
  duration: string;
  lessons: number;
  enrolled: number;
  rating: number;
  status: "published" | "draft" | "archived";
  category: string;
  level: string;
}

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  type: "video" | "document" | "quiz" | "exercise";
  duration: string;
  order: number;
  completed: boolean;
}

interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: number;
  passScore: number;
  attempts: number;
  avgScore: number;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  courseId: string;
  progress: number;
  lastAccess: string;
  completedLessons: number;
  totalLessons: number;
  quizAverage: number;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Mathématiques - Algèbre Niveau 3ème",
    subject: "Mathématiques",
    teacher: "M. Kouassi Jean",
    description: "Cours complet sur l'algèbre pour les élèves de 3ème. Équations, inéquations et systèmes.",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    duration: "12h 30min",
    lessons: 24,
    enrolled: 156,
    rating: 4.8,
    status: "published",
    category: "Sciences",
    level: "3ème",
  },
  {
    id: "2",
    title: "Français - Littérature Africaine",
    subject: "Français",
    teacher: "Mme Bamba Awa",
    description: "Découverte des grands auteurs africains et analyse de textes littéraires.",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    duration: "8h 45min",
    lessons: 18,
    enrolled: 203,
    rating: 4.6,
    status: "published",
    category: "Lettres",
    level: "Terminale",
  },
  {
    id: "3",
    title: "Physique-Chimie - Électricité",
    subject: "Physique-Chimie",
    teacher: "Mme Koné Fatou",
    description: "Les fondamentaux de l'électricité: circuits, lois d'Ohm, puissance électrique.",
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400",
    duration: "10h 15min",
    lessons: 20,
    enrolled: 89,
    rating: 4.5,
    status: "published",
    category: "Sciences",
    level: "2nde",
  },
  {
    id: "4",
    title: "Anglais - Business English",
    subject: "Anglais",
    teacher: "M. Traoré Ibrahim",
    description: "Anglais professionnel pour préparer les élèves au monde du travail.",
    thumbnail: "https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=400",
    duration: "6h 00min",
    lessons: 12,
    enrolled: 67,
    rating: 4.3,
    status: "draft",
    category: "Langues",
    level: "Terminale",
  },
];

const mockLessons: Lesson[] = [
  { id: "1", courseId: "1", title: "Introduction à l'algèbre", type: "video", duration: "25min", order: 1, completed: true },
  { id: "2", courseId: "1", title: "Les équations du premier degré", type: "video", duration: "35min", order: 2, completed: true },
  { id: "3", courseId: "1", title: "Exercices pratiques - Équations", type: "exercise", duration: "45min", order: 3, completed: true },
  { id: "4", courseId: "1", title: "Quiz - Équations", type: "quiz", duration: "20min", order: 4, completed: false },
  { id: "5", courseId: "1", title: "Les inéquations", type: "video", duration: "40min", order: 5, completed: false },
  { id: "6", courseId: "1", title: "Document de synthèse", type: "document", duration: "15min", order: 6, completed: false },
];

const mockProgress: StudentProgress[] = [
  { studentId: "1", studentName: "Kouamé Yao", courseId: "1", progress: 85, lastAccess: "2024-01-15", completedLessons: 20, totalLessons: 24, quizAverage: 78 },
  { studentId: "2", studentName: "Diallo Aminata", courseId: "1", progress: 72, lastAccess: "2024-01-14", completedLessons: 17, totalLessons: 24, quizAverage: 82 },
  { studentId: "3", studentName: "Koné Mamadou", courseId: "1", progress: 45, lastAccess: "2024-01-10", completedLessons: 11, totalLessons: 24, quizAverage: 65 },
  { studentId: "4", studentName: "Bamba Fatou", courseId: "1", progress: 95, lastAccess: "2024-01-15", completedLessons: 23, totalLessons: 24, quizAverage: 91 },
  { studentId: "5", studentName: "Traoré Sekou", courseId: "1", progress: 30, lastAccess: "2024-01-08", completedLessons: 7, totalLessons: 24, quizAverage: 58 },
];

const progressDistribution = [
  { name: "0-25%", value: 15, color: "#ef4444" },
  { name: "26-50%", value: 25, color: "#f59e0b" },
  { name: "51-75%", value: 35, color: "#3b82f6" },
  { name: "76-100%", value: 25, color: "#22c55e" },
];

const weeklyActivity = [
  { day: "Lun", views: 145, completions: 23 },
  { day: "Mar", views: 189, completions: 34 },
  { day: "Mer", views: 156, completions: 28 },
  { day: "Jeu", views: 201, completions: 41 },
  { day: "Ven", views: 178, completions: 32 },
  { day: "Sam", views: 89, completions: 15 },
  { day: "Dim", views: 45, completions: 8 },
];

const ElearningAvance = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newCourse, setNewCourse] = useState({
    title: "",
    subject: "",
    description: "",
    category: "",
    level: "",
  });

  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "video" as "video" | "document" | "quiz" | "exercise",
    duration: "",
  });

  const stats = {
    totalCourses: mockCourses.length,
    totalStudents: mockCourses.reduce((acc, c) => acc + c.enrolled, 0),
    totalLessons: mockCourses.reduce((acc, c) => acc + c.lessons, 0),
    avgRating: (mockCourses.reduce((acc, c) => acc + c.rating, 0) / mockCourses.length).toFixed(1),
  };

  const filteredCourses = mockCourses.filter(course => {
    const matchCategory = filterCategory === "all" || course.category === filterCategory;
    const matchLevel = filterLevel === "all" || course.level === filterLevel;
    const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       course.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchLevel && matchSearch;
  });

  const handleCreateCourse = () => {
    toast.success("Cours créé avec succès");
    setIsCreateCourseOpen(false);
    setNewCourse({ title: "", subject: "", description: "", category: "", level: "" });
  };

  const handleAddLesson = () => {
    toast.success("Leçon ajoutée avec succès");
    setIsCreateLessonOpen(false);
    setNewLesson({ title: "", type: "video", duration: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">E-learning Avancé</h1>
          <p className="text-muted-foreground">Plateforme de cours en ligne avec vidéos, quiz et suivi de progression</p>
        </div>
        <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau cours
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer un nouveau cours</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Titre du cours</Label>
                <Input
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Ex: Mathématiques - Algèbre"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matière</Label>
                  <Select value={newCourse.subject} onValueChange={(v) => setNewCourse({ ...newCourse, subject: v })}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                      <SelectItem value="Français">Français</SelectItem>
                      <SelectItem value="Anglais">Anglais</SelectItem>
                      <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                      <SelectItem value="SVT">SVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <Select value={newCourse.level} onValueChange={(v) => setNewCourse({ ...newCourse, level: v })}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6ème">6ème</SelectItem>
                      <SelectItem value="5ème">5ème</SelectItem>
                      <SelectItem value="4ème">4ème</SelectItem>
                      <SelectItem value="3ème">3ème</SelectItem>
                      <SelectItem value="2nde">2nde</SelectItem>
                      <SelectItem value="1ère">1ère</SelectItem>
                      <SelectItem value="Terminale">Terminale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={newCourse.category} onValueChange={(v) => setNewCourse({ ...newCourse, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                    <SelectItem value="Lettres">Lettres</SelectItem>
                    <SelectItem value="Langues">Langues</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Description du cours..."
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateCourse} className="w-full">Créer le cours</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cours</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inscrits</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Video className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leçons</p>
                <p className="text-2xl font-bold">{stats.totalLessons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                <p className="text-2xl font-bold">{stats.avgRating}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Catalogue des cours</TabsTrigger>
          <TabsTrigger value="player">Lecteur vidéo</TabsTrigger>
          <TabsTrigger value="progress">Suivi des élèves</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="Sciences">Sciences</SelectItem>
                <SelectItem value="Lettres">Lettres</SelectItem>
                <SelectItem value="Langues">Langues</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Niveau" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="3ème">3ème</SelectItem>
                <SelectItem value="2nde">2nde</SelectItem>
                <SelectItem value="Terminale">Terminale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedCourse(course)}>
                <div className="relative h-40">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <Badge className={`absolute top-2 right-2 ${
                    course.status === "published" ? "bg-green-500" : 
                    course.status === "draft" ? "bg-amber-500" : "bg-gray-500"
                  }`}>
                    {course.status === "published" ? "Publié" : course.status === "draft" ? "Brouillon" : "Archivé"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.teacher}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>{course.lessons} leçons</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled} inscrits</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="player" className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card className="overflow-hidden">
                <div className="relative bg-black aspect-video flex items-center justify-center">
                  {currentLesson ? (
                    <>
                      <img 
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          variant="ghost"
                          className="h-20 w-20 rounded-full bg-white/20 hover:bg-white/30"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? (
                            <PauseCircle className="h-12 w-12 text-white" />
                          ) : (
                            <PlayCircle className="h-12 w-12 text-white" />
                          )}
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-4 text-white">
                          <Button variant="ghost" size="icon" className="text-white">
                            <SkipBack className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white">
                            <SkipForward className="h-5 w-5" />
                          </Button>
                          <Progress value={35} className="flex-1 h-1" />
                          <span className="text-sm">12:45 / 35:00</span>
                          <Button variant="ghost" size="icon" className="text-white">
                            <Volume2 className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white">
                            <Maximize className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-white text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Sélectionnez une leçon pour commencer</p>
                    </div>
                  )}
                </div>
                {currentLesson && (
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                    <p className="text-muted-foreground mt-1">Durée: {currentLesson.duration}</p>
                  </CardContent>
                )}
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {mockLessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        currentLesson?.id === lesson.id ? "bg-primary/10" : ""
                      }`}
                      onClick={() => setCurrentLesson(lesson)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          lesson.completed ? "bg-green-500 text-white" : "bg-muted"
                        }`}>
                          {lesson.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            {lesson.type === "video" && <Video className="h-3 w-3" />}
                            {lesson.type === "document" && <FileText className="h-3 w-3" />}
                            {lesson.type === "quiz" && <CheckCircle className="h-3 w-3" />}
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Progression des élèves</CardTitle>
                <Select defaultValue="1">
                  <SelectTrigger className="w-64"><SelectValue placeholder="Sélectionner un cours" /></SelectTrigger>
                  <SelectContent>
                    {mockCourses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Leçons complétées</TableHead>
                    <TableHead>Moyenne Quiz</TableHead>
                    <TableHead>Dernier accès</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProgress.map(p => (
                    <TableRow key={p.studentId}>
                      <TableCell className="font-medium">{p.studentName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.progress} className="w-24 h-2" />
                          <span className="text-sm">{p.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{p.completedLessons}/{p.totalLessons}</TableCell>
                      <TableCell>
                        <Badge variant={p.quizAverage >= 70 ? "default" : p.quizAverage >= 50 ? "secondary" : "destructive"}>
                          {p.quizAverage}%
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(p.lastAccess).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution de la progression</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={progressDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {progressDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activité hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3b82f6" name="Vues" />
                    <Bar dataKey="completions" fill="#22c55e" name="Complétions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElearningAvance;
