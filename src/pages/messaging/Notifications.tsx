import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, User, Calendar, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notifications = [
  { id: 1, type: "Absence", destinataire: "Parents 3ème C", message: "Votre enfant est absent aujourd'hui", date: "15 Déc 2024 09:15", statut: "Envoyé", canal: "SMS" },
  { id: 2, type: "Note", destinataire: "Parents Tle D", message: "Nouveau bulletin disponible", date: "14 Déc 2024 16:30", statut: "Envoyé", canal: "Email" },
  { id: 3, type: "Retard", destinataire: "Parents 1ère A", message: "Retard signalé ce matin", date: "14 Déc 2024 08:30", statut: "Envoyé", canal: "SMS" },
  { id: 4, type: "Paiement", destinataire: "Parents 2nde B", message: "Échéance paiement dans 3 jours", date: "13 Déc 2024 14:00", statut: "Programmé", canal: "SMS + Email" },
];

const parametres = [
  { nom: "Absences", description: "Notification immédiate aux parents", actif: true },
  { nom: "Retards", description: "Alerte après pointage", actif: true },
  { nom: "Nouvelles notes", description: "Quand les notes sont publiées", actif: true },
  { nom: "Paiements en retard", description: "Rappel 3 jours avant échéance", actif: true },
  { nom: "Réunions", description: "Convocations parents", actif: true },
  { nom: "Bulletins disponibles", description: "Notification publication", actif: false },
];

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications Automatiques</h1>
          <p className="text-muted-foreground">Alertes et rappels aux parents</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Envoyer Notification
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envoyées Aujourd'hui</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Notifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programmées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">À venir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Ouverture</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-green-600">SMS lus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,347</div>
            <p className="text-xs text-muted-foreground">Total envoyées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell>
                      <Badge variant="outline">{notif.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {notif.destinataire}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{notif.message}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {notif.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{notif.canal}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notif.statut === "Envoyé" ? "default" : "secondary"}>
                        {notif.statut}
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
            <CardTitle>Paramètres Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parametres.map((param, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor={`notif-${idx}`} className="text-sm font-medium">
                      {param.nom}
                    </Label>
                    <p className="text-xs text-muted-foreground">{param.description}</p>
                  </div>
                  <Switch id={`notif-${idx}`} defaultChecked={param.actif} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Types Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "Absences", count: 45, color: "bg-red-500" },
                { type: "Retards", count: 23, color: "bg-yellow-500" },
                { type: "Notes", count: 38, color: "bg-blue-500" },
                { type: "Paiements", count: 18, color: "bg-green-500" },
              ].map((t, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${t.color}`} />
                    <span className="text-sm">{t.type}</span>
                  </div>
                  <Badge variant="outline">{t.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canaux Utilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { canal: "SMS", count: 1245, percent: 54 },
                { canal: "Email", count: 567, percent: 25 },
                { canal: "App Mobile", count: 483, percent: 21 },
              ].map((c, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.canal}</span>
                    <span className="font-bold">{c.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${c.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de Lecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">94.5%</p>
                <p className="text-sm text-muted-foreground">SMS ouverts</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">87.2%</p>
                <p className="text-sm text-muted-foreground">Emails ouverts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
