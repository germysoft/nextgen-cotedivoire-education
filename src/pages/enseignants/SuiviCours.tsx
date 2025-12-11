import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, XCircle, Calendar, BookOpen, Clock, Search,
  Filter, Download, User, Plus, AlertCircle, TrendingUp
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  mockTeachers, 
  mockCourseSessions,
  mockClassProgressions,
  getTeacherById,
  type CourseSession,
  type ClassProgression 
} from "@/data/mockTeachers";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SuiviCours() {
  const { toast } = useToast();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState("mois");

  // Filter course sessions
  const filteredCours = mockCourseSessions.filter(cours => {
    const teacher = getTeacherById(cours.teacherId);
    const matchesTeacher = selectedTeacherId === "all" || cours.teacherId === selectedTeacherId;
    const matchesSearch = 
      cours.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cours.chapitre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || cours.statut.toLowerCase() === filterStatus;
    
    return matchesTeacher && matchesSearch && matchesStatus;
  });

  // Filter progressions
  const filteredProgressions = mockClassProgressions.filter(prog => 
    selectedTeacherId === "all" || prog.teacherId === selectedTeacherId
  );

  // Calculate statistics
  const stats = {
    totalDispenses: filteredCours.filter(c => c.statut === "Dispensé").length,
    totalAnnules: filteredCours.filter(c => c.statut === "Annulé").length,
    totalProgrammes: filteredCours.filter(c => c.statut === "Programmé").length,
    totalReportes: filteredCours.filter(c => c.statut === "Reporté").length,
    heuresEffectuees: filteredCours.filter(c => c.statut === "Dispensé").length * 2,
    heuresPrevues: filteredCours.length * 2,
    tauxRealisation: filteredCours.length > 0 
      ? Math.round(filteredCours.filter(c => c.statut === "Dispensé").length / filteredCours.filter(c => c.statut !== "Programmé").length * 100)
      : 0,
    absentsTotal: filteredCours.reduce((acc, c) => acc + c.absents, 0),
  };

  // Chart data for progressions
  const progressionChartData = filteredProgressions.map(p => ({
    name: p.classe,
    realise: p.heuresRealisees,
    prevu: p.heuresPrevues,
    taux: p.tauxProgression
  }));

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Dispensé":
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Dispensé</Badge>;
      case "Annulé":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Annulé</Badge>;
      case "Reporté":
        return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertCircle className="h-3 w-3 mr-1" />Reporté</Badge>;
      case "Programmé":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Programmé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const handleAddCourse = () => {
    toast({
      title: "Cours ajouté",
      description: "Le nouveau cours a été enregistré avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi des Cours</h1>
          <p className="text-muted-foreground mt-1">Historique et progression pédagogique</p>
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
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Cours
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer un cours</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddCourse(); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Horaire</Label>
                    <Input placeholder="08:00 - 10:00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3a">3ème A</SelectItem>
                        <SelectItem value="3b">3ème B</SelectItem>
                        <SelectItem value="2c">2nde C</SelectItem>
                        <SelectItem value="td">Tle D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Salle</Label>
                    <Input placeholder="A12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Chapitre traité</Label>
                  <Input placeholder="Titre du chapitre" />
                </div>
                <div className="space-y-2">
                  <Label>Nombre d'absents</Label>
                  <Input type="number" min="0" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label>Remarques</Label>
                  <Textarea placeholder="Notes sur le déroulement du cours..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">Annuler</Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Dispensés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalDispenses}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annulations</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalAnnules}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Effectuées</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.heuresEffectuees}h</div>
            <p className="text-xs text-muted-foreground">Sur {stats.heuresPrevues}h prévues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Réalisation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tauxRealisation}%</div>
            <Progress value={stats.tauxRealisation} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Absents</CardTitle>
            <User className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.absentsTotal}</div>
            <p className="text-xs text-muted-foreground">Total ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course History Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Historique des Cours</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger className="w-[200px]">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Enseignant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les enseignants</SelectItem>
                    {mockTeachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.prenom} {teacher.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="dispensé">Dispensés</SelectItem>
                    <SelectItem value="annulé">Annulés</SelectItem>
                    <SelectItem value="programmé">Programmés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Chapitre</TableHead>
                  <TableHead>Absents</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCours.slice(0, 10).map((cours) => {
                  const teacher = getTeacherById(cours.teacherId);
                  return (
                    <TableRow key={cours.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{format(new Date(cours.date), "d MMM", { locale: fr })}</div>
                            <div className="text-xs text-muted-foreground">{cours.jour}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {cours.heureDebut}-{cours.heureFin}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline">{cours.classe}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">{cours.salle}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate" title={cours.chapitre}>
                        {cours.chapitre}
                      </TableCell>
                      <TableCell>
                        {cours.absents > 0 ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            {cours.absents}
                          </Badge>
                        ) : (
                          <span className="text-green-600 text-sm">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(cours.statut)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Progression Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Progression Programme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProgressions.map((prog, idx) => {
                const teacher = getTeacherById(prog.teacherId);
                return (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{prog.classe}</Badge>
                        <span className="text-xs text-muted-foreground">{prog.matiere}</span>
                      </div>
                      <Badge 
                        variant={prog.tauxProgression >= 85 ? "default" : prog.tauxProgression >= 70 ? "secondary" : "destructive"}
                      >
                        {prog.tauxProgression}%
                      </Badge>
                    </div>
                    <Progress value={prog.tauxProgression} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{prog.chapitresRealises}/{prog.chapitresPrevus} chapitres</span>
                      <span>{prog.heuresRealisees}h/{prog.heuresPrevues}h</span>
                    </div>
                    {selectedTeacherId === "all" && teacher && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={teacher.photo} />
                          <AvatarFallback className="text-xs">{teacher.prenom[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{teacher.nom}</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progression Chart */}
      {progressionChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparaison Heures Prévues/Réalisées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Bar dataKey="prevu" name="Heures prévues" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="realise" name="Heures réalisées" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
