
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Globe, RefreshCw } from 'lucide-react';
import { generateSitemap, downloadSitemap } from '@/utils/sitemapGenerator';
import { useToast } from '@/hooks/use-toast';

export const SitemapGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemapPreview, setSitemapPreview] = useState<string>('');
  const { toast } = useToast();

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      const sitemap = await generateSitemap();
      setSitemapPreview(sitemap);
      toast({
        title: "Sitemap Generated",
        description: "Your sitemap has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error",
        description: "Failed to generate sitemap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    try {
      await downloadSitemap();
      toast({
        title: "Sitemap Downloaded",
        description: "Sitemap.xml has been downloaded to your computer.",
      });
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      toast({
        title: "Error",
        description: "Failed to download sitemap. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Sitemap Generator
          </CardTitle>
          <CardDescription>
            Generate and download an XML sitemap for your website. This includes all pages, restaurants, hotels, adventures, and blog posts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateSitemap} 
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Generate Sitemap
            </Button>
            <Button 
              onClick={handleDownloadSitemap}
              disabled={!sitemapPreview}
            >
              <Download className="w-4 h-4 mr-2" />
              Download XML
            </Button>
          </div>

          {sitemapPreview && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Preview (first 20 lines):</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
                {sitemapPreview.split('\n').slice(0, 20).join('\n')}
                {sitemapPreview.split('\n').length > 20 && '\n... (truncated)'}
              </pre>
              <p className="text-sm text-gray-600 mt-2">
                Total URLs: {(sitemapPreview.match(/<url>/g) || []).length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Robots.txt Information</CardTitle>
          <CardDescription>
            Your robots.txt file is already configured and includes important SEO directives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded text-sm font-mono">
            <div className="text-gray-600"># Current robots.txt content:</div>
            <div>User-agent: *</div>
            <div>Allow: /</div>
            <div></div>
            <div>Sitemap: https://playacambutal.guide/sitemap.xml</div>
            <div></div>
            <div className="text-gray-600"># Optimized for search engines</div>
            <div>User-agent: Googlebot</div>
            <div>Allow: /</div>
            <div>Crawl-delay: 1</div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            The robots.txt file is located at /public/robots.txt and is already optimized for SEO.
            After generating your sitemap, upload the sitemap.xml file to your website root.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
