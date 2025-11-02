import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Download, Plus, Eye, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data
const mockTransactions = [
  { id: 1, date: "2024-11-01", type: "Recette", category: "Scolarité", student: "Kouassi Jean", amount: 150000, method: "Espèces", status: "Payé" },
  { id: 2, date: "2024-11-01", type: "Recette", category: "Inscription", student: "Diallo Fatou", amount: 50000, method: "Mobile Money", status: "Payé" },
  { id: 3, date: "2024-11-02", type: "Dépense", category: "Fournitures", student: "-", amount: 75000, method: "Chèque", status: "Payé" },
  { id: 4, date: "2024-11-02", type: "Recette", category: "Cantine", student: "Traoré Yao", amount: 30000, method: "Espèces", status: "Payé" },
  { id: 5, date: "2024-11-03", type: "Dépense", category: "Salaires", student: "-", amount: 500000, method: "Virement", status: "Payé" },
  { id: 6, date: "2024-11-03", type: "Recette", category: "Transport", student: "Bamba Aya", amount: 25000, method: "Mobile Money", status: "En attente" },
];

const mockPendingPayments = [
  { id: 1, student: "Koné Serge", matricule: "66800005A", class: "2ndeC", amount: 150000, due: "2024-11-15", type: "Scolarité T1" },
  { id: 2, student: "Yao Martin", matricule: "66800006A", class: "1èreD", amount: 50000, due: "2024-11-10", type: "Bibliothèque" },
  { id: 3, student: "Coulibaly Marie", matricule: "66800007A", class: "TleA1", amount: 30000, due: "2024-11-20", type: "Cantine" },
];

export default function Finance() {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const totalRevenue = mockTransactions
    .filter(t => t.type === "Recette" && t.status === "Payé")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = mockTransactions
    .filter(t => t.type === "Dépense" && t.status === "Payé")
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingAmount = mockPendingPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion Financière</h1>
          <p className="text-muted-foreground">Suivi des recettes, dépenses et paiements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enregistrer une transaction</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recette">Recette</SelectItem>
                        <SelectItem value="depense">Dépense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scolarite">Scolarité</SelectItem>
                        <SelectItem value="inscription">Inscription</SelectItem>
                        <SelectItem value="cantine">Cantine</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="salaires">Salaires</SelectItem>
                        <SelectItem value="fournitures">Fournitures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Montant (FCFA)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mode de Paiement</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="especes">Espèces</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                        <SelectItem value="cheque">Chèque</SelectItem>
                        <SelectItem value="virement">Virement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Élève (pour recettes)</Label>
                  <Input placeholder="Nom de l'élève ou matricule" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Description de la transaction" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>Annuler</Button>
                  <Button onClick={() => setIsTransactionDialogOpen(false)}>Enregistrer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recettes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalExpense.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Net</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalRevenue - totalExpense).toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Bénéfice mensuel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingAmount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">{mockPendingPayments.length} élèves</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions et Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="pending">Paiements en Attente</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="flex items-center gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="recette">Recettes</SelectItem>
                    <SelectItem value="depense">Dépenses</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Rechercher..." className="max-w-sm" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "Recette" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="text-sm">{transaction.student}</TableCell>
                      <TableCell className="font-semibold">
                        {transaction.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="text-sm">{transaction.method}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === "Payé" ? "default" : "outline"}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom de l'Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPendingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.matricule}</TableCell>
                      <TableCell className="font-medium">{payment.student}</TableCell>
                      <TableCell>{payment.class}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell className="font-semibold text-orange-600">
                        {payment.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="font-mono text-sm">{payment.due}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Enregistrer Paiement
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="reports">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-semibold">Bilan Mensuel</h3>
                        <p className="text-sm text-muted-foreground">Générer le rapport du mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-semibold">Grand Livre</h3>
                        <p className="text-sm text-muted-foreground">Toutes les écritures</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-semibold">Balance</h3>
                        <p className="text-sm text-muted-foreground">État de la balance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
