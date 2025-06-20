
import { supabase } from '@/integrations/supabase/client';
import { PageSEO } from './types';

export const usePageSEOUpdate = () => {
  const updatePageSEO = async (path: string, seoData: Partial<PageSEO>, retryCount = 0): Promise<PageSEO | null> => {
    const maxRetries = 3;
    
    try {
      // Ensure canonical URL uses correct domain
      let canonicalUrl = seoData.canonical_url;
      if (canonicalUrl && !canonicalUrl.includes('playacambutalguide.com')) {
        canonicalUrl = `https://playacambutalguide.com${path}`;
        console.log('🔄 Correcting canonical URL to use playacambutalguide.com');
      }

      // Ensure required fields are present
      const updateData = {
        page_path: path,
        page_title: seoData.page_title || `Page - ${path}`,
        canonical_url: canonicalUrl,
        ...seoData,
      };

      // First, try to update existing record
      const { data: updateResult, error: updateError } = await supabase
        .from('page_seo')
        .update(updateData)
        .eq('page_path', path)
        .select()
        .maybeSingle();

      // If update succeeded and found a record, return it
      if (!updateError && updateResult) {
        console.log('✅ Successfully updated SEO for:', path);
        return updateResult;
      }

      // If no record was found to update, try to insert
      if (!updateError && !updateResult) {
        const { data: insertResult, error: insertError } = await supabase
          .from('page_seo')
          .insert(updateData)
          .select()
          .single();

        if (!insertError) {
          console.log('✅ Successfully created SEO for:', path);
          return insertResult;
        }

        // Handle duplicate key constraint violation
        if (insertError.code === '23505' && retryCount < maxRetries) {
          console.log(`🔄 Duplicate key detected for ${path}, retrying... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
          return updatePageSEO(path, seoData, retryCount + 1);
        }

        // If it's a permission error, log it but don't throw
        if (insertError.code === '42501') {
          console.warn('⚠️ Permission denied when trying to save SEO data for:', path);
          return null;
        }

        throw insertError;
      }

      // If it's a permission error, log it but don't throw
      if (updateError?.code === '42501') {
        console.warn('⚠️ Permission denied when trying to update SEO data for:', path);
        return null;
      }

      throw updateError;
    } catch (error: any) {
      // Handle duplicate key constraint violation with retry
      if (error.code === '23505' && retryCount < maxRetries) {
        console.log(`🔄 Duplicate key detected for ${path}, retrying... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
        return updatePageSEO(path, seoData, retryCount + 1);
      }
      
      // Handle permission errors gracefully
      if (error.code === '42501') {
        console.warn('⚠️ Permission denied when trying to save SEO data for:', path);
        return null;
      }
      
      console.error('❌ Error updating page SEO:', error);
      return null;
    }
  };

  return { updatePageSEO };
};
