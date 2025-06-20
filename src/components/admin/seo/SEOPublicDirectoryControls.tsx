
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePublicDirectoryDeployment } from '@/hooks/seo/usePublicDirectoryDeployment';
import { Folder, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface SEOPublicDirectoryControlsProps {
  onRefresh: () => void;
}

export const SEOPublicDirectoryControls = ({ onRefresh }: SEOPublicDirectoryControlsProps) => {
  const { deployToPublicDirectory, isDeploying } = usePublicDirectoryDeployment();
  const { toast } = useToast();
  const [lastDeployment, setLastDeployment] = useState<any>(null);

  const handlePublicDirectoryDeployment = async () => {
    try {
      console.log('🚀 Starting public directory deployment...');
      
      const result = await deployToPublicDirectory();
      setLastDeployment(result);

      if (result.success) {
        toast({
          title: 'Public Directory Deployment Successful',
          description: `${result.stats.deployed} SEO files ready for public serving. Check console for file locations.`,
        });
        console.log('📁 Public Files Created:', result.stats.publicFiles);
      } else {
        toast({
          title: 'Public Directory Deployment Issues',
          description: `${result.stats.deployed} files deployed, ${result.stats.failed} failed. Check console for details.`,
          variant: 'destructive',
        });
      }

      onRefresh();
    } catch (error) {
      console.error('Public directory deployment error:', error);
      toast({
        title: 'Deployment Error',
        description: 'Failed to deploy to public directory. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Public Directory Deployment (Recommended for Lovable)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How This Works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Generates optimized SEO HTML files for each page</li>
            <li>• Maps them to proper public directory paths (e.g., /eat/restaurant → public/eat/restaurant.html)</li>
            <li>• Makes files directly accessible to crawlers at your domain</li>
            <li>• Perfect for Lovable hosting - no server configuration needed</li>
          </ul>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-medium text-amber-900 mb-2">File Mapping Examples:</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Home page (/) → public/index.html</li>
            <li>• Category (/eat) → public/eat.html</li>
            <li>• Restaurant (/eat/restaurant-name) → public/eat/restaurant-name.html</li>
            <li>• Hotel (/stay/hotel-name) → public/stay/hotel-name.html</li>
          </ul>
        </div>

        {lastDeployment && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              {lastDeployment.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              Last Deployment Results
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Total files: {lastDeployment.stats.total}</div>
              <div>Successfully deployed: {lastDeployment.stats.deployed}</div>
              <div>Failed: {lastDeployment.stats.failed}</div>
              <div>Timestamp: {new Date(lastDeployment.stats.timestamp).toLocaleString()}</div>
              {lastDeployment.stats.publicFiles && lastDeployment.stats.publicFiles.length > 0 && (
                <div>
                  <strong>Public Files Created:</strong>
                  <div className="mt-1 max-h-32 overflow-y-auto">
                    {lastDeployment.stats.publicFiles.map((file: string, index: number) => (
                      <div key={index} className="text-xs font-mono bg-white px-2 py-1 rounded">
                        public/{file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={handlePublicDirectoryDeployment}
          disabled={isDeploying}
          className="w-full"
          size="lg"
        >
          {isDeploying ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-spin" />
              Deploying to Public Directory...
            </>
          ) : (
            <>
              <Folder className="mr-2 h-4 w-4" />
              Deploy SEO Files to Public Directory
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500">
          <strong>Next Steps After Deployment:</strong> The generated files will be logged in the console. 
          In a production environment, these files would be placed in your public directory for direct serving by Lovable hosting.
        </div>
      </CardContent>
    </Card>
  );
};
