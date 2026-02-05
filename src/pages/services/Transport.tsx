import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, MapPin, User, Clock, AlertCircle, CheckCircle2, Navigation, Plus, Edit, Trash2, Eye, DollarSign, Search, Wrench, FileText, Download, Printer, Phone, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BusVehicle {
  id: number;
  numero: string;
  chauffeur: string;
  capacite: number;
  inscrits: number;
  itineraire: string;
  statut: "En service" | "Maintenance" | "Hors service";
  derniere_maintenance: string;
  telephone?: string;
}

interface Itineraire {
  id: number;
  nom: string;
  arrets: string[];
  duree: string;
  distance: string;
}

interface EleveTransport {
  id: number;
  nom: string;
  classe: string;
  bus: string;
  arret: string;
  statut: "Payé" | "Partiel" | "Impayé";
  montant: number;
  paye: number;
  contact?: string;
}

const initialBus: BusVehicle[] = [
  { id: 1, numero: "BUS-01", chauffeur: "KOUAME Yao", capacite: 45, inscrits: 42, itineraire: "Cocody - École", statut: "En service", derniere_maintenance: "2024-11-15", telephone: "+225 07 12 34 56" },
  { id: 2, numero: "BUS-02", chauffeur: "DIALLO Moussa", capacite: 50, inscrits: 48, itineraire: "Yopougon - École", statut: "En service", derniere_maintenance: "2024-11-20", telephone: "+225 05 98 76 54" },
  { id: 3, numero: "BUS-03", chauffeur: "TRAORE Sekou", capacite: 40, inscrits: 35, itineraire: "Abobo - École", statut: "En service", derniere_maintenance: "2024-11-10", telephone: "+225 01 23 45 67" },
  { id: 4, numero: "BUS-04", chauffeur: "KONE Ibrahim", capacite: 45, inscrits: 0, itineraire: "-", statut: "Maintenance", derniere_maintenance: "2024-12-01" },
];

const initialItineraires: Itineraire[] = [
  { id: 1, nom: "Cocody - École", arrets: ["Angré", "Riviera Palmeraie", "II Plateaux", "École"], duree: "35 min", distance: "12 km" },
  { id: 2, nom: "Yopougon - École", arrets: ["Maroc", "Sicogi", "Wassakara", "École"], duree: "45 min", distance: "18 km" },
  { id: 3, nom: "Abobo - École", arrets: ["Anyama", "Abobo Gare", "Adjamé", "École"], duree: "50 min", distance: "22 km" },
];

const initialEleves: EleveTransport[] = [
  { id: 1, nom: "BAMBA Koffi", classe: "6ème A", bus: "BUS-01", arret: "Angré", statut: "Payé", montant: 25000, paye: 25000, contact: "+225 07 12 34 56" },
  { id: 2, nom: "SORO Aya", classe: "5ème B", bus: "BUS-02", arret: "Maroc", statut: "Payé", montant: 30000, paye: 30000 },
  { id: 3, nom: "N'GORAN Marie", classe: "4ème A", bus: "BUS-01", arret: "II Plateaux", statut: "Impayé", montant: 25000, paye: 0, contact: "+225 05 67 89 01" },
  { id: 4, nom: "KOFFI Jean", classe: "3ème C", bus: "BUS-03", arret: "Anyama", statut: "Partiel", montant: 35000, paye: 20000 },
  { id: 5, nom: "TRAORE Mariam", classe: "2nde B", bus: "BUS-02", arret: "Sicogi", statut: "Payé", montant: 30000, paye: 30000 },
];

const classesListe = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C", "2nde A", "2nde B", "1ère A", "Tle D"];

const Transport = () => {
  const [buses, setBuses] = useState<BusVehicle[]>(initialBus);
  const [itineraires] = useState<Itineraire[]>(initialItineraires);
  const [eleves, setEleves] = useState<EleveTransport[]>(initialEleves);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const [isBusDialogOpen, setIsBusDialogOpen] = useState(false);
  const [isEditEleveOpen, setIsEditEleveOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusVehicle | null>(null);
  const [selectedEleve, setSelectedEleve] = useState<EleveTransport | null>(null);
  
  // Form states
  const [inscriptionForm, setInscriptionForm] = useState({
    nom: "",
    classe: "",
    bus: "",
    arret: "",
    contact: ""
  });
  const [paymentAmount, setPaymentAmount] = useState("");

  // Statistiques dynamiques
  const totalCapacite = buses.reduce((sum, b) => sum + b.capacite, 0);
  const totalInscrits = buses.reduce((sum, b) => sum + b.inscrits, 0);
  const tauxOccupation = ((totalInscrits / totalCapacite) * 100).toFixed(1);
  const busActifs = buses.filter(b => b.statut === "En service").length;

  // Filtrer les élèves
  const filteredEleves = eleves.filter(e =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.bus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PDF Export - Flotte de bus
  const handleExportFlotePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Flotte de Bus - Transport Scolaire", 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [["Numéro", "Chauffeur", "Téléphone", "Capacité", "Inscrits", "Itinéraire", "Statut"]],
      body: buses.map(b => [
        b.numero,
        b.chauffeur,
        b.telephone || "-",
        `${b.capacite}`,
        `${b.inscrits}`,
        b.itineraire,
        b.statut
      ]),
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("flotte-bus.pdf");
    toast.success("Flotte de bus exportée en PDF");
  };

  // PDF Export - Liste des élèves transport
  const handleExportElevesPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liste des Élèves - Transport Scolaire", 14, 22);
    doc.setFontSize(10);
    doc.text(`Total: ${eleves.length} élèves inscrits`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [["Nom", "Classe", "Bus", "Arrêt", "Montant", "Payé", "Statut"]],
      body: eleves.map(e => [
        e.nom,
        e.classe,
        e.bus,
        e.arret,
        `${e.montant.toLocaleString()} F`,
        `${e.paye.toLocaleString()} F`,
        e.statut
      ]),
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("eleves-transport.pdf");
    toast.success("Liste des élèves exportée");
  };

  // PDF Export - Itinéraires
  const handleExportItinerairesPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Itinéraires - Transport Scolaire", 14, 22);
    doc.setFontSize(10);
    doc.text(`${itineraires.length} itinéraires actifs`, 14, 30);

    itineraires.forEach((it, index) => {
      autoTable(doc, {
        startY: index === 0 ? 38 : (doc as any).lastAutoTable.finalY + 10,
        head: [[`${it.nom} - ${it.distance} - ${it.duree}`]],
        body: it.arrets.map((a, i) => [`${i + 1}. ${a}`]),
        headStyles: { fillColor: [16, 185, 129] },
      });
    });

    doc.save("itineraires-transport.pdf");
    toast.success("Itinéraires exportés");
  };

  // Appeler un chauffeur
  const handleCallChauffeur = (bus: BusVehicle) => {
    if (bus.telephone) {
      window.open(`tel:${bus.telephone}`, '_blank');
      toast.success(`Appel vers ${bus.chauffeur}...`);
    } else {
      toast.error("Numéro de téléphone non renseigné");
    }
  };

  // Envoyer rappels transport
  const handleSendTransportReminders = () => {
    const impayes = eleves.filter(e => e.statut !== "Payé");
    toast.success(`${impayes.length} rappels envoyés`, {
      description: "SMS envoyés aux parents avec solde impayé"
    });
  };

  // Handlers Bus
  const openBusDialog = (bus: BusVehicle) => {
    setSelectedBus(bus);
    setIsBusDialogOpen(true);
  };

  const openMaintenanceDialog = (bus: BusVehicle) => {
    setSelectedBus(bus);
    setIsMaintenanceOpen(true);
  };

  const handleToggleMaintenance = () => {
    if (!selectedBus) return;
    
    const newStatut = selectedBus.statut === "Maintenance" ? "En service" : "Maintenance";
    setBuses(prev => prev.map(b =>
      b.id === selectedBus.id
        ? { ...b, statut: newStatut as BusVehicle["statut"], derniere_maintenance: newStatut === "En service" ? new Date().toISOString().split('T')[0] : b.derniere_maintenance }
        : b
    ));
    
    toast.success(`${selectedBus.numero} ${newStatut === "Maintenance" ? "mis en maintenance" : "remis en service"}`);
    setIsMaintenanceOpen(false);
    setSelectedBus(null);
  };

  // Handlers Inscription
  const handleNewInscription = () => {
    if (!inscriptionForm.nom || !inscriptionForm.classe || !inscriptionForm.bus || !inscriptionForm.arret) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const busSelected = buses.find(b => b.numero === inscriptionForm.bus);
    const itineraire = itineraires.find(i => i.nom === busSelected?.itineraire);
    const montant = itineraire ? (itineraire.arrets.indexOf(inscriptionForm.arret) + 1) * 10000 : 25000;

    const newEleve: EleveTransport = {
      id: Math.max(...eleves.map(e => e.id)) + 1,
      nom: inscriptionForm.nom,
      classe: inscriptionForm.classe,
      bus: inscriptionForm.bus,
      arret: inscriptionForm.arret,
      statut: "Impayé",
      montant,
      paye: 0,
      contact: inscriptionForm.contact
    };

    setEleves([...eleves, newEleve]);
    setIsInscriptionOpen(false);
    setInscriptionForm({ nom: "", classe: "", bus: "", arret: "", contact: "" });
    toast.success(`${inscriptionForm.nom} inscrit(e) au transport`, {
      description: `Bus ${inscriptionForm.bus} - Arrêt ${inscriptionForm.arret}`
    });
  };

  // Handlers Edit Eleve
  const openEditEleve = (eleve: EleveTransport) => {
    setSelectedEleve(eleve);
    setInscriptionForm({
      nom: eleve.nom,
      classe: eleve.classe,
      bus: eleve.bus,
      arret: eleve.arret,
      contact: eleve.contact || ""
    });
    setIsEditEleveOpen(true);
  };

  const handleSaveEditEleve = () => {
    if (!selectedEleve) return;

    setEleves(prev => prev.map(e =>
      e.id === selectedEleve.id
        ? { ...e, bus: inscriptionForm.bus, arret: inscriptionForm.arret, contact: inscriptionForm.contact }
        : e
    ));

    toast.success(`Inscription de ${selectedEleve.nom} mise à jour`);
    setIsEditEleveOpen(false);
    setSelectedEleve(null);
    setInscriptionForm({ nom: "", classe: "", bus: "", arret: "", contact: "" });
  };

  // Handler Paiement
  const openPayment = (eleve: EleveTransport) => {
    setSelectedEleve(eleve);
    setPaymentAmount("");
    setIsPaymentOpen(true);
  };

  const handlePayment = () => {
    if (!selectedEleve || !paymentAmount) return;

    const amount = parseInt(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    const newPaye = Math.min(selectedEleve.paye + amount, selectedEleve.montant);
    const newStatut = newPaye >= selectedEleve.montant ? "Payé" : "Partiel";

    setEleves(prev => prev.map(e =>
      e.id === selectedEleve.id
        ? { ...e, paye: newPaye, statut: newStatut as EleveTransport["statut"] }
        : e
    ));

    toast.success(`Paiement de ${amount.toLocaleString()} F enregistré`);
    setIsPaymentOpen(false);
    setSelectedEleve(null);
  };

  // Handler Delete
  const handleDeleteEleve = (id: number) => {
    setEleves(prev => prev.filter(e => e.id !== id));
    toast.success("Inscription supprimée");
  };

  // Get arrets for selected bus
  const getArretsForBus = (busNumero: string) => {
    const bus = buses.find(b => b.numero === busNumero);
    if (!bus) return [];
    const itineraire = itineraires.find(i => i.nom === bus.itineraire);
    return itineraire?.arrets.filter(a => a !== "École") || [];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gestion du Transport Scolaire</h1>
          <p className="text-muted-foreground mt-2">Suivi des bus, itinéraires, chauffeurs et inscriptions</p>
        </div>
        <Button onClick={() => setIsInscriptionOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Inscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bus Actifs</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{busActifs}/{buses.length}</div>
            <Progress value={(busActifs / buses.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Inscrits</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eleves.length}</div>
            <p className="text-xs text-muted-foreground">Sur {totalCapacite} places</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxOccupation}%</div>
            <Progress value={parseFloat(tauxOccupation)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itinéraires</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itineraires.length}</div>
            <p className="text-xs text-muted-foreground">Routes actives</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bus" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bus">Flotte de Bus</TabsTrigger>
          <TabsTrigger value="itineraires">Itinéraires</TabsTrigger>
          <TabsTrigger value="eleves">Élèves Inscrits</TabsTrigger>
        </TabsList>

        <TabsContent value="bus" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Flotte de Bus</CardTitle>
                  <CardDescription>Gestion des véhicules et chauffeurs</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportFlotePDF}>
                    <FileText className="mr-2 h-4 w-4" />
                    Exporter PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Inscrits</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Itinéraire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buses.map((vehicle) => {
                    const occupation = (vehicle.inscrits / vehicle.capacite) * 100;
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-bold">{vehicle.numero}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {vehicle.chauffeur}
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.capacite} places</TableCell>
                        <TableCell className="font-medium">{vehicle.inscrits}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={occupation} />
                            <span className="text-xs text-muted-foreground">{occupation.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.itineraire}</TableCell>
                        <TableCell>
                          <Badge variant={vehicle.statut === "En service" ? "default" : "secondary"}>
                            {vehicle.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{vehicle.derniere_maintenance}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openBusDialog(vehicle)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleCallChauffeur(vehicle)}>
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openMaintenanceDialog(vehicle)}>
                              <Wrench className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itineraires" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleExportItinerairesPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exporter Itinéraires
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {itineraires.map((itineraire) => (
              <Card key={itineraire.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{itineraire.nom}</CardTitle>
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>Itinéraire complet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Arrêts</Label>
                    <div className="space-y-1">
                      {itineraire.arrets.map((arret, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{arret}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Durée</div>
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" />
                        {itineraire.duree}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                      <div className="font-medium">{itineraire.distance}</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => toast.info("Ouverture de la carte GPS...")}>
                    Voir Carte GPS
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="eleves" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Élèves Inscrits au Transport</CardTitle>
                  <CardDescription>Liste des inscriptions actives</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={handleExportElevesPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Button variant="outline" onClick={handleSendTransportReminders}>
                    <Send className="mr-2 h-4 w-4" />
                    Rappels
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Bus</TableHead>
                    <TableHead>Arrêt</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEleves.map((eleve) => (
                    <TableRow key={eleve.id}>
                      <TableCell className="font-medium">{eleve.nom}</TableCell>
                      <TableCell>{eleve.classe}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{eleve.bus}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {eleve.arret}
                        </div>
                      </TableCell>
                      <TableCell>{eleve.montant.toLocaleString()} F</TableCell>
                      <TableCell className="text-green-600 font-medium">{eleve.paye.toLocaleString()} F</TableCell>
                      <TableCell>
                        <Badge variant={
                          eleve.statut === "Payé" ? "default" :
                          eleve.statut === "Partiel" ? "secondary" :
                          "destructive"
                        }>
                          {eleve.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditEleve(eleve)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {eleve.statut !== "Payé" && (
                            <Button variant="outline" size="sm" onClick={() => openPayment(eleve)}>
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEleve(eleve.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Nouvelle Inscription */}
      <Dialog open={isInscriptionOpen} onOpenChange={setIsInscriptionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inscrire un Élève au Transport</DialogTitle>
            <DialogDescription>Ajouter un élève à un itinéraire de bus</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom de l'élève *</Label>
                <Input
                  value={inscriptionForm.nom}
                  onChange={(e) => setInscriptionForm({ ...inscriptionForm, nom: e.target.value })}
                  placeholder="NOM Prénom"
                />
              </div>
              <div className="space-y-2">
                <Label>Classe *</Label>
                <Select
                  value={inscriptionForm.classe}
                  onValueChange={(v) => setInscriptionForm({ ...inscriptionForm, classe: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {classesListe.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bus *</Label>
                <Select
                  value={inscriptionForm.bus}
                  onValueChange={(v) => setInscriptionForm({ ...inscriptionForm, bus: v, arret: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {buses.filter(b => b.statut === "En service").map(b => (
                      <SelectItem key={b.id} value={b.numero}>
                        {b.numero} - {b.itineraire}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Arrêt *</Label>
                <Select
                  value={inscriptionForm.arret}
                  onValueChange={(v) => setInscriptionForm({ ...inscriptionForm, arret: v })}
                  disabled={!inscriptionForm.bus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {getArretsForBus(inscriptionForm.bus).map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact parent (optionnel)</Label>
              <Input
                value={inscriptionForm.contact}
                onChange={(e) => setInscriptionForm({ ...inscriptionForm, contact: e.target.value })}
                placeholder="+225 XX XX XX XX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInscriptionOpen(false)}>Annuler</Button>
            <Button onClick={handleNewInscription}>Valider Inscription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détails Bus */}
      <Dialog open={isBusDialogOpen} onOpenChange={setIsBusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du Bus {selectedBus?.numero}</DialogTitle>
          </DialogHeader>
          {selectedBus && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Chauffeur</Label>
                  <p className="font-medium">{selectedBus.chauffeur}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Téléphone</Label>
                  <p className="font-medium">{selectedBus.telephone || "Non renseigné"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Capacité</Label>
                  <p className="font-medium">{selectedBus.capacite} places</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Inscrits</Label>
                  <p className="font-medium">{selectedBus.inscrits} élèves</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Itinéraire</Label>
                  <p className="font-medium">{selectedBus.itineraire}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Dernière maintenance</Label>
                  <p className="font-medium">{selectedBus.derniere_maintenance}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Statut</Label>
                <div className="mt-1">
                  <Badge variant={selectedBus.statut === "En service" ? "default" : "secondary"}>
                    {selectedBus.statut}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsBusDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Maintenance */}
      <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestion Maintenance - {selectedBus?.numero}</DialogTitle>
            <DialogDescription>
              Mettre le bus en maintenance ou le remettre en service
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Statut actuel:</strong> {selectedBus?.statut}</p>
              <p><strong>Dernière maintenance:</strong> {selectedBus?.derniere_maintenance}</p>
              <p><strong>Chauffeur:</strong> {selectedBus?.chauffeur}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaintenanceOpen(false)}>Annuler</Button>
            <Button onClick={handleToggleMaintenance}>
              {selectedBus?.statut === "Maintenance" ? "Remettre en service" : "Mettre en maintenance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Élève */}
      <Dialog open={isEditEleveOpen} onOpenChange={setIsEditEleveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'inscription</DialogTitle>
            <DialogDescription>Changer de bus ou d'arrêt</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">{selectedEleve?.nom}</p>
              <p className="text-sm text-muted-foreground">{selectedEleve?.classe}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bus</Label>
                <Select
                  value={inscriptionForm.bus}
                  onValueChange={(v) => setInscriptionForm({ ...inscriptionForm, bus: v, arret: "" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {buses.filter(b => b.statut === "En service").map(b => (
                      <SelectItem key={b.id} value={b.numero}>
                        {b.numero} - {b.itineraire}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Arrêt</Label>
                <Select
                  value={inscriptionForm.arret}
                  onValueChange={(v) => setInscriptionForm({ ...inscriptionForm, arret: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {getArretsForBus(inscriptionForm.bus).map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact parent</Label>
              <Input
                value={inscriptionForm.contact}
                onChange={(e) => setInscriptionForm({ ...inscriptionForm, contact: e.target.value })}
                placeholder="+225 XX XX XX XX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEleveOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveEditEleve}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Paiement */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un Paiement</DialogTitle>
            <DialogDescription>Paiement pour {selectedEleve?.nom}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Montant dû:</span>
                <span className="font-bold">{selectedEleve?.montant.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between">
                <span>Déjà payé:</span>
                <span className="font-bold text-green-600">{selectedEleve?.paye.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Reste à payer:</span>
                <span className="font-bold text-orange-600">
                  {((selectedEleve?.montant || 0) - (selectedEleve?.paye || 0)).toLocaleString()} F
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Montant du paiement (FCFA)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Montant"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Annuler</Button>
            <Button onClick={handlePayment}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transport;
