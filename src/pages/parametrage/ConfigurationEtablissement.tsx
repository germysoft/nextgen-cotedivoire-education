import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Building2, MapPin, User, BookOpen, Palette, Shield, Save, 
  Upload, Lock, Unlock, History, AlertTriangle, Check, Image,
  Phone, Mail, Globe, Calendar, Clock, FileSignature, FileDown, Languages
} from "lucide-react";
import { generateConfigurationPDF } from "@/components/etablissement/ConfigurationPDFGenerator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEtablissement } from "@/contexts/EtablissementContext";
import { 
  TypeEtablissement, 
  StatutJuridique, 
  FonctionResponsable,
  TypeEvaluation,
  Cycle,
  LangueDefaut,
  listeDRENA,
  villesCoteDIvoire,
  communesAbidjan,
} from "@/types/etablissement";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ConfigurationEtablissement = () => {
  const { 
    configuration, 
    updateSection, 
    isLocked, 
    lockConfiguration, 
    unlockConfiguration,
    getHistorique,
    isConfigured 
  } = useEtablissement();

  const [lockPassword, setLockPassword] = useState("");
  const [unlockPassword, setUnlockPassword] = useState("");
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const cachetInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'signatureScanee' | 'cachetScane'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2 Mo");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (field === 'logo') {
          updateSection('identite', { logo: base64 });
        } else if (field === 'signatureScanee') {
          updateSection('responsable', { signatureScanee: base64 });
        } else if (field === 'cachetScane') {
          updateSection('parametresVisuels', { cachetScane: base64 });
        }
        toast.success("Image téléchargée avec succès");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLock = () => {
    if (lockPassword.length < 4) {
      toast.error("Le mot de passe doit contenir au moins 4 caractères");
      return;
    }
    lockConfiguration(lockPassword);
    setLockPassword("");
    setShowLockDialog(false);
    toast.success("Configuration verrouillée");
  };

  const handleUnlock = () => {
    if (unlockConfiguration(unlockPassword)) {
      setUnlockPassword("");
      setShowUnlockDialog(false);
      toast.success("Configuration déverrouillée");
    } else {
      toast.error("Mot de passe incorrect");
    }
  };

  const handleSave = () => {
    if (!configuration.identite.nom) {
      toast.error("Le nom de l'établissement est obligatoire");
      return;
    }
    toast.success("Configuration sauvegardée avec succès");
  };

  const handleExportPDF = async () => {
    if (!configuration.identite.nom) {
      toast.error("Veuillez d'abord configurer le nom de l'établissement");
      return;
    }
    try {
      await generateConfigurationPDF(configuration);
      toast.success("PDF généré avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération du PDF");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration de l'Établissement</h1>
          <p className="text-muted-foreground mt-2">
            Configurez les informations officielles de votre établissement scolaire
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConfigured ? (
            <Badge variant="default" className="bg-green-500">
              <Check className="h-3 w-3 mr-1" />
              Configuré
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Non configuré
            </Badge>
          )}
          
          {isLocked ? (
            <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Lock className="h-4 w-4 mr-2" />
                  Verrouillé
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Déverrouiller la configuration</DialogTitle>
                  <DialogDescription>
                    Entrez le mot de passe pour modifier la configuration
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                />
                <DialogFooter>
                  <Button onClick={handleUnlock}>Déverrouiller</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Unlock className="h-4 w-4 mr-2" />
                  Verrouiller
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verrouiller la configuration</DialogTitle>
                  <DialogDescription>
                    Définissez un mot de passe pour empêcher les modifications
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="password"
                  placeholder="Mot de passe (4 caractères minimum)"
                  value={lockPassword}
                  onChange={(e) => setLockPassword(e.target.value)}
                />
                <DialogFooter>
                  <Button onClick={handleLock}>Verrouiller</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>

          <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                Historique
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Historique des modifications</DialogTitle>
                <DialogDescription>
                  Liste de toutes les modifications apportées à la configuration
                </DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Champ modifié</TableHead>
                    <TableHead>Ancienne valeur</TableHead>
                    <TableHead>Nouvelle valeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getHistorique().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Aucune modification enregistrée
                      </TableCell>
                    </TableRow>
                  ) : (
                    getHistorique().slice(-50).reverse().map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {format(new Date(entry.dateModification), "dd/MM/yyyy HH:mm", { locale: fr })}
                        </TableCell>
                        <TableCell>{entry.utilisateur}</TableCell>
                        <TableCell className="font-mono text-xs">{entry.champModifie}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{entry.ancienneValeur || "-"}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{entry.nouvelleValeur || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSave} disabled={isLocked}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      {isLocked && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Lock className="h-5 w-5" />
              <span className="font-medium">Configuration verrouillée</span>
              <span className="text-sm">- Les modifications sont désactivées</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="identite" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="identite" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Identité</span>
          </TabsTrigger>
          <TabsTrigger value="administration" className="flex items-center gap-2">
            <FileSignature className="h-4 w-4" />
            <span className="hidden sm:inline">Administration</span>
          </TabsTrigger>
          <TabsTrigger value="localisation" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="responsable" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Responsable</span>
          </TabsTrigger>
          <TabsTrigger value="pedagogie" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Pédagogie</span>
          </TabsTrigger>
          <TabsTrigger value="visuels" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Visuels</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Identité */}
        <TabsContent value="identite">
          <Card>
            <CardHeader>
              <CardTitle>Identité de l'Établissement</CardTitle>
              <CardDescription>
                Informations officielles de votre établissement scolaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-4">
                  <Label className="text-base font-semibold">Logo de l'établissement</Label>
                  <div 
                    className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted/20"
                    onClick={() => !isLocked && logoInputRef.current?.click()}
                  >
                    {configuration.identite.logo ? (
                      <img 
                        src={configuration.identite.logo} 
                        alt="Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="h-10 w-10 mx-auto mb-2" />
                        <span className="text-sm">Cliquez pour télécharger</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    disabled={isLocked}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isLocked}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {configuration.identite.logo ? 'Modifier' : 'Télécharger'}
                    </Button>
                    {configuration.identite.logo && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateSection('identite', { logo: undefined })}
                        disabled={isLocked}
                        className="text-destructive hover:text-destructive"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">PNG ou JPG, max 2 Mo<br/>Format carré recommandé</p>
                </div>

                {/* Infos principales */}
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom officiel de l'établissement *</Label>
                      <Input
                        id="nom"
                        value={configuration.identite.nom}
                        onChange={(e) => updateSection('identite', { nom: e.target.value })}
                        placeholder="Ex: Groupe Scolaire Excellence"
                        disabled={isLocked}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sigle">Sigle / Acronyme</Label>
                      <Input
                        id="sigle"
                        value={configuration.identite.sigle || ""}
                        onChange={(e) => updateSection('identite', { sigle: e.target.value })}
                        placeholder="Ex: GSE"
                        disabled={isLocked}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type d'établissement *</Label>
                      <Select
                        value={configuration.identite.type}
                        onValueChange={(value: TypeEtablissement) => updateSection('identite', { type: value })}
                        disabled={isLocked}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="prive">Privé Laïc</SelectItem>
                          <SelectItem value="prive_confessionnel">Privé Confessionnel</SelectItem>
                          <SelectItem value="confessionnel">Confessionnel</SelectItem>
                          <SelectItem value="technique">Technique</SelectItem>
                          <SelectItem value="professionnel">Professionnel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="anneeCreation">Année de création</Label>
                      <Input
                        id="anneeCreation"
                        type="number"
                        value={configuration.identite.anneeCreation || ""}
                        onChange={(e) => updateSection('identite', { anneeCreation: parseInt(e.target.value) || undefined })}
                        placeholder="Ex: 2010"
                        disabled={isLocked}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="devise">Devise / Slogan</Label>
                    <Input
                      id="devise"
                      value={configuration.identite.devise || ""}
                      onChange={(e) => updateSection('identite', { devise: e.target.value })}
                      placeholder="Ex: L'excellence par le travail"
                      disabled={isLocked}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Administration */}
        <TabsContent value="administration">
          <Card>
            <CardHeader>
              <CardTitle>Informations Administratives</CardTitle>
              <CardDescription>
                Documents officiels et informations légales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroAutorisation">N° Autorisation d'ouverture</Label>
                  <Input
                    id="numeroAutorisation"
                    value={configuration.administration.numeroAutorisation || ""}
                    onChange={(e) => updateSection('administration', { numeroAutorisation: e.target.value })}
                    placeholder="Ex: 2020/AO/MENA/0123"
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateCreation">Date de création</Label>
                  <Input
                    id="dateCreation"
                    type="date"
                    value={configuration.administration.dateCreation || ""}
                    onChange={(e) => updateSection('administration', { dateCreation: e.target.value })}
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codeEtablissement">Code établissement</Label>
                  <Input
                    id="codeEtablissement"
                    value={configuration.administration.codeEtablissement || ""}
                    onChange={(e) => updateSection('administration', { codeEtablissement: e.target.value })}
                    placeholder="Ex: 001234"
                    disabled={isLocked}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ministereTutelle">Ministère de tutelle</Label>
                  <Input
                    id="ministereTutelle"
                    value={configuration.administration.ministereTutelle}
                    onChange={(e) => updateSection('administration', { ministereTutelle: e.target.value })}
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspection">DRENA / Inspection</Label>
                  <Select
                    value={configuration.administration.inspection || ""}
                    onValueChange={(value) => updateSection('administration', { inspection: value })}
                    disabled={isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la DRENA" />
                    </SelectTrigger>
                    <SelectContent>
                      {listeDRENA.map((drena) => (
                        <SelectItem key={drena} value={drena}>{drena}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statutJuridique">Statut juridique</Label>
                  <Select
                    value={configuration.administration.statutJuridique}
                    onValueChange={(value: StatutJuridique) => updateSection('administration', { statutJuridique: value })}
                    disabled={isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etat">État</SelectItem>
                      <SelectItem value="entreprise_individuelle">Entreprise Individuelle</SelectItem>
                      <SelectItem value="sarl">SARL</SelectItem>
                      <SelectItem value="sa">SA</SelectItem>
                      <SelectItem value="association">Association</SelectItem>
                      <SelectItem value="fondation">Fondation</SelectItem>
                      <SelectItem value="cooperative">Coopérative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroAgrement">N° Agrément</Label>
                  <Input
                    id="numeroAgrement"
                    value={configuration.administration.numeroAgrement || ""}
                    onChange={(e) => updateSection('administration', { numeroAgrement: e.target.value })}
                    placeholder="N° d'agrément"
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroContribuable">N° Contribuable</Label>
                  <Input
                    id="numeroContribuable"
                    value={configuration.administration.numeroContribuable || ""}
                    onChange={(e) => updateSection('administration', { numeroContribuable: e.target.value })}
                    placeholder="N° Contribuable"
                    disabled={isLocked}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Localisation & Contacts */}
        <TabsContent value="localisation">
          <Card>
            <CardHeader>
              <CardTitle>Localisation & Contacts</CardTitle>
              <CardDescription>
                Adresse et coordonnées de l'établissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pays">Pays</Label>
                  <Input
                    id="pays"
                    value={configuration.localisation.pays}
                    onChange={(e) => updateSection('localisation', { pays: e.target.value })}
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville *</Label>
                  <Select
                    value={configuration.localisation.ville}
                    onValueChange={(value) => updateSection('localisation', { ville: value })}
                    disabled={isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {villesCoteDIvoire.map((ville) => (
                        <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commune">Commune</Label>
                  {configuration.localisation.ville === 'Abidjan' ? (
                    <Select
                      value={configuration.localisation.commune}
                      onValueChange={(value) => updateSection('localisation', { commune: value })}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la commune" />
                      </SelectTrigger>
                      <SelectContent>
                        {communesAbidjan.map((commune) => (
                          <SelectItem key={commune} value={commune}>{commune}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="commune"
                      value={configuration.localisation.commune}
                      onChange={(e) => updateSection('localisation', { commune: e.target.value })}
                      placeholder="Commune"
                      disabled={isLocked}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quartier">Quartier</Label>
                  <Input
                    id="quartier"
                    value={configuration.localisation.quartier || ""}
                    onChange={(e) => updateSection('localisation', { quartier: e.target.value })}
                    placeholder="Ex: Riviera 2"
                    disabled={isLocked}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adresseComplete">Adresse complète</Label>
                  <Textarea
                    id="adresseComplete"
                    value={configuration.localisation.adresseComplete || ""}
                    onChange={(e) => updateSection('localisation', { adresseComplete: e.target.value })}
                    placeholder="Adresse détaillée..."
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boitePostale">Boîte postale</Label>
                  <Input
                    id="boitePostale"
                    value={configuration.localisation.boitePostale || ""}
                    onChange={(e) => updateSection('localisation', { boitePostale: e.target.value })}
                    placeholder="Ex: BP 1234 Abidjan 01"
                    disabled={isLocked}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephonePrincipal" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Téléphone principal *
                  </Label>
                  <Input
                    id="telephonePrincipal"
                    value={configuration.localisation.telephonePrincipal}
                    onChange={(e) => updateSection('localisation', { telephonePrincipal: e.target.value })}
                    placeholder="+225 XX XX XX XX XX"
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephoneSecondaire" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Téléphone secondaire
                  </Label>
                  <Input
                    id="telephoneSecondaire"
                    value={configuration.localisation.telephoneSecondaire || ""}
                    onChange={(e) => updateSection('localisation', { telephoneSecondaire: e.target.value })}
                    placeholder="+225 XX XX XX XX XX"
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailOfficiel" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email officiel *
                  </Label>
                  <Input
                    id="emailOfficiel"
                    type="email"
                    value={configuration.localisation.emailOfficiel}
                    onChange={(e) => updateSection('localisation', { emailOfficiel: e.target.value })}
                    placeholder="contact@etablissement.ci"
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteWeb" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Site web
                  </Label>
                  <Input
                    id="siteWeb"
                    value={configuration.localisation.siteWeb || ""}
                    onChange={(e) => updateSection('localisation', { siteWeb: e.target.value })}
                    placeholder="www.etablissement.ci"
                    disabled={isLocked}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Responsable */}
        <TabsContent value="responsable">
          <Card>
            <CardHeader>
              <CardTitle>Responsable / Fondateur</CardTitle>
              <CardDescription>
                Informations du responsable principal de l'établissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Signature */}
                <div className="flex flex-col items-center space-y-4">
                  <Label>Signature scannée</Label>
                  <div 
                    className="w-48 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted/30"
                    onClick={() => !isLocked && signatureInputRef.current?.click()}
                  >
                    {configuration.responsable.signatureScanee ? (
                      <img 
                        src={configuration.responsable.signatureScanee} 
                        alt="Signature" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <FileSignature className="h-8 w-8 mx-auto mb-1" />
                        <span className="text-xs">Ajouter signature</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={signatureInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'signatureScanee')}
                    disabled={isLocked}
                  />
                </div>

                {/* Infos responsable */}
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomResponsable">Nom *</Label>
                      <Input
                        id="nomResponsable"
                        value={configuration.responsable.nom}
                        onChange={(e) => updateSection('responsable', { nom: e.target.value })}
                        placeholder="Nom de famille"
                        disabled={isLocked}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenomsResponsable">Prénoms *</Label>
                      <Input
                        id="prenomsResponsable"
                        value={configuration.responsable.prenoms}
                        onChange={(e) => updateSection('responsable', { prenoms: e.target.value })}
                        placeholder="Prénoms"
                        disabled={isLocked}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fonctionResponsable">Fonction *</Label>
                    <Select
                      value={configuration.responsable.fonction}
                      onValueChange={(value: FonctionResponsable) => updateSection('responsable', { fonction: value })}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la fonction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fondateur">Fondateur</SelectItem>
                        <SelectItem value="directeur">Directeur</SelectItem>
                        <SelectItem value="proviseur">Proviseur</SelectItem>
                        <SelectItem value="directeur_etudes">Directeur des Études</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="censeur">Censeur</SelectItem>
                        <SelectItem value="surveillant_general">Surveillant Général</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telResponsable" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Téléphone *
                      </Label>
                      <Input
                        id="telResponsable"
                        value={configuration.responsable.telephone}
                        onChange={(e) => updateSection('responsable', { telephone: e.target.value })}
                        placeholder="+225 XX XX XX XX XX"
                        disabled={isLocked}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailResponsable" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email *
                      </Label>
                      <Input
                        id="emailResponsable"
                        type="email"
                        value={configuration.responsable.email}
                        onChange={(e) => updateSection('responsable', { email: e.target.value })}
                        placeholder="responsable@etablissement.ci"
                        disabled={isLocked}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres Pédagogiques */}
        <TabsContent value="pedagogie">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Pédagogiques</CardTitle>
              <CardDescription>
                Configuration des cycles, évaluations et options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anneeScolaire" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Année scolaire en cours
                  </Label>
                  <Input
                    id="anneeScolaire"
                    value={configuration.parametresPedagogiques.anneeScolaireEnCours}
                    onChange={(e) => updateSection('parametresPedagogiques', { anneeScolaireEnCours: e.target.value })}
                    placeholder="2024-2025"
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="langueDefaut" className="flex items-center gap-2">
                    <Languages className="h-4 w-4" /> Langue par défaut
                  </Label>
                  <Select
                    value={configuration.parametresPedagogiques.langueParDefaut || 'fr'}
                    onValueChange={(value: LangueDefaut) => updateSection('parametresPedagogiques', { langueParDefaut: value })}
                    disabled={isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">
                        <div className="flex items-center gap-2">
                          <span>🇫🇷</span> Français
                        </div>
                      </SelectItem>
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <span>🇬🇧</span> English
                        </div>
                      </SelectItem>
                      <SelectItem value="es">
                        <div className="flex items-center gap-2">
                          <span>🇪🇸</span> Español
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeEvaluation">Type d'évaluation</Label>
                  <Select
                    value={configuration.parametresPedagogiques.typeEvaluation}
                    onValueChange={(value: TypeEvaluation) => updateSection('parametresPedagogiques', { typeEvaluation: value })}
                    disabled={isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trimestre">Trimestriel</SelectItem>
                      <SelectItem value="semestre">Semestriel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noteMaximale">Note maximale</Label>
                  <Input
                    id="noteMaximale"
                    type="number"
                    value={configuration.parametresPedagogiques.noteMaximale}
                    onChange={(e) => updateSection('parametresPedagogiques', { noteMaximale: parseInt(e.target.value) || 20 })}
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moyennePassage">Moyenne de passage</Label>
                  <Input
                    id="moyennePassage"
                    type="number"
                    value={configuration.parametresPedagogiques.moyennePassage || ""}
                    onChange={(e) => updateSection('parametresPedagogiques', { moyennePassage: parseInt(e.target.value) || undefined })}
                    placeholder="10"
                    disabled={isLocked}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="moyenneConduite" className="text-base">Moyenne de conduite prise en compte</Label>
                  <p className="text-sm text-muted-foreground">
                    Inclure la moyenne de conduite dans le calcul des moyennes générales
                  </p>
                </div>
                <Switch
                  id="moyenneConduite"
                  checked={configuration.parametresPedagogiques.moyenneConduitePriseEnCompte || false}
                  onCheckedChange={(checked) => updateSection('parametresPedagogiques', { moyenneConduitePriseEnCompte: checked })}
                  disabled={isLocked}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Heure de début des cours
                  </Label>
                  <Input
                    type="time"
                    value={configuration.parametresPedagogiques.heureDebutCours}
                    onChange={(e) => updateSection('parametresPedagogiques', { heureDebutCours: e.target.value })}
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Heure de fin des cours
                  </Label>
                  <Input
                    type="time"
                    value={configuration.parametresPedagogiques.heureFinCours}
                    onChange={(e) => updateSection('parametresPedagogiques', { heureFinCours: e.target.value })}
                    disabled={isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Durée récréation (minutes)</Label>
                  <Input
                    type="number"
                    value={configuration.parametresPedagogiques.dureeRecreation}
                    onChange={(e) => updateSection('parametresPedagogiques', { dureeRecreation: parseInt(e.target.value) || 15 })}
                    disabled={isLocked}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Cycles pris en charge</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { value: 'prescolaire', label: 'Préscolaire' },
                    { value: 'primaire', label: 'Primaire' },
                    { value: 'premier_cycle', label: '1er Cycle (6è-3è)' },
                    { value: 'second_cycle', label: '2nd Cycle (2de-Tle)' },
                    { value: 'technique', label: 'Technique' },
                    { value: 'professionnel', label: 'Professionnel' },
                  ].map((cycle) => (
                    <div key={cycle.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={cycle.value}
                        checked={configuration.parametresPedagogiques.cyclesPrisEnCharge.includes(cycle.value as Cycle)}
                        onCheckedChange={(checked) => {
                          const cycles = checked
                            ? [...configuration.parametresPedagogiques.cyclesPrisEnCharge, cycle.value as Cycle]
                            : configuration.parametresPedagogiques.cyclesPrisEnCharge.filter(c => c !== cycle.value);
                          updateSection('parametresPedagogiques', { cyclesPrisEnCharge: cycles });
                        }}
                        disabled={isLocked}
                      />
                      <Label htmlFor={cycle.value} className="text-sm">{cycle.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Langues vivantes 2 (LV2)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'espagnol', label: 'Espagnol' },
                      { value: 'allemand', label: 'Allemand' },
                      { value: 'chinois', label: 'Chinois' },
                      { value: 'arabe', label: 'Arabe' },
                    ].map((lv2) => (
                      <div key={lv2.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lv2-${lv2.value}`}
                          checked={configuration.parametresPedagogiques.gestionLV2.includes(lv2.value as any)}
                          onCheckedChange={(checked) => {
                            const lv2s = checked
                              ? [...configuration.parametresPedagogiques.gestionLV2, lv2.value as any]
                              : configuration.parametresPedagogiques.gestionLV2.filter(l => l !== lv2.value);
                            updateSection('parametresPedagogiques', { gestionLV2: lv2s });
                          }}
                          disabled={isLocked}
                        />
                        <Label htmlFor={`lv2-${lv2.value}`} className="text-sm">{lv2.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Options disponibles</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'art_plastique', label: 'Arts plastiques' },
                      { value: 'musique', label: 'Musique' },
                      { value: 'theatre', label: 'Théâtre' },
                      { value: 'informatique', label: 'Informatique' },
                      { value: 'eps', label: 'EPS renforcée' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`option-${option.value}`}
                          checked={configuration.parametresPedagogiques.options.includes(option.value as any)}
                          onCheckedChange={(checked) => {
                            const options = checked
                              ? [...configuration.parametresPedagogiques.options, option.value as any]
                              : configuration.parametresPedagogiques.options.filter(o => o !== option.value);
                            updateSection('parametresPedagogiques', { options });
                          }}
                          disabled={isLocked}
                        />
                        <Label htmlFor={`option-${option.value}`} className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Jours ouvrables</Label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: 'lundi', label: 'Lundi' },
                    { value: 'mardi', label: 'Mardi' },
                    { value: 'mercredi', label: 'Mercredi' },
                    { value: 'jeudi', label: 'Jeudi' },
                    { value: 'vendredi', label: 'Vendredi' },
                    { value: 'samedi', label: 'Samedi' },
                  ].map((jour) => (
                    <div key={jour.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`jour-${jour.value}`}
                        checked={configuration.parametresPedagogiques.joursOuvrables.includes(jour.value as any)}
                        onCheckedChange={(checked) => {
                          const jours = checked
                            ? [...configuration.parametresPedagogiques.joursOuvrables, jour.value as any]
                            : configuration.parametresPedagogiques.joursOuvrables.filter(j => j !== jour.value);
                          updateSection('parametresPedagogiques', { joursOuvrables: jours });
                        }}
                        disabled={isLocked}
                      />
                      <Label htmlFor={`jour-${jour.value}`} className="text-sm">{jour.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Signataire des documents pédagogiques */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Signataire des bulletins et documents pédagogiques</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomSignataire">Nom complet du signataire</Label>
                    <Input
                      id="nomSignataire"
                      value={configuration.signataire?.nomSignataire || ""}
                      onChange={(e) => updateSection('signataire', { nomSignataire: e.target.value })}
                      placeholder="M. KOUASSI Jean-Pierre"
                      disabled={isLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fonctionSignataire">Fonction du signataire</Label>
                    <Select
                      value={configuration.signataire?.fonctionSignataire || "directeur"}
                      onValueChange={(value: FonctionResponsable) => updateSection('signataire', { fonctionSignataire: value })}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la fonction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fondateur">Fondateur</SelectItem>
                        <SelectItem value="directeur">Directeur</SelectItem>
                        <SelectItem value="proviseur">Proviseur</SelectItem>
                        <SelectItem value="directeur_etudes">Directeur des Études</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="censeur">Censeur</SelectItem>
                        <SelectItem value="surveillant_general">Surveillant Général</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ministereTutelleDocuments">Ministère de tutelle (sur documents)</Label>
                    <Input
                      id="ministereTutelleDocuments"
                      value={configuration.signataire?.ministereTutelleDocuments || ""}
                      onChange={(e) => updateSection('signataire', { ministereTutelleDocuments: e.target.value })}
                      placeholder="Ministère de l'Éducation Nationale et de l'Alphabétisation"
                      disabled={isLocked}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ces informations seront utilisées sur les bulletins, attestations et autres documents pédagogiques officiels.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres Visuels */}
        <TabsContent value="visuels">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Visuels & Documents</CardTitle>
              <CardDescription>
                Personnalisation de l'apparence des documents officiels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="couleurPrincipale">Couleur principale</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="couleurPrincipale"
                        type="color"
                        value={configuration.parametresVisuels.couleurPrincipale}
                        onChange={(e) => updateSection('parametresVisuels', { couleurPrincipale: e.target.value })}
                        className="w-20 h-10 cursor-pointer"
                        disabled={isLocked}
                      />
                      <Input
                        value={configuration.parametresVisuels.couleurPrincipale}
                        onChange={(e) => updateSection('parametresVisuels', { couleurPrincipale: e.target.value })}
                        placeholder="#1e40af"
                        className="flex-1"
                        disabled={isLocked}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="couleurSecondaire">Couleur secondaire</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="couleurSecondaire"
                        type="color"
                        value={configuration.parametresVisuels.couleurSecondaire || "#059669"}
                        onChange={(e) => updateSection('parametresVisuels', { couleurSecondaire: e.target.value })}
                        className="w-20 h-10 cursor-pointer"
                        disabled={isLocked}
                      />
                      <Input
                        value={configuration.parametresVisuels.couleurSecondaire || ""}
                        onChange={(e) => updateSection('parametresVisuels', { couleurSecondaire: e.target.value })}
                        placeholder="#059669"
                        className="flex-1"
                        disabled={isLocked}
                      />
                    </div>
                  </div>
                </div>

                {/* Cachet */}
                <div className="flex flex-col items-center space-y-4">
                  <Label className="text-base font-semibold">Cachet scanné de l'établissement</Label>
                  <div 
                    className="w-40 h-40 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted/20"
                    onClick={() => !isLocked && cachetInputRef.current?.click()}
                  >
                    {configuration.parametresVisuels.cachetScane ? (
                      <img 
                        src={configuration.parametresVisuels.cachetScane} 
                        alt="Cachet" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="h-10 w-10 mx-auto mb-2" />
                        <span className="text-sm">Cliquez pour télécharger</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={cachetInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'cachetScane')}
                    disabled={isLocked}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => cachetInputRef.current?.click()}
                      disabled={isLocked}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {configuration.parametresVisuels.cachetScane ? 'Modifier' : 'Télécharger'}
                    </Button>
                    {configuration.parametresVisuels.cachetScane && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateSection('parametresVisuels', { cachetScane: undefined })}
                        disabled={isLocked}
                        className="text-destructive hover:text-destructive"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">PNG avec transparence recommandé<br/>Sera affiché sur les bulletins et documents</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="piedDePage">Pied de page officiel</Label>
                <Textarea
                  id="piedDePage"
                  value={configuration.parametresVisuels.piedDePage}
                  onChange={(e) => updateSection('parametresVisuels', { piedDePage: e.target.value })}
                  placeholder="Texte apparaissant en bas des bulletins, attestations et diplômes..."
                  rows={3}
                  disabled={isLocked}
                />
                <p className="text-xs text-muted-foreground">
                  Ce texte sera automatiquement ajouté sur tous les documents officiels
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filigrane">Texte en filigrane (optionnel)</Label>
                <Input
                  id="filigrane"
                  value={configuration.parametresVisuels.filigrane || ""}
                  onChange={(e) => updateSection('parametresVisuels', { filigrane: e.target.value })}
                  placeholder="Ex: DOCUMENT OFFICIEL"
                  disabled={isLocked}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policeDocuments">Police des documents</Label>
                <Select
                  value={configuration.parametresVisuels.policeDocuments || "Times New Roman"}
                  onValueChange={(value) => updateSection('parametresVisuels', { policeDocuments: value })}
                  disabled={isLocked}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Calibri">Calibri</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Aperçu */}
              <div className="space-y-4">
                <Label>Aperçu des couleurs</Label>
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    borderColor: configuration.parametresVisuels.couleurPrincipale,
                    borderWidth: '2px'
                  }}
                >
                  <div 
                    className="p-4 rounded text-white text-center font-bold mb-4"
                    style={{ backgroundColor: configuration.parametresVisuels.couleurPrincipale }}
                  >
                    {configuration.identite.nom || "Nom de l'établissement"}
                  </div>
                  <div 
                    className="p-2 rounded text-white text-center text-sm"
                    style={{ backgroundColor: configuration.parametresVisuels.couleurSecondaire || "#059669" }}
                  >
                    {configuration.identite.devise || "Devise de l'établissement"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité & Traçabilité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date de création :</span>
              <p className="font-medium">
                {format(new Date(configuration.securite.dateCreationConfig), "dd MMMM yyyy à HH:mm", { locale: fr })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Créé par :</span>
              <p className="font-medium">{configuration.securite.utilisateurCreation}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Dernière modification :</span>
              <p className="font-medium">
                {configuration.securite.derniereModification
                  ? format(new Date(configuration.securite.derniereModification), "dd MMMM yyyy à HH:mm", { locale: fr })
                  : "Aucune"
                }
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Modifications totales :</span>
              <p className="font-medium">{configuration.securite.historiqueModifications.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationEtablissement;
