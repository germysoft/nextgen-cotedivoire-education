import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Edit, Loader2, Plus, Search, Trash2, UserPlus, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Affectation, EvaluationRH, CritereEvaluation,
  useAffectationsQuery, useCreateAffectation, useUpdateAffectation, useDeleteAffectation,
  useMatieresQuery, useEvaluationsRHQuery, useCreateEvaluationRH,
} from "@/hooks/api/useRH";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";
import { useClassesQuery } from "@/hooks/api/useClasses";

/**
 * Page branchée sur l'API réelle :
 * - onglet Affectations → /api/pedagogie/affectations
 * - onglet Évaluations  → /api/personnel/evaluations
 *
 * Simplifications assumées :
 * - L'onglet « Promotions » du mock a été RETIRÉ : il n'existe aucun modèle
 *   `Promotion` dans backend/prisma/schema.prisma (l'évolution de carrière
 *   n'est aujourd'hui tracée que par la succession des contrats). Le
 *   réintroduire supposerait d'abord de concevoir ce modèle côté backend.
 * - Une affectation réelle relie un membre du personnel à un couple
 *   classe + matière avec une charge horaire hebdomadaire ; les champs du mock
 *   `dateDebut` / `dateFin` / `statut` / `anciennete` n'existent pas dans le
 *   modèle `Affectation` et ont donc été retirés.
 * - Les critères d'évaluation sont stockés en JSON (`Evaluation.criteres`) :
 *   quatre critères pondérés à parts égales sont proposés, la note globale
 *   étant calculée côté backend.
 */

const CRITERES_DEFAUT: CritereEvaluation[] = [
  { categorie: "Pédagogie", critere: "Compétences pédagogiques", note: 15, poids: 25 },
  { categorie: "Relationnel", critere: "Compétences relationnelles", note: 15, poids: 25 },
  { categorie: "Assiduité", critere: "Ponctualité et assiduité", note: 15, poids: 25 },
  { categorie: "Implication", critere: "Engagement dans la vie de l'établissement", note: 15, poids: 25 },
];

const apiError = (err: any, fallback: string) =>
  toast.error(err?.response?.data?.error ?? fallback);

export default function AffectationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [affectationDialogOpen, setAffectationDialogOpen] = useState(false);
  const [editingAffectationId, setEditingAffectationId] = useState<string | null>(null);
  const [affForm, setAffForm] = useState({
    personnelId: "", classeId: "", matiereId: "", chargeHoraireHebdo: "4", coefficient: "",
  });

  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [evalDetail, setEvalDetail] = useState<EvaluationRH | null>(null);
  const [evalForm, setEvalForm] = useState({
    personnelId: "", evaluateurId: "", periode: "", typeEvaluation: "Annuelle",
    dateEvaluation: new Date().toISOString().split("T")[0],
    appreciationGenerale: "",
    criteres: CRITERES_DEFAUT,
  });

  const affectationsQuery = useAffectationsQuery();
  const evaluationsQuery = useEvaluationsRHQuery();
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500 });
  const { data: classes = [] } = useClassesQuery();
  const { data: matieres = [] } = useMatieresQuery();

  const personnel = personnelData?.items ?? [];
  const affectations = affectationsQuery.data ?? [];
  const evaluations = evaluationsQuery.data ?? [];

  const createAffectation = useCreateAffectation();
  const updateAffectation = useUpdateAffectation();
  const deleteAffectation = useDeleteAffectation();
  const createEvaluation = useCreateEvaluationRH();

  const filteredAffectations = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return affectations.filter((a) =>
      `${a.personnel?.nom ?? ""} ${a.personnel?.prenom ?? ""} ${a.matiere?.nom ?? ""} ${a.classe?.nom ?? ""}`
        .toLowerCase().includes(q)
    );
  }, [affectations, searchTerm]);

  const avgNote = useMemo(() => {
    const notes = evaluations.map((e) => e.noteGlobale).filter((n): n is number => typeof n === "number");
    if (!notes.length) return "-";
    return (notes.reduce((s, n) => s + n, 0) / notes.length).toFixed(1);
  }, [evaluations]);

  const chargeTotale = affectations.reduce((s, a) => s + (a.chargeHoraireHebdo ?? 0), 0);

  const openCreateAffectation = () => {
    setEditingAffectationId(null);
    setAffForm({ personnelId: "", classeId: "", matiereId: "", chargeHoraireHebdo: "4", coefficient: "" });
    setAffectationDialogOpen(true);
  };

  const openEditAffectation = (a: Affectation) => {
    setEditingAffectationId(a.id);
    setAffForm({
      personnelId: a.personnelId,
      classeId: a.classeId,
      matiereId: a.matiereId,
      chargeHoraireHebdo: String(a.chargeHoraireHebdo ?? 4),
      coefficient: a.coefficient != null ? String(a.coefficient) : "",
    });
    setAffectationDialogOpen(true);
  };

  const submitAffectation = () => {
    if (!affForm.personnelId || !affForm.classeId || !affForm.matiereId) {
      toast.error("Enseignant, classe et matière sont obligatoires");
      return;
    }
    const payload = {
      personnelId: affForm.personnelId,
      classeId: affForm.classeId,
      matiereId: affForm.matiereId,
      chargeHoraireHebdo: Number(affForm.chargeHoraireHebdo) || 0,
      ...(affForm.coefficient ? { coefficient: Number(affForm.coefficient) } : {}),
    };
    if (editingAffectationId) {
      updateAffectation.mutate({ id: editingAffectationId, ...payload }, {
        onSuccess: () => { toast.success("Affectation mise à jour"); setAffectationDialogOpen(false); },
        onError: (err) => apiError(err, "Impossible de mettre à jour l'affectation"),
      });
    } else {
      createAffectation.mutate(payload, {
        onSuccess: () => { toast.success("Affectation créée"); setAffectationDialogOpen(false); },
        onError: (err) => apiError(err, "Impossible de créer l'affectation"),
      });
    }
  };

  const removeAffectation = (a: Affectation) => {
    deleteAffectation.mutate(a.id, {
      onSuccess: () => toast.success("Affectation supprimée"),
      onError: (err) => apiError(err, "Impossible de supprimer l'affectation"),
    });
  };

  const submitEvaluation = () => {
    if (!evalForm.personnelId || !evalForm.evaluateurId || !evalForm.periode) {
      toast.error("Employé, évaluateur et période sont obligatoires");
      return;
    }
    createEvaluation.mutate({
      personnelId: evalForm.personnelId,
      evaluateurId: evalForm.evaluateurId,
      periode: evalForm.periode,
      dateEvaluation: evalForm.dateEvaluation,
      typeEvaluation: evalForm.typeEvaluation as EvaluationRH["typeEvaluation"],
      criteres: evalForm.criteres,
      appreciationGenerale: evalForm.appreciationGenerale || undefined,
    }, {
      onSuccess: () => { toast.success("Évaluation enregistrée"); setEvalDialogOpen(false); },
      onError: (err) => apiError(err, "Impossible d'enregistrer l'évaluation"),
    });
  };

  const setCritereNote = (index: number, note: number) => {
    setEvalForm((f) => ({
      ...f,
      criteres: f.criteres.map((c, i) => (i === index ? { ...c, note } : c)),
    }));
  };

  if (affectationsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Chargement des affectations...
      </div>
    );
  }

  if (affectationsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <p className="font-medium">Impossible de charger les affectations</p>
        <p className="text-sm text-muted-foreground">Vérifiez votre connexion, puis rechargez la page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affectations &amp; Évaluations</h1>
          <p className="text-muted-foreground mt-2">
            Répartition enseignant / classe / matière et évaluations du personnel
          </p>
        </div>
        <Button onClick={openCreateAffectation}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Affectation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affectations</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affectations.length}</div>
            <p className="text-xs text-muted-foreground">Couples classe / matière</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charge Hebdo Totale</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chargeTotale} h</div>
            <p className="text-xs text-muted-foreground">Toutes affectations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
            <p className="text-xs text-muted-foreground">Enregistrées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNote}{avgNote !== "-" && "/20"}</div>
            <p className="text-xs text-muted-foreground">Évaluation personnel</p>
          </CardContent>
        </Card>
      </div>

      {/* L'onglet "Promotions" a été retiré : aucun modèle Promotion côté backend. */}
      <Tabs defaultValue="affectations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affectations">Affectations</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="affectations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Affectations</CardTitle>
                  <CardDescription>Enseignant, matière, classe et charge horaire</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Charge hebdo</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffectations.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">
                        {a.personnel ? `${a.personnel.nom} ${a.personnel.prenom}` : "-"}
                      </TableCell>
                      <TableCell>{a.matiere?.nom ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{a.classe?.nom ?? "-"}</Badge>
                      </TableCell>
                      <TableCell>{a.chargeHoraireHebdo ?? 0} h</TableCell>
                      <TableCell>{a.coefficient ?? "-"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditAffectation(a)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeAffectation(a)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAffectations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Aucune affectation enregistrée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Évaluations du Personnel</CardTitle>
                  <CardDescription>Performances et évaluations périodiques</CardDescription>
                </div>
                <Button onClick={() => setEvalDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Évaluation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {evaluationsQuery.isLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement...
                </div>
              ) : evaluationsQuery.isError ? (
                <p className="text-sm text-destructive py-6 text-center">
                  Impossible de charger les évaluations.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">
                          {e.personnel ? `${e.personnel.nom} ${e.personnel.prenom}` : "-"}
                        </TableCell>
                        <TableCell>{e.typeEvaluation}</TableCell>
                        <TableCell>{e.periode}</TableCell>
                        <TableCell>
                          {e.noteGlobale != null ? (
                            <Badge variant={e.noteGlobale >= 16 ? "default" : e.noteGlobale >= 12 ? "secondary" : "destructive"}>
                              {e.noteGlobale}/20
                            </Badge>
                          ) : "-"}
                        </TableCell>
                        <TableCell>{new Date(e.dateEvaluation).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell><Badge variant="outline">{e.statut}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setEvalDetail(e)}>
                            Voir Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {evaluations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          Aucune évaluation enregistrée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog affectation */}
      <Dialog open={affectationDialogOpen} onOpenChange={setAffectationDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingAffectationId ? "Modifier l'Affectation" : "Nouvelle Affectation"}</DialogTitle>
            <DialogDescription>Enseignant, matière, classe et charge horaire hebdomadaire</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Enseignant</Label>
              <Select value={affForm.personnelId} onValueChange={(v) => setAffForm({ ...affForm, personnelId: v })}>
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
                <Label>Matière</Label>
                <Select value={affForm.matiereId} onValueChange={(v) => setAffForm({ ...affForm, matiereId: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {matieres.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Classe</Label>
                <Select value={affForm.classeId} onValueChange={(v) => setAffForm({ ...affForm, classeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Charge horaire hebdo (h)</Label>
                <Input
                  type="number"
                  value={affForm.chargeHoraireHebdo}
                  onChange={(e) => setAffForm({ ...affForm, chargeHoraireHebdo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Coefficient (optionnel)</Label>
                <Input
                  type="number"
                  value={affForm.coefficient}
                  onChange={(e) => setAffForm({ ...affForm, coefficient: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAffectationDialogOpen(false)}>Annuler</Button>
            <Button onClick={submitAffectation} disabled={createAffectation.isPending || updateAffectation.isPending}>
              {(createAffectation.isPending || updateAffectation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingAffectationId ? "Enregistrer" : "Créer l'Affectation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog nouvelle évaluation */}
      <Dialog open={evalDialogOpen} onOpenChange={setEvalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Évaluation</DialogTitle>
            <DialogDescription>Quatre critères pondérés à parts égales ; la note globale est calculée automatiquement.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employé évalué</Label>
                <Select value={evalForm.personnelId} onValueChange={(v) => setEvalForm({ ...evalForm, personnelId: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {personnel.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Évaluateur</Label>
                <Select value={evalForm.evaluateurId} onValueChange={(v) => setEvalForm({ ...evalForm, evaluateurId: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {personnel.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={evalForm.typeEvaluation} onValueChange={(v) => setEvalForm({ ...evalForm, typeEvaluation: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Annuelle", "Semestrielle", "Trimestrielle", "Probatoire"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Période</Label>
                <Input
                  placeholder="2025-2026"
                  value={evalForm.periode}
                  onChange={(e) => setEvalForm({ ...evalForm, periode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={evalForm.dateEvaluation}
                  onChange={(e) => setEvalForm({ ...evalForm, dateEvaluation: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              {evalForm.criteres.map((c, i) => (
                <div key={c.critere} className="flex items-center gap-3">
                  <Label className="flex-1">{c.critere}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    className="w-24"
                    value={c.note}
                    onChange={(e) => setCritereNote(i, Number(e.target.value))}
                  />
                  <span className="text-xs text-muted-foreground w-16">poids {c.poids}%</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Appréciation générale</Label>
              <Textarea
                value={evalForm.appreciationGenerale}
                onChange={(e) => setEvalForm({ ...evalForm, appreciationGenerale: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvalDialogOpen(false)}>Annuler</Button>
            <Button onClick={submitEvaluation} disabled={createEvaluation.isPending}>
              {createEvaluation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog détail évaluation */}
      <Dialog open={!!evalDetail} onOpenChange={(o) => !o && setEvalDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail de l'évaluation</DialogTitle>
            <DialogDescription>
              {evalDetail?.personnel ? `${evalDetail.personnel.nom} ${evalDetail.personnel.prenom}` : ""}
            </DialogDescription>
          </DialogHeader>
          {evalDetail && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Période</span><span>{evalDetail.periode}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{evalDetail.typeEvaluation}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Note globale</span><span>{evalDetail.noteGlobale ?? "-"}/20</span></div>
              <div className="space-y-1 pt-2">
                {(evalDetail.criteres ?? []).map((c) => (
                  <div key={c.critere} className="flex justify-between">
                    <span className="text-muted-foreground">{c.critere}</span>
                    <span>{c.note}/20 ({c.poids}%)</span>
                  </div>
                ))}
              </div>
              {evalDetail.appreciationGenerale && (
                <p className="pt-2 text-muted-foreground">{evalDetail.appreciationGenerale}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvalDetail(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
