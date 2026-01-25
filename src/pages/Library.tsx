import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Plus,
  Download,
  TrendingUp,
  Users,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { DataTableExport } from "@/components/data-table/DataTableExport";

const initialBooks = [
  { id: 1, title: "Mathématiques 6ème", author: "CEDA", category: "Manuel scolaire", quantity: 150, available: 142, borrowed: 8 },
  { id: 2, title: "Français 6ème", author: "CEDA", category: "Manuel scolaire", quantity: 150, available: 138, borrowed: 12 },
  { id: 3, title: "L'Enfant Noir", author: "Camara Laye", category: "Roman", quantity: 45, available: 32, borrowed: 13 },
  { id: 4, title: "Une Vie de Boy", author: "Ferdinand Oyono", category: "Roman", quantity: 40, available: 28, borrowed: 12 },
  { id: 5, title: "Dictionnaire Larousse", author: "Larousse", category: "Référence", quantity: 30, available: 25, borrowed: 5 },
];

const initialBorrowings = [
  { id: 1, student: "Kouassi Jean", matricule: "66800001A", book: "L'Enfant Noir", borrowDate: "2024-10-28", returnDate: "2024-11-11", status: "En cours" },
  { id: 2, student: "Diallo Fatou", matricule: "66800002A", book: "Une Vie de Boy", borrowDate: "2024-10-25", returnDate: "2024-11-08", status: "En retard" },
  { id: 3, student: "Traoré Yao", matricule: "66800003A", book: "Français 6ème", borrowDate: "2024-11-01", returnDate: "2024-11-15", status: "En cours" },
];

export default function Library() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(initialBooks);
  const [borrowings, setBorrowings] = useState(initialBorrowings);
  
  const [newBookDialogOpen, setNewBookDialogOpen] = useState(false);
  const [viewBookDialogOpen, setViewBookDialogOpen] = useState(false);
  const [editBookDialogOpen, setEditBookDialogOpen] = useState(false);
  const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof initialBooks[0] | null>(null);
  
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "Manuel scolaire", quantity: 1 });
  const [editForm, setEditForm] = useState({ title: "", author: "", category: "", quantity: 0 });

  const totalBooks = books.reduce((acc, book) => acc + book.quantity, 0);
  const totalBorrowed = books.reduce((acc, book) => acc + book.borrowed, 0);
  const lateReturns = borrowings.filter(b => b.status === "En retard").length;

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportColumns = [
    { key: "title", label: t('library.title_col') },
    { key: "author", label: t('library.author') },
    { key: "category", label: t('library.category') },
    { key: "quantity", label: t('library.quantity') },
    { key: "available", label: t('library.availableQty') },
    { key: "borrowed", label: t('library.borrowedQty') },
  ];

  const handleAddBook = () => {
    const id = Math.max(...books.map(b => b.id)) + 1;
    const newBookEntry = {
      id,
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      quantity: newBook.quantity,
      available: newBook.quantity,
      borrowed: 0
    };
    setBooks([...books, newBookEntry]);
    setNewBookDialogOpen(false);
    setNewBook({ title: "", author: "", category: "Manuel scolaire", quantity: 1 });
    toast.success("Livre ajouté avec succès");
  };

  const handleViewBook = (book: typeof initialBooks[0]) => {
    setSelectedBook(book);
    setViewBookDialogOpen(true);
  };

  const handleEditClick = (book: typeof initialBooks[0]) => {
    setSelectedBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      quantity: book.quantity
    });
    setEditBookDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedBook) return;
    
    const diff = editForm.quantity - selectedBook.quantity;
    setBooks(books.map(b => 
      b.id === selectedBook.id 
        ? { ...b, ...editForm, available: b.available + diff }
        : b
    ));
    setEditBookDialogOpen(false);
    toast.success("Livre modifié avec succès");
  };

  const handleDeleteClick = (book: typeof initialBooks[0]) => {
    setSelectedBook(book);
    setDeleteBookDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedBook) return;
    
    setBooks(books.filter(b => b.id !== selectedBook.id));
    setDeleteBookDialogOpen(false);
    toast.success("Livre supprimé avec succès");
  };

  const handleReturnBook = (borrowingId: number) => {
    const borrowing = borrowings.find(b => b.id === borrowingId);
    if (!borrowing) return;

    // Update borrowing status
    setBorrowings(borrowings.filter(b => b.id !== borrowingId));
    
    // Update book availability
    const book = books.find(b => b.title === borrowing.book);
    if (book) {
      setBooks(books.map(b => 
        b.id === book.id 
          ? { ...b, available: b.available + 1, borrowed: b.borrowed - 1 }
          : b
      ));
    }
    
    toast.success(`Livre "${borrowing.book}" retourné par ${borrowing.student}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('library.title')}</h1>
          <p className="text-muted-foreground">{t('library.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <DataTableExport
            data={books}
            columns={exportColumns}
            filename="catalogue-bibliotheque"
          />
          <Dialog open={newBookDialogOpen} onOpenChange={setNewBookDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('library.newBook')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau livre</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input 
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Ex: Mathématiques 5ème"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Auteur</Label>
                  <Input 
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Ex: CEDA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={newBook.category} onValueChange={(v) => setNewBook({ ...newBook, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manuel scolaire">Manuel scolaire</SelectItem>
                      <SelectItem value="Roman">Roman</SelectItem>
                      <SelectItem value="Référence">Référence</SelectItem>
                      <SelectItem value="Revue">Revue</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input 
                    type="number"
                    min="1"
                    value={newBook.quantity}
                    onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewBookDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleAddBook} disabled={!newBook.title || !newBook.author}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.totalBooks')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">{books.length} {t('library.titles')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.currentLoans')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBorrowed}</div>
            <p className="text-xs text-muted-foreground">{t('library.borrowedBooks')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.lateReturns')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lateReturns}</div>
            <p className="text-xs text-muted-foreground">{t('library.lateReturnsDesc')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.borrowRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((totalBorrowed / totalBooks) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{t('library.booksInCirculation')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>{t('library.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="books">
            <TabsList>
              <TabsTrigger value="books">{t('library.catalog')}</TabsTrigger>
              <TabsTrigger value="borrowings">{t('library.loans')}</TabsTrigger>
              <TabsTrigger value="stats">{t('library.statistics')}</TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('library.searchBook')}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('library.title_col')}</TableHead>
                    <TableHead>{t('library.author')}</TableHead>
                    <TableHead>{t('library.category')}</TableHead>
                    <TableHead>{t('library.quantity')}</TableHead>
                    <TableHead>{t('library.availableQty')}</TableHead>
                    <TableHead>{t('library.borrowedQty')}</TableHead>
                    <TableHead className="text-right">{t('library.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{book.category}</Badge>
                      </TableCell>
                      <TableCell>{book.quantity}</TableCell>
                      <TableCell>
                        <Badge variant="default">{book.available}</Badge>
                      </TableCell>
                      <TableCell>{book.borrowed}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleViewBook(book)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEditClick(book)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(book)} className="hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="borrowings" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('library.matricule')}</TableHead>
                    <TableHead>{t('library.studentName')}</TableHead>
                    <TableHead>{t('library.book')}</TableHead>
                    <TableHead>{t('library.borrowDate')}</TableHead>
                    <TableHead>{t('library.returnDate')}</TableHead>
                    <TableHead>{t('library.status')}</TableHead>
                    <TableHead className="text-right">{t('library.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowings.map((borrowing) => (
                    <TableRow key={borrowing.id}>
                      <TableCell className="font-mono text-sm">{borrowing.matricule}</TableCell>
                      <TableCell className="font-medium">{borrowing.student}</TableCell>
                      <TableCell>{borrowing.book}</TableCell>
                      <TableCell className="font-mono text-sm">{borrowing.borrowDate}</TableCell>
                      <TableCell className="font-mono text-sm">{borrowing.returnDate}</TableCell>
                      <TableCell>
                        <Badge variant={borrowing.status === "En retard" ? "destructive" : "default"}>
                          {borrowing.status === "En retard" ? t('library.overdue') : t('library.inProgress')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleReturnBook(borrowing.id)}>
                          {t('library.return')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {borrowings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun emprunt en cours
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid gap-4 md:grid-cols-3 py-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Livres les plus empruntés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {books.sort((a, b) => b.borrowed - a.borrowed).slice(0, 5).map((book, i) => (
                        <div key={book.id} className="flex justify-between items-center">
                          <span className="text-sm">{i + 1}. {book.title}</span>
                          <Badge variant="secondary">{book.borrowed}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Par catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...new Set(books.map(b => b.category))].map(cat => {
                        const count = books.filter(b => b.category === cat).reduce((acc, b) => acc + b.quantity, 0);
                        return (
                          <div key={cat} className="flex justify-between items-center">
                            <span className="text-sm">{cat}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Taux de disponibilité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center py-4">
                      {((books.reduce((acc, b) => acc + b.available, 0) / totalBooks) * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm text-center text-muted-foreground">des livres sont disponibles</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Book Dialog */}
      <Dialog open={viewBookDialogOpen} onOpenChange={setViewBookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du livre</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Titre</Label>
                  <p className="font-medium">{selectedBook.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Auteur</Label>
                  <p className="font-medium">{selectedBook.author}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Catégorie</Label>
                  <p className="font-medium">{selectedBook.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantité totale</Label>
                  <p className="font-medium">{selectedBook.quantity}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Disponibles</Label>
                  <Badge variant="default">{selectedBook.available}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Empruntés</Label>
                  <Badge variant="secondary">{selectedBook.borrowed}</Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewBookDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={editBookDialogOpen} onOpenChange={setEditBookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le livre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input 
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Auteur</Label>
              <Input 
                value={editForm.author}
                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manuel scolaire">Manuel scolaire</SelectItem>
                  <SelectItem value="Roman">Roman</SelectItem>
                  <SelectItem value="Référence">Référence</SelectItem>
                  <SelectItem value="Revue">Revue</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantité totale</Label>
              <Input 
                type="number"
                min="1"
                value={editForm.quantity}
                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBookDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
      <AlertDialog open={deleteBookDialogOpen} onOpenChange={setDeleteBookDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le livre <strong>"{selectedBook?.title}"</strong> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
