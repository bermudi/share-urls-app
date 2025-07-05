import { useState, useEffect } from 'react';
import { Languages, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Language } from '../contexts/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-language-selector]')) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLanguageMenu]);

  const handleLanguageChange = (newLanguage: Language) => {
    console.log('Language selector: changing to', newLanguage);
    setLanguage(newLanguage);
    setShowLanguageMenu(false);
  };

  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  // Only show languages that have translations implemented
  const availableLanguages = supportedLanguages.filter(lang =>
    lang.code === 'en' || lang.code === 'es'
  );

  return (
    <div className="relative" data-language-selector>
      <button
        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={t.language.selectLanguage}
        title={t.language.selectLanguage}
      >
        <Languages className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLanguage?.flag}
        </span>
      </button>

      {showLanguageMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            {t.language.selectLanguage}
          </div>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{lang.name}</div>
                </div>
              </div>
              {language === lang.code && <Check className="w-4 h-4 text-teal-500" />}
            </button>
          ))}

          {/* Coming soon section for other languages */}
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-1">
            Coming soon
          </div>
          {supportedLanguages
            .filter(lang => lang.code !== 'en' && lang.code !== 'es')
            .map((lang) => (
              <div
                key={lang.code}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg opacity-50">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{lang.name}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}