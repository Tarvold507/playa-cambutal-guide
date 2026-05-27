import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.q63nFaQEJDRpgeXvUYwdzAU-ciDZwatGEWPTIyQ4Tdc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const BASE_URL = 'https://playacambutalguide.com'

// Netlify serves all pages with trailing slashes; canonical URLs must match.
function ensureTrailingSlash(url) {
  if (!url || url.endsWith('/')) return url
  return url + '/'
}

export async function fetchSEOData(pagePath) {
  try {
    const { data, error } = await supabase
      .from('page_seo')
      .select('*')
      .eq('page_path', pagePath)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.warn(`SEO fetch error for ${pagePath}:`, error)
    }

    return data
  } catch (error) {
    console.warn(`Failed to fetch SEO for ${pagePath}:`, error)
    return null
  }
}

export async function fetchListingData(type, slug) {
  try {
    let data

    switch (type) {
      case 'hotel': {
        const { data: hotel } = await supabase
          .from('hotel_listings')
          .select('*')
          .eq('slug', slug)
          .eq('approved', true)
          .maybeSingle()
        data = hotel
        break
      }
      case 'restaurant': {
        const { data: restaurant } = await supabase
          .from('restaurant_listings')
          .select('*')
          .eq('slug', slug)
          .eq('approved', true)
          .maybeSingle()
        data = restaurant
        break
      }
      case 'blog': {
        const { data: blog } = await supabase
          .from('blog_posts')
          .select('*, profiles(name)')
          .eq('slug', slug)
          .eq('approved', true)
          .maybeSingle()
        data = blog
        break
      }
    }

    return data
  } catch (error) {
    console.warn(`Failed to fetch ${type} data for ${slug}:`, error)
    return null
  }
}

export function generateListingSEO(type, data, slug) {
  if (!data) return null

  switch (type) {
    case 'hotel':
      return {
        page_title: `${data.name} - Hotel in Playa Cambutal | Playa Cambutal Guide`,
        meta_description: `${data.name} in Playa Cambutal: ${(data.description || 'Comfortable accommodation with modern amenities.').substring(0, 140)}${data.price_from ? ` From $${data.price_from}/night.` : ''} Book your stay today.`,
        meta_keywords: `${data.name}, Playa Cambutal hotel, ${data.category}, Panama accommodation, beach hotel, Los Santos Province`,
        og_title: `${data.name} — Playa Cambutal Hotel`,
        og_description: data.description || `Experience comfort and convenience at ${data.name} in beautiful Playa Cambutal, Panama.`,
        og_image: data.image_url || (data.gallery_images || [])[0] || `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
        canonical_url: `${BASE_URL}/stay/${slug}/`,
      }

    case 'restaurant':
      return {
        page_title: `${data.name} - Restaurant in Playa Cambutal | Playa Cambutal Guide`,
        meta_description: `${data.name} in Playa Cambutal: ${(data.description || 'Delicious dining in beautiful Playa Cambutal.').substring(0, 140)}. ${data.category} restaurant. Visit us today.`,
        meta_keywords: `${data.name}, Playa Cambutal restaurant, ${data.category}, Panama dining, beach restaurant, Los Santos Province`,
        og_title: `${data.name} — Playa Cambutal Restaurant`,
        og_description: data.description || `Delicious dining at ${data.name} in Playa Cambutal, Panama.`,
        og_image: data.image_url || `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
        canonical_url: `${BASE_URL}/eat/${slug}/`,
      }

    case 'blog':
      return {
        page_title: `${data.title} | Playa Cambutal Guide`,
        meta_description: data.excerpt || data.seo_description || `${data.title.substring(0, 140)}... Read more on Playa Cambutal Guide.`,
        meta_keywords: `${data.title}, Playa Cambutal, Panama travel, ${data.category || 'travel guide'}`,
        og_title: data.title,
        og_description: data.excerpt || data.seo_description || `${data.title} — Playa Cambutal Guide.`,
        og_image: data.featured_image_url || `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
        canonical_url: `${BASE_URL}/blog/${slug}/`,
      }

    default:
      return null
  }
}

export function generateStructuredData(type, data, seoData) {
  switch (type) {
    case 'hotel':
      return {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": data.name,
        "description": data.description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data.address,
          "addressLocality": "Playa Cambutal",
          "addressRegion": "Los Santos",
          "addressCountry": "PA"
        },
        "image": data.gallery_images || (data.image_url ? [data.image_url] : []),
        "priceRange": data.price_from ? `$${data.price_from}–$${Math.round(data.price_from * 3)}` : undefined,
        "starRating": data.rating ? { "@type": "Rating", "ratingValue": data.rating } : undefined,
        "url": seoData.canonical_url,
        "geo": data.latitude && data.longitude ? {
          "@type": "GeoCoordinates",
          "latitude": data.latitude,
          "longitude": data.longitude
        } : undefined
      }

    case 'restaurant':
      return {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": data.name,
        "description": data.description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data.address,
          "addressLocality": "Playa Cambutal",
          "addressRegion": "Los Santos Province",
          "addressCountry": "PA"
        },
        "image": data.image_url,
        "servesCuisine": data.category,
        "telephone": data.phone,
        "url": seoData.canonical_url,
        "geo": data.latitude && data.longitude ? {
          "@type": "GeoCoordinates",
          "latitude": data.latitude,
          "longitude": data.longitude
        } : undefined
      }

    case 'blog':
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.excerpt,
        "author": {
          "@type": "Person",
          "name": data.profiles?.name || "Playa Cambutal Guide"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Playa Cambutal Guide",
          "url": BASE_URL
        },
        "datePublished": data.published_at,
        "dateModified": data.updated_at,
        "image": data.featured_image_url,
        "url": seoData.canonical_url
      }

    default:
      return null
  }
}

// Structured data for static category pages
export function getFallbackStructuredData(url) {
  const schemas = {
    '/': {
      "@context": "https://schema.org",
      "@type": "TravelGuide",
      "name": "Playa Cambutal Guide",
      "description": "Complete travel guide to Playa Cambutal, Panama — hotels, restaurants, surfing, activities, and more.",
      "url": BASE_URL,
      "image": `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      "about": {
        "@type": "TouristDestination",
        "name": "Playa Cambutal",
        "description": "A beautiful beach destination in Panama known for world-class surfing, fresh seafood, and adventure activities.",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 7.2833,
          "longitude": -80.5167
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "PA",
          "addressRegion": "Los Santos",
          "addressLocality": "Cambutal"
        }
      },
      "author": {
        "@type": "Organization",
        "name": "Playa Cambutal Guide",
        "url": BASE_URL
      }
    },
    '/eat': {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Restaurants in Playa Cambutal",
      "description": "Discover the best restaurants and dining options in Playa Cambutal, Panama. Local cuisine, seafood, and international dining on the beach.",
      "url": `${BASE_URL}/eat`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Playa Cambutal Guide", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Restaurants", "item": `${BASE_URL}/eat` }
        ]
      }
    },
    '/stay': {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Hotels & Accommodations in Playa Cambutal",
      "description": "Find the best hotels, surf lodges, and vacation rentals in Playa Cambutal, Panama. Beach resorts to budget-friendly stays.",
      "url": `${BASE_URL}/stay`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Playa Cambutal Guide", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Accommodations", "item": `${BASE_URL}/stay` }
        ]
      }
    },
    '/do': {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Things to Do in Playa Cambutal",
      "description": "Activities and adventures in Playa Cambutal, Panama: surf lessons, yoga, tours, fishing, and more outdoor experiences.",
      "url": `${BASE_URL}/do`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Playa Cambutal Guide", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Things to Do", "item": `${BASE_URL}/do` }
        ]
      }
    },
    '/surf': {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      "name": "Playa Cambutal Surf",
      "description": "World-class surf breaks in Playa Cambutal, Panama. Consistent waves year-round, warm water, and breaks for all skill levels.",
      "url": `${BASE_URL}/surf`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Playa Cambutal",
        "addressRegion": "Los Santos",
        "addressCountry": "PA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 7.2833,
        "longitude": -80.5167
      },
      "sport": "Surfing"
    },
    '/blog': {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Playa Cambutal Guide Blog",
      "description": "Travel stories, local insights, and guides for visitors to Playa Cambutal, Panama.",
      "url": `${BASE_URL}/blog`,
      "publisher": {
        "@type": "Organization",
        "name": "Playa Cambutal Guide",
        "url": BASE_URL
      }
    },
    '/calendar': {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Events Calendar — Playa Cambutal",
      "description": "Upcoming events, festivals, and activities in Playa Cambutal, Panama.",
      "url": `${BASE_URL}/calendar`
    },
    '/transportation': {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Getting to Playa Cambutal — Transportation Guide",
      "description": "How to get to Playa Cambutal, Panama. Buses, taxis, shuttles, and driving directions from Panama City and other destinations.",
      "url": `${BASE_URL}/transportation`
    },
    '/real-estate': {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Real Estate in Playa Cambutal",
      "description": "Properties for sale and rent in Playa Cambutal, Panama. Beachfront homes, land, and investment opportunities.",
      "url": `${BASE_URL}/real-estate`
    },
    '/info': {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Visitor Information — Playa Cambutal Guide",
      "description": "Essential visitor information for Playa Cambutal, Panama: weather, currency, safety tips, and local services.",
      "url": `${BASE_URL}/info`
    }
  }

  return schemas[url] || null
}

export function getFallbackSEO(url) {
  const fallbacks = {
    '/': {
      page_title: "Playa Cambutal Guide — Panama's Hidden Surf & Beach Paradise",
      meta_description: "Your complete travel guide to Playa Cambutal, Panama. Find the best surf spots, hotels, restaurants, and activities in this stunning Pacific coast destination.",
      meta_keywords: "Playa Cambutal, Panama beach, surf Panama, Cambutal hotels, Cambutal restaurants, Panama Pacific coast, Los Santos",
      og_title: "Playa Cambutal Guide — Panama's Hidden Paradise",
      og_description: "The complete guide to Playa Cambutal: surf, stay, eat, and explore Panama's best-kept secret.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: BASE_URL
    },
    '/eat': {
      page_title: "Best Restaurants in Playa Cambutal, Panama | Playa Cambutal Guide",
      meta_description: "Discover the best restaurants and dining in Playa Cambutal, Panama. Fresh seafood, local Panamanian cuisine, and beachfront dining experiences.",
      meta_keywords: "Playa Cambutal restaurants, Cambutal dining, Panama beach food, Los Santos restaurants, seafood Panama",
      og_title: "Restaurants in Playa Cambutal, Panama",
      og_description: "Fresh seafood, local cuisine, and beachfront dining — find the best restaurants in Playa Cambutal.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/eat/`
    },
    '/stay': {
      page_title: "Hotels & Accommodations in Playa Cambutal, Panama | Playa Cambutal Guide",
      meta_description: "Find the best hotels, surf lodges, and vacation rentals in Playa Cambutal, Panama. From beachfront resorts to budget-friendly guesthouses.",
      meta_keywords: "Playa Cambutal hotels, Cambutal accommodation, Panama surf lodge, Los Santos hotels, beach resort Panama",
      og_title: "Where to Stay in Playa Cambutal, Panama",
      og_description: "Beachfront hotels, surf lodges, and cozy guesthouses — find your perfect accommodation in Playa Cambutal.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/stay/`
    },
    '/do': {
      page_title: "Things to Do in Playa Cambutal, Panama | Activities & Adventures",
      meta_description: "Activities and adventures in Playa Cambutal, Panama: surf lessons, yoga retreats, boat tours, sport fishing, wildlife spotting, and more.",
      meta_keywords: "things to do Playa Cambutal, Cambutal activities, Panama adventures, surf lessons Cambutal, yoga Panama beach",
      og_title: "Things to Do in Playa Cambutal, Panama",
      og_description: "Surf lessons, yoga, fishing, tours and more — explore the best activities in Playa Cambutal.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/do/`
    },
    '/surf': {
      page_title: "Surf Playa Cambutal — World-Class Waves in Panama | Playa Cambutal Guide",
      meta_description: "Playa Cambutal is Panama's premier surf destination. Consistent point breaks, warm water year-round, uncrowded lineups, and waves for all skill levels.",
      meta_keywords: "surf Playa Cambutal, Panama surf, Cambutal waves, Panama surf spots, Los Santos surfing, Pacific Panama surf",
      og_title: "Surfing in Playa Cambutal, Panama",
      og_description: "World-class point breaks, warm water, and uncrowded lineups — Playa Cambutal is Panama's best surf destination.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/surf/`
    },
    '/blog': {
      page_title: "Playa Cambutal Blog — Travel Stories & Local Insights | Playa Cambutal Guide",
      meta_description: "Travel stories, insider tips, and guides for visiting Playa Cambutal, Panama. Written by locals and experienced travelers.",
      meta_keywords: "Playa Cambutal blog, Panama travel tips, Cambutal travel guide, Panama Pacific coast blog",
      og_title: "Playa Cambutal Blog — Travel Stories & Insider Tips",
      og_description: "Insider travel stories and guides for Playa Cambutal, Panama's hidden Pacific paradise.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/blog/`
    },
    '/calendar': {
      page_title: "Events & Calendar — Playa Cambutal, Panama | Playa Cambutal Guide",
      meta_description: "Upcoming events, festivals, surf competitions, and activities in Playa Cambutal and the Los Santos province of Panama.",
      meta_keywords: "Playa Cambutal events, Cambutal calendar, Panama festivals, Los Santos events",
      og_title: "Events Calendar — Playa Cambutal, Panama",
      og_description: "Stay up to date with events, festivals, and activities happening in Playa Cambutal.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/calendar/`
    },
    '/transportation': {
      page_title: "Getting to Playa Cambutal — Transportation Guide | Playa Cambutal Guide",
      meta_description: "How to get to Playa Cambutal, Panama. Buses from Panama City, taxis, shuttles, rental cars, and driving directions through the Azuero Peninsula.",
      meta_keywords: "how to get to Playa Cambutal, Cambutal transportation, Panama City to Cambutal, Azuero Peninsula transport, Panama bus",
      og_title: "Getting to Playa Cambutal — Transportation Guide",
      og_description: "Everything you need to know about getting to Playa Cambutal by bus, taxi, shuttle, or rental car.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/transportation/`
    },
    '/real-estate': {
      page_title: "Real Estate in Playa Cambutal, Panama | Playa Cambutal Guide",
      meta_description: "Properties for sale and rent in Playa Cambutal, Panama. Beachfront land, surf homes, and investment opportunities on Panama's Pacific coast.",
      meta_keywords: "Playa Cambutal real estate, Panama beach property, Cambutal land for sale, Los Santos real estate, Panama Pacific investment",
      og_title: "Real Estate in Playa Cambutal, Panama",
      og_description: "Beachfront land, homes, and investment properties in Playa Cambutal, Panama.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/real-estate/`
    },
    '/info': {
      page_title: "Visitor Information — Playa Cambutal, Panama | Playa Cambutal Guide",
      meta_description: "Essential visitor information for Playa Cambutal, Panama: best time to visit, weather, currency, safety, language, healthcare, and local services.",
      meta_keywords: "Playa Cambutal visitor information, Panama travel tips, Cambutal weather, Los Santos travel guide",
      og_title: "Visitor Information — Playa Cambutal, Panama",
      og_description: "Everything you need to know before visiting Playa Cambutal: weather, safety, money, and local tips.",
      og_image: `${BASE_URL}/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png`,
      canonical_url: `${BASE_URL}/info/`
    },
    '/legal': {
      page_title: "Legal Notices | Playa Cambutal Guide",
      meta_description: "Legal notices and disclaimers for Playa Cambutal Guide.",
      canonical_url: `${BASE_URL}/legal/`
    },
    '/privacy': {
      page_title: "Privacy Policy | Playa Cambutal Guide",
      meta_description: "Privacy policy for Playa Cambutal Guide — how we collect, use, and protect your information.",
      canonical_url: `${BASE_URL}/privacy/`
    },
    '/terms': {
      page_title: "Terms of Service | Playa Cambutal Guide",
      meta_description: "Terms of service for using Playa Cambutal Guide.",
      canonical_url: `${BASE_URL}/terms/`
    },
    '/disclosure': {
      page_title: "Affiliate Disclosure | Playa Cambutal Guide",
      meta_description: "Affiliate and advertising disclosure for Playa Cambutal Guide.",
      canonical_url: `${BASE_URL}/disclosure/`
    }
  }

  return fallbacks[url] || {
    page_title: `Playa Cambutal Guide`,
    meta_description: "Discover Playa Cambutal, Panama — your complete travel guide.",
    canonical_url: `${BASE_URL}${url}/`
  }
}

export function injectSEOData(html, seoData, structuredData = null) {
  let out = html

  // Normalize canonical URL to always have a trailing slash (Netlify serves all paths with one)
  if (seoData.canonical_url) {
    seoData = { ...seoData, canonical_url: ensureTrailingSlash(seoData.canonical_url) }
  }

  // Replace title
  if (seoData.page_title) {
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${seoData.page_title}</title>`)
  }

  // Strip generic tags from index.html that we're replacing with page-specific ones.
  // This prevents duplicates when prerendered pages are served.
  out = out
    .replace(/<meta\s+name="description"[^>]*\/?>/gi, '')
    .replace(/<meta\s+name="keywords"[^>]*\/?>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*\/?>/gi, '')
    .replace(/<meta\s+property="og:title"[^>]*\/?>/gi, '')
    .replace(/<meta\s+property="og:description"[^>]*\/?>/gi, '')
    .replace(/<meta\s+property="og:type"[^>]*\/?>/gi, '')
    .replace(/<meta\s+property="og:image"(?::width|:height|:alt)?[^>]*\/?>/gi, '')
    .replace(/<meta\s+property="og:url"[^>]*\/?>/gi, '')
    .replace(/<meta\s+property="og:site_name"[^>]*\/?>/gi, '')
    .replace(/<meta\s+property="og:locale"[^>]*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:card"[^>]*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:title"[^>]*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:description"[^>]*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:image"(?::alt)?[^>]*\/?>/gi, '')

  const esc = (s) => s.replace(/"/g, '&quot;')
  const tags = []

  if (seoData.meta_description) {
    tags.push(`<meta name="description" content="${esc(seoData.meta_description)}" />`)
  }
  if (seoData.meta_keywords) {
    tags.push(`<meta name="keywords" content="${esc(seoData.meta_keywords)}" />`)
  }
  if (seoData.canonical_url) {
    tags.push(`<link rel="canonical" href="${seoData.canonical_url}" />`)
  }

  // Open Graph
  tags.push(`<meta property="og:type" content="website" />`)
  tags.push(`<meta property="og:site_name" content="Playa Cambutal Guide" />`)
  if (seoData.canonical_url) {
    tags.push(`<meta property="og:url" content="${seoData.canonical_url}" />`)
  }
  if (seoData.og_title) {
    tags.push(`<meta property="og:title" content="${esc(seoData.og_title)}" />`)
  }
  if (seoData.og_description) {
    tags.push(`<meta property="og:description" content="${esc(seoData.og_description)}" />`)
  }
  if (seoData.og_image) {
    tags.push(`<meta property="og:image" content="${seoData.og_image}" />`)
    tags.push(`<meta property="og:image:width" content="1200" />`)
    tags.push(`<meta property="og:image:height" content="630" />`)
  }

  // Twitter Card
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`)
  if (seoData.og_title) {
    tags.push(`<meta name="twitter:title" content="${esc(seoData.og_title)}" />`)
  }
  if (seoData.og_description) {
    tags.push(`<meta name="twitter:description" content="${esc(seoData.og_description)}" />`)
  }
  if (seoData.og_image) {
    tags.push(`<meta name="twitter:image" content="${seoData.og_image}" />`)
  }

  // JSON-LD structured data
  if (structuredData) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`)
  }

  if (tags.length > 0) {
    out = out.replace('</head>', `  ${tags.join('\n  ')}\n</head>`)
  }

  return out
}
