import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Bell, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  Settings,
  History
} from 'lucide-react';
import { SignatureRequirement } from './SignatureManager';
import { ElectronicSignature } from './ReunionPDFGenerator';
import { useNotifications } from '@/contexts/NotificationsContext';

interface SignatureNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  documentId: string;
  documentTitle: string;
  type: 'initial' | 'reminder';
  sentAt: string;
  status: 'pending' | 'sent' | 'opened' | 'signed';
  reminderCount: number;
}

interface ReminderSettings {
  autoReminders: boolean;
  reminderIntervalDays: number;
  maxReminders: number;
  emailTemplate: 'standard' | 'urgent' | 'friendly';
}

interface SignatureNotificationsProps {
  documentId: string;
  documentTitle: string;
  requirements: SignatureRequirement[];
  signatures: ElectronicSignature[];
  participantEmails: { [name: string]: string };
  onUpdateEmails: (emails: { [name: string]: string }) => void;
}

const STORAGE_KEY = 'signature_notifications';
const SETTINGS_KEY = 'signature_reminder_settings';

export const SignatureNotifications: React.FC<SignatureNotificationsProps> = ({
  documentId,
  documentTitle,
  requirements,
  signatures,
  participantEmails,
  onUpdateEmails,
}) => {
  const { addNotification } = useNotifications();
  const [notifications, setNotifications] = useState<SignatureNotification[]>([]);
  const [settings, setSettings] = useState<ReminderSettings>({
    autoReminders: true,
    reminderIntervalDays: 3,
    maxReminders: 3,
    emailTemplate: 'standard',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState('');

  // Load notifications and settings from localStorage
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem(STORAGE_KEY);
      if (storedNotifications) {
        const allNotifications = JSON.parse(storedNotifications);
        setNotifications(allNotifications.filter((n: SignatureNotification) => n.documentId === documentId));
      }
      
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  }, [documentId]);

  // Save notifications to localStorage
  const saveNotifications = (newNotifications: SignatureNotification[]) => {
    try {
      const storedNotifications = localStorage.getItem(STORAGE_KEY);
      const allNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      
      // Remove old notifications for this document and add new ones
      const updatedNotifications = [
        ...allNotifications.filter((n: SignatureNotification) => n.documentId !== documentId),
        ...newNotifications,
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
      setNotifications(newNotifications);
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  };

  // Save settings to localStorage
  const saveSettings = (newSettings: ReminderSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  // Check for pending signatures
  const getPendingSignatures = () => {
    return requirements.filter(req => {
      const signed = signatures.find(
        sig => sig.signerRole === req.role && sig.signerName === req.name
      );
      return !signed;
    });
  };

  // Generate signature link using public signing page
  const generateSignatureLink = (signerName: string, signerRole: string, email: string) => {
    // Generate public signing URL with token
    const tokenId = `sign-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    const token = {
      id: tokenId,
      documentId,
      documentTitle,
      signerName,
      signerRole,
      signerEmail: email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      signed: false,
    };
    
    // Store token in localStorage
    const storedTokens = localStorage.getItem('public_signing_tokens');
    const tokens = storedTokens ? JSON.parse(storedTokens) : [];
    tokens.push(token);
    localStorage.setItem('public_signing_tokens', JSON.stringify(tokens));
    
    return `${window.location.origin}/signature-publique?token=${tokenId}`;
  };

  // Send notification
  const sendNotification = (requirement: SignatureRequirement, isReminder: boolean = false) => {
    const email = participantEmails[requirement.name];
    
    if (!email) {
      toast.error(`Email non configuré pour ${requirement.name}`);
      return;
    }

    const existingNotification = notifications.find(
      n => n.recipientName === requirement.name && n.type === 'initial'
    );

    const newNotification: SignatureNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      recipientEmail: email,
      recipientName: requirement.name,
      documentId,
      documentTitle,
      type: isReminder ? 'reminder' : 'initial',
      sentAt: new Date().toISOString(),
      status: 'sent',
      reminderCount: existingNotification ? existingNotification.reminderCount + 1 : 0,
    };

    // Generate email content
    const signatureLink = generateSignatureLink(requirement.name, requirement.role, email);
    const emailSubject = isReminder 
      ? `[Rappel] Signature requise - ${documentTitle}`
      : `Signature requise - ${documentTitle}`;
    
    const emailBody = getEmailBody(requirement.name, isReminder, signatureLink);
    
    // Open mailto link
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Save notification
    const updatedNotifications = [
      ...notifications.filter(n => !(n.recipientName === requirement.name && n.type === newNotification.type)),
      newNotification,
    ];
    saveNotifications(updatedNotifications);

    // Add to notification center
    addNotification({
      type: 'message',
      title: isReminder ? 'Rappel envoyé' : 'Demande de signature envoyée',
      message: `Email envoyé à ${requirement.name}`,
      priority: 'medium',
    });

    toast.success(`${isReminder ? 'Rappel' : 'Demande'} envoyé à ${requirement.name}`);
  };

  // Get email body based on template
  const getEmailBody = (signerName: string, isReminder: boolean, link: string): string => {
    const templates = {
      standard: isReminder
        ? `Bonjour ${signerName},\n\nCeci est un rappel concernant la signature du document "${documentTitle}".\n\nVotre signature est toujours en attente. Merci de bien vouloir signer le document dès que possible.\n\nLien de signature : ${link}\n\nCordialement,\nL'équipe administrative`
        : `Bonjour ${signerName},\n\nVous êtes invité(e) à signer le document "${documentTitle}".\n\nMerci de cliquer sur le lien ci-dessous pour apposer votre signature électronique :\n\n${link}\n\nCordialement,\nL'équipe administrative`,
      urgent: isReminder
        ? `URGENT - Bonjour ${signerName},\n\nVotre signature sur le document "${documentTitle}" est toujours en attente.\n\nMerci de signer ce document dans les plus brefs délais.\n\nLien de signature : ${link}\n\nCordialement,\nL'équipe administrative`
        : `URGENT - Bonjour ${signerName},\n\nVotre signature est requise de manière urgente sur le document "${documentTitle}".\n\nMerci de signer ce document dès réception de cet email.\n\nLien de signature : ${link}\n\nCordialement,\nL'équipe administrative`,
      friendly: isReminder
        ? `Bonjour ${signerName},\n\nJe me permets de vous relancer concernant la signature du document "${documentTitle}".\n\nSi vous avez des questions, n'hésitez pas à me contacter.\n\nLien de signature : ${link}\n\nMerci d'avance,\nL'équipe administrative`
        : `Bonjour ${signerName},\n\nJ'espère que vous allez bien !\n\nJe vous envoie ce message pour vous inviter à signer le document "${documentTitle}".\n\nVoici le lien pour signer : ${link}\n\nMerci beaucoup,\nL'équipe administrative`,
    };
    
    return templates[settings.emailTemplate];
  };

  // Send reminders to all pending
  const sendAllReminders = () => {
    const pending = getPendingSignatures();
    pending.forEach(req => {
      if (participantEmails[req.name]) {
        const lastNotification = notifications.find(n => n.recipientName === req.name);
        if (!lastNotification || lastNotification.reminderCount < settings.maxReminders) {
          sendNotification(req, true);
        }
      }
    });
  };

  // Handle email update
  const handleEmailUpdate = (name: string) => {
    if (tempEmail && tempEmail.includes('@')) {
      onUpdateEmails({ ...participantEmails, [name]: tempEmail });
      toast.success(`Email mis à jour pour ${name}`);
    }
    setEditingEmail(null);
    setTempEmail('');
  };

  const pendingSignatures = getPendingSignatures();
  const signedCount = signatures.length;
  const totalRequired = requirements.length;

  // Check auto-reminders
  useEffect(() => {
    if (!settings.autoReminders) return;

    const checkReminders = () => {
      const now = new Date();
      
      pendingSignatures.forEach(req => {
        const lastNotification = notifications.find(n => n.recipientName === req.name);
        
        if (lastNotification && lastNotification.reminderCount < settings.maxReminders) {
          const lastSent = new Date(lastNotification.sentAt);
          const daysSince = Math.floor((now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSince >= settings.reminderIntervalDays) {
            // Add to notification center about pending reminder
            addNotification({
              type: 'alert',
              title: 'Rappel de signature en attente',
              message: `${req.name} n'a pas encore signé "${documentTitle}"`,
              link: '/reunions/compte-rendu',
              priority: 'medium',
            });
          }
        }
      });
    };

    // Check on mount and set interval
    checkReminders();
    const interval = setInterval(checkReminders, 3600000); // Check every hour
    
    return () => clearInterval(interval);
  }, [pendingSignatures, notifications, settings, documentTitle, addNotification]);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-4 h-4" />
                Notifications & Rappels
              </CardTitle>
              <CardDescription>
                {signedCount}/{totalRequired} signatures collectées
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)}>
                <History className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingSignatures.length === 0 ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Toutes les signatures ont été collectées</p>
              <p className="text-sm text-muted-foreground">Le document est complet</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {pendingSignatures.map((req, index) => {
                  const notification = notifications.find(n => n.recipientName === req.name);
                  const email = participantEmails[req.name];
                  
                  return (
                    <div 
                      key={`${req.role}-${req.name}-${index}`}
                      className="p-3 rounded-lg border bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                            <Clock className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{req.name}</p>
                            {editingEmail === req.name ? (
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  type="email"
                                  value={tempEmail}
                                  onChange={(e) => setTempEmail(e.target.value)}
                                  placeholder="email@exemple.com"
                                  className="h-7 text-xs w-48"
                                />
                                <Button size="sm" variant="ghost" onClick={() => handleEmailUpdate(req.name)}>
                                  OK
                                </Button>
                              </div>
                            ) : (
                              <p 
                                className="text-xs text-muted-foreground cursor-pointer hover:underline"
                                onClick={() => {
                                  setEditingEmail(req.name);
                                  setTempEmail(email || '');
                                }}
                              >
                                {email || 'Cliquer pour ajouter un email'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification && (
                            <Badge variant="outline" className="text-xs">
                              {notification.reminderCount} rappel(s)
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendNotification(req, !!notification)}
                            disabled={!email}
                          >
                            {notification ? (
                              <>
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Relancer
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3 mr-1" />
                                Envoyer
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      {notification && (
                        <p className="text-xs text-muted-foreground mt-2 ml-11">
                          Dernier envoi: {new Date(notification.sentAt).toLocaleString('fr-FR')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {pendingSignatures.length} signature(s) en attente
                </p>
                <Button 
                  size="sm" 
                  onClick={sendAllReminders}
                  disabled={pendingSignatures.every(req => !participantEmails[req.name])}
                >
                  <Bell className="w-4 h-4 mr-1" />
                  Relancer tous
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres des rappels</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Rappels automatiques</Label>
                <p className="text-sm text-muted-foreground">
                  Envoyer des rappels automatiquement
                </p>
              </div>
              <Switch
                checked={settings.autoReminders}
                onCheckedChange={(checked) => saveSettings({ ...settings, autoReminders: checked })}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Intervalle entre rappels (jours)</Label>
              <Select
                value={settings.reminderIntervalDays.toString()}
                onValueChange={(value) => saveSettings({ ...settings, reminderIntervalDays: parseInt(value) })}
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
              <Label>Nombre maximum de rappels</Label>
              <Select
                value={settings.maxReminders.toString()}
                onValueChange={(value) => saveSettings({ ...settings, maxReminders: parseInt(value) })}
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
              <Label>Style du message</Label>
              <Select
                value={settings.emailTemplate}
                onValueChange={(value: 'standard' | 'urgent' | 'friendly') => 
                  saveSettings({ ...settings, emailTemplate: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="friendly">Cordial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Historique des notifications
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Aucune notification envoyée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications
                  .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
                  .map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {notif.type === 'reminder' ? (
                            <RefreshCw className="w-4 h-4 text-orange-500" />
                          ) : (
                            <Send className="w-4 h-4 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{notif.recipientName}</p>
                            <p className="text-xs text-muted-foreground">{notif.recipientEmail}</p>
                          </div>
                        </div>
                        <Badge variant={notif.type === 'reminder' ? 'secondary' : 'default'}>
                          {notif.type === 'reminder' ? 'Rappel' : 'Initial'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Envoyé le {new Date(notif.sentAt).toLocaleString('fr-FR')}
                      </p>
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

export default SignatureNotifications;
