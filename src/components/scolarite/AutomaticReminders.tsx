import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  PlayCircle,
  PauseCircle,
  History,
  Settings,
  Send,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

// Types
interface ReminderRule {
  id: number;
  name: string;
  trigger: "before_deadline" | "after_deadline" | "specific_date";
  days: number;
  channels: ("sms" | "email")[];
  targetStatuses: string[];
  messageTemplate: string;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
}

interface ReminderHistory {
  id: number;
  ruleName: string;
  sentAt: string;
  channel: "sms" | "email";
  recipient: string;
  student: string;
  status: "sent" | "delivered" | "failed";
  message: string;
}

interface ScheduledReminder {
  id: number;
  student: string;
  parent: string;
  phone: string;
  email: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  scheduledFor: string;
  channel: "sms" | "email";
  ruleName: string;
}

// Mock data
const mockRules: ReminderRule[] = [
  {
    id: 1,
    name: "Rappel J-7 avant échéance",
    trigger: "before_deadline",
    days: 7,
    channels: ["sms", "email"],
    targetStatuses: ["en_cours"],
    messageTemplate: "Cher parent, nous vous rappelons que l'échéance de paiement de {montant} F pour {eleve} arrive dans 7 jours ({date}). Merci de procéder au règlement.",
    isActive: true,
    lastRun: "2024-02-08 08:00",
    nextRun: "2024-02-15 08:00"
  },
  {
    id: 2,
    name: "Rappel J-3 avant échéance",
    trigger: "before_deadline",
    days: 3,
    channels: ["sms"],
    targetStatuses: ["en_cours"],
    messageTemplate: "Rappel: Échéance de {montant} F pour {eleve} dans 3 jours. Contact: comptabilite@ecole.ci",
    isActive: true,
    lastRun: "2024-02-12 08:00",
    nextRun: "2024-02-15 08:00"
  },
  {
    id: 3,
    name: "Alerte retard J+5",
    trigger: "after_deadline",
    days: 5,
    channels: ["sms", "email"],
    targetStatuses: ["retard"],
    messageTemplate: "URGENT: Le paiement de {montant} F pour {eleve} est en retard de 5 jours. Veuillez régulariser rapidement pour éviter les pénalités.",
    isActive: true,
    lastRun: "2024-02-10 09:00",
    nextRun: "2024-02-15 09:00"
  },
  {
    id: 4,
    name: "Alerte critique J+15",
    trigger: "after_deadline",
    days: 15,
    channels: ["sms", "email"],
    targetStatuses: ["retard", "critique"],
    messageTemplate: "ATTENTION: Impayé de {montant} F pour {eleve} depuis 15 jours. Risque d'exclusion. Contactez la direction immédiatement.",
    isActive: true,
    lastRun: "2024-02-05 10:00",
    nextRun: "2024-02-20 10:00"
  },
  {
    id: 5,
    name: "Rappel mensuel solde restant",
    trigger: "specific_date",
    days: 1,
    channels: ["email"],
    targetStatuses: ["en_cours", "retard"],
    messageTemplate: "Récapitulatif mensuel: Solde restant pour {eleve}: {montant} F. Prochaine échéance: {date}.",
    isActive: false,
    lastRun: "2024-02-01 07:00",
    nextRun: "2024-03-01 07:00"
  }
];

const mockHistory: ReminderHistory[] = [
  { id: 1, ruleName: "Rappel J-7 avant échéance", sentAt: "2024-02-08 08:01", channel: "sms", recipient: "+225 07 12 34 56", student: "Kouamé Aya", status: "delivered", message: "Rappel: Échéance de 75,000 F dans 7 jours." },
  { id: 2, ruleName: "Rappel J-7 avant échéance", sentAt: "2024-02-08 08:01", channel: "email", recipient: "parent.kouame@email.ci", student: "Kouamé Aya", status: "delivered", message: "Rappel échéance de paiement..." },
  { id: 3, ruleName: "Alerte retard J+5", sentAt: "2024-02-10 09:02", channel: "sms", recipient: "+225 05 98 76 54", student: "Traoré Ibrahim", status: "delivered", message: "URGENT: Paiement en retard..." },
  { id: 4, ruleName: "Alerte retard J+5", sentAt: "2024-02-10 09:02", channel: "email", recipient: "traore.famille@email.ci", student: "Traoré Ibrahim", status: "sent", message: "URGENT: Le paiement est en retard..." },
  { id: 5, ruleName: "Alerte critique J+15", sentAt: "2024-02-05 10:03", channel: "sms", recipient: "+225 01 23 45 67", student: "Diabaté Aminata", status: "delivered", message: "ATTENTION: Impayé depuis 15 jours..." },
  { id: 6, ruleName: "Alerte critique J+15", sentAt: "2024-02-05 10:03", channel: "email", recipient: "diabate.parent@email.ci", student: "Diabaté Aminata", status: "failed", message: "Échec d'envoi - adresse invalide" },
  { id: 7, ruleName: "Alerte critique J+15", sentAt: "2024-02-05 10:04", channel: "sms", recipient: "+225 07 89 01 23", student: "Sanogo Mariam", status: "delivered", message: "ATTENTION: Impayé depuis 31 jours..." },
];

const mockScheduled: ScheduledReminder[] = [
  { id: 1, student: "Kouamé Aya", parent: "M. Kouamé", phone: "+225 07 12 34 56", email: "parent.kouame@email.ci", amount: 75000, dueDate: "2024-02-15", daysOverdue: 0, scheduledFor: "2024-02-12 08:00", channel: "sms", ruleName: "Rappel J-3 avant échéance" },
  { id: 2, student: "Kouamé Aya", parent: "M. Kouamé", phone: "+225 07 12 34 56", email: "parent.kouame@email.ci", amount: 75000, dueDate: "2024-02-15", daysOverdue: 0, scheduledFor: "2024-02-12 08:00", channel: "email", ruleName: "Rappel J-3 avant échéance" },
  { id: 3, student: "Koné Mamadou", parent: "Mme Koné", phone: "+225 01 45 67 89", email: "kone.famille@email.ci", amount: 137500, dueDate: "2024-02-20", daysOverdue: 0, scheduledFor: "2024-02-13 08:00", channel: "sms", ruleName: "Rappel J-7 avant échéance" },
  { id: 4, student: "Traoré Ibrahim", parent: "M. Traoré", phone: "+225 05 98 76 54", email: "traore.famille@email.ci", amount: 75000, dueDate: "2024-02-10", daysOverdue: 5, scheduledFor: "2024-02-15 09:00", channel: "sms", ruleName: "Alerte retard J+5" },
  { id: 5, student: "Ouattara Seydou", parent: "Mme Ouattara", phone: "+225 07 65 43 21", email: "ouattara@email.ci", amount: 75000, dueDate: "2024-02-25", daysOverdue: 0, scheduledFor: "2024-02-18 08:00", channel: "sms", ruleName: "Rappel J-7 avant échéance" },
];

export default function AutomaticReminders() {
  const [rules, setRules] = useState<ReminderRule[]>(mockRules);
  const [history] = useState<ReminderHistory[]>(mockHistory);
  const [scheduled, setScheduled] = useState<ScheduledReminder[]>(mockScheduled);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<ReminderRule | null>(null);
  const [activeTab, setActiveTab] = useState<"rules" | "scheduled" | "history">("rules");
  
  // Form state for new/edit rule
  const [formData, setFormData] = useState({
    name: "",
    trigger: "before_deadline" as ReminderRule["trigger"],
    days: 7,
    channelSms: true,
    channelEmail: true,
    targetEnCours: true,
    targetRetard: false,
    targetCritique: false,
    messageTemplate: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      trigger: "before_deadline",
      days: 7,
      channelSms: true,
      channelEmail: true,
      targetEnCours: true,
      targetRetard: false,
      targetCritique: false,
      messageTemplate: ""
    });
    setEditingRule(null);
  };

  const handleEditRule = (rule: ReminderRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      trigger: rule.trigger,
      days: rule.days,
      channelSms: rule.channels.includes("sms"),
      channelEmail: rule.channels.includes("email"),
      targetEnCours: rule.targetStatuses.includes("en_cours"),
      targetRetard: rule.targetStatuses.includes("retard"),
      targetCritique: rule.targetStatuses.includes("critique"),
      messageTemplate: rule.messageTemplate
    });
    setShowRuleDialog(true);
  };

  const handleSaveRule = () => {
    const channels: ("sms" | "email")[] = [];
    if (formData.channelSms) channels.push("sms");
    if (formData.channelEmail) channels.push("email");

    const targetStatuses: string[] = [];
    if (formData.targetEnCours) targetStatuses.push("en_cours");
    if (formData.targetRetard) targetStatuses.push("retard");
    if (formData.targetCritique) targetStatuses.push("critique");

    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? {
        ...r,
        name: formData.name,
        trigger: formData.trigger,
        days: formData.days,
        channels,
        targetStatuses,
        messageTemplate: formData.messageTemplate
      } : r));
      toast.success("Règle modifiée avec succès");
    } else {
      const newRule: ReminderRule = {
        id: Date.now(),
        name: formData.name,
        trigger: formData.trigger,
        days: formData.days,
        channels,
        targetStatuses,
        messageTemplate: formData.messageTemplate,
        isActive: true,
        nextRun: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace("T", " ")
      };
      setRules(prev => [...prev, newRule]);
      toast.success("Règle créée avec succès");
    }
    setShowRuleDialog(false);
    resetForm();
  };

  const toggleRuleStatus = (ruleId: number) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
    const rule = rules.find(r => r.id === ruleId);
    toast.success(rule?.isActive ? "Règle désactivée" : "Règle activée");
  };

  const deleteRule = (ruleId: number) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    toast.success("Règle supprimée");
  };

  const cancelScheduledReminder = (id: number) => {
    setScheduled(prev => prev.filter(s => s.id !== id));
    toast.success("Rappel annulé");
  };

  const sendNow = (id: number) => {
    const reminder = scheduled.find(s => s.id === id);
    if (reminder) {
      setScheduled(prev => prev.filter(s => s.id !== id));
      toast.success(`Rappel envoyé à ${reminder.parent} (${reminder.channel.toUpperCase()})`);
    }
  };

  const getTriggerLabel = (trigger: ReminderRule["trigger"], days: number) => {
    switch (trigger) {
      case "before_deadline":
        return `${days} jours avant échéance`;
      case "after_deadline":
        return `${days} jours après échéance`;
      case "specific_date":
        return "Date spécifique (1er du mois)";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Délivré</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Envoyé</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Échec</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Stats
  const activeRules = rules.filter(r => r.isActive).length;
  const totalSent = history.length;
  const deliveryRate = Math.round((history.filter(h => h.status === "delivered").length / history.length) * 100);
  const pendingReminders = scheduled.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Règles Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeRules}/{rules.length}</div>
              <Settings className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rappels Programmés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{pendingReminders}</div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalSent}</div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux Délivrance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{deliveryRate}%</div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "rules" ? "default" : "ghost"}
          onClick={() => setActiveTab("rules")}
          className="rounded-b-none"
        >
          <Settings className="mr-2 h-4 w-4" />
          Règles de rappel
        </Button>
        <Button
          variant={activeTab === "scheduled" ? "default" : "ghost"}
          onClick={() => setActiveTab("scheduled")}
          className="rounded-b-none"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Programmés ({pendingReminders})
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          onClick={() => setActiveTab("history")}
          className="rounded-b-none"
        >
          <History className="mr-2 h-4 w-4" />
          Historique
        </Button>
      </div>

      {/* Rules Tab */}
      {activeTab === "rules" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Configuration des Règles de Rappel Automatique</CardTitle>
              <Dialog open={showRuleDialog} onOpenChange={(open) => {
                setShowRuleDialog(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Règle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingRule ? "Modifier la règle" : "Créer une nouvelle règle"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom de la règle</Label>
                        <Input 
                          value={formData.name}
                          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Rappel J-7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Déclencheur</Label>
                        <Select 
                          value={formData.trigger}
                          onValueChange={v => setFormData(prev => ({ ...prev, trigger: v as ReminderRule["trigger"] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="before_deadline">Avant l'échéance</SelectItem>
                            <SelectItem value="after_deadline">Après l'échéance (retard)</SelectItem>
                            <SelectItem value="specific_date">Date spécifique mensuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Nombre de jours</Label>
                      <Input 
                        type="number"
                        value={formData.days}
                        onChange={e => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) || 0 }))}
                        min={1}
                        max={60}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.trigger === "before_deadline" && `Envoi ${formData.days} jours avant la date d'échéance`}
                        {formData.trigger === "after_deadline" && `Envoi ${formData.days} jours après la date d'échéance (retard)`}
                        {formData.trigger === "specific_date" && `Envoi le ${formData.days}er de chaque mois`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Canaux d'envoi</Label>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={formData.channelSms}
                            onCheckedChange={v => setFormData(prev => ({ ...prev, channelSms: v }))}
                          />
                          <Label className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" /> SMS
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={formData.channelEmail}
                            onCheckedChange={v => setFormData(prev => ({ ...prev, channelEmail: v }))}
                          />
                          <Label className="flex items-center gap-1">
                            <Mail className="h-4 w-4" /> Email
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Statuts ciblés</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={formData.targetEnCours}
                            onCheckedChange={v => setFormData(prev => ({ ...prev, targetEnCours: v }))}
                          />
                          <Label>En cours</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={formData.targetRetard}
                            onCheckedChange={v => setFormData(prev => ({ ...prev, targetRetard: v }))}
                          />
                          <Label>En retard</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={formData.targetCritique}
                            onCheckedChange={v => setFormData(prev => ({ ...prev, targetCritique: v }))}
                          />
                          <Label>Critique</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Modèle de message</Label>
                      <Textarea 
                        value={formData.messageTemplate}
                        onChange={e => setFormData(prev => ({ ...prev, messageTemplate: e.target.value }))}
                        placeholder="Utilisez {eleve}, {montant}, {date} pour personnaliser..."
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Variables disponibles: {"{eleve}"}, {"{montant}"}, {"{date}"}, {"{classe}"}, {"{retard}"}
                      </p>
                    </div>

                    <Button onClick={handleSaveRule} className="w-full">
                      {editingRule ? "Enregistrer les modifications" : "Créer la règle"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Règle</TableHead>
                  <TableHead>Déclencheur</TableHead>
                  <TableHead>Canaux</TableHead>
                  <TableHead>Cibles</TableHead>
                  <TableHead>Dernière exécution</TableHead>
                  <TableHead>Prochaine exécution</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>{getTriggerLabel(rule.trigger, rule.days)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {rule.channels.includes("sms") && (
                          <Badge variant="outline" className="text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" /> SMS
                          </Badge>
                        )}
                        {rule.channels.includes("email") && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" /> Email
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {rule.targetStatuses.map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rule.lastRun || "-"}</TableCell>
                    <TableCell className="text-sm">{rule.nextRun || "-"}</TableCell>
                    <TableCell>
                      {rule.isActive ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          <PlayCircle className="h-3 w-3 mr-1" /> Actif
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <PauseCircle className="h-3 w-3 mr-1" /> Inactif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleRuleStatus(rule.id)}
                          title={rule.isActive ? "Désactiver" : "Activer"}
                        >
                          {rule.isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Tab */}
      {activeTab === "scheduled" && (
        <Card>
          <CardHeader>
            <CardTitle>Rappels Programmés</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduled.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun rappel programmé pour le moment</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Retard</TableHead>
                    <TableHead>Envoi prévu</TableHead>
                    <TableHead>Règle</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduled.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">{reminder.student}</TableCell>
                      <TableCell>{reminder.parent}</TableCell>
                      <TableCell>
                        {reminder.channel === "sms" ? (
                          <span className="flex items-center gap-1 text-sm">
                            <MessageSquare className="h-3 w-3" /> {reminder.phone}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" /> {reminder.email}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{reminder.amount.toLocaleString()} F</TableCell>
                      <TableCell>{reminder.dueDate}</TableCell>
                      <TableCell>
                        {reminder.daysOverdue > 0 ? (
                          <span className="text-red-600 font-medium">{reminder.daysOverdue} jours</span>
                        ) : (
                          <span className="text-green-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{reminder.scheduledFor}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{reminder.ruleName}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => sendNow(reminder.id)}
                          >
                            <Send className="h-4 w-4 mr-1" /> Envoyer maintenant
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => cancelScheduledReminder(reminder.id)}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Rappels Envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Règle</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm">{item.sentAt}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.ruleName}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.student}</TableCell>
                    <TableCell>
                      {item.channel === "sms" ? (
                        <Badge variant="secondary" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" /> SMS
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Mail className="h-3 w-3 mr-1" /> Email
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-mono">{item.recipient}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {item.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
