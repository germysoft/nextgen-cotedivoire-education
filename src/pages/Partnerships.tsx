import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Handshake, 
  Users, 
  Building2,
  Calendar,
  Plus,
  DollarSign,
  FileText,
  Search,
  UserPlus,
  Vote,
  Receipt,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  Edit,
  Eye,
  Download,
  Send,
  Award,
  CreditCard,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  History,
  UserCheck,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// Mock data for members
const mockMembers = [
  { id: 1, name: "Koné Yao", role: "Président", phone: "+225 07 12 34 56", email: "kone.yao@email.com", children: ["Koné Awa (6ème A)", "Koné Moussa (3ème B)"], cotisation: 15000, status: "À jour", joinedDate: "2020-09-15" },
  { id: 2, name: "Diallo Fatou", role: "Vice-Présidente", phone: "+225 05 98 76 54", email: "diallo.fatou@email.com", children: ["Diallo Ibrahim (5ème C)"], cotisation: 15000, status: "À jour", joinedDate: "2019-09-10" },
  { id: 3, name: "Touré Amadou", role: "Trésorier", phone: "+225 07 45 67 89", email: "toure.a@email.com", children: ["Touré Mariam (4ème A)"], cotisation: 15000, status: "À jour", joinedDate: "2021-09-12" },
  { id: 4, name: "Ouattara Salimata", role: "Secrétaire", phone: "+225 01 23 45 67", email: "ouattara.s@email.com", children: ["Ouattara Karim (6ème B)", "Ouattara Aïcha (Tle D)"], cotisation: 15000, status: "À jour", joinedDate: "2018-09-08" },
  { id: 5, name: "Bamba Kouadio", role: "Membre", phone: "+225 07 89 01 23", email: "bamba.k@email.com", children: ["Bamba Seydou (5ème A)"], cotisation: 15000, status: "En retard", joinedDate: "2022-09-14" },
  { id: 6, name: "Coulibaly Fanta", role: "Membre", phone: "+225 05 34 56 78", email: "coulibaly.f@email.com", children: ["Coulibaly Mamadou (3ème A)"], cotisation: 15000, status: "À jour", joinedDate: "2023-09-11" },
  { id: 7, name: "Traoré Issouf", role: "Membre", phone: "+225 01 67 89 01", email: "traore.i@email.com", children: ["Traoré Aminata (4ème C)"], cotisation: 0, status: "Non payé", joinedDate: "2024-09-09" },
  { id: 8, name: "Sanogo Marie", role: "Membre", phone: "+225 07 23 45 67", email: "sanogo.m@email.com", children: ["Sanogo Pierre (2nde A)"], cotisation: 15000, status: "À jour", joinedDate: "2021-09-13" },
];

// Mock data for cotisations
const mockCotisations = [
  { id: 1, memberId: 1, memberName: "Koné Yao", amount: 15000, date: "2024-09-20", year: "2024-2025", method: "Espèces", receiptNo: "COT-2024-001", status: "Payé" },
  { id: 2, memberId: 2, memberName: "Diallo Fatou", amount: 15000, date: "2024-09-18", year: "2024-2025", method: "Mobile Money", receiptNo: "COT-2024-002", status: "Payé" },
  { id: 3, memberId: 3, memberName: "Touré Amadou", amount: 15000, date: "2024-09-22", year: "2024-2025", method: "Virement", receiptNo: "COT-2024-003", status: "Payé" },
  { id: 4, memberId: 4, memberName: "Ouattara Salimata", amount: 15000, date: "2024-09-25", year: "2024-2025", method: "Espèces", receiptNo: "COT-2024-004", status: "Payé" },
  { id: 5, memberId: 5, memberName: "Bamba Kouadio", amount: 7500, date: "2024-10-15", year: "2024-2025", method: "Mobile Money", receiptNo: "COT-2024-005", status: "Partiel" },
  { id: 6, memberId: 6, memberName: "Coulibaly Fanta", amount: 15000, date: "2024-09-30", year: "2024-2025", method: "Espèces", receiptNo: "COT-2024-006", status: "Payé" },
  { id: 7, memberId: 8, memberName: "Sanogo Marie", amount: 15000, date: "2024-10-05", year: "2024-2025", method: "Chèque", receiptNo: "COT-2024-007", status: "Payé" },
];

// Mock data for elections
const mockElections = [
  { 
    id: 1, 
    year: "2024-2025", 
    date: "2024-09-28", 
    status: "Terminée",
    totalVoters: 450,
    participation: 312,
    results: [
      { position: "Président", candidate: "Koné Yao", votes: 245, elected: true },
      { position: "Président", candidate: "Bamba Moussa", votes: 67, elected: false },
      { position: "Vice-Président", candidate: "Diallo Fatou", votes: 289, elected: true },
      { position: "Trésorier", candidate: "Touré Amadou", votes: 301, elected: true },
      { position: "Secrétaire", candidate: "Ouattara Salimata", votes: 278, elected: true },
    ]
  },
  { 
    id: 2, 
    year: "2023-2024", 
    date: "2023-09-30", 
    status: "Archivée",
    totalVoters: 428,
    participation: 298,
    results: [
      { position: "Président", candidate: "Diallo Fatou", votes: 198, elected: true },
      { position: "Vice-Président", candidate: "Koné Yao", votes: 245, elected: true },
    ]
  }
];

// Mock data for accounting
const mockTransactions = [
  { id: 1, date: "2024-11-15", type: "Recette", category: "Cotisations", description: "Cotisations membres novembre", amount: 75000, balance: 2575000 },
  { id: 2, date: "2024-11-10", type: "Dépense", category: "Événement", description: "Achat fournitures fête école", amount: -125000, balance: 2500000 },
  { id: 3, date: "2024-11-05", type: "Recette", category: "Don", description: "Don Orange CI - Internet", amount: 500000, balance: 2625000 },
  { id: 4, date: "2024-10-28", type: "Dépense", category: "Fournitures", description: "Papeterie secrétariat", amount: -45000, balance: 2125000 },
  { id: 5, date: "2024-10-20", type: "Recette", category: "Cotisations", description: "Cotisations membres octobre", amount: 120000, balance: 2170000 },
  { id: 6, date: "2024-10-15", type: "Dépense", category: "Transport", description: "Transport réunion DRENET", amount: -35000, balance: 2050000 },
  { id: 7, date: "2024-10-01", type: "Recette", category: "Subvention", description: "Subvention Mairie", amount: 200000, balance: 2085000 },
  { id: 8, date: "2024-09-25", type: "Dépense", category: "Formation", description: "Formation membres bureau", amount: -80000, balance: 1885000 },
];

const mockBudget = [
  { category: "Cotisations", budgeted: 6750000, realized: 4200000, percentage: 62 },
  { category: "Événements", budgeted: 1500000, realized: 850000, percentage: 57 },
  { category: "Fournitures", budgeted: 300000, realized: 145000, percentage: 48 },
  { category: "Transport", budgeted: 200000, realized: 95000, percentage: 48 },
  { category: "Formation", budgeted: 400000, realized: 180000, percentage: 45 },
  { category: "Réserve", budgeted: 500000, realized: 500000, percentage: 100 },
];

const monthlyData = [
  { month: "Sept", recettes: 1200000, depenses: 350000 },
  { month: "Oct", recettes: 450000, depenses: 285000 },
  { month: "Nov", recettes: 575000, depenses: 170000 },
  { month: "Déc", recettes: 0, depenses: 0 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Partnerships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddCotisation, setShowAddCotisation] = useState(false);
  const [showElectionDetails, setShowElectionDetails] = useState(false);
  const [selectedElection, setSelectedElection] = useState<typeof mockElections[0] | null>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const totalMembers = mockMembers.length;
  const membersUpToDate = mockMembers.filter(m => m.status === "À jour").length;
  const totalCotisations = mockCotisations.reduce((acc, c) => acc + c.amount, 0);
  const pendingCotisations = mockMembers.filter(m => m.status !== "À jour").length;
  
  const totalRecettes = mockTransactions.filter(t => t.type === "Recette").reduce((acc, t) => acc + t.amount, 0);
  const totalDepenses = Math.abs(mockTransactions.filter(t => t.type === "Dépense").reduce((acc, t) => acc + t.amount, 0));
  const soldeActuel = 2575000;

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (member: typeof mockMembers[0]) => {
    toast.success(`Rappel envoyé à ${member.name}`);
  };

  const handlePrintReceipt = (cotisation: typeof mockCotisations[0]) => {
    toast.success(`Reçu ${cotisation.receiptNo} en cours d'impression`);
  };

  const pieData = [
    { name: "À jour", value: membersUpToDate, color: "hsl(142, 76%, 36%)" },
    { name: "En retard", value: mockMembers.filter(m => m.status === "En retard").length, color: "hsl(38, 92%, 50%)" },
    { name: "Non payé", value: mockMembers.filter(m => m.status === "Non payé").length, color: "hsl(0, 84%, 60%)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Association des Parents d'Élèves (APEL)</h1>
          <p className="text-muted-foreground">Gestion complète de l'association - Année 2024-2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres Inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">{membersUpToDate} à jour ({Math.round(membersUpToDate/totalMembers*100)}%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotisations Perçues</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCotisations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA collectés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotisations En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCotisations}</div>
            <p className="text-xs text-muted-foreground">membres en retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Caisse</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{soldeActuel.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureau Actuel</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">membres élus</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="members">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="members">
                <Users className="mr-2 h-4 w-4" />
                Membres
              </TabsTrigger>
              <TabsTrigger value="cotisations">
                <Receipt className="mr-2 h-4 w-4" />
                Cotisations
              </TabsTrigger>
              <TabsTrigger value="elections">
                <Vote className="mr-2 h-4 w-4" />
                Élections
              </TabsTrigger>
              <TabsTrigger value="accounting">
                <BarChart3 className="mr-2 h-4 w-4" />
                Comptabilité
              </TabsTrigger>
              <TabsTrigger value="budget">
                <Wallet className="mr-2 h-4 w-4" />
                Budget
              </TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un membre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="À jour">À jour</SelectItem>
                      <SelectItem value="En retard">En retard</SelectItem>
                      <SelectItem value="Non payé">Non payé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Nouveau Membre
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un Membre APEL</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input placeholder="Nom et prénom" />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input placeholder="+225 XX XX XX XX" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="email@exemple.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Rôle</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="membre">Membre</SelectItem>
                            <SelectItem value="president">Président</SelectItem>
                            <SelectItem value="vice-president">Vice-Président</SelectItem>
                            <SelectItem value="tresorier">Trésorier</SelectItem>
                            <SelectItem value="secretaire">Secrétaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Enfants inscrits</Label>
                        <Textarea placeholder="Nom et classe de chaque enfant (un par ligne)" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddMember(false)}>Annuler</Button>
                      <Button onClick={() => { setShowAddMember(false); toast.success("Membre ajouté avec succès"); }}>
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card className="bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">À jour</p>
                        <p className="text-2xl font-bold text-green-600">{membersUpToDate}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 dark:bg-orange-950/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">En retard</p>
                        <p className="text-2xl font-bold text-orange-600">{mockMembers.filter(m => m.status === "En retard").length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Non payé</p>
                        <p className="text-2xl font-bold text-red-600">{mockMembers.filter(m => m.status === "Non payé").length}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membre</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Enfants</TableHead>
                    <TableHead>Cotisation</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{member.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">Depuis {member.joinedDate}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.role === "Membre" ? "outline" : "default"}>
                          {member.role === "Président" && <Crown className="mr-1 h-3 w-3" />}
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" /> {member.phone}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {member.children.map((child, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs mr-1">
                              {child}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {member.cotisation.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          member.status === "À jour" ? "default" :
                          member.status === "En retard" ? "secondary" : "destructive"
                        }>
                          {member.status === "À jour" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {member.status === "En retard" && <Clock className="mr-1 h-3 w-3" />}
                          {member.status === "Non payé" && <XCircle className="mr-1 h-3 w-3" />}
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {member.status !== "À jour" && (
                            <Button size="sm" variant="ghost" onClick={() => handleSendReminder(member)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Cotisations Tab */}
            <TabsContent value="cotisations" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Select defaultValue="2024-2025">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Année scolaire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="Payé">Payé</SelectItem>
                      <SelectItem value="Partiel">Partiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.success("Rappels envoyés à tous les membres en retard")}>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer Rappels
                  </Button>
                  <Dialog open={showAddCotisation} onOpenChange={setShowAddCotisation}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Enregistrer Cotisation
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enregistrer une Cotisation</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Membre</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un membre" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockMembers.map(m => (
                                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Montant (FCFA)</Label>
                          <Input type="number" placeholder="15000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Mode de paiement</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="especes">Espèces</SelectItem>
                              <SelectItem value="mobile">Mobile Money</SelectItem>
                              <SelectItem value="virement">Virement</SelectItem>
                              <SelectItem value="cheque">Chèque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddCotisation(false)}>Annuler</Button>
                        <Button onClick={() => { setShowAddCotisation(false); toast.success("Cotisation enregistrée"); }}>
                          Enregistrer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Collecté</p>
                        <p className="text-xl font-bold">{totalCotisations.toLocaleString()} FCFA</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Objectif Annuel</p>
                        <p className="text-xl font-bold">6 750 000 FCFA</p>
                      </div>
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Taux Recouvrement</p>
                        <p className="text-xl font-bold">{Math.round(totalCotisations / 6750000 * 100)}%</p>
                      </div>
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <Progress value={Math.round(totalCotisations / 6750000 * 100)} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Cotisation / Membre</p>
                        <p className="text-xl font-bold">15 000 FCFA</p>
                      </div>
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Reçu</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Membre</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCotisations.map((cot) => (
                    <TableRow key={cot.id}>
                      <TableCell className="font-mono text-sm">{cot.receiptNo}</TableCell>
                      <TableCell>{cot.date}</TableCell>
                      <TableCell className="font-medium">{cot.memberName}</TableCell>
                      <TableCell className="font-mono">{cot.amount.toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cot.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cot.status === "Payé" ? "default" : "secondary"}>
                          {cot.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => handlePrintReceipt(cot)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Elections Tab */}
            <TabsContent value="elections" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Élections du Bureau APEL</h3>
                  <p className="text-sm text-muted-foreground">Gestion des mandats et processus électoral</p>
                </div>
                <Button>
                  <Vote className="mr-2 h-4 w-4" />
                  Nouvelle Élection
                </Button>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Bureau Actuel (2024-2025)
                  </CardTitle>
                  <CardDescription>Mandat en cours depuis le 28 septembre 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {mockMembers.filter(m => m.role !== "Membre").map((member) => (
                      <Card key={member.id}>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <span className="text-xl font-bold">{member.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <p className="font-semibold">{member.name}</p>
                            <Badge variant="default" className="mt-2">
                              {member.role === "Président" && <Crown className="mr-1 h-3 w-3" />}
                              {member.role}
                            </Badge>
                            <div className="mt-3 text-xs text-muted-foreground">
                              <p><Phone className="inline h-3 w-3 mr-1" />{member.phone}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique des Élections</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Année</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Inscrits</TableHead>
                        <TableHead>Participation</TableHead>
                        <TableHead>Taux</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockElections.map((election) => (
                        <TableRow key={election.id}>
                          <TableCell className="font-medium">{election.year}</TableCell>
                          <TableCell>{election.date}</TableCell>
                          <TableCell>{election.totalVoters}</TableCell>
                          <TableCell>{election.participation}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.round(election.participation / election.totalVoters * 100)} className="w-16" />
                              <span className="text-sm">{Math.round(election.participation / election.totalVoters * 100)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={election.status === "Terminée" ? "default" : "secondary"}>
                              {election.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedElection(election);
                                setShowElectionDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Résultats
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Dialog open={showElectionDetails} onOpenChange={setShowElectionDetails}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Résultats Élection {selectedElection?.year}</DialogTitle>
                  </DialogHeader>
                  {selectedElection && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground">Inscrits</p>
                            <p className="text-2xl font-bold">{selectedElection.totalVoters}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground">Votants</p>
                            <p className="text-2xl font-bold">{selectedElection.participation}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground">Participation</p>
                            <p className="text-2xl font-bold">{Math.round(selectedElection.participation / selectedElection.totalVoters * 100)}%</p>
                          </CardContent>
                        </Card>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Poste</TableHead>
                            <TableHead>Candidat</TableHead>
                            <TableHead>Voix</TableHead>
                            <TableHead>%</TableHead>
                            <TableHead>Résultat</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedElection.results.map((result, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{result.position}</TableCell>
                              <TableCell>{result.candidate}</TableCell>
                              <TableCell>{result.votes}</TableCell>
                              <TableCell>{Math.round(result.votes / selectedElection.participation * 100)}%</TableCell>
                              <TableCell>
                                {result.elected ? (
                                  <Badge className="bg-green-600">
                                    <UserCheck className="mr-1 h-3 w-3" />
                                    Élu(e)
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Non élu(e)</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Accounting Tab */}
            <TabsContent value="accounting" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Journal Comptable</h3>
                  <p className="text-sm text-muted-foreground">Mouvements de caisse APEL</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle Opération
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enregistrer une Opération</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Type d'opération" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recette">Recette</SelectItem>
                              <SelectItem value="depense">Dépense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Catégorie</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cotisations">Cotisations</SelectItem>
                              <SelectItem value="don">Don</SelectItem>
                              <SelectItem value="subvention">Subvention</SelectItem>
                              <SelectItem value="evenement">Événement</SelectItem>
                              <SelectItem value="fournitures">Fournitures</SelectItem>
                              <SelectItem value="transport">Transport</SelectItem>
                              <SelectItem value="formation">Formation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input placeholder="Description de l'opération" />
                        </div>
                        <div className="space-y-2">
                          <Label>Montant (FCFA)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddTransaction(false)}>Annuler</Button>
                        <Button onClick={() => { setShowAddTransaction(false); toast.success("Opération enregistrée"); }}>
                          Enregistrer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Recettes</p>
                        <p className="text-xl font-bold text-green-600">{totalRecettes.toLocaleString()} FCFA</p>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Dépenses</p>
                        <p className="text-xl font-bold text-red-600">{totalDepenses.toLocaleString()} FCFA</p>
                      </div>
                      <ArrowDownRight className="h-6 w-6 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Solde Actuel</p>
                        <p className="text-xl font-bold text-blue-600">{soldeActuel.toLocaleString()} FCFA</p>
                      </div>
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Opérations</p>
                        <p className="text-xl font-bold">{mockTransactions.length}</p>
                      </div>
                      <History className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Évolution Mensuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                        <Legend />
                        <Bar dataKey="recettes" name="Recettes" fill="hsl(142, 76%, 36%)" />
                        <Bar dataKey="depenses" name="Dépenses" fill="hsl(0, 84%, 60%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Répartition par Catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="text-right">Solde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.date}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === "Recette" ? "default" : "destructive"}>
                          {tx.type === "Recette" ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.category}</Badge>
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell className={`text-right font-mono ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {tx.balance.toLocaleString()} FCFA
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Budget Tab */}
            <TabsContent value="budget" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Suivi Budgétaire 2024-2025</h3>
                  <p className="text-sm text-muted-foreground">Comparaison budget prévisionnel vs réalisé</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Rapport PDF
                  </Button>
                  <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier Budget
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Budget Total</p>
                      <p className="text-2xl font-bold">{mockBudget.reduce((acc, b) => acc + b.budgeted, 0).toLocaleString()} FCFA</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Réalisé</p>
                      <p className="text-2xl font-bold text-green-600">{mockBudget.reduce((acc, b) => acc + b.realized, 0).toLocaleString()} FCFA</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Taux d'Exécution</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(mockBudget.reduce((acc, b) => acc + b.realized, 0) / mockBudget.reduce((acc, b) => acc + b.budgeted, 0) * 100)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Exécution par Catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockBudget} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                      <YAxis type="category" dataKey="category" width={100} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                      <Legend />
                      <Bar dataKey="budgeted" name="Budget" fill="hsl(var(--muted))" />
                      <Bar dataKey="realized" name="Réalisé" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Budget Prévu</TableHead>
                    <TableHead className="text-right">Réalisé</TableHead>
                    <TableHead className="text-right">Reste</TableHead>
                    <TableHead>Progression</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBudget.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-right font-mono">{item.budgeted.toLocaleString()} FCFA</TableCell>
                      <TableCell className="text-right font-mono text-green-600">{item.realized.toLocaleString()} FCFA</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {(item.budgeted - item.realized).toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.percentage} className="w-24" />
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
