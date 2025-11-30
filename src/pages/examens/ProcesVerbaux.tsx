import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  UserCheck,
  Shield,
  FileCheck,
  Search,
  Plus,
  Eye
} from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface ProcesVerbal {
  id: string;
  epreuve: string;
  salle: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  candidatsPresents: number;
  candidatsAbsents: number;
  candidatsRetards: number;
  incidents: string;
  observations: string;
  materielDefectueux: string;
  signatures: Signature[];
  statut: "brouillon" | "en_attente" | "valide" | "archive";
  qrCode: string;
  createdAt: string;
  lastModified: string;
}

interface Signature {
  juryId: string;
  juryNom: string;
  juryRole: string;
  signedAt: string;
  ipAddress: string;
}

const mockPVs: ProcesVerbal[] = [
  {
    id: "PV001",
    epreuve: "Mathématiques - BEPC 2024",
    salle: "Salle A101",
    date: "2024-06-15",
    heureDebut: "08:00",
    heureFin: "11:00",
    candidatsPresents: 28,
    candidatsAbsents: 2,
    candidatsRetards: 1,
    incidents: "Candidat N°15 a quitté la salle à 10h30 (malaise). Prise en charge par l'infirmière.",
    observations: "Déroulement normal. Surveillance renforcée après incident.",
    materielDefectueux: "Aucun",
    signatures: [
      {
        juryId: "J001",
        juryNom: "Dr. Kouassi Jean",
        juryRole: "Président de Jury",
        signedAt: "2024-06-15T11:15:00",
        ipAddress: "192.168.1.45"
      },
      {
        juryId: "J002",
        juryNom: "Mme Adjoua Marie",
        juryRole: "Surveillante",
        signedAt: "2024-06-15T11:12:00",
        ipAddress: "192.168.1.46"
      }
    ],
    statut: "valide",
    qrCode: "QR-PV001-2024",
    createdAt: "2024-06-15T11:00:00",
    lastModified: "2024-06-15T11:15:00"
  },
  {
    id: "PV002",
    epreuve: "Français - BEPC 2024",
    salle: "Salle B203",
    date: "2024-06-16",
    heureDebut: "08:00",
    heureFin: "11:00",
    candidatsPresents: 30,
    candidatsAbsents: 0,
    candidatsRetards: 0,
    incidents: "",
    observations: "Épreuve s'est déroulée sans incident",
    materielDefectueux: "",
    signatures: [
      {
        juryId: "J003",
        juryNom: "M. Traoré Ibrahim",
        juryRole: "Président de Jury",
        signedAt: "2024-06-16T11:10:00",
        ipAddress: "192.168.1.47"
      }
    ],
    statut: "en_attente",
    qrCode: "QR-PV002-2024",
    createdAt: "2024-06-16T11:00:00",
    lastModified: "2024-06-16T11:10:00"
  },
  {
    id: "PV003",
    epreuve: "Sciences Physiques - BEPC 2024",
    salle: "Salle C105",
    date: "2024-06-17",
    heureDebut: "14:00",
    heureFin: "16:00",
    candidatsPresents: 25,
    candidatsAbsents: 5,
    candidatsRetards: 3,
    incidents: "Panne d'électricité de 14h45 à 15h00. Temps de composition prolongé de 15 minutes.",
    observations: "Candidats ont été encadrés pendant la panne. Composition reprise normalement après rétablissement.",
    materielDefectueux: "1 table endommagée (remplacée)",
    signatures: [],
    statut: "brouillon",
    qrCode: "",
    createdAt: "2024-06-17T16:00:00",
    lastModified: "2024-06-17T16:30:00"
  }
];

const mockJurys = [
  { id: "J001", nom: "Dr. Kouassi Jean", role: "Président de Jury" },
  { id: "J002", nom: "Mme Adjoua Marie", role: "Surveillante" },
  { id: "J003", nom: "M. Traoré Ibrahim", role: "Président de Jury" },
  { id: "J004", nom: "Mlle Bamba Fatou", role: "Surveillante" },
  { id: "J005", nom: "M. Diallo Mamadou", role: "Secrétaire" }
];

export default function ProcesVerbaux() {
  const [pvs, setPvs] = useState<ProcesVerbal[]>(mockPVs);
  const [selectedPV, setSelectedPV] = useState<ProcesVerbal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("tous");
  const [formData, setFormData] = useState<Partial<ProcesVerbal>>({
    epreuve: "",
    salle: "",
    date: "",
    heureDebut: "",
    heureFin: "",
    candidatsPresents: 0,
    candidatsAbsents: 0,
    candidatsRetards: 0,
    incidents: "",
    observations: "",
    materielDefectueux: "",
    signatures: []
  });

  const stats = {
    total: pvs.length,
    brouillon: pvs.filter(pv => pv.statut === "brouillon").length,
    enAttente: pvs.filter(pv => pv.statut === "en_attente").length,
    valide: pvs.filter(pv => pv.statut === "valide").length,
  };

  const filteredPVs = pvs.filter(pv => {
    const matchesSearch = pv.epreuve.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pv.salle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "tous" || pv.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePV = () => {
    setFormData({
      epreuve: "",
      salle: "",
      date: "",
      heureDebut: "",
      heureFin: "",
      candidatsPresents: 0,
      candidatsAbsents: 0,
      candidatsRetards: 0,
      incidents: "",
      observations: "",
      materielDefectueux: "",
      signatures: []
    });
    setSelectedPV(null);
    setIsDialogOpen(true);
  };

  const handleEditPV = (pv: ProcesVerbal) => {
    setFormData(pv);
    setSelectedPV(pv);
    setIsDialogOpen(true);
  };

  const handleSavePV = () => {
    // Validation des champs obligatoires
    if (!formData.epreuve || !formData.salle || !formData.date || 
        !formData.heureDebut || !formData.heureFin) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.candidatsPresents === undefined || formData.candidatsAbsents === undefined || 
        formData.candidatsRetards === undefined) {
      toast.error("Veuillez renseigner le nombre de candidats");
      return;
    }

    const newPV: ProcesVerbal = {
      id: selectedPV?.id || `PV${String(pvs.length + 1).padStart(3, '0')}`,
      epreuve: formData.epreuve!,
      salle: formData.salle!,
      date: formData.date!,
      heureDebut: formData.heureDebut!,
      heureFin: formData.heureFin!,
      candidatsPresents: formData.candidatsPresents!,
      candidatsAbsents: formData.candidatsAbsents!,
      candidatsRetards: formData.candidatsRetards!,
      incidents: formData.incidents || "",
      observations: formData.observations || "",
      materielDefectueux: formData.materielDefectueux || "",
      signatures: formData.signatures || [],
      statut: "brouillon",
      qrCode: "",
      createdAt: selectedPV?.createdAt || new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    if (selectedPV) {
      setPvs(pvs.map(pv => pv.id === selectedPV.id ? newPV : pv));
      toast.success("Procès-verbal modifié avec succès");
    } else {
      setPvs([...pvs, newPV]);
      toast.success("Procès-verbal créé avec succès");
    }

    setIsDialogOpen(false);
  };

  const handleSignPV = (pv: ProcesVerbal) => {
    setSelectedPV(pv);
    setIsSignatureDialogOpen(true);
  };

  const handleAddSignature = (juryId: string) => {
    if (!selectedPV) return;

    const jury = mockJurys.find(j => j.id === juryId);
    if (!jury) return;

    // Vérifier si le jury a déjà signé
    if (selectedPV.signatures.some(s => s.juryId === juryId)) {
      toast.error("Ce jury a déjà signé ce procès-verbal");
      return;
    }

    const newSignature: Signature = {
      juryId: jury.id,
      juryNom: jury.nom,
      juryRole: jury.role,
      signedAt: new Date().toISOString(),
      ipAddress: "192.168.1.100" // Simulé
    };

    const updatedPV = {
      ...selectedPV,
      signatures: [...selectedPV.signatures, newSignature],
      statut: selectedPV.signatures.length + 1 >= 2 ? "en_attente" as const : "brouillon" as const,
      lastModified: new Date().toISOString()
    };

    setPvs(pvs.map(pv => pv.id === selectedPV.id ? updatedPV : pv));
    setSelectedPV(updatedPV);
    
    toast.success(`Signature de ${jury.nom} ajoutée avec succès`);
  };

  const handleValidatePV = (pv: ProcesVerbal) => {
    if (pv.signatures.length < 2) {
      toast.error("Le procès-verbal doit être signé par au moins 2 jurys");
      return;
    }

    const updatedPV = {
      ...pv,
      statut: "valide" as const,
      qrCode: `QR-${pv.id}-${new Date().getFullYear()}`,
      lastModified: new Date().toISOString()
    };

    setPvs(pvs.map(p => p.id === pv.id ? updatedPV : p));
    toast.success("Procès-verbal validé avec succès");
  };

  const generatePDF = (pv: ProcesVerbal) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // En-tête
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PROCÈS-VERBAL D'EXAMEN", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`N° ${pv.id}`, pageWidth / 2, 28, { align: "center" });
    
    // QR Code (simulé avec texte)
    if (pv.qrCode) {
      doc.setFontSize(8);
      doc.text(`[QR Code: ${pv.qrCode}]`, pageWidth - 40, 20);
      doc.setFillColor(200, 200, 200);
      doc.rect(pageWidth - 40, 25, 30, 30, "F");
      doc.text("QR CODE", pageWidth - 32, 42);
      doc.setFontSize(6);
      doc.text("Anti-fraude", pageWidth - 32, 46);
    }
    
    let yPos = 45;
    
    // Informations générales
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. INFORMATIONS GÉNÉRALES", 14, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Épreuve: ${pv.epreuve}`, 20, yPos);
    yPos += 6;
    doc.text(`Salle: ${pv.salle}`, 20, yPos);
    yPos += 6;
    doc.text(`Date: ${new Date(pv.date).toLocaleDateString('fr-FR')}`, 20, yPos);
    yPos += 6;
    doc.text(`Horaire: ${pv.heureDebut} - ${pv.heureFin}`, 20, yPos);
    yPos += 10;
    
    // Candidats
    doc.setFont("helvetica", "bold");
    doc.text("2. PRÉSENCE DES CANDIDATS", 14, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Candidats présents: ${pv.candidatsPresents}`, 20, yPos);
    yPos += 6;
    doc.text(`Candidats absents: ${pv.candidatsAbsents}`, 20, yPos);
    yPos += 6;
    doc.text(`Candidats en retard: ${pv.candidatsRetards}`, 20, yPos);
    yPos += 6;
    doc.text(`Total: ${pv.candidatsPresents + pv.candidatsAbsents + pv.candidatsRetards}`, 20, yPos);
    yPos += 10;
    
    // Incidents
    doc.setFont("helvetica", "bold");
    doc.text("3. INCIDENTS SIGNALÉS", 14, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    const incidentsText = pv.incidents || "Aucun incident signalé";
    const incidentsLines = doc.splitTextToSize(incidentsText, pageWidth - 30);
    doc.text(incidentsLines, 20, yPos);
    yPos += incidentsLines.length * 5 + 5;
    
    // Matériel défectueux
    doc.setFont("helvetica", "bold");
    doc.text("4. MATÉRIEL DÉFECTUEUX", 14, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    const materielText = pv.materielDefectueux || "Aucun";
    doc.text(materielText, 20, yPos);
    yPos += 10;
    
    // Observations
    doc.setFont("helvetica", "bold");
    doc.text("5. OBSERVATIONS", 14, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    const obsLines = doc.splitTextToSize(pv.observations || "Aucune observation", pageWidth - 30);
    doc.text(obsLines, 20, yPos);
    yPos += obsLines.length * 5 + 10;
    
    // Vérifier si on a besoin d'une nouvelle page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    // Signatures
    doc.setFont("helvetica", "bold");
    doc.text("6. SIGNATURES ÉLECTRONIQUES", 14, yPos);
    yPos += 8;
    
    pv.signatures.forEach((sig, index) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${sig.juryRole}: ${sig.juryNom}`, 20, yPos);
      yPos += 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Signé le ${new Date(sig.signedAt).toLocaleString('fr-FR')} - IP: ${sig.ipAddress}`, 20, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      yPos += 8;
    });
    
    // Pied de page avec horodatage
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Document généré le ${new Date().toLocaleString('fr-FR')} - Certifié conforme`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    
    doc.save(`PV_${pv.id}_${pv.epreuve.replace(/\s+/g, '_')}.pdf`);
    toast.success("PDF généré avec succès");
  };

  const getStatusBadge = (statut: ProcesVerbal["statut"]) => {
    switch (statut) {
      case "brouillon":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Brouillon</Badge>;
      case "en_attente":
        return <Badge variant="outline" className="border-orange-500 text-orange-600"><AlertTriangle className="h-3 w-3 mr-1" />En attente</Badge>;
      case "valide":
        return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Validé</Badge>;
      case "archive":
        return <Badge variant="secondary">Archivé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Procès-Verbaux d'Examens</h1>
          <p className="text-muted-foreground">Saisie et gestion des PV dématérialisés par épreuve</p>
        </div>
        <Button onClick={handleCreatePV} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau PV
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PV</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.brouillon}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enAttente}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.valide}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par épreuve ou salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="valide">Validé</SelectItem>
                <SelectItem value="archive">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des PV */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Procès-Verbaux</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° PV</TableHead>
                <TableHead>Épreuve</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Candidats</TableHead>
                <TableHead>Signatures</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPVs.map((pv) => (
                <TableRow key={pv.id}>
                  <TableCell className="font-medium">{pv.id}</TableCell>
                  <TableCell>{pv.epreuve}</TableCell>
                  <TableCell>{pv.salle}</TableCell>
                  <TableCell>{new Date(pv.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">{pv.candidatsPresents}P</span>
                      <span className="text-red-600">{pv.candidatsAbsents}A</span>
                      <span className="text-orange-600">{pv.candidatsRetards}R</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span>{pv.signatures.length}/2</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(pv.statut)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPV(pv)}
                        disabled={pv.statut === "valide"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSignPV(pv)}
                        disabled={pv.statut === "valide"}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      {pv.statut === "en_attente" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleValidatePV(pv)}
                        >
                          <Shield className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {pv.statut === "valide" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generatePDF(pv)}
                        >
                          <Download className="h-4 w-4" />
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

      {/* Dialog formulaire PV */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedPV ? "Modifier le Procès-Verbal" : "Nouveau Procès-Verbal"}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Informations générales
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="epreuve">Épreuve *</Label>
                    <Input
                      id="epreuve"
                      value={formData.epreuve}
                      onChange={(e) => setFormData({ ...formData, epreuve: e.target.value })}
                      placeholder="Ex: Mathématiques - BEPC 2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salle">Salle *</Label>
                    <Input
                      id="salle"
                      value={formData.salle}
                      onChange={(e) => setFormData({ ...formData, salle: e.target.value })}
                      placeholder="Ex: Salle A101"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="heureDebut">Début *</Label>
                      <Input
                        id="heureDebut"
                        type="time"
                        value={formData.heureDebut}
                        onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heureFin">Fin *</Label>
                      <Input
                        id="heureFin"
                        type="time"
                        value={formData.heureFin}
                        onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Présence des candidats */}
              <div className="space-y-4">
                <h3 className="font-semibold">Présence des candidats *</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="presents">Présents</Label>
                    <Input
                      id="presents"
                      type="number"
                      min="0"
                      value={formData.candidatsPresents || 0}
                      onChange={(e) => setFormData({ ...formData, candidatsPresents: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="absents">Absents</Label>
                    <Input
                      id="absents"
                      type="number"
                      min="0"
                      value={formData.candidatsAbsents || 0}
                      onChange={(e) => setFormData({ ...formData, candidatsAbsents: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retards">Retards</Label>
                    <Input
                      id="retards"
                      type="number"
                      min="0"
                      value={formData.candidatsRetards || 0}
                      onChange={(e) => setFormData({ ...formData, candidatsRetards: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <Alert>
                  <AlertDescription>
                    Total candidats: {(formData.candidatsPresents || 0) + (formData.candidatsAbsents || 0) + (formData.candidatsRetards || 0)}
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              {/* Incidents */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Incidents signalés *
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="incidents">Description des incidents</Label>
                  <Textarea
                    id="incidents"
                    value={formData.incidents}
                    onChange={(e) => setFormData({ ...formData, incidents: e.target.value })}
                    placeholder="Décrire tout incident survenu pendant l'épreuve (fraudes, malaises, évacuations, etc.). Saisir 'Aucun' si rien à signaler."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ce champ est obligatoire. Mentionnez les numéros de candidats concernés et l'heure des incidents.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Matériel défectueux */}
              <div className="space-y-4">
                <h3 className="font-semibold">Matériel défectueux *</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="materiel">État du matériel</Label>
                  <Textarea
                    id="materiel"
                    value={formData.materielDefectueux}
                    onChange={(e) => setFormData({ ...formData, materielDefectueux: e.target.value })}
                    placeholder="Signaler tout matériel défectueux (tables, chaises, ventilateurs, etc.). Saisir 'Aucun' si tout est en bon état."
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Observations */}
              <div className="space-y-4">
                <h3 className="font-semibold">Observations générales *</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="observations">Observations</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Observations générales sur le déroulement de l'épreuve..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSavePV}>
              <FileCheck className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog signatures */}
      <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Signatures Électroniques</DialogTitle>
          </DialogHeader>

          {selectedPV && (
            <div className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Procès-verbal: <strong>{selectedPV.epreuve}</strong> - {selectedPV.salle}
                  <br />
                  Signatures requises: 2 minimum (Président de jury + Surveillant)
                </AlertDescription>
              </Alert>

              {/* Signatures existantes */}
              {selectedPV.signatures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Signatures enregistrées ({selectedPV.signatures.length})</h3>
                  {selectedPV.signatures.map((sig, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{sig.juryNom.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{sig.juryNom}</div>
                            <div className="text-sm text-muted-foreground">{sig.juryRole}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Signé le {new Date(sig.signedAt).toLocaleString('fr-FR')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              IP: {sig.ipAddress}
                            </div>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Ajouter une signature */}
              {selectedPV.statut !== "valide" && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Ajouter une signature</h3>
                  <div className="grid gap-2">
                    {mockJurys.map((jury) => (
                      <Card
                        key={jury.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleAddSignature(jury.id)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{jury.nom.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{jury.nom}</div>
                                <div className="text-sm text-muted-foreground">{jury.role}</div>
                              </div>
                            </div>
                            {selectedPV.signatures.some(s => s.juryId === jury.id) ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Signé
                              </Badge>
                            ) : (
                              <Button size="sm" variant="outline">
                                <UserCheck className="h-4 w-4 mr-2" />
                                Signer
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSignatureDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
