import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, AlertTriangle, CheckCircle, Clock, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const interventions = [
  { id: 1, type: "Urgent", lieu: "Classe 3ème A", probleme: "Fuite d'eau au plafond", dateSignalement: "15 Déc 2024", priorite: "Haute", statut: "En cours", technicien: "M. DIABY" },
  { id: 2, type: "Préventif", lieu: "Laboratoire Physique", probleme: "Révision électrique annuelle", dateSignalement: "14 Déc 2024", priorite: "Normale", statut: "Planifié", technicien: "M. KOUADIO" },
  { id: 3, type: "Réparation", lieu: "Cantine", probleme: "Réfrigérateur en panne", dateSignalement: "13 Déc 2024", priorite: "Haute", statut: "Terminé", technicien: "M. DIABY" },
  { id: 4, type: "Entretien", lieu: "Cour de récréation", probleme: "Peinture bancs", dateSignalement: "12 Déc 2024", priorite: "Basse", statut: "Planifié", technicien: "M. TRAORE" },
  { id: 5, type: "Urgent", lieu: "Salle Informatique", probleme: "Climatisation défaillante", dateSignalement: "15 Déc 2024", priorite: "Haute", statut: "En attente", technicien: null },
];

const planning = [
  { date: "18 Déc 2024", tache: "Entretien climatisation", lieu: "Salles de classe", duree: "4h" },
  { date: "19 Déc 2024", tache: "Révision système électrique", lieu: "Bâtiment A", duree: "6h" },
  { date: "20 Déc 2024", tache: "Plomberie préventive", lieu: "Sanitaires", duree: "3h" },
  { date: "22 Déc 2024", tache: "Peinture extérieure", lieu: "Façade principale", duree: "8h" },
];

export default function Maintenance() {
  const stats = {
    enCours: interventions.filter(i => i.statut === "En cours").length,
    enAttente: interventions.filter(i => i.statut === "En attente").length,
    planifies: interventions.filter(i => i.statut === "Planifié").length,
    termines: interventions.filter(i => i.statut === "Terminé").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance & Interventions</h1>
          <p className="text-muted-foreground">Gestion de l'entretien des infrastructures</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Intervention
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
            <p className="text-xs text-muted-foreground">Interventions actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.planifies}</div>
            <p className="text-xs text-muted-foreground">Programmés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.termines}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Interventions en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Problème</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Technicien</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((intervention) => (
                  <TableRow key={intervention.id}>
                    <TableCell>
                      <Badge variant="outline">{intervention.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{intervention.lieu}</TableCell>
                    <TableCell className="max-w-xs truncate">{intervention.probleme}</TableCell>
                    <TableCell>{intervention.dateSignalement}</TableCell>
                    <TableCell>
                      {intervention.priorite === "Haute" ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Haute
                        </Badge>
                      ) : intervention.priorite === "Normale" ? (
                        <Badge variant="default">Normale</Badge>
                      ) : (
                        <Badge variant="secondary">Basse</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {intervention.technicien || (
                        <Badge variant="secondary">Non assigné</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {intervention.statut === "En cours" && (
                        <Badge className="gap-1 bg-blue-500">
                          <Wrench className="h-3 w-3" />
                          En cours
                        </Badge>
                      )}
                      {intervention.statut === "Planifié" && (
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          Planifié
                        </Badge>
                      )}
                      {intervention.statut === "Terminé" && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Terminé
                        </Badge>
                      )}
                      {intervention.statut === "En attente" && (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          En attente
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planning de Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planning.map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{item.tache}</p>
                        <p className="text-sm text-muted-foreground">{item.lieu}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge variant="outline">{item.date}</Badge>
                          <span className="text-xs text-muted-foreground">{item.duree}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
