import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { usePageSEO, PageSEO } from '@/hooks/usePageSEO';
import { useToast } from '@/hooks/use-toast';
import BulkSEOActions from './BulkSEOActions';
import SEOPageCard from './seo/SEOPageCard';
import { SEOFilterControls } from './seo/SEOFilterControls';
import { SEORealProductionControls } from './seo/SEORealProductionControls';
import { SEOProductionControls } from './seo/SEOProductionControls';
import { SEOPublicDirectoryControls } from './seo/SEOPublicDirectoryControls';
import { SEOProxyControls } from './seo/SEOProxyControls';
import SEOStaticGenerationControls from './seo/SEOStaticGenerationControls';

interface SEOManagementTabProps {
  pageSEO: PageSEO[];
  onRefresh: () => void;
}

const SEOManagementTab = ({ pageSEO, onRefresh }: SEOManagementTabProps) => {
  const { updatePageSEO, regenerateStaticSEOFiles } = usePageSEO();
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>('all');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const getPageType = (pagePath: string) => {
    if (pagePath.startsWith('/stay/')) return 'hotel';
    if (pagePath.startsWith('/eat/') && pagePath !== '/eat') return 'restaurant';
    if (pagePath.startsWith('/events/')) return 'event';
    if (pagePath.startsWith('/blog/')) return 'blog';
    return 'static';
  };

  const filteredPages = pageSEO.filter(page => {
    if (filterType === 'all') return true;
    return getPageType(page.page_path) === filterType;
  });

  const handleSavePage = async (page: PageSEO, formData: Partial<PageSEO>) => {
    try {
      const updatedForm = {
        ...formData,
        meta_keywords: formData.meta_keywords?.includes('custom') 
          ? formData.meta_keywords 
          : `${formData.meta_keywords || ''}, custom`.replace(/^, /, ''),
        canonical_url: formData.canonical_url?.includes('playacambutalguide.com') 
          ? formData.canonical_url 
          : `https://playacambutalguide.com${page.page_path}`
      };

      await updatePageSEO(page.page_path, updatedForm);
      toast({
        title: 'Success',
        description: 'SEO settings updated successfully',
      });
      onRefresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update SEO settings',
        variant: 'destructive',
      });
    }
  };

  const handleBulkRefresh = async () => {
    toast({
      title: 'Refreshing SEO Data',
      description: 'This will regenerate SEO for all dynamic pages when they are next visited.',
    });
    onRefresh();
  };

  const handleTestRegeneration = async () => {
    setIsRegenerating(true);
    try {
      console.log('🧪 Testing SEO file regeneration...');
      const success = await regenerateStaticSEOFiles();
      
      if (success) {
        toast({
          title: 'Test Regeneration Complete',
          description: 'Check the console to see what would be regenerated. This is currently in test mode.',
        });
      } else {
        toast({
          title: 'Test Failed',
          description: 'Something went wrong during the test. Check the console for details.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Test regeneration error:', error);
      toast({
        title: 'Test Error',
        description: 'An error occurred during testing.',
        variant: 'destructive',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <BulkSEOActions />
      
      <SEOStaticGenerationControls onRefresh={onRefresh} />
      
      <SEOProxyControls onRefresh={onRefresh} />
      
      <SEOPublicDirectoryControls onRefresh={onRefresh} />
      
      <SEOProductionControls onRefresh={onRefresh} />
      
      <SEORealProductionControls onRefresh={onRefresh} />
      
      <SEOFilterControls
        filterType={filterType}
        onFilterChange={setFilterType}
        onBulkRefresh={handleBulkRefresh}
        onTestRegeneration={handleTestRegeneration}
        isRegenerating={isRegenerating}
      />

      {filteredPages.map((page) => (
        <SEOPageCard 
          key={page.id} 
          page={page} 
          onSave={handleSavePage}
        />
      ))}

      {filteredPages.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p>No pages found for the selected filter.</p>
            <p className="text-sm mt-2">Dynamic pages will appear here after they are visited by users.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SEOManagementTab;
