import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ConfigurationEtablissement, 
  defaultConfiguration,
  HistoriqueModification 
} from '@/types/etablissement';

interface EtablissementContextType {
  configuration: ConfigurationEtablissement;
  updateConfiguration: (updates: Partial<ConfigurationEtablissement>) => void;
  updateSection: <K extends keyof ConfigurationEtablissement>(
    section: K, 
    updates: Partial<ConfigurationEtablissement[K]>
  ) => void;
  isConfigured: boolean;
  isLocked: boolean;
  lockConfiguration: (password: string) => void;
  unlockConfiguration: (password: string) => boolean;
  getHistorique: () => HistoriqueModification[];
  resetConfiguration: () => void;
}

const EtablissementContext = createContext<EtablissementContextType | undefined>(undefined);

const STORAGE_KEY = 'etablissement_configuration';

export function EtablissementProvider({ children }: { children: ReactNode }) {
  const [configuration, setConfiguration] = useState<ConfigurationEtablissement>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultConfiguration;
      }
    }
    return defaultConfiguration;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configuration));
  }, [configuration]);

  const isConfigured = !!(
    configuration.identite.nom &&
    configuration.localisation.ville &&
    configuration.responsable.nom
  );

  const isLocked = configuration.securite.configurationVerrouillee;

  const addHistoriqueEntry = (
    champModifie: string, 
    ancienneValeur?: string, 
    nouvelleValeur?: string
  ) => {
    const entry: HistoriqueModification = {
      id: `hist-${Date.now()}`,
      dateModification: new Date().toISOString(),
      utilisateur: 'Admin', // À remplacer par l'utilisateur connecté
      champModifie,
      ancienneValeur,
      nouvelleValeur,
    };
    return entry;
  };

  const updateConfiguration = (updates: Partial<ConfigurationEtablissement>) => {
    if (isLocked) return;
    
    setConfiguration(prev => ({
      ...prev,
      ...updates,
      securite: {
        ...prev.securite,
        derniereModification: new Date().toISOString(),
        utilisateurDerniereModification: 'Admin',
      },
    }));
  };

  const updateSection = <K extends keyof ConfigurationEtablissement>(
    section: K,
    updates: Partial<ConfigurationEtablissement[K]>
  ) => {
    if (isLocked) return;

    setConfiguration(prev => {
      const newHistorique = [...prev.securite.historiqueModifications];
      const currentSection = prev[section];
      
      // Enregistrer les modifications dans l'historique
      if (typeof updates === 'object' && updates !== null && typeof currentSection === 'object' && currentSection !== null) {
        const updatesObj = updates as object;
        const currentObj = currentSection as object;
        Object.keys(updatesObj).forEach(key => {
          const oldValue = (currentObj as Record<string, unknown>)[key];
          const newValue = (updatesObj as Record<string, unknown>)[key];
          if (oldValue !== newValue) {
            newHistorique.push(
              addHistoriqueEntry(
                `${String(section)}.${key}`,
                String(oldValue ?? ''),
                String(newValue ?? '')
              )
            );
          }
        });
      }

      const updatedSection = typeof currentSection === 'object' && currentSection !== null
        ? { ...currentSection, ...(updates as object) }
        : updates;

      return {
        ...prev,
        [section]: updatedSection,
        securite: {
          ...prev.securite,
          derniereModification: new Date().toISOString(),
          utilisateurDerniereModification: 'Admin',
          historiqueModifications: newHistorique,
        },
      };
    });
  };

  const lockConfiguration = (password: string) => {
    setConfiguration(prev => ({
      ...prev,
      securite: {
        ...prev.securite,
        configurationVerrouillee: true,
        motDePasseVerrouillage: password,
      },
    }));
  };

  const unlockConfiguration = (password: string): boolean => {
    if (password === configuration.securite.motDePasseVerrouillage) {
      setConfiguration(prev => ({
        ...prev,
        securite: {
          ...prev.securite,
          configurationVerrouillee: false,
        },
      }));
      return true;
    }
    return false;
  };

  const getHistorique = () => configuration.securite.historiqueModifications;

  const resetConfiguration = () => {
    if (isLocked) return;
    setConfiguration(defaultConfiguration);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <EtablissementContext.Provider
      value={{
        configuration,
        updateConfiguration,
        updateSection,
        isConfigured,
        isLocked,
        lockConfiguration,
        unlockConfiguration,
        getHistorique,
        resetConfiguration,
      }}
    >
      {children}
    </EtablissementContext.Provider>
  );
}

export function useEtablissement() {
  const context = useContext(EtablissementContext);
  if (!context) {
    throw new Error('useEtablissement must be used within an EtablissementProvider');
  }
  return context;
}
