import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, MapPin, Users, DoorOpen, Calendar, Clock, Plus,
  CheckCircle, XCircle, AlertTriangle, Search, Filter, Edit
} from "lucide-react";
import { toast } from "sonner";

interface Salle {
  id: string;
  nom: string;
  type: "classe" | "labo" | "conference" | "informatique" | "sport" | "autre";
  batiment: string;
  capacite: number;
  equipements: string[];
  disponible: boolean;
}

interface Reservation {
  id: string;
  salle: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  reservePar: string;
  motif: string;
  statut: "confirmee" | "en_attente" | "annulee";
}

const PlanningInfrastructures = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedBatiment, setSelectedBatiment] = useState("all");

  const [salles] = useState<Salle[]>([
    { id: "1", nom: "Salle 101", type: "classe", batiment: "Bâtiment A", capacite: 35, equipements: ["Tableau blanc", "Vidéoprojecteur"], disponible: true },
    { id: "2", nom: "Salle 102", type: "classe", batiment: "Bâtiment A", capacite: 35, equipements: ["Tableau blanc"], disponible: true },
    { id: "3", nom: "Laboratoire Physique", type: "labo", batiment: "Bâtiment B", capacite: 24, equipements: ["Paillasses", "Équipements labo"], disponible: false },
    { id: "4", nom: "Salle Informatique 1", type: "informatique", batiment: "Bâtiment A", capacite: 30, equipements: ["30 PC", "Vidéoprojecteur", "Imprimante"], disponible: true },
    { id: "5", nom: "Salle de Conférence", type: "conference", batiment: "Administration", capacite: 100, equipements: ["Vidéoprojecteur", "Sono", "Micros"], disponible: true },
    { id: "6", nom: "Gymnase", type: "sport", batiment: "Complexe sportif", capacite: 200, equipements: ["Équipements sportifs"], disponible: true },
  ]);

  const [reservations] = useState<Reservation[]>([
    { id: "1", salle: "Salle 101", date: "2024-01-15", heureDebut: "08:00", heureFin: "10:00", reservePar: "M. Kouadio", motif: "Cours de maths 3ème A", statut: "confirmee" },
    { id: "2", salle: "Salle 101", date: "2024-01-15", heureDebut: "10:00", heureFin: "12:00", reservePar: "Mme Bamba", motif: "Cours français 4ème B", statut: "confirmee" },
    { id: "3", salle: "Salle de Conférence", date: "2024-01-15", heureDebut: "14:00", heureFin: "17:00", reservePar: "Direction", motif: "Conseil de classe", statut: "confirmee" },
    { id: "4", salle: "Salle Informatique 1", date: "2024-01-16", heureDebut: "09:00", heureFin: "11:00", reservePar: "M. Diabaté", motif: "Formation Excel", statut: "en_attente" },
    { id: "5", salle: "Gymnase", date: "2024-01-17", heureDebut: "08:00", heureFin: "12:00", reservePar: "M. Koné", motif: "Compétition inter-classes", statut: "confirmee" },
  ]);

  const stats = {
    totalSalles: salles.length,
    disponibles: salles.filter(s => s.disponible).length,
    reservationsJour: reservations.filter(r => r.date === selectedDate).length,
    tauxOccupation: 68,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "classe": return "bg-blue-500";
      case "labo": return "bg-green-500";
      case "conference": return "bg-purple-500";
      case "informatique": return "bg-amber-500";
      case "sport": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "classe": return "Salle de classe";
      case "labo": return "Laboratoire";
      case "conference": return "Conférence";
      case "informatique": return "Informatique";
      case "sport": return "Sport";
      default: return "Autre";
    }
  };

  const filteredSalles = salles.filter(s => 
    selectedBatiment === "all" || s.batiment === selectedBatiment
  );

  const batiments = [...new Set(salles.map(s => s.batiment))];

  const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planning des Infrastructures</h1>
          <p className="text-muted-foreground">Gestion des salles et réservations</p>
        </div>
        <Button onClick={() => toast.success("Formulaire de réservation ouvert")}>
          <Plus className="h-4 w-4 mr-2" />Réserver une salle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total salles</p>
              <p className="text-2xl font-bold">{stats.totalSalles}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DoorOpen className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponibles</p>
              <p className="text-2xl font-bold">{stats.disponibles}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Réservations du jour</p>
              <p className="text-2xl font-bold">{stats.reservationsJour}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taux d'occupation</p>
              <p className="text-2xl font-bold">{stats.tauxOccupation}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="salles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="salles">Salles</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
        </TabsList>

        <TabsContent value="salles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Salles</CardTitle>
                <Select value={selectedBatiment} onValueChange={setSelectedBatiment}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les bâtiments</SelectItem>
                    {batiments.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSalles.map((salle) => (
                  <Card key={salle.id} className={!salle.disponible ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getTypeColor(salle.type)}`} />
                          <h3 className="font-medium">{salle.nom}</h3>
                        </div>
                        <Badge variant={salle.disponible ? "default" : "secondary"}>
                          {salle.disponible ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                          {salle.disponible ? "Libre" : "Occupée"}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{salle.batiment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{salle.capacite} places</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {salle.equipements.map((e, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{e}</Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => toast.success("Réservation initiée")}>
                        Réserver
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Planning du jour</CardTitle>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-3 py-1"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted text-left">Salle</th>
                      {heures.map(h => (
                        <th key={h} className="border p-2 bg-muted text-center text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salles.slice(0, 5).map(salle => (
                      <tr key={salle.id}>
                        <td className="border p-2 font-medium">{salle.nom}</td>
                        {heures.map(h => {
                          const reservation = reservations.find(
                            r => r.salle === salle.nom && r.date === selectedDate && r.heureDebut <= h && r.heureFin > h
                          );
                          return (
                            <td key={h} className={`border p-1 text-center text-xs ${reservation ? "bg-primary/20" : ""}`}>
                              {reservation && reservation.heureDebut === h && (
                                <span className="text-primary font-medium">{reservation.motif.substring(0, 15)}...</span>
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
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salle</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Horaires</TableHead>
                    <TableHead>Réservé par</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.salle}</TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.heureDebut} - {reservation.heureFin}</TableCell>
                      <TableCell>{reservation.reservePar}</TableCell>
                      <TableCell>{reservation.motif}</TableCell>
                      <TableCell>
                        <Badge variant={
                          reservation.statut === "confirmee" ? "default" :
                          reservation.statut === "en_attente" ? "secondary" : "destructive"
                        }>
                          {reservation.statut === "confirmee" ? <CheckCircle className="h-3 w-3 mr-1" /> :
                           reservation.statut === "en_attente" ? <Clock className="h-3 w-3 mr-1" /> :
                           <XCircle className="h-3 w-3 mr-1" />}
                          {reservation.statut.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanningInfrastructures;
