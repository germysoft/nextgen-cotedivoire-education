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
import { CreditCard, Plus, Search, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CarteLecteur, useCartesLecteurQuery, useCreateCarteLecteur, useDeleteCarteLecteur, useUpdateCarteLecteur } from "@/hooks/api/useBibliotheque";
import { useElevesQuery } from "@/hooks/api/useEleves";

/**
 * Cartes lecteur — branché sur le CRUD générique /api/bibliotheque/cartes-lecteur (modèle `CarteLecteur`).
 * Retirés du mock (absents du schéma) : photo, quota d'emprunts, type d'abonnement, historique de la carte.
 * `personnelId` existe en base mais n'est pas exposé ici (cartes élèves uniquement pour l'instant).
 */

const errMsg = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;
const toDateInput = (d?: string | null) => (d ? d.slice(0, 10) : "");

export default function CartesLecteur() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CarteLecteur | null>(null);
  const [form, setForm] = useState({ numeroCarte: "", eleveId: "", dateExpiration: "", active: true });

  const { data: cartes = [], isLoading, isError } = useCartesLecteurQuery();
  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const create = useCreateCarteLecteur();
  const update = useUpdateCarteLecteur();
  const remove = useDeleteCarteLecteur();

  const eleveNom = (id?: string | null) => {
    const e = eleves.find((x) => x.id === id);
    return e ? `${e.nom} ${e.prenom}` : "—";
  };
  const expiree = (c: CarteLecteur) => !!c.dateExpiration && new Date(c.dateExpiration) < new Date();

  const filtered = cartes.filter((c) => {
    const s = search.toLowerCase();
    return !s || c.numeroCarte.toLowerCase().includes(s) || eleveNom(c.eleveId).toLowerCase().includes(s);
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ numeroCarte: `CL-${new Date().getFullYear()}-${String(cartes.length + 1).padStart(4, "0")}`, eleveId: "", dateExpiration: "", active: true });
    setOpen(true);
  };
  const openEdit = (c: CarteLecteur) => {
    setEditing(c);
    setForm({ numeroCarte: c.numeroCarte, eleveId: c.eleveId ?? "", dateExpiration: toDateInput(c.dateExpiration), active: c.active });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.numeroCarte.trim()) { toast.error("Le numéro de carte est obligatoire"); return; }
    const payload = {
      numeroCarte: form.numeroCarte.trim(),
      eleveId: form.eleveId || null,
      dateExpiration: form.dateExpiration ? new Date(form.dateExpiration).toISOString() : null,
      active: form.active,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Carte modifiée" : "Carte créée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement de la carte")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const toggleActive = (c: CarteLecteur) =>
    update.mutate({ id: c.id, active: !c.active }, {
      onSuccess: () => toast.success(c.active ? "Carte désactivée" : "Carte activée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la mise à jour")),
    });

  const handleDelete = (c: CarteLecteur) =>
    remove.mutate(c.id, {
      onSuccess: () => toast.success("Carte supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression (la carte a peut-être des emprunts)")),
    });

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><CreditCard className="h-8 w-8 text-primary" />Cartes lecteur</h1>
          <p className="text-muted-foreground">Émission et suivi des cartes de bibliothèque</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvelle carte</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{cartes.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Actives</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{cartes.filter((c) => c.active && !expiree(c)).length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Expirées / inactives</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{cartes.filter((c) => !c.active || expiree(c)).length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Numéro ou élève..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les cartes.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune carte lecteur.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead><TableHead>Élève</TableHead><TableHead>Émise le</TableHead>
                  <TableHead>Expire le</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono">{c.numeroCarte}</TableCell>
                    <TableCell>{eleveNom(c.eleveId)}</TableCell>
                    <TableCell>{new Date(c.dateEmission).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{c.dateExpiration ? new Date(c.dateExpiration).toLocaleDateString("fr-FR") : "—"}</TableCell>
                    <TableCell>
                      {expiree(c) ? <Badge variant="destructive">Expirée</Badge> : c.active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch checked={c.active} onCheckedChange={() => toggleActive(c)} aria-label="Activer la carte" className="mr-2 align-middle" />
                      <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => handleDelete(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la carte" : "Nouvelle carte lecteur"}</DialogTitle>
            <DialogDescription>Le numéro de carte doit être unique.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Numéro de carte *</Label><Input value={form.numeroCarte} onChange={(e) => setForm({ ...form, numeroCarte: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Élève</Label>
              <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
                <SelectContent>{eleves.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date d'expiration</Label><Input type="date" value={form.dateExpiration} onChange={(e) => setForm({ ...form, dateExpiration: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /><Label>Carte active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
