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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  AlertTriangle, 
  Bell,
  BellRing,
  Settings,
  Package,
  TrendingDown,
  ShoppingCart,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Filter,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Zap,
  Target,
  BarChart3,
  History,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Mock data for stock items with thresholds
const mockStockItems = [
  { 
    id: 1, 
    name: "Cahiers 200 pages", 
    category: "Fournitures", 
    currentStock: 45, 
    minThreshold: 100, 
    criticalThreshold: 50, 
    maxThreshold: 500,
    reorderQty: 200,
    unit: "unités",
    supplier: "Papeterie Centrale",
    lastReorder: "2024-10-15",
    avgConsumption: 85,
    daysUntilEmpty: 16,
    alertStatus: "critical",
    autoOrder: true,
    notifyEmail: true,
    notifySMS: false
  },
  { 
    id: 2, 
    name: "Stylos bleus", 
    category: "Fournitures", 
    currentStock: 35, 
    minThreshold: 50, 
    criticalThreshold: 20, 
    maxThreshold: 200,
    reorderQty: 100,
    unit: "boîtes",
    supplier: "BIC Côte d'Ivoire",
    lastReorder: "2024-09-28",
    avgConsumption: 15,
    daysUntilEmpty: 7,
    alertStatus: "warning",
    autoOrder: true,
    notifyEmail: true,
    notifySMS: true
  },
  { 
    id: 3, 
    name: "Ramettes A4", 
    category: "Bureautique", 
    currentStock: 120, 
    minThreshold: 30, 
    criticalThreshold: 15, 
    maxThreshold: 200,
    reorderQty: 50,
    unit: "ramettes",
    supplier: "Office Plus",
    lastReorder: "2024-11-01",
    avgConsumption: 25,
    daysUntilEmpty: 144,
    alertStatus: "ok",
    autoOrder: false,
    notifyEmail: true,
    notifySMS: false
  },
  { 
    id: 4, 
    name: "Marqueurs tableau", 
    category: "Matériel pédagogique", 
    currentStock: 12, 
    minThreshold: 25, 
    criticalThreshold: 10, 
    maxThreshold: 100,
    reorderQty: 40,
    unit: "boîtes",
    supplier: "Fournitures Scolaires CI",
    lastReorder: "2024-10-20",
    avgConsumption: 8,
    daysUntilEmpty: 5,
    alertStatus: "critical",
    autoOrder: true,
    notifyEmail: true,
    notifySMS: true
  },
  { 
    id: 5, 
    name: "Craies blanches", 
    category: "Matériel pédagogique", 
    currentStock: 200, 
    minThreshold: 100, 
    criticalThreshold: 50, 
    maxThreshold: 500,
    reorderQty: 150,
    unit: "boîtes",
    supplier: "Fournitures Scolaires CI",
    lastReorder: "2024-10-05",
    avgConsumption: 30,
    daysUntilEmpty: 200,
    alertStatus: "ok",
    autoOrder: false,
    notifyEmail: false,
    notifySMS: false
  },
  { 
    id: 6, 
    name: "Encre imprimante", 
    category: "Bureautique", 
    currentStock: 8, 
    minThreshold: 10, 
    criticalThreshold: 5, 
    maxThreshold: 30,
    reorderQty: 15,
    unit: "cartouches",
    supplier: "Tech Solutions",
    lastReorder: "2024-10-25",
    avgConsumption: 3,
    daysUntilEmpty: 8,
    alertStatus: "warning",
    autoOrder: true,
    notifyEmail: true,
    notifySMS: false
  },
];

// Mock alert history
const mockAlertHistory = [
  { id: 1, date: "2024-11-17 09:30", item: "Cahiers 200 pages", type: "critical", message: "Stock critique atteint (45 unités)", action: "Commande auto générée", status: "resolved" },
  { id: 2, date: "2024-11-17 08:15", item: "Marqueurs tableau", type: "critical", message: "Stock critique atteint (12 boîtes)", action: "Notification envoyée", status: "pending" },
  { id: 3, date: "2024-11-16 14:20", item: "Stylos bleus", type: "warning", message: "Seuil minimum atteint (35 boîtes)", action: "Notification envoyée", status: "acknowledged" },
  { id: 4, date: "2024-11-15 10:45", item: "Encre imprimante", type: "warning", message: "Seuil minimum atteint (8 cartouches)", action: "Commande manuelle créée", status: "resolved" },
  { id: 5, date: "2024-11-14 16:30", item: "Ramettes A4", type: "info", message: "Stock réapprovisionné (120 ramettes)", action: "Alerte désactivée", status: "resolved" },
];

// Mock auto-orders
const mockAutoOrders = [
  { id: 1, date: "2024-11-17", item: "Cahiers 200 pages", quantity: 200, supplier: "Papeterie Centrale", estimatedCost: 200000, status: "pending", expectedDelivery: "2024-11-22" },
  { id: 2, date: "2024-11-16", item: "Marqueurs tableau", quantity: 40, supplier: "Fournitures Scolaires CI", estimatedCost: 60000, status: "confirmed", expectedDelivery: "2024-11-20" },
  { id: 3, date: "2024-11-10", item: "Encre imprimante", quantity: 15, supplier: "Tech Solutions", estimatedCost: 225000, status: "delivered", expectedDelivery: "2024-11-15" },
];

// Consumption trends
const consumptionTrends = [
  { month: "Juil", cahiers: 120, stylos: 45, ramettes: 30, marqueurs: 25 },
  { month: "Août", cahiers: 40, stylos: 15, ramettes: 10, marqueurs: 8 },
  { month: "Sept", cahiers: 350, stylos: 80, ramettes: 60, marqueurs: 45 },
  { month: "Oct", cahiers: 180, stylos: 55, ramettes: 40, marqueurs: 30 },
  { month: "Nov", cahiers: 85, stylos: 25, ramettes: 25, marqueurs: 15 },
];

const COLORS = ['hsl(0, 84%, 60%)', 'hsl(38, 92%, 50%)', 'hsl(142, 76%, 36%)'];

export default function SeuilsAlerte() {
  const [selectedItem, setSelectedItem] = useState<typeof mockStockItems[0] | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const criticalItems = mockStockItems.filter(i => i.alertStatus === "critical").length;
  const warningItems = mockStockItems.filter(i => i.alertStatus === "warning").length;
  const okItems = mockStockItems.filter(i => i.alertStatus === "ok").length;
  const autoOrderEnabled = mockStockItems.filter(i => i.autoOrder).length;

  const filteredItems = mockStockItems.filter(item => {
    const matchesStatus = filterStatus === "all" || item.alertStatus === filterStatus;
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "destructive";
      case "warning": return "secondary";
      case "ok": return "default";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <XCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "ok": return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };

  const pieData = [
    { name: "Critique", value: criticalItems, color: COLORS[0] },
    { name: "Alerte", value: warningItems, color: COLORS[1] },
    { name: "Normal", value: okItems, color: COLORS[2] },
  ];

  const handleSendReminder = (item: typeof mockStockItems[0]) => {
    toast.success(`Rappel envoyé pour ${item.name}`);
  };

  const handleTriggerOrder = (item: typeof mockStockItems[0]) => {
    toast.success(`Commande de ${item.reorderQty} ${item.unit} générée pour ${item.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seuils d'Alerte Stock</h1>
          <p className="text-muted-foreground">Configuration des alertes et commandes automatiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Alertes actualisées")}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Dialog open={showGlobalSettings} onOpenChange={setShowGlobalSettings}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Paramètres Globaux des Alertes</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Alertes Email</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Alertes SMS</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Destinataires des alertes</Label>
                    <Input placeholder="intendant@ecole.ci, directeur@ecole.ci" defaultValue="intendant@ecole.ci" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Commandes Automatiques</h4>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Activer les commandes auto</p>
                      <p className="text-sm text-muted-foreground">Génère automatiquement une commande au seuil critique</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Délai avant confirmation (heures)</Label>
                    <Slider defaultValue={[24]} max={72} step={12} />
                    <p className="text-xs text-muted-foreground">Les commandes auto nécessitent validation sous 24h</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Fréquence de vérification</h4>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne (8h00)</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire (Lundi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGlobalSettings(false)}>Annuler</Button>
                <Button onClick={() => { setShowGlobalSettings(false); toast.success("Paramètres sauvegardés"); }}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">Réapprovisionnement urgent</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Avertissement</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{warningItems}</div>
            <p className="text-xs text-muted-foreground">Sous seuil minimum</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Normal</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{okItems}</div>
            <p className="text-xs text-muted-foreground">Niveau satisfaisant</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Auto</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoOrderEnabled}</div>
            <p className="text-xs text-muted-foreground">articles configurés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Commande</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAutoOrders.filter(o => o.status !== "delivered").length}</div>
            <p className="text-xs text-muted-foreground">en attente de livraison</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="thresholds" className="space-y-4">
        <TabsList>
          <TabsTrigger value="thresholds">
            <Target className="mr-2 h-4 w-4" />
            Seuils
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <BellRing className="mr-2 h-4 w-4" />
            Historique Alertes
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Commandes Auto
          </TabsTrigger>
          <TabsTrigger value="trends">
            <BarChart3 className="mr-2 h-4 w-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        {/* Thresholds Tab */}
        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Configuration des Seuils</CardTitle>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                      <SelectItem value="warning">Alerte</SelectItem>
                      <SelectItem value="ok">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      <SelectItem value="Fournitures">Fournitures</SelectItem>
                      <SelectItem value="Bureautique">Bureautique</SelectItem>
                      <SelectItem value="Matériel pédagogique">Matériel pédagogique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Stock Actuel</TableHead>
                    <TableHead>Seuils</TableHead>
                    <TableHead>Prévision</TableHead>
                    <TableHead>Commande Auto</TableHead>
                    <TableHead>Notifications</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className={item.alertStatus === "critical" ? "bg-red-50 dark:bg-red-950/10" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{item.currentStock}</span>
                            <span className="text-xs text-muted-foreground">{item.unit}</span>
                          </div>
                          <Progress 
                            value={(item.currentStock / item.maxThreshold) * 100} 
                            className={`h-2 ${item.alertStatus === "critical" ? "[&>div]:bg-red-500" : item.alertStatus === "warning" ? "[&>div]:bg-orange-500" : ""}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-red-600">Critique:</span>
                            <span className="font-mono">{item.criticalThreshold}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-orange-600">Minimum:</span>
                            <span className="font-mono">{item.minThreshold}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-muted-foreground">Maximum:</span>
                            <span className="font-mono">{item.maxThreshold}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-muted-foreground" />
                            <span>{item.avgConsumption}/mois</span>
                          </div>
                          <p className={`text-xs ${item.daysUntilEmpty <= 7 ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                            {item.daysUntilEmpty <= 0 ? "Rupture!" : `~${item.daysUntilEmpty} jours`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={item.autoOrder} />
                          {item.autoOrder && (
                            <span className="text-xs text-muted-foreground">{item.reorderQty} {item.unit}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.notifyEmail && <Mail className="h-4 w-4 text-primary" />}
                          {item.notifySMS && <MessageSquare className="h-4 w-4 text-green-600" />}
                          {!item.notifyEmail && !item.notifySMS && <span className="text-xs text-muted-foreground">Aucune</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(item.alertStatus)}>
                          {getStatusIcon(item.alertStatus)}
                          <span className="ml-1 capitalize">{item.alertStatus === "ok" ? "Normal" : item.alertStatus === "warning" ? "Alerte" : "Critique"}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowConfigDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {item.alertStatus !== "ok" && (
                            <Button size="sm" variant="ghost" onClick={() => handleTriggerOrder(item)}>
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
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

        {/* Alert History Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition des Alertes</CardTitle>
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
                <CardTitle className="text-base">Alertes Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlertHistory.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {alert.type === "critical" ? (
                          <div className="p-2 bg-red-100 rounded-full">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </div>
                        ) : alert.type === "warning" ? (
                          <div className="p-2 bg-orange-100 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          </div>
                        ) : (
                          <div className="p-2 bg-blue-100 rounded-full">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{alert.item}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          alert.status === "resolved" ? "default" : 
                          alert.status === "pending" ? "destructive" : "secondary"
                        }>
                          {alert.status === "resolved" ? "Résolu" : alert.status === "pending" ? "En attente" : "Vu"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historique Complet des Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAlertHistory.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono text-sm">{alert.date}</TableCell>
                      <TableCell className="font-medium">{alert.item}</TableCell>
                      <TableCell>
                        <Badge variant={
                          alert.type === "critical" ? "destructive" : 
                          alert.type === "warning" ? "secondary" : "outline"
                        }>
                          {alert.type === "critical" ? "Critique" : alert.type === "warning" ? "Alerte" : "Info"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{alert.message}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.action}</TableCell>
                      <TableCell>
                        <Badge variant={
                          alert.status === "resolved" ? "default" : 
                          alert.status === "pending" ? "destructive" : "secondary"
                        }>
                          {alert.status === "resolved" ? "Résolu" : alert.status === "pending" ? "En attente" : "Vu"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commandes Automatiques</CardTitle>
                  <CardDescription>Commandes générées automatiquement au seuil critique</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Commande
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Coût Estimé</TableHead>
                    <TableHead>Livraison Prévue</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAutoOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.date}</TableCell>
                      <TableCell className="font-medium">{order.item}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell className="font-mono">{order.estimatedCost.toLocaleString()} FCFA</TableCell>
                      <TableCell>{order.expectedDelivery}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === "delivered" ? "default" : 
                          order.status === "confirmed" ? "secondary" : "outline"
                        }>
                          {order.status === "delivered" ? (
                            <><CheckCircle2 className="mr-1 h-3 w-3" />Livré</>
                          ) : order.status === "confirmed" ? (
                            <><Clock className="mr-1 h-3 w-3" />Confirmé</>
                          ) : (
                            <><AlertCircle className="mr-1 h-3 w-3" />En attente</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {order.status === "pending" && (
                            <>
                              <Button size="sm" variant="ghost" className="text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendances de Consommation</CardTitle>
              <CardDescription>Analyse des consommations mensuelles par article</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={consumptionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cahiers" name="Cahiers" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="stylos" name="Stylos" stroke="hsl(142, 76%, 36%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="ramettes" name="Ramettes" stroke="hsl(38, 92%, 50%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="marqueurs" name="Marqueurs" stroke="hsl(0, 84%, 60%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prévisions de Rupture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStockItems.filter(i => i.daysUntilEmpty <= 30).sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${item.daysUntilEmpty <= 7 ? "bg-red-100" : "bg-orange-100"}`}>
                          <Clock className={`h-4 w-4 ${item.daysUntilEmpty <= 7 ? "text-red-600" : "text-orange-600"}`} />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.currentStock} {item.unit} restants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${item.daysUntilEmpty <= 7 ? "text-red-600" : "text-orange-600"}`}>
                          {item.daysUntilEmpty} jours
                        </p>
                        <Button size="sm" variant="outline" onClick={() => handleTriggerOrder(item)}>
                          Commander
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="font-medium text-red-600">Action immédiate requise</p>
                    </div>
                    <p className="text-sm">Commander les marqueurs tableau - rupture prévue dans 5 jours</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <p className="font-medium text-orange-600">Planifier réapprovisionnement</p>
                    </div>
                    <p className="text-sm">Stylos bleus et encre imprimante à surveiller cette semaine</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <p className="font-medium text-blue-600">Optimisation suggérée</p>
                    </div>
                    <p className="text-sm">Augmenter le seuil minimum des cahiers (pic de consommation en septembre)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Config Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurer les Seuils - {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Seuil Critique</Label>
                  <Input type="number" defaultValue={selectedItem.criticalThreshold} />
                  <p className="text-xs text-muted-foreground">Commande auto déclenchée</p>
                </div>
                <div className="space-y-2">
                  <Label>Seuil Minimum</Label>
                  <Input type="number" defaultValue={selectedItem.minThreshold} />
                  <p className="text-xs text-muted-foreground">Alerte envoyée</p>
                </div>
                <div className="space-y-2">
                  <Label>Seuil Maximum</Label>
                  <Input type="number" defaultValue={selectedItem.maxThreshold} />
                  <p className="text-xs text-muted-foreground">Capacité maximale</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantité de Réapprovisionnement</Label>
                  <Input type="number" defaultValue={selectedItem.reorderQty} />
                </div>
                <div className="space-y-2">
                  <Label>Fournisseur Préféré</Label>
                  <Select defaultValue={selectedItem.supplier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Papeterie Centrale">Papeterie Centrale</SelectItem>
                      <SelectItem value="Office Plus">Office Plus</SelectItem>
                      <SelectItem value="BIC Côte d'Ivoire">BIC Côte d'Ivoire</SelectItem>
                      <SelectItem value="Tech Solutions">Tech Solutions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Options</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Commande automatique</p>
                    <p className="text-sm text-muted-foreground">Générer une commande au seuil critique</p>
                  </div>
                  <Switch defaultChecked={selectedItem.autoOrder} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Notification Email</p>
                    <p className="text-sm text-muted-foreground">Envoyer un email d'alerte</p>
                  </div>
                  <Switch defaultChecked={selectedItem.notifyEmail} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Notification SMS</p>
                    <p className="text-sm text-muted-foreground">Envoyer un SMS d'alerte</p>
                  </div>
                  <Switch defaultChecked={selectedItem.notifySMS} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>Annuler</Button>
            <Button onClick={() => { setShowConfigDialog(false); toast.success("Configuration sauvegardée"); }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
