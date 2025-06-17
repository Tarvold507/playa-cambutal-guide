
import React from 'react';
import { Routes, Route } from 'react-router-dom';

const SitemapRoute = () => {
  React.useEffect(() => {
    // Set proper content type for XML
    document.contentType = 'application/xml';
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
</urlset>`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      backgroundColor: 'white'
    }}>
      {sitemapContent}
    </pre>
  );
};

const RobotsRoute = () => {
  React.useEffect(() => {
    // Set proper content type for text
    document.contentType = 'text/plain';
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
Allow: /favicon.ico
Allow: /*.css
Allow: /*.js

# Only disallow sensitive API endpoints, not all API paths
Disallow: /api/admin/
Disallow: /api/auth/`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      backgroundColor: 'white'
    }}>
      {robotsContent}
    </pre>
  );
};

export const StaticFileRoutes = () => {
  return (
    <Routes>
      <Route path="/sitemap.xml" element={<SitemapRoute />} />
      <Route path="/robots.txt" element={<RobotsRoute />} />
    </Routes>
  );
};
