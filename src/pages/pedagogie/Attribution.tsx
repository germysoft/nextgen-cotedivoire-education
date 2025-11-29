import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, BookOpen, Calendar, Edit, Trash2 } from "lucide-react";
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

const attributions = [
  { id: 1, enseignant: "M. KOFFI Yao", matiere: "Mathématiques", classe: "Tle D", heures: 8, statut: "Actif", profPrincipal: true },
  { id: 2, enseignant: "Mme DIALLO Fatoumata", matiere: "Français", classe: "1ère A", heures: 6, statut: "Actif", profPrincipal: true },
  { id: 3, enseignant: "M. TOURÉ Mohamed", matiere: "Physique-Chimie", classe: "Tle D", heures: 7, statut: "Actif", profPrincipal: false },
  { id: 4, enseignant: "M. TOURÉ Mohamed", matiere: "Physique-Chimie", classe: "1ère C", heures: 6, statut: "Actif", profPrincipal: false },
  { id: 5, enseignant: "Mme SANOGO Aminata", matiere: "Anglais", classe: "2nde B", heures: 5, statut: "Actif", profPrincipal: false },
  { id: 6, enseignant: "M. KONE Ibrahim", matiere: "SVT", classe: "3ème C", heures: 4, statut: "Actif", profPrincipal: true },
  { id: 7, enseignant: "Mme BAMBA Sarah", matiere: "Histoire-Géo", classe: "Tle A", heures: 4, statut: "Actif", profPrincipal: false },
  { id: 8, enseignant: "M. YAO Jean", matiere: "EPS", classe: "6ème B", heures: 3, statut: "Actif", profPrincipal: false },
];

const enseignants = [
  { nom: "M. KOFFI Yao", matieres: ["Mathématiques"], heuresMax: 18, heuresAffectees: 16, classes: 3 },
  { nom: "Mme DIALLO Fatoumata", matieres: ["Français"], heuresMax: 18, heuresAffectees: 18, classes: 3 },
  { nom: "M. TOURÉ Mohamed", matieres: ["Physique-Chimie"], heuresMax: 20, heuresAffectees: 19, classes: 4 },
  { nom: "Mme SANOGO Aminata", matieres: ["Anglais"], heuresMax: 18, heuresAffectees: 15, classes: 3 },
  { nom: "M. KONE Ibrahim", matieres: ["SVT"], heuresMax: 18, heuresAffectees: 12, classes: 2 },
];

export default function Attribution() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attribution des Enseignants</h1>
          <p className="text-muted-foreground">Affectation des professeurs aux matières et classes</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Attribution
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Actifs cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attributions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Matière-Classe</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">782h</div>
            <p className="text-xs text-muted-foreground">Par semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Affectation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.3%</div>
            <p className="text-xs text-green-600">+5% vs année précédente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Attributions</CardTitle>
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
                    <SelectItem value="tle">Terminale</SelectItem>
                    <SelectItem value="1ere">Première</SelectItem>
                    <SelectItem value="2nde">Seconde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Heures/sem</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attributions.map((attr) => (
                  <TableRow key={attr.id}>
                    <TableCell className="font-medium">{attr.enseignant}</TableCell>
                    <TableCell>{attr.matiere}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{attr.classe}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {attr.heures}h
                      </div>
                    </TableCell>
                    <TableCell>
                      {attr.profPrincipal ? (
                        <Badge variant="default">Prof Principal</Badge>
                      ) : (
                        <Badge variant="secondary">Enseignant</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Charge Horaire Enseignants</CardTitle>
            <CardDescription>Heures hebdomadaires affectées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enseignants.map((ens, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{ens.nom}</span>
                    <span className={`font-bold ${
                      ens.heuresAffectees >= ens.heuresMax ? "text-green-600" : "text-orange-600"
                    }`}>
                      {ens.heuresAffectees}/{ens.heuresMax}h
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        ens.heuresAffectees >= ens.heuresMax ? "bg-green-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${(ens.heuresAffectees / ens.heuresMax) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{ens.matieres.join(", ")}</span>
                    <span>{ens.classes} classes</span>
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
