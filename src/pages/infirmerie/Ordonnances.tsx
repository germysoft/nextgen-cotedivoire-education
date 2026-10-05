import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Pencil, Trash2, Printer, Loader2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import {
  errMsg, MedicamentPrescrit, nomEleve, Ordonnance, useConsultationsQuery, useCreateOrdonnance, useDeleteOrdonnance,
  useOrdonnancesQuery, useUpdateOrdonnance,
} from "@/hooks/api/useInfirmerie";

/**
 * Ordonnances — CRUD générique `/infirmerie/ordonnances` (modèle `Ordonnance`, lié à `Consultation`).
 * Le filtre par consultation passe par le filtre d'égalité serveur `?consultationId=`.
 * L'élève est retrouvé via la consultation (déjà chargée avec `useConsultationsQuery`).
 * Retirés du mock (absents du schéma) : médecin prescripteur, statut délivrée/en cours, renouvellement,
 * quantité délivrée, signature.
 */

const ALL = "all";
const ligneVide: MedicamentPrescrit = { nom: "", posologie: "", duree: "" };

export default function Ordonnances() {
  const [consultationFiltre, setConsultationFiltre] = useState(ALL);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState("");
  const [lignes, setLignes] = useState<MedicamentPrescrit[]>([ligneVide]);

  const { data: ordonnances = [], isLoading, isError } = useOrdonnancesQuery(
    consultationFiltre === ALL ? {} : { consultationId: consultationFiltre },
  );
  const { data: consultations = [] } = useConsultationsQuery();
  const create = useCreateOrdonnance();
  const update = useUpdateOrdonnance();
  const remove = useDeleteOrdonnance();

  const consult = (id: string) => consultations.find((c) => c.id === id);
  const libelle = (id: string) => {
    const c = consult(id);
    return c ? `${nomEleve(c.eleve)} — ${c.motif} (${new Date(c.date).toLocaleDateString("fr-FR")})` : "Consultation";
  };
  const sorted = [...ordonnances].sort((a, b) => b.dateEmission.localeCompare(a.dateEmission));

  const openNew = () => { setEditId(null); setConsultationId(consultationFiltre === ALL ? "" : consultationFiltre); setLignes([ligneVide]); setOpen(true); };
  const openEdit = (o: Ordonnance) => { setEditId(o.id); setConsultationId(o.consultationId); setLignes(o.medicaments.length ? o.medicaments : [ligneVide]); setOpen(true); };

  const save = () => {
    const meds = lignes.filter((l) => l.nom.trim()).map((l) => ({ nom: l.nom.trim(), posologie: l.posologie.trim(), duree: l.duree.trim() }));
    if (!consultationId) { toast.error("Choisissez une consultation"); return; }
    if (meds.length === 0) { toast.error("Ajoutez au moins un médicament"); return; }
    const cb = {
      onSuccess: () => { toast.success(editId ? "Ordonnance modifiée" : "Ordonnance créée"); setOpen(false); },
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de l'enregistrement")),
    };
    if (editId) update.mutate({ id: editId, consultationId, medicaments: meds }, cb);
    else create.mutate({ consultationId, medicaments: meds }, cb);
  };

  const del = (o: Ordonnance) => {
    if (!confirm("Supprimer cette ordonnance ?")) return;
    remove.mutate(o.id, {
      onSuccess: () => toast.success("Ordonnance supprimée"),
      onError: (e: any) => toast.error(errMsg(e, "Erreur lors de la suppression")),
    });
  };

  const imprimer = (o: Ordonnance) => {
    const c = consult(o.consultationId);
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("ORDONNANCE", 105, 20, { align: "center" });
    doc.setFontSize(11);
    doc.text(`Élève : ${nomEleve(c?.eleve)}`, 20, 35);
    doc.text(`Date : ${new Date(o.dateEmission).toLocaleDateString("fr-FR")}`, 20, 42);
    if (c) doc.text(`Motif : ${c.motif}`, 20, 49);
    let y = 64;
    o.medicaments.forEach((m, i) => {
      doc.text(`${i + 1}. ${m.nom}`, 20, y);
      doc.text(`   ${m.posologie}${m.duree ? ` — ${m.duree}` : ""}`, 20, y + 6);
      y += 14;
    });
    doc.save(`ordonnance-${o.id.slice(0, 8)}.pdf`);
  };

  const setLigne = (i: number, k: keyof MedicamentPrescrit, v: string) =>
    setLignes(lignes.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  const pending = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordonnances</h1>
          <p className="text-muted-foreground">Prescriptions rattachées aux consultations</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Nouvelle ordonnance</Button>
      </div>

      <Card>
        <CardHeader>
          <Select value={consultationFiltre} onValueChange={setConsultationFiltre}>
            <SelectTrigger className="max-w-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les consultations</SelectItem>
              {consultations.map((c) => <SelectItem key={c.id} value={c.id}>{libelle(c.id)}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-6"><AlertCircle className="h-4 w-4" />Impossible de charger les ordonnances.</div>
          ) : sorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aucune ordonnance.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Consultation</TableHead><TableHead>Médicaments</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {sorted.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{new Date(o.dateEmission).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell><FileText className="inline h-4 w-4 mr-1 text-primary" />{libelle(o.consultationId)}</TableCell>
                    <TableCell>{o.medicaments.map((m) => m.nom).join(", ")}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => imprimer(o)}><Printer className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(o)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => del(o)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editId ? "Modifier l'ordonnance" : "Nouvelle ordonnance"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Consultation *</Label>
              <Select value={consultationId} onValueChange={setConsultationId}>
                <SelectTrigger><SelectValue placeholder="Choisir une consultation" /></SelectTrigger>
                <SelectContent>{consultations.map((c) => <SelectItem key={c.id} value={c.id}>{libelle(c.id)}</SelectItem>)}</SelectContent>
              </Select></div>
            <Label>Médicaments</Label>
            {lignes.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_120px_auto] gap-2">
                <Input placeholder="Nom" value={l.nom} onChange={(e) => setLigne(i, "nom", e.target.value)} />
                <Input placeholder="Posologie" value={l.posologie} onChange={(e) => setLigne(i, "posologie", e.target.value)} />
                <Input placeholder="Durée" value={l.duree} onChange={(e) => setLigne(i, "duree", e.target.value)} />
                <Button variant="ghost" size="icon" onClick={() => setLignes(lignes.length > 1 ? lignes.filter((_, j) => j !== i) : [ligneVide])}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setLignes([...lignes, ligneVide])}><Plus className="h-4 w-4 mr-1" />Ajouter un médicament</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={pending}>{pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
