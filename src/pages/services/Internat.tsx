import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bed, Search, Plus, Users, DollarSign, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pensionnaires = [
  { id: 1, nom: "KOUASSI Jean", classe: "Tle D", chambre: "A-12", lit: "3", dateDebut: "01 Sept 2024", paiement: "À jour", statut: "Actif" },
  { id: 2, nom: "DIALLO Fatoumata", classe: "1ère A", chambre: "B-08", lit: "2", dateDebut: "01 Sept 2024", paiement: "En retard", statut: "Actif" },
  { id: 3, nom: "TOURÉ Mohamed", classe: "2nde B", chambre: "A-15", lit: "1", dateDebut: "01 Sept 2024", paiement: "À jour", statut: "Actif" },
  { id: 4, nom: "SANOGO Aminata", classe: "3ème C", chambre: "B-12", lit: "4", dateDebut: "01 Sept 2024", paiement: "À jour", statut: "Actif" },
];

const chambres = [
  { numero: "A-12", batiment: "A", capacite: 4, occupes: 4, disponibles: 0, type: "Garçons" },
  { numero: "A-15", batiment: "A", capacite: 4, occupes: 3, disponibles: 1, type: "Garçons" },
  { numero: "B-08", batiment: "B", capacite: 4, occupes: 4, disponibles: 0, type: "Filles" },
  { numero: "B-12", batiment: "B", capacite: 4, occupes: 2, disponibles: 2, type: "Filles" },
];

export default function Internat() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion de l'Internat</h1>
          <p className="text-muted-foreground">Suivi des pensionnaires et affectations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Pensionnaire
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pensionnaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Inscrits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chambres</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">4 lits par chambre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Occupation</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.9%</div>
            <p className="text-xs text-green-600">4 places disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes Mois</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Pensionnaires</CardTitle>
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Lit</TableHead>
                  <TableHead>Date Début</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pensionnaires.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nom}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.classe}</Badge>
                    </TableCell>
                    <TableCell>{p.chambre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Lit {p.lit}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {p.dateDebut}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.paiement === "À jour" ? "default" : "destructive"}>
                        {p.paiement}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{p.statut}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disponibilité Chambres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chambres.map((ch, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{ch.numero}</p>
                        <p className="text-sm text-muted-foreground">Bâtiment {ch.batiment}</p>
                      </div>
                      <Badge variant="outline">{ch.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 rounded-lg bg-blue-50">
                        <p className="text-xs text-muted-foreground">Occupés</p>
                        <p className="font-bold text-blue-600">{ch.occupes}/{ch.capacite}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-green-50">
                        <p className="text-xs text-muted-foreground">Libres</p>
                        <p className="font-bold text-green-600">{ch.disponibles}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
