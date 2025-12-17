import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Printer,
  Search,
  Filter,
  Calendar,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  Edit,
  FileText,
  History,
  CreditCard,
  Banknote,
  Building,
  Smartphone,
  Receipt,
  PiggyBank,
  BarChart3,
  ArrowRightLeft
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Mock data for cash transactions
const mockCaisseTransactions = [
  { id: 1, date: "2024-11-17 14:30", reference: "CAI-2024-0547", type: "Entrée", category: "Scolarité", description: "Paiement frais 1er trimestre - Koné Awa", amount: 150000, paymentMethod: "Espèces", operator: "Secrétaire", status: "validé", student: "Koné Awa" },
  { id: 2, date: "2024-11-17 13:45", reference: "CAI-2024-0546", type: "Sortie", category: "Fournitures", description: "Achat papeterie secrétariat", amount: 25000, paymentMethod: "Espèces", operator: "Intendant", status: "validé", student: null },
  { id: 3, date: "2024-11-17 11:20", reference: "CAI-2024-0545", type: "Entrée", category: "Cantine", description: "Abonnement cantine novembre - Diallo Ibrahim", amount: 35000, paymentMethod: "Mobile Money", operator: "Caissier", status: "validé", student: "Diallo Ibrahim" },
  { id: 4, date: "2024-11-17 10:00", reference: "CAI-2024-0544", type: "Entrée", category: "Inscription", description: "Frais d'inscription - Touré Mariam", amount: 50000, paymentMethod: "Espèces", operator: "Secrétaire", status: "validé", student: "Touré Mariam" },
  { id: 5, date: "2024-11-17 09:15", reference: "CAI-2024-0543", type: "Sortie", category: "Transport", description: "Carburant véhicule administratif", amount: 15000, paymentMethod: "Espèces", operator: "Intendant", status: "validé", student: null },
  { id: 6, date: "2024-11-16 16:30", reference: "CAI-2024-0542", type: "Entrée", category: "Scolarité", description: "Paiement frais - Ouattara Karim", amount: 75000, paymentMethod: "Chèque", operator: "Caissier", status: "en_attente", student: "Ouattara Karim" },
  { id: 7, date: "2024-11-16 15:00", reference: "CAI-2024-0541", type: "Sortie", category: "Maintenance", description: "Réparation climatisation bureau", amount: 45000, paymentMethod: "Espèces", operator: "Intendant", status: "validé", student: null },
  { id: 8, date: "2024-11-16 14:00", reference: "CAI-2024-0540", type: "Entrée", category: "Transport", description: "Abonnement transport - Bamba Seydou", amount: 25000, paymentMethod: "Mobile Money", operator: "Secrétaire", status: "validé", student: "Bamba Seydou" },
];

// Mock cash boxes
const mockCaisses = [
  { id: 1, name: "Caisse Principale", code: "CP-001", balance: 2450000, limit: 5000000, operator: "Secrétaire Principal", status: "ouverte", lastOperation: "2024-11-17 14:30" },
  { id: 2, name: "Caisse Scolarité", code: "CS-001", balance: 850000, limit: 2000000, operator: "Agent Comptable", status: "ouverte", lastOperation: "2024-11-17 13:45" },
  { id: 3, name: "Caisse Cantine", code: "CC-001", balance: 325000, limit: 500000, operator: "Responsable Cantine", status: "ouverte", lastOperation: "2024-11-17 11:20" },
];

// Mock closing reports
const mockCloturesJournalieres = [
  { id: 1, date: "2024-11-16", caisse: "Caisse Principale", ouverture: 2200000, entrees: 350000, sorties: 100000, fermeture: 2450000, ecart: 0, operator: "Secrétaire Principal", status: "validé" },
  { id: 2, date: "2024-11-15", caisse: "Caisse Principale", ouverture: 1950000, entrees: 425000, sorties: 175000, fermeture: 2200000, ecart: 0, operator: "Secrétaire Principal", status: "validé" },
  { id: 3, date: "2024-11-14", caisse: "Caisse Principale", ouverture: 1800000, entrees: 280000, sorties: 130000, fermeture: 1950000, ecart: 0, operator: "Agent Comptable", status: "validé" },
];

// Weekly evolution data
const weeklyData = [
  { jour: "Lun", entrees: 450000, sorties: 125000 },
  { jour: "Mar", entrees: 380000, sorties: 95000 },
  { jour: "Mer", entrees: 520000, sorties: 180000 },
  { jour: "Jeu", entrees: 290000, sorties: 75000 },
  { jour: "Ven", entrees: 610000, sorties: 220000 },
  { jour: "Sam", entrees: 150000, sorties: 45000 },
];

// Payment methods distribution
const paymentMethodsData = [
  { name: "Espèces", value: 65, color: "hsl(var(--primary))" },
  { name: "Mobile Money", value: 25, color: "hsl(142, 76%, 36%)" },
  { name: "Chèque", value: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Virement", value: 2, color: "hsl(0, 84%, 60%)" },
];

const COLORS = ['hsl(var(--primary))', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

export default function CaissePage() {
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [showClotureDialog, setShowClotureDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCaisse, setSelectedCaisse] = useState<typeof mockCaisses[0] | null>(mockCaisses[0]);

  const todayEntrees = mockCaisseTransactions
    .filter(t => t.date.startsWith("2024-11-17") && t.type === "Entrée" && t.status === "validé")
    .reduce((acc, t) => acc + t.amount, 0);
  
  const todaySorties = mockCaisseTransactions
    .filter(t => t.date.startsWith("2024-11-17") && t.type === "Sortie" && t.status === "validé")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = mockCaisses.reduce((acc, c) => acc + c.balance, 0);
  const transactionsToday = mockCaisseTransactions.filter(t => t.date.startsWith("2024-11-17")).length;

  const filteredTransactions = mockCaisseTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion de Caisse</h1>
          <p className="text-muted-foreground">Suivi des mouvements de caisse et trésorerie</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Rapport de caisse généré")}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Dialog open={showClotureDialog} onOpenChange={setShowClotureDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Clôture Journalière
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Clôture Journalière de Caisse</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Caisse</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCaisses.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" defaultValue="2024-11-17" />
                  </div>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Solde Ouverture</p>
                        <p className="text-xl font-bold">2 200 000 FCFA</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entrées</p>
                        <p className="text-xl font-bold text-green-600">+{todayEntrees.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sorties</p>
                        <p className="text-xl font-bold text-red-600">-{todaySorties.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Solde Théorique</p>
                        <p className="text-xl font-bold">{(2200000 + todayEntrees - todaySorties).toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-2">
                  <Label>Solde Physique Constaté (FCFA)</Label>
                  <Input type="number" placeholder="2450000" />
                </div>
                <div className="space-y-2">
                  <Label>Observations</Label>
                  <Textarea placeholder="Notes ou remarques sur la clôture..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowClotureDialog(false)}>Annuler</Button>
                <Button onClick={() => { setShowClotureDialog(false); toast.success("Clôture journalière effectuée"); }}>
                  <Lock className="mr-2 h-4 w-4" />
                  Valider la Clôture
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showNewTransaction} onOpenChange={setShowNewTransaction}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Opération
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvelle Opération de Caisse</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type d'opération</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entree">Entrée (Encaissement)</SelectItem>
                        <SelectItem value="sortie">Sortie (Décaissement)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Caisse</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCaisses.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scolarite">Scolarité</SelectItem>
                        <SelectItem value="inscription">Inscription</SelectItem>
                        <SelectItem value="cantine">Cantine</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="fournitures">Fournitures</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="autres">Autres</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="cheque">Chèque</SelectItem>
                        <SelectItem value="virement">Virement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Montant (FCFA)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Élève (si applicable)</Label>
                    <Input placeholder="Rechercher un élève..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description / Motif</Label>
                  <Textarea placeholder="Description détaillée de l'opération..." />
                </div>
                <div className="space-y-2">
                  <Label>Pièce justificative</Label>
                  <Input type="file" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewTransaction(false)}>Annuler</Button>
                <Button onClick={() => { setShowNewTransaction(false); toast.success("Opération enregistrée avec succès"); }}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Total Caisses</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA disponibles</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entrées Aujourd'hui</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{todayEntrees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA encaissés</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorties Aujourd'hui</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{todaySorties.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA décaissés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionsToday}</div>
            <p className="text-xs text-muted-foreground">opérations aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caisses Actives</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCaisses.filter(c => c.status === "ouverte").length}</div>
            <p className="text-xs text-muted-foreground">sur {mockCaisses.length} caisses</p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Boxes Overview */}
      <div className="grid grid-cols-3 gap-4">
        {mockCaisses.map((caisse) => (
          <Card key={caisse.id} className={`cursor-pointer transition-all ${selectedCaisse?.id === caisse.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedCaisse(caisse)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{caisse.name}</CardTitle>
                <Badge variant={caisse.status === "ouverte" ? "default" : "secondary"}>
                  {caisse.status === "ouverte" ? <Unlock className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
                  {caisse.status}
                </Badge>
              </div>
              <CardDescription>{caisse.code} • {caisse.operator}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Solde</span>
                  <span className="font-bold">{caisse.balance.toLocaleString()} FCFA</span>
                </div>
                <Progress value={(caisse.balance / caisse.limit) * 100} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Plafond: {caisse.limit.toLocaleString()} FCFA</span>
                  <span>{Math.round((caisse.balance / caisse.limit) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">
            <Receipt className="mr-2 h-4 w-4" />
            Mouvements
          </TabsTrigger>
          <TabsTrigger value="clotures">
            <Lock className="mr-2 h-4 w-4" />
            Clôtures
          </TabsTrigger>
          <TabsTrigger value="analyse">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analyse
          </TabsTrigger>
          <TabsTrigger value="transferts">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transferts
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mouvements de Caisse</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="Entrée">Entrées</SelectItem>
                      <SelectItem value="Sortie">Sorties</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="Scolarité">Scolarité</SelectItem>
                      <SelectItem value="Inscription">Inscription</SelectItem>
                      <SelectItem value="Cantine">Cantine</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Fournitures">Fournitures</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.date}</TableCell>
                      <TableCell className="font-mono text-sm">{tx.reference}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === "Entrée" ? "default" : "destructive"}>
                          {tx.type === "Entrée" ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{tx.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          {tx.paymentMethod === "Espèces" && <Banknote className="h-3 w-3" />}
                          {tx.paymentMethod === "Mobile Money" && <Smartphone className="h-3 w-3" />}
                          {tx.paymentMethod === "Chèque" && <FileText className="h-3 w-3" />}
                          {tx.paymentMethod === "Virement" && <Building className="h-3 w-3" />}
                          {tx.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-mono font-bold ${tx.type === "Entrée" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "Entrée" ? "+" : "-"}{tx.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === "validé" ? "default" : "secondary"}>
                          {tx.status === "validé" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                          {tx.status === "validé" ? "Validé" : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Printer className="h-4 w-4" />
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

        {/* Closures Tab */}
        <TabsContent value="clotures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Clôtures Journalières</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Caisse</TableHead>
                    <TableHead className="text-right">Solde Ouverture</TableHead>
                    <TableHead className="text-right">Entrées</TableHead>
                    <TableHead className="text-right">Sorties</TableHead>
                    <TableHead className="text-right">Solde Fermeture</TableHead>
                    <TableHead className="text-right">Écart</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCloturesJournalieres.map((cloture) => (
                    <TableRow key={cloture.id}>
                      <TableCell className="font-mono">{cloture.date}</TableCell>
                      <TableCell className="font-medium">{cloture.caisse}</TableCell>
                      <TableCell className="text-right font-mono">{cloture.ouverture.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-green-600">+{cloture.entrees.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-red-600">-{cloture.sorties.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-bold">{cloture.fermeture.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={cloture.ecart === 0 ? "default" : "destructive"}>
                          {cloture.ecart === 0 ? "0" : cloture.ecart.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>{cloture.operator}</TableCell>
                      <TableCell>
                        <Badge variant="default">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {cloture.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analyse" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Évolution Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jour" />
                    <YAxis tickFormatter={(v) => `${(v/1000)}k`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                    <Legend />
                    <Bar dataKey="entrees" name="Entrées" fill="hsl(142, 76%, 36%)" />
                    <Bar dataKey="sorties" name="Sorties" fill="hsl(0, 84%, 60%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Modes de Paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transferts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transferts Inter-Caisses</CardTitle>
                  <CardDescription>Mouvement de fonds entre les différentes caisses</CardDescription>
                </div>
                <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      Nouveau Transfert
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Transfert Inter-Caisses</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Caisse Source</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCaisses.map(c => (
                              <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name} ({c.balance.toLocaleString()} FCFA)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Caisse Destination</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCaisses.map(c => (
                              <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name} ({c.balance.toLocaleString()} FCFA)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Montant (FCFA)</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Motif</Label>
                        <Textarea placeholder="Raison du transfert..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowTransferDialog(false)}>Annuler</Button>
                      <Button onClick={() => { setShowTransferDialog(false); toast.success("Transfert effectué"); }}>
                        Effectuer le Transfert
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Opérateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-15</TableCell>
                    <TableCell className="font-mono">TRF-2024-012</TableCell>
                    <TableCell>Caisse Principale</TableCell>
                    <TableCell>Caisse Cantine</TableCell>
                    <TableCell className="text-right font-mono">100 000 FCFA</TableCell>
                    <TableCell>Approvisionnement cantine</TableCell>
                    <TableCell>Comptable</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-10</TableCell>
                    <TableCell className="font-mono">TRF-2024-011</TableCell>
                    <TableCell>Caisse Scolarité</TableCell>
                    <TableCell>Caisse Principale</TableCell>
                    <TableCell className="text-right font-mono">500 000 FCFA</TableCell>
                    <TableCell>Centralisation recettes</TableCell>
                    <TableCell>Comptable</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
