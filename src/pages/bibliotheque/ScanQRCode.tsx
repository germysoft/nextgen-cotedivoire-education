import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  QrCode, 
  Scan, 
  Camera, 
  BookOpen, 
  ArrowLeftRight, 
  Download, 
  Printer, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  BookMarked,
  RefreshCw
} from "lucide-react";
import { generateQRCodeBase64 } from "@/components/convocations/QRCodeGenerator";
import jsPDF from 'jspdf';

// Types
interface Book {
  id: string;
  titre: string;
  auteur: string;
  isbn: string;
  cote: string;
  statut: "disponible" | "emprunte" | "reserve";
  emprunteur?: string;
  dateRetourPrevue?: string;
  qrCode?: string;
}

interface ScanHistory {
  id: string;
  bookId: string;
  titre: string;
  operation: "emprunt" | "retour" | "verification";
  timestamp: string;
  operateur: string;
  eleve?: string;
}

// Mock data
const mockBooks: Book[] = [
  { id: "LIV001", titre: "Les Misérables", auteur: "Victor Hugo", isbn: "978-2-07-040850-4", cote: "LIT-001", statut: "disponible" },
  { id: "LIV002", titre: "Mathématiques Terminale", auteur: "Collection Déclic", isbn: "978-2-01-135421-8", cote: "MAT-T01", statut: "emprunte", emprunteur: "Koné Aminata", dateRetourPrevue: "2024-02-15" },
  { id: "LIV003", titre: "Physique-Chimie 3ème", auteur: "Bordas", isbn: "978-2-04-732896-5", cote: "PHY-301", statut: "disponible" },
  { id: "LIV004", titre: "Histoire de l'Afrique", auteur: "Joseph Ki-Zerbo", isbn: "978-2-7087-0585-9", cote: "HIS-AF1", statut: "reserve" },
  { id: "LIV005", titre: "Anglais Première", auteur: "Hatier", isbn: "978-2-218-95628-3", cote: "ANG-101", statut: "disponible" },
];

const mockScanHistory: ScanHistory[] = [
  { id: "SC001", bookId: "LIV002", titre: "Mathématiques Terminale", operation: "emprunt", timestamp: "2024-01-20 09:15", operateur: "Mme Touré", eleve: "Koné Aminata" },
  { id: "SC002", bookId: "LIV003", titre: "Physique-Chimie 3ème", operation: "retour", timestamp: "2024-01-19 14:30", operateur: "M. Diabaté", eleve: "Traoré Moussa" },
  { id: "SC003", bookId: "LIV001", titre: "Les Misérables", operation: "verification", timestamp: "2024-01-19 10:00", operateur: "Mme Touré" },
];

const mockEleves = [
  { id: "ELV001", nom: "Koné Aminata", classe: "Terminale A" },
  { id: "ELV002", nom: "Traoré Moussa", classe: "3ème B" },
  { id: "ELV003", nom: "Coulibaly Fatou", classe: "1ère D" },
  { id: "ELV004", nom: "Diallo Ibrahim", classe: "2nde C" },
];

export default function ScanQRCode() {
  const [activeTab, setActiveTab] = useState("scan");
  const [scannedCode, setScannedCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedEleve, setSelectedEleve] = useState("");
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>(mockScanHistory);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [isScanning, setIsScanning] = useState(false);
  const [generatedQRCodes, setGeneratedQRCodes] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Générer les QR codes pour tous les livres
  useEffect(() => {
    const generateAllQRCodes = async () => {
      const codes: {[key: string]: string} = {};
      for (const book of books) {
        const qrData = JSON.stringify({
          id: book.id,
          isbn: book.isbn,
          cote: book.cote
        });
        codes[book.id] = await generateQRCodeBase64(qrData, { width: 150 });
      }
      setGeneratedQRCodes(codes);
    };
    generateAllQRCodes();
  }, [books]);

  // Simuler le scan de QR code
  const startScanning = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // Simulation d'un scan après 2 secondes
      setTimeout(() => {
        const randomBook = books[Math.floor(Math.random() * books.length)];
        handleScanResult(randomBook.id);
        stopScanning();
      }, 2000);
    } catch (error) {
      toast.error("Impossible d'accéder à la caméra");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleScanResult = (code: string) => {
    setScannedCode(code);
    const book = books.find(b => b.id === code || b.isbn === code);
    if (book) {
      setSelectedBook(book);
      toast.success(`Livre trouvé: ${book.titre}`);
    } else {
      toast.error("Livre non trouvé dans le catalogue");
    }
  };

  const handleManualSearch = () => {
    const book = books.find(b => 
      b.id.toLowerCase() === manualCode.toLowerCase() || 
      b.isbn === manualCode ||
      b.cote.toLowerCase() === manualCode.toLowerCase()
    );
    if (book) {
      setSelectedBook(book);
      toast.success(`Livre trouvé: ${book.titre}`);
    } else {
      toast.error("Livre non trouvé");
    }
  };

  const handleEmprunt = () => {
    if (!selectedBook || !selectedEleve) {
      toast.error("Veuillez sélectionner un élève");
      return;
    }

    const eleve = mockEleves.find(e => e.id === selectedEleve);
    const dateRetour = new Date();
    dateRetour.setDate(dateRetour.getDate() + 14);

    setBooks(prev => prev.map(b => 
      b.id === selectedBook.id 
        ? { ...b, statut: "emprunte" as const, emprunteur: eleve?.nom, dateRetourPrevue: dateRetour.toISOString().split('T')[0] }
        : b
    ));

    const newScan: ScanHistory = {
      id: `SC${Date.now()}`,
      bookId: selectedBook.id,
      titre: selectedBook.titre,
      operation: "emprunt",
      timestamp: new Date().toLocaleString('fr-FR'),
      operateur: "Bibliothécaire",
      eleve: eleve?.nom
    };
    setScanHistory(prev => [newScan, ...prev]);

    toast.success(`Emprunt enregistré pour ${eleve?.nom}`);
    setSelectedBook(null);
    setSelectedEleve("");
  };

  const handleRetour = () => {
    if (!selectedBook) return;

    setBooks(prev => prev.map(b => 
      b.id === selectedBook.id 
        ? { ...b, statut: "disponible" as const, emprunteur: undefined, dateRetourPrevue: undefined }
        : b
    ));

    const newScan: ScanHistory = {
      id: `SC${Date.now()}`,
      bookId: selectedBook.id,
      titre: selectedBook.titre,
      operation: "retour",
      timestamp: new Date().toLocaleString('fr-FR'),
      operateur: "Bibliothécaire",
      eleve: selectedBook.emprunteur
    };
    setScanHistory(prev => [newScan, ...prev]);

    toast.success("Retour enregistré avec succès");
    setSelectedBook(null);
  };

  const exportQRCodesPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(18);
    doc.text("QR Codes - Catalogue Bibliothèque", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 28, { align: "center" });

    let yPos = 45;
    const qrSize = 35;
    const colWidth = 60;
    let col = 0;

    for (const book of books) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
        col = 0;
      }

      const xPos = 15 + (col * colWidth);
      
      if (generatedQRCodes[book.id]) {
        doc.addImage(generatedQRCodes[book.id], 'PNG', xPos, yPos, qrSize, qrSize);
      }
      
      doc.setFontSize(8);
      doc.text(book.id, xPos + qrSize / 2, yPos + qrSize + 5, { align: "center" });
      doc.text(book.cote, xPos + qrSize / 2, yPos + qrSize + 10, { align: "center" });
      doc.setFontSize(6);
      const shortTitle = book.titre.length > 20 ? book.titre.substring(0, 20) + "..." : book.titre;
      doc.text(shortTitle, xPos + qrSize / 2, yPos + qrSize + 15, { align: "center" });

      col++;
      if (col >= 3) {
        col = 0;
        yPos += qrSize + 25;
      }
    }

    doc.save("qrcodes-bibliotheque.pdf");
    toast.success("PDF des QR codes généré");
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "disponible":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" /> Disponible</Badge>;
      case "emprunte":
        return <Badge className="bg-orange-100 text-orange-800"><Clock className="h-3 w-3 mr-1" /> Emprunté</Badge>;
      case "reserve":
        return <Badge className="bg-blue-100 text-blue-800"><BookMarked className="h-3 w-3 mr-1" /> Réservé</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  const filteredBooks = books.filter(book =>
    book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.cote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            Scan QR Code - Bibliothèque
          </h1>
          <p className="text-muted-foreground mt-1">
            Système de gestion des emprunts et retours par QR Code
          </p>
        </div>
        <Button onClick={exportQRCodesPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Exporter tous les QR codes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scan" className="gap-2">
            <Scan className="h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="generate" className="gap-2">
            <QrCode className="h-4 w-4" />
            Générer QR
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Opérations
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Onglet Scanner */}
        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Scanner avec caméra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {isScanning ? (
                    <div className="relative w-full h-full">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-4 border-primary rounded-lg animate-pulse" />
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 py-2">
                        <RefreshCw className="h-4 w-4 inline animate-spin mr-2" />
                        Recherche du QR code...
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Cliquez sur Scanner pour démarrer</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button onClick={startScanning} className="flex-1 gap-2">
                      <Scan className="h-4 w-4" />
                      Démarrer le scan
                    </Button>
                  ) : (
                    <Button onClick={stopScanning} variant="destructive" className="flex-1 gap-2">
                      <XCircle className="h-4 w-4" />
                      Arrêter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Recherche manuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ID, ISBN ou Cote du livre</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: LIV001, 978-2-07-040850-4..."
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                    />
                    <Button onClick={handleManualSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedBook && (
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedBook.titre}</h3>
                        <p className="text-muted-foreground">{selectedBook.auteur}</p>
                      </div>
                      {getStatutBadge(selectedBook.statut)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">ID:</span> {selectedBook.id}</div>
                      <div><span className="text-muted-foreground">Cote:</span> {selectedBook.cote}</div>
                      <div className="col-span-2"><span className="text-muted-foreground">ISBN:</span> {selectedBook.isbn}</div>
                    </div>

                    {selectedBook.statut === "emprunte" && (
                      <div className="p-2 bg-orange-50 rounded text-sm">
                        <p><strong>Emprunté par:</strong> {selectedBook.emprunteur}</p>
                        <p><strong>Retour prévu:</strong> {selectedBook.dateRetourPrevue}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {selectedBook.statut === "disponible" && (
                        <>
                          <Select value={selectedEleve} onValueChange={setSelectedEleve}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Sélectionner un élève" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockEleves.map(eleve => (
                                <SelectItem key={eleve.id} value={eleve.id}>
                                  {eleve.nom} - {eleve.classe}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button onClick={handleEmprunt} className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            Emprunter
                          </Button>
                        </>
                      )}
                      {selectedBook.statut === "emprunte" && (
                        <Button onClick={handleRetour} variant="outline" className="flex-1 gap-2">
                          <ArrowLeftRight className="h-4 w-4" />
                          Enregistrer le retour
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Générer QR */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Codes du catalogue
                </span>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" onClick={exportQRCodesPDF} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimer tous
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredBooks.map(book => (
                  <Card key={book.id} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-2">
                      {generatedQRCodes[book.id] ? (
                        <img src={generatedQRCodes[book.id]} alt={`QR ${book.id}`} className="w-24 h-24" />
                      ) : (
                        <div className="w-24 h-24 bg-muted rounded flex items-center justify-center">
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{book.id}</p>
                    <p className="font-semibold text-sm truncate" title={book.titre}>{book.titre}</p>
                    <p className="text-xs text-muted-foreground">{book.cote}</p>
                    <div className="mt-2">
                      {getStatutBadge(book.statut)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `qr-${book.id}.png`;
                        link.href = generatedQRCodes[book.id];
                        link.click();
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Télécharger
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Opérations rapides */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <BookOpen className="h-5 w-5" />
                  Emprunt rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Scanner ou saisir le code du livre</Label>
                  <div className="flex gap-2">
                    <Input placeholder="ID ou ISBN du livre" />
                    <Button variant="outline">
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Élève emprunteur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEleves.map(eleve => (
                        <SelectItem key={eleve.id} value={eleve.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {eleve.nom} - {eleve.classe}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Valider l'emprunt
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <ArrowLeftRight className="h-5 w-5" />
                  Retour rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Scanner ou saisir le code du livre</Label>
                  <div className="flex gap-2">
                    <Input placeholder="ID ou ISBN du livre" />
                    <Button variant="outline">
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    Scannez le QR code du livre pour afficher automatiquement les informations d'emprunt
                  </p>
                </div>
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Enregistrer le retour
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Livres actuellement empruntés</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livre</TableHead>
                    <TableHead>Emprunteur</TableHead>
                    <TableHead>Date retour</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.filter(b => b.statut === "emprunte").map(book => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{book.titre}</p>
                          <p className="text-xs text-muted-foreground">{book.id} - {book.cote}</p>
                        </div>
                      </TableCell>
                      <TableCell>{book.emprunteur}</TableCell>
                      <TableCell>{book.dateRetourPrevue}</TableCell>
                      <TableCell>
                        {new Date(book.dateRetourPrevue!) < new Date() ? (
                          <Badge variant="destructive">En retard</Badge>
                        ) : (
                          <Badge variant="secondary">En cours</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedBook(book);
                            handleRetour();
                          }}
                        >
                          Retour
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historique des opérations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Opération</TableHead>
                    <TableHead>Livre</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Opérateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanHistory.map(scan => (
                    <TableRow key={scan.id}>
                      <TableCell className="font-mono text-sm">{scan.timestamp}</TableCell>
                      <TableCell>
                        {scan.operation === "emprunt" && (
                          <Badge className="bg-green-100 text-green-800">Emprunt</Badge>
                        )}
                        {scan.operation === "retour" && (
                          <Badge className="bg-blue-100 text-blue-800">Retour</Badge>
                        )}
                        {scan.operation === "verification" && (
                          <Badge variant="secondary">Vérification</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{scan.titre}</p>
                          <p className="text-xs text-muted-foreground">{scan.bookId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{scan.eleve || "-"}</TableCell>
                      <TableCell>{scan.operateur}</TableCell>
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
