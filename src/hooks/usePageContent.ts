import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PageContent {
  id: string;
  page_path: string;
  section_name: string;
  content_type: 'hero' | 'text' | 'image' | 'card' | 'featured' | 'section' | 'services';
  content_data: any;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export const usePageContent = () => {
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPageContent = useCallback(async (pagePath?: string) => {
    console.log('usePageContent - fetchPageContent called with pagePath:', pagePath);
    try {
      let query = supabase
        .from('page_content')
        .select('*')
        .order('display_order', { ascending: true });

      if (pagePath) {
        query = query.eq('page_path', pagePath);
      }

      const { data, error } = await query;

      if (error) throw error;
      console.log('usePageContent - fetchPageContent success, data length:', data?.length || 0);
      setPageContent(data || []);
    } catch (error) {
      console.error('Error fetching page content:', error);
      // Use a stable reference to toast to avoid infinite loops
      setTimeout(() => {
        toast({
          title: 'Error',
          description: 'Failed to fetch page content',
          variant: 'destructive',
        });
      }, 0);
    } finally {
      setLoading(false);
    }
  }, []); // Remove toast from dependencies to prevent infinite loop

  const createPageContent = async (contentData: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .insert([contentData as any])
        .select()
        .single();

      if (error) throw error;

      setPageContent(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Content created successfully',
      });

      return data;
    } catch (error) {
      console.error('Error creating page content:', error);
      toast({
        title: 'Error',
        description: 'Failed to create content',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePageContent = async (id: string, updates: Partial<PageContent>) => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPageContent(prev => 
        prev.map(item => item.id === id ? { ...item, ...data } : item)
      );

      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating page content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deletePageContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPageContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'Content deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting page content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleContentVisibility = async (id: string, isVisible: boolean) => {
    return updatePageContent(id, { is_visible: isVisible });
  };

  const reorderContent = async (contentItems: { id: string; display_order: number }[]) => {
    try {
      const updates = contentItems.map(item => 
        supabase
          .from('page_content')
          .update({ display_order: item.display_order })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      
      setPageContent(prev => 
        prev.map(item => {
          const update = contentItems.find(u => u.id === item.id);
          return update ? { ...item, display_order: update.display_order } : item;
        }).sort((a, b) => a.display_order - b.display_order)
      );

      toast({
        title: 'Success',
        description: 'Content order updated successfully',
      });
    } catch (error) {
      console.error('Error reordering content:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder content',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPageContent();
  }, [fetchPageContent]);

  return {
    pageContent,
    loading,
    fetchPageContent,
    createPageContent,
    updatePageContent,
    deletePageContent,
    toggleContentVisibility,
    reorderContent,
  };
};
