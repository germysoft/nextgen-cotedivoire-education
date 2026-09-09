import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Briefcase, Edit, Loader2, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Candidature, Recrutement,
  useCandidaturesQuery, useCreateCandidature, useUpdateCandidature, useDeleteCandidature,
  useRecrutementsQuery, useCreateRecrutement, useUpdateRecrutement, useDeleteRecrutement,
} from "@/hooks/api/useRecrutementRH";

/**
 * Page branchée sur l'API réelle :
 * - onglet Offres        → /api/rh/recrutements  (modèle `Recrutement`)
 * - onglet Candidatures  → /api/rh/candidatures  (modèle `Candidature`)
 *
 * Simplifications assumées (champs du mock absents du schéma Prisma, donc retirés
 * plutôt qu'inventés) : niveau d'étude / expérience requise / salaire proposé /
 * nombre de postes sur l'offre, et note d'évaluation, source, disponibilité ou
 * lettre de motivation sur la candidature. Le modèle `Recrutement` ne porte que
 * poste, département, description, statut, dateOuverture, dateCloture ; le modèle
 * `Candidature` que recrutementId, nom, email, téléphone, cvUrl et statut.
 */

const STATUTS_OFFRE = ["Ouvert", "Fermé", "Pourvu"];
const STATUTS_CANDIDATURE = ["Reçue", "Présélectionnée", "Entretien", "Acceptée", "Refusée"];

const apiError = (err: any, fallback: string) => toast.error(err?.response?.data?.error ?? fallback);

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—";

const emptyOffre = { poste: "", departement: "", description: "", statut: "Ouvert", dateCloture: "" };
const emptyCandidature = { recrutementId: "", nomCandidat: "", emailCandidat: "", telephoneCandidat: "", cvUrl: "", statut: "Reçue" };

export default function RecrutementPage() {
  const [search, setSearch] = useState("");
  const [offreOpen, setOffreOpen] = useState(false);
  const [editingOffreId, setEditingOffreId] = useState<string | null>(null);
  const [offreForm, setOffreForm] = useState(emptyOffre);

  const [candOpen, setCandOpen] = useState(false);
  const [editingCandId, setEditingCandId] = useState<string | null>(null);
  const [candForm, setCandForm] = useState(emptyCandidature);

  const recrutementsQuery = useRecrutementsQuery();
  const candidaturesQuery = useCandidaturesQuery();
  const recrutements = recrutementsQuery.data ?? [];
  const candidatures = candidaturesQuery.data ?? [];

  const createRecrutement = useCreateRecrutement();
  const updateRecrutement = useUpdateRecrutement();
  const deleteRecrutement = useDeleteRecrutement();
  const createCandidature = useCreateCandidature();
  const updateCandidature = useUpdateCandidature();
  const deleteCandidature = useDeleteCandidature();

  const posteById = useMemo(
    () => new Map(recrutements.map((r) => [r.id, r.poste])),
    [recrutements]
  );

  const filteredOffres = useMemo(() => {
    const q = search.toLowerCase();
    return recrutements.filter((r) => `${r.poste} ${r.departement ?? ""}`.toLowerCase().includes(q));
  }, [recrutements, search]);

  const filteredCandidatures = useMemo(() => {
    const q = search.toLowerCase();
    return candidatures.filter((c) =>
      `${c.nomCandidat} ${c.emailCandidat} ${posteById.get(c.recrutementId) ?? ""}`.toLowerCase().includes(q)
    );
  }, [candidatures, posteById, search]);

  const stats = {
    offresOuvertes: recrutements.filter((r) => r.statut === "Ouvert").length,
    candidatures: candidatures.length,
    entretiens: candidatures.filter((c) => c.statut === "Entretien").length,
    acceptees: candidatures.filter((c) => c.statut === "Acceptée").length,
  };

  const openCreateOffre = () => {
    setEditingOffreId(null);
    setOffreForm(emptyOffre);
    setOffreOpen(true);
  };

  const openEditOffre = (r: Recrutement) => {
    setEditingOffreId(r.id);
    setOffreForm({
      poste: r.poste,
      departement: r.departement ?? "",
      description: r.description ?? "",
      statut: r.statut,
      dateCloture: r.dateCloture ? r.dateCloture.split("T")[0] : "",
    });
    setOffreOpen(true);
  };

  const submitOffre = () => {
    if (!offreForm.poste.trim()) {
      toast.error("L'intitulé du poste est obligatoire");
      return;
    }
    const payload = {
      poste: offreForm.poste.trim(),
      departement: offreForm.departement || null,
      description: offreForm.description || null,
      statut: offreForm.statut,
      dateCloture: offreForm.dateCloture ? new Date(offreForm.dateCloture).toISOString() : null,
    };
    const done = (msg: string) => () => { toast.success(msg); setOffreOpen(false); };
    if (editingOffreId) {
      updateRecrutement.mutate({ id: editingOffreId, ...payload }, {
        onSuccess: done("Offre mise à jour"),
        onError: (err) => apiError(err, "Impossible de mettre à jour l'offre"),
      });
    } else {
      createRecrutement.mutate(payload, {
        onSuccess: done("Offre créée"),
        onError: (err) => apiError(err, "Impossible de créer l'offre"),
      });
    }
  };

  const removeOffre = (r: Recrutement) => {
    deleteRecrutement.mutate(r.id, {
      onSuccess: () => toast.success("Offre supprimée"),
      onError: (err) => apiError(err, "Impossible de supprimer l'offre"),
    });
  };

  const openCreateCandidature = () => {
    setEditingCandId(null);
    setCandForm({ ...emptyCandidature, recrutementId: recrutements[0]?.id ?? "" });
    setCandOpen(true);
  };

  const openEditCandidature = (c: Candidature) => {
    setEditingCandId(c.id);
    setCandForm({
      recrutementId: c.recrutementId,
      nomCandidat: c.nomCandidat,
      emailCandidat: c.emailCandidat,
      telephoneCandidat: c.telephoneCandidat ?? "",
      cvUrl: c.cvUrl ?? "",
      statut: c.statut,
    });
    setCandOpen(true);
  };

  const submitCandidature = () => {
    if (!candForm.recrutementId || !candForm.nomCandidat.trim() || !candForm.emailCandidat.trim()) {
      toast.error("Offre, nom et email du candidat sont obligatoires");
      return;
    }
    const payload = {
      recrutementId: candForm.recrutementId,
      nomCandidat: candForm.nomCandidat.trim(),
      emailCandidat: candForm.emailCandidat.trim(),
      telephoneCandidat: candForm.telephoneCandidat || null,
      cvUrl: candForm.cvUrl || null,
      statut: candForm.statut,
    };
    const done = (msg: string) => () => { toast.success(msg); setCandOpen(false); };
    if (editingCandId) {
      updateCandidature.mutate({ id: editingCandId, ...payload }, {
        onSuccess: done("Candidature mise à jour"),
        onError: (err) => apiError(err, "Impossible de mettre à jour la candidature"),
      });
    } else {
      createCandidature.mutate(payload, {
        onSuccess: done("Candidature enregistrée"),
        onError: (err) => apiError(err, "Impossible d'enregistrer la candidature"),
      });
    }
  };

  const changeStatutCandidature = (c: Candidature, statut: string) => {
    updateCandidature.mutate({ id: c.id, statut }, {
      onSuccess: () => toast.success(`Candidature « ${c.nomCandidat} » : ${statut}`),
      onError: (err) => apiError(err, "Impossible de changer le statut"),
    });
  };

  const removeCandidature = (c: Candidature) => {
    deleteCandidature.mutate(c.id, {
      onSuccess: () => toast.success("Candidature supprimée"),
      onError: (err) => apiError(err, "Impossible de supprimer la candidature"),
    });
  };

  if (recrutementsQuery.isLoading || candidaturesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Chargement du recrutement...
      </div>
    );
  }

  if (recrutementsQuery.isError || candidaturesQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <p className="font-medium">Impossible de charger les données de recrutement</p>
        <p className="text-sm text-muted-foreground">Vérifiez votre connexion, puis rechargez la page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recrutement</h1>
          <p className="text-muted-foreground">Offres de poste et suivi des candidatures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openCreateCandidature} disabled={!recrutements.length}>
            <Users className="mr-2 h-4 w-4" />Nouvelle candidature
          </Button>
          <Button onClick={openCreateOffre}><Plus className="mr-2 h-4 w-4" />Nouvelle offre</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offres ouvertes</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.offresOuvertes}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Candidatures</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.candidatures}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">En entretien</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-blue-600">{stats.entretiens}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Acceptées</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.acceptees}</div></CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Rechercher un poste, un candidat..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="offres" className="space-y-6">
        <TabsList>
          <TabsTrigger value="offres">Offres ({filteredOffres.length})</TabsTrigger>
          <TabsTrigger value="candidatures">Candidatures ({filteredCandidatures.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="offres">
          <Card>
            <CardHeader>
              <CardTitle>Offres de recrutement</CardTitle>
              <CardDescription>Postes publiés et leur état d'avancement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Poste</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Ouverture</TableHead>
                    <TableHead>Clôture</TableHead>
                    <TableHead>Candidatures</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffres.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.poste}</TableCell>
                      <TableCell>{r.departement ?? "—"}</TableCell>
                      <TableCell>{formatDate(r.dateOuverture)}</TableCell>
                      <TableCell>{formatDate(r.dateCloture)}</TableCell>
                      <TableCell><Badge variant="secondary">{candidatures.filter((c) => c.recrutementId === r.id).length}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={r.statut === "Ouvert" ? "default" : r.statut === "Pourvu" ? "secondary" : "outline"}>{r.statut}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditOffre(r)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => removeOffre(r)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filteredOffres.length && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune offre trouvée</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidatures">
          <Card>
            <CardHeader>
              <CardTitle>Candidatures reçues</CardTitle>
              <CardDescription>Suivi du statut de chaque candidat</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Poste visé</TableHead>
                    <TableHead>Reçue le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidatures.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nomCandidat}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{c.emailCandidat}</span>
                          <span className="text-muted-foreground">{c.telephoneCandidat ?? "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{posteById.get(c.recrutementId) ?? "—"}</TableCell>
                      <TableCell>{formatDate(c.createdAt)}</TableCell>
                      <TableCell>
                        <Select value={c.statut} onValueChange={(v) => changeStatutCandidature(c, v)}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>{STATUTS_CANDIDATURE.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditCandidature(c)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => removeCandidature(c)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filteredCandidatures.length && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucune candidature trouvée</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={offreOpen} onOpenChange={setOffreOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingOffreId ? "Modifier l'offre" : "Nouvelle offre de recrutement"}</DialogTitle>
            <DialogDescription>Les champs correspondent exactement aux données enregistrées.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2"><Label>Poste *</Label>
              <Input value={offreForm.poste} onChange={(e) => setOffreForm((f) => ({ ...f, poste: e.target.value }))} placeholder="Professeur de Mathématiques" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Département</Label>
                <Input value={offreForm.departement} onChange={(e) => setOffreForm((f) => ({ ...f, departement: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Statut</Label>
                <Select value={offreForm.statut} onValueChange={(v) => setOffreForm((f) => ({ ...f, statut: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUTS_OFFRE.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Date de clôture</Label>
              <Input type="date" value={offreForm.dateCloture} onChange={(e) => setOffreForm((f) => ({ ...f, dateCloture: e.target.value }))} />
            </div>
            <div className="space-y-2"><Label>Description</Label>
              <Textarea rows={4} value={offreForm.description} onChange={(e) => setOffreForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOffreOpen(false)}>Annuler</Button>
            <Button onClick={submitOffre} disabled={createRecrutement.isPending || updateRecrutement.isPending}>
              {createRecrutement.isPending || updateRecrutement.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={candOpen} onOpenChange={setCandOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCandId ? "Modifier la candidature" : "Nouvelle candidature"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2"><Label>Offre visée *</Label>
              <Select value={candForm.recrutementId} onValueChange={(v) => setCandForm((f) => ({ ...f, recrutementId: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une offre..." /></SelectTrigger>
                <SelectContent>{recrutements.map((r) => <SelectItem key={r.id} value={r.id}>{r.poste}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Nom du candidat *</Label>
              <Input value={candForm.nomCandidat} onChange={(e) => setCandForm((f) => ({ ...f, nomCandidat: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email *</Label>
                <Input type="email" value={candForm.emailCandidat} onChange={(e) => setCandForm((f) => ({ ...f, emailCandidat: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Téléphone</Label>
                <Input value={candForm.telephoneCandidat} onChange={(e) => setCandForm((f) => ({ ...f, telephoneCandidat: e.target.value }))} placeholder="+225 ..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Lien du CV</Label>
                <Input value={candForm.cvUrl} onChange={(e) => setCandForm((f) => ({ ...f, cvUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="space-y-2"><Label>Statut</Label>
                <Select value={candForm.statut} onValueChange={(v) => setCandForm((f) => ({ ...f, statut: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUTS_CANDIDATURE.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCandOpen(false)}>Annuler</Button>
            <Button onClick={submitCandidature} disabled={createCandidature.isPending || updateCandidature.isPending}>
              {createCandidature.isPending || updateCandidature.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
