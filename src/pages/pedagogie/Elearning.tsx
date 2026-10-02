import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Laptop, Plus, Search, Pencil, Trash2, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { RessourceElearning, useCreateRessourceElearning, useDeleteRessourceElearning, useMatieresQuery, useRessourcesElearningQuery, useUpdateRessourceElearning } from "@/hooks/api/usePedagogie";

/**
 * E-learning — branché sur le CRUD générique /api/pedagogie/elearning (modèle `RessourceElearning`).
 * Une ressource est un lien (`url`) : aucun envoi de fichier n'est géré par cet endpoint.
 * Retirés du mock (absents du schéma) : description, durée, vues, téléchargements, notes,
 * classes cibles, devoirs/rendus, forum. `publieParId` est renseigné par le serveur s'il le gère.
 */

const TYPES = ["Document", "Vidéo", "Exercice", "QCM"];
const AUCUNE = "none";
const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const empty = { titre: "", type: "Document", matiereId: AUCUNE, url: "", niveau: "" };

export default function Elearning() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RessourceElearning | null>(null);
  const [form, setForm] = useState(empty);

  const { data: ressources = [], isLoading, isError } = useRessourcesElearningQuery();
  const { data: matieres = [] } = useMatieresQuery();
  const create = useCreateRessourceElearning();
  const update = useUpdateRessourceElearning();
  const remove = useDeleteRessourceElearning();

  const matiereNom = (id?: string | null) => matieres.find((m) => m.id === id)?.nom ?? "—";
  const filtered = ressources
    .filter((r) => {
      const s = search.toLowerCase();
      const matchSearch = !s || r.titre.toLowerCase().includes(s) || matiereNom(r.matiereId).toLowerCase().includes(s);
      return matchSearch && (typeFilter === "all" || r.type === typeFilter);
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (r: RessourceElearning) => {
    setEditing(r);
    setForm({ titre: r.titre, type: r.type, matiereId: r.matiereId ?? AUCUNE, url: r.url ?? "", niveau: r.niveau ?? "" });
    setOpen(true);
  };

  const submit = () => {
    if (!form.titre.trim()) { toast.error("Le titre est obligatoire"); return; }
    if (form.url && !/^https?:\/\//.test(form.url.trim())) { toast.error("Le lien doit commencer par http:// ou https://"); return; }
    const payload = {
      titre: form.titre.trim(), type: form.type,
      matiereId: form.matiereId === AUCUNE ? null : form.matiereId,
      url: form.url.trim() || null, niveau: form.niveau.trim() || null,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Ressource modifiée" : "Ressource publiée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const del = (r: RessourceElearning) =>
    remove.mutate(r.id, {
      onSuccess: () => toast.success("Ressource supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Laptop className="h-8 w-8 text-primary" />E-learning</h1>
          <p className="text-muted-foreground">Ressources pédagogiques en ligne</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvelle ressource</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {TYPES.map((t) => (
          <Card key={t}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{ressources.filter((r) => r.type === t).length}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Titre ou matière..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les ressources.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune ressource.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead><TableHead>Type</TableHead><TableHead>Matière</TableHead>
                  <TableHead>Niveau</TableHead><TableHead>Ajoutée le</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.titre}</TableCell>
                    <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                    <TableCell>{matiereNom(r.matiereId)}</TableCell>
                    <TableCell>{r.niveau || "—"}</TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">
                      {r.url && (
                        <Button variant="ghost" size="icon" aria-label="Ouvrir" asChild>
                          <a href={r.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>{editing ? "Modifier la ressource" : "Nouvelle ressource"}</DialogTitle>
            <DialogDescription>Indiquez un lien vers le document, la vidéo ou l'exercice.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2"><Label>Titre *</Label><Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Matière</Label>
              <Select value={form.matiereId} onValueChange={(v) => setForm({ ...form, matiereId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUCUNE}>Aucune</SelectItem>
                  {matieres.map((m) => <SelectItem key={m.id} value={m.id}>{m.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Niveau</Label><Input placeholder="Ex. 3ème" value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })} /></div>
            <div className="space-y-2"><Label>Lien</Label><Input placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></div>
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
