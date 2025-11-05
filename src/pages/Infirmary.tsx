import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Plus, 
  Search,
  AlertCircle,
  Activity,
  Users,
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const mockMedicalRecords = [
  { 
    id: 1, 
    student: "Kouassi Jean", 
    matricule: "66800001A", 
    bloodType: "O+", 
    allergies: "Arachide", 
    conditions: "Asthme",
    lastVisit: "2024-10-15"
  },
  { 
    id: 2, 
    student: "Diallo Fatou", 
    matricule: "66800002A", 
    bloodType: "A+", 
    allergies: "Aucune", 
    conditions: "-",
    lastVisit: "2024-09-20"
  },
  { 
    id: 3, 
    student: "Traoré Yao", 
    matricule: "66800003A", 
    bloodType: "B+", 
    allergies: "Pénicilline", 
    conditions: "Diabète",
    lastVisit: "2024-11-01"
  },
];

const mockVisits = [
  { id: 1, student: "Kouassi Jean", date: "2024-11-05", time: "09:30", reason: "Maux de tête", treatment: "Paracétamol", status: "Traité" },
  { id: 2, student: "Bamba Aya", date: "2024-11-05", time: "10:15", reason: "Fièvre", treatment: "Repos + Médicaments", status: "En cours" },
  { id: 3, student: "Traoré Yao", date: "2024-11-04", time: "14:00", reason: "Contrôle diabète", treatment: "Surveillance", status: "Traité" },
];

export default function Infirmary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);

  const totalVisits = mockVisits.length;
  const activeAlerts = mockMedicalRecords.filter(r => r.conditions !== "-").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Infirmerie</h1>
          <p className="text-muted-foreground">Gestion médicale et santé des élèves</p>
        </div>
        <Dialog open={isNewVisitOpen} onOpenChange={setIsNewVisitOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enregistrer une consultation</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Élève</Label>
                <Input placeholder="Nom ou matricule de l'élève" />
              </div>
              <div className="space-y-2">
                <Label>Motif de consultation</Label>
                <Textarea placeholder="Décrire les symptômes..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Traitement prescrit</Label>
                <Textarea placeholder="Médicaments ou soins administrés..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Observations</Label>
                <Textarea placeholder="Remarques ou instructions..." rows={2} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewVisitOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsNewVisitOpen(false)}>
                  Enregistrer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Médicales</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Conditions à surveiller</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fiches Médicales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedicalRecords.length}</div>
            <p className="text-xs text-muted-foreground">Dossiers actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Aujourd'hui</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockVisits.filter(v => v.date === "2024-11-05").length}
            </div>
            <p className="text-xs text-muted-foreground">Consultations du jour</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion Médicale</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visits">
            <TabsList>
              <TabsTrigger value="visits">Consultations</TabsTrigger>
              <TabsTrigger value="records">Fiches Médicales</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="visits" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Traitement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-mono text-sm">{visit.date}</TableCell>
                      <TableCell className="font-mono text-sm">{visit.time}</TableCell>
                      <TableCell className="font-medium">{visit.student}</TableCell>
                      <TableCell>{visit.reason}</TableCell>
                      <TableCell className="text-sm">{visit.treatment}</TableCell>
                      <TableCell>
                        <Badge variant={visit.status === "Traité" ? "default" : "secondary"}>
                          {visit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Voir</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un élève..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom de l'Élève</TableHead>
                    <TableHead>Groupe Sanguin</TableHead>
                    <TableHead>Allergies</TableHead>
                    <TableHead>Conditions</TableHead>
                    <TableHead>Dernière Visite</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMedicalRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.matricule}</TableCell>
                      <TableCell className="font-medium">{record.student}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.bloodType}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.allergies !== "Aucune" ? (
                          <span className="text-destructive font-medium">{record.allergies}</span>
                        ) : (
                          <span className="text-muted-foreground">{record.allergies}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.conditions !== "-" ? (
                          <Badge variant="destructive">{record.conditions}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{record.lastVisit}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Voir Dossier</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Motifs Fréquents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Maux de tête</span>
                      <Badge variant="outline">15</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fièvre</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Maux de ventre</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tendances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Statistiques détaillées à venir
                    </p>
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
