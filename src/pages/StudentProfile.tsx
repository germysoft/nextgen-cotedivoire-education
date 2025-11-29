import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, GraduationCap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const studentData = {
  "66800001A": { 
    id: "66800001A", 
    name: "KOUASSI Jean", 
    class: "6ème A", 
    age: 12, 
    status: "Actif", 
    fees: "Payé",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    email: "jean.kouassi@email.com",
    phone: "+225 07 12 34 56 78",
    address: "Cocody, Abidjan",
    birthDate: "15/03/2012",
    parent: "KOUASSI Michel",
    parentPhone: "+225 07 98 76 54 32"
  },
  "66800002A": { 
    id: "66800002A", 
    name: "TRAORÉ Marie", 
    class: "5ème B", 
    age: 13, 
    status: "Actif", 
    fees: "Payé",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    email: "marie.traore@email.com",
    phone: "+225 05 23 45 67 89",
    address: "Plateau, Abidjan",
    birthDate: "22/08/2011",
    parent: "TRAORÉ Amadou",
    parentPhone: "+225 07 11 22 33 44"
  },
};

const gradesData = [
  { subject: "Mathématiques", trimester: "1er Trimestre", note: 15.5, coef: 4, moyenne: 14.2 },
  { subject: "Français", trimester: "1er Trimestre", note: 14, coef: 4, moyenne: 13.5 },
  { subject: "Anglais", trimester: "1er Trimestre", note: 16, coef: 3, moyenne: 14.8 },
  { subject: "Histoire-Géo", trimester: "1er Trimestre", note: 13.5, coef: 3, moyenne: 12.9 },
  { subject: "SVT", trimester: "1er Trimestre", note: 15, coef: 2, moyenne: 13.7 },
  { subject: "Physique-Chimie", trimester: "1er Trimestre", note: 14.5, coef: 2, moyenne: 13.2 },
];

const absencesData = [
  { date: "15/11/2024", type: "Absence", motif: "Maladie", justifié: true },
  { date: "08/11/2024", type: "Retard", motif: "Transport", justifié: true },
  { date: "25/10/2024", type: "Absence", motif: "Rendez-vous médical", justifié: true },
  { date: "12/10/2024", type: "Retard", motif: "Non justifié", justifié: false },
];

const paymentsData = [
  { date: "05/09/2024", description: "Frais de scolarité T1", montant: 250000, statut: "Payé", methode: "Virement" },
  { date: "10/10/2024", description: "Cantine - Octobre", montant: 35000, statut: "Payé", methode: "Espèces" },
  { date: "15/11/2024", description: "Transport - Novembre", montant: 25000, statut: "Payé", methode: "Mobile Money" },
  { date: "01/12/2024", description: "Frais de scolarité T2", montant: 250000, statut: "En attente", methode: "-" },
];

const historiqueData = [
  { annee: "2023-2024", classe: "CM2", etablissement: "EPP Cocody", moyenne: 14.8, rang: "3ème/45" },
  { annee: "2022-2023", classe: "CM1", etablissement: "EPP Cocody", moyenne: 15.2, rang: "2ème/42" },
  { annee: "2021-2022", classe: "CE2", etablissement: "EPP Cocody", moyenne: 14.5, rang: "5ème/40" },
];

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const student = studentData[id as keyof typeof studentData];

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Élève non trouvé</h2>
          <Button onClick={() => navigate("/students")} className="mt-4">
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const getNoteColor = (note: number) => {
    if (note >= 16) return "text-success";
    if (note >= 14) return "text-primary";
    if (note >= 10) return "text-warning";
    return "text-destructive";
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "bg-success text-success-foreground";
      case "En attente":
        return "bg-warning text-warning-foreground";
      case "Retard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/students")}
        className="mb-4 hover:bg-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      {/* En-tête du profil */}
      <Card className="shadow-xl border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-lg">
                <AvatarImage src={student.photo} alt={student.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-3xl font-bold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Badge className="mt-4 bg-success/10 text-success border-success/20 px-4 py-1">
                {student.status}
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {student.name}
                </h1>
                <p className="text-muted-foreground text-lg mt-1">Matricule: {student.id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Classe</p>
                    <p className="font-semibold">{student.class}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date de naissance</p>
                    <p className="font-semibold">{student.birthDate} ({student.age} ans)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-sm">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="font-semibold">{student.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Adresse</p>
                    <p className="font-semibold">{student.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Parent / Tuteur</p>
                    <p className="font-semibold">{student.parent}</p>
                    <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets détaillés */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="notes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Notes
          </TabsTrigger>
          <TabsTrigger value="absences" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Absences
          </TabsTrigger>
          <TabsTrigger value="paiements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Paiements
          </TabsTrigger>
          <TabsTrigger value="historique" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Onglet Notes */}
        <TabsContent value="notes">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Notes et Résultats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Matière</TableHead>
                    <TableHead>Trimestre</TableHead>
                    <TableHead className="text-center">Note /20</TableHead>
                    <TableHead className="text-center">Coef.</TableHead>
                    <TableHead className="text-center">Moy. Classe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesData.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">{grade.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{grade.trimester}</TableCell>
                      <TableCell className="text-center">
                        <span className={`text-lg font-bold ${getNoteColor(grade.note)}`}>
                          {grade.note.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{grade.coef}</Badge>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {grade.moyenne.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-6 bg-muted/30 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Moyenne Générale:</span>
                  <span className="text-3xl font-bold text-primary">14.75 / 20</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Absences */}
        <TabsContent value="absences">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle>Absences et Retards</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absencesData.map((absence, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{absence.date}</TableCell>
                      <TableCell>
                        <Badge variant={absence.type === "Absence" ? "destructive" : "secondary"}>
                          {absence.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{absence.motif}</TableCell>
                      <TableCell>
                        <Badge className={absence.justifié ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                          {absence.justifié ? "Justifié" : "Non justifié"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-6 bg-muted/30 border-t grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">3</p>
                  <p className="text-sm text-muted-foreground">Absences</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">2</p>
                  <p className="text-sm text-muted-foreground">Retards</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">1</p>
                  <p className="text-sm text-muted-foreground">Non justifié</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paiements */}
        <TabsContent value="paiements">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle>Historique des Paiements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsData.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {payment.montant.toLocaleString('fr-FR')} FCFA
                      </TableCell>
                      <TableCell className="text-muted-foreground">{payment.methode}</TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(payment.statut)}>
                          {payment.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-6 bg-muted/30 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Payé</p>
                    <p className="text-2xl font-bold text-success">560,000 FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solde Restant</p>
                    <p className="text-2xl font-bold text-warning">250,000 FCFA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="historique">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle>Historique Scolaire</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead className="text-center">Moyenne</TableHead>
                    <TableHead className="text-center">Rang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historiqueData.map((year, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">{year.annee}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{year.classe}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{year.etablissement}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-bold ${getNoteColor(year.moyenne)}`}>
                          {year.moyenne.toFixed(1)} / 20
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {year.rang}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
