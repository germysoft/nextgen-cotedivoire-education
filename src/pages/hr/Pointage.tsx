import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CheckCircle, XCircle, AlertCircle, Calendar,
  User, TrendingUp, Download
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const pointages = [
  { id: 1, employe: "M. KOFFI Yao", poste: "Enseignant", heure: "07:45", statut: "À l'heure", retard: 0 },
  { id: 2, employe: "Mme DIALLO Fatoumata", poste: "Enseignant", heure: "08:12", statut: "Retard", retard: 12 },
  { id: 3, employe: "M. TOURÉ Mohamed", poste: "Enseignant", heure: "07:50", statut: "À l'heure", retard: 0 },
  { id: 4, employe: "Mme SANOGO Aminata", poste: "Secrétaire", heure: "07:30", statut: "À l'heure", retard: 0 },
  { id: 5, employe: "M. KONE Ibrahim", poste: "Enseignant", heure: "-", statut: "Absent", retard: 0 },
  { id: 6, employe: "Mme BAMBA Sarah", poste: "Comptable", heure: "08:05", statut: "Retard", retard: 5 },
  { id: 7, employe: "M. YAO Jean", poste: "Surveillant", heure: "07:55", statut: "À l'heure", retard: 0 },
  { id: 8, employe: "Mme TRAORE Aminata", poste: "Bibliothécaire", heure: "08:20", statut: "Retard", retard: 20 },
];

const statistiquesHebdo = [
  { jour: "Lundi", presents: 65, retards: 3, absents: 0, taux: 100 },
  { jour: "Mardi", presents: 63, retards: 4, absents: 1, taux: 98.5 },
  { jour: "Mercredi", presents: 64, retards: 2, absents: 2, taux: 97 },
  { jour: "Jeudi", presents: 66, retards: 1, absents: 1, taux: 98.5 },
  { jour: "Vendredi", presents: 62, retards: 5, absents: 1, taux: 96.9 },
];

export default function Pointage() {
  const stats = {
    presents: pointages.filter(p => p.statut === "À l'heure" || p.statut === "Retard").length,
    alHeure: pointages.filter(p => p.statut === "À l'heure").length,
    retards: pointages.filter(p => p.statut === "Retard").length,
    absents: pointages.filter(p => p.statut === "Absent").length,
    total: 68,
  };

  const tauxPresence = ((stats.presents / stats.total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pointage du Personnel</h1>
          <p className="text-muted-foreground">Suivi quotidien des présences et assiduité</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Historique
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presents}</div>
            <p className="text-xs text-muted-foreground">Sur {stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À l'heure</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.alHeure}</div>
            <p className="text-xs text-green-600">{((stats.alHeure / stats.total) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.retards}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absents</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absents}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxPresence}%</div>
            <Progress value={parseFloat(tauxPresence)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pointages du Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Heure d'arrivée</TableHead>
                  <TableHead>Retard</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointages.map((pointage) => (
                  <TableRow key={pointage.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{pointage.employe}</span>
                      </div>
                    </TableCell>
                    <TableCell>{pointage.poste}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pointage.heure}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pointage.retard > 0 ? (
                        <Badge variant="destructive">{pointage.retard} min</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {pointage.statut === "À l'heure" && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          À l'heure
                        </Badge>
                      )}
                      {pointage.statut === "Retard" && (
                        <Badge className="gap-1 bg-yellow-500">
                          <AlertCircle className="h-3 w-3" />
                          Retard
                        </Badge>
                      )}
                      {pointage.statut === "Absent" && (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Absent
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
            <CardTitle>Statistiques Hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistiquesHebdo.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stat.jour}</span>
                      <Badge variant={stat.taux >= 98 ? "default" : stat.taux >= 95 ? "secondary" : "destructive"}>
                        {stat.taux}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 rounded-lg bg-green-50">
                        <p className="text-xs text-muted-foreground">Présents</p>
                        <p className="font-bold text-green-600">{stat.presents}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-yellow-50">
                        <p className="text-xs text-muted-foreground">Retards</p>
                        <p className="font-bold text-yellow-600">{stat.retards}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-red-50">
                        <p className="text-xs text-muted-foreground">Absents</p>
                        <p className="font-bold text-red-600">{stat.absents}</p>
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
