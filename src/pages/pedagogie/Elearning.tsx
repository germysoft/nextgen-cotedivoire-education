import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, BookOpen, FileText, Video, Clock, Users, CheckCircle, 
  Search, Plus, Upload, Download, Eye, Edit, Trash2, Star
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const courses = [
  { id: 1, titre: "Mathématiques - Fonctions", classe: "1ère C", enseignant: "M. KOFFI", modules: 8, duree: "6h30", completion: 75, etudiants: 45, statut: "En cours" },
  { id: 2, titre: "Physique-Chimie - Électricité", classe: "Tle D", enseignant: "Mme DIALLO", modules: 6, duree: "4h20", completion: 100, etudiants: 38, statut: "Terminé" },
  { id: 3, titre: "SVT - La Cellule", classe: "3ème", enseignant: "M. TOURÉ", modules: 5, duree: "3h45", completion: 40, etudiants: 52, statut: "En cours" },
  { id: 4, titre: "Français - Le Roman", classe: "2nde A", enseignant: "Mme SANOGO", modules: 10, duree: "8h15", completion: 60, etudiants: 48, statut: "En cours" },
  { id: 5, titre: "Anglais - Grammar Advanced", classe: "1ère A", enseignant: "M. JOHNSON", modules: 7, duree: "5h30", completion: 85, etudiants: 41, statut: "En cours" },
];

const resources = [
  { id: 1, titre: "Cours complet - Dérivées", type: "PDF", taille: "2.4 MB", telechargements: 156, date: "12 Déc 2024" },
  { id: 2, titre: "Vidéo - Expérience loi d'Ohm", type: "Vidéo", taille: "45 MB", telechargements: 89, date: "10 Déc 2024" },
  { id: 3, titre: "Exercices - La Cellule", type: "PDF", taille: "1.8 MB", telechargements: 124, date: "08 Déc 2024" },
  { id: 4, titre: "QCM - Analyse grammaticale", type: "QCM", taille: "0.5 MB", telechargements: 203, date: "05 Déc 2024" },
];

const devoirs = [
  { id: 1, titre: "Devoir Maison - Dérivées", classe: "1ère C", dateRemise: "20 Déc 2024", soumis: 32, total: 45, statut: "En cours" },
  { id: 2, titre: "TP - Circuit électrique", classe: "Tle D", dateRemise: "15 Déc 2024", soumis: 38, total: 38, statut: "Complété" },
  { id: 3, titre: "Dissertation - Le Roman", classe: "2nde A", dateRemise: "22 Déc 2024", soumis: 12, total: 48, statut: "En cours" },
  { id: 4, titre: "QCM - Grammar Test", classe: "1ère A", dateRemise: "18 Déc 2024", soumis: 41, total: 41, statut: "Complété" },
];

export default function Elearning() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">E-Learning</h1>
          <p className="text-muted-foreground">Plateforme de cours en ligne et ressources pédagogiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importer Ressources
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Cours
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ressources</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">PDF, Vidéos, QCM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">524</div>
            <p className="text-xs text-green-600">+12% engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Complétion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Cours en Ligne</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
          <TabsTrigger value="devoirs">Devoirs</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher un cours..." className="pl-10" />
            </div>
            <Button variant="outline">Filtrer</Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cours</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.titre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.classe}</Badge>
                    </TableCell>
                    <TableCell>{course.enseignant}</TableCell>
                    <TableCell>{course.modules} modules</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duree}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{course.completion}%</span>
                        </div>
                        <Progress value={course.completion} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.etudiants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.statut === "Terminé" ? "default" : "secondary"}>
                        {course.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher une ressource..." className="pl-10" />
            </div>
            <Button variant="outline">Filtrer par Type</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {resource.type === "Vidéo" ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : resource.type === "QCM" ? (
                        <FileText className="h-5 w-5 text-accent" />
                      ) : (
                        <FileText className="h-5 w-5 text-chart-2" />
                      )}
                      <div>
                        <CardTitle className="text-base">{resource.titre}</CardTitle>
                        <CardDescription className="mt-1">
                          {resource.type} • {resource.taille}
                        </CardDescription>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {resource.telechargements}
                      </div>
                      <span>{resource.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devoirs" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Devoir</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Date de Remise</TableHead>
                  <TableHead>Soumissions</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devoirs.map((devoir) => (
                  <TableRow key={devoir.id}>
                    <TableCell className="font-medium">{devoir.titre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{devoir.classe}</Badge>
                    </TableCell>
                    <TableCell>{devoir.dateRemise}</TableCell>
                    <TableCell>
                      {devoir.soumis}/{devoir.total}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{Math.round((devoir.soumis / devoir.total) * 100)}%</span>
                        </div>
                        <Progress value={(devoir.soumis / devoir.total) * 100} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={devoir.statut === "Complété" ? "default" : "secondary"}>
                        {devoir.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          Voir Soumissions
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
