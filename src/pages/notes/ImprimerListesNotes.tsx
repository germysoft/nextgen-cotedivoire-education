import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Printer, FileText, FileSpreadsheet, Eye, Filter, Download,
  ClipboardList, Calculator, Award, BookOpen, Settings, CheckCircle,
  FileQuestion, BarChart3, History, AlertTriangle
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

const useAuditListesNotes = () => {
  const [entries, setEntries] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem('audit_listes_notes');
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
    localStorage.setItem('audit_listes_notes', JSON.stringify(updated));
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
    id: 'saisie',
    nom: 'Saisie & Suivi des Notes',
    icon: ClipboardList,
    listes: [
      { id: 'notes_classe', nom: 'Liste des notes par classe', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'notes_matiere', nom: 'Liste des notes par matière', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'notes_enseignant', nom: 'Liste des notes par enseignant', roles: ['admin', 'direction'] },
      { id: 'notes_evaluation', nom: 'Liste des notes par évaluation', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'notes_saisies', nom: 'Liste des notes saisies / non saisies', roles: ['admin', 'direction'] },
      { id: 'notes_validees', nom: 'Liste des notes validées / non validées', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'moyennes',
    nom: 'Moyennes & Résultats',
    icon: Calculator,
    listes: [
      { id: 'moyennes_eleve', nom: 'Liste des moyennes par élève', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'moyennes_classe', nom: 'Liste des moyennes par classe', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'moyennes_niveau', nom: 'Liste des moyennes par niveau', roles: ['admin', 'direction'] },
      { id: 'moyennes_matiere', nom: 'Liste des moyennes par matière', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'classement_eleves', nom: 'Classement des élèves par moyenne', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'admis_ajournes', nom: 'Liste des admis / ajournés', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'bulletins',
    nom: 'Bulletins & Relevés',
    icon: Award,
    listes: [
      { id: 'bulletins_generes', nom: 'Liste des bulletins générés', roles: ['admin', 'direction'] },
      { id: 'bulletins_valides', nom: 'Liste des bulletins validés', roles: ['admin', 'direction'] },
      { id: 'bulletins_classe', nom: 'Liste des bulletins par classe', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'releves_notes', nom: 'Liste des relevés de notes', roles: ['admin', 'direction'] },
      { id: 'documents_imprimes', nom: 'Liste des documents imprimés / non imprimés', roles: ['admin', 'direction'] }
    ]
  },
  {
    id: 'baremes',
    nom: 'Barèmes & Configurations',
    icon: Settings,
    listes: [
      { id: 'baremes_matiere', nom: 'Liste des barèmes par matière', roles: ['admin', 'direction'] },
      { id: 'coefficients_niveau', nom: 'Liste des coefficients par niveau', roles: ['admin', 'direction'] },
      { id: 'types_evaluations', nom: 'Liste des types d\'évaluations', roles: ['admin', 'direction'] },
      { id: 'historique_baremes', nom: 'Historique des modifications de barèmes', roles: ['admin'] }
    ]
  },
  {
    id: 'qcm',
    nom: 'QCM & Évaluations en ligne',
    icon: FileQuestion,
    listes: [
      { id: 'qcm_crees', nom: 'Liste des QCM créés', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'qcm_publies', nom: 'Liste des QCM publiés', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'qcm_corriges', nom: 'Liste des QCM corrigés automatiquement', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'resultats_qcm', nom: 'Liste des résultats QCM par élève', roles: ['admin', 'direction', 'enseignant'] },
      { id: 'tentatives_qcm', nom: 'Liste des tentatives par QCM', roles: ['admin', 'direction', 'enseignant'] }
    ]
  },
  {
    id: 'controles',
    nom: 'Contrôles & Suivi pédagogique',
    icon: CheckCircle,
    listes: [
      { id: 'retards_saisie', nom: 'Liste des retards de saisie de notes', roles: ['admin', 'direction'] },
      { id: 'anomalies', nom: 'Liste des anomalies (notes manquantes, hors barème)', roles: ['admin', 'direction'] },
      { id: 'historique_validations', nom: 'Historique des validations', roles: ['admin', 'direction'] },
      { id: 'stats_reussite', nom: 'Statistiques de réussite par classe / matière', roles: ['admin', 'direction', 'enseignant'] }
    ]
  }
];

const ImprimerListesNotes = () => {
  const { configuration } = useEtablissement();
  const { currentRole } = useRole();
  const { entries, logAction, getStats } = useAuditListesNotes();
  
  const [activeTab, setActiveTab] = useState('saisie');
  const [selectedListe, setSelectedListe] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    anneeScolaire: '2024-2025',
    periode: '',
    cycle: '',
    niveau: '',
    classe: '',
    matiere: '',
    enseignant: '',
    typeEvaluation: '',
    statut: ''
  });

  const userRole = currentRole || 'admin';
  
  const hasAccess = (roles: string[]) => {
    if (userRole === 'admin' || userRole === 'directeur') return true;
    if (userRole === 'enseignant' && roles.includes('enseignant')) return true;
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

  const stats = getStats();
  const accessibleCategories = getAccessibleCategories();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Imprimer Listes - Notes & Évaluations</h1>
          <p className="text-muted-foreground mt-1">
            Génération et impression des listes académiques
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAudit} onOpenChange={setShowAudit}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Journal d'audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Journal d'audit - Listes Notes & Évaluations</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.aujourdhui}</div>
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
                    <div className="text-2xl font-bold text-green-600">{stats.parAction.export_pdf}</div>
                    <div className="text-sm text-muted-foreground">Exports PDF</div>
                  </CardContent>
                </Card>
              </div>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
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
                            entry.action === 'generation' ? 'default' :
                            entry.action === 'export_pdf' ? 'secondary' :
                            entry.action === 'export_excel' ? 'outline' : 'destructive'
                          }>
                            {entry.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.listeNom}</TableCell>
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

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
              <label className="text-sm font-medium mb-1 block">Période</label>
              <Select value={filters.periode} onValueChange={(v) => setFilters({...filters, periode: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="trimestre1">Trimestre 1</SelectItem>
                  <SelectItem value="trimestre2">Trimestre 2</SelectItem>
                  <SelectItem value="trimestre3">Trimestre 3</SelectItem>
                  <SelectItem value="semestre1">Semestre 1</SelectItem>
                  <SelectItem value="semestre2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Cycle</label>
              <Select value={filters.cycle} onValueChange={(v) => setFilters({...filters, cycle: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="primaire">Primaire</SelectItem>
                  <SelectItem value="college">Collège</SelectItem>
                  <SelectItem value="lycee">Lycée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Niveau</label>
              <Select value={filters.niveau} onValueChange={(v) => setFilters({...filters, niveau: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="6eme">6ème</SelectItem>
                  <SelectItem value="5eme">5ème</SelectItem>
                  <SelectItem value="4eme">4ème</SelectItem>
                  <SelectItem value="3eme">3ème</SelectItem>
                  <SelectItem value="2nde">2nde</SelectItem>
                  <SelectItem value="1ere">1ère</SelectItem>
                  <SelectItem value="terminale">Terminale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Classe</label>
              <Select value={filters.classe} onValueChange={(v) => setFilters({...filters, classe: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="6A">6ème A</SelectItem>
                  <SelectItem value="6B">6ème B</SelectItem>
                  <SelectItem value="5A">5ème A</SelectItem>
                  <SelectItem value="5B">5ème B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Matière</label>
              <Select value={filters.matiere} onValueChange={(v) => setFilters({...filters, matiere: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="maths">Mathématiques</SelectItem>
                  <SelectItem value="francais">Français</SelectItem>
                  <SelectItem value="anglais">Anglais</SelectItem>
                  <SelectItem value="physique">Physique-Chimie</SelectItem>
                  <SelectItem value="svt">SVT</SelectItem>
                  <SelectItem value="histoire">Histoire-Géo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Enseignant</label>
              <Select value={filters.enseignant} onValueChange={(v) => setFilters({...filters, enseignant: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="dupont">M. Dupont</SelectItem>
                  <SelectItem value="martin">Mme Martin</SelectItem>
                  <SelectItem value="durand">M. Durand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Type d'évaluation</label>
              <Select value={filters.typeEvaluation} onValueChange={(v) => setFilters({...filters, typeEvaluation: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="devoir">Devoir</SelectItem>
                  <SelectItem value="interrogation">Interrogation</SelectItem>
                  <SelectItem value="examen">Examen</SelectItem>
                  <SelectItem value="qcm">QCM</SelectItem>
                  <SelectItem value="tp">TP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Statut</label>
              <Select value={filters.statut} onValueChange={(v) => setFilters({...filters, statut: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="saisi">Saisi</SelectItem>
                  <SelectItem value="non_saisi">Non saisi</SelectItem>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="non_valide">Non validé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setFilters({
                anneeScolaire: '2024-2025', periode: '', cycle: '', niveau: '',
                classe: '', matiere: '', enseignant: '', typeEvaluation: '', statut: ''
              })}>
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégories et Listes */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {accessibleCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
              <cat.icon className="h-4 w-4" />
              {cat.nom}
            </TabsTrigger>
          ))}
        </TabsList>

        {accessibleCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.nom}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAccessibleListes(category.id).map((liste) => (
                    <Card key={liste.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-sm">{liste.nom}</h4>
                          <Badge variant="outline" className="text-xs">
                            {liste.roles.includes('enseignant') ? 'Enseignant+' : 'Direction'}
                          </Badge>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            onClick={() => handleGenerate(liste.id, liste.nom)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Générer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              handleGenerate(liste.id, liste.nom);
                              setTimeout(handleExportPDF, 100);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              handleGenerate(liste.id, liste.nom);
                              setTimeout(handleExportExcel, 100);
                            }}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-1" />
                            Excel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal de prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Prévisualisation de la liste</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg p-6 bg-white">
            {/* En-tête officiel */}
            <div className="text-center border-b pb-4 mb-4">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-xl font-bold">{configuration?.identite?.nom || "Établissement Scolaire"}</h2>
              <p className="text-sm text-muted-foreground">Année scolaire : {filters.anneeScolaire}</p>
              <p className="text-sm text-muted-foreground">
                Période : {filters.periode || 'Toutes périodes'}
              </p>
              <h3 className="text-lg font-semibold mt-2">
                {categories.flatMap(c => c.listes).find(l => l.id === selectedListe)?.nom || 'Liste'}
              </h3>
            </div>

            {/* Contenu exemple */}
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <TableRow key={i}>
                      <TableCell>{i}</TableCell>
                      <TableCell>Élève {i}</TableCell>
                      <TableCell>6ème A</TableCell>
                      <TableCell>Mathématiques</TableCell>
                      <TableCell>{Math.floor(Math.random() * 10) + 10}/20</TableCell>
                      <TableCell>{(Math.random() * 5 + 12).toFixed(2)}/20</TableCell>
                      <TableCell>
                        <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                          {i % 2 === 0 ? "Validé" : "En attente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Pied de page */}
            <div className="border-t pt-4 mt-4 text-center text-sm text-muted-foreground">
              <p>Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
              <p>Total : 8 résultats</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exporter Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Exporter PDF
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

export default ImprimerListesNotes;
