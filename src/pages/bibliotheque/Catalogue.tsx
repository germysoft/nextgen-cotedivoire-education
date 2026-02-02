import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, Plus, Edit, Trash2, Eye, Download, Filter,
  QrCode, Barcode, BookCopy, MapPin, Save, X
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
import { mockBooks as initialBooks, bookCategories, bookSubcategories, locations, Book } from "@/data/mockLibrary";
import { generateCatalogPDF } from "@/components/bibliotheque/LibraryPDFGenerator";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Catalogue() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Formulaire nouveau livre
  const [newBook, setNewBook] = useState({
    code: "",
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    category: "",
    subcategory: "",
    year: new Date().getFullYear(),
    pages: 0,
    quantity: 1,
    location: "",
    shelf: "",
    condition: "Neuf",
    price: 0,
    description: "",
    keywords: ""
  });

  const resetNewBook = () => {
    setNewBook({
      code: "",
      isbn: "",
      title: "",
      author: "",
      publisher: "",
      category: "",
      subcategory: "",
      year: new Date().getFullYear(),
      pages: 0,
      quantity: 1,
      location: "",
      shelf: "",
      condition: "Neuf",
      price: 0,
      description: "",
      keywords: ""
    });
  };

  const generateBookCode = (category: string) => {
    const prefix = category.substring(0, 3).toUpperCase();
    const number = String(books.length + 1).padStart(3, '0');
    return `${prefix}-${number}`;
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const bookCode = newBook.code || generateBookCode(newBook.category);
    const newBookData: Book = {
      id: `book-${Date.now()}`,
      code: bookCode,
      isbn: newBook.isbn || `978-2-XXX-${Date.now().toString().slice(-5)}`,
      title: newBook.title,
      author: newBook.author,
      publisher: newBook.publisher || "Non spécifié",
      category: newBook.category,
      subcategory: newBook.subcategory || "-",
      year: newBook.year,
      pages: newBook.pages || 100,
      language: "Français",
      quantity: newBook.quantity,
      available: newBook.quantity,
      location: newBook.location || "A",
      shelf: newBook.shelf || "01",
      condition: newBook.condition as "Neuf" | "Bon" | "Acceptable" | "Usé",
      price: newBook.price,
      description: newBook.description || "",
      keywords: newBook.keywords ? newBook.keywords.split(",").map(k => k.trim()) : [],
      dateAdded: new Date().toISOString(),
      lastInventory: new Date().toISOString()
    };

    setBooks([...books, newBookData]);
    toast.success(`Livre "${newBook.title}" ajouté au catalogue`);
    resetNewBook();
    setIsAddDialogOpen(false);
  };

  const handleEditBook = () => {
    if (!selectedBook) return;

    setBooks(books.map(book => 
      book.id === selectedBook.id ? selectedBook : book
    ));
    toast.success(`Livre "${selectedBook.title}" modifié`);
    setIsEditDialogOpen(false);
  };

  const handleDeleteBook = () => {
    if (!selectedBook) return;

    setBooks(books.filter(book => book.id !== selectedBook.id));
    toast.success(`Livre "${selectedBook.title}" supprimé du catalogue`);
    setIsDeleteDialogOpen(false);
    setSelectedBook(null);
  };

  const handleExportCatalog = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Catalogue de la Bibliothèque", 14, 20);
    doc.setFontSize(10);
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);
    doc.text(`Total: ${filteredBooks.length} ouvrages`, 14, 34);

    autoTable(doc, {
      startY: 42,
      head: [["Code", "Titre", "Auteur", "Catégorie", "Dispo.", "État"]],
      body: filteredBooks.map(book => [
        book.code,
        book.title,
        book.author,
        book.category,
        `${book.available}/${book.quantity}`,
        book.condition
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('catalogue-bibliotheque.pdf');
    toast.success("Catalogue exporté en PDF");
  };

  const handleGenerateQR = (book: Book) => {
    setSelectedBook(book);
    setIsQrDialogOpen(true);
  };

  const handlePrintQRCode = () => {
    if (!selectedBook) return;
    
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Étiquette Livre", 14, 20);
    doc.setFontSize(10);
    doc.text(`Code: ${selectedBook.code}`, 14, 30);
    doc.text(`Titre: ${selectedBook.title}`, 14, 38);
    doc.text(`Auteur: ${selectedBook.author}`, 14, 46);
    doc.text(`ISBN: ${selectedBook.isbn}`, 14, 54);
    doc.text(`Emplacement: ${selectedBook.location} - ${selectedBook.shelf}`, 14, 62);
    
    // Simuler un code-barres
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 30; i++) {
      const width = Math.random() > 0.5 ? 2 : 1;
      doc.rect(14 + i * 3, 70, width, 20, 'F');
    }
    doc.text(selectedBook.code, 14, 98);
    
    doc.save(`etiquette-${selectedBook.code}.pdf`);
    toast.success("Étiquette QR générée");
    setIsQrDialogOpen(false);
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
                    <Label>Code (auto-généré si vide)</Label>
                    <Input 
                      placeholder="Ex: LIT-AFR-024" 
                      value={newBook.code}
                      onChange={(e) => setNewBook({...newBook, code: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ISBN</Label>
                    <Input 
                      placeholder="978-X-XXX-XXXXX-X"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input 
                    placeholder="Titre du livre"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Auteur *</Label>
                    <Input 
                      placeholder="Nom de l'auteur"
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Éditeur</Label>
                    <Input 
                      placeholder="Maison d'édition"
                      value={newBook.publisher}
                      onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie *</Label>
                    <Select value={newBook.category} onValueChange={(v) => setNewBook({...newBook, category: v})}>
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
                    <Input 
                      placeholder="Sous-catégorie"
                      value={newBook.subcategory}
                      onChange={(e) => setNewBook({...newBook, subcategory: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Année</Label>
                    <Input 
                      type="number" 
                      placeholder="2024"
                      value={newBook.year}
                      onChange={(e) => setNewBook({...newBook, year: parseInt(e.target.value) || new Date().getFullYear()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre de pages</Label>
                    <Input 
                      type="number" 
                      placeholder="200"
                      value={newBook.pages || ""}
                      onChange={(e) => setNewBook({...newBook, pages: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantité *</Label>
                    <Input 
                      type="number" 
                      placeholder="1"
                      value={newBook.quantity}
                      onChange={(e) => setNewBook({...newBook, quantity: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emplacement</Label>
                    <Select value={newBook.location} onValueChange={(v) => setNewBook({...newBook, location: v})}>
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
                    <Input 
                      placeholder="Ex: A-01"
                      value={newBook.shelf}
                      onChange={(e) => setNewBook({...newBook, shelf: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>État</Label>
                    <Select value={newBook.condition} onValueChange={(v) => setNewBook({...newBook, condition: v})}>
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
                    <Input 
                      type="number" 
                      placeholder="5000"
                      value={newBook.price || ""}
                      onChange={(e) => setNewBook({...newBook, price: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Description du livre..."
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mots-clés (séparés par des virgules)</Label>
                  <Input 
                    placeholder="roman, afrique, colonisation"
                    value={newBook.keywords}
                    onChange={(e) => setNewBook({...newBook, keywords: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { resetNewBook(); setIsAddDialogOpen(false); }}>
                  Annuler
                </Button>
                <Button onClick={handleAddBook}>
                  <Plus className="mr-2 h-4 w-4" />
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
            <div className="text-2xl font-bold">{books.reduce((sum, b) => sum + b.quantity, 0)}</div>
            <p className="text-xs text-muted-foreground">{books.length} titres différents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {books.reduce((sum, b) => sum + b.available, 0)}
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
              {books.reduce((sum, b) => sum + (b.quantity - b.available), 0)}
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
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedBook({...book});
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleGenerateQR(book)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
                  {selectedBook.keywords?.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{keyword}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le livre</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input 
                    value={selectedBook.code}
                    onChange={(e) => setSelectedBook({...selectedBook, code: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ISBN</Label>
                  <Input 
                    value={selectedBook.isbn}
                    onChange={(e) => setSelectedBook({...selectedBook, isbn: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input 
                  value={selectedBook.title}
                  onChange={(e) => setSelectedBook({...selectedBook, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Auteur</Label>
                  <Input 
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({...selectedBook, author: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Éditeur</Label>
                  <Input 
                    value={selectedBook.publisher}
                    onChange={(e) => setSelectedBook({...selectedBook, publisher: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input 
                    type="number"
                    value={selectedBook.quantity}
                    onChange={(e) => setSelectedBook({...selectedBook, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Disponibles</Label>
                  <Input 
                    type="number"
                    value={selectedBook.available}
                    onChange={(e) => setSelectedBook({...selectedBook, available: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>État</Label>
                  <Select 
                    value={selectedBook.condition} 
                    onValueChange={(v) => setSelectedBook({...selectedBook, condition: v as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Neuf">Neuf</SelectItem>
                      <SelectItem value="Bon">Bon</SelectItem>
                      <SelectItem value="Acceptable">Acceptable</SelectItem>
                      <SelectItem value="Usé">Usé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Emplacement</Label>
                  <Input 
                    value={selectedBook.location}
                    onChange={(e) => setSelectedBook({...selectedBook, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Étagère</Label>
                  <Input 
                    value={selectedBook.shelf}
                    onChange={(e) => setSelectedBook({...selectedBook, shelf: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditBook}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Étiquette & Code-barres</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-center space-y-2">
                  <div className="font-mono text-lg font-bold">{selectedBook.code}</div>
                  <div className="text-sm">{selectedBook.title}</div>
                  <div className="text-xs text-muted-foreground">{selectedBook.author}</div>
                  <div className="flex justify-center gap-1 my-2">
                    {Array.from({length: 20}).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-foreground" 
                        style={{width: Math.random() > 0.5 ? 2 : 1, height: 40}}
                      />
                    ))}
                  </div>
                  <div className="font-mono text-xs">{selectedBook.isbn}</div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsQrDialogOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={handlePrintQRCode}>
                  <Download className="mr-2 h-4 w-4" />
                  Imprimer l'étiquette
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedBook?.title}" du catalogue ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}