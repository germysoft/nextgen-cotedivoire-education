import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, availableLanguages, LanguageInfo } from '@/i18n';
import { toast } from 'sonner';

// Clé pour savoir si l'utilisateur a déjà une préférence de langue
const LANGUAGE_PREFERENCE_SET_KEY = 'user_language_preference_set';
const ETABLISSEMENT_CONFIG_KEY = 'etablissement_configuration';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Fonction pour récupérer la langue par défaut de l'établissement
const getEtablissementDefaultLanguage = (): Language | null => {
  try {
    const config = localStorage.getItem(ETABLISSEMENT_CONFIG_KEY);
    if (config) {
      const parsed = JSON.parse(config);
      const langueParDefaut = parsed?.parametresPedagogiques?.langueParDefaut;
      if (langueParDefaut && ['fr', 'en', 'es'].includes(langueParDefaut)) {
        return langueParDefaut as Language;
      }
    }
  } catch {
    // En cas d'erreur de parsing, on ignore
  }
  return null;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Vérifier si l'utilisateur a déjà une préférence définie
    const hasUserPreference = localStorage.getItem(LANGUAGE_PREFERENCE_SET_KEY) === 'true';
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    
    if (hasUserPreference && storedLanguage) {
      // L'utilisateur a déjà défini sa préférence, l'utiliser
      return storedLanguage;
    }
    
    // Première visite: utiliser la langue de l'établissement si disponible
    const etablissementLang = getEtablissementDefaultLanguage();
    if (etablissementLang) {
      return etablissementLang;
    }
    
    // Fallback: langue par défaut du système
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Marquer que l'utilisateur a maintenant une préférence personnelle
    localStorage.setItem(LANGUAGE_PREFERENCE_SET_KEY, 'true');
    const langInfo = availableLanguages.find(l => l.code === lang);
    toast.success(translations[lang]['toast.languageChanged'] || 'Language changed');
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
  };

  const currentLanguageInfo = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages, currentLanguageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
