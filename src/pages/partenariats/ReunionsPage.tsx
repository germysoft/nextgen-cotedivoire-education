import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Users, Calendar as CalendarIcon, Clock, MapPin, Plus, Search, 
  CheckCircle, XCircle, AlertCircle, Video, FileText, Download,
  ChevronLeft, ChevronRight, Bell, Mail
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface Reunion {
  id: string;
  titre: string;
  type: "conseil_classe" | "parents" | "pedagogique" | "administrative" | "autre";
  date: Date;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  participants: string[];
  statut: "planifiee" | "en_cours" | "terminee" | "annulee";
  compte_rendu?: string;
  decisions?: string[];
}

const ReunionsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [reunions] = useState<Reunion[]>([
    { id: "1", titre: "Conseil de classe 3ème A - T1", type: "conseil_classe", date: new Date("2024-01-18T14:00"), heureDebut: "14:00", heureFin: "16:00", lieu: "Salle de conférence", participants: ["Direction", "Enseignants 3ème A", "Délégués parents", "Délégués élèves"], statut: "planifiee" },
    { id: "2", titre: "Réunion parents d'élèves 6ème", type: "parents", date: new Date("2024-01-20T09:00"), heureDebut: "09:00", heureFin: "11:00", lieu: "Amphithéâtre", participants: ["Direction", "Enseignants 6ème", "Parents 6ème"], statut: "planifiee" },
    { id: "3", titre: "Conseil pédagogique mensuel", type: "pedagogique", date: new Date("2024-01-15T15:00"), heureDebut: "15:00", heureFin: "17:00", lieu: "Salle des professeurs", participants: ["Direction", "Tous les enseignants"], statut: "terminee", compte_rendu: "Compte rendu disponible", decisions: ["Harmonisation des évaluations", "Planning examens blancs"] },
    { id: "4", titre: "Réunion administrative", type: "administrative", date: new Date("2024-01-16T10:00"), heureDebut: "10:00", heureFin: "12:00", lieu: "Bureau direction", participants: ["Direction", "Secrétariat", "Comptabilité"], statut: "terminee" },
    { id: "5", titre: "Conseil de discipline - Élève X", type: "autre", date: new Date("2024-01-22T14:30"), heureDebut: "14:30", heureFin: "16:30", lieu: "Salle de conférence", participants: ["Direction", "CPE", "Enseignant principal", "Parents"], statut: "planifiee" },
  ]);

  const stats = {
    totalMois: reunions.filter(r => r.date.getMonth() === new Date().getMonth()).length,
    planifiees: reunions.filter(r => r.statut === "planifiee").length,
    terminees: reunions.filter(r => r.statut === "terminee").length,
    conseils: reunions.filter(r => r.type === "conseil_classe").length,
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "conseil_classe": return "Conseil de classe";
      case "parents": return "Parents d'élèves";
      case "pedagogique": return "Pédagogique";
      case "administrative": return "Administrative";
      default: return "Autre";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "conseil_classe": return "bg-blue-500";
      case "parents": return "bg-green-500";
      case "pedagogique": return "bg-purple-500";
      case "administrative": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  const filteredReunions = reunions.filter(r => {
    const matchSearch = r.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "all" || r.type === selectedType;
    return matchSearch && matchType;
  });

  const prochaines = reunions
    .filter(r => r.statut === "planifiee" && r.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Réunions & Conseils</h1>
          <p className="text-muted-foreground">Planification et suivi des réunions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />Nouvelle réunion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Planifier une Réunion</DialogTitle>
              <DialogDescription>Créez une nouvelle réunion ou conseil</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Titre de la réunion</Label>
                <Input placeholder="Ex: Conseil de classe 3ème A" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conseil_classe">Conseil de classe</SelectItem>
                    <SelectItem value="parents">Réunion parents</SelectItem>
                    <SelectItem value="pedagogique">Conseil pédagogique</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Heure de début</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>Heure de fin</Label>
                <Input type="time" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Lieu</Label>
                <Input placeholder="Ex: Salle de conférence" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button onClick={() => { toast.success("Réunion planifiée"); setIsAddDialogOpen(false); }}>Planifier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ce mois</p>
              <p className="text-2xl font-bold">{stats.totalMois}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Planifiées</p>
              <p className="text-2xl font-bold">{stats.planifiees}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Terminées</p>
              <p className="text-2xl font-bold">{stats.terminees}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conseils de classe</p>
              <p className="text-2xl font-bold">{stats.conseils}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prochaines réunions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Prochaines Réunions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {prochaines.map((reunion) => (
              <div key={reunion.id} className="flex-shrink-0 p-4 border rounded-lg min-w-[280px] bg-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getTypeColor(reunion.type)}`} />
                  <Badge variant="outline">{getTypeLabel(reunion.type)}</Badge>
                </div>
                <h3 className="font-medium mb-1">{reunion.titre}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{format(reunion.date, "dd MMMM yyyy", { locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{reunion.heureDebut} - {reunion.heureFin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{reunion.lieu}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => toast.success("Convocation envoyée")}>
                    <Mail className="h-3 w-3 mr-1" />Convoquer
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-3 w-3 mr-1" />Visio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          <TabsTrigger value="comptes-rendus">Comptes-rendus</TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Toutes les Réunions</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="conseil_classe">Conseils de classe</SelectItem>
                      <SelectItem value="parents">Parents d'élèves</SelectItem>
                      <SelectItem value="pedagogique">Pédagogique</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réunion</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReunions.map((reunion) => (
                    <TableRow key={reunion.id}>
                      <TableCell className="font-medium">{reunion.titre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getTypeColor(reunion.type)}`} />
                          <span className="text-sm">{getTypeLabel(reunion.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(reunion.date, "dd/MM/yyyy", { locale: fr })}</p>
                          <p className="text-muted-foreground">{reunion.heureDebut} - {reunion.heureFin}</p>
                        </div>
                      </TableCell>
                      <TableCell>{reunion.lieu}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{reunion.participants.length} personnes</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          reunion.statut === "terminee" ? "default" :
                          reunion.statut === "planifiee" ? "secondary" :
                          reunion.statut === "annulee" ? "destructive" : "outline"
                        }>
                          {reunion.statut === "terminee" ? <CheckCircle className="h-3 w-3 mr-1" /> :
                           reunion.statut === "planifiee" ? <Clock className="h-3 w-3 mr-1" /> :
                           reunion.statut === "annulee" ? <XCircle className="h-3 w-3 mr-1" /> : null}
                          {reunion.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => toast.success("Convocations envoyées")}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          {reunion.statut === "terminee" && (
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendrier">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comptes-rendus">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reunions.filter(r => r.statut === "terminee").map((reunion) => (
              <Card key={reunion.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{reunion.titre}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(reunion.date, "dd MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <Badge>{getTypeLabel(reunion.type)}</Badge>
                  </div>
                  {reunion.decisions && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Décisions prises:</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {reunion.decisions.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Téléchargement du compte-rendu")}>
                    <Download className="h-4 w-4 mr-2" />Télécharger le compte-rendu
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReunionsPage;
