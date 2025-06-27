
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const TransportationSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/transportation');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO for transportation page
          updatePageHead({
            id: 'transportation-fallback',
            page_path: '/transportation',
            page_title: 'Getting to Cambutal - Transportation Guide | Playa Cambutal Guide',
            meta_description: 'Complete transportation guide to Playa Cambutal, Panama. Flights, buses, car rentals, and travel tips for international visitors from North America and Europe.',
            meta_keywords: 'getting to Cambutal, Cambutal transport, Panama travel, flights to Panama, bus to Cambutal, car rental Panama, international travel',
            og_title: 'Getting to Playa Cambutal - Transportation Guide',
            og_description: 'Your complete guide to reaching Playa Cambutal, Panama from anywhere in the world. Essential travel information for international tourists.',
            og_image: 'https://images.unsplash.com/photo-1596627116790-af6f46dddbae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: 'https://playacambutalguide.com/transportation',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Getting to Playa Cambutal - Transportation Guide",
              "description": "Complete transportation guide to reaching Playa Cambutal, Panama from anywhere in the world.",
              "url": "https://playacambutalguide.com/transportation",
              "mainEntity": {
                "@type": "TravelAction",
                "name": "Travel to Playa Cambutal",
                "description": "Transportation options to reach Playa Cambutal, Panama"
              }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /transportation:', error);
        updatePageHead({
          id: 'transportation-error-fallback',
          page_path: '/transportation',
          page_title: 'Transportation Guide - Playa Cambutal Guide',
          canonical_url: 'https://playacambutalguide.com/transportation',
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

export default TransportationSEO;
