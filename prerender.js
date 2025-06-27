import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Initialize Supabase client for build-time data fetching
const supabaseUrl = 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.T7x4VmHKcJdMqZ0hTWQdQTFzqkHuJNUjqRxKLfBbFhg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Enhanced validation and debugging
function validateBuildOutput() {
  console.log('🔍 Validating build output...')
  
  const clientDistPath = toAbsolute('dist')
  const serverDistPath = toAbsolute('dist/server')
  const templatePath = toAbsolute('dist/index.html')
  
  console.log(`Checking client build at: ${clientDistPath}`)
  console.log(`Checking server build at: ${serverDistPath}`)
  console.log(`Checking template at: ${templatePath}`)
  
  if (!fs.existsSync(clientDistPath)) {
    throw new Error('❌ Client build not found. Run `npm run build` first.')
  }
  
  if (!fs.existsSync(templatePath)) {
    throw new Error('❌ Template file not found in dist directory.')
  }
  
  const template = fs.readFileSync(templatePath, 'utf-8')
  if (!template.includes('<!--app-html-->')) {
    console.warn('⚠️ Template does not contain <!--app-html--> placeholder. This may cause issues.')
  }
  
  console.log('✅ Build output validation passed')
  return { template, templatePath }
}

async function buildSSR() {
  try {
    console.log('🔨 Building SSR bundle...')
    process.env.BUILD_SSR = 'true'
    
    // Clean previous SSR build
    const serverDistPath = toAbsolute('dist/server')
    if (fs.existsSync(serverDistPath)) {
      fs.rmSync(serverDistPath, { recursive: true, force: true })
      console.log('🧹 Cleaned previous SSR build')
    }
    
    const { stdout, stderr } = await execAsync('npx vite build', { 
      env: { ...process.env, BUILD_SSR: 'true' } 
    })
    
    if (stderr && !stderr.includes('warnings')) {
      console.warn('⚠️ SSR build warnings:', stderr)
    }
    
    console.log('✅ SSR bundle built successfully')
    
    // Validate SSR output
    const serverEntryPath = toAbsolute('dist/server/entry-server.js')
    if (!fs.existsSync(serverEntryPath)) {
      throw new Error('❌ SSR entry file not found after build')
    }
    
    return true
  } catch (error) {
    console.warn('⚠️ SSR build failed, continuing with client-side rendering:', error.message)
    return false
  }
}

async function loadServerRenderer() {
  try {
    const serverPath = toAbsolute('dist/server/entry-server.js')
    if (fs.existsSync(serverPath)) {
      console.log('📦 Loading SSR renderer from:', serverPath)
      
      // Clear module cache to ensure fresh import
      delete require.cache[serverPath]
      
      const { render } = await import(serverPath)
      
      // Test the renderer with a simple route
      const testHtml = render('/')
      console.log('🧪 SSR renderer test result length:', testHtml.length)
      
      if (testHtml.length < 50) {
        console.warn('⚠️ SSR renderer returned suspiciously short content')
      }
      
      return render
    }
  } catch (error) {
    console.warn('⚠️ Could not load SSR renderer:', error.message)
  }
  
  console.log('🔄 Using fallback renderer')
  return (url) => {
    console.log(`Using fallback renderer for ${url}`)
    return '<div id="root"><div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div><p class="text-gray-600">Loading Playa Cambutal Guide...</p></div></div></div>'
  }
}

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

function injectSEOData(html, seoData, structuredData = null) {
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

async function fetchDynamicRoutes() {
  const routes = []
  
  try {
    console.log('🔍 Fetching dynamic routes from database...')
    
    // Add hotel routes
    const { data: hotels } = await supabase
      .from('hotel_listings')
      .select('slug')
      .eq('approved', true)
    
    if (hotels) {
      hotels.forEach(hotel => {
        routes.push(`/stay/${hotel.slug}`)
      })
      console.log(`📍 Found ${hotels.length} hotel routes`)
    }
    
    // Add restaurant routes
    const { data: restaurants } = await supabase
      .from('restaurant_listings')
      .select('slug')
      .eq('approved', true)
    
    if (restaurants) {
      restaurants.forEach(restaurant => {
        routes.push(`/eat/${restaurant.slug}`)
      })
      console.log(`🍽️ Found ${restaurants.length} restaurant routes`)
    }
    
    // Add blog routes
    const { data: blogs } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('approved', true)
    
    if (blogs) {
      blogs.forEach(blog => {
        routes.push(`/blog/${blog.slug}`)
      })
      console.log(`📝 Found ${blogs.length} blog routes`)
    }
  } catch (error) {
    console.warn('⚠️ Error fetching dynamic routes:', error)
  }
  
  return routes
}

async function prerenderPage(url, template, render) {
  try {
    console.log(`📄 Prerendering: ${url}`)
    
    // Render the React app with error handling
    let appHtml
    try {
      appHtml = render(url)
      console.log(`✅ SSR render successful for ${url}, content length: ${appHtml.length}`)
    } catch (renderError) {
      console.warn(`⚠️ SSR render failed for ${url}:`, renderError.message)
      appHtml = '<div id="root"><div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div><p class="text-gray-600">Loading Playa Cambutal Guide...</p></div></div></div>'
    }
    
    // Replace the placeholder with rendered content
    let html = template.replace('<!--app-html-->', appHtml)
    
    // Validate the replacement worked
    if (html === template) {
      console.warn(`⚠️ Template replacement may have failed for ${url}`)
    }
    
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
          console.log(`🏨 Generated hotel SEO for ${pathParts[2]}`)
        }
      } else if (pathParts[1] === 'eat' && pathParts[2]) {
        const restaurantData = await fetchListingData('restaurant', pathParts[2])
        if (restaurantData) {
          seoData = generateListingSEO('restaurant', restaurantData, pathParts[2])
          structuredData = generateStructuredData('restaurant', restaurantData, seoData)
          console.log(`🍽️ Generated restaurant SEO for ${pathParts[2]}`)
        }
      } else if (pathParts[1] === 'blog' && pathParts[2]) {
        const blogData = await fetchListingData('blog', pathParts[2])
        if (blogData) {
          seoData = generateListingSEO('blog', blogData, pathParts[2])
          structuredData = generateStructuredData('blog', blogData, seoData)
          console.log(`📝 Generated blog SEO for ${pathParts[2]}`)
        }
      }
    }
    
    // Apply fallback SEO for pages without database data
    if (!seoData) {
      seoData = getFallbackSEO(url)
      console.log(`🔄 Using fallback SEO for ${url}`)
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
    console.log(`✅ Pre-rendered: ${filePath}`)
    
    // Validate the written file
    const writtenFile = fs.readFileSync(toAbsolute(filePath), 'utf-8')
    if (writtenFile.length < 1000) {
      console.warn(`⚠️ Generated file ${filePath} seems too small (${writtenFile.length} chars)`)
    }
    
    return true
    
  } catch (error) {
    console.error(`❌ Failed to prerender ${url}:`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting enhanced prerendering process...')
  
  try {
    // Step 1: Validate build output
    const { template } = validateBuildOutput()
    
    // Step 2: Build SSR
    const ssrBuilt = await buildSSR()
    
    // Step 3: Load renderer
    const render = await loadServerRenderer()
    
    // Step 4: Get all routes to prerender
    const staticRoutes = [
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
    
    const dynamicRoutes = await fetchDynamicRoutes()
    const allRoutes = [...staticRoutes, ...dynamicRoutes]
    
    console.log(`🚀 Prerendering ${allRoutes.length} routes (${staticRoutes.length} static + ${dynamicRoutes.length} dynamic)...`)
    
    // Step 5: Prerender all routes
    let successCount = 0
    let failureCount = 0
    
    for (const url of allRoutes) {
      const success = await prerenderPage(url, template, render)
      if (success) {
        successCount++
      } else {
        failureCount++
      }
    }
    
    // Step 6: Generate summary
    console.log('\n🎉 Prerendering completed!')
    console.log(`✅ Successfully prerendered: ${successCount} pages`)
    if (failureCount > 0) {
      console.log(`❌ Failed to prerender: ${failureCount} pages`)
    }
    
    // Step 7: Validation recommendations
    console.log('\n📋 Next steps for validation:')
    console.log('1. Test a few HTML files by opening them directly in your browser')
    console.log('2. Start a local server: `npx serve dist`')
    console.log('3. Test with curl: `curl http://localhost:3000/`')
    console.log('4. Test with Screaming Frog pointed at your local server')
    console.log('5. Deploy and test with Screaming Frog on the live site')
    
  } catch (error) {
    console.error('❌ Prerendering failed:', error)
    process.exit(1)
  }
}

// Run the prerendering
main().catch(console.error)
