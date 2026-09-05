/**
 * Cette table reproduit EXACTEMENT src/types/roles.ts du frontend
 * (rolePermissions) pour que les autorisations backend correspondent
 * 1:1 au menu affiché côté client. Toute évolution des permissions doit
 * être répercutée dans les deux fichiers.
 *
 * Deux rôles supplémentaires sont ajoutés côté backend, absents du menu
 * admin car ils n'ont pas accès au back-office : 'parent' et 'eleve',
 * qui n'accèdent qu'à leurs propres données via le Portail Parents/Élèves
 * (voir middleware/ownership.ts).
 */

export type UserRole =
  | 'admin'
  | 'directeur'
  | 'enseignant'
  | 'comptable'
  | 'secretaire'
  | 'surveillant'
  | 'infirmier'
  | 'bibliothecaire'
  | 'parent'
  | 'eleve';

export type PermissionModule =
  | 'dashboards'
  | 'rh'
  | 'pedagogie'
  | 'scolarite'
  | 'notes'
  | 'messaging'
  | 'portailParents'
  | 'suiviEnseignants'
  | 'comptabilite'
  | 'infrastructures'
  | 'services'
  | 'bibliotheque'
  | 'parascolaire'
  | 'infirmerie'
  | 'stocks'
  | 'partenariats'
  | 'mena'
  | 'outils'
  | 'statistiques'
  | 'parametrage'
  | 'modulesOptionnels'
  | 'archives'
  | 'examens'; // module ajouté côté backend (organisation d'examens officiels)

export type RolePermissions = Record<PermissionModule, boolean>;

const base: RolePermissions = {
  dashboards: false, rh: false, pedagogie: false, scolarite: false, notes: false,
  messaging: false, portailParents: false, suiviEnseignants: false, comptabilite: false,
  infrastructures: false, services: false, bibliotheque: false, parascolaire: false,
  infirmerie: false, stocks: false, partenariats: false, mena: false, outils: false,
  statistiques: false, parametrage: false, modulesOptionnels: false, archives: false,
  examens: false,
};

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: { ...base, dashboards: true, rh: true, pedagogie: true, scolarite: true, notes: true,
    messaging: true, portailParents: true, suiviEnseignants: true, comptabilite: true,
    infrastructures: true, services: true, bibliotheque: true, parascolaire: true,
    infirmerie: true, stocks: true, partenariats: true, mena: true, outils: true,
    statistiques: true, parametrage: true, modulesOptionnels: true, archives: true, examens: true },
  directeur: { ...base, dashboards: true, rh: true, pedagogie: true, scolarite: true, notes: true,
    messaging: true, portailParents: true, suiviEnseignants: true, comptabilite: true,
    infrastructures: true, services: true, bibliotheque: true, parascolaire: true,
    infirmerie: true, stocks: true, partenariats: true, mena: true, outils: true,
    statistiques: true, parametrage: false, modulesOptionnels: true, archives: true, examens: true },
  enseignant: { ...base, dashboards: true, pedagogie: true, notes: true, messaging: true,
    suiviEnseignants: true, bibliotheque: true, parascolaire: true, outils: true, examens: true },
  comptable: { ...base, dashboards: true, scolarite: true, comptabilite: true, services: true,
    stocks: true, outils: true, statistiques: true },
  secretaire: { ...base, dashboards: true, scolarite: true, messaging: true, portailParents: true,
    parascolaire: true, mena: true, outils: true, examens: true },
  surveillant: { ...base, dashboards: true, pedagogie: true, messaging: true, suiviEnseignants: true,
    parascolaire: true },
  infirmier: { ...base, dashboards: true, messaging: true, infirmerie: true, outils: true },
  bibliothecaire: { ...base, dashboards: true, bibliotheque: true, stocks: true, outils: true },
  // Le parent/élève n'a jamais accès aux modules de back-office : uniquement
  // ses propres données, contrôlées par des routes et vérifications dédiées.
  parent: { ...base, portailParents: true },
  eleve: { ...base, portailParents: true },
};

export function hasPermission(role: UserRole, module: PermissionModule): boolean {
  return rolePermissions[role]?.[module] === true;
}
