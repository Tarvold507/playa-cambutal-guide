
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageSEO } from './types';

export const usePageSEOData = () => {
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
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching SEO for path:', path, error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching SEO for path:', path, error);
      return null;
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
  };
};
