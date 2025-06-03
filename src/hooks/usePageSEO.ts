
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PageSEO {
  id: string;
  page_path: string;
  page_title: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots?: string;
  schema_markup?: any;
  created_at: string;
  updated_at: string;
}

export const usePageSEO = () => {
  const [pageSEO, setPageSEO] = useState<PageSEO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPageSEO = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_path');

      if (error) throw error;
      setPageSEO(data || []);
    } catch (error) {
      console.error('Error fetching page SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSEOByPath = async (path: string): Promise<PageSEO | null> => {
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_path', path)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching SEO for path:', path, error);
      return null;
    }
  };

  const updatePageSEO = async (path: string, seoData: Partial<PageSEO>) => {
    try {
      // Ensure required fields are present
      const updateData = {
        page_path: path,
        page_title: seoData.page_title || `Page - ${path}`,
        ...seoData,
      };

      const { data, error } = await supabase
        .from('page_seo')
        .upsert(updateData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating page SEO:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPageSEO();
  }, []);

  return {
    pageSEO,
    loading,
    fetchPageSEO,
    fetchSEOByPath,
    updatePageSEO,
  };
};
