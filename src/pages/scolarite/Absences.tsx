import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserX, Plus, Search, Pencil, Trash2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Absence, useAbsencesQuery, useCreateAbsence, useDeleteAbsence, useUpdateAbsence } from "@/hooks/api/useScolarite";
import { useElevesQuery } from "@/hooks/api/useEleves";
import { useClassesQuery } from "@/hooks/api/useClasses";

/**
 * Absences élèves — branché sur le CRUD générique /api/scolarite/absences (modèle `Absence`).
 * Le routeur générique ne joint pas l'élève : il est recoupé via useElevesQuery (classe = dernière inscription).
 * `coursId` (optionnel) n'est pas saisi ici : la saisie par cours se fait depuis l'emploi du temps.
 * Retirés du mock (absents du schéma) : type retard/absence, pièce justificative, notification parent,
 * heure d'arrivée, statut de validation.
 */

const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const today = () => new Date().toISOString().slice(0, 10);
const empty = { eleveId: "", date: today(), dureeHeures: "1", justifiee: false, motif: "" };

export default function Absences() {
  const [search, setSearch] = useState("");
  const [classeFilter, setClasseFilter] = useState("all");
  const [statut, setStatut] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Absence | null>(null);
  const [form, setForm] = useState(empty);

  const { data: absences = [], isLoading, isError } = useAbsencesQuery();
  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const { data: classes = [] } = useClassesQuery();
  const create = useCreateAbsence();
  const update = useUpdateAbsence();
  const remove = useDeleteAbsence();

  const eleve = (id: string) => eleves.find((e) => e.id === id);
  const classeIdDe = (id: string) => eleve(id)?.inscriptions?.[0]?.classeId;
  const classeNom = (id: string) => eleve(id)?.inscriptions?.[0]?.classe?.nom ?? "—";

  const filtered = absences
    .filter((a) => {
      const e = eleve(a.eleveId);
      const s = search.toLowerCase();
      const matchSearch = !s || (e ? `${e.nom} ${e.prenom} ${e.matricule}` : "").toLowerCase().includes(s) || (a.motif ?? "").toLowerCase().includes(s);
      const matchClasse = classeFilter === "all" || classeIdDe(a.eleveId) === classeFilter;
      const matchStatut = statut === "all" || (statut === "j" ? a.justifiee : !a.justifiee);
      return matchSearch && matchClasse && matchStatut;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const stats = {
    total: absences.length,
    heures: absences.reduce((s, a) => s + a.dureeHeures, 0),
    nonJustifiees: absences.filter((a) => !a.justifiee).length,
    aujourdhui: absences.filter((a) => a.date.slice(0, 10) === today()).length,
  };

  const openCreate = () => { setEditing(null); setForm({ ...empty, date: today() }); setOpen(true); };
  const openEdit = (a: Absence) => {
    setEditing(a);
    setForm({ eleveId: a.eleveId, date: a.date.slice(0, 10), dureeHeures: String(a.dureeHeures), justifiee: a.justifiee, motif: a.motif ?? "" });
    setOpen(true);
  };

  const submit = () => {
    if (!form.eleveId || !form.date) { toast.error("Élève et date sont obligatoires"); return; }
    const payload = {
      eleveId: form.eleveId,
      date: new Date(form.date).toISOString(),
      dureeHeures: parseFloat(form.dureeHeures) || 1,
      justifiee: form.justifiee,
      motif: form.motif.trim() || null,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Absence modifiée" : "Absence enregistrée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const justifier = (a: Absence) =>
    update.mutate({ id: a.id, justifiee: !a.justifiee }, {
      onSuccess: () => toast.success(a.justifiee ? "Absence marquée non justifiée" : "Absence justifiée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la mise à jour")),
    });

  const del = (a: Absence) =>
    remove.mutate(a.id, {
      onSuccess: () => toast.success("Absence supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><UserX className="h-8 w-8 text-primary" />Absences</h1>
          <p className="text-muted-foreground">Saisie et justification des absences élèves</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvelle absence</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Absences</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Heures cumulées</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.heures} h</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Non justifiées</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{stats.nonJustifiees}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Aujourd'hui</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.aujourdhui}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Élève, matricule ou motif..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={classeFilter} onValueChange={setClasseFilter}>
              <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="j">Justifiées</SelectItem>
                <SelectItem value="nj">Non justifiées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les absences.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune absence.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead><TableHead>Élève</TableHead><TableHead>Classe</TableHead><TableHead>Durée</TableHead>
                  <TableHead>Motif</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => {
                  const e = eleve(a.eleveId);
                  return (
                    <TableRow key={a.id}>
                      <TableCell>{new Date(a.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell className="font-medium">{e ? `${e.nom} ${e.prenom}` : "Élève inconnu"}</TableCell>
                      <TableCell>{classeNom(a.eleveId)}</TableCell>
                      <TableCell>{a.dureeHeures} h</TableCell>
                      <TableCell className="max-w-xs truncate">{a.motif || "—"}</TableCell>
                      <TableCell>{a.justifiee ? <Badge>Justifiée</Badge> : <Badge variant="destructive">Non justifiée</Badge>}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" aria-label={a.justifiee ? "Annuler la justification" : "Justifier"} onClick={() => justifier(a)}><CheckCircle className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'absence" : "Nouvelle absence"}</DialogTitle>
            <DialogDescription>Saisie d'une absence élève.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Élève *</Label>
              <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
                <SelectContent>{eleves.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date *</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="space-y-2"><Label>Durée (heures)</Label><Input type="number" min={0.5} step="0.5" value={form.dureeHeures} onChange={(e) => setForm({ ...form, dureeHeures: e.target.value })} /></div>
            <div className="col-span-2 space-y-2"><Label>Motif</Label><Input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} /></div>
            <div className="col-span-2 flex items-center gap-2"><Switch checked={form.justifiee} onCheckedChange={(v) => setForm({ ...form, justifiee: v })} /><Label>Absence justifiée</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
