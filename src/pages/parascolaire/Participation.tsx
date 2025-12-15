import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Search, 
  Download,
  Filter,
  FileText,
  Printer,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  UserCheck,
  UserX,
  Activity,
  Trophy,
  Music,
  Eye,
  Mail,
  Bell
} from "lucide-react";
import { mockClubs, mockSportTeams, mockEvents, Club, SportTeam, ClubMember, TeamPlayer } from "@/data/mockExtracurricular";
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { toast } from "sonner";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// Generate participation history
const generateParticipationHistory = () => {
  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
  return classes.map(cls => ({
    class: cls,
    totalStudents: Math.floor(Math.random() * 15) + 25,
    clubMembers: Math.floor(Math.random() * 20) + 10,
    sportMembers: Math.floor(Math.random() * 15) + 5,
    eventParticipation: Math.floor(Math.random() * 30) + 20,
    attendanceRate: Math.floor(Math.random() * 20) + 75
  }));
};

// Generate attendance records
const generateAttendanceRecords = () => {
  const records = [];
  const activities = [
    ...mockClubs.map(c => ({ id: c.id, name: c.name, type: 'club' as const })),
    ...mockSportTeams.map(t => ({ id: t.id, name: t.sport, type: 'sport' as const }))
  ];
  
  const dates = ['2024-12-09', '2024-12-10', '2024-12-11', '2024-12-12', '2024-12-13'];
  
  dates.forEach(date => {
    activities.forEach(activity => {
      const total = activity.type === 'club' 
        ? mockClubs.find(c => c.id === activity.id)?.members.length || 20
        : mockSportTeams.find(t => t.id === activity.id)?.players.length || 15;
      
      records.push({
        id: `${activity.id}-${date}`,
        date,
        activityId: activity.id,
        activityName: activity.name,
        activityType: activity.type,
        totalExpected: total,
        present: Math.floor(total * (0.7 + Math.random() * 0.25)),
        absent: 0,
        late: Math.floor(Math.random() * 3)
      });
      records[records.length - 1].absent = records[records.length - 1].totalExpected - records[records.length - 1].present - records[records.length - 1].late;
    });
  });
  
  return records;
};

// Generate all students with participation data
const generateAllStudents = () => {
  const students: Array<{
    id: string;
    name: string;
    class: string;
    photo: string;
    clubs: string[];
    sports: string[];
    totalActivities: number;
    attendanceRate: number;
    lastActivity: string;
    status: 'active' | 'inactive' | 'at-risk';
  }> = [];
  
  const names = [
    'Koné Amadou', 'Touré Fatoumata', 'Diallo Ibrahim', 'Coulibaly Mariam',
    'Bamba Moussa', 'Traoré Aminata', 'Ouattara Youssouf', 'Sanogo Kadiatou',
    'Konaté Sekou', 'Diabaté Aissata', 'Cissé Mamadou', 'Fofana Rokia',
    'Soro Lacina', 'Yao Kouadio', 'N\'Guessan Affoué', 'Kouassi Jean'
  ];
  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
  
  for (let i = 0; i < 80; i++) {
    const clubsJoined = mockClubs.filter(() => Math.random() > 0.7).map(c => c.name);
    const sportsJoined = mockSportTeams.filter(() => Math.random() > 0.8).map(t => t.sport);
    const attendanceRate = Math.floor(Math.random() * 40) + 60;
    
    students.push({
      id: `STU${1000 + i}`,
      name: names[i % names.length],
      class: classes[i % classes.length],
      photo: `https://images.unsplash.com/photo-${1507003211169 + i * 100}-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`,
      clubs: clubsJoined,
      sports: sportsJoined,
      totalActivities: clubsJoined.length + sportsJoined.length,
      attendanceRate,
      lastActivity: `2024-12-${String(Math.floor(Math.random() * 13) + 1).padStart(2, '0')}`,
      status: attendanceRate >= 80 ? 'active' : attendanceRate >= 60 ? 'at-risk' : 'inactive'
    });
  }
  
  return students;
};

const participationByClass = generateParticipationHistory();
const attendanceRecords = generateAttendanceRecords();
const allStudents = generateAllStudents();

// Monthly trends
const monthlyTrends = [
  { month: 'Sept', participation: 280, attendance: 85 },
  { month: 'Oct', participation: 310, attendance: 88 },
  { month: 'Nov', participation: 325, attendance: 82 },
  { month: 'Déc', participation: 340, attendance: 86 }
];

export default function Participation() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2024-12-13");
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{ id: string; name: string; type: string } | null>(null);

  // Calculate statistics
  const totalParticipants = allStudents.filter(s => s.totalActivities > 0).length;
  const activeParticipants = allStudents.filter(s => s.status === 'active').length;
  const atRiskParticipants = allStudents.filter(s => s.status === 'at-risk').length;
  const avgAttendance = Math.round(allStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / allStudents.length);

  // Filter students
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Filter attendance records
  const filteredAttendance = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate;
    const matchesType = activityTypeFilter === "all" || record.activityType === activityTypeFilter;
    return matchesDate && matchesType;
  });

  const handleExportData = () => {
    toast.success("Export des données de participation en cours...");
  };

  const handleSendReminder = (studentId: string) => {
    toast.success("Rappel envoyé avec succès");
  };

  const handleMarkAttendance = () => {
    toast.success("Présences enregistrées avec succès");
    setShowAttendanceDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suivi des Participations</h1>
          <p className="text-muted-foreground">Analyse détaillée de la participation aux activités parascolaires</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Rappels Groupés
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">sur {allStudents.length} élèves</p>
            <Progress value={(totalParticipants / allStudents.length) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assiduité Excellente</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeParticipants}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+5% ce mois</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Risque</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{atRiskParticipants}</div>
            <p className="text-xs text-muted-foreground">Assiduité entre 60-80%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Moyen</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Assiduité globale</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 pt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Vue Globale
                </TabsTrigger>
                <TabsTrigger value="students">
                  <Users className="mr-2 h-4 w-4" />
                  Par Élève
                </TabsTrigger>
                <TabsTrigger value="classes">
                  <PieChart className="mr-2 h-4 w-4" />
                  Par Classe
                </TabsTrigger>
                <TabsTrigger value="attendance">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Pointage
                </TabsTrigger>
                <TabsTrigger value="alerts">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Alertes
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Évolution des Participations</CardTitle>
                    <CardDescription>Nombre de participants et taux d'assiduité par mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis yAxisId="left" className="text-xs" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="participation" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Participants" />
                        <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="hsl(var(--chart-2))" name="Assiduité %" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition par Type d'Activité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={[
                            { name: 'Clubs', value: mockClubs.reduce((sum, c) => sum + c.members.length, 0) },
                            { name: 'Sports', value: mockSportTeams.reduce((sum, t) => sum + t.players.length, 0) },
                            { name: 'Événements', value: mockEvents.reduce((sum, e) => sum + e.registrations.length, 0) }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {[0, 1, 2].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Participation by Class */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Participation par Classe</CardTitle>
                  <CardDescription>Comparaison des niveaux de participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={participationByClass}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="class" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="clubMembers" stackId="a" fill="hsl(var(--primary))" name="Clubs" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="sportMembers" stackId="a" fill="hsl(var(--chart-2))" name="Sports" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un élève..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes classes</SelectItem>
                    {['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'].map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="at-risk">À risque</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Clubs</TableHead>
                      <TableHead>Sports</TableHead>
                      <TableHead>Assiduité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière Activité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.slice(0, 20).map(student => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.photo} />
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          {student.clubs.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {student.clubs.slice(0, 2).map(club => (
                                <Badge key={club} variant="outline" className="text-xs">{club}</Badge>
                              ))}
                              {student.clubs.length > 2 && (
                                <Badge variant="secondary" className="text-xs">+{student.clubs.length - 2}</Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.sports.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {student.sports.map(sport => (
                                <Badge key={sport} variant="secondary" className="text-xs">{sport}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={student.attendanceRate} className="w-16 h-2" />
                            <span className={`text-sm font-medium ${
                              student.attendanceRate >= 80 ? 'text-green-600' :
                              student.attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>{student.attendanceRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            student.status === 'active' ? 'default' :
                            student.status === 'at-risk' ? 'secondary' : 'destructive'
                          }>
                            {student.status === 'active' ? 'Actif' :
                             student.status === 'at-risk' ? 'À risque' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{student.lastActivity}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleSendReminder(student.id)}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground">
                Affichage de {Math.min(20, filteredStudents.length)} sur {filteredStudents.length} élèves
              </p>
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="classes" className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {participationByClass.map(cls => (
                  <Card key={cls.class} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{cls.class}</CardTitle>
                      <CardDescription>{cls.totalStudents} élèves</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">En clubs</span>
                        <Badge variant="outline">{cls.clubMembers}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">En sports</span>
                        <Badge variant="outline">{cls.sportMembers}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Assiduité</span>
                          <span className={`font-medium ${
                            cls.attendanceRate >= 80 ? 'text-green-600' :
                            cls.attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>{cls.attendanceRate}%</span>
                        </div>
                        <Progress value={cls.attendanceRate} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Comparatif Détaillé par Classe</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Classe</TableHead>
                        <TableHead className="text-center">Effectif</TableHead>
                        <TableHead className="text-center">Clubs</TableHead>
                        <TableHead className="text-center">Sports</TableHead>
                        <TableHead className="text-center">Événements</TableHead>
                        <TableHead className="text-center">Taux Participation</TableHead>
                        <TableHead className="text-center">Assiduité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participationByClass.map(cls => (
                        <TableRow key={cls.class}>
                          <TableCell className="font-medium">{cls.class}</TableCell>
                          <TableCell className="text-center">{cls.totalStudents}</TableCell>
                          <TableCell className="text-center">{cls.clubMembers}</TableCell>
                          <TableCell className="text-center">{cls.sportMembers}</TableCell>
                          <TableCell className="text-center">{cls.eventParticipation}</TableCell>
                          <TableCell className="text-center">
                            {Math.round(((cls.clubMembers + cls.sportMembers) / cls.totalStudents) * 100)}%
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={cls.attendanceRate >= 80 ? 'default' : cls.attendanceRate >= 60 ? 'secondary' : 'destructive'}>
                              {cls.attendanceRate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-[180px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Type d'activité</Label>
                    <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="club">Clubs</SelectItem>
                        <SelectItem value="sport">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Nouveau Pointage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Enregistrer les Présences</DialogTitle>
                      <DialogDescription>Sélectionnez l'activité et marquez les présences</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type d'activité</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="club">Club</SelectItem>
                              <SelectItem value="sport">Sport</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Activité</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockClubs.map(club => (
                                <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Date et heure</Label>
                        <Input type="datetime-local" />
                      </div>
                      <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto">
                        <p className="text-sm text-muted-foreground mb-4">
                          Cochez les élèves présents :
                        </p>
                        <div className="space-y-2">
                          {allStudents.slice(0, 15).map(student => (
                            <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                              <div className="flex items-center gap-3">
                                <Checkbox id={student.id} />
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={student.photo} />
                                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <label htmlFor={student.id} className="cursor-pointer">
                                  <p className="font-medium text-sm">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">{student.class}</p>
                                </label>
                              </div>
                              <Select defaultValue="present">
                                <SelectTrigger className="w-[120px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="present">Présent</SelectItem>
                                  <SelectItem value="absent">Absent</SelectItem>
                                  <SelectItem value="late">Retard</SelectItem>
                                  <SelectItem value="excused">Excusé</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>Annuler</Button>
                      <Button onClick={handleMarkAttendance}>Enregistrer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activité</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Attendus</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Présents
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Absents
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          Retards
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Taux</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map(record => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.activityName}</TableCell>
                        <TableCell>
                          <Badge variant={record.activityType === 'club' ? 'default' : 'secondary'}>
                            {record.activityType === 'club' ? 'Club' : 'Sport'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{record.totalExpected}</TableCell>
                        <TableCell className="text-center text-green-600 font-medium">{record.present}</TableCell>
                        <TableCell className="text-center text-red-600 font-medium">{record.absent}</TableCell>
                        <TableCell className="text-center text-yellow-600 font-medium">{record.late}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={
                            (record.present / record.totalExpected) >= 0.8 ? 'default' :
                            (record.present / record.totalExpected) >= 0.6 ? 'secondary' : 'destructive'
                          }>
                            {Math.round((record.present / record.totalExpected) * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <UserX className="h-5 w-5" />
                      Absences Répétées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">
                      {allStudents.filter(s => s.attendanceRate < 60).length}
                    </p>
                    <p className="text-sm text-muted-foreground">élèves avec assiduité &lt;60%</p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Attention Requise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-yellow-600">{atRiskParticipants}</p>
                    <p className="text-sm text-muted-foreground">élèves à surveiller</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Rappels Envoyés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-muted-foreground">cette semaine</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Élèves Nécessitant une Intervention</CardTitle>
                  <CardDescription>Élèves avec faible participation ou assiduité</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Élève</TableHead>
                        <TableHead>Classe</TableHead>
                        <TableHead>Activités</TableHead>
                        <TableHead>Assiduité</TableHead>
                        <TableHead>Problème</TableHead>
                        <TableHead>Dernière Présence</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allStudents
                        .filter(s => s.status !== 'active')
                        .slice(0, 10)
                        .map(student => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={student.photo} />
                                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{student.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>{student.totalActivities}</TableCell>
                            <TableCell>
                              <Badge variant={student.status === 'at-risk' ? 'secondary' : 'destructive'}>
                                {student.attendanceRate}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {student.attendanceRate < 60 ? (
                                <span className="text-red-600 text-sm">Absences fréquentes</span>
                              ) : (
                                <span className="text-yellow-600 text-sm">Baisse d'assiduité</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{student.lastActivity}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSendReminder(student.id)}
                                >
                                  <Mail className="mr-1 h-3 w-3" />
                                  Contacter
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
