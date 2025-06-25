
export const generateSEOHead = (seoData, fallbackTitle) => {
  const title = seoData?.page_title || fallbackTitle || 'Playa Cambutal Guide';
  const description = seoData?.meta_description || 'Discover Playa Cambutal, Panama\'s hidden paradise. Your complete guide to surfing, hotels, restaurants, and activities.';
  const keywords = seoData?.meta_keywords || 'playa cambutal, cambutal panama, panama beaches, cambutal surf, panama travel guide';
  const ogTitle = seoData?.og_title || title;
  const ogDescription = seoData?.og_description || description;
  const ogImage = seoData?.og_image || 'https://playacambutalguide.com/lovable-uploads/a8f15e8f-f24e-4740-b51b-a9263fbb0a51.png';
  const canonicalUrl = seoData?.canonical_url || `https://playacambutalguide.com`;
  const robots = seoData?.robots || 'index, follow';

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="robots" content="${robots}" />
    
    <!-- Open Graph tags -->
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Playa Cambutal Guide" />
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoData?.twitter_title || ogTitle}" />
    <meta name="twitter:description" content="${seoData?.twitter_description || ogDescription}" />
    <meta name="twitter:image" content="${seoData?.twitter_image || ogImage}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}" />
    
    ${seoData?.schema_markup ? `
    <!-- Schema Markup -->
    <script type="application/ld+json">
    ${JSON.stringify(seoData.schema_markup, null, 2)}
    </script>
    ` : ''}
  `;
};

export const injectSEOIntoHTML = (html, seoHead) => {
  // Find the closing </head> tag and inject SEO data before it
  const headCloseIndex = html.indexOf('</head>');
  if (headCloseIndex === -1) {
    console.warn('No </head> tag found in HTML template');
    return html;
  }
  
  return html.slice(0, headCloseIndex) + seoHead + html.slice(headCloseIndex);
};
