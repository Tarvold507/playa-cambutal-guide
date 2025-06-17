
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
        console.log('🔍 Loading SEO for restaurant:', restaurant.name, 'Path:', pagePath);
        
        // First, try to get existing SEO data from database
        const existingSEO = await fetchSEOByPath(pagePath);
        
        if (existingSEO) {
          console.log('✅ Found database SEO data for:', pagePath);
          console.log('📄 Database SEO:', {
            title: existingSEO.page_title,
            description: existingSEO.meta_description,
            canonical: existingSEO.canonical_url
          });
          
          // Update canonical URL if it uses old domain
          if (existingSEO.canonical_url && !existingSEO.canonical_url.includes('playacambutalguide.com')) {
            console.log('🔄 Updating canonical URL from old domain');
            const updatedSEO = {
              ...existingSEO,
              canonical_url: `https://playacambutalguide.com${pagePath}`
            };
            
            try {
              await updatePageSEO(pagePath, updatedSEO);
              updatePageHead(updatedSEO);
              return;
            } catch (updateError) {
              console.warn('Could not update canonical URL:', updateError);
              // Use existing data even if update failed
              updatePageHead(existingSEO);
              return;
            }
          } else {
            // Use existing SEO data directly
            updatePageHead(existingSEO);
            return;
          }
        }

        console.log('⚠️ No database SEO found, generating fallback for:', pagePath);

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
        
        // Generate comprehensive SEO data with correct domain
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
          canonical_url: `https://playacambutalguide.com${pagePath}`,
          schema_markup: generateRestaurantSchema(restaurant)
        };

        console.log('🔧 Generated fallback SEO data:', {
          title: seoData.page_title,
          description: seoData.meta_description,
          canonical: seoData.canonical_url
        });

        // Try to save SEO data in database if user is authenticated
        if (user) {
          try {
            const savedSEO = await updatePageSEO(pagePath, {
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
            
            if (savedSEO) {
              console.log('💾 Saved new SEO data to database for:', pagePath);
              updatePageHead(savedSEO);
              return;
            }
          } catch (saveError) {
            console.warn('Could not save SEO data to database:', saveError);
          }
        }

        // Use generated data as fallback
        const fallbackSEO = {
          id: restaurant.id,
          page_path: pagePath,
          ...seoData,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('📋 Using fallback SEO data');
        updatePageHead(fallbackSEO);
        
      } catch (error) {
        console.error('❌ Error handling restaurant SEO:', error);
        
        // Enhanced fallback with correct domain
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
          canonical_url: `https://playacambutalguide.com${pagePath}`,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('🆘 Using emergency fallback SEO');
        updatePageHead(fallbackSEO);
      }
    };

    handleRestaurantSEO();
  }, [restaurant, updatePageSEO, fetchSEOByPath, user]);
};
