import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Building, Plus, Clock, Users, CheckCircle, XCircle, AlertTriangle, Search, Filter, Trash2, Edit, Eye, CalendarDays, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Reservation {
  id: number;
  room: string;
  building: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  organizer: string;
  department: string;
  attendees: number;
  status: "Confirmée" | "En attente" | "Annulée" | "Terminée";
  recurrent: boolean;
  notes?: string;
}

interface TimeSlot {
  time: string;
  rooms: { [key: string]: Reservation | null };
}

const rooms = [
  "Salle 101", "Salle 102", "Salle 103", "Labo Physique", "Labo Chimie", 
  "Salle Info 1", "Salle Info 2", "CDI", "Amphithéâtre", "Salle des Profs"
];

const initialReservations: Reservation[] = [
  { id: 1, room: "Amphithéâtre", building: "Bâtiment A", date: "2024-12-16", startTime: "08:00", endTime: "10:00", purpose: "Réunion générale", organizer: "M. KOUAME", department: "Direction", attendees: 150, status: "Confirmée", recurrent: false },
  { id: 2, room: "Salle Info 1", building: "Bâtiment C", date: "2024-12-16", startTime: "09:00", endTime: "11:00", purpose: "Formation informatique", organizer: "Mme BAMBA", department: "Informatique", attendees: 30, status: "Confirmée", recurrent: true },
  { id: 3, room: "Labo Physique", building: "Bâtiment B", date: "2024-12-16", startTime: "10:00", endTime: "12:00", purpose: "TP Physique 1ère S", organizer: "M. TRAORE", department: "Sciences", attendees: 25, status: "Confirmée", recurrent: true },
  { id: 4, room: "CDI", building: "Bâtiment A", date: "2024-12-16", startTime: "14:00", endTime: "16:00", purpose: "Club lecture", organizer: "Mme DIALLO", department: "Bibliothèque", attendees: 20, status: "En attente", recurrent: true },
  { id: 5, room: "Salle 101", building: "Bâtiment A", date: "2024-12-17", startTime: "08:00", endTime: "10:00", purpose: "Examen blanc", organizer: "M. KONE", department: "Examens", attendees: 40, status: "Confirmée", recurrent: false },
  { id: 6, room: "Amphithéâtre", building: "Bâtiment A", date: "2024-12-17", startTime: "14:00", endTime: "17:00", purpose: "Conférence parentale", organizer: "Direction", department: "Administration", attendees: 200, status: "Confirmée", recurrent: false },
  { id: 7, room: "Salle Info 2", building: "Bâtiment C", date: "2024-12-18", startTime: "09:00", endTime: "12:00", purpose: "Atelier coding", organizer: "M. YAPI", department: "Informatique", attendees: 25, status: "En attente", recurrent: false },
  { id: 8, room: "Labo Chimie", building: "Bâtiment B", date: "2024-12-16", startTime: "14:00", endTime: "16:00", purpose: "TP Chimie Terminale", organizer: "Mme GNAGNE", department: "Sciences", attendees: 28, status: "Confirmée", recurrent: true },
  { id: 9, room: "Salle des Profs", building: "Bâtiment A", date: "2024-12-16", startTime: "16:00", endTime: "18:00", purpose: "Conseil de classe", organizer: "M. KOUAME", department: "Pédagogie", attendees: 15, status: "Confirmée", recurrent: false },
  { id: 10, room: "Salle 102", building: "Bâtiment A", date: "2024-12-19", startTime: "10:00", endTime: "12:00", purpose: "Réunion parents 6ème", organizer: "Mme TOURE", department: "6ème", attendees: 35, status: "En attente", recurrent: false },
];

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function PlanningInfrastructuresPage() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [selectedDate, setSelectedDate] = useState("2024-12-16");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRoom, setFilterRoom] = useState<string>("all");

  const todayReservations = reservations.filter(r => r.date === selectedDate);
  const pendingReservations = reservations.filter(r => r.status === "En attente");
  const confirmedReservations = reservations.filter(r => r.status === "Confirmée");

  const stats = {
    totalToday: todayReservations.length,
    available: rooms.length - new Set(todayReservations.filter(r => r.status === "Confirmée").map(r => r.room)).size,
    pending: pendingReservations.length,
    conflicts: 3,
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesRoom = filterRoom === "all" || r.room === filterRoom;
    return matchesSearch && matchesStatus && matchesRoom;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmée": return "bg-green-500 text-white";
      case "En attente": return "bg-yellow-500 text-white";
      case "Annulée": return "bg-red-500 text-white";
      case "Terminée": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmée": return <CheckCircle className="h-3 w-3" />;
      case "En attente": return <Clock className="h-3 w-3" />;
      case "Annulée": return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleAddReservation = () => {
    toast({
      title: "Réservation créée",
      description: "La demande de réservation a été envoyée pour validation.",
    });
    setIsAddDialogOpen(false);
  };

  const handleApproveReservation = (id: number) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status: "Confirmée" as const } : r
    ));
    toast({
      title: "Réservation approuvée",
      description: "La réservation a été confirmée.",
    });
  };

  const handleRejectReservation = (id: number) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status: "Annulée" as const } : r
    ));
    toast({
      title: "Réservation refusée",
      description: "La réservation a été annulée.",
    });
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsViewDialogOpen(true);
  };

  const getReservationForSlot = (room: string, time: string): Reservation | null => {
    return todayReservations.find(r => {
      if (r.room !== room || r.status === "Annulée") return false;
      const start = parseInt(r.startTime.split(":")[0]);
      const end = parseInt(r.endTime.split(":")[0]);
      const slotTime = parseInt(time.split(":")[0]);
      return slotTime >= start && slotTime < end;
    }) || null;
  };

  const weekDays = [
    { day: "Lun", date: "16", full: "2024-12-16" },
    { day: "Mar", date: "17", full: "2024-12-17" },
    { day: "Mer", date: "18", full: "2024-12-18" },
    { day: "Jeu", date: "19", full: "2024-12-19" },
    { day: "Ven", date: "20", full: "2024-12-20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planning d'Utilisation</h1>
          <p className="text-muted-foreground mt-1">
            Réservation et planning des salles et locaux
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Réservation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvelle Réservation</DialogTitle>
                <DialogDescription>Demandez une réservation de salle</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">Salle</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une salle" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room} value={room}>{room}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Heure de début</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Début" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Heure de fin</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Fin" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Objet de la réservation</Label>
                  <Input id="purpose" placeholder="Ex: Réunion de parents, TP Sciences..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizer">Organisateur</Label>
                    <Input id="organizer" placeholder="Nom de l'organisateur" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Nombre de participants</Label>
                    <Input id="attendees" type="number" placeholder="25" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Input id="notes" placeholder="Besoins particuliers, équipements..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleAddReservation}>Soumettre la demande</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Salles Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground mt-1">sur {rooms.length} salles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Réservations Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalToday}</div>
            <p className="text-xs text-muted-foreground mt-1">programmées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">à valider</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conflits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.conflicts}</div>
            <p className="text-xs text-muted-foreground mt-1">à résoudre</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Vue Calendrier</TabsTrigger>
          <TabsTrigger value="week">Vue Semaine</TabsTrigger>
          <TabsTrigger value="list">Liste des Réservations</TabsTrigger>
          <TabsTrigger value="pending">Demandes en Attente ({pendingReservations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Planning du Jour</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate("2024-12-15")}>
                    ← Précédent
                  </Button>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-[180px]"
                  />
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate("2024-12-17")}>
                    Suivant →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Heure</TableHead>
                      {rooms.slice(0, 6).map(room => (
                        <TableHead key={room} className="text-center min-w-[120px]">{room}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeSlots.slice(0, -1).map((time) => (
                      <TableRow key={time}>
                        <TableCell className="font-medium">{time}</TableCell>
                        {rooms.slice(0, 6).map(room => {
                          const reservation = getReservationForSlot(room, time);
                          return (
                            <TableCell key={room} className="p-1">
                              {reservation ? (
                                <div 
                                  className={`p-2 rounded text-xs cursor-pointer ${
                                    reservation.status === "Confirmée" ? "bg-blue-100 border-l-4 border-blue-500" :
                                    reservation.status === "En attente" ? "bg-yellow-100 border-l-4 border-yellow-500" :
                                    "bg-gray-100"
                                  }`}
                                  onClick={() => handleViewReservation(reservation)}
                                >
                                  <div className="font-medium truncate">{reservation.purpose}</div>
                                  <div className="text-muted-foreground">{reservation.organizer}</div>
                                </div>
                              ) : (
                                <div className="p-2 text-center text-muted-foreground text-xs">
                                  -
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border-l-4 border-blue-500 rounded"></div>
                  <span>Confirmée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border-l-4 border-yellow-500 rounded"></div>
                  <span>En attente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>Disponible</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Semaine du 16 au 20 Décembre 2024</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">← Semaine précédente</Button>
                  <Button variant="outline" size="sm">Semaine suivante →</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {weekDays.map((day) => {
                  const dayReservations = reservations.filter(r => r.date === day.full && r.status !== "Annulée");
                  return (
                    <Card key={day.full} className={selectedDate === day.full ? "border-primary" : ""}>
                      <CardHeader className="pb-2">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">{day.day}</div>
                          <div className="text-2xl font-bold">{day.date}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {dayReservations.length > 0 ? (
                          dayReservations.slice(0, 3).map((reservation) => (
                            <div
                              key={reservation.id}
                              className={`p-2 rounded text-xs cursor-pointer ${
                                reservation.status === "Confirmée" ? "bg-blue-50 border-l-2 border-blue-500" :
                                "bg-yellow-50 border-l-2 border-yellow-500"
                              }`}
                              onClick={() => handleViewReservation(reservation)}
                            >
                              <div className="font-medium truncate">{reservation.room}</div>
                              <div className="text-muted-foreground">{reservation.startTime} - {reservation.endTime}</div>
                              <div className="truncate">{reservation.purpose}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground text-sm py-4">
                            Aucune réservation
                          </div>
                        )}
                        {dayReservations.length > 3 && (
                          <div className="text-center text-xs text-muted-foreground">
                            +{dayReservations.length - 3} autres
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Toutes les Réservations</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[200px]"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="Confirmée">Confirmée</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRoom} onValueChange={setFilterRoom}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Salle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes salles</SelectItem>
                      {rooms.map(room => (
                        <SelectItem key={room} value={room}>{room}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salle</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Objet</TableHead>
                    <TableHead>Organisateur</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{reservation.room}</div>
                          <div className="text-xs text-muted-foreground">{reservation.building}</div>
                        </div>
                      </TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.startTime} - {reservation.endTime}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="truncate">{reservation.purpose}</div>
                          {reservation.recurrent && (
                            <Badge variant="outline" className="text-xs mt-1">Récurrent</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{reservation.organizer}</div>
                          <div className="text-xs text-muted-foreground">{reservation.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {reservation.attendees}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleViewReservation(reservation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes en Attente de Validation</CardTitle>
              <CardDescription>Approuvez ou refusez les demandes de réservation</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReservations.length > 0 ? (
                <div className="space-y-4">
                  {pendingReservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{reservation.room}</span>
                              <Badge variant="outline">{reservation.building}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                {reservation.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {reservation.startTime} - {reservation.endTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {reservation.attendees} personnes
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Objet: </span>
                              {reservation.purpose}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Demandé par <span className="font-medium">{reservation.organizer}</span> ({reservation.department})
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleRejectReservation(reservation.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Refuser
                            </Button>
                            <Button 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveReservation(reservation.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approuver
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Aucune demande en attente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Reservation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la Réservation</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-lg">{selectedReservation.room}</span>
                </div>
                <Badge className={getStatusColor(selectedReservation.status)}>
                  {selectedReservation.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{selectedReservation.date}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Horaire</Label>
                  <p className="font-medium">{selectedReservation.startTime} - {selectedReservation.endTime}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Objet</Label>
                <p className="font-medium">{selectedReservation.purpose}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Organisateur</Label>
                  <p className="font-medium">{selectedReservation.organizer}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Département</Label>
                  <p className="font-medium">{selectedReservation.department}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Participants</Label>
                <p className="font-medium">{selectedReservation.attendees} personnes</p>
              </div>
              {selectedReservation.recurrent && (
                <Badge variant="outline">
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Réservation récurrente
                </Badge>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            {selectedReservation?.status === "En attente" && (
              <>
                <Button variant="outline" className="text-red-600" onClick={() => {
                  handleRejectReservation(selectedReservation.id);
                  setIsViewDialogOpen(false);
                }}>
                  Refuser
                </Button>
                <Button onClick={() => {
                  handleApproveReservation(selectedReservation.id);
                  setIsViewDialogOpen(false);
                }}>
                  Approuver
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
