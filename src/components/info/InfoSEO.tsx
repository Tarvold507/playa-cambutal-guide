
import { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { updatePageHead } from '@/utils/seoUtils';

const InfoSEO = () => {
  const { fetchSEOByPath } = usePageSEO();

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const seoData = await fetchSEOByPath('/info');
        
        if (seoData) {
          updatePageHead(seoData);
        } else {
          // Fallback SEO if no database data exists
          updatePageHead({
            id: 'info-fallback',
            page_path: '/info',
            page_title: 'Cambutal Information Guide - Essential Travel Info',
            meta_description: 'Everything you need to know about Playa Cambutal, Panama. Essential travel information, local services, transportation, and more.',
            meta_keywords: 'Cambutal travel info, Panama travel guide, transportation, local services, real estate, legal services',
            og_title: 'Cambutal Information Guide - Essential Travel Info',
            og_description: 'Everything you need to know about visiting and living in Playa Cambutal, Panama.',
            og_image: 'https://images.unsplash.com/photo-1596627116790-af6f46dddbae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            canonical_url: `${window.location.origin}/info`,
            robots: 'index, follow',
            schema_markup: {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Cambutal Information Guide",
              "description": "Everything you need to know about Playa Cambutal, Panama.",
              "url": `${window.location.origin}/info`
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading SEO data for /info:', error);
        updatePageHead({
          id: 'info-error-fallback',
          page_path: '/info',
          page_title: 'Information Guide - Playa Cambutal Guide',
          canonical_url: `${window.location.origin}/info`,
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

export default InfoSEO;
