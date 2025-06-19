import { PageSEO } from '@/hooks/usePageSEO';

export const updatePageHead = (seoData: PageSEO | null, fallbackTitle?: string) => {
  if (typeof document === 'undefined') return;

  console.log('🎯 [SEO DEBUG] updatePageHead called with:', seoData?.page_title || fallbackTitle);

  // Update title with stronger override
  const title = seoData?.page_title || fallbackTitle || 'Playa Cambutal Guide';
  document.title = title;
  console.log('📝 [SEO DEBUG] Document title set to:', document.title);

  // Update meta tags with improved override logic
  const updateMetaTag = (name: string, content: string | undefined, property?: string) => {
    if (!content) return;
    
    const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
    console.log(`🏷️ [SEO DEBUG] Set meta ${property || name}:`, content);
  };

  // Basic meta tags
  updateMetaTag('description', seoData?.meta_description);
  updateMetaTag('keywords', seoData?.meta_keywords);
  updateMetaTag('robots', seoData?.robots);

  // Open Graph tags
  updateMetaTag('og:title', seoData?.og_title || seoData?.page_title, 'og:title');
  updateMetaTag('og:description', seoData?.og_description || seoData?.meta_description, 'og:description');
  updateMetaTag('og:image', seoData?.og_image, 'og:image');
  updateMetaTag('og:type', 'website', 'og:type');
  updateMetaTag('og:url', seoData?.canonical_url || window.location.href, 'og:url');

  // Twitter tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seoData?.twitter_title || seoData?.page_title);
  updateMetaTag('twitter:description', seoData?.twitter_description || seoData?.meta_description);
  updateMetaTag('twitter:image', seoData?.twitter_image || seoData?.og_image);

  // Canonical URL with stronger override
  if (seoData?.canonical_url) {
    // Remove any existing canonical tags
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(canonical => canonical.remove());
    
    // Add new canonical tag
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', seoData.canonical_url);
    document.head.appendChild(canonical);
    console.log('🔗 [SEO DEBUG] Set canonical URL:', seoData.canonical_url);
  }

  // Schema markup with improved handling
  if (seoData?.schema_markup) {
    // Remove any existing schema
    const existingSchema = document.querySelector('script[type="application/ld+json"]#page-schema');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    const schemaScript = document.createElement('script');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.setAttribute('id', 'page-schema');
    schemaScript.textContent = JSON.stringify(seoData.schema_markup);
    document.head.appendChild(schemaScript);
    console.log('📊 [SEO DEBUG] Set schema markup');
  }

  // Final verification log
  console.log('✅ [SEO DEBUG] Page head update complete. Current title:', document.title);
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateBlogSchema = (post: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.seo_description,
    "author": {
      "@type": "Person",
      "name": post.profiles?.name || "Anonymous"
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "image": post.featured_image_url,
    "url": `${window.location.origin}/blog/${post.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${post.slug}`
    }
  };
};

// Generate breadcrumb schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// Clean up old schema when navigating
export const cleanupPreviousSchema = () => {
  const oldSchema = document.querySelector('script[type="application/ld+json"]#page-schema');
  if (oldSchema) {
    oldSchema.remove();
  }
};
