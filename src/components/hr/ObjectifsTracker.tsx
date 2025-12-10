import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Target, Bell, Calendar, TrendingUp, AlertTriangle, CheckCircle2,
  Clock, Filter, Search, ChevronRight, Users, BarChart3
} from "lucide-react";
import { mockEvaluations } from "@/data/mockEvaluations";
import { mockPersonnel } from "@/data/mockPersonnel";
import { ObjectifSMART } from "@/types/evaluation";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface ObjectifWithPersonnel extends ObjectifSMART {
  personnelId: string;
  personnelNom: string;
  evaluationPeriode: string;
}

export function ObjectifsTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterUrgence, setFilterUrgence] = useState<string>("all");
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'warning' | 'danger' | 'info' }>>([]);

  // Collecter tous les objectifs de toutes les évaluations
  const allObjectifs: ObjectifWithPersonnel[] = mockEvaluations.flatMap(evaluation => {
    const personnel = mockPersonnel.find(p => p.id === evaluation.personnelId);
    return evaluation.objectifsFuturs.map(obj => ({
      ...obj,
      personnelId: evaluation.personnelId,
      personnelNom: personnel ? `${personnel.prenom} ${personnel.nom}` : 'Inconnu',
      evaluationPeriode: evaluation.periode
    }));
  });

  // Calculer l'urgence basée sur la date d'échéance
  const getUrgence = (dateEcheance: string): 'critique' | 'urgent' | 'normal' | 'lointain' => {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffDays = Math.ceil((echeance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'critique';
    if (diffDays <= 7) return 'urgent';
    if (diffDays <= 30) return 'normal';
    return 'lointain';
  };

  const getUrgenceBadge = (urgence: string) => {
    switch (urgence) {
      case 'critique': return <Badge variant="destructive">En retard</Badge>;
      case 'urgent': return <Badge className="bg-orange-500">{"< 7 jours"}</Badge>;
      case 'normal': return <Badge className="bg-yellow-500">{"< 30 jours"}</Badge>;
      default: return <Badge variant="secondary">{"> 30 jours"}</Badge>;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'Atteint': return <Badge className="bg-green-500">Atteint</Badge>;
      case 'En cours': return <Badge className="bg-blue-500">En cours</Badge>;
      case 'Non atteint': return <Badge variant="destructive">Non atteint</Badge>;
      case 'Reporté': return <Badge variant="secondary">Reporté</Badge>;
      default: return <Badge variant="outline">{statut}</Badge>;
    }
  };

  // Générer les notifications d'échéance
  useEffect(() => {
    const newNotifications: typeof notifications = [];
    
    allObjectifs.forEach(obj => {
      if (obj.statut === 'En cours') {
        const urgence = getUrgence(obj.dateEcheance);
        if (urgence === 'critique') {
          newNotifications.push({
            id: obj.id,
            message: `Objectif "${obj.titre}" de ${obj.personnelNom} est en retard!`,
            type: 'danger'
          });
        } else if (urgence === 'urgent') {
          newNotifications.push({
            id: obj.id,
            message: `Objectif "${obj.titre}" de ${obj.personnelNom} arrive à échéance dans moins de 7 jours`,
            type: 'warning'
          });
        }
      }
    });
    
    setNotifications(newNotifications);
    
    // Afficher les toasts pour les alertes critiques
    const critiques = newNotifications.filter(n => n.type === 'danger');
    if (critiques.length > 0) {
      toast.warning(`${critiques.length} objectif(s) en retard nécessitent votre attention!`);
    }
  }, []);

  // Filtrer les objectifs
  const filteredObjectifs = allObjectifs.filter(obj => {
    const matchSearch = obj.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       obj.personnelNom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === "all" || obj.statut === filterStatut;
    const matchUrgence = filterUrgence === "all" || getUrgence(obj.dateEcheance) === filterUrgence;
    return matchSearch && matchStatut && matchUrgence;
  });

  // Statistiques pour le dashboard
  const stats = {
    total: allObjectifs.length,
    enCours: allObjectifs.filter(o => o.statut === 'En cours').length,
    atteints: allObjectifs.filter(o => o.statut === 'Atteint').length,
    enRetard: allObjectifs.filter(o => o.statut === 'En cours' && getUrgence(o.dateEcheance) === 'critique').length,
    progressionMoyenne: allObjectifs.length > 0 
      ? Math.round(allObjectifs.reduce((sum, o) => sum + o.progression, 0) / allObjectifs.length)
      : 0
  };

  // Données pour le graphique en camembert
  const pieData = [
    { name: 'Atteints', value: allObjectifs.filter(o => o.statut === 'Atteint').length, color: '#22c55e' },
    { name: 'En cours', value: allObjectifs.filter(o => o.statut === 'En cours').length, color: '#3b82f6' },
    { name: 'Non atteints', value: allObjectifs.filter(o => o.statut === 'Non atteint').length, color: '#ef4444' },
    { name: 'Reportés', value: allObjectifs.filter(o => o.statut === 'Reporté').length, color: '#6b7280' },
  ].filter(d => d.value > 0);

  // Données pour le graphique en barres (progression par personnel)
  const barData = mockPersonnel.slice(0, 6).map(p => {
    const personnelObjectifs = allObjectifs.filter(o => o.personnelId === p.id);
    const avgProgress = personnelObjectifs.length > 0
      ? Math.round(personnelObjectifs.reduce((sum, o) => sum + o.progression, 0) / personnelObjectifs.length)
      : 0;
    return {
      name: `${p.prenom.charAt(0)}. ${p.nom}`,
      progression: avgProgress
    };
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6" />
            Suivi des Objectifs
          </h2>
          <p className="text-muted-foreground">Tableau de bord de progression et alertes d'échéance</p>
        </div>
        <div className="relative">
          <Button variant="outline" className="relative">
            <Bell className="h-4 w-4 mr-2" />
            Alertes
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Objectifs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.enCours} en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atteints</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.atteints}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.atteints / stats.total) * 100) : 0}% de réussite
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.enRetard}</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.progressionMoyenne}%</div>
            <Progress value={stats.progressionMoyenne} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel Suivi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(allObjectifs.map(o => o.personnelId)).size}</div>
            <p className="text-xs text-muted-foreground">Personnes avec objectifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes d'échéance */}
      {notifications.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Alertes d'Échéance ({notifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {notifications.map((notif, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                      notif.type === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}
                  >
                    {notif.type === 'danger' ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {notif.message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste des Objectifs</TabsTrigger>
          <TabsTrigger value="graphiques">Graphiques</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher objectif ou personnel..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Atteint">Atteint</SelectItem>
                    <SelectItem value="Non atteint">Non atteint</SelectItem>
                    <SelectItem value="Reporté">Reporté</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterUrgence} onValueChange={setFilterUrgence}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Urgence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes urgences</SelectItem>
                    <SelectItem value="critique">En retard</SelectItem>
                    <SelectItem value="urgent">{"Urgent (< 7j)"}</SelectItem>
                    <SelectItem value="normal">{"Normal (< 30j)"}</SelectItem>
                    <SelectItem value="lointain">{"Lointain (> 30j)"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des objectifs */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredObjectifs.map((objectif) => (
                <Card key={objectif.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{objectif.titre}</h3>
                          {getStatutBadge(objectif.statut)}
                          {getUrgenceBadge(getUrgence(objectif.dateEcheance))}
                        </div>
                        <p className="text-sm text-muted-foreground">{objectif.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {objectif.personnelNom}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Échéance: {new Date(objectif.dateEcheance).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={objectif.progression} className="flex-1 h-2" />
                          <span className="text-sm font-medium w-12">{objectif.progression}%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredObjectifs.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  Aucun objectif trouvé avec ces critères
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="graphiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Graphique Camembert - Répartition par statut */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Répartition par Statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Graphique Barres - Progression par personnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Progression Moyenne par Personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded p-2 shadow-lg">
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Progression: {payload[0].value}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="progression" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendrier des échéances à venir */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Prochaines Échéances (30 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allObjectifs
                  .filter(o => {
                    const diff = Math.ceil((new Date(o.dateEcheance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return diff >= 0 && diff <= 30 && o.statut === 'En cours';
                  })
                  .sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime())
                  .slice(0, 10)
                  .map((obj) => {
                    const diff = Math.ceil((new Date(obj.dateEcheance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={obj.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${diff <= 7 ? 'bg-orange-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="font-medium text-sm">{obj.titre}</p>
                            <p className="text-xs text-muted-foreground">{obj.personnelNom}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(obj.dateEcheance).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Dans {diff} jour{diff > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {allObjectifs.filter(o => {
                  const diff = Math.ceil((new Date(o.dateEcheance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return diff >= 0 && diff <= 30 && o.statut === 'En cours';
                }).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune échéance dans les 30 prochains jours
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
