import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, Search, Plus, Download, Calendar, CheckCircle,
  AlertTriangle, Package, ArrowDown, ArrowUp, BarChart3, Scan
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { mockInventory, mockBooks, locations, InventoryItem } from "@/data/mockLibrary";
import { generateInventoryReport } from "@/components/bibliotheque/LibraryPDFGenerator";

export default function Inventaire() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewInventoryOpen, setIsNewInventoryOpen] = useState(false);
  const [currentScanBook, setCurrentScanBook] = useState("");

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = 
      item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bookCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "ok" && item.difference === 0) ||
      (statusFilter === "missing" && item.difference < 0) ||
      (statusFilter === "excess" && item.difference > 0);
    return matchesSearch && matchesStatus;
  });

  const handleExportReport = () => {
    const pdf = generateInventoryReport(mockInventory, new Date().toISOString());
    pdf.save('inventaire-bibliotheque.pdf');
    toast.success("Rapport d'inventaire exporté");
  };

  const handleStartInventory = () => {
    toast.info("Nouvel inventaire démarré - Scannez les livres");
    setIsNewInventoryOpen(false);
  };

  const totalExpected = mockInventory.reduce((sum, i) => sum + i.expectedQuantity, 0);
  const totalFound = mockInventory.reduce((sum, i) => sum + i.foundQuantity, 0);
  const missingCount = mockInventory.filter(i => i.difference < 0).reduce((sum, i) => sum + Math.abs(i.difference), 0);
  const completionRate = Math.round((mockInventory.length / mockBooks.length) * 100);

  const getDifferenceDisplay = (diff: number) => {
    if (diff === 0) {
      return <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" />OK</Badge>;
    } else if (diff < 0) {
      return <Badge variant="destructive" className="gap-1"><ArrowDown className="h-3 w-3" />{diff}</Badge>;
    } else {
      return <Badge className="bg-blue-500 gap-1"><ArrowUp className="h-3 w-3" />+{diff}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    const colors: Record<string, string> = {
      'Neuf': 'bg-emerald-500',
      'Bon': 'bg-blue-500',
      'Acceptable': 'bg-yellow-500',
      'Usé': 'bg-orange-500',
      'Manquant': 'bg-red-500'
    };
    return <Badge className={colors[condition] || 'bg-gray-500'}>{condition}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventaire Bibliothèque</h1>
          <p className="text-muted-foreground">Gestion et suivi de l'inventaire du fonds documentaire</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Dialog open={isNewInventoryOpen} onOpenChange={setIsNewInventoryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Inventaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Démarrer un Inventaire</DialogTitle>
                <DialogDescription>Configurez les paramètres de l'inventaire</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Zone à inventorier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Toute la bibliothèque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toute la bibliothèque</SelectItem>
                      {locations.map(loc => (
                        <SelectItem key={loc.code} value={loc.code}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      <SelectItem value="Manuel scolaire">Manuels scolaires</SelectItem>
                      <SelectItem value="Roman">Romans</SelectItem>
                      <SelectItem value="Référence">Références</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Responsable de l'inventaire</Label>
                  <Input placeholder="Nom du responsable" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Notes ou observations..." />
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Méthode d'inventaire</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Scan className="h-4 w-4" />
                      <span className="text-sm">Scanner le code-barres de chaque livre</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      <span className="text-sm">Ou saisir manuellement le code</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewInventoryOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleStartInventory}>
                  <Scan className="mr-2 h-4 w-4" />
                  Démarrer l'Inventaire
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livres Attendus</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpected}</div>
            <p className="text-xs text-muted-foreground">Dans le système</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livres Trouvés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalFound}</div>
            <p className="text-xs text-muted-foreground">Physiquement présents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manquants</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{missingCount}</div>
            <p className="text-xs text-muted-foreground">À rechercher</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Dernier inventaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Dernier Inventaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">15 Octobre 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Responsable</p>
              <p className="font-medium">Mme KOUADIO</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Livres vérifiés</p>
              <p className="font-medium">{mockInventory.length} / {mockBooks.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Écarts détectés</p>
              <p className="font-medium text-red-600">{missingCount} manquants</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone de scan rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input 
                placeholder="Scannez ou saisissez le code du livre..."
                value={currentScanBook}
                onChange={(e) => setCurrentScanBook(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentScanBook) {
                    toast.success(`Livre ${currentScanBook} enregistré dans l'inventaire`);
                    setCurrentScanBook("");
                  }
                }}
              />
            </div>
            <Button onClick={() => {
              if (currentScanBook) {
                toast.success(`Livre ${currentScanBook} enregistré`);
                setCurrentScanBook("");
              }
            }}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Résultats de l'Inventaire</CardTitle>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="ok">Conformes</SelectItem>
                  <SelectItem value="missing">Manquants</SelectItem>
                  <SelectItem value="excess">Excédentaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="text-center">Attendu</TableHead>
                <TableHead className="text-center">Trouvé</TableHead>
                <TableHead className="text-center">Écart</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Inventorié par</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{item.bookCode}</code>
                  </TableCell>
                  <TableCell className="font-medium">{item.bookTitle}</TableCell>
                  <TableCell className="text-center">{item.expectedQuantity}</TableCell>
                  <TableCell className="text-center">{item.foundQuantity}</TableCell>
                  <TableCell className="text-center">
                    {getDifferenceDisplay(item.difference)}
                  </TableCell>
                  <TableCell>
                    {getConditionBadge(item.condition)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {item.notes || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{item.inventoryBy}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.inventoryDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
