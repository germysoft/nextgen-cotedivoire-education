import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Award, TrendingUp, Download } from "lucide-react";
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
  { periode: "2024-2025", poste: "Enseignant Mathématiques", grade: "Certifié", salaire: "650K", statut: "En cours" },
  { periode: "2021-2024", poste: "Enseignant Mathématiques", grade: "Stagiaire", salaire: "450K", statut: "Terminé" },
  { periode: "2019-2021", poste: "Vacataire Mathématiques", grade: "Contractuel", salaire: "300K", statut: "Terminé" },
];

const formations = [
  { annee: "2023", titre: "Formation Pédagogie Numérique", organisme: "MENA", duree: "40h", certificat: true },
  { annee: "2022", titre: "Gestion de Classe", organisme: "INFPE", duree: "30h", certificat: true },
  { annee: "2021", titre: "Évaluation par Compétences", organisme: "MENA", duree: "25h", certificat: true },
];

const evaluations = [
  { annee: "2023-2024", note: 18, appreciation: "Excellent", evaluateur: "Directeur DIALLO" },
  { annee: "2022-2023", note: 16, appreciation: "Très Bien", evaluateur: "Directeur DIALLO" },
  { annee: "2021-2022", note: 15, appreciation: "Bien", evaluateur: "Censeur KOFFI" },
];

const promotions = [
  { date: "01 Sept 2024", ancien: "Stagiaire", nouveau: "Certifié", augmentation: "+44%" },
  { date: "01 Sept 2021", ancien: "Contractuel", nouveau: "Stagiaire", augmentation: "+50%" },
];

export default function HistoriqueCarriere() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique Carrière</h1>
          <p className="text-muted-foreground">Parcours professionnel complet</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exporter CV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <div>
                <CardTitle>M. KOFFI Yao</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enseignant Mathématiques • Certifié • Depuis 2019
                </p>
              </div>
            </div>
            <Badge variant="default" className="text-base">
              6 ans ancienneté
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ancienneté</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6 ans</div>
            <p className="text-xs text-muted-foreground">Depuis 2019</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotions</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-xs text-muted-foreground">Grade actuel: Certifié</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formations</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Certifications obtenues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière Évaluation</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">18/20</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="parcours" className="space-y-6">
        <TabsList>
          <TabsTrigger value="parcours">Parcours</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="parcours">
          <Card>
            <CardHeader>
              <CardTitle>Parcours Professionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Salaire</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcours.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{p.periode}</TableCell>
                      <TableCell>{p.poste}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{p.grade}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{p.salaire} FCFA</TableCell>
                      <TableCell>
                        <Badge variant={p.statut === "En cours" ? "default" : "secondary"}>
                          {p.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <div className="grid gap-6">
            {promotions.map((p, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Promotion
                    </CardTitle>
                    <Badge variant="default">{p.augmentation}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="text-lg font-semibold">{p.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">De</p>
                      <Badge variant="outline" className="text-base">
                        {p.ancien}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">À</p>
                      <Badge variant="default" className="text-base">
                        {p.nouveau}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formations">
          <div className="grid gap-6 md:grid-cols-2">
            {formations.map((f, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{f.titre}</CardTitle>
                    {f.certificat && (
                      <Badge variant="default" className="gap-1">
                        <Award className="h-3 w-3" />
                        Certifié
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Organisme</span>
                      <span className="font-medium">{f.organisme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Année</span>
                      <span className="font-medium">{f.annee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Durée</span>
                      <span className="font-medium">{f.duree}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>Évaluations Annuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Appréciation</TableHead>
                    <TableHead>Évaluateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((e, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{e.annee}</TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${
                          e.note >= 16 ? "text-green-600" :
                          e.note >= 14 ? "text-blue-600" :
                          "text-yellow-600"
                        }`}>
                          {e.note}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          e.appreciation === "Excellent" ? "default" :
                          e.appreciation === "Très Bien" ? "secondary" :
                          "outline"
                        }>
                          {e.appreciation}
                        </Badge>
                      </TableCell>
                      <TableCell>{e.evaluateur}</TableCell>
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
}
