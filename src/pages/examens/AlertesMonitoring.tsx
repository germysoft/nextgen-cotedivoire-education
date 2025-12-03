import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Bell, BellRing, AlertTriangle, AlertCircle, CheckCircle, Clock, 
  Users, Send, Shield, Activity, Volume2, VolumeX, RefreshCw,
  ArrowUpRight, Mail, MessageSquare, Phone, Zap, Eye, XCircle,
  TrendingUp, BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface ExamAlert {
  id: string;
  type: "critique" | "urgent" | "attention" | "info";
  titre: string;
  description: string;
  source: string;
  timestamp: Date;
  statut: "nouveau" | "en_cours" | "escalade" | "resolu";
  escaladeNiveau: number;
  destinataires: string[];
  acquittePar?: string;
  acquitteAt?: Date;
}

interface EscalationRule {
  niveau: number;
  delai: number; // en minutes
  destinataires: string[];
  canaux: string[];
}

const escalationRules: EscalationRule[] = [
  { niveau: 1, delai: 5, destinataires: ["Surveillant Chef"], canaux: ["notification", "sms"] },
  { niveau: 2, delai: 15, destinataires: ["Chef Centre", "Surveillant Chef"], canaux: ["notification", "sms", "email"] },
  { niveau: 3, delai: 30, destinataires: ["Direction", "Chef Centre", "DECO"], canaux: ["notification", "sms", "email", "appel"] },
];

const generateMockAlert = (): ExamAlert => {
  const types: ExamAlert["type"][] = ["critique", "urgent", "attention", "info"];
  const alertTemplates = [
    { type: "critique", titre: "Absence candidat important", description: "Candidat #45678 absent - Top 10 académique", source: "Salle A12" },
    { type: "critique", titre: "Incident sécurité", description: "Tentative de fraude détectée", source: "Salle B05" },
    { type: "urgent", titre: "Problème technique", description: "Panne électrique partielle", source: "Bâtiment C" },
    { type: "urgent", titre: "Retard jury", description: "2 membres du jury non arrivés", source: "Salle D08" },
    { type: "attention", titre: "Capacité dépassée", description: "Salle au-dessus de la capacité (+3)", source: "Salle A03" },
    { type: "attention", titre: "Matériel manquant", description: "Copies supplémentaires requises", source: "Salle B12" },
    { type: "info", titre: "Épreuve terminée", description: "Mathématiques - Session terminée", source: "Centre Principal" },
    { type: "info", titre: "Candidat retardataire", description: "Admission acceptée (+10 min)", source: "Salle A07" },
  ];
  
  const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
  
  return {
    id: `ALR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: template.type as ExamAlert["type"],
    titre: template.titre,
    description: template.description,
    source: template.source,
    timestamp: new Date(),
    statut: "nouveau",
    escaladeNiveau: 0,
    destinataires: ["Surveillant"],
  };
};

// Initial mock alerts
const initialAlerts: ExamAlert[] = [
  {
    id: "ALR-001",
    type: "critique",
    titre: "Absence massive salle B12",
    description: "15 candidats absents sur 30 - Anomalie statistique",
    source: "Salle B12",
    timestamp: new Date(Date.now() - 25 * 60000),
    statut: "escalade",
    escaladeNiveau: 2,
    destinataires: ["Chef Centre", "Surveillant Chef", "DECO"],
  },
  {
    id: "ALR-002",
    type: "urgent",
    titre: "Copies insuffisantes",
    description: "Stock de copies épuisé - 50 candidats sans copies",
    source: "Centre Principal",
    timestamp: new Date(Date.now() - 10 * 60000),
    statut: "en_cours",
    escaladeNiveau: 1,
    destinataires: ["Surveillant Chef"],
    acquittePar: "M. Kouassi",
    acquitteAt: new Date(Date.now() - 8 * 60000),
  },
  {
    id: "ALR-003",
    type: "attention",
    titre: "Climatisation défaillante",
    description: "Température élevée salle C05 - 32°C",
    source: "Salle C05",
    timestamp: new Date(Date.now() - 45 * 60000),
    statut: "resolu",
    escaladeNiveau: 1,
    destinataires: ["Maintenance"],
  },
];

export default function AlertesMonitoring() {
  const [alerts, setAlerts] = useState<ExamAlert[]>(initialAlerts);
  const [isLive, setIsLive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterType, setFilterType] = useState("tous");
  const [filterStatut, setFilterStatut] = useState("tous");

  // Simulate real-time alerts
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = generateMockAlert();
        setAlerts(prev => [newAlert, ...prev]);
        
        if (soundEnabled && (newAlert.type === "critique" || newAlert.type === "urgent")) {
          // Play notification sound (simulated)
          toast.error(`🚨 ${newAlert.titre}`, {
            description: newAlert.description,
            duration: 10000,
          });
        } else {
          toast.info(newAlert.titre, { description: newAlert.source });
        }
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isLive, soundEnabled]);

  // Auto-escalation simulation
  useEffect(() => {
    const escalationInterval = setInterval(() => {
      setAlerts(prev => prev.map(alert => {
        if (alert.statut === "nouveau" || alert.statut === "en_cours") {
          const minutesSinceCreation = (Date.now() - alert.timestamp.getTime()) / 60000;
          
          for (const rule of escalationRules) {
            if (minutesSinceCreation >= rule.delai && alert.escaladeNiveau < rule.niveau) {
              if (alert.type === "critique" || alert.type === "urgent") {
                toast.warning(`⬆️ Escalade niveau ${rule.niveau}`, {
                  description: `${alert.titre} - Notifié: ${rule.destinataires.join(", ")}`,
                });
                return {
                  ...alert,
                  escaladeNiveau: rule.niveau,
                  statut: "escalade" as const,
                  destinataires: rule.destinataires,
                };
              }
            }
          }
        }
        return alert;
      }));
    }, 10000);
    
    return () => clearInterval(escalationInterval);
  }, []);

  const handleAcquitter = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, statut: "en_cours" as const, acquittePar: "Utilisateur", acquitteAt: new Date() }
        : alert
    ));
    toast.success("Alerte acquittée");
  }, []);

  const handleResoudre = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, statut: "resolu" as const }
        : alert
    ));
    toast.success("Alerte résolue");
  }, []);

  const getAlertIcon = (type: ExamAlert["type"]) => {
    switch (type) {
      case "critique": return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "urgent": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "attention": return <Bell className="h-5 w-5 text-yellow-600" />;
      default: return <CheckCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertBadge = (type: ExamAlert["type"]) => {
    switch (type) {
      case "critique": return <Badge variant="destructive">Critique</Badge>;
      case "urgent": return <Badge className="bg-orange-500">Urgent</Badge>;
      case "attention": return <Badge className="bg-yellow-500 text-black">Attention</Badge>;
      default: return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getStatusBadge = (statut: ExamAlert["statut"]) => {
    switch (statut) {
      case "nouveau": return <Badge variant="outline" className="border-red-500 text-red-500">Nouveau</Badge>;
      case "en_cours": return <Badge variant="outline" className="border-blue-500 text-blue-500">En cours</Badge>;
      case "escalade": return <Badge variant="outline" className="border-orange-500 text-orange-500">Escaladé</Badge>;
      case "resolu": return <Badge variant="outline" className="border-green-500 text-green-500">Résolu</Badge>;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== "tous" && alert.type !== filterType) return false;
    if (filterStatut !== "tous" && alert.statut !== filterStatut) return false;
    return true;
  });

  const stats = {
    total: alerts.length,
    critiques: alerts.filter(a => a.type === "critique" && a.statut !== "resolu").length,
    urgents: alerts.filter(a => a.type === "urgent" && a.statut !== "resolu").length,
    enCours: alerts.filter(a => a.statut === "en_cours").length,
    escalades: alerts.filter(a => a.statut === "escalade").length,
    resolus: alerts.filter(a => a.statut === "resolu").length,
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BellRing className="h-8 w-8 text-primary" />
            Monitoring Alertes Examens
          </h1>
          <p className="text-muted-foreground">Surveillance temps réel et escalade automatique</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="live" checked={isLive} onCheckedChange={setIsLive} />
            <Label htmlFor="live" className="flex items-center gap-1">
              {isLive ? <Activity className="h-4 w-4 text-green-500 animate-pulse" /> : <Activity className="h-4 w-4" />}
              Live
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            <Label htmlFor="sound">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Label>
          </div>
          <Button variant="outline" size="icon" onClick={() => setAlerts(initialAlerts)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Alerte critique en haut */}
      {stats.critiques > 0 && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alertes Critiques Actives</AlertTitle>
          <AlertDescription>
            {stats.critiques} alerte(s) critique(s) nécessitent une attention immédiate.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Alertes</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.critiques}</p>
                <p className="text-xs text-muted-foreground">Critiques</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.urgents}</p>
                <p className="text-xs text-muted-foreground">Urgents</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.enCours}</p>
                <p className="text-xs text-muted-foreground">En Cours</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-500/50 bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.escalades}</p>
                <p className="text-xs text-muted-foreground">Escaladés</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.resolus}</p>
                <p className="text-xs text-muted-foreground">Résolus</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live">Flux Temps Réel</TabsTrigger>
          <TabsTrigger value="escalation">Règles Escalade</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        {/* Flux temps réel */}
        <TabsContent value="live" className="space-y-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="critique">Critique</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="attention">Attention</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="escalade">Escaladé</SelectItem>
                <SelectItem value="resolu">Résolu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`transition-all ${
                    alert.type === "critique" && alert.statut !== "resolu" 
                      ? "border-red-500 bg-red-50/50 dark:bg-red-950/20 animate-pulse" 
                      : alert.type === "urgent" && alert.statut !== "resolu"
                      ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold">{alert.titre}</span>
                            {getAlertBadge(alert.type)}
                            {getStatusBadge(alert.statut)}
                            {alert.escaladeNiveau > 0 && (
                              <Badge variant="outline" className="text-purple-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                Niveau {alert.escaladeNiveau}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {alert.source}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {alert.timestamp.toLocaleTimeString("fr-FR")}
                            </span>
                            {alert.acquittePar && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {alert.acquittePar}
                              </span>
                            )}
                          </div>
                          {alert.destinataires.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {alert.destinataires.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {alert.statut !== "resolu" && (
                        <div className="flex gap-2">
                          {alert.statut === "nouveau" && (
                            <Button size="sm" variant="outline" onClick={() => handleAcquitter(alert.id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Acquitter
                            </Button>
                          )}
                          <Button size="sm" onClick={() => handleResoudre(alert.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Résoudre
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Règles d'escalade */}
        <TabsContent value="escalation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuration Escalade Automatique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {escalationRules.map((rule) => (
                  <div key={rule.niveau} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          Niveau {rule.niveau}
                        </Badge>
                        <span className="text-muted-foreground">
                          Après {rule.delai} minutes sans réponse
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Destinataires</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.destinataires.map((dest, idx) => (
                            <Badge key={idx} variant="secondary">
                              <Users className="h-3 w-3 mr-1" />
                              {dest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Canaux de notification</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.canaux.map((canal, idx) => (
                            <Badge key={idx} variant="outline">
                              {canal === "notification" && <Bell className="h-3 w-3 mr-1" />}
                              {canal === "sms" && <MessageSquare className="h-3 w-3 mr-1" />}
                              {canal === "email" && <Mail className="h-3 w-3 mr-1" />}
                              {canal === "appel" && <Phone className="h-3 w-3 mr-1" />}
                              {canal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flux d'Escalade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {escalationRules.map((rule, idx) => (
                  <div key={rule.niveau} className="flex items-center">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        rule.niveau === 1 ? "bg-yellow-100 dark:bg-yellow-900/30" :
                        rule.niveau === 2 ? "bg-orange-100 dark:bg-orange-900/30" :
                        "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        <span className="text-2xl font-bold">{rule.niveau}</span>
                      </div>
                      <p className="text-xs mt-2 text-muted-foreground">{rule.delai} min</p>
                    </div>
                    {idx < escalationRules.length - 1 && (
                      <ArrowUpRight className="h-6 w-6 mx-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique */}
        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Escalade</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Heure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.slice(0, 20).map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                      <TableCell>{getAlertBadge(alert.type)}</TableCell>
                      <TableCell>{alert.titre}</TableCell>
                      <TableCell>{alert.source}</TableCell>
                      <TableCell>
                        {alert.escaladeNiveau > 0 ? (
                          <Badge variant="outline">Niveau {alert.escaladeNiveau}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(alert.statut)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Indicateur de connexion */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Connecté - Surveillance active</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-600">Déconnecté - Surveillance inactive</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}</span>
              <span>{alerts.length} alertes en mémoire</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
