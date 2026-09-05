import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Users, Loader2 } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eleve, useDeactivateEleve, useElevesQuery, useUpdateEleve } from "@/hooks/api/useEleves";

function calculerAge(dateNaissance: string): number {
  const naissance = new Date(dateNaissance);
  const diff = Date.now() - naissance.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function Students() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Eleve | null>(null);
  const [editForm, setEditForm] = useState({ nom: "", prenom: "" });
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Données réelles issues du backend (branché le 05/09/2026 — voir MIGRATION.md).
  const { data, isLoading, isError } = useElevesQuery({ q: filters.search, pageSize: 100 });
  const updateEleve = useUpdateEleve();
  const deactivateEleve = useDeactivateEleve();

  const eleves = data?.items ?? [];

  const filterConfigs: FilterConfig[] = [
    {
      key: "statut",
      label: t('students.status'),
      type: "select",
      options: [
        { value: "actif", label: t('common.active') },
        { value: "inactif", label: "Inactif" },
      ],
    },
  ];

  const exportColumns = [
    { key: "matricule", label: t('students.matricule') },
    { key: "name", label: t('students.fullName') },
    { key: "class", label: t('students.class') },
    { key: "age", label: t('students.age') },
  ];

  const filteredStudents = eleves.filter((eleve) => {
    if (filters.statut === "actif" && !eleve.actif) return false;
    if (filters.statut === "inactif" && eleve.actif) return false;
    return true;
  });

  const rows = filteredStudents.map((eleve) => {
    const classe = eleve.inscriptions?.[0]?.classe?.nom ?? "—";
    return {
      eleve,
      name: `${eleve.nom} ${eleve.prenom}`,
      class: classe,
      age: calculerAge(eleve.dateNaissance),
    };
  });

  const handleEditClick = (eleve: Eleve) => {
    setSelectedStudent(eleve);
    setEditForm({ nom: eleve.nom, prenom: eleve.prenom });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedStudent) return;
    updateEleve.mutate(
      { id: selectedStudent.id, nom: editForm.nom, prenom: editForm.prenom },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          toast.success("Élève modifié avec succès");
        },
        onError: () => toast.error("Échec de la modification."),
      }
    );
  };

  const handleDeleteClick = (eleve: Eleve) => {
    setSelectedStudent(eleve);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedStudent) return;
    deactivateEleve.mutate(selectedStudent.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        toast.success("Élève désactivé avec succès");
      },
      onError: () => toast.error("Échec de la désactivation."),
    });
  };

  const displayTitle = `${t('students.list')} (${filteredStudents.length})`;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('students.title')}
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('students.subtitle')}
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
                searchPlaceholder={t('students.search')}
              />
              <DataTableExport
                data={rows.map((r) => ({ matricule: r.eleve.matricule, name: r.name, class: r.class, age: r.age }))}
                columns={exportColumns}
                filename="liste-eleves"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Chargement des élèves…
            </div>
          )}
          {isError && (
            <div className="py-16 text-center text-destructive">
              Impossible de contacter l'API. Vérifiez que le backend tourne bien sur VITE_API_URL.
            </div>
          )}
          {!isLoading && !isError && (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[80px]">Photo</TableHead>
                    <TableHead>{t('students.matricule')}</TableHead>
                    <TableHead>{t('students.fullName')}</TableHead>
                    <TableHead>{t('students.class')}</TableHead>
                    <TableHead>{t('students.age')}</TableHead>
                    <TableHead>{t('students.status')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(({ eleve, name, class: classe, age }) => (
                    <TableRow key={eleve.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{eleve.matricule}</TableCell>
                      <TableCell className="font-semibold">{name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">{classe}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{age} ans</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={eleve.actif ? "bg-success/10 text-success border-success/20" : "bg-muted"}
                        >
                          {eleve.actif ? t('common.active') : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary"
                            onClick={() => navigate(`/students/${eleve.id}`)}
                            title={t('common.view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary"
                            title={t('common.edit')}
                            onClick={() => handleEditClick(eleve)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            title={t('common.delete')}
                            onClick={() => handleDeleteClick(eleve)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogue d'édition — champs limités à nom/prénom pour cette première intégration ;
          voir MIGRATION.md pour étendre à la réaffectation de classe et aux autres champs. */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'élève</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Matricule</Label>
              <Input value={selectedStudent?.matricule || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={editForm.nom} onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={editForm.prenom} onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditSave} disabled={updateEleve.isPending}>
              {updateEleve.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation de désactivation (l'API ne supprime jamais physiquement un élève) */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la désactivation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir désactiver l'élève <strong>{selectedStudent?.nom} {selectedStudent?.prenom}</strong> (Matricule : {selectedStudent?.matricule}) ?
              Il restera consultable dans les archives mais n'apparaîtra plus dans les listes actives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Désactiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
