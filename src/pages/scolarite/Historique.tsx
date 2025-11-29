import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Download, Calendar, Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const parcours = [
  { annee: "2024-2025", classe: "Tle D", moyenne: 14.5, rang: 3, decision: "En cours", mention: "-" },
  { annee: "2023-2024", classe: "1ère D", moyenne: 13.8, rang: 5, decision: "Admis", mention: "Bien" },
  { annee: "2022-2023", classe: "2nde C", moyenne: 12.9, rang: 8, decision: "Admis", mention: "Assez Bien" },
  { annee: "2021-2022", classe: "3ème A", moyenne: 14.2, rang: 4, decision: "Admis", mention: "Bien" },
];

const bulletins = [
  { trimestre: "T1 2024-2025", classe: "Tle D", moyenne: 14.5, rang: 3, appreciation: "Bon trimestre" },
  { trimestre: "T3 2023-2024", classe: "1ère D", moyenne: 14.8, rang: 2, appreciation: "Excellent travail" },
  { trimestre: "T2 2023-2024", classe: "1ère D", moyenne: 13.5, rang: 6, appreciation: "Peut mieux faire" },
  { trimestre: "T1 2023-2024", classe: "1ère D", moyenne: 13.1, rang: 8, appreciation: "Travail régulier" },
];

const diplomes = [
  { nom: "BEPC", annee: "2022", mention: "Bien", moyenne: 13.5 },
  { nom: "CEP", annee: "2018", mention: "Assez Bien", moyenne: 12.8 },
];

export default function Historique() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique Scolaire</h1>
          <p className="text-muted-foreground">Parcours complet de l'élève</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un élève..." className="pl-10 w-64" />
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>KOUASSI Jean - Matricule: 2024-TLE-D-001</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Élève depuis 2018 • Actuellement en Tle D
              </p>
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Dossier Complet
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Années Complétées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Dans cet établissement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13.7/20</div>
            <p className="text-xs text-muted-foreground">Sur toute la scolarité</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diplômes</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">BEPC, CEP</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="parcours" className="space-y-6">
        <TabsList>
          <TabsTrigger value="parcours">Parcours Scolaire</TabsTrigger>
          <TabsTrigger value="bulletins">Bulletins</TabsTrigger>
          <TabsTrigger value="diplomes">Diplômes</TabsTrigger>
        </TabsList>

        <TabsContent value="parcours">
          <Card>
            <CardHeader>
              <CardTitle>Parcours Année par Année</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Moyenne Annuelle</TableHead>
                    <TableHead>Rang</TableHead>
                    <TableHead>Décision</TableHead>
                    <TableHead>Mention</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcours.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{p.annee}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{p.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${
                          p.moyenne >= 14 ? "text-green-600" :
                          p.moyenne >= 10 ? "text-blue-600" :
                          "text-red-600"
                        }`}>
                          {p.moyenne}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.rang}°</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.decision === "Admis" ? "default" : "secondary"}>
                          {p.decision}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {p.mention !== "-" ? (
                          <Badge variant="default">{p.mention}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulletins">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Bulletins</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Rang</TableHead>
                    <TableHead>Appréciation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulletins.map((b, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{b.trimestre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{b.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${
                          b.moyenne >= 14 ? "text-green-600" :
                          b.moyenne >= 10 ? "text-blue-600" :
                          "text-red-600"
                        }`}>
                          {b.moyenne}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{b.rang}°</Badge>
                      </TableCell>
                      <TableCell>{b.appreciation}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diplomes">
          <div className="grid gap-6 md:grid-cols-2">
            {diplomes.map((d, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      {d.nom}
                    </CardTitle>
                    <Badge variant="default">{d.mention}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Année d'obtention</span>
                      <span className="font-semibold">{d.annee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Moyenne</span>
                      <span className="text-lg font-bold text-green-600">{d.moyenne}/20</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger Diplôme
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
