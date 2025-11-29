import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, rolePermissions, RolePermissions } from '@/types/roles';

interface RoleContextType {
  currentRole: UserRole;
  currentUserId: string;
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

  // Simuler l'ID de l'utilisateur connecté (en production, cela viendrait de l'authentification)
  const [currentUserId] = useState<string>(() => {
    const storedId = localStorage.getItem('demo_user_id');
    if (storedId) return storedId;
    
    // Générer un ID basé sur le rôle pour la démo
    const userId = currentRole === 'enseignant' ? 'teacher_1' : 'admin_1';
    localStorage.setItem('demo_user_id', userId);
    return userId;
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
