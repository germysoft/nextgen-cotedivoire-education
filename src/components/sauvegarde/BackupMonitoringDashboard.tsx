import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  HardDrive, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Database,
  Cpu,
  MemoryStick,
  Wifi,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  icon: React.ReactNode;
}

interface BackupStatus {
  id: string;
  name: string;
  status: "running" | "completed" | "failed" | "scheduled";
  progress?: number;
  startTime?: string;
  endTime?: string;
  size?: string;
}

export function BackupMonitoringDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: "Espace disque",
      value: 45.2,
      max: 100,
      unit: "Go",
      status: "healthy",
      icon: <HardDrive className="h-4 w-4" />
    },
    {
      name: "CPU",
      value: 23,
      max: 100,
      unit: "%",
      status: "healthy",
      icon: <Cpu className="h-4 w-4" />
    },
    {
      name: "Mémoire",
      value: 4.2,
      max: 8,
      unit: "Go",
      status: "warning",
      icon: <MemoryStick className="h-4 w-4" />
    },
    {
      name: "Connexion BD",
      value: 15,
      max: 100,
      unit: "ms",
      status: "healthy",
      icon: <Database className="h-4 w-4" />
    }
  ]);

  const [backupStatuses, setBackupStatuses] = useState<BackupStatus[]>([
    {
      id: "1",
      name: "Sauvegarde complète",
      status: "completed",
      startTime: "2024-01-15 02:00",
      endTime: "2024-01-15 02:45",
      size: "2.3 Go"
    },
    {
      id: "2",
      name: "Sauvegarde incrémentielle",
      status: "running",
      progress: 67,
      startTime: "2024-01-15 14:00"
    },
    {
      id: "3",
      name: "Sauvegarde médias",
      status: "scheduled",
      startTime: "2024-01-15 22:00"
    }
  ]);

  const [connectionStatus, setConnectionStatus] = useState({
    database: true,
    storage: true,
    email: true
  });

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 5;
        const newValue = Math.max(0, Math.min(metric.max, metric.value + variation));
        let status: "healthy" | "warning" | "critical" = "healthy";
        
        const percentage = (newValue / metric.max) * 100;
        if (percentage > 90) status = "critical";
        else if (percentage > 75) status = "warning";
        
        return { ...metric, value: Math.round(newValue * 10) / 10, status };
      }));

      // Simuler la progression de la sauvegarde en cours
      setBackupStatuses(prev => prev.map(backup => {
        if (backup.status === "running" && backup.progress !== undefined) {
          const newProgress = Math.min(100, backup.progress + Math.random() * 2);
          if (newProgress >= 100) {
            return {
              ...backup,
              status: "completed",
              progress: 100,
              endTime: new Date().toLocaleString("fr-FR")
            };
          }
          return { ...backup, progress: Math.round(newProgress) };
        }
        return backup;
      }));

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  const getStatusIcon = (status: BackupStatus["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "running":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: BackupStatus["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Terminé</Badge>;
      case "running":
        return <Badge variant="default" className="bg-blue-500">En cours</Badge>;
      case "failed":
        return <Badge variant="destructive">Échoué</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Planifié</Badge>;
    }
  };

  const getMetricColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Monitoring en temps réel</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString("fr-FR")}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getMetricColor(metric.status)} text-white border-0`}
                >
                  {metric.status === "healthy" ? "OK" : metric.status === "warning" ? "Attention" : "Critique"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.value} {metric.unit}</span>
                  <span className="text-muted-foreground">/ {metric.max} {metric.unit}</span>
                </div>
                <Progress 
                  value={(metric.value / metric.max) * 100} 
                  className={`h-2 ${metric.status === "critical" ? "[&>div]:bg-red-500" : metric.status === "warning" ? "[&>div]:bg-yellow-500" : ""}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            État des connexions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${connectionStatus.database ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">Base de données</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${connectionStatus.storage ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">Stockage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${connectionStatus.email ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">Service email</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            État des sauvegardes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupStatuses.map((backup) => (
              <div 
                key={backup.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(backup.status)}
                  <div>
                    <p className="font-medium">{backup.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {backup.startTime && `Début: ${backup.startTime}`}
                      {backup.endTime && ` • Fin: ${backup.endTime}`}
                      {backup.size && ` • Taille: ${backup.size}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {backup.status === "running" && backup.progress !== undefined && (
                    <div className="w-32">
                      <Progress value={backup.progress} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground mt-1">
                        {backup.progress}%
                      </p>
                    </div>
                  )}
                  {getStatusBadge(backup.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Avertissement: Utilisation mémoire élevée
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                L'utilisation de la mémoire dépasse 50%. Considérez une optimisation ou une extension des ressources.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
