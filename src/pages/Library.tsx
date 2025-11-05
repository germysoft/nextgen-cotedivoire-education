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
  AlertCircle
} from "lucide-react";

const mockBooks = [
  { id: 1, title: "Mathématiques 6ème", author: "CEDA", category: "Manuel scolaire", quantity: 150, available: 142, borrowed: 8 },
  { id: 2, title: "Français 6ème", author: "CEDA", category: "Manuel scolaire", quantity: 150, available: 138, borrowed: 12 },
  { id: 3, title: "L'Enfant Noir", author: "Camara Laye", category: "Roman", quantity: 45, available: 32, borrowed: 13 },
  { id: 4, title: "Une Vie de Boy", author: "Ferdinand Oyono", category: "Roman", quantity: 40, available: 28, borrowed: 12 },
  { id: 5, title: "Dictionnaire Larousse", author: "Larousse", category: "Référence", quantity: 30, available: 25, borrowed: 5 },
];

const mockBorrowings = [
  { id: 1, student: "Kouassi Jean", matricule: "66800001A", book: "L'Enfant Noir", borrowDate: "2024-10-28", returnDate: "2024-11-11", status: "En cours" },
  { id: 2, student: "Diallo Fatou", matricule: "66800002A", book: "Une Vie de Boy", borrowDate: "2024-10-25", returnDate: "2024-11-08", status: "En retard" },
  { id: 3, student: "Traoré Yao", matricule: "66800003A", book: "Français 6ème", borrowDate: "2024-11-01", returnDate: "2024-11-15", status: "En cours" },
];

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");

  const totalBooks = mockBooks.reduce((acc, book) => acc + book.quantity, 0);
  const totalBorrowed = mockBooks.reduce((acc, book) => acc + book.borrowed, 0);
  const lateReturns = mockBorrowings.filter(b => b.status === "En retard").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion de la Bibliothèque</h1>
          <p className="text-muted-foreground">Livres, manuels et emprunts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Livre
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Livres</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">{mockBooks.length} titres</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emprunts en cours</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBorrowed}</div>
            <p className="text-xs text-muted-foreground">Livres empruntés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lateReturns}</div>
            <p className="text-xs text-muted-foreground">Retours en retard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'emprunt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((totalBorrowed / totalBooks) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Livres en circulation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Bibliothèque</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="books">
            <TabsList>
              <TabsTrigger value="books">Catalogue</TabsTrigger>
              <TabsTrigger value="borrowings">Emprunts</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un livre..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead>Empruntés</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBooks.map((book) => (
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
                        <Button size="sm" variant="ghost">Voir</Button>
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
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom de l'Élève</TableHead>
                    <TableHead>Livre</TableHead>
                    <TableHead>Date d'emprunt</TableHead>
                    <TableHead>Date de retour</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBorrowings.map((borrowing) => (
                    <TableRow key={borrowing.id}>
                      <TableCell className="font-mono text-sm">{borrowing.matricule}</TableCell>
                      <TableCell className="font-medium">{borrowing.student}</TableCell>
                      <TableCell>{borrowing.book}</TableCell>
                      <TableCell className="font-mono text-sm">{borrowing.borrowDate}</TableCell>
                      <TableCell className="font-mono text-sm">{borrowing.returnDate}</TableCell>
                      <TableCell>
                        <Badge variant={borrowing.status === "En retard" ? "destructive" : "default"}>
                          {borrowing.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Retourner
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="stats">
              <div className="text-center py-12 text-muted-foreground">
                Statistiques détaillées à venir
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
