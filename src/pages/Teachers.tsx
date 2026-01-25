import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Eye, Edit, Phone, Mail, Trash2 } from "lucide-react";
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

const initialTeachers = [
  { id: "T001", name: "KOUADIO Marc", subject: "Mathématiques", classes: "3ème, 2nde", phone: "+225 07 00 00 01", email: "marc.k@school.ci", status: "permanent" },
  { id: "T002", name: "DIABATÉ Sarah", subject: "Français", classes: "6ème, 5ème", phone: "+225 07 00 00 02", email: "sarah.d@school.ci", status: "permanent" },
  { id: "T003", name: "BROU Emmanuel", subject: "Anglais", classes: "4ème, 3ème", phone: "+225 07 00 00 03", email: "emmanuel.b@school.ci", status: "contractor" },
  { id: "T004", name: "TOURÉ Aminata", subject: "SVT", classes: "2nde, 1ère", phone: "+225 07 00 00 04", email: "aminata.t@school.ci", status: "permanent" },
  { id: "T005", name: "KOFFI Daniel", subject: "Histoire-Géo", classes: "Tle A, Tle D", phone: "+225 07 00 00 05", email: "daniel.k@school.ci", status: "permanent" },
];

export default function Teachers() {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<typeof initialTeachers[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", subject: "", classes: "", phone: "", email: "", status: "" });

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  const getStatusLabel = (status: string) => {
    return status === "permanent" ? t('teachers.permanent') : t('teachers.contractor');
  };

  const subjects = [...new Set(teachers.map(t => t.subject))];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       teacher.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || teacher.status === filterStatus;
    const matchSubject = filterSubject === "all" || teacher.subject === filterSubject;
    return matchSearch && matchStatus && matchSubject;
  });

  const exportColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: t('dashboard.teachers') },
    { key: "subject", label: t('teachers.subject') },
    { key: "classes", label: t('teachers.classes') },
    { key: "phone", label: "Téléphone" },
    { key: "email", label: "Email" },
    { key: "status", label: t('teachers.status') },
  ];

  const handleViewClick = (teacher: typeof initialTeachers[0]) => {
    setSelectedTeacher(teacher);
    setViewDialogOpen(true);
  };

  const handleEditClick = (teacher: typeof initialTeachers[0]) => {
    setSelectedTeacher(teacher);
    setEditForm({
      name: teacher.name,
      subject: teacher.subject,
      classes: teacher.classes,
      phone: teacher.phone,
      email: teacher.email,
      status: teacher.status
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedTeacher) return;
    
    setTeachers(teachers.map(t => 
      t.id === selectedTeacher.id 
        ? { ...t, ...editForm }
        : t
    ));
    setEditDialogOpen(false);
    toast.success("Enseignant modifié avec succès");
  };

  const handleDeleteClick = (teacher: typeof initialTeachers[0]) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedTeacher) return;
    
    setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
    setDeleteDialogOpen(false);
    toast.success("Enseignant supprimé avec succès");
  };

  const permanentCount = teachers.filter(t => t.status === "permanent").length;
  const contractorCount = teachers.filter(t => t.status === "contractor").length;

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
            <p className="text-xs text-muted-foreground">{Math.round(permanentCount / teachers.length * 100)}% {t('common.total').toLowerCase()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('teachers.contractors')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractorCount}</div>
            <p className="text-xs text-muted-foreground">{Math.round(contractorCount / teachers.length * 100)}% {t('common.total').toLowerCase()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('teachers.attendanceRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-success">+1.5% {t('dashboard.thisMonth')}</p>
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
                data={filteredTeachers}
                columns={exportColumns}
                filename="liste-enseignants"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                      <Badge variant={teacher.status === "permanent" ? "default" : "secondary"}>
                        {getStatusLabel(teacher.status)}
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
        </CardContent>
      </Card>

      {/* Filter Sheet */}
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
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="contractor">Vacataire</SelectItem>
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
                  {subjects.map(s => (
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

      {/* View Dialog */}
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
                    {getInitials(selectedTeacher.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedTeacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTeacher.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Matière</Label>
                  <p className="font-medium">{selectedTeacher.subject}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Classes</Label>
                  <p className="font-medium">{selectedTeacher.classes}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Téléphone</Label>
                  <p className="font-medium">{selectedTeacher.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedTeacher.email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Statut</Label>
                  <div className="mt-1">
                    <Badge variant={selectedTeacher.status === "permanent" ? "default" : "secondary"}>
                      {getStatusLabel(selectedTeacher.status)}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'enseignant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input 
                value={editForm.name} 
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Matière</Label>
              <Input 
                value={editForm.subject} 
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Classes</Label>
              <Input 
                value={editForm.classes} 
                onChange={(e) => setEditForm({ ...editForm, classes: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input 
                value={editForm.phone} 
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={editForm.email} 
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="contractor">Vacataire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'enseignant <strong>{selectedTeacher?.name}</strong> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
