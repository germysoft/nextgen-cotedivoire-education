import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Upload, Download, FileCheck, AlertCircle, UserCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockCandidats = [
  { 
    id: "C2025001", 
    nom: "KOUASSI Jean", 
    classe: "3ème A", 
    type: "Régulier", 
    numeroTable: "001", 
    centre: "Lycée Moderne", 
    salle: "A101", 
    dossier: "Complet",
    photo: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    id: "C2025002", 
    nom: "TRAORÉ Marie", 
    classe: "3ème A", 
    type: "Régulier", 
    numeroTable: "002", 
    centre: "Lycée Moderne", 
    salle: "A101", 
    dossier: "Complet",
    photo: "https://images.unsplash.com/photo-1595956246544-e697b3b12ac0?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    id: "C2025003", 
    nom: "YAO Pascal", 
    classe: "3ème B", 
    type: "Régulier", 
    numeroTable: "003", 
    centre: "Lycée Moderne", 
    salle: "A102", 
    dossier: "À corriger",
    photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    id: "C2025004", 
    nom: "DIALLO Fatima", 
    classe: "-", 
    type: "Libre", 
    numeroTable: "004", 
    centre: "Lycée Moderne", 
    salle: "A102", 
    dossier: "Complet",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
  },
];

export default function InscriptionCandidats() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-primary" />
            Inscription des Candidats
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des candidats réguliers et libres - Attribution des numéros et centres
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importer
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Candidat Libre
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Candidats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">254</div>
            <p className="text-xs text-muted-foreground mt-1">+4 cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Candidats Réguliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">250</div>
            <p className="text-xs text-muted-foreground mt-1">Classes d'examen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Candidats Libres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">4</div>
            <p className="text-xs text-muted-foreground mt-1">Inscrits manuellement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiers Incomplets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground mt-1">À compléter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste Candidats</TabsTrigger>
          <TabsTrigger value="attribution">Attribution Numéros</TabsTrigger>
          <TabsTrigger value="centres">Affectation Centres</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Candidats Inscrits</CardTitle>
                  <CardDescription>
                    BEPC 2025 - Session 1
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="tous">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="reguliers">Réguliers</SelectItem>
                      <SelectItem value="libres">Libres</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Rechercher un candidat..." className="w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>N° Candidat</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>N° Table</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>Salle</TableHead>
                    <TableHead>Dossier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCandidats.map((candidat) => (
                    <TableRow key={candidat.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={candidat.photo} />
                            <AvatarFallback>{candidat.nom.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{candidat.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{candidat.id}</TableCell>
                      <TableCell>
                        <Badge variant={candidat.type === "Régulier" ? "default" : "secondary"}>
                          {candidat.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{candidat.classe}</TableCell>
                      <TableCell className="font-mono">{candidat.numeroTable}</TableCell>
                      <TableCell className="text-sm">{candidat.centre}</TableCell>
                      <TableCell className="font-mono text-sm">{candidat.salle}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={candidat.dossier === "Complet" ? "default" : "destructive"}
                          className="gap-1"
                        >
                          {candidat.dossier === "Complet" ? (
                            <FileCheck className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {candidat.dossier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Voir</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Automatique des Numéros</CardTitle>
              <CardDescription>
                Génération automatique des numéros de table et de candidat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <FileCheck className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold">Numérotation Automatique</h3>
                  <p className="text-sm text-muted-foreground">
                    Attribuer les numéros de candidat et de table selon l'ordre alphabétique
                  </p>
                </div>
                <Button>Générer</Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Format Numéro Candidat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input defaultValue="C2025XXX" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Exemple: C2025001, C2025002...
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Format Numéro Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input defaultValue="XXX" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Exemple: 001, 002, 003...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affectation des Centres et Salles</CardTitle>
              <CardDescription>
                Répartition automatique selon les capacités des centres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3">Centres Disponibles</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Lycée Moderne</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacité:</span>
                          <span className="font-medium">200</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">Affectés:</span>
                          <span className="font-medium text-primary">150</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Collège Central</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacité:</span>
                          <span className="font-medium">150</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">Affectés:</span>
                          <span className="font-medium text-primary">104</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Lycée Technique</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacité:</span>
                          <span className="font-medium">100</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">Affectés:</span>
                          <span className="font-medium text-primary">0</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Button className="w-full">
                  Affecter Automatiquement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}