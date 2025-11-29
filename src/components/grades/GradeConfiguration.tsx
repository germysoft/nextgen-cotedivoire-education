import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { GradeConfig } from "./GradeEntryWizard";
import { useRole } from "@/contexts/RoleContext";
import { 
  getTeacherClasses, 
  getTeacherSubjectsForClass,
  mockTeacherAssignments 
} from "@/data/teacherAssignments";

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
  const { currentRole, currentUserId } = useRole();
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [gradeType, setGradeType] = useState<"10" | "20" | "40" | "bonus">("20");
  const [trimester, setTrimester] = useState("1");
  const [columnName, setColumnName] = useState("");
  const [coefficient, setCoefficient] = useState("1");
  
  // Listes filtrées selon le rôle et l'utilisateur
  const [availableClasses, setAvailableClasses] = useState(mockClasses);
  const [availableSubjects, setAvailableSubjects] = useState(mockSubjects);

  // Filtrer les classes et matières pour les enseignants
  useEffect(() => {
    if (currentRole === 'enseignant') {
      const teacherClasses = getTeacherClasses(currentUserId);
      setAvailableClasses(teacherClasses);
      
      // Si une classe est sélectionnée, filtrer les matières
      if (classId) {
        const teacherSubjects = getTeacherSubjectsForClass(currentUserId, classId);
        setAvailableSubjects(teacherSubjects);
      } else {
        setAvailableSubjects([]);
      }
    } else {
      // Admin/Directeur voit tout
      setAvailableClasses(mockClasses);
      setAvailableSubjects(mockSubjects);
    }
  }, [currentRole, currentUserId, classId]);

  // Réinitialiser la matière quand la classe change
  useEffect(() => {
    setSubjectId("");
  }, [classId]);

  const canProceed = classId && subjectId && gradeType && trimester && columnName && coefficient;

  const handleNext = () => {
    if (!canProceed) return;

    const selectedClass = availableClasses.find(c => c.id === classId);
    const selectedSubject = availableSubjects.find(s => s.id === subjectId);

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
                  {availableClasses.length > 0 ? (
                    availableClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Aucune classe assignée
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Matière *</Label>
              <Select 
                value={subjectId} 
                onValueChange={setSubjectId}
                disabled={!classId || availableSubjects.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !classId 
                      ? "Sélectionner d'abord une classe" 
                      : availableSubjects.length === 0 
                        ? "Aucune matière assignée pour cette classe"
                        : "Sélectionner une matière"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.length > 0 ? (
                    availableSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Aucune matière assignée
                    </div>
                  )}
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