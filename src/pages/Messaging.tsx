import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, Send, Mail, Phone, Users, Bell, CheckCircle2, Clock,
  TrendingUp, Calendar, FileText, Settings, Eye, MousePointer, Zap,
  BarChart3, PieChart, ArrowUpRight, AlertTriangle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartPie, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { contactGroups } from "@/data/mockMessaging";

const quickStats = {
  smsToday: 156,
  smsTrend: "+12%",
  emailsToday: 89,
  emailsTrend: "+8%",
  notificationsToday: 234,
  notificationsTrend: "+15%",
  readRate: 94.2,
  readRateTrend: "+2.3%"
};

const recentMessages = [
  { id: 1, type: "SMS", recipient: "Parents 6ème A", subject: "Réunion Parents-Professeurs", date: "Aujourd'hui 10:30", status: "sent", count: 25 },
  { id: 2, type: "Email", recipient: "Enseignants", subject: "Conseil Pédagogique du 20/12", date: "Aujourd'hui 09:15", status: "sent", count: 45 },
  { id: 3, type: "Notification", recipient: "Parents Impayés", subject: "Rappel Échéance Paiement", date: "Hier 14:00", status: "sent", count: 65 },
  { id: 4, type: "SMS", recipient: "Tous les Parents", subject: "Vacances de Noël", date: "10 Déc 08:00", status: "scheduled", count: 465 },
  { id: 5, type: "Email", recipient: "Parents Terminale", subject: "Orientation Post-BAC", date: "09 Déc 16:30", status: "sent", count: 47 },
];

const weeklyData = [
  { day: "Lun", sms: 145, email: 89, notification: 234 },
  { day: "Mar", sms: 167, email: 102, notification: 256 },
  { day: "Mer", sms: 134, email: 78, notification: 198 },
  { day: "Jeu", sms: 189, email: 112, notification: 287 },
  { day: "Ven", sms: 156, email: 98, notification: 245 },
  { day: "Sam", sms: 45, email: 23, notification: 67 },
  { day: "Dim", sms: 12, email: 8, notification: 23 }
];

const channelDistribution = [
  { name: "SMS", value: 45, color: "hsl(var(--primary))" },
  { name: "Email", value: 32, color: "hsl(var(--chart-2))" },
  { name: "Notification", value: 23, color: "hsl(var(--chart-3))" }
];

export default function Messaging() {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSendMessage = () => {
    if (!messageType || !recipient || !content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success(`${messageType} envoyé avec succès à ${recipient}`);
    setIsNewMessageOpen(false);
    setMessageType("");
    setRecipient("");
    setSubject("");
    setContent("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centre de Messagerie</h1>
          <p className="text-muted-foreground">Tableau de bord centralisé pour tous vos envois</p>
        </div>
        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Send className="mr-2 h-4 w-4" />
              Nouveau Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Envoyer un message</DialogTitle>
              <DialogDescription>Choisissez le type et les destinataires</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de message *</Label>
                  <Select value={messageType} onValueChange={setMessageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="notification">Notification Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Destinataires *</Label>
                  <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactGroups.map((group) => (
                        <SelectItem key={group.id} value={group.name}>
                          {group.name} ({group.memberCount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {messageType === "email" && (
                <div className="space-y-2">
                  <Label>Sujet</Label>
                  <Input 
                    placeholder="Objet du message" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Message *</Label>
                <Textarea 
                  placeholder="Votre message..." 
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                {messageType === "sms" && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{content.length}/160 caractères</span>
                    <span>{Math.ceil(content.length / 160) || 1} SMS</span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Aujourd'hui</CardTitle>
            <Phone className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{quickStats.smsToday}</div>
              <Badge variant="secondary" className="text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {quickStats.smsTrend}
              </Badge>
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Aujourd'hui</CardTitle>
            <Mail className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{quickStats.emailsToday}</div>
              <Badge variant="secondary" className="text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {quickStats.emailsTrend}
              </Badge>
            </div>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{quickStats.notificationsToday}</div>
              <Badge variant="secondary" className="text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {quickStats.notificationsTrend}
              </Badge>
            </div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Lecture</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-green-600">{quickStats.readRate}%</div>
              <Badge variant="secondary" className="text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {quickStats.readRateTrend}
              </Badge>
            </div>
            <Progress value={quickStats.readRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Messages Récents</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/messaging/sms">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    message.type === "SMS" ? "bg-blue-100 text-blue-600" :
                    message.type === "Email" ? "bg-green-100 text-green-600" :
                    "bg-purple-100 text-purple-600"
                  }`}>
                    {message.type === "SMS" && <Phone className="h-5 w-5" />}
                    {message.type === "Email" && <Mail className="h-5 w-5" />}
                    {message.type === "Notification" && <Bell className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{message.subject}</h4>
                      <Badge variant="outline" className="shrink-0">{message.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {message.recipient} • {message.count} destinataires
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={message.status === "sent" ? "default" : "secondary"}>
                      {message.status === "sent" ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Envoyé</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Programmé</>
                      )}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{message.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accès Rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/messaging/sms">
                  <Phone className="mr-2 h-4 w-4 text-blue-500" />
                  Envoi SMS Pro
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/messaging/emails">
                  <Mail className="mr-2 h-4 w-4 text-green-500" />
                  Gestion Emails
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/messaging/notifications">
                  <Bell className="mr-2 h-4 w-4 text-purple-500" />
                  Notifications Auto
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/messaging/forum">
                  <MessageSquare className="mr-2 h-4 w-4 text-orange-500" />
                  Forum Interne
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Répartition des Canaux</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPie>
                  <Pie
                    data={channelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activité de la Semaine</CardTitle>
          <CardDescription>Volume d'envois par type et par jour</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sms" fill="hsl(var(--primary))" name="SMS" />
              <Bar dataKey="email" fill="hsl(var(--chart-2))" name="Email" />
              <Bar dataKey="notification" fill="hsl(var(--chart-3))" name="Notification" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => toast.info("Fonctionnalité: Groupes de Contact")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Groupes de Contact</h3>
                <p className="text-sm text-muted-foreground">{contactGroups.length} groupes configurés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => toast.info("Fonctionnalité: Modèles de Messages")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Modèles de Messages</h3>
                <p className="text-sm text-muted-foreground">5 modèles disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => toast.info("Fonctionnalité: Messages Programmés")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Messages Programmés</h3>
                <p className="text-sm text-muted-foreground">3 en attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => toast.info("Fonctionnalité: Statistiques Avancées")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Statistiques</h3>
                <p className="text-sm text-muted-foreground">Rapports détaillés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
