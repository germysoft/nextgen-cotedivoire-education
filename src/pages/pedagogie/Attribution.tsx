import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Users, BookOpen, Calendar, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface Attribution {
  id: number;
  enseignant: string;
  enseignantId: number;
  matiere: string;
  classe: string;
  heures: number;
  jour: string;
  horaire: string;
  statut: string;
  profPrincipal: boolean;
}

const initialAttributions: Attribution[] = [
  { id: 1, enseignant: "M. KOFFI Yao", enseignantId: 1, matiere: "Mathématiques", classe: "Tle D", heures: 8, jour: "Lundi", horaire: "08:00-10:00", statut: "Actif", profPrincipal: true },
  { id: 2, enseignant: "Mme DIALLO Fatoumata", enseignantId: 2, matiere: "Français", classe: "1ère A", heures: 6, jour: "Lundi", horaire: "10:00-12:00", statut: "Actif", profPrincipal: true },
  { id: 3, enseignant: "M. TOURÉ Mohamed", enseignantId: 3, matiere: "Physique-Chimie", classe: "Tle D", heures: 7, jour: "Mardi", horaire: "08:00-10:00", statut: "Actif", profPrincipal: false },
  { id: 4, enseignant: "M. TOURÉ Mohamed", enseignantId: 3, matiere: "Physique-Chimie", classe: "1ère C", heures: 6, jour: "Mardi", horaire: "10:00-12:00", statut: "Actif", profPrincipal: false },
  { id: 5, enseignant: "Mme SANOGO Aminata", enseignantId: 4, matiere: "Anglais", classe: "2nde B", heures: 5, jour: "Mercredi", horaire: "08:00-10:00", statut: "Actif", profPrincipal: false },
  { id: 6, enseignant: "M. KONE Ibrahim", enseignantId: 5, matiere: "SVT", classe: "3ème C", heures: 4, jour: "Jeudi", horaire: "08:00-10:00", statut: "Actif", profPrincipal: true },
  { id: 7, enseignant: "Mme BAMBA Sarah", enseignantId: 6, matiere: "Histoire-Géo", classe: "Tle A", heures: 4, jour: "Jeudi", horaire: "10:00-12:00", statut: "Actif", profPrincipal: false },
  { id: 8, enseignant: "M. YAO Jean", enseignantId: 7, matiere: "EPS", classe: "6ème B", heures: 3, jour: "Vendredi", horaire: "08:00-10:00", statut: "Actif", profPrincipal: false },
];

const enseignants = [
  { id: 1, nom: "M. KOFFI Yao", matieres: ["Mathématiques"], heuresMax: 18, heuresAffectees: 16, classes: 3 },
  { id: 2, nom: "Mme DIALLO Fatoumata", matieres: ["Français"], heuresMax: 18, heuresAffectees: 18, classes: 3 },
  { id: 3, nom: "M. TOURÉ Mohamed", matieres: ["Physique-Chimie"], heuresMax: 20, heuresAffectees: 19, classes: 4 },
  { id: 4, nom: "Mme SANOGO Aminata", matieres: ["Anglais"], heuresMax: 18, heuresAffectees: 15, classes: 3 },
  { id: 5, nom: "M. KONE Ibrahim", matieres: ["SVT"], heuresMax: 18, heuresAffectees: 12, classes: 2 },
  { id: 6, nom: "Mme BAMBA Sarah", matieres: ["Histoire-Géo"], heuresMax: 18, heuresAffectees: 14, classes: 3 },
  { id: 7, nom: "M. YAO Jean", matieres: ["EPS"], heuresMax: 20, heuresAffectees: 18, classes: 6 },
];

const workloadData = enseignants.map(e => ({
  name: e.nom.split(' ')[1],
  heures: e.heuresAffectees,
  max: e.heuresMax,
}));

const disciplineDistribution = [
  { name: "Sciences", value: 35, color: "#3b82f6" },
  { name: "Littérature", value: 25, color: "#10b981" },
  { name: "Langues", value: 20, color: "#f59e0b" },
  { name: "Sport & Arts", value: 12, color: "#ef4444" },
  { name: "Humanités", value: 8, color: "#8b5cf6" },
];

export default function Attribution() {
  const [attributions, setAttributions] = useState<Attribution[]>(initialAttributions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("tous");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttribution, setEditingAttribution] = useState<Attribution | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    enseignantId: "",
    matiere: "",
    classe: "",
    heures: "",
    jour: "",
    horaire: "",
    profPrincipal: false,
  });

  const checkConflicts = (newAttrib: Partial<Attribution>) => {
    const conflictsList: string[] = [];
    
    // Check time conflicts for the same teacher
    attributions.forEach(attr => {
      if (attr.enseignantId === Number(newAttrib.enseignantId) && 
          attr.jour === newAttrib.jour && 
          attr.horaire === newAttrib.horaire &&
          attr.id !== editingAttribution?.id) {
        conflictsList.push(`Conflit horaire: ${attr.enseignant} a déjà un cours ${attr.jour} à ${attr.horaire}`);
      }
    });

    // Check time conflicts for the same class
    attributions.forEach(attr => {
      if (attr.classe === newAttrib.classe && 
          attr.jour === newAttrib.jour && 
          attr.horaire === newAttrib.horaire &&
          attr.id !== editingAttribution?.id) {
        conflictsList.push(`Conflit classe: ${attr.classe} a déjà ${attr.matiere} ${attr.jour} à ${attr.horaire}`);
      }
    });

    // Check teacher workload
    const teacher = enseignants.find(e => e.id === Number(newAttrib.enseignantId));
    if (teacher) {
      const currentHours = attributions
        .filter(a => a.enseignantId === teacher.id && a.id !== editingAttribution?.id)
        .reduce((sum, a) => sum + a.heures, 0);
      
      if (currentHours + Number(newAttrib.heures || 0) > teacher.heuresMax) {
        conflictsList.push(`Surcharge: ${teacher.nom} dépasserait ses ${teacher.heuresMax}h max`);
      }
    }

    setConflicts(conflictsList);
    return conflictsList.length === 0;
  };

  const handleSaveAttribution = () => {
    const teacher = enseignants.find(e => e.id === Number(formData.enseignantId));
    
    if (!checkConflicts({
      ...formData,
      enseignantId: Number(formData.enseignantId),
      heures: Number(formData.heures),
    })) {
      toast({
        title: "Conflits détectés",
        description: "Veuillez résoudre les conflits avant de sauvegarder",
        variant: "destructive",
      });
      return;
    }

    if (editingAttribution) {
      setAttributions(prev => prev.map(a => 
        a.id === editingAttribution.id ? {
          ...a,
          enseignant: teacher?.nom || "",
          enseignantId: Number(formData.enseignantId),
          matiere: formData.matiere,
          classe: formData.classe,
          heures: Number(formData.heures),
          jour: formData.jour,
          horaire: formData.horaire,
          profPrincipal: formData.profPrincipal,
        } : a
      ));
      toast({ title: "Attribution modifiée", description: "Les modifications ont été enregistrées" });
    } else {
      const newAttribution: Attribution = {
        id: Math.max(...attributions.map(a => a.id)) + 1,
        enseignant: teacher?.nom || "",
        enseignantId: Number(formData.enseignantId),
        matiere: formData.matiere,
        classe: formData.classe,
        heures: Number(formData.heures),
        jour: formData.jour,
        horaire: formData.horaire,
        statut: "Actif",
        profPrincipal: formData.profPrincipal,
      };
      setAttributions(prev => [...prev, newAttribution]);
      toast({ title: "Attribution créée", description: "La nouvelle attribution a été ajoutée" });
    }

    setIsDialogOpen(false);
    setEditingAttribution(null);
    setFormData({ enseignantId: "", matiere: "", classe: "", heures: "", jour: "", horaire: "", profPrincipal: false });
    setConflicts([]);
  };

  const handleEdit = (attribution: Attribution) => {
    setEditingAttribution(attribution);
    setFormData({
      enseignantId: String(attribution.enseignantId),
      matiere: attribution.matiere,
      classe: attribution.classe,
      heures: String(attribution.heures),
      jour: attribution.jour,
      horaire: attribution.horaire,
      profPrincipal: attribution.profPrincipal,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAttributions(prev => prev.filter(a => a.id !== id));
    toast({ title: "Attribution supprimée", description: "L'attribution a été supprimée" });
  };

  const filteredAttributions = attributions.filter(attr => {
    const matchesSearch = attr.enseignant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attr.matiere.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attr.classe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterNiveau === "tous" || 
                         (filterNiveau === "tle" && attr.classe.startsWith("Tle")) ||
                         (filterNiveau === "1ere" && attr.classe.startsWith("1ère")) ||
                         (filterNiveau === "2nde" && attr.classe.startsWith("2nde"));
    return matchesSearch && matchesFilter;
  });

  const totalAttributions = attributions.length;
  const totalHeures = attributions.reduce((sum, a) => sum + a.heures, 0);
  const profsPrincipaux = attributions.filter(a => a.profPrincipal).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attribution des Enseignants</h1>
          <p className="text-muted-foreground">Affectation des professeurs aux matières et classes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAttribution(null);
            setFormData({ enseignantId: "", matiere: "", classe: "", heures: "", jour: "", horaire: "", profPrincipal: false });
            setConflicts([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Attribution
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAttribution ? "Modifier l'Attribution" : "Nouvelle Attribution"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {conflicts.length > 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg space-y-1">
                  {conflicts.map((conflict, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      {conflict}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Enseignant</Label>
                  <Select value={formData.enseignantId} onValueChange={(v) => setFormData({...formData, enseignantId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {enseignants.map(e => (
                        <SelectItem key={e.id} value={String(e.id)}>
                          {e.nom} ({e.heuresAffectees}/{e.heuresMax}h)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Matière</Label>
                  <Select value={formData.matiere} onValueChange={(v) => setFormData({...formData, matiere: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                      <SelectItem value="Français">Français</SelectItem>
                      <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                      <SelectItem value="SVT">SVT</SelectItem>
                      <SelectItem value="Anglais">Anglais</SelectItem>
                      <SelectItem value="Histoire-Géo">Histoire-Géo</SelectItem>
                      <SelectItem value="EPS">EPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Classe</Label>
                  <Select value={formData.classe} onValueChange={(v) => setFormData({...formData, classe: v})}>
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
                      <SelectItem value="Tle A">Tle A</SelectItem>
                      <SelectItem value="Tle D">Tle D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Heures/semaine</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 4" 
                    value={formData.heures}
                    onChange={(e) => setFormData({...formData, heures: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jour</Label>
                  <Select value={formData.jour} onValueChange={(v) => setFormData({...formData, jour: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lundi">Lundi</SelectItem>
                      <SelectItem value="Mardi">Mardi</SelectItem>
                      <SelectItem value="Mercredi">Mercredi</SelectItem>
                      <SelectItem value="Jeudi">Jeudi</SelectItem>
                      <SelectItem value="Vendredi">Vendredi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Horaire</Label>
                  <Select value={formData.horaire} onValueChange={(v) => setFormData({...formData, horaire: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00-10:00">08:00-10:00</SelectItem>
                      <SelectItem value="10:00-12:00">10:00-12:00</SelectItem>
                      <SelectItem value="14:00-16:00">14:00-16:00</SelectItem>
                      <SelectItem value="16:00-18:00">16:00-18:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="profPrincipal"
                  checked={formData.profPrincipal}
                  onChange={(e) => setFormData({...formData, profPrincipal: e.target.checked})}
                />
                <Label htmlFor="profPrincipal">Professeur Principal de cette classe</Label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSaveAttribution}>
                  {editingAttribution ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enseignants.length}</div>
            <p className="text-xs text-muted-foreground">Actifs cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attributions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttributions}</div>
            <p className="text-xs text-muted-foreground">Matière-Classe</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHeures}h</div>
            <p className="text-xs text-muted-foreground">Par semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profs Principaux</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profsPrincipaux}</div>
            <p className="text-xs text-muted-foreground">Classes attribuées</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attributions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="attributions">Attributions</TabsTrigger>
          <TabsTrigger value="workload">Charge Horaire</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="attributions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des Attributions</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterNiveau} onValueChange={setFilterNiveau}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="tle">Terminale</SelectItem>
                      <SelectItem value="1ere">Première</SelectItem>
                      <SelectItem value="2nde">Seconde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Jour</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Heures/sem</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttributions.map((attr) => (
                    <TableRow key={attr.id}>
                      <TableCell className="font-medium">{attr.enseignant}</TableCell>
                      <TableCell>{attr.matiere}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{attr.classe}</Badge>
                      </TableCell>
                      <TableCell>{attr.jour}</TableCell>
                      <TableCell>{attr.horaire}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {attr.heures}h
                        </div>
                      </TableCell>
                      <TableCell>
                        {attr.profPrincipal ? (
                          <Badge variant="default">Prof Principal</Badge>
                        ) : (
                          <Badge variant="secondary">Enseignant</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(attr)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(attr.id)}>
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="workload">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Charge Horaire par Enseignant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workloadData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 22]} />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip />
                      <Bar dataKey="heures" name="Heures affectées" fill="#3b82f6" />
                      <Bar dataKey="max" name="Maximum" fill="#e5e7eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détail par Enseignant</CardTitle>
                <CardDescription>Heures hebdomadaires affectées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enseignants.map((ens) => (
                    <div key={ens.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{ens.nom}</span>
                        <span className={`font-bold ${
                          ens.heuresAffectees >= ens.heuresMax ? "text-red-600" : 
                          ens.heuresAffectees >= ens.heuresMax * 0.9 ? "text-orange-600" : "text-green-600"
                        }`}>
                          {ens.heuresAffectees}/{ens.heuresMax}h
                        </span>
                      </div>
                      <Progress 
                        value={(ens.heuresAffectees / ens.heuresMax) * 100} 
                        className={`h-2 ${ens.heuresAffectees >= ens.heuresMax ? "[&>div]:bg-red-500" : ""}`}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{ens.matieres.join(", ")}</span>
                        <span>{ens.classes} classes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Discipline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={disciplineDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {disciplineDistribution.map((entry, index) => (
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
                <CardTitle>Résumé des Attributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taux d'affectation global</span>
                      <span className="text-2xl font-bold text-primary">97.3%</span>
                    </div>
                    <Progress value={97.3} className="mt-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Classes couvertes</p>
                      <p className="text-2xl font-bold">28/28</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Matières enseignées</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Enseignants actifs</p>
                      <p className="text-2xl font-bold">{enseignants.length}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Volume horaire</p>
                      <p className="text-2xl font-bold">{totalHeures}h/sem</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}