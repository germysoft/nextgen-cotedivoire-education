import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Plus, Eye, Download, CheckCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const conseils = [
  { id: 1, classe: "Tle D", date: "15 Déc 2024", heure: "14:00", profPrincipal: "M. KOFFI", participants: 12, pvGenere: true, statut: "Complété" },
  { id: 2, classe: "1ère A", date: "16 Déc 2024", heure: "15:00", profPrincipal: "Mme DIALLO", participants: 11, pvGenere: true, statut: "Complété" },
  { id: 3, classe: "2nde B", date: "18 Déc 2024", heure: "14:30", profPrincipal: "M. TOURÉ", participants: 0, pvGenere: false, statut: "Planifié" },
  { id: 4, classe: "3ème C", date: "19 Déc 2024", heure: "16:00", profPrincipal: "M. KONE", participants: 0, pvGenere: false, statut: "Planifié" },
  { id: 5, classe: "Tle A", date: "20 Déc 2024", heure: "14:00", profPrincipal: "Mme BAMBA", participants: 0, pvGenere: false, statut: "Planifié" },
  { id: 6, classe: "6ème B", date: "17 Déc 2024", heure: "15:30", profPrincipal: "M. YAO", participants: 9, pvGenere: false, statut: "En cours" },
];

const deliberations = [
  { eleve: "KOUASSI Jean", moyenne: 14.5, rang: 3, decision: "Admis", mention: "Bien", observations: "Excellent trimestre, encourage à poursuivre" },
  { eleve: "DIALLO Fatoumata", moyenne: 16.2, rang: 1, decision: "Admis", mention: "Très Bien", observations: "Excellents résultats, félicitations" },
  { eleve: "TOURÉ Mohamed", moyenne: 11.8, rang: 15, decision: "Admis", mention: "Assez Bien", observations: "Peut mieux faire en sciences" },
  { eleve: "SANOGO Aminata", moyenne: 8.5, rang: 28, decision: "Passable", mention: "Insuffisant", observations: "Doit redoubler d'efforts" },
];

export default function Conseils() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conseils de Classe</h1>
          <p className="text-muted-foreground">Organisation et délibérations trimestrielles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Planifier Conseil
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conseils</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complétés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-xs text-muted-foreground">PV générés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">9</div>
            <p className="text-xs text-muted-foreground">À venir</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="deliberations">Délibérations</TabsTrigger>
          <TabsTrigger value="pv">Procès-Verbaux</TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Planning des Conseils de Classe</CardTitle>
              <CardDescription>Trimestre 1 - Année scolaire 2024-2025</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Professeur Principal</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>PV</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conseils.map((conseil) => (
                    <TableRow key={conseil.id}>
                      <TableCell>
                        <Badge variant="outline" className="text-base">
                          {conseil.classe}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {conseil.date}
                        </div>
                      </TableCell>
                      <TableCell>{conseil.heure}</TableCell>
                      <TableCell className="font-medium">{conseil.profPrincipal}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {conseil.participants > 0 ? `${conseil.participants} présents` : "Non démarré"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {conseil.pvGenere ? (
                          <Badge variant="default" className="gap-1">
                            <FileText className="h-3 w-3" />
                            Généré
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Non généré</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {conseil.statut === "Complété" && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Complété
                          </Badge>
                        )}
                        {conseil.statut === "En cours" && (
                          <Badge className="gap-1 bg-blue-500">
                            <Clock className="h-3 w-3" />
                            En cours
                          </Badge>
                        )}
                        {conseil.statut === "Planifié" && (
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            Planifié
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {conseil.pvGenere && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliberations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Délibérations - Tle D</CardTitle>
                  <CardDescription>Conseil du 15 Décembre 2024</CardDescription>
                </div>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter Décisions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Rang</TableHead>
                    <TableHead>Décision</TableHead>
                    <TableHead>Mention</TableHead>
                    <TableHead>Observations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliberations.map((delib, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{delib.eleve}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${
                          delib.moyenne >= 14 ? "text-green-600" :
                          delib.moyenne >= 10 ? "text-blue-600" :
                          "text-red-600"
                        }`}>
                          {delib.moyenne}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{delib.rang}°</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          delib.decision === "Admis" ? "default" : "secondary"
                        }>
                          {delib.decision}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          delib.mention === "Très Bien" || delib.mention === "Excellent" ? "default" :
                          delib.mention === "Bien" || delib.mention === "Assez Bien" ? "secondary" :
                          "destructive"
                        }>
                          {delib.mention}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">{delib.observations}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pv">
          <div className="grid gap-6">
            {conseils.filter(c => c.pvGenere).map((conseil) => (
              <Card key={conseil.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Procès-Verbal - {conseil.classe}</CardTitle>
                      <CardDescription>Conseil du {conseil.date} à {conseil.heure}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Consulter
                      </Button>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">Professeur Principal:</span>
                      <span>{conseil.profPrincipal}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">Participants:</span>
                      <span>{conseil.participants} enseignants</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">Document:</span>
                      <Badge variant="default">
                        <FileText className="mr-1 h-3 w-3" />
                        PV_{conseil.classe}_T1.pdf
                      </Badge>
                    </div>
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
