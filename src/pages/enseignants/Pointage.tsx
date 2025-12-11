import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, CheckCircle, XCircle, AlertTriangle, Search, 
  Download, Calendar, Filter, UserCheck, Timer, Fingerprint
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
  mockAttendanceRecords, 
  getTeacherById,
  type AttendanceRecord 
} from "@/data/mockTeachers";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function PointageEnseignantsPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter attendance records for selected date
  const todayRecords = mockAttendanceRecords.filter(r => r.date === selectedDate);
  
  // Create attendance data with teacher info
  const attendanceData = mockTeachers.map(teacher => {
    const record = todayRecords.find(r => r.teacherId === teacher.id);
    return {
      teacher,
      record: record || null
    };
  });

  // Filter based on search and status
  const filteredData = attendanceData.filter(item => {
    const matchesSearch = 
      item.teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacher.matiere.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "present") return matchesSearch && item.record?.statut === "Présent";
    if (filterStatus === "absent") return matchesSearch && (!item.record || item.record.statut === "Absent");
    if (filterStatus === "retard") return matchesSearch && item.record?.statut === "Retard";
    if (filterStatus === "justifie") return matchesSearch && item.record?.statut === "Justifié";
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    presents: attendanceData.filter(a => a.record?.statut === "Présent").length,
    absents: attendanceData.filter(a => !a.record || a.record.statut === "Absent").length,
    retards: attendanceData.filter(a => a.record?.statut === "Retard").length,
    justifies: attendanceData.filter(a => a.record?.statut === "Justifié").length,
    total: mockTeachers.length
  };

  const tauxPresence = ((stats.presents + stats.retards + stats.justifies) / stats.total * 100).toFixed(1);

  const handleManualPointage = (teacherId: string) => {
    const teacher = getTeacherById(teacherId);
    toast({
      title: "Pointage manuel enregistré",
      description: `${teacher?.prenom} ${teacher?.nom} - Arrivée à ${format(currentTime, "HH:mm")}`,
    });
  };

  const getStatusBadge = (record: AttendanceRecord | null) => {
    if (!record) {
      return <Badge variant="outline" className="bg-muted">Non pointé</Badge>;
    }
    switch (record.statut) {
      case "Présent":
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Présent</Badge>;
      case "Absent":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case "Retard":
        return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertTriangle className="h-3 w-3 mr-1" />Retard</Badge>;
      case "Justifié":
        return <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />Justifié</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getMethodeBadge = (methode: string) => {
    switch (methode) {
      case "Badge":
        return <Badge variant="outline" className="text-xs"><UserCheck className="h-3 w-3 mr-1" />Badge</Badge>;
      case "Biométrique":
        return <Badge variant="outline" className="text-xs"><Fingerprint className="h-3 w-3 mr-1" />Biométrique</Badge>;
      case "Manuel":
        return <Badge variant="outline" className="text-xs"><Clock className="h-3 w-3 mr-1" />Manuel</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pointage Automatique</h1>
          <p className="text-muted-foreground mt-1">
            Suivi de la présence des enseignants en temps réel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold">{format(currentTime, "HH:mm:ss")}</span>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{stats.presents}</div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">sur {stats.total} enseignants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Absents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">{stats.absents}</div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">non justifiés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-amber-600">{stats.retards}</div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">arrivée après 08:00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Justifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">{stats.justifies}</div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">avec motif validé</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux Présence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxPresence}%</div>
            <Progress value={parseFloat(tauxPresence)} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pointage du {format(new Date(selectedDate), "EEEE d MMMM yyyy", { locale: fr })}
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
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
                  <SelectItem value="present">Présents</SelectItem>
                  <SelectItem value="absent">Absents</SelectItem>
                  <SelectItem value="retard">Retards</SelectItem>
                  <SelectItem value="justifie">Justifiés</SelectItem>
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
                  <TableHead>Heure Arrivée</TableHead>
                  <TableHead>Heure Départ</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map(({ teacher, record }) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={teacher.photo} alt={teacher.nom} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {teacher.prenom[0]}{teacher.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{teacher.prenom} {teacher.nom}</div>
                          <div className="text-sm text-muted-foreground">{teacher.matricule}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{teacher.matiere}</Badge>
                    </TableCell>
                    <TableCell>
                      {record?.heureArrivee ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className={record.statut === "Retard" ? "text-amber-600 font-medium" : ""}>
                            {record.heureArrivee}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">--:--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record?.heureDepart ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {record.heureDepart}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">--:--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record && getMethodeBadge(record.pointageMethode)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record)}
                    </TableCell>
                    <TableCell>
                      {record?.justification ? (
                        <span className="text-sm text-muted-foreground">{record.justification}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!record && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleManualPointage(teacher.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Pointer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Vue en Temps Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {attendanceData.map(({ teacher, record }) => (
              <div
                key={teacher.id}
                className={`p-3 rounded-lg border text-center ${
                  record?.statut === "Présent" 
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" 
                    : record?.statut === "Retard"
                    ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                    : record?.statut === "Justifié"
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                }`}
              >
                <Avatar className="h-10 w-10 mx-auto mb-2">
                  <AvatarImage src={teacher.photo} alt={teacher.nom} />
                  <AvatarFallback className="text-xs">
                    {teacher.prenom[0]}{teacher.nom[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium truncate">{teacher.nom}</p>
                <p className="text-xs text-muted-foreground">{record?.heureArrivee || "--:--"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
