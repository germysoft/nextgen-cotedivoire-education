import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, Plus, Download, Printer, Search, Eye, CheckCircle, 
  Clock, AlertTriangle, User, Calendar, FileCheck, Stamp, Send
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Certificat {
  id: number;
  numero: string;
  eleve: string;
  matricule: string;
  classe: string;
  type: string;
  dateEmission: string;
  dateDemande: string;
  statut: "En attente" | "Validé" | "Imprimé" | "Remis";
  demandeur: string;
  motif: string;
  validePar?: string;
}

const mockCertificats: Certificat[] = [
  { id: 1, numero: "CERT-2024-001", eleve: "KOUASSI Jean", matricule: "2024-001", classe: "Tle D", type: "Certificat de scolarité", dateEmission: "15/12/2024", dateDemande: "10/12/2024", statut: "Remis", demandeur: "Parent", motif: "Inscription université", validePar: "M. le Directeur" },
  { id: 2, numero: "CERT-2024-002", eleve: "DIALLO Fatoumata", matricule: "2024-015", classe: "1ère A", type: "Attestation de présence", dateEmission: "14/12/2024", dateDemande: "12/12/2024", statut: "Imprimé", demandeur: "Élève", motif: "Demande de bourse", validePar: "M. le Directeur" },
  { id: 3, numero: "CERT-2024-003", eleve: "TOURÉ Mohamed", matricule: "2024-023", classe: "2nde B", type: "Certificat de fréquentation", dateEmission: "-", dateDemande: "13/12/2024", statut: "En attente", demandeur: "Parent", motif: "Assurance" },
  { id: 4, numero: "CERT-2024-004", eleve: "SANOGO Aminata", matricule: "2024-008", classe: "3ème C", type: "Certificat de scolarité", dateEmission: "13/12/2024", dateDemande: "11/12/2024", statut: "Validé", demandeur: "Parent", motif: "Dossier administratif", validePar: "Mme la Censeure" },
  { id: 5, numero: "CERT-2024-005", eleve: "BAMBA Yao", matricule: "2024-045", classe: "Tle D", type: "Attestation de réussite", dateEmission: "12/12/2024", dateDemande: "08/12/2024", statut: "Remis", demandeur: "Élève", motif: "Emploi", validePar: "M. le Directeur" },
  { id: 6, numero: "CERT-2024-006", eleve: "KONE Sarah", matricule: "2024-067", classe: "1ère C", type: "Relevé de notes", dateEmission: "-", dateDemande: "14/12/2024", statut: "En attente", demandeur: "Parent", motif: "Transfert école" },
];

const typesCertificats = [
  { value: "scolarite", label: "Certificat de scolarité", description: "Atteste que l'élève est régulièrement inscrit" },
  { value: "frequentation", label: "Certificat de fréquentation", description: "Atteste de l'assiduité de l'élève" },
  { value: "presence", label: "Attestation de présence", description: "Atteste de la présence effective à une date" },
  { value: "reussite", label: "Attestation de réussite", description: "Atteste du passage en classe supérieure" },
  { value: "releve", label: "Relevé de notes", description: "Document récapitulatif des notes obtenues" },
  { value: "radiation", label: "Certificat de radiation", description: "Atteste du départ de l'élève de l'établissement" },
  { value: "bonne_conduite", label: "Certificat de bonne conduite", description: "Atteste du comportement exemplaire" },
  { value: "stage", label: "Convention de stage", description: "Document pour les stages en entreprise" },
];

export default function Certificats() {
  const [certificats, setCertificats] = useState<Certificat[]>(mockCertificats);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCertificat, setSelectedCertificat] = useState<Certificat | null>(null);
  
  const [newCertificat, setNewCertificat] = useState({
    eleve: "",
    matricule: "",
    classe: "",
    type: "",
    demandeur: "",
    motif: ""
  });

  const filteredCertificats = certificats.filter(c => {
    const matchSearch = c.eleve.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || c.type.toLowerCase().includes(filterType);
    const matchStatut = filterStatut === "all" || c.statut === filterStatut;
    return matchSearch && matchType && matchStatut;
  });

  const handleCreateCertificat = () => {
    const today = new Date().toLocaleDateString('fr-FR');
    const newId = Math.max(...certificats.map(c => c.id)) + 1;
    const numero = `CERT-2024-${String(newId).padStart(3, '0')}`;
    
    const typeCert = typesCertificats.find(t => t.value === newCertificat.type);
    
    const cert: Certificat = {
      id: newId,
      numero,
      eleve: newCertificat.eleve,
      matricule: newCertificat.matricule,
      classe: newCertificat.classe,
      type: typeCert?.label || newCertificat.type,
      dateEmission: "-",
      dateDemande: today,
      statut: "En attente",
      demandeur: newCertificat.demandeur,
      motif: newCertificat.motif
    };
    
    setCertificats(prev => [...prev, cert]);
    toast({ title: "Demande enregistrée", description: `Le certificat ${numero} a été créé` });
    setIsDialogOpen(false);
    setNewCertificat({ eleve: "", matricule: "", classe: "", type: "", demandeur: "", motif: "" });
  };

  const handleValider = (cert: Certificat) => {
    const today = new Date().toLocaleDateString('fr-FR');
    setCertificats(prev => prev.map(c => 
      c.id === cert.id ? { ...c, statut: "Validé", dateEmission: today, validePar: "M. le Directeur" } : c
    ));
    toast({ title: "Certificat validé", description: `Le certificat ${cert.numero} est prêt pour impression` });
  };

  const handleImprimer = (cert: Certificat) => {
    setCertificats(prev => prev.map(c => 
      c.id === cert.id ? { ...c, statut: "Imprimé" } : c
    ));
    toast({ title: "Certificat imprimé", description: `Le certificat ${cert.numero} a été imprimé` });
  };

  const handleRemettre = (cert: Certificat) => {
    setCertificats(prev => prev.map(c => 
      c.id === cert.id ? { ...c, statut: "Remis" } : c
    ));
    toast({ title: "Certificat remis", description: `Le certificat ${cert.numero} a été remis au demandeur` });
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "En attente": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case "Validé": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
      case "Imprimé": return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><Printer className="w-3 h-3 mr-1" />Imprimé</Badge>;
      case "Remis": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><FileCheck className="w-3 h-3 mr-1" />Remis</Badge>;
      default: return <Badge>{statut}</Badge>;
    }
  };

  const stats = {
    total: certificats.length,
    enAttente: certificats.filter(c => c.statut === "En attente").length,
    valides: certificats.filter(c => c.statut === "Validé").length,
    remis: certificats.filter(c => c.statut === "Remis").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificats & Attestations</h1>
          <p className="text-muted-foreground">Génération et gestion des documents officiels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle Demande de Certificat</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'élève</Label>
                  <Input 
                    placeholder="Ex: KOUASSI Jean"
                    value={newCertificat.eleve}
                    onChange={(e) => setNewCertificat({...newCertificat, eleve: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Matricule</Label>
                  <Input 
                    placeholder="Ex: 2024-001"
                    value={newCertificat.matricule}
                    onChange={(e) => setNewCertificat({...newCertificat, matricule: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Classe</Label>
                  <Select onValueChange={(v) => setNewCertificat({...newCertificat, classe: v})}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6ème A">6ème A</SelectItem>
                      <SelectItem value="5ème B">5ème B</SelectItem>
                      <SelectItem value="4ème C">4ème C</SelectItem>
                      <SelectItem value="3ème C">3ème C</SelectItem>
                      <SelectItem value="2nde B">2nde B</SelectItem>
                      <SelectItem value="1ère A">1ère A</SelectItem>
                      <SelectItem value="1ère C">1ère C</SelectItem>
                      <SelectItem value="Tle D">Tle D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type de certificat</Label>
                  <Select onValueChange={(v) => setNewCertificat({...newCertificat, type: v})}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {typesCertificats.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Demandeur</Label>
                  <Select onValueChange={(v) => setNewCertificat({...newCertificat, demandeur: v})}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Élève">Élève</SelectItem>
                      <SelectItem value="Tuteur">Tuteur</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Motif de la demande</Label>
                  <Input 
                    placeholder="Ex: Inscription université"
                    value={newCertificat.motif}
                    onChange={(e) => setNewCertificat({...newCertificat, motif: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateCertificat}>Créer la demande</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.valides}</div>
            <p className="text-xs text-muted-foreground">Prêts à imprimer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remis</CardTitle>
            <FileCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.remis}</div>
            <p className="text-xs text-muted-foreground">Distribués</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="demandes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demandes">Demandes</TabsTrigger>
          <TabsTrigger value="types">Types de Certificats</TabsTrigger>
          <TabsTrigger value="modeles">Modèles</TabsTrigger>
        </TabsList>

        <TabsContent value="demandes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Demandes</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Validé">Validé</SelectItem>
                      <SelectItem value="Imprimé">Imprimé</SelectItem>
                      <SelectItem value="Remis">Remis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Certificat</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Demande</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificats.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.numero}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{cert.eleve}</div>
                            <div className="text-xs text-muted-foreground">{cert.matricule}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{cert.classe}</TableCell>
                      <TableCell>{cert.type}</TableCell>
                      <TableCell>{cert.dateDemande}</TableCell>
                      <TableCell className="max-w-32 truncate" title={cert.motif}>{cert.motif}</TableCell>
                      <TableCell>{getStatutBadge(cert.statut)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {cert.statut === "En attente" && (
                            <Button size="sm" variant="outline" onClick={() => handleValider(cert)}>
                              <Stamp className="h-3 w-3 mr-1" />
                              Valider
                            </Button>
                          )}
                          {cert.statut === "Validé" && (
                            <Button size="sm" variant="outline" onClick={() => handleImprimer(cert)}>
                              <Printer className="h-3 w-3 mr-1" />
                              Imprimer
                            </Button>
                          )}
                          {cert.statut === "Imprimé" && (
                            <Button size="sm" variant="outline" onClick={() => handleRemettre(cert)}>
                              <Send className="h-3 w-3 mr-1" />
                              Remettre
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-3 w-3" />
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

        <TabsContent value="types">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {typesCertificats.map((type) => (
              <Card key={type.value} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {type.label}
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">
                      {certificats.filter(c => c.type === type.label).length} émis
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => {
                      setNewCertificat({...newCertificat, type: type.value});
                      setIsDialogOpen(true);
                    }}>
                      <Plus className="h-3 w-3 mr-1" />
                      Créer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modeles">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de Documents</CardTitle>
              <CardDescription>Personnalisez les modèles de certificats et attestations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">En-tête Officiel</h3>
                        <p className="text-sm text-muted-foreground">Logo, nom et adresse de l'établissement</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Stamp className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Signature & Cachet</h3>
                        <p className="text-sm text-muted-foreground">Signature du directeur et cachet officiel</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
