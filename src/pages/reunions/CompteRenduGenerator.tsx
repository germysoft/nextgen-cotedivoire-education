import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Eye, 
  Calendar,
  Users,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  FileDown,
  Printer,
  History,
  Edit,
  Mail,
  Save,
  Upload,
  Copy,
  Send,
  Database,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Archive,
  FileSignature
} from 'lucide-react';
import { 
  ReunionReport, 
  SchoolInfo, 
  downloadReunionPDF, 
  downloadEmptyTemplate,
  generateReunionPDF,
  ElectronicSignature
} from '@/components/reunions/ReunionPDFGenerator';
import { useReportStorage, StoredReport } from '@/hooks/useReportStorage';
import { generateEmailSubject, generateEmailBody, openMailtoLink, copyEmailContent } from '@/utils/emailUtils';
import { SignatureManager, SignatureRequirement } from '@/components/reunions/SignatureManager';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CompteRenduGenerator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [emailRecipients, setEmailRecipients] = useState<string>('');
  
  const {
    reports,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
    getReport,
    finalizeReport,
    recordEmailSent,
    exportReports,
    importReports,
    getStatistics,
  } = useReportStorage();

  const schoolInfo: SchoolInfo = {
    nom: 'Lycée Excellence',
    adresse: '123 Avenue de l\'Éducation, Abidjan',
    telephone: '+225 27 20 00 00 00',
    email: 'contact@lycee-excellence.ci',
    anneeScolaire: '2024-2025'
  };

  const emptyReport: ReunionReport = {
    id: '',
    titre: '',
    type: 'reunion_parents',
    date: new Date().toISOString().split('T')[0],
    heureDebut: '14:00',
    heureFin: '16:00',
    lieu: '',
    president: '',
    secretaire: '',
    participants: [],
    ordreJour: [''],
    discussions: [],
    decisions: [],
    pointsDivers: [],
    electronicSignatures: [],
  };

  const getSignatureRequirements = (): SignatureRequirement[] => {
    const requirements: SignatureRequirement[] = [];
    
    if (currentReport.president) {
      requirements.push({
        role: 'president',
        name: currentReport.president,
        required: true,
      });
    }
    
    if (currentReport.secretaire) {
      requirements.push({
        role: 'secretaire',
        name: currentReport.secretaire,
        required: true,
      });
    }
    
    // Add participants who are present as optional signers
    currentReport.participants
      .filter(p => p.present)
      .slice(0, 5) // Limit to 5 participant signatures
      .forEach(p => {
        requirements.push({
          role: 'participant',
          name: p.nom,
          required: false,
        });
      });
    
    return requirements;
  };

  const handleAddSignature = (signatureData: Omit<ElectronicSignature, 'id' | 'signedAt' | 'verified'>) => {
    const newSignature: ElectronicSignature = {
      id: `sig-${Date.now()}`,
      ...signatureData,
      signedAt: new Date().toISOString(),
      verified: true,
    };
    
    setCurrentReport(prev => ({
      ...prev,
      electronicSignatures: [...(prev.electronicSignatures || []), newSignature],
    }));
  };

  const handleRemoveSignature = (id: string) => {
    setCurrentReport(prev => ({
      ...prev,
      electronicSignatures: (prev.electronicSignatures || []).filter(s => s.id !== id),
    }));
  };

  const [currentReport, setCurrentReport] = useState<ReunionReport>(emptyReport);
  const [newParticipant, setNewParticipant] = useState({ nom: '', fonction: '', present: true });
  const [newDiscussion, setNewDiscussion] = useState({ sujet: '', intervenant: '', contenu: '' });
  const [newDecision, setNewDecision] = useState({ description: '', responsable: '', echeance: '' });

  const stats = getStatistics();

  const handleAddParticipant = () => {
    if (newParticipant.nom && newParticipant.fonction) {
      setCurrentReport({
        ...currentReport,
        participants: [...currentReport.participants, { ...newParticipant }]
      });
      setNewParticipant({ nom: '', fonction: '', present: true });
      toast.success('Participant ajouté');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setCurrentReport({
      ...currentReport,
      participants: currentReport.participants.filter((_, i) => i !== index)
    });
  };

  const handleAddOrdreJour = () => {
    setCurrentReport({
      ...currentReport,
      ordreJour: [...currentReport.ordreJour, '']
    });
  };

  const handleUpdateOrdreJour = (index: number, value: string) => {
    const updated = [...currentReport.ordreJour];
    updated[index] = value;
    setCurrentReport({ ...currentReport, ordreJour: updated });
  };

  const handleAddDiscussion = () => {
    if (newDiscussion.sujet && newDiscussion.contenu) {
      setCurrentReport({
        ...currentReport,
        discussions: [...currentReport.discussions, { ...newDiscussion }]
      });
      setNewDiscussion({ sujet: '', intervenant: '', contenu: '' });
      toast.success('Discussion ajoutée');
    }
  };

  const handleAddDecision = () => {
    if (newDecision.description && newDecision.responsable) {
      setCurrentReport({
        ...currentReport,
        decisions: [...currentReport.decisions, {
          numero: currentReport.decisions.length + 1,
          ...newDecision
        }]
      });
      setNewDecision({ description: '', responsable: '', echeance: '' });
      toast.success('Décision ajoutée');
    }
  };

  const handleSaveReport = () => {
    if (!currentReport.titre) {
      toast.error('Veuillez renseigner le titre de la réunion');
      return;
    }

    try {
      if (editingReportId) {
        updateReport(editingReportId, currentReport);
        toast.success('Compte-rendu mis à jour !');
      } else {
        const saved = createReport(currentReport);
        setEditingReportId(saved.id);
        toast.success('Compte-rendu sauvegardé !');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleGeneratePDF = () => {
    if (!currentReport.titre) {
      toast.error('Veuillez renseigner le titre de la réunion');
      return;
    }
    
    // Save before generating PDF
    handleSaveReport();
    
    downloadReunionPDF(currentReport, schoolInfo);
    toast.success('PDF généré avec succès !');
  };

  const handleDownloadTemplate = (type: ReunionReport['type']) => {
    downloadEmptyTemplate(type, schoolInfo);
    toast.success('Modèle vide téléchargé');
  };

  const handlePreviewPDF = () => {
    const doc = generateReunionPDF(currentReport, schoolInfo);
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  const handleSendEmail = () => {
    if (!emailRecipients.trim()) {
      toast.error('Veuillez entrer au moins une adresse email');
      return;
    }

    const subject = generateEmailSubject(currentReport);
    const body = generateEmailBody(currentReport, schoolInfo);
    
    const recipients = emailRecipients.split(',').map(email => ({
      email: email.trim(),
      name: email.trim(),
    }));

    openMailtoLink(recipients, subject, body);
    
    // Record email sent if report is saved
    if (editingReportId) {
      recordEmailSent(editingReportId, recipients.map(r => r.email));
    }
    
    setIsEmailDialogOpen(false);
    toast.success('Client email ouvert avec le compte-rendu');
  };

  const handleCopyEmailContent = async () => {
    const subject = generateEmailSubject(currentReport);
    const body = generateEmailBody(currentReport, schoolInfo);
    
    const success = await copyEmailContent(subject, body);
    if (success) {
      toast.success('Contenu copié dans le presse-papier');
    } else {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleExportAllReports = () => {
    const data = exportReports();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comptes-rendus-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export téléchargé');
  };

  const handleImportReports = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const count = importReports(data);
        toast.success(`${count} compte(s)-rendu(s) importé(s)`);
      } catch (error) {
        toast.error('Erreur lors de l\'import');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleEditReport = (report: StoredReport) => {
    setCurrentReport(report);
    setEditingReportId(report.id);
    setActiveTab('create');
    toast.info('Compte-rendu chargé pour modification');
  };

  const handleDeleteReport = (id: string) => {
    deleteReport(id);
    setDeleteConfirmId(null);
    toast.success('Compte-rendu supprimé');
  };

  const handleNewReport = () => {
    setCurrentReport(emptyReport);
    setEditingReportId(null);
    toast.info('Nouveau compte-rendu');
  };

  const handleFinalizeReport = (id: string) => {
    finalizeReport(id);
    toast.success('Compte-rendu finalisé');
  };

  const getTypeLabel = (type: ReunionReport['type']) => {
    switch (type) {
      case 'conseil_classe': return 'Conseil de Classe';
      case 'reunion_parents': return 'Réunion Parents';
      case 'reunion_pedagogique': return 'Réunion Pédagogique';
      case 'reunion_administrative': return 'Réunion Administrative';
    }
  };

  const getTypeBadgeColor = (type: ReunionReport['type']) => {
    switch (type) {
      case 'conseil_classe': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'reunion_parents': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'reunion_pedagogique': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'reunion_administrative': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    }
  };

  const getStatusBadge = (status: StoredReport['status']) => {
    switch (status) {
      case 'draft': 
        return <Badge variant="outline" className="text-muted-foreground">Brouillon</Badge>;
      case 'finalized': 
        return <Badge className="bg-blue-500">Finalisé</Badge>;
      case 'sent': 
        return <Badge className="bg-green-500">Envoyé</Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lieu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Comptes-Rendus de Réunions</h1>
          <p className="text-muted-foreground">Générez, sauvegardez et envoyez les comptes-rendus par email</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Import/Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestion des données</DialogTitle>
                <DialogDescription>Exportez ou importez vos comptes-rendus</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exporter
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez tous vos comptes-rendus au format JSON
                  </p>
                  <Button onClick={handleExportAllReports} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter {reports.length} compte(s)-rendu(s)
                  </Button>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Importer
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Importez des comptes-rendus depuis un fichier JSON
                  </p>
                  <label className="w-full">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Sélectionner un fichier
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportReports}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileDown className="w-4 h-4 mr-2" />
                Modèles vides
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Télécharger un modèle vide</DialogTitle>
                <DialogDescription>Choisissez le type de réunion pour télécharger un modèle PDF à remplir manuellement</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button variant="outline" className="h-24 flex-col" onClick={() => handleDownloadTemplate('conseil_classe')}>
                  <ClipboardList className="w-8 h-8 mb-2" />
                  Conseil de Classe
                </Button>
                <Button variant="outline" className="h-24 flex-col" onClick={() => handleDownloadTemplate('reunion_parents')}>
                  <Users className="w-8 h-8 mb-2" />
                  Réunion Parents
                </Button>
                <Button variant="outline" className="h-24 flex-col" onClick={() => handleDownloadTemplate('reunion_pedagogique')}>
                  <MessageSquare className="w-8 h-8 mb-2" />
                  Réunion Pédagogique
                </Button>
                <Button variant="outline" className="h-24 flex-col" onClick={() => handleDownloadTemplate('reunion_administrative')}>
                  <FileText className="w-8 h-8 mb-2" />
                  Réunion Administrative
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Edit className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.drafts}</p>
                <p className="text-sm text-muted-foreground">Brouillons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.finalized}</p>
                <p className="text-sm text-muted-foreground">Finalisés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-muted-foreground">Envoyés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">
            <Plus className="w-4 h-4 mr-2" />
            {editingReportId ? 'Modifier' : 'Nouveau'} CR
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Historique ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="w-4 h-4 mr-2" />
            Modèles
          </TabsTrigger>
        </TabsList>

        {/* Onglet Création */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Formulaire principal */}
            <div className="md:col-span-2 space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Informations générales
                    </CardTitle>
                    {editingReportId && (
                      <Button variant="outline" size="sm" onClick={handleNewReport}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Titre de la réunion *</Label>
                      <Input 
                        placeholder="Ex: Conseil de classe 3ème A - 1er trimestre"
                        value={currentReport.titre}
                        onChange={(e) => setCurrentReport({ ...currentReport, titre: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Type de réunion</Label>
                      <Select 
                        value={currentReport.type} 
                        onValueChange={(v) => setCurrentReport({ ...currentReport, type: v as ReunionReport['type'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conseil_classe">Conseil de Classe</SelectItem>
                          <SelectItem value="reunion_parents">Réunion Parents-Professeurs</SelectItem>
                          <SelectItem value="reunion_pedagogique">Réunion Pédagogique</SelectItem>
                          <SelectItem value="reunion_administrative">Réunion Administrative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input 
                        type="date" 
                        value={currentReport.date}
                        onChange={(e) => setCurrentReport({ ...currentReport, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Heure début</Label>
                      <Input 
                        type="time" 
                        value={currentReport.heureDebut}
                        onChange={(e) => setCurrentReport({ ...currentReport, heureDebut: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Heure fin</Label>
                      <Input 
                        type="time" 
                        value={currentReport.heureFin}
                        onChange={(e) => setCurrentReport({ ...currentReport, heureFin: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Lieu</Label>
                      <Input 
                        placeholder="Salle de réunion, salle des professeurs..."
                        value={currentReport.lieu}
                        onChange={(e) => setCurrentReport({ ...currentReport, lieu: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Président de séance</Label>
                      <Input 
                        placeholder="Nom du président"
                        value={currentReport.president}
                        onChange={(e) => setCurrentReport({ ...currentReport, president: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Secrétaire</Label>
                      <Input 
                        placeholder="Nom du secrétaire"
                        value={currentReport.secretaire}
                        onChange={(e) => setCurrentReport({ ...currentReport, secretaire: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Participants ({currentReport.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-2">
                    <Input 
                      placeholder="Nom"
                      value={newParticipant.nom}
                      onChange={(e) => setNewParticipant({ ...newParticipant, nom: e.target.value })}
                    />
                    <Input 
                      placeholder="Fonction"
                      value={newParticipant.fonction}
                      onChange={(e) => setNewParticipant({ ...newParticipant, fonction: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={newParticipant.present}
                        onCheckedChange={(checked) => setNewParticipant({ ...newParticipant, present: checked as boolean })}
                      />
                      <Label>Présent</Label>
                    </div>
                    <Button onClick={handleAddParticipant}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  
                  {currentReport.participants.length > 0 && (
                    <div className="border rounded-lg divide-y">
                      {currentReport.participants.map((p, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{p.nom}</span>
                            <span className="text-muted-foreground">{p.fonction}</span>
                            <Badge variant={p.present ? "default" : "secondary"}>
                              {p.present ? 'Présent' : 'Absent'}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveParticipant(index)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ordre du jour */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Ordre du jour
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentReport.ordreJour.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-muted-foreground w-6">{index + 1}.</span>
                      <Input 
                        placeholder="Point de l'ordre du jour"
                        value={point}
                        onChange={(e) => handleUpdateOrdreJour(index, e.target.value)}
                      />
                      {currentReport.ordreJour.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setCurrentReport({
                            ...currentReport,
                            ordreJour: currentReport.ordreJour.filter((_, i) => i !== index)
                          })}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddOrdreJour}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un point
                  </Button>
                </CardContent>
              </Card>

              {/* Discussions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Discussions ({currentReport.discussions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="grid md:grid-cols-2 gap-2">
                      <Input 
                        placeholder="Sujet"
                        value={newDiscussion.sujet}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, sujet: e.target.value })}
                      />
                      <Input 
                        placeholder="Intervenant"
                        value={newDiscussion.intervenant}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, intervenant: e.target.value })}
                      />
                    </div>
                    <Textarea 
                      placeholder="Contenu de la discussion..."
                      value={newDiscussion.contenu}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, contenu: e.target.value })}
                    />
                    <Button onClick={handleAddDiscussion}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter la discussion
                    </Button>
                  </div>

                  {currentReport.discussions.length > 0 && (
                    <div className="space-y-3">
                      {currentReport.discussions.map((disc, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{disc.sujet}</h4>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setCurrentReport({
                                ...currentReport,
                                discussions: currentReport.discussions.filter((_, i) => i !== index)
                              })}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Intervenant: {disc.intervenant}</p>
                          <p className="text-sm">{disc.contenu}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Décisions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Décisions ({currentReport.decisions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-2">
                    <Input 
                      placeholder="Description de la décision"
                      className="md:col-span-3"
                      value={newDecision.description}
                      onChange={(e) => setNewDecision({ ...newDecision, description: e.target.value })}
                    />
                    <Input 
                      placeholder="Responsable"
                      value={newDecision.responsable}
                      onChange={(e) => setNewDecision({ ...newDecision, responsable: e.target.value })}
                    />
                    <Input 
                      type="date"
                      value={newDecision.echeance}
                      onChange={(e) => setNewDecision({ ...newDecision, echeance: e.target.value })}
                    />
                    <Button onClick={handleAddDecision}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>

                  {currentReport.decisions.length > 0 && (
                    <div className="border rounded-lg divide-y">
                      {currentReport.decisions.map((dec, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">D{dec.numero}</Badge>
                              <span className="font-medium">{dec.description}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Responsable: {dec.responsable} | Échéance: {dec.echeance}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setCurrentReport({
                              ...currentReport,
                              decisions: currentReport.decisions.filter((_, i) => i !== index)
                            })}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Panel latéral */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="font-medium">{currentReport.participants.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points ODJ</span>
                    <span className="font-medium">{currentReport.ordreJour.filter(p => p).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discussions</span>
                    <span className="font-medium">{currentReport.discussions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Décisions</span>
                    <span className="font-medium">{currentReport.decisions.length}</span>
                  </div>
                  {editingReportId && (
                    <div className="pt-2 border-t">
                      <Badge variant="outline" className="w-full justify-center">
                        <Save className="w-3 h-3 mr-1" />
                        Sauvegardé
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={handleSaveReport}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button className="w-full" variant="default" onClick={handleGeneratePDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Générer PDF
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handlePreviewPDF}>
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                  <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer par email
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Envoyer le compte-rendu</DialogTitle>
                        <DialogDescription>
                          Envoyez le résumé du compte-rendu par email aux participants
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Destinataires (séparés par des virgules)</Label>
                          <Textarea
                            placeholder="email1@exemple.com, email2@exemple.com"
                            value={emailRecipients}
                            onChange={(e) => setEmailRecipients(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Aperçu de l'objet :</p>
                          <p className="text-sm text-muted-foreground">
                            {currentReport.titre ? generateEmailSubject(currentReport) : '(Titre requis)'}
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={handleCopyEmailContent}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copier le contenu
                        </Button>
                        <Button onClick={handleSendEmail}>
                          <Send className="w-4 h-4 mr-2" />
                          Ouvrir client email
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer
                  </Button>
                </CardContent>
              </Card>

              {/* Signature électronique */}
              {(currentReport.president || currentReport.secretaire) && (
                <SignatureManager
                  signatures={currentReport.electronicSignatures || []}
                  requirements={getSignatureRequirements()}
                  onAddSignature={handleAddSignature}
                  onRemoveSignature={handleRemoveSignature}
                />
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Établissement</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="font-medium">{schoolInfo.nom}</p>
                  <p className="text-muted-foreground">{schoolInfo.adresse}</p>
                  <p className="text-muted-foreground">{schoolInfo.telephone}</p>
                  <p className="text-muted-foreground">{schoolInfo.anneeScolaire}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Comptes-rendus sauvegardés</CardTitle>
                  <CardDescription>Historique complet avec versioning</CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="conseil_classe">Conseil de Classe</SelectItem>
                      <SelectItem value="reunion_parents">Réunion Parents</SelectItem>
                      <SelectItem value="reunion_pedagogique">Réunion Pédagogique</SelectItem>
                      <SelectItem value="reunion_administrative">Réunion Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                      <SelectItem value="finalized">Finalisés</SelectItem>
                      <SelectItem value="sent">Envoyés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Chargement...</div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8">
                  <Archive className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Aucun compte-rendu trouvé</p>
                  <Button variant="link" onClick={() => setActiveTab('create')}>
                    Créer un nouveau compte-rendu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map(report => (
                    <Card key={report.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold truncate">{report.titre}</h3>
                              <Badge className={getTypeBadgeColor(report.type)}>
                                {getTypeLabel(report.type)}
                              </Badge>
                              {getStatusBadge(report.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(report.date).toLocaleDateString('fr-FR', { 
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                              })} | {report.heureDebut} - {report.heureFin}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Lieu: {report.lieu} | Président: {report.president}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                v{report.version}
                              </span>
                              <span>
                                Modifié le {new Date(report.updatedAt).toLocaleDateString('fr-FR')}
                              </span>
                              {report.emailsSent && report.emailsSent.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {report.emailsSent.length} envoi(s)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => downloadReunionPDF(report, schoolInfo)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditReport(report)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                                {report.status === 'draft' && (
                                  <DropdownMenuItem onClick={() => handleFinalizeReport(report.id)}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Finaliser
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => setDeleteConfirmId(report.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Modèles */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDownloadTemplate('conseil_classe')}>
              <CardContent className="p-6 text-center">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold mb-2">Conseil de Classe</h3>
                <p className="text-sm text-muted-foreground mb-4">Modèle adapté aux conseils de classe trimestriels</p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDownloadTemplate('reunion_parents')}>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold mb-2">Réunion Parents</h3>
                <p className="text-sm text-muted-foreground mb-4">Pour les réunions parents-professeurs</p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDownloadTemplate('reunion_pedagogique')}>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold mb-2">Réunion Pédagogique</h3>
                <p className="text-sm text-muted-foreground mb-4">Réunions de coordination pédagogique</p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDownloadTemplate('reunion_administrative')}>
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold mb-2">Réunion Administrative</h3>
                <p className="text-sm text-muted-foreground mb-4">Réunions de direction et administratives</p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce compte-rendu ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le compte-rendu sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && handleDeleteReport(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompteRenduGenerator;
