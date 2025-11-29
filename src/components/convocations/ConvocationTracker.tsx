import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Convocation, ConvocationStatus } from "@/types/convocation";
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  XCircle, 
  UserX,
  Eye,
  Download,
  Mail,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ConvocationTrackerProps {
  convocations: Convocation[];
  onViewDetails: (convocation: Convocation) => void;
  onDownloadPDF: (convocation: Convocation) => void;
  onSendReminder: (convocation: Convocation) => void;
  onUpdateStatus: (convocationId: string, status: ConvocationStatus) => void;
}

const statusConfig: Record<ConvocationStatus, { 
  label: string; 
  icon: React.ReactNode; 
  color: string;
}> = {
  pending: { 
    label: "En attente", 
    icon: <Clock className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
  },
  sent: { 
    label: "Envoyée", 
    icon: <Send className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
  },
  confirmed: { 
    label: "Confirmée", 
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  },
  completed: { 
    label: "Réalisée", 
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  },
  cancelled: { 
    label: "Annulée", 
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  },
  no_show: { 
    label: "Absent", 
    icon: <UserX className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
  },
};

const reasonLabels: Record<string, string> = {
  academic_difficulty: "Difficultés scolaires",
  behavior_issue: "Problème de comportement",
  repeated_absences: "Absences répétées",
  attitude_problem: "Problème d'attitude",
  orientation: "Orientation",
  exclusion_risk: "Risque d'exclusion",
  other: "Autre",
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export function ConvocationTracker({
  convocations,
  onViewDetails,
  onDownloadPDF,
  onSendReminder,
  onUpdateStatus,
}: ConvocationTrackerProps) {
  return (
    <div className="space-y-4">
      {convocations.map((conv) => {
        const statusInfo = statusConfig[conv.status];
        
        return (
          <Card key={conv.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base">{conv.studentName}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{conv.className}</span>
                    <span>•</span>
                    <span>{conv.parentName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[conv.priority]} variant="outline">
                    {conv.priority === 'urgent' ? 'Urgent' : conv.priority === 'high' ? 'Élevée' : conv.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                  <Badge className={statusInfo.color} variant="outline">
                    <span className="mr-1">{statusInfo.icon}</span>
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Motif</p>
                  <p className="font-medium">{reasonLabels[conv.reason]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Convocateur</p>
                  <p className="font-medium">{conv.convener} - {conv.convenerRole}</p>
                </div>
                {conv.appointmentDate && (
                  <>
                    <div>
                      <p className="text-muted-foreground mb-1">Date du RDV</p>
                      <p className="font-medium">
                        {format(new Date(conv.appointmentDate), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Heure et lieu</p>
                      <p className="font-medium">{conv.appointmentTime} - {conv.location}</p>
                    </div>
                  </>
                )}
                {conv.parentEmail && (
                  <div>
                    <p className="text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-xs">{conv.parentEmail}</p>
                  </div>
                )}
                {conv.parentPhone && (
                  <div>
                    <p className="text-muted-foreground mb-1">Téléphone</p>
                    <p className="font-medium">{conv.parentPhone}</p>
                  </div>
                )}
              </div>

              {conv.outcome && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Compte-rendu</p>
                  <p className="text-sm text-muted-foreground">{conv.outcome}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t gap-2 flex-wrap">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(conv)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Détails
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownloadPDF(conv)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>

                <div className="flex gap-2">
                  {conv.status === 'sent' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSendReminder(conv)}
                      >
                        {conv.parentEmail ? (
                          <Mail className="mr-2 h-4 w-4" />
                        ) : (
                          <MessageSquare className="mr-2 h-4 w-4" />
                        )}
                        Relancer
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(conv.id, 'confirmed')}
                      >
                        Confirmer
                      </Button>
                    </>
                  )}
                  {conv.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(conv.id, 'completed')}
                    >
                      Marquer comme réalisée
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
