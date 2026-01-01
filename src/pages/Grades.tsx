import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calculator, TrendingUp, AlertCircle, UserCheck } from "lucide-react";
import { GradeEntryWizard } from "@/components/grades/GradeEntryWizard";
import { ConduiteEditor } from "@/components/grades/ConduiteEditor";
import { useGradeCalculation } from "@/hooks/useGradeCalculation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data avec note de conduite
const mockStudentGrades = [
  {
    id: 1,
    studentName: "Kouassi Jean",
    matricule: "66800001A",
    class: "6èmeA",
    trimester: "1er Trimestre",
    conduiteNote: 16,
    subjects: [
      { name: "Français", grade: 14.5, coef: 4, teacher: "M. Traoré" },
      { name: "Mathématiques", grade: 16, coef: 4, teacher: "Mme Bamba" },
      { name: "Anglais", grade: 13, coef: 3, teacher: "M. Koné" },
      { name: "Histoire-Géo", grade: 15, coef: 3, teacher: "Mme Diallo" },
      { name: "SVT", grade: 12, coef: 2, teacher: "M. Yao" },
      { name: "EPS", grade: 14, coef: 2, teacher: "M. Coulibaly" },
    ],
  },
  {
    id: 2,
    studentName: "Diallo Fatou",
    matricule: "66800002A",
    class: "6èmeA",
    trimester: "1er Trimestre",
    conduiteNote: 14,
    subjects: [
      { name: "Français", grade: 16, coef: 4, teacher: "M. Traoré" },
      { name: "Mathématiques", grade: 15.5, coef: 4, teacher: "Mme Bamba" },
      { name: "Anglais", grade: 14, coef: 3, teacher: "M. Koné" },
      { name: "Histoire-Géo", grade: 13, coef: 3, teacher: "Mme Diallo" },
      { name: "SVT", grade: 15, coef: 2, teacher: "M. Yao" },
      { name: "EPS", grade: 16, coef: 2, teacher: "M. Coulibaly" },
    ],
  },
];

export default function Grades() {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState("6èmeA");
  const [selectedTrimester, setSelectedTrimester] = useState("1");
  const [isGradeWizardOpen, setIsGradeWizardOpen] = useState(false);
  const [isConduiteEditorOpen, setIsConduiteEditorOpen] = useState(false);
  const [studentGrades, setStudentGrades] = useState(mockStudentGrades);
  
  const { getDisplayAverage, includeConduite } = useGradeCalculation();

  const getStudentAverage = (student: typeof studentGrades[0]) => {
    return getDisplayAverage(student.subjects, student.conduiteNote);
  };

  const handleConduiteUpdate = (updatedStudents: typeof studentGrades) => {
    setStudentGrades(updatedStudents);
  };

  const getGradeColor = (avg: number) => {
    if (avg >= 16) return "default";
    if (avg >= 14) return "secondary";
    if (avg >= 10) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('grades.title')}</h1>
          <p className="text-muted-foreground">{t('grades.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('grades.export')}
          </Button>
          {includeConduite && (
            <Button variant="outline" onClick={() => setIsConduiteEditorOpen(true)}>
              <UserCheck className="mr-2 h-4 w-4" />
              {t('grades.conductGrades')}
            </Button>
          )}
          <Button onClick={() => setIsGradeWizardOpen(true)}>
            <Calculator className="mr-2 h-4 w-4" />
            {t('grades.enterGrades')}
          </Button>
        </div>
      </div>

      {/* Grade Entry Wizard */}
      <GradeEntryWizard open={isGradeWizardOpen} onOpenChange={setIsGradeWizardOpen} />
      
      {/* Conduite Editor */}
      <ConduiteEditor
        open={isConduiteEditorOpen}
        onOpenChange={setIsConduiteEditorOpen}
        students={studentGrades}
        onSave={handleConduiteUpdate}
        className={selectedClass}
      />
      
      {/* Indicateur moyenne de conduite */}
      {includeConduite && (
        <Alert className="border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('grades.conductIncluded')}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('grades.generalAverage')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.8</div>
            <p className="text-xs text-muted-foreground">{t('grades.class')} 6èmeA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('grades.bestGrade')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5</div>
            <p className="text-xs text-muted-foreground">Mathématiques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('grades.successRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">{t('grades.averageAbove10')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('grades.bulletinsGenerated')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">{t('grades.thisTerm')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('grades.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('grades.class')}</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6èmeA">6èmeA</SelectItem>
                  <SelectItem value="5èmeB">5èmeB</SelectItem>
                  <SelectItem value="4èmeC">4èmeC</SelectItem>
                  <SelectItem value="3èmeA">3èmeA</SelectItem>
                  <SelectItem value="2ndeC">2ndeC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('grades.term')}</Label>
              <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('grades.term1')}</SelectItem>
                  <SelectItem value="2">{t('grades.term2')}</SelectItem>
                  <SelectItem value="3">{t('grades.term3')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('grades.schoolYear')}</Label>
              <Select defaultValue="2024-2025">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('grades.gradeReport')} - {selectedClass}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">{t('grades.gradeList')}</TabsTrigger>
              <TabsTrigger value="stats">{t('grades.statistics')}</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="space-y-4">
              {studentGrades.map((student) => {
                const studentAverage = getStudentAverage(student);
                return (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{student.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{t('grades.matricule')}: {student.matricule}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getGradeColor(studentAverage)} className="text-lg px-3 py-1">
                          {t('grades.average')}: {studentAverage.toFixed(2)}
                        </Badge>
                        {includeConduite && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ({t('grades.withConduct')}: {student.conduiteNote}/20)
                          </p>
                        )}
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('grades.subject')}</TableHead>
                          <TableHead>{t('grades.teacher')}</TableHead>
                          <TableHead className="text-center">{t('grades.gradeOutOf20')}</TableHead>
                          <TableHead className="text-center">{t('grades.coef')}</TableHead>
                          <TableHead className="text-center">{t('grades.totalPoints')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.subjects.map((subject, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{subject.teacher}</TableCell>
                            <TableCell className="text-center font-semibold">{subject.grade}</TableCell>
                            <TableCell className="text-center">{subject.coef}</TableCell>
                            <TableCell className="text-center font-semibold">
                              {(subject.grade * subject.coef).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        {includeConduite && (
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-medium">{t('grades.conduct')}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">-</TableCell>
                            <TableCell className="text-center font-semibold">{student.conduiteNote}</TableCell>
                            <TableCell className="text-center">1</TableCell>
                            <TableCell className="text-center font-semibold">
                              {student.conduiteNote.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        {t('grades.generateBulletin')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        {t('grades.downloadPDF')}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="stats">
              <div className="text-center py-12 text-muted-foreground">
                {t('grades.detailedStats')}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
