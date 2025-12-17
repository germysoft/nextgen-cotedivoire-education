import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, User, Heart, AlertTriangle, FileText, 
  Pill, Syringe, Eye, Edit, Printer, Download, Filter,
  Calendar, Phone, Mail, Shield, Activity, Droplet
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

// Types
interface FicheSante {
  id: number;
  eleve: string;
  matricule: string;
  classe: string;
  dateNaissance: string;
  sexe: "M" | "F";
  photo: string;
  groupeSanguin: string;
  taille: number; // cm
  poids: number; // kg
  imc: number;
  vision: { oeilDroit: string; oeilGauche: string; lunettes: boolean };
  audition: { oreilleDroite: string; oreilleGauche: string };
  allergies: { nom: string; gravite: "legere" | "moderee" | "severe"; reaction: string }[];
  vaccinations: { nom: string; date: string; rappel?: string }[];
  antecedents: { condition: string; depuis: string; traitement?: string }[];
  traitementEnCours: { medicament: string; posologie: string; duree: string }[];
  contactUrgence: { nom: string; relation: string; telephone: string };
  medecinTraitant: { nom: string; telephone: string };
  observations: string;
  derniereMAJ: string;
  ficheComplete: boolean;
}

// Mock data
const fichesSante: FicheSante[] = [
  {
    id: 1,
    eleve: "KOUASSI Jean",
    matricule: "2024-001234",
    classe: "Tle D",
    dateNaissance: "15/03/2006",
    sexe: "M",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    groupeSanguin: "A+",
    taille: 175,
    poids: 68,
    imc: 22.2,
    vision: { oeilDroit: "10/10", oeilGauche: "9/10", lunettes: false },
    audition: { oreilleDroite: "Normal", oreilleGauche: "Normal" },
    allergies: [
      { nom: "Pénicilline", gravite: "severe", reaction: "Choc anaphylactique" },
      { nom: "Arachides", gravite: "moderee", reaction: "Urticaire, gonflement" }
    ],
    vaccinations: [
      { nom: "BCG", date: "15/03/2006" },
      { nom: "DTP", date: "10/09/2024", rappel: "10/09/2034" },
      { nom: "Hépatite B", date: "01/06/2020" },
      { nom: "Fièvre jaune", date: "15/07/2022", rappel: "15/07/2032" },
    ],
    antecedents: [
      { condition: "Asthme léger", depuis: "2015", traitement: "Ventoline si crise" }
    ],
    traitementEnCours: [],
    contactUrgence: { nom: "KOUASSI Pierre", relation: "Père", telephone: "07 12 34 56 78" },
    medecinTraitant: { nom: "Dr. YAPI", telephone: "07 98 76 54 32" },
    observations: "Élève en bonne santé générale. Surveillance asthme saisonnier.",
    derniereMAJ: "15/12/2024",
    ficheComplete: true
  },
  {
    id: 2,
    eleve: "DIALLO Fatoumata",
    matricule: "2024-001235",
    classe: "1ère A",
    dateNaissance: "22/07/2007",
    sexe: "F",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    groupeSanguin: "O+",
    taille: 162,
    poids: 55,
    imc: 21.0,
    vision: { oeilDroit: "8/10", oeilGauche: "8/10", lunettes: true },
    audition: { oreilleDroite: "Normal", oreilleGauche: "Normal" },
    allergies: [],
    vaccinations: [
      { nom: "BCG", date: "22/07/2007" },
      { nom: "DTP", date: "05/09/2024", rappel: "05/09/2034" },
      { nom: "ROR", date: "22/07/2008" },
    ],
    antecedents: [
      { condition: "Diabète type 1", depuis: "2019", traitement: "Insuline (pompe)" }
    ],
    traitementEnCours: [
      { medicament: "Insuline Novorapid", posologie: "Selon glycémie", duree: "Permanent" }
    ],
    contactUrgence: { nom: "DIALLO Mariama", relation: "Mère", telephone: "05 23 45 67 89" },
    medecinTraitant: { nom: "Dr. KONÉ", telephone: "07 11 22 33 44" },
    observations: "Diabète bien contrôlé. Kit d'urgence disponible à l'infirmerie. Formation du personnel effectuée.",
    derniereMAJ: "14/12/2024",
    ficheComplete: true
  },
  {
    id: 3,
    eleve: "SANOGO Aminata",
    matricule: "2024-001237",
    classe: "3ème C",
    dateNaissance: "30/09/2009",
    sexe: "F",
    photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
    groupeSanguin: "AB-",
    taille: 158,
    poids: 48,
    imc: 19.2,
    vision: { oeilDroit: "10/10", oeilGauche: "10/10", lunettes: false },
    audition: { oreilleDroite: "Normal", oreilleGauche: "Normal" },
    allergies: [],
    vaccinations: [
      { nom: "BCG", date: "30/09/2009" },
      { nom: "DTP", date: "15/10/2023" },
    ],
    antecedents: [
      { condition: "Épilepsie", depuis: "2018", traitement: "Dépakine 500mg matin/soir" }
    ],
    traitementEnCours: [
      { medicament: "Dépakine 500mg", posologie: "1 matin + 1 soir", duree: "Permanent" }
    ],
    contactUrgence: { nom: "SANOGO Moussa", relation: "Père", telephone: "07 55 66 77 88" },
    medecinTraitant: { nom: "Dr. BAMBA", telephone: "05 99 88 77 66" },
    observations: "Épilepsie contrôlée sous traitement. Dernière crise: Mai 2023. Éviter activités à risque (natation non surveillée).",
    derniereMAJ: "14/12/2024",
    ficheComplete: true
  },
  {
    id: 4,
    eleve: "KONE Ibrahim",
    matricule: "2024-001238",
    classe: "4ème A",
    dateNaissance: "12/05/2010",
    sexe: "M",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    groupeSanguin: "O-",
    taille: 152,
    poids: 42,
    imc: 18.2,
    vision: { oeilDroit: "10/10", oeilGauche: "10/10", lunettes: false },
    audition: { oreilleDroite: "Normal", oreilleGauche: "Normal" },
    allergies: [
      { nom: "Latex", gravite: "moderee", reaction: "Éruption cutanée" }
    ],
    vaccinations: [
      { nom: "BCG", date: "12/05/2010" },
      { nom: "DTP", date: "20/09/2024", rappel: "20/09/2034" },
    ],
    antecedents: [
      { condition: "Asthme sévère", depuis: "2012", traitement: "Seretide + Ventoline" }
    ],
    traitementEnCours: [
      { medicament: "Seretide 250", posologie: "2 bouffées matin/soir", duree: "Permanent" },
      { medicament: "Ventoline", posologie: "Si crise", duree: "Au besoin" }
    ],
    contactUrgence: { nom: "KONE Awa", relation: "Mère", telephone: "07 44 55 66 77" },
    medecinTraitant: { nom: "Dr. TOURÉ", telephone: "05 33 22 11 00" },
    observations: "Asthme sévère avec crises fréquentes en saison sèche. Ventoline toujours sur lui. PAI établi.",
    derniereMAJ: "14/12/2024",
    ficheComplete: true
  },
  {
    id: 5,
    eleve: "TOURÉ Mohamed",
    matricule: "2024-001236",
    classe: "2nde B",
    dateNaissance: "08/01/2008",
    sexe: "M",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    groupeSanguin: "B+",
    taille: 170,
    poids: 62,
    imc: 21.5,
    vision: { oeilDroit: "10/10", oeilGauche: "10/10", lunettes: false },
    audition: { oreilleDroite: "Normal", oreilleGauche: "Normal" },
    allergies: [
      { nom: "Sulfamides", gravite: "legere", reaction: "Éruption cutanée légère" }
    ],
    vaccinations: [
      { nom: "BCG", date: "08/01/2008" },
    ],
    antecedents: [],
    traitementEnCours: [],
    contactUrgence: { nom: "TOURÉ Kadiatou", relation: "Mère", telephone: "07 88 99 00 11" },
    medecinTraitant: { nom: "Non renseigné", telephone: "-" },
    observations: "",
    derniereMAJ: "01/10/2024",
    ficheComplete: false
  },
];

// Statistiques
const statsGlobales = [
  { label: "Fiches complètes", value: "85%", icon: FileText, color: "text-green-600" },
  { label: "Élèves avec allergies", value: "12%", icon: AlertTriangle, color: "text-orange-600" },
  { label: "Conditions chroniques", value: "8%", icon: Heart, color: "text-red-600" },
  { label: "Vaccinations à jour", value: "92%", icon: Syringe, color: "text-blue-600" },
];

const getGraviteColor = (gravite: string) => {
  switch (gravite) {
    case "severe": return "bg-red-500 text-white";
    case "moderee": return "bg-orange-500 text-white";
    case "legere": return "bg-yellow-500 text-black";
    default: return "bg-gray-500";
  }
};

const getIMCCategory = (imc: number) => {
  if (imc < 18.5) return { label: "Insuffisant", color: "text-orange-500" };
  if (imc < 25) return { label: "Normal", color: "text-green-500" };
  if (imc < 30) return { label: "Surpoids", color: "text-yellow-500" };
  return { label: "Obésité", color: "text-red-500" };
};

export default function FichesSante() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [selectedFiche, setSelectedFiche] = useState<FicheSante | null>(null);

  const filteredFiches = fichesSante.filter(fiche => {
    const matchSearch = fiche.eleve.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       fiche.matricule.includes(searchTerm);
    const matchClasse = selectedClasse === "all" || fiche.classe === selectedClasse;
    const matchCondition = filterCondition === "all" || 
                          (filterCondition === "allergies" && fiche.allergies.length > 0) ||
                          (filterCondition === "chroniques" && fiche.antecedents.length > 0) ||
                          (filterCondition === "traitement" && fiche.traitementEnCours.length > 0) ||
                          (filterCondition === "incomplete" && !fiche.ficheComplete);
    return matchSearch && matchClasse && matchCondition;
  });

  const fichesIncompletes = fichesSante.filter(f => !f.ficheComplete).length;
  const pourcentageComplet = Math.round((fichesSante.filter(f => f.ficheComplete).length / fichesSante.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fiches Santé Élèves</h1>
          <p className="text-muted-foreground">Dossiers médicaux individuels et suivi sanitaire</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Fiche
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une Fiche Santé</DialogTitle>
                <DialogDescription>Renseigner les informations médicales de l'élève</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="general" className="py-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="medical">Médical</TabsTrigger>
                  <TabsTrigger value="allergies">Allergies</TabsTrigger>
                  <TabsTrigger value="vaccins">Vaccinations</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Élève (recherche)</Label>
                      <Input placeholder="Rechercher par nom ou matricule" />
                    </div>
                    <div className="space-y-2">
                      <Label>Groupe sanguin</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Taille (cm)</Label>
                      <Input type="number" placeholder="170" />
                    </div>
                    <div className="space-y-2">
                      <Label>Poids (kg)</Label>
                      <Input type="number" placeholder="65" />
                    </div>
                    <div className="space-y-2">
                      <Label>IMC (calculé)</Label>
                      <Input disabled placeholder="Automatique" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medical" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Vision</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Œil droit</Label>
                            <Input placeholder="10/10" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Œil gauche</Label>
                            <Input placeholder="10/10" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="lunettes" />
                          <Label htmlFor="lunettes" className="text-sm">Port de lunettes</Label>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Audition</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Oreille droite</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="État" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="diminue">Diminué</SelectItem>
                                <SelectItem value="severe">Sévère</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Oreille gauche</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="État" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="diminue">Diminué</SelectItem>
                                <SelectItem value="severe">Sévère</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-2">
                    <Label>Antécédents médicaux</Label>
                    <Textarea placeholder="Conditions médicales, traitements passés..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Traitements en cours</Label>
                    <Textarea placeholder="Médicaments actuels, posologie..." rows={3} />
                  </div>
                </TabsContent>
                <TabsContent value="allergies" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Allergies connues</Label>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-1 h-3 w-3" />
                        Ajouter
                      </Button>
                    </div>
                    <Card>
                      <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Allergène</Label>
                            <Input placeholder="Ex: Pénicilline" />
                          </div>
                          <div className="space-y-2">
                            <Label>Gravité</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Niveau" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="legere">Légère</SelectItem>
                                <SelectItem value="moderee">Modérée</SelectItem>
                                <SelectItem value="severe">Sévère</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Réaction type</Label>
                            <Input placeholder="Ex: Urticaire" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="vaccins" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Carnet de vaccination</Label>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-1 h-3 w-3" />
                        Ajouter vaccin
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {["BCG", "DTP", "Hépatite B", "ROR", "Fièvre jaune", "Méningite"].map(vaccin => (
                        <div key={vaccin} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{vaccin}</span>
                          <div className="flex items-center gap-2">
                            <Input type="date" className="w-40" placeholder="Date vaccin" />
                            <Input type="date" className="w-40" placeholder="Rappel" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="contacts" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Contact d'urgence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Nom complet</Label>
                          <Input placeholder="Nom et prénom" />
                        </div>
                        <div className="space-y-2">
                          <Label>Relation</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Lien" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                              <SelectItem value="pere">Père</SelectItem>
                              <SelectItem value="mere">Mère</SelectItem>
                              <SelectItem value="tuteur">Tuteur</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Téléphone</Label>
                          <Input placeholder="07 XX XX XX XX" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Médecin traitant</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom du médecin</Label>
                          <Input placeholder="Dr. ..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Téléphone cabinet</Label>
                          <Input placeholder="XX XX XX XX XX" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline">Annuler</Button>
                <Button>Enregistrer la fiche</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsGlobales.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerte fiches incomplètes */}
      {fichesIncompletes > 0 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Fiches incomplètes</p>
                  <p className="text-sm text-muted-foreground">
                    {fichesIncompletes} fiche(s) santé nécessite(nt) des informations complémentaires
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Complétude</span>
                  <div className="flex items-center gap-2">
                    <Progress value={pourcentageComplet} className="w-24" />
                    <span className="font-medium">{pourcentageComplet}%</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFilterCondition("incomplete")}>
                  Voir les fiches
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <Select value={filterCondition} onValueChange={setFilterCondition}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">Tous les élèves</SelectItem>
                <SelectItem value="allergies">Avec allergies</SelectItem>
                <SelectItem value="chroniques">Conditions chroniques</SelectItem>
                <SelectItem value="traitement">Sous traitement</SelectItem>
                <SelectItem value="incomplete">Fiches incomplètes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fiches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Fiches Santé ({filteredFiches.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Groupe Sanguin</TableHead>
                <TableHead>IMC</TableHead>
                <TableHead>Allergies</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Traitements</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiches.map((fiche) => {
                const imcInfo = getIMCCategory(fiche.imc);
                return (
                  <TableRow key={fiche.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={fiche.photo} 
                          alt={fiche.eleve}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{fiche.eleve}</div>
                          <div className="text-xs text-muted-foreground">{fiche.matricule}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{fiche.classe}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Droplet className="h-3 w-3" />
                        {fiche.groupeSanguin}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={imcInfo.color}>{fiche.imc.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground ml-1">({imcInfo.label})</span>
                    </TableCell>
                    <TableCell>
                      {fiche.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {fiche.allergies.slice(0, 2).map((allergie, idx) => (
                            <Badge key={idx} className={getGraviteColor(allergie.gravite)}>
                              {allergie.nom}
                            </Badge>
                          ))}
                          {fiche.allergies.length > 2 && (
                            <Badge variant="outline">+{fiche.allergies.length - 2}</Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucune</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {fiche.antecedents.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {fiche.antecedents.map((ant, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Heart className="h-3 w-3 mr-1" />
                              {ant.condition}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">RAS</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {fiche.traitementEnCours.length > 0 ? (
                        <Badge className="bg-purple-500">
                          <Pill className="h-3 w-3 mr-1" />
                          {fiche.traitementEnCours.length} médicament(s)
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucun</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {fiche.ficheComplete ? (
                        <Badge className="bg-green-500">Complète</Badge>
                      ) : (
                        <Badge variant="destructive">Incomplète</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedFiche(fiche)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <img 
                                  src={fiche.photo} 
                                  alt={fiche.eleve}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                  <div>{fiche.eleve}</div>
                                  <div className="text-sm font-normal text-muted-foreground">
                                    {fiche.matricule} | {fiche.classe}
                                  </div>
                                </div>
                              </DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="general" className="py-4">
                              <TabsList>
                                <TabsTrigger value="general">Informations</TabsTrigger>
                                <TabsTrigger value="allergies">Allergies</TabsTrigger>
                                <TabsTrigger value="vaccins">Vaccinations</TabsTrigger>
                                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                              </TabsList>
                              <TabsContent value="general" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Données biométriques</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date naissance:</span>
                                        <span>{fiche.dateNaissance}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Groupe sanguin:</span>
                                        <Badge variant="secondary">{fiche.groupeSanguin}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Taille:</span>
                                        <span>{fiche.taille} cm</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Poids:</span>
                                        <span>{fiche.poids} kg</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">IMC:</span>
                                        <span className={getIMCCategory(fiche.imc).color}>
                                          {fiche.imc.toFixed(1)} ({getIMCCategory(fiche.imc).label})
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Vision & Audition</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Œil droit:</span>
                                        <span>{fiche.vision.oeilDroit}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Œil gauche:</span>
                                        <span>{fiche.vision.oeilGauche}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Port lunettes:</span>
                                        <span>{fiche.vision.lunettes ? "Oui" : "Non"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Audition:</span>
                                        <span>{fiche.audition.oreilleDroite} / {fiche.audition.oreilleGauche}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                                {fiche.antecedents.length > 0 && (
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Antécédents médicaux</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Condition</TableHead>
                                            <TableHead>Depuis</TableHead>
                                            <TableHead>Traitement</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {fiche.antecedents.map((ant, idx) => (
                                            <TableRow key={idx}>
                                              <TableCell className="font-medium">{ant.condition}</TableCell>
                                              <TableCell>{ant.depuis}</TableCell>
                                              <TableCell>{ant.traitement || "-"}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                )}
                                {fiche.traitementEnCours.length > 0 && (
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm flex items-center gap-2">
                                        <Pill className="h-4 w-4" />
                                        Traitements en cours
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Médicament</TableHead>
                                            <TableHead>Posologie</TableHead>
                                            <TableHead>Durée</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {fiche.traitementEnCours.map((trt, idx) => (
                                            <TableRow key={idx}>
                                              <TableCell className="font-medium">{trt.medicament}</TableCell>
                                              <TableCell>{trt.posologie}</TableCell>
                                              <TableCell>{trt.duree}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                )}
                                {fiche.observations && (
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Observations</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm">{fiche.observations}</p>
                                    </CardContent>
                                  </Card>
                                )}
                              </TabsContent>
                              <TabsContent value="allergies" className="mt-4">
                                {fiche.allergies.length > 0 ? (
                                  <div className="space-y-4">
                                    {fiche.allergies.map((allergie, idx) => (
                                      <Card key={idx} className={allergie.gravite === "severe" ? "border-red-500" : ""}>
                                        <CardContent className="pt-4">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <AlertTriangle className={`h-5 w-5 ${
                                                allergie.gravite === "severe" ? "text-red-500" :
                                                allergie.gravite === "moderee" ? "text-orange-500" : "text-yellow-500"
                                              }`} />
                                              <div>
                                                <p className="font-medium">{allergie.nom}</p>
                                                <p className="text-sm text-muted-foreground">Réaction: {allergie.reaction}</p>
                                              </div>
                                            </div>
                                            <Badge className={getGraviteColor(allergie.gravite)}>
                                              {allergie.gravite.charAt(0).toUpperCase() + allergie.gravite.slice(1)}
                                            </Badge>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Aucune allergie connue</p>
                                  </div>
                                )}
                              </TabsContent>
                              <TabsContent value="vaccins" className="mt-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Vaccin</TableHead>
                                      <TableHead>Date vaccination</TableHead>
                                      <TableHead>Prochain rappel</TableHead>
                                      <TableHead>Statut</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {fiche.vaccinations.map((vaccin, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="font-medium">
                                          <div className="flex items-center gap-2">
                                            <Syringe className="h-4 w-4" />
                                            {vaccin.nom}
                                          </div>
                                        </TableCell>
                                        <TableCell>{vaccin.date}</TableCell>
                                        <TableCell>{vaccin.rappel || "-"}</TableCell>
                                        <TableCell>
                                          <Badge className="bg-green-500">À jour</Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TabsContent>
                              <TabsContent value="contacts" className="mt-4 space-y-4">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      Contact d'urgence
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nom:</span>
                                        <span className="font-medium">{fiche.contactUrgence.nom}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Relation:</span>
                                        <span>{fiche.contactUrgence.relation}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Téléphone:</span>
                                        <span className="font-mono">{fiche.contactUrgence.telephone}</span>
                                      </div>
                                    </div>
                                    <Button className="mt-4 w-full" variant="outline">
                                      <Phone className="mr-2 h-4 w-4" />
                                      Appeler
                                    </Button>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <Activity className="h-4 w-4" />
                                      Médecin traitant
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nom:</span>
                                        <span className="font-medium">{fiche.medecinTraitant.nom}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Téléphone:</span>
                                        <span className="font-mono">{fiche.medecinTraitant.telephone}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                            <div className="flex justify-between items-center pt-4 border-t">
                              <span className="text-sm text-muted-foreground">
                                Dernière mise à jour: {fiche.derniereMAJ}
                              </span>
                              <div className="flex gap-2">
                                <Button variant="outline">
                                  <Printer className="mr-2 h-4 w-4" />
                                  Imprimer
                                </Button>
                                <Button>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
