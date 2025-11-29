import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StudentAlert, ConvocationReason, ConvocationPriority } from "@/types/convocation";
import { mockConvocationTemplates } from "@/data/mockConvocations";
import { CalendarIcon, Save, Send, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ConvocationFormProps {
  alert?: StudentAlert;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ConvocationForm({ alert, onSave, onCancel }: ConvocationFormProps) {
  const [reason, setReason] = useState<ConvocationReason>(alert?.alertType || 'academic_difficulty');
  const [priority, setPriority] = useState<ConvocationPriority>(alert?.severity || 'medium');
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [appointmentTime, setAppointmentTime] = useState("14:00");
  const [location, setLocation] = useState("Bureau du Directeur");
  const [convener, setConvener] = useState("M. Diagne");
  const [convenerRole, setConvenerRole] = useState("Directeur");
  const [customMessage, setCustomMessage] = useState("");

  const availableTemplates = mockConvocationTemplates.filter(t => t.reason === reason);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = mockConvocationTemplates.find(t => t.id === templateId);
    if (template) {
      let content = template.content;
      
      // Remplacer les variables
      if (alert) {
        content = content.replace(/{studentName}/g, alert.studentName);
        content = content.replace(/{className}/g, alert.className);
        content = content.replace(/{average}/g, alert.details.academicAverage?.toFixed(2) || 'N/A');
        content = content.replace(/{failingSubjects}/g, alert.details.failingSubjects?.join(', ') || 'N/A');
        content = content.replace(/{absenceCount}/g, alert.details.absenceCount?.toString() || 'N/A');
        content = content.replace(/{disciplinePoints}/g, alert.details.disciplinePoints?.toString() || 'N/A');
        content = content.replace(/{recentIncidents}/g, alert.details.recentIncidents?.map(i => `• ${i}`).join('\n') || 'N/A');
      }
      
      content = content.replace(/{appointmentDate}/g, appointmentDate ? format(appointmentDate, 'dd/MM/yyyy', { locale: fr }) : '[DATE]');
      content = content.replace(/{appointmentTime}/g, appointmentTime);
      content = content.replace(/{location}/g, location);
      content = content.replace(/{convener}/g, convener);
      content = content.replace(/{convenerRole}/g, convenerRole);
      
      setCustomMessage(content);
    }
  };

  const handleSubmit = (sendNow: boolean = false) => {
    const data = {
      studentId: alert?.studentId,
      studentName: alert?.studentName,
      studentNumber: alert?.studentNumber,
      classId: alert?.classId,
      className: alert?.className,
      parentName,
      parentEmail,
      parentPhone,
      reason,
      priority,
      appointmentDate: appointmentDate ? format(appointmentDate, 'yyyy-MM-dd') : undefined,
      appointmentTime,
      location,
      convener,
      convenerRole,
      customMessage,
      status: sendNow ? 'sent' : 'pending',
      createdDate: new Date().toISOString(),
      sentDate: sendNow ? new Date().toISOString() : undefined,
      followUpRequired: true,
    };
    onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {alert ? `Convocation - ${alert.studentName}` : 'Nouvelle convocation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations parent */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Informations du parent</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Nom du parent *</Label>
              <Input
                id="parentName"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="M./Mme ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Email</Label>
              <Input
                id="parentEmail"
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Téléphone</Label>
              <Input
                id="parentPhone"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+221 77 123 45 67"
              />
            </div>
          </div>
        </div>

        {/* Motif et priorité */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Motif de la convocation</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Motif *</Label>
              <Select value={reason} onValueChange={(v) => setReason(v as ConvocationReason)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic_difficulty">Difficultés scolaires</SelectItem>
                  <SelectItem value="behavior_issue">Problème de comportement</SelectItem>
                  <SelectItem value="repeated_absences">Absences répétées</SelectItem>
                  <SelectItem value="attitude_problem">Problème d'attitude</SelectItem>
                  <SelectItem value="orientation">Orientation</SelectItem>
                  <SelectItem value="exclusion_risk">Risque d'exclusion</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priorité *</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as ConvocationPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Détails du rendez-vous</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !appointmentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appointmentDate ? format(appointmentDate, "PPP", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lieu *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bureau..."
              />
            </div>
          </div>
        </div>

        {/* Convocateur */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Convocateur</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="convener">Nom *</Label>
              <Input
                id="convener"
                value={convener}
                onChange={(e) => setConvener(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Fonction *</Label>
              <Select value={convenerRole} onValueChange={setConvenerRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Directeur">Directeur</SelectItem>
                  <SelectItem value="CPE">CPE</SelectItem>
                  <SelectItem value="Professeur Principal">Professeur Principal</SelectItem>
                  <SelectItem value="Conseiller d'Orientation">Conseiller d'Orientation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Template et message */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Message de convocation</h3>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Utiliser un modèle" />
              </SelectTrigger>
              <SelectContent>
                {availableTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {template.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={12}
            className="font-mono text-sm"
            placeholder="Saisir le message de convocation..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSubmit(false)}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
            <Button onClick={() => handleSubmit(true)}>
              <Send className="mr-2 h-4 w-4" />
              Envoyer maintenant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
