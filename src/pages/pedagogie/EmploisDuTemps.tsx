import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Cours, useCreateCours, useDeleteCours, useEmploiDuTempsQuery, useMatieresQuery, useSallesQuery, useUpdateCours } from "@/hooks/api/usePedagogie";
import { useClassesQuery } from "@/hooks/api/useClasses";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";

/**
 * Emplois du temps — branché sur /api/pedagogie/emploi-du-temps (GET/POST/PUT/DELETE).
 * Le backend refuse tout chevauchement enseignant/salle (409) : le message est affiché tel quel.
 * Les salles viennent de /api/pedagogie/salles (module RBAC « infrastructures ») ; sans ce droit,
 * la liste est vide et la salle reste optionnelle.
 * Retirés du mock (absents du modèle `Cours`) : couleur, type de séance, semaines A/B, notes.
 */

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const CRENEAUX = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const AUCUNE = "none";
const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;

export default function EmploisDuTemps() {
  const { data: classes = [] } = useClassesQuery();
  const [classeId, setClasseId] = useState<string>("");
  const classeActive = classeId || classes[0]?.id || "";

  const { data: cours = [], isLoading, isError } = useEmploiDuTempsQuery({ classeId: classeActive || undefined });
  const { data: matieres = [] } = useMatieresQuery();
  const { data: salles = [] } = useSallesQuery();
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500, categoriePersonnel: "Enseignant" });
  const enseignants = personnelData?.items ?? [];
  const create = useCreateCours();
  const update = useUpdateCours();
  const remove = useDeleteCours();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cours | null>(null);
  const [form, setForm] = useState({ matiereId: "", personnelId: "", salleId: AUCUNE, jourSemaine: "1", heureDebut: "08:00", heureFin: "09:00" });

  const openCreate = (jour = 1, heure = "08:00") => {
    setEditing(null);
    const fin = `${String(parseInt(heure) + 1).padStart(2, "0")}:00`;
    setForm({ matiereId: "", personnelId: "", salleId: AUCUNE, jourSemaine: String(jour), heureDebut: heure, heureFin: fin });
    setOpen(true);
  };
  const openEdit = (c: Cours) => {
    setEditing(c);
    setForm({ matiereId: c.matiereId, personnelId: c.personnelId, salleId: c.salleId ?? AUCUNE, jourSemaine: String(c.jourSemaine), heureDebut: c.heureDebut, heureFin: c.heureFin });
    setOpen(true);
  };

  const submit = () => {
    if (!classeActive) { toast.error("Aucune classe sélectionnée"); return; }
    if (!form.matiereId || !form.personnelId) { toast.error("Matière et enseignant sont obligatoires"); return; }
    if (form.heureFin <= form.heureDebut) { toast.error("L'heure de fin doit être après l'heure de début"); return; }
    const payload = {
      classeId: classeActive, matiereId: form.matiereId, personnelId: form.personnelId,
      salleId: form.salleId === AUCUNE ? undefined : form.salleId,
      jourSemaine: parseInt(form.jourSemaine), heureDebut: form.heureDebut, heureFin: form.heureFin,
    };
    const opts = {
      onSuccess: () => { toast.success(editing ? "Cours modifié" : "Cours ajouté"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement du cours")),
    };
    if (editing) update.mutate({ id: editing.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  const del = () => {
    if (!editing) return;
    remove.mutate(editing.id, {
      onSuccess: () => { toast.success("Cours supprimé"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });
  };

  const coursA = (jour: number, heure: string) => cours.filter((c) => c.jourSemaine === jour && c.heureDebut.slice(0, 2) === heure.slice(0, 2));
  const totalHeures = cours.reduce((a, c) => a + (parseInt(c.heureFin) - parseInt(c.heureDebut)), 0);
  const saving = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Calendar className="h-8 w-8 text-primary" />Emplois du temps</h1>
          <p className="text-muted-foreground">Grille hebdomadaire par classe — les conflits sont vérifiés à l'enregistrement</p>
        </div>
        <div className="flex gap-2">
          <Select value={classeActive} onValueChange={setClasseId}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Classe" /></SelectTrigger>
            <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={() => openCreate()} disabled={!classeActive}><Plus className="h-4 w-4 mr-2" />Ajouter un cours</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cours planifiés</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{cours.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Volume hebdomadaire</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalHeures} h</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Enseignants</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{new Set(cours.map((c) => c.personnelId)).size}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger l'emploi du temps.</div>
          ) : !classeActive ? (
            <div className="text-center py-12 text-muted-foreground">Aucune classe disponible.</div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted w-20">Heure</th>
                  {JOURS.map((j) => <th key={j} className="border p-2 bg-muted">{j}</th>)}
                </tr>
              </thead>
              <tbody>
                {CRENEAUX.map((h) => (
                  <tr key={h}>
                    <td className="border p-2 font-mono text-xs text-muted-foreground">{h}</td>
                    {JOURS.map((_, i) => {
                      const items = coursA(i + 1, h);
                      return (
                        <td key={i} className="border p-1 align-top h-16 cursor-pointer hover:bg-muted/50" onClick={() => items.length === 0 && openCreate(i + 1, h)}>
                          {items.map((c) => (
                            <button key={c.id} onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="w-full text-left rounded bg-primary/10 border border-primary/30 p-1 mb-1">
                              <div className="font-medium">{c.matiere.nom}</div>
                              <div className="text-xs text-muted-foreground">{c.heureDebut}–{c.heureFin} · {c.personnel.nom}{c.salle ? ` · ${c.salle.nom}` : ""}</div>
                            </button>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le cours" : "Nouveau cours"}</DialogTitle>
            <DialogDescription>Le serveur refuse les créneaux où l'enseignant ou la salle est déjà occupé(e).</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Matière *</Label>
              <Select value={form.matiereId} onValueChange={(v) => setForm({ ...form, matiereId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>{matieres.map((m) => <SelectItem key={m.id} value={m.id}>{m.nom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Enseignant *</Label>
              <Select value={form.personnelId} onValueChange={(v) => setForm({ ...form, personnelId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>{enseignants.map((p) => <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jour</Label>
              <Select value={form.jourSemaine} onValueChange={(v) => setForm({ ...form, jourSemaine: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{JOURS.map((j, i) => <SelectItem key={j} value={String(i + 1)}>{j}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salle</Label>
              <Select value={form.salleId} onValueChange={(v) => setForm({ ...form, salleId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUCUNE}>Aucune</SelectItem>
                  {salles.map((s) => <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Début</Label><Input type="time" value={form.heureDebut} onChange={(e) => setForm({ ...form, heureDebut: e.target.value })} /></div>
            <div className="space-y-2"><Label>Fin</Label><Input type="time" value={form.heureFin} onChange={(e) => setForm({ ...form, heureFin: e.target.value })} /></div>
          </div>
          <DialogFooter className="gap-2">
            {editing && <Button variant="destructive" onClick={del} disabled={remove.isPending} className="mr-auto"><Trash2 className="h-4 w-4 mr-2" />Supprimer</Button>}
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
