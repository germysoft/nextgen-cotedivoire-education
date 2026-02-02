import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, Bell, Phone, MessageSquare, Clock, User,
  CheckCircle, XCircle, Activity, Siren, Send, Filter,
  Calendar, TrendingUp, Shield, Zap, PhoneCall, Mail, Plus
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

// Types d'alertes
type AlertType = "urgence" | "allergie" | "medicament" | "suivi" | "epidemie";
type AlertStatus = "active" | "traitee" | "escaladee";
type AlertPriority = "critique" | "haute" | "moyenne" | "basse";

interface MedicalAlert {
  id: number;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  eleve: string;
  classe: string;
  titre: string;
  description: string;
  dateCreation: string;
  heureCreation: string;
  dateMiseAJour?: string;
  traitePar?: string;
  actions: string[];
  contactParent: boolean;
  contactUrgence: boolean;
}

// Mock data - Alertes actives
const alertesActives: MedicalAlert[] = [
  {
    id: 1,
    type: "urgence",
    priority: "critique",
    status: "active",
    eleve: "KONE Ibrahim",
    classe: "4ème A",
    titre: "Crise d'asthme sévère",
    description: "Élève présentant une crise d'asthme sévère nécessitant une intervention immédiate. Ventoline administrée, amélioration partielle.",
    dateCreation: "15/12/2024",
    heureCreation: "14:32",
    actions: ["Ventoline administrée", "Parents contactés", "SAMU en attente"],
    contactParent: true,
    contactUrgence: true
  },
  {
    id: 2,
    type: "allergie",
    priority: "haute",
    status: "active",
    eleve: "DIALLO Fatoumata",
    classe: "1ère A",
    titre: "Réaction allergique suspectée",
    description: "Démangeaisons et rougeurs après la cantine. Surveillance en cours.",
    dateCreation: "15/12/2024",
    heureCreation: "13:15",
    actions: ["Antihistaminique administré", "Observation en cours"],
    contactParent: true,
    contactUrgence: false
  },
  {
    id: 3,
    type: "epidemie",
    priority: "haute",
    status: "escaladee",
    eleve: "Classe 3ème B",
    classe: "3ème B",
    titre: "Suspicion de gastro-entérite",
    description: "5 élèves de la même classe présentent des symptômes similaires (nausées, vomissements). Direction informée.",
    dateCreation: "15/12/2024",
    heureCreation: "11:00",
    actions: ["Élèves isolés", "Parents contactés", "Direction informée", "Désinfection demandée"],
    contactParent: true,
    contactUrgence: false
  },
  {
    id: 4,
    type: "medicament",
    priority: "moyenne",
    status: "active",
    eleve: "SANOGO Aminata",
    classe: "3ème C",
    titre: "Rappel traitement épilepsie",
    description: "L'élève n'a pas pris son traitement du matin. Risque de crise si non administré.",
    dateCreation: "15/12/2024",
    heureCreation: "09:30",
    actions: ["Enseignant prévenu"],
    contactParent: true,
    contactUrgence: false
  },
  {
    id: 5,
    type: "suivi",
    priority: "basse",
    status: "active",
    eleve: "TOURÉ Mohamed",
    classe: "2nde B",
    titre: "Contrôle post-consultation",
    description: "Suivi douleur abdominale d'hier. Vérifier état général.",
    dateCreation: "15/12/2024",
    heureCreation: "08:00",
    actions: [],
    contactParent: false,
    contactUrgence: false
  },
];

// Historique des alertes
const historiqueAlertes: MedicalAlert[] = [
  {
    id: 101,
    type: "urgence",
    priority: "critique",
    status: "traitee",
    eleve: "BAMBA Sarah",
    classe: "1ère C",
    titre: "Malaise avec perte de connaissance",
    description: "Malaise en cours d'EPS. Position de sécurité, reprise de connaissance après 2 minutes.",
    dateCreation: "13/12/2024",
    heureCreation: "15:45",
    dateMiseAJour: "13/12/2024 16:30",
    traitePar: "Dr. KONÉ",
    actions: ["PLS", "Sucre administré", "Parents venus chercher l'élève"],
    contactParent: true,
    contactUrgence: true
  },
  {
    id: 102,
    type: "allergie",
    priority: "haute",
    status: "traitee",
    eleve: "KOUASSI Jean",
    classe: "Tle D",
    titre: "Exposition allergène connu",
    description: "Contact accidentel avec arachides à la cantine.",
    dateCreation: "10/12/2024",
    heureCreation: "12:30",
    dateMiseAJour: "10/12/2024 14:00",
    traitePar: "Inf. DIABATÉ",
    actions: ["EpiPen administré", "SAMU appelé", "Hospitalisation préventive"],
    contactParent: true,
    contactUrgence: true
  },
];

// Statistiques des alertes
const statsAlertes = [
  { label: "Alertes actives", value: 5, icon: Bell, color: "bg-red-500" },
  { label: "Urgences aujourd'hui", value: 1, icon: Siren, color: "bg-orange-500" },
  { label: "Résolues (semaine)", value: 12, icon: CheckCircle, color: "bg-green-500" },
  { label: "Temps moyen résolution", value: "45 min", icon: Clock, color: "bg-blue-500" },
];

// Évolution hebdomadaire
const evolutionHebdo = [
  { jour: "Lun", alertes: 3, urgences: 0 },
  { jour: "Mar", alertes: 5, urgences: 1 },
  { jour: "Mer", alertes: 2, urgences: 0 },
  { jour: "Jeu", alertes: 4, urgences: 1 },
  { jour: "Ven", alertes: 6, urgences: 2 },
];

// Configuration des notifications
const configNotifications = [
  { type: "Urgences critiques", sms: true, email: true, app: true },
  { type: "Alertes haute priorité", sms: true, email: true, app: true },
  { type: "Rappels médicaments", sms: false, email: true, app: true },
  { type: "Suivi consultations", sms: false, email: false, app: true },
];

const getPriorityColor = (priority: AlertPriority) => {
  switch (priority) {
    case "critique": return "bg-red-600 text-white animate-pulse";
    case "haute": return "bg-orange-500 text-white";
    case "moyenne": return "bg-yellow-500 text-black";
    case "basse": return "bg-blue-500 text-white";
  }
};

const getTypeIcon = (type: AlertType) => {
  switch (type) {
    case "urgence": return <Siren className="h-4 w-4" />;
    case "allergie": return <AlertTriangle className="h-4 w-4" />;
    case "medicament": return <Activity className="h-4 w-4" />;
    case "suivi": return <Clock className="h-4 w-4" />;
    case "epidemie": return <Shield className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: AlertStatus) => {
  switch (status) {
    case "active": return <Badge variant="destructive">Active</Badge>;
    case "traitee": return <Badge variant="secondary">Traitée</Badge>;
    case "escaladee": return <Badge className="bg-orange-500">Escaladée</Badge>;
  }
};

export default function AlertesMedicales() {
  const [alertes, setAlertes] = useState<MedicalAlert[]>(alertesActives);
  const [historique, setHistorique] = useState<MedicalAlert[]>(historiqueAlertes);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [notifications, setNotifications] = useState(configNotifications);
  const [isNewAlertOpen, setIsNewAlertOpen] = useState(false);
  
  // Nouveau formulaire
  const [newAlert, setNewAlert] = useState({
    eleve: "",
    classe: "",
    type: "urgence" as AlertType,
    priority: "haute" as AlertPriority,
    titre: "",
    description: "",
    contactParent: false,
    contactUrgence: false
  });

  const filteredAlertes = alertes.filter(alerte => {
    const matchPriority = filterPriority === "all" || alerte.priority === filterPriority;
    const matchType = filterType === "all" || alerte.type === filterType;
    return matchPriority && matchType;
  });

  const handleCreateAlert = () => {
    if (!newAlert.eleve || !newAlert.titre) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const newAlertData: MedicalAlert = {
      id: Date.now(),
      type: newAlert.type,
      priority: newAlert.priority,
      status: "active",
      eleve: newAlert.eleve,
      classe: newAlert.classe,
      titre: newAlert.titre,
      description: newAlert.description,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      heureCreation: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      actions: [],
      contactParent: newAlert.contactParent,
      contactUrgence: newAlert.contactUrgence
    };

    setAlertes([newAlertData, ...alertes]);
    
    if (newAlert.priority === "critique") {
      toast.error(`ALERTE CRITIQUE: ${newAlert.titre}`, { duration: 10000 });
    } else {
      toast.success("Alerte créée avec succès");
    }

    if (newAlert.contactParent) {
      toast.info("Parents notifiés par SMS");
    }
    if (newAlert.contactUrgence) {
      toast.warning("Services d'urgence alertés");
    }

    setNewAlert({ eleve: "", classe: "", type: "urgence", priority: "haute", titre: "", description: "", contactParent: false, contactUrgence: false });
    setIsNewAlertOpen(false);
  };

  const handleResolveAlert = (alertId: number) => {
    const alert = alertes.find(a => a.id === alertId);
    if (!alert) return;

    const resolvedAlert: MedicalAlert = {
      ...alert,
      status: "traitee",
      dateMiseAJour: `${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      traitePar: "Utilisateur"
    };

    setAlertes(alertes.filter(a => a.id !== alertId));
    setHistorique([resolvedAlert, ...historique]);
    toast.success("Alerte marquée comme résolue");
  };

  const handleEscalateAlert = (alertId: number) => {
    setAlertes(alertes.map(a => 
      a.id === alertId ? { ...a, status: "escaladee" as AlertStatus, priority: "critique" as AlertPriority } : a
    ));
    toast.warning("Alerte escaladée à la direction");
  };

  const handleAddAction = (alertId: number, action: string) => {
    setAlertes(alertes.map(a => 
      a.id === alertId ? { ...a, actions: [...a.actions, action] } : a
    ));
    toast.success(`Action ajoutée: ${action}`);
  };

  const handleCallParent = (alert: MedicalAlert) => {
    setAlertes(alertes.map(a => 
      a.id === alert.id ? { ...a, contactParent: true, actions: [...a.actions, "Parents contactés par téléphone"] } : a
    ));
    toast.success(`Appel parent enregistré pour ${alert.eleve}`);
  };

  const handleSendSMS = (alert: MedicalAlert) => {
    setAlertes(alertes.map(a => 
      a.id === alert.id ? { ...a, actions: [...a.actions, "SMS envoyé aux parents"] } : a
    ));
    toast.success(`SMS envoyé pour ${alert.eleve}`);
  };

  const handleToggleNotification = (index: number, channel: 'sms' | 'email' | 'app') => {
    setNotifications(notifications.map((n, i) => 
      i === index ? { ...n, [channel]: !n[channel] } : n
    ));
  };

  const handleSaveConfig = () => {
    toast.success("Configuration des notifications sauvegardée");
  };

  // Stats dynamiques
  const activeCount = alertes.filter(a => a.status === "active").length;
  const urgentCount = alertes.filter(a => a.priority === "critique").length;
  const resolvedWeek = historique.length;

  const statsAlertes = [
    { label: "Alertes actives", value: activeCount, icon: Bell, color: "bg-destructive" },
    { label: "Urgences", value: urgentCount, icon: Siren, color: "bg-orange-500" },
    { label: "Résolues (semaine)", value: resolvedWeek, icon: CheckCircle, color: "bg-green-500" },
    { label: "Temps moyen résolution", value: "45 min", icon: Clock, color: "bg-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes Médicales</h1>
          <p className="text-muted-foreground">Gestion des urgences et notifications sanitaires</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isNewAlertOpen} onOpenChange={setIsNewAlertOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Siren className="mr-2 h-4 w-4" />
                Nouvelle Alerte Urgente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer une Alerte Urgente</DialogTitle>
                <DialogDescription>Signaler une situation médicale nécessitant attention</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Élève concerné *</Label>
                    <Input 
                      placeholder="Nom de l'élève"
                      value={newAlert.eleve}
                      onChange={(e) => setNewAlert({...newAlert, eleve: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Input 
                      placeholder="Classe"
                      value={newAlert.classe}
                      onChange={(e) => setNewAlert({...newAlert, classe: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type d'alerte</Label>
                    <Select value={newAlert.type} onValueChange={(v: AlertType) => setNewAlert({...newAlert, type: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="urgence">Urgence médicale</SelectItem>
                        <SelectItem value="allergie">Réaction allergique</SelectItem>
                        <SelectItem value="medicament">Problème médicament</SelectItem>
                        <SelectItem value="epidemie">Suspicion épidémie</SelectItem>
                        <SelectItem value="suivi">Suivi requis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priorité</Label>
                    <Select value={newAlert.priority} onValueChange={(v: AlertPriority) => setNewAlert({...newAlert, priority: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="critique">Critique (immédiat)</SelectItem>
                        <SelectItem value="haute">Haute (moins de 30 min)</SelectItem>
                        <SelectItem value="moyenne">Moyenne (moins de 2h)</SelectItem>
                        <SelectItem value="basse">Basse (dans la journée)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Titre de l'alerte *</Label>
                  <Input 
                    placeholder="Ex: Crise d'asthme sévère"
                    value={newAlert.titre}
                    onChange={(e) => setNewAlert({...newAlert, titre: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description détaillée</Label>
                  <Textarea 
                    placeholder="Décrire la situation, symptômes observés, actions prises..." 
                    rows={4}
                    value={newAlert.description}
                    onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="parent" 
                      checked={newAlert.contactParent}
                      onCheckedChange={(v) => setNewAlert({...newAlert, contactParent: v})}
                    />
                    <Label htmlFor="parent">Contacter les parents</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="samu" 
                      checked={newAlert.contactUrgence}
                      onCheckedChange={(v) => setNewAlert({...newAlert, contactUrgence: v})}
                    />
                    <Label htmlFor="samu">Appeler les urgences (SAMU)</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewAlertOpen(false)}>Annuler</Button>
                <Button variant="destructive" onClick={handleCreateAlert}>Créer l'alerte</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsAlertes.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="actives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actives" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alertes Actives ({alertes.length})
          </TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="actives" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="critique">Critique</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="urgence">Urgence</SelectItem>
                    <SelectItem value="allergie">Allergie</SelectItem>
                    <SelectItem value="medicament">Médicament</SelectItem>
                    <SelectItem value="epidemie">Épidémie</SelectItem>
                    <SelectItem value="suivi">Suivi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des alertes actives */}
          <div className="space-y-4">
            {filteredAlertes.map((alerte) => (
              <Card key={alerte.id} className={alerte.priority === "critique" ? "border-red-500 border-2" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getPriorityColor(alerte.priority)}`}>
                        {getTypeIcon(alerte.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alerte.titre}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {alerte.eleve} - {alerte.classe}
                          <span className="mx-2">|</span>
                          <Clock className="h-3 w-3" />
                          {alerte.heureCreation}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(alerte.priority)}>
                        {alerte.priority.toUpperCase()}
                      </Badge>
                      {getStatusBadge(alerte.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{alerte.description}</p>
                  
                  {alerte.actions.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Actions effectuées:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {alerte.actions.map((action, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      {alerte.contactParent && (
                        <Badge variant="secondary" className="text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          Parents contactés
                        </Badge>
                      )}
                      {alerte.contactUrgence && (
                        <Badge variant="destructive" className="text-xs">
                          <Siren className="h-3 w-3 mr-1" />
                          Urgences alertées
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleCallParent(alerte)}>
                        <PhoneCall className="h-4 w-4 mr-1" />
                        Appeler parent
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendSMS(alerte)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Envoyer SMS
                      </Button>
                      {alerte.status !== "escaladee" && (
                        <Button size="sm" variant="secondary" onClick={() => handleEscalateAlert(alerte.id)}>
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Escalader
                        </Button>
                      )}
                      <Button size="sm" onClick={() => handleResolveAlert(alerte.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Résolu
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Alertes Traitées</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Traité par</TableHead>
                    <TableHead>Durée résolution</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historique.map((alerte) => (
                    <TableRow key={alerte.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {alerte.dateCreation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(alerte.type)}
                          <span className="capitalize">{alerte.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alerte.eleve}</TableCell>
                      <TableCell className="max-w-xs truncate">{alerte.titre}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(alerte.priority)}>{alerte.priority}</Badge>
                      </TableCell>
                      <TableCell>{alerte.traitePar}</TableCell>
                      <TableCell>45 min</TableCell>
                      <TableCell>{getStatusBadge(alerte.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolutionHebdo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="alertes" stroke="hsl(var(--primary))" strokeWidth={2} name="Alertes" />
                    <Line type="monotone" dataKey="urgences" stroke="hsl(var(--destructive))" strokeWidth={2} name="Urgences" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Urgences médicales", count: 8, percent: 20, color: "bg-red-500" },
                    { type: "Réactions allergiques", count: 6, percent: 15, color: "bg-orange-500" },
                    { type: "Problèmes médicaments", count: 12, percent: 30, color: "bg-yellow-500" },
                    { type: "Suivis requis", count: 10, percent: 25, color: "bg-blue-500" },
                    { type: "Suspicions épidémie", count: 4, percent: 10, color: "bg-purple-500" },
                  ].map((item) => (
                    <div key={item.type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.count} ({item.percent}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuration des Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type d'alerte</TableHead>
                    <TableHead className="text-center">SMS</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Application</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notif, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{notif.type}</TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={notif.sms} 
                          onCheckedChange={() => handleToggleNotification(idx, 'sms')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={notif.email} 
                          onCheckedChange={() => handleToggleNotification(idx, 'email')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={notif.app} 
                          onCheckedChange={() => handleToggleNotification(idx, 'app')}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Escalade Automatique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Niveau 1 (5 min)</Label>
                  <Input defaultValue="Infirmier de garde" />
                  <p className="text-xs text-muted-foreground">SMS + Notification app</p>
                </div>
                <div className="space-y-2">
                  <Label>Niveau 2 (15 min)</Label>
                  <Input defaultValue="Médecin scolaire + Direction" />
                  <p className="text-xs text-muted-foreground">SMS + Email + Appel</p>
                </div>
                <div className="space-y-2">
                  <Label>Niveau 3 (30 min)</Label>
                  <Input defaultValue="Proviseur + SAMU" />
                  <p className="text-xs text-muted-foreground">Tous canaux + Urgences</p>
                </div>
              </div>
              <Button className="mt-4" onClick={handleSaveConfig}>
                <Send className="mr-2 h-4 w-4" />
                Sauvegarder Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
