import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, Users, Calendar, DollarSign, Handshake, Plus, Search, 
  Mail, Phone, MapPin, Globe, FileText, TrendingUp, Award, CheckCircle,
  Clock, AlertCircle, Edit, Trash2, Eye
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Sponsor {
  id: string;
  nom: string;
  type: "entreprise" | "ong" | "particulier" | "institution";
  contact: string;
  email: string;
  telephone: string;
  montant: number;
  statut: "actif" | "prospect" | "inactif";
  dateDebut: string;
  dateFin: string;
  projets: string[];
}

const SponsorsPartners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [sponsors] = useState<Sponsor[]>([
    { id: "1", nom: "Orange Côte d'Ivoire", type: "entreprise", contact: "M. Diabaté", email: "partenariat@orange.ci", telephone: "+225 27 20 123 456", montant: 15000000, statut: "actif", dateDebut: "2023-09-01", dateFin: "2024-08-31", projets: ["Bourse d'excellence", "Équipements IT"] },
    { id: "2", nom: "Fondation MTN", type: "ong", contact: "Mme Koné", email: "contact@fondation-mtn.ci", telephone: "+225 27 20 789 012", montant: 10000000, statut: "actif", dateDebut: "2023-10-01", dateFin: "2024-09-30", projets: ["Bibliothèque numérique"] },
    { id: "3", nom: "Banque Atlantique", type: "entreprise", contact: "M. Touré", email: "rse@banqueatlantique.ci", telephone: "+225 27 20 345 678", montant: 8000000, statut: "actif", dateDebut: "2024-01-01", dateFin: "2024-12-31", projets: ["Rénovation laboratoire"] },
    { id: "4", nom: "Association Parents APEL", type: "particulier", contact: "Mme Bamba", email: "apel@ecole.ci", telephone: "+225 07 12 345 678", montant: 3500000, statut: "actif", dateDebut: "2023-09-01", dateFin: "2024-08-31", projets: ["Activités parascolaires"] },
    { id: "5", nom: "UNICEF", type: "institution", contact: "Dr. Martin", email: "abidjan@unicef.org", telephone: "+225 27 20 111 222", montant: 25000000, statut: "prospect", dateDebut: "", dateFin: "", projets: ["Éducation inclusive"] },
  ]);

  const stats = {
    totalMontant: sponsors.filter(s => s.statut === "actif").reduce((sum, s) => sum + s.montant, 0),
    partenairesActifs: sponsors.filter(s => s.statut === "actif").length,
    projetsFinances: new Set(sponsors.flatMap(s => s.projets)).size,
    prospects: sponsors.filter(s => s.statut === "prospect").length,
  };

  const repartitionType = [
    { name: "Entreprises", value: sponsors.filter(s => s.type === "entreprise").length, color: "hsl(var(--primary))" },
    { name: "ONG", value: sponsors.filter(s => s.type === "ong").length, color: "hsl(var(--chart-2))" },
    { name: "Institutions", value: sponsors.filter(s => s.type === "institution").length, color: "hsl(var(--chart-3))" },
    { name: "Particuliers", value: sponsors.filter(s => s.type === "particulier").length, color: "hsl(var(--chart-4))" },
  ];

  const contributionsMensuelles = [
    { mois: "Sep", montant: 12000000 },
    { mois: "Oct", montant: 10000000 },
    { mois: "Nov", montant: 8000000 },
    { mois: "Déc", montant: 15000000 },
    { mois: "Jan", montant: 18000000 },
  ];

  const filteredSponsors = sponsors.filter(s => 
    s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "entreprise": return "bg-blue-500";
      case "ong": return "bg-green-500";
      case "institution": return "bg-purple-500";
      case "particulier": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sponsors & Partenaires</h1>
          <p className="text-muted-foreground">Gestion des partenariats et sponsoring</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />Nouveau partenaire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un Partenaire</DialogTitle>
              <DialogDescription>Enregistrez un nouveau sponsor ou partenaire</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nom de l'organisation</Label>
                <Input placeholder="Ex: Orange Côte d'Ivoire" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entreprise">Entreprise</SelectItem>
                    <SelectItem value="ong">ONG</SelectItem>
                    <SelectItem value="institution">Institution</SelectItem>
                    <SelectItem value="particulier">Particulier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Personne de contact</Label>
                <Input placeholder="Nom du contact" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@exemple.com" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="+225 XX XX XXX XXX" />
              </div>
              <div className="space-y-2">
                <Label>Montant du partenariat (FCFA)</Label>
                <Input type="number" placeholder="10000000" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description du partenariat</Label>
                <Textarea placeholder="Détails du partenariat, projets concernés..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button onClick={() => { toast.success("Partenaire ajouté"); setIsAddDialogOpen(false); }}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Contributions</p>
              <p className="text-2xl font-bold">{(stats.totalMontant / 1000000).toFixed(1)}M F</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Handshake className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Partenaires Actifs</p>
              <p className="text-2xl font-bold">{stats.partenairesActifs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projets Financés</p>
              <p className="text-2xl font-bold">{stats.projetsFinances}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prospects</p>
              <p className="text-2xl font-bold">{stats.prospects}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partenaires" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="projets">Projets</TabsTrigger>
        </TabsList>

        <TabsContent value="partenaires">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Partenaires</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Contribution</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Projets</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSponsors.map((sponsor) => (
                    <TableRow key={sponsor.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getTypeColor(sponsor.type)}`} />
                          <span className="font-medium">{sponsor.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{sponsor.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{sponsor.contact}</p>
                          <p className="text-muted-foreground">{sponsor.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {(sponsor.montant / 1000000).toFixed(1)}M FCFA
                      </TableCell>
                      <TableCell>
                        <Badge variant={sponsor.statut === "actif" ? "default" : sponsor.statut === "prospect" ? "secondary" : "outline"}>
                          {sponsor.statut === "actif" ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                           sponsor.statut === "prospect" ? <Clock className="h-3 w-3 mr-1" /> : null}
                          {sponsor.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {sponsor.projets.slice(0, 2).map((p, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                          ))}
                          {sponsor.projets.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{sponsor.projets.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="contributions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contributions Mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contributionsMensuelles}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip formatter={(v: number) => `${(v / 1000000).toFixed(1)}M FCFA`} />
                    <Bar dataKey="montant" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={repartitionType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {repartitionType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { titre: "Bourse d'excellence", sponsor: "Orange CI", budget: 5000000, avancement: 75, statut: "en_cours" },
              { titre: "Bibliothèque numérique", sponsor: "Fondation MTN", budget: 10000000, avancement: 40, statut: "en_cours" },
              { titre: "Rénovation laboratoire", sponsor: "Banque Atlantique", budget: 8000000, avancement: 90, statut: "en_cours" },
              { titre: "Équipements IT", sponsor: "Orange CI", budget: 10000000, avancement: 100, statut: "termine" },
              { titre: "Activités parascolaires", sponsor: "APEL", budget: 3500000, avancement: 60, statut: "en_cours" },
              { titre: "Éducation inclusive", sponsor: "UNICEF", budget: 25000000, avancement: 0, statut: "prospect" },
            ].map((projet, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{projet.titre}</h3>
                      <p className="text-sm text-muted-foreground">{projet.sponsor}</p>
                    </div>
                    <Badge variant={projet.statut === "termine" ? "default" : projet.statut === "en_cours" ? "secondary" : "outline"}>
                      {projet.statut === "termine" ? "Terminé" : projet.statut === "en_cours" ? "En cours" : "Prospect"}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold mb-2">{(projet.budget / 1000000).toFixed(1)}M FCFA</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Avancement</span>
                      <span>{projet.avancement}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${projet.avancement}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorsPartners;
