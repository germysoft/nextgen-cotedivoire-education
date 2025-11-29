import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, AlertCircle, CheckCircle, Sparkles, Calendar, Clock, ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { toast } from "sonner";

const mockEnseignants = [
  { 
    id: "T001", 
    nom: "KOUADIO Marie", 
    matiere: "Français", 
    classesEnseignees: ["3ème A", "3ème B"],
    disponible: true,
    affecte: false,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    id: "T002", 
    nom: "BAMBA Serge", 
    matiere: "Mathématiques", 
    classesEnseignees: ["3ème A", "3ème C"],
    disponible: true,
    affecte: false,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    id: "T003", 
    nom: "YAO Ange", 
    matiere: "Anglais", 
    classesEnseignees: ["3ème B", "3ème C"],
    disponible: true,
    affecte: false,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    id: "T004", 
    nom: "DIALLO Ibrahim", 
    matiere: "Français", 
    classesEnseignees: ["3ème C"],
    disponible: true,
    affecte: false,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces"
  },
];

const mockJurys = [
  {
    id: "J001",
    enseignant: "KOUADIO Marie",
    matiere: "Français",
    epreuve: "Français Écrit",
    salle: "A101",
    date: "2025-06-15",
    heure: "08:00 - 12:00",
    nbCandidats: 40,
    conflit: false,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: "J002",
    enseignant: "BAMBA Serge",
    matiere: "Mathématiques",
    epreuve: "Mathématiques",
    salle: "B205",
    date: "2025-06-16",
    heure: "08:00 - 11:00",
    nbCandidats: 38,
    conflit: true,
    conflitDetail: "Enseigne la 3ème A (12 candidats présents)",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: "J003",
    enseignant: "YAO Ange",
    matiere: "Anglais",
    epreuve: "Anglais Écrit",
    salle: "C102",
    date: "2025-06-17",
    heure: "08:00 - 10:00",
    nbCandidats: 42,
    conflit: false,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
  },
];

const mockPlanning = [
  { jour: "Lundi 15/06", epreuve: "Français Écrit", horaire: "08:00-12:00", salles: ["A101", "A102", "A103"], jurysRequis: 9, jurysAffectes: 9 },
  { jour: "Mardi 16/06", epreuve: "Mathématiques", horaire: "08:00-11:00", salles: ["B201", "B202", "B203"], jurysRequis: 9, jurysAffectes: 8 },
  { jour: "Mercredi 17/06", epreuve: "Anglais Écrit", horaire: "08:00-10:00", salles: ["C101", "C102"], jurysRequis: 6, jurysAffectes: 6 },
  { jour: "Jeudi 18/06", epreuve: "Histoire-Géo", horaire: "08:00-10:00", salles: ["A101", "A102"], jurysRequis: 6, jurysAffectes: 4 },
];

export default function JurysExamens() {
  const [selectedMatiere, setSelectedMatiere] = useState("tous");
  const [showConflits, setShowConflits] = useState(false);

  const handleAttributionAuto = () => {
    toast.success("Attribution automatique lancée", {
      description: "Les jurys ont été affectés en évitant les conflits d'enseignement"
    });
  };

  const handleVerifierConflits = () => {
    setShowConflits(true);
    toast.info("Vérification des conflits", {
      description: "1 conflit détecté - BAMBA Serge enseigne des candidats présents"
    });
  };

  const filteredJurys = selectedMatiere === "tous" 
    ? mockJurys 
    : mockJurys.filter(j => j.matiere === selectedMatiere);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Jurys & Examinateurs
          </h1>
          <p className="text-muted-foreground mt-1">
            Attribution intelligente des jurys avec vérification anti-conflit
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleVerifierConflits} className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Vérifier Conflits
          </Button>
          <Button onClick={handleAttributionAuto} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Attribution Auto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enseignants Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Sur 28 au total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jurys Affectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">27</div>
            <p className="text-xs text-muted-foreground mt-1">Sur 30 postes requis</p>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux Couverture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">90%</div>
            <p className="text-xs text-muted-foreground mt-1">3 postes restants</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Conflits */}
      {showConflits && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Conflit d'Enseignement Détecté</AlertTitle>
          <AlertDescription>
            BAMBA Serge est affecté à l'épreuve de Mathématiques mais enseigne cette matière à la 3ème A. 
            12 candidats de sa classe seront présents. Réaffectation recommandée.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="jurys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jurys">Jurys Affectés</TabsTrigger>
          <TabsTrigger value="enseignants">Enseignants Disponibles</TabsTrigger>
          <TabsTrigger value="planning">Planning Surveillance</TabsTrigger>
        </TabsList>

        <TabsContent value="jurys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Jurys Affectés</CardTitle>
                  <CardDescription>BEPC 2025 - Session 1</CardDescription>
                </div>
                <Select value={selectedMatiere} onValueChange={setSelectedMatiere}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes les matières</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                    <SelectItem value="Anglais">Anglais</SelectItem>
                    <SelectItem value="Histoire-Géo">Histoire-Géo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Épreuve</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Salle</TableHead>
                    <TableHead>Candidats</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJurys.map((jury) => (
                    <TableRow key={jury.id} className={jury.conflit ? "bg-orange-50 dark:bg-orange-950/20" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={jury.photo} />
                            <AvatarFallback>{jury.enseignant.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{jury.enseignant}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{jury.matiere}</Badge>
                      </TableCell>
                      <TableCell>{jury.epreuve}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {jury.date}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {jury.heure}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{jury.salle}</TableCell>
                      <TableCell>{jury.nbCandidats}</TableCell>
                      <TableCell>
                        {jury.conflit ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Conflit
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                            <CheckCircle className="h-3 w-3" />
                            Validé
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">Modifier</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Retirer</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredJurys.some(j => j.conflit) && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100">Détails du Conflit</h4>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                        {filteredJurys.find(j => j.conflit)?.conflitDetail}
                      </p>
                      <Button size="sm" variant="outline" className="mt-3">
                        Réaffecter Automatiquement
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enseignants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pool d'Enseignants Disponibles</CardTitle>
              <CardDescription>
                Enseignants éligibles pour la surveillance d'examens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière Enseignée</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Disponibilité</TableHead>
                    <TableHead>Affectation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEnseignants.map((ens) => (
                    <TableRow key={ens.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={ens.photo} />
                            <AvatarFallback>{ens.nom.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{ens.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ens.matiere}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ens.classesEnseignees.join(", ")}
                      </TableCell>
                      <TableCell>
                        <Badge className={ens.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {ens.disponible ? "Disponible" : "Indisponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ens.affecte ? (
                          <Badge>Affecté</Badge>
                        ) : (
                          <Badge variant="secondary">Non affecté</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" disabled={ens.affecte}>
                          Affecter
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Attribution Automatique Intelligente</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Le système attribue automatiquement les jurys en respectant les règles suivantes :
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>Un enseignant ne surveille jamais ses propres élèves</li>
                      <li>Répartition équitable des charges de surveillance</li>
                      <li>Priorité aux enseignants de matières différentes</li>
                      <li>Respect des disponibilités déclarées</li>
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
                Planning de Surveillance
              </CardTitle>
              <CardDescription>
                Vue d'ensemble des besoins en jurys par jour et épreuve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Épreuve</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Salles</TableHead>
                    <TableHead>Jurys Requis</TableHead>
                    <TableHead>Jurys Affectés</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPlanning.map((plan, idx) => {
                    const progression = (plan.jurysAffectes / plan.jurysRequis) * 100;
                    const isComplet = plan.jurysAffectes === plan.jurysRequis;
                    
                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{plan.jour}</TableCell>
                        <TableCell>{plan.epreuve}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{plan.horaire}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {plan.salles.map(salle => (
                              <Badge key={salle} variant="outline" className="text-xs">
                                {salle}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{plan.jurysRequis}</TableCell>
                        <TableCell>
                          <span className={isComplet ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                            {plan.jurysAffectes}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${isComplet ? "bg-green-600" : "bg-orange-500"}`}
                                style={{ width: `${progression}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(progression)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}