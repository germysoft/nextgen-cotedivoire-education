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
  Trophy, 
  Music, 
  Users, 
  Calendar,
  Plus,
  Award,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  UserPlus,
  CalendarPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  FileText,
  Printer,
  Target,
  Medal,
  Shirt,
  Timer,
  BookOpen,
  Laptop,
  FlaskConical,
  Globe,
  MessageCircle,
  TreePine,
  ChevronRight,
  Star
} from "lucide-react";
import { 
  mockClubs, 
  mockSportTeams, 
  mockEvents, 
  mockBudgetTransactions,
  getClubStats,
  getSportStats,
  getEventStats,
  getCategoryDistribution,
  getGenderDistribution,
  Club,
  SportTeam,
  Event as ExtEvent
} from "@/data/mockExtracurricular";
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { toast } from "sonner";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--accent))'];

const iconMap: Record<string, React.ReactNode> = {
  'Theater': <Music className="h-5 w-5" />,
  'Laptop': <Laptop className="h-5 w-5" />,
  'BookOpen': <BookOpen className="h-5 w-5" />,
  'MessageCircle': <MessageCircle className="h-5 w-5" />,
  'FlaskConical': <FlaskConical className="h-5 w-5" />,
  'Globe': <Globe className="h-5 w-5" />,
  'Music': <Music className="h-5 w-5" />,
  'TreePine': <TreePine className="h-5 w-5" />,
  'Dribbble': <Trophy className="h-5 w-5" />,
  'CircleDot': <Target className="h-5 w-5" />,
  'Timer': <Timer className="h-5 w-5" />,
  'Target': <Target className="h-5 w-5" />,
  'Circle': <Trophy className="h-5 w-5" />
};

export default function Extracurricular() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<SportTeam | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ExtEvent | null>(null);
  const [showNewClubDialog, setShowNewClubDialog] = useState(false);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const clubStats = getClubStats();
  const sportStats = getSportStats();
  const eventStats = getEventStats();
  const categoryData = getCategoryDistribution();
  const genderData = getGenderDistribution();

  const totalParticipants = clubStats.totalMembers + sportStats.totalPlayers;
  const totalBudget = clubStats.totalBudget + sportStats.totalBudget + eventStats.totalBudget;
  const usedBudget = clubStats.usedBudget + sportStats.usedBudget + eventStats.usedBudget;

  // Monthly participation data
  const monthlyData = [
    { month: 'Sept', clubs: 180, sports: 95, events: 120 },
    { month: 'Oct', clubs: 195, sports: 105, events: 580 },
    { month: 'Nov', clubs: 202, sports: 111, events: 530 },
    { month: 'Déc', clubs: 210, sports: 115, events: 430 }
  ];

  const filteredClubs = mockClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || club.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddMember = (clubId: string) => {
    toast.success("Demande d'inscription envoyée");
  };

  const handleExportData = () => {
    toast.success("Export des données en cours...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activités Parascolaires</h1>
          <p className="text-muted-foreground">Gestion des clubs, sports et événements scolaires</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={showNewClubDialog} onOpenChange={setShowNewClubDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Activité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle activité</DialogTitle>
                <DialogDescription>Remplissez les informations pour créer un nouveau club ou une équipe sportive</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type d'activité</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="club">Club</SelectItem>
                        <SelectItem value="sport">Sport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input placeholder="Nom de l'activité" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Description de l'activité" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Responsable</Label>
                    <Input placeholder="Nom du responsable" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@ecole.ci" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Culture">Culture</SelectItem>
                        <SelectItem value="Technologie">Technologie</SelectItem>
                        <SelectItem value="Sciences">Sciences</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Citoyenneté">Citoyenneté</SelectItem>
                        <SelectItem value="Langues">Langues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Capacité max</Label>
                    <Input type="number" placeholder="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget (FCFA)</Label>
                    <Input type="number" placeholder="500000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Horaire</Label>
                    <Input placeholder="Mercredi 15h-17h" />
                  </div>
                  <div className="space-y-2">
                    <Label>Salle / Lieu</Label>
                    <Input placeholder="Salle Polyvalente" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewClubDialog(false)}>Annuler</Button>
                <Button onClick={() => {
                  toast.success("Activité créée avec succès");
                  setShowNewClubDialog(false);
                }}>Créer l'activité</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              {clubStats.totalMembers} en clubs, {sportStats.totalPlayers} en sports
            </p>
            <Progress value={(totalParticipants / 500) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clubs Actifs</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clubStats.activeClubs}</div>
            <p className="text-xs text-muted-foreground">
              {mockClubs.length} clubs au total
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+2 ce trimestre</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipes Sportives</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSportTeams.length}</div>
            <p className="text-xs text-muted-foreground">
              {sportStats.upcomingCompetitions} compétitions à venir
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
              <Medal className="h-3 w-3" />
              <span>{sportStats.totalCompetitions} participations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {eventStats.upcomingEvents} à venir, {eventStats.completedEvents} terminés
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{eventStats.totalRegistrations} inscriptions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 pt-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Tableau de Bord
                </TabsTrigger>
                <TabsTrigger value="clubs">
                  <Music className="mr-2 h-4 w-4" />
                  Clubs ({mockClubs.length})
                </TabsTrigger>
                <TabsTrigger value="sports">
                  <Trophy className="mr-2 h-4 w-4" />
                  Sports ({mockSportTeams.length})
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="mr-2 h-4 w-4" />
                  Événements ({mockEvents.length})
                </TabsTrigger>
                <TabsTrigger value="inscriptions">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inscriptions
                </TabsTrigger>
                <TabsTrigger value="budget">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Budget
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Participation Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Évolution des Participations</CardTitle>
                    <CardDescription>Nombre de participants par mois et type d'activité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Area type="monotone" dataKey="clubs" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Clubs" />
                        <Area type="monotone" dataKey="sports" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} name="Sports" />
                        <Area type="monotone" dataKey="events" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.6} name="Événements" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Distribution Charts */}
                <div className="grid gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Répartition par Catégorie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={140}>
                        <RechartsPie>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend layout="vertical" align="right" verticalAlign="middle" />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Répartition Garçons/Filles (Sports)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={genderData} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={60} className="text-xs" />
                          <Tooltip />
                          <Bar dataKey="value" radius={4}>
                            {genderData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--chart-4))'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Access Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("clubs")}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Music className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Clubs les plus actifs</h3>
                        <div className="mt-2 space-y-1">
                          {mockClubs.slice(0, 3).map(club => (
                            <div key={club.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{club.name}</span>
                              <Badge variant="secondary">{club.members.length}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("sports")}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-chart-2/10 p-3">
                        <Trophy className="h-6 w-6 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Prochaines compétitions</h3>
                        <div className="mt-2 space-y-1">
                          {mockSportTeams.flatMap(t => t.competitions.filter(c => c.status === 'upcoming')).slice(0, 3).map(comp => (
                            <div key={comp.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{comp.name}</span>
                              <span className="font-mono text-xs">{comp.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("events")}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-chart-3/10 p-3">
                        <Calendar className="h-6 w-6 text-chart-3" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Événements à venir</h3>
                        <div className="mt-2 space-y-1">
                          {mockEvents.filter(e => e.status === 'open').slice(0, 3).map(event => (
                            <div key={event.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{event.name}</span>
                              <span className="font-mono text-xs">{event.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clubs Tab */}
            <TabsContent value="clubs" className="p-6 space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un club..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="Culture">Culture</SelectItem>
                    <SelectItem value="Technologie">Technologie</SelectItem>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Citoyenneté">Citoyenneté</SelectItem>
                    <SelectItem value="Langues">Langues</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
              </div>

              {/* Clubs Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredClubs.map(club => (
                  <Card key={club.id} className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            {iconMap[club.icon] || <Music className="h-5 w-5 text-primary" />}
                          </div>
                          <div>
                            <CardTitle className="text-base">{club.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{club.supervisor}</p>
                          </div>
                        </div>
                        <Badge variant={club.status === 'active' ? 'default' : 'secondary'}>
                          {club.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{club.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{club.members.length}/{club.maxMembers}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{club.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{club.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{club.category}</Badge>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Budget utilisé</span>
                          <span className="font-medium">{Math.round((club.budgetUsed / club.budget) * 100)}%</span>
                        </div>
                        <Progress value={(club.budgetUsed / club.budget) * 100} className="h-1.5" />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1" onClick={() => setSelectedClub(club)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                  {iconMap[club.icon] || <Music className="h-5 w-5 text-primary" />}
                                </div>
                                {club.name}
                              </DialogTitle>
                              <DialogDescription>{club.description}</DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh]">
                              <Tabs defaultValue="info" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="info">Informations</TabsTrigger>
                                  <TabsTrigger value="members">Membres ({club.members.length})</TabsTrigger>
                                  <TabsTrigger value="activities">Activités</TabsTrigger>
                                  <TabsTrigger value="budget">Budget</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="info" className="space-y-4 p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Responsable</Label>
                                      <p className="font-medium">{club.supervisor}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Email</Label>
                                      <p className="font-medium">{club.supervisorEmail}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Horaire</Label>
                                      <p className="font-medium">{club.schedule}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Salle</Label>
                                      <p className="font-medium">{club.room}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Date de création</Label>
                                      <p className="font-medium">{club.createdDate}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Catégorie</Label>
                                      <Badge>{club.category}</Badge>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="members" className="p-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Élève</TableHead>
                                        <TableHead>Classe</TableHead>
                                        <TableHead>Rôle</TableHead>
                                        <TableHead>Assiduité</TableHead>
                                        <TableHead>Inscription</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {club.members.map(member => (
                                        <TableRow key={member.id}>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.photo} />
                                                <AvatarFallback>{member.studentName.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <span className="font-medium">{member.studentName}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell>{member.class}</TableCell>
                                          <TableCell>
                                            <Badge variant={member.role === 'leader' ? 'default' : 'outline'}>
                                              {member.role === 'leader' ? 'Président' : 
                                               member.role === 'secretary' ? 'Secrétaire' :
                                               member.role === 'treasurer' ? 'Trésorier' : 'Membre'}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              <Progress value={member.attendance} className="h-2 w-16" />
                                              <span className="text-sm">{member.attendance}%</span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="font-mono text-sm">{member.joinDate}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TabsContent>

                                <TabsContent value="activities" className="p-4">
                                  <div className="space-y-4">
                                    {club.activities.map(activity => (
                                      <Card key={activity.id}>
                                        <CardContent className="p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <h4 className="font-medium">{activity.title}</h4>
                                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-mono text-sm">{activity.date}</p>
                                              <p className="text-sm text-muted-foreground">{activity.participantsCount} participants</p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="budget" className="p-4 space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground">Budget Total</p>
                                        <p className="text-2xl font-bold">{club.budget.toLocaleString()} F</p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground">Utilisé</p>
                                        <p className="text-2xl font-bold text-primary">{club.budgetUsed.toLocaleString()} F</p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground">Disponible</p>
                                        <p className="text-2xl font-bold text-green-600">{(club.budget - club.budgetUsed).toLocaleString()} F</p>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  <Progress value={(club.budgetUsed / club.budget) * 100} className="h-3" />
                                </TabsContent>
                              </Tabs>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sports Tab */}
            <TabsContent value="sports" className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher une équipe..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Régional">Régional</SelectItem>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="Excellence">Excellence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {mockSportTeams.map(team => (
                  <Card key={team.id} className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-chart-2/10 p-2">
                            {iconMap[team.icon] || <Trophy className="h-5 w-5 text-chart-2" />}
                          </div>
                          <div>
                            <CardTitle className="text-base">{team.sport}</CardTitle>
                            <p className="text-sm text-muted-foreground">{team.coach}</p>
                          </div>
                        </div>
                        <Badge variant={team.level === 'Excellence' || team.level === 'National' ? 'default' : 'secondary'}>
                          {team.level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-lg font-bold">{team.players.filter(p => p.gender === 'M').length}</p>
                          <p className="text-xs text-muted-foreground">Garçons</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-lg font-bold">{team.players.filter(p => p.gender === 'F').length}</p>
                          <p className="text-xs text-muted-foreground">Filles</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-lg font-bold">{team.competitions.length}</p>
                          <p className="text-xs text-muted-foreground">Compétitions</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Entraînements</h4>
                        <div className="space-y-1">
                          {team.trainingSchedule.slice(0, 2).map(session => (
                            <div key={session.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{session.day}</span>
                              <span>{session.startTime} - {session.endTime}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Effectif</span>
                          <span className="font-medium">{team.players.length}/{team.maxPlayers}</span>
                        </div>
                        <Progress value={(team.players.length / team.maxPlayers) * 100} className="h-1.5" />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1" onClick={() => setSelectedTeam(team)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <div className="rounded-lg bg-chart-2/10 p-2">
                                  <Trophy className="h-5 w-5 text-chart-2" />
                                </div>
                                Équipe de {team.sport}
                              </DialogTitle>
                              <DialogDescription>
                                Coach: {team.coach} | Niveau: {team.level}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh]">
                              <Tabs defaultValue="players" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="players">Joueurs ({team.players.length})</TabsTrigger>
                                  <TabsTrigger value="schedule">Entraînements</TabsTrigger>
                                  <TabsTrigger value="competitions">Compétitions</TabsTrigger>
                                  <TabsTrigger value="equipment">Équipement</TabsTrigger>
                                </TabsList>

                                <TabsContent value="players" className="p-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Joueur</TableHead>
                                        <TableHead>Classe</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>N°</TableHead>
                                        <TableHead>Performance</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {team.players.map(player => (
                                        <TableRow key={player.id}>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              <Avatar className="h-8 w-8">
                                                <AvatarImage src={player.photo} />
                                                <AvatarFallback>{player.studentName.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <span className="font-medium">{player.studentName}</span>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                  {player.gender === 'M' ? '♂' : '♀'}
                                                </Badge>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell>{player.class}</TableCell>
                                          <TableCell>{player.position}</TableCell>
                                          <TableCell>
                                            {player.jerseyNumber && (
                                              <Badge variant="secondary">{player.jerseyNumber}</Badge>
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant={
                                              player.performance === 'Excellent' ? 'default' :
                                              player.performance === 'Bon' ? 'secondary' : 'outline'
                                            }>
                                              {player.performance}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TabsContent>

                                <TabsContent value="schedule" className="p-4">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    {team.trainingSchedule.map(session => (
                                      <Card key={session.id}>
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-4">
                                            <div className="rounded-lg bg-primary/10 p-3">
                                              <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                              <h4 className="font-medium">{session.day}</h4>
                                              <p className="text-sm text-muted-foreground">
                                                {session.startTime} - {session.endTime}
                                              </p>
                                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {session.location}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="competitions" className="p-4">
                                  <div className="space-y-4">
                                    {team.competitions.map(comp => (
                                      <Card key={comp.id}>
                                        <CardContent className="p-4">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                              <div className={`rounded-lg p-3 ${
                                                comp.status === 'upcoming' ? 'bg-blue-100' : 
                                                comp.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                                              }`}>
                                                <Trophy className={`h-5 w-5 ${
                                                  comp.status === 'upcoming' ? 'text-blue-600' :
                                                  comp.status === 'completed' ? 'text-green-600' : 'text-red-600'
                                                }`} />
                                              </div>
                                              <div>
                                                <h4 className="font-medium">{comp.name}</h4>
                                                <p className="text-sm text-muted-foreground">vs {comp.opponent}</p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                  <MapPin className="h-3 w-3" />
                                                  {comp.location}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-mono text-sm">{comp.date}</p>
                                              {comp.result && (
                                                <Badge variant={comp.result.includes('Victoire') ? 'default' : 'secondary'}>
                                                  {comp.result}
                                                </Badge>
                                              )}
                                              <Badge variant={
                                                comp.status === 'upcoming' ? 'outline' :
                                                comp.status === 'completed' ? 'secondary' : 'destructive'
                                              } className="mt-1">
                                                {comp.status === 'upcoming' ? 'À venir' :
                                                 comp.status === 'completed' ? 'Terminé' : 'Annulé'}
                                              </Badge>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="equipment" className="p-4">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    {team.equipment.map((item, idx) => (
                                      <Card key={idx}>
                                        <CardContent className="p-4 flex items-center gap-3">
                                          <Shirt className="h-5 w-5 text-muted-foreground" />
                                          <span>{item}</span>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher un événement..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
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
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="open">Inscriptions ouvertes</SelectItem>
                    <SelectItem value="closed">Inscriptions fermées</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Nouvel Événement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Créer un nouvel événement</DialogTitle>
                      <DialogDescription>Planifiez un événement scolaire</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom de l'événement</Label>
                          <Input placeholder="Journée Culturelle" />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
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
                        <Textarea placeholder="Description de l'événement" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Heure début</Label>
                          <Input type="time" />
                        </div>
                        <div className="space-y-2">
                          <Label>Heure fin</Label>
                          <Input type="time" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Lieu</Label>
                          <Input placeholder="Amphithéâtre" />
                        </div>
                        <div className="space-y-2">
                          <Label>Capacité max</Label>
                          <Input type="number" placeholder="200" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Organisateur</Label>
                          <Input placeholder="Club ou Direction" />
                        </div>
                        <div className="space-y-2">
                          <Label>Budget (FCFA)</Label>
                          <Input type="number" placeholder="500000" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>Annuler</Button>
                      <Button onClick={() => {
                        toast.success("Événement créé avec succès");
                        setShowNewEventDialog(false);
                      }}>Créer l'événement</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {mockEvents.map(event => (
                  <Card key={event.id} className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{event.type}</Badge>
                            <span className="font-mono text-xs">{event.date}</span>
                          </CardDescription>
                        </div>
                        <Badge variant={
                          event.status === 'open' ? 'default' :
                          event.status === 'completed' ? 'secondary' :
                          event.status === 'draft' ? 'outline' : 'destructive'
                        }>
                          {event.status === 'open' ? 'Inscriptions ouvertes' :
                           event.status === 'completed' ? 'Terminé' :
                           event.status === 'draft' ? 'Brouillon' :
                           event.status === 'closed' ? 'Fermé' : event.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{event.registrations.length}/{event.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{event.budget.toLocaleString()} F</span>
                        </div>
                      </div>

                      {event.requiresRegistration && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Inscriptions</span>
                            <span className="font-medium">
                              {Math.round((event.registrations.length / event.maxParticipants) * 100)}%
                            </span>
                          </div>
                          <Progress value={(event.registrations.length / event.maxParticipants) * 100} className="h-1.5" />
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1" onClick={() => setSelectedEvent(event)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle>{event.name}</DialogTitle>
                              <DialogDescription>{event.description}</DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh]">
                              <Tabs defaultValue="info" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="info">Informations</TabsTrigger>
                                  <TabsTrigger value="registrations">Inscriptions ({event.registrations.length})</TabsTrigger>
                                  <TabsTrigger value="program">Programme</TabsTrigger>
                                </TabsList>

                                <TabsContent value="info" className="space-y-4 p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Date</Label>
                                      <p className="font-medium">{event.date}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Horaires</Label>
                                      <p className="font-medium">{event.startTime} - {event.endTime}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Lieu</Label>
                                      <p className="font-medium">{event.location}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Organisateur</Label>
                                      <p className="font-medium">{event.organizer}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Public cible</Label>
                                      <div className="flex flex-wrap gap-1">
                                        {event.targetAudience.map((audience, idx) => (
                                          <Badge key={idx} variant="outline">{audience}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-muted-foreground">Budget</Label>
                                      <p className="font-medium">{event.budget.toLocaleString()} FCFA</p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="registrations" className="p-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Élève</TableHead>
                                        <TableHead>Classe</TableHead>
                                        <TableHead>Date inscription</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Présence</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {event.registrations.slice(0, 20).map(reg => (
                                        <TableRow key={reg.id}>
                                          <TableCell className="font-medium">{reg.studentName}</TableCell>
                                          <TableCell>{reg.class}</TableCell>
                                          <TableCell className="font-mono text-sm">{reg.registrationDate}</TableCell>
                                          <TableCell>
                                            <Badge variant={
                                              reg.status === 'confirmed' ? 'default' :
                                              reg.status === 'pending' ? 'secondary' : 'destructive'
                                            }>
                                              {reg.status === 'confirmed' ? 'Confirmé' :
                                               reg.status === 'pending' ? 'En attente' : 'Annulé'}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {event.status === 'completed' && (
                                              reg.attended ? 
                                                <CheckCircle className="h-4 w-4 text-green-600" /> :
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TabsContent>

                                <TabsContent value="program" className="p-4">
                                  {event.program ? (
                                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                                      {event.program}
                                    </pre>
                                  ) : (
                                    <p className="text-muted-foreground text-center py-8">
                                      Aucun programme défini
                                    </p>
                                  )}
                                </TabsContent>
                              </Tabs>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {event.status === 'open' && (
                          <Button size="sm" variant="outline" onClick={() => toast.success("Lien d'inscription copié")}>
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Inscriptions Tab */}
            <TabsContent value="inscriptions" className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher un élève..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Activité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes activités</SelectItem>
                    <SelectItem value="clubs">Clubs</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="events">Événements</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nouvelle Inscription
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Inscriptions */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Inscriptions Récentes</CardTitle>
                    <CardDescription>Dernières demandes d'inscription aux activités</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Élève</TableHead>
                          <TableHead>Activité</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockClubs.slice(0, 3).flatMap(club => 
                          club.members.slice(0, 2).map(member => (
                            <TableRow key={`${club.id}-${member.id}`}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.photo} />
                                    <AvatarFallback>{member.studentName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="font-medium">{member.studentName}</span>
                                    <p className="text-xs text-muted-foreground">{member.class}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{club.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">Club</Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{member.joinDate}</TableCell>
                              <TableCell>
                                <Badge variant="default">Confirmé</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button size="icon" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Pending Approvals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">En Attente d'Approbation</CardTitle>
                    <CardDescription>Demandes à traiter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map(idx => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>E{idx}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">Élève {idx}</p>
                            <p className="text-xs text-muted-foreground">Club Informatique</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => toast.success("Inscription approuvée")}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => toast.error("Inscription refusée")}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Budget Tab */}
            <TabsContent value="budget" className="p-6 space-y-6">
              {/* Budget Summary */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget Total</p>
                        <p className="text-xl font-bold">{totalBudget.toLocaleString()} F</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-chart-2/10 p-3">
                        <TrendingUp className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Utilisé</p>
                        <p className="text-xl font-bold">{usedBudget.toLocaleString()} F</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-green-100 p-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Disponible</p>
                        <p className="text-xl font-bold text-green-600">{(totalBudget - usedBudget).toLocaleString()} F</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-chart-4/10 p-3">
                        <PieChart className="h-5 w-5 text-chart-4" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Consommation</p>
                        <p className="text-xl font-bold">{Math.round((usedBudget / totalBudget) * 100)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Budget by Category */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition par Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={[
                        { name: 'Clubs', budget: clubStats.totalBudget, used: clubStats.usedBudget },
                        { name: 'Sports', budget: sportStats.totalBudget, used: sportStats.usedBudget },
                        { name: 'Événements', budget: eventStats.totalBudget, used: eventStats.usedBudget }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(v) => `${Number(v).toLocaleString()} F`} />
                        <Legend />
                        <Bar dataKey="budget" name="Budget" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="used" name="Utilisé" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Transactions Récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-3">
                        {mockBudgetTransactions.map(transaction => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-lg p-2 ${
                                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                {transaction.type === 'income' ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <DollarSign className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">{transaction.activityName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} F
                              </p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Budget Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Détail des Budgets</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activité</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Utilisé</TableHead>
                        <TableHead className="text-right">Disponible</TableHead>
                        <TableHead>Consommation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...mockClubs.map(c => ({ name: c.name, type: 'Club', budget: c.budget, used: c.budgetUsed })),
                        ...mockSportTeams.map(s => ({ name: s.sport, type: 'Sport', budget: s.budget, used: s.budgetUsed })),
                        ...mockEvents.map(e => ({ name: e.name, type: 'Événement', budget: e.budget, used: e.budgetUsed }))
                      ].map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{item.budget.toLocaleString()} F</TableCell>
                          <TableCell className="text-right font-mono">{item.used.toLocaleString()} F</TableCell>
                          <TableCell className="text-right font-mono text-green-600">
                            {(item.budget - item.used).toLocaleString()} F
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={(item.used / item.budget) * 100} className="h-2 w-20" />
                              <span className="text-sm">{Math.round((item.used / item.budget) * 100)}%</span>
                            </div>
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
