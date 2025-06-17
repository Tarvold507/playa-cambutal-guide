
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const StaySEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/stay');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO if no database data exists
          updatePageHead({
            id: 'stay-fallback',
            page_path: '/stay',
            page_title: 'Hotels & Accommodations in Playa Cambutal - Travel Guide',
            meta_description: 'Find the perfect place to stay in Playa Cambutal, Panama. From luxury resorts to budget hostels, discover accommodations for every traveler.',
            meta_keywords: 'Playa Cambutal hotels, Panama accommodation, beach hotels, surf hotels, eco lodges, hostels, vacation rentals',
            og_title: 'Hotels & Accommodations in Playa Cambutal',
            og_description: 'Discover the best places to stay in Playa Cambutal, from luxury beachfront resorts to cozy eco-lodges.',
            og_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: `${window.location.origin}/stay`,
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Hotels & Accommodations in Playa Cambutal",
              "description": "Find the perfect place to stay in Playa Cambutal, Panama.",
              "url": `${window.location.origin}/stay`
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /stay:', error);
        updatePageHead({
          id: 'stay-error-fallback',
          page_path: '/stay',
          page_title: 'Accommodations in Playa Cambutal - Playa Cambutal Guide',
          canonical_url: `${window.location.origin}/stay`,
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

export default StaySEO;
