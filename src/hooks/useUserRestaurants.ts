
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { RestaurantListing } from './useRestaurantListings';

export const useUserRestaurants = () => {
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
      
      const transformedData: RestaurantListing[] = data?.map(item => ({
        ...item,
        hours: typeof item.hours === 'object' && item.hours !== null ? 
          item.hours as Record<string, string> : {},
        gallery_images: Array.isArray(item.gallery_images) ? 
          item.gallery_images as string[] : [],
        menu_images: Array.isArray(item.menu_images) ? 
          item.menu_images as string[] : [],
      })) || [];
      
      setUserRestaurants(transformedData);
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

  const updateRestaurant = async (restaurantId: string, updates: Partial<RestaurantListing>) => {
    try {
      const { error } = await supabase
        .from('restaurant_listings')
        .update(updates)
        .eq('id', restaurantId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Restaurant updated",
        description: "Your restaurant has been updated successfully.",
      });

      fetchUserRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to update restaurant",
        variant: "destructive",
      });
    }
  };

  const deleteRestaurant = async (restaurantId: string) => {
    try {
      const { error } = await supabase
        .from('restaurant_listings')
        .delete()
        .eq('id', restaurantId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Restaurant deleted",
        description: "Your restaurant has been deleted successfully.",
      });

      fetchUserRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to delete restaurant",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserRestaurants();
  }, [user]);

  return {
    userRestaurants,
    loading,
    fetchUserRestaurants,
    updateRestaurant,
    deleteRestaurant,
  };
};
