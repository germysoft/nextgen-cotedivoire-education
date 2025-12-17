import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table2, Download, Plus, Filter, RefreshCw, Settings, Maximize2,
  ArrowUpDown, GripVertical, Eye, Trash2, Save, Copy, BarChart3
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface PivotConfig {
  id: string;
  name: string;
  rows: string[];
  columns: string[];
  values: string[];
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max';
  filters: string[];
  createdAt: string;
}

interface DataSource {
  id: string;
  name: string;
  description: string;
  fields: { name: string; type: string }[];
}

export default function TableauxCroisesPage() {
  const { toast } = useToast();
  const [activeDataSource, setActiveDataSource] = useState('students');
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>(['classe']);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['trimestre']);
  const [selectedValues, setSelectedValues] = useState<string[]>(['moyenne']);
  const [aggregationType, setAggregationType] = useState<string>('avg');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const dataSources: DataSource[] = [
    { 
      id: 'students', 
      name: 'Élèves', 
      description: 'Données des inscriptions',
      fields: [
        { name: 'classe', type: 'dimension' },
        { name: 'niveau', type: 'dimension' },
        { name: 'sexe', type: 'dimension' },
        { name: 'statut', type: 'dimension' },
        { name: 'effectif', type: 'measure' },
        { name: 'moyenne', type: 'measure' },
      ]
    },
    { 
      id: 'grades', 
      name: 'Notes', 
      description: 'Résultats scolaires',
      fields: [
        { name: 'classe', type: 'dimension' },
        { name: 'matiere', type: 'dimension' },
        { name: 'trimestre', type: 'dimension' },
        { name: 'enseignant', type: 'dimension' },
        { name: 'moyenne', type: 'measure' },
        { name: 'effectif', type: 'measure' },
      ]
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      description: 'Données financières',
      fields: [
        { name: 'mois', type: 'dimension' },
        { name: 'type', type: 'dimension' },
        { name: 'classe', type: 'dimension' },
        { name: 'montant', type: 'measure' },
        { name: 'nombre', type: 'measure' },
      ]
    },
    { 
      id: 'attendance', 
      name: 'Assiduité', 
      description: 'Présences et absences',
      fields: [
        { name: 'classe', type: 'dimension' },
        { name: 'mois', type: 'dimension' },
        { name: 'type', type: 'dimension' },
        { name: 'absences', type: 'measure' },
        { name: 'retards', type: 'measure' },
        { name: 'taux_presence', type: 'measure' },
      ]
    },
  ];

  const [savedConfigs] = useState<PivotConfig[]>([
    { id: '1', name: 'Moyennes par classe et trimestre', rows: ['classe'], columns: ['trimestre'], values: ['moyenne'], aggregation: 'avg', filters: [], createdAt: '2025-11-28' },
    { id: '2', name: 'Effectifs par niveau et sexe', rows: ['niveau'], columns: ['sexe'], values: ['effectif'], aggregation: 'sum', filters: [], createdAt: '2025-11-25' },
    { id: '3', name: 'Recettes par mois', rows: ['mois'], columns: ['type'], values: ['montant'], aggregation: 'sum', filters: [], createdAt: '2025-11-20' },
  ]);

  // Simulated pivot data based on selection
  const getPivotData = () => {
    if (selectedRows.includes('classe') && selectedColumns.includes('trimestre')) {
      return {
        headers: ['Classe', 'T1', 'T2', 'T3', 'Total'],
        rows: [
          ['6ème A', 14.5, 15.2, 14.8, 14.83],
          ['6ème B', 13.8, 14.1, 14.5, 14.13],
          ['5ème A', 15.1, 14.9, 15.3, 15.10],
          ['5ème B', 12.9, 13.5, 13.8, 13.40],
          ['4ème A', 14.2, 14.8, 14.5, 14.50],
          ['4ème B', 13.5, 13.9, 14.2, 13.87],
          ['3ème A', 15.8, 15.5, 16.1, 15.80],
          ['3ème B', 14.1, 14.4, 14.8, 14.43],
        ],
      };
    }
    if (selectedRows.includes('niveau') && selectedColumns.includes('sexe')) {
      return {
        headers: ['Niveau', 'Garçons', 'Filles', 'Total'],
        rows: [
          ['6ème', 85, 92, 177],
          ['5ème', 78, 88, 166],
          ['4ème', 72, 81, 153],
          ['3ème', 68, 75, 143],
        ],
      };
    }
    return {
      headers: ['Catégorie', 'Valeur 1', 'Valeur 2', 'Total'],
      rows: [
        ['Item A', 100, 150, 250],
        ['Item B', 200, 180, 380],
        ['Item C', 150, 200, 350],
      ],
    };
  };

  const pivotData = getPivotData();

  const chartData = pivotData.rows.map(row => ({
    name: row[0],
    value1: row[1],
    value2: row[2],
    value3: row[3],
    total: row[row.length - 1],
  }));

  const pieData = pivotData.rows.map((row, index) => ({
    name: row[0],
    value: row[row.length - 1] as number,
    color: `hsl(${index * 45}, 70%, 50%)`,
  }));

  const handleSaveConfig = () => {
    toast({
      title: "Configuration sauvegardée",
      description: "Le tableau croisé a été enregistré dans vos favoris.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Export ${format.toUpperCase()} du tableau croisé...`,
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Données actualisées",
      description: "Le tableau croisé a été recalculé avec les dernières données.",
    });
  };

  const currentDataSource = dataSources.find(ds => ds.id === activeDataSource);
  const dimensionFields = currentDataSource?.fields.filter(f => f.type === 'dimension') || [];
  const measureFields = currentDataSource?.fields.filter(f => f.type === 'measure') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableaux Croisés Dynamiques</h1>
          <p className="text-muted-foreground mt-2">
            Analysez vos données avec des tableaux pivots personnalisables
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => handleExport('xlsx')}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={handleSaveConfig}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Configuration Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Source de données</Label>
              <Select value={activeDataSource} onValueChange={setActiveDataSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map(ds => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {currentDataSource?.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                Lignes (dimensions)
              </Label>
              <div className="space-y-2">
                {dimensionFields.map(field => (
                  <div key={field.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`row-${field.name}`}
                      checked={selectedRows.includes(field.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRows([...selectedRows, field.name]);
                        } else {
                          setSelectedRows(selectedRows.filter(r => r !== field.name));
                        }
                      }}
                    />
                    <label htmlFor={`row-${field.name}`} className="text-sm">
                      {field.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Colonnes (dimensions)
              </Label>
              <div className="space-y-2">
                {dimensionFields.map(field => (
                  <div key={field.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`col-${field.name}`}
                      checked={selectedColumns.includes(field.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedColumns([...selectedColumns, field.name]);
                        } else {
                          setSelectedColumns(selectedColumns.filter(c => c !== field.name));
                        }
                      }}
                    />
                    <label htmlFor={`col-${field.name}`} className="text-sm">
                      {field.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Table2 className="h-4 w-4" />
                Valeurs (mesures)
              </Label>
              <div className="space-y-2">
                {measureFields.map(field => (
                  <div key={field.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`val-${field.name}`}
                      checked={selectedValues.includes(field.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedValues([...selectedValues, field.name]);
                        } else {
                          setSelectedValues(selectedValues.filter(v => v !== field.name));
                        }
                      }}
                    />
                    <label htmlFor={`val-${field.name}`} className="text-sm">
                      {field.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Agrégation</Label>
              <Select value={aggregationType} onValueChange={setAggregationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Somme</SelectItem>
                  <SelectItem value="count">Compte</SelectItem>
                  <SelectItem value="avg">Moyenne</SelectItem>
                  <SelectItem value="min">Minimum</SelectItem>
                  <SelectItem value="max">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Affichage</Label>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'table' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex-1"
                >
                  <Table2 className="mr-2 h-4 w-4" />
                  Table
                </Button>
                <Button 
                  variant={viewMode === 'chart' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('chart')}
                  className="flex-1"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Graphique
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Résultats</CardTitle>
                  <CardDescription>
                    {selectedRows.join(', ')} × {selectedColumns.join(', ')} - {aggregationType.toUpperCase()}({selectedValues.join(', ')})
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {pivotData.headers.map((header, i) => (
                          <TableHead key={i} className={i > 0 ? 'text-right' : ''}>
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pivotData.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell 
                              key={cellIndex} 
                              className={cellIndex > 0 ? 'text-right font-mono' : 'font-medium'}
                            >
                              {typeof cell === 'number' ? cell.toFixed(2) : cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Tabs defaultValue="bar" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="bar">Barres</TabsTrigger>
                    <TabsTrigger value="line">Lignes</TabsTrigger>
                    <TabsTrigger value="pie">Camembert</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bar">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value1" name={pivotData.headers[1]} fill="hsl(var(--primary))" />
                          <Bar dataKey="value2" name={pivotData.headers[2]} fill="hsl(var(--chart-2))" />
                          <Bar dataKey="value3" name={pivotData.headers[3]} fill="hsl(var(--chart-3))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="line">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value1" name={pivotData.headers[1]} stroke="hsl(var(--primary))" strokeWidth={2} />
                          <Line type="monotone" dataKey="value2" name={pivotData.headers[2]} stroke="hsl(var(--chart-2))" strokeWidth={2} />
                          <Line type="monotone" dataKey="value3" name={pivotData.headers[3]} stroke="hsl(var(--chart-3))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="pie">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Saved Configurations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurations Sauvegardées</CardTitle>
              <CardDescription>
                Vos tableaux croisés favoris
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {savedConfigs.map(config => (
                  <div 
                    key={config.id} 
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{config.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {config.rows.join(', ')} × {config.columns.join(', ')}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {config.aggregation.toUpperCase()}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
