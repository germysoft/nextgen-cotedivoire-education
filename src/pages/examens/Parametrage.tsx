import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, Calendar, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockExamens = [
  { id: 1, type: "BEPC", annee: "2024-2025", session: "Session 1", niveau: "National", statut: "En cours", nbCandidats: 250 },
  { id: 2, type: "BAC", annee: "2024-2025", session: "Session 1", niveau: "National", statut: "Programmé", nbCandidats: 180 },
  { id: 3, type: "Blanc BEPC", annee: "2024-2025", session: "Mars 2025", niveau: "Interne", statut: "Terminé", nbCandidats: 245 },
];

const mockMatieres = [
  { id: 1, examen: "BEPC", matiere: "Français", coefficient: 3, type: "Écrit", duree: "4h" },
  { id: 2, examen: "BEPC", matiere: "Mathématiques", coefficient: 3, type: "Écrit", duree: "3h" },
  { id: 3, examen: "BEPC", matiere: "Anglais", coefficient: 2, type: "Écrit + Oral", duree: "2h + 15min" },
  { id: 4, examen: "BAC", matiere: "Philosophie", coefficient: 4, type: "Écrit", duree: "4h" },
  { id: 5, examen: "BAC", matiere: "Mathématiques", coefficient: 5, type: "Écrit", duree: "4h" },
];

export default function ParametrageExamens() {
  const [selectedExamen, setSelectedExamen] = useState("BEPC");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Paramétrage des Examens
          </h1>
          <p className="text-muted-foreground mt-1">
            Configuration des examens officiels (BEPC, BAC) et examens blancs
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel Examen
        </Button>
      </div>

      <Tabs defaultValue="examens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="examens">Examens</TabsTrigger>
          <TabsTrigger value="matieres">Matières & Coefficients</TabsTrigger>
          <TabsTrigger value="planning">Planning Officiel</TabsTrigger>
        </TabsList>

        <TabsContent value="examens" className="space-y-4">
          {/* Liste des Examens */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Examens Configurés</CardTitle>
              <CardDescription>
                Gestion des examens nationaux, régionaux et blancs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Candidats</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExamens.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.type}</TableCell>
                      <TableCell>{exam.annee}</TableCell>
                      <TableCell>{exam.session}</TableCell>
                      <TableCell>
                        <Badge variant={exam.niveau === "National" ? "default" : "secondary"}>
                          {exam.niveau}
                        </Badge>
                      </TableCell>
                      <TableCell>{exam.nbCandidats}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            exam.statut === "En cours" ? "default" : 
                            exam.statut === "Terminé" ? "secondary" : 
                            "outline"
                          }
                        >
                          {exam.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
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

          {/* Formulaire de Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration d'un Examen</CardTitle>
              <CardDescription>
                Paramètres généraux de l'examen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'Examen</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bepc">BEPC</SelectItem>
                      <SelectItem value="bac">BAC</SelectItem>
                      <SelectItem value="blanc-bepc">Blanc BEPC</SelectItem>
                      <SelectItem value="blanc-bac">Blanc BAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="regional">Régional</SelectItem>
                      <SelectItem value="interne">Interne (Blanc)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annee">Année Scolaire</Label>
                  <Input id="annee" type="text" defaultValue="2024-2025" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Input id="session" type="text" placeholder="Ex: Session 1, Mars 2025" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="series">Séries / Filières</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toutes">Toutes</SelectItem>
                      <SelectItem value="a1">A1</SelectItem>
                      <SelectItem value="a2">A2</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="d">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-debut">Date de Début</Label>
                  <Input id="date-debut" type="date" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Annuler</Button>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matieres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matières et Coefficients Officiels</CardTitle>
              <CardDescription>
                Configuration des matières par type d'examen avec coefficients DECO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedExamen} onValueChange={setSelectedExamen}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEPC">BEPC</SelectItem>
                    <SelectItem value="BAC">BAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Type d'Épreuve</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMatieres
                    .filter((m) => m.examen === selectedExamen)
                    .map((matiere) => (
                      <TableRow key={matiere.id}>
                        <TableCell className="font-medium">{matiere.matiere}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{matiere.coefficient}</Badge>
                        </TableCell>
                        <TableCell>{matiere.type}</TableCell>
                        <TableCell>{matiere.duree}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une Matière
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planning Officiel des Épreuves
              </CardTitle>
              <CardDescription>
                Calendrier détaillé des examens par matière
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {mockMatieres.slice(0, 3).map((matiere) => (
                    <Card key={matiere.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          {matiere.matiere}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">À programmer</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Heure:</span>
                          <span className="font-medium">-</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durée:</span>
                          <Badge variant="outline" className="text-xs">{matiere.duree}</Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          Programmer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}