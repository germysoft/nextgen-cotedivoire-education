import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, Download, Search, Filter, Clock, Users, BookOpen,
  GraduationCap, Calendar, Printer, Eye, ChevronRight, AlertTriangle
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
import { Separator } from "@/components/ui/separator";
import { 
  mockTeachers, 
  getTeacherSchedule,
  getTeacherProgressions,
  type Teacher,
  type TeacherSchedule 
} from "@/data/mockTeachers";
import { useToast } from "@/hooks/use-toast";

export default function FicheServicePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Filter teachers
  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = 
      teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.matiere.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "surcharge") return matchesSearch && teacher.heuresHebdo > teacher.heuresMax;
    if (filterStatus === "optimal") return matchesSearch && teacher.heuresHebdo >= teacher.heuresMax * 0.9 && teacher.heuresHebdo <= teacher.heuresMax;
    if (filterStatus === "souscharge") return matchesSearch && teacher.heuresHebdo < teacher.heuresMax * 0.8;
    return matchesSearch;
  });

  // Calculate global statistics
  const globalStats = {
    totalEnseignants: mockTeachers.length,
    heuresMoyennes: Math.round(mockTeachers.reduce((acc, t) => acc + t.heuresHebdo, 0) / mockTeachers.length),
    surcharge: mockTeachers.filter(t => t.heuresHebdo > t.heuresMax).length,
    sousCharge: mockTeachers.filter(t => t.heuresHebdo < t.heuresMax * 0.8).length,
    permanents: mockTeachers.filter(t => t.statut === "Permanent").length,
    vacataires: mockTeachers.filter(t => t.statut === "Vacataire").length,
  };

  const handleExportPDF = (teacher: Teacher) => {
    toast({
      title: "Fiche de service exportée",
      description: `La fiche de ${teacher.prenom} ${teacher.nom} a été téléchargée.`,
    });
  };

  const handlePrint = (teacher: Teacher) => {
    toast({
      title: "Impression lancée",
      description: `Impression de la fiche de ${teacher.prenom} ${teacher.nom}`,
    });
  };

  const getChargeStatus = (heures: number, max: number) => {
    const ratio = heures / max;
    if (ratio > 1) return { label: "Surcharge", variant: "destructive" as const, color: "text-red-600" };
    if (ratio >= 0.9) return { label: "Optimal", variant: "default" as const, color: "text-green-600" };
    if (ratio >= 0.8) return { label: "Normal", variant: "secondary" as const, color: "text-blue-600" };
    return { label: "Sous-charge", variant: "outline" as const, color: "text-amber-600" };
  };

  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const heures = ["08:00", "10:00", "12:00", "14:00", "16:00"];

  const TeacherDetailDialog = ({ teacher }: { teacher: Teacher }) => {
    const schedule = getTeacherSchedule(teacher.id);
    const progressions = getTeacherProgressions(teacher.id);
    const chargeStatus = getChargeStatus(teacher.heuresHebdo, teacher.heuresMax);

    // Build schedule grid
    const scheduleGrid: Record<string, Record<string, TeacherSchedule | null>> = {};
    jours.forEach(jour => {
      scheduleGrid[jour] = {};
      heures.forEach(heure => {
        scheduleGrid[jour][heure] = schedule.find(
          s => s.jour === jour && s.heureDebut === heure
        ) || null;
      });
    });

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={teacher.photo} alt={teacher.nom} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {teacher.prenom[0]}{teacher.nom[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl">{teacher.prenom} {teacher.nom}</div>
              <div className="text-sm text-muted-foreground font-normal">{teacher.matricule} - {teacher.grade}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Teacher Info */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Matière</div>
                <div className="font-medium">{teacher.matiere}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Classes</div>
                <div className="font-medium">{teacher.classes.length} classes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Heures/Semaine</div>
                <div className={`font-medium ${chargeStatus.color}`}>
                  {teacher.heuresHebdo}h / {teacher.heuresMax}h
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Statut</div>
                <Badge variant={chargeStatus.variant}>{chargeStatus.label}</Badge>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Weekly Schedule */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Emploi du Temps Hebdomadaire
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border p-2 bg-muted font-medium text-left">Heures</th>
                    {jours.map(jour => (
                      <th key={jour} className="border p-2 bg-muted font-medium text-center">{jour}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heures.map(heure => (
                    <tr key={heure}>
                      <td className="border p-2 font-medium bg-muted/50">{heure}</td>
                      {jours.map(jour => {
                        const cours = scheduleGrid[jour][heure];
                        return (
                          <td key={`${jour}-${heure}`} className="border p-2">
                            {cours ? (
                              <div className="bg-primary/10 p-2 rounded text-center">
                                <div className="font-medium text-xs">{cours.classe}</div>
                                <div className="text-xs text-muted-foreground">{cours.salle}</div>
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Classes & Progression */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Progression par Classe
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {progressions.length > 0 ? progressions.map((prog, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{prog.classe}</Badge>
                      <span className="text-sm font-medium">{prog.tauxProgression}%</span>
                    </div>
                    <Progress value={prog.tauxProgression} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{prog.chapitresRealises}/{prog.chapitresPrevus} chapitres</span>
                      <span>{prog.heuresRealisees}/{prog.heuresPrevues}h</span>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                teacher.classes.map((classe, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{classe}</Badge>
                        <span className="text-sm font-medium">--</span>
                      </div>
                      <Progress value={0} className="h-2 mb-2" />
                      <div className="text-xs text-muted-foreground">Données non disponibles</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => handlePrint(teacher)}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={() => handleExportPDF(teacher)}>
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fiches de Service</h1>
          <p className="text-muted-foreground mt-1">
            Emploi du temps et charge horaire des enseignants
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer Tout
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter Tout
          </Button>
        </div>
      </div>

      {/* Global Statistics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{globalStats.totalEnseignants}</div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Heures/Semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{globalStats.heuresMoyennes}h</div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Permanents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{globalStats.permanents}</div>
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(globalStats.permanents / globalStats.totalEnseignants * 100)}% de l'effectif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vacataires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">{globalStats.vacataires}</div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(globalStats.vacataires / globalStats.totalEnseignants * 100)}% de l'effectif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Surcharge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">{globalStats.surcharge}</div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">enseignants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sous-charge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-amber-600">{globalStats.sousCharge}</div>
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">enseignants</p>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Liste des Fiches de Service
            </CardTitle>
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
                  <SelectItem value="surcharge">Surcharge</SelectItem>
                  <SelectItem value="optimal">Optimal</SelectItem>
                  <SelectItem value="souscharge">Sous-charge</SelectItem>
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
                  <TableHead>Matière(s)</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Heures/Sem</TableHead>
                  <TableHead>Charge</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => {
                  const chargeStatus = getChargeStatus(teacher.heuresHebdo, teacher.heuresMax);
                  const chargePercent = Math.min((teacher.heuresHebdo / teacher.heuresMax) * 100, 100);
                  
                  return (
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
                        <div className="flex flex-wrap gap-1">
                          {teacher.matieres.map((m, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{m}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.classes.slice(0, 3).map((c, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{c}</Badge>
                          ))}
                          {teacher.classes.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{teacher.classes.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24">
                            <Progress 
                              value={chargePercent} 
                              className={`h-2 ${chargePercent > 100 ? '[&>div]:bg-red-600' : ''}`} 
                            />
                          </div>
                          <span className={`font-medium ${chargeStatus.color}`}>
                            {teacher.heuresHebdo}h/{teacher.heuresMax}h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={chargeStatus.variant}>{chargeStatus.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={teacher.statut === "Permanent" ? "default" : teacher.statut === "Vacataire" ? "secondary" : "outline"}
                        >
                          {teacher.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <TeacherDetailDialog teacher={teacher} />
                          </Dialog>
                          <Button variant="ghost" size="icon" onClick={() => handleExportPDF(teacher)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
