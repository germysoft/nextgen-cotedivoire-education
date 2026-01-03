import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, FileText, FileSpreadsheet, Eye, Download, Trophy, Users, Calendar, BarChart3, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";
import { useAuditListes } from "@/hooks/useAuditListes";
import { DataTableExport } from "@/components/data-table/DataTableExport";

// Types pour les listes parascolaires
interface ListeParascolaire {
  id: string;
  nom: string;
  description: string;
  categorie: "clubs" | "participation" | "evenements" | "bilans";
}

// Définition des listes par catégorie
const listesParCategorie: Record<string, ListeParascolaire[]> = {
  clubs: [
    { id: "clubs-complet", nom: "Liste complète des clubs", description: "Tous les clubs de l'établissement", categorie: "clubs" },
    { id: "clubs-actifs", nom: "Liste des clubs actifs", description: "Clubs actuellement en activité", categorie: "clubs" },
    { id: "clubs-inactifs", nom: "Liste des clubs inactifs", description: "Clubs suspendus ou fermés", categorie: "clubs" },
    { id: "clubs-sportifs", nom: "Liste des clubs sportifs", description: "Clubs d'activités sportives", categorie: "clubs" },
    { id: "clubs-culturels", nom: "Liste des clubs culturels", description: "Clubs d'activités culturelles", categorie: "clubs" },
    { id: "clubs-scientifiques", nom: "Liste des clubs scientifiques", description: "Clubs d'activités scientifiques", categorie: "clubs" },
    { id: "clubs-artistiques", nom: "Liste des clubs artistiques", description: "Clubs d'activités artistiques", categorie: "clubs" },
    { id: "clubs-encadreur", nom: "Liste des clubs par encadreur", description: "Clubs groupés par responsable", categorie: "clubs" },
    { id: "clubs-niveau", nom: "Liste des clubs par niveau", description: "Clubs par cycle/niveau scolaire", categorie: "clubs" },
    { id: "clubs-jour", nom: "Liste des clubs par jour", description: "Clubs par créneau horaire", categorie: "clubs" },
    { id: "clubs-lieu", nom: "Liste des clubs par lieu", description: "Clubs par salle/emplacement", categorie: "clubs" },
  ],
  participation: [
    { id: "part-inscrits", nom: "Liste des élèves inscrits par club", description: "Inscriptions par activité", categorie: "participation" },
    { id: "part-activite", nom: "Liste des participants par activité", description: "Participants groupés par activité", categorie: "participation" },
    { id: "part-classe", nom: "Liste des participants par classe", description: "Participants groupés par classe", categorie: "participation" },
    { id: "part-niveau", nom: "Liste des participants par niveau", description: "Participants groupés par niveau", categorie: "participation" },
    { id: "part-sexe", nom: "Liste des participants par sexe", description: "Répartition par genre", categorie: "participation" },
    { id: "part-actifs", nom: "Liste des participants actifs", description: "Élèves actifs dans les activités", categorie: "participation" },
    { id: "part-inactifs", nom: "Liste des participants inactifs", description: "Élèves inscrits mais inactifs", categorie: "participation" },
    { id: "part-presence", nom: "Liste de présence par séance", description: "Feuille de présence journalière", categorie: "participation" },
    { id: "part-historique", nom: "Historique de participation par élève", description: "Suivi individuel des participations", categorie: "participation" },
  ],
  evenements: [
    { id: "evt-programmes", nom: "Liste des événements programmés", description: "Événements à venir", categorie: "evenements" },
    { id: "evt-passes", nom: "Liste des événements passés", description: "Historique des événements", categorie: "evenements" },
    { id: "evt-annules", nom: "Liste des événements annulés", description: "Événements annulés", categorie: "evenements" },
    { id: "evt-type", nom: "Liste des événements par type", description: "Classement par type d'événement", categorie: "evenements" },
    { id: "evt-periode", nom: "Liste des événements par période", description: "Événements par plage de dates", categorie: "evenements" },
    { id: "evt-participants", nom: "Liste des participants par événement", description: "Inscrits à chaque événement", categorie: "evenements" },
    { id: "evt-encadreurs", nom: "Liste des encadreurs par événement", description: "Responsables de chaque événement", categorie: "evenements" },
  ],
  bilans: [
    { id: "bilan-club", nom: "Bilan de participation par club", description: "Statistiques par club", categorie: "bilans" },
    { id: "bilan-annuel", nom: "Bilan annuel des activités", description: "Rapport annuel complet", categorie: "bilans" },
    { id: "bilan-taux", nom: "Taux de participation par niveau", description: "Engagement par niveau scolaire", categorie: "bilans" },
    { id: "bilan-frequentation", nom: "Clubs les plus fréquentés", description: "Classement par popularité", categorie: "bilans" },
    { id: "bilan-actifs", nom: "Élèves les plus actifs", description: "Top participants", categorie: "bilans" },
    { id: "bilan-rapports", nom: "Rapports d'activités parascolaires", description: "Rapports détaillés par période", categorie: "bilans" },
  ],
};

// Données mock pour prévisualisation
const generateMockData = (listeId: string) => {
  const baseData = [
    { id: 1, nom: "Club Football", type: "Sportif", encadreur: "M. Kouassi", jour: "Mercredi", lieu: "Stade", effectif: 25, statut: "Actif" },
    { id: 2, nom: "Chorale", type: "Culturel", encadreur: "Mme Bamba", jour: "Vendredi", lieu: "Salle musique", effectif: 18, statut: "Actif" },
    { id: 3, nom: "Club Sciences", type: "Scientifique", encadreur: "M. Diallo", jour: "Jeudi", lieu: "Labo", effectif: 12, statut: "Actif" },
    { id: 4, nom: "Atelier Peinture", type: "Artistique", encadreur: "Mme Koné", jour: "Mardi", lieu: "Salle arts", effectif: 15, statut: "Actif" },
    { id: 5, nom: "Club Basketball", type: "Sportif", encadreur: "M. Traoré", jour: "Lundi", lieu: "Gymnase", effectif: 20, statut: "Inactif" },
  ];

  if (listeId.startsWith("part-")) {
    return [
      { id: 1, eleve: "Kouadio Aya", classe: "6ème A", club: "Chorale", dateInscription: "15/09/2024", presence: "85%", statut: "Actif" },
      { id: 2, eleve: "Bamba Moussa", classe: "5ème B", club: "Football", dateInscription: "20/09/2024", presence: "92%", statut: "Actif" },
      { id: 3, eleve: "Koné Fatou", classe: "4ème A", club: "Sciences", dateInscription: "18/09/2024", presence: "78%", statut: "Actif" },
      { id: 4, eleve: "Diallo Ibrahim", classe: "3ème C", club: "Peinture", dateInscription: "22/09/2024", presence: "65%", statut: "Inactif" },
    ];
  }

  if (listeId.startsWith("evt-")) {
    return [
      { id: 1, evenement: "Tournoi Inter-classes", type: "Compétition", date: "15/03/2025", lieu: "Stade", participants: 120, statut: "Programmé" },
      { id: 2, evenement: "Concert de Noël", type: "Spectacle", date: "20/12/2024", lieu: "Amphithéâtre", participants: 85, statut: "Passé" },
      { id: 3, evenement: "Expo Sciences", type: "Exposition", date: "25/04/2025", lieu: "Hall", participants: 50, statut: "Programmé" },
      { id: 4, evenement: "Journée Sportive", type: "Compétition", date: "10/05/2025", lieu: "Stade", participants: 200, statut: "Programmé" },
    ];
  }

  if (listeId.startsWith("bilan-")) {
    return [
      { id: 1, club: "Football", inscrits: 25, actifs: 22, tauxPresence: "88%", evenements: 8, note: "Excellent" },
      { id: 2, club: "Chorale", inscrits: 18, actifs: 16, tauxPresence: "89%", evenements: 5, note: "Très bien" },
      { id: 3, club: "Sciences", inscrits: 12, actifs: 10, tauxPresence: "83%", evenements: 3, note: "Bien" },
      { id: 4, club: "Peinture", inscrits: 15, actifs: 12, tauxPresence: "80%", evenements: 4, note: "Bien" },
    ];
  }

  return baseData;
};

const getColumnsForList = (listeId: string) => {
  if (listeId.startsWith("part-")) {
    return [
      { key: "eleve", label: "Élève" },
      { key: "classe", label: "Classe" },
      { key: "club", label: "Club" },
      { key: "dateInscription", label: "Date inscription" },
      { key: "presence", label: "Présence" },
      { key: "statut", label: "Statut" },
    ];
  }

  if (listeId.startsWith("evt-")) {
    return [
      { key: "evenement", label: "Événement" },
      { key: "type", label: "Type" },
      { key: "date", label: "Date" },
      { key: "lieu", label: "Lieu" },
      { key: "participants", label: "Participants" },
      { key: "statut", label: "Statut" },
    ];
  }

  if (listeId.startsWith("bilan-")) {
    return [
      { key: "club", label: "Club" },
      { key: "inscrits", label: "Inscrits" },
      { key: "actifs", label: "Actifs" },
      { key: "tauxPresence", label: "Taux présence" },
      { key: "evenements", label: "Événements" },
      { key: "note", label: "Appréciation" },
    ];
  }

  return [
    { key: "nom", label: "Nom" },
    { key: "type", label: "Type" },
    { key: "encadreur", label: "Encadreur" },
    { key: "jour", label: "Jour" },
    { key: "lieu", label: "Lieu" },
    { key: "effectif", label: "Effectif" },
    { key: "statut", label: "Statut" },
  ];
};

export default function ImprimerListesParascolaire() {
  const { toast } = useToast();
  const { currentRole } = useRole();
  const { logAction } = useAuditListes();
  
  const [activeTab, setActiveTab] = useState("clubs");
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [previewListe, setPreviewListe] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    anneeScolaire: "2024-2025",
    activite: "",
    typeActivite: "",
    niveau: "",
    classe: "",
    sexe: "",
    periode: "",
    encadreur: "",
  });

  // Vérification des permissions
  const isAdmin = currentRole === "admin";
  const isResponsableParascolaire = currentRole === "secretaire"; // Mapping vers un rôle existant
  const hasAccess = isAdmin || isResponsableParascolaire;

  if (!hasAccess) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-destructive mb-2">Accès Refusé</h2>
            <p className="text-muted-foreground text-center">
              Vous n'avez pas les permissions nécessaires pour accéder à ce module.<br />
              Seuls les administrateurs et responsables parascolaires peuvent imprimer ces listes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSelectListe = (listeId: string, checked: boolean) => {
    if (checked) {
      setSelectedListes([...selectedListes, listeId]);
    } else {
      setSelectedListes(selectedListes.filter(id => id !== listeId));
    }
  };

  const handlePreview = (listeId: string) => {
    setPreviewListe(listeId);
    const liste = Object.values(listesParCategorie).flat().find(l => l.id === listeId);
    if (liste) {
      logAction("generation", listeId, liste.nom, "Parascolaire", filters, 1);
    }
    toast({
      title: "Prévisualisation",
      description: "Chargement de l'aperçu de la liste...",
    });
  };

  const handlePrintSelected = () => {
    if (selectedListes.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une liste à imprimer.",
        variant: "destructive",
      });
      return;
    }

    selectedListes.forEach(listeId => {
      const liste = Object.values(listesParCategorie).flat().find(l => l.id === listeId);
      if (liste) {
        logAction("impression", listeId, liste.nom, "Parascolaire", filters, 1);
      }
    });

    toast({
      title: "Impression en cours",
      description: `${selectedListes.length} liste(s) envoyée(s) à l'impression.`,
    });
  };

  const handleExportPDF = (listeId: string) => {
    const liste = Object.values(listesParCategorie).flat().find(l => l.id === listeId);
    if (liste) {
      logAction("export_pdf", listeId, liste.nom, "Parascolaire", filters, 1);
    }
    toast({
      title: "Export PDF",
      description: "La liste a été exportée en PDF.",
    });
  };

  const handleExportExcel = (listeId: string) => {
    const liste = Object.values(listesParCategorie).flat().find(l => l.id === listeId);
    if (liste) {
      logAction("export_excel", listeId, liste.nom, "Parascolaire", filters, 1);
    }
    toast({
      title: "Export Excel",
      description: "La liste a été exportée en Excel.",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "clubs": return <Trophy className="h-5 w-5" />;
      case "participation": return <Users className="h-5 w-5" />;
      case "evenements": return <Calendar className="h-5 w-5" />;
      case "bilans": return <BarChart3 className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "clubs": return "Clubs & Sports";
      case "participation": return "Participation";
      case "evenements": return "Événements";
      case "bilans": return "Suivi & Bilans";
      default: return category;
    }
  };

  const previewData = previewListe ? generateMockData(previewListe) : [];
  const previewColumns = previewListe ? getColumnsForList(previewListe) : [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Imprimer Listes - Activités Parascolaires</h1>
          <p className="text-muted-foreground mt-1">
            Générez, prévisualisez et imprimez les listes liées aux activités parascolaires
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {currentRole === "admin" ? "Administrateur" : "Responsable Parascolaire"}
          </Badge>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres dynamiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <Label>Activité / Club</Label>
              <Select value={filters.activite} onValueChange={(v) => setFilters({...filters, activite: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="chorale">Chorale</SelectItem>
                  <SelectItem value="sciences">Club Sciences</SelectItem>
                  <SelectItem value="peinture">Atelier Peinture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type d'activité</Label>
              <Select value={filters.typeActivite} onValueChange={(v) => setFilters({...filters, typeActivite: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="sportif">Sportif</SelectItem>
                  <SelectItem value="culturel">Culturel</SelectItem>
                  <SelectItem value="scientifique">Scientifique</SelectItem>
                  <SelectItem value="artistique">Artistique</SelectItem>
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
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="6eme">6ème</SelectItem>
                  <SelectItem value="5eme">5ème</SelectItem>
                  <SelectItem value="4eme">4ème</SelectItem>
                  <SelectItem value="3eme">3ème</SelectItem>
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
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="6A">6ème A</SelectItem>
                  <SelectItem value="6B">6ème B</SelectItem>
                  <SelectItem value="5A">5ème A</SelectItem>
                  <SelectItem value="5B">5ème B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sexe</Label>
              <Select value={filters.sexe} onValueChange={(v) => setFilters({...filters, sexe: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <Input 
                type="month" 
                value={filters.periode}
                onChange={(e) => setFilters({...filters, periode: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Encadreur</Label>
              <Select value={filters.encadreur} onValueChange={(v) => setFilters({...filters, encadreur: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="kouassi">M. Kouassi</SelectItem>
                  <SelectItem value="bamba">Mme Bamba</SelectItem>
                  <SelectItem value="diallo">M. Diallo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sélection des listes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sélection des listes</CardTitle>
            <Button 
              onClick={handlePrintSelected} 
              disabled={selectedListes.length === 0}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimer ({selectedListes.length})
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="clubs" className="gap-1 text-xs">
                  <Trophy className="h-3 w-3" />
                  Clubs
                </TabsTrigger>
                <TabsTrigger value="participation" className="gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  Participation
                </TabsTrigger>
                <TabsTrigger value="evenements" className="gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  Événements
                </TabsTrigger>
                <TabsTrigger value="bilans" className="gap-1 text-xs">
                  <BarChart3 className="h-3 w-3" />
                  Bilans
                </TabsTrigger>
              </TabsList>

              {Object.entries(listesParCategorie).map(([category, listes]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {listes.map((liste) => (
                        <div
                          key={liste.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedListes.includes(liste.id)}
                              onCheckedChange={(checked) => handleSelectListe(liste.id, checked as boolean)}
                            />
                            <div>
                              <p className="font-medium text-sm">{liste.nom}</p>
                              <p className="text-xs text-muted-foreground">{liste.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreview(liste.id)}
                              title="Prévisualiser"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleExportPDF(liste.id)}
                              title="Export PDF"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleExportExcel(liste.id)}
                              title="Export Excel"
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Prévisualisation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Prévisualisation
            </CardTitle>
            {previewListe && (
              <DataTableExport
                data={previewData}
                columns={previewColumns}
                filename={`liste-parascolaire-${previewListe}`}
              />
            )}
          </CardHeader>
          <CardContent>
            {previewListe ? (
              <div className="space-y-4">
                {/* En-tête officiel */}
                <div className="border-b pb-4 text-center">
                  <p className="text-xs text-muted-foreground">République de Côte d'Ivoire</p>
                  <h3 className="font-bold">ÉTABLISSEMENT SCOLAIRE</h3>
                  <p className="text-sm text-muted-foreground">Année scolaire {filters.anneeScolaire}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getCategoryIcon(previewListe.split("-")[0])}
                    <Badge variant="secondary">
                      {getCategoryLabel(previewListe.split("-")[0])}
                    </Badge>
                  </div>
                  <p className="font-semibold mt-2">
                    {Object.values(listesParCategorie).flat().find(l => l.id === previewListe)?.nom}
                  </p>
                </div>

                {/* Tableau de prévisualisation */}
                <ScrollArea className="h-[350px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {previewColumns.map((col) => (
                          <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row: any) => (
                        <TableRow key={row.id}>
                          {previewColumns.map((col) => (
                            <TableCell key={col.key}>
                              {col.key === "statut" ? (
                                <Badge variant={row[col.key] === "Actif" || row[col.key] === "Programmé" ? "default" : "secondary"}>
                                  {row[col.key]}
                                </Badge>
                              ) : (
                                row[col.key]
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Pied de page */}
                <div className="border-t pt-4 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Imprimé le {new Date().toLocaleDateString("fr-FR")}</span>
                    <span>Page 1/1</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <Eye className="h-16 w-16 mb-4 opacity-20" />
                <p>Sélectionnez une liste pour la prévisualiser</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Journal d'audit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des impressions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Toutes les actions d'impression et d'export sont enregistrées dans le journal d'audit
            pour assurer la traçabilité et la conformité administrative.
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Journal d'audit", description: "Consultez le module Paramétrage > Audit pour l'historique complet." })}>
              Voir le journal complet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
