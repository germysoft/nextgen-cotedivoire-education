import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Plus, User, Calendar, FileText, CheckCircle, Clock, TrendingDown, TrendingUp, Gavel, BookOpen, Send, Users, Scale, ClipboardList, Bell, GraduationCap, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Incident {
  id: number;
  eleve: string;
  classe: string;
  type: string;
  date: string;
  gravite: "Légère" | "Modérée" | "Grave";
  sanction: string;
  statut: "En cours" | "Traité";
  rapporteur: string;
  notifieParents: boolean;
}

interface ConduiteNote {
  id: number;
  eleve: string;
  classe: string;
  incidents: number;
  note: number;
  appreciation: string;
  tendance: "up" | "down" | "stable";
}

interface ConseilDiscipline {
  id: number;
  eleve: string;
  classe: string;
  dateConvocation: string;
  dateSeance: string;
  motifs: string[];
  membres: string[];
  statut: "Programmé" | "En cours" | "Délibéré" | "Annulé";
  decision?: string;
  appel?: boolean;
}

interface MesureEducative {
  id: number;
  eleve: string;
  classe: string;
  type: "Tutorat" | "TIG" | "Stage réflexion" | "Suivi psychologue" | "Contrat comportement" | "Médiation";
  dateDebut: string;
  dateFin: string;
  responsable: string;
  objectifs: string;
  statut: "En cours" | "Terminé" | "Abandonné";
  evaluation?: string;
  progres: number;
}

interface ConvocationParent {
  id: number;
  eleve: string;
  classe: string;
  parent: string;
  motif: string;
  dateConvocation: string;
  dateRdv?: string;
  statut: "Envoyée" | "Confirmée" | "Réalisée" | "Absence";
  canalEnvoi: "SMS" | "Email" | "Courrier";
  notes?: string;
}

const initialIncidents: Incident[] = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", type: "Retard", date: "15 Déc 2024", gravite: "Légère", sanction: "Avertissement", statut: "Traité", rapporteur: "M. KOFFI", notifieParents: false },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", type: "Absence injustifiée", date: "14 Déc 2024", gravite: "Modérée", sanction: "Convocation parents", statut: "En cours", rapporteur: "Mme DIALLO", notifieParents: true },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", type: "Insolence", date: "13 Déc 2024", gravite: "Grave", sanction: "Exclusion 2 jours", statut: "Traité", rapporteur: "M. TOURÉ", notifieParents: true },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", type: "Oubli matériel", date: "13 Déc 2024", gravite: "Légère", sanction: "Observation", statut: "Traité", rapporteur: "M. KONE", notifieParents: false },
  { id: 5, eleve: "BAMBA Yao", classe: "Tle D", type: "Bagarre", date: "12 Déc 2024", gravite: "Grave", sanction: "Exclusion 5 jours", statut: "Traité", rapporteur: "M. YAO", notifieParents: true },
  { id: 6, eleve: "KONE Sarah", classe: "1ère C", type: "Tricherie", date: "11 Déc 2024", gravite: "Grave", sanction: "Zéro + Avertissement", statut: "Traité", rapporteur: "Mme BAMBA", notifieParents: true },
];

const initialConseils: ConseilDiscipline[] = [
  { 
    id: 1, 
    eleve: "TOURÉ Mohamed", 
    classe: "2nde B", 
    dateConvocation: "10 Jan 2025",
    dateSeance: "17 Jan 2025", 
    motifs: ["Insolence répétée", "Bagarre", "Refus d'obéir"],
    membres: ["M. le Directeur", "CPE", "Prof. Principal", "Délégué parents", "Délégué élèves"],
    statut: "Programmé",
  },
  { 
    id: 2, 
    eleve: "BAMBA Yao", 
    classe: "Tle D", 
    dateConvocation: "05 Jan 2025",
    dateSeance: "12 Jan 2025", 
    motifs: ["Bagarres répétées", "Menaces sur camarade"],
    membres: ["M. le Directeur", "CPE", "Prof. Principal", "Délégué parents", "Délégué élèves"],
    statut: "Délibéré",
    decision: "Exclusion définitive avec sursis",
    appel: false
  },
];

const initialMesures: MesureEducative[] = [
  { 
    id: 1, 
    eleve: "KOUASSI Jean", 
    classe: "Tle D", 
    type: "Tutorat",
    dateDebut: "01 Déc 2024",
    dateFin: "31 Jan 2025",
    responsable: "M. KOFFI",
    objectifs: "Améliorer la ponctualité et l'assiduité",
    statut: "En cours",
    progres: 65
  },
  { 
    id: 2, 
    eleve: "DIALLO Fatoumata", 
    classe: "1ère A", 
    type: "Contrat comportement",
    dateDebut: "15 Déc 2024",
    dateFin: "15 Mars 2025",
    responsable: "Mme DIALLO",
    objectifs: "Réduire les absences injustifiées à zéro",
    statut: "En cours",
    progres: 40
  },
  { 
    id: 3, 
    eleve: "TOURÉ Mohamed", 
    classe: "2nde B", 
    type: "Suivi psychologue",
    dateDebut: "10 Déc 2024",
    dateFin: "10 Juin 2025",
    responsable: "Dr. KONÉ",
    objectifs: "Gérer les émotions et l'agressivité",
    statut: "En cours",
    progres: 25
  },
  { 
    id: 4, 
    eleve: "KONE Sarah", 
    classe: "1ère C", 
    type: "Stage réflexion",
    dateDebut: "12 Déc 2024",
    dateFin: "14 Déc 2024",
    responsable: "CPE",
    objectifs: "Comprendre l'importance de l'honnêteté académique",
    statut: "Terminé",
    evaluation: "Élève a pris conscience de ses actes",
    progres: 100
  },
];

const initialConvocations: ConvocationParent[] = [
  { id: 1, eleve: "DIALLO Fatoumata", classe: "1ère A", parent: "M. DIALLO Ibrahim", motif: "Absences répétées", dateConvocation: "14 Déc 2024", dateRdv: "20 Déc 2024 10h00", statut: "Confirmée", canalEnvoi: "SMS" },
  { id: 2, eleve: "TOURÉ Mohamed", classe: "2nde B", parent: "Mme TOURÉ Aïcha", motif: "Comportement violent", dateConvocation: "13 Déc 2024", dateRdv: "18 Déc 2024 14h00", statut: "Réalisée", canalEnvoi: "Email", notes: "Parents coopératifs, engagement de suivi à domicile" },
  { id: 3, eleve: "BAMBA Yao", classe: "Tle D", parent: "M. BAMBA Sekou", motif: "Conseil de discipline", dateConvocation: "05 Jan 2025", statut: "Envoyée", canalEnvoi: "Courrier" },
];

const sanctions = [
  { type: "Avertissement", count: 45, color: "#f59e0b" },
  { type: "Retenue", count: 18, color: "#f97316" },
  { type: "Convocation parents", count: 12, color: "#ef4444" },
  { type: "Exclusion temporaire", count: 3, color: "#dc2626" },
];

const initialConduites: ConduiteNote[] = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", incidents: 2, note: 16, appreciation: "Bon comportement", tendance: "stable" },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", incidents: 4, note: 12, appreciation: "Peut mieux faire", tendance: "down" },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", incidents: 6, note: 8, appreciation: "Comportement à améliorer", tendance: "down" },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", incidents: 1, note: 18, appreciation: "Excellente conduite", tendance: "up" },
  { id: 5, eleve: "BAMBA Yao", classe: "Tle D", incidents: 3, note: 10, appreciation: "Conduite acceptable", tendance: "stable" },
];

const incidentTypes = [
  { name: "Retards", value: 35, color: "#3b82f6" },
  { name: "Absences", value: 25, color: "#10b981" },
  { name: "Insolence", value: 15, color: "#f59e0b" },
  { name: "Bagarre", value: 8, color: "#ef4444" },
  { name: "Tricherie", value: 12, color: "#8b5cf6" },
  { name: "Autres", value: 5, color: "#6b7280" },
];

const evolutionData = [
  { month: "Sept", incidents: 25, noteConduite: 15.2 },
  { month: "Oct", incidents: 32, noteConduite: 14.8 },
  { month: "Nov", incidents: 28, noteConduite: 15.1 },
  { month: "Déc", incidents: 22, noteConduite: 15.5 },
];

export default function Discipline() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [conduites, setConduites] = useState<ConduiteNote[]>(initialConduites);
  const [conseils, setConseils] = useState<ConseilDiscipline[]>(initialConseils);
  const [mesures, setMesures] = useState<MesureEducative[]>(initialMesures);
  const [convocations, setConvocations] = useState<ConvocationParent[]>(initialConvocations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConseilDialogOpen, setIsConseilDialogOpen] = useState(false);
  const [isMesureDialogOpen, setIsMesureDialogOpen] = useState(false);
  const [isConvocationDialogOpen, setIsConvocationDialogOpen] = useState(false);
  const [selectedConseil, setSelectedConseil] = useState<ConseilDiscipline | null>(null);

  const [incidentForm, setIncidentForm] = useState({
    eleve: "", classe: "", type: "", gravite: "", sanction: "", rapporteur: "", notifieParents: false
  });

  const [conseilForm, setConseilForm] = useState({
    eleve: "", classe: "", dateSeance: "", motifs: ""
  });

  const [mesureForm, setMesureForm] = useState({
    eleve: "", classe: "", type: "", dateDebut: "", dateFin: "", responsable: "", objectifs: ""
  });

  const [convocationForm, setConvocationForm] = useState({
    eleve: "", classe: "", parent: "", motif: "", dateRdv: "", canalEnvoi: "SMS"
  });

  const calculateConduiteNote = (incidentCount: number, gravites: string[]): number => {
    let note = 20;
    gravites.forEach(g => {
      if (g === "Légère") note -= 1;
      else if (g === "Modérée") note -= 2;
      else if (g === "Grave") note -= 4;
    });
    return Math.max(0, note);
  };

  const handleCreateIncident = () => {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const newIncident: Incident = {
      id: Math.max(...incidents.map(i => i.id)) + 1,
      eleve: incidentForm.eleve,
      classe: incidentForm.classe,
      type: incidentForm.type,
      date: today,
      gravite: incidentForm.gravite as Incident["gravite"],
      sanction: incidentForm.sanction,
      statut: "En cours",
      rapporteur: incidentForm.rapporteur,
      notifieParents: incidentForm.notifieParents,
    };
    
    setIncidents(prev => [...prev, newIncident]);
    
    const existingConduite = conduites.find(c => c.eleve === incidentForm.eleve);
    if (existingConduite) {
      const studentIncidents = incidents.filter(i => i.eleve === incidentForm.eleve);
      const gravites = [...studentIncidents.map(i => i.gravite), incidentForm.gravite];
      const newNote = calculateConduiteNote(studentIncidents.length + 1, gravites);
      
      setConduites(prev => prev.map(c => 
        c.eleve === incidentForm.eleve ? {
          ...c,
          incidents: c.incidents + 1,
          note: newNote,
          tendance: newNote < c.note ? "down" : "stable",
          appreciation: newNote >= 16 ? "Bon comportement" : 
                       newNote >= 12 ? "Peut mieux faire" : 
                       newNote >= 10 ? "Conduite acceptable" : "Comportement à améliorer"
        } : c
      ));
    }
    
    toast({ 
      title: "Incident signalé", 
      description: `L'incident pour ${incidentForm.eleve} a été enregistré${incidentForm.notifieParents ? " et les parents ont été notifiés" : ""}` 
    });
    
    setIsDialogOpen(false);
    setIncidentForm({ eleve: "", classe: "", type: "", gravite: "", sanction: "", rapporteur: "", notifieParents: false });
  };

  const handleCreateConseil = () => {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const newConseil: ConseilDiscipline = {
      id: Math.max(...conseils.map(c => c.id), 0) + 1,
      eleve: conseilForm.eleve,
      classe: conseilForm.classe,
      dateConvocation: today,
      dateSeance: conseilForm.dateSeance,
      motifs: conseilForm.motifs.split(',').map(m => m.trim()),
      membres: ["M. le Directeur", "CPE", "Prof. Principal", "Délégué parents", "Délégué élèves"],
      statut: "Programmé"
    };
    
    setConseils(prev => [...prev, newConseil]);
    
    // Auto-create parent convocation
    const newConvocation: ConvocationParent = {
      id: Math.max(...convocations.map(c => c.id), 0) + 1,
      eleve: conseilForm.eleve,
      classe: conseilForm.classe,
      parent: `Parent de ${conseilForm.eleve}`,
      motif: "Conseil de discipline",
      dateConvocation: today,
      statut: "Envoyée",
      canalEnvoi: "Courrier"
    };
    setConvocations(prev => [...prev, newConvocation]);
    
    toast({ 
      title: "Conseil programmé", 
      description: `Le conseil de discipline pour ${conseilForm.eleve} est prévu le ${conseilForm.dateSeance}. Convocation envoyée.` 
    });
    
    setIsConseilDialogOpen(false);
    setConseilForm({ eleve: "", classe: "", dateSeance: "", motifs: "" });
  };

  const handleCreateMesure = () => {
    const newMesure: MesureEducative = {
      id: Math.max(...mesures.map(m => m.id), 0) + 1,
      eleve: mesureForm.eleve,
      classe: mesureForm.classe,
      type: mesureForm.type as MesureEducative["type"],
      dateDebut: mesureForm.dateDebut,
      dateFin: mesureForm.dateFin,
      responsable: mesureForm.responsable,
      objectifs: mesureForm.objectifs,
      statut: "En cours",
      progres: 0
    };
    
    setMesures(prev => [...prev, newMesure]);
    
    toast({ 
      title: "Mesure éducative créée", 
      description: `${mesureForm.type} mis en place pour ${mesureForm.eleve}` 
    });
    
    setIsMesureDialogOpen(false);
    setMesureForm({ eleve: "", classe: "", type: "", dateDebut: "", dateFin: "", responsable: "", objectifs: "" });
  };

  const handleCreateConvocation = () => {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const newConvocation: ConvocationParent = {
      id: Math.max(...convocations.map(c => c.id), 0) + 1,
      eleve: convocationForm.eleve,
      classe: convocationForm.classe,
      parent: convocationForm.parent,
      motif: convocationForm.motif,
      dateConvocation: today,
      dateRdv: convocationForm.dateRdv,
      statut: "Envoyée",
      canalEnvoi: convocationForm.canalEnvoi as ConvocationParent["canalEnvoi"]
    };
    
    setConvocations(prev => [...prev, newConvocation]);
    
    toast({ 
      title: "Convocation envoyée", 
      description: `Convocation envoyée à ${convocationForm.parent} par ${convocationForm.canalEnvoi}` 
    });
    
    setIsConvocationDialogOpen(false);
    setConvocationForm({ eleve: "", classe: "", parent: "", motif: "", dateRdv: "", canalEnvoi: "SMS" });
  };

  const handleUpdateStatus = (incidentId: number, newStatus: Incident["statut"]) => {
    setIncidents(prev => prev.map(i => 
      i.id === incidentId ? { ...i, statut: newStatus } : i
    ));
    toast({ title: "Statut mis à jour", description: `L'incident est maintenant "${newStatus}"` });
  };

  const handleNotifyParents = (incident: Incident) => {
    setIncidents(prev => prev.map(i => 
      i.id === incident.id ? { ...i, notifieParents: true } : i
    ));
    toast({ title: "Parents notifiés", description: `Les parents de ${incident.eleve} ont été informés par SMS` });
  };

  const handleUpdateConseilStatus = (conseilId: number, newStatus: ConseilDiscipline["statut"]) => {
    setConseils(prev => prev.map(c => 
      c.id === conseilId ? { ...c, statut: newStatus } : c
    ));
    toast({ title: "Statut mis à jour", description: `Le conseil est maintenant "${newStatus}"` });
  };

  const handleDeliberateConseil = (conseilId: number, decision: string) => {
    setConseils(prev => prev.map(c => 
      c.id === conseilId ? { ...c, statut: "Délibéré", decision } : c
    ));
    toast({ title: "Décision enregistrée", description: `Le conseil a délibéré: ${decision}` });
  };

  const handleUpdateConvocationStatus = (convocId: number, newStatus: ConvocationParent["statut"]) => {
    setConvocations(prev => prev.map(c => 
      c.id === convocId ? { ...c, statut: newStatus } : c
    ));
    toast({ title: "Statut mis à jour" });
  };

  const totalIncidents = incidents.length;
  const treatedIncidents = incidents.filter(i => i.statut === "Traité").length;
  const pendingIncidents = incidents.filter(i => i.statut === "En cours").length;
  const graveIncidents = incidents.filter(i => i.gravite === "Grave").length;
  const pendingConseils = conseils.filter(c => c.statut === "Programmé").length;
  const activeMesures = mesures.filter(m => m.statut === "En cours").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discipline & Comportement</h1>
          <p className="text-muted-foreground">Gestion des incidents, conseils de discipline et mesures éducatives</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Signaler Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Signaler un Incident</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de l'élève</Label>
                    <Input 
                      placeholder="Ex: KOUASSI Jean"
                      value={incidentForm.eleve}
                      onChange={(e) => setIncidentForm({...incidentForm, eleve: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Select onValueChange={(v) => setIncidentForm({...incidentForm, classe: v})}>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type d'incident</Label>
                    <Select onValueChange={(v) => setIncidentForm({...incidentForm, type: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retard">Retard</SelectItem>
                        <SelectItem value="Absence injustifiée">Absence injustifiée</SelectItem>
                        <SelectItem value="Insolence">Insolence</SelectItem>
                        <SelectItem value="Bagarre">Bagarre</SelectItem>
                        <SelectItem value="Tricherie">Tricherie</SelectItem>
                        <SelectItem value="Oubli matériel">Oubli matériel</SelectItem>
                        <SelectItem value="Dégradation">Dégradation</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gravité</Label>
                    <Select onValueChange={(v) => setIncidentForm({...incidentForm, gravite: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Légère">Légère</SelectItem>
                        <SelectItem value="Modérée">Modérée</SelectItem>
                        <SelectItem value="Grave">Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sanction</Label>
                    <Select onValueChange={(v) => setIncidentForm({...incidentForm, sanction: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Observation">Observation</SelectItem>
                        <SelectItem value="Avertissement">Avertissement</SelectItem>
                        <SelectItem value="Retenue">Retenue</SelectItem>
                        <SelectItem value="Convocation parents">Convocation parents</SelectItem>
                        <SelectItem value="Exclusion 1 jour">Exclusion 1 jour</SelectItem>
                        <SelectItem value="Exclusion 2 jours">Exclusion 2 jours</SelectItem>
                        <SelectItem value="Exclusion 5 jours">Exclusion 5 jours</SelectItem>
                        <SelectItem value="Conseil de discipline">Conseil de discipline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rapporteur</Label>
                    <Select onValueChange={(v) => setIncidentForm({...incidentForm, rapporteur: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M. KOFFI">M. KOFFI</SelectItem>
                        <SelectItem value="Mme DIALLO">Mme DIALLO</SelectItem>
                        <SelectItem value="M. TOURÉ">M. TOURÉ</SelectItem>
                        <SelectItem value="M. KONE">M. KONE</SelectItem>
                        <SelectItem value="M. YAO">M. YAO</SelectItem>
                        <SelectItem value="Mme BAMBA">Mme BAMBA</SelectItem>
                        <SelectItem value="Surveillant">Surveillant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="notifieParents"
                    checked={incidentForm.notifieParents}
                    onChange={(e) => setIncidentForm({...incidentForm, notifieParents: e.target.checked})}
                  />
                  <Label htmlFor="notifieParents">Notifier les parents par SMS</Label>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleCreateIncident}>Signaler</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncidents}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traités</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{treatedIncidents}</div>
            <p className="text-xs text-muted-foreground">Résolus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingIncidents}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graves</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{graveIncidents}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conseils</CardTitle>
            <Gavel className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{pendingConseils}</div>
            <p className="text-xs text-muted-foreground">Programmés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesures</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeMesures}</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="conseils">Conseils Discipline</TabsTrigger>
          <TabsTrigger value="convocations">Convocations</TabsTrigger>
          <TabsTrigger value="mesures">Mesures Éducatives</TabsTrigger>
          <TabsTrigger value="conduites">Notes Conduite</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incidents Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Sanction</TableHead>
                    <TableHead>Parents</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{inc.eleve}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inc.classe}</Badge>
                      </TableCell>
                      <TableCell>{inc.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {inc.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          inc.gravite === "Grave" ? "destructive" :
                          inc.gravite === "Modérée" ? "default" :
                          "secondary"
                        }>
                          {inc.gravite}
                        </Badge>
                      </TableCell>
                      <TableCell>{inc.sanction}</TableCell>
                      <TableCell>
                        {inc.notifieParents ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Notifiés
                          </Badge>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleNotifyParents(inc)}>
                            Notifier
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={inc.statut} 
                          onValueChange={(v) => handleUpdateStatus(inc.id, v as Incident["statut"])}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="En cours">En cours</SelectItem>
                            <SelectItem value="Traité">Traité</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conseils">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isConseilDialogOpen} onOpenChange={setIsConseilDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Gavel className="mr-2 h-4 w-4" />
                    Programmer un Conseil
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Programmer un Conseil de Discipline</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Élève concerné</Label>
                        <Input 
                          placeholder="Nom de l'élève"
                          value={conseilForm.eleve}
                          onChange={(e) => setConseilForm({...conseilForm, eleve: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Classe</Label>
                        <Select onValueChange={(v) => setConseilForm({...conseilForm, classe: v})}>
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
                      <Label>Date de la séance</Label>
                      <Input 
                        type="date"
                        value={conseilForm.dateSeance}
                        onChange={(e) => setConseilForm({...conseilForm, dateSeance: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Motifs (séparés par des virgules)</Label>
                      <Textarea 
                        placeholder="Ex: Insolence répétée, Bagarre, Refus d'obéir"
                        value={conseilForm.motifs}
                        onChange={(e) => setConseilForm({...conseilForm, motifs: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsConseilDialogOpen(false)}>Annuler</Button>
                      <Button onClick={handleCreateConseil}>Programmer</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {conseils.map((conseil) => (
                <Card key={conseil.id} className={conseil.statut === "Délibéré" ? "border-green-200 bg-green-50/50" : conseil.statut === "Annulé" ? "border-gray-200 bg-gray-50/50 opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg">{conseil.eleve}</CardTitle>
                        <Badge variant="outline">{conseil.classe}</Badge>
                      </div>
                      <Badge variant={
                        conseil.statut === "Programmé" ? "default" :
                        conseil.statut === "En cours" ? "secondary" :
                        conseil.statut === "Délibéré" ? "default" :
                        "destructive"
                      } className={conseil.statut === "Délibéré" ? "bg-green-600" : ""}>
                        {conseil.statut}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Convocation:</span>
                        <p className="font-medium">{conseil.dateConvocation}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Séance:</span>
                        <p className="font-medium">{conseil.dateSeance}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Motifs:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {conseil.motifs.map((motif, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{motif}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Membres du conseil:</span>
                      <p className="text-sm">{conseil.membres.join(", ")}</p>
                    </div>

                    {conseil.decision && (
                      <div className="p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Décision:</span>
                        <p className="text-sm">{conseil.decision}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {conseil.statut === "Programmé" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateConseilStatus(conseil.id, "En cours")}>
                            <ClipboardList className="mr-1 h-4 w-4" />
                            Démarrer
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpdateConseilStatus(conseil.id, "Annulé")}>
                            Annuler
                          </Button>
                        </>
                      )}
                      {conseil.statut === "En cours" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Gavel className="mr-1 h-4 w-4" />
                              Délibérer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Décision du Conseil</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Select onValueChange={(v) => handleDeliberateConseil(conseil.id, v)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir la décision" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Avertissement solennel">Avertissement solennel</SelectItem>
                                  <SelectItem value="Blâme">Blâme</SelectItem>
                                  <SelectItem value="Exclusion temporaire 8 jours">Exclusion temporaire 8 jours</SelectItem>
                                  <SelectItem value="Exclusion définitive avec sursis">Exclusion définitive avec sursis</SelectItem>
                                  <SelectItem value="Exclusion définitive">Exclusion définitive</SelectItem>
                                  <SelectItem value="Mesures éducatives">Mesures éducatives alternatives</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setSelectedConseil(conseil)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="convocations">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isConvocationDialogOpen} onOpenChange={setIsConvocationDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Nouvelle Convocation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convoquer un Parent</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Élève</Label>
                        <Input 
                          placeholder="Nom de l'élève"
                          value={convocationForm.eleve}
                          onChange={(e) => setConvocationForm({...convocationForm, eleve: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Classe</Label>
                        <Select onValueChange={(v) => setConvocationForm({...convocationForm, classe: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6ème A">6ème A</SelectItem>
                            <SelectItem value="5ème B">5ème B</SelectItem>
                            <SelectItem value="2nde B">2nde B</SelectItem>
                            <SelectItem value="1ère A">1ère A</SelectItem>
                            <SelectItem value="Tle D">Tle D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Nom du parent</Label>
                      <Input 
                        placeholder="Ex: M. DIALLO Ibrahim"
                        value={convocationForm.parent}
                        onChange={(e) => setConvocationForm({...convocationForm, parent: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Motif</Label>
                      <Select onValueChange={(v) => setConvocationForm({...convocationForm, motif: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Absences répétées">Absences répétées</SelectItem>
                          <SelectItem value="Retards fréquents">Retards fréquents</SelectItem>
                          <SelectItem value="Comportement">Problème de comportement</SelectItem>
                          <SelectItem value="Résultats scolaires">Résultats scolaires</SelectItem>
                          <SelectItem value="Conseil de discipline">Conseil de discipline</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date et heure du RDV</Label>
                        <Input 
                          type="datetime-local"
                          value={convocationForm.dateRdv}
                          onChange={(e) => setConvocationForm({...convocationForm, dateRdv: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Canal d'envoi</Label>
                        <Select value={convocationForm.canalEnvoi} onValueChange={(v) => setConvocationForm({...convocationForm, canalEnvoi: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SMS">SMS</SelectItem>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Courrier">Courrier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsConvocationDialogOpen(false)}>Annuler</Button>
                      <Button onClick={handleCreateConvocation}>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Convocations Parents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Convocation</TableHead>
                      <TableHead>RDV</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {convocations.map((conv) => (
                      <TableRow key={conv.id}>
                        <TableCell className="font-medium">{conv.eleve}</TableCell>
                        <TableCell><Badge variant="outline">{conv.classe}</Badge></TableCell>
                        <TableCell>{conv.parent}</TableCell>
                        <TableCell>{conv.motif}</TableCell>
                        <TableCell>{conv.dateConvocation}</TableCell>
                        <TableCell>{conv.dateRdv || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{conv.canalEnvoi}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            conv.statut === "Réalisée" ? "default" :
                            conv.statut === "Confirmée" ? "secondary" :
                            conv.statut === "Absence" ? "destructive" :
                            "outline"
                          } className={conv.statut === "Réalisée" ? "bg-green-600" : ""}>
                            {conv.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={conv.statut} 
                            onValueChange={(v) => handleUpdateConvocationStatus(conv.id, v as ConvocationParent["statut"])}
                          >
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Envoyée">Envoyée</SelectItem>
                              <SelectItem value="Confirmée">Confirmée</SelectItem>
                              <SelectItem value="Réalisée">Réalisée</SelectItem>
                              <SelectItem value="Absence">Absence</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mesures">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isMesureDialogOpen} onOpenChange={setIsMesureDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Nouvelle Mesure
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer une Mesure Éducative</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Élève</Label>
                        <Input 
                          placeholder="Nom de l'élève"
                          value={mesureForm.eleve}
                          onChange={(e) => setMesureForm({...mesureForm, eleve: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Classe</Label>
                        <Select onValueChange={(v) => setMesureForm({...mesureForm, classe: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6ème A">6ème A</SelectItem>
                            <SelectItem value="5ème B">5ème B</SelectItem>
                            <SelectItem value="2nde B">2nde B</SelectItem>
                            <SelectItem value="1ère A">1ère A</SelectItem>
                            <SelectItem value="Tle D">Tle D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Type de mesure</Label>
                      <Select onValueChange={(v) => setMesureForm({...mesureForm, type: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tutorat">Tutorat par un enseignant</SelectItem>
                          <SelectItem value="TIG">Travail d'Intérêt Général</SelectItem>
                          <SelectItem value="Stage réflexion">Stage de réflexion</SelectItem>
                          <SelectItem value="Suivi psychologue">Suivi psychologue</SelectItem>
                          <SelectItem value="Contrat comportement">Contrat de comportement</SelectItem>
                          <SelectItem value="Médiation">Médiation entre pairs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date de début</Label>
                        <Input 
                          type="date"
                          value={mesureForm.dateDebut}
                          onChange={(e) => setMesureForm({...mesureForm, dateDebut: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date de fin</Label>
                        <Input 
                          type="date"
                          value={mesureForm.dateFin}
                          onChange={(e) => setMesureForm({...mesureForm, dateFin: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Responsable du suivi</Label>
                      <Input 
                        placeholder="Ex: M. KOFFI"
                        value={mesureForm.responsable}
                        onChange={(e) => setMesureForm({...mesureForm, responsable: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Objectifs</Label>
                      <Textarea 
                        placeholder="Définir les objectifs de cette mesure éducative..."
                        value={mesureForm.objectifs}
                        onChange={(e) => setMesureForm({...mesureForm, objectifs: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsMesureDialogOpen(false)}>Annuler</Button>
                      <Button onClick={handleCreateMesure}>Créer</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mesures.map((mesure) => (
                <Card key={mesure.id} className={mesure.statut === "Terminé" ? "border-green-200" : mesure.statut === "Abandonné" ? "border-red-200 opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{mesure.eleve}</CardTitle>
                        <Badge variant="outline">{mesure.classe}</Badge>
                      </div>
                      <Badge variant={
                        mesure.statut === "En cours" ? "default" :
                        mesure.statut === "Terminé" ? "secondary" :
                        "destructive"
                      } className={mesure.statut === "Terminé" ? "bg-green-600" : ""}>
                        {mesure.statut}
                      </Badge>
                    </div>
                    <CardDescription>{mesure.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Début:</span>
                        <p className="font-medium">{mesure.dateDebut}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fin:</span>
                        <p className="font-medium">{mesure.dateFin}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Responsable:</span>
                      <p className="text-sm font-medium">{mesure.responsable}</p>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Objectifs:</span>
                      <p className="text-sm">{mesure.objectifs}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progression:</span>
                        <span className="font-medium">{mesure.progres}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            mesure.progres >= 75 ? "bg-green-500" :
                            mesure.progres >= 50 ? "bg-blue-500" :
                            mesure.progres >= 25 ? "bg-yellow-500" :
                            "bg-red-500"
                          }`}
                          style={{ width: `${mesure.progres}%` }}
                        />
                      </div>
                    </div>

                    {mesure.evaluation && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-sm font-medium text-green-800">Évaluation finale:</span>
                        <p className="text-sm text-green-700">{mesure.evaluation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conduites">
          <Card>
            <CardHeader>
              <CardTitle>Notes de Conduite</CardTitle>
              <CardDescription>Calculées automatiquement selon les incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Incidents</TableHead>
                    <TableHead>Note de Conduite</TableHead>
                    <TableHead>Tendance</TableHead>
                    <TableHead>Appréciation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conduites.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.eleve}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        {c.incidents > 0 ? (
                          <Badge variant={c.incidents > 3 ? "destructive" : "secondary"}>{c.incidents}</Badge>
                        ) : (
                          <span className="text-green-600">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${
                          c.note >= 16 ? "text-green-600" :
                          c.note >= 12 ? "text-blue-600" :
                          c.note >= 10 ? "text-orange-600" :
                          "text-red-600"
                        }`}>
                          {c.note}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.tendance === "up" ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            En hausse
                          </div>
                        ) : c.tendance === "down" ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="h-4 w-4" />
                            En baisse
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Stable</span>
                        )}
                      </TableCell>
                      <TableCell>{c.appreciation}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type d'Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incidentTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {incidentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Sanctions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sanctions} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="type" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" name="Nombre">
                        {sanctions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 20]} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="incidents" name="Incidents" stroke="#ef4444" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="noteConduite" name="Note Conduite Moy." stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
