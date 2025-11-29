import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Upload, X, Download, Printer, Search, Save, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Guardian {
  id: string;
  type: "father" | "mother" | "tutor";
  firstName: string;
  lastName: string;
  relationship: string;
  profession: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  canPickup: boolean;
}

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("admin");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [guardians, setGuardians] = useState<Guardian[]>([
    { id: "1", type: "father", firstName: "", lastName: "", relationship: "Père", profession: "", phone1: "", phone2: "", email: "", address: "", canPickup: true },
    { id: "2", type: "mother", firstName: "", lastName: "", relationship: "Mère", profession: "", phone1: "", phone2: "", email: "", address: "", canPickup: true },
  ]);
  const [documents, setDocuments] = useState<{ name: string; type: string }[]>([]);

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

  const addGuardian = () => {
    const newGuardian: Guardian = {
      id: Date.now().toString(),
      type: "tutor",
      firstName: "",
      lastName: "",
      relationship: "Tuteur",
      profession: "",
      phone1: "",
      phone2: "",
      email: "",
      address: "",
      canPickup: false
    };
    setGuardians([...guardians, newGuardian]);
  };

  const removeGuardian = (id: string) => {
    setGuardians(guardians.filter(g => g.id !== id));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map(file => ({
      name: file.name,
      type: file.type
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const handleSubmit = () => {
    toast({
      title: "Élève enregistré",
      description: "Le dossier de l'élève a été créé avec succès.",
    });
    setOpen(false);
  };

  const handlePrint = () => {
    toast({
      title: "Impression",
      description: "Génération de la fiche élève en cours...",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Élève
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Dossier Élève - Inscription / Réinscription</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-8 w-full">
            <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
            <TabsTrigger value="personal" className="text-xs">Personnel</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs">Coordonnées</TabsTrigger>
            <TabsTrigger value="schooling" className="text-xs">Scolarité</TabsTrigger>
            <TabsTrigger value="guardians" className="text-xs">Parents</TabsTrigger>
            <TabsTrigger value="medical" className="text-xs">Médical</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
            <TabsTrigger value="observations" className="text-xs">Observations</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            {/* 1️⃣ Informations Administratives */}
            <TabsContent value="admin" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Numéro Matricule</Label>
                  <Input defaultValue="2024/AUTO" placeholder="Auto-généré" />
                </div>
                <div className="space-y-2">
                  <Label>Année Scolaire *</Label>
                  <Select defaultValue="2024-2025">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Statut *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inscription">Inscription</SelectItem>
                      <SelectItem value="reinscription">Réinscription</SelectItem>
                      <SelectItem value="transfert">Transfert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Redoublant ?</Label>
                  <RadioGroup defaultValue="non" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oui" id="redoublant-oui" />
                      <Label htmlFor="redoublant-oui">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non" id="redoublant-non" />
                      <Label htmlFor="redoublant-non">Non</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Affecté</Label>
                  <RadioGroup defaultValue="oui" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oui" id="affecte-oui" />
                      <Label htmlFor="affecte-oui">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non" id="affecte-non" />
                      <Label htmlFor="affecte-non">Non</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Décision d'affectation</Label>
                  <Input placeholder="Numéro de décision" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Moyen de Paiement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="especes">Espèces</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="virement">Virement</SelectItem>
                    <SelectItem value="mobile">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Élève Boursier ?</Label>
                <div className="flex gap-4">
                  <RadioGroup defaultValue="non" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oui" id="boursier-oui" />
                      <Label htmlFor="boursier-oui">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non" id="boursier-non" />
                      <Label htmlFor="boursier-non">Non</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Détails Bourse</Label>
                <Textarea placeholder="Organisme, montant, durée..." rows={3} />
              </div>
            </TabsContent>

            {/* 2️⃣ Informations Personnelles */}
            <TabsContent value="personal" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input placeholder="Nom de famille" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Prénoms *</Label>
                    <Input placeholder="Prénom(s)" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Sexe *</Label>
                    <RadioGroup className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="sexe-m" />
                        <Label htmlFor="sexe-m">Masculin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="sexe-f" />
                        <Label htmlFor="sexe-f">Féminin</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de Naissance *</Label>
                      <Input type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Lieu de Naissance *</Label>
                      <Input placeholder="Ville, Pays" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Nationalité *</Label>
                    <Input placeholder="Nationalité" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>N° Extrait de Naissance</Label>
                      <Input placeholder="Numéro" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de Délivrance</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Photo Élève</Label>
                  <Card className="p-4">
                    <CardContent className="p-0 flex flex-col items-center gap-3">
                      {photoPreview ? (
                        <div className="relative">
                          <img src={photoPreview} alt="Photo élève" className="w-40 h-40 object-cover rounded-md" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => setPhotoPreview(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-40 h-40 border-2 border-dashed rounded-md flex items-center justify-center bg-muted">
                          <span className="text-muted-foreground text-sm">Aucune photo</span>
                        </div>
                      )}
                      <label htmlFor="photo-upload">
                        <Button type="button" size="sm" variant="outline" asChild>
                          <span className="cursor-pointer">
                            <Upload className="mr-2 h-3 w-3" />
                            Importer
                          </span>
                        </Button>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 3️⃣ Coordonnées & Adresse */}
            <TabsContent value="contact" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Adresse de Résidence *</Label>
                <Input placeholder="Adresse complète" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quartier *</Label>
                  <Input placeholder="Quartier" required />
                </div>
                <div className="space-y-2">
                  <Label>Ville *</Label>
                  <Input placeholder="Ville" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Téléphone Élève</Label>
                  <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label>Email Élève</Label>
                  <Input type="email" placeholder="eleve@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transport Scolaire</Label>
                <RadioGroup defaultValue="non" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oui" id="transport-oui" />
                    <Label htmlFor="transport-oui">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="transport-non" />
                    <Label htmlFor="transport-non">Non</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ligne / Circuit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ligne1">Ligne 1 - Cocody</SelectItem>
                      <SelectItem value="ligne2">Ligne 2 - Yopougon</SelectItem>
                      <SelectItem value="ligne3">Ligne 3 - Plateau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Résidence</Label>
                  <RadioGroup defaultValue="externe" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="interne" id="residence-interne" />
                      <Label htmlFor="residence-interne">Internat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="externe" id="residence-externe" />
                      <Label htmlFor="residence-externe">Externe</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* 4️⃣ Scolarité */}
            <TabsContent value="schooling" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Cycle *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cycle1">1er Cycle</SelectItem>
                    <SelectItem value="cycle2">2nd Cycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Niveau *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6ème</SelectItem>
                      <SelectItem value="5">5ème</SelectItem>
                      <SelectItem value="4">4ème</SelectItem>
                      <SelectItem value="3">3ème</SelectItem>
                      <SelectItem value="2">2nde</SelectItem>
                      <SelectItem value="1">1ère</SelectItem>
                      <SelectItem value="T">Terminale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Classe Actuelle *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6A">6ème A</SelectItem>
                      <SelectItem value="6B">6ème B</SelectItem>
                      <SelectItem value="5A">5ème A</SelectItem>
                      <SelectItem value="5B">5ème B</SelectItem>
                      <SelectItem value="4A">4ème A</SelectItem>
                      <SelectItem value="3A">3ème A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>LV2 (Langue Vivante 2)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allemand">Allemand</SelectItem>
                    <SelectItem value="espagnol">Espagnol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Option Artistique</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musique">Musique</SelectItem>
                    <SelectItem value="arts">Arts Plastiques</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Établissement d'Origine</Label>
                <Input placeholder="Nom de l'établissement précédent" />
              </div>

              <div className="space-y-2">
                <Label>Date d'Entrée dans l'Établissement</Label>
                <Input type="date" />
              </div>
            </TabsContent>

            {/* 5️⃣ Parents / Tuteurs */}
            <TabsContent value="guardians" className="space-y-4 mt-0">
              <Tabs defaultValue="father" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="father">Père</TabsTrigger>
                  <TabsTrigger value="mother">Mère</TabsTrigger>
                  <TabsTrigger value="tutors">Tuteurs</TabsTrigger>
                </TabsList>

                <TabsContent value="father" className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input placeholder="Nom du père" />
                    </div>
                    <div className="space-y-2">
                      <Label>Prénoms</Label>
                      <Input placeholder="Prénoms" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profession</Label>
                    <Input placeholder="Profession" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Téléphone 1 *</Label>
                      <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone 2</Label>
                      <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@exemple.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input placeholder="Adresse (si différente)" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="father-pickup" defaultChecked />
                    <Label htmlFor="father-pickup">Autorisé à récupérer l'élève</Label>
                  </div>
                </TabsContent>

                <TabsContent value="mother" className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input placeholder="Nom de la mère" />
                    </div>
                    <div className="space-y-2">
                      <Label>Prénoms</Label>
                      <Input placeholder="Prénoms" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profession</Label>
                    <Input placeholder="Profession" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Téléphone 1 *</Label>
                      <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone 2</Label>
                      <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@exemple.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input placeholder="Adresse (si différente)" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mother-pickup" defaultChecked />
                    <Label htmlFor="mother-pickup">Autorisée à récupérer l'élève</Label>
                  </div>
                </TabsContent>

                <TabsContent value="tutors" className="space-y-4 mt-4">
                  {guardians.filter(g => g.type === "tutor").map((tutor) => (
                    <Card key={tutor.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="font-semibold">Tuteur / Responsable</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeGuardian(tutor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input placeholder="Nom" />
                          </div>
                          <div className="space-y-2">
                            <Label>Prénoms</Label>
                            <Input placeholder="Prénoms" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Lien de Parenté</Label>
                          <Input placeholder="Ex: Oncle, Tante, Tuteur légal" />
                        </div>
                        <div className="space-y-2">
                          <Label>Profession</Label>
                          <Input placeholder="Profession" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Téléphone 1</Label>
                            <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                          </div>
                          <div className="space-y-2">
                            <Label>Téléphone 2</Label>
                            <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" placeholder="email@exemple.com" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`tutor-pickup-${tutor.id}`} />
                          <Label htmlFor={`tutor-pickup-${tutor.id}`}>Autorisé à récupérer l'élève</Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addGuardian} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un Responsable
                  </Button>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 6️⃣ Informations Médicales */}
            <TabsContent value="medical" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Groupe Sanguin</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                <RadioGroup defaultValue="non" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oui" id="allergies-oui" />
                    <Label htmlFor="allergies-oui">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="allergies-non" />
                    <Label htmlFor="allergies-non">Non</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Détails des Allergies</Label>
                <Textarea placeholder="Préciser les allergies (médicaments, aliments, etc.)" rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Antécédents Médicaux Importants</Label>
                <Textarea placeholder="Maladies chroniques, opérations, traitements en cours..." rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom du Médecin Traitant</Label>
                  <Input placeholder="Dr. Nom Prénom" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone du Médecin</Label>
                  <Input type="tel" placeholder="+225 XX XX XX XX XX" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="medical-authorization" />
                <Label htmlFor="medical-authorization">
                  Autorisation de prise en charge médicale d'urgence
                </Label>
              </div>
            </TabsContent>

            {/* 7️⃣ Documents Joints */}
            <TabsContent value="documents" className="space-y-4 mt-0">
              <div className="space-y-3">
                <Label>Upload de Documents</Label>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <label htmlFor="documents-upload">
                      <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Cliquez pour uploader des documents
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, JPG, PNG (Max 5MB par fichier)
                        </p>
                      </div>
                      <input
                        id="documents-upload"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleDocumentUpload}
                      />
                    </label>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label>Documents Requis</Label>
                <div className="space-y-2">
                  {[
                    "Extrait de naissance",
                    "Certificat de scolarité",
                    "Bulletin précédent",
                    "Carnet de santé"
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                      <span className="text-sm">{doc}</span>
                      <span className="text-xs text-muted-foreground">Non fourni</span>
                    </div>
                  ))}
                </div>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Documents Uploadés ({documents.length})</Label>
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                        <span className="text-sm">{doc.name}</span>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* 8️⃣ Observations */}
            <TabsContent value="observations" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Observations Administratives</Label>
                <Textarea
                  placeholder="Notes et remarques administratives concernant l'élève..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Observations Pédagogiques</Label>
                <Textarea
                  placeholder="Notes et remarques pédagogiques (comportement, besoins spécifiques, talents particuliers...)"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Remarques Diverses</Label>
                <Textarea
                  placeholder="Autres informations importantes..."
                  rows={4}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Boutons de Contrôle */}
        <div className="flex justify-between items-center gap-2 pt-4 border-t mt-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <Button type="button" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button type="button" variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <Button type="button" onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}