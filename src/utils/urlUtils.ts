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
  // In a real application, this would call a backend service to fetch metadata
  // For this demo, we'll simulate the metadata fetching
  const normalizedUrl = normalizeUrl(url);
  
  try {
    const domain = new URL(normalizedUrl).hostname;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock metadata based on domain patterns
    const mockMetadata = {
      'github.com': {
        title: 'GitHub Repository',
        description: 'Software development platform',
        favicon: 'https://github.com/favicon.ico'
      },
      'youtube.com': {
        title: 'YouTube Video',
        description: 'Video sharing platform',
        favicon: 'https://youtube.com/favicon.ico'
      },
      'twitter.com': {
        title: 'Twitter Post',
        description: 'Social media platform',
        favicon: 'https://twitter.com/favicon.ico'
      },
      'medium.com': {
        title: 'Medium Article',
        description: 'Publishing platform',
        favicon: 'https://medium.com/favicon.ico'
      }
    };

    const domainKey = Object.keys(mockMetadata).find(key => domain.includes(key));
    const metadata = domainKey ? mockMetadata[domainKey as keyof typeof mockMetadata] : {
      title: domain,
      description: 'Web page',
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    };

    return {
      url: normalizedUrl,
      title: metadata.title,
      description: metadata.description,
      favicon: metadata.favicon
    };
  } catch (error) {
    console.warn('Failed to fetch metadata for:', url, error);
    return {
      url: normalizedUrl,
      title: new URL(normalizedUrl).hostname,
      description: 'Web page',
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(normalizedUrl).hostname}&sz=32`
    };
  }
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