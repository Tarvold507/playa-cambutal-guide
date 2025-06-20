
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProductionSEODeployment } from '@/hooks/seo/useProductionSEODeployment';
import { FileText, Play, BarChart3, Rocket, Settings } from 'lucide-react';

interface SEOProductionControlsProps {
  onRefresh?: () => void;
}

export const SEOProductionControls = ({ onRefresh }: SEOProductionControlsProps) => {
  const { deployToProduction, isDeploying } = useProductionSEODeployment();
  const { toast } = useToast();
  const [lastDeployment, setLastDeployment] = useState<any>(null);

  const handleProductionDeployment = async () => {
    try {
      console.log('🚀 Starting production SEO deployment...');
      
      const result = await deployToProduction();
      
      if (result.success) {
        setLastDeployment(result);
        toast({
          title: 'Production Deployment Complete',
          description: `Successfully deployed ${result.stats.generated} static SEO files to production.`,
        });
        
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast({
          title: 'Deployment Issues',
          description: `Deployment completed with ${result.stats.failed} failures. Check console for details.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Production deployment error:', error);
      toast({
        title: 'Deployment Error',
        description: 'An error occurred during production deployment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          Production SEO Deployment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Deploy production-ready static HTML files with SEO metadata for all pages. 
          Files will be written to the public directory with verification and manifest generation.
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleProductionDeployment}
            disabled={isDeploying}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isDeploying ? 'Deploying...' : 'Deploy to Production'}
          </Button>
        </div>

        {lastDeployment && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium text-sm">Last Deployment Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Files: {lastDeployment.stats.total}</div>
              <div>Deployed: {lastDeployment.stats.generated}</div>
              <div>Failed: {lastDeployment.stats.failed}</div>
              <div>Success Rate: {lastDeployment.stats.total > 0 ? Math.round((lastDeployment.stats.generated / lastDeployment.stats.total) * 100) : 0}%</div>
            </div>
            
            {lastDeployment.verificationPassed !== undefined && (
              <div className="mt-2 text-sm">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                  lastDeployment.verificationPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  Verification: {lastDeployment.verificationPassed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            )}
            
            {lastDeployment.stats.fileTypes && Object.keys(lastDeployment.stats.fileTypes).length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-1">File Types:</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(lastDeployment.stats.fileTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="capitalize">{type}:</span>
                      <span>{String(count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              Deployed: {new Date(lastDeployment.stats.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <strong>Production Deployment:</strong> This generates and deploys static HTML files 
          with complete SEO metadata, verification checks, and deployment manifests for production use.
        </div>
      </CardContent>
    </Card>
  );
};
