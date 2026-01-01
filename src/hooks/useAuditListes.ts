import { useState, useEffect, useCallback } from "react";
import { useRole } from "@/contexts/RoleContext";
import { roleLabels, UserRole } from "@/types/roles";

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  userRoleLabel: string;
  action: "generation" | "export_pdf" | "export_excel" | "impression";
  listeId: string;
  listeNom: string;
  categorie: string;
  filtres: Record<string, string | boolean>;
  nombreResultats: number;
}

const STORAGE_KEY = "audit_listes_journal";
const MAX_ENTRIES = 500;

export function useAuditListes() {
  const { currentRole, currentUserId } = useRole();
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  // Charger les entrées depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  // Sauvegarder les entrées
  const saveEntries = useCallback((newEntries: AuditEntry[]) => {
    // Garder seulement les dernières MAX_ENTRIES
    const trimmed = newEntries.slice(-MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setEntries(trimmed);
  }, []);

  // Enregistrer une action
  const logAction = useCallback(
    (
      action: AuditEntry["action"],
      listeId: string,
      listeNom: string,
      categorie: string,
      filtres: Record<string, string | boolean>,
      nombreResultats: number
    ) => {
      const newEntry: AuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        userId: currentUserId,
        userRole: currentRole,
        userRoleLabel: roleLabels[currentRole],
        action,
        listeId,
        listeNom,
        categorie,
        filtres,
        nombreResultats,
      };

      const updatedEntries = [...entries, newEntry];
      saveEntries(updatedEntries);

      return newEntry;
    },
    [currentRole, currentUserId, entries, saveEntries]
  );

  // Obtenir les entrées filtrées
  const getFilteredEntries = useCallback(
    (filters?: {
      dateDebut?: string;
      dateFin?: string;
      userId?: string;
      action?: AuditEntry["action"];
      categorie?: string;
    }) => {
      let filtered = [...entries];

      if (filters?.dateDebut) {
        filtered = filtered.filter(
          (e) => new Date(e.timestamp) >= new Date(filters.dateDebut!)
        );
      }

      if (filters?.dateFin) {
        filtered = filtered.filter(
          (e) => new Date(e.timestamp) <= new Date(filters.dateFin!)
        );
      }

      if (filters?.userId) {
        filtered = filtered.filter((e) => e.userId === filters.userId);
      }

      if (filters?.action) {
        filtered = filtered.filter((e) => e.action === filters.action);
      }

      if (filters?.categorie) {
        filtered = filtered.filter((e) => e.categorie === filters.categorie);
      }

      return filtered.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    [entries]
  );

  // Statistiques
  const getStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEntries = entries.filter(
      (e) => new Date(e.timestamp) >= today
    );

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const weekEntries = entries.filter(
      (e) => new Date(e.timestamp) >= last7Days
    );

    const actionCounts = entries.reduce((acc, e) => {
      acc[e.action] = (acc[e.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categorieCounts = entries.reduce((acc, e) => {
      acc[e.categorie] = (acc[e.categorie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const userCounts = entries.reduce((acc, e) => {
      acc[e.userRoleLabel] = (acc[e.userRoleLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: entries.length,
      today: todayEntries.length,
      thisWeek: weekEntries.length,
      byAction: actionCounts,
      byCategorie: categorieCounts,
      byUser: userCounts,
    };
  }, [entries]);

  // Effacer le journal (admin only)
  const clearJournal = useCallback(() => {
    if (currentRole === "admin") {
      localStorage.removeItem(STORAGE_KEY);
      setEntries([]);
    }
  }, [currentRole]);

  return {
    entries,
    logAction,
    getFilteredEntries,
    getStats,
    clearJournal,
  };
}
