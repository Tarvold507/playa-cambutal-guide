
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { BusinessListing } from './useBusinessListings';

export const useUserBusinesses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userBusinesses, setUserBusinesses] = useState<BusinessListing[]>([]);

  const fetchUserBusinesses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching user businesses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your businesses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBusiness = async (businessId: string) => {
    try {
      const { error } = await supabase
        .from('business_listings')
        .delete()
        .eq('id', businessId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Business deleted",
        description: "Your business has been deleted successfully.",
      });

      fetchUserBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserBusinesses();
  }, [user]);

  return {
    userBusinesses,
    loading,
    fetchUserBusinesses,
    deleteBusiness,
  };
};
