import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Hash, Plus, RefreshCw, Download, Settings } from "lucide-react";
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

const matriculesRecents = [
  { matricule: "2024-TLE-D-001", eleve: "KOUASSI Jean", classe: "Tle D", date: "15 Déc 2024", statut: "Actif" },
  { matricule: "2024-1ERE-A-045", eleve: "DIALLO Fatoumata", classe: "1ère A", date: "14 Déc 2024", statut: "Actif" },
  { matricule: "2024-2NDE-B-089", eleve: "TOURÉ Mohamed", classe: "2nde B", date: "13 Déc 2024", statut: "Actif" },
  { matricule: "2024-3EME-C-112", eleve: "SANOGO Aminata", classe: "3ème C", date: "12 Déc 2024", statut: "Actif" },
];

export default function Matricule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Génération de Matricules</h1>
          <p className="text-muted-foreground">Identifiants uniques pour chaque élève</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Configuration
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matricules Générés</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">687</div>
            <p className="text-xs text-muted-foreground">Année 2024-2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette Semaine</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-green-600">Nouveaux élèves</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Format</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">AAAA-CLS-NNN</div>
            <p className="text-xs text-muted-foreground">Personnalisable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernier N°</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">687</div>
            <p className="text-xs text-muted-foreground">Compteur global</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Matricules Récents</CardTitle>
            <CardDescription>Derniers identifiants générés</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Date Création</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matriculesRecents.map((mat, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {mat.matricule}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium">{mat.eleve}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{mat.classe}</Badge>
                    </TableCell>
                    <TableCell>{mat.date}</TableCell>
                    <TableCell>
                      <Badge variant="default">{mat.statut}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Générer Nouveau Matricule</CardTitle>
            <CardDescription>Attribution automatique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="annee">Année Scolaire</Label>
              <Select defaultValue="2024">
                <SelectTrigger id="annee">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024-2025</SelectItem>
                  <SelectItem value="2023">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classe">Classe</Label>
              <Select>
                <SelectTrigger id="classe">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tle-d">Tle D</SelectItem>
                  <SelectItem value="1ere-a">1ère A</SelectItem>
                  <SelectItem value="2nde-b">2nde B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm font-mono">2024-TLE-D-688</code>
              </div>
              <p className="text-xs text-muted-foreground">
                Aperçu du prochain matricule
              </p>
            </div>

            <Button className="w-full">
              <Hash className="mr-2 h-4 w-4" />
              Générer Matricule
            </Button>

            <Button variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Génération en Lot
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration du Format</CardTitle>
          <CardDescription>Personnaliser le modèle de matricule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Préfixe</Label>
              <Input defaultValue="2024" placeholder="Ex: 2024" />
              <p className="text-xs text-muted-foreground">Année scolaire</p>
            </div>
            <div className="space-y-2">
              <Label>Séparateur</Label>
              <Input defaultValue="-" placeholder="Ex: -" />
              <p className="text-xs text-muted-foreground">Caractère de séparation</p>
            </div>
            <div className="space-y-2">
              <Label>Longueur Numéro</Label>
              <Input type="number" defaultValue="3" placeholder="Ex: 3" />
              <p className="text-xs text-muted-foreground">Nombre de chiffres (001, 002...)</p>
            </div>
            <div className="space-y-2">
              <Label>Inclure Classe</Label>
              <Select defaultValue="oui">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">Réinitialiser</Button>
            <Button>Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
