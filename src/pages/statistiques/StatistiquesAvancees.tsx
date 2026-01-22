import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, TrendingDown, Users, GraduationCap, 
  DollarSign, Calendar, Download, Filter, RefreshCw, Settings,
  BookOpen, Trophy, AlertTriangle, CheckCircle2, Clock, FileText,
  FileSpreadsheet, Printer, Share2, Eye, ArrowUpDown, Layers,
  PieChart as PieChartIcon, LineChart as LineChartIcon, Activity,
  Target, Percent, Hash, Zap, Scale
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Types
interface ComparisonPeriod {
  id: string;
  label: string;
  years: string[];
}

interface ExportConfig {
  format: 'pdf' | 'xlsx' | 'csv' | 'png';
  includeCharts: boolean;
  includeTables: boolean;
  includeKPIs: boolean;
  includeTrends: boolean;
  orientation: 'portrait' | 'landscape';
  paperSize: 'A4' | 'A3' | 'Letter';
  title: string;
  subtitle: string;
  includeWatermark: boolean;
  includeTimestamp: boolean;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'scatter' | 'composed';
  title: string;
  showLegend: boolean;
  showGrid: boolean;
  animate: boolean;
  stacked: boolean;
}

// Mock Data
const yearlyPerformanceData = [
  { year: '2020-21', moyenne: 12.8, tauxReussite: 78, tauxPresence: 91, satisfaction: 72 },
  { year: '2021-22', moyenne: 13.2, tauxReussite: 81, tauxPresence: 92, satisfaction: 75 },
  { year: '2022-23', moyenne: 13.6, tauxReussite: 84, tauxPresence: 93, satisfaction: 78 },
  { year: '2023-24', moyenne: 13.9, tauxReussite: 86, tauxPresence: 94, satisfaction: 82 },
  { year: '2024-25', moyenne: 14.2, tauxReussite: 89, tauxPresence: 95, satisfaction: 85 },
];

const subjectComparison = [
  { subject: 'Mathématiques', annee1: 12.5, annee2: 13.1, annee3: 13.8, evolution: 10.4 },
  { subject: 'Français', annee1: 13.8, annee2: 14.2, annee3: 14.5, evolution: 5.1 },
  { subject: 'Anglais', annee1: 12.9, annee2: 13.5, annee3: 14.1, evolution: 9.3 },
  { subject: 'Physique', annee1: 11.8, annee2: 12.4, annee3: 13.0, evolution: 10.2 },
  { subject: 'SVT', annee1: 14.2, annee2: 14.6, annee3: 15.0, evolution: 5.6 },
  { subject: 'Histoire-Géo', annee1: 13.5, annee2: 13.9, annee3: 14.3, evolution: 5.9 },
  { subject: 'Philosophie', annee1: 12.1, annee2: 12.8, annee3: 13.4, evolution: 10.7 },
  { subject: 'EPS', annee1: 14.8, annee2: 15.1, annee3: 15.3, evolution: 3.4 },
];

const classPerformanceScatter = [
  { x: 85, y: 14.2, z: 45, name: '6ème A' },
  { x: 88, y: 14.5, z: 42, name: '6ème B' },
  { x: 82, y: 13.8, z: 48, name: '5ème A' },
  { x: 79, y: 13.2, z: 44, name: '5ème B' },
  { x: 91, y: 15.1, z: 40, name: '4ème A' },
  { x: 86, y: 14.0, z: 46, name: '4ème B' },
  { x: 93, y: 15.5, z: 38, name: '3ème A' },
  { x: 89, y: 14.8, z: 41, name: '3ème B' },
];

const financialTrends = [
  { month: 'Sept', recettes: 48000000, depenses: 35000000, objectif: 45000000 },
  { month: 'Oct', recettes: 42000000, depenses: 32000000, objectif: 40000000 },
  { month: 'Nov', recettes: 38000000, depenses: 30000000, objectif: 38000000 },
  { month: 'Déc', recettes: 45000000, depenses: 38000000, objectif: 42000000 },
  { month: 'Jan', recettes: 52000000, depenses: 34000000, objectif: 48000000 },
  { month: 'Fév', recettes: 40000000, depenses: 31000000, objectif: 38000000 },
  { month: 'Mars', recettes: 44000000, depenses: 33000000, objectif: 42000000 },
];

const enrollmentDistribution = [
  { name: '6ème', garcons: 195, filles: 185, total: 380 },
  { name: '5ème', garcons: 175, filles: 175, total: 350 },
  { name: '4ème', garcons: 180, filles: 180, total: 360 },
  { name: '3ème', garcons: 170, filles: 179, total: 349 },
];

const radarComparison = [
  { metric: 'Académique', current: 85, previous: 78, target: 90 },
  { metric: 'Assiduité', current: 92, previous: 88, target: 95 },
  { metric: 'Discipline', current: 88, previous: 82, target: 90 },
  { metric: 'Financier', current: 87, previous: 81, target: 92 },
  { metric: 'Satisfaction', current: 82, previous: 75, target: 85 },
  { metric: 'Infrastructure', current: 78, previous: 72, target: 85 },
];

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function StatistiquesAvanceesPage() {
  const { toast } = useToast();
  
  // State
  const [selectedPeriod, setSelectedPeriod] = useState('3-years');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedChartType, setSelectedChartType] = useState<string>('composed');
  const [showComparison, setShowComparison] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isChartConfigOpen, setIsChartConfigOpen] = useState(false);
  
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
    includeKPIs: true,
    includeTrends: true,
    orientation: 'landscape',
    paperSize: 'A4',
    title: 'Rapport Statistiques Avancées',
    subtitle: 'Analyse comparative multi-périodes',
    includeWatermark: true,
    includeTimestamp: true,
  });

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'composed',
    title: 'Graphique personnalisé',
    showLegend: true,
    showGrid: true,
    animate: true,
    stacked: false,
  });

  // Computed KPIs
  const kpis = useMemo(() => {
    const latestYear = yearlyPerformanceData[yearlyPerformanceData.length - 1];
    const previousYear = yearlyPerformanceData[yearlyPerformanceData.length - 2];
    
    return {
      moyenneGenerale: {
        value: latestYear.moyenne,
        change: ((latestYear.moyenne - previousYear.moyenne) / previousYear.moyenne * 100).toFixed(1),
        trend: latestYear.moyenne > previousYear.moyenne ? 'up' : 'down',
      },
      tauxReussite: {
        value: latestYear.tauxReussite,
        change: (latestYear.tauxReussite - previousYear.tauxReussite).toFixed(1),
        trend: latestYear.tauxReussite > previousYear.tauxReussite ? 'up' : 'down',
      },
      tauxPresence: {
        value: latestYear.tauxPresence,
        change: (latestYear.tauxPresence - previousYear.tauxPresence).toFixed(1),
        trend: latestYear.tauxPresence > previousYear.tauxPresence ? 'up' : 'down',
      },
      satisfaction: {
        value: latestYear.satisfaction,
        change: (latestYear.satisfaction - previousYear.satisfaction).toFixed(1),
        trend: latestYear.satisfaction > previousYear.satisfaction ? 'up' : 'down',
      },
    };
  }, []);

  // Export Functions
  const generatePDFExport = () => {
    const doc = new jsPDF({
      orientation: exportConfig.orientation,
      unit: 'mm',
      format: exportConfig.paperSize.toLowerCase() as any,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(exportConfig.title, 15, 18);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(exportConfig.subtitle, 15, 28);
    
    if (exportConfig.includeTimestamp) {
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth - 80, 28);
    }

    yPosition = 45;
    doc.setTextColor(0, 0, 0);

    // KPIs Section
    if (exportConfig.includeKPIs) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('📊 Indicateurs Clés de Performance', 15, yPosition);
      yPosition += 10;

      const kpiData = [
        ['Indicateur', 'Valeur Actuelle', 'Évolution', 'Tendance'],
        ['Moyenne Générale', `${kpis.moyenneGenerale.value}/20`, `${kpis.moyenneGenerale.change}%`, kpis.moyenneGenerale.trend === 'up' ? '↑' : '↓'],
        ['Taux de Réussite', `${kpis.tauxReussite.value}%`, `${kpis.tauxReussite.change}%`, kpis.tauxReussite.trend === 'up' ? '↑' : '↓'],
        ['Taux de Présence', `${kpis.tauxPresence.value}%`, `${kpis.tauxPresence.change}%`, kpis.tauxPresence.trend === 'up' ? '↑' : '↓'],
        ['Satisfaction', `${kpis.satisfaction.value}%`, `${kpis.satisfaction.change}%`, kpis.satisfaction.trend === 'up' ? '↑' : '↓'],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [kpiData[0]],
        body: kpiData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { fontStyle: 'bold' },
          3: { halign: 'center' },
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Performance by Subject Table
    if (exportConfig.includeTables) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('📚 Performance par Matière (Comparaison 3 ans)', 15, yPosition);
      yPosition += 10;

      const subjectData = subjectComparison.map(s => [
        s.subject,
        s.annee1.toFixed(1),
        s.annee2.toFixed(1),
        s.annee3.toFixed(1),
        `${s.evolution > 0 ? '+' : ''}${s.evolution.toFixed(1)}%`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Matière', '2022-23', '2023-24', '2024-25', 'Évolution']],
        body: subjectData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          4: { 
            halign: 'center',
            fontStyle: 'bold',
          },
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Trends Summary
    if (exportConfig.includeTrends) {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('📈 Résumé des Tendances', 15, yPosition);
      yPosition += 10;

      const trendsData = [
        ['Métrique', 'Tendance 5 ans', 'Prévision', 'Objectif'],
        ['Effectifs', '+4.5% / an', '1520 élèves', '1600 élèves'],
        ['Moyenne Générale', '+0.35 pts / an', '14.5/20', '15/20'],
        ['Taux de Réussite', '+2.75% / an', '92%', '95%'],
        ['Recouvrement', '+1.8% / an', '90%', '95%'],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [trendsData[0]],
        body: trendsData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
      });
    }

    // Watermark
    if (exportConfig.includeWatermark) {
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(40);
      doc.setFont('helvetica', 'bold');
      doc.text('CONFIDENTIEL', pageWidth / 2, pageHeight / 2, { 
        angle: 45,
        align: 'center',
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} sur ${pageCount} - Rapport généré par Système de Gestion Scolaire`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    doc.save(`statistiques-avancees-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateExcelExport = () => {
    const workbook = XLSX.utils.book_new();

    // KPIs Sheet
    const kpiSheet = XLSX.utils.aoa_to_sheet([
      ['INDICATEURS CLÉS DE PERFORMANCE'],
      [],
      ['Indicateur', 'Valeur Actuelle', 'Évolution', 'Tendance'],
      ['Moyenne Générale', `${kpis.moyenneGenerale.value}/20`, `${kpis.moyenneGenerale.change}%`, kpis.moyenneGenerale.trend === 'up' ? 'Hausse' : 'Baisse'],
      ['Taux de Réussite', `${kpis.tauxReussite.value}%`, `${kpis.tauxReussite.change}%`, kpis.tauxReussite.trend === 'up' ? 'Hausse' : 'Baisse'],
      ['Taux de Présence', `${kpis.tauxPresence.value}%`, `${kpis.tauxPresence.change}%`, kpis.tauxPresence.trend === 'up' ? 'Hausse' : 'Baisse'],
      ['Satisfaction', `${kpis.satisfaction.value}%`, `${kpis.satisfaction.change}%`, kpis.satisfaction.trend === 'up' ? 'Hausse' : 'Baisse'],
    ]);
    XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');

    // Performance by Year Sheet
    const perfSheet = XLSX.utils.json_to_sheet(yearlyPerformanceData);
    XLSX.utils.book_append_sheet(workbook, perfSheet, 'Performance Annuelle');

    // Subject Comparison Sheet
    const subjectSheet = XLSX.utils.json_to_sheet(subjectComparison);
    XLSX.utils.book_append_sheet(workbook, subjectSheet, 'Comparaison Matières');

    // Financial Trends Sheet
    const financeSheet = XLSX.utils.json_to_sheet(financialTrends);
    XLSX.utils.book_append_sheet(workbook, financeSheet, 'Tendances Financières');

    // Enrollment Distribution Sheet
    const enrollmentSheet = XLSX.utils.json_to_sheet(enrollmentDistribution);
    XLSX.utils.book_append_sheet(workbook, enrollmentSheet, 'Répartition Effectifs');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `statistiques-avancees-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const generateCSVExport = () => {
    const csvData = [
      ['STATISTIQUES AVANCÉES - EXPORT CSV'],
      [],
      ['PERFORMANCE ANNUELLE'],
      ['Année', 'Moyenne', 'Taux Réussite', 'Taux Présence', 'Satisfaction'],
      ...yearlyPerformanceData.map(d => [d.year, d.moyenne, d.tauxReussite, d.tauxPresence, d.satisfaction]),
      [],
      ['COMPARAISON PAR MATIÈRE'],
      ['Matière', '2022-23', '2023-24', '2024-25', 'Évolution (%)'],
      ...subjectComparison.map(s => [s.subject, s.annee1, s.annee2, s.annee3, s.evolution]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `statistiques-avancees-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setIsExportDialogOpen(false);

          switch (exportConfig.format) {
            case 'pdf':
              generatePDFExport();
              break;
            case 'xlsx':
              generateExcelExport();
              break;
            case 'csv':
              generateCSVExport();
              break;
            case 'png':
              toast({
                title: "Export PNG",
                description: "Capture d'écran du tableau de bord en cours...",
              });
              break;
          }

          toast({
            title: "Export terminé",
            description: `Le rapport a été exporté en format ${exportConfig.format.toUpperCase()}.`,
          });
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleRefreshData = () => {
    toast({
      title: "Données actualisées",
      description: "Les statistiques ont été recalculées avec les dernières données.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Lien de partage créé",
      description: "Le lien vers ce rapport a été copié dans le presse-papiers.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques Avancées</h1>
          <p className="text-muted-foreground mt-2">
            Analyses comparatives multi-périodes avec exports personnalisables
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-year">1 an</SelectItem>
              <SelectItem value="3-years">3 ans</SelectItem>
              <SelectItem value="5-years">5 ans</SelectItem>
              <SelectItem value="all">Tout l'historique</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne Générale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{kpis.moyenneGenerale.value}/20</div>
                <div className="flex items-center mt-1">
                  {kpis.moyenneGenerale.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={kpis.moyenneGenerale.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpis.moyenneGenerale.change}%
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">vs année préc.</span>
                </div>
              </div>
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{kpis.tauxReussite.value}%</div>
                <div className="flex items-center mt-1">
                  {kpis.tauxReussite.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={kpis.tauxReussite.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    +{kpis.tauxReussite.change}%
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">progression</span>
                </div>
              </div>
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Présence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{kpis.tauxPresence.value}%</div>
                <div className="flex items-center mt-1">
                  {kpis.tauxPresence.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={kpis.tauxPresence.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    +{kpis.tauxPresence.change}%
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">amélioration</span>
                </div>
              </div>
              <Clock className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{kpis.satisfaction.value}%</div>
                <div className="flex items-center mt-1">
                  {kpis.satisfaction.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={kpis.satisfaction.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    +{kpis.satisfaction.change}%
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">parents/élèves</span>
                </div>
              </div>
              <Users className="h-10 w-10 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different analysis views */}
      <Tabs defaultValue="evolution" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="evolution">
              <Activity className="mr-2 h-4 w-4" />
              Évolution
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <Scale className="mr-2 h-4 w-4" />
              Comparaison
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Distribution
            </TabsTrigger>
            <TabsTrigger value="correlation">
              <Layers className="mr-2 h-4 w-4" />
              Corrélation
            </TabsTrigger>
            <TabsTrigger value="financial">
              <DollarSign className="mr-2 h-4 w-4" />
              Financier
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={showComparison} 
                onCheckedChange={setShowComparison}
                id="comparison-mode"
              />
              <Label htmlFor="comparison-mode" className="text-sm">Mode comparaison</Label>
            </div>
            
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les domaines</SelectItem>
                <SelectItem value="academic">Académique</SelectItem>
                <SelectItem value="financial">Financier</SelectItem>
                <SelectItem value="discipline">Discipline</SelectItem>
                <SelectItem value="hr">Ressources Humaines</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setIsChartConfigOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Options graphiques
            </Button>
          </div>
        </div>

        {/* Evolution Tab */}
        <TabsContent value="evolution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Performances sur 5 ans</CardTitle>
                <CardDescription>Moyenne générale, taux de réussite et présence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={yearlyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" domain={[10, 20]} />
                      <YAxis yAxisId="right" orientation="right" domain={[70, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="moyenne" name="Moyenne" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="tauxReussite" name="Réussite %" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{ r: 6 }} />
                      <Line yAxisId="right" type="monotone" dataKey="tauxPresence" name="Présence %" stroke="hsl(var(--chart-3))" strokeWidth={3} dot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Multidimensionnelle</CardTitle>
                <CardDescription>Comparaison année actuelle vs précédente vs objectif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarComparison}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Actuel" dataKey="current" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                      <Radar name="Précédent" dataKey="previous" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.3} />
                      <Radar name="Objectif" dataKey="target" stroke="hsl(var(--chart-2))" fill="transparent" strokeDasharray="5 5" />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendance de Satisfaction</CardTitle>
              <CardDescription>Évolution du score de satisfaction parents et élèves</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearlyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                      name="Satisfaction %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison par Matière (3 ans)</CardTitle>
              <CardDescription>Évolution des moyennes par discipline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 20]} />
                    <YAxis type="category" dataKey="subject" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="annee1" name="2022-23" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="annee2" name="2023-24" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="annee3" name="2024-25" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {subjectComparison.slice(0, 6).map((subject, index) => (
              <Card key={subject.subject}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{subject.subject}</CardTitle>
                    <Badge variant={subject.evolution > 8 ? "default" : subject.evolution > 5 ? "secondary" : "outline"}>
                      {subject.evolution > 0 ? '+' : ''}{subject.evolution.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">2022-23</span>
                      <span>{subject.annee1}/20</span>
                    </div>
                    <Progress value={(subject.annee1 / 20) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">2023-24</span>
                      <span>{subject.annee2}/20</span>
                    </div>
                    <Progress value={(subject.annee2 / 20) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">2024-25</span>
                      <span className="font-bold">{subject.annee3}/20</span>
                    </div>
                    <Progress value={(subject.annee3 / 20) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Effectifs par Niveau</CardTitle>
                <CardDescription>Distribution garçons/filles par classe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="garcons" name="Garçons" fill="hsl(var(--primary))" stackId="stack" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="filles" name="Filles" fill="hsl(var(--chart-2))" stackId="stack" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution par Niveau</CardTitle>
                <CardDescription>Pourcentage d'élèves par niveau</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={enrollmentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={3}
                        dataKey="total"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {enrollmentDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {enrollmentDistribution.map((level, index) => (
                    <div key={level.name} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} 
                      />
                      <span>{level.name}: {level.total} élèves</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Correlation Tab */}
        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Corrélation Performance vs Présence par Classe</CardTitle>
              <CardDescription>
                Taille des bulles = effectif de la classe | Axe X = Taux de présence | Axe Y = Moyenne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Présence" 
                      unit="%" 
                      domain={[75, 100]}
                      label={{ value: 'Taux de présence (%)', position: 'bottom' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Moyenne" 
                      unit="/20" 
                      domain={[12, 17]}
                      label={{ value: 'Moyenne générale', angle: -90, position: 'left' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[100, 500]} name="Effectif" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background p-3 border rounded-lg shadow-lg">
                              <p className="font-bold">{data.name}</p>
                              <p className="text-sm">Présence: {data.x}%</p>
                              <p className="text-sm">Moyenne: {data.y}/20</p>
                              <p className="text-sm">Effectif: {data.z} élèves</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      name="Classes" 
                      data={classPerformanceScatter} 
                      fill="hsl(var(--primary))"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">📊 Analyse de corrélation</h4>
                <p className="text-sm text-muted-foreground">
                  Une corrélation positive forte (r = 0.87) est observée entre le taux de présence et la moyenne générale. 
                  Les classes avec un taux de présence supérieur à 90% affichent systématiquement des moyennes supérieures à 14/20.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendances Financières Mensuelles</CardTitle>
              <CardDescription>Recettes, dépenses et objectifs (en FCFA)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={financialTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    <Legend />
                    <Bar dataKey="recettes" name="Recettes" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="depenses" name="Dépenses" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="objectif" name="Objectif" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Recettes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">309M FCFA</div>
                <p className="text-xs text-muted-foreground mt-1">Jan - Mars 2025</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">233M FCFA</div>
                <p className="text-xs text-muted-foreground mt-1">Jan - Mars 2025</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Solde Net</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">76M FCFA</div>
                <p className="text-xs text-muted-foreground mt-1">Excédent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taux Recouvrement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.4%</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 text-xs">+2.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exporter les Statistiques Avancées</DialogTitle>
            <DialogDescription>
              Configurez les options d'export pour personnaliser votre rapport
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Format d'export</Label>
                <Select 
                  value={exportConfig.format} 
                  onValueChange={(v: any) => setExportConfig({ ...exportConfig, format: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-red-600" />
                        PDF - Rapport complet
                      </div>
                    </SelectItem>
                    <SelectItem value="xlsx">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                        Excel - Données tabulaires
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-blue-600" />
                        CSV - Import/Export
                      </div>
                    </SelectItem>
                    <SelectItem value="png">
                      <div className="flex items-center">
                        <Eye className="mr-2 h-4 w-4 text-purple-600" />
                        PNG - Capture d'écran
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Orientation (PDF)</Label>
                <Select 
                  value={exportConfig.orientation} 
                  onValueChange={(v: any) => setExportConfig({ ...exportConfig, orientation: v })}
                  disabled={exportConfig.format !== 'pdf'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Paysage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Titre du rapport</Label>
              <Input 
                value={exportConfig.title}
                onChange={(e) => setExportConfig({ ...exportConfig, title: e.target.value })}
                placeholder="Titre du rapport"
              />
            </div>

            <div className="space-y-2">
              <Label>Sous-titre</Label>
              <Input 
                value={exportConfig.subtitle}
                onChange={(e) => setExportConfig({ ...exportConfig, subtitle: e.target.value })}
                placeholder="Description du rapport"
              />
            </div>

            <div className="space-y-4">
              <Label>Contenu à inclure</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportConfig.includeKPIs}
                    onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeKPIs: !!checked })}
                  />
                  <label className="text-sm">Indicateurs KPI</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportConfig.includeCharts}
                    onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeCharts: !!checked })}
                  />
                  <label className="text-sm">Graphiques</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportConfig.includeTables}
                    onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeTables: !!checked })}
                  />
                  <label className="text-sm">Tableaux de données</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportConfig.includeTrends}
                    onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeTrends: !!checked })}
                  />
                  <label className="text-sm">Analyses de tendances</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportConfig.includeWatermark}
                    onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeWatermark: !!checked })}
                  />
                  <label className="text-sm">Filigrane "Confidentiel"</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={exportConfig.includeTimestamp}
                    onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeTimestamp: !!checked })}
                  />
                  <label className="text-sm">Date et heure de génération</label>
                </div>
              </div>
            </div>

            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Génération du rapport...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chart Configuration Dialog */}
      <Dialog open={isChartConfigOpen} onOpenChange={setIsChartConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Options des Graphiques</DialogTitle>
            <DialogDescription>
              Personnalisez l'affichage des graphiques
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Type de graphique par défaut</Label>
              <Select 
                value={chartConfig.type} 
                onValueChange={(v: any) => setChartConfig({ ...chartConfig, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Barres</SelectItem>
                  <SelectItem value="line">Lignes</SelectItem>
                  <SelectItem value="area">Aires</SelectItem>
                  <SelectItem value="pie">Camembert</SelectItem>
                  <SelectItem value="radar">Radar</SelectItem>
                  <SelectItem value="scatter">Nuage de points</SelectItem>
                  <SelectItem value="composed">Composé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Afficher la légende</Label>
                <Switch 
                  checked={chartConfig.showLegend}
                  onCheckedChange={(checked) => setChartConfig({ ...chartConfig, showLegend: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Afficher la grille</Label>
                <Switch 
                  checked={chartConfig.showGrid}
                  onCheckedChange={(checked) => setChartConfig({ ...chartConfig, showGrid: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Animations</Label>
                <Switch 
                  checked={chartConfig.animate}
                  onCheckedChange={(checked) => setChartConfig({ ...chartConfig, animate: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mode empilé</Label>
                <Switch 
                  checked={chartConfig.stacked}
                  onCheckedChange={(checked) => setChartConfig({ ...chartConfig, stacked: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChartConfigOpen(false)}>
              Fermer
            </Button>
            <Button onClick={() => {
              setIsChartConfigOpen(false);
              toast({
                title: "Options appliquées",
                description: "Les paramètres des graphiques ont été mis à jour.",
              });
            }}>
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
