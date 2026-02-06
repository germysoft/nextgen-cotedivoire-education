import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Users, FileText, Plus, Eye, Download, CheckCircle, Clock, Edit, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Conseil {
  id: number;
  classe: string;
  date: string;
  heure: string;
  profPrincipal: string;
  participants: number;
  pvGenere: boolean;
  statut: "Planifié" | "En cours" | "Complété";
}

interface Deliberation {
  id: number;
  conseilId: number;
  eleve: string;
  moyenne: number;
  rang: number;
  decision: string;
  mention: string;
  absences: number;
  avertissements: number;
  observations: string;
}

const initialConseils: Conseil[] = [
  { id: 1, classe: "Tle D", date: "15 Déc 2024", heure: "14:00", profPrincipal: "M. KOFFI", participants: 12, pvGenere: true, statut: "Complété" },
  { id: 2, classe: "1ère A", date: "16 Déc 2024", heure: "15:00", profPrincipal: "Mme DIALLO", participants: 11, pvGenere: true, statut: "Complété" },
  { id: 3, classe: "2nde B", date: "18 Déc 2024", heure: "14:30", profPrincipal: "M. TOURÉ", participants: 0, pvGenere: false, statut: "Planifié" },
  { id: 4, classe: "3ème C", date: "19 Déc 2024", heure: "16:00", profPrincipal: "M. KONE", participants: 0, pvGenere: false, statut: "Planifié" },
  { id: 5, classe: "Tle A", date: "20 Déc 2024", heure: "14:00", profPrincipal: "Mme BAMBA", participants: 0, pvGenere: false, statut: "Planifié" },
  { id: 6, classe: "6ème B", date: "17 Déc 2024", heure: "15:30", profPrincipal: "M. YAO", participants: 9, pvGenere: false, statut: "En cours" },
];

const initialDeliberations: Deliberation[] = [
  { id: 1, conseilId: 1, eleve: "KOUASSI Jean", moyenne: 14.5, rang: 3, decision: "Admis", mention: "Bien", absences: 2, avertissements: 0, observations: "Excellent trimestre, encourage à poursuivre" },
  { id: 2, conseilId: 1, eleve: "DIALLO Fatoumata", moyenne: 16.2, rang: 1, decision: "Admis", mention: "Très Bien", absences: 0, avertissements: 0, observations: "Excellents résultats, félicitations" },
  { id: 3, conseilId: 1, eleve: "TOURÉ Mohamed", moyenne: 11.8, rang: 15, decision: "Admis", mention: "Assez Bien", absences: 4, avertissements: 1, observations: "Peut mieux faire en sciences" },
  { id: 4, conseilId: 1, eleve: "SANOGO Aminata", moyenne: 8.5, rang: 28, decision: "Ajourné", mention: "Insuffisant", absences: 8, avertissements: 2, observations: "Doit redoubler d'efforts" },
  { id: 5, conseilId: 1, eleve: "KOFFI Paul", moyenne: 15.8, rang: 2, decision: "Admis", mention: "Très Bien", absences: 1, avertissements: 0, observations: "Élève sérieux et travailleur" },
];

export default function Conseils() {
  const [conseils, setConseils] = useState<Conseil[]>(initialConseils);
  const [deliberations, setDeliberations] = useState<Deliberation[]>(initialDeliberations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDelibDialogOpen, setIsDelibDialogOpen] = useState(false);
  const [selectedConseil, setSelectedConseil] = useState<Conseil | null>(null);
  const [isPVPreviewOpen, setIsPVPreviewOpen] = useState(false);
  const [previewConseil, setPreviewConseil] = useState<Conseil | null>(null);

  const [conseilForm, setConseilForm] = useState({
    classe: "", date: "", heure: "", profPrincipal: ""
  });

  const [delibForm, setDelibForm] = useState({
    eleve: "", moyenne: "", rang: "", decision: "", mention: "", absences: "", avertissements: "", observations: ""
  });

  const handleCreateConseil = () => {
    const newConseil: Conseil = {
      id: Math.max(...conseils.map(c => c.id)) + 1,
      classe: conseilForm.classe,
      date: conseilForm.date,
      heure: conseilForm.heure,
      profPrincipal: conseilForm.profPrincipal,
      participants: 0,
      pvGenere: false,
      statut: "Planifié",
    };
    setConseils(prev => [...prev, newConseil]);
    toast({ title: "Conseil planifié", description: `Le conseil de classe ${conseilForm.classe} a été planifié` });
    setIsDialogOpen(false);
    setConseilForm({ classe: "", date: "", heure: "", profPrincipal: "" });
  };

  const handleAddDeliberation = () => {
    if (!selectedConseil) return;
    
    const newDelib: Deliberation = {
      id: Math.max(...deliberations.map(d => d.id), 0) + 1,
      conseilId: selectedConseil.id,
      eleve: delibForm.eleve,
      moyenne: Number(delibForm.moyenne),
      rang: Number(delibForm.rang),
      decision: delibForm.decision,
      mention: delibForm.mention,
      absences: Number(delibForm.absences),
      avertissements: Number(delibForm.avertissements),
      observations: delibForm.observations,
    };
    setDeliberations(prev => [...prev, newDelib]);
    toast({ title: "Délibération ajoutée", description: `Les résultats de ${delibForm.eleve} ont été enregistrés` });
    setIsDelibDialogOpen(false);
    setDelibForm({ eleve: "", moyenne: "", rang: "", decision: "", mention: "", absences: "", avertissements: "", observations: "" });
  };

  const handleUpdateStatus = (conseilId: number, newStatus: Conseil["statut"]) => {
    setConseils(prev => prev.map(c => 
      c.id === conseilId ? { ...c, statut: newStatus, participants: newStatus === "Complété" ? 12 : c.participants } : c
    ));
    toast({ title: "Statut mis à jour", description: `Le conseil est maintenant "${newStatus}"` });
  };

  const generatePV = (conseil: Conseil) => {
    const conseilDelibs = deliberations.filter(d => d.conseilId === conseil.id);
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("PROCÈS-VERBAL DU CONSEIL DE CLASSE", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Classe: ${conseil.classe}`, 20, 40);
    doc.text(`Date: ${conseil.date} à ${conseil.heure}`, 20, 48);
    doc.text(`Professeur Principal: ${conseil.profPrincipal}`, 20, 56);
    doc.text(`Participants: ${conseil.participants} enseignants`, 20, 64);
    
    doc.setFontSize(14);
    doc.text("RÉSULTATS DES DÉLIBÉRATIONS", 20, 80);
    
    // Table header
    doc.setFontSize(10);
    let yPos = 90;
    doc.text("Élève", 20, yPos);
    doc.text("Moyenne", 70, yPos);
    doc.text("Rang", 95, yPos);
    doc.text("Décision", 115, yPos);
    doc.text("Mention", 145, yPos);
    doc.text("Observations", 175, yPos);
    
    yPos += 8;
    doc.line(20, yPos - 3, 190, yPos - 3);
    
    conseilDelibs.forEach((delib) => {
      doc.text(delib.eleve, 20, yPos);
      doc.text(`${delib.moyenne}/20`, 70, yPos);
      doc.text(`${delib.rang}°`, 95, yPos);
      doc.text(delib.decision, 115, yPos);
      doc.text(delib.mention, 145, yPos);
      yPos += 7;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Signatures
    yPos += 20;
    doc.text("Le Professeur Principal", 30, yPos);
    doc.text("Le Directeur des Études", 120, yPos);
    yPos += 20;
    doc.text("_____________________", 25, yPos);
    doc.text("_____________________", 115, yPos);
    
    doc.save(`PV_${conseil.classe}_T1.pdf`);
    
    setConseils(prev => prev.map(c => 
      c.id === conseil.id ? { ...c, pvGenere: true } : c
    ));
    
    toast({ title: "PV généré", description: `Le procès-verbal de ${conseil.classe} a été téléchargé` });
  };

  const handleExportDecisions = () => {
    const conseilDelibs = deliberations.filter(d => d.conseilId === 1);
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("TABLEAU DES DÉCISIONS - CONSEIL DE CLASSE", 105, 15, { align: "center" });
    doc.setFontSize(11);
    doc.text("Classe: Tle D - Trimestre 1 - Année scolaire 2024-2025", 105, 24, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 34);

    autoTable(doc, {
      startY: 40,
      head: [["Élève", "Moyenne", "Rang", "Abs.", "Avert.", "Décision", "Mention", "Observations"]],
      body: conseilDelibs.map(d => [
        d.eleve, `${d.moyenne}/20`, `${d.rang}°`, `${d.absences}h`, 
        String(d.avertissements), d.decision, d.mention, d.observations
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: { 7: { cellWidth: 40 } }
    });

    const admis = conseilDelibs.filter(d => d.decision === "Admis").length;
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(10);
    doc.text(`Résumé: ${admis}/${conseilDelibs.length} admis (${((admis/conseilDelibs.length)*100).toFixed(1)}%)`, 14, finalY + 10);
    doc.text(`Moyenne de classe: ${(conseilDelibs.reduce((a, d) => a + d.moyenne, 0) / conseilDelibs.length).toFixed(2)}/20`, 14, finalY + 18);

    doc.save("Decisions_Conseil_TleD_T1.pdf");
    toast({ title: "Export réussi", description: "Le tableau des décisions a été téléchargé en PDF" });
  };

  const handleConsulterPV = (conseil: Conseil) => {
    setPreviewConseil(conseil);
    setIsPVPreviewOpen(true);
  };

  const handleSendConvocations = () => {
    const planned = conseils.filter(c => c.statut === "Planifié");
    toast({ title: "Convocations envoyées", description: `${planned.length} convocations envoyées aux enseignants concernés` });
  };

  const totalConseils = conseils.length;
  const completedConseils = conseils.filter(c => c.statut === "Complété").length;
  const inProgressConseils = conseils.filter(c => c.statut === "En cours").length;
  const plannedConseils = conseils.filter(c => c.statut === "Planifié").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conseils de Classe</h1>
          <p className="text-muted-foreground">Organisation et délibérations trimestrielles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Planifier Conseil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Planifier un Conseil de Classe</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Classe</Label>
                <Select onValueChange={(v) => setConseilForm({...conseilForm, classe: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6ème A">6ème A</SelectItem>
                    <SelectItem value="5ème B">5ème B</SelectItem>
                    <SelectItem value="4ème C">4ème C</SelectItem>
                    <SelectItem value="3ème A">3ème A</SelectItem>
                    <SelectItem value="2nde C">2nde C</SelectItem>
                    <SelectItem value="1ère D">1ère D</SelectItem>
                    <SelectItem value="Tle A1">Tle A1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={conseilForm.date}
                    onChange={(e) => setConseilForm({...conseilForm, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heure</Label>
                  <Input 
                    type="time"
                    value={conseilForm.heure}
                    onChange={(e) => setConseilForm({...conseilForm, heure: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Professeur Principal</Label>
                <Select onValueChange={(v) => setConseilForm({...conseilForm, profPrincipal: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M. KOFFI">M. KOFFI</SelectItem>
                    <SelectItem value="Mme DIALLO">Mme DIALLO</SelectItem>
                    <SelectItem value="M. TOURÉ">M. TOURÉ</SelectItem>
                    <SelectItem value="M. KONE">M. KONE</SelectItem>
                    <SelectItem value="Mme BAMBA">Mme BAMBA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateConseil}>Planifier</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conseils</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConseils}</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complétés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedConseils}</div>
            <p className="text-xs text-muted-foreground">PV générés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressConseils}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{plannedConseils}</div>
            <p className="text-xs text-muted-foreground">À venir</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="deliberations">Délibérations</TabsTrigger>
          <TabsTrigger value="pv">Procès-Verbaux</TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Planning des Conseils de Classe</CardTitle>
              <CardDescription>Trimestre 1 - Année scolaire 2024-2025</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Professeur Principal</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>PV</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conseils.map((conseil) => (
                    <TableRow key={conseil.id}>
                      <TableCell>
                        <Badge variant="outline" className="text-base">
                          {conseil.classe}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {conseil.date}
                        </div>
                      </TableCell>
                      <TableCell>{conseil.heure}</TableCell>
                      <TableCell className="font-medium">{conseil.profPrincipal}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {conseil.participants > 0 ? `${conseil.participants} présents` : "Non démarré"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {conseil.pvGenere ? (
                          <Badge variant="default" className="gap-1">
                            <FileText className="h-3 w-3" />
                            Généré
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Non généré</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={conseil.statut} 
                          onValueChange={(v) => handleUpdateStatus(conseil.id, v as Conseil["statut"])}
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planifié">Planifié</SelectItem>
                            <SelectItem value="En cours">En cours</SelectItem>
                            <SelectItem value="Complété">Complété</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {conseil.statut === "Complété" && !conseil.pvGenere && (
                            <Button size="sm" variant="outline" onClick={() => generatePV(conseil)}>
                              <FileText className="mr-1 h-4 w-4" />
                              Générer PV
                            </Button>
                          )}
                          {conseil.pvGenere && (
                            <Button size="sm" variant="outline" onClick={() => generatePV(conseil)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedConseil(conseil);
                          }}>
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="deliberations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Délibérations - Tle D</CardTitle>
                  <CardDescription>Conseil du 15 Décembre 2024</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isDelibDialogOpen} onOpenChange={setIsDelibDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedConseil(conseils[0])}>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter Élève
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Ajouter une Délibération</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nom de l'élève</Label>
                            <Input 
                              placeholder="Ex: KOUASSI Jean"
                              value={delibForm.eleve}
                              onChange={(e) => setDelibForm({...delibForm, eleve: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Moyenne</Label>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="Ex: 14.5"
                              value={delibForm.moyenne}
                              onChange={(e) => setDelibForm({...delibForm, moyenne: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Rang</Label>
                            <Input 
                              type="number"
                              placeholder="Ex: 3"
                              value={delibForm.rang}
                              onChange={(e) => setDelibForm({...delibForm, rang: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Absences (heures)</Label>
                            <Input 
                              type="number"
                              placeholder="Ex: 4"
                              value={delibForm.absences}
                              onChange={(e) => setDelibForm({...delibForm, absences: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Avertissements</Label>
                            <Input 
                              type="number"
                              placeholder="Ex: 0"
                              value={delibForm.avertissements}
                              onChange={(e) => setDelibForm({...delibForm, avertissements: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Décision</Label>
                            <Select onValueChange={(v) => setDelibForm({...delibForm, decision: v})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admis">Admis</SelectItem>
                                <SelectItem value="Ajourné">Ajourné</SelectItem>
                                <SelectItem value="Exclu">Exclu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Mention</Label>
                            <Select onValueChange={(v) => setDelibForm({...delibForm, mention: v})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Très Bien">Très Bien (≥16)</SelectItem>
                                <SelectItem value="Bien">Bien (≥14)</SelectItem>
                                <SelectItem value="Assez Bien">Assez Bien (≥12)</SelectItem>
                                <SelectItem value="Passable">Passable (≥10)</SelectItem>
                                <SelectItem value="Insuffisant">Insuffisant (&lt;10)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Observations</Label>
                          <Input 
                            placeholder="Observations du conseil..."
                            value={delibForm.observations}
                            onChange={(e) => setDelibForm({...delibForm, observations: e.target.value})}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDelibDialogOpen(false)}>Annuler</Button>
                          <Button onClick={handleAddDeliberation}>Ajouter</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={handleExportDecisions}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter Décisions
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Rang</TableHead>
                    <TableHead>Absences</TableHead>
                    <TableHead>Avert.</TableHead>
                    <TableHead>Décision</TableHead>
                    <TableHead>Mention</TableHead>
                    <TableHead>Observations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliberations.filter(d => d.conseilId === 1).map((delib) => (
                    <TableRow key={delib.id}>
                      <TableCell className="font-medium">{delib.eleve}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${
                          delib.moyenne >= 14 ? "text-green-600" :
                          delib.moyenne >= 10 ? "text-blue-600" :
                          "text-red-600"
                        }`}>
                          {delib.moyenne}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{delib.rang}°</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={delib.absences > 5 ? "destructive" : "secondary"}>
                          {delib.absences}h
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={delib.avertissements > 0 ? "destructive" : "secondary"}>
                          {delib.avertissements}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={delib.decision === "Admis" ? "default" : "destructive"}>
                          {delib.decision}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          delib.mention === "Très Bien" || delib.mention === "Bien" ? "default" :
                          delib.mention === "Assez Bien" || delib.mention === "Passable" ? "secondary" :
                          "destructive"
                        }>
                          {delib.mention}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs text-sm">{delib.observations}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pv">
          <div className="grid gap-6">
            {conseils.filter(c => c.pvGenere).map((conseil) => (
              <Card key={conseil.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Procès-Verbal - {conseil.classe}</CardTitle>
                      <CardDescription>Conseil du {conseil.date} à {conseil.heure}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleConsulterPV(conseil)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Consulter
                      </Button>
                      <Button onClick={() => generatePV(conseil)}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">Professeur Principal:</span>
                      <span>{conseil.profPrincipal}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">Participants:</span>
                      <span>{conseil.participants} enseignants</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">Élèves délibérés:</span>
                      <span>{deliberations.filter(d => d.conseilId === conseil.id).length} élèves</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="font-medium">Document:</span>
                      <Badge variant="default">
                        <FileText className="mr-1 h-3 w-3" />
                        PV_{conseil.classe}_T1.pdf
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Consulter PV */}
      <Dialog open={isPVPreviewOpen} onOpenChange={setIsPVPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Procès-Verbal - {previewConseil?.classe}</DialogTitle>
          </DialogHeader>
          {previewConseil && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">Date:</span><span>{previewConseil.date} à {previewConseil.heure}</span></div>
                <div className="flex justify-between"><span className="font-medium">Professeur Principal:</span><span>{previewConseil.profPrincipal}</span></div>
                <div className="flex justify-between"><span className="font-medium">Participants:</span><span>{previewConseil.participants} enseignants</span></div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Rang</TableHead>
                    <TableHead>Décision</TableHead>
                    <TableHead>Mention</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliberations.filter(d => d.conseilId === previewConseil.id).map(d => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.eleve}</TableCell>
                      <TableCell>{d.moyenne}/20</TableCell>
                      <TableCell>{d.rang}°</TableCell>
                      <TableCell><Badge variant={d.decision === "Admis" ? "default" : "destructive"}>{d.decision}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{d.mention}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPVPreviewOpen(false)}>Fermer</Button>
                <Button onClick={() => { generatePV(previewConseil); setIsPVPreviewOpen(false); }}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger PDF
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}