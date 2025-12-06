import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWeekend } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CalendarDays,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Upload,
  Send,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Coffee,
  Utensils
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

// Mock data
const mockStudent = {
  matricule: "66800001A",
  name: "Kouassi Jean-Marc",
  class: "6ème A"
};

const absencesData = [
  { id: 1, date: "2024-11-15", type: "Absence", duree: "Journée", motif: "Maladie", matiere: "-", justifie: true, document: "Certificat médical" },
  { id: 2, date: "2024-11-12", type: "Retard", duree: "15 min", motif: "Transport", matiere: "Mathématiques", justifie: true, document: null },
  { id: 3, date: "2024-11-08", type: "Absence", duree: "Matin", motif: "Rendez-vous médical", matiere: "-", justifie: true, document: "Certificat médical" },
  { id: 4, date: "2024-11-05", type: "Retard", duree: "10 min", motif: "Non justifié", matiere: "Français", justifie: false, document: null },
  { id: 5, date: "2024-10-28", type: "Absence", duree: "Journée", motif: "Fête familiale", matiere: "-", justifie: false, document: null },
  { id: 6, date: "2024-10-20", type: "Retard", duree: "20 min", motif: "Panne véhicule", matiere: "Histoire-Géo", justifie: true, document: null },
  { id: 7, date: "2024-10-15", type: "Absence", duree: "Après-midi", motif: "Maladie", matiere: "-", justifie: true, document: "Certificat médical" },
];

const emploiDuTemps = [
  { jour: "Lundi", heures: [
    { heure: "07:30-08:30", matiere: "Mathématiques", prof: "M. Konan", salle: "B12" },
    { heure: "08:30-09:30", matiere: "Français", prof: "Mme Bamba", salle: "B12" },
    { heure: "09:30-10:00", matiere: "Récréation", prof: "-", salle: "-" },
    { heure: "10:00-11:00", matiere: "Anglais", prof: "M. Yao", salle: "B12" },
    { heure: "11:00-12:00", matiere: "Histoire-Géo", prof: "M. Touré", salle: "B12" },
    { heure: "12:00-14:00", matiere: "Pause déjeuner", prof: "-", salle: "-" },
    { heure: "14:00-15:00", matiere: "SVT", prof: "Mme Koné", salle: "Labo" },
    { heure: "15:00-16:00", matiere: "EPS", prof: "M. Diallo", salle: "Terrain" },
  ]},
  { jour: "Mardi", heures: [
    { heure: "07:30-08:30", matiere: "Français", prof: "Mme Bamba", salle: "B12" },
    { heure: "08:30-09:30", matiere: "Mathématiques", prof: "M. Konan", salle: "B12" },
    { heure: "09:30-10:00", matiere: "Récréation", prof: "-", salle: "-" },
    { heure: "10:00-11:00", matiere: "Physique-Chimie", prof: "M. Aka", salle: "Labo" },
    { heure: "11:00-12:00", matiere: "Anglais", prof: "M. Yao", salle: "B12" },
    { heure: "12:00-14:00", matiere: "Pause déjeuner", prof: "-", salle: "-" },
    { heure: "14:00-15:00", matiere: "Arts Plastiques", prof: "Mme Coulibaly", salle: "Salle Art" },
    { heure: "15:00-16:00", matiere: "Musique", prof: "M. Sanogo", salle: "Salle Musique" },
  ]},
  { jour: "Mercredi", heures: [
    { heure: "07:30-08:30", matiere: "Histoire-Géo", prof: "M. Touré", salle: "B12" },
    { heure: "08:30-09:30", matiere: "SVT", prof: "Mme Koné", salle: "B12" },
    { heure: "09:30-10:00", matiere: "Récréation", prof: "-", salle: "-" },
    { heure: "10:00-11:00", matiere: "Mathématiques", prof: "M. Konan", salle: "B12" },
    { heure: "11:00-12:00", matiere: "Français", prof: "Mme Bamba", salle: "B12" },
  ]},
  { jour: "Jeudi", heures: [
    { heure: "07:30-08:30", matiere: "Anglais", prof: "M. Yao", salle: "B12" },
    { heure: "08:30-09:30", matiere: "Physique-Chimie", prof: "M. Aka", salle: "Labo" },
    { heure: "09:30-10:00", matiere: "Récréation", prof: "-", salle: "-" },
    { heure: "10:00-11:00", matiere: "Français", prof: "Mme Bamba", salle: "B12" },
    { heure: "11:00-12:00", matiere: "Mathématiques", prof: "M. Konan", salle: "B12" },
    { heure: "12:00-14:00", matiere: "Pause déjeuner", prof: "-", salle: "-" },
    { heure: "14:00-15:00", matiere: "EPS", prof: "M. Diallo", salle: "Terrain" },
    { heure: "15:00-16:00", matiere: "Histoire-Géo", prof: "M. Touré", salle: "B12" },
  ]},
  { jour: "Vendredi", heures: [
    { heure: "07:30-08:30", matiere: "SVT", prof: "Mme Koné", salle: "Labo" },
    { heure: "08:30-09:30", matiere: "Français", prof: "Mme Bamba", salle: "B12" },
    { heure: "09:30-10:00", matiere: "Récréation", prof: "-", salle: "-" },
    { heure: "10:00-11:00", matiere: "Mathématiques", prof: "M. Konan", salle: "B12" },
    { heure: "11:00-12:00", matiere: "Anglais", prof: "M. Yao", salle: "B12" },
    { heure: "12:00-14:00", matiere: "Pause déjeuner", prof: "-", salle: "-" },
    { heure: "14:00-15:00", matiere: "Éducation civique", prof: "M. Touré", salle: "B12" },
    { heure: "15:00-16:00", matiere: "Étude dirigée", prof: "M. Konan", salle: "B12" },
  ]},
];

const statistiquesAssiduite = [
  { name: "Présences", value: 85, color: "hsl(var(--success))" },
  { name: "Absences justifiées", value: 8, color: "hsl(var(--warning))" },
  { name: "Absences non justifiées", value: 4, color: "hsl(var(--destructive))" },
  { name: "Retards", value: 3, color: "hsl(var(--primary))" },
];

export default function AbsencesParents() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [justificationDialog, setJustificationDialog] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<typeof absencesData[0] | null>(null);
  const [motif, setMotif] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  const totalAbsences = absencesData.filter(a => a.type === "Absence").length;
  const absencesNonJustifiees = absencesData.filter(a => a.type === "Absence" && !a.justifie).length;
  const totalRetards = absencesData.filter(a => a.type === "Retard").length;
  const retardsNonJustifies = absencesData.filter(a => a.type === "Retard" && !a.justifie).length;

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).filter(day => !isWeekend(day));

  const handleJustifier = (absence: typeof absencesData[0]) => {
    setSelectedAbsence(absence);
    setJustificationDialog(true);
  };

  const handleSubmitJustification = () => {
    if (!motif) {
      toast.error("Veuillez saisir un motif");
      return;
    }
    toast.success("Justification envoyée avec succès");
    setJustificationDialog(false);
    setMotif("");
    setDocument(null);
  };

  const getMatiereIcon = (matiere: string) => {
    if (matiere === "Récréation") return <Coffee className="h-4 w-4 text-warning" />;
    if (matiere === "Pause déjeuner") return <Utensils className="h-4 w-4 text-warning" />;
    return <BookOpen className="h-4 w-4 text-primary" />;
  };

  const getMatiereStyle = (matiere: string) => {
    if (matiere === "Récréation" || matiere === "Pause déjeuner") {
      return "bg-warning/10 border-warning/20 text-warning";
    }
    return "bg-card hover:bg-muted/50";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            Absences & Emploi du Temps
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivi de l'assiduité de {mockStudent.name} - {mockStudent.class}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absences</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{totalAbsences}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {absencesNonJustifiees} non justifiée(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Retards</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{totalRetards}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {retardsNonJustifies} non justifié(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">85%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ce trimestre
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Manquées</CardTitle>
            <AlertCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">12h</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ce trimestre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="absences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="absences" className="flex items-center gap-2 py-2">
            <XCircle className="h-4 w-4" />
            <span>Absences & Retards</span>
          </TabsTrigger>
          <TabsTrigger value="emploi" className="flex items-center gap-2 py-2">
            <CalendarDays className="h-4 w-4" />
            <span>Emploi du Temps</span>
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="flex items-center gap-2 py-2">
            <FileText className="h-4 w-4" />
            <span>Statistiques</span>
          </TabsTrigger>
        </TabsList>

        {/* Absences Tab */}
        <TabsContent value="absences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Absences et Retards</CardTitle>
              <CardDescription>Liste complète avec possibilité de justifier</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absencesData.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">
                        {format(new Date(absence.date), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={absence.type === "Absence" ? "destructive" : "secondary"}>
                          {absence.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{absence.duree}</TableCell>
                      <TableCell className="text-muted-foreground">{absence.matiere}</TableCell>
                      <TableCell>{absence.motif}</TableCell>
                      <TableCell className="text-center">
                        {absence.justifie ? (
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Justifié
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                            <XCircle className="h-3 w-3 mr-1" />
                            Non justifié
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!absence.justifie && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleJustifier(absence)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Justifier
                          </Button>
                        )}
                        {absence.document && (
                          <Badge variant="outline" className="ml-2">
                            <FileText className="h-3 w-3 mr-1" />
                            {absence.document}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emploi du temps Tab */}
        <TabsContent value="emploi" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Emploi du Temps</CardTitle>
                  <CardDescription>
                    Semaine du {format(weekStart, "dd MMMM", { locale: fr })} au {format(weekEnd, "dd MMMM yyyy", { locale: fr })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Calendrier
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedWeek}
                        onSelect={(date) => date && setSelectedWeek(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {emploiDuTemps.map((jour, jourIndex) => (
                  <div key={jour.jour} className="space-y-2">
                    <div className={cn(
                      "text-center font-semibold p-2 rounded-lg",
                      isSameDay(weekDays[jourIndex], new Date()) 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      {jour.jour}
                      <div className="text-xs font-normal">
                        {format(weekDays[jourIndex], "dd/MM")}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {jour.heures.map((cours, coursIndex) => (
                        <div 
                          key={coursIndex}
                          className={cn(
                            "p-2 rounded-lg border text-xs transition-colors",
                            getMatiereStyle(cours.matiere)
                          )}
                        >
                          <div className="flex items-center gap-1 font-medium text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {cours.heure}
                          </div>
                          <div className="flex items-center gap-1 mt-1 font-semibold">
                            {getMatiereIcon(cours.matiere)}
                            {cours.matiere}
                          </div>
                          {cours.prof !== "-" && (
                            <div className="text-muted-foreground mt-1">
                              {cours.prof} • {cours.salle}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistiques Tab */}
        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition de l'Assiduité</CardTitle>
                <CardDescription>Ce trimestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statistiquesAssiduite}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${value}%`}
                      >
                        {statistiquesAssiduite.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résumé du Trimestre</CardTitle>
                <CardDescription>Statistiques détaillées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Jours de présence</span>
                    </div>
                    <span className="font-bold text-success">45 jours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-warning" />
                      <span>Absences justifiées</span>
                    </div>
                    <span className="font-bold text-warning">4 jours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span>Absences non justifiées</span>
                    </div>
                    <span className="font-bold text-destructive">2 jours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Retards</span>
                    </div>
                    <span className="font-bold text-primary">3</span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Taux d'assiduité global</p>
                    <p className="text-4xl font-bold text-success">85%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Objectif: 95%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de justification */}
      <Dialog open={justificationDialog} onOpenChange={setJustificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justifier une Absence</DialogTitle>
            <DialogDescription>
              {selectedAbsence && (
                <>
                  {selectedAbsence.type} du {format(new Date(selectedAbsence.date), "dd MMMM yyyy", { locale: fr })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motif">Motif de l'absence</Label>
              <Select value={motif} onValueChange={setMotif}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maladie">Maladie</SelectItem>
                  <SelectItem value="rdv-medical">Rendez-vous médical</SelectItem>
                  <SelectItem value="transport">Problème de transport</SelectItem>
                  <SelectItem value="famille">Raison familiale</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Détails supplémentaires</Label>
              <Textarea 
                id="details" 
                placeholder="Précisez les circonstances..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Document justificatif (optionnel)</Label>
              <Input 
                id="document" 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDocument(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés: PDF, JPG, PNG (max 5MB)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJustificationDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitJustification}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
