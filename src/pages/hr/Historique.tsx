import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User, Calendar, Award, TrendingUp, Download, Search,
  Briefcase, GraduationCap, ChevronRight, FileText, Star
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { generateCVPDF } from "@/components/hr/ContratPDFGenerator";

interface PersonnelHistorique {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  poste: string;
  departement: string;
  dateEmbauche: string;
  anciennete: number;
  statut: string;
  typeContrat: string;
  nationalite: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  ville: string;
  email: string;
  telephone: string;
  parcours: {
    periode: string;
    poste: string;
    grade: string;
    salaire: string;
    statut: string;
  }[];
  formations: {
    annee: string;
    titre: string;
    organisme: string;
    duree: string;
    certificat: boolean;
  }[];
  evaluations: {
    annee: string;
    note: number;
    appreciation: string;
    evaluateur: string;
  }[];
  promotions: {
    date: string;
    ancien: string;
    nouveau: string;
    augmentation: string;
  }[];
  diplomes: {
    intitule: string;
    etablissement: string;
    anneeObtention: string;
    mention?: string;
  }[];
  languesParles: {
    langue: string;
    niveau: string;
  }[];
  competences: string[];
}

const mockPersonnelHistorique: PersonnelHistorique[] = [
  {
    id: "1",
    matricule: "EMP001",
    nom: "KOFFI",
    prenom: "Yao",
    poste: "Professeur Mathématiques",
    departement: "Pédagogie",
    dateEmbauche: "2019-09-01",
    anciennete: 6,
    statut: "Certifié",
    typeContrat: "CDI",
    nationalite: "Ivoirienne",
    dateNaissance: "15/03/1985",
    lieuNaissance: "Abidjan",
    adresse: "Cocody Riviera 3",
    ville: "Abidjan",
    email: "y.koffi@gs-excellence.ci",
    telephone: "+225 07 07 07 07 07",
    parcours: [
      { periode: "2024-2025", poste: "Enseignant Mathématiques", grade: "Certifié", salaire: "650K", statut: "En cours" },
      { periode: "2021-2024", poste: "Enseignant Mathématiques", grade: "Stagiaire", salaire: "450K", statut: "Terminé" },
      { periode: "2019-2021", poste: "Vacataire Mathématiques", grade: "Contractuel", salaire: "300K", statut: "Terminé" },
    ],
    formations: [
      { annee: "2023", titre: "Formation Pédagogie Numérique", organisme: "MENA", duree: "40h", certificat: true },
      { annee: "2022", titre: "Gestion de Classe", organisme: "INFPE", duree: "30h", certificat: true },
      { annee: "2021", titre: "Évaluation par Compétences", organisme: "MENA", duree: "25h", certificat: true },
    ],
    evaluations: [
      { annee: "2023-2024", note: 18, appreciation: "Excellent", evaluateur: "Directeur DIALLO" },
      { annee: "2022-2023", note: 16, appreciation: "Très Bien", evaluateur: "Directeur DIALLO" },
      { annee: "2021-2022", note: 15, appreciation: "Bien", evaluateur: "Censeur KOFFI" },
    ],
    promotions: [
      { date: "01 Sept 2024", ancien: "Stagiaire", nouveau: "Certifié", augmentation: "+44%" },
      { date: "01 Sept 2021", ancien: "Contractuel", nouveau: "Stagiaire", augmentation: "+50%" },
    ],
    diplomes: [
      { intitule: "Master en Mathématiques", etablissement: "Université FHB Cocody", anneeObtention: "2018", mention: "Bien" },
      { intitule: "Licence en Mathématiques", etablissement: "Université FHB Cocody", anneeObtention: "2016" },
      { intitule: "CAPES Mathématiques", etablissement: "ENS Abidjan", anneeObtention: "2019", mention: "Assez Bien" },
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif" },
      { langue: "Anglais", niveau: "Intermédiaire" },
    ],
    competences: ["Mathématiques", "Informatique", "Gestion de classe", "Évaluation", "Tutorat"]
  },
  {
    id: "2",
    matricule: "EMP002",
    nom: "DIALLO",
    prenom: "Fatoumata",
    poste: "Professeur Français",
    departement: "Pédagogie",
    dateEmbauche: "2018-09-01",
    anciennete: 7,
    statut: "Certifié",
    typeContrat: "CDI",
    nationalite: "Ivoirienne",
    dateNaissance: "22/07/1982",
    lieuNaissance: "Bouaké",
    adresse: "Yopougon Maroc",
    ville: "Abidjan",
    email: "f.diallo@gs-excellence.ci",
    telephone: "+225 05 05 05 05 05",
    parcours: [
      { periode: "2024-2025", poste: "Enseignant Français", grade: "Certifié", salaire: "680K", statut: "En cours" },
      { periode: "2020-2024", poste: "Enseignant Français", grade: "Certifié", salaire: "600K", statut: "Terminé" },
      { periode: "2018-2020", poste: "Enseignant Français", grade: "Stagiaire", salaire: "400K", statut: "Terminé" },
    ],
    formations: [
      { annee: "2024", titre: "Littérature Contemporaine Africaine", organisme: "UCAO", duree: "20h", certificat: true },
      { annee: "2023", titre: "Pédagogie Différenciée", organisme: "MENA", duree: "35h", certificat: true },
    ],
    evaluations: [
      { annee: "2023-2024", note: 17, appreciation: "Très Bien", evaluateur: "Directeur DIALLO" },
      { annee: "2022-2023", note: 17, appreciation: "Très Bien", evaluateur: "Directeur DIALLO" },
    ],
    promotions: [
      { date: "01 Sept 2020", ancien: "Stagiaire", nouveau: "Certifié", augmentation: "+50%" },
    ],
    diplomes: [
      { intitule: "Master Lettres Modernes", etablissement: "Université FHB Cocody", anneeObtention: "2017", mention: "Bien" },
      { intitule: "CAPES Français", etablissement: "ENS Abidjan", anneeObtention: "2018" },
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif" },
      { langue: "Anglais", niveau: "Courant" },
      { langue: "Espagnol", niveau: "Notions" },
    ],
    competences: ["Littérature", "Grammaire", "Rédaction", "Analyse littéraire", "Animation culturelle"]
  },
  {
    id: "3",
    matricule: "EMP003",
    nom: "TOURÉ",
    prenom: "Mohamed",
    poste: "Professeur Physique",
    departement: "Pédagogie",
    dateEmbauche: "2022-09-01",
    anciennete: 3,
    statut: "Contractuel",
    typeContrat: "CDD",
    nationalite: "Ivoirienne",
    dateNaissance: "10/11/1990",
    lieuNaissance: "Korhogo",
    adresse: "Angré 8ème Tranche",
    ville: "Abidjan",
    email: "m.toure@gs-excellence.ci",
    telephone: "+225 01 01 01 01 01",
    parcours: [
      { periode: "2024-2025", poste: "Enseignant Physique", grade: "Contractuel", salaire: "550K", statut: "En cours" },
      { periode: "2022-2024", poste: "Enseignant Physique", grade: "Contractuel", salaire: "480K", statut: "Terminé" },
    ],
    formations: [
      { annee: "2023", titre: "Expériences de Physique", organisme: "INFPE", duree: "20h", certificat: true },
    ],
    evaluations: [
      { annee: "2023-2024", note: 15, appreciation: "Bien", evaluateur: "Censeur BAMBA" },
    ],
    promotions: [],
    diplomes: [
      { intitule: "Licence Physique-Chimie", etablissement: "Université Nangui Abrogoua", anneeObtention: "2021" },
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif" },
    ],
    competences: ["Physique", "Chimie", "Expérimentation", "Laboratoire"]
  },
  {
    id: "4",
    matricule: "EMP004",
    nom: "BAMBA",
    prenom: "Sarah",
    poste: "Secrétaire Générale",
    departement: "Administration",
    dateEmbauche: "2015-01-15",
    anciennete: 10,
    statut: "Permanent",
    typeContrat: "CDI",
    nationalite: "Ivoirienne",
    dateNaissance: "05/05/1980",
    lieuNaissance: "Abidjan",
    adresse: "Plateau Dokui",
    ville: "Abidjan",
    email: "s.bamba@gs-excellence.ci",
    telephone: "+225 07 77 77 77 77",
    parcours: [
      { periode: "2020-2025", poste: "Secrétaire Générale", grade: "Permanent", salaire: "450K", statut: "En cours" },
      { periode: "2017-2020", poste: "Secrétaire Administrative", grade: "Permanent", salaire: "350K", statut: "Terminé" },
      { periode: "2015-2017", poste: "Assistante Administrative", grade: "Contractuel", salaire: "250K", statut: "Terminé" },
    ],
    formations: [
      { annee: "2022", titre: "Management Administratif", organisme: "AGEFOP", duree: "50h", certificat: true },
      { annee: "2020", titre: "Bureautique Avancée", organisme: "Microsoft", duree: "30h", certificat: true },
    ],
    evaluations: [
      { annee: "2023-2024", note: 19, appreciation: "Excellent", evaluateur: "Directeur Général" },
      { annee: "2022-2023", note: 18, appreciation: "Excellent", evaluateur: "Directeur Général" },
    ],
    promotions: [
      { date: "01 Jan 2020", ancien: "Secrétaire Administrative", nouveau: "Secrétaire Générale", augmentation: "+29%" },
      { date: "01 Jan 2017", ancien: "Assistante Administrative", nouveau: "Secrétaire Administrative", augmentation: "+40%" },
    ],
    diplomes: [
      { intitule: "BTS Assistante de Direction", etablissement: "INPHB Yamoussoukro", anneeObtention: "2012", mention: "Bien" },
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif" },
      { langue: "Anglais", niveau: "Courant" },
    ],
    competences: ["Administration", "Bureautique", "Communication", "Organisation", "Gestion documentaire"]
  },
];

export default function HistoriqueCarriere() {
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelHistorique>(mockPersonnelHistorique[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartement, setFilterDepartement] = useState<string>("all");

  const filteredPersonnel = mockPersonnelHistorique.filter(p => {
    const matchSearch = 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDepartement === "all" || p.departement === filterDepartement;
    return matchSearch && matchDept;
  });

  const handleExportCV = () => {
    generateCVPDF(selectedPersonnel);
    toast.success("CV exporté avec succès");
  };

  const getEvaluationColor = (note: number) => {
    if (note >= 16) return "text-green-600";
    if (note >= 14) return "text-blue-600";
    if (note >= 12) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique Carrière</h1>
          <p className="text-muted-foreground">Parcours professionnel complet du personnel</p>
        </div>
        <Button onClick={handleExportCV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CV
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Liste du personnel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Personnel</CardTitle>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                <SelectTrigger>
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Pédagogie">Pédagogie</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Comptabilité">Comptabilité</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <div className="space-y-2">
              {filteredPersonnel.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersonnel(p)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPersonnel.id === p.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.prenom} {p.nom}</p>
                      <p className={`text-xs truncate ${
                        selectedPersonnel.id === p.id 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}>
                        {p.poste}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Détails du personnel sélectionné */}
        <div className="lg:col-span-3 space-y-6">
          {/* En-tête avec infos principales */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{selectedPersonnel.prenom} {selectedPersonnel.nom}</CardTitle>
                    <p className="text-muted-foreground">
                      {selectedPersonnel.poste} • {selectedPersonnel.statut} • Depuis {new Date(selectedPersonnel.dateEmbauche).getFullYear()}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedPersonnel.matricule}</p>
                  </div>
                </div>
                <Badge variant="default" className="text-base px-4 py-2">
                  {selectedPersonnel.anciennete} ans d'ancienneté
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Statistiques */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ancienneté</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedPersonnel.anciennete} ans</div>
                <p className="text-xs text-muted-foreground">
                  Depuis {new Date(selectedPersonnel.dateEmbauche).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promotions</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{selectedPersonnel.promotions.length}</div>
                <p className="text-xs text-muted-foreground">Grade: {selectedPersonnel.statut}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Formations</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedPersonnel.formations.length}</div>
                <p className="text-xs text-muted-foreground">Certifications obtenues</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dernière Évaluation</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEvaluationColor(selectedPersonnel.evaluations[0]?.note || 0)}`}>
                  {selectedPersonnel.evaluations[0]?.note || '-'}/20
                </div>
                <p className="text-xs text-muted-foreground">{selectedPersonnel.evaluations[0]?.appreciation || '-'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Onglets de détails */}
          <Tabs defaultValue="parcours" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="parcours">Parcours</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
              <TabsTrigger value="formations">Formations</TabsTrigger>
              <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
              <TabsTrigger value="diplomes">Diplômes</TabsTrigger>
            </TabsList>

            <TabsContent value="parcours">
              <Card>
                <CardHeader>
                  <CardTitle>Parcours Professionnel</CardTitle>
                  <CardDescription>Évolution au sein de l'établissement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {selectedPersonnel.parcours.map((p, idx) => (
                        <div key={idx} className="relative pl-10">
                          <div className={`absolute left-2 top-1.5 w-4 h-4 rounded-full border-2 ${
                            p.statut === "En cours" 
                              ? "bg-primary border-primary" 
                              : "bg-background border-muted-foreground"
                          }`} />
                          <Card className={p.statut === "En cours" ? "border-primary" : ""}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{p.poste}</h3>
                                  <p className="text-sm text-muted-foreground">{p.periode}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline">{p.grade}</Badge>
                                  <p className="text-sm font-semibold mt-1">{p.salaire} FCFA</p>
                                </div>
                              </div>
                              {p.statut === "En cours" && (
                                <Badge className="mt-2" variant="default">Poste actuel</Badge>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promotions">
              <div className="space-y-4">
                {selectedPersonnel.promotions.length > 0 ? (
                  selectedPersonnel.promotions.map((p, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Promotion</h3>
                              <p className="text-sm text-muted-foreground">{p.date}</p>
                            </div>
                          </div>
                          <Badge variant="default" className="text-lg">{p.augmentation}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="p-3 rounded-lg bg-muted">
                            <p className="text-xs text-muted-foreground">De</p>
                            <p className="font-semibold">{p.ancien}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-50">
                            <p className="text-xs text-muted-foreground">À</p>
                            <p className="font-semibold text-green-600">{p.nouveau}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Aucune promotion enregistrée</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="formations">
              <div className="grid gap-4 md:grid-cols-2">
                {selectedPersonnel.formations.map((f, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{f.titre}</h3>
                        {f.certificat && (
                          <Badge variant="default" className="gap-1">
                            <Award className="h-3 w-3" />
                            Certifié
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Organisme</span>
                          <span className="font-medium">{f.organisme}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Année</span>
                          <span className="font-medium">{f.annee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durée</span>
                          <span className="font-medium">{f.duree}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="evaluations">
              <Card>
                <CardHeader>
                  <CardTitle>Évaluations Annuelles</CardTitle>
                  <CardDescription>Historique des performances</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Année</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Progression</TableHead>
                        <TableHead>Appréciation</TableHead>
                        <TableHead>Évaluateur</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPersonnel.evaluations.map((e, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{e.annee}</TableCell>
                          <TableCell>
                            <span className={`text-lg font-bold ${getEvaluationColor(e.note)}`}>
                              {e.note}/20
                            </span>
                          </TableCell>
                          <TableCell>
                            <Progress value={e.note * 5} className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              e.appreciation === "Excellent" ? "default" :
                              e.appreciation === "Très Bien" ? "secondary" :
                              "outline"
                            }>
                              {e.appreciation}
                            </Badge>
                          </TableCell>
                          <TableCell>{e.evaluateur}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diplomes">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Diplômes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPersonnel.diplomes.map((d, idx) => (
                        <div key={idx} className="p-3 rounded-lg border">
                          <h4 className="font-semibold">{d.intitule}</h4>
                          <p className="text-sm text-muted-foreground">{d.etablissement}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{d.anneeObtention}</Badge>
                            {d.mention && <Badge variant="secondary">{d.mention}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Langues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPersonnel.languesParles.map((l, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="font-medium">{l.langue}</span>
                            <Badge variant="outline">{l.niveau}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Compétences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPersonnel.competences.map((c, idx) => (
                          <Badge key={idx} variant="secondary">{c}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
