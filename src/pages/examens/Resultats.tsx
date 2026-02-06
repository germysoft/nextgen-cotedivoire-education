import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, TrendingUp, Download, FileText, Medal, Send, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Resultat {
  rang: number;
  nom: string;
  numero: string;
  moyenne: number;
  mention: string;
  photo: string;
  classe?: string;
}

const mockResultats: Resultat[] = [
  { rang: 1, nom: "TRAORÉ Marie", numero: "C2025002", moyenne: 18.25, mention: "Très Bien", photo: "https://images.unsplash.com/photo-1595956246544-e697b3b12ac0?w=150&h=150&fit=crop&crop=faces", classe: "3ème A" },
  { rang: 2, nom: "KOUASSI Jean", numero: "C2025001", moyenne: 17.80, mention: "Très Bien", photo: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=faces", classe: "3ème A" },
  { rang: 3, nom: "YAO Pascal", numero: "C2025003", moyenne: 16.45, mention: "Bien", photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces", classe: "3ème B" },
  { rang: 4, nom: "DIALLO Fatima", numero: "C2025004", moyenne: 15.20, mention: "Bien", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces", classe: "3ème A" },
  { rang: 5, nom: "BAMBA Serge", numero: "C2025005", moyenne: 14.10, mention: "Assez Bien", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces", classe: "3ème C" },
  { rang: 6, nom: "KONÉ Aminata", numero: "C2025006", moyenne: 12.80, mention: "Assez Bien", photo: "", classe: "3ème B" },
  { rang: 7, nom: "SANOGO Paul", numero: "C2025007", moyenne: 11.50, mention: "Passable", photo: "", classe: "3ème C" },
  { rang: 8, nom: "OUATTARA Issa", numero: "C2025008", moyenne: 10.20, mention: "Passable", photo: "", classe: "3ème A" },
];

const mentionsStats = [
  { name: "Très Bien", value: 48, color: "hsl(var(--chart-1))" },
  { name: "Bien", value: 82, color: "hsl(var(--chart-2))" },
  { name: "Assez Bien", value: 65, color: "hsl(var(--chart-3))" },
  { name: "Passable", value: 40, color: "hsl(var(--chart-4))" },
];

const classesStats = [
  { classe: "3ème A", candidats: 45, admis: 43, taux: 95.6, moyenne: 15.2 },
  { classe: "3ème B", candidats: 42, admis: 38, taux: 90.5, moyenne: 14.5 },
  { classe: "3ème C", candidats: 40, admis: 37, taux: 92.5, moyenne: 14.8 },
];

const getMentionColor = (mention: string) => {
  switch (mention) {
    case "Très Bien": return "text-purple-600 bg-purple-100 dark:bg-purple-950";
    case "Bien": return "text-blue-600 bg-blue-100 dark:bg-blue-950";
    case "Assez Bien": return "text-green-600 bg-green-100 dark:bg-green-950";
    case "Passable": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950";
    default: return "";
  }
};

export default function ResultatsExamens() {
  const [filterType, setFilterType] = useState("tous");
  const [isPublished, setIsPublished] = useState(false);
  const [isReleveOpen, setIsReleveOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Resultat | null>(null);

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("RÉSULTATS - BEPC 2025", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 25);
    doc.text(`Taux de réussite: 92.5% | Admis: 235/254`, 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [["Rang", "Nom", "N° Candidat", "Classe", "Moyenne", "Mention"]],
      body: mockResultats.map(r => [
        `${r.rang}°`, r.nom, r.numero, r.classe || "-", `${r.moyenne}/20`, r.mention
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Resultats_BEPC_2025.pdf");
    toast.success("Export réussi", { description: "Les résultats ont été exportés en PDF" });
  };

  const handlePublish = () => {
    setIsPublished(true);
    toast.success("Résultats publiés", { description: "Les résultats sont maintenant accessibles sur le portail parents et élèves" });
  };

  const handleGenerateReleve = (student: Resultat) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("RELEVÉ DE NOTES - BEPC 2025", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Candidat: ${student.nom}`, 20, 40);
    doc.text(`N° Candidat: ${student.numero}`, 20, 48);
    doc.text(`Classe: ${student.classe || "-"}`, 20, 56);

    const subjects = [
      ["Français", "4", `${(student.moyenne + 1.2).toFixed(1)}`, `${((student.moyenne + 1.2) * 4).toFixed(1)}`],
      ["Mathématiques", "4", `${(student.moyenne - 0.5).toFixed(1)}`, `${((student.moyenne - 0.5) * 4).toFixed(1)}`],
      ["Sciences Physiques", "3", `${(student.moyenne + 0.3).toFixed(1)}`, `${((student.moyenne + 0.3) * 3).toFixed(1)}`],
      ["SVT", "2", `${(student.moyenne + 1.8).toFixed(1)}`, `${((student.moyenne + 1.8) * 2).toFixed(1)}`],
      ["Histoire-Géo", "2", `${(student.moyenne + 0.7).toFixed(1)}`, `${((student.moyenne + 0.7) * 2).toFixed(1)}`],
      ["Anglais", "2", `${(student.moyenne - 0.2).toFixed(1)}`, `${((student.moyenne - 0.2) * 2).toFixed(1)}`],
      ["EPS", "1", `${(student.moyenne + 2).toFixed(1)}`, `${((student.moyenne + 2) * 1).toFixed(1)}`],
    ];

    autoTable(doc, {
      startY: 65,
      head: [["Matière", "Coef.", "Note /20", "Total"]],
      body: subjects,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(14);
    doc.text(`Moyenne Générale: ${student.moyenne}/20`, 20, finalY + 15);
    doc.text(`Mention: ${student.mention}`, 20, finalY + 25);
    doc.text(`Rang: ${student.rang}°/254`, 20, finalY + 35);
    doc.text(`Décision: ADMIS`, 20, finalY + 45);

    doc.save(`Releve_${student.numero}_${student.nom.replace(/\s/g, '_')}.pdf`);
    toast.success("Relevé généré", { description: `Le relevé de ${student.nom} a été téléchargé` });
  };

  const handleViewReleve = (student: Resultat) => {
    setSelectedStudent(student);
    setIsReleveOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            Résultats & Classements
          </h1>
          <p className="text-muted-foreground mt-1">
            Publication et analyse des résultats d'examens
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exporter PDF
          </Button>
          <Button className="gap-2" onClick={handlePublish} disabled={isPublished}>
            <Send className="h-4 w-4" />
            {isPublished ? "Publiés ✓" : "Publier Résultats"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">92.5%</div>
            <Progress value={92.5} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">235</div>
            <p className="text-xs text-muted-foreground mt-1">sur 254 candidats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mention Très Bien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">48</div>
            <p className="text-xs text-muted-foreground mt-1">20.4% des admis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne Générale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">14.8/20</div>
            <p className="text-xs text-muted-foreground mt-1">+0.5 vs 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meilleure Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">18.25</div>
            <p className="text-xs text-muted-foreground mt-1">TRAORÉ Marie</p>
          </CardContent>
        </Card>
      </div>

      {isPublished && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Send className="h-4 w-4" />
              <span className="font-medium">Résultats publiés et accessibles sur le portail parents/élèves</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="classement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classement">Classement Général</TabsTrigger>
          <TabsTrigger value="classes">Par Classe</TabsTrigger>
          <TabsTrigger value="mentions">Par Mention</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="classement" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Classement Général - BEPC 2025</CardTitle>
                  <CardDescription>Top candidats par ordre de mérite</CardDescription>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les candidats</SelectItem>
                    <SelectItem value="reguliers">Réguliers uniquement</SelectItem>
                    <SelectItem value="libres">Libres uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rang</TableHead>
                    <TableHead>Candidat</TableHead>
                    <TableHead>N° Candidat</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Mention</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResultats.map((resultat) => (
                    <TableRow key={resultat.numero}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {resultat.rang <= 3 && (
                            <Medal className={`h-5 w-5 ${
                              resultat.rang === 1 ? "text-yellow-500" :
                              resultat.rang === 2 ? "text-gray-400" : "text-orange-600"
                            }`} />
                          )}
                          <span className="font-bold text-lg">{resultat.rang}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={resultat.photo} />
                            <AvatarFallback>{resultat.nom.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{resultat.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{resultat.numero}</TableCell>
                      <TableCell>{resultat.classe}</TableCell>
                      <TableCell>
                        <div className="font-bold text-lg">{resultat.moyenne}/20</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMentionColor(resultat.mention)}>{resultat.mention}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewReleve(resultat)}>
                            <Eye className="h-3 w-3" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleGenerateReleve(resultat)}>
                            <FileText className="h-3 w-3" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {classesStats.map((cls) => (
              <Card key={cls.classe}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cls.classe}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Candidats:</span>
                    <span className="font-medium">{cls.candidats}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Admis:</span>
                    <span className="font-medium text-green-600">{cls.admis}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taux:</span>
                    <Badge className="bg-green-100 text-green-700">{cls.taux}%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Moyenne:</span>
                    <span className="font-bold">{cls.moyenne}/20</span>
                  </div>
                  <Progress value={cls.taux} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentions" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Très Bien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">48</div>
                <p className="text-sm text-muted-foreground mt-1">≥ 16/20</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Bien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">82</div>
                <p className="text-sm text-muted-foreground mt-1">14-16/20</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50 dark:bg-green-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Assez Bien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">65</div>
                <p className="text-sm text-muted-foreground mt-1">12-14/20</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Passable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600">40</div>
                <p className="text-sm text-muted-foreground mt-1">10-12/20</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des Mentions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mentionsStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {mentionsStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Résultats par Classe</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classesStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="classe" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="taux" name="Taux de réussite (%)" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="moyenne" name="Moyenne /20" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Relevé Preview */}
      <Dialog open={isReleveOpen} onOpenChange={setIsReleveOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Relevé de Notes - {selectedStudent?.nom}</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">N° Candidat:</span> {selectedStudent.numero}</div>
                <div><span className="text-muted-foreground">Classe:</span> {selectedStudent.classe}</div>
                <div><span className="text-muted-foreground">Moyenne:</span> <span className="font-bold">{selectedStudent.moyenne}/20</span></div>
                <div><span className="text-muted-foreground">Mention:</span> <Badge className={getMentionColor(selectedStudent.mention)}>{selectedStudent.mention}</Badge></div>
                <div><span className="text-muted-foreground">Rang:</span> {selectedStudent.rang}°/254</div>
                <div><span className="text-muted-foreground">Décision:</span> <Badge>ADMIS</Badge></div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Coef.</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { mat: "Français", coef: 4, note: selectedStudent.moyenne + 1.2 },
                    { mat: "Mathématiques", coef: 4, note: selectedStudent.moyenne - 0.5 },
                    { mat: "Sciences Physiques", coef: 3, note: selectedStudent.moyenne + 0.3 },
                    { mat: "SVT", coef: 2, note: selectedStudent.moyenne + 1.8 },
                    { mat: "Histoire-Géo", coef: 2, note: selectedStudent.moyenne + 0.7 },
                    { mat: "Anglais", coef: 2, note: selectedStudent.moyenne - 0.2 },
                    { mat: "EPS", coef: 1, note: Math.min(selectedStudent.moyenne + 2, 20) },
                  ].map(s => (
                    <TableRow key={s.mat}>
                      <TableCell>{s.mat}</TableCell>
                      <TableCell>{s.coef}</TableCell>
                      <TableCell className="font-medium">{s.note.toFixed(1)}/20</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReleveOpen(false)}>Fermer</Button>
                <Button onClick={() => { handleGenerateReleve(selectedStudent); setIsReleveOpen(false); }}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger PDF
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
