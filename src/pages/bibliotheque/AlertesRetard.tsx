import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Search, Loader2, AlertCircle, RotateCcw, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Emprunt, useAlertesRetardQuery, useRetournerEmprunt } from "@/hooks/api/useBibliotheque";

/**
 * Alertes de retard — branché sur GET /api/bibliotheque/alertes-retard
 * (emprunts « En cours » dont la date de retour prévue est dépassée).
 * Le retour se fait via POST /emprunts/:id/retour (pénalité calculée par le backend : 100 FCFA/jour).
 * Retiré du mock : contact parent (téléphone/email) et historique des relances,
 * absents de la réponse de cette route.
 */

const PENALITE_PAR_JOUR = 100; // doit rester aligné sur bibliotheque.routes.ts

const errMsg = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;

const joursRetard = (e: Emprunt) =>
  Math.max(0, Math.ceil((Date.now() - new Date(e.dateRetourPrevue).getTime()) / 86400000));

export default function AlertesRetard() {
  const [search, setSearch] = useState("");
  const { data: alertes = [], isLoading, isError } = useAlertesRetardQuery();
  const retourner = useRetournerEmprunt();

  const nom = (e: Emprunt) => (e.eleve ? `${e.eleve.nom} ${e.eleve.prenom}` : "—");
  const filtered = alertes
    .filter((e) => {
      const s = search.toLowerCase();
      return !s || e.livre.titre.toLowerCase().includes(s) || nom(e).toLowerCase().includes(s);
    })
    .sort((a, b) => joursRetard(b) - joursRetard(a));

  const stats = {
    total: alertes.length,
    critiques: alertes.filter((e) => joursRetard(e) > 14).length,
    penalites: alertes.reduce((acc, e) => acc + joursRetard(e) * PENALITE_PAR_JOUR, 0),
  };

  const handleRetour = (e: Emprunt) => {
    retourner.mutate(e.id, {
      onSuccess: (r) => toast.success(`Retour enregistré — pénalité : ${(r.penalite ?? 0).toLocaleString("fr-FR")} FCFA`),
      onError: (err: any) => toast.error(errMsg(err, "Erreur lors de l'enregistrement du retour")),
    });
  };

  const niveau = (j: number) =>
    j > 14 ? <Badge variant="destructive">Critique</Badge> : j > 7 ? <Badge className="bg-orange-500">Important</Badge> : <Badge variant="secondary">Léger</Badge>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><AlertTriangle className="h-8 w-8 text-destructive" />Alertes de retard</h1>
        <p className="text-muted-foreground">Emprunts dont la date de retour est dépassée</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Emprunts en retard</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Retards critiques (&gt;14 j)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{stats.critiques}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pénalités estimées</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.penalites.toLocaleString("fr-FR")} FCFA</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Livre ou élève..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-destructive py-8 justify-center"><AlertCircle className="h-5 w-5" />Impossible de charger les alertes.</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />Aucun emprunt en retard.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead><TableHead>Classe</TableHead><TableHead>Livre</TableHead>
                  <TableHead>Retour prévu</TableHead><TableHead>Retard</TableHead><TableHead>Pénalité</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => {
                  const j = joursRetard(e);
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{nom(e)}</TableCell>
                      <TableCell>{e.eleve?.inscriptions?.[0]?.classe?.nom ?? "—"}</TableCell>
                      <TableCell>{e.livre.titre}</TableCell>
                      <TableCell>{new Date(e.dateRetourPrevue).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell><div className="flex items-center gap-2">{j} j {niveau(j)}</div></TableCell>
                      <TableCell>{(j * PENALITE_PAR_JOUR).toLocaleString("fr-FR")} FCFA</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleRetour(e)} disabled={retourner.isPending}>
                          <RotateCcw className="h-4 w-4 mr-1" />Retour
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
