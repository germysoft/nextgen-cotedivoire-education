import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Search, 
  Download, 
  Mail, 
  Printer, 
  FileText, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Send,
  Filter,
  RefreshCw,
  Eye,
  MoreHorizontal,
  MessageSquare,
  Building,
  Calendar,
  UserCheck
} from "lucide-react";
import { 
  mockExamCandidates, 
  mockJuryMembers, 
  mockExamCenters, 
  mockExamSchedule,
  ExamCandidate,
  JuryMember,
  convocationStatusLabels,
  convocationStatusColors,
  roleLabels,
  ConvocationExamStatus
} from "@/data/mockExamConvocations";
import { 
  generateCandidateConvocationPDF, 
  generateJuryConvocationPDF,
  generateBatchCandidatePDFs,
  generateBatchJuryPDFs
} from "@/components/convocations/ExamConvocationPDFGenerator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ConvocationsExamens() {
  const [candidates, setCandidates] = useState<ExamCandidate[]>(mockExamCandidates);
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>(mockJuryMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [centerFilter, setCenterFilter] = useState<string>("all");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedJury, setSelectedJury] = useState<string[]>([]);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [sendType, setSendType] = useState<'candidates' | 'jury'>('candidates');
  const [sendMethod, setSendMethod] = useState<'email' | 'sms' | 'both'>('email');
  const [customMessage, setCustomMessage] = useState("");

  // Filtrage des candidats
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.candidateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExamType = examTypeFilter === "all" || c.examType === examTypeFilter;
    const matchesStatus = statusFilter === "all" || c.convocationStatus === statusFilter;
    const matchesCenter = centerFilter === "all" || c.centerId === centerFilter;
    return matchesSearch && matchesExamType && matchesStatus && matchesCenter;
  });

  // Filtrage des jurys
  const filteredJury = juryMembers.filter(j => {
    const matchesSearch = 
      j.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExamType = examTypeFilter === "all" || j.examType === examTypeFilter;
    const matchesStatus = statusFilter === "all" || j.convocationStatus === statusFilter;
    const matchesCenter = centerFilter === "all" || j.centerId === centerFilter;
    return matchesSearch && matchesExamType && matchesStatus && matchesCenter;
  });

  // Statistiques
  const stats = {
    totalCandidates: candidates.length,
    candidatesGenerated: candidates.filter(c => c.convocationStatus !== 'draft').length,
    candidatesSent: candidates.filter(c => ['sent', 'received'].includes(c.convocationStatus)).length,
    totalJury: juryMembers.length,
    juryGenerated: juryMembers.filter(j => j.convocationStatus !== 'draft').length,
    jurySent: juryMembers.filter(j => ['sent', 'received'].includes(j.convocationStatus)).length,
  };

  // Génération PDF candidat
  const handleGenerateCandidatePDF = (candidate: ExamCandidate) => {
    const center = mockExamCenters.find(c => c.id === candidate.centerId);
    if (center) {
      generateCandidateConvocationPDF(candidate, mockExamSchedule, center);
      updateCandidateStatus(candidate.id, 'generated');
      toast.success(`Convocation générée pour ${candidate.lastName} ${candidate.firstName}`);
    }
  };

  // Génération PDF jury
  const handleGenerateJuryPDF = (member: JuryMember) => {
    const center = mockExamCenters.find(c => c.id === member.centerId);
    if (center) {
      generateJuryConvocationPDF(member, mockExamSchedule, center);
      updateJuryStatus(member.id, 'generated');
      toast.success(`Convocation générée pour ${member.lastName} ${member.firstName}`);
    }
  };

  // Génération en lot candidats
  const handleBatchGenerateCandidates = () => {
    const toGenerate = selectedCandidates.length > 0 
      ? candidates.filter(c => selectedCandidates.includes(c.id))
      : filteredCandidates;
    
    generateBatchCandidatePDFs(toGenerate, mockExamSchedule, mockExamCenters);
    
    toGenerate.forEach(c => updateCandidateStatus(c.id, 'generated'));
    toast.success(`${toGenerate.length} convocations candidats générées`);
    setSelectedCandidates([]);
  };

  // Génération en lot jurys
  const handleBatchGenerateJury = () => {
    const toGenerate = selectedJury.length > 0 
      ? juryMembers.filter(j => selectedJury.includes(j.id))
      : filteredJury;
    
    generateBatchJuryPDFs(toGenerate, mockExamSchedule, mockExamCenters);
    
    toGenerate.forEach(j => updateJuryStatus(j.id, 'generated'));
    toast.success(`${toGenerate.length} convocations jury générées`);
    setSelectedJury([]);
  };

  // Mise à jour statut candidat
  const updateCandidateStatus = (id: string, status: ConvocationExamStatus) => {
    setCandidates(prev => prev.map(c => 
      c.id === id 
        ? { 
            ...c, 
            convocationStatus: status,
            convocationGeneratedAt: status === 'generated' ? new Date().toISOString() : c.convocationGeneratedAt,
            convocationSentAt: status === 'sent' ? new Date().toISOString() : c.convocationSentAt
          }
        : c
    ));
  };

  // Mise à jour statut jury
  const updateJuryStatus = (id: string, status: ConvocationExamStatus) => {
    setJuryMembers(prev => prev.map(j => 
      j.id === id 
        ? { 
            ...j, 
            convocationStatus: status,
            convocationGeneratedAt: status === 'generated' ? new Date().toISOString() : j.convocationGeneratedAt,
            convocationSentAt: status === 'sent' ? new Date().toISOString() : j.convocationSentAt
          }
        : j
    ));
  };

  // Envoi des convocations
  const handleSendConvocations = () => {
    if (sendType === 'candidates') {
      const toSend = selectedCandidates.length > 0 
        ? candidates.filter(c => selectedCandidates.includes(c.id))
        : filteredCandidates.filter(c => c.convocationStatus === 'generated' || c.convocationStatus === 'printed');
      
      toSend.forEach(c => updateCandidateStatus(c.id, 'sent'));
      toast.success(`${toSend.length} convocations envoyées par ${sendMethod === 'both' ? 'Email et SMS' : sendMethod.toUpperCase()}`);
      setSelectedCandidates([]);
    } else {
      const toSend = selectedJury.length > 0 
        ? juryMembers.filter(j => selectedJury.includes(j.id))
        : filteredJury.filter(j => j.convocationStatus === 'generated' || j.convocationStatus === 'printed');
      
      toSend.forEach(j => updateJuryStatus(j.id, 'sent'));
      toast.success(`${toSend.length} convocations jury envoyées par ${sendMethod === 'both' ? 'Email et SMS' : sendMethod.toUpperCase()}`);
      setSelectedJury([]);
    }
    setShowSendDialog(false);
  };

  // Toggle sélection candidat
  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle sélection jury
  const toggleJurySelection = (id: string) => {
    setSelectedJury(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Sélectionner tous les candidats
  const selectAllCandidates = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  // Sélectionner tous les jurys
  const selectAllJury = () => {
    if (selectedJury.length === filteredJury.length) {
      setSelectedJury([]);
    } else {
      setSelectedJury(filteredJury.map(j => j.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convocations Examens</h1>
          <p className="text-muted-foreground">
            Génération et envoi des convocations élèves et membres de jury
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCandidates}</p>
                <p className="text-xs text-muted-foreground">Candidats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.candidatesGenerated}</p>
                <p className="text-xs text-muted-foreground">Conv. Générées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.candidatesSent}</p>
                <p className="text-xs text-muted-foreground">Conv. Envoyées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalJury}</p>
                <p className="text-xs text-muted-foreground">Membres Jury</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-2xl font-bold">{stats.juryGenerated}</p>
                <p className="text-xs text-muted-foreground">Jury Générées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{stats.jurySent}</p>
                <p className="text-xs text-muted-foreground">Jury Envoyées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, prénom ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type d'examen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les examens</SelectItem>
                <SelectItem value="BEPC">BEPC</SelectItem>
                <SelectItem value="BAC">BAC</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="generated">Générée</SelectItem>
                <SelectItem value="printed">Imprimée</SelectItem>
                <SelectItem value="sent">Envoyée</SelectItem>
                <SelectItem value="received">Accusée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={centerFilter} onValueChange={setCenterFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Centre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les centres</SelectItem>
                {mockExamCenters.map(center => (
                  <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onglets Candidats / Jury */}
      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="candidates" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Candidats ({filteredCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="jury" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Membres Jury ({filteredJury.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Candidats */}
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Convocations Candidats</CardTitle>
                  <CardDescription>
                    Générez et envoyez les convocations aux candidats
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleBatchGenerateCandidates}
                    disabled={filteredCandidates.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Générer PDF ({selectedCandidates.length || filteredCandidates.length})
                  </Button>
                  <Button 
                    onClick={() => {
                      setSendType('candidates');
                      setShowSendDialog(true);
                    }}
                    disabled={filteredCandidates.filter(c => c.convocationStatus !== 'draft').length === 0}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                          onCheckedChange={selectAllCandidates}
                        />
                      </TableHead>
                      <TableHead>N° Candidat</TableHead>
                      <TableHead>Nom et Prénoms</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Examen</TableHead>
                      <TableHead>Centre</TableHead>
                      <TableHead>Salle / Table</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCandidates.includes(candidate.id)}
                            onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{candidate.candidateNumber}</TableCell>
                        <TableCell className="font-medium">
                          {candidate.lastName} {candidate.firstName}
                        </TableCell>
                        <TableCell>{candidate.className}</TableCell>
                        <TableCell>
                          <Badge variant={candidate.examType === 'BAC' ? 'default' : 'secondary'}>
                            {candidate.examType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-32 truncate" title={candidate.centerName}>
                          {candidate.centerName}
                        </TableCell>
                        <TableCell>
                          {candidate.roomNumber} / {candidate.tableNumber}
                        </TableCell>
                        <TableCell>
                          <Badge className={convocationStatusColors[candidate.convocationStatus]}>
                            {convocationStatusLabels[candidate.convocationStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleGenerateCandidatePDF(candidate)}>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateCandidateStatus(candidate.id, 'printed');
                                toast.success('Statut mis à jour: Imprimée');
                              }}>
                                <Printer className="mr-2 h-4 w-4" />
                                Marquer imprimée
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateCandidateStatus(candidate.id, 'sent');
                                toast.success('Convocation envoyée');
                              }}>
                                <Mail className="mr-2 h-4 w-4" />
                                Envoyer par email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateCandidateStatus(candidate.id, 'sent');
                                toast.success('SMS envoyé');
                              }}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Envoyer par SMS
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateCandidateStatus(candidate.id, 'received');
                                toast.success('Accusé de réception enregistré');
                              }}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Accusé de réception
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCandidates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          Aucun candidat trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Jury */}
        <TabsContent value="jury">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Convocations Membres de Jury</CardTitle>
                  <CardDescription>
                    Générez et envoyez les convocations aux membres de jury
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleBatchGenerateJury}
                    disabled={filteredJury.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Générer PDF ({selectedJury.length || filteredJury.length})
                  </Button>
                  <Button 
                    onClick={() => {
                      setSendType('jury');
                      setShowSendDialog(true);
                    }}
                    disabled={filteredJury.filter(j => j.convocationStatus !== 'draft').length === 0}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedJury.length === filteredJury.length && filteredJury.length > 0}
                          onCheckedChange={selectAllJury}
                        />
                      </TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Nom et Prénoms</TableHead>
                      <TableHead>Fonction</TableHead>
                      <TableHead>Discipline</TableHead>
                      <TableHead>Examen</TableHead>
                      <TableHead>Centre</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJury.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedJury.includes(member.id)}
                            onCheckedChange={() => toggleJurySelection(member.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{member.matricule}</TableCell>
                        <TableCell className="font-medium">
                          {member.title} {member.lastName} {member.firstName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{roleLabels[member.role]}</Badge>
                        </TableCell>
                        <TableCell>{member.subject}</TableCell>
                        <TableCell>
                          <Badge variant={member.examType === 'BAC' ? 'default' : 'secondary'}>
                            {member.examType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-32 truncate" title={member.centerName}>
                          {member.centerName}
                        </TableCell>
                        <TableCell>
                          <Badge className={convocationStatusColors[member.convocationStatus]}>
                            {convocationStatusLabels[member.convocationStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleGenerateJuryPDF(member)}>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateJuryStatus(member.id, 'printed');
                                toast.success('Statut mis à jour: Imprimée');
                              }}>
                                <Printer className="mr-2 h-4 w-4" />
                                Marquer imprimée
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateJuryStatus(member.id, 'sent');
                                toast.success('Convocation envoyée');
                              }}>
                                <Mail className="mr-2 h-4 w-4" />
                                Envoyer par email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateJuryStatus(member.id, 'sent');
                                toast.success('SMS envoyé');
                              }}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Envoyer par SMS
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateJuryStatus(member.id, 'received');
                                toast.success('Accusé de réception enregistré');
                              }}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Accusé de réception
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredJury.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          Aucun membre de jury trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calendrier des épreuves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier des Épreuves
          </CardTitle>
          <CardDescription>Planning des examens BEPC et BAC</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="BEPC">
            <TabsList>
              <TabsTrigger value="BEPC">BEPC</TabsTrigger>
              <TabsTrigger value="BAC">BAC</TabsTrigger>
            </TabsList>
            <TabsContent value="BEPC" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Horaire</TableHead>
                      <TableHead>Épreuve</TableHead>
                      <TableHead>Durée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExamSchedule.filter(s => s.examType === 'BEPC').map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </TableCell>
                        <TableCell>{item.startTime} - {item.endTime}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="BAC" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Horaire</TableHead>
                      <TableHead>Épreuve</TableHead>
                      <TableHead>Durée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExamSchedule.filter(s => s.examType === 'BAC').map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </TableCell>
                        <TableCell>{item.startTime} - {item.endTime}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog Envoi */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer les convocations</DialogTitle>
            <DialogDescription>
              Choisissez le mode d'envoi pour les {sendType === 'candidates' ? 'candidats' : 'membres de jury'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mode d'envoi</Label>
              <Select value={sendMethod} onValueChange={(v: 'email' | 'sms' | 'both') => setSendMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email uniquement</SelectItem>
                  <SelectItem value="sms">SMS uniquement</SelectItem>
                  <SelectItem value="both">Email et SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message personnalisé (optionnel)</Label>
              <Textarea
                placeholder="Ajoutez un message personnalisé à l'envoi..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Récapitulatif:</p>
              <p>
                {sendType === 'candidates' 
                  ? `${selectedCandidates.length || filteredCandidates.filter(c => c.convocationStatus !== 'draft').length} convocations candidats`
                  : `${selectedJury.length || filteredJury.filter(j => j.convocationStatus !== 'draft').length} convocations jury`
                }
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendConvocations}>
              <Send className="mr-2 h-4 w-4" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
