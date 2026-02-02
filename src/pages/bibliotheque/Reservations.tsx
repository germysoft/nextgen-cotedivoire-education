import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookMarked, Search, Plus, Clock, CheckCircle, XCircle, Bell,
  Calendar, User, ArrowRight, AlertCircle, Download, Trash2
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
import { mockReservations as initialReservations, mockBooks, Reservation } from "@/data/mockLibrary";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  // Nouveau formulaire
  const [newReservation, setNewReservation] = useState({
    bookId: "",
    userName: "",
    userMatricule: "",
    userClass: ""
  });

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.bookCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En attente':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>;
      case 'Disponible':
        return <Badge className="gap-1 bg-green-500"><CheckCircle className="h-3 w-3" />Disponible</Badge>;
      case 'Annulée':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Annulée</Badge>;
      case 'Convertie':
        return <Badge variant="outline" className="gap-1"><ArrowRight className="h-3 w-3" />Convertie en prêt</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddReservation = () => {
    if (!newReservation.bookId || !newReservation.userName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const selectedBook = mockBooks.find(b => b.id === newReservation.bookId);
    if (!selectedBook) return;

    // Calculer la position dans la file d'attente
    const existingForBook = reservations.filter(r => r.bookCode === selectedBook.code && r.status === 'En attente');
    const position = existingForBook.length + 1;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookId: selectedBook.id,
      bookCode: selectedBook.code,
      bookTitle: selectedBook.title,
      userId: `user-${Date.now()}`,
      userName: newReservation.userName,
      userClass: newReservation.userClass || undefined,
      reservationDate: new Date().toISOString(),
      expirationDate: null,
      status: selectedBook.available > 0 ? 'Disponible' : 'En attente',
      position: selectedBook.available > 0 ? 0 : position,
      notificationSent: false
    };

    setReservations([...reservations, newRes]);
    
    if (selectedBook.available > 0) {
      toast.success(`Livre disponible ! "${selectedBook.title}" réservé pour ${newReservation.userName}`);
    } else {
      toast.info(`${newReservation.userName} placé en position ${position} de la file d'attente`);
    }

    setNewReservation({ bookId: "", userName: "", userMatricule: "", userClass: "" });
    setIsNewReservationOpen(false);
  };

  const handleConvertToBorrowing = (reservation: Reservation) => {
    setReservations(reservations.map(r => 
      r.id === reservation.id 
        ? { ...r, status: 'Convertie' as const, position: 0 }
        : r
    ));
    toast.success(`Réservation convertie en prêt pour ${reservation.userName}`);
    setIsConvertDialogOpen(false);
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setReservations(reservations.map(r => 
      r.id === reservation.id 
        ? { ...r, status: 'Annulée' as const }
        : r
    ));
    
    // Mettre à jour les positions des autres en file d'attente
    const updatedReservations = reservations
      .filter(r => r.bookCode === reservation.bookCode && r.status === 'En attente' && r.id !== reservation.id)
      .map((r, index) => ({ ...r, position: index + 1 }));
    
    setReservations(prev => prev.map(r => {
      const updated = updatedReservations.find(ur => ur.id === r.id);
      return updated || (r.id === reservation.id ? { ...r, status: 'Annulée' as const } : r);
    }));
    
    toast.info(`Réservation annulée pour ${reservation.userName}`);
  };

  const handleSendNotification = (reservation: Reservation) => {
    setReservations(reservations.map(r => 
      r.id === reservation.id 
        ? { ...r, notificationSent: true }
        : r
    ));
    toast.success(`Notification envoyée à ${reservation.userName}`);
  };

  const handleSendAllNotifications = () => {
    const toNotify = reservations.filter(r => r.status === 'Disponible' && !r.notificationSent);
    setReservations(reservations.map(r => 
      r.status === 'Disponible' && !r.notificationSent
        ? { ...r, notificationSent: true }
        : r
    ));
    toast.success(`${toNotify.length} notification(s) envoyée(s)`);
  };

  const handleExportReservations = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liste des Réservations", 14, 20);
    doc.setFontSize(10);
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

    autoTable(doc, {
      startY: 38,
      head: [["Livre", "Lecteur", "Classe", "Date", "Position", "Statut"]],
      body: filteredReservations.map(r => [
        r.bookTitle,
        r.userName,
        r.userClass || "-",
        new Date(r.reservationDate).toLocaleDateString('fr-FR'),
        r.position > 0 ? `#${r.position}` : "-",
        r.status
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('reservations-bibliotheque.pdf');
    toast.success("Liste exportée en PDF");
  };

  const pendingCount = reservations.filter(r => r.status === 'En attente').length;
  const availableCount = reservations.filter(r => r.status === 'Disponible').length;
  const convertedCount = reservations.filter(r => r.status === 'Convertie').length;
  const notificationsToSend = reservations.filter(r => r.status === 'Disponible' && !r.notificationSent).length;

  // Calculer les livres les plus demandés
  const bookDemand = reservations
    .filter(r => r.status === 'En attente')
    .reduce((acc, r) => {
      acc[r.bookCode] = (acc[r.bookCode] || { title: r.bookTitle, code: r.bookCode, waiting: 0 });
      acc[r.bookCode].waiting++;
      return acc;
    }, {} as Record<string, { title: string; code: string; waiting: number }>);

  const topDemandedBooks = Object.values(bookDemand)
    .sort((a, b) => b.waiting - a.waiting)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réservations de Livres</h1>
          <p className="text-muted-foreground">Gestion des files d'attente et réservations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReservations}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          {notificationsToSend > 0 && (
            <Button variant="secondary" onClick={handleSendAllNotifications}>
              <Bell className="mr-2 h-4 w-4" />
              Notifier tous ({notificationsToSend})
            </Button>
          )}
          <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Réservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle Réservation</DialogTitle>
                <DialogDescription>Réserver un livre pour un lecteur</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Livre à réserver *</Label>
                  <Select value={newReservation.bookId} onValueChange={(v) => setNewReservation({...newReservation, bookId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un livre" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBooks.map(book => (
                        <SelectItem key={book.id} value={book.id}>
                          <div className="flex items-center gap-2">
                            <span>{book.title}</span>
                            <Badge variant={book.available > 0 ? "default" : "secondary"} className="text-xs">
                              {book.available > 0 ? `${book.available} dispo` : "Indisponible"}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nom du lecteur *</Label>
                  <Input 
                    placeholder="Nom complet"
                    value={newReservation.userName}
                    onChange={(e) => setNewReservation({...newReservation, userName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Matricule</Label>
                    <Input 
                      placeholder="Optionnel"
                      value={newReservation.userMatricule}
                      onChange={(e) => setNewReservation({...newReservation, userMatricule: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Input 
                      placeholder="Ex: 1ère A"
                      value={newReservation.userClass}
                      onChange={(e) => setNewReservation({...newReservation, userClass: e.target.value})}
                    />
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">Information</p>
                  <p className="text-muted-foreground">
                    Si le livre est actuellement emprunté, le lecteur sera placé en file d'attente.
                    Il recevra une notification dès que le livre sera disponible.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewReservationOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddReservation}>
                  <Plus className="mr-2 h-4 w-4" />
                  Réserver
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Livres non disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livres Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            <p className="text-xs text-muted-foreground">À récupérer sous 48h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converties en Prêt</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertedCount}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationsToSend}</div>
            <p className="text-xs text-muted-foreground">À envoyer</p>
          </CardContent>
        </Card>
      </div>

      {/* Livres à haute demande */}
      {topDemandedBooks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Livres les plus demandés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {topDemandedBooks.map((book, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="font-medium">{book.title}</div>
                  <code className="text-xs text-muted-foreground">{book.code}</code>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>{book.waiting} en file d'attente</span>
                    <Badge variant="destructive">0 dispo</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Réservations</CardTitle>
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
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                  <SelectItem value="Convertie">Convertie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livre</TableHead>
                <TableHead>Lecteur</TableHead>
                <TableHead>Date Réservation</TableHead>
                <TableHead className="text-center">Position</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <div className="font-medium">{reservation.bookTitle}</div>
                    <code className="text-xs text-muted-foreground">{reservation.bookCode}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{reservation.userName}</div>
                        {reservation.userClass && (
                          <Badge variant="outline" className="text-xs">{reservation.userClass}</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(reservation.reservationDate).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {reservation.position > 0 ? (
                      <Badge variant="outline" className="font-mono">
                        #{reservation.position}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reservation.status)}
                  </TableCell>
                  <TableCell>
                    {reservation.status === 'Disponible' && (
                      reservation.notificationSent ? (
                        <Badge variant="outline" className="text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Envoyée
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          En attente
                        </Badge>
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {reservation.status === 'Disponible' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setIsConvertDialogOpen(true);
                            }}
                          >
                            <ArrowRight className="mr-1 h-3 w-3" />
                            Prêter
                          </Button>
                          {!reservation.notificationSent && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendNotification(reservation)}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                      {reservation.status === 'En attente' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCancelReservation(reservation)}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
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

      {/* Convert to Borrowing Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convertir en Prêt</DialogTitle>
            <DialogDescription>
              Confirmer le prêt du livre "{selectedReservation?.bookTitle}" à {selectedReservation?.userName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livre:</span>
                <span className="font-medium">{selectedReservation?.bookTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lecteur:</span>
                <span className="font-medium">{selectedReservation?.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de prêt:</span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de retour prévue:</span>
                <span className="font-medium">
                  {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => selectedReservation && handleConvertToBorrowing(selectedReservation)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmer le prêt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
