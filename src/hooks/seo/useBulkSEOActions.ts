
import { supabase } from '@/integrations/supabase/client';

export const useBulkSEOActions = () => {
  const bulkUpdateCanonicalUrls = async () => {
    try {
      console.log('🔄 Starting bulk update of canonical URLs...');
      
      // Get all SEO entries that don't have the correct domain
      const { data: seoEntries, error: fetchError } = await supabase
        .from('page_seo')
        .select('*')
        .or('canonical_url.is.null,canonical_url.not.like.*playacambutalguide.com*');

      if (fetchError) throw fetchError;

      if (!seoEntries || seoEntries.length === 0) {
        console.log('✅ All canonical URLs are already correct');
        return;
      }

      console.log(`🔧 Updating ${seoEntries.length} canonical URLs...`);

      // Update each entry
      for (const entry of seoEntries) {
        const newCanonicalUrl = `https://playacambutalguide.com${entry.page_path}`;
        
        const { error: updateError } = await supabase
          .from('page_seo')
          .update({ canonical_url: newCanonicalUrl })
          .eq('id', entry.id);

        if (updateError) {
          console.error(`❌ Failed to update canonical URL for ${entry.page_path}:`, updateError);
        } else {
          console.log(`✅ Updated canonical URL for ${entry.page_path}`);
        }
      }

      console.log('✅ Bulk canonical URL update completed');
    } catch (error) {
      console.error('❌ Error during bulk canonical URL update:', error);
    }
  };

  return { bulkUpdateCanonicalUrls };
};
