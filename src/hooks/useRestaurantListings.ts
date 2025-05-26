
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RestaurantListing {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  image_url?: string;
  hours: any;
  gallery_images: string[];
  menu_images: string[];
  approved: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useRestaurantListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userRestaurants, setUserRestaurants] = useState<RestaurantListing[]>([]);

  const fetchUserRestaurants = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('restaurant_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching user restaurants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your restaurants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitRestaurant = async (restaurantData: Omit<RestaurantListing, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'approved'>) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('restaurant_listings')
      .insert({
        ...restaurantData,
        user_id: user.id,
      });

    if (error) throw error;

    toast({
      title: "Restaurant submitted!",
      description: "Your restaurant has been submitted for review.",
    });

    fetchUserRestaurants();
  };

  useEffect(() => {
    fetchUserRestaurants();
  }, [user]);

  return {
    userRestaurants,
    loading,
    submitRestaurant,
    fetchUserRestaurants,
  };
};
