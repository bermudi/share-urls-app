import { useLanguage } from './useLanguage';
import { getTranslations } from '../i18n/translations';

export function useTranslation() {
  const { language } = useLanguage();
  const t = getTranslations(language);
  
  return { t, language };
}