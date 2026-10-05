import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeartPulse, Plus, Search, Pencil, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useElevesQuery } from "@/hooks/api/useEleves";
import { errMsg, FicheSante, nomEleve, useFichesSanteQuery, useUpsertFicheSante } from "@/hooks/api/useInfirmerie";

/**
 * Fiches de santé — `GET /infirmerie/fiches-sante` (liste, route ajoutée) et
 * `PUT /infirmerie/fiches-sante/:eleveId` (upsert, une fiche par élève).
 * Retirés du mock (absents de `FicheSante`) : poids/taille/IMC, historique des vaccins détaillé,
 * contacts d'urgence multiples, handicaps, régimes alimentaires. Pas de suppression (aucune route).
 */

const GROUPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const NONE = "none";
const vide = { eleveId: "", groupeSanguin: NONE, allergies: "", maladiesChroniques: "", traitementEnCours: "", vaccinationsAJour: false, contactMedecin: "", observations: "" };
const opt = (s: string) => (s.trim() ? s.trim() : undefined);

export default function FichesSante() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(vide);

  const { data: fiches = [], isLoading, isError } = useFichesSanteQuery();
  const { data: eleves } = useElevesQuery({ pageSize: 200 });
  const upsert = useUpsertFicheSante();

  const sansFiche = useMemo(
    () => (eleves?.items ?? []).filter((e) => !fiches.some((f) => f.eleveId === e.id)),
    [eleves, fiches],
  );

  const filtered = fiches.filter((f) => {
    const q = search.toLowerCase();
    return !q || nomEleve(f.eleve).toLowerCase().includes(q) || (f.eleve?.matricule ?? "").toLowerCase().includes(q);
  });

  const openNew = () => { setForm(vide); setEditing(false); setOpen(true); };
  const openEdit = (f: FicheSante) => {
    setForm({
      eleveId: f.eleveId, groupeSanguin: f.groupeSanguin || NONE, allergies: f.allergies ?? "",
      maladiesChroniques: f.maladiesChroniques ?? "", traitementEnCours: f.traitementEnCours ?? "",
      vaccinationsAJour: f.vaccinationsAJour, contactMedecin: f.contactMedecin ?? "", observations: f.observations ?? "",
    });
    setEditing(true); setOpen(true);
  };

  const save = () => {
    if (!form.eleveId) { toast.error("Choisissez un élève"); return; }
    upsert.mutate(
      {
        eleveId: form.eleveId,
        groupeSanguin: form.groupeSanguin === NONE ? undefined : form.groupeSanguin,
        allergies: opt(form.allergies), maladiesChroniques: opt(form.maladiesChroniques),
        traitementEnCours: opt(form.traitementEnCours), vaccinationsAJour: form.vaccinationsAJour,
        contactMedecin: opt(form.contactMedecin), observations: opt(form.observations),
      },
      {
        onSuccess: () => { toast.success(editing ? "Fiche mise à jour" : "Fiche créée"); setOpen(false); },
        onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
      },
    );
  };

  const stats = {
    total: fiches.length,
    allergies: fiches.filter((f) => f.allergies).length,
    chroniques: fiches.filter((f) => f.maladiesChroniques).length,
    nonVaccines: fiches.filter((f) => !f.vaccinationsAJour).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fiches de santé</h1>
          <p className="text-muted-foreground">Une fiche médicale par élève</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Nouvelle fiche</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[["Fiches", stats.total], ["Allergies", stats.allergies], ["Maladies chroniques", stats.chroniques], ["Vaccins non à jour", stats.nonVaccines]].map(([l, v]) => (
          <Card key={l as string}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{l}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{v}</div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Rechercher un élève..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-6"><AlertCircle className="h-4 w-4" />Impossible de charger les fiches de santé.</div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aucune fiche de santé.</p>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Élève</TableHead><TableHead>Groupe</TableHead><TableHead>Allergies</TableHead>
                <TableHead>Maladies chroniques</TableHead><TableHead>Vaccins</TableHead><TableHead>Mise à jour</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell><div className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-primary" /><span className="font-medium">{nomEleve(f.eleve)}</span></div>
                      <span className="text-xs text-muted-foreground">{f.eleve?.matricule}</span></TableCell>
                    <TableCell>{f.groupeSanguin ?? "—"}</TableCell>
                    <TableCell>{f.allergies ? <Badge variant="destructive">{f.allergies}</Badge> : "—"}</TableCell>
                    <TableCell>{f.maladiesChroniques ?? "—"}</TableCell>
                    <TableCell><Badge variant={f.vaccinationsAJour ? "default" : "secondary"}>{f.vaccinationsAJour ? "À jour" : "Non à jour"}</Badge></TableCell>
                    <TableCell>{new Date(f.updatedAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Modifier la fiche" : "Nouvelle fiche de santé"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 space-y-2">
              <Label>Élève</Label>
              {editing ? (
                <Input disabled value={nomEleve(fiches.find((f) => f.eleveId === form.eleveId)?.eleve)} />
              ) : (
                <Select value={form.eleveId} onValueChange={(v) => setForm({ ...form, eleveId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir un élève sans fiche" /></SelectTrigger>
                  <SelectContent>{sansFiche.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</SelectItem>)}</SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Groupe sanguin</Label>
              <Select value={form.groupeSanguin} onValueChange={(v) => setForm({ ...form, groupeSanguin: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={NONE}>Non renseigné</SelectItem>{GROUPES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Médecin traitant (contact)</Label><Input value={form.contactMedecin} onChange={(e) => setForm({ ...form, contactMedecin: e.target.value })} /></div>
            <div className="space-y-2"><Label>Allergies</Label><Input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} /></div>
            <div className="space-y-2"><Label>Maladies chroniques</Label><Input value={form.maladiesChroniques} onChange={(e) => setForm({ ...form, maladiesChroniques: e.target.value })} /></div>
            <div className="md:col-span-2 space-y-2"><Label>Traitement en cours</Label><Input value={form.traitementEnCours} onChange={(e) => setForm({ ...form, traitementEnCours: e.target.value })} /></div>
            <div className="md:col-span-2 space-y-2"><Label>Observations</Label><Textarea value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.vaccinationsAJour} onCheckedChange={(v) => setForm({ ...form, vaccinationsAJour: v })} /><Label>Vaccinations à jour</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={upsert.isPending}>{upsert.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
