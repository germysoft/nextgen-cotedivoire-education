import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Download, Search, Calendar, TrendingUp, DollarSign, 
  Eye, Edit, Phone, Mail, Filter, Building2, FileText
} from "lucide-react";
import { AddPersonnelDialog } from "@/components/hr/AddPersonnelDialog";
import { PersonnelProfile } from "@/components/hr/PersonnelProfile";
import { PayslipGenerator } from "@/components/hr/PayslipGenerator";
import { mockPersonnel } from "@/data/mockPersonnel";
import { Personnel, categoriesPersonnel, statutsPersonnel, departements } from "@/types/personnel";

export default function HR() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterDepartement, setFilterDepartement] = useState<string>("all");
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();
  };

  const filteredPersonnel = mockPersonnel.filter(p => {
    const matchSearch = `${p.nom} ${p.prenom} ${p.matricule} ${p.poste}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = filterCategorie === "all" || p.categoriePersonnel === filterCategorie;
    const matchStatut = filterStatut === "all" || p.statut === filterStatut;
    const matchDept = filterDepartement === "all" || p.departement === filterDepartement;
    return matchSearch && matchCategorie && matchStatut && matchDept && p.actif;
  });

  const stats = {
    total: mockPersonnel.filter(p => p.actif).length,
    permanents: mockPersonnel.filter(p => p.statut === "Permanent" && p.actif).length,
    enseignants: mockPersonnel.filter(p => p.categoriePersonnel === "Enseignant" && p.actif).length,
    masseSalariale: mockPersonnel.filter(p => p.actif).reduce((acc, p) => acc + p.salaireBase, 0),
  };

  const openProfile = (personnel: Personnel) => {
    setSelectedPersonnel(personnel);
    setProfileOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ressources Humaines</h1>
          <p className="text-muted-foreground">Gestion complète du personnel de l'établissement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <AddPersonnelDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.permanents} permanents, {stats.enseignants} enseignants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Masse Salariale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.masseSalariale / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA / mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.4%</div>
            <p className="text-xs text-muted-foreground">Moyenne mensuelle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Congés en cours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Demandes actives</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Liste du Personnel ({filteredPersonnel.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-8 w-48" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categoriesPersonnel.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  {statutsPersonnel.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Département" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous départements</SelectItem>
                  {departements.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personnel</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Salaire</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonnel.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={p.photo} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(p.nom, p.prenom)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{p.civilite} {p.prenom} {p.nom}</div>
                        <div className="text-sm text-muted-foreground font-mono">{p.matricule}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{p.poste}</TableCell>
                  <TableCell><Badge variant="outline" className="gap-1"><Building2 className="h-3 w-3" />{p.departement}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{p.telephone}</div>
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" /><span className="text-muted-foreground truncate max-w-32">{p.email}</span></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={p.statut === "Permanent" ? "default" : "secondary"}>{p.statut}</Badge></TableCell>
                  <TableCell className="font-semibold">{p.salaireBase.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <PayslipGenerator personnel={p} />
                      <Button variant="ghost" size="icon" onClick={() => openProfile(p)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPersonnel && (
        <PersonnelProfile personnel={selectedPersonnel} open={profileOpen} onClose={() => setProfileOpen(false)} />
      )}
    </div>
  );
}
