import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Printer, 
  FileText, 
  Download, 
  Eye,
  User,
  BookOpen,
  Calendar,
  CreditCard,
  FileCheck,
  CalendarDays,
  MessageSquare,
  Filter,
  Shield,
  CheckSquare,
  Clock,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEtablissement } from '@/contexts/EtablissementContext';
import { useRole } from '@/contexts/RoleContext';
import { toast } from 'sonner';

interface ListeItem {
  id: string;
  nom: string;
  description: string;
  categorie: string;
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  utilisateur: string;
  typeUtilisateur: 'parent' | 'eleve';
  action: 'visualisation' | 'impression' | 'export';
  listeId: string;
  listeNom: string;
  eleveId: string;
  eleveNom: string;
}

const useAuditListesPortail = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const { currentUserId } = useRole();

  const logAction = (
    action: AuditEntry['action'],
    listeId: string,
    listeNom: string,
    eleveId: string,
    eleveNom: string,
    typeUtilisateur: 'parent' | 'eleve'
  ) => {
    const entry: AuditEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      utilisateur: currentUserId,
      typeUtilisateur,
      action,
      listeId,
      listeNom,
      eleveId,
      eleveNom
    };
    setEntries(prev => [entry, ...prev]);
    
    // Sauvegarder dans localStorage pour persistance
    const storedAudit = JSON.parse(localStorage.getItem('audit_listes_portail') || '[]');
    storedAudit.unshift(entry);
    localStorage.setItem('audit_listes_portail', JSON.stringify(storedAudit.slice(0, 500)));
  };

  return { entries, logAction };
};

const ImprimerListesPortail = () => {
  const { t } = useLanguage();
  const { configuration } = useEtablissement();
  const { currentRole, currentUserId } = useRole();
  const { logAction } = useAuditListesPortail();
  
  const [activeTab, setActiveTab] = useState('informations');
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [anneeScolaire, setAnneeScolaire] = useState('2024-2025');
  const [periode, setPeriode] = useState('all');
  const [selectedEleve, setSelectedEleve] = useState('eleve_1');

  // Données simulées - élèves du parent connecté
  const mesEleves = [
    { id: 'eleve_1', nom: 'Koné', prenom: 'Amadou', classe: '6ème A', matricule: 'MAT-2024-001' },
    { id: 'eleve_2', nom: 'Koné', prenom: 'Fatou', classe: '3ème B', matricule: 'MAT-2024-002' }
  ];

  const eleveActuel = mesEleves.find(e => e.id === selectedEleve) || mesEleves[0];
  // Dans ce contexte portail, on considère l'utilisateur comme parent
  const typeUtilisateur: 'parent' | 'eleve' = 'parent';

  // Définition des catégories et listes autorisées
  const categories = [
    {
      id: 'informations',
      label: 'Informations Élève',
      icon: User,
      listes: [
        { id: 'fiche_eleve', nom: 'Fiche élève', description: 'Informations générales de l\'élève' },
        { id: 'historique_classes', nom: 'Historique des classes', description: 'Liste des classes fréquentées' },
        { id: 'situation_annuelle', nom: 'Situation scolaire annuelle', description: 'État actuel de la scolarité' },
        { id: 'statut_eleve', nom: 'Statut de l\'élève', description: 'Redoublant, affecté, boursier' }
      ]
    },
    {
      id: 'notes',
      label: 'Notes & Bulletins',
      icon: BookOpen,
      listes: [
        { id: 'notes_matiere', nom: 'Notes par matière', description: 'Liste des notes par matière' },
        { id: 'notes_periode', nom: 'Notes par période', description: 'Notes par trimestre/semestre' },
        { id: 'bulletins', nom: 'Bulletins scolaires', description: 'Bulletins trimestriels/semestriels' },
        { id: 'releves_notes', nom: 'Relevés de notes', description: 'Relevés officiels de notes' },
        { id: 'historique_resultats', nom: 'Historique des résultats', description: 'Résultats des années précédentes' }
      ]
    },
    {
      id: 'absences',
      label: 'Absences & Emplois du Temps',
      icon: Calendar,
      listes: [
        { id: 'liste_absences', nom: 'Liste des absences', description: 'Absences enregistrées' },
        { id: 'liste_retards', nom: 'Liste des retards', description: 'Retards enregistrés' },
        { id: 'emploi_temps', nom: 'Emploi du temps', description: 'Emploi du temps hebdomadaire' },
        { id: 'historique_presence', nom: 'Historique de présence', description: 'Présences sur la période' }
      ]
    },
    {
      id: 'paiements',
      label: 'Paiements & Scolarité',
      icon: CreditCard,
      listes: [
        { id: 'paiements_effectues', nom: 'Paiements effectués', description: 'Liste des paiements réalisés' },
        { id: 'situation_financiere', nom: 'Situation financière', description: 'État des paiements' },
        { id: 'echeances', nom: 'Échéances à venir', description: 'Prochains paiements dus' },
        { id: 'historique_quittances', nom: 'Historique des quittances', description: 'Quittances émises' }
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileCheck,
      listes: [
        { id: 'documents_disponibles', nom: 'Documents disponibles', description: 'Liste des documents à télécharger' },
        { id: 'attestations', nom: 'Attestations scolaires', description: 'Attestations officielles' },
        { id: 'certificats', nom: 'Certificats de scolarité', description: 'Certificats officiels' },
        { id: 'convocations', nom: 'Convocations reçues', description: 'Convocations aux examens/réunions' },
        { id: 'autorisations', nom: 'Autorisations et notifications', description: 'Documents administratifs' }
      ]
    },
    {
      id: 'calendrier',
      label: 'Calendrier & Rendez-vous',
      icon: CalendarDays,
      listes: [
        { id: 'rdv_programmes', nom: 'Rendez-vous programmés', description: 'Rendez-vous à venir' },
        { id: 'reunions_parents', nom: 'Réunions parents-professeurs', description: 'Réunions planifiées' },
        { id: 'historique_rdv', nom: 'Historique des rendez-vous', description: 'Rendez-vous passés' },
        { id: 'calendrier_personnalise', nom: 'Calendrier scolaire', description: 'Calendrier personnalisé' }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      listes: [
        { id: 'messages_recus', nom: 'Messages reçus', description: 'Historique des messages' },
        { id: 'notifications', nom: 'Notifications importantes', description: 'Alertes et notifications' },
        { id: 'annonces', nom: 'Annonces officielles', description: 'Annonces de l\'établissement' }
      ]
    }
  ];

  const getCurrentCategoryListes = (): ListeItem[] => {
    const category = categories.find(c => c.id === activeTab);
    return category?.listes.map(l => ({ ...l, categorie: category.id })) || [];
  };

  const handleSelectListe = (listeId: string) => {
    setSelectedListes(prev => 
      prev.includes(listeId) 
        ? prev.filter(id => id !== listeId)
        : [...prev, listeId]
    );
  };

  const handleSelectAll = () => {
    const currentListes = getCurrentCategoryListes();
    const allIds = currentListes.map(l => l.id);
    const allSelected = allIds.every(id => selectedListes.includes(id));
    
    if (allSelected) {
      setSelectedListes(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedListes(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  const handlePreview = (liste: ListeItem) => {
    logAction('visualisation', liste.id, liste.nom, eleveActuel.id, `${eleveActuel.prenom} ${eleveActuel.nom}`, typeUtilisateur);
    toast.info(`Prévisualisation: ${liste.nom}`, {
      description: `Document pour ${eleveActuel.prenom} ${eleveActuel.nom}`
    });
  };

  const handlePrint = (liste: ListeItem) => {
    logAction('impression', liste.id, liste.nom, eleveActuel.id, `${eleveActuel.prenom} ${eleveActuel.nom}`, typeUtilisateur);
    toast.success(`Impression lancée: ${liste.nom}`, {
      description: `Document de ${eleveActuel.prenom} ${eleveActuel.nom}`
    });
  };

  const handleExportPDF = (liste: ListeItem) => {
    logAction('export', liste.id, liste.nom, eleveActuel.id, `${eleveActuel.prenom} ${eleveActuel.nom}`, typeUtilisateur);
    toast.success(`Export PDF: ${liste.nom}`, {
      description: `Document de ${eleveActuel.prenom} ${eleveActuel.nom} exporté`
    });
  };

  const handleBatchPrint = () => {
    if (selectedListes.length === 0) {
      toast.warning('Aucune liste sélectionnée');
      return;
    }
    
    selectedListes.forEach(listeId => {
      const allListes = categories.flatMap(c => c.listes);
      const liste = allListes.find(l => l.id === listeId);
      if (liste) {
        logAction('impression', liste.id, liste.nom, eleveActuel.id, `${eleveActuel.prenom} ${eleveActuel.nom}`, typeUtilisateur);
      }
    });
    
    toast.success(`${selectedListes.length} document(s) envoyé(s) à l'impression`, {
      description: `Documents de ${eleveActuel.prenom} ${eleveActuel.nom}`
    });
    setSelectedListes([]);
  };

  const renderListeCard = (liste: ListeItem) => {
    const isSelected = selectedListes.includes(liste.id);
    
    return (
      <Card key={liste.id} className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleSelectListe(liste.id)}
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{liste.nom}</h4>
                <p className="text-xs text-muted-foreground mt-1">{liste.description}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => handlePreview(liste)} title="Prévisualiser">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleExportPDF(liste)} title="Exporter PDF">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handlePrint(liste)} title="Imprimer">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Mes Documents à Imprimer
          </h1>
          <p className="text-muted-foreground mt-1">
            Générez et imprimez vos documents personnels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Accès sécurisé
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Données personnelles uniquement
          </Badge>
        </div>
      </div>

      {/* Filtres sécurisés */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Sélection élève (pour parents avec plusieurs enfants) */}
            {typeUtilisateur === 'parent' && mesEleves.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Élève</label>
                <Select value={selectedEleve} onValueChange={setSelectedEleve}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mesEleves.map(eleve => (
                      <SelectItem key={eleve.id} value={eleve.id}>
                        {eleve.prenom} {eleve.nom} - {eleve.classe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Année scolaire</label>
              <Select value={anneeScolaire} onValueChange={setAnneeScolaire}>
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
              <label className="text-sm font-medium">Période</label>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toute l'année</SelectItem>
                  <SelectItem value="T1">Trimestre 1</SelectItem>
                  <SelectItem value="T2">Trimestre 2</SelectItem>
                  <SelectItem value="T3">Trimestre 3</SelectItem>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info élève sélectionné */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">{eleveActuel.prenom} {eleveActuel.nom}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span>Classe: {eleveActuel.classe}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Matricule: {eleveActuel.matricule}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions groupées */}
      {selectedListes.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedListes.length} document(s) sélectionné(s)</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedListes([])}>
                  Désélectionner tout
                </Button>
                <Button size="sm" onClick={handleBatchPrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer la sélection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets des catégories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-auto min-w-full">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </ScrollArea>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.label}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tout sélectionner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {category.listes.map(liste => 
                    renderListeCard({ ...liste, categorie: category.id })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Pied de page sécurité */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Confidentialité garantie</p>
              <p className="text-muted-foreground mt-1">
                Vous n'avez accès qu'aux données de {typeUtilisateur === 'parent' ? 'vos enfants' : 'votre propre dossier'}.
                Toutes les actions sont enregistrées pour votre sécurité.
                L'établissement ne partage aucune donnée personnelle avec des tiers.
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Dernière connexion: {new Date().toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprimerListesPortail;
