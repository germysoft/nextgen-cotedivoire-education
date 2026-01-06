import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Link2, Settings, CheckCircle, XCircle, AlertTriangle, RefreshCw,
  CreditCard, MessageSquare, Cloud, Database, Shield, Activity,
  Plus, Trash2, Copy, Eye, EyeOff, ExternalLink, Code
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Integration {
  id: string;
  nom: string;
  description: string;
  type: string;
  statut: "Connecté" | "Déconnecté" | "Erreur";
  dernierSync: string;
  icon: any;
}

interface ApiKey {
  id: string;
  nom: string;
  cle: string;
  createdAt: string;
  lastUsed: string;
  permissions: string[];
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  statut: "Actif" | "Inactif";
  dernierAppel: string;
}

const integrationsDisponibles: Integration[] = [
  { id: "1", nom: "Orange Money", description: "Paiement mobile via Orange Money", type: "Paiement", statut: "Connecté", dernierSync: "Il y a 5 min", icon: CreditCard },
  { id: "2", nom: "MTN MoMo", description: "Paiement mobile via MTN Mobile Money", type: "Paiement", statut: "Connecté", dernierSync: "Il y a 10 min", icon: CreditCard },
  { id: "3", nom: "Moov Money", description: "Paiement mobile via Moov Money", type: "Paiement", statut: "Déconnecté", dernierSync: "Jamais", icon: CreditCard },
  { id: "4", nom: "SMS Pro", description: "Envoi de SMS en masse", type: "Communication", statut: "Connecté", dernierSync: "Il y a 2 min", icon: MessageSquare },
  { id: "5", nom: "MENA Connect", description: "Synchronisation avec le MENA", type: "Gouvernement", statut: "Connecté", dernierSync: "Il y a 1 heure", icon: Cloud },
  { id: "6", nom: "Google Workspace", description: "Suite bureautique Google", type: "Productivité", statut: "Erreur", dernierSync: "Il y a 3 jours", icon: Cloud },
  { id: "7", nom: "Microsoft 365", description: "Suite bureautique Microsoft", type: "Productivité", statut: "Déconnecté", dernierSync: "Jamais", icon: Cloud },
];

const apiKeys: ApiKey[] = [
  { id: "1", nom: "API Mobile App", cle: "sk_live_abc123...xyz789", createdAt: "01/12/2024", lastUsed: "Aujourd'hui", permissions: ["read:students", "read:grades"] },
  { id: "2", nom: "API Portail Parents", cle: "sk_live_def456...uvw123", createdAt: "15/11/2024", lastUsed: "Hier", permissions: ["read:students", "read:grades", "read:absences"] },
  { id: "3", nom: "API Comptabilité", cle: "sk_live_ghi789...rst456", createdAt: "01/10/2024", lastUsed: "Il y a 3 jours", permissions: ["read:finance", "write:payments"] },
];

const webhooks: Webhook[] = [
  { id: "1", url: "https://api.example.com/webhooks/payments", events: ["payment.created", "payment.failed"], statut: "Actif", dernierAppel: "Il y a 5 min" },
  { id: "2", url: "https://api.sms-provider.com/notify", events: ["student.absent", "grade.published"], statut: "Actif", dernierAppel: "Il y a 1 heure" },
  { id: "3", url: "https://mena.gov.ci/api/sync", events: ["student.created", "student.updated"], statut: "Inactif", dernierAppel: "Il y a 1 semaine" },
];

const logsRecents = [
  { id: 1, timestamp: "2024-12-15 14:32:05", type: "success", message: "Payment webhook delivered successfully", endpoint: "/webhooks/payments" },
  { id: 2, timestamp: "2024-12-15 14:30:12", type: "info", message: "API key sk_live_abc123 used for GET /api/students", endpoint: "/api/students" },
  { id: 3, timestamp: "2024-12-15 14:28:45", type: "warning", message: "Rate limit approaching for API key sk_live_def456", endpoint: "/api/grades" },
  { id: 4, timestamp: "2024-12-15 14:25:00", type: "error", message: "Webhook delivery failed: timeout", endpoint: "/webhooks/sync" },
  { id: 5, timestamp: "2024-12-15 14:20:30", type: "success", message: "MENA sync completed: 45 records updated", endpoint: "/api/mena/sync" },
];

export default function IntegrationsAPI() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Connecté": 
      case "Actif":
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />{statut}</Badge>;
      case "Déconnecté":
      case "Inactif":
        return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />{statut}</Badge>;
      case "Erreur":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />{statut}</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  const handleConnect = (integration: Integration) => {
    toast({ title: "Connexion en cours", description: `Configuration de ${integration.nom}...` });
  };

  const handleSync = (integration: Integration) => {
    toast({ title: "Synchronisation", description: `Synchronisation avec ${integration.nom} en cours...` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié", description: "Clé API copiée dans le presse-papier" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intégrations & API</h1>
          <p className="text-muted-foreground">Gérez les connexions externes et les clés API</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Intégration
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intégrations</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationsDisponibles.filter(i => i.statut === "Connecté").length}/{integrationsDisponibles.length}</div>
            <p className="text-xs text-muted-foreground">Actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clés API</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">Générées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.filter(w => w.statut === "Actif").length}</div>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requêtes 24h</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">API calls</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="api-keys">Clés API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrationsDisponibles.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <integration.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.nom}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">{integration.type}</Badge>
                      </div>
                    </div>
                    {getStatutBadge(integration.statut)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Dernière sync: {integration.dernierSync}</span>
                    <div className="flex gap-2">
                      {integration.statut === "Connecté" ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleSync(integration)}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => handleConnect(integration)}>
                          Connecter
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Clés API</CardTitle>
                  <CardDescription>Gérez les clés d'accès à l'API</CardDescription>
                </div>
                <Dialog open={isAddKeyOpen} onOpenChange={setIsAddKeyOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Clé
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer une nouvelle clé API</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nom de la clé</Label>
                        <Input placeholder="Ex: API Mobile App" />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["read:students", "write:students", "read:grades", "write:grades", "read:finance", "write:payments"].map(perm => (
                            <div key={perm} className="flex items-center gap-2">
                              <Switch id={perm} />
                              <Label htmlFor={perm} className="text-sm">{perm}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => {
                        toast({ title: "Clé créée", description: "Nouvelle clé API générée avec succès" });
                        setIsAddKeyOpen(false);
                      }}>
                        Générer la clé
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Clé</TableHead>
                    <TableHead>Créée le</TableHead>
                    <TableHead>Dernière utilisation</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.nom}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {showKey === key.id ? key.cle : "sk_live_•••••••••••••"}
                          </code>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setShowKey(showKey === key.id ? null : key.id)}>
                            {showKey === key.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(key.cle)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{key.createdAt}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.slice(0, 2).map(p => (
                            <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                          ))}
                          {key.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{key.permissions.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>Configurez les notifications en temps réel</CardDescription>
                </div>
                <Dialog open={isAddWebhookOpen} onOpenChange={setIsAddWebhookOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configurer un webhook</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>URL de destination</Label>
                        <Input placeholder="https://api.example.com/webhook" />
                      </div>
                      <div className="space-y-2">
                        <Label>Événements à écouter</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["payment.created", "payment.failed", "student.created", "student.absent", "grade.published"].map(event => (
                            <div key={event} className="flex items-center gap-2">
                              <Switch id={event} />
                              <Label htmlFor={event} className="text-sm">{event}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => {
                        toast({ title: "Webhook créé", description: "Le webhook a été configuré avec succès" });
                        setIsAddWebhookOpen(false);
                      }}>
                        Créer le webhook
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Événements</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernier appel</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-mono text-sm max-w-xs truncate">{webhook.url}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map(e => (
                            <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(webhook.statut)}</TableCell>
                      <TableCell>{webhook.dernierAppel}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                            <Trash2 className="h-4 w-4" />
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Logs API
                </CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rafraîchir
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {logsRecents.map((log) => (
                  <div 
                    key={log.id} 
                    className={`p-3 rounded-lg flex items-start gap-3 ${
                      log.type === 'error' ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' :
                      log.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300' :
                      log.type === 'success' ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' :
                      'bg-muted'
                    }`}
                  >
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                    <Badge variant="outline" className="text-xs uppercase">{log.type}</Badge>
                    <span className="flex-1">{log.message}</span>
                    <code className="text-xs bg-background/50 px-2 py-0.5 rounded">{log.endpoint}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
