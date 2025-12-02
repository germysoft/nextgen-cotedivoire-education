import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  FileCheck, 
  Search, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  FileText,
  Database,
  Send,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  Users,
  FileSpreadsheet,
  ArrowRight,
  Loader2,
  CheckCheck,
  Ban,
  Info
} from "lucide-react";

// Types
interface Candidate {
  id: string;
  matricule: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: "M" | "F";
  centreExamen: string;
  numeroTable: string;
  notes: Record<string, number | null>;
  moyenne: number | null;
  status: "valide" | "erreur_matricule" | "erreur_notes" | "incomplet" | "en_attente";
  errors: string[];
}

interface ValidationResult {
  id: string;
  type: "matricule" | "note" | "format" | "coherence" | "doublon";
  severity: "error" | "warning" | "info";
  candidateId?: string;
  candidateName?: string;
  field?: string;
  message: string;
  suggestion?: string;
  resolved: boolean;
}

interface TransmissionRecord {
  id: string;
  batchId: string;
  timestamp: string;
  type: "BEPC" | "BAC";
  candidatesCount: number;
  status: "en_cours" | "transmis" | "accepte" | "rejete" | "partiel";
  fileName: string;
  fileSize: string;
  errors: number;
  warnings: number;
  responseCode?: string;
  responseMessage?: string;
}

interface ComplianceMetric {
  label: string;
  value: number;
  total: number;
  status: "success" | "warning" | "error";
}

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: "CAND-001",
    matricule: "CI2024BEPC00001",
    nom: "KOUASSI",
    prenoms: "Aya Marie",
    dateNaissance: "2008-03-15",
    lieuNaissance: "Abidjan",
    sexe: "F",
    centreExamen: "Lycée Classique d'Abidjan",
    numeroTable: "001",
    notes: { "Français": 14, "Mathématiques": 16, "Anglais": 12, "SVT": 15, "Physique-Chimie": 13, "Histoire-Géo": 14 },
    moyenne: 14.0,
    status: "valide",
    errors: []
  },
  {
    id: "CAND-002",
    matricule: "CI2024BEPC00002",
    nom: "DIALLO",
    prenoms: "Mamadou",
    dateNaissance: "2007-08-22",
    lieuNaissance: "Bouaké",
    sexe: "M",
    centreExamen: "Lycée Classique d'Abidjan",
    numeroTable: "002",
    notes: { "Français": 11, "Mathématiques": 9, "Anglais": 10, "SVT": 12, "Physique-Chimie": 8, "Histoire-Géo": 11 },
    moyenne: 10.17,
    status: "valide",
    errors: []
  },
  {
    id: "CAND-003",
    matricule: "CI2024BPC00003", // Erreur format matricule
    nom: "TRAORE",
    prenoms: "Fatou",
    dateNaissance: "2008-01-10",
    lieuNaissance: "Korhogo",
    sexe: "F",
    centreExamen: "Lycée Municipal de Korhogo",
    numeroTable: "003",
    notes: { "Français": 15, "Mathématiques": 17, "Anglais": 14, "SVT": 16, "Physique-Chimie": 15, "Histoire-Géo": 16 },
    moyenne: 15.5,
    status: "erreur_matricule",
    errors: ["Format matricule invalide: devrait être CI2024BEPC*****"]
  },
  {
    id: "CAND-004",
    matricule: "CI2024BEPC00004",
    nom: "YAO",
    prenoms: "Kouadio Jean",
    dateNaissance: "2007-11-05",
    lieuNaissance: "Yamoussoukro",
    sexe: "M",
    centreExamen: "Lycée Scientifique de Yamoussoukro",
    numeroTable: "004",
    notes: { "Français": 8, "Mathématiques": 25, "Anglais": 7, "SVT": 9, "Physique-Chimie": null, "Histoire-Géo": 10 }, // Note aberrante + manquante
    moyenne: null,
    status: "erreur_notes",
    errors: ["Note Mathématiques (25) dépasse le maximum (20)", "Note Physique-Chimie manquante"]
  },
  {
    id: "CAND-005",
    matricule: "CI2024BEPC00005",
    nom: "SORO",
    prenoms: "Lacina",
    dateNaissance: "2008-05-20",
    lieuNaissance: "Ferkessédougou",
    sexe: "M",
    centreExamen: "Lycée Municipal de Ferkessédougou",
    numeroTable: "005",
    notes: { "Français": null, "Mathématiques": null, "Anglais": null, "SVT": null, "Physique-Chimie": null, "Histoire-Géo": null },
    moyenne: null,
    status: "incomplet",
    errors: ["Aucune note saisie pour ce candidat"]
  },
  {
    id: "CAND-006",
    matricule: "CI2024BEPC00006",
    nom: "KONE",
    prenoms: "Aminata",
    dateNaissance: "2008-09-12",
    lieuNaissance: "San-Pédro",
    sexe: "F",
    centreExamen: "Lycée Moderne de San-Pédro",
    numeroTable: "006",
    notes: { "Français": 13, "Mathématiques": 11, "Anglais": 12, "SVT": 14, "Physique-Chimie": 10, "Histoire-Géo": 13 },
    moyenne: 12.17,
    status: "valide",
    errors: []
  },
  {
    id: "CAND-007",
    matricule: "CI2024BEPC00007",
    nom: "COULIBALY",
    prenoms: "Ibrahim",
    dateNaissance: "2007-12-03",
    lieuNaissance: "Man",
    sexe: "M",
    centreExamen: "Lycée Moderne de Man",
    numeroTable: "007",
    notes: { "Français": 16, "Mathématiques": 18, "Anglais": 15, "SVT": 17, "Physique-Chimie": 16, "Histoire-Géo": 15 },
    moyenne: 16.17,
    status: "valide",
    errors: []
  },
  {
    id: "CAND-008",
    matricule: "CI2024BEPC00001", // Doublon matricule
    nom: "BAMBA",
    prenoms: "Seydou",
    dateNaissance: "2008-02-28",
    lieuNaissance: "Daloa",
    sexe: "M",
    centreExamen: "Lycée Moderne de Daloa",
    numeroTable: "008",
    notes: { "Français": 10, "Mathématiques": 12, "Anglais": 9, "SVT": 11, "Physique-Chimie": 10, "Histoire-Géo": 12 },
    moyenne: 10.67,
    status: "erreur_matricule",
    errors: ["Matricule en doublon avec le candidat CAND-001"]
  }
];

const mockValidationResults: ValidationResult[] = [
  {
    id: "VAL-001",
    type: "matricule",
    severity: "error",
    candidateId: "CAND-003",
    candidateName: "TRAORE Fatou",
    field: "matricule",
    message: "Format matricule invalide: CI2024BPC00003",
    suggestion: "Le format correct est CI2024BEPC***** (manque 'E')",
    resolved: false
  },
  {
    id: "VAL-002",
    type: "note",
    severity: "error",
    candidateId: "CAND-004",
    candidateName: "YAO Kouadio Jean",
    field: "Mathématiques",
    message: "Note aberrante: 25/20 dépasse le maximum autorisé",
    suggestion: "Vérifier la copie ou corriger la saisie",
    resolved: false
  },
  {
    id: "VAL-003",
    type: "note",
    severity: "error",
    candidateId: "CAND-004",
    candidateName: "YAO Kouadio Jean",
    field: "Physique-Chimie",
    message: "Note manquante pour la matière Physique-Chimie",
    suggestion: "Saisir la note ou marquer comme absent",
    resolved: false
  },
  {
    id: "VAL-004",
    type: "doublon",
    severity: "error",
    candidateId: "CAND-008",
    candidateName: "BAMBA Seydou",
    field: "matricule",
    message: "Matricule CI2024BEPC00001 déjà attribué à KOUASSI Aya Marie",
    suggestion: "Générer un nouveau matricule unique",
    resolved: false
  },
  {
    id: "VAL-005",
    type: "coherence",
    severity: "warning",
    candidateId: "CAND-002",
    candidateName: "DIALLO Mamadou",
    message: "Écart important entre notes (Physique-Chimie: 8, SVT: 12)",
    suggestion: "Vérifier la cohérence des évaluations",
    resolved: false
  },
  {
    id: "VAL-006",
    type: "format",
    severity: "info",
    message: "3 candidats avec notes incomplètes détectés",
    suggestion: "Compléter les saisies avant transmission",
    resolved: false
  }
];

const mockTransmissions: TransmissionRecord[] = [
  {
    id: "TRANS-001",
    batchId: "BATCH-2024-001",
    timestamp: "2024-06-15 14:30:00",
    type: "BEPC",
    candidatesCount: 245,
    status: "accepte",
    fileName: "BEPC_2024_LCA_001.xlsx",
    fileSize: "2.4 MB",
    errors: 0,
    warnings: 3,
    responseCode: "DECO-200",
    responseMessage: "Fichier accepté et intégré avec succès"
  },
  {
    id: "TRANS-002",
    batchId: "BATCH-2024-002",
    timestamp: "2024-06-16 09:15:00",
    type: "BEPC",
    candidatesCount: 180,
    status: "partiel",
    fileName: "BEPC_2024_LMK_001.xlsx",
    fileSize: "1.8 MB",
    errors: 5,
    warnings: 12,
    responseCode: "DECO-206",
    responseMessage: "Fichier partiellement accepté - 5 candidats rejetés"
  },
  {
    id: "TRANS-003",
    batchId: "BATCH-2024-003",
    timestamp: "2024-06-16 11:45:00",
    type: "BEPC",
    candidatesCount: 312,
    status: "rejete",
    fileName: "BEPC_2024_LSY_001.xlsx",
    fileSize: "3.1 MB",
    errors: 45,
    warnings: 0,
    responseCode: "DECO-400",
    responseMessage: "Format de fichier non conforme - En-têtes incorrects"
  },
  {
    id: "TRANS-004",
    batchId: "BATCH-2024-004",
    timestamp: "2024-06-17 08:00:00",
    type: "BEPC",
    candidatesCount: 198,
    status: "en_cours",
    fileName: "BEPC_2024_LMD_001.xlsx",
    fileSize: "2.0 MB",
    errors: 0,
    warnings: 0
  }
];

export default function RapprochementDECO() {
  const [selectedExam, setSelectedExam] = useState<string>("bepc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showTransmitDialog, setShowTransmitDialog] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Compliance metrics
  const complianceMetrics: ComplianceMetric[] = [
    { label: "Matricules valides", value: 5, total: 8, status: mockCandidates.filter(c => c.status !== "erreur_matricule").length >= 6 ? "success" : "warning" },
    { label: "Notes complètes", value: 6, total: 8, status: "warning" },
    { label: "Format conforme", value: 7, total: 8, status: "success" },
    { label: "Cohérence vérifiée", value: 7, total: 8, status: "success" }
  ];

  // Stats
  const totalCandidates = mockCandidates.length;
  const validCandidates = mockCandidates.filter(c => c.status === "valide").length;
  const errorCandidates = mockCandidates.filter(c => c.status.includes("erreur")).length;
  const pendingCandidates = mockCandidates.filter(c => c.status === "incomplet" || c.status === "en_attente").length;
  const transmissionsSuccess = mockTransmissions.filter(t => t.status === "accepte").length;

  // Filter candidates
  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = 
      candidate.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.prenoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.matricule.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Candidate["status"]) => {
    const styles = {
      valide: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      erreur_matricule: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      erreur_notes: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      incomplet: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      en_attente: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    };
    const labels = {
      valide: "Valide",
      erreur_matricule: "Erreur Matricule",
      erreur_notes: "Erreur Notes",
      incomplet: "Incomplet",
      en_attente: "En attente"
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getTransmissionStatusBadge = (status: TransmissionRecord["status"]) => {
    const styles = {
      en_cours: "bg-blue-100 text-blue-800",
      transmis: "bg-purple-100 text-purple-800",
      accepte: "bg-green-100 text-green-800",
      rejete: "bg-red-100 text-red-800",
      partiel: "bg-amber-100 text-amber-800"
    };
    const labels = {
      en_cours: "En cours",
      transmis: "Transmis",
      accepte: "Accepté",
      rejete: "Rejeté",
      partiel: "Partiel"
    };
    const icons = {
      en_cours: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
      transmis: <Send className="h-3 w-3 mr-1" />,
      accepte: <CheckCircle2 className="h-3 w-3 mr-1" />,
      rejete: <XCircle className="h-3 w-3 mr-1" />,
      partiel: <AlertTriangle className="h-3 w-3 mr-1" />
    };
    return (
      <Badge className={`${styles[status]} flex items-center`}>
        {icons[status]}
        {labels[status]}
      </Badge>
    );
  };

  const handleValidateAll = () => {
    setIsValidating(true);
    setValidationProgress(0);
    
    const interval = setInterval(() => {
      setValidationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsValidating(false);
          toast.success("Validation terminée", {
            description: `${validCandidates} candidats valides, ${errorCandidates} erreurs détectées`
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleGenerateFile = () => {
    toast.success("Fichier DECO généré", {
      description: "BEPC_2024_LCA_002.xlsx prêt pour transmission"
    });
    setShowGenerateDialog(false);
  };

  const handleTransmit = () => {
    toast.success("Transmission initiée", {
      description: "Le fichier est en cours d'envoi vers le serveur DECO"
    });
    setShowTransmitDialog(false);
  };

  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectAllValid = () => {
    const validIds = mockCandidates.filter(c => c.status === "valide").map(c => c.id);
    setSelectedCandidates(validIds);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileCheck className="h-8 w-8 text-primary" />
            Rapprochement DECO
          </h1>
          <p className="text-muted-foreground mt-1">
            Vérification, validation et transmission des données vers la DECO
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bepc">BEPC 2024</SelectItem>
              <SelectItem value="bac">BAC 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleValidateAll} disabled={isValidating}>
            {isValidating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Valider tout
          </Button>
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Générer fichier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Générer Fichier DECO</DialogTitle>
                <DialogDescription>
                  Créer un fichier Excel conforme au format DECO
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Format DECO</AlertTitle>
                  <AlertDescription>
                    Le fichier sera généré au format officiel avec les en-têtes requis par la DECO
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label>Candidats à inclure</Label>
                  <Select defaultValue="valides">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valides">Candidats valides uniquement ({validCandidates})</SelectItem>
                      <SelectItem value="selection">Sélection actuelle ({selectedCandidates.length})</SelectItem>
                      <SelectItem value="tous">Tous les candidats ({totalCandidates})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Candidats</div>
                    <div className="text-2xl font-bold">{validCandidates}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Taille estimée</div>
                    <div className="text-2xl font-bold">~0.8 MB</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>Annuler</Button>
                <Button onClick={handleGenerateFile}>
                  <Download className="h-4 w-4 mr-2" />
                  Générer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showTransmitDialog} onOpenChange={setShowTransmitDialog}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Transmettre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transmettre à la DECO</DialogTitle>
                <DialogDescription>
                  Envoyer le fichier vers le serveur de la DECO
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Alert variant="destructive" className="border-amber-200 bg-amber-50 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    La transmission est définitive. Assurez-vous que toutes les données sont correctes.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label>Fichier à transmettre</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">BEPC_2024_LCA_002.xlsx</div>
                      <div className="text-xs text-muted-foreground">{validCandidates} candidats • 0.8 MB</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Serveur de destination</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Serveur de test DECO</SelectItem>
                      <SelectItem value="production">Serveur de production DECO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTransmitDialog(false)}>Annuler</Button>
                <Button onClick={handleTransmit} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Confirmer transmission
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Validation Progress */}
      {isValidating && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Validation en cours...</span>
                <span className="text-sm text-muted-foreground">{validationProgress}%</span>
              </div>
              <Progress value={validationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Compliance Dashboard */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalCandidates}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Session {selectedExam.toUpperCase()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidats Valides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{validCandidates}</span>
            </div>
            <Progress value={(validCandidates / totalCandidates) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Erreurs Détectées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{errorCandidates}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">À corriger</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{pendingCandidates}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Incomplets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transmissions OK</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{transmissionsSuccess}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Acceptées DECO</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Conformité DECO - Temps Réel
          </CardTitle>
          <CardDescription>
            Indicateurs de conformité pour la transmission des données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {complianceMetrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.label}</span>
                  {metric.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : metric.status === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold">
                  {metric.value}/{metric.total}
                </div>
                <Progress 
                  value={(metric.value / metric.total) * 100} 
                  className={`h-1 mt-2 ${
                    metric.status === "success" ? "[&>div]:bg-green-600" :
                    metric.status === "warning" ? "[&>div]:bg-amber-600" : "[&>div]:bg-red-600"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="candidats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="candidats" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Candidats
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Alertes
            {mockValidationResults.filter(v => !v.resolved && v.severity === "error").length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {mockValidationResults.filter(v => !v.resolved && v.severity === "error").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="transmissions" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Transmissions
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        {/* Candidats Tab */}
        <TabsContent value="candidats" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Liste des Candidats</CardTitle>
                  <CardDescription>
                    Vérification des matricules et cohérence des notes
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllValid}>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Sélectionner valides
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, prénom ou matricule..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="valide">Valide</SelectItem>
                    <SelectItem value="erreur_matricule">Erreur matricule</SelectItem>
                    <SelectItem value="erreur_notes">Erreur notes</SelectItem>
                    <SelectItem value="incomplet">Incomplet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedCandidates.length === filteredCandidates.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCandidates(filteredCandidates.map(c => c.id));
                            } else {
                              setSelectedCandidates([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Nom & Prénoms</TableHead>
                      <TableHead>Centre</TableHead>
                      <TableHead className="text-center">Moyenne</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow 
                        key={candidate.id}
                        className={candidate.status.includes("erreur") ? "bg-red-50 dark:bg-red-950/20" : ""}
                      >
                        <TableCell>
                          <Checkbox 
                            checked={selectedCandidates.includes(candidate.id)}
                            onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {candidate.status === "erreur_matricule" ? (
                            <span className="text-red-600">{candidate.matricule}</span>
                          ) : (
                            candidate.matricule
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{candidate.nom} {candidate.prenoms}</div>
                            <div className="text-xs text-muted-foreground">
                              {candidate.sexe} • Né(e) le {candidate.dateNaissance}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{candidate.centreExamen}</div>
                          <div className="text-xs text-muted-foreground">Table {candidate.numeroTable}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          {candidate.moyenne !== null ? (
                            <span className={`font-bold ${candidate.moyenne >= 10 ? "text-green-600" : "text-red-600"}`}>
                              {candidate.moyenne.toFixed(2)}/20
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Selection Summary */}
              {selectedCandidates.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">
                    {selectedCandidates.length} candidat(s) sélectionné(s)
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCandidates([])}>
                      Désélectionner
                    </Button>
                    <Button size="sm" onClick={() => setShowGenerateDialog(true)}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Générer fichier
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation/Alerts Tab */}
        <TabsContent value="validation" className="space-y-4">
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreurs bloquantes détectées</AlertTitle>
            <AlertDescription>
              {mockValidationResults.filter(v => !v.resolved && v.severity === "error").length} erreur(s) doivent être corrigées avant la transmission DECO
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {mockValidationResults.map((result) => (
              <Card 
                key={result.id} 
                className={
                  result.severity === "error" ? "border-red-300" :
                  result.severity === "warning" ? "border-amber-300" : "border-blue-300"
                }
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      result.severity === "error" ? "bg-red-100" :
                      result.severity === "warning" ? "bg-amber-100" : "bg-blue-100"
                    }`}>
                      {result.severity === "error" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : result.severity === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="uppercase text-xs">
                            {result.type.replace("_", " ")}
                          </Badge>
                          {result.candidateName && (
                            <span className="text-sm font-medium">{result.candidateName}</span>
                          )}
                          {result.field && (
                            <span className="text-sm text-muted-foreground">• {result.field}</span>
                          )}
                        </div>
                        {result.resolved ? (
                          <Badge className="bg-green-100 text-green-800">Résolu</Badge>
                        ) : (
                          <Badge variant="outline">En attente</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm">{result.message}</p>
                      {result.suggestion && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <span className="font-medium">Suggestion: </span>
                          {result.suggestion}
                        </div>
                      )}
                      {!result.resolved && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir détails
                          </Button>
                          <Button size="sm">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Corriger
                          </Button>
                          {result.severity !== "error" && (
                            <Button size="sm" variant="ghost">
                              <Ban className="h-4 w-4 mr-1" />
                              Ignorer
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transmissions Tab */}
        <TabsContent value="transmissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Historique des Transmissions
              </CardTitle>
              <CardDescription>
                Suivi des envois vers le serveur DECO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Candidats</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Réponse DECO</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransmissions.map((transmission) => (
                    <TableRow key={transmission.id}>
                      <TableCell className="font-mono text-sm">
                        {transmission.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="text-sm font-medium">{transmission.fileName}</div>
                            <div className="text-xs text-muted-foreground">{transmission.fileSize}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transmission.type}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{transmission.candidatesCount}</span>
                      </TableCell>
                      <TableCell>{getTransmissionStatusBadge(transmission.status)}</TableCell>
                      <TableCell>
                        {transmission.responseCode && (
                          <div>
                            <div className="text-xs font-mono text-muted-foreground">
                              {transmission.responseCode}
                            </div>
                            <div className="text-sm truncate max-w-[200px]">
                              {transmission.responseMessage}
                            </div>
                          </div>
                        )}
                        {transmission.errors > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="destructive" className="text-xs">
                              {transmission.errors} erreurs
                            </Badge>
                            {transmission.warnings > 0 && (
                              <Badge className="bg-amber-100 text-amber-800 text-xs">
                                {transmission.warnings} avert.
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {transmission.status === "rejete" && (
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4" />
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
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Valides</span>
                    </div>
                    <span className="font-bold">{validCandidates} ({((validCandidates / totalCandidates) * 100).toFixed(1)}%)</span>
                  </div>
                  <Progress value={(validCandidates / totalCandidates) * 100} className="h-2 [&>div]:bg-green-500" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Erreurs</span>
                    </div>
                    <span className="font-bold">{errorCandidates} ({((errorCandidates / totalCandidates) * 100).toFixed(1)}%)</span>
                  </div>
                  <Progress value={(errorCandidates / totalCandidates) * 100} className="h-2 [&>div]:bg-red-500" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>Incomplets</span>
                    </div>
                    <span className="font-bold">{pendingCandidates} ({((pendingCandidates / totalCandidates) * 100).toFixed(1)}%)</span>
                  </div>
                  <Progress value={(pendingCandidates / totalCandidates) * 100} className="h-2 [&>div]:bg-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taux de Succès Transmissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600">
                      {((transmissionsSuccess / mockTransmissions.length) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {transmissionsSuccess} sur {mockTransmissions.length} transmissions acceptées
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">{transmissionsSuccess}</div>
                      <div className="text-xs text-muted-foreground">Acceptées</div>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded">
                      <div className="text-lg font-bold text-amber-600">
                        {mockTransmissions.filter(t => t.status === "partiel").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Partielles</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-600">
                        {mockTransmissions.filter(t => t.status === "rejete").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Rejetées</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Types d'Erreurs Détectées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-muted-foreground">Matricules</div>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-orange-600">2</div>
                    <div className="text-sm text-muted-foreground">Notes</div>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-amber-600">1</div>
                    <div className="text-sm text-muted-foreground">Cohérence</div>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-purple-600">1</div>
                    <div className="text-sm text-muted-foreground">Doublons</div>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-blue-600">1</div>
                    <div className="text-sm text-muted-foreground">Format</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
