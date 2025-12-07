import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  Send,
  Settings,
  History,
  CalendarClock,
  Smartphone
} from "lucide-react";
import { format, addDays, subHours } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ReminderRule {
  id: string;
  name: string;
  triggerTime: string; // "24h", "2h", "1h"
  channels: ('email' | 'sms')[];
  active: boolean;
  messageTemplate: string;
}

interface ScheduledReminder {
  id: string;
  appointmentId: string;
  teacherName: string;
  subject: string;
  appointmentDate: Date;
  appointmentTime: string;
  reminderTime: Date;
  channels: ('email' | 'sms')[];
  status: 'pending' | 'sent' | 'failed';
}

interface ReminderHistory {
  id: string;
  appointmentId: string;
  teacherName: string;
  sentAt: Date;
  channel: 'email' | 'sms';
  status: 'delivered' | 'failed';
  recipient: string;
}

const defaultRules: ReminderRule[] = [
  {
    id: "1",
    name: "Rappel 24h avant",
    triggerTime: "24h",
    channels: ['email'],
    active: true,
    messageTemplate: "Rappel: Vous avez un rendez-vous demain à {heure} avec {enseignant} ({matière}). Lieu: {lieu}."
  },
  {
    id: "2",
    name: "Rappel 2h avant",
    triggerTime: "2h",
    channels: ['sms'],
    active: true,
    messageTemplate: "RDV dans 2h avec {enseignant} - {matière}. Lieu: {lieu}. À bientôt!"
  },
  {
    id: "3",
    name: "Rappel 1h avant",
    triggerTime: "1h",
    channels: ['sms', 'email'],
    active: false,
    messageTemplate: "Dernier rappel: RDV dans 1h avec {enseignant}. N'oubliez pas!"
  }
];

const mockScheduledReminders: ScheduledReminder[] = [
  {
    id: "sr1",
    appointmentId: "apt1",
    teacherName: "M. Kouassi Jean",
    subject: "Mathématiques",
    appointmentDate: addDays(new Date(), 1),
    appointmentTime: "14:30",
    reminderTime: addDays(new Date(), 0),
    channels: ['email'],
    status: 'pending'
  },
  {
    id: "sr2",
    appointmentId: "apt1",
    teacherName: "M. Kouassi Jean",
    subject: "Mathématiques",
    appointmentDate: addDays(new Date(), 1),
    appointmentTime: "14:30",
    reminderTime: subHours(addDays(new Date(), 1), 2),
    channels: ['sms'],
    status: 'pending'
  },
  {
    id: "sr3",
    appointmentId: "apt2",
    teacherName: "Mme Bamba Aïcha",
    subject: "Français",
    appointmentDate: addDays(new Date(), 3),
    appointmentTime: "15:00",
    reminderTime: addDays(new Date(), 2),
    channels: ['email'],
    status: 'pending'
  }
];

const mockHistory: ReminderHistory[] = [
  {
    id: "h1",
    appointmentId: "apt-old1",
    teacherName: "M. Diallo Moussa",
    sentAt: subHours(new Date(), 48),
    channel: 'email',
    status: 'delivered',
    recipient: "parent@email.com"
  },
  {
    id: "h2",
    appointmentId: "apt-old1",
    teacherName: "M. Diallo Moussa",
    sentAt: subHours(new Date(), 26),
    channel: 'sms',
    status: 'delivered',
    recipient: "+225 07 XX XX XX"
  },
  {
    id: "h3",
    appointmentId: "apt-old2",
    teacherName: "Mme Koné Fatou",
    sentAt: subHours(new Date(), 72),
    channel: 'email',
    status: 'failed',
    recipient: "parent2@email.com"
  }
];

export default function AppointmentReminders() {
  const [rules, setRules] = useState<ReminderRule[]>(defaultRules);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>(mockScheduledReminders);
  const [history] = useState<ReminderHistory[]>(mockHistory);
  const [editingRule, setEditingRule] = useState<ReminderRule | null>(null);
  const [parentEmail, setParentEmail] = useState("parent@email.com");
  const [parentPhone, setParentPhone] = useState("+225 07 00 00 00");

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
    toast({
      title: "Règle mise à jour",
      description: "La configuration des rappels a été modifiée."
    });
  };

  const sendReminderNow = (reminder: ScheduledReminder) => {
    setScheduledReminders(scheduledReminders.map(r => 
      r.id === reminder.id ? { ...r, status: 'sent' as const } : r
    ));
    toast({
      title: "Rappel envoyé",
      description: `Rappel envoyé pour le RDV avec ${reminder.teacherName}.`
    });
  };

  const cancelReminder = (reminderId: string) => {
    setScheduledReminders(scheduledReminders.filter(r => r.id !== reminderId));
    toast({
      title: "Rappel annulé",
      description: "Le rappel programmé a été supprimé."
    });
  };

  const saveRule = () => {
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
      setEditingRule(null);
      toast({
        title: "Règle sauvegardée",
        description: "Les modifications ont été enregistrées."
      });
    }
  };

  const pendingReminders = scheduledReminders.filter(r => r.status === 'pending');
  const sentReminders = scheduledReminders.filter(r => r.status === 'sent');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Rappels de Rendez-vous</h2>
          <p className="text-muted-foreground">Configurez les notifications automatiques</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Bell className="h-3 w-3" />
            {pendingReminders.length} en attente
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            {sentReminders.length} envoyés
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Programmés ({pendingReminders.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="flex gap-2">
                  <MessageSquare className="h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+225 XX XX XX XX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reminder Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Règles de rappel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className={cn(
                    "p-4 border rounded-lg transition-colors",
                    rule.active ? "bg-card" : "bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rule.triggerTime} avant
                        </span>
                        <span className="flex items-center gap-2">
                          Canaux:
                          {rule.channels.includes('email') && (
                            <Badge variant="outline" className="text-xs">
                              <Mail className="h-3 w-3 mr-1" /> Email
                            </Badge>
                          )}
                          {rule.channels.includes('sms') && (
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" /> SMS
                            </Badge>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        "{rule.messageTemplate}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRule(rule)}
                      >
                        Modifier
                      </Button>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Edit Rule Dialog */}
          {editingRule && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Modifier la règle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de la règle</Label>
                    <Input
                      value={editingRule.name}
                      onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Délai avant RDV</Label>
                    <Select
                      value={editingRule.triggerTime}
                      onValueChange={(v) => setEditingRule({ ...editingRule, triggerTime: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="48h">48 heures</SelectItem>
                        <SelectItem value="24h">24 heures</SelectItem>
                        <SelectItem value="12h">12 heures</SelectItem>
                        <SelectItem value="2h">2 heures</SelectItem>
                        <SelectItem value="1h">1 heure</SelectItem>
                        <SelectItem value="30m">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Canaux de notification</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingRule.channels.includes('email')}
                        onChange={(e) => {
                          const channels = e.target.checked
                            ? [...editingRule.channels, 'email' as const]
                            : editingRule.channels.filter(c => c !== 'email');
                          setEditingRule({ ...editingRule, channels });
                        }}
                        className="rounded"
                      />
                      <Mail className="h-4 w-4" /> Email
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingRule.channels.includes('sms')}
                        onChange={(e) => {
                          const channels = e.target.checked
                            ? [...editingRule.channels, 'sms' as const]
                            : editingRule.channels.filter(c => c !== 'sms');
                          setEditingRule({ ...editingRule, channels });
                        }}
                        className="rounded"
                      />
                      <MessageSquare className="h-4 w-4" /> SMS
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Modèle de message</Label>
                  <Textarea
                    value={editingRule.messageTemplate}
                    onChange={(e) => setEditingRule({ ...editingRule, messageTemplate: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Variables: {'{enseignant}'}, {'{matière}'}, {'{heure}'}, {'{date}'}, {'{lieu}'}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingRule(null)}>
                    Annuler
                  </Button>
                  <Button onClick={saveRule}>
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Rappels programmés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingReminders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun rappel programmé
                </p>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {pendingReminders.map(reminder => (
                      <div
                        key={reminder.id}
                        className="p-4 border rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              RDV avec {reminder.teacherName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {reminder.subject} - {format(reminder.appointmentDate, "d MMMM", { locale: fr })} à {reminder.appointmentTime}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Rappel prévu: {format(reminder.reminderTime, "d MMM HH:mm", { locale: fr })}
                              </span>
                              {reminder.channels.map(ch => (
                                <Badge key={ch} variant="outline" className="text-xs">
                                  {ch === 'email' ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                                  {ch}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReminderNow(reminder)}
                            className="gap-1"
                          >
                            <Send className="h-3 w-3" />
                            Envoyer maintenant
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => cancelReminder(reminder.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des envois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {history.map(item => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          item.status === 'delivered' 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        )}>
                          {item.status === 'delivered' 
                            ? <CheckCircle className="h-4 w-4" />
                            : <XCircle className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            RDV avec {item.teacherName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{format(item.sentAt, "d MMM HH:mm", { locale: fr })}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.channel === 'email' ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                              {item.channel}
                            </Badge>
                            <span>→ {item.recipient}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={item.status === 'delivered' ? "default" : "destructive"}>
                        {item.status === 'delivered' ? "Livré" : "Échec"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">Mode démonstration</h4>
              <p className="text-sm text-muted-foreground">
                Les rappels sont simulés. Pour activer l'envoi réel d'emails et SMS, 
                connectez Lovable Cloud avec Resend (email) et Twilio (SMS).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
