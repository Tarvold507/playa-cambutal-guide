
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { supabaseNode } from './utils/supabaseNode';
import { generateSEOHead } from './utils/seoNode';
import type { PageSEO } from '@/hooks/usePageSEO';

export async function render(url: string) {
  console.log(`[SSG] Rendering ${url}...`);
  
  // Fetch SEO data for this route
  let seoData: PageSEO | null = null;
  try {
    const { data, error } = await supabaseNode
      .from('page_seo')
      .select('*')
      .eq('page_path', url)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn(`[SSG] Error fetching SEO for ${url}:`, error);
    } else if (data) {
      seoData = data;
      console.log(`[SSG] Found SEO data for ${url}`);
    } else {
      console.log(`[SSG] No SEO data found for ${url}`);
    }
  } catch (error) {
    console.warn(`[SSG] Failed to fetch SEO data for ${url}:`, error);
  }

  // Generate the React app HTML
  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  
  // Generate SEO head content
  const fallbackTitles: Record<string, string> = {
    '/': 'Playa Cambutal Guide - Ultimate Travel Guide to Cambutal, Panama',
    '/eat': 'Best Restaurants in Cambutal - Dining Guide | Playa Cambutal',
    '/stay': 'Hotels & Accommodations in Cambutal | Playa Cambutal Guide',
    '/do': 'Activities & Adventures in Cambutal | Playa Cambutal Guide',
    '/surf': 'Surfing in Cambutal - Wave Reports & Surf Guide | Playa Cambutal',
    '/blog': 'Cambutal Travel Blog - Tips & Stories | Playa Cambutal Guide',
    '/calendar': 'Events Calendar - Cambutal | Playa Cambutal Guide',
    '/transportation': 'Transportation to Cambutal | Playa Cambutal Guide',
    '/real-estate': 'Real Estate in Cambutal | Playa Cambutal Guide',
    '/info': 'Travel Information for Cambutal | Playa Cambutal Guide',
  };
  
  const seoHead = generateSEOHead(seoData, fallbackTitles[url]);
  
  return {
    html: appHtml,
    seoHead: seoHead
  };
}
