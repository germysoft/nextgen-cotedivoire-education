import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Users, GraduationCap, BookOpen, DollarSign, TrendingUp, UserCheck, 
  AlertCircle, Calendar, MessageSquare, Clock, Archive, Wallet, FileText,
  Bell, Activity, BarChart3, PieChart, Users2, School, ClipboardCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPie, Pie, Cell, Area, AreaChart } from "recharts";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

const enrollmentData = [
  { name: "6ème", students: 120 },
  { name: "5ème", students: 115 },
  { name: "4ème", students: 108 },
  { name: "3ème", students: 98 },
  { name: "2nde", students: 95 },
  { name: "1ère", students: 88 },
  { name: "Tle", students: 76 },
];

const performanceData = [
  { month: "Sept", moyenne: 12.5, taux: 94 },
  { month: "Oct", moyenne: 13.2, taux: 95 },
  { month: "Nov", moyenne: 13.8, taux: 93 },
  { month: "Déc", moyenne: 14.1, taux: 96 },
  { month: "Jan", moyenne: 13.9, taux: 94 },
];

const financialData = [
  { name: "Scolarité", value: 45000000 },
  { name: "Cantine", value: 8500000 },
  { name: "Transport", value: 6200000 },
  { name: "Activités", value: 3500000 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function Dashboard() {
  const { t } = useLanguage();

  const recentActivities = [
    { id: 1, type: t('students.addNew'), description: "KOUASSI Jean", time: `${t('time.ago')} 2h`, icon: Users, color: "bg-primary" },
    { id: 2, type: t('finance.payment'), description: `${t('finance.tuitionFees')} - 6ème A`, time: `${t('time.ago')} 3h`, icon: DollarSign, color: "bg-accent" },
    { id: 3, type: t('grades.title'), description: "1ère C - Mathématiques", time: `${t('time.ago')} 5h`, icon: BookOpen, color: "bg-chart-2" },
    { id: 4, type: t('hr.evaluations'), description: "3ème B", time: t('time.yesterday'), icon: Calendar, color: "bg-chart-3" },
  ];

  const alerts = [
    { id: 1, type: "urgent", title: t('finance.overdue'), description: "15 élèves avec plus de 3 mois d'impayés", count: 15 },
    { id: 2, type: "warning", title: t('hr.absent'), description: "8 élèves absents plus de 5 jours", count: 8 },
    { id: 3, type: "info", title: "Documents", description: "23 dossiers incomplets", count: 23 },
    { id: 4, type: "success", title: t('bulletins.title'), description: "Tous les bulletins T1 sont prêts", count: 28 },
  ];

  const messageStats = [
    { type: t('messaging.sms'), value: 1245, change: "+18%", icon: MessageSquare },
    { type: t('messaging.email'), value: 567, change: "+12%", icon: FileText },
    { type: t('messaging.notifications'), value: 2340, change: "+25%", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          {t('dashboard.exportReport')}
        </Button>
      </div>

      {/* Vue Globale - Always visible */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.totalStudents')}
          value="700"
          change={`+12% ${t('dashboard.thisMonth')}`}
          changeType="positive"
          icon={Users}
          iconColor="bg-primary"
        />
        <StatCard
          title={t('dashboard.teachers')}
          value="45"
          change={`3 ${t('dashboard.new')}`}
          changeType="positive"
          icon={GraduationCap}
          iconColor="bg-accent"
        />
        <StatCard
          title={t('dashboard.classes')}
          value="28"
          icon={BookOpen}
          iconColor="bg-chart-2"
        />
        <StatCard
          title={t('dashboard.attendance')}
          value="94.5%"
          change="+2.1%"
          changeType="positive"
          icon={UserCheck}
          iconColor="bg-chart-3"
        />
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
          <TabsTrigger value="global">{t('dashboard.globalView')}</TabsTrigger>
          <TabsTrigger value="admin">{t('dashboard.administrative')}</TabsTrigger>
          <TabsTrigger value="pedagogique">{t('dashboard.pedagogical')}</TabsTrigger>
          <TabsTrigger value="scolarite">{t('dashboard.tuition')}</TabsTrigger>
          <TabsTrigger value="finance">{t('dashboard.accountingTab')}</TabsTrigger>
          <TabsTrigger value="messaging">{t('dashboard.messagingTab')}</TabsTrigger>
          <TabsTrigger value="alerts">{t('dashboard.alertsTab')}</TabsTrigger>
        </TabsList>

        {/* Vue Globale */}
        <TabsContent value="global" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.enrollmentByLevel')}</CardTitle>
                <CardDescription>{t('dashboard.studentDistribution')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="students" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.performanceEvolution')}</CardTitle>
                <CardDescription>{t('dashboard.academicPerformance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[0, 20]} className="text-xs" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="moyenne" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--accent))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('dashboard.recentActivities')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${activity.color}`}>
                        <activity.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  {t('dashboard.newEnrollment')}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('dashboard.enterGrades')}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t('dashboard.recordPayment')}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {t('dashboard.addTeacher')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Administratif */}
        <TabsContent value="admin" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Personnel Total</CardTitle>
                <Users2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68</div>
                <p className="text-xs text-muted-foreground">45 Enseignants, 23 Administratifs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux Présence RH</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">97.2%</div>
                <Progress value={97.2} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Congés en cours</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 Enseignants, 1 Administratif</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Masse Salariale</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.5M</div>
                <p className="text-xs text-muted-foreground">FCFA / mois</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pointage Quotidien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">À l'heure</span>
                  <span className="text-2xl font-bold text-green-600">62</span>
                </div>
                <Progress value={91.2} className="h-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Retards: 4</span>
                  <span>Absences: 2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pédagogique */}
        <TabsContent value="pedagogique" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours Dispensés</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Ce trimestre</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">13.8/20</div>
                <p className="text-xs text-green-600">+0.6 vs T1</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux Réussite</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <Progress value={87.3} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Matière</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { matiere: "Mathématiques", moyenne: 14.2, progression: +0.8 },
                    { matiere: "Français", moyenne: 13.5, progression: +0.3 },
                    { matiere: "Anglais", moyenne: 13.8, progression: -0.2 },
                    { matiere: "SVT", moyenne: 14.5, progression: +1.2 },
                    { matiere: "Histoire-Géo", moyenne: 13.1, progression: +0.5 },
                  ].map((item) => (
                    <div key={item.matiere} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.matiere}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{item.moyenne}/20</span>
                          <Badge variant={item.progression > 0 ? "default" : "secondary"}>
                            {item.progression > 0 ? "+" : ""}{item.progression}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(item.moyenne / 20) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conseils de Classe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { classe: "6ème A", date: "15 Déc 2024", status: "Complété", color: "bg-green-500" },
                    { classe: "5ème B", date: "16 Déc 2024", status: "Complété", color: "bg-green-500" },
                    { classe: "4ème C", date: "18 Déc 2024", status: "En cours", color: "bg-yellow-500" },
                    { classe: "3ème A", date: "19 Déc 2024", status: "Planifié", color: "bg-blue-500" },
                    { classe: "2nde B", date: "20 Déc 2024", status: "Planifié", color: "bg-blue-500" },
                  ].map((conseil) => (
                    <div key={conseil.classe} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${conseil.color}`} />
                        <div>
                          <p className="font-medium">{conseil.classe}</p>
                          <p className="text-xs text-muted-foreground">{conseil.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{conseil.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scolarité */}
        <TabsContent value="scolarite" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inscriptions 2024</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">687</div>
                <p className="text-xs text-green-600">+8% vs 2023</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dossiers Complets</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">664</div>
                <Progress value={96.7} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absences ce mois</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">18 justifiées, 106 non justifiées</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux Assiduité</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <Progress value={94.5} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Taux de Présence Mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis domain={[85, 100]} className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="taux" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comptabilité */}
        <TabsContent value="finance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recettes Totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">63.2M</div>
                <p className="text-xs text-muted-foreground">FCFA ce mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.8M</div>
                <p className="text-xs text-muted-foreground">FCFA ce mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solde</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20.4M</div>
                <p className="text-xs text-green-600">+32% bénéfice</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux Recouvrement</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <Progress value={78.5} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Recettes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={financialData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M FCFA`} />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>État des Paiements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payés à jour</span>
                    <span className="font-bold text-green-600">542 élèves</span>
                  </div>
                  <Progress value={77.4} className="bg-green-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retard 1 mois</span>
                    <span className="font-bold text-yellow-600">89 élèves</span>
                  </div>
                  <Progress value={12.7} className="bg-yellow-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retard 2+ mois</span>
                    <span className="font-bold text-red-600">69 élèves</span>
                  </div>
                  <Progress value={9.9} className="bg-red-100" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Messagerie */}
        <TabsContent value="messaging" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {messageStats.map((stat) => (
              <Card key={stat.type}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.type}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600">{stat.change} ce mois</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Messages par Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { canal: "SMS Parents", count: 1245, percent: 54 },
                    { canal: "Email Enseignants", count: 567, percent: 25 },
                    { canal: "Notifications App", count: 483, percent: 21 },
                  ].map((item) => (
                    <div key={item.canal} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.canal}</span>
                        <span className="font-bold">{item.count}</span>
                      </div>
                      <Progress value={item.percent} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Messages Récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "SMS", dest: "Parents 6ème", msg: "Réunion demain 15h", time: "Il y a 1h" },
                    { type: "Email", dest: "Enseignants", msg: "Planning T2 disponible", time: "Il y a 2h" },
                    { type: "Notif", dest: "Tous", msg: "Fermeture exceptionnelle", time: "Il y a 4h" },
                    { type: "SMS", dest: "Parents 3ème", msg: "Résultats examens", time: "Il y a 5h" },
                  ].map((msg, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-lg border p-3">
                      <Badge variant="outline">{msg.type}</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{msg.dest}</p>
                        <p className="text-xs text-muted-foreground">{msg.msg}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alertes */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {alerts.map((alert) => (
              <Card key={alert.id} className={
                alert.type === 'urgent' ? 'border-red-500' :
                alert.type === 'warning' ? 'border-yellow-500' :
                alert.type === 'success' ? 'border-green-500' :
                'border-blue-500'
              }>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className={
                        alert.type === 'urgent' ? 'h-5 w-5 text-red-500' :
                        alert.type === 'warning' ? 'h-5 w-5 text-yellow-500' :
                        alert.type === 'success' ? 'h-5 w-5 text-green-500' :
                        'h-5 w-5 text-blue-500'
                      } />
                      <div>
                        <CardTitle className="text-base">{alert.title}</CardTitle>
                        <CardDescription className="mt-1">{alert.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={
                      alert.type === 'urgent' ? 'destructive' :
                      alert.type === 'warning' ? 'default' :
                      alert.type === 'success' ? 'default' :
                      'secondary'
                    }>
                      {alert.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Voir les détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historique des Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Aujourd'hui 14:30", type: "Impayés", message: "15 nouveaux impayés détectés", status: "Non traité" },
                  { date: "Aujourd'hui 09:15", type: "Absence", message: "8 élèves absents sans justification", status: "En cours" },
                  { date: "Hier 16:45", type: "Documents", message: "23 dossiers incomplets", status: "Traité" },
                  { date: "Hier 11:20", type: "Notes", message: "Validation bulletins T1 complète", status: "Traité" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.message}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === "Traité" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
