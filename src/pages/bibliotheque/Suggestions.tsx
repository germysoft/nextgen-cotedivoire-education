import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Star, 
  BookMarked,
  GraduationCap,
  Brain,
  Target,
  Sparkles,
  ThumbsUp,
  Eye,
  Send,
  History,
  BarChart3,
  ArrowRight
} from "lucide-react";

// Types
interface StudentProfile {
  id: string;
  nom: string;
  classe: string;
  matieres: string[];
  historiqueEmprunts: {
    livreId: string;
    titre: string;
    categorie: string;
    dateEmprunt: string;
    note?: number;
  }[];
  preferences: string[];
  moyenneGenerale: number;
}

interface BookSuggestion {
  id: string;
  titre: string;
  auteur: string;
  categorie: string;
  niveau: string;
  matchScore: number;
  raison: string;
  disponible: boolean;
  notation: number;
}

interface ClassSuggestion {
  classe: string;
  suggestions: BookSuggestion[];
  basedOn: string;
}

// Mock data
const mockStudentProfiles: StudentProfile[] = [
  {
    id: "ELV001",
    nom: "Koné Aminata",
    classe: "Terminale A",
    matieres: ["Français", "Philosophie", "Histoire-Géo", "Anglais"],
    historiqueEmprunts: [
      { livreId: "LIV001", titre: "Les Misérables", categorie: "Littérature", dateEmprunt: "2024-01-15", note: 5 },
      { livreId: "LIV010", titre: "Candide", categorie: "Philosophie", dateEmprunt: "2024-01-02", note: 4 },
      { livreId: "LIV015", titre: "L'Étranger", categorie: "Littérature", dateEmprunt: "2023-12-10", note: 5 },
    ],
    preferences: ["Littérature française", "Philosophie", "Romans classiques"],
    moyenneGenerale: 15.5
  },
  {
    id: "ELV002",
    nom: "Traoré Moussa",
    classe: "Terminale C",
    matieres: ["Mathématiques", "Physique-Chimie", "SVT"],
    historiqueEmprunts: [
      { livreId: "LIV020", titre: "Mathématiques Terminale C", categorie: "Manuels", dateEmprunt: "2024-01-18" },
      { livreId: "LIV021", titre: "Exercices de Physique", categorie: "Sciences", dateEmprunt: "2024-01-05" },
    ],
    preferences: ["Sciences", "Mathématiques", "Préparation concours"],
    moyenneGenerale: 16.2
  },
  {
    id: "ELV003",
    nom: "Coulibaly Fatou",
    classe: "1ère D",
    matieres: ["Mathématiques", "Physique-Chimie", "Français"],
    historiqueEmprunts: [
      { livreId: "LIV030", titre: "Chimie Organique", categorie: "Sciences", dateEmprunt: "2024-01-12", note: 4 },
    ],
    preferences: ["Chimie", "Biologie"],
    moyenneGenerale: 14.8
  },
];

const mockSuggestions: BookSuggestion[] = [
  { id: "SUG001", titre: "Germinal", auteur: "Émile Zola", categorie: "Littérature", niveau: "Terminale", matchScore: 95, raison: "Basé sur votre intérêt pour la littérature française classique", disponible: true, notation: 4.8 },
  { id: "SUG002", titre: "Le Rouge et le Noir", auteur: "Stendhal", categorie: "Littérature", niveau: "Terminale", matchScore: 92, raison: "Recommandé pour le programme de Français Terminale A", disponible: true, notation: 4.6 },
  { id: "SUG003", titre: "Critique de la raison pure", auteur: "Emmanuel Kant", categorie: "Philosophie", niveau: "Terminale", matchScore: 88, raison: "Complète votre lecture de Candide en philosophie", disponible: false, notation: 4.5 },
  { id: "SUG004", titre: "Les Fleurs du Mal", auteur: "Charles Baudelaire", categorie: "Poésie", niveau: "Terminale", matchScore: 85, raison: "Au programme du BAC littéraire", disponible: true, notation: 4.9 },
  { id: "SUG005", titre: "L'Art de la guerre", auteur: "Sun Tzu", categorie: "Philosophie", niveau: "Tous niveaux", matchScore: 78, raison: "Populaire parmi les élèves de votre classe", disponible: true, notation: 4.7 },
];

const mockClassSuggestions: ClassSuggestion[] = [
  {
    classe: "Terminale A",
    basedOn: "Programme littéraire et historique",
    suggestions: [
      { id: "CL001", titre: "Anthologie de la poésie française", auteur: "Collectif", categorie: "Poésie", niveau: "Terminale", matchScore: 95, raison: "Essentiel pour le BAC", disponible: true, notation: 4.8 },
      { id: "CL002", titre: "Histoire de l'Afrique", auteur: "Joseph Ki-Zerbo", categorie: "Histoire", niveau: "Terminale", matchScore: 90, raison: "Programme d'histoire-géographie", disponible: true, notation: 4.7 },
    ]
  },
  {
    classe: "Terminale C",
    basedOn: "Programme scientifique intensif",
    suggestions: [
      { id: "CL003", titre: "Annales BAC Maths C", auteur: "Éditions Hatier", categorie: "Mathématiques", niveau: "Terminale", matchScore: 98, raison: "Préparation BAC", disponible: true, notation: 4.9 },
      { id: "CL004", titre: "Physique Quantique pour débutants", auteur: "Paul Lévy", categorie: "Physique", niveau: "Terminale", matchScore: 85, raison: "Approfondissement du programme", disponible: true, notation: 4.5 },
    ]
  },
  {
    classe: "3ème",
    basedOn: "Préparation au BEPC",
    suggestions: [
      { id: "CL005", titre: "Révisions BEPC Toutes matières", auteur: "Collectif", categorie: "Révisions", niveau: "3ème", matchScore: 96, raison: "Préparation examen", disponible: true, notation: 4.6 },
    ]
  },
];

const categories = ["Tous", "Littérature", "Sciences", "Mathématiques", "Histoire", "Philosophie", "Langues"];
const classes = ["Toutes", "Terminale A", "Terminale C", "Terminale D", "1ère A", "1ère C", "1ère D", "2nde", "3ème"];

export default function Suggestions() {
  const [activeTab, setActiveTab] = useState("personnalisees");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [selectedClasse, setSelectedClasse] = useState("Toutes");
  const [selectedCategorie, setSelectedCategorie] = useState("Tous");
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>(mockSuggestions);

  const handleSelectStudent = (studentId: string) => {
    const student = mockStudentProfiles.find(s => s.id === studentId);
    setSelectedStudent(student || null);
    if (student) {
      toast.success(`Suggestions générées pour ${student.nom}`);
    }
  };

  const handleReserve = (bookId: string, titre: string) => {
    toast.success(`Réservation demandée pour "${titre}"`);
  };

  const handleSendSuggestion = (studentId: string, bookTitle: string) => {
    toast.success(`Suggestion envoyée à l'élève`);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-orange-600";
  };

  const getMatchBg = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 75) return "bg-yellow-100";
    return "bg-orange-100";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            Suggestions de lecture
          </h1>
          <p className="text-muted-foreground mt-1">
            Recommandations intelligentes basées sur l'historique et les matières
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">847</p>
              <p className="text-sm text-muted-foreground">Suggestions générées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">Taux d'acceptation</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-sm text-muted-foreground">Précision algorithme</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Nouveaux emprunts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personnalisees" className="gap-2">
            <Users className="h-4 w-4" />
            Par élève
          </TabsTrigger>
          <TabsTrigger value="classe" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Par classe
          </TabsTrigger>
          <TabsTrigger value="tendances" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="historique" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Suggestions personnalisées */}
        <TabsContent value="personnalisees" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sélectionner un élève
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Rechercher un élève..." />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {mockStudentProfiles.map(student => (
                    <div
                      key={student.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                      }`}
                      onClick={() => handleSelectStudent(student.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{student.nom}</p>
                          <p className="text-sm text-muted-foreground">{student.classe}</p>
                        </div>
                        <Badge variant="secondary">{student.historiqueEmprunts.length} emprunts</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {selectedStudent ? `Suggestions pour ${selectedStudent.nom}` : "Sélectionnez un élève"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudent ? (
                  <div className="space-y-6">
                    {/* Profil de lecture */}
                    <div className="p-4 bg-muted rounded-lg space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Profil de lecture
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Matières principales:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedStudent.matieres.map(m => (
                              <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Préférences:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedStudent.preferences.map(p => (
                              <Badge key={p} className="text-xs bg-primary/20 text-primary">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Derniers emprunts:</span>
                        <div className="mt-1 space-y-1">
                          {selectedStudent.historiqueEmprunts.slice(0, 3).map(e => (
                            <div key={e.livreId} className="flex items-center justify-between text-sm">
                              <span>{e.titre}</span>
                              {e.note && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{e.note}/5</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Liste des suggestions */}
                    <div className="space-y-3">
                      {suggestions.map(sugg => (
                        <div key={sugg.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{sugg.titre}</h4>
                                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMatchBg(sugg.matchScore)} ${getMatchColor(sugg.matchScore)}`}>
                                  {sugg.matchScore}% match
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{sugg.auteur}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{sugg.categorie}</Badge>
                                <Badge variant="secondary">{sugg.niveau}</Badge>
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="h-3 w-3 fill-current" />
                                  <span className="text-xs">{sugg.notation}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                <Sparkles className="h-3 w-3 inline mr-1" />
                                {sugg.raison}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              {sugg.disponible ? (
                                <Button size="sm" onClick={() => handleReserve(sugg.id, sugg.titre)}>
                                  <BookMarked className="h-4 w-4 mr-1" />
                                  Réserver
                                </Button>
                              ) : (
                                <Button size="sm" variant="secondary" disabled>
                                  Indisponible
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleSendSuggestion(selectedStudent.id, sugg.titre)}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Envoyer
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Progress value={sugg.matchScore} className="h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez un élève pour voir les suggestions personnalisées</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Suggestions par classe */}
        <TabsContent value="classe" className="space-y-6">
          <div className="flex gap-4">
            <Select value={selectedClasse} onValueChange={setSelectedClasse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {mockClassSuggestions
              .filter(cs => selectedClasse === "Toutes" || cs.classe === selectedClasse)
              .map(classSugg => (
                <Card key={classSugg.classe}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        {classSugg.classe}
                      </span>
                      <Badge variant="outline">{classSugg.basedOn}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classSugg.suggestions.map(sugg => (
                        <div key={sugg.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{sugg.titre}</h4>
                              <p className="text-sm text-muted-foreground">{sugg.auteur}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{sugg.categorie}</Badge>
                                <div className={`px-2 py-0.5 rounded-full text-xs ${getMatchBg(sugg.matchScore)} ${getMatchColor(sugg.matchScore)}`}>
                                  {sugg.matchScore}%
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">{sugg.raison}</p>
                            </div>
                            <Button size="sm" variant={sugg.disponible ? "default" : "secondary"}>
                              {sugg.disponible ? "Disponible" : "Réserver"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Tendances */}
        <TabsContent value="tendances" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Livres les plus empruntés ce mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, titre: "Mathématiques Terminale C", emprunts: 45, categorie: "Manuels" },
                    { rank: 2, titre: "Les Misérables", emprunts: 38, categorie: "Littérature" },
                    { rank: 3, titre: "Physique-Chimie 3ème", emprunts: 32, categorie: "Sciences" },
                    { rank: 4, titre: "Annales BAC Français", emprunts: 28, categorie: "Révisions" },
                    { rank: 5, titre: "Histoire de la Côte d'Ivoire", emprunts: 24, categorie: "Histoire" },
                  ].map(book => (
                    <div key={book.rank} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        book.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                        book.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        book.rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {book.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{book.titre}</p>
                        <p className="text-sm text-muted-foreground">{book.categorie}</p>
                      </div>
                      <Badge variant="secondary">{book.emprunts} emprunts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Meilleures notes des élèves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { titre: "L'Étranger", auteur: "Albert Camus", note: 4.9, votes: 23 },
                    { titre: "Le Petit Prince", auteur: "Saint-Exupéry", note: 4.8, votes: 45 },
                    { titre: "Germinal", auteur: "Émile Zola", note: 4.7, votes: 18 },
                    { titre: "Une si longue lettre", auteur: "Mariama Bâ", note: 4.7, votes: 31 },
                    { titre: "Les Soleils des Indépendances", auteur: "A. Kourouma", note: 4.6, votes: 27 },
                  ].map((book, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{book.titre}</p>
                        <p className="text-sm text-muted-foreground">{book.auteur}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-bold">{book.note}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{book.votes} votes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Catégories populaires par niveau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Niveau</TableHead>
                    <TableHead>1ère catégorie</TableHead>
                    <TableHead>2ème catégorie</TableHead>
                    <TableHead>3ème catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Terminale</TableCell>
                    <TableCell><Badge>Manuels scolaires</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Littérature</Badge></TableCell>
                    <TableCell><Badge variant="outline">Philosophie</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1ère</TableCell>
                    <TableCell><Badge>Sciences</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Manuels</Badge></TableCell>
                    <TableCell><Badge variant="outline">Romans</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2nde</TableCell>
                    <TableCell><Badge>Romans</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Sciences</Badge></TableCell>
                    <TableCell><Badge variant="outline">Histoire</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3ème</TableCell>
                    <TableCell><Badge>Révisions BEPC</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Manuels</Badge></TableCell>
                    <TableCell><Badge variant="outline">Romans jeunesse</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique des suggestions */}
        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des suggestions envoyées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Livre suggéré</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Résultat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "2024-01-20", eleve: "Koné Aminata", livre: "Germinal", score: 95, resultat: "emprunte" },
                    { date: "2024-01-19", eleve: "Traoré Moussa", livre: "Exercices Physique avancés", score: 88, resultat: "emprunte" },
                    { date: "2024-01-18", eleve: "Coulibaly Fatou", livre: "Chimie Organique Tome 2", score: 92, resultat: "en_attente" },
                    { date: "2024-01-17", eleve: "Diallo Ibrahim", livre: "Mathématiques 2nde", score: 85, resultat: "refuse" },
                    { date: "2024-01-16", eleve: "Koné Aminata", livre: "Les Fleurs du Mal", score: 90, resultat: "emprunte" },
                  ].map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.eleve}</TableCell>
                      <TableCell>{item.livre}</TableCell>
                      <TableCell>
                        <span className={getMatchColor(item.score)}>{item.score}%</span>
                      </TableCell>
                      <TableCell>
                        {item.resultat === "emprunte" && (
                          <Badge className="bg-green-100 text-green-800">Emprunté</Badge>
                        )}
                        {item.resultat === "en_attente" && (
                          <Badge variant="secondary">En attente</Badge>
                        )}
                        {item.resultat === "refuse" && (
                          <Badge variant="outline">Refusé</Badge>
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
    </div>
  );
}
