import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Award, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const eleves = [
  { nom: "DIALLO Fatoumata", moyenneDevoirs: 15.8, moyenneCompos: 16.5, moyenneGenerale: 16.2, rang: 1, mention: "Très Bien" },
  { nom: "SANOGO Aminata", moyenneDevoirs: 14.2, moyenneCompos: 15.1, moyenneGenerale: 14.8, rang: 2, mention: "Bien" },
  { nom: "KOUASSI Jean", moyenneDevoirs: 13.8, moyenneCompos: 15.2, moyenneGenerale: 14.5, rang: 3, mention: "Bien" },
  { nom: "TOURÉ Mohamed", moyenneDevoirs: 12.5, moyenneCompos: 13.2, moyenneGenerale: 12.9, rang: 4, mention: "Assez Bien" },
];

const matieres = [
  { matiere: "Mathématiques", coef: 7, moyenneClasse: 12.8, min: 8.5, max: 18.5 },
  { matiere: "Physique-Chimie", coef: 6, moyenneClasse: 11.9, min: 7.2, max: 17.8 },
  { matiere: "SVT", coef: 5, moyenneClasse: 13.5, min: 9.1, max: 18.2 },
  { matiere: "Français", coef: 4, moyenneClasse: 12.2, min: 8.8, max: 16.5 },
];

export default function Moyennes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calcul Moyennes</h1>
          <p className="text-muted-foreground">Calcul automatique et rangs</p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Recalculer Tout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Classe</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13.1/20</div>
            <p className="text-xs text-green-600">+0.4 vs T précédent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meilleure Moyenne</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">16.2/20</div>
            <p className="text-xs text-muted-foreground">DIALLO Fatoumata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <Progress value={87.3} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admis</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">33/38</div>
            <p className="text-xs text-muted-foreground">Élèves</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Classement Général - Tle D</CardTitle>
              <CardDescription>Trimestre 1 - Année 2024-2025</CardDescription>
            </div>
            <Button variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              Recalculer Rangs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Élève</TableHead>
                <TableHead>Moy. Devoirs</TableHead>
                <TableHead>Moy. Compositions</TableHead>
                <TableHead>Moyenne Générale</TableHead>
                <TableHead>Mention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eleves.map((e) => (
                <TableRow key={e.rang}>
                  <TableCell>
                    <Badge variant={e.rang === 1 ? "default" : "outline"} className="text-base">
                      {e.rang}°
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{e.nom}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{e.moyenneDevoirs}/20</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{e.moyenneCompos}/20</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-lg font-bold ${
                      e.moyenneGenerale >= 16 ? "text-green-600" :
                      e.moyenneGenerale >= 14 ? "text-blue-600" :
                      e.moyenneGenerale >= 10 ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {e.moyenneGenerale}/20
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      e.mention === "Très Bien" || e.mention === "Excellent" ? "default" :
                      e.mention === "Bien" || e.mention === "Assez Bien" ? "secondary" :
                      "destructive"
                    }>
                      {e.mention}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moyennes par Matière</CardTitle>
          <CardDescription>Statistiques classe Tle D</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead className="text-center">Coefficient</TableHead>
                <TableHead className="text-center">Moyenne Classe</TableHead>
                <TableHead className="text-center">Note Min</TableHead>
                <TableHead className="text-center">Note Max</TableHead>
                <TableHead>Répartition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matieres.map((m, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{m.matiere}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-base">
                      {m.coef}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-lg font-bold ${
                      m.moyenneClasse >= 12 ? "text-green-600" :
                      m.moyenneClasse >= 10 ? "text-blue-600" :
                      "text-red-600"
                    }`}>
                      {m.moyenneClasse}/20
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-red-600">{m.min}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-green-600">{m.max}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(m.moyenneClasse / 20) * 100} className="flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {((m.moyenneClasse / 20) * 100).toFixed(0)}%
                      </span>
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
