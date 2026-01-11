import React, { useState } from 'react';
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
  Edit
} from 'lucide-react';
import { 
  ReunionReport, 
  SchoolInfo, 
  downloadReunionPDF, 
  downloadEmptyTemplate,
  generateReunionPDF 
} from '@/components/reunions/ReunionPDFGenerator';

const CompteRenduGenerator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const schoolInfo: SchoolInfo = {
    nom: 'Lycée Excellence',
    adresse: '123 Avenue de l\'Éducation, Abidjan',
    telephone: '+225 27 20 00 00 00',
    email: 'contact@lycee-excellence.ci',
    anneeScolaire: '2024-2025'
  };

  const [currentReport, setCurrentReport] = useState<ReunionReport>({
    id: '1',
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
  });

  const [newParticipant, setNewParticipant] = useState({ nom: '', fonction: '', present: true });
  const [newDiscussion, setNewDiscussion] = useState({ sujet: '', intervenant: '', contenu: '' });
  const [newDecision, setNewDecision] = useState({ description: '', responsable: '', echeance: '' });

  const savedReports: ReunionReport[] = [
    {
      id: '1',
      titre: 'Conseil de Classe 3ème A - T1',
      type: 'conseil_classe',
      date: '2024-01-15',
      heureDebut: '16:00',
      heureFin: '18:00',
      lieu: 'Salle des professeurs',
      president: 'M. Koné',
      secretaire: 'Mme Diallo',
      participants: [
        { nom: 'M. Koné', fonction: 'Proviseur', present: true },
        { nom: 'Mme Diallo', fonction: 'Professeur principal', present: true },
        { nom: 'M. Touré', fonction: 'Délégué parents', present: true },
      ],
      ordreJour: ['Bilan du trimestre', 'Cas particuliers', 'Orientation'],
      discussions: [
        { sujet: 'Résultats généraux', intervenant: 'Mme Diallo', contenu: 'La classe a obtenu une moyenne de 12.5/20 ce trimestre.' }
      ],
      decisions: [
        { numero: 1, description: 'Mise en place de cours de soutien en mathématiques', responsable: 'M. Konan', echeance: '2024-02-01' }
      ],
    },
    {
      id: '2',
      titre: 'Réunion Parents-Professeurs Terminale',
      type: 'reunion_parents',
      date: '2024-01-20',
      heureDebut: '08:00',
      heureFin: '12:00',
      lieu: 'Hall principal',
      president: 'M. le Proviseur',
      secretaire: 'Mme Kouassi',
      participants: [],
      ordreJour: ['Accueil', 'Rendez-vous individuels'],
      discussions: [],
      decisions: [],
    },
  ];

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

  const handleGeneratePDF = () => {
    if (!currentReport.titre) {
      toast.error('Veuillez renseigner le titre de la réunion');
      return;
    }
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
      case 'conseil_classe': return 'bg-blue-100 text-blue-800';
      case 'reunion_parents': return 'bg-green-100 text-green-800';
      case 'reunion_pedagogique': return 'bg-purple-100 text-purple-800';
      case 'reunion_administrative': return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Comptes-Rendus de Réunions</h1>
          <p className="text-muted-foreground">Générez et gérez les comptes-rendus au format PDF</p>
        </div>
        <div className="flex gap-2">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau CR
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Historique
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
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Informations générales
                  </CardTitle>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={handleGeneratePDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Générer PDF
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handlePreviewPDF}>
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer
                  </Button>
                </CardContent>
              </Card>

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
              <CardTitle>Comptes-rendus sauvegardés</CardTitle>
              <CardDescription>Retrouvez tous les comptes-rendus générés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map(report => (
                  <Card key={report.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{report.titre}</h3>
                            <Badge className={getTypeBadgeColor(report.type)}>
                              {getTypeLabel(report.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.date).toLocaleDateString('fr-FR', { 
                              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                            })} | {report.heureDebut} - {report.heureFin}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Lieu: {report.lieu} | Président: {report.president}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => downloadReunionPDF(report, schoolInfo)}>
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Modèles */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDownloadTemplate('conseil_classe')}>
              <CardContent className="p-6 text-center">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 text-blue-600" />
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
                <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
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
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-purple-600" />
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
                <FileText className="w-12 h-12 mx-auto mb-4 text-orange-600" />
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
    </div>
  );
};

export default CompteRenduGenerator;
