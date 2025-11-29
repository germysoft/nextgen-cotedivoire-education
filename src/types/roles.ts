// AVERTISSEMENT SÉCURITÉ: Ce système de rôles est uniquement pour démonstration
// Il utilise localStorage et peut être manipulé côté client
// NE PAS utiliser en production - Implémenter une vraie authentification avec Lovable Cloud

export type UserRole = 
  | 'admin'           // Administrateur - Accès complet
  | 'directeur'       // Directeur - Gestion générale
  | 'enseignant'      // Enseignant - Pédagogie et notes
  | 'comptable'       // Comptable - Finance et comptabilité
  | 'secretaire'      // Secrétaire - Scolarité et documents
  | 'surveillant'     // Surveillant - Discipline et présence
  | 'infirmier'       // Infirmier - Santé
  | 'bibliothecaire'; // Bibliothécaire - Bibliothèque

export interface RolePermissions {
  dashboards: boolean;
  rh: boolean;
  pedagogie: boolean;
  scolarite: boolean;
  notes: boolean;
  messaging: boolean;
  portailParents: boolean;
  suiviEnseignants: boolean;
  comptabilite: boolean;
  infrastructures: boolean;
  services: boolean;
  bibliotheque: boolean;
  parascolaire: boolean;
  infirmerie: boolean;
  stocks: boolean;
  partenariats: boolean;
  mena: boolean;
  outils: boolean;
  statistiques: boolean;
  parametrage: boolean;
  modulesOptionnels: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    dashboards: true,
    rh: true,
    pedagogie: true,
    scolarite: true,
    notes: true,
    messaging: true,
    portailParents: true,
    suiviEnseignants: true,
    comptabilite: true,
    infrastructures: true,
    services: true,
    bibliotheque: true,
    parascolaire: true,
    infirmerie: true,
    stocks: true,
    partenariats: true,
    mena: true,
    outils: true,
    statistiques: true,
    parametrage: true,
    modulesOptionnels: true,
  },
  directeur: {
    dashboards: true,
    rh: true,
    pedagogie: true,
    scolarite: true,
    notes: true,
    messaging: true,
    portailParents: true,
    suiviEnseignants: true,
    comptabilite: true,
    infrastructures: true,
    services: true,
    bibliotheque: true,
    parascolaire: true,
    infirmerie: true,
    stocks: true,
    partenariats: true,
    mena: true,
    outils: true,
    statistiques: true,
    parametrage: false,
    modulesOptionnels: true,
  },
  enseignant: {
    dashboards: true,
    rh: false,
    pedagogie: true,
    scolarite: false,
    notes: true,
    messaging: true,
    portailParents: false,
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
    statistiques: false,
    parametrage: false,
    modulesOptionnels: false,
  },
  comptable: {
    dashboards: true,
    rh: false,
    pedagogie: false,
    scolarite: true,
    notes: false,
    messaging: false,
    portailParents: false,
    suiviEnseignants: false,
    comptabilite: true,
    infrastructures: false,
    services: true,
    bibliotheque: false,
    parascolaire: false,
    infirmerie: false,
    stocks: true,
    partenariats: false,
    mena: false,
    outils: true,
    statistiques: true,
    parametrage: false,
    modulesOptionnels: false,
  },
  secretaire: {
    dashboards: true,
    rh: false,
    pedagogie: false,
    scolarite: true,
    notes: false,
    messaging: true,
    portailParents: true,
    suiviEnseignants: false,
    comptabilite: false,
    infrastructures: false,
    services: false,
    bibliotheque: false,
    parascolaire: true,
    infirmerie: false,
    stocks: false,
    partenariats: false,
    mena: true,
    outils: true,
    statistiques: false,
    parametrage: false,
    modulesOptionnels: false,
  },
  surveillant: {
    dashboards: true,
    rh: false,
    pedagogie: true,
    scolarite: false,
    notes: false,
    messaging: true,
    portailParents: false,
    suiviEnseignants: true,
    comptabilite: false,
    infrastructures: false,
    services: false,
    bibliotheque: false,
    parascolaire: true,
    infirmerie: false,
    stocks: false,
    partenariats: false,
    mena: false,
    outils: false,
    statistiques: false,
    parametrage: false,
    modulesOptionnels: false,
  },
  infirmier: {
    dashboards: true,
    rh: false,
    pedagogie: false,
    scolarite: false,
    notes: false,
    messaging: true,
    portailParents: false,
    suiviEnseignants: false,
    comptabilite: false,
    infrastructures: false,
    services: false,
    bibliotheque: false,
    parascolaire: false,
    infirmerie: true,
    stocks: false,
    partenariats: false,
    mena: false,
    outils: true,
    statistiques: false,
    parametrage: false,
    modulesOptionnels: false,
  },
  bibliothecaire: {
    dashboards: true,
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
    bibliotheque: true,
    parascolaire: false,
    infirmerie: false,
    stocks: true,
    partenariats: false,
    mena: false,
    outils: true,
    statistiques: false,
    parametrage: false,
    modulesOptionnels: false,
  },
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrateur',
  directeur: 'Directeur',
  enseignant: 'Enseignant',
  comptable: 'Comptable',
  secretaire: 'Secrétaire',
  surveillant: 'Surveillant',
  infirmier: 'Infirmier',
  bibliothecaire: 'Bibliothécaire',
};

// Mapping des sections du menu avec les permissions
export const menuPermissionMap: Record<string, keyof RolePermissions> = {
  "Tableaux de Bord": "dashboards",
  "Ressources Humaines": "rh",
  "Gestion Pédagogique": "pedagogie",
  "Gestion de la Scolarité": "scolarite",
  "Notes & Évaluations": "notes",
  "Messagerie & SMS": "messaging",
  "Portail Parents & Élèves": "portailParents",
  "Suivi Enseignants": "suiviEnseignants",
  "Comptabilité Générale": "comptabilite",
  "Infrastructures": "infrastructures",
  "Services": "services",
  "Bibliothèque": "bibliotheque",
  "Activités Parascolaires": "parascolaire",
  "Infirmerie": "infirmerie",
  "Stocks & Patrimoine": "stocks",
  "Partenariats": "partenariats",
  "MENA/DESPS": "mena",
  "Outils Productivité": "outils",
  "Statistiques & Rapports": "statistiques",
  "Paramétrage & Sécurité": "parametrage",
  "Modules Optionnels": "modulesOptionnels",
};
