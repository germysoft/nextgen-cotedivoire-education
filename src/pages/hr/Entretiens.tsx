import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Users, 
  Bell, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  Send,
  Settings,
  TrendingUp,
  BarChart3,
  Target,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday, isPast, isFuture } from "date-fns";
import { fr } from "date-fns/locale";
import { mockPersonnel } from "@/data/mockPersonnel";

interface Entretien {
  id: string;
  personnelId: string;
  personnelNom: string;
  personnelPrenom: string;
  personnelPoste: string;
  personnelDepartement: string;
  evaluateurId: string;
  evaluateurNom: string;
  date: Date;
  heure: string;
  duree: number; // en minutes
  lieu: string;
  type: 'annuel' | 'semestriel' | 'probatoire' | 'objectifs';
  statut: 'planifie' | 'confirme' | 'en_cours' | 'termine' | 'reporte' | 'annule';
  rappelEnvoye: boolean;
  rappelDate?: Date;
  notes?: string;
  objectifs?: string[];
}

interface Rappel {
  id: string;
  entretienId: string;
  type: 'email' | 'sms' | 'notification';
  destinataire: string;
  dateEnvoi: Date;
  statut: 'planifie' | 'envoye' | 'echec';
  message: string;
}

const mockEntretiens: Entretien[] = [
  {
    id: "ENT001",
    personnelId: "P001",
    personnelNom: "Kouassi",
    personnelPrenom: "Amenan",
    personnelPoste: "Enseignant",
    personnelDepartement: "Sciences",
    evaluateurId: "E001",
    evaluateurNom: "M. Yao Directeur",
    date: new Date(2024, 0, 15),
    heure: "09:00",
    duree: 60,
    lieu: "Bureau RH",
    type: 'annuel',
    statut: 'termine',
    rappelEnvoye: true,
    notes: "Excellent travail cette année"
  },
  {
    id: "ENT002",
    personnelId: "P002",
    personnelNom: "Konan",
    personnelPrenom: "Yves",
    personnelPoste: "Comptable",
    personnelDepartement: "Administration",
    evaluateurId: "E001",
    evaluateurNom: "M. Yao Directeur",
    date: new Date(),
    heure: "14:00",
    duree: 45,
    lieu: "Salle de réunion A",
    type: 'annuel',
    statut: 'confirme',
    rappelEnvoye: true
  },
  {
    id: "ENT003",
    personnelId: "P003",
    personnelNom: "Diallo",
    personnelPrenom: "Fatou",
    personnelPoste: "Secrétaire",
    personnelDepartement: "Administration",
    evaluateurId: "E002",
    evaluateurNom: "Mme Bamba DRH",
    date: addDays(new Date(), 2),
    heure: "10:30",
    duree: 60,
    lieu: "Bureau Direction",
    type: 'semestriel',
    statut: 'planifie',
    rappelEnvoye: false
  },
  {
    id: "ENT004",
    personnelId: "P004",
    personnelNom: "Traoré",
    personnelPrenom: "Ibrahim",
    personnelPoste: "Enseignant",
    personnelDepartement: "Lettres",
    evaluateurId: "E001",
    evaluateurNom: "M. Yao Directeur",
    date: addDays(new Date(), 5),
    heure: "11:00",
    duree: 60,
    lieu: "Bureau RH",
    type: 'probatoire',
    statut: 'planifie',
    rappelEnvoye: false
  },
  {
    id: "ENT005",
    personnelId: "P005",
    personnelNom: "Ouattara",
    personnelPrenom: "Mariam",
    personnelPoste: "Infirmière",
    personnelDepartement: "Médical",
    evaluateurId: "E002",
    evaluateurNom: "Mme Bamba DRH",
    date: addDays(new Date(), 7),
    heure: "15:00",
    duree: 45,
    lieu: "Salle de réunion B",
    type: 'objectifs',
    statut: 'planifie',
    rappelEnvoye: false
  }
];

const mockRappels: Rappel[] = [
  {
    id: "R001",
    entretienId: "ENT002",
    type: 'email',
    destinataire: "konan.yves@ecole.ci",
    dateEnvoi: addDays(new Date(), -1),
    statut: 'envoye',
    message: "Rappel: Votre entretien annuel est prévu demain à 14h00"
  },
  {
    id: "R002",
    entretienId: "ENT003",
    type: 'sms',
    destinataire: "+225 07 12 34 56 78",
    dateEnvoi: addDays(new Date(), 1),
    statut: 'planifie',
    message: "Rappel: Entretien semestriel dans 24h"
  }
];

type RappelType = 'email' | 'sms' | 'notification';

interface ConfigRappel {
  actif: boolean;
  type: RappelType;
}

interface ConfigRappels {
  rappelJ7: ConfigRappel;
  rappelJ3: ConfigRappel;
  rappelJ1: ConfigRappel;
  rappelJour: ConfigRappel;
}

const configRappels: ConfigRappels = {
  rappelJ7: { actif: true, type: 'email' },
  rappelJ3: { actif: true, type: 'email' },
  rappelJ1: { actif: true, type: 'sms' },
  rappelJour: { actif: true, type: 'notification' }
};

export default function Entretiens() {
  const [entretiens, setEntretiens] = useState<Entretien[]>(mockEntretiens);
  const [rappels, setRappels] = useState<Rappel[]>(mockRappels);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [config, setConfig] = useState(configRappels);
  
  const [newEntretien, setNewEntretien] = useState({
    personnelId: "",
    evaluateurId: "",
    date: new Date(),
    heure: "09:00",
    duree: 60,
    lieu: "Bureau RH",
    type: 'annuel' as const,
    notes: ""
  });

  // Stats
  const stats = {
    total: entretiens.length,
    planifies: entretiens.filter(e => e.statut === 'planifie').length,
    confirmes: entretiens.filter(e => e.statut === 'confirme').length,
    termines: entretiens.filter(e => e.statut === 'termine').length,
    aVenir: entretiens.filter(e => isFuture(e.date) && e.statut !== 'annule').length,
    aujourdhui: entretiens.filter(e => isToday(e.date)).length,
    sansRappel: entretiens.filter(e => !e.rappelEnvoye && e.statut === 'planifie').length
  };

  // Filtrage
  const filteredEntretiens = entretiens.filter(e => {
    const matchSearch = 
      e.personnelNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.personnelPrenom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatut = filterStatut === "all" || e.statut === filterStatut;
    const matchType = filterType === "all" || e.type === filterType;
    return matchSearch && matchStatut && matchType;
  });

  // Entretiens du jour sélectionné
  const entretiensJour = selectedDate 
    ? entretiens.filter(e => isSameDay(e.date, selectedDate))
    : [];

  // Jours avec entretiens pour le calendrier
  const daysWithEntretiens = entretiens.map(e => e.date);

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      planifie: { variant: "outline", label: "Planifié" },
      confirme: { variant: "default", label: "Confirmé" },
      en_cours: { variant: "secondary", label: "En cours" },
      termine: { variant: "default", label: "Terminé" },
      reporte: { variant: "destructive", label: "Reporté" },
      annule: { variant: "destructive", label: "Annulé" }
    };
    const config = variants[statut] || variants.planifie;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      annuel: "Annuel",
      semestriel: "Semestriel",
      probatoire: "Probatoire",
      objectifs: "Objectifs"
    };
    return <Badge variant="secondary">{labels[type] || type}</Badge>;
  };

  const handleCreateEntretien = () => {
    const personnel = mockPersonnel.find(p => p.id === newEntretien.personnelId);
    if (!personnel) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un employé", variant: "destructive" });
      return;
    }

    const newEnt: Entretien = {
      id: `ENT${String(entretiens.length + 1).padStart(3, '0')}`,
      personnelId: newEntretien.personnelId,
      personnelNom: personnel.nom,
      personnelPrenom: personnel.prenom,
      personnelPoste: personnel.poste,
      personnelDepartement: personnel.departement,
      evaluateurId: newEntretien.evaluateurId || "E001",
      evaluateurNom: "M. Yao Directeur",
      date: newEntretien.date,
      heure: newEntretien.heure,
      duree: newEntretien.duree,
      lieu: newEntretien.lieu,
      type: newEntretien.type,
      statut: 'planifie',
      rappelEnvoye: false,
      notes: newEntretien.notes
    };

    setEntretiens([...entretiens, newEnt]);
    setShowNewDialog(false);
    toast({ title: "Succès", description: "Entretien planifié avec succès" });
    
    // Réinitialiser le formulaire
    setNewEntretien({
      personnelId: "",
      evaluateurId: "",
      date: new Date(),
      heure: "09:00",
      duree: 60,
      lieu: "Bureau RH",
      type: 'annuel',
      notes: ""
    });
  };

  const handleSendRappel = (entretien: Entretien) => {
    const newRappel: Rappel = {
      id: `R${String(rappels.length + 1).padStart(3, '0')}`,
      entretienId: entretien.id,
      type: 'email',
      destinataire: `${entretien.personnelPrenom.toLowerCase()}.${entretien.personnelNom.toLowerCase()}@ecole.ci`,
      dateEnvoi: new Date(),
      statut: 'envoye',
      message: `Rappel: Votre entretien ${entretien.type} est prévu le ${format(entretien.date, 'dd/MM/yyyy', { locale: fr })} à ${entretien.heure}`
    };

    setRappels([...rappels, newRappel]);
    setEntretiens(entretiens.map(e => 
      e.id === entretien.id ? { ...e, rappelEnvoye: true } : e
    ));
    toast({ title: "Rappel envoyé", description: `Email envoyé à ${entretien.personnelPrenom} ${entretien.personnelNom}` });
  };

  const handleConfirmEntretien = (id: string) => {
    setEntretiens(entretiens.map(e => 
      e.id === id ? { ...e, statut: 'confirme' } : e
    ));
    toast({ title: "Entretien confirmé" });
  };

  const handleTerminerEntretien = (id: string) => {
    setEntretiens(entretiens.map(e => 
      e.id === id ? { ...e, statut: 'termine' } : e
    ));
    toast({ title: "Entretien marqué comme terminé" });
  };

  const handleBulkRappels = () => {
    const sanRappel = entretiens.filter(e => !e.rappelEnvoye && e.statut === 'planifie');
    sanRappel.forEach(e => handleSendRappel(e));
    toast({ title: "Rappels envoyés", description: `${sanRappel.length} rappels envoyés` });
  };

  // Générer les jours du mois pour le calendrier personnalisé
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Padding pour aligner avec le premier jour de la semaine
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Entretiens Annuels</h1>
          <p className="text-muted-foreground">Planification et suivi des évaluations RH</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configuration des rappels</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappel J-7</p>
                    <p className="text-sm text-muted-foreground">7 jours avant</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={config.rappelJ7.type} 
                      onValueChange={(v) => setConfig({...config, rappelJ7: {...config.rappelJ7, type: v as 'email' | 'sms' | 'notification'}})}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="notification">Notif</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch 
                      checked={config.rappelJ7.actif}
                      onCheckedChange={(c) => setConfig({...config, rappelJ7: {...config.rappelJ7, actif: c}})}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappel J-3</p>
                    <p className="text-sm text-muted-foreground">3 jours avant</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={config.rappelJ3.type}
                      onValueChange={(v) => setConfig({...config, rappelJ3: {...config.rappelJ3, type: v as 'email' | 'sms' | 'notification'}})}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="notification">Notif</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch 
                      checked={config.rappelJ3.actif}
                      onCheckedChange={(c) => setConfig({...config, rappelJ3: {...config.rappelJ3, actif: c}})}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappel J-1</p>
                    <p className="text-sm text-muted-foreground">1 jour avant</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={config.rappelJ1.type}
                      onValueChange={(v) => setConfig({...config, rappelJ1: {...config.rappelJ1, type: v as 'email' | 'sms' | 'notification'}})}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="notification">Notif</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch 
                      checked={config.rappelJ1.actif}
                      onCheckedChange={(c) => setConfig({...config, rappelJ1: {...config.rappelJ1, actif: c}})}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappel Jour J</p>
                    <p className="text-sm text-muted-foreground">Le jour même</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={config.rappelJour.type}
                      onValueChange={(v) => setConfig({...config, rappelJour: {...config.rappelJour, type: v as 'email' | 'sms' | 'notification'}})}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="notification">Notif</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch 
                      checked={config.rappelJour.actif}
                      onCheckedChange={(c) => setConfig({...config, rappelJour: {...config.rappelJour, actif: c}})}
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={() => {
                  setShowConfigDialog(false);
                  toast({ title: "Configuration sauvegardée" });
                }}>
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {stats.sansRappel > 0 && (
            <Button variant="outline" onClick={handleBulkRappels}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer {stats.sansRappel} rappels
            </Button>
          )}
          
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel entretien
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Planifier un entretien</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Employé</Label>
                  <Select value={newEntretien.personnelId} onValueChange={(v) => setNewEntretien({...newEntretien, personnelId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPersonnel.slice(0, 10).map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.prenom} {p.nom} - {p.poste}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type d'entretien</Label>
                    <Select value={newEntretien.type} onValueChange={(v: any) => setNewEntretien({...newEntretien, type: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annuel">Annuel</SelectItem>
                        <SelectItem value="semestriel">Semestriel</SelectItem>
                        <SelectItem value="probatoire">Probatoire</SelectItem>
                        <SelectItem value="objectifs">Objectifs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Durée (min)</Label>
                    <Select value={String(newEntretien.duree)} onValueChange={(v) => setNewEntretien({...newEntretien, duree: parseInt(v)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="90">1h30</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={format(newEntretien.date, 'yyyy-MM-dd')}
                      onChange={(e) => setNewEntretien({...newEntretien, date: new Date(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure</Label>
                    <Input 
                      type="time" 
                      value={newEntretien.heure}
                      onChange={(e) => setNewEntretien({...newEntretien, heure: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Lieu</Label>
                  <Select value={newEntretien.lieu} onValueChange={(v) => setNewEntretien({...newEntretien, lieu: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bureau RH">Bureau RH</SelectItem>
                      <SelectItem value="Bureau Direction">Bureau Direction</SelectItem>
                      <SelectItem value="Salle de réunion A">Salle de réunion A</SelectItem>
                      <SelectItem value="Salle de réunion B">Salle de réunion B</SelectItem>
                      <SelectItem value="Visioconférence">Visioconférence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes (optionnel)</Label>
                  <Textarea 
                    value={newEntretien.notes}
                    onChange={(e) => setNewEntretien({...newEntretien, notes: e.target.value})}
                    placeholder="Points à aborder, objectifs..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewDialog(false)}>Annuler</Button>
                  <Button onClick={handleCreateEntretien}>Planifier</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.planifies}</p>
                <p className="text-xs text-muted-foreground">Planifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.confirmes}</p>
                <p className="text-xs text-muted-foreground">Confirmés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{stats.termines}</p>
                <p className="text-xs text-muted-foreground">Terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.aVenir}</p>
                <p className="text-xs text-muted-foreground">À venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.aujourdhui}</p>
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.sansRappel > 0 ? "bg-destructive/10" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{stats.sansRappel}</p>
                <p className="text-xs text-muted-foreground">Sans rappel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendrier" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          <TabsTrigger value="liste">Liste des entretiens</TabsTrigger>
          <TabsTrigger value="rappels">Rappels</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="calendrier" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendrier */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Planning des entretiens</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium min-w-[140px] text-center">
                      {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                    </span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Grille des jours */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Padding */}
                  {Array.from({ length: paddingDays }).map((_, i) => (
                    <div key={`pad-${i}`} className="h-24 bg-muted/30 rounded-lg" />
                  ))}
                  
                  {/* Jours du mois */}
                  {daysInMonth.map(day => {
                    const dayEntretiens = entretiens.filter(e => isSameDay(e.date, day));
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`h-24 p-1 rounded-lg border cursor-pointer transition-colors ${
                          isSelected ? 'border-primary bg-primary/10' : 
                          isCurrentDay ? 'border-primary/50 bg-primary/5' : 
                          'border-transparent hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-primary' : ''}`}>
                          {format(day, 'd')}
                        </div>
                        <ScrollArea className="h-16">
                          {dayEntretiens.slice(0, 3).map(e => (
                            <div 
                              key={e.id}
                              className={`text-xs p-1 mb-1 rounded truncate ${
                                e.statut === 'termine' ? 'bg-green-100 text-green-800' :
                                e.statut === 'confirme' ? 'bg-blue-100 text-blue-800' :
                                e.statut === 'annule' ? 'bg-red-100 text-red-800' :
                                'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {e.heure} - {e.personnelPrenom}
                            </div>
                          ))}
                          {dayEntretiens.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEntretiens.length - 3} autres
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Détails du jour */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedDate ? format(selectedDate, 'EEEE d MMMM', { locale: fr }) : 'Sélectionnez un jour'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entretiensJour.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun entretien ce jour</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entretiensJour.map(e => (
                      <Card key={e.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{e.personnelPrenom} {e.personnelNom}</p>
                            <p className="text-sm text-muted-foreground">{e.personnelPoste}</p>
                          </div>
                          {getStatutBadge(e.statut)}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{e.heure} ({e.duree} min)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{e.evaluateurNom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{e.lieu}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {e.statut === 'planifie' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleConfirmEntretien(e.id)}>
                                Confirmer
                              </Button>
                              {!e.rappelEnvoye && (
                                <Button size="sm" variant="outline" onClick={() => handleSendRappel(e)}>
                                  <Bell className="h-3 w-3 mr-1" />
                                  Rappel
                                </Button>
                              )}
                            </>
                          )}
                          {e.statut === 'confirme' && (
                            <Button size="sm" onClick={() => handleTerminerEntretien(e.id)}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Terminer
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="liste" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un employé..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="planifie">Planifié</SelectItem>
                    <SelectItem value="confirme">Confirmé</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="reporte">Reporté</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="annuel">Annuel</SelectItem>
                    <SelectItem value="semestriel">Semestriel</SelectItem>
                    <SelectItem value="probatoire">Probatoire</SelectItem>
                    <SelectItem value="objectifs">Objectifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Employé</th>
                      <th className="text-left p-4 font-medium">Date & Heure</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Évaluateur</th>
                      <th className="text-left p-4 font-medium">Lieu</th>
                      <th className="text-left p-4 font-medium">Statut</th>
                      <th className="text-left p-4 font-medium">Rappel</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntretiens.map(e => (
                      <tr key={e.id} className="border-t hover:bg-muted/30">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{e.personnelPrenom} {e.personnelNom}</p>
                            <p className="text-sm text-muted-foreground">{e.personnelPoste}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p>{format(e.date, 'dd/MM/yyyy', { locale: fr })}</p>
                            <p className="text-sm text-muted-foreground">{e.heure} ({e.duree} min)</p>
                          </div>
                        </td>
                        <td className="p-4">{getTypeBadge(e.type)}</td>
                        <td className="p-4">{e.evaluateurNom}</td>
                        <td className="p-4">{e.lieu}</td>
                        <td className="p-4">{getStatutBadge(e.statut)}</td>
                        <td className="p-4">
                          {e.rappelEnvoye ? (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Envoyé
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {e.statut === 'planifie' && !e.rappelEnvoye && (
                              <Button size="sm" variant="ghost" onClick={() => handleSendRappel(e)}>
                                <Bell className="h-4 w-4" />
                              </Button>
                            )}
                            {e.statut === 'planifie' && (
                              <Button size="sm" variant="ghost" onClick={() => handleConfirmEntretien(e.id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {e.statut === 'confirme' && (
                              <Button size="sm" variant="ghost" onClick={() => handleTerminerEntretien(e.id)}>
                                <Target className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rappels" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Rappels envoyés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rappels.filter(r => r.statut === 'envoye').map(r => {
                    const entretien = entretiens.find(e => e.id === r.entretienId);
                    return (
                      <div key={r.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-full ${r.type === 'email' ? 'bg-blue-100' : r.type === 'sms' ? 'bg-green-100' : 'bg-orange-100'}`}>
                          {r.type === 'email' ? <Mail className="h-4 w-4 text-blue-600" /> : 
                           r.type === 'sms' ? <MessageSquare className="h-4 w-4 text-green-600" /> :
                           <Bell className="h-4 w-4 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{entretien?.personnelPrenom} {entretien?.personnelNom}</p>
                          <p className="text-sm text-muted-foreground">{r.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Envoyé le {format(r.dateEnvoi, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-600">Envoyé</Badge>
                      </div>
                    );
                  })}
                  {rappels.filter(r => r.statut === 'envoye').length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Aucun rappel envoyé</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Rappels planifiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rappels.filter(r => r.statut === 'planifie').map(r => {
                    const entretien = entretiens.find(e => e.id === r.entretienId);
                    return (
                      <div key={r.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-full ${r.type === 'email' ? 'bg-blue-100' : r.type === 'sms' ? 'bg-green-100' : 'bg-orange-100'}`}>
                          {r.type === 'email' ? <Mail className="h-4 w-4 text-blue-600" /> : 
                           r.type === 'sms' ? <MessageSquare className="h-4 w-4 text-green-600" /> :
                           <Bell className="h-4 w-4 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{entretien?.personnelPrenom} {entretien?.personnelNom}</p>
                          <p className="text-sm text-muted-foreground">{r.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Prévu le {format(r.dateEnvoi, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                        <Badge variant="outline">Planifié</Badge>
                      </div>
                    );
                  })}
                  {rappels.filter(r => r.statut === 'planifie').length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Aucun rappel planifié</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de réalisation</p>
                    <p className="text-3xl font-bold">{Math.round((stats.termines / stats.total) * 100)}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de confirmation</p>
                    <p className="text-3xl font-bold">{Math.round(((stats.confirmes + stats.termines) / stats.total) * 100)}%</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Durée moyenne</p>
                    <p className="text-3xl font-bold">{Math.round(entretiens.reduce((acc, e) => acc + e.duree, 0) / entretiens.length)} min</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rappels envoyés</p>
                    <p className="text-3xl font-bold">{rappels.filter(r => r.statut === 'envoye').length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['annuel', 'semestriel', 'probatoire', 'objectifs'].map(type => {
                    const count = entretiens.filter(e => e.type === type).length;
                    const percentage = Math.round((count / entretiens.length) * 100);
                    const labels: Record<string, string> = {
                      annuel: "Annuel",
                      semestriel: "Semestriel",
                      probatoire: "Probatoire",
                      objectifs: "Objectifs"
                    };
                    return (
                      <div key={type}>
                        <div className="flex justify-between mb-1">
                          <span>{labels[type]}</span>
                          <span className="text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: 'planifie', label: 'Planifié', color: 'bg-orange-500' },
                    { key: 'confirme', label: 'Confirmé', color: 'bg-blue-500' },
                    { key: 'termine', label: 'Terminé', color: 'bg-green-500' },
                    { key: 'reporte', label: 'Reporté', color: 'bg-yellow-500' },
                    { key: 'annule', label: 'Annulé', color: 'bg-red-500' }
                  ].map(({ key, label, color }) => {
                    const count = entretiens.filter(e => e.statut === key).length;
                    const percentage = Math.round((count / entretiens.length) * 100);
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span>{label}</span>
                          <span className="text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${color} rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
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
    </div>
  );
}
