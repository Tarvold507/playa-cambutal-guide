
import { useEffect } from 'react';

export const useSitemapResponse = () => {
  useEffect(() => {
    // Set appropriate meta tags for XML content
    const metaCharset = document.querySelector('meta[charset]');
    if (metaCharset) {
      metaCharset.setAttribute('charset', 'UTF-8');
    }

    // Add XML content type meta tag
    const existingContentType = document.querySelector('meta[http-equiv="Content-Type"]');
    if (existingContentType) {
      existingContentType.remove();
    }

    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.setAttribute('http-equiv', 'Content-Type');
    contentTypeMeta.setAttribute('content', 'application/xml; charset=UTF-8');
    document.head.appendChild(contentTypeMeta);

    // Cleanup function
    return () => {
      const metaToRemove = document.querySelector('meta[http-equiv="Content-Type"]');
      if (metaToRemove) {
        metaToRemove.remove();
      }
    };
  }, []);
};
