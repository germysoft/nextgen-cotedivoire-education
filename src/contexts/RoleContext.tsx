import React, { createContext, useContext, useState } from 'react';
import { UserRole, rolePermissions, RolePermissions } from '@/types/roles';
import { useAuth } from '@/contexts/AuthContext';

interface RoleContextType {
  currentRole: UserRole;
  currentUserId: string;
  /**
   * @deprecated Ne change plus les permissions réelles : le backend fait
   * autorité sur le rôle (JWT). Conservé uniquement pour ne pas casser
   * RoleSelector.tsx pendant la période de transition — voir MIGRATION.md.
   * Utile en développement local sans backend (ex: prévisualiser un menu),
   * mais toute tentative d'action sera de toute façon refusée côté API.
   */
  setRole: (role: UserRole) => void;
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const DEV_PREVIEW_KEY = 'dev_preview_role';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Prévisualisation de menu en développement local (aucun impact sur les
  // permissions réelles, qui sont vérifiées côté API à chaque requête).
  const [devPreviewRole, setDevPreviewRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem(DEV_PREVIEW_KEY) as UserRole) || null;
  });

  const currentRole: UserRole =
    (user?.role as UserRole) ?? devPreviewRole ?? 'admin';
  const currentUserId = user?.id ?? 'anonyme';

  const permissions = rolePermissions[currentRole] ?? rolePermissions.admin;

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const setRole = (role: UserRole) => {
    if (user) return; // utilisateur réellement connecté : le rôle vient du backend, pas de bascule locale
    localStorage.setItem(DEV_PREVIEW_KEY, role);
    setDevPreviewRole(role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, currentUserId, setRole, permissions, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
