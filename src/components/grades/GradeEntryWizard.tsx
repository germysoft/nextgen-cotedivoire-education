import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradeConfiguration } from "./GradeConfiguration";
import { GradeEntryGrid } from "./GradeEntryGrid";
import { GradeNotifications } from "./GradeNotifications";

interface GradeEntryWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface GradeConfig {
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  gradeType: "10" | "20" | "40" | "bonus";
  trimester: string;
}

export interface GradeColumn {
  id: string;
  name: string;
  coefficient: number;
}

export interface StudentGrade {
  studentId: string;
  matricule: string;
  name: string;
  grades: { [columnId: string]: number | null };
}

const steps = [
  { id: 1, name: "Configuration" },
  { id: 2, name: "Saisie des notes" },
  { id: 3, name: "Enregistrement" },
];

export function GradeEntryWizard({ open, onOpenChange }: GradeEntryWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<GradeConfig | null>(null);
  const [columns, setColumns] = useState<GradeColumn[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);

  const handleConfigComplete = (configuration: GradeConfig) => {
    setConfig(configuration);
    // Mock students based on selected class
    const mockStudents: StudentGrade[] = [
      { studentId: "1", matricule: "66800001A", name: "Kouassi Jean", grades: {} },
      { studentId: "2", matricule: "66800002A", name: "Diallo Fatou", grades: {} },
      { studentId: "3", matricule: "66800003A", name: "Yao Marie", grades: {} },
      { studentId: "4", matricule: "66800004A", name: "Traoré Ibrahim", grades: {} },
      { studentId: "5", matricule: "66800005A", name: "Koné Aminata", grades: {} },
    ];
    setStudentGrades(mockStudents);
    setColumns([{ id: "col1", name: "Interrogation 1", coefficient: 1 }]);
    setCurrentStep(2);
  };

  const handleGradesComplete = () => {
    setCurrentStep(3);
  };

  const handleSaveAndNotify = () => {
    console.log("Saving grades and sending notifications");
    onOpenChange(false);
    resetWizard();
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setConfig(null);
    setColumns([]);
    setStudentGrades([]);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetWizard();
    }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saisie des Notes</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    currentStep > step.id
                      ? "bg-success border-success text-success-foreground"
                      : currentStep === step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm mt-2 font-medium",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all",
                    currentStep > step.id ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <GradeConfiguration onComplete={handleConfigComplete} />
          )}
          
          {currentStep === 2 && config && (
            <GradeEntryGrid
              config={config}
              columns={columns}
              setColumns={setColumns}
              studentGrades={studentGrades}
              setStudentGrades={setStudentGrades}
              onNext={handleGradesComplete}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && config && (
            <GradeNotifications
              config={config}
              studentGrades={studentGrades}
              columns={columns}
              onSave={handleSaveAndNotify}
              onBack={handleBack}
            />
          )}
        </div>

        {/* Navigation for Step 1 */}
        {currentStep === 1 && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}