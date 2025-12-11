import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, TrendingUp, TrendingDown, Download, Calendar, 
  Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle,
  Users, BookOpen
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  mockTeachers, 
  mockAttendanceStats,
  getTeacherById,
  type TeacherAttendanceStats 
} from "@/data/mockTeachers";
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
  Legend
} from "recharts";

export default function AssiduitePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("mois");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Combine teacher data with stats
  const teacherStats = mockAttendanceStats.map(stat => {
    const teacher = getTeacherById(stat.teacherId);
    return { ...stat, teacher };
  }).filter(item => item.teacher);

  // Filter based on search
  const filteredStats = teacherStats.filter(item => {
    if (!item.teacher) return false;
    const matchesSearch = 
      item.teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "excellent") return matchesSearch && item.tauxPresence >= 98;
    if (filterStatus === "bon") return matchesSearch && item.tauxPresence >= 90 && item.tauxPresence < 98;
    if (filterStatus === "attention") return matchesSearch && item.tauxPresence < 90;
    return matchesSearch;
  });

  // Calculate global statistics
  const globalStats = {
    tauxMoyen: (teacherStats.reduce((acc, s) => acc + s.tauxPresence, 0) / teacherStats.length).toFixed(1),
    totalAbsences: teacherStats.reduce((acc, s) => acc + s.joursAbsent, 0),
    totalRetards: teacherStats.reduce((acc, s) => acc + s.joursRetard, 0),
    tauxRealisation: (teacherStats.reduce((acc, s) => acc + s.tauxRealisation, 0) / teacherStats.length).toFixed(1),
    totalCours: teacherStats.reduce((acc, s) => acc + s.coursDispenses, 0),
    coursAnnules: teacherStats.reduce((acc, s) => acc + s.coursAnnules, 0),
  };

  // Chart data
  const presenceChartData = filteredStats.map(item => ({
    name: item.teacher?.nom || "",
    presence: item.tauxPresence,
    realisation: item.tauxRealisation
  }));

  const distributionData = [
    { name: "Présents", value: teacherStats.filter(s => s.tauxPresence >= 95).length, color: "hsl(var(--chart-1))" },
    { name: "Bonne assiduité", value: teacherStats.filter(s => s.tauxPresence >= 90 && s.tauxPresence < 95).length, color: "hsl(var(--chart-2))" },
    { name: "À surveiller", value: teacherStats.filter(s => s.tauxPresence < 90).length, color: "hsl(var(--chart-3))" },
  ];

  const evolutionData = [
    { mois: "Sept", taux: 97.2 },
    { mois: "Oct", taux: 96.8 },
    { mois: "Nov", taux: 95.5 },
    { mois: "Déc", taux: parseFloat(globalStats.tauxMoyen) },
  ];

  const getStatusBadge = (taux: number) => {
    if (taux >= 98) return <Badge className="bg-green-600 hover:bg-green-700">Excellent</Badge>;
    if (taux >= 95) return <Badge className="bg-blue-600 hover:bg-blue-700">Très Bon</Badge>;
    if (taux >= 90) return <Badge className="bg-amber-500 hover:bg-amber-600">Bon</Badge>;
    return <Badge variant="destructive">À surveiller</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapport d'Assiduité</h1>
          <p className="text-muted-foreground mt-1">
            Statistiques de présence et performance des enseignants
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Global Statistics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{globalStats.tauxMoyen}%</div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+2.1% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Absences Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">{globalStats.totalAbsences}</div>
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">jours ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Retards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-amber-600">{globalStats.totalRetards}</div>
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cours Dispensés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{globalStats.totalCours}</div>
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cours Annulés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-600">{globalStats.coursAnnules}</div>
              <XCircle className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux Réalisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.tauxRealisation}%</div>
            <Progress value={parseFloat(globalStats.tauxRealisation)} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Taux de Présence par Enseignant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={presenceChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Bar dataKey="presence" name="Présence" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="realisation" name="Réalisation" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition Assiduité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution du Taux de Présence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis domain={[90, 100]} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Taux']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="taux" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Détail par Enseignant</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="excellent">Excellent (≥98%)</SelectItem>
                  <SelectItem value="bon">Bon (90-98%)</SelectItem>
                  <SelectItem value="attention">À surveiller (&lt;90%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead className="text-center">Jours Présent</TableHead>
                  <TableHead className="text-center">Absences</TableHead>
                  <TableHead className="text-center">Retards</TableHead>
                  <TableHead className="text-center">Taux Présence</TableHead>
                  <TableHead className="text-center">Cours</TableHead>
                  <TableHead className="text-center">Réalisation</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStats.map((item) => (
                  <TableRow key={item.teacherId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={item.teacher?.photo} alt={item.teacher?.nom} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {item.teacher?.prenom[0]}{item.teacher?.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{item.teacher?.prenom} {item.teacher?.nom}</div>
                          <div className="text-sm text-muted-foreground">{item.teacher?.matricule}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.teacher?.matiere}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-green-600">{item.joursPresent}</span>
                      <span className="text-muted-foreground">/{item.joursOuvres}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={item.joursAbsent > 0 ? "font-medium text-red-600" : ""}>
                        {item.joursAbsent}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={item.joursRetard > 0 ? "font-medium text-amber-600" : ""}>
                        {item.joursRetard}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={item.tauxPresence} className="h-2 w-16" />
                        <span className="font-medium">{item.tauxPresence}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{item.coursDispenses}</span>
                      {item.coursAnnules > 0 && (
                        <span className="text-red-600 text-sm ml-1">(-{item.coursAnnules})</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={item.tauxRealisation} className="h-2 w-16" />
                        <span className="font-medium">{item.tauxRealisation}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.tauxPresence)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
