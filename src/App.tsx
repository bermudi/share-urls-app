import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LinkList } from './components/LinkList';
import { BundleSettings } from './components/BundleSettings';
import { PublishButton } from './components/PublishButton';
import { BundleViewer } from './components/BundleViewer';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId } from './utils/urlUtils';
import { supabase } from './lib/supabase';
import type { LinkItem, Bundle } from './types';

function App() {
  const { theme, setTheme } = useTheme();
  const [links, setLinks] = useLocalStorage<LinkItem[]>('urllist-links', []);
  const [vanityUrl, setVanityUrl] = useLocalStorage<string>('urllist-vanity', '');
  const [description, setDescription] = useLocalStorage<string>('urllist-description', '');
  const [publishedBundle, setPublishedBundle] = useState<Bundle | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'viewer'>('editor');
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're viewing a specific bundle from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/') {
      const bundleId = path.substring(1); // Remove leading slash
      loadPublicBundle(bundleId);
    }
  }, []);

  const loadPublicBundle = async (bundleId: string) => {
    setIsLoading(true);
    try {
      // Try to load by vanity URL first, then by ID
      let { data: bundle, error } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_links (*)
        `)
        .eq('vanity_url', bundleId)
        .eq('published', true)
        .single();

      if (error && error.code === 'PGRST116') {
        // Not found by vanity URL, try by ID
        const { data: bundleById, error: errorById } = await supabase
          .from('bundles')
          .select(`
            *,
            bundle_links (*)
          `)
          .eq('id', bundleId)
          .eq('published', true)
          .single();

        bundle = bundleById;
        error = errorById;
      }

      if (error || !bundle) {
        console.error('Bundle not found:', error);
        return;
      }

      // Convert to our Bundle type
      const loadedBundle: Bundle = {
        id: bundle.id,
        vanityUrl: bundle.vanity_url || undefined,
        description: bundle.description || undefined,
        links: bundle.bundle_links
          .sort((a, b) => a.position - b.position)
          .map(link => ({
            id: link.id,
            url: link.url,
            title: link.title,
            description: link.description,
            favicon: link.favicon,
            ogImage: link.og_image || undefined,
            addedAt: new Date(link.created_at)
          })),
        createdAt: new Date(bundle.created_at),
        published: bundle.published
      };

      setPublishedBundle(loadedBundle);
      setViewMode('viewer');
    } catch (err) {
      console.error('Error loading bundle:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
    // Clear URL
    window.history.pushState({}, '', '/');
  };

  const handlePublish = async (shareUrl: string) => {
    try {
      // Create bundle in database
      const bundleId = generateId();
      const { data: bundle, error: bundleError } = await supabase
        .from('bundles')
        .insert({
          id: bundleId,
          vanity_url: vanityUrl || null,
          description: description || null,
          published: true
        })
        .select()
        .single();

      if (bundleError) {
        console.error('Error creating bundle:', bundleError);
        return;
      }

      // Create bundle links
      const linksToInsert = links.map((link, index) => ({
        bundle_id: bundleId,
        url: link.url,
        title: link.title,
        description: link.description,
        favicon: link.favicon,
        og_image: link.ogImage || null,
        position: index
      }));

      const { error: linksError } = await supabase
        .from('bundle_links')
        .insert(linksToInsert);

      if (linksError) {
        console.error('Error creating links:', linksError);
        return;
      }

      const publishedBundleData: Bundle = {
        id: bundleId,
        vanityUrl: vanityUrl || undefined,
        description: description || undefined,
        links: [...links],
        createdAt: new Date(),
        published: true
      };
      
      setPublishedBundle(publishedBundleData);
    } catch (err) {
      console.error('Error publishing bundle:', err);
    }
  };

  const canPublish = links.length > 0;
  const hasProgress = links.length > 0 || vanityUrl.trim() !== '' || description.trim() !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">url</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading bundle...</p>
        </div>
      </div>
    );
  }

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
          {/* Bundle Settings with Publish Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <BundleSettings
              vanityUrl={vanityUrl}
              description={description}
              onVanityUrlChange={setVanityUrl}
              onDescriptionChange={setDescription}
            />
            
            {/* Publish Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Publish Bundle
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Make your link bundle available to share with anyone
                  </p>
                </div>
                <PublishButton
                  bundle={{ vanityUrl, description, links }}
                  canPublish={canPublish}
                  onPublish={handlePublish}
                />
              </div>
            </div>
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