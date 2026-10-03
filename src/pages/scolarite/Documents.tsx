import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, Plus, Search, Pencil, Trash2, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { DocumentEleve, useCreateDocumentEleve, useDeleteDocumentEleve, useDocumentsElevesQuery, useUpdateDocumentEleve } from "@/hooks/api/useScolarite";
import { useElevesQuery } from "@/hooks/api/useEleves";

/**
 * Documents élèves — branché sur le CRUD générique /api/scolarite/documents (modèle `DocumentEleve`).
 * Le document est référencé par un lien (`url`) : l'endpoint ne gère pas l'envoi de fichiers.
 * Retirés du mock (absents du schéma) : statut de validation, date d'expiration, taille/format du fichier,
 * liste des pièces obligatoires par niveau, relances de pièces manquantes.
 */

const TYPES = ["Extrait de naissance", "Bulletin", "Certificat médical", "Photo d'identité", "Certificat de scolarité", "Autre"];
const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const empty = { eleveId: "", type: TYPES[0], nom: "", url: "" };

export default function Documents() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DocumentEleve | null>(null);
  const [form, setForm] = useState(empty);

  const { data: documents = [], isLoading, isError } = useDocumentsElevesQuery();
  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const create = useCreateDocumentEleve();
  const update = useUpdateDocumentEleve();
  const remove = useDeleteDocumentEleve();

  const eleve = (id: string) => eleves.find((e) => e.id === id);
  const filtered = documents
    .filter((d) => {
      const e = eleve(d.eleveId);
      const s = search.toLowerCase();
      const matchSearch = !s || d.nom.toLowerCase().includes(s) || (e ? `${e.nom} ${e.prenom} ${e.matricule}` : "").toLowerCase().includes(s);
      return matchSearch && (typeFilter === "all" || d.type === typeFilter);
    })
    .sort((a, b) => b.dateAjout.localeCompare(a.dateAjout));

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (d: DocumentEleve) => { setEditing(d); setForm({ eleveId: d.eleveId, type: d.type, nom: d.nom, url: d.url ?? "" }); setOpen(true); };

  const submit = () => {
    if (!form.eleveId || !form.nom.trim()) { toast.error("Élève et nom du document sont obligatoires"); return; }
    if (form.url && !/^https?:\/\//.test(form.url.trim())) { toast.error("Le lien doit commencer par http:// ou https://"); return; }
    const payload = { eleveId: form.eleveId, type: form.type, nom: form.nom.trim(), url: form.url.trim() || null };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Document modifié" : "Document ajouté"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const del = (d: DocumentEleve) =>
    remove.mutate(d.id, {
      onSuccess: () => toast.success("Document supprimé"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><FolderOpen className="h-8 w-8 text-primary" />Documents élèves</h1>
          <p className="text-muted-foreground">Pièces administratives des dossiers élèves</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Ajouter un document</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Documents</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{documents.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Élèves avec dossier</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{new Set(documents.map((d) => d.eleveId)).size}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Sans lien</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{documents.filter((d) => !d.url).length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Document, élève ou matricule..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
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
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les documents.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucun document.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Élève</TableHead>
                  <TableHead>Ajouté le</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => {
                  const e = eleve(d.eleveId);
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.nom}</TableCell>
                      <TableCell><Badge variant="outline">{d.type}</Badge></TableCell>
                      <TableCell>{e ? `${e.nom} ${e.prenom}` : "Élève inconnu"}</TableCell>
                      <TableCell>{new Date(d.dateAjout).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell className="text-right">
                        {d.url && (
                          <Button variant="ghost" size="icon" aria-label="Ouvrir" asChild>
                            <a href={d.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(d)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>{editing ? "Modifier le document" : "Ajouter un document"}</DialogTitle>
            <DialogDescription>Indiquez un lien vers le fichier (stockage externe).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Élève *</Label>
              <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
                <SelectContent>{eleves.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Nom du document *</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
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
