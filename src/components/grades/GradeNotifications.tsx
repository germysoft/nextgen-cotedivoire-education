import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Mail, MessageSquare, Save } from "lucide-react";
import { GradeConfig, GradeColumn, StudentGrade } from "./GradeEntryWizard";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface GradeNotificationsProps {
  config: GradeConfig;
  studentGrades: StudentGrade[];
  columns: GradeColumn[];
  onSave: () => void;
  onBack: () => void;
}

export function GradeNotifications({
  config,
  studentGrades,
  columns,
  onSave,
  onBack,
}: GradeNotificationsProps) {
  const [sendSMS, setSendSMS] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [smsMessage, setSmsMessage] = useState(
    `Nouvelle note en ${config.subjectName} pour votre enfant. Moyenne: [NOTE]/20. Connectez-vous pour plus de détails.`
  );
  const [emailSubject, setEmailSubject] = useState(
    `Nouvelle note - ${config.subjectName} - ${config.className}`
  );
  const [emailMessage, setEmailMessage] = useState(
    `Bonjour,\n\nNous vous informons qu'une nouvelle note a été enregistrée pour votre enfant [NOM_ELEVE].\n\nMatière: ${config.subjectName}\nClasse: ${config.className}\nTrimestre: ${config.trimester}er Trimestre\n\nVeuillez vous connecter au portail parent pour consulter les détails.\n\nCordialement,\nL'équipe pédagogique`
  );

  const maxGrade = config.gradeType === "bonus" ? 5 : parseInt(config.gradeType);

  const calculateStudentAverage = (student: StudentGrade) => {
    const validGrades = columns.filter((col) => student.grades[col.id] !== null && student.grades[col.id] !== undefined);
    if (validGrades.length === 0) return 0;

    const totalPoints = validGrades.reduce((sum, col) => {
      const grade = student.grades[col.id] || 0;
      const normalizedGrade = (grade / maxGrade) * 20; // Normalize to /20
      return sum + normalizedGrade * col.coefficient;
    }, 0);

    const totalCoef = validGrades.reduce((sum, col) => sum + col.coefficient, 0);
    return totalPoints / totalCoef;
  };

  const handleSave = () => {
    if (!sendSMS && !sendEmail) {
      toast.error("Veuillez sélectionner au moins un mode de notification");
      return;
    }

    // Simulate saving grades
    toast.success("Notes enregistrées avec succès!");

    // Simulate sending notifications
    setTimeout(() => {
      if (sendSMS) {
        toast.success(`${studentGrades.length} SMS envoyés aux parents`);
      }
      if (sendEmail) {
        toast.success(`${studentGrades.length} Emails envoyés aux parents`);
      }
      onSave();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des notes saisies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classe:</span>
              <span className="font-semibold">{config.className}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Matière:</span>
              <span className="font-semibold">{config.subjectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trimestre:</span>
              <span className="font-semibold">{config.trimester}er Trimestre</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type de note:</span>
              <span className="font-semibold">/{maxGrade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre d'élèves:</span>
              <span className="font-semibold">{studentGrades.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre de colonnes:</span>
              <span className="font-semibold">{columns.length}</span>
            </div>
          </div>

          <div className="border rounded-lg overflow-x-auto max-h-[200px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col.id} className="text-center">
                      {col.name}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Moyenne /20</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentGrades.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.id} className="text-center">
                        {student.grades[col.id] !== null && student.grades[col.id] !== undefined
                          ? `${student.grades[col.id]}/${maxGrade}`
                          : "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold">
                      {calculateStudentAverage(student).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications aux parents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="send-sms"
                checked={sendSMS}
                onCheckedChange={(checked) => setSendSMS(checked as boolean)}
              />
              <Label htmlFor="send-sms" className="flex items-center gap-2 cursor-pointer">
                <MessageSquare className="h-4 w-4" />
                Envoyer un SMS
              </Label>
            </div>

            {sendSMS && (
              <div className="ml-6 space-y-2">
                <Label>Message SMS (max 160 caractères)</Label>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder="Personnalisez le message SMS..."
                />
                <p className="text-xs text-muted-foreground">
                  {smsMessage.length}/160 caractères
                </p>
                <p className="text-xs text-muted-foreground">
                  Variables disponibles: [NOM_ELEVE], [NOTE], [MATIERE]
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="send-email"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <Label htmlFor="send-email" className="flex items-center gap-2 cursor-pointer">
                <Mail className="h-4 w-4" />
                Envoyer un Email
              </Label>
            </div>

            {sendEmail && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <Label>Objet de l'email</Label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Objet de l'email..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Email</Label>
                  <Textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={8}
                    placeholder="Personnalisez le message email..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Variables disponibles: [NOM_ELEVE], [MATIERE], [CLASSE], [TRIMESTRE], [NOTE]
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Enregistrer et Notifier
        </Button>
      </div>
    </div>
  );
}