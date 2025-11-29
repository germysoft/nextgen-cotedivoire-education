import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { GradeConfig } from "./GradeEntryWizard";

interface GradeConfigurationProps {
  onComplete: (config: GradeConfig) => void;
}

const mockClasses = [
  { id: "6emeA", name: "6èmeA" },
  { id: "5emeB", name: "5èmeB" },
  { id: "4emeC", name: "4èmeC" },
  { id: "3emeA", name: "3èmeA" },
];

const mockSubjects = [
  { id: "francais", name: "Français" },
  { id: "maths", name: "Mathématiques" },
  { id: "anglais", name: "Anglais" },
  { id: "histoire", name: "Histoire-Géographie" },
  { id: "svt", name: "SVT" },
];

const gradeTypes = [
  { value: "10", label: "Note sur 10", description: "Interrogation courte" },
  { value: "20", label: "Note sur 20", description: "Devoir standard" },
  { value: "40", label: "Note sur 40", description: "Composition" },
  { value: "bonus", label: "Bonus", description: "Points de participation" },
];

const trimesters = [
  { value: "1", label: "1er Trimestre" },
  { value: "2", label: "2ème Trimestre" },
  { value: "3", label: "3ème Trimestre" },
];

const columnTypes = [
  { value: "Interrogation", label: "Interrogation" },
  { value: "Devoir", label: "Devoir" },
  { value: "Bonus", label: "Bonus" },
  { value: "Composition", label: "Composition" },
  { value: "Examen", label: "Examen" },
];

export function GradeConfiguration({ onComplete }: GradeConfigurationProps) {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [gradeType, setGradeType] = useState<"10" | "20" | "40" | "bonus">("20");
  const [trimester, setTrimester] = useState("1");
  const [columnName, setColumnName] = useState("");
  const [coefficient, setCoefficient] = useState("1");

  const canProceed = classId && subjectId && gradeType && trimester && columnName && coefficient;

  const handleNext = () => {
    if (!canProceed) return;

    const selectedClass = mockClasses.find(c => c.id === classId);
    const selectedSubject = mockSubjects.find(s => s.id === subjectId);

    if (selectedClass && selectedSubject) {
      onComplete({
        classId,
        className: selectedClass.name,
        subjectId,
        subjectName: selectedSubject.name,
        gradeType,
        trimester,
        columnName,
        coefficient: parseFloat(coefficient),
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Classe *</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Matière *</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trimestre *</Label>
              <Select value={trimester} onValueChange={setTrimester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trimesters.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de note *</Label>
              <Select value={columnName} onValueChange={setColumnName}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {columnTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Coefficient *</Label>
              <Select value={coefficient} onValueChange={setCoefficient}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="2.5">2.5</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>Barème de notation *</Label>
        <div className="grid grid-cols-2 gap-4">
          {gradeTypes.map((type) => (
            <Card
              key={type.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                gradeType === type.value
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border"
              }`}
              onClick={() => setGradeType(type.value as any)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                      gradeType === type.value
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {gradeType === type.value && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{type.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!canProceed} size="lg">
          Suivant
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}