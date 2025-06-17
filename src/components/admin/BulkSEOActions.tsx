
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAdminSEOBulkActions } from '@/hooks/admin/useAdminSEOBulkActions';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Globe, Database, CheckCircle } from 'lucide-react';

const BulkSEOActions = () => {
  const { bulkUpdateCanonicalUrls } = usePageSEO();
  const { generateSEOForAllHotels, generateSEOForAllRestaurants, isGenerating } = useAdminSEOBulkActions();
  const { toast } = useToast();
  const [isUpdatingUrls, setIsUpdatingUrls] = useState(false);

  const handleBulkCanonicalUpdate = async () => {
    setIsUpdatingUrls(true);
    try {
      await bulkUpdateCanonicalUrls();
      toast({
        title: 'Success',
        description: 'All canonical URLs have been updated to use playacambutalguide.com',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update canonical URLs',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingUrls(false);
    }
  };

  const handleGenerateHotelSEO = async () => {
    try {
      await generateSEOForAllHotels();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate hotel SEO data',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateRestaurantSEO = async () => {
    try {
      await generateSEOForAllRestaurants();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate restaurant SEO data',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Bulk SEO Actions
        </CardTitle>
        <CardDescription>
          Perform bulk operations on SEO data across all pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleBulkCanonicalUpdate}
            disabled={isUpdatingUrls}
            variant="outline"
            className="h-auto p-4 text-left"
          >
            <div className="flex items-start space-x-3">
              {isUpdatingUrls ? (
                <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0 mt-1" />
              ) : (
                <Globe className="w-5 h-5 flex-shrink-0 mt-1" />
              )}
              <div>
                <div className="font-medium">Update Canonical URLs</div>
                <div className="text-sm text-muted-foreground">
                  Fix all canonical URLs to use playacambutalguide.com
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={handleGenerateRestaurantSEO}
            disabled={isGenerating}
            variant="outline"
            className="h-auto p-4 text-left"
          >
            <div className="flex items-start space-x-3">
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0 mt-1" />
              ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
              )}
              <div>
                <div className="font-medium">Generate Restaurant SEO</div>
                <div className="text-sm text-muted-foreground">
                  Create SEO data for all restaurants
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={handleGenerateHotelSEO}
            disabled={isGenerating}
            variant="outline"
            className="h-auto p-4 text-left"
          >
            <div className="flex items-start space-x-3">
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0 mt-1" />
              ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />
              )}
              <div>
                <div className="font-medium">Generate Hotel SEO</div>
                <div className="text-sm text-muted-foreground">
                  Create SEO data for all hotels
                </div>
              </div>
            </div>
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Pro Tip</p>
                <p className="text-blue-700">
                  After updating SEO data, submit your sitemap to Google Search Console for faster re-indexing
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkSEOActions;
