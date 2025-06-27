
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Initialize Supabase client for build-time data fetching
const supabaseUrl = 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.T7x4VmHKcJdMqZ0hTWQdQTFzqkHuJNUjqRxKLfBbFhg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Fetch SEO data from database
async function fetchSEOData(pagePath) {
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

// Fetch dynamic content for listings
async function fetchListingData(type, slug) {
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

// Generate SEO metadata for dynamic pages
function generateListingSEO(type, data, slug) {
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

// Generate structured data based on content type
function generateStructuredData(type, data, seoData) {
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

// Inject SEO data into HTML
function injectSEOData(html, seoData, structuredData = null) {
  let modifiedHtml = html
  
  // Update title
  if (seoData.page_title) {
    modifiedHtml = modifiedHtml.replace(
      /<title>.*?<\/title>/,
      `<title>${seoData.page_title}</title>`
    )
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
  
  // Insert meta tags before closing head tag
  if (metaTags.length > 0) {
    modifiedHtml = modifiedHtml.replace(
      '</head>',
      `  ${metaTags.join('\n  ')}\n</head>`
    )
  }
  
  return modifiedHtml
}

// Get all routes to prerender
const routesToPrerender = [
  '/',
  '/eat',
  '/stay', 
  '/do',
  '/calendar',
  '/surf',
  '/blog',
  '/info',
  '/transportation',
  '/real-estate'
]

// Add dynamic routes
try {
  // Add hotel routes
  const { data: hotels } = await supabase
    .from('hotel_listings')
    .select('slug')
    .eq('approved', true)
  
  if (hotels) {
    hotels.forEach(hotel => {
      routesToPrerender.push(`/stay/${hotel.slug}`)
    })
  }
  
  // Add restaurant routes
  const { data: restaurants } = await supabase
    .from('restaurant_listings')
    .select('slug')
    .eq('approved', true)
  
  if (restaurants) {
    restaurants.forEach(restaurant => {
      routesToPrerender.push(`/eat/${restaurant.slug}`)
    })
  }
  
  // Add blog routes
  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('approved', true)
  
  if (blogs) {
    blogs.forEach(blog => {
      routesToPrerender.push(`/blog/${blog.slug}`)
    })
  }
} catch (error) {
  console.warn('Error fetching dynamic routes:', error)
}

console.log(`Prerendering ${routesToPrerender.length} routes...`)

// Prerender all routes
for (const url of routesToPrerender) {
  try {
    console.log(`Prerendering: ${url}`)
    
    // Render the React app
    const appHtml = render(url)
    let html = template.replace(`<!--app-html-->`, appHtml)
    
    // Fetch and inject SEO data
    let seoData = await fetchSEOData(url)
    let structuredData = null
    
    // Handle dynamic routes
    if (!seoData) {
      const pathParts = url.split('/')
      
      if (pathParts[1] === 'stay' && pathParts[2]) {
        const hotelData = await fetchListingData('hotel', pathParts[2])
        if (hotelData) {
          seoData = generateListingSEO('hotel', hotelData, pathParts[2])
          structuredData = generateStructuredData('hotel', hotelData, seoData)
        }
      } else if (pathParts[1] === 'eat' && pathParts[2]) {
        const restaurantData = await fetchListingData('restaurant', pathParts[2])
        if (restaurantData) {
          seoData = generateListingSEO('restaurant', restaurantData, pathParts[2])
          structuredData = generateStructuredData('restaurant', restaurantData, seoData)
        }
      } else if (pathParts[1] === 'blog' && pathParts[2]) {
        const blogData = await fetchListingData('blog', pathParts[2])
        if (blogData) {
          seoData = generateListingSEO('blog', blogData, pathParts[2])
          structuredData = generateStructuredData('blog', blogData, seoData)
        }
      }
    }
    
    // Apply fallback SEO for pages without database data
    if (!seoData) {
      seoData = getFallbackSEO(url)
    }
    
    // Inject SEO data
    if (seoData) {
      html = injectSEOData(html, seoData, structuredData)
    }
    
    // Write the file
    const filePath = `dist${url === '/' ? '/index' : url}.html`
    const dirPath = path.dirname(toAbsolute(filePath))
    
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('✅ Pre-rendered:', filePath)
    
  } catch (error) {
    console.error(`❌ Failed to prerender ${url}:`, error)
    
    // Write basic HTML without SEO as fallback
    try {
      const basicHtml = template.replace(`<!--app-html-->`, `<div id="root"></div>`)
      const filePath = `dist${url === '/' ? '/index' : url}.html`
      const dirPath = path.dirname(toAbsolute(filePath))
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      
      fs.writeFileSync(toAbsolute(filePath), basicHtml)
      console.log('⚠️ Fallback rendered:', filePath)
    } catch (fallbackError) {
      console.error(`❌ Fallback failed for ${url}:`, fallbackError)
    }
  }
}

// Fallback SEO data for pages without database entries
function getFallbackSEO(url) {
  const baseUrl = 'https://playacambutalguide.com'
  const fallbacks = {
    '/': {
      page_title: 'Playa Cambutal Guide - Discover Panama\'s Hidden Paradise',
      meta_description: 'Complete travel guide to Playa Cambutal, Panama. Find the best hotels, restaurants, surf spots, and activities in this beautiful beach destination.',
      meta_keywords: 'Playa Cambutal, Panama travel, beach destination, surf spots, hotels, restaurants, activities',
      og_title: 'Playa Cambutal Guide - Panama\'s Hidden Paradise',
      og_description: 'Discover the best of Playa Cambutal, Panama. Your complete guide to this beautiful beach destination.',
      og_image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: baseUrl,
      h1: 'Welcome to Playa Cambutal',
      h2: 'Panama\'s Hidden Beach Paradise'
    },
    '/surf': {
      page_title: 'Surf Cambutal - Best Surf Spots in Panama | Playa Cambutal Guide',
      meta_description: 'Discover the best surf spots in Playa Cambutal, Panama. Consistent waves, perfect breaks, and world-class surfing conditions year-round.',
      meta_keywords: 'Cambutal surf, Panama surf spots, Playa Cambutal waves, surfing Panama, surf breaks, surf conditions',
      og_title: 'Surf Cambutal - Best Surf Spots in Panama',
      og_description: 'Experience world-class surfing at Playa Cambutal with consistent waves and perfect breaks.',
      og_image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: `${baseUrl}/surf`,
      h1: 'Surf Playa Cambutal',
      h2: 'World-Class Surf Breaks in Panama'
    },
    '/calendar': {
      page_title: 'Cambutal Events Calendar - What\'s Happening | Playa Cambutal Guide',
      meta_description: 'Stay updated with events, festivals, and activities in Playa Cambutal, Panama. Find local events, international festivals, and community gatherings.',
      meta_keywords: 'Cambutal events, Panama festivals, Playa Cambutal calendar, local events, community activities',
      og_title: 'Cambutal Events Calendar',
      og_description: 'Discover upcoming events and festivals in beautiful Playa Cambutal, Panama.',
      og_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: `${baseUrl}/calendar`,
      h1: 'Events in Playa Cambutal',
      h2: 'Upcoming Events & Festivals'
    },
    '/transportation': {
      page_title: 'Getting to Cambutal - Transportation Guide | Playa Cambutal Guide',
      meta_description: 'Complete transportation guide to Playa Cambutal, Panama. Flights, buses, car rentals, and travel tips for international visitors.',
      meta_keywords: 'getting to Cambutal, Cambutal transport, Panama travel, flights to Panama, bus to Cambutal, car rental Panama',
      og_title: 'Getting to Playa Cambutal - Transportation Guide',
      og_description: 'Your complete guide to reaching Playa Cambutal, Panama from anywhere in the world.',
      og_image: 'https://images.unsplash.com/photo-1596627116790-af6f46dddbae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: `${baseUrl}/transportation`,
      h1: 'Getting to Playa Cambutal',
      h2: 'Transportation Options & Travel Tips'
    },
    '/real-estate': {
      page_title: 'Cambutal Real Estate - Properties & Land for Sale | Playa Cambutal Guide',
      meta_description: 'Explore real estate opportunities in Playa Cambutal, Panama. Beach properties, land for sale, investment opportunities for international buyers.',
      meta_keywords: 'Cambutal property, Panama real estate, beach property Panama, land for sale Cambutal, investment property',
      og_title: 'Cambutal Real Estate - Beach Properties',
      og_description: 'Discover prime real estate opportunities in beautiful Playa Cambutal, Panama.',
      og_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: `${baseUrl}/real-estate`,
      h1: 'Real Estate in Playa Cambutal',
      h2: 'Beach Properties & Investment Opportunities'
    }
  }
  
  return fallbacks[url] || {
    page_title: `Page - Playa Cambutal Guide`,
    meta_description: 'Discover Playa Cambutal, Panama - your complete travel guide.',
    canonical_url: `${baseUrl}${url}`,
    h1: 'Playa Cambutal Guide',
    h2: 'Discover Panama\'s Hidden Paradise'
  }
}

console.log('✅ Prerendering completed successfully!')
