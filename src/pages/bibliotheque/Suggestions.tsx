import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Plus, Search, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreateSuggestion, useDeleteSuggestion, useLivresQuery, useSuggestionsQuery, useUpdateSuggestion } from "@/hooks/api/useBibliotheque";

/**
 * Suggestions d'achat — branché sur le CRUD générique /api/bibliotheque/suggestions (modèle `SuggestionAchat`).
 * Une suggestion porte soit un titre libre (`titreSuggere`), soit une référence à un livre existant
 * (`livreId`, ex. pour demander des exemplaires supplémentaires).
 * Retirés du mock (absents du schéma) : auteur suggéré, justification, votes, priorité, prix estimé.
 */

const STATUTS = ["Proposée", "Validée", "Achetée", "Rejetée"];
const AUCUN = "none";
const errMsg = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;

export default function Suggestions() {
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titreSuggere: "", livreId: AUCUN, suggerePar: "" });

  const { data: suggestions = [], isLoading, isError } = useSuggestionsQuery();
  const { data: livres = [] } = useLivresQuery();
  const create = useCreateSuggestion();
  const update = useUpdateSuggestion();
  const remove = useDeleteSuggestion();

  const titre = (s: { livreId?: string | null; titreSuggere?: string | null }) =>
    s.titreSuggere || livres.find((l) => l.id === s.livreId)?.titre || "—";

  const filtered = suggestions
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || titre(s).toLowerCase().includes(q) || (s.suggerePar ?? "").toLowerCase().includes(q);
      return matchSearch && (statut === "all" || s.statut === statut);
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleCreate = () => {
    const livreId = form.livreId === AUCUN ? null : form.livreId;
    if (!form.titreSuggere.trim() && !livreId) { toast.error("Indiquez un titre ou choisissez un livre existant"); return; }
    create.mutate(
      { titreSuggere: form.titreSuggere.trim() || null, livreId, suggerePar: form.suggerePar.trim() || null },
      {
        onSuccess: () => { toast.success("Suggestion enregistrée"); setOpen(false); setForm({ titreSuggere: "", livreId: AUCUN, suggerePar: "" }); },
        onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
      },
    );
  };

  const changeStatut = (id: string, s: string) =>
    update.mutate({ id, statut: s }, {
      onSuccess: () => toast.success(`Suggestion : ${s}`),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la mise à jour")),
    });

  const handleDelete = (id: string) =>
    remove.mutate(id, {
      onSuccess: () => toast.success("Suggestion supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Lightbulb className="h-8 w-8 text-primary" />Suggestions d'achat</h1>
          <p className="text-muted-foreground">Propositions d'ouvrages des élèves et enseignants</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Nouvelle suggestion</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {STATUTS.map((s) => (
          <Card key={s}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{s}s</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{suggestions.filter((x) => x.statut === s).length}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Titre ou auteur de la suggestion..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les suggestions.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune suggestion.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead><TableHead>Type</TableHead><TableHead>Suggéré par</TableHead>
                  <TableHead>Date</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{titre(s)}</TableCell>
                    <TableCell>{s.livreId ? <Badge variant="outline">Exemplaires suppl.</Badge> : <Badge variant="secondary">Nouveau titre</Badge>}</TableCell>
                    <TableCell>{s.suggerePar || "—"}</TableCell>
                    <TableCell>{new Date(s.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <Select value={s.statut} onValueChange={(v) => changeStatut(s.id, v)}>
                        <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUTS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>Nouvelle suggestion</DialogTitle>
            <DialogDescription>Proposez un nouveau titre, ou des exemplaires supplémentaires d'un livre existant.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Titre suggéré</Label><Input value={form.titreSuggere} onChange={(e) => setForm({ ...form, titreSuggere: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Ou livre existant</Label>
              <Select value={form.livreId} onValueChange={(v) => setForm({ ...form, livreId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUCUN}>Aucun</SelectItem>
                  {livres.map((l) => <SelectItem key={l.id} value={l.id}>{l.titre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Suggéré par</Label><Input placeholder="Nom de l'élève ou de l'enseignant" value={form.suggerePar} onChange={(e) => setForm({ ...form, suggerePar: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={create.isPending}>{create.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
