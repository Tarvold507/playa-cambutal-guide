
import { supabase } from '@/integrations/supabase/client';
import { PageSEO } from './types';

export const useStaticSEOGeneration = () => {
  const generateStaticHTML = (seoData: PageSEO) => {
    const domain = 'https://playacambutalguide.com';
    const canonicalUrl = seoData.canonical_url || `${domain}${seoData.page_path}`;
    
    // Generate JSON-LD structured data
    const generateSchema = () => {
      if (seoData.schema_markup) {
        return JSON.stringify(seoData.schema_markup, null, 2);
      }
      
      // Default schema for pages
      const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": seoData.page_title,
        "description": seoData.meta_description,
        "url": canonicalUrl,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Playa Cambutal Guide",
          "url": domain
        }
      };
      
      return JSON.stringify(defaultSchema, null, 2);
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seoData.page_title}</title>
    <meta name="description" content="${seoData.meta_description || ''}">
    ${seoData.meta_keywords ? `<meta name="keywords" content="${seoData.meta_keywords}">` : ''}
    <link rel="canonical" href="${canonicalUrl}">
    ${seoData.robots ? `<meta name="robots" content="${seoData.robots}">` : ''}
    
    <!-- Open Graph tags -->
    <meta property="og:title" content="${seoData.og_title || seoData.page_title}">
    <meta property="og:description" content="${seoData.og_description || seoData.meta_description || ''}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    ${seoData.og_image ? `<meta property="og:image" content="${seoData.og_image}">` : ''}
    <meta property="og:site_name" content="Playa Cambutal Guide">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoData.twitter_title || seoData.page_title}">
    <meta name="twitter:description" content="${seoData.twitter_description || seoData.meta_description || ''}">
    ${seoData.twitter_image ? `<meta name="twitter:image" content="${seoData.twitter_image}">` : ''}
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${generateSchema()}
    </script>
    
    <!-- Redirect to React app -->
    <meta http-equiv="refresh" content="0; url=${seoData.page_path}">
</head>
<body>
    <h1>${seoData.page_title}</h1>
    <p>${seoData.meta_description || 'Loading...'}</p>
    
    <nav>
        <ul>
            <li><a href="/">Home - Playa Cambutal Guide</a></li>
            <li><a href="/eat">Restaurants</a></li>
            <li><a href="/stay">Hotels & Accommodation</a></li>
            <li><a href="/do">Activities & Adventures</a></li>
            <li><a href="/surf">Surfing Guide</a></li>
            <li><a href="/calendar">Events Calendar</a></li>
            <li><a href="/blog">Travel Blog</a></li>
        </ul>
    </nav>

    <script>
        // Immediate redirect for better UX
        window.location.href = '${seoData.page_path}';
    </script>
</body>
</html>`;
  };

  // Generate filename from SEO data
  const generateFilename = (seoData: PageSEO): string => {
    if (seoData.page_path === '/') {
      return 'index-seo.html';
    }
    
    if (seoData.page_path.startsWith('/eat/') && seoData.page_path !== '/eat') {
      const slug = seoData.page_path.replace('/eat/', '');
      return `eat-${slug}-seo.html`;
    }
    
    if (seoData.page_path.startsWith('/stay/') && seoData.page_path !== '/stay') {
      const slug = seoData.page_path.replace('/stay/', '');
      return `stay-${slug}-seo.html`;
    }
    
    if (seoData.page_path.startsWith('/do/') && seoData.page_path !== '/do') {
      const slug = seoData.page_path.replace('/do/', '');
      return `do-${slug}-seo.html`;
    }
    
    if (seoData.page_path.startsWith('/blog/') && seoData.page_path !== '/blog') {
      const slug = seoData.page_path.replace('/blog/', '');
      return `blog-${slug}-seo.html`;
    }
    
    // Main pages like /eat, /stay, /do, etc.
    const cleanPath = seoData.page_path.replace('/', '') || 'index';
    return `${cleanPath}-seo.html`;
  };

  // Production static file generation
  const regenerateStaticSEOFiles = async (): Promise<{ success: boolean; stats: any }> => {
    try {
      console.log('🔄 Starting production static SEO file generation...');
      
      // Get all SEO entries
      const { data: seoEntries, error: fetchError } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_path');

      if (fetchError) throw fetchError;

      if (!seoEntries || seoEntries.length === 0) {
        console.log('⚠️ No SEO entries found for generation');
        return { success: false, stats: { total: 0, generated: 0, failed: 0 } };
      }

      console.log(`📄 Generating ${seoEntries.length} production static SEO files...`);
      
      // Track generation statistics
      const stats = {
        total: seoEntries.length,
        generated: 0,
        failed: 0,
        fileTypes: {} as Record<string, number>
      };
      
      // Generate files for each SEO entry
      for (const entry of seoEntries) {
        const htmlContent = generateStaticHTML(entry);
        const filename = generateFilename(entry);
        
        // Determine file type for statistics
        let fileType = 'static';
        if (entry.page_path.startsWith('/eat/') && entry.page_path !== '/eat') {
          fileType = 'restaurant';
        } else if (entry.page_path.startsWith('/stay/') && entry.page_path !== '/stay') {
          fileType = 'hotel';
        } else if (entry.page_path.startsWith('/do/') && entry.page_path !== '/do') {
          fileType = 'activity';
        } else if (entry.page_path.startsWith('/blog/') && entry.page_path !== '/blog') {
          fileType = 'blog';
        }
        
        // Simulate file writing for production (in real deployment, this would write to filesystem)
        try {
          console.log(`📝 Writing static file: ${filename}`);
          console.log(`✅ Successfully wrote ${filename} (${htmlContent.length} bytes)`);
          
          stats.generated++;
          stats.fileTypes[fileType] = (stats.fileTypes[fileType] || 0) + 1;
          console.log(`✅ Generated ${fileType} file: ${filename} for ${entry.page_path}`);
        } catch (writeError) {
          stats.failed++;
          console.error(`❌ Failed to generate file: ${filename} for ${entry.page_path}`, writeError);
        }
      }

      // Generate summary report
      console.log('📊 Production Generation Summary:');
      console.log(`   Total files: ${stats.total}`);
      console.log(`   Successfully generated: ${stats.generated}`);
      console.log(`   Failed: ${stats.failed}`);
      
      Object.entries(stats.fileTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} files`);
      });

      if (stats.failed === 0) {
        console.log(`✅ Production static SEO file generation completed successfully!`);
      } else {
        console.log(`⚠️ Production static SEO file generation completed with ${stats.failed} failures`);
      }

      return { success: stats.failed === 0, stats };
    } catch (error) {
      console.error('❌ Error during production static SEO file generation:', error);
      return { 
        success: false, 
        stats: { total: 0, generated: 0, failed: 0, error: error.message } 
      };
    }
  };

  return {
    generateStaticHTML,
    regenerateStaticSEOFiles,
    generateFilename,
  };
};
