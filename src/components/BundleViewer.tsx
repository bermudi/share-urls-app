import { useState } from 'react';
import { ExternalLink, Calendar, ArrowLeft } from 'lucide-react';
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
      return `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`;
    }
    return link.favicon;
  };

  const isLargeImage = (link: typeof bundle.links[0]) => {
    // Check if this looks like an OG image (typically larger)
    return link.ogImage && link.favicon === link.ogImage && !imageErrors.has(link.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.viewer.backToEditor}</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">url</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t.viewer.linkBundle}
            </h1>
            {bundle.description && (
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {decodeHtmlEntities(bundle.description)}
              </p>
            )}
            <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{t.viewer.created} {bundle.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            {bundle.links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 hover:shadow-md transition-all duration-200"
              >
                {/* Index */}
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {index + 1}
                </div>

                {/* Image/Favicon */}
                <div className="flex-shrink-0">
                  {isLargeImage(link) ? (
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={getImageSrc(link)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(link.id)}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={getImageSrc(link)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(link.id)}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {decodeHtmlEntities(link.title)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {link.description ? decodeHtmlEntities(link.description) : new URL(link.url).hostname}
                  </p>
                </div>

                {/* External Link Icon */}
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.viewer.madeWith}{' '}
              <a
                href="/"
                className="text-teal-500 hover:text-teal-600 transition-colors font-medium"
              >
                UrlList
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}