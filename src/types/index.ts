export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  favicon: string;
  ogImage?: string; // Optional OG image for richer previews
  addedAt: Date;
  wasRedirected?: boolean; // Flag indicating if the URL was redirected
  originalUrl?: string; // Original URL before redirects
}

export interface Bundle {
  id: string;
  vanityUrl?: string;
  description?: string;
  links: LinkItem[];
  createdAt: Date;
  published: boolean;
}

export type Theme = 'light' | 'dark' | 'system';