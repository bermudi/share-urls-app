import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define interfaces for request and response
interface MetadataRequest {
  url: string;
}

interface MetadataResponse {
  url: string;
  title: string;
  description: string;
  favicon: string;
  ogImage: string | null;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Structured logging interface
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

// Initialize Supabase client for logging
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Structured logger
const logger = {
  info: (message: string, data?: Record<string, unknown>) => log('info', message, data),
  warn: (message: string, data?: Record<string, unknown>) => log('warn', message, data),
  error: (message: string, data?: Record<string, unknown>) => log('error', message, data)
};

async function log(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>) {
  const logEntry: LogEntry = {
    level,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  
  console[level](JSON.stringify(logEntry));
  
  // Log to Supabase if credentials are available
  if (supabaseUrl && supabaseKey) {
    try {
      await supabase.from('function_logs').insert(logEntry);
    } catch (error) {
      console.error('Failed to log to Supabase:', error);
    }
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json() as MetadataRequest;
    const { url } = requestData;

    if (!url) {
      logger.warn('Missing URL parameter');
      return new Response(
        JSON.stringify({ error: 'URL is required' } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (error) {
      logger.warn('Invalid URL provided', { url });
      return new Response(
        JSON.stringify({ error: 'Invalid URL' } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    logger.info('Fetching metadata', { url: targetUrl.href });
    
    // Set up AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      // Fetch the page with timeout
      const response = await fetch(targetUrl.href, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UrlList-Bot/1.0)',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      // Limit HTML size to 1MB to prevent DoS from large pages
      const html = (await response.text()).slice(0, 1e6);

    // Parse HTML using deno-dom instead of regex
    let title = '';
    let description = '';
    let ogImage = '';
    let favicon = '';
    
    try {
      const document = new DOMParser().parseFromString(html, 'text/html');
      
      if (document) {
        // Extract title (prioritize og:title > twitter:title > title tag)
        const ogTitleEl = document.querySelector('meta[property="og:title"]');
        const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
        const titleEl = document.querySelector('title');
        
        title = ogTitleEl?.getAttribute('content') || 
                twitterTitleEl?.getAttribute('content') || 
                titleEl?.textContent || '';
        
        // Extract description
        const ogDescEl = document.querySelector('meta[property="og:description"]');
        const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
        const descEl = document.querySelector('meta[name="description"]');
        
        description = ogDescEl?.getAttribute('content') || 
                      twitterDescEl?.getAttribute('content') || 
                      descEl?.getAttribute('content') || '';
        
        // Extract image
        const ogImageEl = document.querySelector('meta[property="og:image"]');
        const twitterImageEl = document.querySelector('meta[name="twitter:image"]');
        
        ogImage = ogImageEl?.getAttribute('content') || 
                  twitterImageEl?.getAttribute('content') || '';
        
        // Extract favicon
        const faviconEl = document.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
        favicon = faviconEl?.getAttribute('href') || '';
      }
    } catch (error) {
      logger.warn('Error parsing HTML with deno-dom, falling back to regex', { error: error.message });
      
      // Fallback to regex if deno-dom fails
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i);
      const twitterTitleMatch = html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i);

      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
      const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i);
      const twitterDescMatch = html.match(/<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i);

      const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i);
      const twitterImageMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i);

      const faviconMatch = html.match(/<link[^>]*rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*href="([^"]*)"[^>]*>/i);
      
      title = (ogTitleMatch?.[1] || twitterTitleMatch?.[1] || titleMatch?.[1] || '').trim();
      description = (ogDescMatch?.[1] || twitterDescMatch?.[1] || descMatch?.[1] || '').trim();
      ogImage = ogImageMatch?.[1] || twitterImageMatch?.[1] || '';
      favicon = faviconMatch?.[1] || '';
    }

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (text: string): string => {
      if (!text) return text;
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
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    };

    // Clean metadata
    title = decodeHtmlEntities(title.trim());
    description = decodeHtmlEntities(description.trim());

    // Resolve relative URLs
    if (ogImage && !ogImage.startsWith('http')) {
      ogImage = new URL(ogImage, targetUrl.href).href;
    }
    if (favicon && !favicon.startsWith('http')) {
      favicon = new URL(favicon, targetUrl.href).href;
    }

    // Fallback favicon
    if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?domain=${targetUrl.hostname}&sz=32`;
    }

    const metadata: MetadataResponse = {
      url: targetUrl.href,
      title: title || targetUrl.hostname,
      description: description || 'Web page',
      favicon,
      ogImage: ogImage || null
    };
    
    logger.info('Successfully fetched metadata', { url: targetUrl.href });

    return new Response(
      JSON.stringify(metadata),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        logger.error('Request timeout', { url: targetUrl.href });
        throw new Error('Request timed out after 10 seconds');
      }
      throw fetchError;
    }

  } catch (error) {
    logger.error('Error fetching metadata', { error: error.message });

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch metadata',
        details: error.message
      } as ErrorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});