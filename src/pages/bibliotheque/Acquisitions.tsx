import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Search, Pencil, Trash2, Loader2, AlertCircle, X, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { AcquisitionLivre, LigneAcquisition, useAcquisitionsQuery, useCreateAcquisition, useDeleteAcquisition, useUpdateAcquisition } from "@/hooks/api/useBibliotheque";

/**
 * Acquisitions — branché sur le CRUD générique /api/bibliotheque/acquisitions (modèle `AcquisitionLivre`).
 * Les lignes de commande sont stockées dans le champ JSON `lignes` ({titre, quantite, prixUnitaire}) ;
 * `montantTotal` est recalculé côté client à partir des lignes avant envoi.
 * Retirés du mock (absents du schéma) : budget annuel, numéro de bon de commande, contact fournisseur,
 * validation multi-niveaux. La réception NE crée PAS automatiquement les livres du catalogue.
 */

const STATUTS = ["Commandée", "Reçue", "Annulée"];
const errMsg = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;
const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
const emptyLigne: LigneAcquisition = { titre: "", quantite: 1, prixUnitaire: 0 };

export default function Acquisitions() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AcquisitionLivre | null>(null);
  const [fournisseur, setFournisseur] = useState("");
  const [statut, setStatut] = useState("Commandée");
  const [lignes, setLignes] = useState<LigneAcquisition[]>([{ ...emptyLigne }]);

  const { data: acquisitions = [], isLoading, isError } = useAcquisitionsQuery();
  const create = useCreateAcquisition();
  const update = useUpdateAcquisition();
  const remove = useDeleteAcquisition();

  const filtered = acquisitions
    .filter((a) => {
      const s = search.toLowerCase();
      return !s || (a.fournisseur ?? "").toLowerCase().includes(s) || (a.lignes ?? []).some((l) => l.titre.toLowerCase().includes(s));
    })
    .sort((a, b) => b.dateCommande.localeCompare(a.dateCommande));

  const total = lignes.reduce((acc, l) => acc + (l.quantite || 0) * (l.prixUnitaire || 0), 0);

  const openCreate = () => { setEditing(null); setFournisseur(""); setStatut("Commandée"); setLignes([{ ...emptyLigne }]); setOpen(true); };
  const openEdit = (a: AcquisitionLivre) => {
    setEditing(a); setFournisseur(a.fournisseur ?? ""); setStatut(a.statut);
    setLignes(a.lignes?.length ? a.lignes.map((l) => ({ ...l })) : [{ ...emptyLigne }]);
    setOpen(true);
  };

  const setLigne = (i: number, patch: Partial<LigneAcquisition>) => setLignes(lignes.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const handleSubmit = () => {
    const valides = lignes.filter((l) => l.titre.trim() && l.quantite > 0);
    if (valides.length === 0) { toast.error("Ajoutez au moins une ligne avec un titre et une quantité"); return; }
    const payload = {
      fournisseur: fournisseur.trim() || null,
      statut,
      lignes: valides.map((l) => ({ titre: l.titre.trim(), quantite: Number(l.quantite), prixUnitaire: Number(l.prixUnitaire) })),
      montantTotal: valides.reduce((acc, l) => acc + l.quantite * l.prixUnitaire, 0),
      dateReception: statut === "Reçue" ? (editing?.dateReception ?? new Date().toISOString()) : null,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Commande modifiée" : "Commande créée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement de la commande")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const marquerRecue = (a: AcquisitionLivre) =>
    update.mutate({ id: a.id, statut: "Reçue", dateReception: new Date().toISOString() }, {
      onSuccess: () => toast.success("Commande marquée comme reçue"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la mise à jour")),
    });

  const handleDelete = (a: AcquisitionLivre) =>
    remove.mutate(a.id, {
      onSuccess: () => toast.success("Commande supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const saving = create.isPending || update.isPending;
  const montant = (s?: string) => acquisitions.filter((a) => !s || a.statut === s).reduce((acc, a) => acc + a.montantTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><ShoppingCart className="h-8 w-8 text-primary" />Acquisitions</h1>
          <p className="text-muted-foreground">Commandes d'ouvrages auprès des fournisseurs</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvelle commande</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Commandes</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{acquisitions.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">En attente de réception</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{fcfa(montant("Commandée"))}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Reçues</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{fcfa(montant("Reçue"))}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Fournisseur ou titre..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les acquisitions.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune commande.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead><TableHead>Fournisseur</TableHead><TableHead>Ouvrages</TableHead>
                  <TableHead>Montant</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{new Date(a.dateCommande).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{a.fournisseur || "—"}</TableCell>
                    <TableCell className="text-sm">{(a.lignes ?? []).map((l) => `${l.titre} ×${l.quantite}`).join(", ")}</TableCell>
                    <TableCell>{fcfa(a.montantTotal)}</TableCell>
                    <TableCell><Badge variant={a.statut === "Reçue" ? "default" : a.statut === "Annulée" ? "destructive" : "secondary"}>{a.statut}</Badge></TableCell>
                    <TableCell className="text-right">
                      {a.statut === "Commandée" && (
                        <Button variant="ghost" size="icon" aria-label="Marquer reçue" onClick={() => marquerRecue(a)}><PackageCheck className="h-4 w-4" /></Button>
                      )}
                      <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => handleDelete(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la commande" : "Nouvelle commande"}</DialogTitle>
            <DialogDescription>Le montant total est calculé à partir des lignes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Fournisseur</Label><Input value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={statut} onValueChange={setStatut}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ouvrages</Label>
              {lignes.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <Input className="flex-1" placeholder="Titre" value={l.titre} onChange={(e) => setLigne(i, { titre: e.target.value })} />
                  <Input className="w-20" type="number" min={1} value={l.quantite} onChange={(e) => setLigne(i, { quantite: parseInt(e.target.value) || 0 })} aria-label="Quantité" />
                  <Input className="w-32" type="number" min={0} value={l.prixUnitaire} onChange={(e) => setLigne(i, { prixUnitaire: parseFloat(e.target.value) || 0 })} aria-label="Prix unitaire" />
                  <Button variant="ghost" size="icon" aria-label="Retirer la ligne" disabled={lignes.length === 1} onClick={() => setLignes(lignes.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setLignes([...lignes, { ...emptyLigne }])}><Plus className="h-4 w-4 mr-1" />Ajouter une ligne</Button>
            </div>
            <div className="text-right font-semibold">Total : {fcfa(total)}</div>
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
