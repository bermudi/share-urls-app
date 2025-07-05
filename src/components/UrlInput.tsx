import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { isValidUrl, fetchUrlMetadata, generateId } from '../utils/urlUtils';
import { useTranslation } from '../hooks/useTranslation';
import type { LinkItem } from '../types';

interface UrlInputProps {
  onAddLink: (link: LinkItem) => void;
}

export function UrlInput({ onAddLink }: UrlInputProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    if (!isValidUrl(url.trim())) {
      setError(t.errors.invalidUrl);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const metadata = await fetchUrlMetadata(url.trim());
      const newLink: LinkItem = {
        id: generateId(),
        url: metadata.url || url.trim(),
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        favicon: metadata.favicon || '',
        addedAt: new Date()
      };

      onAddLink(newLink);
      setUrl('');
    } catch (err) {
      setError(t.errors.fetchFailed);
      console.error('Error adding link:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          placeholder={t.main.urlPlaceholder}
          disabled={isLoading}
          className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}