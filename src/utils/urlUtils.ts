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

    return {
      url: metadata.url,
      title: metadata.title,
      description: metadata.description,
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

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateShortUrl(vanityUrl?: string): string {
  if (vanityUrl) {
    return `${window.location.origin}/${vanityUrl}`;
  }
  return `${window.location.origin}/${generateId()}`;
}

export function isValidVanityUrl(vanityUrl: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(vanityUrl) && vanityUrl.length >= 3 && vanityUrl.length <= 50;
}