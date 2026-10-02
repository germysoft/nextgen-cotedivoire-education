import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Plus, Search, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Matiere, useAffectationsQuery, useCreateMatiere, useDeleteMatiere, useMatieresQuery, useUpdateMatiere } from "@/hooks/api/usePedagogie";

/**
 * Matières — branché sur GET/POST/PUT/DELETE /api/pedagogie/matieres.
 * Retirés du mock (absents du modèle `Matiere`) : couleur, volume horaire par niveau,
 * programme officiel, progression, département. Le nombre d'enseignants et de classes
 * est dérivé des affectations réelles.
 */

const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const empty = { nom: "", code: "", coefficientDefaut: "1" };

export default function Matieres() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Matiere | null>(null);
  const [toDelete, setToDelete] = useState<Matiere | null>(null);
  const [form, setForm] = useState(empty);

  const { data, isLoading, isError } = useMatieresQuery();
  const matieres = (data ?? []) as Matiere[];
  const { data: affectations = [] } = useAffectationsQuery();
  const create = useCreateMatiere();
  const update = useUpdateMatiere();
  const remove = useDeleteMatiere();

  const usage = (id: string) => {
    const a = affectations.filter((x) => x.matiereId === id);
    return { enseignants: new Set(a.map((x) => x.personnelId)).size, classes: new Set(a.map((x) => x.classeId)).size };
  };

  const filtered = matieres.filter((m) => {
    const s = search.toLowerCase();
    return !s || m.nom.toLowerCase().includes(s) || (m.code ?? "").toLowerCase().includes(s);
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (m: Matiere) => {
    setEditing(m);
    setForm({ nom: m.nom, code: m.code ?? "", coefficientDefaut: String(m.coefficientDefaut ?? 1) });
    setOpen(true);
  };

  const submit = () => {
    if (!form.nom.trim()) { toast.error("Le nom de la matière est obligatoire"); return; }
    const payload = { nom: form.nom.trim(), code: form.code.trim() || undefined, coefficientDefaut: parseFloat(form.coefficientDefaut) || 1 };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Matière modifiée" : "Matière créée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    remove.mutate(toDelete.id, {
      onSuccess: () => { toast.success("Matière supprimée"); setToDelete(null); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });
  };

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><BookOpen className="h-8 w-8 text-primary" />Matières</h1>
          <p className="text-muted-foreground">Référentiel des disciplines enseignées et coefficients par défaut</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvelle matière</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Matières</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{matieres.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Affectations</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{affectations.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Sans enseignant</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{matieres.filter((m) => usage(m.id).enseignants === 0).length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Nom ou code..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les matières.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune matière.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matière</TableHead><TableHead>Code</TableHead><TableHead>Coefficient</TableHead>
                  <TableHead>Enseignants</TableHead><TableHead>Classes</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => {
                  const u = usage(m.id);
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.nom}</TableCell>
                      <TableCell>{m.code ? <Badge variant="outline">{m.code}</Badge> : "—"}</TableCell>
                      <TableCell>{m.coefficientDefaut}</TableCell>
                      <TableCell>{u.enseignants}</TableCell>
                      <TableCell>{u.classes}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => setToDelete(m)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>{editing ? "Modifier la matière" : "Nouvelle matière"}</DialogTitle>
            <DialogDescription>Le nom et le code doivent être uniques.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nom *</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Code</Label><Input placeholder="MATH" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
              <div className="space-y-2"><Label>Coefficient par défaut</Label><Input type="number" step="0.5" min={0} value={form.coefficientDefaut} onChange={(e) => setForm({ ...form, coefficientDefaut: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer « {toDelete?.nom} » ?</DialogTitle>
            <DialogDescription>Une matière déjà utilisée (notes, cours, affectations) ne peut pas être supprimée.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={remove.isPending}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
