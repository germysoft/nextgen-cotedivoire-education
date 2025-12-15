import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  Users,
  Search,
  Download,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Printer,
  Mail,
  Phone,
  Send,
  BarChart3,
  TrendingUp,
  Award,
  PartyPopper,
  Megaphone,
  GraduationCap,
  Trophy,
  Music,
  Camera,
  Image,
  DollarSign,
  UserPlus,
  ClipboardList
} from "lucide-react";
import { mockEvents, Event as ExtEvent, EventRegistration } from "@/data/mockExtracurricular";
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const eventTypeIcons: Record<string, React.ReactNode> = {
  'Culture': <Music className="h-5 w-5" />,
  'Sport': <Trophy className="h-5 w-5" />,
  'Académique': <GraduationCap className="h-5 w-5" />,
  'Social': <PartyPopper className="h-5 w-5" />,
  'Cérémonie': <Award className="h-5 w-5" />
};

const statusColors: Record<string, string> = {
  'draft': 'secondary',
  'open': 'default',
  'closed': 'outline',
  'ongoing': 'default',
  'completed': 'secondary',
  'cancelled': 'destructive'
};

const statusLabels: Record<string, string> = {
  'draft': 'Brouillon',
  'open': 'Ouvert',
  'closed': 'Fermé',
  'ongoing': 'En cours',
  'completed': 'Terminé',
  'cancelled': 'Annulé'
};

// Generate calendar data
const generateCalendarData = () => {
  const days = [];
  const currentDate = new Date(2024, 11, 1); // December 2024
  
  for (let i = 0; i < 31; i++) {
    const date = new Date(currentDate);
    date.setDate(i + 1);
    const dayEvents = mockEvents.filter(e => e.date === date.toISOString().split('T')[0]);
    days.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.getDay(),
      dayNumber: i + 1,
      events: dayEvents
    });
  }
  
  return days;
};

const calendarData = generateCalendarData();

// Statistics
const eventStats = {
  total: mockEvents.length,
  upcoming: mockEvents.filter(e => e.status === 'open').length,
  ongoing: mockEvents.filter(e => e.status === 'ongoing').length,
  completed: mockEvents.filter(e => e.status === 'completed').length,
  totalRegistrations: mockEvents.reduce((sum, e) => sum + e.registrations.length, 0),
  totalBudget: mockEvents.reduce((sum, e) => sum + e.budget, 0),
  usedBudget: mockEvents.reduce((sum, e) => sum + e.budgetUsed, 0)
};

const eventsByType = [
  { name: 'Culture', value: mockEvents.filter(e => e.type === 'Culture').length },
  { name: 'Sport', value: mockEvents.filter(e => e.type === 'Sport').length },
  { name: 'Académique', value: mockEvents.filter(e => e.type === 'Académique').length },
  { name: 'Social', value: mockEvents.filter(e => e.type === 'Social').length },
  { name: 'Cérémonie', value: mockEvents.filter(e => e.type === 'Cérémonie').length }
];

const monthlyEventData = [
  { month: 'Sept', events: 3, participants: 450 },
  { month: 'Oct', events: 4, participants: 680 },
  { month: 'Nov', events: 5, participants: 820 },
  { month: 'Déc', events: 6, participants: 950 }
];

export default function Evenements() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<ExtEvent | null>(null);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(11); // December

  // Filter events
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateEvent = () => {
    toast.success("Événement créé avec succès");
    setShowNewEventDialog(false);
  };

  const handleExportData = () => {
    toast.success("Export des événements en cours...");
  };

  const handleSendInvitations = (eventId: string) => {
    toast.success("Invitations envoyées avec succès");
  };

  const handleRegisterStudent = () => {
    toast.success("Inscription enregistrée avec succès");
    setShowRegistrationDialog(false);
  };

  const handleCancelEvent = (eventId: string) => {
    toast.success("Événement annulé");
  };

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Événements</h1>
          <p className="text-muted-foreground">Planification et suivi des événements scolaires</p>
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
          <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
            <DialogTrigger asChild>
              <Button>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Nouvel Événement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Créer un nouvel événement</DialogTitle>
                <DialogDescription>Remplissez les informations de l'événement</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="grid gap-4 py-4 pr-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de l'événement *</Label>
                      <Input placeholder="Ex: Journée Portes Ouvertes" />
                    </div>
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Culture">Culture</SelectItem>
                          <SelectItem value="Sport">Sport</SelectItem>
                          <SelectItem value="Académique">Académique</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Cérémonie">Cérémonie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Description de l'événement..." rows={3} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Heure de début *</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>Heure de fin *</Label>
                      <Input type="time" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Lieu *</Label>
                      <Input placeholder="Ex: Cour principale" />
                    </div>
                    <div className="space-y-2">
                      <Label>Organisateur *</Label>
                      <Input placeholder="Ex: Club Théâtre" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Capacité maximale</Label>
                      <Input type="number" placeholder="500" />
                    </div>
                    <div className="space-y-2">
                      <Label>Budget alloué (FCFA)</Label>
                      <Input type="number" placeholder="1000000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Public cible</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Tous les élèves', 'Parents', 'Enseignants', '6ème', '5ème', '4ème', '3ème'].map(target => (
                        <Badge 
                          key={target} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        >
                          {target}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Programme (optionnel)</Label>
                    <Textarea 
                      placeholder="08h00: Ouverture&#10;09h00: Activité 1&#10;12h00: Pause déjeuner&#10;..." 
                      rows={4} 
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="requiresReg" className="rounded" />
                    <Label htmlFor="requiresReg">Inscription obligatoire</Label>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>Annuler</Button>
                <Button onClick={handleCreateEvent}>Créer l'événement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {eventStats.upcoming} à venir, {eventStats.completed} terminés
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.totalRegistrations}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+15% vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(eventStats.totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA alloués</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilisé</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((eventStats.usedBudget / eventStats.totalBudget) * 100)}%</div>
            <Progress value={(eventStats.usedBudget / eventStats.totalBudget) * 100} className="mt-2 h-1" />
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
                <TabsTrigger value="list">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendrier
                </TabsTrigger>
                <TabsTrigger value="registrations">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inscriptions
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <FileText className="mr-2 h-4 w-4" />
                  Rapports
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Événements par Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie>
                        <Pie
                          data={eventsByType}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          label
                        >
                          {eventsByType.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Évolution Mensuelle</CardTitle>
                    <CardDescription>Nombre d'événements et participants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyEventData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis yAxisId="left" className="text-xs" />
                        <YAxis yAxisId="right" orientation="right" className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="events" fill="hsl(var(--primary))" name="Événements" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="participants" stroke="hsl(var(--chart-2))" name="Participants" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prochains Événements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.filter(e => e.status === 'open').slice(0, 4).map(event => (
                      <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`rounded-lg p-3 bg-primary/10`}>
                          {eventTypeIcons[event.type] || <Calendar className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.name}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.startTime} - {event.endTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge>{event.type}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.registrations.filter(r => r.status === 'confirmed').length}/{event.maxParticipants} inscrits
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* List Tab */}
            <TabsContent value="list" className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un événement..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="Culture">Culture</SelectItem>
                    <SelectItem value="Sport">Sport</SelectItem>
                    <SelectItem value="Académique">Académique</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Cérémonie">Cérémonie</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="open">Ouvert</SelectItem>
                    <SelectItem value="ongoing">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Événement</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Organisateur</TableHead>
                      <TableHead className="text-center">Inscriptions</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map(event => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="rounded bg-primary/10 p-1.5">
                              {eventTypeIcons[event.type] || <Calendar className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="font-medium">{event.name}</p>
                              <p className="text-xs text-muted-foreground">{event.startTime} - {event.endTime}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.type}</Badge>
                        </TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.organizer}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-medium">{event.registrations.filter(r => r.status === 'confirmed').length}</span>
                            <span className="text-muted-foreground">/ {event.maxParticipants}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[event.status] as any}>
                            {statusLabels[event.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedEvent(event)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh]">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                      {eventTypeIcons[event.type]}
                                    </div>
                                    {event.name}
                                  </DialogTitle>
                                  <DialogDescription>{event.description}</DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh]">
                                  <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                      <TabsTrigger value="details">Détails</TabsTrigger>
                                      <TabsTrigger value="registrations">Inscriptions</TabsTrigger>
                                      <TabsTrigger value="program">Programme</TabsTrigger>
                                      <TabsTrigger value="budget">Budget</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="details" className="space-y-4 p-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <Label className="text-muted-foreground">Date</Label>
                                          <p className="font-medium">{event.date}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-muted-foreground">Horaires</Label>
                                          <p className="font-medium">{event.startTime} - {event.endTime}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-muted-foreground">Lieu</Label>
                                          <p className="font-medium">{event.location}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-muted-foreground">Organisateur</Label>
                                          <p className="font-medium">{event.organizer}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-muted-foreground">Type</Label>
                                          <Badge>{event.type}</Badge>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-muted-foreground">Statut</Label>
                                          <Badge variant={statusColors[event.status] as any}>
                                            {statusLabels[event.status]}
                                          </Badge>
                                        </div>
                                      </div>
                                      <Separator />
                                      <div className="space-y-1">
                                        <Label className="text-muted-foreground">Public cible</Label>
                                        <div className="flex flex-wrap gap-2">
                                          {event.targetAudience.map(target => (
                                            <Badge key={target} variant="outline">{target}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="registrations" className="p-4">
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-medium">{event.registrations.filter(r => r.status === 'confirmed').length} confirmées</p>
                                            <p className="text-sm text-muted-foreground">sur {event.maxParticipants} places</p>
                                          </div>
                                          <Button size="sm" onClick={() => handleSendInvitations(event.id)}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Envoyer invitations
                                          </Button>
                                        </div>
                                        <Progress value={(event.registrations.filter(r => r.status === 'confirmed').length / event.maxParticipants) * 100} />
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Élève</TableHead>
                                              <TableHead>Classe</TableHead>
                                              <TableHead>Date inscription</TableHead>
                                              <TableHead>Statut</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {event.registrations.slice(0, 10).map(reg => (
                                              <TableRow key={reg.id}>
                                                <TableCell className="font-medium">{reg.studentName}</TableCell>
                                                <TableCell>{reg.class}</TableCell>
                                                <TableCell>{reg.registrationDate}</TableCell>
                                                <TableCell>
                                                  <Badge variant={reg.status === 'confirmed' ? 'default' : reg.status === 'pending' ? 'secondary' : 'destructive'}>
                                                    {reg.status === 'confirmed' ? 'Confirmé' : reg.status === 'pending' ? 'En attente' : 'Annulé'}
                                                  </Badge>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="program" className="p-4">
                                      {event.program ? (
                                        <div className="whitespace-pre-line text-sm border rounded-lg p-4 bg-muted/50">
                                          {event.program}
                                        </div>
                                      ) : (
                                        <p className="text-muted-foreground">Aucun programme défini</p>
                                      )}
                                    </TabsContent>

                                    <TabsContent value="budget" className="space-y-4 p-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                          <CardContent className="pt-4">
                                            <p className="text-sm text-muted-foreground">Budget alloué</p>
                                            <p className="text-2xl font-bold">{event.budget.toLocaleString()} FCFA</p>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="pt-4">
                                            <p className="text-sm text-muted-foreground">Budget utilisé</p>
                                            <p className="text-2xl font-bold">{event.budgetUsed.toLocaleString()} FCFA</p>
                                          </CardContent>
                                        </Card>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>Utilisation</span>
                                          <span className="font-medium">{Math.round((event.budgetUsed / event.budget) * 100)}%</span>
                                        </div>
                                        <Progress value={(event.budgetUsed / event.budget) * 100} />
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleCancelEvent(event.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="p-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Décembre 2024</CardTitle>
                    <CardDescription>Vue calendrier des événements</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Mois précédent</Button>
                    <Button variant="outline" size="sm">Mois suivant</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Week day headers */}
                    {weekDays.map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    
                    {/* Empty cells for offset */}
                    {Array.from({ length: calendarData[0]?.dayOfWeek || 0 }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2 min-h-[100px]" />
                    ))}
                    
                    {/* Calendar days */}
                    {calendarData.map(day => (
                      <div 
                        key={day.date} 
                        className={`p-2 min-h-[100px] border rounded-lg hover:bg-muted/50 transition-colors ${
                          day.events.length > 0 ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="font-medium text-sm mb-1">{day.dayNumber}</div>
                        <div className="space-y-1">
                          {day.events.slice(0, 2).map(event => (
                            <div 
                              key={event.id}
                              className="text-xs p-1 rounded bg-primary/10 text-primary truncate cursor-pointer hover:bg-primary/20"
                              title={event.name}
                            >
                              {event.name}
                            </div>
                          ))}
                          {day.events.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{day.events.length - 2} autres
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Registrations Tab */}
            <TabsContent value="registrations" className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Gestion des Inscriptions</h3>
                  <p className="text-sm text-muted-foreground">Inscrivez des élèves aux événements</p>
                </div>
                <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Nouvelle Inscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Inscrire un élève</DialogTitle>
                      <DialogDescription>Sélectionnez l'événement et l'élève</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Événement</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un événement" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockEvents.filter(e => e.status === 'open').map(event => (
                              <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Classe</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Filtrer par classe" />
                          </SelectTrigger>
                          <SelectContent>
                            {['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'].map(cls => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Élève</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un élève" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stu1">Koné Amadou - 6ème A</SelectItem>
                            <SelectItem value="stu2">Touré Fatoumata - 5ème B</SelectItem>
                            <SelectItem value="stu3">Diallo Ibrahim - 4ème A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowRegistrationDialog(false)}>Annuler</Button>
                      <Button onClick={handleRegisterStudent}>Inscrire</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockEvents.filter(e => e.status === 'open').map(event => (
                  <Card key={event.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-primary/10 p-2">
                            {eventTypeIcons[event.type]}
                          </div>
                          <div>
                            <CardTitle className="text-base">{event.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <Badge>{event.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Inscriptions</span>
                          <span className="font-medium">
                            {event.registrations.filter(r => r.status === 'confirmed').length}/{event.maxParticipants}
                          </span>
                        </div>
                        <Progress value={(event.registrations.filter(r => r.status === 'confirmed').length / event.maxParticipants) * 100} className="h-2" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" variant="outline">
                          <Eye className="mr-1 h-3 w-3" />
                          Voir liste
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => setShowRegistrationDialog(true)}>
                          <UserPlus className="mr-1 h-3 w-3" />
                          Inscrire
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Rapport Global</h4>
                        <p className="text-sm text-muted-foreground">Synthèse de tous les événements</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline" onClick={handleExportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Générer PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-chart-2/10 p-3">
                        <Users className="h-6 w-6 text-chart-2" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Rapport Participation</h4>
                        <p className="text-sm text-muted-foreground">Détail des inscriptions</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline" onClick={() => toast.success("Rapport généré")}>
                      <Download className="mr-2 h-4 w-4" />
                      Générer PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-chart-3/10 p-3">
                        <DollarSign className="h-6 w-6 text-chart-3" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Bilan Budgétaire</h4>
                        <p className="text-sm text-muted-foreground">Finances des événements</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline" onClick={() => toast.success("Bilan généré")}>
                      <Download className="mr-2 h-4 w-4" />
                      Générer PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Événements Récents</CardTitle>
                  <CardDescription>Résumé des derniers événements terminés</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Événement</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Participants</TableHead>
                        <TableHead className="text-center">Taux Présence</TableHead>
                        <TableHead className="text-right">Budget Utilisé</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockEvents.filter(e => e.status === 'completed').map(event => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.name}</TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell className="text-center">
                            {event.registrations.filter(r => r.attended).length}/{event.registrations.length}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="default">
                              {Math.round((event.registrations.filter(r => r.attended).length / event.registrations.length) * 100)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {event.budgetUsed.toLocaleString()} FCFA
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
