import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  MessageSquare, Send, Clock, CheckCircle2, XCircle, Users, DollarSign, 
  Plus, Edit, Trash2, FileText, Calendar, Search, Download 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SMSEnvoi {
  id: number;
  destinataires: string;
  nombre: number;
  message: string;
  operateur: string;
  statut: string;
  date: string;
  cout: number;
  scheduled?: boolean;
  scheduledDate?: string;
}

interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  usageCount: number;
}

const initialHistorique: SMSEnvoi[] = [
  { id: 1, destinataires: "Parents 6ème A", nombre: 25, message: "Réunion parents-profs vendredi 14h", operateur: "MTN", statut: "Envoyé", date: "2024-12-01 09:30", cout: 2500 },
  { id: 2, destinataires: "Tous les parents", nombre: 465, message: "Vacances de Noël du 20/12 au 06/01", operateur: "Orange", statut: "Envoyé", date: "2024-11-28 15:00", cout: 46500 },
  { id: 3, destinataires: "Parents élèves impayés", nombre: 65, message: "Rappel échéance paiement 30/11", operateur: "Moov", statut: "Envoyé", date: "2024-11-25 10:00", cout: 6500 },
  { id: 4, destinataires: "Parents 3ème C", nombre: 30, message: "Composition Maths reportée au 15/12", operateur: "MTN", statut: "Échec partiel", date: "2024-11-20 08:00", cout: 2400 },
];

const initialTemplates: SMSTemplate[] = [
  { id: '1', name: "Absence élève", content: "Bonjour, votre enfant {{nom}} est absent aujourd'hui. Merci de contacter l'école.", category: "Absences", variables: ["nom"], usageCount: 45 },
  { id: '2', name: "Réunion parents", content: "Chers parents, une réunion est prévue le {{date}} à {{heure}}. Votre présence est importante.", category: "Réunions", variables: ["date", "heure"], usageCount: 12 },
  { id: '3', name: "Rappel paiement", content: "Rappel: Le paiement de {{montant}} FCFA pour {{objet}} est attendu avant le {{date}}.", category: "Paiements", variables: ["montant", "objet", "date"], usageCount: 28 },
  { id: '4', name: "Résultats examens", content: "Les résultats des examens de {{periode}} sont disponibles. Consultez le portail parent.", category: "Examens", variables: ["periode"], usageCount: 8 },
];

const statistiquesOperateurs = [
  { operateur: "MTN", envoyes: 1250, cout: 125000, taux_reussite: 98 },
  { operateur: "Orange", envoyes: 980, cout: 98000, taux_reussite: 97 },
  { operateur: "Moov", envoyes: 730, cout: 73000, taux_reussite: 96 },
  { operateur: "TrésorPay", envoyes: 120, cout: 12000, taux_reussite: 99 },
];

const evolutionMensuelle = [
  { mois: "Sep", envoyes: 450, cout: 45000 },
  { mois: "Oct", envoyes: 520, cout: 52000 },
  { mois: "Nov", envoyes: 680, cout: 68000 },
  { mois: "Déc", envoyes: 380, cout: 38000 },
];

const SMSPro = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
  const [isDeleteTemplateOpen, setIsDeleteTemplateOpen] = useState(false);
  const [selectedGroupe, setSelectedGroupe] = useState("");
  const [selectedOperateur, setSelectedOperateur] = useState("mtn");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [historiqueEnvois, setHistoriqueEnvois] = useState<SMSEnvoi[]>(initialHistorique);
  const [templates, setTemplates] = useState<SMSTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null);
  
  // Template form
  const [templateForm, setTemplateForm] = useState({
    name: '',
    content: '',
    category: 'Général',
  });

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setCharCount(e.target.value.length);
  };

  const resetSMSForm = () => {
    setSelectedGroupe("");
    setSelectedOperateur("mtn");
    setMessage("");
    setCharCount(0);
    setIsScheduled(false);
    setScheduledDate("");
    setScheduledTime("");
    setSelectedTemplate(null);
  };

  const handleEnvoiSMS = () => {
    if (!selectedGroupe || !message) {
      toast.error("Veuillez sélectionner un groupe et entrer un message");
      return;
    }

    const nombreDestinataires = selectedGroupe === "tous" ? 465 : 
                                selectedGroupe === "impayes" ? 65 : 
                                selectedGroupe === "enseignants" ? 32 : 75;

    const newEnvoi: SMSEnvoi = {
      id: historiqueEnvois.length + 1,
      destinataires: selectedGroupe === "tous" ? "Tous les parents" :
                     selectedGroupe === "impayes" ? "Parents impayés" :
                     selectedGroupe === "enseignants" ? "Enseignants" :
                     `Parents ${selectedGroupe}`,
      nombre: nombreDestinataires,
      message: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
      operateur: selectedOperateur.toUpperCase(),
      statut: isScheduled ? "Programmé" : "Envoyé",
      date: isScheduled ? `${scheduledDate} ${scheduledTime}` : new Date().toLocaleString('fr-FR'),
      cout: nombreDestinataires * 100,
      scheduled: isScheduled,
      scheduledDate: isScheduled ? `${scheduledDate} ${scheduledTime}` : undefined,
    };

    setHistoriqueEnvois([newEnvoi, ...historiqueEnvois]);
    
    if (isScheduled) {
      toast.success(`SMS programmé pour ${scheduledDate} à ${scheduledTime}`);
    } else {
      toast.success(`SMS envoyé avec succès à ${nombreDestinataires} destinataires`);
    }
    
    setIsDialogOpen(false);
    resetSMSForm();
  };

  const handleUseTemplate = (template: SMSTemplate) => {
    setMessage(template.content);
    setCharCount(template.content.length);
    setSelectedTemplate(template);
    setIsTemplateDialogOpen(false);
    toast.success(`Modèle "${template.name}" appliqué`);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Extract variables from content ({{variable}})
    const variableMatches = templateForm.content.match(/\{\{(\w+)\}\}/g);
    const variables = variableMatches 
      ? variableMatches.map(v => v.replace(/\{\{|\}\}/g, ''))
      : [];

    if (selectedTemplate) {
      // Edit existing
      setTemplates(templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, name: templateForm.name, content: templateForm.content, category: templateForm.category, variables }
          : t
      ));
      toast.success("Modèle mis à jour");
    } else {
      // Create new
      const newTemplate: SMSTemplate = {
        id: `template_${Date.now()}`,
        name: templateForm.name,
        content: templateForm.content,
        category: templateForm.category,
        variables,
        usageCount: 0,
      };
      setTemplates([...templates, newTemplate]);
      toast.success("Modèle créé");
    }
    
    setIsEditTemplateOpen(false);
    setTemplateForm({ name: '', content: '', category: 'Général' });
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;
    setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
    setIsDeleteTemplateOpen(false);
    setSelectedTemplate(null);
    toast.success("Modèle supprimé");
  };

  const openEditTemplate = (template?: SMSTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setTemplateForm({
        name: template.name,
        content: template.content,
        category: template.category,
      });
    } else {
      setSelectedTemplate(null);
      setTemplateForm({ name: '', content: '', category: 'Général' });
    }
    setIsEditTemplateOpen(true);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Historique des Envois SMS", 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    const headers = ['Date', 'Destinataires', 'Nombre', 'Opérateur', 'Statut', 'Coût'];
    const rows = historiqueEnvois.map(e => [
      e.date,
      e.destinataires,
      e.nombre.toString(),
      e.operateur,
      e.statut,
      `${e.cout.toLocaleString()} F`
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`historique-sms_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Export PDF réussi");
  };

  const filteredHistorique = historiqueEnvois.filter(e =>
    e.destinataires.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEnvoyes = statistiquesOperateurs.reduce((sum, op) => sum + op.envoyes, 0);
  const totalCout = statistiquesOperateurs.reduce((sum, op) => sum + op.cout, 0);
  const tauxReussiteMoyen = (statistiquesOperateurs.reduce((sum, op) => sum + op.taux_reussite, 0) / statistiquesOperateurs.length).toFixed(1);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Messagerie SMS Professionnelle</h1>
          <p className="text-muted-foreground mt-2">Envoi de SMS groupés via MTN, Orange, Moov, TrésorPay</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Modèles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Modèles SMS</DialogTitle>
                <DialogDescription>Sélectionnez un modèle ou créez-en un nouveau</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end mb-4">
                <Button size="sm" onClick={() => openEditTemplate()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Modèle
                </Button>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{template.name}</h3>
                              <Badge variant="outline">{template.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{template.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Utilisé {template.usageCount} fois</span>
                              {template.variables.length > 0 && (
                                <span>Variables: {template.variables.join(", ")}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openEditTemplate(template)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setIsDeleteTemplateOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleUseTemplate(template)}>
                              Utiliser
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Send className="mr-2 h-5 w-5" />
                Envoyer SMS
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvel Envoi SMS</DialogTitle>
                <DialogDescription>
                  {selectedTemplate ? `Modèle: ${selectedTemplate.name}` : "Composer et envoyer un SMS groupé"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Groupe Destinataires *</Label>
                    <Select value={selectedGroupe} onValueChange={setSelectedGroupe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les parents (465)</SelectItem>
                        <SelectItem value="6eme">Parents 6ème (75)</SelectItem>
                        <SelectItem value="5eme">Parents 5ème (80)</SelectItem>
                        <SelectItem value="4eme">Parents 4ème (78)</SelectItem>
                        <SelectItem value="3eme">Parents 3ème (82)</SelectItem>
                        <SelectItem value="impayes">Parents impayés (65)</SelectItem>
                        <SelectItem value="enseignants">Enseignants (32)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Opérateur</Label>
                    <Select value={selectedOperateur} onValueChange={setSelectedOperateur}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mtn">MTN (98% réussite)</SelectItem>
                        <SelectItem value="orange">Orange (97% réussite)</SelectItem>
                        <SelectItem value="moov">Moov (96% réussite)</SelectItem>
                        <SelectItem value="tresorpay">TrésorPay (99% réussite)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Message *</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsTemplateDialogOpen(true)}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Utiliser un modèle
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Tapez votre message ici..."
                    className="min-h-[150px]"
                    value={message}
                    onChange={handleMessageChange}
                    maxLength={160}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{charCount}/160 caractères</span>
                    <span>{Math.ceil(charCount / 160) || 1} SMS</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="programmee" 
                      checked={isScheduled}
                      onCheckedChange={(checked) => setIsScheduled(checked as boolean)}
                    />
                    <label htmlFor="programmee" className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Programmer l'envoi
                    </label>
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date" 
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Heure</Label>
                        <Input 
                          type="time" 
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {selectedGroupe && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Coût estimé:</span>
                      <span className="text-lg font-bold">
                        {(
                          (selectedGroupe === "tous" ? 465 : 
                           selectedGroupe === "impayes" ? 65 : 
                           selectedGroupe === "enseignants" ? 32 : 75) * 100
                        ).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetSMSForm(); }}>
                  Annuler
                </Button>
                <Button onClick={handleEnvoiSMS} disabled={!selectedGroupe || !message}>
                  {isScheduled ? (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Programmer
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Envoyés</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnvoyes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCout.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Réussite</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxReussiteMoyen}%</div>
            <p className="text-xs text-muted-foreground">Moyenne opérateurs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programmés</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {historiqueEnvois.filter(e => e.scheduled).length}
            </div>
            <p className="text-xs text-muted-foreground">SMS en attente</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="historique" className="space-y-4">
        <TabsList>
          <TabsTrigger value="historique">Historique d'Envois</TabsTrigger>
          <TabsTrigger value="modeles">Modèles SMS</TabsTrigger>
          <TabsTrigger value="operateurs">Statistiques Opérateurs</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Derniers Envois SMS</CardTitle>
                  <CardDescription>Historique des messages envoyés</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={handleExportPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Coût</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistorique.map((envoi) => (
                    <TableRow key={envoi.id}>
                      <TableCell className="text-sm">{envoi.date}</TableCell>
                      <TableCell className="font-medium">{envoi.destinataires}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{envoi.nombre}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{envoi.message}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{envoi.operateur}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          envoi.statut === "Envoyé" ? "default" : 
                          envoi.statut === "Programmé" ? "secondary" : 
                          "destructive"
                        }>
                          {envoi.statut === "Envoyé" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {envoi.statut === "Programmé" && <Clock className="mr-1 h-3 w-3" />}
                          {envoi.statut === "Échec partiel" && <XCircle className="mr-1 h-3 w-3" />}
                          {envoi.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{envoi.cout.toLocaleString()} F</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modeles" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Modèles de Messages SMS</h2>
            <Button onClick={() => openEditTemplate()}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Modèle
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge>{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{template.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span>Utilisé {template.usageCount} fois</span>
                      {template.variables.length > 0 && (
                        <span className="ml-2">• Variables: {template.variables.join(", ")}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditTemplate(template)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Modifier
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsDeleteTemplateOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operateurs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Opérateur</CardTitle>
                <CardDescription>Nombre de SMS et coûts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistiquesOperateurs.map((op) => (
                    <div key={op.operateur} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{op.operateur}</span>
                        <Badge variant="outline">{op.taux_reussite}% réussite</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Envoyés:</span>
                          <span className="ml-2 font-medium">{op.envoyes.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Coût:</span>
                          <span className="ml-2 font-medium">{op.cout.toLocaleString()} F</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Opérateur</CardTitle>
                <CardDescription>Volume d'envois</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistiquesOperateurs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="operateur" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="envoyes" fill="hsl(var(--primary))" name="SMS Envoyés" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
              <CardDescription>Volume et coûts des envois</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionMensuelle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="envoyes" fill="hsl(var(--primary))" name="SMS Envoyés" />
                  <Bar yAxisId="right" dataKey="cout" fill="hsl(var(--chart-2))" name="Coût (FCFA)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Edition Modèle */}
      <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? "Modifier le Modèle" : "Nouveau Modèle SMS"}
            </DialogTitle>
            <DialogDescription>
              Utilisez {"{{variable}}"} pour insérer des variables dynamiques
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du modèle *</Label>
              <Input
                placeholder="Ex: Rappel de paiement"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select 
                value={templateForm.category} 
                onValueChange={(value) => setTemplateForm({ ...templateForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Général">Général</SelectItem>
                  <SelectItem value="Absences">Absences</SelectItem>
                  <SelectItem value="Réunions">Réunions</SelectItem>
                  <SelectItem value="Paiements">Paiements</SelectItem>
                  <SelectItem value="Examens">Examens</SelectItem>
                  <SelectItem value="Événements">Événements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contenu du message *</Label>
              <Textarea
                placeholder="Ex: Bonjour, rappel de paiement de {{montant}} FCFA pour {{motif}}."
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {templateForm.content.length}/160 caractères
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveTemplate}>
              {selectedTemplate ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression Modèle */}
      <AlertDialog open={isDeleteTemplateOpen} onOpenChange={setIsDeleteTemplateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le modèle ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le modèle "{selectedTemplate?.name}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SMSPro;
