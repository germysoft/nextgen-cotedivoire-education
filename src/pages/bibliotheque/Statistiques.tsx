import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, TrendingUp, BookOpen, Users, Calendar, Download,
  Clock, Award, Library, PieChart
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { mockBooks, mockBorrowings, mockReaderCards } from "@/data/mockLibrary";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Statistiques() {
  // Données pour les graphiques
  const borrowingsPerMonth = [
    { month: 'Sep', emprunts: 145, retours: 138 },
    { month: 'Oct', emprunts: 178, retours: 165 },
    { month: 'Nov', emprunts: 156, retours: 148 },
    { month: 'Déc', emprunts: 89, retours: 95 },
  ];

  const categoryDistribution = [
    { name: 'Manuels', value: 35, count: 380 },
    { name: 'Romans', value: 28, count: 120 },
    { name: 'Références', value: 15, count: 45 },
    { name: 'Sciences', value: 12, count: 80 },
    { name: 'Autres', value: 10, count: 90 },
  ];

  const topBorrowers = [
    { name: "3ème A", count: 45, trend: "+12%" },
    { name: "1ère A", count: 38, trend: "+5%" },
    { name: "2nde C", count: 32, trend: "+8%" },
    { name: "Tle D", count: 28, trend: "-3%" },
    { name: "6ème B", count: 25, trend: "+15%" },
  ];

  const topBooks = [
    { title: "L'Enfant Noir", author: "Camara Laye", count: 28 },
    { title: "Une Vie de Boy", author: "Ferdinand Oyono", count: 24 },
    { title: "Le Père Goriot", author: "Balzac", count: 18 },
    { title: "Mathématiques 3ème", author: "CEDA", count: 15 },
    { title: "Dictionnaire Larousse", author: "Larousse", count: 12 },
  ];

  const weeklyActivity = [
    { jour: 'Lun', visites: 45, emprunts: 12 },
    { jour: 'Mar', visites: 52, emprunts: 15 },
    { jour: 'Mer', visites: 38, emprunts: 8 },
    { jour: 'Jeu', visites: 48, emprunts: 14 },
    { jour: 'Ven', visites: 35, emprunts: 10 },
  ];

  const totalBooks = mockBooks.reduce((sum, b) => sum + b.quantity, 0);
  const totalBorrowed = mockBooks.reduce((sum, b) => sum + (b.quantity - b.available), 0);
  const activeReaders = mockReaderCards.filter(r => r.status === 'Active').length;
  const avgBorrowDuration = 12; // jours en moyenne

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques Bibliothèque</h1>
          <p className="text-muted-foreground">Analyse de l'activité et des tendances</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="trimester">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Emprunt</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalBorrowed / totalBooks) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-green-600">+2.5% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgBorrowDuration} jours</div>
            <p className="text-xs text-muted-foreground">Durée d'emprunt moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lecteurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReaders}</div>
            <p className="text-xs text-muted-foreground">Avec carte valide</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Retour à temps</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-green-600">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Emprunts & Retours par Mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={borrowingsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="emprunts" fill="#3b82f6" name="Emprunts" />
                <Bar dataKey="retours" fill="#10b981" name="Retours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition par Catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activité hebdomadaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activité Hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visites" stroke="#3b82f6" name="Visites" strokeWidth={2} />
              <Line type="monotone" dataKey="emprunts" stroke="#10b981" name="Emprunts" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Classements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Livres les Plus Empruntés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-muted-foreground">{book.author}</div>
                  </div>
                  <Badge variant="secondary">{book.count} emprunts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Classes les Plus Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBorrowers.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.count} emprunts</div>
                  </div>
                  <Badge variant={item.trend.startsWith('+') ? 'default' : 'secondary'} 
                         className={item.trend.startsWith('+') ? 'bg-green-500' : ''}>
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicateurs supplémentaires */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Nouveaux Lecteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+23</div>
            <p className="text-sm text-muted-foreground">Ce mois-ci</p>
            <div className="mt-2 h-2 bg-muted rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">75% de l'objectif mensuel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taux de Rotation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.2x</div>
            <p className="text-sm text-muted-foreground">Rotation annuelle moyenne</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>Romans: <span className="font-bold">4.5x</span></div>
              <div>Manuels: <span className="font-bold">2.1x</span></div>
              <div>Références: <span className="font-bold">1.8x</span></div>
              <div>Sciences: <span className="font-bold">2.9x</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.6/5</div>
            <p className="text-sm text-muted-foreground">Note moyenne des lecteurs</p>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div 
                  key={star} 
                  className={`h-4 w-4 rounded ${star <= 4 ? 'bg-yellow-400' : 'bg-muted'}`} 
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Basé sur 156 évaluations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
