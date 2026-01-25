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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTableExport } from "@/components/data-table/DataTableExport";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Mock data
const initialTransactions = [
  { id: 1, date: "2024-11-01", type: "Recette", category: "Scolarité", student: "Kouassi Jean", amount: 150000, method: "Espèces", status: "Payé" },
  { id: 2, date: "2024-11-01", type: "Recette", category: "Inscription", student: "Diallo Fatou", amount: 50000, method: "Mobile Money", status: "Payé" },
  { id: 3, date: "2024-11-02", type: "Dépense", category: "Fournitures", student: "-", amount: 75000, method: "Chèque", status: "Payé" },
  { id: 4, date: "2024-11-02", type: "Recette", category: "Cantine", student: "Traoré Yao", amount: 30000, method: "Espèces", status: "Payé" },
  { id: 5, date: "2024-11-03", type: "Dépense", category: "Salaires", student: "-", amount: 500000, method: "Virement", status: "Payé" },
  { id: 6, date: "2024-11-03", type: "Recette", category: "Transport", student: "Bamba Aya", amount: 25000, method: "Mobile Money", status: "En attente" },
];

const initialPendingPayments = [
  { id: 1, student: "Koné Serge", matricule: "66800005A", class: "2ndeC", amount: 150000, due: "2024-11-15", type: "Scolarité T1" },
  { id: 2, student: "Yao Martin", matricule: "66800006A", class: "1èreD", amount: 50000, due: "2024-11-10", type: "Bibliothèque" },
  { id: 3, student: "Coulibaly Marie", matricule: "66800007A", class: "TleA1", amount: 30000, due: "2024-11-20", type: "Cantine" },
];

export default function Finance() {
  const { t } = useLanguage();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [pendingPayments, setPendingPayments] = useState(initialPendingPayments);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof initialTransactions[0] | null>(null);
  const [selectedPending, setSelectedPending] = useState<typeof initialPendingPayments[0] | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newTransaction, setNewTransaction] = useState({
    type: "recette",
    category: "scolarite",
    amount: 0,
    method: "especes",
    student: "",
    description: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    method: "especes"
  });

  const filteredTransactions = transactions.filter(t => {
    const matchType = filterType === "all" || 
                     (filterType === "recette" && t.type === "Recette") ||
                     (filterType === "depense" && t.type === "Dépense");
    const matchSearch = searchTerm === "" || 
                       t.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const totalRevenue = transactions
    .filter(t => t.type === "Recette" && t.status === "Payé")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "Dépense" && t.status === "Payé")
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingAmount = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  const exportColumns = [
    { key: "date", label: t('finance.date') },
    { key: "type", label: t('finance.type') },
    { key: "category", label: t('finance.category') },
    { key: "student", label: t('finance.student') },
    { key: "amount", label: t('finance.amount') },
    { key: "method", label: t('finance.method') },
    { key: "status", label: t('finance.status') },
  ];

  const handleAddTransaction = () => {
    const newTx = {
      id: transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: newTransaction.type === "recette" ? "Recette" : "Dépense",
      category: getCategoryLabel(newTransaction.category),
      student: newTransaction.student || "-",
      amount: newTransaction.amount,
      method: getMethodLabel(newTransaction.method),
      status: "Payé"
    };

    setTransactions([newTx, ...transactions]);
    setIsTransactionDialogOpen(false);
    setNewTransaction({ type: "recette", category: "scolarite", amount: 0, method: "especes", student: "", description: "" });
    toast.success("Transaction enregistrée avec succès");
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      scolarite: "Scolarité",
      inscription: "Inscription",
      cantine: "Cantine",
      transport: "Transport",
      salaires: "Salaires",
      fournitures: "Fournitures"
    };
    return labels[cat] || cat;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      especes: "Espèces",
      mobile: "Mobile Money",
      cheque: "Chèque",
      virement: "Virement"
    };
    return labels[method] || method;
  };

  const handleViewTransaction = (tx: typeof initialTransactions[0]) => {
    setSelectedTransaction(tx);
    setViewDialogOpen(true);
  };

  const handleRegisterPayment = (payment: typeof initialPendingPayments[0]) => {
    setSelectedPending(payment);
    setPaymentForm({ amount: payment.amount, method: "especes" });
    setPaymentDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPending) return;

    // Add as transaction
    const newTx = {
      id: transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: "Recette",
      category: selectedPending.type,
      student: selectedPending.student,
      amount: paymentForm.amount,
      method: getMethodLabel(paymentForm.method),
      status: "Payé"
    };

    setTransactions([newTx, ...transactions]);

    // Remove from pending if fully paid
    if (paymentForm.amount >= selectedPending.amount) {
      setPendingPayments(pendingPayments.filter(p => p.id !== selectedPending.id));
    } else {
      setPendingPayments(pendingPayments.map(p => 
        p.id === selectedPending.id 
          ? { ...p, amount: p.amount - paymentForm.amount }
          : p
      ));
    }

    setPaymentDialogOpen(false);
    toast.success(`Paiement de ${paymentForm.amount.toLocaleString()} FCFA enregistré pour ${selectedPending.student}`);
  };

  const generateMonthlyReport = () => {
    const doc = new jsPDF();
    const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    doc.setFontSize(18);
    doc.text(`Rapport Financier - ${currentMonth}`, 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Total Recettes: ${totalRevenue.toLocaleString()} FCFA`, 14, 35);
    doc.text(`Total Dépenses: ${totalExpense.toLocaleString()} FCFA`, 14, 45);
    doc.text(`Solde Net: ${(totalRevenue - totalExpense).toLocaleString()} FCFA`, 14, 55);
    doc.text(`Impayés en attente: ${pendingAmount.toLocaleString()} FCFA`, 14, 65);

    autoTable(doc, {
      head: [['Date', 'Type', 'Catégorie', 'Montant', 'Méthode', 'Statut']],
      body: transactions.map(t => [t.date, t.type, t.category, `${t.amount.toLocaleString()} FCFA`, t.method, t.status]),
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`rapport-financier-${currentMonth.replace(' ', '-')}.pdf`);
    toast.success("Rapport mensuel généré avec succès");
  };

  const generateLedger = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Grand Livre des Comptes", 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    autoTable(doc, {
      head: [['Date', 'Libellé', 'Débit', 'Crédit', 'Solde']],
      body: transactions.map((t, i) => {
        const runningTotal = transactions.slice(0, i + 1).reduce((acc, tx) => 
          tx.type === "Recette" ? acc + tx.amount : acc - tx.amount, 0
        );
        return [
          t.date, 
          `${t.category} - ${t.student}`,
          t.type === "Dépense" ? `${t.amount.toLocaleString()} FCFA` : "",
          t.type === "Recette" ? `${t.amount.toLocaleString()} FCFA` : "",
          `${runningTotal.toLocaleString()} FCFA`
        ];
      }),
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    doc.save("grand-livre.pdf");
    toast.success("Grand livre généré avec succès");
  };

  const generateBalanceSheet = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Bilan Comptable", 14, 20);
    doc.setFontSize(10);
    doc.text(`Au ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    // Actif
    doc.setFontSize(14);
    doc.text("ACTIF", 14, 45);
    doc.setFontSize(10);
    doc.text(`Trésorerie: ${(totalRevenue - totalExpense).toLocaleString()} FCFA`, 20, 55);
    doc.text(`Créances (Impayés): ${pendingAmount.toLocaleString()} FCFA`, 20, 65);
    doc.text(`TOTAL ACTIF: ${(totalRevenue - totalExpense + pendingAmount).toLocaleString()} FCFA`, 14, 80);

    // Passif
    doc.setFontSize(14);
    doc.text("PASSIF", 14, 100);
    doc.setFontSize(10);
    doc.text(`Recettes encaissées: ${totalRevenue.toLocaleString()} FCFA`, 20, 110);
    doc.text(`Charges payées: ${totalExpense.toLocaleString()} FCFA`, 20, 120);
    doc.text(`Résultat: ${(totalRevenue - totalExpense).toLocaleString()} FCFA`, 20, 130);

    doc.save("bilan-comptable.pdf");
    toast.success("Bilan généré avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('finance.title')}</h1>
          <p className="text-muted-foreground">{t('finance.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <DataTableExport
            data={filteredTransactions}
            columns={exportColumns}
            filename="transactions-financieres"
          />
          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('finance.newTransaction')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('finance.registerTransaction')}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('finance.type')}</Label>
                    <Select value={newTransaction.type} onValueChange={(v) => setNewTransaction({...newTransaction, type: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('finance.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recette">{t('finance.income_type')}</SelectItem>
                        <SelectItem value="depense">{t('finance.expense_type')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('finance.category')}</Label>
                    <Select value={newTransaction.category} onValueChange={(v) => setNewTransaction({...newTransaction, category: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('finance.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scolarite">{t('finance.tuitionFees')}</SelectItem>
                        <SelectItem value="inscription">{t('finance.enrollment')}</SelectItem>
                        <SelectItem value="cantine">{t('finance.canteen')}</SelectItem>
                        <SelectItem value="transport">{t('finance.transport')}</SelectItem>
                        <SelectItem value="salaires">{t('finance.salaries')}</SelectItem>
                        <SelectItem value="fournitures">{t('finance.supplies')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('finance.amount')}</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('finance.paymentMethod')}</Label>
                    <Select value={newTransaction.method} onValueChange={(v) => setNewTransaction({...newTransaction, method: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('finance.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="especes">{t('finance.cash')}</SelectItem>
                        <SelectItem value="mobile">{t('finance.mobilePayment')}</SelectItem>
                        <SelectItem value="cheque">{t('finance.check')}</SelectItem>
                        <SelectItem value="virement">{t('finance.bankTransfer')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('finance.student')}</Label>
                  <Input 
                    placeholder={t('finance.studentPlaceholder')} 
                    value={newTransaction.student}
                    onChange={(e) => setNewTransaction({...newTransaction, student: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('finance.description')}</Label>
                  <Input 
                    placeholder={t('finance.descriptionPlaceholder')} 
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>{t('finance.cancel')}</Button>
                <Button onClick={handleAddTransaction} disabled={newTransaction.amount <= 0}>{t('finance.save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.totalIncome')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">{t('finance.thisMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.totalExpenses')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalExpense.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">{t('finance.thisMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.netBalance')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalRevenue - totalExpense).toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">{t('finance.monthlyProfit')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.pendingPayments')}</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingAmount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">{pendingPayments.length} {t('finance.students')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>{t('finance.transactionsPayments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList>
              <TabsTrigger value="transactions">{t('finance.transactions')}</TabsTrigger>
              <TabsTrigger value="pending">{t('finance.pendingTab')}</TabsTrigger>
              <TabsTrigger value="reports">{t('finance.reports')}</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('finance.allTypes')}</SelectItem>
                    <SelectItem value="recette">{t('finance.incomeType')}</SelectItem>
                    <SelectItem value="depense">{t('finance.expenseType')}</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder={t('finance.search')} 
                  className="max-w-sm" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('finance.date')}</TableHead>
                    <TableHead>{t('finance.type')}</TableHead>
                    <TableHead>{t('finance.category')}</TableHead>
                    <TableHead>{t('finance.student')}</TableHead>
                    <TableHead>{t('finance.amount')}</TableHead>
                    <TableHead>{t('finance.method')}</TableHead>
                    <TableHead>{t('finance.status')}</TableHead>
                    <TableHead className="text-right">{t('finance.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "Recette" ? "default" : "secondary"}>
                          {transaction.type === "Recette" ? t('finance.income_type') : t('finance.expense_type')}
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
                          {transaction.status === "Payé" ? t('finance.paid') : t('finance.pending')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleViewTransaction(transaction)}>
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
                    <TableHead>{t('finance.matricule')}</TableHead>
                    <TableHead>{t('finance.studentName')}</TableHead>
                    <TableHead>{t('finance.class')}</TableHead>
                    <TableHead>{t('finance.type')}</TableHead>
                    <TableHead>{t('finance.amount')}</TableHead>
                    <TableHead>{t('finance.dueDate')}</TableHead>
                    <TableHead className="text-right">{t('finance.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
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
                        <Button size="sm" variant="outline" onClick={() => handleRegisterPayment(payment)}>
                          {t('finance.registerPayment')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun impayé en attente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="reports">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={generateMonthlyReport}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-semibold">{t('finance.monthlyReport')}</h3>
                        <p className="text-sm text-muted-foreground">{t('finance.generateMonthlyReport')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={generateLedger}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-semibold">{t('finance.ledger')}</h3>
                        <p className="text-sm text-muted-foreground">{t('finance.allEntries')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={generateBalanceSheet}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-semibold">{t('finance.balanceSheet')}</h3>
                        <p className="text-sm text-muted-foreground">{t('finance.balanceStatus')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Transaction Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la transaction</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{selectedTransaction.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge variant={selectedTransaction.type === "Recette" ? "default" : "secondary"}>
                    {selectedTransaction.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Catégorie</Label>
                  <p className="font-medium">{selectedTransaction.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Élève</Label>
                  <p className="font-medium">{selectedTransaction.student}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Montant</Label>
                  <p className="font-medium text-lg">{selectedTransaction.amount.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mode de paiement</Label>
                  <p className="font-medium">{selectedTransaction.method}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Statut</Label>
                  <div className="mt-1">
                    <Badge variant={selectedTransaction.status === "Payé" ? "default" : "outline"}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Registration Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
          </DialogHeader>
          {selectedPending && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedPending.student}</p>
                <p className="text-sm text-muted-foreground">{selectedPending.type} - Classe: {selectedPending.class}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">
                  Montant dû: {selectedPending.amount.toLocaleString()} FCFA
                </p>
              </div>
              <div className="space-y-2">
                <Label>Montant payé</Label>
                <Input 
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Mode de paiement</Label>
                <Select value={paymentForm.method} onValueChange={(v) => setPaymentForm({...paymentForm, method: v})}>
                  <SelectTrigger>
                    <SelectValue />
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleConfirmPayment} disabled={paymentForm.amount <= 0}>Enregistrer le paiement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
