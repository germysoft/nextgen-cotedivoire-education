import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Loader2, AlertCircle } from "lucide-react";
import { useElevesQuery } from "@/hooks/api/useEleves";
import { useConsultationsQuery, useFicheSanteQuery } from "@/hooks/api/useInfirmerie";

/**
 * Historique médical d'un élève — lecture seule :
 * `GET /infirmerie/consultations?eleveId=` (filtre serveur, avec ordonnances) + `GET /infirmerie/fiches-sante/:eleveId`.
 * Retirés du mock (absents du schéma) : vaccinations détaillées, hospitalisations, courbes de croissance.
 */

export default function HistoriqueMedical() {
  const [eleveId, setEleveId] = useState("");
  const { data: eleves } = useElevesQuery({ pageSize: 200 });
  const { data: fiche } = useFicheSanteQuery(eleveId || undefined);
  const { data: consultations = [], isLoading, isError } = useConsultationsQuery(eleveId || undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historique médical</h1>
        <p className="text-muted-foreground">Fiche de santé et consultations d'un élève</p>
      </div>

      <Select value={eleveId} onValueChange={setEleveId}>
        <SelectTrigger className="max-w-md"><SelectValue placeholder="Choisir un élève" /></SelectTrigger>
        <SelectContent>{(eleves?.items ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.matricule})</SelectItem>)}</SelectContent>
      </Select>

      {!eleveId ? (
        <p className="text-muted-foreground">Sélectionnez un élève pour afficher son historique.</p>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle>Fiche de santé</CardTitle></CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-3 text-sm">
              {fiche ? (
                <>
                  <div><span className="text-muted-foreground">Groupe sanguin : </span>{fiche.groupeSanguin ?? "—"}</div>
                  <div><span className="text-muted-foreground">Allergies : </span>{fiche.allergies ?? "—"}</div>
                  <div><span className="text-muted-foreground">Maladies chroniques : </span>{fiche.maladiesChroniques ?? "—"}</div>
                  <div><span className="text-muted-foreground">Traitement : </span>{fiche.traitementEnCours ?? "—"}</div>
                  <div><span className="text-muted-foreground">Vaccinations : </span>{fiche.vaccinationsAJour ? "À jour" : "Non à jour"}</div>
                  <div><span className="text-muted-foreground">Médecin : </span>{fiche.contactMedecin ?? "—"}</div>
                </>
              ) : <p className="text-muted-foreground">Aucune fiche de santé pour cet élève.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Consultations ({consultations.length})</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : isError ? (
                <div className="flex items-center gap-2 text-destructive py-6"><AlertCircle className="h-4 w-4" />Impossible de charger l'historique.</div>
              ) : consultations.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">Aucune consultation.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Motif</TableHead><TableHead>Diagnostic</TableHead><TableHead>Traitement</TableHead><TableHead>Ordonnances</TableHead><TableHead>Suivi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {consultations.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{new Date(c.date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{c.motif}</TableCell>
                        <TableCell>{c.diagnostic ?? "—"}</TableCell>
                        <TableCell>{c.traitement ?? "—"}</TableCell>
                        <TableCell>{c.ordonnances.flatMap((o) => o.medicaments.map((m) => m.nom)).join(", ") || "—"}</TableCell>
                        <TableCell>{c.necessiteSuivi ? <Badge variant="destructive">Oui</Badge> : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
