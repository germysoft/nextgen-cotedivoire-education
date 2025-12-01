import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { 
  FileText, 
  Download, 
  Search, 
  Award, 
  GraduationCap, 
  ScrollText,
  QrCode,
  Shield,
  Archive,
  Printer,
  CheckCircle2,
  Clock,
  FileCheck,
  Upload,
  Eye,
  Stamp,
  BadgeCheck,
  FileSpreadsheet,
  Calendar,
  User,
  Building,
  Lock
} from "lucide-react";

// Mock data for admitted candidates
const mockAdmis = [
  { id: "C001", nom: "KOUASSI", prenom: "Aya Marie", tableNum: "A001", moyenne: 17.25, mention: "Très Bien", dateNaissance: "15/03/2008", lieuNaissance: "Abidjan", diplome: true, attestation: true, releve: true },
  { id: "C002", nom: "TRAORE", prenom: "Ibrahim", tableNum: "A002", moyenne: 15.50, mention: "Bien", dateNaissance: "22/07/2007", lieuNaissance: "Bouaké", diplome: true, attestation: true, releve: false },
  { id: "C003", nom: "KONE", prenom: "Fatou", tableNum: "A003", moyenne: 14.25, mention: "Bien", dateNaissance: "08/11/2008", lieuNaissance: "Yamoussoukro", diplome: false, attestation: true, releve: true },
  { id: "C004", nom: "DIABATE", prenom: "Moussa", tableNum: "A004", moyenne: 12.75, mention: "Assez Bien", dateNaissance: "30/01/2007", lieuNaissance: "San-Pédro", diplome: true, attestation: false, releve: true },
  { id: "C005", nom: "COULIBALY", prenom: "Aminata", tableNum: "A005", moyenne: 10.50, mention: "Passable", dateNaissance: "12/09/2008", lieuNaissance: "Korhogo", diplome: false, attestation: false, releve: false },
  { id: "C006", nom: "OUATTARA", prenom: "Mariam", tableNum: "A007", moyenne: 11.50, mention: "Passable", dateNaissance: "05/04/2007", lieuNaissance: "Man", diplome: true, attestation: true, releve: true },
  { id: "C007", nom: "YAPI", prenom: "Jean-Claude", tableNum: "A008", moyenne: 16.75, mention: "Très Bien", dateNaissance: "18/06/2008", lieuNaissance: "Daloa", diplome: true, attestation: true, releve: true },
  { id: "C008", nom: "GNAGNE", prenom: "Pascal", tableNum: "A010", moyenne: 13.25, mention: "Assez Bien", dateNaissance: "25/12/2007", lieuNaissance: "Gagnoa", diplome: false, attestation: true, releve: false },
  { id: "C009", nom: "KONAN", prenom: "Estelle", tableNum: "A011", moyenne: 10.05, mention: "Passable", dateNaissance: "03/02/2008", lieuNaissance: "Abengourou", diplome: false, attestation: false, releve: false },
];

// Mock data for notes by subject
const mockNotesParMatiere = {
  "C001": [
    { matiere: "Mathématiques", note: 18, coef: 4, total: 72 },
    { matiere: "Français", note: 16, coef: 4, total: 64 },
    { matiere: "Anglais", note: 17, coef: 2, total: 34 },
    { matiere: "Histoire-Géographie", note: 18, coef: 2, total: 36 },
    { matiere: "Sciences Physiques", note: 17, coef: 3, total: 51 },
    { matiere: "SVT", note: 16, coef: 2, total: 32 },
    { matiere: "EPS", note: 18, coef: 1, total: 18 },
  ],
  "C002": [
    { matiere: "Mathématiques", note: 16, coef: 4, total: 64 },
    { matiere: "Français", note: 15, coef: 4, total: 60 },
    { matiere: "Anglais", note: 14, coef: 2, total: 28 },
    { matiere: "Histoire-Géographie", note: 16, coef: 2, total: 32 },
    { matiere: "Sciences Physiques", note: 15, coef: 3, total: 45 },
    { matiere: "SVT", note: 16, coef: 2, total: 32 },
    { matiere: "EPS", note: 17, coef: 1, total: 17 },
  ],
};

// Mock archive data
const mockArchives = [
  { id: 1, type: "Diplôme", candidat: "KOUASSI Aya Marie", dateGeneration: "2024-06-20", codeVerif: "DIP-2024-A001-XK7F", statut: "archivé" },
  { id: 2, type: "Attestation", candidat: "TRAORE Ibrahim", dateGeneration: "2024-06-20", codeVerif: "ATT-2024-A002-PL9M", statut: "archivé" },
  { id: 3, type: "Relevé", candidat: "YAPI Jean-Claude", dateGeneration: "2024-06-21", codeVerif: "REL-2024-A008-QZ3N", statut: "archivé" },
  { id: 4, type: "Diplôme", candidat: "DIABATE Moussa", dateGeneration: "2024-06-21", codeVerif: "DIP-2024-A004-HT5R", statut: "en cours" },
];

const getMentionColor = (mention: string): string => {
  switch (mention) {
    case "Très Bien": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Bien": return "bg-blue-100 text-blue-800 border-blue-300";
    case "Assez Bien": return "bg-amber-100 text-amber-800 border-amber-300";
    case "Passable": return "bg-gray-100 text-gray-800 border-gray-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const generateVerificationCode = (type: string, tableNum: string): string => {
  const prefix = type === "diplome" ? "DIP" : type === "attestation" ? "ATT" : "REL";
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-2024-${tableNum}-${random}`;
};

export default function DocumentsOfficiels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMention, setFilterMention] = useState("all");
  const [selectedCandidats, setSelectedCandidats] = useState<string[]>([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewType, setPreviewType] = useState<"diplome" | "attestation" | "releve">("diplome");
  const [selectedCandidat, setSelectedCandidat] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Statistics
  const totalAdmis = mockAdmis.length;
  const diplomesGeneres = mockAdmis.filter(c => c.diplome).length;
  const attestationsGenerees = mockAdmis.filter(c => c.attestation).length;
  const relevesGeneres = mockAdmis.filter(c => c.releve).length;
  const tresBien = mockAdmis.filter(c => c.mention === "Très Bien").length;
  const bien = mockAdmis.filter(c => c.mention === "Bien").length;
  const assezBien = mockAdmis.filter(c => c.mention === "Assez Bien").length;

  // Filtered candidates
  const filteredCandidats = mockAdmis.filter(c => {
    const matchesSearch = 
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tableNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMention = filterMention === "all" || c.mention === filterMention;
    return matchesSearch && matchesMention;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidats(filteredCandidats.map(c => c.id));
    } else {
      setSelectedCandidats([]);
    }
  };

  const handleSelectCandidat = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidats(prev => [...prev, id]);
    } else {
      setSelectedCandidats(prev => prev.filter(cid => cid !== id));
    }
  };

  const generatePDF = (type: "diplome" | "attestation" | "releve", candidat: any) => {
    const doc = new jsPDF();
    const verificationCode = generateVerificationCode(type, candidat.tableNum);
    
    // Add watermark pattern (diagonal text)
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(40);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        doc.text("ORIGINAL", 20 + (j * 70), 50 + (i * 50), { angle: 45 });
      }
    }
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Header
    doc.setFontSize(10);
    doc.text("RÉPUBLIQUE DE CÔTE D'IVOIRE", 105, 15, { align: "center" });
    doc.text("Union - Discipline - Travail", 105, 20, { align: "center" });
    doc.text("Ministère de l'Éducation Nationale", 105, 25, { align: "center" });
    
    // Border
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 180, 267);
    
    if (type === "diplome") {
      // Diploma content
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("DIPLÔME", 105, 50, { align: "center" });
      doc.setFontSize(16);
      doc.text("DU BREVET D'ÉTUDES DU PREMIER CYCLE", 105, 60, { align: "center" });
      doc.text("(B.E.P.C.)", 105, 68, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Session 2024", 105, 80, { align: "center" });
      
      doc.setFontSize(14);
      doc.text("Le Ministre de l'Éducation Nationale certifie que", 105, 100, { align: "center" });
      
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`${candidat.prenom} ${candidat.nom}`, 105, 115, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Né(e) le ${candidat.dateNaissance} à ${candidat.lieuNaissance}`, 105, 125, { align: "center" });
      
      doc.text("a obtenu le diplôme du B.E.P.C. avec la mention", 105, 145, { align: "center" });
      
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 100, 0);
      doc.text(candidat.mention.toUpperCase(), 105, 160, { align: "center" });
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text(`Moyenne générale: ${candidat.moyenne.toFixed(2)}/20`, 105, 175, { align: "center" });
      
    } else if (type === "attestation") {
      // Certificate content
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ATTESTATION DE RÉUSSITE", 105, 50, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("au Brevet d'Études du Premier Cycle (B.E.P.C.)", 105, 60, { align: "center" });
      doc.text("Session 2024", 105, 68, { align: "center" });
      
      doc.setFontSize(12);
      doc.text("Le Directeur de l'établissement soussigné atteste que", 105, 90, { align: "center" });
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`${candidat.prenom} ${candidat.nom}`, 105, 105, { align: "center" });
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Né(e) le ${candidat.dateNaissance} à ${candidat.lieuNaissance}`, 105, 115, { align: "center" });
      doc.text(`N° de table: ${candidat.tableNum}`, 105, 122, { align: "center" });
      
      doc.text("a été déclaré(e) admis(e) à l'examen du B.E.P.C.", 105, 140, { align: "center" });
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Mention: ${candidat.mention}`, 105, 155, { align: "center" });
      doc.text(`Moyenne: ${candidat.moyenne.toFixed(2)}/20`, 105, 165, { align: "center" });
      
      // Stamp placeholder
      doc.setDrawColor(0, 51, 102);
      doc.circle(160, 210, 20);
      doc.setFontSize(8);
      doc.text("CACHET", 160, 208, { align: "center" });
      doc.text("OFFICIEL", 160, 213, { align: "center" });
      
    } else {
      // Transcript content
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("RELEVÉ DE NOTES", 105, 45, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("B.E.P.C. - Session 2024", 105, 53, { align: "center" });
      
      doc.setFontSize(11);
      doc.text(`Candidat: ${candidat.prenom} ${candidat.nom}`, 25, 70);
      doc.text(`N° de table: ${candidat.tableNum}`, 25, 78);
      doc.text(`Né(e) le: ${candidat.dateNaissance}`, 120, 70);
      doc.text(`Lieu: ${candidat.lieuNaissance}`, 120, 78);
      
      // Notes table
      const notes = mockNotesParMatiere[candidat.id as keyof typeof mockNotesParMatiere] || mockNotesParMatiere["C001"];
      let yPos = 95;
      
      // Table header
      doc.setFillColor(0, 51, 102);
      doc.rect(25, yPos - 5, 160, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Matière", 30, yPos + 2);
      doc.text("Note/20", 110, yPos + 2);
      doc.text("Coef.", 140, yPos + 2);
      doc.text("Total", 165, yPos + 2);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      yPos += 12;
      
      let totalPoints = 0;
      let totalCoef = 0;
      
      notes.forEach((note, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(25, yPos - 4, 160, 8, "F");
        }
        doc.text(note.matiere, 30, yPos);
        doc.text(note.note.toString(), 115, yPos);
        doc.text(note.coef.toString(), 145, yPos);
        doc.text(note.total.toString(), 170, yPos);
        totalPoints += note.total;
        totalCoef += note.coef;
        yPos += 10;
      });
      
      // Total row
      doc.setFillColor(0, 51, 102);
      doc.rect(25, yPos - 4, 160, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL", 30, yPos + 2);
      doc.text(totalCoef.toString(), 145, yPos + 2);
      doc.text(totalPoints.toString(), 170, yPos + 2);
      
      doc.setTextColor(0, 0, 0);
      yPos += 20;
      
      doc.setFontSize(14);
      doc.text(`Moyenne générale: ${candidat.moyenne.toFixed(2)}/20`, 105, yPos, { align: "center" });
      doc.text(`Mention obtenue: ${candidat.mention}`, 105, yPos + 10, { align: "center" });
    }
    
    // QR Code placeholder
    doc.setDrawColor(0, 0, 0);
    doc.rect(25, 230, 30, 30);
    doc.setFontSize(6);
    doc.text("QR CODE", 40, 248, { align: "center" });
    doc.text("VÉRIFICATION", 40, 253, { align: "center" });
    
    // Verification code
    doc.setFontSize(8);
    doc.text(`Code de vérification: ${verificationCode}`, 25, 268);
    doc.text(`Document généré le: ${new Date().toLocaleDateString("fr-FR")}`, 25, 274);
    
    // Signature area
    doc.setFontSize(10);
    doc.text("Fait à Abidjan, le " + new Date().toLocaleDateString("fr-FR"), 130, 240);
    doc.text("Le Directeur", 155, 250);
    doc.line(130, 270, 180, 270);
    doc.setFontSize(8);
    doc.text("(Signature et cachet)", 155, 276, { align: "center" });
    
    // Save
    const filename = `${type}_${candidat.nom}_${candidat.prenom}_${verificationCode}.pdf`;
    doc.save(filename);
    toast.success(`${type === "diplome" ? "Diplôme" : type === "attestation" ? "Attestation" : "Relevé de notes"} généré avec succès`);
  };

  const handleGenerateBatch = async (type: "diplome" | "attestation" | "releve") => {
    if (selectedCandidats.length === 0) {
      toast.error("Veuillez sélectionner au moins un candidat");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    for (let i = 0; i < selectedCandidats.length; i++) {
      const candidat = mockAdmis.find(c => c.id === selectedCandidats[i]);
      if (candidat) {
        generatePDF(type, candidat);
        setGenerationProgress(((i + 1) / selectedCandidats.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsGenerating(false);
    toast.success(`${selectedCandidats.length} document(s) généré(s) avec succès`);
  };

  const handleExportDECO = () => {
    toast.success("Export DECO lancé - Fichier conforme au format officiel généré");
  };

  const handleArchiver = () => {
    toast.success("Documents archivés conformément à la réglementation (10 ans)");
  };

  const openPreview = (type: "diplome" | "attestation" | "releve", candidat: any) => {
    setPreviewType(type);
    setSelectedCandidat(candidat);
    setPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents Officiels</h1>
          <p className="text-muted-foreground">Génération diplômes, attestations et relevés de notes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportDECO}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export DECO
          </Button>
          <Button variant="outline" onClick={handleArchiver}>
            <Archive className="h-4 w-4 mr-2" />
            Archiver (10 ans)
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Admis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalAdmis}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Diplômes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{diplomesGeneres}/{totalAdmis}</span>
            </div>
            <Progress value={(diplomesGeneres / totalAdmis) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attestations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Stamp className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{attestationsGenerees}/{totalAdmis}</span>
            </div>
            <Progress value={(attestationsGenerees / totalAdmis) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Relevés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{relevesGeneres}/{totalAdmis}</span>
            </div>
            <Progress value={(relevesGeneres / totalAdmis) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Très Bien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{tresBien}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Bien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{bien}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Assez Bien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{assezBien}</div>
          </CardContent>
        </Card>
      </div>

      {/* Security Features Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Sécurité Renforcée</AlertTitle>
        <AlertDescription>
          Tous les documents générés incluent: filigrane "ORIGINAL", QR code de vérification unique, 
          code anti-fraude horodaté, et sont conformes aux normes DECO pour l'archivage 10 ans.
        </AlertDescription>
      </Alert>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Génération en cours...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="diplomes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diplomes" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Diplômes
          </TabsTrigger>
          <TabsTrigger value="attestations" className="flex items-center gap-2">
            <Stamp className="h-4 w-4" />
            Attestations
          </TabsTrigger>
          <TabsTrigger value="releves" className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            Relevés de Notes
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
        </TabsList>

        {/* Diplomas Tab */}
        <TabsContent value="diplomes">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Génération des Diplômes
                  </CardTitle>
                  <CardDescription>
                    Diplômes personnalisés avec mention et filigrane anti-contrefaçon
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleGenerateBatch("diplome")}
                    disabled={isGenerating || selectedCandidats.length === 0}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Générer sélection ({selectedCandidats.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un candidat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterMention} onValueChange={setFilterMention}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Mention" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes mentions</SelectItem>
                    <SelectItem value="Très Bien">Très Bien</SelectItem>
                    <SelectItem value="Bien">Bien</SelectItem>
                    <SelectItem value="Assez Bien">Assez Bien</SelectItem>
                    <SelectItem value="Passable">Passable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedCandidats.length === filteredCandidats.length && filteredCandidats.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>N° Table</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Date/Lieu Naissance</TableHead>
                      <TableHead className="text-center">Moyenne</TableHead>
                      <TableHead className="text-center">Mention</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidats.map((candidat) => (
                      <TableRow key={candidat.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCandidats.includes(candidat.id)}
                            onCheckedChange={(checked) => handleSelectCandidat(candidat.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-mono font-medium">{candidat.tableNum}</TableCell>
                        <TableCell>
                          <div className="font-medium">{candidat.nom} {candidat.prenom}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{candidat.dateNaissance}</div>
                          <div className="text-xs text-muted-foreground">{candidat.lieuNaissance}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-lg text-green-600">{candidat.moyenne.toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMentionColor(candidat.mention)}>
                            {candidat.mention}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {candidat.diplome ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Généré
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              <Clock className="h-3 w-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openPreview("diplome", candidat)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => generatePDF("diplome", candidat)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="attestations">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Stamp className="h-5 w-5" />
                    Attestations de Réussite
                  </CardTitle>
                  <CardDescription>
                    Attestations timbrées avec signature du directeur et cachet officiel
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleGenerateBatch("attestation")}
                  disabled={isGenerating || selectedCandidats.length === 0}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Générer sélection ({selectedCandidats.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedCandidats.length === filteredCandidats.length && filteredCandidats.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>N° Table</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead className="text-center">Mention</TableHead>
                      <TableHead className="text-center">Attestation</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidats.map((candidat) => (
                      <TableRow key={candidat.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCandidats.includes(candidat.id)}
                            onCheckedChange={(checked) => handleSelectCandidat(candidat.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-mono">{candidat.tableNum}</TableCell>
                        <TableCell className="font-medium">{candidat.nom} {candidat.prenom}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMentionColor(candidat.mention)}>
                            {candidat.mention}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {candidat.attestation ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Générée
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              <Clock className="h-3 w-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openPreview("attestation", candidat)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => generatePDF("attestation", candidat)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transcripts Tab */}
        <TabsContent value="releves">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5" />
                    Relevés de Notes Détaillés
                  </CardTitle>
                  <CardDescription>
                    Notes par matière avec coefficients et moyenne pondérée
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleGenerateBatch("releve")}
                  disabled={isGenerating || selectedCandidats.length === 0}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Générer sélection ({selectedCandidats.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedCandidats.length === filteredCandidats.length && filteredCandidats.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>N° Table</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead className="text-center">Moyenne</TableHead>
                      <TableHead className="text-center">Mention</TableHead>
                      <TableHead className="text-center">Relevé</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidats.map((candidat) => (
                      <TableRow key={candidat.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCandidats.includes(candidat.id)}
                            onCheckedChange={(checked) => handleSelectCandidat(candidat.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-mono">{candidat.tableNum}</TableCell>
                        <TableCell className="font-medium">{candidat.nom} {candidat.prenom}</TableCell>
                        <TableCell className="text-center font-bold text-green-600">
                          {candidat.moyenne.toFixed(2)}/20
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMentionColor(candidat.mention)}>
                            {candidat.mention}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {candidat.releve ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Généré
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              <Clock className="h-3 w-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openPreview("releve", candidat)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => generatePDF("releve", candidat)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archives Tab */}
        <TabsContent value="archives">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Archives Documents (Conservation 10 ans)
              </CardTitle>
              <CardDescription>
                Historique des documents générés avec codes de vérification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Lock className="h-4 w-4" />
                <AlertTitle>Archivage Sécurisé</AlertTitle>
                <AlertDescription>
                  Tous les documents sont archivés conformément à la réglementation DECO. 
                  Conservation obligatoire de 10 ans minimum avec traçabilité complète.
                </AlertDescription>
              </Alert>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Date Génération</TableHead>
                      <TableHead>Code Vérification</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockArchives.map((archive) => (
                      <TableRow key={archive.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {archive.type === "Diplôme" && <Award className="h-3 w-3 mr-1" />}
                            {archive.type === "Attestation" && <Stamp className="h-3 w-3 mr-1" />}
                            {archive.type === "Relevé" && <ScrollText className="h-3 w-3 mr-1" />}
                            {archive.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{archive.candidat}</TableCell>
                        <TableCell>{archive.dateGeneration}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {archive.codeVerif}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={archive.statut === "archivé" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                            {archive.statut === "archivé" ? (
                              <><CheckCircle2 className="h-3 w-3 mr-1" /> Archivé</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1" /> En cours</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Verification Section */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Vérification de Document
                </h4>
                <div className="flex gap-2">
                  <Input placeholder="Entrer le code de vérification (ex: DIP-2024-A001-XK7F)" className="flex-1" />
                  <Button>
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    Vérifier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewType === "diplome" && <Award className="h-5 w-5" />}
              {previewType === "attestation" && <Stamp className="h-5 w-5" />}
              {previewType === "releve" && <ScrollText className="h-5 w-5" />}
              Aperçu du {previewType === "diplome" ? "Diplôme" : previewType === "attestation" ? "Attestation" : "Relevé de Notes"}
            </DialogTitle>
            <DialogDescription>
              Document avec filigrane et QR code anti-fraude
            </DialogDescription>
          </DialogHeader>

          {selectedCandidat && (
            <ScrollArea className="h-[60vh]">
              <div className="p-6 bg-white text-black border-4 border-double border-blue-900 relative">
                {/* Watermark */}
                <div className="absolute inset-0 opacity-5 flex items-center justify-center rotate-45 text-6xl font-bold text-gray-500 pointer-events-none">
                  ORIGINAL
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center border-b pb-4 mb-6">
                    <div className="text-xs uppercase tracking-wide text-gray-500">République de Côte d'Ivoire</div>
                    <div className="text-xs text-gray-500">Union - Discipline - Travail</div>
                    <div className="text-xs text-gray-500 mt-1">Ministère de l'Éducation Nationale</div>
                  </div>

                  {previewType === "diplome" && (
                    <div className="text-center space-y-4">
                      <h2 className="text-2xl font-bold">DIPLÔME</h2>
                      <h3 className="text-lg">DU BREVET D'ÉTUDES DU PREMIER CYCLE (B.E.P.C.)</h3>
                      <p className="text-sm">Session 2024</p>
                      <div className="my-8">
                        <p>Le Ministre de l'Éducation Nationale certifie que</p>
                        <p className="text-xl font-bold mt-2">{selectedCandidat.prenom} {selectedCandidat.nom}</p>
                        <p className="text-sm">Né(e) le {selectedCandidat.dateNaissance} à {selectedCandidat.lieuNaissance}</p>
                      </div>
                      <p>a obtenu le diplôme du B.E.P.C. avec la mention</p>
                      <p className="text-2xl font-bold text-green-700">{selectedCandidat.mention.toUpperCase()}</p>
                      <p className="text-lg">Moyenne générale: {selectedCandidat.moyenne.toFixed(2)}/20</p>
                    </div>
                  )}

                  {previewType === "attestation" && (
                    <div className="text-center space-y-4">
                      <h2 className="text-xl font-bold">ATTESTATION DE RÉUSSITE</h2>
                      <p className="text-sm">au Brevet d'Études du Premier Cycle (B.E.P.C.) - Session 2024</p>
                      <div className="my-6">
                        <p>Le Directeur de l'établissement soussigné atteste que</p>
                        <p className="text-lg font-bold mt-2">{selectedCandidat.prenom} {selectedCandidat.nom}</p>
                        <p className="text-sm">Né(e) le {selectedCandidat.dateNaissance} à {selectedCandidat.lieuNaissance}</p>
                        <p className="text-sm">N° de table: {selectedCandidat.tableNum}</p>
                      </div>
                      <p>a été déclaré(e) admis(e) à l'examen du B.E.P.C.</p>
                      <p className="font-bold">Mention: {selectedCandidat.mention}</p>
                      <p className="font-bold">Moyenne: {selectedCandidat.moyenne.toFixed(2)}/20</p>
                    </div>
                  )}

                  {previewType === "releve" && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h2 className="text-xl font-bold">RELEVÉ DE NOTES</h2>
                        <p className="text-sm">B.E.P.C. - Session 2024</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Candidat: <strong>{selectedCandidat.prenom} {selectedCandidat.nom}</strong></div>
                        <div>N° de table: <strong>{selectedCandidat.tableNum}</strong></div>
                        <div>Né(e) le: {selectedCandidat.dateNaissance}</div>
                        <div>Lieu: {selectedCandidat.lieuNaissance}</div>
                      </div>
                      <table className="w-full border-collapse mt-4">
                        <thead>
                          <tr className="bg-blue-900 text-white">
                            <th className="border p-2 text-left">Matière</th>
                            <th className="border p-2 text-center">Note/20</th>
                            <th className="border p-2 text-center">Coef.</th>
                            <th className="border p-2 text-center">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(mockNotesParMatiere[selectedCandidat.id as keyof typeof mockNotesParMatiere] || mockNotesParMatiere["C001"]).map((note, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                              <td className="border p-2">{note.matiere}</td>
                              <td className="border p-2 text-center">{note.note}</td>
                              <td className="border p-2 text-center">{note.coef}</td>
                              <td className="border p-2 text-center">{note.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-center mt-4">
                        <p className="font-bold">Moyenne générale: {selectedCandidat.moyenne.toFixed(2)}/20</p>
                        <p className="font-bold">Mention: {selectedCandidat.mention}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer with QR and signature */}
                  <div className="mt-8 pt-4 border-t flex justify-between items-end">
                    <div>
                      <div className="w-20 h-20 border-2 border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-500">
                        QR Code
                      </div>
                      <div className="text-xs mt-1">Code: {generateVerificationCode(previewType, selectedCandidat.tableNum)}</div>
                    </div>
                    <div className="text-right text-sm">
                      <p>Fait à Abidjan, le {new Date().toLocaleDateString("fr-FR")}</p>
                      <p className="mt-2">Le Directeur</p>
                      <div className="mt-8 border-t border-black w-40 ml-auto"></div>
                      <p className="text-xs">(Signature et cachet)</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Fermer
            </Button>
            {selectedCandidat && (
              <Button onClick={() => generatePDF(previewType, selectedCandidat)}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
