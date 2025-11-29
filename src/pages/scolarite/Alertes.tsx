import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, User, Calendar, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const impayes = [
  { eleve: "KOUASSI Jean", classe: "Tle D", montantDu: 450000, moisRetard: 3, derniereRelance: "10 Déc 2024", statut: "Critique" },
  { eleve: "DIALLO Fatoumata", classe: "1ère A", montantDu: 300000, moisRetard: 2, derniereRelance: "12 Déc 2024", statut: "Important" },
  { eleve: "TOURÉ Mohamed", classe: "2nde B", montantDu: 150000, moisRetard: 1, derniereRelance: "14 Déc 2024", statut: "Alerte" },
  { eleve: "SANOGO Aminata", classe: "3ème C", montantDu: 600000, moisRetard: 4, derniereRelance: "08 Déc 2024", statut: "Critique" },
  { eleve: "KONE Ibrahim", classe: "4ème A", montantDu: 225000, moisRetard: 1.5, derniereRelance: "13 Déc 2024", statut: "Alerte" },
];

export default function Alertes() {
  const totalImpayes = impayes.reduce((sum, i) => sum + i.montantDu, 0);
  const critiques = impayes.filter(i => i.statut === "Critique").length;
  const important = impayes.filter(i => i.statut === "Important").length;
  const alertes = impayes.filter(i => i.statut === "Alerte").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes Impayés</h1>
          <p className="text-muted-foreground">Suivi et relances automatiques</p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Envoyer Relances
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impayés</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(totalImpayes / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cas Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{critiques}</div>
            <p className="text-xs text-muted-foreground">+3 mois retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Important</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{important}</div>
            <p className="text-xs text-muted-foreground">2 mois retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{alertes}</div>
            <p className="text-xs text-muted-foreground">1 mois retard</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Impayés</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Montant Dû</TableHead>
                <TableHead>Retard</TableHead>
                <TableHead>Dernière Relance</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {impayes.map((imp, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{imp.eleve}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{imp.classe}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-red-600">
                      {(imp.montantDu / 1000).toFixed(0)}K FCFA
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">
                      {imp.moisRetard} mois
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {imp.derniereRelance}
                    </div>
                  </TableCell>
                  <TableCell>
                    {imp.statut === "Critique" ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Critique
                      </Badge>
                    ) : imp.statut === "Important" ? (
                      <Badge className="gap-1 bg-orange-500">
                        <AlertTriangle className="h-3 w-3" />
                        Important
                      </Badge>
                    ) : (
                      <Badge className="gap-1 bg-yellow-500">
                        <AlertTriangle className="h-3 w-3" />
                        Alerte
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        SMS
                      </Button>
                      <Button size="sm" variant="default">
                        Appeler
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Relances Automatiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">1ère relance</p>
                  <p className="text-sm text-muted-foreground">5 jours après échéance</p>
                </div>
                <Badge variant="default">SMS</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">2ème relance</p>
                  <p className="text-sm text-muted-foreground">15 jours après échéance</p>
                </div>
                <Badge variant="default">SMS + Email</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">3ème relance</p>
                  <p className="text-sm text-muted-foreground">30 jours après échéance</p>
                </div>
                <Badge variant="destructive">Convocation</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique Relances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "14 Déc 2024", type: "SMS", destinataires: 23, statut: "Envoyé" },
                { date: "12 Déc 2024", type: "Email", destinataires: 18, statut: "Envoyé" },
                { date: "10 Déc 2024", type: "SMS", destinataires: 31, statut: "Envoyé" },
                { date: "08 Déc 2024", type: "Convocation", destinataires: 5, statut: "Planifié" },
              ].map((h, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{h.type}</p>
                      <p className="text-xs text-muted-foreground">{h.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{h.destinataires}</Badge>
                    <Badge variant={h.statut === "Envoyé" ? "default" : "secondary"}>
                      {h.statut}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
