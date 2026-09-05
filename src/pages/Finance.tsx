import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Plus, Eye, FileText, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTableExport } from "@/components/data-table/DataTableExport";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  EcheancePaiement,
  MouvementCaisse,
  resteAPayer,
  useCreateMouvement,
  useCreatePaiement,
  useEcheancesQuery,
  useMouvementsQuery,
} from "@/hooks/api/useFinance";

const CATEGORIES = ["Scolarité", "Inscription", "Cantine", "Transport", "Salaires", "Fournitures"];

export default function Finance() {
  const { t } = useLanguage();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<MouvementCaisse | null>(null);
  const [selectedPending, setSelectedPending] = useState<EcheancePaiement | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newTransaction, setNewTransaction] = useState({ type: "Entrée" as "Entrée" | "Sortie", categorie: "Scolarité", montant: 0, motif: "" });
  const [paymentForm, setPaymentForm] = useState({ montant: 0, modePaiement: "Espèces" as "Espèces" | "Chèque" | "Virement" | "Mobile Money" });

  const { data: mouvements = [], isLoading: loadingMouvements } = useMouvementsQuery();
  const { data: echeances = [], isLoading: loadingEcheances } = useEcheancesQuery();
  const createMouvement = useCreateMouvement();
  const createPaiement = useCreatePaiement();

  const pendingPayments = echeances.filter((e) => e.statut !== "Payée");

  const filteredTransactions = mouvements.filter((m) => {
    const matchType = filterType === "all" || (filterType === "recette" && m.type === "Entrée") || (filterType === "depense" && m.type === "Sortie");
    const matchSearch = searchTerm === "" || m.motif.toLowerCase().includes(searchTerm.toLowerCase()) || (m.categorie ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const totalRevenue = mouvements.filter((m) => m.type === "Entrée").reduce((acc, m) => acc + m.montant, 0);
  const totalExpense = mouvements.filter((m) => m.type === "Sortie").reduce((acc, m) => acc + m.montant, 0);
  const pendingAmount = pendingPayments.reduce((acc, e) => acc + resteAPayer(e), 0);

  const exportColumns = [
    { key: "date", label: t('finance.date') },
    { key: "type", label: t('finance.type') },
    { key: "categorie", label: t('finance.category') },
    { key: "motif", label: t('finance.description') },
    { key: "montant", label: t('finance.amount') },
  ];

  const handleAddTransaction = () => {
    createMouvement.mutate(
      { type: newTransaction.type, montant: newTransaction.montant, categorie: newTransaction.categorie, motif: newTransaction.motif || newTransaction.categorie },
      {
        onSuccess: () => {
          setIsTransactionDialogOpen(false);
          setNewTransaction({ type: "Entrée", categorie: "Scolarité", montant: 0, motif: "" });
          toast.success("Transaction enregistrée avec succès");
        },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de l'enregistrement."),
      }
    );
  };

  const handleViewTransaction = (tx: MouvementCaisse) => {
    setSelectedTransaction(tx);
    setViewDialogOpen(true);
  };

  const handleRegisterPayment = (echeance: EcheancePaiement) => {
    setSelectedPending(echeance);
    setPaymentForm({ montant: resteAPayer(echeance), modePaiement: "Espèces" });
    setPaymentDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPending) return;
    createPaiement.mutate(
      { eleveId: selectedPending.eleveId, echeanceId: selectedPending.id, montant: paymentForm.montant, modePaiement: paymentForm.modePaiement },
      {
        onSuccess: () => {
          setPaymentDialogOpen(false);
          toast.success(`Paiement de ${paymentForm.montant.toLocaleString()} FCFA enregistré pour ${selectedPending.eleve.nom} ${selectedPending.eleve.prenom} — quittance générée`);
        },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de l'enregistrement du paiement."),
      }
    );
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
      head: [['Date', 'Type', 'Catégorie', 'Montant']],
      body: mouvements.map((m) => [new Date(m.date).toLocaleDateString('fr-FR'), m.type, m.categorie ?? m.motif, `${m.montant.toLocaleString()} FCFA`]),
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`rapport-financier-${currentMonth.replace(' ', '-')}.pdf`);
    toast.success("Rapport mensuel généré avec succès");
  };

  const generateLedger = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Grand Livre de Caisse", 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    autoTable(doc, {
      head: [['Date', 'Libellé', 'Débit', 'Crédit', 'Solde']],
      body: mouvements.map((m) => [
        new Date(m.date).toLocaleDateString('fr-FR'),
        `${m.categorie ?? ''} - ${m.motif}`,
        m.type === "Sortie" ? `${m.montant.toLocaleString()} FCFA` : "",
        m.type === "Entrée" ? `${m.montant.toLocaleString()} FCFA` : "",
        m.soldeApres != null ? `${m.soldeApres.toLocaleString()} FCFA` : "—",
      ]),
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save("grand-livre-caisse.pdf");
    toast.success("Grand livre généré avec succès");
  };

  const generateBalanceSheet = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Situation Financière (simplifiée)", 14, 20);
    doc.setFontSize(10);
    doc.text(`Au ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    doc.setFontSize(14);
    doc.text("ACTIF", 14, 45);
    doc.setFontSize(10);
    doc.text(`Trésorerie (caisse): ${(totalRevenue - totalExpense).toLocaleString()} FCFA`, 20, 55);
    doc.text(`Créances (impayés élèves): ${pendingAmount.toLocaleString()} FCFA`, 20, 65);
    doc.text(`TOTAL ACTIF: ${(totalRevenue - totalExpense + pendingAmount).toLocaleString()} FCFA`, 14, 80);

    doc.setFontSize(14);
    doc.text("RÉSULTAT", 14, 100);
    doc.setFontSize(10);
    doc.text(`Recettes encaissées: ${totalRevenue.toLocaleString()} FCFA`, 20, 110);
    doc.text(`Charges payées: ${totalExpense.toLocaleString()} FCFA`, 20, 120);
    doc.text(`Résultat net: ${(totalRevenue - totalExpense).toLocaleString()} FCFA`, 20, 130);
    doc.setFontSize(8);
    doc.text("Note : situation simplifiée basée sur les mouvements de caisse. Un bilan comptable normalisé", 14, 145);
    doc.text("SYSCOHADA nécessite le plan de comptes (module Comptabilité Générale).", 14, 150);

    doc.save("situation-financiere.pdf");
    toast.success("Document généré avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('finance.title')}</h1>
          <p className="text-muted-foreground">{t('finance.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <DataTableExport data={filteredTransactions} columns={exportColumns} filename="transactions-financieres" />
          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />{t('finance.newTransaction')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{t('finance.registerTransaction')}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('finance.type')}</Label>
                    <Select value={newTransaction.type} onValueChange={(v) => setNewTransaction({ ...newTransaction, type: v as "Entrée" | "Sortie" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrée">{t('finance.income_type')}</SelectItem>
                        <SelectItem value="Sortie">{t('finance.expense_type')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('finance.category')}</Label>
                    <Select value={newTransaction.categorie} onValueChange={(v) => setNewTransaction({ ...newTransaction, categorie: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('finance.amount')}</Label>
                  <Input type="number" placeholder="0" value={newTransaction.montant} onChange={(e) => setNewTransaction({ ...newTransaction, montant: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('finance.description')}</Label>
                  <Input placeholder={t('finance.descriptionPlaceholder')} value={newTransaction.motif} onChange={(e) => setNewTransaction({ ...newTransaction, motif: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>{t('finance.cancel')}</Button>
                <Button onClick={handleAddTransaction} disabled={newTransaction.montant <= 0 || createMouvement.isPending}>
                  {createMouvement.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('finance.save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.totalIncome')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} FCFA</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.totalExpenses')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{totalExpense.toLocaleString()} FCFA</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.netBalance')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{(totalRevenue - totalExpense).toLocaleString()} FCFA</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.pendingPayments')}</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingAmount.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">{pendingPayments.length} {t('finance.students')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('finance.transactionsPayments')}</CardTitle></CardHeader>
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
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('finance.allTypes')}</SelectItem>
                    <SelectItem value="recette">{t('finance.incomeType')}</SelectItem>
                    <SelectItem value="depense">{t('finance.expenseType')}</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder={t('finance.search')} className="max-w-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              {loadingMouvements ? (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Chargement…</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('finance.date')}</TableHead>
                      <TableHead>{t('finance.type')}</TableHead>
                      <TableHead>{t('finance.category')}</TableHead>
                      <TableHead>{t('finance.description')}</TableHead>
                      <TableHead>{t('finance.amount')}</TableHead>
                      <TableHead className="text-right">{t('finance.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono text-sm">{new Date(m.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell><Badge variant={m.type === "Entrée" ? "default" : "secondary"}>{m.type === "Entrée" ? t('finance.income_type') : t('finance.expense_type')}</Badge></TableCell>
                        <TableCell>{m.categorie ?? "—"}</TableCell>
                        <TableCell className="text-sm">{m.motif}</TableCell>
                        <TableCell className="font-semibold">{m.montant.toLocaleString()} FCFA</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => handleViewTransaction(m)}><Eye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {loadingEcheances ? (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Chargement…</div>
              ) : (
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
                    {pendingPayments.map((echeance) => (
                      <TableRow key={echeance.id}>
                        <TableCell className="font-mono text-sm">{echeance.eleve.matricule}</TableCell>
                        <TableCell className="font-medium">{echeance.eleve.nom} {echeance.eleve.prenom}</TableCell>
                        <TableCell>{echeance.eleve.inscriptions?.[0]?.classe.nom ?? "—"}</TableCell>
                        <TableCell>{echeance.libelle}</TableCell>
                        <TableCell className="font-semibold text-orange-600">{resteAPayer(echeance).toLocaleString()} FCFA</TableCell>
                        <TableCell className="font-mono text-sm">{new Date(echeance.dateEcheance).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleRegisterPayment(echeance)}>{t('finance.registerPayment')}</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingPayments.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun impayé en attente</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Détails de la transaction</DialogTitle></DialogHeader>
          {selectedTransaction && (
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Date</Label><p className="font-medium">{new Date(selectedTransaction.date).toLocaleDateString('fr-FR')}</p></div>
              <div><Label className="text-muted-foreground">Type</Label><div><Badge variant={selectedTransaction.type === "Entrée" ? "default" : "secondary"}>{selectedTransaction.type}</Badge></div></div>
              <div><Label className="text-muted-foreground">Catégorie</Label><p className="font-medium">{selectedTransaction.categorie ?? "—"}</p></div>
              <div><Label className="text-muted-foreground">Description</Label><p className="font-medium">{selectedTransaction.motif}</p></div>
              <div><Label className="text-muted-foreground">Montant</Label><p className="font-medium text-lg">{selectedTransaction.montant.toLocaleString()} FCFA</p></div>
              <div><Label className="text-muted-foreground">Solde après</Label><p className="font-medium">{selectedTransaction.soldeApres?.toLocaleString() ?? "—"} FCFA</p></div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setViewDialogOpen(false)}>Fermer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enregistrer un paiement</DialogTitle></DialogHeader>
          {selectedPending && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedPending.eleve.nom} {selectedPending.eleve.prenom}</p>
                <p className="text-sm text-muted-foreground">{selectedPending.libelle}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">Reste à payer : {resteAPayer(selectedPending).toLocaleString()} FCFA</p>
              </div>
              <div className="space-y-2">
                <Label>Montant payé</Label>
                <Input type="number" value={paymentForm.montant} onChange={(e) => setPaymentForm({ ...paymentForm, montant: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Mode de paiement</Label>
                <Select value={paymentForm.modePaiement} onValueChange={(v) => setPaymentForm({ ...paymentForm, modePaiement: v as typeof paymentForm.modePaiement })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Espèces">Espèces</SelectItem>
                    <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    <SelectItem value="Chèque">Chèque</SelectItem>
                    <SelectItem value="Virement">Virement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleConfirmPayment} disabled={paymentForm.montant <= 0 || createPaiement.isPending}>
              {createPaiement.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer le paiement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
