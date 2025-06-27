
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const CalendarSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/calendar');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO for calendar page
          updatePageHead({
            id: 'calendar-fallback',
            page_path: '/calendar',
            page_title: 'Cambutal Events Calendar - What\'s Happening | Playa Cambutal Guide',
            meta_description: 'Stay updated with events, festivals, and activities in Playa Cambutal, Panama. Find local events, international festivals, and community gatherings.',
            meta_keywords: 'Cambutal events, Panama festivals, Playa Cambutal calendar, local events, community activities, international tourists',
            og_title: 'Cambutal Events Calendar - What\'s Happening',
            og_description: 'Discover upcoming events and festivals in beautiful Playa Cambutal, Panama. Perfect for international visitors from North America and Europe.',
            og_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: 'https://playacambutalguide.com/calendar',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Cambutal Events Calendar",
              "description": "Stay updated with events, festivals, and activities in Playa Cambutal, Panama.",
              "url": "https://playacambutalguide.com/calendar",
              "mainEntity": {
                "@type": "TouristDestination",
                "name": "Playa Cambutal Events",
                "description": "Events and festivals in Playa Cambutal, Panama",
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 7.2833,
                  "longitude": -80.5167
                }
              }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /calendar:', error);
        updatePageHead({
          id: 'calendar-error-fallback',
          page_path: '/calendar',
          page_title: 'Events Calendar - Playa Cambutal Guide',
          canonical_url: 'https://playacambutalguide.com/calendar',
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

export default CalendarSEO;
