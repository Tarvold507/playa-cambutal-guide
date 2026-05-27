import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { prerenderPage } from './lib/prerender-page.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.q63nFaQEJDRpgeXvUYwdzAU-ciDZwatGEWPTIyQ4Tdc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Public routes only — auth/admin/user pages are not prerendered
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
  '/disclosure'
]

// Returns both the flat route list (for prerendering) and per-section listing data
// (name + slug) used to inject static link sections into list-page HTML.
async function fetchDynamicRoutes() {
  const routes = []
  const listings = { hotels: [], restaurants: [], blogs: [], businesses: [] }

  try {
    const { data: restaurants } = await supabase
      .from('restaurant_listings')
      .select('slug, name')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (restaurants) {
      restaurants.forEach(r => {
        if (r.slug) {
          routes.push(`/eat/${r.slug}`)
          listings.restaurants.push({ slug: r.slug, name: r.name })
        }
      })
    }

    const { data: hotels } = await supabase
      .from('hotel_listings')
      .select('slug, name')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (hotels) {
      hotels.forEach(h => {
        if (h.slug) {
          routes.push(`/stay/${h.slug}`)
          listings.hotels.push({ slug: h.slug, name: h.name })
        }
      })
    }

    const { data: blogs } = await supabase
      .from('blog_posts')
      .select('slug, title')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (blogs) {
      blogs.forEach(b => {
        if (b.slug) {
          routes.push(`/blog/${b.slug}`)
          listings.blogs.push({ slug: b.slug, name: b.title })
        }
      })
    }

    const { data: businesses } = await supabase
      .from('adventure_business_listings')
      .select('business_name')
      .eq('approved', true)

    if (businesses) {
      businesses.forEach(business => {
        const slug = business.business_name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        if (slug) {
          routes.push(`/do/${slug}`)
          listings.businesses.push({ slug, name: business.business_name })
        }
      })
    }
  } catch (error) {
    console.warn('⚠️ Error fetching dynamic routes:', error)
  }

  return { routes, listings }
}

;(async () => {
  console.log('🚀 Starting prerender process...')

  const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
  const { render } = await import('./dist/server/entry-server.js')

  const { routes: dynamicRoutes, listings } = await fetchDynamicRoutes()
  const allRoutes = [...staticRoutes, ...dynamicRoutes]

  // Per-section static link data injected into list-page prerendered HTML so
  // crawlers can discover individual listing pages (the React cards are loaded
  // client-side and are not present in the initial SSR output).
  const listPageLinks = {
    '/stay': listings.hotels.map(h => ({ path: `/stay/${h.slug}/`, label: h.name })),
    '/eat': listings.restaurants.map(r => ({ path: `/eat/${r.slug}/`, label: r.name })),
    '/blog': listings.blogs.map(b => ({ path: `/blog/${b.slug}/`, label: b.name })),
    '/do': listings.businesses.map(b => ({ path: `/do/${b.slug}/`, label: b.name })),
  }

  console.log(`📄 Prerendering ${allRoutes.length} routes...`)

  let succeeded = 0
  let failed = 0

  for (const route of allRoutes) {
    const relatedLinks = listPageLinks[route] || null
    const ok = await prerenderPage(route, template, render, { relatedLinks })
    if (ok) succeeded++; else failed++
  }

  console.log(`\n🎉 Prerendering complete: ${succeeded} succeeded, ${failed} failed`)
})()
