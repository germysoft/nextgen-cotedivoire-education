import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, Search, Plus, CheckCircle, XCircle, Clock,
  User, AlertCircle, FileText, Edit, Trash2, Eye, Download
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

interface Conge {
  id: number;
  employe: string;
  poste: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  jours: number;
  statut: string;
  remplacement: string | null;
  motif?: string;
  contact?: string;
}

interface Absence {
  id: number;
  employe: string;
  date: string;
  type: string;
  motif: string;
  justificatif: boolean;
  heureArrivee?: string;
  observations?: string;
}

interface SoldeConge {
  id: number;
  nom: string;
  poste: string;
  acquis: number;
  pris: number;
  solde: number;
  reportN1: number;
}

const initialConges: Conge[] = [
  { id: 1, employe: "M. KOFFI Yao", poste: "Enseignant Math", type: "Congé Annuel", dateDebut: "2024-12-20", dateFin: "2025-01-05", jours: 12, statut: "Approuvé", remplacement: "M. DIABY", motif: "Vacances familiales", contact: "+225 07 12 34 56" },
  { id: 2, employe: "Mme DIALLO Fatoumata", poste: "Enseignant Français", type: "Congé Maladie", dateDebut: "2024-12-15", dateFin: "2024-12-18", jours: 3, statut: "Approuvé", remplacement: "Mme SANOGO", motif: "Intervention chirurgicale", contact: "+225 05 98 76 54" },
  { id: 3, employe: "M. TOURÉ Mohamed", poste: "Enseignant Physique", type: "Congé Annuel", dateDebut: "2024-12-22", dateFin: "2025-01-08", jours: 14, statut: "En attente", remplacement: null, motif: "Voyage à l'étranger", contact: "+225 01 23 45 67" },
  { id: 4, employe: "Mme BAMBA Sarah", poste: "Secrétaire", type: "Congé Maternité", dateDebut: "2025-01-01", dateFin: "2025-04-01", jours: 90, statut: "Approuvé", remplacement: "Mme YAO", motif: "Maternité", contact: "+225 07 89 01 23" },
  { id: 5, employe: "M. KONE Ibrahim", poste: "Enseignant SVT", type: "Congé Annuel", dateDebut: "2024-12-18", dateFin: "2024-12-20", jours: 2, statut: "Rejeté", remplacement: null, motif: "Raisons personnelles", contact: "+225 05 67 89 01" },
];

const initialAbsences: Absence[] = [
  { id: 1, employe: "M. KOUADIO Jean", date: "2024-12-15", type: "Absence Justifiée", motif: "Rendez-vous médical", justificatif: true, observations: "Certificat médical fourni" },
  { id: 2, employe: "Mme TRAORE Aminata", date: "2024-12-14", type: "Absence Non Justifiée", motif: "-", justificatif: false, observations: "À convoquer pour explication" },
  { id: 3, employe: "M. YAO Marcel", date: "2024-12-13", type: "Retard", motif: "Embouteillage", justificatif: false, heureArrivee: "08:45", observations: "Retard de 45 minutes" },
  { id: 4, employe: "Mme OUATTARA Prisca", date: "2024-12-12", type: "Absence Justifiée", motif: "Décès familial", justificatif: true, observations: "Acte de décès présenté" },
];

const initialSoldes: SoldeConge[] = [
  { id: 1, nom: "M. KOFFI Yao", poste: "Enseignant Math", acquis: 30, pris: 14, solde: 16, reportN1: 5 },
  { id: 2, nom: "Mme DIALLO Fatoumata", poste: "Enseignant Français", acquis: 30, pris: 8, solde: 22, reportN1: 3 },
  { id: 3, nom: "M. TOURÉ Mohamed", poste: "Enseignant Physique", acquis: 30, pris: 5, solde: 25, reportN1: 0 },
  { id: 4, nom: "Mme BAMBA Sarah", poste: "Secrétaire", acquis: 30, pris: 90, solde: -60, reportN1: 0 },
  { id: 5, nom: "M. KONE Ibrahim", poste: "Enseignant SVT", acquis: 30, pris: 12, solde: 18, reportN1: 8 },
];

const typesConge = [
  "Congé Annuel",
  "Congé Maladie",
  "Congé Maternité",
  "Congé Paternité",
  "Congé Sans Solde",
  "Congé Exceptionnel",
  "Récupération",
  "Formation"
];

const personnelList = [
  { id: 1, nom: "M. KOFFI Yao", poste: "Enseignant Math" },
  { id: 2, nom: "Mme DIALLO Fatoumata", poste: "Enseignant Français" },
  { id: 3, nom: "M. TOURÉ Mohamed", poste: "Enseignant Physique" },
  { id: 4, nom: "Mme BAMBA Sarah", poste: "Secrétaire" },
  { id: 5, nom: "M. KONE Ibrahim", poste: "Enseignant SVT" },
  { id: 6, nom: "M. KOUADIO Jean", poste: "Enseignant Histoire" },
  { id: 7, nom: "Mme TRAORE Aminata", poste: "Enseignant Anglais" },
];

export default function Conges() {
  const [conges, setConges] = useState<Conge[]>(initialConges);
  const [absences, setAbsences] = useState<Absence[]>(initialAbsences);
  const [soldes] = useState<SoldeConge[]>(initialSoldes);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [viewCongeOpen, setViewCongeOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewAbsenceOpen, setViewAbsenceOpen] = useState(false);
  const [editAbsenceOpen, setEditAbsenceOpen] = useState(false);
  
  // Selected items
  const [selectedConge, setSelectedConge] = useState<Conge | null>(null);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  // Form state for new request
  const [requestForm, setRequestForm] = useState({
    employe: "",
    poste: "",
    type: "",
    dateDebut: "",
    dateFin: "",
    motif: "",
    contact: "",
    remplacement: ""
  });

  // Form state for absence edit
  const [absenceForm, setAbsenceForm] = useState({
    type: "",
    motif: "",
    justificatif: false,
    heureArrivee: "",
    observations: ""
  });

  const stats = {
    enCours: conges.filter(c => c.statut === "Approuvé").length,
    enAttente: conges.filter(c => c.statut === "En attente").length,
    approuves: conges.filter(c => c.statut === "Approuvé").length,
    rejetes: conges.filter(c => c.statut === "Rejeté").length,
  };

  // Calculate days between dates
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Handle new request submission
  const handleSubmitRequest = () => {
    if (!requestForm.employe || !requestForm.type || !requestForm.dateDebut || !requestForm.dateFin) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const personnel = personnelList.find(p => p.nom === requestForm.employe);
    const jours = calculateDays(requestForm.dateDebut, requestForm.dateFin);
    
    const newConge: Conge = {
      id: Math.max(...conges.map(c => c.id)) + 1,
      employe: requestForm.employe,
      poste: personnel?.poste || requestForm.poste,
      type: requestForm.type,
      dateDebut: requestForm.dateDebut,
      dateFin: requestForm.dateFin,
      jours,
      statut: "En attente",
      remplacement: requestForm.remplacement || null,
      motif: requestForm.motif,
      contact: requestForm.contact
    };

    setConges(prev => [newConge, ...prev]);
    toast.success(`Demande de congé créée pour ${requestForm.employe}`, {
      description: `${requestForm.type} - ${jours} jours`
    });
    setNewRequestOpen(false);
    resetRequestForm();
  };

  const resetRequestForm = () => {
    setRequestForm({
      employe: "",
      poste: "",
      type: "",
      dateDebut: "",
      dateFin: "",
      motif: "",
      contact: "",
      remplacement: ""
    });
  };

  // Approve leave request
  const handleApprove = (conge: Conge) => {
    setConges(prev => prev.map(c => 
      c.id === conge.id ? { ...c, statut: "Approuvé" } : c
    ));
    toast.success(`Congé approuvé pour ${conge.employe}`, {
      description: `Du ${formatDate(conge.dateDebut)} au ${formatDate(conge.dateFin)}`
    });
  };

  // Open reject dialog
  const openRejectDialog = (conge: Conge) => {
    setSelectedConge(conge);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  // Confirm rejection
  const handleConfirmReject = () => {
    if (!selectedConge) return;
    
    setConges(prev => prev.map(c => 
      c.id === selectedConge.id ? { ...c, statut: "Rejeté" } : c
    ));
    toast.error(`Congé rejeté pour ${selectedConge.employe}`, {
      description: rejectReason || "Demande non approuvée"
    });
    setRejectDialogOpen(false);
    setSelectedConge(null);
  };

  // View leave details
  const handleViewConge = (conge: Conge) => {
    setSelectedConge(conge);
    setViewCongeOpen(true);
  };

  // View absence details
  const handleViewAbsence = (absence: Absence) => {
    setSelectedAbsence(absence);
    setViewAbsenceOpen(true);
  };

  // Edit absence
  const handleEditAbsence = (absence: Absence) => {
    setSelectedAbsence(absence);
    setAbsenceForm({
      type: absence.type,
      motif: absence.motif,
      justificatif: absence.justificatif,
      heureArrivee: absence.heureArrivee || "",
      observations: absence.observations || ""
    });
    setEditAbsenceOpen(true);
  };

  // Save absence edit
  const handleSaveAbsence = () => {
    if (!selectedAbsence) return;
    
    setAbsences(prev => prev.map(a => 
      a.id === selectedAbsence.id 
        ? { ...a, ...absenceForm }
        : a
    ));
    
    toast.success(`Absence de ${selectedAbsence.employe} mise à jour`);
    setEditAbsenceOpen(false);
    setSelectedAbsence(null);
  };

  // Delete absence
  const handleDeleteAbsence = (id: number) => {
    setAbsences(prev => prev.filter(a => a.id !== id));
    toast.success("Absence supprimée");
    setViewAbsenceOpen(false);
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Filter conges by search
  const filteredConges = conges.filter(c => 
    c.employe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Congés & Absences</h1>
          <p className="text-muted-foreground">Gestion des demandes et suivi des présences</p>
        </div>
        <Button onClick={() => setNewRequestOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Demande
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
            <p className="text-xs text-muted-foreground">Congés actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approuves}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejetes}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="absences">Absences</TabsTrigger>
          <TabsTrigger value="soldes">Soldes de Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="conges">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Demandes de Congés</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Jours</TableHead>
                    <TableHead>Remplacement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConges.map((conge) => (
                    <TableRow key={conge.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{conge.employe}</span>
                        </div>
                      </TableCell>
                      <TableCell>{conge.poste}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{conge.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <span>Du {formatDate(conge.dateDebut)}</span>
                          <span className="text-muted-foreground">Au {formatDate(conge.dateFin)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{conge.jours} jours</Badge>
                      </TableCell>
                      <TableCell>
                        {conge.remplacement ? (
                          <span className="text-sm">{conge.remplacement}</span>
                        ) : (
                          <Badge variant="secondary">Non assigné</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {conge.statut === "Approuvé" && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Approuvé
                          </Badge>
                        )}
                        {conge.statut === "En attente" && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            En attente
                          </Badge>
                        )}
                        {conge.statut === "Rejeté" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Rejeté
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewConge(conge)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {conge.statut === "En attente" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleApprove(conge)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => openRejectDialog(conge)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
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

        <TabsContent value="absences">
          <Card>
            <CardHeader>
              <CardTitle>Absences & Retards Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Justificatif</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">{absence.employe}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(absence.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          absence.type === "Absence Non Justifiée" ? "destructive" :
                          absence.type === "Retard" ? "default" :
                          "secondary"
                        }>
                          {absence.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{absence.motif}</TableCell>
                      <TableCell>
                        {absence.justificatif ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Oui
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Non
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewAbsence(absence)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditAbsence(absence)}
                          >
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="soldes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Soldes de Congés par Employé</CardTitle>
                  <CardDescription>Récapitulatif des jours acquis, pris et restants</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {soldes.map((solde) => (
                  <Card key={solde.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium">{solde.nom}</span>
                          <p className="text-sm text-muted-foreground">{solde.poste}</p>
                        </div>
                        <Badge variant={solde.solde >= 15 ? "default" : solde.solde >= 0 ? "secondary" : "destructive"}>
                          Solde: {solde.solde} jours
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                          <p className="text-xs text-muted-foreground">Acquis</p>
                          <p className="text-lg font-bold text-blue-600">{solde.acquis}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                          <p className="text-xs text-muted-foreground">Report N-1</p>
                          <p className="text-lg font-bold text-purple-600">{solde.reportN1}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                          <p className="text-xs text-muted-foreground">Pris</p>
                          <p className="text-lg font-bold text-orange-600">{solde.pris}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950">
                          <p className="text-xs text-muted-foreground">Restant</p>
                          <p className={`text-lg font-bold ${solde.solde >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {solde.solde}
                          </p>
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

      {/* New Request Dialog */}
      <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Demande de Congé</DialogTitle>
            <DialogDescription>
              Créer une nouvelle demande de congé pour un membre du personnel
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employé *</Label>
                <Select 
                  value={requestForm.employe}
                  onValueChange={(value) => {
                    const personnel = personnelList.find(p => p.nom === value);
                    setRequestForm(prev => ({ 
                      ...prev, 
                      employe: value,
                      poste: personnel?.poste || ""
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé..." />
                  </SelectTrigger>
                  <SelectContent>
                    {personnelList.map(p => (
                      <SelectItem key={p.id} value={p.nom}>
                        {p.nom} - {p.poste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type de congé *</Label>
                <Select 
                  value={requestForm.type}
                  onValueChange={(value) => setRequestForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {typesConge.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début *</Label>
                <Input 
                  type="date"
                  value={requestForm.dateDebut}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, dateDebut: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin *</Label>
                <Input 
                  type="date"
                  value={requestForm.dateFin}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, dateFin: e.target.value }))}
                />
              </div>
            </div>

            {requestForm.dateDebut && requestForm.dateFin && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durée calculée:</span>
                  <Badge variant="default">
                    {calculateDays(requestForm.dateDebut, requestForm.dateFin)} jours
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Remplaçant (optionnel)</Label>
                <Select 
                  value={requestForm.remplacement}
                  onValueChange={(value) => setRequestForm(prev => ({ ...prev, remplacement: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un remplaçant..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun</SelectItem>
                    {personnelList
                      .filter(p => p.nom !== requestForm.employe)
                      .map(p => (
                        <SelectItem key={p.id} value={p.nom}>{p.nom}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact pendant le congé</Label>
                <Input 
                  placeholder="+225 XX XX XX XX"
                  value={requestForm.contact}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Motif de la demande</Label>
              <Textarea 
                placeholder="Décrivez la raison de votre demande de congé..."
                value={requestForm.motif}
                onChange={(e) => setRequestForm(prev => ({ ...prev, motif: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRequestOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitRequest}>
              <Plus className="mr-2 h-4 w-4" />
              Soumettre la Demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Leave Details Dialog */}
      <Dialog open={viewCongeOpen} onOpenChange={setViewCongeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du Congé</DialogTitle>
            <DialogDescription>
              Informations complètes sur la demande de congé
            </DialogDescription>
          </DialogHeader>
          {selectedConge && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <User className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{selectedConge.employe}</p>
                  <p className="text-sm text-muted-foreground">{selectedConge.poste}</p>
                </div>
                <div className="ml-auto">
                  {selectedConge.statut === "Approuvé" && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Approuvé
                    </Badge>
                  )}
                  {selectedConge.statut === "En attente" && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      En attente
                    </Badge>
                  )}
                  {selectedConge.statut === "Rejeté" && (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Rejeté
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type de congé</p>
                  <Badge variant="outline">{selectedConge.type}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <Badge>{selectedConge.jours} jours</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date de début</p>
                  <p className="font-medium">{formatDate(selectedConge.dateDebut)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date de fin</p>
                  <p className="font-medium">{formatDate(selectedConge.dateFin)}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Motif</p>
                <p className="font-medium">{selectedConge.motif || "Non spécifié"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Remplaçant</p>
                  <p className="font-medium">{selectedConge.remplacement || "Non assigné"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedConge.contact || "Non renseigné"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCongeOpen(false)}>
              Fermer
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la Demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir rejeter cette demande de congé ?
            </DialogDescription>
          </DialogHeader>
          {selectedConge && (
            <div className="py-4">
              <div className="p-3 bg-muted rounded-lg mb-4">
                <p className="font-medium">{selectedConge.employe}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedConge.type} - {selectedConge.jours} jours
                </p>
              </div>
              <div className="space-y-2">
                <Label>Motif du rejet (optionnel)</Label>
                <Textarea 
                  placeholder="Indiquez la raison du rejet..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmReject}>
              <XCircle className="mr-2 h-4 w-4" />
              Confirmer le Rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Absence Details Dialog */}
      <Dialog open={viewAbsenceOpen} onOpenChange={setViewAbsenceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'Absence</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'absence
            </DialogDescription>
          </DialogHeader>
          {selectedAbsence && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <User className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{selectedAbsence.employe}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedAbsence.date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant={
                    selectedAbsence.type === "Absence Non Justifiée" ? "destructive" :
                    selectedAbsence.type === "Retard" ? "default" : "secondary"
                  }>
                    {selectedAbsence.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Justificatif</p>
                  {selectedAbsence.justificatif ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Fourni
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Absent
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Motif</p>
                <p className="font-medium">{selectedAbsence.motif}</p>
              </div>

              {selectedAbsence.heureArrivee && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Heure d'arrivée</p>
                  <p className="font-medium">{selectedAbsence.heureArrivee}</p>
                </div>
              )}

              {selectedAbsence.observations && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Observations</p>
                  <p className="font-medium">{selectedAbsence.observations}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => selectedAbsence && handleDeleteAbsence(selectedAbsence.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setViewAbsenceOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                if (selectedAbsence) {
                  handleEditAbsence(selectedAbsence);
                  setViewAbsenceOpen(false);
                }
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Absence Dialog */}
      <Dialog open={editAbsenceOpen} onOpenChange={setEditAbsenceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'Absence</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'absence de {selectedAbsence?.employe}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type d'absence</Label>
              <Select 
                value={absenceForm.type}
                onValueChange={(value) => setAbsenceForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Absence Justifiée">Absence Justifiée</SelectItem>
                  <SelectItem value="Absence Non Justifiée">Absence Non Justifiée</SelectItem>
                  <SelectItem value="Retard">Retard</SelectItem>
                  <SelectItem value="Maladie">Maladie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Motif</Label>
              <Input 
                value={absenceForm.motif}
                onChange={(e) => setAbsenceForm(prev => ({ ...prev, motif: e.target.value }))}
              />
            </div>

            {absenceForm.type === "Retard" && (
              <div className="space-y-2">
                <Label>Heure d'arrivée</Label>
                <Input 
                  type="time"
                  value={absenceForm.heureArrivee}
                  onChange={(e) => setAbsenceForm(prev => ({ ...prev, heureArrivee: e.target.value }))}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="justificatif"
                checked={absenceForm.justificatif}
                onChange={(e) => setAbsenceForm(prev => ({ ...prev, justificatif: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="justificatif">Justificatif fourni</Label>
            </div>

            <div className="space-y-2">
              <Label>Observations</Label>
              <Textarea 
                value={absenceForm.observations}
                onChange={(e) => setAbsenceForm(prev => ({ ...prev, observations: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAbsenceOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveAbsence}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
