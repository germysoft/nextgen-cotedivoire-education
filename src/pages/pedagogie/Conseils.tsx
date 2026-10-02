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
import { Users, Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ConseilClasse, useConseilsClasseQuery, useCreateConseilClasse, useDeleteConseilClasse, useUpdateConseilClasse } from "@/hooks/api/usePedagogie";
import { useClassesQuery } from "@/hooks/api/useClasses";

/**
 * Conseils de classe — branché sur le CRUD générique /api/pedagogie/conseils-classe (modèle `ConseilClasse`).
 * Le routeur générique ne joint pas la classe : elle est recoupée via useClassesQuery.
 * `decisions` (JSON) est saisi ici comme une liste de lignes texte → tableau de chaînes.
 * Retirés du mock (absents du schéma) : participants, heure/salle, statistiques de classe,
 * mentions par élève, statut de la réunion, convocations. `periodeId` n'est pas exposé
 * (aucun endpoint de périodes branché côté front pour l'instant).
 */

const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const toLines = (d: unknown) => (Array.isArray(d) ? d.map(String).join("\n") : "");

export default function Conseils() {
  const [classeFilter, setClasseFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ConseilClasse | null>(null);
  const [form, setForm] = useState({ classeId: "", date: "", compteRendu: "", decisions: "" });

  const { data: conseils = [], isLoading, isError } = useConseilsClasseQuery();
  const { data: classes = [] } = useClassesQuery();
  const create = useCreateConseilClasse();
  const update = useUpdateConseilClasse();
  const remove = useDeleteConseilClasse();

  const classeNom = (id: string) => classes.find((c) => c.id === id)?.nom ?? "Classe inconnue";
  const filtered = conseils
    .filter((c) => classeFilter === "all" || c.classeId === classeFilter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const now = new Date();
  const aVenir = conseils.filter((c) => new Date(c.date) >= now).length;

  const openCreate = () => { setEditing(null); setForm({ classeId: "", date: new Date().toISOString().slice(0, 10), compteRendu: "", decisions: "" }); setOpen(true); };
  const openEdit = (c: ConseilClasse) => {
    setEditing(c);
    setForm({ classeId: c.classeId, date: c.date.slice(0, 10), compteRendu: c.compteRendu ?? "", decisions: toLines(c.decisions) });
    setOpen(true);
  };

  const submit = () => {
    if (!form.classeId || !form.date) { toast.error("Classe et date sont obligatoires"); return; }
    const decisions = form.decisions.split("\n").map((l) => l.trim()).filter(Boolean);
    const payload = {
      classeId: form.classeId,
      date: new Date(form.date).toISOString(),
      compteRendu: form.compteRendu.trim() || null,
      decisions: decisions.length ? decisions : null,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Conseil modifié" : "Conseil planifié"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const del = (c: ConseilClasse) =>
    remove.mutate(c.id, {
      onSuccess: () => toast.success("Conseil supprimé"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-8 w-8 text-primary" />Conseils de classe</h1>
          <p className="text-muted-foreground">Planification, comptes rendus et décisions</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouveau conseil</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Conseils</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{conseils.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">À venir</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{aVenir}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avec compte rendu</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{conseils.filter((c) => c.compteRendu).length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <Select value={classeFilter} onValueChange={setClasseFilter}>
            <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les conseils.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucun conseil de classe.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead><TableHead>Classe</TableHead><TableHead>Statut</TableHead>
                  <TableHead>Compte rendu</TableHead><TableHead>Décisions</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{new Date(c.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{classeNom(c.classeId)}</TableCell>
                    <TableCell>{new Date(c.date) >= now ? <Badge variant="secondary">À venir</Badge> : <Badge>Tenu</Badge>}</TableCell>
                    <TableCell className="max-w-xs truncate">{c.compteRendu || "—"}</TableCell>
                    <TableCell>{Array.isArray(c.decisions) ? c.decisions.length : 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>{editing ? "Modifier le conseil" : "Nouveau conseil de classe"}</DialogTitle>
            <DialogDescription>Une décision par ligne.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Classe *</Label>
                <Select value={form.classeId} onValueChange={(v) => setForm({ ...form, classeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Date *</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Compte rendu</Label><Textarea rows={4} value={form.compteRendu} onChange={(e) => setForm({ ...form, compteRendu: e.target.value })} /></div>
            <div className="space-y-2"><Label>Décisions</Label><Textarea rows={4} placeholder={"Félicitations : …\nAvertissement travail : …"} value={form.decisions} onChange={(e) => setForm({ ...form, decisions: e.target.value })} /></div>
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
