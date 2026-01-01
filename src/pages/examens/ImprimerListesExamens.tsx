import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Printer, FileText, FileSpreadsheet, Eye, Filter,
  GraduationCap, Users, UserCheck, Calendar, Mail,
  FileCheck, Award, ScrollText, Bell, Shield,
  History, Layers, X, Building, Clock
} from 'lucide-react';
import { useEtablissement } from '@/contexts/EtablissementContext';
import { useRole } from '@/contexts/RoleContext';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  timestamp: string;
  utilisateur: string;
  role: string;
  action: 'generation' | 'export_pdf' | 'export_excel' | 'impression';
  listeId: string;
  listeNom: string;
  categorie: string;
  filtres: Record<string, string>;
  nombreResultats: number;
}

const useAuditListesExamens = () => {
  const [entries, setEntries] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem('audit_listes_examens');
    return saved ? JSON.parse(saved) : [];
  });

  const logAction = (
    action: AuditEntry['action'],
    listeId: string,
    listeNom: string,
    categorie: string,
    filtres: Record<string, string>,
    nombreResultats: number
  ) => {
    const newEntry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      utilisateur: 'Utilisateur actuel',
      role: 'Administrateur',
      action,
      listeId,
      listeNom,
      categorie,
      filtres,
      nombreResultats
    };
    const updated = [newEntry, ...entries].slice(0, 500);
    setEntries(updated);
    localStorage.setItem('audit_listes_examens', JSON.stringify(updated));
  };

  const getStats = () => {
    const today = new Date().toDateString();
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    return {
      total: entries.length,
      aujourdhui: entries.filter(e => new Date(e.timestamp).toDateString() === today).length,
      cetteSemaine: entries.filter(e => new Date(e.timestamp) >= thisWeek).length,
      parAction: {
        generation: entries.filter(e => e.action === 'generation').length,
        export_pdf: entries.filter(e => e.action === 'export_pdf').length,
        export_excel: entries.filter(e => e.action === 'export_excel').length,
        impression: entries.filter(e => e.action === 'impression').length
      }
    };
  };

  return { entries, logAction, getStats };
};

const categories = [
  {
    id: 'sessions',
    nom: 'Examens & Sessions',
    icon: GraduationCap,
    listes: [
      { id: 'examens_type', nom: 'Liste des examens par type (interne, blanc, officiel)', roles: ['admin', 'direction'] },
      { id: 'sessions_annee', nom: 'Liste des sessions par année scolaire', roles: ['admin', 'direction'] },
      { id: 'examens_statut', nom: 'Liste des examens ouverts / clôturés', roles: ['admin', 'direction'] },
      { id: 'examens_niveau', nom: 'Liste des examens par niveau / série', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'candidats',
    nom: 'Candidats',
    icon: Users,
    listes: [
      { id: 'candidats_examen', nom: 'Liste des candidats par examen', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'candidats_centre', nom: 'Liste des candidats par centre', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'candidats_salle', nom: 'Liste des candidats par salle', roles: ['admin', 'direction', 'president_jury', 'surveillant'] },
      { id: 'candidats_statut', nom: 'Liste des candidats par statut (présent, absent)', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'candidats_eligibles', nom: 'Liste des candidats éligibles / non éligibles', roles: ['admin', 'direction'] },
      { id: 'candidats_anonymat', nom: 'Liste des candidats avec numéro anonymat', roles: ['admin'] }
    ]
  },
  {
    id: 'jurys',
    nom: 'Jurys & Examinateurs',
    icon: UserCheck,
    listes: [
      { id: 'jurys_centre', nom: 'Liste des jurys par centre', roles: ['admin', 'direction'] },
      { id: 'examinateurs_matiere', nom: 'Liste des examinateurs par matière', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'surveillants_salle', nom: 'Liste des surveillants par salle', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'affectations_jurys', nom: 'Liste des affectations jurys / salles', roles: ['admin', 'direction'] },
      { id: 'indemnites', nom: 'Liste des indemnités', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'salles',
    nom: 'Salles & Planning',
    icon: Building,
    listes: [
      { id: 'salles_examen', nom: 'Liste des salles d\'examen', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'planning_date', nom: 'Planning des épreuves par date', roles: ['admin', 'direction', 'president_jury', 'surveillant'] },
      { id: 'planning_salle', nom: 'Planning par salle', roles: ['admin', 'direction', 'president_jury', 'surveillant'] },
      { id: 'planning_jury', nom: 'Planning par jury', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'salles_capacite', nom: 'Liste des salles avec capacité / occupation', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'convocations',
    nom: 'Convocations',
    icon: Mail,
    listes: [
      { id: 'convocations_candidats', nom: 'Liste des convocations candidats', roles: ['admin', 'direction'] },
      { id: 'convocations_jurys', nom: 'Liste des convocations jurys', roles: ['admin', 'direction'] },
      { id: 'convocations_emises', nom: 'Liste des convocations émises / non émises', roles: ['admin', 'direction'] },
      { id: 'convocations_retirees', nom: 'Liste des convocations retirées / non retirées', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'pv',
    nom: 'Procès-Verbaux',
    icon: FileCheck,
    listes: [
      { id: 'pv_salle', nom: 'Liste des PV par salle', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'pv_epreuve', nom: 'Liste des PV par épreuve', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'pv_valides', nom: 'Liste des PV validés / non validés', roles: ['admin', 'direction'] },
      { id: 'incidents', nom: 'Liste des incidents consignés', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'resultats',
    nom: 'Notes, Délibérations & Résultats',
    icon: Award,
    listes: [
      { id: 'notes_candidat', nom: 'Liste des notes par candidat', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'notes_matiere', nom: 'Liste des notes par matière', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'notes_saisies', nom: 'Liste des notes saisies / non saisies', roles: ['admin', 'direction'] },
      { id: 'admis_ajournes', nom: 'Liste des admis / ajournés', roles: ['admin', 'direction', 'president_jury'] },
      { id: 'classement_candidats', nom: 'Classement des candidats', roles: ['admin', 'direction'] },
      { id: 'moyennes_finales', nom: 'Liste des moyennes finales', roles: ['admin', 'direction', 'president_jury'] }
    ]
  },
  {
    id: 'documents',
    nom: 'Documents Officiels',
    icon: ScrollText,
    listes: [
      { id: 'releves_examen', nom: 'Liste des relevés d\'examen', roles: ['admin', 'direction'] },
      { id: 'attestations', nom: 'Liste des attestations', roles: ['admin', 'direction'] },
      { id: 'diplomes', nom: 'Liste des diplômes générés', roles: ['admin', 'direction'] },
      { id: 'documents_imprimes', nom: 'Liste des documents imprimés / non imprimés', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'communication',
    nom: 'Communication & Suivi',
    icon: Bell,
    listes: [
      { id: 'notifications_envoyees', nom: 'Liste des notifications envoyées', roles: ['admin', 'direction'] },
      { id: 'sms_emails', nom: 'Liste des SMS / emails envoyés', roles: ['admin', 'direction'] },
      { id: 'alertes_generees', nom: 'Liste des alertes générées', roles: ['admin', 'direction'] },
      { id: 'historique_comm', nom: 'Historique des communications', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'audit',
    nom: 'Audit, Sécurité & DECO',
    icon: Shield,
    listes: [
      { id: 'actions_utilisateurs', nom: 'Liste des actions utilisateurs', roles: ['admin'] },
      { id: 'acces_impressions', nom: 'Liste des accès et impressions', roles: ['admin'] },
      { id: 'rapprochement_deco', nom: 'Rapprochement listes locales vs DECO', roles: ['admin', 'direction'] },
      { id: 'ecarts_detectes', nom: 'Liste des écarts détectés', roles: ['admin', 'direction'] },
      { id: 'rapports_audit', nom: 'Rapports d\'audit', roles: ['admin'] }
    ]
  }
];

const ImprimerListesExamens = () => {
  const { configuration } = useEtablissement();
  const { currentRole } = useRole();
  const { entries, logAction, getStats } = useAuditListesExamens();
  
  const [activeTab, setActiveTab] = useState('sessions');
  const [selectedListe, setSelectedListe] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  
  // Impression groupée
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchFormat, setBatchFormat] = useState<'pdf' | 'excel' | 'print'>('pdf');
  
  // Filtres
  const [filters, setFilters] = useState({
    anneeScolaire: '2024-2025',
    session: '',
    typeExamen: '',
    centre: '',
    salle: '',
    jury: '',
    matiere: '',
    statutCandidat: '',
    periode: ''
  });

  const userRole = currentRole || 'admin';
  
  const hasAccess = (roles: string[]) => {
    if (userRole === 'admin' || userRole === 'directeur') return true;
    return roles.includes(userRole);
  };

  const getAccessibleCategories = () => {
    return categories.filter(cat => 
      cat.listes.some(liste => hasAccess(liste.roles))
    );
  };

  const getAccessibleListes = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];
    return category.listes.filter(liste => hasAccess(liste.roles));
  };

  const handleGenerate = (listeId: string, listeNom: string) => {
    const category = categories.find(c => c.listes.some(l => l.id === listeId));
    logAction('generation', listeId, listeNom, category?.nom || '', filters, Math.floor(Math.random() * 100) + 10);
    setSelectedListe(listeId);
    setShowPreview(true);
    toast.success(`Liste "${listeNom}" générée avec succès`);
  };

  const handleExportPDF = () => {
    if (!selectedListe) return;
    const liste = categories.flatMap(c => c.listes).find(l => l.id === selectedListe);
    const category = categories.find(c => c.listes.some(l => l.id === selectedListe));
    if (liste && category) {
      logAction('export_pdf', selectedListe, liste.nom, category.nom, filters, Math.floor(Math.random() * 100) + 10);
    }
    toast.success('Export PDF effectué');
  };

  const handleExportExcel = () => {
    if (!selectedListe) return;
    const liste = categories.flatMap(c => c.listes).find(l => l.id === selectedListe);
    const category = categories.find(c => c.listes.some(l => l.id === selectedListe));
    if (liste && category) {
      logAction('export_excel', selectedListe, liste.nom, category.nom, filters, Math.floor(Math.random() * 100) + 10);
    }
    toast.success('Export Excel effectué');
  };

  const handlePrint = () => {
    if (!selectedListe) return;
    const liste = categories.flatMap(c => c.listes).find(l => l.id === selectedListe);
    const category = categories.find(c => c.listes.some(l => l.id === selectedListe));
    if (liste && category) {
      logAction('impression', selectedListe, liste.nom, category.nom, filters, Math.floor(Math.random() * 100) + 10);
    }
    window.print();
    toast.success('Impression lancée');
  };

  // Fonctions pour impression groupée
  const toggleListeSelection = (listeId: string) => {
    setSelectedListes(prev => 
      prev.includes(listeId) 
        ? prev.filter(id => id !== listeId)
        : [...prev, listeId]
    );
  };

  const selectAllInCategory = (categoryId: string) => {
    const listes = getAccessibleListes(categoryId);
    const allSelected = listes.every(l => selectedListes.includes(l.id));
    if (allSelected) {
      setSelectedListes(prev => prev.filter(id => !listes.map(l => l.id).includes(id)));
    } else {
      setSelectedListes(prev => [...new Set([...prev, ...listes.map(l => l.id)])]);
    }
  };

  const handleBatchProcess = async () => {
    if (selectedListes.length === 0) {
      toast.error('Veuillez sélectionner au moins une liste');
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress(0);

    for (let i = 0; i < selectedListes.length; i++) {
      const listeId = selectedListes[i];
      const liste = categories.flatMap(c => c.listes).find(l => l.id === listeId);
      const category = categories.find(c => c.listes.some(l => l.id === listeId));

      if (liste && category) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const action = batchFormat === 'pdf' ? 'export_pdf' : 
                       batchFormat === 'excel' ? 'export_excel' : 'impression';
        logAction(action, listeId, liste.nom, category.nom, filters, Math.floor(Math.random() * 100) + 10);
      }

      setBatchProgress(Math.round(((i + 1) / selectedListes.length) * 100));
    }

    setIsBatchProcessing(false);
    setShowBatchDialog(false);
    setSelectedListes([]);
    
    const formatLabel = batchFormat === 'pdf' ? 'PDF' : batchFormat === 'excel' ? 'Excel' : 'impression';
    toast.success(`${selectedListes.length} liste(s) exportée(s) en ${formatLabel}`);
  };

  const getSelectedListesInfo = () => {
    return selectedListes.map(id => {
      const liste = categories.flatMap(c => c.listes).find(l => l.id === id);
      const category = categories.find(c => c.listes.some(l => l.id === id));
      return { id, nom: liste?.nom || '', categorie: category?.nom || '' };
    });
  };

  const stats = getStats();
  const accessibleCategories = getAccessibleCategories();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Imprimer Listes - Examens</h1>
          <p className="text-muted-foreground mt-1">
            Génération et impression des listes d'examens officielles
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
            <DialogTrigger asChild>
              <Button variant="default" className="relative">
                <Layers className="h-4 w-4 mr-2" />
                Impression groupée
                {selectedListes.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-white text-primary">
                    {selectedListes.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Impression groupée - {selectedListes.length} liste(s) sélectionnée(s)
                </DialogTitle>
              </DialogHeader>
              
              {selectedListes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune liste sélectionnée</p>
                  <p className="text-sm mt-2">Cochez les listes à imprimer dans les catégories ci-dessous</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px] border rounded-lg p-4">
                    <div className="space-y-2">
                      {getSelectedListesInfo().map((liste) => (
                        <div key={liste.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium text-sm">{liste.nom}</p>
                            <p className="text-xs text-muted-foreground">{liste.categorie}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleListeSelection(liste.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Format d'export</label>
                      <div className="flex gap-2">
                        <Button 
                          variant={batchFormat === 'pdf' ? 'default' : 'outline'}
                          onClick={() => setBatchFormat('pdf')}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button 
                          variant={batchFormat === 'excel' ? 'default' : 'outline'}
                          onClick={() => setBatchFormat('excel')}
                          className="flex-1"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Excel
                        </Button>
                        <Button 
                          variant={batchFormat === 'print' ? 'default' : 'outline'}
                          onClick={() => setBatchFormat('print')}
                          className="flex-1"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimer
                        </Button>
                      </div>
                    </div>

                    {isBatchProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Traitement en cours...</span>
                          <span>{batchProgress}%</span>
                        </div>
                        <Progress value={batchProgress} />
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedListes([])}
                        disabled={isBatchProcessing}
                      >
                        Tout désélectionner
                      </Button>
                      <Button 
                        onClick={handleBatchProcess}
                        disabled={isBatchProcessing}
                      >
                        {isBatchProcessing ? 'Traitement...' : 'Lancer le traitement'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={showAudit} onOpenChange={setShowAudit}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Journal d'audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Journal d'audit - Listes Examens</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total actions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.aujourdhui}</div>
                    <div className="text-sm text-muted-foreground">Aujourd'hui</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.cetteSemaine}</div>
                    <div className="text-sm text-muted-foreground">Cette semaine</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.parAction.export_pdf}</div>
                    <div className="text-sm text-muted-foreground">Exports PDF</div>
                  </CardContent>
                </Card>
              </div>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Liste</TableHead>
                      <TableHead>Catégorie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.slice(0, 50).map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-sm">
                          {new Date(entry.timestamp).toLocaleString('fr-FR')}
                        </TableCell>
                        <TableCell>{entry.utilisateur}</TableCell>
                        <TableCell>
                          <Badge variant={
                            entry.action === 'generation' ? 'default' :
                            entry.action === 'export_pdf' ? 'secondary' :
                            entry.action === 'export_excel' ? 'outline' : 'destructive'
                          }>
                            {entry.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{entry.listeNom}</TableCell>
                        <TableCell>{entry.categorie}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Barre de sélection rapide */}
      {selectedListes.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedListes.length} liste(s) sélectionnée(s)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedListes([])}>
                Tout désélectionner
              </Button>
              <Button size="sm" onClick={() => setShowBatchDialog(true)}>
                Traiter la sélection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres dynamiques */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres dynamiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Année scolaire</label>
              <Select value={filters.anneeScolaire} onValueChange={(v) => setFilters({...filters, anneeScolaire: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Session</label>
              <Select value={filters.session} onValueChange={(v) => setFilters({...filters, session: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sessions</SelectItem>
                  <SelectItem value="juin">Session Juin</SelectItem>
                  <SelectItem value="septembre">Session Septembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Type d'examen</label>
              <Select value={filters.typeExamen} onValueChange={(v) => setFilters({...filters, typeExamen: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="bepc">BEPC</SelectItem>
                  <SelectItem value="bac">BAC</SelectItem>
                  <SelectItem value="blanc">Examen blanc</SelectItem>
                  <SelectItem value="interne">Examen interne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Centre</label>
              <Select value={filters.centre} onValueChange={(v) => setFilters({...filters, centre: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les centres</SelectItem>
                  <SelectItem value="centre1">Centre Principal</SelectItem>
                  <SelectItem value="centre2">Centre Annexe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Statut candidat</label>
              <Select value={filters.statutCandidat} onValueChange={(v) => setFilters({...filters, statutCandidat: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="present">Présent</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="eligible">Éligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégories et listes */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="flex w-max mb-4">
            {accessibleCategories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                <cat.icon className="h-4 w-4" />
                {cat.nom}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {accessibleCategories.map(cat => (
          <TabsContent key={cat.id} value={cat.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="flex items-center gap-2">
                  <cat.icon className="h-5 w-5" />
                  {cat.nom}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => selectAllInCategory(cat.id)}
                >
                  {getAccessibleListes(cat.id).every(l => selectedListes.includes(l.id)) 
                    ? 'Tout désélectionner' 
                    : 'Tout sélectionner'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {getAccessibleListes(cat.id).map(liste => (
                    <div 
                      key={liste.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                        selectedListes.includes(liste.id) ? 'bg-primary/5 border-primary/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedListes.includes(liste.id)}
                          onCheckedChange={() => toggleListeSelection(liste.id)}
                        />
                        <div>
                          <p className="font-medium">{liste.nom}</p>
                          <div className="flex gap-1 mt-1">
                            {liste.roles.map(role => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerate(liste.id, liste.nom)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Prévisualiser
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedListe(liste.id);
                            handleExportPDF();
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedListe(liste.id);
                            handleExportExcel();
                          }}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedListe(liste.id);
                            handlePrint();
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog de prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Prévisualisation - {categories.flatMap(c => c.listes).find(l => l.id === selectedListe)?.nom}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px]">
            {/* En-tête officiel */}
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div className="text-center flex-1">
                  <p className="text-sm text-muted-foreground">MINISTÈRE DE L'ÉDUCATION NATIONALE</p>
                  <h2 className="font-bold text-lg mt-2">{configuration.identite?.nom || 'ÉTABLISSEMENT SCOLAIRE'}</h2>
                  <p className="text-sm text-muted-foreground">Année scolaire : {filters.anneeScolaire}</p>
                  {filters.session && <p className="text-sm text-muted-foreground">Session : {filters.session}</p>}
                </div>
              </div>
              <h3 className="text-center font-bold mt-4 text-lg border-t border-b py-2">
                {categories.flatMap(c => c.listes).find(l => l.id === selectedListe)?.nom.toUpperCase()}
              </h3>
            </div>

            {/* Tableau de données exemple */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom & Prénom</TableHead>
                  <TableHead>Centre</TableHead>
                  <TableHead>Salle</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell>{i}</TableCell>
                    <TableCell>CAND-{2024000 + i}</TableCell>
                    <TableCell>Candidat {i} Exemple</TableCell>
                    <TableCell>Centre Principal</TableCell>
                    <TableCell>Salle {Math.ceil(i / 2)}</TableCell>
                    <TableCell>
                      <Badge variant={i % 2 === 0 ? 'default' : 'secondary'}>
                        {i % 2 === 0 ? 'Présent' : 'En attente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pied de page */}
            <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Document généré le : {new Date().toLocaleDateString('fr-FR')}</span>
                <span>Page 1 / 1</span>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImprimerListesExamens;
