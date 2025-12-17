import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  FileSignature, Upload, Send, Clock, CheckCircle2, XCircle, AlertTriangle,
  FileText, Users, Download, Eye, Trash2, Plus, Search, Filter,
  Pen, Stamp, ShieldCheck, Mail, Calendar, History, RefreshCw,
  Copy, MoreHorizontal, User, Building, Phone, ArrowRight
} from "lucide-react";

interface SignatureRequest {
  id: string;
  documentName: string;
  documentType: string;
  status: "draft" | "pending" | "signed" | "rejected" | "expired";
  createdAt: string;
  expiresAt: string;
  signers: Signer[];
  createdBy: string;
  priority: "normal" | "high" | "urgent";
}

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "pending" | "signed" | "rejected";
  signedAt?: string;
  order: number;
}

interface SignatureTemplate {
  id: string;
  name: string;
  description: string;
  fields: number;
  signers: number;
  usageCount: number;
}

const mockRequests: SignatureRequest[] = [
  {
    id: "1",
    documentName: "Contrat de travail - Jean Dupont",
    documentType: "Contrat",
    status: "pending",
    createdAt: "2024-01-15 09:00",
    expiresAt: "2024-01-22 09:00",
    createdBy: "Admin RH",
    priority: "high",
    signers: [
      { id: "1", name: "Jean Dupont", email: "jean.dupont@email.com", role: "Employé", status: "signed", signedAt: "2024-01-15 14:30", order: 1 },
      { id: "2", name: "Marie Martin", email: "marie.martin@ecole.ci", role: "DRH", status: "pending", order: 2 },
      { id: "3", name: "Pierre Kouassi", email: "pierre.kouassi@ecole.ci", role: "Directeur", status: "pending", order: 3 }
    ]
  },
  {
    id: "2",
    documentName: "Autorisation sortie scolaire",
    documentType: "Autorisation",
    status: "signed",
    createdAt: "2024-01-14 11:00",
    expiresAt: "2024-01-21 11:00",
    createdBy: "Secrétariat",
    priority: "normal",
    signers: [
      { id: "4", name: "Fatou Koné", email: "fatou.kone@parent.com", role: "Parent", status: "signed", signedAt: "2024-01-14 15:00", order: 1 },
      { id: "5", name: "Directeur Adjoint", email: "adjoint@ecole.ci", role: "Direction", status: "signed", signedAt: "2024-01-14 16:30", order: 2 }
    ]
  },
  {
    id: "3",
    documentName: "PV Conseil de discipline",
    documentType: "Procès-verbal",
    status: "pending",
    createdAt: "2024-01-13 14:00",
    expiresAt: "2024-01-20 14:00",
    createdBy: "Surveillant Général",
    priority: "urgent",
    signers: [
      { id: "6", name: "Surveillant Général", email: "surveillant@ecole.ci", role: "Surveillant", status: "signed", signedAt: "2024-01-13 15:00", order: 1 },
      { id: "7", name: "Professeur Principal", email: "prof@ecole.ci", role: "Enseignant", status: "signed", signedAt: "2024-01-13 16:00", order: 2 },
      { id: "8", name: "Directeur", email: "directeur@ecole.ci", role: "Direction", status: "pending", order: 3 }
    ]
  },
  {
    id: "4",
    documentName: "Certificat de scolarité",
    documentType: "Certificat",
    status: "signed",
    createdAt: "2024-01-12 10:00",
    expiresAt: "2024-01-19 10:00",
    createdBy: "Secrétariat",
    priority: "normal",
    signers: [
      { id: "9", name: "Directeur", email: "directeur@ecole.ci", role: "Direction", status: "signed", signedAt: "2024-01-12 11:30", order: 1 }
    ]
  },
  {
    id: "5",
    documentName: "Convention de stage",
    documentType: "Convention",
    status: "rejected",
    createdAt: "2024-01-11 09:00",
    expiresAt: "2024-01-18 09:00",
    createdBy: "Admin",
    priority: "normal",
    signers: [
      { id: "10", name: "Entreprise XYZ", email: "rh@xyz.com", role: "Entreprise", status: "rejected", signedAt: "2024-01-11 14:00", order: 1 }
    ]
  },
  {
    id: "6",
    documentName: "Attestation de travail",
    documentType: "Attestation",
    status: "draft",
    createdAt: "2024-01-10 08:00",
    expiresAt: "2024-01-17 08:00",
    createdBy: "Admin RH",
    priority: "normal",
    signers: []
  }
];

const mockTemplates: SignatureTemplate[] = [
  { id: "1", name: "Contrat CDI", description: "Modèle de contrat à durée indéterminée", fields: 12, signers: 3, usageCount: 45 },
  { id: "2", name: "Autorisation parentale", description: "Autorisation pour sortie scolaire", fields: 8, signers: 2, usageCount: 120 },
  { id: "3", name: "Certificat de scolarité", description: "Attestation d'inscription", fields: 5, signers: 1, usageCount: 89 },
  { id: "4", name: "Convention de stage", description: "Accord tripartite de stage", fields: 15, signers: 3, usageCount: 32 },
  { id: "5", name: "PV de réunion", description: "Procès-verbal standard", fields: 6, signers: 2, usageCount: 67 },
  { id: "6", name: "Attestation de travail", description: "Confirmation d'emploi", fields: 7, signers: 2, usageCount: 28 },
];

export default function SignatureElectronique() {
  const [requests, setRequests] = useState<SignatureRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showSignerDialog, setShowSignerDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    documentName: "",
    documentType: "",
    priority: "normal",
    expiresIn: "7"
  });
  const [newSigner, setNewSigner] = useState({ name: "", email: "", role: "" });
  const [signers, setSigners] = useState<Signer[]>([]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any; label: string }> = {
      draft: { variant: "secondary", icon: FileText, label: "Brouillon" },
      pending: { variant: "outline", icon: Clock, label: "En attente" },
      signed: { variant: "default", icon: CheckCircle2, label: "Signé" },
      rejected: { variant: "destructive", icon: XCircle, label: "Rejeté" },
      expired: { variant: "destructive", icon: AlertTriangle, label: "Expiré" }
    };
    const style = styles[status] || styles.draft;
    const Icon = style.icon;
    return (
      <Badge variant={style.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {style.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      normal: "bg-gray-100 text-gray-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };
    return (
      <Badge className={colors[priority]}>
        {priority === "normal" ? "Normal" : priority === "high" ? "Haute" : "Urgente"}
      </Badge>
    );
  };

  const getSignerStatusIcon = (status: string) => {
    switch (status) {
      case "signed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.documentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    signed: requests.filter(r => r.status === "signed").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    draft: requests.filter(r => r.status === "draft").length
  };

  const addSigner = () => {
    if (!newSigner.name || !newSigner.email) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const signer: Signer = {
      id: Date.now().toString(),
      name: newSigner.name,
      email: newSigner.email,
      role: newSigner.role,
      status: "pending",
      order: signers.length + 1
    };
    setSigners([...signers, signer]);
    setNewSigner({ name: "", email: "", role: "" });
  };

  const removeSigner = (id: string) => {
    setSigners(signers.filter(s => s.id !== id));
  };

  const createRequest = () => {
    if (!newRequest.documentName || signers.length === 0) {
      toast.error("Veuillez remplir tous les champs et ajouter au moins un signataire");
      return;
    }
    const request: SignatureRequest = {
      id: Date.now().toString(),
      documentName: newRequest.documentName,
      documentType: newRequest.documentType,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      expiresAt: new Date(Date.now() + parseInt(newRequest.expiresIn) * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " "),
      createdBy: "Admin",
      priority: newRequest.priority as "normal" | "high" | "urgent",
      signers: signers
    };
    setRequests([request, ...requests]);
    setNewRequest({ documentName: "", documentType: "", priority: "normal", expiresIn: "7" });
    setSigners([]);
    setShowNewRequestDialog(false);
    toast.success("Demande de signature créée et envoyée");
  };

  const sendReminder = (requestId: string) => {
    toast.success("Rappel envoyé aux signataires");
  };

  const deleteRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    toast.success("Demande supprimée");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Signature Électronique</h1>
          <p className="text-muted-foreground">Gérez vos demandes de signature de documents</p>
        </div>
        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une demande de signature</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Document Upload */}
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Glissez votre document ici ou</p>
                <Button variant="outline" size="sm">Parcourir</Button>
                <p className="text-xs text-muted-foreground mt-2">PDF, Word, Excel (max 25 Mo)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du document</Label>
                  <Input 
                    value={newRequest.documentName}
                    onChange={(e) => setNewRequest({...newRequest, documentName: e.target.value})}
                    placeholder="Contrat de travail..."
                  />
                </div>
                <div>
                  <Label>Type de document</Label>
                  <Select 
                    value={newRequest.documentType}
                    onValueChange={(v) => setNewRequest({...newRequest, documentType: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contrat">Contrat</SelectItem>
                      <SelectItem value="autorisation">Autorisation</SelectItem>
                      <SelectItem value="attestation">Attestation</SelectItem>
                      <SelectItem value="certificat">Certificat</SelectItem>
                      <SelectItem value="pv">Procès-verbal</SelectItem>
                      <SelectItem value="convention">Convention</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priorité</Label>
                  <Select 
                    value={newRequest.priority}
                    onValueChange={(v) => setNewRequest({...newRequest, priority: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Expire dans</Label>
                  <Select 
                    value={newRequest.expiresIn}
                    onValueChange={(v) => setNewRequest({...newRequest, expiresIn: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 jours</SelectItem>
                      <SelectItem value="7">7 jours</SelectItem>
                      <SelectItem value="14">14 jours</SelectItem>
                      <SelectItem value="30">30 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Signers */}
              <div>
                <Label className="mb-3 block">Signataires (dans l'ordre de signature)</Label>
                <div className="space-y-3">
                  {signers.map((signer, index) => (
                    <div key={signer.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{signer.name}</p>
                        <p className="text-xs text-muted-foreground">{signer.email} • {signer.role}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeSigner(signer.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Card className="mt-3">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Nom</Label>
                        <Input 
                          value={newSigner.name}
                          onChange={(e) => setNewSigner({...newSigner, name: e.target.value})}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input 
                          type="email"
                          value={newSigner.email}
                          onChange={(e) => setNewSigner({...newSigner, email: e.target.value})}
                          placeholder="jean@email.com"
                        />
                      </div>
                      <div>
                        <Label>Rôle</Label>
                        <Input 
                          value={newSigner.role}
                          onChange={(e) => setNewSigner({...newSigner, role: e.target.value})}
                          placeholder="Directeur"
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3" onClick={addSigner}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter ce signataire
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>Annuler</Button>
              <Button onClick={createRequest}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer pour signature
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total demandes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.signed}</p>
                <p className="text-xs text-muted-foreground">Signées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.draft}</p>
                <p className="text-xs text-muted-foreground">Brouillons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Demandes de signature</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Demandes en cours</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-10 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="signed">Signées</SelectItem>
                      <SelectItem value="rejected">Rejetées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 border-b">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                              <FileSignature className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.documentName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{request.documentType}</Badge>
                                {getStatusBadge(request.status)}
                                {getPriorityBadge(request.priority)}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Créé le {request.createdAt}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Expire le {request.expiresAt.split(" ")[0]}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  Par {request.createdBy}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.status === "pending" && (
                              <Button variant="outline" size="sm" onClick={() => sendReminder(request.id)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Relancer
                              </Button>
                            )}
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteRequest(request.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Signers Progress */}
                      <div className="p-4 bg-muted/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Signataires ({request.signers.filter(s => s.status === "signed").length}/{request.signers.length})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.signers.map((signer, index) => (
                            <div key={signer.id} className="flex items-center">
                              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                signer.status === "signed" ? "bg-green-100" :
                                signer.status === "rejected" ? "bg-red-100" : "bg-orange-100"
                              }`}>
                                {getSignerStatusIcon(signer.status)}
                                <div>
                                  <p className="text-sm font-medium">{signer.name}</p>
                                  <p className="text-xs text-muted-foreground">{signer.role}</p>
                                </div>
                              </div>
                              {index < request.signers.length - 1 && (
                                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <FileSignature className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune demande trouvée</p>
                    <Button className="mt-4" onClick={() => setShowNewRequestDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle demande
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Modèles de signature</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un modèle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {mockTemplates.map(template => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{template.usageCount} utilisations</Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Pen className="h-3 w-3" />
                          {template.fields} champs
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {template.signers} signataires
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button size="sm" className="flex-1">
                          Utiliser
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des signatures</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Signataires</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Date signature</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.filter(r => r.status === "signed" || r.status === "rejected").map(request => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.documentName}</TableCell>
                      <TableCell><Badge variant="secondary">{request.documentType}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {request.signers.length}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{request.createdAt}</TableCell>
                      <TableCell>
                        {request.signers.find(s => s.signedAt)?.signedAt || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
