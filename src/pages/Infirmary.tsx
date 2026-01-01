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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);

  const totalVisits = mockVisits.length;
  const activeAlerts = mockMedicalRecords.filter(r => r.conditions !== "-").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('infirmary.title')}</h1>
          <p className="text-muted-foreground">{t('infirmary.subtitle')}</p>
        </div>
        <Dialog open={isNewVisitOpen} onOpenChange={setIsNewVisitOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('infirmary.newConsultation')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('infirmary.registerConsultation')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>{t('infirmary.student')}</Label>
                <Input placeholder={t('infirmary.studentPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label>{t('infirmary.reason')}</Label>
                <Textarea placeholder={t('infirmary.reasonPlaceholder')} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{t('infirmary.treatment')}</Label>
                <Textarea placeholder={t('infirmary.treatmentPlaceholder')} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{t('infirmary.observations')}</Label>
                <Textarea placeholder={t('infirmary.observationsPlaceholder')} rows={2} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewVisitOpen(false)}>
                  {t('infirmary.cancel')}
                </Button>
                <Button onClick={() => setIsNewVisitOpen(false)}>
                  {t('infirmary.save')}
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
            <CardTitle className="text-sm font-medium">{t('infirmary.consultations')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground">{t('infirmary.thisMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('infirmary.medicalAlerts')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">{t('infirmary.conditionsToMonitor')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('infirmary.medicalRecords')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedicalRecords.length}</div>
            <p className="text-xs text-muted-foreground">{t('infirmary.activeRecords')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('infirmary.patientsToday')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockVisits.filter(v => v.date === "2024-11-05").length}
            </div>
            <p className="text-xs text-muted-foreground">{t('infirmary.todayConsultations')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>{t('infirmary.medicalManagement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visits">
            <TabsList>
              <TabsTrigger value="visits">{t('infirmary.consultations')}</TabsTrigger>
              <TabsTrigger value="records">{t('infirmary.medicalRecords')}</TabsTrigger>
              <TabsTrigger value="stats">{t('library.statistics')}</TabsTrigger>
            </TabsList>

            <TabsContent value="visits" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('infirmary.date')}</TableHead>
                    <TableHead>{t('infirmary.time')}</TableHead>
                    <TableHead>{t('infirmary.student')}</TableHead>
                    <TableHead>{t('infirmary.reason')}</TableHead>
                    <TableHead>{t('infirmary.treatment')}</TableHead>
                    <TableHead>{t('infirmary.status')}</TableHead>
                    <TableHead className="text-right">{t('infirmary.actions')}</TableHead>
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
                          {visit.status === "Traité" ? t('infirmary.treated') : t('infirmary.ongoing')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">{t('infirmary.view')}</Button>
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
                    placeholder={t('infirmary.searchStudent')}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('infirmary.matricule')}</TableHead>
                    <TableHead>{t('infirmary.studentName')}</TableHead>
                    <TableHead>{t('infirmary.bloodType')}</TableHead>
                    <TableHead>{t('infirmary.allergies')}</TableHead>
                    <TableHead>{t('infirmary.conditions')}</TableHead>
                    <TableHead>{t('infirmary.lastVisit')}</TableHead>
                    <TableHead className="text-right">{t('infirmary.actions')}</TableHead>
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
                          <span className="text-muted-foreground">{t('infirmary.none')}</span>
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
                        <Button size="sm" variant="ghost">{t('infirmary.viewRecord')}</Button>
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
                    <CardTitle className="text-base">{t('infirmary.frequentReasons')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('infirmary.headache')}</span>
                      <Badge variant="outline">15</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('infirmary.fever')}</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('infirmary.stomachache')}</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('infirmary.trends')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t('infirmary.detailedStats')}
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
