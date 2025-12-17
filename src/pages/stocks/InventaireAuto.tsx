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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Package, 
  QrCode,
  Scan,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar as CalendarIcon,
  Clock,
  Users,
  FileText,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Printer,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  Camera,
  Smartphone,
  History,
  ArrowRight,
  CheckCheck,
  Timer,
  MapPin,
  Box
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for inventory sessions
const mockInventorySessions = [
  { 
    id: 1, 
    date: "2024-11-15", 
    type: "Complet", 
    status: "completed",
    itemsTotal: 156,
    itemsScanned: 156,
    discrepancies: 8,
    operators: ["Koné Yao", "Diallo Fatou"],
    duration: "4h 30min",
    value: 24650000,
    reconciled: true
  },
  { 
    id: 2, 
    date: "2024-10-15", 
    type: "Partiel - Fournitures", 
    status: "completed",
    itemsTotal: 45,
    itemsScanned: 45,
    discrepancies: 3,
    operators: ["Touré Amadou"],
    duration: "1h 15min",
    value: 462500,
    reconciled: true
  },
  { 
    id: 3, 
    date: "2024-09-01", 
    type: "Complet - Rentrée", 
    status: "completed",
    itemsTotal: 156,
    itemsScanned: 156,
    discrepancies: 12,
    operators: ["Koné Yao", "Diallo Fatou", "Bamba Kouadio"],
    duration: "6h 00min",
    value: 24850000,
    reconciled: true
  },
];

// Mock data for inventory items
const mockInventoryItems = [
  { 
    id: 1, 
    code: "FRN-CAH-001", 
    name: "Cahiers 200 pages", 
    category: "Fournitures",
    location: "Magasin A - Étagère 1",
    theoreticalQty: 150,
    countedQty: 145,
    discrepancy: -5,
    status: "discrepancy",
    lastCount: "2024-11-15",
    qrCode: "QR-FRN-CAH-001",
    unitValue: 500
  },
  { 
    id: 2, 
    code: "FRN-STY-002", 
    name: "Stylos bleus (boîte)", 
    category: "Fournitures",
    location: "Magasin A - Étagère 2",
    theoreticalQty: 45,
    countedQty: 45,
    discrepancy: 0,
    status: "ok",
    lastCount: "2024-11-15",
    qrCode: "QR-FRN-STY-002",
    unitValue: 500
  },
  { 
    id: 3, 
    code: "BUR-RAM-001", 
    name: "Ramettes A4", 
    category: "Bureautique",
    location: "Magasin B - Rack 1",
    theoreticalQty: 120,
    countedQty: 118,
    discrepancy: -2,
    status: "discrepancy",
    lastCount: "2024-11-15",
    qrCode: "QR-BUR-RAM-001",
    unitValue: 2000
  },
  { 
    id: 4, 
    code: "INFO-PC-001", 
    name: "Ordinateur Dell OptiPlex", 
    category: "Informatique",
    location: "Salle Info A",
    theoreticalQty: 25,
    countedQty: 25,
    discrepancy: 0,
    status: "ok",
    lastCount: "2024-11-15",
    qrCode: "QR-INFO-PC-001",
    unitValue: 500000
  },
  { 
    id: 5, 
    code: "AV-PROJ-001", 
    name: "Vidéoprojecteur Epson", 
    category: "Audiovisuel",
    location: "Salle de Conférence",
    theoreticalQty: 8,
    countedQty: 7,
    discrepancy: -1,
    status: "discrepancy",
    lastCount: "2024-11-15",
    qrCode: "QR-AV-PROJ-001",
    unitValue: 500000
  },
  { 
    id: 6, 
    code: "LAB-MICRO-001", 
    name: "Microscopes", 
    category: "Laboratoire",
    location: "Labo Sciences",
    theoreticalQty: 12,
    countedQty: 12,
    discrepancy: 0,
    status: "ok",
    lastCount: "2024-11-15",
    qrCode: "QR-LAB-MICRO-001",
    unitValue: 200000
  },
  { 
    id: 7, 
    code: "PED-MRQ-001", 
    name: "Marqueurs tableau", 
    category: "Matériel pédagogique",
    location: "Magasin A - Étagère 3",
    theoreticalQty: 20,
    countedQty: 22,
    discrepancy: 2,
    status: "surplus",
    lastCount: "2024-11-15",
    qrCode: "QR-PED-MRQ-001",
    unitValue: 1500
  },
];

// Mock discrepancy reports
const mockDiscrepancies = [
  { id: 1, item: "Cahiers 200 pages", expected: 150, counted: 145, difference: -5, reason: "Perte non déclarée", action: "Ajustement stock", status: "resolved", date: "2024-11-15" },
  { id: 2, item: "Ramettes A4", expected: 120, counted: 118, difference: -2, reason: "Erreur de saisie sortie", action: "Correction mouvement", status: "resolved", date: "2024-11-15" },
  { id: 3, item: "Vidéoprojecteur Epson", expected: 8, counted: 7, difference: -1, reason: "En réparation", action: "Mise à jour localisation", status: "pending", date: "2024-11-15" },
  { id: 4, item: "Marqueurs tableau", expected: 20, counted: 22, difference: 2, reason: "Entrée non enregistrée", action: "Régularisation", status: "resolved", date: "2024-11-15" },
];

// Mock locations
const mockLocations = [
  { id: 1, name: "Magasin A - Étagère 1", itemCount: 12, lastInventory: "2024-11-15" },
  { id: 2, name: "Magasin A - Étagère 2", itemCount: 8, lastInventory: "2024-11-15" },
  { id: 3, name: "Magasin A - Étagère 3", itemCount: 15, lastInventory: "2024-11-15" },
  { id: 4, name: "Magasin B - Rack 1", itemCount: 20, lastInventory: "2024-11-15" },
  { id: 5, name: "Salle Info A", itemCount: 25, lastInventory: "2024-11-15" },
  { id: 6, name: "Salle Info B", itemCount: 20, lastInventory: "2024-11-15" },
  { id: 7, name: "Labo Sciences", itemCount: 35, lastInventory: "2024-11-15" },
  { id: 8, name: "Salle de Conférence", itemCount: 10, lastInventory: "2024-11-15" },
];

const discrepancyByCategory = [
  { category: "Fournitures", ok: 38, discrepancy: 7 },
  { category: "Bureautique", ok: 15, discrepancy: 2 },
  { category: "Informatique", ok: 48, discrepancy: 2 },
  { category: "Audiovisuel", ok: 12, discrepancy: 1 },
  { category: "Laboratoire", ok: 28, discrepancy: 1 },
];

const COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)', 'hsl(38, 92%, 50%)'];

export default function InventaireAuto() {
  const [showNewSession, setShowNewSession] = useState(false);
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof mockInventoryItems[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [scannedCode, setScannedCode] = useState("");
  const [countedQty, setCountedQty] = useState("");

  const totalItems = mockInventoryItems.length;
  const itemsWithDiscrepancy = mockInventoryItems.filter(i => i.status === "discrepancy").length;
  const itemsOk = mockInventoryItems.filter(i => i.status === "ok").length;
  const totalValue = mockInventoryItems.reduce((acc, i) => acc + (i.countedQty * i.unitValue), 0);

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleScan = () => {
    if (scannedCode) {
      const item = mockInventoryItems.find(i => i.qrCode === scannedCode || i.code === scannedCode);
      if (item) {
        setSelectedItem(item);
        toast.success(`Article trouvé: ${item.name}`);
      } else {
        toast.error("Code non reconnu");
      }
    }
  };

  const handleCountSubmit = () => {
    if (selectedItem && countedQty) {
      toast.success(`Comptage enregistré: ${countedQty} ${selectedItem.name}`);
      setCountedQty("");
      setSelectedItem(null);
      setShowScanDialog(false);
    }
  };

  const pieData = [
    { name: "Conforme", value: itemsOk, color: COLORS[0] },
    { name: "Écart", value: itemsWithDiscrepancy, color: COLORS[1] },
    { name: "Surplus", value: mockInventoryItems.filter(i => i.status === "surplus").length, color: COLORS[2] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventaire Automatique</h1>
          <p className="text-muted-foreground">Gestion des inventaires avec scan QR/code-barres</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Scan className="mr-2 h-4 w-4" />
                Scanner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scanner un Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center bg-muted/50">
                    <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Zone de scan</p>
                    <p className="text-xs text-muted-foreground">(Simulation)</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Ou entrez le code manuellement:</p>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="QR-XXX-XXX-XXX ou FRN-XXX-XXX" 
                      value={scannedCode}
                      onChange={(e) => setScannedCode(e.target.value)}
                    />
                    <Button onClick={handleScan}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {selectedItem && (
                  <Card className="bg-primary/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Package className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{selectedItem.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedItem.code}</p>
                          <p className="text-xs text-muted-foreground">{selectedItem.location}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <Label>Quantité théorique</Label>
                          <p className="text-2xl font-bold">{selectedItem.theoreticalQty}</p>
                        </div>
                        <div>
                          <Label>Quantité comptée</Label>
                          <Input 
                            type="number" 
                            placeholder="0"
                            value={countedQty}
                            onChange={(e) => setCountedQty(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button className="w-full mt-4" onClick={handleCountSubmit}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Valider le Comptage
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showNewSession} onOpenChange={setShowNewSession}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Inventaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Démarrer un Inventaire</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type d'inventaire</Label>
                    <Select defaultValue="complet">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complet">Inventaire Complet</SelectItem>
                        <SelectItem value="partiel">Inventaire Partiel</SelectItem>
                        <SelectItem value="tournant">Inventaire Tournant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(new Date(), "dd MMMM yyyy", { locale: fr })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar mode="single" locale={fr} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Catégories à inventorier</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="fournitures">Fournitures</SelectItem>
                      <SelectItem value="bureautique">Bureautique</SelectItem>
                      <SelectItem value="informatique">Informatique</SelectItem>
                      <SelectItem value="audiovisuel">Audiovisuel</SelectItem>
                      <SelectItem value="laboratoire">Laboratoire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Emplacements</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les emplacements</SelectItem>
                      {mockLocations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Opérateurs</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner les opérateurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kone">Koné Yao</SelectItem>
                      <SelectItem value="diallo">Diallo Fatou</SelectItem>
                      <SelectItem value="toure">Touré Amadou</SelectItem>
                      <SelectItem value="bamba">Bamba Kouadio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes / Instructions</Label>
                  <Textarea placeholder="Instructions particulières pour cet inventaire..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewSession(false)}>Annuler</Button>
                <Button onClick={() => { setShowNewSession(false); toast.success("Inventaire démarré"); }}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Démarrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Référencés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">dans l'inventaire</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{itemsOk}</div>
            <p className="text-xs text-muted-foreground">{Math.round(itemsOk/totalItems*100)}% du stock</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Écarts Détectés</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{itemsWithDiscrepancy}</div>
            <p className="text-xs text-muted-foreground">à régulariser</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalValue/1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA de patrimoine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernier Inventaire</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 Nov</div>
            <p className="text-xs text-muted-foreground">il y a 2 jours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">
            <Package className="mr-2 h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <ClipboardList className="mr-2 h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="discrepancies">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Écarts
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="mr-2 h-4 w-4" />
            Emplacements
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="mr-2 h-4 w-4" />
            Rapports
          </TabsTrigger>
        </TabsList>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Articles</CardTitle>
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
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="Fournitures">Fournitures</SelectItem>
                      <SelectItem value="Bureautique">Bureautique</SelectItem>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                      <SelectItem value="Audiovisuel">Audiovisuel</SelectItem>
                      <SelectItem value="Laboratoire">Laboratoire</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="ok">Conforme</SelectItem>
                      <SelectItem value="discrepancy">Écart</SelectItem>
                      <SelectItem value="surplus">Surplus</SelectItem>
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
                    <TableHead>Code</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Emplacement</TableHead>
                    <TableHead className="text-center">Théorique</TableHead>
                    <TableHead className="text-center">Compté</TableHead>
                    <TableHead className="text-center">Écart</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className={item.status === "discrepancy" ? "bg-red-50 dark:bg-red-950/10" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{item.code}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.location}</TableCell>
                      <TableCell className="text-center font-mono">{item.theoreticalQty}</TableCell>
                      <TableCell className="text-center font-mono font-bold">{item.countedQty}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-mono font-bold ${
                          item.discrepancy < 0 ? "text-red-600" : 
                          item.discrepancy > 0 ? "text-green-600" : "text-muted-foreground"
                        }`}>
                          {item.discrepancy > 0 ? "+" : ""}{item.discrepancy}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === "ok" ? "default" : 
                          item.status === "discrepancy" ? "destructive" : "secondary"
                        }>
                          {item.status === "ok" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {item.status === "discrepancy" && <XCircle className="mr-1 h-3 w-3" />}
                          {item.status === "surplus" && <TrendingUp className="mr-1 h-3 w-3" />}
                          {item.status === "ok" ? "Conforme" : item.status === "discrepancy" ? "Écart" : "Surplus"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowItemDetails(true);
                            }}
                          >
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

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Sessions d'Inventaire</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Écarts</TableHead>
                    <TableHead>Opérateurs</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInventorySessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-mono">{session.date}</TableCell>
                      <TableCell className="font-medium">{session.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={(session.itemsScanned / session.itemsTotal) * 100} className="w-20" />
                          <span className="text-xs">{session.itemsScanned}/{session.itemsTotal}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={session.discrepancies > 5 ? "destructive" : session.discrepancies > 0 ? "secondary" : "default"}>
                          {session.discrepancies} écarts
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {session.operators.map((op, idx) => (
                            <div key={idx} className="h-6 w-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs">
                              {op.split(' ').map(n => n[0]).join('')}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{session.duration}</TableCell>
                      <TableCell className="font-mono text-sm">{session.value.toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                          {session.status === "completed" ? (
                            <><CheckCheck className="mr-1 h-3 w-3" />Terminé</>
                          ) : (
                            <><Timer className="mr-1 h-3 w-3" />En cours</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
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

        {/* Discrepancies Tab */}
        <TabsContent value="discrepancies" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Écarts par Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={discrepancyByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ok" name="Conforme" fill="hsl(142, 76%, 36%)" />
                    <Bar dataKey="discrepancy" name="Écart" fill="hsl(0, 84%, 60%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Écarts à Régulariser</CardTitle>
                <Button variant="outline" onClick={() => toast.success("Rapport d'écarts généré")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Rapport
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead className="text-center">Attendu</TableHead>
                    <TableHead className="text-center">Compté</TableHead>
                    <TableHead className="text-center">Différence</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDiscrepancies.map((disc) => (
                    <TableRow key={disc.id}>
                      <TableCell className="font-mono text-sm">{disc.date}</TableCell>
                      <TableCell className="font-medium">{disc.item}</TableCell>
                      <TableCell className="text-center font-mono">{disc.expected}</TableCell>
                      <TableCell className="text-center font-mono">{disc.counted}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-mono font-bold ${disc.difference < 0 ? "text-red-600" : "text-green-600"}`}>
                          {disc.difference > 0 ? "+" : ""}{disc.difference}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{disc.reason}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{disc.action}</TableCell>
                      <TableCell>
                        <Badge variant={disc.status === "resolved" ? "default" : "secondary"}>
                          {disc.status === "resolved" ? "Résolu" : "En attente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Emplacements de Stockage</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Emplacement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {mockLocations.map((location) => (
                  <Card key={location.id} className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline">{location.itemCount} articles</Badge>
                      </div>
                      <h4 className="font-medium mt-3">{location.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dernier inventaire: {location.lastInventory}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <ClipboardList className="h-3 w-3 mr-1" />
                          Inventorier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => toast.success("Génération du rapport...")}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold">Rapport d'Inventaire</h4>
                  <p className="text-sm text-muted-foreground mt-1">État complet du stock</p>
                  <Button className="mt-4 w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Générer PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => toast.success("Génération du rapport...")}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-orange-100 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold">Rapport des Écarts</h4>
                  <p className="text-sm text-muted-foreground mt-1">Analyse des différences</p>
                  <Button className="mt-4 w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Générer PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => toast.success("Génération du rapport...")}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-green-100 rounded-full mb-4">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Valorisation Patrimoine</h4>
                  <p className="text-sm text-muted-foreground mt-1">Valeur totale des actifs</p>
                  <Button className="mt-4 w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Générer PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historique des Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Généré par</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-15</TableCell>
                    <TableCell>Inventaire Complet</TableCell>
                    <TableCell>Novembre 2024</TableCell>
                    <TableCell>Koné Yao</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">2024-10-15</TableCell>
                    <TableCell>Inventaire Partiel</TableCell>
                    <TableCell>Octobre 2024</TableCell>
                    <TableCell>Touré Amadou</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">2024-09-01</TableCell>
                    <TableCell>Inventaire Rentrée</TableCell>
                    <TableCell>Septembre 2024</TableCell>
                    <TableCell>Koné Yao</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Details Dialog */}
      <Dialog open={showItemDetails} onOpenChange={setShowItemDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Article</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="p-4 bg-background rounded-lg border">
                  <QrCode className="h-16 w-16" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.code}</p>
                  <Badge variant="outline" className="mt-2">{selectedItem.category}</Badge>
                </div>
                <Badge variant={
                  selectedItem.status === "ok" ? "default" : 
                  selectedItem.status === "discrepancy" ? "destructive" : "secondary"
                } className="text-lg px-4 py-2">
                  {selectedItem.status === "ok" ? "Conforme" : selectedItem.status === "discrepancy" ? "Écart" : "Surplus"}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">Quantité Théorique</p>
                    <p className="text-3xl font-bold">{selectedItem.theoreticalQty}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">Quantité Comptée</p>
                    <p className="text-3xl font-bold">{selectedItem.countedQty}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">Écart</p>
                    <p className={`text-3xl font-bold ${
                      selectedItem.discrepancy < 0 ? "text-red-600" : 
                      selectedItem.discrepancy > 0 ? "text-green-600" : ""
                    }`}>
                      {selectedItem.discrepancy > 0 ? "+" : ""}{selectedItem.discrepancy}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Emplacement</Label>
                  <p className="font-medium">{selectedItem.location}</p>
                </div>
                <div>
                  <Label>Valeur Unitaire</Label>
                  <p className="font-medium font-mono">{selectedItem.unitValue.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <Label>Dernier Comptage</Label>
                  <p className="font-medium">{selectedItem.lastCount}</p>
                </div>
                <div>
                  <Label>Valeur Totale</Label>
                  <p className="font-medium font-mono">{(selectedItem.countedQty * selectedItem.unitValue).toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemDetails(false)}>Fermer</Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer QR
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
