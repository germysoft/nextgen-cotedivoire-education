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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const totalBooks = mockBooks.reduce((acc, book) => acc + book.quantity, 0);
  const totalBorrowed = mockBooks.reduce((acc, book) => acc + book.borrowed, 0);
  const lateReturns = mockBorrowings.filter(b => b.status === "En retard").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('library.title')}</h1>
          <p className="text-muted-foreground">{t('library.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('library.export')}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('library.newBook')}
          </Button>
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
            <p className="text-xs text-muted-foreground">{mockBooks.length} {t('library.titles')}</p>
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
                        <Button size="sm" variant="ghost">{t('library.view')}</Button>
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
                  {mockBorrowings.map((borrowing) => (
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
                        <Button size="sm" variant="outline">
                          {t('library.return')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="stats">
              <div className="text-center py-12 text-muted-foreground">
                {t('library.detailedStats')}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
