import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  GraduationCap,
  PartyPopper,
  BookOpen,
  AlertCircle,
  Plus,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  Bell
} from "lucide-react";
import { format, isSameDay, isToday, isFuture, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SchoolEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  time?: string;
  type: 'holiday' | 'exam' | 'meeting' | 'event' | 'deadline';
  description: string;
  location?: string;
  mandatory?: boolean;
}

interface Appointment {
  id: string;
  teacherName: string;
  subject: string;
  date: Date;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  location: string;
}

interface TeacherSlot {
  id: string;
  teacherName: string;
  subject: string;
  date: Date;
  time: string;
  available: boolean;
}

const mockEvents: SchoolEvent[] = [
  {
    id: "1",
    title: "Vacances de Noël",
    date: new Date(2024, 11, 21),
    endDate: new Date(2025, 0, 6),
    type: "holiday",
    description: "Vacances scolaires de fin d'année"
  },
  {
    id: "2",
    title: "Conseil de classe - 3ème A",
    date: new Date(2024, 11, 15),
    time: "14:00",
    type: "meeting",
    description: "Conseil de classe du premier trimestre",
    location: "Salle de réunion",
    mandatory: true
  },
  {
    id: "3",
    title: "Composition du 1er Trimestre",
    date: new Date(2024, 11, 10),
    endDate: new Date(2024, 11, 14),
    type: "exam",
    description: "Examens de fin de trimestre pour toutes les classes"
  },
  {
    id: "4",
    title: "Fête de l'école",
    date: new Date(2024, 11, 20),
    time: "15:00",
    type: "event",
    description: "Fête de fin d'année avec spectacles et expositions",
    location: "Cour principale"
  },
  {
    id: "5",
    title: "Date limite inscription cantine",
    date: new Date(2024, 11, 8),
    type: "deadline",
    description: "Dernier jour pour l'inscription à la cantine du mois de janvier",
    mandatory: true
  },
  {
    id: "6",
    title: "Réunion parents-professeurs",
    date: new Date(2024, 11, 18),
    time: "17:00",
    type: "meeting",
    description: "Rencontre avec les enseignants pour discuter des progrès",
    location: "Salles de classe",
    mandatory: true
  },
  {
    id: "7",
    title: "Journée sportive inter-classes",
    date: addDays(new Date(), 5),
    time: "08:00",
    type: "event",
    description: "Compétitions sportives entre les différentes classes",
    location: "Stade de l'école"
  },
  {
    id: "8",
    title: "Remise des bulletins",
    date: addDays(new Date(), 10),
    time: "16:00",
    type: "meeting",
    description: "Distribution des bulletins du 1er trimestre aux parents",
    location: "Salles de classe",
    mandatory: true
  }
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    teacherName: "M. Kouassi Jean",
    subject: "Mathématiques",
    date: addDays(new Date(), 2),
    time: "14:30",
    duration: 30,
    status: "confirmed",
    location: "Salle 105",
    notes: "Discussion sur les résultats du dernier contrôle"
  },
  {
    id: "2",
    teacherName: "Mme Bamba Aïcha",
    subject: "Français",
    date: addDays(new Date(), 7),
    time: "15:00",
    duration: 30,
    status: "pending",
    location: "Salle 203"
  },
  {
    id: "3",
    teacherName: "M. Diallo Moussa",
    subject: "Sciences Physiques",
    date: addDays(new Date(), -5),
    time: "16:00",
    duration: 30,
    status: "completed",
    location: "Laboratoire",
    notes: "Progrès notables observés"
  }
];

const mockAvailableSlots: TeacherSlot[] = [
  { id: "s1", teacherName: "M. Kouassi Jean", subject: "Mathématiques", date: addDays(new Date(), 3), time: "14:00", available: true },
  { id: "s2", teacherName: "M. Kouassi Jean", subject: "Mathématiques", date: addDays(new Date(), 3), time: "14:30", available: true },
  { id: "s3", teacherName: "M. Kouassi Jean", subject: "Mathématiques", date: addDays(new Date(), 3), time: "15:00", available: false },
  { id: "s4", teacherName: "Mme Bamba Aïcha", subject: "Français", date: addDays(new Date(), 4), time: "10:00", available: true },
  { id: "s5", teacherName: "Mme Bamba Aïcha", subject: "Français", date: addDays(new Date(), 4), time: "10:30", available: true },
  { id: "s6", teacherName: "M. Diallo Moussa", subject: "Sciences Physiques", date: addDays(new Date(), 5), time: "11:00", available: true },
  { id: "s7", teacherName: "Mme Koné Fatou", subject: "Anglais", date: addDays(new Date(), 6), time: "09:00", available: true },
  { id: "s8", teacherName: "M. Touré Ibrahim", subject: "Histoire-Géo", date: addDays(new Date(), 6), time: "14:00", available: true },
];

const eventTypeConfig = {
  holiday: { icon: PartyPopper, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Vacances" },
  exam: { icon: BookOpen, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", label: "Examen" },
  meeting: { icon: Users, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Réunion" },
  event: { icon: CalendarDays, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Événement" },
  deadline: { icon: AlertCircle, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Échéance" }
};

const appointmentStatusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "En attente" },
  confirmed: { color: "bg-green-100 text-green-800", label: "Confirmé" },
  cancelled: { color: "bg-red-100 text-red-800", label: "Annulé" },
  completed: { color: "bg-gray-100 text-gray-800", label: "Terminé" }
};

export default function CalendrierParents() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => {
      if (event.endDate) {
        return date >= event.date && date <= event.endDate;
      }
      return isSameDay(event.date, date);
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const upcomingEvents = mockEvents
    .filter(e => isFuture(e.endDate || e.date) || isToday(e.endDate || e.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const upcomingAppointments = appointments
    .filter(a => (isFuture(a.date) || isToday(a.date)) && a.status !== 'cancelled')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const filteredSlots = selectedTeacher
    ? mockAvailableSlots.filter(s => s.teacherName === selectedTeacher && s.available)
    : mockAvailableSlots.filter(s => s.available);

  const uniqueTeachers = [...new Set(mockAvailableSlots.map(s => s.teacherName))];

  const handleBookAppointment = (slot: TeacherSlot) => {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      teacherName: slot.teacherName,
      subject: slot.subject,
      date: slot.date,
      time: slot.time,
      duration: 30,
      status: "pending",
      location: "À confirmer",
      notes: appointmentReason
    };

    setAppointments([...appointments, newAppointment]);
    setBookingDialogOpen(false);
    setAppointmentReason("");
    setSelectedTeacher("");

    toast({
      title: "Rendez-vous demandé",
      description: `Votre demande de rendez-vous avec ${slot.teacherName} a été envoyée.`
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
    ));
    toast({
      title: "Rendez-vous annulé",
      description: "Le rendez-vous a été annulé avec succès."
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  const hasEventOnDate = (date: Date) => {
    return mockEvents.some(event => {
      if (event.endDate) {
        return date >= event.date && date <= event.endDate;
      }
      return isSameDay(event.date, date);
    });
  };

  const hasAppointmentOnDate = (date: Date) => {
    return appointments.some(apt => isSameDay(apt.date, date) && apt.status !== 'cancelled');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendrier Scolaire</h1>
          <p className="text-muted-foreground">Événements et rendez-vous parents-enseignants</p>
        </div>
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Prendre rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Prendre un rendez-vous</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Filtrer par enseignant</label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les enseignants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les enseignants</SelectItem>
                    {uniqueTeachers.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Motif du rendez-vous (optionnel)</label>
                <Textarea
                  placeholder="Décrivez brièvement le sujet que vous souhaitez aborder..."
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Créneaux disponibles</label>
                <ScrollArea className="h-[300px] border rounded-lg p-3">
                  {filteredSlots.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun créneau disponible pour cet enseignant
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {filteredSlots.map(slot => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{slot.teacherName}</p>
                              <p className="text-sm text-muted-foreground">{slot.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {format(slot.date, "EEEE d MMMM", { locale: fr })}
                              </p>
                              <p className="text-sm text-muted-foreground">{slot.time}</p>
                            </div>
                            <Button size="sm" onClick={() => handleBookAppointment(slot)}>
                              Réserver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  hasEvent: (date) => hasEventOnDate(date),
                  hasAppointment: (date) => hasAppointmentOnDate(date)
                }}
                modifiersStyles={{
                  hasEvent: { backgroundColor: "hsl(var(--primary) / 0.1)", fontWeight: "bold" },
                  hasAppointment: { border: "2px solid hsl(var(--primary))" }
                }}
              />

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    {selectedDate 
                      ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                      : "Sélectionnez une date"}
                  </h3>
                  
                  {selectedDateEvents.length === 0 && selectedDateAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Aucun événement pour cette date</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map(event => {
                        const config = eventTypeConfig[event.type];
                        const Icon = config.icon;
                        return (
                          <div key={event.id} className="p-3 border rounded-lg bg-card">
                            <div className="flex items-start gap-3">
                              <div className={cn("p-2 rounded-lg", config.color)}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{event.title}</h4>
                                  {event.mandatory && (
                                    <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  {event.time && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> {event.time}
                                    </span>
                                  )}
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" /> {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {selectedDateAppointments.map(apt => (
                        <div key={apt.id} className="p-3 border rounded-lg bg-primary/5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <GraduationCap className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">RDV: {apt.teacherName}</h4>
                                <p className="text-sm text-muted-foreground">{apt.subject}</p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {apt.time} ({apt.duration}min)
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {apt.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge className={appointmentStatusConfig[apt.status].color}>
                              {appointmentStatusConfig[apt.status].label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary/10"></div>
                    <span>Événement scolaire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-primary"></div>
                    <span>Rendez-vous</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prochains rendez-vous */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mes rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Aucun rendez-vous planifié
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map(apt => (
                    <div key={apt.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{apt.teacherName}</h4>
                        <Badge variant="outline" className={cn("text-xs", appointmentStatusConfig[apt.status].color)}>
                          {appointmentStatusConfig[apt.status].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{apt.subject}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{format(apt.date, "d MMM", { locale: fr })}</span>
                        <span>{apt.time}</span>
                      </div>
                      {apt.status === 'pending' || apt.status === 'confirmed' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-destructive hover:text-destructive w-full"
                          onClick={() => handleCancelAppointment(apt.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prochains événements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Événements à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map(event => {
                  const config = eventTypeConfig[event.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedDate(event.date)}
                    >
                      <div className={cn("p-1.5 rounded", config.color)}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, "d MMM", { locale: fr })}
                          {event.time && ` à ${event.time}`}
                        </p>
                      </div>
                      {event.mandatory && (
                        <Badge variant="outline" className="text-xs shrink-0">!</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Légende des types d'événements */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {Object.entries(eventTypeConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded", config.color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm">{config.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
