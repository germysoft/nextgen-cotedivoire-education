import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DataTableFilters, FilterConfig } from "@/components/data-table/DataTableFilters";
import { DataTableExport } from "@/components/data-table/DataTableExport";
import { toast } from "sonner";

const paiements = [
  { id: 1, eleve: "KOUAME Koffi", classe: "6ème A", matricule: "2024001", montant_du: 500000, montant_paye: 500000, statut: "Soldé", date_dernier_paiement: "2024-11-15" },
  { id: 2, eleve: "DIALLO Aissatou", classe: "5ème B", matricule: "2024002", montant_du: 500000, montant_paye: 300000, statut: "Partiel", date_dernier_paiement: "2024-10-20" },
  { id: 3, eleve: "TRAORE Mohamed", classe: "4ème A", matricule: "2024003", montant_du: 500000, montant_paye: 0, statut: "Impayé", date_dernier_paiement: "-" },
  { id: 4, eleve: "KONE Aminata", classe: "3ème C", matricule: "2024004", montant_du: 550000, montant_paye: 550000, statut: "Soldé", date_dernier_paiement: "2024-11-30" },
  { id: 5, eleve: "BAMBA Franck", classe: "Terminale S", matricule: "2024005", montant_du: 600000, montant_paye: 200000, statut: "Partiel", date_dernier_paiement: "2024-09-15" },
];

const statistiques = [
  { categorie: "Soldés", nombre: 280, montant: 140000000, couleur: "hsl(var(--chart-1))" },
  { categorie: "Partiels", nombre: 120, montant: 36000000, couleur: "hsl(var(--chart-2))" },
  { categorie: "Impayés", nombre: 65, montant: 0, couleur: "hsl(var(--destructive))" },
];

const evolutionMensuelle = [
  { mois: "Sep", montant: 25000000 },
  { mois: "Oct", montant: 32000000 },
  { mois: "Nov", montant: 28000000 },
  { mois: "Déc", montant: 35000000 },
  { mois: "Jan", montant: 30000000 },
  { mois: "Fév", montant: 26000000 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--destructive))'];

const filterConfigs: FilterConfig[] = [
  {
    key: "statut",
    label: "Statut",
    type: "select",
    options: [
      { value: "Soldé", label: "Soldé" },
      { value: "Partiel", label: "Partiel" },
      { value: "Impayé", label: "Impayé" },
    ],
  },
  {
    key: "classe",
    label: "Classe",
    type: "select",
    options: [
      { value: "6ème A", label: "6ème A" },
      { value: "5ème B", label: "5ème B" },
      { value: "4ème A", label: "4ème A" },
      { value: "3ème C", label: "3ème C" },
      { value: "Terminale S", label: "Terminale S" },
    ],
  },
  {
    key: "montantMin",
    label: "Montant minimum",
    type: "number",
  },
];

const exportColumns = [
  { key: "matricule", label: "Matricule" },
  { key: "eleve", label: "Élève" },
  { key: "classe", label: "Classe" },
  { key: "montant_du", label: "Montant Dû (FCFA)" },
  { key: "montant_paye", label: "Montant Payé (FCFA)" },
  { key: "statut", label: "Statut" },
  { key: "date_dernier_paiement", label: "Dernier Paiement" },
];

const Paiements = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewPaiement = () => {
    toast.success("Paiement enregistré avec succès. Reçu généré.");
    setIsDialogOpen(false);
  };

  const totalDu = paiements.reduce((sum, p) => sum + p.montant_du, 0);
  const totalPaye = paiements.reduce((sum, p) => sum + p.montant_paye, 0);
  const totalRestant = totalDu - totalPaye;
  const tauxRecouvrement = ((totalPaye / totalDu) * 100).toFixed(1);

  const filteredPaiements = paiements.filter(p => {
    if (filters.search && 
        !p.eleve.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.matricule.includes(filters.search)) {
      return false;
    }
    if (filters.statut && p.statut !== filters.statut) {
      return false;
    }
    if (filters.classe && p.classe !== filters.classe) {
      return false;
    }
    if (filters.montantMin && p.montant_du < Number(filters.montantMin)) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gestion des Paiements</h1>
          <p className="text-muted-foreground mt-2">Suivi des frais de scolarité et paiements des élèves</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enregistrer un Paiement</DialogTitle>
              <DialogDescription>Saisir les informations du paiement</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matricule Élève</Label>
                  <Input placeholder="2024001" />
                </div>
                <div className="space-y-2">
                  <Label>Élève</Label>
                  <Input disabled value="KOUAME Koffi - 6ème A" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type de Frais</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scolarite">Scolarité</SelectItem>
                      <SelectItem value="inscription">Inscription</SelectItem>
                      <SelectItem value="cantine">Cantine</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Montant (FCFA)</Label>
                  <Input type="number" placeholder="50000" />
                </div>
                <div className="space-y-2">
                  <Label>Mode de Paiement</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                      <SelectItem value="virement">Virement</SelectItem>
                      <SelectItem value="cheque">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observation</Label>
                <Input placeholder="Notes additionnelles..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleNewPaiement}>Enregistrer & Imprimer Reçu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDu.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">Année 2024-2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Encaissé</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPaye.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">Taux: {tauxRecouvrement}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reste à Recouvrer</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalRestant.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">{((totalRestant/totalDu)*100).toFixed(1)}% du total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves à Jour</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">280</div>
            <p className="text-xs text-muted-foreground">60% de l'effectif</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste des Paiements</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Suivi des Paiements Élèves</CardTitle>
                  <CardDescription>Liste complète avec statuts</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DataTableFilters
                    filters={filterConfigs}
                    onFilterChange={setFilters}
                    searchPlaceholder="Rechercher un élève..."
                  />
                  <DataTableExport
                    data={filteredPaiements}
                    columns={exportColumns}
                    filename="paiements-scolarite"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Montant Dû</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Reste</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernier Paiement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaiements.map((paiement) => {
                    const reste = paiement.montant_du - paiement.montant_paye;
                    return (
                      <TableRow key={paiement.id}>
                        <TableCell className="font-mono text-xs">{paiement.matricule}</TableCell>
                        <TableCell className="font-medium">{paiement.eleve}</TableCell>
                        <TableCell>{paiement.classe}</TableCell>
                        <TableCell>{paiement.montant_du.toLocaleString()} F</TableCell>
                        <TableCell className="text-green-600 font-medium">{paiement.montant_paye.toLocaleString()} F</TableCell>
                        <TableCell className={reste > 0 ? "text-orange-600 font-medium" : ""}>
                          {reste.toLocaleString()} F
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            paiement.statut === "Soldé" ? "default" :
                            paiement.statut === "Partiel" ? "secondary" :
                            "destructive"
                          }>
                            {paiement.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{paiement.date_dernier_paiement}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">Payer</Button>
                            <Button variant="ghost" size="sm">Reçu</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Statut</CardTitle>
                <CardDescription>Distribution des paiements</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statistiques}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categorie, nombre }) => `${categorie}: ${nombre}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="nombre"
                    >
                      {statistiques.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails par Catégorie</CardTitle>
                <CardDescription>Nombre d'élèves et montants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 mt-4">
                  {statistiques.map((stat, index) => (
                    <div key={stat.categorie} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.couleur }} />
                          <span className="font-medium">{stat.categorie}</span>
                        </div>
                        <span className="text-sm font-medium">{stat.nombre} élèves</span>
                      </div>
                      <div className="text-2xl font-bold">{stat.montant.toLocaleString()} FCFA</div>
                      <div className="text-xs text-muted-foreground">
                        {((stat.nombre / paiements.length) * 100).toFixed(0)}% de l'effectif
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle des Encaissements</CardTitle>
              <CardDescription>Suivi des paiements par mois</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionMensuelle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="montant" fill="hsl(var(--primary))" name="Montant Encaissé (FCFA)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Paiements;
