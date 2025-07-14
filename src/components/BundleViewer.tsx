import { useState } from 'react';
import { ExternalLink, Calendar, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { decodeHtmlEntities } from '../utils/htmlUtils';
import type { Bundle } from '../types';

interface BundleViewerProps {
  bundle: Bundle;
  onBack: () => void;
}

export function BundleViewer({ bundle, onBack }: BundleViewerProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.viewer.backToEditor}</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {t.viewer.linkBundle}
            </h1>
            {bundle.description && (
              <p className="text-indigo-100 max-w-md mx-auto text-sm">
                {decodeHtmlEntities(bundle.description)}
              </p>
            )}
            <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-indigo-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.viewer.created} {bundle.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Links */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {bundle.links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
              >
                {/* Index */}
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mr-3">
                  {index + 1}
                </div>

                {/* Image/Favicon */}
                <div className="flex-shrink-0 mr-3">
                  {isLargeImage(link) ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      <img
                        src={getImageSrc(link)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(link.id)}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      <img
                        src={getImageSrc(link)}
                        alt=""
                        className="w-4 h-4 object-contain"
                        onError={() => handleImageError(link.id)}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {decodeHtmlEntities(link.title || link.url)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
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
                </div>

                {/* External Link Icon */}
                <div className="text-gray-300 group-hover:text-indigo-500 dark:text-gray-500 dark:group-hover:text-indigo-400 transition-colors ml-2">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {`${bundle.links.length} ${bundle.links.length === 1 ? 'link' : 'links'}`}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
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
    </div>
  );
}