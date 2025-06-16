import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateSlug } from '@/utils/slugUtils';

export interface HotelListing {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  full_description: string | null;
  category: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  expedia_hotel_id: string | null;
  affiliate_url: string;
  commission_rate: number | null;
  image_url: string | null;
  gallery_images: string[];
  amenities: string[];
  policies: Record<string, any>;
  rating: number | null;
  review_count: number;
  price_from: number | null;
  currency: string | null;
  created_at: string;
  is_premium: boolean;
  display_order: number;
}

// Helper function to randomize array order
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useHotelListings = () => {
  const [hotels, setHotels] = useState<HotelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotel_listings')
        .select('*')
        .eq('approved', true);

      if (error) throw error;

      const transformedHotels: HotelListing[] = data?.map(hotel => ({
        ...hotel,
        slug: generateSlug(hotel.name),
        gallery_images: Array.isArray(hotel.gallery_images) 
          ? hotel.gallery_images.filter((img): img is string => typeof img === 'string')
          : [],
        amenities: Array.isArray(hotel.amenities) 
          ? hotel.amenities.filter((amenity): amenity is string => typeof amenity === 'string')
          : [],
        policies: typeof hotel.policies === 'object' && hotel.policies !== null ? hotel.policies : {},
        is_premium: hotel.is_premium || false,
        display_order: hotel.display_order || 0,
      })) || [];

      // Sort hotels: premium first (by display_order, then randomized), then regular (randomized)
      const premiumHotels = transformedHotels.filter(hotel => hotel.is_premium);
      const regularHotels = transformedHotels.filter(hotel => !hotel.is_premium);

      // Sort premium hotels by display_order, then randomize within same order
      const sortedPremiumHotels = premiumHotels
        .sort((a, b) => a.display_order - b.display_order)
        .reduce((acc, hotel) => {
          const sameOrderHotels = premiumHotels.filter(h => h.display_order === hotel.display_order);
          if (!acc.some(h => h.id === hotel.id)) {
            acc.push(...shuffleArray(sameOrderHotels));
          }
          return acc;
        }, [] as HotelListing[]);

      // Randomize regular hotels
      const shuffledRegularHotels = shuffleArray(regularHotels);

      // Combine: premium first, then regular
      const finalHotels = [...sortedPremiumHotels, ...shuffledRegularHotels];

      setHotels(finalHotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: "Error",
        description: "Failed to load hotel listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return { hotels, loading, refetch: fetchHotels };
};

export const useHotelDetails = (slug: string) => {
  const [hotel, setHotel] = useState<HotelListing | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        // First fetch all hotels to find the one with matching slug
        const { data, error } = await supabase
          .from('hotel_listings')
          .select('*')
          .eq('approved', true);

        if (error) throw error;

        if (data) {
          // Find hotel by slug
          const matchingHotel = data.find(hotel => generateSlug(hotel.name) === slug);
          
          if (matchingHotel) {
            setHotel({
              ...matchingHotel,
              slug: generateSlug(matchingHotel.name),
              gallery_images: Array.isArray(matchingHotel.gallery_images) 
                ? matchingHotel.gallery_images.filter((img): img is string => typeof img === 'string')
                : [],
              amenities: Array.isArray(matchingHotel.amenities) 
                ? matchingHotel.amenities.filter((amenity): amenity is string => typeof amenity === 'string')
                : [],
              policies: typeof matchingHotel.policies === 'object' && matchingHotel.policies !== null ? matchingHotel.policies : {},
              is_premium: matchingHotel.is_premium || false,
              display_order: matchingHotel.display_order || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        toast({
          title: "Error",
          description: "Failed to load hotel details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchHotel();
    }
  }, [slug, toast]);

  return { hotel, loading };
};
