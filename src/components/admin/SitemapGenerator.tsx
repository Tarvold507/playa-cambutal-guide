
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Globe, RefreshCw, ExternalLink } from 'lucide-react';
import { generateSitemap, downloadSitemap } from '@/utils/sitemapGenerator';
import { useToast } from '@/hooks/use-toast';

export const SitemapGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemapPreview, setSitemapPreview] = useState<string>('');
  const [sitemapStats, setSitemapStats] = useState<{
    totalUrls: number;
    staticPages: number;
    restaurants: number;
    hotels: number;
    adventures: number;
    blogs: number;
    seoPages: number;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      const sitemap = await generateSitemap();
      setSitemapPreview(sitemap);
      
      // Calculate statistics
      const urlMatches = sitemap.match(/<url>/g) || [];
      const staticUrls = ['/surf', '/eat', '/stay', '/do', '/calendar', '/blog', '/transportation', '/real-estate', '/info'].length;
      const restaurantUrls = (sitemap.match(/\/eat\//g) || []).length;
      const hotelUrls = (sitemap.match(/\/stay\//g) || []).length;
      const adventureUrls = (sitemap.match(/\/do\//g) || []).length;
      const blogUrls = (sitemap.match(/\/blog\//g) || []).length;
      
      setSitemapStats({
        totalUrls: urlMatches.length,
        staticPages: staticUrls,
        restaurants: restaurantUrls,
        hotels: hotelUrls,
        adventures: adventureUrls,
        blogs: blogUrls,
        seoPages: urlMatches.length - staticUrls - restaurantUrls - hotelUrls - adventureUrls - blogUrls
      });
      
      toast({
        title: "Sitemap Generated",
        description: `Your sitemap has been generated with ${urlMatches.length} URLs.`,
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
            <Button 
              variant="outline"
              onClick={() => window.open('/sitemap.xml', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Sitemap
            </Button>
          </div>

          {sitemapStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sitemapStats.totalUrls}</div>
                <div className="text-sm text-gray-600">Total URLs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sitemapStats.staticPages}</div>
                <div className="text-sm text-gray-600">Static Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{sitemapStats.restaurants}</div>
                <div className="text-sm text-gray-600">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{sitemapStats.hotels}</div>
                <div className="text-sm text-gray-600">Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{sitemapStats.adventures}</div>
                <div className="text-sm text-gray-600">Adventures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{sitemapStats.blogs}</div>
                <div className="text-sm text-gray-600">Blog Posts</div>
              </div>
            </div>
          )}

          {sitemapPreview && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Preview (first 20 lines):</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
                {sitemapPreview.split('\n').slice(0, 20).join('\n')}
                {sitemapPreview.split('\n').length > 20 && '\n... (truncated)'}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Recommendations</CardTitle>
          <CardDescription>
            Important steps to improve your Google indexing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Submit Sitemap to Google Search Console</p>
                <p className="text-sm text-gray-600">Add your sitemap URL: https://playacambutalguide.com/sitemap.xml</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Request Indexing for Important Pages</p>
                <p className="text-sm text-gray-600">Manually request indexing for your main pages in Search Console</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Monitor Crawl Errors</p>
                <p className="text-sm text-gray-600">Check Search Console for any crawling issues and fix them promptly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Verify Internal Links</p>
                <p className="text-sm text-gray-600">Ensure all restaurant, hotel, and adventure pages are linked from your main sections</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Robots.txt Information</CardTitle>
          <CardDescription>
            Your robots.txt file has been optimized for better SEO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded text-sm font-mono">
            <div className="text-gray-600"># Current robots.txt highlights:</div>
            <div>User-agent: *</div>
            <div>Allow: /</div>
            <div></div>
            <div>Sitemap: https://playacambutalguide.com/sitemap.xml</div>
            <div></div>
            <div className="text-gray-600"># All important pages are explicitly allowed</div>
            <div>Allow: /eat</div>
            <div>Allow: /stay</div>
            <div>Allow: /do</div>
            <div>Allow: /info</div>
            <div>Allow: /blog</div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            The robots.txt file is now optimized to allow all search engines to crawl your important content while protecting admin areas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
