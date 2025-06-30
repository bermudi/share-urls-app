export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  favicon: string;
  addedAt: Date;
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