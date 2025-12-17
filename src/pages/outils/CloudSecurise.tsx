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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Cloud, Upload, Download, Folder, File, Search, Filter, Settings,
  Share2, Lock, Unlock, Trash2, MoreHorizontal, Clock, Users, Shield,
  HardDrive, RefreshCw, CheckCircle2, AlertTriangle, Eye, Copy,
  FolderOpen, Plus, ChevronRight, Home, History, Star, Archive,
  Key, ShieldCheck, Database, Wifi, WifiOff, FileUp, Link2
} from "lucide-react";

interface CloudFile {
  id: string;
  name: string;
  type: "folder" | "file";
  mimeType?: string;
  size?: string;
  modifiedAt: string;
  modifiedBy: string;
  path: string;
  shared: boolean;
  encrypted: boolean;
  syncStatus: "synced" | "syncing" | "error" | "pending";
  starred: boolean;
  versions?: number;
}

interface SyncDevice {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet";
  lastSync: string;
  status: "online" | "offline";
}

interface ShareLink {
  id: string;
  fileName: string;
  link: string;
  createdAt: string;
  expiresAt: string;
  accessCount: number;
  password: boolean;
}

const mockFiles: CloudFile[] = [
  { id: "1", name: "Documents Administratifs", type: "folder", modifiedAt: "2024-01-15 10:00", modifiedBy: "Admin", path: "/", shared: false, encrypted: true, syncStatus: "synced", starred: true },
  { id: "2", name: "Scolarité 2024", type: "folder", modifiedAt: "2024-01-14 14:30", modifiedBy: "Secrétariat", path: "/", shared: true, encrypted: true, syncStatus: "synced", starred: false },
  { id: "3", name: "Archives", type: "folder", modifiedAt: "2024-01-10 09:00", modifiedBy: "Admin", path: "/", shared: false, encrypted: true, syncStatus: "synced", starred: false },
  { id: "4", name: "Rapport_annuel_2023.pdf", type: "file", mimeType: "application/pdf", size: "4.2 MB", modifiedAt: "2024-01-15 11:30", modifiedBy: "Directeur", path: "/", shared: true, encrypted: true, syncStatus: "synced", starred: true, versions: 3 },
  { id: "5", name: "Budget_previsionnel.xlsx", type: "file", mimeType: "application/xlsx", size: "1.8 MB", modifiedAt: "2024-01-14 16:00", modifiedBy: "Comptable", path: "/", shared: false, encrypted: true, syncStatus: "syncing", starred: false, versions: 5 },
  { id: "6", name: "Liste_eleves_complet.xlsx", type: "file", mimeType: "application/xlsx", size: "8.5 MB", modifiedAt: "2024-01-13 10:15", modifiedBy: "Secrétariat", path: "/", shared: false, encrypted: true, syncStatus: "synced", starred: false, versions: 12 },
  { id: "7", name: "Photos_ceremonie.zip", type: "file", mimeType: "application/zip", size: "256 MB", modifiedAt: "2024-01-12 15:00", modifiedBy: "Communication", path: "/", shared: true, encrypted: false, syncStatus: "pending", starred: false, versions: 1 },
  { id: "8", name: "Contrats_personnel.zip", type: "file", mimeType: "application/zip", size: "45 MB", modifiedAt: "2024-01-11 09:30", modifiedBy: "RH", path: "/", shared: false, encrypted: true, syncStatus: "synced", starred: true, versions: 2 },
];

const mockDevices: SyncDevice[] = [
  { id: "1", name: "PC Bureau Direction", type: "desktop", lastSync: "2024-01-15 14:30", status: "online" },
  { id: "2", name: "Laptop Secrétariat", type: "desktop", lastSync: "2024-01-15 14:25", status: "online" },
  { id: "3", name: "iPhone Directeur", type: "mobile", lastSync: "2024-01-15 12:00", status: "offline" },
  { id: "4", name: "Tablette Comptabilité", type: "tablet", lastSync: "2024-01-15 10:30", status: "online" },
];

const mockShareLinks: ShareLink[] = [
  { id: "1", fileName: "Rapport_annuel_2023.pdf", link: "https://cloud.ecole.ci/s/abc123", createdAt: "2024-01-15", expiresAt: "2024-02-15", accessCount: 12, password: true },
  { id: "2", fileName: "Photos_ceremonie.zip", link: "https://cloud.ecole.ci/s/def456", createdAt: "2024-01-12", expiresAt: "2024-01-19", accessCount: 45, password: false },
  { id: "3", fileName: "Scolarité 2024", link: "https://cloud.ecole.ci/s/ghi789", createdAt: "2024-01-14", expiresAt: "2024-03-14", accessCount: 8, password: true },
];

export default function CloudSecurise() {
  const [files, setFiles] = useState<CloudFile[]>(mockFiles);
  const [currentPath, setCurrentPath] = useState("/");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CloudFile | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [encryptNewFiles, setEncryptNewFiles] = useState(true);
  const [versionControl, setVersionControl] = useState(true);

  const getFileIcon = (file: CloudFile) => {
    if (file.type === "folder") return <Folder className="h-8 w-8 text-yellow-500" />;
    
    const iconMap: Record<string, JSX.Element> = {
      "application/pdf": <File className="h-8 w-8 text-red-500" />,
      "application/xlsx": <File className="h-8 w-8 text-green-500" />,
      "application/zip": <Archive className="h-8 w-8 text-purple-500" />,
    };
    return iconMap[file.mimeType || ""] || <File className="h-8 w-8 text-blue-500" />;
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "synced": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "syncing": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) && f.path === currentPath
  );

  const storageStats = {
    used: 45.8,
    total: 100,
    percentage: 45.8,
    files: files.filter(f => f.type === "file").length,
    folders: files.filter(f => f.type === "folder").length,
    shared: files.filter(f => f.shared).length,
    encrypted: files.filter(f => f.encrypted).length
  };

  const toggleStar = (id: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
  };

  const toggleEncryption = (id: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, encrypted: !f.encrypted } : f));
    toast.success("Statut de chiffrement modifié");
  };

  const createFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Veuillez entrer un nom de dossier");
      return;
    }
    const newFolder: CloudFile = {
      id: Date.now().toString(),
      name: newFolderName,
      type: "folder",
      modifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      modifiedBy: "Admin",
      path: currentPath,
      shared: false,
      encrypted: encryptNewFiles,
      syncStatus: "synced",
      starred: false
    };
    setFiles([...files, newFolder]);
    setNewFolderName("");
    setShowNewFolderDialog(false);
    toast.success("Dossier créé avec succès");
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    toast.success("Fichier supprimé");
  };

  const syncNow = () => {
    toast.success("Synchronisation en cours...");
    setTimeout(() => {
      toast.success("Synchronisation terminée");
    }, 2000);
  };

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Lien copié dans le presse-papier");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cloud Sécurisé</h1>
          <p className="text-muted-foreground">Stockage chiffré et synchronisation automatique</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={syncNow}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser
          </Button>
          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paramètres du Cloud</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Synchronisation automatique</Label>
                    <p className="text-sm text-muted-foreground">Synchroniser automatiquement les fichiers</p>
                  </div>
                  <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chiffrement par défaut</Label>
                    <p className="text-sm text-muted-foreground">Chiffrer les nouveaux fichiers automatiquement</p>
                  </div>
                  <Switch checked={encryptNewFiles} onCheckedChange={setEncryptNewFiles} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Contrôle de version</Label>
                    <p className="text-sm text-muted-foreground">Conserver l'historique des modifications</p>
                  </div>
                  <Switch checked={versionControl} onCheckedChange={setVersionControl} />
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span>Chiffrement AES-256 activé</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowSettingsDialog(false)}>Fermer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Téléverser
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Téléverser des fichiers</DialogTitle>
              </DialogHeader>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Glissez vos fichiers ici ou</p>
                <Button variant="outline">Parcourir</Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Taille maximale: 500 Mo par fichier
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Switch id="encrypt-upload" defaultChecked />
                <Label htmlFor="encrypt-upload">Chiffrer les fichiers</Label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Annuler</Button>
                <Button onClick={() => { setShowUploadDialog(false); toast.success("Fichiers téléversés"); }}>
                  Téléverser
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
                <HardDrive className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{storageStats.used} Go</p>
                <p className="text-xs text-muted-foreground">sur {storageStats.total} Go</p>
              </div>
            </div>
            <Progress value={storageStats.percentage} className="h-2 mt-3" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <File className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{storageStats.files}</p>
                <p className="text-xs text-muted-foreground">Fichiers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Folder className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{storageStats.folders}</p>
                <p className="text-xs text-muted-foreground">Dossiers</p>
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
                <p className="text-2xl font-bold">{storageStats.shared}</p>
                <p className="text-xs text-muted-foreground">Partagés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{storageStats.encrypted}</p>
                <p className="text-xs text-muted-foreground">Chiffrés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="files">
        <TabsList>
          <TabsTrigger value="files">Fichiers</TabsTrigger>
          <TabsTrigger value="shared">Liens partagés</TabsTrigger>
          <TabsTrigger value="devices">Appareils synchronisés</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentPath("/")}>
                    <Home className="h-4 w-4" />
                  </Button>
                  {currentPath !== "/" && (
                    <>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{currentPath}</span>
                    </>
                  )}
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
                  <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nouveau dossier</DialogTitle>
                      </DialogHeader>
                      <div>
                        <Label>Nom du dossier</Label>
                        <Input 
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Nouveau dossier"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>Annuler</Button>
                        <Button onClick={createFolder}>Créer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Modifié le</TableHead>
                    <TableHead>Par</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Sécurité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map(file => (
                    <TableRow key={file.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            {file.versions && file.versions > 1 && (
                              <p className="text-xs text-muted-foreground">
                                <History className="h-3 w-3 inline mr-1" />
                                {file.versions} versions
                              </p>
                            )}
                          </div>
                          {file.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        </div>
                      </TableCell>
                      <TableCell>{file.size || "-"}</TableCell>
                      <TableCell>{file.modifiedAt}</TableCell>
                      <TableCell>{file.modifiedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSyncStatusIcon(file.syncStatus)}
                          <span className="text-sm capitalize">{file.syncStatus}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {file.encrypted ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <Lock className="h-3 w-3 mr-1" />
                              Chiffré
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Unlock className="h-3 w-3 mr-1" />
                              Non chiffré
                            </Badge>
                          )}
                          {file.shared && (
                            <Badge variant="secondary">
                              <Share2 className="h-3 w-3 mr-1" />
                              Partagé
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => toggleStar(file.id)}>
                            <Star className={`h-4 w-4 ${file.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleEncryption(file.id)}>
                            {file.encrypted ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteFile(file.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredFiles.length === 0 && (
                <div className="text-center py-12">
                  <Cloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun fichier dans ce dossier</p>
                  <Button className="mt-4" onClick={() => setShowUploadDialog(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Téléverser des fichiers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared">
          <Card>
            <CardHeader>
              <CardTitle>Liens de partage actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Lien</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Expire le</TableHead>
                    <TableHead>Accès</TableHead>
                    <TableHead>Protection</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockShareLinks.map(link => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">{link.fileName}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{link.link}</code>
                      </TableCell>
                      <TableCell>{link.createdAt}</TableCell>
                      <TableCell>{link.expiresAt}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{link.accessCount} vues</Badge>
                      </TableCell>
                      <TableCell>
                        {link.password ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Key className="h-3 w-3 mr-1" />
                            Protégé
                          </Badge>
                        ) : (
                          <Badge variant="outline">Public</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => copyShareLink(link.link)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
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

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Appareils synchronisés</CardTitle>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un appareil
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockDevices.map(device => (
                  <Card key={device.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${device.status === "online" ? "bg-green-100" : "bg-gray-100"}`}>
                            {device.status === "online" ? (
                              <Wifi className="h-6 w-6 text-green-600" />
                            ) : (
                              <WifiOff className="h-6 w-6 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{device.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant={device.status === "online" ? "default" : "secondary"}>
                                {device.status === "online" ? "En ligne" : "Hors ligne"}
                              </Badge>
                              <span>•</span>
                              <span>Dernière sync: {device.lastSync}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Téléversement", file: "Budget_previsionnel.xlsx", user: "Comptable", time: "Il y a 5 minutes", icon: Upload },
                  { action: "Modification", file: "Rapport_annuel_2023.pdf", user: "Directeur", time: "Il y a 30 minutes", icon: File },
                  { action: "Partage", file: "Photos_ceremonie.zip", user: "Communication", time: "Il y a 2 heures", icon: Share2 },
                  { action: "Téléchargement", file: "Liste_eleves_complet.xlsx", user: "Secrétariat", time: "Il y a 3 heures", icon: Download },
                  { action: "Création dossier", file: "Archives 2023", user: "Admin", time: "Hier", icon: FolderOpen },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.file} par {activity.user}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
