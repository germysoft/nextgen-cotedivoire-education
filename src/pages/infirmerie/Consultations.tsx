import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, Search, Plus, Activity, Calendar, AlertTriangle,
  User, Thermometer, Pill, Stethoscope, Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const consultations = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", motif: "Fièvre", temperature: "38.5°C", date: "15 Déc 2024", heure: "10:30", gravite: "Modérée", traitement: "Paracétamol 1000mg", statut: "Traité" },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", motif: "Maux de tête", temperature: "36.8°C", date: "15 Déc 2024", heure: "11:15", gravite: "Légère", traitement: "Repos, hydratation", statut: "Traité" },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", motif: "Douleur abdominale", temperature: "37.2°C", date: "15 Déc 2024", heure: "14:00", gravite: "Modérée", traitement: "Observation 2h", statut: "En cours" },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", motif: "Blessure jambe", temperature: "36.9°C", date: "14 Déc 2024", heure: "09:45", gravite: "Légère", traitement: "Désinfection, pansement", statut: "Traité" },
  { id: 5, eleve: "KONE Ibrahim", classe: "4ème A", motif: "Crise d'asthme", temperature: "37.1°C", date: "14 Déc 2024", heure: "15:30", gravite: "Grave", traitement: "Ventoline, parents contactés", statut: "Référé" },
  { id: 6, eleve: "BAMBA Sarah", classe: "1ère C", motif: "Malaise", temperature: "36.5°C", date: "13 Déc 2024", heure: "10:00", gravite: "Modérée", traitement: "Repos, sucre", statut: "Traité" },
];

const statsJour = [
  { type: "Consultations", count: 18, icon: Stethoscope, color: "bg-blue-500" },
  { type: "Traitements", count: 15, icon: Pill, color: "bg-green-500" },
  { type: "Urgences", count: 2, icon: AlertTriangle, color: "bg-red-500" },
  { type: "Repos", count: 4, icon: Activity, color: "bg-yellow-500" },
];

export default function Consultations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations Infirmerie</h1>
          <p className="text-muted-foreground">Suivi médical et soins aux élèves</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nouvelle Consultation</DialogTitle>
              <DialogDescription>Enregistrer une consultation médicale</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eleve">Élève</Label>
                  <Input id="eleve" placeholder="Nom de l'élève" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classe">Classe</Label>
                  <Input id="classe" placeholder="Classe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Température (°C)</Label>
                  <Input id="temperature" type="number" step="0.1" placeholder="37.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gravite">Gravité</Label>
                  <Input id="gravite" placeholder="Légère/Modérée/Grave" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motif">Motif de consultation</Label>
                <Input id="motif" placeholder="Ex: Fièvre, Maux de tête..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptomes">Symptômes observés</Label>
                <Textarea id="symptomes" placeholder="Décrire les symptômes..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traitement">Traitement administré</Label>
                <Textarea id="traitement" placeholder="Médicaments, soins..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {statsJour.map((stat) => (
          <Card key={stat.type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.type}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">Aujourd'hui</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Consultations Récentes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher un élève..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrer par Date
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Température</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Traitement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{consultation.eleve}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{consultation.classe}</Badge>
                  </TableCell>
                  <TableCell>{consultation.motif}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Thermometer className={`h-4 w-4 ${
                        parseFloat(consultation.temperature) >= 38 ? "text-red-500" : "text-green-500"
                      }`} />
                      <span className={
                        parseFloat(consultation.temperature) >= 38 ? "text-red-600 font-semibold" : ""
                      }>
                        {consultation.temperature}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {consultation.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {consultation.heure}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      consultation.gravite === "Grave" ? "destructive" :
                      consultation.gravite === "Modérée" ? "default" :
                      "secondary"
                    }>
                      {consultation.gravite}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{consultation.traitement}</TableCell>
                  <TableCell>
                    <Badge variant={
                      consultation.statut === "Référé" ? "destructive" :
                      consultation.statut === "En cours" ? "default" :
                      "secondary"
                    }>
                      {consultation.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
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
