import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, AlertCircle, CheckCircle, Clock, Send, Bell, TrendingUp, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTableFilters } from "@/components/data-table/DataTableFilters";
import { DataTableExport } from "@/components/data-table/DataTableExport";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

// Mock data for payment deadlines
const echeances = [
  { id: 1, eleve: "Kouamé Aya", classe: "6ème A", montantTotal: 450000, montantPaye: 150000, prochaineMensualite: 75000, dateEcheance: "2024-02-15", statut: "en_cours", retard: 0 },
  { id: 2, eleve: "Traoré Ibrahim", classe: "5ème B", montantTotal: 450000, montantPaye: 300000, prochaineMensualite: 75000, dateEcheance: "2024-02-10", statut: "retard", retard: 5 },
  { id: 3, eleve: "Bamba Fatou", classe: "4ème A", montantTotal: 500000, montantPaye: 500000, prochaineMensualite: 0, dateEcheance: "-", statut: "solde", retard: 0 },
  { id: 4, eleve: "Koné Mamadou", classe: "3ème C", montantTotal: 550000, montantPaye: 137500, prochaineMensualite: 137500, dateEcheance: "2024-02-20", statut: "en_cours", retard: 0 },
  { id: 5, eleve: "Diabaté Aminata", classe: "6ème B", montantTotal: 450000, montantPaye: 75000, prochaineMensualite: 75000, dateEcheance: "2024-01-30", statut: "critique", retard: 16 },
  { id: 6, eleve: "Ouattara Seydou", classe: "5ème A", montantTotal: 450000, montantPaye: 225000, prochaineMensualite: 75000, dateEcheance: "2024-02-25", statut: "en_cours", retard: 0 },
  { id: 7, eleve: "Sanogo Mariam", classe: "4ème B", montantTotal: 500000, montantPaye: 0, prochaineMensualite: 125000, dateEcheance: "2024-01-15", statut: "critique", retard: 31 },
  { id: 8, eleve: "Coulibaly Adama", classe: "3ème A", montantTotal: 550000, montantPaye: 412500, prochaineMensualite: 137500, dateEcheance: "2024-03-01", statut: "en_cours", retard: 0 },
];

const calendrierMensuel = [
  { mois: "Septembre", echeance: "30/09", montantAttendu: 2800000, montantRecu: 2650000, tauxRecouvrement: 94.6 },
  { mois: "Octobre", echeance: "31/10", montantAttendu: 2800000, montantRecu: 2520000, tauxRecouvrement: 90.0 },
  { mois: "Novembre", echeance: "30/11", montantAttendu: 2800000, montantRecu: 2380000, tauxRecouvrement: 85.0 },
  { mois: "Décembre", echeance: "31/12", montantAttendu: 2800000, montantRecu: 2100000, tauxRecouvrement: 75.0 },
  { mois: "Janvier", echeance: "31/01", montantAttendu: 2800000, montantRecu: 1960000, tauxRecouvrement: 70.0 },
  { mois: "Février", echeance: "28/02", montantAttendu: 2800000, montantRecu: 0, tauxRecouvrement: 0 },
];

const evolutionRecouvrement = [
  { mois: "Sep", prevu: 2.8, reel: 2.65 },
  { mois: "Oct", prevu: 2.8, reel: 2.52 },
  { mois: "Nov", prevu: 2.8, reel: 2.38 },
  { mois: "Dec", prevu: 2.8, reel: 2.10 },
  { mois: "Jan", prevu: 2.8, reel: 1.96 },
  { mois: "Fev", prevu: 2.8, reel: 1.20 },
];

const repartitionStatut = [
  { name: "Soldé", value: 35, color: "#22c55e" },
  { name: "En cours", value: 45, color: "#3b82f6" },
  { name: "En retard", value: 12, color: "#f59e0b" },
  { name: "Critique", value: 8, color: "#ef4444" },
];

const filterConfigs = [
  {
    key: "statut",
    label: "Statut",
    type: "select" as const,
    options: [
      { value: "all", label: "Tous les statuts" },
      { value: "solde", label: "Soldé" },
      { value: "en_cours", label: "En cours" },
      { value: "retard", label: "En retard" },
      { value: "critique", label: "Critique" },
    ],
  },
  {
    key: "classe",
    label: "Classe",
    type: "select" as const,
    options: [
      { value: "all", label: "Toutes les classes" },
      { value: "6ème", label: "6ème" },
      { value: "5ème", label: "5ème" },
      { value: "4ème", label: "4ème" },
      { value: "3ème", label: "3ème" },
    ],
  },
];

const exportColumns = [
  { key: "eleve", label: "Élève" },
  { key: "classe", label: "Classe" },
  { key: "montantTotal", label: "Montant Total" },
  { key: "montantPaye", label: "Montant Payé" },
  { key: "prochaineMensualite", label: "Prochaine Mensualité" },
  { key: "dateEcheance", label: "Date Échéance" },
  { key: "statut", label: "Statut" },
];

export default function EcheancesPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedEcheances, setSelectedEcheances] = useState<number[]>([]);
  const [showRappelDialog, setShowRappelDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  const filteredEcheances = echeances.filter((e) => {
    if (filters.statut && filters.statut !== "all" && e.statut !== filters.statut) return false;
    if (filters.classe && filters.classe !== "all" && !e.classe.includes(filters.classe)) return false;
    return true;
  });

  const totalAttendu = echeances.reduce((sum, e) => sum + e.montantTotal, 0);
  const totalPaye = echeances.reduce((sum, e) => sum + e.montantPaye, 0);
  const aEchoir = echeances.filter(e => e.statut === "en_cours").length;
  const enRetard = echeances.filter(e => e.statut === "retard" || e.statut === "critique").length;

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "solde":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Soldé</Badge>;
      case "en_cours":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">En cours</Badge>;
      case "retard":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">En retard</Badge>;
      case "critique":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Critique</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const handleSendRappel = () => {
    toast.success(`Rappels envoyés à ${selectedEcheances.length} parents`);
    setSelectedEcheances([]);
    setShowRappelDialog(false);
  };

  const handleCreatePlan = () => {
    toast.success("Plan de paiement créé avec succès");
    setShowPlanDialog(false);
  };

  const toggleSelection = (id: number) => {
    setSelectedEcheances(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi des Échéances</h1>
          <p className="text-muted-foreground mt-2">
            Calendrier des paiements et suivi des échéances scolaires
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showRappelDialog} onOpenChange={setShowRappelDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={selectedEcheances.length === 0}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer Rappels ({selectedEcheances.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Envoyer des rappels de paiement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Vous allez envoyer un rappel de paiement à {selectedEcheances.length} parent(s).
                </p>
                <div className="space-y-2">
                  <Label>Canal d'envoi</Label>
                  <Select defaultValue="both">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS uniquement</SelectItem>
                      <SelectItem value="email">Email uniquement</SelectItem>
                      <SelectItem value="both">SMS + Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Message personnalisé (optionnel)</Label>
                  <Input placeholder="Ajoutez un message personnalisé..." />
                </div>
                <Button onClick={handleSendRappel} className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Envoyer les rappels
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer Plan de Paiement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer un plan de paiement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Élève</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {echeances.filter(e => e.statut !== "solde").map(e => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.eleve}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Montant restant</Label>
                  <Input type="number" placeholder="0" disabled value="300000" />
                </div>
                <div className="space-y-2">
                  <Label>Nombre de mensualités</Label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 mensualités</SelectItem>
                      <SelectItem value="3">3 mensualités</SelectItem>
                      <SelectItem value="4">4 mensualités</SelectItem>
                      <SelectItem value="6">6 mensualités</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input type="date" defaultValue="2024-02-15" />
                </div>
                <Button onClick={handleCreatePlan} className="w-full">
                  Créer le plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Attendu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalAttendu / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">FCFA cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Encaissé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{(totalPaye / 1000000).toFixed(1)}M</div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{((totalPaye / totalAttendu) * 100).toFixed(1)}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">À Échoir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{aEchoir}</div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">paiements ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{enRetard}</div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">élèves concernés</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="echeances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="echeances">Échéances Élèves</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier Mensuel</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="echeances">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Échéances</CardTitle>
                <div className="flex items-center gap-2">
                  <DataTableFilters
                    filters={filterConfigs}
                    onFilterChange={setFilters}
                  />
                  <DataTableExport
                    data={filteredEcheances}
                    columns={exportColumns}
                    filename="echeances-paiements"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEcheances(filteredEcheances.filter(e => e.statut !== "solde").map(e => e.id));
                          } else {
                            setSelectedEcheances([]);
                          }
                        }}
                        checked={selectedEcheances.length === filteredEcheances.filter(e => e.statut !== "solde").length}
                      />
                    </TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-right">Montant Total</TableHead>
                    <TableHead className="text-right">Payé</TableHead>
                    <TableHead className="text-right">Prochaine Éch.</TableHead>
                    <TableHead>Date Échéance</TableHead>
                    <TableHead>Retard</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEcheances.map((echeance) => (
                    <TableRow key={echeance.id}>
                      <TableCell>
                        {echeance.statut !== "solde" && (
                          <input
                            type="checkbox"
                            checked={selectedEcheances.includes(echeance.id)}
                            onChange={() => toggleSelection(echeance.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{echeance.eleve}</TableCell>
                      <TableCell>{echeance.classe}</TableCell>
                      <TableCell className="text-right">{echeance.montantTotal.toLocaleString()} F</TableCell>
                      <TableCell className="text-right">{echeance.montantPaye.toLocaleString()} F</TableCell>
                      <TableCell className="text-right">
                        {echeance.prochaineMensualite > 0 ? `${echeance.prochaineMensualite.toLocaleString()} F` : "-"}
                      </TableCell>
                      <TableCell>{echeance.dateEcheance}</TableCell>
                      <TableCell>
                        {echeance.retard > 0 ? (
                          <span className="text-red-600 font-medium">{echeance.retard} jours</span>
                        ) : (
                          <span className="text-green-600">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatutBadge(echeance.statut)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="calendrier">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des Échéances Mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead>Date Limite</TableHead>
                    <TableHead className="text-right">Montant Attendu</TableHead>
                    <TableHead className="text-right">Montant Reçu</TableHead>
                    <TableHead className="text-right">Taux Recouvrement</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calendrierMensuel.map((mois, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{mois.mois}</TableCell>
                      <TableCell>{mois.echeance}</TableCell>
                      <TableCell className="text-right">{mois.montantAttendu.toLocaleString()} F</TableCell>
                      <TableCell className="text-right">{mois.montantRecu.toLocaleString()} F</TableCell>
                      <TableCell className="text-right">
                        <span className={mois.tauxRecouvrement >= 90 ? "text-green-600" : mois.tauxRecouvrement >= 70 ? "text-yellow-600" : "text-red-600"}>
                          {mois.tauxRecouvrement}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {mois.tauxRecouvrement === 0 ? (
                          <Badge variant="outline">En attente</Badge>
                        ) : mois.tauxRecouvrement >= 90 ? (
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        ) : mois.tauxRecouvrement >= 70 ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Faible</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={repartitionStatut}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {repartitionStatut.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution du Recouvrement (M FCFA)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionRecouvrement}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="prevu" stroke="#3b82f6" name="Prévu" strokeWidth={2} />
                      <Line type="monotone" dataKey="reel" stroke="#22c55e" name="Réel" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
