import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Globe, Plug, CheckCircle, XCircle, RefreshCw, Settings, Key, 
  Webhook, Database, Send, AlertTriangle, Clock, BarChart3, Shield,
  Smartphone, CreditCard, Mail, MessageSquare, Cloud, Link2
} from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: "connected" | "disconnected" | "error";
  category: "payment" | "communication" | "data" | "other";
  lastSync?: string;
  apiCalls?: number;
}

const APIExterne = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "1", name: "Orange Money", description: "Paiement mobile Orange", icon: Smartphone, status: "connected", category: "payment", lastSync: "Il y a 5 min", apiCalls: 1247 },
    { id: "2", name: "MTN Money", description: "Paiement mobile MTN", icon: Smartphone, status: "connected", category: "payment", lastSync: "Il y a 10 min", apiCalls: 892 },
    { id: "3", name: "Wave", description: "Transfert d'argent Wave", icon: CreditCard, status: "connected", category: "payment", lastSync: "Il y a 2 min", apiCalls: 456 },
    { id: "4", name: "Moov Money", description: "Paiement mobile Moov", icon: Smartphone, status: "disconnected", category: "payment" },
    { id: "5", name: "SMS Gateway", description: "Envoi SMS en masse", icon: MessageSquare, status: "connected", category: "communication", lastSync: "Il y a 1 min", apiCalls: 3421 },
    { id: "6", name: "Email SMTP", description: "Envoi emails transactionnels", icon: Mail, status: "connected", category: "communication", lastSync: "Il y a 30 sec", apiCalls: 8754 },
    { id: "7", name: "MENA Sync", description: "Synchronisation ministère", icon: Database, status: "error", category: "data" },
    { id: "8", name: "Cloud Backup", description: "Sauvegarde cloud sécurisée", icon: Cloud, status: "connected", category: "data", lastSync: "Il y a 1h", apiCalls: 24 },
  ]);

  const [webhooks] = useState([
    { id: "1", name: "Nouveau paiement", url: "https://api.ecole.ci/webhooks/payment", events: ["payment.success", "payment.failed"], status: "active" },
    { id: "2", name: "Inscription élève", url: "https://api.ecole.ci/webhooks/student", events: ["student.created", "student.updated"], status: "active" },
    { id: "3", name: "Alerte absence", url: "https://api.ecole.ci/webhooks/absence", events: ["absence.created"], status: "paused" },
  ]);

  const [apiLogs] = useState([
    { timestamp: "2024-01-15 10:30:45", endpoint: "/api/payments", method: "POST", status: 200, duration: "124ms" },
    { timestamp: "2024-01-15 10:30:12", endpoint: "/api/students", method: "GET", status: 200, duration: "89ms" },
    { timestamp: "2024-01-15 10:29:58", endpoint: "/api/sms/send", method: "POST", status: 200, duration: "1.2s" },
    { timestamp: "2024-01-15 10:29:30", endpoint: "/api/mena/sync", method: "POST", status: 500, duration: "5.4s" },
    { timestamp: "2024-01-15 10:28:45", endpoint: "/api/payments", method: "POST", status: 200, duration: "156ms" },
  ]);

  const handleConnect = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, status: "connected" as const, lastSync: "À l'instant" } : i
    ));
    toast.success("Intégration connectée avec succès");
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, status: "disconnected" as const, lastSync: undefined } : i
    ));
    toast.success("Intégration déconnectée");
  };

  const handleSync = (id: string) => {
    toast.success("Synchronisation lancée...");
    setTimeout(() => {
      setIntegrations(integrations.map(i => 
        i.id === id ? { ...i, lastSync: "À l'instant" } : i
      ));
      toast.success("Synchronisation terminée");
    }, 2000);
  };

  const stats = {
    totalCalls: integrations.reduce((sum, i) => sum + (i.apiCalls || 0), 0),
    connected: integrations.filter(i => i.status === "connected").length,
    errors: integrations.filter(i => i.status === "error").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intégrations API</h1>
          <p className="text-muted-foreground">Connectez vos services externes</p>
        </div>
        <Button>
          <Plug className="h-4 w-4 mr-2" />Nouvelle intégration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Appels API (mois)</p>
              <p className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connectées</p>
              <p className="text-2xl font-bold">{stats.connected}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Erreurs</p>
              <p className="text-2xl font-bold">{stats.errors}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Webhook className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Webhooks actifs</p>
              <p className="text-2xl font-bold">{webhooks.filter(w => w.status === "active").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs API</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className={integration.status === "error" ? "border-red-500/50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        integration.status === "connected" ? "bg-green-500/10" :
                        integration.status === "error" ? "bg-red-500/10" : "bg-muted"
                      }`}>
                        <integration.icon className={`h-6 w-6 ${
                          integration.status === "connected" ? "text-green-500" :
                          integration.status === "error" ? "text-red-500" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <Badge variant={
                      integration.status === "connected" ? "default" :
                      integration.status === "error" ? "destructive" : "secondary"
                    }>
                      {integration.status === "connected" ? "Connecté" :
                       integration.status === "error" ? "Erreur" : "Déconnecté"}
                    </Badge>
                  </div>
                  
                  {integration.status === "connected" && (
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Sync: {integration.lastSync}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{integration.apiCalls?.toLocaleString()} appels</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleSync(integration.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />Sync
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />Config
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDisconnect(integration.id)}>
                          Déconnecter
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleConnect(integration.id)}>
                        <Link2 className="h-4 w-4 mr-1" />Connecter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Webhooks Configurés</CardTitle>
                <Button size="sm">
                  <Webhook className="h-4 w-4 mr-2" />Nouveau webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Événements</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell className="font-mono text-xs">{webhook.url}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {webhook.events.map((e, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{e}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                          {webhook.status === "active" ? "Actif" : "Pausé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toast.success("Test envoyé")}>
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
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

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs API Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horodatage</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Durée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiLogs.map((log, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.status === 200 ? "default" : "destructive"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clés API</CardTitle>
                <CardDescription>Gérez vos clés d'accès API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Clé API Publique</Label>
                  <div className="flex gap-2">
                    <Input value="pk_live_xxxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => toast.success("Clé copiée")}>
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Clé API Secrète</Label>
                  <div className="flex gap-2">
                    <Input value="sk_live_•••••••••••••••••••••" readOnly type="password" className="font-mono text-sm" />
                    <Button variant="outline" size="icon">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.success("Nouvelles clés générées")}>
                  Régénérer les clés
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Limiter les IP autorisées", description: "Restreindre l'accès API à certaines IP" },
                  { label: "Journaliser les requêtes", description: "Conserver l'historique des appels" },
                  { label: "Notifications d'erreur", description: "Alerter en cas d'échec API" },
                  { label: "Mode sandbox", description: "Environnement de test isolé" },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={i < 2} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIExterne;
