import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Link2, Download, Upload, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, FileSpreadsheet, Eye, History } from "lucide-react";
import { toast } from "sonner";
import { DataTableExport } from "@/components/data-table/DataTableExport";

// Mock data for MENA synchronization
const elevesExport = [
  { id: 1, matriculeMENA: "CI2024001234", nom: "Kouamé Aya", classe: "6ème A", dateNaissance: "12/03/2012", statut: "synchronise", derniereSynchro: "2024-02-10" },
  { id: 2, matriculeMENA: "CI2024001235", nom: "Traoré Ibrahim", classe: "5ème B", dateNaissance: "25/07/2011", statut: "synchronise", derniereSynchro: "2024-02-10" },
  { id: 3, matriculeMENA: "", nom: "Bamba Fatou", classe: "4ème A", dateNaissance: "08/11/2010", statut: "en_attente", derniereSynchro: "-" },
  { id: 4, matriculeMENA: "CI2024001237", nom: "Koné Mamadou", classe: "3ème C", dateNaissance: "03/05/2009", statut: "erreur", derniereSynchro: "2024-02-08" },
  { id: 5, matriculeMENA: "CI2024001238", nom: "Diabaté Aminata", classe: "6ème B", dateNaissance: "19/09/2012", statut: "synchronise", derniereSynchro: "2024-02-10" },
  { id: 6, matriculeMENA: "", nom: "Ouattara Seydou", classe: "5ème A", dateNaissance: "14/01/2011", statut: "en_attente", derniereSynchro: "-" },
  { id: 7, matriculeMENA: "CI2024001240", nom: "Sanogo Mariam", classe: "4ème B", dateNaissance: "22/06/2010", statut: "synchronise", derniereSynchro: "2024-02-10" },
  { id: 8, matriculeMENA: "CI2024001241", nom: "Coulibaly Adama", classe: "3ème A", dateNaissance: "30/12/2009", statut: "synchronise", derniereSynchro: "2024-02-10" },
];

const historiqueSynchro = [
  { id: 1, date: "2024-02-10 15:30", type: "Export", fichier: "eleves_2024_02.xml", statut: "succes", details: "850 élèves exportés" },
  { id: 2, date: "2024-02-08 10:15", type: "Import", fichier: "matricules_mena.csv", statut: "partiel", details: "12 erreurs sur 850" },
  { id: 3, date: "2024-02-05 09:00", type: "Export", fichier: "inscriptions_nouvelles.xml", statut: "succes", details: "45 nouvelles inscriptions" },
  { id: 4, date: "2024-01-28 14:45", type: "Import", fichier: "decisions_mena.csv", statut: "succes", details: "Décisions d'orientation importées" },
  { id: 5, date: "2024-01-20 11:30", type: "Export", fichier: "eleves_2024_01.xml", statut: "echec", details: "Erreur de connexion serveur MENA" },
];

const erreursValidation = [
  { id: 1, eleve: "Koné Mamadou", champ: "Date de naissance", erreur: "Format invalide", valeurActuelle: "03-05-2009", valeurAttendue: "03/05/2009" },
  { id: 2, eleve: "Bamba Fatou", champ: "Matricule", erreur: "Matricule manquant", valeurActuelle: "-", valeurAttendue: "CI2024XXXXXX" },
  { id: 3, eleve: "Ouattara Seydou", champ: "Lieu de naissance", erreur: "Champ requis manquant", valeurActuelle: "-", valeurAttendue: "Obligatoire" },
];

const exportColumns = [
  { key: "matriculeMENA", label: "Matricule MENA" },
  { key: "nom", label: "Nom Complet" },
  { key: "classe", label: "Classe" },
  { key: "dateNaissance", label: "Date de Naissance" },
  { key: "statut", label: "Statut" },
  { key: "derniereSynchro", label: "Dernière Synchro" },
];

export default function MENAPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const synchronises = elevesExport.filter(e => e.statut === "synchronise").length;
  const enAttente = elevesExport.filter(e => e.statut === "en_attente").length;
  const erreurs = elevesExport.filter(e => e.statut === "erreur").length;

  const handleSync = () => {
    setSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncing(false);
          toast.success("Synchronisation terminée avec succès");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleExport = (type: string) => {
    toast.success(`Export ${type} lancé avec succès`);
    setShowExportDialog(false);
  };

  const handleImport = () => {
    if (selectedFile) {
      toast.success(`Fichier ${selectedFile.name} importé avec succès`);
      setSelectedFile(null);
      setShowImportDialog(false);
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "synchronise":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="mr-1 h-3 w-3" />Synchronisé</Badge>;
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><Clock className="mr-1 h-3 w-3" />En attente</Badge>;
      case "erreur":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"><XCircle className="mr-1 h-3 w-3" />Erreur</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getHistoriqueStatutBadge = (statut: string) => {
    switch (statut) {
      case "succes":
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case "partiel":
        return <Badge className="bg-yellow-100 text-yellow-800">Partiel</Badge>;
      case "echec":
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import/Export MENA</h1>
          <p className="text-muted-foreground mt-2">
            Synchronisation avec le système MENA (Ministère de l'Éducation Nationale)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Synchronisation..." : "Synchroniser"}
          </Button>
        </div>
      </div>

      {syncing && (
        <Card>
          <CardContent className="py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Synchronisation en cours...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{elevesExport.length}</div>
            <p className="text-xs text-muted-foreground mt-1">dans le système</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Synchronisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{synchronises}</div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{((synchronises / elevesExport.length) * 100).toFixed(0)}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-600">{enAttente}</div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">à synchroniser</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">{erreurs}</div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">à corriger</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Exporter vers MENA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Générer et exporter les fichiers requis par le MENA au format officiel.
            </p>
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Exporter les Données
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Exporter vers MENA</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Type d'export</Label>
                    <Select defaultValue="complet">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complet">Export complet</SelectItem>
                        <SelectItem value="nouveaux">Nouvelles inscriptions uniquement</SelectItem>
                        <SelectItem value="modifications">Modifications uniquement</SelectItem>
                        <SelectItem value="radiations">Radiations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Format de fichier</Label>
                    <Select defaultValue="xml">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xml">XML (Format officiel MENA)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Année scolaire</Label>
                    <Select defaultValue="2023-2024">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleExport("XML")} className="w-full">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Générer et Télécharger
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Importer depuis MENA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Importer les mises à jour, matricules et décisions du MENA.
            </p>
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Importer les Données
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importer depuis MENA</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Type d'import</Label>
                    <Select defaultValue="matricules">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matricules">Matricules MENA</SelectItem>
                        <SelectItem value="decisions">Décisions d'orientation</SelectItem>
                        <SelectItem value="resultats">Résultats d'examens</SelectItem>
                        <SelectItem value="corrections">Corrections de données</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fichier à importer</Label>
                    <Input
                      type="file"
                      accept=".xml,.csv,.xlsx"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Fichier sélectionné: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <Button onClick={handleImport} className="w-full" disabled={!selectedFile}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer le fichier
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="eleves" className="space-y-4">
        <TabsList>
          <TabsTrigger value="eleves">Élèves</TabsTrigger>
          <TabsTrigger value="erreurs">Erreurs de Validation ({erreursValidation.length})</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="eleves">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Élèves - Statut MENA</CardTitle>
                <DataTableExport
                  data={elevesExport}
                  columns={exportColumns}
                  filename="eleves-mena"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule MENA</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date de Naissance</TableHead>
                    <TableHead>Dernière Synchro</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elevesExport.map((eleve) => (
                    <TableRow key={eleve.id}>
                      <TableCell className="font-mono">
                        {eleve.matriculeMENA || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="font-medium">{eleve.nom}</TableCell>
                      <TableCell>{eleve.classe}</TableCell>
                      <TableCell>{eleve.dateNaissance}</TableCell>
                      <TableCell>{eleve.derniereSynchro}</TableCell>
                      <TableCell>{getStatutBadge(eleve.statut)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erreurs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Erreurs de Validation à Corriger
              </CardTitle>
            </CardHeader>
            <CardContent>
              {erreursValidation.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Champ</TableHead>
                      <TableHead>Type d'erreur</TableHead>
                      <TableHead>Valeur Actuelle</TableHead>
                      <TableHead>Valeur Attendue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {erreursValidation.map((erreur) => (
                      <TableRow key={erreur.id}>
                        <TableCell className="font-medium">{erreur.eleve}</TableCell>
                        <TableCell>{erreur.champ}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{erreur.erreur}</Badge>
                        </TableCell>
                        <TableCell className="text-red-600">{erreur.valeurActuelle}</TableCell>
                        <TableCell className="text-green-600">{erreur.valeurAttendue}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Corriger
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p>Aucune erreur de validation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des Synchronisations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historiqueSynchro.map((sync) => (
                    <TableRow key={sync.id}>
                      <TableCell className="font-mono text-sm">{sync.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sync.type === "Export" ? <Upload className="mr-1 h-3 w-3" /> : <Download className="mr-1 h-3 w-3" />}
                          {sync.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{sync.fichier}</TableCell>
                      <TableCell>{sync.details}</TableCell>
                      <TableCell>{getHistoriqueStatutBadge(sync.statut)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
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
}
