
import { useState } from 'react';
import { useHotelListings } from '@/hooks/useHotelListings';
import { useRestaurantListings } from '@/hooks/useRestaurantListings';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useToast } from '@/hooks/use-toast';

export const useAdminSEOBulkActions = () => {
  const { hotels } = useHotelListings();
  const { restaurants } = useRestaurantListings();
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
      for (const restaurant of restaurants) {
        const pagePath = `/eat/${restaurant.slug}`;
        const seoData = {
          page_title: `${restaurant.name} - Playa Cambutal Restaurants`,
          meta_description: `${restaurant.name} in Playa Cambutal: ${restaurant.description || 'Delicious local cuisine and international dishes.'} Visit us today.`,
          meta_keywords: `${restaurant.name}, Playa Cambutal restaurant, restaurant, Panama dining, beach restaurant`,
          og_title: `${restaurant.name} - Playa Cambutal`,
          og_description: restaurant.description || `Enjoy delicious meals at ${restaurant.name} in beautiful Playa Cambutal, Panama.`,
          og_image: restaurant.image_url || '',
          canonical_url: `${window.location.origin}/eat/${restaurant.slug}`,
          robots: 'index, follow',
        };

        await updatePageSEO(pagePath, seoData);
      }

      toast({
        title: 'Success',
        description: `Generated SEO data for ${restaurants.length} restaurants`,
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
