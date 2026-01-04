import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import { useAuditListes } from '@/hooks/useAuditListes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Filter,
  Shield,
  Package,
  ArrowUpDown,
  AlertTriangle,
  ClipboardList,
  Landmark,
  BarChart3,
  History
} from 'lucide-react';
import { toast } from 'sonner';

interface ListeItem {
  id: string;
  nom: string;
  description: string;
  categorie: string;
}

const listesParCategorie: Record<string, ListeItem[]> = {
  entreeSortie: [
    { id: 'es-1', nom: 'Liste des entrées de stock', description: 'Tous les articles entrés en stock', categorie: 'Entrées/Sorties' },
    { id: 'es-2', nom: 'Liste des sorties de stock', description: 'Tous les articles sortis du stock', categorie: 'Entrées/Sorties' },
    { id: 'es-3', nom: 'Historique des mouvements par période', description: 'Mouvements sur une période donnée', categorie: 'Entrées/Sorties' },
    { id: 'es-4', nom: 'Mouvements par article', description: 'Historique par article spécifique', categorie: 'Entrées/Sorties' },
    { id: 'es-5', nom: 'Mouvements par service / responsable', description: 'Mouvements par affectation', categorie: 'Entrées/Sorties' },
    { id: 'es-6', nom: 'Mouvements par type (achat, don, transfert, réforme)', description: 'Mouvements classés par type', categorie: 'Entrées/Sorties' },
  ],
  seuilsAlerte: [
    { id: 'sa-1', nom: 'Articles en dessous du seuil minimum', description: 'Articles nécessitant réapprovisionnement', categorie: 'Seuils Alerte' },
    { id: 'sa-2', nom: 'Articles proches du seuil critique', description: 'Articles en situation critique', categorie: 'Seuils Alerte' },
    { id: 'sa-3', nom: 'Alertes actives', description: 'Toutes les alertes en cours', categorie: 'Seuils Alerte' },
    { id: 'sa-4', nom: 'Alertes traitées', description: 'Alertes résolues', categorie: 'Seuils Alerte' },
    { id: 'sa-5', nom: 'Historique des alertes de stock', description: 'Historique complet des alertes', categorie: 'Seuils Alerte' },
  ],
  inventaire: [
    { id: 'inv-1', nom: 'Inventaire général', description: 'Liste complète de tous les articles', categorie: 'Inventaire' },
    { id: 'inv-2', nom: 'Inventaire par catégorie', description: 'Articles classés par catégorie', categorie: 'Inventaire' },
    { id: 'inv-3', nom: 'Inventaire par localisation', description: 'Articles par salle, bureau, service', categorie: 'Inventaire' },
    { id: 'inv-4', nom: 'Inventaire par état', description: 'Articles par état (neuf, bon, dégradé, hors service)', categorie: 'Inventaire' },
    { id: 'inv-5', nom: 'Inventaire par responsable', description: 'Articles par responsable affecté', categorie: 'Inventaire' },
    { id: 'inv-6', nom: 'Biens manquants', description: 'Articles non retrouvés lors de l\'inventaire', categorie: 'Inventaire' },
    { id: 'inv-7', nom: 'Biens réformés', description: 'Articles mis hors service', categorie: 'Inventaire' },
  ],
  patrimoine: [
    { id: 'pat-1', nom: 'Liste complète des biens patrimoniaux', description: 'Tous les biens de l\'établissement', categorie: 'Patrimoine' },
    { id: 'pat-2', nom: 'Biens par type', description: 'Mobilier, informatique, véhicules, équipements', categorie: 'Patrimoine' },
    { id: 'pat-3', nom: 'Biens par affectation', description: 'Biens classés par lieu d\'affectation', categorie: 'Patrimoine' },
    { id: 'pat-4', nom: 'Biens amortissables', description: 'Biens soumis à amortissement', categorie: 'Patrimoine' },
    { id: 'pat-5', nom: 'État de vétusté des biens', description: 'Évaluation de l\'usure des biens', categorie: 'Patrimoine' },
    { id: 'pat-6', nom: 'Historique des affectations', description: 'Historique des mouvements de biens', categorie: 'Patrimoine' },
  ],
  suiviAnalyse: [
    { id: 'su-1', nom: 'Valeur totale du stock', description: 'Valorisation globale du stock', categorie: 'Suivi & Analyse' },
    { id: 'su-2', nom: 'Valeur du patrimoine par catégorie', description: 'Valorisation par type de bien', categorie: 'Suivi & Analyse' },
    { id: 'su-3', nom: 'Statistiques d\'utilisation des biens', description: 'Taux d\'utilisation des équipements', categorie: 'Suivi & Analyse' },
    { id: 'su-4', nom: 'Rapports périodiques (mensuel, annuel)', description: 'Bilans de gestion des stocks', categorie: 'Suivi & Analyse' },
    { id: 'su-5', nom: 'Comparatif inventaire théorique vs réel', description: 'Écarts entre stock théorique et physique', categorie: 'Suivi & Analyse' },
  ],
};

export default function ImprimerListesStocks() {
  const { t } = useLanguage();
  const { currentRole } = useRole();
  const { logAction } = useAuditListes();

  const [selectedTab, setSelectedTab] = useState('entreeSortie');
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    anneeScolaire: '2024-2025',
    periode: '',
    categorie: '',
    article: '',
    localisation: '',
    service: '',
    responsable: '',
    etat: '',
    statut: '',
  });

  // Vérification des accès
  const isAdmin = currentRole === 'admin';
  const isEconome = currentRole === 'comptable';
  const isIntendant = currentRole === 'secretaire';
  const hasAccess = isAdmin || isEconome || isIntendant;

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Accès refusé. Cette section est réservée à l'Économe, l'Intendant et l'Administration.
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
    logAction('generation', liste.id, liste.nom, 'Stocks & Patrimoine', filters, 1);
    toast.info(`Prévisualisation : ${liste.nom}`, {
      description: 'Génération en cours...'
    });
  };

  const handlePrintPDF = (liste: ListeItem) => {
    logAction('export_pdf', liste.id, liste.nom, 'Stocks & Patrimoine', filters, 1);
    toast.success(`Export PDF : ${liste.nom}`, {
      description: 'Document généré avec succès'
    });
  };

  const handlePrintExcel = (liste: ListeItem) => {
    logAction('export_excel', liste.id, liste.nom, 'Stocks & Patrimoine', filters, 1);
    toast.success(`Export Excel : ${liste.nom}`);
  };

  const handlePrint = (liste: ListeItem) => {
    logAction('impression', liste.id, liste.nom, 'Stocks & Patrimoine', filters, 1);
    toast.success(`Impression : ${liste.nom}`, {
      description: 'Envoyé à l\'imprimante'
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
          <TableHead>Catégorie</TableHead>
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
              <Badge variant="secondary">{liste.categorie}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => handlePreview(liste)} title="Prévisualiser">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handlePrintPDF(liste)} title="Export PDF">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handlePrintExcel(liste)} title="Export Excel">
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
    { id: 'entreeSortie', label: 'Entrées/Sorties', icon: ArrowUpDown },
    { id: 'seuilsAlerte', label: 'Seuils Alerte', icon: AlertTriangle },
    { id: 'inventaire', label: 'Inventaire', icon: ClipboardList },
    { id: 'patrimoine', label: 'Patrimoine', icon: Landmark },
    { id: 'suiviAnalyse', label: 'Suivi & Analyse', icon: BarChart3 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Imprimer Listes - Stocks & Patrimoine
          </h1>
          <p className="text-muted-foreground mt-1">
            Génération et impression des listes de stocks, équipements et biens patrimoniaux
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          Accès sécurisé
        </Badge>
      </div>

      {/* Alerte traçabilité */}
      <Alert>
        <History className="h-4 w-4" />
        <AlertDescription>
          <strong>Traçabilité activée.</strong> Toutes les impressions et exports sont journalisés pour audit.
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="janvier">Janvier</SelectItem>
                  <SelectItem value="trimestre1">Trimestre 1</SelectItem>
                  <SelectItem value="trimestre2">Trimestre 2</SelectItem>
                  <SelectItem value="trimestre3">Trimestre 3</SelectItem>
                  <SelectItem value="annuel">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={filters.categorie} onValueChange={(v) => setFilters({...filters, categorie: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobilier">Mobilier</SelectItem>
                  <SelectItem value="informatique">Informatique</SelectItem>
                  <SelectItem value="vehicules">Véhicules</SelectItem>
                  <SelectItem value="equipements">Équipements</SelectItem>
                  <SelectItem value="fournitures">Fournitures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Localisation</Label>
              <Select value={filters.localisation} onValueChange={(v) => setFilters({...filters, localisation: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="salles">Salles de classe</SelectItem>
                  <SelectItem value="laboratoires">Laboratoires</SelectItem>
                  <SelectItem value="bibliotheque">Bibliothèque</SelectItem>
                  <SelectItem value="magasin">Magasin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>État</Label>
              <Select value={filters.etat} onValueChange={(v) => setFilters({...filters, etat: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neuf">Neuf</SelectItem>
                  <SelectItem value="bon">Bon état</SelectItem>
                  <SelectItem value="degrade">Dégradé</SelectItem>
                  <SelectItem value="horsService">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions groupées */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {selectedListes.length} liste(s) sélectionnée(s)
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleBatchAction('pdf')}
                disabled={selectedListes.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleBatchAction('excel')}
                disabled={selectedListes.length === 0}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button 
                onClick={() => handleBatchAction('print')}
                disabled={selectedListes.length === 0}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets des catégories */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-max">
                {tabConfig.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {tabConfig.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="mt-4">
                <ScrollArea className="h-[400px]">
                  {renderListeTable(listesParCategorie[tab.id] || [])}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
