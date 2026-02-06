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
  ArrowUpRight, ArrowDownRight, RefreshCw, Printer, Mail, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data - Sessions d'examens
const sessionsData = [
  { id: "1", type: "BEPC", annee: "2024", statut: "completed", candidats: 45678, admis: 34567, tauxReussite: 75.7 },
  { id: "2", type: "BAC", annee: "2024", statut: "completed", candidats: 38234, admis: 26764, tauxReussite: 70.0 },
  { id: "3", type: "BEPC", annee: "2023", statut: "archived", candidats: 43210, admis: 31234, tauxReussite: 72.3 },
  { id: "4", type: "BAC", annee: "2023", statut: "archived", candidats: 36890, admis: 24567, tauxReussite: 66.6 },
  { id: "5", type: "BEPC", annee: "2022", statut: "archived", candidats: 41567, admis: 28567, tauxReussite: 68.7 },
  { id: "6", type: "BAC", annee: "2022", statut: "archived", candidats: 35123, admis: 22345, tauxReussite: 63.6 },
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

// Anomalies
const initialAnomalies = [
  { id: "1", type: "critique", centre: "Korhogo", description: "Taux de réussite 15% inférieur à la moyenne nationale", date: "2024-07-20", traite: false },
  { id: "2", type: "attention", centre: "Man", description: "Moyenne en Mathématiques anormalement basse (8.2/20)", date: "2024-07-19", traite: false },
  { id: "3", type: "info", centre: "San Pedro", description: "Écart significatif entre résultats BEPC et BAC", date: "2024-07-18", traite: false },
  { id: "4", type: "critique", matiere: "Physique", description: "Taux d'échec 47% - révision des sujets recommandée", date: "2024-07-17", traite: false },
  { id: "5", type: "attention", centre: "Daloa", description: "Nombre d'absences élevé le jour J (12%)", date: "2024-07-16", traite: false },
];

export default function TableauBordExamens() {
  const { t, language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedExam, setSelectedExam] = useState("tous");
  const [anomalies, setAnomalies] = useState(initialAnomalies);

  // Données traduites pour les mentions
  const mentionsData = [
    { name: t('exams.mentions.veryGood'), value: 8.5, color: "hsl(var(--chart-1))" },
    { name: t('exams.mentions.good'), value: 15.2, color: "hsl(var(--chart-2))" },
    { name: t('exams.mentions.fairlyGood'), value: 24.8, color: "hsl(var(--chart-3))" },
    { name: t('exams.mentions.passable'), value: 26.5, color: "hsl(var(--chart-4))" },
    { name: t('exams.mentions.notAdmitted'), value: 25.0, color: "hsl(var(--destructive))" },
  ];

  // Performance radar traduit
  const performanceRadar = [
    { subject: t('exams.radar.successRate'), A: 75, B: 70, fullMark: 100 },
    { subject: t('exams.radar.regularity'), A: 82, B: 78, fullMark: 100 },
    { subject: t('exams.radar.progression'), A: 88, B: 72, fullMark: 100 },
    { subject: t('exams.radar.equity'), A: 65, B: 60, fullMark: 100 },
    { subject: t('exams.radar.efficiency'), A: 78, B: 74, fullMark: 100 },
  ];

  const getAnomalyBadge = (type: string) => {
    switch (type) {
      case "critique":
        return <Badge variant="destructive">{t('exams.dashboard.critical')}</Badge>;
      case "attention":
        return <Badge className="bg-orange-500">{t('exams.dashboard.attention')}</Badge>;
      default:
        return <Badge variant="secondary">{t('exams.dashboard.info')}</Badge>;
    }
  };

  const getStatusBadge = (statut: string) => {
    if (statut === "completed") {
      return <Badge variant="default">{t('exams.dashboard.completed')}</Badge>;
    }
    return <Badge variant="secondary">{t('exams.dashboard.archived')}</Badge>;
  };

  const handleExportRapport = (format: string) => {
    if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("TABLEAU DE BORD EXAMENS - " + selectedYear, 105, 15, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 25);
      doc.text(`Candidats: ${totalCandidats.toLocaleString()} | Admis: ${totalAdmis.toLocaleString()} | Taux: ${tauxGlobal}%`, 14, 32);

      autoTable(doc, {
        startY: 40,
        head: [["Session", "Année", "Candidats", "Admis", "Taux de réussite"]],
        body: sessionsData.filter(s => s.annee === selectedYear).map(s => [s.type, s.annee, s.candidats.toLocaleString(), s.admis.toLocaleString(), s.tauxReussite + "%"]),
        headStyles: { fillColor: [59, 130, 246] },
      });

      let y = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Résultats par Centre", 14, y);
      autoTable(doc, {
        startY: y + 5,
        head: [["Centre", "Candidats", "BEPC %", "BAC %"]],
        body: reussiteParCentre.map(c => [c.centre, c.candidats.toLocaleString(), c.bepc + "%", c.bac + "%"]),
        headStyles: { fillColor: [59, 130, 246] },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Résultats par Matière", 14, y);
      autoTable(doc, {
        startY: y + 5,
        head: [["Matière", "Coef.", "Moyenne", "Taux réussite"]],
        body: reussiteParMatiere.map(m => [m.matiere, String(m.coef), m.moyenne + "/20", m.tauxReussite + "%"]),
        headStyles: { fillColor: [59, 130, 246] },
      });

      doc.save(`Tableau_Bord_Examens_${selectedYear}.pdf`);
      toast.success("PDF exporté avec succès");
    } else if (format === "excel") {
      const wb = XLSX.utils.book_new();
      const sessionsWs = XLSX.utils.json_to_sheet(sessionsData.map(s => ({ Type: s.type, Année: s.annee, Candidats: s.candidats, Admis: s.admis, "Taux (%)": s.tauxReussite })));
      XLSX.utils.book_append_sheet(wb, sessionsWs, "Sessions");
      const centresWs = XLSX.utils.json_to_sheet(reussiteParCentre.map(c => ({ Centre: c.centre, Candidats: c.candidats, "BEPC (%)": c.bepc, "BAC (%)": c.bac })));
      XLSX.utils.book_append_sheet(wb, centresWs, "Par Centre");
      const matieresWs = XLSX.utils.json_to_sheet(reussiteParMatiere.map(m => ({ Matière: m.matiere, Coef: m.coef, Moyenne: m.moyenne, "Taux (%)": m.tauxReussite })));
      XLSX.utils.book_append_sheet(wb, matieresWs, "Par Matière");
      XLSX.writeFile(wb, `Rapport_Examens_${selectedYear}.xlsx`);
      toast.success("Excel exporté avec succès");
    } else if (format === "print") {
      window.print();
    }
  };

  const handleAnalyzeAnomaly = (id: string) => {
    toast.info("Analyse en cours", { description: "L'anomalie est en cours d'investigation détaillée" });
  };

  const handleProcessAnomaly = (id: string) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, traite: true } : a));
    toast.success("Anomalie traitée", { description: "L'anomalie a été marquée comme traitée" });
  };

  const handleRefresh = () => {
    toast.success("Données actualisées", { description: "Le tableau de bord a été mis à jour" });
  };

  const currentYear = sessionsData.filter(s => s.annee === selectedYear);
  const totalCandidats = currentYear.reduce((acc, s) => acc + s.candidats, 0);
  const totalAdmis = currentYear.reduce((acc, s) => acc + s.admis, 0);
  const tauxGlobal = totalCandidats > 0 ? ((totalAdmis / totalCandidats) * 100).toFixed(1) : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            {t('exams.dashboard.title')}
          </h1>
          <p className="text-muted-foreground">{t('exams.dashboard.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('exams.dashboard.year')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('exams.dashboard.exam')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">{t('exams.dashboard.all')}</SelectItem>
              <SelectItem value="bepc">BEPC</SelectItem>
              <SelectItem value="bac">BAC</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleExportRapport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            {t('exams.dashboard.exportPdf')}
          </Button>
          <Button onClick={() => handleExportRapport("excel")}>
            <FileText className="h-4 w-4 mr-2" />
            {t('exams.dashboard.directionReport')}
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('exams.dashboard.candidates')} {selectedYear}</p>
                <p className="text-3xl font-bold">{totalCandidats.toLocaleString()}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+5.7% {t('exams.dashboard.vs')} {parseInt(selectedYear) - 1}</span>
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
                <p className="text-sm text-muted-foreground">{t('exams.dashboard.admitted')}</p>
                <p className="text-3xl font-bold">{totalAdmis.toLocaleString()}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+8.2% {t('exams.dashboard.vs')} {parseInt(selectedYear) - 1}</span>
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
                <p className="text-sm text-muted-foreground">{t('exams.dashboard.globalSuccessRate')}</p>
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
                <p className="text-sm text-muted-foreground">{t('exams.dashboard.activeAlerts')}</p>
                <p className="text-3xl font-bold">{anomalies.filter(a => a.type === "critique").length}</p>
                <p className="text-sm text-orange-600 mt-1">
                  {anomalies.length} {t('exams.dashboard.anomaliesDetected')}
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
          <AlertTitle>{t('exams.dashboard.criticalAlerts')}</AlertTitle>
          <AlertDescription>
            {anomalies.filter(a => a.type === "critique").length} {t('exams.dashboard.criticalAnomaliesRequireAttention')}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t('exams.dashboard.overview')}</TabsTrigger>
          <TabsTrigger value="centres">{t('exams.dashboard.byCenter')}</TabsTrigger>
          <TabsTrigger value="matieres">{t('exams.dashboard.bySubject')}</TabsTrigger>
          <TabsTrigger value="comparatif">{t('exams.dashboard.comparative')}</TabsTrigger>
          <TabsTrigger value="anomalies">{t('exams.dashboard.anomalies')}</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Évolution taux de réussite */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('exams.dashboard.successRateEvolution')}
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
                  {t('exams.dashboard.honorsDistribution')} {selectedYear}
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
                {t('exams.dashboard.examSessions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('exams.dashboard.session')}</TableHead>
                    <TableHead>{t('exams.dashboard.year')}</TableHead>
                    <TableHead>{t('exams.dashboard.status')}</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.candidates')}</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.admitted')}</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.successRate')}</TableHead>
                    <TableHead>{t('exams.dashboard.trend')}</TableHead>
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
                        {getStatusBadge(session.statut)}
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
                {t('exams.dashboard.successRateByCenter')}
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
              <CardTitle>{t('exams.dashboard.centerDetail')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('exams.dashboard.center')}</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.candidates')}</TableHead>
                    <TableHead className="text-right">BEPC</TableHead>
                    <TableHead className="text-right">BAC</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.nationalAverageGap')}</TableHead>
                    <TableHead>{t('exams.dashboard.status')}</TableHead>
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
                            <Badge className="bg-green-500">{t('exams.dashboard.excellent')}</Badge>
                          ) : ecart >= 0 ? (
                            <Badge variant="secondary">{t('exams.dashboard.normal')}</Badge>
                          ) : ecart >= -5 ? (
                            <Badge className="bg-orange-500">{t('exams.dashboard.attention')}</Badge>
                          ) : (
                            <Badge variant="destructive">{t('exams.dashboard.critical')}</Badge>
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
                {t('exams.dashboard.subjectPerformance')}
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
                  <Bar yAxisId="left" dataKey="tauxReussite" name={t('exams.dashboard.successRatePercent')} fill="hsl(var(--chart-1))" />
                  <Bar yAxisId="right" dataKey="moyenne" name={t('exams.dashboard.averageOf20')} fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('exams.dashboard.detailedAnalysisBySubject')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('exams.dashboard.subject')}</TableHead>
                    <TableHead className="text-center">{t('exams.dashboard.coefficient')}</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.average')}</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.successRate')}</TableHead>
                    <TableHead>{t('exams.dashboard.performance')}</TableHead>
                    <TableHead>{t('exams.dashboard.recommendation')}</TableHead>
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
                        {matiere.tauxReussite < 65 ? t('exams.dashboard.reinforcementNeeded') : 
                         matiere.tauxReussite < 75 ? t('exams.dashboard.regularMonitoring') : t('exams.dashboard.maintain')}
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
                <CardTitle>{t('exams.dashboard.comparedEvolution')}</CardTitle>
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
                <CardTitle>{t('exams.dashboard.performanceIndicators')}</CardTitle>
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
              <CardTitle>{t('exams.dashboard.interYearComparison')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('exams.dashboard.year')}</TableHead>
                    <TableHead className="text-right">BEPC (%)</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.evolution')}</TableHead>
                    <TableHead className="text-right">BAC (%)</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.evolution')}</TableHead>
                    <TableHead className="text-right">{t('exams.dashboard.globalAverage')}</TableHead>
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
                {t('exams.dashboard.autoAnomalyDetection')}
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
                            {t('exams.dashboard.detectedOn')} {formatDate(anomalie.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {anomalie.traite ? (
                          <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" />Traitée</Badge>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleAnalyzeAnomaly(anomalie.id)}>
                              {t('exams.dashboard.analyze')}
                            </Button>
                            <Button size="sm" variant={anomalie.type === "critique" ? "destructive" : "default"} onClick={() => handleProcessAnomaly(anomalie.id)}>
                              {t('exams.dashboard.process')}
                            </Button>
                          </>
                        )}
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
                  <p className="text-muted-foreground">{t('exams.dashboard.criticalAnomalies')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-600">
                    {anomalies.filter(a => a.type === "attention").length}
                  </p>
                  <p className="text-muted-foreground">{t('exams.dashboard.attentionAnomalies')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-muted-foreground">
                    {anomalies.filter(a => a.type === "info").length}
                  </p>
                  <p className="text-muted-foreground">{t('exams.dashboard.information')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions rapides export */}
      <Card>
        <CardHeader>
          <CardTitle>{t('exams.dashboard.exportDirectionReports')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => handleExportRapport("pdf")}>
              <FileText className="h-4 w-4 mr-2" />
              {t('exams.dashboard.syntheticPdfReport')}
            </Button>
            <Button variant="outline" onClick={() => handleExportRapport("excel")}>
              <Download className="h-4 w-4 mr-2" />
              {t('exams.dashboard.completeExcelData')}
            </Button>
            <Button variant="outline" onClick={() => handleExportRapport("print")}>
              <Printer className="h-4 w-4 mr-2" />
              {t('exams.dashboard.printDashboard')}
            </Button>
            <Button variant="outline" onClick={() => {
              toast.success(t('exams.dashboard.reportSentByEmail'), { description: t('exams.dashboard.reportSentToDirection') });
            }}>
              <Mail className="h-4 w-4 mr-2" />
              {t('exams.dashboard.sendToDirection')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
