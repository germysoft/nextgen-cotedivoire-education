import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard,
  Download,
  Receipt,
  Wallet,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  Smartphone,
  Building2,
  Banknote,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock data
const mockStudent = {
  matricule: "66800001A",
  name: "Kouassi Jean-Marc",
  class: "6ème A"
};

const fraisScolarite = {
  inscription: 50000,
  scolariteAnnuelle: 450000,
  cantine: 35000 * 9,
  transport: 25000 * 9,
  bibliotheque: 15000,
  assurance: 10000,
  total: 50000 + 450000 + (35000 * 9) + (25000 * 9) + 15000 + 10000
};

const paiementsEffectues = [
  { id: 1, date: "2024-09-05", type: "Inscription", montant: 50000, statut: "Payé", methode: "Mobile Money", reference: "PAY-2024-001", recu: true },
  { id: 2, date: "2024-09-15", type: "Scolarité 1er Trim.", montant: 150000, statut: "Payé", methode: "Virement", reference: "PAY-2024-002", recu: true },
  { id: 3, date: "2024-10-01", type: "Cantine - Oct.", montant: 35000, statut: "Payé", methode: "Espèces", reference: "PAY-2024-003", recu: true },
  { id: 4, date: "2024-10-01", type: "Transport - Oct.", montant: 25000, statut: "Payé", methode: "Mobile Money", reference: "PAY-2024-004", recu: true },
  { id: 5, date: "2024-10-15", type: "Bibliothèque", montant: 15000, statut: "Payé", methode: "Espèces", reference: "PAY-2024-005", recu: true },
  { id: 6, date: "2024-11-01", type: "Cantine - Nov.", montant: 35000, statut: "Payé", methode: "Mobile Money", reference: "PAY-2024-006", recu: true },
  { id: 7, date: "2024-11-01", type: "Transport - Nov.", montant: 25000, statut: "Payé", methode: "Mobile Money", reference: "PAY-2024-007", recu: true },
];

const echeancesAVenir = [
  { id: 1, date: "2024-12-01", type: "Cantine - Déc.", montant: 35000, statut: "À payer" },
  { id: 2, date: "2024-12-01", type: "Transport - Déc.", montant: 25000, statut: "À payer" },
  { id: 3, date: "2024-12-15", type: "Scolarité 2ème Trim.", montant: 150000, statut: "À payer" },
  { id: 4, date: "2025-01-01", type: "Cantine - Jan.", montant: 35000, statut: "À venir" },
  { id: 5, date: "2025-01-01", type: "Transport - Jan.", montant: 25000, statut: "À venir" },
];

const evolutionPaiements = [
  { mois: "Sept", montant: 200000, cumul: 200000 },
  { mois: "Oct", montant: 75000, cumul: 275000 },
  { mois: "Nov", montant: 60000, cumul: 335000 },
  { mois: "Déc", montant: 0, cumul: 335000 },
];

const repartitionFrais = [
  { name: "Scolarité", value: 450000, color: "hsl(var(--primary))" },
  { name: "Cantine", value: 315000, color: "hsl(var(--success))" },
  { name: "Transport", value: 225000, color: "hsl(var(--warning))" },
  { name: "Autres", value: 75000, color: "hsl(var(--muted))" },
];

export default function PaiementsParents() {
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedEcheance, setSelectedEcheance] = useState<typeof echeancesAVenir[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const totalPaye = paiementsEffectues.reduce((acc, p) => acc + p.montant, 0);
  const totalRestant = fraisScolarite.total - totalPaye;
  const progressPaiement = (totalPaye / fraisScolarite.total) * 100;

  const handlePayer = (echeance: typeof echeancesAVenir[0]) => {
    setSelectedEcheance(echeance);
    setPaymentDialog(true);
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod) {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }
    toast.success("Redirection vers la page de paiement...");
    setPaymentDialog(false);
    setPaymentMethod("");
  };

  const handleDownloadRecu = (reference: string) => {
    toast.success(`Téléchargement du reçu ${reference}...`);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Mobile Money": return <Smartphone className="h-4 w-4" />;
      case "Virement": return <Building2 className="h-4 w-4" />;
      case "Espèces": return <Banknote className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            Paiements & Frais de Scolarité
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des paiements pour {mockStudent.name} - {mockStudent.class}
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Télécharger le relevé
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Annuel</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fraisScolarite.total.toLocaleString('fr-FR')} F
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Année scolaire 2023-2024
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payé</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {totalPaye.toLocaleString('fr-FR')} F
            </div>
            <Progress value={progressPaiement} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progressPaiement.toFixed(0)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reste à Payer</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {totalRestant.toLocaleString('fr-FR')} F
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur {echeancesAVenir.length} échéances
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaine Échéance</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {echeancesAVenir[0]?.montant.toLocaleString('fr-FR')} F
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {echeancesAVenir[0]?.type} - {format(new Date(echeancesAVenir[0]?.date), "dd/MM/yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="historique" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="historique" className="flex items-center gap-2 py-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="echeances" className="flex items-center gap-2 py-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Échéances</span>
          </TabsTrigger>
          <TabsTrigger value="detail" className="flex items-center gap-2 py-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Détail Frais</span>
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="flex items-center gap-2 py-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Statistiques</span>
          </TabsTrigger>
        </TabsList>

        {/* Historique Tab */}
        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Liste de tous les paiements effectués</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paiementsEffectues.map((paiement) => (
                    <TableRow key={paiement.id}>
                      <TableCell className="font-medium">
                        {format(new Date(paiement.date), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>{paiement.type}</TableCell>
                      <TableCell className="font-mono text-sm">{paiement.reference}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(paiement.methode)}
                          {paiement.methode}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {paiement.montant.toLocaleString('fr-FR')} F
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {paiement.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {paiement.recu && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadRecu(paiement.reference)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Reçu
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 bg-muted/30 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total des paiements</span>
                  <span className="text-2xl font-bold text-success">
                    {totalPaye.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Échéances Tab */}
        <TabsContent value="echeances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Échéances à Venir</CardTitle>
              <CardDescription>Paiements programmés pour l'année scolaire</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {echeancesAVenir.map((echeance) => (
                    <TableRow key={echeance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(echeance.date), "dd/MM/yyyy", { locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell>{echeance.type}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {echeance.montant.toLocaleString('fr-FR')} F
                      </TableCell>
                      <TableCell className="text-center">
                        {echeance.statut === "À payer" ? (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {echeance.statut}
                          </Badge>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {echeance.statut}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {echeance.statut === "À payer" && (
                          <Button 
                            size="sm"
                            onClick={() => handlePayer(echeance)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 bg-warning/10 border-t border-warning/20">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-warning">Total restant à payer</span>
                  <span className="text-2xl font-bold text-warning">
                    {totalRestant.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Détail Frais Tab */}
        <TabsContent value="detail" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Détail des Frais de Scolarité</CardTitle>
                <CardDescription>Année scolaire 2023-2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span>Frais d'inscription</span>
                    <span className="font-bold">{fraisScolarite.inscription.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span>Scolarité annuelle</span>
                    <span className="font-bold">{fraisScolarite.scolariteAnnuelle.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span>Cantine (9 mois)</span>
                    <span className="font-bold">{fraisScolarite.cantine.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span>Transport (9 mois)</span>
                    <span className="font-bold">{fraisScolarite.transport.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span>Bibliothèque</span>
                    <span className="font-bold">{fraisScolarite.bibliotheque.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span>Assurance scolaire</span>
                    <span className="font-bold">{fraisScolarite.assurance.toLocaleString('fr-FR')} F</span>
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Total annuel</span>
                    <span className="font-bold text-primary">
                      {fraisScolarite.total.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Frais</CardTitle>
                <CardDescription>Par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={repartitionFrais}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {repartitionFrais.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `${value.toLocaleString('fr-FR')} F`}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statistiques Tab */}
        <TabsContent value="statistiques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Paiements</CardTitle>
              <CardDescription>Cumul des paiements au fil des mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evolutionPaiements}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => `${value.toLocaleString('fr-FR')} F`}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cumul" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                      name="Cumul payé"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="montant" 
                      stroke="hsl(var(--success))" 
                      fill="hsl(var(--success))" 
                      fillOpacity={0.3}
                      name="Paiement mensuel"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-success">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progression</p>
                    <p className="text-2xl font-bold text-success">{progressPaiement.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">du total annuel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nb. Paiements</p>
                    <p className="text-2xl font-bold">{paiementsEffectues.length}</p>
                    <p className="text-xs text-muted-foreground">transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Échéances</p>
                    <p className="text-2xl font-bold text-warning">{echeancesAVenir.length}</p>
                    <p className="text-xs text-muted-foreground">restantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de paiement */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Effectuer un Paiement</DialogTitle>
            <DialogDescription>
              {selectedEcheance && (
                <>{selectedEcheance.type} - {selectedEcheance.montant.toLocaleString('fr-FR')} FCFA</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Montant à payer</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedEcheance?.montant.toLocaleString('fr-FR')} F
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile-money">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money (Orange/MTN/Moov)
                    </div>
                  </SelectItem>
                  <SelectItem value="carte">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Carte Bancaire
                    </div>
                  </SelectItem>
                  <SelectItem value="virement">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Virement Bancaire
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === "mobile-money" && (
              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <Input placeholder="+225 07 XX XX XX XX" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmPayment}>
              <CreditCard className="h-4 w-4 mr-2" />
              Procéder au paiement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
