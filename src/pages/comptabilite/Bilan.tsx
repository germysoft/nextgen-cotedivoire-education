import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, TrendingUp, TrendingDown, FileText, Download,
  PieChart as PieChartIcon, BarChart3, Calendar
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const balanceData = [
  { compte: "445100 - Scolarité", debit: 45000000, credit: 42800000, solde: 2200000, type: "Recette" },
  { compte: "625000 - Salaires", debit: 28500000, credit: 28500000, solde: 0, type: "Dépense" },
  { compte: "606100 - Fournitures", debit: 3200000, credit: 3100000, solde: 100000, type: "Dépense" },
  { compte: "445200 - Cantine", debit: 8500000, credit: 7800000, solde: 700000, type: "Recette" },
  { compte: "615000 - Entretien", debit: 2400000, credit: 2350000, solde: 50000, type: "Dépense" },
  { compte: "445300 - Transport", debit: 6200000, credit: 5900000, solde: 300000, type: "Recette" },
  { compte: "626000 - Charges sociales", debit: 5600000, credit: 5600000, solde: 0, type: "Dépense" },
];

const bilanActif = [
  { poste: "Immobilisations", valeur: 125000000, percent: 52 },
  { poste: "Stocks", valeur: 8500000, percent: 3.5 },
  { poste: "Créances Clients", valeur: 42000000, percent: 17.5 },
  { poste: "Trésorerie", valeur: 65000000, percent: 27 },
];

const bilanPassif = [
  { poste: "Capitaux Propres", valeur: 180000000, percent: 75 },
  { poste: "Provisions", valeur: 12000000, percent: 5 },
  { poste: "Dettes Fournisseurs", valeur: 28500000, percent: 11.9 },
  { poste: "Dettes Fiscales", valeur: 20000000, percent: 8.3 },
];

const evolutionData = [
  { mois: "Jan", recettes: 52, depenses: 38, resultat: 14 },
  { mois: "Fév", recettes: 48, depenses: 42, resultat: 6 },
  { mois: "Mar", recettes: 55, depenses: 40, resultat: 15 },
  { mois: "Avr", recettes: 58, depenses: 43, resultat: 15 },
  { mois: "Mai", recettes: 51, depenses: 39, resultat: 12 },
  { mois: "Juin", recettes: 63, depenses: 45, resultat: 18 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function Bilan() {
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("T1");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [dateDebut, setDateDebut] = useState("2024-01-01");
  const [dateFin, setDateFin] = useState("2024-12-31");

  const totalActif = bilanActif.reduce((sum, item) => sum + item.valeur, 0);
  const totalPassif = bilanPassif.reduce((sum, item) => sum + item.valeur, 0);
  const totalRecettes = balanceData.filter(b => b.type === "Recette").reduce((sum, b) => sum + b.debit, 0);
  const totalDepenses = balanceData.filter(b => b.type === "Dépense").reduce((sum, b) => sum + b.debit, 0);
  const resultat = totalRecettes - totalDepenses;

  const handleApplyPeriod = () => {
    setIsPeriodDialogOpen(false);
    toast.success(`Période appliquée: ${selectedPeriod} ${selectedYear}`);
  };

  const handleExportBilan = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("BILAN COMPTABLE", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Période: ${selectedPeriod} ${selectedYear}`, 105, 30, { align: "center" });
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 105, 38, { align: "center" });
    
    // Summary
    doc.setFontSize(14);
    doc.text("RÉSUMÉ FINANCIER", 14, 55);
    doc.setFontSize(11);
    doc.text(`Total Actif: ${(totalActif / 1000000).toFixed(1)}M FCFA`, 14, 65);
    doc.text(`Total Passif: ${(totalPassif / 1000000).toFixed(1)}M FCFA`, 14, 73);
    doc.text(`Résultat Net: ${(resultat / 1000000).toFixed(1)}M FCFA`, 14, 81);
    doc.text(`Marge Nette: ${((resultat / totalRecettes) * 100).toFixed(1)}%`, 14, 89);
    
    // Balance table
    doc.setFontSize(14);
    doc.text("BALANCE GÉNÉRALE", 14, 105);
    
    autoTable(doc, {
      head: [['Compte', 'Débit (M)', 'Crédit (M)', 'Solde (M)', 'Type']],
      body: balanceData.map(b => [
        b.compte,
        (b.debit / 1000000).toFixed(2),
        (b.credit / 1000000).toFixed(2),
        (b.solde / 1000000).toFixed(2),
        b.type
      ]),
      startY: 110,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Actif table
    const yPosActif = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("ACTIF", 14, yPosActif);
    
    autoTable(doc, {
      head: [['Poste', 'Valeur (M)', '%']],
      body: [...bilanActif.map(a => [
        a.poste,
        (a.valeur / 1000000).toFixed(1),
        `${a.percent}%`
      ]), ['TOTAL ACTIF', (totalActif / 1000000).toFixed(1), '100%']],
      startY: yPosActif + 5,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 197, 94] }
    });
    
    // Passif table
    const yPosPassif = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("PASSIF", 14, yPosPassif);
    
    autoTable(doc, {
      head: [['Poste', 'Valeur (M)', '%']],
      body: [...bilanPassif.map(p => [
        p.poste,
        (p.valeur / 1000000).toFixed(1),
        `${p.percent}%`
      ]), ['TOTAL PASSIF', (totalPassif / 1000000).toFixed(1), '100%']],
      startY: yPosPassif + 5,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save(`bilan-comptable-${selectedPeriod}-${selectedYear}.pdf`);
    toast.success("Bilan comptable exporté en PDF");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Balance & Bilan</h1>
          <p className="text-muted-foreground">Analyse comptable et situation financière - {selectedPeriod} {selectedYear}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPeriodDialogOpen} onOpenChange={setIsPeriodDialogOpen}>
            <Button variant="outline" onClick={() => setIsPeriodDialogOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Période
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sélectionner la Période</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Année</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Période</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T1">Trimestre 1</SelectItem>
                        <SelectItem value="T2">Trimestre 2</SelectItem>
                        <SelectItem value="T3">Trimestre 3</SelectItem>
                        <SelectItem value="T4">Trimestre 4</SelectItem>
                        <SelectItem value="Annuel">Année complète</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date début</Label>
                    <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date fin</Label>
                    <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPeriodDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleApplyPeriod}>Appliquer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExportBilan}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actif</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalActif / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Passif</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalPassif / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résultat Net</CardTitle>
            {resultat > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${resultat > 0 ? "text-green-600" : "text-red-600"}`}>
              {(resultat / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">FCFA ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge Nette</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((resultat / totalRecettes) * 100).toFixed(1)}%</div>
            <p className="text-xs text-green-600">+3.2% vs T précédent</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="balance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="balance">Balance Générale</TabsTrigger>
          <TabsTrigger value="bilan">Bilan Comptable</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Balance des Comptes</CardTitle>
              <CardDescription>Situation de tous les comptes au {new Date().toLocaleDateString('fr-FR')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compte</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                    <TableHead className="text-right">Solde</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceData.map((compte, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{compte.compte}</TableCell>
                      <TableCell className="text-right">{(compte.debit / 1000000).toFixed(2)}M</TableCell>
                      <TableCell className="text-right">{(compte.credit / 1000000).toFixed(2)}M</TableCell>
                      <TableCell className={`text-right font-semibold ${
                        compte.solde > 0 ? "text-green-600" : compte.solde < 0 ? "text-red-600" : ""
                      }`}>
                        {(compte.solde / 1000000).toFixed(2)}M
                      </TableCell>
                      <TableCell>
                        <Badge variant={compte.type === "Recette" ? "default" : "secondary"}>
                          {compte.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">
                      {(balanceData.reduce((sum, c) => sum + c.debit, 0) / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-right">
                      {(balanceData.reduce((sum, c) => sum + c.credit, 0) / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {(balanceData.reduce((sum, c) => sum + c.solde, 0) / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bilan" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  ACTIF
                </CardTitle>
                <CardDescription>Ce que possède l'établissement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={bilanActif}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ poste, percent }) => `${poste} ${percent}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="valeur"
                      >
                        {bilanActif.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {bilanActif.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: COLORS[idx] }} />
                          <span className="font-medium">{item.poste}</span>
                        </div>
                        <span className="text-lg font-bold">{(item.valeur / 1000000).toFixed(1)}M</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border-2 border-green-500">
                      <span className="font-bold text-green-900">TOTAL ACTIF</span>
                      <span className="text-lg font-bold text-green-600">
                        {(totalActif / 1000000).toFixed(1)}M FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  PASSIF
                </CardTitle>
                <CardDescription>Ce que doit l'établissement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={bilanPassif}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ poste, percent }) => `${poste} ${percent}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="valeur"
                      >
                        {bilanPassif.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {bilanPassif.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: COLORS[idx] }} />
                          <span className="font-medium">{item.poste}</span>
                        </div>
                        <span className="text-lg font-bold">{(item.valeur / 1000000).toFixed(1)}M</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border-2 border-blue-500">
                      <span className="font-bold text-blue-900">TOTAL PASSIF</span>
                      <span className="text-lg font-bold text-blue-600">
                        {(totalPassif / 1000000).toFixed(1)}M FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Financière Mensuelle</CardTitle>
              <CardDescription>Recettes, dépenses et résultat sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="mois" />
                  <YAxis label={{ value: 'Millions FCFA', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${value}M FCFA`} />
                  <Line type="monotone" dataKey="recettes" stroke="hsl(var(--primary))" strokeWidth={2} name="Recettes" />
                  <Line type="monotone" dataKey="depenses" stroke="hsl(var(--destructive))" strokeWidth={2} name="Dépenses" />
                  <Line type="monotone" dataKey="resultat" stroke="hsl(var(--accent))" strokeWidth={3} name="Résultat" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recettes Moyennes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {(evolutionData.reduce((sum, m) => sum + m.recettes, 0) / evolutionData.length).toFixed(1)}M
                </div>
                <p className="text-sm text-muted-foreground">FCFA / mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dépenses Moyennes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {(evolutionData.reduce((sum, m) => sum + m.depenses, 0) / evolutionData.length).toFixed(1)}M
                </div>
                <p className="text-sm text-muted-foreground">FCFA / mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Résultat Moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {(evolutionData.reduce((sum, m) => sum + m.resultat, 0) / evolutionData.length).toFixed(1)}M
                </div>
                <p className="text-sm text-muted-foreground">FCFA / mois</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
