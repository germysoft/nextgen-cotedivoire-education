import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, Search, Plus, Download, User, Calendar,
  CheckCircle, XCircle, AlertCircle, Printer, RefreshCw, Ban
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
import { toast } from "sonner";
import { mockReaderCards, ReaderCard } from "@/data/mockLibrary";
import { generateReaderCard } from "@/components/bibliotheque/LibraryPDFGenerator";

export default function CartesLecteur() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewCardOpen, setIsNewCardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ReaderCard | null>(null);

  const filteredCards = mockReaderCards.filter(card => {
    const matchesSearch = 
      card.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrintCard = (card: ReaderCard) => {
    const pdf = generateReaderCard(card);
    pdf.save(`carte-lecteur-${card.number}.pdf`);
    toast.success("Carte de lecteur générée");
  };

  const handleSuspendCard = (card: ReaderCard) => {
    toast.info(`Carte ${card.number} suspendue`);
  };

  const handleRenewCard = (card: ReaderCard) => {
    toast.success(`Carte ${card.number} renouvelée jusqu'au 30/06/2026`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>;
      case 'Expirée':
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" />Expirée</Badge>;
      case 'Suspendue':
        return <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" />Suspendue</Badge>;
      case 'Perdue':
        return <Badge variant="outline" className="gap-1"><XCircle className="h-3 w-3" />Perdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const activeCount = mockReaderCards.filter(c => c.status === 'Active').length;
  const expiredCount = mockReaderCards.filter(c => c.status === 'Expirée').length;
  const suspendedCount = mockReaderCards.filter(c => c.status === 'Suspendue').length;
  const totalBorrowings = mockReaderCards.reduce((sum, c) => sum + c.totalBorrowings, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartes de Lecteur</h1>
          <p className="text-muted-foreground">Gestion des abonnements et cartes de bibliothèque</p>
        </div>
        <Dialog open={isNewCardOpen} onOpenChange={setIsNewCardOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Carte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une Carte de Lecteur</DialogTitle>
              <DialogDescription>Émettre une nouvelle carte pour un lecteur</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type de lecteur</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Élève">Élève</SelectItem>
                    <SelectItem value="Enseignant">Enseignant</SelectItem>
                    <SelectItem value="Personnel">Personnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Matricule ou recherche</Label>
                <Input placeholder="Rechercher un élève, enseignant..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date d'émission</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Date d'expiration</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Limite d'emprunts</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 livres (Élèves)</SelectItem>
                    <SelectItem value="5">5 livres (Personnel)</SelectItem>
                    <SelectItem value="10">10 livres (Enseignants)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-2">Information</p>
                <p className="text-muted-foreground">
                  Un numéro de carte unique sera automatiquement généré.
                  La carte pourra être imprimée après création.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewCardOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                toast.success("Carte de lecteur créée");
                setIsNewCardOpen(false);
              }}>
                Créer la Carte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Actives</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">En cours de validité</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Expirées</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiredCount}</div>
            <p className="text-xs text-muted-foreground">À renouveler</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspendues</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{suspendedCount}</div>
            <p className="text-xs text-muted-foreground">Pour non-retour ou pénalités</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emprunts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBorrowings}</div>
            <p className="text-xs text-muted-foreground">Depuis la création</p>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu carte */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu Carte de Lecteur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 items-start">
            <div className="w-80 h-48 bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 text-white shadow-lg">
              <div className="text-lg font-bold mb-1">CARTE DE LECTEUR</div>
              <div className="text-xs opacity-80 mb-4">Bibliothèque NextGen Éducation</div>
              
              <div className="flex gap-3">
                <div className="w-16 h-20 bg-white/20 rounded flex items-center justify-center text-xs">
                  PHOTO
                </div>
                <div className="flex-1">
                  <div className="font-bold">KOUASSI Jean</div>
                  <div className="text-xs opacity-80">N° LEC-2024-0001</div>
                  <div className="text-xs opacity-80 mt-1">Élève - 3ème A</div>
                  <div className="text-xs opacity-80">Valide jusqu'au: 30/06/2025</div>
                </div>
              </div>
              
              <div className="mt-3 flex gap-1">
                {Array(20).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-white h-6" 
                    style={{ width: Math.random() > 0.5 ? '2px' : '1px' }} 
                  />
                ))}
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <h4 className="font-medium">Informations de la carte</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Limite d'emprunts:</span>
                  <span className="ml-2 font-medium">3 livres</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Durée max:</span>
                  <span className="ml-2 font-medium">14 jours</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Renouvellements:</span>
                  <span className="ml-2 font-medium">1 fois</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Réservations:</span>
                  <span className="ml-2 font-medium">2 max</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4">
                <Printer className="mr-2 h-4 w-4" />
                Imprimer un modèle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Cartes</CardTitle>
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
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expirée">Expirée</SelectItem>
                  <SelectItem value="Suspendue">Suspendue</SelectItem>
                  <SelectItem value="Perdue">Perdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Carte</TableHead>
                <TableHead>Titulaire</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Émission</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-center">Emprunts</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Pénalités</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{card.number}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{card.userName}</div>
                        {card.userClass && (
                          <Badge variant="outline" className="text-xs">{card.userClass}</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{card.userType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(card.issueDate).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(card.expirationDate).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{card.currentBorrowings}</span>
                    <span className="text-muted-foreground">/{card.borrowLimit}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(card.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {card.penalties > 0 ? (
                      <span className="font-medium text-red-600">{card.penalties} FCFA</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handlePrintCard(card)}
                        title="Imprimer"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      {card.status === 'Active' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSuspendCard(card)}
                          title="Suspendre"
                        >
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {(card.status === 'Expirée' || card.status === 'Suspendue') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRenewCard(card)}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Renouveler
                        </Button>
                      )}
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
