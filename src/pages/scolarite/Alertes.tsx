import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, DollarSign, User, Calendar, MessageSquare, Phone, 
  Mail, Clock, TrendingUp, TrendingDown, Send, FileText, Eye,
  Settings, History, Bell, BellRing, CheckCircle, XCircle,
  Download, Filter, RefreshCw, MoreVertical, UserX, CreditCard,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Wallet, FilePlus
} from "lucide-react";
import { DataTableFilters, FilterConfig } from "@/components/data-table/DataTableFilters";
import { DataTableExport } from "@/components/data-table/DataTableExport";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";

interface Impaye {
  id: string;
  eleve: string;
  matricule: string;
  classe: string;
  niveau: string;
  parent: string;
  telephone: string;
  email: string;
  montantTotal: number;
  montantPaye: number;
  montantDu: number;
  moisRetard: number;
  derniereRelance: string;
  nombreRelances: number;
  statut: 'Critique' | 'Important' | 'Alerte' | 'Régularisation';
  dateEcheance: string;
  typeScolarite: 'Scolarité complète' | 'Trimestriel' | 'Mensuel';
  historiquePaiements: { date: string; montant: number; mode: string }[];
}

interface RelanceConfig {
  id: string;
  nom: string;
  delai: number;
  canaux: ('sms' | 'email' | 'appel' | 'convocation')[];
  actif: boolean;
  messageTemplate: string;
}

interface HistoriqueRelance {
  id: string;
  date: string;
  type: 'SMS' | 'Email' | 'Appel' | 'Convocation';
  destinataires: number;
  statut: 'Envoyé' | 'Planifié' | 'Échoué';
  tauxOuverture?: number;
  montantRecouvre?: number;
}

const impayes: Impaye[] = [
  { 
    id: "1",
    eleve: "KOUASSI Jean-Baptiste", 
    matricule: "MAT-2024-001",
    classe: "Tle D", 
    niveau: "Terminale",
    parent: "KOUASSI François",
    telephone: "+225 07 12 34 56 78",
    email: "kouassi.f@email.com",
    montantTotal: 750000,
    montantPaye: 300000,
    montantDu: 450000, 
    moisRetard: 3, 
    derniereRelance: "10 Déc 2024", 
    nombreRelances: 4,
    statut: "Critique",
    dateEcheance: "2024-09-30",
    typeScolarite: "Scolarité complète",
    historiquePaiements: [
      { date: "2024-09-05", montant: 200000, mode: "Espèces" },
      { date: "2024-10-15", montant: 100000, mode: "Mobile Money" },
    ]
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
    montantTotal: 650000,
    montantPaye: 350000,
    montantDu: 300000, 
    moisRetard: 2, 
    derniereRelance: "12 Déc 2024", 
    nombreRelances: 2,
    statut: "Important",
    dateEcheance: "2024-10-31",
    typeScolarite: "Trimestriel",
    historiquePaiements: [
      { date: "2024-09-02", montant: 250000, mode: "Virement" },
      { date: "2024-11-10", montant: 100000, mode: "Mobile Money" },
    ]
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
    montantTotal: 550000,
    montantPaye: 400000,
    montantDu: 150000, 
    moisRetard: 1, 
    derniereRelance: "14 Déc 2024", 
    nombreRelances: 1,
    statut: "Alerte",
    dateEcheance: "2024-11-30",
    typeScolarite: "Trimestriel",
    historiquePaiements: [
      { date: "2024-09-08", montant: 200000, mode: "Espèces" },
      { date: "2024-10-20", montant: 200000, mode: "Chèque" },
    ]
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
    montantTotal: 600000,
    montantPaye: 0,
    montantDu: 600000, 
    moisRetard: 4, 
    derniereRelance: "08 Déc 2024", 
    nombreRelances: 6,
    statut: "Critique",
    dateEcheance: "2024-09-15",
    typeScolarite: "Scolarité complète",
    historiquePaiements: []
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
    montantTotal: 500000,
    montantPaye: 275000,
    montantDu: 225000, 
    moisRetard: 1.5, 
    derniereRelance: "13 Déc 2024", 
    nombreRelances: 2,
    statut: "Alerte",
    dateEcheance: "2024-11-15",
    typeScolarite: "Mensuel",
    historiquePaiements: [
      { date: "2024-09-10", montant: 100000, mode: "Espèces" },
      { date: "2024-10-12", montant: 100000, mode: "Mobile Money" },
      { date: "2024-11-05", montant: 75000, mode: "Espèces" },
    ]
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
    montantTotal: 450000,
    montantPaye: 400000,
    montantDu: 50000, 
    moisRetard: 0.5, 
    derniereRelance: "15 Déc 2024", 
    nombreRelances: 1,
    statut: "Régularisation",
    dateEcheance: "2024-12-15",
    typeScolarite: "Mensuel",
    historiquePaiements: [
      { date: "2024-09-05", montant: 150000, mode: "Virement" },
      { date: "2024-10-08", montant: 150000, mode: "Virement" },
      { date: "2024-11-10", montant: 100000, mode: "Virement" },
    ]
  },
];

const relanceConfigs: RelanceConfig[] = [
  { 
    id: "1", 
    nom: "1ère relance - Rappel amical", 
    delai: 5, 
    canaux: ['sms', 'email'], 
    actif: true,
    messageTemplate: "Cher(e) parent, nous vous rappelons que le paiement de la scolarité de {eleve} est en attente. Montant dû: {montant} FCFA. Merci de régulariser."
  },
  { 
    id: "2", 
    nom: "2ème relance - Rappel formel", 
    delai: 15, 
    canaux: ['sms', 'email'], 
    actif: true,
    messageTemplate: "Cher(e) parent, malgré notre précédent rappel, le solde de {montant} FCFA reste impayé pour {eleve}. Veuillez régulariser dans les plus brefs délais."
  },
  { 
    id: "3", 
    nom: "3ème relance - Mise en demeure", 
    delai: 30, 
    canaux: ['email', 'appel'], 
    actif: true,
    messageTemplate: "MISE EN DEMEURE: Le paiement de {montant} FCFA pour la scolarité de {eleve} est en retard de plus de 30 jours. Sans régularisation sous 7 jours, des mesures seront prises."
  },
  { 
    id: "4", 
    nom: "Convocation Direction", 
    delai: 45, 
    canaux: ['convocation', 'appel'], 
    actif: true,
    messageTemplate: "Vous êtes convoqué(e) à la direction pour discuter du paiement de la scolarité de {eleve}. Veuillez vous présenter muni de ce courrier."
  },
];

const historiqueRelances: HistoriqueRelance[] = [
  { id: "1", date: "14 Déc 2024", type: "SMS", destinataires: 23, statut: "Envoyé", tauxOuverture: 95, montantRecouvre: 450000 },
  { id: "2", date: "12 Déc 2024", type: "Email", destinataires: 18, statut: "Envoyé", tauxOuverture: 62, montantRecouvre: 320000 },
  { id: "3", date: "10 Déc 2024", type: "SMS", destinataires: 31, statut: "Envoyé", tauxOuverture: 88, montantRecouvre: 580000 },
  { id: "4", date: "08 Déc 2024", type: "Convocation", destinataires: 5, statut: "Planifié" },
  { id: "5", date: "05 Déc 2024", type: "Email", destinataires: 42, statut: "Envoyé", tauxOuverture: 58, montantRecouvre: 750000 },
  { id: "6", date: "01 Déc 2024", type: "Appel", destinataires: 8, statut: "Envoyé", montantRecouvre: 280000 },
];

const evolutionMensuelle = [
  { mois: "Sep", impayes: 2500000, recouvre: 1800000 },
  { mois: "Oct", impayes: 2100000, recouvre: 1500000 },
  { mois: "Nov", impayes: 1900000, recouvre: 1200000 },
  { mois: "Déc", impayes: 1725000, recouvre: 800000 },
];

const repartitionStatuts = [
  { name: "Critique", value: 2, color: "#ef4444" },
  { name: "Important", value: 1, color: "#f97316" },
  { name: "Alerte", value: 2, color: "#eab308" },
  { name: "Régularisation", value: 1, color: "#22c55e" },
];

const filterConfigs: FilterConfig[] = [
  {
    key: "statut",
    label: "Statut",
    type: "select",
    options: [
      { value: "Critique", label: "Critique (+3 mois)" },
      { value: "Important", label: "Important (2 mois)" },
      { value: "Alerte", label: "Alerte (1 mois)" },
      { value: "Régularisation", label: "En régularisation" },
    ],
  },
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
    key: "montantMin",
    label: "Montant minimum",
    type: "number",
  },
];

const exportColumns = [
  { key: "eleve", label: "Élève" },
  { key: "matricule", label: "Matricule" },
  { key: "classe", label: "Classe" },
  { key: "montantDu", label: "Montant Dû (FCFA)" },
  { key: "moisRetard", label: "Retard (mois)" },
  { key: "nombreRelances", label: "Nb Relances" },
  { key: "derniereRelance", label: "Dernière Relance" },
  { key: "statut", label: "Statut" },
];

export default function Alertes() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedImpaye, setSelectedImpaye] = useState<Impaye | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [relanceDialogOpen, setRelanceDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedEleves, setSelectedEleves] = useState<string[]>([]);
  const [relanceType, setRelanceType] = useState<string>("sms");
  const [relanceMessage, setRelanceMessage] = useState("");
  
  const filteredImpayes = impayes.filter((imp) => {
    if (filters.search && !imp.eleve.toLowerCase().includes(filters.search.toLowerCase()) && !imp.matricule.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.statut && imp.statut !== filters.statut) {
      return false;
    }
    if (filters.niveau && imp.niveau !== filters.niveau) {
      return false;
    }
    if (filters.montantMin && imp.montantDu < Number(filters.montantMin)) {
      return false;
    }
    return true;
  });
  
  const totalImpayes = filteredImpayes.reduce((sum, i) => sum + i.montantDu, 0);
  const totalMontantAttendu = impayes.reduce((sum, i) => sum + i.montantTotal, 0);
  const totalMontantPaye = impayes.reduce((sum, i) => sum + i.montantPaye, 0);
  const tauxRecouvrement = ((totalMontantPaye / totalMontantAttendu) * 100).toFixed(1);
  const critiques = filteredImpayes.filter(i => i.statut === "Critique").length;
  const important = filteredImpayes.filter(i => i.statut === "Important").length;
  const alertes = filteredImpayes.filter(i => i.statut === "Alerte").length;
  const regularisation = filteredImpayes.filter(i => i.statut === "Régularisation").length;

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'Critique':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Critique</Badge>;
      case 'Important':
        return <Badge className="gap-1 bg-orange-500 hover:bg-orange-600"><AlertTriangle className="h-3 w-3" />Important</Badge>;
      case 'Alerte':
        return <Badge className="gap-1 bg-yellow-500 hover:bg-yellow-600 text-black"><AlertTriangle className="h-3 w-3" />Alerte</Badge>;
      case 'Régularisation':
        return <Badge className="gap-1 bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3" />Régularisation</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const handleSendRelance = () => {
    const count = selectedEleves.length > 0 ? selectedEleves.length : filteredImpayes.length;
    toast.success(`${relanceType === 'sms' ? 'SMS' : relanceType === 'email' ? 'Emails' : 'Appels'} envoyé(s) à ${count} parent(s)`);
    setRelanceDialogOpen(false);
    setSelectedEleves([]);
    setRelanceMessage("");
  };

  const toggleSelectEleve = (id: string) => {
    setSelectedEleves(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const formatMontant = (montant: number) => {
    if (montant >= 1000000) {
      return `${(montant / 1000000).toFixed(1)}M`;
    }
    return `${(montant / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes Impayés</h1>
          <p className="text-muted-foreground">Suivi des retards de paiement et relances automatiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfigDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configurer
          </Button>
          <Button onClick={() => setRelanceDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Envoyer Relances
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impayés</CardTitle>
            <Wallet className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatMontant(totalImpayes)} FCFA
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={100 - parseFloat(tauxRecouvrement)} className="h-2" />
              <span className="text-xs text-muted-foreground">{(100 - parseFloat(tauxRecouvrement)).toFixed(1)}% non recouvré</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Recouvrement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tauxRecouvrement}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />+2.5% ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cas Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{critiques}</div>
            <p className="text-xs text-muted-foreground">+3 mois de retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Important</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{important}</div>
            <p className="text-xs text-muted-foreground">2 mois de retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <Bell className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{alertes + regularisation}</div>
            <p className="text-xs text-muted-foreground">&lt; 2 mois de retard</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste des Impayés</TabsTrigger>
          <TabsTrigger value="relances">Configuration Relances</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Élèves avec Impayés</CardTitle>
                  <CardDescription>{filteredImpayes.length} élève(s) concerné(s)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {selectedEleves.length > 0 && (
                    <Badge variant="secondary">{selectedEleves.length} sélectionné(s)</Badge>
                  )}
                  <DataTableFilters
                    filters={filterConfigs}
                    onFilterChange={setFilters}
                    searchPlaceholder="Rechercher par nom ou matricule..."
                  />
                  <DataTableExport
                    data={filteredImpayes}
                    columns={exportColumns}
                    filename="alertes-impayes"
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
                        checked={selectedEleves.length === filteredImpayes.length && filteredImpayes.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEleves(filteredImpayes.map(i => i.id));
                          } else {
                            setSelectedEleves([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Montant Dû</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Retard</TableHead>
                    <TableHead>Relances</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredImpayes.map((imp) => (
                    <TableRow key={imp.id} className={selectedEleves.includes(imp.id) ? "bg-muted/50" : ""}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedEleves.includes(imp.id)}
                          onCheckedChange={() => toggleSelectEleve(imp.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{imp.eleve}</span>
                            <p className="text-xs text-muted-foreground">{imp.matricule}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{imp.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-red-600">
                          {formatMontant(imp.montantDu)} FCFA
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={(imp.montantPaye / imp.montantTotal) * 100} className="h-2 w-24" />
                          <span className="text-xs text-muted-foreground">
                            {formatMontant(imp.montantPaye)} / {formatMontant(imp.montantTotal)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {imp.moisRetard} mois
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BellRing className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{imp.nombreRelances}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(imp.statut)}
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
                            <DropdownMenuItem onClick={() => { setSelectedImpaye(imp); setDetailDialogOpen(true); }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Envoyer SMS
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Envoyer Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Appeler
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Enregistrer paiement
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Générer convocation
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

        <TabsContent value="relances" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuration des Relances Automatiques</CardTitle>
                  <CardDescription>Définissez les règles de relance pour les impayés</CardDescription>
                </div>
                <Button>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Nouvelle règle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relanceConfigs.map((config) => (
                  <Card key={config.id} className={config.actif ? "border-primary/50" : "opacity-60"}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{config.nom}</h4>
                            <Badge variant={config.actif ? "default" : "secondary"}>
                              {config.actif ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Déclenché {config.delai} jours après l'échéance
                          </p>
                          <div className="flex items-center gap-2">
                            {config.canaux.includes('sms') && <Badge variant="outline"><MessageSquare className="h-3 w-3 mr-1" />SMS</Badge>}
                            {config.canaux.includes('email') && <Badge variant="outline"><Mail className="h-3 w-3 mr-1" />Email</Badge>}
                            {config.canaux.includes('appel') && <Badge variant="outline"><Phone className="h-3 w-3 mr-1" />Appel</Badge>}
                            {config.canaux.includes('convocation') && <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />Convocation</Badge>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={config.actif} />
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm italic text-muted-foreground">
                          "{config.messageTemplate}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historique des Relances</CardTitle>
                  <CardDescription>Suivi des communications envoyées</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Taux d'ouverture</TableHead>
                    <TableHead>Montant recouvré</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historiqueRelances.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {h.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {h.type === 'SMS' && <MessageSquare className="h-3 w-3" />}
                          {h.type === 'Email' && <Mail className="h-3 w-3" />}
                          {h.type === 'Appel' && <Phone className="h-3 w-3" />}
                          {h.type === 'Convocation' && <FileText className="h-3 w-3" />}
                          {h.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{h.destinataires} parent(s)</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={h.statut === "Envoyé" ? "default" : h.statut === "Planifié" ? "secondary" : "destructive"}>
                          {h.statut === "Envoyé" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {h.statut === "Échoué" && <XCircle className="h-3 w-3 mr-1" />}
                          {h.statut === "Planifié" && <Clock className="h-3 w-3 mr-1" />}
                          {h.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {h.tauxOuverture ? (
                          <span className={h.tauxOuverture > 70 ? "text-green-600" : h.tauxOuverture > 50 ? "text-yellow-600" : "text-red-600"}>
                            {h.tauxOuverture}%
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        {h.montantRecouvre ? (
                          <span className="text-green-600 font-medium">
                            +{formatMontant(h.montantRecouvre)} FCFA
                          </span>
                        ) : "-"}
                      </TableCell>
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
                <CardTitle>Répartition par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={repartitionStatuts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {repartitionStatuts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={evolutionMensuelle}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                      <Tooltip formatter={(value: number) => `${formatMontant(value)} FCFA`} />
                      <Legend />
                      <Bar dataKey="impayes" name="Impayés" fill="#ef4444" />
                      <Bar dataKey="recouvre" name="Recouvré" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Indicateurs de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">2.38M</p>
                    <p className="text-sm text-muted-foreground">Recouvré ce mois</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">78%</p>
                    <p className="text-sm text-muted-foreground">Taux de réponse SMS</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-600">5.2j</p>
                    <p className="text-sm text-muted-foreground">Délai moyen paiement</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">89%</p>
                    <p className="text-sm text-muted-foreground">Efficacité relances</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Détail Impayé */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Détail de l'impayé - {selectedImpaye?.eleve}</DialogTitle>
            <DialogDescription>
              {selectedImpaye?.matricule} | {selectedImpaye?.classe}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Parent/Tuteur</p>
                  <p className="font-medium">{selectedImpaye?.parent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selectedImpaye?.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedImpaye?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type de scolarité</p>
                  <p className="font-medium">{selectedImpaye?.typeScolarite}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Situation Financière</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant total</span>
                    <span className="font-medium">{formatMontant(selectedImpaye?.montantTotal || 0)} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant payé</span>
                    <span className="font-medium text-green-600">{formatMontant(selectedImpaye?.montantPaye || 0)} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reste à payer</span>
                    <span className="font-bold text-red-600">{formatMontant(selectedImpaye?.montantDu || 0)} FCFA</span>
                  </div>
                  <Progress value={((selectedImpaye?.montantPaye || 0) / (selectedImpaye?.montantTotal || 1)) * 100} className="h-3" />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Historique des Paiements</h4>
                {selectedImpaye?.historiquePaiements.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Aucun paiement enregistré</p>
                ) : (
                  <div className="space-y-2">
                    {selectedImpaye?.historiquePaiements.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="font-medium text-sm">{formatMontant(p.montant)} FCFA</p>
                            <p className="text-xs text-muted-foreground">{p.mode}</p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(p.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Fermer
            </Button>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              SMS
            </Button>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Appeler
            </Button>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Enregistrer paiement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Envoi Relance */}
      <Dialog open={relanceDialogOpen} onOpenChange={setRelanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer des Relances</DialogTitle>
            <DialogDescription>
              Envoyer des rappels de paiement aux parents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>{selectedEleves.length > 0 ? selectedEleves.length : filteredImpayes.length}</strong> parent(s) concerné(s)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total impayés: <strong className="text-red-600">{formatMontant(
                  selectedEleves.length > 0 
                    ? impayes.filter(i => selectedEleves.includes(i.id)).reduce((sum, i) => sum + i.montantDu, 0)
                    : totalImpayes
                )} FCFA</strong>
              </p>
            </div>
            <div className="space-y-2">
              <Label>Canal de communication</Label>
              <Select value={relanceType} onValueChange={setRelanceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="both">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      SMS + Email
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Modèle de relance</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {relanceConfigs.map((config) => (
                    <SelectItem key={config.id} value={config.id}>{config.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message personnalisé (optionnel)</Label>
              <Textarea 
                placeholder="Ajoutez un message personnalisé..." 
                value={relanceMessage}
                onChange={(e) => setRelanceMessage(e.target.value)}
                rows={3}
              />
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

      {/* Dialog Configuration */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configuration des Alertes</DialogTitle>
            <DialogDescription>
              Paramétrez les seuils d'alerte et les automatisations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Seuils d'alerte</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Alerte (jours de retard)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Important (jours de retard)</Label>
                  <Input type="number" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label>Critique (jours de retard)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
                <div className="space-y-2">
                  <Label>Montant minimum alerte</Label>
                  <Input type="number" defaultValue="50000" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Notifications automatiques</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Notification quotidienne</p>
                    <p className="text-xs text-muted-foreground">Résumé des nouveaux impayés chaque matin</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Alerte cas critique</p>
                    <p className="text-xs text-muted-foreground">Notification immédiate pour les cas critiques</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Rapport hebdomadaire</p>
                    <p className="text-xs text-muted-foreground">Synthèse envoyée chaque lundi</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => { setConfigDialogOpen(false); toast.success("Configuration enregistrée"); }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
