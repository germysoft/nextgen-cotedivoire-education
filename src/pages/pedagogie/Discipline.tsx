import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Plus, User, Calendar, FileText, CheckCircle, Clock, TrendingDown, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

interface Incident {
  id: number;
  eleve: string;
  classe: string;
  type: string;
  date: string;
  gravite: "Légère" | "Modérée" | "Grave";
  sanction: string;
  statut: "En cours" | "Traité";
  rapporteur: string;
  notifieParents: boolean;
}

interface ConduiteNote {
  id: number;
  eleve: string;
  classe: string;
  incidents: number;
  note: number;
  appreciation: string;
  tendance: "up" | "down" | "stable";
}

const initialIncidents: Incident[] = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", type: "Retard", date: "15 Déc 2024", gravite: "Légère", sanction: "Avertissement", statut: "Traité", rapporteur: "M. KOFFI", notifieParents: false },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", type: "Absence injustifiée", date: "14 Déc 2024", gravite: "Modérée", sanction: "Convocation parents", statut: "En cours", rapporteur: "Mme DIALLO", notifieParents: true },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", type: "Insolence", date: "13 Déc 2024", gravite: "Grave", sanction: "Exclusion 2 jours", statut: "Traité", rapporteur: "M. TOURÉ", notifieParents: true },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", type: "Oubli matériel", date: "13 Déc 2024", gravite: "Légère", sanction: "Observation", statut: "Traité", rapporteur: "M. KONE", notifieParents: false },
  { id: 5, eleve: "BAMBA Yao", classe: "Tle D", type: "Bagarre", date: "12 Déc 2024", gravite: "Grave", sanction: "Exclusion 5 jours", statut: "Traité", rapporteur: "M. YAO", notifieParents: true },
  { id: 6, eleve: "KONE Sarah", classe: "1ère C", type: "Tricherie", date: "11 Déc 2024", gravite: "Grave", sanction: "Zéro + Avertissement", statut: "Traité", rapporteur: "Mme BAMBA", notifieParents: true },
];

const sanctions = [
  { type: "Avertissement", count: 45, color: "#f59e0b" },
  { type: "Retenue", count: 18, color: "#f97316" },
  { type: "Convocation parents", count: 12, color: "#ef4444" },
  { type: "Exclusion temporaire", count: 3, color: "#dc2626" },
];

const initialConduites: ConduiteNote[] = [
  { id: 1, eleve: "KOUASSI Jean", classe: "Tle D", incidents: 2, note: 16, appreciation: "Bon comportement", tendance: "stable" },
  { id: 2, eleve: "DIALLO Fatoumata", classe: "1ère A", incidents: 4, note: 12, appreciation: "Peut mieux faire", tendance: "down" },
  { id: 3, eleve: "TOURÉ Mohamed", classe: "2nde B", incidents: 6, note: 8, appreciation: "Comportement à améliorer", tendance: "down" },
  { id: 4, eleve: "SANOGO Aminata", classe: "3ème C", incidents: 1, note: 18, appreciation: "Excellente conduite", tendance: "up" },
  { id: 5, eleve: "BAMBA Yao", classe: "Tle D", incidents: 3, note: 10, appreciation: "Conduite acceptable", tendance: "stable" },
];

const incidentTypes = [
  { name: "Retards", value: 35, color: "#3b82f6" },
  { name: "Absences", value: 25, color: "#10b981" },
  { name: "Insolence", value: 15, color: "#f59e0b" },
  { name: "Bagarre", value: 8, color: "#ef4444" },
  { name: "Tricherie", value: 12, color: "#8b5cf6" },
  { name: "Autres", value: 5, color: "#6b7280" },
];

const evolutionData = [
  { month: "Sept", incidents: 25, noteConduite: 15.2 },
  { month: "Oct", incidents: 32, noteConduite: 14.8 },
  { month: "Nov", incidents: 28, noteConduite: 15.1 },
  { month: "Déc", incidents: 22, noteConduite: 15.5 },
];

export default function Discipline() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [conduites, setConduites] = useState<ConduiteNote[]>(initialConduites);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [incidentForm, setIncidentForm] = useState({
    eleve: "", classe: "", type: "", gravite: "", sanction: "", rapporteur: "", notifieParents: false
  });

  // Calculate conduct note based on incidents
  const calculateConduiteNote = (incidentCount: number, gravites: string[]): number => {
    let note = 20;
    gravites.forEach(g => {
      if (g === "Légère") note -= 1;
      else if (g === "Modérée") note -= 2;
      else if (g === "Grave") note -= 4;
    });
    return Math.max(0, note);
  };

  const handleCreateIncident = () => {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const newIncident: Incident = {
      id: Math.max(...incidents.map(i => i.id)) + 1,
      eleve: incidentForm.eleve,
      classe: incidentForm.classe,
      type: incidentForm.type,
      date: today,
      gravite: incidentForm.gravite as Incident["gravite"],
      sanction: incidentForm.sanction,
      statut: "En cours",
      rapporteur: incidentForm.rapporteur,
      notifieParents: incidentForm.notifieParents,
    };
    
    setIncidents(prev => [...prev, newIncident]);
    
    // Update or create conduite note for this student
    const existingConduite = conduites.find(c => c.eleve === incidentForm.eleve);
    if (existingConduite) {
      const studentIncidents = incidents.filter(i => i.eleve === incidentForm.eleve);
      const gravites = [...studentIncidents.map(i => i.gravite), incidentForm.gravite];
      const newNote = calculateConduiteNote(studentIncidents.length + 1, gravites);
      
      setConduites(prev => prev.map(c => 
        c.eleve === incidentForm.eleve ? {
          ...c,
          incidents: c.incidents + 1,
          note: newNote,
          tendance: newNote < c.note ? "down" : "stable",
          appreciation: newNote >= 16 ? "Bon comportement" : 
                       newNote >= 12 ? "Peut mieux faire" : 
                       newNote >= 10 ? "Conduite acceptable" : "Comportement à améliorer"
        } : c
      ));
    }
    
    toast({ 
      title: "Incident signalé", 
      description: `L'incident pour ${incidentForm.eleve} a été enregistré${incidentForm.notifieParents ? " et les parents ont été notifiés" : ""}` 
    });
    
    setIsDialogOpen(false);
    setIncidentForm({ eleve: "", classe: "", type: "", gravite: "", sanction: "", rapporteur: "", notifieParents: false });
  };

  const handleUpdateStatus = (incidentId: number, newStatus: Incident["statut"]) => {
    setIncidents(prev => prev.map(i => 
      i.id === incidentId ? { ...i, statut: newStatus } : i
    ));
    toast({ title: "Statut mis à jour", description: `L'incident est maintenant "${newStatus}"` });
  };

  const handleNotifyParents = (incident: Incident) => {
    setIncidents(prev => prev.map(i => 
      i.id === incident.id ? { ...i, notifieParents: true } : i
    ));
    toast({ title: "Parents notifiés", description: `Les parents de ${incident.eleve} ont été informés par SMS` });
  };

  const totalIncidents = incidents.length;
  const treatedIncidents = incidents.filter(i => i.statut === "Traité").length;
  const pendingIncidents = incidents.filter(i => i.statut === "En cours").length;
  const graveIncidents = incidents.filter(i => i.gravite === "Grave").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discipline & Comportement</h1>
          <p className="text-muted-foreground">Gestion des incidents et sanctions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Signaler Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Signaler un Incident</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'élève</Label>
                  <Input 
                    placeholder="Ex: KOUASSI Jean"
                    value={incidentForm.eleve}
                    onChange={(e) => setIncidentForm({...incidentForm, eleve: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Classe</Label>
                  <Select onValueChange={(v) => setIncidentForm({...incidentForm, classe: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6ème A">6ème A</SelectItem>
                      <SelectItem value="5ème B">5ème B</SelectItem>
                      <SelectItem value="4ème C">4ème C</SelectItem>
                      <SelectItem value="3ème C">3ème C</SelectItem>
                      <SelectItem value="2nde B">2nde B</SelectItem>
                      <SelectItem value="1ère A">1ère A</SelectItem>
                      <SelectItem value="1ère C">1ère C</SelectItem>
                      <SelectItem value="Tle D">Tle D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type d'incident</Label>
                  <Select onValueChange={(v) => setIncidentForm({...incidentForm, type: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retard">Retard</SelectItem>
                      <SelectItem value="Absence injustifiée">Absence injustifiée</SelectItem>
                      <SelectItem value="Insolence">Insolence</SelectItem>
                      <SelectItem value="Bagarre">Bagarre</SelectItem>
                      <SelectItem value="Tricherie">Tricherie</SelectItem>
                      <SelectItem value="Oubli matériel">Oubli matériel</SelectItem>
                      <SelectItem value="Dégradation">Dégradation</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gravité</Label>
                  <Select onValueChange={(v) => setIncidentForm({...incidentForm, gravite: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Légère">Légère</SelectItem>
                      <SelectItem value="Modérée">Modérée</SelectItem>
                      <SelectItem value="Grave">Grave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sanction</Label>
                  <Select onValueChange={(v) => setIncidentForm({...incidentForm, sanction: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Observation">Observation</SelectItem>
                      <SelectItem value="Avertissement">Avertissement</SelectItem>
                      <SelectItem value="Retenue">Retenue</SelectItem>
                      <SelectItem value="Convocation parents">Convocation parents</SelectItem>
                      <SelectItem value="Exclusion 1 jour">Exclusion 1 jour</SelectItem>
                      <SelectItem value="Exclusion 2 jours">Exclusion 2 jours</SelectItem>
                      <SelectItem value="Exclusion 5 jours">Exclusion 5 jours</SelectItem>
                      <SelectItem value="Conseil de discipline">Conseil de discipline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rapporteur</Label>
                  <Select onValueChange={(v) => setIncidentForm({...incidentForm, rapporteur: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M. KOFFI">M. KOFFI</SelectItem>
                      <SelectItem value="Mme DIALLO">Mme DIALLO</SelectItem>
                      <SelectItem value="M. TOURÉ">M. TOURÉ</SelectItem>
                      <SelectItem value="M. KONE">M. KONE</SelectItem>
                      <SelectItem value="M. YAO">M. YAO</SelectItem>
                      <SelectItem value="Mme BAMBA">Mme BAMBA</SelectItem>
                      <SelectItem value="Surveillant">Surveillant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="notifieParents"
                  checked={incidentForm.notifieParents}
                  onChange={(e) => setIncidentForm({...incidentForm, notifieParents: e.target.checked})}
                />
                <Label htmlFor="notifieParents">Notifier les parents par SMS</Label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateIncident}>Signaler</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents ce Mois</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncidents}</div>
            <p className="text-xs text-muted-foreground">+5 vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traités</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{treatedIncidents}</div>
            <p className="text-xs text-muted-foreground">Résolus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingIncidents}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents Graves</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{graveIncidents}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
          <TabsTrigger value="conduites">Notes de Conduite</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incidents Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Sanction</TableHead>
                    <TableHead>Parents</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{inc.eleve}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inc.classe}</Badge>
                      </TableCell>
                      <TableCell>{inc.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {inc.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          inc.gravite === "Grave" ? "destructive" :
                          inc.gravite === "Modérée" ? "default" :
                          "secondary"
                        }>
                          {inc.gravite}
                        </Badge>
                      </TableCell>
                      <TableCell>{inc.sanction}</TableCell>
                      <TableCell>
                        {inc.notifieParents ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Notifiés
                          </Badge>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleNotifyParents(inc)}>
                            Notifier
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={inc.statut} 
                          onValueChange={(v) => handleUpdateStatus(inc.id, v as Incident["statut"])}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="En cours">En cours</SelectItem>
                            <SelectItem value="Traité">Traité</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sanctions">
          <div className="grid gap-6 md:grid-cols-2">
            {sanctions.map((s, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.type}
                    </CardTitle>
                    <Badge variant="default" className="text-lg px-3">
                      {s.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Appliquées ce trimestre
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conduites">
          <Card>
            <CardHeader>
              <CardTitle>Notes de Conduite</CardTitle>
              <CardDescription>Calculées automatiquement selon les incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Incidents</TableHead>
                    <TableHead>Note de Conduite</TableHead>
                    <TableHead>Tendance</TableHead>
                    <TableHead>Appréciation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conduites.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.eleve}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.classe}</Badge>
                      </TableCell>
                      <TableCell>
                        {c.incidents > 0 ? (
                          <Badge variant={c.incidents > 3 ? "destructive" : "secondary"}>{c.incidents}</Badge>
                        ) : (
                          <span className="text-green-600">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${
                          c.note >= 16 ? "text-green-600" :
                          c.note >= 12 ? "text-blue-600" :
                          c.note >= 10 ? "text-orange-600" :
                          "text-red-600"
                        }`}>
                          {c.note}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.tendance === "up" ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            En hausse
                          </div>
                        ) : c.tendance === "down" ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="h-4 w-4" />
                            En baisse
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Stable</span>
                        )}
                      </TableCell>
                      <TableCell>{c.appreciation}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type d'Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incidentTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {incidentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Sanctions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sanctions} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="type" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" name="Nombre">
                        {sanctions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 20]} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="incidents" name="Incidents" stroke="#ef4444" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="noteConduite" name="Note Conduite Moy." stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}