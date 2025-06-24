
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const BlogSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        console.log('🔍 [SEO DEBUG] Loading SEO for /blog page');
        const seoData = await fetchSEOByPath('/blog');
        
        if (seoData) {
          console.log('✅ [SEO DEBUG] Found database SEO for /blog page');
          updatePageHead(seoData);
        } else {
          console.log('⚠️ [SEO DEBUG] No database SEO found for /blog, using fallback');
          // Fallback SEO if no database data exists
          updatePageHead({
            id: 'blog-fallback',
            page_path: '/blog',
            page_title: 'Playa Cambutal Blog - Travel Stories & Local Insights',
            meta_description: 'Discover stories, tips, and insights about Playa Cambutal, Panama. Read about local experiences, travel guides, and hidden gems in this beautiful beach destination.',
            meta_keywords: 'playa cambutal blog, panama travel blog, cambutal stories, beach travel tips, panama insights, surfing stories',
            og_title: 'Playa Cambutal Blog - Travel Stories & Local Insights',
            og_description: 'Discover stories, tips, and insights about Playa Cambutal, Panama\'s hidden paradise.',
            og_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: 'https://playacambutalguide.com/blog',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Playa Cambutal Blog",
              "description": "Travel stories, tips, and insights about Playa Cambutal, Panama",
              "url": "https://playacambutalguide.com/blog"
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('❌ [SEO DEBUG] Error loading SEO data for /blog:', error);
        updatePageHead({
          id: 'blog-error-fallback',
          page_path: '/blog',
          page_title: 'Blog - Playa Cambutal Guide',
          canonical_url: 'https://playacambutalguide.com/blog',
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    };

    loadSEO();
  }, [fetchSEOByPath]);

  return null;
};

export default BlogSEO;
