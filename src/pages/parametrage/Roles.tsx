import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Check, X, Info, Edit, Save, Plus, Trash2, Copy, Download } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { UserRole, roleLabels, rolePermissions, RolePermissions } from "@/types/roles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const permissionLabels: Record<keyof RolePermissions, string> = {
  dashboards: "Tableaux de Bord",
  rh: "Ressources Humaines",
  pedagogie: "Gestion Pédagogique",
  scolarite: "Gestion de la Scolarité",
  notes: "Notes & Évaluations",
  messaging: "Messagerie & SMS",
  portailParents: "Portail Parents",
  suiviEnseignants: "Suivi Enseignants",
  comptabilite: "Comptabilité",
  infrastructures: "Infrastructures",
  services: "Services",
  bibliotheque: "Bibliothèque",
  parascolaire: "Activités Parascolaires",
  infirmerie: "Infirmerie",
  stocks: "Stocks & Patrimoine",
  partenariats: "Partenariats",
  mena: "MENA/DESPS",
  outils: "Outils Productivité",
  statistiques: "Statistiques & Rapports",
  parametrage: "Paramétrage & Sécurité",
  modulesOptionnels: "Modules Optionnels",
  archives: "Archives & Années Antérieures",
};

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
  isCustom: boolean;
  createdAt: string;
}

export default function RolesPage() {
  const { currentRole } = useRole();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedCustomRole, setSelectedCustomRole] = useState<CustomRole | null>(null);
  
  // State pour les permissions éditées
  const [editedPermissions, setEditedPermissions] = useState<RolePermissions | null>(null);
  
  // State pour les rôles personnalisés
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      id: 'custom_1',
      name: 'Coordinateur Pédagogique',
      description: 'Gestion pédagogique et coordination des enseignants',
      permissions: {
        dashboards: true,
        rh: false,
        pedagogie: true,
        scolarite: false,
        notes: true,
        messaging: true,
        portailParents: true,
        suiviEnseignants: true,
        comptabilite: false,
        infrastructures: false,
        services: false,
        bibliotheque: true,
        parascolaire: true,
        infirmerie: false,
        stocks: false,
        partenariats: false,
        mena: false,
        outils: true,
        statistiques: true,
        parametrage: false,
        modulesOptionnels: false,
        archives: false,
      },
      isCustom: true,
      createdAt: '2024-10-15',
    },
  ]);
  
  // Form state pour création
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    description: '',
    baseRole: '' as UserRole | '',
  });

  const roles: UserRole[] = [
    'admin',
    'directeur',
    'enseignant',
    'comptable',
    'secretaire',
    'surveillant',
    'infirmier',
    'bibliothecaire',
  ];

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

  const countPermissions = (perms: RolePermissions) => {
    return Object.values(perms).filter(Boolean).length;
  };

  const handleOpenEditDialog = (role: UserRole) => {
    setSelectedRole(role);
    setEditedPermissions({ ...rolePermissions[role] });
    setIsEditDialogOpen(true);
  };

  const handleOpenEditCustomRole = (customRole: CustomRole) => {
    setSelectedCustomRole(customRole);
    setEditedPermissions({ ...customRole.permissions });
    setIsEditDialogOpen(true);
  };

  const handleSavePermissions = () => {
    if (selectedCustomRole && editedPermissions) {
      setCustomRoles(customRoles.map(r => 
        r.id === selectedCustomRole.id 
          ? { ...r, permissions: editedPermissions }
          : r
      ));
      toast({
        title: "Permissions mises à jour",
        description: `Les permissions de "${selectedCustomRole.name}" ont été modifiées.`,
      });
    } else if (selectedRole) {
      // Pour les rôles système, on affiche un avertissement (lecture seule en demo)
      toast({
        title: "Mode Démonstration",
        description: "Les rôles système ne peuvent pas être modifiés dans cette version de démonstration.",
        variant: "destructive",
      });
    }
    setIsEditDialogOpen(false);
    setSelectedRole(null);
    setSelectedCustomRole(null);
    setEditedPermissions(null);
  };

  const handleCreateRole = () => {
    if (!newRoleForm.name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour le rôle.",
        variant: "destructive",
      });
      return;
    }

    const basePermissions: RolePermissions = newRoleForm.baseRole 
      ? { ...rolePermissions[newRoleForm.baseRole] }
      : {
          dashboards: false,
          rh: false,
          pedagogie: false,
          scolarite: false,
          notes: false,
          messaging: false,
          portailParents: false,
          suiviEnseignants: false,
          comptabilite: false,
          infrastructures: false,
          services: false,
          bibliotheque: false,
          parascolaire: false,
          infirmerie: false,
          stocks: false,
          partenariats: false,
          mena: false,
          outils: false,
          statistiques: false,
          parametrage: false,
          modulesOptionnels: false,
          archives: false,
        };

    const newRole: CustomRole = {
      id: `custom_${Date.now()}`,
      name: newRoleForm.name,
      description: newRoleForm.description,
      permissions: basePermissions,
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCustomRoles([...customRoles, newRole]);
    setNewRoleForm({ name: '', description: '', baseRole: '' });
    setIsCreateDialogOpen(false);
    toast({
      title: "Rôle créé",
      description: `Le rôle "${newRole.name}" a été créé avec succès.`,
    });
  };

  const handleDeleteCustomRole = () => {
    if (!selectedCustomRole) return;
    
    setCustomRoles(customRoles.filter(r => r.id !== selectedCustomRole.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Rôle supprimé",
      description: `Le rôle "${selectedCustomRole.name}" a été supprimé.`,
    });
    setSelectedCustomRole(null);
  };

  const handleDuplicateRole = (role: UserRole) => {
    const newRole: CustomRole = {
      id: `custom_${Date.now()}`,
      name: `${roleLabels[role]} (Copie)`,
      description: `Copie du rôle ${roleLabels[role]}`,
      permissions: { ...rolePermissions[role] },
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCustomRoles([...customRoles, newRole]);
    toast({
      title: "Rôle dupliqué",
      description: `Le rôle "${newRole.name}" a été créé à partir de "${roleLabels[role]}".`,
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Matrice des Permissions - Rôles", 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    const headers = ['Module', ...roles.map(r => roleLabels[r].substring(0, 8))];
    const rows = (Object.keys(permissionLabels) as Array<keyof RolePermissions>).map(permKey => [
      permissionLabels[permKey],
      ...roles.map(role => rolePermissions[role][permKey] ? '✓' : '✗')
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save('matrice-permissions.pdf');
    toast({
      title: "Export réussi",
      description: "La matrice des permissions a été exportée en PDF.",
    });
  };

  const toggleAllPermissions = (value: boolean) => {
    if (!editedPermissions) return;
    const newPerms = { ...editedPermissions };
    (Object.keys(newPerms) as Array<keyof RolePermissions>).forEach(key => {
      newPerms[key] = value;
    });
    setEditedPermissions(newPerms);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rôles & Permissions</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des rôles utilisateurs et contrôle d'accès aux modules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Rôle
          </Button>
          <Badge variant={getRoleBadgeVariant(currentRole)} className="text-sm">
            <Shield className="mr-2 h-4 w-4" />
            {roleLabels[currentRole]}
          </Badge>
        </div>
      </div>

      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900 dark:text-amber-100">Mode Démonstration</AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          Ce système de rôles utilise localStorage et est uniquement destiné à la démonstration frontend. 
          Pour un système sécurisé en production, activez Lovable Cloud avec authentification Supabase.
        </AlertDescription>
      </Alert>

      {/* Rôles système */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card key={role} className="relative group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{roleLabels[role]}</CardTitle>
                <Badge variant={getRoleBadgeVariant(role)}>
                  {countPermissions(rolePermissions[role])}/22
                </Badge>
              </div>
              <CardDescription>
                {countPermissions(rolePermissions[role])} modules accessibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {role === 'admin' && (
                  <p className="text-xs text-muted-foreground">
                    Accès complet à tous les modules du système
                  </p>
                )}
                {role === 'directeur' && (
                  <p className="text-xs text-muted-foreground">
                    Gestion complète sauf paramétrage système
                  </p>
                )}
                {role === 'enseignant' && (
                  <p className="text-xs text-muted-foreground">
                    Pédagogie, notes, et suivi des cours
                  </p>
                )}
                {role === 'comptable' && (
                  <p className="text-xs text-muted-foreground">
                    Finance, comptabilité et paiements
                  </p>
                )}
                {role === 'secretaire' && (
                  <p className="text-xs text-muted-foreground">
                    Scolarité, documents et MENA
                  </p>
                )}
                {role === 'surveillant' && (
                  <p className="text-xs text-muted-foreground">
                    Discipline, présence et vie scolaire
                  </p>
                )}
                {role === 'infirmier' && (
                  <p className="text-xs text-muted-foreground">
                    Gestion de l'infirmerie uniquement
                  </p>
                )}
                {role === 'bibliothecaire' && (
                  <p className="text-xs text-muted-foreground">
                    Bibliothèque et inventaire des livres
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" onClick={() => handleOpenEditDialog(role)}>
                  <Edit className="mr-1 h-3 w-3" />
                  Voir
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDuplicateRole(role)}>
                  <Copy className="mr-1 h-3 w-3" />
                  Dupliquer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rôles personnalisés */}
      {customRoles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rôles Personnalisés</CardTitle>
            <CardDescription>
              Rôles créés par l'établissement avec permissions personnalisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customRoles.map((customRole) => (
                <Card key={customRole.id} className="border-dashed">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{customRole.name}</CardTitle>
                      <Badge variant="outline">
                        {countPermissions(customRole.permissions)}/22
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {customRole.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Créé le {customRole.createdAt}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEditCustomRole(customRole)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Modifier
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedCustomRole(customRole);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matrice des permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Matrice des Permissions</CardTitle>
          <CardDescription>
            Détail des droits d'accès pour chaque rôle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Module</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role} className="text-center">
                      {roleLabels[role]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Object.keys(permissionLabels) as Array<keyof RolePermissions>).map((permKey) => (
                  <TableRow key={permKey}>
                    <TableCell className="font-medium">
                      {permissionLabels[permKey]}
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={role} className="text-center">
                        {rolePermissions[role][permKey] ? (
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 dark:text-red-400 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section Migration */}
      <Card>
        <CardHeader>
          <CardTitle>Migration vers Production</CardTitle>
          <CardDescription>
            Étapes pour implémenter un système sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
              Activer Lovable Cloud
            </h4>
            <p className="text-sm text-muted-foreground ml-8">
              Activez Lovable Cloud pour obtenir une base de données Supabase et un système d'authentification sécurisé.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
              Créer la table user_roles
            </h4>
            <p className="text-sm text-muted-foreground ml-8">
              Créez une table dédiée pour stocker les rôles des utilisateurs avec Row Level Security (RLS).
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">3</span>
              Implémenter l'authentification
            </h4>
            <p className="text-sm text-muted-foreground ml-8">
              Ajoutez des pages de login/signup et vérifiez les rôles côté serveur avec des Edge Functions.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">4</span>
              Valider les permissions côté serveur
            </h4>
            <p className="text-sm text-muted-foreground ml-8">
              N'utilisez jamais localStorage pour les vérifications de sécurité. Validez toujours côté serveur.
            </p>
          </div>

          <Alert className="border-red-200 bg-red-50 dark:bg-red-950 mt-4">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-900 dark:text-red-100">Avertissement Sécurité</AlertTitle>
            <AlertDescription className="text-red-800 dark:text-red-200">
              Le système actuel peut être contourné via les outils de développement. Ne l'utilisez JAMAIS en production avec des données sensibles.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Dialog Edition Permissions */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomRole 
                ? `Modifier les permissions: ${selectedCustomRole.name}`
                : selectedRole 
                  ? `Permissions: ${roleLabels[selectedRole]}`
                  : 'Permissions'
              }
            </DialogTitle>
            <DialogDescription>
              {selectedCustomRole 
                ? 'Activez ou désactivez les accès aux différents modules'
                : 'Les rôles système sont en lecture seule. Dupliquez-les pour créer des versions personnalisées.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {editedPermissions && (
            <>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-sm font-medium">Actions rapides</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toggleAllPermissions(true)}
                    disabled={!selectedCustomRole}
                  >
                    Tout activer
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toggleAllPermissions(false)}
                    disabled={!selectedCustomRole}
                  >
                    Tout désactiver
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {(Object.keys(permissionLabels) as Array<keyof RolePermissions>).map((permKey) => (
                    <div 
                      key={permKey} 
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {editedPermissions[permKey] ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Label htmlFor={permKey} className="cursor-pointer">
                          {permissionLabels[permKey]}
                        </Label>
                      </div>
                      <Switch
                        id={permKey}
                        checked={editedPermissions[permKey]}
                        onCheckedChange={(checked) => {
                          if (selectedCustomRole) {
                            setEditedPermissions({ ...editedPermissions, [permKey]: checked });
                          }
                        }}
                        disabled={!selectedCustomRole}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {selectedCustomRole ? 'Annuler' : 'Fermer'}
            </Button>
            {selectedCustomRole && (
              <Button onClick={handleSavePermissions}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Création Rôle */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un Nouveau Rôle</DialogTitle>
            <DialogDescription>
              Définissez un rôle personnalisé avec des permissions spécifiques
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Nom du rôle *</Label>
              <Input
                id="roleName"
                placeholder="Ex: Coordinateur Pédagogique"
                value={newRoleForm.name}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Input
                id="roleDescription"
                placeholder="Description courte du rôle"
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Basé sur (permissions initiales)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    newRoleForm.baseRole === '' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  }`}
                  onClick={() => setNewRoleForm({ ...newRoleForm, baseRole: '' })}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={newRoleForm.baseRole === ''} />
                    <span className="text-sm font-medium">Aucune permission</span>
                  </div>
                </div>
                {roles.slice(0, 4).map((role) => (
                  <div
                    key={role}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      newRoleForm.baseRole === role ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                    }`}
                    onClick={() => setNewRoleForm({ ...newRoleForm, baseRole: role })}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={newRoleForm.baseRole === role} />
                      <span className="text-sm font-medium">{roleLabels[role]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateRole}>
              <Plus className="mr-2 h-4 w-4" />
              Créer le Rôle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la Suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le rôle "{selectedCustomRole?.name}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomRole}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
