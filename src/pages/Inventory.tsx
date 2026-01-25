import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Search, 
  Plus,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { DataTableExport } from "@/components/data-table/DataTableExport";

const initialSupplies = [
  { id: 1, name: "Cahiers 200 pages", category: "Fournitures", stock: 150, minStock: 100, unit: "unités", value: 75000 },
  { id: 2, name: "Stylos bleus", category: "Fournitures", stock: 45, minStock: 50, unit: "boîtes", value: 22500 },
  { id: 3, name: "Ramettes A4", category: "Bureautique", stock: 80, minStock: 30, unit: "ramettes", value: 160000 },
  { id: 4, name: "Marqueurs tableau", category: "Matériel pédagogique", stock: 20, minStock: 25, unit: "boîtes", value: 30000 },
  { id: 5, name: "Calculatrices", category: "Matériel pédagogique", stock: 35, minStock: 20, unit: "unités", value: 175000 },
];

const initialEquipment = [
  { id: 1, name: "Ordinateur Dell", category: "Informatique", quantity: 25, state: "Bon", location: "Salle Info", value: 12500000 },
  { id: 2, name: "Vidéoprojecteur Epson", category: "Audiovisuel", quantity: 8, state: "Bon", location: "Classes", value: 4000000 },
  { id: 3, name: "Tableau interactif", category: "Pédagogique", quantity: 3, state: "Excellent", location: "Salles A", value: 4500000 },
  { id: 4, name: "Microscopes", category: "Laboratoire", quantity: 12, state: "Bon", location: "Labo Sciences", value: 2400000 },
  { id: 5, name: "Imprimante HP", category: "Bureautique", quantity: 5, state: "Moyen", location: "Administration", value: 1250000 },
];

const initialMovements = [
  { id: 1, date: "2024-11-05", type: "Sortie", item: "Cahiers 200 pages", quantity: 50, user: "Secrétaire", reason: "Distribution 6ème" },
  { id: 2, date: "2024-11-04", type: "Entrée", item: "Ramettes A4", quantity: 30, user: "Comptable", reason: "Achat fournisseur" },
  { id: 3, date: "2024-11-03", type: "Sortie", item: "Stylos bleus", quantity: 10, user: "Censeur", reason: "Usage bureau" },
  { id: 4, date: "2024-11-01", type: "Entrée", item: "Marqueurs tableau", quantity: 15, user: "Intendant", reason: "Réassort" },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [supplies, setSupplies] = useState(initialSupplies);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [movements, setMovements] = useState(initialMovements);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<typeof initialSupplies[0] | null>(null);
  const [itemType, setItemType] = useState<"supply" | "equipment">("supply");
  
  const [newItem, setNewItem] = useState({ name: "", category: "Fournitures", stock: 0, minStock: 0, unit: "unités", value: 0 });
  const [editForm, setEditForm] = useState({ name: "", category: "", stock: 0, minStock: 0, unit: "", value: 0 });
  const [movementForm, setMovementForm] = useState({ type: "Entrée", quantity: 0, reason: "" });

  const totalValue = supplies.reduce((acc, item) => acc + item.value, 0);
  const lowStockItems = supplies.filter(item => item.stock < item.minStock).length;
  const equipmentValue = equipment.reduce((acc, item) => acc + item.value, 0);

  const filteredSupplies = supplies.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportSuppliesColumns = [
    { key: "name", label: "Article" },
    { key: "category", label: "Catégorie" },
    { key: "stock", label: "Stock" },
    { key: "minStock", label: "Stock Min" },
    { key: "unit", label: "Unité" },
    { key: "value", label: "Valeur (FCFA)" },
  ];

  const exportEquipmentColumns = [
    { key: "name", label: "Équipement" },
    { key: "category", label: "Catégorie" },
    { key: "quantity", label: "Quantité" },
    { key: "state", label: "État" },
    { key: "location", label: "Localisation" },
    { key: "value", label: "Valeur (FCFA)" },
  ];

  const handleAddItem = () => {
    const id = Math.max(...supplies.map(s => s.id)) + 1;
    setSupplies([...supplies, { id, ...newItem }]);
    setAddDialogOpen(false);
    setNewItem({ name: "", category: "Fournitures", stock: 0, minStock: 0, unit: "unités", value: 0 });
    toast.success("Article ajouté avec succès");
  };

  const handleViewItem = (item: typeof initialSupplies[0]) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleEditClick = (item: typeof initialSupplies[0]) => {
    setSelectedItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      stock: item.stock,
      minStock: item.minStock,
      unit: item.unit,
      value: item.value
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedItem) return;
    
    setSupplies(supplies.map(s => 
      s.id === selectedItem.id 
        ? { ...s, ...editForm }
        : s
    ));
    setEditDialogOpen(false);
    toast.success("Article modifié avec succès");
  };

  const handleDeleteClick = (item: typeof initialSupplies[0]) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    
    setSupplies(supplies.filter(s => s.id !== selectedItem.id));
    setDeleteDialogOpen(false);
    toast.success("Article supprimé avec succès");
  };

  const handleMovementClick = (item: typeof initialSupplies[0]) => {
    setSelectedItem(item);
    setMovementForm({ type: "Entrée", quantity: 0, reason: "" });
    setMovementDialogOpen(true);
  };

  const handleMovementSave = () => {
    if (!selectedItem || movementForm.quantity <= 0) return;

    const newMovement = {
      id: movements.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: movementForm.type,
      item: selectedItem.name,
      quantity: movementForm.quantity,
      user: "Utilisateur",
      reason: movementForm.reason
    };

    setMovements([newMovement, ...movements]);

    const stockChange = movementForm.type === "Entrée" ? movementForm.quantity : -movementForm.quantity;
    setSupplies(supplies.map(s => 
      s.id === selectedItem.id 
        ? { ...s, stock: s.stock + stockChange }
        : s
    ));

    setMovementDialogOpen(false);
    toast.success(`Mouvement de stock enregistré: ${movementForm.type} de ${movementForm.quantity} ${selectedItem.unit}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Stocks</h1>
          <p className="text-muted-foreground">Fournitures, équipements et patrimoine</p>
        </div>
        <div className="flex gap-2">
          <DataTableExport
            data={supplies}
            columns={exportSuppliesColumns}
            filename="inventaire-fournitures"
          />
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nom de l'article</Label>
                  <Input 
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Ex: Cahiers 100 pages"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fournitures">Fournitures</SelectItem>
                      <SelectItem value="Bureautique">Bureautique</SelectItem>
                      <SelectItem value="Matériel pédagogique">Matériel pédagogique</SelectItem>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stock initial</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock minimum</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unité</Label>
                    <Select value={newItem.unit} onValueChange={(v) => setNewItem({ ...newItem, unit: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unités">Unités</SelectItem>
                        <SelectItem value="boîtes">Boîtes</SelectItem>
                        <SelectItem value="ramettes">Ramettes</SelectItem>
                        <SelectItem value="paquets">Paquets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valeur (FCFA)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={newItem.value}
                      onChange={(e) => setNewItem({ ...newItem, value: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleAddItem} disabled={!newItem.name}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Fournitures</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">{supplies.length} articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">En dessous du seuil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipements</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
            <p className="text-xs text-muted-foreground">Patrimoine actif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(equipmentValue + totalValue).toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Patrimoine total</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="supplies">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="supplies">Fournitures</TabsTrigger>
              <TabsTrigger value="equipment">Équipements</TabsTrigger>
              <TabsTrigger value="movements">Mouvements</TabsTrigger>
            </TabsList>

            <TabsContent value="supplies" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une fourniture..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Stock Min</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSupplies.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.stock < item.minStock ? "destructive" : "default"}>
                          {item.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.minStock}</TableCell>
                      <TableCell className="text-sm">{item.unit}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.value.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleViewItem(item)} title="Voir">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleMovementClick(item)} title="Mouvement">
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEditClick(item)} title="Modifier">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(item)} title="Supprimer" className="hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4">
              <div className="flex justify-end">
                <DataTableExport
                  data={equipment}
                  columns={exportEquipmentColumns}
                  filename="inventaire-equipements"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{eq.category}</Badge>
                      </TableCell>
                      <TableCell>{eq.quantity}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            eq.state === "Excellent" ? "default" : 
                            eq.state === "Bon" ? "secondary" : 
                            "outline"
                          }
                        >
                          {eq.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {eq.location}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {eq.value.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="movements" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Motif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-mono text-sm">{movement.date}</TableCell>
                      <TableCell>
                        <Badge variant={movement.type === "Entrée" ? "default" : "secondary"}>
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{movement.item}</TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell className="text-sm">{movement.user}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {movement.reason}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'article</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nom</Label>
                  <p className="font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Catégorie</Label>
                  <p className="font-medium">{selectedItem.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Stock actuel</Label>
                  <Badge variant={selectedItem.stock < selectedItem.minStock ? "destructive" : "default"}>
                    {selectedItem.stock} {selectedItem.unit}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Stock minimum</Label>
                  <p className="font-medium">{selectedItem.minStock} {selectedItem.unit}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Valeur</Label>
                  <p className="font-medium text-lg">{selectedItem.value.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom de l'article</Label>
              <Input 
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fournitures">Fournitures</SelectItem>
                  <SelectItem value="Bureautique">Bureautique</SelectItem>
                  <SelectItem value="Matériel pédagogique">Matériel pédagogique</SelectItem>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock actuel</Label>
                <Input 
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock minimum</Label>
                <Input 
                  type="number"
                  min="0"
                  value={editForm.minStock}
                  onChange={(e) => setEditForm({ ...editForm, minStock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Valeur (FCFA)</Label>
              <Input 
                type="number"
                min="0"
                value={editForm.value}
                onChange={(e) => setEditForm({ ...editForm, value: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movement Dialog */}
      <Dialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un mouvement de stock</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedItem.name}</p>
                <p className="text-sm text-muted-foreground">Stock actuel: {selectedItem.stock} {selectedItem.unit}</p>
              </div>
              <div className="space-y-2">
                <Label>Type de mouvement</Label>
                <Select value={movementForm.type} onValueChange={(v) => setMovementForm({ ...movementForm, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrée">Entrée (réapprovisionnement)</SelectItem>
                    <SelectItem value="Sortie">Sortie (consommation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantité</Label>
                <Input 
                  type="number"
                  min="1"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Motif</Label>
                <Input 
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                  placeholder="Ex: Achat fournisseur, Distribution classe..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovementDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleMovementSave} disabled={movementForm.quantity <= 0}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'article <strong>"{selectedItem?.name}"</strong> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
