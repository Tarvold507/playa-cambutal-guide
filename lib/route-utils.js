import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxsnoncplnzekfwaknxb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA1NzkyOSwiZXhwIjoyMDYzNjMzOTI5fQ.T7x4VmHKcJdMqZ0hTWQdQTFzqkHuJNUjqRxKLfBbFhg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function fetchDynamicRoutes() {
  const routes = []
  
  try {
    console.log('🔍 Fetching dynamic routes from database...')
    
    // Add hotel routes
    const { data: hotels, error: hotelError } = await supabase
      .from('hotel_listings')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)
    
    if (hotelError) {
      console.warn('Hotel fetch error:', hotelError)
    } else if (hotels) {
      hotels.forEach(hotel => {
        if (hotel.slug) {
          routes.push(`/stay/${hotel.slug}`)
        }
      })
      console.log(`📍 Found ${hotels.length} hotel routes`)
    }
    
    // Add restaurant routes
    const { data: restaurants, error: restaurantError } = await supabase
      .from('restaurant_listings')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)
    
    if (restaurantError) {
      console.warn('Restaurant fetch error:', restaurantError)
    } else if (restaurants) {
      restaurants.forEach(restaurant => {
        if (restaurant.slug) {
          routes.push(`/eat/${restaurant.slug}`)
        }
      })
      console.log(`🍽️ Found ${restaurants.length} restaurant routes`)
    }
    
    // Add blog routes
    const { data: blogs, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null)
    
    if (blogError) {
      console.warn('Blog fetch error:', blogError)
    } else if (blogs) {
      blogs.forEach(blog => {
        if (blog.slug) {
          routes.push(`/blog/${blog.slug}`)
        }
      })
      console.log(`📝 Found ${blogs.length} blog routes`)
    }
  } catch (error) {
    console.warn('⚠️ Error fetching dynamic routes:', error)
  }
  
  console.log(`📋 Total dynamic routes found: ${routes.length}`)
  return routes
}

export function getStaticRoutes() {
  return [
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
}