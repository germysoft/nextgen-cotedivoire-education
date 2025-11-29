import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Calendar, BookOpen, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const cours = [
  { date: "15 Déc 2024", heure: "08:00-09:00", classe: "Tle D", matiere: "Mathématiques", chapitre: "Équations différentielles", statut: "Dispensé", absents: 2 },
  { date: "15 Déc 2024", heure: "10:00-11:00", classe: "1ère C", matiere: "Mathématiques", chapitre: "Dérivées", statut: "Dispensé", absents: 0 },
  { date: "14 Déc 2024", heure: "14:00-15:00", classe: "2nde A", matiere: "Mathématiques", chapitre: "Fonctions", statut: "Dispensé", absents: 3 },
  { date: "14 Déc 2024", heure: "09:00-10:00", classe: "Tle D", matiere: "Mathématiques", chapitre: "Équations différentielles", statut: "Annulé", absents: 0 },
  { date: "13 Déc 2024", heure: "11:00-12:00", classe: "1ère C", matiere: "Mathématiques", chapitre: "Dérivées", statut: "Dispensé", absents: 1 },
];

const progression = [
  { classe: "Tle D", prevu: 45, realise: 38, taux: 84 },
  { classe: "1ère C", prevu: 40, realise: 36, taux: 90 },
  { classe: "2nde A", prevu: 35, realise: 28, taux: 80 },
  { classe: "3ème B", prevu: 30, realise: 25, taux: 83 },
];

export default function SuiviCours() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi des Cours</h1>
          <p className="text-muted-foreground">Historique et progression</p>
        </div>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Filtrer Période
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Dispensés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annulations</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">2.3% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Effectuées</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127h</div>
            <p className="text-xs text-muted-foreground">Sur 150h prévues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Réalisation</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.7%</div>
            <Progress value={84.7} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique des Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Chapitre</TableHead>
                  <TableHead>Absents</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cours.map((c, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {c.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {c.heure}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.classe}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{c.chapitre}</TableCell>
                    <TableCell>
                      {c.absents > 0 ? (
                        <Badge variant="destructive">{c.absents}</Badge>
                      ) : (
                        <span className="text-green-600">Aucun</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.statut === "Dispensé" ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Dispensé
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Annulé
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
            <CardTitle>Progression Programme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progression.map((p, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{p.classe}</span>
                      <Badge variant={p.taux >= 85 ? "default" : "secondary"}>
                        {p.taux}%
                      </Badge>
                    </div>
                    <Progress value={p.taux} className="h-2" />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{p.realise}h réalisées</span>
                      <span>{p.prevu}h prévues</span>
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
