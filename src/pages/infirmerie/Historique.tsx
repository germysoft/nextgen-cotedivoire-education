import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Download, Calendar, User, FileText, TrendingUp,
  Activity, Pill, AlertTriangle, Filter, Eye, Printer,
  ChevronDown, History, Heart, Stethoscope
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

// Mock data - Historique complet des consultations
const historiqueMedical = [
  { 
    id: 1, 
    eleve: "KOUASSI Jean", 
    matricule: "2024-001234",
    classe: "Tle D",
    dateNaissance: "15/03/2006",
    groupeSanguin: "A+",
    allergies: ["Pénicilline", "Arachides"],
    antecedents: ["Asthme léger"],
    consultations: [
      { date: "15/12/2024", motif: "Fièvre", traitement: "Paracétamol 1000mg", gravite: "Modérée", medecin: "Dr. KONÉ" },
      { date: "10/11/2024", motif: "Maux de tête", traitement: "Ibuprofène 400mg", gravite: "Légère", medecin: "Inf. DIABATÉ" },
      { date: "05/10/2024", motif: "Crise asthme", traitement: "Ventoline", gravite: "Modérée", medecin: "Dr. KONÉ" },
    ],
    totalConsultations: 8,
    derniereVisite: "15/12/2024"
  },
  { 
    id: 2, 
    eleve: "DIALLO Fatoumata", 
    matricule: "2024-001235",
    classe: "1ère A",
    dateNaissance: "22/07/2007",
    groupeSanguin: "O+",
    allergies: [],
    antecedents: ["Diabète type 1"],
    consultations: [
      { date: "14/12/2024", motif: "Malaise hypoglycémie", traitement: "Sucre, repos", gravite: "Modérée", medecin: "Inf. DIABATÉ" },
      { date: "28/11/2024", motif: "Contrôle glycémie", traitement: "Aucun", gravite: "Légère", medecin: "Dr. KONÉ" },
    ],
    totalConsultations: 15,
    derniereVisite: "14/12/2024"
  },
  { 
    id: 3, 
    eleve: "TOURÉ Mohamed", 
    matricule: "2024-001236",
    classe: "2nde B",
    dateNaissance: "08/01/2008",
    groupeSanguin: "B+",
    allergies: ["Sulfamides"],
    antecedents: [],
    consultations: [
      { date: "15/12/2024", motif: "Douleur abdominale", traitement: "Observation 2h", gravite: "Modérée", medecin: "Dr. KONÉ" },
    ],
    totalConsultations: 3,
    derniereVisite: "15/12/2024"
  },
  { 
    id: 4, 
    eleve: "SANOGO Aminata", 
    matricule: "2024-001237",
    classe: "3ème C",
    dateNaissance: "30/09/2009",
    groupeSanguin: "AB-",
    allergies: [],
    antecedents: ["Épilepsie contrôlée"],
    consultations: [
      { date: "14/12/2024", motif: "Blessure jambe", traitement: "Désinfection, pansement", gravite: "Légère", medecin: "Inf. DIABATÉ" },
      { date: "20/11/2024", motif: "Contrôle épilepsie", traitement: "Aucun", gravite: "Légère", medecin: "Dr. KONÉ" },
    ],
    totalConsultations: 6,
    derniereVisite: "14/12/2024"
  },
  { 
    id: 5, 
    eleve: "KONE Ibrahim", 
    matricule: "2024-001238",
    classe: "4ème A",
    dateNaissance: "12/05/2010",
    groupeSanguin: "O-",
    allergies: ["Latex"],
    antecedents: ["Asthme sévère"],
    consultations: [
      { date: "14/12/2024", motif: "Crise d'asthme", traitement: "Ventoline, parents contactés", gravite: "Grave", medecin: "Dr. KONÉ" },
      { date: "01/12/2024", motif: "Gêne respiratoire", traitement: "Ventoline préventive", gravite: "Modérée", medecin: "Inf. DIABATÉ" },
      { date: "15/11/2024", motif: "Contrôle asthme", traitement: "Aucun", gravite: "Légère", medecin: "Dr. KONÉ" },
    ],
    totalConsultations: 22,
    derniereVisite: "14/12/2024"
  },
];

// Statistiques mensuelles
const evolutionMensuelle = [
  { mois: "Sep", consultations: 45, urgences: 3 },
  { mois: "Oct", consultations: 62, urgences: 5 },
  { mois: "Nov", consultations: 78, urgences: 8 },
  { mois: "Déc", consultations: 54, urgences: 4 },
];

// Répartition par motif
const repartitionMotifs = [
  { name: "Fièvre", value: 35, color: "#ef4444" },
  { name: "Maux de tête", value: 25, color: "#f97316" },
  { name: "Blessures", value: 20, color: "#eab308" },
  { name: "Douleurs abdominales", value: 12, color: "#22c55e" },
  { name: "Autres", value: 8, color: "#3b82f6" },
];

// Statistiques globales
const statsGlobales = [
  { label: "Total consultations", value: "239", icon: Stethoscope, trend: "+12%", color: "text-blue-600" },
  { label: "Élèves suivis", value: "156", icon: User, trend: "+5%", color: "text-green-600" },
  { label: "Cas chroniques", value: "24", icon: Heart, trend: "stable", color: "text-orange-600" },
  { label: "Urgences", value: "20", icon: AlertTriangle, trend: "-8%", color: "text-red-600" },
];

export default function HistoriqueMedical() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("all");
  const [selectedPeriode, setSelectedPeriode] = useState("trimestre");
  const [selectedEleve, setSelectedEleve] = useState<typeof historiqueMedical[0] | null>(null);

  const filteredData = historiqueMedical.filter(eleve => {
    const matchSearch = eleve.eleve.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       eleve.matricule.includes(searchTerm);
    const matchClasse = selectedClasse === "all" || eleve.classe === selectedClasse;
    return matchSearch && matchClasse;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique Médical</h1>
          <p className="text-muted-foreground">Dossiers médicaux et suivi des élèves</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background border shadow-lg z-50">
              <DropdownMenuItem>Export PDF</DropdownMenuItem>
              <DropdownMenuItem>Export Excel</DropdownMenuItem>
              <DropdownMenuItem>Export CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsGlobales.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.trend} ce trimestre
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="dossiers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dossiers">Dossiers Élèves</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          <TabsTrigger value="chroniques">Cas Chroniques</TabsTrigger>
        </TabsList>

        <TabsContent value="dossiers" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher par nom ou matricule..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Classe" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="Tle D">Tle D</SelectItem>
                    <SelectItem value="1ère A">1ère A</SelectItem>
                    <SelectItem value="2nde B">2nde B</SelectItem>
                    <SelectItem value="3ème C">3ème C</SelectItem>
                    <SelectItem value="4ème A">4ème A</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPeriode} onValueChange={setSelectedPeriode}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="semaine">Cette semaine</SelectItem>
                    <SelectItem value="mois">Ce mois</SelectItem>
                    <SelectItem value="trimestre">Ce trimestre</SelectItem>
                    <SelectItem value="annee">Cette année</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Plus de filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des dossiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dossiers Médicaux ({filteredData.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Groupe Sanguin</TableHead>
                    <TableHead>Allergies</TableHead>
                    <TableHead>Antécédents</TableHead>
                    <TableHead>Consultations</TableHead>
                    <TableHead>Dernière Visite</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((eleve) => (
                    <TableRow key={eleve.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{eleve.eleve}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{eleve.matricule}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{eleve.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{eleve.groupeSanguin}</Badge>
                      </TableCell>
                      <TableCell>
                        {eleve.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {eleve.allergies.map((allergie, idx) => (
                              <Badge key={idx} variant="destructive" className="text-xs">
                                {allergie}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Aucune</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {eleve.antecedents.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {eleve.antecedents.map((ant, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {ant}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={eleve.totalConsultations > 10 ? "bg-orange-500" : "bg-green-500"}>
                          {eleve.totalConsultations}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {eleve.derniereVisite}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedEleve(eleve)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              Dossier
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Dossier Médical - {eleve.eleve}</DialogTitle>
                              <DialogDescription>
                                Matricule: {eleve.matricule} | Classe: {eleve.classe}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              {/* Informations générales */}
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Informations Médicales</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Date de naissance:</span>
                                      <span>{eleve.dateNaissance}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Groupe sanguin:</span>
                                      <Badge variant="secondary">{eleve.groupeSanguin}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Total consultations:</span>
                                      <span className="font-bold">{eleve.totalConsultations}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Allergies & Antécédents</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div>
                                      <span className="text-muted-foreground text-sm">Allergies:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {eleve.allergies.length > 0 ? eleve.allergies.map((a, i) => (
                                          <Badge key={i} variant="destructive">{a}</Badge>
                                        )) : <span className="text-sm">Aucune connue</span>}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground text-sm">Antécédents:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {eleve.antecedents.length > 0 ? eleve.antecedents.map((a, i) => (
                                          <Badge key={i} variant="outline">{a}</Badge>
                                        )) : <span className="text-sm">Aucun</span>}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Historique des consultations */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <History className="h-4 w-4" />
                                    Historique des Consultations
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Motif</TableHead>
                                        <TableHead>Gravité</TableHead>
                                        <TableHead>Traitement</TableHead>
                                        <TableHead>Soignant</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {eleve.consultations.map((consultation, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell>{consultation.date}</TableCell>
                                          <TableCell>{consultation.motif}</TableCell>
                                          <TableCell>
                                            <Badge variant={
                                              consultation.gravite === "Grave" ? "destructive" :
                                              consultation.gravite === "Modérée" ? "default" : "secondary"
                                            }>
                                              {consultation.gravite}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{consultation.traitement}</TableCell>
                                          <TableCell>{consultation.medecin}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Évolution mensuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution des Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolutionMensuelle}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="consultations" stroke="hsl(var(--primary))" strokeWidth={2} name="Consultations" />
                    <Line type="monotone" dataKey="urgences" stroke="hsl(var(--destructive))" strokeWidth={2} name="Urgences" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition par motif */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Répartition par Motif</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={repartitionMotifs}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {repartitionMotifs.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Consultations par classe */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Consultations par Classe</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { classe: "6ème", count: 28 },
                    { classe: "5ème", count: 35 },
                    { classe: "4ème", count: 42 },
                    { classe: "3ème", count: 38 },
                    { classe: "2nde", count: 32 },
                    { classe: "1ère", count: 36 },
                    { classe: "Tle", count: 28 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="classe" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Consultations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chroniques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Élèves avec Conditions Chroniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Traitement en cours</TableHead>
                    <TableHead>Fréquence suivi</TableHead>
                    <TableHead>Prochain RDV</TableHead>
                    <TableHead>Contact urgence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historiqueMedical.filter(e => e.antecedents.length > 0).map((eleve) => (
                    <TableRow key={eleve.id}>
                      <TableCell className="font-medium">{eleve.eleve}</TableCell>
                      <TableCell><Badge variant="outline">{eleve.classe}</Badge></TableCell>
                      <TableCell>
                        {eleve.antecedents.map((ant, idx) => (
                          <Badge key={idx} variant="destructive" className="mr-1">{ant}</Badge>
                        ))}
                      </TableCell>
                      <TableCell>Selon ordonnance</TableCell>
                      <TableCell>Mensuel</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          15/01/2025
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Appeler parent
                        </Button>
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
