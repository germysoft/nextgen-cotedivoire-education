import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, Mail, MessageSquare, Calendar, Syringe, Clock, Users,
  Settings, Send, CheckCircle, AlertCircle, Plus, Search, Filter,
  Smartphone, RefreshCw, History, Eye, Edit, Trash2
} from "lucide-react";
import { toast } from "sonner";

interface Rappel {
  id: string;
  type: "vaccination" | "rdv_medical" | "suivi";
  eleve: {
    nom: string;
    prenom: string;
    classe: string;
    matricule: string;
  };
  parentContact: {
    nom: string;
    telephone: string;
    email: string;
  };
  dateEvenement: string;
  dateRappel: string;
  canal: "sms" | "email" | "both";
  statut: "planifié" | "envoyé" | "échec" | "confirmé";
  message: string;
  motif: string;
}

interface ConfigurationRappel {
  id: string;
  type: string;
  delaiJours: number;
  canalDefaut: string;
  messageTemplate: string;
  actif: boolean;
}

const rappelsProgrammes: Rappel[] = [
  {
    id: "R001",
    type: "vaccination",
    eleve: { nom: "KOUADIO", prenom: "Aya", classe: "6ème A", matricule: "2024-0156" },
    parentContact: { nom: "Mme KOUADIO", telephone: "+225 07 12 34 56 78", email: "kouadio.parent@email.com" },
    dateEvenement: "2024-12-28",
    dateRappel: "2024-12-21",
    canal: "both",
    statut: "planifié",
    message: "Rappel: Vaccination de votre enfant Aya prévue le 28/12/2024 à l'infirmerie.",
    motif: "Rappel vaccin Hépatite B - 2ème dose"
  },
  {
    id: "R002",
    type: "rdv_medical",
    eleve: { nom: "TRAORE", prenom: "Ibrahim", classe: "5ème B", matricule: "2024-0089" },
    parentContact: { nom: "M. TRAORE", telephone: "+225 05 98 76 54 32", email: "traore.parent@email.com" },
    dateEvenement: "2024-12-23",
    dateRappel: "2024-12-20",
    canal: "sms",
    statut: "envoyé",
    message: "Rappel: RDV médical pour Ibrahim le 23/12/2024 à 10h00 à l'infirmerie.",
    motif: "Contrôle suivi allergie"
  },
  {
    id: "R003",
    type: "suivi",
    eleve: { nom: "KONE", prenom: "Fatou", classe: "6ème C", matricule: "2024-0234" },
    parentContact: { nom: "Mme KONE", telephone: "+225 01 23 45 67 89", email: "kone.parent@email.com" },
    dateEvenement: "2024-12-22",
    dateRappel: "2024-12-19",
    canal: "email",
    statut: "confirmé",
    message: "Rappel: Suivi médical de Fatou prévu le 22/12/2024 à l'infirmerie.",
    motif: "Suivi traitement asthme"
  },
  {
    id: "R004",
    type: "vaccination",
    eleve: { nom: "DIALLO", prenom: "Mamadou", classe: "4ème A", matricule: "2024-0312" },
    parentContact: { nom: "M. DIALLO", telephone: "+225 07 55 44 33 22", email: "diallo.parent@email.com" },
    dateEvenement: "2024-12-30",
    dateRappel: "2024-12-23",
    canal: "both",
    statut: "planifié",
    message: "Rappel: Campagne de vaccination prévue le 30/12/2024.",
    motif: "Vaccin DT-Polio"
  }
];

const vaccinationsAVenir = [
  { id: "V001", eleve: "KOUADIO Aya", classe: "6ème A", vaccin: "Hépatite B (2ème dose)", date: "2024-12-28", rappelEnvoye: false },
  { id: "V002", eleve: "DIALLO Mamadou", classe: "4ème A", vaccin: "DT-Polio", date: "2024-12-30", rappelEnvoye: false },
  { id: "V003", eleve: "OUATTARA Aminata", classe: "5ème C", vaccin: "ROR", date: "2025-01-05", rappelEnvoye: false },
  { id: "V004", eleve: "BAMBA Sekou", classe: "3ème B", vaccin: "Méningite", date: "2025-01-10", rappelEnvoye: false },
  { id: "V005", eleve: "CAMARA Aissatou", classe: "6ème B", vaccin: "BCG (rappel)", date: "2025-01-15", rappelEnvoye: false }
];

const rdvMedicaux = [
  { id: "M001", eleve: "TRAORE Ibrahim", classe: "5ème B", motif: "Contrôle allergie", date: "2024-12-23", heure: "10:00", rappelEnvoye: true },
  { id: "M002", eleve: "KONE Fatou", classe: "6ème C", motif: "Suivi asthme", date: "2024-12-22", heure: "14:30", rappelEnvoye: true },
  { id: "M003", eleve: "SYLLA Moussa", classe: "4ème C", motif: "Contrôle vision", date: "2024-12-27", heure: "09:00", rappelEnvoye: false },
  { id: "M004", eleve: "TOURE Kadiatou", classe: "5ème A", motif: "Suivi diabète", date: "2024-12-29", heure: "11:00", rappelEnvoye: false }
];

const configurationsRappels: ConfigurationRappel[] = [
  { id: "C001", type: "vaccination", delaiJours: 7, canalDefaut: "both", messageTemplate: "Rappel: Vaccination de {eleve} prévue le {date} à l'infirmerie.", actif: true },
  { id: "C002", type: "rdv_medical", delaiJours: 3, canalDefaut: "sms", messageTemplate: "Rappel: RDV médical pour {eleve} le {date} à {heure}.", actif: true },
  { id: "C003", type: "suivi", delaiJours: 2, canalDefaut: "email", messageTemplate: "Rappel: Suivi médical de {eleve} prévu le {date}.", actif: true },
  { id: "C004", type: "campagne", delaiJours: 14, canalDefaut: "both", messageTemplate: "Information: Campagne de vaccination {vaccin} le {date}.", actif: false }
];

const historiqueEnvois = [
  { id: "H001", date: "2024-12-19", destinataire: "Mme KONE", canal: "email", objet: "Rappel suivi Fatou", statut: "livré" },
  { id: "H002", date: "2024-12-19", destinataire: "M. TRAORE", canal: "sms", objet: "Rappel RDV Ibrahim", statut: "livré" },
  { id: "H003", date: "2024-12-18", destinataire: "Mme BAMBA", canal: "email", objet: "Rappel vaccination", statut: "échec" },
  { id: "H004", date: "2024-12-17", destinataire: "M. CAMARA", canal: "sms", objet: "Rappel contrôle", statut: "livré" },
  { id: "H005", date: "2024-12-16", destinataire: "Mme SYLLA", canal: "both", objet: "Rappel suivi", statut: "livré" }
];

export default function RappelsMedicaux() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [showNewRappel, setShowNewRappel] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const [newRappel, setNewRappel] = useState({
    eleveSearch: "",
    type: "vaccination",
    dateEvenement: "",
    canal: "both",
    messagePersonnalise: ""
  });

  const envoyerRappel = (rappel: Rappel) => {
    toast.success(`Rappel envoyé à ${rappel.parentContact.nom} via ${rappel.canal === 'both' ? 'SMS et Email' : rappel.canal.toUpperCase()}`);
  };

  const envoyerRappelsMasse = (type: string) => {
    toast.success(`Envoi en masse des rappels ${type} programmé`);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "vaccination": return "bg-purple-100 text-purple-800";
      case "rdv_medical": return "bg-blue-100 text-blue-800";
      case "suivi": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "planifié": return "bg-yellow-100 text-yellow-800";
      case "envoyé": return "bg-blue-100 text-blue-800";
      case "confirmé": return "bg-green-100 text-green-800";
      case "échec": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRappels = rappelsProgrammes.filter(r => {
    const matchSearch = r.eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "tous" || r.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rappels Automatiques</h1>
          <p className="text-muted-foreground">Gestion des rappels SMS/Email pour RDV et vaccinations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showConfig} onOpenChange={setShowConfig}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configuration des rappels automatiques</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {configurationsRappels.map(config => (
                  <Card key={config.id} className={!config.actif ? "opacity-60" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeBadge(config.type)}>{config.type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Rappel {config.delaiJours} jours avant
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Canal: {config.canalDefaut === "both" ? "SMS + Email" : config.canalDefaut.toUpperCase()}
                          </p>
                          <p className="text-sm bg-muted p-2 rounded">
                            {config.messageTemplate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={config.actif} />
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showNewRappel} onOpenChange={setShowNewRappel}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau rappel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Programmer un rappel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Rechercher un élève</Label>
                  <Input 
                    placeholder="Nom ou matricule de l'élève..."
                    value={newRappel.eleveSearch}
                    onChange={(e) => setNewRappel(prev => ({ ...prev, eleveSearch: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type de rappel</Label>
                  <Select 
                    value={newRappel.type}
                    onValueChange={(v) => setNewRappel(prev => ({ ...prev, type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="rdv_medical">RDV Médical</SelectItem>
                      <SelectItem value="suivi">Suivi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date de l'événement</Label>
                  <Input 
                    type="date"
                    value={newRappel.dateEvenement}
                    onChange={(e) => setNewRappel(prev => ({ ...prev, dateEvenement: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Canal de notification</Label>
                  <Select 
                    value={newRappel.canal}
                    onValueChange={(v) => setNewRappel(prev => ({ ...prev, canal: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS uniquement</SelectItem>
                      <SelectItem value="email">Email uniquement</SelectItem>
                      <SelectItem value="both">SMS + Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Message personnalisé (optionnel)</Label>
                  <Textarea 
                    placeholder="Laissez vide pour utiliser le message par défaut..."
                    value={newRappel.messagePersonnalise}
                    onChange={(e) => setNewRappel(prev => ({ ...prev, messagePersonnalise: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => {
                    toast.success("Rappel programmé avec succès");
                    setShowNewRappel(false);
                  }}>
                    <Bell className="h-4 w-4 mr-2" />
                    Programmer
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewRappel(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Syringe className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{vaccinationsAVenir.length}</p>
                <p className="text-sm text-muted-foreground">Vaccinations à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rdvMedicaux.length}</p>
                <p className="text-sm text-muted-foreground">RDV programmés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rappelsProgrammes.filter(r => r.statut === "planifié").length}</p>
                <p className="text-sm text-muted-foreground">Rappels en attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rappelsProgrammes.filter(r => r.statut === "envoyé" || r.statut === "confirmé").length}</p>
                <p className="text-sm text-muted-foreground">Rappels envoyés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rappelsProgrammes.filter(r => r.statut === "échec").length}</p>
                <p className="text-sm text-muted-foreground">Échecs d'envoi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rappels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rappels">Rappels programmés</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations à venir</TabsTrigger>
          <TabsTrigger value="rdv">RDV médicaux</TabsTrigger>
          <TabsTrigger value="historique">Historique d'envois</TabsTrigger>
        </TabsList>

        <TabsContent value="rappels">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Rappels programmés</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les types</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="rdv_medical">RDV Médical</SelectItem>
                      <SelectItem value="suivi">Suivi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => envoyerRappelsMasse("planifiés")}>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer tous
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Date événement</TableHead>
                    <TableHead>Date rappel</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRappels.map(rappel => (
                    <TableRow key={rappel.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rappel.eleve.nom} {rappel.eleve.prenom}</p>
                          <p className="text-sm text-muted-foreground">{rappel.eleve.classe}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeBadge(rappel.type)}>
                          {rappel.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{rappel.motif}</TableCell>
                      <TableCell>{new Date(rappel.dateEvenement).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{new Date(rappel.dateRappel).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(rappel.canal === "sms" || rappel.canal === "both") && (
                            <Smartphone className="h-4 w-4 text-blue-500" />
                          )}
                          {(rappel.canal === "email" || rappel.canal === "both") && (
                            <Mail className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatutBadge(rappel.statut)}>
                          {rappel.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => envoyerRappel(rappel)}
                            disabled={rappel.statut === "envoyé" || rappel.statut === "confirmé"}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="vaccinations">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Vaccinations à venir (30 prochains jours)</CardTitle>
                <Button onClick={() => envoyerRappelsMasse("vaccinations")}>
                  <Bell className="h-4 w-4 mr-2" />
                  Envoyer rappels vaccinations
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Vaccin</TableHead>
                    <TableHead>Date prévue</TableHead>
                    <TableHead>Rappel envoyé</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccinationsAVenir.map(vacc => (
                    <TableRow key={vacc.id}>
                      <TableCell className="font-medium">{vacc.eleve}</TableCell>
                      <TableCell>{vacc.classe}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Syringe className="h-4 w-4 text-purple-500" />
                          {vacc.vaccin}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(vacc.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        {vacc.rappelEnvoye ? (
                          <Badge className="bg-green-100 text-green-800">Envoyé</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={vacc.rappelEnvoye ? "outline" : "default"}
                            disabled={vacc.rappelEnvoye}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Rappeler
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

        <TabsContent value="rdv">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>RDV médicaux programmés</CardTitle>
                <Button onClick={() => envoyerRappelsMasse("rdv")}>
                  <Bell className="h-4 w-4 mr-2" />
                  Envoyer rappels RDV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Rappel envoyé</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rdvMedicaux.map(rdv => (
                    <TableRow key={rdv.id}>
                      <TableCell className="font-medium">{rdv.eleve}</TableCell>
                      <TableCell>{rdv.classe}</TableCell>
                      <TableCell>{rdv.motif}</TableCell>
                      <TableCell>{new Date(rdv.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{rdv.heure}</TableCell>
                      <TableCell>
                        {rdv.rappelEnvoye ? (
                          <Badge className="bg-green-100 text-green-800">Envoyé</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={rdv.rappelEnvoye ? "outline" : "default"}
                            disabled={rdv.rappelEnvoye}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Rappeler
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

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historique des envois</CardTitle>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Objet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historiqueEnvois.map(envoi => (
                    <TableRow key={envoi.id}>
                      <TableCell>{new Date(envoi.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="font-medium">{envoi.destinataire}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {envoi.canal === "sms" && <Smartphone className="h-4 w-4 text-blue-500" />}
                          {envoi.canal === "email" && <Mail className="h-4 w-4 text-green-500" />}
                          {envoi.canal === "both" && (
                            <>
                              <Smartphone className="h-4 w-4 text-blue-500" />
                              <Mail className="h-4 w-4 text-green-500" />
                            </>
                          )}
                          <span className="text-sm">{envoi.canal.toUpperCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{envoi.objet}</TableCell>
                      <TableCell>
                        <Badge className={envoi.statut === "livré" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {envoi.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {envoi.statut === "échec" && (
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4" />
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
      </Tabs>

      {/* Card informative sur l'intégration */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Intégration SMS/Email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pour activer l'envoi réel de SMS et d'emails, connectez un service de messagerie 
                (Twilio pour SMS, Resend pour Email) via Lovable Cloud.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurer SMS (Twilio)
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Configurer Email (Resend)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
