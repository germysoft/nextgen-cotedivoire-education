import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarDays, 
  Plus, 
  BookOpen, 
  Users, 
  Trophy, 
  GraduationCap, 
  Clock,
  Download,
  Bell,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import { format, addDays, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

// Types d'événements
type EventType = "academique" | "examen" | "reunion" | "ferie" | "activite" | "conseil";

interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: EventType;
  allDay: boolean;
  location?: string;
  participants?: string[];
}

// Événements scolaires de l'année
const mockEvents: SchoolEvent[] = [
  {
    id: "1",
    title: "Rentrée scolaire",
    description: "Début de l'année scolaire 2024-2025",
    startDate: new Date(2024, 8, 2),
    type: "academique",
    allDay: true,
  },
  {
    id: "2",
    title: "Fin 1er Trimestre",
    description: "Fin des cours du 1er trimestre",
    startDate: new Date(2024, 11, 20),
    type: "academique",
    allDay: true,
  },
  {
    id: "3",
    title: "Vacances de Noël",
    description: "Congés de fin d'année",
    startDate: new Date(2024, 11, 21),
    endDate: new Date(2025, 0, 5),
    type: "ferie",
    allDay: true,
  },
  {
    id: "4",
    title: "Reprise des cours",
    description: "Retour de vacances",
    startDate: new Date(2025, 0, 6),
    type: "academique",
    allDay: true,
  },
  {
    id: "5",
    title: "Conseil de classe 3ème",
    description: "Conseil de classe du 1er trimestre",
    startDate: new Date(2025, 0, 15),
    type: "conseil",
    allDay: false,
    location: "Salle de réunion",
    participants: ["Directeur", "CPE", "Professeurs 3ème"],
  },
  {
    id: "6",
    title: "Réunion parents-professeurs",
    description: "Remise des bulletins du 1er trimestre",
    startDate: new Date(2025, 0, 18),
    type: "reunion",
    allDay: true,
    location: "Établissement",
  },
  {
    id: "7",
    title: "Composition du 2ème Trimestre",
    description: "Examens du 2ème trimestre",
    startDate: new Date(2025, 2, 15),
    endDate: new Date(2025, 2, 22),
    type: "examen",
    allDay: true,
  },
  {
    id: "8",
    title: "Fête de l'Excellence",
    description: "Célébration des meilleurs élèves",
    startDate: new Date(2025, 3, 10),
    type: "activite",
    allDay: true,
    location: "Cour de l'école",
  },
  {
    id: "9",
    title: "BEPC Blanc",
    description: "Examen blanc pour les 3ème",
    startDate: new Date(2025, 3, 20),
    endDate: new Date(2025, 3, 25),
    type: "examen",
    allDay: true,
  },
  {
    id: "10",
    title: "Fin d'année scolaire",
    description: "Dernier jour de cours",
    startDate: new Date(2025, 5, 30),
    type: "academique",
    allDay: true,
  },
];

// Trimestres
const trimestres = [
  { id: 1, name: "1er Trimestre", debut: "02/09/2024", fin: "20/12/2024" },
  { id: 2, name: "2ème Trimestre", debut: "06/01/2025", fin: "28/03/2025" },
  { id: 3, name: "3ème Trimestre", debut: "14/04/2025", fin: "30/06/2025" },
];

// Vacances
const vacances = [
  { name: "Vacances de Noël", debut: "21/12/2024", fin: "05/01/2025" },
  { name: "Vacances de Février", debut: "22/02/2025", fin: "02/03/2025" },
  { name: "Vacances de Pâques", debut: "05/04/2025", fin: "13/04/2025" },
  { name: "Grandes vacances", debut: "01/07/2025", fin: "01/09/2025" },
];

export default function CalendrierScolaire() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<SchoolEvent[]>(mockEvents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "academique" as EventType,
    location: "",
  });

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case "academique":
        return "bg-primary text-primary-foreground";
      case "examen":
        return "bg-destructive text-destructive-foreground";
      case "reunion":
        return "bg-secondary text-secondary-foreground";
      case "ferie":
        return "bg-success text-success-foreground";
      case "activite":
        return "bg-warning text-warning-foreground";
      case "conseil":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "academique":
        return "Académique";
      case "examen":
        return "Examen";
      case "reunion":
        return "Réunion";
      case "ferie":
        return "Vacances/Férié";
      case "activite":
        return "Activité";
      case "conseil":
        return "Conseil";
      default:
        return type;
    }
  };

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case "academique":
        return <BookOpen className="h-4 w-4" />;
      case "examen":
        return <GraduationCap className="h-4 w-4" />;
      case "reunion":
        return <Users className="h-4 w-4" />;
      case "ferie":
        return <CalendarDays className="h-4 w-4" />;
      case "activite":
        return <Trophy className="h-4 w-4" />;
      case "conseil":
        return <Clock className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      if (event.endDate) {
        return isWithinInterval(date, { start: event.startDate, end: event.endDate });
      }
      return isSameDay(date, event.startDate);
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const upcomingEvents = events
    .filter((e) => e.startDate >= new Date())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 5);

  const handleAddEvent = () => {
    if (newEvent.title && selectedDate) {
      const event: SchoolEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        startDate: selectedDate,
        type: newEvent.type,
        allDay: true,
        location: newEvent.location,
      };
      setEvents([...events, event]);
      setNewEvent({ title: "", description: "", type: "academique", location: "" });
      setIsAddDialogOpen(false);
      toast({
        title: "Événement ajouté",
        description: `"${event.title}" a été ajouté au calendrier.`,
      });
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(0, 51, 102);
      doc.text("Calendrier Scolaire 2024-2025", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text("NextGen Éducation", 105, 28, { align: "center" });
      
      let yPos = 45;
      
      // Trimestres
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text("Trimestres", 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(50);
      trimestres.forEach(trim => {
        doc.text(`• ${trim.name}: Du ${trim.debut} au ${trim.fin}`, 25, yPos);
        yPos += 7;
      });
      
      yPos += 10;
      
      // Vacances
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text("Périodes de Vacances", 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(50);
      vacances.forEach(vac => {
        doc.text(`• ${vac.name}: Du ${vac.debut} au ${vac.fin}`, 25, yPos);
        yPos += 7;
      });
      
      yPos += 10;
      
      // Événements
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text("Événements Importants", 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(50);
      const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      sortedEvents.forEach(event => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        const dateStr = format(event.startDate, "dd/MM/yyyy", { locale: fr });
        doc.text(`• ${dateStr} - ${event.title} (${getEventTypeLabel(event.type)})`, 25, yPos);
        yPos += 7;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Généré le ${format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr })}`, 105, 285, { align: "center" });
      
      doc.save("calendrier-scolaire-2024-2025.pdf");
      
      toast({
        title: "Export réussi",
        description: "Le calendrier scolaire a été exporté en PDF.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le calendrier.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Custom day render to show dots for events
  const modifiers = {
    hasEvent: events.map((e) => e.startDate),
  };

  const modifiersStyles = {
    hasEvent: {
      fontWeight: "bold",
      backgroundColor: "hsl(var(--primary) / 0.1)",
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Calendrier Scolaire</h1>
          <p className="text-muted-foreground mt-2">Année scolaire 2024-2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isExporting ? "Export..." : "Exporter PDF"}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter événement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel événement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Nom de l'événement"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academique">Académique</SelectItem>
                      <SelectItem value="examen">Examen</SelectItem>
                      <SelectItem value="reunion">Réunion</SelectItem>
                      <SelectItem value="ferie">Vacances/Férié</SelectItem>
                      <SelectItem value="activite">Activité</SelectItem>
                      <SelectItem value="conseil">Conseil de classe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lieu</Label>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Lieu de l'événement"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Description de l'événement"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddEvent}>Ajouter</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendrier principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border w-full"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
            
            {/* Événements du jour sélectionné */}
            {selectedDate && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">
                  {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                </h3>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                            {event.location && (
                              <p className="text-xs text-muted-foreground">📍 {event.location}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={getEventTypeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Aucun événement ce jour
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Prochains événements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className={`p-1.5 rounded-full ${getEventTypeColor(event.type)}`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(event.startDate, "d MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trimestres */}
          <Card>
            <CardHeader>
              <CardTitle>Trimestres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trimestres.map((trim) => (
                  <div key={trim.id} className="p-3 rounded-lg border">
                    <p className="font-medium">{trim.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Du {trim.debut} au {trim.fin}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vacances */}
          <Card>
            <CardHeader>
              <CardTitle>Périodes de vacances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vacances.map((vac, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="font-medium text-success">{vac.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Du {vac.debut} au {vac.fin}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Légende */}
          <Card>
            <CardHeader>
              <CardTitle>Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Académique</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm">Examen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm">Réunion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm">Vacances</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm">Activité</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm">Conseil</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
