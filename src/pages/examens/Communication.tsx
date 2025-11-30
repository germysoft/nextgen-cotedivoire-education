import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Download, 
  Eye,
  Key,
  BarChart3,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Share2,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface Candidat {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  classe: string;
  examen: string;
  moyenne: number;
  mention: string;
  statut: "admis" | "ajourne" | "refuse";
  codeAcces: string;
  parentEmail: string;
  parentPhone: string;
  consulte: boolean;
  dateConsultation?: string;
  smsEnvoye: boolean;
  emailEnvoye: boolean;
}

interface MessageTemplate {
  id: string;
  type: "sms" | "email";
  nom: string;
  sujet?: string;
  contenu: string;
}

const mockCandidats: Candidat[] = [
  {
    id: "1",
    matricule: "2024001",
    nom: "Kouassi",
    prenom: "Jean",
    classe: "3ème A",
    examen: "BEPC 2024",
    moyenne: 14.5,
    mention: "Assez Bien",
    statut: "admis",
    codeAcces: "BEPC2024-KJ-8H92",
    parentEmail: "parent.kouassi@email.ci",
    parentPhone: "+225 07 12 34 56 78",
    consulte: true,
    dateConsultation: "2024-07-15T10:30:00",
    smsEnvoye: true,
    emailEnvoye: true
  },
  {
    id: "2",
    matricule: "2024002",
    nom: "Traoré",
    prenom: "Fatou",
    classe: "3ème A",
    examen: "BEPC 2024",
    moyenne: 16.8,
    mention: "Bien",
    statut: "admis",
    codeAcces: "BEPC2024-TF-3K76",
    parentEmail: "traore.fatou@email.ci",
    parentPhone: "+225 05 98 76 54 32",
    consulte: true,
    dateConsultation: "2024-07-15T09:15:00",
    smsEnvoye: true,
    emailEnvoye: true
  },
  {
    id: "3",
    matricule: "2024003",
    nom: "Diallo",
    prenom: "Mamadou",
    classe: "3ème B",
    examen: "BEPC 2024",
    moyenne: 9.2,
    mention: "",
    statut: "ajourne",
    codeAcces: "BEPC2024-DM-5L94",
    parentEmail: "diallo.m@email.ci",
    parentPhone: "+225 01 23 45 67 89",
    consulte: false,
    smsEnvoye: true,
    emailEnvoye: false
  },
  {
    id: "4",
    matricule: "2024004",
    nom: "Bamba",
    prenom: "Aïcha",
    classe: "3ème B",
    examen: "BEPC 2024",
    moyenne: 18.2,
    mention: "Très Bien",
    statut: "admis",
    codeAcces: "BEPC2024-BA-9N12",
    parentEmail: "bamba.aicha@email.ci",
    parentPhone: "+225 07 88 99 00 11",
    consulte: false,
    smsEnvoye: false,
    emailEnvoye: false
  }
];

const mockTemplates: MessageTemplate[] = [
  {
    id: "1",
    type: "sms",
    nom: "SMS Résultats Admis",
    contenu: "Félicitations! {prenom} {nom} est ADMIS au {examen} avec {moyenne}/20 - Mention: {mention}. Code d'accès portail: {code}. Consultez le détail sur le portail élèves."
  },
  {
    id: "2",
    type: "sms",
    nom: "SMS Résultats Ajourné",
    contenu: "{prenom} {nom} est AJOURNE au {examen} avec {moyenne}/20. Code d'accès portail: {code}. Consultez le détail sur le portail élèves. Session de rattrapage disponible."
  },
  {
    id: "3",
    type: "email",
    nom: "Email Résultats Complets",
    sujet: "Résultats {examen} - {nom} {prenom}",
    contenu: "Cher(e) parent,\n\nNous avons le plaisir de vous informer des résultats de {prenom} {nom} au {examen}:\n\nMoyenne générale: {moyenne}/20\nStatut: {statut}\nMention: {mention}\n\nPour consulter le relevé de notes complet, connectez-vous au portail élèves avec le code d'accès suivant:\nCode: {code}\n\nCordialement,\nL'administration"
  }
];

export default function CommunicationExamens() {
  const [candidats] = useState<Candidat[]>(mockCandidats);
  const [selectedCandidats, setSelectedCandidats] = useState<string[]>([]);
  const [filterClasse, setFilterClasse] = useState<string>("tous");
  const [filterStatut, setFilterStatut] = useState<string>("tous");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const stats = {
    totalCandidats: candidats.length,
    smsEnvoyes: candidats.filter(c => c.smsEnvoye).length,
    emailEnvoyes: candidats.filter(c => c.emailEnvoye).length,
    consultes: candidats.filter(c => c.consulte).length,
    tauxConsultation: Math.round((candidats.filter(c => c.consulte).length / candidats.length) * 100),
    admis: candidats.filter(c => c.statut === "admis").length,
  };

  const filteredCandidats = candidats.filter(c => {
    const matchClasse = filterClasse === "tous" || c.classe === filterClasse;
    const matchStatut = filterStatut === "tous" || c.statut === filterStatut;
    return matchClasse && matchStatut;
  });

  const classes = Array.from(new Set(candidats.map(c => c.classe)));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidats(filteredCandidats.map(c => c.id));
    } else {
      setSelectedCandidats([]);
    }
  };

  const handleSelectCandidat = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidats([...selectedCandidats, id]);
    } else {
      setSelectedCandidats(selectedCandidats.filter(cId => cId !== id));
    }
  };

  const handleGenerateAllCodes = () => {
    const count = candidats.filter(c => !c.codeAcces).length;
    toast.success(`${count} codes d'accès générés avec succès`);
  };

  const handleSendSMS = () => {
    if (selectedCandidats.length === 0) {
      toast.error("Veuillez sélectionner au moins un candidat");
      return;
    }
    
    toast.success(`${selectedCandidats.length} SMS envoyés avec succès`);
    setSelectedCandidats([]);
  };

  const handleSendEmail = () => {
    if (selectedCandidats.length === 0) {
      toast.error("Veuillez sélectionner au moins un candidat");
      return;
    }
    
    toast.success(`${selectedCandidats.length} emails envoyés avec succès`);
    setSelectedCandidats([]);
  };

  const exportToDRENA = () => {
    const drenaData = candidats.map(c => ({
      "Matricule": c.matricule,
      "Nom": c.nom,
      "Prénom": c.prenom,
      "Classe": c.classe,
      "Examen": c.examen,
      "Moyenne Générale": c.moyenne,
      "Mention": c.mention,
      "Statut": c.statut.toUpperCase(),
      "Code Établissement": "CI-AB-001",
      "Année Scolaire": "2023-2024",
      "Session": "Normale",
      "Date Export": new Date().toISOString().split('T')[0]
    }));

    const ws = XLSX.utils.json_to_sheet(drenaData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Résultats DRENA");

    const maxWidth = drenaData.reduce((w, r) => Math.max(w, r.Nom.length, r.Prénom.length), 10);
    ws['!cols'] = [
      { wch: 12 }, { wch: maxWidth }, { wch: maxWidth }, { wch: 10 },
      { wch: 20 }, { wch: 8 }, { wch: 12 }, { wch: 10 },
      { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 12 }
    ];

    XLSX.writeFile(wb, `Export_DRENA_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Export DRENA généré avec succès");
  };

  const exportAccessCodes = () => {
    const codesData = candidats.map(c => ({
      "Matricule": c.matricule,
      "Nom Complet": `${c.nom} ${c.prenom}`,
      "Classe": c.classe,
      "Code d'Accès": c.codeAcces,
      "Email Parent": c.parentEmail,
      "Téléphone Parent": c.parentPhone,
      "Statut": c.statut,
      "Consulté": c.consulte ? "Oui" : "Non"
    }));

    const ws = XLSX.utils.json_to_sheet(codesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Codes Accès");

    ws['!cols'] = [
      { wch: 12 }, { wch: 25 }, { wch: 10 }, { wch: 20 },
      { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 10 }
    ];

    XLSX.writeFile(wb, `Codes_Acces_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Liste des codes d'accès exportée");
  };

  const getStatutBadge = (statut: Candidat["statut"]) => {
    switch (statut) {
      case "admis":
        return <Badge className="bg-green-600">Admis</Badge>;
      case "ajourne":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Ajourné</Badge>;
      case "refuse":
        return <Badge variant="destructive">Refusé</Badge>;
    }
  };

  const previewMessage = (template: MessageTemplate, candidat: Candidat) => {
    return template.contenu
      .replace("{prenom}", candidat.prenom)
      .replace("{nom}", candidat.nom)
      .replace("{examen}", candidat.examen)
      .replace("{moyenne}", candidat.moyenne.toString())
      .replace("{mention}", candidat.mention)
      .replace("{statut}", candidat.statut)
      .replace("{code}", candidat.codeAcces);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Communication des Résultats</h1>
        <p className="text-muted-foreground">Diffusion SMS/Email, portail élèves et export DRENA</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Envoyés</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.smsEnvoyes}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalCandidats} candidats
            </p>
            <Progress value={(stats.smsEnvoyes / stats.totalCandidats) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emailEnvoyes}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalCandidats} candidats
            </p>
            <Progress value={(stats.emailEnvoyes / stats.totalCandidats) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultes}</div>
            <p className="text-xs text-muted-foreground">
              Taux: {stats.tauxConsultation}%
            </p>
            <Progress value={stats.tauxConsultation} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admis}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.admis / stats.totalCandidats) * 100)}% admis
            </p>
            <Progress value={(stats.admis / stats.totalCandidats) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="diffusion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="diffusion">
            <Send className="h-4 w-4 mr-2" />
            Diffusion
          </TabsTrigger>
          <TabsTrigger value="portail">
            <Key className="h-4 w-4 mr-2" />
            Portail Élèves
          </TabsTrigger>
          <TabsTrigger value="export">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export DRENA
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diffusion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diffusion par Lot</CardTitle>
              <CardDescription>Envoyez les résultats aux parents par SMS et/ou Email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Classe</Label>
                  <Select value={filterClasse} onValueChange={setFilterClasse}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes les classes</SelectItem>
                      {classes.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label>Statut</Label>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value="admis">Admis</SelectItem>
                      <SelectItem value="ajourne">Ajourné</SelectItem>
                      <SelectItem value="refuse">Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label>Modèle</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTemplates.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.nom} ({t.type.toUpperCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Message Personnalisé (optionnel)</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Variables disponibles: {nom}, {prenom}, {moyenne}, {mention}, {statut}, {code}"
                  rows={3}
                />
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCandidats.length === filteredCandidats.length && filteredCandidats.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Résultat</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut Envoi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidats.map((candidat) => (
                      <TableRow key={candidat.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCandidats.includes(candidat.id)}
                            onCheckedChange={(checked) => handleSelectCandidat(candidat.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{candidat.nom[0]}{candidat.prenom[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{candidat.nom} {candidat.prenom}</div>
                              <div className="text-xs text-muted-foreground">{candidat.matricule}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidat.classe}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{candidat.moyenne}/20</div>
                            {getStatutBadge(candidat.statut)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {candidat.parentEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {candidat.parentPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {candidat.smsEnvoye ? (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                                SMS
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                SMS
                              </Badge>
                            )}
                            {candidat.emailEnvoye ? (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                                Email
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {selectedCandidats.length} candidat(s) sélectionné(s). 
                  Les messages seront envoyés aux parents via SMS et Email.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button onClick={handleSendSMS} disabled={selectedCandidats.length === 0}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Envoyer SMS ({selectedCandidats.length})
                </Button>
                <Button onClick={handleSendEmail} disabled={selectedCandidats.length === 0}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer Email ({selectedCandidats.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Codes d'Accès Individuels</CardTitle>
              <CardDescription>Gérez les codes d'accès au portail élèves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 justify-end">
                <Button onClick={handleGenerateAllCodes} variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Générer tous les codes
                </Button>
                <Button onClick={exportAccessCodes}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les codes
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Code d'Accès</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Consultation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidats.map((candidat) => (
                    <TableRow key={candidat.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{candidat.nom[0]}{candidat.prenom[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidat.nom} {candidat.prenom}</div>
                            <div className="text-xs text-muted-foreground">{candidat.matricule}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{candidat.classe}</TableCell>
                      <TableCell>
                        <div className="font-mono text-sm bg-muted p-2 rounded">
                          {candidat.codeAcces}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>{candidat.parentEmail}</div>
                          <div className="text-muted-foreground">{candidat.parentPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {candidat.consulte ? (
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                              Consulté
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {new Date(candidat.dateConsultation!).toLocaleString('fr-FR')}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Non consulté
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Format DRENA</CardTitle>
              <CardDescription>Export officiel des résultats vers la plateforme DRENA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertDescription>
                  L'export DRENA génère un fichier Excel conforme au format officiel du Ministère de l'Éducation Nationale.
                  Ce fichier contient tous les résultats validés et peut être directement importé sur la plateforme DRENA.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600" />
                      <h3 className="font-semibold">Format Excel DRENA</h3>
                      <p className="text-sm text-muted-foreground">
                        Conforme aux spécifications officielles
                      </p>
                      <ul className="text-xs text-left space-y-1 mt-4">
                        <li>✓ Matricules candidats</li>
                        <li>✓ Notes par matière</li>
                        <li>✓ Moyennes et mentions</li>
                        <li>✓ Statuts de validation</li>
                        <li>✓ Codes établissement</li>
                        <li>✓ Métadonnées session</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <BarChart3 className="h-12 w-12 mx-auto text-blue-600" />
                      <h3 className="font-semibold">Statistiques Incluses</h3>
                      <p className="text-sm text-muted-foreground">
                        Données agrégées pour reporting
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                        <div className="bg-muted p-2 rounded">
                          <div className="font-bold">{candidats.length}</div>
                          <div className="text-xs">Candidats</div>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <div className="font-bold">{stats.admis}</div>
                          <div className="text-xs">Admis</div>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <div className="font-bold">
                            {candidats.filter(c => c.mention === "Très Bien").length}
                          </div>
                          <div className="text-xs">Très Bien</div>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <div className="font-bold">
                            {Math.round((stats.admis / stats.totalCandidats) * 100)}%
                          </div>
                          <div className="text-xs">Taux</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={exportToDRENA} size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Générer Export DRENA
                </Button>
              </div>

              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Instructions d'import DRENA</h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Téléchargez le fichier Excel généré</li>
                    <li>Connectez-vous à la plateforme DRENA</li>
                    <li>Accédez à la section "Import Résultats"</li>
                    <li>Sélectionnez votre établissement et la session</li>
                    <li>Importez le fichier Excel</li>
                    <li>Validez les données après vérification</li>
                  </ol>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taux de Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consultations portail</span>
                    <span className="font-bold">{stats.consultes}/{stats.totalCandidats}</span>
                  </div>
                  <Progress value={stats.tauxConsultation} />
                  <p className="text-2xl font-bold text-center">{stats.tauxConsultation}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dernières Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidats
                    .filter(c => c.consulte)
                    .sort((a, b) => new Date(b.dateConsultation!).getTime() - new Date(a.dateConsultation!).getTime())
                    .slice(0, 5)
                    .map((candidat) => (
                      <div key={candidat.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {candidat.nom[0]}{candidat.prenom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {candidat.nom} {candidat.prenom}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(candidat.dateConsultation!).toLocaleString('fr-FR')}
                          </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diffusion SMS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS envoyés</span>
                    <span className="font-bold">{stats.smsEnvoyes}/{stats.totalCandidats}</span>
                  </div>
                  <Progress value={(stats.smsEnvoyes / stats.totalCandidats) * 100} />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.smsEnvoyes}</div>
                      <div className="text-xs text-muted-foreground">Envoyés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.totalCandidats - stats.smsEnvoyes}
                      </div>
                      <div className="text-xs text-muted-foreground">En attente</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diffusion Email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emails envoyés</span>
                    <span className="font-bold">{stats.emailEnvoyes}/{stats.totalCandidats}</span>
                  </div>
                  <Progress value={(stats.emailEnvoyes / stats.totalCandidats) * 100} />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.emailEnvoyes}</div>
                      <div className="text-xs text-muted-foreground">Envoyés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.totalCandidats - stats.emailEnvoyes}
                      </div>
                      <div className="text-xs text-muted-foreground">En attente</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu des Messages</DialogTitle>
            <DialogDescription>
              Prévisualisation pour {selectedCandidats.length} candidat(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedCandidats.slice(0, 3).map(id => {
              const candidat = candidats.find(c => c.id === id);
              if (!candidat) return null;

              const template = mockTemplates.find(t => t.id === selectedTemplate);
              if (!template) return null;

              return (
                <Card key={id}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {candidat.nom} {candidat.prenom} - {candidat.classe}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {template.type === "email" && (
                        <div>
                          <span className="text-xs font-semibold">Sujet:</span>
                          <p className="text-sm">{template.sujet?.replace("{nom}", candidat.nom).replace("{prenom}", candidat.prenom).replace("{examen}", candidat.examen)}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-semibold">Message:</span>
                        <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded mt-1">
                          {previewMessage(template, candidat)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {selectedCandidats.length > 3 && (
              <Alert>
                <AlertDescription>
                  + {selectedCandidats.length - 3} autre(s) candidat(s) recevront un message similaire adapté à leur résultat
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
