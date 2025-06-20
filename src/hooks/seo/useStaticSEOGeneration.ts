
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

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const regenerateStaticSEOFiles = async () => {
    try {
      console.log('🔄 Starting static SEO file regeneration...');
      
      // Get all SEO entries
      const { data: seoEntries, error: fetchError } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_path');

      if (fetchError) throw fetchError;

      if (!seoEntries || seoEntries.length === 0) {
        console.log('⚠️ No SEO entries found for regeneration');
        return false;
      }

      console.log(`📄 Generating ${seoEntries.length} static SEO files...`);
      
      // Track generated files
      const generatedFiles: { path: string; filename: string; type: string }[] = [];
      
      // Generate files for each SEO entry
      for (const entry of seoEntries) {
        const htmlContent = generateStaticHTML(entry);
        
        // Determine file type and generate appropriate filename
        let fileType = 'static';
        let filename = '';
        
        if (entry.page_path.startsWith('/eat/') && entry.page_path !== '/eat') {
          fileType = 'restaurant';
          const slug = entry.page_path.replace('/eat/', '');
          filename = `eat-${slug}.html`;
        } else if (entry.page_path.startsWith('/stay/') && entry.page_path !== '/stay') {
          fileType = 'hotel';
          const slug = entry.page_path.replace('/stay/', '');
          filename = `stay-${slug}.html`;
        } else if (entry.page_path.startsWith('/do/') && entry.page_path !== '/do') {
          fileType = 'activity';
          const slug = entry.page_path.replace('/do/', '');
          filename = `do-${slug}.html`;
        } else if (entry.page_path.startsWith('/blog/') && entry.page_path !== '/blog') {
          fileType = 'blog';
          const slug = entry.page_path.replace('/blog/', '');
          filename = `blog-${slug}.html`;
        } else {
          // Main pages like /eat, /stay, /do, etc.
          filename = `${entry.page_path.replace('/', '') || 'index'}.html`;
        }
        
        // For demo purposes, we'll download the first few files
        // In production, these would be uploaded to your static hosting
        if (generatedFiles.length < 3) {
          console.log(`💾 Downloading sample file: ${filename}`);
          downloadAsFile(htmlContent, filename);
        }
        
        generatedFiles.push({
          path: entry.page_path,
          filename: filename,
          type: fileType
        });
        
        console.log(`✅ Generated ${fileType} file: ${filename} for ${entry.page_path}`);
      }

      // Summary report
      const fileTypes = generatedFiles.reduce((acc, file) => {
        acc[file.type] = (acc[file.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('📊 Generation Summary:');
      Object.entries(fileTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} files`);
      });

      console.log(`✅ Static SEO file regeneration completed successfully!`);
      console.log(`📁 Total files generated: ${generatedFiles.length}`);
      console.log('💡 Note: In production, these files would be uploaded to your static hosting service');
      console.log('🔗 Files should be accessible at URLs like: /eat-restaurant-slug.html');

      return true;
    } catch (error) {
      console.error('❌ Error during static SEO file regeneration:', error);
      return false;
    }
  };

  return {
    generateStaticHTML,
    downloadAsFile,
    regenerateStaticSEOFiles,
  };
};
