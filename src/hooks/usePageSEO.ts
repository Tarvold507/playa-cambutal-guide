
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PageSEO {
  id: string;
  page_path: string;
  page_title: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots?: string;
  schema_markup?: any;
  created_at: string;
  updated_at: string;
}

export const usePageSEO = () => {
  const [pageSEO, setPageSEO] = useState<PageSEO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPageSEO = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_path');

      if (error) throw error;
      setPageSEO(data || []);
    } catch (error) {
      console.error('Error fetching page SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSEOByPath = async (path: string): Promise<PageSEO | null> => {
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_path', path)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching SEO for path:', path, error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching SEO for path:', path, error);
      return null;
    }
  };

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
      
      // If we've exhausted retries, try one final read to get existing data
      if (retryCount >= maxRetries) {
        try {
          const existingData = await fetchSEOByPath(path);
          if (existingData) {
            console.log(`📋 Returning existing SEO data for ${path} after failed upsert`);
            return existingData;
          }
        } catch (fetchError) {
          console.error('❌ Error fetching existing SEO data:', fetchError);
        }
      }
      
      return null;
    }
  };

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

  useEffect(() => {
    fetchPageSEO();
  }, []);

  return {
    pageSEO,
    loading,
    fetchPageSEO,
    fetchSEOByPath,
    updatePageSEO,
    bulkUpdateCanonicalUrls,
  };
};
