
import { useEffect } from 'react';
import { updatePageHead } from '@/utils/seoUtils';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAuth } from '@/contexts/AuthContext';
import { generateBlogSchema } from '@/utils/seoUtils';

export const useBlogPostSEO = (blogPost: any) => {
  const { updatePageSEO, fetchSEOByPath } = usePageSEO();
  const { user } = useAuth();

  useEffect(() => {
    if (!blogPost) return;

    const handleBlogPostSEO = async () => {
      const pagePath = `/blog/${blogPost.slug}`;
      
      try {
        // Check if SEO data already exists
        const existingSEO = await fetchSEOByPath(pagePath);
        
        if (existingSEO) {
          // Update canonical URL if it uses old domain
          if (existingSEO.canonical_url && !existingSEO.canonical_url.includes('playacambutalguide.com')) {
            const updatedSEO = {
              ...existingSEO,
              canonical_url: `https://playacambutalguide.com${pagePath}`
            };
            
            try {
              await updatePageSEO(pagePath, updatedSEO);
              updatePageHead(updatedSEO);
              return;
            } catch (updateError) {
              console.warn('Could not update canonical URL:', updateError);
              updatePageHead(existingSEO);
              return;
            }
          } else {
            updatePageHead(existingSEO);
            return;
          }
        }

        // Generate fresh SEO data
        const seoData = {
          page_title: `${blogPost.title} | Playa Cambutal Guide`,
          meta_description: blogPost.excerpt || blogPost.seo_description || `${blogPost.title.substring(0, 140)}... Read more travel insights about Playa Cambutal, Panama.`,
          meta_keywords: `${blogPost.title}, Playa Cambutal, Panama travel, ${blogPost.category || 'travel guide'}, ${blogPost.tags?.join(', ') || ''}, international tourists, travel blog`,
          og_title: blogPost.title,
          og_description: blogPost.excerpt || blogPost.seo_description || `${blogPost.title} - Read the latest travel insights from Playa Cambutal Guide.`,
          og_image: blogPost.featured_image_url || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          twitter_title: blogPost.title,
          twitter_description: blogPost.excerpt || blogPost.seo_description || `${blogPost.title} - Travel insights from Playa Cambutal.`,
          twitter_image: blogPost.featured_image_url || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          canonical_url: `https://playacambutalguide.com${pagePath}`,
          schema_markup: generateBlogSchema(blogPost)
        };

        // Try to save SEO data in database if user is authenticated
        if (user) {
          try {
            const savedSEO = await updatePageSEO(pagePath, {
              page_title: seoData.page_title,
              meta_description: seoData.meta_description,
              meta_keywords: seoData.meta_keywords,
              og_title: seoData.og_title,
              og_description: seoData.og_description,
              og_image: seoData.og_image,
              twitter_title: seoData.twitter_title,
              twitter_description: seoData.twitter_description,
              twitter_image: seoData.twitter_image,
              canonical_url: seoData.canonical_url,
              robots: 'index, follow',
              schema_markup: seoData.schema_markup,
            });
            
            if (savedSEO) {
              updatePageHead(savedSEO);
              return;
            }
          } catch (saveError) {
            console.warn('Could not save SEO data to database:', saveError);
          }
        }

        // Use generated data as fallback
        const fallbackSEO = {
          id: blogPost.id,
          page_path: pagePath,
          ...seoData,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        updatePageHead(fallbackSEO);
        
      } catch (error) {
        console.error('Error handling blog post SEO:', error);
        
        // Enhanced fallback
        const fallbackSEO = {
          id: blogPost.id,
          page_path: pagePath,
          page_title: `${blogPost.title} - Playa Cambutal Guide`,
          meta_description: blogPost.excerpt || `${blogPost.title} - Travel insights from Playa Cambutal, Panama.`,
          og_title: blogPost.title,
          og_description: blogPost.excerpt || `Read about ${blogPost.title} on Playa Cambutal Guide.`,
          og_image: blogPost.featured_image_url || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          canonical_url: `https://playacambutalguide.com${pagePath}`,
          robots: 'index, follow',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        updatePageHead(fallbackSEO);
      }
    };

    const timer = setTimeout(handleBlogPostSEO, 100);
    return () => clearTimeout(timer);
  }, [blogPost?.id, blogPost?.slug, updatePageSEO, fetchSEOByPath, user]);
};
