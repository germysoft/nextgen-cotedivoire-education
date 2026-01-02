import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Printer, FileText, Download, Eye, Search, Filter, UtensilsCrossed, Bus, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { useEtablissement } from '@/contexts/EtablissementContext';
import { useAuditListes } from '@/hooks/useAuditListes';
import type { ConfigurationEtablissement } from '@/types/etablissement';

interface ListeItem {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  nombreElements?: number;
}

const ImprimerListesServices = () => {
  const { toast } = useToast();
  const { currentRole } = useRole();
  const { configuration } = useEtablissement() as { configuration: ConfigurationEtablissement | null };
  const { logAction } = useAuditListes();
  
  const [activeTab, setActiveTab] = useState('cantine');
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [filtres, setFiltres] = useState({
    anneeScolaire: '2024-2025',
    service: 'tous',
    classe: 'toutes',
    niveau: 'tous',
    sexe: 'tous',
    statutPaiement: 'tous',
    periode: ''
  });

  // Vérification des permissions
  const hasFullAccess = ['admin', 'directeur', 'administration'].includes(currentRole);
  const isGestionnaire = currentRole === 'secretaire';
  const isComptable = currentRole === 'comptable';

  // Listes Cantine
  const listesCantine: ListeItem[] = [
    { id: 'cantine-inscrits', nom: 'Liste des élèves inscrits à la cantine', description: 'Tous les élèves inscrits au service cantine', categorie: 'cantine', nombreElements: 245 },
    { id: 'cantine-classe', nom: 'Liste par classe / niveau', description: 'Élèves de la cantine regroupés par classe', categorie: 'cantine', nombreElements: 245 },
    { id: 'cantine-jour-paiement', nom: 'Liste des élèves à jour de paiement', description: 'Élèves ayant réglé leurs frais de cantine', categorie: 'cantine', nombreElements: 198 },
    { id: 'cantine-impayes', nom: 'Liste des élèves en impayés', description: 'Élèves avec arriérés de paiement cantine', categorie: 'cantine', nombreElements: 47 },
    { id: 'cantine-regime', nom: 'Liste par régime alimentaire', description: 'Élèves selon leur régime (végétarien, allergies, etc.)', categorie: 'cantine', nombreElements: 32 },
    { id: 'cantine-presence', nom: 'Liste de présence journalière', description: 'Feuille de présence quotidienne à la cantine', categorie: 'cantine', nombreElements: 180 },
    { id: 'cantine-historique', nom: 'Historique des inscriptions cantine', description: 'Historique complet des inscriptions au service', categorie: 'cantine', nombreElements: 520 }
  ];

  // Listes Transport
  const listesTransport: ListeItem[] = [
    { id: 'transport-inscrits', nom: 'Liste des élèves utilisant le transport', description: 'Tous les élèves inscrits au transport scolaire', categorie: 'transport', nombreElements: 156 },
    { id: 'transport-ligne', nom: 'Liste par ligne / circuit', description: 'Élèves regroupés par ligne de transport', categorie: 'transport', nombreElements: 156 },
    { id: 'transport-arret', nom: 'Liste par arrêt', description: 'Élèves par point d\'arrêt', categorie: 'transport', nombreElements: 156 },
    { id: 'transport-vehicule', nom: 'Liste par véhicule', description: 'Répartition des élèves par véhicule', categorie: 'transport', nombreElements: 156 },
    { id: 'transport-chauffeur', nom: 'Liste par chauffeur', description: 'Élèves assignés à chaque chauffeur', categorie: 'transport', nombreElements: 156 },
    { id: 'transport-paiement', nom: 'Liste des élèves à jour de paiement', description: 'Élèves ayant réglé le transport', categorie: 'transport', nombreElements: 134 },
    { id: 'transport-ramassage', nom: 'Liste par point de ramassage', description: 'Élèves par lieu de ramassage', categorie: 'transport', nombreElements: 156 }
  ];

  // Listes Internat
  const listesInternat: ListeItem[] = [
    { id: 'internat-internes', nom: 'Liste des élèves internes', description: 'Tous les élèves en internat', categorie: 'internat', nombreElements: 89 },
    { id: 'internat-dortoir', nom: 'Liste par dortoir / chambre', description: 'Répartition des internes par dortoir', categorie: 'internat', nombreElements: 89 },
    { id: 'internat-sexe', nom: 'Liste par sexe', description: 'Internes regroupés par sexe', categorie: 'internat', nombreElements: 89 },
    { id: 'internat-niveau', nom: 'Liste par niveau / classe', description: 'Internes par niveau scolaire', categorie: 'internat', nombreElements: 89 },
    { id: 'internat-paiement', nom: 'Liste des élèves à jour de paiement', description: 'Internes ayant réglé leurs frais', categorie: 'internat', nombreElements: 72 },
    { id: 'internat-absences', nom: 'Liste des absences / sorties autorisées', description: 'Suivi des sorties et absences', categorie: 'internat', nombreElements: 23 },
    { id: 'internat-responsables', nom: 'Liste des responsables d\'internat', description: 'Personnel encadrant l\'internat', categorie: 'internat', nombreElements: 8 }
  ];

  const getListesByTab = () => {
    switch (activeTab) {
      case 'cantine':
        return listesCantine;
      case 'transport':
        return listesTransport;
      case 'internat':
        return listesInternat;
      default:
        return [];
    }
  };

  const filteredListes = getListesByTab().filter(liste => {
    const matchSearch = liste.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       liste.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par rôle
    if (isComptable && !liste.id.includes('paiement') && !liste.id.includes('impayes')) {
      return false;
    }
    
    return matchSearch;
  });

  const handleSelectListe = (listeId: string) => {
    setSelectedListes(prev => 
      prev.includes(listeId) 
        ? prev.filter(id => id !== listeId)
        : [...prev, listeId]
    );
  };

  const handleSelectAll = () => {
    const currentListes = filteredListes.map(l => l.id);
    if (selectedListes.length === currentListes.length) {
      setSelectedListes([]);
    } else {
      setSelectedListes(currentListes);
    }
  };

  const handlePreview = (liste: ListeItem) => {
    logAction('generation', liste.id, liste.nom, 'services', filtres, liste.nombreElements || 0);
    toast({
      title: "Prévisualisation",
      description: `Aperçu de : ${liste.nom}`
    });
  };

  const handlePrint = (liste: ListeItem) => {
    logAction('impression', liste.id, liste.nom, 'services', filtres, liste.nombreElements || 0);
    toast({
      title: "Impression lancée",
      description: `Impression de : ${liste.nom}`
    });
    window.print();
  };

  const handleExportPDF = (liste: ListeItem) => {
    logAction('export_pdf', liste.id, liste.nom, 'services', filtres, liste.nombreElements || 0);
    toast({
      title: "Export PDF",
      description: `Export PDF de : ${liste.nom}`
    });
  };

  const handleExportExcel = (liste: ListeItem) => {
    logAction('export_excel', liste.id, liste.nom, 'services', filtres, liste.nombreElements || 0);
    toast({
      title: "Export Excel",
      description: `Export Excel de : ${liste.nom}`
    });
  };

  const handleBatchPrint = () => {
    if (selectedListes.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une liste",
        variant: "destructive"
      });
      return;
    }
    
    selectedListes.forEach(listeId => {
      const liste = [...listesCantine, ...listesTransport, ...listesInternat].find(l => l.id === listeId);
      if (liste) {
        logAction('impression', liste.id, liste.nom, 'services', filtres, liste.nombreElements || 0);
      }
    });

    toast({
      title: "Impression par lot",
      description: `${selectedListes.length} liste(s) en cours d'impression`
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'cantine': return <UtensilsCrossed className="h-4 w-4" />;
      case 'transport': return <Bus className="h-4 w-4" />;
      case 'internat': return <Building2 className="h-4 w-4" />;
      default: return null;
    }
  };

  const getServiceLabel = () => {
    switch (activeTab) {
      case 'cantine': return 'Cantine';
      case 'transport': return 'Transport Scolaire';
      case 'internat': return 'Internat';
      default: return 'Services';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Imprimer Listes - Services</h1>
          <p className="text-muted-foreground mt-1">
            Générez et imprimez les listes des services scolaires
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          {selectedListes.length > 0 && (
            <Button onClick={handleBatchPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer ({selectedListes.length})
            </Button>
          )}
        </div>
      </div>

      {/* Informations établissement */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Établissement:</span>{' '}
              <span className="font-medium">{configuration?.identite?.nom || 'Non configuré'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Année scolaire:</span>{' '}
              <span className="font-medium">{filtres.anneeScolaire}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Service:</span>{' '}
              <Badge variant="outline">{getServiceLabel()}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Rôle:</span>{' '}
              <Badge variant="secondary">{currentRole}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres dynamiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Année scolaire</Label>
                <Select value={filtres.anneeScolaire} onValueChange={(v) => setFiltres({...filtres, anneeScolaire: v})}>
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
                <Label>Classe</Label>
                <Select value={filtres.classe} onValueChange={(v) => setFiltres({...filtres, classe: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les classes</SelectItem>
                    <SelectItem value="6eme-a">6ème A</SelectItem>
                    <SelectItem value="6eme-b">6ème B</SelectItem>
                    <SelectItem value="5eme-a">5ème A</SelectItem>
                    <SelectItem value="5eme-b">5ème B</SelectItem>
                    <SelectItem value="4eme-a">4ème A</SelectItem>
                    <SelectItem value="3eme-a">3ème A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select value={filtres.niveau} onValueChange={(v) => setFiltres({...filtres, niveau: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les niveaux" />
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

              <div className="space-y-2">
                <Label>Sexe</Label>
                <Select value={filtres.sexe} onValueChange={(v) => setFiltres({...filtres, sexe: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous</SelectItem>
                    <SelectItem value="masculin">Masculin</SelectItem>
                    <SelectItem value="feminin">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Statut de paiement</Label>
                <Select value={filtres.statutPaiement} onValueChange={(v) => setFiltres({...filtres, statutPaiement: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="a-jour">À jour</SelectItem>
                    <SelectItem value="impayes">Impayés</SelectItem>
                    <SelectItem value="partiel">Partiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Période / Date</Label>
                <Input 
                  type="date" 
                  value={filtres.periode}
                  onChange={(e) => setFiltres({...filtres, periode: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets par service */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cantine" className="flex items-center gap-2">
            {getTabIcon('cantine')}
            <span className="hidden sm:inline">Cantine</span>
            <Badge variant="secondary" className="ml-1">{listesCantine.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2">
            {getTabIcon('transport')}
            <span className="hidden sm:inline">Transport</span>
            <Badge variant="secondary" className="ml-1">{listesTransport.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="internat" className="flex items-center gap-2">
            {getTabIcon('internat')}
            <span className="hidden sm:inline">Internat</span>
            <Badge variant="secondary" className="ml-1">{listesInternat.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Barre de recherche et sélection */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une liste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleSelectAll}>
            {selectedListes.length === filteredListes.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Button>
        </div>

        {/* Contenu des onglets */}
        {['cantine', 'transport', 'internat'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid gap-4">
              {filteredListes.map(liste => (
                <Card key={liste.id} className={`transition-all ${selectedListes.includes(liste.id) ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedListes.includes(liste.id)}
                          onCheckedChange={() => handleSelectListe(liste.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{liste.nom}</h3>
                            {liste.id.includes('paiement') && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {liste.id.includes('impayes') && (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{liste.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {liste.nombreElements} éléments
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-7 md:ml-0">
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(liste)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePrint(liste)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleExportPDF(liste)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        {(hasFullAccess || isGestionnaire) && (
                          <Button variant="ghost" size="sm" onClick={() => handleExportExcel(liste)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredListes.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Aucune liste trouvée</h3>
                    <p className="text-muted-foreground">
                      {isComptable 
                        ? "Vous avez accès uniquement aux listes financières"
                        : "Essayez de modifier vos critères de recherche"
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Légende */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>Prévisualiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4 text-muted-foreground" />
              <span>Imprimer</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Export PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Export Excel</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>À jour</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>Impayés</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprimerListesServices;
