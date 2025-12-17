import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText, Plus, Search, Filter, Download, Edit, Trash2, Eye, Copy,
  Star, Tag, Calendar, User, FolderOpen, Mail, Printer, Share2,
  FileCheck, Clock, Sparkles, Wand2, Variable, Check
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
  starred: boolean;
  tags: string[];
}

interface GeneratedDocument {
  id: string;
  templateName: string;
  generatedAt: string;
  generatedBy: string;
  recipient: string;
  status: "draft" | "sent" | "printed";
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Lettre de convocation parents",
    category: "scolarite",
    description: "Convocation des parents pour entretien avec la direction",
    content: `Objet : Convocation à un entretien

Madame, Monsieur {{NOM_PARENT}},

Nous vous prions de bien vouloir vous présenter à l'établissement le {{DATE_RDV}} à {{HEURE_RDV}} pour un entretien concernant votre enfant {{NOM_ELEVE}} inscrit(e) en classe de {{CLASSE}}.

Motif : {{MOTIF}}

Veuillez vous munir de votre pièce d'identité.

Dans l'attente de vous rencontrer, veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

Le Directeur,
{{NOM_DIRECTEUR}}`,
    variables: ["NOM_PARENT", "DATE_RDV", "HEURE_RDV", "NOM_ELEVE", "CLASSE", "MOTIF", "NOM_DIRECTEUR"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    createdBy: "Admin",
    usageCount: 156,
    starred: true,
    tags: ["parents", "convocation", "urgent"]
  },
  {
    id: "2",
    name: "Certificat de scolarité",
    category: "administratif",
    description: "Attestation officielle d'inscription de l'élève",
    content: `CERTIFICAT DE SCOLARITÉ

Le Directeur de l'établissement {{NOM_ETABLISSEMENT}} certifie que :

L'élève : {{NOM_COMPLET_ELEVE}}
Né(e) le : {{DATE_NAISSANCE}}
Matricule : {{MATRICULE}}

Est régulièrement inscrit(e) en classe de {{CLASSE}} pour l'année scolaire {{ANNEE_SCOLAIRE}}.

Ce certificat est délivré pour servir et valoir ce que de droit.

Fait à {{VILLE}}, le {{DATE_JOUR}}

Le Directeur,
{{NOM_DIRECTEUR}}

Signature et cachet`,
    variables: ["NOM_ETABLISSEMENT", "NOM_COMPLET_ELEVE", "DATE_NAISSANCE", "MATRICULE", "CLASSE", "ANNEE_SCOLAIRE", "VILLE", "DATE_JOUR", "NOM_DIRECTEUR"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-12",
    createdBy: "Secrétariat",
    usageCount: 342,
    starred: true,
    tags: ["certificat", "officiel", "scolarité"]
  },
  {
    id: "3",
    name: "Avis d'exclusion temporaire",
    category: "discipline",
    description: "Notification d'exclusion temporaire pour motif disciplinaire",
    content: `AVIS D'EXCLUSION TEMPORAIRE

Madame, Monsieur {{NOM_PARENT}},

Nous avons le regret de vous informer que votre enfant {{NOM_ELEVE}}, élève en classe de {{CLASSE}}, a fait l'objet d'une mesure d'exclusion temporaire de {{DUREE}} jours.

Motif de la sanction : {{MOTIF_SANCTION}}

Cette mesure prendra effet du {{DATE_DEBUT}} au {{DATE_FIN}} inclus.

Durant cette période, l'élève devra :
- Effectuer les travaux scolaires qui lui seront transmis
- Se présenter à l'établissement le {{DATE_RETOUR}} à {{HEURE_RETOUR}}

Un entretien avec la direction sera organisé à son retour.

Le Surveillant Général,
{{NOM_SURVEILLANT}}`,
    variables: ["NOM_PARENT", "NOM_ELEVE", "CLASSE", "DUREE", "MOTIF_SANCTION", "DATE_DEBUT", "DATE_FIN", "DATE_RETOUR", "HEURE_RETOUR", "NOM_SURVEILLANT"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
    createdBy: "Surveillant",
    usageCount: 28,
    starred: false,
    tags: ["discipline", "exclusion", "sanction"]
  },
  {
    id: "4",
    name: "Attestation de travail",
    category: "rh",
    description: "Attestation d'emploi pour le personnel",
    content: `ATTESTATION DE TRAVAIL

Je soussigné(e), {{NOM_DIRECTEUR}}, Directeur de l'établissement {{NOM_ETABLISSEMENT}}, atteste que :

Madame/Monsieur : {{NOM_EMPLOYE}}
Fonction : {{FONCTION}}
Depuis le : {{DATE_EMBAUCHE}}

Est employé(e) au sein de notre établissement en qualité de {{TYPE_CONTRAT}}.

Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.

Fait à {{VILLE}}, le {{DATE_JOUR}}

Le Directeur,
{{NOM_DIRECTEUR}}

Signature et cachet`,
    variables: ["NOM_DIRECTEUR", "NOM_ETABLISSEMENT", "NOM_EMPLOYE", "FONCTION", "DATE_EMBAUCHE", "TYPE_CONTRAT", "VILLE", "DATE_JOUR"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-10",
    createdBy: "RH",
    usageCount: 67,
    starred: false,
    tags: ["rh", "attestation", "emploi"]
  },
  {
    id: "5",
    name: "Bulletin de notes - Observations",
    category: "pedagogie",
    description: "Modèle d'observations pour les bulletins",
    content: `OBSERVATIONS TRIMESTRIELLES

Élève : {{NOM_ELEVE}}
Classe : {{CLASSE}}
Trimestre : {{TRIMESTRE}}

Moyenne générale : {{MOYENNE}}/20
Rang : {{RANG}} sur {{EFFECTIF}}

Appréciation du Conseil de Classe :
{{APPRECIATION_GENERALE}}

Observations du Professeur Principal :
{{OBSERVATIONS_PP}}

Décision du Conseil :
{{DECISION_CONSEIL}}

Signature du Chef d'Établissement :
{{NOM_DIRECTEUR}}`,
    variables: ["NOM_ELEVE", "CLASSE", "TRIMESTRE", "MOYENNE", "RANG", "EFFECTIF", "APPRECIATION_GENERALE", "OBSERVATIONS_PP", "DECISION_CONSEIL", "NOM_DIRECTEUR"],
    createdAt: "2024-01-02",
    updatedAt: "2024-01-14",
    createdBy: "Pédagogie",
    usageCount: 890,
    starred: true,
    tags: ["bulletin", "notes", "observations"]
  },
  {
    id: "6",
    name: "Demande d'autorisation sortie",
    category: "parascolaire",
    description: "Formulaire d'autorisation pour sortie pédagogique",
    content: `DEMANDE D'AUTORISATION DE SORTIE

Chers Parents,

Une sortie pédagogique est organisée pour les élèves de {{CLASSE}} :

Destination : {{DESTINATION}}
Date : {{DATE_SORTIE}}
Heure de départ : {{HEURE_DEPART}}
Heure de retour prévue : {{HEURE_RETOUR}}
Encadrement : {{ENCADRANTS}}
Frais de participation : {{FRAIS}} FCFA

-------- COUPON RÉPONSE À RETOURNER --------

Je soussigné(e) {{NOM_PARENT}}, parent de l'élève {{NOM_ELEVE}}, classe de {{CLASSE}} :

☐ Autorise mon enfant à participer à la sortie
☐ N'autorise pas mon enfant à participer

Date : _____________ Signature : _____________`,
    variables: ["CLASSE", "DESTINATION", "DATE_SORTIE", "HEURE_DEPART", "HEURE_RETOUR", "ENCADRANTS", "FRAIS", "NOM_PARENT", "NOM_ELEVE"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-11",
    createdBy: "Admin",
    usageCount: 45,
    starred: false,
    tags: ["sortie", "autorisation", "parents"]
  }
];

const categories = [
  { id: "all", name: "Toutes les catégories" },
  { id: "scolarite", name: "Scolarité" },
  { id: "administratif", name: "Administratif" },
  { id: "discipline", name: "Discipline" },
  { id: "rh", name: "Ressources Humaines" },
  { id: "pedagogie", name: "Pédagogie" },
  { id: "parascolaire", name: "Parascolaire" },
  { id: "finance", name: "Finance" }
];

const mockGeneratedDocs: GeneratedDocument[] = [
  { id: "1", templateName: "Certificat de scolarité", generatedAt: "2024-01-15 10:30", generatedBy: "Admin", recipient: "Kouassi Aya", status: "printed" },
  { id: "2", templateName: "Lettre de convocation parents", generatedAt: "2024-01-15 09:15", generatedBy: "Secrétariat", recipient: "M. Koné", status: "sent" },
  { id: "3", templateName: "Attestation de travail", generatedAt: "2024-01-14 16:00", generatedBy: "RH", recipient: "Jean Dupont", status: "draft" },
  { id: "4", templateName: "Certificat de scolarité", generatedAt: "2024-01-14 14:30", generatedBy: "Admin", recipient: "Traoré Ibrahim", status: "printed" },
];

export default function ModelesCourriers() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    description: "",
    content: "",
    tags: ""
  });

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleStar = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, starred: !t.starred } : t
    ));
  };

  const openGenerateDialog = (template: Template) => {
    setSelectedTemplate(template);
    setVariableValues({});
    setGeneratedContent("");
    setShowGenerateDialog(true);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues({ ...variableValues, [variable]: value });
  };

  const generateDocument = () => {
    if (!selectedTemplate) return;
    
    let content = selectedTemplate.content;
    Object.entries(variableValues).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });
    setGeneratedContent(content);
    toast.success("Document généré avec succès");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Contenu copié dans le presse-papier");
  };

  const createTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Extract variables from content
    const variableMatches = newTemplate.content.match(/{{(\w+)}}/g) || [];
    const variables = variableMatches.map(v => v.replace(/{{|}}/g, ''));

    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name,
      category: newTemplate.category,
      description: newTemplate.description,
      content: newTemplate.content,
      variables: [...new Set(variables)],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: "Admin",
      usageCount: 0,
      starred: false,
      tags: newTemplate.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    setTemplates([template, ...templates]);
    setNewTemplate({ name: "", category: "", description: "", content: "", tags: "" });
    setShowTemplateDialog(false);
    toast.success("Modèle créé avec succès");
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Modèle supprimé");
  };

  const stats = {
    total: templates.length,
    starred: templates.filter(t => t.starred).length,
    mostUsed: templates.reduce((max, t) => t.usageCount > max ? t.usageCount : max, 0),
    totalGenerated: mockGeneratedDocs.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modèles de Courriers</h1>
          <p className="text-muted-foreground">Bibliothèque de modèles avec variables dynamiques</p>
        </div>
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau modèle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau modèle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du modèle *</Label>
                  <Input 
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="Lettre de convocation..."
                  />
                </div>
                <div>
                  <Label>Catégorie</Label>
                  <Select 
                    value={newTemplate.category}
                    onValueChange={(v) => setNewTemplate({...newTemplate, category: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.id !== "all").map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input 
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  placeholder="Brève description du modèle..."
                />
              </div>
              <div>
                <Label>Tags (séparés par des virgules)</Label>
                <Input 
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate({...newTemplate, tags: e.target.value})}
                  placeholder="parents, convocation, urgent..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Contenu du modèle *</Label>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Variable className="h-3 w-3" />
                    Variables: {"{{NOM_VARIABLE}}"}
                  </div>
                </div>
                <Textarea 
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  placeholder="Tapez votre modèle ici. Utilisez {{NOM_VARIABLE}} pour les champs dynamiques..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Astuce :</p>
                      <p className="text-muted-foreground">
                        Utilisez des variables entre doubles accolades pour créer des champs dynamiques.
                        Exemple: {"{{NOM_ELEVE}}"}, {"{{DATE}}"}, {"{{CLASSE}}"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Annuler</Button>
              <Button onClick={createTemplate}>
                <Check className="h-4 w-4 mr-2" />
                Créer le modèle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total modèles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.starred}</p>
                <p className="text-xs text-muted-foreground">Favoris</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <FileCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.mostUsed}</p>
                <p className="text-xs text-muted-foreground">Plus utilisé</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Wand2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalGenerated}</p>
                <p className="text-xs text-muted-foreground">Documents générés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="history">Documents générés</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bibliothèque de modèles</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-10 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map(template => (
                  <Card key={template.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => toggleStar(template.id)}
                        >
                          <Star className={`h-4 w-4 ${template.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                      </div>
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(c => c.id === template.category)?.name || template.category}
                        </Badge>
                        {template.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Variable className="h-3 w-3" />
                          {template.variables.length} variables
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCheck className="h-3 w-3" />
                          {template.usageCount} utilisations
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => openGenerateDialog(template)}
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Générer
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun modèle trouvé</p>
                  <Button className="mt-4" onClick={() => setShowTemplateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un modèle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des documents générés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockGeneratedDocs.map(doc => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.templateName}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {doc.recipient}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {doc.generatedAt}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Par {doc.generatedBy}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            doc.status === "printed" ? "default" :
                            doc.status === "sent" ? "secondary" : "outline"
                          }>
                            {doc.status === "printed" ? "Imprimé" :
                             doc.status === "sent" ? "Envoyé" : "Brouillon"}
                          </Badge>
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Printer className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Document Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Générer un document : {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="grid grid-cols-2 gap-6">
              {/* Variables Form */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Variable className="h-4 w-4" />
                  Variables à remplir
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable}>
                      <Label>{variable.replace(/_/g, ' ')}</Label>
                      <Input 
                        value={variableValues[variable] || ""}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        placeholder={`Entrez ${variable.toLowerCase().replace(/_/g, ' ')}...`}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={generateDocument} className="w-full">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Générer le document
                </Button>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Aperçu
                </h3>
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {generatedContent || selectedTemplate.content}
                    </pre>
                  </CardContent>
                </Card>
                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimer
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
