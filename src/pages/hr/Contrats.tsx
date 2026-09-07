import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText, Download, Plus, Search, Eye, Edit, Trash2,
  Clock, AlertTriangle, CheckCircle, FileSignature, Printer, Loader2,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { generateContratPDF, generateAttestationPDF } from "@/components/hr/ContratPDFGenerator";
import {
  Contrat, useContratsQuery, useCreateContrat, useUpdateContrat, useDeleteContrat,
} from "@/hooks/api/useRH";
import { Personnel, usePersonnelQuery } from "@/hooks/api/usePersonnel";

/**
 * Page branchée sur `/api/rh/contrats` (routeur CRUD générique).
 *
 * Simplifications assumées par rapport à l'ancien mock (le modèle Prisma
 * `Contrat` ne contient que personnelId, typeContrat, dateDebut, dateFin,
 * salaire, documentUrl, statut) :
 * - `heuresHebdo`, `periodEssai`, `dateSignature` : retirés, aucun équivalent
 *   dans le schéma. Le PDF de contrat les affichait : on lui passe désormais
 *   une charge horaire par défaut (35 h) explicitement signalée comme telle.
 * - `poste` / `departement` ne vivent pas sur le contrat mais sur le membre du
 *   personnel (`Personnel.poste`, `Personnel.departement`) : recoupés côté client.
 * - Les statuts sont ceux du schéma ("Actif", "Terminé", "Résilié"), plus
 *   "En attente" du mock qui n'existe pas côté backend et a été retiré.
 * - L'historique des « Attestations récentes » (tableau en dur dans le mock)
 *   est retiré : aucune table ne trace les attestations générées.
 */

const attestationTypes = [
  { value: 'travail', label: 'Attestation de Travail' },
  { value: 'salaire', label: 'Attestation de Salaire' },
  { value: 'stage', label: 'Attestation de Stage' },
  { value: 'fin_contrat', label: 'Certificat de Travail' },
  { value: 'domiciliation', label: 'Attestation de Domiciliation' },
];

const typesContrat = ["CDI", "CDD", "Vacation", "Stage"];
const statutsContrat = ["Actif", "Terminé", "Résilié"];

const emptyForm = {
  personnelId: "",
  typeContrat: "CDI",
  dateDebut: "",
  dateFin: "",
  salaire: "",
  statut: "Actif",
};

export default function ContratsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [isContratDialogOpen, setIsContratDialogOpen] = useState(false);
  const [isAttestationDialogOpen, setIsAttestationDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);
  const [attestationType, setAttestationType] = useState<string>("");
  const [form, setForm] = useState(emptyForm);

  const { data: contrats = [], isLoading, isError } = useContratsQuery();
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500 });
  const personnel = personnelData?.items ?? [];

  const createContrat = useCreateContrat();
  const updateContrat = useUpdateContrat();
  const deleteContrat = useDeleteContrat();

  const personnelById = useMemo(() => {
    const map = new Map<string, Personnel>();
    personnel.forEach((p) => map.set(p.id, p));
    return map;
  }, [personnel]);

  const employeLabel = (contrat: Contrat) => {
    const p = personnelById.get(contrat.personnelId);
    return p ? `${p.prenom} ${p.nom}` : "Employé inconnu";
  };

  const filteredContrats = contrats.filter((c) => {
    const p = personnelById.get(c.personnelId);
    const haystack = `${p?.nom ?? ""} ${p?.prenom ?? ""} ${p?.poste ?? ""} ${c.typeContrat}`.toLowerCase();
    const matchSearch = haystack.includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || c.typeContrat === filterType;
    const matchStatut = filterStatut === "all" || c.statut === filterStatut;
    return matchSearch && matchType && matchStatut;
  });

  const isExpiringSoon = (dateFin?: string | null) => {
    if (!dateFin) return false;
    const diff = (new Date(dateFin).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  };

  const stats = {
    actifs: contrats.filter((c) => c.statut === "Actif").length,
    aRenouveler: contrats.filter((c) => isExpiringSoon(c.dateFin)).length,
    expires: contrats.filter((c) => c.statut === "Terminé").length,
    cdi: contrats.filter((c) => c.typeContrat === "CDI" && c.statut === "Actif").length,
    cdd: contrats.filter((c) => c.typeContrat !== "CDI" && c.statut === "Actif").length,
  };

  const apiError = (err: any, fallback: string) =>
    toast.error(err?.response?.data?.error ?? fallback);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsContratDialogOpen(true);
  };

  const openEdit = (contrat: Contrat) => {
    setEditingId(contrat.id);
    setForm({
      personnelId: contrat.personnelId,
      typeContrat: contrat.typeContrat,
      dateDebut: contrat.dateDebut?.slice(0, 10) ?? "",
      dateFin: contrat.dateFin?.slice(0, 10) ?? "",
      salaire: String(contrat.salaire ?? ""),
      statut: contrat.statut,
    });
    setIsContratDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.personnelId || !form.dateDebut || !form.salaire) {
      toast.error("Employé, date de début et salaire sont obligatoires");
      return;
    }
    const payload = {
      personnelId: form.personnelId,
      typeContrat: form.typeContrat,
      dateDebut: form.dateDebut,
      dateFin: form.typeContrat === "CDI" || !form.dateFin ? null : form.dateFin,
      salaire: Number(form.salaire),
      statut: form.statut,
    };
    if (editingId) {
      updateContrat.mutate({ id: editingId, ...payload }, {
        onSuccess: () => {
          toast.success("Contrat mis à jour");
          setIsContratDialogOpen(false);
        },
        onError: (err) => apiError(err, "Impossible de mettre à jour le contrat"),
      });
    } else {
      createContrat.mutate(payload, {
        onSuccess: () => {
          toast.success("Contrat créé avec succès");
          setIsContratDialogOpen(false);
          setForm(emptyForm);
        },
        onError: (err) => apiError(err, "Impossible de créer le contrat"),
      });
    }
  };

  const handleDelete = (contrat: Contrat) => {
    deleteContrat.mutate(contrat.id, {
      onSuccess: () => toast.success("Contrat supprimé"),
      onError: (err) => apiError(err, "Impossible de supprimer le contrat"),
    });
  };

  const handleRenouveler = (contrat: Contrat) => {
    // Renouvellement = nouveau contrat qui reprend les mêmes termes, l'ancien
    // passant en "Terminé". Le schéma ne modélise pas de lien de parenté entre
    // deux contrats : on se contente de la succession chronologique.
    const debut = contrat.dateFin ? new Date(contrat.dateFin) : new Date();
    debut.setDate(debut.getDate() + 1);
    const fin = new Date(debut);
    fin.setFullYear(fin.getFullYear() + 1);
    createContrat.mutate({
      personnelId: contrat.personnelId,
      typeContrat: contrat.typeContrat,
      dateDebut: debut.toISOString().slice(0, 10),
      dateFin: contrat.typeContrat === "CDI" ? null : fin.toISOString().slice(0, 10),
      salaire: contrat.salaire,
      statut: "Actif",
    }, {
      onSuccess: () => {
        updateContrat.mutate({ id: contrat.id, statut: "Terminé" });
        toast.success("Contrat renouvelé pour un an");
      },
      onError: (err) => apiError(err, "Impossible de renouveler le contrat"),
    });
  };

  const handleGenerateContratPDF = (contrat: Contrat) => {
    const p = personnelById.get(contrat.personnelId);
    if (!p) {
      toast.error("Employé introuvable pour ce contrat");
      return;
    }
    generateContratPDF({
      type: (typesContrat.includes(contrat.typeContrat) ? contrat.typeContrat : "CDI") as any,
      employeNom: p.nom,
      employePrenom: p.prenom,
      // Ces champs d'état civil ne sont pas exposés par /api/personnel :
      // laissés vides plutôt qu'inventés, à compléter à la main sur le document.
      dateNaissance: "",
      lieuNaissance: "",
      adresse: "",
      numeroCNI: "",
      poste: p.poste,
      departement: p.departement ?? "",
      dateDebut: new Date(contrat.dateDebut).toLocaleDateString('fr-FR'),
      dateFin: contrat.dateFin ? new Date(contrat.dateFin).toLocaleDateString('fr-FR') : undefined,
      salaireBase: contrat.salaire,
      heuresHebdo: 35, // valeur légale par défaut : non stockée dans le schéma
    });
    toast.success("Contrat PDF généré");
  };

  const handleGenerateAttestation = () => {
    if (!selectedContrat || !attestationType) return;
    const p = personnelById.get(selectedContrat.personnelId);
    if (!p) {
      toast.error("Employé introuvable pour ce contrat");
      return;
    }
    generateAttestationPDF({
      type: attestationType as any,
      employeNom: p.nom,
      employePrenom: p.prenom,
      dateNaissance: "",
      lieuNaissance: "",
      numeroCNI: "",
      poste: p.poste,
      departement: p.departement ?? "",
      dateEmbauche: new Date(selectedContrat.dateDebut).toLocaleDateString('fr-FR'),
      dateFin: selectedContrat.dateFin ? new Date(selectedContrat.dateFin).toLocaleDateString('fr-FR') : undefined,
      salaireBase: selectedContrat.salaire,
      salaireNet: Math.round(selectedContrat.salaire * 0.78),
    });
    setIsAttestationDialogOpen(false);
    setSelectedContrat(null);
    setAttestationType("");
    toast.success("Attestation générée avec succès");
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'Actif':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Actif</Badge>;
      case 'Terminé':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Terminé</Badge>;
      case 'Résilié':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Résilié</Badge>;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Chargement des contrats...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <p className="font-medium">Impossible de charger les contrats</p>
        <p className="text-sm text-muted-foreground">
          Vérifiez votre connexion, puis rechargez la page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contrats &amp; Attestations</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des contrats de travail et génération d'attestations
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Contrat
        </Button>
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
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
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
                      {typesContrat.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      {statutsContrat.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
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
                  {filteredContrats.map((contrat) => {
                    const p = personnelById.get(contrat.personnelId);
                    return (
                      <TableRow key={contrat.id} className={isExpiringSoon(contrat.dateFin) ? "bg-yellow-50" : ""}>
                        <TableCell>
                          <div>
                            <span className="font-medium">{employeLabel(contrat)}</span>
                            <p className="text-xs text-muted-foreground">{p?.matricule ?? "-"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span>{p?.poste ?? "-"}</span>
                            <p className="text-xs text-muted-foreground">{p?.departement ?? ""}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(contrat.typeContrat)}</TableCell>
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
                        <TableCell className="font-medium">{contrat.salaire.toLocaleString('fr-FR')} FCFA</TableCell>
                        <TableCell>{getStatutBadge(contrat.statut)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedContrat(contrat); setIsDetailOpen(true); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir le détail
                              </DropdownMenuItem>
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
                              <DropdownMenuItem onClick={() => openEdit(contrat)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(contrat)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredContrats.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                        Aucun contrat ne correspond à cette recherche
                      </TableCell>
                    </TableRow>
                  )}
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
                {contrats.filter((c) => isExpiringSoon(c.dateFin)).map((contrat) => (
                  <Card key={contrat.id} className="border-yellow-200 bg-yellow-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{employeLabel(contrat)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {personnelById.get(contrat.personnelId)?.poste ?? "-"} — {contrat.typeContrat}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Expire le</p>
                          <p className="text-lg font-bold text-yellow-600">
                            {contrat.dateFin && new Date(contrat.dateFin).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleRenouveler(contrat)}>
                            Renouveler
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedContrat(contrat); setIsDetailOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {contrats.filter((c) => isExpiringSoon(c.dateFin)).length === 0 && (
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
              <CardDescription>Choisissez un contrat, puis le type d'attestation à produire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {attestationTypes.map((type) => (
                  <Card key={type.value} className="hover:border-primary transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileSignature className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{type.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            Depuis la liste des contrats, action « Générer Attestation »
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Le suivi des attestations déjà émises n'existe pas dans le schéma
                  backend : aucun historique n'est affiché ici. */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog création / édition */}
      <Dialog open={isContratDialogOpen} onOpenChange={setIsContratDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le Contrat" : "Créer un Nouveau Contrat"}</DialogTitle>
            <DialogDescription>Informations du contrat de travail</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Employé</Label>
              <Select value={form.personnelId} onValueChange={(v) => setForm({ ...form, personnelId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre du personnel..." />
                </SelectTrigger>
                <SelectContent>
                  {personnel.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nom} {p.prenom} — {p.poste}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de Contrat</Label>
                <Select value={form.typeContrat} onValueChange={(v) => setForm({ ...form, typeContrat: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {typesContrat.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statutsContrat.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="date"
                  value={form.dateDebut}
                  onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                />
              </div>
              {form.typeContrat !== "CDI" && (
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input
                    type="date"
                    value={form.dateFin}
                    onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Salaire (FCFA)</Label>
              <Input
                type="number"
                value={form.salaire}
                onChange={(e) => setForm({ ...form, salaire: e.target.value })}
                placeholder="500000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContratDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={createContrat.isPending || updateContrat.isPending}>
              {(createContrat.isPending || updateContrat.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Enregistrer" : "Créer le Contrat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog détail */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail du contrat</DialogTitle>
            <DialogDescription>{selectedContrat && employeLabel(selectedContrat)}</DialogDescription>
          </DialogHeader>
          {selectedContrat && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{selectedContrat.typeContrat}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Statut</span><span>{selectedContrat.statut}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Début</span><span>{new Date(selectedContrat.dateDebut).toLocaleDateString('fr-FR')}</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fin</span>
                <span>{selectedContrat.dateFin ? new Date(selectedContrat.dateFin).toLocaleDateString('fr-FR') : "Indéterminée"}</span>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Salaire</span><span>{selectedContrat.salaire.toLocaleString('fr-FR')} FCFA</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Poste</span><span>{personnelById.get(selectedContrat.personnelId)?.poste ?? "-"}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fermer</Button>
            {selectedContrat && (
              <Button onClick={() => handleGenerateContratPDF(selectedContrat)}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger le contrat
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Attestation */}
      <Dialog open={isAttestationDialogOpen} onOpenChange={setIsAttestationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer une Attestation</DialogTitle>
            <DialogDescription>
              {selectedContrat && `Pour ${employeLabel(selectedContrat)}`}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttestationDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleGenerateAttestation} disabled={!attestationType}>
              <Download className="mr-2 h-4 w-4" />
              Générer PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
