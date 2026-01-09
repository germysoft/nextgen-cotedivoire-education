import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  UserX, 
  Clock, 
  TrendingDown, 
  MessageSquare, 
  Phone,
  Mail,
  Eye,
  FileText,
  Bell,
  Users,
  Calendar,
  Search,
  Download
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// Données de suivi des absences
const absenceData = [
  { semaine: "S1", absences: 45, retards: 23, justifiees: 38 },
  { semaine: "S2", absences: 52, retards: 28, justifiees: 41 },
  { semaine: "S3", absences: 38, retards: 19, justifiees: 35 },
  { semaine: "S4", absences: 41, retards: 25, justifiees: 32 },
];

// Élèves à risque
const elevesRisque = [
  { 
    id: 1, 
    nom: "KOUASSI Marcel", 
    classe: "3èmeA", 
    absences: 12, 
    retards: 8, 
    incidents: 3, 
    moyenneConduite: 8, 
    alerteType: "urgent",
    dernierContact: "Il y a 5 jours"
  },
  { 
    id: 2, 
    nom: "TRAORÉ Aminata", 
    classe: "5èmeB", 
    absences: 9, 
    retards: 5, 
    incidents: 2, 
    moyenneConduite: 10, 
    alerteType: "warning",
    dernierContact: "Il y a 3 jours"
  },
  { 
    id: 3, 
    nom: "BAMBA Koné", 
    classe: "4èmeC", 
    absences: 7, 
    retards: 4, 
    incidents: 1, 
    moyenneConduite: 11, 
    alerteType: "warning",
    dernierContact: "Il y a 1 semaine"
  },
  { 
    id: 4, 
    nom: "DIALLO Moussa", 
    classe: "6èmeA", 
    absences: 6, 
    retards: 10, 
    incidents: 0, 
    moyenneConduite: 12, 
    alerteType: "info",
    dernierContact: "Aujourd'hui"
  },
];

// Incidents récents
const incidentsRecents = [
  { 
    id: 1, 
    date: "15/01/2025", 
    eleve: "KOUASSI Marcel", 
    classe: "3èmeA", 
    type: "Bagarre",
    gravite: "grave",
    statut: "en_cours",
    mesure: "Convocation parents"
  },
  { 
    id: 2, 
    date: "14/01/2025", 
    eleve: "SANOGO Paul", 
    classe: "5èmeA", 
    type: "Insolence",
    gravite: "moyen",
    statut: "traite",
    mesure: "Avertissement écrit"
  },
  { 
    id: 3, 
    date: "13/01/2025", 
    eleve: "KOFFI Marie", 
    classe: "4èmeB", 
    type: "Retards répétés",
    gravite: "leger",
    statut: "traite",
    mesure: "Rappel à l'ordre"
  },
  { 
    id: 4, 
    date: "12/01/2025", 
    eleve: "YAO Jean", 
    classe: "2ndeC", 
    type: "Dégradation",
    gravite: "grave",
    statut: "en_cours",
    mesure: "Conseil de discipline"
  },
];

// Répartition des sanctions
const sanctionsData = [
  { name: "Avertissement oral", value: 45, color: "#22c55e" },
  { name: "Avertissement écrit", value: 28, color: "#f59e0b" },
  { name: "Retenue", value: 15, color: "#ef4444" },
  { name: "Exclusion temporaire", value: 8, color: "#7c3aed" },
  { name: "Conseil discipline", value: 4, color: "#dc2626" },
];

// Convocations en attente
const convocationsAttente = [
  { id: 1, eleve: "KOUASSI Marcel", parent: "M. KOUASSI", date: "17/01/2025", heure: "10:00", motif: "Comportement" },
  { id: 2, eleve: "TRAORÉ Aminata", parent: "Mme TRAORÉ", date: "18/01/2025", heure: "14:30", motif: "Absences répétées" },
  { id: 3, eleve: "BAMBA Koné", parent: "M. BAMBA", date: "19/01/2025", heure: "09:00", motif: "Difficultés scolaires" },
];

export default function CPEDashboard() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredElevesRisque = elevesRisque.filter(e => 
    e.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.classe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">À surveiller</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getGraviteBadge = (gravite: string) => {
    switch (gravite) {
      case "grave":
        return <Badge variant="destructive">Grave</Badge>;
      case "moyen":
        return <Badge className="bg-warning text-warning-foreground">Moyen</Badge>;
      default:
        return <Badge variant="secondary">Léger</Badge>;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return <Badge className="bg-primary text-primary-foreground">En cours</Badge>;
      case "traite":
        return <Badge className="bg-success text-success-foreground">Traité</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Tableau de Bord CPE</h1>
          <p className="text-muted-foreground mt-2">Suivi de la vie scolaire et de la discipline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Rapport hebdo
          </Button>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Alertes (3)
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves à risque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{elevesRisque.length}</div>
            <p className="text-xs text-muted-foreground">Suivi prioritaire requis</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absences ce mois</CardTitle>
            <UserX className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">176</div>
            <p className="text-xs text-muted-foreground">68 non justifiées</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards ce mois</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">-12% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents actifs</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 conseils à venir</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convocations</CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convocationsAttente.length}</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="risque" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="risque">Élèves à risque</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="absences">Absences</TabsTrigger>
          <TabsTrigger value="convocations">Convocations</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        {/* Onglet Élèves à risque */}
        <TabsContent value="risque" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Élèves nécessitant un suivi prioritaire</CardTitle>
                  <CardDescription>Alertes automatiques basées sur absences, retards et incidents</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-center">Absences</TableHead>
                    <TableHead className="text-center">Retards</TableHead>
                    <TableHead className="text-center">Incidents</TableHead>
                    <TableHead className="text-center">Conduite</TableHead>
                    <TableHead>Alerte</TableHead>
                    <TableHead>Dernier contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElevesRisque.map((eleve) => (
                    <TableRow key={eleve.id} className={eleve.alerteType === "urgent" ? "bg-destructive/5" : ""}>
                      <TableCell className="font-medium">{eleve.nom}</TableCell>
                      <TableCell><Badge variant="outline">{eleve.classe}</Badge></TableCell>
                      <TableCell className="text-center">
                        <span className={eleve.absences >= 10 ? "text-destructive font-bold" : ""}>
                          {eleve.absences}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{eleve.retards}</TableCell>
                      <TableCell className="text-center">
                        <span className={eleve.incidents >= 2 ? "text-destructive font-bold" : ""}>
                          {eleve.incidents}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={eleve.moyenneConduite < 10 ? "destructive" : eleve.moyenneConduite < 12 ? "secondary" : "outline"}>
                          {eleve.moyenneConduite}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{getAlertBadge(eleve.alerteType)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{eleve.dernierContact}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Voir profil">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Appeler parent">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Envoyer SMS">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Fiche suivi">
                            <FileText className="h-4 w-4" />
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

        {/* Onglet Incidents */}
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Incidents disciplinaires récents</CardTitle>
                  <CardDescription>Gestion et suivi des mesures disciplinaires</CardDescription>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Nouvel incident
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Mesure</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidentsRecents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.date}</TableCell>
                      <TableCell className="font-medium">{incident.eleve}</TableCell>
                      <TableCell><Badge variant="outline">{incident.classe}</Badge></TableCell>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell>{getGraviteBadge(incident.gravite)}</TableCell>
                      <TableCell className="text-sm">{incident.mesure}</TableCell>
                      <TableCell>{getStatutBadge(incident.statut)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Voir détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Télécharger rapport">
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

        {/* Onglet Absences */}
        <TabsContent value="absences" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution hebdomadaire</CardTitle>
                <CardDescription>Absences et retards par semaine</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={absenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semaine" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="absences" name="Absences" fill="hsl(var(--destructive))" />
                    <Bar dataKey="retards" name="Retards" fill="hsl(var(--warning))" />
                    <Bar dataKey="justifiees" name="Justifiées" fill="hsl(var(--success))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de justification</CardTitle>
                <CardDescription>Absences justifiées vs non justifiées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Absences justifiées</span>
                      <span className="text-sm font-bold text-success">68%</span>
                    </div>
                    <Progress value={68} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Absences non justifiées</span>
                      <span className="text-sm font-bold text-destructive">32%</span>
                    </div>
                    <Progress value={32} className="h-3 bg-muted [&>div]:bg-destructive" />
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Classes avec le plus d'absences</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>3èmeA</span>
                        <Badge variant="destructive">28 absences</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>5èmeB</span>
                        <Badge className="bg-warning text-warning-foreground">22 absences</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>4èmeC</span>
                        <Badge variant="secondary">18 absences</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Convocations */}
        <TabsContent value="convocations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Convocations parents planifiées</CardTitle>
                  <CardDescription>Rendez-vous à venir avec les parents</CardDescription>
                </div>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Nouvelle convocation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Parent/Tuteur</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {convocationsAttente.map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell className="font-medium">{conv.date}</TableCell>
                      <TableCell>{conv.heure}</TableCell>
                      <TableCell>{conv.eleve}</TableCell>
                      <TableCell>{conv.parent}</TableCell>
                      <TableCell><Badge variant="outline">{conv.motif}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Appeler">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Envoyer rappel SMS">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Envoyer email">
                            <Mail className="h-4 w-4" />
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

        {/* Onglet Statistiques */}
        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des sanctions</CardTitle>
                <CardDescription>Types de sanctions appliquées ce trimestre</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sanctionsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sanctionsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs clés</CardTitle>
                <CardDescription>Performance vie scolaire</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de présence global</p>
                      <p className="text-3xl font-bold text-success">96.2%</p>
                    </div>
                    <Users className="h-10 w-10 text-success/50" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Moyenne conduite établissement</p>
                      <p className="text-3xl font-bold text-primary">14.8/20</p>
                    </div>
                    <TrendingDown className="h-10 w-10 text-primary/50" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de réponse parents</p>
                      <p className="text-3xl font-bold text-warning">78%</p>
                    </div>
                    <MessageSquare className="h-10 w-10 text-warning/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
