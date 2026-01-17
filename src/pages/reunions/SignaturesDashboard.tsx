import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileSignature, 
  Download, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  RefreshCw,
  Eye,
  Mail,
  BarChart3,
  Database
} from 'lucide-react';
import { useReportStorage, StoredReport } from '@/hooks/useReportStorage';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, parseISO, differenceInDays, isAfter, isBefore, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { initializeDemoData } from '@/data/mockReunionReports';
import { toast } from 'sonner';

interface SignatureStatus {
  documentId: string;
  documentTitle: string;
  documentType: string;
  documentDate: string;
  totalSignatures: number;
  completedSignatures: number;
  pendingSignatures: number;
  status: 'completed' | 'partial' | 'pending' | 'overdue';
  lastSignatureDate?: string;
  signers: {
    name: string;
    role: string;
    status: 'signed' | 'pending';
    signedAt?: string;
    email?: string;
  }[];
}

const SignaturesDashboard = () => {
  const { reports, isLoading } = useReportStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [demoLoaded, setDemoLoaded] = useState(false);

  // Load demo data on mount if no reports exist
  useEffect(() => {
    if (!isLoading && reports.length === 0 && !demoLoaded) {
      const { reportsCount, tokensCount } = initializeDemoData();
      if (reportsCount > 0) {
        setDemoLoaded(true);
        toast.success(`${reportsCount} comptes-rendus de démonstration chargés`);
        window.location.reload();
      }
    }
  }, [isLoading, reports.length, demoLoaded]);

  const handleLoadDemoData = () => {
    localStorage.removeItem('reunion_reports');
    localStorage.removeItem('public_signing_tokens');
    const { reportsCount, tokensCount } = initializeDemoData();
    toast.success(`${reportsCount} comptes-rendus et ${tokensCount} tokens de signature chargés`);
    window.location.reload();
  };

  // Calculate signature statistics from reports
  const signatureData = useMemo((): SignatureStatus[] => {
    return reports.map(report => {
      const signatures = report.electronicSignatures || [];
      const totalRequired = 2 + Math.min(report.participants.filter(p => p.present).length, 5);
      const completed = signatures.length;
      
      const signers = [];
      
      // President
      if (report.president) {
        const signed = signatures.find(s => s.signerRole === 'president' || s.signerName === report.president);
        signers.push({
          name: report.president,
          role: 'Président',
          status: signed ? 'signed' : 'pending' as const,
          signedAt: signed?.signedAt,
        });
      }
      
      // Secretary
      if (report.secretaire) {
        const signed = signatures.find(s => s.signerRole === 'secretaire' || s.signerName === report.secretaire);
        signers.push({
          name: report.secretaire,
          role: 'Secrétaire',
          status: signed ? 'signed' : 'pending' as const,
          signedAt: signed?.signedAt,
        });
      }
      
      // Participants
      report.participants.filter(p => p.present).slice(0, 5).forEach(p => {
        const signed = signatures.find(s => s.signerName === p.nom);
        signers.push({
          name: p.nom,
          role: 'Participant',
          status: signed ? 'signed' : 'pending' as const,
          signedAt: signed?.signedAt,
        });
      });

      let status: SignatureStatus['status'] = 'pending';
      if (completed >= totalRequired) {
        status = 'completed';
      } else if (completed > 0) {
        status = 'partial';
      } else if (differenceInDays(new Date(), parseISO(report.date)) > 7) {
        status = 'overdue';
      }

      return {
        documentId: report.id,
        documentTitle: report.titre,
        documentType: report.type,
        documentDate: report.date,
        totalSignatures: totalRequired,
        completedSignatures: completed,
        pendingSignatures: totalRequired - completed,
        status,
        lastSignatureDate: signatures.length > 0 
          ? signatures.reduce((latest, s) => 
              isAfter(parseISO(s.signedAt), parseISO(latest)) ? s.signedAt : latest, 
              signatures[0].signedAt
            )
          : undefined,
        signers,
      };
    });
  }, [reports]);

  // Global statistics
  const stats = useMemo(() => {
    const totalDocuments = signatureData.length;
    const totalSignatures = signatureData.reduce((sum, d) => sum + d.totalSignatures, 0);
    const completedSignatures = signatureData.reduce((sum, d) => sum + d.completedSignatures, 0);
    const pendingSignatures = signatureData.reduce((sum, d) => sum + d.pendingSignatures, 0);
    const fullySignedDocs = signatureData.filter(d => d.status === 'completed').length;
    const partialDocs = signatureData.filter(d => d.status === 'partial').length;
    const pendingDocs = signatureData.filter(d => d.status === 'pending').length;
    const overdueDocs = signatureData.filter(d => d.status === 'overdue').length;
    
    const completionRate = totalSignatures > 0 
      ? Math.round((completedSignatures / totalSignatures) * 100) 
      : 0;

    // Recent activity (last 7 days)
    const recentSignatures = signatureData.reduce((sum, d) => {
      const docSignatures = d.signers.filter(s => 
        s.signedAt && isAfter(parseISO(s.signedAt), subDays(new Date(), 7))
      ).length;
      return sum + docSignatures;
    }, 0);

    return {
      totalDocuments,
      totalSignatures,
      completedSignatures,
      pendingSignatures,
      fullySignedDocs,
      partialDocs,
      pendingDocs,
      overdueDocs,
      completionRate,
      recentSignatures,
    };
  }, [signatureData]);

  // Charts data
  const pieChartData = useMemo(() => [
    { name: 'Complétés', value: stats.fullySignedDocs, color: 'hsl(var(--chart-1))' },
    { name: 'Partiels', value: stats.partialDocs, color: 'hsl(var(--chart-2))' },
    { name: 'En attente', value: stats.pendingDocs, color: 'hsl(var(--chart-3))' },
    { name: 'En retard', value: stats.overdueDocs, color: 'hsl(var(--chart-4))' },
  ].filter(d => d.value > 0), [stats]);

  const barChartData = useMemo(() => {
    const byType: { [key: string]: { completed: number; pending: number } } = {};
    signatureData.forEach(d => {
      const typeLabel = getTypeLabel(d.documentType as any);
      if (!byType[typeLabel]) {
        byType[typeLabel] = { completed: 0, pending: 0 };
      }
      byType[typeLabel].completed += d.completedSignatures;
      byType[typeLabel].pending += d.pendingSignatures;
    });
    return Object.entries(byType).map(([name, data]) => ({
      name,
      Signées: data.completed,
      'En attente': data.pending,
    }));
  }, [signatureData]);

  // Filtering
  const filteredData = useMemo(() => {
    return signatureData.filter(doc => {
      const matchesSearch = doc.documentTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      const matchesType = filterType === 'all' || doc.documentType === filterType;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const docDate = parseISO(doc.documentDate);
        const today = new Date();
        switch (dateRange) {
          case '7days':
            matchesDate = isAfter(docDate, subDays(today, 7));
            break;
          case '30days':
            matchesDate = isAfter(docDate, subDays(today, 30));
            break;
          case '90days':
            matchesDate = isAfter(docDate, subDays(today, 90));
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [signatureData, searchTerm, filterStatus, filterType, dateRange]);

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Document',
      'Type',
      'Date',
      'Signatures requises',
      'Signatures complétées',
      'Signatures en attente',
      'Statut',
      'Dernière signature',
      'Signataires (détail)'
    ];

    const rows = filteredData.map(doc => [
      doc.documentTitle,
      getTypeLabel(doc.documentType as any),
      format(parseISO(doc.documentDate), 'dd/MM/yyyy', { locale: fr }),
      doc.totalSignatures.toString(),
      doc.completedSignatures.toString(),
      doc.pendingSignatures.toString(),
      getStatusLabel(doc.status),
      doc.lastSignatureDate 
        ? format(parseISO(doc.lastSignatureDate), 'dd/MM/yyyy HH:mm', { locale: fr })
        : 'Aucune',
      doc.signers.map(s => `${s.name} (${s.role}): ${s.status === 'signed' ? 'Signé' : 'En attente'}`).join(' | ')
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suivi-signatures-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function getTypeLabel(type: string): string {
    switch (type) {
      case 'conseil_classe': return 'Conseil de Classe';
      case 'reunion_parents': return 'Réunion Parents';
      case 'reunion_pedagogique': return 'Réunion Pédagogique';
      case 'reunion_administrative': return 'Réunion Administrative';
      default: return type;
    }
  }

  function getStatusLabel(status: SignatureStatus['status']): string {
    switch (status) {
      case 'completed': return 'Complété';
      case 'partial': return 'Partiel';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
    }
  }

  function getStatusBadge(status: SignatureStatus['status']) {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Complété</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Partiel</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">En retard</Badge>;
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileSignature className="h-8 w-8 text-primary" />
            Tableau de Bord des Signatures
          </h1>
          <p className="text-muted-foreground">
            Suivi de l'avancement des signatures électroniques sur tous les documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLoadDemoData} className="gap-2">
            <Database className="w-4 h-4" />
            Recharger démo
          </Button>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.fullySignedDocs} entièrement signés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Signatures</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedSignatures}/{stats.totalSignatures}
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completionRate}% de complétion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingSignatures}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.pendingDocs + stats.partialDocs} documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activité récente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.recentSignatures}</div>
            <p className="text-xs text-muted-foreground">
              signatures ces 7 derniers jours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              État des documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Signatures par type de réunion
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Signées" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="En attente" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des documents</CardTitle>
          <CardDescription>Liste complète avec statut des signatures</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complétés</SelectItem>
                <SelectItem value="partial">Partiels</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de réunion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="conseil_classe">Conseil de Classe</SelectItem>
                <SelectItem value="reunion_parents">Réunion Parents</SelectItem>
                <SelectItem value="reunion_pedagogique">Réunion Pédagogique</SelectItem>
                <SelectItem value="reunion_administrative">Réunion Administrative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes dates</SelectItem>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="90days">90 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {filteredData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Progression</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière signature</TableHead>
                    <TableHead>Signataires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((doc) => (
                    <TableRow key={doc.documentId}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {doc.documentTitle}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {getTypeLabel(doc.documentType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(parseISO(doc.documentDate), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(doc.completedSignatures / doc.totalSignatures) * 100} 
                            className="w-[60px]"
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {doc.completedSignatures}/{doc.totalSignatures}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {doc.lastSignatureDate 
                          ? format(parseISO(doc.lastSignatureDate), 'dd/MM HH:mm', { locale: fr })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {doc.signers.slice(0, 3).map((signer, idx) => (
                            <div
                              key={idx}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                signer.status === 'signed'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                              title={`${signer.name} (${signer.role}): ${signer.status === 'signed' ? 'Signé' : 'En attente'}`}
                            >
                              {signer.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {doc.signers.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              +{doc.signers.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSignature className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">Aucun document trouvé</h3>
              <p className="text-sm text-muted-foreground">
                Modifiez vos filtres ou créez de nouveaux comptes-rendus
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.fullySignedDocs}</p>
                <p className="text-sm text-muted-foreground">Documents complétés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{stats.partialDocs}</p>
                <p className="text-sm text-muted-foreground">En cours de signature</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingDocs}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.overdueDocs}</p>
                <p className="text-sm text-muted-foreground">En retard (&gt;7 jours)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignaturesDashboard;
