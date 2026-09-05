import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye, Edit, Phone, Mail, Trash2, Loader2 } from "lucide-react";
import { AddTeacherDialog } from "@/components/teachers/AddTeacherDialog";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { DataTableExport } from "@/components/data-table/DataTableExport";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Personnel, usePersonnelQuery, useUpdatePersonnel, useDeactivatePersonnel } from "@/hooks/api/usePersonnel";

const statutLabels: Record<Personnel['statut'], string> = {
  Permanent: 'Permanent',
  Vacataire: 'Vacataire',
  Contractuel: 'Contractuel',
  Stagiaire: 'Stagiaire',
  'Intérimaire': 'Intérimaire',
};

export default function Teachers() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Personnel | null>(null);
  const [editForm, setEditForm] = useState({ nom: "", prenom: "", telephone: "", email: "", statut: "Permanent" as Personnel['statut'] });

  // Seul le personnel enseignant nous intéresse sur cette page (les autres
  // catégories — administratif, technique... — sont gérées dans le module RH).
  const { data, isLoading, isError } = usePersonnelQuery({ q: searchTerm, categoriePersonnel: 'Enseignant', pageSize: 200 });
  const updatePersonnel = useUpdatePersonnel();
  const deactivatePersonnel = useDeactivatePersonnel();

  const teachers = data?.items ?? [];

  const getInitials = (nom: string, prenom: string) => `${prenom[0] ?? ''}${nom[0] ?? ''}`;

  const subjectsOf = (teacher: Personnel) =>
    [...new Set(teacher.affectations?.map((a) => a.matiere.nom) ?? [])].join(', ') || '—';
  const classesOf = (teacher: Personnel) =>
    [...new Set(teacher.affectations?.map((a) => a.classe.nom) ?? [])].join(', ') || '—';

  const allSubjects = [...new Set(teachers.flatMap((t) => t.affectations?.map((a) => a.matiere.nom) ?? []))];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchStatus = filterStatus === "all" || teacher.statut === filterStatus;
    const matchSubject = filterSubject === "all" || subjectsOf(teacher).includes(filterSubject);
    return matchStatus && matchSubject;
  });

  const exportColumns = [
    { key: "matricule", label: "ID" },
    { key: "name", label: t('dashboard.teachers') },
    { key: "subject", label: t('teachers.subject') },
    { key: "classes", label: t('teachers.classes') },
    { key: "phone", label: "Téléphone" },
    { key: "email", label: "Email" },
    { key: "status", label: t('teachers.status') },
  ];

  const handleViewClick = (teacher: Personnel) => {
    setSelectedTeacher(teacher);
    setViewDialogOpen(true);
  };

  const handleEditClick = (teacher: Personnel) => {
    setSelectedTeacher(teacher);
    setEditForm({ nom: teacher.nom, prenom: teacher.prenom, telephone: teacher.telephone, email: teacher.email, statut: teacher.statut });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedTeacher) return;
    updatePersonnel.mutate(
      { id: selectedTeacher.id, ...editForm },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          toast.success("Enseignant modifié avec succès");
        },
        onError: () => toast.error("Échec de la modification."),
      }
    );
  };

  const handleDeleteClick = (teacher: Personnel) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedTeacher) return;
    deactivatePersonnel.mutate(selectedTeacher.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        toast.success("Enseignant désactivé avec succès");
      },
      onError: () => toast.error("Échec de la désactivation."),
    });
  };

  const permanentCount = teachers.filter((t) => t.statut === "Permanent").length;
  const contractorCount = teachers.length - permanentCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('teachers.title')}</h1>
          <p className="text-muted-foreground">{t('teachers.subtitle')}</p>
        </div>
        <AddTeacherDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('teachers.permanentTeachers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permanentCount}</div>
            <p className="text-xs text-muted-foreground">
              {teachers.length > 0 ? Math.round((permanentCount / teachers.length) * 100) : 0}% {t('common.total').toLowerCase()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('teachers.contractors')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractorCount}</div>
            <p className="text-xs text-muted-foreground">
              {teachers.length > 0 ? Math.round((contractorCount / teachers.length) * 100) : 0}% {t('common.total').toLowerCase()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('teachers.attendanceRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pas encore d'endpoint d'agrégation du pointage (voir MIGRATION.md) : valeur indicative. */}
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Bientôt disponible (module Pointage)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{t('teachers.list')} ({filteredTeachers.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-10 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" title={t('common.filter')} onClick={() => setFilterOpen(true)}>
                <Filter className="h-4 w-4" />
              </Button>
              <DataTableExport
                data={filteredTeachers.map((t) => ({
                  matricule: t.matricule,
                  name: `${t.nom} ${t.prenom}`,
                  subject: subjectsOf(t),
                  classes: classesOf(t),
                  phone: t.telephone,
                  email: t.email,
                  status: statutLabels[t.statut],
                }))}
                columns={exportColumns}
                filename="liste-enseignants"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Chargement des enseignants…
            </div>
          )}
          {isError && (
            <div className="py-16 text-center text-destructive">
              Impossible de contacter l'API. Vérifiez que le backend tourne bien sur VITE_API_URL.
            </div>
          )}
          {!isLoading && !isError && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.teachers')}</TableHead>
                    <TableHead>{t('teachers.subject')}</TableHead>
                    <TableHead>{t('teachers.classes')}</TableHead>
                    <TableHead>{t('teachers.contact')}</TableHead>
                    <TableHead>{t('teachers.status')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(teacher.nom, teacher.prenom)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{teacher.nom} {teacher.prenom}</div>
                            <div className="text-sm text-muted-foreground">{teacher.matricule}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{subjectsOf(teacher)}</TableCell>
                      <TableCell>{classesOf(teacher)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{teacher.telephone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{teacher.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.statut === "Permanent" ? "default" : "secondary"}>
                          {statutLabels[teacher.statut]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title={t('common.view')} onClick={() => handleViewClick(teacher)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title={t('common.edit')} onClick={() => handleEditClick(teacher)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title={t('common.delete')} onClick={() => handleDeleteClick(teacher)} className="hover:bg-destructive/10 hover:text-destructive">
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

      {/* Filtres avancés */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtres avancés</SheetTitle>
            <SheetDescription>Affinez la liste des enseignants</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {Object.entries(statutLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Matière</Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les matières" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {allSubjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => { setFilterStatus("all"); setFilterSubject("all"); }}>
              Réinitialiser les filtres
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Détails */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'enseignant</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(selectedTeacher.nom, selectedTeacher.prenom)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedTeacher.nom} {selectedTeacher.prenom}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTeacher.matricule}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Matière(s)</Label>
                  <p className="font-medium">{subjectsOf(selectedTeacher)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Classes</Label>
                  <p className="font-medium">{classesOf(selectedTeacher)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Téléphone</Label>
                  <p className="font-medium">{selectedTeacher.telephone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedTeacher.email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Statut</Label>
                  <div className="mt-1">
                    <Badge variant={selectedTeacher.statut === "Permanent" ? "default" : "secondary"}>
                      {statutLabels[selectedTeacher.statut]}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Édition — la réaffectation matière/classe se fait depuis le module
          Pédagogie (Affectations), pas ici : voir MIGRATION.md. */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'enseignant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={editForm.nom} onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={editForm.prenom} onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input value={editForm.telephone} onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={editForm.statut} onValueChange={(v) => setEditForm({ ...editForm, statut: v as Personnel['statut'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statutLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditSave} disabled={updatePersonnel.isPending}>
              {updatePersonnel.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Désactivation (l'API ne supprime jamais physiquement un membre du personnel) */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la désactivation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir désactiver l'enseignant <strong>{selectedTeacher?.nom} {selectedTeacher?.prenom}</strong> ?
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
