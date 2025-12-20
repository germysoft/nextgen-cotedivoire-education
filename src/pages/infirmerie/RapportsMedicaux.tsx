import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileText, Download, Calendar, TrendingUp, Users, Activity,
  FileBarChart, Clock, Filter, Eye, Printer, Mail, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RapportPeriodique {
  id: string;
  titre: string;
  periode: string;
  dateGeneration: string;
  type: "hebdomadaire" | "mensuel" | "trimestriel" | "annuel";
  statut: "généré" | "en_cours" | "planifié";
  consultations: number;
  urgences: number;
  maladiesFrequentes: string[];
}

const rapportsPeriodiques: RapportPeriodique[] = [
  {
    id: "R001",
    titre: "Rapport Hebdomadaire Semaine 50",
    periode: "09/12/2024 - 15/12/2024",
    dateGeneration: "2024-12-16",
    type: "hebdomadaire",
    statut: "généré",
    consultations: 45,
    urgences: 3,
    maladiesFrequentes: ["Grippe", "Maux de tête", "Blessures sportives"]
  },
  {
    id: "R002",
    titre: "Rapport Mensuel Novembre 2024",
    periode: "01/11/2024 - 30/11/2024",
    dateGeneration: "2024-12-01",
    type: "mensuel",
    statut: "généré",
    consultations: 189,
    urgences: 12,
    maladiesFrequentes: ["Rhume", "Grippe", "Gastro-entérite", "Allergies"]
  },
  {
    id: "R003",
    titre: "Rapport Trimestriel T3 2024",
    periode: "01/07/2024 - 30/09/2024",
    dateGeneration: "2024-10-05",
    type: "trimestriel",
    statut: "généré",
    consultations: 534,
    urgences: 28,
    maladiesFrequentes: ["Déshydratation", "Coups de chaleur", "Blessures", "Allergies"]
  },
  {
    id: "R004",
    titre: "Rapport Hebdomadaire Semaine 51",
    periode: "16/12/2024 - 22/12/2024",
    dateGeneration: "2024-12-23",
    type: "hebdomadaire",
    statut: "planifié",
    consultations: 0,
    urgences: 0,
    maladiesFrequentes: []
  }
];

const statsGlobales = {
  totalConsultations: 1245,
  totalUrgences: 67,
  tauxAbsenteisme: 3.2,
  casChroniques: 23
};

export default function RapportsMedicaux() {
  const [selectedPeriode, setSelectedPeriode] = useState("tous");
  const [rapportDetails, setRapportDetails] = useState<RapportPeriodique | null>(null);

  const generatePDF = (rapport: RapportPeriodique) => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("RAPPORT MÉDICAL PÉRIODIQUE", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(rapport.titre, 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Période: ${rapport.periode}`, 105, 38, { align: "center" });
    doc.text(`Généré le: ${new Date(rapport.dateGeneration).toLocaleDateString('fr-FR')}`, 105, 44, { align: "center" });

    // Ligne de séparation
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    // Statistiques principales
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text("RÉSUMÉ STATISTIQUE", 20, 62);

    autoTable(doc, {
      startY: 68,
      head: [["Indicateur", "Valeur", "Évolution"]],
      body: [
        ["Consultations totales", rapport.consultations.toString(), "+5%"],
        ["Urgences", rapport.urgences.toString(), "-2%"],
        ["Taux d'absentéisme médical", "3.2%", "Stable"],
        ["Cas chroniques suivis", "23", "+1"]
      ],
      theme: "striped",
      headStyles: { fillColor: [52, 152, 219] }
    });

    // Maladies fréquentes
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.text("PATHOLOGIES FRÉQUENTES", 20, finalY + 15);

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Rang", "Pathologie", "Cas", "Pourcentage"]],
      body: rapport.maladiesFrequentes.map((maladie, index) => [
        (index + 1).toString(),
        maladie,
        Math.floor(Math.random() * 30 + 10).toString(),
        `${Math.floor(Math.random() * 20 + 5)}%`
      ]),
      theme: "striped",
      headStyles: { fillColor: [46, 204, 113] }
    });

    // Recommandations
    const finalY2 = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(14);
    doc.text("RECOMMANDATIONS", 20, finalY2 + 15);

    doc.setFontSize(10);
    doc.setTextColor(60);
    const recommandations = [
      "• Renforcer la prévention contre la grippe saisonnière",
      "• Organiser une campagne de sensibilisation sur l'hygiène",
      "• Vérifier les stocks de médicaments avant les vacances",
      "• Planifier un suivi des cas chroniques"
    ];
    recommandations.forEach((rec, index) => {
      doc.text(rec, 25, finalY2 + 25 + (index * 7));
    });

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Infirmerie Scolaire - Rapport généré automatiquement", 105, 285, { align: "center" });

    doc.save(`${rapport.titre.replace(/ /g, "_")}.pdf`);
    toast.success("Rapport PDF généré avec succès");
  };

  const genererNouveauRapport = (type: string) => {
    toast.success(`Génération du rapport ${type} en cours...`);
    setTimeout(() => {
      toast.success(`Rapport ${type} généré avec succès`);
    }, 2000);
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      hebdomadaire: "bg-blue-100 text-blue-800",
      mensuel: "bg-green-100 text-green-800",
      trimestriel: "bg-purple-100 text-purple-800",
      annuel: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "généré": return "bg-green-100 text-green-800";
      case "en_cours": return "bg-yellow-100 text-yellow-800";
      case "planifié": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rapports Médicaux Périodiques</h1>
          <p className="text-muted-foreground">Génération et consultation des rapports statistiques</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FileBarChart className="h-4 w-4 mr-2" />
                Générer un rapport
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Générer un nouveau rapport</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Type de rapport</Label>
                  <Select defaultValue="hebdomadaire">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                      <SelectItem value="mensuel">Mensuel</SelectItem>
                      <SelectItem value="trimestriel">Trimestriel</SelectItem>
                      <SelectItem value="annuel">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Période de début</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Période de fin</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Commentaires additionnels</Label>
                  <Textarea placeholder="Notes ou observations à inclure..." />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => genererNouveauRapport("personnalisé")}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Générer
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Planifier
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsGlobales.totalConsultations}</p>
                <p className="text-sm text-muted-foreground">Consultations (année)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsGlobales.totalUrgences}</p>
                <p className="text-sm text-muted-foreground">Urgences (année)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsGlobales.tauxAbsenteisme}%</p>
                <p className="text-sm text-muted-foreground">Taux d'absentéisme</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsGlobales.casChroniques}</p>
                <p className="text-sm text-muted-foreground">Cas chroniques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rapports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rapports">Historique des rapports</TabsTrigger>
          <TabsTrigger value="planification">Planification automatique</TabsTrigger>
          <TabsTrigger value="modeles">Modèles de rapport</TabsTrigger>
        </TabsList>

        <TabsContent value="rapports">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Rapports générés</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedPeriode} onValueChange={setSelectedPeriode}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les types</SelectItem>
                      <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                      <SelectItem value="mensuel">Mensuel</SelectItem>
                      <SelectItem value="trimestriel">Trimestriel</SelectItem>
                      <SelectItem value="annuel">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Consultations</TableHead>
                    <TableHead>Urgences</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rapportsPeriodiques
                    .filter(r => selectedPeriode === "tous" || r.type === selectedPeriode)
                    .map(rapport => (
                    <TableRow key={rapport.id}>
                      <TableCell className="font-medium">{rapport.titre}</TableCell>
                      <TableCell>{rapport.periode}</TableCell>
                      <TableCell>
                        <Badge className={getTypeBadge(rapport.type)}>
                          {rapport.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{rapport.consultations}</TableCell>
                      <TableCell>{rapport.urgences}</TableCell>
                      <TableCell>
                        <Badge className={getStatutBadge(rapport.statut)}>
                          {rapport.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setRapportDetails(rapport)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generatePDF(rapport)}
                            disabled={rapport.statut === "planifié"}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
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

        <TabsContent value="planification">
          <Card>
            <CardHeader>
              <CardTitle>Planification automatique des rapports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Rapport Hebdomadaire</h3>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Généré automatiquement chaque lundi à 8h00
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Modifier</Button>
                      <Button size="sm" variant="outline">Désactiver</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Rapport Mensuel</h3>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Généré automatiquement le 1er de chaque mois à 6h00
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Modifier</Button>
                      <Button size="sm" variant="outline">Désactiver</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Rapport Trimestriel</h3>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Généré automatiquement le 5 après chaque trimestre
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Modifier</Button>
                      <Button size="sm" variant="outline">Désactiver</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-orange-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Rapport Annuel</h3>
                      <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Non configuré - Cliquez pour activer
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Configurer</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modeles">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de rapport personnalisés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border hover:border-primary cursor-pointer transition-colors">
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                    <h3 className="font-semibold">Rapport Standard</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Statistiques de base avec graphiques
                    </p>
                  </CardContent>
                </Card>
                <Card className="border hover:border-primary cursor-pointer transition-colors">
                  <CardContent className="pt-6 text-center">
                    <FileBarChart className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="font-semibold">Rapport Détaillé</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Analyse approfondie par classe et pathologie
                    </p>
                  </CardContent>
                </Card>
                <Card className="border hover:border-primary cursor-pointer transition-colors">
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                    <h3 className="font-semibold">Rapport Tendances</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Évolution et comparaisons périodiques
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog détails rapport */}
      <Dialog open={!!rapportDetails} onOpenChange={() => setRapportDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{rapportDetails?.titre}</DialogTitle>
          </DialogHeader>
          {rapportDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Période</p>
                  <p className="font-medium">{rapportDetails.periode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de génération</p>
                  <p className="font-medium">{new Date(rapportDetails.dateGeneration).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold text-blue-600">{rapportDetails.consultations}</p>
                    <p className="text-sm text-muted-foreground">Consultations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold text-red-600">{rapportDetails.urgences}</p>
                    <p className="text-sm text-muted-foreground">Urgences</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Pathologies fréquentes</p>
                <div className="flex flex-wrap gap-2">
                  {rapportDetails.maladiesFrequentes.map((maladie, index) => (
                    <Badge key={index} variant="outline">{maladie}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => generatePDF(rapportDetails)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer par email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
