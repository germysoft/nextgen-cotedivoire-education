import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Printer, 
  FileText, 
  Download, 
  Eye, 
  RefreshCw, 
  Database, 
  UserCheck, 
  FileCheck, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useEtablissement } from '@/contexts/EtablissementContext';
import { useAuditListes } from '@/hooks/useAuditListes';
import { toast } from 'sonner';
import { ConfigurationEtablissement } from '@/types/etablissement';

interface ListeType {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  formats: string[];
}

const ImprimerListesMENA = () => {
  const { currentRole } = useRole();
  const { configuration } = useEtablissement() as { configuration: ConfigurationEtablissement | null };
  const { logAction } = useAuditListes();
  
  const [activeTab, setActiveTab] = useState('synchronisation');
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    anneeScolaire: '2024-2025',
    cycle: 'tous',
    niveau: 'tous',
    classe: 'tous',
    statut: 'tous',
    periode: 'tous'
  });

  // Vérification des droits d'accès stricts
  const hasAccess = ['admin', 'directeur'].includes(currentRole);
  const isResponsableMENA = currentRole === 'admin';

  const categories = [
    { id: 'synchronisation', label: 'Synchronisation', icon: RefreshCw },
    { id: 'fichier-national', label: 'Fichier National', icon: Database },
    { id: 'preinscriptions', label: 'Préinscriptions', icon: UserCheck },
    { id: 'decisions', label: 'Décisions & Bilans', icon: FileCheck },
    { id: 'conformite', label: 'Contrôle & Conformité', icon: Shield }
  ];

  const listes: Record<string, ListeType[]> = {
    'synchronisation': [
      { id: 'sync-donnees', nom: 'Données synchronisées', description: 'Liste complète des données transmises au MENA', categorie: 'synchronisation', formats: ['pdf', 'excel'] },
      { id: 'sync-reussies', nom: 'Synchronisations réussies', description: 'Historique des transmissions validées', categorie: 'synchronisation', formats: ['pdf', 'excel'] },
      { id: 'sync-echouees', nom: 'Synchronisations échouées', description: 'Liste des erreurs de transmission', categorie: 'synchronisation', formats: ['pdf', 'excel'] },
      { id: 'sync-historique', nom: 'Historique par période', description: 'Chronologie des synchronisations', categorie: 'synchronisation', formats: ['pdf', 'excel'] },
      { id: 'sync-anomalies', nom: 'Anomalies de synchronisation', description: 'Données nécessitant correction', categorie: 'synchronisation', formats: ['pdf', 'excel'] }
    ],
    'fichier-national': [
      { id: 'fn-transmis', nom: 'Élèves transmis', description: 'Liste des élèves enregistrés au fichier national', categorie: 'fichier-national', formats: ['pdf', 'excel'] },
      { id: 'fn-non-transmis', nom: 'Élèves non transmis', description: 'Élèves en attente de transmission', categorie: 'fichier-national', formats: ['pdf', 'excel'] },
      { id: 'fn-doublons', nom: 'Doublons détectés', description: 'Enregistrements en double identifiés', categorie: 'fichier-national', formats: ['pdf', 'excel'] },
      { id: 'fn-incoherences', nom: 'Incohérences de données', description: 'Données non conformes aux normes', categorie: 'fichier-national', formats: ['pdf', 'excel'] },
      { id: 'fn-etablissement', nom: 'Par établissement/année', description: 'Récapitulatif par structure', categorie: 'fichier-national', formats: ['pdf', 'excel'] }
    ],
    'preinscriptions': [
      { id: 'preinsc-liste', nom: 'Élèves préinscrits', description: 'Liste complète des préinscriptions', categorie: 'preinscriptions', formats: ['pdf', 'excel'] },
      { id: 'preinsc-validees', nom: 'Préinscriptions validées', description: 'Dossiers acceptés et confirmés', categorie: 'preinscriptions', formats: ['pdf', 'excel'] },
      { id: 'preinsc-rejetees', nom: 'Préinscriptions rejetées', description: 'Dossiers refusés avec motifs', categorie: 'preinscriptions', formats: ['pdf', 'excel'] },
      { id: 'preinsc-niveau', nom: 'Par niveau/cycle', description: 'Répartition par niveau scolaire', categorie: 'preinscriptions', formats: ['pdf', 'excel'] },
      { id: 'preinsc-historique', nom: 'Historique préinscriptions', description: 'Évolution des préinscriptions', categorie: 'preinscriptions', formats: ['pdf', 'excel'] }
    ],
    'decisions': [
      { id: 'dec-affectation', nom: 'Décisions d\'affectation', description: 'Liste des affectations officielles', categorie: 'decisions', formats: ['pdf', 'excel'] },
      { id: 'dec-niveau', nom: 'Décisions par niveau', description: 'Affectations classées par niveau', categorie: 'decisions', formats: ['pdf', 'excel'] },
      { id: 'dec-affectes', nom: 'Élèves affectés/non affectés', description: 'Statut d\'affectation des élèves', categorie: 'decisions', formats: ['pdf', 'excel'] },
      { id: 'dec-bilans', nom: 'Bilans statistiques', description: 'Effectifs et taux par catégorie', categorie: 'decisions', formats: ['pdf', 'excel'] },
      { id: 'dec-rapports', nom: 'Rapports globaux', description: 'Synthèse annuelle complète', categorie: 'decisions', formats: ['pdf'] }
    ],
    'conformite': [
      { id: 'conf-conformes', nom: 'Données conformes', description: 'Enregistrements validés', categorie: 'conformite', formats: ['pdf', 'excel'] },
      { id: 'conf-non-conformes', nom: 'Données non conformes', description: 'Enregistrements à corriger', categorie: 'conformite', formats: ['pdf', 'excel'] },
      { id: 'conf-corrections', nom: 'Corrections effectuées', description: 'Historique des rectifications', categorie: 'conformite', formats: ['pdf', 'excel'] },
      { id: 'conf-validations', nom: 'Validations administratives', description: 'Journal des approbations', categorie: 'conformite', formats: ['pdf', 'excel'] }
    ]
  };

  // Données mock pour prévisualisation
  const mockData: Record<string, any[]> = {
    'sync-donnees': [
      { id: 1, type: 'Élèves', quantite: 450, dateSync: '2024-01-15', statut: 'validé' },
      { id: 2, type: 'Notes', quantite: 3200, dateSync: '2024-01-15', statut: 'validé' },
      { id: 3, type: 'Absences', quantite: 890, dateSync: '2024-01-14', statut: 'validé' }
    ],
    'sync-echouees': [
      { id: 1, type: 'Photos', erreur: 'Format invalide', date: '2024-01-14', tentatives: 3 },
      { id: 2, type: 'Documents', erreur: 'Connexion timeout', date: '2024-01-13', tentatives: 2 }
    ],
    'fn-transmis': [
      { matricule: 'MAT001', nom: 'Diallo', prenom: 'Amadou', classe: '6ème A', dateTransmission: '2024-01-10', statut: 'confirmé' },
      { matricule: 'MAT002', nom: 'Koné', prenom: 'Fatou', classe: '5ème B', dateTransmission: '2024-01-10', statut: 'confirmé' }
    ],
    'fn-doublons': [
      { matricule1: 'MAT003', matricule2: 'MAT045', nom: 'Traoré Ibrahim', probabilite: '95%', action: 'À vérifier' }
    ],
    'preinsc-liste': [
      { numero: 'PRE001', nom: 'Camara', prenom: 'Sekou', niveau: 'CP1', datePreinsc: '2024-02-01', statut: 'en_attente' },
      { numero: 'PRE002', nom: 'Bamba', prenom: 'Awa', niveau: 'CE1', datePreinsc: '2024-02-02', statut: 'validé' }
    ],
    'dec-affectation': [
      { decision: 'DEC-2024-001', eleve: 'Coulibaly Moussa', origine: 'CM2', destination: '6ème', etablissement: 'Lycée Moderne', date: '2024-07-15' }
    ],
    'conf-non-conformes': [
      { id: 1, champ: 'Date de naissance', valeur: '30/02/2010', erreur: 'Date invalide', correction: 'Requise' },
      { id: 2, champ: 'Matricule', valeur: 'ABC', erreur: 'Format incorrect', correction: 'Requise' }
    ]
  };

  const handleSelectListe = (listeId: string) => {
    setSelectedListes(prev => 
      prev.includes(listeId) 
        ? prev.filter(id => id !== listeId)
        : [...prev, listeId]
    );
  };

  const handleSelectAll = () => {
    const currentListes = listes[activeTab] || [];
    if (selectedListes.length === currentListes.length) {
      setSelectedListes([]);
    } else {
      setSelectedListes(currentListes.map(l => l.id));
    }
  };

  const handlePreview = (liste: ListeType) => {
    logAction('generation', liste.id, liste.nom, liste.categorie, filters, 0);
    toast.info(`Prévisualisation: ${liste.nom}`);
  };

  const handlePrint = (liste: ListeType) => {
    logAction('impression', liste.id, liste.nom, liste.categorie, filters, 0);
    toast.success(`Impression lancée: ${liste.nom}`);
  };

  const handleExport = (liste: ListeType, format: string) => {
    const action = format === 'pdf' ? 'export_pdf' : 'export_excel';
    logAction(action, liste.id, liste.nom, liste.categorie, filters, 0);
    toast.success(`Export ${format.toUpperCase()} généré: ${liste.nom}`);
  };

  const handleBatchPrint = () => {
    if (selectedListes.length === 0) {
      toast.error('Veuillez sélectionner au moins une liste');
      return;
    }
    
    selectedListes.forEach(listeId => {
      const liste = Object.values(listes).flat().find(l => l.id === listeId);
      if (liste) {
        logAction('impression', liste.id, liste.nom, liste.categorie, filters, 0);
      }
    });
    
    toast.success(`${selectedListes.length} liste(s) envoyée(s) à l'impression`);
    setSelectedListes([]);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'validé':
      case 'confirmé':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Validé</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'rejeté':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Accès Restreint</h3>
            <p className="text-red-600">
              Ce module est réservé aux administrateurs et responsables MENA/DESPS.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderPreviewData = (listeId: string) => {
    const data = mockData[listeId];
    if (!data) return <p className="text-muted-foreground text-center py-4">Données de prévisualisation non disponibles</p>;

    if (listeId === 'sync-donnees') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Date Sync</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.quantite}</TableCell>
                <TableCell>{item.dateSync}</TableCell>
                <TableCell>{getStatutBadge(item.statut)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (listeId === 'sync-echouees') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Erreur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tentatives</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell className="text-red-600">{item.erreur}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.tentatives}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (listeId === 'fn-transmis') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matricule</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.matricule}>
                <TableCell className="font-mono">{item.matricule}</TableCell>
                <TableCell className="font-medium">{item.nom}</TableCell>
                <TableCell>{item.prenom}</TableCell>
                <TableCell>{item.classe}</TableCell>
                <TableCell>{item.dateTransmission}</TableCell>
                <TableCell>{getStatutBadge(item.statut)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (listeId === 'fn-doublons') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matricule 1</TableHead>
              <TableHead>Matricule 2</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Probabilité</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="font-mono">{item.matricule1}</TableCell>
                <TableCell className="font-mono">{item.matricule2}</TableCell>
                <TableCell className="font-medium">{item.nom}</TableCell>
                <TableCell><Badge variant="outline">{item.probabilite}</Badge></TableCell>
                <TableCell><Badge className="bg-yellow-100 text-yellow-800">{item.action}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (listeId === 'preinsc-liste') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Préinscription</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.numero}>
                <TableCell className="font-mono">{item.numero}</TableCell>
                <TableCell className="font-medium">{item.nom}</TableCell>
                <TableCell>{item.prenom}</TableCell>
                <TableCell>{item.niveau}</TableCell>
                <TableCell>{item.datePreinsc}</TableCell>
                <TableCell>{getStatutBadge(item.statut)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (listeId === 'dec-affectation') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Décision</TableHead>
              <TableHead>Élève</TableHead>
              <TableHead>Origine</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Établissement</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.decision}>
                <TableCell className="font-mono">{item.decision}</TableCell>
                <TableCell className="font-medium">{item.eleve}</TableCell>
                <TableCell>{item.origine}</TableCell>
                <TableCell>{item.destination}</TableCell>
                <TableCell>{item.etablissement}</TableCell>
                <TableCell>{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (listeId === 'conf-non-conformes') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Champ</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Erreur</TableHead>
              <TableHead>Correction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.champ}</TableCell>
                <TableCell className="font-mono text-red-600">{item.valeur}</TableCell>
                <TableCell>{item.erreur}</TableCell>
                <TableCell><Badge className="bg-orange-100 text-orange-800">{item.correction}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    return <p className="text-muted-foreground text-center py-4">Sélectionnez une liste pour prévisualiser</p>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Imprimer Listes – MENA / DESPS</h1>
          <p className="text-muted-foreground">
            Génération des listes officielles et réglementaires
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50">
            <Shield className="h-3 w-3 mr-1" />
            {isResponsableMENA ? 'Responsable MENA' : 'Administrateur'}
          </Badge>
        </div>
      </div>

      {/* Avertissement sécurité */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Documents officiels - Accès restreint</p>
            <p className="text-sm text-amber-700">
              Ces listes sont destinées aux autorités éducatives. Toutes les actions sont journalisées et archivées.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              <label className="text-sm font-medium mb-1 block">Cycle</label>
              <Select value={filters.cycle} onValueChange={(v) => setFilters({...filters, cycle: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les cycles</SelectItem>
                  <SelectItem value="primaire">Primaire</SelectItem>
                  <SelectItem value="secondaire1">Secondaire 1er cycle</SelectItem>
                  <SelectItem value="secondaire2">Secondaire 2nd cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Niveau</label>
              <Select value={filters.niveau} onValueChange={(v) => setFilters({...filters, niveau: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les niveaux</SelectItem>
                  <SelectItem value="6eme">6ème</SelectItem>
                  <SelectItem value="5eme">5ème</SelectItem>
                  <SelectItem value="4eme">4ème</SelectItem>
                  <SelectItem value="3eme">3ème</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Classe</label>
              <Select value={filters.classe} onValueChange={(v) => setFilters({...filters, classe: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes les classes</SelectItem>
                  <SelectItem value="6A">6ème A</SelectItem>
                  <SelectItem value="6B">6ème B</SelectItem>
                  <SelectItem value="5A">5ème A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Statut</label>
              <Select value={filters.statut} onValueChange={(v) => setFilters({...filters, statut: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="rejete">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Période</label>
              <Select value={filters.periode} onValueChange={(v) => setFilters({...filters, periode: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes périodes</SelectItem>
                  <SelectItem value="trimestre1">Trimestre 1</SelectItem>
                  <SelectItem value="trimestre2">Trimestre 2</SelectItem>
                  <SelectItem value="trimestre3">Trimestre 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions groupées */}
      {selectedListes.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="font-medium">
              {selectedListes.length} liste(s) sélectionnée(s)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedListes([])}>
                Désélectionner
              </Button>
              <Button onClick={handleBatchPrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer la sélection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
              <cat.icon className="h-4 w-4" />
              <span className="hidden md:inline">{cat.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <cat.icon className="h-5 w-5" />
                    {cat.label}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    <Checkbox 
                      checked={selectedListes.length === (listes[cat.id]?.length || 0) && selectedListes.length > 0}
                      className="mr-2"
                    />
                    Tout sélectionner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {listes[cat.id]?.map(liste => (
                    <div 
                      key={liste.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedListes.includes(liste.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedListes.includes(liste.id)}
                            onCheckedChange={() => handleSelectListe(liste.id)}
                          />
                          <div>
                            <h4 className="font-medium">{liste.nom}</h4>
                            <p className="text-sm text-muted-foreground">{liste.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handlePreview(liste)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handlePrint(liste)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          {liste.formats.includes('pdf') && (
                            <Button variant="ghost" size="sm" onClick={() => handleExport(liste, 'pdf')}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {liste.formats.includes('excel') && (
                            <Button variant="ghost" size="sm" onClick={() => handleExport(liste, 'excel')}>
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prévisualisation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prévisualisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-4">
                  {/* En-tête officiel */}
                  <div className="border-b pb-4 mb-4 text-center">
                    <div className="flex justify-center items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="font-bold">{configuration?.identite?.nom || 'Établissement'}</h3>
                    <p className="text-sm text-muted-foreground">Année scolaire: {filters.anneeScolaire}</p>
                    <p className="text-sm font-medium text-primary">Module MENA / DESPS</p>
                  </div>
                  
                  {/* Données */}
                  <div className="min-h-[200px]">
                    {selectedListes.length === 1 ? (
                      renderPreviewData(selectedListes[0])
                    ) : selectedListes.length > 1 ? (
                      <p className="text-center text-muted-foreground py-8">
                        {selectedListes.length} listes sélectionnées - Cliquez sur "Imprimer la sélection"
                      </p>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Sélectionnez une liste pour prévisualiser son contenu
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Informations de sécurité */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Toutes les actions sont journalisées et archivées pour conformité réglementaire.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprimerListesMENA;
