import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, GraduationCap, TrendingUp, TrendingDown, DollarSign, 
  Calendar, AlertTriangle, CheckCircle, Clock, BarChart3,
  School, Award, BookOpen, Target, Activity, Bell, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";

const statsGenerales = {
  effectifTotal: 2450,
  effectifChange: +85,
  tauxReussite: 92.5,
  tauxReussiteChange: +2.3,
  tauxAbsenteisme: 4.2,
  tauxAbsenteismeChange: -0.8,
  recouvrementFrais: 78,
  recouvrementChange: +5,
};

const evolutionEffectifs = [
  { mois: "Sept", primaire: 850, college: 920, lycee: 680 },
  { mois: "Oct", primaire: 855, college: 925, lycee: 685 },
  { mois: "Nov", primaire: 860, college: 930, lycee: 690 },
  { mois: "Déc", primaire: 862, college: 935, lycee: 695 },
];

const repartitionCycles = [
  { name: "Primaire", value: 850, color: "#3b82f6" },
  { name: "Collège", value: 920, color: "#10b981" },
  { name: "Lycée", value: 680, color: "#f59e0b" },
];

const performancesParNiveau = [
  { niveau: "6ème", moyenne: 12.5, tauxReussite: 88 },
  { niveau: "5ème", moyenne: 11.8, tauxReussite: 85 },
  { niveau: "4ème", moyenne: 12.2, tauxReussite: 87 },
  { niveau: "3ème", moyenne: 13.1, tauxReussite: 91 },
  { niveau: "2nde", moyenne: 11.5, tauxReussite: 82 },
  { niveau: "1ère", moyenne: 12.8, tauxReussite: 89 },
  { niveau: "Tle", moyenne: 13.5, tauxReussite: 94 },
];

const alertesRecentes = [
  { id: 1, type: "finance", message: "15 élèves avec frais impayés depuis +3 mois", priorite: "haute" },
  { id: 2, type: "discipline", message: "Conseil de discipline prévu pour 2 élèves", priorite: "moyenne" },
  { id: 3, type: "pedagogie", message: "Taux d'absence élevé en Tle D (8.5%)", priorite: "moyenne" },
  { id: 4, type: "infrastructure", message: "Maintenance urgente bloc sanitaire B", priorite: "haute" },
  { id: 5, type: "personnel", message: "3 enseignants absents cette semaine", priorite: "basse" },
];

const objectifsAnnuels = [
  { objectif: "Taux de réussite au BAC", cible: 95, actuel: 92.5, statut: "en_cours" },
  { objectif: "Taux de recouvrement", cible: 100, actuel: 78, statut: "en_cours" },
  { objectif: "Taux d'absentéisme < 5%", cible: 5, actuel: 4.2, statut: "atteint" },
  { objectif: "Satisfaction parents > 85%", cible: 85, actuel: 88, statut: "atteint" },
];

const evolutionFinances = [
  { mois: "Sept", recettes: 45000000, depenses: 38000000 },
  { mois: "Oct", recettes: 42000000, depenses: 35000000 },
  { mois: "Nov", recettes: 38000000, depenses: 36000000 },
  { mois: "Déc", recettes: 35000000, depenses: 32000000 },
];

export default function DirecteurDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Directeur</h1>
          <p className="text-muted-foreground">Vue stratégique de l'établissement • Année 2024-2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Trimestre 1
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Rapport complet
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effectif Total</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.effectifTotal.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{statsGenerales.effectifChange} ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.tauxReussite}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{statsGenerales.tauxReussiteChange}% vs année précédente
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Absentéisme</CardTitle>
            <Activity className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.tauxAbsenteisme}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              {statsGenerales.tauxAbsenteismeChange}% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recouvrement</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.recouvrementFrais}%</div>
            <Progress value={statsGenerales.recouvrementFrais} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Alertes */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alertes Prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertesRecentes.map((alerte) => (
              <div 
                key={alerte.id} 
                className={`p-3 rounded-lg border-l-4 ${
                  alerte.priorite === 'haute' ? 'border-l-red-500 bg-red-50 dark:bg-red-950' :
                  alerte.priorite === 'moyenne' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
                  'border-l-blue-500 bg-blue-50 dark:bg-blue-950'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    alerte.priorite === 'haute' ? 'text-red-500' :
                    alerte.priorite === 'moyenne' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alerte.message}</p>
                    <Badge variant="outline" className="mt-1 text-xs capitalize">{alerte.type}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Objectifs annuels */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs Annuels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {objectifsAnnuels.map((obj, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{obj.objectif}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{obj.actuel}% / {obj.cible}%</span>
                    {obj.statut === 'atteint' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                <Progress 
                  value={(obj.actuel / obj.cible) * 100} 
                  className={`h-2 ${obj.statut === 'atteint' ? '[&>div]:bg-green-500' : ''}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="effectifs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="effectifs">Effectifs</TabsTrigger>
          <TabsTrigger value="performances">Performances</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="effectifs">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={repartitionCycles}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {repartitionCycles.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} élèves`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution des Effectifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolutionEffectifs}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="primaire" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Primaire" />
                      <Area type="monotone" dataKey="college" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Collège" />
                      <Area type="monotone" dataKey="lycee" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Lycée" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performances">
          <Card>
            <CardHeader>
              <CardTitle>Performances par Niveau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performancesParNiveau}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="niveau" />
                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="moyenne" fill="#3b82f6" name="Moyenne /20" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="tauxReussite" fill="#10b981" name="Taux réussite %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Financière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionFinances}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    <Legend />
                    <Line type="monotone" dataKey="recettes" stroke="#10b981" strokeWidth={2} name="Recettes" />
                    <Line type="monotone" dataKey="depenses" stroke="#ef4444" strokeWidth={2} name="Dépenses" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
