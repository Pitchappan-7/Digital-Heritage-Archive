import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationSchema } from './translations';

const STORAGE_KEY = 'digital_heritage_language';
const VALID_LANGUAGES: Language[] = ['en', 'hi', 'mr', 'ta'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationSchema) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && VALID_LANGUAGES.includes(saved)) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    if (VALID_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const t = (key: keyof TranslationSchema): string => {
    const currentDict = translations[language] || translations.en;
    return currentDict[key] || translations.en[key] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
