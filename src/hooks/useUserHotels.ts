
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserHotel {
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
  approved: boolean;
  user_id: string;
  created_at: string;
}

export const useUserHotels = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userHotels, setUserHotels] = useState<UserHotel[]>([]);

  const fetchUserHotels = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hotel_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedHotels: UserHotel[] = data?.map(hotel => ({
        ...hotel,
        gallery_images: Array.isArray(hotel.gallery_images) 
          ? hotel.gallery_images.filter((img): img is string => typeof img === 'string')
          : [],
        amenities: Array.isArray(hotel.amenities) 
          ? hotel.amenities.filter((amenity): amenity is string => typeof amenity === 'string')
          : [],
        policies: typeof hotel.policies === 'object' && hotel.policies !== null ? hotel.policies : {},
      })) || [];

      setUserHotels(transformedHotels);
    } catch (error) {
      console.error('Error fetching user hotels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your hotels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (hotelId: string) => {
    try {
      const { error } = await supabase
        .from('hotel_listings')
        .delete()
        .eq('id', hotelId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Hotel deleted",
        description: "Your hotel has been deleted successfully.",
      });

      fetchUserHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast({
        title: "Error",
        description: "Failed to delete hotel",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserHotels();
  }, [user]);

  return {
    userHotels,
    loading,
    fetchUserHotels,
    deleteHotel,
  };
};
