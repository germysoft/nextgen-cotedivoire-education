import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Trash2, Users, GraduationCap, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data
const mockClasses = [
  { id: 1, name: "6èmeA", level: "6ème", cycle: "1er Cycle", capacity: 45, enrolled: 42, teacher: "M. Kouassi Jean", avgGrade: 12.5, successRate: 85 },
  { id: 2, name: "5èmeB", level: "5ème", cycle: "1er Cycle", capacity: 40, enrolled: 38, teacher: "Mme Diallo Fatou", avgGrade: 13.2, successRate: 88 },
  { id: 3, name: "4èmeC", level: "4ème", cycle: "1er Cycle", capacity: 40, enrolled: 35, teacher: "M. Traoré Yao", avgGrade: 11.8, successRate: 78 },
  { id: 4, name: "3èmeA", level: "3ème", cycle: "1er Cycle", capacity: 45, enrolled: 44, teacher: "Mme Bamba Aya", avgGrade: 14.1, successRate: 92 },
  { id: 5, name: "2ndeC", level: "2nde", cycle: "2nd Cycle", capacity: 50, enrolled: 48, teacher: "M. Koné Serge", avgGrade: 12.9, successRate: 82 },
  { id: 6, name: "1èreD", level: "1ère", cycle: "2nd Cycle", capacity: 45, enrolled: 40, teacher: "M. Yao Martin", avgGrade: 13.5, successRate: 86 },
  { id: 7, name: "TleA1", level: "Tle", cycle: "2nd Cycle", capacity: 40, enrolled: 39, teacher: "Mme Coulibaly Marie", avgGrade: 14.8, successRate: 95 },
];

const mockStudents = [
  { id: 1, name: "KOUASSI Jean", avgGrade: 14.5, rank: 3, absences: 2, status: "excellent" },
  { id: 2, name: "DIALLO Fatoumata", avgGrade: 16.2, rank: 1, absences: 0, status: "excellent" },
  { id: 3, name: "TOURÉ Mohamed", avgGrade: 11.8, rank: 15, absences: 5, status: "passable" },
  { id: 4, name: "SANOGO Aminata", avgGrade: 8.5, rank: 28, absences: 8, status: "insufficient" },
  { id: 5, name: "KOFFI Paul", avgGrade: 15.1, rank: 2, absences: 1, status: "veryGood" },
];

const mockSchedule = [
  { day: "monday", slots: [
    { time: "08:00-10:00", subject: "Mathématiques", teacher: "M. KOFFI" },
    { time: "10:00-12:00", subject: "Français", teacher: "Mme SANOGO" },
    { time: "14:00-16:00", subject: "Anglais", teacher: "M. JOHNSON" },
  ]},
  { day: "tuesday", slots: [
    { time: "08:00-10:00", subject: "Physique-Chimie", teacher: "M. TOURÉ" },
    { time: "10:00-12:00", subject: "SVT", teacher: "Mme BAMBA" },
    { time: "14:00-16:00", subject: "Histoire-Géo", teacher: "M. KONE" },
  ]},
  { day: "wednesday", slots: [
    { time: "08:00-10:00", subject: "Mathématiques", teacher: "M. KOFFI" },
    { time: "10:00-12:00", subject: "EPS", teacher: "M. YAO" },
  ]},
  { day: "thursday", slots: [
    { time: "08:00-10:00", subject: "Français", teacher: "Mme SANOGO" },
    { time: "10:00-12:00", subject: "Physique-Chimie", teacher: "M. TOURÉ" },
    { time: "14:00-16:00", subject: "Philosophie", teacher: "M. DIALLO" },
  ]},
  { day: "friday", slots: [
    { time: "08:00-10:00", subject: "Anglais", teacher: "M. JOHNSON" },
    { time: "10:00-12:00", subject: "Mathématiques", teacher: "M. KOFFI" },
    { time: "14:00-16:00", subject: "SVT", teacher: "Mme BAMBA" },
  ]},
];

const performanceData = [
  { subject: "Maths", average: 13.5, classAvg: 12.8 },
  { subject: "Français", average: 12.8, classAvg: 11.9 },
  { subject: "Anglais", average: 14.2, classAvg: 13.5 },
  { subject: "Physique", average: 11.5, classAvg: 10.8 },
  { subject: "SVT", average: 15.1, classAvg: 14.2 },
];

const evolutionData = [
  { month: "Sept", moyenne: 11.2 },
  { month: "Oct", moyenne: 12.1 },
  { month: "Nov", moyenne: 12.8 },
  { month: "Déc", moyenne: 13.5 },
];

const cycleDistribution = [
  { name: "1er Cycle", value: 4, color: "#3b82f6" },
  { name: "2nd Cycle", value: 3, color: "#10b981" },
];

export default function Classes() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<typeof mockClasses[0] | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  const filteredClasses = mockClasses.filter((classe) =>
    classe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classe.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classe.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOccupancyColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 95) return "destructive";
    if (percentage >= 80) return "default";
    return "secondary";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent": return t('grades.excellent');
      case "veryGood": return t('grades.veryGood');
      case "good": return t('grades.good');
      case "passable": return t('grades.passable');
      case "insufficient": return t('grades.insufficient');
      default: return status;
    }
  };

  const getDayLabel = (day: string) => {
    switch (day) {
      case "monday": return t('schedule.monday');
      case "tuesday": return t('schedule.tuesday');
      case "wednesday": return t('schedule.wednesday');
      case "thursday": return t('schedule.thursday');
      case "friday": return t('schedule.friday');
      case "saturday": return t('schedule.saturday');
      case "sunday": return t('schedule.sunday');
      default: return day;
    }
  };

  const totalStudents = mockClasses.reduce((acc, c) => acc + c.enrolled, 0);
  const avgOccupancy = Math.round((totalStudents / mockClasses.reduce((acc, c) => acc + c.capacity, 0)) * 100);
  const avgClassGrade = (mockClasses.reduce((acc, c) => acc + c.avgGrade, 0) / mockClasses.length).toFixed(1);
  const totalHours = mockClasses.length * 32;

  const handleViewClass = (classe: typeof mockClasses[0]) => {
    setSelectedClass(classe);
    setViewMode("detail");
  };

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('classes.title')}</h1>
              <p className="text-muted-foreground">{t('classes.subtitle')}</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('classes.addNew')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('classes.addNew')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">{t('common.name')}</Label>
                      <Input id="className" placeholder="Ex: 6èmeA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cycle">{t('academic.cycle')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('common.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1er">1er Cycle</SelectItem>
                          <SelectItem value="2nd">2nd Cycle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">{t('classes.level')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('common.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6eme">6ème</SelectItem>
                          <SelectItem value="5eme">5ème</SelectItem>
                          <SelectItem value="4eme">4ème</SelectItem>
                          <SelectItem value="3eme">3ème</SelectItem>
                          <SelectItem value="2nde">2nde</SelectItem>
                          <SelectItem value="1ere">1ère</SelectItem>
                          <SelectItem value="tle">Tle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">{t('classes.capacity')}</Label>
                      <Input id="capacity" type="number" placeholder="45" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">{t('classes.mainTeacher')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">M. Kouassi Jean</SelectItem>
                        <SelectItem value="2">Mme Diallo Fatou</SelectItem>
                        <SelectItem value="3">M. Traoré Yao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel')}</Button>
                    <Button onClick={() => setIsDialogOpen(false)}>{t('common.save')}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('common.total')} {t('dashboard.classes')}</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockClasses.length}</div>
                <p className="text-xs text-muted-foreground">{t('common.active')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.totalStudents')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">{t('students.enrolled')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('classes.capacity')}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgOccupancy}%</div>
                <Progress value={avgOccupancy} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('grades.average')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgClassGrade}/20</div>
                <p className="text-xs text-green-600">+0.8 vs {t('grades.term').toLowerCase()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('time.hours')}/sem.</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours}h</div>
                <p className="text-xs text-muted-foreground">{t('common.total')}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Classes Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('students.list')}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('common.search')}
                        className="pl-8 w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.name')}</TableHead>
                      <TableHead>{t('classes.level')}</TableHead>
                      <TableHead>{t('classes.mainTeacher')}</TableHead>
                      <TableHead>{t('classes.enrollment')}</TableHead>
                      <TableHead>{t('grades.average')}</TableHead>
                      <TableHead>{t('reports.performance')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((classe) => (
                      <TableRow key={classe.id}>
                        <TableCell className="font-medium">{classe.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{classe.level}</Badge>
                        </TableCell>
                        <TableCell>{classe.teacher}</TableCell>
                        <TableCell>
                          <Badge variant={getOccupancyColor(classe.enrolled, classe.capacity)}>
                            {classe.enrolled}/{classe.capacity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${
                            classe.avgGrade >= 14 ? "text-green-600" :
                            classe.avgGrade >= 10 ? "text-blue-600" : "text-red-600"
                          }`}>
                            {classe.avgGrade}/20
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={classe.successRate} className="w-16 h-2" />
                            <span className="text-xs">{classe.successRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleViewClass(classe)} title={t('common.view')}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title={t('common.edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title={t('common.delete')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Cycle Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t('academic.cycle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cycleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {cycleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {cycleDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-bold">{item.value} {t('dashboard.classes').toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Detail View */}
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => setViewMode("list")} className="mb-2">
                ← {t('common.back')}
              </Button>
              <h1 className="text-3xl font-bold">{t('students.class')} {selectedClass?.name}</h1>
              <p className="text-muted-foreground">
                {selectedClass?.level} - {selectedClass?.cycle} • {t('classes.mainTeacher')}: {selectedClass?.teacher}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </Button>
              <Button>
                {t('common.export')}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="students" className="space-y-6">
            <TabsList>
              <TabsTrigger value="students">{t('nav.students')} ({selectedClass?.enrolled})</TabsTrigger>
              <TabsTrigger value="schedule">{t('schedule.title')}</TabsTrigger>
              <TabsTrigger value="performance">{t('reports.performance')}</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>{t('students.list')} - {selectedClass?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common.name')}</TableHead>
                        <TableHead>{t('grades.average')}</TableHead>
                        <TableHead>{t('grades.rank')}</TableHead>
                        <TableHead>{t('hr.absent')}</TableHead>
                        <TableHead>{t('students.status')}</TableHead>
                        <TableHead className="text-right">{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <span className={`font-bold ${
                              student.avgGrade >= 14 ? "text-green-600" :
                              student.avgGrade >= 10 ? "text-blue-600" : "text-red-600"
                            }`}>
                              {student.avgGrade}/20
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.rank}°</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.absences > 5 ? "destructive" : "secondary"}>
                              {student.absences}h
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              student.status === "excellent" || student.status === "veryGood" ? "default" :
                              student.status === "passable" ? "secondary" : "destructive"
                            }>
                              {getStatusLabel(student.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">{t('common.view')}</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>{t('schedule.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {mockSchedule.map((day) => (
                      <div key={day.day} className="border rounded-lg p-4">
                        <h3 className="font-bold mb-3">{getDayLabel(day.day)}</h3>
                        <div className="grid gap-2 md:grid-cols-3">
                          {day.slots.map((slot, idx) => (
                            <div key={idx} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs font-medium">{slot.time}</span>
                              </div>
                              <p className="font-semibold text-sm">{slot.subject}</p>
                              <p className="text-xs text-muted-foreground">{slot.teacher}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('reports.performance')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 20]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="average" name={t('grades.average')} fill="#3b82f6" />
                          <Bar dataKey="classAvg" name={t('dashboard.classes')} fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.performanceEvolution')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={evolutionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 20]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
