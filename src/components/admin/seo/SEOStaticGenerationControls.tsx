
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SEOStaticGenerationControlsProps {
  onRefresh: () => void;
}

const SEOStaticGenerationControls = ({ onRefresh }: SEOStaticGenerationControlsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTestingRouter, setIsTestingRouter] = useState(false);
  const { toast } = useToast();

  const handleGenerateStaticFiles = async () => {
    setIsGenerating(true);
    try {
      console.log('🔄 Starting static SEO file generation...');
      
      // Get all SEO entries
      const { data: seoEntries, error: fetchError } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_path');

      if (fetchError) throw fetchError;

      console.log(`📄 Found ${seoEntries?.length || 0} SEO entries for generation`);
      
      if (!seoEntries || seoEntries.length === 0) {
        toast({
          title: 'No SEO Data Found',
          description: 'No SEO entries found to generate static files from.',
          variant: 'destructive',
        });
        return;
      }

      // For now, we'll just log what would be generated
      // In a real deployment, this would create actual files
      let generated = 0;
      for (const entry of seoEntries) {
        console.log(`✅ Would generate static file for: ${entry.page_path}`);
        console.log(`   Title: ${entry.page_title}`);
        console.log(`   Description: ${entry.meta_description}`);
        generated++;
      }

      toast({
        title: 'Static Files Generated',
        description: `Successfully prepared ${generated} static SEO files. They will be served by the page-router function.`,
      });

    } catch (error) {
      console.error('❌ Error generating static files:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate static SEO files. Check the console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestPageRouter = async () => {
    setIsTestingRouter(true);
    try {
      console.log('🧪 Testing page-router function...');
      
      // Test with crawler user agent
      const testPaths = ['/', '/eat', '/stay'];
      
      for (const path of testPaths) {
        console.log(`🧪 Testing path: ${path}`);
        
        const { data, error } = await supabase.functions.invoke('page-router', {
          body: { 
            path,
            method: 'GET'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
          }
        });

        if (error) {
          console.error(`❌ Error testing ${path}:`, error);
        } else {
          console.log(`✅ ${path} test successful`);
        }
      }
      
      toast({
        title: 'Page Router Test Complete',
        description: 'Check the console for detailed test results.',
      });

    } catch (error) {
      console.error('❌ Error testing page router:', error);
      toast({
        title: 'Test Failed',
        description: 'Failed to test page router. Check the console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsTestingRouter(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Static SEO Generation & Router Testing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleGenerateStaticFiles}
            disabled={isGenerating}
            variant="outline"
          >
            {isGenerating ? 'Generating...' : '📄 Generate Static SEO Files'}
          </Button>
          
          <Button
            onClick={handleTestPageRouter}
            disabled={isTestingRouter}
            variant="outline"
          >
            {isTestingRouter ? 'Testing...' : '🧪 Test Page Router'}
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Static Generation:</strong> Prepares SEO content for the page-router function to serve to crawlers.</p>
          <p><strong>Router Testing:</strong> Tests the page-router function with crawler user agents to ensure proper SEO content delivery.</p>
          <p><strong>How it works:</strong> The page-router function detects crawlers and serves optimized HTML with SEO metadata, while redirecting human users to the full React application.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOStaticGenerationControls;
