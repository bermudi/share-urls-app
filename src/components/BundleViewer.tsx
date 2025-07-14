import { useState } from 'react';
import { ExternalLink, Calendar, ArrowLeft, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { decodeHtmlEntities } from '../utils/htmlUtils';
import type { Bundle } from '../types';

interface BundleViewerProps {
  bundle: Bundle;
  onBack: () => void;
  onRemix?: (bundle: Bundle) => void;
}

export function BundleViewer({ bundle, onBack, onRemix }: BundleViewerProps) {
  const { t } = useTranslation();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (linkId: string) => {
    setImageErrors(prev => new Set([...prev, linkId]));
  };

  const getImageSrc = (link: typeof bundle.links[0]) => {
    if (imageErrors.has(link.id)) {
      // Fallback to Google favicon service
      try {
        if (!link.url) return 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
        const hostname = new URL(link.url).hostname;
        return `https://www.google.com/s2/favicons?domain=${hostname || 'example.com'}&sz=32`;
      } catch (error) {
        return 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
      }
    }
    return link.favicon || 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
  };

  const isLargeImage = (link: typeof bundle.links[0]) => {
    // Check if this looks like an OG image (typically larger)
    return link.ogImage && link.favicon === link.ogImage && !imageErrors.has(link.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back and Remix Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.viewer.backToEditor}</span>
          </button>
          
          {onRemix && (
            <button
              onClick={() => onRemix(bundle)}
              className="inline-flex items-center space-x-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.viewer.remix}</span>
            </button>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
            <LinkIcon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.viewer.linkBundle}
          </h1>
          {bundle.description && (
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {decodeHtmlEntities(bundle.description)}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{t.viewer.created} {bundle.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {bundle.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                {/* Image/Favicon */}
                <div className="flex-shrink-0">
                  {isLargeImage(link) ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={getImageSrc(link)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(link.id)}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={getImageSrc(link)}
                        alt=""
                        className="w-6 h-6 object-contain"
                        onError={() => handleImageError(link.id)}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                      {decodeHtmlEntities(link.title || link.url)}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-teal-500 dark:text-gray-500 dark:group-hover:text-teal-400 transition-colors flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {(() => {
                      try {
                        if (!link.url) return '';
                        const hostname = new URL(link.url).hostname;
                        return hostname ? hostname.replace('www.', '') : '';
                      } catch (error) {
                        return link.url || '';
                      }
                    })()}
                  </p>
                  {link.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {decodeHtmlEntities(link.description)}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {`${bundle.links.length} ${bundle.links.length === 1 ? 'link' : 'links'}`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.viewer.madeWith}{' '}
            <a
              href="/"
              className="text-teal-500 hover:text-teal-600 transition-colors font-medium"
            >
              thesharing.link
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}