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
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  FileText,
  Eye,
  Edit,
  CheckCircle2,
  Clock,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calculator,
  History,
  BarChart3,
  Layers,
  Hash
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Plan comptable SYSCOHADA
const planComptable = [
  { code: "101000", intitule: "Capital social", classe: "1", type: "Passif" },
  { code: "411000", intitule: "Clients", classe: "4", type: "Actif" },
  { code: "401000", intitule: "Fournisseurs", classe: "4", type: "Passif" },
  { code: "512000", intitule: "Banque", classe: "5", type: "Actif" },
  { code: "531000", intitule: "Caisse", classe: "5", type: "Actif" },
  { code: "601000", intitule: "Achats de marchandises", classe: "6", type: "Charge" },
  { code: "606000", intitule: "Achats de fournitures", classe: "6", type: "Charge" },
  { code: "641000", intitule: "Charges de personnel", classe: "6", type: "Charge" },
  { code: "701000", intitule: "Ventes de produits finis", classe: "7", type: "Produit" },
  { code: "706100", intitule: "Frais de scolarité", classe: "7", type: "Produit" },
  { code: "706200", intitule: "Frais d'inscription", classe: "7", type: "Produit" },
  { code: "706300", intitule: "Frais de cantine", classe: "7", type: "Produit" },
  { code: "706400", intitule: "Frais de transport", classe: "7", type: "Produit" },
];

// Mock journal entries
const mockEcrituresJournal = [
  { 
    id: 1, 
    date: "2024-11-17", 
    piece: "FAC-2024-0125", 
    journal: "Ventes",
    libelle: "Frais de scolarité T1 - Koné Awa",
    lignes: [
      { compte: "531000", intitule: "Caisse", debit: 150000, credit: 0 },
      { compte: "706100", intitule: "Frais de scolarité", debit: 0, credit: 150000 },
    ],
    status: "validé",
    operator: "Comptable"
  },
  { 
    id: 2, 
    date: "2024-11-17", 
    piece: "FAC-2024-0126", 
    journal: "Ventes",
    libelle: "Inscription - Touré Mariam",
    lignes: [
      { compte: "531000", intitule: "Caisse", debit: 50000, credit: 0 },
      { compte: "706200", intitule: "Frais d'inscription", debit: 0, credit: 50000 },
    ],
    status: "validé",
    operator: "Comptable"
  },
  { 
    id: 3, 
    date: "2024-11-16", 
    piece: "ACH-2024-0089", 
    journal: "Achats",
    libelle: "Fournitures de bureau",
    lignes: [
      { compte: "606000", intitule: "Achats de fournitures", debit: 45000, credit: 0 },
      { compte: "531000", intitule: "Caisse", debit: 0, credit: 45000 },
    ],
    status: "validé",
    operator: "Intendant"
  },
  { 
    id: 4, 
    date: "2024-11-15", 
    piece: "SAL-2024-0011", 
    journal: "Paie",
    libelle: "Salaires novembre 2024",
    lignes: [
      { compte: "641000", intitule: "Charges de personnel", debit: 5500000, credit: 0 },
      { compte: "512000", intitule: "Banque", debit: 0, credit: 5500000 },
    ],
    status: "validé",
    operator: "Comptable"
  },
  { 
    id: 5, 
    date: "2024-11-15", 
    piece: "FAC-2024-0124", 
    journal: "Ventes",
    libelle: "Cantine novembre - Lot 1",
    lignes: [
      { compte: "531000", intitule: "Caisse", debit: 875000, credit: 0 },
      { compte: "706300", intitule: "Frais de cantine", debit: 0, credit: 875000 },
    ],
    status: "validé",
    operator: "Comptable"
  },
];

// Journals
const journauxTypes = [
  { code: "VT", name: "Journal des Ventes", ecritures: 145, lastEntry: "2024-11-17" },
  { code: "AC", name: "Journal des Achats", ecritures: 89, lastEntry: "2024-11-16" },
  { code: "CA", name: "Journal de Caisse", ecritures: 234, lastEntry: "2024-11-17" },
  { code: "BQ", name: "Journal de Banque", ecritures: 67, lastEntry: "2024-11-15" },
  { code: "OD", name: "Journal des OD", ecritures: 23, lastEntry: "2024-11-10" },
  { code: "PA", name: "Journal de Paie", ecritures: 12, lastEntry: "2024-11-15" },
];

// Monthly data for chart
const monthlyJournalData = [
  { mois: "Sept", ventes: 45, achats: 23, caisse: 67, banque: 15 },
  { mois: "Oct", ventes: 52, achats: 31, caisse: 78, banque: 22 },
  { mois: "Nov", ventes: 48, achats: 35, caisse: 89, banque: 30 },
];

export default function JournauxComptables() {
  const [showNewEcriture, setShowNewEcriture] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [lignesEcriture, setLignesEcriture] = useState([
    { compte: "", intitule: "", debit: 0, credit: 0 }
  ]);

  const totalDebits = mockEcrituresJournal.reduce((acc, e) => 
    acc + e.lignes.reduce((sum, l) => sum + l.debit, 0), 0);
  const totalCredits = mockEcrituresJournal.reduce((acc, e) => 
    acc + e.lignes.reduce((sum, l) => sum + l.credit, 0), 0);

  const filteredEcritures = mockEcrituresJournal.filter(e => {
    const matchesJournal = selectedJournal === "all" || e.journal === selectedJournal;
    const matchesSearch = e.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.piece.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJournal && matchesSearch;
  });

  const addLigneEcriture = () => {
    setLignesEcriture([...lignesEcriture, { compte: "", intitule: "", debit: 0, credit: 0 }]);
  };

  const removeLigneEcriture = (index: number) => {
    if (lignesEcriture.length > 1) {
      setLignesEcriture(lignesEcriture.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journaux Comptables</h1>
          <p className="text-muted-foreground">Écritures comptables et grand livre - SYSCOHADA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={showNewEcriture} onOpenChange={setShowNewEcriture}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Écriture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Saisie d'Écriture Comptable</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" defaultValue="2024-11-17" />
                  </div>
                  <div className="space-y-2">
                    <Label>Journal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {journauxTypes.map(j => (
                          <SelectItem key={j.code} value={j.code}>{j.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>N° Pièce</Label>
                    <Input placeholder="FAC-2024-XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Référence</Label>
                    <Input placeholder="Référence externe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Libellé</Label>
                  <Input placeholder="Description de l'écriture" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Lignes d'écriture</Label>
                    <Button size="sm" variant="outline" onClick={addLigneEcriture}>
                      <Plus className="h-3 w-3 mr-1" />
                      Ajouter ligne
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Compte</TableHead>
                        <TableHead>Intitulé</TableHead>
                        <TableHead className="w-[150px] text-right">Débit</TableHead>
                        <TableHead className="w-[150px] text-right">Crédit</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lignesEcriture.map((ligne, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Compte" />
                              </SelectTrigger>
                              <SelectContent>
                                {planComptable.map(c => (
                                  <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Intitulé automatique" disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0" className="text-right" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0" className="text-right" />
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => removeLigneEcriture(index)}
                              disabled={lignesEcriture.length === 1}
                            >
                              ×
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={2} className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">0 FCFA</TableCell>
                        <TableCell className="text-right font-bold">0 FCFA</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewEcriture(false)}>Annuler</Button>
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Brouillon
                </Button>
                <Button onClick={() => { setShowNewEcriture(false); toast.success("Écriture enregistrée"); }}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Valider
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Écritures</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{journauxTypes.reduce((acc, j) => acc + j.ecritures, 0)}</div>
            <p className="text-xs text-muted-foreground">cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Débits</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalDebits/1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA période en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crédits</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalCredits/1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA période en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équilibre</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={totalDebits === totalCredits ? "default" : "destructive"}>
                {totalDebits === totalCredits ? "Équilibré" : "Déséquilibré"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Débits = Crédits</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ecritures" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ecritures">
            <BookOpen className="mr-2 h-4 w-4" />
            Écritures
          </TabsTrigger>
          <TabsTrigger value="journaux">
            <Layers className="mr-2 h-4 w-4" />
            Journaux
          </TabsTrigger>
          <TabsTrigger value="grandlivre">
            <History className="mr-2 h-4 w-4" />
            Grand Livre
          </TabsTrigger>
          <TabsTrigger value="plan">
            <Hash className="mr-2 h-4 w-4" />
            Plan Comptable
          </TabsTrigger>
        </TabsList>

        {/* Écritures Tab */}
        <TabsContent value="ecritures" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Écritures Comptables</CardTitle>
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
                  <Select value={selectedJournal} onValueChange={setSelectedJournal}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Journal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les journaux</SelectItem>
                      <SelectItem value="Ventes">Journal des Ventes</SelectItem>
                      <SelectItem value="Achats">Journal des Achats</SelectItem>
                      <SelectItem value="Paie">Journal de Paie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEcritures.map((ecriture) => (
                  <Card key={ecriture.id} className="overflow-hidden">
                    <CardHeader className="py-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{ecriture.journal}</Badge>
                          <span className="font-mono text-sm">{ecriture.date}</span>
                          <span className="font-mono text-sm text-muted-foreground">{ecriture.piece}</span>
                          <span className="font-medium">{ecriture.libelle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={ecriture.status === "validé" ? "default" : "secondary"}>
                            {ecriture.status === "validé" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                            {ecriture.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">Compte</TableHead>
                            <TableHead>Intitulé</TableHead>
                            <TableHead className="w-[150px] text-right">Débit</TableHead>
                            <TableHead className="w-[150px] text-right">Crédit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ecriture.lignes.map((ligne, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-mono">{ligne.compte}</TableCell>
                              <TableCell>{ligne.intitule}</TableCell>
                              <TableCell className="text-right font-mono">
                                {ligne.debit > 0 ? ligne.debit.toLocaleString() : ""}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {ligne.credit > 0 ? ligne.credit.toLocaleString() : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journaux Tab */}
        <TabsContent value="journaux" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {journauxTypes.map((journal) => (
              <Card key={journal.code} className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{journal.code}</Badge>
                    <Badge>{journal.ecritures} écritures</Badge>
                  </div>
                  <CardTitle className="text-lg">{journal.name}</CardTitle>
                  <CardDescription>Dernière écriture: {journal.lastEntry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Consulter
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Printer className="h-3 w-3 mr-1" />
                      Imprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activité par Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyJournalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventes" name="Ventes" fill="hsl(var(--primary))" />
                  <Bar dataKey="achats" name="Achats" fill="hsl(38, 92%, 50%)" />
                  <Bar dataKey="caisse" name="Caisse" fill="hsl(142, 76%, 36%)" />
                  <Bar dataKey="banque" name="Banque" fill="hsl(0, 84%, 60%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grand Livre Tab */}
        <TabsContent value="grandlivre" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grand Livre</CardTitle>
                  <CardDescription>Historique des mouvements par compte</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="531000">
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Sélectionner un compte" />
                    </SelectTrigger>
                    <SelectContent>
                      {planComptable.map(c => (
                        <SelectItem key={c.code} value={c.code}>{c.code} - {c.intitule}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Compte</p>
                    <p className="font-bold">531000 - Caisse</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solde Débiteur</p>
                    <p className="font-bold text-green-600">3 625 000 FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solde Créditeur</p>
                    <p className="font-bold text-red-600">0 FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solde</p>
                    <p className="font-bold">3 625 000 FCFA (D)</p>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pièce</TableHead>
                    <TableHead>Journal</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                    <TableHead className="text-right">Solde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-01</TableCell>
                    <TableCell className="font-mono">-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="font-medium">Report à nouveau</TableCell>
                    <TableCell className="text-right font-mono">2 500 000</TableCell>
                    <TableCell className="text-right font-mono">-</TableCell>
                    <TableCell className="text-right font-mono font-bold">2 500 000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-15</TableCell>
                    <TableCell className="font-mono">FAC-2024-0124</TableCell>
                    <TableCell>VT</TableCell>
                    <TableCell>Cantine novembre</TableCell>
                    <TableCell className="text-right font-mono">875 000</TableCell>
                    <TableCell className="text-right font-mono">-</TableCell>
                    <TableCell className="text-right font-mono font-bold">3 375 000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-16</TableCell>
                    <TableCell className="font-mono">ACH-2024-0089</TableCell>
                    <TableCell>AC</TableCell>
                    <TableCell>Fournitures bureau</TableCell>
                    <TableCell className="text-right font-mono">-</TableCell>
                    <TableCell className="text-right font-mono">45 000</TableCell>
                    <TableCell className="text-right font-mono font-bold">3 330 000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-17</TableCell>
                    <TableCell className="font-mono">FAC-2024-0125</TableCell>
                    <TableCell>VT</TableCell>
                    <TableCell>Scolarité T1 - Koné Awa</TableCell>
                    <TableCell className="text-right font-mono">150 000</TableCell>
                    <TableCell className="text-right font-mono">-</TableCell>
                    <TableCell className="text-right font-mono font-bold">3 480 000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">2024-11-17</TableCell>
                    <TableCell className="font-mono">FAC-2024-0126</TableCell>
                    <TableCell>VT</TableCell>
                    <TableCell>Inscription - Touré Mariam</TableCell>
                    <TableCell className="text-right font-mono">50 000</TableCell>
                    <TableCell className="text-right font-mono">-</TableCell>
                    <TableCell className="text-right font-mono font-bold">3 530 000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Comptable Tab */}
        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Plan Comptable SYSCOHADA</CardTitle>
                  <CardDescription>Liste des comptes utilisés</CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Compte
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Intitulé</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planComptable.map((compte) => (
                    <TableRow key={compte.code}>
                      <TableCell className="font-mono font-bold">{compte.code}</TableCell>
                      <TableCell>{compte.intitule}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Classe {compte.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          compte.type === "Actif" ? "default" :
                          compte.type === "Passif" ? "secondary" :
                          compte.type === "Charge" ? "destructive" : "outline"
                        }>
                          {compte.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
