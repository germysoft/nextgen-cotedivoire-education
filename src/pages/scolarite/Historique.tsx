import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Inscription, useDeleteInscription, useInscriptionsQuery, useInscrireEleve, useUpdateInscription } from "@/hooks/api/useScolarite";
import { useElevesQuery } from "@/hooks/api/useEleves";
import { useAnneeScolaireActive, useClassesQuery } from "@/hooks/api/useClasses";

/**
 * Historique scolaire — parcours d'un élève reconstruit à partir de ses inscriptions réelles
 * (CRUD générique /api/scolarite/inscriptions). L'inscription / réinscription passe par
 * l'endpoint dédié POST /api/eleves/:id/inscrire (upsert sur l'année active).
 * Le changement de statut (Redoublant, Transféré…) utilise le PUT générique.
 * Retirés du mock : historique des bulletins et moyennes annuelles (relèvent de la page Notes),
 * établissement d'origine, décisions de passage, rang.
 */

const STATUTS = ["Inscrit", "Redoublant", "Transféré", "Exclu", "Abandonné"];
const errMsg = (e: any, f: string) => e?.response?.data?.error ?? f;

export default function Historique() {
  const [eleveId, setEleveId] = useState("");
  const [filtreEleve, setFiltreEleve] = useState("");
  const [open, setOpen] = useState(false);
  const [classeId, setClasseId] = useState("");

  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const { data: inscriptions = [], isLoading, isError } = useInscriptionsQuery();
  const { data: classes = [] } = useClassesQuery();
  const { data: anneeActive } = useAnneeScolaireActive();
  const inscrire = useInscrireEleve();
  const update = useUpdateInscription();
  const remove = useDeleteInscription();

  const elevesFiltres = eleves.filter((e) => `${e.nom} ${e.prenom} ${e.matricule}`.toLowerCase().includes(filtreEleve.toLowerCase()));
  const eleve = eleves.find((e) => e.id === eleveId);
  const parcours = inscriptions.filter((i) => i.eleveId === eleveId).sort((a, b) => b.dateInscription.localeCompare(a.dateInscription));
  const classeNom = (id: string) => classes.find((c) => c.id === id)?.nom ?? "—";
  const classesAnneeActive = classes.filter((c) => !anneeActive || c.anneeScolaireId === anneeActive.id);

  const submit = () => {
    if (!eleveId || !classeId) { toast.error("Choisissez une classe"); return; }
    if (!anneeActive) { toast.error("Aucune année scolaire active"); return; }
    inscrire.mutate(
      { eleveId, classeId, anneeScolaireId: anneeActive.id },
      {
        onSuccess: () => { toast.success("Inscription enregistrée pour l'année active"); setOpen(false); setClasseId(""); },
        onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'inscription")),
      },
    );
  };

  const changerStatut = (i: Inscription, statut: string) =>
    update.mutate(
      { id: i.id, statut, ...(statut === "Redoublant" && i.statut !== "Redoublant" ? { numeroRedoublement: i.numeroRedoublement + 1 } : {}) },
      {
        onSuccess: () => toast.success(`Statut : ${statut}`),
        onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la mise à jour")),
      },
    );

  const del = (i: Inscription) =>
    remove.mutate(i.id, {
      onSuccess: () => toast.success("Inscription supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><History className="h-8 w-8 text-primary" />Historique Scolaire</h1>
          <p className="text-muted-foreground">Parcours d'inscription d'un élève, année par année</p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={!eleveId}><Plus className="h-4 w-4 mr-2" />Inscrire / réinscrire</Button>
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row gap-3">
          <Input className="md:w-64" placeholder="Filtrer les élèves..." value={filtreEleve} onChange={(e) => setFiltreEleve(e.target.value)} />
          <Select value={eleveId} onValueChange={setEleveId}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
            <SelectContent>{elevesFiltres.map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      {eleve && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Élève</CardTitle></CardHeader><CardContent><div className="text-lg font-bold">{eleve.nom} {eleve.prenom}</div><div className="text-sm text-muted-foreground">Matricule : {eleve.matricule}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Années d'inscription</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{parcours.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Redoublements</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Math.max(0, ...parcours.map((p) => p.numeroRedoublement))}</div></CardContent></Card>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>Parcours année par année</CardTitle></CardHeader>
        <CardContent>
          {!eleveId ? (
            <div className="text-center py-12 text-muted-foreground">Sélectionnez un élève pour afficher son parcours.</div>
          ) : isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les inscriptions.</div>
          ) : parcours.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune inscription pour cet élève.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inscrit le</TableHead><TableHead>Classe</TableHead><TableHead>Année</TableHead>
                  <TableHead>Statut</TableHead><TableHead>Redoublement</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcours.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>{new Date(i.dateInscription).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{classeNom(i.classeId)}</TableCell>
                    <TableCell>{anneeActive?.id === i.anneeScolaireId ? <Badge>{anneeActive.libelle} (active)</Badge> : "Année antérieure"}</TableCell>
                    <TableCell>
                      <Select value={i.statut} onValueChange={(s) => changerStatut(i, s)}>
                        <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{i.numeroRedoublement || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => del(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>Inscrire / réinscrire</DialogTitle>
            <DialogDescription>
              Inscription pour l'année {anneeActive?.libelle ?? "active"}. Si l'élève est déjà inscrit cette année, sa classe est mise à jour.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Classe *</Label>
            <Select value={classeId} onValueChange={setClasseId}>
              <SelectTrigger><SelectValue placeholder="Choisir une classe" /></SelectTrigger>
              <SelectContent>{classesAnneeActive.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={submit} disabled={inscrire.isPending}>{inscrire.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Inscrire</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
