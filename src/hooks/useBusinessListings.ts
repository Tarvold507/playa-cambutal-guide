
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BusinessListing {
  id: string;
  name: string;
  category: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  approved: boolean;
  user_id: string;
  created_at: string;
}

export const useBusinessListings = () => {
  return useQuery({
    queryKey: ['business-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_listings')
        .select('*')
        .eq('approved', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as BusinessListing[];
    },
  });
};

export const useUserBusinessListings = () => {
  return useQuery({
    queryKey: ['user-business-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BusinessListing[];
    },
  });
};

export const useCreateBusinessListing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (listingData: Omit<BusinessListing, 'id' | 'approved' | 'user_id' | 'created_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_listings')
        .insert({
          ...listingData,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-business-listings'] });
      toast({
        title: "Business listing submitted!",
        description: "Your listing is pending approval and will be visible once approved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
