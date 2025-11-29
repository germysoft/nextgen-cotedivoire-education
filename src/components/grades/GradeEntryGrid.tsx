import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, Download } from "lucide-react";
import { GradeConfig, GradeColumn, StudentGrade } from "./GradeEntryWizard";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface GradeEntryGridProps {
  config: GradeConfig;
  columns: GradeColumn[];
  setColumns: (columns: GradeColumn[]) => void;
  studentGrades: StudentGrade[];
  setStudentGrades: (grades: StudentGrade[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GradeEntryGrid({
  config,
  columns,
  setColumns,
  studentGrades,
  setStudentGrades,
  onNext,
  onBack,
}: GradeEntryGridProps) {
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnCoef, setNewColumnCoef] = useState("1");
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const maxGrade = config.gradeType === "bonus" ? 5 : parseInt(config.gradeType);

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      toast.error("Veuillez entrer un nom pour la colonne");
      return;
    }

    const newColumn: GradeColumn = {
      id: `col${Date.now()}`,
      name: newColumnName,
      coefficient: parseFloat(newColumnCoef) || 1,
    };

    setColumns([...columns, newColumn]);
    setNewColumnName("");
    setNewColumnCoef("1");
    setIsAddColumnOpen(false);
    toast.success("Colonne ajoutée avec succès");
  };

  const handleRemoveColumn = (columnId: string) => {
    if (columns.length === 1) {
      toast.error("Vous devez avoir au moins une colonne");
      return;
    }
    setColumns(columns.filter((col) => col.id !== columnId));
    // Remove grades for this column
    setStudentGrades(
      studentGrades.map((student) => {
        const { [columnId]: _, ...restGrades } = student.grades;
        return { ...student, grades: restGrades };
      })
    );
    toast.success("Colonne supprimée");
  };

  const handleGradeChange = (studentId: string, columnId: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);

    if (numValue !== null) {
      if (isNaN(numValue) || numValue < 0 || numValue > maxGrade) {
        toast.error(`La note doit être entre 0 et ${maxGrade}`);
        return;
      }
    }

    setStudentGrades(
      studentGrades.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              grades: { ...student.grades, [columnId]: numValue },
            }
          : student
      )
    );
  };

  const handleExportTemplate = () => {
    const data = studentGrades.map((student) => {
      const row: any = {
        Matricule: student.matricule,
        "Nom & Prénoms": student.name,
      };
      columns.forEach((col) => {
        row[`${col.name} (/${maxGrade})`] = "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notes");
    
    // Add metadata sheet
    const metadata = [
      ["Classe", config.className],
      ["Matière", config.subjectName],
      ["Trimestre", `${config.trimester}er Trimestre`],
      ["Type de note", `/${maxGrade}`],
    ];
    const wsMetadata = XLSX.utils.aoa_to_sheet(metadata);
    XLSX.utils.book_append_sheet(wb, wsMetadata, "Informations");

    XLSX.writeFile(wb, `Template_Notes_${config.className}_${config.subjectName}.xlsx`);
    toast.success("Template Excel exporté avec succès");
  };

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error("Le fichier Excel est vide");
          return;
        }

        // Process imported data
        const updatedGrades = studentGrades.map((student) => {
          const importedRow = jsonData.find(
            (row: any) => row.Matricule === student.matricule
          );
          if (!importedRow) return student;

          const newGrades = { ...student.grades };
          columns.forEach((col) => {
            const key = `${col.name} (/${maxGrade})`;
            const value = (importedRow as any)[key];
            if (value !== undefined && value !== "") {
              const numValue = parseFloat(value);
              if (!isNaN(numValue) && numValue >= 0 && numValue <= maxGrade) {
                newGrades[col.id] = numValue;
              }
            }
          });

          return { ...student, grades: newGrades };
        });

        setStudentGrades(updatedGrades);
        toast.success("Notes importées avec succès");
      } catch (error) {
        toast.error("Erreur lors de l'import du fichier Excel");
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = "";
  };

  const hasAllGrades = studentGrades.every((student) =>
    columns.every((col) => student.grades[col.id] !== undefined && student.grades[col.id] !== null)
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <span className="text-lg">
                {config.className} - {config.subjectName}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                (Type: /{maxGrade})
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Template Excel
              </Button>
              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer Excel
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleImportExcel}
                  />
                </label>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une colonne
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une colonne de notes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nom de la colonne</Label>
                    <Input
                      placeholder="Ex: Interrogation 2"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coefficient</Label>
                    <Input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newColumnCoef}
                      onChange={(e) => setNewColumnCoef(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddColumnOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddColumn}>Ajouter</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">Matricule</TableHead>
                  <TableHead className="min-w-[200px]">Nom & Prénoms</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col.id} className="text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <div>
                          <div className="font-semibold">{col.name}</div>
                          <div className="text-xs text-muted-foreground">
                            /{maxGrade} (Coef: {col.coefficient})
                          </div>
                        </div>
                        {columns.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleRemoveColumn(col.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentGrades.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-mono text-sm">{student.matricule}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.id} className="text-center">
                        <Input
                          type="number"
                          className="w-20 mx-auto text-center"
                          placeholder="0"
                          min="0"
                          max={maxGrade}
                          step={maxGrade === 40 ? "1" : "0.5"}
                          value={student.grades[col.id] ?? ""}
                          onChange={(e) =>
                            handleGradeChange(student.studentId, col.id, e.target.value)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button onClick={onNext}>
          Suivant
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}