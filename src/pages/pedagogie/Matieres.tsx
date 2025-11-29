import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Edit, Trash2, Search, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const matieres = [
  { id: 1, nom: "Mathématiques", code: "MATH", cycle: "Lycée", coefficient: 7, heuresHebdo: 8, type: "Scientifique", obligatoire: true },
  { id: 2, nom: "Physique-Chimie", code: "PC", cycle: "Lycée", coefficient: 6, heuresHebdo: 7, type: "Scientifique", obligatoire: true },
  { id: 3, nom: "SVT", code: "SVT", cycle: "Lycée", coefficient: 5, heuresHebdo: 5, type: "Scientifique", obligatoire: true },
  { id: 4, nom: "Français", code: "FR", cycle: "Lycée", coefficient: 4, heuresHebdo: 6, type: "Littéraire", obligatoire: true },
  { id: 5, nom: "Anglais", code: "ANG", cycle: "Lycée", coefficient: 3, heuresHebdo: 4, type: "Linguistique", obligatoire: true },
  { id: 6, nom: "Histoire-Géographie", code: "HG", cycle: "Lycée", coefficient: 2, heuresHebdo: 4, type: "Humanités", obligatoire: true },
  { id: 7, nom: "EPS", code: "EPS", cycle: "Lycée", coefficient: 2, heuresHebdo: 3, type: "Sport", obligatoire: true },
  { id: 8, nom: "Philosophie", code: "PHILO", cycle: "Lycée", coefficient: 5, heuresHebdo: 4, type: "Humanités", obligatoire: true },
];

const programmes = [
  { matiere: "Mathématiques Tle D", chapitres: 12, progression: 75, heuresRestantes: 24 },
  { matiere: "Physique-Chimie Tle D", chapitres: 10, progression: 68, heuresRestantes: 28 },
  { matiere: "SVT 1ère D", chapitres: 8, progression: 82, heuresRestantes: 15 },
  { matiere: "Français 2nde", chapitres: 15, progression: 55, heuresRestantes: 35 },
];

export default function Matieres() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matières & Programmes</h1>
          <p className="text-muted-foreground">Gestion des disciplines et contenus pédagogiques</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Matière
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matières Total</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Tous cycles confondus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programmes Actifs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">Matière-Niveau</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Totales</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">782h</div>
            <p className="text-xs text-muted-foreground">Par semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-green-600">+8% vs trimestre dernier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matieres" className="space-y-6">
        <TabsList>
          <TabsTrigger value="matieres">Matières</TabsTrigger>
          <TabsTrigger value="programmes">Programmes</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
        </TabsList>

        <TabsContent value="matieres">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Matières</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher une matière..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Heures/sem</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matieres.map((matiere) => (
                    <TableRow key={matiere.id}>
                      <TableCell className="font-medium">{matiere.nom}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{matiere.code}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{matiere.cycle}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{matiere.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-base px-3">{matiere.coefficient}</Badge>
                      </TableCell>
                      <TableCell>{matiere.heuresHebdo}h</TableCell>
                      <TableCell>
                        <Badge variant={matiere.obligatoire ? "default" : "secondary"}>
                          {matiere.obligatoire ? "Obligatoire" : "Optionnelle"}
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
        </TabsContent>

        <TabsContent value="programmes">
          <Card>
            <CardHeader>
              <CardTitle>Progression des Programmes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {programmes.map((prog, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{prog.matiere}</CardTitle>
                        <Badge variant="outline">{prog.chapitres} chapitres</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Progression</span>
                          <span className="text-lg font-bold">{prog.progression}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              prog.progression >= 75 ? "bg-green-500" :
                              prog.progression >= 50 ? "bg-blue-500" :
                              "bg-orange-500"
                            }`}
                            style={{ width: `${prog.progression}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Heures restantes: {prog.heuresRestantes}h</span>
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-3 w-3" />
                            Voir Programme
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horaires">
          <Card>
            <CardHeader>
              <CardTitle>Répartition Horaire Hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { categorie: "Sciences", heures: 25, percent: 32, color: "bg-blue-500" },
                  { categorie: "Littérature", heures: 18, percent: 23, color: "bg-purple-500" },
                  { categorie: "Langues", heures: 15, percent: 19, color: "bg-green-500" },
                  { categorie: "Humanités", heures: 12, percent: 15, color: "bg-yellow-500" },
                  { categorie: "Sport & Arts", heures: 8, percent: 11, color: "bg-orange-500" },
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                        <span className="font-medium">{cat.categorie}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{cat.heures}h</span>
                        <Badge variant="outline">{cat.percent}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={cat.color} style={{ width: `${cat.percent}%`, height: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
