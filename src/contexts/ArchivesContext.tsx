import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AnneeScolaire, AccesArchive, mockAnneesScolaires, mockAccesArchives } from '@/types/archives';

interface ArchivesContextType {
  anneesScolaires: AnneeScolaire[];
  anneeActive: AnneeScolaire | null;
  anneeConsultee: AnneeScolaire | null;
  isArchiveMode: boolean;
  journalAcces: AccesArchive[];
  connecterAnnee: (anneeId: string) => void;
  deconnecterArchive: () => void;
  archiverAnnee: (anneeId: string) => void;
  creerNouvelleAnnee: (libelle: string, dateDebut: string, dateFin: string) => void;
  enregistrerAcces: (action: AccesArchive['action'], details?: string) => void;
  syncWithAudit: () => AccesArchive[];
}

const ArchivesContext = createContext<ArchivesContextType | undefined>(undefined);

const STORAGE_KEY = 'archives_state';
const JOURNAL_STORAGE_KEY = 'archives_journal';

export function ArchivesProvider({ children }: { children: ReactNode }) {
  const [anneesScolaires, setAnneesScolaires] = useState<AnneeScolaire[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.anneesScolaires || mockAnneesScolaires;
      } catch {
        return mockAnneesScolaires;
      }
    }
    return mockAnneesScolaires;
  });

  const [anneeConsultee, setAnneeConsultee] = useState<AnneeScolaire | null>(null);
  const [journalAcces, setJournalAcces] = useState<AccesArchive[]>(() => {
    const saved = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockAccesArchives;
      }
    }
    return mockAccesArchives;
  });

  const anneeActive = anneesScolaires.find(a => a.statut === 'active') || null;
  const isArchiveMode = anneeConsultee !== null && anneeConsultee.statut === 'archivee';

  const saveState = (annees: AnneeScolaire[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ anneesScolaires: annees }));
  };

  const saveJournal = useCallback((journal: AccesArchive[]) => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(journal));
  }, []);

  const connecterAnnee = (anneeId: string) => {
    const annee = anneesScolaires.find(a => a.id === anneeId);
    if (annee) {
      setAnneeConsultee(annee);
      enregistrerAcces('connexion', `Connexion à l'année ${annee.libelle}`);
    }
  };

  const deconnecterArchive = () => {
    if (anneeConsultee) {
      enregistrerAcces('connexion', `Déconnexion de l'année ${anneeConsultee.libelle}`);
    }
    setAnneeConsultee(null);
  };

  const archiverAnnee = (anneeId: string) => {
    setAnneesScolaires(prev => {
      const updated = prev.map(a =>
        a.id === anneeId
          ? { ...a, statut: 'archivee' as const, dateArchivage: new Date().toISOString() }
          : a
      );
      saveState(updated);
      return updated;
    });
  };

  const creerNouvelleAnnee = (libelle: string, dateDebut: string, dateFin: string) => {
    const nouvelleAnnee: AnneeScolaire = {
      id: `as-${libelle.replace('-', '-')}`,
      libelle,
      dateDebut,
      dateFin,
      statut: 'active',
      nombreEleves: 0,
      nombreClasses: 0,
      nombreEnseignants: 0,
      tailleDonnees: '0 MB',
    };

    setAnneesScolaires(prev => {
      // Archiver l'ancienne année active
      const updated = prev.map(a =>
        a.statut === 'active'
          ? { ...a, statut: 'archivee' as const, dateArchivage: new Date().toISOString() }
          : a
      );
      const newState = [nouvelleAnnee, ...updated];
      saveState(newState);
      return newState;
    });
  };

  const enregistrerAcces = useCallback((action: AccesArchive['action'], details?: string) => {
    const nouvelAcces: AccesArchive = {
      id: `acc-${Date.now()}`,
      utilisateur: 'Utilisateur actuel',
      role: 'Administrateur',
      anneeScolaire: anneeConsultee?.libelle || anneeActive?.libelle || '',
      dateAcces: new Date().toISOString(),
      action,
      details,
    };
    setJournalAcces(prev => {
      const updated = [nouvelAcces, ...prev];
      saveJournal(updated);
      return updated;
    });
  }, [anneeConsultee, anneeActive, saveJournal]);

  // Fonction pour synchroniser avec le système d'audit général
  const syncWithAudit = useCallback(() => {
    // Retourne le journal pour l'intégration avec AuditContext
    return journalAcces;
  }, [journalAcces]);

  return (
    <ArchivesContext.Provider
      value={{
        anneesScolaires,
        anneeActive,
        anneeConsultee,
        isArchiveMode,
        journalAcces,
        connecterAnnee,
        deconnecterArchive,
        archiverAnnee,
        creerNouvelleAnnee,
        enregistrerAcces,
        syncWithAudit,
      }}
    >
      {children}
    </ArchivesContext.Provider>
  );
}

export function useArchives() {
  const context = useContext(ArchivesContext);
  if (!context) {
    throw new Error('useArchives must be used within an ArchivesProvider');
  }
  return context;
}
