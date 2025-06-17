
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
    }

    // Fetch hotels with slug generation (hotels don't have a slug column, so generate from name)
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
    }

    // Fetch adventure businesses with slug generation (using business_name)
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
    }

    // Fetch blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('approved', true);

    if (blogPosts) {
      blogPosts.forEach(post => {
        urls.push({
          url: `/blog/${post.slug}`,
          lastModified: post.updated_at,
          changeFrequency: 'monthly',
          priority: 0.6
        });
      });
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
    }

  } catch (error) {
    console.error('Error fetching sitemap data:', error);
  }

  // Generate XML sitemap
  const xmlParts: string[] = ['<?xml version="1.0" encoding="UTF-8"?>'];
  xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  urls.forEach(urlData => {
    xmlParts.push('  <url>');
    xmlParts.push(`    <loc>${baseUrl}${urlData.url}</loc>`);
    
    if (urlData.lastModified) {
      const date = new Date(urlData.lastModified).toISOString().split('T')[0];
      xmlParts.push(`    <lastmod>${date}</lastmod>`);
    }
    
    if (urlData.changeFrequency) {
      xmlParts.push(`    <changefreq>${urlData.changeFrequency}</changefreq>`);
    }
    
    if (urlData.priority !== undefined) {
      xmlParts.push(`    <priority>${urlData.priority}</priority>`);
    }
    
    xmlParts.push('  </url>');
  });

  xmlParts.push('</urlset>');
  
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
