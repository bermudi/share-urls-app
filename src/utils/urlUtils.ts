import type { LinkItem } from '../types';

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

export async function fetchUrlMetadata(url: string): Promise<Partial<LinkItem>> {
  const normalizedUrl = normalizeUrl(url);
  
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

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (text: string) => {
      if (!text) return text;
      
      // First try the textarea method for comprehensive decoding
      try {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
      } catch {
        // Fallback to manual decoding if textarea method fails
        return text
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&#x2F;/g, '/')
          .replace(/&#x3C;/g, '<')
          .replace(/&#x3E;/g, '>')
          .replace(/&#x26;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec)))
          .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      }
    };

    return {
      url: metadata.url,
      title: decodeHtmlEntities(metadata.title),
      description: decodeHtmlEntities(metadata.description),
      favicon: metadata.favicon,
      ogImage: metadata.ogImage
    };
  } catch (error) {
    console.warn('Failed to fetch metadata for:', url, error);
    
    // Enhanced fallback with better domain-specific defaults
    const domain = new URL(normalizedUrl).hostname;
    const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    
    // Enhanced domain-specific metadata
    const domainMetadata = getDomainSpecificMetadata(domain);
    
    return {
      url: normalizedUrl,
      title: domainMetadata.title || domain,
      description: domainMetadata.description || 'Web page',
      favicon: fallbackFavicon
    };
  }
}

function getDomainSpecificMetadata(domain: string): { title: string; description: string } {
  const domainPatterns = {
    'github.com': {
      title: 'GitHub Repository',
      description: 'Code repository and collaboration platform'
    },
    'youtube.com': {
      title: 'YouTube Video',
      description: 'Video content on YouTube'
    },
    'youtu.be': {
      title: 'YouTube Video',
      description: 'Video content on YouTube'
    },
    'twitter.com': {
      title: 'Twitter Post',
      description: 'Social media post on Twitter'
    },
    'x.com': {
      title: 'X Post',
      description: 'Social media post on X'
    },
    'medium.com': {
      title: 'Medium Article',
      description: 'Article on Medium publishing platform'
    },
    'linkedin.com': {
      title: 'LinkedIn Post',
      description: 'Professional content on LinkedIn'
    },
    'reddit.com': {
      title: 'Reddit Post',
      description: 'Discussion thread on Reddit'
    },
    'stackoverflow.com': {
      title: 'Stack Overflow Question',
      description: 'Programming Q&A on Stack Overflow'
    },
    'dev.to': {
      title: 'Dev.to Article',
      description: 'Developer article on Dev.to'
    },
    'hashnode.com': {
      title: 'Hashnode Article',
      description: 'Developer blog post on Hashnode'
    },
    'notion.so': {
      title: 'Notion Page',
      description: 'Document or workspace on Notion'
    },
    'figma.com': {
      title: 'Figma Design',
      description: 'Design file on Figma'
    },
    'dribbble.com': {
      title: 'Dribbble Shot',
      description: 'Design showcase on Dribbble'
    },
    'behance.net': {
      title: 'Behance Project',
      description: 'Creative project on Behance'
    }
  };

  const matchedPattern = Object.keys(domainPatterns).find(pattern => 
    domain.includes(pattern)
  );

  if (matchedPattern) {
    return domainPatterns[matchedPattern as keyof typeof domainPatterns];
  }

  return {
    title: domain.replace('www.', ''),
    description: 'Web page'
  };
}

// Word lists for generating friendly URLs
const adjectives = [
  'amazing', 'awesome', 'brilliant', 'creative', 'dynamic', 'elegant', 'fantastic', 'gorgeous',
  'incredible', 'inspiring', 'magical', 'outstanding', 'perfect', 'radiant', 'spectacular', 'stunning',
  'wonderful', 'bright', 'clever', 'cool', 'epic', 'fresh', 'great', 'happy', 'lovely', 'nice',
  'smart', 'super', 'swift', 'vivid', 'bold', 'calm', 'cozy', 'cute', 'fair', 'fine', 'fun',
  'good', 'kind', 'neat', 'pure', 'rich', 'safe', 'warm', 'wise', 'blue', 'gold', 'pink', 'red'
];

const nouns = [
  'links', 'bundle', 'collection', 'list', 'pack', 'set', 'group', 'hub', 'vault', 'box',
  'deck', 'stack', 'pile', 'batch', 'cluster', 'suite', 'kit', 'mix', 'blend', 'combo',
  'galaxy', 'universe', 'world', 'space', 'zone', 'realm', 'place', 'spot', 'corner', 'nook',
  'garden', 'forest', 'ocean', 'river', 'mountain', 'valley', 'bridge', 'path', 'road', 'trail',
  'treasure', 'gem', 'pearl', 'crystal', 'diamond', 'star', 'moon', 'sun', 'cloud', 'rainbow'
];

export function generateFriendlyId(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  // Use timestamp + random for better uniqueness
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
  const random = Math.floor(Math.random() * 99) + 1;
  
  return `${adjective}-${noun}-${timestamp}${random}`;
}

export function generateId(): string {
  // Generate a proper UUID v4 (kept for backward compatibility)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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
  return (
    typeof vanityUrl === 'string' &&
    /^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/.test(vanityUrl) &&
    vanityUrl.length >= 3 &&
    vanityUrl.length <= 50
  );
}