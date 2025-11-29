import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Calendar, Users, Sparkles, AlertCircle, CheckCircle, MapPin, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const mockSalles = [
  { id: "S001", nom: "Salle A101", batiment: "Bâtiment A", capacite: 30, type: "Écrit", equipement: ["Tableaux", "Ventilation"], statut: "Disponible", affectes: 0 },
  { id: "S002", nom: "Salle A102", batiment: "Bâtiment A", capacite: 30, type: "Écrit", equipement: ["Tableaux", "Ventilation"], statut: "Disponible", affectes: 28 },
  { id: "S003", nom: "Salle A103", batiment: "Bâtiment A", capacite: 30, type: "Écrit", equipement: ["Tableaux", "Climatisation"], statut: "Disponible", affectes: 30 },
  { id: "S004", nom: "Salle B201", batiment: "Bâtiment B", capacite: 35, type: "Écrit", equipement: ["Tableaux", "Climatisation", "Vidéoprojecteur"], statut: "Disponible", affectes: 32 },
  { id: "S005", nom: "Labo Physique", batiment: "Bâtiment C", capacite: 20, type: "Pratique", equipement: ["Paillasses", "Matériel labo"], statut: "Disponible", affectes: 0 },
  { id: "S006", nom: "Labo Chimie", batiment: "Bâtiment C", capacite: 20, type: "Pratique", equipement: ["Paillasses", "Hotte"], statut: "En maintenance", affectes: 0 },
];

const mockPlanning = [
  { 
    id: "P001", 
    jour: "Lundi 15/06/2025", 
    epreuve: "Français Écrit", 
    horaire: "08:00 - 12:00", 
    salles: ["A101", "A102", "A103"], 
    candidats: 88,
    capacite: 90,
    conflit: false 
  },
  { 
    id: "P002", 
    jour: "Lundi 15/06/2025", 
    epreuve: "Anglais Oral", 
    horaire: "14:00 - 18:00", 
    salles: ["B201"], 
    candidats: 30,
    capacite: 35,
    conflit: false 
  },
  { 
    id: "P003", 
    jour: "Mardi 16/06/2025", 
    epreuve: "Mathématiques", 
    horaire: "08:00 - 11:00", 
    salles: ["A101", "A102", "B201"], 
    candidats: 95,
    capacite: 95,
    conflit: false 
  },
  { 
    id: "P004", 
    jour: "Mardi 16/06/2025", 
    epreuve: "Physique Pratique", 
    horaire: "09:00 - 12:00", 
    salles: ["Labo Physique"], 
    candidats: 25,
    capacite: 20,
    conflit: true 
  },
];

const mockAffectations = [
  { salle: "A101", table: 1, candidat: "KOUASSI Jean", numero: "C2025001", epreuve: "Français" },
  { salle: "A101", table: 2, candidat: "TRAORÉ Marie", numero: "C2025002", epreuve: "Français" },
  { salle: "A101", table: 3, candidat: "YAO Pascal", numero: "C2025003", epreuve: "Français" },
  { salle: "A102", table: 1, candidat: "DIALLO Fatima", numero: "C2025004", epreuve: "Français" },
  { salle: "A102", table: 2, candidat: "BAMBA Serge", numero: "C2025005", epreuve: "Français" },
];

export default function SallesExamens() {
  const [selectedSalle, setSelectedSalle] = useState("A101");
  const [showConflits, setShowConflits] = useState(false);

  const handleAffectationAuto = () => {
    toast.success("Affectation automatique réussie", {
      description: "Les candidats ont été répartis dans les salles selon les capacités"
    });
  };

  const handleVerifierConflits = () => {
    setShowConflits(true);
    const conflits = mockPlanning.filter(p => p.conflit).length;
    toast.warning(`${conflits} conflit(s) détecté(s)`, {
      description: "Vérifiez les chevauchements d'horaires et les surcharges"
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Salles & Planning
          </h1>
          <p className="text-muted-foreground mt-1">
            Affectation automatique des candidats et gestion des plannings d'épreuves
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleVerifierConflits} className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Vérifier Conflits
          </Button>
          <Button onClick={handleAffectationAuto} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Affectation Auto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Salles Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15</div>
            <p className="text-xs text-muted-foreground mt-1">Sur 18 au total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Capacité Totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">450</div>
            <p className="text-xs text-muted-foreground mt-1">Places disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Candidats Affectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">238</div>
            <p className="text-xs text-muted-foreground mt-1">Sur 254 candidats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conflits Détectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">1</div>
            <p className="text-xs text-muted-foreground mt-1">À résoudre</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Conflits */}
      {showConflits && mockPlanning.some(p => p.conflit) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Conflit de Capacité Détecté</AlertTitle>
          <AlertDescription>
            L'épreuve de Physique Pratique (Mardi 16/06, 09:00-12:00) nécessite 25 places mais le Labo Physique n'a que 20 places.
            Affectez une salle supplémentaire ou divisez l'épreuve.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="salles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="salles">Salles Disponibles</TabsTrigger>
          <TabsTrigger value="planning">Planning Épreuves</TabsTrigger>
          <TabsTrigger value="affectations">Affectations Candidats</TabsTrigger>
          <TabsTrigger value="plan">Plan de Salle</TabsTrigger>
        </TabsList>

        <TabsContent value="salles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Salles</CardTitle>
                  <CardDescription>Gestion des salles de composition et pratique</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter Salle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salle</TableHead>
                    <TableHead>Bâtiment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Affectés</TableHead>
                    <TableHead>Taux Remplissage</TableHead>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSalles.map((salle) => {
                    const tauxRemplissage = (salle.affectes / salle.capacite) * 100;
                    
                    return (
                      <TableRow key={salle.id}>
                        <TableCell className="font-medium">{salle.nom}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{salle.batiment}</TableCell>
                        <TableCell>
                          <Badge variant={salle.type === "Pratique" ? "secondary" : "outline"}>
                            {salle.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{salle.capacite}</span> places
                        </TableCell>
                        <TableCell>
                          <span className={salle.affectes === salle.capacite ? "text-orange-600 font-medium" : ""}>
                            {salle.affectes}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={tauxRemplissage} className="w-20" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(tauxRemplissage)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {salle.equipement.slice(0, 2).map((eq, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {eq}
                              </Badge>
                            ))}
                            {salle.equipement.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{salle.equipement.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              salle.statut === "Disponible" 
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" 
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {salle.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">Modifier</Button>
                            <Button variant="ghost" size="sm">Voir Plan</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Configuration des Salles</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Chaque salle peut être configurée avec :
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>Capacité maximale pour épreuves écrites et pratiques</li>
                      <li>Équipements disponibles (climatisation, vidéoprojecteur, etc.)</li>
                      <li>Type d'épreuve autorisé (théorique ou pratique)</li>
                      <li>Indisponibilités pour maintenance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planning des Épreuves
              </CardTitle>
              <CardDescription>
                Vue d'ensemble des épreuves avec affectation des salles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Jour</TableHead>
                    <TableHead>Épreuve</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Salles Affectées</TableHead>
                    <TableHead>Candidats</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPlanning.map((plan) => {
                    const progression = (plan.candidats / plan.capacite) * 100;
                    const surcharge = plan.candidats > plan.capacite;
                    
                    return (
                      <TableRow 
                        key={plan.id}
                        className={plan.conflit ? "bg-orange-50 dark:bg-orange-950/20" : ""}
                      >
                        <TableCell className="font-medium">{plan.jour}</TableCell>
                        <TableCell>{plan.epreuve}</TableCell>
                        <TableCell className="text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {plan.horaire}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {plan.salles.map(salle => (
                              <Badge key={salle} variant="outline" className="text-xs">
                                {salle}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={surcharge ? "text-orange-600 font-medium" : "font-medium"}>
                            {plan.candidats}
                          </span>
                        </TableCell>
                        <TableCell>{plan.capacite}</TableCell>
                        <TableCell>
                          {plan.conflit ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Surcharge
                            </Badge>
                          ) : (
                            <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-950">
                              <CheckCircle className="h-3 w-3" />
                              OK
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Gérer</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Détection Automatique de Conflits</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Vérification des chevauchements horaires</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Contrôle des capacités de salles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Alerte si maintenance planifiée</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Optimisation Automatique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>Répartition équilibrée par salle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>Minimisation des déplacements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>Attribution selon équipement requis</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affectations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Affectations des Candidats par Salle</CardTitle>
                  <CardDescription>Visualisation des affectations candidat-table-salle</CardDescription>
                </div>
                <Select value={selectedSalle} onValueChange={setSelectedSalle}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A101">Salle A101</SelectItem>
                    <SelectItem value="A102">Salle A102</SelectItem>
                    <SelectItem value="A103">Salle A103</SelectItem>
                    <SelectItem value="B201">Salle B201</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Salle {selectedSalle}</h4>
                  <p className="text-sm text-muted-foreground">
                    Épreuve: Français Écrit - Lundi 15/06/2025, 08:00-12:00
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">28/30</div>
                  <p className="text-xs text-muted-foreground">places occupées</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Table</TableHead>
                    <TableHead>N° Candidat</TableHead>
                    <TableHead>Nom Candidat</TableHead>
                    <TableHead>Épreuve</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAffectations
                    .filter(aff => aff.salle === selectedSalle)
                    .map((aff, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-medium">{String(aff.table).padStart(3, '0')}</TableCell>
                        <TableCell className="font-mono text-sm">{aff.numero}</TableCell>
                        <TableCell className="font-medium">{aff.candidat}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{aff.epreuve}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Réaffecter</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Voir Plan de Salle
                </Button>
                <Button variant="outline">Imprimer Liste</Button>
                <Button variant="outline">Exporter Excel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Plan de Salle - {selectedSalle}
                  </CardTitle>
                  <CardDescription>Disposition des tables et candidats</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedSalle} onValueChange={setSelectedSalle}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A101">Salle A101</SelectItem>
                      <SelectItem value="A102">Salle A102</SelectItem>
                      <SelectItem value="A103">Salle A103</SelectItem>
                      <SelectItem value="B201">Salle B201</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-muted/30">
                {/* Tableau de Professeur */}
                <div className="mb-8">
                  <div className="w-full h-16 bg-primary/10 border-2 border-primary rounded flex items-center justify-center">
                    <span className="font-semibold text-primary">TABLEAU</span>
                  </div>
                </div>

                {/* Grille de Tables */}
                <div className="grid grid-cols-6 gap-4">
                  {Array.from({ length: 30 }, (_, i) => {
                    const affectation = mockAffectations.find(
                      a => a.salle === selectedSalle && a.table === i + 1
                    );
                    
                    return (
                      <div
                        key={i}
                        className={`
                          aspect-square border-2 rounded-lg flex flex-col items-center justify-center p-2
                          ${affectation 
                            ? "bg-primary/10 border-primary" 
                            : "bg-background border-dashed border-muted-foreground/30"
                          }
                        `}
                      >
                        <div className="font-mono text-xs font-medium mb-1">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        {affectation ? (
                          <div className="text-center">
                            <div className="text-xs font-medium truncate w-full">
                              {affectation.candidat.split(' ')[0]}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {affectation.numero.slice(-3)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Libre</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Légende */}
                <div className="mt-6 flex items-center gap-6 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/10 border-2 border-primary rounded"></div>
                    <span>Place occupée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-background border-2 border-dashed border-muted-foreground/30 rounded"></div>
                    <span>Place libre</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Plan de Salle Interactif</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ce plan peut être personnalisé selon la disposition réelle de la salle.
                      Utilisez le drag & drop pour réorganiser les places.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}