import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Award, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const performanceMatiere = [
  { matiere: "Maths", moyenne: 14.5, objectif: 15, taux_reussite: 85 },
  { matiere: "Français", moyenne: 13.8, objectif: 14, taux_reussite: 82 },
  { matiere: "Anglais", moyenne: 15.2, objectif: 15, taux_reussite: 88 },
  { matiere: "SVT", moyenne: 13.5, objectif: 14, taux_reussite: 80 },
  { matiere: "Physique", moyenne: 12.8, objectif: 13, taux_reussite: 75 },
  { matiere: "Histoire", moyenne: 14.0, objectif: 14, taux_reussite: 83 },
];

const evolutionNotes = [
  { trimestre: "T1", moyenne_generale: 13.2, taux_reussite: 78 },
  { trimestre: "T2", moyenne_generale: 13.8, taux_reussite: 82 },
  { trimestre: "T3", moyenne_generale: 14.5, taux_reussite: 85 },
];

const radarData = [
  { matiere: "Maths", A: 14.5, B: 15 },
  { matiere: "Français", A: 13.8, B: 14 },
  { matiere: "Anglais", A: 15.2, B: 15 },
  { matiere: "Sciences", A: 13.5, B: 14 },
  { matiere: "Histoire", A: 14.0, B: 14 },
];

const prochainsTravaux = [
  { id: 1, titre: "Composition Maths 6ème", date: "2024-12-15", classe: "6ème A-B-C", statut: "À venir" },
  { id: 2, titre: "Devoir Français 5ème", date: "2024-12-12", classe: "5ème A-B", statut: "En cours" },
  { id: 3, titre: "Évaluation Anglais 4ème", date: "2024-12-10", classe: "4ème A", statut: "Terminé" },
  { id: 4, titre: "TP Physique 3ème", date: "2024-12-18", classe: "3ème A-B", statut: "À venir" },
];

const Pedagogique = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Tableau de Bord Pédagogique</h1>
          <p className="text-muted-foreground mt-2">Suivi des performances académiques et activités pédagogiques</p>
        </div>
        <Button>Rapport Pédagogique</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.5/20</div>
            <Progress value={72.5} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">+0.7 pts vs T2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">+3% vs T2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Dispensés</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248h</div>
            <Progress value={78} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">78% du programme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conseils Tenus</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/3</div>
            <Progress value={67} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Prochain: 20 Déc</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performances">Performances</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          <TabsTrigger value="travaux">Travaux & Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="performances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Matière</CardTitle>
                <CardDescription>Moyennes et taux de réussite</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceMatiere}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="matiere" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="moyenne" fill="hsl(var(--primary))" name="Moyenne" />
                    <Bar dataKey="objectif" fill="hsl(var(--secondary))" name="Objectif" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse Radar</CardTitle>
                <CardDescription>Comparaison moyenne vs objectif</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="matiere" />
                    <PolarRadiusAxis angle={90} domain={[0, 20]} />
                    <Radar name="Réel" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    <Radar name="Objectif" dataKey="B" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détails par Matière</CardTitle>
              <CardDescription>Vue d'ensemble des performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMatiere.map((matiere) => (
                  <div key={matiere.matiere} className="flex items-center gap-4">
                    <div className="w-32 font-medium">{matiere.matiere}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Moyenne: {matiere.moyenne}/20</span>
                        <span className="text-sm">Réussite: {matiere.taux_reussite}%</span>
                      </div>
                      <Progress value={(matiere.moyenne / 20) * 100} />
                    </div>
                    <Badge variant={matiere.moyenne >= matiere.objectif ? "default" : "secondary"}>
                      {matiere.moyenne >= matiere.objectif ? "Objectif atteint" : "En progression"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Trimestrielle</CardTitle>
              <CardDescription>Progression des moyennes et taux de réussite</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionNotes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="trimestre" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="moyenne_generale" stroke="hsl(var(--primary))" strokeWidth={3} name="Moyenne Générale" />
                  <Line yAxisId="right" type="monotone" dataKey="taux_reussite" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Taux Réussite %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travaux" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travaux et Évaluations à Venir</CardTitle>
              <CardDescription>Planning des prochaines évaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prochainsTravaux.map((travail) => (
                  <div key={travail.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{travail.titre}</p>
                        <p className="text-sm text-muted-foreground">{travail.classe}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">{travail.date}</span>
                      <Badge variant={
                        travail.statut === "Terminé" ? "default" :
                        travail.statut === "En cours" ? "secondary" :
                        "outline"
                      }>
                        {travail.statut}
                      </Badge>
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
};

export default Pedagogique;
