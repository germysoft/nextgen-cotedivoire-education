import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  BookOpen, Search, Plus, AlertCircle, Calendar, User,
  CheckCircle, Clock, TrendingUp, Eye, Loader2,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Emprunt, useCreateEmprunt, useEmpruntsQuery, useLivresQuery, useRetournerEmprunt } from "@/hooks/api/useBibliotheque";
import { useElevesQuery } from "@/hooks/api/useEleves";

export default function Emprunts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");

  const [isNewEmpruntOpen, setIsNewEmpruntOpen] = useState(false);
  const [isRetourDialogOpen, setIsRetourDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEmprunt, setSelectedEmprunt] = useState<Emprunt | null>(null);

  const [newEmprunt, setNewEmprunt] = useState({ eleveId: "", livreId: "", dureeJours: "14" });

  const { data: emprunts = [], isLoading, isError } = useEmpruntsQuery();
  const { data: livres = [] } = useLivresQuery();
  const { data: elevesData } = useElevesQuery({ pageSize: 500 });
  const eleves = elevesData?.items ?? [];
  const createEmprunt = useCreateEmprunt();
  const retournerEmprunt = useRetournerEmprunt();

  const livresDisponibles = livres.filter((l) => l.exemplairesDisponibles > 0);

  const classeDe = (emprunt: Emprunt) => emprunt.eleve?.inscriptions?.[0]?.classe?.nom ?? "—";
  const nomEmprunteur = (emprunt: Emprunt) => (emprunt.eleve ? `${emprunt.eleve.nom} ${emprunt.eleve.prenom}` : "—");
  const joursRetard = (emprunt: Emprunt) =>
    emprunt.statut === "En cours" || emprunt.statut === "En retard"
      ? Math.max(0, Math.ceil((Date.now() - new Date(emprunt.dateRetourPrevue).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  const filteredEmprunts = emprunts.filter((e) => {
    const matchSearch =
      e.livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomEmprunteur(e).toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut =
      filterStatut === "tous" ||
      (filterStatut === "encours" && e.statut === "En cours") ||
      (filterStatut === "retard" && e.statut === "En retard") ||
      (filterStatut === "retourne" && e.statut === "Retourné");
    return matchSearch && matchStatut;
  });

  const stats = {
    enCours: emprunts.filter((e) => e.statut === "En cours").length,
    enRetard: emprunts.filter((e) => e.statut === "En retard").length,
    retardImportant: emprunts.filter((e) => e.statut === "En retard" && joursRetard(e) > 7).length,
    retournes: emprunts.filter((e) => e.statut === "Retourné").length,
  };

  // Retours de la semaine écoulée + taux de retour "à temps" (sans pénalité), calculés à partir de vraies données.
  const uneSemaine = 1000 * 60 * 60 * 24 * 7;
  const retoursSemaine = emprunts.filter(
    (e) => e.dateRetourEffective && Date.now() - new Date(e.dateRetourEffective).getTime() < uneSemaine
  ).length;
  const tauxRetourATemps =
    stats.retournes > 0
      ? Math.round((emprunts.filter((e) => e.statut === "Retourné" && (e.penalite ?? 0) === 0).length / stats.retournes) * 100)
      : 0;

  const statsRetard = [
    { categorie: "En cours", count: stats.enCours, color: "bg-blue-500" },
    { categorie: "En retard (1-7j)", count: stats.enRetard - stats.retardImportant, color: "bg-yellow-500" },
    { categorie: "Retard important (7j+)", count: stats.retardImportant, color: "bg-red-500" },
    { categorie: "Retournés", count: stats.retournes, color: "bg-green-500" },
  ];

  const handleNewEmprunt = () => {
    if (!newEmprunt.eleveId || !newEmprunt.livreId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    createEmprunt.mutate(
      { eleveId: newEmprunt.eleveId, livreId: newEmprunt.livreId, dureeJours: parseInt(newEmprunt.dureeJours, 10) },
      {
        onSuccess: () => {
          setIsNewEmpruntOpen(false);
          setNewEmprunt({ eleveId: "", livreId: "", dureeJours: "14" });
          toast.success("Emprunt enregistré avec succès");
        },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de l'enregistrement."),
      }
    );
  };

  const handleRetour = () => {
    if (!selectedEmprunt) return;
    retournerEmprunt.mutate(selectedEmprunt.id, {
      onSuccess: (data) => {
        setIsRetourDialogOpen(false);
        toast.success(
          data.joursRetard > 0
            ? `Retour enregistré avec ${data.joursRetard} jour(s) de retard (pénalité : ${data.penalite?.toLocaleString()} FCFA)`
            : "Retour enregistré, sans retard"
        );
        setSelectedEmprunt(null);
      },
      onError: (err: any) => toast.error(err?.response?.data?.error ?? "Échec de l'enregistrement du retour."),
    });
  };

  const openRetourDialog = (emprunt: Emprunt) => {
    setSelectedEmprunt(emprunt);
    setIsRetourDialogOpen(true);
  };

  const openDetails = (emprunt: Emprunt) => {
    setSelectedEmprunt(emprunt);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emprunts & Retours</h1>
          <p className="text-muted-foreground">Gestion des prêts de livres et ressources</p>
        </div>
        <Button onClick={() => setIsNewEmpruntOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Emprunt
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emprunts Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.enCours}</div><p className="text-xs text-muted-foreground">En circulation</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{stats.enRetard}</div><p className="text-xs text-muted-foreground">Dont {stats.retardImportant} retard important</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retours (7 derniers jours)</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{retoursSemaine}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Retour à Temps</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{tauxRetourATemps}%</div><p className="text-xs text-muted-foreground">sur les retours enregistrés</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>État des Emprunts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsRetard.map((stat) => (
                <div key={stat.categorie} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className={`h-3 w-3 rounded-full ${stat.color}`} /><span className="text-sm">{stat.categorie}</span></div>
                    <span className="text-sm font-bold">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Emprunts</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-10 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="tous">Tous</SelectItem>
                    <SelectItem value="encours">En cours</SelectItem>
                    <SelectItem value="retard">En retard</SelectItem>
                    <SelectItem value="retourne">Retournés</SelectItem>
                  </SelectContent>
                </Select>
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
                    <TableHead>Livre</TableHead>
                    <TableHead>Emprunteur</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date Emprunt</TableHead>
                    <TableHead>Retour Prévu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmprunts.map((emprunt) => (
                    <TableRow key={emprunt.id}>
                      <TableCell className="font-medium">{emprunt.livre.titre}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><User className="h-3 w-3" />{nomEmprunteur(emprunt)}</div></TableCell>
                      <TableCell><Badge variant="outline">{classeDe(emprunt)}</Badge></TableCell>
                      <TableCell><div className="flex items-center gap-1 text-sm"><Calendar className="h-3 w-3" />{new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}</div></TableCell>
                      <TableCell><div className="flex items-center gap-1 text-sm"><Clock className="h-3 w-3" />{new Date(emprunt.dateRetourPrevue).toLocaleDateString('fr-FR')}</div></TableCell>
                      <TableCell>
                        {emprunt.statut === "En retard" ? (
                          <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Retard {joursRetard(emprunt)}j</Badge>
                        ) : emprunt.statut === "Retourné" ? (
                          <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Retourné</Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En cours</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openDetails(emprunt)}><Eye className="h-4 w-4" /></Button>
                          {emprunt.statut !== "Retourné" && (
                            <Button size="sm" variant="outline" onClick={() => openRetourDialog(emprunt)}>
                              <CheckCircle className="mr-1 h-4 w-4" />Retour
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEmprunts.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun emprunt trouvé</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isNewEmpruntOpen} onOpenChange={setIsNewEmpruntOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel Emprunt</DialogTitle>
            <DialogDescription>Enregistrer un nouvel emprunt de livre</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Élève</Label>
              <Select value={newEmprunt.eleveId} onValueChange={(v) => setNewEmprunt({ ...newEmprunt, eleveId: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un élève" /></SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {eleves.map((eleve) => (
                    <SelectItem key={eleve.id} value={eleve.id}>{eleve.nom} {eleve.prenom} ({eleve.matricule})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Livre</Label>
              <Select value={newEmprunt.livreId} onValueChange={(v) => setNewEmprunt({ ...newEmprunt, livreId: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un livre" /></SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {livresDisponibles.map((livre) => (
                    <SelectItem key={livre.id} value={livre.id}>{livre.titre} ({livre.exemplairesDisponibles} dispo.)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Durée d'emprunt</Label>
              <Select value={newEmprunt.dureeJours} onValueChange={(v) => setNewEmprunt({ ...newEmprunt, dureeJours: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="14">14 jours</SelectItem>
                  <SelectItem value="21">21 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEmpruntOpen(false)}>Annuler</Button>
            <Button onClick={handleNewEmprunt} disabled={createEmprunt.isPending}>
              {createEmprunt.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRetourDialogOpen} onOpenChange={setIsRetourDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le Retour</DialogTitle>
            <DialogDescription>Enregistrer le retour de "{selectedEmprunt?.livre.titre}" par {selectedEmprunt && nomEmprunteur(selectedEmprunt)}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Livre:</strong> {selectedEmprunt?.livre.titre}</p>
              <p><strong>Emprunteur:</strong> {selectedEmprunt && nomEmprunteur(selectedEmprunt)}</p>
              <p><strong>Date d'emprunt:</strong> {selectedEmprunt && new Date(selectedEmprunt.dateEmprunt).toLocaleDateString('fr-FR')}</p>
              {selectedEmprunt && joursRetard(selectedEmprunt) > 0 && (
                <Badge variant="destructive">Retard de {joursRetard(selectedEmprunt)} jours — pénalité estimée à l'enregistrement</Badge>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRetourDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleRetour} disabled={retournerEmprunt.isPending}>
              {retournerEmprunt.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmer le Retour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Détails de l'Emprunt</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Livre</Label><p className="font-medium">{selectedEmprunt?.livre.titre}</p></div>
              <div><Label className="text-muted-foreground">Auteur</Label><p className="font-medium">{selectedEmprunt?.livre.auteur}</p></div>
              <div><Label className="text-muted-foreground">Emprunteur</Label><p className="font-medium">{selectedEmprunt && nomEmprunteur(selectedEmprunt)}</p></div>
              <div><Label className="text-muted-foreground">Classe</Label><p className="font-medium">{selectedEmprunt && classeDe(selectedEmprunt)}</p></div>
              <div><Label className="text-muted-foreground">Date d'emprunt</Label><p className="font-medium">{selectedEmprunt && new Date(selectedEmprunt.dateEmprunt).toLocaleDateString('fr-FR')}</p></div>
              <div><Label className="text-muted-foreground">Retour prévu</Label><p className="font-medium">{selectedEmprunt && new Date(selectedEmprunt.dateRetourPrevue).toLocaleDateString('fr-FR')}</p></div>
            </div>
            <div>
              <Label className="text-muted-foreground">Statut</Label>
              <div className="mt-1">
                {selectedEmprunt?.statut === "En retard" ? (
                  <Badge variant="destructive">Retard de {selectedEmprunt && joursRetard(selectedEmprunt)} jours</Badge>
                ) : selectedEmprunt?.statut === "Retourné" ? (
                  <Badge variant="default">Retourné{selectedEmprunt?.penalite ? ` (pénalité : ${selectedEmprunt.penalite.toLocaleString()} FCFA)` : ""}</Badge>
                ) : (
                  <Badge variant="secondary">En cours</Badge>
                )}
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
