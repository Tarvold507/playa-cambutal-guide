
import { HotelListing } from '@/hooks/useHotelListings';

export const generateHotelSchema = (hotel: HotelListing) => {
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

export const generateRestaurantSchema = (restaurant: any) => {
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
