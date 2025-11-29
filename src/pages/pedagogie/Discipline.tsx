import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, User, Calendar, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const incidents = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", type: "Retard", date: "15 Déc 2024", gravite: "Légère", sanction: "Avertissement", statut: "Traité" },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", type: "Absence injustifiée", date: "14 Déc 2024", gravite: "Modérée", sanction: "Convocation parents", statut: "En cours" },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", type: "Insolence", date: "13 Déc 2024", gravite: "Grave", sanction: "Exclusion 2 jours", statut: "Traité" },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", type: "Oubli matériel", date: "13 Déc 2024", gravite: "Légère", sanction: "Observation", statut: "Traité" },
];

const sanctions = [
  { type: "Avertissement", count: 45, color: "bg-yellow-500" },
  { type: "Retenue", count: 18, color: "bg-orange-500" },
  { type: "Convocation parents", count: 12, color: "bg-red-500" },
  { type: "Exclusion temporaire", count: 3, color: "bg-red-700" },
];

const conduites = [
  { eleve: "KOUASSI Jean", classe: "Tle D", incidents: 2, note: 16, appreciation: "Bon comportement" },
  { eleve: "DIALLO Fatoumata", classe: "1ère A", incidents: 4, note: 12, appreciation: "Peut mieux faire" },
  { eleve: "TOURÉ Mohamed", classe: "2nde B", incidents: 6, note: 8, appreciation: "Comportement à améliorer" },
  { eleve: "SANOGO Aminata", classe: "3ème C", incidents: 1, note: 18, appreciation: "Excellente conduite" },
];

export default function Discipline() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discipline & Comportement</h1>
          <p className="text-muted-foreground">Gestion des incidents et sanctions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Signaler Incident
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents ce Mois</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+5 vs mois dernier</p>
          </CardContent>
        </Card>
        {sanctions.slice(0, 3).map((s, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.type}</CardTitle>
              <div className={`h-3 w-3 rounded-full ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.count}</div>
              <p className="text-xs text-muted-foreground">Ce trimestre</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
          <TabsTrigger value="conduites">Notes de Conduite</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incidents Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Sanction</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{inc.eleve}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inc.classe}</Badge>
                      </TableCell>
                      <TableCell>{inc.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {inc.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          inc.gravite === "Grave" ? "destructive" :
                          inc.gravite === "Modérée" ? "default" :
                          "secondary"
                        }>
                          {inc.gravite}
                        </Badge>
                      </TableCell>
                      <TableCell>{inc.sanction}</TableCell>
                      <TableCell>
                        <Badge variant={inc.statut === "Traité" ? "default" : "secondary"}>
                          {inc.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sanctions">
          <div className="grid gap-6 md:grid-cols-2">
            {sanctions.map((s, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${s.color}`} />
                      {s.type}
                    </CardTitle>
                    <Badge variant="default" className="text-lg px-3">
                      {s.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Appliquées ce trimestre
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conduites">
          <Card>
            <CardHeader>
              <CardTitle>Notes de Conduite</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Incidents</TableHead>
                    <TableHead>Note de Conduite</TableHead>
                    <TableHead>Appréciation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conduites.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{c.eleve}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        {c.incidents > 0 ? (
                          <Badge variant="destructive">{c.incidents}</Badge>
                        ) : (
                          <span className="text-green-600">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${
                          c.note >= 16 ? "text-green-600" :
                          c.note >= 12 ? "text-blue-600" :
                          "text-red-600"
                        }`}>
                          {c.note}/20
                        </span>
                      </TableCell>
                      <TableCell>{c.appreciation}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
