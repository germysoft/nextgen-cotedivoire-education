import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, MapPin, User, Clock, AlertCircle, CheckCircle2, Navigation } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const bus = [
  { id: 1, numero: "BUS-01", chauffeur: "KOUAME Yao", capacite: 45, inscrits: 42, itineraire: "Cocody - École", statut: "En service", derniere_maintenance: "2024-11-15" },
  { id: 2, numero: "BUS-02", chauffeur: "DIALLO Moussa", capacite: 50, inscrits: 48, itineraire: "Yopougon - École", statut: "En service", derniere_maintenance: "2024-11-20" },
  { id: 3, numero: "BUS-03", chauffeur: "TRAORE Sekou", capacite: 40, inscrits: 35, itineraire: "Abobo - École", statut: "En service", derniere_maintenance: "2024-11-10" },
  { id: 4, numero: "BUS-04", chauffeur: "KONE Ibrahim", capacite: 45, inscrits: 0, itineraire: "-", statut: "Maintenance", derniere_maintenance: "2024-12-01" },
];

const itineraires = [
  { id: 1, nom: "Cocody - École", arrets: ["Angré", "Riviera Palmeraie", "II Plateaux", "École"], duree: "35 min", distance: "12 km" },
  { id: 2, nom: "Yopougon - École", arrets: ["Maroc", "Sicogi", "Wassakara", "École"], duree: "45 min", distance: "18 km" },
  { id: 3, nom: "Abobo - École", arrets: ["Anyama", "Abobo Gare", "Adjamé", "École"], duree: "50 min", distance: "22 km" },
];

const eleves = [
  { id: 1, nom: "BAMBA Koffi", classe: "6ème A", bus: "BUS-01", arret: "Angré", statut: "Payé", montant: 25000 },
  { id: 2, nom: "SORO Aya", classe: "5ème B", bus: "BUS-02", arret: "Maroc", statut: "Payé", montant: 30000 },
  { id: 3, nom: "N'GORAN Marie", classe: "4ème A", bus: "BUS-01", arret: "II Plateaux", statut: "Impayé", montant: 25000 },
  { id: 4, nom: "KOFFI Jean", classe: "3ème C", bus: "BUS-03", arret: "Anyama", statut: "Partiel", montant: 35000 },
];

const Transport = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewInscription = () => {
    toast.success("Inscription transport enregistrée avec succès");
    setIsDialogOpen(false);
  };

  const totalCapacite = bus.reduce((sum, b) => sum + b.capacite, 0);
  const totalInscrits = bus.reduce((sum, b) => sum + b.inscrits, 0);
  const tauxOccupation = ((totalInscrits / totalCapacite) * 100).toFixed(1);
  const busActifs = bus.filter(b => b.statut === "En service").length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gestion du Transport Scolaire</h1>
          <p className="text-muted-foreground mt-2">Suivi des bus, itinéraires, chauffeurs et inscriptions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Bus className="mr-2 h-4 w-4" />
              Nouvelle Inscription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inscrire un Élève au Transport</DialogTitle>
              <DialogDescription>Ajouter un élève à un itinéraire de bus</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matricule Élève</Label>
                  <Input placeholder="2024001" />
                </div>
                <div className="space-y-2">
                  <Label>Élève</Label>
                  <Input disabled value="KOUAME Koffi - 6ème A" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Itinéraire</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cocody - École (BUS-01)</SelectItem>
                      <SelectItem value="2">Yopougon - École (BUS-02)</SelectItem>
                      <SelectItem value="3">Abobo - École (BUS-03)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Arrêt</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="angre">Angré</SelectItem>
                      <SelectItem value="riviera">Riviera Palmeraie</SelectItem>
                      <SelectItem value="plateaux">II Plateaux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Montant Annuel (FCFA)</Label>
                  <Input type="number" placeholder="25000" />
                </div>
                <div className="space-y-2">
                  <Label>Période</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annuel">Annuel</SelectItem>
                      <SelectItem value="trimestriel">Trimestriel</SelectItem>
                      <SelectItem value="mensuel">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleNewInscription}>Valider Inscription</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bus Actifs</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{busActifs}/{bus.length}</div>
            <Progress value={(busActifs / bus.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Inscrits</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInscrits}</div>
            <p className="text-xs text-muted-foreground">Sur {totalCapacite} places</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxOccupation}%</div>
            <Progress value={parseFloat(tauxOccupation)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itinéraires</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itineraires.length}</div>
            <p className="text-xs text-muted-foreground">Routes actives</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bus" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bus">Flotte de Bus</TabsTrigger>
          <TabsTrigger value="itineraires">Itinéraires</TabsTrigger>
          <TabsTrigger value="eleves">Élèves Inscrits</TabsTrigger>
        </TabsList>

        <TabsContent value="bus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flotte de Bus</CardTitle>
              <CardDescription>Gestion des véhicules et chauffeurs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Inscrits</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Itinéraire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bus.map((vehicle) => {
                    const occupation = (vehicle.inscrits / vehicle.capacite) * 100;
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-bold">{vehicle.numero}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {vehicle.chauffeur}
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.capacite} places</TableCell>
                        <TableCell className="font-medium">{vehicle.inscrits}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={occupation} />
                            <span className="text-xs text-muted-foreground">{occupation.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.itineraire}</TableCell>
                        <TableCell>
                          <Badge variant={vehicle.statut === "En service" ? "default" : "secondary"}>
                            {vehicle.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{vehicle.derniere_maintenance}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Gérer</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itineraires" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {itineraires.map((itineraire) => (
              <Card key={itineraire.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{itineraire.nom}</CardTitle>
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>Itinéraire complet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Arrêts</Label>
                    <div className="space-y-1">
                      {itineraire.arrets.map((arret, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{arret}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Durée</div>
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" />
                        {itineraire.duree}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                      <div className="font-medium">{itineraire.distance}</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">Voir Carte GPS</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="eleves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Élèves Inscrits au Transport</CardTitle>
              <CardDescription>Liste des inscriptions actives</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Bus</TableHead>
                    <TableHead>Arrêt</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut Paiement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eleves.map((eleve) => (
                    <TableRow key={eleve.id}>
                      <TableCell className="font-medium">{eleve.nom}</TableCell>
                      <TableCell>{eleve.classe}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{eleve.bus}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {eleve.arret}
                        </div>
                      </TableCell>
                      <TableCell>{eleve.montant.toLocaleString()} F</TableCell>
                      <TableCell>
                        <Badge variant={
                          eleve.statut === "Payé" ? "default" :
                          eleve.statut === "Partiel" ? "secondary" :
                          "destructive"
                        }>
                          {eleve.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Modifier</Button>
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

export default Transport;
