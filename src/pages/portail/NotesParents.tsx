import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Download,
  Award,
  Target,
  BarChart3,
  FileText,
  Medal,
  Star,
  Calendar,
  Eye,
  Printer
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

// Mock data
const mockStudent = {
  matricule: "66800001A",
  name: "Kouassi Jean-Marc",
  class: "6ème A",
  trimester: "1er Trimestre"
};

const notesParMatiere = [
  { subject: "Mathématiques", coef: 4, interro1: 14, interro2: 15, devoir: 13, composition: 16, moyenne: 14.5, moyenneClasse: 12.3, rang: 8, appreciation: "Très bien" },
  { subject: "Français", coef: 4, interro1: 12, interro2: 13, devoir: 14, composition: 13, moyenne: 13.0, moyenneClasse: 11.8, rang: 12, appreciation: "Bien" },
  { subject: "Anglais", coef: 3, interro1: 16, interro2: 15, devoir: 15, composition: 16, moyenne: 15.5, moyenneClasse: 13.2, rang: 5, appreciation: "Excellent" },
  { subject: "Histoire-Géo", coef: 3, interro1: 11, interro2: 12, devoir: 13, composition: 12, moyenne: 12.0, moyenneClasse: 11.5, rang: 15, appreciation: "Assez bien" },
  { subject: "SVT", coef: 2, interro1: 16, interro2: 17, devoir: 15, composition: 16, moyenne: 16.0, moyenneClasse: 12.8, rang: 3, appreciation: "Excellent" },
  { subject: "Physique-Chimie", coef: 2, interro1: 13, interro2: 14, devoir: 13, composition: 14, moyenne: 13.5, moyenneClasse: 12.0, rang: 10, appreciation: "Bien" },
  { subject: "EPS", coef: 1, interro1: 17, interro2: 18, devoir: 16, composition: 17, moyenne: 17.0, moyenneClasse: 14.5, rang: 2, appreciation: "Excellent" },
  { subject: "Arts Plastiques", coef: 1, interro1: 15, interro2: 14, devoir: 15, composition: 15, moyenne: 14.75, moyenneClasse: 13.5, rang: 7, appreciation: "Très bien" },
];

const evolutionTrimestrielle = [
  { trimester: "T1 2022-2023", moyenne: 12.8 },
  { trimester: "T2 2022-2023", moyenne: 13.2 },
  { trimester: "T3 2022-2023", moyenne: 13.8 },
  { trimester: "T1 2023-2024", moyenne: 14.2 },
  { trimester: "T2 2023-2024", moyenne: 14.5 },
  { trimester: "T3 2023-2024", moyenne: 15.0 },
];

const radarData = notesParMatiere.map(n => ({
  subject: n.subject.length > 10 ? n.subject.substring(0, 10) + "..." : n.subject,
  eleve: n.moyenne,
  classe: n.moyenneClasse,
  fullMark: 20
}));

const bulletins = [
  { id: 1, year: "2023-2024", trimester: "3ème Trimestre", moyenne: 15.0, rang: 5, total: 42, mention: "Bien", status: "Disponible" },
  { id: 2, year: "2023-2024", trimester: "2ème Trimestre", moyenne: 14.5, rang: 7, total: 42, mention: "Assez Bien", status: "Disponible" },
  { id: 3, year: "2023-2024", trimester: "1er Trimestre", moyenne: 14.2, rang: 8, total: 42, mention: "Assez Bien", status: "Disponible" },
  { id: 4, year: "2022-2023", trimester: "3ème Trimestre", moyenne: 13.8, rang: 9, total: 42, mention: "Assez Bien", status: "Disponible" },
  { id: 5, year: "2022-2023", trimester: "2ème Trimestre", moyenne: 13.2, rang: 11, total: 42, mention: "Passable", status: "Disponible" },
];

const comparaisonMatieres = notesParMatiere.map(n => ({
  subject: n.subject.substring(0, 8),
  eleve: n.moyenne,
  classe: n.moyenneClasse
}));

export default function NotesParents() {
  const [selectedTrimester, setSelectedTrimester] = useState("1er Trimestre");
  const [selectedYear, setSelectedYear] = useState("2023-2024");

  const moyenneGenerale = notesParMatiere.reduce((acc, n) => acc + (n.moyenne * n.coef), 0) / 
                          notesParMatiere.reduce((acc, n) => acc + n.coef, 0);
  
  const moyenneClasseGenerale = notesParMatiere.reduce((acc, n) => acc + (n.moyenneClasse * n.coef), 0) / 
                                notesParMatiere.reduce((acc, n) => acc + n.coef, 0);

  const rangGeneral = 8;
  const totalEleves = 42;

  const handleDownloadBulletin = (bulletinData: typeof bulletins[0]) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(10);
    doc.text("RÉPUBLIQUE DE CÔTE D'IVOIRE", 105, 15, { align: "center" });
    doc.text("Union - Discipline - Travail", 105, 20, { align: "center" });
    
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BULLETIN SCOLAIRE", 105, 35, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Année scolaire: ${bulletinData.year}`, 105, 45, { align: "center" });
    doc.text(`${bulletinData.trimester}`, 105, 52, { align: "center" });
    
    // Student Info
    doc.setFontSize(11);
    doc.text(`Élève: ${mockStudent.name}`, 20, 65);
    doc.text(`Matricule: ${mockStudent.matricule}`, 20, 72);
    doc.text(`Classe: ${mockStudent.class}`, 120, 65);
    doc.text(`Effectif: ${bulletinData.total} élèves`, 120, 72);
    
    // Grades table
    const tableData = notesParMatiere.map(n => [
      n.subject,
      n.coef.toString(),
      n.interro1.toString(),
      n.interro2.toString(),
      n.devoir.toString(),
      n.composition.toString(),
      n.moyenne.toFixed(2),
      n.moyenneClasse.toFixed(2),
      `${n.rang}ème`,
      n.appreciation
    ]);
    
    autoTable(doc, {
      head: [['Matière', 'Coef', 'Int.1', 'Int.2', 'Devoir', 'Compo', 'Moy.', 'Moy.Cl', 'Rang', 'Appré.']],
      body: tableData,
      startY: 80,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 51, 102], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    
    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(0, 51, 102);
    doc.rect(20, finalY, 170, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Moyenne Générale: ${bulletinData.moyenne.toFixed(2)}/20`, 30, finalY + 8);
    doc.text(`Rang: ${bulletinData.rang}ème/${bulletinData.total}`, 100, finalY + 8);
    doc.text(`Mention: ${bulletinData.mention}`, 150, finalY + 8);
    
    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Fait à Abidjan, le ${new Date().toLocaleDateString('fr-FR')}`, 130, finalY + 35);
    doc.text("Le Directeur", 155, finalY + 45);
    doc.line(130, finalY + 55, 180, finalY + 55);
    
    doc.save(`Bulletin_${mockStudent.name.replace(/\s/g, '_')}_${bulletinData.trimester.replace(/\s/g, '_')}.pdf`);
    toast.success(`Bulletin ${bulletinData.trimester} téléchargé`);
  };

  const handlePrintNotes = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RELEVÉ DE NOTES DÉTAILLÉ", 105, 20, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Élève: ${mockStudent.name}`, 20, 35);
    doc.text(`Classe: ${mockStudent.class}`, 120, 35);
    doc.text(`Période: ${selectedTrimester} - ${selectedYear}`, 20, 42);
    
    const tableData = notesParMatiere.map(n => [
      n.subject,
      n.coef.toString(),
      n.interro1.toString(),
      n.interro2.toString(),
      n.devoir.toString(),
      n.composition.toString(),
      n.moyenne.toFixed(2),
      n.moyenneClasse.toFixed(2),
      `${n.rang}ème`
    ]);
    
    autoTable(doc, {
      head: [['Matière', 'Coef', 'Int.1', 'Int.2', 'Devoir', 'Compo', 'Moyenne', 'Moy.Cl', 'Rang']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 51, 102] },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Moyenne Générale: ${moyenneGenerale.toFixed(2)}/20`, 20, finalY);
    doc.text(`Classement: ${rangGeneral}ème sur ${totalEleves}`, 120, finalY);
    
    doc.save(`Notes_${mockStudent.name.replace(/\s/g, '_')}_${selectedTrimester.replace(/\s/g, '_')}.pdf`);
    toast.success("Relevé de notes exporté en PDF");
  };

  const handleExportEvolution = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ÉVOLUTION DES RÉSULTATS SCOLAIRES", 105, 20, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Élève: ${mockStudent.name} - ${mockStudent.class}`, 20, 35);
    
    const evolutionData = evolutionTrimestrielle.map(e => [
      e.trimester,
      `${e.moyenne.toFixed(2)}/20`
    ]);
    
    autoTable(doc, {
      head: [['Période', 'Moyenne']],
      body: evolutionData,
      startY: 45,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [0, 51, 102] },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    const progression = evolutionTrimestrielle[evolutionTrimestrielle.length - 1].moyenne - evolutionTrimestrielle[0].moyenne;
    doc.text(`Progression totale: ${progression > 0 ? '+' : ''}${progression.toFixed(2)} points`, 20, finalY);
    
    doc.save(`Evolution_${mockStudent.name.replace(/\s/g, '_')}.pdf`);
    toast.success("Rapport d'évolution exporté");
  };

  const getNoteColor = (note: number) => {
    if (note >= 16) return "text-success";
    if (note >= 14) return "text-primary";
    if (note >= 10) return "text-warning";
    return "text-destructive";
  };

  const getMentionBadge = (mention: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-success/10 text-success border-success/20",
      "Très Bien": "bg-primary/10 text-primary border-primary/20",
      "Bien": "bg-primary/10 text-primary border-primary/20",
      "Assez Bien": "bg-warning/10 text-warning border-warning/20",
      "Passable": "bg-muted text-muted-foreground"
    };
    return colors[mention] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Notes & Bulletins
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivi des résultats scolaires de {mockStudent.name} - {mockStudent.class}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1er Trimestre">1er Trimestre</SelectItem>
              <SelectItem value="2ème Trimestre">2ème Trimestre</SelectItem>
              <SelectItem value="3ème Trimestre">3ème Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getNoteColor(moyenneGenerale)}`}>
              {moyenneGenerale.toFixed(2)}/20
            </div>
            <Progress value={(moyenneGenerale / 20) * 100} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Moy. classe: {moyenneClasseGenerale.toFixed(2)}/20
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classement</CardTitle>
            <Medal className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {rangGeneral}<sup>ème</sup>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Sur {totalEleves} élèves
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meilleure Matière</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">EPS</div>
            <p className="text-sm text-success font-medium">17.0/20</p>
            <p className="text-xs text-muted-foreground mt-1">2ème de la classe</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Améliorer</CardTitle>
            <Target className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Histoire-Géo</div>
            <p className="text-sm text-warning font-medium">12.0/20</p>
            <p className="text-xs text-muted-foreground mt-1">15ème de la classe</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="notes" className="flex items-center gap-2 py-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Notes Détaillées</span>
          </TabsTrigger>
          <TabsTrigger value="bulletins" className="flex items-center gap-2 py-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Bulletins</span>
          </TabsTrigger>
          <TabsTrigger value="evolution" className="flex items-center gap-2 py-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Évolution</span>
          </TabsTrigger>
          <TabsTrigger value="comparaison" className="flex items-center gap-2 py-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Comparaison</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handlePrintNotes}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer les notes
          </Button>
        </div>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes par Matière - {selectedTrimester}</CardTitle>
              <CardDescription>Détail des notes obtenues pour chaque évaluation</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Matière</TableHead>
                      <TableHead className="text-center">Coef</TableHead>
                      <TableHead className="text-center">Int. 1</TableHead>
                      <TableHead className="text-center">Int. 2</TableHead>
                      <TableHead className="text-center">Devoir</TableHead>
                      <TableHead className="text-center">Compo.</TableHead>
                      <TableHead className="text-center">Moyenne</TableHead>
                      <TableHead className="text-center">Moy. Classe</TableHead>
                      <TableHead className="text-center">Rang</TableHead>
                      <TableHead>Appréciation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notesParMatiere.map((note, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            {note.subject}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{note.coef}</TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.interro1)}>{note.interro1}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.interro2)}>{note.interro2}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.devoir)}>{note.devoir}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={getNoteColor(note.composition)}>{note.composition}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${getNoteColor(note.moyenne)} bg-transparent font-bold`}>
                            {note.moyenne.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {note.moyenneClasse.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{note.rang}ème</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMentionBadge(note.appreciation)}>
                            {note.appreciation}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-6 bg-muted/30 border-t">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-lg font-semibold">Moyenne Générale Pondérée:</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-3xl font-bold ${getNoteColor(moyenneGenerale)}`}>
                      {moyenneGenerale.toFixed(2)} / 20
                    </span>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      {moyenneGenerale > moyenneClasseGenerale ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm text-success">
                            +{(moyenneGenerale - moyenneClasseGenerale).toFixed(2)} par rapport à la classe
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">
                            {(moyenneGenerale - moyenneClasseGenerale).toFixed(2)} par rapport à la classe
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulletins Tab */}
        <TabsContent value="bulletins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Bulletins</CardTitle>
              <CardDescription>Téléchargez les bulletins scolaires de votre enfant</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Année</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-center">Moyenne</TableHead>
                    <TableHead className="text-center">Rang</TableHead>
                    <TableHead className="text-center">Mention</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulletins.map((bulletin) => (
                    <TableRow key={bulletin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {bulletin.year}
                        </div>
                      </TableCell>
                      <TableCell>{bulletin.trimester}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getNoteColor(bulletin.moyenne)} bg-transparent font-bold`}>
                          {bulletin.moyenne.toFixed(2)}/20
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {bulletin.rang}<sup>ème</sup>/{bulletin.total}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getMentionBadge(bulletin.mention)}>
                          {bulletin.mention}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {bulletin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadBulletin(bulletin)}
                            title="Télécharger PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              toast.info(`Prévisualisation du bulletin ${bulletin.trimester}`);
                            }}
                            title="Prévisualiser"
                          >
                            <Eye className="h-4 w-4" />
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

        {/* Evolution Tab */}
        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Résultats</CardTitle>
              <CardDescription>Progression de la moyenne générale au fil des trimestres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionTrimestrielle}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="trimester" className="text-xs" />
                    <YAxis domain={[0, 20]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="moyenne" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                      name="Moyenne"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">
                    Progression de +2.2 points sur l'année scolaire
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  L'élève montre une amélioration constante de ses résultats.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparaison Tab */}
        <TabsContent value="comparaison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Radar des Compétences</CardTitle>
                <CardDescription>Comparaison avec la moyenne de classe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 20]} />
                      <Radar 
                        name="Élève" 
                        dataKey="eleve" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.5} 
                      />
                      <Radar 
                        name="Classe" 
                        dataKey="classe" 
                        stroke="hsl(var(--muted-foreground))" 
                        fill="hsl(var(--muted-foreground))" 
                        fillOpacity={0.3} 
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparaison par Matière</CardTitle>
                <CardDescription>Notes élève vs moyenne classe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparaisonMatieres} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 20]} />
                      <YAxis dataKey="subject" type="category" width={80} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="eleve" name="Élève" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="classe" name="Classe" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Points forts et faibles */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-success">
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Points Forts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {notesParMatiere
                    .filter(n => n.moyenne >= 15)
                    .sort((a, b) => b.moyenne - a.moyenne)
                    .map((n, i) => (
                      <li key={i} className="flex items-center justify-between p-2 bg-success/5 rounded-lg">
                        <span className="font-medium">{n.subject}</span>
                        <Badge className="bg-success/10 text-success border-success/20">
                          {n.moyenne.toFixed(2)}/20
                        </Badge>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader>
                <CardTitle className="text-warning flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  À Renforcer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {notesParMatiere
                    .filter(n => n.moyenne < 14)
                    .sort((a, b) => a.moyenne - b.moyenne)
                    .map((n, i) => (
                      <li key={i} className="flex items-center justify-between p-2 bg-warning/5 rounded-lg">
                        <span className="font-medium">{n.subject}</span>
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          {n.moyenne.toFixed(2)}/20
                        </Badge>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
