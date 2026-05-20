import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { prerenderPage } from './lib/prerender-page.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.T7x4VmHKcJdMqZ0hTWQdQTFzqkHuJNUjqRxKLfBbFhg'

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

async function fetchDynamicRoutes() {
  const routes = []

  try {
    const { data: restaurants } = await supabase
      .from('restaurant_listings')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (restaurants) {
      restaurants.forEach(r => { if (r.slug) routes.push(`/eat/${r.slug}`) })
    }

    const { data: hotels } = await supabase
      .from('hotel_listings')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (hotels) {
      hotels.forEach(h => { if (h.slug) routes.push(`/stay/${h.slug}`) })
    }

    const { data: blogs } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (blogs) {
      blogs.forEach(b => { if (b.slug) routes.push(`/blog/${b.slug}`) })
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
        if (slug) routes.push(`/do/${slug}`)
      })
    }
  } catch (error) {
    console.warn('⚠️ Error fetching dynamic routes:', error)
  }

  return routes
}

;(async () => {
  console.log('🚀 Starting prerender process...')

  const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
  const { render } = await import('./dist/server/entry-server.js')

  const dynamicRoutes = await fetchDynamicRoutes()
  const allRoutes = [...staticRoutes, ...dynamicRoutes]

  console.log(`📄 Prerendering ${allRoutes.length} routes...`)

  let succeeded = 0
  let failed = 0

  for (const route of allRoutes) {
    const ok = await prerenderPage(route, template, render)
    if (ok) succeeded++; else failed++
  }

  console.log(`\n🎉 Prerendering complete: ${succeeded} succeeded, ${failed} failed`)
})()
