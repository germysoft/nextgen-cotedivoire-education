import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Check, X, Info } from "lucide-react";
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
};

export default function RolesPage() {
  const { currentRole } = useRole();

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

  const countPermissions = (role: UserRole) => {
    const perms = rolePermissions[role];
    return Object.values(perms).filter(Boolean).length;
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
        <Badge variant={getRoleBadgeVariant(currentRole)} className="text-sm">
          <Shield className="mr-2 h-4 w-4" />
          {roleLabels[currentRole]}
        </Badge>
      </div>

      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900 dark:text-amber-100">Mode Démonstration</AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          Ce système de rôles utilise localStorage et est uniquement destiné à la démonstration frontend. 
          Pour un système sécurisé en production, activez Lovable Cloud avec authentification Supabase.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card key={role}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{roleLabels[role]}</CardTitle>
                <Badge variant={getRoleBadgeVariant(role)}>
                  {countPermissions(role)}/21
                </Badge>
              </div>
              <CardDescription>
                {countPermissions(role)} modules accessibles
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
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
}
