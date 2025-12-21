import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, Search, Send, Download, Clock, DollarSign,
  Mail, MessageSquare, User, Calendar, AlertTriangle, Bell, FileText
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { mockBorrowings, Borrowing } from "@/data/mockLibrary";
import { generateLateAlertReport } from "@/components/bibliotheque/LibraryPDFGenerator";

export default function AlertesRetard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedBorrowings, setSelectedBorrowings] = useState<string[]>([]);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  const lateBorrowings = mockBorrowings.filter(b => b.status === 'En retard');

  const calculateDaysLate = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculatePenalty = (daysLate: number) => {
    return daysLate * 50; // 50 FCFA par jour
  };

  const getSeverity = (daysLate: number) => {
    if (daysLate > 14) return 'critical';
    if (daysLate > 7) return 'high';
    return 'medium';
  };

  const filteredBorrowings = lateBorrowings.filter(b => {
    const daysLate = calculateDaysLate(b.dueDate);
    const severity = getSeverity(daysLate);
    const matchesSearch = 
      b.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleExportReport = () => {
    const pdf = generateLateAlertReport(lateBorrowings);
    pdf.save('alertes-retard-bibliotheque.pdf');
    toast.success("Rapport des retards exporté");
  };

  const handleSendReminders = () => {
    if (selectedBorrowings.length === 0) {
      toast.error("Veuillez sélectionner au moins un emprunt");
      return;
    }
    setIsReminderDialogOpen(true);
  };

  const handleSendSMS = () => {
    toast.success(`SMS de rappel envoyé à ${selectedBorrowings.length} emprunteur(s)`);
    setIsReminderDialogOpen(false);
    setSelectedBorrowings([]);
  };

  const handleSendEmail = () => {
    toast.success(`Email de rappel envoyé à ${selectedBorrowings.length} emprunteur(s)`);
    setIsReminderDialogOpen(false);
    setSelectedBorrowings([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBorrowings(filteredBorrowings.map(b => b.id));
    } else {
      setSelectedBorrowings([]);
    }
  };

  const handleSelectBorrowing = (borrowingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBorrowings([...selectedBorrowings, borrowingId]);
    } else {
      setSelectedBorrowings(selectedBorrowings.filter(id => id !== borrowingId));
    }
  };

  const totalPenalties = lateBorrowings.reduce((sum, b) => {
    const daysLate = calculateDaysLate(b.dueDate);
    return sum + calculatePenalty(daysLate);
  }, 0);

  const criticalCount = lateBorrowings.filter(b => getSeverity(calculateDaysLate(b.dueDate)) === 'critical').length;
  const highCount = lateBorrowings.filter(b => getSeverity(calculateDaysLate(b.dueDate)) === 'high').length;

  const getSeverityBadge = (daysLate: number) => {
    const severity = getSeverity(daysLate);
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Critique ({daysLate}j)</Badge>;
      case 'high':
        return <Badge className="gap-1 bg-orange-500"><AlertCircle className="h-3 w-3" />Élevé ({daysLate}j)</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Modéré ({daysLate}j)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes Retard</h1>
          <p className="text-muted-foreground">Suivi des emprunts en retard et pénalités</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Button onClick={handleSendReminders} disabled={selectedBorrowings.length === 0}>
            <Send className="mr-2 h-4 w-4" />
            Envoyer Rappels ({selectedBorrowings.length})
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Plus de 14 jours</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards Élevés</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
            <p className="text-xs text-muted-foreground">7 à 14 jours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Retards</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateBorrowings.length}</div>
            <p className="text-xs text-muted-foreground">Emprunts en retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pénalités Dues</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPenalties.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">50 FCFA/jour de retard</p>
          </CardContent>
        </Card>
      </div>

      {/* Règles de pénalités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Règles de Pénalités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="font-medium">Retard Modéré</span>
              </div>
              <p className="text-sm text-muted-foreground">1-7 jours: 50 FCFA/jour</p>
              <p className="text-sm text-muted-foreground">Rappel SMS automatique</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="font-medium">Retard Élevé</span>
              </div>
              <p className="text-sm text-muted-foreground">8-14 jours: 75 FCFA/jour</p>
              <p className="text-sm text-muted-foreground">Convocation parents</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="font-medium">Retard Critique</span>
              </div>
              <p className="text-sm text-muted-foreground">+15 jours: 100 FCFA/jour</p>
              <p className="text-sm text-muted-foreground">Suspension carte lecteur</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Emprunts en Retard</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                  <SelectItem value="medium">Modéré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedBorrowings.length === filteredBorrowings.length && filteredBorrowings.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Emprunteur</TableHead>
                <TableHead>Livre</TableHead>
                <TableHead>Date Retour Prévue</TableHead>
                <TableHead>Niveau Retard</TableHead>
                <TableHead className="text-right">Pénalité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBorrowings.map((borrowing) => {
                const daysLate = calculateDaysLate(borrowing.dueDate);
                const penalty = calculatePenalty(daysLate);
                
                return (
                  <TableRow key={borrowing.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedBorrowings.includes(borrowing.id)}
                        onCheckedChange={(checked) => handleSelectBorrowing(borrowing.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{borrowing.borrowerName}</div>
                          {borrowing.borrowerClass && (
                            <Badge variant="outline" className="text-xs">{borrowing.borrowerClass}</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{borrowing.bookTitle}</div>
                      <code className="text-xs text-muted-foreground">{borrowing.bookCode}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(borrowing.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSeverityBadge(daysLate)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {penalty.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" title="Envoyer SMS">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Envoyer Email">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Marquer retourné
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer des Rappels</DialogTitle>
            <DialogDescription>
              Choisissez le mode d'envoi pour {selectedBorrowings.length} emprunteur(s)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={handleSendSMS} className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Envoyer par SMS
            </Button>
            <Button onClick={handleSendEmail} className="w-full justify-start" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par Email
            </Button>
            <Button 
              onClick={() => {
                handleSendSMS();
                handleSendEmail();
              }} 
              className="w-full justify-start"
            >
              <Bell className="mr-2 h-4 w-4" />
              Envoyer par les deux
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
