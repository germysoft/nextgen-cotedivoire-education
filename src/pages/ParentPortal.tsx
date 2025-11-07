import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  GraduationCap,
  Award,
  TrendingDown
} from "lucide-react";
import { toast } from "sonner";
import NotificationCenter, { type Notification } from "@/components/parent/NotificationCenter";

// Mock student data
const mockStudent = {
  matricule: "66800001A",
  name: "Kouassi Jean-Marc",
  class: "6èmeA",
  photo: "/placeholder.svg",
  birthDate: "2012-05-15",
  parent: "M. Kouassi Yao",
  phone: "+225 07 12 34 56 78",
  email: "kouassi.yao@email.ci"
};

const mockGrades = [
  { trimester: "1er Trimestre", subject: "Mathématiques", coef: 4, note: 14.5, moyenne: 12.3, rank: 8 },
  { trimester: "1er Trimestre", subject: "Français", coef: 4, note: 13.0, moyenne: 11.8, rank: 12 },
  { trimester: "1er Trimestre", subject: "Anglais", coef: 3, note: 15.5, moyenne: 13.2, rank: 5 },
  { trimester: "1er Trimestre", subject: "Histoire-Géo", coef: 3, note: 12.0, moyenne: 11.5, rank: 15 },
  { trimester: "1er Trimestre", subject: "SVT", coef: 2, note: 16.0, moyenne: 12.8, rank: 3 },
  { trimester: "1er Trimestre", subject: "EPS", coef: 1, note: 17.0, moyenne: 14.5, rank: 2 },
];

const mockAttendance = [
  { date: "2024-11-05", status: "Présent", course: "Mathématiques" },
  { date: "2024-11-04", status: "Présent", course: "Français" },
  { date: "2024-11-03", status: "Absent", course: "Anglais", justified: true },
  { date: "2024-11-02", status: "Retard", course: "Histoire-Géo" },
  { date: "2024-11-01", status: "Présent", course: "SVT" },
];

const mockPayments = [
  { date: "2024-10-01", type: "Scolarité T1", amount: 150000, status: "Payé", receipt: "REC-2024-001" },
  { date: "2024-09-15", type: "Inscription", amount: 50000, status: "Payé", receipt: "REC-2024-000" },
  { date: "2024-09-15", type: "Bibliothèque", amount: 15000, status: "Payé", receipt: "REC-2024-002" },
  { date: "2024-12-01", type: "Scolarité T2", amount: 150000, status: "En attente", receipt: "-" },
];

const mockBulletins = [
  { year: "2023-2024", trimester: "3ème Trimestre", moyenne: 13.8, rank: 9, total: 42, status: "Validé" },
  { year: "2023-2024", trimester: "2ème Trimestre", moyenne: 13.2, rank: 11, total: 42, status: "Validé" },
  { year: "2023-2024", trimester: "1er Trimestre", moyenne: 12.9, rank: 13, total: 42, status: "Validé" },
];

export default function ParentPortal() {
  const navigate = useNavigate();
  const [selectedTrimester] = useState("1er Trimestre");

  const moyenneGenerale = mockGrades.reduce((acc, g) => acc + (g.note * g.coef), 0) / 
                          mockGrades.reduce((acc, g) => acc + g.coef, 0);
  
  const absences = mockAttendance.filter(a => a.status === "Absent").length;
  const retards = mockAttendance.filter(a => a.status === "Retard").length;
  const pendingPayments = mockPayments.filter(p => p.status === "En attente").length;

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate("/parent-login");
  };

  const handleDownloadBulletin = () => {
    toast.success("Téléchargement du bulletin en cours...");
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to the appropriate tab based on notification type
    const tabMap = {
      absence: "attendance",
      retard: "attendance",
      note: "grades",
      paiement: "payments",
    };
    
    toast.info("Navigation vers " + notification.title);
    // You could add tab switching logic here
  };

  // Simulate real-time notifications for demo
  useEffect(() => {
    // Show a welcome notification after 2 seconds
    const timer = setTimeout(() => {
      toast.info("Bienvenue sur le Portail Parents", {
        description: "Vous avez des notifications non lues à consulter",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Portail Parents & Élèves</h1>
                <p className="text-xs text-muted-foreground">NextGen Éducation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter onNotificationClick={handleNotificationClick} />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Student Info Card */}
        <Card className="border-l-4 border-l-primary shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{mockStudent.name}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Classe: <span className="font-medium text-foreground">{mockStudent.class}</span>
                    </span>
                    <span>•</span>
                    <span>Matricule: <span className="font-mono font-medium text-foreground">{mockStudent.matricule}</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Parent: {mockStudent.parent}</p>
                </div>
              </div>
              <Button onClick={handleDownloadBulletin}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger Bulletin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{moyenneGenerale.toFixed(2)}/20</div>
              <Progress value={(moyenneGenerale / 20) * 100} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2">{selectedTrimester}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absences</CardTitle>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{absences}</div>
              <p className="text-xs text-muted-foreground mt-3">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retards</CardTitle>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{retards}</div>
              <p className="text-xs text-muted-foreground mt-3">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements</CardTitle>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {pendingPayments > 0 ? (
                  <span className="text-destructive">{pendingPayments}</span>
                ) : (
                  <span className="text-success">À jour</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {pendingPayments > 0 ? "en attente" : "Tous payés"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Suivi Scolaire Complet
            </CardTitle>
            <CardDescription>
              Consultez toutes les informations concernant la scolarité de votre enfant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="grades" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger value="grades" className="flex flex-col gap-1 py-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Notes</span>
                </TabsTrigger>
                <TabsTrigger value="bulletins" className="flex flex-col gap-1 py-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Bulletins</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="flex flex-col gap-1 py-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">Assiduité</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex flex-col gap-1 py-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs">Paiements</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="flex flex-col gap-1 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-xs">Informations</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="grades" className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedTrimester}</h3>
                    <p className="text-sm text-muted-foreground">Résultats académiques</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      Moyenne: {moyenneGenerale.toFixed(2)}/20
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {moyenneGenerale >= 10 ? "✓ Admis" : "⚠ Sous la moyenne"}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Matière</TableHead>
                        <TableHead className="text-center">Coef</TableHead>
                        <TableHead className="text-center">Note</TableHead>
                        <TableHead className="text-center">Moy. Classe</TableHead>
                        <TableHead className="text-center">Rang</TableHead>
                        <TableHead className="text-center">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockGrades.map((grade, index) => {
                        const performance = ((grade.note - grade.moyenne) / grade.moyenne) * 100;
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                </div>
                                {grade.subject}
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">{grade.coef}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={grade.note >= 10 ? "default" : "destructive"} className="min-w-[60px]">
                                {grade.note}/20
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">{grade.moyenne}/20</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{grade.rank}ème</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {performance > 0 ? (
                                  <>
                                    <TrendingUp className="h-3 w-3 text-success" />
                                    <span className="text-xs text-success">+{performance.toFixed(0)}%</span>
                                  </>
                                ) : (
                                  <>
                                    <TrendingDown className="h-3 w-3 text-destructive" />
                                    <span className="text-xs text-destructive">{performance.toFixed(0)}%</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="bulletins" className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold">Historique des Bulletins</h3>
                  <p className="text-sm text-muted-foreground">Consultez et téléchargez les bulletins scolaires</p>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Année Scolaire</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead className="text-center">Moyenne</TableHead>
                        <TableHead className="text-center">Classement</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBulletins.map((bulletin, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {bulletin.year}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{bulletin.trimester}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="default" className="min-w-[60px]">{bulletin.moyenne}/20</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{bulletin.rank}ème / {bulletin.total}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                              {bulletin.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={handleDownloadBulletin}>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <Card className="border-l-4 border-l-success">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Taux de présence</p>
                          <p className="text-2xl font-bold text-success">
                            {((mockAttendance.filter(a => a.status === "Présent").length / mockAttendance.length) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-success/30" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-destructive">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Absences</p>
                          <p className="text-2xl font-bold text-destructive">{absences}</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-destructive/30" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-warning">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Retards</p>
                          <p className="text-2xl font-bold text-warning">{retards}</p>
                        </div>
                        <Clock className="h-8 w-8 text-warning/30" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Cours</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-center">Justification</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAttendance.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {record.date}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{record.course}</TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={
                                record.status === "Présent" ? "default" :
                                record.status === "Absent" ? "destructive" :
                                "outline"
                              }
                              className="min-w-[80px]"
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {record.status === "Absent" && (
                              <Badge variant={record.justified ? "secondary" : "destructive"}>
                                {record.justified ? "✓ Justifié" : "✗ Non justifié"}
                              </Badge>
                            )}
                            {record.status === "Retard" && (
                              <Badge variant="outline" className="text-warning border-warning/50">
                                À justifier
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <Card className="border-l-4 border-l-success">
                    <CardContent className="pt-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Payé</p>
                        <p className="text-2xl font-bold text-success">
                          {mockPayments.filter(p => p.status === "Payé").reduce((acc, p) => acc + p.amount, 0).toLocaleString()} FCFA
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-destructive">
                    <CardContent className="pt-6">
                      <div>
                        <p className="text-sm text-muted-foreground">En Attente</p>
                        <p className="text-2xl font-bold text-destructive">
                          {mockPayments.filter(p => p.status === "En attente").reduce((acc, p) => acc + p.amount, 0).toLocaleString()} FCFA
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Année</p>
                        <p className="text-2xl font-bold text-primary">
                          {mockPayments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()} FCFA
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-center">Reçu</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPayments.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {payment.date}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{payment.type}</TableCell>
                          <TableCell className="font-mono text-right font-bold">
                            {payment.amount.toLocaleString()} FCFA
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={payment.status === "Payé" ? "default" : "destructive"}
                              className="min-w-[90px]"
                            >
                              {payment.status === "Payé" ? "✓ Payé" : "⚠ En attente"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-center">{payment.receipt}</TableCell>
                          <TableCell className="text-right">
                            {payment.status === "Payé" ? (
                              <Button size="sm" variant="outline" onClick={handleDownloadBulletin}>
                                <Download className="mr-2 h-4 w-4" />
                                Reçu
                              </Button>
                            ) : (
                              <Button size="sm" onClick={() => toast.info("Fonction de paiement à venir")}>
                                Payer maintenant
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Informations Élève
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Nom complet:</span>
                        <span className="text-sm font-medium">{mockStudent.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Matricule:</span>
                        <Badge variant="outline" className="font-mono">{mockStudent.matricule}</Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Classe:</span>
                        <Badge variant="secondary">{mockStudent.class}</Badge>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Date de naissance:</span>
                        <span className="text-sm font-medium">{mockStudent.birthDate}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-accent">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-accent" />
                        Contact Parent
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Nom:</span>
                        <span className="text-sm font-medium">{mockStudent.parent}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Téléphone:</span>
                        <span className="text-sm font-medium font-mono">{mockStudent.phone}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm font-medium break-all">{mockStudent.email}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base">Résumé de l'Année Scolaire</CardTitle>
                    <CardDescription>Vue d'ensemble des performances et de l'assiduité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Moyenne annuelle estimée</p>
                        <p className="text-2xl font-bold text-primary">{moyenneGenerale.toFixed(2)}/20</p>
                        <Progress value={(moyenneGenerale / 20) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Taux de présence</p>
                        <p className="text-2xl font-bold text-success">
                          {((mockAttendance.filter(a => a.status === "Présent").length / mockAttendance.length) * 100).toFixed(0)}%
                        </p>
                        <Progress value={(mockAttendance.filter(a => a.status === "Présent").length / mockAttendance.length) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Paiements</p>
                        <p className="text-2xl font-bold">
                          {pendingPayments === 0 ? (
                            <span className="text-success">À jour</span>
                          ) : (
                            <span className="text-destructive">{pendingPayments} en attente</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
