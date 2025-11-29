import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Eye, BarChart3, Clock, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const qcms = [
  { id: 1, titre: "Équations du 2nd degré", matiere: "Mathématiques", classe: "1ère C", questions: 20, duree: 30, tentatives: 42, moyenneNote: 14.5, statut: "Actif" },
  { id: 2, titre: "La Révolution Française", matiere: "Histoire", classe: "2nde A", questions: 15, duree: 20, tentatives: 38, moyenneNote: 12.8, statut: "Actif" },
  { id: 3, titre: "Grammar Test - Present Perfect", matiere: "Anglais", classe: "Tle D", questions: 25, duree: 25, tentatives: 35, moyenneNote: 13.2, statut: "Actif" },
  { id: 4, titre: "La Cellule Végétale", matiere: "SVT", classe: "3ème B", questions: 18, duree: 20, tentatives: 45, moyenneNote: 15.1, statut: "Terminé" },
];

const resultats = [
  { eleve: "KOUASSI Jean", score: 18, sur: 20, note: 18, temps: "24 min", statut: "Excellent" },
  { eleve: "DIALLO Fatoumata", score: 16, sur: 20, note: 16, temps: "27 min", statut: "Très Bien" },
  { eleve: "TOURÉ Mohamed", score: 12, sur: 20, note: 12, temps: "30 min", statut: "Assez Bien" },
  { eleve: "SANOGO Aminata", score: 14, sur: 20, note: 14, temps: "26 min", statut: "Bien" },
];

export default function QCM() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QCM Auto-Corrigés</h1>
          <p className="text-muted-foreground">Évaluations automatiques en ligne</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau QCM
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QCM Actifs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">En ligne</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentatives</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13.8/20</div>
            <p className="text-xs text-green-600">+0.5 vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Réussite</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.3%</div>
            <Progress value={82.3} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QCM Disponibles</CardTitle>
          <CardDescription>Évaluations en ligne avec correction automatique</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Tentatives</TableHead>
                <TableHead>Moyenne</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qcms.map((qcm) => (
                <TableRow key={qcm.id}>
                  <TableCell className="font-medium">{qcm.titre}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{qcm.matiere}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{qcm.classe}</Badge>
                  </TableCell>
                  <TableCell>{qcm.questions} Q</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {qcm.duree} min
                    </div>
                  </TableCell>
                  <TableCell>{qcm.tentatives}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      qcm.moyenneNote >= 14 ? "text-green-600" :
                      qcm.moyenneNote >= 10 ? "text-blue-600" :
                      "text-red-600"
                    }`}>
                      {qcm.moyenneNote}/20
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={qcm.statut === "Actif" ? "default" : "secondary"}>
                      {qcm.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats Récents - Équations du 2nd degré</CardTitle>
          <CardDescription>Mathématiques - 1ère C</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Temps</TableHead>
                <TableHead>Appréciation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultats.map((resultat, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{resultat.eleve}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{resultat.score}/{resultat.sur}</span>
                      <Progress value={(resultat.score / resultat.sur) * 100} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-lg font-bold ${
                      resultat.note >= 16 ? "text-green-600" :
                      resultat.note >= 14 ? "text-blue-600" :
                      resultat.note >= 10 ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {resultat.note}/20
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {resultat.temps}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      resultat.statut === "Excellent" || resultat.statut === "Très Bien" ? "default" :
                      resultat.statut === "Bien" || resultat.statut === "Assez Bien" ? "secondary" :
                      "destructive"
                    }>
                      {resultat.statut}
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
