import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Search, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Affectation, useAffectationsQuery, useCreateAffectation, useDeleteAffectation, useMatieresQuery, useUpdateAffectation } from "@/hooks/api/usePedagogie";
import { useClassesQuery } from "@/hooks/api/useClasses";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";

/**
 * Attribution pédagogique — branché sur /api/pedagogie/affectations (GET/POST/PUT/DELETE).
 * Retirés du mock (absents du modèle `Affectation`) : semestre, statut de validation,
 * progression du programme, répartition par discipline figée. La charge horaire par
 * enseignant est calculée à partir de `chargeHoraireHebdo`.
 */

const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const empty = { personnelId: "", classeId: "", matiereId: "", chargeHoraireHebdo: "2", coefficient: "" };

export default function Attribution() {
  const [search, setSearch] = useState("");
  const [classeFilter, setClasseFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Affectation | null>(null);
  const [form, setForm] = useState(empty);

  const { data: affectations = [], isLoading, isError } = useAffectationsQuery();
  const { data: classes = [] } = useClassesQuery();
  const { data: matieres = [] } = useMatieresQuery();
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500, categoriePersonnel: "Enseignant" });
  const enseignants = personnelData?.items ?? [];
  const create = useCreateAffectation();
  const update = useUpdateAffectation();
  const remove = useDeleteAffectation();

  const filtered = affectations.filter((a) => {
    const s = search.toLowerCase();
    const matchSearch = !s || `${a.personnel.nom} ${a.personnel.prenom}`.toLowerCase().includes(s) || a.matiere.nom.toLowerCase().includes(s);
    return matchSearch && (classeFilter === "all" || a.classeId === classeFilter);
  });

  // Charge hebdomadaire par enseignant (réelle)
  const charges = Object.values(
    affectations.reduce<Record<string, { nom: string; heures: number }>>((acc, a) => {
      const k = a.personnelId;
      acc[k] = acc[k] ?? { nom: `${a.personnel.prenom} ${a.personnel.nom}`, heures: 0 };
      acc[k].heures += a.chargeHoraireHebdo;
      return acc;
    }, {}),
  ).sort((x, y) => y.heures - x.heures);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (a: Affectation) => {
    setEditing(a);
    setForm({ personnelId: a.personnelId, classeId: a.classeId, matiereId: a.matiereId, chargeHoraireHebdo: String(a.chargeHoraireHebdo), coefficient: a.coefficient?.toString() ?? "" });
    setOpen(true);
  };

  const submit = () => {
    if (!form.personnelId || !form.classeId || !form.matiereId) { toast.error("Enseignant, classe et matière sont obligatoires"); return; }
    const payload = {
      personnelId: form.personnelId, classeId: form.classeId, matiereId: form.matiereId,
      chargeHoraireHebdo: parseFloat(form.chargeHoraireHebdo) || 1,
      coefficient: form.coefficient ? parseFloat(form.coefficient) : undefined,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Attribution modifiée" : "Attribution créée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement (attribution peut-être déjà existante)")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const del = (a: Affectation) =>
    remove.mutate(a.id, {
      onSuccess: () => toast.success("Attribution supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-8 w-8 text-primary" />Attribution pédagogique</h1>
          <p className="text-muted-foreground">Enseignant × classe × matière, et charge horaire</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvelle attribution</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Attributions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{affectations.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Enseignants affectés</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{charges.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Heures hebdo totales</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{charges.reduce((a, c) => a + c.heures, 0)} h</div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Enseignant ou matière..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={classeFilter} onValueChange={setClasseFilter}>
                <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : isError ? (
              <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les attributions.</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Aucune attribution.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead><TableHead>Classe</TableHead><TableHead>Matière</TableHead>
                    <TableHead>H/sem.</TableHead><TableHead>Coef.</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.personnel.prenom} {a.personnel.nom}</TableCell>
                      <TableCell><Badge variant="outline">{a.classe.nom}</Badge></TableCell>
                      <TableCell>{a.matiere.nom}</TableCell>
                      <TableCell>{a.chargeHoraireHebdo}</TableCell>
                      <TableCell>{a.coefficient ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Charge horaire par enseignant</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {charges.length === 0 && <p className="text-sm text-muted-foreground">Aucune donnée.</p>}
            {charges.map((c) => (
              <div key={c.nom} className="flex items-center justify-between text-sm">
                <span>{c.nom}</span>
                <Badge variant={c.heures > 21 ? "destructive" : "secondary"}>{c.heures} h</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'attribution" : "Nouvelle attribution"}</DialogTitle>
            <DialogDescription>Un enseignant ne peut avoir qu'une attribution par classe et matière.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enseignant *</Label>
              <Select value={form.personnelId} onValueChange={(v) => setForm({ ...form, personnelId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>{enseignants.map((p) => <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Classe *</Label>
                <Select value={form.classeId} onValueChange={(v) => setForm({ ...form, classeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Matière *</Label>
                <Select value={form.matiereId} onValueChange={(v) => setForm({ ...form, matiereId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{matieres.map((m) => <SelectItem key={m.id} value={m.id}>{m.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Heures / semaine</Label><Input type="number" min={0} step="0.5" value={form.chargeHoraireHebdo} onChange={(e) => setForm({ ...form, chargeHoraireHebdo: e.target.value })} /></div>
              <div className="space-y-2"><Label>Coefficient (optionnel)</Label><Input type="number" min={0} step="0.5" value={form.coefficient} onChange={(e) => setForm({ ...form, coefficient: e.target.value })} /></div>
            </div>
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
