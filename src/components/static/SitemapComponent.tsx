
import { useEffect } from 'react';

const SitemapComponent = () => {
  useEffect(() => {
    // Set XML content type
    document.title = 'Sitemap';
    const metaContentType = document.querySelector('meta[http-equiv="Content-Type"]');
    if (metaContentType) {
      metaContentType.setAttribute('content', 'application/xml; charset=UTF-8');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Type');
      meta.setAttribute('content', 'application/xml; charset=UTF-8');
      document.head.appendChild(meta);
    }
  }, []);

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://playacambutalguide.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/surf</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/stay</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/do</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/calendar</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/transportation</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/real-estate</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/info</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/centro-recreativo-jake</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/fonda-norelis</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/hotel-kambutaleko</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/hotel-restaurante-cambutal-beach</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/kambute</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/la-tierra-de-mis-suenos</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/monaco-bar-and-grill</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/pizzeria-madera</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/eat/restaurante-casa-playa-verde</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/stay/hotel-kambutaleko</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/stay/hotel-playa-cambutal</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/stay/sansara-surf-and-yoga-resort</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/stay/stunning-beachfront-home-near-cambutal-beach-break</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/stay/tropical-beachfront-home-in-cambutal</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/do/la-colectiva</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/legal</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
  <url>
    <loc>https://playacambutalguide.com/disclosure</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <lastmod>2025-01-17</lastmod>
  </url>
</urlset>`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      backgroundColor: 'white',
      fontSize: '12px',
      lineHeight: '1.4'
    }}>
      {sitemapContent}
    </pre>
  );
};

export default SitemapComponent;
