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
import { toast } from "sonner";
import {
  Calendar, Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2,
  FileText, Users, Clock, CheckCircle2, XCircle, AlertTriangle, Printer,
  Send, Video, MapPin, Building, Clipboard, FileCheck, PenTool, Share2,
  ChevronRight, MoreHorizontal, Mail
} from "lucide-react";

interface Reunion {
  id: string;
  reference: string;
  titre: string;
  type: "apel" | "conseil" | "partenaires" | "direction" | "pedagogique";
  date: string;
  heure: string;
  lieu: string;
  format: "presentiel" | "visio" | "hybride";
  organisateur: string;
  participants: Participant[];
  ordreJour: string[];
  statut: "planifiee" | "en_cours" | "terminee" | "annulee";
  pvStatut: "non_redige" | "brouillon" | "valide" | "diffuse";
  pvUrl?: string;
  decisions?: string[];
}

interface Participant {
  id: string;
  nom: string;
  fonction: string;
  email: string;
  presence: "confirme" | "en_attente" | "absent" | "excuse";
}

interface ProcesVerbal {
  id: string;
  reunionId: string;
  reunionTitre: string;
  date: string;
  redacteur: string;
  statut: "brouillon" | "en_revision" | "valide" | "diffuse";
  dateValidation?: string;
  validePar?: string;
  contenu: string;
  decisions: string[];
  signataires: { nom: string; signe: boolean; dateSig?: string }[];
}

const mockReunions: Reunion[] = [
  {
    id: "1",
    reference: "REU2024-001",
    titre: "Assemblée Générale APEL",
    type: "apel",
    date: "2024-01-20",
    heure: "14:00",
    lieu: "Salle polyvalente",
    format: "presentiel",
    organisateur: "M. Koné Yao",
    participants: [
      { id: "1", nom: "M. Koné Yao", fonction: "Président APEL", email: "kone@email.com", presence: "confirme" },
      { id: "2", nom: "Mme Diallo Fatou", fonction: "Secrétaire", email: "diallo@email.com", presence: "confirme" },
      { id: "3", nom: "M. Traoré Ibrahim", fonction: "Trésorier", email: "traore@email.com", presence: "en_attente" },
    ],
    ordreJour: ["Approbation du PV précédent", "Bilan financier", "Projets 2024", "Questions diverses"],
    statut: "planifiee",
    pvStatut: "non_redige"
  },
  {
    id: "2",
    reference: "REU2024-002",
    titre: "Conseil de Direction",
    type: "direction",
    date: "2024-01-18",
    heure: "10:00",
    lieu: "Bureau du Directeur",
    format: "presentiel",
    organisateur: "Directeur",
    participants: [
      { id: "4", nom: "Directeur", fonction: "Direction", email: "dir@ecole.ci", presence: "confirme" },
      { id: "5", nom: "Directeur Adjoint", fonction: "Direction", email: "adj@ecole.ci", presence: "confirme" },
      { id: "6", nom: "Surveillant Général", fonction: "Administration", email: "surv@ecole.ci", presence: "confirme" },
    ],
    ordreJour: ["Bilan du trimestre", "Planning examens", "Discipline"],
    statut: "terminee",
    pvStatut: "valide",
    decisions: ["Renforcement surveillance", "Report examens blancs"]
  },
  {
    id: "3",
    reference: "REU2024-003",
    titre: "Réunion Partenaires Orange CI",
    type: "partenaires",
    date: "2024-01-15",
    heure: "15:00",
    lieu: "Visioconférence",
    format: "visio",
    organisateur: "Responsable Partenariats",
    participants: [
      { id: "7", nom: "M. Bamba", fonction: "Responsable RSE Orange", email: "bamba@orange.ci", presence: "confirme" },
      { id: "8", nom: "Directeur", fonction: "Direction École", email: "dir@ecole.ci", presence: "confirme" },
    ],
    ordreJour: ["Renouvellement convention", "Extension fibre optique", "Formation enseignants"],
    statut: "terminee",
    pvStatut: "diffuse",
    decisions: ["Convention renouvelée 3 ans", "Installation fibre Q1 2024"]
  },
  {
    id: "4",
    reference: "REU2024-004",
    titre: "Conseil Pédagogique",
    type: "pedagogique",
    date: "2024-01-12",
    heure: "09:00",
    lieu: "Salle des professeurs",
    format: "presentiel",
    organisateur: "Coordinateur Pédagogique",
    participants: [],
    ordreJour: ["Harmonisation programmes", "Évaluations", "Sorties pédagogiques"],
    statut: "terminee",
    pvStatut: "valide"
  },
];

const mockPVs: ProcesVerbal[] = [
  {
    id: "1",
    reunionId: "2",
    reunionTitre: "Conseil de Direction",
    date: "2024-01-18",
    redacteur: "Secrétaire Direction",
    statut: "valide",
    dateValidation: "2024-01-19",
    validePar: "Directeur",
    contenu: "Le conseil s'est réuni pour discuter du bilan trimestriel...",
    decisions: ["Renforcement de la surveillance aux heures de pause", "Report des examens blancs au 15 février"],
    signataires: [
      { nom: "Directeur", signe: true, dateSig: "2024-01-19" },
      { nom: "Directeur Adjoint", signe: true, dateSig: "2024-01-19" },
      { nom: "Surveillant Général", signe: false }
    ]
  },
  {
    id: "2",
    reunionId: "3",
    reunionTitre: "Réunion Partenaires Orange CI",
    date: "2024-01-15",
    redacteur: "Responsable Partenariats",
    statut: "diffuse",
    dateValidation: "2024-01-16",
    validePar: "Directeur",
    contenu: "Réunion de renouvellement du partenariat avec Orange CI...",
    decisions: ["Convention renouvelée pour 3 ans", "Installation fibre optique prévue Q1 2024", "Formation 20 enseignants aux outils numériques"],
    signataires: [
      { nom: "Directeur", signe: true, dateSig: "2024-01-16" },
      { nom: "M. Bamba (Orange)", signe: true, dateSig: "2024-01-16" }
    ]
  },
];

export default function ReunionsPV() {
  const [reunions, setReunions] = useState<Reunion[]>(mockReunions);
  const [pvs, setPVs] = useState<ProcesVerbal[]>(mockPVs);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showNewReunionDialog, setShowNewReunionDialog] = useState(false);
  const [showPVDialog, setShowPVDialog] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState<Reunion | null>(null);
  const [selectedPV, setSelectedPV] = useState<ProcesVerbal | null>(null);
  const [newReunion, setNewReunion] = useState({
    titre: "",
    type: "",
    date: "",
    heure: "",
    lieu: "",
    format: "presentiel",
    ordreJour: ""
  });

  const getTypeBadge = (type: string) => {
    const styles: Record<string, { color: string; label: string }> = {
      apel: { color: "bg-blue-100 text-blue-800", label: "APEL" },
      conseil: { color: "bg-purple-100 text-purple-800", label: "Conseil" },
      partenaires: { color: "bg-green-100 text-green-800", label: "Partenaires" },
      direction: { color: "bg-orange-100 text-orange-800", label: "Direction" },
      pedagogique: { color: "bg-yellow-100 text-yellow-800", label: "Pédagogique" }
    };
    const style = styles[type] || styles.conseil;
    return <Badge className={style.color}>{style.label}</Badge>;
  };

  const getStatusBadge = (statut: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any; label: string }> = {
      planifiee: { variant: "outline", icon: Clock, label: "Planifiée" },
      en_cours: { variant: "secondary", icon: Video, label: "En cours" },
      terminee: { variant: "default", icon: CheckCircle2, label: "Terminée" },
      annulee: { variant: "destructive", icon: XCircle, label: "Annulée" }
    };
    const style = styles[statut] || styles.planifiee;
    const Icon = style.icon;
    return (
      <Badge variant={style.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {style.label}
      </Badge>
    );
  };

  const getPVStatusBadge = (statut: string) => {
    const styles: Record<string, { color: string; label: string }> = {
      non_redige: { color: "bg-gray-100 text-gray-800", label: "Non rédigé" },
      brouillon: { color: "bg-yellow-100 text-yellow-800", label: "Brouillon" },
      en_revision: { color: "bg-orange-100 text-orange-800", label: "En révision" },
      valide: { color: "bg-green-100 text-green-800", label: "Validé" },
      diffuse: { color: "bg-blue-100 text-blue-800", label: "Diffusé" }
    };
    const style = styles[statut] || styles.non_redige;
    return <Badge className={style.color}>{style.label}</Badge>;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "visio": return <Video className="h-4 w-4 text-blue-500" />;
      case "hybride": return <Users className="h-4 w-4 text-purple-500" />;
      default: return <MapPin className="h-4 w-4 text-green-500" />;
    }
  };

  const filteredReunions = reunions.filter(r => {
    const matchesSearch = r.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const createReunion = () => {
    if (!newReunion.titre || !newReunion.date) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const reunion: Reunion = {
      id: Date.now().toString(),
      reference: `REU2024-${(reunions.length + 1).toString().padStart(3, '0')}`,
      titre: newReunion.titre,
      type: newReunion.type as any,
      date: newReunion.date,
      heure: newReunion.heure,
      lieu: newReunion.lieu,
      format: newReunion.format as any,
      organisateur: "Admin",
      participants: [],
      ordreJour: newReunion.ordreJour.split('\n').filter(l => l.trim()),
      statut: "planifiee",
      pvStatut: "non_redige"
    };
    setReunions([reunion, ...reunions]);
    setNewReunion({ titre: "", type: "", date: "", heure: "", lieu: "", format: "presentiel", ordreJour: "" });
    setShowNewReunionDialog(false);
    toast.success("Réunion planifiée avec succès");
  };

  const sendConvocations = (reunionId: string) => {
    toast.success("Convocations envoyées par email aux participants");
  };

  const generatePV = (reunionId: string) => {
    const reunion = reunions.find(r => r.id === reunionId);
    if (reunion) {
      setReunions(reunions.map(r => 
        r.id === reunionId ? { ...r, pvStatut: "brouillon" } : r
      ));
      toast.success("Modèle de PV généré, prêt à être complété");
    }
  };

  const validatePV = (pvId: string) => {
    setPVs(pvs.map(p => 
      p.id === pvId ? { ...p, statut: "valide", dateValidation: new Date().toISOString().split('T')[0], validePar: "Directeur" } : p
    ));
    toast.success("PV validé avec succès");
  };

  const diffusePV = (pvId: string) => {
    setPVs(pvs.map(p => 
      p.id === pvId ? { ...p, statut: "diffuse" } : p
    ));
    toast.success("PV diffusé aux participants");
  };

  const stats = {
    total: reunions.length,
    planifiees: reunions.filter(r => r.statut === "planifiee").length,
    terminees: reunions.filter(r => r.statut === "terminee").length,
    pvEnAttente: reunions.filter(r => r.pvStatut === "non_redige" || r.pvStatut === "brouillon").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Réunions & Procès-Verbaux</h1>
          <p className="text-muted-foreground">Gestion des réunions et documentation officielle</p>
        </div>
        <Dialog open={showNewReunionDialog} onOpenChange={setShowNewReunionDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réunion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Planifier une réunion</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Titre de la réunion *</Label>
                <Input 
                  value={newReunion.titre}
                  onChange={(e) => setNewReunion({...newReunion, titre: e.target.value})}
                  placeholder="Ex: Assemblée Générale APEL"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={newReunion.type} onValueChange={(v) => setNewReunion({...newReunion, type: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apel">APEL</SelectItem>
                    <SelectItem value="conseil">Conseil</SelectItem>
                    <SelectItem value="partenaires">Partenaires</SelectItem>
                    <SelectItem value="direction">Direction</SelectItem>
                    <SelectItem value="pedagogique">Pédagogique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Format</Label>
                <Select value={newReunion.format} onValueChange={(v) => setNewReunion({...newReunion, format: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presentiel">Présentiel</SelectItem>
                    <SelectItem value="visio">Visioconférence</SelectItem>
                    <SelectItem value="hybride">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date *</Label>
                <Input 
                  type="date"
                  value={newReunion.date}
                  onChange={(e) => setNewReunion({...newReunion, date: e.target.value})}
                />
              </div>
              <div>
                <Label>Heure</Label>
                <Input 
                  type="time"
                  value={newReunion.heure}
                  onChange={(e) => setNewReunion({...newReunion, heure: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label>Lieu / Lien visio</Label>
                <Input 
                  value={newReunion.lieu}
                  onChange={(e) => setNewReunion({...newReunion, lieu: e.target.value})}
                  placeholder="Salle de réunion ou lien Zoom/Teams"
                />
              </div>
              <div className="col-span-2">
                <Label>Ordre du jour (un point par ligne)</Label>
                <Textarea 
                  value={newReunion.ordreJour}
                  onChange={(e) => setNewReunion({...newReunion, ordreJour: e.target.value})}
                  placeholder="1. Approbation du PV précédent&#10;2. Bilan financier&#10;3. Questions diverses"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewReunionDialog(false)}>Annuler</Button>
              <Button onClick={createReunion}>
                <Calendar className="h-4 w-4 mr-2" />
                Planifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total réunions</p>
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
                <p className="text-2xl font-bold">{stats.planifiees}</p>
                <p className="text-xs text-muted-foreground">Planifiées</p>
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
                <p className="text-2xl font-bold">{stats.terminees}</p>
                <p className="text-xs text-muted-foreground">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pvEnAttente}</p>
                <p className="text-xs text-muted-foreground">PV en attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reunions">
        <TabsList>
          <TabsTrigger value="reunions">Réunions</TabsTrigger>
          <TabsTrigger value="pv">Procès-Verbaux</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="reunions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des réunions</CardTitle>
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
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="apel">APEL</SelectItem>
                      <SelectItem value="conseil">Conseil</SelectItem>
                      <SelectItem value="partenaires">Partenaires</SelectItem>
                      <SelectItem value="direction">Direction</SelectItem>
                      <SelectItem value="pedagogique">Pédagogique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReunions.map(reunion => (
                  <Card key={reunion.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            {getFormatIcon(reunion.format)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{reunion.titre}</h3>
                              {getTypeBadge(reunion.type)}
                              {getStatusBadge(reunion.statut)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {reunion.date} à {reunion.heure}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {reunion.lieu}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {reunion.participants.length} participants
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPVStatusBadge(reunion.pvStatut)}
                          <div className="flex items-center gap-1">
                            {reunion.statut === "planifiee" && (
                              <Button variant="outline" size="sm" onClick={() => sendConvocations(reunion.id)}>
                                <Send className="h-4 w-4 mr-2" />
                                Convoquer
                              </Button>
                            )}
                            {reunion.statut === "terminee" && reunion.pvStatut === "non_redige" && (
                              <Button variant="outline" size="sm" onClick={() => generatePV(reunion.id)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Rédiger PV
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {reunion.ordreJour.length > 0 && (
                        <div className="px-4 pb-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Ordre du jour:</p>
                          <div className="flex flex-wrap gap-2">
                            {reunion.ordreJour.slice(0, 3).map((point, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {index + 1}. {point}
                              </Badge>
                            ))}
                            {reunion.ordreJour.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{reunion.ordreJour.length - 3} autres
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pv">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Procès-Verbaux</CardTitle>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter tous
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pvs.map(pv => (
                  <Card key={pv.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <FileCheck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{pv.reunionTitre}</h3>
                              {getPVStatusBadge(pv.statut)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Réunion du {pv.date}</span>
                              <span>Rédigé par {pv.redacteur}</span>
                              {pv.dateValidation && (
                                <span>Validé le {pv.dateValidation} par {pv.validePar}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {pv.statut === "brouillon" && (
                            <Button variant="outline" size="sm" onClick={() => validatePV(pv.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Valider
                            </Button>
                          )}
                          {pv.statut === "valide" && (
                            <Button variant="outline" size="sm" onClick={() => diffusePV(pv.id)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Diffuser
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {pv.decisions.length > 0 && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Décisions prises:</p>
                          <ul className="space-y-1">
                            {pv.decisions.map((decision, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <ChevronRight className="h-3 w-3 text-primary" />
                                {decision}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-4">
                        <p className="text-xs font-medium text-muted-foreground">Signatures:</p>
                        <div className="flex items-center gap-2">
                          {pv.signataires.map((sig, index) => (
                            <Badge key={index} variant={sig.signe ? "default" : "outline"} className="text-xs">
                              {sig.signe ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                              {sig.nom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des réunions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-7">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
                  <div key={day} className="text-center font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, index) => {
                  const day = index - 2; // Ajustement pour commencer au bon jour
                  const isCurrentMonth = day >= 1 && day <= 31;
                  const reunion = reunions.find(r => {
                    const rDay = parseInt(r.date.split('-')[2]);
                    return rDay === day;
                  });
                  return (
                    <div 
                      key={index} 
                      className={`min-h-[80px] p-2 border rounded-lg ${
                        isCurrentMonth ? "bg-background" : "bg-muted/30"
                      } ${reunion ? "border-primary/50" : ""}`}
                    >
                      {isCurrentMonth && (
                        <>
                          <span className={`text-sm ${day === 15 ? "font-bold text-primary" : ""}`}>
                            {day}
                          </span>
                          {reunion && (
                            <div className="mt-1">
                              <Badge variant="secondary" className="text-xs w-full truncate">
                                {reunion.titre.substring(0, 15)}...
                              </Badge>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
