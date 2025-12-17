import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Search, Filter, Download, Upload, Eye, Edit, CheckCircle2, XCircle,
  AlertTriangle, Users, FileText, Clock, UserPlus, Calendar, MapPin,
  Phone, Mail, School, BookOpen, FileCheck, Send, Printer, Trash2,
  ArrowRight, Building, User, Plus
} from "lucide-react";

interface Preinscription {
  id: string;
  reference: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: "M" | "F";
  niveauDemande: string;
  etablissementOrigine: string;
  moyenneAnnuelle: number;
  telephoneParent: string;
  emailParent: string;
  statut: "en_attente" | "validee" | "rejetee" | "complete";
  dateDepot: string;
  dateLimite: string;
  documentsComplets: boolean;
  motifRejet?: string;
}

interface DocumentRequis {
  id: string;
  nom: string;
  obligatoire: boolean;
  fourni: boolean;
  dateReception?: string;
}

const mockPreinscriptions: Preinscription[] = [
  { id: "1", reference: "PRE2024-001", nom: "DIABY", prenoms: "Mariam", dateNaissance: "2012-03-15", lieuNaissance: "Abidjan", sexe: "F", niveauDemande: "6ème", etablissementOrigine: "EPP Plateau", moyenneAnnuelle: 15.5, telephoneParent: "+225 07 12 34 56 78", emailParent: "diaby.famille@email.com", statut: "validee", dateDepot: "2024-01-10", dateLimite: "2024-02-28", documentsComplets: true },
  { id: "2", reference: "PRE2024-002", nom: "SANOGO", prenoms: "Bakary", dateNaissance: "2011-08-22", lieuNaissance: "Bouaké", sexe: "M", niveauDemande: "6ème", etablissementOrigine: "EPP Bouaké Centre", moyenneAnnuelle: 14.2, telephoneParent: "+225 05 98 76 54 32", emailParent: "sanogo.b@email.com", statut: "en_attente", dateDepot: "2024-01-12", dateLimite: "2024-02-28", documentsComplets: false },
  { id: "3", reference: "PRE2024-003", nom: "KOFFI", prenoms: "Ange", dateNaissance: "2010-05-10", lieuNaissance: "Yamoussoukro", sexe: "M", niveauDemande: "5ème", etablissementOrigine: "Collège Municipal", moyenneAnnuelle: 12.8, telephoneParent: "+225 01 23 45 67 89", emailParent: "koffi.famille@email.com", statut: "en_attente", dateDepot: "2024-01-14", dateLimite: "2024-02-28", documentsComplets: true },
  { id: "4", reference: "PRE2024-004", nom: "BAMBA", prenoms: "Fatoumata", dateNaissance: "2011-12-03", lieuNaissance: "San Pedro", sexe: "F", niveauDemande: "6ème", etablissementOrigine: "EPP San Pedro", moyenneAnnuelle: 16.7, telephoneParent: "+225 07 65 43 21 09", emailParent: "bamba.f@email.com", statut: "validee", dateDepot: "2024-01-08", dateLimite: "2024-02-28", documentsComplets: true },
  { id: "5", reference: "PRE2024-005", nom: "TOURE", prenoms: "Ibrahima", dateNaissance: "2009-07-18", lieuNaissance: "Korhogo", sexe: "M", niveauDemande: "4ème", etablissementOrigine: "Collège Moderne", moyenneAnnuelle: 11.5, telephoneParent: "+225 05 11 22 33 44", emailParent: "toure.i@email.com", statut: "rejetee", dateDepot: "2024-01-05", dateLimite: "2024-02-28", documentsComplets: false, motifRejet: "Dossier incomplet et moyenne insuffisante" },
  { id: "6", reference: "PRE2024-006", nom: "COULIBALY", prenoms: "Aminata", dateNaissance: "2012-09-25", lieuNaissance: "Abidjan", sexe: "F", niveauDemande: "6ème", etablissementOrigine: "EPP Cocody", moyenneAnnuelle: 17.2, telephoneParent: "+225 07 88 99 00 11", emailParent: "coulibaly.a@email.com", statut: "complete", dateDepot: "2024-01-06", dateLimite: "2024-02-28", documentsComplets: true },
];

const mockDocuments: DocumentRequis[] = [
  { id: "1", nom: "Extrait d'acte de naissance", obligatoire: true, fourni: true, dateReception: "2024-01-10" },
  { id: "2", nom: "Bulletins des 3 trimestres", obligatoire: true, fourni: true, dateReception: "2024-01-10" },
  { id: "3", nom: "Certificat de scolarité", obligatoire: true, fourni: true, dateReception: "2024-01-10" },
  { id: "4", nom: "Photos d'identité (4)", obligatoire: true, fourni: false },
  { id: "5", nom: "Photocopie CNI parent", obligatoire: true, fourni: true, dateReception: "2024-01-10" },
  { id: "6", nom: "Certificat médical", obligatoire: false, fourni: false },
];

export default function Preinscriptions() {
  const [preinscriptions, setPreinscriptions] = useState<Preinscription[]>(mockPreinscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPreinscription, setSelectedPreinscription] = useState<Preinscription | null>(null);

  const filteredPreinscriptions = preinscriptions.filter(p => {
    const matchesSearch = 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any; label: string }> = {
      en_attente: { variant: "outline", icon: Clock, label: "En attente" },
      validee: { variant: "default", icon: CheckCircle2, label: "Validée" },
      rejetee: { variant: "destructive", icon: XCircle, label: "Rejetée" },
      complete: { variant: "secondary", icon: FileCheck, label: "Inscrite" }
    };
    const style = styles[statut] || styles.en_attente;
    const Icon = style.icon;
    return (
      <Badge variant={style.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {style.label}
      </Badge>
    );
  };

  const viewDetail = (preinscription: Preinscription) => {
    setSelectedPreinscription(preinscription);
    setShowDetailDialog(true);
  };

  const validatePreinscription = (id: string) => {
    setPreinscriptions(preinscriptions.map(p => 
      p.id === id ? { ...p, statut: "validee" } : p
    ));
    toast.success("Préinscription validée");
  };

  const rejectPreinscription = (id: string) => {
    setPreinscriptions(preinscriptions.map(p => 
      p.id === id ? { ...p, statut: "rejetee", motifRejet: "Dossier incomplet" } : p
    ));
    toast.success("Préinscription rejetée");
  };

  const convertToInscription = (id: string) => {
    setPreinscriptions(preinscriptions.map(p => 
      p.id === id ? { ...p, statut: "complete" } : p
    ));
    toast.success("Préinscription convertie en inscription définitive");
  };

  const stats = {
    total: preinscriptions.length,
    enAttente: preinscriptions.filter(p => p.statut === "en_attente").length,
    validees: preinscriptions.filter(p => p.statut === "validee").length,
    rejetees: preinscriptions.filter(p => p.statut === "rejetee").length,
    inscrites: preinscriptions.filter(p => p.statut === "complete").length,
    tauxValidation: Math.round((preinscriptions.filter(p => p.statut === "validee" || p.statut === "complete").length / preinscriptions.length) * 100)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Préinscriptions MENA</h1>
          <p className="text-muted-foreground">Gestion des demandes de préinscription en ligne</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer liste
          </Button>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle préinscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvelle préinscription</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom</Label>
                  <Input placeholder="Nom de famille" />
                </div>
                <div>
                  <Label>Prénoms</Label>
                  <Input placeholder="Prénoms" />
                </div>
                <div>
                  <Label>Date de naissance</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Lieu de naissance</Label>
                  <Input placeholder="Ville de naissance" />
                </div>
                <div>
                  <Label>Sexe</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Niveau demandé</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6eme">6ème</SelectItem>
                      <SelectItem value="5eme">5ème</SelectItem>
                      <SelectItem value="4eme">4ème</SelectItem>
                      <SelectItem value="3eme">3ème</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Établissement d'origine</Label>
                  <Input placeholder="Nom de l'établissement" />
                </div>
                <div>
                  <Label>Téléphone parent</Label>
                  <Input placeholder="+225 07 00 00 00 00" />
                </div>
                <div>
                  <Label>Email parent</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewDialog(false)}>Annuler</Button>
                <Button onClick={() => { setShowNewDialog(false); toast.success("Préinscription créée"); }}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.enAttente}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.validees}</p>
                <p className="text-xs text-muted-foreground">Validées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejetees}</p>
                <p className="text-xs text-muted-foreground">Rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inscrites}</p>
                <p className="text-xs text-muted-foreground">Inscrites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <School className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.tauxValidation}%</p>
                <p className="text-xs text-muted-foreground">Taux validation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress towards capacity */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Capacité d'accueil 6ème</span>
            <span className="text-sm text-muted-foreground">45 / 120 places</span>
          </div>
          <Progress value={37.5} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">75 places restantes pour la rentrée 2024-2025</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Liste des préinscriptions</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Demandes de préinscription</CardTitle>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="validee">Validées</SelectItem>
                      <SelectItem value="rejetee">Rejetées</SelectItem>
                      <SelectItem value="complete">Inscrites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Origine</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPreinscriptions.map(preinscription => (
                    <TableRow key={preinscription.id}>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{preinscription.reference}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            preinscription.sexe === "F" ? "bg-pink-100" : "bg-blue-100"
                          }`}>
                            <User className={`h-4 w-4 ${preinscription.sexe === "F" ? "text-pink-600" : "text-blue-600"}`} />
                          </div>
                          <div>
                            <p className="font-medium">{preinscription.nom} {preinscription.prenoms}</p>
                            <p className="text-xs text-muted-foreground">{preinscription.dateNaissance}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{preinscription.niveauDemande}</Badge></TableCell>
                      <TableCell className="text-sm">{preinscription.etablissementOrigine}</TableCell>
                      <TableCell>
                        <Badge variant={preinscription.moyenneAnnuelle >= 14 ? "default" : preinscription.moyenneAnnuelle >= 12 ? "secondary" : "destructive"}>
                          {preinscription.moyenneAnnuelle}/20
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {preinscription.documentsComplets ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complet
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Incomplet
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(preinscription.statut)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => viewDetail(preinscription)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {preinscription.statut === "en_attente" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => validatePreinscription(preinscription.id)}>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => rejectPreinscription(preinscription.id)}>
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                          {preinscription.statut === "validee" && (
                            <Button variant="ghost" size="icon" onClick={() => convertToInscription(preinscription.id)}>
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des préinscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { phase: "Ouverture des préinscriptions", debut: "2024-01-01", fin: "2024-02-28", statut: "en_cours" },
                  { phase: "Étude des dossiers", debut: "2024-03-01", fin: "2024-03-15", statut: "a_venir" },
                  { phase: "Publication des résultats", debut: "2024-03-20", fin: "2024-03-20", statut: "a_venir" },
                  { phase: "Confirmations d'inscription", debut: "2024-03-25", fin: "2024-04-30", statut: "a_venir" },
                  { phase: "Rentrée scolaire", debut: "2024-09-02", fin: "2024-09-02", statut: "a_venir" }
                ].map((phase, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                    phase.statut === "en_cours" ? "bg-green-50 border-green-200" : "bg-muted/50"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${phase.statut === "en_cours" ? "bg-green-100" : "bg-muted"}`}>
                        <Calendar className={`h-5 w-5 ${phase.statut === "en_cours" ? "text-green-600" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="font-medium">{phase.phase}</p>
                        <p className="text-sm text-muted-foreground">
                          Du {phase.debut} au {phase.fin}
                        </p>
                      </div>
                    </div>
                    <Badge variant={phase.statut === "en_cours" ? "default" : "secondary"}>
                      {phase.statut === "en_cours" ? "En cours" : "À venir"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par niveau demandé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { niveau: "6ème", count: 4, percentage: 67 },
                    { niveau: "5ème", count: 1, percentage: 17 },
                    { niveau: "4ème", count: 1, percentage: 16 }
                  ].map(item => (
                    <div key={item.niveau}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.niveau}</span>
                        <span className="text-sm text-muted-foreground">{item.count} demandes</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par établissement d'origine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { nom: "EPP Plateau", count: 1 },
                    { nom: "EPP Bouaké Centre", count: 1 },
                    { nom: "EPP Cocody", count: 1 },
                    { nom: "EPP San Pedro", count: 1 },
                    { nom: "Collège Municipal", count: 1 },
                    { nom: "Collège Moderne", count: 1 }
                  ].map(item => (
                    <div key={item.nom} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.nom}</span>
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
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
            <DialogTitle>Détail de la préinscription</DialogTitle>
          </DialogHeader>
          {selectedPreinscription && (
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Référence</Label>
                    <p className="font-medium">{selectedPreinscription.reference}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Statut</Label>
                    <div className="mt-1">{getStatusBadge(selectedPreinscription.statut)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Nom & Prénoms</Label>
                    <p className="font-medium">{selectedPreinscription.nom} {selectedPreinscription.prenoms}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date de naissance</Label>
                    <p className="font-medium">{selectedPreinscription.dateNaissance}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Niveau demandé</Label>
                    <p className="font-medium">{selectedPreinscription.niveauDemande}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Moyenne annuelle</Label>
                    <p className="font-medium">{selectedPreinscription.moyenneAnnuelle}/20</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Téléphone parent</Label>
                    <p className="font-medium">{selectedPreinscription.telephoneParent}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email parent</Label>
                    <p className="font-medium">{selectedPreinscription.emailParent}</p>
                  </div>
                </div>
                {selectedPreinscription.motifRejet && (
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-800">
                        <strong>Motif de rejet:</strong> {selectedPreinscription.motifRejet}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="documents">
                <div className="space-y-3">
                  {mockDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {doc.fourni ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{doc.nom}</p>
                          {doc.dateReception && (
                            <p className="text-xs text-muted-foreground">Reçu le {doc.dateReception}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.obligatoire && <Badge variant="secondary">Obligatoire</Badge>}
                        <Badge variant={doc.fourni ? "default" : "destructive"}>
                          {doc.fourni ? "Fourni" : "Manquant"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Fermer</Button>
            {selectedPreinscription?.statut === "en_attente" && (
              <>
                <Button variant="destructive" onClick={() => { rejectPreinscription(selectedPreinscription.id); setShowDetailDialog(false); }}>
                  Rejeter
                </Button>
                <Button onClick={() => { validatePreinscription(selectedPreinscription.id); setShowDetailDialog(false); }}>
                  Valider
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
