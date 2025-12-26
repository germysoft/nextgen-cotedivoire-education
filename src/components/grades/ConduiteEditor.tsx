import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { Save, UserCheck, Calculator } from "lucide-react";
import { ConduiteAutoCalculator } from "./ConduiteAutoCalculator";

interface Student {
  id: number;
  studentName: string;
  matricule: string;
  conduiteNote: number;
}

interface ConduiteEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  onSave: (updatedStudents: Student[]) => void;
  className?: string;
}

export function ConduiteEditor({
  open,
  onOpenChange,
  students,
  onSave,
  className = "",
}: ConduiteEditorProps) {
  const [editedStudents, setEditedStudents] = useState<Student[]>(students);
  const [showAutoCalculator, setShowAutoCalculator] = useState(false);

  const handleNoteChange = (studentId: number, value: string) => {
    const note = parseFloat(value);
    if (isNaN(note) || note < 0 || note > 20) return;
    
    setEditedStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, conduiteNote: note } : s))
    );
  };

  const getConduiteColor = (note: number) => {
    if (note >= 16) return "default";
    if (note >= 14) return "secondary";
    if (note >= 10) return "outline";
    return "destructive";
  };

  const getConduiteAppreciation = (note: number) => {
    if (note >= 18) return "Excellent";
    if (note >= 16) return "Très Bien";
    if (note >= 14) return "Bien";
    if (note >= 12) return "Assez Bien";
    if (note >= 10) return "Passable";
    if (note >= 8) return "Insuffisant";
    return "Très Insuffisant";
  };

  const handleSave = () => {
    onSave(editedStudents);
    toast.success("Notes de conduite enregistrées avec succès");
    onOpenChange(false);
  };

  const handleApplyAll = (value: string) => {
    const note = parseFloat(value);
    if (isNaN(note) || note < 0 || note > 20) return;
    
    setEditedStudents(prev => prev.map(s => ({ ...s, conduiteNote: note })));
  };

  const handleApplyAutoNotes = (updatedNotes: { id: number; conduiteNote: number }[]) => {
    setEditedStudents(prev => 
      prev.map(student => {
        const update = updatedNotes.find(u => u.id === student.id);
        return update ? { ...student, conduiteNote: update.conduiteNote } : student;
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Saisie des Notes de Conduite
          </DialogTitle>
          <DialogDescription>
            {className && `Classe: ${className} - `}
            Saisissez ou modifiez les notes de conduite (sur 20) pour chaque élève.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Application en masse et calcul automatique */}
          <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap">Appliquer à tous :</Label>
              <Input
                type="number"
                min={0}
                max={20}
                step={0.5}
                placeholder="Note /20"
                className="w-24"
                onChange={(e) => handleApplyAll(e.target.value)}
              />
              <span className="text-sm text-muted-foreground">
                (Modifiera toutes les notes ci-dessous)
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAutoCalculator(true)}
              className="gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calcul Automatique
            </Button>
          </div>

          {/* Tableau des élèves */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead className="text-center w-32">Note /20</TableHead>
                <TableHead className="text-center">Appréciation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell className="text-muted-foreground">{student.matricule}</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={student.conduiteNote}
                      onChange={(e) => handleNoteChange(student.id, e.target.value)}
                      className="w-20 mx-auto text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getConduiteColor(student.conduiteNote)}>
                      {getConduiteAppreciation(student.conduiteNote)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Modal de calcul automatique */}
      <ConduiteAutoCalculator
        open={showAutoCalculator}
        onOpenChange={setShowAutoCalculator}
        students={editedStudents}
        onApplyNotes={handleApplyAutoNotes}
        className={className}
      />
    </Dialog>
  );
}
