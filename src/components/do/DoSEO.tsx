
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead, cleanupPreviousSchema } from '@/utils/seoUtils';

const DoSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        // Clean up any existing schema
        cleanupPreviousSchema();
        
        const seoData = await fetchSEOByPath('/do');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO if no database data exists
          updatePageHead({
            id: 'do-fallback',
            page_path: '/do',
            page_title: 'Things to Do in Cambutal, Panama - Activities Guide',
            meta_description: 'Discover exciting activities in Playa Cambutal, Panama. From surfing and yoga to wildlife tours and fishing charters.',
            meta_keywords: 'Cambutal activities, Panama tours, surfing, yoga, wildlife tours, fishing charters, adventure travel',
            og_title: 'Things to Do in Cambutal, Panama',
            og_description: 'Discover exciting activities and adventures in beautiful Playa Cambutal, Panama.',
            og_image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: `${window.location.origin}/do`,
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Things to Do in Cambutal, Panama - Activities & Tours",
              "description": "Discover exciting activities in Playa Cambutal, Panama. From surfing and yoga to wildlife tours and fishing charters.",
              "url": `${window.location.origin}/do`,
              "mainEntity": {
                "@type": "TouristDestination",
                "name": "Cambutal Activities",
                "description": "Activities and tours in Playa Cambutal, Panama",
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
        console.error('Error loading SEO data for /do:', error);
        updatePageHead({
          id: 'do-error-fallback',
          page_path: '/do',
          page_title: 'Activities in Playa Cambutal - Playa Cambutal Guide',
          canonical_url: `${window.location.origin}/do`,
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

export default DoSEO;
