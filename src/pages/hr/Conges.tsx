import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Search, Plus, CheckCircle, XCircle, Clock,
  User, AlertCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const conges = [
  { id: 1, employe: "M. KOFFI Yao", poste: "Enseignant Math", type: "Congé Annuel", dateDebut: "20 Déc 2024", dateFin: "05 Jan 2025", jours: 12, statut: "Approuvé", remplacement: "M. DIABY" },
  { id: 2, employe: "Mme DIALLO Fatoumata", poste: "Enseignant Français", type: "Congé Maladie", dateDebut: "15 Déc 2024", dateFin: "18 Déc 2024", jours: 3, statut: "Approuvé", remplacement: "Mme SANOGO" },
  { id: 3, employe: "M. TOURÉ Mohamed", poste: "Enseignant Physique", type: "Congé Annuel", dateDebut: "22 Déc 2024", dateFin: "08 Jan 2025", jours: 14, statut: "En attente", remplacement: null },
  { id: 4, employe: "Mme BAMBA Sarah", poste: "Secrétaire", type: "Congé Maternité", dateDebut: "01 Jan 2025", dateFin: "01 Avr 2025", jours: 90, statut: "Approuvé", remplacement: "Mme YAO" },
  { id: 5, employe: "M. KONE Ibrahim", poste: "Enseignant SVT", type: "Congé Annuel", dateDebut: "18 Déc 2024", dateFin: "20 Déc 2024", jours: 2, statut: "Rejeté", remplacement: null },
];

const absences = [
  { id: 1, employe: "M. KOUADIO Jean", date: "15 Déc 2024", type: "Absence Justifiée", motif: "Rendez-vous médical", justificatif: true },
  { id: 2, employe: "Mme TRAORE Aminata", date: "14 Déc 2024", type: "Absence Non Justifiée", motif: "-", justificatif: false },
  { id: 3, employe: "M. YAO Marcel", date: "13 Déc 2024", type: "Retard", motif: "Embouteillage", justificatif: false },
  { id: 4, employe: "Mme OUATTARA Prisca", date: "12 Déc 2024", type: "Absence Justifiée", motif: "Décès familial", justificatif: true },
];

export default function Conges() {
  const stats = {
    enCours: conges.filter(c => c.statut === "Approuvé" && new Date(c.dateFin) > new Date()).length,
    enAttente: conges.filter(c => c.statut === "En attente").length,
    approuves: conges.filter(c => c.statut === "Approuvé").length,
    rejetes: conges.filter(c => c.statut === "Rejeté").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Congés & Absences</h1>
          <p className="text-muted-foreground">Gestion des demandes et suivi des présences</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Demande
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
            <p className="text-xs text-muted-foreground">Congés actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approuves}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejetes}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="absences">Absences</TabsTrigger>
          <TabsTrigger value="soldes">Soldes de Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="conges">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Demandes de Congés</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Jours</TableHead>
                    <TableHead>Remplacement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conges.map((conge) => (
                    <TableRow key={conge.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{conge.employe}</span>
                        </div>
                      </TableCell>
                      <TableCell>{conge.poste}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{conge.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <span>Du {conge.dateDebut}</span>
                          <span className="text-muted-foreground">Au {conge.dateFin}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{conge.jours} jours</Badge>
                      </TableCell>
                      <TableCell>
                        {conge.remplacement ? (
                          <span className="text-sm">{conge.remplacement}</span>
                        ) : (
                          <Badge variant="secondary">Non assigné</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {conge.statut === "Approuvé" && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Approuvé
                          </Badge>
                        )}
                        {conge.statut === "En attente" && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            En attente
                          </Badge>
                        )}
                        {conge.statut === "Rejeté" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Rejeté
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {conge.statut === "En attente" && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="default">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="absences">
          <Card>
            <CardHeader>
              <CardTitle>Absences & Retards Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Justificatif</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">{absence.employe}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {absence.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          absence.type === "Absence Non Justifiée" ? "destructive" :
                          absence.type === "Retard" ? "default" :
                          "secondary"
                        }>
                          {absence.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{absence.motif}</TableCell>
                      <TableCell>
                        {absence.justificatif ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Oui
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Non
                          </Badge>
                        )}
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
        </TabsContent>

        <TabsContent value="soldes">
          <Card>
            <CardHeader>
              <CardTitle>Soldes de Congés par Employé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { nom: "M. KOFFI Yao", acquis: 30, pris: 14, solde: 16 },
                  { nom: "Mme DIALLO Fatoumata", acquis: 30, pris: 8, solde: 22 },
                  { nom: "M. TOURÉ Mohamed", acquis: 30, pris: 5, solde: 25 },
                  { nom: "Mme BAMBA Sarah", acquis: 30, pris: 90, solde: -60 },
                  { nom: "M. KONE Ibrahim", acquis: 30, pris: 12, solde: 18 },
                ].map((solde, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{solde.nom}</span>
                        <Badge variant={solde.solde >= 15 ? "default" : solde.solde >= 0 ? "secondary" : "destructive"}>
                          Solde: {solde.solde} jours
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 rounded-lg bg-blue-50">
                          <p className="text-xs text-muted-foreground">Acquis</p>
                          <p className="text-lg font-bold text-blue-600">{solde.acquis}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-orange-50">
                          <p className="text-xs text-muted-foreground">Pris</p>
                          <p className="text-lg font-bold text-orange-600">{solde.pris}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-green-50">
                          <p className="text-xs text-muted-foreground">Restant</p>
                          <p className={`text-lg font-bold ${solde.solde >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {solde.solde}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
