import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  TrendingUp, 
  TrendingDown,
  Building,
  Calendar,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Target,
  Briefcase,
  GraduationCap,
  Heart,
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
  LineChart, Line,
  AreaChart, Area,
  RadialBarChart, RadialBar
} from "recharts";
import { mockPersonnel } from "@/data/mockPersonnel";

// Données pour les graphiques
const evolutionEffectifs = [
  { mois: "Jan", effectif: 42, entrees: 2, sorties: 1 },
  { mois: "Fév", effectif: 43, entrees: 3, sorties: 2 },
  { mois: "Mar", effectif: 44, entrees: 2, sorties: 1 },
  { mois: "Avr", effectif: 45, entrees: 3, sorties: 2 },
  { mois: "Mai", effectif: 46, entrees: 2, sorties: 1 },
  { mois: "Juin", effectif: 48, entrees: 4, sorties: 2 },
  { mois: "Juil", effectif: 47, entrees: 1, sorties: 2 },
  { mois: "Août", effectif: 48, entrees: 2, sorties: 1 },
  { mois: "Sep", effectif: 52, entrees: 5, sorties: 1 },
  { mois: "Oct", effectif: 53, entrees: 2, sorties: 1 },
  { mois: "Nov", effectif: 54, entrees: 3, sorties: 2 },
  { mois: "Déc", effectif: 55, entrees: 2, sorties: 1 }
];

const repartitionDepartement = [
  { name: "Enseignement", value: 28, color: "#3b82f6" },
  { name: "Administration", value: 12, color: "#10b981" },
  { name: "Vie Scolaire", value: 6, color: "#f59e0b" },
  { name: "Technique", value: 5, color: "#8b5cf6" },
  { name: "Médical", value: 2, color: "#ef4444" },
  { name: "Direction", value: 2, color: "#06b6d4" }
];

const repartitionContrat = [
  { name: "CDI", value: 40, color: "#10b981" },
  { name: "CDD", value: 10, color: "#f59e0b" },
  { name: "Vacation", value: 4, color: "#8b5cf6" },
  { name: "Stage", value: 1, color: "#3b82f6" }
];

const repartitionAnciennete = [
  { tranche: "< 1 an", count: 8 },
  { tranche: "1-3 ans", count: 15 },
  { tranche: "3-5 ans", count: 12 },
  { tranche: "5-10 ans", count: 14 },
  { tranche: "> 10 ans", count: 6 }
];

const pyramideAges = [
  { tranche: "< 25 ans", hommes: 3, femmes: 4 },
  { tranche: "25-34 ans", hommes: 8, femmes: 10 },
  { tranche: "35-44 ans", hommes: 7, femmes: 9 },
  { tranche: "45-54 ans", hommes: 5, femmes: 4 },
  { tranche: "55+ ans", hommes: 3, femmes: 2 }
];

const turnoverMensuel = [
  { mois: "Jan", taux: 2.3 },
  { mois: "Fév", taux: 4.5 },
  { mois: "Mar", taux: 2.2 },
  { mois: "Avr", taux: 4.3 },
  { mois: "Mai", taux: 2.1 },
  { mois: "Juin", taux: 4.1 },
  { mois: "Juil", taux: 4.2 },
  { mois: "Août", taux: 2.0 },
  { mois: "Sep", taux: 1.9 },
  { mois: "Oct", taux: 1.8 },
  { mois: "Nov", taux: 3.6 },
  { mois: "Déc", taux: 1.8 }
];

const absenteismeMensuel = [
  { mois: "Jan", taux: 4.5 },
  { mois: "Fév", taux: 5.2 },
  { mois: "Mar", taux: 3.8 },
  { mois: "Avr", taux: 4.1 },
  { mois: "Mai", taux: 3.5 },
  { mois: "Juin", taux: 3.2 },
  { mois: "Juil", taux: 2.8 },
  { mois: "Août", taux: 2.5 },
  { mois: "Sep", taux: 4.2 },
  { mois: "Oct", taux: 4.8 },
  { mois: "Nov", taux: 5.5 },
  { mois: "Déc", taux: 6.2 }
];

const masseSalariale = [
  { mois: "Jan", montant: 18500000 },
  { mois: "Fév", montant: 18700000 },
  { mois: "Mar", montant: 18900000 },
  { mois: "Avr", montant: 19200000 },
  { mois: "Mai", montant: 19500000 },
  { mois: "Juin", montant: 20100000 },
  { mois: "Juil", montant: 19800000 },
  { mois: "Août", montant: 20000000 },
  { mois: "Sep", montant: 21500000 },
  { mois: "Oct", montant: 21800000 },
  { mois: "Nov", montant: 22000000 },
  { mois: "Déc", montant: 22500000 }
];

const formationsStats = [
  { categorie: "Pédagogie", heures: 120, budget: 500000 },
  { categorie: "Bureautique", heures: 80, budget: 300000 },
  { categorie: "Management", heures: 40, budget: 400000 },
  { categorie: "Sécurité", heures: 35, budget: 150000 },
  { categorie: "Langues", heures: 60, budget: 250000 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function TableauBordRH() {
  const [periode, setPeriode] = useState("2024");
  
  // Calcul des KPIs
  const effectifTotal = 55;
  const effectifPrecedent = 42;
  const variationEffectif = ((effectifTotal - effectifPrecedent) / effectifPrecedent * 100).toFixed(1);
  
  const tauxTurnover = 2.9;
  const tauxAbsenteisme = 4.2;
  const tauxEncadrement = (12 / effectifTotal * 100).toFixed(1);
  const ageMoyen = 38;
  const ancienneteMoyenne = 4.5;
  const ratioHF = "45/55";
  
  const entreesAnnee = evolutionEffectifs.reduce((acc, m) => acc + m.entrees, 0);
  const sortiesAnnee = evolutionEffectifs.reduce((acc, m) => acc + m.sorties, 0);

  const masseSalarialeTotal = masseSalariale.reduce((acc, m) => acc + m.montant, 0);
  const budgetFormationTotal = formationsStats.reduce((acc, f) => acc + f.budget, 0);
  const heuresFormationTotal = formationsStats.reduce((acc, f) => acc + f.heures, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord RH</h1>
          <p className="text-muted-foreground">Vue d'ensemble des indicateurs ressources humaines</p>
        </div>
        <Select value={periode} onValueChange={setPeriode}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">Année 2024</SelectItem>
            <SelectItem value="2023">Année 2023</SelectItem>
            <SelectItem value="2022">Année 2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Effectif total</p>
                <p className="text-2xl font-bold">{effectifTotal}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{variationEffectif}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entrées</p>
                <p className="text-2xl font-bold text-green-600">{entreesAnnee}</p>
                <p className="text-xs text-muted-foreground">cette année</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sorties</p>
                <p className="text-2xl font-bold text-red-600">{sortiesAnnee}</p>
                <p className="text-xs text-muted-foreground">cette année</p>
              </div>
              <UserMinus className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Turnover</p>
                <p className="text-2xl font-bold">{tauxTurnover}%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingDown className="h-3 w-3" />
                  <span>-0.5%</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absentéisme</p>
                <p className="text-2xl font-bold">{tauxAbsenteisme}%</p>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+0.3%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Âge moyen</p>
                <p className="text-2xl font-bold">{ageMoyen} ans</p>
                <p className="text-xs text-muted-foreground">H/F: {ratioHF}</p>
              </div>
              <Heart className="h-8 w-8 text-pink-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="effectifs" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="effectifs">Effectifs</TabsTrigger>
          <TabsTrigger value="turnover">Turnover & Absentéisme</TabsTrigger>
          <TabsTrigger value="demographics">Démographie</TabsTrigger>
          <TabsTrigger value="financier">Masse Salariale</TabsTrigger>
          <TabsTrigger value="formation">Formation</TabsTrigger>
        </TabsList>

        {/* Effectifs */}
        <TabsContent value="effectifs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des effectifs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Évolution des effectifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evolutionEffectifs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="effectif" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Entrées/Sorties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mouvements de personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={evolutionEffectifs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entrees" name="Entrées" fill="#10b981" />
                    <Bar dataKey="sorties" name="Sorties" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition par département */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Répartition par département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ResponsiveContainer width="50%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={repartitionDepartement}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {repartitionDepartement.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {repartitionDepartement.map((dept, i) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                          <span className="text-sm">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{dept.value}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(dept.value / effectifTotal * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Répartition par type de contrat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Répartition par contrat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ResponsiveContainer width="50%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={repartitionContrat}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {repartitionContrat.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {repartitionContrat.map((type) => (
                      <div key={type.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                            <span className="text-sm">{type.name}</span>
                          </div>
                          <span className="font-medium">{type.value}</span>
                        </div>
                        <Progress value={(type.value / effectifTotal) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Turnover & Absentéisme */}
        <TabsContent value="turnover" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Turnover annuel</p>
                    <p className="text-2xl font-bold">{tauxTurnover}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Absentéisme moyen</p>
                    <p className="text-2xl font-bold">{tauxAbsenteisme}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de rétention</p>
                    <p className="text-2xl font-bold">{(100 - tauxTurnover).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ancienneté moyenne</p>
                    <p className="text-2xl font-bold">{ancienneteMoyenne} ans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du turnover</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={turnoverMensuel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Turnover']} />
                    <Line type="monotone" dataKey="taux" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution de l'absentéisme</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={absenteismeMensuel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Absentéisme']} />
                    <Line type="monotone" dataKey="taux" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ancienneté du personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={repartitionAnciennete} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="tranche" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" name="Effectif" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Démographie */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Âge moyen</p>
                  <p className="text-3xl font-bold">{ageMoyen} ans</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Ratio H/F</p>
                  <p className="text-3xl font-bold">{ratioHF}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Taux d'encadrement</p>
                  <p className="text-3xl font-bold">{tauxEncadrement}%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Seniors (55+)</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pyramide des âges</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pyramideAges} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="tranche" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hommes" name="Hommes" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="femmes" name="Femmes" fill="#ec4899" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par genre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-blue-600">45%</span>
                    </div>
                    <p className="font-medium">Hommes</p>
                    <p className="text-sm text-muted-foreground">25 personnes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-pink-600">55%</span>
                    </div>
                    <p className="font-medium">Femmes</p>
                    <p className="text-sm text-muted-foreground">30 personnes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Niveau d'études</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { niveau: "Doctorat", count: 3, percentage: 5 },
                    { niveau: "Master/DEA", count: 18, percentage: 33 },
                    { niveau: "Licence", count: 20, percentage: 36 },
                    { niveau: "BTS/DUT", count: 10, percentage: 18 },
                    { niveau: "Bac et moins", count: 4, percentage: 7 }
                  ].map(item => (
                    <div key={item.niveau}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.niveau}</span>
                        <span className="text-sm text-muted-foreground">{item.count} ({item.percentage}%)</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Masse Salariale */}
        <TabsContent value="financier" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Masse salariale annuelle</p>
                    <p className="text-xl font-bold">{(masseSalarialeTotal / 1000000).toFixed(1)} M FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Coût moyen/employé</p>
                    <p className="text-xl font-bold">{Math.round(masseSalarialeTotal / effectifTotal / 12000).toLocaleString()}K FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Évolution annuelle</p>
                    <p className="text-xl font-bold">+8.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget prévisionnel</p>
                    <p className="text-xl font-bold">265 M FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution de la masse salariale</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={masseSalariale}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value: number) => [`${(value / 1000000).toFixed(1)} M FCFA`, 'Masse salariale']} />
                  <Area type="monotone" dataKey="montant" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: "Enseignement", montant: 14500000, percentage: 55 },
                    { dept: "Administration", montant: 5800000, percentage: 22 },
                    { dept: "Direction", montant: 3200000, percentage: 12 },
                    { dept: "Technique", montant: 1800000, percentage: 7 },
                    { dept: "Médical", montant: 1000000, percentage: 4 }
                  ].map(item => (
                    <div key={item.dept}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.dept}</span>
                        <span className="text-sm font-medium">{(item.montant / 1000000).toFixed(1)} M FCFA</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Charges sociales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { charge: "CNPS (Retraite)", taux: "6.35%", montant: 1420000 },
                    { charge: "CNPS Employeur", taux: "7.75%", montant: 1740000 },
                    { charge: "Prestations familiales", taux: "5.5%", montant: 1230000 },
                    { charge: "Accident du travail", taux: "2%", montant: 450000 },
                    { charge: "ITS (Impôts)", taux: "~15%", montant: 3350000 }
                  ].map(item => (
                    <div key={item.charge} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium text-sm">{item.charge}</p>
                        <p className="text-xs text-muted-foreground">Taux: {item.taux}</p>
                      </div>
                      <span className="font-medium">{(item.montant / 1000).toLocaleString()}K FCFA</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Formation */}
        <TabsContent value="formation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Heures de formation</p>
                    <p className="text-2xl font-bold">{heuresFormationTotal}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget formation</p>
                    <p className="text-2xl font-bold">{(budgetFormationTotal / 1000).toLocaleString()}K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de participation</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Heures/employé</p>
                    <p className="text-2xl font-bold">{Math.round(heuresFormationTotal / effectifTotal)}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Heures par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formationsStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categorie" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="heures" name="Heures" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formationsStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categorie" />
                    <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                    <Tooltip formatter={(value: number) => [`${(value / 1000).toLocaleString()}K FCFA`, 'Budget']} />
                    <Bar dataKey="budget" name="Budget (FCFA)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de performance formation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">92%</p>
                  <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">85%</p>
                  <p className="text-sm text-muted-foreground">Taux de complétion</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">15</p>
                  <p className="text-sm text-muted-foreground">Formations dispensées</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-orange-600">8</p>
                  <p className="text-sm text-muted-foreground">Certifications obtenues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
