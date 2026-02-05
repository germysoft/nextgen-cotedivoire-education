import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Bed, Search, Plus, Users, DollarSign, Calendar, Edit, Trash2, Eye, CheckCircle, FileText, Download, Printer, Send, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Pensionnaire {
  id: number;
  nom: string;
  classe: string;
  chambre: string;
  lit: string;
  dateDebut: string;
  paiement: "À jour" | "En retard";
  statut: "Actif" | "Inactif";
  montantDu: number;
  montantPaye: number;
  contact?: string;
}

interface Chambre {
  numero: string;
  batiment: string;
  capacite: number;
  occupes: number;
  disponibles: number;
  type: "Garçons" | "Filles";
}

const initialPensionnaires: Pensionnaire[] = [
  { id: 1, nom: "KOUASSI Jean", classe: "Tle D", chambre: "A-12", lit: "3", dateDebut: "01 Sept 2024", paiement: "À jour", statut: "Actif", montantDu: 450000, montantPaye: 450000, contact: "+225 07 12 34 56" },
  { id: 2, nom: "DIALLO Fatoumata", classe: "1ère A", chambre: "B-08", lit: "2", dateDebut: "01 Sept 2024", paiement: "En retard", statut: "Actif", montantDu: 450000, montantPaye: 300000, contact: "+225 05 98 76 54" },
  { id: 3, nom: "TOURÉ Mohamed", classe: "2nde B", chambre: "A-15", lit: "1", dateDebut: "01 Sept 2024", paiement: "À jour", statut: "Actif", montantDu: 450000, montantPaye: 450000 },
  { id: 4, nom: "SANOGO Aminata", classe: "3ème C", chambre: "B-12", lit: "4", dateDebut: "01 Sept 2024", paiement: "À jour", statut: "Actif", montantDu: 450000, montantPaye: 450000, contact: "+225 01 23 45 67" },
  { id: 5, nom: "BAMBA Sarah", classe: "Tle A", chambre: "B-08", lit: "1", dateDebut: "01 Sept 2024", paiement: "En retard", statut: "Actif", montantDu: 450000, montantPaye: 200000 },
];

const initialChambres: Chambre[] = [
  { numero: "A-12", batiment: "A", capacite: 4, occupes: 4, disponibles: 0, type: "Garçons" },
  { numero: "A-15", batiment: "A", capacite: 4, occupes: 3, disponibles: 1, type: "Garçons" },
  { numero: "B-08", batiment: "B", capacite: 4, occupes: 4, disponibles: 0, type: "Filles" },
  { numero: "B-12", batiment: "B", capacite: 4, occupes: 2, disponibles: 2, type: "Filles" },
  { numero: "A-18", batiment: "A", capacite: 4, occupes: 3, disponibles: 1, type: "Garçons" },
  { numero: "B-15", batiment: "B", capacite: 4, occupes: 1, disponibles: 3, type: "Filles" },
];

const classesListe = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C", "2nde A", "2nde B", "1ère A", "1ère B", "Tle A", "Tle D"];

export default function Internat() {
  const [pensionnaires, setPensionnaires] = useState<Pensionnaire[]>(initialPensionnaires);
  const [chambres] = useState<Chambre[]>(initialChambres);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isNewPensionnaireOpen, setIsNewPensionnaireOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPensionnaire, setSelectedPensionnaire] = useState<Pensionnaire | null>(null);
  
  // Form states
  const [form, setForm] = useState({
    nom: "",
    classe: "",
    chambre: "",
    lit: "",
    contact: ""
  });
  const [paymentAmount, setPaymentAmount] = useState("");

  // Statistiques dynamiques
  const totalPensionnaires = pensionnaires.filter(p => p.statut === "Actif").length;
  const totalChambres = chambres.length;
  const placesOccupees = chambres.reduce((sum, c) => sum + c.occupes, 0);
  const placesTotal = chambres.reduce((sum, c) => sum + c.capacite, 0);
  const tauxOccupation = ((placesOccupees / placesTotal) * 100).toFixed(1);
  const totalRecettes = pensionnaires.reduce((sum, p) => sum + p.montantPaye, 0);
  const enRetard = pensionnaires.filter(p => p.paiement === "En retard").length;

  // Filtrer les pensionnaires
  const filteredPensionnaires = pensionnaires.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.chambre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chambres avec places disponibles
  const chambresDisponibles = chambres.filter(c => c.disponibles > 0);

  // PDF Export - Liste des pensionnaires
  const handleExportPensionnairesPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liste des Pensionnaires - Internat", 14, 22);
    doc.setFontSize(10);
    doc.text(`Total: ${totalPensionnaires} pensionnaires | Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [["Nom", "Classe", "Chambre", "Lit", "Date Début", "Paiement", "Statut"]],
      body: pensionnaires.map(p => [
        p.nom,
        p.classe,
        p.chambre,
        `Lit ${p.lit}`,
        p.dateDebut,
        p.paiement,
        p.statut
      ]),
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("pensionnaires-internat.pdf");
    toast.success("Liste des pensionnaires exportée");
  };

  // PDF Export - Affectations chambres
  const handleExportChambresPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Affectations Chambres - Internat", 14, 22);
    doc.setFontSize(10);
    doc.text(`Taux d'occupation: ${tauxOccupation}%`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [["Chambre", "Bâtiment", "Type", "Capacité", "Occupés", "Disponibles"]],
      body: chambres.map(c => [
        c.numero,
        `Bâtiment ${c.batiment}`,
        c.type,
        `${c.capacite}`,
        `${c.occupes}`,
        `${c.disponibles}`
      ]),
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save("affectations-chambres.pdf");
    toast.success("Affectations des chambres exportées");
  };

  // PDF Export - Rapport financier internat
  const handleExportFinancePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Rapport Financier - Internat", 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    const totalDu = pensionnaires.reduce((sum, p) => sum + p.montantDu, 0);

    autoTable(doc, {
      startY: 38,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Pensionnaires actifs", `${totalPensionnaires}`],
        ["Total attendu", `${totalDu.toLocaleString()} FCFA`],
        ["Total encaissé", `${totalRecettes.toLocaleString()} FCFA`],
        ["Reste à percevoir", `${(totalDu - totalRecettes).toLocaleString()} FCFA`],
        ["Taux recouvrement", `${((totalRecettes / totalDu) * 100).toFixed(1)}%`],
        ["En retard de paiement", `${enRetard}`],
      ],
      headStyles: { fillColor: [239, 68, 68] },
    });

    doc.save("rapport-financier-internat.pdf");
    toast.success("Rapport financier exporté");
  };

  // Envoyer rappels aux retardataires
  const handleSendReminders = () => {
    const retardataires = pensionnaires.filter(p => p.paiement === "En retard");
    toast.success(`${retardataires.length} rappels SMS envoyés`, {
      description: "Parents des pensionnaires en retard de paiement notifiés"
    });
  };

  const resetForm = () => {
    setForm({ nom: "", classe: "", chambre: "", lit: "", contact: "" });
  };

  // Handler Nouveau Pensionnaire
  const handleNewPensionnaire = () => {
    if (!form.nom || !form.classe || !form.chambre || !form.lit) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newPensionnaire: Pensionnaire = {
      id: Math.max(...pensionnaires.map(p => p.id)) + 1,
      nom: form.nom,
      classe: form.classe,
      chambre: form.chambre,
      lit: form.lit,
      dateDebut: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      paiement: "En retard",
      statut: "Actif",
      montantDu: 450000,
      montantPaye: 0,
      contact: form.contact
    };

    setPensionnaires([...pensionnaires, newPensionnaire]);
    setIsNewPensionnaireOpen(false);
    resetForm();
    toast.success(`${form.nom} inscrit(e) à l'internat`, {
      description: `Chambre ${form.chambre} - Lit ${form.lit}`
    });
  };

  // Handler Edit
  const openEdit = (pensionnaire: Pensionnaire) => {
    setSelectedPensionnaire(pensionnaire);
    setForm({
      nom: pensionnaire.nom,
      classe: pensionnaire.classe,
      chambre: pensionnaire.chambre,
      lit: pensionnaire.lit,
      contact: pensionnaire.contact || ""
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPensionnaire) return;

    setPensionnaires(prev => prev.map(p =>
      p.id === selectedPensionnaire.id
        ? { ...p, chambre: form.chambre, lit: form.lit, contact: form.contact }
        : p
    ));

    toast.success(`Informations de ${selectedPensionnaire.nom} mises à jour`);
    setIsEditOpen(false);
    setSelectedPensionnaire(null);
    resetForm();
  };

  // Handler Paiement
  const openPayment = (pensionnaire: Pensionnaire) => {
    setSelectedPensionnaire(pensionnaire);
    setPaymentAmount("");
    setIsPaymentOpen(true);
  };

  const handlePayment = () => {
    if (!selectedPensionnaire || !paymentAmount) return;

    const amount = parseInt(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    const newPaye = Math.min(selectedPensionnaire.montantPaye + amount, selectedPensionnaire.montantDu);
    const newPaiement = newPaye >= selectedPensionnaire.montantDu ? "À jour" : "En retard";

    setPensionnaires(prev => prev.map(p =>
      p.id === selectedPensionnaire.id
        ? { ...p, montantPaye: newPaye, paiement: newPaiement as "À jour" | "En retard" }
        : p
    ));

    toast.success(`Paiement de ${amount.toLocaleString()} F enregistré`);
    setIsPaymentOpen(false);
    setSelectedPensionnaire(null);
  };

  // Handler View
  const openView = (pensionnaire: Pensionnaire) => {
    setSelectedPensionnaire(pensionnaire);
    setIsViewOpen(true);
  };

  // Handler Delete
  const handleDelete = (id: number) => {
    setPensionnaires(prev => prev.filter(p => p.id !== id));
    toast.success("Pensionnaire retiré de l'internat");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion de l'Internat</h1>
          <p className="text-muted-foreground">Suivi des pensionnaires et affectations</p>
        </div>
        <Button onClick={() => setIsNewPensionnaireOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Pensionnaire
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pensionnaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPensionnaires}</div>
            <p className="text-xs text-muted-foreground">Inscrits actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chambres</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChambres}</div>
            <p className="text-xs text-muted-foreground">4 lits par chambre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Occupation</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxOccupation}%</div>
            <p className="text-xs text-green-600">{placesTotal - placesOccupees} places disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalRecettes / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pensionnaires" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pensionnaires">Pensionnaires</TabsTrigger>
          <TabsTrigger value="chambres">Chambres</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="pensionnaires">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Liste des Pensionnaires</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={handleExportPensionnairesPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                    <Button variant="outline" onClick={handleSendReminders}>
                      <Send className="mr-2 h-4 w-4" />
                      Rappels
                    </Button>
                  </div>
                </div>
              </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Lit</TableHead>
                  <TableHead>Date Début</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPensionnaires.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nom}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.classe}</Badge>
                    </TableCell>
                    <TableCell>{p.chambre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Lit {p.lit}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {p.dateDebut}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.paiement === "À jour" ? "default" : "destructive"}>
                        {p.paiement}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{p.statut}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openView(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {p.paiement === "En retard" && (
                          <Button size="sm" variant="outline" onClick={() => openPayment(p)}>
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Disponibilité Chambres</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleExportChambresPDF}>
                    <Printer className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chambres.map((ch, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{ch.numero}</p>
                        <p className="text-sm text-muted-foreground">Bâtiment {ch.batiment}</p>
                      </div>
                      <Badge variant="outline">{ch.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 rounded-lg bg-blue-50">
                        <p className="text-xs text-muted-foreground">Occupés</p>
                        <p className="font-bold text-blue-600">{ch.occupes}/{ch.capacite}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-green-50">
                        <p className="text-xs text-muted-foreground">Libres</p>
                        <p className="font-bold text-green-600">{ch.disponibles}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    <TabsContent value="chambres">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des Chambres</CardTitle>
            <Button variant="outline" onClick={handleExportChambresPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
          <CardDescription>Vue d'ensemble de l'occupation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {chambres.map((ch, idx) => (
              <Card key={idx}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{ch.numero}</p>
                      <p className="text-sm text-muted-foreground">Bâtiment {ch.batiment}</p>
                    </div>
                    <Badge variant="outline">{ch.type}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">Occupés</p>
                      <p className="font-bold text-primary">{ch.occupes}/{ch.capacite}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">Libres</p>
                      <p className="font-bold text-primary">{ch.disponibles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="finances">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rapport Financier Internat</CardTitle>
            <Button onClick={handleExportFinancePDF}>
              <FileText className="mr-2 h-4 w-4" />
              Exporter Rapport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-4">Synthèse Financière</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total attendu:</span>
                    <span className="font-bold">{(pensionnaires.reduce((s, p) => s + p.montantDu, 0)).toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total encaissé:</span>
                    <span className="font-bold text-primary">{totalRecettes.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Reste à percevoir:</span>
                    <span className="font-bold text-destructive">
                      {(pensionnaires.reduce((s, p) => s + p.montantDu, 0) - totalRecettes).toLocaleString()} F
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-4">Répartition Paiements</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>À jour:</span>
                    <Badge variant="default">{pensionnaires.filter(p => p.paiement === "À jour").length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>En retard:</span>
                    <Badge variant="destructive">{enRetard}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>

      {/* Dialog Nouveau Pensionnaire */}
      <Dialog open={isNewPensionnaireOpen} onOpenChange={setIsNewPensionnaireOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Pensionnaire</DialogTitle>
            <DialogDescription>Inscrire un élève à l'internat</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nom de l'élève *</Label>
              <Input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="NOM Prénom"
              />
            </div>
            <div className="space-y-2">
              <Label>Classe *</Label>
              <Select value={form.classe} onValueChange={(v) => setForm({ ...form, classe: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {classesListe.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chambre *</Label>
                <Select value={form.chambre} onValueChange={(v) => setForm({ ...form, chambre: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {chambresDisponibles.map(c => (
                      <SelectItem key={c.numero} value={c.numero}>
                        {c.numero} ({c.type}) - {c.disponibles} libre(s)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lit *</Label>
                <Select value={form.lit} onValueChange={(v) => setForm({ ...form, lit: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="1">Lit 1</SelectItem>
                    <SelectItem value="2">Lit 2</SelectItem>
                    <SelectItem value="3">Lit 3</SelectItem>
                    <SelectItem value="4">Lit 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact parent (optionnel)</Label>
              <Input
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="+225 XX XX XX XX"
              />
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Frais d'internat: <span className="font-bold text-foreground">450 000 FCFA / an</span></p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsNewPensionnaireOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleNewPensionnaire}>Inscrire</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'affectation</DialogTitle>
            <DialogDescription>Changer de chambre ou de lit</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">{selectedPensionnaire?.nom}</p>
              <p className="text-sm text-muted-foreground">{selectedPensionnaire?.classe}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chambre</Label>
                <Select value={form.chambre} onValueChange={(v) => setForm({ ...form, chambre: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {chambres.map(c => (
                      <SelectItem key={c.numero} value={c.numero}>
                        {c.numero} ({c.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lit</Label>
                <Select value={form.lit} onValueChange={(v) => setForm({ ...form, lit: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="1">Lit 1</SelectItem>
                    <SelectItem value="2">Lit 2</SelectItem>
                    <SelectItem value="3">Lit 3</SelectItem>
                    <SelectItem value="4">Lit 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact parent</Label>
              <Input
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="+225 XX XX XX XX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Paiement */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un Paiement</DialogTitle>
            <DialogDescription>Paiement pour {selectedPensionnaire?.nom}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Frais annuels:</span>
                <span className="font-bold">{selectedPensionnaire?.montantDu.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between">
                <span>Déjà payé:</span>
                <span className="font-bold text-green-600">{selectedPensionnaire?.montantPaye.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Reste à payer:</span>
                <span className="font-bold text-orange-600">
                  {((selectedPensionnaire?.montantDu || 0) - (selectedPensionnaire?.montantPaye || 0)).toLocaleString()} F
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Montant du paiement (FCFA)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Montant"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Annuler</Button>
            <Button onClick={handlePayment}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog View */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du Pensionnaire</DialogTitle>
          </DialogHeader>
          {selectedPensionnaire && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nom</Label>
                  <p className="font-medium">{selectedPensionnaire.nom}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Classe</Label>
                  <p className="font-medium">{selectedPensionnaire.classe}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Chambre</Label>
                  <p className="font-medium">{selectedPensionnaire.chambre}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Lit</Label>
                  <p className="font-medium">Lit {selectedPensionnaire.lit}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date d'inscription</Label>
                  <p className="font-medium">{selectedPensionnaire.dateDebut}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p className="font-medium">{selectedPensionnaire.contact || "Non renseigné"}</p>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Frais annuels:</span>
                  <span className="font-bold">{selectedPensionnaire.montantDu.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Payé:</span>
                  <span className="font-bold text-green-600">{selectedPensionnaire.montantPaye.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Reste:</span>
                  <span className="font-bold text-orange-600">
                    {(selectedPensionnaire.montantDu - selectedPensionnaire.montantPaye).toLocaleString()} F
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={selectedPensionnaire.paiement === "À jour" ? "default" : "destructive"}>
                  {selectedPensionnaire.paiement}
                </Badge>
                <Badge variant="default">{selectedPensionnaire.statut}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
