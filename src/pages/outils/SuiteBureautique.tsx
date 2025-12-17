import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText, FileSpreadsheet, Presentation, Image, Plus, Search, Filter,
  Download, Share2, Trash2, Clock, Star, FolderOpen, Grid, List,
  Edit, Eye, Copy, MoreHorizontal, Users, Lock, Unlock, FileUp,
  ChevronRight, Home, Folder
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "document" | "spreadsheet" | "presentation" | "image";
  size: string;
  modifiedAt: string;
  modifiedBy: string;
  shared: boolean;
  starred: boolean;
  locked: boolean;
  folder: string;
}

interface Folder {
  id: string;
  name: string;
  parent: string | null;
  documentsCount: number;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Rapport annuel 2024.docx", type: "document", size: "2.4 MB", modifiedAt: "2024-01-15 14:30", modifiedBy: "Admin", shared: true, starred: true, locked: false, folder: "root" },
  { id: "2", name: "Budget prévisionnel.xlsx", type: "spreadsheet", size: "1.8 MB", modifiedAt: "2024-01-14 10:15", modifiedBy: "Comptable", shared: false, starred: false, locked: true, folder: "root" },
  { id: "3", name: "Présentation conseil.pptx", type: "presentation", size: "5.2 MB", modifiedAt: "2024-01-13 16:45", modifiedBy: "Directeur", shared: true, starred: true, locked: false, folder: "root" },
  { id: "4", name: "Photo cérémonie.jpg", type: "image", size: "3.1 MB", modifiedAt: "2024-01-12 09:00", modifiedBy: "Secrétaire", shared: false, starred: false, locked: false, folder: "root" },
  { id: "5", name: "Règlement intérieur.docx", type: "document", size: "856 KB", modifiedAt: "2024-01-11 11:20", modifiedBy: "Admin", shared: true, starred: false, locked: true, folder: "administratif" },
  { id: "6", name: "Liste élèves 2024.xlsx", type: "spreadsheet", size: "4.5 MB", modifiedAt: "2024-01-10 08:30", modifiedBy: "Secrétaire", shared: false, starred: true, locked: false, folder: "scolarite" },
  { id: "7", name: "Compte-rendu réunion.docx", type: "document", size: "345 KB", modifiedAt: "2024-01-09 15:00", modifiedBy: "Directeur", shared: true, starred: false, locked: false, folder: "reunions" },
  { id: "8", name: "Planning événements.pptx", type: "presentation", size: "2.8 MB", modifiedAt: "2024-01-08 13:45", modifiedBy: "Responsable", shared: true, starred: false, locked: false, folder: "evenements" },
];

const mockFolders: Folder[] = [
  { id: "root", name: "Racine", parent: null, documentsCount: 4 },
  { id: "administratif", name: "Documents Administratifs", parent: "root", documentsCount: 1 },
  { id: "scolarite", name: "Scolarité", parent: "root", documentsCount: 1 },
  { id: "reunions", name: "Réunions", parent: "root", documentsCount: 1 },
  { id: "evenements", name: "Événements", parent: "root", documentsCount: 1 },
  { id: "rh", name: "Ressources Humaines", parent: "root", documentsCount: 0 },
  { id: "finances", name: "Finances", parent: "root", documentsCount: 0 },
];

const documentTemplates = [
  { id: "1", name: "Lettre officielle", type: "document", description: "Modèle de lettre administrative" },
  { id: "2", name: "Rapport mensuel", type: "document", description: "Template de rapport" },
  { id: "3", name: "Budget Excel", type: "spreadsheet", description: "Feuille de calcul budget" },
  { id: "4", name: "Présentation standard", type: "presentation", description: "Slides professionnels" },
  { id: "5", name: "Tableau de suivi", type: "spreadsheet", description: "Suivi des activités" },
  { id: "6", name: "Compte-rendu", type: "document", description: "Template réunion" },
];

export default function SuiteBureautique() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [currentFolder, setCurrentFolder] = useState("root");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showNewDocDialog, setShowNewDocDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<"document" | "spreadsheet" | "presentation">("document");
  const [newFolderName, setNewFolderName] = useState("");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-8 w-8 text-blue-500" />;
      case "spreadsheet": return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case "presentation": return <Presentation className="h-8 w-8 text-orange-500" />;
      case "image": return <Image className="h-8 w-8 text-purple-500" />;
      default: return <FileText className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      document: "bg-blue-100 text-blue-800",
      spreadsheet: "bg-green-100 text-green-800",
      presentation: "bg-orange-100 text-orange-800",
      image: "bg-purple-100 text-purple-800"
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesFolder = doc.folder === currentFolder;
    return matchesSearch && matchesType && matchesFolder;
  });

  const currentFolderData = mockFolders.find(f => f.id === currentFolder);
  const subFolders = mockFolders.filter(f => f.parent === currentFolder);

  const getBreadcrumb = () => {
    const path: Folder[] = [];
    let current = currentFolderData;
    while (current) {
      path.unshift(current);
      current = mockFolders.find(f => f.id === current?.parent);
    }
    return path;
  };

  const handleCreateDocument = () => {
    if (!newDocName.trim()) {
      toast.error("Veuillez entrer un nom de document");
      return;
    }
    const extension = newDocType === "document" ? ".docx" : newDocType === "spreadsheet" ? ".xlsx" : ".pptx";
    const newDoc: Document = {
      id: Date.now().toString(),
      name: newDocName + extension,
      type: newDocType,
      size: "0 KB",
      modifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      modifiedBy: "Admin",
      shared: false,
      starred: false,
      locked: false,
      folder: currentFolder
    };
    setDocuments([newDoc, ...documents]);
    setNewDocName("");
    setShowNewDocDialog(false);
    toast.success("Document créé avec succès");
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Veuillez entrer un nom de dossier");
      return;
    }
    toast.success(`Dossier "${newFolderName}" créé avec succès`);
    setNewFolderName("");
    setShowNewFolderDialog(false);
  };

  const toggleStar = (docId: string) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === docId ? { ...doc, starred: !doc.starred } : doc
    ));
  };

  const toggleLock = (docId: string) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === docId ? { ...doc, locked: !doc.locked } : doc
    ));
    toast.success("Statut de verrouillage modifié");
  };

  const deleteDocument = (docId: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
    toast.success("Document supprimé");
  };

  const stats = {
    total: documents.length,
    documents: documents.filter(d => d.type === "document").length,
    spreadsheets: documents.filter(d => d.type === "spreadsheet").length,
    presentations: documents.filter(d => d.type === "presentation").length,
    images: documents.filter(d => d.type === "image").length,
    shared: documents.filter(d => d.shared).length,
    starred: documents.filter(d => d.starred).length,
    storageUsed: 78
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suite Bureautique</h1>
          <p className="text-muted-foreground">Créez et gérez vos documents en ligne</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileUp className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importer des fichiers</DialogTitle>
              </DialogHeader>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Glissez vos fichiers ici ou</p>
                <Button variant="outline">Parcourir</Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Formats supportés: .docx, .xlsx, .pptx, .pdf, .jpg, .png
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Annuler</Button>
                <Button onClick={() => { setShowUploadDialog(false); toast.success("Fichiers importés"); }}>
                  Importer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un dossier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nom du dossier</Label>
                  <Input 
                    value={newFolderName} 
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nouveau dossier"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>Annuler</Button>
                <Button onClick={handleCreateFolder}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewDocDialog} onOpenChange={setShowNewDocDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau document</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="blank">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="blank">Document vierge</TabsTrigger>
                  <TabsTrigger value="template">Depuis un modèle</TabsTrigger>
                </TabsList>
                <TabsContent value="blank" className="space-y-4">
                  <div>
                    <Label>Type de document</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <Card 
                        className={`cursor-pointer transition-all ${newDocType === "document" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setNewDocType("document")}
                      >
                        <CardContent className="p-4 text-center">
                          <FileText className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                          <p className="font-medium">Document</p>
                          <p className="text-xs text-muted-foreground">.docx</p>
                        </CardContent>
                      </Card>
                      <Card 
                        className={`cursor-pointer transition-all ${newDocType === "spreadsheet" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setNewDocType("spreadsheet")}
                      >
                        <CardContent className="p-4 text-center">
                          <FileSpreadsheet className="h-10 w-10 mx-auto text-green-500 mb-2" />
                          <p className="font-medium">Feuille de calcul</p>
                          <p className="text-xs text-muted-foreground">.xlsx</p>
                        </CardContent>
                      </Card>
                      <Card 
                        className={`cursor-pointer transition-all ${newDocType === "presentation" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setNewDocType("presentation")}
                      >
                        <CardContent className="p-4 text-center">
                          <Presentation className="h-10 w-10 mx-auto text-orange-500 mb-2" />
                          <p className="font-medium">Présentation</p>
                          <p className="text-xs text-muted-foreground">.pptx</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div>
                    <Label>Nom du document</Label>
                    <Input 
                      value={newDocName} 
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="Sans titre"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="template">
                  <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                    {documentTemplates.map(template => (
                      <Card key={template.id} className="cursor-pointer hover:ring-2 hover:ring-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            {template.type === "document" && <FileText className="h-8 w-8 text-blue-500" />}
                            {template.type === "spreadsheet" && <FileSpreadsheet className="h-8 w-8 text-green-500" />}
                            {template.type === "presentation" && <Presentation className="h-8 w-8 text-orange-500" />}
                            <div>
                              <p className="font-medium">{template.name}</p>
                              <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewDocDialog(false)}>Annuler</Button>
                <Button onClick={handleCreateDocument}>Créer</Button>
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
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total fichiers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.documents}</p>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.spreadsheets}</p>
                <p className="text-xs text-muted-foreground">Feuilles de calcul</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Presentation className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.presentations}</p>
                <p className="text-xs text-muted-foreground">Présentations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Share2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.shared}</p>
                <p className="text-xs text-muted-foreground">Partagés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Espace de stockage</span>
            <span className="text-sm text-muted-foreground">{stats.storageUsed}% utilisé</span>
          </div>
          <Progress value={stats.storageUsed} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">7.8 Go sur 10 Go utilisés</p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              {getBreadcrumb().map((folder, index) => (
                <div key={folder.id} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCurrentFolder(folder.id)}
                    className={index === getBreadcrumb().length - 1 ? "font-bold" : ""}
                  >
                    {folder.id === "root" ? <Home className="h-4 w-4" /> : folder.name}
                  </Button>
                </div>
              ))}
            </div>
            
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="spreadsheet">Feuilles de calcul</SelectItem>
                  <SelectItem value="presentation">Présentations</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Subfolders */}
          {subFolders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Dossiers</h3>
              <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
                {subFolders.map(folder => (
                  <Card 
                    key={folder.id} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setCurrentFolder(folder.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Folder className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm truncate">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">{folder.documentsCount} éléments</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <h3 className="text-sm font-medium mb-3">Fichiers</h3>
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredDocuments.map(doc => (
                <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      {getTypeIcon(doc.type)}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => toggleStar(doc.id)}
                        >
                          <Star className={`h-4 w-4 ${doc.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => toggleLock(doc.id)}
                        >
                          {doc.locked ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <p className="font-medium text-sm truncate mb-1">{doc.name}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>{doc.modifiedAt.split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className={getTypeBadge(doc.type)}>
                        {doc.type}
                      </Badge>
                      {doc.shared && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Partagé
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Ouvrir
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Modifié le</TableHead>
                  <TableHead>Par</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getTypeIcon(doc.type)}
                        <span className="font-medium">{doc.name}</span>
                        {doc.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getTypeBadge(doc.type)}>
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.modifiedAt}</TableCell>
                    <TableCell>{doc.modifiedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {doc.shared && <Badge variant="outline"><Users className="h-3 w-3 mr-1" />Partagé</Badge>}
                        {doc.locked && <Badge variant="destructive"><Lock className="h-3 w-3 mr-1" />Verrouillé</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteDocument(doc.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun document trouvé</p>
              <Button className="mt-4" onClick={() => setShowNewDocDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
