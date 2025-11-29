import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, TrendingUp, Download, FileText, Medal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const mockResultats = [
  { 
    rang: 1,
    nom: "TRAORÉ Marie",
    numero: "C2025002",
    moyenne: 18.25,
    mention: "Très Bien",
    photo: "https://images.unsplash.com/photo-1595956246544-e697b3b12ac0?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    rang: 2,
    nom: "KOUASSI Jean",
    numero: "C2025001",
    moyenne: 17.80,
    mention: "Très Bien",
    photo: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    rang: 3,
    nom: "YAO Pascal",
    numero: "C2025003",
    moyenne: 16.45,
    mention: "Bien",
    photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    rang: 4,
    nom: "DIALLO Fatima",
    numero: "C2025004",
    moyenne: 15.20,
    mention: "Bien",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
  },
];

const getMentionColor = (mention: string) => {
  switch (mention) {
    case "Très Bien": return "text-purple-600 bg-purple-100 dark:bg-purple-950";
    case "Bien": return "text-blue-600 bg-blue-100 dark:bg-blue-950";
    case "Assez Bien": return "text-green-600 bg-green-100 dark:bg-green-950";
    case "Passable": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950";
    default: return "";
  }
};

export default function ResultatsExamens() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            Résultats & Classements
          </h1>
          <p className="text-muted-foreground mt-1">
            Publication et analyse des résultats d'examens
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Publier Résultats
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de Réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">92.5%</div>
            <Progress value={92.5} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">235</div>
            <p className="text-xs text-muted-foreground mt-1">sur 254 candidats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mention Très Bien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">48</div>
            <p className="text-xs text-muted-foreground mt-1">20.4% des admis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">14.8/20</div>
            <p className="text-xs text-muted-foreground mt-1">+0.5 vs 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meilleure Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">18.25</div>
            <p className="text-xs text-muted-foreground mt-1">TRAORÉ Marie</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classement">Classement Général</TabsTrigger>
          <TabsTrigger value="classes">Par Classe</TabsTrigger>
          <TabsTrigger value="mentions">Par Mention</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="classement" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Classement Général - BEPC 2025</CardTitle>
                  <CardDescription>Top candidats par ordre de mérite</CardDescription>
                </div>
                <Select defaultValue="tous">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les candidats</SelectItem>
                    <SelectItem value="reguliers">Réguliers uniquement</SelectItem>
                    <SelectItem value="libres">Libres uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rang</TableHead>
                    <TableHead>Candidat</TableHead>
                    <TableHead>N° Candidat</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Mention</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResultats.map((resultat) => (
                    <TableRow key={resultat.numero}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {resultat.rang <= 3 ? (
                            <Medal className={`h-5 w-5 ${
                              resultat.rang === 1 ? "text-yellow-500" :
                              resultat.rang === 2 ? "text-gray-400" :
                              "text-orange-600"
                            }`} />
                          ) : null}
                          <span className="font-bold text-lg">{resultat.rang}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={resultat.photo} />
                            <AvatarFallback>{resultat.nom.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{resultat.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{resultat.numero}</TableCell>
                      <TableCell>
                        <div className="font-bold text-lg">{resultat.moyenne}/20</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMentionColor(resultat.mention)}>
                          {resultat.mention}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-3 w-3" />
                          Relevé
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">3ème A</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Candidats:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admis:</span>
                  <span className="font-medium text-green-600">43</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taux:</span>
                  <Badge className="bg-green-100 text-green-700">95.6%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moyenne:</span>
                  <span className="font-bold">15.2/20</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">3ème B</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Candidats:</span>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admis:</span>
                  <span className="font-medium text-green-600">38</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taux:</span>
                  <Badge className="bg-green-100 text-green-700">90.5%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moyenne:</span>
                  <span className="font-bold">14.5/20</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">3ème C</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Candidats:</span>
                  <span className="font-medium">40</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admis:</span>
                  <span className="font-medium text-green-600">37</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taux:</span>
                  <Badge className="bg-green-100 text-green-700">92.5%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moyenne:</span>
                  <span className="font-bold">14.8/20</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mentions" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Très Bien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">48</div>
                <p className="text-sm text-muted-foreground mt-1">≥ 16/20</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Bien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">82</div>
                <p className="text-sm text-muted-foreground mt-1">14-16/20</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:bg-green-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Assez Bien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">65</div>
                <p className="text-sm text-muted-foreground mt-1">12-14/20</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Passable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600">40</div>
                <p className="text-sm text-muted-foreground mt-1">10-12/20</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Performances</CardTitle>
              <CardDescription>Comparaison avec les années précédentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Graphiques de statistiques à venir
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}