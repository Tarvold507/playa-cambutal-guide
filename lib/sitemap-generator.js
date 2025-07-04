import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNTc5MjksImV4cCI6MjA2MzYzMzkyOX0.oUUEK4cPPbREJjzYXvsxhXLbpargzgXqqtmQ7xTJ7FI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const baseUrl = 'https://playacambutalguide.com'

async function generateSitemap() {
  console.log('🗺️ Generating dynamic sitemap.xml...')
  
  try {
    const urls = []
    const today = new Date().toISOString().split('T')[0]

    // Static pages with priorities and change frequencies
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/surf', priority: '0.9', changefreq: 'weekly' },
      { url: '/eat', priority: '0.9', changefreq: 'daily' },
      { url: '/stay', priority: '0.9', changefreq: 'daily' },
      { url: '/do', priority: '0.8', changefreq: 'weekly' },
      { url: '/calendar', priority: '0.8', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/transportation', priority: '0.7', changefreq: 'monthly' },
      { url: '/real-estate', priority: '0.7', changefreq: 'weekly' },
      { url: '/info', priority: '0.6', changefreq: 'monthly' },
      { url: '/legal', priority: '0.3', changefreq: 'yearly' },
      { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms', priority: '0.3', changefreq: 'yearly' },
      { url: '/disclosure', priority: '0.3', changefreq: 'yearly' }
    ]

    // Add static pages
    staticPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}${page.url}`,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority
      })
    })

    // Fetch hotel listings (stay pages)
    console.log('📍 Fetching hotel listings...')
    const { data: hotels, error: hotelError } = await supabase
      .from('hotel_listings')
      .select('slug, updated_at')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (hotelError) {
      console.warn('⚠️ Error fetching hotels:', hotelError)
    } else if (hotels) {
      hotels.forEach(hotel => {
        urls.push({
          loc: `${baseUrl}/stay/${hotel.slug}`,
          lastmod: hotel.updated_at ? hotel.updated_at.split('T')[0] : today,
          changefreq: 'weekly',
          priority: '0.8'
        })
      })
      console.log(`✅ Added ${hotels.length} hotel pages`)
    }

    // Fetch restaurant listings (eat pages)
    console.log('🍽️ Fetching restaurant listings...')
    const { data: restaurants, error: restaurantError } = await supabase
      .from('restaurant_listings')
      .select('slug, updated_at')
      .eq('approved', true)
      .not('slug', 'is', null)

    if (restaurantError) {
      console.warn('⚠️ Error fetching restaurants:', restaurantError)
    } else if (restaurants) {
      restaurants.forEach(restaurant => {
        urls.push({
          loc: `${baseUrl}/eat/${restaurant.slug}`,
          lastmod: restaurant.updated_at ? restaurant.updated_at.split('T')[0] : today,
          changefreq: 'weekly',
          priority: '0.8'
        })
      })
      console.log(`✅ Added ${restaurants.length} restaurant pages`)
    }

    // Fetch blog posts
    console.log('📝 Fetching blog posts...')
    const { data: blogs, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('approved', true)
      .eq('status', 'published')
      .not('slug', 'is', null)

    if (blogError) {
      console.warn('⚠️ Error fetching blog posts:', blogError)
    } else if (blogs) {
      blogs.forEach(blog => {
        urls.push({
          loc: `${baseUrl}/blog/${blog.slug}`,
          lastmod: blog.updated_at ? blog.updated_at.split('T')[0] : today,
          changefreq: 'monthly',
          priority: '0.6'
        })
      })
      console.log(`✅ Added ${blogs.length} blog pages`)
    }

    // Fetch adventure business listings (do pages)
    console.log('🏃 Fetching adventure businesses...')
    const { data: businesses, error: businessError } = await supabase
      .from('adventure_business_listings')
      .select('business_name, updated_at')
      .eq('approved', true)

    if (businessError) {
      console.warn('⚠️ Error fetching businesses:', businessError)
    } else if (businesses) {
      businesses.forEach(business => {
        // Generate slug from business name
        const slug = business.business_name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        
        urls.push({
          loc: `${baseUrl}/do/${slug}`,
          lastmod: business.updated_at ? business.updated_at.split('T')[0] : today,
          changefreq: 'weekly',
          priority: '0.7'
        })
      })
      console.log(`✅ Added ${businesses.length} adventure business pages`)
    }

    // Generate XML sitemap
    let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    urls.forEach(urlData => {
      sitemapXml += '  <url>\n'
      sitemapXml += `    <loc>${urlData.loc}</loc>\n`
      sitemapXml += `    <lastmod>${urlData.lastmod}</lastmod>\n`
      sitemapXml += `    <changefreq>${urlData.changefreq}</changefreq>\n`
      sitemapXml += `    <priority>${urlData.priority}</priority>\n`
      sitemapXml += '  </url>\n'
    })

    sitemapXml += '</urlset>\n'

    // Write sitemap to public directory
    const sitemapPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml')
    fs.writeFileSync(sitemapPath, sitemapXml, 'utf8')

    console.log(`🎉 Successfully generated sitemap.xml with ${urls.length} URLs`)
    console.log(`📁 Sitemap saved to: ${sitemapPath}`)
    
    return true

  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error)
    process.exit(1)
  }
}

// Run the generator
generateSitemap()