import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, TrendingDown, Users, GraduationCap, 
  DollarSign, Calendar, Download, Filter, RefreshCw,
  BookOpen, Trophy, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RapportsGlobauxPage() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Mock data for various charts
  const enrollmentTrend = [
    { year: '2020-21', garcons: 580, filles: 620, total: 1200 },
    { year: '2021-22', garcons: 610, filles: 650, total: 1260 },
    { year: '2022-23', garcons: 640, filles: 680, total: 1320 },
    { year: '2023-24', garcons: 670, filles: 710, total: 1380 },
    { year: '2024-25', garcons: 700, filles: 739, total: 1439 },
  ];

  const performanceBySubject = [
    { subject: 'Mathématiques', moyenne: 13.5, tauxReussite: 72 },
    { subject: 'Français', moyenne: 14.2, tauxReussite: 78 },
    { subject: 'Anglais', moyenne: 13.8, tauxReussite: 75 },
    { subject: 'Physique', moyenne: 12.9, tauxReussite: 68 },
    { subject: 'SVT', moyenne: 14.5, tauxReussite: 82 },
    { subject: 'Histoire-Géo', moyenne: 14.1, tauxReussite: 79 },
  ];

  const attendanceData = [
    { month: 'Sept', presence: 96, absence: 4 },
    { month: 'Oct', presence: 94, absence: 6 },
    { month: 'Nov', presence: 93, absence: 7 },
    { month: 'Déc', presence: 91, absence: 9 },
    { month: 'Jan', presence: 95, absence: 5 },
    { month: 'Fév', presence: 94, absence: 6 },
    { month: 'Mars', presence: 92, absence: 8 },
  ];

  const financialData = [
    { month: 'Sept', recettes: 45000000, depenses: 32000000 },
    { month: 'Oct', recettes: 38000000, depenses: 28000000 },
    { month: 'Nov', recettes: 35000000, depenses: 30000000 },
    { month: 'Déc', recettes: 42000000, depenses: 35000000 },
    { month: 'Jan', recettes: 50000000, depenses: 33000000 },
    { month: 'Fév', recettes: 36000000, depenses: 29000000 },
  ];

  const distributionByLevel = [
    { name: '6ème', value: 380, color: 'hsl(var(--primary))' },
    { name: '5ème', value: 350, color: 'hsl(var(--chart-2))' },
    { name: '4ème', value: 360, color: 'hsl(var(--chart-3))' },
    { name: '3ème', value: 349, color: 'hsl(var(--chart-4))' },
  ];

  const performanceRadar = [
    { subject: 'Maths', A: 14.2, B: 13.1 },
    { subject: 'Français', A: 15.1, B: 14.0 },
    { subject: 'Anglais', A: 14.5, B: 13.8 },
    { subject: 'Physique', A: 13.8, B: 12.5 },
    { subject: 'SVT', A: 15.2, B: 14.1 },
    { subject: 'Histoire', A: 14.8, B: 13.6 },
  ];

  const examResults = [
    { exam: 'BEPC 2023', inscrits: 145, admis: 128, tauxReussite: 88.3 },
    { exam: 'BEPC 2024', inscrits: 152, admis: 138, tauxReussite: 90.8 },
    { exam: 'BAC 2023', inscrits: 98, admis: 82, tauxReussite: 83.7 },
    { exam: 'BAC 2024', inscrits: 105, admis: 91, tauxReussite: 86.7 },
  ];

  const stats = {
    totalStudents: 1439,
    studentGrowth: 4.3,
    averageGrade: 13.9,
    gradeChange: 0.5,
    attendanceRate: 93.5,
    attendanceChange: -1.2,
    collectionRate: 87.4,
    collectionChange: 2.1,
  };

  const handleExportReport = () => {
    const doc = new jsPDF();
    const periodLabel = selectedPeriod === 'current-year' ? 'Année en cours' : 
                        selectedPeriod === 'last-year' ? 'Année précédente' : 
                        selectedPeriod === '3-years' ? '3 dernières années' : '5 dernières années';
    
    // Header
    doc.setFontSize(20);
    doc.text("RAPPORT GLOBAL DE L'ÉTABLISSEMENT", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Période: ${periodLabel}`, 105, 30, { align: "center" });
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 105, 38, { align: "center" });
    
    // KPIs
    doc.setFontSize(14);
    doc.text("INDICATEURS CLÉS", 14, 55);
    doc.setFontSize(11);
    doc.text(`Effectif Total: ${stats.totalStudents} élèves (+${stats.studentGrowth}%)`, 14, 65);
    doc.text(`Moyenne Générale: ${stats.averageGrade}/20 (+${stats.gradeChange} pts)`, 14, 73);
    doc.text(`Taux de Présence: ${stats.attendanceRate}%`, 14, 81);
    doc.text(`Taux de Recouvrement: ${stats.collectionRate}%`, 14, 89);
    
    // Performance by subject
    doc.setFontSize(14);
    doc.text("PERFORMANCE PAR MATIÈRE", 14, 105);
    
    autoTable(doc, {
      head: [['Matière', 'Moyenne', 'Taux Réussite']],
      body: performanceBySubject.map(p => [p.subject, `${p.moyenne}/20`, `${p.tauxReussite}%`]),
      startY: 110,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Enrollment evolution
    const yPosEnroll = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("ÉVOLUTION DES EFFECTIFS", 14, yPosEnroll);
    
    autoTable(doc, {
      head: [['Année', 'Garçons', 'Filles', 'Total']],
      body: enrollmentTrend.map(e => [e.year, e.garcons, e.filles, e.total]),
      startY: yPosEnroll + 5,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 197, 94] }
    });
    
    // Exam results
    const yPosExam = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("RÉSULTATS AUX EXAMENS", 14, yPosExam);
    
    autoTable(doc, {
      head: [['Examen', 'Inscrits', 'Admis', 'Taux Réussite']],
      body: examResults.map(e => [e.exam, e.inscrits, e.admis, `${e.tauxReussite}%`]),
      startY: yPosExam + 5,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [139, 92, 246] }
    });
    
    // Financial summary
    const yPosFinance = (doc as any).lastAutoTable.finalY + 15;
    if (yPosFinance < 250) {
      doc.setFontSize(14);
      doc.text("SITUATION FINANCIÈRE", 14, yPosFinance);
      
      const totalRecettes = financialData.reduce((s, f) => s + f.recettes, 0);
      const totalDepenses = financialData.reduce((s, f) => s + f.depenses, 0);
      
      autoTable(doc, {
        head: [['Mois', 'Recettes (M)', 'Dépenses (M)', 'Solde (M)']],
        body: financialData.map(f => [
          f.month, 
          (f.recettes / 1000000).toFixed(1), 
          (f.depenses / 1000000).toFixed(1),
          ((f.recettes - f.depenses) / 1000000).toFixed(1)
        ]),
        startY: yPosFinance + 5,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [245, 158, 11] }
      });
    }
    
    doc.save(`rapport-global-${selectedPeriod}.pdf`);
    
    toast({
      title: "Export réussi",
      description: "Le rapport global a été téléchargé en PDF.",
    });
  };

  // stats already defined above

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports Globaux</h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble des performances et indicateurs clés de l'établissement
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-year">Année en cours</SelectItem>
              <SelectItem value="last-year">Année précédente</SelectItem>
              <SelectItem value="3-years">3 dernières années</SelectItem>
              <SelectItem value="5-years">5 dernières années</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Effectif Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{stats.studentGrowth}%</span>
                  <span className="text-muted-foreground ml-1">vs année préc.</span>
                </div>
              </div>
              <Users className="h-10 w-10 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.averageGrade}/20</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{stats.gradeChange}</span>
                  <span className="text-muted-foreground ml-1">points</span>
                </div>
              </div>
              <GraduationCap className="h-10 w-10 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                <div className="flex items-center text-sm">
                  <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
                  <span className="text-red-600">{stats.attendanceChange}%</span>
                  <span className="text-muted-foreground ml-1">vs mois préc.</span>
                </div>
              </div>
              <Clock className="h-10 w-10 text-amber-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux de Recouvrement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.collectionRate}%</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{stats.collectionChange}%</span>
                  <span className="text-muted-foreground ml-1">vs mois préc.</span>
                </div>
              </div>
              <DollarSign className="h-10 w-10 text-green-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="academic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="academic">Académique</TabsTrigger>
          <TabsTrigger value="enrollment">Effectifs</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="exams">Examens</TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Matière</CardTitle>
                <CardDescription>Moyennes et taux de réussite</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceBySubject} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 20]} />
                      <YAxis type="category" dataKey="subject" width={100} />
                      <Tooltip />
                      <Bar dataKey="moyenne" fill="hsl(var(--primary))" name="Moyenne" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparaison des Performances</CardTitle>
                <CardDescription>Trimestre 1 vs Trimestre 2</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={performanceRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 20]} />
                      <Radar name="T1" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                      <Radar name="T2" dataKey="B" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.5} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution de l'Assiduité</CardTitle>
              <CardDescription>Taux de présence mensuel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="presence" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                      name="Présence %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Évolution des Effectifs</CardTitle>
                <CardDescription>Tendance sur 5 ans par genre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="garcons" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" name="Garçons" />
                      <Area type="monotone" dataKey="filles" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" name="Filles" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Niveau</CardTitle>
                <CardDescription>Année en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionByLevel}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {distributionByLevel.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {distributionByLevel.map(level => (
                    <div key={level.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: level.color }} />
                      <span>{level.name}: {level.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recettes vs Dépenses</CardTitle>
              <CardDescription>Évolution mensuelle (en FCFA)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    <Legend />
                    <Bar dataKey="recettes" name="Recettes" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="depenses" name="Dépenses" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recettes Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">246 M FCFA</div>
                <p className="text-xs text-muted-foreground mt-1">Année scolaire en cours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">187 M FCFA</div>
                <p className="text-xs text-muted-foreground mt-1">Année scolaire en cours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Solde</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">59 M FCFA</div>
                <p className="text-xs text-muted-foreground mt-1">Excédent budgétaire</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résultats aux Examens Officiels</CardTitle>
              <CardDescription>BEPC et Baccalauréat des 2 dernières années</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {examResults.map(exam => (
                  <Card key={exam.exam}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{exam.exam}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inscrits</span>
                        <span className="font-medium">{exam.inscrits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Admis</span>
                        <span className="font-medium text-green-600">{exam.admis}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Taux de réussite</span>
                          <Badge variant={exam.tauxReussite >= 85 ? "default" : "secondary"} className={exam.tauxReussite >= 85 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}>
                            {exam.tauxReussite}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Évolution du Taux de Réussite</CardTitle>
              <CardDescription>Comparaison BEPC et BAC sur 5 ans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { year: '2020', bepc: 82, bac: 78 },
                    { year: '2021', bepc: 85, bac: 80 },
                    { year: '2022', bepc: 86, bac: 82 },
                    { year: '2023', bepc: 88, bac: 84 },
                    { year: '2024', bepc: 91, bac: 87 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bepc" name="BEPC" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 6 }} />
                    <Line type="monotone" dataKey="bac" name="BAC" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{ fill: "hsl(var(--chart-2))", r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
