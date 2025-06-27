
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
    } : {
      "@type": "GeoCoordinates",
      "latitude": 7.2833,
      "longitude": -80.5167
    },
    "image": hotel.gallery_images.length > 0 ? hotel.gallery_images : [hotel.image_url].filter(Boolean),
    "priceRange": hotel.price_from ? `$${hotel.price_from}-$${hotel.price_from * 3}` : "$$",
    "starRating": hotel.rating ? {
      "@type": "Rating",
      "ratingValue": hotel.rating,
      "bestRating": 5
    } : undefined,
    "amenityFeature": hotel.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "url": `https://playacambutalguide.com/stay/${hotel.slug}`,
    "telephone": hotel.policies.phone || undefined,
    "checkinTime": hotel.policies.check_in || "15:00",
    "checkoutTime": hotel.policies.check_out || "11:00",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card",
    "aggregateRating": hotel.rating ? {
      "@type": "AggregateRating",
      "ratingValue": hotel.rating,
      "reviewCount": hotel.review_count || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined
  };
};

export const generateRestaurantSchema = (restaurant: any) => {
  // Get the best available image for schema
  const getSchemaImage = () => {
    if (restaurant.image_url) return restaurant.image_url;
    if (restaurant.imageSrc) return restaurant.imageSrc;
    if (restaurant.images && restaurant.images.length > 0) return restaurant.images[0];
    if (restaurant.gallery_images && restaurant.gallery_images.length > 0) return restaurant.gallery_images[0];
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
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
    } : {
      "@type": "GeoCoordinates",
      "latitude": 7.2833,
      "longitude": -80.5167
    },
    "image": getSchemaImage(),
    "servesCuisine": restaurant.category || restaurant.cuisine_type || "International",
    "priceRange": restaurant.price_range || "$$",
    "aggregateRating": restaurant.rating ? {
      "@type": "AggregateRating",
      "ratingValue": restaurant.rating,
      "reviewCount": restaurant.review_count || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "url": `https://playacambutalguide.com/eat/${restaurant.slug}`,
    "telephone": restaurant.phone || undefined,
    "openingHours": getOpeningHours(),
    "hasMenu": restaurant.menu_images && restaurant.menu_images.length > 0 ? `https://playacambutalguide.com/eat/${restaurant.slug}#menu` : undefined,
    "acceptsReservations": restaurant.whatsapp || restaurant.phone ? "True" : "False",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card"
  };
};

export const generateAdventureBusinessSchema = (business: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": business.business_name,
    "description": business.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": "Playa Cambutal",
      "addressRegion": "Los Santos Province", 
      "addressCountry": "PA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 7.2833,
      "longitude": -80.5167
    },
    "image": business.image_url || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    "url": `https://playacambutalguide.com/do/${business.slug}`,
    "telephone": business.whatsapp || undefined,
    "openingHours": business.hours || undefined,
    "touristType": "International",
    "category": business.category
  };
};
