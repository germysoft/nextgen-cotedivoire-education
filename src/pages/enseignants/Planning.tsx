import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, User, Clock } from "lucide-react";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const emploi = {
  "Lundi": {
    "08:00": { classe: "Tle D", matiere: "Mathématiques", salle: "A12" },
    "10:00": { classe: "1ère C", matiere: "Mathématiques", salle: "A15" },
    "14:00": { classe: "2nde A", matiere: "Mathématiques", salle: "B08" },
  },
  "Mardi": {
    "09:00": { classe: "Tle D", matiere: "Mathématiques", salle: "A12" },
    "11:00": { classe: "1ère C", matiere: "Mathématiques", salle: "A15" },
    "15:00": { classe: "3ème B", matiere: "Mathématiques", salle: "B10" },
  },
  "Mercredi": {
    "08:00": { classe: "Tle D", matiere: "Mathématiques", salle: "A12" },
    "10:00": { classe: "2nde A", matiere: "Mathématiques", salle: "B08" },
  },
  "Jeudi": {
    "09:00": { classe: "1ère C", matiere: "Mathématiques", salle: "A15" },
    "14:00": { classe: "Tle D", matiere: "Mathématiques", salle: "A12" },
    "16:00": { classe: "3ème B", matiere: "Mathématiques", salle: "B10" },
  },
  "Vendredi": {
    "08:00": { classe: "2nde A", matiere: "Mathématiques", salle: "B08" },
    "10:00": { classe: "1ère C", matiere: "Mathématiques", salle: "A15" },
    "15:00": { classe: "Tle D", matiere: "Mathématiques", salle: "A12" },
  },
};

export default function Planning() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planning Hebdomadaire</h1>
          <p className="text-muted-foreground">Emploi du temps enseignant</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Changer Semaine
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <div>
                <CardTitle>M. KOFFI Yao - Mathématiques</CardTitle>
                <p className="text-sm text-muted-foreground">Semaine du 16 au 20 Décembre 2024</p>
              </div>
            </div>
            <Badge variant="default">18 heures</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Semaine</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18h</div>
            <p className="text-xs text-muted-foreground">Sur 18h max</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Tle D, 1ère C, 2nde A, 3ème B</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours cette Semaine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Séances programmées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salles</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">A12, A15, B08</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emploi du Temps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted font-medium text-left min-w-[100px]">Heures</th>
                  {jours.map((jour) => (
                    <th key={jour} className="border p-2 bg-muted font-medium text-center min-w-[150px]">
                      {jour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heures.map((heure) => (
                  <tr key={heure}>
                    <td className="border p-2 font-medium bg-muted/50">{heure}</td>
                    {jours.map((jour) => {
                      const cours = emploi[jour as keyof typeof emploi]?.[heure];
                      return (
                        <td key={`${jour}-${heure}`} className="border p-2">
                          {cours ? (
                            <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
                              <p className="font-semibold text-sm">{cours.classe}</p>
                              <p className="text-xs text-muted-foreground">{cours.matiere}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {cours.salle}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
