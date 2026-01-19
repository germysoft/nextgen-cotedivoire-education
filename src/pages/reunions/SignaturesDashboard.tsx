import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  FileSignature, 
  Download, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  RefreshCw,
  Eye,
  Mail,
  BarChart3,
  Database,
  Link2,
  ExternalLink,
  Copy,
  Trash2,
  Send,
  Bell,
  Settings,
  LinkIcon,
  MailWarning
} from 'lucide-react';
import { useReportStorage, StoredReport } from '@/hooks/useReportStorage';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, parseISO, differenceInDays, isAfter, isBefore, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { initializeDemoData } from '@/data/mockReunionReports';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { generateSignaturesDashboardPDF } from '@/components/reunions/SignaturesDashboardPDFGenerator';
import { FileDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SignatureStatus {
  documentId: string;
  documentTitle: string;
  documentType: string;
  documentDate: string;
  totalSignatures: number;
  completedSignatures: number;
  pendingSignatures: number;
  status: 'completed' | 'partial' | 'pending' | 'overdue';
  lastSignatureDate?: string;
  signers: {
    name: string;
    role: string;
    status: 'signed' | 'pending';
    signedAt?: string;
    email?: string;
  }[];
}

interface SigningToken {
  id: string;
  documentId: string;
  documentTitle: string;
  signerName: string;
  signerRole: string;
  signerEmail: string;
  createdAt: string;
  expiresAt: string;
  signed: boolean;
  signedAt?: string;
}

const TOKENS_STORAGE_KEY = 'public_signing_tokens';
const REMINDERS_STORAGE_KEY = 'signature_reminders';
const REMINDER_SETTINGS_KEY = 'signature_reminder_settings';

interface ReminderRecord {
  id: string;
  tokenId: string;
  documentId: string;
  documentTitle: string;
  signerName: string;
  signerEmail: string;
  sentAt: string;
  reminderCount: number;
  type: 'initial' | 'reminder';
  status: 'sent' | 'opened' | 'clicked' | 'signed';
  openedAt?: string;
  clickedAt?: string;
  signedAt?: string;
}

interface ReminderSettings {
  autoRemindersEnabled: boolean;
  reminderAfterDays: number;
  maxReminders: number;
}

interface ReminderStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalSigned: number;
  openRate: number;
  clickRate: number;
  signRate: number;
  avgTimeToSign: number;
}

const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  autoRemindersEnabled: true,
  reminderAfterDays: 3,
  maxReminders: 3,
};

const SignaturesDashboard = () => {
  const { reports, isLoading } = useReportStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [pendingTokens, setPendingTokens] = useState<SigningToken[]>([]);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SignatureStatus | null>(null);
  const [showBulkLinkDialog, setShowBulkLinkDialog] = useState(false);
  const [bulkLinkDocument, setBulkLinkDocument] = useState<SignatureStatus | null>(null);
  const [bulkEmails, setBulkEmails] = useState<{[name: string]: string}>({});
  const [generatedBulkLinks, setGeneratedBulkLinks] = useState<SigningToken[]>([]);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [reminders, setReminders] = useState<ReminderRecord[]>([]);
  const [overdueTokens, setOverdueTokens] = useState<SigningToken[]>([]);
  const [showReminderHistory, setShowReminderHistory] = useState(false);
  const [reminderHistoryFilter, setReminderHistoryFilter] = useState<'all' | 'initial' | 'reminder'>('all');
  const [reminderStatusFilter, setReminderStatusFilter] = useState<'all' | 'sent' | 'opened' | 'clicked' | 'signed'>('all');

  // Load reminder settings
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(REMINDER_SETTINGS_KEY);
      if (storedSettings) {
        setReminderSettings(JSON.parse(storedSettings));
      }
      const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (e) {
      console.error('Error loading reminder settings:', e);
    }
  }, []);

  // Load pending tokens
  useEffect(() => {
    const loadTokens = () => {
      try {
        const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
        if (stored) {
          const tokens: SigningToken[] = JSON.parse(stored);
          const pending = tokens.filter(t => !t.signed && new Date(t.expiresAt) > new Date());
          setPendingTokens(pending);
          
          // Check for overdue tokens (more than X days old)
          const overdue = pending.filter(t => {
            const createdDate = parseISO(t.createdAt);
            return differenceInDays(new Date(), createdDate) >= reminderSettings.reminderAfterDays;
          });
          setOverdueTokens(overdue);
        }
      } catch (e) {
        console.error('Error loading tokens:', e);
      }
    };
    loadTokens();
    // Refresh tokens every 30 seconds
    const interval = setInterval(loadTokens, 30000);
    return () => clearInterval(interval);
  }, [reminderSettings.reminderAfterDays]);

  // Load demo data on mount if no reports exist
  useEffect(() => {
    if (!isLoading && reports.length === 0 && !demoLoaded) {
      const { reportsCount, tokensCount } = initializeDemoData();
      if (reportsCount > 0) {
        setDemoLoaded(true);
        toast.success(`${reportsCount} comptes-rendus de démonstration chargés`);
        window.location.reload();
      }
    }
  }, [isLoading, reports.length, demoLoaded]);

  // Check for automatic reminders
  useEffect(() => {
    if (!reminderSettings.autoRemindersEnabled || overdueTokens.length === 0) return;

    // Check if there are tokens that need automatic reminders
    const tokensNeedingReminder = overdueTokens.filter(token => {
      const reminder = reminders.find(r => r.tokenId === token.id);
      if (!reminder) return true; // Never reminded
      if (reminder.reminderCount >= reminderSettings.maxReminders) return false; // Max reminders reached
      
      // Check if enough time has passed since last reminder
      const lastReminderDate = parseISO(reminder.sentAt);
      return differenceInDays(new Date(), lastReminderDate) >= reminderSettings.reminderAfterDays;
    });

    if (tokensNeedingReminder.length > 0) {
      // Show notification about pending auto-reminders
      toast.info(
        `${tokensNeedingReminder.length} signature(s) en attente depuis plus de ${reminderSettings.reminderAfterDays} jours`,
        {
          action: {
            label: 'Envoyer rappels',
            onClick: () => sendBulkReminders(tokensNeedingReminder),
          },
        }
      );
    }
  }, [overdueTokens, reminders, reminderSettings]);

  const handleLoadDemoData = () => {
    localStorage.removeItem('reunion_reports');
    localStorage.removeItem('public_signing_tokens');
    localStorage.removeItem(REMINDERS_STORAGE_KEY);
    const { reportsCount, tokensCount } = initializeDemoData();
    toast.success(`${reportsCount} comptes-rendus et ${tokensCount} tokens de signature chargés`);
    window.location.reload();
  };

  // Save reminder settings
  const saveReminderSettings = (newSettings: ReminderSettings) => {
    setReminderSettings(newSettings);
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(newSettings));
    toast.success('Paramètres de rappel sauvegardés');
  };

  // Generate signing link for a single signer
  const generateSigningLink = useCallback((
    documentId: string,
    documentTitle: string,
    signerName: string,
    signerRole: string,
    signerEmail: string
  ): SigningToken => {
    const tokenId = `sign-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    const token: SigningToken = {
      id: tokenId,
      documentId,
      documentTitle,
      signerName,
      signerRole,
      signerEmail,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      signed: false,
    };
    
    // Store token in localStorage
    const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY);
    const tokens: SigningToken[] = storedTokens ? JSON.parse(storedTokens) : [];
    
    // Check if a token already exists for this signer on this document
    const existingIndex = tokens.findIndex(
      t => t.documentId === documentId && t.signerName === signerName && !t.signed
    );
    
    if (existingIndex >= 0) {
      // Update existing token
      tokens[existingIndex] = token;
    } else {
      tokens.push(token);
    }
    
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    
    return token;
  }, []);

  // Open bulk link dialog for a document
  const openBulkLinkDialog = (doc: SignatureStatus) => {
    setBulkLinkDocument(doc);
    setGeneratedBulkLinks([]);
    
    // Initialize emails with any existing ones from tokens
    const initialEmails: {[name: string]: string} = {};
    doc.signers.filter(s => s.status === 'pending').forEach(signer => {
      const existingToken = pendingTokens.find(
        t => t.documentId === doc.documentId && t.signerName === signer.name
      );
      initialEmails[signer.name] = existingToken?.signerEmail || signer.email || '';
    });
    setBulkEmails(initialEmails);
    setShowBulkLinkDialog(true);
  };

  // Generate bulk signing links
  const generateBulkLinks = () => {
    if (!bulkLinkDocument) return;
    
    const pendingSigners = bulkLinkDocument.signers.filter(s => s.status === 'pending');
    const generatedLinks: SigningToken[] = [];
    
    pendingSigners.forEach(signer => {
      const email = bulkEmails[signer.name];
      if (email && email.includes('@')) {
        const token = generateSigningLink(
          bulkLinkDocument.documentId,
          bulkLinkDocument.documentTitle,
          signer.name,
          signer.role,
          email
        );
        generatedLinks.push(token);
      }
    });
    
    setGeneratedBulkLinks(generatedLinks);
    setPendingTokens(prev => [...prev.filter(t => 
      !generatedLinks.some(g => g.documentId === t.documentId && g.signerName === t.signerName)
    ), ...generatedLinks]);
    
    toast.success(`${generatedLinks.length} lien(s) de signature générés`);
  };

  // Send bulk emails with generated links
  const sendBulkEmails = () => {
    if (generatedBulkLinks.length === 0) return;
    
    generatedBulkLinks.forEach(token => {
      const signatureLink = `${window.location.origin}/signature-publique?token=${token.id}`;
      const subject = `Signature requise - ${token.documentTitle}`;
      const body = `Bonjour ${token.signerName},

Vous êtes invité(e) à signer le document "${token.documentTitle}".

Merci de cliquer sur le lien ci-dessous pour apposer votre signature électronique :

${signatureLink}

Ce lien expire le ${format(parseISO(token.expiresAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}.

Cordialement,
L'équipe administrative`;

      window.open(`mailto:${token.signerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    });
    
    toast.success(`${generatedBulkLinks.length} email(s) de demande de signature ouverts`);
    setShowBulkLinkDialog(false);
  };

  // Copy all links to clipboard
  const copyAllLinks = () => {
    if (generatedBulkLinks.length === 0) return;
    
    const linksText = generatedBulkLinks.map(token => 
      `${token.signerName} (${token.signerEmail}):\n${window.location.origin}/signature-publique?token=${token.id}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(linksText);
    toast.success('Tous les liens copiés dans le presse-papiers');
  };

  // Send reminder for a single token
  const sendReminder = (token: SigningToken) => {
    const signatureLink = `${window.location.origin}/signature-publique?token=${token.id}`;
    const subject = `[RAPPEL] Signature requise - ${token.documentTitle}`;
    const body = `Bonjour ${token.signerName},

Ceci est un rappel concernant la signature du document "${token.documentTitle}".

Votre signature est toujours en attente. Merci de bien vouloir signer le document dès que possible.

Lien de signature : ${signatureLink}

Ce lien expire le ${format(parseISO(token.expiresAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}.

Cordialement,
L'équipe administrative`;

    window.open(`mailto:${token.signerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    
    // Record the reminder
    const existingReminder = reminders.find(r => r.tokenId === token.id);
    const newReminder: ReminderRecord = {
      id: `reminder-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      tokenId: token.id,
      documentId: token.documentId,
      documentTitle: token.documentTitle,
      signerName: token.signerName,
      signerEmail: token.signerEmail,
      sentAt: new Date().toISOString(),
      reminderCount: (existingReminder?.reminderCount || 0) + 1,
      type: existingReminder ? 'reminder' : 'initial',
      status: 'sent',
    };
    
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
    
    toast.success(`Rappel envoyé à ${token.signerName}`);
  };

  // Send reminders to multiple tokens
  const sendBulkReminders = (tokens: SigningToken[]) => {
    tokens.forEach(token => {
      sendReminder(token);
    });
    toast.success(`${tokens.length} rappel(s) envoyé(s)`);
  };

  // Get reminder count for a token
  const getReminderCount = (tokenId: string): number => {
    return reminders.filter(r => r.tokenId === tokenId).length;
  };

  // Simulate opening/clicking tracking (in real implementation, this would come from email service)
  const simulateReminderEvent = (reminderId: string, event: 'opened' | 'clicked' | 'signed') => {
    const updatedReminders = reminders.map(r => {
      if (r.id === reminderId) {
        const updates: Partial<ReminderRecord> = { status: event };
        if (event === 'opened') updates.openedAt = new Date().toISOString();
        if (event === 'clicked') {
          updates.clickedAt = new Date().toISOString();
          if (!r.openedAt) updates.openedAt = new Date().toISOString();
        }
        if (event === 'signed') {
          updates.signedAt = new Date().toISOString();
          if (!r.openedAt) updates.openedAt = new Date().toISOString();
          if (!r.clickedAt) updates.clickedAt = new Date().toISOString();
        }
        return { ...r, ...updates };
      }
      return r;
    });
    setReminders(updatedReminders);
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
    toast.success(`Statut mis à jour : ${event}`);
  };

  // Calculate reminder statistics
  const reminderStats = useMemo((): ReminderStats => {
    const totalSent = reminders.length;
    const totalOpened = reminders.filter(r => r.openedAt).length;
    const totalClicked = reminders.filter(r => r.clickedAt).length;
    const totalSigned = reminders.filter(r => r.signedAt).length;

    const signedReminders = reminders.filter(r => r.signedAt && r.sentAt);
    const avgTimeToSign = signedReminders.length > 0
      ? signedReminders.reduce((sum, r) => {
          const sentDate = parseISO(r.sentAt);
          const signedDate = parseISO(r.signedAt!);
          return sum + differenceInDays(signedDate, sentDate);
        }, 0) / signedReminders.length
      : 0;

    return {
      totalSent,
      totalOpened,
      totalClicked,
      totalSigned,
      openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
      clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
      signRate: totalSent > 0 ? Math.round((totalSigned / totalSent) * 100) : 0,
      avgTimeToSign: Math.round(avgTimeToSign * 10) / 10,
    };
  }, [reminders]);

  // Filtered reminders for history
  const filteredReminders = useMemo(() => {
    return reminders
      .filter(r => reminderHistoryFilter === 'all' || r.type === reminderHistoryFilter)
      .filter(r => reminderStatusFilter === 'all' || r.status === reminderStatusFilter)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }, [reminders, reminderHistoryFilter, reminderStatusFilter]);

  // Get status badge for reminder
  const getReminderStatusBadge = (status: ReminderRecord['status']) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline">Envoyé</Badge>;
      case 'opened':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Ouvert</Badge>;
      case 'clicked':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Cliqué</Badge>;
      case 'signed':
        return <Badge className="bg-green-500 hover:bg-green-600">Signé</Badge>;
    }
  };

  // Calculate signature statistics from reports
  const signatureData = useMemo((): SignatureStatus[] => {
    return reports.map(report => {
      const signatures = report.electronicSignatures || [];
      const totalRequired = 2 + Math.min(report.participants.filter(p => p.present).length, 5);
      const completed = signatures.length;
      
      const signers = [];
      
      // President
      if (report.president) {
        const signed = signatures.find(s => s.signerRole === 'president' || s.signerName === report.president);
        signers.push({
          name: report.president,
          role: 'Président',
          status: signed ? 'signed' : 'pending' as const,
          signedAt: signed?.signedAt,
        });
      }
      
      // Secretary
      if (report.secretaire) {
        const signed = signatures.find(s => s.signerRole === 'secretaire' || s.signerName === report.secretaire);
        signers.push({
          name: report.secretaire,
          role: 'Secrétaire',
          status: signed ? 'signed' : 'pending' as const,
          signedAt: signed?.signedAt,
        });
      }
      
      // Participants
      report.participants.filter(p => p.present).slice(0, 5).forEach(p => {
        const signed = signatures.find(s => s.signerName === p.nom);
        signers.push({
          name: p.nom,
          role: 'Participant',
          status: signed ? 'signed' : 'pending' as const,
          signedAt: signed?.signedAt,
        });
      });

      let status: SignatureStatus['status'] = 'pending';
      if (completed >= totalRequired) {
        status = 'completed';
      } else if (completed > 0) {
        status = 'partial';
      } else if (differenceInDays(new Date(), parseISO(report.date)) > 7) {
        status = 'overdue';
      }

      return {
        documentId: report.id,
        documentTitle: report.titre,
        documentType: report.type,
        documentDate: report.date,
        totalSignatures: totalRequired,
        completedSignatures: completed,
        pendingSignatures: totalRequired - completed,
        status,
        lastSignatureDate: signatures.length > 0 
          ? signatures.reduce((latest, s) => 
              isAfter(parseISO(s.signedAt), parseISO(latest)) ? s.signedAt : latest, 
              signatures[0].signedAt
            )
          : undefined,
        signers,
      };
    });
  }, [reports]);

  // Global statistics
  const stats = useMemo(() => {
    const totalDocuments = signatureData.length;
    const totalSignatures = signatureData.reduce((sum, d) => sum + d.totalSignatures, 0);
    const completedSignatures = signatureData.reduce((sum, d) => sum + d.completedSignatures, 0);
    const pendingSignatures = signatureData.reduce((sum, d) => sum + d.pendingSignatures, 0);
    const fullySignedDocs = signatureData.filter(d => d.status === 'completed').length;
    const partialDocs = signatureData.filter(d => d.status === 'partial').length;
    const pendingDocs = signatureData.filter(d => d.status === 'pending').length;
    const overdueDocs = signatureData.filter(d => d.status === 'overdue').length;
    
    const completionRate = totalSignatures > 0 
      ? Math.round((completedSignatures / totalSignatures) * 100) 
      : 0;

    // Recent activity (last 7 days)
    const recentSignatures = signatureData.reduce((sum, d) => {
      const docSignatures = d.signers.filter(s => 
        s.signedAt && isAfter(parseISO(s.signedAt), subDays(new Date(), 7))
      ).length;
      return sum + docSignatures;
    }, 0);

    return {
      totalDocuments,
      totalSignatures,
      completedSignatures,
      pendingSignatures,
      fullySignedDocs,
      partialDocs,
      pendingDocs,
      overdueDocs,
      completionRate,
      recentSignatures,
    };
  }, [signatureData]);

  // Charts data
  const pieChartData = useMemo(() => [
    { name: 'Complétés', value: stats.fullySignedDocs, color: 'hsl(var(--chart-1))' },
    { name: 'Partiels', value: stats.partialDocs, color: 'hsl(var(--chart-2))' },
    { name: 'En attente', value: stats.pendingDocs, color: 'hsl(var(--chart-3))' },
    { name: 'En retard', value: stats.overdueDocs, color: 'hsl(var(--chart-4))' },
  ].filter(d => d.value > 0), [stats]);

  const barChartData = useMemo(() => {
    const byType: { [key: string]: { completed: number; pending: number } } = {};
    signatureData.forEach(d => {
      const typeLabel = getTypeLabel(d.documentType as any);
      if (!byType[typeLabel]) {
        byType[typeLabel] = { completed: 0, pending: 0 };
      }
      byType[typeLabel].completed += d.completedSignatures;
      byType[typeLabel].pending += d.pendingSignatures;
    });
    return Object.entries(byType).map(([name, data]) => ({
      name,
      Signées: data.completed,
      'En attente': data.pending,
    }));
  }, [signatureData]);

  // Filtering
  const filteredData = useMemo(() => {
    return signatureData.filter(doc => {
      const matchesSearch = doc.documentTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      const matchesType = filterType === 'all' || doc.documentType === filterType;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const docDate = parseISO(doc.documentDate);
        const today = new Date();
        switch (dateRange) {
          case '7days':
            matchesDate = isAfter(docDate, subDays(today, 7));
            break;
          case '30days':
            matchesDate = isAfter(docDate, subDays(today, 30));
            break;
          case '90days':
            matchesDate = isAfter(docDate, subDays(today, 90));
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [signatureData, searchTerm, filterStatus, filterType, dateRange]);

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Document',
      'Type',
      'Date',
      'Signatures requises',
      'Signatures complétées',
      'Signatures en attente',
      'Statut',
      'Dernière signature',
      'Signataires (détail)'
    ];

    const rows = filteredData.map(doc => [
      doc.documentTitle,
      getTypeLabel(doc.documentType as any),
      format(parseISO(doc.documentDate), 'dd/MM/yyyy', { locale: fr }),
      doc.totalSignatures.toString(),
      doc.completedSignatures.toString(),
      doc.pendingSignatures.toString(),
      getStatusLabel(doc.status),
      doc.lastSignatureDate 
        ? format(parseISO(doc.lastSignatureDate), 'dd/MM/yyyy HH:mm', { locale: fr })
        : 'Aucune',
      doc.signers.map(s => `${s.name} (${s.role}): ${s.status === 'signed' ? 'Signé' : 'En attente'}`).join(' | ')
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suivi-signatures-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      generateSignaturesDashboardPDF({
        stats,
        signatureData,
        etablissement: 'NextGen Éducation',
      });
      toast.success('PDF généré avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  // Copy signing link to clipboard
  const copySigningLink = (token: SigningToken) => {
    const url = `${window.location.origin}/signature-publique?token=${token.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Lien copié dans le presse-papiers');
  };

  // Open signing link
  const openSigningLink = (token: SigningToken) => {
    const url = `${window.location.origin}/signature-publique?token=${token.id}`;
    window.open(url, '_blank');
  };

  // Delete a token
  const deleteToken = (tokenId: string) => {
    try {
      const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
      if (stored) {
        const tokens: SigningToken[] = JSON.parse(stored);
        const filtered = tokens.filter(t => t.id !== tokenId);
        localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(filtered));
        setPendingTokens(prev => prev.filter(t => t.id !== tokenId));
        toast.success('Lien supprimé');
      }
    } catch (e) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Get tokens for a specific document
  const getTokensForDocument = (documentId: string) => {
    return pendingTokens.filter(t => t.documentId === documentId);
  };

  function getTypeLabel(type: string): string {
    switch (type) {
      case 'conseil_classe': return 'Conseil de Classe';
      case 'reunion_parents': return 'Réunion Parents';
      case 'reunion_pedagogique': return 'Réunion Pédagogique';
      case 'reunion_administrative': return 'Réunion Administrative';
      default: return type;
    }
  }

  function getStatusLabel(status: SignatureStatus['status']): string {
    switch (status) {
      case 'completed': return 'Complété';
      case 'partial': return 'Partiel';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
    }
  }

  function getStatusBadge(status: SignatureStatus['status']) {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Complété</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Partiel</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">En retard</Badge>;
    }
  }

  function getRoleLabel(role: string): string {
    switch (role) {
      case 'president': return 'Président';
      case 'secretaire': return 'Secrétaire';
      case 'participant': return 'Participant';
      default: return role;
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileSignature className="h-8 w-8 text-primary" />
            Tableau de Bord des Signatures
          </h1>
          <p className="text-muted-foreground">
            Suivi de l'avancement des signatures électroniques sur tous les documents
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {overdueTokens.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => sendBulkReminders(overdueTokens)} 
              className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
            >
              <MailWarning className="w-4 h-4" />
              Rappels ({overdueTokens.length})
            </Button>
          )}
          {pendingTokens.length > 0 && (
            <Button variant="outline" onClick={() => setShowPendingDialog(true)} className="gap-2">
              <Link2 className="w-4 h-4" />
              Liens en attente ({pendingTokens.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowReminderHistory(true)} className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Historique
          </Button>
          <Button variant="outline" onClick={() => setShowReminderSettings(true)} className="gap-2">
            <Settings className="w-4 h-4" />
            Rappels auto
          </Button>
          <Button variant="outline" onClick={handleLoadDemoData} className="gap-2">
            <Database className="w-4 h-4" />
            Recharger démo
          </Button>
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button onClick={exportToPDF} className="gap-2">
            <FileDown className="w-4 h-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Pending Tokens Alert */}
      {pendingTokens.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    {pendingTokens.length} lien(s) de signature en attente
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Des signataires n'ont pas encore signé leurs documents
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPendingDialog(true)}>
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.fullySignedDocs} entièrement signés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Signatures</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedSignatures}/{stats.totalSignatures}
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completionRate}% de complétion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingSignatures}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.pendingDocs + stats.partialDocs} documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activité récente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.recentSignatures}</div>
            <p className="text-xs text-muted-foreground">
              signatures ces 7 derniers jours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              État des documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Signatures par type de réunion
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Signées" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="En attente" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des documents</CardTitle>
          <CardDescription>Liste complète avec statut des signatures</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complétés</SelectItem>
                <SelectItem value="partial">Partiels</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de réunion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="conseil_classe">Conseil de Classe</SelectItem>
                <SelectItem value="reunion_parents">Réunion Parents</SelectItem>
                <SelectItem value="reunion_pedagogique">Réunion Pédagogique</SelectItem>
                <SelectItem value="reunion_administrative">Réunion Administrative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes dates</SelectItem>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="90days">90 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {filteredData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Progression</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière signature</TableHead>
                    <TableHead>Signataires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((doc) => (
                    <TableRow key={doc.documentId}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {doc.documentTitle}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {getTypeLabel(doc.documentType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(parseISO(doc.documentDate), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(doc.completedSignatures / doc.totalSignatures) * 100} 
                            className="w-[60px]"
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {doc.completedSignatures}/{doc.totalSignatures}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {doc.lastSignatureDate 
                          ? format(parseISO(doc.lastSignatureDate), 'dd/MM HH:mm', { locale: fr })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {doc.signers.slice(0, 3).map((signer, idx) => (
                            <div
                              key={idx}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                signer.status === 'signed'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                              title={`${signer.name} (${signer.role}): ${signer.status === 'signed' ? 'Signé' : 'En attente'}`}
                            >
                              {signer.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {doc.signers.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              +{doc.signers.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {doc.pendingSignatures > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openBulkLinkDialog(doc)}
                              title="Générer liens en masse"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedDocument(doc)}
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSignature className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">Aucun document trouvé</h3>
              <p className="text-sm text-muted-foreground">
                Modifiez vos filtres ou créez de nouveaux comptes-rendus
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.fullySignedDocs}</p>
                <p className="text-sm text-muted-foreground">Documents complétés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{stats.partialDocs}</p>
                <p className="text-sm text-muted-foreground">En cours de signature</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingDocs}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.overdueDocs}</p>
                <p className="text-sm text-muted-foreground">En retard (&gt;7 jours)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tokens Dialog */}
      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Liens de signature en attente
            </DialogTitle>
            <DialogDescription>
              Gérez les liens de signature envoyés aux signataires
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {pendingTokens.length > 0 ? (
              <div className="space-y-3">
                {pendingTokens.map((token) => (
                  <div key={token.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{token.documentTitle}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{token.signerName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {getRoleLabel(token.signerRole)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{token.signerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-amber-600">
                            Expire le {format(parseISO(token.expiresAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copySigningLink(token)}
                          className="gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openSigningLink(token)}
                          className="gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ouvrir
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteToken(token.id)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                <p className="font-medium">Aucun lien en attente</p>
                <p className="text-sm text-muted-foreground">
                  Tous les signataires ont complété leurs signatures
                </p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Document Details Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Détails du document
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedDocument.documentTitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{getTypeLabel(selectedDocument.documentType)}</Badge>
                  {getStatusBadge(selectedDocument.status)}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Signataires ({selectedDocument.signers.length})</h4>
                <div className="space-y-2">
                  {selectedDocument.signers.map((signer, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          signer.status === 'signed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {signer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{signer.name}</p>
                          <p className="text-xs text-muted-foreground">{signer.role}</p>
                        </div>
                      </div>
                      <Badge variant={signer.status === 'signed' ? 'default' : 'secondary'}>
                        {signer.status === 'signed' ? 'Signé' : 'En attente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {getTokensForDocument(selectedDocument.documentId).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Liens actifs</h4>
                    <div className="space-y-2">
                      {getTokensForDocument(selectedDocument.documentId).map((token) => (
                        <div key={token.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                          <div className="text-sm">
                            <p className="font-medium">{token.signerName}</p>
                            <p className="text-xs text-muted-foreground">{token.signerEmail}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copySigningLink(token)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Link Generation Dialog */}
      <Dialog open={showBulkLinkDialog} onOpenChange={setShowBulkLinkDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Générer des liens de signature en masse
            </DialogTitle>
            <DialogDescription>
              Générez des liens de signature pour tous les signataires en attente
            </DialogDescription>
          </DialogHeader>
          
          {bulkLinkDocument && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{bulkLinkDocument.documentTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {bulkLinkDocument.pendingSignatures} signature(s) en attente
                </p>
              </div>

              <Separator />

              <ScrollArea className="max-h-[300px]">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Signataires en attente</h4>
                  {bulkLinkDocument.signers
                    .filter(s => s.status === 'pending')
                    .map((signer, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {signer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{signer.name}</p>
                          <p className="text-xs text-muted-foreground">{signer.role}</p>
                        </div>
                        <Input
                          type="email"
                          placeholder="email@exemple.com"
                          value={bulkEmails[signer.name] || ''}
                          onChange={(e) => setBulkEmails(prev => ({
                            ...prev,
                            [signer.name]: e.target.value
                          }))}
                          className="w-[200px]"
                        />
                      </div>
                    ))}
                </div>
              </ScrollArea>

              {generatedBulkLinks.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-primary">
                        ✓ {generatedBulkLinks.length} lien(s) générés
                      </h4>
                      <Button variant="outline" size="sm" onClick={copyAllLinks}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copier tous
                      </Button>
                    </div>
                    <ScrollArea className="max-h-[150px]">
                      <div className="space-y-2">
                        {generatedBulkLinks.map((token) => (
                          <div key={token.id} className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="text-sm">
                              <p className="font-medium">{token.signerName}</p>
                              <p className="text-xs text-muted-foreground">{token.signerEmail}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => copySigningLink(token)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openSigningLink(token)}>
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {generatedBulkLinks.length === 0 ? (
              <Button 
                onClick={generateBulkLinks}
                disabled={Object.values(bulkEmails).filter(e => e.includes('@')).length === 0}
                className="gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Générer les liens
              </Button>
            ) : (
              <Button onClick={sendBulkEmails} className="gap-2">
                <Send className="w-4 h-4" />
                Envoyer les demandes par email
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowBulkLinkDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Settings Dialog */}
      <Dialog open={showReminderSettings} onOpenChange={setShowReminderSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Paramètres des rappels automatiques
            </DialogTitle>
            <DialogDescription>
              Configurez les rappels pour les signatures en attente
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappels automatiques</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications pour les signatures en retard
                </p>
              </div>
              <Switch
                checked={reminderSettings.autoRemindersEnabled}
                onCheckedChange={(checked) => 
                  saveReminderSettings({ ...reminderSettings, autoRemindersEnabled: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Délai avant rappel</Label>
              <Select
                value={reminderSettings.reminderAfterDays.toString()}
                onValueChange={(value) => 
                  saveReminderSettings({ ...reminderSettings, reminderAfterDays: parseInt(value) })
                }
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
              <p className="text-xs text-muted-foreground">
                Envoyer un rappel si la signature n'a pas été effectuée après ce délai
              </p>
            </div>

            <div className="space-y-3">
              <Label>Nombre maximum de rappels</Label>
              <Select
                value={reminderSettings.maxReminders.toString()}
                onValueChange={(value) => 
                  saveReminderSettings({ ...reminderSettings, maxReminders: parseInt(value) })
                }
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

            {overdueTokens.length > 0 && (
              <>
                <Separator />
                <Alert>
                  <MailWarning className="h-4 w-4" />
                  <AlertTitle>Signatures en retard</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="mb-2">
                      {overdueTokens.length} signature(s) en attente depuis plus de {reminderSettings.reminderAfterDays} jour(s)
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        sendBulkReminders(overdueTokens);
                        setShowReminderSettings(false);
                      }}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Envoyer tous les rappels
                    </Button>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder History Dialog */}
      <Dialog open={showReminderHistory} onOpenChange={setShowReminderHistory}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Historique des rappels et notifications
            </DialogTitle>
            <DialogDescription>
              Suivez les envois, ouvertures et signatures de vos demandes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Send className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{reminderStats.totalSent}</p>
                      <p className="text-xs text-muted-foreground">Envoyés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{reminderStats.totalOpened}</p>
                      <p className="text-xs text-muted-foreground">
                        Ouverts ({reminderStats.openRate}%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <ExternalLink className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{reminderStats.totalClicked}</p>
                      <p className="text-xs text-muted-foreground">
                        Cliqués ({reminderStats.clickRate}%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{reminderStats.totalSigned}</p>
                      <p className="text-xs text-muted-foreground">
                        Signés ({reminderStats.signRate}%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={reminderHistoryFilter} onValueChange={(v: any) => setReminderHistoryFilter(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="initial">Initial</SelectItem>
                  <SelectItem value="reminder">Rappel</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={reminderStatusFilter} onValueChange={(v: any) => setReminderStatusFilter(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="sent">Envoyé</SelectItem>
                  <SelectItem value="opened">Ouvert</SelectItem>
                  <SelectItem value="clicked">Cliqué</SelectItem>
                  <SelectItem value="signed">Signé</SelectItem>
                </SelectContent>
              </Select>
              
              {reminderStats.avgTimeToSign > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Délai moyen de signature : <strong>{reminderStats.avgTimeToSign} jour(s)</strong></span>
                </div>
              )}
            </div>

            {/* Table */}
            <ScrollArea className="h-[400px]">
              {filteredReminders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date d'envoi</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Destinataire</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Ouvert</TableHead>
                      <TableHead>Cliqué</TableHead>
                      <TableHead>Signé</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReminders.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {format(parseISO(reminder.sentAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate text-sm font-medium">
                          {reminder.documentTitle}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{reminder.signerName}</p>
                            <p className="text-xs text-muted-foreground">{reminder.signerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={reminder.type === 'initial' ? 'default' : 'secondary'}>
                            {reminder.type === 'initial' ? 'Initial' : `Rappel #${reminder.reminderCount}`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getReminderStatusBadge(reminder.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {reminder.openedAt 
                            ? format(parseISO(reminder.openedAt), 'dd/MM HH:mm', { locale: fr })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {reminder.clickedAt 
                            ? format(parseISO(reminder.clickedAt), 'dd/MM HH:mm', { locale: fr })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {reminder.signedAt 
                            ? format(parseISO(reminder.signedAt), 'dd/MM HH:mm', { locale: fr })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {reminder.status !== 'signed' && (
                            <div className="flex justify-end gap-1">
                              {reminder.status === 'sent' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => simulateReminderEvent(reminder.id, 'opened')}
                                  title="Marquer comme ouvert"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              )}
                              {(reminder.status === 'sent' || reminder.status === 'opened') && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => simulateReminderEvent(reminder.id, 'clicked')}
                                  title="Marquer comme cliqué"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => simulateReminderEvent(reminder.id, 'signed')}
                                title="Marquer comme signé"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-1">Aucun rappel envoyé</h3>
                  <p className="text-sm text-muted-foreground">
                    Les rappels apparaîtront ici une fois envoyés
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignaturesDashboard;
