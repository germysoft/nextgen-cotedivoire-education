import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Download, Search, Calendar, TrendingUp, DollarSign, 
  Eye, Edit, Phone, Mail, Filter, Building2, FileText, ClipboardList, Target
} from "lucide-react";
import { AddPersonnelDialog } from "@/components/hr/AddPersonnelDialog";
import { PersonnelProfile } from "@/components/hr/PersonnelProfile";
import { PayslipGenerator } from "@/components/hr/PayslipGenerator";
import { EvaluationForm } from "@/components/hr/EvaluationForm";
import { ObjectifsTracker } from "@/components/hr/ObjectifsTracker";
import { mockPersonnel } from "@/data/mockPersonnel";
import { mockEvaluations } from "@/data/mockEvaluations";
import { Personnel, categoriesPersonnel, statutsPersonnel, departements } from "@/types/personnel";
import { generateAnnualReportPDF } from "@/components/hr/EvaluationPDFGenerator";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HR() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterDepartement, setFilterDepartement] = useState<string>("all");
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();
  };

  const filteredPersonnel = mockPersonnel.filter(p => {
    const matchSearch = `${p.nom} ${p.prenom} ${p.matricule} ${p.poste}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = filterCategorie === "all" || p.categoriePersonnel === filterCategorie;
    const matchStatut = filterStatut === "all" || p.statut === filterStatut;
    const matchDept = filterDepartement === "all" || p.departement === filterDepartement;
    return matchSearch && matchCategorie && matchStatut && matchDept && p.actif;
  });

  const stats = {
    total: mockPersonnel.filter(p => p.actif).length,
    permanents: mockPersonnel.filter(p => p.statut === "Permanent" && p.actif).length,
    enseignants: mockPersonnel.filter(p => p.categoriePersonnel === "Enseignant" && p.actif).length,
    masseSalariale: mockPersonnel.filter(p => p.actif).reduce((acc, p) => acc + p.salaireBase, 0),
  };

  const openProfile = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setProfileOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('hr.title')}</h1>
          <p className="text-muted-foreground">{t('hr.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              const currentYear = new Date().getFullYear();
              generateAnnualReportPDF(mockEvaluations, mockPersonnel, `${currentYear - 1}-${currentYear}`);
              toast.success(t('hr.exportSuccess'));
            }}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            {t('hr.evaluationsReport')}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('hr.export')}
          </Button>
          <AddPersonnelDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('hr.totalStaff')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.permanents} {t('hr.permanents')}, {stats.enseignants} {t('hr.teachers')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('hr.payrollMass')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.masseSalariale / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">{t('hr.perMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('hr.attendanceRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.4%</div>
            <p className="text-xs text-muted-foreground">{t('hr.monthlyAverage')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('hr.activeLeaves')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">{t('hr.activeRequests')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personnel" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('hr.personnel')}
          </TabsTrigger>
          <TabsTrigger value="objectifs" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t('hr.objectivesTracking')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personnel">
          <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>{t('hr.personnelList')} ({filteredPersonnel.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('hr.searchPlaceholder')} className="pl-8 w-48" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                <SelectTrigger className="w-36"><SelectValue placeholder={t('finance.category')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('hr.allCategories')}</SelectItem>
                  {categoriesPersonnel.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-32"><SelectValue placeholder={t('hr.status')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('hr.allStatuses')}</SelectItem>
                  {statutsPersonnel.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                <SelectTrigger className="w-40"><SelectValue placeholder={t('hr.department')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('hr.allDepartments')}</SelectItem>
                  {departements.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('hr.personnel')}</TableHead>
                <TableHead>{t('hr.position')}</TableHead>
                <TableHead>{t('hr.department')}</TableHead>
                <TableHead>{t('hr.contact')}</TableHead>
                <TableHead>{t('hr.status')}</TableHead>
                <TableHead>{t('hr.salary')}</TableHead>
                <TableHead className="text-right">{t('hr.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonnel.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={p.photo} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(p.nom, p.prenom)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{p.civilite} {p.prenom} {p.nom}</div>
                        <div className="text-sm text-muted-foreground font-mono">{p.matricule}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{p.poste}</TableCell>
                  <TableCell><Badge variant="outline" className="gap-1"><Building2 className="h-3 w-3" />{p.departement}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{p.telephone}</div>
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" /><span className="text-muted-foreground truncate max-w-32">{p.email}</span></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={p.statut === "Permanent" ? "default" : "secondary"}>{p.statut === "Permanent" ? t('hr.permanent') : t('hr.contractor')}</Badge></TableCell>
                  <TableCell className="font-semibold">{p.salaireBase.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <PayslipGenerator personnel={p} />
                      <EvaluationForm personnel={p} />
                      <Button variant="ghost" size="icon" onClick={() => openProfile(p)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="objectifs">
          <ObjectifsTracker />
        </TabsContent>
      </Tabs>

      {selectedPersonnel && (
        <PersonnelProfile personnel={selectedPersonnel} open={profileOpen} onClose={() => setProfileOpen(false)} />
      )}
    </div>
  );
}
