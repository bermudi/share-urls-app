import React, { useState } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LinkList } from './components/LinkList';
import { BundleSettings } from './components/BundleSettings';
import { PublishButton } from './components/PublishButton';
import { BundleViewer } from './components/BundleViewer';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId } from './utils/urlUtils';
import type { LinkItem, Bundle } from './types';

function App() {
  const { theme, setTheme } = useTheme();
  const [links, setLinks] = useLocalStorage<LinkItem[]>('urllist-links', []);
  const [vanityUrl, setVanityUrl] = useLocalStorage<string>('urllist-vanity', '');
  const [description, setDescription] = useLocalStorage<string>('urllist-description', '');
  const [publishedBundle, setPublishedBundle] = useState<Bundle | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'viewer'>('editor');

  const handleAddLink = (link: LinkItem) => {
    setLinks(prevLinks => [...prevLinks, link]);
  };

  const handleReorderLinks = (reorderedLinks: LinkItem[]) => {
    setLinks(reorderedLinks);
  };

  const handleRemoveLink = (id: string) => {
    setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
  };

  const handleNewBundle = () => {
    setLinks([]);
    setVanityUrl('');
    setDescription('');
    setPublishedBundle(null);
    setViewMode('editor');
  };

  const handlePublish = (shareUrl: string) => {
    const bundle: Bundle = {
      id: generateId(),
      vanityUrl: vanityUrl || undefined,
      description: description || undefined,
      links: [...links],
      createdAt: new Date(),
      published: true
    };
    
    setPublishedBundle(bundle);
  };

  const canPublish = links.length > 0;
  const hasProgress = links.length > 0 || vanityUrl.trim() !== '' || description.trim() !== '';

  if (viewMode === 'viewer' && publishedBundle) {
    return (
      <BundleViewer 
        bundle={publishedBundle} 
        onBack={() => setViewMode('editor')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        theme={theme} 
        onThemeChange={setTheme} 
        onNewBundle={handleNewBundle}
        hasProgress={hasProgress}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Bundle Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <BundleSettings
              vanityUrl={vanityUrl}
              description={description}
              onVanityUrlChange={setVanityUrl}
              onDescriptionChange={setDescription}
            />
          </div>

          {/* URL Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Add Links
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter a URL and press Enter to add it to your bundle
              </p>
            </div>
            <UrlInput onAddLink={handleAddLink} />
          </div>

          {/* Link List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <LinkList
              links={links}
              onReorderLinks={handleReorderLinks}
              onRemoveLink={handleRemoveLink}
            />
          </div>

          {/* Publish Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Publish Bundle
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Make your link bundle available to share
                </p>
              </div>
              <PublishButton
                bundle={{ vanityUrl, description, links }}
                canPublish={canPublish}
                onPublish={handlePublish}
              />
            </div>
          </div>

          {/* Preview Button */}
          {publishedBundle && (
            <div className="text-center">
              <button
                onClick={() => setViewMode('viewer')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                <span>Preview Bundle</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;