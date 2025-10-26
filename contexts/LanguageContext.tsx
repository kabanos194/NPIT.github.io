
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, LanguageKey, Translation } from '../lib/i18n';

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  t: (key: keyof Translation) => string;
  translations: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageKey>('en');

  // FIX: Ensure the function always returns a string to match its type signature.
  // If a translation value is an array, return the first element as a fallback.
  const t = (key: keyof Translation): string => {
    const value = translations[language][key] || translations['en'][key] || key;
    if (Array.isArray(value)) {
      return value[0] ?? key;
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations: translations[language] }}>
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
