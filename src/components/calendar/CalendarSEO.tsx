
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const CalendarSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        console.log('🔍 [SEO DEBUG] Loading SEO for /calendar page');
        const seoData = await fetchSEOByPath('/calendar');
        
        if (seoData) {
          console.log('✅ [SEO DEBUG] Found database SEO for /calendar page');
          updatePageHead(seoData);
        } else {
          console.log('⚠️ [SEO DEBUG] No database SEO found for /calendar, using fallback');
          // Fallback SEO if no database data exists
          updatePageHead({
            id: 'calendar-fallback',
            page_path: '/calendar',
            page_title: 'Events Calendar - Playa Cambutal Local Events',
            meta_description: 'Discover upcoming events and activities in Playa Cambutal, Panama. Find local festivals, surf competitions, yoga sessions, and community gatherings.',
            meta_keywords: 'cambutal events, panama events calendar, local festivals, surf competitions, yoga sessions, community events',
            og_title: 'Events Calendar - Playa Cambutal Local Events',
            og_description: 'Discover upcoming events and activities in Playa Cambutal, Panama.',
            og_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: 'https://playacambutalguide.com/calendar',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Events Calendar - Playa Cambutal",
              "description": "Discover upcoming events and activities in Playa Cambutal, Panama",
              "url": "https://playacambutalguide.com/calendar"
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('❌ [SEO DEBUG] Error loading SEO data for /calendar:', error);
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
