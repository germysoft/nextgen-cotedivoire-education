import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Activity, Download, Filter, AlertCircle, CheckCircle2, Info, AlertTriangle, Search } from "lucide-react";
import { useState } from "react";
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

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: string;
  user: string;
  action: string;
  details: string;
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const logs: LogEntry[] = [
    { id: '1', timestamp: '2025-11-29 15:45:23', level: 'success', category: 'Authentification', user: 'admin@ecole.ma', action: 'Connexion', details: 'Connexion réussie depuis 192.168.1.100' },
    { id: '2', timestamp: '2025-11-29 15:42:10', level: 'info', category: 'Scolarité', user: 'secretaire@ecole.ma', action: 'Inscription', details: 'Nouvel élève inscrit: Ahmed Benali' },
    { id: '3', timestamp: '2025-11-29 15:38:45', level: 'warning', category: 'Finance', user: 'comptable@ecole.ma', action: 'Paiement', details: 'Tentative de paiement échouée pour facture #12345' },
    { id: '4', timestamp: '2025-11-29 15:30:12', level: 'error', category: 'Système', user: 'system', action: 'Sauvegarde', details: 'Erreur lors de la sauvegarde automatique: disk space' },
    { id: '5', timestamp: '2025-11-29 15:25:30', level: 'success', category: 'Notes', user: 'enseignant@ecole.ma', action: 'Saisie', details: 'Notes saisies pour classe 6ème A - Mathématiques' },
    { id: '6', timestamp: '2025-11-29 15:20:15', level: 'info', category: 'Export', user: 'admin@ecole.ma', action: 'Export', details: 'Export PDF des bulletins trimestriels' },
    { id: '7', timestamp: '2025-11-29 15:15:40', level: 'warning', category: 'RH', user: 'rh@ecole.ma', action: 'Pointage', details: 'Pointage manquant pour 3 employés' },
    { id: '8', timestamp: '2025-11-29 15:10:05', level: 'success', category: 'Messagerie', user: 'directeur@ecole.ma', action: 'SMS', details: 'Envoi SMS groupé: 250 parents contactés' },
    { id: '9', timestamp: '2025-11-29 15:05:22', level: 'info', category: 'Bibliothèque', user: 'biblio@ecole.ma', action: 'Emprunt', details: 'Livre emprunté: "Le Petit Prince" par élève #1234' },
    { id: '10', timestamp: '2025-11-29 15:00:00', level: 'success', category: 'Système', user: 'system', action: 'Sauvegarde', details: 'Sauvegarde automatique quotidienne réussie (2.4 GB)' },
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = Array.from(new Set(logs.map(log => log.category)));
  const statsPerLevel = {
    success: logs.filter(l => l.level === 'success').length,
    info: logs.filter(l => l.level === 'info').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs Système</h1>
          <p className="text-muted-foreground mt-2">
            Historique des actions et événements du système
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exporter les Logs
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Succès</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{statsPerLevel.success}</div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Actions réussies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{statsPerLevel.info}</div>
              <Info className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Événements informatifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{statsPerLevel.warning}</div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avertissements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{statsPerLevel.error}</div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Erreurs système
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des Logs</CardTitle>
              <CardDescription>
                {filteredLogs.length} événement(s) affiché(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="success">Succès</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Erreur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Horodatage</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getLevelBadge(log.level) as any}>
                      {getLevelIcon(log.level)}
                      <span className="ml-1 capitalize">{log.level}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{log.user}</TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
