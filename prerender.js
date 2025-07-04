import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.T7x4VmHKcJdMqZ0hTWQdQTFzqkHuJNUjqRxKLfBbFhg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Static routes from App.tsx
const staticRoutes = [
  '/',
  '/eat',
  '/stay', 
  '/do',
  '/surf',
  '/blog',
  '/calendar',
  '/transportation',
  '/real-estate',
  '/info',
  '/legal',
  '/privacy',
  '/terms',
  '/disclosure',
  '/auth',
  '/profile',
  '/my-listings',
  '/add-restaurant',
  '/add-hotel',
  '/add-blog',
  '/admin'
]

// Fetch dynamic routes from Supabase
async function fetchDynamicRoutes() {
  const routes = []
  
  try {
    // Fetch restaurant routes
    const { data: restaurants } = await supabase
      .from('restaurant_listings')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)
    
    if (restaurants) {
      restaurants.forEach(restaurant => {
        routes.push(`/eat/${restaurant.slug}`)
      })
    }
    
    // Fetch hotel routes
    const { data: hotels } = await supabase
      .from('hotel_listings')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)
    
    if (hotels) {
      hotels.forEach(hotel => {
        routes.push(`/stay/${hotel.slug}`)
      })
    }
    
    // Fetch blog routes
    const { data: blogs } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)
    
    if (blogs) {
      blogs.forEach(blog => {
        routes.push(`/blog/${blog.slug}`)
      })
    }
    
    // Fetch adventure business routes
    const { data: businesses } = await supabase
      .from('adventure_business_listings')
      .select('business_name')
      .eq('approved', true)
    
    if (businesses) {
      businesses.forEach(business => {
        // Generate slug from business name
        const slug = business.business_name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        routes.push(`/do/${slug}`)
      })
    }
  } catch (error) {
    console.warn('Error fetching dynamic routes:', error)
  }
  
  return routes
}

// Ensure directory exists
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

;(async () => {
  console.log('🚀 Starting prerender process...')
  
  // Get all routes to prerender
  const dynamicRoutes = await fetchDynamicRoutes()
  const allRoutes = [...staticRoutes, ...dynamicRoutes]
  
  console.log(`📄 Prerendering ${allRoutes.length} routes...`)
  
  for (const url of allRoutes) {
    try {
      const appHtml = render(url)
      const html = template.replace(`<!--app-html-->`, appHtml)

      const filePath = url === '/' ? 'dist/index.html' : `dist${url}/index.html`
      const absolutePath = toAbsolute(filePath)
      
      // Ensure directory exists before writing
      ensureDirectoryExists(absolutePath)
      
      fs.writeFileSync(absolutePath, html)
      console.log('✅ Pre-rendered:', filePath)
    } catch (error) {
      console.error(`❌ Failed to prerender ${url}:`, error)
    }
  }
  
  console.log('🎉 Prerendering completed!')
})()