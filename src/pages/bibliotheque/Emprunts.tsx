import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, Plus, AlertCircle, Calendar, User,
  CheckCircle, Clock, TrendingUp, Filter
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emprunts = [
  { id: 1, livre: "Mathématiques Terminale D", code: "MAT-TLE-001", emprunteur: "KOUASSI Jean", classe: "Tle D", dateEmprunt: "01 Déc 2024", dateRetourPrevue: "15 Déc 2024", statut: "En cours", retard: 0 },
  { id: 2, livre: "Le Père Goriot - Balzac", code: "LIT-FRA-045", emprunteur: "DIALLO Fatoumata", classe: "1ère A", dateEmprunt: "28 Nov 2024", dateRetourPrevue: "12 Déc 2024", statut: "En retard", retard: 5 },
  { id: 3, livre: "Physique-Chimie 2nde", code: "PHY-2ND-012", emprunteur: "TOURÉ Mohamed", classe: "2nde B", dateEmprunt: "05 Déc 2024", dateRetourPrevue: "19 Déc 2024", statut: "En cours", retard: 0 },
  { id: 4, livre: "L'Aventure Ambiguë", code: "LIT-AFR-023", emprunteur: "SANOGO Aminata", classe: "3ème C", dateEmprunt: "20 Nov 2024", dateRetourPrevue: "04 Déc 2024", statut: "En retard", retard: 13 },
  { id: 5, livre: "SVT Cycle Collège", code: "SVT-COL-008", emprunteur: "KONE Ibrahim", classe: "4ème A", dateEmprunt: "08 Déc 2024", dateRetourPrevue: "22 Déc 2024", statut: "En cours", retard: 0 },
  { id: 6, livre: "English Grammar in Use", code: "ANG-GRA-019", emprunteur: "BAMBA Sarah", classe: "1ère C", dateEmprunt: "03 Nov 2024", dateRetourPrevue: "17 Nov 2024", statut: "Retourné", retard: 0 },
  { id: 7, livre: "Histoire-Géo Terminale", code: "HIS-TLE-007", emprunteur: "TRAORE Moussa", classe: "Tle A", dateEmprunt: "15 Nov 2024", dateRetourPrevue: "29 Nov 2024", statut: "En retard", retard: 18 },
  { id: 8, livre: "Cahier d'Exercices Maths 6è", code: "MAT-6EM-034", emprunteur: "YAO Prisca", classe: "6ème B", dateEmprunt: "10 Déc 2024", dateRetourPrevue: "24 Déc 2024", statut: "En cours", retard: 0 },
];

const statsRetard = [
  { categorie: "En cours", count: 145, color: "bg-blue-500" },
  { categorie: "En retard (1-7j)", count: 23, color: "bg-yellow-500" },
  { categorie: "Retard important (7j+)", count: 8, color: "bg-red-500" },
  { categorie: "Retournés", count: 412, color: "bg-green-500" },
];

export default function Emprunts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emprunts & Retours</h1>
          <p className="text-muted-foreground">Gestion des prêts de livres et ressources</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Emprunt
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emprunts Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">En circulation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">31</div>
            <p className="text-xs text-muted-foreground">Dont 8 retard important</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retours Aujourd'hui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600">8 déjà retournés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Retour</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-green-600">+2.1% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>État des Emprunts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsRetard.map((stat) => (
                <div key={stat.categorie} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${stat.color}`} />
                      <span className="text-sm">{stat.categorie}</span>
                    </div>
                    <span className="text-sm font-bold">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Emprunts</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-10 w-64" />
                </div>
                <Select defaultValue="tous">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous</SelectItem>
                    <SelectItem value="encours">En cours</SelectItem>
                    <SelectItem value="retard">En retard</SelectItem>
                    <SelectItem value="retourne">Retournés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livre</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Emprunteur</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Date Emprunt</TableHead>
                  <TableHead>Retour Prévu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emprunts.map((emprunt) => (
                  <TableRow key={emprunt.id}>
                    <TableCell className="font-medium">{emprunt.livre}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{emprunt.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {emprunt.emprunteur}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{emprunt.classe}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {emprunt.dateEmprunt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {emprunt.dateRetourPrevue}
                      </div>
                    </TableCell>
                    <TableCell>
                      {emprunt.statut === "En retard" ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Retard {emprunt.retard}j
                        </Badge>
                      ) : emprunt.statut === "Retourné" ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Retourné
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          En cours
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {emprunt.statut !== "Retourné" ? (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Retour
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled>
                          Archivé
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
