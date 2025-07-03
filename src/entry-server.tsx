
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for SSR
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function render(url: string) {
  try {
    console.log(`[SSR] Rendering ${url}`);
    
    // Fetch SEO data for the route
    let seoData = null;
    if (supabase) {
      try {
        const { data } = await supabase
          .from('page_seo')
          .select('*')
          .eq('page_path', url)
          .maybeSingle();
        seoData = data;
        console.log(`[SSR] Fetched SEO data for ${url}:`, !!seoData);
      } catch (seoError) {
        console.warn(`[SSR] Failed to fetch SEO data for ${url}:`, seoError.message);
      }
    }
    
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    );
    
    console.log(`[SSR] Successfully rendered ${url}, length: ${html.length}`);
    return { html, seoData };
  } catch (error) {
    console.error('[SSR] Error rendering', url, ':', error);
    
    // Return fallback with basic SEO structure
    return {
      html: `
        <div id="root">
          <div class="min-h-screen bg-white">
            <nav class="bg-white shadow-sm">
              <div class="container mx-auto px-4 py-4">
                <h1 class="text-xl font-bold text-gray-800">Playa Cambutal Guide</h1>
              </div>
            </nav>
            <main class="flex items-center justify-center min-h-screen">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Playa Cambutal Guide</h2>
                <p class="text-gray-600">Loading your ultimate travel guide to Panama's hidden paradise...</p>
                <p class="text-sm text-gray-500 mt-4">Discover the best hotels, restaurants, and activities in Cambutal, Panama.</p>
              </div>
            </main>
          </div>
        </div>
      `,
      seoData: null
    };
  }
}

export default { render };
