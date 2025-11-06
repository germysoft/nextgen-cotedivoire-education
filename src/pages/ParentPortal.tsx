import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

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
  const [selectedTrimester] = useState("1er Trimestre");

  const moyenneGenerale = mockGrades.reduce((acc, g) => acc + (g.note * g.coef), 0) / 
                          mockGrades.reduce((acc, g) => acc + g.coef, 0);
  
  const absences = mockAttendance.filter(a => a.status === "Absent").length;
  const retards = mockAttendance.filter(a => a.status === "Retard").length;
  const pendingPayments = mockPayments.filter(p => p.status === "En attente").length;

  return (
    <div className="space-y-6 p-6">
      {/* Student Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{mockStudent.name}</h1>
            <p className="text-muted-foreground">Classe: {mockStudent.class} • Matricule: {mockStudent.matricule}</p>
            <p className="text-sm text-muted-foreground mt-1">Parent: {mockStudent.parent}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Télécharger Bulletin
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moyenneGenerale.toFixed(2)}/20</div>
            <p className="text-xs text-muted-foreground">{selectedTrimester}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absences</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{absences}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retards}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingPayments > 0 ? (
                <span className="text-destructive">{pendingPayments}</span>
              ) : (
                <span className="text-green-600">À jour</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments > 0 ? "en attente" : "Tous payés"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi Scolaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grades">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="grades">Notes</TabsTrigger>
              <TabsTrigger value="bulletins">Bulletins</TabsTrigger>
              <TabsTrigger value="attendance">Assiduité</TabsTrigger>
              <TabsTrigger value="payments">Paiements</TabsTrigger>
              <TabsTrigger value="info">Informations</TabsTrigger>
            </TabsList>

            <TabsContent value="grades" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedTrimester}</h3>
                <Badge variant="outline">Moyenne: {moyenneGenerale.toFixed(2)}/20</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Coef</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Moyenne Classe</TableHead>
                    <TableHead>Rang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGrades.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {grade.subject}
                        </div>
                      </TableCell>
                      <TableCell>{grade.coef}</TableCell>
                      <TableCell>
                        <Badge variant={grade.note >= 10 ? "default" : "destructive"}>
                          {grade.note}/20
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{grade.moyenne}/20</TableCell>
                      <TableCell>{grade.rank}ème</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="bulletins" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Rang</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBulletins.map((bulletin, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{bulletin.year}</TableCell>
                      <TableCell>{bulletin.trimester}</TableCell>
                      <TableCell>
                        <Badge variant="default">{bulletin.moyenne}/20</Badge>
                      </TableCell>
                      <TableCell>{bulletin.rank}ème / {bulletin.total}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{bulletin.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <FileText className="mr-2 h-4 w-4" />
                          Télécharger
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Cours</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Justification</TableHead>
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
                      <TableCell>
                        <Badge 
                          variant={
                            record.status === "Présent" ? "default" :
                            record.status === "Absent" ? "destructive" :
                            "outline"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === "Absent" && (
                          <Badge variant={record.justified ? "secondary" : "destructive"}>
                            {record.justified ? "Justifié" : "Non justifié"}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Reçu</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{payment.date}</TableCell>
                      <TableCell className="font-medium">{payment.type}</TableCell>
                      <TableCell className="font-mono">
                        {payment.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "Payé" ? "default" : "destructive"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{payment.receipt}</TableCell>
                      <TableCell className="text-right">
                        {payment.status === "Payé" ? (
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm">Payer</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations Élève</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nom complet:</span>
                      <span className="text-sm font-medium">{mockStudent.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Matricule:</span>
                      <span className="text-sm font-medium font-mono">{mockStudent.matricule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Classe:</span>
                      <span className="text-sm font-medium">{mockStudent.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date de naissance:</span>
                      <span className="text-sm font-medium">{mockStudent.birthDate}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Parent</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nom:</span>
                      <span className="text-sm font-medium">{mockStudent.parent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Téléphone:</span>
                      <span className="text-sm font-medium font-mono">{mockStudent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm font-medium">{mockStudent.email}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
