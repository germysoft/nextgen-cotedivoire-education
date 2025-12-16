import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Download, Plus, Search, Eye, Edit, Trash2, 
  Calendar, User, Clock, AlertTriangle, CheckCircle,
  FileSignature, Printer, RefreshCw
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { generateContratPDF, generateAttestationPDF } from "@/components/hr/ContratPDFGenerator";

interface Contrat {
  id: string;
  employeId: string;
  employeNom: string;
  employePrenom: string;
  poste: string;
  departement: string;
  type: 'CDI' | 'CDD' | 'Vacation' | 'Stage';
  dateDebut: string;
  dateFin?: string;
  salaireBase: number;
  heuresHebdo: number;
  statut: 'actif' | 'expire' | 'resilie' | 'en_attente';
  periodEssai?: number;
  dateSignature?: string;
}

const mockContrats: Contrat[] = [
  { id: "1", employeId: "EMP001", employeNom: "KOFFI", employePrenom: "Yao", poste: "Professeur Mathématiques", departement: "Pédagogie", type: "CDI", dateDebut: "2020-09-01", salaireBase: 650000, heuresHebdo: 35, statut: "actif", dateSignature: "2020-08-25" },
  { id: "2", employeId: "EMP002", employeNom: "DIALLO", employePrenom: "Fatoumata", poste: "Professeur Français", departement: "Pédagogie", type: "CDI", dateDebut: "2019-09-01", salaireBase: 600000, heuresHebdo: 35, statut: "actif", dateSignature: "2019-08-20" },
  { id: "3", employeId: "EMP003", employeNom: "TOURÉ", employePrenom: "Mohamed", poste: "Professeur Physique", departement: "Pédagogie", type: "CDD", dateDebut: "2024-09-01", dateFin: "2025-08-31", salaireBase: 550000, heuresHebdo: 35, statut: "actif", periodEssai: 3, dateSignature: "2024-08-28" },
  { id: "4", employeId: "EMP004", employeNom: "BAMBA", employePrenom: "Sarah", poste: "Secrétaire", departement: "Administration", type: "CDI", dateDebut: "2021-01-15", salaireBase: 350000, heuresHebdo: 40, statut: "actif", dateSignature: "2021-01-10" },
  { id: "5", employeId: "EMP005", employeNom: "KONE", employePrenom: "Ibrahim", poste: "Professeur SVT", departement: "Pédagogie", type: "CDD", dateDebut: "2024-09-01", dateFin: "2025-02-28", salaireBase: 450000, heuresHebdo: 20, statut: "actif", dateSignature: "2024-08-30" },
  { id: "6", employeId: "EMP006", employeNom: "OUATTARA", employePrenom: "Aminata", poste: "Stagiaire Comptabilité", departement: "Comptabilité", type: "Stage", dateDebut: "2024-11-01", dateFin: "2025-04-30", salaireBase: 100000, heuresHebdo: 35, statut: "actif", dateSignature: "2024-10-28" },
  { id: "7", employeId: "EMP007", employeNom: "SANOGO", employePrenom: "Moussa", poste: "Agent de Sécurité", departement: "Sécurité", type: "CDD", dateDebut: "2024-01-01", dateFin: "2024-12-31", salaireBase: 180000, heuresHebdo: 48, statut: "expire" },
  { id: "8", employeId: "EMP008", employeNom: "TRAORE", employePrenom: "Awa", poste: "Bibliothécaire", departement: "Bibliothèque", type: "CDI", dateDebut: "2018-09-01", salaireBase: 320000, heuresHebdo: 35, statut: "resilie", dateSignature: "2018-08-25" },
];

const attestationTypes = [
  { value: 'travail', label: 'Attestation de Travail' },
  { value: 'salaire', label: 'Attestation de Salaire' },
  { value: 'stage', label: 'Attestation de Stage' },
  { value: 'fin_contrat', label: 'Certificat de Travail' },
  { value: 'domiciliation', label: 'Attestation de Domiciliation' },
];

export default function ContratsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [isContratDialogOpen, setIsContratDialogOpen] = useState(false);
  const [isAttestationDialogOpen, setIsAttestationDialogOpen] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);
  const [attestationType, setAttestationType] = useState<string>("");
  const [contrats, setContrats] = useState<Contrat[]>(mockContrats);

  // Formulaire nouveau contrat
  const [newContrat, setNewContrat] = useState({
    employeNom: "",
    employePrenom: "",
    poste: "",
    departement: "",
    type: "CDI" as const,
    dateDebut: "",
    dateFin: "",
    salaireBase: "",
    heuresHebdo: "35",
    periodEssai: "0",
  });

  const filteredContrats = contrats.filter(c => {
    const matchSearch = 
      c.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.employePrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.poste.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || c.type === filterType;
    const matchStatut = filterStatut === "all" || c.statut === filterStatut;
    return matchSearch && matchType && matchStatut;
  });

  const stats = {
    actifs: contrats.filter(c => c.statut === "actif").length,
    aRenouveler: contrats.filter(c => {
      if (!c.dateFin) return false;
      const finDate = new Date(c.dateFin);
      const now = new Date();
      const diff = (finDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 90;
    }).length,
    expires: contrats.filter(c => c.statut === "expire").length,
    cdi: contrats.filter(c => c.type === "CDI" && c.statut === "actif").length,
    cdd: contrats.filter(c => c.type === "CDD" && c.statut === "actif").length,
  };

  const handleCreateContrat = () => {
    const nouveau: Contrat = {
      id: `NEW-${Date.now()}`,
      employeId: `EMP${String(contrats.length + 1).padStart(3, '0')}`,
      employeNom: newContrat.employeNom,
      employePrenom: newContrat.employePrenom,
      poste: newContrat.poste,
      departement: newContrat.departement,
      type: newContrat.type,
      dateDebut: newContrat.dateDebut,
      dateFin: newContrat.dateFin || undefined,
      salaireBase: parseInt(newContrat.salaireBase),
      heuresHebdo: parseInt(newContrat.heuresHebdo),
      statut: "en_attente",
      periodEssai: parseInt(newContrat.periodEssai) || undefined,
    };
    setContrats([nouveau, ...contrats]);
    setIsContratDialogOpen(false);
    setNewContrat({
      employeNom: "", employePrenom: "", poste: "", departement: "",
      type: "CDI", dateDebut: "", dateFin: "", salaireBase: "", heuresHebdo: "35", periodEssai: "0"
    });
    toast.success("Contrat créé avec succès");
  };

  const handleGenerateContratPDF = (contrat: Contrat) => {
    generateContratPDF({
      type: contrat.type,
      employeNom: contrat.employeNom,
      employePrenom: contrat.employePrenom,
      dateNaissance: "15/03/1985",
      lieuNaissance: "Abidjan",
      adresse: "Cocody, Abidjan",
      numeroCNI: "CI0012345678",
      poste: contrat.poste,
      departement: contrat.departement,
      dateDebut: new Date(contrat.dateDebut).toLocaleDateString('fr-FR'),
      dateFin: contrat.dateFin ? new Date(contrat.dateFin).toLocaleDateString('fr-FR') : undefined,
      salaireBase: contrat.salaireBase,
      heuresHebdo: contrat.heuresHebdo,
      periodEssai: contrat.periodEssai,
      avantages: ["Prime de transport", "Assurance maladie"]
    });
    toast.success("Contrat PDF généré");
  };

  const handleGenerateAttestation = () => {
    if (!selectedContrat || !attestationType) return;
    
    generateAttestationPDF({
      type: attestationType as any,
      employeNom: selectedContrat.employeNom,
      employePrenom: selectedContrat.employePrenom,
      dateNaissance: "15/03/1985",
      lieuNaissance: "Abidjan",
      numeroCNI: "CI0012345678",
      poste: selectedContrat.poste,
      departement: selectedContrat.departement,
      dateEmbauche: new Date(selectedContrat.dateDebut).toLocaleDateString('fr-FR'),
      dateFin: selectedContrat.dateFin ? new Date(selectedContrat.dateFin).toLocaleDateString('fr-FR') : undefined,
      salaireBase: selectedContrat.salaireBase,
      salaireNet: Math.round(selectedContrat.salaireBase * 0.78),
    });
    
    setIsAttestationDialogOpen(false);
    setSelectedContrat(null);
    setAttestationType("");
    toast.success("Attestation générée avec succès");
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Actif</Badge>;
      case 'expire':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Expiré</Badge>;
      case 'resilie':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Résilié</Badge>;
      case 'en_attente':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'CDI': 'bg-green-100 text-green-800 border-green-200',
      'CDD': 'bg-blue-100 text-blue-800 border-blue-200',
      'Vacation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Stage': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return <Badge variant="outline" className={colors[type]}>{type}</Badge>;
  };

  const isExpiringSoon = (dateFin?: string) => {
    if (!dateFin) return false;
    const fin = new Date(dateFin);
    const now = new Date();
    const diff = (fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contrats & Attestations</h1>
          <p className="text-muted-foreground mt-2">
            Gestion complète des contrats de travail et génération d'attestations
          </p>
        </div>
        <Dialog open={isContratDialogOpen} onOpenChange={setIsContratDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Contrat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Contrat</DialogTitle>
              <DialogDescription>Remplissez les informations du contrat de travail</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input 
                    value={newContrat.employeNom}
                    onChange={(e) => setNewContrat({...newContrat, employeNom: e.target.value})}
                    placeholder="KOFFI"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input 
                    value={newContrat.employePrenom}
                    onChange={(e) => setNewContrat({...newContrat, employePrenom: e.target.value})}
                    placeholder="Yao"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input 
                    value={newContrat.poste}
                    onChange={(e) => setNewContrat({...newContrat, poste: e.target.value})}
                    placeholder="Professeur Mathématiques"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select value={newContrat.departement} onValueChange={(v) => setNewContrat({...newContrat, departement: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direction">Direction</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Pédagogie">Pédagogie</SelectItem>
                      <SelectItem value="Comptabilité">Comptabilité</SelectItem>
                      <SelectItem value="Surveillance">Surveillance</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Sécurité">Sécurité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de Contrat</Label>
                  <Select value={newContrat.type} onValueChange={(v: any) => setNewContrat({...newContrat, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Vacation">Vacation</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Période d'essai (mois)</Label>
                  <Input 
                    type="number"
                    value={newContrat.periodEssai}
                    onChange={(e) => setNewContrat({...newContrat, periodEssai: e.target.value})}
                    placeholder="3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input 
                    type="date"
                    value={newContrat.dateDebut}
                    onChange={(e) => setNewContrat({...newContrat, dateDebut: e.target.value})}
                  />
                </div>
                {newContrat.type !== "CDI" && (
                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <Input 
                      type="date"
                      value={newContrat.dateFin}
                      onChange={(e) => setNewContrat({...newContrat, dateFin: e.target.value})}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salaire Brut (FCFA)</Label>
                  <Input 
                    type="number"
                    value={newContrat.salaireBase}
                    onChange={(e) => setNewContrat({...newContrat, salaireBase: e.target.value})}
                    placeholder="500000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heures hebdomadaires</Label>
                  <Input 
                    type="number"
                    value={newContrat.heuresHebdo}
                    onChange={(e) => setNewContrat({...newContrat, heuresHebdo: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsContratDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateContrat}>Créer le Contrat</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.actifs}</div>
            <p className="text-xs text-muted-foreground">en cours de validité</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Renouveler</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.aRenouveler}</div>
            <p className="text-xs text-muted-foreground">dans les 3 mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirés</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expires}</div>
            <p className="text-xs text-muted-foreground">à traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CDI</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cdi}</div>
            <p className="text-xs text-muted-foreground">permanents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CDD/Autres</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cdd}</div>
            <p className="text-xs text-muted-foreground">temporaires</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contrats" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contrats">Liste des Contrats</TabsTrigger>
          <TabsTrigger value="renouvellements">À Renouveler</TabsTrigger>
          <TabsTrigger value="attestations">Attestations</TabsTrigger>
        </TabsList>

        <TabsContent value="contrats">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tous les Contrats</CardTitle>
                  <CardDescription>Gestion et suivi des contrats de travail</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Vacation">Vacation</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="expire">Expiré</SelectItem>
                      <SelectItem value="resilie">Résilié</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Salaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContrats.map((contrat) => (
                    <TableRow key={contrat.id} className={isExpiringSoon(contrat.dateFin) ? "bg-yellow-50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{contrat.employePrenom} {contrat.employeNom}</span>
                            <p className="text-xs text-muted-foreground">{contrat.employeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span>{contrat.poste}</span>
                          <p className="text-xs text-muted-foreground">{contrat.departement}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(contrat.type)}</TableCell>
                      <TableCell>{new Date(contrat.dateDebut).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        {contrat.dateFin ? (
                          <div className="flex items-center gap-1">
                            {isExpiringSoon(contrat.dateFin) && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                            {new Date(contrat.dateFin).toLocaleDateString('fr-FR')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{contrat.salaireBase.toLocaleString('fr-FR')} FCFA</TableCell>
                      <TableCell>{getStatutBadge(contrat.statut)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleGenerateContratPDF(contrat)}>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimer Contrat
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedContrat(contrat);
                              setIsAttestationDialogOpen(true);
                            }}>
                              <FileSignature className="mr-2 h-4 w-4" />
                              Générer Attestation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            {contrat.dateFin && (
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renouveler
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renouvellements">
          <Card>
            <CardHeader>
              <CardTitle>Contrats à Renouveler</CardTitle>
              <CardDescription>Contrats arrivant à échéance dans les 3 prochains mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contrats.filter(c => isExpiringSoon(c.dateFin)).map((contrat) => (
                  <Card key={contrat.id} className="border-yellow-200 bg-yellow-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{contrat.employePrenom} {contrat.employeNom}</h3>
                            <p className="text-sm text-muted-foreground">{contrat.poste} - {contrat.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Expire le</p>
                          <p className="text-lg font-bold text-yellow-600">
                            {contrat.dateFin && new Date(contrat.dateFin).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Renouveler
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {contrats.filter(c => isExpiringSoon(c.dateFin)).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>Aucun contrat à renouveler dans les 3 prochains mois</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attestations">
          <Card>
            <CardHeader>
              <CardTitle>Génération d'Attestations</CardTitle>
              <CardDescription>Sélectionnez un employé pour générer une attestation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {attestationTypes.map((type) => (
                  <Card key={type.value} className="hover:border-primary cursor-pointer transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileSignature className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{type.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            Générer pour un employé
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Attestations Récentes</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Générée par</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: "15/12/2024", type: "Attestation de Travail", employe: "KOFFI Yao", par: "Admin" },
                      { date: "14/12/2024", type: "Attestation de Salaire", employe: "DIALLO Fatoumata", par: "Admin" },
                      { date: "12/12/2024", type: "Certificat de Travail", employe: "TRAORE Awa", par: "DRH" },
                    ].map((att, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{att.date}</TableCell>
                        <TableCell><Badge variant="outline">{att.type}</Badge></TableCell>
                        <TableCell className="font-medium">{att.employe}</TableCell>
                        <TableCell>{att.par}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Attestation */}
      <Dialog open={isAttestationDialogOpen} onOpenChange={setIsAttestationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer une Attestation</DialogTitle>
            <DialogDescription>
              {selectedContrat && `Pour ${selectedContrat.employePrenom} ${selectedContrat.employeNom}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type d'attestation</Label>
              <Select value={attestationType} onValueChange={setAttestationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type..." />
                </SelectTrigger>
                <SelectContent>
                  {attestationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAttestationDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleGenerateAttestation} disabled={!attestationType}>
              <Download className="mr-2 h-4 w-4" />
              Générer PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
