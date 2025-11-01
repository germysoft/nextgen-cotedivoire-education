import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, Eye, Edit, Phone, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const teachers = [
  { id: "T001", name: "KOUADIO Marc", subject: "Mathématiques", classes: "3ème, 2nde", phone: "+225 07 00 00 01", email: "marc.k@school.ci", status: "Permanent" },
  { id: "T002", name: "DIABATÉ Sarah", subject: "Français", classes: "6ème, 5ème", phone: "+225 07 00 00 02", email: "sarah.d@school.ci", status: "Permanent" },
  { id: "T003", name: "BROU Emmanuel", subject: "Anglais", classes: "4ème, 3ème", phone: "+225 07 00 00 03", email: "emmanuel.b@school.ci", status: "Vacataire" },
  { id: "T004", name: "TOURÉ Aminata", subject: "SVT", classes: "2nde, 1ère", phone: "+225 07 00 00 04", email: "aminata.t@school.ci", status: "Permanent" },
  { id: "T005", name: "KOFFI Daniel", subject: "Histoire-Géo", classes: "Tle A, Tle D", phone: "+225 07 00 00 05", email: "daniel.k@school.ci", status: "Permanent" },
];

export default function Teachers() {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Enseignants</h1>
          <p className="text-muted-foreground">Corps professoral de l'établissement</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Enseignant
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Enseignants Permanents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">84% de l'effectif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vacataires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">16% de l'effectif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-success">+1.5% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Liste des Enseignants ({teachers.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 sm:w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-muted-foreground">{teacher.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>{teacher.classes}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{teacher.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{teacher.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === "Permanent" ? "default" : "secondary"}>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
