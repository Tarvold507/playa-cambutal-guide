
import { useEffect } from 'react';
import { updatePageHead } from '@/utils/seoUtils';
import { HotelListing } from '@/hooks/useHotelListings';
import { generateBlogSchema } from '@/utils/seoUtils';

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
  useEffect(() => {
    if (!hotel) return;

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

    updatePageHead({
      id: hotel.id,
      page_path: `/stay/${hotel.slug}`,
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }, [hotel]);
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
  useEffect(() => {
    if (!restaurant) return;

    const seoData = {
      page_title: `${restaurant.name} - Playa Cambutal Restaurants`,
      meta_description: `${restaurant.name} in Playa Cambutal: ${restaurant.description || 'Delicious local cuisine and international dishes.'}${restaurant.cuisine_type ? ` Specializing in ${restaurant.cuisine_type}.` : ''} Visit us today.`,
      meta_keywords: `${restaurant.name}, Playa Cambutal restaurant, ${restaurant.cuisine_type || 'restaurant'}, Panama dining, beach restaurant`,
      og_title: `${restaurant.name} - Playa Cambutal`,
      og_description: restaurant.description || `Enjoy delicious meals at ${restaurant.name} in beautiful Playa Cambutal, Panama.`,
      og_image: restaurant.image_url || '',
      canonical_url: `${window.location.origin}/eat/${restaurant.slug}`,
      schema_markup: generateRestaurantSchema(restaurant)
    };

    updatePageHead({
      id: restaurant.id,
      page_path: `/eat/${restaurant.slug}`,
      page_title: seoData.page_title,
      meta_description: seoData.meta_description,
      meta_keywords: seoData.meta_keywords,
      og_title: seoData.og_title,
      og_description: seoData.og_description,
      og_image: seoData.og_image,
      twitter_title: seoData.og_title,
      twitter_description: seoData.og_description,
      twitter_image: seoData.og_image,
      canonical_url: seoData.canonical_url,
      robots: 'index, follow',
      schema_markup: seoData.schema_markup,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }, [restaurant]);
};

const generateRestaurantSchema = (restaurant: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurant.name,
    "description": restaurant.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": restaurant.address,
      "addressLocality": "Playa Cambutal",
      "addressRegion": "Los Santos",
      "addressCountry": "PA"
    },
    "geo": restaurant.latitude && restaurant.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": restaurant.latitude,
      "longitude": restaurant.longitude
    } : undefined,
    "image": restaurant.image_url || undefined,
    "servesCuisine": restaurant.cuisine_type || undefined,
    "priceRange": restaurant.price_range || undefined,
    "aggregateRating": restaurant.rating ? {
      "@type": "AggregateRating",
      "ratingValue": restaurant.rating,
      "reviewCount": restaurant.review_count || 1
    } : undefined,
    "url": `${window.location.origin}/eat/${restaurant.slug}`,
    "telephone": restaurant.phone || undefined,
    "openingHours": restaurant.hours || undefined
  };
};
