
import { PageSEO } from '@/hooks/usePageSEO';

export const updatePageHead = (seoData: PageSEO | null, fallbackTitle?: string) => {
  if (typeof document === 'undefined') return;

  // Update title
  const title = seoData?.page_title || fallbackTitle || 'Playa Cambutal Guide';
  document.title = title;

  // Update meta tags
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

  // Twitter tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seoData?.twitter_title || seoData?.page_title);
  updateMetaTag('twitter:description', seoData?.twitter_description || seoData?.meta_description);
  updateMetaTag('twitter:image', seoData?.twitter_image || seoData?.og_image);

  // Canonical URL
  if (seoData?.canonical_url) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonical_url);
  }

  // Schema markup
  if (seoData?.schema_markup) {
    let schemaScript = document.querySelector('script[type="application/ld+json"]#page-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('id', 'page-schema');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(seoData.schema_markup);
  }
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
