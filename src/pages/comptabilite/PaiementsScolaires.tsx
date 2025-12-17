import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard,
  Search,
  Download,
  Printer,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Filter,
  Plus,
  Receipt,
  GraduationCap,
  Utensils,
  Bus,
  BookOpen,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock students with payment status
const mockStudentPayments = [
  { 
    id: 1, 
    matricule: "66800001A", 
    name: "Koné Awa", 
    class: "6ème A", 
    scolarite: { total: 150000, paid: 150000, status: "payé" },
    cantine: { total: 35000, paid: 35000, status: "payé" },
    transport: { total: 25000, paid: 25000, status: "payé" },
    inscription: { total: 50000, paid: 50000, status: "payé" },
    totalDue: 260000,
    totalPaid: 260000,
    balance: 0
  },
  { 
    id: 2, 
    matricule: "66800002A", 
    name: "Diallo Ibrahim", 
    class: "5ème C", 
    scolarite: { total: 150000, paid: 75000, status: "partiel" },
    cantine: { total: 35000, paid: 35000, status: "payé" },
    transport: { total: 0, paid: 0, status: "n/a" },
    inscription: { total: 50000, paid: 50000, status: "payé" },
    totalDue: 235000,
    totalPaid: 160000,
    balance: 75000
  },
  { 
    id: 3, 
    matricule: "66800003A", 
    name: "Touré Mariam", 
    class: "4ème A", 
    scolarite: { total: 150000, paid: 0, status: "impayé" },
    cantine: { total: 35000, paid: 0, status: "impayé" },
    transport: { total: 25000, paid: 0, status: "impayé" },
    inscription: { total: 50000, paid: 50000, status: "payé" },
    totalDue: 260000,
    totalPaid: 50000,
    balance: 210000
  },
  { 
    id: 4, 
    matricule: "66800004A", 
    name: "Ouattara Karim", 
    class: "3ème B", 
    scolarite: { total: 175000, paid: 175000, status: "payé" },
    cantine: { total: 35000, paid: 17500, status: "partiel" },
    transport: { total: 25000, paid: 25000, status: "payé" },
    inscription: { total: 50000, paid: 50000, status: "payé" },
    totalDue: 285000,
    totalPaid: 267500,
    balance: 17500
  },
  { 
    id: 5, 
    matricule: "66800005A", 
    name: "Bamba Seydou", 
    class: "2nde A", 
    scolarite: { total: 200000, paid: 100000, status: "partiel" },
    cantine: { total: 0, paid: 0, status: "n/a" },
    transport: { total: 25000, paid: 25000, status: "payé" },
    inscription: { total: 75000, paid: 75000, status: "payé" },
    totalDue: 300000,
    totalPaid: 200000,
    balance: 100000
  },
];

// Mock payment history
const mockPaymentHistory = [
  { id: 1, date: "2024-11-17", reference: "PAY-2024-0892", student: "Koné Awa", matricule: "66800001A", type: "Scolarité T1", amount: 75000, method: "Espèces", operator: "Caissier", receipt: "QUI-2024-0892" },
  { id: 2, date: "2024-11-17", reference: "PAY-2024-0891", student: "Diallo Ibrahim", matricule: "66800002A", type: "Cantine Nov", amount: 35000, method: "Mobile Money", operator: "Caissier", receipt: "QUI-2024-0891" },
  { id: 3, date: "2024-11-16", reference: "PAY-2024-0890", student: "Touré Mariam", matricule: "66800003A", type: "Inscription", amount: 50000, method: "Espèces", operator: "Secrétaire", receipt: "QUI-2024-0890" },
  { id: 4, date: "2024-11-15", reference: "PAY-2024-0889", student: "Ouattara Karim", matricule: "66800004A", type: "Transport T1", amount: 25000, method: "Chèque", operator: "Caissier", receipt: "QUI-2024-0889" },
  { id: 5, date: "2024-11-15", reference: "PAY-2024-0888", student: "Bamba Seydou", matricule: "66800005A", type: "Scolarité T1", amount: 100000, method: "Virement", operator: "Comptable", receipt: "QUI-2024-0888" },
];

// Payment schedule
const mockEcheances = [
  { trimestre: "1er Trimestre", dateDebut: "2024-09-01", dateFin: "2024-10-31", scolarite: 75000, statut: "terminé" },
  { trimestre: "2ème Trimestre", dateDebut: "2024-11-01", dateFin: "2025-01-31", scolarite: 75000, statut: "en_cours" },
  { trimestre: "3ème Trimestre", dateDebut: "2025-02-01", dateFin: "2025-04-30", scolarite: 75000, statut: "à_venir" },
];

// Statistics for charts
const paymentsByType = [
  { type: "Scolarité", montant: 12500000, percentage: 65 },
  { type: "Inscription", montant: 3800000, percentage: 20 },
  { type: "Cantine", montant: 1900000, percentage: 10 },
  { type: "Transport", montant: 950000, percentage: 5 },
];

const monthlyPayments = [
  { mois: "Sept", collecte: 8500000, objectif: 10000000 },
  { mois: "Oct", collecte: 6200000, objectif: 5000000 },
  { mois: "Nov", collecte: 4500000, objectif: 5000000 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

export default function PaiementsScolaires() {
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [showSendReminders, setShowSendReminders] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const totalDue = mockStudentPayments.reduce((acc, s) => acc + s.totalDue, 0);
  const totalPaid = mockStudentPayments.reduce((acc, s) => acc + s.totalPaid, 0);
  const totalBalance = mockStudentPayments.reduce((acc, s) => acc + s.balance, 0);
  const studentsWithBalance = mockStudentPayments.filter(s => s.balance > 0).length;
  const collectionRate = Math.round((totalPaid / totalDue) * 100);

  const filteredStudents = mockStudentPayments.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "paid" && student.balance === 0) ||
                         (filterStatus === "partial" && student.balance > 0 && student.totalPaid > 0) ||
                         (filterStatus === "unpaid" && student.totalPaid === student.inscription?.paid);
    const matchesClass = filterClass === "all" || student.class === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const toggleStudentSelection = (id: number) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payé": return <Badge variant="default"><CheckCircle2 className="mr-1 h-3 w-3" />Payé</Badge>;
      case "partiel": return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Partiel</Badge>;
      case "impayé": return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Impayé</Badge>;
      default: return <Badge variant="outline">N/A</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paiements Scolaires</h1>
          <p className="text-muted-foreground">Suivi des frais de scolarité, cantine et transport</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSendReminders} onOpenChange={setShowSendReminders}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={selectedStudents.length === 0}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer Rappels ({selectedStudents.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Envoyer des Rappels de Paiement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  {selectedStudents.length} élève(s) sélectionné(s)
                </p>
                <div className="space-y-2">
                  <Label>Canal de communication</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="sms" defaultChecked />
                      <Label htmlFor="sms">SMS</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="email" defaultChecked />
                      <Label htmlFor="email">Email</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message personnalisé (optionnel)</Label>
                  <Input placeholder="Message additionnel..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSendReminders(false)}>Annuler</Button>
                <Button onClick={() => { setShowSendReminders(false); setSelectedStudents([]); toast.success("Rappels envoyés avec succès"); }}>
                  Envoyer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Enregistrer Paiement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enregistrer un Paiement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Élève</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Rechercher un élève..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudentPayments.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.matricule} - {s.name} ({s.class})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type de frais</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scolarite">Scolarité</SelectItem>
                        <SelectItem value="inscription">Inscription</SelectItem>
                        <SelectItem value="cantine">Cantine</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="bibliotheque">Bibliothèque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Période</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t1">1er Trimestre</SelectItem>
                        <SelectItem value="t2">2ème Trimestre</SelectItem>
                        <SelectItem value="t3">3ème Trimestre</SelectItem>
                        <SelectItem value="annuel">Annuel</SelectItem>
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
                    <Label>Mode de paiement</Label>
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
                <div className="flex items-center gap-2">
                  <Checkbox id="receipt" defaultChecked />
                  <Label htmlFor="receipt">Générer une quittance automatiquement</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewPayment(false)}>Annuler</Button>
                <Button onClick={() => { setShowNewPayment(false); toast.success("Paiement enregistré - Quittance générée"); }}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalDue/1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA année scolaire</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Encaissé</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(totalPaid/1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA collectés</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reste à Percevoir</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Recouvrement</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate}%</div>
            <Progress value={collectionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves en Retard</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{studentsWithBalance}</div>
            <p className="text-xs text-muted-foreground">sur {mockStudentPayments.length} élèves</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Par Élève
          </TabsTrigger>
          <TabsTrigger value="history">
            <Receipt className="mr-2 h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            Échéancier
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analyse
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Situation des Paiements par Élève</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="paid">À jour</SelectItem>
                      <SelectItem value="partial">Partiel</SelectItem>
                      <SelectItem value="unpaid">Impayé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="6ème A">6ème A</SelectItem>
                      <SelectItem value="5ème C">5ème C</SelectItem>
                      <SelectItem value="4ème A">4ème A</SelectItem>
                      <SelectItem value="3ème B">3ème B</SelectItem>
                      <SelectItem value="2nde A">2nde A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedStudents.length === filteredStudents.filter(s => s.balance > 0).length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStudents(filteredStudents.filter(s => s.balance > 0).map(s => s.id));
                          } else {
                            setSelectedStudents([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        Scolarité
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Utensils className="h-4 w-4" />
                        Cantine
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Bus className="h-4 w-4" />
                        Transport
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Total Payé</TableHead>
                    <TableHead className="text-right">Reste</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className={student.balance > 0 ? "bg-red-50 dark:bg-red-950/10" : ""}>
                      <TableCell>
                        {student.balance > 0 && (
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudentSelection(student.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.matricule}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(student.scolarite.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {student.scolarite.paid.toLocaleString()}/{student.scolarite.total.toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(student.cantine.status)}
                        {student.cantine.total > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {student.cantine.paid.toLocaleString()}/{student.cantine.total.toLocaleString()}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(student.transport.status)}
                        {student.transport.total > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {student.transport.paid.toLocaleString()}/{student.transport.total.toLocaleString()}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-600">
                        {student.totalPaid.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-red-600">
                        {student.balance > 0 ? student.balance.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <CreditCard className="h-4 w-4" />
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

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Quittance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono">{payment.date}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.reference}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.student}</p>
                          <p className="text-xs text-muted-foreground">{payment.matricule}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {payment.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payment.receipt}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Printer className="h-4 w-4" />
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

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Échéancier des Paiements</CardTitle>
              <CardDescription>Calendrier des échéances par trimestre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEcheances.map((echeance, idx) => (
                  <Card key={idx} className={`overflow-hidden ${echeance.statut === "en_cours" ? "ring-2 ring-primary" : ""}`}>
                    <CardHeader className={`py-3 ${
                      echeance.statut === "terminé" ? "bg-green-50 dark:bg-green-950/20" :
                      echeance.statut === "en_cours" ? "bg-blue-50 dark:bg-blue-950/20" :
                      "bg-muted/30"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            echeance.statut === "terminé" ? "default" :
                            echeance.statut === "en_cours" ? "secondary" : "outline"
                          }>
                            {echeance.statut === "terminé" ? <CheckCircle2 className="mr-1 h-3 w-3" /> :
                             echeance.statut === "en_cours" ? <Clock className="mr-1 h-3 w-3" /> :
                             <Calendar className="mr-1 h-3 w-3" />}
                            {echeance.statut === "terminé" ? "Terminé" :
                             echeance.statut === "en_cours" ? "En cours" : "À venir"}
                          </Badge>
                          <span className="font-semibold">{echeance.trimestre}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {echeance.dateDebut} → {echeance.dateFin}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Scolarité</p>
                          <p className="font-bold">{echeance.scolarite.toLocaleString()} FCFA</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cantine (mensuel)</p>
                          <p className="font-bold">35 000 FCFA</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transport</p>
                          <p className="font-bold">25 000 FCFA</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Estimé</p>
                          <p className="font-bold text-primary">135 000 FCFA</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="montant"
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                    >
                      {paymentsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Collecte Mensuelle vs Objectif</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyPayments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                    <Legend />
                    <Bar dataKey="collecte" name="Collecté" fill="hsl(142, 76%, 36%)" />
                    <Bar dataKey="objectif" name="Objectif" fill="hsl(var(--muted))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
