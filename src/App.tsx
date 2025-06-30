import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LinkList } from './components/LinkList';
import { BundleSettings } from './components/BundleSettings';
import { PublishButton } from './components/PublishButton';
import { BundleViewer } from './components/BundleViewer';
import { LanguageProvider } from './contexts/LanguageContext';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTranslation } from './hooks/useTranslation';
import { generateId } from './utils/urlUtils';
import { supabase } from './lib/supabase';
import type { LinkItem, Bundle } from './types';

function AppContent() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [links, setLinks] = useLocalStorage<LinkItem[]>('urllist-links', []);
  const [vanityUrl, setVanityUrl] = useLocalStorage<string>('urllist-vanity', '');
  const [description, setDescription] = useLocalStorage<string>('urllist-description', '');
  const [publishedBundle, setPublishedBundle] = useState<Bundle | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'viewer'>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [bundleNotFound, setBundleNotFound] = useState(false);

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
    setBundleNotFound(false);
    
    try {
      console.log('Loading bundle:', bundleId);
      
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
        console.log('Not found by vanity URL, trying by ID');
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
        setBundleNotFound(true);
        setIsLoading(false);
        return;
      }

      console.log('Bundle loaded:', bundle);

      // Convert to our Bundle type
      const loadedBundle: Bundle = {
        id: bundle.id,
        vanityUrl: bundle.vanity_url || undefined,
        description: bundle.description || undefined,
        links: bundle.bundle_links
          .sort((a: any, b: any) => a.position - b.position)
          .map((link: any) => ({
            id: link.id,
            url: link.url,
            title: link.title,
            description: link.description || '',
            favicon: link.favicon || '',
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
      setBundleNotFound(true);
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
    setBundleNotFound(false);
    // Clear URL
    window.history.pushState({}, '', '/');
  };

  const handlePublish = async (shareUrl: string) => {
    try {
      console.log('Publishing bundle...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Create bundle in database
      const bundleId = generateId();
      console.log('Generated bundle ID:', bundleId);
      
      const bundleData = {
        id: bundleId,
        vanity_url: vanityUrl || null,
        description: description || null,
        published: true,
        user_id: null // Explicitly set to null for anonymous users
      };
      
      console.log('Bundle data to insert:', bundleData);
      
      const { data: bundle, error: bundleError } = await supabase
        .from('bundles')
        .insert(bundleData)
        .select()
        .single();

      if (bundleError) {
        console.error('Error creating bundle:', bundleError);
        throw new Error(`Failed to create bundle: ${bundleError.message}`);
      }

      console.log('Bundle created:', bundle);

      // Create bundle links
      const linksToInsert = links.map((link, index) => ({
        bundle_id: bundleId,
        url: link.url,
        title: link.title,
        description: link.description || '',
        favicon: link.favicon || '',
        og_image: link.ogImage || null,
        position: index
      }));

      console.log('Links to insert:', linksToInsert);

      const { error: linksError } = await supabase
        .from('bundle_links')
        .insert(linksToInsert);

      if (linksError) {
        console.error('Error creating links:', linksError);
        throw new Error(`Failed to create links: ${linksError.message}`);
      }

      console.log('Links created successfully');

      const publishedBundleData: Bundle = {
        id: bundleId,
        vanityUrl: vanityUrl || undefined,
        description: description || undefined,
        links: [...links],
        createdAt: new Date(),
        published: true
      };
      
      setPublishedBundle(publishedBundleData);
      
      // Update URL to the published bundle
      const urlPath = vanityUrl || bundleId;
      window.history.pushState({}, '', `/${urlPath}`);
      
    } catch (err) {
      console.error('Error publishing bundle:', err);
      alert(`Failed to publish bundle: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err; // Re-throw to be caught by PublishButton
    }
  };

  const canPublish = links.length > 0;
  const hasProgress = links.length > 0 || vanityUrl.trim() !== '' || description.trim() !== '';

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">url</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t.errors.loadingBundle}</p>
        </div>
      </div>
    );
  }

  // Show bundle not found
  if (bundleNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">404</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.errors.bundleNotFound}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t.errors.bundleNotFoundDescription}
          </p>
          <button
            onClick={handleNewBundle}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors"
          >
            <span>{t.main.createNewBundle}</span>
          </button>
        </div>
      </div>
    );
  }

  // Show bundle viewer if we're viewing a published bundle
  if (viewMode === 'viewer' && publishedBundle) {
    return (
      <BundleViewer 
        bundle={publishedBundle} 
        onBack={handleNewBundle} 
      />
    );
  }

  // Show main editor interface
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
                    {t.main.publishBundle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {t.main.publishDescription}
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
                {t.main.addLinks}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t.main.addLinksDescription}
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
                <span>{t.main.previewBundle}</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;