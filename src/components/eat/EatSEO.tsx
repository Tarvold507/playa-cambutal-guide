
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const EatSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        console.log('🔍 [SEO DEBUG] Loading SEO for /eat page');
        const seoData = await fetchSEOByPath('/eat');
        
        if (seoData) {
          console.log('✅ [SEO DEBUG] Found database SEO for /eat page');
          console.log('🎯 [SEO DEBUG] Applying /eat database SEO to page head');
          updatePageHead(seoData);
        } else {
          console.log('⚠️ [SEO DEBUG] No database SEO found for /eat, using fallback');
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
            canonical_url: `https://playacambutalguide.com/eat`,
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Best Restaurants in Cambutal, Panama",
              "description": "Discover the best restaurants and dining options in Playa Cambutal, Panama.",
              "url": `https://playacambutalguide.com/eat`
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('❌ [SEO DEBUG] Error loading SEO data for /eat:', error);
        // Use fallback even on error
        console.log('🆘 [SEO DEBUG] Using emergency fallback for /eat');
        updatePageHead({
          id: 'eat-error-fallback',
          page_path: '/eat',
          page_title: 'Restaurants in Playa Cambutal - Playa Cambutal Guide',
          canonical_url: `https://playacambutalguide.com/eat`,
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
