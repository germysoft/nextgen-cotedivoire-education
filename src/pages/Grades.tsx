import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calculator, TrendingUp, Loader2 } from "lucide-react";
import { GradeEntryWizard } from "@/components/grades/GradeEntryWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAnneeScolaireActive, useClasseQuery, useClassesQuery } from "@/hooks/api/useClasses";
import { EleveMoyenne, useMoyennesQuery } from "@/hooks/api/useNotes";

export default function Grades() {
  const { t } = useLanguage();
  const [selectedClasseId, setSelectedClasseId] = useState<string | undefined>();
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | undefined>();
  const [isGradeWizardOpen, setIsGradeWizardOpen] = useState(false);

  const { data: anneeActive } = useAnneeScolaireActive();
  const { data: classes = [] } = useClassesQuery(anneeActive?.id);
  const { data: classeDetail } = useClasseQuery(selectedClasseId);
  const { data: moyennes, isLoading, isError } = useMoyennesQuery(selectedClasseId, selectedPeriodeId);

  // Sélectionne automatiquement la première classe et la période en cours dès qu'elles sont connues.
  useEffect(() => {
    if (!selectedClasseId && classes.length > 0) setSelectedClasseId(classes[0].id);
  }, [classes, selectedClasseId]);
  useEffect(() => {
    if (!selectedPeriodeId && anneeActive?.periodes?.length) setSelectedPeriodeId(anneeActive.periodes[0].id);
  }, [anneeActive, selectedPeriodeId]);

  const selectedClasse = classes.find((c) => c.id === selectedClasseId);
  const selectedPeriode = anneeActive?.periodes.find((p) => p.id === selectedPeriodeId);

  // Professeur d'une matière donnée dans cette classe, déduit de l'emploi du temps réel.
  const professeurDe = (matiereId: string) => {
    const cours = classeDetail?.cours.find((c) => c.matiere.id === matiereId);
    return cours ? `${cours.personnel.nom} ${cours.personnel.prenom}` : "—";
  };

  const getGradeColor = (avg: number) => {
    if (avg >= 16) return "default";
    if (avg >= 14) return "secondary";
    if (avg >= 10) return "outline";
    return "destructive";
  };

  const generateBulletinPDF = (eleve: EleveMoyenne) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("BULLETIN DE NOTES", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Année scolaire ${anneeActive?.libelle ?? ""}`, 105, 28, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Élève: ${eleve.eleve}`, 14, 45);
    doc.text(`Classe: ${selectedClasse?.nom ?? ""}`, 120, 45);
    doc.text(`Période: ${selectedPeriode?.type ?? ""}`, 120, 52);

    autoTable(doc, {
      startY: 60,
      head: [['Matière', 'Professeur', 'Moyenne/20']],
      body: eleve.matieres.map((m) => [m.matiere, professeurDe(m.matiereId), m.moyenne?.toFixed(2) ?? "—"]),
      foot: [['', 'MOYENNE GÉNÉRALE', eleve.moyenneGenerale.toFixed(2) + '/20']],
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(11);
    doc.text(`Rang : ${eleve.rang}° / ${eleve.effectifClasse}`, 14, finalY + 15);
    doc.text("Signature du Chef d'Établissement", 14, finalY + 35);
    doc.text("Signature du Parent", 140, finalY + 35);

    doc.save(`Bulletin_${eleve.eleve.replace(' ', '_')}.pdf`);
    toast({ title: "Bulletin généré", description: `Le bulletin de ${eleve.eleve} a été téléchargé` });
  };

  const handleExportAllGrades = () => {
    if (!moyennes) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Relevé de notes - ${selectedClasse?.nom ?? ""}`, 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`${selectedPeriode?.type ?? ""} - Année ${anneeActive?.libelle ?? ""}`, 105, 28, { align: "center" });
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 35, { align: "center" });

    autoTable(doc, {
      startY: 45,
      head: [['#', 'Élève', 'Moyenne', 'Rang', 'Mention']],
      body: [...moyennes]
        .sort((a, b) => a.rang - b.rang)
        .map((s) => [
          s.rang.toString(),
          s.eleve,
          s.moyenneGenerale.toFixed(2) + '/20',
          s.rang + '°',
          s.moyenneGenerale >= 16 ? 'TB' : s.moyenneGenerale >= 14 ? 'B' : s.moyenneGenerale >= 12 ? 'AB' : s.moyenneGenerale >= 10 ? 'P' : 'I',
        ]),
    });

    doc.save(`Releve_Notes_${selectedClasse?.nom}_${selectedPeriode?.type}.pdf`);
    toast({ title: "Export réussi", description: "Le relevé de notes a été téléchargé" });
  };

  const generalAverage = moyennes && moyennes.length > 0
    ? moyennes.reduce((s, e) => s + e.moyenneGenerale, 0) / moyennes.length
    : 0;
  const successRate = moyennes && moyennes.length > 0
    ? Math.round((moyennes.filter((e) => e.moyenneGenerale >= 10).length / moyennes.length) * 100)
    : 0;
  const meilleureMoyenne = moyennes && moyennes.length > 0 ? Math.max(...moyennes.map((e) => e.moyenneGenerale)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('grades.title')}</h1>
          <p className="text-muted-foreground">{t('grades.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAllGrades} disabled={!moyennes?.length}>
            <Download className="mr-2 h-4 w-4" />
            {t('grades.export')}
          </Button>
          <Button onClick={() => setIsGradeWizardOpen(true)}>
            <Calculator className="mr-2 h-4 w-4" />
            {t('grades.enterGrades')}
          </Button>
        </div>
      </div>

      {/* La saisie de notes (assistant multi-étapes) reste un composant à part,
          non branché sur l'API dans cette passe — voir MIGRATION.md. Utilisez
          en attendant les routes /api/notes directement (POST) pour saisir des
          notes réelles ; le tableau ci-dessous, lui, est branché sur l'API. */}
      <GradeEntryWizard open={isGradeWizardOpen} onOpenChange={setIsGradeWizardOpen} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('grades.generalAverage')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generalAverage.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{t('grades.class')} {selectedClasse?.nom ?? ""}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('grades.bestGrade')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meilleureMoyenne.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Meilleure moyenne générale</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('grades.successRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">{t('grades.averageAbove10')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('grades.filters')}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('grades.class')}</Label>
              <Select value={selectedClasseId} onValueChange={setSelectedClasseId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('grades.term')}</Label>
              <Select value={selectedPeriodeId} onValueChange={setSelectedPeriodeId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {anneeActive?.periodes.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.type} ({anneeActive.libelle})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t('grades.gradeReport')} - {selectedClasse?.nom ?? ""}</CardTitle></CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Chargement des notes…
            </div>
          )}
          {isError && <div className="py-16 text-center text-destructive">Impossible de calculer les moyennes pour cette classe/période.</div>}
          {!isLoading && !isError && moyennes && (
            <Tabs defaultValue="list">
              <TabsList>
                <TabsTrigger value="list">{t('grades.gradeList')}</TabsTrigger>
                <TabsTrigger value="stats">{t('grades.statistics')}</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4">
                {moyennes.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">Aucune note saisie pour cette classe sur cette période.</p>
                )}
                {[...moyennes].sort((a, b) => a.rang - b.rang).map((eleve) => (
                  <div key={eleve.eleveId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{eleve.eleve}</h3>
                        <p className="text-sm text-muted-foreground">Rang : {eleve.rang}° / {eleve.effectifClasse}</p>
                      </div>
                      <Badge variant={getGradeColor(eleve.moyenneGenerale)} className="text-lg px-3 py-1">
                        {t('grades.average')}: {eleve.moyenneGenerale.toFixed(2)}
                      </Badge>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('grades.subject')}</TableHead>
                          <TableHead>{t('grades.teacher')}</TableHead>
                          <TableHead className="text-center">Moyenne/20</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eleve.matieres.map((m) => (
                          <TableRow key={m.matiereId}>
                            <TableCell className="font-medium">{m.matiere}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{professeurDe(m.matiereId)}</TableCell>
                            <TableCell className="text-center font-semibold">{m.moyenne?.toFixed(2) ?? "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => generateBulletinPDF(eleve)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {t('grades.generateBulletin')}
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="stats">
                <div className="text-center py-12 text-muted-foreground">{t('grades.detailedStats')}</div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
