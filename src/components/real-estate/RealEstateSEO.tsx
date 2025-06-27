
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const RealEstateSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/real-estate');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO for real estate page
          updatePageHead({
            id: 'real-estate-fallback',
            page_path: '/real-estate',
            page_title: 'Cambutal Real Estate - Properties & Land for Sale | Playa Cambutal Guide',
            meta_description: 'Explore real estate opportunities in Playa Cambutal, Panama. Beach properties, land for sale, and investment opportunities for international buyers from North America and Europe.',
            meta_keywords: 'Cambutal property, Panama real estate, beach property Panama, land for sale Cambutal, investment property, international real estate',
            og_title: 'Cambutal Real Estate - Beach Properties & Investment',
            og_description: 'Discover prime real estate opportunities in beautiful Playa Cambutal, Panama. Perfect for international investors and those seeking beachfront properties.',
            og_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: 'https://playacambutalguide.com/real-estate',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Cambutal Real Estate - Properties & Investment",
              "description": "Explore real estate opportunities in Playa Cambutal, Panama for international buyers.",
              "url": "https://playacambutalguide.com/real-estate",
              "mainEntity": {
                "@type": "RealEstateAgent",
                "name": "Playa Cambutal Real Estate",
                "description": "Real estate opportunities in Playa Cambutal, Panama",
                "areaServed": {
                  "@type": "Place",
                  "name": "Playa Cambutal, Panama"
                }
              }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /real-estate:', error);
        updatePageHead({
          id: 'real-estate-error-fallback',
          page_path: '/real-estate',
          page_title: 'Real Estate - Playa Cambutal Guide',
          canonical_url: 'https://playacambutalguide.com/real-estate',
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

export default RealEstateSEO;
