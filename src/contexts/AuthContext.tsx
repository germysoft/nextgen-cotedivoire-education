import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setTokens, clearTokens, getAccessToken } from '@/lib/api';
import { UserRole } from '@/types/roles';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole | 'parent' | 'eleve';
  doitChangerMdp: boolean;
  personnel?: unknown;
  eleve?: unknown;
  parentProfil?: unknown;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  changePassword: (ancienMotDePasse: string, nouveauMotDePasse: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Au chargement de l'app : si un token est présent, on récupère le profil.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data.user as AuthUser;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('auth_refresh_token');
    try {
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } catch {
      // on efface la session localement même si l'appel réseau échoue
    }
    clearTokens();
    setUser(null);
  };

  const changePassword = async (ancienMotDePasse: string, nouveauMotDePasse: string) => {
    await api.post('/auth/change-password', { ancienMotDePasse, nouveauMotDePasse });
    setUser((u) => (u ? { ...u, doitChangerMdp: false } : u));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  return ctx;
}
