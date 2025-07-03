
import { useState } from 'react';
import { useHotelListings } from '@/hooks/useHotelListings';
import { useRestaurantListings } from '@/hooks/useRestaurantListings';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useToast } from '@/hooks/use-toast';
import { generateSlug } from '@/utils/slugUtils';

export const useAdminSEOBulkActions = () => {
  const { hotels } = useHotelListings();
  const { userRestaurants } = useRestaurantListings();
  const { updatePageSEO } = usePageSEO();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSEOForAllHotels = async () => {
    setIsGenerating(true);
    try {
      for (const hotel of hotels) {
        const pagePath = `/stay/${hotel.slug}`;
        const seoData = {
          page_title: `${hotel.name} - Playa Cambutal Guide`,
          meta_description: `${hotel.name} in Playa Cambutal: ${hotel.description || 'Comfortable accommodation with modern amenities.'}${hotel.price_from ? ` Starting from $${hotel.price_from}/night.` : ''} Book your stay today.`,
          meta_keywords: `${hotel.name}, Playa Cambutal hotel, ${hotel.category}, Panama accommodation, beach hotel, ${hotel.amenities.join(', ')}`,
          og_title: `${hotel.name} - Playa Cambutal`,
          og_description: hotel.description || `Experience comfort and convenience at ${hotel.name} in beautiful Playa Cambutal, Panama.`,
          og_image: hotel.image_url || hotel.gallery_images[0] || '',
          canonical_url: `${window.location.origin}/stay/${hotel.slug}`,
          robots: 'index, follow',
        };

        await updatePageSEO(pagePath, seoData);
      }

      toast({
        title: 'Success',
        description: `Generated SEO data for ${hotels.length} hotels`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate SEO data for some hotels',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSEOForAllRestaurants = async () => {
    setIsGenerating(true);
    try {
      for (const restaurant of userRestaurants) {
        // Use database slug if available, fallback to generated slug
        const restaurantSlug = restaurant.slug || generateSlug(restaurant.name);
        const pagePath = `/eat/${restaurantSlug}`;
        
        // Get the best available image for OG tags
        const getRestaurantOGImage = () => {
          if (restaurant.image_url) return restaurant.image_url;
          if (restaurant.gallery_images && restaurant.gallery_images.length > 0) return restaurant.gallery_images[0];
          // Fallback to a default restaurant image
          return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
        };

        // Create detailed description
        const createDescription = () => {
          let description = restaurant.description || `Experience authentic dining at ${restaurant.name} in Playa Cambutal, Panama.`;
          
          if (restaurant.address) {
            description += ` Located at ${restaurant.address}.`;
          }
          
          if (restaurant.category) {
            description += ` Specializing in ${restaurant.category.toLowerCase()}.`;
          }
          
          if (restaurant.phone || restaurant.whatsapp) {
            description += ' Call or message us for reservations.';
          }
          
          return description;
        };

        const seoData = {
          page_title: `${restaurant.name} - Restaurant in Playa Cambutal | Playa Cambutal Guide`,
          meta_description: createDescription(),
          meta_keywords: `${restaurant.name}, Playa Cambutal restaurant, ${restaurant.category || 'restaurant'}, Panama dining, beach restaurant, ${restaurant.address ? restaurant.address + ', ' : ''}Los Santos Province`,
          og_title: `${restaurant.name} - Playa Cambutal Restaurant`,
          og_description: createDescription(),
          og_image: getRestaurantOGImage(),
          twitter_title: `${restaurant.name} - Playa Cambutal Restaurant`,
          twitter_description: createDescription(),
          twitter_image: getRestaurantOGImage(),
          canonical_url: `${window.location.origin}/eat/${restaurantSlug}`,
          robots: 'index, follow',
        };

        await updatePageSEO(pagePath, seoData);
      }

      toast({
        title: 'Success',
        description: `Generated SEO data for ${userRestaurants.length} restaurants`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate SEO data for some restaurants',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSEOForAllHotels,
    generateSEOForAllRestaurants,
    isGenerating,
  };
};
