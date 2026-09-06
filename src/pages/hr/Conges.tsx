import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar, Search, Plus, CheckCircle, XCircle, Clock,
  User, AlertTriangle, FileText, Eye, Loader2,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Conge, useCongesQuery, useCreateConge, useUpdateCongeStatut } from "@/hooks/api/useConges";
import { usePersonnelQuery } from "@/hooks/api/usePersonnel";

const typesConge = [
  "Congé annuel", "Congé Maladie", "Congé Maternité", "Congé Paternité",
  "Congé Sans Solde", "Congé Exceptionnel", "Récupération", "Formation",
];

const emptyForm = { personnelId: "", type: "", dateDebut: "", dateFin: "", motif: "", contact: "", remplacantId: "" };

export default function Conges() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [viewCongeOpen, setViewCongeOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedConge, setSelectedConge] = useState<Conge | null>(null);
  const [requestForm, setRequestForm] = useState(emptyForm);

  const { data: conges = [], isLoading, isError } = useCongesQuery();
  const { data: personnelData } = usePersonnelQuery({ pageSize: 500 });
  const personnel = personnelData?.items ?? [];
  const createConge = useCreateConge();
  const updateStatut = useUpdateCongeStatut();

  const stats = {
    valides: conges.filter((c) => c.statut === "Validé").length,
    enAttente: conges.filter((c) => c.statut === "En attente").length,
    refuses: conges.filter((c) => c.statut === "Refusé").length,
  };

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    return Math.ceil(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const nomComplet = (p: { nom: string; prenom: string }) => `${p.nom} ${p.prenom}`;

  const filteredConges = conges.filter((c) =>
    nomComplet(c.personnel).toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.personnel.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => setRequestForm(emptyForm);

  const handleSubmitRequest = () => {
    if (!requestForm.personnelId || !requestForm.type || !requestForm.dateDebut || !requestForm.dateFin) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    createConge.mutate(
      {
        personnelId: requestForm.personnelId,
        type: requestForm.type,
        dateDebut: requestForm.dateDebut,
        dateFin: requestForm.dateFin,
        motif: requestForm.motif || undefined,
        contact: requestForm.contact || undefined,
        remplacantId: requestForm.remplacantId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Demande de congé créée");
          setNewRequestOpen(false);
          resetForm();
        },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de la création."),
      }
    );
  };

  const handleApprove = (conge: Conge) => {
    updateStatut.mutate(
      { id: conge.id, statut: "Validé" },
      {
        onSuccess: () => toast.success(`Congé validé pour ${nomComplet(conge.personnel)}`),
        onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de la validation."),
      }
    );
  };

  const openRejectDialog = (conge: Conge) => {
    setSelectedConge(conge);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedConge) return;
    updateStatut.mutate(
      { id: selectedConge.id, statut: "Refusé" },
      {
        onSuccess: () => {
          toast.error(`Congé refusé pour ${nomComplet(selectedConge.personnel)}`);
          setRejectDialogOpen(false);
          setSelectedConge(null);
        },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de l'opération."),
      }
    );
  };

  const handleViewConge = (conge: Conge) => {
    setSelectedConge(conge);
    setViewCongeOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Congés & Absences</h1>
          <p className="text-muted-foreground">Gestion des demandes et suivi des présences</p>
        </div>
        <Button onClick={() => setNewRequestOpen(true)}><Plus className="mr-2 h-4 w-4" />Nouvelle Demande</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div><p className="text-xs text-muted-foreground">À traiter</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.valides}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refusés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{stats.refuses}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="absences">Absences quotidiennes</TabsTrigger>
          <TabsTrigger value="soldes">Soldes de Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="conges">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Demandes de Congés</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-10 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Chargement…</div>}
              {isError && <div className="py-16 text-center text-destructive">Impossible de contacter l'API.</div>}
              {!isLoading && !isError && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Jours</TableHead>
                      <TableHead>Remplaçant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConges.map((conge) => (
                      <TableRow key={conge.id}>
                        <TableCell><div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{nomComplet(conge.personnel)}</span></div></TableCell>
                        <TableCell><Badge variant="outline">{conge.type}</Badge></TableCell>
                        <TableCell><div className="flex flex-col gap-1 text-sm"><span>Du {formatDate(conge.dateDebut)}</span><span className="text-muted-foreground">Au {formatDate(conge.dateFin)}</span></div></TableCell>
                        <TableCell><Badge>{conge.nombreJours} jours</Badge></TableCell>
                        <TableCell>{conge.remplacant ? <span className="text-sm">{nomComplet(conge.remplacant)}</span> : <Badge variant="secondary">Non assigné</Badge>}</TableCell>
                        <TableCell>
                          {conge.statut === "Validé" && <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Validé</Badge>}
                          {conge.statut === "En attente" && <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>}
                          {conge.statut === "Refusé" && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Refusé</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewConge(conge)}><Eye className="h-4 w-4" /></Button>
                            {conge.statut === "En attente" && (
                              <>
                                <Button size="sm" variant="default" onClick={() => handleApprove(conge)}><CheckCircle className="h-4 w-4" /></Button>
                                <Button size="sm" variant="destructive" onClick={() => openRejectDialog(conge)}><XCircle className="h-4 w-4" /></Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredConges.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune demande trouvée</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="absences">
          <Card>
            <CardContent className="py-12 text-center space-y-2">
              <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground max-w-md mx-auto">
                Ce module (absences/retards quotidiens distincts des congés) n'est pas encore branché sur l'API :
                le schéma actuel (table <code>Pointage</code>) ne modélise pas de justificatif ni de motif détaillé
                pour ce type d'évènement. Le pointage de base (présent/absent/retard) est disponible via
                <code> POST /api/personnel/pointage</code> — voir MIGRATION.md.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soldes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Soldes de Congés par Employé</CardTitle>
                  <CardDescription>Solde actuel de jours de congés annuels restants</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personnel.map((p) => (
                  <Card key={p.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{p.nom} {p.prenom}</span>
                          <p className="text-sm text-muted-foreground">{p.poste}</p>
                        </div>
                        <Badge variant={p.soldeCongesAnnuels >= 15 ? "default" : p.soldeCongesAnnuels >= 0 ? "secondary" : "destructive"}>
                          Solde: {p.soldeCongesAnnuels} jours
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Demande de Congé</DialogTitle>
            <DialogDescription>Créer une nouvelle demande de congé pour un membre du personnel</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employé *</Label>
                <Select value={requestForm.personnelId} onValueChange={(v) => setRequestForm((p) => ({ ...p, personnelId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un employé..." /></SelectTrigger>
                  <SelectContent>{personnel.map((p) => <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom} - {p.poste}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type de congé *</Label>
                <Select value={requestForm.type} onValueChange={(v) => setRequestForm((p) => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner le type..." /></SelectTrigger>
                  <SelectContent>{typesConge.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date de début *</Label><Input type="date" value={requestForm.dateDebut} onChange={(e) => setRequestForm((p) => ({ ...p, dateDebut: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Date de fin *</Label><Input type="date" value={requestForm.dateFin} onChange={(e) => setRequestForm((p) => ({ ...p, dateFin: e.target.value }))} /></div>
            </div>
            {requestForm.dateDebut && requestForm.dateFin && (
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium">Durée calculée:</span>
                <Badge variant="default">{calculateDays(requestForm.dateDebut, requestForm.dateFin)} jours</Badge>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Remplaçant (optionnel)</Label>
                <Select value={requestForm.remplacantId} onValueChange={(v) => setRequestForm((p) => ({ ...p, remplacantId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un remplaçant..." /></SelectTrigger>
                  <SelectContent>
                    {personnel.filter((p) => p.id !== requestForm.personnelId).map((p) => <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact pendant le congé</Label>
                <Input placeholder="+225 XX XX XX XX" value={requestForm.contact} onChange={(e) => setRequestForm((p) => ({ ...p, contact: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Motif de la demande</Label>
              <Textarea placeholder="Décrivez la raison de votre demande de congé..." value={requestForm.motif} onChange={(e) => setRequestForm((p) => ({ ...p, motif: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRequestOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmitRequest} disabled={createConge.isPending}>
              {createConge.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="mr-2 h-4 w-4" />Soumettre la Demande</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewCongeOpen} onOpenChange={setViewCongeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Détails du Congé</DialogTitle></DialogHeader>
          {selectedConge && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <User className="h-10 w-10 text-muted-foreground" />
                <div><p className="font-semibold">{nomComplet(selectedConge.personnel)}</p><p className="text-sm text-muted-foreground">{selectedConge.personnel.poste}</p></div>
                <div className="ml-auto">
                  {selectedConge.statut === "Validé" && <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Validé</Badge>}
                  {selectedConge.statut === "En attente" && <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>}
                  {selectedConge.statut === "Refusé" && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Refusé</Badge>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><p className="text-sm text-muted-foreground">Type de congé</p><Badge variant="outline">{selectedConge.type}</Badge></div>
                <div className="space-y-1"><p className="text-sm text-muted-foreground">Durée</p><Badge>{selectedConge.nombreJours} jours</Badge></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><p className="text-sm text-muted-foreground">Date de début</p><p className="font-medium">{formatDate(selectedConge.dateDebut)}</p></div>
                <div className="space-y-1"><p className="text-sm text-muted-foreground">Date de fin</p><p className="font-medium">{formatDate(selectedConge.dateFin)}</p></div>
              </div>
              <div className="space-y-1"><p className="text-sm text-muted-foreground">Motif</p><p className="font-medium">{selectedConge.motif || "Non spécifié"}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><p className="text-sm text-muted-foreground">Remplaçant</p><p className="font-medium">{selectedConge.remplacant ? nomComplet(selectedConge.remplacant) : "Non assigné"}</p></div>
                <div className="space-y-1"><p className="text-sm text-muted-foreground">Contact</p><p className="font-medium">{selectedConge.contact || "Non renseigné"}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCongeOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser la Demande</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir refuser cette demande de congé ?</DialogDescription>
          </DialogHeader>
          {selectedConge && (
            <div className="py-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{nomComplet(selectedConge.personnel)}</p>
                <p className="text-sm text-muted-foreground">{selectedConge.type} - {selectedConge.nombreJours} jours</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleConfirmReject} disabled={updateStatut.isPending}>
              {updateStatut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><XCircle className="mr-2 h-4 w-4" />Confirmer le Refus</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
