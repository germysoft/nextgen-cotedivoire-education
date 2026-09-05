import { RolePermissions } from '@/types/roles';

/**
 * Corrige l'incohérence n°5 relevée dans ANALYSE.md : jusqu'ici, rien
 * n'empêchait de naviguer directement vers n'importe quelle URL, quel que
 * soit le rôle. Cette table associe chaque préfixe de route au module de
 * permission requis (voir src/types/roles.ts), et MainLayout s'en sert pour
 * bloquer le rendu si l'utilisateur n'a pas la permission — en plus du
 * filtrage déjà fait côté menu (AppSidebar.tsx).
 *
 * Les préfixes sont vérifiés du plus spécifique au plus général : mettre
 * les entrées les plus longues en premier si un chevauchement existe.
 */
export const routeModuleMap: Array<{ prefix: string; module: keyof RolePermissions }> = [
  { prefix: '/dashboard', module: 'dashboards' },
  { prefix: '/hr', module: 'rh' },
  { prefix: '/enseignants', module: 'suiviEnseignants' },
  { prefix: '/pedagogie', module: 'pedagogie' },
  { prefix: '/notes', module: 'notes' },
  { prefix: '/examens', module: 'notes' },
  { prefix: '/scolarite', module: 'scolarite' },
  { prefix: '/students', module: 'scolarite' },
  { prefix: '/teachers', module: 'rh' },
  { prefix: '/classes', module: 'pedagogie' },
  { prefix: '/grades', module: 'notes' },
  { prefix: '/messaging', module: 'messaging' },
  { prefix: '/portail', module: 'portailParents' },
  { prefix: '/finance', module: 'comptabilite' },
  { prefix: '/comptabilite', module: 'comptabilite' },
  { prefix: '/infrastructures', module: 'infrastructures' },
  { prefix: '/facilities', module: 'infrastructures' },
  { prefix: '/services', module: 'services' },
  { prefix: '/bibliotheque', module: 'bibliotheque' },
  { prefix: '/library', module: 'bibliotheque' },
  { prefix: '/parascolaire', module: 'parascolaire' },
  { prefix: '/extracurricular', module: 'parascolaire' },
  { prefix: '/infirmerie', module: 'infirmerie' },
  { prefix: '/infirmary', module: 'infirmerie' },
  { prefix: '/stocks', module: 'stocks' },
  { prefix: '/inventory', module: 'stocks' },
  { prefix: '/partenariats', module: 'partenariats' },
  { prefix: '/partnerships', module: 'partenariats' },
  { prefix: '/mena', module: 'mena' },
  { prefix: '/outils', module: 'outils' },
  { prefix: '/statistiques', module: 'statistiques' },
  { prefix: '/parametrage', module: 'parametrage' },
  { prefix: '/settings', module: 'parametrage' },
  { prefix: '/modules', module: 'modulesOptionnels' },
  { prefix: '/calendrier-scolaire', module: 'dashboards' },
  { prefix: '/rapports-automatiques', module: 'statistiques' },
];

/** Retourne le module requis pour un chemin donné, ou null si la page est libre d'accès (ex: /dashboard racine). */
export function getRequiredModule(pathname: string): keyof RolePermissions | null {
  const match = routeModuleMap
    .filter((r) => pathname.startsWith(r.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];
  return match ? match.module : null;
}
