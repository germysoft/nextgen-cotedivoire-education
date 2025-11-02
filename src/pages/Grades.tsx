import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calculator, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data
const mockStudentGrades = [
  {
    id: 1,
    studentName: "Kouassi Jean",
    matricule: "66800001A",
    class: "6èmeA",
    trimester: "1er Trimestre",
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
  const [selectedClass, setSelectedClass] = useState("6èmeA");
  const [selectedTrimester, setSelectedTrimester] = useState("1");
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);

  const calculateAverage = (subjects: any[]) => {
    const totalPoints = subjects.reduce((acc, s) => acc + s.grade * s.coef, 0);
    const totalCoef = subjects.reduce((acc, s) => acc + s.coef, 0);
    return (totalPoints / totalCoef).toFixed(2);
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
          <h1 className="text-3xl font-bold">Gestion des Notes</h1>
          <p className="text-muted-foreground">Saisir et consulter les notes des élèves</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calculator className="mr-2 h-4 w-4" />
                Saisir Notes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Saisir les notes</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Select defaultValue="6emeA">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6emeA">6èmeA</SelectItem>
                        <SelectItem value="5emeB">5èmeB</SelectItem>
                        <SelectItem value="4emeC">4èmeC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Matière</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="francais">Français</SelectItem>
                        <SelectItem value="maths">Mathématiques</SelectItem>
                        <SelectItem value="anglais">Anglais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trimestre</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1er Trimestre</SelectItem>
                        <SelectItem value="2">2ème Trimestre</SelectItem>
                        <SelectItem value="3">3ème Trimestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type d'évaluation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="devoir">Devoir</SelectItem>
                      <SelectItem value="compo">Composition</SelectItem>
                      <SelectItem value="interro">Interrogation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matricule</TableHead>
                        <TableHead>Nom & Prénoms</TableHead>
                        <TableHead>Note /20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockStudentGrades.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-mono text-sm">{student.matricule}</TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          <TableCell>
                            <Input type="number" className="w-20" placeholder="0" min="0" max="20" step="0.5" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsGradeDialogOpen(false)}>Annuler</Button>
                  <Button onClick={() => setIsGradeDialogOpen(false)}>Enregistrer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.8</div>
            <p className="text-xs text-muted-foreground">Classe 6èmeA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meilleure Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5</div>
            <p className="text-xs text-muted-foreground">Mathématiques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Moyenne ≥ 10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulletins Générés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Classe</Label>
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
              <Label>Trimestre</Label>
              <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1er Trimestre</SelectItem>
                  <SelectItem value="2">2ème Trimestre</SelectItem>
                  <SelectItem value="3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Année Scolaire</Label>
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
          <CardTitle>Relevé de Notes - {selectedClass}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">Liste des notes</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="space-y-4">
              {mockStudentGrades.map((student) => (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{student.studentName}</h3>
                      <p className="text-sm text-muted-foreground">Matricule: {student.matricule}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getGradeColor(parseFloat(calculateAverage(student.subjects)))} className="text-lg px-3 py-1">
                        Moyenne: {calculateAverage(student.subjects)}
                      </Badge>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matière</TableHead>
                        <TableHead>Enseignant</TableHead>
                        <TableHead className="text-center">Note /20</TableHead>
                        <TableHead className="text-center">Coef.</TableHead>
                        <TableHead className="text-center">Total Points</TableHead>
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
                    </TableBody>
                  </Table>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Générer Bulletin
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="stats">
              <div className="text-center py-12 text-muted-foreground">
                Statistiques détaillées à venir
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
