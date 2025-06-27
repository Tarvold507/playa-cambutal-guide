
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const SurfSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/surf');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO for surf page
          updatePageHead({
            id: 'surf-fallback',
            page_path: '/surf',
            page_title: 'Surf Cambutal - Best Surf Spots in Panama | Playa Cambutal Guide',
            meta_description: 'Discover the best surf spots in Playa Cambutal, Panama. Consistent waves, perfect breaks, and world-class surfing conditions year-round. Perfect for international surfers.',
            meta_keywords: 'Cambutal surf, Panama surf spots, Playa Cambutal waves, surfing Panama, surf breaks, surf conditions, international surfing destination',
            og_title: 'Surf Cambutal - Best Surf Spots in Panama',
            og_description: 'Experience world-class surfing at Playa Cambutal with consistent waves and perfect breaks. A top destination for surfers from North America and Europe.',
            og_image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: 'https://playacambutalguide.com/surf',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Surf Cambutal - Best Surf Spots in Panama",
              "description": "Discover the best surf spots in Playa Cambutal, Panama with consistent waves and world-class conditions.",
              "url": "https://playacambutalguide.com/surf",
              "mainEntity": {
                "@type": "TouristDestination",
                "name": "Playa Cambutal Surf Spots",
                "description": "World-class surf breaks in Playa Cambutal, Panama",
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 7.2833,
                  "longitude": -80.5167
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "Panama",
                  "addressRegion": "Los Santos Province",
                  "addressLocality": "Cambutal"
                }
              }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /surf:', error);
        updatePageHead({
          id: 'surf-error-fallback',
          page_path: '/surf',
          page_title: 'Surf Spots - Playa Cambutal Guide',
          canonical_url: 'https://playacambutalguide.com/surf',
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

export default SurfSEO;
