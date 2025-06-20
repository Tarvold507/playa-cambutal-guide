
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStaticSEOGeneration } from '@/hooks/seo/useStaticSEOGeneration';
import { FileText, Play, BarChart3 } from 'lucide-react';

interface SEOProductionControlsProps {
  onRefresh?: () => void;
}

export const SEOProductionControls = ({ onRefresh }: SEOProductionControlsProps) => {
  const { regenerateStaticSEOFiles } = useStaticSEOGeneration();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastStats, setLastStats] = useState<any>(null);

  const handleProductionGeneration = async () => {
    setIsGenerating(true);
    try {
      console.log('🚀 Starting production static SEO file generation...');
      
      const result = await regenerateStaticSEOFiles();
      
      if (result.success) {
        setLastStats(result.stats);
        toast({
          title: 'Production Generation Complete',
          description: `Successfully generated ${result.stats.generated} static SEO files for production deployment.`,
        });
        
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast({
          title: 'Generation Failed',
          description: 'Some files failed to generate. Check the console for details.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Production generation error:', error);
      toast({
        title: 'Generation Error',
        description: 'An error occurred during production file generation.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Production Static SEO Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Generate production-ready static HTML files with SEO metadata for all pages. 
          These files will be created in the public directory for deployment.
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleProductionGeneration}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Production Files'}
          </Button>
        </div>

        {lastStats && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium text-sm">Last Generation Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Files: {lastStats.total}</div>
              <div>Generated: {lastStats.generated}</div>
              <div>Failed: {lastStats.failed}</div>
              <div>Success Rate: {lastStats.total > 0 ? Math.round((lastStats.generated / lastStats.total) * 100) : 0}%</div>
            </div>
            
            {lastStats.fileTypes && Object.keys(lastStats.fileTypes).length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-1">File Types:</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(lastStats.fileTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="capitalize">{type}:</span>
                      <span>{String(count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <strong>Note:</strong> This generates static HTML files for production deployment. 
          Files are created in the public directory and will be available after the next build.
        </div>
      </CardContent>
    </Card>
  );
};
