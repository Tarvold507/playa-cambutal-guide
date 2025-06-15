
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Translation {
  id: string;
  translation_key: string;
  language: string;
  value: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export const useTranslations = (category?: string) => {
  return useQuery({
    queryKey: ['translations', category],
    queryFn: async () => {
      let query = supabase.from('translations').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('translation_key');
      
      if (error) throw error;
      return data as Translation[];
    },
  });
};

export const useCreateTranslation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (translationData: Omit<Translation, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('translations')
        .insert({
          ...translationData,
          created_by: user.user?.id,
          updated_by: user.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: "Translation created",
        description: "Translation has been created successfully.",
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

export const useUpdateTranslation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Translation> }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('translations')
        .update({
          ...updates,
          updated_by: user.user?.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: "Translation updated",
        description: "Translation has been updated successfully.",
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

export const useDeleteTranslation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: "Translation deleted",
        description: "Translation has been deleted successfully.",
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
