import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentAlert } from "@/types/convocation";
import { AlertTriangle, UserX, Calendar, TrendingDown, MessageSquareWarning } from "lucide-react";

interface StudentAlertCardProps {
  alert: StudentAlert;
  onCreateConvocation: (alert: StudentAlert) => void;
}

const reasonLabels: Record<string, string> = {
  academic_difficulty: "Difficultés scolaires",
  behavior_issue: "Problème de comportement",
  repeated_absences: "Absences répétées",
  attitude_problem: "Problème d'attitude",
  orientation: "Orientation",
  exclusion_risk: "Risque d'exclusion",
  other: "Autre",
};

const reasonIcons: Record<string, React.ReactNode> = {
  academic_difficulty: <TrendingDown className="h-4 w-4" />,
  behavior_issue: <MessageSquareWarning className="h-4 w-4" />,
  repeated_absences: <UserX className="h-4 w-4" />,
  attitude_problem: <AlertTriangle className="h-4 w-4" />,
  orientation: <Calendar className="h-4 w-4" />,
  exclusion_risk: <AlertTriangle className="h-4 w-4" />,
  other: <AlertTriangle className="h-4 w-4" />,
};

const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

const severityLabels: Record<string, string> = {
  low: "Faible",
  medium: "Moyenne",
  high: "Élevée",
  urgent: "Urgente",
};

export function StudentAlertCard({ alert, onCreateConvocation }: StudentAlertCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {reasonIcons[alert.alertType]}
              {alert.studentName}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{alert.className}</span>
              <span>•</span>
              <span>{alert.studentNumber}</span>
            </div>
          </div>
          <Badge className={severityColors[alert.severity]} variant="outline">
            {severityLabels[alert.severity]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">{reasonLabels[alert.alertType]}</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            {alert.details.academicAverage !== undefined && (
              <div className="flex justify-between">
                <span>Moyenne générale</span>
                <span className={alert.details.academicAverage < 10 ? "text-red-600 font-semibold" : ""}>
                  {alert.details.academicAverage.toFixed(2)}/20
                </span>
              </div>
            )}
            {alert.details.absenceCount !== undefined && (
              <div className="flex justify-between">
                <span>Absences</span>
                <span className={alert.details.absenceCount > 10 ? "text-red-600 font-semibold" : ""}>
                  {alert.details.absenceCount} jour(s)
                </span>
              </div>
            )}
            {alert.details.tardinessCount !== undefined && (
              <div className="flex justify-between">
                <span>Retards</span>
                <span>{alert.details.tardinessCount}</span>
              </div>
            )}
            {alert.details.disciplinePoints !== undefined && (
              <div className="flex justify-between">
                <span>Points discipline</span>
                <span className={alert.details.disciplinePoints < 70 ? "text-red-600 font-semibold" : ""}>
                  {alert.details.disciplinePoints}/100
                </span>
              </div>
            )}
          </div>
        </div>

        {alert.details.failingSubjects && alert.details.failingSubjects.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Matières en échec</p>
            <div className="flex flex-wrap gap-1">
              {alert.details.failingSubjects.map((subject, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {alert.details.recentIncidents && alert.details.recentIncidents.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Incidents récents</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {alert.details.recentIncidents.map((incident, idx) => (
                <li key={idx}>• {incident}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Détecté le {new Date(alert.detectionDate).toLocaleDateString('fr-FR')}
          </span>
          <Button size="sm" onClick={() => onCreateConvocation(alert)}>
            Convoquer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
