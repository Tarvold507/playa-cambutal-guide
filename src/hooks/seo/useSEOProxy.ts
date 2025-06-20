
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSEOProxy = () => {
  const [isTestingProxy, setIsTestingProxy] = useState(false);

  const testSEOProxy = async (testPath: string = '/') => {
    setIsTestingProxy(true);
    
    try {
      console.log('🧪 Testing SEO Proxy with crawler user agent...');
      
      // Call the edge function directly to test it
      const { data, error } = await supabase.functions.invoke('seo-proxy', {
        body: { 
          path: testPath,
          userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });

      if (error) {
        console.error('❌ SEO Proxy test error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ SEO Proxy test successful');
      console.log('📊 Response data:', data);
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ SEO Proxy test failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsTestingProxy(false);
    }
  };

  const verifySEOProxy = async () => {
    console.log('🔍 Verifying SEO Proxy configuration...');
    
    try {
      // Test multiple paths to ensure the proxy works for different page types
      const testPaths = ['/', '/eat', '/stay', '/eat/centro-recreativo-jake', '/stay/hotel-kambutaleko'];
      const results = [];
      
      for (const path of testPaths) {
        const result = await testSEOProxy(path);
        results.push({ path, ...result });
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      console.log(`📊 SEO Proxy verification: ${successCount}/${totalCount} paths tested successfully`);
      
      return {
        success: successCount === totalCount,
        results,
        summary: `${successCount}/${totalCount} paths working correctly`
      };
    } catch (error) {
      console.error('❌ SEO Proxy verification failed:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    testSEOProxy,
    verifySEOProxy,
    isTestingProxy
  };
};
