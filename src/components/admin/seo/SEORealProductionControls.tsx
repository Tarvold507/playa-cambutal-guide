
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRealProductionDeployment } from '@/hooks/seo/useRealProductionDeployment';
import { FileText, Play, BarChart3, Server, AlertTriangle } from 'lucide-react';

interface SEORealProductionControlsProps {
  onRefresh?: () => void;
}

export const SEORealProductionControls = ({ onRefresh }: SEORealProductionControlsProps) => {
  const { deployToRealProduction, isDeploying } = useRealProductionDeployment();
  const { toast } = useToast();
  const [lastDeployment, setLastDeployment] = useState<any>(null);

  const handleRealProductionDeployment = async () => {
    try {
      console.log('🚀 Starting REAL production SEO deployment...');
      
      const result = await deployToRealProduction();
      
      if (result.success) {
        setLastDeployment(result);
        toast({
          title: 'Real Production Deployment Complete',
          description: `Successfully deployed ${result.stats.deployed} static SEO files to real file system.`,
        });
        
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast({
          title: 'Real Deployment Issues',
          description: `Deployment completed with ${result.stats.failed} failures. Check console for details.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Real production deployment error:', error);
      toast({
        title: 'Real Deployment Error',
        description: 'An error occurred during real production deployment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          Real File System SEO Deployment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Real File System Deployment</p>
            <p className="text-yellow-700">
              This will deploy static HTML files to the actual server file system using Supabase Edge Functions. 
              Requires authentication and server-side file write permissions.
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
            {isDeploying ? 'Deploying to Real FS...' : 'Deploy to Real File System'}
          </Button>
        </div>

        {lastDeployment && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <span className="font-medium text-sm text-green-800">Last Real Deployment Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Files: {lastDeployment.stats.total}</div>
              <div>Deployed: {lastDeployment.stats.deployed}</div>
              <div>Failed: {lastDeployment.stats.failed}</div>
              <div>Success Rate: {lastDeployment.stats.total > 0 ? Math.round((lastDeployment.stats.deployed / lastDeployment.stats.total) * 100) : 0}%</div>
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
        )}

        <div className="text-xs text-gray-500">
          <strong>Real File System Deployment:</strong> This uses Supabase Edge Functions to actually write 
          static HTML files to the server's file system. Perfect for production deployments where files need 
          to be served by the web server.
        </div>
      </CardContent>
    </Card>
  );
};
