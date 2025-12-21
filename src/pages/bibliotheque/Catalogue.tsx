import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, Plus, Edit, Trash2, Eye, Download, Filter,
  QrCode, Barcode, BookCopy, MapPin
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
import { toast } from "sonner";
import { mockBooks, bookCategories, bookSubcategories, locations, Book } from "@/data/mockLibrary";
import { generateCatalogPDF } from "@/components/bibliotheque/LibraryPDFGenerator";

export default function Catalogue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportCatalog = () => {
    const pdf = generateCatalogPDF(filteredBooks);
    pdf.save('catalogue-bibliotheque.pdf');
    toast.success("Catalogue exporté en PDF");
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Neuf': return 'bg-emerald-500';
      case 'Bon': return 'bg-blue-500';
      case 'Acceptable': return 'bg-yellow-500';
      case 'Usé': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalogue des Livres</h1>
          <p className="text-muted-foreground">Gestion complète du fonds documentaire</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCatalog}>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Livre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau livre</DialogTitle>
                <DialogDescription>Remplissez les informations du livre</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Code *</Label>
                    <Input placeholder="Ex: LIT-AFR-024" />
                  </div>
                  <div className="space-y-2">
                    <Label>ISBN</Label>
                    <Input placeholder="978-X-XXX-XXXXX-X" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input placeholder="Titre du livre" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Auteur *</Label>
                    <Input placeholder="Nom de l'auteur" />
                  </div>
                  <div className="space-y-2">
                    <Label>Éditeur</Label>
                    <Input placeholder="Maison d'édition" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sous-catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Année</Label>
                    <Input type="number" placeholder="2024" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre de pages</Label>
                    <Input type="number" placeholder="200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantité *</Label>
                    <Input type="number" placeholder="1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emplacement</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(loc => (
                          <SelectItem key={loc.code} value={loc.code}>{loc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Étagère</Label>
                    <Input placeholder="Ex: A-01" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>État</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Neuf">Neuf</SelectItem>
                        <SelectItem value="Bon">Bon</SelectItem>
                        <SelectItem value="Acceptable">Acceptable</SelectItem>
                        <SelectItem value="Usé">Usé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prix (FCFA)</Label>
                    <Input type="number" placeholder="5000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Description du livre..." />
                </div>
                <div className="space-y-2">
                  <Label>Mots-clés (séparés par des virgules)</Label>
                  <Input placeholder="roman, afrique, colonisation" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => {
                  toast.success("Livre ajouté au catalogue");
                  setIsAddDialogOpen(false);
                }}>
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ouvrages</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBooks.reduce((sum, b) => sum + b.quantity, 0)}</div>
            <p className="text-xs text-muted-foreground">{mockBooks.length} titres différents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockBooks.reduce((sum, b) => sum + b.available, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Prêts à emprunter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Prêt</CardTitle>
            <Barcode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockBooks.reduce((sum, b) => sum + (b.quantity - b.available), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Actuellement empruntés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookCategories.length}</div>
            <p className="text-xs text-muted-foreground">Types de documents</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Catalogue des Livres</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par titre, auteur, code, ISBN..." 
                  className="pl-10 w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {bookCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
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
                <TableHead>Auteur</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead className="text-center">Dispo.</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{book.code}</code>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{book.title}</div>
                    <div className="text-xs text-muted-foreground">{book.isbn}</div>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {book.location} - {book.shelf}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={book.available > 0 ? "default" : "destructive"}>
                      {book.available}/{book.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getConditionColor(book.condition)}`} />
                      <span className="text-sm">{book.condition}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Book Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du livre</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-40 bg-muted rounded-lg flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold">{selectedBook.title}</h3>
                  <p className="text-muted-foreground">{selectedBook.author}</p>
                  <div className="flex gap-2">
                    <Badge>{selectedBook.category}</Badge>
                    <Badge variant="outline">{selectedBook.subcategory}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Code:</strong> {selectedBook.code}</div>
                <div><strong>ISBN:</strong> {selectedBook.isbn}</div>
                <div><strong>Éditeur:</strong> {selectedBook.publisher}</div>
                <div><strong>Année:</strong> {selectedBook.year}</div>
                <div><strong>Pages:</strong> {selectedBook.pages}</div>
                <div><strong>Langue:</strong> {selectedBook.language}</div>
                <div><strong>Emplacement:</strong> {selectedBook.location} - {selectedBook.shelf}</div>
                <div><strong>État:</strong> {selectedBook.condition}</div>
                <div><strong>Quantité totale:</strong> {selectedBook.quantity}</div>
                <div><strong>Disponibles:</strong> {selectedBook.available}</div>
                <div><strong>Prix:</strong> {selectedBook.price.toLocaleString()} FCFA</div>
                <div><strong>Dernier inventaire:</strong> {new Date(selectedBook.lastInventory).toLocaleDateString('fr-FR')}</div>
              </div>
              
              <div>
                <strong>Description:</strong>
                <p className="text-muted-foreground mt-1">{selectedBook.description}</p>
              </div>
              
              <div>
                <strong>Mots-clés:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedBook.keywords.map(kw => (
                    <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
