import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Lock, Key, Smartphone, Globe, AlertTriangle, 
  CheckCircle2, XCircle, Eye, EyeOff, RefreshCw, Plus, Trash2,
  ShieldCheck, ShieldAlert, Clock, Users, Fingerprint, Wifi
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface SecuritySession {
  id: string;
  user: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface IPRule {
  id: string;
  ip: string;
  type: 'whitelist' | 'blacklist';
  description: string;
  addedBy: string;
  addedAt: string;
}

interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export default function SecuritePage() {
  const { toast } = useToast();
  const [isAddIPDialogOpen, setIsAddIPDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  
  // Password Policy Settings
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    expiryDays: 90,
    lockoutAttempts: 5,
    lockoutDuration: 30,
  });

  // 2FA Settings
  const [twoFactorSettings, setTwoFactorSettings] = useState({
    enabled: true,
    enforceForAdmins: true,
    enforceForAll: false,
    methods: {
      sms: true,
      email: true,
      authenticator: true,
      biometric: false,
    },
  });

  // Session Settings
  const [sessionSettings, setSessionSettings] = useState({
    timeout: 30,
    extendOnActivity: true,
    singleSession: false,
    rememberDevice: true,
    maxDevices: 3,
  });

  const [activeSessions] = useState<SecuritySession[]>([
    { id: '1', user: 'admin@ecole.ma', device: 'Chrome - Windows 10', ip: '192.168.1.100', location: 'Abidjan, CI', lastActive: 'Maintenant', isCurrent: true },
    { id: '2', user: 'admin@ecole.ma', device: 'Safari - iPhone', ip: '192.168.1.105', location: 'Abidjan, CI', lastActive: 'Il y a 5 min', isCurrent: false },
    { id: '3', user: 'directeur@ecole.ma', device: 'Firefox - macOS', ip: '192.168.1.110', location: 'Yamoussoukro, CI', lastActive: 'Il y a 15 min', isCurrent: false },
  ]);

  const [ipRules, setIpRules] = useState<IPRule[]>([
    { id: '1', ip: '192.168.1.0/24', type: 'whitelist', description: 'Réseau interne école', addedBy: 'admin', addedAt: '2024-01-15' },
    { id: '2', ip: '10.0.0.0/8', type: 'whitelist', description: 'VPN établissement', addedBy: 'admin', addedAt: '2024-02-10' },
    { id: '3', ip: '45.33.32.156', type: 'blacklist', description: 'IP suspecte détectée', addedBy: 'system', addedAt: '2025-11-20' },
  ]);

  const [securityAlerts] = useState<SecurityAlert[]>([
    { id: '1', type: 'warning', title: 'Tentatives de connexion multiples', description: '5 tentatives échouées pour user1@ecole.ma depuis 192.168.1.50', timestamp: '2025-11-29 14:30', resolved: false },
    { id: '2', type: 'info', title: 'Nouvelle connexion depuis un nouvel appareil', description: 'directeur@ecole.ma connecté depuis iPhone', timestamp: '2025-11-29 12:15', resolved: true },
    { id: '3', type: 'critical', title: 'Certificat SSL expire bientôt', description: 'Le certificat SSL expire dans 15 jours', timestamp: '2025-11-28 09:00', resolved: false },
  ]);

  const [newIPRule, setNewIPRule] = useState({ ip: '', type: 'whitelist' as 'whitelist' | 'blacklist', description: '' });

  const securityScore = 85;

  const handleSavePasswordPolicy = () => {
    toast({
      title: "Politique de mot de passe mise à jour",
      description: "Les nouvelles règles seront appliquées aux prochaines créations/modifications de mots de passe.",
    });
  };

  const handleSave2FASettings = () => {
    toast({
      title: "Paramètres 2FA sauvegardés",
      description: "Les paramètres d'authentification à deux facteurs ont été mis à jour.",
    });
  };

  const handleSaveSessionSettings = () => {
    toast({
      title: "Paramètres de session mis à jour",
      description: "Les nouvelles règles de session sont en vigueur.",
    });
  };

  const handleTerminateSession = (sessionId: string) => {
    toast({
      title: "Session terminée",
      description: "La session a été déconnectée avec succès.",
    });
  };

  const handleTerminateAllSessions = () => {
    toast({
      title: "Toutes les sessions terminées",
      description: "Toutes les sessions sauf la session courante ont été déconnectées.",
    });
  };

  const handleAddIPRule = () => {
    if (!newIPRule.ip || !newIPRule.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    setIpRules([...ipRules, {
      id: String(ipRules.length + 1),
      ...newIPRule,
      addedBy: 'admin',
      addedAt: new Date().toISOString().split('T')[0],
    }]);
    setNewIPRule({ ip: '', type: 'whitelist', description: '' });
    setIsAddIPDialogOpen(false);
    toast({
      title: "Règle IP ajoutée",
      description: `L'adresse ${newIPRule.ip} a été ajoutée à la ${newIPRule.type === 'whitelist' ? 'liste blanche' : 'liste noire'}.`,
    });
  };

  const handleDeleteIPRule = (ruleId: string) => {
    setIpRules(ipRules.filter(r => r.id !== ruleId));
    toast({
      title: "Règle supprimée",
      description: "La règle IP a été supprimée.",
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sécurité Avancée</h1>
          <p className="text-muted-foreground mt-2">
            Configuration des politiques de sécurité et surveillance du système
          </p>
        </div>
        <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "secondary" : "destructive"} className="text-lg px-4 py-2">
          <Shield className="mr-2 h-5 w-5" />
          Score: {securityScore}/100
        </Badge>
      </div>

      {/* Security Score Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Score de Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">{securityScore}%</div>
              <Progress value={securityScore} className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Bon niveau de sécurité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sessions Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeSessions.length}</div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">utilisateurs connectés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Alertes Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{securityAlerts.filter(a => !a.resolved).length}</div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">à traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">2FA Activé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">78%</div>
              <Fingerprint className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">des utilisateurs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="password">Mots de Passe</TabsTrigger>
          <TabsTrigger value="2fa">Authentification 2FA</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="ip">Règles IP</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Politique de Mot de Passe
              </CardTitle>
              <CardDescription>
                Configurez les exigences pour les mots de passe utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Longueur minimale: {passwordSettings.minLength} caractères</Label>
                    <Slider
                      value={[passwordSettings.minLength]}
                      onValueChange={(value) => setPasswordSettings({ ...passwordSettings, minLength: value[0] })}
                      min={8}
                      max={24}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase">Exiger des majuscules (A-Z)</Label>
                    <Switch
                      id="uppercase"
                      checked={passwordSettings.requireUppercase}
                      onCheckedChange={(checked) => setPasswordSettings({ ...passwordSettings, requireUppercase: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="lowercase">Exiger des minuscules (a-z)</Label>
                    <Switch
                      id="lowercase"
                      checked={passwordSettings.requireLowercase}
                      onCheckedChange={(checked) => setPasswordSettings({ ...passwordSettings, requireLowercase: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="numbers">Exiger des chiffres (0-9)</Label>
                    <Switch
                      id="numbers"
                      checked={passwordSettings.requireNumbers}
                      onCheckedChange={(checked) => setPasswordSettings({ ...passwordSettings, requireNumbers: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="special">Exiger des caractères spéciaux (!@#$...)</Label>
                    <Switch
                      id="special"
                      checked={passwordSettings.requireSpecialChars}
                      onCheckedChange={(checked) => setPasswordSettings({ ...passwordSettings, requireSpecialChars: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Historique des mots de passe (empêcher réutilisation)</Label>
                    <Select 
                      value={String(passwordSettings.preventReuse)}
                      onValueChange={(value) => setPasswordSettings({ ...passwordSettings, preventReuse: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Désactivé</SelectItem>
                        <SelectItem value="3">3 derniers mots de passe</SelectItem>
                        <SelectItem value="5">5 derniers mots de passe</SelectItem>
                        <SelectItem value="10">10 derniers mots de passe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Expiration du mot de passe (jours)</Label>
                    <Select 
                      value={String(passwordSettings.expiryDays)}
                      onValueChange={(value) => setPasswordSettings({ ...passwordSettings, expiryDays: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Jamais</SelectItem>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="60">60 jours</SelectItem>
                        <SelectItem value="90">90 jours</SelectItem>
                        <SelectItem value="180">180 jours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Verrouillage après tentatives échouées</Label>
                    <Select 
                      value={String(passwordSettings.lockoutAttempts)}
                      onValueChange={(value) => setPasswordSettings({ ...passwordSettings, lockoutAttempts: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 tentatives</SelectItem>
                        <SelectItem value="5">5 tentatives</SelectItem>
                        <SelectItem value="10">10 tentatives</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Durée du verrouillage (minutes)</Label>
                    <Select 
                      value={String(passwordSettings.lockoutDuration)}
                      onValueChange={(value) => setPasswordSettings({ ...passwordSettings, lockoutDuration: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePasswordPolicy}>
                Sauvegarder la Politique
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2fa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Authentification à Deux Facteurs (2FA)
              </CardTitle>
              <CardDescription>
                Configurez les méthodes d'authentification renforcée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Activer 2FA globalement</Label>
                  <p className="text-sm text-muted-foreground">
                    Permet aux utilisateurs d'activer 2FA sur leur compte
                  </p>
                </div>
                <Switch
                  checked={twoFactorSettings.enabled}
                  onCheckedChange={(checked) => setTwoFactorSettings({ ...twoFactorSettings, enabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Obligatoire pour les administrateurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Les admins et directeurs doivent activer 2FA
                  </p>
                </div>
                <Switch
                  checked={twoFactorSettings.enforceForAdmins}
                  onCheckedChange={(checked) => setTwoFactorSettings({ ...twoFactorSettings, enforceForAdmins: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Obligatoire pour tous les utilisateurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Tous les utilisateurs doivent activer 2FA
                  </p>
                </div>
                <Switch
                  checked={twoFactorSettings.enforceForAll}
                  onCheckedChange={(checked) => setTwoFactorSettings({ ...twoFactorSettings, enforceForAll: checked })}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base">Méthodes disponibles</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-muted-foreground">Code par SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorSettings.methods.sms}
                      onCheckedChange={(checked) => setTwoFactorSettings({ 
                        ...twoFactorSettings, 
                        methods: { ...twoFactorSettings.methods, sms: checked } 
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">Code par email</p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorSettings.methods.email}
                      onCheckedChange={(checked) => setTwoFactorSettings({ 
                        ...twoFactorSettings, 
                        methods: { ...twoFactorSettings.methods, email: checked } 
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">Google/Microsoft Auth</p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorSettings.methods.authenticator}
                      onCheckedChange={(checked) => setTwoFactorSettings({ 
                        ...twoFactorSettings, 
                        methods: { ...twoFactorSettings.methods, authenticator: checked } 
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Biométrie</p>
                        <p className="text-sm text-muted-foreground">Empreinte/Face ID</p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorSettings.methods.biometric}
                      onCheckedChange={(checked) => setTwoFactorSettings({ 
                        ...twoFactorSettings, 
                        methods: { ...twoFactorSettings.methods, biometric: checked } 
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave2FASettings}>
                Sauvegarder les Paramètres 2FA
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Gestion des Sessions
              </CardTitle>
              <CardDescription>
                Configurez les règles de session et gérez les connexions actives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Timeout de session (minutes)</Label>
                  <Select 
                    value={String(sessionSettings.timeout)}
                    onValueChange={(value) => setSessionSettings({ ...sessionSettings, timeout: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="480">8 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nombre max d'appareils</Label>
                  <Select 
                    value={String(sessionSettings.maxDevices)}
                    onValueChange={(value) => setSessionSettings({ ...sessionSettings, maxDevices: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 appareil</SelectItem>
                      <SelectItem value="3">3 appareils</SelectItem>
                      <SelectItem value="5">5 appareils</SelectItem>
                      <SelectItem value="10">10 appareils</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Prolonger à chaque activité</Label>
                    <p className="text-sm text-muted-foreground">
                      Réinitialise le timeout lors d'une activité utilisateur
                    </p>
                  </div>
                  <Switch
                    checked={sessionSettings.extendOnActivity}
                    onCheckedChange={(checked) => setSessionSettings({ ...sessionSettings, extendOnActivity: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Session unique</Label>
                    <p className="text-sm text-muted-foreground">
                      Une seule session active par utilisateur
                    </p>
                  </div>
                  <Switch
                    checked={sessionSettings.singleSession}
                    onCheckedChange={(checked) => setSessionSettings({ ...sessionSettings, singleSession: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Mémoriser l'appareil</Label>
                    <p className="text-sm text-muted-foreground">
                      Permet aux utilisateurs de mémoriser leurs appareils
                    </p>
                  </div>
                  <Switch
                    checked={sessionSettings.rememberDevice}
                    onCheckedChange={(checked) => setSessionSettings({ ...sessionSettings, rememberDevice: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSessionSettings}>
                Sauvegarder les Paramètres de Session
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sessions Actives</CardTitle>
                  <CardDescription>
                    {activeSessions.length} session(s) actuellement active(s)
                  </CardDescription>
                </div>
                <Button variant="destructive" size="sm" onClick={handleTerminateAllSessions}>
                  Terminer toutes les sessions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Appareil</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.user}
                        {session.isCurrent && (
                          <Badge variant="outline" className="ml-2">Courante</Badge>
                        )}
                      </TableCell>
                      <TableCell>{session.device}</TableCell>
                      <TableCell className="font-mono text-sm">{session.ip}</TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>{session.lastActive}</TableCell>
                      <TableCell className="text-right">
                        {!session.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTerminateSession(session.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Terminer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ip" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Règles d'Accès IP
                  </CardTitle>
                  <CardDescription>
                    Gérez les listes blanches et noires d'adresses IP
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddIPDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une Règle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adresse IP / CIDR</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Ajouté par</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ipRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-mono">{rule.ip}</TableCell>
                      <TableCell>
                        <Badge variant={rule.type === 'whitelist' ? 'default' : 'destructive'}>
                          {rule.type === 'whitelist' ? (
                            <><CheckCircle2 className="mr-1 h-3 w-3" /> Liste blanche</>
                          ) : (
                            <><XCircle className="mr-1 h-3 w-3" /> Liste noire</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{rule.description}</TableCell>
                      <TableCell>{rule.addedBy}</TableCell>
                      <TableCell>{rule.addedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteIPRule(rule.id)}
                        >
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

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Alertes de Sécurité
              </CardTitle>
              <CardDescription>
                Surveillance des événements de sécurité du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <Alert 
                    key={alert.id} 
                    className={
                      alert.type === 'critical' 
                        ? 'border-red-200 bg-red-50 dark:bg-red-950' 
                        : alert.type === 'warning'
                        ? 'border-amber-200 bg-amber-50 dark:bg-amber-950'
                        : ''
                    }
                  >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center justify-between">
                        {alert.title}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-normal text-muted-foreground">
                            {alert.timestamp}
                          </span>
                          {alert.resolved ? (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Résolu
                            </Badge>
                          ) : (
                            <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                              En cours
                            </Badge>
                          )}
                        </div>
                      </AlertTitle>
                      <AlertDescription>{alert.description}</AlertDescription>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add IP Rule Dialog */}
      <Dialog open={isAddIPDialogOpen} onOpenChange={setIsAddIPDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une Règle IP</DialogTitle>
            <DialogDescription>
              Ajoutez une adresse IP à la liste blanche ou noire
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ip">Adresse IP ou CIDR</Label>
              <Input
                id="ip"
                placeholder="192.168.1.0/24 ou 10.0.0.1"
                value={newIPRule.ip}
                onChange={(e) => setNewIPRule({ ...newIPRule, ip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type de règle</Label>
              <Select 
                value={newIPRule.type}
                onValueChange={(value: 'whitelist' | 'blacklist') => setNewIPRule({ ...newIPRule, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whitelist">Liste blanche (autorisé)</SelectItem>
                  <SelectItem value="blacklist">Liste noire (bloqué)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Réseau interne, VPN, etc."
                value={newIPRule.description}
                onChange={(e) => setNewIPRule({ ...newIPRule, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIPDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddIPRule}>
              Ajouter la Règle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
