import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Send,
  Bell,
  Search,
  Filter,
  Download,
  MessageSquare,
  UserCheck,
  Mail,
  Phone
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  bookedBy?: string;
  studentName?: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  avatar: string;
  availableSlots: TimeSlot[];
}

interface Appointment {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  parentName: string;
  studentName: string;
  date: string;
  time: string;
  type: 'presential' | 'video';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

interface MeetingSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  location: string;
  type: 'presential' | 'video' | 'hybrid';
  status: 'upcoming' | 'ongoing' | 'completed';
  totalSlots: number;
  bookedSlots: number;
}

const ReunionsParents = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);
  const [appointmentType, setAppointmentType] = useState<'presential' | 'video'>('presential');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Mock data
  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'M. Dupont',
      subject: 'Mathématiques',
      email: 'dupont@ecole.fr',
      avatar: 'MD',
      availableSlots: [
        { id: '1-1', time: '08:00', available: true },
        { id: '1-2', time: '08:15', available: false, bookedBy: 'Parent Martin', studentName: 'Lucas Martin' },
        { id: '1-3', time: '08:30', available: true },
        { id: '1-4', time: '08:45', available: true },
        { id: '1-5', time: '09:00', available: false, bookedBy: 'Parent Bernard', studentName: 'Emma Bernard' },
        { id: '1-6', time: '09:15', available: true },
      ]
    },
    {
      id: '2',
      name: 'Mme Lambert',
      subject: 'Français',
      email: 'lambert@ecole.fr',
      avatar: 'ML',
      availableSlots: [
        { id: '2-1', time: '09:00', available: true },
        { id: '2-2', time: '09:15', available: true },
        { id: '2-3', time: '09:30', available: false, bookedBy: 'Parent Petit', studentName: 'Léa Petit' },
        { id: '2-4', time: '09:45', available: true },
        { id: '2-5', time: '10:00', available: true },
      ]
    },
    {
      id: '3',
      name: 'M. Bernard',
      subject: 'Sciences',
      email: 'bernard@ecole.fr',
      avatar: 'MB',
      availableSlots: [
        { id: '3-1', time: '10:00', available: true },
        { id: '3-2', time: '10:15', available: true },
        { id: '3-3', time: '10:30', available: true },
        { id: '3-4', time: '10:45', available: false, bookedBy: 'Parent Durand', studentName: 'Hugo Durand' },
      ]
    },
    {
      id: '4',
      name: 'Mme Moreau',
      subject: 'Histoire-Géographie',
      email: 'moreau@ecole.fr',
      avatar: 'MM',
      availableSlots: [
        { id: '4-1', time: '11:00', available: true },
        { id: '4-2', time: '11:15', available: true },
        { id: '4-3', time: '11:30', available: true },
      ]
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      teacherId: '1',
      teacherName: 'M. Dupont',
      subject: 'Mathématiques',
      parentName: 'Martin Sophie',
      studentName: 'Lucas Martin',
      date: '2024-01-20',
      time: '08:15',
      type: 'presential',
      status: 'confirmed',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      teacherId: '2',
      teacherName: 'Mme Lambert',
      subject: 'Français',
      parentName: 'Petit Jean',
      studentName: 'Léa Petit',
      date: '2024-01-20',
      time: '09:30',
      type: 'video',
      status: 'pending',
      notes: 'Difficultés en rédaction',
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      teacherId: '1',
      teacherName: 'M. Dupont',
      subject: 'Mathématiques',
      parentName: 'Bernard Claire',
      studentName: 'Emma Bernard',
      date: '2024-01-20',
      time: '09:00',
      type: 'presential',
      status: 'confirmed',
      createdAt: '2024-01-14'
    },
    {
      id: '4',
      teacherId: '3',
      teacherName: 'M. Bernard',
      subject: 'Sciences',
      parentName: 'Durand Marc',
      studentName: 'Hugo Durand',
      date: '2024-01-21',
      time: '10:45',
      type: 'video',
      status: 'cancelled',
      createdAt: '2024-01-13'
    }
  ]);

  const [sessions] = useState<MeetingSession[]>([
    {
      id: '1',
      title: 'Réunion Parents-Professeurs - 1er Trimestre',
      date: '2024-01-20',
      startTime: '08:00',
      endTime: '12:00',
      slotDuration: 15,
      location: 'Salle polyvalente',
      type: 'hybrid',
      status: 'upcoming',
      totalSlots: 48,
      bookedSlots: 32
    },
    {
      id: '2',
      title: 'Réunion Parents-Professeurs - 2ème Trimestre',
      date: '2024-03-15',
      startTime: '14:00',
      endTime: '18:00',
      slotDuration: 15,
      location: 'Classes respectives',
      type: 'presential',
      status: 'upcoming',
      totalSlots: 64,
      bookedSlots: 0
    }
  ]);

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"><CheckCircle2 className="w-3 h-3 mr-1" />Terminé</Badge>;
    }
  };

  const getTypeBadge = (type: 'presential' | 'video') => {
    return type === 'video' 
      ? <Badge variant="outline" className="border-purple-500 text-purple-600"><Video className="w-3 h-3 mr-1" />Visio</Badge>
      : <Badge variant="outline" className="border-blue-500 text-blue-600"><MapPin className="w-3 h-3 mr-1" />Présentiel</Badge>;
  };

  const handleBookAppointment = () => {
    if (!selectedTeacher || !selectedSlot) {
      toast.error('Veuillez sélectionner un enseignant et un créneau');
      return;
    }

    const teacher = teachers.find(t => t.id === selectedTeacher);
    const slot = teacher?.availableSlots.find(s => s.id === selectedSlot);

    if (!teacher || !slot) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: teacher.subject,
      parentName: 'Parent Connecté',
      studentName: 'Élève Test',
      date: selectedDate?.toISOString().split('T')[0] || '',
      time: slot.time,
      type: appointmentType,
      status: 'pending',
      notes: appointmentNotes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAppointments([...appointments, newAppointment]);
    setIsBookingDialogOpen(false);
    setSelectedTeacher('');
    setSelectedSlot('');
    setAppointmentNotes('');
    toast.success('Rendez-vous demandé avec succès !', {
      description: `${teacher.name} - ${slot.time}`
    });
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
    ));
    toast.success('Rendez-vous confirmé');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    ));
    toast.info('Rendez-vous annulé');
  };

  const sendReminders = () => {
    const pendingCount = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
    toast.success(`${pendingCount} rappels envoyés`, {
      description: 'Les parents ont été notifiés par email et SMS'
    });
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalAppointments: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    participationRate: Math.round((appointments.filter(a => a.status === 'confirmed').length / appointments.length) * 100) || 0
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Réunions Parents-Professeurs</h1>
          <p className="text-muted-foreground">Gérez les rendez-vous et sessions de rencontres</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={sendReminders}>
            <Bell className="w-4 h-4 mr-2" />
            Envoyer rappels
          </Button>
          <Dialog open={isNewSessionDialogOpen} onOpenChange={setIsNewSessionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer une session de réunions</DialogTitle>
                <DialogDescription>Planifiez une nouvelle session de rencontres parents-professeurs</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Titre de la session</Label>
                  <Input placeholder="Ex: Réunion 1er trimestre" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Durée créneau (min)</Label>
                    <Select defaultValue="15">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Heure début</Label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div>
                    <Label>Heure fin</Label>
                    <Input type="time" defaultValue="12:00" />
                  </div>
                </div>
                <div>
                  <Label>Type de réunion</Label>
                  <Select defaultValue="hybrid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presential">Présentiel uniquement</SelectItem>
                      <SelectItem value="video">Visioconférence uniquement</SelectItem>
                      <SelectItem value="hybrid">Hybride (au choix)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lieu</Label>
                  <Input placeholder="Ex: Salle polyvalente" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewSessionDialogOpen(false)}>Annuler</Button>
                <Button onClick={() => {
                  setIsNewSessionDialogOpen(false);
                  toast.success('Session créée avec succès');
                }}>Créer la session</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats.totalAppointments}</div>
            <div className="text-sm text-muted-foreground">Total RDV</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-muted-foreground">Annulés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.participationRate}%</div>
            <div className="text-sm text-muted-foreground">Participation</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="booking" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="booking">Prendre RDV</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Onglet Prise de RDV */}
        <TabsContent value="booking" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Calendrier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Sélectionner une date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Liste des enseignants */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Enseignants disponibles
                </CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Rechercher un enseignant ou une matière..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {filteredTeachers.map(teacher => (
                      <Card key={teacher.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {teacher.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{teacher.name}</h3>
                                  <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {teacher.availableSlots.map(slot => (
                                  <Button
                                    key={slot.id}
                                    variant={slot.available ? (selectedSlot === slot.id ? "default" : "outline") : "ghost"}
                                    size="sm"
                                    disabled={!slot.available}
                                    className={!slot.available ? "opacity-50 cursor-not-allowed line-through" : ""}
                                    onClick={() => {
                                      setSelectedTeacher(teacher.id);
                                      setSelectedSlot(slot.id);
                                      setIsBookingDialogOpen(true);
                                    }}
                                  >
                                    <Clock className="w-3 h-3 mr-1" />
                                    {slot.time}
                                  </Button>
                                ))}
                              </div>
                              {teacher.availableSlots.filter(s => !s.available).length > 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {teacher.availableSlots.filter(s => s.available).length} créneaux disponibles
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Rendez-vous */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rendez-vous à venir</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.filter(a => a.status !== 'completed').map(appointment => (
                  <Card key={appointment.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{appointment.teacherName.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{appointment.teacherName}</h3>
                              <span className="text-muted-foreground">-</span>
                              <span className="text-sm text-muted-foreground">{appointment.subject}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(appointment.date).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                {appointment.studentName}
                              </span>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(appointment.type)}
                          {getStatusBadge(appointment.status)}
                          {appointment.status === 'pending' && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleConfirmAppointment(appointment.id)}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Annuler
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sessions */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {sessions.map(session => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <Badge variant={session.status === 'upcoming' ? 'default' : 'secondary'}>
                      {session.status === 'upcoming' ? 'À venir' : session.status === 'ongoing' ? 'En cours' : 'Terminée'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{session.startTime} - {session.endTime}</span>
                      <span className="text-muted-foreground">({session.slotDuration} min/créneau)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {session.type === 'video' ? <Video className="w-4 h-4 text-muted-foreground" /> : 
                       session.type === 'presential' ? <MapPin className="w-4 h-4 text-muted-foreground" /> :
                       <Users className="w-4 h-4 text-muted-foreground" />}
                      <span>
                        {session.type === 'video' ? 'Visioconférence' : 
                         session.type === 'presential' ? 'Présentiel' : 'Hybride'}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Créneaux réservés</span>
                        <span className="font-semibold">{session.bookedSlots}/{session.totalSlots}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${(session.bookedSlots / session.totalSlots) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des réunions</CardTitle>
              <CardDescription>Consultez l'historique complet des rendez-vous passés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'completed' || a.status === 'cancelled').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun historique disponible</p>
                  </div>
                ) : (
                  appointments.filter(a => a.status === 'completed' || a.status === 'cancelled').map(appointment => (
                    <Card key={appointment.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{appointment.teacherName} - {appointment.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.studentName} • {new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}
                            </p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de réservation */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le rendez-vous</DialogTitle>
            <DialogDescription>
              {teachers.find(t => t.id === selectedTeacher)?.name} - {teachers.find(t => t.id === selectedTeacher)?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{teachers.find(t => t.id === selectedTeacher)?.availableSlots.find(s => s.id === selectedSlot)?.time}</span>
              </div>
            </div>
            <div>
              <Label>Type de rendez-vous</Label>
              <Select value={appointmentType} onValueChange={(v) => setAppointmentType(v as 'presential' | 'video')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presential">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Présentiel
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Visioconférence
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (optionnel)</Label>
              <Textarea 
                placeholder="Sujets à aborder, questions particulières..."
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleBookAppointment}>
              <Send className="w-4 h-4 mr-2" />
              Demander le RDV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReunionsParents;
