import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookMarked, Plus, Search, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreateReservation, useDeleteReservation, useLivresQuery, useReservationsQuery, useUpdateReservation } from "@/hooks/api/useBibliotheque";
import { useElevesQuery } from "@/hooks/api/useEleves";

/**
 * Réservations — branché sur le CRUD générique /api/bibliotheque/reservations (modèle `Reservation`).
 * Le routeur générique ne joint pas les relations : livre et élève sont recoupés côté client.
 * Retirés du mock (absents du schéma) : date d'expiration, position dans la file, notification envoyée.
 */

const STATUTS = ["En attente", "Disponible", "Honorée", "Annulée"];
const errMsg = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;

export default function Reservations() {
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ livreId: "", eleveId: "" });

  const { data: reservations = [], isLoading, isError } = useReservationsQuery();
  const { data: livres = [] } = useLivresQuery();
  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const create = useCreateReservation();
  const update = useUpdateReservation();
  const remove = useDeleteReservation();

  const livre = (id: string) => livres.find((l) => l.id === id);
  const eleveNom = (id?: string | null) => {
    const e = eleves.find((x) => x.id === id);
    return e ? `${e.nom} ${e.prenom}` : "—";
  };

  const filtered = reservations
    .filter((r) => {
      const s = search.toLowerCase();
      const matchSearch = !s || (livre(r.livreId)?.titre ?? "").toLowerCase().includes(s) || eleveNom(r.eleveId).toLowerCase().includes(s);
      return matchSearch && (statut === "all" || r.statut === statut);
    })
    .sort((a, b) => b.dateReservation.localeCompare(a.dateReservation));

  const handleCreate = () => {
    if (!form.livreId) { toast.error("Choisissez un livre"); return; }
    create.mutate(
      { livreId: form.livreId, eleveId: form.eleveId || null },
      {
        onSuccess: () => { toast.success("Réservation enregistrée"); setOpen(false); setForm({ livreId: "", eleveId: "" }); },
        onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la réservation")),
      },
    );
  };

  const changeStatut = (id: string, s: string) =>
    update.mutate({ id, statut: s }, {
      onSuccess: () => toast.success(`Statut : ${s}`),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la mise à jour")),
    });

  const handleDelete = (id: string) =>
    remove.mutate(id, {
      onSuccess: () => toast.success("Réservation supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  const badge = (s: string) => {
    const v = s === "Disponible" ? "default" : s === "Annulée" ? "destructive" : s === "Honorée" ? "outline" : "secondary";
    return <Badge variant={v as any}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><BookMarked className="h-8 w-8 text-primary" />Réservations</h1>
          <p className="text-muted-foreground">File d'attente des ouvrages réservés</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Nouvelle réservation</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {STATUTS.map((s) => (
          <Card key={s}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{s}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{reservations.filter((r) => r.statut === s).length}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Livre ou élève..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les réservations.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune réservation.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livre</TableHead><TableHead>Élève</TableHead><TableHead>Date</TableHead>
                  <TableHead>Disponibles</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const l = livre(r.livreId);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{l?.titre ?? "Livre inconnu"}</TableCell>
                      <TableCell>{eleveNom(r.eleveId)}</TableCell>
                      <TableCell>{new Date(r.dateReservation).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{l ? `${l.exemplairesDisponibles}/${l.nombreExemplaires}` : "—"}</TableCell>
                      <TableCell>
                        <Select value={r.statut} onValueChange={(s) => changeStatut(r.id, s)}>
                          <SelectTrigger className="w-36 h-8">{badge(r.statut)}</SelectTrigger>
                          <SelectContent>{STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>Nouvelle réservation</DialogTitle>
            <DialogDescription>La réservation est créée avec le statut « En attente ».</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Livre *</Label>
              <Select value={form.livreId} onValueChange={(v) => setForm({ ...form, livreId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir un livre" /></SelectTrigger>
                <SelectContent>{livres.map((l) => <SelectItem key={l.id} value={l.id}>{l.titre} ({l.exemplairesDisponibles} dispo.)</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Élève</Label>
              <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
                <SelectContent>{eleves.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={create.isPending}>{create.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Réserver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
