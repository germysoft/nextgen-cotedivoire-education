import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Send, User, Calendar, CheckCircle, Clock, AlertTriangle, Settings, Plus, Search, Filter, Trash2, Edit, Eye, Phone, Mail, Smartphone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { scheduledMessages, contactGroups } from "@/data/mockMessaging";

const notificationTypes = [
  { id: 'absence', name: 'Absences', description: 'Notification immédiate aux parents en cas d\'absence', active: true, channel: ['sms', 'email'], delay: 'immédiat' },
  { id: 'retard', name: 'Retards', description: 'Alerte après pointage en début de cours', active: true, channel: ['sms'], delay: 'immédiat' },
  { id: 'notes', name: 'Nouvelles Notes', description: 'Quand de nouvelles notes sont publiées', active: true, channel: ['email', 'app'], delay: '24h' },
  { id: 'bulletin', name: 'Bulletins Disponibles', description: 'Notification lors de la publication des bulletins', active: true, channel: ['sms', 'email'], delay: 'immédiat' },
  { id: 'paiement', name: 'Rappels Paiement', description: 'Rappel automatique avant échéance', active: true, channel: ['sms', 'email'], delay: '3 jours avant' },
  { id: 'reunion', name: 'Convocations Réunions', description: 'Invitations aux réunions parents-professeurs', active: true, channel: ['email'], delay: '1 semaine avant' },
  { id: 'discipline', name: 'Incidents Discipline', description: 'Notification des sanctions et avertissements', active: false, channel: ['sms', 'email'], delay: 'immédiat' },
  { id: 'evenement', name: 'Événements Scolaires', description: 'Sorties, fêtes, activités parascolaires', active: true, channel: ['email', 'app'], delay: '1 semaine avant' }
];

const notificationHistory = [
  { id: 1, type: 'Absence', destinataire: 'M. KOUAME (Parent 3ème C)', message: 'Votre enfant Jean KOUAME est absent ce jour', date: '12 Déc 2024 08:45', statut: 'Envoyé', canal: 'SMS', lecture: true },
  { id: 2, type: 'Note', destinataire: 'Parents Tle D (45)', message: 'Les notes de Maths T1 sont disponibles', date: '11 Déc 2024 18:00', statut: 'Envoyé', canal: 'Email', lecture: true },
  { id: 3, type: 'Retard', destinataire: 'Mme DIALLO (Parent 1ère A)', message: 'Retard signalé: Arrivée à 8h15', date: '11 Déc 2024 08:20', statut: 'Envoyé', canal: 'SMS', lecture: true },
  { id: 4, type: 'Paiement', destinataire: 'Parents Impayés (65)', message: 'Rappel: Échéance dans 3 jours', date: '10 Déc 2024 10:00', statut: 'Envoyé', canal: 'SMS + Email', lecture: false },
  { id: 5, type: 'Réunion', destinataire: 'Parents 6ème A (25)', message: 'Convocation réunion du 20/12', date: '09 Déc 2024 14:00', statut: 'Envoyé', canal: 'Email', lecture: true },
  { id: 6, type: 'Bulletin', destinataire: 'Tous les Parents (465)', message: 'Bulletins T1 disponibles sur le portail', date: '05 Déc 2024 16:00', statut: 'Envoyé', canal: 'SMS + Email', lecture: true },
];

const statsData = {
  today: { sent: 124, read: 118, pending: 6 },
  week: { sent: 567, read: 534, pending: 12 },
  month: { sent: 2347, read: 2198, pending: 45 },
  byType: [
    { name: 'Absences', count: 456, color: 'hsl(var(--destructive))' },
    { name: 'Notes', count: 389, color: 'hsl(var(--primary))' },
    { name: 'Paiements', count: 234, color: 'hsl(var(--chart-2))' },
    { name: 'Retards', count: 178, color: 'hsl(var(--chart-3))' },
    { name: 'Bulletins', count: 156, color: 'hsl(var(--chart-4))' },
    { name: 'Autres', count: 89, color: 'hsl(var(--chart-5))' }
  ],
  byChannel: [
    { name: 'SMS', count: 1245, percent: 53, readRate: 94.5 },
    { name: 'Email', count: 789, percent: 34, readRate: 87.2 },
    { name: 'App Mobile', count: 313, percent: 13, readRate: 98.1 }
  ],
  evolution: [
    { date: 'Lun', sms: 145, email: 89, app: 34 },
    { date: 'Mar', sms: 167, email: 102, app: 45 },
    { date: 'Mer', sms: 134, email: 78, app: 28 },
    { date: 'Jeu', sms: 189, email: 112, app: 56 },
    { date: 'Ven', sms: 156, email: 98, app: 42 },
    { date: 'Sam', sms: 45, email: 23, app: 12 },
    { date: 'Dim', sms: 12, email: 8, app: 5 }
  ]
};

export default function Notifications() {
  const [isNewNotificationOpen, setIsNewNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [settings, setSettings] = useState(notificationTypes);

  const [newNotification, setNewNotification] = useState({
    type: "",
    recipients: "",
    message: "",
    channel: [] as string[],
    schedule: false,
    scheduledDate: "",
    scheduledTime: ""
  });

  const handleSendNotification = () => {
    if (!newNotification.type || !newNotification.recipients || !newNotification.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success(newNotification.schedule 
      ? `Notification programmée pour le ${newNotification.scheduledDate}` 
      : "Notification envoyée avec succès"
    );
    setIsNewNotificationOpen(false);
    setNewNotification({ type: "", recipients: "", message: "", channel: [], schedule: false, scheduledDate: "", scheduledTime: "" });
  };

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    const setting = settings.find(s => s.id === id);
    toast.success(`Notifications "${setting?.name}" ${setting?.active ? 'désactivées' : 'activées'}`);
  };

  const filteredHistory = notificationHistory.filter(notif => {
    const matchesSearch = notif.destinataire.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || notif.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const COLORS = ['hsl(var(--destructive))', 'hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications Automatiques</h1>
          <p className="text-muted-foreground">Alertes et rappels automatisés pour les parents</p>
        </div>
        <Dialog open={isNewNotificationOpen} onOpenChange={setIsNewNotificationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Envoyer Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvelle Notification</DialogTitle>
              <DialogDescription>Envoyer une notification manuelle</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={newNotification.type} onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Message Personnalisé</SelectItem>
                    <SelectItem value="rappel">Rappel</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destinataires *</Label>
                <Select value={newNotification.recipients} onValueChange={(value) => setNewNotification(prev => ({ ...prev, recipients: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les destinataires" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactGroups.map((group) => (
                      <SelectItem key={group.id} value={group.name}>{group.name} ({group.memberCount})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message *</Label>
                <Textarea 
                  placeholder="Contenu de la notification..."
                  rows={4}
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Canaux d'envoi</Label>
                <div className="flex gap-4">
                  {['sms', 'email', 'app'].map((channel) => (
                    <label key={channel} className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={newNotification.channel.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification(prev => ({ ...prev, channel: [...prev.channel, channel] }));
                          } else {
                            setNewNotification(prev => ({ ...prev, channel: prev.channel.filter(c => c !== channel) }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={newNotification.schedule}
                  onCheckedChange={(checked) => setNewNotification(prev => ({ ...prev, schedule: checked }))}
                />
                <Label>Programmer l'envoi</Label>
              </div>
              {newNotification.schedule && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date"
                      value={newNotification.scheduledDate}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure</Label>
                    <Input 
                      type="time"
                      value={newNotification.scheduledTime}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewNotificationOpen(false)}>Annuler</Button>
              <Button onClick={handleSendNotification}>
                <Send className="mr-2 h-4 w-4" />
                {newNotification.schedule ? "Programmer" : "Envoyer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envoyées Aujourd'hui</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.today.sent}</div>
            <p className="text-xs text-green-600">{statsData.today.read} lues ({Math.round(statsData.today.read/statsData.today.sent*100)}%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette Semaine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.week.sent}</div>
            <p className="text-xs text-muted-foreground">{statsData.week.pending} en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Lecture</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.5%</div>
            <p className="text-xs text-green-600">SMS ouverts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.month.sent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="scheduled">Programmées</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Historique des Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="Absence">Absences</SelectItem>
                      <SelectItem value="Note">Notes</SelectItem>
                      <SelectItem value="Retard">Retards</SelectItem>
                      <SelectItem value="Paiement">Paiements</SelectItem>
                      <SelectItem value="Bulletin">Bulletins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((notif) => (
                    <TableRow key={notif.id}>
                      <TableCell>
                        <Badge variant="outline">{notif.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{notif.destinataire}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{notif.message}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {notif.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {notif.canal.includes('SMS') && <Phone className="h-4 w-4 text-blue-500" />}
                          {notif.canal.includes('Email') && <Mail className="h-4 w-4 text-green-500" />}
                          {notif.canal.includes('App') && <Smartphone className="h-4 w-4 text-purple-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={notif.statut === "Envoyé" ? "default" : "secondary"}>
                            {notif.statut}
                          </Badge>
                          {notif.lecture && <Eye className="h-4 w-4 text-green-500" />}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notifications Programmées</CardTitle>
                <Badge variant="secondary">{scheduledMessages.filter(m => m.status === 'pending').length} en attente</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledMessages.map((msg) => (
                  <Card key={msg.id} className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">{msg.type}</Badge>
                            <Badge variant={msg.status === 'pending' ? 'default' : msg.status === 'sent' ? 'secondary' : 'destructive'}>
                              {msg.status === 'pending' ? 'En attente' : msg.status === 'sent' ? 'Envoyé' : 'Annulé'}
                            </Badge>
                          </div>
                          <h3 className="font-semibold mb-1">{msg.subject}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{msg.content}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {msg.recipients} ({msg.recipientCount})
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {msg.scheduledAt}
                            </span>
                            <span className="text-xs">Par: {msg.createdBy}</span>
                          </div>
                        </div>
                        {msg.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration des Notifications Automatiques
              </CardTitle>
              <CardDescription>
                Activez ou désactivez les notifications automatiques par type d'événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{setting.name}</h3>
                        <div className="flex gap-1">
                          {setting.channel.includes('sms') && <Phone className="h-3 w-3 text-blue-500" />}
                          {setting.channel.includes('email') && <Mail className="h-3 w-3 text-green-500" />}
                          {setting.channel.includes('app') && <Smartphone className="h-3 w-3 text-purple-500" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">Délai: {setting.delay}</Badge>
                    </div>
                    <Switch 
                      checked={setting.active}
                      onCheckedChange={() => toggleSetting(setting.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData.byType}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statsData.byType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution sur la Semaine</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData.evolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sms" fill="hsl(var(--primary))" name="SMS" />
                    <Bar dataKey="email" fill="hsl(var(--chart-2))" name="Email" />
                    <Bar dataKey="app" fill="hsl(var(--chart-3))" name="App" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Performance par Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {statsData.byChannel.map((channel) => (
                    <div key={channel.name} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {channel.name === 'SMS' && <Phone className="h-5 w-5 text-blue-500" />}
                          {channel.name === 'Email' && <Mail className="h-5 w-5 text-green-500" />}
                          {channel.name === 'App Mobile' && <Smartphone className="h-5 w-5 text-purple-500" />}
                          <span className="font-semibold">{channel.name}</span>
                        </div>
                        <Badge variant="outline">{channel.percent}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Envoyées</span>
                          <span className="font-bold">{channel.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${channel.name === 'SMS' ? 'bg-blue-500' : channel.name === 'Email' ? 'bg-green-500' : 'bg-purple-500'}`}
                            style={{ width: `${channel.percent}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{channel.readRate}%</p>
                        <p className="text-xs text-muted-foreground">Taux de lecture</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
