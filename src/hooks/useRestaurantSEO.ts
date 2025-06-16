
import { useEffect } from 'react';
import { updatePageHead } from '@/utils/seoUtils';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAuth } from '@/contexts/AuthContext';
import { generateRestaurantSchema } from '@/utils/seoSchemaUtils';

export const useRestaurantSEO = (restaurant: any) => {
  const { updatePageSEO, fetchSEOByPath } = usePageSEO();
  const { user } = useAuth();

  useEffect(() => {
    if (!restaurant) return;

    const handleRestaurantSEO = async () => {
      const pagePath = `/eat/${restaurant.slug}`;
      
      try {
        // Check if SEO data already exists
        const existingSEO = await fetchSEOByPath(pagePath);
        
        // Get the best available image for OG tags
        const getRestaurantOGImage = () => {
          if (restaurant.image_url) return restaurant.image_url;
          if (restaurant.imageSrc) return restaurant.imageSrc;
          if (restaurant.images && restaurant.images.length > 0) return restaurant.images[0];
          if (restaurant.gallery_images && restaurant.gallery_images.length > 0) return restaurant.gallery_images[0];
          return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
        };

        // Create detailed and specific descriptions
        const createRestaurantDescription = () => {
          let description = '';
          
          if (restaurant.description) {
            description = restaurant.description;
          } else {
            description = `Experience authentic dining at ${restaurant.name} in Playa Cambutal, Panama.`;
          }
          
          if (restaurant.address) {
            description += ` Located at ${restaurant.address}.`;
          }
          
          if (restaurant.category) {
            description += ` Specializing in ${restaurant.category.toLowerCase()}.`;
          }
          
          if (restaurant.hours && Object.keys(restaurant.hours).length > 0) {
            const hasHours = Object.values(restaurant.hours).some(hour => hour && hour !== 'Closed');
            if (hasHours) {
              description += ' Check our opening hours and visit us today!';
            }
          }
          
          if (restaurant.phone || restaurant.whatsapp) {
            description += ' Call or message us for reservations.';
          }
          
          return description;
        };

        const ogImage = getRestaurantOGImage();
        const detailedDescription = createRestaurantDescription();
        
        // Generate comprehensive SEO data
        const seoData = {
          page_title: `${restaurant.name} - Restaurant in Playa Cambutal | Playa Cambutal Guide`,
          meta_description: detailedDescription,
          meta_keywords: `${restaurant.name}, Playa Cambutal restaurant, ${restaurant.category || 'restaurant'}, Panama dining, beach restaurant, ${restaurant.address ? restaurant.address + ', ' : ''}Los Santos Province, Central America dining`,
          og_title: `${restaurant.name} - Playa Cambutal Restaurant`,
          og_description: detailedDescription,
          og_image: ogImage,
          twitter_title: `${restaurant.name} - Playa Cambutal Restaurant`,
          twitter_description: detailedDescription,
          twitter_image: ogImage,
          canonical_url: `${window.location.origin}/eat/${restaurant.slug}`,
          schema_markup: generateRestaurantSchema(restaurant)
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
          id: restaurant.id,
          page_path: pagePath,
          ...seoData,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        updatePageHead(seoToApply);
        
      } catch (error) {
        console.error('Error handling restaurant SEO:', error);
        
        // Enhanced fallback
        const fallbackOGImage = restaurant.image_url || restaurant.imageSrc || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
        const fallbackDescription = restaurant.description || `Experience delicious dining at ${restaurant.name} in beautiful Playa Cambutal, Panama. A must-visit restaurant for locals and tourists alike.`;
        
        const fallbackSEO = {
          id: restaurant.id,
          page_path: pagePath,
          page_title: `${restaurant.name} - Playa Cambutal Restaurant Guide`,
          meta_description: fallbackDescription,
          og_title: `${restaurant.name} - Playa Cambutal`,
          og_description: fallbackDescription,
          og_image: fallbackOGImage,
          canonical_url: `${window.location.origin}/eat/${restaurant.slug}`,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        updatePageHead(fallbackSEO);
      }
    };

    handleRestaurantSEO();
  }, [restaurant, updatePageSEO, fetchSEOByPath, user]);
};
