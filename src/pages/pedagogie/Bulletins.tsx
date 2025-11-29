import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, Clock, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const bulletins = [
  { classe: "Tle D", trimestre: "T1", eleves: 38, generes: 38, imprimes: 35, distribues: 32, statut: "Complet" },
  { classe: "1ère A", trimestre: "T1", eleves: 45, generes: 45, imprimes: 45, distribues: 45, statut: "Complet" },
  { classe: "2nde B", trimestre: "T1", eleves: 42, generes: 42, imprimes: 40, distribues: 38, statut: "En cours" },
  { classe: "3ème C", trimestre: "T1", eleves: 48, generes: 48, imprimes: 48, distribues: 45, statut: "En cours" },
];

const moyennes = [
  { matiere: "Mathématiques", coef: 7, note: 14.5, rang: 3 },
  { matiere: "Physique-Chimie", coef: 6, note: 13.8, rang: 5 },
  { matiere: "SVT", coef: 5, note: 15.2, rang: 2 },
  { matiere: "Français", coef: 4, note: 12.5, rang: 8 },
  { matiere: "Anglais", coef: 3, note: 13.1, rang: 6 },
];

export default function Bulletins() {
  const moyenneGenerale = 14.2;
  const rangGeneral = 3;
  const totalEleves = 38;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulletins MENA</h1>
          <p className="text-muted-foreground">Génération et distribution conforme MENA</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Générer Bulletins
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulletins Générés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">173</div>
            <p className="text-xs text-muted-foreground">Sur 173 élèves</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imprimés</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">168</div>
            <Progress value={97.1} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribués</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">160</div>
            <p className="text-xs text-muted-foreground">92.5% distribués</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">13</div>
            <p className="text-xs text-muted-foreground">À distribuer</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>État par Classe - Trimestre 1</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classe</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>Élèves</TableHead>
                <TableHead>Générés</TableHead>
                <TableHead>Imprimés</TableHead>
                <TableHead>Distribués</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bulletins.map((b, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Badge variant="outline" className="text-base">
                      {b.classe}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{b.trimestre}</Badge>
                  </TableCell>
                  <TableCell className="font-bold">{b.eleves}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {b.generes}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      {b.imprimes}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{b.distribues}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((b.distribues / b.eleves) * 100)}%)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.statut === "Complet" ? "default" : "secondary"}>
                      {b.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="h-4 w-4" />
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aperçu Bulletin - KOUASSI Jean (Tle D)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Trimestre 1 - Année 2024-2025</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                <p className="text-3xl font-bold text-primary">{moyenneGenerale}/20</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Rang</p>
                <p className="text-3xl font-bold">{rangGeneral}°/{totalEleves}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Mention</p>
                <Badge variant="default" className="text-lg px-4 py-1">Bien</Badge>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matière</TableHead>
                  <TableHead className="text-center">Coefficient</TableHead>
                  <TableHead className="text-center">Note</TableHead>
                  <TableHead className="text-center">Rang</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moyennes.map((m, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{m.matiere}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-base">
                        {m.coef}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-lg font-bold ${
                        m.note >= 14 ? "text-green-600" :
                        m.note >= 10 ? "text-blue-600" :
                        "text-red-600"
                      }`}>
                        {m.note}/20
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{m.rang}°</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>MOYENNE GÉNÉRALE</TableCell>
                  <TableCell className="text-center">
                    {moyennes.reduce((sum, m) => sum + m.coef, 0)}
                  </TableCell>
                  <TableCell className="text-center text-primary text-lg">
                    {moyenneGenerale}/20
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">{rangGeneral}°</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="p-4 border rounded-lg">
              <p className="font-semibold mb-2">Appréciation Générale:</p>
              <p className="text-sm text-muted-foreground">
                Bon trimestre. L'élève fait preuve de régularité dans son travail. 
                Excellents résultats en SVT. Peut progresser davantage en Français. 
                Encourage à poursuivre ses efforts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
