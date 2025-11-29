import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Users } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const students = [
  { id: "66800001A", name: "KOUASSI Jean", class: "6ème A", age: 12, status: "Actif", fees: "Payé", photo: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?w=150&h=150&fit=crop" },
  { id: "66800002A", name: "TRAORÉ Marie", class: "5ème B", age: 13, status: "Actif", fees: "Payé", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop" },
  { id: "66800003A", name: "YAO Pascal", class: "4ème C", age: 14, status: "Actif", fees: "Partiel", photo: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=150&h=150&fit=crop" },
  { id: "66800004A", name: "KONÉ Fatou", class: "3ème A", age: 15, status: "Actif", fees: "Payé", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop" },
  { id: "66800005A", name: "DIALLO Ibrahim", class: "2nde C", age: 16, status: "Actif", fees: "En attente", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
  { id: "66800006A", name: "N'GUESSAN Alice", class: "1ère D", age: 17, status: "Actif", fees: "Payé", photo: "https://images.unsplash.com/photo-1596788404239-d18a058c9c6d?w=150&h=150&fit=crop" },
  { id: "66800007A", name: "BAMBA Serge", class: "Tle A", age: 18, status: "Actif", fees: "Payé", photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop" },
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
  const navigate = useNavigate();

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

  const displayTitle = filters.class 
    ? `Liste des Élèves (${filters.class})` 
    : `Liste des Élèves (${filteredStudents.length})`;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestion des Élèves
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Liste complète des élèves inscrits
          </p>
        </div>
        <AddStudentDialog />
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {displayTitle}
            </CardTitle>
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
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">Photo</TableHead>
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
                  <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                        <AvatarImage src={student.photo} alt={student.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{student.id}</TableCell>
                    <TableCell className="font-semibold">{student.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {student.class}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.age} ans</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getFeesColor(student.fees)}>{student.fees}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigate(`/students/${student.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive">
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
