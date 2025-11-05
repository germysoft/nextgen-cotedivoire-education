import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  Download, 
  Search, 
  Calendar, 
  Clock,
  TrendingUp,
  DollarSign,
  FileText
} from "lucide-react";

const mockStaff = [
  { 
    id: 1, 
    name: "Traoré Mamadou", 
    role: "Enseignant", 
    department: "Mathématiques", 
    status: "Permanent",
    salary: 450000,
    joinDate: "2015-09-01",
    attendance: "98%"
  },
  { 
    id: 2, 
    name: "Bamba Akissi", 
    role: "Enseignant", 
    department: "Français", 
    status: "Permanent",
    salary: 420000,
    joinDate: "2018-09-01",
    attendance: "95%"
  },
  { 
    id: 3, 
    name: "Koné Yves", 
    role: "Secrétaire", 
    department: "Administration", 
    status: "Permanent",
    salary: 280000,
    joinDate: "2019-01-15",
    attendance: "100%"
  },
  { 
    id: 4, 
    name: "Diallo Mariam", 
    role: "Comptable", 
    department: "Finance", 
    status: "Permanent",
    salary: 350000,
    joinDate: "2020-03-10",
    attendance: "97%"
  },
  { 
    id: 5, 
    name: "Yao Serge", 
    role: "Enseignant", 
    department: "Anglais", 
    status: "Vacataire",
    salary: 180000,
    joinDate: "2024-09-01",
    attendance: "92%"
  },
];

const mockLeaveRequests = [
  { id: 1, name: "Traoré Mamadou", type: "Congé annuel", startDate: "2024-12-15", endDate: "2024-12-30", status: "En attente" },
  { id: 2, name: "Bamba Akissi", type: "Congé maladie", startDate: "2024-11-08", endDate: "2024-11-10", status: "Approuvé" },
];

export default function HR() {
  const [searchTerm, setSearchTerm] = useState("");

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalStaff = mockStaff.length;
  const permanentStaff = mockStaff.filter(s => s.status === "Permanent").length;
  const totalSalaries = mockStaff.reduce((acc, s) => acc + s.salary, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ressources Humaines</h1>
          <p className="text-muted-foreground">Gestion du personnel et des ressources humaines</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nouveau Personnel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">{permanentStaff} permanents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Masse Salariale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalSalaries / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA / mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.4%</div>
            <p className="text-xs text-muted-foreground">Moyenne mensuelle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Congés en cours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLeaveRequests.length}</div>
            <p className="text-xs text-muted-foreground">Demandes actives</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="staff">
            <TabsList>
              <TabsTrigger value="staff">Liste du Personnel</TabsTrigger>
              <TabsTrigger value="leaves">Congés & Absences</TabsTrigger>
              <TabsTrigger value="attendance">Pointage</TabsTrigger>
              <TabsTrigger value="payroll">Paie</TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un membre du personnel..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom & Prénoms</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Salaire</TableHead>
                    <TableHead>Date d'embauche</TableHead>
                    <TableHead>Présence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                          </Avatar>
                          <span>{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>
                        <Badge variant={staff.status === "Permanent" ? "default" : "secondary"}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {staff.salary.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="font-mono text-sm">{staff.joinDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.attendance}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Voir</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="leaves" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type de congé</TableHead>
                    <TableHead>Date début</TableHead>
                    <TableHead>Date fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell className="font-mono text-sm">{request.startDate}</TableCell>
                      <TableCell className="font-mono text-sm">{request.endDate}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === "Approuvé" ? "default" : "secondary"}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "En attente" && (
                          <>
                            <Button size="sm" variant="default" className="mr-2">Approuver</Button>
                            <Button size="sm" variant="outline">Rejeter</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="attendance">
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Clock className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Système de Pointage</h3>
                  <p className="text-muted-foreground">Gestion du pointage quotidien du personnel</p>
                  <Button>Configurer le Pointage</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payroll">
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Gestion de la Paie</h3>
                  <p className="text-muted-foreground">Génération des fiches de paie et bulletins de salaire</p>
                  <Button>Générer les Fiches de Paie</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
