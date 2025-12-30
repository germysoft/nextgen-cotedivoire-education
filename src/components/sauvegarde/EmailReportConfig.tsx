import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Mail, 
  Plus, 
  X, 
  Send, 
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEtablissement } from "@/contexts/EtablissementContext";

interface EmailRecipient {
  email: string;
  role: string;
}

export function EmailReportConfig() {
  const { toast } = useToast();
  const { configuration } = useEtablissement();
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [frequency, setFrequency] = useState("weekly");
  const [sendDay, setSendDay] = useState("monday");
  const [sendTime, setSendTime] = useState("08:00");
  const [recipients, setRecipients] = useState<EmailRecipient[]>([
    { email: "admin@ecole.ci", role: "Administrateur" },
    { email: "directeur@ecole.ci", role: "Directeur" }
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Administrateur");
  const [isSending, setIsSending] = useState(false);
  
  const [reportContent, setReportContent] = useState({
    statistics: true,
    storageInfo: true,
    backupHistory: true,
    alerts: true,
    configuration: false
  });

  const addRecipient = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      return;
    }

    if (recipients.some(r => r.email === newEmail)) {
      toast({
        title: "Email déjà ajouté",
        description: "Cette adresse email est déjà dans la liste.",
        variant: "destructive"
      });
      return;
    }

    setRecipients([...recipients, { email: newEmail, role: newRole }]);
    setNewEmail("");
    toast({
      title: "Destinataire ajouté",
      description: `${newEmail} recevra les rapports de sauvegarde.`
    });
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r.email !== email));
  };

  const sendTestReport = async () => {
    setIsSending(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    toast({
      title: "Rapport de test envoyé",
      description: `Un rapport de test a été envoyé à ${recipients.length} destinataire(s).`,
    });
  };

  const getFrequencyLabel = () => {
    switch (frequency) {
      case "daily":
        return `Tous les jours à ${sendTime}`;
      case "weekly":
        const days: Record<string, string> = {
          monday: "lundi",
          tuesday: "mardi",
          wednesday: "mercredi",
          thursday: "jeudi",
          friday: "vendredi",
          saturday: "samedi",
          sunday: "dimanche"
        };
        return `Chaque ${days[sendDay]} à ${sendTime}`;
      case "monthly":
        return `Le 1er de chaque mois à ${sendTime}`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Envoi automatique des rapports</CardTitle>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
          <CardDescription>
            Recevez automatiquement les rapports de sauvegarde par email
          </CardDescription>
        </CardHeader>
      </Card>

      {isEnabled && (
        <>
          {/* Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Planification des envois
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Fréquence</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {frequency === "weekly" && (
                  <div className="space-y-2">
                    <Label>Jour d'envoi</Label>
                    <Select value={sendDay} onValueChange={setSendDay}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Lundi</SelectItem>
                        <SelectItem value="tuesday">Mardi</SelectItem>
                        <SelectItem value="wednesday">Mercredi</SelectItem>
                        <SelectItem value="thursday">Jeudi</SelectItem>
                        <SelectItem value="friday">Vendredi</SelectItem>
                        <SelectItem value="saturday">Samedi</SelectItem>
                        <SelectItem value="sunday">Dimanche</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Heure d'envoi</Label>
                  <Input 
                    type="time" 
                    value={sendTime}
                    onChange={(e) => setSendTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <Clock className="h-4 w-4" />
                <span>{getFrequencyLabel()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Destinataires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="email@exemple.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrateur">Administrateur</SelectItem>
                    <SelectItem value="Directeur">Directeur</SelectItem>
                    <SelectItem value="Responsable IT">Responsable IT</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addRecipient}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {recipients.map((recipient) => (
                  <div 
                    key={recipient.email}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{recipient.email}</p>
                        <p className="text-sm text-muted-foreground">{recipient.role}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeRecipient(recipient.email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {recipients.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun destinataire configuré</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Contenu du rapport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="statistics"
                    checked={reportContent.statistics}
                    onCheckedChange={(checked) => 
                      setReportContent({...reportContent, statistics: checked as boolean})
                    }
                  />
                  <Label htmlFor="statistics" className="cursor-pointer">
                    Statistiques générales
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="storageInfo"
                    checked={reportContent.storageInfo}
                    onCheckedChange={(checked) => 
                      setReportContent({...reportContent, storageInfo: checked as boolean})
                    }
                  />
                  <Label htmlFor="storageInfo" className="cursor-pointer">
                    Informations stockage
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="backupHistory"
                    checked={reportContent.backupHistory}
                    onCheckedChange={(checked) => 
                      setReportContent({...reportContent, backupHistory: checked as boolean})
                    }
                  />
                  <Label htmlFor="backupHistory" className="cursor-pointer">
                    Historique des sauvegardes
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="alerts"
                    checked={reportContent.alerts}
                    onCheckedChange={(checked) => 
                      setReportContent({...reportContent, alerts: checked as boolean})
                    }
                  />
                  <Label htmlFor="alerts" className="cursor-pointer">
                    Alertes et avertissements
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="configuration"
                    checked={reportContent.configuration}
                    onCheckedChange={(checked) => 
                      setReportContent({...reportContent, configuration: checked as boolean})
                    }
                  />
                  <Label htmlFor="configuration" className="cursor-pointer">
                    Configuration actuelle
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test & Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Configuration active</p>
                    <p className="text-sm text-muted-foreground">
                      Prochain envoi: {getFrequencyLabel()}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={sendTestReport}
                  disabled={isSending || recipients.length === 0}
                >
                  {isSending ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer un test
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Mode démonstration
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    L'envoi d'emails nécessite une configuration backend. Cette interface simule le comportement 
                    pour vous permettre de configurer les paramètres.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
