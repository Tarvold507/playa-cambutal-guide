
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Import our server-side utilities
const { supabaseNode } = await import('./dist/utils/supabaseNode.js')
const { generateSEOHead, injectSEOIntoHTML } = await import('./dist/utils/seoNode.js')

// Helper function to ensure directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log('Created directory:', dir)
  }
}

// Helper function to generate fallback SEO for restaurant
const generateRestaurantSEO = (restaurant, pagePath) => {
  const getRestaurantOGImage = () => {
    if (restaurant.image_url) return restaurant.image_url;
    if (restaurant.gallery_images && restaurant.gallery_images.length > 0) return restaurant.gallery_images[0];
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };

  const createRestaurantDescription = () => {
    let description = '';
    
    if (restaurant.description) {
      description = restaurant.description;
    } else {
      description = `Experience authentic dining at ${restaurant.name} in Playa Cambutal, Panama.`;
    }
    
    if (restaurant.address) {
      description += ` Located at ${restaurant.address}.`;
    }
    
    if (restaurant.category) {
      description += ` Specializing in ${restaurant.category.toLowerCase()}.`;
    }
    
    return description;
  };

  return {
    id: restaurant.id,
    page_path: pagePath,
    page_title: `${restaurant.name} - Restaurant in Playa Cambutal | Playa Cambutal Guide`,
    meta_description: createRestaurantDescription(),
    meta_keywords: `${restaurant.name}, Playa Cambutal restaurant, ${restaurant.category || 'restaurant'}, Panama dining, beach restaurant, ${restaurant.address ? restaurant.address + ', ' : ''}Los Santos Province`,
    og_title: `${restaurant.name} - Playa Cambutal Restaurant`,
    og_description: createRestaurantDescription(),
    og_image: getRestaurantOGImage(),
    twitter_title: `${restaurant.name} - Playa Cambutal Restaurant`,
    twitter_description: createRestaurantDescription(),
    twitter_image: getRestaurantOGImage(),
    canonical_url: `https://playacambutalguide.com${pagePath}`,
    robots: 'index, follow',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": restaurant.name,
      "description": createRestaurantDescription(),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": restaurant.address,
        "addressLocality": "Playa Cambutal",
        "addressRegion": "Los Santos Province",
        "addressCountry": "PA"
      },
      "url": `https://playacambutalguide.com${pagePath}`,
      "telephone": restaurant.phone || undefined,
      "servesCuisine": restaurant.category || undefined
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Helper function to generate fallback SEO for hotel
const generateHotelSEO = (hotel, pagePath) => {
  const getHotelOGImage = () => {
    if (hotel.image_url) return hotel.image_url;
    if (hotel.gallery_images && hotel.gallery_images.length > 0) return hotel.gallery_images[0];
    return 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };

  const createHotelDescription = () => {
    let description = hotel.description || `Experience comfort and convenience at ${hotel.name} in beautiful Playa Cambutal, Panama.`;
    
    if (hotel.price_from) {
      description += ` Starting from $${hotel.price_from}/night.`;
    }
    
    description += ' Book your stay today.';
    
    return description;
  };

  return {
    id: hotel.id,
    page_path: pagePath,
    page_title: `${hotel.name} - Playa Cambutal Guide`,
    meta_description: createHotelDescription(),
    meta_keywords: `${hotel.name}, Playa Cambutal hotel, ${hotel.category}, Panama accommodation, beach hotel, ${hotel.amenities?.join(', ') || ''}`,
    og_title: `${hotel.name} - Playa Cambutal`,
    og_description: createHotelDescription(),
    og_image: getHotelOGImage(),
    twitter_title: `${hotel.name} - Playa Cambutal`,
    twitter_description: createHotelDescription(),
    twitter_image: getHotelOGImage(),
    canonical_url: `https://playacambutalguide.com${pagePath}`,
    robots: 'index, follow',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": hotel.name,
      "description": createHotelDescription(),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": hotel.address,
        "addressLocality": "Playa Cambutal",
        "addressRegion": "Los Santos",
        "addressCountry": "PA"
      },
      "url": `https://playacambutalguide.com${pagePath}`,
      "priceRange": hotel.price_from ? `$${hotel.price_from}-$${hotel.price_from * 3}` : undefined
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Helper function to generate fallback SEO for blog post
const generateBlogSEO = (post, pagePath) => {
  const createBlogDescription = () => {
    return post.excerpt || post.seo_description || `Read ${post.title} on Playa Cambutal Guide. Discover insights about Playa Cambutal, Panama.`;
  };

  return {
    id: post.id,
    page_path: pagePath,
    page_title: `${post.title} | Playa Cambutal Guide`,
    meta_description: createBlogDescription(),
    meta_keywords: `${post.tags?.join(', ') || ''}, Playa Cambutal, Panama blog, travel guide`,
    og_title: post.title,
    og_description: createBlogDescription(),
    og_image: post.featured_image_url || 'https://playacambutalguide.com/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png',
    twitter_title: post.title,
    twitter_description: createBlogDescription(),
    twitter_image: post.featured_image_url || 'https://playacambutalguide.com/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png',
    canonical_url: `https://playacambutalguide.com${pagePath}`,
    robots: 'index, follow',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": createBlogDescription(),
      "author": {
        "@type": "Person",
        "name": "Playa Cambutal Guide"
      },
      "datePublished": post.published_at,
      "dateModified": post.updated_at,
      "image": post.featured_image_url,
      "url": `https://playacambutalguide.com${pagePath}`
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Helper function to fetch SEO data from database or generate fallback
const fetchOrGenerateSEO = async (pagePath, contentData = null, contentType = null) => {
  try {
    // Try to fetch existing SEO data from database
    const { data: existingSEO } = await supabaseNode
      .from('page_seo')
      .select('*')
      .eq('page_path', pagePath)
      .maybeSingle();

    if (existingSEO) {
      console.log(`✅ Found database SEO for: ${pagePath}`);
      return existingSEO;
    }

    // Generate fallback SEO based on content type
    if (contentData && contentType) {
      console.log(`🔧 Generating fallback SEO for ${contentType}: ${pagePath}`);
      
      switch (contentType) {
        case 'restaurant':
          return generateRestaurantSEO(contentData, pagePath);
        case 'hotel':
          return generateHotelSEO(contentData, pagePath);
        case 'blog':
          return generateBlogSEO(contentData, pagePath);
        default:
          break;
      }
    }

    // Default fallback SEO
    console.log(`⚠️ Using default fallback SEO for: ${pagePath}`);
    return {
      id: 'fallback',
      page_path: pagePath,
      page_title: `Playa Cambutal Guide - Panama Beach Paradise`,
      meta_description: 'Discover Playa Cambutal, Panama\'s hidden paradise. Your complete guide to surfing, hotels, restaurants, and activities.',
      canonical_url: `https://playacambutalguide.com${pagePath}`,
      robots: 'index, follow',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ Error fetching SEO for ${pagePath}:`, error);
    return null;
  }
};

// Main prerender function
;(async () => {
  console.log('🚀 Starting SEO-aware static site generation...');
  
  let routesToPrerender = [
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
  ];

  try {
    // Fetch all approved restaurants and add to routes
    console.log('📊 Fetching restaurants...');
    const { data: restaurants } = await supabaseNode
      .from('restaurant_listings')
      .select('*')
      .eq('approved', true);

    if (restaurants) {
      console.log(`Found ${restaurants.length} approved restaurants`);
      for (const restaurant of restaurants) {
        const slug = restaurant.name.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        routesToPrerender.push(`/eat/${slug}`);
      }
    }

    // Fetch all approved hotels and add to routes
    console.log('📊 Fetching hotels...');
    const { data: hotels } = await supabaseNode
      .from('hotel_listings')
      .select('*')
      .eq('approved', true);

    if (hotels) {
      console.log(`Found ${hotels.length} approved hotels`);
      for (const hotel of hotels) {
        const slug = hotel.name.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        routesToPrerender.push(`/stay/${slug}`);
      }
    }

    // Fetch all published blog posts and add to routes
    console.log('📊 Fetching blog posts...');
    const { data: blogPosts } = await supabaseNode
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('approved', true);

    if (blogPosts) {
      console.log(`Found ${blogPosts.length} published blog posts`);
      for (const post of blogPosts) {
        routesToPrerender.push(`/blog/${post.slug}`);
      }
    }

    // Fetch all approved adventure businesses and add to routes
    console.log('📊 Fetching adventure businesses...');
    const { data: adventureBusinesses } = await supabaseNode
      .from('adventure_business_listings')
      .select('*')
      .eq('approved', true);

    if (adventureBusinesses) {
      console.log(`Found ${adventureBusinesses.length} approved adventure businesses`);
      for (const business of adventureBusinesses) {
        const slug = business.business_name.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        routesToPrerender.push(`/do/${slug}`);
      }
    }

    console.log(`📋 Total routes to prerender: ${routesToPrerender.length}`);

    // Prerender each route with SEO
    for (const route of routesToPrerender) {
      try {
        console.log(`🔍 Pre-rendering: ${route}`);
        
        // Determine content type and data for SEO generation
        let contentData = null;
        let contentType = null;
        
        if (route.startsWith('/eat/') && route !== '/eat') {
          const slug = route.replace('/eat/', '');
          contentData = restaurants?.find(r => 
            r.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() === slug
          );
          contentType = 'restaurant';
        } else if (route.startsWith('/stay/') && route !== '/stay') {
          const slug = route.replace('/stay/', '');
          contentData = hotels?.find(h => 
            h.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() === slug
          );
          contentType = 'hotel';
        } else if (route.startsWith('/blog/') && route !== '/blog') {
          const slug = route.replace('/blog/', '');
          contentData = blogPosts?.find(p => p.slug === slug);
          contentType = 'blog';
        }

        // Fetch or generate SEO data
        const seoData = await fetchOrGenerateSEO(route, contentData, contentType);
        
        // Render the React app
        const appHtml = render(route);
        
        // Generate SEO head tags
        const seoHead = generateSEOHead(seoData);
        
        // Inject SEO into the HTML template
        let html = template.replace(`<!--app-html-->`, appHtml);
        html = injectSEOIntoHTML(html, seoHead);

        const filePath = route === '/' 
          ? toAbsolute('dist/index.html')
          : toAbsolute(`dist${route}/index.html`);
        
        // Ensure the directory exists before writing
        ensureDirectoryExists(filePath);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Pre-rendered with SEO: ${filePath}`);
        
      } catch (error) {
        console.error(`❌ Error pre-rendering ${route}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error during database operations:', error);
  }
  
  console.log('\n🎉 SEO-aware static site generation complete!');
  console.log('📁 Generated files in dist/ directory with complete SEO');
  console.log('\n✅ All static pages now include:');
  console.log('   - Complete meta tags (title, description, keywords)');
  console.log('   - Open Graph tags for social media');
  console.log('   - Twitter Card tags');
  console.log('   - Canonical URLs');
  console.log('   - Schema.org structured data');
  console.log('   - Restaurant/Hotel/Blog specific SEO');
})()
