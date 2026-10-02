import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Plus, Search, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Discipline as DisciplineT, useCreateDiscipline, useDeleteDiscipline, useDisciplineQuery, useUpdateDiscipline } from "@/hooks/api/usePedagogie";
import { useElevesQuery } from "@/hooks/api/useEleves";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";

/**
 * Discipline — branché sur /api/pedagogie/discipline (GET/POST/PUT/DELETE).
 * Retirés du mock (absents du modèle `Discipline`) : gravité, lieu, témoins, convocation des parents,
 * workflow de validation, pièces jointes, conseil de discipline, classe figée sur l'incident.
 * La « suite donnée » est conservée (champ `suiteDonnee`).
 */

const TYPES = ["Avertissement", "Blâme", "Retenue", "Exclusion temporaire", "Exclusion définitive"];
const AUCUN = "none";
const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const today = () => new Date().toISOString().slice(0, 10);
const empty = { eleveId: "", date: today(), type: "Avertissement", motif: "", pointsRetires: "0", traitantParId: AUCUN, suiteDonnee: "" };

export default function Discipline() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DisciplineT | null>(null);
  const [form, setForm] = useState(empty);

  const { data: incidents = [], isLoading, isError } = useDisciplineQuery();
  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500 });
  const personnel = personnelData?.items ?? [];
  const create = useCreateDiscipline();
  const update = useUpdateDiscipline();
  const remove = useDeleteDiscipline();

  const filtered = incidents.filter((d) => {
    const s = search.toLowerCase();
    const matchSearch = !s || `${d.eleve.nom} ${d.eleve.prenom}`.toLowerCase().includes(s) || d.motif.toLowerCase().includes(s);
    return matchSearch && (typeFilter === "all" || d.type === typeFilter);
  });

  const debutMois = new Date(); debutMois.setDate(1);
  const stats = {
    total: incidents.length,
    mois: incidents.filter((d) => new Date(d.date) >= debutMois).length,
    exclusions: incidents.filter((d) => d.type.startsWith("Exclusion")).length,
    points: incidents.reduce((a, d) => a + d.pointsRetires, 0),
  };

  const openCreate = () => { setEditing(null); setForm({ ...empty, date: today() }); setOpen(true); };
  const openEdit = (d: DisciplineT) => {
    setEditing(d);
    setForm({ eleveId: d.eleveId, date: d.date.slice(0, 10), type: d.type, motif: d.motif, pointsRetires: String(d.pointsRetires), traitantParId: d.traitantParId ?? AUCUN, suiteDonnee: d.suiteDonnee ?? "" });
    setOpen(true);
  };

  const submit = () => {
    if (!form.eleveId || !form.motif.trim()) { toast.error("Élève et motif sont obligatoires"); return; }
    const payload = {
      eleveId: form.eleveId, date: form.date, type: form.type, motif: form.motif.trim(),
      pointsRetires: parseInt(form.pointsRetires) || 0,
      traitantParId: form.traitantParId === AUCUN ? undefined : form.traitantParId,
      suiteDonnee: form.suiteDonnee.trim() || undefined,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Incident modifié" : "Incident enregistré"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const del = (d: DisciplineT) =>
    remove.mutate(d.id, {
      onSuccess: () => toast.success("Incident supprimé"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><ShieldAlert className="h-8 w-8 text-primary" />Discipline</h1>
          <p className="text-muted-foreground">Suivi des incidents et sanctions</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvel incident</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Incidents</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ce mois-ci</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.mois}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Exclusions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{stats.exclusions}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Points retirés</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.points}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Élève ou motif..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les incidents.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucun incident.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead><TableHead>Élève</TableHead><TableHead>Type</TableHead><TableHead>Motif</TableHead>
                  <TableHead>Points</TableHead><TableHead>Traité par</TableHead><TableHead>Suite</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{new Date(d.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{d.eleve.nom} {d.eleve.prenom}</TableCell>
                    <TableCell><Badge variant={d.type.startsWith("Exclusion") ? "destructive" : "secondary"}>{d.type}</Badge></TableCell>
                    <TableCell className="max-w-xs truncate">{d.motif}</TableCell>
                    <TableCell>{d.pointsRetires}</TableCell>
                    <TableCell>{d.traitantPar ? `${d.traitantPar.prenom} ${d.traitantPar.nom}` : "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">{d.suiteDonnee || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(d)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'incident" : "Nouvel incident"}</DialogTitle>
            <DialogDescription>Enregistrement d'un incident disciplinaire.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Élève *</Label>
              <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
                <SelectContent>{eleves.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2"><Label>Motif *</Label><Textarea value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} /></div>
            <div className="space-y-2"><Label>Points retirés</Label><Input type="number" min={0} value={form.pointsRetires} onChange={(e) => setForm({ ...form, pointsRetires: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Traité par</Label>
              <Select value={form.traitantParId} onValueChange={(v) => setForm({ ...form, traitantParId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUCUN}>Non renseigné</SelectItem>
                  {personnel.map((p) => <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2"><Label>Suite donnée</Label><Input value={form.suiteDonnee} onChange={(e) => setForm({ ...form, suiteDonnee: e.target.value })} /></div>
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
