import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  PenTool, 
  Clock, 
  History, 
  UserCheck, 
  Scale, 
  Trophy,
  XCircle,
  AlertCircle,
  FileCheck,
  Archive,
  Shield,
  Gavel
} from "lucide-react";

// Mock data for candidates with their results
const mockCandidats = [
  { id: "C001", nom: "KOUASSI", prenom: "Aya Marie", tableNum: "A001", moyenne: 17.25, mention: "Très Bien", statut: "validé", decision: "Admis", jury: true },
  { id: "C002", nom: "TRAORE", prenom: "Ibrahim", tableNum: "A002", moyenne: 15.50, mention: "Bien", statut: "validé", decision: "Admis", jury: true },
  { id: "C003", nom: "KONE", prenom: "Fatou", tableNum: "A003", moyenne: 14.25, mention: "Bien", statut: "validé", decision: "Admis", jury: true },
  { id: "C004", nom: "DIABATE", prenom: "Moussa", tableNum: "A004", moyenne: 12.75, mention: "Assez Bien", statut: "validé", decision: "Admis", jury: true },
  { id: "C005", nom: "COULIBALY", prenom: "Aminata", tableNum: "A005", moyenne: 10.00, mention: "Passable", statut: "cas_limite", decision: "En délibération", jury: false },
  { id: "C006", nom: "BAMBA", prenom: "Seydou", tableNum: "A006", moyenne: 9.95, mention: "-", statut: "cas_limite", decision: "En délibération", jury: false },
  { id: "C007", nom: "OUATTARA", prenom: "Mariam", tableNum: "A007", moyenne: 11.50, mention: "Passable", statut: "validé", decision: "Admis", jury: true },
  { id: "C008", nom: "YAPI", prenom: "Jean-Claude", tableNum: "A008", moyenne: 16.75, mention: "Très Bien", statut: "validé", decision: "Admis", jury: true },
  { id: "C009", nom: "AHOU", prenom: "Christelle", tableNum: "A009", moyenne: 9.50, mention: "-", statut: "rejeté", decision: "Ajourné", jury: true },
  { id: "C010", nom: "GNAGNE", prenom: "Pascal", tableNum: "A010", moyenne: 13.25, mention: "Assez Bien", statut: "validé", decision: "Admis", jury: true },
  { id: "C011", nom: "KONAN", prenom: "Estelle", tableNum: "A011", moyenne: 10.05, mention: "Passable", statut: "cas_limite", decision: "En délibération", jury: false },
  { id: "C012", nom: "SORO", prenom: "Ahmed", tableNum: "A012", moyenne: 8.75, mention: "-", statut: "rejeté", decision: "Ajourné", jury: true },
];

// Mock jury members
const mockJuryMembers = [
  { id: "J001", nom: "Prof. KOUAME", fonction: "Président du Jury", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", signed: true, signedAt: "2024-06-15 14:30" },
  { id: "J002", nom: "Dr. BROU", fonction: "Vice-Président", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", signed: true, signedAt: "2024-06-15 14:35" },
  { id: "J003", nom: "M. ACHI", fonction: "Secrétaire", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", signed: false, signedAt: null },
  { id: "J004", nom: "Mme KOUA", fonction: "Membre", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", signed: false, signedAt: null },
  { id: "J005", nom: "M. ASSI", fonction: "Membre", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100", signed: true, signedAt: "2024-06-15 14:40" },
];

// Mock decision history
const mockHistorique = [
  { id: 1, candidat: "COULIBALY Aminata", tableNum: "A005", ancienneDecision: "En délibération", nouvelleDecision: "Admis", motif: "Repêchage accordé - Moyenne à 10.00 exactement, bon dossier scolaire, progression constante", jury: "Prof. KOUAME", date: "2024-06-15 14:45" },
  { id: 2, candidat: "BAMBA Seydou", tableNum: "A006", ancienneDecision: "En délibération", nouvelleDecision: "Ajourné", motif: "Moyenne insuffisante (9.95), pas de circonstances atténuantes", jury: "Dr. BROU", date: "2024-06-15 14:50" },
  { id: 3, candidat: "AHOU Christelle", tableNum: "A009", ancienneDecision: "En délibération", nouvelleDecision: "Ajourné", motif: "Moyenne insuffisante (9.50), absences répétées aux épreuves pratiques", jury: "Prof. KOUAME", date: "2024-06-15 15:00" },
  { id: 4, candidat: "KONAN Estelle", tableNum: "A011", ancienneDecision: "En délibération", nouvelleDecision: "Admis", motif: "Repêchage accordé - Moyenne à 10.05, excellente conduite, efforts remarquables", jury: "Mme KOUA", date: "2024-06-15 15:10" },
];

// Mention thresholds
const getMention = (moyenne: number): string => {
  if (moyenne >= 16) return "Très Bien";
  if (moyenne >= 14) return "Bien";
  if (moyenne >= 12) return "Assez Bien";
  if (moyenne >= 10) return "Passable";
  return "-";
};

const getMentionColor = (mention: string): string => {
  switch (mention) {
    case "Très Bien": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Bien": return "bg-blue-100 text-blue-800 border-blue-300";
    case "Assez Bien": return "bg-amber-100 text-amber-800 border-amber-300";
    case "Passable": return "bg-gray-100 text-gray-800 border-gray-300";
    default: return "bg-red-100 text-red-800 border-red-300";
  }
};

const getStatutColor = (statut: string): string => {
  switch (statut) {
    case "validé": return "bg-green-100 text-green-800";
    case "cas_limite": return "bg-orange-100 text-orange-800";
    case "rejeté": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getDecisionColor = (decision: string): string => {
  switch (decision) {
    case "Admis": return "bg-green-100 text-green-800";
    case "Ajourné": return "bg-red-100 text-red-800";
    case "En délibération": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function Deliberations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterDecision, setFilterDecision] = useState("all");
  const [selectedCandidat, setSelectedCandidat] = useState<any>(null);
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [pvDialogOpen, setPvDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [decisionMotif, setDecisionMotif] = useState("");
  const [nouvelleDecision, setNouvelleDecision] = useState("");
  const [juryMembers, setJuryMembers] = useState(mockJuryMembers);
  const [candidats, setCandidats] = useState(mockCandidats);
  const [historique, setHistorique] = useState(mockHistorique);

  // Statistics
  const totalCandidats = candidats.length;
  const admis = candidats.filter(c => c.decision === "Admis").length;
  const ajournes = candidats.filter(c => c.decision === "Ajourné").length;
  const casLimites = candidats.filter(c => c.statut === "cas_limite").length;
  const tresBien = candidats.filter(c => c.mention === "Très Bien" && c.decision === "Admis").length;
  const bien = candidats.filter(c => c.mention === "Bien" && c.decision === "Admis").length;
  const assezBien = candidats.filter(c => c.mention === "Assez Bien" && c.decision === "Admis").length;
  const tauxReussite = totalCandidats > 0 ? ((admis / totalCandidats) * 100).toFixed(1) : "0";
  const signaturesObtenues = juryMembers.filter(j => j.signed).length;
  const totalSignatures = juryMembers.length;

  // Filtered candidates
  const filteredCandidats = candidats.filter(c => {
    const matchesSearch = 
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tableNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === "all" || c.statut === filterStatut;
    const matchesDecision = filterDecision === "all" || c.decision === filterDecision;
    return matchesSearch && matchesStatut && matchesDecision;
  });

  // Borderline cases (moyenne between 9.5 and 10.5)
  const casLimitesList = candidats.filter(c => c.moyenne >= 9.5 && c.moyenne <= 10.5);

  const handleDecision = () => {
    if (!selectedCandidat || !nouvelleDecision || !decisionMotif.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newMention = nouvelleDecision === "Admis" ? getMention(selectedCandidat.moyenne) : "-";
    
    // Update candidate
    setCandidats(prev => prev.map(c => 
      c.id === selectedCandidat.id 
        ? { ...c, decision: nouvelleDecision, mention: newMention, statut: nouvelleDecision === "Admis" ? "validé" : "rejeté", jury: true }
        : c
    ));

    // Add to history
    const newHistorique = {
      id: historique.length + 1,
      candidat: `${selectedCandidat.nom} ${selectedCandidat.prenom}`,
      tableNum: selectedCandidat.tableNum,
      ancienneDecision: selectedCandidat.decision,
      nouvelleDecision: nouvelleDecision,
      motif: decisionMotif,
      jury: "Prof. KOUAME (Session actuelle)",
      date: new Date().toLocaleString("fr-FR")
    };
    setHistorique(prev => [newHistorique, ...prev]);

    toast.success(`Décision enregistrée pour ${selectedCandidat.nom} ${selectedCandidat.prenom}`);
    setDecisionDialogOpen(false);
    setSelectedCandidat(null);
    setDecisionMotif("");
    setNouvelleDecision("");
  };

  const handleSignature = (juryId: string) => {
    setJuryMembers(prev => prev.map(j => 
      j.id === juryId 
        ? { ...j, signed: true, signedAt: new Date().toLocaleString("fr-FR") }
        : j
    ));
    toast.success("Signature électronique enregistrée");
  };

  const handleValiderDeliberations = () => {
    const nonTraites = candidats.filter(c => c.decision === "En délibération");
    if (nonTraites.length > 0) {
      toast.error(`${nonTraites.length} candidat(s) encore en délibération`);
      return;
    }
    if (signaturesObtenues < totalSignatures) {
      toast.warning("Toutes les signatures du jury ne sont pas encore obtenues");
      return;
    }
    toast.success("Délibérations validées et archivées avec succès");
  };

  const handleExportPV = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(10);
    doc.text("RÉPUBLIQUE DE CÔTE D'IVOIRE", 105, 15, { align: "center" });
    doc.text("Ministère de l'Éducation Nationale", 105, 20, { align: "center" });
    
    // Border
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);
    
    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PROCÈS-VERBAL DE DÉLIBÉRATION", 105, 35, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Session 2024 - B.E.P.C.", 105, 43, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 105, 50, { align: "center" });
    
    // Statistics
    doc.setFontSize(11);
    doc.text(`Nombre de candidats: ${totalCandidats}`, 20, 65);
    doc.text(`Admis: ${admis} (${tauxReussite}%)`, 20, 72);
    doc.text(`Ajournés: ${ajournes}`, 100, 65);
    doc.text(`Cas limites traités: ${casLimites}`, 100, 72);
    
    // Results table
    const tableData = candidats.map(c => [
      c.tableNum,
      `${c.nom} ${c.prenom}`,
      c.moyenne.toFixed(2),
      c.mention || '-',
      c.decision
    ]);
    
    autoTable(doc, {
      head: [['N° Table', 'Nom et Prénom', 'Moyenne', 'Mention', 'Décision']],
      body: tableData,
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 51, 102] },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          const decision = data.cell.raw as string;
          if (decision === 'Admis') {
            data.cell.styles.textColor = [0, 128, 0];
            data.cell.styles.fontStyle = 'bold';
          } else if (decision === 'Ajourné') {
            data.cell.styles.textColor = [200, 0, 0];
          }
        }
      }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Jury signatures section
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SIGNATURES DU JURY:", 20, finalY);
    
    doc.setFont("helvetica", "normal");
    let signY = finalY + 10;
    juryMembers.forEach(jury => {
      const status = jury.signed ? `✓ Signé le ${jury.signedAt}` : '○ En attente';
      doc.text(`${jury.nom} (${jury.fonction}): ${status}`, 25, signY);
      signY += 7;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.text("Document officiel - Ne peut être modifié après validation", 105, 275, { align: "center" });
    
    doc.save(`PV_Deliberation_BEPC_2024.pdf`);
    toast.success("Procès-verbal de délibération généré");
  };

  const handleArchiver = () => {
    // Vérification que tout est prêt pour l'archivage
    const nonTraites = candidats.filter(c => c.decision === "En délibération");
    if (nonTraites.length > 0) {
      toast.error("Impossible d'archiver: des candidats sont encore en délibération");
      return;
    }
    
    // Simuler l'archivage
    const archiveData = {
      date: new Date().toISOString(),
      session: "BEPC 2024",
      candidats: candidats.length,
      admis: admis,
      tauxReussite: tauxReussite,
      jurySignatures: juryMembers.filter(j => j.signed).length,
      historique: historique.length
    };
    
    localStorage.setItem('archive_deliberations_2024', JSON.stringify(archiveData));
    toast.success("Délibérations archivées conformément à la réglementation (10 ans)", {
      description: `${candidats.length} dossiers archivés avec ${historique.length} décisions tracées`
    });
  };

  const handleExportHistorique = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("HISTORIQUE DES DÉCISIONS", 105, 20, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Session: BEPC 2024`, 20, 35);
    doc.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, 120, 35);
    
    const tableData = historique.map(h => [
      h.date,
      h.candidat,
      h.tableNum,
      h.ancienneDecision,
      h.nouvelleDecision,
      h.jury
    ]);
    
    autoTable(doc, {
      head: [['Date', 'Candidat', 'N° Table', 'Ancienne', 'Nouvelle', 'Jury']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 51, 102] },
      columnStyles: {
        5: { cellWidth: 30 }
      }
    });
    
    doc.save(`Historique_Decisions_BEPC_2024.pdf`);
    toast.success("Historique des décisions exporté");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Délibérations</h1>
          <p className="text-muted-foreground">Validation finale des résultats par le jury d'examen</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPvDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Voir PV
          </Button>
          <Button variant="outline" onClick={handleExportPV}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PV
          </Button>
          <Button onClick={handleValiderDeliberations}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Valider Délibérations
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalCandidats}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{tauxReussite}%</span>
            </div>
            <Progress value={parseFloat(tauxReussite)} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{admis}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ajournés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{ajournes}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cas Limites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">{casLimites}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{signaturesObtenues}/{totalSignatures}</span>
            </div>
            <Progress value={(signaturesObtenues / totalSignatures) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Mentions Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Répartition des Mentions
          </CardTitle>
          <CardDescription>Attribution automatique selon le barème officiel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-sm font-medium text-emerald-700">Très Bien (≥16)</div>
              <div className="text-3xl font-bold text-emerald-600">{tresBien}</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm font-medium text-blue-700">Bien (≥14)</div>
              <div className="text-3xl font-bold text-blue-600">{bien}</div>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-sm font-medium text-amber-700">Assez Bien (≥12)</div>
              <div className="text-3xl font-bold text-amber-600">{assezBien}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-sm font-medium text-gray-700">Passable (≥10)</div>
              <div className="text-3xl font-bold text-gray-600">{admis - tresBien - bien - assezBien}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="candidats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="candidats" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tous les Candidats
          </TabsTrigger>
          <TabsTrigger value="cas_limites" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Cas Limites
          </TabsTrigger>
          <TabsTrigger value="signatures" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Signatures Jury
          </TabsTrigger>
          <TabsTrigger value="historique" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* All Candidates Tab */}
        <TabsContent value="candidats">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Liste des Candidats</CardTitle>
                  <CardDescription>Validation et attribution des décisions finales</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="validé">Validé</SelectItem>
                      <SelectItem value="cas_limite">Cas limite</SelectItem>
                      <SelectItem value="rejeté">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDecision} onValueChange={setFilterDecision}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Décision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes décisions</SelectItem>
                      <SelectItem value="Admis">Admis</SelectItem>
                      <SelectItem value="Ajourné">Ajourné</SelectItem>
                      <SelectItem value="En délibération">En délibération</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Table</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead className="text-center">Moyenne</TableHead>
                      <TableHead className="text-center">Mention</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-center">Décision</TableHead>
                      <TableHead className="text-center">Jury</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidats.map((candidat) => (
                      <TableRow key={candidat.id} className={candidat.statut === "cas_limite" ? "bg-orange-50" : ""}>
                        <TableCell className="font-mono font-medium">{candidat.tableNum}</TableCell>
                        <TableCell>
                          <div className="font-medium">{candidat.nom}</div>
                          <div className="text-sm text-muted-foreground">{candidat.prenom}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold text-lg ${candidat.moyenne >= 10 ? "text-green-600" : "text-red-600"}`}>
                            {candidat.moyenne.toFixed(2)}/20
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMentionColor(candidat.mention)}>
                            {candidat.mention}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getStatutColor(candidat.statut)}>
                            {candidat.statut === "cas_limite" ? "Cas limite" : candidat.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getDecisionColor(candidat.decision)}>
                            {candidat.decision}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {candidat.jury ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-500 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant={candidat.decision === "En délibération" ? "default" : "outline"}
                            onClick={() => {
                              setSelectedCandidat(candidat);
                              setDecisionDialogOpen(true);
                            }}
                          >
                            <Gavel className="h-4 w-4 mr-1" />
                            Décider
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Borderline Cases Tab */}
        <TabsContent value="cas_limites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Cas Limites - Délibération Requise
              </CardTitle>
              <CardDescription>
                Candidats avec moyenne entre 9.50 et 10.50 nécessitant une décision du jury
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Attention - Décisions Critiques</AlertTitle>
                <AlertDescription>
                  Ces candidats sont proches du seuil d'admission (10/20). Chaque décision doit être argumentée et 
                  documentée dans le procès-verbal de délibération. Le jury peut accorder un repêchage en considérant 
                  le dossier global du candidat.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {casLimitesList.map((candidat) => (
                  <Card key={candidat.id} className={`border-2 ${candidat.moyenne >= 10 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${candidat.moyenne >= 10 ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                            {candidat.moyenne.toFixed(2)}
                          </div>
                          <div>
                            <div className="font-bold text-lg">{candidat.nom} {candidat.prenom}</div>
                            <div className="text-sm text-muted-foreground">N° Table: {candidat.tableNum}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getDecisionColor(candidat.decision)}>
                                {candidat.decision}
                              </Badge>
                              {candidat.moyenne === 10 && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  Moyenne exacte 10/20
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              setSelectedCandidat(candidat);
                              setNouvelleDecision("Admis");
                              setDecisionDialogOpen(true);
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Admettre
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setSelectedCandidat(candidat);
                              setNouvelleDecision("Ajourné");
                              setDecisionDialogOpen(true);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Ajourner
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {casLimitesList.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun cas limite à traiter</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jury Signatures Tab */}
        <TabsContent value="signatures">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Signatures Électroniques du Jury
              </CardTitle>
              <CardDescription>
                Validation du procès-verbal de délibération par les membres du jury
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertTitle>Signatures Sécurisées</AlertTitle>
                <AlertDescription>
                  Chaque signature est horodatée et liée à l'identité du membre du jury. 
                  Le PV ne peut être finalisé qu'après obtention de toutes les signatures requises.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {juryMembers.map((member) => (
                  <Card key={member.id} className={member.signed ? "border-green-300 bg-green-50" : "border-orange-300 bg-orange-50"}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.photo} alt={member.nom} />
                          <AvatarFallback>{member.nom.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-bold">{member.nom}</div>
                          <div className="text-sm text-muted-foreground">{member.fonction}</div>
                          {member.signed ? (
                            <div className="flex items-center gap-1 mt-2 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-xs">Signé le {member.signedAt}</span>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleSignature(member.id)}
                            >
                              <PenTool className="h-4 w-4 mr-1" />
                              Signer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Progression des signatures</div>
                    <div className="text-sm text-muted-foreground">
                      {signaturesObtenues} sur {totalSignatures} signatures obtenues
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {((signaturesObtenues / totalSignatures) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <Progress value={(signaturesObtenues / totalSignatures) * 100} className="mt-2 h-3" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historique des Décisions
                  </CardTitle>
                  <CardDescription>
                    Journal complet des délibérations avec traçabilité complète
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleArchiver}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver (10 ans)
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <FileCheck className="h-4 w-4" />
                <AlertTitle>Archivage Conforme</AlertTitle>
                <AlertDescription>
                  Toutes les décisions sont enregistrées avec horodatage, identité du jury et motif détaillé. 
                  L'archivage est conforme à la réglementation (conservation 10 ans minimum).
                </AlertDescription>
              </Alert>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead>N° Table</TableHead>
                      <TableHead>Ancienne Décision</TableHead>
                      <TableHead>Nouvelle Décision</TableHead>
                      <TableHead>Membre du Jury</TableHead>
                      <TableHead className="w-1/4">Motif</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historique.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{entry.date}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{entry.candidat}</TableCell>
                        <TableCell className="font-mono">{entry.tableNum}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getDecisionColor(entry.ancienneDecision)}>
                            {entry.ancienneDecision}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDecisionColor(entry.nouvelleDecision)}>
                            {entry.nouvelleDecision}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.jury}</TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground line-clamp-2">{entry.motif}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Decision Dialog */}
      <Dialog open={decisionDialogOpen} onOpenChange={setDecisionDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Décision du Jury
            </DialogTitle>
            <DialogDescription>
              Enregistrer la décision finale pour ce candidat
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidat && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Candidat</Label>
                    <p className="font-medium">{selectedCandidat.nom} {selectedCandidat.prenom}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">N° Table</Label>
                    <p className="font-mono">{selectedCandidat.tableNum}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Moyenne</Label>
                    <p className={`font-bold text-lg ${selectedCandidat.moyenne >= 10 ? "text-green-600" : "text-red-600"}`}>
                      {selectedCandidat.moyenne.toFixed(2)}/20
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Mention Prévue</Label>
                    <Badge variant="outline" className={getMentionColor(getMention(selectedCandidat.moyenne))}>
                      {getMention(selectedCandidat.moyenne)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Décision du Jury *</Label>
                <Select value={nouvelleDecision} onValueChange={setNouvelleDecision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une décision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admis">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Admis
                      </div>
                    </SelectItem>
                    <SelectItem value="Ajourné">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Ajourné
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Motif de la décision *</Label>
                <Textarea
                  value={decisionMotif}
                  onChange={(e) => setDecisionMotif(e.target.value)}
                  placeholder="Justifier la décision du jury (obligatoire pour l'archivage)..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Ce motif sera archivé dans le procès-verbal de délibération
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDecisionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleDecision}>
              <FileCheck className="h-4 w-4 mr-2" />
              Enregistrer Décision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PV Preview Dialog */}
      <Dialog open={pvDialogOpen} onOpenChange={setPvDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Procès-Verbal de Délibération
            </DialogTitle>
            <DialogDescription>
              Document officiel des délibérations du jury d'examen
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <div className="p-6 space-y-6 bg-white text-black">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">République de Côte d'Ivoire</div>
                <div className="text-xs text-gray-500">Union - Discipline - Travail</div>
                <div className="text-xs text-gray-500 mt-1">Ministère de l'Éducation Nationale</div>
                <h2 className="text-xl font-bold mt-4">PROCÈS-VERBAL DE DÉLIBÉRATION</h2>
                <p className="text-sm text-gray-600">Session 2024 - BEPC</p>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Centre d'examen:</strong> Lycée Moderne d'Abidjan
                </div>
                <div>
                  <strong>Date de délibération:</strong> {new Date().toLocaleDateString("fr-FR")}
                </div>
              </div>

              {/* Results Summary */}
              <div className="border rounded p-4">
                <h3 className="font-bold mb-2">Résumé des Résultats</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div><strong>Total candidats:</strong> {totalCandidats}</div>
                  <div><strong>Admis:</strong> {admis}</div>
                  <div><strong>Ajournés:</strong> {ajournes}</div>
                  <div><strong>Taux de réussite:</strong> {tauxReussite}%</div>
                </div>
              </div>

              {/* Mentions */}
              <div className="border rounded p-4">
                <h3 className="font-bold mb-2">Répartition des Mentions</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>Très Bien (≥16): {tresBien}</div>
                  <div>Bien (≥14): {bien}</div>
                  <div>Assez Bien (≥12): {assezBien}</div>
                  <div>Passable (≥10): {admis - tresBien - bien - assezBien}</div>
                </div>
              </div>

              {/* Decisions */}
              <div className="border rounded p-4">
                <h3 className="font-bold mb-2">Décisions Particulières du Jury</h3>
                {historique.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {historique.map((h, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded">
                        <strong>{h.candidat}</strong> (N° {h.tableNum}): {h.nouvelleDecision} - {h.motif}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune décision particulière</p>
                )}
              </div>

              {/* Signatures */}
              <div className="border rounded p-4">
                <h3 className="font-bold mb-4">Signatures du Jury</h3>
                <div className="grid grid-cols-3 gap-4">
                  {juryMembers.map((member) => (
                    <div key={member.id} className="text-center border p-3 rounded">
                      <div className="font-medium">{member.nom}</div>
                      <div className="text-xs text-gray-500">{member.fonction}</div>
                      {member.signed ? (
                        <div className="mt-2 text-green-600 text-xs">
                          ✓ Signé le {member.signedAt}
                        </div>
                      ) : (
                        <div className="mt-2 text-orange-500 text-xs">En attente</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code placeholder */}
              <div className="text-center pt-4 border-t">
                <div className="inline-block p-4 bg-gray-100 rounded">
                  <div className="w-24 h-24 bg-gray-300 mx-auto mb-2 flex items-center justify-center text-xs text-gray-500">
                    [QR Code Anti-fraude]
                  </div>
                  <div className="text-xs text-gray-500">Code de vérification: PV-2024-BEPC-{Date.now()}</div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPvDialogOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleExportPV}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
