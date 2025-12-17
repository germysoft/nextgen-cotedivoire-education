import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Building2, Plus, Search, Filter, Download, Eye, Edit, Trash2,
  Phone, Mail, Globe, MapPin, Calendar, DollarSign, TrendingUp,
  Award, Handshake, FileText, CheckCircle2, Clock, AlertTriangle,
  Star, Heart, Users, Gift, Target, BarChart3, ArrowUpRight
} from "lucide-react";

interface Sponsor {
  id: string;
  nom: string;
  type: "entreprise" | "ong" | "institution" | "fondation" | "individu";
  secteur: string;
  logo?: string;
  contact: {
    nom: string;
    fonction: string;
    email: string;
    telephone: string;
  };
  adresse: string;
  siteWeb?: string;
  partenariatDebut: string;
  partenariatFin?: string;
  statut: "actif" | "en_discussion" | "expire" | "suspendu";
  niveau: "or" | "argent" | "bronze" | "partenaire";
  contributions: Contribution[];
  totalContributions: number;
  conventionUrl?: string;
  notes?: string;
}

interface Contribution {
  id: string;
  sponsorId: string;
  date: string;
  type: "financier" | "materiel" | "service" | "bourse";
  description: string;
  valeur: number;
  statut: "promis" | "recu" | "utilise";
  beneficiaires?: string;
}

interface ProspectSponsor {
  id: string;
  nom: string;
  type: string;
  contact: string;
  email: string;
  dateContact: string;
  statut: "nouveau" | "contacte" | "interesse" | "negociation" | "refuse";
  potentiel: "faible" | "moyen" | "eleve";
  notes: string;
}

const mockSponsors: Sponsor[] = [
  {
    id: "1",
    nom: "Orange Côte d'Ivoire",
    type: "entreprise",
    secteur: "Télécommunications",
    contact: { nom: "M. Bamba Sékou", fonction: "Directeur RSE", email: "bamba@orange.ci", telephone: "+225 07 08 09 10 11" },
    adresse: "Plateau, Abidjan",
    siteWeb: "https://orange.ci",
    partenariatDebut: "2020-01-15",
    statut: "actif",
    niveau: "or",
    contributions: [
      { id: "1", sponsorId: "1", date: "2024-01-10", type: "service", description: "Connexion fibre optique", valeur: 2400000, statut: "recu" },
      { id: "2", sponsorId: "1", date: "2023-09-01", type: "materiel", description: "20 tablettes éducatives", valeur: 3000000, statut: "utilise" },
    ],
    totalContributions: 15400000
  },
  {
    id: "2",
    nom: "UNICEF Côte d'Ivoire",
    type: "ong",
    secteur: "Éducation & Protection de l'enfance",
    contact: { nom: "Mme Konan Adjoua", fonction: "Chargée Programme Éducation", email: "akonan@unicef.org", telephone: "+225 27 20 21 22 23" },
    adresse: "Cocody, Abidjan",
    siteWeb: "https://unicef.org/cotedivoire",
    partenariatDebut: "2018-09-01",
    statut: "actif",
    niveau: "or",
    contributions: [
      { id: "3", sponsorId: "2", date: "2024-01-05", type: "bourse", description: "30 bourses élèves défavorisés", valeur: 9000000, statut: "recu", beneficiaires: "30 élèves" },
    ],
    totalContributions: 45000000
  },
  {
    id: "3",
    nom: "Banque Atlantique",
    type: "entreprise",
    secteur: "Finance & Banque",
    contact: { nom: "M. Diallo Mamadou", fonction: "Responsable Mécénat", email: "mdiallo@banqueatlantique.net", telephone: "+225 05 06 07 08 09" },
    adresse: "Plateau, Abidjan",
    partenariatDebut: "2022-03-15",
    statut: "actif",
    niveau: "argent",
    contributions: [
      { id: "4", sponsorId: "3", date: "2023-12-20", type: "financier", description: "Don équipements informatiques", valeur: 5000000, statut: "utilise" },
    ],
    totalContributions: 8000000
  },
  {
    id: "4",
    nom: "Fondation MTN",
    type: "fondation",
    secteur: "Télécommunications",
    contact: { nom: "Mme Touré Fatoumata", fonction: "Directrice Fondation", email: "ftoure@mtn.ci", telephone: "+225 01 02 03 04 05" },
    adresse: "Cocody Riviera, Abidjan",
    partenariatDebut: "2023-09-01",
    statut: "actif",
    niveau: "bronze",
    contributions: [],
    totalContributions: 2500000
  },
  {
    id: "5",
    nom: "Groupe Bolloré",
    type: "entreprise",
    secteur: "Logistique & Transport",
    contact: { nom: "M. Yao Kouadio", fonction: "DRH", email: "kyao@bollore.com", telephone: "+225 27 21 22 23 24" },
    adresse: "Zone portuaire, Abidjan",
    partenariatDebut: "2019-06-01",
    partenariatFin: "2023-06-01",
    statut: "expire",
    niveau: "argent",
    contributions: [],
    totalContributions: 12000000
  },
];

const mockProspects: ProspectSponsor[] = [
  { id: "1", nom: "Société Générale CI", type: "Banque", contact: "Direction RSE", email: "rse@socgen.ci", dateContact: "2024-01-10", statut: "interesse", potentiel: "eleve", notes: "Intéressés par parrainage d'excellence" },
  { id: "2", nom: "Total Energies CI", type: "Énergie", contact: "Mme Koffi", email: "koffi@total.ci", dateContact: "2024-01-08", statut: "negociation", potentiel: "eleve", notes: "Proposition de convention en cours" },
  { id: "3", nom: "Air Côte d'Ivoire", type: "Transport", contact: "Service Communication", email: "contact@aircotedivoire.com", dateContact: "2024-01-05", statut: "contacte", potentiel: "moyen", notes: "Premier contact envoyé" },
  { id: "4", nom: "Nestlé CI", type: "Agroalimentaire", contact: "M. Traoré", email: "traore@nestle.ci", dateContact: "2023-12-15", statut: "refuse", potentiel: "faible", notes: "Budget RSE déjà alloué pour 2024" },
];

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(mockSponsors);
  const [prospects, setProspects] = useState<ProspectSponsor[]>(mockProspects);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewSponsorDialog, setShowNewSponsorDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const getNiveauBadge = (niveau: string) => {
    const styles: Record<string, { color: string; icon: any }> = {
      or: { color: "bg-yellow-100 text-yellow-800", icon: Award },
      argent: { color: "bg-gray-100 text-gray-800", icon: Award },
      bronze: { color: "bg-orange-100 text-orange-800", icon: Award },
      partenaire: { color: "bg-blue-100 text-blue-800", icon: Handshake }
    };
    const style = styles[niveau] || styles.partenaire;
    const Icon = style.icon;
    return (
      <Badge className={`${style.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (statut: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      actif: { variant: "default", label: "Actif" },
      en_discussion: { variant: "secondary", label: "En discussion" },
      expire: { variant: "outline", label: "Expiré" },
      suspendu: { variant: "destructive", label: "Suspendu" }
    };
    const style = styles[statut] || styles.actif;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getProspectStatusBadge = (statut: string) => {
    const colors: Record<string, string> = {
      nouveau: "bg-blue-100 text-blue-800",
      contacte: "bg-yellow-100 text-yellow-800",
      interesse: "bg-green-100 text-green-800",
      negociation: "bg-purple-100 text-purple-800",
      refuse: "bg-red-100 text-red-800"
    };
    return <Badge className={colors[statut]}>{statut}</Badge>;
  };

  const getPotentielBadge = (potentiel: string) => {
    const colors: Record<string, string> = {
      faible: "bg-gray-100 text-gray-800",
      moyen: "bg-yellow-100 text-yellow-800",
      eleve: "bg-green-100 text-green-800"
    };
    return <Badge className={colors[potentiel]}>{potentiel}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      entreprise: "bg-blue-100 text-blue-800",
      ong: "bg-green-100 text-green-800",
      institution: "bg-purple-100 text-purple-800",
      fondation: "bg-orange-100 text-orange-800",
      individu: "bg-gray-100 text-gray-800"
    };
    return <Badge className={colors[type] || colors.entreprise}>{type}</Badge>;
  };

  const filteredSponsors = sponsors.filter(s => {
    const matchesSearch = s.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || s.type === typeFilter;
    const matchesStatus = statusFilter === "all" || s.statut === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const viewDetail = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setShowDetailDialog(true);
  };

  const renewPartnership = (sponsorId: string) => {
    setSponsors(sponsors.map(s => 
      s.id === sponsorId ? { ...s, statut: "actif", partenariatFin: undefined } : s
    ));
    toast.success("Partenariat renouvelé avec succès");
  };

  const stats = {
    totalSponsors: sponsors.filter(s => s.statut === "actif").length,
    totalContributions: sponsors.reduce((sum, s) => sum + s.totalContributions, 0),
    sponsorsOr: sponsors.filter(s => s.niveau === "or" && s.statut === "actif").length,
    prospectsEnCours: prospects.filter(p => p.statut !== "refuse").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sponsors & Mécènes</h1>
          <p className="text-muted-foreground">Gestion des partenaires financiers et sponsors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport annuel
          </Button>
          <Dialog open={showNewSponsorDialog} onOpenChange={setShowNewSponsorDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau sponsor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un sponsor</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Nom de l'organisation *</Label>
                  <Input placeholder="Ex: Orange Côte d'Ivoire" />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entreprise">Entreprise</SelectItem>
                      <SelectItem value="ong">ONG</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="fondation">Fondation</SelectItem>
                      <SelectItem value="individu">Individu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Secteur d'activité</Label>
                  <Input placeholder="Ex: Télécommunications" />
                </div>
                <div>
                  <Label>Niveau de partenariat</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="or">Or (Premium)</SelectItem>
                      <SelectItem value="argent">Argent</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="partenaire">Partenaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date début partenariat</Label>
                  <Input type="date" />
                </div>
                <div className="col-span-2">
                  <Label>Nom du contact</Label>
                  <Input placeholder="Nom et prénom" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="contact@entreprise.com" />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input placeholder="+225 XX XX XX XX XX" />
                </div>
                <div className="col-span-2">
                  <Label>Adresse</Label>
                  <Input placeholder="Adresse complète" />
                </div>
                <div className="col-span-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Informations complémentaires..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewSponsorDialog(false)}>Annuler</Button>
                <Button onClick={() => { setShowNewSponsorDialog(false); toast.success("Sponsor ajouté"); }}>
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSponsors}</p>
                <p className="text-xs text-muted-foreground">Sponsors actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(stats.totalContributions / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">FCFA contributions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sponsorsOr}</p>
                <p className="text-xs text-muted-foreground">Sponsors Or</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.prospectsEnCours}</p>
                <p className="text-xs text-muted-foreground">Prospects en cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sponsors">
        <TabsList>
          <TabsTrigger value="sponsors">Sponsors actuels</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="prospects">Prospection</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="sponsors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des sponsors</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-10 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="entreprise">Entreprises</SelectItem>
                      <SelectItem value="ong">ONG</SelectItem>
                      <SelectItem value="fondation">Fondations</SelectItem>
                      <SelectItem value="institution">Institutions</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="actif">Actifs</SelectItem>
                      <SelectItem value="expire">Expirés</SelectItem>
                      <SelectItem value="en_discussion">En discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredSponsors.map(sponsor => (
                  <Card key={sponsor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{sponsor.nom}</h3>
                              <p className="text-sm text-muted-foreground">{sponsor.secteur}</p>
                            </div>
                          </div>
                          {getNiveauBadge(sponsor.niveau)}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {getTypeBadge(sponsor.type)}
                          {getStatusBadge(sponsor.statut)}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{sponsor.contact.nom} - {sponsor.contact.fonction}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{sponsor.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Depuis {sponsor.partenariatDebut}</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total contributions</span>
                            <span className="text-lg font-bold text-primary">
                              {sponsor.totalContributions.toLocaleString()} FCFA
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/30 border-t">
                        <div className="flex items-center gap-1">
                          {sponsor.statut === "expire" && (
                            <Button variant="outline" size="sm" onClick={() => renewPartnership(sponsor.id)}>
                              <Handshake className="h-4 w-4 mr-2" />
                              Renouveler
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => viewDetail(sponsor)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>Historique des contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Bénéficiaires</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsors.flatMap(s => s.contributions.map(c => ({ ...c, sponsorNom: s.nom }))).sort((a, b) => b.date.localeCompare(a.date)).map(contribution => (
                    <TableRow key={contribution.id}>
                      <TableCell>{contribution.date}</TableCell>
                      <TableCell className="font-medium">{contribution.sponsorNom}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {contribution.type === "financier" && <DollarSign className="h-3 w-3 mr-1" />}
                          {contribution.type === "materiel" && <Gift className="h-3 w-3 mr-1" />}
                          {contribution.type === "bourse" && <Award className="h-3 w-3 mr-1" />}
                          {contribution.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{contribution.description}</TableCell>
                      <TableCell className="font-mono">{contribution.valeur.toLocaleString()} FCFA</TableCell>
                      <TableCell>{contribution.beneficiaires || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={contribution.statut === "utilise" ? "default" : contribution.statut === "recu" ? "secondary" : "outline"}>
                          {contribution.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pipeline de prospection</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter prospect
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date contact</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Potentiel</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prospects.map(prospect => (
                    <TableRow key={prospect.id}>
                      <TableCell className="font-medium">{prospect.nom}</TableCell>
                      <TableCell><Badge variant="outline">{prospect.type}</Badge></TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{prospect.contact}</p>
                          <p className="text-xs text-muted-foreground">{prospect.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{prospect.dateContact}</TableCell>
                      <TableCell>{getProspectStatusBadge(prospect.statut)}</TableCell>
                      <TableCell>{getPotentielBadge(prospect.potentiel)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{prospect.notes}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { niveau: "Or", count: sponsors.filter(s => s.niveau === "or").length, color: "bg-yellow-500" },
                    { niveau: "Argent", count: sponsors.filter(s => s.niveau === "argent").length, color: "bg-gray-400" },
                    { niveau: "Bronze", count: sponsors.filter(s => s.niveau === "bronze").length, color: "bg-orange-500" },
                    { niveau: "Partenaire", count: sponsors.filter(s => s.niveau === "partenaire").length, color: "bg-blue-500" }
                  ].map(item => (
                    <div key={item.niveau}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.niveau}</span>
                        <span className="text-sm text-muted-foreground">{item.count} sponsors</span>
                      </div>
                      <Progress value={item.count * 20} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contributions par type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Financier", icon: DollarSign, value: 5000000 },
                    { type: "Matériel", icon: Gift, value: 3000000 },
                    { type: "Bourses", icon: Award, value: 9000000 },
                    { type: "Services", icon: Handshake, value: 2400000 }
                  ].map(item => (
                    <div key={item.type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <span className="font-bold">{item.value.toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top 5 contributeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sponsors
                    .sort((a, b) => b.totalContributions - a.totalContributions)
                    .slice(0, 5)
                    .map((sponsor, index) => (
                      <div key={sponsor.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-500" : "bg-blue-500"
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{sponsor.nom}</p>
                            <p className="text-sm text-muted-foreground">{sponsor.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{sponsor.totalContributions.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">FCFA</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détail du sponsor</DialogTitle>
          </DialogHeader>
          {selectedSponsor && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedSponsor.nom}</h2>
                    <p className="text-muted-foreground">{selectedSponsor.secteur}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getTypeBadge(selectedSponsor.type)}
                      {getNiveauBadge(selectedSponsor.niveau)}
                      {getStatusBadge(selectedSponsor.statut)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total contributions</p>
                  <p className="text-2xl font-bold text-primary">{selectedSponsor.totalContributions.toLocaleString()} FCFA</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Contact principal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{selectedSponsor.contact.nom}</p>
                    <p className="text-sm text-muted-foreground">{selectedSponsor.contact.fonction}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      {selectedSponsor.contact.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {selectedSponsor.contact.telephone}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Informations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {selectedSponsor.adresse}
                    </div>
                    {selectedSponsor.siteWeb && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4" />
                        <a href={selectedSponsor.siteWeb} target="_blank" className="text-primary hover:underline">
                          {selectedSponsor.siteWeb}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Partenaire depuis {selectedSponsor.partenariatDebut}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedSponsor.contributions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Historique des contributions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedSponsor.contributions.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{c.description}</p>
                            <p className="text-sm text-muted-foreground">{c.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{c.valeur.toLocaleString()} FCFA</p>
                            <Badge variant={c.statut === "utilise" ? "default" : "secondary"}>{c.statut}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Fermer</Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Convention
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
