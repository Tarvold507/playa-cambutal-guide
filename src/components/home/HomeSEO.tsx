
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const HomeSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        console.log('🔍 [SEO DEBUG] Loading SEO for / (home) page');
        const seoData = await fetchSEOByPath('/');
        
        if (seoData) {
          console.log('✅ [SEO DEBUG] Found database SEO for home page');
          updatePageHead(seoData);
        } else {
          console.log('⚠️ [SEO DEBUG] No database SEO found for home, using fallback');
          // Fallback SEO if no database data exists
          updatePageHead({
            id: 'home-fallback',
            page_path: '/',
            page_title: 'Playa Cambutal Guide - Discover Panama\'s Hidden Paradise',
            meta_description: 'Complete travel guide to Playa Cambutal, Panama. Find the best hotels, restaurants, surf spots, and activities in this beautiful beach destination.',
            meta_keywords: 'playa cambutal, cambutal panama, panama beaches, cambutal surf, panama travel guide, surfing panama, panama hotels',
            og_title: 'Playa Cambutal Guide - Discover Panama\'s Hidden Paradise',
            og_description: 'Complete travel guide to Playa Cambutal, Panama. Find the best hotels, restaurants, surf spots, and activities.',
            og_image: 'https://playacambutalguide.com/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png',
            canonical_url: 'https://playacambutalguide.com/',
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Playa Cambutal Guide - Discover Panama's Hidden Paradise",
              "description": "Complete travel guide to Playa Cambutal, Panama. Find the best hotels, restaurants, surf spots, and activities in this beautiful beach destination.",
              "url": "https://playacambutalguide.com/",
              "mainEntity": {
                "@type": "TouristDestination",
                "name": "Playa Cambutal",
                "description": "A horseshoe-shaped bay on Panama's Pacific coast known for consistent waves, stunning sunsets, and laid-back atmosphere.",
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
        console.error('❌ [SEO DEBUG] Error loading SEO data for home:', error);
        // Use fallback even on error
        updatePageHead({
          id: 'home-error-fallback',
          page_path: '/',
          page_title: 'Playa Cambutal Guide - Panama Beach Paradise',
          canonical_url: 'https://playacambutalguide.com/',
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

export default HomeSEO;
