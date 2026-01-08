import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, Clock, AlertTriangle, CheckCircle, XCircle, FileText, 
  Send, Download, Filter, Search, Users, TrendingUp, Bell, Upload,
  Phone, Mail, MessageSquare, BarChart3, CalendarDays, UserX
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";

interface Absence {
  id: number;
  eleve: string;
  classe: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  type: "Absence" | "Retard";
  justifiee: boolean;
  motif?: string;
  justificatif?: string;
  parentNotifie: boolean;
  notificationDate?: string;
  canalNotification?: "SMS" | "Email" | "Appel";
}

interface AlerteSMS {
  id: number;
  eleve: string;
  classe: string;
  parent: string;
  telephone: string;
  message: string;
  dateEnvoi: string;
  statut: "Envoyé" | "Échec" | "En attente";
  type: "Absence" | "Retard" | "Rappel";
}

interface RapportMensuel {
  mois: string;
  totalAbsences: number;
  totalRetards: number;
  justifiees: number;
  nonJustifiees: number;
  tauxAbsenteisme: number;
}

const initialAbsences: Absence[] = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", date: "2025-01-08", heureDebut: "08:00", heureFin: "12:00", type: "Absence", justifiee: false, parentNotifie: true, notificationDate: "08 Jan 2025 08:30", canalNotification: "SMS" },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", date: "2025-01-08", heureDebut: "08:00", heureFin: "10:00", type: "Absence", justifiee: true, motif: "Maladie", justificatif: "Certificat médical", parentNotifie: true, notificationDate: "08 Jan 2025 08:15", canalNotification: "Email" },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", date: "2025-01-07", heureDebut: "08:30", heureFin: "08:30", type: "Retard", justifiee: false, parentNotifie: true, notificationDate: "07 Jan 2025 09:00", canalNotification: "SMS" },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", date: "2025-01-07", heureDebut: "08:00", heureFin: "17:00", type: "Absence", justifiee: true, motif: "Décès famille", justificatif: "Acte de décès", parentNotifie: true, canalNotification: "Appel" },
  { id: 5, eleve: "BAMBA Yao", classe: "Tle D", date: "2025-01-06", heureDebut: "14:00", heureFin: "17:00", type: "Absence", justifiee: false, parentNotifie: false },
  { id: 6, eleve: "KONE Sarah", classe: "1ère C", date: "2025-01-06", heureDebut: "08:15", heureFin: "08:15", type: "Retard", justifiee: true, motif: "Embouteillage", parentNotifie: true, canalNotification: "SMS" },
];

const initialAlertes: AlerteSMS[] = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", parent: "M. KOUASSI Pierre", telephone: "+225 07 XX XX XX", message: "Votre enfant KOUASSI Jean est absent aujourd'hui. Merci de contacter l'établissement.", dateEnvoi: "08 Jan 2025 08:30", statut: "Envoyé", type: "Absence" },
  { id: 2, eleve: "TOURÉ Mohamed", classe: "2nde B", parent: "Mme TOURÉ Aïcha", telephone: "+225 05 XX XX XX", message: "Votre enfant TOURÉ Mohamed est arrivé en retard (30 min) ce matin.", dateEnvoi: "07 Jan 2025 09:00", statut: "Envoyé", type: "Retard" },
  { id: 3, eleve: "BAMBA Yao", classe: "Tle D", parent: "M. BAMBA Sekou", telephone: "+225 01 XX XX XX", message: "RAPPEL: 3 absences non justifiées ce mois. Merci de régulariser.", dateEnvoi: "06 Jan 2025 17:00", statut: "Échec", type: "Rappel" },
];

const evolutionData = [
  { semaine: "S1", absences: 45, retards: 23, justifiees: 32 },
  { semaine: "S2", absences: 38, retards: 19, justifiees: 28 },
  { semaine: "S3", absences: 52, retards: 31, justifiees: 35 },
  { semaine: "S4", absences: 41, retards: 22, justifiees: 30 },
];

const repartitionData = [
  { name: "Maladie", value: 35, color: "#3b82f6" },
  { name: "Famille", value: 20, color: "#10b981" },
  { name: "Non justifiée", value: 30, color: "#ef4444" },
  { name: "Retard transport", value: 10, color: "#f59e0b" },
  { name: "Autre", value: 5, color: "#8b5cf6" },
];

const classesData = [
  { classe: "6ème", taux: 3.2 },
  { classe: "5ème", taux: 4.1 },
  { classe: "4ème", taux: 5.8 },
  { classe: "3ème", taux: 6.2 },
  { classe: "2nde", taux: 7.5 },
  { classe: "1ère", taux: 8.1 },
  { classe: "Tle", taux: 9.3 },
];

export default function Absences() {
  const [absences, setAbsences] = useState<Absence[]>(initialAbsences);
  const [alertes, setAlertes] = useState<AlerteSMS[]>(initialAlertes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isJustificatifDialogOpen, setIsJustificatifDialogOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClasse, setFilterClasse] = useState("all");
  const [filterJustifiee, setFilterJustifiee] = useState("all");
  
  const [absenceForm, setAbsenceForm] = useState({
    eleve: "", classe: "", date: "", heureDebut: "", heureFin: "", type: "Absence", envoiSMS: true
  });

  const [justificatifForm, setJustificatifForm] = useState({
    motif: "", justificatif: ""
  });

  // Statistiques
  const totalAbsences = absences.filter(a => a.type === "Absence").length;
  const totalRetards = absences.filter(a => a.type === "Retard").length;
  const justifiees = absences.filter(a => a.justifiee).length;
  const nonJustifiees = absences.filter(a => !a.justifiee).length;
  const tauxJustification = Math.round((justifiees / absences.length) * 100);
  const alertesEnvoyees = alertes.filter(a => a.statut === "Envoyé").length;

  // Filtrage
  const filteredAbsences = absences.filter(a => {
    const matchSearch = a.eleve.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClasse = filterClasse === "all" || a.classe === filterClasse;
    const matchJustifiee = filterJustifiee === "all" || 
      (filterJustifiee === "justifiee" && a.justifiee) ||
      (filterJustifiee === "non-justifiee" && !a.justifiee);
    return matchSearch && matchClasse && matchJustifiee;
  });

  const handleCreateAbsence = () => {
    const newAbsence: Absence = {
      id: Math.max(...absences.map(a => a.id), 0) + 1,
      eleve: absenceForm.eleve,
      classe: absenceForm.classe,
      date: absenceForm.date,
      heureDebut: absenceForm.heureDebut,
      heureFin: absenceForm.heureFin || absenceForm.heureDebut,
      type: absenceForm.type as Absence["type"],
      justifiee: false,
      parentNotifie: absenceForm.envoiSMS
    };

    if (absenceForm.envoiSMS) {
      newAbsence.notificationDate = format(new Date(), "dd MMM yyyy HH:mm", { locale: fr });
      newAbsence.canalNotification = "SMS";
      
      // Créer alerte SMS
      const newAlerte: AlerteSMS = {
        id: Math.max(...alertes.map(a => a.id), 0) + 1,
        eleve: absenceForm.eleve,
        classe: absenceForm.classe,
        parent: `Parent de ${absenceForm.eleve}`,
        telephone: "+225 XX XX XX XX",
        message: absenceForm.type === "Absence" 
          ? `Votre enfant ${absenceForm.eleve} est absent aujourd'hui. Merci de contacter l'établissement.`
          : `Votre enfant ${absenceForm.eleve} est arrivé en retard ce matin.`,
        dateEnvoi: format(new Date(), "dd MMM yyyy HH:mm", { locale: fr }),
        statut: "Envoyé",
        type: absenceForm.type as AlerteSMS["type"]
      };
      setAlertes(prev => [...prev, newAlerte]);
    }

    setAbsences(prev => [...prev, newAbsence]);
    toast({ 
      title: absenceForm.type === "Absence" ? "Absence enregistrée" : "Retard enregistré",
      description: absenceForm.envoiSMS ? "SMS envoyé aux parents" : "Parents non notifiés"
    });
    
    setIsDialogOpen(false);
    setAbsenceForm({ eleve: "", classe: "", date: "", heureDebut: "", heureFin: "", type: "Absence", envoiSMS: true });
  };

  const handleJustifier = () => {
    if (!selectedAbsence) return;
    
    setAbsences(prev => prev.map(a => 
      a.id === selectedAbsence.id 
        ? { ...a, justifiee: true, motif: justificatifForm.motif, justificatif: justificatifForm.justificatif }
        : a
    ));
    
    toast({ title: "Justificatif enregistré", description: `Absence de ${selectedAbsence.eleve} justifiée` });
    setIsJustificatifDialogOpen(false);
    setJustificatifForm({ motif: "", justificatif: "" });
    setSelectedAbsence(null);
  };

  const handleSendReminder = (eleve: string, classe: string) => {
    const newAlerte: AlerteSMS = {
      id: Math.max(...alertes.map(a => a.id), 0) + 1,
      eleve,
      classe,
      parent: `Parent de ${eleve}`,
      telephone: "+225 XX XX XX XX",
      message: `RAPPEL: Plusieurs absences non justifiées pour ${eleve}. Merci de régulariser la situation.`,
      dateEnvoi: format(new Date(), "dd MMM yyyy HH:mm", { locale: fr }),
      statut: "Envoyé",
      type: "Rappel"
    };
    setAlertes(prev => [...prev, newAlerte]);
    toast({ title: "Rappel envoyé", description: `SMS de rappel envoyé aux parents de ${eleve}` });
  };

  const generateRapportMensuel = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // En-tête
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ÉTABLISSEMENT SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;
    doc.setFontSize(16);
    doc.text('RAPPORT MENSUEL DES ABSENCES', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Période: ${format(new Date(), 'MMMM yyyy', { locale: fr })}`, pageWidth / 2, yPos, { align: 'center' });
    
    // Statistiques globales
    yPos += 20;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');
    
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('STATISTIQUES GLOBALES', margin + 5, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total absences: ${totalAbsences}`, margin + 5, yPos);
    doc.text(`Total retards: ${totalRetards}`, margin + 60, yPos);
    doc.text(`Taux de justification: ${tauxJustification}%`, margin + 115, yPos);
    
    yPos += 8;
    doc.text(`Justifiées: ${justifiees}`, margin + 5, yPos);
    doc.text(`Non justifiées: ${nonJustifiees}`, margin + 60, yPos);
    doc.text(`Alertes SMS envoyées: ${alertesEnvoyees}`, margin + 115, yPos);
    
    // Tableau des absences
    yPos += 25;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('DÉTAIL DES ABSENCES', margin, yPos);
    
    yPos += 8;
    doc.setFillColor(70, 130, 180);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    doc.setFontSize(9);
    doc.text('Élève', margin + 3, yPos + 5.5);
    doc.text('Classe', margin + 45, yPos + 5.5);
    doc.text('Date', margin + 70, yPos + 5.5);
    doc.text('Type', margin + 100, yPos + 5.5);
    doc.text('Justifiée', margin + 130, yPos + 5.5);
    doc.text('Parents', margin + 160, yPos + 5.5);
    
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    absences.slice(0, 15).forEach((absence, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
      }
      
      doc.text(absence.eleve.substring(0, 18), margin + 3, yPos + 5);
      doc.text(absence.classe, margin + 45, yPos + 5);
      doc.text(absence.date, margin + 70, yPos + 5);
      doc.text(absence.type, margin + 100, yPos + 5);
      doc.text(absence.justifiee ? "Oui" : "Non", margin + 130, yPos + 5);
      doc.text(absence.parentNotifie ? "Notifiés" : "Non", margin + 160, yPos + 5);
      
      yPos += 7;
    });
    
    // Footer
    yPos = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Rapport généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, margin, yPos);
    
    doc.save(`Rapport_Absences_${format(new Date(), 'yyyy-MM')}.pdf`);
    toast({ title: "Rapport généré", description: "Le rapport mensuel a été téléchargé" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Absences</h1>
          <p className="text-muted-foreground">Suivi des absences, retards et alertes SMS automatiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateRapportMensuel}>
            <Download className="mr-2 h-4 w-4" />
            Rapport Mensuel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserX className="mr-2 h-4 w-4" />
                Signaler Absence
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Signaler une Absence / Retard</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Élève</Label>
                    <Input 
                      placeholder="Nom de l'élève"
                      value={absenceForm.eleve}
                      onChange={(e) => setAbsenceForm({...absenceForm, eleve: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Select onValueChange={(v) => setAbsenceForm({...absenceForm, classe: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6ème A">6ème A</SelectItem>
                        <SelectItem value="5ème B">5ème B</SelectItem>
                        <SelectItem value="4ème C">4ème C</SelectItem>
                        <SelectItem value="3ème C">3ème C</SelectItem>
                        <SelectItem value="2nde B">2nde B</SelectItem>
                        <SelectItem value="1ère A">1ère A</SelectItem>
                        <SelectItem value="1ère C">1ère C</SelectItem>
                        <SelectItem value="Tle D">Tle D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={absenceForm.type} onValueChange={(v) => setAbsenceForm({...absenceForm, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Absence">Absence</SelectItem>
                      <SelectItem value="Retard">Retard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={absenceForm.date}
                    onChange={(e) => setAbsenceForm({...absenceForm, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heure début</Label>
                    <Input 
                      type="time"
                      value={absenceForm.heureDebut}
                      onChange={(e) => setAbsenceForm({...absenceForm, heureDebut: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure fin</Label>
                    <Input 
                      type="time"
                      value={absenceForm.heureFin}
                      onChange={(e) => setAbsenceForm({...absenceForm, heureFin: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <input 
                    type="checkbox" 
                    id="envoiSMS"
                    checked={absenceForm.envoiSMS}
                    onChange={(e) => setAbsenceForm({...absenceForm, envoiSMS: e.target.checked})}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="envoiSMS" className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    Envoyer SMS automatique aux parents
                  </Label>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleCreateAbsence}>Enregistrer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absences</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAbsences}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRetards}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Justifiées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{justifiees}</div>
            <p className="text-xs text-muted-foreground">{tauxJustification}% du total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non Justifiées</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{nonJustifiees}</div>
            <p className="text-xs text-muted-foreground">À régulariser</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Envoyés</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertesEnvoyees}</div>
            <p className="text-xs text-muted-foreground">Alertes parents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Absentéisme</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">Moyenne établissement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="absences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="absences">Liste des Absences</TabsTrigger>
          <TabsTrigger value="alertes">Alertes SMS</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="absences">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Registre des Absences et Retards
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un élève..."
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterClasse} onValueChange={setFilterClasse}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="Tle D">Tle D</SelectItem>
                      <SelectItem value="1ère A">1ère A</SelectItem>
                      <SelectItem value="2nde B">2nde B</SelectItem>
                      <SelectItem value="3ème C">3ème C</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterJustifiee} onValueChange={setFilterJustifiee}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Justification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="justifiee">Justifiées</SelectItem>
                      <SelectItem value="non-justifiee">Non justifiées</SelectItem>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Horaires</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Justifiée</TableHead>
                    <TableHead>Parents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">{absence.eleve}</TableCell>
                      <TableCell><Badge variant="outline">{absence.classe}</Badge></TableCell>
                      <TableCell>{absence.date}</TableCell>
                      <TableCell className="text-sm">
                        {absence.heureDebut} - {absence.heureFin}
                      </TableCell>
                      <TableCell>
                        <Badge variant={absence.type === "Retard" ? "secondary" : "destructive"}>
                          {absence.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {absence.justifiee ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600">{absence.motif}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            Non justifiée
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {absence.parentNotifie ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-xs">{absence.canalNotification}</span>
                          </div>
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!absence.justifiee && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedAbsence(absence);
                                setIsJustificatifDialogOpen(true);
                              }}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          )}
                          {!absence.parentNotifie && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendReminder(absence.eleve, absence.classe)}
                            >
                              <Send className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="alertes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Historique des Alertes SMS
              </CardTitle>
              <CardDescription>
                Suivi des notifications envoyées aux parents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Envoi</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertes.map((alerte) => (
                    <TableRow key={alerte.id}>
                      <TableCell className="font-medium">{alerte.eleve}</TableCell>
                      <TableCell><Badge variant="outline">{alerte.classe}</Badge></TableCell>
                      <TableCell>{alerte.parent}</TableCell>
                      <TableCell className="text-sm">{alerte.telephone}</TableCell>
                      <TableCell>
                        <Badge variant={
                          alerte.type === "Absence" ? "destructive" :
                          alerte.type === "Retard" ? "secondary" :
                          "default"
                        }>
                          {alerte.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{alerte.dateEnvoi}</TableCell>
                      <TableCell>
                        <Badge variant={alerte.statut === "Envoyé" ? "default" : "destructive"} 
                               className={alerte.statut === "Envoyé" ? "bg-green-600" : ""}>
                          {alerte.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {alerte.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semaine" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="absences" name="Absences" fill="#ef4444" />
                    <Bar dataKey="retards" name="Retards" fill="#f59e0b" />
                    <Bar dataKey="justifiees" name="Justifiées" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Motifs</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={repartitionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {repartitionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Taux d'Absentéisme par Niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={classesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 10]} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="classe" type="category" width={60} />
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Bar dataKey="taux" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Justificatif */}
      <Dialog open={isJustificatifDialogOpen} onOpenChange={setIsJustificatifDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un Justificatif</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Élève</Label>
              <Input value={selectedAbsence?.eleve || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Motif</Label>
              <Select onValueChange={(v) => setJustificatifForm({...justificatifForm, motif: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maladie">Maladie</SelectItem>
                  <SelectItem value="RDV médical">RDV médical</SelectItem>
                  <SelectItem value="Décès famille">Décès famille</SelectItem>
                  <SelectItem value="Événement familial">Événement familial</SelectItem>
                  <SelectItem value="Embouteillage">Embouteillage</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Document justificatif</Label>
              <Select onValueChange={(v) => setJustificatifForm({...justificatifForm, justificatif: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certificat médical">Certificat médical</SelectItem>
                  <SelectItem value="Attestation">Attestation</SelectItem>
                  <SelectItem value="Acte de décès">Acte de décès</SelectItem>
                  <SelectItem value="Courrier parents">Courrier des parents</SelectItem>
                  <SelectItem value="Autre document">Autre document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsJustificatifDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleJustifier}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Valider
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
