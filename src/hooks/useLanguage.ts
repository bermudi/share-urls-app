import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'ko' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  console.log('Browser language detected:', browserLang);
  
  // Check for exact matches first
  for (const lang of SUPPORTED_LANGUAGES) {
    if (browserLang === lang.code || browserLang.startsWith(`${lang.code}-`)) {
      console.log('Matched browser language to:', lang.code);
      return lang.code;
    }
  }
  
  console.log('No match found, defaulting to English');
  // Fallback to English
  return 'en';
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    
    const saved = localStorage.getItem('language') as Language;
    console.log('Saved language from localStorage:', saved);
    
    if (saved && SUPPORTED_LANGUAGES.some(lang => lang.code === saved)) {
      return saved;
    }
    
    const browserLang = getBrowserLanguage();
    console.log('Using browser language:', browserLang);
    return browserLang;
  });

  const changeLanguage = (newLanguage: Language) => {
    console.log('Changing language from', language, 'to', newLanguage);
    setLanguage(newLanguage);
  };

  useEffect(() => {
    console.log('Language changed to:', language);
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const getLanguageOption = (code: Language) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
  };

  return {
    language,
    setLanguage: changeLanguage,
    languageOption: getLanguageOption(language),
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}