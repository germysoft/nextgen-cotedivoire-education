import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookMarked, Search, Plus, Clock, CheckCircle, XCircle, Bell,
  Calendar, User, ArrowRight, AlertCircle
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
import { mockReservations, mockBooks, Reservation } from "@/data/mockLibrary";

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);

  const filteredReservations = mockReservations.filter(res => {
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

  const handleConvertToBorrowing = (reservation: Reservation) => {
    toast.success(`Réservation convertie en prêt pour ${reservation.userName}`);
  };

  const handleCancelReservation = (reservation: Reservation) => {
    toast.info(`Réservation annulée pour ${reservation.userName}`);
  };

  const handleSendNotification = (reservation: Reservation) => {
    toast.success(`Notification envoyée à ${reservation.userName}`);
  };

  const pendingCount = mockReservations.filter(r => r.status === 'En attente').length;
  const availableCount = mockReservations.filter(r => r.status === 'Disponible').length;
  const convertedCount = mockReservations.filter(r => r.status === 'Convertie').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réservations de Livres</h1>
          <p className="text-muted-foreground">Gestion des files d'attente et réservations</p>
        </div>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un livre" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBooks.map(book => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} ({book.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Matricule ou nom du lecteur *</Label>
                <Input placeholder="Rechercher un élève ou enseignant" />
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
              <Button onClick={() => {
                toast.success("Réservation enregistrée");
                setIsNewReservationOpen(false);
              }}>
                Réserver
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <div className="text-2xl font-bold">{availableCount}</div>
            <p className="text-xs text-muted-foreground">À envoyer</p>
          </CardContent>
        </Card>
      </div>

      {/* Livres à haute demande */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Livres les plus demandés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "L'Enfant Noir", code: "LIT-AFR-023", waiting: 2, available: 0 },
              { title: "Une Vie de Boy", code: "LIT-AFR-045", waiting: 1, available: 0 },
              { title: "Le Père Goriot", code: "LIT-FRA-089", waiting: 1, available: 1 },
            ].map((book, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-medium">{book.title}</div>
                <code className="text-xs text-muted-foreground">{book.code}</code>
                <div className="mt-2 flex justify-between text-sm">
                  <span>{book.waiting} en file d'attente</span>
                  <Badge variant={book.available > 0 ? "default" : "destructive"}>
                    {book.available} dispo
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <TableHead>Expiration</TableHead>
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
                    <Badge variant="outline" className="font-mono">
                      #{reservation.position}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reservation.status)}
                  </TableCell>
                  <TableCell>
                    {reservation.expirationDate ? (
                      <span className="text-sm">
                        {new Date(reservation.expirationDate).toLocaleDateString('fr-FR')}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {reservation.status === 'Disponible' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleConvertToBorrowing(reservation)}
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
    </div>
  );
}
