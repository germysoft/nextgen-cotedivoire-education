import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Pill, AlertTriangle, Package, Calendar,
  TrendingDown, TrendingUp, RefreshCw, Download, Filter,
  Clock, CheckCircle, XCircle, BarChart3, ShoppingCart, Trash2, Edit, Save
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
interface Medicament {
  id: number;
  nom: string;
  dci: string;
  categorie: string;
  forme: string;
  dosage: string;
  quantite: number;
  seuilAlerte: number;
  seuilCritique: number;
  datePeremption: string;
  lot: string;
  fournisseur: string;
  prixUnitaire: number;
  emplacement: string;
  derniereEntree: string;
  derniereSortie: string;
}

interface Mouvement {
  id: number;
  date: string;
  heure: string;
  medicament: string;
  type: "entree" | "sortie";
  quantite: number;
  motif: string;
  operateur: string;
  eleve?: string;
}

// Initial mock data
const initialStockMedicaments: Medicament[] = [
  {
    id: 1,
    nom: "Paracétamol",
    dci: "Paracétamol",
    categorie: "Antalgique",
    forme: "Comprimé",
    dosage: "1000mg",
    quantite: 150,
    seuilAlerte: 50,
    seuilCritique: 20,
    datePeremption: "2025-06-15",
    lot: "LOT-2024-001",
    fournisseur: "Pharma CI",
    prixUnitaire: 50,
    emplacement: "Armoire A - Étagère 1",
    derniereEntree: "01/12/2024",
    derniereSortie: "15/12/2024"
  },
  {
    id: 2,
    nom: "Ibuprofène",
    dci: "Ibuprofène",
    categorie: "Anti-inflammatoire",
    forme: "Comprimé",
    dosage: "400mg",
    quantite: 45,
    seuilAlerte: 50,
    seuilCritique: 20,
    datePeremption: "2025-03-20",
    lot: "LOT-2024-002",
    fournisseur: "Pharma CI",
    prixUnitaire: 75,
    emplacement: "Armoire A - Étagère 1",
    derniereEntree: "15/11/2024",
    derniereSortie: "14/12/2024"
  },
  {
    id: 3,
    nom: "Ventoline",
    dci: "Salbutamol",
    categorie: "Bronchodilatateur",
    forme: "Aérosol",
    dosage: "100µg/dose",
    quantite: 8,
    seuilAlerte: 10,
    seuilCritique: 5,
    datePeremption: "2025-01-10",
    lot: "LOT-2024-003",
    fournisseur: "GSK Pharma",
    prixUnitaire: 3500,
    emplacement: "Armoire B - Étagère 2",
    derniereEntree: "01/10/2024",
    derniereSortie: "14/12/2024"
  },
  {
    id: 4,
    nom: "Doliprane",
    dci: "Paracétamol",
    categorie: "Antalgique",
    forme: "Sirop",
    dosage: "2.4%",
    quantite: 12,
    seuilAlerte: 15,
    seuilCritique: 5,
    datePeremption: "2024-12-31",
    lot: "LOT-2024-004",
    fournisseur: "Sanofi",
    prixUnitaire: 2500,
    emplacement: "Armoire A - Étagère 2",
    derniereEntree: "20/09/2024",
    derniereSortie: "10/12/2024"
  },
  {
    id: 5,
    nom: "Smecta",
    dci: "Diosmectite",
    categorie: "Antidiarrhéique",
    forme: "Sachet",
    dosage: "3g",
    quantite: 60,
    seuilAlerte: 30,
    seuilCritique: 10,
    datePeremption: "2026-02-28",
    lot: "LOT-2024-005",
    fournisseur: "Ipsen",
    prixUnitaire: 150,
    emplacement: "Armoire A - Étagère 3",
    derniereEntree: "05/12/2024",
    derniereSortie: "12/12/2024"
  },
];

const initialMouvements: Mouvement[] = [
  { id: 1, date: "15/12/2024", heure: "10:30", medicament: "Paracétamol 1000mg", type: "sortie", quantite: 2, motif: "Consultation - Fièvre", operateur: "Inf. DIABATÉ", eleve: "KOUASSI Jean" },
  { id: 2, date: "15/12/2024", heure: "11:15", medicament: "Ibuprofène 400mg", type: "sortie", quantite: 1, motif: "Consultation - Maux de tête", operateur: "Inf. DIABATÉ", eleve: "DIALLO Fatoumata" },
  { id: 3, date: "14/12/2024", heure: "15:30", medicament: "Ventoline 100µg", type: "sortie", quantite: 1, motif: "Urgence - Crise asthme", operateur: "Dr. KONÉ", eleve: "KONE Ibrahim" },
  { id: 4, date: "05/12/2024", heure: "08:00", medicament: "Smecta 3g", type: "entree", quantite: 50, motif: "Réapprovisionnement", operateur: "Inf. DIABATÉ" },
  { id: 5, date: "01/12/2024", heure: "09:00", medicament: "Paracétamol 1000mg", type: "entree", quantite: 100, motif: "Commande mensuelle", operateur: "Inf. DIABATÉ" },
];

// Statistiques de consommation mensuelle
const consommationMensuelle = [
  { mois: "Sep", paracetamol: 45, ibuprofene: 22, ventoline: 5, autres: 38 },
  { mois: "Oct", paracetamol: 52, ibuprofene: 28, ventoline: 8, autres: 45 },
  { mois: "Nov", paracetamol: 68, ibuprofene: 35, ventoline: 12, autres: 52 },
  { mois: "Déc", paracetamol: 48, ibuprofene: 25, ventoline: 6, autres: 35 },
];

// Fonctions utilitaires
const getStockStatus = (quantite: number, seuilAlerte: number, seuilCritique: number) => {
  if (quantite <= seuilCritique) return { status: "critique", color: "bg-destructive", label: "Critique" };
  if (quantite <= seuilAlerte) return { status: "bas", color: "bg-orange-500", label: "Bas" };
  return { status: "ok", color: "bg-green-500", label: "OK" };
};

const getPeremptionStatus = (datePeremption: string) => {
  const today = new Date();
  const peremption = new Date(datePeremption);
  const diffDays = Math.ceil((peremption.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { status: "expire", color: "bg-destructive", label: "Expiré", days: diffDays };
  if (diffDays <= 30) return { status: "urgent", color: "bg-destructive", label: "Urgent", days: diffDays };
  if (diffDays <= 90) return { status: "proche", color: "bg-orange-500", label: "Proche", days: diffDays };
  return { status: "ok", color: "bg-green-500", label: "OK", days: diffDays };
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function StockMedicaments() {
  const [medicaments, setMedicaments] = useState<Medicament[]>(initialStockMedicaments);
  const [mouvements, setMouvements] = useState<Mouvement[]>(initialMouvements);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  
  // Dialogs
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isAddExitOpen, setIsAddExitOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicament | null>(null);
  
  // Formulaire entrée
  const [entryForm, setEntryForm] = useState({
    medicamentId: "",
    quantite: 0,
    lot: "",
    datePeremption: "",
    fournisseur: "",
    prixUnitaire: 0,
    motif: "commande"
  });
  
  // Formulaire sortie
  const [exitForm, setExitForm] = useState({
    medicamentId: "",
    quantite: 1,
    eleve: "",
    motif: "consultation"
  });

  // Filtrage des médicaments
  const filteredMedicaments = medicaments.filter(med => {
    const matchSearch = med.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       med.dci.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = filterCategorie === "all" || med.categorie === filterCategorie;
    const stockStatus = getStockStatus(med.quantite, med.seuilAlerte, med.seuilCritique);
    const matchStock = filterStock === "all" || 
                      (filterStock === "bas" && stockStatus.status !== "ok") ||
                      (filterStock === "critique" && stockStatus.status === "critique");
    return matchSearch && matchCategorie && matchStock;
  });

  // Alertes actives
  const alertesStock = medicaments.filter(med => 
    getStockStatus(med.quantite, med.seuilAlerte, med.seuilCritique).status !== "ok"
  );
  const alertesPeremption = medicaments.filter(med => {
    const status = getPeremptionStatus(med.datePeremption);
    return status.status === "urgent" || status.status === "expire";
  });

  // Catégories uniques
  const categories = [...new Set(medicaments.map(m => m.categorie))];

  // Handlers
  const handleAddEntry = () => {
    if (!entryForm.medicamentId || entryForm.quantite <= 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const medId = parseInt(entryForm.medicamentId);
    const med = medicaments.find(m => m.id === medId);
    
    if (med) {
      // Mettre à jour le stock
      setMedicaments(medicaments.map(m => 
        m.id === medId 
          ? { 
              ...m, 
              quantite: m.quantite + entryForm.quantite,
              lot: entryForm.lot || m.lot,
              datePeremption: entryForm.datePeremption || m.datePeremption,
              derniereEntree: new Date().toLocaleDateString('fr-FR')
            }
          : m
      ));

      // Ajouter le mouvement
      const newMouvement: Mouvement = {
        id: mouvements.length + 1,
        date: new Date().toLocaleDateString('fr-FR'),
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        medicament: `${med.nom} ${med.dosage}`,
        type: "entree",
        quantite: entryForm.quantite,
        motif: entryForm.motif === "commande" ? "Commande mensuelle" : "Réapprovisionnement",
        operateur: "Utilisateur"
      };
      setMouvements([newMouvement, ...mouvements]);

      toast.success(`+${entryForm.quantite} ${med.nom} ajoutés au stock`);
      setEntryForm({ medicamentId: "", quantite: 0, lot: "", datePeremption: "", fournisseur: "", prixUnitaire: 0, motif: "commande" });
      setIsAddEntryOpen(false);
    }
  };

  const handleAddExit = () => {
    if (!exitForm.medicamentId || exitForm.quantite <= 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const medId = parseInt(exitForm.medicamentId);
    const med = medicaments.find(m => m.id === medId);
    
    if (med) {
      if (med.quantite < exitForm.quantite) {
        toast.error("Stock insuffisant");
        return;
      }

      // Mettre à jour le stock
      setMedicaments(medicaments.map(m => 
        m.id === medId 
          ? { ...m, quantite: m.quantite - exitForm.quantite, derniereSortie: new Date().toLocaleDateString('fr-FR') }
          : m
      ));

      // Ajouter le mouvement
      const newMouvement: Mouvement = {
        id: mouvements.length + 1,
        date: new Date().toLocaleDateString('fr-FR'),
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        medicament: `${med.nom} ${med.dosage}`,
        type: "sortie",
        quantite: exitForm.quantite,
        motif: exitForm.motif === "consultation" ? "Consultation" : exitForm.motif === "urgence" ? "Urgence" : "Autre",
        operateur: "Utilisateur",
        eleve: exitForm.eleve
      };
      setMouvements([newMouvement, ...mouvements]);

      toast.success(`-${exitForm.quantite} ${med.nom} retirés du stock`);
      setExitForm({ medicamentId: "", quantite: 1, eleve: "", motif: "consultation" });
      setIsAddExitOpen(false);
    }
  };

  const handleDeleteExpired = (med: Medicament) => {
    setMedicaments(medicaments.map(m => 
      m.id === med.id ? { ...m, quantite: 0 } : m
    ));
    
    const newMouvement: Mouvement = {
      id: mouvements.length + 1,
      date: new Date().toLocaleDateString('fr-FR'),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      medicament: `${med.nom} ${med.dosage}`,
      type: "sortie",
      quantite: med.quantite,
      motif: "Péremption - Destruction",
      operateur: "Utilisateur"
    };
    setMouvements([newMouvement, ...mouvements]);
    
    toast.success(`${med.nom} retiré du stock (péremption)`);
  };

  const handleGenerateOrder = () => {
    const toOrder = alertesStock.map(med => ({
      nom: med.nom,
      dosage: med.dosage,
      stockActuel: med.quantite,
      seuilAlerte: med.seuilAlerte,
      suggere: Math.max(med.seuilAlerte * 2 - med.quantite, 0),
      fournisseur: med.fournisseur,
      cout: Math.max(med.seuilAlerte * 2 - med.quantite, 0) * med.prixUnitaire
    }));

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bon de Commande - Pharmacie", 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);
    doc.text(`Établissement: Lycée Moderne d'Abidjan`, 14, 34);

    autoTable(doc, {
      startY: 44,
      head: [["Médicament", "Stock actuel", "Quantité suggérée", "Fournisseur", "Coût estimé"]],
      body: toOrder.map(item => [
        `${item.nom} ${item.dosage}`,
        item.stockActuel.toString(),
        item.suggere.toString(),
        item.fournisseur,
        `${item.cout.toLocaleString()} FCFA`
      ]),
      foot: [["", "", "", "Total:", `${toOrder.reduce((sum, i) => sum + i.cout, 0).toLocaleString()} FCFA`]],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('bon-commande-pharmacie.pdf');
    toast.success("Bon de commande généré");
  };

  const handleExportStock = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Inventaire - Stock Médicaments", 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

    autoTable(doc, {
      startY: 38,
      head: [["Médicament", "DCI", "Catégorie", "Quantité", "Lot", "Péremption", "État"]],
      body: medicaments.map(med => {
        const stockStatus = getStockStatus(med.quantite, med.seuilAlerte, med.seuilCritique);
        return [
          `${med.nom} ${med.dosage}`,
          med.dci,
          med.categorie,
          med.quantite.toString(),
          med.lot,
          formatDate(med.datePeremption),
          stockStatus.label
        ];
      }),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('inventaire-pharmacie.pdf');
    toast.success("Inventaire exporté");
  };

  // Stats dynamiques
  const totalRefs = medicaments.length;
  const stockBas = alertesStock.length;
  const peremptionProche = alertesPeremption.length;
  const valeurStock = medicaments.reduce((sum, m) => sum + m.quantite * m.prixUnitaire, 0);

  const statsStock = [
    { label: "Total références", value: totalRefs.toString(), icon: Package, color: "text-primary" },
    { label: "Stock bas", value: stockBas.toString(), icon: TrendingDown, color: "text-orange-600" },
    { label: "Péremption proche", value: peremptionProche.toString(), icon: Clock, color: "text-destructive" },
    { label: "Valeur stock", value: `${valeurStock.toLocaleString()} FCFA`, icon: BarChart3, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Médicaments</h1>
          <p className="text-muted-foreground">Gestion de la pharmacie et des consommables médicaux</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportStock}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          
          {/* Dialog Sortie */}
          <Dialog open={isAddExitOpen} onOpenChange={setIsAddExitOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <TrendingDown className="mr-2 h-4 w-4" />
                Sortie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer une Sortie de Stock</DialogTitle>
                <DialogDescription>Retirer des médicaments pour une consultation</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Médicament *</Label>
                  <Select value={exitForm.medicamentId} onValueChange={(v) => setExitForm({...exitForm, medicamentId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {medicaments.filter(m => m.quantite > 0).map(med => (
                        <SelectItem key={med.id} value={med.id.toString()}>
                          {med.nom} {med.dosage} ({med.quantite} en stock)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantité *</Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={exitForm.quantite}
                      onChange={(e) => setExitForm({...exitForm, quantite: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Motif *</Label>
                    <Select value={exitForm.motif} onValueChange={(v) => setExitForm({...exitForm, motif: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="urgence">Urgence</SelectItem>
                        <SelectItem value="perte">Perte/Casse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nom de l'élève (optionnel)</Label>
                  <Input 
                    placeholder="Nom de l'élève"
                    value={exitForm.eleve}
                    onChange={(e) => setExitForm({...exitForm, eleve: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddExitOpen(false)}>Annuler</Button>
                <Button onClick={handleAddExit}>Valider la sortie</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog Entrée */}
          <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Entrée
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Enregistrer une Entrée de Stock</DialogTitle>
                <DialogDescription>Ajouter des médicaments ou consommables au stock</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Médicament *</Label>
                    <Select value={entryForm.medicamentId} onValueChange={(v) => setEntryForm({...entryForm, medicamentId: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {medicaments.map(med => (
                          <SelectItem key={med.id} value={med.id.toString()}>
                            {med.nom} {med.dosage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantité *</Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={entryForm.quantite || ""}
                      onChange={(e) => setEntryForm({...entryForm, quantite: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Numéro de Lot</Label>
                    <Input 
                      placeholder="LOT-XXXX-XXX"
                      value={entryForm.lot}
                      onChange={(e) => setEntryForm({...entryForm, lot: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de Péremption</Label>
                    <Input 
                      type="date"
                      value={entryForm.datePeremption}
                      onChange={(e) => setEntryForm({...entryForm, datePeremption: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fournisseur</Label>
                    <Input 
                      placeholder="Nom du fournisseur"
                      value={entryForm.fournisseur}
                      onChange={(e) => setEntryForm({...entryForm, fournisseur: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prix Unitaire (FCFA)</Label>
                    <Input 
                      type="number"
                      value={entryForm.prixUnitaire || ""}
                      onChange={(e) => setEntryForm({...entryForm, prixUnitaire: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Motif d'entrée</Label>
                  <Select value={entryForm.motif} onValueChange={(v) => setEntryForm({...entryForm, motif: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="commande">Commande mensuelle</SelectItem>
                      <SelectItem value="reappro">Réapprovisionnement urgent</SelectItem>
                      <SelectItem value="don">Don</SelectItem>
                      <SelectItem value="transfert">Transfert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEntryOpen(false)}>Annuler</Button>
                <Button onClick={handleAddEntry}>Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsStock.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertes */}
      {(alertesStock.length > 0 || alertesPeremption.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {alertesStock.length > 0 && (
            <Card className="border-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-orange-600">
                  <TrendingDown className="h-4 w-4" />
                  Alertes Stock Bas ({alertesStock.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alertesStock.slice(0, 4).map(med => {
                    const status = getStockStatus(med.quantite, med.seuilAlerte, med.seuilCritique);
                    return (
                      <div key={med.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>{status.label}</Badge>
                          <span className="font-medium">{med.nom} {med.dosage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{med.quantite} restant(s)</span>
                          <Button size="sm" variant="outline" onClick={() => {
                            setEntryForm({...entryForm, medicamentId: med.id.toString()});
                            setIsAddEntryOpen(true);
                          }}>
                            <ShoppingCart className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {alertesPeremption.length > 0 && (
            <Card className="border-destructive">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <Clock className="h-4 w-4" />
                  Alertes Péremption ({alertesPeremption.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alertesPeremption.slice(0, 4).map(med => {
                    const status = getPeremptionStatus(med.datePeremption);
                    return (
                      <div key={med.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>
                            {status.days < 0 ? "Expiré" : `${status.days}j`}
                          </Badge>
                          <span className="font-medium">{med.nom} {med.dosage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{formatDate(med.datePeremption)}</span>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteExpired(med)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Tabs defaultValue="inventaire" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventaire">Inventaire</TabsTrigger>
          <TabsTrigger value="mouvements">Mouvements</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          <TabsTrigger value="commandes">Commandes</TabsTrigger>
        </TabsList>

        <TabsContent value="inventaire" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher par nom ou DCI..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStock} onValueChange={setFilterStock}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="État stock" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">Tout le stock</SelectItem>
                    <SelectItem value="bas">Stock bas</SelectItem>
                    <SelectItem value="critique">Stock critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des médicaments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Inventaire ({filteredMedicaments.length} références)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Médicament</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Forme / Dosage</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Péremption</TableHead>
                    <TableHead>Lot</TableHead>
                    <TableHead>Emplacement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicaments.map((med) => {
                    const stockStatus = getStockStatus(med.quantite, med.seuilAlerte, med.seuilCritique);
                    const peremptionStatus = getPeremptionStatus(med.datePeremption);
                    const stockPercent = Math.min((med.quantite / (med.seuilAlerte * 2)) * 100, 100);
                    
                    return (
                      <TableRow key={med.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{med.nom}</div>
                            <div className="text-xs text-muted-foreground">DCI: {med.dci}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{med.categorie}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{med.forme}</div>
                            <div className="text-muted-foreground">{med.dosage}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-lg">{med.quantite}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 w-24">
                            <Progress 
                              value={stockPercent} 
                              className={`h-2 ${
                                stockStatus.status === "critique" ? "[&>div]:bg-red-500" :
                                stockStatus.status === "bas" ? "[&>div]:bg-orange-500" : "[&>div]:bg-green-500"
                              }`}
                            />
                            <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={peremptionStatus.color}>
                              {peremptionStatus.days < 0 ? "Expiré" : 
                               peremptionStatus.days <= 90 ? `${peremptionStatus.days}j` : "OK"}
                            </Badge>
                            <span className="text-xs">{formatDate(med.datePeremption)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{med.lot}</TableCell>
                        <TableCell className="text-xs">{med.emplacement}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" title="Sortie">
                                  <TrendingDown className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Sortie de Stock - {med.nom}</DialogTitle>
                                  <DialogDescription>Enregistrer une sortie pour consultation</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Quantité</Label>
                                      <Input type="number" min="1" max={med.quantite} defaultValue="1" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Élève</Label>
                                      <Input placeholder="Nom de l'élève" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Motif</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-background border shadow-lg z-50">
                                        <SelectItem value="consultation">Consultation</SelectItem>
                                        <SelectItem value="urgence">Urgence</SelectItem>
                                        <SelectItem value="perte">Perte/Casse</SelectItem>
                                        <SelectItem value="peremption">Péremption</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button>Valider la sortie</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline" title="Modifier">
                              <Edit className="h-3 w-3" />
                            </Button>
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

        <TabsContent value="mouvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Mouvements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Médicament</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Opérateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mouvements.map((mvt) => (
                    <TableRow key={mvt.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {mvt.date}
                        </div>
                      </TableCell>
                      <TableCell>{mvt.heure}</TableCell>
                      <TableCell>
                        <Badge className={mvt.type === "entree" ? "bg-green-500" : "bg-blue-500"}>
                          {mvt.type === "entree" ? (
                            <><TrendingUp className="h-3 w-3 mr-1" />Entrée</>
                          ) : (
                            <><TrendingDown className="h-3 w-3 mr-1" />Sortie</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{mvt.medicament}</TableCell>
                      <TableCell>
                        <span className={mvt.type === "entree" ? "text-green-600" : "text-blue-600"}>
                          {mvt.type === "entree" ? "+" : "-"}{mvt.quantite}
                        </span>
                      </TableCell>
                      <TableCell>{mvt.motif}</TableCell>
                      <TableCell>{mvt.eleve || "-"}</TableCell>
                      <TableCell>{mvt.operateur}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Consommation Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={consommationMensuelle}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="paracetamol" fill="hsl(var(--primary))" name="Paracétamol" />
                    <Bar dataKey="ibuprofene" fill="hsl(var(--destructive))" name="Ibuprofène" />
                    <Bar dataKey="ventoline" fill="#22c55e" name="Ventoline" />
                    <Bar dataKey="autres" fill="#f97316" name="Autres" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution du Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { mois: "Sep", valeur: 420000 },
                    { mois: "Oct", valeur: 380000 },
                    { mois: "Nov", valeur: 450000 },
                    { mois: "Déc", valeur: 485000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                    <Line type="monotone" dataKey="valeur" stroke="hsl(var(--primary))" strokeWidth={2} name="Valeur stock" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top 10 - Médicaments les plus utilisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { nom: "Paracétamol 1000mg", quantite: 213, percent: 100 },
                    { nom: "Ibuprofène 400mg", quantite: 110, percent: 52 },
                    { nom: "Smecta 3g", quantite: 78, percent: 37 },
                    { nom: "Bétadine 10%", quantite: 65, percent: 31 },
                    { nom: "Compresses stériles", quantite: 52, percent: 24 },
                    { nom: "Ventoline 100µg", quantite: 31, percent: 15 },
                    { nom: "Sérum physiologique", quantite: 28, percent: 13 },
                    { nom: "Antihistaminique 10mg", quantite: 22, percent: 10 },
                    { nom: "Spasfon 80mg", quantite: 18, percent: 8 },
                    { nom: "Doliprane sirop", quantite: 15, percent: 7 },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">{idx + 1}</Badge>
                          {item.nom}
                        </span>
                        <span className="font-medium">{item.quantite} utilisations</span>
                      </div>
                      <Progress value={item.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commandes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Suggestions de Commande
                </CardTitle>
                <Button onClick={handleGenerateOrder}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Générer bon de commande
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Médicament</TableHead>
                    <TableHead>Stock actuel</TableHead>
                    <TableHead>Seuil alerte</TableHead>
                    <TableHead>Consommation moy./mois</TableHead>
                    <TableHead>Quantité suggérée</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Coût estimé</TableHead>
                    <TableHead className="text-right">Commander</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertesStock.map((med) => {
                    const suggestedQty = Math.max(med.seuilAlerte * 2 - med.quantite, 0);
                    const estimatedCost = suggestedQty * med.prixUnitaire;
                    return (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.nom} {med.dosage}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{med.quantite}</Badge>
                        </TableCell>
                        <TableCell>{med.seuilAlerte}</TableCell>
                        <TableCell>~15/mois</TableCell>
                        <TableCell className="font-bold text-green-600">{suggestedQty}</TableCell>
                        <TableCell>{med.fournisseur}</TableCell>
                        <TableCell>{estimatedCost.toLocaleString()} FCFA</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">
                            <ShoppingCart className="mr-1 h-3 w-3" />
                            Ajouter
                          </Button>
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
