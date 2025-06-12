
import { useState, useEffect } from 'react';
import { usePageContent, PageContent } from '@/hooks/usePageContent';

export const useCMSContent = (pagePath: string, sectionName: string, fallbackContent?: any) => {
  const { pageContent, fetchPageContent, loading } = usePageContent();
  const [content, setContent] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchPageContent(pagePath);
  }, [pagePath, fetchPageContent]);

  useEffect(() => {
    if (loading) {
      setIsReady(false);
      return;
    }

    const cmsContent = pageContent.find(
      item => item.page_path === pagePath && 
              item.section_name === sectionName && 
              item.is_visible
    );

    if (cmsContent) {
      setContent(cmsContent.content_data);
    } else if (fallbackContent) {
      setContent(fallbackContent);
    }
    
    setIsReady(true);
  }, [pageContent, pagePath, sectionName, fallbackContent, loading]);

  return { content, isReady, loading };
};

// Hook to get all visible content for a page
export const usePageCMSContent = (pagePath: string) => {
  const { pageContent, fetchPageContent, loading } = usePageContent();
  const [visibleContent, setVisibleContent] = useState<PageContent[]>([]);

  useEffect(() => {
    fetchPageContent(pagePath);
  }, [pagePath, fetchPageContent]);

  useEffect(() => {
    const filtered = pageContent
      .filter(item => item.page_path === pagePath && item.is_visible)
      .sort((a, b) => a.display_order - b.display_order);
    
    setVisibleContent(filtered);
  }, [pageContent, pagePath]);

  return { content: visibleContent, loading };
};
