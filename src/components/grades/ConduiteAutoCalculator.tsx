import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Calculator, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  RefreshCw,
  Save,
  Info
} from "lucide-react";

interface Incident {
  id: number;
  eleve: string;
  type: string;
  gravite: "Légère" | "Modérée" | "Grave";
  date: string;
}

interface AbsenceRecord {
  eleve: string;
  absencesJustifiees: number;
  absencesInjustifiees: number;
  retards: number;
}

interface StudentConduiteData {
  id: number;
  studentName: string;
  matricule: string;
  incidents: Incident[];
  absences: AbsenceRecord;
  calculatedNote: number;
  previousNote: number;
  tendance: "up" | "down" | "stable";
  details: {
    baseNote: number;
    incidentPenalty: number;
    absencePenalty: number;
    retardPenalty: number;
  };
}

interface ConduiteAutoCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: { id: number; studentName: string; matricule: string; conduiteNote: number }[];
  onApplyNotes: (updatedStudents: { id: number; conduiteNote: number }[]) => void;
  className?: string;
}

// Données simulées d'incidents
const mockIncidents: Incident[] = [
  { id: 1, eleve: "KOUASSI Amara", type: "Retard", gravite: "Légère", date: "2024-12-15" },
  { id: 2, eleve: "KOUASSI Amara", type: "Insolence", gravite: "Modérée", date: "2024-12-10" },
  { id: 3, eleve: "DIALLO Ibrahim", type: "Bagarre", gravite: "Grave", date: "2024-12-08" },
  { id: 4, eleve: "KONE Fatoumata", type: "Oubli matériel", gravite: "Légère", date: "2024-12-12" },
  { id: 5, eleve: "TRAORE Mamadou", type: "Absence injustifiée", gravite: "Modérée", date: "2024-12-14" },
  { id: 6, eleve: "TRAORE Mamadou", type: "Retard", gravite: "Légère", date: "2024-12-16" },
];

// Données simulées d'absences
const mockAbsences: AbsenceRecord[] = [
  { eleve: "KOUASSI Amara", absencesJustifiees: 2, absencesInjustifiees: 1, retards: 3 },
  { eleve: "DIALLO Ibrahim", absencesJustifiees: 0, absencesInjustifiees: 3, retards: 2 },
  { eleve: "KONE Fatoumata", absencesJustifiees: 1, absencesInjustifiees: 0, retards: 1 },
  { eleve: "TRAORE Mamadou", absencesJustifiees: 3, absencesInjustifiees: 2, retards: 4 },
  { eleve: "BAMBA Yao", absencesJustifiees: 0, absencesInjustifiees: 0, retards: 0 },
];

export function ConduiteAutoCalculator({
  open,
  onOpenChange,
  students,
  onApplyNotes,
  className = "",
}: ConduiteAutoCalculatorProps) {
  const [calculatedData, setCalculatedData] = useState<StudentConduiteData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Configuration des pénalités
  const penaltyConfig = {
    incident: {
      Légère: 0.5,
      Modérée: 1.5,
      Grave: 3,
    },
    absenceInjustifiee: 0.5, // par jour
    absenceJustifiee: 0, // pas de pénalité
    retard: 0.25, // par retard
  };

  const calculateConduiteNote = (
    incidents: Incident[],
    absences: AbsenceRecord
  ): { note: number; details: StudentConduiteData["details"] } => {
    const baseNote = 20;
    
    // Calcul pénalité incidents
    let incidentPenalty = 0;
    incidents.forEach((incident) => {
      incidentPenalty += penaltyConfig.incident[incident.gravite];
    });

    // Calcul pénalité absences
    const absencePenalty = absences.absencesInjustifiees * penaltyConfig.absenceInjustifiee;
    
    // Calcul pénalité retards
    const retardPenalty = absences.retards * penaltyConfig.retard;

    // Note finale (minimum 0)
    const finalNote = Math.max(0, Math.round((baseNote - incidentPenalty - absencePenalty - retardPenalty) * 100) / 100);

    return {
      note: finalNote,
      details: {
        baseNote,
        incidentPenalty: Math.round(incidentPenalty * 100) / 100,
        absencePenalty: Math.round(absencePenalty * 100) / 100,
        retardPenalty: Math.round(retardPenalty * 100) / 100,
      },
    };
  };

  const performCalculation = () => {
    setIsCalculating(true);

    // Simulation d'un calcul
    setTimeout(() => {
      const calculated = students.map((student) => {
        // Récupérer les incidents de l'élève
        const studentIncidents = mockIncidents.filter(
          (inc) => inc.eleve === student.studentName
        );

        // Récupérer les absences de l'élève
        const studentAbsences = mockAbsences.find(
          (abs) => abs.eleve === student.studentName
        ) || { eleve: student.studentName, absencesJustifiees: 0, absencesInjustifiees: 0, retards: 0 };

        // Calculer la note
        const { note, details } = calculateConduiteNote(studentIncidents, studentAbsences);

        // Déterminer la tendance
        let tendance: "up" | "down" | "stable" = "stable";
        if (note > student.conduiteNote + 0.5) tendance = "up";
        else if (note < student.conduiteNote - 0.5) tendance = "down";

        return {
          id: student.id,
          studentName: student.studentName,
          matricule: student.matricule,
          incidents: studentIncidents,
          absences: studentAbsences,
          calculatedNote: note,
          previousNote: student.conduiteNote,
          tendance,
          details,
        };
      });

      setCalculatedData(calculated);
      setIsCalculating(false);
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      performCalculation();
    }
  }, [open, students]);

  const getTendanceIcon = (tendance: "up" | "down" | "stable") => {
    switch (tendance) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getNoteColor = (note: number) => {
    if (note >= 16) return "text-green-600";
    if (note >= 14) return "text-blue-600";
    if (note >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const handleApplyNotes = () => {
    const updatedNotes = calculatedData.map((data) => ({
      id: data.id,
      conduiteNote: data.calculatedNote,
    }));
    onApplyNotes(updatedNotes);
    toast.success("Notes de conduite calculées appliquées avec succès");
    onOpenChange(false);
  };

  const averageCalculatedNote = calculatedData.length > 0
    ? Math.round((calculatedData.reduce((sum, d) => sum + d.calculatedNote, 0) / calculatedData.length) * 100) / 100
    : 0;

  const studentsWithPenalties = calculatedData.filter(
    (d) => d.details.incidentPenalty > 0 || d.details.absencePenalty > 0 || d.details.retardPenalty > 0
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calcul Automatique des Notes de Conduite
          </DialogTitle>
          <DialogDescription>
            {className && `Classe: ${className} - `}
            Génération basée sur les incidents disciplinaires et l'assiduité enregistrés.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statistiques résumées */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Moyenne Calculée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getNoteColor(averageCalculatedNote)}`}>
                  {averageCalculatedNote.toFixed(2)}/20
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Élèves avec Pénalités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {studentsWithPenalties}/{calculatedData.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Incidents Totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculatedData.reduce((sum, d) => sum + d.incidents.length, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations sur le calcul */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Barème de calcul :</strong> Note de base 20/20, moins : 
              Incident léger (-0.5), Incident modéré (-1.5), Incident grave (-3), 
              Absence injustifiée (-0.5/jour), Retard (-0.25)
            </AlertDescription>
          </Alert>

          {/* Bouton recalculer */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={performCalculation} disabled={isCalculating}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isCalculating ? "animate-spin" : ""}`} />
              Recalculer
            </Button>
          </div>

          {/* Tableau des résultats */}
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Calcul en cours...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead className="text-center">Incidents</TableHead>
                  <TableHead className="text-center">Absences Inj.</TableHead>
                  <TableHead className="text-center">Retards</TableHead>
                  <TableHead className="text-center">Pénalité</TableHead>
                  <TableHead className="text-center">Note Actuelle</TableHead>
                  <TableHead className="text-center">Note Calculée</TableHead>
                  <TableHead className="text-center">Évolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculatedData.map((data) => {
                  const totalPenalty = data.details.incidentPenalty + data.details.absencePenalty + data.details.retardPenalty;
                  return (
                    <TableRow key={data.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{data.studentName}</div>
                          <div className="text-xs text-muted-foreground">{data.matricule}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {data.incidents.length > 0 ? (
                          <Badge variant="destructive" className="text-xs">
                            {data.incidents.length} ({data.incidents.filter(i => i.gravite === "Grave").length} graves)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">0</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {data.absences.absencesInjustifiees > 0 ? (
                          <span className="text-red-600 font-medium">{data.absences.absencesInjustifiees}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {data.absences.retards > 0 ? (
                          <span className="text-orange-600">{data.absences.retards}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {totalPenalty > 0 ? (
                          <span className="text-red-600 font-medium">-{totalPenalty.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {data.previousNote.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-bold ${getNoteColor(data.calculatedNote)}`}>
                          {data.calculatedNote.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getTendanceIcon(data.tendance)}
                          <span className={`text-xs ${
                            data.tendance === "up" ? "text-green-600" : 
                            data.tendance === "down" ? "text-red-600" : "text-muted-foreground"
                          }`}>
                            {data.calculatedNote > data.previousNote 
                              ? `+${(data.calculatedNote - data.previousNote).toFixed(2)}`
                              : data.calculatedNote < data.previousNote
                              ? (data.calculatedNote - data.previousNote).toFixed(2)
                              : "0"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleApplyNotes} disabled={isCalculating || calculatedData.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            Appliquer les Notes Calculées
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
