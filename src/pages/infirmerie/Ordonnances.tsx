import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, Download, Printer, Search, Plus, Eye, Clock,
  Pill, User, Calendar, AlertCircle, CheckCircle, Edit
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Medicament {
  nom: string;
  dosage: string;
  posologie: string;
  duree: string;
  instructions?: string;
}

interface Ordonnance {
  id: string;
  numeroOrdonnance: string;
  patient: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    classe: string;
    matricule: string;
  };
  dateEmission: string;
  diagnostic: string;
  medicaments: Medicament[];
  recommandations: string;
  infirmiere: string;
  type: "electronique" | "manuelle";
  statut: "active" | "expirée" | "annulée";
}

const ordonnances: Ordonnance[] = [
  {
    id: "ORD001",
    numeroOrdonnance: "ORD-2024-001234",
    patient: {
      nom: "KOUADIO",
      prenom: "Aya",
      dateNaissance: "2010-05-15",
      classe: "6ème A",
      matricule: "2024-0156"
    },
    dateEmission: "2024-12-18",
    diagnostic: "Céphalées légères, fatigue",
    medicaments: [
      { nom: "Paracétamol", dosage: "500mg", posologie: "1 comprimé matin et soir", duree: "3 jours" },
      { nom: "Vitamine C", dosage: "1000mg", posologie: "1 comprimé le matin", duree: "7 jours" }
    ],
    recommandations: "Repos conseillé. Hydratation abondante. Consulter si les symptômes persistent.",
    infirmiere: "Mme DIABATE Mariam",
    type: "electronique",
    statut: "active"
  },
  {
    id: "ORD002",
    numeroOrdonnance: "ORD-2024-001235",
    patient: {
      nom: "TRAORE",
      prenom: "Ibrahim",
      dateNaissance: "2009-08-22",
      classe: "5ème B",
      matricule: "2024-0089"
    },
    dateEmission: "2024-12-17",
    diagnostic: "Allergie saisonnière",
    medicaments: [
      { nom: "Cétirizine", dosage: "10mg", posologie: "1 comprimé le soir", duree: "14 jours" },
      { nom: "Sérum physiologique", dosage: "", posologie: "Lavage nasal 2x/jour", duree: "7 jours" }
    ],
    recommandations: "Éviter l'exposition aux allergènes. Aérer régulièrement les espaces de vie.",
    infirmiere: "Mme DIABATE Mariam",
    type: "electronique",
    statut: "active"
  },
  {
    id: "ORD003",
    numeroOrdonnance: "ORD-2024-001230",
    patient: {
      nom: "KONE",
      prenom: "Fatou",
      dateNaissance: "2011-03-10",
      classe: "6ème C",
      matricule: "2024-0234"
    },
    dateEmission: "2024-12-10",
    diagnostic: "Gastro-entérite légère",
    medicaments: [
      { nom: "Smecta", dosage: "3g", posologie: "1 sachet 3x/jour", duree: "3 jours" },
      { nom: "SRO (Soluté de réhydratation)", dosage: "", posologie: "Selon besoin", duree: "3 jours" }
    ],
    recommandations: "Régime alimentaire léger. Éviter les aliments gras et épicés.",
    infirmiere: "Mme DIABATE Mariam",
    type: "manuelle",
    statut: "expirée"
  }
];

const medicamentsDisponibles = [
  { nom: "Paracétamol", dosages: ["250mg", "500mg", "1000mg"] },
  { nom: "Ibuprofène", dosages: ["200mg", "400mg"] },
  { nom: "Cétirizine", dosages: ["5mg", "10mg"] },
  { nom: "Vitamine C", dosages: ["500mg", "1000mg"] },
  { nom: "Smecta", dosages: ["3g"] },
  { nom: "Doliprane", dosages: ["500mg", "1000mg"] },
  { nom: "Spasfon", dosages: ["80mg"] },
  { nom: "Gaviscon", dosages: ["suspension"] },
  { nom: "Sérum physiologique", dosages: ["dose unique"] },
  { nom: "Antiseptique local", dosages: ["spray", "solution"] }
];

export default function Ordonnances() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [ordonnanceDetails, setOrdonnanceDetails] = useState<Ordonnance | null>(null);
  const [showNewOrdonnance, setShowNewOrdonnance] = useState(false);
  const [showPrintTemplate, setShowPrintTemplate] = useState(false);
  
  // État pour nouvelle ordonnance
  const [newOrdonnance, setNewOrdonnance] = useState({
    patientNom: "",
    patientPrenom: "",
    patientDateNaissance: "",
    patientClasse: "",
    patientMatricule: "",
    diagnostic: "",
    recommandations: "",
    medicaments: [] as Medicament[]
  });

  const [newMedicament, setNewMedicament] = useState({
    nom: "",
    dosage: "",
    posologie: "",
    duree: "",
    instructions: ""
  });

  const generateOrdonnancePDF = (ordonnance: Ordonnance) => {
    const doc = new jsPDF();
    
    // En-tête de l'établissement
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text("ÉTABLISSEMENT SCOLAIRE", 105, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Infirmerie Scolaire", 105, 22, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Adresse de l'établissement - Tél: XX XX XX XX XX", 105, 28, { align: "center" });

    // Ligne de séparation
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Titre ORDONNANCE
    doc.setFontSize(20);
    doc.setTextColor(52, 152, 219);
    doc.text("ORDONNANCE MÉDICALE", 105, 48, { align: "center" });

    // Numéro et date
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`N°: ${ordonnance.numeroOrdonnance}`, 20, 58);
    doc.text(`Date: ${new Date(ordonnance.dateEmission).toLocaleDateString('fr-FR')}`, 150, 58);

    // Informations patient
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("PATIENT", 20, 72);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Nom: ${ordonnance.patient.nom} ${ordonnance.patient.prenom}`, 25, 80);
    doc.text(`Date de naissance: ${new Date(ordonnance.patient.dateNaissance).toLocaleDateString('fr-FR')}`, 25, 87);
    doc.text(`Classe: ${ordonnance.patient.classe}`, 25, 94);
    doc.text(`Matricule: ${ordonnance.patient.matricule}`, 120, 94);

    // Diagnostic
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("DIAGNOSTIC", 20, 110);
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(ordonnance.diagnostic, 25, 118);

    // Prescription
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("PRESCRIPTION", 20, 132);

    let yPosition = 140;
    ordonnance.medicaments.forEach((med, index) => {
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      doc.text(`${index + 1}. ${med.nom} ${med.dosage}`, 25, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`   Posologie: ${med.posologie}`, 30, yPosition + 6);
      doc.text(`   Durée: ${med.duree}`, 30, yPosition + 12);
      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`, 30, yPosition + 18);
        yPosition += 6;
      }
      yPosition += 20;
    });

    // Recommandations
    yPosition += 5;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("RECOMMANDATIONS", 20, yPosition);
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    const recommandationsLines = doc.splitTextToSize(ordonnance.recommandations, 160);
    doc.text(recommandationsLines, 25, yPosition + 8);

    // Signature
    yPosition = Math.max(yPosition + 30, 230);
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text("L'infirmière scolaire", 140, yPosition);
    doc.text(ordonnance.infirmiere, 140, yPosition + 15);

    // Cachet (rectangle en pointillés)
    doc.setDrawColor(150);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(130, yPosition + 20, 50, 25);
    doc.setFontSize(8);
    doc.text("Cachet", 155, yPosition + 35, { align: "center" });

    // Pied de page
    doc.setLineDashPattern([], 0);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Ce document est une ordonnance médicale officielle de l'infirmerie scolaire", 105, 280, { align: "center" });
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 105, 285, { align: "center" });

    doc.save(`Ordonnance_${ordonnance.patient.nom}_${ordonnance.patient.prenom}_${ordonnance.dateEmission}.pdf`);
    toast.success("Ordonnance PDF générée avec succès");
  };

  const generateBlankTemplatePDF = () => {
    const doc = new jsPDF();
    
    // En-tête de l'établissement
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text("ÉTABLISSEMENT SCOLAIRE", 105, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Infirmerie Scolaire", 105, 22, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Adresse de l'établissement - Tél: XX XX XX XX XX", 105, 28, { align: "center" });

    // Ligne de séparation
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Titre ORDONNANCE
    doc.setFontSize(20);
    doc.setTextColor(52, 152, 219);
    doc.text("ORDONNANCE MÉDICALE", 105, 48, { align: "center" });

    // Numéro et date (avec lignes à remplir)
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text("N°: ____________________", 20, 58);
    doc.text("Date: ____/____/________", 140, 58);

    // Informations patient (avec lignes à remplir)
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("PATIENT", 20, 72);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text("Nom: ________________________________  Prénom: ________________________________", 25, 82);
    doc.text("Date de naissance: ____/____/________      Classe: ______________", 25, 92);
    doc.text("Matricule: ____________________", 25, 102);

    // Diagnostic
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("DIAGNOSTIC", 20, 118);
    doc.setDrawColor(200);
    doc.line(25, 126, 185, 126);
    doc.line(25, 134, 185, 134);

    // Prescription (lignes numérotées)
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("PRESCRIPTION", 20, 150);

    doc.setFontSize(10);
    doc.setTextColor(60);
    for (let i = 1; i <= 5; i++) {
      const y = 158 + (i - 1) * 18;
      doc.text(`${i}. ___________________________________________________________________________`, 25, y);
      doc.text("   Posologie: _________________________  Durée: _______________", 30, y + 8);
    }

    // Recommandations
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("RECOMMANDATIONS", 20, 255);
    doc.setDrawColor(200);
    doc.line(25, 263, 185, 263);
    doc.line(25, 271, 185, 271);

    // Signature
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text("L'infirmière scolaire", 140, 280);
    doc.text("Signature: _______________", 140, 290);

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Modèle d'ordonnance - Infirmerie Scolaire", 105, 297, { align: "center" });

    doc.save("Modele_Ordonnance_Vierge.pdf");
    toast.success("Modèle d'ordonnance vierge téléchargé");
  };

  const addMedicamentToOrdonnance = () => {
    if (newMedicament.nom && newMedicament.dosage && newMedicament.posologie && newMedicament.duree) {
      setNewOrdonnance(prev => ({
        ...prev,
        medicaments: [...prev.medicaments, { ...newMedicament }]
      }));
      setNewMedicament({ nom: "", dosage: "", posologie: "", duree: "", instructions: "" });
      toast.success("Médicament ajouté à l'ordonnance");
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires du médicament");
    }
  };

  const removeMedicamentFromOrdonnance = (index: number) => {
    setNewOrdonnance(prev => ({
      ...prev,
      medicaments: prev.medicaments.filter((_, i) => i !== index)
    }));
  };

  const createNewOrdonnance = () => {
    if (!newOrdonnance.patientNom || !newOrdonnance.diagnostic || newOrdonnance.medicaments.length === 0) {
      toast.error("Veuillez remplir tous les champs obligatoires et ajouter au moins un médicament");
      return;
    }

    const ordonnance: Ordonnance = {
      id: `ORD${Date.now()}`,
      numeroOrdonnance: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      patient: {
        nom: newOrdonnance.patientNom,
        prenom: newOrdonnance.patientPrenom,
        dateNaissance: newOrdonnance.patientDateNaissance,
        classe: newOrdonnance.patientClasse,
        matricule: newOrdonnance.patientMatricule
      },
      dateEmission: new Date().toISOString().split('T')[0],
      diagnostic: newOrdonnance.diagnostic,
      medicaments: newOrdonnance.medicaments,
      recommandations: newOrdonnance.recommandations,
      infirmiere: "Mme DIABATE Mariam",
      type: "electronique",
      statut: "active"
    };

    generateOrdonnancePDF(ordonnance);
    setShowNewOrdonnance(false);
    setNewOrdonnance({
      patientNom: "",
      patientPrenom: "",
      patientDateNaissance: "",
      patientClasse: "",
      patientMatricule: "",
      diagnostic: "",
      recommandations: "",
      medicaments: []
    });
    toast.success("Ordonnance électronique créée et téléchargée");
  };

  const filteredOrdonnances = ordonnances.filter(o => {
    const matchSearch = o.patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.numeroOrdonnance.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "tous" || o.type === selectedType;
    return matchSearch && matchType;
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "active": return "bg-green-100 text-green-800";
      case "expirée": return "bg-gray-100 text-gray-800";
      case "annulée": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordonnances Médicales</h1>
          <p className="text-muted-foreground">Gestion des ordonnances électroniques et imprimables</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateBlankTemplatePDF}>
            <Printer className="h-4 w-4 mr-2" />
            Modèle vierge
          </Button>
          <Dialog open={showNewOrdonnance} onOpenChange={setShowNewOrdonnance}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle ordonnance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une ordonnance électronique</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Informations patient */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations du patient
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom *</Label>
                      <Input 
                        value={newOrdonnance.patientNom}
                        onChange={(e) => setNewOrdonnance(prev => ({ ...prev, patientNom: e.target.value }))}
                        placeholder="Nom du patient"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prénom *</Label>
                      <Input 
                        value={newOrdonnance.patientPrenom}
                        onChange={(e) => setNewOrdonnance(prev => ({ ...prev, patientPrenom: e.target.value }))}
                        placeholder="Prénom du patient"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de naissance</Label>
                      <Input 
                        type="date"
                        value={newOrdonnance.patientDateNaissance}
                        onChange={(e) => setNewOrdonnance(prev => ({ ...prev, patientDateNaissance: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Classe</Label>
                      <Input 
                        value={newOrdonnance.patientClasse}
                        onChange={(e) => setNewOrdonnance(prev => ({ ...prev, patientClasse: e.target.value }))}
                        placeholder="6ème A"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Matricule</Label>
                      <Input 
                        value={newOrdonnance.patientMatricule}
                        onChange={(e) => setNewOrdonnance(prev => ({ ...prev, patientMatricule: e.target.value }))}
                        placeholder="2024-XXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Diagnostic */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Diagnostic *
                  </h3>
                  <Textarea 
                    value={newOrdonnance.diagnostic}
                    onChange={(e) => setNewOrdonnance(prev => ({ ...prev, diagnostic: e.target.value }))}
                    placeholder="Description du diagnostic..."
                    rows={2}
                  />
                </div>

                {/* Médicaments */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Prescription
                  </h3>
                  
                  {/* Liste des médicaments ajoutés */}
                  {newOrdonnance.medicaments.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {newOrdonnance.medicaments.map((med, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{med.nom} {med.dosage}</p>
                              <p className="text-sm text-muted-foreground">{med.posologie} - {med.duree}</p>
                              {med.instructions && <p className="text-sm text-muted-foreground italic">{med.instructions}</p>}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => removeMedicamentFromOrdonnance(index)}
                            >
                              ×
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Formulaire ajout médicament */}
                  <Card className="p-4 bg-muted/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Médicament *</Label>
                        <Select 
                          value={newMedicament.nom}
                          onValueChange={(v) => setNewMedicament(prev => ({ ...prev, nom: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {medicamentsDisponibles.map(med => (
                              <SelectItem key={med.nom} value={med.nom}>{med.nom}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage *</Label>
                        <Select 
                          value={newMedicament.dosage}
                          onValueChange={(v) => setNewMedicament(prev => ({ ...prev, dosage: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {medicamentsDisponibles
                              .find(m => m.nom === newMedicament.nom)
                              ?.dosages.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Posologie *</Label>
                        <Input 
                          value={newMedicament.posologie}
                          onChange={(e) => setNewMedicament(prev => ({ ...prev, posologie: e.target.value }))}
                          placeholder="Ex: 1 comprimé matin et soir"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Durée *</Label>
                        <Input 
                          value={newMedicament.duree}
                          onChange={(e) => setNewMedicament(prev => ({ ...prev, duree: e.target.value }))}
                          placeholder="Ex: 5 jours"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Instructions supplémentaires</Label>
                        <Input 
                          value={newMedicament.instructions}
                          onChange={(e) => setNewMedicament(prev => ({ ...prev, instructions: e.target.value }))}
                          placeholder="Ex: À prendre pendant les repas"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-3 w-full"
                      onClick={addMedicamentToOrdonnance}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter ce médicament
                    </Button>
                  </Card>
                </div>

                {/* Recommandations */}
                <div>
                  <h3 className="font-semibold mb-3">Recommandations</h3>
                  <Textarea 
                    value={newOrdonnance.recommandations}
                    onChange={(e) => setNewOrdonnance(prev => ({ ...prev, recommandations: e.target.value }))}
                    placeholder="Conseils et recommandations pour le patient..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={createNewOrdonnance} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Créer et télécharger PDF
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewOrdonnance(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ordonnances.length}</p>
                <p className="text-sm text-muted-foreground">Total ordonnances</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ordonnances.filter(o => o.statut === "active").length}</p>
                <p className="text-sm text-muted-foreground">Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ordonnances.filter(o => o.type === "electronique").length}</p>
                <p className="text-sm text-muted-foreground">Électroniques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Printer className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ordonnances.filter(o => o.type === "manuelle").length}</p>
                <p className="text-sm text-muted-foreground">Manuelles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste des ordonnances</TabsTrigger>
          <TabsTrigger value="modeles">Modèles imprimables</TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historique des ordonnances</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les types</SelectItem>
                      <SelectItem value="electronique">Électronique</SelectItem>
                      <SelectItem value="manuelle">Manuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Ordonnance</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnostic</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrdonnances.map(ordonnance => (
                    <TableRow key={ordonnance.id}>
                      <TableCell className="font-mono text-sm">{ordonnance.numeroOrdonnance}</TableCell>
                      <TableCell className="font-medium">{ordonnance.patient.nom} {ordonnance.patient.prenom}</TableCell>
                      <TableCell>{ordonnance.patient.classe}</TableCell>
                      <TableCell>{new Date(ordonnance.dateEmission).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="max-w-xs truncate">{ordonnance.diagnostic}</TableCell>
                      <TableCell>
                        <Badge variant={ordonnance.type === "electronique" ? "default" : "outline"}>
                          {ordonnance.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatutBadge(ordonnance.statut)}>
                          {ordonnance.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setOrdonnanceDetails(ordonnance)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateOrdonnancePDF(ordonnance)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modeles">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:border-primary cursor-pointer transition-colors" onClick={generateBlankTemplatePDF}>
              <CardContent className="pt-6 text-center">
                <div className="p-4 bg-blue-50 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Ordonnance Vierge Standard</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Modèle classique avec tous les champs à remplir manuellement
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary cursor-pointer transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="p-4 bg-green-50 rounded-full w-fit mx-auto mb-4">
                  <Pill className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Ordonnance Simplifiée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Version compacte pour les prescriptions simples
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary cursor-pointer transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Ordonnance Renouvelable</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Modèle avec cases de renouvellement pour traitement long
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Instructions d'utilisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Ordonnance Électronique
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Remplissez le formulaire en ligne</li>
                    <li>Sélectionnez les médicaments dans la base</li>
                    <li>Le PDF est généré automatiquement</li>
                    <li>Archivage automatique dans l'historique</li>
                    <li>Possibilité de réimpression à tout moment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Printer className="h-4 w-4 text-blue-500" />
                    Ordonnance Imprimable (Manuelle)
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Téléchargez le modèle vierge</li>
                    <li>Imprimez plusieurs exemplaires</li>
                    <li>Remplissez à la main lors de la consultation</li>
                    <li>Idéal en cas de panne informatique</li>
                    <li>Conservez une copie pour l'archivage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog détails ordonnance */}
      <Dialog open={!!ordonnanceDetails} onOpenChange={() => setOrdonnanceDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'ordonnance {ordonnanceDetails?.numeroOrdonnance}</DialogTitle>
          </DialogHeader>
          {ordonnanceDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{ordonnanceDetails.patient.nom} {ordonnanceDetails.patient.prenom}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classe</p>
                  <p className="font-medium">{ordonnanceDetails.patient.classe}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date d'émission</p>
                  <p className="font-medium">{new Date(ordonnanceDetails.dateEmission).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Infirmière</p>
                  <p className="font-medium">{ordonnanceDetails.infirmiere}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Diagnostic</p>
                <p className="font-medium">{ordonnanceDetails.diagnostic}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Médicaments prescrits</p>
                <div className="space-y-2">
                  {ordonnanceDetails.medicaments.map((med, index) => (
                    <Card key={index} className="p-3">
                      <p className="font-medium">{med.nom} {med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.posologie} - Durée: {med.duree}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Recommandations</p>
                <p>{ordonnanceDetails.recommandations}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => generateOrdonnancePDF(ordonnanceDetails)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
