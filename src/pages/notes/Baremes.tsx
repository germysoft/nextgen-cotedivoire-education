import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const baremes = [
  { id: 1, cycle: "Collège", niveau: "6ème-3ème", notation: "/20", composantes: "Devoir: 40%, Compo: 60%", bonus: "Oui", conduite: "Oui" },
  { id: 2, cycle: "Lycée", niveau: "2nde", notation: "/20", composantes: "Devoir: 30%, Compo: 70%", bonus: "Oui", conduite: "Oui" },
  { id: 3, cycle: "Lycée", niveau: "1ère-Tle", notation: "/20", composantes: "Devoir: 25%, Compo: 75%", bonus: "Non", conduite: "Oui" },
  { id: 4, cycle: "Primaire", niveau: "CP-CM2", notation: "/10", composantes: "Devoir: 50%, Compo: 50%", bonus: "Oui", conduite: "Non" },
];

const coefficients = [
  { matiere: "Mathématiques", classe: "Tle D", coefficient: 7, type: "Scientifique" },
  { matiere: "Physique-Chimie", classe: "Tle D", coefficient: 6, type: "Scientifique" },
  { matiere: "SVT", classe: "Tle D", coefficient: 5, type: "Scientifique" },
  { matiere: "Français", classe: "Tle D", coefficient: 4, type: "Littéraire" },
  { matiere: "Anglais", classe: "Tle D", coefficient: 3, type: "Linguistique" },
  { matiere: "Histoire-Géo", classe: "Tle D", coefficient: 2, type: "Humanités" },
  { matiere: "EPS", classe: "Tle D", coefficient: 2, type: "Sport" },
];

const mentions = [
  { nom: "Excellent", min: 16, max: 20, color: "bg-green-500" },
  { nom: "Très Bien", min: 14, max: 15.99, color: "bg-blue-500" },
  { nom: "Bien", min: 12, max: 13.99, color: "bg-cyan-500" },
  { nom: "Assez Bien", min: 10, max: 11.99, color: "bg-yellow-500" },
  { nom: "Passable", min: 8, max: 9.99, color: "bg-orange-500" },
  { nom: "Insuffisant", min: 0, max: 7.99, color: "bg-red-500" },
];

export default function Baremes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration des Barèmes</h1>
          <p className="text-muted-foreground">Système de notation, coefficients et mentions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Barème
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barèmes par Cycle</CardTitle>
          <CardDescription>Configuration de la notation et de la composition des notes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cycle</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Notation</TableHead>
                <TableHead>Composantes</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Note Conduite</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baremes.map((bareme) => (
                <TableRow key={bareme.id}>
                  <TableCell>
                    <Badge variant="outline">{bareme.cycle}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{bareme.niveau}</TableCell>
                  <TableCell>
                    <Badge>{bareme.notation}</Badge>
                  </TableCell>
                  <TableCell>{bareme.composantes}</TableCell>
                  <TableCell>
                    <Badge variant={bareme.bonus === "Oui" ? "default" : "secondary"}>
                      {bareme.bonus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bareme.conduite === "Oui" ? "default" : "secondary"}>
                      {bareme.conduite}
                    </Badge>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coefficients par Matière</CardTitle>
            <CardDescription>Exemple: Classe Tle D</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matière</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Coefficient</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coefficients.map((coef, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{coef.matiere}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{coef.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="text-lg px-3">
                        {coef.coefficient}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={2}>TOTAL COEFFICIENTS</TableCell>
                  <TableCell className="text-center text-lg">
                    {coefficients.reduce((sum, c) => sum + c.coefficient, 0)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Échelle des Mentions</CardTitle>
            <CardDescription>Barème des mentions pour les bulletins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mentions.map((mention, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${mention.color}`} />
                    <div>
                      <p className="font-medium">{mention.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {mention.min} - {mention.max}/20
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer un Nouveau Barème</CardTitle>
          <CardDescription>Configurer un barème de notation personnalisé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cycle">Cycle</Label>
                <Select>
                  <SelectTrigger id="cycle">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primaire">Primaire</SelectItem>
                    <SelectItem value="college">Collège</SelectItem>
                    <SelectItem value="lycee">Lycée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="niveau">Niveau</Label>
                <Input id="niveau" placeholder="Ex: 6ème-3ème" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notation">Notation</Label>
                <Select>
                  <SelectTrigger id="notation">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">/5</SelectItem>
                    <SelectItem value="10">/10</SelectItem>
                    <SelectItem value="20">/20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="devoir">Pourcentage Devoirs (%)</Label>
                <Input id="devoir" type="number" placeholder="40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compo">Pourcentage Composition (%)</Label>
                <Input id="compo" type="number" placeholder="60" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bonus">Points Bonus</Label>
                <Select>
                  <SelectTrigger id="bonus">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conduite">Note de Conduite</Label>
                <Select>
                  <SelectTrigger id="conduite">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="participation">Note Participation</Label>
                <Select>
                  <SelectTrigger id="participation">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Annuler</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
