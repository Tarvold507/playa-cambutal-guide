
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const EatSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/eat');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO if no database data exists
          updatePageHead({
            id: 'eat-fallback',
            page_path: '/eat',
            page_title: 'Best Restaurants in Cambutal, Panama - Dining Guide',
            meta_description: 'Discover the best restaurants and dining options in Playa Cambutal, Panama. From local favorites to international cuisine, find the perfect spot for your next meal.',
            meta_keywords: 'Playa Cambutal restaurants, Panama dining, beach restaurants, local food, seafood, international cuisine',
            og_title: 'Best Restaurants in Cambutal, Panama',
            og_description: 'Discover amazing dining experiences in Playa Cambutal, from fresh seafood to international cuisine.',
            og_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: `${window.location.origin}/eat`,
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Best Restaurants in Cambutal, Panama",
              "description": "Discover the best restaurants and dining options in Playa Cambutal, Panama.",
              "url": `${window.location.origin}/eat`
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /eat:', error);
        // Use fallback even on error
        updatePageHead({
          id: 'eat-error-fallback',
          page_path: '/eat',
          page_title: 'Restaurants in Playa Cambutal - Playa Cambutal Guide',
          canonical_url: `${window.location.origin}/eat`,
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

export default EatSEO;
