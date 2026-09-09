import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CalendarClock, CheckCircle, Edit, Loader2, Plus, Search, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Entretien,
  useEntretiensQuery, useCreateEntretien, useUpdateEntretien, useDeleteEntretien,
  useCandidaturesQuery, useRecrutementsQuery,
} from "@/hooks/api/useRecrutementRH";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";

/**
 * Page branchée sur l'API réelle : /api/rh/entretiens (modèle `Entretien`).
 *
 * Un entretien réel porte uniquement : candidatureId, intervieweurId (optionnel),
 * dateEntretien, notes et decision (Favorable / Défavorable / À revoir).
 * Les champs du mock sans équivalent en base ont été retirés plutôt qu'inventés :
 * type d'entretien (téléphonique/visio/présentiel), durée, lieu, jury à plusieurs
 * membres, grille de notation détaillée et compte rendu structuré.
 *
 * Le routeur générique ne joint pas les relations : le candidat et le poste visé
 * sont recoupés côté client depuis /api/rh/candidatures et /api/rh/recrutements.
 */

const DECISIONS = ["Favorable", "Défavorable", "À revoir"];

const apiError = (err: any, fallback: string) => toast.error(err?.response?.data?.error ?? fallback);

const formatDateTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const toInputValue = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const emptyForm = { candidatureId: "", intervieweurId: "", dateEntretien: "", notes: "", decision: "" };

export default function EntretiensPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const entretiensQuery = useEntretiensQuery();
  const { data: candidatures = [] } = useCandidaturesQuery();
  const { data: recrutements = [] } = useRecrutementsQuery();
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500 });

  const entretiens = entretiensQuery.data ?? [];
  const personnel = personnelData?.items ?? [];

  const createEntretien = useCreateEntretien();
  const updateEntretien = useUpdateEntretien();
  const deleteEntretien = useDeleteEntretien();

  const candidatureById = useMemo(() => new Map(candidatures.map((c) => [c.id, c])), [candidatures]);
  const posteById = useMemo(() => new Map(recrutements.map((r) => [r.id, r.poste])), [recrutements]);
  const personnelById = useMemo(() => new Map(personnel.map((p) => [p.id, `${p.nom} ${p.prenom}`])), [personnel]);

  const libelleCandidat = (e: Entretien) => candidatureById.get(e.candidatureId)?.nomCandidat ?? "Candidat inconnu";
  const libellePoste = (e: Entretien) => {
    const cand = candidatureById.get(e.candidatureId);
    return cand ? posteById.get(cand.recrutementId) ?? "—" : "—";
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entretiens
      .filter((e) => `${libelleCandidat(e)} ${libellePoste(e)} ${e.decision ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.dateEntretien).getTime() - new Date(a.dateEntretien).getTime());
  }, [entretiens, search, candidatureById, posteById]);

  const now = Date.now();
  const stats = {
    aVenir: entretiens.filter((e) => new Date(e.dateEntretien).getTime() >= now).length,
    favorables: entretiens.filter((e) => e.decision === "Favorable").length,
    defavorables: entretiens.filter((e) => e.decision === "Défavorable").length,
    sansDecision: entretiens.filter((e) => !e.decision).length,
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, candidatureId: candidatures[0]?.id ?? "", dateEntretien: toInputValue(new Date().toISOString()) });
    setDialogOpen(true);
  };

  const openEdit = (e: Entretien) => {
    setEditingId(e.id);
    setForm({
      candidatureId: e.candidatureId,
      intervieweurId: e.intervieweurId ?? "",
      dateEntretien: toInputValue(e.dateEntretien),
      notes: e.notes ?? "",
      decision: e.decision ?? "",
    });
    setDialogOpen(true);
  };

  const submit = () => {
    if (!form.candidatureId || !form.dateEntretien) {
      toast.error("Candidature et date de l'entretien sont obligatoires");
      return;
    }
    const payload = {
      candidatureId: form.candidatureId,
      intervieweurId: form.intervieweurId || null,
      dateEntretien: new Date(form.dateEntretien).toISOString(),
      notes: form.notes || null,
      decision: form.decision || null,
    };
    const done = (msg: string) => () => { toast.success(msg); setDialogOpen(false); };
    if (editingId) {
      updateEntretien.mutate({ id: editingId, ...payload }, {
        onSuccess: done("Entretien mis à jour"),
        onError: (err) => apiError(err, "Impossible de mettre à jour l'entretien"),
      });
    } else {
      createEntretien.mutate(payload, {
        onSuccess: done("Entretien planifié"),
        onError: (err) => apiError(err, "Impossible de planifier l'entretien"),
      });
    }
  };

  const setDecision = (e: Entretien, decision: string) => {
    updateEntretien.mutate({ id: e.id, decision }, {
      onSuccess: () => toast.success(`Décision enregistrée : ${decision}`),
      onError: (err) => apiError(err, "Impossible d'enregistrer la décision"),
    });
  };

  const remove = (e: Entretien) => {
    deleteEntretien.mutate(e.id, {
      onSuccess: () => toast.success("Entretien supprimé"),
      onError: (err) => apiError(err, "Impossible de supprimer l'entretien"),
    });
  };

  if (entretiensQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Chargement des entretiens...
      </div>
    );
  }

  if (entretiensQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <p className="font-medium">Impossible de charger les entretiens</p>
        <p className="text-sm text-muted-foreground">Vérifiez votre connexion, puis rechargez la page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entretiens</h1>
          <p className="text-muted-foreground">Planification et décisions d'entretien de recrutement</p>
        </div>
        <Button onClick={openCreate} disabled={!candidatures.length}>
          <Plus className="mr-2 h-4 w-4" />Planifier un entretien
        </Button>
      </div>

      {!candidatures.length && (
        <Card className="border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="py-4 text-sm text-muted-foreground">
            Aucune candidature enregistrée : créez d'abord une candidature dans le module Recrutement
            pour pouvoir planifier un entretien.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À venir</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.aVenir}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avis favorables</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.favorables}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avis défavorables</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{stats.defavorables}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sans décision</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{stats.sansDecision}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Liste des entretiens</CardTitle>
              <CardDescription>Candidat, poste visé, intervieweur et décision</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Poste visé</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Intervieweur</TableHead>
                <TableHead>Décision</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{libelleCandidat(e)}</TableCell>
                  <TableCell>{libellePoste(e)}</TableCell>
                  <TableCell>{formatDateTime(e.dateEntretien)}</TableCell>
                  <TableCell>{e.intervieweurId ? personnelById.get(e.intervieweurId) ?? "—" : <Badge variant="secondary">Non assigné</Badge>}</TableCell>
                  <TableCell>
                    {e.decision === "Favorable" && <Badge className="gap-1"><CheckCircle className="h-3 w-3" />Favorable</Badge>}
                    {e.decision === "Défavorable" && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Défavorable</Badge>}
                    {e.decision === "À revoir" && <Badge variant="outline">À revoir</Badge>}
                    {!e.decision && (
                      <div className="flex gap-1">
                        {DECISIONS.map((d) => (
                          <Button key={d} size="sm" variant="outline" onClick={() => setDecision(e, d)}>{d}</Button>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(e)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(e)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucun entretien trouvé</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'entretien" : "Planifier un entretien"}</DialogTitle>
            <DialogDescription>Les champs correspondent exactement aux données enregistrées.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2"><Label>Candidature *</Label>
              <Select value={form.candidatureId} onValueChange={(v) => setForm((f) => ({ ...f, candidatureId: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un candidat..." /></SelectTrigger>
                <SelectContent>
                  {candidatures.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nomCandidat} — {posteById.get(c.recrutementId) ?? "poste inconnu"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date et heure *</Label>
                <Input type="datetime-local" value={form.dateEntretien} onChange={(e) => setForm((f) => ({ ...f, dateEntretien: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Intervieweur</Label>
                <Select value={form.intervieweurId} onValueChange={(v) => setForm((f) => ({ ...f, intervieweurId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {personnel.map((p) => <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom} — {p.poste}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Décision</Label>
              <Select value={form.decision} onValueChange={(v) => setForm((f) => ({ ...f, decision: v }))}>
                <SelectTrigger><SelectValue placeholder="À renseigner après l'entretien" /></SelectTrigger>
                <SelectContent>{DECISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Notes / compte rendu</Label>
              <Textarea rows={4} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Observations sur le candidat..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={submit} disabled={createEntretien.isPending || updateEntretien.isPending}>
              {createEntretien.isPending || updateEntretien.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
