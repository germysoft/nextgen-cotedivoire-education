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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
          <h1 className="text-3xl font-bold">{t('finance.title')}</h1>
          <p className="text-muted-foreground">{t('finance.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('finance.export')}
          </Button>
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
                    <Select>
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
                    <Select>
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
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('finance.paymentMethod')}</Label>
                    <Select>
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
                  <Input placeholder={t('finance.studentPlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('finance.description')}</Label>
                  <Input placeholder={t('finance.descriptionPlaceholder')} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>{t('finance.cancel')}</Button>
                  <Button onClick={() => setIsTransactionDialogOpen(false)}>{t('finance.save')}</Button>
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
            <p className="text-xs text-muted-foreground">{mockPendingPayments.length} {t('finance.students')}</p>
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
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('finance.allTypes')}</SelectItem>
                    <SelectItem value="recette">{t('finance.incomeType')}</SelectItem>
                    <SelectItem value="depense">{t('finance.expenseType')}</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder={t('finance.search')} className="max-w-sm" />
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
                  {mockTransactions.map((transaction) => (
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
                          {t('finance.registerPayment')}
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
                        <h3 className="font-semibold">{t('finance.monthlyReport')}</h3>
                        <p className="text-sm text-muted-foreground">{t('finance.generateMonthlyReport')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors">
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
                <Card className="cursor-pointer hover:bg-accent transition-colors">
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
    </div>
  );
}
