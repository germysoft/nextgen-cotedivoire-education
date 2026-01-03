import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Printer, FileDown, FileSpreadsheet, Search, Eye, Filter, 
  BookOpen, BookMarked, QrCode, Lightbulb, ShoppingCart, Calendar,
  AlertTriangle, ClipboardList, CreditCard, BarChart3, Download,
  CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { useEtablissement } from '@/contexts/EtablissementContext';
import { useAuditListes } from '@/hooks/useAuditListes';
import { ConfigurationEtablissement } from '@/types/etablissement';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ListeItem {
  id: string;
  nom: string;
  description: string;
  categorie: string;
}

const listesCatalogue: ListeItem[] = [
  { id: 'cat-complete', nom: 'Liste complète des ouvrages', description: 'Tous les ouvrages du catalogue', categorie: 'catalogue' },
  { id: 'cat-categorie', nom: 'Liste par catégorie/thème', description: 'Ouvrages classés par catégorie', categorie: 'catalogue' },
  { id: 'cat-auteur', nom: 'Liste par auteur', description: 'Ouvrages classés par auteur', categorie: 'catalogue' },
  { id: 'cat-editeur', nom: 'Liste par éditeur', description: 'Ouvrages classés par éditeur', categorie: 'catalogue' },
  { id: 'cat-annee', nom: 'Liste par année de publication', description: 'Ouvrages par année', categorie: 'catalogue' },
  { id: 'cat-langue', nom: 'Liste par langue', description: 'Ouvrages par langue', categorie: 'catalogue' },
  { id: 'cat-disponibles', nom: 'Ouvrages disponibles', description: 'Ouvrages actuellement disponibles', categorie: 'catalogue' },
  { id: 'cat-indisponibles', nom: 'Ouvrages indisponibles', description: 'Ouvrages en emprunt ou réservés', categorie: 'catalogue' },
  { id: 'cat-etat', nom: 'Liste par état', description: 'Ouvrages par état (neuf, usé, détérioré)', categorie: 'catalogue' },
  { id: 'cat-emplacement', nom: 'Liste par emplacement', description: 'Ouvrages par rayon/étagère', categorie: 'catalogue' },
];

const listesEmprunts: ListeItem[] = [
  { id: 'emp-cours', nom: 'Emprunts en cours', description: 'Liste des emprunts actuels', categorie: 'emprunts' },
  { id: 'emp-periode', nom: 'Emprunts par période', description: 'Historique des emprunts sur une période', categorie: 'emprunts' },
  { id: 'emp-lecteur', nom: 'Emprunts par lecteur', description: 'Historique par élève ou personnel', categorie: 'emprunts' },
  { id: 'emp-non-retournes', nom: 'Livres non retournés', description: 'Ouvrages en attente de retour', categorie: 'emprunts' },
  { id: 'emp-historique', nom: 'Historique des emprunts', description: 'Tous les emprunts passés', categorie: 'emprunts' },
  { id: 'emp-retours', nom: 'Retours effectués', description: 'Liste des retours', categorie: 'emprunts' },
  { id: 'emp-retards', nom: 'Retours en retard', description: 'Emprunts dépassant l\'échéance', categorie: 'emprunts' },
];

const listesQRCode: ListeItem[] = [
  { id: 'qr-avec', nom: 'Ouvrages avec QR Code', description: 'Ouvrages ayant un QR Code généré', categorie: 'qrcode' },
  { id: 'qr-sans', nom: 'Ouvrages sans QR Code', description: 'Ouvrages sans QR Code', categorie: 'qrcode' },
  { id: 'qr-scans', nom: 'Scans par période', description: 'Historique des scans QR', categorie: 'qrcode' },
  { id: 'qr-historique', nom: 'Historique des scans', description: 'Tous les scans effectués', categorie: 'qrcode' },
];

const listesSuggestions: ListeItem[] = [
  { id: 'sug-proposees', nom: 'Suggestions proposées', description: 'Toutes les suggestions reçues', categorie: 'suggestions' },
  { id: 'sug-validees', nom: 'Suggestions validées', description: 'Suggestions approuvées', categorie: 'suggestions' },
  { id: 'sug-rejetees', nom: 'Suggestions rejetées', description: 'Suggestions refusées', categorie: 'suggestions' },
  { id: 'sug-lecteur', nom: 'Suggestions par lecteur', description: 'Suggestions classées par lecteur', categorie: 'suggestions' },
  { id: 'sug-periode', nom: 'Suggestions par période', description: 'Suggestions sur une période', categorie: 'suggestions' },
];

const listesAcquisitions: ListeItem[] = [
  { id: 'acq-periode', nom: 'Acquisitions par période', description: 'Acquisitions sur une période', categorie: 'acquisitions' },
  { id: 'acq-nouveaux', nom: 'Nouveaux ouvrages', description: 'Dernières acquisitions', categorie: 'acquisitions' },
  { id: 'acq-fournisseur', nom: 'Acquisitions par fournisseur', description: 'Classées par fournisseur', categorie: 'acquisitions' },
  { id: 'acq-budget', nom: 'Acquisitions par budget', description: 'Classées par budget', categorie: 'acquisitions' },
  { id: 'acq-historique', nom: 'Historique des acquisitions', description: 'Toutes les acquisitions', categorie: 'acquisitions' },
];

const listesReservations: ListeItem[] = [
  { id: 'res-attente', nom: 'Réservations en attente', description: 'Réservations non satisfaites', categorie: 'reservations' },
  { id: 'res-validees', nom: 'Réservations validées', description: 'Réservations confirmées', categorie: 'reservations' },
  { id: 'res-annulees', nom: 'Réservations annulées', description: 'Réservations annulées', categorie: 'reservations' },
  { id: 'res-lecteur', nom: 'Réservations par lecteur', description: 'Classées par lecteur', categorie: 'reservations' },
  { id: 'res-historique', nom: 'Historique des réservations', description: 'Toutes les réservations', categorie: 'reservations' },
];

const listesAlertes: ListeItem[] = [
  { id: 'alt-lecteurs', nom: 'Lecteurs en retard', description: 'Lecteurs avec emprunts en retard', categorie: 'alertes' },
  { id: 'alt-livres', nom: 'Livres en retard', description: 'Ouvrages non retournés', categorie: 'alertes' },
  { id: 'alt-jours', nom: 'Retards par durée', description: 'Classés par nombre de jours', categorie: 'alertes' },
  { id: 'alt-penalites', nom: 'Liste des pénalités', description: 'Pénalités appliquées', categorie: 'alertes' },
  { id: 'alt-historique', nom: 'Historique des alertes', description: 'Alertes envoyées', categorie: 'alertes' },
];

const listesInventaire: ListeItem[] = [
  { id: 'inv-general', nom: 'Inventaire général', description: 'Inventaire complet', categorie: 'inventaire' },
  { id: 'inv-categorie', nom: 'Inventaire par catégorie', description: 'Par catégorie d\'ouvrage', categorie: 'inventaire' },
  { id: 'inv-etat', nom: 'Inventaire par état', description: 'Par état de conservation', categorie: 'inventaire' },
  { id: 'inv-emplacement', nom: 'Inventaire par emplacement', description: 'Par rayon/étagère', categorie: 'inventaire' },
  { id: 'inv-manquants', nom: 'Ouvrages manquants', description: 'Ouvrages non retrouvés', categorie: 'inventaire' },
  { id: 'inv-reformes', nom: 'Ouvrages réformés', description: 'Ouvrages retirés du catalogue', categorie: 'inventaire' },
];

const listesCartes: ListeItem[] = [
  { id: 'crt-actives', nom: 'Cartes actives', description: 'Cartes lecteur valides', categorie: 'cartes' },
  { id: 'crt-expirees', nom: 'Cartes expirées', description: 'Cartes à renouveler', categorie: 'cartes' },
  { id: 'crt-eleves', nom: 'Cartes élèves', description: 'Cartes par type élève', categorie: 'cartes' },
  { id: 'crt-personnel', nom: 'Cartes personnel', description: 'Cartes par type personnel', categorie: 'cartes' },
  { id: 'crt-classe', nom: 'Lecteurs par classe', description: 'Classés par classe', categorie: 'cartes' },
  { id: 'crt-statut', nom: 'Lecteurs par statut', description: 'Par statut de carte', categorie: 'cartes' },
];

const listesStatistiques: ListeItem[] = [
  { id: 'stat-emprunts', nom: 'Statistiques emprunts', description: 'Emprunts par période', categorie: 'statistiques' },
  { id: 'stat-plus-empruntes', nom: 'Livres les plus empruntés', description: 'Top des emprunts', categorie: 'statistiques' },
  { id: 'stat-lecteurs-actifs', nom: 'Lecteurs les plus actifs', description: 'Top des lecteurs', categorie: 'statistiques' },
  { id: 'stat-rotation', nom: 'Taux de rotation', description: 'Rotation des ouvrages', categorie: 'statistiques' },
  { id: 'stat-categorie', nom: 'Statistiques par catégorie', description: 'Par catégorie d\'ouvrage', categorie: 'statistiques' },
  { id: 'stat-classe', nom: 'Statistiques par classe', description: 'Par niveau/classe', categorie: 'statistiques' },
];

const ImprimerListesBibliotheque = () => {
  const { toast } = useToast();
  const { currentRole } = useRole();
  const { configuration } = useEtablissement();
  const { logAction } = useAuditListes();
  
  const [selectedTab, setSelectedTab] = useState('catalogue');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  
  // Filtres
  const [anneeScolaire, setAnneeScolaire] = useState('2024-2025');
  const [periode, setPeriode] = useState('');
  const [categorie, setCategorie] = useState('');
  const [etat, setEtat] = useState('');
  const [typeLecteur, setTypeLecteur] = useState('');
  const [classe, setClasse] = useState('');
  const [statut, setStatut] = useState('');

  // Contrôle d'accès
  const isAdmin = currentRole === 'admin';
  const isDocumentaliste = currentRole === 'enseignant';
  const isResponsablePedago = currentRole === 'secretaire';
  const hasFullAccess = isAdmin || isDocumentaliste || isResponsablePedago;

  const getCurrentLists = (): ListeItem[] => {
    switch (selectedTab) {
      case 'catalogue': return listesCatalogue;
      case 'emprunts': return listesEmprunts;
      case 'qrcode': return listesQRCode;
      case 'suggestions': return listesSuggestions;
      case 'acquisitions': return listesAcquisitions;
      case 'reservations': return listesReservations;
      case 'alertes': return listesAlertes;
      case 'inventaire': return listesInventaire;
      case 'cartes': return listesCartes;
      case 'statistiques': return listesStatistiques;
      default: return [];
    }
  };

  const filteredLists = getCurrentLists().filter(liste =>
    liste.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    liste.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectList = (id: string) => {
    setSelectedLists(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentIds = filteredLists.map(l => l.id);
    const allSelected = currentIds.every(id => selectedLists.includes(id));
    if (allSelected) {
      setSelectedLists(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedLists(prev => [...new Set([...prev, ...currentIds])]);
    }
  };

  const getFilters = () => ({
    anneeScolaire,
    periode,
    categorie,
    etat,
    typeLecteur,
    classe,
    statut
  });

  const handlePreview = (liste: ListeItem) => {
    logAction('generation', liste.id, liste.nom, liste.categorie, getFilters(), 1);
    toast({
      title: "Prévisualisation",
      description: `Prévisualisation de "${liste.nom}" - Fonctionnalité à venir`,
    });
  };

  const handleExportPDF = (liste: ListeItem) => {
    const doc = new jsPDF();
    const etablissementNom = (configuration as ConfigurationEtablissement)?.identite?.nom || 'Établissement';
    
    // En-tête officiel
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(etablissementNom, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Année scolaire : ${anneeScolaire}`, 105, 30, { align: 'center' });
    doc.text(`Module : Bibliothèque`, 105, 38, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(liste.nom, 105, 50, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 105, 60, { align: 'center' });

    // Exemple de données
    const mockData = [
      ['001', 'Les Misérables', 'Victor Hugo', 'Roman', 'Disponible'],
      ['002', 'Le Petit Prince', 'Antoine de Saint-Exupéry', 'Conte', 'Emprunté'],
      ['003', 'Germinal', 'Émile Zola', 'Roman', 'Disponible'],
    ];

    autoTable(doc, {
      startY: 70,
      head: [['Code', 'Titre', 'Auteur', 'Catégorie', 'Statut']],
      body: mockData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`${liste.id}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    logAction('export_pdf', liste.id, liste.nom, liste.categorie, getFilters(), 1);
    toast({
      title: "Export PDF réussi",
      description: `Liste "${liste.nom}" exportée en PDF`,
    });
  };

  const handleExportExcel = (liste: ListeItem) => {
    const mockData = [
      { Code: '001', Titre: 'Les Misérables', Auteur: 'Victor Hugo', Categorie: 'Roman', Statut: 'Disponible' },
      { Code: '002', Titre: 'Le Petit Prince', Auteur: 'Antoine de Saint-Exupéry', Categorie: 'Conte', Statut: 'Emprunté' },
      { Code: '003', Titre: 'Germinal', Auteur: 'Émile Zola', Categorie: 'Roman', Statut: 'Disponible' },
    ];

    const ws = XLSX.utils.json_to_sheet(mockData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Liste');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${liste.id}_${new Date().toISOString().split('T')[0]}.xlsx`);

    logAction('export_excel', liste.id, liste.nom, liste.categorie, getFilters(), 1);
    toast({
      title: "Export Excel réussi",
      description: `Liste "${liste.nom}" exportée en Excel`,
    });
  };

  const handlePrint = (liste: ListeItem) => {
    logAction('impression', liste.id, liste.nom, liste.categorie, getFilters(), 1);
    toast({
      title: "Impression",
      description: `Préparation de l'impression de "${liste.nom}"`,
    });
    window.print();
  };

  const handleBatchExport = (format: 'pdf' | 'excel') => {
    if (selectedLists.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une liste",
        variant: "destructive",
      });
      return;
    }

    selectedLists.forEach(listId => {
      const liste = [...listesCatalogue, ...listesEmprunts, ...listesQRCode, ...listesSuggestions, 
                     ...listesAcquisitions, ...listesReservations, ...listesAlertes, ...listesInventaire,
                     ...listesCartes, ...listesStatistiques].find(l => l.id === listId);
      if (liste) {
        if (format === 'pdf') {
          handleExportPDF(liste);
        } else {
          handleExportExcel(liste);
        }
      }
    });

    toast({
      title: "Export lot terminé",
      description: `${selectedLists.length} liste(s) exportée(s) en ${format.toUpperCase()}`,
    });
    setSelectedLists([]);
  };

  const getCategoryIcon = (tab: string) => {
    switch (tab) {
      case 'catalogue': return <BookOpen className="h-4 w-4" />;
      case 'emprunts': return <BookMarked className="h-4 w-4" />;
      case 'qrcode': return <QrCode className="h-4 w-4" />;
      case 'suggestions': return <Lightbulb className="h-4 w-4" />;
      case 'acquisitions': return <ShoppingCart className="h-4 w-4" />;
      case 'reservations': return <Calendar className="h-4 w-4" />;
      case 'alertes': return <AlertTriangle className="h-4 w-4" />;
      case 'inventaire': return <ClipboardList className="h-4 w-4" />;
      case 'cartes': return <CreditCard className="h-4 w-4" />;
      case 'statistiques': return <BarChart3 className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (!hasFullAccess) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Accès Refusé
            </CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à ce module.
              Contactez l'administrateur pour obtenir les droits d'accès.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Imprimer Listes - Bibliothèque</h1>
          <p className="text-muted-foreground mt-1">
            Générer, filtrer et imprimer toutes les listes de la bibliothèque
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            {currentRole}
          </Badge>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres Dynamiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Année Scolaire</Label>
              <Select value={anneeScolaire} onValueChange={setAnneeScolaire}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
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
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes périodes</SelectItem>
                  <SelectItem value="trimestre1">1er Trimestre</SelectItem>
                  <SelectItem value="trimestre2">2ème Trimestre</SelectItem>
                  <SelectItem value="trimestre3">3ème Trimestre</SelectItem>
                  <SelectItem value="mois">Ce mois</SelectItem>
                  <SelectItem value="semaine">Cette semaine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Catégorie d'ouvrage</Label>
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="roman">Roman</SelectItem>
                  <SelectItem value="manuel">Manuel scolaire</SelectItem>
                  <SelectItem value="encyclopedie">Encyclopédie</SelectItem>
                  <SelectItem value="bd">Bande dessinée</SelectItem>
                  <SelectItem value="scientifique">Scientifique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>État</Label>
              <Select value={etat} onValueChange={setEtat}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous états" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous états</SelectItem>
                  <SelectItem value="neuf">Neuf</SelectItem>
                  <SelectItem value="bon">Bon état</SelectItem>
                  <SelectItem value="use">Usé</SelectItem>
                  <SelectItem value="deteriore">Détérioré</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de lecteur</Label>
              <Select value={typeLecteur} onValueChange={setTypeLecteur}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="eleve">Élève</SelectItem>
                  <SelectItem value="enseignant">Enseignant</SelectItem>
                  <SelectItem value="personnel">Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={classe} onValueChange={setClasse}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes classes</SelectItem>
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
              <Label>Statut</Label>
              <Select value={statut} onValueChange={setStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="emprunte">Emprunté</SelectItem>
                  <SelectItem value="reserve">Réservé</SelectItem>
                  <SelectItem value="reforme">Réformé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions groupées */}
      {selectedLists.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedLists.length} liste(s) sélectionnée(s)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBatchExport('pdf')}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBatchExport('excel')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLists([])}>
                  Désélectionner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets des catégories */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
          <TabsTrigger value="catalogue" className="flex items-center gap-1">
            {getCategoryIcon('catalogue')} Catalogue
          </TabsTrigger>
          <TabsTrigger value="emprunts" className="flex items-center gap-1">
            {getCategoryIcon('emprunts')} Emprunts
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="flex items-center gap-1">
            {getCategoryIcon('qrcode')} QR Code
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-1">
            {getCategoryIcon('suggestions')} Suggestions
          </TabsTrigger>
          <TabsTrigger value="acquisitions" className="flex items-center gap-1">
            {getCategoryIcon('acquisitions')} Acquisitions
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-1">
            {getCategoryIcon('reservations')} Réservations
          </TabsTrigger>
          <TabsTrigger value="alertes" className="flex items-center gap-1">
            {getCategoryIcon('alertes')} Alertes
          </TabsTrigger>
          <TabsTrigger value="inventaire" className="flex items-center gap-1">
            {getCategoryIcon('inventaire')} Inventaire
          </TabsTrigger>
          <TabsTrigger value="cartes" className="flex items-center gap-1">
            {getCategoryIcon('cartes')} Cartes
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="flex items-center gap-1">
            {getCategoryIcon('statistiques')} Statistiques
          </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets */}
        {['catalogue', 'emprunts', 'qrcode', 'suggestions', 'acquisitions', 'reservations', 'alertes', 'inventaire', 'cartes', 'statistiques'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(tab)}
                    <CardTitle className="capitalize">{tab === 'qrcode' ? 'QR Code' : tab}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une liste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={filteredLists.length > 0 && filteredLists.every(l => selectedLists.includes(l.id))}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Liste</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLists.map((liste) => (
                      <TableRow key={liste.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLists.includes(liste.id)}
                            onCheckedChange={() => handleSelectList(liste.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{liste.nom}</TableCell>
                        <TableCell className="text-muted-foreground">{liste.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handlePreview(liste)} title="Prévisualiser">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleExportPDF(liste)} title="Export PDF">
                              <FileDown className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleExportExcel(liste)} title="Export Excel">
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
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Légende et informations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Traçabilité des Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Prévisualisation avant impression
            </div>
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4" /> Export PDF avec en-tête officiel
            </div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Export Excel pour traitement
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Toutes les actions sont journalisées : utilisateur, type de liste, date et heure d'impression.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprimerListesBibliotheque;
