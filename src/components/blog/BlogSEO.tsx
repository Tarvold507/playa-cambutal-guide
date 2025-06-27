
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const BlogSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/blog');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO for blog page
          updatePageHead({
            id: 'blog-fallback',
            page_path: '/blog',
            page_title: 'Playa Cambutal Blog - Travel Stories & Local Insights | Playa Cambutal Guide',
            meta_description: 'Read the latest travel stories, local insights, and guides about Playa Cambutal, Panama. Tips for international visitors, local culture, and hidden gems.',
            meta_keywords: 'Playa Cambutal blog, Panama travel stories, local insights, travel tips, international tourists, hidden gems Panama',
            og_title: 'Playa Cambutal Blog - Travel Stories & Local Insights',
            og_description: 'Discover travel stories, local insights, and hidden gems about Playa Cambutal, Panama through our travel blog.',
            og_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: 'https://playacambutalguide.com/blog',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Playa Cambutal Blog",
              "description": "Travel stories, local insights, and guides about Playa Cambutal, Panama.",
              "url": "https://playacambutalguide.com/blog",
              "publisher": {
                "@type": "Organization",
                "name": "Playa Cambutal Guide"
              }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /blog:', error);
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
