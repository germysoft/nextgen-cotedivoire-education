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
  DollarSign, Wallet, BookOpen, Scale, CreditCard,
  Receipt, X, Layers, History, Clock
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

const useAuditListesComptabilite = () => {
  const [entries, setEntries] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem('audit_listes_comptabilite');
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
      role: 'Comptable',
      action,
      listeId,
      listeNom,
      categorie,
      filtres,
      nombreResultats
    };
    const updated = [newEntry, ...entries].slice(0, 500);
    setEntries(updated);
    localStorage.setItem('audit_listes_comptabilite', JSON.stringify(updated));
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
    id: 'recettes_depenses',
    nom: 'Recettes & Dépenses',
    icon: DollarSign,
    listes: [
      { id: 'recettes_periode', nom: 'Liste des recettes par période', roles: ['admin', 'comptable', 'direction'] },
      { id: 'depenses_periode', nom: 'Liste des dépenses par période', roles: ['admin', 'comptable', 'direction'] },
      { id: 'recettes_type', nom: 'Liste des recettes par type', roles: ['admin', 'comptable', 'direction'] },
      { id: 'depenses_nature', nom: 'Liste des dépenses par nature', roles: ['admin', 'comptable', 'direction'] },
      { id: 'operations_validees', nom: 'Liste des opérations validées / non validées', roles: ['admin', 'comptable'] }
    ]
  },
  {
    id: 'caisse',
    nom: 'Gestion de Caisse',
    icon: Wallet,
    listes: [
      { id: 'etat_caisse_jour', nom: 'État de caisse journalier', roles: ['admin', 'comptable', 'caissier', 'direction'] },
      { id: 'etat_caisse_mois', nom: 'État de caisse mensuel', roles: ['admin', 'comptable', 'direction'] },
      { id: 'mouvements_caisse', nom: 'Liste des mouvements de caisse', roles: ['admin', 'comptable', 'caissier'] },
      { id: 'ecarts_caisse', nom: 'Liste des écarts de caisse', roles: ['admin', 'comptable'] },
      { id: 'ouvertures_fermetures', nom: 'Historique des ouvertures / fermetures de caisse', roles: ['admin', 'comptable'] }
    ]
  },
  {
    id: 'journaux',
    nom: 'Journaux Comptables',
    icon: BookOpen,
    listes: [
      { id: 'journal_recettes', nom: 'Journal des recettes', roles: ['admin', 'comptable', 'direction'] },
      { id: 'journal_depenses', nom: 'Journal des dépenses', roles: ['admin', 'comptable', 'direction'] },
      { id: 'journal_caisse', nom: 'Journal de caisse', roles: ['admin', 'comptable', 'direction'] },
      { id: 'journal_compte', nom: 'Journal par compte', roles: ['admin', 'comptable'] },
      { id: 'journal_utilisateur', nom: 'Journal par utilisateur (caissier)', roles: ['admin', 'comptable'] }
    ]
  },
  {
    id: 'balance_bilan',
    nom: 'Balance & Bilan',
    icon: Scale,
    listes: [
      { id: 'balance_generale', nom: 'Balance générale', roles: ['admin', 'comptable', 'direction'] },
      { id: 'balance_compte', nom: 'Balance par compte', roles: ['admin', 'comptable'] },
      { id: 'bilan_simplifie', nom: 'Bilan simplifié', roles: ['admin', 'comptable', 'direction'] },
      { id: 'bilan_detaille', nom: 'Bilan détaillé', roles: ['admin', 'comptable', 'direction'] },
      { id: 'compte_resultat', nom: 'Compte de résultat', roles: ['admin', 'comptable', 'direction'] }
    ]
  },
  {
    id: 'paiements_scolaires',
    nom: 'Paiements Scolaires',
    icon: CreditCard,
    listes: [
      { id: 'paiements_eleve', nom: 'Liste des paiements par élève', roles: ['admin', 'comptable', 'caissier', 'direction'] },
      { id: 'paiements_classe', nom: 'Liste des paiements par classe', roles: ['admin', 'comptable', 'direction'] },
      { id: 'paiements_niveau', nom: 'Liste des paiements par niveau', roles: ['admin', 'comptable', 'direction'] },
      { id: 'eleves_jour_impayes', nom: 'Liste des élèves à jour / en impayés', roles: ['admin', 'comptable', 'direction'] },
      { id: 'paiements_mode', nom: 'Liste des paiements par mode (cash, mobile money, chèque)', roles: ['admin', 'comptable'] }
    ]
  },
  {
    id: 'quittances',
    nom: 'Quittances',
    icon: Receipt,
    listes: [
      { id: 'quittances_emises', nom: 'Liste des quittances émises', roles: ['admin', 'comptable', 'caissier'] },
      { id: 'quittances_annulees', nom: 'Liste des quittances annulées', roles: ['admin', 'comptable'] },
      { id: 'quittances_periode', nom: 'Liste des quittances par période', roles: ['admin', 'comptable', 'direction'] },
      { id: 'quittances_caissier', nom: 'Liste des quittances par caissier', roles: ['admin', 'comptable'] },
      { id: 'quittances_imprimees', nom: 'Liste des quittances imprimées / non imprimées', roles: ['admin', 'comptable'] }
    ]
  }
];

const ImprimerListesComptabilite = () => {
  const { configuration } = useEtablissement();
  const { currentRole } = useRole();
  const { entries, logAction, getStats } = useAuditListesComptabilite();
  
  const [activeTab, setActiveTab] = useState('recettes_depenses');
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
    periodeDebut: '',
    periodeFin: '',
    typeOperation: '',
    compteComptable: '',
    modePaiement: '',
    caissier: '',
    classe: '',
    eleve: ''
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
          <h1 className="text-3xl font-bold text-foreground">Imprimer Listes - Comptabilité</h1>
          <p className="text-muted-foreground mt-1">
            Génération et impression des listes comptables et financières
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

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Format d'export</label>
                      <Select value={batchFormat} onValueChange={(v: 'pdf' | 'excel' | 'print') => setBatchFormat(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">📄 PDF</SelectItem>
                          <SelectItem value="excel">📊 Excel</SelectItem>
                          <SelectItem value="print">🖨️ Impression directe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isBatchProcessing && (
                      <div className="space-y-2">
                        <Progress value={batchProgress} />
                        <p className="text-sm text-center text-muted-foreground">
                          Traitement en cours... {batchProgress}%
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowBatchDialog(false)} disabled={isBatchProcessing}>
                        Annuler
                      </Button>
                      <Button onClick={handleBatchProcess} disabled={isBatchProcessing}>
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
                <DialogTitle>Journal d'audit - Impressions Comptabilité</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Total actions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-green-600">{stats.aujourdhui}</div>
                    <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.cetteSemaine}</div>
                    <p className="text-xs text-muted-foreground">Cette semaine</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-orange-600">{stats.parAction.impression}</div>
                    <p className="text-xs text-muted-foreground">Impressions</p>
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
                    {entries.slice(0, 50).map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-sm">
                          {new Date(entry.timestamp).toLocaleString('fr-FR')}
                        </TableCell>
                        <TableCell>{entry.utilisateur}</TableCell>
                        <TableCell>
                          <Badge variant={
                            entry.action === 'impression' ? 'default' :
                            entry.action === 'export_pdf' ? 'secondary' :
                            entry.action === 'export_excel' ? 'outline' : 'default'
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
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default">{selectedListes.length}</Badge>
                <span className="text-sm">liste(s) sélectionnée(s)</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedListes([])}>
                  Tout désélectionner
                </Button>
                <Button size="sm" onClick={() => setShowBatchDialog(true)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Traiter la sélection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres dynamiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtres dynamiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Année scolaire</label>
              <Select value={filters.anneeScolaire} onValueChange={(v) => setFilters({...filters, anneeScolaire: v})}>
                <SelectTrigger className="mt-1">
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
              <label className="text-sm font-medium">Période début</label>
              <Select value={filters.periodeDebut} onValueChange={(v) => setFilters({...filters, periodeDebut: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01-2025">Janvier 2025</SelectItem>
                  <SelectItem value="02-2025">Février 2025</SelectItem>
                  <SelectItem value="03-2025">Mars 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Type d'opération</label>
              <Select value={filters.typeOperation} onValueChange={(v) => setFilters({...filters, typeOperation: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recette">Recette</SelectItem>
                  <SelectItem value="depense">Dépense</SelectItem>
                  <SelectItem value="transfert">Transfert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Mode de paiement</label>
              <Select value={filters.modePaiement} onValueChange={(v) => setFilters({...filters, modePaiement: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="cheque">Chèque</SelectItem>
                  <SelectItem value="virement">Virement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Caissier</label>
              <Select value={filters.caissier} onValueChange={(v) => setFilters({...filters, caissier: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caissier1">Jean Dupont</SelectItem>
                  <SelectItem value="caissier2">Marie Martin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Compte comptable</label>
              <Select value={filters.compteComptable} onValueChange={(v) => setFilters({...filters, compteComptable: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512 - Banque</SelectItem>
                  <SelectItem value="530">530 - Caisse</SelectItem>
                  <SelectItem value="411">411 - Clients</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Classe</label>
              <Select value={filters.classe} onValueChange={(v) => setFilters({...filters, classe: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6emeA">6ème A</SelectItem>
                  <SelectItem value="5emeB">5ème B</SelectItem>
                  <SelectItem value="4emeC">4ème C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Élève</label>
              <Select value={filters.eleve} onValueChange={(v) => setFilters({...filters, eleve: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleve1">KOUAME Jean</SelectItem>
                  <SelectItem value="eleve2">KONAN Marie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets des catégories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
          {accessibleCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2 py-2">
              <cat.icon className="h-4 w-4" />
              <span className="hidden md:inline">{cat.nom}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {accessibleCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.nom}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectAllInCategory(category.id)}
                  >
                    {getAccessibleListes(category.id).every(l => selectedListes.includes(l.id))
                      ? 'Tout désélectionner'
                      : 'Tout sélectionner'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {getAccessibleListes(category.id).map((liste) => (
                    <div
                      key={liste.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedListes.includes(liste.id)}
                          onCheckedChange={() => toggleListeSelection(liste.id)}
                        />
                        <div>
                          <p className="font-medium">{liste.nom}</p>
                          <div className="flex gap-1 mt-1">
                            {liste.roles.map((role) => (
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
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const cat = categories.find(c => c.listes.some(l => l.id === liste.id));
                            logAction('export_pdf', liste.id, liste.nom, cat?.nom || '', filters, Math.floor(Math.random() * 100) + 10);
                            toast.success(`Export PDF de "${liste.nom}" effectué`);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const cat = categories.find(c => c.listes.some(l => l.id === liste.id));
                            logAction('export_excel', liste.id, liste.nom, cat?.nom || '', filters, Math.floor(Math.random() * 100) + 10);
                            toast.success(`Export Excel de "${liste.nom}" effectué`);
                          }}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const cat = categories.find(c => c.listes.some(l => l.id === liste.id));
                            logAction('impression', liste.id, liste.nom, cat?.nom || '', filters, Math.floor(Math.random() * 100) + 10);
                            window.print();
                            toast.success(`Impression de "${liste.nom}" lancée`);
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

      {/* Modal de prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Prévisualisation
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg p-6 bg-white">
            {/* En-tête officiel */}
            <div className="text-center mb-6 border-b pb-4">
              <div className="flex justify-center items-center gap-4 mb-2">
                {configuration?.identite?.logo && (
                  <img 
                    src={configuration.identite.logo} 
                    alt="Logo" 
                    className="h-16 object-contain"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {configuration?.identite?.nom || 'Établissement Scolaire'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Année scolaire : {filters.anneeScolaire}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4">
                {categories.flatMap(c => c.listes).find(l => l.id === selectedListe)?.nom || 'Liste'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>

            {/* Contenu de démonstration */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>CPT-2025-{String(i).padStart(4, '0')}</TableCell>
                    <TableCell>{new Date(2025, 0, i + 10).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>Opération comptable #{i}</TableCell>
                    <TableCell>{(Math.random() * 500000 + 50000).toLocaleString('fr-FR')} FCFA</TableCell>
                    <TableCell>
                      <Badge variant={i % 2 === 0 ? 'default' : 'secondary'}>
                        {i % 2 === 0 ? 'Validé' : 'En attente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Fermer
            </Button>
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

export default ImprimerListesComptabilite;
