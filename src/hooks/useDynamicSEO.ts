import { useEffect } from 'react';
import { updatePageHead } from '@/utils/seoUtils';
import { HotelListing } from '@/hooks/useHotelListings';
import { generateBlogSchema } from '@/utils/seoUtils';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAuth } from '@/contexts/AuthContext';

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
            // Continue with generated SEO data even if save fails
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

        // Always update the page head with SEO data
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

const generateHotelSchema = (hotel: HotelListing) => {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": hotel.name,
    "description": hotel.full_description || hotel.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hotel.address,
      "addressLocality": "Playa Cambutal",
      "addressRegion": "Los Santos",
      "addressCountry": "PA"
    },
    "geo": hotel.latitude && hotel.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": hotel.latitude,
      "longitude": hotel.longitude
    } : undefined,
    "image": hotel.gallery_images.length > 0 ? hotel.gallery_images : [hotel.image_url].filter(Boolean),
    "priceRange": hotel.price_from ? `$${hotel.price_from}-$${hotel.price_from * 3}` : undefined,
    "starRating": hotel.rating ? {
      "@type": "Rating",
      "ratingValue": hotel.rating
    } : undefined,
    "amenityFeature": hotel.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "url": `${window.location.origin}/stay/${hotel.slug}`,
    "telephone": hotel.policies.phone || undefined,
    "checkinTime": hotel.policies.check_in || "15:00",
    "checkoutTime": hotel.policies.check_out || "11:00"
  };
};

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
          // Fallback to a default restaurant image
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
          
          // Add location context
          if (restaurant.address) {
            description += ` Located at ${restaurant.address}.`;
          }
          
          // Add category/cuisine info
          if (restaurant.category) {
            description += ` Specializing in ${restaurant.category.toLowerCase()}.`;
          }
          
          // Add hours info if open
          if (restaurant.hours && Object.keys(restaurant.hours).length > 0) {
            const hasHours = Object.values(restaurant.hours).some(hour => hour && hour !== 'Closed');
            if (hasHours) {
              description += ' Check our opening hours and visit us today!';
            }
          }
          
          // Add contact info
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
            // Continue with generated SEO data even if save fails
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
        
        // Enhanced fallback: Apply better SEO even if everything else fails
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

const generateRestaurantSchema = (restaurant: any) => {
  // Get the best available image for schema
  const getSchemaImage = () => {
    if (restaurant.image_url) return restaurant.image_url;
    if (restaurant.imageSrc) return restaurant.imageSrc;
    if (restaurant.images && restaurant.images.length > 0) return restaurant.images[0];
    if (restaurant.gallery_images && restaurant.gallery_images.length > 0) return restaurant.gallery_images[0];
    return undefined;
  };

  // Convert hours object to OpeningHours format
  const getOpeningHours = () => {
    if (!restaurant.hours || Object.keys(restaurant.hours).length === 0) return undefined;
    
    const dayMapping: { [key: string]: string } = {
      'Monday': 'Mo',
      'Tuesday': 'Tu', 
      'Wednesday': 'We',
      'Thursday': 'Th',
      'Friday': 'Fr',
      'Saturday': 'Sa',
      'Sunday': 'Su'
    };
    
    const openingHours: string[] = [];
    
    Object.entries(restaurant.hours).forEach(([day, hours]) => {
      const dayCode = dayMapping[day];
      if (dayCode && hours && hours !== 'Closed') {
        openingHours.push(`${dayCode} ${hours}`);
      }
    });
    
    return openingHours.length > 0 ? openingHours : undefined;
  };

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurant.name,
    "description": restaurant.description || `A wonderful restaurant in Playa Cambutal, Panama offering delicious cuisine and great atmosphere.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": restaurant.address,
      "addressLocality": "Playa Cambutal", 
      "addressRegion": "Los Santos Province",
      "addressCountry": "PA"
    },
    "geo": restaurant.latitude && restaurant.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": restaurant.latitude,
      "longitude": restaurant.longitude
    } : undefined,
    "image": getSchemaImage(),
    "servesCuisine": restaurant.category || restaurant.cuisine_type || undefined,
    "priceRange": restaurant.price_range || undefined,
    "aggregateRating": restaurant.rating ? {
      "@type": "AggregateRating",
      "ratingValue": restaurant.rating,
      "reviewCount": restaurant.review_count || 1
    } : undefined,
    "url": `${window.location.origin}/eat/${restaurant.slug}`,
    "telephone": restaurant.phone || undefined,
    "openingHours": getOpeningHours(),
    "hasMenu": restaurant.menu_images && restaurant.menu_images.length > 0 ? `${window.location.origin}/eat/${restaurant.slug}#menu` : undefined,
    "acceptsReservations": restaurant.whatsapp || restaurant.phone ? "True" : undefined
  };
};

// Utility function to generate SEO for all existing hotels
export const generateSEOForAllHotels = async () => {
  // This would be called from admin interface to bulk generate SEO
  console.log('Bulk SEO generation would be implemented here');
};
