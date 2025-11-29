import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, Plus, Search, Filter, Download, Upload, Mail, Phone, 
  Calendar, Shield, CheckCircle2, XCircle, Edit, Trash2, MoreVertical 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole, roleLabels } from "@/types/roles";
import { z } from "zod";

const userSchema = z.object({
  nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  prenom: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères").max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  telephone: z.string().trim().regex(/^(\+212|0)[5-7]\d{8}$/, "Numéro de téléphone marocain invalide").optional().or(z.literal("")),
  role: z.string().min(1, "Le rôle est requis"),
});

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  statut: 'actif' | 'inactif' | 'suspendu';
  dateCreation: string;
  derniereConnexion: string;
  avatar?: string;
}

export default function UtilisateursPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      nom: 'Alami', 
      prenom: 'Mohammed', 
      email: 'admin@ecole.ma', 
      telephone: '+212612345678',
      role: 'admin', 
      statut: 'actif',
      dateCreation: '2024-01-15',
      derniereConnexion: '2025-11-29 15:30'
    },
    { 
      id: '2', 
      nom: 'Bennani', 
      prenom: 'Fatima', 
      email: 'directeur@ecole.ma', 
      telephone: '+212623456789',
      role: 'directeur', 
      statut: 'actif',
      dateCreation: '2024-02-10',
      derniereConnexion: '2025-11-29 14:15'
    },
    { 
      id: '3', 
      nom: 'El Idrissi', 
      prenom: 'Ahmed', 
      email: 'prof.math@ecole.ma', 
      telephone: '+212634567890',
      role: 'enseignant', 
      statut: 'actif',
      dateCreation: '2024-03-05',
      derniereConnexion: '2025-11-29 13:45'
    },
    { 
      id: '4', 
      nom: 'Lahlou', 
      prenom: 'Sara', 
      email: 'comptable@ecole.ma', 
      telephone: '+212645678901',
      role: 'comptable', 
      statut: 'actif',
      dateCreation: '2024-02-20',
      derniereConnexion: '2025-11-29 12:20'
    },
    { 
      id: '5', 
      nom: 'Tazi', 
      prenom: 'Karim', 
      email: 'secretaire@ecole.ma', 
      telephone: '+212656789012',
      role: 'secretaire', 
      statut: 'actif',
      dateCreation: '2024-04-12',
      derniereConnexion: '2025-11-29 11:00'
    },
    { 
      id: '6', 
      nom: 'Berrada', 
      prenom: 'Youssef', 
      email: 'surveillant@ecole.ma', 
      telephone: '+212667890123',
      role: 'surveillant', 
      statut: 'actif',
      dateCreation: '2024-05-08',
      derniereConnexion: '2025-11-28 16:30'
    },
    { 
      id: '7', 
      nom: 'Alaoui', 
      prenom: 'Nadia', 
      email: 'infirmiere@ecole.ma', 
      telephone: '+212678901234',
      role: 'infirmier', 
      statut: 'inactif',
      dateCreation: '2024-06-15',
      derniereConnexion: '2025-11-20 09:15'
    },
    { 
      id: '8', 
      nom: 'Chraibi', 
      prenom: 'Hassan', 
      email: 'biblio@ecole.ma', 
      telephone: '+212689012345',
      role: 'bibliothecaire', 
      statut: 'actif',
      dateCreation: '2024-07-01',
      derniereConnexion: '2025-11-29 10:45'
    },
  ]);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: '',
    statut: 'actif' as 'actif' | 'inactif' | 'suspendu',
  });

  const validateForm = () => {
    try {
      userSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      role: '',
      statut: 'actif',
    });
    setFormErrors({});
  };

  const handleAddUser = () => {
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive",
      });
      return;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      ...formData,
      role: formData.role as UserRole,
      dateCreation: new Date().toISOString().split('T')[0],
      derniereConnexion: '-',
    };

    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Utilisateur créé",
      description: `${newUser.prenom} ${newUser.nom} a été ajouté avec succès.`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser || !validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...user, 
            ...formData,
            role: formData.role as UserRole,
          }
        : user
    ));
    
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    resetForm();
    toast({
      title: "Utilisateur modifié",
      description: "Les informations ont été mises à jour avec succès.",
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    toast({
      title: "Utilisateur supprimé",
      description: `${selectedUser.prenom} ${selectedUser.nom} a été supprimé.`,
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      statut: user.statut,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            statut: user.statut === 'actif' ? 'inactif' : 'actif' 
          }
        : user
    ));
    toast({
      title: "Statut modifié",
      description: "Le statut de l'utilisateur a été mis à jour.",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatut = filterStatut === 'all' || user.statut === filterStatut;
    return matchesSearch && matchesRole && matchesStatut;
  });

  const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "destructive" => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'directeur':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return { variant: 'default' as const, icon: CheckCircle2, label: 'Actif' };
      case 'inactif':
        return { variant: 'secondary' as const, icon: XCircle, label: 'Inactif' };
      case 'suspendu':
        return { variant: 'destructive' as const, icon: XCircle, label: 'Suspendu' };
      default:
        return { variant: 'secondary' as const, icon: XCircle, label: statut };
    }
  };

  const stats = {
    total: users.length,
    actifs: users.filter(u => u.statut === 'actif').length,
    inactifs: users.filter(u => u.statut === 'inactif').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'directeur').length,
  };

  const roles: UserRole[] = ['admin', 'directeur', 'enseignant', 'comptable', 'secretaire', 'surveillant', 'infirmier', 'bibliothecaire'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">
            Créer, modifier et gérer les comptes utilisateurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              comptes créés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.actifs}</div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              utilisateurs actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.inactifs}</div>
              <XCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              utilisateurs inactifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.admins}</div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              admin & directeurs
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers.length} utilisateur(s) affiché(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[250px]"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date Création</TableHead>
                <TableHead>Dernière Connexion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const statutBadge = getStatutBadge(user.statut);
                const StatusIcon = statutBadge.icon;
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.prenom[0]}{user.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.prenom} {user.nom}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {user.email}
                        </div>
                        {user.telephone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {user.telephone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statutBadge.variant}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statutBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {user.dateCreation}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.derniereConnexion}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            {user.statut === 'actif' ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(user)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Ajout */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouvel Utilisateur</DialogTitle>
            <DialogDescription>
              Créer un nouveau compte utilisateur pour l'application
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  placeholder="Mohammed"
                />
                {formErrors.prenom && (
                  <p className="text-xs text-destructive">{formErrors.prenom}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  placeholder="Alami"
                />
                {formErrors.nom && (
                  <p className="text-xs text-destructive">{formErrors.nom}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="utilisateur@ecole.ma"
              />
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                placeholder="+212612345678"
              />
              {formErrors.telephone && (
                <p className="text-xs text-destructive">{formErrors.telephone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {roleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.role && (
                <p className="text-xs text-destructive">{formErrors.role}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="statut">Compte actif</Label>
              <Switch
                id="statut"
                checked={formData.statut === 'actif'}
                onCheckedChange={(checked) => setFormData({...formData, statut: checked ? 'actif' : 'inactif'})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddUser}>
              Créer l'utilisateur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier l'Utilisateur</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de {selectedUser?.prenom} {selectedUser?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-prenom">Prénom *</Label>
                <Input
                  id="edit-prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                />
                {formErrors.prenom && (
                  <p className="text-xs text-destructive">{formErrors.prenom}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nom">Nom *</Label>
                <Input
                  id="edit-nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                />
                {formErrors.nom && (
                  <p className="text-xs text-destructive">{formErrors.nom}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telephone">Téléphone</Label>
              <Input
                id="edit-telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              />
              {formErrors.telephone && (
                <p className="text-xs text-destructive">{formErrors.telephone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {roleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.role && (
                <p className="text-xs text-destructive">{formErrors.role}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-statut">Compte actif</Label>
              <Switch
                id="edit-statut"
                checked={formData.statut === 'actif'}
                onCheckedChange={(checked) => setFormData({...formData, statut: checked ? 'actif' : 'inactif'})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditUser}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.prenom} {selectedUser?.nom}</strong> ?
              Cette action est irréversible et supprimera toutes les données associées à cet utilisateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
