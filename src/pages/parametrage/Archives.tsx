import { useState } from 'react';
import { 
  Archive, Database, Calendar, Users, GraduationCap, Building2, 
  Download, Eye, Lock, Unlock, Plus, FileText, Search, History,
  AlertTriangle, CheckCircle, Clock, HardDrive, ShieldAlert, Printer, ScrollText, FolderArchive
} from 'lucide-react';
import {
  generateArchiveBulletinPDF,
  generateArchiveCertificatPDF,
  generateArchiveAttestationPDF,
  generateArchiveRelevePDF,
  generateArchiveZIP,
  type ArchiveEleve,
  type ArchiveBulletinData
} from '@/components/archives/ArchivePDFGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useArchives } from '@/contexts/ArchivesContext';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { useRole } from '@/contexts/RoleContext';
import { roleLabels } from '@/types/roles';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function ArchivesPage() {
  const { 
    anneesScolaires, 
    anneeActive, 
    anneeConsultee,
    isArchiveMode,
    journalAcces,
    connecterAnnee, 
    deconnecterArchive,
    archiverAnnee,
    creerNouvelleAnnee 
  } = useArchives();
  const { toast } = useToast();
  const { canAccess } = usePermissions();
  const { currentRole } = useRole();
  const navigate = useNavigate();
  
  const hasArchiveAccess = canAccess('archives');
  
  const [searchEleve, setSearchEleve] = useState('');
  const [nouvelleAnnee, setNouvelleAnnee] = useState({
    libelle: '',
    dateDebut: '',
    dateFin: '',
  });
  const [showNewYearDialog, setShowNewYearDialog] = useState(false);

  // Afficher un message d'accès refusé si l'utilisateur n'a pas la permission
  if (!hasArchiveAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Accès Refusé</CardTitle>
            <CardDescription className="text-base mt-2">
              Vous n'avez pas les droits nécessaires pour accéder aux archives.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Restriction d'accès</AlertTitle>
              <AlertDescription>
                L'accès aux archives est réservé aux rôles suivants :
                <ul className="mt-2 list-disc list-inside">
                  <li><strong>Administrateur</strong></li>
                  <li><strong>Directeur</strong></li>
                </ul>
              </AlertDescription>
            </Alert>
            <div className="text-center text-sm text-muted-foreground">
              Votre rôle actuel : <Badge variant="outline">{roleLabels[currentRole]}</Badge>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleConnexion = (anneeId: string) => {
    const annee = anneesScolaires.find(a => a.id === anneeId);
    if (annee) {
      connecterAnnee(anneeId);
      toast({
        title: "Connexion réussie",
        description: `Vous êtes maintenant connecté à l'année scolaire ${annee.libelle} en mode lecture seule.`,
      });
    }
  };

  const handleDeconnexion = () => {
    deconnecterArchive();
    toast({
      title: "Retour à l'année en cours",
      description: `Vous êtes reconnecté à l'année scolaire ${anneeActive?.libelle}.`,
    });
  };

  const handleArchiver = (anneeId: string) => {
    archiverAnnee(anneeId);
    toast({
      title: "Archivage réussi",
      description: "L'année scolaire a été archivée avec succès.",
    });
  };

  const handleCreerAnnee = () => {
    if (nouvelleAnnee.libelle && nouvelleAnnee.dateDebut && nouvelleAnnee.dateFin) {
      creerNouvelleAnnee(nouvelleAnnee.libelle, nouvelleAnnee.dateDebut, nouvelleAnnee.dateFin);
      toast({
        title: "Nouvelle année créée",
        description: `L'année scolaire ${nouvelleAnnee.libelle} a été créée et est maintenant active.`,
      });
      setShowNewYearDialog(false);
      setNouvelleAnnee({ libelle: '', dateDebut: '', dateFin: '' });
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'archivee':
        return <Badge variant="secondary">Archivée</Badge>;
      case 'en_cours_archivage':
        return <Badge className="bg-amber-500 hover:bg-amber-600">En cours d'archivage</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'connexion':
        return <Lock className="h-4 w-4 text-blue-500" />;
      case 'consultation':
        return <Eye className="h-4 w-4 text-green-500" />;
      case 'export':
        return <Download className="h-4 w-4 text-purple-500" />;
      case 'impression':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  // Mock élèves pour la recherche en mode archive
  const mockElevesArchive = [
    { id: '1', matricule: 'MAT-2023-001', nom: 'KONE', prenom: 'Amadou', classe: '6ème A', annee: '2023-2024', dateNaissance: '15/03/2012', lieuNaissance: 'Abidjan' },
    { id: '2', matricule: 'MAT-2023-002', nom: 'DIALLO', prenom: 'Fatou', classe: 'CM2 B', annee: '2023-2024', dateNaissance: '22/07/2013', lieuNaissance: 'Bouaké' },
    { id: '3', matricule: 'MAT-2022-015', nom: 'TRAORE', prenom: 'Ibrahim', classe: '5ème C', annee: '2022-2023', dateNaissance: '10/01/2011', lieuNaissance: 'Yamoussoukro' },
  ];

  // Mock données bulletin pour génération PDF
  const getMockBulletinData = (eleve: typeof mockElevesArchive[0]) => ({
    eleve,
    trimestre: 1,
    matieres: [
      { nom: 'Français', coefficient: 4, note: 14.5, moyenneClasse: 12.3, appreciation: 'Bon travail' },
      { nom: 'Mathématiques', coefficient: 4, note: 13.0, moyenneClasse: 11.8, appreciation: 'Peut mieux faire' },
      { nom: 'Histoire-Géographie', coefficient: 2, note: 15.5, moyenneClasse: 13.2, appreciation: 'Excellent' },
      { nom: 'Sciences', coefficient: 2, note: 12.0, moyenneClasse: 12.5, appreciation: 'Satisfaisant' },
      { nom: 'Anglais', coefficient: 2, note: 11.5, moyenneClasse: 11.0, appreciation: 'En progrès' },
    ],
    moyenneGenerale: 13.5,
    rang: 5,
    effectif: 35,
    absences: 2,
    retards: 1,
    appreciationGenerale: 'Élève sérieux avec de bons résultats. Continue ainsi.'
  });

  const handleGenerateBulletin = (eleve: typeof mockElevesArchive[0]) => {
    const bulletinData = getMockBulletinData(eleve);
    generateArchiveBulletinPDF(bulletinData);
    toast({
      title: "Bulletin généré",
      description: `Le bulletin archivé de ${eleve.prenom} ${eleve.nom} a été téléchargé avec la mention ARCHIVE.`,
    });
  };

  const handleGenerateCertificat = (eleve: typeof mockElevesArchive[0]) => {
    generateArchiveCertificatPDF(eleve);
    toast({
      title: "Certificat généré",
      description: `Le certificat archivé de ${eleve.prenom} ${eleve.nom} a été téléchargé.`,
    });
  };

  const handleGenerateAttestation = (eleve: typeof mockElevesArchive[0]) => {
    generateArchiveAttestationPDF(eleve);
    toast({
      title: "Attestation générée",
      description: `L'attestation archivée de ${eleve.prenom} ${eleve.nom} a été téléchargée.`,
    });
  };

  const handleGenerateReleve = (eleve: typeof mockElevesArchive[0]) => {
    const bulletinData = getMockBulletinData(eleve);
    generateArchiveRelevePDF(bulletinData);
    toast({
      title: "Relevé généré",
      description: `Le relevé de notes archivé de ${eleve.prenom} ${eleve.nom} a été téléchargé.`,
    });
  };

  const handleExportZIP = async (eleve: typeof mockElevesArchive[0]) => {
    toast({
      title: "Génération en cours...",
      description: "Préparation du dossier ZIP avec tous les documents.",
    });
    
    const bulletinData = getMockBulletinData(eleve);
    await generateArchiveZIP(eleve, bulletinData);
    
    toast({
      title: "Dossier ZIP téléchargé",
      description: `Tous les documents de ${eleve.prenom} ${eleve.nom} ont été exportés en ZIP.`,
    });
  };

  const elevesFiltres = mockElevesArchive.filter(e => 
    searchEleve && (
      e.nom.toLowerCase().includes(searchEleve.toLowerCase()) ||
      e.prenom.toLowerCase().includes(searchEleve.toLowerCase()) ||
      e.matricule.toLowerCase().includes(searchEleve.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Archives & Années Antérieures</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les bases de données par année scolaire et accédez aux archives
          </p>
        </div>
        <Dialog open={showNewYearDialog} onOpenChange={setShowNewYearDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Année Scolaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle année scolaire</DialogTitle>
              <DialogDescription>
                La création d'une nouvelle année archivera automatiquement l'année en cours.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="libelle">Libellé (ex: 2025-2026)</Label>
                <Input
                  id="libelle"
                  value={nouvelleAnnee.libelle}
                  onChange={(e) => setNouvelleAnnee(prev => ({ ...prev, libelle: e.target.value }))}
                  placeholder="2025-2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={nouvelleAnnee.dateDebut}
                    onChange={(e) => setNouvelleAnnee(prev => ({ ...prev, dateDebut: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={nouvelleAnnee.dateFin}
                    onChange={(e) => setNouvelleAnnee(prev => ({ ...prev, dateFin: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewYearDialog(false)}>Annuler</Button>
              <Button onClick={handleCreerAnnee}>Créer et Activer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Indicateur mode archive */}
      {isArchiveMode && anneeConsultee && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Archive className="h-6 w-6 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  Mode Archive - Année {anneeConsultee.libelle}
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Lecture seule - Aucune modification possible
                </p>
              </div>
            </div>
            <Button onClick={handleDeconnexion} variant="outline" className="border-amber-500 text-amber-700">
              Revenir à {anneeActive?.libelle}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{anneeActive?.libelle || '-'}</p>
              <p className="text-sm text-muted-foreground">Année active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Archive className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{anneesScolaires.filter(a => a.statut === 'archivee').length}</p>
              <p className="text-sm text-muted-foreground">Années archivées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <HardDrive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">12.9 GB</p>
              <p className="text-sm text-muted-foreground">Espace total utilisé</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900">
              <History className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{journalAcces.length}</p>
              <p className="text-sm text-muted-foreground">Accès enregistrés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="annees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="annees">Années Scolaires</TabsTrigger>
          <TabsTrigger value="recherche">Recherche Archives</TabsTrigger>
          <TabsTrigger value="journal">Journal d'Accès</TabsTrigger>
        </TabsList>

        <TabsContent value="annees">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Liste des Années Scolaires
              </CardTitle>
              <CardDescription>
                Gérez les bases de données et accédez aux archives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-center">Élèves</TableHead>
                    <TableHead className="text-center">Classes</TableHead>
                    <TableHead className="text-center">Enseignants</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anneesScolaires.map((annee) => (
                    <TableRow key={annee.id} className={anneeConsultee?.id === annee.id ? 'bg-amber-50 dark:bg-amber-950/20' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {annee.libelle}
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(annee.statut)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(annee.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(annee.dateFin), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {annee.nombreEleves}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {annee.nombreClasses}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          {annee.nombreEnseignants}
                        </div>
                      </TableCell>
                      <TableCell>{annee.tailleDonnees}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {annee.statut === 'active' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleArchiver(annee.id)}
                            >
                              <Lock className="h-4 w-4 mr-1" />
                              Archiver
                            </Button>
                          ) : anneeConsultee?.id === annee.id ? (
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={handleDeconnexion}
                            >
                              <Unlock className="h-4 w-4 mr-1" />
                              Déconnecter
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleConnexion(annee.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Consulter
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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

        <TabsContent value="recherche">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Recherche dans les Archives
              </CardTitle>
              <CardDescription>
                Recherchez des élèves et leurs documents dans les années archivées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par matricule, nom ou prénom..."
                    value={searchEleve}
                    onChange={(e) => setSearchEleve(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </div>

              {searchEleve && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Nom & Prénom</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Année Scolaire</TableHead>
                      <TableHead className="text-right">Documents</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {elevesFiltres.length > 0 ? elevesFiltres.map((eleve) => (
                      <TableRow key={eleve.id}>
                        <TableCell className="font-mono">{eleve.matricule}</TableCell>
                        <TableCell className="font-medium">{eleve.nom} {eleve.prenom}</TableCell>
                        <TableCell>{eleve.classe}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{eleve.annee}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleExportZIP(eleve)}
                              title="Télécharger tous les documents en ZIP"
                              className="bg-primary"
                            >
                              <FolderArchive className="h-4 w-4 mr-1" />
                              Tout exporter
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenerateBulletin(eleve)}
                              title="Générer le bulletin avec filigrane ARCHIVE"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenerateCertificat(eleve)}
                              title="Générer le certificat avec filigrane ARCHIVE"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenerateAttestation(eleve)}
                              title="Générer l'attestation avec filigrane ARCHIVE"
                            >
                              <ScrollText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenerateReleve(eleve)}
                              title="Générer le relevé de notes avec filigrane ARCHIVE"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun élève trouvé pour "{searchEleve}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {!searchEleve && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Entrez un matricule, nom ou prénom pour rechercher</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Journal des Accès aux Archives
              </CardTitle>
              <CardDescription>
                Traçabilité complète des consultations et actions sur les archives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalAcces.map((acces) => (
                    <TableRow key={acces.id}>
                      <TableCell className="text-sm">
                        {format(new Date(acces.dateAcces), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell className="font-medium">{acces.utilisateur}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{acces.role}</Badge>
                      </TableCell>
                      <TableCell>{acces.anneeScolaire}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(acces.action)}
                          <span className="capitalize">{acces.action}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {acces.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
