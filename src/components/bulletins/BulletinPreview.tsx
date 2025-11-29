import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentBulletin } from "@/types/bulletin";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from "recharts";

interface BulletinPreviewProps {
  bulletin: StudentBulletin;
}

export function BulletinPreview({ bulletin }: BulletinPreviewProps) {
  const getAppreciationColor = (value: string) => {
    switch (value) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'insufficient':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getAppreciationLabel = (value: string) => {
    switch (value) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Bien';
      case 'average':
        return 'Moyen';
      case 'insufficient':
        return 'Insuffisant';
      default:
        return value;
    }
  };

  const getGradeColor = (average: number) => {
    if (average >= 16) return 'text-green-600 dark:text-green-400';
    if (average >= 14) return 'text-blue-600 dark:text-blue-400';
    if (average >= 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Données pour le graphique comparatif
  const chartData = bulletin.subjects.map(subject => ({
    name: subject.subjectName.length > 15 
      ? subject.subjectName.substring(0, 12) + '...' 
      : subject.subjectName,
    élève: subject.average,
    classe: subject.classAverage,
  }));

  return (
    <div className="space-y-6 bg-background p-6 rounded-lg border">
      {/* En-tête du bulletin */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold">BULLETIN SCOLAIRE</h1>
        <p className="text-muted-foreground mt-1">
          {bulletin.trimester === 1 ? '1er' : bulletin.trimester === 2 ? '2ème' : '3ème'} Trimestre - Année {bulletin.academicYear}
        </p>
      </div>

      {/* Informations de l'élève */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'élève</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom et prénom</p>
              <p className="font-semibold">{bulletin.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Matricule</p>
              <p className="font-semibold">{bulletin.studentNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classe</p>
              <p className="font-semibold">{bulletin.className}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classement</p>
              <p className="font-semibold">
                {bulletin.rank}e / {bulletin.totalStudents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats par matière */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats par matière</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Matière</th>
                  <th className="text-center py-2 px-2">Coef.</th>
                  <th className="text-center py-2 px-2">Note</th>
                  <th className="text-center py-2 px-2">Moy. Classe</th>
                  <th className="text-left py-2 px-2">Enseignant</th>
                  <th className="text-left py-2 px-2">Appréciation</th>
                </tr>
              </thead>
              <tbody>
                {bulletin.subjects.map((subject, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{subject.subjectName}</td>
                    <td className="text-center py-3 px-2">{subject.coefficient}</td>
                    <td className={`text-center py-3 px-2 font-bold ${getGradeColor(subject.average)}`}>
                      {subject.average.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-2 text-muted-foreground">
                      {subject.classAverage.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      {subject.teacherName}
                    </td>
                    <td className="py-3 px-2 text-xs">{subject.comment}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2">
                <tr className="font-bold">
                  <td className="py-3 px-2">MOYENNE GÉNÉRALE</td>
                  <td className="text-center py-3 px-2"></td>
                  <td className={`text-center py-3 px-2 text-lg ${getGradeColor(bulletin.generalAverage)}`}>
                    {bulletin.generalAverage.toFixed(2)}
                  </td>
                  <td className="text-center py-3 px-2 text-muted-foreground">
                    {bulletin.classGeneralAverage.toFixed(2)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Graphique de performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par matière</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis domain={[0, 20]} />
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

      {/* Assiduité et comportement */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Assiduité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
          <CardHeader>
            <CardTitle>Appréciations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Travail</span>
              <Badge className={getAppreciationColor(bulletin.appreciations.work)} variant="outline">
                {getAppreciationLabel(bulletin.appreciations.work)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Comportement</span>
              <Badge className={getAppreciationColor(bulletin.appreciations.behavior)} variant="outline">
                {getAppreciationLabel(bulletin.appreciations.behavior)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Participation</span>
              <Badge className={getAppreciationColor(bulletin.appreciations.participation)} variant="outline">
                {getAppreciationLabel(bulletin.appreciations.participation)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commentaires */}
      {(bulletin.generalComment || bulletin.directorComment) && (
        <Card>
          <CardHeader>
            <CardTitle>Commentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bulletin.generalComment && (
              <div>
                <p className="text-sm font-medium mb-1">Appréciation générale</p>
                <p className="text-sm text-muted-foreground italic">
                  "{bulletin.generalComment}"
                </p>
              </div>
            )}
            {bulletin.directorComment && (
              <div>
                <p className="text-sm font-medium mb-1">Mot du directeur</p>
                <p className="text-sm text-muted-foreground italic">
                  "{bulletin.directorComment}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Signature */}
      <div className="grid md:grid-cols-2 gap-8 pt-6 border-t">
        <div className="text-center">
          <p className="text-sm font-medium mb-8">Signature du parent</p>
          <div className="border-t-2 border-foreground/20 pt-1">
            <p className="text-xs text-muted-foreground">Date et signature</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-8">Le Directeur</p>
          <div className="border-t-2 border-foreground/20 pt-1">
            <p className="text-xs text-muted-foreground">Cachet et signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
