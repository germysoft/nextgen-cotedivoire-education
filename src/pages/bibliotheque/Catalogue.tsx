import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Search, Pencil, Trash2, Loader2, AlertCircle, Library } from "lucide-react";
import { toast } from "sonner";
import { Livre, LivreInput, useCreateLivre, useDeleteLivre, useLivresQuery, useUpdateLivre } from "@/hooks/api/useBibliotheque";

/**
 * Catalogue — branché sur GET/POST/PUT/DELETE /api/bibliotheque/livres.
 * Champs mock retirés faute d'équivalent dans le modèle Prisma `Livre` :
 * résumé, langue, nombre de pages, note des lecteurs, mots-clés, cote Dewey.
 * L'emplacement physique est conservé (champ `emplacement`).
 */

const errMsg = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;

const emptyForm = { isbn: "", titre: "", auteur: "", editeur: "", categorie: "", anneeEdition: "", nombreExemplaires: "1", emplacement: "" };

export default function Catalogue() {
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Livre | null>(null);
  const [toDelete, setToDelete] = useState<Livre | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: livres = [], isLoading, isError } = useLivresQuery();
  const createLivre = useCreateLivre();
  const updateLivre = useUpdateLivre();
  const deleteLivre = useDeleteLivre();

  const categories = Array.from(new Set(livres.map((l) => l.categorie).filter(Boolean))) as string[];
  const filtered = livres.filter((l) => {
    const s = search.toLowerCase();
    const matchSearch = !s || l.titre.toLowerCase().includes(s) || l.auteur.toLowerCase().includes(s) || (l.isbn ?? "").includes(s);
    return matchSearch && (categorie === "all" || l.categorie === categorie);
  });

  const stats = {
    titres: livres.length,
    exemplaires: livres.reduce((a, l) => a + l.nombreExemplaires, 0),
    disponibles: livres.reduce((a, l) => a + l.exemplairesDisponibles, 0),
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (l: Livre) => {
    setEditing(l);
    setForm({
      isbn: l.isbn ?? "", titre: l.titre, auteur: l.auteur, editeur: l.editeur ?? "", categorie: l.categorie ?? "",
      anneeEdition: l.anneeEdition?.toString() ?? "", nombreExemplaires: l.nombreExemplaires.toString(), emplacement: l.emplacement ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.titre.trim() || !form.auteur.trim()) { toast.error("Le titre et l'auteur sont obligatoires"); return; }
    const payload: LivreInput = {
      titre: form.titre.trim(),
      auteur: form.auteur.trim(),
      isbn: form.isbn.trim() || undefined,
      editeur: form.editeur.trim() || undefined,
      categorie: form.categorie.trim() || undefined,
      emplacement: form.emplacement.trim() || undefined,
      anneeEdition: form.anneeEdition ? parseInt(form.anneeEdition) : undefined,
      nombreExemplaires: Math.max(1, parseInt(form.nombreExemplaires) || 1),
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Livre modifié" : "Livre ajouté au catalogue"); setDialogOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement du livre")),
    };
    if (editing) updateLivre.mutate({ id: editing.id, ...payload }, opts);
    else createLivre.mutate(payload, opts);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    deleteLivre.mutate(toDelete.id, {
      onSuccess: () => { toast.success("Livre supprimé"); setToDelete(null); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });
  };

  const saving = createLivre.isPending || updateLivre.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Library className="h-8 w-8 text-primary" />Catalogue</h1>
          <p className="text-muted-foreground">Gestion des ouvrages de la bibliothèque</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouveau livre</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[["Titres", stats.titres], ["Exemplaires", stats.exemplaires], ["Disponibles", stats.disponibles]].map(([label, val]) => (
          <Card key={label as string}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{val}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Titre, auteur ou ISBN..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={categorie} onValueChange={setCategorie}>
              <SelectTrigger className="w-full md:w-56"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger le catalogue.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />Aucun livre trouvé.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead><TableHead>Auteur</TableHead><TableHead>Catégorie</TableHead>
                  <TableHead>ISBN</TableHead><TableHead>Emplacement</TableHead><TableHead>Disponibilité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.titre}{l.anneeEdition ? <span className="text-muted-foreground"> ({l.anneeEdition})</span> : null}</TableCell>
                    <TableCell>{l.auteur}</TableCell>
                    <TableCell>{l.categorie ? <Badge variant="outline">{l.categorie}</Badge> : "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{l.isbn || "—"}</TableCell>
                    <TableCell>{l.emplacement || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={l.exemplairesDisponibles > 0 ? "default" : "destructive"}>
                        {l.exemplairesDisponibles}/{l.nombreExemplaires}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => setToDelete(l)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le livre" : "Nouveau livre"}</DialogTitle>
            <DialogDescription>Les exemplaires disponibles sont recalculés automatiquement.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2"><Label>Titre *</Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
            <div className="space-y-2"><Label>Auteur *</Label><Input value={form.auteur} onChange={(e) => setForm({ ...form, auteur: e.target.value })} /></div>
            <div className="space-y-2"><Label>Éditeur</Label><Input value={form.editeur} onChange={(e) => setForm({ ...form, editeur: e.target.value })} /></div>
            <div className="space-y-2"><Label>ISBN</Label><Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} /></div>
            <div className="space-y-2"><Label>Catégorie</Label><Input value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} /></div>
            <div className="space-y-2"><Label>Année d'édition</Label><Input type="number" value={form.anneeEdition} onChange={(e) => setForm({ ...form, anneeEdition: e.target.value })} /></div>
            <div className="space-y-2"><Label>Nombre d'exemplaires</Label><Input type="number" min={1} value={form.nombreExemplaires} onChange={(e) => setForm({ ...form, nombreExemplaires: e.target.value })} /></div>
            <div className="col-span-2 space-y-2"><Label>Emplacement</Label><Input placeholder="Ex. Rayon A3" value={form.emplacement} onChange={(e) => setForm({ ...form, emplacement: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce livre ?</DialogTitle>
            <DialogDescription>« {toDelete?.titre} » sera retiré du catalogue. Un livre ayant déjà été emprunté ou réservé ne peut pas être supprimé.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLivre.isPending}>{deleteLivre.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
