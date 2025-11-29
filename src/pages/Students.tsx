import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { DataTableFilters, FilterConfig } from "@/components/data-table/DataTableFilters";
import { DataTableExport } from "@/components/data-table/DataTableExport";
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

const filterConfigs: FilterConfig[] = [
  {
    key: "class",
    label: "Classe",
    type: "select",
    options: [
      { value: "6ème A", label: "6ème A" },
      { value: "5ème B", label: "5ème B" },
      { value: "4ème C", label: "4ème C" },
      { value: "3ème A", label: "3ème A" },
      { value: "2nde C", label: "2nde C" },
      { value: "1ère D", label: "1ère D" },
      { value: "Tle A", label: "Tle A" },
    ],
  },
  {
    key: "fees",
    label: "Statut Paiement",
    type: "select",
    options: [
      { value: "Payé", label: "Payé" },
      { value: "Partiel", label: "Partiel" },
      { value: "En attente", label: "En attente" },
    ],
  },
  {
    key: "ageMin",
    label: "Âge minimum",
    type: "number",
  },
];

const exportColumns = [
  { key: "id", label: "Matricule" },
  { key: "name", label: "Nom Complet" },
  { key: "class", label: "Classe" },
  { key: "age", label: "Âge" },
  { key: "status", label: "Statut" },
  { key: "fees", label: "Frais" },
];

export default function Students() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredStudents = students.filter((student) => {
    if (filters.search && 
        !student.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !student.id.toLowerCase().includes(filters.search.toLowerCase()) &&
        !student.class.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.class && student.class !== filters.class) {
      return false;
    }
    if (filters.fees && student.fees !== filters.fees) {
      return false;
    }
    if (filters.ageMin && student.age < Number(filters.ageMin)) {
      return false;
    }
    return true;
  });

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
              <DataTableFilters
                filters={filterConfigs}
                onFilterChange={setFilters}
                searchPlaceholder="Rechercher un élève..."
              />
              <DataTableExport
                data={filteredStudents}
                columns={exportColumns}
                filename="liste-eleves"
              />
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
