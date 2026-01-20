import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, BookOpen, TrendingUp, AlertCircle, CheckCircle, Download, Loader2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateDashboardReport } from "@/components/dashboard/DashboardReportGenerator";

const performanceData = [
  { mois: "Sep", effectif: 450, presence: 425, absences: 25 },
  { mois: "Oct", effectif: 455, presence: 430, absences: 25 },
  { mois: "Nov", effectif: 458, presence: 440, absences: 18 },
  { mois: "Déc", effectif: 460, presence: 445, absences: 15 },
  { mois: "Jan", effectif: 462, presence: 450, absences: 12 },
  { mois: "Fév", effectif: 465, presence: 455, absences: 10 },
];

const budgetData = [
  { categorie: "Salaires", montant: 45000000, pourcentage: 60 },
  { categorie: "Infrastructures", montant: 15000000, pourcentage: 20 },
  { categorie: "Fournitures", montant: 7500000, pourcentage: 10 },
  { categorie: "Activités", montant: 7500000, pourcentage: 10 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const alertes = [
  { id: 1, type: "urgent", message: "15 dossiers d'inscription incomplets", timestamp: "Il y a 2h" },
  { id: 2, type: "warning", message: "Réunion pédagogique demain 14h", timestamp: "Il y a 5h" },
  { id: 3, type: "info", message: "Nouveau partenariat signé avec APEL", timestamp: "Il y a 1j" },
  { id: 4, type: "success", message: "Tous les bulletins du T1 validés", timestamp: "Il y a 2j" },
];

const Admin = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      generateDashboardReport({
        title: "Rapport Administratif",
        subtitle: "Vue d'ensemble de la gestion administrative",
        establishment: "NextGen Éducation",
        period: "Année scolaire 2024-2025",
        kpis: [
          { label: "Effectif Total", value: "465", change: "+2.1%", trend: "up" },
          { label: "Personnel", value: "42", change: "32 ens., 10 admin" },
          { label: "Classes Actives", value: "18", change: "6 niveaux" },
          { label: "Taux Présence", value: "97.8%", change: "+0.5%", trend: "up" },
        ],
        alerts: alertes.map(a => ({ type: a.type, message: a.message })),
        tables: [
          {
            title: "Évolution de l'Effectif et Présence",
            headers: ["Mois", "Effectif", "Présence", "Absences"],
            rows: performanceData.map(p => [p.mois, p.effectif, p.presence, p.absences]),
          },
          {
            title: "Répartition Budgétaire",
            headers: ["Catégorie", "Montant (FCFA)", "Pourcentage"],
            rows: budgetData.map(b => [b.categorie, b.montant.toLocaleString("fr-FR"), `${b.pourcentage}%`]),
          },
        ],
        chartData: [
          {
            title: "Répartition du Budget",
            type: "pie",
            data: budgetData.map(b => ({ name: b.categorie, value: b.pourcentage })),
          },
        ],
      });
      toast({
        title: "Rapport généré",
        description: "Le rapport administratif a été téléchargé avec succès.",
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Tableau de Bord Administratif</h1>
          <p className="text-muted-foreground mt-2">Vue d'ensemble de la gestion administrative</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? "Génération..." : "Générer Rapport"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effectif Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">465</div>
            <p className="text-xs text-muted-foreground">+2.1% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">32 enseignants, 10 admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Actives</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">6 niveaux</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.8%</div>
            <p className="text-xs text-muted-foreground">+0.5% vs mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de l'Effectif et Présence</CardTitle>
              <CardDescription>Suivi mensuel septembre - février</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="effectif" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="presence" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  <Line type="monotone" dataKey="absences" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition Budgétaire</CardTitle>
                <CardDescription>Budget annuel 2024-2025</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categorie, pourcentage }) => `${categorie} ${pourcentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="montant"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails Budgétaires</CardTitle>
                <CardDescription>Montants alloués par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.map((item, index) => (
                    <div key={item.categorie} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="font-medium">{item.categorie}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.montant.toLocaleString('fr-FR')} FCFA</div>
                        <div className="text-xs text-muted-foreground">{item.pourcentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes et Notifications</CardTitle>
              <CardDescription>Dernières notifications importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertes.map((alerte) => (
                  <div key={alerte.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    {alerte.type === "urgent" && <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />}
                    {alerte.type === "warning" && <AlertCircle className="h-5 w-5 text-warning mt-0.5" />}
                    {alerte.type === "info" && <AlertCircle className="h-5 w-5 text-primary mt-0.5" />}
                    {alerte.type === "success" && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-medium">{alerte.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alerte.timestamp}</p>
                    </div>
                    <Badge variant={alerte.type === "urgent" ? "destructive" : "secondary"}>
                      {alerte.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
