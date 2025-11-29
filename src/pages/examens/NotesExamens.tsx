import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileSpreadsheet, Upload, Download, Save, Lock, Unlock, History, CheckCircle, AlertCircle, Calculator } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";

const mockCandidats = [
  { 
    numero: "C2025001", 
    nom: "KOUASSI Jean", 
    classe: "3ème A",
    francais: 15.5,
    mathematiques: 14.0,
    anglais: 16.0,
    moyenne: 0,
    statut: "Saisie complète",
    verrouille: false,
    photo: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    numero: "C2025002", 
    nom: "TRAORÉ Marie", 
    classe: "3ème A",
    francais: 17.5,
    mathematiques: 18.0,
    anglais: 17.0,
    moyenne: 0,
    statut: "Saisie complète",
    verrouille: true,
    photo: "https://images.unsplash.com/photo-1595956246544-e697b3b12ac0?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    numero: "C2025003", 
    nom: "YAO Pascal", 
    classe: "3ème B",
    francais: 14.0,
    mathematiques: null,
    anglais: 15.5,
    moyenne: 0,
    statut: "Incomplet",
    verrouille: false,
    photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces"
  },
  { 
    numero: "C2025004", 
    nom: "DIALLO Fatima", 
    classe: "3ème B",
    francais: 16.5,
    mathematiques: 15.5,
    anglais: 16.5,
    moyenne: 0,
    statut: "Saisie complète",
    verrouille: false,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
  },
];

const mockCoefficients = {
  francais: 3,
  mathematiques: 3,
  anglais: 2,
};

const mockHistorique = [
  { 
    id: 1,
    candidat: "KOUASSI Jean",
    matiere: "Français",
    ancienneNote: null,
    nouvelleNote: 15.5,
    operateur: "Admin KOUADIO",
    date: "2025-06-20 10:30",
    action: "Saisie initiale"
  },
  { 
    id: 2,
    candidat: "TRAORÉ Marie",
    matiere: "Mathématiques",
    ancienneNote: 17.5,
    nouvelleNote: 18.0,
    operateur: "Admin KOUADIO",
    date: "2025-06-20 11:15",
    action: "Correction"
  },
  { 
    id: 3,
    candidat: "TRAORÉ Marie",
    matiere: "Toutes",
    ancienneNote: null,
    nouvelleNote: null,
    operateur: "Admin KOUADIO",
    date: "2025-06-20 14:00",
    action: "Verrouillage"
  },
];

const calculateMoyenne = (candidat: any) => {
  const notes = [
    { note: candidat.francais, coef: mockCoefficients.francais },
    { note: candidat.mathematiques, coef: mockCoefficients.mathematiques },
    { note: candidat.anglais, coef: mockCoefficients.anglais },
  ];

  const validNotes = notes.filter(n => n.note !== null);
  if (validNotes.length === 0) return 0;

  const totalPoints = validNotes.reduce((sum, n) => sum + (n.note! * n.coef), 0);
  const totalCoefs = validNotes.reduce((sum, n) => sum + n.coef, 0);

  return totalPoints / totalCoefs;
};

export default function NotesExamens() {
  const [selectedClasse, setSelectedClasse] = useState("3ème A");
  const [selectedMatiere, setSelectedMatiere] = useState("francais");
  const [notes, setNotes] = useState(mockCandidats);
  const [showHistorique, setShowHistorique] = useState(false);

  const handleNoteChange = (numero: string, matiere: string, value: string) => {
    const noteValue = value === "" ? null : parseFloat(value);
    
    // Validation /20
    if (noteValue !== null && (noteValue < 0 || noteValue > 20)) {
      toast.error("Note invalide", {
        description: "La note doit être entre 0 et 20"
      });
      return;
    }

    setNotes(prev => prev.map(candidat => {
      if (candidat.numero === numero) {
        const updated = { ...candidat, [matiere]: noteValue };
        updated.moyenne = calculateMoyenne(updated);
        return updated;
      }
      return candidat;
    }));

    toast.success("Note modifiée", {
      description: "La moyenne a été recalculée automatiquement"
    });
  };

  const handleVerrouiller = (numero: string) => {
    setNotes(prev => prev.map(candidat => 
      candidat.numero === numero 
        ? { ...candidat, verrouille: true }
        : candidat
    ));
    toast.success("Notes verrouillées", {
      description: "Les notes ne peuvent plus être modifiées sans déverrouillage"
    });
  };

  const handleDeverrouiller = (numero: string) => {
    setNotes(prev => prev.map(candidat => 
      candidat.numero === numero 
        ? { ...candidat, verrouille: false }
        : candidat
    ));
    toast.info("Notes déverrouillées", {
      description: "Les notes peuvent maintenant être modifiées"
    });
  };

  const handleImportExcel = () => {
    toast.success("Import Excel réussi", {
      description: "45 notes importées et validées selon le format DECO"
    });
  };

  const handleExportTemplate = () => {
    toast.info("Téléchargement du modèle", {
      description: "Modèle Excel format DECO téléchargé"
    });
  };

  const handleSaveAll = () => {
    toast.success("Notes enregistrées", {
      description: "Toutes les modifications ont été sauvegardées"
    });
  };

  const candidatsFiltered = notes.filter(c => c.classe === selectedClasse);
  const nbComplets = candidatsFiltered.filter(c => c.statut === "Saisie complète").length;
  const nbVerrouilles = candidatsFiltered.filter(c => c.verrouille).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            Saisie des Notes d'Examens
          </h1>
          <p className="text-muted-foreground mt-1">
            Import Excel DECO, validation automatique et calcul instantané des moyennes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Modèle Excel
          </Button>
          <Button variant="outline" onClick={handleImportExcel} className="gap-2">
            <Upload className="h-4 w-4" />
            Importer Excel
          </Button>
          <Button onClick={handleSaveAll} className="gap-2">
            <Save className="h-4 w-4" />
            Enregistrer Tout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Candidats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">254</div>
            <p className="text-xs text-muted-foreground mt-1">BEPC 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saisie Complète
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{nbComplets}</div>
            <Progress value={(nbComplets / candidatsFiltered.length) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notes Verrouillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{nbVerrouilles}</div>
            <p className="text-xs text-muted-foreground mt-1">Validées définitivement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Classe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">15.2/20</div>
            <p className="text-xs text-muted-foreground mt-1">Classe sélectionnée</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Modifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">12</div>
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-xs mt-1"
              onClick={() => setShowHistorique(true)}
            >
              Voir historique
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alert Format DECO */}
      <Alert>
        <FileSpreadsheet className="h-4 w-4" />
        <AlertTitle>Format d'Import Excel DECO</AlertTitle>
        <AlertDescription>
          Le modèle Excel suit les spécifications officielles de la DECO (Direction des Examens et Concours). 
          Les colonnes obligatoires sont : N° Candidat, Nom, Prénom, Date de naissance, puis les notes par matière (/20).
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="saisie" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saisie">Saisie des Notes</TabsTrigger>
          <TabsTrigger value="coefficients">Coefficients</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="saisie" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grille de Saisie - BEPC 2025</CardTitle>
                  <CardDescription>
                    Saisie avec validation automatique et calcul instantané des moyennes
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3ème A">3ème A</SelectItem>
                      <SelectItem value="3ème B">3ème B</SelectItem>
                      <SelectItem value="3ème C">3ème C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Photo</TableHead>
                      <TableHead>N° Candidat</TableHead>
                      <TableHead>Nom & Prénom</TableHead>
                      <TableHead className="text-center">
                        Français
                        <div className="text-xs font-normal text-muted-foreground">(Coef. 3)</div>
                      </TableHead>
                      <TableHead className="text-center">
                        Mathématiques
                        <div className="text-xs font-normal text-muted-foreground">(Coef. 3)</div>
                      </TableHead>
                      <TableHead className="text-center">
                        Anglais
                        <div className="text-xs font-normal text-muted-foreground">(Coef. 2)</div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Calculator className="h-4 w-4" />
                          Moyenne
                        </div>
                      </TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidatsFiltered.map((candidat) => {
                      const moyenne = calculateMoyenne(candidat);
                      const isComplet = candidat.francais !== null && 
                                       candidat.mathematiques !== null && 
                                       candidat.anglais !== null;
                      
                      return (
                        <TableRow 
                          key={candidat.numero}
                          className={candidat.verrouille ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                        >
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={candidat.photo} />
                              <AvatarFallback>{candidat.nom.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{candidat.numero}</TableCell>
                          <TableCell className="font-medium">{candidat.nom}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={candidat.francais ?? ""}
                              onChange={(e) => handleNoteChange(candidat.numero, "francais", e.target.value)}
                              disabled={candidat.verrouille}
                              className="w-20 text-center"
                              placeholder="--"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={candidat.mathematiques ?? ""}
                              onChange={(e) => handleNoteChange(candidat.numero, "mathematiques", e.target.value)}
                              disabled={candidat.verrouille}
                              className="w-20 text-center"
                              placeholder="--"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={candidat.anglais ?? ""}
                              onChange={(e) => handleNoteChange(candidat.numero, "anglais", e.target.value)}
                              disabled={candidat.verrouille}
                              className="w-20 text-center"
                              placeholder="--"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              {isComplet ? (
                                <Badge className="font-mono text-base bg-primary">
                                  {moyenne.toFixed(2)}/20
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">--</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {candidat.verrouille ? (
                              <Badge className="gap-1 bg-blue-100 text-blue-700 dark:bg-blue-950">
                                <Lock className="h-3 w-3" />
                                Verrouillé
                              </Badge>
                            ) : isComplet ? (
                              <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-950">
                                <CheckCircle className="h-3 w-3" />
                                Complet
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Incomplet
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {candidat.verrouille ? (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeverrouiller(candidat.numero)}
                                className="gap-1"
                              >
                                <Unlock className="h-3 w-3" />
                                Déverrouiller
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleVerrouiller(candidat.numero)}
                                disabled={!isComplet}
                                className="gap-1"
                              >
                                <Lock className="h-3 w-3" />
                                Verrouiller
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Validation Automatique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Notes entre 0 et 20 uniquement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Contrôle des doublons de saisie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Détection des incohérences</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-purple-600" />
                      Calcul Instantané
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-3 w-3 text-purple-600" />
                      <span>Moyenne pondérée automatique</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-3 w-3 text-purple-600" />
                      <span>Application coefficients DECO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-3 w-3 text-purple-600" />
                      <span>Mise à jour temps réel</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coefficients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Coefficients</CardTitle>
              <CardDescription>
                Coefficients officiels BEPC selon les directives de la DECO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockCoefficients).map(([matiere, coef]) => (
                  <div key={matiere} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold capitalize">{matiere}</h4>
                      <p className="text-sm text-muted-foreground">Matière officielle BEPC</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        Coefficient: {coef}
                      </Badge>
                      <Button variant="ghost" size="sm">Modifier</Button>
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Coefficients Verrouillés</AlertTitle>
                <AlertDescription>
                  Les coefficients sont définis par la DECO et ne peuvent être modifiés qu'avec autorisation spéciale.
                  Toute modification sera tracée dans l'historique.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique Complet des Modifications
              </CardTitle>
              <CardDescription>
                Traçabilité complète : qui a modifié quoi et quand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Ancienne Note</TableHead>
                    <TableHead>Nouvelle Note</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Opérateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistorique.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-sm">{entry.date}</TableCell>
                      <TableCell className="font-medium">{entry.candidat}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.matiere}</Badge>
                      </TableCell>
                      <TableCell>
                        {entry.ancienneNote !== null ? (
                          <span className="line-through text-muted-foreground">
                            {entry.ancienneNote}/20
                          </span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.nouvelleNote !== null ? (
                          <span className="font-medium text-green-600">
                            {entry.nouvelleNote}/20
                          </span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          entry.action === "Verrouillage" ? "bg-blue-100 text-blue-700" :
                          entry.action === "Correction" ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }>
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {entry.operateur}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Sécurité et Audit</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Chaque modification est horodatée et attribuée à un utilisateur identifié.
                      L'historique est immuable et conservé pendant 10 ans conformément aux exigences légales.
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