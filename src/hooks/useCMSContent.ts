
import { useState, useEffect, useMemo } from 'react';
import { usePageContent, PageContent } from '@/hooks/usePageContent';

export const useCMSContent = (pagePath: string, sectionName: string, fallbackContent?: any) => {
  const { pageContent, fetchPageContent, loading } = usePageContent();
  const [content, setContent] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Only fetch once when pagePath changes - remove fetchPageContent from dependencies
  useEffect(() => {
    fetchPageContent(pagePath);
  }, [pagePath]);

  // Use useMemo to compute content and isReady based on pageContent
  const { computedContent, computedIsReady } = useMemo(() => {
    if (loading) {
      return { computedContent: null, computedIsReady: false };
    }

    const cmsContent = pageContent.find(
      item => item.page_path === pagePath && 
              item.section_name === sectionName && 
              item.is_visible
    );

    const finalContent = cmsContent ? cmsContent.content_data : fallbackContent;
    
    return { computedContent: finalContent, computedIsReady: true };
  }, [pageContent, pagePath, sectionName, fallbackContent, loading]);

  // Update state only when computed values change
  useEffect(() => {
    setContent(computedContent);
    setIsReady(computedIsReady);
  }, [computedContent, computedIsReady]);

  return { content, isReady, loading };
};

// Hook to get all visible content for a page
export const usePageCMSContent = (pagePath: string) => {
  const { pageContent, fetchPageContent, loading } = usePageContent();
  const [visibleContent, setVisibleContent] = useState<PageContent[]>([]);

  useEffect(() => {
    fetchPageContent(pagePath);
  }, [pagePath]); // Remove fetchPageContent from dependencies

  useEffect(() => {
    const filtered = pageContent
      .filter(item => item.page_path === pagePath && item.is_visible)
      .sort((a, b) => a.display_order - b.display_order);
    
    setVisibleContent(filtered);
  }, [pageContent, pagePath]);

  return { content: visibleContent, loading };
};
