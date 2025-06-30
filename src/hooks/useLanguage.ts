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

function isValidLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.some(supportedLang => supportedLang.code === lang);
}

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
  return 'en';
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    
    const saved = localStorage.getItem('language');
    console.log('Saved language from localStorage:', saved);
    
    // Validate saved language
    if (saved && isValidLanguage(saved)) {
      console.log('Using saved language:', saved);
      return saved;
    }
    
    // Clear invalid saved language
    if (saved) {
      console.log('Invalid saved language, clearing localStorage');
      localStorage.removeItem('language');
    }
    
    const browserLang = getBrowserLanguage();
    console.log('Using browser language:', browserLang);
    return browserLang;
  });

  const changeLanguage = (newLanguage: Language) => {
    console.log('=== LANGUAGE CHANGE ===');
    console.log('Changing language from', language, 'to', newLanguage);
    
    if (!isValidLanguage(newLanguage)) {
      console.error('Invalid language:', newLanguage);
      return;
    }
    
    setLanguage(newLanguage);
  };

  useEffect(() => {
    console.log('=== LANGUAGE EFFECT ===');
    console.log('Language state changed to:', language);
    
    // Update localStorage
    localStorage.setItem('language', language);
    console.log('Updated localStorage with language:', language);
    
    // Update document language
    document.documentElement.lang = language;
    console.log('Updated document.documentElement.lang to:', language);
    
    // Force a small delay to ensure state propagation
    const timeoutId = setTimeout(() => {
      console.log('Language change effect completed for:', language);
    }, 100);
    
    return () => clearTimeout(timeoutId);
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