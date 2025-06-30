import React from 'react';
import { Plus, Info, FileText, Sun, Moon, Monitor, Check } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';
import type { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onNewBundle: () => void;
  hasProgress?: boolean;
}

export function Header({ theme, onThemeChange, onNewBundle, hasProgress = false }: HeaderProps) {
  const { t } = useTranslation();
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const [showTermsModal, setShowTermsModal] = React.useState(false);

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-theme-selector]')) {
        setShowThemeMenu(false);
      }
    };

    if (showThemeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showThemeMenu]);

  const handleThemeChange = (newTheme: Theme) => {
    onThemeChange(newTheme);
    setShowThemeMenu(false);
  };

  const handleNewBundle = () => {
    if (hasProgress) {
      const confirmed = window.confirm(t.main.newBundleConfirm);
      if (confirmed) {
        onNewBundle();
      }
    } else {
      onNewBundle();
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">url</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">List</span>
              </a>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={handleNewBundle}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t.header.new}</span>
              </button>
              <button 
                onClick={() => setShowAboutModal(true)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>{t.header.about}</span>
              </button>
              <button 
                onClick={() => setShowTermsModal(true)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{t.header.terms}</span>
              </button>
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Theme Selector */}
              <div className="relative" data-theme-selector>
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Theme selector"
                >
                  {theme === 'light' && <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
                  {theme === 'dark' && <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
                  {theme === 'system' && <Monitor className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
                </button>

                {showThemeMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                        {theme === option.value && <Check className="w-4 h-4 text-teal-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.about.title}</h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>{t.about.description1}</p>
              <p>{t.about.description2}</p>
              <p>{t.about.description3}</p>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t.about.builtWith}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              >
                {t.about.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.terms.title}</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.terms.acceptance.title}</h3>
                <p>{t.terms.acceptance.content}</p>
              </section>
              
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.terms.service.title}</h3>
                <p>{t.terms.service.content}</p>
              </section>
              
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.terms.responsibilities.title}</h3>
                <p>{t.terms.responsibilities.content}</p>
              </section>
              
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.terms.privacy.title}</h3>
                <p>{t.terms.privacy.content}</p>
              </section>
              
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.terms.liability.title}</h3>
                <p>{t.terms.liability.content}</p>
              </section>
              
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.terms.changes.title}</h3>
                <p>{t.terms.changes.content}</p>
              </section>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              >
                {t.terms.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}