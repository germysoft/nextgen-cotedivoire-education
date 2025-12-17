import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  FileText, Download, Upload, Eye, Edit, CheckCircle2, Send, Printer,
  Calendar, Clock, BarChart3, TrendingUp, TrendingDown, Users, School,
  BookOpen, Award, AlertTriangle, FileCheck, ClipboardList, PieChart,
  ArrowUp, ArrowDown, Minus, Target, Flag, Building
} from "lucide-react";

interface Decision {
  id: string;
  reference: string;
  type: "passage" | "redoublement" | "exclusion" | "orientation" | "transfert";
  eleve: string;
  matricule: string;
  classe: string;
  decision: string;
  dateDecision: string;
  justification: string;
  statut: "projet" | "approuvee" | "transmise" | "appliquee";
  transmiseMENA: boolean;
}

interface BilanAnnuel {
  id: string;
  anneeScolaire: string;
  type: "trimestriel" | "semestriel" | "annuel";
  periode: string;
  effectifTotal: number;
  tauxReussite: number;
  moyenneGenerale: number;
  statut: "en_cours" | "valide" | "transmis";
  dateTransmission?: string;
}

interface StatistiquesMENA {
  effectifGarcons: number;
  effectifFilles: number;
  tauxAbsenteisme: number;
  tauxReussite: number;
  moyenneEtablissement: number;
  classementRegional?: number;
}

const mockDecisions: Decision[] = [
  { id: "1", reference: "DEC2024-001", type: "passage", eleve: "KOUASSI Aya", matricule: "CI2024001234", classe: "6ème A", decision: "Passage en 5ème", dateDecision: "2024-06-28", justification: "Résultats satisfaisants - Moyenne 14.5/20", statut: "transmise", transmiseMENA: true },
  { id: "2", reference: "DEC2024-002", type: "redoublement", eleve: "TRAORE Ibrahim", matricule: "CI2024001235", classe: "5ème B", decision: "Redoublement", dateDecision: "2024-06-28", justification: "Moyenne insuffisante - 8.2/20. Difficultés en mathématiques et français", statut: "approuvee", transmiseMENA: false },
  { id: "3", reference: "DEC2024-003", type: "orientation", eleve: "DIALLO Mamadou", matricule: "CI2023005678", classe: "3ème A", decision: "Orientation vers lycée technique", dateDecision: "2024-06-28", justification: "Aptitudes techniques confirmées. Recommandation filière industrielle", statut: "transmise", transmiseMENA: true },
  { id: "4", reference: "DEC2024-004", type: "exclusion", eleve: "YAO Koffi", matricule: "CI2024001240", classe: "4ème C", decision: "Exclusion définitive", dateDecision: "2024-05-15", justification: "Comportement répété incompatible avec la vie scolaire", statut: "appliquee", transmiseMENA: true },
  { id: "5", reference: "DEC2024-005", type: "transfert", eleve: "BAMBA Fatoumata", matricule: "CI2024001241", classe: "6ème B", decision: "Transfert vers Collège de Bouaké", dateDecision: "2024-04-10", justification: "Déménagement familial", statut: "appliquee", transmiseMENA: true },
];

const mockBilans: BilanAnnuel[] = [
  { id: "1", anneeScolaire: "2023-2024", type: "trimestriel", periode: "1er Trimestre", effectifTotal: 1245, tauxReussite: 72.5, moyenneGenerale: 11.8, statut: "transmis", dateTransmission: "2024-01-15" },
  { id: "2", anneeScolaire: "2023-2024", type: "trimestriel", periode: "2ème Trimestre", effectifTotal: 1238, tauxReussite: 68.3, moyenneGenerale: 11.2, statut: "transmis", dateTransmission: "2024-04-10" },
  { id: "3", anneeScolaire: "2023-2024", type: "trimestriel", periode: "3ème Trimestre", effectifTotal: 1230, tauxReussite: 75.1, moyenneGenerale: 12.1, statut: "valide" },
  { id: "4", anneeScolaire: "2023-2024", type: "annuel", periode: "Bilan Annuel", effectifTotal: 1230, tauxReussite: 71.9, moyenneGenerale: 11.7, statut: "en_cours" },
];

const mockStats: StatistiquesMENA = {
  effectifGarcons: 645,
  effectifFilles: 585,
  tauxAbsenteisme: 4.2,
  tauxReussite: 71.9,
  moyenneEtablissement: 11.7,
  classementRegional: 12
};

export default function DecisionsBilans() {
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions);
  const [bilans, setBilans] = useState<BilanAnnuel[]>(mockBilans);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showNewDecisionDialog, setShowNewDecisionDialog] = useState(false);
  const [showBilanDetailDialog, setShowBilanDetailDialog] = useState(false);
  const [selectedBilan, setSelectedBilan] = useState<BilanAnnuel | null>(null);

  const getTypeBadge = (type: string) => {
    const styles: Record<string, { color: string; label: string }> = {
      passage: { color: "bg-green-100 text-green-800", label: "Passage" },
      redoublement: { color: "bg-orange-100 text-orange-800", label: "Redoublement" },
      exclusion: { color: "bg-red-100 text-red-800", label: "Exclusion" },
      orientation: { color: "bg-blue-100 text-blue-800", label: "Orientation" },
      transfert: { color: "bg-purple-100 text-purple-800", label: "Transfert" }
    };
    const style = styles[type] || styles.passage;
    return <Badge className={style.color}>{style.label}</Badge>;
  };

  const getStatusBadge = (statut: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      projet: { variant: "outline", label: "Projet" },
      approuvee: { variant: "secondary", label: "Approuvée" },
      transmise: { variant: "default", label: "Transmise" },
      appliquee: { variant: "default", label: "Appliquée" }
    };
    const style = styles[statut] || styles.projet;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getBilanStatusBadge = (statut: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      en_cours: { variant: "outline", label: "En cours" },
      valide: { variant: "secondary", label: "Validé" },
      transmis: { variant: "default", label: "Transmis au MENA" }
    };
    const style = styles[statut] || styles.en_cours;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = 
      d.eleve.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const transmitToMENA = (decisionId: string) => {
    setDecisions(decisions.map(d => 
      d.id === decisionId ? { ...d, statut: "transmise", transmiseMENA: true } : d
    ));
    toast.success("Décision transmise au MENA");
  };

  const transmitBilan = (bilanId: string) => {
    setBilans(bilans.map(b => 
      b.id === bilanId ? { ...b, statut: "transmis", dateTransmission: new Date().toISOString().split('T')[0] } : b
    ));
    toast.success("Bilan transmis au MENA");
  };

  const viewBilanDetail = (bilan: BilanAnnuel) => {
    setSelectedBilan(bilan);
    setShowBilanDetailDialog(true);
  };

  const stats = {
    totalDecisions: decisions.length,
    passages: decisions.filter(d => d.type === "passage").length,
    redoublements: decisions.filter(d => d.type === "redoublement").length,
    transmises: decisions.filter(d => d.transmiseMENA).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Décisions & Bilans MENA</h1>
          <p className="text-muted-foreground">Gestion des décisions de conseil et bilans périodiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={showNewDecisionDialog} onOpenChange={setShowNewDecisionDialog}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Nouvelle décision
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enregistrer une décision</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de décision</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passage">Passage</SelectItem>
                      <SelectItem value="redoublement">Redoublement</SelectItem>
                      <SelectItem value="orientation">Orientation</SelectItem>
                      <SelectItem value="exclusion">Exclusion</SelectItem>
                      <SelectItem value="transfert">Transfert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date de décision</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Élève</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Rechercher un élève..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">KOUASSI Aya - 6ème A</SelectItem>
                      <SelectItem value="2">TRAORE Ibrahim - 5ème B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Classe actuelle</Label>
                  <Input placeholder="Classe" disabled />
                </div>
                <div className="col-span-2">
                  <Label>Décision</Label>
                  <Input placeholder="Décision prise (ex: Passage en 5ème)" />
                </div>
                <div className="col-span-2">
                  <Label>Justification</Label>
                  <Textarea placeholder="Motifs et justification de la décision..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewDecisionDialog(false)}>Annuler</Button>
                <Button onClick={() => { setShowNewDecisionDialog(false); toast.success("Décision enregistrée"); }}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.effectifGarcons + mockStats.effectifFilles}</p>
                <p className="text-xs text-muted-foreground">Effectif total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.tauxReussite}%</p>
                <p className="text-xs text-muted-foreground">Taux de réussite</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.moyenneEtablissement}/20</p>
                <p className="text-xs text-muted-foreground">Moyenne générale</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.tauxAbsenteisme}%</p>
                <p className="text-xs text-muted-foreground">Absentéisme</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">#{mockStats.classementRegional}</p>
                <p className="text-xs text-muted-foreground">Rang régional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="decisions">
        <TabsList>
          <TabsTrigger value="decisions">Décisions de conseil</TabsTrigger>
          <TabsTrigger value="bilans">Bilans périodiques</TabsTrigger>
          <TabsTrigger value="indicateurs">Indicateurs MENA</TabsTrigger>
        </TabsList>

        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Décisions du conseil de classe</CardTitle>
                  <CardDescription>Passages, redoublements, orientations et transferts</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      placeholder="Rechercher..."
                      className="w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="passage">Passages</SelectItem>
                      <SelectItem value="redoublement">Redoublements</SelectItem>
                      <SelectItem value="orientation">Orientations</SelectItem>
                      <SelectItem value="exclusion">Exclusions</SelectItem>
                      <SelectItem value="transfert">Transferts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Décision</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>MENA</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDecisions.map(decision => (
                    <TableRow key={decision.id}>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{decision.reference}</code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{decision.eleve}</p>
                          <p className="text-xs text-muted-foreground">{decision.matricule}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{decision.classe}</Badge></TableCell>
                      <TableCell>{getTypeBadge(decision.type)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{decision.decision}</TableCell>
                      <TableCell>{decision.dateDecision}</TableCell>
                      <TableCell>{getStatusBadge(decision.statut)}</TableCell>
                      <TableCell>
                        {decision.transmiseMENA ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!decision.transmiseMENA && decision.statut === "approuvee" && (
                            <Button variant="ghost" size="icon" onClick={() => transmitToMENA(decision.id)}>
                              <Send className="h-4 w-4 text-primary" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4" />
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

        <TabsContent value="bilans">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bilans périodiques</CardTitle>
                  <CardDescription>Rapports trimestriels, semestriels et annuels</CardDescription>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Générer bilan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bilans.map(bilan => (
                  <Card key={bilan.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <ClipboardList className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{bilan.periode}</h3>
                              <Badge variant="secondary">{bilan.anneeScolaire}</Badge>
                              {getBilanStatusBadge(bilan.statut)}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {bilan.effectifTotal} élèves
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {bilan.tauxReussite}% réussite
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {bilan.moyenneGenerale}/20 moyenne
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {bilan.dateTransmission && (
                            <span className="text-xs text-muted-foreground">
                              Transmis le {bilan.dateTransmission}
                            </span>
                          )}
                          <Button variant="outline" size="sm" onClick={() => viewBilanDetail(bilan)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                          {bilan.statut === "valide" && (
                            <Button size="sm" onClick={() => transmitBilan(bilan.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Transmettre
                            </Button>
                          )}
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600 font-medium">Taux de réussite</p>
                            <p className="text-xl font-bold text-green-700">{bilan.tauxReussite}%</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium">Moyenne générale</p>
                            <p className="text-xl font-bold text-blue-700">{bilan.moyenneGenerale}/20</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-purple-600 font-medium">Effectif</p>
                            <p className="text-xl font-bold text-purple-700">{bilan.effectifTotal}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicateurs">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Indicateurs de performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Taux de réussite", value: mockStats.tauxReussite, target: 75, unit: "%", trend: "up" },
                  { label: "Taux d'absentéisme", value: mockStats.tauxAbsenteisme, target: 3, unit: "%", trend: "down" },
                  { label: "Moyenne établissement", value: mockStats.moyenneEtablissement, target: 12, unit: "/20", trend: "up" },
                  { label: "Ratio filles/total", value: Math.round((mockStats.effectifFilles / (mockStats.effectifGarcons + mockStats.effectifFilles)) * 100), target: 50, unit: "%", trend: "neutral" }
                ].map((indicator, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{indicator.label}</span>
                        {indicator.trend === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                        {indicator.trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                        {indicator.trend === "neutral" && <Minus className="h-4 w-4 text-gray-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{indicator.value}{indicator.unit}</span>
                        <span className="text-xs text-muted-foreground">/ {indicator.target}{indicator.unit}</span>
                      </div>
                    </div>
                    <Progress value={(indicator.value / indicator.target) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des effectifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium">Garçons</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-700">{mockStats.effectifGarcons}</p>
                      <p className="text-xs text-blue-600">
                        {Math.round((mockStats.effectifGarcons / (mockStats.effectifGarcons + mockStats.effectifFilles)) * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-pink-100">
                        <Users className="h-5 w-5 text-pink-600" />
                      </div>
                      <span className="font-medium">Filles</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-pink-700">{mockStats.effectifFilles}</p>
                      <p className="text-xs text-pink-600">
                        {Math.round((mockStats.effectifFilles / (mockStats.effectifGarcons + mockStats.effectifFilles)) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-primary" />
                      <span className="font-medium">Classement régional</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-lg px-3 py-1">
                        #{mockStats.classementRegional}
                      </Badge>
                      <span className="text-sm text-muted-foreground">sur 45 établissements</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Évolution des résultats par trimestre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {bilans.filter(b => b.type === "trimestriel").map((bilan, index) => (
                    <Card key={bilan.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-4">{bilan.periode}</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Taux réussite</span>
                            <span className="font-bold">{bilan.tauxReussite}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Moyenne</span>
                            <span className="font-bold">{bilan.moyenneGenerale}/20</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Effectif</span>
                            <span className="font-bold">{bilan.effectifTotal}</span>
                          </div>
                        </div>
                        {index > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm">
                              {bilan.tauxReussite > bilans[index - 1].tauxReussite ? (
                                <>
                                  <ArrowUp className="h-4 w-4 text-green-500" />
                                  <span className="text-green-600">
                                    +{(bilan.tauxReussite - bilans[index - 1].tauxReussite).toFixed(1)}%
                                  </span>
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="h-4 w-4 text-red-500" />
                                  <span className="text-red-600">
                                    {(bilan.tauxReussite - bilans[index - 1].tauxReussite).toFixed(1)}%
                                  </span>
                                </>
                              )}
                              <span className="text-muted-foreground">vs trimestre précédent</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bilan Detail Dialog */}
      <Dialog open={showBilanDetailDialog} onOpenChange={setShowBilanDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détail du bilan</DialogTitle>
          </DialogHeader>
          {selectedBilan && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{selectedBilan.effectifTotal}</p>
                    <p className="text-sm text-muted-foreground">Effectif total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold">{selectedBilan.tauxReussite}%</p>
                    <p className="text-sm text-muted-foreground">Taux de réussite</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">{selectedBilan.moyenneGenerale}/20</p>
                    <p className="text-sm text-muted-foreground">Moyenne générale</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Détails par niveau</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Effectif</TableHead>
                        <TableHead>Taux réussite</TableHead>
                        <TableHead>Moyenne</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { niveau: "6ème", effectif: 320, taux: 75.2, moyenne: 12.1 },
                        { niveau: "5ème", effectif: 310, taux: 71.5, moyenne: 11.8 },
                        { niveau: "4ème", effectif: 305, taux: 68.9, moyenne: 11.2 },
                        { niveau: "3ème", effectif: 295, taux: 72.1, moyenne: 11.9 }
                      ].map(row => (
                        <TableRow key={row.niveau}>
                          <TableCell className="font-medium">{row.niveau}</TableCell>
                          <TableCell>{row.effectif}</TableCell>
                          <TableCell>
                            <Badge variant={row.taux >= 70 ? "default" : "secondary"}>
                              {row.taux}%
                            </Badge>
                          </TableCell>
                          <TableCell>{row.moyenne}/20</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBilanDetailDialog(false)}>Fermer</Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
            {selectedBilan?.statut === "valide" && (
              <Button onClick={() => { transmitBilan(selectedBilan.id); setShowBilanDetailDialog(false); }}>
                <Send className="h-4 w-4 mr-2" />
                Transmettre au MENA
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
