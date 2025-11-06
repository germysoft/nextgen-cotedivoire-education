import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Music, 
  Users, 
  Calendar,
  Plus,
  TrendingUp,
  Award
} from "lucide-react";

const mockClubs = [
  { id: 1, name: "Club Théâtre", supervisor: "Mme Diallo", members: 25, category: "Culture", schedule: "Mercredi 15h-17h" },
  { id: 2, name: "Club Informatique", supervisor: "M. Kouassi", members: 30, category: "Technologie", schedule: "Jeudi 16h-18h" },
  { id: 3, name: "Club Lecture", supervisor: "Mme Traoré", members: 18, category: "Culture", schedule: "Vendredi 15h-16h" },
  { id: 4, name: "Club Débat", supervisor: "M. Bamba", members: 22, category: "Citoyenneté", schedule: "Mardi 16h-18h" },
];

const mockSports = [
  { id: 1, sport: "Football", coach: "M. Koné", boys: 28, girls: 0, level: "Excellence", competitions: 5 },
  { id: 2, sport: "Basketball", coach: "Mme Touré", boys: 15, girls: 12, level: "Régional", competitions: 3 },
  { id: 3, sport: "Athlétisme", coach: "M. Yao", boys: 10, girls: 8, level: "National", competitions: 4 },
  { id: 4, sport: "Handball", coach: "M. Soro", boys: 12, girls: 10, level: "Régional", competitions: 2 },
];

const mockEvents = [
  { id: 1, name: "Journée Culturelle", date: "2024-11-15", participants: 450, status: "À venir", type: "Culture" },
  { id: 2, name: "Compétition Inter-Écoles", date: "2024-11-20", participants: 80, status: "À venir", type: "Sport" },
  { id: 3, name: "Fête de la Science", date: "2024-10-28", participants: 380, status: "Terminé", type: "Académique" },
  { id: 4, name: "Tournoi de Football", date: "2024-10-15", participants: 120, status: "Terminé", type: "Sport" },
];

export default function Extracurricular() {
  const totalMembers = mockClubs.reduce((acc, club) => acc + club.members, 0);
  const totalAthletes = mockSports.reduce((acc, sport) => acc + sport.boys + sport.girls, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activités Parascolaires</h1>
          <p className="text-muted-foreground">Clubs, sports et événements</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Activité
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clubs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClubs.length}</div>
            <p className="text-xs text-muted-foreground">{totalMembers} membres</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disciplines Sportives</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSports.length}</div>
            <p className="text-xs text-muted-foreground">{totalAthletes} athlètes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compétitions</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSports.reduce((acc, s) => acc + s.competitions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Participations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion Parascolaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clubs">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clubs">Clubs</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
            </TabsList>

            <TabsContent value="clubs" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Club</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Membres</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClubs.map((club) => (
                    <TableRow key={club.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-muted-foreground" />
                          {club.name}
                        </div>
                      </TableCell>
                      <TableCell>{club.supervisor}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{club.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{club.members}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {club.schedule}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Voir</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sports" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sport</TableHead>
                    <TableHead>Entraîneur</TableHead>
                    <TableHead>Garçons</TableHead>
                    <TableHead>Filles</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Compétitions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSports.map((sport) => (
                    <TableRow key={sport.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          {sport.sport}
                        </div>
                      </TableCell>
                      <TableCell>{sport.coach}</TableCell>
                      <TableCell>{sport.boys}</TableCell>
                      <TableCell>{sport.girls}</TableCell>
                      <TableCell>
                        <Badge variant={sport.level === "National" ? "default" : "secondary"}>
                          {sport.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{sport.competitions}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Gérer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Événement</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{event.participants}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.status === "Terminé" ? "secondary" : "default"}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Détails</Button>
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
