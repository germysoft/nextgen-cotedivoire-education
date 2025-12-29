import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  category: string;
  resource: string;
  details: string;
  ip: string;
  success: boolean;
  source?: 'system' | 'user' | 'archive' | 'backup' | 'security';
}

interface AuditContextType {
  auditLogs: AuditEntry[];
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  getLogsByCategory: (category: string) => AuditEntry[];
  getLogsBySource: (source: AuditEntry['source']) => AuditEntry[];
  getLogsByDateRange: (startDate: Date, endDate: Date) => AuditEntry[];
  clearOldLogs: (daysToKeep: number) => void;
  exportLogs: () => AuditEntry[];
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

const STORAGE_KEY = 'audit_logs';
const MAX_LOGS = 1000;

// Logs initiaux pour la démo
const initialLogs: AuditEntry[] = [
  {
    id: 'audit-1',
    timestamp: new Date().toISOString(),
    user: 'admin@ecole.ci',
    userRole: 'Administrateur',
    action: 'Connexion',
    category: 'Sécurité',
    resource: 'Système',
    details: 'Connexion réussie au système',
    ip: '192.168.1.100',
    success: true,
    source: 'system',
  },
];

export function AuditProvider({ children }: { children: ReactNode }) {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialLogs;
      }
    }
    return initialLogs;
  });

  const saveToStorage = useCallback((logs: AuditEntry[]) => {
    // Limiter le nombre de logs stockés
    const trimmedLogs = logs.slice(0, MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
  }, []);

  const addAuditEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    setAuditLogs(prev => {
      const updated = [newEntry, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const getLogsByCategory = useCallback((category: string) => {
    return auditLogs.filter(log => log.category === category);
  }, [auditLogs]);

  const getLogsBySource = useCallback((source: AuditEntry['source']) => {
    return auditLogs.filter(log => log.source === source);
  }, [auditLogs]);

  const getLogsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }, [auditLogs]);

  const clearOldLogs = useCallback((daysToKeep: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    setAuditLogs(prev => {
      const filtered = prev.filter(log => new Date(log.timestamp) >= cutoffDate);
      saveToStorage(filtered);
      return filtered;
    });
  }, [saveToStorage]);

  const exportLogs = useCallback(() => {
    return auditLogs;
  }, [auditLogs]);

  return (
    <AuditContext.Provider
      value={{
        auditLogs,
        addAuditEntry,
        getLogsByCategory,
        getLogsBySource,
        getLogsByDateRange,
        clearOldLogs,
        exportLogs,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}

// Hook utilitaire pour enregistrer facilement des actions
export function useAuditLog() {
  const { addAuditEntry } = useAudit();

  const logAction = useCallback((
    action: string,
    category: string,
    resource: string,
    details: string,
    success: boolean = true,
    source: AuditEntry['source'] = 'user'
  ) => {
    addAuditEntry({
      user: 'Utilisateur actuel', // À remplacer par l'utilisateur connecté
      userRole: 'Administrateur', // À remplacer par le rôle réel
      action,
      category,
      resource,
      details,
      ip: '192.168.1.1', // À remplacer par l'IP réelle
      success,
      source,
    });
  }, [addAuditEntry]);

  const logArchiveAccess = useCallback((
    action: string,
    anneeScolaire: string,
    details: string
  ) => {
    logAction(action, 'Archives', anneeScolaire, details, true, 'archive');
  }, [logAction]);

  const logBackupAction = useCallback((
    action: string,
    details: string,
    success: boolean = true
  ) => {
    logAction(action, 'Sauvegarde', 'Base de données', details, success, 'backup');
  }, [logAction]);

  const logSecurityEvent = useCallback((
    action: string,
    resource: string,
    details: string,
    success: boolean = true
  ) => {
    logAction(action, 'Sécurité', resource, details, success, 'security');
  }, [logAction]);

  return {
    logAction,
    logArchiveAccess,
    logBackupAction,
    logSecurityEvent,
  };
}
