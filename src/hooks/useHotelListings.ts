
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HotelListing {
  id: string;
  name: string;
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
}

export const useHotelListings = () => {
  const [hotels, setHotels] = useState<HotelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotel_listings')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedHotels: HotelListing[] = data?.map(hotel => ({
        ...hotel,
        gallery_images: Array.isArray(hotel.gallery_images) 
          ? hotel.gallery_images.filter((img): img is string => typeof img === 'string')
          : [],
        amenities: Array.isArray(hotel.amenities) 
          ? hotel.amenities.filter((amenity): amenity is string => typeof amenity === 'string')
          : [],
        policies: typeof hotel.policies === 'object' && hotel.policies !== null ? hotel.policies : {},
      })) || [];

      setHotels(transformedHotels);
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

export const useHotelDetails = (id: string) => {
  const [hotel, setHotel] = useState<HotelListing | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data, error } = await supabase
          .from('hotel_listings')
          .select('*')
          .eq('id', id)
          .eq('approved', true)
          .single();

        if (error) throw error;

        if (data) {
          setHotel({
            ...data,
            gallery_images: Array.isArray(data.gallery_images) 
              ? data.gallery_images.filter((img): img is string => typeof img === 'string')
              : [],
            amenities: Array.isArray(data.amenities) 
              ? data.amenities.filter((amenity): amenity is string => typeof amenity === 'string')
              : [],
            policies: typeof data.policies === 'object' && data.policies !== null ? data.policies : {},
          });
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

    if (id) {
      fetchHotel();
    }
  }, [id, toast]);

  return { hotel, loading };
};
