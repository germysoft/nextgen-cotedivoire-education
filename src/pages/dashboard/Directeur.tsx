import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, GraduationCap, DollarSign, TrendingUp, AlertTriangle, CheckCircle, 
  Calendar, BookOpen, Building2, Bell, ArrowUpRight, ArrowDownRight, Clock,
  Target, Award, FileText, BarChart3, PieChart
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend 
} from "recharts";

const Directeur = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("trimestre");

  const kpis = [
    { label: "Effectif Total", value: 1247, change: "+3.2%", trend: "up", icon: Users, color: "text-blue-500" },
    { label: "Taux de Réussite", value: "87.5%", change: "+2.1%", trend: "up", icon: Award, color: "text-green-500" },
    { label: "Recettes Collectées", value: "124.5M", change: "+15%", trend: "up", icon: DollarSign, color: "text-emerald-500" },
    { label: "Taux de Présence", value: "94.2%", change: "-0.8%", trend: "down", icon: CheckCircle, color: "text-amber-500" },
  ];

  const evolutionData = [
    { mois: "Sep", effectif: 1180, paiements: 85, presence: 96 },
    { mois: "Oct", effectif: 1195, paiements: 78, presence: 95 },
    { mois: "Nov", effectif: 1210, paiements: 82, presence: 94 },
    { mois: "Déc", effectif: 1225, paiements: 72, presence: 92 },
    { mois: "Jan", effectif: 1247, paiements: 88, presence: 94 },
  ];

  const repartitionClasses = [
    { name: "6ème", value: 245, color: "hsl(var(--primary))" },
    { name: "5ème", value: 238, color: "hsl(var(--chart-2))" },
    { name: "4ème", value: 252, color: "hsl(var(--chart-3))" },
    { name: "3ème", value: 265, color: "hsl(var(--chart-4))" },
    { name: "2nde", value: 128, color: "hsl(var(--chart-5))" },
    { name: "1ère", value: 119, color: "hsl(var(--muted))" },
  ];

  const performanceMatiere = [
    { matiere: "Maths", moyenne: 12.5, objectif: 14 },
    { matiere: "Français", moyenne: 11.8, objectif: 13 },
    { matiere: "Anglais", moyenne: 13.2, objectif: 14 },
    { matiere: "Sciences", moyenne: 12.1, objectif: 13 },
    { matiere: "Histoire", moyenne: 13.5, objectif: 14 },
  ];

  const alertes = [
    { type: "urgent", message: "12 dossiers d'inscription incomplets", icon: AlertTriangle, color: "text-red-500" },
    { type: "finance", message: "45 impayés en retard > 60 jours", icon: DollarSign, color: "text-amber-500" },
    { type: "pédagogie", message: "Conseil de classe 3ème demain 14h", icon: Calendar, color: "text-blue-500" },
    { type: "succès", message: "100% des bulletins T1 validés", icon: CheckCircle, color: "text-green-500" },
  ];

  const objectifsAnnuels = [
    { label: "Taux de réussite aux examens", actuel: 87, objectif: 90 },
    { label: "Recouvrement des frais", actuel: 78, objectif: 95 },
    { label: "Satisfaction parents", actuel: 82, objectif: 85 },
    { label: "Assiduité enseignants", actuel: 96, objectif: 98 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Directeur</h1>
          <p className="text-muted-foreground">Vue stratégique de l'établissement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />Rapport
          </Button>
          <Button size="sm">
            <Bell className="h-4 w-4 mr-2" />4 alertes
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-primary/10`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <Badge variant={kpi.trend === "up" ? "default" : "secondary"} className="text-xs">
                  {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertes rapides */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {alertes.map((alerte, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg whitespace-nowrap">
                <alerte.icon className={`h-4 w-4 ${alerte.color}`} />
                <span className="text-sm">{alerte.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vue-globale" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vue-globale">Vue Globale</TabsTrigger>
          <TabsTrigger value="pedagogie">Pédagogie</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="vue-globale">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution de l'Établissement</CardTitle>
                <CardDescription>Effectif, paiements et présence</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="effectif" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" fillOpacity={0.3} name="Effectif" />
                    <Line yAxisId="right" type="monotone" dataKey="presence" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Présence %" />
                    <Line yAxisId="right" type="monotone" dataKey="paiements" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Paiements %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Niveau</CardTitle>
                <CardDescription>1,247 élèves</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={repartitionClasses}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {repartitionClasses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pedagogie">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Matière</CardTitle>
                <CardDescription>Moyennes vs objectifs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceMatiere} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 20]} />
                    <YAxis type="category" dataKey="matiere" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="moyenne" fill="hsl(var(--primary))" name="Moyenne" />
                    <Bar dataKey="objectif" fill="hsl(var(--muted))" name="Objectif" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs Pédagogiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Taux de réussite global", value: 87.5, target: 90 },
                  { label: "Élèves en difficulté", value: 8.2, target: 5, inverse: true },
                  { label: "Excellence (>16/20)", value: 12.3, target: 15 },
                  { label: "Progression moyenne", value: 78, target: 80 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finances">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recettes Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">124.5M FCFA</p>
                <p className="text-sm text-muted-foreground mt-1">+15% vs année précédente</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Taux de Recouvrement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-600">78%</p>
                <p className="text-sm text-muted-foreground mt-1">Objectif: 95%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Impayés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">28.2M FCFA</p>
                <p className="text-sm text-muted-foreground mt-1">145 élèves concernés</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="objectifs">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs Annuels 2024-2025</CardTitle>
              <CardDescription>Suivi des indicateurs clés de performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {objectifsAnnuels.map((obj, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{obj.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Objectif: {obj.objectif}%</span>
                        <Badge variant={obj.actuel >= obj.objectif ? "default" : "secondary"}>
                          {obj.actuel}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={obj.actuel} className="h-3" />
                      <div 
                        className="absolute top-0 h-3 w-0.5 bg-primary"
                        style={{ left: `${obj.objectif}%` }}
                      />
                    </div>
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

export default Directeur;
