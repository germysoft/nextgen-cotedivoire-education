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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Receipt,
  Search,
  Download,
  Printer,
  Eye,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  FileText,
  QrCode,
  Copy,
  Send,
  Settings,
  History,
  BarChart3,
  Calendar,
  Hash,
  User,
  Building,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock receipts
const mockQuittances = [
  { 
    id: 1, 
    numero: "QUI-2024-0892", 
    date: "2024-11-17", 
    student: "Koné Awa",
    matricule: "66800001A",
    class: "6ème A",
    type: "Scolarité",
    periode: "1er Trimestre",
    amount: 75000,
    paymentMethod: "Espèces",
    paymentRef: "PAY-2024-0892",
    operator: "Caissier",
    status: "émise",
    printed: true,
    sentByEmail: false
  },
  { 
    id: 2, 
    numero: "QUI-2024-0891", 
    date: "2024-11-17", 
    student: "Diallo Ibrahim",
    matricule: "66800002A",
    class: "5ème C",
    type: "Cantine",
    periode: "Novembre 2024",
    amount: 35000,
    paymentMethod: "Mobile Money",
    paymentRef: "PAY-2024-0891",
    operator: "Caissier",
    status: "émise",
    printed: false,
    sentByEmail: true
  },
  { 
    id: 3, 
    numero: "QUI-2024-0890", 
    date: "2024-11-16", 
    student: "Touré Mariam",
    matricule: "66800003A",
    class: "4ème A",
    type: "Inscription",
    periode: "2024-2025",
    amount: 50000,
    paymentMethod: "Espèces",
    paymentRef: "PAY-2024-0890",
    operator: "Secrétaire",
    status: "émise",
    printed: true,
    sentByEmail: true
  },
  { 
    id: 4, 
    numero: "QUI-2024-0889", 
    date: "2024-11-15", 
    student: "Ouattara Karim",
    matricule: "66800004A",
    class: "3ème B",
    type: "Transport",
    periode: "1er Trimestre",
    amount: 25000,
    paymentMethod: "Chèque",
    paymentRef: "PAY-2024-0889",
    operator: "Caissier",
    status: "émise",
    printed: true,
    sentByEmail: false
  },
  { 
    id: 5, 
    numero: "QUI-2024-0888", 
    date: "2024-11-15", 
    student: "Bamba Seydou",
    matricule: "66800005A",
    class: "2nde A",
    type: "Scolarité",
    periode: "1er Trimestre",
    amount: 100000,
    paymentMethod: "Virement",
    paymentRef: "PAY-2024-0888",
    operator: "Comptable",
    status: "annulée",
    printed: false,
    sentByEmail: false
  },
];

// Mock receipt templates
const mockTemplates = [
  { id: 1, name: "Quittance Standard", description: "Format A5 avec logo école", default: true },
  { id: 2, name: "Quittance Détaillée", description: "Avec détail des frais par catégorie", default: false },
  { id: 3, name: "Reçu Simplifié", description: "Format compact pour impression rapide", default: false },
];

// Statistics
const monthlyStats = [
  { mois: "Sept", quittances: 245, montant: 8500000 },
  { mois: "Oct", quittances: 189, montant: 6200000 },
  { mois: "Nov", quittances: 156, montant: 4500000 },
];

export default function Quittances() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuittance, setSelectedQuittance] = useState<typeof mockQuittances[0] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedQuittances, setSelectedQuittances] = useState<number[]>([]);

  const totalQuittances = mockQuittances.filter(q => q.status === "émise").length;
  const totalAmount = mockQuittances.filter(q => q.status === "émise").reduce((acc, q) => acc + q.amount, 0);
  const printedCount = mockQuittances.filter(q => q.printed).length;
  const emailedCount = mockQuittances.filter(q => q.sentByEmail).length;

  const filteredQuittances = mockQuittances.filter(q => {
    const matchesSearch = q.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || q.type === filterType;
    const matchesStatus = filterStatus === "all" || q.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const toggleSelection = (id: number) => {
    setSelectedQuittances(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handlePrint = (quittance: typeof mockQuittances[0]) => {
    setSelectedQuittance(quittance);
    setShowPreview(true);
  };

  const handleBulkPrint = () => {
    toast.success(`${selectedQuittances.length} quittances envoyées à l'impression`);
    setSelectedQuittances([]);
  };

  const handleBulkEmail = () => {
    toast.success(`${selectedQuittances.length} quittances envoyées par email`);
    setSelectedQuittances([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Quittances</h1>
          <p className="text-muted-foreground">Génération et suivi des reçus de paiement</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Paramètres des Quittances</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Numérotation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Préfixe</Label>
                      <Input defaultValue="QUI" />
                    </div>
                    <div className="space-y-2">
                      <Label>Prochain numéro</Label>
                      <Input type="number" defaultValue="893" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="yearPrefix" defaultChecked />
                    <Label htmlFor="yearPrefix">Inclure l'année dans le numéro</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Modèle par défaut</h4>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTemplates.map(t => (
                        <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Informations de l'établissement</h4>
                  <div className="space-y-2">
                    <Label>Nom de l'établissement</Label>
                    <Input defaultValue="Groupe Scolaire Excellence" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input defaultValue="+225 27 22 00 00 00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue="contact@gs-excellence.ci" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Options</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="qrcode" defaultChecked />
                      <Label htmlFor="qrcode">Inclure un QR code de vérification</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="autoPrint" />
                      <Label htmlFor="autoPrint">Imprimer automatiquement après paiement</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="autoEmail" defaultChecked />
                      <Label htmlFor="autoEmail">Envoyer par email automatiquement</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSettings(false)}>Annuler</Button>
                <Button onClick={() => { setShowSettings(false); toast.success("Paramètres enregistrés"); }}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quittances Émises</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuittances}</div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imprimées</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{printedCount}</div>
            <p className="text-xs text-muted-foreground">sur {totalQuittances}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envoyées par Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailedCount}</div>
            <p className="text-xs text-muted-foreground">sur {totalQuittances}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">
            <Receipt className="mr-2 h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" />
            Modèles
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quittances</CardTitle>
                <div className="flex gap-2">
                  {selectedQuittances.length > 0 && (
                    <>
                      <Button variant="outline" onClick={handleBulkPrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer ({selectedQuittances.length})
                      </Button>
                      <Button variant="outline" onClick={handleBulkEmail}>
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer ({selectedQuittances.length})
                      </Button>
                    </>
                  )}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="Scolarité">Scolarité</SelectItem>
                      <SelectItem value="Cantine">Cantine</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Inscription">Inscription</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="émise">Émise</SelectItem>
                      <SelectItem value="annulée">Annulée</SelectItem>
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
                        checked={selectedQuittances.length === filteredQuittances.filter(q => q.status === "émise").length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedQuittances(filteredQuittances.filter(q => q.status === "émise").map(q => q.id));
                          } else {
                            setSelectedQuittances([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>N° Quittance</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                    <TableHead className="text-right">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuittances.map((quittance) => (
                    <TableRow key={quittance.id} className={quittance.status === "annulée" ? "opacity-50" : ""}>
                      <TableCell>
                        {quittance.status === "émise" && (
                          <Checkbox 
                            checked={selectedQuittances.includes(quittance.id)}
                            onCheckedChange={() => toggleSelection(quittance.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-mono font-bold">{quittance.numero}</TableCell>
                      <TableCell className="font-mono">{quittance.date}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{quittance.student}</p>
                          <p className="text-xs text-muted-foreground">{quittance.matricule} • {quittance.class}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{quittance.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{quittance.periode}</TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {quittance.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge variant={quittance.status === "émise" ? "default" : "destructive"}>
                          {quittance.status === "émise" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                          {quittance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          {quittance.printed && (
                            <Badge variant="outline" className="text-xs">
                              <Printer className="h-3 w-3" />
                            </Badge>
                          )}
                          {quittance.sentByEmail && (
                            <Badge variant="outline" className="text-xs">
                              <Mail className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handlePrint(quittance)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { handlePrint(quittance); toast.success("Impression lancée"); }}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.success("Quittance envoyée par email")}>
                            <Mail className="h-4 w-4" />
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

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockTemplates.map((template) => (
              <Card key={template.id} className={`cursor-pointer transition-colors ${template.default ? "ring-2 ring-primary" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {template.default && <Badge>Par défaut</Badge>}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[1/1.4] bg-muted rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Aperçu
                    </Button>
                    <Button size="sm" variant={template.default ? "secondary" : "outline"} className="flex-1">
                      {template.default ? "Actif" : "Utiliser"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="cursor-pointer border-dashed hover:border-primary transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-medium">Créer un modèle</p>
                <p className="text-sm text-muted-foreground">Personnaliser vos quittances</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Émission de Quittances par Mois</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value: number, name: string) => 
                    name === "montant" ? `${value.toLocaleString()} FCFA` : value
                  } />
                  <Bar yAxisId="left" dataKey="quittances" name="Nombre" fill="hsl(var(--primary))" />
                  <Bar yAxisId="right" dataKey="montant" name="Montant" fill="hsl(142, 76%, 36%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu de la Quittance</DialogTitle>
          </DialogHeader>
          {selectedQuittance && (
            <div className="border rounded-lg p-6 bg-white">
              {/* Header */}
              <div className="text-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold">GROUPE SCOLAIRE EXCELLENCE</h2>
                <p className="text-sm text-muted-foreground">BP 1234 Abidjan - Tél: +225 27 22 00 00 00</p>
                <p className="text-sm text-muted-foreground">Email: contact@gs-excellence.ci</p>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold border-2 border-black inline-block px-4 py-1">
                  QUITTANCE DE PAIEMENT
                </h3>
              </div>

              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">N° Quittance</p>
                  <p className="font-bold">{selectedQuittance.numero}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-bold">{selectedQuittance.date}</p>
                </div>
              </div>

              {/* Student Info */}
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Élève</p>
                      <p className="font-bold">{selectedQuittance.student}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Matricule</p>
                      <p className="font-bold">{selectedQuittance.matricule}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Classe</p>
                      <p className="font-bold">{selectedQuittance.class}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Table className="mb-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>Désignation</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{selectedQuittance.type}</TableCell>
                    <TableCell>{selectedQuittance.periode}</TableCell>
                    <TableCell className="text-right font-mono">{selectedQuittance.amount.toLocaleString()} FCFA</TableCell>
                  </TableRow>
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>TOTAL</TableCell>
                    <TableCell className="text-right font-mono">{selectedQuittance.amount.toLocaleString()} FCFA</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Payment Method */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Mode de paiement</p>
                <p className="font-medium">{selectedQuittance.paymentMethod}</p>
              </div>

              {/* QR Code placeholder */}
              <div className="flex justify-between items-end">
                <div className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Caissier</p>
                  <p className="font-medium">{selectedQuittance.operator}</p>
                  <div className="mt-4 border-t border-black w-32 pt-1">
                    <p className="text-xs text-center">Signature</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>Fermer</Button>
            <Button variant="outline" onClick={() => toast.success("Quittance copiée")}>
              <Copy className="mr-2 h-4 w-4" />
              Dupliquer
            </Button>
            <Button onClick={() => { setShowPreview(false); toast.success("Impression lancée"); }}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
