import { useState, useEffect } from 'react';
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
  const [preliminaryData, setPreliminaryData] = useState<Partial<LinkItem> | null>(null);

  // Handle URL input changes with debounce for preliminary data
  useEffect(() => {
    // Clear preliminary data when URL is empty
    if (!url.trim()) {
      setPreliminaryData(null);
      return;
    }
    
    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(url.trim());
    if (!isValidUrl(normalizedUrl)) {
      setPreliminaryData(null);
      return;
    }
    
    // Set a small timeout to avoid fetching on every keystroke
    const timer = setTimeout(() => {
      // Only fetch preliminary data if URL is valid
      fetchUrlMetadata(normalizedUrl, ({ preliminaryData }) => {
        if (preliminaryData) {
          setPreliminaryData(preliminaryData);
        }
      });
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    
    // Generate a consistent ID for this link
    const linkId = generateId();
    
    // If we already have preliminary data, add it immediately
    if (preliminaryData) {
      const preliminaryLink: LinkItem = {
        id: linkId,
        url: preliminaryData.url || normalizedUrl,
        title: preliminaryData.title || 'Loading...',
        description: preliminaryData.description || 'Fetching details...',
        favicon: preliminaryData.favicon || '',
        addedAt: new Date()
      };
      
      // Add the preliminary link immediately for better UX
      onAddLink(preliminaryLink);
    }

    try {
      // Store whether we added a preliminary link
      const addedPreliminaryLink = !!preliminaryData;
      
      try {
        // Fetch the full metadata
        const metadata = await fetchUrlMetadata(normalizedUrl);
        
        // Once we have the final metadata, update the link
        if (onUpdateLink && addedPreliminaryLink) {
          // Update the existing link with final data
          onUpdateLink(linkId, {
            url: metadata.url || normalizedUrl,
            title: metadata.title || 'Untitled',
            description: metadata.description || '',
            favicon: metadata.favicon || '',
            ogImage: metadata.ogImage,
            wasRedirected: metadata.wasRedirected,
            originalUrl: metadata.originalUrl
          });
        } else {
          // If no update function provided or no preliminary data was added,
          // create a new link with the final data
          const finalLink: LinkItem = {
            id: linkId,
            url: metadata.url || normalizedUrl,
            title: metadata.title || 'Untitled',
            description: metadata.description || '',
            favicon: metadata.favicon || '',
            ogImage: metadata.ogImage,
            addedAt: new Date(),
            wasRedirected: metadata.wasRedirected,
            originalUrl: metadata.originalUrl
          };
          
          onAddLink(finalLink);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
        // If there was an error and we already added a preliminary link,
        // update it with an error state
        if (onUpdateLink && addedPreliminaryLink) {
          onUpdateLink(linkId, {
            title: `Error loading ${new URL(normalizedUrl).hostname}`,
            description: 'Could not load page information'
          });
        }
      }
      
      // Clear the input after successful submission
      setUrl('');
      setPreliminaryData(null);
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
      
      {preliminaryData && !error && (
        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
          <div className="flex items-center">
            {preliminaryData.favicon && (
              <img src={preliminaryData.favicon} alt="" className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm font-medium">{preliminaryData.title}</span>
          </div>
          {preliminaryData.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {preliminaryData.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}