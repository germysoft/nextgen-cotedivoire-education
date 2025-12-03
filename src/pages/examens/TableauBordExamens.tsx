import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, Download, FileText,
  GraduationCap, Award, Users, Target, Calendar, Building, BookOpen,
  ArrowUpRight, ArrowDownRight, RefreshCw, Filter, Printer, Mail
} from "lucide-react";
import { toast } from "sonner";

// Mock data - Sessions d'examens
const sessionsData = [
  { id: "1", type: "BEPC", annee: "2024", statut: "Terminé", candidats: 45678, admis: 34567, tauxReussite: 75.7 },
  { id: "2", type: "BAC", annee: "2024", statut: "Terminé", candidats: 38234, admis: 26764, tauxReussite: 70.0 },
  { id: "3", type: "BEPC", annee: "2023", statut: "Archivé", candidats: 43210, admis: 31234, tauxReussite: 72.3 },
  { id: "4", type: "BAC", annee: "2023", statut: "Archivé", candidats: 36890, admis: 24567, tauxReussite: 66.6 },
  { id: "5", type: "BEPC", annee: "2022", statut: "Archivé", candidats: 41567, admis: 28567, tauxReussite: 68.7 },
  { id: "6", type: "BAC", annee: "2022", statut: "Archivé", candidats: 35123, admis: 22345, tauxReussite: 63.6 },
];

// Comparatif inter-années
const comparatifAnnees = [
  { annee: "2020", bepc: 62.3, bac: 58.4 },
  { annee: "2021", bepc: 65.8, bac: 61.2 },
  { annee: "2022", bepc: 68.7, bac: 63.6 },
  { annee: "2023", bepc: 72.3, bac: 66.6 },
  { annee: "2024", bepc: 75.7, bac: 70.0 },
];

// Réussite par centre
const reussiteParCentre = [
  { centre: "Abidjan Nord", bepc: 82.5, bac: 78.3, candidats: 12456 },
  { centre: "Abidjan Sud", bepc: 79.2, bac: 74.8, candidats: 11234 },
  { centre: "Bouaké", bepc: 71.4, bac: 65.2, candidats: 8567 },
  { centre: "San Pedro", bepc: 68.9, bac: 62.1, candidats: 6234 },
  { centre: "Yamoussoukro", bepc: 74.6, bac: 69.8, candidats: 7890 },
  { centre: "Korhogo", bepc: 66.3, bac: 58.9, candidats: 5678 },
  { centre: "Man", bepc: 63.8, bac: 56.4, candidats: 4321 },
  { centre: "Daloa", bepc: 70.2, bac: 64.5, candidats: 6543 },
];

// Réussite par matière
const reussiteParMatiere = [
  { matiere: "Mathématiques", moyenne: 11.2, tauxReussite: 62.4, coef: 4 },
  { matiere: "Français", moyenne: 12.8, tauxReussite: 74.6, coef: 4 },
  { matiere: "Sciences Physiques", moyenne: 10.5, tauxReussite: 58.3, coef: 3 },
  { matiere: "SVT", moyenne: 13.2, tauxReussite: 78.9, coef: 2 },
  { matiere: "Histoire-Géo", moyenne: 12.4, tauxReussite: 71.2, coef: 2 },
  { matiere: "Anglais", moyenne: 11.8, tauxReussite: 67.5, coef: 2 },
  { matiere: "Philosophie", moyenne: 10.9, tauxReussite: 60.8, coef: 3 },
  { matiere: "EPS", moyenne: 14.5, tauxReussite: 89.2, coef: 1 },
];

// Mentions distribution
const mentionsData = [
  { name: "Très Bien", value: 8.5, color: "hsl(var(--chart-1))" },
  { name: "Bien", value: 15.2, color: "hsl(var(--chart-2))" },
  { name: "Assez Bien", value: 24.8, color: "hsl(var(--chart-3))" },
  { name: "Passable", value: 26.5, color: "hsl(var(--chart-4))" },
  { name: "Non Admis", value: 25.0, color: "hsl(var(--destructive))" },
];

// Alertes anomalies
const anomalies = [
  { id: "1", type: "critique", centre: "Korhogo", description: "Taux de réussite 15% inférieur à la moyenne nationale", date: "2024-07-20" },
  { id: "2", type: "attention", centre: "Man", description: "Moyenne en Mathématiques anormalement basse (8.2/20)", date: "2024-07-19" },
  { id: "3", type: "info", centre: "San Pedro", description: "Écart significatif entre résultats BEPC et BAC", date: "2024-07-18" },
  { id: "4", type: "critique", matiere: "Physique", description: "Taux d'échec 47% - révision des sujets recommandée", date: "2024-07-17" },
  { id: "5", type: "attention", centre: "Daloa", description: "Nombre d'absences élevé le jour J (12%)", date: "2024-07-16" },
];

// Performance radar
const performanceRadar = [
  { subject: "Taux Réussite", A: 75, B: 70, fullMark: 100 },
  { subject: "Régularité", A: 82, B: 78, fullMark: 100 },
  { subject: "Progression", A: 88, B: 72, fullMark: 100 },
  { subject: "Équité", A: 65, B: 60, fullMark: 100 },
  { subject: "Efficacité", A: 78, B: 74, fullMark: 100 },
];

export default function TableauBordExamens() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedExam, setSelectedExam] = useState("tous");

  const getAnomalyBadge = (type: string) => {
    switch (type) {
      case "critique":
        return <Badge variant="destructive">Critique</Badge>;
      case "attention":
        return <Badge className="bg-orange-500">Attention</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const handleExportRapport = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} en cours...`, {
      description: "Le rapport sera téléchargé dans quelques instants"
    });
  };

  const currentYear = sessionsData.filter(s => s.annee === selectedYear);
  const totalCandidats = currentYear.reduce((acc, s) => acc + s.candidats, 0);
  const totalAdmis = currentYear.reduce((acc, s) => acc + s.admis, 0);
  const tauxGlobal = totalCandidats > 0 ? ((totalAdmis / totalCandidats) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Tableau de Bord Examens
          </h1>
          <p className="text-muted-foreground">Vue consolidée des sessions BEPC & BAC</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Examen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous</SelectItem>
              <SelectItem value="bepc">BEPC</SelectItem>
              <SelectItem value="bac">BAC</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleExportRapport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => handleExportRapport("excel")}>
            <FileText className="h-4 w-4 mr-2" />
            Rapport Direction
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Candidats {selectedYear}</p>
                <p className="text-3xl font-bold">{totalCandidats.toLocaleString()}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+5.7% vs {parseInt(selectedYear) - 1}</span>
                </div>
              </div>
              <div className="p-3 bg-primary/20 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admis</p>
                <p className="text-3xl font-bold">{totalAdmis.toLocaleString()}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+8.2% vs {parseInt(selectedYear) - 1}</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de Réussite Global</p>
                <p className="text-3xl font-bold">{tauxGlobal}%</p>
                <Progress value={Number(tauxGlobal)} className="mt-2 h-2" />
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertes Actives</p>
                <p className="text-3xl font-bold">{anomalies.filter(a => a.type === "critique").length}</p>
                <p className="text-sm text-orange-600 mt-1">
                  {anomalies.length} anomalies détectées
                </p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes critiques */}
      {anomalies.filter(a => a.type === "critique").length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alertes Critiques</AlertTitle>
          <AlertDescription>
            {anomalies.filter(a => a.type === "critique").length} anomalie(s) critique(s) nécessitent une attention immédiate.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="centres">Par Centre</TabsTrigger>
          <TabsTrigger value="matieres">Par Matière</TabsTrigger>
          <TabsTrigger value="comparatif">Comparatif</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Évolution taux de réussite */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Évolution du Taux de Réussite (5 ans)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={comparatifAnnees}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis domain={[50, 90]} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="bepc" name="BEPC" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="bac" name="BAC" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution des mentions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Distribution des Mentions {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mentionsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mentionsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sessions récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sessions d'Examens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Candidats</TableHead>
                    <TableHead className="text-right">Admis</TableHead>
                    <TableHead className="text-right">Taux Réussite</TableHead>
                    <TableHead>Tendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionsData.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {session.type}
                        </div>
                      </TableCell>
                      <TableCell>{session.annee}</TableCell>
                      <TableCell>
                        <Badge variant={session.statut === "Terminé" ? "default" : "secondary"}>
                          {session.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{session.candidats.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{session.admis.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold">{session.tauxReussite}%</TableCell>
                      <TableCell>
                        {session.tauxReussite > 70 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Par Centre */}
        <TabsContent value="centres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Taux de Réussite par Centre d'Examen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reussiteParCentre} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="centre" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bepc" name="BEPC" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="bac" name="BAC" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détail par Centre</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Centre</TableHead>
                    <TableHead className="text-right">Candidats</TableHead>
                    <TableHead className="text-right">BEPC</TableHead>
                    <TableHead className="text-right">BAC</TableHead>
                    <TableHead className="text-right">Écart Moyenne</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reussiteParCentre.map((centre, idx) => {
                    const moyenneNationale = 72.5;
                    const moyenneCentre = (centre.bepc + centre.bac) / 2;
                    const ecart = moyenneCentre - moyenneNationale;
                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{centre.centre}</TableCell>
                        <TableCell className="text-right">{centre.candidats.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{centre.bepc}%</TableCell>
                        <TableCell className="text-right">{centre.bac}%</TableCell>
                        <TableCell className={`text-right font-bold ${ecart >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {ecart >= 0 ? "+" : ""}{ecart.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          {ecart >= 5 ? (
                            <Badge className="bg-green-500">Excellent</Badge>
                          ) : ecart >= 0 ? (
                            <Badge variant="secondary">Normal</Badge>
                          ) : ecart >= -5 ? (
                            <Badge className="bg-orange-500">Attention</Badge>
                          ) : (
                            <Badge variant="destructive">Critique</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Par Matière */}
        <TabsContent value="matieres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Performance par Matière
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reussiteParMatiere}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="matiere" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="tauxReussite" name="Taux Réussite (%)" fill="hsl(var(--chart-1))" />
                  <Bar yAxisId="right" dataKey="moyenne" name="Moyenne /20" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée par Matière</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead className="text-center">Coefficient</TableHead>
                    <TableHead className="text-right">Moyenne</TableHead>
                    <TableHead className="text-right">Taux Réussite</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Recommandation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reussiteParMatiere.map((matiere, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{matiere.matiere}</TableCell>
                      <TableCell className="text-center">{matiere.coef}</TableCell>
                      <TableCell className="text-right">{matiere.moyenne}/20</TableCell>
                      <TableCell className="text-right font-bold">{matiere.tauxReussite}%</TableCell>
                      <TableCell>
                        <Progress 
                          value={matiere.tauxReussite} 
                          className={`h-2 ${matiere.tauxReussite < 65 ? "[&>div]:bg-red-500" : ""}`}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {matiere.tauxReussite < 65 ? "Renforcement nécessaire" : 
                         matiere.tauxReussite < 75 ? "Suivi régulier" : "Maintenir"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparatif */}
        <TabsContent value="comparatif" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Comparée BEPC vs BAC</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={comparatifAnnees}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis domain={[50, 90]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bepc" name="BEPC" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="bac" name="BAC" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="BEPC" dataKey="A" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
                    <Radar name="BAC" dataKey="B" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tableau Comparatif Inter-Années</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année</TableHead>
                    <TableHead className="text-right">BEPC (%)</TableHead>
                    <TableHead className="text-right">Évolution</TableHead>
                    <TableHead className="text-right">BAC (%)</TableHead>
                    <TableHead className="text-right">Évolution</TableHead>
                    <TableHead className="text-right">Moyenne Globale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparatifAnnees.map((annee, idx) => {
                    const prevAnnee = comparatifAnnees[idx - 1];
                    const evolBepc = prevAnnee ? annee.bepc - prevAnnee.bepc : 0;
                    const evolBac = prevAnnee ? annee.bac - prevAnnee.bac : 0;
                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-bold">{annee.annee}</TableCell>
                        <TableCell className="text-right">{annee.bepc}%</TableCell>
                        <TableCell className={`text-right ${evolBepc >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {idx > 0 && (
                            <span className="flex items-center justify-end gap-1">
                              {evolBepc >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                              {Math.abs(evolBepc).toFixed(1)}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{annee.bac}%</TableCell>
                        <TableCell className={`text-right ${evolBac >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {idx > 0 && (
                            <span className="flex items-center justify-end gap-1">
                              {evolBac >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                              {Math.abs(evolBac).toFixed(1)}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {((annee.bepc + annee.bac) / 2).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomalies */}
        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Détection Automatique d'Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomalie) => (
                  <div
                    key={anomalie.id}
                    className={`p-4 rounded-lg border ${
                      anomalie.type === "critique" ? "border-red-500 bg-red-50 dark:bg-red-950/20" :
                      anomalie.type === "attention" ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20" :
                      "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                          anomalie.type === "critique" ? "text-red-600" :
                          anomalie.type === "attention" ? "text-orange-600" :
                          "text-muted-foreground"
                        }`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getAnomalyBadge(anomalie.type)}
                            {anomalie.centre && <Badge variant="outline">{anomalie.centre}</Badge>}
                            {anomalie.matiere && <Badge variant="outline">{anomalie.matiere}</Badge>}
                          </div>
                          <p className="font-medium">{anomalie.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Détecté le {new Date(anomalie.date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Analyser
                        </Button>
                        <Button size="sm" variant={anomalie.type === "critique" ? "destructive" : "default"}>
                          Traiter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques anomalies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-600">
                    {anomalies.filter(a => a.type === "critique").length}
                  </p>
                  <p className="text-muted-foreground">Anomalies Critiques</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-600">
                    {anomalies.filter(a => a.type === "attention").length}
                  </p>
                  <p className="text-muted-foreground">Anomalies Attention</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-muted-foreground">
                    {anomalies.filter(a => a.type === "info").length}
                  </p>
                  <p className="text-muted-foreground">Informations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions rapides export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Rapports Direction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => handleExportRapport("pdf")}>
              <FileText className="h-4 w-4 mr-2" />
              Rapport Synthétique PDF
            </Button>
            <Button variant="outline" onClick={() => handleExportRapport("excel")}>
              <Download className="h-4 w-4 mr-2" />
              Données Complètes Excel
            </Button>
            <Button variant="outline" onClick={() => handleExportRapport("print")}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer Tableau de Bord
            </Button>
            <Button variant="outline" onClick={() => {
              toast.success("Rapport envoyé par email", { description: "Le rapport a été envoyé à la direction" });
            }}>
              <Mail className="h-4 w-4 mr-2" />
              Envoyer à la Direction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
