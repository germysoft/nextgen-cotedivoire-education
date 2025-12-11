import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Download, User, Clock, ChevronLeft, ChevronRight,
  Printer, BookOpen, MapPin
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  mockTeachers, 
  getTeacherSchedule,
  type Teacher,
  type TeacherSchedule 
} from "@/data/mockTeachers";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = ["08:00", "10:00", "12:00", "14:00", "16:00"];

export default function Planning() {
  const { toast } = useToast();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(mockTeachers[0].id);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const selectedTeacher = mockTeachers.find(t => t.id === selectedTeacherId) || mockTeachers[0];
  const schedule = getTeacherSchedule(selectedTeacherId);

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

  // Calculate statistics
  const totalCours = schedule.length;
  const totalHeures = schedule.length * 2; // Each course is 2 hours
  const uniqueClasses = [...new Set(schedule.map(s => s.classe))];
  const uniqueSalles = [...new Set(schedule.map(s => s.salle))];

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: `Emploi du temps de ${selectedTeacher.prenom} ${selectedTeacher.nom} exporté.`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Impression",
      description: "Impression de l'emploi du temps lancée.",
    });
  };

  // Color coding for different subjects
  const getSubjectColor = (matiere: string) => {
    const colors: Record<string, string> = {
      "Mathématiques": "bg-blue-100 border-blue-500 dark:bg-blue-950/30 dark:border-blue-700",
      "Français": "bg-purple-100 border-purple-500 dark:bg-purple-950/30 dark:border-purple-700",
      "Latin": "bg-violet-100 border-violet-500 dark:bg-violet-950/30 dark:border-violet-700",
      "Anglais": "bg-green-100 border-green-500 dark:bg-green-950/30 dark:border-green-700",
      "SVT": "bg-emerald-100 border-emerald-500 dark:bg-emerald-950/30 dark:border-emerald-700",
      "Physique-Chimie": "bg-orange-100 border-orange-500 dark:bg-orange-950/30 dark:border-orange-700",
      "Histoire-Géographie": "bg-amber-100 border-amber-500 dark:bg-amber-950/30 dark:border-amber-700",
      "EMC": "bg-yellow-100 border-yellow-500 dark:bg-yellow-950/30 dark:border-yellow-700",
      "Philosophie": "bg-pink-100 border-pink-500 dark:bg-pink-950/30 dark:border-pink-700",
      "EPS": "bg-red-100 border-red-500 dark:bg-red-950/30 dark:border-red-700",
    };
    return colors[matiere] || "bg-gray-100 border-gray-500 dark:bg-gray-950/30 dark:border-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planning Hebdomadaire</h1>
          <p className="text-muted-foreground mt-1">Emploi du temps des enseignants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Teacher Selector */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={selectedTeacher.photo} alt={selectedTeacher.nom} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {selectedTeacher.prenom[0]}{selectedTeacher.nom[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{selectedTeacher.prenom} {selectedTeacher.nom}</h2>
                  <Badge variant={selectedTeacher.statut === "Permanent" ? "default" : "secondary"}>
                    {selectedTeacher.statut}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{selectedTeacher.matiere} - {selectedTeacher.grade}</p>
              </div>
            </div>
            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
              <SelectTrigger className="w-[280px]">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                {mockTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={teacher.photo} alt={teacher.nom} />
                        <AvatarFallback className="text-xs">
                          {teacher.prenom[0]}{teacher.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{teacher.prenom} {teacher.nom}</span>
                      <span className="text-muted-foreground text-xs">({teacher.matiere})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Week Navigation & Stats */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                Semaine du {format(weekStart, "d", { locale: fr })} au {format(weekEnd, "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </Card>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="text-lg font-bold">{totalHeures}h</div>
                <div className="text-xs text-muted-foreground">Heures/sem</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <div>
                <div className="text-lg font-bold">{totalCours}</div>
                <div className="text-xs text-muted-foreground">Cours</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <div>
                <div className="text-lg font-bold">{uniqueClasses.length}</div>
                <div className="text-xs text-muted-foreground">Classes</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <div className="text-lg font-bold">{uniqueSalles.length}</div>
                <div className="text-xs text-muted-foreground">Salles</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Emploi du Temps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-muted font-medium text-left min-w-[80px]">Heures</th>
                  {jours.map((jour) => (
                    <th key={jour} className="border p-3 bg-muted font-medium text-center min-w-[150px]">
                      {jour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heures.map((heure) => (
                  <tr key={heure}>
                    <td className="border p-3 font-medium bg-muted/50">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {heure}
                      </div>
                    </td>
                    {jours.map((jour) => {
                      const cours = scheduleGrid[jour][heure];
                      return (
                        <td key={`${jour}-${heure}`} className="border p-2">
                          {cours ? (
                            <div className={`p-3 rounded-lg border-l-4 ${getSubjectColor(cours.matiere)} transition-all hover:scale-[1.02]`}>
                              <div className="font-semibold text-sm">{cours.classe}</div>
                              <div className="text-xs text-muted-foreground mt-1">{cours.matiere}</div>
                              <div className="flex items-center gap-1 mt-2">
                                <MapPin className="h-3 w-3" />
                                <Badge variant="outline" className="text-xs">
                                  {cours.salle}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground text-sm py-4">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Classes Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif des Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {uniqueClasses.map((classe) => {
              const classCours = schedule.filter(s => s.classe === classe);
              const classHeures = classCours.length * 2;
              return (
                <Card key={classe} className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm font-medium">{classe}</Badge>
                    <span className="text-sm font-bold">{classHeures}h/sem</span>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {classCours.map((c, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{c.jour} {c.heureDebut}</span>
                        <span>{c.salle}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
