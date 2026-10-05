import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope, Plus, Search, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useElevesQuery } from "@/hooks/api/useEleves";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";
import {
  Consultation, errMsg, nomEleve, useConsultationsQuery, useCreateConsultation, useDeleteConsultation, useUpdateConsultation,
} from "@/hooks/api/useInfirmerie";

/**
 * Consultations — `GET/POST /infirmerie/consultations` (+ PUT/DELETE `/consultations/:id` ajoutées).
 * La réponse inclut eleve, infirmier et ordonnances. La date est fixée par le serveur à la création.
 * Retirés du mock (absents de `Consultation`) : heure, température/tension, gravité, statut,
 * prévenir les parents, renvoi à domicile.
 */

const NONE = "none";
const vide = { eleveId: "", motif: "", diagnostic: "", traitement: "", infirmierId: NONE, necessiteSuivi: false };
const opt = (s: string) => (s.trim() ? s.trim() : undefined);

export default function Consultations() {
  const [search, setSearch] = useState("");
  const [suivi, setSuivi] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(vide);

  const { data: consultations = [], isLoading, isError } = useConsultationsQuery();
  const { data: eleves } = useElevesQuery({ pageSize: 200 });
  const { data: personnel } = usePersonnelQuery({ pageSize: 200 });
  const create = useCreateConsultation();
  const update = useUpdateConsultation();
  const remove = useDeleteConsultation();

  const filtered = consultations.filter((c) => {
    const q = search.toLowerCase();
    const ok = !q || nomEleve(c.eleve).toLowerCase().includes(q) || c.motif.toLowerCase().includes(q);
    return ok && (suivi === "all" || (suivi === "oui") === c.necessiteSuivi);
  });

  const openNew = () => { setForm(vide); setEditId(null); setOpen(true); };
  const openEdit = (c: Consultation) => {
    setForm({ eleveId: c.eleveId, motif: c.motif, diagnostic: c.diagnostic ?? "", traitement: c.traitement ?? "", infirmierId: c.infirmierId ?? NONE, necessiteSuivi: c.necessiteSuivi });
    setEditId(c.id); setOpen(true);
  };

  const save = () => {
    if (!form.eleveId || !form.motif.trim()) { toast.error("Élève et motif sont obligatoires"); return; }
    const payload = {
      eleveId: form.eleveId, motif: form.motif.trim(), diagnostic: opt(form.diagnostic), traitement: opt(form.traitement),
      infirmierId: form.infirmierId === NONE ? undefined : form.infirmierId, necessiteSuivi: form.necessiteSuivi,
    };
    const cb = {
      onSuccess: () => { toast.success(editId ? "Consultation modifiée" : "Consultation enregistrée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editId) update.mutate({ id: editId, ...payload }, cb); else create.mutate(payload, cb);
  };

  const del = (c: Consultation) => {
    if (!confirm(`Supprimer cette consultation${c.ordonnances.length ? ` et ses ${c.ordonnances.length} ordonnance(s)` : ""} ?`)) return;
    remove.mutate(c.id, {
      onSuccess: () => toast.success("Consultation supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });
  };

  const today = new Date().toDateString();
  const pending = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">Passages à l'infirmerie</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Nouvelle consultation</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[["Total", consultations.length], ["Aujourd'hui", consultations.filter((c) => new Date(c.date).toDateString() === today).length], ["Suivi nécessaire", consultations.filter((c) => c.necessiteSuivi).length]].map(([l, v]) => (
          <Card key={l as string}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{l}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{v}</div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Élève ou motif..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={suivi} onValueChange={setSuivi}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="oui">Suivi nécessaire</SelectItem><SelectItem value="non">Sans suivi</SelectItem></SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-6"><AlertCircle className="h-4 w-4" />Impossible de charger les consultations.</div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aucune consultation.</p>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>Élève</TableHead><TableHead>Motif</TableHead><TableHead>Diagnostic</TableHead>
                <TableHead>Infirmier</TableHead><TableHead>Ordonnances</TableHead><TableHead>Suivi</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{new Date(c.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</TableCell>
                    <TableCell className="font-medium"><Stethoscope className="inline h-4 w-4 mr-1 text-primary" />{nomEleve(c.eleve)}</TableCell>
                    <TableCell>{c.motif}</TableCell>
                    <TableCell>{c.diagnostic ?? "—"}</TableCell>
                    <TableCell>{c.infirmier ? `${c.infirmier.nom} ${c.infirmier.prenom}` : "—"}</TableCell>
                    <TableCell>{c.ordonnances.length}</TableCell>
                    <TableCell>{c.necessiteSuivi ? <Badge variant="destructive">Oui</Badge> : <Badge variant="secondary">Non</Badge>}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => del(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editId ? "Modifier la consultation" : "Nouvelle consultation"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Élève *</Label>
              <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>{(eleves?.items ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Infirmier</Label>
              <Select value={form.infirmierId} onValueChange={(v) => setForm({ ...form, infirmierId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={NONE}>Non précisé</SelectItem>{(personnel?.items ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2"><Label>Motif *</Label><Input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} /></div>
            <div className="md:col-span-2 space-y-2"><Label>Diagnostic</Label><Textarea value={form.diagnostic} onChange={(e) => setForm({ ...form, diagnostic: e.target.value })} /></div>
            <div className="md:col-span-2 space-y-2"><Label>Traitement</Label><Textarea value={form.traitement} onChange={(e) => setForm({ ...form, traitement: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.necessiteSuivi} onCheckedChange={(v) => setForm({ ...form, necessiteSuivi: v })} /><Label>Nécessite un suivi</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={pending}>{pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
