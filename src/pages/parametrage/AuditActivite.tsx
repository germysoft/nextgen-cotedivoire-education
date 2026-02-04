import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { 
  Activity, Download, Search, Filter, Calendar, User, Database,
  FileText, Eye, Edit, Trash2, LogIn, LogOut, Settings, RefreshCw,
  Clock, TrendingUp, Users, Shield, Archive
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useArchives } from "@/contexts/ArchivesContext";
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
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  category: string;
  resource: string;
  details: string;
  ip: string;
  success: boolean;
}

interface LoginHistory {
  id: string;
  user: string;
  timestamp: string;
  action: 'login' | 'logout' | 'failed';
  ip: string;
  device: string;
  location: string;
  reason?: string;
}

interface DataAccessLog {
  id: string;
  timestamp: string;
  user: string;
  table: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  recordCount: number;
  executionTime: string;
  query?: string;
}

export default function AuditActivitePage() {
  const { toast } = useToast();
  const { journalAcces, syncWithAudit } = useArchives();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Convertir les accès archives en logs d'audit
  const archiveLogs = useMemo(() => {
    return journalAcces.map(acces => ({
      id: acces.id,
      timestamp: new Date(acces.dateAcces).toLocaleString('fr-FR'),
      user: acces.utilisateur,
      userRole: acces.role,
      action: acces.action.charAt(0).toUpperCase() + acces.action.slice(1),
      category: 'Archives',
      resource: acces.anneeScolaire,
      details: acces.details || '',
      ip: '192.168.1.100',
      success: true,
    }));
  }, [journalAcces]);

  const [activityLogs] = useState<ActivityLog[]>([
    { id: '1', timestamp: '2025-11-29 15:45:23', user: 'admin@ecole.ma', userRole: 'Admin', action: 'Modification', category: 'Utilisateurs', resource: 'User #45', details: 'Changement de rôle: enseignant → comptable', ip: '192.168.1.100', success: true },
    { id: '2', timestamp: '2025-11-29 15:42:10', user: 'secretaire@ecole.ma', userRole: 'Secrétaire', action: 'Création', category: 'Élèves', resource: 'Student #1234', details: 'Inscription nouvel élève: Ahmed Benali', ip: '192.168.1.102', success: true },
    { id: '3', timestamp: '2025-11-29 15:38:45', user: 'comptable@ecole.ma', userRole: 'Comptable', action: 'Export', category: 'Finance', resource: 'Rapport mensuel', details: 'Export PDF du rapport financier novembre 2025', ip: '192.168.1.105', success: true },
    { id: '4', timestamp: '2025-11-29 15:30:12', user: 'enseignant@ecole.ma', userRole: 'Enseignant', action: 'Modification', category: 'Notes', resource: 'Classe 6ème A', details: 'Saisie des notes de mathématiques T1', ip: '192.168.1.110', success: true },
    { id: '5', timestamp: '2025-11-29 15:25:30', user: 'directeur@ecole.ma', userRole: 'Directeur', action: 'Suppression', category: 'Documents', resource: 'Document #89', details: 'Suppression circulaire obsolète', ip: '192.168.1.115', success: true },
    { id: '6', timestamp: '2025-11-29 15:20:15', user: 'admin@ecole.ma', userRole: 'Admin', action: 'Configuration', category: 'Système', resource: 'Paramètres', details: 'Modification timeout de session: 30 → 60 min', ip: '192.168.1.100', success: true },
    { id: '7', timestamp: '2025-11-29 15:15:40', user: 'unknown@test.com', userRole: '-', action: 'Tentative accès', category: 'Sécurité', resource: 'API /admin', details: 'Tentative d\'accès non autorisé', ip: '45.33.32.156', success: false },
    { id: '8', timestamp: '2025-11-29 15:10:05', user: 'rh@ecole.ma', userRole: 'RH', action: 'Visualisation', category: 'Personnel', resource: 'Dossier #23', details: 'Consultation fiche employé: Jean Dupont', ip: '192.168.1.120', success: true },
  ]);

  const [loginHistory] = useState<LoginHistory[]>([
    { id: '1', user: 'admin@ecole.ma', timestamp: '2025-11-29 15:30:00', action: 'login', ip: '192.168.1.100', device: 'Chrome - Windows 10', location: 'Abidjan, CI' },
    { id: '2', user: 'directeur@ecole.ma', timestamp: '2025-11-29 15:15:00', action: 'login', ip: '192.168.1.115', device: 'Safari - macOS', location: 'Abidjan, CI' },
    { id: '3', user: 'unknown@test.com', timestamp: '2025-11-29 15:10:00', action: 'failed', ip: '45.33.32.156', device: 'Firefox', location: 'Lagos, NG', reason: 'Mot de passe incorrect (3ème tentative)' },
    { id: '4', user: 'enseignant@ecole.ma', timestamp: '2025-11-29 14:45:00', action: 'logout', ip: '192.168.1.110', device: 'Chrome - Windows 10', location: 'Abidjan, CI' },
    { id: '5', user: 'comptable@ecole.ma', timestamp: '2025-11-29 14:30:00', action: 'login', ip: '192.168.1.105', device: 'Edge - Windows 11', location: 'Yamoussoukro, CI' },
    { id: '6', user: 'secretaire@ecole.ma', timestamp: '2025-11-29 14:00:00', action: 'login', ip: '192.168.1.102', device: 'Chrome - Android', location: 'Abidjan, CI' },
  ]);

  const [dataAccessLogs] = useState<DataAccessLog[]>([
    { id: '1', timestamp: '2025-11-29 15:45:00', user: 'admin@ecole.ma', table: 'users', operation: 'UPDATE', recordCount: 1, executionTime: '45ms' },
    { id: '2', timestamp: '2025-11-29 15:42:00', user: 'secretaire@ecole.ma', table: 'students', operation: 'INSERT', recordCount: 1, executionTime: '120ms' },
    { id: '3', timestamp: '2025-11-29 15:40:00', user: 'comptable@ecole.ma', table: 'payments', operation: 'SELECT', recordCount: 250, executionTime: '890ms' },
    { id: '4', timestamp: '2025-11-29 15:38:00', user: 'enseignant@ecole.ma', table: 'grades', operation: 'INSERT', recordCount: 35, executionTime: '340ms' },
    { id: '5', timestamp: '2025-11-29 15:35:00', user: 'directeur@ecole.ma', table: 'documents', operation: 'DELETE', recordCount: 1, executionTime: '55ms' },
    { id: '6', timestamp: '2025-11-29 15:30:00', user: 'admin@ecole.ma', table: 'settings', operation: 'UPDATE', recordCount: 3, executionTime: '28ms' },
  ]);

  // Chart data
  const activityByHour = [
    { hour: '08h', actions: 45 },
    { hour: '09h', actions: 120 },
    { hour: '10h', actions: 180 },
    { hour: '11h', actions: 150 },
    { hour: '12h', actions: 80 },
    { hour: '13h', actions: 40 },
    { hour: '14h', actions: 160 },
    { hour: '15h', actions: 200 },
    { hour: '16h', actions: 140 },
    { hour: '17h', actions: 90 },
  ];

  const activityByCategory = [
    { name: 'Élèves', value: 35, color: 'hsl(var(--primary))' },
    { name: 'Notes', value: 25, color: 'hsl(var(--chart-2))' },
    { name: 'Finance', value: 20, color: 'hsl(var(--chart-3))' },
    { name: 'Documents', value: 12, color: 'hsl(var(--chart-4))' },
    { name: 'Système', value: 8, color: 'hsl(var(--chart-5))' },
  ];

  const userActivityRanking = [
    { user: 'admin@ecole.ma', actions: 156 },
    { user: 'secretaire@ecole.ma', actions: 124 },
    { user: 'comptable@ecole.ma', actions: 98 },
    { user: 'enseignant@ecole.ma', actions: 87 },
    { user: 'directeur@ecole.ma', actions: 65 },
  ];

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'création':
        return <Database className="h-4 w-4 text-green-600" />;
      case 'modification':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'suppression':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'visualisation':
        return <Eye className="h-4 w-4 text-purple-600" />;
      case 'export':
        return <Download className="h-4 w-4 text-amber-600" />;
      case 'configuration':
        return <Settings className="h-4 w-4 text-gray-600" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getLoginIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <LogIn className="h-4 w-4 text-green-600" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getOperationBadge = (operation: string) => {
    switch (operation) {
      case 'SELECT':
        return 'secondary';
      case 'INSERT':
        return 'default';
      case 'UPDATE':
        return 'outline';
      case 'DELETE':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleExportAudit = (format: string) => {
    if (format === 'csv' || format === 'excel') {
      const exportData = filteredLogs.map(log => ({
        'Date/Heure': log.timestamp,
        'Utilisateur': log.user,
        'Rôle': log.userRole,
        'Action': log.action,
        'Catégorie': log.category,
        'Ressource': log.resource,
        'Détails': log.details,
        'Adresse IP': log.ip,
        'Statut': log.success ? 'Succès' : 'Échec'
      }));
      
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Audit");
      
      if (format === 'csv') {
        const csvContent = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        XLSX.writeFile(wb, `audit_logs_${new Date().toISOString().split('T')[0]}.xlsx`);
      }
      
      toast({
        title: "Export réussi",
        description: `${filteredLogs.length} entrées exportées en ${format.toUpperCase()}`,
      });
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("JOURNAL D'AUDIT", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 20, 30);
      doc.text(`Période: ${dateRange === 'today' ? "Aujourd'hui" : dateRange}`, 120, 30);
      doc.text(`Total: ${filteredLogs.length} entrées`, 20, 37);
      
      const tableData = filteredLogs.map(log => [
        log.timestamp,
        log.user.split('@')[0],
        log.action,
        log.category,
        log.resource,
        log.success ? '✓' : '✗'
      ]);
      
      autoTable(doc, {
        head: [['Date/Heure', 'Utilisateur', 'Action', 'Catégorie', 'Ressource', 'OK']],
        body: tableData,
        startY: 45,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [0, 51, 102] },
      });
      
      doc.save(`audit_logs_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export PDF réussi",
        description: `${filteredLogs.length} entrées exportées`,
      });
    }
  };

  const handleExportRGPD = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("RAPPORT DE CONFORMITÉ RGPD", 105, 20, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Date du rapport: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
    doc.text(`Période analysée: ${dateRange === 'today' ? "Aujourd'hui" : dateRange}`, 20, 42);
    
    // Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. RÉSUMÉ DES ACCÈS AUX DONNÉES", 20, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`• Nombre total d'actions: ${activityLogs.length}`, 25, 65);
    doc.text(`• Utilisateurs distincts: ${stats.uniqueUsers}`, 25, 72);
    doc.text(`• Accès échoués: ${stats.failedActions}`, 25, 79);
    doc.text(`• Connexions réussies: ${stats.todayLogins}`, 25, 86);
    
    // Data access summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2. ACCÈS AUX DONNÉES PERSONNELLES", 20, 100);
    
    const dataAccessSummary = dataAccessLogs.reduce((acc, log) => {
      acc[log.table] = (acc[log.table] || 0) + log.recordCount;
      return acc;
    }, {} as Record<string, number>);
    
    let yPos = 110;
    Object.entries(dataAccessSummary).forEach(([table, count]) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`• Table "${table}": ${count} enregistrements consultés`, 25, yPos);
      yPos += 7;
    });
    
    // Login history
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("3. HISTORIQUE DES CONNEXIONS", 20, yPos + 10);
    
    const loginData = loginHistory.slice(0, 10).map(l => [
      l.timestamp,
      l.user,
      l.action === 'login' ? 'Connexion' : l.action === 'logout' ? 'Déconnexion' : 'Échec',
      l.ip,
      l.location
    ]);
    
    autoTable(doc, {
      head: [['Date/Heure', 'Utilisateur', 'Action', 'IP', 'Localisation']],
      body: loginData,
      startY: yPos + 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 51, 102] },
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text("Ce rapport est généré automatiquement pour la conformité RGPD.", 20, finalY);
    doc.text("Conservation recommandée: 5 ans", 20, finalY + 7);
    
    doc.save(`Rapport_RGPD_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Rapport RGPD généré",
      description: "Le rapport de conformité a été téléchargé",
    });
  };

  const categories = Array.from(new Set(activityLogs.map(log => log.category)));
  const users = Array.from(new Set(activityLogs.map(log => log.user)));

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesUser = filterUser === 'all' || log.user === filterUser;
    return matchesSearch && matchesCategory && matchesUser;
  });

  const stats = {
    totalActions: activityLogs.length,
    uniqueUsers: new Set(activityLogs.map(l => l.user)).size,
    failedActions: activityLogs.filter(l => !l.success).length,
    todayLogins: loginHistory.filter(l => l.action === 'login').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit & Traçabilité</h1>
          <p className="text-muted-foreground mt-2">
            Historique complet des actions et conformité RGPD
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
              <SelectItem value="quarter">3 mois</SelectItem>
              <SelectItem value="year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportAudit('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportRGPD}>
            <Shield className="mr-2 h-4 w-4" />
            Rapport RGPD
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Actions Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalActions}</div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">différents utilisateurs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Connexions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.todayLogins}</div>
              <LogIn className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">connexions réussies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Échecs/Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.failedActions}</div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">tentatives échouées</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activité par Heure</CardTitle>
            <CardDescription>Distribution des actions au cours de la journée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="actions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Par Catégorie</CardTitle>
            <CardDescription>Répartition des actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activityByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {activityByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="activity">Journal d'Activité</TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-1">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
          <TabsTrigger value="logins">Connexions</TabsTrigger>
          <TabsTrigger value="data">Accès Données</TabsTrigger>
          <TabsTrigger value="ranking">Top Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Journal d'Activité Complet</CardTitle>
                  <CardDescription>
                    {filteredLogs.length} action(s) affichée(s)
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
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
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
                    <TableHead className="w-[160px]">Horodatage</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Ressource</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.user}</div>
                          <div className="text-xs text-muted-foreground">{log.userRole}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {log.action}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.resource}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {log.details}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                      <TableCell>
                        {log.success ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Succès
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Échec</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Journal d'Accès aux Archives
              </CardTitle>
              <CardDescription>
                Traçabilité des consultations et actions sur les archives ({archiveLogs.length} entrées)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archiveLogs.slice(0, 20).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{log.user}</div>
                            <div className="text-xs text-muted-foreground">{log.userRole}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.resource}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Connexions</CardTitle>
              <CardDescription>
                Suivi des connexions, déconnexions et tentatives échouées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horodatage</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Appareil</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginHistory.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getLoginIcon(log.action)}
                          <Badge 
                            variant={
                              log.action === 'login' ? 'default' : 
                              log.action === 'logout' ? 'secondary' : 'destructive'
                            }
                          >
                            {log.action === 'login' ? 'Connexion' : 
                             log.action === 'logout' ? 'Déconnexion' : 'Échec'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{log.device}</TableCell>
                      <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.reason || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accès aux Données</CardTitle>
              <CardDescription>
                Traçabilité des requêtes base de données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horodatage</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Opération</TableHead>
                    <TableHead>Enregistrements</TableHead>
                    <TableHead>Temps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataAccessLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {log.table}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOperationBadge(log.operation) as any}>
                          {log.operation}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.recordCount}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.executionTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classement des Utilisateurs</CardTitle>
              <CardDescription>
                Utilisateurs les plus actifs sur la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivityRanking.map((user, index) => (
                  <div key={user.user} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-amber-100 text-amber-800' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{user.user}</span>
                        <span className="text-sm text-muted-foreground">{user.actions} actions</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(user.actions / userActivityRanking[0].actions) * 100}%` }} 
                        />
                      </div>
                    </div>
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
