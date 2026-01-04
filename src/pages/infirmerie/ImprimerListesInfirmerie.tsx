import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import { useAuditListes } from '@/hooks/useAuditListes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Printer, 
  FileText, 
  FileSpreadsheet, 
  Eye, 
  Download,
  Filter,
  Shield,
  AlertTriangle,
  Heart,
  Stethoscope,
  Pill,
  ClipboardList,
  Bell,
  FileWarning,
  Activity,
  Syringe,
  History
} from 'lucide-react';
import { toast } from 'sonner';

interface ListeItem {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  sensible: boolean;
}

const listesParCategorie: Record<string, ListeItem[]> = {
  fichesMedicales: [
    { id: 'fm-1', nom: 'Liste des fiches médicales par élève', description: 'Toutes les fiches médicales classées par élève', categorie: 'Fiches Médicales', sensible: true },
    { id: 'fm-2', nom: 'Liste des élèves avec fiche médicale complète', description: 'Élèves dont la fiche est complète', categorie: 'Fiches Médicales', sensible: true },
    { id: 'fm-3', nom: 'Liste des fiches incomplètes', description: 'Fiches médicales à compléter', categorie: 'Fiches Médicales', sensible: true },
    { id: 'fm-4', nom: 'Liste par classe', description: 'Fiches médicales par classe', categorie: 'Fiches Médicales', sensible: true },
    { id: 'fm-5', nom: 'Liste par niveau', description: 'Fiches médicales par niveau scolaire', categorie: 'Fiches Médicales', sensible: true },
    { id: 'fm-6', nom: 'Liste par sexe', description: 'Fiches médicales par sexe', categorie: 'Fiches Médicales', sensible: true },
    { id: 'fm-7', nom: 'Liste des élèves à risque médical', description: 'Élèves nécessitant une attention particulière', categorie: 'Fiches Médicales', sensible: true },
  ],
  consultations: [
    { id: 'cs-1', nom: 'Liste des consultations journalières', description: 'Consultations du jour', categorie: 'Consultations', sensible: true },
    { id: 'cs-2', nom: 'Liste des consultations par période', description: 'Consultations sur une période donnée', categorie: 'Consultations', sensible: true },
    { id: 'cs-3', nom: 'Liste des consultations par élève', description: 'Historique des consultations par élève', categorie: 'Consultations', sensible: true },
    { id: 'cs-4', nom: 'Liste des consultations par motif', description: 'Consultations classées par motif', categorie: 'Consultations', sensible: true },
    { id: 'cs-5', nom: 'Liste des consultations par infirmier(ère)', description: 'Consultations par personnel soignant', categorie: 'Consultations', sensible: true },
    { id: 'cs-6', nom: 'Historique des consultations', description: 'Historique complet des consultations', categorie: 'Consultations', sensible: true },
  ],
  historiqueMedical: [
    { id: 'hm-1', nom: 'Historique médical par élève', description: 'Dossier médical complet par élève', categorie: 'Historique Médical', sensible: true },
    { id: 'hm-2', nom: 'Liste des pathologies déclarées', description: 'Toutes les pathologies enregistrées', categorie: 'Historique Médical', sensible: true },
    { id: 'hm-3', nom: 'Liste des allergies', description: 'Allergies déclarées par élève', categorie: 'Historique Médical', sensible: true },
    { id: 'hm-4', nom: 'Liste des traitements chroniques', description: 'Élèves sous traitement chronique', categorie: 'Historique Médical', sensible: true },
    { id: 'hm-5', nom: 'Liste des antécédents médicaux', description: 'Antécédents médicaux par élève', categorie: 'Historique Médical', sensible: true },
  ],
  fichesSante: [
    { id: 'fs-1', nom: 'Liste des fiches santé par élève', description: 'Fiches santé classées par élève', categorie: 'Fiches Santé', sensible: true },
    { id: 'fs-2', nom: 'Liste des fiches santé validées', description: 'Fiches santé approuvées', categorie: 'Fiches Santé', sensible: true },
    { id: 'fs-3', nom: 'Liste des fiches santé non validées', description: 'Fiches santé en attente de validation', categorie: 'Fiches Santé', sensible: true },
    { id: 'fs-4', nom: 'Liste des vaccins à jour', description: 'Élèves avec vaccinations complètes', categorie: 'Fiches Santé', sensible: true },
    { id: 'fs-5', nom: 'Liste des vaccins manquants ou expirés', description: 'Vaccinations à mettre à jour', categorie: 'Fiches Santé', sensible: true },
  ],
  stockMedicaments: [
    { id: 'sm-1', nom: 'Stock général des médicaments', description: 'Inventaire complet du stock', categorie: 'Stock Médicaments', sensible: false },
    { id: 'sm-2', nom: 'Liste par catégorie de médicament', description: 'Stock classé par catégorie', categorie: 'Stock Médicaments', sensible: false },
    { id: 'sm-3', nom: 'Liste des médicaments disponibles', description: 'Médicaments en stock', categorie: 'Stock Médicaments', sensible: false },
    { id: 'sm-4', nom: 'Liste des médicaments en rupture', description: 'Médicaments à réapprovisionner', categorie: 'Stock Médicaments', sensible: false },
    { id: 'sm-5', nom: 'Liste des médicaments périmés', description: 'Médicaments à retirer', categorie: 'Stock Médicaments', sensible: false },
    { id: 'sm-6', nom: 'Historique des entrées et sorties', description: 'Mouvements de stock', categorie: 'Stock Médicaments', sensible: false },
  ],
  rapportsPeriodiques: [
    { id: 'rp-1', nom: 'Rapport sanitaire mensuel', description: 'Bilan sanitaire du mois', categorie: 'Rapports Périodiques', sensible: false },
    { id: 'rp-2', nom: 'Rapport trimestriel', description: 'Bilan sanitaire trimestriel', categorie: 'Rapports Périodiques', sensible: false },
    { id: 'rp-3', nom: 'Rapport annuel', description: 'Bilan sanitaire annuel', categorie: 'Rapports Périodiques', sensible: false },
    { id: 'rp-4', nom: 'Statistiques des pathologies fréquentes', description: 'Pathologies les plus courantes', categorie: 'Rapports Périodiques', sensible: false },
    { id: 'rp-5', nom: 'Bilan des consultations par période', description: 'Synthèse des consultations', categorie: 'Rapports Périodiques', sensible: false },
  ],
  ordonnances: [
    { id: 'or-1', nom: 'Liste des ordonnances émises', description: 'Toutes les ordonnances', categorie: 'Ordonnances', sensible: true },
    { id: 'or-2', nom: 'Ordonnances par élève', description: 'Ordonnances classées par élève', categorie: 'Ordonnances', sensible: true },
    { id: 'or-3', nom: 'Ordonnances par période', description: 'Ordonnances sur une période', categorie: 'Ordonnances', sensible: true },
    { id: 'or-4', nom: 'Ordonnances par médicament', description: 'Prescriptions par médicament', categorie: 'Ordonnances', sensible: true },
    { id: 'or-5', nom: 'Historique des prescriptions', description: 'Historique complet des prescriptions', categorie: 'Ordonnances', sensible: true },
  ],
  rappels: [
    { id: 'ra-1', nom: 'Liste des rappels envoyés', description: 'Rappels déjà transmis', categorie: 'Rappels', sensible: false },
    { id: 'ra-2', nom: 'Liste des rappels programmés', description: 'Rappels à venir', categorie: 'Rappels', sensible: false },
    { id: 'ra-3', nom: 'Rappels par type (vaccin, suivi médical)', description: 'Rappels classés par type', categorie: 'Rappels', sensible: false },
    { id: 'ra-4', nom: 'Rappels par élève', description: 'Rappels par élève', categorie: 'Rappels', sensible: false },
    { id: 'ra-5', nom: 'Historique des notifications', description: 'Historique des envois', categorie: 'Rappels', sensible: false },
  ],
  alertesUrgentes: [
    { id: 'au-1', nom: 'Liste des alertes médicales actives', description: 'Alertes en cours', categorie: 'Alertes Urgentes', sensible: true },
    { id: 'au-2', nom: 'Liste des alertes traitées', description: 'Alertes résolues', categorie: 'Alertes Urgentes', sensible: true },
    { id: 'au-3', nom: 'Alertes par type (urgence, allergie, accident)', description: 'Alertes classées par type', categorie: 'Alertes Urgentes', sensible: true },
    { id: 'au-4', nom: 'Alertes par période', description: 'Alertes sur une période', categorie: 'Alertes Urgentes', sensible: true },
    { id: 'au-5', nom: 'Historique des interventions d\'urgence', description: 'Historique des urgences', categorie: 'Alertes Urgentes', sensible: true },
  ],
};

export default function ImprimerListesInfirmerie() {
  const { t } = useLanguage();
  const { currentRole } = useRole();
  const { logAction } = useAuditListes();

  const [selectedTab, setSelectedTab] = useState('fichesMedicales');
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    anneeScolaire: '2024-2025',
    periode: '',
    classe: '',
    niveau: '',
    eleve: '',
    typeDonnee: '',
    statut: '',
  });

  // Vérification des accès
  const isAdmin = currentRole === 'admin';
  const isInfirmier = currentRole === 'surveillant'; // surveillant gère l'infirmerie
  const isDirection = currentRole === 'directeur';
  const hasAccess = isAdmin || isInfirmier || isDirection;

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Accès refusé. Cette section est réservée au personnel médical autorisé (Infirmier(ère), Direction, Administrateur).
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSelectListe = (listeId: string) => {
    setSelectedListes(prev => 
      prev.includes(listeId) 
        ? prev.filter(id => id !== listeId)
        : [...prev, listeId]
    );
  };

  const handleSelectAll = (categorie: string) => {
    const listesCategorie = listesParCategorie[categorie] || [];
    const allSelected = listesCategorie.every(l => selectedListes.includes(l.id));
    
    if (allSelected) {
      setSelectedListes(prev => prev.filter(id => !listesCategorie.some(l => l.id === id)));
    } else {
      setSelectedListes(prev => [...new Set([...prev, ...listesCategorie.map(l => l.id)])]);
    }
  };

  const getListeById = (id: string): ListeItem | undefined => {
    for (const listes of Object.values(listesParCategorie)) {
      const liste = listes.find(l => l.id === id);
      if (liste) return liste;
    }
    return undefined;
  };

  const handlePreview = (liste: ListeItem) => {
    logAction('generation', liste.id, liste.nom, 'Infirmerie', filters, 1);
    toast.info(`Prévisualisation : ${liste.nom}`, {
      description: liste.sensible ? '⚠️ Document confidentiel - Données de santé' : 'Génération en cours...'
    });
  };

  const handlePrintPDF = (liste: ListeItem) => {
    logAction('export_pdf', liste.id, liste.nom, 'Infirmerie', filters, 1);
    toast.success(`Export PDF : ${liste.nom}`, {
      description: liste.sensible ? '⚠️ Document confidentiel exporté' : 'Document généré avec succès'
    });
  };

  const handlePrintExcel = (liste: ListeItem) => {
    if (liste.sensible && !isAdmin) {
      toast.error('Export Excel non autorisé', {
        description: 'L\'export Excel des données sensibles est réservé aux administrateurs'
      });
      return;
    }
    logAction('export_excel', liste.id, liste.nom, 'Infirmerie', filters, 1);
    toast.success(`Export Excel : ${liste.nom}`);
  };

  const handlePrint = (liste: ListeItem) => {
    logAction('impression', liste.id, liste.nom, 'Infirmerie', filters, 1);
    toast.success(`Impression : ${liste.nom}`, {
      description: liste.sensible ? '⚠️ Impression sécurisée - Document confidentiel' : 'Envoyé à l\'imprimante'
    });
  };

  const handleBatchAction = (action: 'pdf' | 'excel' | 'print') => {
    if (selectedListes.length === 0) {
      toast.warning('Aucune liste sélectionnée');
      return;
    }

    const actionLabels = {
      pdf: 'Export PDF',
      excel: 'Export Excel',
      print: 'Impression'
    };

    selectedListes.forEach(id => {
      const liste = getListeById(id);
      if (liste) {
        if (action === 'pdf') handlePrintPDF(liste);
        else if (action === 'excel') handlePrintExcel(liste);
        else handlePrint(liste);
      }
    });

    toast.success(`${actionLabels[action]} en lot`, {
      description: `${selectedListes.length} liste(s) traitée(s)`
    });
  };

  const renderListeTable = (listes: ListeItem[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={listes.every(l => selectedListes.includes(l.id))}
              onCheckedChange={() => handleSelectAll(selectedTab)}
            />
          </TableHead>
          <TableHead>Nom de la liste</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Sensibilité</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listes.map(liste => (
          <TableRow key={liste.id}>
            <TableCell>
              <Checkbox 
                checked={selectedListes.includes(liste.id)}
                onCheckedChange={() => handleSelectListe(liste.id)}
              />
            </TableCell>
            <TableCell className="font-medium">{liste.nom}</TableCell>
            <TableCell className="text-muted-foreground">{liste.description}</TableCell>
            <TableCell>
              {liste.sensible ? (
                <Badge variant="destructive" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Confidentiel
                </Badge>
              ) : (
                <Badge variant="secondary">Standard</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => handlePreview(liste)} title="Prévisualiser">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handlePrintPDF(liste)} title="Export PDF">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handlePrintExcel(liste)} 
                  title="Export Excel"
                  disabled={liste.sensible && !isAdmin}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handlePrint(liste)} title="Imprimer">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const tabConfig = [
    { id: 'fichesMedicales', label: 'Fiches Médicales', icon: ClipboardList },
    { id: 'consultations', label: 'Consultations', icon: Stethoscope },
    { id: 'historiqueMedical', label: 'Historique Médical', icon: History },
    { id: 'fichesSante', label: 'Fiches Santé', icon: Heart },
    { id: 'stockMedicaments', label: 'Stock Médicaments', icon: Pill },
    { id: 'rapportsPeriodiques', label: 'Rapports', icon: FileText },
    { id: 'ordonnances', label: 'Ordonnances', icon: FileWarning },
    { id: 'rappels', label: 'Rappels', icon: Bell },
    { id: 'alertesUrgentes', label: 'Alertes Urgentes', icon: AlertTriangle },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Imprimer Listes - Infirmerie
          </h1>
          <p className="text-muted-foreground mt-1">
            Génération et impression des listes médicales et sanitaires
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          Accès sécurisé
        </Badge>
      </div>

      {/* Alerte confidentialité */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Données de santé protégées.</strong> Toutes les actions sont journalisées. 
          L'export Excel des données sensibles est réservé aux administrateurs.
        </AlertDescription>
      </Alert>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres dynamiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="space-y-2">
              <Label>Année scolaire</Label>
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
            <div className="space-y-2">
              <Label>Période</Label>
              <Select value={filters.periode} onValueChange={(v) => setFilters({...filters, periode: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes</SelectItem>
                  <SelectItem value="trimestre1">Trimestre 1</SelectItem>
                  <SelectItem value="trimestre2">Trimestre 2</SelectItem>
                  <SelectItem value="trimestre3">Trimestre 3</SelectItem>
                  <SelectItem value="annee">Année complète</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select value={filters.niveau} onValueChange={(v) => setFilters({...filters, niveau: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="6eme">6ème</SelectItem>
                  <SelectItem value="5eme">5ème</SelectItem>
                  <SelectItem value="4eme">4ème</SelectItem>
                  <SelectItem value="3eme">3ème</SelectItem>
                  <SelectItem value="2nde">2nde</SelectItem>
                  <SelectItem value="1ere">1ère</SelectItem>
                  <SelectItem value="tle">Terminale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={filters.classe} onValueChange={(v) => setFilters({...filters, classe: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes</SelectItem>
                  <SelectItem value="6eme-a">6ème A</SelectItem>
                  <SelectItem value="6eme-b">6ème B</SelectItem>
                  <SelectItem value="5eme-a">5ème A</SelectItem>
                  <SelectItem value="5eme-b">5ème B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Élève</Label>
              <Input 
                placeholder="Rechercher..." 
                value={filters.eleve}
                onChange={(e) => setFilters({...filters, eleve: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Type de donnée</Label>
              <Select value={filters.typeDonnee} onValueChange={(v) => setFilters({...filters, typeDonnee: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="allergie">Allergie</SelectItem>
                  <SelectItem value="traitement">Traitement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={filters.statut} onValueChange={(v) => setFilters({...filters, statut: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="cloture">Clôturé</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions groupées */}
      {selectedListes.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {selectedListes.length} liste(s) sélectionnée(s)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBatchAction('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBatchAction('excel')} disabled={!isAdmin}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBatchAction('print')}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets des catégories */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-max">
                {tabConfig.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {Object.entries(listesParCategorie).map(([key, listes]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <ScrollArea className="h-[500px]">
                  {renderListeTable(listes)}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Informations sécurité */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Sécurité et confidentialité</p>
              <ul className="mt-1 space-y-1">
                <li>• Toutes les actions sont journalisées dans le journal d'audit</li>
                <li>• Les documents comportent l'en-tête officiel de l'établissement</li>
                <li>• L'export Excel des données sensibles est réservé aux administrateurs</li>
                <li>• Les impressions sont archivées de manière sécurisée</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
