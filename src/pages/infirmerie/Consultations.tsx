import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Heart, Search, Plus, Activity, Calendar, AlertTriangle,
  User, Thermometer, Pill, Stethoscope, Clock, Eye, Edit, Trash2, Phone
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Consultation {
  id: number;
  eleve: string;
  classe: string;
  motif: string;
  temperature: string;
  date: string;
  heure: string;
  gravite: "Légère" | "Modérée" | "Grave";
  traitement: string;
  statut: "Traité" | "En cours" | "Référé";
  symptomes?: string;
  contactParent?: string;
}

const initialConsultations: Consultation[] = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", motif: "Fièvre", temperature: "38.5", date: "15 Déc 2024", heure: "10:30", gravite: "Modérée", traitement: "Paracétamol 1000mg", statut: "Traité", contactParent: "+225 07 12 34 56" },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", motif: "Maux de tête", temperature: "36.8", date: "15 Déc 2024", heure: "11:15", gravite: "Légère", traitement: "Repos, hydratation", statut: "Traité" },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", motif: "Douleur abdominale", temperature: "37.2", date: "15 Déc 2024", heure: "14:00", gravite: "Modérée", traitement: "Observation 2h", statut: "En cours", symptomes: "Douleurs localisées, nausées légères" },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", motif: "Blessure jambe", temperature: "36.9", date: "14 Déc 2024", heure: "09:45", gravite: "Légère", traitement: "Désinfection, pansement", statut: "Traité" },
  { id: 5, eleve: "KONE Ibrahim", classe: "4ème A", motif: "Crise d'asthme", temperature: "37.1", date: "14 Déc 2024", heure: "15:30", gravite: "Grave", traitement: "Ventoline, parents contactés", statut: "Référé", contactParent: "+225 05 67 89 01" },
  { id: 6, eleve: "BAMBA Sarah", classe: "1ère C", motif: "Malaise", temperature: "36.5", date: "13 Déc 2024", heure: "10:00", gravite: "Modérée", traitement: "Repos, sucre", statut: "Traité" },
];

const classesListe = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C", "2nde A", "2nde B", "1ère A", "1ère B", "1ère C", "Tle A", "Tle D"];

export default function Consultations() {
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterGravite, setFilterGravite] = useState("all");
  
  // Dialog states
  const [isNewConsultOpen, setIsNewConsultOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    eleve: "",
    classe: "",
    temperature: "",
    gravite: "Légère" as Consultation["gravite"],
    motif: "",
    symptomes: "",
    traitement: "",
    contactParent: ""
  });

  // Statistiques dynamiques
  const todayCount = consultations.filter(c => c.date === "15 Déc 2024").length;
  const traitesCount = consultations.filter(c => c.statut === "Traité").length;
  const urgencesCount = consultations.filter(c => c.gravite === "Grave").length;
  const enCoursCount = consultations.filter(c => c.statut === "En cours").length;

  const statsJour = [
    { type: "Consultations", count: todayCount, icon: Stethoscope, color: "bg-blue-500" },
    { type: "Traitements", count: traitesCount, icon: Pill, color: "bg-green-500" },
    { type: "Urgences", count: urgencesCount, icon: AlertTriangle, color: "bg-red-500" },
    { type: "En observation", count: enCoursCount, icon: Activity, color: "bg-yellow-500" },
  ];

  // Filtrer les consultations
  const filteredConsultations = consultations.filter(c => {
    const matchSearch = 
      c.eleve.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.classe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGravite = filterGravite === "all" || c.gravite === filterGravite;
    return matchSearch && matchGravite;
  });

  const resetForm = () => {
    setForm({
      eleve: "",
      classe: "",
      temperature: "",
      gravite: "Légère",
      motif: "",
      symptomes: "",
      traitement: "",
      contactParent: ""
    });
  };

  const handleNewConsultation = () => {
    if (!form.eleve || !form.motif || !form.temperature) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const now = new Date();
    const newConsult: Consultation = {
      id: Math.max(...consultations.map(c => c.id)) + 1,
      eleve: form.eleve,
      classe: form.classe,
      motif: form.motif,
      temperature: form.temperature,
      date: now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      heure: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      gravite: form.gravite,
      traitement: form.traitement || "À déterminer",
      statut: "En cours",
      symptomes: form.symptomes,
      contactParent: form.contactParent
    };

    setConsultations([newConsult, ...consultations]);
    setIsNewConsultOpen(false);
    resetForm();
    toast.success(`Consultation enregistrée pour ${form.eleve}`);
  };

  const handleUpdateConsultation = () => {
    if (!selectedConsult) return;

    setConsultations(prev => prev.map(c => 
      c.id === selectedConsult.id 
        ? { 
            ...c, 
            traitement: form.traitement,
            statut: form.traitement ? "Traité" : c.statut,
            symptomes: form.symptomes 
          }
        : c
    ));
    
    setIsEditOpen(false);
    setSelectedConsult(null);
    toast.success("Consultation mise à jour");
  };

  const handleMarkAsReferred = (consult: Consultation) => {
    setConsultations(prev => prev.map(c => 
      c.id === consult.id ? { ...c, statut: "Référé" as const } : c
    ));
    toast.info(`${consult.eleve} référé(e) - Parents à contacter`);
  };

  const handleMarkAsTreated = (consult: Consultation) => {
    setConsultations(prev => prev.map(c => 
      c.id === consult.id ? { ...c, statut: "Traité" as const } : c
    ));
    toast.success(`Consultation terminée pour ${consult.eleve}`);
  };

  const handleDelete = (id: number) => {
    setConsultations(prev => prev.filter(c => c.id !== id));
    toast.success("Consultation supprimée");
  };

  const openView = (consult: Consultation) => {
    setSelectedConsult(consult);
    setIsViewOpen(true);
  };

  const openEdit = (consult: Consultation) => {
    setSelectedConsult(consult);
    setForm({
      eleve: consult.eleve,
      classe: consult.classe,
      temperature: consult.temperature,
      gravite: consult.gravite,
      motif: consult.motif,
      symptomes: consult.symptomes || "",
      traitement: consult.traitement,
      contactParent: consult.contactParent || ""
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations Infirmerie</h1>
          <p className="text-muted-foreground">Suivi médical et soins aux élèves</p>
        </div>
        <Button onClick={() => setIsNewConsultOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Consultation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {statsJour.map((stat) => (
          <Card key={stat.type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.type}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">Aujourd'hui</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Consultations Récentes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un élève..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterGravite} onValueChange={setFilterGravite}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Gravité" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="Légère">Légère</SelectItem>
                  <SelectItem value="Modérée">Modérée</SelectItem>
                  <SelectItem value="Grave">Grave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Température</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Traitement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{consultation.eleve}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{consultation.classe}</Badge>
                  </TableCell>
                  <TableCell>{consultation.motif}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Thermometer className={`h-4 w-4 ${
                        parseFloat(consultation.temperature) >= 38 ? "text-red-500" : "text-green-500"
                      }`} />
                      <span className={
                        parseFloat(consultation.temperature) >= 38 ? "text-red-600 font-semibold" : ""
                      }>
                        {consultation.temperature}°C
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {consultation.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {consultation.heure}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      consultation.gravite === "Grave" ? "destructive" :
                      consultation.gravite === "Modérée" ? "default" :
                      "secondary"
                    }>
                      {consultation.gravite}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{consultation.traitement}</TableCell>
                  <TableCell>
                    <Badge variant={
                      consultation.statut === "Référé" ? "destructive" :
                      consultation.statut === "En cours" ? "default" :
                      "secondary"
                    }>
                      {consultation.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openView(consultation)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(consultation)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {consultation.statut === "En cours" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsTreated(consultation)}
                          >
                            <Pill className="h-4 w-4" />
                          </Button>
                          {consultation.gravite === "Grave" && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleMarkAsReferred(consultation)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Nouvelle Consultation */}
      <Dialog open={isNewConsultOpen} onOpenChange={setIsNewConsultOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouvelle Consultation</DialogTitle>
            <DialogDescription>Enregistrer une consultation médicale</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eleve">Élève *</Label>
                <Input 
                  id="eleve" 
                  placeholder="Nom de l'élève" 
                  value={form.eleve}
                  onChange={(e) => setForm({...form, eleve: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classe">Classe *</Label>
                <Select value={form.classe} onValueChange={(v) => setForm({...form, classe: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
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
                <Label htmlFor="temperature">Température (°C) *</Label>
                <Input 
                  id="temperature" 
                  type="number" 
                  step="0.1" 
                  placeholder="37.0"
                  value={form.temperature}
                  onChange={(e) => setForm({...form, temperature: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gravite">Gravité *</Label>
                <Select value={form.gravite} onValueChange={(v: Consultation["gravite"]) => setForm({...form, gravite: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="Légère">Légère</SelectItem>
                    <SelectItem value="Modérée">Modérée</SelectItem>
                    <SelectItem value="Grave">Grave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motif">Motif de consultation *</Label>
              <Input 
                id="motif" 
                placeholder="Ex: Fièvre, Maux de tête..." 
                value={form.motif}
                onChange={(e) => setForm({...form, motif: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symptomes">Symptômes observés</Label>
              <Textarea 
                id="symptomes" 
                placeholder="Décrire les symptômes..." 
                value={form.symptomes}
                onChange={(e) => setForm({...form, symptomes: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traitement">Traitement administré</Label>
              <Textarea 
                id="traitement" 
                placeholder="Médicaments, soins..." 
                value={form.traitement}
                onChange={(e) => setForm({...form, traitement: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact parent (optionnel)</Label>
              <Input 
                id="contact" 
                placeholder="+225 XX XX XX XX" 
                value={form.contactParent}
                onChange={(e) => setForm({...form, contactParent: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsNewConsultOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleNewConsultation}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog View Consultation */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la Consultation</DialogTitle>
          </DialogHeader>
          {selectedConsult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Élève</Label>
                  <p className="font-medium">{selectedConsult.eleve}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Classe</Label>
                  <p className="font-medium">{selectedConsult.classe}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date & Heure</Label>
                  <p className="font-medium">{selectedConsult.date} à {selectedConsult.heure}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Température</Label>
                  <p className={`font-medium ${parseFloat(selectedConsult.temperature) >= 38 ? "text-red-600" : ""}`}>
                    {selectedConsult.temperature}°C
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Motif</Label>
                <p className="font-medium">{selectedConsult.motif}</p>
              </div>
              {selectedConsult.symptomes && (
                <div>
                  <Label className="text-muted-foreground">Symptômes</Label>
                  <p>{selectedConsult.symptomes}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Traitement</Label>
                <p>{selectedConsult.traitement}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={
                  selectedConsult.gravite === "Grave" ? "destructive" :
                  selectedConsult.gravite === "Modérée" ? "default" : "secondary"
                }>
                  {selectedConsult.gravite}
                </Badge>
                <Badge variant={
                  selectedConsult.statut === "Référé" ? "destructive" :
                  selectedConsult.statut === "En cours" ? "default" : "secondary"
                }>
                  {selectedConsult.statut}
                </Badge>
              </div>
              {selectedConsult.contactParent && (
                <div className="pt-2 border-t">
                  <Label className="text-muted-foreground">Contact parent</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedConsult.contactParent}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Consultation */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la Consultation</DialogTitle>
            <DialogDescription>Mettre à jour le traitement et les observations</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">{selectedConsult?.eleve} - {selectedConsult?.classe}</p>
              <p className="text-sm text-muted-foreground">{selectedConsult?.motif}</p>
            </div>
            <div className="space-y-2">
              <Label>Symptômes observés</Label>
              <Textarea 
                value={form.symptomes}
                onChange={(e) => setForm({...form, symptomes: e.target.value})}
                placeholder="Mettre à jour les symptômes..."
              />
            </div>
            <div className="space-y-2">
              <Label>Traitement administré</Label>
              <Textarea 
                value={form.traitement}
                onChange={(e) => setForm({...form, traitement: e.target.value})}
                placeholder="Mettre à jour le traitement..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateConsultation}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
