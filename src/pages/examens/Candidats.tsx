import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Upload, Download, FileCheck, AlertCircle, UserCircle, Search, Eye, Edit, Trash2, Sparkles, Printer } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Candidat {
  id: string;
  nom: string;
  classe: string;
  type: "Régulier" | "Libre";
  numeroTable: string;
  centre: string;
  salle: string;
  dossier: "Complet" | "À corriger" | "Incomplet";
  photo: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  sexe?: "M" | "F";
}

const initialCandidats: Candidat[] = [
  { 
    id: "C2025001", 
    nom: "KOUASSI Jean", 
    classe: "3ème A", 
    type: "Régulier", 
    numeroTable: "001", 
    centre: "Lycée Moderne", 
    salle: "A101", 
    dossier: "Complet",
    photo: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=faces",
    dateNaissance: "2008-03-15",
    lieuNaissance: "Abidjan",
    sexe: "M"
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
    photo: "https://images.unsplash.com/photo-1595956246544-e697b3b12ac0?w=150&h=150&fit=crop&crop=faces",
    dateNaissance: "2008-07-22",
    lieuNaissance: "Bouaké",
    sexe: "F"
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
    photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces",
    dateNaissance: "2008-11-08",
    lieuNaissance: "Daloa",
    sexe: "M"
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
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    dateNaissance: "2007-05-20",
    lieuNaissance: "San-Pédro",
    sexe: "F"
  },
  { 
    id: "C2025005", 
    nom: "BAMBA Serge", 
    classe: "3ème C", 
    type: "Régulier", 
    numeroTable: "005", 
    centre: "Collège Central", 
    salle: "B201", 
    dossier: "Incomplet",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    dateNaissance: "2008-09-03",
    lieuNaissance: "Yamoussoukro",
    sexe: "M"
  },
];

const centres = ["Lycée Moderne", "Collège Central", "Lycée Technique"];
const salles = ["A101", "A102", "A103", "B201", "B202", "B203"];
const classes = ["3ème A", "3ème B", "3ème C", "3ème D"];

export default function InscriptionCandidats() {
  const [candidats, setCandidats] = useState<Candidat[]>(initialCandidats);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("tous");
  const [filterDossier, setFilterDossier] = useState("tous");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCandidat, setSelectedCandidat] = useState<Candidat | null>(null);
  const [formatNumero, setFormatNumero] = useState("C2025XXX");
  const [formatTable, setFormatTable] = useState("XXX");

  const [newCandidat, setNewCandidat] = useState({
    nom: "",
    classe: "",
    type: "Libre" as "Régulier" | "Libre",
    centre: "",
    dateNaissance: "",
    lieuNaissance: "",
    sexe: "M" as "M" | "F"
  });

  // Filtrage
  const filteredCandidats = candidats.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "tous" || 
                     (filterType === "reguliers" && c.type === "Régulier") ||
                     (filterType === "libres" && c.type === "Libre");
    const matchDossier = filterDossier === "tous" || c.dossier === filterDossier;
    return matchSearch && matchType && matchDossier;
  });

  // Stats
  const totalCandidats = candidats.length;
  const reguliers = candidats.filter(c => c.type === "Régulier").length;
  const libres = candidats.filter(c => c.type === "Libre").length;
  const incomplets = candidats.filter(c => c.dossier !== "Complet").length;

  const handleAddCandidat = () => {
    const newId = `C2025${String(candidats.length + 1).padStart(3, '0')}`;
    const newNumTable = String(candidats.length + 1).padStart(3, '0');
    
    const candidat: Candidat = {
      id: newId,
      nom: newCandidat.nom,
      classe: newCandidat.type === "Libre" ? "-" : newCandidat.classe,
      type: newCandidat.type,
      numeroTable: newNumTable,
      centre: newCandidat.centre || centres[0],
      salle: "À affecter",
      dossier: "Incomplet",
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newCandidat.nom)}&background=random`,
      dateNaissance: newCandidat.dateNaissance,
      lieuNaissance: newCandidat.lieuNaissance,
      sexe: newCandidat.sexe
    };

    setCandidats(prev => [...prev, candidat]);
    toast.success(`Candidat ${newCandidat.type === "Libre" ? "libre" : ""} ajouté`, {
      description: `${newCandidat.nom} a été inscrit avec le numéro ${newId}`
    });
    setIsAddDialogOpen(false);
    setNewCandidat({ nom: "", classe: "", type: "Libre", centre: "", dateNaissance: "", lieuNaissance: "", sexe: "M" });
  };

  const handleEditCandidat = () => {
    if (!selectedCandidat) return;
    setCandidats(prev => prev.map(c => c.id === selectedCandidat.id ? selectedCandidat : c));
    toast.success("Candidat modifié", { description: `Les informations de ${selectedCandidat.nom} ont été mises à jour` });
    setIsEditDialogOpen(false);
    setSelectedCandidat(null);
  };

  const handleDeleteCandidat = () => {
    if (!selectedCandidat) return;
    setCandidats(prev => prev.filter(c => c.id !== selectedCandidat.id));
    toast.success("Candidat supprimé", { description: `${selectedCandidat.nom} a été retiré de la liste` });
    setIsDeleteDialogOpen(false);
    setSelectedCandidat(null);
  };

  const handleValiderDossier = (candidat: Candidat) => {
    setCandidats(prev => prev.map(c => c.id === candidat.id ? { ...c, dossier: "Complet" } : c));
    toast.success("Dossier validé", { description: `Le dossier de ${candidat.nom} est maintenant complet` });
  };

  const handleGenerateNumbers = () => {
    const updated = candidats.map((c, index) => ({
      ...c,
      id: `C2025${String(index + 1).padStart(3, '0')}`,
      numeroTable: String(index + 1).padStart(3, '0')
    }));
    setCandidats(updated);
    toast.success("Numéros générés", { description: `${candidats.length} numéros de candidat et de table attribués` });
  };

  const handleAffectationAuto = () => {
    let currentCentre = 0;
    let currentSalle = 0;
    let countInSalle = 0;
    const capaciteSalle = 30;

    const updated = candidats.map(c => {
      if (countInSalle >= capaciteSalle) {
        currentSalle++;
        countInSalle = 0;
        if (currentSalle >= salles.length / centres.length) {
          currentCentre++;
          currentSalle = 0;
        }
      }
      countInSalle++;
      return {
        ...c,
        centre: centres[currentCentre % centres.length],
        salle: salles[(currentCentre * 2 + currentSalle) % salles.length]
      };
    });

    setCandidats(updated);
    toast.success("Affectation terminée", { description: "Les candidats ont été répartis dans les centres et salles" });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des Candidats - BEPC 2025", 14, 15);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["N° Candidat", "Nom", "Classe", "Type", "N° Table", "Centre", "Salle", "Dossier"]],
      body: filteredCandidats.map(c => [c.id, c.nom, c.classe, c.type, c.numeroTable, c.centre, c.salle, c.dossier]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save("Candidats_BEPC_2025.pdf");
    toast.success("PDF exporté", { description: "La liste des candidats a été téléchargée" });
  };

  const handleImport = () => {
    toast.info("Import de candidats", { description: "Sélectionnez un fichier Excel ou CSV pour importer les candidats" });
  };

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
          <Button variant="outline" onClick={handleImport} className="gap-2">
            <Upload className="h-4 w-4" />
            Importer
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter PDF
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Candidat Libre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouveau Candidat</DialogTitle>
                <DialogDescription>Inscrivez un candidat libre ou régulier</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input 
                      placeholder="Ex: KOUASSI Jean"
                      value={newCandidat.nom}
                      onChange={(e) => setNewCandidat({...newCandidat, nom: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newCandidat.type} onValueChange={(v: "Régulier" | "Libre") => setNewCandidat({...newCandidat, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Libre">Candidat Libre</SelectItem>
                        <SelectItem value="Régulier">Candidat Régulier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {newCandidat.type === "Régulier" && (
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Select value={newCandidat.classe} onValueChange={(v) => setNewCandidat({...newCandidat, classe: v})}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de naissance</Label>
                    <Input 
                      type="date"
                      value={newCandidat.dateNaissance}
                      onChange={(e) => setNewCandidat({...newCandidat, dateNaissance: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lieu de naissance</Label>
                    <Input 
                      placeholder="Ex: Abidjan"
                      value={newCandidat.lieuNaissance}
                      onChange={(e) => setNewCandidat({...newCandidat, lieuNaissance: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sexe</Label>
                    <Select value={newCandidat.sexe} onValueChange={(v: "M" | "F") => setNewCandidat({...newCandidat, sexe: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Centre d'examen</Label>
                    <Select value={newCandidat.centre} onValueChange={(v) => setNewCandidat({...newCandidat, centre: v})}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        {centres.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleAddCandidat} disabled={!newCandidat.nom}>Inscrire</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCandidats}</div>
            <p className="text-xs text-muted-foreground mt-1">+{libres} cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidats Réguliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{reguliers}</div>
            <p className="text-xs text-muted-foreground mt-1">Classes d'examen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidats Libres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{libres}</div>
            <p className="text-xs text-muted-foreground mt-1">Inscrits manuellement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dossiers Incomplets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{incomplets}</div>
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
                  <CardDescription>BEPC 2025 - Session 1</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="reguliers">Réguliers</SelectItem>
                      <SelectItem value="libres">Libres</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDossier} onValueChange={setFilterDossier}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous dossiers</SelectItem>
                      <SelectItem value="Complet">Complets</SelectItem>
                      <SelectItem value="À corriger">À corriger</SelectItem>
                      <SelectItem value="Incomplet">Incomplets</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="w-64 pl-9"
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
                  {filteredCandidats.map((candidat) => (
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
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setSelectedCandidat(candidat); setIsViewDialogOpen(true); }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setSelectedCandidat(candidat); setIsEditDialogOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {candidat.dossier !== "Complet" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleValiderDossier(candidat)}
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => { setSelectedCandidat(candidat); setIsDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredCandidats.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun candidat trouvé avec ces critères
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Automatique des Numéros</CardTitle>
              <CardDescription>Génération automatique des numéros de table et de candidat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Sparkles className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold">Numérotation Automatique</h3>
                  <p className="text-sm text-muted-foreground">
                    Attribuer les numéros de candidat et de table selon l'ordre alphabétique
                  </p>
                </div>
                <Button onClick={handleGenerateNumbers}>Générer</Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Format Numéro Candidat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input 
                      value={formatNumero} 
                      onChange={(e) => setFormatNumero(e.target.value)}
                    />
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
                    <Input 
                      value={formatTable}
                      onChange={(e) => setFormatTable(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Exemple: 001, 002, 003...
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Aperçu de la numérotation</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>N° Candidat</TableHead>
                      <TableHead>N° Table</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidats.slice(0, 5).map(c => (
                      <TableRow key={c.id}>
                        <TableCell>{c.nom}</TableCell>
                        <TableCell className="font-mono">{c.id}</TableCell>
                        <TableCell className="font-mono">{c.numeroTable}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affectation des Centres et Salles</CardTitle>
              <CardDescription>Répartition automatique selon les capacités des centres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3">Centres Disponibles</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {centres.map((centre, i) => {
                      const affectes = candidats.filter(c => c.centre === centre).length;
                      const capacite = 100 + i * 50;
                      return (
                        <Card key={centre}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{centre}</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Capacité:</span>
                              <span className="font-medium">{capacite}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">Affectés:</span>
                              <span className="font-medium text-primary">{affectes}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Button className="w-full" onClick={handleAffectationAuto}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Affecter Automatiquement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Voir Candidat */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du Candidat</DialogTitle>
          </DialogHeader>
          {selectedCandidat && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCandidat.photo} />
                  <AvatarFallback>{selectedCandidat.nom.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCandidat.nom}</h3>
                  <p className="text-muted-foreground">{selectedCandidat.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Type:</span> {selectedCandidat.type}</div>
                <div><span className="text-muted-foreground">Classe:</span> {selectedCandidat.classe}</div>
                <div><span className="text-muted-foreground">N° Table:</span> {selectedCandidat.numeroTable}</div>
                <div><span className="text-muted-foreground">Centre:</span> {selectedCandidat.centre}</div>
                <div><span className="text-muted-foreground">Salle:</span> {selectedCandidat.salle}</div>
                <div><span className="text-muted-foreground">Dossier:</span> {selectedCandidat.dossier}</div>
                <div><span className="text-muted-foreground">Né(e) le:</span> {selectedCandidat.dateNaissance}</div>
                <div><span className="text-muted-foreground">Lieu:</span> {selectedCandidat.lieuNaissance}</div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
                <Button onClick={() => toast.info("Convocation générée en PDF")}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer Convocation
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Éditer Candidat */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier Candidat</DialogTitle>
          </DialogHeader>
          {selectedCandidat && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input 
                  value={selectedCandidat.nom}
                  onChange={(e) => setSelectedCandidat({...selectedCandidat, nom: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Centre</Label>
                  <Select value={selectedCandidat.centre} onValueChange={(v) => setSelectedCandidat({...selectedCandidat, centre: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {centres.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salle</Label>
                  <Select value={selectedCandidat.salle} onValueChange={(v) => setSelectedCandidat({...selectedCandidat, salle: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {salles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Statut dossier</Label>
                <Select 
                  value={selectedCandidat.dossier} 
                  onValueChange={(v: "Complet" | "À corriger" | "Incomplet") => setSelectedCandidat({...selectedCandidat, dossier: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Complet">Complet</SelectItem>
                    <SelectItem value="À corriger">À corriger</SelectItem>
                    <SelectItem value="Incomplet">Incomplet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleEditCandidat}>Enregistrer</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Supprimer Candidat */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer le candidat {selectedCandidat?.nom} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteCandidat}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
