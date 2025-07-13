import type { LinkItem } from '../types';
import { decodeHtmlEntities } from './htmlUtils';

export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Fetches metadata for a URL with immediate loading state
 * @param url The URL to fetch metadata for
 * @param onLoadingStateChange Optional callback for loading state changes (deprecated)
 * @returns Promise resolving to partial LinkItem with metadata
 */
export async function fetchUrlMetadata(
  url: string, 
  onLoadingStateChange?: (state: { isLoading: boolean, url: string, preliminaryData?: Partial<LinkItem> }) => void
): Promise<Partial<LinkItem>> {
  const normalizedUrl = normalizeUrl(url);
  
  // Validate URL – throw early if invalid
  if (!isValidUrl(normalizedUrl)) {
    throw new Error('Invalid URL');
  }

  // Provide preliminary metadata immediately
  const domain = new URL(normalizedUrl).hostname;
  const preliminaryData: Partial<LinkItem> = {
    url: normalizedUrl,
    title: `Loading ${domain}...`,
    description: 'Fetching page information...',
    favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  };

  // Notify consumer that we started fetching
  onLoadingStateChange?.({ isLoading: true, url: normalizedUrl, preliminaryData });

  try {

    // Use our Supabase edge function to fetch metadata
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ url: normalizedUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const metadata = await response.json();

    if (metadata.error) {
      throw new Error(metadata.error);
    }



    // Handle redirects from the edge function
    const finalData = {
      url: metadata.url,
      title: decodeHtmlEntities(metadata.title),
      description: decodeHtmlEntities(metadata.description),
      favicon: metadata.favicon,
      ogImage: metadata.ogImage,
      originalUrl: metadata.originalUrl,
      wasRedirected: metadata.wasRedirected
    };
    
    // Notify that loading is complete with the final data
    onLoadingStateChange?.({ isLoading: false, url: normalizedUrl, preliminaryData: finalData });
    
    return finalData;
  } catch (error) {
    console.warn('Failed to fetch metadata for:', url, error);

    // Enhanced fallback with better domain-specific defaults
    const domain = new URL(normalizedUrl).hostname;
    const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

    // Enhanced domain-specific metadata
    const domainMetadata = getDomainSpecificMetadata(domain);

    const fallbackData = {
      url: normalizedUrl,
      title: domainMetadata.title || domain,
      description: domainMetadata.description || 'Web page',
      favicon: fallbackFavicon
    };
    
    // Notify that loading failed but we have fallback data
    onLoadingStateChange?.({ isLoading: false, url: normalizedUrl, preliminaryData: fallbackData });
    
    return fallbackData;
  }
}

/**
 * Extracts a clean domain name from a URL string
 * @param domain - The domain to process
 * @returns Object containing title and description derived from the domain
 */
function getDomainSpecificMetadata(domain: string): { title: string; description: string } {
  if (!domain) {
    return {
      title: 'Unknown Source',
      description: 'No domain information available'
    };
  }

  // Remove common subdomains and protocol
  const cleanDomain = domain
    .replace(/^(https?:\/\/)?(www\.)?/i, '') // Remove protocol and www
    .split('/')[0] // Get only the domain part
    .split(':')[0]; // Remove port if present

  // Handle empty or invalid domains
  if (!cleanDomain) {
    return {
      title: 'Invalid URL',
      description: 'The provided URL is not valid'
    };
  }

  // Return the cleaned domain as title and a generic description
  return {
    title: cleanDomain,
    description: 'Web page'
  };
}

// Word lists for generating friendly URLs
const adjectives = [
  'amazing', 'awesome', 'brilliant', 'creative', 'dynamic', 'elegant', 'fantastic', 'gorgeous',
  'incredible', 'inspiring', 'magical', 'outstanding', 'perfect', 'radiant', 'spectacular', 'stunning',
  'wonderful', 'bright', 'clever', 'cool', 'epic', 'fresh', 'great', 'happy', 'lovely', 'nice',
  'smart', 'super', 'swift', 'vivid', 'bold', 'calm', 'cozy', 'cute', 'fair', 'fine', 'fun',
  'good', 'kind', 'neat', 'pure', 'rich', 'safe', 'warm', 'wise', 'blue', 'gold', 'pink', 'red',
  'adventurous', 'agile', 'artful', 'breezy', 'bubbly', 'cheerful', 'chill', 'classy', 'colorful', 'crisp',
  'daring', 'delightful', 'dreamy', 'earthy', 'enchanting', 'energetic', 'feisty', 'festive', 'fiery', 'gentle',
  'glowing', 'harmonious', 'hearty', 'hopeful', 'jolly', 'joyful', 'lively', 'lucky', 'lush', 'mellow',
  'mighty', 'modern', 'noble', 'peaceful', 'playful', 'plucky', 'polished', 'quick', 'quirky', 'refined',
  'robust', 'shiny', 'sleek', 'snappy', 'solid', 'sparkling', 'spunky', 'spry', 'steady', 'stellar',
  'sunny', 'tidy', 'upbeat', 'vibrant', 'zesty', 'zippy', 'zealous', 'whimsical', 'witty', 'youthful'
];

const nouns = [
  'links', 'bundle', 'collection', 'list', 'pack', 'set', 'group', 'hub', 'vault', 'box',
  'deck', 'stack', 'pile', 'batch', 'cluster', 'suite', 'kit', 'mix', 'blend', 'combo',
  'galaxy', 'universe', 'world', 'space', 'zone', 'realm', 'place', 'spot', 'corner', 'nook',
  'garden', 'forest', 'ocean', 'river', 'mountain', 'valley', 'bridge', 'path', 'road', 'trail',
  'treasure', 'gem', 'pearl', 'crystal', 'diamond', 'star', 'moon', 'sun', 'cloud', 'rainbow',
  'archive', 'library', 'library', 'shelf', 'folder', 'album', 'portfolio', 'case', 'locker',
  'basket', 'crate', 'canister', 'cabinet', 'drawer', 'satchel', 'briefcase', 'pouch', 'parcel',
  'bin', 'chest', 'safe', 'repository', 'stash', 'cache', 'reservoir', 'lake', 'pond', 'island',
  'haven', 'refuge', 'sanctuary', 'oasis', 'field', 'meadow', 'grove', 'spring', 'bay', 'harbor',
  'port', 'dock', 'station', 'outpost', 'camp', 'base', 'node', 'array', 'matrix', 'network',
  'web', 'mesh', 'tangle', 'cluster', 'ring', 'circle', 'sphere', 'cube', 'block', 'module',
  'panel', 'tab', 'card', 'scroll', 'folio', 'page', 'leaf', 'record', 'entry', 'log', 'note',
  'journal', 'chronicle', 'timeline', 'story', 'tale', 'legend', 'myth', 'saga', 'epic', 'quest',
  'expedition', 'venture', 'mission', 'journey', 'adventure', 'voyage', 'flight', 'excursion',
  'explorer', 'navigator', 'pilot', 'captain', 'guide', 'oracle', 'beacon', 'signal', 'marker',
  'flag', 'pin', 'tag', 'badge', 'stamp', 'seal', 'token', 'medal', 'award', 'prize', 'trophy'
];

export function generateFriendlyId(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  // Use timestamp + random for better uniqueness
  const timestamp = Date.now().toString().slice(-3); // Last 3 digits of timestamp
  const random = Math.floor(Math.random() * 99) + 1;

  return `${adjective}-${noun}-${timestamp}${random}`;
}

export function generateId(): string {
  // Generate a proper UUID v4 (kept for backward compatibility)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function generateShortUrl(vanityUrl?: string): string {
  try {
    // Ensure window is available (for SSR)
    if (typeof window === 'undefined') {
      throw new Error('Window object not available');
    }

    // Get the base URL
    const baseUrl = window.location.origin;

    // If no vanity URL provided, generate a friendly ID
    if (!vanityUrl) {
      return `${baseUrl}/${generateFriendlyId()}`;
    }

    // Clean up the vanity URL
    const cleanVanity = vanityUrl
      .replace(/^\/+/, '') // Remove leading slashes
      .split('/')[0] // Take only the first path segment
      .replace(/[^a-zA-Z0-9-_]/g, '') // Remove invalid characters
      .substring(0, 50); // Limit length

    // If we ended up with an empty string, generate a friendly ID
    if (!cleanVanity) {
      console.warn('Invalid vanity URL provided, generating a random one');
      return `${baseUrl}/${generateFriendlyId()}`;
    }

    return `${baseUrl}/${cleanVanity}`;
  } catch (error) {
    console.error('Error generating short URL:', error);
    // Fallback to a random ID if anything goes wrong
    return `https://example.com/${generateFriendlyId()}`;
  }
}

/**
 * Validates a vanity URL segment
 * - Must be 3-50 characters long
 * - Can only contain letters, numbers, hyphens, and underscores
 * - Cannot start or end with a hyphen or underscore
 */
export function isValidVanityUrl(vanityUrl: string): boolean {
  if (!vanityUrl) return false;
  
  // Must be between 3 and 50 characters
  if (vanityUrl.length < 3 || vanityUrl.length > 50) {
    return false;
  }
  
  // Can only contain letters, numbers, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(vanityUrl)) {
    return false;
  }
  
  // Cannot start or end with a hyphen or underscore
  if (/^[-_]|[-_]$/.test(vanityUrl)) {
    return false;
  }
  
  return true;
}

export async function isVanityUrlAvailable(vanityUrl: string): Promise<boolean> {
  if (!isValidVanityUrl(vanityUrl)) {
    return false;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bundles?vanity_url=eq.${encodeURIComponent(vanityUrl)}&select=id`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.length === 0; // If no bundles found with this vanity URL, it's available
  } catch (error) {
    console.error('Error checking vanity URL availability:', error);
    return false; // On error, assume URL is not available to prevent false positives
  }
}