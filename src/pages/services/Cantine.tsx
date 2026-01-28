import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Utensils, Users, TrendingUp, Calendar, CheckCircle, DollarSign, Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Menu {
  jour: string;
  entree: string;
  plat: string;
  dessert: string;
  participants: number;
}

interface Inscrit {
  id: number;
  nom: string;
  classe: string;
  formule: string;
  montant: number;
  paye: number;
  statut: string;
  contact?: string;
}

const initialMenus: Menu[] = [
  { jour: "Lundi", entree: "Salade verte", plat: "Poulet braisé + Riz", dessert: "Fruits", participants: 285 },
  { jour: "Mardi", entree: "Soupe de légumes", plat: "Poisson + Attiéké", dessert: "Yaourt", participants: 290 },
  { jour: "Mercredi", entree: "Salade de tomates", plat: "Spaghetti bolognaise", dessert: "Gâteau", participants: 275 },
  { jour: "Jeudi", entree: "Alloco", plat: "Riz au gras", dessert: "Banane", participants: 295 },
  { jour: "Vendredi", entree: "Salade mixte", plat: "Poulet + Frites", dessert: "Fruits", participants: 300 },
];

const initialInscrits: Inscrit[] = [
  { id: 1, nom: "KOUAME Koffi", classe: "6ème A", formule: "Annuelle", montant: 120000, paye: 120000, statut: "Soldé", contact: "+225 07 12 34 56" },
  { id: 2, nom: "DIALLO Aissatou", classe: "5ème B", formule: "Trimestrielle", montant: 45000, paye: 30000, statut: "Partiel", contact: "+225 05 98 76 54" },
  { id: 3, nom: "TRAORE Mohamed", classe: "4ème A", formule: "Annuelle", montant: 120000, paye: 0, statut: "Impayé", contact: "+225 01 23 45 67" },
  { id: 4, nom: "KONE Aminata", classe: "3ème C", formule: "Mensuelle", montant: 12000, paye: 12000, statut: "Soldé" },
  { id: 5, nom: "BAMBA Sekou", classe: "2nde B", formule: "Annuelle", montant: 120000, paye: 80000, statut: "Partiel", contact: "+225 07 89 01 23" },
];

const classesListe = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C", "2nde A", "2nde B", "1ère A", "1ère B", "Tle D"];

const Cantine = () => {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [inscrits, setInscrits] = useState<Inscrit[]>(initialInscrits);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedInscrit, setSelectedInscrit] = useState<Inscrit | null>(null);
  
  // Form states
  const [menuForm, setMenuForm] = useState({ jour: "", entree: "", plat: "", dessert: "" });
  const [inscriptionForm, setInscriptionForm] = useState({ nom: "", classe: "", formule: "Annuelle", contact: "" });
  const [paymentAmount, setPaymentAmount] = useState("");

  // Statistiques dynamiques
  const totalInscrits = inscrits.length;
  const participationMoyenne = menus.reduce((sum, m) => sum + m.participants, 0) / menus.length;
  const totalDu = inscrits.reduce((sum, i) => sum + i.montant, 0);
  const totalPaye = inscrits.reduce((sum, i) => sum + i.paye, 0);

  // Filtrer les inscrits
  const filteredInscrits = inscrits.filter(i => 
    i.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.classe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers Menu
  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setMenuForm({ jour: menu.jour, entree: menu.entree, plat: menu.plat, dessert: menu.dessert });
    setIsEditMenuOpen(true);
  };

  const handleSaveMenu = () => {
    if (!menuForm.entree || !menuForm.plat || !menuForm.dessert) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (selectedMenu) {
      setMenus(prev => prev.map(m => 
        m.jour === selectedMenu.jour 
          ? { ...m, entree: menuForm.entree, plat: menuForm.plat, dessert: menuForm.dessert }
          : m
      ));
      toast.success(`Menu de ${selectedMenu.jour} mis à jour`);
    }
    
    setIsEditMenuOpen(false);
    setSelectedMenu(null);
    setMenuForm({ jour: "", entree: "", plat: "", dessert: "" });
  };

  // Handlers Inscriptions
  const handleNewInscription = () => {
    if (!inscriptionForm.nom || !inscriptionForm.classe) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const montants: Record<string, number> = {
      "Annuelle": 120000,
      "Trimestrielle": 45000,
      "Mensuelle": 12000
    };

    const newInscrit: Inscrit = {
      id: Math.max(...inscrits.map(i => i.id)) + 1,
      nom: inscriptionForm.nom,
      classe: inscriptionForm.classe,
      formule: inscriptionForm.formule,
      montant: montants[inscriptionForm.formule],
      paye: 0,
      statut: "Impayé",
      contact: inscriptionForm.contact
    };

    setInscrits([...inscrits, newInscrit]);
    setIsInscriptionOpen(false);
    setInscriptionForm({ nom: "", classe: "", formule: "Annuelle", contact: "" });
    toast.success(`${inscriptionForm.nom} inscrit(e) à la cantine`);
  };

  // Handler Paiement
  const openPaymentDialog = (inscrit: Inscrit) => {
    setSelectedInscrit(inscrit);
    setPaymentAmount("");
    setIsPaymentOpen(true);
  };

  const handlePayment = () => {
    if (!selectedInscrit || !paymentAmount) return;
    
    const amount = parseInt(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    const newPaye = selectedInscrit.paye + amount;
    const newStatut = newPaye >= selectedInscrit.montant ? "Soldé" : "Partiel";

    setInscrits(prev => prev.map(i => 
      i.id === selectedInscrit.id 
        ? { ...i, paye: Math.min(newPaye, i.montant), statut: newStatut }
        : i
    ));

    toast.success(`Paiement de ${amount.toLocaleString()} F enregistré pour ${selectedInscrit.nom}`);
    setIsPaymentOpen(false);
    setSelectedInscrit(null);
  };

  const handleDeleteInscrit = (id: number) => {
    setInscrits(prev => prev.filter(i => i.id !== id));
    toast.success("Inscription supprimée");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gestion de la Cantine</h1>
          <p className="text-muted-foreground mt-2">Menus, inscriptions, présences et paiements</p>
        </div>
        <Button onClick={() => setIsInscriptionOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Inscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInscrits}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(participationMoyenne)}</div>
            <Progress value={(participationMoyenne / 300) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Par jour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaye.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">Sur {totalDu.toLocaleString()} F</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Recouvrement</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((totalPaye / totalDu) * 100).toFixed(0)}%</div>
            <Progress value={(totalPaye / totalDu) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menus" className="space-y-4">
        <TabsList>
          <TabsTrigger value="menus">Menus de la Semaine</TabsTrigger>
          <TabsTrigger value="inscrits">Élèves Inscrits</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="menus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning Hebdomadaire</CardTitle>
              <CardDescription>Menus et participation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Entrée</TableHead>
                    <TableHead>Plat Principal</TableHead>
                    <TableHead>Dessert</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menus.map((menu) => (
                    <TableRow key={menu.jour}>
                      <TableCell className="font-bold">{menu.jour}</TableCell>
                      <TableCell>{menu.entree}</TableCell>
                      <TableCell className="font-medium">{menu.plat}</TableCell>
                      <TableCell>{menu.dessert}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{menu.participants}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleEditMenu(menu)}>
                          <Edit className="mr-1 h-3 w-3" />
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-5">
            {menus.map((menu) => (
              <Card key={menu.jour} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {menu.jour}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Entrée</div>
                    <div className="text-sm font-medium">{menu.entree}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Plat</div>
                    <div className="text-sm font-medium">{menu.plat}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Dessert</div>
                    <div className="text-sm font-medium">{menu.dessert}</div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Participants</div>
                    <Badge>{menu.participants}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inscrits" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Liste des Inscrits</CardTitle>
                  <CardDescription>Élèves abonnés à la cantine</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Formule</TableHead>
                    <TableHead>Montant Dû</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Reste</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInscrits.map((inscrit) => {
                    const reste = inscrit.montant - inscrit.paye;
                    return (
                      <TableRow key={inscrit.id}>
                        <TableCell className="font-medium">{inscrit.nom}</TableCell>
                        <TableCell>{inscrit.classe}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{inscrit.formule}</Badge>
                        </TableCell>
                        <TableCell>{inscrit.montant.toLocaleString()} F</TableCell>
                        <TableCell className="text-green-600 font-medium">{inscrit.paye.toLocaleString()} F</TableCell>
                        <TableCell className={reste > 0 ? "text-orange-600 font-medium" : ""}>{reste.toLocaleString()} F</TableCell>
                        <TableCell>
                          <Badge variant={
                            inscrit.statut === "Soldé" ? "default" :
                            inscrit.statut === "Partiel" ? "secondary" :
                            "destructive"
                          }>
                            {inscrit.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {inscrit.statut !== "Soldé" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openPaymentDialog(inscrit)}
                              >
                                <DollarSign className="mr-1 h-3 w-3" />
                                Payer
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteInscrit(inscrit.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Participation par Jour</CardTitle>
                <CardDescription>Affluence hebdomadaire</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {menus.map((menu) => (
                  <div key={menu.jour} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{menu.jour}</span>
                      <span className="text-sm font-bold">{menu.participants} élèves</span>
                    </div>
                    <Progress value={(menu.participants / 300) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition Paiements</CardTitle>
                <CardDescription>Statuts des inscriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Soldés</span>
                    <Badge variant="default">{inscrits.filter(i => i.statut === "Soldé").length} élèves</Badge>
                  </div>
                  <Progress value={(inscrits.filter(i => i.statut === "Soldé").length / inscrits.length) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Partiels</span>
                    <Badge variant="secondary">{inscrits.filter(i => i.statut === "Partiel").length} élèves</Badge>
                  </div>
                  <Progress value={(inscrits.filter(i => i.statut === "Partiel").length / inscrits.length) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Impayés</span>
                    <Badge variant="destructive">{inscrits.filter(i => i.statut === "Impayé").length} élèves</Badge>
                  </div>
                  <Progress value={(inscrits.filter(i => i.statut === "Impayé").length / inscrits.length) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Modifier Menu */}
      <Dialog open={isEditMenuOpen} onOpenChange={setIsEditMenuOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Menu - {selectedMenu?.jour}</DialogTitle>
            <DialogDescription>Mettre à jour les plats du jour</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Entrée</Label>
              <Input 
                value={menuForm.entree}
                onChange={(e) => setMenuForm({...menuForm, entree: e.target.value})}
                placeholder="Entrée du jour"
              />
            </div>
            <div className="space-y-2">
              <Label>Plat Principal</Label>
              <Input 
                value={menuForm.plat}
                onChange={(e) => setMenuForm({...menuForm, plat: e.target.value})}
                placeholder="Plat principal"
              />
            </div>
            <div className="space-y-2">
              <Label>Dessert</Label>
              <Input 
                value={menuForm.dessert}
                onChange={(e) => setMenuForm({...menuForm, dessert: e.target.value})}
                placeholder="Dessert"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMenuOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveMenu}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nouvelle Inscription */}
      <Dialog open={isInscriptionOpen} onOpenChange={setIsInscriptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle Inscription Cantine</DialogTitle>
            <DialogDescription>Inscrire un élève à la cantine</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nom de l'élève *</Label>
              <Input 
                value={inscriptionForm.nom}
                onChange={(e) => setInscriptionForm({...inscriptionForm, nom: e.target.value})}
                placeholder="NOM Prénom"
              />
            </div>
            <div className="space-y-2">
              <Label>Classe *</Label>
              <Select 
                value={inscriptionForm.classe} 
                onValueChange={(v) => setInscriptionForm({...inscriptionForm, classe: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {classesListe.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Formule *</Label>
              <Select 
                value={inscriptionForm.formule} 
                onValueChange={(v) => setInscriptionForm({...inscriptionForm, formule: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="Annuelle">Annuelle (120 000 F)</SelectItem>
                  <SelectItem value="Trimestrielle">Trimestrielle (45 000 F)</SelectItem>
                  <SelectItem value="Mensuelle">Mensuelle (12 000 F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact parent (optionnel)</Label>
              <Input 
                value={inscriptionForm.contact}
                onChange={(e) => setInscriptionForm({...inscriptionForm, contact: e.target.value})}
                placeholder="+225 XX XX XX XX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInscriptionOpen(false)}>Annuler</Button>
            <Button onClick={handleNewInscription}>Inscrire</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Paiement */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un Paiement</DialogTitle>
            <DialogDescription>Paiement pour {selectedInscrit?.nom}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Montant dû:</span>
                <span className="font-bold">{selectedInscrit?.montant.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between">
                <span>Déjà payé:</span>
                <span className="font-bold text-green-600">{selectedInscrit?.paye.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Reste à payer:</span>
                <span className="font-bold text-orange-600">
                  {((selectedInscrit?.montant || 0) - (selectedInscrit?.paye || 0)).toLocaleString()} F
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Montant du paiement (FCFA)</Label>
              <Input 
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Montant"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Annuler</Button>
            <Button onClick={handlePayment}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cantine;
