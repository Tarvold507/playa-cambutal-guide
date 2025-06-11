
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdventureBusiness {
  id: string;
  business_name: string;
  category: string;
  business_type: string;
  description: string;
  location: string;
  hours: string;
  whatsapp: string;
  image_url: string | null;
  created_at: string;
  approved: boolean;
}

export const useAdventureBusinessListings = () => {
  const [businesses, setBusinesses] = useState<AdventureBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('adventure_business_listings')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (err) {
      console.error('Error fetching adventure businesses:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return {
    businesses,
    isLoading,
    error,
    refetch: fetchBusinesses,
  };
};
