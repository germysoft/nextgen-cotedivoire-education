import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, Wrench, AlertTriangle, CheckCircle, Clock, Calendar,
  Plus, Search, MapPin, DollarSign, User, FileText, TrendingUp,
  Hammer, Paintbrush, Zap, Droplets, ThermometerSun
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

interface Maintenance {
  id: string;
  titre: string;
  type: "reparation" | "preventif" | "renovation" | "urgence";
  localisation: string;
  dateSignalement: string;
  datePrevue?: string;
  statut: "en_attente" | "en_cours" | "termine" | "reporte";
  priorite: "haute" | "moyenne" | "basse";
  cout?: number;
  responsable?: string;
}

const MaintenancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [maintenances] = useState<Maintenance[]>([
    { id: "1", titre: "Réparation fuite d'eau - Toilettes B", type: "urgence", localisation: "Bâtiment B - RDC", dateSignalement: "2024-01-14", statut: "en_cours", priorite: "haute", cout: 150000, responsable: "M. Koné" },
    { id: "2", titre: "Remplacement néons - Salle 12", type: "reparation", localisation: "Bâtiment A - 1er étage", dateSignalement: "2024-01-12", datePrevue: "2024-01-18", statut: "en_attente", priorite: "moyenne", cout: 45000 },
    { id: "3", titre: "Peinture couloir principal", type: "renovation", localisation: "Bâtiment principal", dateSignalement: "2024-01-10", datePrevue: "2024-02-01", statut: "en_attente", priorite: "basse", cout: 850000 },
    { id: "4", titre: "Révision climatisation", type: "preventif", localisation: "Tous bâtiments", dateSignalement: "2024-01-08", datePrevue: "2024-01-20", statut: "en_cours", priorite: "moyenne", cout: 350000, responsable: "Société CLIM+" },
    { id: "5", titre: "Réparation portail électrique", type: "reparation", localisation: "Entrée principale", dateSignalement: "2024-01-05", statut: "termine", priorite: "haute", cout: 280000, responsable: "M. Diabaté" },
    { id: "6", titre: "Vérification extincteurs", type: "preventif", localisation: "Tous bâtiments", dateSignalement: "2024-01-01", statut: "termine", priorite: "haute", cout: 120000 },
  ]);

  const stats = {
    enCours: maintenances.filter(m => m.statut === "en_cours").length,
    enAttente: maintenances.filter(m => m.statut === "en_attente").length,
    terminees: maintenances.filter(m => m.statut === "termine").length,
    coutTotal: maintenances.reduce((sum, m) => sum + (m.cout || 0), 0),
  };

  const coutParType = [
    { name: "Réparations", value: 475000, color: "hsl(var(--primary))" },
    { name: "Préventif", value: 470000, color: "hsl(var(--chart-2))" },
    { name: "Rénovation", value: 850000, color: "hsl(var(--chart-3))" },
    { name: "Urgences", value: 150000, color: "hsl(var(--destructive))" },
  ];

  const evolutionMensuelle = [
    { mois: "Sep", interventions: 8, cout: 650000 },
    { mois: "Oct", interventions: 12, cout: 890000 },
    { mois: "Nov", interventions: 6, cout: 420000 },
    { mois: "Déc", interventions: 10, cout: 1200000 },
    { mois: "Jan", interventions: 6, cout: 1945000 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reparation": return Wrench;
      case "preventif": return CheckCircle;
      case "renovation": return Paintbrush;
      case "urgence": return AlertTriangle;
      default: return Hammer;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reparation": return "text-blue-500 bg-blue-500/10";
      case "preventif": return "text-green-500 bg-green-500/10";
      case "renovation": return "text-purple-500 bg-purple-500/10";
      case "urgence": return "text-red-500 bg-red-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const filteredMaintenances = maintenances.filter(m => {
    const matchSearch = m.titre.toLowerCase().includes(searchTerm.toLowerCase()) || m.localisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || m.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance & Travaux</h1>
          <p className="text-muted-foreground">Suivi des interventions et réparations</p>
        </div>
        <Button onClick={() => toast.success("Nouvelle demande créée")}>
          <Plus className="h-4 w-4 mr-2" />Nouvelle demande
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{stats.enAttente}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wrench className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En cours</p>
              <p className="text-2xl font-bold">{stats.enCours}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Terminées</p>
              <p className="text-2xl font-bold">{stats.terminees}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coût total</p>
              <p className="text-2xl font-bold">{(stats.coutTotal / 1000000).toFixed(2)}M F</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgences */}
      {maintenances.filter(m => m.type === "urgence" && m.statut !== "termine").length > 0 && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Interventions Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {maintenances.filter(m => m.type === "urgence" && m.statut !== "termine").map((m) => (
                <div key={m.id} className="flex-shrink-0 p-4 border border-red-500/30 rounded-lg bg-background min-w-[250px]">
                  <h3 className="font-medium mb-1">{m.titre}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{m.localisation}</span>
                  </div>
                  <Badge variant={m.statut === "en_cours" ? "default" : "secondary"}>
                    {m.statut === "en_cours" ? "En cours" : "En attente"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste des travaux</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Toutes les Interventions</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Intervention</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Coût</TableHead>
                    <TableHead>Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenances.map((maintenance) => {
                    const TypeIcon = getTypeIcon(maintenance.type);
                    return (
                      <TableRow key={maintenance.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{maintenance.titre}</p>
                            <p className="text-xs text-muted-foreground">Signalé le {maintenance.dateSignalement}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${getTypeColor(maintenance.type)}`}>
                            <TypeIcon className="h-3 w-3" />
                            <span className="text-xs capitalize">{maintenance.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {maintenance.localisation}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            maintenance.priorite === "haute" ? "destructive" :
                            maintenance.priorite === "moyenne" ? "secondary" : "outline"
                          }>
                            {maintenance.priorite}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            maintenance.statut === "termine" ? "default" :
                            maintenance.statut === "en_cours" ? "secondary" :
                            maintenance.statut === "reporte" ? "destructive" : "outline"
                          }>
                            {maintenance.statut.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {maintenance.cout ? `${(maintenance.cout / 1000).toFixed(0)}K F` : "-"}
                        </TableCell>
                        <TableCell>{maintenance.responsable || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={evolutionMensuelle}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="interventions" fill="hsl(var(--primary))" name="Interventions" />
                    <Bar yAxisId="right" dataKey="cout" fill="hsl(var(--chart-2))" name="Coût (FCFA)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Coûts</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={coutParType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${(value / 1000)}K`}
                    >
                      {coutParType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${(v / 1000).toFixed(0)}K FCFA`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Planning des Travaux</CardTitle>
              <CardDescription>Interventions programmées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenances.filter(m => m.datePrevue && m.statut !== "termine").map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(m.type)}`}>
                        {(() => { const Icon = getTypeIcon(m.type); return <Icon className="h-5 w-5" />; })()}
                      </div>
                      <div>
                        <p className="font-medium">{m.titre}</p>
                        <p className="text-sm text-muted-foreground">{m.localisation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{m.datePrevue}</span>
                      </div>
                      <Badge variant="outline" className="mt-1">{m.cout ? `${(m.cout / 1000).toFixed(0)}K F` : "À estimer"}</Badge>
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
};

export default MaintenancePage;
