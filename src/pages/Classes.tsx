import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const mockClasses = [
  { id: 1, name: "6èmeA", level: "6ème", cycle: "1er Cycle", capacity: 45, enrolled: 42, teacher: "M. Kouassi Jean" },
  { id: 2, name: "5èmeB", level: "5ème", cycle: "1er Cycle", capacity: 40, enrolled: 38, teacher: "Mme Diallo Fatou" },
  { id: 3, name: "4èmeC", level: "4ème", cycle: "1er Cycle", capacity: 40, enrolled: 35, teacher: "M. Traoré Yao" },
  { id: 4, name: "3èmeA", level: "3ème", cycle: "1er Cycle", capacity: 45, enrolled: 44, teacher: "Mme Bamba Aya" },
  { id: 5, name: "2ndeC", level: "2nde", cycle: "2nd Cycle", capacity: 50, enrolled: 48, teacher: "M. Koné Serge" },
  { id: 6, name: "1èreD", level: "1ère", cycle: "2nd Cycle", capacity: 45, enrolled: 40, teacher: "M. Yao Martin" },
  { id: 7, name: "TleA1", level: "Tle", cycle: "2nd Cycle", capacity: 40, enrolled: 39, teacher: "Mme Coulibaly Marie" },
];

export default function Classes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredClasses = mockClasses.filter((classe) =>
    classe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classe.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classe.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOccupancyColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 95) return "destructive";
    if (percentage >= 80) return "default";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Classes</h1>
          <p className="text-muted-foreground">Gérer les classes et leurs affectations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Classe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle classe</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Nom de la classe</Label>
                  <Input id="className" placeholder="Ex: 6èmeA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycle">Cycle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1er">1er Cycle</SelectItem>
                      <SelectItem value="2nd">2nd Cycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6eme">6ème</SelectItem>
                      <SelectItem value="5eme">5ème</SelectItem>
                      <SelectItem value="4eme">4ème</SelectItem>
                      <SelectItem value="3eme">3ème</SelectItem>
                      <SelectItem value="2nde">2nde</SelectItem>
                      <SelectItem value="1ere">1ère</SelectItem>
                      <SelectItem value="tle">Tle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité</Label>
                  <Input id="capacity" type="number" placeholder="45" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher">Professeur Principal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un professeur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">M. Kouassi Jean</SelectItem>
                    <SelectItem value="2">Mme Diallo Fatou</SelectItem>
                    <SelectItem value="3">M. Traoré Yao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Créer la classe</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClasses.length}</div>
            <p className="text-xs text-muted-foreground">Toutes les classes actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1er Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClasses.filter(c => c.cycle === "1er Cycle").length}
            </div>
            <p className="text-xs text-muted-foreground">Classes 6ème-3ème</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2nd Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClasses.filter(c => c.cycle === "2nd Cycle").length}
            </div>
            <p className="text-xs text-muted-foreground">Classes 2nde-Tle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClasses.reduce((acc, c) => acc + c.enrolled, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Inscrits cette année</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Classes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une classe..."
                  className="pl-8 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Professeur Principal</TableHead>
                <TableHead>Effectif</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Taux d'occupation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((classe) => (
                <TableRow key={classe.id}>
                  <TableCell className="font-medium">{classe.name}</TableCell>
                  <TableCell>{classe.level}</TableCell>
                  <TableCell>{classe.cycle}</TableCell>
                  <TableCell>{classe.teacher}</TableCell>
                  <TableCell>{classe.enrolled}</TableCell>
                  <TableCell>{classe.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={getOccupancyColor(classe.enrolled, classe.capacity)}>
                      {Math.round((classe.enrolled / classe.capacity) * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
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
    </div>
  );
}
