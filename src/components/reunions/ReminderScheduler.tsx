import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  Clock,
  Calendar,
  Bell,
  BellRing,
  Send,
  Pause,
  Play,
  Settings,
  History,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Timer,
  Zap,
  ChevronRight
} from 'lucide-react';
import { format, addDays, isAfter, isBefore, differenceInDays, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ScheduledReminder {
  id: string;
  documentId: string;
  documentTitle: string;
  recipientName: string;
  recipientEmail: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  createdAt: string;
  sentAt?: string;
  reminderNumber: number;
}

interface SchedulerConfig {
  enabled: boolean;
  firstReminderDays: number;
  subsequentIntervalDays: number;
  maxReminders: number;
  sendTimeHour: number;
  excludeWeekends: boolean;
  pausedUntil?: string;
}

interface ReminderSchedulerProps {
  documentId: string;
  documentTitle: string;
  pendingSigners: {
    name: string;
    email: string;
    role: string;
  }[];
  onSendReminder?: (signerEmail: string, signerName: string) => void;
}

const SCHEDULER_CONFIG_KEY = 'reminder_scheduler_config';
const SCHEDULED_REMINDERS_KEY = 'scheduled_reminders';

export const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({
  documentId,
  documentTitle,
  pendingSigners,
  onSendReminder,
}) => {
  const [config, setConfig] = useState<SchedulerConfig>({
    enabled: true,
    firstReminderDays: 3,
    subsequentIntervalDays: 2,
    maxReminders: 3,
    sendTimeHour: 9,
    excludeWeekends: true,
  });
  
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load config and scheduled reminders
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem(SCHEDULER_CONFIG_KEY);
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }

      const storedReminders = localStorage.getItem(SCHEDULED_REMINDERS_KEY);
      if (storedReminders) {
        const allReminders = JSON.parse(storedReminders);
        setScheduledReminders(allReminders.filter((r: ScheduledReminder) => r.documentId === documentId));
      }
    } catch (e) {
      console.error('Error loading scheduler data:', e);
    }
  }, [documentId]);

  // Save config
  const saveConfig = (newConfig: SchedulerConfig) => {
    localStorage.setItem(SCHEDULER_CONFIG_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
    toast.success('Configuration sauvegardée');
  };

  // Save scheduled reminders
  const saveReminders = useCallback((reminders: ScheduledReminder[]) => {
    const storedReminders = localStorage.getItem(SCHEDULED_REMINDERS_KEY);
    const allReminders: ScheduledReminder[] = storedReminders ? JSON.parse(storedReminders) : [];
    
    // Replace reminders for this document
    const updatedReminders = [
      ...allReminders.filter(r => r.documentId !== documentId),
      ...reminders,
    ];
    
    localStorage.setItem(SCHEDULED_REMINDERS_KEY, JSON.stringify(updatedReminders));
    setScheduledReminders(reminders);
  }, [documentId]);

  // Calculate next send date
  const calculateNextSendDate = (baseDate: Date, daysToAdd: number): Date => {
    let nextDate = addDays(baseDate, daysToAdd);
    
    if (config.excludeWeekends) {
      const dayOfWeek = nextDate.getDay();
      if (dayOfWeek === 0) nextDate = addDays(nextDate, 1); // Sunday -> Monday
      if (dayOfWeek === 6) nextDate = addDays(nextDate, 2); // Saturday -> Monday
    }
    
    // Set send time
    nextDate.setHours(config.sendTimeHour, 0, 0, 0);
    
    return nextDate;
  };

  // Schedule reminders for all pending signers
  const scheduleAllReminders = () => {
    if (!config.enabled) {
      toast.error('Le planificateur est désactivé');
      return;
    }

    setProcessing(true);
    const now = new Date();
    const newReminders: ScheduledReminder[] = [];

    pendingSigners.forEach(signer => {
      // Check existing reminders for this signer
      const existingReminders = scheduledReminders.filter(
        r => r.recipientEmail === signer.email && r.status !== 'cancelled'
      );
      const sentCount = existingReminders.filter(r => r.status === 'sent').length;
      
      if (sentCount >= config.maxReminders) {
        return; // Max reminders reached
      }

      // Schedule first reminder
      const firstSendDate = calculateNextSendDate(now, config.firstReminderDays);
      
      for (let i = sentCount; i < config.maxReminders; i++) {
        const daysToAdd = i === 0 
          ? config.firstReminderDays 
          : config.firstReminderDays + (i * config.subsequentIntervalDays);
        
        const sendDate = calculateNextSendDate(now, daysToAdd);
        
        // Check if already scheduled
        const alreadyScheduled = existingReminders.find(
          r => r.reminderNumber === i + 1 && r.status === 'pending'
        );
        
        if (!alreadyScheduled) {
          newReminders.push({
            id: `reminder-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            documentId,
            documentTitle,
            recipientName: signer.name,
            recipientEmail: signer.email,
            scheduledFor: sendDate.toISOString(),
            status: 'pending',
            createdAt: now.toISOString(),
            reminderNumber: i + 1,
          });
        }
      }
    });

    const updatedReminders = [...scheduledReminders, ...newReminders];
    saveReminders(updatedReminders);
    
    setProcessing(false);
    toast.success(`${newReminders.length} rappel(s) programmé(s)`);
  };

  // Process due reminders (simulated - in real app would be server-side)
  const processDueReminders = useCallback(() => {
    const now = new Date();
    let processedCount = 0;

    const updatedReminders = scheduledReminders.map(reminder => {
      if (reminder.status === 'pending' && isBefore(new Date(reminder.scheduledFor), now)) {
        // Simulate sending
        if (onSendReminder) {
          onSendReminder(reminder.recipientEmail, reminder.recipientName);
        }
        processedCount++;
        return {
          ...reminder,
          status: 'sent' as const,
          sentAt: now.toISOString(),
        };
      }
      return reminder;
    });

    if (processedCount > 0) {
      saveReminders(updatedReminders);
      toast.info(`${processedCount} rappel(s) envoyé(s)`);
    }
  }, [scheduledReminders, saveReminders, onSendReminder]);

  // Check for due reminders periodically
  useEffect(() => {
    if (!config.enabled) return;

    const interval = setInterval(processDueReminders, 60000); // Check every minute
    processDueReminders(); // Initial check

    return () => clearInterval(interval);
  }, [config.enabled, processDueReminders]);

  // Cancel a reminder
  const cancelReminder = (reminderId: string) => {
    const updatedReminders = scheduledReminders.map(r =>
      r.id === reminderId ? { ...r, status: 'cancelled' as const } : r
    );
    saveReminders(updatedReminders);
    toast.success('Rappel annulé');
  };

  // Cancel all pending reminders
  const cancelAllPending = () => {
    const updatedReminders = scheduledReminders.map(r =>
      r.status === 'pending' ? { ...r, status: 'cancelled' as const } : r
    );
    saveReminders(updatedReminders);
    toast.success('Tous les rappels en attente ont été annulés');
  };

  // Pause scheduler
  const togglePause = () => {
    if (config.pausedUntil && isAfter(new Date(config.pausedUntil), new Date())) {
      // Resume
      saveConfig({ ...config, pausedUntil: undefined });
      toast.success('Planificateur repris');
    } else {
      // Pause for 24 hours
      const pauseUntil = addDays(new Date(), 1);
      saveConfig({ ...config, pausedUntil: pauseUntil.toISOString() });
      toast.info('Planificateur en pause pour 24h');
    }
  };

  const pendingReminders = scheduledReminders.filter(r => r.status === 'pending');
  const sentReminders = scheduledReminders.filter(r => r.status === 'sent');
  const isPaused = config.pausedUntil && isAfter(new Date(config.pausedUntil), new Date());

  const getNextReminder = () => {
    const pending = pendingReminders.sort(
      (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );
    return pending[0];
  };

  const nextReminder = getNextReminder();

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="w-4 h-4" />
                Planificateur de rappels
              </CardTitle>
              <CardDescription>
                Envoi automatique programmé
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={config.enabled && !isPaused}
                onCheckedChange={(checked) => saveConfig({ ...config, enabled: checked })}
              />
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)}>
                <History className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowConfig(true)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Banner */}
          {isPaused ? (
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
              <Pause className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                En pause jusqu'au {format(new Date(config.pausedUntil!), 'dd/MM à HH:mm', { locale: fr })}
              </AlertDescription>
            </Alert>
          ) : !config.enabled ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Le planificateur est désactivé
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{pendingReminders.length}</p>
              <p className="text-xs text-muted-foreground">En attente</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-green-600">{sentReminders.length}</p>
              <p className="text-xs text-muted-foreground">Envoyés</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{pendingSigners.length}</p>
              <p className="text-xs text-muted-foreground">Signataires</p>
            </div>
          </div>

          {/* Next Reminder */}
          {nextReminder && (
            <div className="p-3 rounded-lg border bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Prochain rappel</span>
                </div>
                <Badge variant="outline">
                  {format(new Date(nextReminder.scheduledFor), 'dd/MM à HH:mm', { locale: fr })}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Pour {nextReminder.recipientName} ({nextReminder.reminderNumber}/{config.maxReminders})
              </p>
              <div className="mt-2">
                <Progress 
                  value={(differenceInHours(new Date(), new Date(nextReminder.createdAt)) / 
                    differenceInHours(new Date(nextReminder.scheduledFor), new Date(nextReminder.createdAt))) * 100} 
                  className="h-1"
                />
              </div>
            </div>
          )}

          {/* Pending Reminders List */}
          {pendingReminders.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Rappels programmés</p>
              <ScrollArea className="h-[120px]">
                <div className="space-y-2">
                  {pendingReminders
                    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
                    .slice(0, 5)
                    .map(reminder => (
                      <div 
                        key={reminder.id} 
                        className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{reminder.recipientName}</span>
                          <Badge variant="secondary" className="text-xs">
                            #{reminder.reminderNumber}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(reminder.scheduledFor), 'dd/MM HH:mm')}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => cancelReminder(reminder.id)}
                          >
                            <AlertTriangle className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={scheduleAllReminders} 
              disabled={!config.enabled || isPaused || processing}
              className="flex-1"
            >
              <Zap className="w-4 h-4 mr-1" />
              Programmer
            </Button>
            <Button
              variant="outline"
              onClick={togglePause}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            {pendingReminders.length > 0 && (
              <Button
                variant="outline"
                onClick={cancelAllPending}
              >
                Annuler tout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration du planificateur
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Premier rappel après (jours)</Label>
              <Select
                value={config.firstReminderDays.toString()}
                onValueChange={(v) => setConfig({ ...config, firstReminderDays: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 jour</SelectItem>
                  <SelectItem value="2">2 jours</SelectItem>
                  <SelectItem value="3">3 jours</SelectItem>
                  <SelectItem value="5">5 jours</SelectItem>
                  <SelectItem value="7">7 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Intervalle entre rappels (jours)</Label>
              <Select
                value={config.subsequentIntervalDays.toString()}
                onValueChange={(v) => setConfig({ ...config, subsequentIntervalDays: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 jour</SelectItem>
                  <SelectItem value="2">2 jours</SelectItem>
                  <SelectItem value="3">3 jours</SelectItem>
                  <SelectItem value="5">5 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nombre maximum de rappels</Label>
              <Select
                value={config.maxReminders.toString()}
                onValueChange={(v) => setConfig({ ...config, maxReminders: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 rappel</SelectItem>
                  <SelectItem value="2">2 rappels</SelectItem>
                  <SelectItem value="3">3 rappels</SelectItem>
                  <SelectItem value="5">5 rappels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Heure d'envoi</Label>
              <Select
                value={config.sendTimeHour.toString()}
                onValueChange={(v) => setConfig({ ...config, sendTimeHour: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">08:00</SelectItem>
                  <SelectItem value="9">09:00</SelectItem>
                  <SelectItem value="10">10:00</SelectItem>
                  <SelectItem value="14">14:00</SelectItem>
                  <SelectItem value="16">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Exclure les week-ends</Label>
                <p className="text-xs text-muted-foreground">
                  Ne pas envoyer samedi et dimanche
                </p>
              </div>
              <Switch
                checked={config.excludeWeekends}
                onCheckedChange={(checked) => setConfig({ ...config, excludeWeekends: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfig(false)}>
              Annuler
            </Button>
            <Button onClick={() => { saveConfig(config); setShowConfig(false); }}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Historique des rappels
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            {scheduledReminders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Aucun rappel programmé</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scheduledReminders
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(reminder => (
                    <div key={reminder.id} className="p-3 rounded-lg border bg-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{reminder.recipientName}</p>
                          <p className="text-xs text-muted-foreground">{reminder.recipientEmail}</p>
                        </div>
                        <Badge
                          variant={
                            reminder.status === 'sent' ? 'default' :
                            reminder.status === 'pending' ? 'secondary' :
                            reminder.status === 'cancelled' ? 'outline' : 'destructive'
                          }
                        >
                          {reminder.status === 'sent' ? 'Envoyé' :
                           reminder.status === 'pending' ? 'En attente' :
                           reminder.status === 'cancelled' ? 'Annulé' : 'Échec'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          Rappel #{reminder.reminderNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(reminder.scheduledFor), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      {reminder.sentAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Envoyé le {format(new Date(reminder.sentAt), 'dd/MM/yyyy à HH:mm')}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReminderScheduler;
