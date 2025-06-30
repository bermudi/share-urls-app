import React, { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { isValidVanityUrl } from '../utils/urlUtils';
import { useTranslation } from '../hooks/useTranslation';

interface BundleSettingsProps {
  vanityUrl: string;
  description: string;
  onVanityUrlChange: (url: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function BundleSettings({
  vanityUrl,
  description,
  onVanityUrlChange,
  onDescriptionChange
}: BundleSettingsProps) {
  const { t } = useTranslation();
  const [vanityUrlError, setVanityUrlError] = useState('');
  const [vanityUrlValid, setVanityUrlValid] = useState(false);

  useEffect(() => {
    if (!vanityUrl) {
      setVanityUrlError('');
      setVanityUrlValid(false);
      return;
    }

    if (!isValidVanityUrl(vanityUrl)) {
      setVanityUrlError(t.main.vanityUrlError);
      setVanityUrlValid(false);
    } else {
      setVanityUrlError('');
      setVanityUrlValid(true);
    }
  }, [vanityUrl, t.main.vanityUrlError]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="vanityUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.main.vanityUrl}
        </label>
        <div className="relative">
          <input
            type="text"
            id="vanityUrl"
            value={vanityUrl}
            onChange={(e) => onVanityUrlChange(e.target.value)}
            placeholder={t.main.vanityUrlPlaceholder}
            className={`w-full px-4 py-3 pr-10 bg-gray-50 dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
              vanityUrl ? (vanityUrlValid ? 'border-green-500' : 'border-red-500') : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {vanityUrl && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {vanityUrlValid ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        {vanityUrlError && (
          <p className="text-sm text-red-500 dark:text-red-400">{vanityUrlError}</p>
        )}
        {!vanityUrl && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.main.vanityUrlEmpty}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.main.description}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={t.main.descriptionPlaceholder}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
        />
      </div>
    </div>
  );
}