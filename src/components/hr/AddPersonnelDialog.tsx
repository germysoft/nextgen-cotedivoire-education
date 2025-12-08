import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  UserPlus, User, MapPin, Briefcase, GraduationCap, 
  CreditCard, FileText, Heart, Phone, Mail, Calendar,
  Plus, X, Upload, Save
} from "lucide-react";
import { toast } from "sonner";
import { 
  categoriesPersonnel, 
  statutsPersonnel, 
  typesContrat, 
  departements, 
  postes,
  matieres,
  Diplome
} from "@/types/personnel";
import { generateMatricule } from "@/data/mockPersonnel";

interface AddPersonnelDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddPersonnelDialog({ trigger, onSuccess }: AddPersonnelDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personnel");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Personnel
    civilite: "",
    nom: "",
    prenom: "",
    nomJeuneFille: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "Ivoirienne",
    sexe: "",
    situationMatrimoniale: "",
    nombreEnfants: 0,
    groupeSanguin: "",
    
    // Identité
    numeroCNI: "",
    dateDelivranceCNI: "",
    lieuDelivranceCNI: "",
    dateExpirationCNI: "",
    numeroPasseport: "",
    dateExpirationPasseport: "",
    
    // Contact
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "Côte d'Ivoire",
    telephone: "",
    telephoneSecondaire: "",
    email: "",
    emailProfessionnel: "",
    
    // Urgence
    contactUrgenceNom: "",
    contactUrgenceLien: "",
    contactUrgenceTelephone: "",
    
    // Professionnel
    poste: "",
    departement: "",
    categoriePersonnel: "",
    statut: "",
    typeContrat: "",
    dateEmbauche: "",
    dateFinContrat: "",
    heuresHebdo: 40,
    
    // Enseignant
    matieresPrincipales: [] as string[],
    classesAffectees: "",
    chargeHoraire: 0,
    
    // Financier
    salaireBase: 0,
    modePaiement: "",
    banque: "",
    numeroCompte: "",
    ribIban: "",
    
    // Social
    numeroSecuriteSociale: "",
    numeroCNPS: "",
    situationFiscale: "",
    nombrePartsImpots: 1,
    
    // Congés
    soldeCongesAnnuels: 30,
    soldeRTT: 0,
    
    // Observations
    observations: ""
  });

  const [diplomes, setDiplomes] = useState<Diplome[]>([]);
  const [newDiplome, setNewDiplome] = useState({
    intitule: "",
    etablissement: "",
    anneeObtention: "",
    mention: "",
    niveau: ""
  });

  const [langues, setLangues] = useState<{langue: string, niveau: string}[]>([
    { langue: "Français", niveau: "Natif" }
  ]);

  const [competences, setCompetences] = useState<string[]>([]);
  const [newCompetence, setNewCompetence] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDiplome = () => {
    if (newDiplome.intitule && newDiplome.etablissement && newDiplome.anneeObtention) {
      setDiplomes([...diplomes, { ...newDiplome, id: `D${diplomes.length + 1}` } as Diplome]);
      setNewDiplome({ intitule: "", etablissement: "", anneeObtention: "", mention: "", niveau: "" });
    }
  };

  const removeDiplome = (index: number) => {
    setDiplomes(diplomes.filter((_, i) => i !== index));
  };

  const addCompetence = () => {
    if (newCompetence && !competences.includes(newCompetence)) {
      setCompetences([...competences, newCompetence]);
      setNewCompetence("");
    }
  };

  const removeCompetence = (index: number) => {
    setCompetences(competences.filter((_, i) => i !== index));
  };

  const addLangue = () => {
    setLangues([...langues, { langue: "", niveau: "Intermédiaire" }]);
  };

  const updateLangue = (index: number, field: string, value: string) => {
    const updated = [...langues];
    updated[index] = { ...updated[index], [field]: value };
    setLangues(updated);
  };

  const removeLangue = (index: number) => {
    if (langues.length > 1) {
      setLangues(langues.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    // Validation basique
    if (!formData.nom || !formData.prenom || !formData.dateNaissance) {
      toast.error("Veuillez remplir les champs obligatoires (Nom, Prénom, Date de naissance)");
      return;
    }

    if (!formData.poste || !formData.departement) {
      toast.error("Veuillez remplir les informations professionnelles");
      return;
    }

    const matricule = generateMatricule();
    
    toast.success(`Personnel ${formData.prenom} ${formData.nom} ajouté avec succès`, {
      description: `Matricule: ${matricule}`
    });
    
    setOpen(false);
    onSuccess?.();
    
    // Reset form
    setFormData({
      civilite: "", nom: "", prenom: "", nomJeuneFille: "", dateNaissance: "",
      lieuNaissance: "", nationalite: "Ivoirienne", sexe: "", situationMatrimoniale: "",
      nombreEnfants: 0, groupeSanguin: "", numeroCNI: "", dateDelivranceCNI: "",
      lieuDelivranceCNI: "", dateExpirationCNI: "", numeroPasseport: "",
      dateExpirationPasseport: "", adresse: "", ville: "", codePostal: "",
      pays: "Côte d'Ivoire", telephone: "", telephoneSecondaire: "", email: "",
      emailProfessionnel: "", contactUrgenceNom: "", contactUrgenceLien: "",
      contactUrgenceTelephone: "", poste: "", departement: "", categoriePersonnel: "",
      statut: "", typeContrat: "", dateEmbauche: "", dateFinContrat: "", heuresHebdo: 40,
      matieresPrincipales: [], classesAffectees: "", chargeHoraire: 0, salaireBase: 0,
      modePaiement: "", banque: "", numeroCompte: "", ribIban: "", numeroSecuriteSociale: "",
      numeroCNPS: "", situationFiscale: "", nombrePartsImpots: 1, soldeCongesAnnuels: 30,
      soldeRTT: 0, observations: ""
    });
    setDiplomes([]);
    setPhotoPreview(null);
  };

  const getInitials = () => {
    return `${formData.prenom?.[0] || ''}${formData.nom?.[0] || ''}`.toUpperCase() || 'NP';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nouveau Personnel
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5" />
            Ajouter un Nouveau Personnel
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Photo et infos principales */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={photoPreview || undefined} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor="photo" className="cursor-pointer">
                      <div className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Upload className="h-4 w-4" />
                        Télécharger photo
                      </div>
                      <Input 
                        id="photo" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload}
                      />
                    </Label>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Civilité *</Label>
                      <Select value={formData.civilite} onValueChange={(v) => handleInputChange("civilite", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M.">M.</SelectItem>
                          <SelectItem value="Mme">Mme</SelectItem>
                          <SelectItem value="Mlle">Mlle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nom *</Label>
                      <Input 
                        value={formData.nom} 
                        onChange={(e) => handleInputChange("nom", e.target.value.toUpperCase())}
                        placeholder="NOM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prénom *</Label>
                      <Input 
                        value={formData.prenom} 
                        onChange={(e) => handleInputChange("prenom", e.target.value)}
                        placeholder="Prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom de jeune fille</Label>
                      <Input 
                        value={formData.nomJeuneFille} 
                        onChange={(e) => handleInputChange("nomJeuneFille", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Matricule</Label>
                      <Input value={generateMatricule()} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie *</Label>
                      <Select value={formData.categoriePersonnel} onValueChange={(v) => handleInputChange("categoriePersonnel", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {categoriesPersonnel.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="personnel" className="text-xs">
                  <User className="h-3 w-3 mr-1" />Personnel
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />Contact
                </TabsTrigger>
                <TabsTrigger value="professionnel" className="text-xs">
                  <Briefcase className="h-3 w-3 mr-1" />Emploi
                </TabsTrigger>
                <TabsTrigger value="formation" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />Formation
                </TabsTrigger>
                <TabsTrigger value="financier" className="text-xs">
                  <CreditCard className="h-3 w-3 mr-1" />Financier
                </TabsTrigger>
                <TabsTrigger value="social" className="text-xs">
                  <Heart className="h-3 w-3 mr-1" />Social
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />Documents
                </TabsTrigger>
              </TabsList>

              {/* Onglet Personnel */}
              <TabsContent value="personnel" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">État Civil</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date de naissance *</Label>
                      <Input 
                        type="date" 
                        value={formData.dateNaissance}
                        onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lieu de naissance *</Label>
                      <Input 
                        value={formData.lieuNaissance}
                        onChange={(e) => handleInputChange("lieuNaissance", e.target.value)}
                        placeholder="Ville"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nationalité</Label>
                      <Input 
                        value={formData.nationalite}
                        onChange={(e) => handleInputChange("nationalite", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sexe *</Label>
                      <Select value={formData.sexe} onValueChange={(v) => handleInputChange("sexe", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculin">Masculin</SelectItem>
                          <SelectItem value="Féminin">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Situation matrimoniale</Label>
                      <Select value={formData.situationMatrimoniale} onValueChange={(v) => handleInputChange("situationMatrimoniale", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Célibataire">Célibataire</SelectItem>
                          <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                          <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                          <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
                          <SelectItem value="Union libre">Union libre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre d'enfants</Label>
                      <Input 
                        type="number" 
                        min="0"
                        value={formData.nombreEnfants}
                        onChange={(e) => handleInputChange("nombreEnfants", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Groupe sanguin</Label>
                      <Select value={formData.groupeSanguin} onValueChange={(v) => handleInputChange("groupeSanguin", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(gs => (
                            <SelectItem key={gs} value={gs}>{gs}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pièces d'identité</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>N° CNI</Label>
                      <Input 
                        value={formData.numeroCNI}
                        onChange={(e) => handleInputChange("numeroCNI", e.target.value)}
                        placeholder="CI-XXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de délivrance</Label>
                      <Input 
                        type="date"
                        value={formData.dateDelivranceCNI}
                        onChange={(e) => handleInputChange("dateDelivranceCNI", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lieu de délivrance</Label>
                      <Input 
                        value={formData.lieuDelivranceCNI}
                        onChange={(e) => handleInputChange("lieuDelivranceCNI", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date d'expiration CNI</Label>
                      <Input 
                        type="date"
                        value={formData.dateExpirationCNI}
                        onChange={(e) => handleInputChange("dateExpirationCNI", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>N° Passeport</Label>
                      <Input 
                        value={formData.numeroPasseport}
                        onChange={(e) => handleInputChange("numeroPasseport", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiration Passeport</Label>
                      <Input 
                        type="date"
                        value={formData.dateExpirationPasseport}
                        onChange={(e) => handleInputChange("dateExpirationPasseport", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Contact */}
              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label>Adresse complète *</Label>
                      <Textarea 
                        value={formData.adresse}
                        onChange={(e) => handleInputChange("adresse", e.target.value)}
                        placeholder="Numéro, rue, quartier..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville *</Label>
                      <Input 
                        value={formData.ville}
                        onChange={(e) => handleInputChange("ville", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Code postal / BP</Label>
                      <Input 
                        value={formData.codePostal}
                        onChange={(e) => handleInputChange("codePostal", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pays</Label>
                      <Input 
                        value={formData.pays}
                        onChange={(e) => handleInputChange("pays", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone & Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Téléphone principal *</Label>
                      <Input 
                        value={formData.telephone}
                        onChange={(e) => handleInputChange("telephone", e.target.value)}
                        placeholder="+225 XX XX XX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone secondaire</Label>
                      <Input 
                        value={formData.telephoneSecondaire}
                        onChange={(e) => handleInputChange("telephoneSecondaire", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email personnel *</Label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email professionnel</Label>
                      <Input 
                        type="email"
                        value={formData.emailProfessionnel}
                        onChange={(e) => handleInputChange("emailProfessionnel", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Contact d'urgence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nom & Prénom *</Label>
                      <Input 
                        value={formData.contactUrgenceNom}
                        onChange={(e) => handleInputChange("contactUrgenceNom", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lien de parenté *</Label>
                      <Select value={formData.contactUrgenceLien} onValueChange={(v) => handleInputChange("contactUrgenceLien", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {["Époux/Épouse", "Père", "Mère", "Frère", "Sœur", "Enfant", "Ami(e)", "Autre"].map(l => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone *</Label>
                      <Input 
                        value={formData.contactUrgenceTelephone}
                        onChange={(e) => handleInputChange("contactUrgenceTelephone", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Professionnel */}
              <TabsContent value="professionnel" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Poste & Affectation</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Poste *</Label>
                      <Select value={formData.poste} onValueChange={(v) => handleInputChange("poste", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {postes.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Département *</Label>
                      <Select value={formData.departement} onValueChange={(v) => handleInputChange("departement", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {departements.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Statut *</Label>
                      <Select value={formData.statut} onValueChange={(v) => handleInputChange("statut", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {statutsPersonnel.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type de contrat *</Label>
                      <Select value={formData.typeContrat} onValueChange={(v) => handleInputChange("typeContrat", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {typesContrat.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date d'embauche *</Label>
                      <Input 
                        type="date"
                        value={formData.dateEmbauche}
                        onChange={(e) => handleInputChange("dateEmbauche", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date fin contrat</Label>
                      <Input 
                        type="date"
                        value={formData.dateFinContrat}
                        onChange={(e) => handleInputChange("dateFinContrat", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Heures/semaine</Label>
                      <Input 
                        type="number"
                        value={formData.heuresHebdo}
                        onChange={(e) => handleInputChange("heuresHebdo", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {formData.categoriePersonnel === "Enseignant" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Affectation Enseignant</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Matière(s) principale(s)</Label>
                        <Select onValueChange={(v) => {
                          if (!formData.matieresPrincipales.includes(v)) {
                            handleInputChange("matieresPrincipales", [...formData.matieresPrincipales, v]);
                          }
                        }}>
                          <SelectTrigger><SelectValue placeholder="Ajouter une matière" /></SelectTrigger>
                          <SelectContent>
                            {matieres.map(m => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.matieresPrincipales.map((m, i) => (
                            <Badge key={i} variant="secondary" className="gap-1">
                              {m}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => {
                                handleInputChange("matieresPrincipales", formData.matieresPrincipales.filter((_, idx) => idx !== i));
                              }} />
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Classes affectées</Label>
                        <Input 
                          value={formData.classesAffectees}
                          onChange={(e) => handleInputChange("classesAffectees", e.target.value)}
                          placeholder="Ex: 3ème A, 3ème B, 2nde C"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Charge horaire (h/sem)</Label>
                        <Input 
                          type="number"
                          value={formData.chargeHoraire}
                          onChange={(e) => handleInputChange("chargeHoraire", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Onglet Formation */}
              <TabsContent value="formation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Diplômes</span>
                      <Badge>{diplomes.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      <Input 
                        placeholder="Intitulé du diplôme"
                        value={newDiplome.intitule}
                        onChange={(e) => setNewDiplome({...newDiplome, intitule: e.target.value})}
                      />
                      <Input 
                        placeholder="Établissement"
                        value={newDiplome.etablissement}
                        onChange={(e) => setNewDiplome({...newDiplome, etablissement: e.target.value})}
                      />
                      <Input 
                        placeholder="Année"
                        value={newDiplome.anneeObtention}
                        onChange={(e) => setNewDiplome({...newDiplome, anneeObtention: e.target.value})}
                      />
                      <Select value={newDiplome.niveau} onValueChange={(v) => setNewDiplome({...newDiplome, niveau: v})}>
                        <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAP/BEP">CAP/BEP</SelectItem>
                          <SelectItem value="Baccalauréat">Baccalauréat</SelectItem>
                          <SelectItem value="BTS/DUT">BTS/DUT</SelectItem>
                          <SelectItem value="Licence">Licence</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                          <SelectItem value="Doctorat">Doctorat</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={addDiplome} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {diplomes.length > 0 && (
                      <div className="space-y-2">
                        {diplomes.map((d, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{d.intitule}</p>
                              <p className="text-sm text-muted-foreground">
                                {d.etablissement} - {d.anneeObtention}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{d.niveau}</Badge>
                              <Button variant="ghost" size="icon" onClick={() => removeDiplome(i)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Langues parlées</span>
                      <Button variant="outline" size="sm" onClick={addLangue}>
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {langues.map((l, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input 
                          placeholder="Langue"
                          value={l.langue}
                          onChange={(e) => updateLangue(i, "langue", e.target.value)}
                          className="flex-1"
                        />
                        <Select value={l.niveau} onValueChange={(v) => updateLangue(i, "niveau", v)}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Notions">Notions</SelectItem>
                            <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                            <SelectItem value="Courant">Courant</SelectItem>
                            <SelectItem value="Bilingue">Bilingue</SelectItem>
                            <SelectItem value="Natif">Natif</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeLangue(i)}
                          disabled={langues.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Compétences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ajouter une compétence"
                        value={newCompetence}
                        onChange={(e) => setNewCompetence(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCompetence()}
                      />
                      <Button onClick={addCompetence} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {competences.map((c, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {c}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeCompetence(i)} />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Financier */}
              <TabsContent value="financier" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rémunération</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Salaire de base (FCFA) *</Label>
                      <Input 
                        type="number"
                        value={formData.salaireBase}
                        onChange={(e) => handleInputChange("salaireBase", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mode de paiement *</Label>
                      <Select value={formData.modePaiement} onValueChange={(v) => handleInputChange("modePaiement", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Virement">Virement bancaire</SelectItem>
                          <SelectItem value="Chèque">Chèque</SelectItem>
                          <SelectItem value="Espèces">Espèces</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Coordonnées bancaires</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Banque</Label>
                      <Select value={formData.banque} onValueChange={(v) => handleInputChange("banque", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {["BICICI", "Société Générale CI", "Ecobank", "BOA", "SIB", "NSIA Banque", "UBA", "Coris Bank", "BNI", "BIAO-CI", "Autre"].map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>N° de compte</Label>
                      <Input 
                        value={formData.numeroCompte}
                        onChange={(e) => handleInputChange("numeroCompte", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>RIB / IBAN</Label>
                      <Input 
                        value={formData.ribIban}
                        onChange={(e) => handleInputChange("ribIban", e.target.value)}
                        placeholder="CI93 CIXX XXXX XXXX XXXX XXXX XXXX"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Social */}
              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sécurité Sociale & Fiscalité</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>N° Sécurité Sociale</Label>
                      <Input 
                        value={formData.numeroSecuriteSociale}
                        onChange={(e) => handleInputChange("numeroSecuriteSociale", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>N° CNPS</Label>
                      <Input 
                        value={formData.numeroCNPS}
                        onChange={(e) => handleInputChange("numeroCNPS", e.target.value)}
                        placeholder="CNPS-XXXX-XXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Situation fiscale</Label>
                      <Input 
                        value={formData.situationFiscale}
                        onChange={(e) => handleInputChange("situationFiscale", e.target.value)}
                        placeholder="Ex: Marié 4 parts"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre de parts</Label>
                      <Input 
                        type="number"
                        min="1"
                        value={formData.nombrePartsImpots}
                        onChange={(e) => handleInputChange("nombrePartsImpots", parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Congés</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Solde congés annuels (jours)</Label>
                      <Input 
                        type="number"
                        value={formData.soldeCongesAnnuels}
                        onChange={(e) => handleInputChange("soldeCongesAnnuels", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Solde RTT</Label>
                      <Input 
                        type="number"
                        value={formData.soldeRTT}
                        onChange={(e) => handleInputChange("soldeRTT", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Observations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={formData.observations}
                      onChange={(e) => handleInputChange("observations", e.target.value)}
                      placeholder="Notes, remarques, informations complémentaires..."
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Documents */}
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Documents à joindre</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "CV", icon: FileText },
                        { label: "CNI", icon: User },
                        { label: "Diplômes", icon: GraduationCap },
                        { label: "Contrat de travail", icon: Briefcase },
                        { label: "RIB", icon: CreditCard },
                        { label: "Certificat médical", icon: Heart }
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                          <div className="flex items-center gap-3">
                            <doc.icon className="h-5 w-5 text-muted-foreground" />
                            <span>{doc.label}</span>
                          </div>
                          <Label htmlFor={`doc-${i}`} className="cursor-pointer">
                            <div className="flex items-center gap-1 text-sm text-primary hover:underline">
                              <Upload className="h-4 w-4" />
                              Importer
                            </div>
                            <Input id={`doc-${i}`} type="file" className="hidden" />
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              toast.info("Brouillon enregistré");
            }}>
              Enregistrer brouillon
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Créer le dossier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
