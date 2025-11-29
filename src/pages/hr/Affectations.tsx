import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, TrendingUp, Award, Calendar, Search } from "lucide-react";
import { toast } from "sonner";

const affectations = [
  { id: 1, nom: "KOUASSI Jean", poste: "Professeur Mathématiques", classe: "3ème A, B", statut: "active", date_debut: "2024-09-01", anciennete: "5 ans" },
  { id: 2, nom: "DIALLO Fatou", poste: "Professeur Français", classe: "4ème A, 5ème B", statut: "active", date_debut: "2023-09-01", anciennete: "2 ans" },
  { id: 3, nom: "TRAORE Mamadou", poste: "Professeur Physique", classe: "Terminale S", statut: "active", date_debut: "2022-09-01", anciennete: "3 ans" },
  { id: 4, nom: "KONE Marie", poste: "Professeur Anglais", classe: "6ème A, B, C", statut: "active", date_debut: "2024-01-15", anciennete: "1 an" },
];

const promotions = [
  { id: 1, nom: "SORO Ibrahim", ancien_poste: "Surveillant", nouveau_poste: "Censeur Adjoint", date: "2024-09-01", raison: "Mérite" },
  { id: 2, nom: "BAMBA Aya", ancien_poste: "Prof. Français", nouveau_poste: "Prof. Principal 3ème", date: "2024-09-01", raison: "Ancienneté" },
];

const evaluations = [
  { id: 1, nom: "KOUASSI Jean", poste: "Prof. Maths", note: 18, date: "2024-06-15", commentaire: "Excellent pédagogue" },
  { id: 2, nom: "DIALLO Fatou", poste: "Prof. Français", note: 16, date: "2024-06-15", commentaire: "Très bon engagement" },
  { id: 3, nom: "TRAORE Mamadou", poste: "Prof. Physique", note: 17, date: "2024-06-15", commentaire: "Très investi" },
];

const Affectations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewAffectation = () => {
    toast.success("Nouvelle affectation créée avec succès");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Affectations & Promotions</h1>
          <p className="text-muted-foreground mt-2">Gestion des affectations, promotions et évaluations du personnel</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvelle Affectation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Affectation</DialogTitle>
              <DialogDescription>Affecter un membre du personnel à un poste</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Personnel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">KOUASSI Jean</SelectItem>
                      <SelectItem value="2">DIALLO Fatou</SelectItem>
                      <SelectItem value="3">TRAORE Mamadou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prof">Professeur</SelectItem>
                      <SelectItem value="censeur">Censeur</SelectItem>
                      <SelectItem value="surveillant">Surveillant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matière</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maths">Mathématiques</SelectItem>
                      <SelectItem value="francais">Français</SelectItem>
                      <SelectItem value="anglais">Anglais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Classes</Label>
                  <Input placeholder="Ex: 3ème A, B" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleNewAffectation}>Créer l'Affectation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affectations Actives</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affectations.length}</div>
            <p className="text-xs text-muted-foreground">Personnel en poste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotions Annuelles</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
            <p className="text-xs text-muted-foreground">Complétées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17/20</div>
            <p className="text-xs text-muted-foreground">Évaluation personnel</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="affectations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affectations">Affectations</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="affectations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Affectations</CardTitle>
                  <CardDescription>Personnel actuellement en poste</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Date Début</TableHead>
                    <TableHead>Ancienneté</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affectations.map((affectation) => (
                    <TableRow key={affectation.id}>
                      <TableCell className="font-medium">{affectation.nom}</TableCell>
                      <TableCell>{affectation.poste}</TableCell>
                      <TableCell>{affectation.classe}</TableCell>
                      <TableCell>{affectation.date_debut}</TableCell>
                      <TableCell>{affectation.anciennete}</TableCell>
                      <TableCell>
                        <Badge variant="default">Actif</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Promotions</CardTitle>
              <CardDescription>Évolution de carrière du personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ancien Poste</TableHead>
                    <TableHead>Nouveau Poste</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.nom}</TableCell>
                      <TableCell>{promotion.ancien_poste}</TableCell>
                      <TableCell>
                        <Badge variant="default">{promotion.nouveau_poste}</Badge>
                      </TableCell>
                      <TableCell>{promotion.date}</TableCell>
                      <TableCell>{promotion.raison}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Détails</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évaluations du Personnel</CardTitle>
              <CardDescription>Performances et évaluations annuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.nom}</TableCell>
                      <TableCell>{evaluation.poste}</TableCell>
                      <TableCell>
                        <Badge variant={evaluation.note >= 16 ? "default" : "secondary"}>
                          {evaluation.note}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>{evaluation.commentaire}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Voir Détails</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Affectations;
