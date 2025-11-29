import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, rolePermissions, RolePermissions } from '@/types/roles';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'demo_user_role';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    // Charger le rôle depuis localStorage ou utiliser 'admin' par défaut
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as UserRole) || 'admin';
  });

  useEffect(() => {
    // Sauvegarder le rôle dans localStorage quand il change
    localStorage.setItem(STORAGE_KEY, currentRole);
  }, [currentRole]);

  const permissions = rolePermissions[currentRole];

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setRole, permissions, hasPermission }}>
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
