
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageContent } from '@/hooks/usePageContent';

export const useOptimizedPageContent = (pagePath: string) => {
  const { data: pageContent = [], isLoading, error } = useQuery({
    queryKey: ['page-content', pagePath],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_path', pagePath)
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create a memoized content getter function
  const getContentBySection = (sectionName: string, fallbackContent?: any) => {
    const content = pageContent.find(
      item => item.section_name === sectionName
    );
    return content?.content_data || fallbackContent;
  };

  return {
    pageContent,
    getContentBySection,
    isLoading,
    error,
    isReady: !isLoading
  };
};

// Hook for prefetching common page content
export const usePrefetchPageContent = () => {
  const prefetchPage = (pagePath: string) => {
    return supabase
      .from('page_content')
      .select('*')
      .eq('page_path', pagePath)
      .eq('is_visible', true)
      .order('display_order', { ascending: true });
  };

  return { prefetchPage };
};
