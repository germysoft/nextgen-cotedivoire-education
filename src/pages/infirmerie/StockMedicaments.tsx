import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, Plus, Search, Pencil, Trash2, Minus, Download, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import {
  errMsg, StockMedicament, useCreateStockMedicament, useDeleteStockMedicament, useStockMedicamentsQuery, useUpdateStockMedicament,
} from "@/hooks/api/useInfirmerie";

/**
 * Stock de médicaments — CRUD générique `/infirmerie/stock-medicaments` (modèle `StockMedicament`).
 * Entrée/sortie rapide = PUT de `quantiteStock` (aucun journal de mouvements en base).
 * Retirés du mock (absents du schéma) : catégorie, forme, dosage, prix unitaire, lot,
 * emplacement, historique des mouvements, bons de commande.
 */

const vide = { nom: "", quantiteStock: "0", seuilAlerte: "5", datePeremption: "", fournisseur: "" };
const in90j = Date.now() + 90 * 86400000;
const etat = (m: StockMedicament) => {
  if (m.datePeremption && new Date(m.datePeremption).getTime() < Date.now()) return "Périmé";
  if (m.quantiteStock <= m.seuilAlerte) return "Stock bas";
  if (m.datePeremption && new Date(m.datePeremption).getTime() < in90j) return "Péremption proche";
  return "OK";
};

export default function StockMedicaments() {
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(vide);

  const { data: stock = [], isLoading, isError } = useStockMedicamentsQuery();
  const create = useCreateStockMedicament();
  const update = useUpdateStockMedicament();
  const remove = useDeleteStockMedicament();

  const filtered = stock
    .filter((m) => (!search || m.nom.toLowerCase().includes(search.toLowerCase())) && (filtre === "all" || etat(m) === filtre))
    .sort((a, b) => a.nom.localeCompare(b.nom));

  const openNew = () => { setForm(vide); setEditId(null); setOpen(true); };
  const openEdit = (m: StockMedicament) => {
    setForm({ nom: m.nom, quantiteStock: String(m.quantiteStock), seuilAlerte: String(m.seuilAlerte), datePeremption: m.datePeremption?.slice(0, 10) ?? "", fournisseur: m.fournisseur ?? "" });
    setEditId(m.id); setOpen(true);
  };

  const save = () => {
    const q = parseInt(form.quantiteStock, 10), s = parseInt(form.seuilAlerte, 10);
    if (!form.nom.trim() || Number.isNaN(q) || q < 0 || Number.isNaN(s) || s < 0) { toast.error("Nom, quantité et seuil valides requis"); return; }
    const payload = {
      nom: form.nom.trim(), quantiteStock: q, seuilAlerte: s,
      datePeremption: form.datePeremption ? new Date(form.datePeremption).toISOString() : null,
      fournisseur: form.fournisseur.trim() || null,
    };
    const cb = {
      onSuccess: () => { toast.success(editId ? "Médicament modifié" : "Médicament ajouté"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editId) update.mutate({ id: editId, ...payload }, cb); else create.mutate(payload, cb);
  };

  const ajuster = (m: StockMedicament, delta: number) => {
    const q = Math.max(0, m.quantiteStock + delta);
    update.mutate({ id: m.id, quantiteStock: q }, {
      onSuccess: () => toast.success(`${m.nom} : ${q} en stock`),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la mise à jour")),
    });
  };

  const del = (m: StockMedicament) => {
    if (!confirm(`Supprimer ${m.nom} ?`)) return;
    remove.mutate(m.id, {
      onSuccess: () => toast.success("Médicament supprimé"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });
  };

  const exportInventaire = () => {
    const doc = new jsPDF();
    doc.setFontSize(14); doc.text("Inventaire des médicaments", 14, 18);
    doc.setFontSize(9); doc.text(new Date().toLocaleDateString("fr-FR"), 14, 25);
    let y = 35;
    stock.forEach((m) => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(`${m.nom}  —  ${m.quantiteStock} (seuil ${m.seuilAlerte})  —  ${m.datePeremption ? new Date(m.datePeremption).toLocaleDateString("fr-FR") : "—"}  —  ${etat(m)}`, 14, y);
      y += 6;
    });
    doc.save("inventaire-medicaments.pdf");
  };

  const pending = create.isPending || update.isPending;
  const variant = (e: string) => (e === "OK" ? "secondary" : e === "Péremption proche" ? "default" : "destructive") as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock de médicaments</h1>
          <p className="text-muted-foreground">Quantités, seuils d'alerte et péremptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportInventaire} disabled={!stock.length}><Download className="h-4 w-4 mr-2" />Inventaire PDF</Button>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[["Références", stock.length], ["Stock bas", stock.filter((m) => etat(m) === "Stock bas").length], ["Péremption < 90 j", stock.filter((m) => etat(m) === "Péremption proche").length], ["Périmés", stock.filter((m) => etat(m) === "Périmé").length]].map(([l, v]) => (
          <Card key={l as string}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{l}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{v}</div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Rechercher un médicament..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filtre} onValueChange={setFiltre}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>{["all", "OK", "Stock bas", "Péremption proche", "Périmé"].map((f) => <SelectItem key={f} value={f}>{f === "all" ? "Tous" : f}</SelectItem>)}</SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-6"><AlertCircle className="h-4 w-4" />Impossible de charger le stock.</div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aucun médicament.</p>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Médicament</TableHead><TableHead>Quantité</TableHead><TableHead>Seuil</TableHead><TableHead>Péremption</TableHead>
                <TableHead>Fournisseur</TableHead><TableHead>État</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium"><Pill className="inline h-4 w-4 mr-1 text-primary" />{m.nom}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => ajuster(m, -1)} disabled={update.isPending || m.quantiteStock === 0}><Minus className="h-3 w-3" /></Button>
                        <span className="w-8 text-center">{m.quantiteStock}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => ajuster(m, 1)} disabled={update.isPending}><Plus className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                    <TableCell>{m.seuilAlerte}</TableCell>
                    <TableCell>{m.datePeremption ? new Date(m.datePeremption).toLocaleDateString("fr-FR") : "—"}</TableCell>
                    <TableCell>{m.fournisseur ?? "—"}</TableCell>
                    <TableCell><Badge variant={variant(etat(m))}>{etat(m)}</Badge></TableCell>
                    <TableCell className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => del(m)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{editId ? "Modifier le médicament" : "Nouveau médicament"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 grid-cols-2">
            <div className="col-span-2 space-y-2"><Label>Nom *</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div className="space-y-2"><Label>Quantité en stock</Label><Input type="number" min={0} value={form.quantiteStock} onChange={(e) => setForm({ ...form, quantiteStock: e.target.value })} /></div>
            <div className="space-y-2"><Label>Seuil d'alerte</Label><Input type="number" min={0} value={form.seuilAlerte} onChange={(e) => setForm({ ...form, seuilAlerte: e.target.value })} /></div>
            <div className="space-y-2"><Label>Date de péremption</Label><Input type="date" value={form.datePeremption} onChange={(e) => setForm({ ...form, datePeremption: e.target.value })} /></div>
            <div className="space-y-2"><Label>Fournisseur</Label><Input value={form.fournisseur} onChange={(e) => setForm({ ...form, fournisseur: e.target.value })} /></div>
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
