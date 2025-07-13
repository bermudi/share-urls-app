import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { isValidUrl, normalizeUrl, fetchUrlMetadata, generateId } from '../utils/urlUtils';
import { useTranslation } from '../hooks/useTranslation';
import type { LinkItem } from '../types';

interface UrlInputProps {
  onAddLink: (link: LinkItem) => void;
  onUpdateLink?: (id: string, updatedLink: Partial<LinkItem>) => void;
}

export function UrlInput({ onAddLink, onUpdateLink }: UrlInputProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    const normalizedUrl = normalizeUrl(url.trim());

    // Validate URL
    if (!isValidUrl(normalizedUrl)) {
      setError(t.errors.invalidUrl);
      return;
    }

    setIsLoading(true);
    setError('');

    const linkId = generateId();

    // Add placeholder link immediately
    const placeholderLink: LinkItem = {
      id: linkId,
      url: normalizedUrl,
      title: 'Loading...',
      description: 'Fetching details...',
      favicon: '',
      addedAt: new Date(),
      isLoading: true,
    };
    onAddLink(placeholderLink);
    setUrl('');

    try {
      const metadata = await fetchUrlMetadata(normalizedUrl);

      const updatedLink: Partial<LinkItem> = {
        url: metadata.url || normalizedUrl,
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        favicon: metadata.favicon || '',
        ogImage: metadata.ogImage,
        wasRedirected: metadata.wasRedirected,
        originalUrl: metadata.originalUrl,
        isLoading: false,
      };

      onUpdateLink?.(linkId, updatedLink);
    } catch (err) {
      console.error('Error fetching metadata:', err);
      onUpdateLink?.(linkId, {
        title: `Error loading ${new URL(normalizedUrl).hostname}`,
        description: 'Could not load page information',
        isLoading: false,
      });
      setError(t.errors.fetchFailed);
    } finally {
      setIsLoading(false);
    }
  }; /* duplicate block removed */
    /* e.preventDefault();

    if (!url.trim()) return;

    // Normalize the URL first (add https:// if missing)
    const normalizedUrl = normalizeUrl(url.trim());

    // Then validate the normalized URL
    if (!isValidUrl(normalizedUrl)) {
      setError(t.errors.invalidUrl);
      return;
    }

    setIsLoading(true);
    setError('');

    const linkId = generateId();

    // If an update callback is provided, create a placeholder link first
    if (onUpdateLink) {
      const placeholderLink: LinkItem = {
        id: linkId,
        url: normalizedUrl,
        title: 'Loading...',
        description: 'Fetching details...',
        favicon: '',
        addedAt: new Date(),
        isLoading: true,
      };
      onAddLink(placeholderLink);
    }

    try {
      // Fetch metadata after submission
      const metadata = await fetchUrlMetadata(normalizedUrl);

      if (onUpdateLink) {
        onUpdateLink(linkId, {
          url: metadata.url || normalizedUrl,
          title: metadata.title || 'Untitled',
          description: metadata.description || '',
          favicon: metadata.favicon || '',
        url: metadata.url || normalizedUrl,
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        favicon: metadata.favicon || '',
        ogImage: metadata.ogImage,
        addedAt: new Date(),
        wasRedirected: metadata.wasRedirected,
        originalUrl: metadata.originalUrl,
        isLoading: false,
      };

      if (onUpdateLink) {
        const placeholderLink: LinkItem = {
          id: linkId,
          url: normalizedUrl,
          title: 'Loading...',
          description: 'Fetching details...',
          favicon: '',
          addedAt: new Date(),
          isLoading: true,
        };
        onAddLink(placeholderLink);
        onUpdateLink(linkId, finalLink);
      } else {
        onAddLink(finalLink);
      }

      // Clear the input after successful submission
      setUrl('');
    } catch (err) {
      setError(t.errors.fetchFailed);
      console.error('Error adding link:', err);
    } finally {
      setIsLoading(false);
    }
  };

  */
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