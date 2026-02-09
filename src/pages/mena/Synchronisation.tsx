import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  RefreshCw, CheckCircle2, XCircle, AlertTriangle, Clock, Database,
  Upload, Download, Cloud, Link2, Shield, History, Settings, Play,
  Pause, FileText, Users, School, BookOpen, Calendar, Wifi, WifiOff,
  ArrowUpDown, Loader2, Check, X, AlertCircle, Info
} from "lucide-react";

interface SyncEntity {
  id: string;
  name: string;
  type: "eleves" | "enseignants" | "classes" | "notes" | "absences" | "examens";
  localCount: number;
  remoteCount: number;
  lastSync: string;
  status: "synced" | "pending" | "error" | "syncing";
  autoSync: boolean;
  direction: "upload" | "download" | "bidirectional";
}

interface SyncLog {
  id: string;
  timestamp: string;
  entity: string;
  action: string;
  status: "success" | "error" | "warning";
  details: string;
  recordsAffected: number;
}

const mockSyncEntities: SyncEntity[] = [
  { id: "1", name: "Élèves", type: "eleves", localCount: 1245, remoteCount: 1245, lastSync: "2024-01-15 14:30", status: "synced", autoSync: true, direction: "bidirectional" },
  { id: "2", name: "Enseignants", type: "enseignants", localCount: 78, remoteCount: 78, lastSync: "2024-01-15 14:30", status: "synced", autoSync: true, direction: "bidirectional" },
  { id: "3", name: "Classes", type: "classes", localCount: 32, remoteCount: 32, lastSync: "2024-01-15 14:30", status: "synced", autoSync: true, direction: "download" },
  { id: "4", name: "Notes", type: "notes", localCount: 15680, remoteCount: 15420, lastSync: "2024-01-15 10:00", status: "pending", autoSync: false, direction: "upload" },
  { id: "5", name: "Absences", type: "absences", localCount: 2340, remoteCount: 2100, lastSync: "2024-01-14 18:00", status: "pending", autoSync: true, direction: "upload" },
  { id: "6", name: "Examens", type: "examens", localCount: 45, remoteCount: 45, lastSync: "2024-01-15 08:00", status: "synced", autoSync: false, direction: "bidirectional" },
];

const mockSyncLogs: SyncLog[] = [
  { id: "1", timestamp: "2024-01-15 14:30:45", entity: "Élèves", action: "Synchronisation bidirectionnelle", status: "success", details: "Mise à jour de 12 enregistrements", recordsAffected: 12 },
  { id: "2", timestamp: "2024-01-15 14:30:30", entity: "Enseignants", action: "Synchronisation bidirectionnelle", status: "success", details: "Aucun changement détecté", recordsAffected: 0 },
  { id: "3", timestamp: "2024-01-15 14:30:15", entity: "Classes", action: "Téléchargement", status: "success", details: "Structure mise à jour depuis MENA", recordsAffected: 2 },
  { id: "4", timestamp: "2024-01-15 10:00:00", entity: "Notes", action: "Envoi", status: "warning", details: "260 notes en attente d'envoi", recordsAffected: 0 },
  { id: "5", timestamp: "2024-01-14 18:00:00", entity: "Absences", action: "Envoi", status: "error", details: "Erreur de connexion au serveur MENA", recordsAffected: 0 },
  { id: "6", timestamp: "2024-01-14 16:30:00", entity: "Élèves", action: "Synchronisation bidirectionnelle", status: "success", details: "5 nouveaux élèves importés", recordsAffected: 5 },
];

export default function Synchronisation() {
  const [entities, setEntities] = useState<SyncEntity[]>(mockSyncEntities);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [currentSyncEntity, setCurrentSyncEntity] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("connected");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState("60");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending": return <Clock className="h-5 w-5 text-orange-500" />;
      case "error": return <XCircle className="h-5 w-5 text-red-500" />;
      case "syncing": return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      synced: { variant: "default", label: "Synchronisé" },
      pending: { variant: "outline", label: "En attente" },
      error: { variant: "destructive", label: "Erreur" },
      syncing: { variant: "secondary", label: "En cours..." }
    };
    const style = styles[status] || styles.pending;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "upload": return <Upload className="h-4 w-4 text-blue-500" />;
      case "download": return <Download className="h-4 w-4 text-green-500" />;
      default: return <ArrowUpDown className="h-4 w-4 text-purple-500" />;
    }
  };

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <Check className="h-4 w-4 text-green-500" />;
      case "error": return <X className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const syncEntity = async (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;

    setEntities(entities.map(e => 
      e.id === entityId ? { ...e, status: "syncing" } : e
    ));

    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));

    setEntities(entities.map(e => 
      e.id === entityId ? { 
        ...e, 
        status: "synced", 
        lastSync: new Date().toISOString().slice(0, 16).replace("T", " "),
        remoteCount: e.localCount 
      } : e
    ));

    toast.success(`${entity.name} synchronisé avec succès`);
  };

  const syncAll = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      setCurrentSyncEntity(entity.name);
      setSyncProgress(((i + 1) / entities.length) * 100);
      
      setEntities(prev => prev.map(e => 
        e.id === entity.id ? { ...e, status: "syncing" } : e
      ));

      await new Promise(resolve => setTimeout(resolve, 1500));

      setEntities(prev => prev.map(e => 
        e.id === entity.id ? { 
          ...e, 
          status: "synced", 
          lastSync: new Date().toISOString().slice(0, 16).replace("T", " "),
          remoteCount: e.localCount 
        } : e
      ));
    }

    setIsSyncing(false);
    setCurrentSyncEntity("");
    toast.success("Synchronisation complète terminée");
  };

  const toggleAutoSync = (entityId: string) => {
    setEntities(entities.map(e => 
      e.id === entityId ? { ...e, autoSync: !e.autoSync } : e
    ));
  };

  const checkConnection = async () => {
    setConnectionStatus("checking");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectionStatus("connected");
    toast.success("Connexion au serveur MENA établie");
  };

  const stats = {
    totalRecords: entities.reduce((sum, e) => sum + e.localCount, 0),
    pendingSync: entities.filter(e => e.status === "pending").length,
    syncedToday: entities.filter(e => e.lastSync.startsWith("2024-01-15")).length,
    errors: entities.filter(e => e.status === "error").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Synchronisation MENA</h1>
          <p className="text-muted-foreground">Synchronisation des données avec le système national</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            connectionStatus === "connected" ? "bg-green-100" : 
            connectionStatus === "checking" ? "bg-yellow-100" : "bg-red-100"
          }`}>
            {connectionStatus === "connected" ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : connectionStatus === "checking" ? (
              <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              connectionStatus === "connected" ? "text-green-700" : 
              connectionStatus === "checking" ? "text-yellow-700" : "text-red-700"
            }`}>
              {connectionStatus === "connected" ? "Connecté au MENA" : 
               connectionStatus === "checking" ? "Vérification..." : "Déconnecté"}
            </span>
          </div>
          <Button variant="outline" onClick={checkConnection}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tester connexion
          </Button>
          <Button onClick={syncAll} disabled={isSyncing}>
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Synchronisation...
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4 mr-2" />
                Tout synchroniser
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sync Progress */}
      {isSyncing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Synchronisation en cours: {currentSyncEntity}</span>
              <span className="text-sm text-muted-foreground">{Math.round(syncProgress)}%</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Enregistrements totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingSync}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.syncedToday}</p>
                <p className="text-xs text-muted-foreground">Synchronisés aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.errors}</p>
                <p className="text-xs text-muted-foreground">Erreurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entities">
        <TabsList>
          <TabsTrigger value="entities">Entités à synchroniser</TabsTrigger>
          <TabsTrigger value="logs">Journal de synchronisation</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="entities">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des synchronisations</CardTitle>
              <CardDescription>Configurez et lancez les synchronisations par entité</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entité</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Distant (MENA)</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Dernière sync</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Auto-sync</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entities.map(entity => (
                    <TableRow key={entity.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {entity.type === "eleves" && <Users className="h-5 w-5 text-blue-500" />}
                          {entity.type === "enseignants" && <Users className="h-5 w-5 text-purple-500" />}
                          {entity.type === "classes" && <School className="h-5 w-5 text-green-500" />}
                          {entity.type === "notes" && <BookOpen className="h-5 w-5 text-orange-500" />}
                          {entity.type === "absences" && <Calendar className="h-5 w-5 text-red-500" />}
                          {entity.type === "examens" && <FileText className="h-5 w-5 text-yellow-500" />}
                          <span className="font-medium">{entity.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entity.localCount.toLocaleString()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entity.remoteCount.toLocaleString()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDirectionIcon(entity.direction)}
                          <span className="text-sm capitalize">
                            {entity.direction === "upload" ? "Envoi" : 
                             entity.direction === "download" ? "Réception" : "Bidirectionnel"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {entity.lastSync}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(entity.status)}
                          {getStatusBadge(entity.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={entity.autoSync} 
                          onCheckedChange={() => toggleAutoSync(entity.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => syncEntity(entity.id)}
                          disabled={entity.status === "syncing"}
                        >
                          {entity.status === "syncing" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
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
              <CardTitle>Journal de synchronisation</CardTitle>
              <CardDescription>Historique des opérations de synchronisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSyncLogs.map(log => (
                  <div key={log.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    log.status === "success" ? "bg-green-50 border-green-200" :
                    log.status === "error" ? "bg-red-50 border-red-200" :
                    "bg-orange-50 border-orange-200"
                  }`}>
                    <div className="flex items-center gap-4">
                      {getLogStatusIcon(log.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.entity}</span>
                          <Badge variant="outline">{log.action}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{log.recordsAffected} enregistrements</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de synchronisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Synchronisation automatique globale</Label>
                  <p className="text-sm text-muted-foreground">Activer la synchronisation automatique pour toutes les entités</p>
                </div>
                <Switch checked={autoSyncEnabled} onCheckedChange={setAutoSyncEnabled} />
              </div>

              <div className="space-y-2">
                <Label>Intervalle de synchronisation</Label>
                <Select value={syncInterval} onValueChange={setSyncInterval}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">Toutes les 15 minutes</SelectItem>
                    <SelectItem value="30">Toutes les 30 minutes</SelectItem>
                    <SelectItem value="60">Toutes les heures</SelectItem>
                    <SelectItem value="360">Toutes les 6 heures</SelectItem>
                    <SelectItem value="1440">Une fois par jour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Connexion sécurisée</p>
                      <p className="text-sm text-muted-foreground">
                        Toutes les communications avec le serveur MENA sont chiffrées via TLS 1.3
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={() => toast.success("Paramètres de synchronisation enregistrés")}>Enregistrer les paramètres</Button>
                <Button variant="outline" onClick={() => { setAutoSyncEnabled(true); setSyncInterval("60"); toast.success("Paramètres réinitialisés"); }}>Réinitialiser</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
