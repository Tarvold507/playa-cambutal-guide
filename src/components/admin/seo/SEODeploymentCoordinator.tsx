
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProductionSEODeployment } from '@/hooks/seo/useProductionSEODeployment';
import { useRealProductionDeployment } from '@/hooks/seo/useRealProductionDeployment';
import { Settings, Play, AlertTriangle, CheckCircle } from 'lucide-react';

interface SEODeploymentCoordinatorProps {
  onRefresh?: () => void;
}

export const SEODeploymentCoordinator = ({ onRefresh }: SEODeploymentCoordinatorProps) => {
  const { deployToProduction, isDeploying: isProductionDeploying } = useProductionSEODeployment();
  const { deployToRealProduction, isDeploying: isRealDeploying } = useRealProductionDeployment();
  const { toast } = useToast();
  const [deploymentResults, setDeploymentResults] = useState<{
    production?: any;
    real?: any;
  }>({});

  const handleCoordinatedDeployment = async () => {
    try {
      console.log('🚀 Starting coordinated SEO deployment...');
      
      // First, deploy to simulated production environment
      console.log('📦 Step 1: Deploying to simulated production environment...');
      const productionResult = await deployToProduction();
      
      if (!productionResult.success) {
        throw new Error('Simulated production deployment failed');
      }

      console.log('✅ Simulated production deployment completed successfully');
      
      // Then, deploy to real file system
      console.log('📂 Step 2: Deploying to real file system...');
      const realResult = await deployToRealProduction();
      
      setDeploymentResults({
        production: productionResult,
        real: realResult
      });

      if (realResult.success) {
        toast({
          title: 'Coordinated Deployment Complete',
          description: `Successfully deployed ${realResult.stats.deployed} files to both environments.`,
        });
      } else {
        toast({
          title: 'Partial Deployment Success',
          description: 'Simulated deployment succeeded, but real deployment had issues. Check console for details.',
          variant: 'destructive',
        });
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Coordinated deployment error:', error);
      toast({
        title: 'Deployment Error',
        description: 'An error occurred during coordinated deployment.',
        variant: 'destructive',
      });
    }
  };

  const isDeploying = isProductionDeploying || isRealDeploying;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Coordinated SEO Deployment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Coordinated Deployment</p>
            <p className="text-blue-700">
              This will deploy static SEO files to both the simulated production environment 
              (for testing/verification) and the real file system (for actual serving).
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCoordinatedDeployment}
            disabled={isDeploying}
            className="flex items-center gap-2"
            variant="default"
          >
            <Play className="w-4 h-4" />
            {isDeploying ? 'Deploying to Both Environments...' : 'Deploy to Both Environments'}
          </Button>
        </div>

        {deploymentResults.production && deploymentResults.real && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm text-gray-800">Deployment Summary</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700 mb-1">Simulated Production:</div>
                  <div>Files: {deploymentResults.production.stats.generated}/{deploymentResults.production.stats.total}</div>
                  <div>Success: {deploymentResults.production.success ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Real File System:</div>
                  <div>Files: {deploymentResults.real.stats.deployed}/{deploymentResults.real.stats.total}</div>
                  <div>Success: {deploymentResults.real.success ? 'Yes' : 'No'}</div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Last deployment: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <strong>Coordinated Deployment:</strong> Deploys to both simulated and real environments 
          for comprehensive testing and production serving. Use this for complete deployment workflows.
        </div>
      </CardContent>
    </Card>
  );
};
