import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, Download, Bell, Users, BarChart3, Settings, 
  Shield, RefreshCw, CheckCircle, XCircle, Clock, TrendingUp,
  Apple, Wifi, Battery, Signal, MessageSquare, Eye, Star
} from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

interface AppUser {
  id: string;
  name: string;
  role: "parent" | "student" | "teacher";
  phone: string;
  lastActive: string;
  appVersion: string;
  platform: "android" | "ios";
  notifications: boolean;
}

interface PushNotification {
  id: string;
  title: string;
  message: string;
  target: string;
  sentAt: string;
  delivered: number;
  opened: number;
  status: "sent" | "scheduled" | "draft";
}

const mockAppUsers: AppUser[] = [
  { id: "1", name: "Kouamé Yao", role: "parent", phone: "+225 07 12 34 56", lastActive: "2024-01-15 14:30", appVersion: "2.1.0", platform: "android", notifications: true },
  { id: "2", name: "Diallo Aminata", role: "student", phone: "+225 05 98 76 54", lastActive: "2024-01-15 16:45", appVersion: "2.1.0", platform: "ios", notifications: true },
  { id: "3", name: "M. Kouassi Jean", role: "teacher", phone: "+225 07 45 67 89", lastActive: "2024-01-14 09:15", appVersion: "2.0.5", platform: "android", notifications: false },
  { id: "4", name: "Bamba Fatou", role: "parent", phone: "+225 01 23 45 67", lastActive: "2024-01-13 11:20", appVersion: "2.1.0", platform: "ios", notifications: true },
  { id: "5", name: "Traoré Sekou", role: "student", phone: "+225 07 89 01 23", lastActive: "2024-01-15 08:00", appVersion: "2.0.5", platform: "android", notifications: true },
];

const mockNotifications: PushNotification[] = [
  { id: "1", title: "Réunion parents-professeurs", message: "La réunion aura lieu le 20 janvier à 15h", target: "Parents", sentAt: "2024-01-15 10:00", delivered: 245, opened: 189, status: "sent" },
  { id: "2", title: "Notes du 1er trimestre", message: "Les bulletins sont disponibles", target: "Tous", sentAt: "2024-01-14 14:30", delivered: 512, opened: 423, status: "sent" },
  { id: "3", title: "Rappel paiement", message: "Échéance de paiement dans 3 jours", target: "Parents impayés", sentAt: "2024-01-16 09:00", delivered: 0, opened: 0, status: "scheduled" },
];

const platformDistribution = [
  { name: "Android", value: 65, color: "#22c55e" },
  { name: "iOS", value: 35, color: "#3b82f6" },
];

const dailyActiveUsers = [
  { date: "Lun", users: 245 },
  { date: "Mar", users: 312 },
  { date: "Mer", users: 287 },
  { date: "Jeu", users: 356 },
  { date: "Ven", users: 298 },
  { date: "Sam", users: 156 },
  { date: "Dim", users: 89 },
];

const monthlyDownloads = [
  { month: "Sep", downloads: 120 },
  { month: "Oct", downloads: 180 },
  { month: "Nov", downloads: 245 },
  { month: "Dec", downloads: 310 },
  { month: "Jan", downloads: 425 },
];

const AppMobile = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState("all");

  const stats = {
    totalUsers: mockAppUsers.length,
    activeToday: 3,
    androidUsers: mockAppUsers.filter(u => u.platform === "android").length,
    iosUsers: mockAppUsers.filter(u => u.platform === "ios").length,
    notificationsEnabled: mockAppUsers.filter(u => u.notifications).length,
  };

  const filteredUsers = mockAppUsers.filter(u => 
    selectedPlatform === "all" || u.platform === selectedPlatform
  );

  const sendNotification = () => {
    if (!notificationTitle || !notificationMessage) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success("Notification envoyée avec succès");
    setNotificationTitle("");
    setNotificationMessage("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Application Mobile</h1>
          <p className="text-muted-foreground">Gestion de l'application mobile parents/élèves</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Téléchargement APK Android en cours...")}>
            <Download className="h-4 w-4 mr-2" />
            APK Android
          </Button>
          <Button variant="outline" onClick={() => toast.success("Redirection vers l'App Store...")}>
            <Apple className="h-4 w-4 mr-2" />
            App Store
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Wifi className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actifs aujourd'hui</p>
                <p className="text-2xl font-bold">{stats.activeToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/10 rounded-lg">
                <Smartphone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Android</p>
                <p className="text-2xl font-bold">{stats.androidUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Apple className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">iOS</p>
                <p className="text-2xl font-bold">{stats.iosUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notif. activées</p>
                <p className="text-2xl font-bold">{stats.notificationsEnabled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications Push</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Plateforme" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="ios">iOS</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Rechercher un utilisateur..." className="max-w-sm" />
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Plateforme</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead>Notifications</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "parent" ? "default" : user.role === "student" ? "secondary" : "outline"}>
                          {user.role === "parent" ? "Parent" : user.role === "student" ? "Élève" : "Enseignant"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.platform === "android" ? (
                            <Smartphone className="h-4 w-4 text-green-500" />
                          ) : (
                            <Apple className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="capitalize">{user.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.appVersion}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        {user.notifications ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Envoyer une notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input 
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="Titre de la notification"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Contenu de la notification..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destinataires</Label>
                  <Select value={notificationTarget} onValueChange={setNotificationTarget}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les utilisateurs</SelectItem>
                      <SelectItem value="parents">Parents uniquement</SelectItem>
                      <SelectItem value="students">Élèves uniquement</SelectItem>
                      <SelectItem value="teachers">Enseignants uniquement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={sendNotification} className="flex-1">
                    <Bell className="h-4 w-4 mr-2" />
                    Envoyer maintenant
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("Notification planifiée pour demain 9h00")}>
                    <Clock className="h-4 w-4 mr-2" />
                    Planifier
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{notif.title}</h4>
                      <Badge variant={notif.status === "sent" ? "default" : notif.status === "scheduled" ? "secondary" : "outline"}>
                        {notif.status === "sent" ? "Envoyée" : notif.status === "scheduled" ? "Planifiée" : "Brouillon"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Cible: {notif.target}</span>
                      <span>Délivrées: {notif.delivered}</span>
                      <span>Ouvertes: {notif.opened}</span>
                      {notif.delivered > 0 && (
                        <span className="text-green-500">
                          {Math.round((notif.opened / notif.delivered) * 100)}% ouverture
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par plateforme</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs actifs quotidiens</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyActiveUsers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Téléchargements mensuels</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyDownloads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="downloads" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration générale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode maintenance</p>
                    <p className="text-sm text-muted-foreground">Désactiver l'accès à l'application</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mise à jour forcée</p>
                    <p className="text-sm text-muted-foreground">Obliger la mise à jour de l'app</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications actives</p>
                    <p className="text-sm text-muted-foreground">Autoriser l'envoi de notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Versions de l'application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Android</span>
                    </div>
                    <Badge>v2.1.0</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Dernière mise à jour: 10 Jan 2024</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Apple className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">iOS</span>
                    </div>
                    <Badge>v2.1.0</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Dernière mise à jour: 12 Jan 2024</p>
                </div>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Publier nouvelle version
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppMobile;
