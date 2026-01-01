import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, availableLanguages, LanguageInfo } from '@/i18n';
import { toast } from 'sonner';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (stored as Language) || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
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
