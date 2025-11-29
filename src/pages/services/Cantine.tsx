import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Utensils, Users, TrendingUp, Calendar, CheckCircle, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const menusJournaliers = [
  { jour: "Lundi", entree: "Salade verte", plat: "Poulet braisé + Riz", dessert: "Fruits", participants: 285 },
  { jour: "Mardi", entree: "Soupe de légumes", plat: "Poisson + Attiéké", dessert: "Yaourt", participants: 290 },
  { jour: "Mercredi", entree: "Salade de tomates", plat: "Spaghetti bolognaise", dessert: "Gâteau", participants: 275 },
  { jour: "Jeudi", entree: "Alloco", plat: "Riz au gras", dessert: "Banane", participants: 295 },
  { jour: "Vendredi", entree: "Salade mixte", plat: "Poulet + Frites", dessert: "Fruits", participants: 300 },
];

const inscrits = [
  { id: 1, nom: "KOUAME Koffi", classe: "6ème A", formule: "Annuelle", montant: 120000, paye: 120000, statut: "Soldé" },
  { id: 2, nom: "DIALLO Aissatou", classe: "5ème B", formule: "Trimestrielle", montant: 45000, paye: 30000, statut: "Partiel" },
  { id: 3, nom: "TRAORE Mohamed", classe: "4ème A", formule: "Annuelle", montant: 120000, paye: 0, statut: "Impayé" },
  { id: 4, nom: "KONE Aminata", classe: "3ème C", formule: "Mensuelle", montant: 12000, paye: 12000, statut: "Soldé" },
];

const Cantine = () => {
  const totalInscrits = inscrits.length;
  const participationMoyenne = menusJournaliers.reduce((sum, m) => sum + m.participants, 0) / menusJournaliers.length;
  const totalDu = inscrits.reduce((sum, i) => sum + i.montant, 0);
  const totalPaye = inscrits.reduce((sum, i) => sum + i.paye, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gestion de la Cantine</h1>
          <p className="text-muted-foreground mt-2">Menus, inscriptions, présences et paiements</p>
        </div>
        <Button>
          <Utensils className="mr-2 h-4 w-4" />
          Nouveau Menu
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInscrits}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(participationMoyenne)}</div>
            <Progress value={(participationMoyenne / 300) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Par jour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaye.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">Sur {totalDu.toLocaleString()} F</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Recouvrement</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((totalPaye / totalDu) * 100).toFixed(0)}%</div>
            <Progress value={(totalPaye / totalDu) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menus" className="space-y-4">
        <TabsList>
          <TabsTrigger value="menus">Menus de la Semaine</TabsTrigger>
          <TabsTrigger value="inscrits">Élèves Inscrits</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="menus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning Hebdomadaire</CardTitle>
              <CardDescription>Menus et participation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Entrée</TableHead>
                    <TableHead>Plat Principal</TableHead>
                    <TableHead>Dessert</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menusJournaliers.map((menu) => (
                    <TableRow key={menu.jour}>
                      <TableCell className="font-bold">{menu.jour}</TableCell>
                      <TableCell>{menu.entree}</TableCell>
                      <TableCell className="font-medium">{menu.plat}</TableCell>
                      <TableCell>{menu.dessert}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{menu.participants}</Badge>
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

          <div className="grid gap-4 md:grid-cols-7">
            {menusJournaliers.map((menu) => (
              <Card key={menu.jour} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {menu.jour}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Entrée</div>
                    <div className="text-sm font-medium">{menu.entree}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Plat</div>
                    <div className="text-sm font-medium">{menu.plat}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Dessert</div>
                    <div className="text-sm font-medium">{menu.dessert}</div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Participants</div>
                    <Badge>{menu.participants}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inscrits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Inscrits</CardTitle>
              <CardDescription>Élèves abonnés à la cantine</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Formule</TableHead>
                    <TableHead>Montant Dû</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Reste</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inscrits.map((inscrit) => {
                    const reste = inscrit.montant - inscrit.paye;
                    return (
                      <TableRow key={inscrit.id}>
                        <TableCell className="font-medium">{inscrit.nom}</TableCell>
                        <TableCell>{inscrit.classe}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{inscrit.formule}</Badge>
                        </TableCell>
                        <TableCell>{inscrit.montant.toLocaleString()} F</TableCell>
                        <TableCell className="text-green-600 font-medium">{inscrit.paye.toLocaleString()} F</TableCell>
                        <TableCell className={reste > 0 ? "text-orange-600 font-medium" : ""}>{reste.toLocaleString()} F</TableCell>
                        <TableCell>
                          <Badge variant={
                            inscrit.statut === "Soldé" ? "default" :
                            inscrit.statut === "Partiel" ? "secondary" :
                            "destructive"
                          }>
                            {inscrit.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Gérer</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Participation par Jour</CardTitle>
                <CardDescription>Affluence hebdomadaire</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {menusJournaliers.map((menu) => (
                  <div key={menu.jour} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{menu.jour}</span>
                      <span className="text-sm font-bold">{menu.participants} élèves</span>
                    </div>
                    <Progress value={(menu.participants / 300) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition Paiements</CardTitle>
                <CardDescription>Statuts des inscriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Soldés</span>
                    <Badge variant="default">2 élèves</Badge>
                  </div>
                  <Progress value={50} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Partiels</span>
                    <Badge variant="secondary">1 élève</Badge>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Impayés</span>
                    <Badge variant="destructive">1 élève</Badge>
                  </div>
                  <Progress value={25} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cantine;
