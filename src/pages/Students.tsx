import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const students = [
  { id: "66800001A", name: "KOUASSI Jean", class: "6ème A", age: 12, status: "Actif", fees: "Payé" },
  { id: "66800002A", name: "TRAORÉ Marie", class: "5ème B", age: 13, status: "Actif", fees: "Payé" },
  { id: "66800003A", name: "YAO Pascal", class: "4ème C", age: 14, status: "Actif", fees: "Partiel" },
  { id: "66800004A", name: "KONÉ Fatou", class: "3ème A", age: 15, status: "Actif", fees: "Payé" },
  { id: "66800005A", name: "DIALLO Ibrahim", class: "2nde C", age: 16, status: "Actif", fees: "En attente" },
  { id: "66800006A", name: "N'GUESSAN Alice", class: "1ère D", age: 17, status: "Actif", fees: "Payé" },
  { id: "66800007A", name: "BAMBA Serge", class: "Tle A", age: 18, status: "Actif", fees: "Payé" },
];

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFeesColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "bg-success text-success-foreground";
      case "Partiel":
        return "bg-warning text-warning-foreground";
      case "En attente":
        return "bg-destructive text-destructive-foreground";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Élèves</h1>
          <p className="text-muted-foreground">Liste complète des élèves inscrits</p>
        </div>
        <AddStudentDialog />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Liste des Élèves ({filteredStudents.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Frais</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.age} ans</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getFeesColor(student.fees)}>{student.fees}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
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
