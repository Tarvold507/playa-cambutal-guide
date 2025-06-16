
import { useEffect, useState } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator';
import { useSitemapResponse } from '@/hooks/useSitemapResponse';

const Sitemap = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Set proper response headers for XML
  useSitemapResponse();

  useEffect(() => {
    const generateAndSetSitemap = async () => {
      try {
        const xml = await generateSitemap();
        setSitemapXml(xml);
        
        // Update document title
        document.title = 'Sitemap | Playa Cambutal Guide';
      } catch (error) {
        console.error('Error generating sitemap:', error);
        // Provide a minimal valid sitemap on error
        const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://playacambutal.guide/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        setSitemapXml(fallbackSitemap);
      } finally {
        setIsLoading(false);
      }
    };

    generateAndSetSitemap();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        fontFamily: 'monospace', 
        padding: '20px',
        background: '#f5f5f5'
      }}>
        Generating sitemap...
      </div>
    );
  }

  // Render XML content with proper formatting
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <pre 
        style={{ 
          fontFamily: 'monospace', 
          whiteSpace: 'pre-wrap',
          margin: 0,
          padding: '10px',
          background: '#ffffff',
          fontSize: '12px',
          lineHeight: '1.4'
        }}
      >
        {sitemapXml}
      </pre>
    </div>
  );
};

export default Sitemap;
