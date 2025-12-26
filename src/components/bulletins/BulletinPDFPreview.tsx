import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Eye, 
  Download, 
  Printer, 
  FileText, 
  User, 
  BookOpen,
  Award,
  BarChart3,
  MessageSquare,
  Stamp,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { StudentBulletin, BulletinTemplate } from "@/types/bulletin";
import { useEtablissement } from "@/contexts/EtablissementContext";
import { generateBulletinPDF } from "./BulletinPDFGenerator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from "recharts";

interface BulletinPDFPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bulletin: StudentBulletin;
  template: BulletinTemplate;
}

export function BulletinPDFPreview({
  open,
  onOpenChange,
  bulletin,
  template,
}: BulletinPDFPreviewProps) {
  const { configuration } = useEtablissement();
  const [zoom, setZoom] = useState(100);

  // Extraction des données de configuration avec valeurs par défaut
  const logo = configuration.identite?.logo;
  const nomEtablissement = configuration.identite?.nom || "Nom de l'établissement";
  const adresse = configuration.localisation?.adresseComplete || "";
  const telephone = configuration.localisation?.telephonePrincipal || "";
  const email = configuration.localisation?.emailOfficiel || "";
  const ville = configuration.localisation?.ville || "";
  const cachetScan = configuration.parametresVisuels?.cachetScane;

  const getGradeColor = (average: number) => {
    if (average >= 16) return "text-green-600 dark:text-green-400";
    if (average >= 14) return "text-blue-600 dark:text-blue-400";
    if (average >= 10) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAppreciationLabel = (value: string) => {
    switch (value) {
      case "excellent": return "Excellent";
      case "good": return "Bien";
      case "average": return "Moyen";
      case "insufficient": return "Insuffisant";
      default: return value;
    }
  };

  const chartData = bulletin.subjects.map((subject) => ({
    name: subject.subjectName.length > 12 
      ? subject.subjectName.substring(0, 10) + "..." 
      : subject.subjectName,
    élève: subject.average,
    classe: subject.classAverage,
  }));

  const handleDownload = () => {
    generateBulletinPDF(bulletin, template);
    toast.success("Bulletin PDF téléchargé");
  };

  const handlePrint = () => {
    generateBulletinPDF(bulletin, template);
    toast.success("Préparation de l'impression...");
  };

  const trimesterLabel = bulletin.trimester === 1 ? "1er" : bulletin.trimester === 2 ? "2ème" : "3ème";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du Bulletin PDF
          </DialogTitle>
          <DialogDescription>
            {bulletin.studentName} - {bulletin.className} - {trimesterLabel} Trimestre {bulletin.academicYear}
          </DialogDescription>
        </DialogHeader>

        {/* Contrôles de zoom */}
        <div className="flex items-center justify-between py-2 px-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(150, zoom + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Template: {template}</Badge>
            {logo && (
              <Badge variant="secondary" className="gap-1">
                <FileText className="h-3 w-3" />
                Logo inclus
              </Badge>
            )}
            {cachetScan && (
              <Badge variant="secondary" className="gap-1">
                <Stamp className="h-3 w-3" />
                Cachet inclus
              </Badge>
            )}
          </div>
        </div>

        {/* Prévisualisation du bulletin */}
        <ScrollArea className="flex-1 pr-4">
          <div 
            className="bg-white border rounded-lg shadow-lg p-8 mx-auto"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              width: "210mm",
              minHeight: "297mm",
            }}
          >
            {/* En-tête avec logo et informations ministère */}
            <div className="border-b-2 border-primary pb-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {logo ? (
                    <div className="w-20 h-20 border rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src={logo} 
                        alt="Logo établissement" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">
                      {configuration.signataire?.ministereTutelleDocuments || "République de Côte d'Ivoire"}
                    </p>
                    <h1 className="text-xl font-bold text-primary">
                      {nomEtablissement}
                    </h1>
                    <p className="text-sm text-muted-foreground">{adresse}</p>
                    <p className="text-xs text-muted-foreground">
                      {telephone} | {email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Année scolaire</p>
                  <p className="text-lg font-bold text-primary">{bulletin.academicYear}</p>
                  <Badge className="mt-2">{trimesterLabel} Trimestre</Badge>
                </div>
              </div>
            </div>

            {/* Titre du bulletin */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-wider text-primary">
                BULLETIN DE NOTES
              </h2>
              <Separator className="my-3" />
            </div>

            {/* Informations de l'élève */}
            <Card className="mb-6 bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations de l'élève
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Nom et prénom</p>
                    <p className="font-semibold">{bulletin.studentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Matricule</p>
                    <p className="font-semibold">{bulletin.studentNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Classe</p>
                    <p className="font-semibold">{bulletin.className}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Classement</p>
                    <p className="font-semibold">{bulletin.rank}e / {bulletin.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tableau des notes */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Résultats par matière
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 font-medium">Matière</th>
                      <th className="text-center py-2 px-2 font-medium w-16">Coef.</th>
                      <th className="text-center py-2 px-2 font-medium w-20">Note</th>
                      <th className="text-center py-2 px-2 font-medium w-20">Moy. Cl.</th>
                      <th className="text-left py-2 px-3 font-medium">Enseignant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulletin.subjects.map((subject, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30">
                        <td className="py-2 px-3 font-medium">{subject.subjectName}</td>
                        <td className="text-center py-2 px-2">{subject.coefficient}</td>
                        <td className={`text-center py-2 px-2 font-bold ${getGradeColor(subject.average)}`}>
                          {subject.average.toFixed(2)}
                        </td>
                        <td className="text-center py-2 px-2 text-muted-foreground">
                          {subject.classAverage.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">
                          {subject.teacherName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary/10 font-bold">
                      <td className="py-3 px-3">MOYENNE GÉNÉRALE</td>
                      <td className="text-center py-3 px-2"></td>
                      <td className={`text-center py-3 px-2 text-lg ${getGradeColor(bulletin.generalAverage)}`}>
                        {bulletin.generalAverage.toFixed(2)}
                      </td>
                      <td className="text-center py-3 px-2 text-muted-foreground">
                        {bulletin.classGeneralAverage.toFixed(2)}
                      </td>
                      <td className="py-3 px-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>

            {/* Graphique de performance */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Graphique de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={10}
                    />
                    <YAxis domain={[0, 20]} fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="élève" fill="hsl(var(--primary))" name="Note élève" />
                    <Line 
                      type="monotone" 
                      dataKey="classe" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      name="Moy. classe"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Assiduité et appréciations */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Assiduité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Absences</span>
                    <span className="font-semibold">{bulletin.absences} jour(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retards</span>
                    <span className="font-semibold">{bulletin.tardiness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points discipline</span>
                    <span className="font-semibold">{bulletin.disciplinePoints}/100</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Appréciations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travail</span>
                    <Badge variant="outline" className="text-xs">
                      {getAppreciationLabel(bulletin.appreciations.work)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comportement</span>
                    <Badge variant="outline" className="text-xs">
                      {getAppreciationLabel(bulletin.appreciations.behavior)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Participation</span>
                    <Badge variant="outline" className="text-xs">
                      {getAppreciationLabel(bulletin.appreciations.participation)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commentaires */}
            {(bulletin.generalComment || bulletin.directorComment) && (
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Commentaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {bulletin.generalComment && (
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">Appréciation générale</p>
                      <p className="italic">"{bulletin.generalComment}"</p>
                    </div>
                  )}
                  {bulletin.directorComment && (
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">Mot du responsable</p>
                      <p className="italic">"{bulletin.directorComment}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Zone de signature avec cachet */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t-2">
              <div className="text-center">
                <p className="text-sm font-medium mb-12">Signature du parent</p>
                <div className="border-t-2 border-foreground/30 pt-1">
                  <p className="text-xs text-muted-foreground">Date et signature</p>
                </div>
              </div>
              <div className="text-center relative">
                <p className="text-sm font-medium mb-2">
                  {configuration.signataire?.fonctionSignataire || "Le Directeur"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {configuration.signataire?.nomSignataire || ""}
                </p>
                
                {/* Cachet scanné */}
                {cachetScan ? (
                  <div className="absolute right-0 top-8 w-24 h-24 opacity-80">
                    <img 
                      src={cachetScan} 
                      alt="Cachet officiel" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="absolute right-0 top-8 w-20 h-20 border-2 border-dashed rounded-full flex items-center justify-center text-xs text-muted-foreground">
                    <Stamp className="h-6 w-6" />
                  </div>
                )}
                
                <div className="border-t-2 border-foreground/30 pt-1 mt-8">
                  <p className="text-xs text-muted-foreground">Cachet et signature</p>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="text-center mt-8 pt-4 border-t text-xs text-muted-foreground">
              <p>{configuration.signataire?.ministereTutelleDocuments || "République de Côte d'Ivoire - Ministère de l'Éducation Nationale"}</p>
              <p>{nomEtablissement} - {ville}</p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
