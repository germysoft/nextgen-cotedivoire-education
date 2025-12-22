import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Plus, 
  Send, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle,
  FileText,
  Users,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  Truck,
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  Building2,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
interface SuggestionAchat {
  id: string;
  titre: string;
  auteur: string;
  isbn?: string;
  categorie: string;
  priorite: "haute" | "moyenne" | "basse";
  source: "systeme" | "enseignant" | "eleve" | "bibliothecaire";
  demandeur?: string;
  dateSuggestion: string;
  justification: string;
  statut: "en_attente" | "approuvee" | "refusee" | "commandee";
  votes: number;
  commentaires: number;
  prixEstime?: number;
}

interface DemandeEnseignant {
  id: string;
  enseignant: string;
  matiere: string;
  titre: string;
  auteur?: string;
  quantite: number;
  urgence: "normale" | "urgente" | "tres_urgente";
  justification: string;
  dateDemande: string;
  statut: "en_attente" | "validee" | "refusee" | "en_commande" | "livree";
  dateReponse?: string;
  commentaireAdmin?: string;
}

interface Commande {
  id: string;
  reference: string;
  fournisseur: string;
  dateCommande: string;
  dateLivraisonPrevue: string;
  dateLivraisonEffective?: string;
  statut: "en_preparation" | "envoyee" | "en_transit" | "livree" | "partielle" | "annulee";
  montantTotal: number;
  articles: {
    titre: string;
    quantite: number;
    prixUnitaire: number;
    quantiteLivree?: number;
  }[];
  progression: number;
}

interface Fournisseur {
  id: string;
  nom: string;
  contact: string;
  email: string;
  telephone: string;
  adresse: string;
  note: number;
  commandesTotal: number;
}

// Mock data
const mockSuggestions: SuggestionAchat[] = [
  { id: "SUG001", titre: "Introduction à l'Algorithmique", auteur: "Thomas Cormen", isbn: "978-2-10-003922-7", categorie: "Informatique", priorite: "haute", source: "enseignant", demandeur: "M. Koné", dateSuggestion: "2024-01-18", justification: "Essentiel pour le nouveau programme d'informatique en Terminale", statut: "approuvee", votes: 12, commentaires: 3, prixEstime: 45000 },
  { id: "SUG002", titre: "Physique Quantique pour débutants", auteur: "Paul Davies", categorie: "Sciences", priorite: "moyenne", source: "systeme", dateSuggestion: "2024-01-15", justification: "Basé sur les tendances de lecture et demandes fréquentes", statut: "en_attente", votes: 8, commentaires: 1, prixEstime: 28000 },
  { id: "SUG003", titre: "L'Afrique en mouvement", auteur: "Achille Mbembe", categorie: "Histoire", priorite: "haute", source: "bibliothecaire", demandeur: "Mme Touré", dateSuggestion: "2024-01-12", justification: "Complète la section histoire africaine contemporaine", statut: "commandee", votes: 15, commentaires: 5, prixEstime: 22000 },
  { id: "SUG004", titre: "Anglais des affaires", auteur: "Cambridge", categorie: "Langues", priorite: "basse", source: "eleve", demandeur: "Koné Aminata (Term A)", dateSuggestion: "2024-01-10", justification: "Pour préparer les études supérieures", statut: "en_attente", votes: 4, commentaires: 0, prixEstime: 18000 },
];

const mockDemandes: DemandeEnseignant[] = [
  { id: "DEM001", enseignant: "M. Diabaté", matiere: "Mathématiques", titre: "Annales BAC C 2020-2024", quantite: 15, urgence: "tres_urgente", justification: "Préparation intensive BAC pour les Terminales C", dateDemande: "2024-01-20", statut: "validee", dateReponse: "2024-01-21", commentaireAdmin: "Commande passée chez Hatier" },
  { id: "DEM002", enseignant: "Mme Coulibaly", matiere: "Français", titre: "Le Monde s'effondre - Chinua Achebe", quantite: 30, urgence: "normale", justification: "Nouvelle œuvre au programme de 1ère", dateDemande: "2024-01-18", statut: "en_attente" },
  { id: "DEM003", enseignant: "M. Traoré", matiere: "Histoire-Géographie", titre: "Atlas du monde contemporain", quantite: 5, urgence: "urgente", justification: "Atlas actuels obsolètes", dateDemande: "2024-01-15", statut: "en_commande" },
  { id: "DEM004", enseignant: "Mme Konaté", matiere: "SVT", titre: "Biologie cellulaire illustrée", quantite: 10, urgence: "normale", justification: "Supports visuels pour TP", dateDemande: "2024-01-10", statut: "livree", dateReponse: "2024-01-12" },
];

const mockCommandes: Commande[] = [
  { 
    id: "CMD001", 
    reference: "CMD-2024-001", 
    fournisseur: "Librairie de France Abidjan", 
    dateCommande: "2024-01-15", 
    dateLivraisonPrevue: "2024-02-01", 
    statut: "en_transit", 
    montantTotal: 485000, 
    articles: [
      { titre: "Introduction à l'Algorithmique", quantite: 5, prixUnitaire: 45000 },
      { titre: "L'Afrique en mouvement", quantite: 10, prixUnitaire: 22000 },
    ],
    progression: 65
  },
  { 
    id: "CMD002", 
    reference: "CMD-2024-002", 
    fournisseur: "CEDA", 
    dateCommande: "2024-01-20", 
    dateLivraisonPrevue: "2024-02-10", 
    statut: "envoyee", 
    montantTotal: 750000, 
    articles: [
      { titre: "Annales BAC C 2020-2024", quantite: 15, prixUnitaire: 12000 },
      { titre: "Le Monde s'effondre", quantite: 30, prixUnitaire: 8500 },
      { titre: "Atlas du monde contemporain", quantite: 5, prixUnitaire: 35000 },
    ],
    progression: 30
  },
  { 
    id: "CMD003", 
    reference: "CMD-2023-045", 
    fournisseur: "NEI", 
    dateCommande: "2023-12-01", 
    dateLivraisonPrevue: "2023-12-20", 
    dateLivraisonEffective: "2023-12-18",
    statut: "livree", 
    montantTotal: 320000, 
    articles: [
      { titre: "Biologie cellulaire illustrée", quantite: 10, prixUnitaire: 18000, quantiteLivree: 10 },
      { titre: "Chimie Terminale D", quantite: 8, prixUnitaire: 17500, quantiteLivree: 8 },
    ],
    progression: 100
  },
];

const mockFournisseurs: Fournisseur[] = [
  { id: "FRN001", nom: "Librairie de France Abidjan", contact: "M. Dupont", email: "contact@ldf-abidjan.ci", telephone: "+225 27 20 21 22 23", adresse: "Plateau, Rue du Commerce", note: 4.5, commandesTotal: 12 },
  { id: "FRN002", nom: "CEDA", contact: "Mme Bamba", email: "commandes@ceda.ci", telephone: "+225 27 20 30 40 50", adresse: "Cocody, Boulevard Latrille", note: 4.2, commandesTotal: 8 },
  { id: "FRN003", nom: "NEI (Nouvelles Éditions Ivoiriennes)", contact: "M. Konan", email: "nei@nei.ci", telephone: "+225 27 20 25 35 45", adresse: "Zone industrielle Yopougon", note: 4.8, commandesTotal: 15 },
];

const categories = ["Tous", "Manuels scolaires", "Littérature", "Sciences", "Mathématiques", "Histoire", "Langues", "Informatique"];

export default function Acquisitions() {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [suggestions, setSuggestions] = useState<SuggestionAchat[]>(mockSuggestions);
  const [demandes, setDemandes] = useState<DemandeEnseignant[]>(mockDemandes);
  const [commandes, setCommandes] = useState<Commande[]>(mockCommandes);
  const [showNewSuggestion, setShowNewSuggestion] = useState(false);
  const [showNewDemande, setShowNewDemande] = useState(false);
  const [showNewCommande, setShowNewCommande] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [filterCategorie, setFilterCategorie] = useState("Tous");

  // Nouvelle suggestion
  const [newSuggestion, setNewSuggestion] = useState({
    titre: "",
    auteur: "",
    isbn: "",
    categorie: "",
    priorite: "moyenne",
    justification: "",
    prixEstime: ""
  });

  // Nouvelle demande
  const [newDemande, setNewDemande] = useState({
    enseignant: "",
    matiere: "",
    titre: "",
    auteur: "",
    quantite: "1",
    urgence: "normale",
    justification: ""
  });

  const handleAddSuggestion = () => {
    if (!newSuggestion.titre || !newSuggestion.categorie) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const suggestion: SuggestionAchat = {
      id: `SUG${Date.now()}`,
      titre: newSuggestion.titre,
      auteur: newSuggestion.auteur,
      isbn: newSuggestion.isbn,
      categorie: newSuggestion.categorie,
      priorite: newSuggestion.priorite as "haute" | "moyenne" | "basse",
      source: "bibliothecaire",
      demandeur: "Bibliothécaire",
      dateSuggestion: new Date().toISOString().split('T')[0],
      justification: newSuggestion.justification,
      statut: "en_attente",
      votes: 0,
      commentaires: 0,
      prixEstime: newSuggestion.prixEstime ? parseInt(newSuggestion.prixEstime) : undefined
    };

    setSuggestions(prev => [suggestion, ...prev]);
    setShowNewSuggestion(false);
    setNewSuggestion({ titre: "", auteur: "", isbn: "", categorie: "", priorite: "moyenne", justification: "", prixEstime: "" });
    toast.success("Suggestion ajoutée avec succès");
  };

  const handleAddDemande = () => {
    if (!newDemande.enseignant || !newDemande.titre || !newDemande.matiere) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const demande: DemandeEnseignant = {
      id: `DEM${Date.now()}`,
      enseignant: newDemande.enseignant,
      matiere: newDemande.matiere,
      titre: newDemande.titre,
      auteur: newDemande.auteur,
      quantite: parseInt(newDemande.quantite),
      urgence: newDemande.urgence as "normale" | "urgente" | "tres_urgente",
      justification: newDemande.justification,
      dateDemande: new Date().toISOString().split('T')[0],
      statut: "en_attente"
    };

    setDemandes(prev => [demande, ...prev]);
    setShowNewDemande(false);
    setNewDemande({ enseignant: "", matiere: "", titre: "", auteur: "", quantite: "1", urgence: "normale", justification: "" });
    toast.success("Demande enregistrée avec succès");
  };

  const handleApproveSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, statut: "approuvee" as const } : s));
    toast.success("Suggestion approuvée");
  };

  const handleRejectSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, statut: "refusee" as const } : s));
    toast.info("Suggestion refusée");
  };

  const handleValidateDemande = (id: string) => {
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: "validee" as const, dateReponse: new Date().toISOString().split('T')[0] } : d));
    toast.success("Demande validée");
  };

  const handleRejectDemande = (id: string) => {
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: "refusee" as const, dateReponse: new Date().toISOString().split('T')[0] } : d));
    toast.info("Demande refusée");
  };

  const exportCommandesPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Suivi des Commandes - Bibliothèque", 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Référence", "Fournisseur", "Date", "Montant", "Statut", "Progression"]],
      body: commandes.map(c => [
        c.reference,
        c.fournisseur,
        c.dateCommande,
        `${c.montantTotal.toLocaleString()} FCFA`,
        c.statut.replace('_', ' '),
        `${c.progression}%`
      ]),
    });

    doc.save("commandes-bibliotheque.pdf");
    toast.success("PDF des commandes généré");
  };

  const getStatutBadge = (statut: string) => {
    const config: { [key: string]: { className: string; label: string } } = {
      en_attente: { className: "bg-yellow-100 text-yellow-800", label: "En attente" },
      approuvee: { className: "bg-green-100 text-green-800", label: "Approuvée" },
      validee: { className: "bg-green-100 text-green-800", label: "Validée" },
      refusee: { className: "bg-red-100 text-red-800", label: "Refusée" },
      commandee: { className: "bg-blue-100 text-blue-800", label: "Commandée" },
      en_commande: { className: "bg-blue-100 text-blue-800", label: "En commande" },
      livree: { className: "bg-green-100 text-green-800", label: "Livrée" },
      en_preparation: { className: "bg-gray-100 text-gray-800", label: "En préparation" },
      envoyee: { className: "bg-blue-100 text-blue-800", label: "Envoyée" },
      en_transit: { className: "bg-purple-100 text-purple-800", label: "En transit" },
      partielle: { className: "bg-orange-100 text-orange-800", label: "Partielle" },
      annulee: { className: "bg-red-100 text-red-800", label: "Annulée" },
    };
    const cfg = config[statut] || { className: "bg-gray-100", label: statut };
    return <Badge className={cfg.className}>{cfg.label}</Badge>;
  };

  const getPrioriteBadge = (priorite: string) => {
    const config: { [key: string]: string } = {
      haute: "bg-red-100 text-red-800",
      moyenne: "bg-yellow-100 text-yellow-800",
      basse: "bg-green-100 text-green-800",
    };
    return <Badge className={config[priorite]}>{priorite.charAt(0).toUpperCase() + priorite.slice(1)}</Badge>;
  };

  const getUrgenceBadge = (urgence: string) => {
    const config: { [key: string]: { className: string; label: string } } = {
      normale: { className: "bg-gray-100 text-gray-800", label: "Normale" },
      urgente: { className: "bg-orange-100 text-orange-800", label: "Urgente" },
      tres_urgente: { className: "bg-red-100 text-red-800", label: "Très urgente" },
    };
    const cfg = config[urgence];
    return <Badge className={cfg.className}>{cfg.label}</Badge>;
  };

  const filteredSuggestions = suggestions.filter(s => {
    const matchSearch = s.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.auteur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === "tous" || s.statut === filterStatut;
    const matchCategorie = filterCategorie === "Tous" || s.categorie === filterCategorie;
    return matchSearch && matchStatut && matchCategorie;
  });

  const filteredDemandes = demandes.filter(d => {
    const matchSearch = d.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.enseignant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === "tous" || d.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  // Stats
  const statsGlobales = {
    suggestionsEnAttente: suggestions.filter(s => s.statut === "en_attente").length,
    demandesEnAttente: demandes.filter(d => d.statut === "en_attente").length,
    commandesEnCours: commandes.filter(c => !["livree", "annulee"].includes(c.statut)).length,
    budgetCommandes: commandes.filter(c => c.statut !== "annulee").reduce((acc, c) => acc + c.montantTotal, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Gestion des Acquisitions
          </h1>
          <p className="text-muted-foreground mt-1">
            Suggestions d'achat, demandes enseignants et suivi des commandes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCommandesPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsGlobales.suggestionsEnAttente}</p>
              <p className="text-sm text-muted-foreground">Suggestions en attente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsGlobales.demandesEnAttente}</p>
              <p className="text-sm text-muted-foreground">Demandes enseignants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsGlobales.commandesEnCours}</p>
              <p className="text-sm text-muted-foreground">Commandes en cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsGlobales.budgetCommandes.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">FCFA en commandes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suggestions" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Suggestions ({suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="demandes" className="gap-2">
            <Users className="h-4 w-4" />
            Demandes ({demandes.length})
          </TabsTrigger>
          <TabsTrigger value="commandes" className="gap-2">
            <Package className="h-4 w-4" />
            Commandes ({commandes.length})
          </TabsTrigger>
          <TabsTrigger value="fournisseurs" className="gap-2">
            <Building2 className="h-4 w-4" />
            Fournisseurs
          </TabsTrigger>
        </TabsList>

        {/* Onglet Suggestions */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Suggestions d'achat
                </span>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous statuts</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="approuvee">Approuvée</SelectItem>
                      <SelectItem value="refusee">Refusée</SelectItem>
                      <SelectItem value="commandee">Commandée</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={showNewSuggestion} onOpenChange={setShowNewSuggestion}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nouvelle suggestion
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Ajouter une suggestion d'achat</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Titre *</Label>
                            <Input
                              value={newSuggestion.titre}
                              onChange={(e) => setNewSuggestion(prev => ({ ...prev, titre: e.target.value }))}
                              placeholder="Titre du livre"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Auteur</Label>
                            <Input
                              value={newSuggestion.auteur}
                              onChange={(e) => setNewSuggestion(prev => ({ ...prev, auteur: e.target.value }))}
                              placeholder="Auteur"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>ISBN</Label>
                            <Input
                              value={newSuggestion.isbn}
                              onChange={(e) => setNewSuggestion(prev => ({ ...prev, isbn: e.target.value }))}
                              placeholder="978-..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Catégorie *</Label>
                            <Select value={newSuggestion.categorie} onValueChange={(v) => setNewSuggestion(prev => ({ ...prev, categorie: v }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.filter(c => c !== "Tous").map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Priorité</Label>
                            <Select value={newSuggestion.priorite} onValueChange={(v) => setNewSuggestion(prev => ({ ...prev, priorite: v }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="haute">Haute</SelectItem>
                                <SelectItem value="moyenne">Moyenne</SelectItem>
                                <SelectItem value="basse">Basse</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Prix estimé (FCFA)</Label>
                            <Input
                              type="number"
                              value={newSuggestion.prixEstime}
                              onChange={(e) => setNewSuggestion(prev => ({ ...prev, prixEstime: e.target.value }))}
                              placeholder="25000"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Justification</Label>
                          <Textarea
                            value={newSuggestion.justification}
                            onChange={(e) => setNewSuggestion(prev => ({ ...prev, justification: e.target.value }))}
                            placeholder="Pourquoi ce livre serait utile..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewSuggestion(false)}>Annuler</Button>
                        <Button onClick={handleAddSuggestion}>Ajouter</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuggestions.map(sugg => (
                    <TableRow key={sugg.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sugg.titre}</p>
                          <p className="text-sm text-muted-foreground">{sugg.auteur}</p>
                          {sugg.isbn && <p className="text-xs text-muted-foreground">ISBN: {sugg.isbn}</p>}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{sugg.categorie}</Badge></TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="capitalize">{sugg.source}</p>
                          {sugg.demandeur && <p className="text-muted-foreground">{sugg.demandeur}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{getPrioriteBadge(sugg.priorite)}</TableCell>
                      <TableCell>{sugg.prixEstime ? `${sugg.prixEstime.toLocaleString()} F` : "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span>{sugg.votes}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(sugg.statut)}</TableCell>
                      <TableCell>
                        {sugg.statut === "en_attente" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleApproveSuggestion(sugg.id)} className="text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleRejectSuggestion(sugg.id)} className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {sugg.statut === "approuvee" && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            Commander
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Demandes Enseignants */}
        <TabsContent value="demandes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Demandes des enseignants
                </span>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Dialog open={showNewDemande} onOpenChange={setShowNewDemande}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nouvelle demande
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Enregistrer une demande enseignant</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Enseignant *</Label>
                            <Input
                              value={newDemande.enseignant}
                              onChange={(e) => setNewDemande(prev => ({ ...prev, enseignant: e.target.value }))}
                              placeholder="Nom de l'enseignant"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Matière *</Label>
                            <Input
                              value={newDemande.matiere}
                              onChange={(e) => setNewDemande(prev => ({ ...prev, matiere: e.target.value }))}
                              placeholder="Matière enseignée"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Titre du livre *</Label>
                            <Input
                              value={newDemande.titre}
                              onChange={(e) => setNewDemande(prev => ({ ...prev, titre: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Auteur</Label>
                            <Input
                              value={newDemande.auteur}
                              onChange={(e) => setNewDemande(prev => ({ ...prev, auteur: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Quantité</Label>
                            <Input
                              type="number"
                              min="1"
                              value={newDemande.quantite}
                              onChange={(e) => setNewDemande(prev => ({ ...prev, quantite: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Urgence</Label>
                            <Select value={newDemande.urgence} onValueChange={(v) => setNewDemande(prev => ({ ...prev, urgence: v }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normale">Normale</SelectItem>
                                <SelectItem value="urgente">Urgente</SelectItem>
                                <SelectItem value="tres_urgente">Très urgente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Justification</Label>
                          <Textarea
                            value={newDemande.justification}
                            onChange={(e) => setNewDemande(prev => ({ ...prev, justification: e.target.value }))}
                            placeholder="Pourquoi ces ouvrages sont nécessaires..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewDemande(false)}>Annuler</Button>
                        <Button onClick={handleAddDemande}>Enregistrer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Livre demandé</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Urgence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDemandes.map(dem => (
                    <TableRow key={dem.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dem.enseignant}</p>
                          <p className="text-sm text-muted-foreground">{dem.matiere}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dem.titre}</p>
                          {dem.auteur && <p className="text-sm text-muted-foreground">{dem.auteur}</p>}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{dem.quantite}</Badge></TableCell>
                      <TableCell>{getUrgenceBadge(dem.urgence)}</TableCell>
                      <TableCell>{dem.dateDemande}</TableCell>
                      <TableCell>{getStatutBadge(dem.statut)}</TableCell>
                      <TableCell>
                        {dem.statut === "en_attente" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleValidateDemande(dem.id)} className="text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleRejectDemande(dem.id)} className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {dem.statut === "validee" && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            Commander
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Commandes */}
        <TabsContent value="commandes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Suivi des commandes
                </span>
                <Button className="gap-2" onClick={() => setShowNewCommande(true)}>
                  <Plus className="h-4 w-4" />
                  Nouvelle commande
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {commandes.map(cmd => (
                <Card key={cmd.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{cmd.reference}</h4>
                          {getStatutBadge(cmd.statut)}
                        </div>
                        <p className="text-muted-foreground">{cmd.fournisseur}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{cmd.montantTotal.toLocaleString()} FCFA</p>
                        <p className="text-sm text-muted-foreground">Commandé le {cmd.dateCommande}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{cmd.progression}%</span>
                      </div>
                      <Progress value={cmd.progression} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Livraison prévue: <strong>{cmd.dateLivraisonPrevue}</strong></span>
                      </div>
                      {cmd.dateLivraisonEffective && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Livré le: <strong>{cmd.dateLivraisonEffective}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm font-medium mb-2">Articles ({cmd.articles.length})</p>
                      <div className="space-y-1">
                        {cmd.articles.map((art, idx) => (
                          <div key={idx} className="flex justify-between text-sm py-1 px-2 bg-muted/50 rounded">
                            <span>{art.titre} x{art.quantite}</span>
                            <span>{(art.prixUnitaire * art.quantite).toLocaleString()} FCFA</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="h-3 w-3" />
                        Détails
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Bon de commande
                      </Button>
                      {cmd.statut === "en_transit" && (
                        <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Réceptionner
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Fournisseurs */}
        <TabsContent value="fournisseurs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Fournisseurs
                </span>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un fournisseur
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockFournisseurs.map(frn => (
                  <Card key={frn.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{frn.nom}</h4>
                          <p className="text-sm text-muted-foreground">{frn.contact}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{frn.note}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-muted-foreground" />
                          {frn.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          {frn.telephone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {frn.adresse}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <Badge variant="secondary">{frn.commandesTotal} commandes</Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
