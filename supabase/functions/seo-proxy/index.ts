
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
  'dotbot'
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

function generateSEOHTML(seoData: any, path: string): string {
  const domain = 'https://playacambutalguide.com';
  const canonicalUrl = seoData?.canonical_url || `${domain}${path}`;
  
  // Generate structured data
  const generateSchema = () => {
    if (seoData?.schema_markup) {
      return JSON.stringify(seoData.schema_markup, null, 2);
    }
    
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": seoData?.page_title || "Playa Cambutal Guide",
      "description": seoData?.meta_description || "Complete travel guide to Playa Cambutal, Panama",
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
    <title>${seoData?.page_title || 'Playa Cambutal Guide'}</title>
    <meta name="description" content="${seoData?.meta_description || 'Complete travel guide to Playa Cambutal, Panama'}">
    ${seoData?.meta_keywords ? `<meta name="keywords" content="${seoData.meta_keywords}">` : ''}
    <link rel="canonical" href="${canonicalUrl}">
    ${seoData?.robots ? `<meta name="robots" content="${seoData.robots}">` : '<meta name="robots" content="index, follow">'}
    
    <!-- Open Graph tags -->
    <meta property="og:title" content="${seoData?.og_title || seoData?.page_title || 'Playa Cambutal Guide'}">
    <meta property="og:description" content="${seoData?.og_description || seoData?.meta_description || 'Complete travel guide to Playa Cambutal, Panama'}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    ${seoData?.og_image ? `<meta property="og:image" content="${seoData.og_image}">` : ''}
    <meta property="og:site_name" content="Playa Cambutal Guide">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoData?.twitter_title || seoData?.page_title || 'Playa Cambutal Guide'}">
    <meta name="twitter:description" content="${seoData?.twitter_description || seoData?.meta_description || 'Complete travel guide to Playa Cambutal, Panama'}">
    ${seoData?.twitter_image ? `<meta name="twitter:image" content="${seoData.twitter_image}">` : ''}
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${generateSchema()}
    </script>
    
    <!-- For non-crawler users, redirect to React app -->
    <script>
      if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
        window.location.href = '${path}';
      }
    </script>
</head>
<body>
    <main>
        <h1>${seoData?.page_title || 'Playa Cambutal Guide'}</h1>
        <p>${seoData?.meta_description || 'Complete travel guide to Playa Cambutal, Panama'}</p>
        
        <nav>
            <ul>
                <li><a href="/">Home - Playa Cambutal Guide</a></li>
                <li><a href="/eat">Restaurants & Dining</a></li>
                <li><a href="/stay">Hotels & Accommodation</a></li>
                <li><a href="/do">Activities & Adventures</a></li>
                <li><a href="/surf">Surfing Guide</a></li>
                <li><a href="/calendar">Events Calendar</a></li>
                <li><a href="/blog">Travel Blog</a></li>
                <li><a href="/info">Local Information</a></li>
            </ul>
        </nav>

        <div>
            <p>This page is optimized for search engines. For the full interactive experience, please visit our main site.</p>
            <a href="${path}">Visit Full Site</a>
        </div>
    </main>

    <footer>
        <p>&copy; 2024 Playa Cambutal Guide. Your complete guide to Cambutal, Panama.</p>
    </footer>
</body>
</html>`;
}

serve(async (req) => {
  console.log('SEO Proxy - Processing request:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const userAgent = req.headers.get('user-agent') || '';
    
    console.log('SEO Proxy - Path:', path);
    console.log('SEO Proxy - User Agent:', userAgent);
    console.log('SEO Proxy - Is Crawler:', isCrawler(userAgent));

    // Only serve SEO content to crawlers
    if (!isCrawler(userAgent)) {
      console.log('SEO Proxy - Not a crawler, passing through to React app');
      return new Response('Not a crawler - redirect to React app', {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `https://playacambutalguide.com${path}`
        }
      });
    }

    console.log('SEO Proxy - Crawler detected, fetching SEO data for:', path);

    // Fetch SEO data for the path
    const { data: seoData, error } = await supabase
      .from('page_seo')
      .select('*')
      .eq('page_path', path)
      .maybeSingle();

    if (error) {
      console.error('SEO Proxy - Database error:', error);
    }

    console.log('SEO Proxy - SEO data found:', !!seoData);
    if (seoData) {
      console.log('SEO Proxy - SEO title:', seoData.page_title);
    }

    // Generate and return SEO-optimized HTML
    const seoHTML = generateSEOHTML(seoData, path);
    
    console.log('SEO Proxy - Returning SEO HTML for crawler');
    return new Response(seoHTML, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('SEO Proxy - Error:', error);
    
    // Return basic HTML fallback
    const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playa Cambutal Guide - Ultimate Travel Guide to Cambutal, Panama</title>
    <meta name="description" content="Complete travel guide to Playa Cambutal, Panama. Find hotels, restaurants, activities, and more.">
    <link rel="canonical" href="https://playacambutalguide.com${new URL(req.url).pathname}">
</head>
<body>
    <h1>Playa Cambutal Guide</h1>
    <p>Complete travel guide to Playa Cambutal, Panama</p>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/eat">Restaurants</a></li>
            <li><a href="/stay">Hotels</a></li>
            <li><a href="/do">Activities</a></li>
        </ul>
    </nav>
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
