
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRealProductionDeployment } from '@/hooks/seo/useRealProductionDeployment';
import { FileText, Play, BarChart3, Database, AlertTriangle, ExternalLink } from 'lucide-react';

interface SEORealProductionControlsProps {
  onRefresh?: () => void;
}

export const SEORealProductionControls = ({ onRefresh }: SEORealProductionControlsProps) => {
  const { deployToRealProduction, isDeploying } = useRealProductionDeployment();
  const { toast } = useToast();
  const [lastDeployment, setLastDeployment] = useState<any>(null);

  const handleRealProductionDeployment = async () => {
    try {
      console.log('🚀 Starting REAL production SEO deployment to Supabase Storage...');
      
      const result = await deployToRealProduction();
      
      if (result.success) {
        setLastDeployment(result);
        toast({
          title: 'Supabase Storage Deployment Complete',
          description: `Successfully deployed ${result.stats.deployed} static SEO files to Supabase Storage.`,
        });
        
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast({
          title: 'Storage Deployment Issues',
          description: `Deployment completed with ${result.stats.failed} failures. Check console for details.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Supabase Storage deployment error:', error);
      toast({
        title: 'Storage Deployment Error',
        description: 'An error occurred during Supabase Storage deployment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Supabase Storage SEO Deployment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Supabase Storage Deployment</p>
            <p className="text-blue-700">
              This will deploy static HTML files to Supabase Storage with public access. 
              Files will be served via Supabase's CDN and accessible through public URLs.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleRealProductionDeployment}
            disabled={isDeploying}
            className="flex items-center gap-2"
            variant="default"
          >
            <Play className="w-4 h-4" />
            {isDeploying ? 'Deploying to Storage...' : 'Deploy to Supabase Storage'}
          </Button>
        </div>

        {lastDeployment && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm text-green-800">Last Storage Deployment Stats</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>Total Files: {lastDeployment.stats.total}</div>
                <div>Deployed: {lastDeployment.stats.deployed}</div>
                <div>Failed: {lastDeployment.stats.failed}</div>
                <div>Success Rate: {lastDeployment.stats.total > 0 ? Math.round((lastDeployment.stats.deployed / lastDeployment.stats.total) * 100) : 0}%</div>
              </div>

              {lastDeployment.stats.bucketName && (
                <div className="mb-2 text-sm">
                  <strong>Storage Bucket:</strong> {lastDeployment.stats.bucketName}
                </div>
              )}
              
              {lastDeployment.verificationPassed !== undefined && (
                <div className="mb-2 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                    lastDeployment.verificationPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Verification: {lastDeployment.verificationPassed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              )}

              {lastDeployment.stats.storageUrls && lastDeployment.stats.storageUrls.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-600 mb-1">Sample Storage URLs:</div>
                  <div className="space-y-1">
                    {lastDeployment.stats.storageUrls.slice(0, 3).map((url: string, index: number) => (
                      <div key={index} className="flex items-center gap-1 text-xs">
                        <ExternalLink className="w-3 h-3" />
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 truncate"
                        >
                          {url.split('/').pop()}
                        </a>
                      </div>
                    ))}
                    {lastDeployment.stats.storageUrls.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{lastDeployment.stats.storageUrls.length - 3} more files...
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {lastDeployment.stats.errors && lastDeployment.stats.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600">
                  <strong>Errors:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {lastDeployment.stats.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-500">
                Deployed: {new Date(lastDeployment.stats.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <strong>Supabase Storage Deployment:</strong> This stores the static HTML files in Supabase Storage 
          with public access. Files are served via Supabase's CDN and can be accessed through public URLs. 
          Perfect for hosting static SEO files that need to be publicly accessible.
        </div>
      </CardContent>
    </Card>
  );
};
