import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Clock, CheckCircle, XCircle, AlertCircle, User, TrendingUp, Plus, Loader2, Trash2, Search,
} from "lucide-react";
import { toast } from "sonner";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";
import {
  Pointage as PointageRecord,
  useCreatePointage,
  useDeletePointage,
  usePointagesQuery,
} from "@/hooks/api/useRH";

const STATUTS: PointageRecord["statut"][] = ["Présent", "Absent", "Retard", "Congé"];

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = {
  personnelId: "",
  date: today(),
  heureArrivee: "",
  heureDepart: "",
  statut: "Présent" as PointageRecord["statut"],
  commentaire: "",
};

/**
 * Simplifications par rapport à l'ancienne version mock (modèle Prisma
 * `Pointage` : personnel, date, heureArrivee, heureDepart, statut,
 * commentaire) :
 * - le "retard en minutes" n'est pas stocké : il est recalculé à l'affichage
 *   à partir de l'heure d'arrivée réelle et de l'heure de référence ci-dessous ;
 * - le bloc "Statistiques hebdomadaires" (chiffres fabriqués) est remplacé par
 *   une répartition réelle calculée sur les pointages de la journée chargée.
 */
const HEURE_REFERENCE_MINUTES = 8 * 60; // 08:00

export default function Pointage() {
  const [date, setDate] = useState(today());
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: pointages = [], isLoading, isError } = usePointagesQuery({ date });
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500 });
  const personnel = personnelData?.items ?? [];
  const createPointage = useCreatePointage();
  const deletePointage = useDeletePointage();

  const totalPersonnel = personnelData?.total ?? personnel.length;

  const stats = {
    presents: pointages.filter((p) => p.statut === "Présent" || p.statut === "Retard").length,
    alHeure: pointages.filter((p) => p.statut === "Présent").length,
    retards: pointages.filter((p) => p.statut === "Retard").length,
    absents: pointages.filter((p) => p.statut === "Absent").length,
    conges: pointages.filter((p) => p.statut === "Congé").length,
  };
  const tauxPresence = totalPersonnel > 0 ? ((stats.presents / totalPersonnel) * 100).toFixed(1) : "0.0";

  const heure = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "-";

  const retardMinutes = (p: PointageRecord) => {
    if (!p.heureArrivee) return 0;
    const d = new Date(p.heureArrivee);
    const minutes = d.getHours() * 60 + d.getMinutes();
    return Math.max(0, minutes - HEURE_REFERENCE_MINUTES);
  };

  const nomComplet = (p: { nom: string; prenom: string }) => `${p.nom} ${p.prenom}`;

  const filtered = pointages.filter(
    (p) =>
      nomComplet(p.personnel).toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.personnel.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toIso = (dateStr: string, time: string) => (time ? new Date(`${dateStr}T${time}:00`).toISOString() : undefined);

  const handleSubmit = () => {
    if (!form.personnelId || !form.date) {
      toast.error("Sélectionnez un membre du personnel et une date.");
      return;
    }
    createPointage.mutate(
      {
        personnelId: form.personnelId,
        date: new Date(`${form.date}T00:00:00`).toISOString(),
        heureArrivee: toIso(form.date, form.heureArrivee),
        heureDepart: toIso(form.date, form.heureDepart),
        statut: form.statut,
        commentaire: form.commentaire || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Pointage enregistré.");
          setDialogOpen(false);
          setForm({ ...emptyForm, date: form.date });
        },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de l'enregistrement."),
      }
    );
  };

  const handleDelete = (p: PointageRecord) => {
    deletePointage.mutate(p.id, {
      onSuccess: () => toast.success(`Pointage de ${nomComplet(p.personnel)} supprimé.`),
      onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de la suppression."),
    });
  };

  const statutBadge = (statut: PointageRecord["statut"]) => {
    if (statut === "Présent")
      return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Présent</Badge>;
    if (statut === "Retard")
      return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" />Retard</Badge>;
    if (statut === "Congé")
      return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Congé</Badge>;
    return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Absent</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pointage du Personnel</h1>
          <p className="text-muted-foreground">Suivi quotidien des présences et assiduité</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" className="w-44" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button onClick={() => { setForm({ ...emptyForm, date }); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau pointage
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presents}</div>
            <p className="text-xs text-muted-foreground">Sur {totalPersonnel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À l'heure</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.alHeure}</div>
            <p className="text-xs text-muted-foreground">Statut « Présent »</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.retards}</div>
            <p className="text-xs text-muted-foreground">Ce jour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absents</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absents}</div>
            <p className="text-xs text-muted-foreground">{stats.conges} en congé</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxPresence}%</div>
            <Progress value={parseFloat(tauxPresence)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Pointages du {new Date(date).toLocaleDateString("fr-FR")}</CardTitle>
              <CardDescription>Données issues du registre de pointage réel</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
            </div>
          )}
          {isError && <div className="py-16 text-center text-destructive">Impossible de contacter l'API.</div>}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">Aucun pointage enregistré pour cette date.</div>
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Arrivée</TableHead>
                  <TableHead>Départ</TableHead>
                  <TableHead>Retard</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{nomComplet(p.personnel)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{p.personnel.poste}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{heure(p.heureArrivee)}</div>
                    </TableCell>
                    <TableCell>{heure(p.heureDepart)}</TableCell>
                    <TableCell>
                      {retardMinutes(p) > 0 ? (
                        <Badge variant="destructive">{retardMinutes(p)} min</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{statutBadge(p.statut)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un pointage</DialogTitle>
            <DialogDescription>Le pointage est enregistré directement dans le registre du personnel.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Personnel *</Label>
              <Select value={form.personnelId} onValueChange={(v) => setForm({ ...form, personnelId: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {personnel.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom} — {p.poste}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={form.statut} onValueChange={(v: any) => setForm({ ...form, statut: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heure d'arrivée</Label>
                <Input type="time" value={form.heureArrivee} onChange={(e) => setForm({ ...form, heureArrivee: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Heure de départ</Label>
                <Input type="time" value={form.heureDepart} onChange={(e) => setForm({ ...form, heureDepart: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Commentaire</Label>
              <Textarea
                rows={2}
                value={form.commentaire}
                onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
                placeholder="Justificatif, précision…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={createPointage.isPending}>
              {createPointage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
