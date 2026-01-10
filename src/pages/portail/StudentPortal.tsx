import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Download,
  FileText,
  Clock,
  GraduationCap,
  Award,
  Medal,
  Star,
  Target,
  Play,
  File,
  Video,
  Presentation,
  Search,
  Eye,
  BookMarked,
  Folder,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// Mock student data
const mockStudent = {
  matricule: "66800001A",
  name: "Kouassi Jean-Marc",
  class: "6ème A",
  photo: "/placeholder.svg",
  birthDate: "2012-05-15",
  email: "jean.kouassi@eleve.nextgen.ci"
};

// Mock grades data
const notesParMatiere = [
  { subject: "Mathématiques", coef: 4, interro1: 14, interro2: 15, devoir: 13, composition: 16, moyenne: 14.5, moyenneClasse: 12.3, rang: 8, appreciation: "Très bien" },
  { subject: "Français", coef: 4, interro1: 12, interro2: 13, devoir: 14, composition: 13, moyenne: 13.0, moyenneClasse: 11.8, rang: 12, appreciation: "Bien" },
  { subject: "Anglais", coef: 3, interro1: 16, interro2: 15, devoir: 15, composition: 16, moyenne: 15.5, moyenneClasse: 13.2, rang: 5, appreciation: "Excellent" },
  { subject: "Histoire-Géo", coef: 3, interro1: 11, interro2: 12, devoir: 13, composition: 12, moyenne: 12.0, moyenneClasse: 11.5, rang: 15, appreciation: "Assez bien" },
  { subject: "SVT", coef: 2, interro1: 16, interro2: 17, devoir: 15, composition: 16, moyenne: 16.0, moyenneClasse: 12.8, rang: 3, appreciation: "Excellent" },
  { subject: "Physique-Chimie", coef: 2, interro1: 13, interro2: 14, devoir: 13, composition: 14, moyenne: 13.5, moyenneClasse: 12.0, rang: 10, appreciation: "Bien" },
  { subject: "EPS", coef: 1, interro1: 17, interro2: 18, devoir: 16, composition: 17, moyenne: 17.0, moyenneClasse: 14.5, rang: 2, appreciation: "Excellent" },
  { subject: "Arts Plastiques", coef: 1, interro1: 15, interro2: 14, devoir: 15, composition: 15, moyenne: 14.75, moyenneClasse: 13.5, rang: 7, appreciation: "Très bien" },
];

// Mock bulletins
const bulletins = [
  { id: 1, year: "2023-2024", trimester: "3ème Trimestre", moyenne: 15.0, rang: 5, total: 42, mention: "Bien", status: "Disponible" },
  { id: 2, year: "2023-2024", trimester: "2ème Trimestre", moyenne: 14.5, rang: 7, total: 42, mention: "Assez Bien", status: "Disponible" },
  { id: 3, year: "2023-2024", trimester: "1er Trimestre", moyenne: 14.2, rang: 8, total: 42, mention: "Assez Bien", status: "Disponible" },
];

// Mock schedule
const emploiDuTemps = [
  { jour: "Lundi", heures: [
    { heure: "07:00-09:00", matiere: "Mathématiques", salle: "Salle 101", professeur: "M. Kouassi" },
    { heure: "09:00-11:00", matiere: "Français", salle: "Salle 101", professeur: "Mme Bamba" },
    { heure: "11:00-12:00", matiere: "Anglais", salle: "Salle 101", professeur: "M. Traoré" },
    { heure: "14:00-16:00", matiere: "EPS", salle: "Gymnase", professeur: "M. Sanogo" },
  ]},
  { jour: "Mardi", heures: [
    { heure: "07:00-09:00", matiere: "Physique-Chimie", salle: "Labo", professeur: "Mme Koné" },
    { heure: "09:00-11:00", matiere: "Histoire-Géo", salle: "Salle 101", professeur: "Mme Ouattara" },
    { heure: "14:00-16:00", matiere: "SVT", salle: "Labo SVT", professeur: "M. Diallo" },
  ]},
  { jour: "Mercredi", heures: [
    { heure: "07:00-09:00", matiere: "Mathématiques", salle: "Salle 101", professeur: "M. Kouassi" },
    { heure: "09:00-11:00", matiere: "Français", salle: "Salle 101", professeur: "Mme Bamba" },
  ]},
  { jour: "Jeudi", heures: [
    { heure: "07:00-09:00", matiere: "Anglais", salle: "Salle 101", professeur: "M. Traoré" },
    { heure: "09:00-11:00", matiere: "Mathématiques", salle: "Salle 101", professeur: "M. Kouassi" },
    { heure: "14:00-16:00", matiere: "Physique-Chimie", salle: "Labo", professeur: "Mme Koné" },
  ]},
  { jour: "Vendredi", heures: [
    { heure: "07:00-09:00", matiere: "SVT", salle: "Labo SVT", professeur: "M. Diallo" },
    { heure: "09:00-11:00", matiere: "Histoire-Géo", salle: "Salle 101", professeur: "Mme Ouattara" },
    { heure: "14:00-16:00", matiere: "Arts Plastiques", salle: "Salle Arts", professeur: "Mme Yao" },
  ]},
];

// Mock resources
const ressourcesPedagogiques = [
  { 
    id: 1, 
    matiere: "Mathématiques", 
    titre: "Cours - Les équations du premier degré",
    type: "PDF",
    taille: "2.5 MB",
    dateAjout: "2024-11-01",
    professeur: "M. Kouassi",
    chapitre: "Algèbre"
  },
  { 
    id: 2, 
    matiere: "Mathématiques", 
    titre: "Exercices corrigés - Fractions",
    type: "PDF",
    taille: "1.8 MB",
    dateAjout: "2024-10-28",
    professeur: "M. Kouassi",
    chapitre: "Arithmétique"
  },
  { 
    id: 3, 
    matiere: "Français", 
    titre: "La conjugaison - Temps composés",
    type: "Video",
    taille: "45 MB",
    dateAjout: "2024-11-02",
    professeur: "Mme Bamba",
    chapitre: "Grammaire"
  },
  { 
    id: 4, 
    matiere: "Français", 
    titre: "Rédaction - Méthodologie",
    type: "PDF",
    taille: "3.2 MB",
    dateAjout: "2024-10-25",
    professeur: "Mme Bamba",
    chapitre: "Expression écrite"
  },
  { 
    id: 5, 
    matiere: "Anglais", 
    titre: "Vocabulary - Daily Life",
    type: "Audio",
    taille: "12 MB",
    dateAjout: "2024-11-03",
    professeur: "M. Traoré",
    chapitre: "Vocabulaire"
  },
  { 
    id: 6, 
    matiere: "Anglais", 
    titre: "Grammar - Present Perfect",
    type: "Presentation",
    taille: "5.5 MB",
    dateAjout: "2024-10-30",
    professeur: "M. Traoré",
    chapitre: "Grammaire"
  },
  { 
    id: 7, 
    matiere: "SVT", 
    titre: "Le système digestif - Cours complet",
    type: "Video",
    taille: "120 MB",
    dateAjout: "2024-11-04",
    professeur: "M. Diallo",
    chapitre: "Corps humain"
  },
  { 
    id: 8, 
    matiere: "Physique-Chimie", 
    titre: "Les états de la matière",
    type: "PDF",
    taille: "4.1 MB",
    dateAjout: "2024-10-29",
    professeur: "Mme Koné",
    chapitre: "Chimie"
  },
  { 
    id: 9, 
    matiere: "Histoire-Géo", 
    titre: "La Côte d'Ivoire précoloniale",
    type: "Presentation",
    taille: "8.2 MB",
    dateAjout: "2024-11-01",
    professeur: "Mme Ouattara",
    chapitre: "Histoire"
  },
];

// Mock devoirs à rendre
const devoirsARendre = [
  { id: 1, matiere: "Mathématiques", titre: "Exercices page 45-46", dateRendu: "2024-11-10", status: "À faire" },
  { id: 2, matiere: "Français", titre: "Rédaction: Ma famille", dateRendu: "2024-11-08", status: "À faire" },
  { id: 3, matiere: "Anglais", titre: "Vocabulary quiz preparation", dateRendu: "2024-11-07", status: "En cours" },
  { id: 4, matiere: "SVT", titre: "Schéma du système digestif", dateRendu: "2024-11-12", status: "À faire" },
];

const subjectColors: Record<string, string> = {
  "Mathématiques": "bg-blue-500/10 text-blue-600 border-blue-200",
  "Français": "bg-green-500/10 text-green-600 border-green-200",
  "Anglais": "bg-purple-500/10 text-purple-600 border-purple-200",
  "Physique-Chimie": "bg-orange-500/10 text-orange-600 border-orange-200",
  "SVT": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "Histoire-Géo": "bg-amber-500/10 text-amber-600 border-amber-200",
  "EPS": "bg-red-500/10 text-red-600 border-red-200",
  "Arts Plastiques": "bg-pink-500/10 text-pink-600 border-pink-200",
};

export default function StudentPortal() {
  const [selectedTrimester, setSelectedTrimester] = useState("1er Trimestre");
  const [selectedYear, setSelectedYear] = useState("2023-2024");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("all");

  const moyenneGenerale = notesParMatiere.reduce((acc, n) => acc + (n.moyenne * n.coef), 0) / 
                          notesParMatiere.reduce((acc, n) => acc + n.coef, 0);
  
  const moyenneClasseGenerale = notesParMatiere.reduce((acc, n) => acc + (n.moyenneClasse * n.coef), 0) / 
                                notesParMatiere.reduce((acc, n) => acc + n.coef, 0);

  const rangGeneral = 8;
  const totalEleves = 42;

  const handleDownloadBulletin = (id: number) => {
    toast.success("Téléchargement du bulletin en cours...");
  };

  const handleDownloadResource = (resource: typeof ressourcesPedagogiques[0]) => {
    toast.success(`Téléchargement de "${resource.titre}" en cours...`);
  };

  const handleViewResource = (resource: typeof ressourcesPedagogiques[0]) => {
    toast.info(`Ouverture de "${resource.titre}"...`);
  };

  const getNoteColor = (note: number) => {
    if (note >= 16) return "text-emerald-600";
    if (note >= 14) return "text-blue-600";
    if (note >= 10) return "text-amber-600";
    return "text-red-600";
  };

  const getMentionBadge = (mention: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      "Très Bien": "bg-blue-500/10 text-blue-600 border-blue-200",
      "Bien": "bg-blue-500/10 text-blue-600 border-blue-200",
      "Assez Bien": "bg-amber-500/10 text-amber-600 border-amber-200",
      "Passable": "bg-muted text-muted-foreground"
    };
    return colors[mention] || "bg-muted text-muted-foreground";
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF": return <File className="h-4 w-4" />;
      case "Video": return <Video className="h-4 w-4" />;
      case "Audio": return <Play className="h-4 w-4" />;
      case "Presentation": return <Presentation className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "PDF": return "bg-red-500/10 text-red-600";
      case "Video": return "bg-blue-500/10 text-blue-600";
      case "Audio": return "bg-purple-500/10 text-purple-600";
      case "Presentation": return "bg-orange-500/10 text-orange-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredResources = ressourcesPedagogiques.filter(r => {
    const matchSearch = r.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.chapitre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMatiere = selectedMatiere === "all" || r.matiere === selectedMatiere;
    return matchSearch && matchMatiere;
  });

  const matieres = [...new Set(ressourcesPedagogiques.map(r => r.matiere))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Portail Élève</h1>
            <p className="text-muted-foreground">
              Bienvenue, {mockStudent.name} - {mockStudent.class}
            </p>
            <p className="text-xs text-muted-foreground">Matricule: {mockStudent.matricule}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1er Trimestre">1er Trimestre</SelectItem>
              <SelectItem value="2ème Trimestre">2ème Trimestre</SelectItem>
              <SelectItem value="3ème Trimestre">3ème Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getNoteColor(moyenneGenerale)}`}>
              {moyenneGenerale.toFixed(2)}/20
            </div>
            <Progress value={(moyenneGenerale / 20) * 100} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Moy. classe: {moyenneClasseGenerale.toFixed(2)}/20
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classement</CardTitle>
            <Medal className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {rangGeneral}<sup>ème</sup>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Sur {totalEleves} élèves
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs à Rendre</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {devoirsARendre.filter(d => d.status !== "Rendu").length}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ressources</CardTitle>
            <BookMarked className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {ressourcesPedagogiques.length}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="notes" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="bulletins" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Bulletins</span>
          </TabsTrigger>
          <TabsTrigger value="emploi" className="flex items-center gap-2 py-3">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Emploi du Temps</span>
          </TabsTrigger>
          <TabsTrigger value="ressources" className="flex items-center gap-2 py-3">
            <Folder className="h-4 w-4" />
            <span className="hidden sm:inline">Ressources</span>
          </TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes par Matière - {selectedTrimester}</CardTitle>
              <CardDescription>Détail des notes obtenues pour chaque évaluation</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Matière</TableHead>
                      <TableHead className="text-center">Coef</TableHead>
                      <TableHead className="text-center">Int. 1</TableHead>
                      <TableHead className="text-center">Int. 2</TableHead>
                      <TableHead className="text-center">Devoir</TableHead>
                      <TableHead className="text-center">Compo.</TableHead>
                      <TableHead className="text-center">Moyenne</TableHead>
                      <TableHead className="text-center">Rang</TableHead>
                      <TableHead>Appréciation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notesParMatiere.map((note, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={subjectColors[note.subject]}>
                              {note.subject}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{note.coef}</TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.interro1)}>{note.interro1}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.interro2)}>{note.interro2}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.devoir)}>{note.devoir}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.composition)}>{note.composition}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${getNoteColor(note.moyenne)} bg-transparent font-bold`}>
                            {note.moyenne.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{note.rang}ème</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMentionBadge(note.appreciation)}>
                            {note.appreciation}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-6 bg-muted/30 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Moyenne Générale Pondérée:</span>
                  <span className={`text-3xl font-bold ${getNoteColor(moyenneGenerale)}`}>
                    {moyenneGenerale.toFixed(2)} / 20
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Devoirs à rendre */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Devoirs à Rendre
              </CardTitle>
              <CardDescription>Travaux en attente cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devoirsARendre.map((devoir) => (
                  <div key={devoir.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={subjectColors[devoir.matiere]}>
                        {devoir.matiere}
                      </Badge>
                      <div>
                        <p className="font-medium">{devoir.titre}</p>
                        <p className="text-xs text-muted-foreground">À rendre le {devoir.dateRendu}</p>
                      </div>
                    </div>
                    <Badge variant={devoir.status === "À faire" ? "destructive" : devoir.status === "En cours" ? "default" : "secondary"}>
                      {devoir.status === "À faire" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {devoir.status === "En cours" && <Clock className="h-3 w-3 mr-1" />}
                      {devoir.status === "Rendu" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {devoir.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulletins Tab */}
        <TabsContent value="bulletins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Bulletins</CardTitle>
              <CardDescription>Téléchargez vos bulletins scolaires</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Année</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-center">Moyenne</TableHead>
                    <TableHead className="text-center">Rang</TableHead>
                    <TableHead className="text-center">Mention</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulletins.map((bulletin) => (
                    <TableRow key={bulletin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {bulletin.year}
                        </div>
                      </TableCell>
                      <TableCell>{bulletin.trimester}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getNoteColor(bulletin.moyenne)} bg-transparent font-bold`}>
                          {bulletin.moyenne.toFixed(2)}/20
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {bulletin.rang}<sup>ème</sup>/{bulletin.total}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getMentionBadge(bulletin.mention)}>
                          {bulletin.mention}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleDownloadBulletin(bulletin.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emploi du temps Tab */}
        <TabsContent value="emploi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Mon Emploi du Temps
              </CardTitle>
              <CardDescription>Planning hebdomadaire des cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {emploiDuTemps.map((jour) => (
                  <div key={jour.jour} className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      {jour.jour}
                    </h3>
                    <div className="grid gap-2 ml-6">
                      {jour.heures.map((cours, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 rounded-lg border ${subjectColors[cours.matiere] || 'bg-muted'}`}
                        >
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="font-mono">
                              <Clock className="h-3 w-3 mr-1" />
                              {cours.heure}
                            </Badge>
                            <div>
                              <p className="font-medium">{cours.matiere}</p>
                              <p className="text-xs text-muted-foreground">{cours.professeur}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {cours.salle}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ressources Tab */}
        <TabsContent value="ressources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                Ressources Pédagogiques
              </CardTitle>
              <CardDescription>Cours, exercices et supports de formation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher une ressource..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedMatiere} onValueChange={setSelectedMatiere}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Toutes les matières" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les matières</SelectItem>
                    {matieres.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resources List */}
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredResources.map((resource) => (
                    <div 
                      key={resource.id} 
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getResourceTypeColor(resource.type)}`}>
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <p className="font-medium">{resource.titre}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={subjectColors[resource.matiere]}>
                              {resource.matiere}
                            </Badge>
                            <span className="text-xs text-muted-foreground">• {resource.chapitre}</span>
                            <span className="text-xs text-muted-foreground">• {resource.taille}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Par {resource.professeur} • Ajouté le {resource.dateAjout}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewResource(resource)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadResource(resource)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {filteredResources.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune ressource trouvée</p>
                  <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
