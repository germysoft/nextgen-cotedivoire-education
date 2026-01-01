import { fr } from './translations/fr';
import { en } from './translations/en';
import { es } from './translations/es';

export type Language = 'fr' | 'en' | 'es';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const availableLanguages: LanguageInfo[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const translations: Record<Language, Record<string, string>> = {
  fr,
  en,
  es,
};

export const DEFAULT_LANGUAGE: Language = 'fr';
export const LANGUAGE_STORAGE_KEY = 'nextgen-language';

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
}

export function getLanguageInfo(code: Language): LanguageInfo | undefined {
  return availableLanguages.find(lang => lang.code === code);
}

// Helper to add new languages without modifying existing code
export function registerLanguage(code: string, languageInfo: LanguageInfo, translationData: Record<string, string>): void {
  (availableLanguages as LanguageInfo[]).push(languageInfo);
  (translations as Record<string, Record<string, string>>)[code] = translationData;
}
