import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Users, Clock, Calendar, CheckCircle, AlertTriangle,
  FileText, TrendingUp, GraduationCap, Bell, ClipboardList, Edit
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";

const statsEnseignant = {
  classesAttribuees: 6,
  totalEleves: 185,
  heuresSemaine: 22,
  coursEffectues: 85,
  devoirs: 12,
  notesASaisir: 3,
};

const emploiDuTempsAujourdhui = [
  { id: 1, heure: "08:00 - 10:00", classe: "Tle D", matiere: "Mathématiques", salle: "A12", statut: "Terminé" },
  { id: 2, heure: "10:15 - 12:15", classe: "1ère A", matiere: "Mathématiques", salle: "B05", statut: "En cours" },
  { id: 3, heure: "14:00 - 16:00", classe: "2nde B", matiere: "Mathématiques", salle: "A12", statut: "À venir" },
  { id: 4, heure: "16:15 - 17:15", classe: "3ème C", matiere: "Mathématiques", salle: "C08", statut: "À venir" },
];

const mesClasses = [
  { classe: "Tle D", effectif: 35, moyenne: 12.5, tauxPresence: 92, prochainDevoir: "18/12" },
  { classe: "1ère A", effectif: 32, moyenne: 11.8, tauxPresence: 88, prochainDevoir: "20/12" },
  { classe: "2nde B", effectif: 38, moyenne: 10.5, tauxPresence: 85, prochainDevoir: "17/12" },
  { classe: "3ème C", effectif: 28, moyenne: 13.2, tauxPresence: 95, prochainDevoir: "19/12" },
  { classe: "4ème A", effectif: 30, moyenne: 12.1, tauxPresence: 91, prochainDevoir: "21/12" },
  { classe: "5ème B", effectif: 22, moyenne: 11.0, tauxPresence: 89, prochainDevoir: "-" },
];

const evolutionMoyennes = [
  { periode: "Sept", tleD: 11.2, premiere: 10.5, seconde: 9.8 },
  { periode: "Oct", tleD: 11.8, premiere: 11.0, seconde: 10.2 },
  { periode: "Nov", tleD: 12.3, premiere: 11.5, seconde: 10.4 },
  { periode: "Déc", tleD: 12.5, premiere: 11.8, seconde: 10.5 },
];

const devoirsAVenir = [
  { id: 1, classe: "2nde B", type: "Devoir surveillé", date: "17/12/2024", sujet: "Équations du 2nd degré", statut: "Programmé" },
  { id: 2, classe: "Tle D", type: "Interrogation", date: "18/12/2024", sujet: "Limites de suites", statut: "Programmé" },
  { id: 3, classe: "3ème C", type: "Devoir maison", date: "19/12/2024", sujet: "Théorème de Pythagore", statut: "En préparation" },
  { id: 4, classe: "1ère A", type: "Composition", date: "20/12/2024", sujet: "Fin de trimestre", statut: "Programmé" },
];

const notificationsRecentes = [
  { id: 1, message: "Notes de Tle D à valider avant le 16/12", type: "urgent" },
  { id: 2, message: "Conseil de classe 1ère A le 22/12 à 14h", type: "info" },
  { id: 3, message: "Nouveau planning disponible pour Janvier", type: "info" },
  { id: 4, message: "3 absences à justifier en 2nde B", type: "warning" },
];

export default function EnseignantDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Espace Enseignant</h1>
          <p className="text-muted-foreground">Bienvenue, M. KOFFI • Mathématiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Mon Planning
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Saisir Notes
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsEnseignant.classesAttribuees}</div>
            <p className="text-xs text-muted-foreground">Attribuées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsEnseignant.totalEleves}</div>
            <p className="text-xs text-muted-foreground">Au total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures/Sem</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsEnseignant.heuresSemaine}h</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statsEnseignant.coursEffectues}%</div>
            <p className="text-xs text-muted-foreground">Effectués</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsEnseignant.devoirs}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À saisir</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{statsEnseignant.notesASaisir}</div>
            <p className="text-xs text-muted-foreground">Évaluations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Emploi du temps aujourd'hui */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Emploi du Temps - Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emploiDuTempsAujourdhui.map((cours) => (
                <div 
                  key={cours.id} 
                  className={`p-4 rounded-lg border ${
                    cours.statut === 'En cours' ? 'border-primary bg-primary/5' :
                    cours.statut === 'Terminé' ? 'border-green-200 bg-green-50 dark:bg-green-950' :
                    'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-mono text-sm font-medium">{cours.heure.split(' - ')[0]}</div>
                        <div className="text-xs text-muted-foreground">{cours.heure.split(' - ')[1]}</div>
                      </div>
                      <div>
                        <div className="font-semibold">{cours.classe} - {cours.matiere}</div>
                        <div className="text-sm text-muted-foreground">Salle {cours.salle}</div>
                      </div>
                    </div>
                    <Badge variant={
                      cours.statut === 'En cours' ? 'default' :
                      cours.statut === 'Terminé' ? 'secondary' : 'outline'
                    }>
                      {cours.statut}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationsRecentes.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg border-l-4 ${
                  notif.type === 'urgent' ? 'border-l-red-500 bg-red-50 dark:bg-red-950' :
                  notif.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
                  'border-l-blue-500 bg-blue-50 dark:bg-blue-950'
                }`}
              >
                <p className="text-sm">{notif.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">Mes Classes</TabsTrigger>
          <TabsTrigger value="devoirs">Devoirs & Évaluations</TabsTrigger>
          <TabsTrigger value="progression">Progression</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Synthèse par Classe</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Effectif</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Présence</TableHead>
                    <TableHead>Prochain Devoir</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mesClasses.map((classe) => (
                    <TableRow key={classe.classe}>
                      <TableCell className="font-medium">{classe.classe}</TableCell>
                      <TableCell>{classe.effectif} élèves</TableCell>
                      <TableCell>
                        <Badge variant={classe.moyenne >= 12 ? "default" : classe.moyenne >= 10 ? "secondary" : "destructive"}>
                          {classe.moyenne.toFixed(1)}/20
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={classe.tauxPresence} className="w-16 h-2" />
                          <span className="text-sm">{classe.tauxPresence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{classe.prochainDevoir}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline">Notes</Button>
                          <Button size="sm" variant="ghost">Appel</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devoirs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Devoirs & Évaluations à Venir</CardTitle>
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Programmer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devoirsAVenir.map((devoir) => (
                    <TableRow key={devoir.id}>
                      <TableCell className="font-medium">{devoir.classe}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{devoir.type}</Badge>
                      </TableCell>
                      <TableCell>{devoir.date}</TableCell>
                      <TableCell>{devoir.sujet}</TableCell>
                      <TableCell>
                        <Badge variant={devoir.statut === "Programmé" ? "default" : "secondary"}>
                          {devoir.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">Modifier</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progression">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Moyennes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionMoyennes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periode" />
                    <YAxis domain={[8, 16]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="tleD" stroke="#3b82f6" strokeWidth={2} name="Tle D" />
                    <Line type="monotone" dataKey="premiere" stroke="#10b981" strokeWidth={2} name="1ère A" />
                    <Line type="monotone" dataKey="seconde" stroke="#f59e0b" strokeWidth={2} name="2nde B" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
