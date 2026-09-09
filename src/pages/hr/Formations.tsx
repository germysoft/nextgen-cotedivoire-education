import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Award, BookOpen, Clock, Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  FormationRH,
  useFormationsQuery, useCreateFormation, useUpdateFormation, useDeleteFormation,
} from "@/hooks/api/useRecrutementRH";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";

/**
 * Page branchée sur l'API réelle : /api/rh/formations (modèle `Formation`).
 *
 * Une formation réelle porte uniquement : personnelId, intitule, organisme,
 * dateDebut, dateFin, dureeHeures, certifiante et commentaire.
 * Champs du mock retirés faute d'équivalent en base (plutôt qu'inventés) :
 * catégorie/thème, budget et financement, formateur, lieu, liste de participants
 * multiples, taux de satisfaction et statut du cycle de formation. Le routeur
 * générique ne joint pas la relation `personnel` : le nom est recoupé côté client.
 */

const apiError = (err: any, fallback: string) => toast.error(err?.response?.data?.error ?? fallback);

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—";

const emptyForm = {
  personnelId: "", intitule: "", organisme: "",
  dateDebut: "", dateFin: "", dureeHeures: "8", certifiante: false, commentaire: "",
};

export default function FormationsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const formationsQuery = useFormationsQuery();
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500 });
  const formations = formationsQuery.data ?? [];
  const personnel = personnelData?.items ?? [];

  const createFormation = useCreateFormation();
  const updateFormation = useUpdateFormation();
  const deleteFormation = useDeleteFormation();

  const personnelById = useMemo(
    () => new Map(personnel.map((p) => [p.id, p])),
    [personnel]
  );

  const nomPersonnel = (id: string) => {
    const p = personnelById.get(id);
    return p ? `${p.nom} ${p.prenom}` : "Personnel inconnu";
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return formations
      .filter((f) => `${f.intitule} ${f.organisme} ${nomPersonnel(f.personnelId)}`.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());
  }, [formations, search, personnelById]);

  const stats = {
    total: formations.length,
    heures: formations.reduce((s, f) => s + (f.dureeHeures ?? 0), 0),
    certifiantes: formations.filter((f) => f.certifiante).length,
    beneficiaires: new Set(formations.map((f) => f.personnelId)).size,
  };

  const openCreate = () => {
    setEditingId(null);
    const today = new Date().toISOString().split("T")[0];
    setForm({ ...emptyForm, dateDebut: today, dateFin: today });
    setDialogOpen(true);
  };

  const openEdit = (f: FormationRH) => {
    setEditingId(f.id);
    setForm({
      personnelId: f.personnelId,
      intitule: f.intitule,
      organisme: f.organisme,
      dateDebut: f.dateDebut.split("T")[0],
      dateFin: f.dateFin.split("T")[0],
      dureeHeures: String(f.dureeHeures ?? 0),
      certifiante: f.certifiante,
      commentaire: f.commentaire ?? "",
    });
    setDialogOpen(true);
  };

  const submit = () => {
    if (!form.personnelId || !form.intitule.trim() || !form.organisme.trim() || !form.dateDebut || !form.dateFin) {
      toast.error("Employé, intitulé, organisme et dates sont obligatoires");
      return;
    }
    const payload = {
      personnelId: form.personnelId,
      intitule: form.intitule.trim(),
      organisme: form.organisme.trim(),
      dateDebut: new Date(form.dateDebut).toISOString(),
      dateFin: new Date(form.dateFin).toISOString(),
      dureeHeures: Number(form.dureeHeures) || 0,
      certifiante: form.certifiante,
      commentaire: form.commentaire || null,
    };
    const done = (msg: string) => () => { toast.success(msg); setDialogOpen(false); };
    if (editingId) {
      updateFormation.mutate({ id: editingId, ...payload }, {
        onSuccess: done("Formation mise à jour"),
        onError: (err) => apiError(err, "Impossible de mettre à jour la formation"),
      });
    } else {
      createFormation.mutate(payload, {
        onSuccess: done("Formation enregistrée"),
        onError: (err) => apiError(err, "Impossible d'enregistrer la formation"),
      });
    }
  };

  const remove = (f: FormationRH) => {
    deleteFormation.mutate(f.id, {
      onSuccess: () => toast.success("Formation supprimée"),
      onError: (err) => apiError(err, "Impossible de supprimer la formation"),
    });
  };

  if (formationsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Chargement des formations...
      </div>
    );
  }

  if (formationsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <p className="font-medium">Impossible de charger les formations</p>
        <p className="text-sm text-muted-foreground">Vérifiez votre connexion, puis rechargez la page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
          <p className="text-muted-foreground">Formations suivies par le personnel</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Nouvelle formation</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formations</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures cumulées</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.heures}h</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifiantes</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.certifiantes}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Bénéficiaires</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.beneficiaires}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Suivi des formations</CardTitle>
              <CardDescription>Intitulé, organisme, période et durée</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Intitulé</TableHead>
                <TableHead>Organisme</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Certifiante</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{nomPersonnel(f.personnelId)}</TableCell>
                  <TableCell>{f.intitule}</TableCell>
                  <TableCell>{f.organisme}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>Du {formatDate(f.dateDebut)}</span>
                      <span className="text-muted-foreground">Au {formatDate(f.dateFin)}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{f.dureeHeures}h</Badge></TableCell>
                  <TableCell>{f.certifiante ? <Badge className="gap-1"><Award className="h-3 w-3" />Oui</Badge> : <Badge variant="outline">Non</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(f)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(f)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune formation trouvée</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle>
            <DialogDescription>Les champs correspondent exactement aux données enregistrées.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2"><Label>Employé *</Label>
              <Select value={form.personnelId} onValueChange={(v) => setForm((f) => ({ ...f, personnelId: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un employé..." /></SelectTrigger>
                <SelectContent>
                  {personnel.map((p) => <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom} — {p.poste}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Intitulé *</Label>
                <Input value={form.intitule} onChange={(e) => setForm((f) => ({ ...f, intitule: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Organisme *</Label>
                <Input value={form.organisme} onChange={(e) => setForm((f) => ({ ...f, organisme: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Début *</Label>
                <Input type="date" value={form.dateDebut} onChange={(e) => setForm((f) => ({ ...f, dateDebut: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Fin *</Label>
                <Input type="date" value={form.dateFin} onChange={(e) => setForm((f) => ({ ...f, dateFin: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Durée (h)</Label>
                <Input type="number" min="0" value={form.dureeHeures} onChange={(e) => setForm((f) => ({ ...f, dureeHeures: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Formation certifiante</Label>
                <p className="text-xs text-muted-foreground">Délivre un diplôme ou une certification</p>
              </div>
              <Switch checked={form.certifiante} onCheckedChange={(v) => setForm((f) => ({ ...f, certifiante: v }))} />
            </div>
            <div className="space-y-2"><Label>Commentaire</Label>
              <Textarea rows={3} value={form.commentaire} onChange={(e) => setForm((f) => ({ ...f, commentaire: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={submit} disabled={createFormation.isPending || updateFormation.isPending}>
              {createFormation.isPending || updateFormation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
