import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, Search, Plus, AlertCircle, Calendar, User,
  CheckCircle, Clock, TrendingUp, Eye, Trash2, Mail, Phone
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Emprunt {
  id: number;
  livre: string;
  code: string;
  emprunteur: string;
  classe: string;
  dateEmprunt: string;
  dateRetourPrevue: string;
  statut: "En cours" | "En retard" | "Retourné";
  retard: number;
  contact?: string;
  email?: string;
}

const initialEmprunts: Emprunt[] = [
  { id: 1, livre: "Mathématiques Terminale D", code: "MAT-TLE-001", emprunteur: "KOUASSI Jean", classe: "Tle D", dateEmprunt: "01 Déc 2024", dateRetourPrevue: "15 Déc 2024", statut: "En cours", retard: 0, contact: "+225 07 12 34 56", email: "kouassi.j@email.ci" },
  { id: 2, livre: "Le Père Goriot - Balzac", code: "LIT-FRA-045", emprunteur: "DIALLO Fatoumata", classe: "1ère A", dateEmprunt: "28 Nov 2024", dateRetourPrevue: "12 Déc 2024", statut: "En retard", retard: 5, contact: "+225 05 98 76 54", email: "diallo.f@email.ci" },
  { id: 3, livre: "Physique-Chimie 2nde", code: "PHY-2ND-012", emprunteur: "TOURÉ Mohamed", classe: "2nde B", dateEmprunt: "05 Déc 2024", dateRetourPrevue: "19 Déc 2024", statut: "En cours", retard: 0, contact: "+225 01 23 45 67" },
  { id: 4, livre: "L'Aventure Ambiguë", code: "LIT-AFR-023", emprunteur: "SANOGO Aminata", classe: "3ème C", dateEmprunt: "20 Nov 2024", dateRetourPrevue: "04 Déc 2024", statut: "En retard", retard: 13, contact: "+225 07 89 01 23", email: "sanogo.a@email.ci" },
  { id: 5, livre: "SVT Cycle Collège", code: "SVT-COL-008", emprunteur: "KONE Ibrahim", classe: "4ème A", dateEmprunt: "08 Déc 2024", dateRetourPrevue: "22 Déc 2024", statut: "En cours", retard: 0 },
  { id: 6, livre: "English Grammar in Use", code: "ANG-GRA-019", emprunteur: "BAMBA Sarah", classe: "1ère C", dateEmprunt: "03 Nov 2024", dateRetourPrevue: "17 Nov 2024", statut: "Retourné", retard: 0, contact: "+225 05 67 89 01" },
  { id: 7, livre: "Histoire-Géo Terminale", code: "HIS-TLE-007", emprunteur: "TRAORE Moussa", classe: "Tle A", dateEmprunt: "15 Nov 2024", dateRetourPrevue: "29 Nov 2024", statut: "En retard", retard: 18, contact: "+225 01 11 22 33", email: "traore.m@email.ci" },
  { id: 8, livre: "Cahier d'Exercices Maths 6è", code: "MAT-6EM-034", emprunteur: "YAO Prisca", classe: "6ème B", dateEmprunt: "10 Déc 2024", dateRetourPrevue: "24 Déc 2024", statut: "En cours", retard: 0 },
];

const livresDisponibles = [
  { code: "MAT-TLE-002", titre: "Exercices Mathématiques Tle" },
  { code: "LIT-FRA-050", titre: "Les Misérables - Hugo" },
  { code: "PHY-1ER-015", titre: "Physique 1ère S" },
  { code: "HIS-3EM-012", titre: "Histoire-Géo 3ème" },
];

const elevesListe = [
  { id: 1, nom: "KOFFI Yao", classe: "Tle D" },
  { id: 2, nom: "DIALLO Awa", classe: "1ère A" },
  { id: 3, nom: "BAMBA Sekou", classe: "2nde B" },
  { id: 4, nom: "TRAORE Mariam", classe: "3ème C" },
];

export default function Emprunts() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>(initialEmprunts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  
  // Dialog states
  const [isNewEmpruntOpen, setIsNewEmpruntOpen] = useState(false);
  const [isRetourDialogOpen, setIsRetourDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRelanceOpen, setIsRelanceOpen] = useState(false);
  const [selectedEmprunt, setSelectedEmprunt] = useState<Emprunt | null>(null);
  
  // Form state
  const [newEmprunt, setNewEmprunt] = useState({
    eleve: "",
    livre: "",
    duree: "14"
  });

  // Filtrer les emprunts
  const filteredEmprunts = emprunts.filter(e => {
    const matchSearch = 
      e.livre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.emprunteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === "tous" || 
      (filterStatut === "encours" && e.statut === "En cours") ||
      (filterStatut === "retard" && e.statut === "En retard") ||
      (filterStatut === "retourne" && e.statut === "Retourné");
    return matchSearch && matchStatut;
  });

  // Statistiques dynamiques
  const stats = {
    enCours: emprunts.filter(e => e.statut === "En cours").length,
    enRetard: emprunts.filter(e => e.statut === "En retard").length,
    retardImportant: emprunts.filter(e => e.statut === "En retard" && e.retard > 7).length,
    retournes: emprunts.filter(e => e.statut === "Retourné").length,
  };

  const statsRetard = [
    { categorie: "En cours", count: stats.enCours, color: "bg-blue-500" },
    { categorie: "En retard (1-7j)", count: stats.enRetard - stats.retardImportant, color: "bg-yellow-500" },
    { categorie: "Retard important (7j+)", count: stats.retardImportant, color: "bg-red-500" },
    { categorie: "Retournés", count: stats.retournes, color: "bg-green-500" },
  ];

  // Handlers
  const handleNewEmprunt = () => {
    if (!newEmprunt.eleve || !newEmprunt.livre) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const eleve = elevesListe.find(e => e.nom === newEmprunt.eleve);
    const livre = livresDisponibles.find(l => l.code === newEmprunt.livre);
    const today = new Date();
    const retourDate = new Date(today);
    retourDate.setDate(retourDate.getDate() + parseInt(newEmprunt.duree));

    const nouvelEmprunt: Emprunt = {
      id: Math.max(...emprunts.map(e => e.id)) + 1,
      livre: livre?.titre || "",
      code: newEmprunt.livre,
      emprunteur: newEmprunt.eleve,
      classe: eleve?.classe || "",
      dateEmprunt: today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      dateRetourPrevue: retourDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      statut: "En cours",
      retard: 0
    };

    setEmprunts([nouvelEmprunt, ...emprunts]);
    setIsNewEmpruntOpen(false);
    setNewEmprunt({ eleve: "", livre: "", duree: "14" });
    toast.success(`Emprunt enregistré pour ${newEmprunt.eleve}`, {
      description: `${livre?.titre} - Retour prévu le ${retourDate.toLocaleDateString('fr-FR')}`
    });
  };

  const handleRetour = () => {
    if (!selectedEmprunt) return;
    
    setEmprunts(prev => prev.map(e => 
      e.id === selectedEmprunt.id 
        ? { ...e, statut: "Retourné" as const, retard: 0 }
        : e
    ));
    
    toast.success(`Retour enregistré`, {
      description: `${selectedEmprunt.livre} retourné par ${selectedEmprunt.emprunteur}`
    });
    setIsRetourDialogOpen(false);
    setSelectedEmprunt(null);
  };

  const openRetourDialog = (emprunt: Emprunt) => {
    setSelectedEmprunt(emprunt);
    setIsRetourDialogOpen(true);
  };

  const openDetails = (emprunt: Emprunt) => {
    setSelectedEmprunt(emprunt);
    setIsDetailsOpen(true);
  };

  const handleRelance = (emprunt: Emprunt) => {
    setSelectedEmprunt(emprunt);
    setIsRelanceOpen(true);
  };

  const sendRelance = (type: "sms" | "email") => {
    if (!selectedEmprunt) return;
    
    if (type === "email" && !selectedEmprunt.email) {
      toast.error("Aucune adresse email disponible pour cet élève");
      return;
    }
    
    toast.success(`Relance ${type.toUpperCase()} envoyée`, {
      description: `Rappel envoyé à ${selectedEmprunt.emprunteur} pour "${selectedEmprunt.livre}"`
    });
    setIsRelanceOpen(false);
    setSelectedEmprunt(null);
  };

  const handleDelete = (id: number) => {
    setEmprunts(prev => prev.filter(e => e.id !== id));
    toast.success("Emprunt supprimé de l'historique");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emprunts & Retours</h1>
          <p className="text-muted-foreground">Gestion des prêts de livres et ressources</p>
        </div>
        <Button onClick={() => setIsNewEmpruntOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Emprunt
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emprunts Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enCours}</div>
            <p className="text-xs text-muted-foreground">En circulation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.enRetard}</div>
            <p className="text-xs text-muted-foreground">Dont {stats.retardImportant} retard important</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retours Aujourd'hui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600">8 déjà retournés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Retour</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-green-600">+2.1% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>État des Emprunts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsRetard.map((stat) => (
                <div key={stat.categorie} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${stat.color}`} />
                      <span className="text-sm">{stat.categorie}</span>
                    </div>
                    <span className="text-sm font-bold">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Emprunts</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="tous">Tous</SelectItem>
                    <SelectItem value="encours">En cours</SelectItem>
                    <SelectItem value="retard">En retard</SelectItem>
                    <SelectItem value="retourne">Retournés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livre</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Emprunteur</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Date Emprunt</TableHead>
                  <TableHead>Retour Prévu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmprunts.map((emprunt) => (
                  <TableRow key={emprunt.id}>
                    <TableCell className="font-medium">{emprunt.livre}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{emprunt.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {emprunt.emprunteur}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{emprunt.classe}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {emprunt.dateEmprunt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {emprunt.dateRetourPrevue}
                      </div>
                    </TableCell>
                    <TableCell>
                      {emprunt.statut === "En retard" ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Retard {emprunt.retard}j
                        </Badge>
                      ) : emprunt.statut === "Retourné" ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Retourné
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          En cours
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openDetails(emprunt)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {emprunt.statut !== "Retourné" ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openRetourDialog(emprunt)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Retour
                            </Button>
                            {emprunt.statut === "En retard" && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRelance(emprunt)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(emprunt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Nouvel Emprunt */}
      <Dialog open={isNewEmpruntOpen} onOpenChange={setIsNewEmpruntOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel Emprunt</DialogTitle>
            <DialogDescription>Enregistrer un nouvel emprunt de livre</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Élève</Label>
              <Select value={newEmprunt.eleve} onValueChange={(v) => setNewEmprunt({...newEmprunt, eleve: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un élève" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {elevesListe.map(eleve => (
                    <SelectItem key={eleve.id} value={eleve.nom}>
                      {eleve.nom} - {eleve.classe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Livre</Label>
              <Select value={newEmprunt.livre} onValueChange={(v) => setNewEmprunt({...newEmprunt, livre: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {livresDisponibles.map(livre => (
                    <SelectItem key={livre.code} value={livre.code}>
                      {livre.titre} ({livre.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Durée d'emprunt</Label>
              <Select value={newEmprunt.duree} onValueChange={(v) => setNewEmprunt({...newEmprunt, duree: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="14">14 jours</SelectItem>
                  <SelectItem value="21">21 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEmpruntOpen(false)}>Annuler</Button>
            <Button onClick={handleNewEmprunt}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmation Retour */}
      <Dialog open={isRetourDialogOpen} onOpenChange={setIsRetourDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le Retour</DialogTitle>
            <DialogDescription>
              Enregistrer le retour de "{selectedEmprunt?.livre}" par {selectedEmprunt?.emprunteur}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Livre:</strong> {selectedEmprunt?.livre}</p>
              <p><strong>Code:</strong> {selectedEmprunt?.code}</p>
              <p><strong>Emprunteur:</strong> {selectedEmprunt?.emprunteur}</p>
              <p><strong>Date d'emprunt:</strong> {selectedEmprunt?.dateEmprunt}</p>
              {selectedEmprunt?.statut === "En retard" && (
                <Badge variant="destructive">Retard de {selectedEmprunt?.retard} jours</Badge>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRetourDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleRetour}>Confirmer le Retour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'Emprunt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Livre</Label>
                <p className="font-medium">{selectedEmprunt?.livre}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Code</Label>
                <p className="font-medium">{selectedEmprunt?.code}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Emprunteur</Label>
                <p className="font-medium">{selectedEmprunt?.emprunteur}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Classe</Label>
                <p className="font-medium">{selectedEmprunt?.classe}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Date d'emprunt</Label>
                <p className="font-medium">{selectedEmprunt?.dateEmprunt}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Retour prévu</Label>
                <p className="font-medium">{selectedEmprunt?.dateRetourPrevue}</p>
              </div>
              {selectedEmprunt?.contact && (
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {selectedEmprunt.contact}
                  </p>
                </div>
              )}
              {selectedEmprunt?.email && (
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedEmprunt.email}
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">Statut</Label>
              <div className="mt-1">
                {selectedEmprunt?.statut === "En retard" ? (
                  <Badge variant="destructive">Retard de {selectedEmprunt?.retard} jours</Badge>
                ) : selectedEmprunt?.statut === "Retourné" ? (
                  <Badge variant="default">Retourné</Badge>
                ) : (
                  <Badge variant="secondary">En cours</Badge>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Relance */}
      <Dialog open={isRelanceOpen} onOpenChange={setIsRelanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer une Relance</DialogTitle>
            <DialogDescription>
              Rappeler à {selectedEmprunt?.emprunteur} de retourner "{selectedEmprunt?.livre}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800 font-medium">Retard de {selectedEmprunt?.retard} jours</p>
              <p className="text-red-600 text-sm">Retour prévu le {selectedEmprunt?.dateRetourPrevue}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => sendRelance("sms")}
                disabled={!selectedEmprunt?.contact}
              >
                <Phone className="h-6 w-6" />
                <span>Envoyer SMS</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => sendRelance("email")}
                disabled={!selectedEmprunt?.email}
              >
                <Mail className="h-6 w-6" />
                <span>Envoyer Email</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRelanceOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
