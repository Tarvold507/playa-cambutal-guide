import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.T7x4VmHKcJdMqZ0hTWQdQTFzqkHuJNUjqRxKLfBbFhg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
    let table, data
    
    switch (type) {
      case 'hotel':
        const { data: hotel } = await supabase
          .from('hotel_listings')
          .select('*')
          .eq('slug', slug)
          .eq('approved', true)
          .maybeSingle()
        data = hotel
        break
      case 'restaurant':
        const { data: restaurant } = await supabase
          .from('restaurant_listings')
          .select('*')
          .eq('slug', slug)
          .eq('approved', true)
          .maybeSingle()
        data = restaurant
        break
      case 'blog':
        const { data: blog } = await supabase
          .from('blog_posts')
          .select('*, profiles(name)')
          .eq('slug', slug)
          .eq('approved', true)
          .maybeSingle()
        data = blog
        break
    }
    
    return data
  } catch (error) {
    console.warn(`Failed to fetch ${type} data for ${slug}:`, error)
    return null
  }
}

export function generateListingSEO(type, data, slug) {
  if (!data) return null
  
  const baseUrl = 'https://playacambutalguide.com'
  
  switch (type) {
    case 'hotel':
      return {
        page_title: `${data.name} - Hotel in Playa Cambutal | Playa Cambutal Guide`,
        meta_description: `${data.name} in Playa Cambutal: ${(data.description || 'Comfortable accommodation with modern amenities.').substring(0, 140)}${data.price_from ? ` Starting from $${data.price_from}/night.` : ''} Book your stay today.`,
        meta_keywords: `${data.name}, Playa Cambutal hotel, ${data.category}, Panama accommodation, beach hotel, Los Santos Province, ${data.amenities?.join(', ') || ''}`,
        og_title: `${data.name} - Playa Cambutal Hotel`,
        og_description: data.description || `Experience comfort and convenience at ${data.name} in beautiful Playa Cambutal, Panama.`,
        og_image: data.image_url || data.gallery_images?.[0] || 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        canonical_url: `${baseUrl}/stay/${slug}`,
        h1: data.name,
        h2: `${data.category} in Playa Cambutal`
      }
    
    case 'restaurant':
      return {
        page_title: `${data.name} - Restaurant in Playa Cambutal | Playa Cambutal Guide`,
        meta_description: `${data.name} in Playa Cambutal: ${(data.description || 'Delicious dining experience in beautiful Playa Cambutal.').substring(0, 140)}. ${data.category} restaurant. Call or visit us today.`,
        meta_keywords: `${data.name}, Playa Cambutal restaurant, ${data.category}, Panama dining, beach restaurant, Los Santos Province, Central America dining`,
        og_title: `${data.name} - Playa Cambutal Restaurant`,
        og_description: data.description || `Experience delicious dining at ${data.name} in beautiful Playa Cambutal, Panama.`,
        og_image: data.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        canonical_url: `${baseUrl}/eat/${slug}`,
        h1: data.name,
        h2: `${data.category} Restaurant in Playa Cambutal`
      }
    
    case 'blog':
      return {
        page_title: `${data.title} | Playa Cambutal Guide`,
        meta_description: data.excerpt || data.seo_description || `${data.title.substring(0, 140)}... Read more on Playa Cambutal Guide.`,
        meta_keywords: `${data.title}, Playa Cambutal, Panama travel, ${data.category || 'travel guide'}, ${data.tags?.join(', ') || ''}`,
        og_title: data.title,
        og_description: data.excerpt || data.seo_description || `${data.title} - Read the latest from Playa Cambutal Guide.`,
        og_image: data.featured_image_url || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        canonical_url: `${baseUrl}/blog/${slug}`,
        h1: data.title,
        h2: `Published ${data.published_at ? new Date(data.published_at).toLocaleDateString() : 'Recently'}`
      }
    
    default:
      return null
  }
}

export function generateStructuredData(type, data, seoData) {
  const baseUrl = 'https://playacambutalguide.com'
  
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
        "image": data.gallery_images || [data.image_url],
        "priceRange": data.price_from ? `$${data.price_from}-$${data.price_from * 3}` : undefined,
        "starRating": data.rating ? { "@type": "Rating", "ratingValue": data.rating } : undefined,
        "url": seoData.canonical_url
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
        "url": seoData.canonical_url
      }
    
    case 'blog':
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.excerpt,
        "author": {
          "@type": "Person",
          "name": data.profiles?.name || "Anonymous"
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

export function injectSEOData(html, seoData, structuredData = null) {
  let modifiedHtml = html
  
  console.log(`📝 Injecting SEO data for: ${seoData?.page_title || 'Unknown Page'}`)
  
  // Update title with validation
  if (seoData.page_title) {
    const titleRegex = /<title>.*?<\/title>/
    if (titleRegex.test(modifiedHtml)) {
      modifiedHtml = modifiedHtml.replace(titleRegex, `<title>${seoData.page_title}</title>`)
      console.log(`✅ Updated title: ${seoData.page_title}`)
    } else {
      console.warn('⚠️ No title tag found in HTML template')
    }
  }
  
  // Add meta tags
  const metaTags = []
  
  if (seoData.meta_description) {
    metaTags.push(`<meta name="description" content="${seoData.meta_description.replace(/"/g, '&quot;')}" />`)
  }
  
  if (seoData.meta_keywords) {
    metaTags.push(`<meta name="keywords" content="${seoData.meta_keywords.replace(/"/g, '&quot;')}" />`)
  }
  
  if (seoData.canonical_url) {
    metaTags.push(`<link rel="canonical" href="${seoData.canonical_url}" />`)
  }
  
  // Open Graph tags
  if (seoData.og_title) {
    metaTags.push(`<meta property="og:title" content="${seoData.og_title.replace(/"/g, '&quot;')}" />`)
  }
  
  if (seoData.og_description) {
    metaTags.push(`<meta property="og:description" content="${seoData.og_description.replace(/"/g, '&quot;')}" />`)
  }
  
  if (seoData.og_image) {
    metaTags.push(`<meta property="og:image" content="${seoData.og_image}" />`)
  }
  
  metaTags.push(`<meta property="og:type" content="website" />`)
  metaTags.push(`<meta property="og:url" content="${seoData.canonical_url || 'https://playacambutalguide.com'}" />`)
  
  // Twitter tags
  metaTags.push(`<meta name="twitter:card" content="summary_large_image" />`)
  if (seoData.og_title) {
    metaTags.push(`<meta name="twitter:title" content="${seoData.og_title.replace(/"/g, '&quot;')}" />`)
  }
  if (seoData.og_description) {
    metaTags.push(`<meta name="twitter:description" content="${seoData.og_description.replace(/"/g, '&quot;')}" />`)
  }
  if (seoData.og_image) {
    metaTags.push(`<meta name="twitter:image" content="${seoData.og_image}" />`)
  }
  
  // Add structured data
  if (structuredData) {
    metaTags.push(`<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`)
  }
  
  // Insert meta tags before closing head tag with validation
  if (metaTags.length > 0) {
    if (modifiedHtml.includes('</head>')) {
      modifiedHtml = modifiedHtml.replace('</head>', `  ${metaTags.join('\n  ')}\n</head>`)
      console.log(`✅ Added ${metaTags.length} meta tags`)
    } else {
      console.warn('⚠️ No closing head tag found for meta injection')
    }
  }
  
  return modifiedHtml
}

export function getFallbackSEO(url) {
  const baseUrl = 'https://playacambutalguide.com'
  const fallbacks = {
    '/': {
      page_title: 'Playa Cambutal Guide - Discover Panama\'s Hidden Paradise',
      meta_description: 'Complete travel guide to Playa Cambutal, Panama. Find the best hotels, restaurants, surf spots, and activities in this beautiful beach destination.',
      meta_keywords: 'Playa Cambutal, Panama travel, beach destination, surf spots, hotels, restaurants, activities',
      og_title: 'Playa Cambutal Guide - Panama\'s Hidden Paradise',
      og_description: 'Discover the best of Playa Cambutal, Panama. Your complete guide to this beautiful beach destination.',
      og_image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: baseUrl
    },
    '/eat': {
      page_title: 'Best Restaurants in Playa Cambutal | Playa Cambutal Guide',
      meta_description: 'Discover the best restaurants and dining options in Playa Cambutal, Panama. Local cuisine, international food, and beachfront dining experiences.',
      canonical_url: `${baseUrl}/eat`
    },
    '/stay': {
      page_title: 'Hotels & Accommodations in Playa Cambutal | Playa Cambutal Guide',
      meta_description: 'Find the best hotels, hostels, and accommodations in Playa Cambutal, Panama. Beach resorts, budget options, and luxury stays.',
      canonical_url: `${baseUrl}/stay`
    },
    '/surf': {
      page_title: 'Surf Cambutal - Best Surf Spots in Panama | Playa Cambutal Guide',
      meta_description: 'Discover the best surf spots in Playa Cambutal, Panama. Consistent waves, perfect breaks, and world-class surfing conditions year-round.',
      canonical_url: `${baseUrl}/surf`
    }
  }
  
  return fallbacks[url] || {
    page_title: `${url.replace('/', '').replace(/\//g, ' - ')} | Playa Cambutal Guide`,
    meta_description: 'Discover Playa Cambutal, Panama - your complete travel guide.',
    canonical_url: `${baseUrl}${url}`
  }
}