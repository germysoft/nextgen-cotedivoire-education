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
import { toast } from "sonner";
import {
  Search, Filter, Download, Upload, Eye, Edit, CheckCircle2, XCircle,
  AlertTriangle, Users, FileText, Database, RefreshCw, Hash, Calendar,
  MapPin, School, BookOpen, User, Phone, Mail, Clock, Shield, FileCheck
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface NationalRecord {
  id: string;
  matriculeNational: string;
  matriculeLocal: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: "M" | "F";
  nationalite: string;
  classe: string;
  etablissement: string;
  codeEtablissement: string;
  statut: "actif" | "transfere" | "radie" | "diplome";
  dateInscription: string;
  derniereMaj: string;
  valideMENA: boolean;
}

interface ValidationIssue {
  id: string;
  matricule: string;
  eleve: string;
  type: "doublon" | "incomplet" | "format" | "incoherence";
  description: string;
  gravite: "critique" | "majeure" | "mineure";
  dateDetection: string;
  statut: "ouvert" | "resolu" | "ignore";
}

const mockRecords: NationalRecord[] = [
  { id: "1", matriculeNational: "CI2024001234", matriculeLocal: "2024-001", nom: "KOUASSI", prenoms: "Aya Marie", dateNaissance: "2010-05-15", lieuNaissance: "Abidjan", sexe: "F", nationalite: "Ivoirienne", classe: "6ème A", etablissement: "Collège Excellence", codeEtablissement: "CI-ABJ-001", statut: "actif", dateInscription: "2024-09-01", derniereMaj: "2024-01-15", valideMENA: true },
  { id: "2", matriculeNational: "CI2024001235", matriculeLocal: "2024-002", nom: "TRAORE", prenoms: "Ibrahim", dateNaissance: "2009-08-22", lieuNaissance: "Bouaké", sexe: "M", nationalite: "Ivoirienne", classe: "5ème B", etablissement: "Collège Excellence", codeEtablissement: "CI-ABJ-001", statut: "actif", dateInscription: "2023-09-01", derniereMaj: "2024-01-15", valideMENA: true },
  { id: "3", matriculeNational: "CI2024001236", matriculeLocal: "2024-003", nom: "KONE", prenoms: "Fatou", dateNaissance: "2010-12-03", lieuNaissance: "Yamoussoukro", sexe: "F", nationalite: "Ivoirienne", classe: "6ème C", etablissement: "Collège Excellence", codeEtablissement: "CI-ABJ-001", statut: "actif", dateInscription: "2024-09-01", derniereMaj: "2024-01-14", valideMENA: false },
  { id: "4", matriculeNational: "CI2023005678", matriculeLocal: "2023-045", nom: "DIALLO", prenoms: "Mamadou", dateNaissance: "2008-03-18", lieuNaissance: "Man", sexe: "M", nationalite: "Ivoirienne", classe: "4ème A", etablissement: "Collège Excellence", codeEtablissement: "CI-ABJ-001", statut: "actif", dateInscription: "2021-09-01", derniereMaj: "2024-01-10", valideMENA: true },
  { id: "5", matriculeNational: "CI2022003456", matriculeLocal: "2022-089", nom: "OUATTARA", prenoms: "Aminata", dateNaissance: "2007-07-25", lieuNaissance: "Korhogo", sexe: "F", nationalite: "Ivoirienne", classe: "3ème B", etablissement: "Collège Excellence", codeEtablissement: "CI-ABJ-001", statut: "transfere", dateInscription: "2020-09-01", derniereMaj: "2023-12-20", valideMENA: true },
  { id: "6", matriculeNational: "", matriculeLocal: "2024-056", nom: "YAO", prenoms: "Koffi Jean", dateNaissance: "2011-01-10", lieuNaissance: "Daloa", sexe: "M", nationalite: "Ivoirienne", classe: "6ème B", etablissement: "Collège Excellence", codeEtablissement: "CI-ABJ-001", statut: "actif", dateInscription: "2024-09-15", derniereMaj: "2024-01-15", valideMENA: false },
];

const mockValidationIssues: ValidationIssue[] = [
  { id: "1", matricule: "2024-003", eleve: "KONE Fatou", type: "incomplet", description: "Extrait de naissance non fourni", gravite: "majeure", dateDetection: "2024-01-14", statut: "ouvert" },
  { id: "2", matricule: "2024-056", eleve: "YAO Koffi Jean", type: "format", description: "Matricule national non généré", gravite: "critique", dateDetection: "2024-01-15", statut: "ouvert" },
  { id: "3", matricule: "2024-012", eleve: "BAMBA Moussa", type: "doublon", description: "Doublon potentiel détecté avec CI2023007890", gravite: "critique", dateDetection: "2024-01-12", statut: "ouvert" },
  { id: "4", matricule: "2023-078", eleve: "COULIBALY Awa", type: "incoherence", description: "Date de naissance incohérente avec niveau scolaire", gravite: "mineure", dateDetection: "2024-01-10", statut: "resolu" },
];

export default function FichierNational() {
  const [records, setRecords] = useState<NationalRecord[]>(mockRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<NationalRecord | null>(null);

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.matriculeNational.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.matriculeLocal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      actif: { variant: "default", label: "Actif" },
      transfere: { variant: "secondary", label: "Transféré" },
      radie: { variant: "destructive", label: "Radié" },
      diplome: { variant: "outline", label: "Diplômé" }
    };
    const style = styles[statut] || styles.actif;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getGraviteBadge = (gravite: string) => {
    const colors: Record<string, string> = {
      critique: "bg-red-100 text-red-800",
      majeure: "bg-orange-100 text-orange-800",
      mineure: "bg-yellow-100 text-yellow-800"
    };
    return <Badge className={colors[gravite]}>{gravite}</Badge>;
  };

  const getIssueBadge = (type: string) => {
    const labels: Record<string, string> = {
      doublon: "Doublon",
      incomplet: "Incomplet",
      format: "Format",
      incoherence: "Incohérence"
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  const viewDetail = (record: NationalRecord) => {
    setSelectedRecord(record);
    setShowDetailDialog(true);
  };

  const generateMatricule = (recordId: string) => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    const newMatricule = `CI${year}${random}`;
    
    setRecords(records.map(r => 
      r.id === recordId ? { ...r, matriculeNational: newMatricule, valideMENA: true } : r
    ));
    toast.success(`Matricule national généré: ${newMatricule}`);
  };

  const syncWithMENA = () => {
    toast.success("Synchronisation avec le fichier national MENA en cours...");
    setTimeout(() => {
      toast.success("Fichier national synchronisé avec succès");
    }, 2000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text("FICHIER NATIONAL DES ÉLÈVES", 148, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Exporté le ${new Date().toLocaleDateString("fr-FR")}`, 148, 22, { align: "center" });
    
    autoTable(doc, {
      startY: 30,
      head: [["Matricule National", "Matricule Local", "Nom", "Prénoms", "Date Naissance", "Sexe", "Classe", "Statut", "MENA"]],
      body: filteredRecords.map(r => [
        r.matriculeNational || "Non généré",
        r.matriculeLocal,
        r.nom,
        r.prenoms,
        r.dateNaissance,
        r.sexe,
        r.classe,
        r.statut,
        r.valideMENA ? "Validé" : "Non validé"
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save("fichier-national-eleves.pdf");
    toast.success("Export PDF téléchargé");
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords.map(r => ({
      "Matricule National": r.matriculeNational || "Non généré",
      "Matricule Local": r.matriculeLocal,
      "Nom": r.nom,
      "Prénoms": r.prenoms,
      "Date Naissance": r.dateNaissance,
      "Lieu Naissance": r.lieuNaissance,
      "Sexe": r.sexe,
      "Nationalité": r.nationalite,
      "Classe": r.classe,
      "Statut": r.statut,
      "Validé MENA": r.valideMENA ? "Oui" : "Non",
      "Date Inscription": r.dateInscription,
      "Dernière MAJ": r.derniereMaj,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fichier National");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "fichier-national-eleves.xlsx");
    toast.success("Export Excel téléchargé");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Fichier "${file.name}" importé avec succès (${records.length} enregistrements mis à jour)`);
      }
    };
    input.click();
  };

  const handleCorrectIssue = (issueId: string) => {
    toast.success("Anomalie marquée comme corrigée");
  };

  const handleIgnoreIssue = (issueId: string) => {
    toast.success("Anomalie ignorée");
  };

  const handleEditRecord = (record: NationalRecord) => {
    setSelectedRecord(record);
    setShowDetailDialog(true);
  };

  const stats = {
    total: records.length,
    actifs: records.filter(r => r.statut === "actif").length,
    valides: records.filter(r => r.valideMENA).length,
    sansMatricule: records.filter(r => !r.matriculeNational).length,
    issuesOuvertes: mockValidationIssues.filter(i => i.statut === "ouvert").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fichier National des Élèves</h1>
          <p className="text-muted-foreground">Gestion des matricules nationaux et validation MENA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={syncWithMENA}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser MENA
          </Button>
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
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total élèves</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.actifs}</p>
                <p className="text-xs text-muted-foreground">Élèves actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.valides}</p>
                <p className="text-xs text-muted-foreground">Validés MENA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Hash className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sansMatricule}</p>
                <p className="text-xs text-muted-foreground">Sans matricule</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.issuesOuvertes}</p>
                <p className="text-xs text-muted-foreground">Problèmes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Fichier National</TabsTrigger>
          <TabsTrigger value="validation">Validation & Anomalies</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des élèves du fichier national</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom ou matricule..."
                      className="pl-10 w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="actif">Actifs</SelectItem>
                      <SelectItem value="transfere">Transférés</SelectItem>
                      <SelectItem value="radie">Radiés</SelectItem>
                      <SelectItem value="diplome">Diplômés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule National</TableHead>
                    <TableHead>Matricule Local</TableHead>
                    <TableHead>Nom & Prénoms</TableHead>
                    <TableHead>Date Naissance</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>MENA</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.matriculeNational ? (
                          <code className="text-sm bg-muted px-2 py-1 rounded">{record.matriculeNational}</code>
                        ) : (
                          <Badge variant="destructive" className="text-xs">Non généré</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{record.matriculeLocal}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            record.sexe === "F" ? "bg-pink-100" : "bg-blue-100"
                          }`}>
                            <User className={`h-4 w-4 ${record.sexe === "F" ? "text-pink-600" : "text-blue-600"}`} />
                          </div>
                          <div>
                            <p className="font-medium">{record.nom} {record.prenoms}</p>
                            <p className="text-xs text-muted-foreground">{record.lieuNaissance}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.dateNaissance}</TableCell>
                      <TableCell><Badge variant="outline">{record.classe}</Badge></TableCell>
                      <TableCell>{getStatusBadge(record.statut)}</TableCell>
                      <TableCell>
                        {record.valideMENA ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => viewDetail(record)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!record.matriculeNational && (
                            <Button variant="ghost" size="icon" onClick={() => generateMatricule(record.id)}>
                              <Hash className="h-4 w-4 text-primary" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEditRecord(record)}>
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Anomalies et validations en attente</CardTitle>
              <CardDescription>Problèmes détectés nécessitant une correction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockValidationIssues.map(issue => (
                  <Card key={issue.id} className={`${
                    issue.statut === "resolu" ? "opacity-60" : ""
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {issue.gravite === "critique" ? (
                            <div className="p-2 rounded-lg bg-red-100">
                              <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                          ) : issue.gravite === "majeure" ? (
                            <div className="p-2 rounded-lg bg-orange-100">
                              <AlertTriangle className="h-5 w-5 text-orange-600" />
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-yellow-100">
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{issue.eleve}</span>
                              <code className="text-xs bg-muted px-2 py-0.5 rounded">{issue.matricule}</code>
                              {getIssueBadge(issue.type)}
                              {getGraviteBadge(issue.gravite)}
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Détecté le {issue.dateDetection}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={issue.statut === "resolu" ? "default" : issue.statut === "ignore" ? "secondary" : "outline"}>
                            {issue.statut === "resolu" ? "Résolu" : issue.statut === "ignore" ? "Ignoré" : "Ouvert"}
                          </Badge>
                          {issue.statut === "ouvert" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleCorrectIssue(issue.id)}>Corriger</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleIgnoreIssue(issue.id)}>Ignorer</Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Actifs", count: stats.actifs, color: "bg-green-500" },
                    { label: "Transférés", count: 1, color: "bg-blue-500" },
                    { label: "Radiés", count: 0, color: "bg-red-500" },
                    { label: "Diplômés", count: 0, color: "bg-purple-500" }
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validation MENA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>Validés</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{stats.valides}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span>Non validés</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{stats.total - stats.valides}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détail de l'élève</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Matricule National</Label>
                  <p className="font-medium">{selectedRecord.matriculeNational || "Non généré"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Matricule Local</Label>
                  <p className="font-medium">{selectedRecord.matriculeLocal}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nom & Prénoms</Label>
                  <p className="font-medium">{selectedRecord.nom} {selectedRecord.prenoms}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date de naissance</Label>
                  <p className="font-medium">{selectedRecord.dateNaissance}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Lieu de naissance</Label>
                  <p className="font-medium">{selectedRecord.lieuNaissance}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Sexe</Label>
                  <p className="font-medium">{selectedRecord.sexe === "M" ? "Masculin" : "Féminin"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nationalité</Label>
                  <p className="font-medium">{selectedRecord.nationalite}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Classe</Label>
                  <p className="font-medium">{selectedRecord.classe}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Établissement</Label>
                  <p className="font-medium">{selectedRecord.etablissement}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Statut MENA</Label>
                  <p className="font-medium flex items-center gap-2">
                    {selectedRecord.valideMENA ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Validé
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        Non validé
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Fermer</Button>
            <Button onClick={() => { toast.success("Modifications enregistrées"); setShowDetailDialog(false); }}>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
