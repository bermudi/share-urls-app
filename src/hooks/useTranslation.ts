import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../i18n/translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  // Use useMemo to ensure translations update when language changes
  const t = useMemo(() => {
    console.log('=== TRANSLATION UPDATE ===');
    console.log('Getting translations for language:', language);
    const translations = getTranslations(language);
    console.log('Translations loaded for:', language);
    return translations;
  }, [language]);
  
  return { t, language };
}