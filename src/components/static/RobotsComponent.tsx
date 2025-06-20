
import { useEffect } from 'react';

const RobotsComponent = () => {
  useEffect(() => {
    // Set text content type
    document.title = 'Robots.txt';
    const metaContentType = document.querySelector('meta[http-equiv="Content-Type"]');
    if (metaContentType) {
      metaContentType.setAttribute('content', 'text/plain; charset=UTF-8');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Type');
      meta.setAttribute('content', 'text/plain; charset=UTF-8');
      document.head.appendChild(meta);
    }
  }, []);

  const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://playacambutalguide.com/sitemap.xml

# Specific crawling instructions for better indexing
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Block access to admin and private areas only
Disallow: /admin/
Disallow: /profile/
Disallow: /auth/

# Allow all important pages for Panama tourism
Allow: /surf
Allow: /eat
Allow: /stay
Allow: /do
Allow: /adventure
Allow: /events
Allow: /transportation
Allow: /info
Allow: /blog
Allow: /calendar
Allow: /real-estate

# Allow important static assets
Allow: /images/
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.svg

# Only disallow sensitive API endpoints, not all API paths
Disallow: /api/admin/
Disallow: /api/auth/`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      backgroundColor: 'white',
      fontSize: '12px',
      lineHeight: '1.4'
    }}>
      {robotsContent}
    </pre>
  );
};

export default RobotsComponent;
