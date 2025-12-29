import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Clock, Mail, Calendar, HardDrive, Bell, Save, 
  Plus, X, CheckCircle2, AlertTriangle, Settings2
} from "lucide-react";
import { toast } from "sonner";
import { useEtablissement } from "@/contexts/EtablissementContext";
import { ParametresSauvegarde } from "@/types/etablissement";

export default function BackupScheduler() {
  const { configuration, updateSection, isLocked } = useEtablissement();
  const [localConfig, setLocalConfig] = useState<ParametresSauvegarde>(
    configuration.parametresSauvegarde
  );
  const [newEmail, setNewEmail] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalConfig(configuration.parametresSauvegarde);
  }, [configuration.parametresSauvegarde]);

  const handleChange = (updates: Partial<ParametresSauvegarde>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Calculer la prochaine exécution
    const now = new Date();
    const [hours, minutes] = localConfig.heureExecution.split(':').map(Number);
    let nextExecution = new Date(now);
    nextExecution.setHours(hours, minutes, 0, 0);
    
    if (nextExecution <= now) {
      nextExecution.setDate(nextExecution.getDate() + 1);
    }

    const updatedConfig = {
      ...localConfig,
      prochainExecution: nextExecution.toISOString(),
    };

    updateSection('parametresSauvegarde', updatedConfig);
    setHasChanges(false);
    toast.success("Configuration de sauvegarde mise à jour");
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }
    if (localConfig.emailsNotification.includes(newEmail)) {
      toast.error("Cette adresse email est déjà dans la liste");
      return;
    }
    handleChange({
      emailsNotification: [...localConfig.emailsNotification, newEmail],
    });
    setNewEmail("");
    toast.success("Email ajouté à la liste de notification");
  };

  const removeEmail = (email: string) => {
    handleChange({
      emailsNotification: localConfig.emailsNotification.filter(e => e !== email),
    });
  };

  const getFrequenceLabel = () => {
    switch (localConfig.frequence) {
      case 'quotidienne':
        return `Tous les jours à ${localConfig.heureExecution}`;
      case 'hebdomadaire':
        const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return `Chaque ${jours[localConfig.jourExecution || 0]} à ${localConfig.heureExecution}`;
      case 'mensuelle':
        return `Le ${localConfig.jourExecution || 1} de chaque mois à ${localConfig.heureExecution}`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Planification des Sauvegardes Automatiques
              </CardTitle>
              <CardDescription>
                Configurez les sauvegardes automatiques et les notifications par email
              </CardDescription>
            </div>
            {hasChanges && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Modifications non sauvegardées
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activation */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Sauvegarde automatique</Label>
              <p className="text-sm text-muted-foreground">
                Activer les sauvegardes automatiques programmées
              </p>
            </div>
            <Switch
              checked={localConfig.sauvegardeAutoActive}
              onCheckedChange={(checked) => handleChange({ sauvegardeAutoActive: checked })}
              disabled={isLocked}
            />
          </div>

          {localConfig.sauvegardeAutoActive && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fréquence */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fréquence
                  </Label>
                  <Select
                    value={localConfig.frequence}
                    onValueChange={(value: 'quotidienne' | 'hebdomadaire' | 'mensuelle') => 
                      handleChange({ frequence: value })
                    }
                    disabled={isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quotidienne">Quotidienne</SelectItem>
                      <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                      <SelectItem value="mensuelle">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Heure d'exécution */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure d'exécution
                  </Label>
                  <Input
                    type="time"
                    value={localConfig.heureExecution}
                    onChange={(e) => handleChange({ heureExecution: e.target.value })}
                    disabled={isLocked}
                  />
                </div>

                {/* Jour de la semaine (hebdomadaire) */}
                {localConfig.frequence === 'hebdomadaire' && (
                  <div className="space-y-2">
                    <Label>Jour de la semaine</Label>
                    <Select
                      value={String(localConfig.jourExecution || 0)}
                      onValueChange={(value) => handleChange({ jourExecution: parseInt(value) })}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Dimanche</SelectItem>
                        <SelectItem value="1">Lundi</SelectItem>
                        <SelectItem value="2">Mardi</SelectItem>
                        <SelectItem value="3">Mercredi</SelectItem>
                        <SelectItem value="4">Jeudi</SelectItem>
                        <SelectItem value="5">Vendredi</SelectItem>
                        <SelectItem value="6">Samedi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Jour du mois (mensuelle) */}
                {localConfig.frequence === 'mensuelle' && (
                  <div className="space-y-2">
                    <Label>Jour du mois</Label>
                    <Select
                      value={String(localConfig.jourExecution || 1)}
                      onValueChange={(value) => handleChange({ jourExecution: parseInt(value) })}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Rétention */}
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Rétention
                    </span>
                    <span className="text-muted-foreground">{localConfig.retentionJours} jours</span>
                  </Label>
                  <Slider
                    value={[localConfig.retentionJours]}
                    onValueChange={(value) => handleChange({ retentionJours: value[0] })}
                    min={7}
                    max={90}
                    step={7}
                    disabled={isLocked}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inclureMedias">Inclure les médias (images, documents)</Label>
                  <Switch
                    id="inclureMedias"
                    checked={localConfig.inclureMedias}
                    onCheckedChange={(checked) => handleChange({ inclureMedias: checked })}
                    disabled={isLocked}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compression">Compression activée</Label>
                  <Switch
                    id="compression"
                    checked={localConfig.compressionActivee}
                    onCheckedChange={(checked) => handleChange({ compressionActivee: checked })}
                    disabled={isLocked}
                  />
                </div>
              </div>

              {/* Résumé */}
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Planification configurée</AlertTitle>
                <AlertDescription>
                  {getFrequenceLabel()} • Conservation pendant {localConfig.retentionJours} jours
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notifications Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notifications par Email
          </CardTitle>
          <CardDescription>
            Recevez des alertes par email après chaque sauvegarde
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Notifications email</Label>
              <p className="text-sm text-muted-foreground">
                Envoyer un rapport après chaque sauvegarde
              </p>
            </div>
            <Switch
              checked={localConfig.notificationEmail}
              onCheckedChange={(checked) => handleChange({ notificationEmail: checked })}
              disabled={isLocked}
            />
          </div>

          {localConfig.notificationEmail && (
            <>
              <div className="space-y-2">
                <Label>Ajouter une adresse email</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="admin@etablissement.ci"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={isLocked}
                    onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                  />
                  <Button onClick={addEmail} disabled={isLocked || !newEmail}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {localConfig.emailsNotification.length > 0 ? (
                <div className="space-y-2">
                  <Label>Destinataires ({localConfig.emailsNotification.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {localConfig.emailsNotification.map((email) => (
                      <Badge
                        key={email}
                        variant="secondary"
                        className="flex items-center gap-1 py-1.5 px-3"
                      >
                        <Mail className="h-3 w-3" />
                        {email}
                        <button
                          onClick={() => removeEmail(email)}
                          disabled={isLocked}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Aucun destinataire</AlertTitle>
                  <AlertDescription>
                    Ajoutez au moins une adresse email pour recevoir les notifications
                  </AlertDescription>
                </Alert>
              )}

              <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Contenu des notifications
                    </p>
                    <ul className="mt-1 text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Statut de la sauvegarde (succès/échec)</li>
                      <li>• Taille de la sauvegarde</li>
                      <li>• Durée d'exécution</li>
                      <li>• Espace disque restant</li>
                      <li>• Nombre de fichiers sauvegardés</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={isLocked || !hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder la configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
