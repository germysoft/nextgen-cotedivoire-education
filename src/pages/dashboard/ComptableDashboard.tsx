import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, Receipt,
  CreditCard, AlertTriangle, CheckCircle, Clock, PiggyBank,
  ArrowUpRight, ArrowDownRight, Calendar, FileText, Users, Download, Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { generateDashboardReport } from "@/components/dashboard/DashboardReportGenerator";

const statsFinancieres = {
  soldeTresorerie: 125000000,
  recettesMois: 45000000,
  depensesMois: 38000000,
  creances: 32000000,
  recouvrementTaux: 78,
};

const dernièresTransactions = [
  { id: 1, date: "15/12/2024", libelle: "Frais de scolarité - Lot 45", type: "Recette", montant: 2500000, statut: "Validé" },
  { id: 2, date: "14/12/2024", libelle: "Salaires enseignants - Décembre", type: "Dépense", montant: 18500000, statut: "En cours" },
  { id: 3, date: "14/12/2024", libelle: "Fournitures de bureau", type: "Dépense", montant: 450000, statut: "Validé" },
  { id: 4, date: "13/12/2024", libelle: "Frais de scolarité - Lot 44", type: "Recette", montant: 3200000, statut: "Validé" },
  { id: 5, date: "13/12/2024", libelle: "Maintenance informatique", type: "Dépense", montant: 850000, statut: "Validé" },
  { id: 6, date: "12/12/2024", libelle: "Cantine - Semaine 50", type: "Recette", montant: 1200000, statut: "Validé" },
];

const impayesParClasse = [
  { classe: "Tle D", montant: 4500000, eleves: 12, color: "#ef4444" },
  { classe: "1ère A", montant: 3200000, eleves: 8, color: "#f97316" },
  { classe: "2nde B", montant: 2800000, eleves: 7, color: "#f59e0b" },
  { classe: "3ème C", montant: 2100000, eleves: 6, color: "#eab308" },
  { classe: "4ème A", montant: 1500000, eleves: 4, color: "#84cc16" },
];

const evolutionTresorerie = [
  { mois: "Sept", solde: 95000000 },
  { mois: "Oct", solde: 108000000 },
  { mois: "Nov", solde: 118000000 },
  { mois: "Déc", solde: 125000000 },
];

const repartitionDepenses = [
  { name: "Salaires", value: 65, color: "#3b82f6" },
  { name: "Fournitures", value: 12, color: "#10b981" },
  { name: "Maintenance", value: 8, color: "#f59e0b" },
  { name: "Utilities", value: 10, color: "#8b5cf6" },
  { name: "Autres", value: 5, color: "#6b7280" },
];

const echeancesProchaines = [
  { id: 1, libelle: "Salaires - Décembre", date: "25/12/2024", montant: 18500000, statut: "À payer" },
  { id: 2, libelle: "Facture électricité", date: "28/12/2024", montant: 850000, statut: "À payer" },
  { id: 3, libelle: "Assurance annuelle", date: "31/12/2024", montant: 2500000, statut: "À payer" },
  { id: 4, libelle: "Loyer locaux annexes", date: "01/01/2025", montant: 1200000, statut: "Programmé" },
];

export default function ComptableDashboard() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);

  const handleExportReport = async () => {
    setIsGenerating(true);
    try {
      generateDashboardReport({
        title: "Rapport Financier",
        subtitle: "Suivi comptable et trésorerie",
        establishment: "NextGen Éducation",
        period: "Décembre 2024",
        kpis: [
          { label: "Trésorerie", value: `${(statsFinancieres.soldeTresorerie / 1000000).toFixed(0)}M FCFA`, change: "+7M", trend: "up" },
          { label: "Recettes Mois", value: `${(statsFinancieres.recettesMois / 1000000).toFixed(0)}M FCFA`, trend: "up" },
          { label: "Dépenses Mois", value: `${(statsFinancieres.depensesMois / 1000000).toFixed(0)}M FCFA`, trend: "down" },
          { label: "Créances", value: `${(statsFinancieres.creances / 1000000).toFixed(0)}M FCFA` },
          { label: "Recouvrement", value: `${statsFinancieres.recouvrementTaux}%` },
        ],
        alerts: [
          { type: "warning", message: `${impayesParClasse.reduce((sum, i) => sum + i.eleves, 0)} élèves avec impayés` },
          { type: "info", message: `${echeancesProchaines.length} échéances à venir` },
        ],
        tables: [
          {
            title: "Dernières Transactions",
            headers: ["Date", "Libellé", "Type", "Montant (FCFA)", "Statut"],
            rows: dernièresTransactions.map(t => [
              t.date,
              t.libelle,
              t.type,
              t.montant.toLocaleString("fr-FR"),
              t.statut,
            ]),
          },
          {
            title: "Impayés par Classe",
            headers: ["Classe", "Montant (FCFA)", "Nombre d'élèves"],
            rows: impayesParClasse.map(i => [
              i.classe,
              i.montant.toLocaleString("fr-FR"),
              String(i.eleves),
            ]),
          },
          {
            title: "Échéances Prochaines",
            headers: ["Libellé", "Date", "Montant (FCFA)", "Statut"],
            rows: echeancesProchaines.map(e => [
              e.libelle,
              e.date,
              e.montant.toLocaleString("fr-FR"),
              e.statut,
            ]),
          },
          {
            title: "Évolution Trésorerie",
            headers: ["Mois", "Solde (FCFA)"],
            rows: evolutionTresorerie.map(e => [e.mois, e.solde.toLocaleString("fr-FR")]),
          },
        ],
        chartData: [
          {
            title: "Répartition des Dépenses",
            type: "pie",
            data: repartitionDepenses.map(d => ({ name: d.name, value: d.value })),
          },
        ],
        additionalInfo: [
          { label: "Solde disponible", value: `${(statsFinancieres.soldeTresorerie / 1000000).toFixed(1)}M FCFA` },
          { label: "Total créances", value: `${(statsFinancieres.creances / 1000000).toFixed(1)}M FCFA` },
          { label: "Taux recouvrement", value: `${statsFinancieres.recouvrementTaux}%` },
        ],
      });
      toast({
        title: "Rapport généré",
        description: "Le rapport financier a été téléchargé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePeriodSelector = () => {
    toast({
      title: "Sélection de période",
      description: "Utilisez les filtres pour sélectionner la période souhaitée.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Comptable</h1>
          <p className="text-muted-foreground">Suivi financier en temps réel • Décembre 2024</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePeriodSelector}>
            <Calendar className="mr-2 h-4 w-4" />
            Période
          </Button>
          <Button onClick={handleExportReport} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? "Génération..." : "Export"}
          </Button>
        </div>
      </div>

      {/* KPIs financiers */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trésorerie</CardTitle>
            <PiggyBank className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{(statsFinancieres.soldeTresorerie / 1000000).toFixed(0)}M</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +7M ce mois
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes Mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">{(statsFinancieres.recettesMois / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Mois</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{(statsFinancieres.depensesMois / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créances</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-amber-600">{(statsFinancieres.creances / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">À recouvrer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recouvrement</CardTitle>
            <Receipt className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{statsFinancieres.recouvrementTaux}%</div>
            <Progress value={statsFinancieres.recouvrementTaux} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Transactions récentes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Dernières Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dernièresTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">{t.date}</TableCell>
                    <TableCell className="font-medium">{t.libelle}</TableCell>
                    <TableCell>
                      <Badge variant={t.type === "Recette" ? "default" : "secondary"}>
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${t.type === "Recette" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "Recette" ? "+" : "-"}{(t.montant / 1000000).toFixed(1)}M
                    </TableCell>
                    <TableCell>
                      {t.statut === "Validé" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Échéances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Échéances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {echeancesProchaines.map((e) => (
              <div key={e.id} className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{e.libelle}</span>
                  <Badge variant="outline" className="text-xs">{e.date}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{(e.montant / 1000000).toFixed(1)}M FCFA</span>
                  <Badge variant={e.statut === "À payer" ? "destructive" : "secondary"} className="text-xs">
                    {e.statut}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tresorerie" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tresorerie">Trésorerie</TabsTrigger>
          <TabsTrigger value="impayes">Impayés</TabsTrigger>
          <TabsTrigger value="depenses">Répartition Dépenses</TabsTrigger>
        </TabsList>

        <TabsContent value="tresorerie">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la Trésorerie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionTresorerie}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    <Line 
                      type="monotone" 
                      dataKey="solde" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                      name="Solde" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impayes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Impayés par Classe
              </CardTitle>
              <CardDescription>Créances en attente de recouvrement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impayesParClasse} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <YAxis dataKey="classe" type="category" width={80} />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${(value / 1000000).toFixed(1)}M FCFA (${props.payload.eleves} élèves)`,
                        "Montant"
                      ]} 
                    />
                    <Bar dataKey="montant" radius={[0, 4, 4, 0]}>
                      {impayesParClasse.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depenses">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repartitionDepenses}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {repartitionDepenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
