import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import { useEtablissement } from '@/contexts/EtablissementContext';
import { ConfigurationEtablissement } from '@/types/etablissement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Printer, FileText, FileSpreadsheet, Eye, Calendar, Clock, 
  UserCheck, ClipboardList, FileCheck, Download, History, Filter
} from 'lucide-react';
import { toast } from 'sonner';

type ListCategory = 'planning' | 'cours' | 'pointage' | 'assiduite' | 'fiches';

interface ListType {
  id: string;
  name: string;
  description: string;
  category: ListCategory;
  accessRoles: string[];
}

interface AuditEntry {
  id: string;
  utilisateur: string;
  role: string;
  typeListe: string;
  dateHeure: string;
  action: string;
}

const listTypes: ListType[] = [
  // Planning & Organisation
  { id: 'planning_hebdo_enseignant', name: 'Planning hebdomadaire par enseignant', description: 'Emploi du temps hebdomadaire individuel', category: 'planning', accessRoles: ['admin', 'directeur', 'rh', 'pedagogie', 'enseignant'] },
  { id: 'planning_classe', name: 'Planning par classe', description: 'Emploi du temps par classe', category: 'planning', accessRoles: ['admin', 'directeur', 'rh', 'pedagogie'] },
  { id: 'planning_matiere', name: 'Planning par matière', description: 'Répartition horaire par discipline', category: 'planning', accessRoles: ['admin', 'directeur', 'rh', 'pedagogie'] },
  { id: 'planning_global', name: 'Planning global établissement', description: 'Vue d\'ensemble de tous les plannings', category: 'planning', accessRoles: ['admin', 'directeur'] },
  { id: 'planning_remplacements', name: 'Planning des remplacements', description: 'Liste des remplacements programmés', category: 'planning', accessRoles: ['admin', 'directeur', 'rh', 'pedagogie'] },
  
  // Suivi des Cours
  { id: 'cours_enseignant', name: 'Cours dispensés par enseignant', description: 'Liste des cours effectués', category: 'cours', accessRoles: ['admin', 'directeur', 'pedagogie', 'enseignant'] },
  { id: 'cours_classe', name: 'Cours par classe', description: 'Liste des cours par classe', category: 'cours', accessRoles: ['admin', 'directeur', 'pedagogie'] },
  { id: 'cours_matiere', name: 'Cours par matière', description: 'Liste des cours par discipline', category: 'cours', accessRoles: ['admin', 'directeur', 'pedagogie'] },
  { id: 'cours_non_effectues', name: 'Cours non effectués', description: 'Liste des cours manqués ou reportés', category: 'cours', accessRoles: ['admin', 'directeur', 'pedagogie'] },
  { id: 'volume_horaire', name: 'Volume horaire réalisé/prévu', description: 'Comparatif heures prévues vs réalisées', category: 'cours', accessRoles: ['admin', 'directeur', 'rh', 'pedagogie'] },
  
  // Pointage & Présence
  { id: 'pointage_journalier', name: 'Pointage journalier', description: 'Relevé de présence du jour', category: 'pointage', accessRoles: ['admin', 'directeur', 'rh'] },
  { id: 'pointage_mensuel', name: 'Pointage mensuel par enseignant', description: 'Récapitulatif mensuel de présence', category: 'pointage', accessRoles: ['admin', 'directeur', 'rh', 'enseignant'] },
  { id: 'liste_retards', name: 'Liste des retards', description: 'Historique des retards', category: 'pointage', accessRoles: ['admin', 'directeur', 'rh'] },
  { id: 'liste_absences', name: 'Liste des absences', description: 'Historique des absences', category: 'pointage', accessRoles: ['admin', 'directeur', 'rh'] },
  { id: 'historique_presence', name: 'Historique de présence', description: 'Historique complet de présence', category: 'pointage', accessRoles: ['admin', 'directeur', 'rh', 'enseignant'] },
  
  // Assiduité & Performance
  { id: 'rapport_assiduite_enseignant', name: 'Rapport assiduité par enseignant', description: 'Taux de présence individuel', category: 'assiduite', accessRoles: ['admin', 'directeur', 'rh'] },
  { id: 'rapport_assiduite_periode', name: 'Rapport assiduité par période', description: 'Statistiques par période', category: 'assiduite', accessRoles: ['admin', 'directeur', 'rh'] },
  { id: 'classement_presence', name: 'Classement par taux de présence', description: 'Ranking des enseignants par assiduité', category: 'assiduite', accessRoles: ['admin', 'directeur'] },
  { id: 'stats_globales_assiduite', name: 'Statistiques globales assiduité', description: 'Vue d\'ensemble de l\'assiduité', category: 'assiduite', accessRoles: ['admin', 'directeur', 'rh'] },
  
  // Fiches de Service
  { id: 'fiche_service_individuelle', name: 'Fiche de service individuelle', description: 'Fiche de service par enseignant', category: 'fiches', accessRoles: ['admin', 'directeur', 'rh', 'pedagogie', 'enseignant'] },
  { id: 'fiches_service_niveau', name: 'Fiches de service par niveau', description: 'Fiches regroupées par niveau', category: 'fiches', accessRoles: ['admin', 'directeur', 'rh', 'pedagogie'] },
  { id: 'fiches_validees', name: 'Fiches validées / non validées', description: 'État de validation des fiches', category: 'fiches', accessRoles: ['admin', 'directeur', 'rh'] },
  { id: 'historique_fiches', name: 'Historique des fiches de service', description: 'Archives des fiches de service', category: 'fiches', accessRoles: ['admin', 'directeur', 'rh'] },
];

const categoryConfig: Record<ListCategory, { label: string; icon: React.ElementType; color: string }> = {
  planning: { label: 'Planning & Organisation', icon: Calendar, color: 'bg-blue-500' },
  cours: { label: 'Suivi des Cours', icon: ClipboardList, color: 'bg-green-500' },
  pointage: { label: 'Pointage & Présence', icon: Clock, color: 'bg-orange-500' },
  assiduite: { label: 'Assiduité & Performance', icon: UserCheck, color: 'bg-purple-500' },
  fiches: { label: 'Fiches de Service', icon: FileCheck, color: 'bg-teal-500' },
};

const mockTeachers = [
  { id: '1', name: 'M. Dupont Jean', matiere: 'Mathématiques', statut: 'actif' },
  { id: '2', name: 'Mme Martin Claire', matiere: 'Français', statut: 'actif' },
  { id: '3', name: 'M. Bernard Paul', matiere: 'Physique', statut: 'remplacant' },
];

const mockClasses = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
const mockMatieres = ['Mathématiques', 'Français', 'Physique', 'Chimie', 'Histoire', 'Géographie', 'Anglais', 'EPS'];
const mockNiveaux = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

export default function ImprimerListesEnseignants() {
  const { t } = useLanguage();
  const { currentRole, currentUserId } = useRole();
  const { configuration } = useEtablissement();
  
  const [activeCategory, setActiveCategory] = useState<ListCategory>('planning');
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewList, setPreviewList] = useState<ListType | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    anneeScolaire: '2024-2025',
    periode: 'all',
    enseignant: 'all',
    matiere: 'all',
    classe: 'all',
    niveau: 'all',
    statut: 'all',
    dateDebut: '',
    dateFin: '',
  });

  const printRef = useRef<HTMLDivElement>(null);

  const hasAccess = (list: ListType): boolean => {
    if (currentRole === 'admin' || currentRole === 'directeur') return true;
    if (currentRole === 'enseignant') {
      return list.accessRoles.includes('enseignant');
    }
    return list.accessRoles.includes(currentRole);
  };

  const getFilteredLists = (category: ListCategory) => {
    return listTypes
      .filter(list => list.category === category && hasAccess(list));
  };

  const toggleListSelection = (listId: string) => {
    setSelectedLists(prev => 
      prev.includes(listId) 
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    );
  };

  const logAuditEntry = (typeListe: string, action: string) => {
    const entry: AuditEntry = {
      id: Date.now().toString(),
      utilisateur: currentUserId,
      role: currentRole,
      typeListe,
      dateHeure: new Date().toLocaleString('fr-FR'),
      action,
    };
    setAuditLog(prev => [entry, ...prev]);
  };

  const handlePreview = (list: ListType) => {
    setPreviewList(list);
    setPreviewOpen(true);
    logAuditEntry(list.name, 'Prévisualisation');
  };

  const handlePrint = (list: ListType) => {
    logAuditEntry(list.name, 'Impression');
    toast.success(`Impression de "${list.name}" lancée`);
  };

  const handleExportPDF = (list: ListType) => {
    logAuditEntry(list.name, 'Export PDF');
    toast.success(`Export PDF de "${list.name}" généré`);
  };

  const handleExportExcel = (list: ListType) => {
    logAuditEntry(list.name, 'Export Excel');
    toast.success(`Export Excel de "${list.name}" généré`);
  };

  const handleBatchPrint = () => {
    if (selectedLists.length === 0) {
      toast.error('Sélectionnez au moins une liste');
      return;
    }
    selectedLists.forEach(listId => {
      const list = listTypes.find(l => l.id === listId);
      if (list) logAuditEntry(list.name, 'Impression groupée');
    });
    toast.success(`${selectedLists.length} liste(s) envoyée(s) à l'impression`);
  };

  const generateMockData = (list: ListType) => {
    switch (list.category) {
      case 'planning':
        return mockTeachers.map(t => ({
          enseignant: t.name,
          matiere: t.matiere,
          lundi: '08:00-10:00',
          mardi: '10:00-12:00',
          mercredi: '14:00-16:00',
          jeudi: '08:00-10:00',
          vendredi: '10:00-12:00',
        }));
      case 'cours':
        return mockTeachers.map(t => ({
          enseignant: t.name,
          matiere: t.matiere,
          heuresPrevues: Math.floor(Math.random() * 20) + 10,
          heuresRealisees: Math.floor(Math.random() * 18) + 8,
          tauxRealisation: `${Math.floor(Math.random() * 30) + 70}%`,
        }));
      case 'pointage':
        return mockTeachers.map(t => ({
          enseignant: t.name,
          date: new Date().toLocaleDateString('fr-FR'),
          arrivee: '07:45',
          depart: '17:30',
          statut: 'Présent',
        }));
      case 'assiduite':
        return mockTeachers.map(t => ({
          enseignant: t.name,
          joursPresence: Math.floor(Math.random() * 5) + 18,
          joursAbsence: Math.floor(Math.random() * 3),
          retards: Math.floor(Math.random() * 2),
          tauxAssiduite: `${Math.floor(Math.random() * 15) + 85}%`,
        }));
      case 'fiches':
        return mockTeachers.map(t => ({
          enseignant: t.name,
          matiere: t.matiere,
          volumeHoraire: `${Math.floor(Math.random() * 10) + 15}h/sem`,
          classes: mockClasses.slice(0, 3).join(', '),
          statut: Math.random() > 0.3 ? 'Validée' : 'En attente',
        }));
      default:
        return [];
    }
  };

  const renderPreviewContent = () => {
    if (!previewList) return null;
    const data = generateMockData(previewList);
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return (
      <div ref={printRef} className="p-6 bg-white text-black">
        {/* En-tête officiel */}
        <div className="text-center mb-6 border-b pb-4">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          <h1 className="text-xl font-bold">{configuration?.identite?.nom || 'Établissement Scolaire'}</h1>
          <p className="text-sm text-gray-600">Année scolaire : {filters.anneeScolaire}</p>
          <p className="text-sm text-gray-600">
            Période : {filters.dateDebut || 'Début'} - {filters.dateFin || 'Fin'}
          </p>
          <h2 className="text-lg font-semibold mt-2">{previewList.name}</h2>
        </div>

        {/* Tableau de données */}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col} className="font-bold capitalize">
                  {col.replace(/([A-Z])/g, ' $1').trim()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map(col => (
                  <TableCell key={col}>{(row as Record<string, string | number>)[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pied de page */}
        <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex justify-between">
          <span>Imprimé le : {new Date().toLocaleString('fr-FR')}</span>
          <span>Par : {currentUserId} ({currentRole})</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Imprimer Listes - Suivi Enseignants</h1>
          <p className="text-muted-foreground">
            Générez et imprimez les listes de suivi pédagogique des enseignants
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAuditLog(true)}>
            <History className="w-4 h-4 mr-2" />
            Journal d'audit
          </Button>
          <Button onClick={handleBatchPrint} disabled={selectedLists.length === 0}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer sélection ({selectedLists.length})
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres dynamiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="space-y-2">
              <Label>Année scolaire</Label>
              <Select value={filters.anneeScolaire} onValueChange={v => setFilters(f => ({ ...f, anneeScolaire: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <Select value={filters.periode} onValueChange={v => setFilters(f => ({ ...f, periode: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="semaine">Semaine</SelectItem>
                  <SelectItem value="mois">Mois</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Enseignant</Label>
              <Select value={filters.enseignant} onValueChange={v => setFilters(f => ({ ...f, enseignant: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {mockTeachers.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Matière</Label>
              <Select value={filters.matiere} onValueChange={v => setFilters(f => ({ ...f, matiere: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {mockMatieres.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={filters.classe} onValueChange={v => setFilters(f => ({ ...f, classe: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {mockClasses.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select value={filters.niveau} onValueChange={v => setFilters(f => ({ ...f, niveau: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {mockNiveaux.map(n => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={filters.statut} onValueChange={v => setFilters(f => ({ ...f, statut: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="remplacant">Remplaçant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date début</Label>
              <Input 
                type="date" 
                value={filters.dateDebut}
                onChange={e => setFilters(f => ({ ...f, dateDebut: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catégories et listes */}
      <Tabs value={activeCategory} onValueChange={v => setActiveCategory(v as ListCategory)}>
        <TabsList className="grid grid-cols-5 w-full">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(categoryConfig).map(category => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid gap-4">
              {getFilteredLists(category as ListCategory).map(list => (
                <Card key={list.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedLists.includes(list.id)}
                          onCheckedChange={() => toggleListSelection(list.id)}
                        />
                        <div>
                          <h3 className="font-medium">{list.name}</h3>
                          <p className="text-sm text-muted-foreground">{list.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={categoryConfig[list.category].color + ' text-white'}>
                          {categoryConfig[list.category].label}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(list)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePrint(list)}>
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleExportPDF(list)}>
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleExportExcel(list)}>
                          <FileSpreadsheet className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog prévisualisation */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Prévisualisation : {previewList?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {renderPreviewContent()}
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Fermer</Button>
            {previewList && (
              <>
                <Button variant="outline" onClick={() => handleExportPDF(previewList)}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => handleExportExcel(previewList)}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button onClick={() => handlePrint(previewList)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog journal d'audit */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Journal d'audit - Impressions
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {auditLog.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune action enregistrée</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Liste</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.dateHeure}</TableCell>
                      <TableCell>{entry.utilisateur}</TableCell>
                      <TableCell><Badge variant="outline">{entry.role}</Badge></TableCell>
                      <TableCell>{entry.typeListe}</TableCell>
                      <TableCell>{entry.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
