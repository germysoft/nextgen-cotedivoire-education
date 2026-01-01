import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Upload, Download, CheckCircle, XCircle, Search, User, 
  Eye, Trash2, Calendar, Clock, Filter, RefreshCw, AlertCircle,
  FileImage, FilePlus, FolderOpen, Send, Printer, Mail, Archive,
  CheckCircle2, FileWarning, FolderCheck, Settings, MoreVertical
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableFilters, FilterConfig } from "@/components/data-table/DataTableFilters";
import { DataTableExport } from "@/components/data-table/DataTableExport";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Document {
  id: string;
  nom: string;
  type: 'acte_naissance' | 'certificat_scolarite' | 'photo' | 'certificat_medical' | 'releve_notes' | 'extrait_casier' | 'fiche_inscription';
  dateTelechargement: string;
  taille: string;
  statut: 'valide' | 'en_attente' | 'rejete' | 'expire';
  commentaire?: string;
}

interface DossierEleve {
  id: string;
  eleve: string;
  matricule: string;
  classe: string;
  niveau: string;
  parent: string;
  telephone: string;
  email: string;
  documents: Document[];
  completude: number;
  dateCreation: string;
  derniereMaj: string;
  alertes: number;
}

const dossiers: DossierEleve[] = [
  { 
    id: "1",
    eleve: "KOUASSI Jean-Baptiste", 
    matricule: "MAT-2024-001",
    classe: "Tle D", 
    niveau: "Terminale",
    parent: "KOUASSI François",
    telephone: "+225 07 12 34 56 78",
    email: "kouassi.f@email.com",
    documents: [
      { id: "d1", nom: "Acte de naissance", type: "acte_naissance", dateTelechargement: "2024-09-01", taille: "1.2 MB", statut: "valide" },
      { id: "d2", nom: "Certificat de scolarité 2023-2024", type: "certificat_scolarite", dateTelechargement: "2024-09-05", taille: "0.8 MB", statut: "valide" },
      { id: "d3", nom: "Photo identité", type: "photo", dateTelechargement: "2024-09-01", taille: "0.3 MB", statut: "valide" },
      { id: "d4", nom: "Certificat médical", type: "certificat_medical", dateTelechargement: "2024-09-10", taille: "1.5 MB", statut: "valide" },
      { id: "d5", nom: "Relevé de notes T1", type: "releve_notes", dateTelechargement: "2024-12-15", taille: "0.5 MB", statut: "valide" },
    ],
    completude: 100,
    dateCreation: "2024-09-01",
    derniereMaj: "2024-12-15",
    alertes: 0
  },
  { 
    id: "2",
    eleve: "DIALLO Fatoumata", 
    matricule: "MAT-2024-002",
    classe: "1ère A", 
    niveau: "Première",
    parent: "DIALLO Mamadou",
    telephone: "+225 05 98 76 54 32",
    email: "diallo.m@email.com",
    documents: [
      { id: "d6", nom: "Acte de naissance", type: "acte_naissance", dateTelechargement: "2024-09-02", taille: "1.1 MB", statut: "valide" },
      { id: "d7", nom: "Certificat de scolarité 2023-2024", type: "certificat_scolarite", dateTelechargement: "2024-09-06", taille: "0.9 MB", statut: "valide" },
      { id: "d8", nom: "Photo identité", type: "photo", dateTelechargement: "2024-09-02", taille: "0.2 MB", statut: "en_attente", commentaire: "Photo floue, veuillez renvoyer" },
      { id: "d9", nom: "Certificat médical", type: "certificat_medical", dateTelechargement: "2024-09-12", taille: "1.4 MB", statut: "valide" },
    ],
    completude: 80,
    dateCreation: "2024-09-02",
    derniereMaj: "2024-12-10",
    alertes: 1
  },
  { 
    id: "3",
    eleve: "TOURÉ Mohamed Lamine", 
    matricule: "MAT-2024-003",
    classe: "2nde B", 
    niveau: "Seconde",
    parent: "TOURÉ Oumar",
    telephone: "+225 01 23 45 67 89",
    email: "toure.o@email.com",
    documents: [
      { id: "d10", nom: "Acte de naissance", type: "acte_naissance", dateTelechargement: "2024-09-03", taille: "1.0 MB", statut: "valide" },
      { id: "d11", nom: "Photo identité", type: "photo", dateTelechargement: "2024-09-03", taille: "0.25 MB", statut: "valide" },
    ],
    completude: 40,
    dateCreation: "2024-09-03",
    derniereMaj: "2024-09-03",
    alertes: 3
  },
  { 
    id: "4",
    eleve: "SANOGO Aminata", 
    matricule: "MAT-2024-004",
    classe: "3ème C", 
    niveau: "Troisième",
    parent: "SANOGO Ibrahim",
    telephone: "+225 07 65 43 21 09",
    email: "sanogo.i@email.com",
    documents: [
      { id: "d12", nom: "Acte de naissance", type: "acte_naissance", dateTelechargement: "2024-09-04", taille: "1.3 MB", statut: "valide" },
      { id: "d13", nom: "Certificat de scolarité 2023-2024", type: "certificat_scolarite", dateTelechargement: "2024-09-08", taille: "0.85 MB", statut: "valide" },
      { id: "d14", nom: "Photo identité", type: "photo", dateTelechargement: "2024-09-04", taille: "0.28 MB", statut: "valide" },
      { id: "d15", nom: "Certificat médical", type: "certificat_medical", dateTelechargement: "2024-09-15", taille: "1.6 MB", statut: "valide" },
      { id: "d16", nom: "Fiche d'inscription", type: "fiche_inscription", dateTelechargement: "2024-09-04", taille: "0.4 MB", statut: "valide" },
    ],
    completude: 100,
    dateCreation: "2024-09-04",
    derniereMaj: "2024-12-20",
    alertes: 0
  },
  { 
    id: "5",
    eleve: "KONE Ibrahim Sory", 
    matricule: "MAT-2024-005",
    classe: "4ème A", 
    niveau: "Quatrième",
    parent: "KONE Sekou",
    telephone: "+225 05 11 22 33 44",
    email: "kone.s@email.com",
    documents: [
      { id: "d17", nom: "Acte de naissance", type: "acte_naissance", dateTelechargement: "2024-09-05", taille: "1.15 MB", statut: "rejete", commentaire: "Document illisible" },
      { id: "d18", nom: "Photo identité", type: "photo", dateTelechargement: "2024-09-05", taille: "0.22 MB", statut: "valide" },
      { id: "d19", nom: "Certificat médical", type: "certificat_medical", dateTelechargement: "2024-03-10", taille: "1.2 MB", statut: "expire", commentaire: "Certificat de plus de 6 mois" },
    ],
    completude: 30,
    dateCreation: "2024-09-05",
    derniereMaj: "2024-09-05",
    alertes: 2
  },
  { 
    id: "6",
    eleve: "OUATTARA Marie-Claire", 
    matricule: "MAT-2024-006",
    classe: "5ème B", 
    niveau: "Cinquième",
    parent: "OUATTARA Paul",
    telephone: "+225 07 88 99 00 11",
    email: "ouattara.p@email.com",
    documents: [
      { id: "d20", nom: "Acte de naissance", type: "acte_naissance", dateTelechargement: "2024-09-06", taille: "1.05 MB", statut: "valide" },
      { id: "d21", nom: "Certificat de scolarité 2023-2024", type: "certificat_scolarite", dateTelechargement: "2024-09-10", taille: "0.75 MB", statut: "valide" },
      { id: "d22", nom: "Photo identité", type: "photo", dateTelechargement: "2024-09-06", taille: "0.35 MB", statut: "valide" },
      { id: "d23", nom: "Certificat médical", type: "certificat_medical", dateTelechargement: "2024-09-18", taille: "1.45 MB", statut: "valide" },
    ],
    completude: 80,
    dateCreation: "2024-09-06",
    derniereMaj: "2024-11-28",
    alertes: 0
  },
];

const documentsRequis = [
  { id: "1", nom: "Acte de Naissance", type: "acte_naissance", obligatoire: true, format: "PDF", taille: "< 2MB", description: "Copie certifiée conforme" },
  { id: "2", nom: "Certificat de Scolarité", type: "certificat_scolarite", obligatoire: true, format: "PDF", taille: "< 2MB", description: "Année précédente" },
  { id: "3", nom: "Photo d'identité", type: "photo", obligatoire: true, format: "JPG/PNG", taille: "< 500KB", description: "Fond blanc, récente" },
  { id: "4", nom: "Certificat Médical", type: "certificat_medical", obligatoire: true, format: "PDF", taille: "< 2MB", description: "Moins de 6 mois" },
  { id: "5", nom: "Relevé de Notes", type: "releve_notes", obligatoire: false, format: "PDF", taille: "< 2MB", description: "Bulletins trimestriels" },
  { id: "6", nom: "Extrait de Casier Judiciaire", type: "extrait_casier", obligatoire: false, format: "PDF", taille: "< 2MB", description: "Pour les +18 ans" },
  { id: "7", nom: "Fiche d'Inscription", type: "fiche_inscription", obligatoire: true, format: "PDF", taille: "< 1MB", description: "Signée par les parents" },
];

const activitesRecentes = [
  { id: "1", action: "Téléversement", document: "Certificat médical", eleve: "SANOGO Aminata", date: "2024-12-20 14:30", utilisateur: "Mme Yao" },
  { id: "2", action: "Validation", document: "Acte de naissance", eleve: "KOUASSI Jean-Baptiste", date: "2024-12-19 10:15", utilisateur: "M. Koné" },
  { id: "3", action: "Rejet", document: "Photo identité", eleve: "DIALLO Fatoumata", date: "2024-12-18 16:45", utilisateur: "M. Koné" },
  { id: "4", action: "Relance envoyée", document: "Certificat médical", eleve: "KONE Ibrahim Sory", date: "2024-12-17 09:00", utilisateur: "Système" },
  { id: "5", action: "Téléversement", document: "Relevé de notes T1", eleve: "KOUASSI Jean-Baptiste", date: "2024-12-15 11:20", utilisateur: "Mme Yao" },
];

const filterConfigs: FilterConfig[] = [
  {
    key: "niveau",
    label: "Niveau",
    type: "select",
    options: [
      { value: "Terminale", label: "Terminale" },
      { value: "Première", label: "Première" },
      { value: "Seconde", label: "Seconde" },
      { value: "Troisième", label: "Troisième" },
      { value: "Quatrième", label: "Quatrième" },
      { value: "Cinquième", label: "Cinquième" },
    ],
  },
  {
    key: "completude",
    label: "Complétude",
    type: "select",
    options: [
      { value: "complet", label: "100% Complet" },
      { value: "partiel", label: "50-99%" },
      { value: "incomplet", label: "< 50%" },
    ],
  },
  {
    key: "alertes",
    label: "Alertes",
    type: "select",
    options: [
      { value: "avec", label: "Avec alertes" },
      { value: "sans", label: "Sans alertes" },
    ],
  },
];

const exportColumns = [
  { key: "eleve", label: "Élève" },
  { key: "matricule", label: "Matricule" },
  { key: "classe", label: "Classe" },
  { key: "completude", label: "Complétude (%)" },
  { key: "alertes", label: "Alertes" },
  { key: "derniereMaj", label: "Dernière MAJ" },
];

export default function Documents() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedDossier, setSelectedDossier] = useState<DossierEleve | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEleves, setSelectedEleves] = useState<string[]>([]);
  const [relanceDialogOpen, setRelanceDialogOpen] = useState(false);

  const filteredDossiers = dossiers.filter((d) => {
    if (filters.search && !d.eleve.toLowerCase().includes(filters.search.toLowerCase()) && !d.matricule.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.niveau && d.niveau !== filters.niveau) {
      return false;
    }
    if (filters.completude) {
      if (filters.completude === "complet" && d.completude !== 100) return false;
      if (filters.completude === "partiel" && (d.completude < 50 || d.completude >= 100)) return false;
      if (filters.completude === "incomplet" && d.completude >= 50) return false;
    }
    if (filters.alertes) {
      if (filters.alertes === "avec" && d.alertes === 0) return false;
      if (filters.alertes === "sans" && d.alertes > 0) return false;
    }
    return true;
  });

  const totalDossiers = dossiers.length;
  const complets = dossiers.filter(d => d.completude === 100).length;
  const incomplets = dossiers.filter(d => d.completude < 100).length;
  const totalDocuments = dossiers.reduce((sum, d) => sum + d.documents.length, 0);
  const documentsEnAttente = dossiers.reduce((sum, d) => sum + d.documents.filter(doc => doc.statut === 'en_attente').length, 0);
  const documentsRejetes = dossiers.reduce((sum, d) => sum + d.documents.filter(doc => doc.statut === 'rejete').length, 0);
  const documentsExpires = dossiers.reduce((sum, d) => sum + d.documents.filter(doc => doc.statut === 'expire').length, 0);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'valide':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"><CheckCircle2 className="h-3 w-3 mr-1" />Valide</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'rejete':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
      case 'expire':
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"><FileWarning className="h-3 w-3 mr-1" />Expiré</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const getCompletudeBadge = (completude: number) => {
    if (completude === 100) {
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">{completude}%</Badge>;
    } else if (completude >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">{completude}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">{completude}%</Badge>;
    }
  };

  const handleSendRelance = () => {
    toast.success(`Relances envoyées à ${selectedEleves.length > 0 ? selectedEleves.length : 'tous les'} parents concernés`);
    setRelanceDialogOpen(false);
    setSelectedEleves([]);
  };

  const toggleSelectEleve = (id: string) => {
    setSelectedEleves(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const selectAllIncomplete = () => {
    const incompleteIds = filteredDossiers.filter(d => d.completude < 100).map(d => d.id);
    setSelectedEleves(incompleteIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents Élèves</h1>
          <p className="text-muted-foreground">Gestion complète des dossiers scolaires et pièces justificatives</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRelanceDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Relancer
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Téléverser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dossiers</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDossiers}</div>
            <p className="text-xs text-muted-foreground">Élèves inscrits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complets</CardTitle>
            <FolderCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complets}</div>
            <p className="text-xs text-muted-foreground">{((complets/totalDossiers)*100).toFixed(0)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplets</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{incomplets}</div>
            <p className="text-xs text-muted-foreground">{((incomplets/totalDossiers)*100).toFixed(0)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Fichiers stockés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{documentsEnAttente}</div>
            <p className="text-xs text-muted-foreground">À valider</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{documentsRejetes}</div>
            <p className="text-xs text-muted-foreground">À renvoyer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirés</CardTitle>
            <FileWarning className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{documentsExpires}</div>
            <p className="text-xs text-muted-foreground">À renouveler</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dossiers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dossiers">Dossiers Élèves</TabsTrigger>
          <TabsTrigger value="documents-requis">Documents Requis</TabsTrigger>
          <TabsTrigger value="activites">Activités Récentes</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="dossiers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>État des Dossiers</CardTitle>
                  <CardDescription>{filteredDossiers.length} dossier(s) trouvé(s)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {selectedEleves.length > 0 && (
                    <Badge variant="secondary">{selectedEleves.length} sélectionné(s)</Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={selectAllIncomplete}>
                    Sélectionner incomplets
                  </Button>
                  <DataTableFilters
                    filters={filterConfigs}
                    onFilterChange={setFilters}
                    searchPlaceholder="Rechercher par nom ou matricule..."
                  />
                  <DataTableExport
                    data={filteredDossiers}
                    columns={exportColumns}
                    filename="dossiers-eleves"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedEleves.length === filteredDossiers.length && filteredDossiers.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEleves(filteredDossiers.map(d => d.id));
                          } else {
                            setSelectedEleves([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Complétude</TableHead>
                    <TableHead>Alertes</TableHead>
                    <TableHead>Dernière MAJ</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((d) => (
                    <TableRow key={d.id} className={selectedEleves.includes(d.id) ? "bg-muted/50" : ""}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedEleves.includes(d.id)}
                          onCheckedChange={() => toggleSelectEleve(d.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{d.eleve}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{d.matricule}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{d.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{d.documents.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={d.completude} className="w-16 h-2" />
                          {getCompletudeBadge(d.completude)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {d.alertes > 0 ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {d.alertes}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            OK
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(d.derniereMaj).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedDossier(d); setDetailDialogOpen(true); }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir le dossier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Upload className="mr-2 h-4 w-4" />
                              Ajouter document
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger tout
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimer fiche
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Envoyer relance
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents-requis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Documents Requis</CardTitle>
                  <CardDescription>Configuration des pièces justificatives pour l'inscription</CardDescription>
                </div>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documentsRequis.map((doc) => (
                  <Card key={doc.id} className={doc.obligatoire ? "border-primary/50" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{doc.nom}</p>
                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                          </div>
                        </div>
                        <Badge variant={doc.obligatoire ? "destructive" : "secondary"}>
                          {doc.obligatoire ? "Obligatoire" : "Optionnel"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Format: {doc.format}</span>
                        <span className="text-muted-foreground">Max: {doc.taille}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activites" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historique des Activités</CardTitle>
                  <CardDescription>Dernières opérations sur les documents</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activitesRecentes.map((activite) => (
                  <div key={activite.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        activite.action === "Validation" ? "bg-green-100 text-green-600" :
                        activite.action === "Rejet" ? "bg-red-100 text-red-600" :
                        activite.action === "Téléversement" ? "bg-blue-100 text-blue-600" :
                        "bg-orange-100 text-orange-600"
                      }`}>
                        {activite.action === "Validation" ? <CheckCircle className="h-4 w-4" /> :
                         activite.action === "Rejet" ? <XCircle className="h-4 w-4" /> :
                         activite.action === "Téléversement" ? <Upload className="h-4 w-4" /> :
                         <Send className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{activite.action}: {activite.document}</p>
                        <p className="text-sm text-muted-foreground">{activite.eleve}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{activite.utilisateur}</p>
                      <p className="text-xs text-muted-foreground">{activite.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Terminale", "Première", "Seconde", "Troisième", "Quatrième", "Cinquième"].map((niveau) => {
                    const count = dossiers.filter(d => d.niveau === niveau).length;
                    const complete = dossiers.filter(d => d.niveau === niveau && d.completude === 100).length;
                    const percentage = count > 0 ? (complete / count) * 100 : 0;
                    return (
                      <div key={niveau} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{niveau}</span>
                          <span className="text-sm text-muted-foreground">{complete}/{count} complets</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentsRequis.slice(0, 5).map((docType) => {
                    const count = dossiers.reduce((sum, d) => 
                      sum + d.documents.filter(doc => doc.type === docType.type).length, 0
                    );
                    const valides = dossiers.reduce((sum, d) => 
                      sum + d.documents.filter(doc => doc.type === docType.type && doc.statut === 'valide').length, 0
                    );
                    return (
                      <div key={docType.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{docType.nom}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{count} reçus</Badge>
                          <Badge className="bg-green-100 text-green-700">{valides} validés</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Détail Dossier */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dossier de {selectedDossier?.eleve}</DialogTitle>
            <DialogDescription>
              Matricule: {selectedDossier?.matricule} | Classe: {selectedDossier?.classe}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Parent/Tuteur</p>
                  <p className="font-medium">{selectedDossier?.parent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selectedDossier?.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedDossier?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Complétude</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedDossier?.completude || 0} className="w-24 h-2" />
                    <span className="font-medium">{selectedDossier?.completude}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Documents du dossier</h4>
                <div className="space-y-2">
                  {selectedDossier?.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.nom}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.taille} • Ajouté le {new Date(doc.dateTelechargement).toLocaleDateString('fr-FR')}
                          </p>
                          {doc.commentaire && (
                            <p className="text-xs text-orange-600 mt-1">{doc.commentaire}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.statut)}
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Documents manquants</h4>
                <div className="space-y-2">
                  {documentsRequis.filter(req => 
                    !selectedDossier?.documents.some(doc => doc.type === req.type)
                  ).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-dashed rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <FilePlus className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.nom}</p>
                          <p className="text-xs text-muted-foreground">{doc.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.obligatoire ? "destructive" : "secondary"}>
                          {doc.obligatoire ? "Requis" : "Optionnel"}
                        </Badge>
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Fermer
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Télécharger tout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Upload */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Téléverser un Document</DialogTitle>
            <DialogDescription>
              Ajouter un document au dossier d'un élève
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Élève</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un élève" />
                </SelectTrigger>
                <SelectContent>
                  {dossiers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.eleve} ({d.classe})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type de document</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {documentsRequis.map((doc) => (
                    <SelectItem key={doc.id} value={doc.type}>{doc.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fichier</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Glissez-déposez ou cliquez pour sélectionner
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG (max 2MB)
                </p>
                <Input type="file" className="hidden" />
                <Button variant="outline" size="sm" className="mt-4">
                  Parcourir
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => { setUploadDialogOpen(false); toast.success("Document téléversé avec succès"); }}>
              Téléverser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Relance */}
      <Dialog open={relanceDialogOpen} onOpenChange={setRelanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer des Relances</DialogTitle>
            <DialogDescription>
              Envoyer des rappels aux parents pour les documents manquants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>{selectedEleves.length > 0 ? selectedEleves.length : incomplets}</strong> dossier(s) avec documents manquants
              </p>
            </div>
            <div className="space-y-2">
              <Label>Canal de communication</Label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email uniquement</SelectItem>
                  <SelectItem value="sms">SMS uniquement</SelectItem>
                  <SelectItem value="both">Email + SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message personnalisé (optionnel)</Label>
              <Input placeholder="Ajoutez un message personnalisé..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRelanceDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendRelance}>
              <Send className="mr-2 h-4 w-4" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
