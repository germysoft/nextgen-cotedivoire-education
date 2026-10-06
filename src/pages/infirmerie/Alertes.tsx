import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Search, CheckCircle, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useElevesQuery } from "@/hooks/api/useEleves";
import {
  AlerteMedicale, errMsg, NiveauAlerte, useAlertesMedicalesQuery, useCreateAlerteMedicale, useDeleteAlerteMedicale, useUpdateAlerteMedicale,
} from "@/hooks/api/useInfirmerie";

/**
 * Alertes médicales — `GET/POST /infirmerie/alertes` (+ PUT/DELETE `/alertes/:id` ajoutées ;
 * « Résoudre » = PUT { resolue: true }). Le GET ne renvoie que les alertes non résolues :
 * une alerte résolue disparaît donc de la liste (pas d'historique des résolutions).
 * Retirés du mock (absents de `AlerteMedicale`) : escalade, responsable, actions parents/SMS, échéance.
 */

const TYPES = ["Allergie sévère", "Maladie chronique", "Épidémie", "Stock critique", "Autre"];
const NIVEAUX: NiveauAlerte[] = ["Info", "Attention", "Urgent"];
const NONE = "none";
const vide = { eleveId: NONE, type: TYPES[0], description: "", niveau: "Info" as NiveauAlerte };
const variant = (n: string): "destructive" | "default" | "secondary" => (n === "Urgent" ? "destructive" : n === "Attention" ? "default" : "secondary");

export default function Alertes() {
  const [search, setSearch] = useState("");
  const [niveau, setNiveau] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(vide);

  const { data: alertes = [], isLoading, isError } = useAlertesMedicalesQuery();
  const { data: eleves } = useElevesQuery({ pageSize: 200 });
  const create = useCreateAlerteMedicale();
  const update = useUpdateAlerteMedicale();
  const remove = useDeleteAlerteMedicale();

  const eleveNom = (id?: string | null) => {
    const e = eleves?.items.find((x) => x.id === id);
    return e ? `${e.nom} ${e.prenom}` : id ? "Élève" : "Général";
  };

  const filtered = alertes.filter((a) => {
    const q = search.toLowerCase();
    const ok = !q || a.description.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || eleveNom(a.eleveId).toLowerCase().includes(q);
    return ok && (niveau === "all" || a.niveau === niveau);
  });

  const openNew = () => { setForm(vide); setEditId(null); setOpen(true); };
  const openEdit = (a: AlerteMedicale) => {
    setForm({ eleveId: a.eleveId ?? NONE, type: a.type, description: a.description, niveau: a.niveau });
    setEditId(a.id); setOpen(true);
  };

  const save = () => {
    if (!form.description.trim()) { toast.error("La description est obligatoire"); return; }
    const payload = { eleveId: form.eleveId === NONE ? undefined : form.eleveId, type: form.type, description: form.description.trim(), niveau: form.niveau };
    const cb = {
      onSuccess: () => { toast.success(editId ? "Alerte modifiée" : "Alerte créée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editId) update.mutate({ id: editId, ...payload }, cb); else create.mutate(payload, cb);
  };

  const resoudre = (a: AlerteMedicale) =>
    update.mutate({ id: a.id, resolue: true }, {
      onSuccess: () => toast.success("Alerte résolue"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la résolution")),
    });

  const del = (a: AlerteMedicale) => {
    if (!confirm("Supprimer définitivement cette alerte ?")) return;
    remove.mutate(a.id, {
      onSuccess: () => toast.success("Alerte supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });
  };

  const pending = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes médicales</h1>
          <p className="text-muted-foreground">Alertes en cours (non résolues)</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Nouvelle alerte</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {NIVEAUX.map((n) => (
          <Card key={n}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{n}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{alertes.filter((a) => a.niveau === n).length}</div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={niveau} onValueChange={setNiveau}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous niveaux</SelectItem>{NIVEAUX.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-6"><AlertCircle className="h-4 w-4" />Impossible de charger les alertes.</div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aucune alerte en cours.</p>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>Niveau</TableHead><TableHead>Type</TableHead><TableHead>Concerne</TableHead><TableHead>Description</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{new Date(a.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell><Badge variant={variant(a.niveau)}>{a.niveau}</Badge></TableCell>
                    <TableCell><Bell className="inline h-4 w-4 mr-1" />{a.type}</TableCell>
                    <TableCell>{eleveNom(a.eleveId)}</TableCell>
                    <TableCell className="max-w-xs truncate">{a.description}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => resoudre(a)} disabled={update.isPending}><CheckCircle className="h-4 w-4 mr-1" />Résoudre</Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => del(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Modifier l'alerte" : "Nouvelle alerte"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Array.from(new Set([...TYPES, form.type])).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-2"><Label>Niveau</Label>
                <Select value={form.niveau} onValueChange={(v) => setForm({ ...form, niveau: v as NiveauAlerte })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{NIVEAUX.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select></div>
            </div>
            <div className="space-y-2"><Label>Élève concerné</Label>
              <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={NONE}>Alerte générale</SelectItem>{(eleves?.items ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
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
