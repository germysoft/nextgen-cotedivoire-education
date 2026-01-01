import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Eye, Edit, Phone, Mail } from "lucide-react";
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

const teachers = [
  { id: "T001", name: "KOUADIO Marc", subject: "Mathématiques", classes: "3ème, 2nde", phone: "+225 07 00 00 01", email: "marc.k@school.ci", status: "permanent" },
  { id: "T002", name: "DIABATÉ Sarah", subject: "Français", classes: "6ème, 5ème", phone: "+225 07 00 00 02", email: "sarah.d@school.ci", status: "permanent" },
  { id: "T003", name: "BROU Emmanuel", subject: "Anglais", classes: "4ème, 3ème", phone: "+225 07 00 00 03", email: "emmanuel.b@school.ci", status: "contractor" },
  { id: "T004", name: "TOURÉ Aminata", subject: "SVT", classes: "2nde, 1ère", phone: "+225 07 00 00 04", email: "aminata.t@school.ci", status: "permanent" },
  { id: "T005", name: "KOFFI Daniel", subject: "Histoire-Géo", classes: "Tle A, Tle D", phone: "+225 07 00 00 05", email: "daniel.k@school.ci", status: "permanent" },
];

export default function Teachers() {
  const { t } = useLanguage();

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  const getStatusLabel = (status: string) => {
    return status === "permanent" ? t('teachers.permanent') : t('teachers.contractor');
  };

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
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">84% {t('common.total').toLowerCase()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('teachers.contractors')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">16% {t('common.total').toLowerCase()}</p>
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
            <CardTitle>{t('teachers.list')} ({teachers.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-10 sm:w-64"
                />
              </div>
              <Button variant="outline" size="icon" title={t('common.filter')}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title={t('common.export')}>
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
                  <TableHead>{t('dashboard.teachers')}</TableHead>
                  <TableHead>{t('teachers.subject')}</TableHead>
                  <TableHead>{t('teachers.classes')}</TableHead>
                  <TableHead>{t('teachers.contact')}</TableHead>
                  <TableHead>{t('teachers.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
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
                      <Badge variant={teacher.status === "permanent" ? "default" : "secondary"}>
                        {getStatusLabel(teacher.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title={t('common.view')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title={t('common.edit')}>
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
