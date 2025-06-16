
import { supabase } from '@/integrations/supabase/client';

export interface SitemapUrl {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://playacambutal.guide';
  const urls: SitemapUrl[] = [];

  // Static pages with high priority
  const staticPages = [
    { url: '/', changeFrequency: 'daily' as const, priority: 1.0 },
    { url: '/surf', changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: '/eat', changeFrequency: 'daily' as const, priority: 0.9 },
    { url: '/stay', changeFrequency: 'daily' as const, priority: 0.9 },
    { url: '/do', changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: '/calendar', changeFrequency: 'daily' as const, priority: 0.8 },
    { url: '/blog', changeFrequency: 'daily' as const, priority: 0.8 },
    { url: '/transportation', changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: '/real-estate', changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: '/info', changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: '/legal', changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: '/disclosure', changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  urls.push(...staticPages);

  try {
    // Fetch restaurants
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

    // Fetch hotels - using 'name' instead of 'slug' since hotels don't have a slug column
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

    // Fetch adventure businesses - using 'business_name' instead of 'name'
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
      .eq('published', true);

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

  } catch (error) {
    console.error('Error fetching sitemap data:', error);
  }

  // Generate XML sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(urlData => `  <url>
    <loc>${baseUrl}${urlData.url}</loc>
    ${urlData.lastModified ? `<lastmod>${new Date(urlData.lastModified).toISOString().split('T')[0]}</lastmod>` : ''}
    ${urlData.changeFrequency ? `<changefreq>${urlData.changeFrequency}</changefreq>` : ''}
    ${urlData.priority ? `<priority>${urlData.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const downloadSitemap = async () => {
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
