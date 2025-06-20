
import { useEffect } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator';

const StaticSitemapRoute = () => {
  useEffect(() => {
    const generateAndServeSitemap = async () => {
      try {
        const sitemapContent = await generateSitemap();
        
        // Set the content type to XML
        document.contentType = 'application/xml';
        
        // Replace the entire page content with the sitemap
        document.open();
        document.write(sitemapContent);
        document.close();
      } catch (error) {
        console.error('Error generating sitemap:', error);
        document.open();
        document.write('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>');
        document.close();
      }
    };
    
    generateAndServeSitemap();
  }, []);

  return (
    <div className="p-8 text-center">
      <h1>Generating Sitemap...</h1>
      <p>Please wait while we generate the XML sitemap.</p>
    </div>
  );
};

export default StaticSitemapRoute;
