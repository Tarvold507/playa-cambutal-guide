
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Common crawler user agents
const CRAWLER_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'screaming frog',
  'semrushbot',
  'ahrefsbot',
  'mj12bot',
  'dotbot',
  'crawler',
  'spider',
  'bot'
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

async function getStaticHTMLContent(path: string): Promise<string | null> {
  try {
    // Try to get SEO data from database first
    const { data: seoData, error } = await supabase
      .from('page_seo')
      .select('*')
      .eq('page_path', path)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
    }

    // Generate HTML with SEO data
    if (seoData) {
      return generateSEOHTML(seoData, path);
    }

    // Fallback to basic HTML if no SEO data found
    return generateBasicHTML(path);
  } catch (error) {
    console.error('Error getting static content:', error);
    return null;
  }
}

function generateSEOHTML(seoData: any, path: string): string {
  const domain = 'https://playacambutalguide.com';
  const canonicalUrl = seoData.canonical_url || `${domain}${path}`;
  
  const generateSchema = () => {
    if (seoData.schema_markup) {
      return JSON.stringify(seoData.schema_markup, null, 2);
    }
    
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": seoData.page_title,
      "description": seoData.meta_description,
      "url": canonicalUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Playa Cambutal Guide",
        "url": domain
      }
    };
    
    return JSON.stringify(defaultSchema, null, 2);
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seoData.page_title}</title>
    <meta name="description" content="${seoData.meta_description || ''}">
    ${seoData.meta_keywords ? `<meta name="keywords" content="${seoData.meta_keywords}">` : ''}
    <link rel="canonical" href="${canonicalUrl}">
    ${seoData.robots ? `<meta name="robots" content="${seoData.robots}">` : '<meta name="robots" content="index, follow">'}
    
    <!-- Open Graph tags -->
    <meta property="og:title" content="${seoData.og_title || seoData.page_title}">
    <meta property="og:description" content="${seoData.og_description || seoData.meta_description || ''}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    ${seoData.og_image ? `<meta property="og:image" content="${seoData.og_image}">` : ''}
    <meta property="og:site_name" content="Playa Cambutal Guide">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoData.twitter_title || seoData.page_title}">
    <meta name="twitter:description" content="${seoData.twitter_description || seoData.meta_description || ''}">
    ${seoData.twitter_image ? `<meta name="twitter:image" content="${seoData.twitter_image}">` : ''}
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${generateSchema()}
    </script>
</head>
<body>
    <header>
        <h1>${seoData.page_title}</h1>
    </header>
    
    <main>
        <p>${seoData.meta_description || 'Loading content...'}</p>
        
        <nav>
            <ul>
                <li><a href="/">Home - Playa Cambutal Guide</a></li>
                <li><a href="/eat">Restaurants & Dining</a></li>
                <li><a href="/stay">Hotels & Accommodation</a></li>
                <li><a href="/do">Activities & Adventures</a></li>
                <li><a href="/surf">Surfing Guide</a></li>
                <li><a href="/calendar">Events Calendar</a></li>
                <li><a href="/blog">Travel Blog</a></li>
            </ul>
        </nav>

        ${generatePageSpecificContent(path)}
    </main>

    <footer>
        <p>&copy; 2024 Playa Cambutal Guide. Your complete guide to Cambutal, Panama.</p>
    </footer>
</body>
</html>`;
}

function generateBasicHTML(path: string): string {
  const pageTitle = getPageTitle(path);
  const pageDescription = getPageDescription(path);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}">
    <link rel="canonical" href="https://playacambutalguide.com${path}">
    <meta name="robots" content="index, follow">
</head>
<body>
    <h1>${pageTitle}</h1>
    <p>${pageDescription}</p>
    
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/eat">Restaurants</a></li>
            <li><a href="/stay">Hotels</a></li>
            <li><a href="/do">Activities</a></li>
            <li><a href="/surf">Surfing</a></li>
        </ul>
    </nav>

    ${generatePageSpecificContent(path)}
</body>
</html>`;
}

function getPageTitle(path: string): string {
  if (path === '/') return 'Playa Cambutal Guide - Ultimate Travel Guide to Cambutal, Panama';
  if (path === '/eat') return 'Best Restaurants in Cambutal, Panama - Dining Guide';
  if (path === '/stay') return 'Best Hotels in Cambutal, Panama - Accommodation Guide';
  if (path === '/do') return 'Activities & Adventures in Playa Cambutal - Things to Do';
  if (path === '/surf') return 'Surfing in Playa Cambutal - Complete Surf Guide for Panama';
  if (path === '/blog') return 'Travel Blog - Playa Cambutal Guide';
  if (path === '/calendar') return 'Events Calendar - Playa Cambutal';
  return 'Playa Cambutal Guide';
}

function getPageDescription(path: string): string {
  if (path === '/') return 'Discover Playa Cambutal, Panama\'s hidden paradise. Your complete guide to surfing, hotels, restaurants, and activities in Cambutal.';
  if (path === '/eat') return 'Discover the best restaurants and dining options in Playa Cambutal, Panama. From local cuisine to international flavors.';
  if (path === '/stay') return 'Find the perfect place to stay in Playa Cambutal, Panama. Browse hotels, hostels, and vacation rentals.';
  if (path === '/do') return 'Discover exciting activities and adventures in Playa Cambutal, Panama. From surfing to hiking.';
  if (path === '/surf') return 'Complete surfing guide for Playa Cambutal, Panama. Learn about surf conditions and best spots.';
  if (path === '/blog') return 'Read our travel blog about Playa Cambutal, Panama. Get insider tips and travel stories.';
  if (path === '/calendar') return 'Discover events and activities happening in Playa Cambutal, Panama.';
  return 'Complete travel guide to Playa Cambutal, Panama';
}

function generatePageSpecificContent(path: string): string {
  if (path.startsWith('/eat/')) {
    return `
    <section>
        <h2>Restaurant Information</h2>
        <p>This restaurant is located in beautiful Playa Cambutal, Panama.</p>
        <a href="/eat">← Back to All Restaurants</a>
    </section>`;
  }
  
  if (path.startsWith('/stay/')) {
    return `
    <section>
        <h2>Hotel Information</h2>
        <p>This accommodation is located in beautiful Playa Cambutal, Panama.</p>
        <a href="/stay">← Back to All Hotels</a>
    </section>`;
  }
  
  if (path.startsWith('/do/')) {
    return `
    <section>
        <h2>Activity Information</h2>
        <p>This activity is available in beautiful Playa Cambutal, Panama.</p>
        <a href="/do">← Back to All Activities</a>
    </section>`;
  }
  
  return `
  <section>
      <h2>Welcome to Playa Cambutal</h2>
      <p>Explore Panama's hidden paradise with our comprehensive travel guide.</p>
  </section>`;
}

serve(async (req) => {
  console.log('🔍 Page Router - Processing request:', req.url);
  console.log('🔍 Page Router - Method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const userAgent = req.headers.get('user-agent') || '';
    
    console.log('📍 Page Router - Path:', path);
    console.log('🤖 Page Router - User agent:', userAgent);
    console.log('🤖 Page Router - Is crawler:', isCrawler(userAgent));

    // If it's a crawler, serve static HTML content
    if (isCrawler(userAgent)) {
      console.log('🤖 Serving SEO content for crawler');
      
      const staticContent = await getStaticHTMLContent(path);
      
      if (staticContent) {
        console.log('✅ Page Router - Returning static SEO HTML');
        return new Response(staticContent, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    }

    // For human users or if static content failed, redirect to React app
    console.log('👤 Redirecting to React app');
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': `https://playacambutalguide.com${path}`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('❌ Page Router - Error:', error);
    
    // Fallback HTML
    const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playa Cambutal Guide</title>
    <meta name="description" content="Complete travel guide to Playa Cambutal, Panama">
</head>
<body>
    <h1>Playa Cambutal Guide</h1>
    <p>Complete travel guide to Playa Cambutal, Panama</p>
</body>
</html>`;

    return new Response(fallbackHTML, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
});
