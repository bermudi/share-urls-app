import { useState, useEffect, useCallback } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { isValidVanityUrl, isVanityUrlAvailable } from '../utils/urlUtils';
import { useTranslation } from '../hooks/useTranslation';

interface BundleSettingsProps {
  vanityUrl: string;
  description: string;
  onVanityUrlChange: (url: string) => void;
  onDescriptionChange: (description: string) => void;
}

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  const debounced = function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
  
  return debounced as T & { cancel: () => void };
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
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Debounced URL availability check
  const checkAvailability = useCallback(
    debounce(async (url: string) => {
      if (!url || !isValidVanityUrl(url)) {
        setIsAvailable(null);
        return;
      }

      try {
        setIsCheckingAvailability(true);
        const available = await isVanityUrlAvailable(url);
        setIsAvailable(available);
        
        if (url === vanityUrl) { // Only update error if URL hasn't changed
          if (!available) {
            setVanityUrlError(t.main.vanityUrlTaken);
            setVanityUrlValid(false);
          } else {
            setVanityUrlError('');
            setVanityUrlValid(true);
          }
        }
      } catch (error) {
        console.error('Error checking URL availability:', error);
        setIsAvailable(null);
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 500),
    [t.main.vanityUrlTaken, vanityUrl]
  );

  // Handle URL validation and availability check
  useEffect(() => {
    if (!vanityUrl) {
      setVanityUrlError('');
      setVanityUrlValid(false);
      setIsAvailable(null);
      return;
    }

    if (!isValidVanityUrl(vanityUrl)) {
      setVanityUrlError(t.main.vanityUrlError);
      setVanityUrlValid(false);
      setIsAvailable(null);
    } else {
      setVanityUrlError('');
      setVanityUrlValid(true);
      checkAvailability(vanityUrl);
    }

    // Cleanup function to cancel any pending checks
    return () => {
      // Cancel any pending debounced calls
      if (checkAvailability.cancel) {
        checkAvailability.cancel();
      }
    };
  }, [vanityUrl, t.main.vanityUrlError, checkAvailability]);

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
            className={`w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
              !vanityUrl ? 'border-gray-300 dark:border-gray-600' :
              !vanityUrlValid ? 'border-red-500' :
              isAvailable === false ? 'border-red-500' :
              isAvailable === true ? 'border-green-500' : 'border-yellow-500'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isCheckingAvailability ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : vanityUrl && (
              isAvailable === true ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                vanityUrl && <AlertCircle className="w-4 h-4 text-red-500" />
              )
            )}
          </div>
        </div>
        {vanityUrlError && (
          <p className="text-sm text-red-500 dark:text-red-400">{vanityUrlError}</p>
        )}
        {!vanityUrl && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.main.vanityUrlEmpty}</p>
        )}
        {vanityUrl && vanityUrlValid && isAvailable === false && (
          <p className="text-sm text-red-500 dark:text-red-400">
            {t.main.vanityUrlTaken || 'This URL is already taken. Please choose a different one.'}
          </p>
        )}
        {vanityUrl && vanityUrlValid && isAvailable === true && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {t.main.vanityUrlAvailable || 'This URL is available!'}
          </p>
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