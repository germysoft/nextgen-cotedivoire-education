import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Shield, 
  Search, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Lock, 
  Eye, 
  History,
  Database,
  Fingerprint,
  Archive,
  TrendingUp,
  AlertCircle,
  FileCheck,
  Filter,
  Calendar,
  Activity,
  Server,
  Key,
  RefreshCw
} from "lucide-react";

// Types
interface AuditLog {
  id: string;
  timestamp: string;
  action: "saisie" | "modification" | "validation" | "suppression" | "export" | "signature" | "consultation";
  module: string;
  user: string;
  userId: string;
  ipAddress: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  candidateId?: string;
  candidateName?: string;
  subject?: string;
  severity: "info" | "warning" | "critical";
  hash: string;
}

interface Anomaly {
  id: string;
  timestamp: string;
  type: "note_aberrante" | "modification_frequente" | "pattern_suspect" | "acces_non_autorise" | "ecart_statistique";
  description: string;
  candidateId?: string;
  candidateName?: string;
  subject?: string;
  details: string;
  status: "detectee" | "en_cours" | "resolue" | "ignoree";
  severity: "low" | "medium" | "high" | "critical";
  investigator?: string;
  resolution?: string;
}

interface Signature {
  id: string;
  documentType: string;
  documentId: string;
  signatory: string;
  role: string;
  timestamp: string;
  certificate: string;
  hashAlgorithm: string;
  signatureHash: string;
  verified: boolean;
  expiryDate: string;
}

interface ArchiveRecord {
  id: string;
  session: string;
  examType: string;
  documentType: string;
  createdAt: string;
  archivedAt: string;
  expiryDate: string;
  size: string;
  encryption: string;
  integrity: "verified" | "pending" | "corrupted";
  location: string;
  accessCount: number;
  lastAccessed?: string;
}

// Mock data
const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    timestamp: "2024-06-15 14:32:15",
    action: "saisie",
    module: "Notes Examens",
    user: "KOUAME Jean",
    userId: "USR-001",
    ipAddress: "192.168.1.45",
    details: "Saisie initiale note Mathématiques",
    newValue: "15/20",
    candidateId: "CAND-001",
    candidateName: "KOUASSI Aya Marie",
    subject: "Mathématiques",
    severity: "info",
    hash: "sha256:a1b2c3d4e5f6..."
  },
  {
    id: "LOG-002",
    timestamp: "2024-06-15 14:45:22",
    action: "modification",
    module: "Notes Examens",
    user: "KOUAME Jean",
    userId: "USR-001",
    ipAddress: "192.168.1.45",
    details: "Modification note après vérification copie",
    oldValue: "12/20",
    newValue: "14/20",
    candidateId: "CAND-002",
    candidateName: "DIALLO Mamadou",
    subject: "Français",
    severity: "warning",
    hash: "sha256:b2c3d4e5f6g7..."
  },
  {
    id: "LOG-003",
    timestamp: "2024-06-15 15:00:00",
    action: "validation",
    module: "Délibérations",
    user: "Dr. BAMBA Directeur",
    userId: "USR-002",
    ipAddress: "192.168.1.10",
    details: "Validation finale PV délibération Jury A",
    severity: "info",
    hash: "sha256:c3d4e5f6g7h8..."
  },
  {
    id: "LOG-004",
    timestamp: "2024-06-15 15:30:45",
    action: "signature",
    module: "Documents Officiels",
    user: "Dr. BAMBA Directeur",
    userId: "USR-002",
    ipAddress: "192.168.1.10",
    details: "Signature électronique diplôme BEPC",
    candidateId: "CAND-003",
    candidateName: "TRAORE Fatou",
    severity: "info",
    hash: "sha256:d4e5f6g7h8i9..."
  },
  {
    id: "LOG-005",
    timestamp: "2024-06-15 16:12:33",
    action: "modification",
    module: "Notes Examens",
    user: "KONE Adjoua",
    userId: "USR-003",
    ipAddress: "192.168.1.78",
    details: "Modification note suspecte - 3ème modification",
    oldValue: "08/20",
    newValue: "16/20",
    candidateId: "CAND-004",
    candidateName: "YAO Kouadio",
    subject: "Physique-Chimie",
    severity: "critical",
    hash: "sha256:e5f6g7h8i9j0..."
  },
  {
    id: "LOG-006",
    timestamp: "2024-06-15 16:45:00",
    action: "export",
    module: "Communication",
    user: "ADMIN Système",
    userId: "USR-ADMIN",
    ipAddress: "192.168.1.1",
    details: "Export résultats format DECO - 245 candidats",
    severity: "info",
    hash: "sha256:f6g7h8i9j0k1..."
  },
  {
    id: "LOG-007",
    timestamp: "2024-06-15 17:00:15",
    action: "consultation",
    module: "Archives",
    user: "Inspecteur DECO",
    userId: "USR-EXT-001",
    ipAddress: "41.202.219.45",
    details: "Consultation archives session 2023",
    severity: "info",
    hash: "sha256:g7h8i9j0k1l2..."
  }
];

const mockAnomalies: Anomaly[] = [
  {
    id: "ANOM-001",
    timestamp: "2024-06-15 16:12:33",
    type: "modification_frequente",
    description: "Modification excessive de note",
    candidateId: "CAND-004",
    candidateName: "YAO Kouadio",
    subject: "Physique-Chimie",
    details: "3 modifications successives en moins de 2h avec écart de 8 points",
    status: "en_cours",
    severity: "critical",
    investigator: "Dr. BAMBA"
  },
  {
    id: "ANOM-002",
    timestamp: "2024-06-15 14:00:00",
    type: "note_aberrante",
    description: "Note statistiquement aberrante",
    candidateId: "CAND-005",
    candidateName: "SORO Lacina",
    subject: "Mathématiques",
    details: "Note 20/20 alors que moyenne classe 8.5/20 - Écart-type > 3σ",
    status: "detectee",
    severity: "high"
  },
  {
    id: "ANOM-003",
    timestamp: "2024-06-14 23:45:00",
    type: "acces_non_autorise",
    description: "Tentative d'accès hors horaires",
    details: "Connexion à 23h45 depuis IP non reconnue - Accès bloqué",
    status: "resolue",
    severity: "critical",
    resolution: "IP bloquée, utilisateur notifié, rapport incident créé"
  },
  {
    id: "ANOM-004",
    timestamp: "2024-06-15 10:30:00",
    type: "ecart_statistique",
    description: "Écart significatif moyenne jury",
    subject: "Français",
    details: "Jury B moyenne 14.2/20 vs Jury A 10.8/20 - Écart > 2 points",
    status: "en_cours",
    severity: "medium",
    investigator: "Commission Harmonisation"
  },
  {
    id: "ANOM-005",
    timestamp: "2024-06-15 11:15:00",
    type: "pattern_suspect",
    description: "Pattern de notes identiques",
    subject: "Histoire-Géographie",
    details: "5 candidats consécutifs avec note exacte 12/20",
    status: "ignoree",
    severity: "low",
    resolution: "Vérifié - Coïncidence confirmée après vérification copies"
  }
];

const mockSignatures: Signature[] = [
  {
    id: "SIG-001",
    documentType: "Procès-Verbal Délibération",
    documentId: "PV-2024-BEPC-001",
    signatory: "Dr. BAMBA Directeur",
    role: "Président du Jury",
    timestamp: "2024-06-15 15:30:00",
    certificate: "CN=Dr BAMBA, O=Lycée Excellence, C=CI",
    hashAlgorithm: "SHA-256",
    signatureHash: "3a7bd3e2f1c9b8a7d6e5f4c3b2a1...",
    verified: true,
    expiryDate: "2026-06-15"
  },
  {
    id: "SIG-002",
    documentType: "Diplôme BEPC",
    documentId: "DIP-2024-00001",
    signatory: "Dr. BAMBA Directeur",
    role: "Directeur d'Établissement",
    timestamp: "2024-06-16 10:00:00",
    certificate: "CN=Dr BAMBA, O=Lycée Excellence, C=CI",
    hashAlgorithm: "SHA-256",
    signatureHash: "4b8ce4f3g2d0c9b8a7e6f5d4c3...",
    verified: true,
    expiryDate: "2026-06-15"
  },
  {
    id: "SIG-003",
    documentType: "Attestation de Réussite",
    documentId: "ATT-2024-00045",
    signatory: "Mme KOUASSI Secrétaire",
    role: "Secrétaire Général",
    timestamp: "2024-06-16 11:30:00",
    certificate: "CN=Mme KOUASSI, O=Lycée Excellence, C=CI",
    hashAlgorithm: "SHA-256",
    signatureHash: "5c9df5g4h3e1d0c9b8a7f6e5...",
    verified: true,
    expiryDate: "2025-12-31"
  }
];

const mockArchives: ArchiveRecord[] = [
  {
    id: "ARCH-001",
    session: "2024",
    examType: "BEPC",
    documentType: "Procès-Verbaux",
    createdAt: "2024-06-15",
    archivedAt: "2024-06-20",
    expiryDate: "2034-06-20",
    size: "45.2 MB",
    encryption: "AES-256-GCM",
    integrity: "verified",
    location: "Coffre-fort numérique principal",
    accessCount: 3,
    lastAccessed: "2024-06-25"
  },
  {
    id: "ARCH-002",
    session: "2024",
    examType: "BEPC",
    documentType: "Notes & Délibérations",
    createdAt: "2024-06-16",
    archivedAt: "2024-06-21",
    expiryDate: "2034-06-21",
    size: "128.7 MB",
    encryption: "AES-256-GCM",
    integrity: "verified",
    location: "Coffre-fort numérique principal",
    accessCount: 5,
    lastAccessed: "2024-06-28"
  },
  {
    id: "ARCH-003",
    session: "2024",
    examType: "BEPC",
    documentType: "Diplômes & Attestations",
    createdAt: "2024-06-20",
    archivedAt: "2024-06-25",
    expiryDate: "2034-06-25",
    size: "256.3 MB",
    encryption: "AES-256-GCM",
    integrity: "verified",
    location: "Coffre-fort numérique principal",
    accessCount: 12,
    lastAccessed: "2024-07-01"
  },
  {
    id: "ARCH-004",
    session: "2023",
    examType: "BEPC",
    documentType: "Archives Complètes",
    createdAt: "2023-06-20",
    archivedAt: "2023-07-01",
    expiryDate: "2033-07-01",
    size: "1.2 GB",
    encryption: "AES-256-GCM",
    integrity: "verified",
    location: "Coffre-fort numérique secondaire",
    accessCount: 28,
    lastAccessed: "2024-06-15"
  },
  {
    id: "ARCH-005",
    session: "2022",
    examType: "BEPC",
    documentType: "Archives Complètes",
    createdAt: "2022-06-25",
    archivedAt: "2022-07-05",
    expiryDate: "2032-07-05",
    size: "1.1 GB",
    encryption: "AES-256-GCM",
    integrity: "verified",
    location: "Coffre-fort numérique secondaire",
    accessCount: 45,
    lastAccessed: "2024-03-10"
  }
];

export default function AuditExamens() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"pending" | "success" | "failed">("pending");

  // Stats
  const totalLogs = mockAuditLogs.length;
  const criticalLogs = mockAuditLogs.filter(l => l.severity === "critical").length;
  const activeAnomalies = mockAnomalies.filter(a => a.status === "detectee" || a.status === "en_cours").length;
  const verifiedSignatures = mockSignatures.filter(s => s.verified).length;
  const archiveIntegrity = mockArchives.filter(a => a.integrity === "verified").length;

  // Filter logs
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.candidateName && log.candidateName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    return matchesSearch && matchesAction && matchesSeverity;
  });

  const getActionBadge = (action: AuditLog["action"]) => {
    const styles = {
      saisie: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      modification: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      validation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      suppression: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      export: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      signature: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      consultation: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
    };
    const labels = {
      saisie: "Saisie",
      modification: "Modification",
      validation: "Validation",
      suppression: "Suppression",
      export: "Export",
      signature: "Signature",
      consultation: "Consultation"
    };
    return <Badge className={styles[action]}>{labels[action]}</Badge>;
  };

  const getSeverityBadge = (severity: "info" | "warning" | "critical") => {
    const styles = {
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      warning: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    const labels = {
      info: "Info",
      warning: "Attention",
      critical: "Critique"
    };
    return <Badge className={styles[severity]}>{labels[severity]}</Badge>;
  };

  const getAnomalySeverityBadge = (severity: Anomaly["severity"]) => {
    const styles = {
      low: "bg-slate-100 text-slate-800",
      medium: "bg-amber-100 text-amber-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    };
    const labels = {
      low: "Faible",
      medium: "Moyenne",
      high: "Haute",
      critical: "Critique"
    };
    return <Badge className={styles[severity]}>{labels[severity]}</Badge>;
  };

  const getAnomalyStatusBadge = (status: Anomaly["status"]) => {
    const styles = {
      detectee: "bg-red-100 text-red-800",
      en_cours: "bg-amber-100 text-amber-800",
      resolue: "bg-green-100 text-green-800",
      ignoree: "bg-slate-100 text-slate-800"
    };
    const labels = {
      detectee: "Détectée",
      en_cours: "En cours",
      resolue: "Résolue",
      ignoree: "Ignorée"
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const handleExportAudit = (format: string) => {
    toast.success(`Export audit ${format.toUpperCase()} généré`);
    setShowExportDialog(false);
  };

  const handleVerifyIntegrity = () => {
    setVerificationResult("pending");
    setShowVerifyDialog(true);
    setTimeout(() => {
      setVerificationResult("success");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Audit & Sécurité
          </h1>
          <p className="text-muted-foreground mt-1">
            Traçabilité complète, détection d'anomalies et archivage conforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleVerifyIntegrity}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Vérifier intégrité
          </Button>
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export DECO
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Audit pour DECO</DialogTitle>
                <DialogDescription>
                  Générer un rapport d'audit conforme aux exigences de la DECO
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Période</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Date début" />
                    <Input type="date" placeholder="Date fin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type de rapport</Label>
                  <Select defaultValue="complet">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complet">Rapport complet</SelectItem>
                      <SelectItem value="anomalies">Anomalies uniquement</SelectItem>
                      <SelectItem value="modifications">Modifications de notes</SelectItem>
                      <SelectItem value="signatures">Signatures électroniques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleExportAudit("pdf")}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleExportAudit("excel")}>
                      <FileCheck className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleExportAudit("xml")}>
                      <Database className="h-4 w-4 mr-2" />
                      XML
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowExportDialog(false)}>Annuler</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Événements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalLogs}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Dernières 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertes Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{criticalLogs}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Nécessitent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Anomalies Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{activeAnomalies}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">En investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signatures Vérifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{verifiedSignatures}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">100% valides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Archives Intègres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{archiveIntegrity}/{mockArchives.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cryptage AES-256</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="journal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Journal d'Audit
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Anomalies
            {activeAnomalies > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {activeAnomalies}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="signatures" className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            Signatures
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
        </TabsList>

        {/* Journal d'Audit */}
        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Journal Complet Horodaté
              </CardTitle>
              <CardDescription>
                Traçabilité complète de toutes les opérations sur les notes et documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par utilisateur, candidat, détails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes actions</SelectItem>
                    <SelectItem value="saisie">Saisie</SelectItem>
                    <SelectItem value="modification">Modification</SelectItem>
                    <SelectItem value="validation">Validation</SelectItem>
                    <SelectItem value="suppression">Suppression</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="signature">Signature</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-[180px]">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sévérité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes sévérités</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Attention</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Logs Table */}
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Horodatage</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Sévérité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className={log.severity === "critical" ? "bg-red-50 dark:bg-red-950/20" : ""}>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {log.timestamp}
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{log.user}</div>
                              <div className="text-xs text-muted-foreground">{log.ipAddress}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px]">
                            <div className="truncate">{log.details}</div>
                            {log.oldValue && log.newValue && (
                              <div className="text-xs text-muted-foreground mt-1">
                                <span className="line-through text-red-500">{log.oldValue}</span>
                                {" → "}
                                <span className="text-green-600">{log.newValue}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.candidateName ? (
                            <div>
                              <div className="font-medium">{log.candidateName}</div>
                              <div className="text-xs text-muted-foreground">{log.subject}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomalies */}
        <TabsContent value="anomalies" className="space-y-4">
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Détection automatique d'anomalies</AlertTitle>
            <AlertDescription>
              Le système analyse en temps réel les patterns de saisie et détecte les comportements suspects.
              {activeAnomalies > 0 && ` ${activeAnomalies} anomalie(s) nécessitent votre attention.`}
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            {mockAnomalies.map((anomaly) => (
              <Card key={anomaly.id} className={anomaly.status === "detectee" || anomaly.status === "en_cours" ? "border-amber-300" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {anomaly.severity === "critical" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      )}
                      {anomaly.description}
                    </CardTitle>
                    {getAnomalyStatusBadge(anomaly.status)}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {anomaly.timestamp}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sévérité</span>
                    {getAnomalySeverityBadge(anomaly.severity)}
                  </div>
                  
                  {anomaly.candidateName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Candidat</span>
                      <span className="text-sm font-medium">{anomaly.candidateName}</span>
                    </div>
                  )}
                  
                  {anomaly.subject && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Matière</span>
                      <span className="text-sm">{anomaly.subject}</span>
                    </div>
                  )}
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{anomaly.details}</p>
                  </div>
                  
                  {anomaly.investigator && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Investigateur:</span>
                      <span className="font-medium">{anomaly.investigator}</span>
                    </div>
                  )}
                  
                  {anomaly.resolution && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <CheckCircle2 className="h-4 w-4 inline mr-1" />
                        {anomaly.resolution}
                      </p>
                    </div>
                  )}
                  
                  {(anomaly.status === "detectee" || anomaly.status === "en_cours") && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedAnomaly(anomaly)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Investiguer
                      </Button>
                      <Button size="sm" variant="default" className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Résoudre
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Signatures */}
        <TabsContent value="signatures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Signatures Électroniques Certifiées
              </CardTitle>
              <CardDescription>
                Signatures horodatées avec certificats numériques vérifiables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Signataire</TableHead>
                    <TableHead>Horodatage</TableHead>
                    <TableHead>Certificat</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Validité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSignatures.map((sig) => (
                    <TableRow key={sig.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sig.documentType}</div>
                          <div className="text-xs text-muted-foreground">{sig.documentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sig.signatory}</div>
                          <div className="text-xs text-muted-foreground">{sig.role}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{sig.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-mono truncate max-w-[150px]">{sig.certificate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-mono">{sig.hashAlgorithm}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {sig.verified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Non vérifié</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{sig.expiryDate}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vérification de Signature</CardTitle>
              <CardDescription>
                Vérifier l'authenticité d'une signature électronique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID du Document</Label>
                  <Input placeholder="Ex: DIP-2024-00001" />
                </div>
                <div className="space-y-2">
                  <Label>Hash de Signature</Label>
                  <Input placeholder="Ex: 3a7bd3e2f1c9b8a7..." />
                </div>
              </div>
              <Button>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Vérifier la Signature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archives */}
        <TabsContent value="archives" className="space-y-4">
          <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
            <Archive className="h-4 w-4" />
            <AlertTitle>Archivage Conforme 10 Ans</AlertTitle>
            <AlertDescription>
              Tous les documents sont cryptés en AES-256-GCM et archivés conformément à la réglementation 
              sur la conservation des documents d'examens officiels.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Archives Cryptées
              </CardTitle>
              <CardDescription>
                Coffre-fort numérique avec vérification d'intégrité continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Cryptage</TableHead>
                    <TableHead>Intégrité</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Accès</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockArchives.map((archive) => (
                    <TableRow key={archive.id}>
                      <TableCell className="font-medium">{archive.session}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{archive.examType}</Badge>
                      </TableCell>
                      <TableCell>{archive.documentType}</TableCell>
                      <TableCell>{archive.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-mono">{archive.encryption}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {archive.integrity === "verified" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        ) : archive.integrity === "pending" ? (
                          <Badge className="bg-amber-100 text-amber-800">En cours</Badge>
                        ) : (
                          <Badge variant="destructive">Corrompu</Badge>
                        )}
                      </TableCell>
                      <TableCell>{archive.expiryDate}</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{archive.accessCount}</div>
                          <div className="text-xs text-muted-foreground">
                            {archive.lastAccessed && `Dernier: ${archive.lastAccessed}`}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Espace de Stockage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilisé</span>
                    <span className="font-medium">3.7 GB / 50 GB</span>
                  </div>
                  <Progress value={7.4} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Server className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-lg font-bold">5</div>
                    <div className="text-xs text-muted-foreground">Sessions archivées</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-lg font-bold">12,450</div>
                    <div className="text-xs text-muted-foreground">Documents</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prochaine Vérification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-medium">Vérification d'intégrité planifiée</div>
                    <div className="text-sm text-muted-foreground">Dans 6 heures</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dernière vérification</span>
                    <span>15/06/2024 à 03:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Résultat</span>
                    <Badge className="bg-green-100 text-green-800">100% intègre</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fréquence</span>
                    <span>Quotidienne</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Détails de l'Événement
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur l'action enregistrée
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-mono">{selectedLog.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Horodatage</Label>
                  <p className="font-mono">{selectedLog.timestamp}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Action</Label>
                  <p>{getActionBadge(selectedLog.action)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Sévérité</Label>
                  <p>{getSeverityBadge(selectedLog.severity)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Utilisateur</Label>
                  <p>{selectedLog.user} ({selectedLog.userId})</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Adresse IP</Label>
                  <p className="font-mono">{selectedLog.ipAddress}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-muted-foreground">Détails</Label>
                <p className="p-3 bg-muted rounded-lg">{selectedLog.details}</p>
              </div>
              
              {selectedLog.candidateName && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Candidat</Label>
                    <p>{selectedLog.candidateName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Matière</Label>
                    <p>{selectedLog.subject}</p>
                  </div>
                </div>
              )}
              
              {selectedLog.oldValue && selectedLog.newValue && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200">
                  <Label className="text-muted-foreground">Modification</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="line-through text-red-600">{selectedLog.oldValue}</span>
                    <span>→</span>
                    <span className="text-green-600 font-medium">{selectedLog.newValue}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <Label className="text-muted-foreground">Hash de vérification</Label>
                <p className="font-mono text-xs p-2 bg-muted rounded">{selectedLog.hash}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verify Integrity Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vérification d'Intégrité</DialogTitle>
            <DialogDescription>
              Vérification de l'intégrité des données et des archives
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {verificationResult === "pending" ? (
              <div className="text-center space-y-4">
                <RefreshCw className="h-12 w-12 mx-auto text-primary animate-spin" />
                <p>Vérification en cours...</p>
                <Progress value={65} className="w-full" />
              </div>
            ) : verificationResult === "success" ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
                <div>
                  <p className="font-medium text-green-600">Intégrité vérifiée</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tous les enregistrements et archives sont intègres
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{totalLogs}</div>
                    <div className="text-xs text-muted-foreground">Logs vérifiés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockSignatures.length}</div>
                    <div className="text-xs text-muted-foreground">Signatures valides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockArchives.length}</div>
                    <div className="text-xs text-muted-foreground">Archives intègres</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 mx-auto text-red-600" />
                <p className="font-medium text-red-600">Anomalies détectées</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowVerifyDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
