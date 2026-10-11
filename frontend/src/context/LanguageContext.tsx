'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  language: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ES');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('noctis_lang') as Language;
      if (saved === 'ES' || saved === 'EN') {
        setLangState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('noctis_lang', newLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'ES' ? 'EN' : 'ES');
  };

  const t = (key: string) => {
    return getTranslation(key, lang);
  };

  return (
    <LanguageContext.Provider value={{ lang, language: lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'ES' as Language,
      language: 'ES' as Language,
      setLang: () => {},
      toggleLang: () => {},
      t: (k: string) => getTranslation(k, 'ES')
    };
  }
  return context;
}

