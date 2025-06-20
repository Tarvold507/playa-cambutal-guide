
import { supabase } from '@/integrations/supabase/client';

export interface SitemapUrl {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://playacambutalguide.com';
  const urls: SitemapUrl[] = [];

  // Static pages with high priority
  const staticPages: SitemapUrl[] = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/surf', changeFrequency: 'weekly', priority: 0.9 },
    { url: '/eat', changeFrequency: 'daily', priority: 0.9 },
    { url: '/stay', changeFrequency: 'daily', priority: 0.9 },
    { url: '/do', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/calendar', changeFrequency: 'daily', priority: 0.8 },
    { url: '/blog', changeFrequency: 'daily', priority: 0.8 },
    { url: '/transportation', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/real-estate', changeFrequency: 'weekly', priority: 0.7 },
    { url: '/info', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/legal', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/disclosure', changeFrequency: 'yearly', priority: 0.3 },
  ];

  urls.push(...staticPages);

  try {
    console.log('🗺️ Generating comprehensive sitemap with domain:', baseUrl);

    // Fetch restaurants with slug generation
    const { data: restaurants } = await supabase
      .from('restaurant_listings')
      .select('name, updated_at')
      .eq('approved', true);

    if (restaurants) {
      restaurants.forEach(restaurant => {
        const slug = restaurant.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        urls.push({
          url: `/eat/${slug}`,
          lastModified: restaurant.updated_at,
          changeFrequency: 'weekly',
          priority: 0.8
        });
      });
      console.log(`✅ Added ${restaurants.length} restaurant URLs`);
    }

    // Fetch hotels with slug generation
    const { data: hotels } = await supabase
      .from('hotel_listings')
      .select('name, updated_at')
      .eq('approved', true);

    if (hotels) {
      hotels.forEach(hotel => {
        const slug = hotel.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        urls.push({
          url: `/stay/${slug}`,
          lastModified: hotel.updated_at,
          changeFrequency: 'weekly',
          priority: 0.8
        });
      });
      console.log(`✅ Added ${hotels.length} hotel URLs`);
    }

    // Fetch adventure businesses with slug generation
    const { data: businesses } = await supabase
      .from('adventure_business_listings')
      .select('business_name, updated_at')
      .eq('approved', true);

    if (businesses) {
      businesses.forEach(business => {
        const slug = business.business_name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        urls.push({
          url: `/do/${slug}`,
          lastModified: business.updated_at,
          changeFrequency: 'weekly',
          priority: 0.7
        });
      });
      console.log(`✅ Added ${businesses.length} business URLs`);
    }

    // Fetch blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('approved', true)
      .eq('status', 'published');

    if (blogPosts) {
      blogPosts.forEach(post => {
        urls.push({
          url: `/blog/${post.slug}`,
          lastModified: post.updated_at,
          changeFrequency: 'monthly',
          priority: 0.6
        });
      });
      console.log(`✅ Added ${blogPosts.length} blog post URLs`);
    }

    // Add pages from page_seo table to ensure all database-managed pages are included
    const { data: seoPages } = await supabase
      .from('page_seo')
      .select('page_path, updated_at');

    if (seoPages) {
      seoPages.forEach(page => {
        // Only add if not already in static pages
        const existsInStatic = staticPages.some(staticPage => staticPage.url === page.page_path);
        if (!existsInStatic) {
          urls.push({
            url: page.page_path,
            lastModified: page.updated_at,
            changeFrequency: 'monthly',
            priority: 0.5
          });
        }
      });
      console.log(`✅ Added ${seoPages.length} SEO page URLs`);
    }

  } catch (error) {
    console.error('❌ Error fetching sitemap data:', error);
  }

  // Sort URLs by priority (highest first) then alphabetically
  urls.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return a.url.localeCompare(b.url);
  });

  // Generate XML sitemap with proper formatting
  const xmlParts: string[] = ['<?xml version="1.0" encoding="UTF-8"?>'];
  xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  urls.forEach(urlData => {
    xmlParts.push('  <url>');
    xmlParts.push(`    <loc>${baseUrl}${urlData.url}</loc>`);
    
    if (urlData.lastModified) {
      const date = new Date(urlData.lastModified).toISOString().split('T')[0];
      xmlParts.push(`    <lastmod>${date}</lastmod>`);
    } else {
      // Use current date for static pages
      const currentDate = new Date().toISOString().split('T')[0];
      xmlParts.push(`    <lastmod>${currentDate}</lastmod>`);
    }
    
    if (urlData.changeFrequency) {
      xmlParts.push(`    <changefreq>${urlData.changeFrequency}</changefreq>`);
    }
    
    if (urlData.priority !== undefined) {
      xmlParts.push(`    <priority>${urlData.priority.toFixed(1)}</priority>`);
    }
    
    xmlParts.push('  </url>');
  });

  xmlParts.push('</urlset>');
  
  const totalUrls = urls.length;
  console.log(`🗺️ Generated comprehensive sitemap with ${totalUrls} URLs`);
  console.log(`📊 URL breakdown: ${staticPages.length} static pages + ${totalUrls - staticPages.length} dynamic pages`);
  
  return xmlParts.join('\n');
};

export const downloadSitemap = async (): Promise<void> => {
  const sitemapContent = await generateSitemap();
  const blob = new Blob([sitemapContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
