import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, Users, Clock, Calendar, CheckCircle, AlertCircle, 
  FileText, TrendingUp, GraduationCap, ClipboardList, Bell, Plus,
  ChevronRight, Star, BarChart3
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { toast } from "sonner";

const Enseignant = () => {
  const [selectedClass, setSelectedClass] = useState("3ème A");

  const mesClasses = [
    { classe: "3ème A", matiere: "Mathématiques", effectif: 32, heures: 5, moyenne: 12.4 },
    { classe: "3ème B", matiere: "Mathématiques", effectif: 30, heures: 5, moyenne: 11.8 },
    { classe: "4ème A", matiere: "Mathématiques", effectif: 35, heures: 4, moyenne: 13.2 },
    { classe: "5ème C", matiere: "Mathématiques", effectif: 28, heures: 4, moyenne: 14.1 },
  ];

  const emploiDuTemps = [
    { jour: "Lundi", heures: ["8h-10h: 3ème A", "10h-12h: 4ème A", "14h-16h: 3ème B"] },
    { jour: "Mardi", heures: ["8h-10h: 5ème C", "14h-16h: 3ème A"] },
    { jour: "Mercredi", heures: ["8h-10h: 3ème B", "10h-12h: 5ème C"] },
    { jour: "Jeudi", heures: ["8h-10h: 4ème A", "14h-16h: 3ème A", "16h-17h: Soutien"] },
    { jour: "Vendredi", heures: ["8h-10h: 3ème B", "10h-12h: 4ème A"] },
  ];

  const prochainsCours = [
    { heure: "8h00", classe: "3ème A", salle: "S12", chapitre: "Équations du 2nd degré" },
    { heure: "10h00", classe: "4ème A", salle: "S08", chapitre: "Théorème de Pythagore" },
    { heure: "14h00", classe: "3ème B", salle: "S12", chapitre: "Fonctions affines" },
  ];

  const tachesEnAttente = [
    { id: 1, tache: "Corriger devoirs 3ème A", deadline: "Aujourd'hui", priorite: "haute", done: false },
    { id: 2, tache: "Préparer évaluation 4ème A", deadline: "Demain", priorite: "moyenne", done: false },
    { id: 3, tache: "Remplir bulletins 3ème B", deadline: "15 Jan", priorite: "haute", done: false },
    { id: 4, tache: "Conseil de classe 3ème A", deadline: "18 Jan", priorite: "haute", done: false },
    { id: 5, tache: "Réunion parents 4ème", deadline: "20 Jan", priorite: "moyenne", done: true },
  ];

  const evolutionNotes = [
    { periode: "Devoir 1", "3ème A": 11.2, "3ème B": 10.8, "4ème A": 12.5 },
    { periode: "Devoir 2", "3ème A": 11.8, "3ème B": 11.2, "4ème A": 12.8 },
    { periode: "Interro 1", "3ème A": 12.1, "3ème B": 11.5, "4ème A": 13.2 },
    { periode: "Devoir 3", "3ème A": 12.4, "3ème B": 11.8, "4ème A": 13.5 },
    { periode: "Composition", "3ème A": 12.8, "3ème B": 12.2, "4ème A": 14.1 },
  ];

  const elevesEnDifficulte = [
    { nom: "Traoré Sekou", classe: "3ème A", moyenne: 7.5, tendance: "stable" },
    { nom: "Koné Marie", classe: "3ème B", moyenne: 8.2, tendance: "up" },
    { nom: "Bamba Paul", classe: "4ème A", moyenne: 9.1, tendance: "down" },
  ];

  const meilleurEleves = [
    { nom: "Diallo Fatou", classe: "5ème C", moyenne: 18.5 },
    { nom: "Yao Jean", classe: "4ème A", moyenne: 17.8 },
    { nom: "Kouassi Eric", classe: "3ème A", moyenne: 17.2 },
  ];

  const [tasks, setTasks] = useState(tachesEnAttente);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    toast.success("Tâche mise à jour");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Espace Enseignant</h1>
          <p className="text-muted-foreground">M. Kouadio - Mathématiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />3 notifications
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />Nouvelle note
          </Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mes classes</p>
              <p className="text-2xl font-bold">{mesClasses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Élèves</p>
              <p className="text-2xl font-bold">{mesClasses.reduce((sum, c) => sum + c.effectif, 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Heures/semaine</p>
              <p className="text-2xl font-bold">{mesClasses.reduce((sum, c) => sum + c.heures, 0)}h</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moyenne générale</p>
              <p className="text-2xl font-bold">{(mesClasses.reduce((sum, c) => sum + c.moyenne, 0) / mesClasses.length).toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prochains cours */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Prochains Cours Aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {prochainsCours.map((cours, i) => (
              <div key={i} className="flex-shrink-0 p-4 border rounded-lg bg-accent/30 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{cours.heure}</Badge>
                  <span className="font-medium">{cours.classe}</span>
                </div>
                <p className="text-sm text-muted-foreground">Salle {cours.salle}</p>
                <p className="text-sm mt-1">{cours.chapitre}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">Mes Classes</TabsTrigger>
          <TabsTrigger value="notes">Notes & Évaluations</TabsTrigger>
          <TabsTrigger value="emploi">Emploi du Temps</TabsTrigger>
          <TabsTrigger value="taches">Tâches</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Mes Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mesClasses.map((classe, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedClass(classe.classe)}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{classe.classe}</p>
                          <p className="text-sm text-muted-foreground">{classe.matiere} - {classe.heures}h/sem</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{classe.effectif} élèves</p>
                          <p className="text-sm text-muted-foreground">Moy: {classe.moyenne}/20</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Élèves en Difficulté
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {elevesEnDifficulte.map((eleve, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{eleve.nom}</p>
                          <p className="text-xs text-muted-foreground">{eleve.classe}</p>
                        </div>
                        <Badge variant="destructive">{eleve.moyenne}/20</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Meilleurs Élèves
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meilleurEleves.map((eleve, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{eleve.nom}</p>
                          <p className="text-xs text-muted-foreground">{eleve.classe}</p>
                        </div>
                        <Badge className="bg-green-500">{eleve.moyenne}/20</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Moyennes</CardTitle>
                <CardDescription>Par classe et par évaluation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolutionNotes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periode" tick={{ fontSize: 10 }} />
                    <YAxis domain={[8, 16]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="3ème A" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="3ème B" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="4ème A" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Saisir les notes", icon: ClipboardList, color: "bg-blue-500" },
                  { label: "Créer une évaluation", icon: FileText, color: "bg-green-500" },
                  { label: "Voir les statistiques", icon: BarChart3, color: "bg-amber-500" },
                  { label: "Générer un bilan", icon: TrendingUp, color: "bg-purple-500" },
                ].map((action, i) => (
                  <Button key={i} variant="outline" className="w-full justify-start" onClick={() => toast.success(`Action: ${action.label}`)}>
                    <div className={`p-1 ${action.color} rounded mr-3`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emploi">
          <Card>
            <CardHeader>
              <CardTitle>Emploi du Temps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {emploiDuTemps.map((jour, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 text-center">{jour.jour}</h3>
                    <div className="space-y-2">
                      {jour.heures.map((h, j) => (
                        <div key={j} className="text-xs p-2 bg-primary/10 rounded text-center">
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taches">
          <Card>
            <CardHeader>
              <CardTitle>Tâches en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((tache) => (
                  <div key={tache.id} className={`flex items-center justify-between p-3 border rounded-lg ${tache.done ? "bg-muted opacity-60" : ""}`}>
                    <div className="flex items-center gap-3">
                      <Checkbox checked={tache.done} onCheckedChange={() => toggleTask(tache.id)} />
                      <div>
                        <p className={`font-medium ${tache.done ? "line-through" : ""}`}>{tache.tache}</p>
                        <p className="text-sm text-muted-foreground">Échéance: {tache.deadline}</p>
                      </div>
                    </div>
                    <Badge variant={tache.priorite === "haute" ? "destructive" : "secondary"}>
                      {tache.priorite}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Enseignant;
