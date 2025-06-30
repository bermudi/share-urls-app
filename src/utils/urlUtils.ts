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

async function fetchPageMetadata(url: string): Promise<{
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
}> {
  try {
    // Use a CORS proxy to fetch the page content
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }
    
    const data = await response.json();
    const html = data.contents;
    
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract metadata
    const title = 
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent ||
      '';
    
    const description = 
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      '';
    
    // Get OG image
    const ogImage = 
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
      '';
    
    // Get favicon
    const favicon = 
      doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
      '';
    
    return {
      title: title.trim(),
      description: description.trim(),
      ogImage: ogImage ? new URL(ogImage, url).href : '',
      favicon: favicon ? new URL(favicon, url).href : ''
    };
  } catch (error) {
    console.warn('Failed to fetch page metadata:', error);
    return {};
  }
}

export async function fetchUrlMetadata(url: string): Promise<Partial<LinkItem>> {
  const normalizedUrl = normalizeUrl(url);
  
  try {
    const domain = new URL(normalizedUrl).hostname;
    
    // Try to fetch real metadata first
    const metadata = await fetchPageMetadata(normalizedUrl);
    
    // Fallback to Google's favicon service if no favicon found
    const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    
    // Use OG image if available, otherwise use favicon
    const imageUrl = metadata.ogImage || metadata.favicon || fallbackFavicon;
    
    return {
      url: normalizedUrl,
      title: metadata.title || domain,
      description: metadata.description || 'Web page',
      favicon: imageUrl,
      ogImage: metadata.ogImage // Store OG image separately for potential future use
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
    return `https://urllist.app/${vanityUrl}`;
  }
  return `https://urllist.app/${generateId()}`;
}

export function isValidVanityUrl(vanityUrl: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(vanityUrl) && vanityUrl.length >= 3 && vanityUrl.length <= 50;
}