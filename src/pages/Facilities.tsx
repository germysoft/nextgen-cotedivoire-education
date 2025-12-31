import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  Building, 
  Plus,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Search,
  Monitor,
  Beaker,
  BookOpen,
  Dumbbell,
  Music,
  Palette,
  ChevronDown,
  Filter,
  Download,
  PlusCircle,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Room {
  id: number;
  name: string;
  type: string;
  building: string;
  floor: number;
  capacity: number;
  status: "Disponible" | "Occupée" | "En maintenance" | "Réservée";
  assignedClass: string;
  equipment: string[];
  area: number;
  lastMaintenance: string;
}

const initialRooms: Room[] = [
  { id: 1, name: "Salle 101", type: "Classe", building: "Bâtiment A", floor: 1, capacity: 40, status: "Occupée", assignedClass: "6ème A", equipment: ["Tableau blanc", "Vidéoprojecteur"], area: 56, lastMaintenance: "15 Nov 2024" },
  { id: 2, name: "Salle 102", type: "Classe", building: "Bâtiment A", floor: 1, capacity: 40, status: "Occupée", assignedClass: "6ème B", equipment: ["Tableau blanc"], area: 56, lastMaintenance: "15 Nov 2024" },
  { id: 3, name: "Salle 103", type: "Classe", building: "Bâtiment A", floor: 1, capacity: 35, status: "Disponible", assignedClass: "-", equipment: ["Tableau blanc", "Vidéoprojecteur", "Climatisation"], area: 50, lastMaintenance: "10 Déc 2024" },
  { id: 4, name: "Salle 201", type: "Classe", building: "Bâtiment A", floor: 2, capacity: 40, status: "Occupée", assignedClass: "5ème A", equipment: ["Tableau blanc"], area: 56, lastMaintenance: "01 Déc 2024" },
  { id: 5, name: "Salle 202", type: "Classe", building: "Bâtiment A", floor: 2, capacity: 40, status: "Réservée", assignedClass: "Examen", equipment: ["Tableau blanc", "Vidéoprojecteur"], area: 56, lastMaintenance: "20 Nov 2024" },
  { id: 6, name: "Labo Physique", type: "Laboratoire", building: "Bâtiment B", floor: 1, capacity: 30, status: "Disponible", assignedClass: "-", equipment: ["Tables de manipulation", "Hottes", "Matériel scientifique"], area: 80, lastMaintenance: "05 Déc 2024" },
  { id: 7, name: "Labo Chimie", type: "Laboratoire", building: "Bâtiment B", floor: 1, capacity: 28, status: "En maintenance", assignedClass: "-", equipment: ["Tables de manipulation", "Hottes", "Équipement chimie"], area: 75, lastMaintenance: "En cours" },
  { id: 8, name: "Labo SVT", type: "Laboratoire", building: "Bâtiment B", floor: 2, capacity: 32, status: "Occupée", assignedClass: "TP 1ère S", equipment: ["Microscopes", "Tables de dissection"], area: 70, lastMaintenance: "01 Déc 2024" },
  { id: 9, name: "Salle Info 1", type: "Informatique", building: "Bâtiment C", floor: 1, capacity: 35, status: "Occupée", assignedClass: "Cours Info", equipment: ["35 PC", "Vidéoprojecteur", "Imprimante"], area: 90, lastMaintenance: "10 Déc 2024" },
  { id: 10, name: "Salle Info 2", type: "Informatique", building: "Bâtiment C", floor: 1, capacity: 30, status: "Disponible", assignedClass: "-", equipment: ["30 PC", "Vidéoprojecteur"], area: 80, lastMaintenance: "08 Déc 2024" },
  { id: 11, name: "CDI", type: "Bibliothèque", building: "Bâtiment A", floor: 0, capacity: 60, status: "Disponible", assignedClass: "-", equipment: ["Rayonnages", "Tables de lecture", "PC recherche"], area: 150, lastMaintenance: "01 Déc 2024" },
  { id: 12, name: "Gymnase", type: "Sport", building: "Annexe", floor: 0, capacity: 200, status: "Occupée", assignedClass: "EPS", equipment: ["Agrès", "Tapis", "Matériel sportif"], area: 800, lastMaintenance: "20 Nov 2024" },
  { id: 13, name: "Salle Musique", type: "Arts", building: "Bâtiment D", floor: 1, capacity: 25, status: "Disponible", assignedClass: "-", equipment: ["Piano", "Instruments", "Sono"], area: 45, lastMaintenance: "15 Nov 2024" },
  { id: 14, name: "Salle Arts", type: "Arts", building: "Bâtiment D", floor: 1, capacity: 25, status: "Occupée", assignedClass: "Arts Plastiques", equipment: ["Chevalets", "Matériel dessin"], area: 60, lastMaintenance: "10 Nov 2024" },
  { id: 15, name: "Amphithéâtre", type: "Amphithéâtre", building: "Bâtiment A", floor: 0, capacity: 250, status: "Disponible", assignedClass: "-", equipment: ["Sono", "Vidéoprojecteur", "Scène"], area: 300, lastMaintenance: "01 Déc 2024" },
  { id: 16, name: "Salle des Profs", type: "Administratif", building: "Bâtiment A", floor: 0, capacity: 50, status: "Occupée", assignedClass: "-", equipment: ["Tables", "Casiers", "PC"], area: 80, lastMaintenance: "05 Déc 2024" },
];

const buildings = [
  { name: "Bâtiment A", floors: 3, rooms: 12, status: "Bon état", yearBuilt: 2005, area: 2500 },
  { name: "Bâtiment B", floors: 2, rooms: 6, status: "Bon état", yearBuilt: 2010, area: 1200 },
  { name: "Bâtiment C", floors: 1, rooms: 4, status: "Travaux prévus", yearBuilt: 2015, area: 800 },
  { name: "Bâtiment D", floors: 2, rooms: 4, status: "Bon état", yearBuilt: 2018, area: 600 },
  { name: "Annexe Sportive", floors: 1, rooms: 2, status: "Bon état", yearBuilt: 2012, area: 1000 },
];

const roomTypes = [
  { type: "Classe", icon: BookOpen, count: 8, color: "bg-blue-500" },
  { type: "Laboratoire", icon: Beaker, count: 3, color: "bg-purple-500" },
  { type: "Informatique", icon: Monitor, count: 2, color: "bg-green-500" },
  { type: "Sport", icon: Dumbbell, count: 1, color: "bg-orange-500" },
  { type: "Arts", icon: Palette, count: 2, color: "bg-pink-500" },
  { type: "Autres", icon: Building, count: 3, color: "bg-gray-500" },
];

export default function Facilities() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBuilding, setFilterBuilding] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.assignedClass.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding;
    return matchesSearch && matchesType && matchesStatus && matchesBuilding;
  });

  const stats = {
    totalRooms: rooms.length,
    totalCapacity: rooms.reduce((acc, room) => acc + room.capacity, 0),
    available: rooms.filter(r => r.status === "Disponible").length,
    occupied: rooms.filter(r => r.status === "Occupée").length,
    maintenance: rooms.filter(r => r.status === "En maintenance").length,
    reserved: rooms.filter(r => r.status === "Réservée").length,
    totalArea: rooms.reduce((acc, room) => acc + room.area, 0),
  };

  const occupancyRate = ((stats.occupied + stats.reserved) / stats.totalRooms * 100).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponible": return "bg-green-500 text-white";
      case "Occupée": return "bg-blue-500 text-white";
      case "En maintenance": return "bg-orange-500 text-white";
      case "Réservée": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Disponible": return <CheckCircle className="h-3 w-3" />;
      case "Occupée": return <Users className="h-3 w-3" />;
      case "En maintenance": return <AlertTriangle className="h-3 w-3" />;
      case "Réservée": return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Classe": return <BookOpen className="h-4 w-4" />;
      case "Laboratoire": return <Beaker className="h-4 w-4" />;
      case "Informatique": return <Monitor className="h-4 w-4" />;
      case "Sport": return <Dumbbell className="h-4 w-4" />;
      case "Arts": return <Palette className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const handleAddRoom = () => {
    toast({
      title: "Salle ajoutée",
      description: "La nouvelle salle a été ajoutée avec succès.",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteRoom = (id: number) => {
    setRooms(rooms.filter(r => r.id !== id));
    toast({
      title: "Salle supprimée",
      description: "La salle a été supprimée avec succès.",
    });
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Salles & Locaux</h1>
          <p className="text-muted-foreground">Inventaire et gestion des infrastructures de l'établissement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une salle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle salle</DialogTitle>
                <DialogDescription>Remplissez les informations de la nouvelle salle</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la salle</Label>
                    <Input id="name" placeholder="Ex: Salle 301" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classe">Classe</SelectItem>
                        <SelectItem value="laboratoire">Laboratoire</SelectItem>
                        <SelectItem value="informatique">Informatique</SelectItem>
                        <SelectItem value="sport">Sport</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                        <SelectItem value="administratif">Administratif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building">Bâtiment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le bâtiment" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildings.map(b => (
                          <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Étage</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'étage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Rez-de-chaussée</SelectItem>
                        <SelectItem value="1">1er étage</SelectItem>
                        <SelectItem value="2">2ème étage</SelectItem>
                        <SelectItem value="3">3ème étage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacité (places)</Label>
                    <Input id="capacity" type="number" placeholder="40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Surface (m²)</Label>
                    <Input id="area" type="number" placeholder="56" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment">Équipements (séparés par des virgules)</Label>
                  <Input id="equipment" placeholder="Tableau blanc, Vidéoprojecteur, Climatisation" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleAddRoom}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salles</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">Capacité: {stats.totalCapacity} places</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Prêtes à utiliser</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupées</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">En cours d'utilisation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <Progress value={parseFloat(occupancyRate)} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surface Totale</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArea.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">mètres carrés</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Toutes les Salles</TabsTrigger>
          <TabsTrigger value="buildings">Bâtiments</TabsTrigger>
          <TabsTrigger value="types">Par Type</TabsTrigger>
          <TabsTrigger value="map">Plan Interactif</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Liste des Salles</CardTitle>
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
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="Classe">Classe</SelectItem>
                      <SelectItem value="Laboratoire">Laboratoire</SelectItem>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="Occupée">Occupée</SelectItem>
                      <SelectItem value="En maintenance">En maintenance</SelectItem>
                      <SelectItem value="Réservée">Réservée</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Bâtiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous bâtiments</SelectItem>
                      {buildings.map(b => (
                        <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Bâtiment / Étage</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Surface</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Affectation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(room.type)}
                          {room.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{room.building}</div>
                          <div className="text-muted-foreground">
                            {room.floor === 0 ? "RDC" : `${room.floor}er étage`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{room.capacity} places</TableCell>
                      <TableCell>{room.area} m²</TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(room.status)}`}>
                          {getStatusIcon(room.status)}
                          {room.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{room.assignedClass}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleViewRoom(room)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteRoom(room.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredRooms.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune salle trouvée avec ces critères
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buildings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {buildings.map((building) => (
              <Card key={building.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{building.name}</CardTitle>
                    <Badge variant={building.status === "Bon état" ? "default" : "secondary"}>
                      {building.status}
                    </Badge>
                  </div>
                  <CardDescription>Construit en {building.yearBuilt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nombre d'étages</span>
                      <span className="font-medium">{building.floors}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nombre de salles</span>
                      <span className="font-medium">{building.rooms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Surface totale</span>
                      <span className="font-medium">{building.area} m²</span>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les salles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <Button variant="ghost" className="flex flex-col gap-2 h-auto py-6">
                  <PlusCircle className="h-8 w-8 text-muted-foreground" />
                  <span>Ajouter un bâtiment</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map((type) => {
              const TypeIcon = type.icon;
              const typeRooms = rooms.filter(r => r.type === type.type || (type.type === "Autres" && !["Classe", "Laboratoire", "Informatique", "Sport", "Arts"].includes(r.type)));
              const availableCount = typeRooms.filter(r => r.status === "Disponible").length;
              return (
                <Card key={type.type}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <TypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.type}</CardTitle>
                        <CardDescription>{typeRooms.length} salles</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Disponibles</span>
                        <Badge variant="secondary">{availableCount}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Capacité totale</span>
                        <span className="font-medium">{typeRooms.reduce((acc, r) => acc + r.capacity, 0)} places</span>
                      </div>
                      <Progress value={(availableCount / typeRooms.length) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        {((availableCount / typeRooms.length) * 100).toFixed(0)}% de disponibilité
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Interactif de l'Établissement</CardTitle>
              <CardDescription>Vue d'ensemble des bâtiments et salles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-muted/30 min-h-[400px]">
                <div className="grid grid-cols-4 gap-4">
                  {buildings.map((building, idx) => (
                    <div key={building.name} className="space-y-2">
                      <div className={`p-4 rounded-lg border-2 ${idx === 0 ? 'border-primary' : 'border-muted'} bg-background`}>
                        <h4 className="font-medium text-center">{building.name}</h4>
                        <div className="mt-2 space-y-1">
                          {Array.from({ length: building.floors }).map((_, floor) => (
                            <div key={floor} className="flex gap-1">
                              {Array.from({ length: Math.ceil(building.rooms / building.floors) }).map((_, roomIdx) => {
                                const roomStatus = ["Disponible", "Occupée", "Occupée", "En maintenance"][Math.floor(Math.random() * 4)];
                                return (
                                  <div
                                    key={roomIdx}
                                    className={`w-8 h-8 rounded text-xs flex items-center justify-center ${
                                      roomStatus === "Disponible" ? "bg-green-100 text-green-700" :
                                      roomStatus === "Occupée" ? "bg-blue-100 text-blue-700" :
                                      "bg-orange-100 text-orange-700"
                                    }`}
                                  >
                                    {floor + 1}{roomIdx + 1}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                    <span className="text-sm text-muted-foreground">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
                    <span className="text-sm text-muted-foreground">Occupée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
                    <span className="text-sm text-muted-foreground">Maintenance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Room Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRoom?.name}</DialogTitle>
            <DialogDescription>Détails de la salle</DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Type</Label>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedRoom.type)}
                    <span className="font-medium">{selectedRoom.type}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Statut</Label>
                  <Badge className={getStatusColor(selectedRoom.status)}>{selectedRoom.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Bâtiment</Label>
                  <p className="font-medium">{selectedRoom.building}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Étage</Label>
                  <p className="font-medium">{selectedRoom.floor === 0 ? "Rez-de-chaussée" : `${selectedRoom.floor}er étage`}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Capacité</Label>
                  <p className="font-medium">{selectedRoom.capacity} places</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Surface</Label>
                  <p className="font-medium">{selectedRoom.area} m²</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Affectation actuelle</Label>
                <p className="font-medium">{selectedRoom.assignedClass || "Non affectée"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Équipements</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.equipment.map((eq, idx) => (
                    <Badge key={idx} variant="outline">{eq}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Dernière maintenance</Label>
                <p className="font-medium">{selectedRoom.lastMaintenance}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
