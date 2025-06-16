
import { useEffect } from 'react';
import { updatePageHead } from '@/utils/seoUtils';
import { HotelListing } from '@/hooks/useHotelListings';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAuth } from '@/contexts/AuthContext';
import { generateHotelSchema } from '@/utils/seoSchemaUtils';

interface HotelSEOData {
  page_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  schema_markup: any;
}

export const useHotelSEO = (hotel: HotelListing | null) => {
  const { updatePageSEO, fetchSEOByPath } = usePageSEO();
  const { user } = useAuth();

  useEffect(() => {
    if (!hotel) return;

    const handleHotelSEO = async () => {
      const pagePath = `/stay/${hotel.slug}`;
      
      try {
        // Check if SEO data already exists
        const existingSEO = await fetchSEOByPath(pagePath);
        
        // Generate fresh SEO data
        const seoData: HotelSEOData = {
          page_title: `${hotel.name} - Playa Cambutal Guide`,
          meta_description: `${hotel.name} in Playa Cambutal: ${hotel.description || 'Comfortable accommodation with modern amenities.'}${hotel.price_from ? ` Starting from $${hotel.price_from}/night.` : ''} Book your stay today.`,
          meta_keywords: `${hotel.name}, Playa Cambutal hotel, ${hotel.category}, Panama accommodation, beach hotel, ${hotel.amenities.join(', ')}`,
          og_title: `${hotel.name} - Playa Cambutal`,
          og_description: hotel.description || `Experience comfort and convenience at ${hotel.name} in beautiful Playa Cambutal, Panama.`,
          og_image: hotel.image_url || hotel.gallery_images[0] || '',
          twitter_title: `${hotel.name} - Playa Cambutal`,
          twitter_description: hotel.description || `Experience comfort and convenience at ${hotel.name} in beautiful Playa Cambutal, Panama.`,
          twitter_image: hotel.image_url || hotel.gallery_images[0] || '',
          canonical_url: `${window.location.origin}/stay/${hotel.slug}`,
          schema_markup: generateHotelSchema(hotel)
        };

        // Try to save/update SEO data in database if user is authenticated
        let finalSEOData = existingSEO;
        
        if (user && (!existingSEO || !existingSEO.meta_keywords?.includes('custom'))) {
          try {
            const updatedSEO = await updatePageSEO(pagePath, {
              page_title: seoData.page_title,
              meta_description: seoData.meta_description,
              meta_keywords: seoData.meta_keywords,
              og_title: seoData.og_title,
              og_description: seoData.og_description,
              og_image: seoData.og_image,
              twitter_title: seoData.twitter_title,
              twitter_description: seoData.twitter_description,
              twitter_image: seoData.twitter_image,
              canonical_url: seoData.canonical_url,
              robots: 'index, follow',
              schema_markup: seoData.schema_markup,
            });
            
            if (updatedSEO) {
              finalSEOData = updatedSEO;
              console.log('SEO data saved to database for:', pagePath);
            }
          } catch (saveError) {
            console.warn('Could not save SEO data to database:', saveError);
          }
        }

        // Use existing SEO data from database if available, otherwise use generated data
        const seoToApply = finalSEOData || {
          id: hotel.id,
          page_path: pagePath,
          ...seoData,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        updatePageHead(seoToApply);
        
      } catch (error) {
        console.error('Error handling hotel SEO:', error);
        
        // Fallback: Apply basic SEO even if everything else fails
        const fallbackSEO = {
          id: hotel.id,
          page_path: pagePath,
          page_title: `${hotel.name} - Playa Cambutal Guide`,
          meta_description: `${hotel.name} in Playa Cambutal, Panama. ${hotel.description || 'Book your stay today.'}`,
          og_title: `${hotel.name} - Playa Cambutal`,
          og_description: hotel.description || `Experience ${hotel.name} in Playa Cambutal.`,
          canonical_url: `${window.location.origin}/stay/${hotel.slug}`,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        updatePageHead(fallbackSEO);
      }
    };

    handleHotelSEO();
  }, [hotel, updatePageSEO, fetchSEOByPath, user]);
};
