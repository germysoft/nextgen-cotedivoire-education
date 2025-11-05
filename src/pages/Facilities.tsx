import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Bus, 
  Utensils, 
  Home, 
  Plus,
  MapPin,
  Users,
  DollarSign
} from "lucide-react";

const mockClassrooms = [
  { id: 1, name: "Salle 101", type: "Classe", capacity: 40, status: "Occupée", class: "6èmeA" },
  { id: 2, name: "Salle 102", type: "Classe", capacity: 40, status: "Occupée", class: "6èmeB" },
  { id: 3, name: "Labo Sciences", type: "Laboratoire", capacity: 30, status: "Disponible", class: "-" },
  { id: 4, name: "Salle Info", type: "Informatique", capacity: 35, status: "Occupée", class: "1èreC" },
];

const mockTransportRoutes = [
  { id: 1, name: "Route Yopougon", bus: "Bus 01", capacity: 50, students: 42, driver: "Koné Yao" },
  { id: 2, name: "Route Cocody", bus: "Bus 02", capacity: 50, students: 38, driver: "Traoré Issa" },
  { id: 3, name: "Route Abobo", bus: "Bus 03", capacity: 45, students: 40, driver: "Bamba Koffi" },
];

const mockDormitory = [
  { id: 1, room: "Dortoir A1", capacity: 4, occupied: 4, gender: "Garçons" },
  { id: 2, room: "Dortoir A2", capacity: 4, occupied: 3, gender: "Garçons" },
  { id: 3, room: "Dortoir B1", capacity: 4, occupied: 4, gender: "Filles" },
  { id: 4, room: "Dortoir B2", capacity: 4, occupied: 2, gender: "Filles" },
];

export default function Facilities() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Infrastructures</h1>
          <p className="text-muted-foreground">Cantine, Transport, Internat & Locaux</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salles de Classe</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Capacité totale: 1,120</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transport</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">Élèves transportés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cantine</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">Repas/jour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internat</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13/16</div>
            <p className="text-xs text-muted-foreground">Lits occupés</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Infrastructures</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classrooms">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="classrooms">Salles</TabsTrigger>
              <TabsTrigger value="canteen">Cantine</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="dormitory">Internat</TabsTrigger>
            </TabsList>

            <TabsContent value="classrooms" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Classe Affectée</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClassrooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{room.capacity} places</TableCell>
                      <TableCell>
                        <Badge variant={room.status === "Occupée" ? "default" : "secondary"}>
                          {room.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{room.class}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Modifier</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="canteen" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Menu du Jour</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Entrée:</span>
                      <span className="text-sm font-medium">Salade verte</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plat:</span>
                      <span className="text-sm font-medium">Riz au poulet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dessert:</span>
                      <span className="text-sm font-medium">Fruit</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Statistiques Cantine</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Inscrits:</span>
                      <span className="text-sm font-medium">450 élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Présents aujourd'hui:</span>
                      <span className="text-sm font-medium">432 élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coût mensuel:</span>
                      <span className="text-sm font-medium">30,000 FCFA/élève</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transport" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Itinéraire</TableHead>
                    <TableHead>Bus</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Élèves</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransportRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {route.name}
                        </div>
                      </TableCell>
                      <TableCell>{route.bus}</TableCell>
                      <TableCell>{route.driver}</TableCell>
                      <TableCell>{route.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{route.students}/{route.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Voir</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="dormitory" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dortoir</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Occupés</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDormitory.map((dorm) => (
                    <TableRow key={dorm.id}>
                      <TableCell className="font-medium">{dorm.room}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{dorm.gender}</Badge>
                      </TableCell>
                      <TableCell>{dorm.capacity} lits</TableCell>
                      <TableCell>{dorm.occupied}</TableCell>
                      <TableCell>
                        <Badge variant={dorm.capacity - dorm.occupied > 0 ? "default" : "secondary"}>
                          {dorm.capacity - dorm.occupied}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Gérer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
