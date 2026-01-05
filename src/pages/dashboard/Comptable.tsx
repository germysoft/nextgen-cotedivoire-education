import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Download, Search, Filter, CreditCard, Wallet, PiggyBank, Receipt,
  ArrowUpRight, ArrowDownRight, Clock, FileText, BarChart3
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, ComposedChart
} from "recharts";
import { toast } from "sonner";

const Comptable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const stats = [
    { label: "Recettes du Mois", value: "18.5M", change: "+12%", trend: "up", icon: TrendingUp, color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Dépenses du Mois", value: "12.3M", change: "+5%", trend: "up", icon: TrendingDown, color: "text-red-500", bgColor: "bg-red-500/10" },
    { label: "Solde Caisse", value: "8.7M", change: "", trend: "", icon: Wallet, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Impayés", value: "28.2M", change: "145 élèves", trend: "", icon: AlertTriangle, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  ];

  const recentTransactions = [
    { id: "PAY-001", date: "2024-01-15", eleve: "Kouamé Yao", type: "Scolarité", montant: 150000, mode: "Orange Money", statut: "completed" },
    { id: "PAY-002", date: "2024-01-15", eleve: "Diallo Fatou", type: "Cantine", montant: 25000, mode: "Espèces", statut: "completed" },
    { id: "PAY-003", date: "2024-01-14", eleve: "Koné Paul", type: "Scolarité", montant: 75000, mode: "Virement", statut: "pending" },
    { id: "PAY-004", date: "2024-01-14", eleve: "Bamba Marie", type: "Transport", montant: 35000, mode: "MTN Money", statut: "completed" },
    { id: "PAY-005", date: "2024-01-13", eleve: "Yao Jean", type: "Scolarité", montant: 150000, mode: "Wave", statut: "failed" },
  ];

  const monthlyData = [
    { mois: "Sep", recettes: 25000000, depenses: 18000000, benefice: 7000000 },
    { mois: "Oct", recettes: 22000000, depenses: 16500000, benefice: 5500000 },
    { mois: "Nov", recettes: 28000000, depenses: 19000000, benefice: 9000000 },
    { mois: "Déc", recettes: 15000000, depenses: 12000000, benefice: 3000000 },
    { mois: "Jan", recettes: 35000000, depenses: 21000000, benefice: 14000000 },
  ];

  const repartitionRecettes = [
    { name: "Scolarité", value: 65, color: "hsl(var(--primary))" },
    { name: "Cantine", value: 15, color: "hsl(var(--chart-2))" },
    { name: "Transport", value: 10, color: "hsl(var(--chart-3))" },
    { name: "Activités", value: 5, color: "hsl(var(--chart-4))" },
    { name: "Autres", value: 5, color: "hsl(var(--chart-5))" },
  ];

  const impayesParNiveau = [
    { niveau: "6ème", montant: 4500000, eleves: 28 },
    { niveau: "5ème", montant: 5200000, eleves: 32 },
    { niveau: "4ème", montant: 6800000, eleves: 35 },
    { niveau: "3ème", montant: 8200000, eleves: 38 },
    { niveau: "2nde", montant: 2000000, eleves: 8 },
    { niveau: "1ère", montant: 1500000, eleves: 4 },
  ];

  const filteredTransactions = recentTransactions.filter(t => {
    const matchSearch = t.eleve.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.includes(searchTerm);
    const matchStatus = filterStatus === "all" || t.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Comptable</h1>
          <p className="text-muted-foreground">Gestion financière de l'établissement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />Bilan
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />Exporter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.change && (
                  <Badge variant="outline" className="text-xs">
                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </Badge>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value} FCFA</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="tresorerie" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tresorerie">Trésorerie</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="impayes">Impayés</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="tresorerie">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution Recettes / Dépenses</CardTitle>
                <CardDescription>5 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    <Legend />
                    <Bar dataKey="recettes" fill="hsl(var(--chart-2))" name="Recettes" />
                    <Bar dataKey="depenses" fill="hsl(var(--destructive))" name="Dépenses" />
                    <Line type="monotone" dataKey="benefice" stroke="hsl(var(--primary))" strokeWidth={2} name="Bénéfice" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Recettes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={repartitionRecettes}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                    >
                      {repartitionRecettes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {repartitionRecettes.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions Récentes</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="completed">Validés</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="failed">Échoués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-sm">{t.id}</TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell className="font-medium">{t.eleve}</TableCell>
                      <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                      <TableCell className="font-medium">{t.montant.toLocaleString()} F</TableCell>
                      <TableCell>{t.mode}</TableCell>
                      <TableCell>
                        <Badge variant={t.statut === "completed" ? "default" : t.statut === "pending" ? "secondary" : "destructive"}>
                          {t.statut === "completed" ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                           t.statut === "pending" ? <Clock className="h-3 w-3 mr-1" /> :
                           <AlertTriangle className="h-3 w-3 mr-1" />}
                          {t.statut === "completed" ? "Validé" : t.statut === "pending" ? "En attente" : "Échoué"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toast.success("Quittance générée")}>
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impayes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impayés par Niveau</CardTitle>
                <CardDescription>Total: 28.2M FCFA - 145 élèves</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={impayesParNiveau} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${value / 1000000}M`} />
                    <YAxis type="category" dataKey="niveau" width={50} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    <Bar dataKey="montant" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions de Recouvrement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "SMS de rappel envoyés", value: 145, icon: CreditCard },
                  { label: "Convocations parents", value: 45, icon: FileText },
                  { label: "Échéanciers mis en place", value: 28, icon: Clock },
                  { label: "Recouvrements ce mois", value: "3.2M", icon: CheckCircle },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{item.label}</span>
                    </div>
                    <Badge variant="outline">{item.value}</Badge>
                  </div>
                ))}
                <Button className="w-full" onClick={() => toast.success("Campagne de relance lancée")}>
                  Lancer une campagne de relance
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rapports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Bilan Mensuel", desc: "Recettes, dépenses, trésorerie", icon: BarChart3 },
              { title: "État des Impayés", desc: "Liste détaillée par élève", icon: AlertTriangle },
              { title: "Journal de Caisse", desc: "Toutes les opérations", icon: Receipt },
              { title: "Rapport Budgétaire", desc: "Exécution vs prévision", icon: PiggyBank },
              { title: "Synthèse Trimestrielle", desc: "Bilan financier complet", icon: FileText },
              { title: "Export Comptable", desc: "Format compatible logiciel", icon: Download },
            ].map((report, i) => (
              <Card key={i} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => toast.success(`Génération du rapport "${report.title}"`)}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <report.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Comptable;
