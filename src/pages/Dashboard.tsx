import { StatCard } from "@/components/dashboard/StatCard";
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const enrollmentData = [
  { name: "6ème", students: 120 },
  { name: "5ème", students: 115 },
  { name: "4ème", students: 108 },
  { name: "3ème", students: 98 },
  { name: "2nde", students: 95 },
  { name: "1ère", students: 88 },
  { name: "Tle", students: 76 },
];

const performanceData = [
  { month: "Sept", moyenne: 12.5 },
  { month: "Oct", moyenne: 13.2 },
  { month: "Nov", moyenne: 13.8 },
  { month: "Déc", moyenne: 14.1 },
  { month: "Jan", moyenne: 13.9 },
];

const recentActivities = [
  { id: 1, type: "Inscription", description: "Nouveau élève: KOUASSI Jean", time: "Il y a 2h" },
  { id: 2, type: "Paiement", description: "Frais de scolarité - Classe 6ème A", time: "Il y a 3h" },
  { id: 3, type: "Note", description: "Notes saisies pour 1ère C - Mathématiques", time: "Il y a 5h" },
  { id: 4, type: "Réunion", description: "Conseil de classe 3ème B programmé", time: "Hier" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de l'établissement</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Élèves"
          value="700"
          change="+12% ce mois"
          changeType="positive"
          icon={Users}
          iconColor="bg-primary"
        />
        <StatCard
          title="Enseignants"
          value="45"
          change="3 nouveaux"
          changeType="positive"
          icon={GraduationCap}
          iconColor="bg-accent"
        />
        <StatCard
          title="Classes"
          value="28"
          icon={BookOpen}
          iconColor="bg-success"
        />
        <StatCard
          title="Taux de Présence"
          value="94.5%"
          change="+2.1%"
          changeType="positive"
          icon={UserCheck}
          iconColor="bg-warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Effectif par Niveau</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution des Moyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis domain={[0, 20]} className="text-xs" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="moyenne" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Nouvelle Inscription
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Saisir des Notes
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Enregistrer Paiement
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <GraduationCap className="mr-2 h-4 w-4" />
              Ajouter Enseignant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
