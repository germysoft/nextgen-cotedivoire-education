import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileBadge, Plus, Search, Trash2, Loader2, AlertCircle, Printer } from "lucide-react";
import { toast } from "sonner";
import { Certificat, genererNumeroReference, useCertificatsQuery, useCreateCertificat, useDeleteCertificat } from "@/hooks/api/useScolarite";
import { useElevesQuery } from "@/hooks/api/useEleves";

/**
 * Certificats — branché sur le CRUD générique /api/scolarite/certificats (modèle `Certificat`).
 * `numeroReference` (unique en base) est généré côté client (préfixe + horodatage + aléa) ;
 * en cas de collision, le serveur renvoie une erreur affichée dans le toast.
 * `contenuHtml` stocke le texte du certificat tel qu'émis ; l'impression le réutilise.
 * Retirés du mock (absents du schéma) : statut de demande/validation, motif de la demande, nombre d'exemplaires.
 */

const TYPES = ["Scolarité", "Fréquentation", "Radiation", "Inscription"];
const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export default function Certificats() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ eleveId: "", type: "Scolarité", signePar: "" });

  const { data: certificats = [], isLoading, isError } = useCertificatsQuery();
  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const create = useCreateCertificat();
  const remove = useDeleteCertificat();

  const eleve = (id: string) => eleves.find((e) => e.id === id);
  const filtered = certificats
    .filter((c) => {
      const e = eleve(c.eleveId);
      const s = search.toLowerCase();
      const matchSearch = !s || c.numeroReference.toLowerCase().includes(s) || (e ? `${e.nom} ${e.prenom} ${e.matricule}` : "").toLowerCase().includes(s);
      return matchSearch && (typeFilter === "all" || c.type === typeFilter);
    })
    .sort((a, b) => b.dateDelivrance.localeCompare(a.dateDelivrance));

  const contenu = (eleveId: string, type: string) => {
    const e = eleve(eleveId);
    if (!e) return "";
    const classe = e.inscriptions?.[0]?.classe?.nom ?? "—";
    const naissance = new Date(e.dateNaissance).toLocaleDateString("fr-FR");
    return `<p>Le chef d'établissement certifie que l'élève <strong>${esc(e.nom)} ${esc(e.prenom)}</strong>, matricule ${esc(e.matricule)}, né(e) le ${naissance}, est régulièrement inscrit(e) en classe de <strong>${esc(classe)}</strong>.</p><p>Certificat de ${esc(type.toLowerCase())} délivré pour servir et valoir ce que de droit.</p>`;
  };

  const submit = () => {
    if (!form.eleveId) { toast.error("Choisissez un élève"); return; }
    create.mutate(
      {
        eleveId: form.eleveId,
        type: form.type,
        numeroReference: genererNumeroReference(form.type),
        contenuHtml: contenu(form.eleveId, form.type),
        signePar: form.signePar.trim() || null,
      },
      {
        onSuccess: (c) => { toast.success(`Certificat ${c.numeroReference} délivré`); setOpen(false); setForm({ eleveId: "", type: "Scolarité", signePar: "" }); },
        onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la délivrance du certificat")),
      },
    );
  };

  const imprimer = (c: Certificat) => {
    const w = window.open("", "_blank");
    if (!w) { toast.error("Autorisez les fenêtres pop-up pour imprimer"); return; }
    w.document.write(`<html><head><title>${esc(c.numeroReference)}</title><style>body{font-family:serif;max-width:700px;margin:60px auto;line-height:1.7}h1{text-align:center}</style></head><body>
      <h1>Certificat de ${esc(c.type.toLowerCase())}</h1><p style="text-align:right">Réf. ${esc(c.numeroReference)}</p>
      ${c.contenuHtml ?? ""}
      <p style="margin-top:48px;text-align:right">Fait le ${new Date(c.dateDelivrance).toLocaleDateString("fr-FR")}<br/>${esc(c.signePar ?? "")}</p>
      </body></html>`);
    w.document.close();
    w.print();
  };

  const del = (c: Certificat) =>
    remove.mutate(c.id, {
      onSuccess: () => toast.success("Certificat supprimé"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><FileBadge className="h-8 w-8 text-primary" />Certificats</h1>
          <p className="text-muted-foreground">Délivrance des certificats de scolarité, fréquentation…</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Nouveau certificat</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {TYPES.map((t) => (
          <Card key={t}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{certificats.filter((c) => c.type === t).length}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Référence, élève ou matricule..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les certificats.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucun certificat.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead><TableHead>Élève</TableHead><TableHead>Type</TableHead>
                  <TableHead>Délivré le</TableHead><TableHead>Signé par</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const e = eleve(c.eleveId);
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.numeroReference}</TableCell>
                      <TableCell className="font-medium">{e ? `${e.nom} ${e.prenom}` : "Élève inconnu"}</TableCell>
                      <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                      <TableCell>{new Date(c.dateDelivrance).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{c.signePar || "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" aria-label="Imprimer" onClick={() => imprimer(c)}><Printer className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>Nouveau certificat</DialogTitle>
            <DialogDescription>Le numéro de référence est généré automatiquement.</DialogDescription>
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
            <div className="space-y-2"><Label>Signé par</Label><Input placeholder="Nom et fonction du signataire" value={form.signePar} onChange={(e) => setForm({ ...form, signePar: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={submit} disabled={create.isPending}>{create.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Délivrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
