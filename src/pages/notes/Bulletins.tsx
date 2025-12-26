import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, 
  Download, 
  Send, 
  Eye, 
  Settings2,
  Users,
  CheckCircle2,
  Clock
} from "lucide-react";
import { BulletinTemplateSelector } from "@/components/bulletins/BulletinTemplateSelector";
import { BulletinPreview } from "@/components/bulletins/BulletinPreview";
import { BulletinPDFPreview } from "@/components/bulletins/BulletinPDFPreview";
import { CommentManager } from "@/components/bulletins/CommentManager";
import { generateBulletinPDF, generateMultipleBulletinsPDF } from "@/components/bulletins/BulletinPDFGenerator";
import { mockBulletins } from "@/data/mockBulletins";
import { BulletinTemplate, BulletinGenerationConfig } from "@/types/bulletin";
import { toast } from "sonner";

export default function BulletinsNotesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<BulletinTemplate>('modern');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);
  const [selectedClass, setSelectedClass] = useState("6emeA");
  const [selectedStudent, setSelectedStudent] = useState(mockBulletins[0]);
  const [config, setConfig] = useState<Partial<BulletinGenerationConfig>>({
    includeGraphs: true,
    includeComments: true,
    includeSignatureSpace: true,
    sendToParents: false,
    sendMethod: 'email'
  });
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const handleGenerateSingle = () => {
    generateBulletinPDF(selectedStudent, selectedTemplate);
    toast.success("Bulletin généré avec succès !");
  };

  const handleGenerateMultiple = () => {
    const classBulletins = mockBulletins.filter(b => b.classId === selectedClass);
    generateMultipleBulletinsPDF(classBulletins, selectedTemplate);
    toast.success(`${classBulletins.length} bulletins générés avec succès !`);
  };

  const handleSendToParents = () => {
    toast.success("Bulletins envoyés aux parents par " + (config.sendMethod === 'email' ? 'email' : config.sendMethod === 'sms' ? 'SMS' : 'email et SMS'));
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulletins & Relevés de Notes</h1>
          <p className="text-muted-foreground mt-2">
            Génération et envoi des bulletins scolaires personnalisés
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Bulletins Générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-muted-foreground mt-1">ce trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Envoyés Parents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">765</div>
            <p className="text-xs text-muted-foreground mt-1">90%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              À Signer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground mt-1">en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-blue-600" />
              Modèles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principale */}
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">
            <Download className="mr-2 h-4 w-4" />
            Générer
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="comments">
            <FileText className="mr-2 h-4 w-4" />
            Commentaires
          </TabsTrigger>
        </TabsList>

        {/* Tab Génération */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de génération</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection de base */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Trimestre</Label>
                  <Select 
                    value={selectedTrimester.toString()} 
                    onValueChange={(v) => setSelectedTrimester(parseInt(v) as 1 | 2 | 3)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1er Trimestre</SelectItem>
                      <SelectItem value="2">2ème Trimestre</SelectItem>
                      <SelectItem value="3">3ème Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Classe</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6emeA">6ème A</SelectItem>
                      <SelectItem value="5emeB">5ème B</SelectItem>
                      <SelectItem value="4emeC">4ème C</SelectItem>
                      <SelectItem value="3emeA">3ème A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Élève (aperçu)</Label>
                  <Select 
                    value={selectedStudent.studentId} 
                    onValueChange={(id) => {
                      const student = mockBulletins.find(b => b.studentId === id);
                      if (student) setSelectedStudent(student);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBulletins.map((bulletin) => (
                        <SelectItem key={bulletin.studentId} value={bulletin.studentId}>
                          {bulletin.studentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sélecteur de template */}
              <BulletinTemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />

              {/* Options de génération */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Options d'inclusion</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="graphs" className="cursor-pointer">
                      Inclure les graphiques de performance
                    </Label>
                    <Switch
                      id="graphs"
                      checked={config.includeGraphs}
                      onCheckedChange={(checked) => 
                        setConfig({ ...config, includeGraphs: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments" className="cursor-pointer">
                      Inclure les commentaires des enseignants
                    </Label>
                    <Switch
                      id="comments"
                      checked={config.includeComments}
                      onCheckedChange={(checked) => 
                        setConfig({ ...config, includeComments: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signatures" className="cursor-pointer">
                      Espace pour signatures
                    </Label>
                    <Switch
                      id="signatures"
                      checked={config.includeSignatureSpace}
                      onCheckedChange={(checked) => 
                        setConfig({ ...config, includeSignatureSpace: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Options d'envoi */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Envoi automatique aux parents</h3>
                    <p className="text-sm text-muted-foreground">
                      Envoyer les bulletins immédiatement après génération
                    </p>
                  </div>
                  <Switch
                    checked={config.sendToParents}
                    onCheckedChange={(checked) => 
                      setConfig({ ...config, sendToParents: checked })
                    }
                  />
                </div>
                
                {config.sendToParents && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                    <Label>Méthode d'envoi</Label>
                    <Select 
                      value={config.sendMethod} 
                      onValueChange={(value: 'email' | 'sms' | 'both') => 
                        setConfig({ ...config, sendMethod: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email uniquement</SelectItem>
                        <SelectItem value="sms">SMS uniquement</SelectItem>
                        <SelectItem value="both">Email + SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <Button onClick={() => setShowPDFPreview(true)} variant="outline" size="lg">
                  <Eye className="mr-2 h-4 w-4" />
                  Aperçu PDF
                </Button>
                <Button onClick={handleGenerateSingle} variant="outline" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Générer 1 bulletin
                </Button>
                <Button onClick={handleGenerateMultiple} size="lg">
                  <Users className="mr-2 h-4 w-4" />
                  Générer toute la classe
                </Button>
              </div>
              
              {config.sendToParents && (
                <Button 
                  onClick={handleSendToParents} 
                  className="w-full" 
                  variant="secondary"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer aux parents
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Aperçu */}
        <TabsContent value="preview">
          <BulletinPreview bulletin={selectedStudent} />
        </TabsContent>

        {/* Tab Commentaires */}
        <TabsContent value="comments">
          <CommentManager
            studentName={selectedStudent.studentName}
            onSave={(comments) => {
              console.log("Commentaires enregistrés:", comments);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Modal d'aperçu PDF */}
      <BulletinPDFPreview
        open={showPDFPreview}
        onOpenChange={setShowPDFPreview}
        bulletin={selectedStudent}
        template={selectedTemplate}
      />
    </div>
  );
}
