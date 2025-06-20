
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useSEOProxy } from '@/hooks/seo/useSEOProxy';
import { Globe, TestTube2, CheckCircle, AlertCircle, Bot } from 'lucide-react';

interface SEOProxyControlsProps {
  onRefresh: () => void;
}

export const SEOProxyControls = ({ onRefresh }: SEOProxyControlsProps) => {
  const { testSEOProxy, verifySEOProxy, isTestingProxy } = useSEOProxy();
  const { toast } = useToast();
  const [testPath, setTestPath] = useState('/');
  const [lastTest, setLastTest] = useState<any>(null);

  const handleTestProxy = async () => {
    try {
      console.log('🧪 Testing SEO Proxy for path:', testPath);
      
      const result = await testSEOProxy(testPath);
      setLastTest(result);

      if (result.success) {
        toast({
          title: 'SEO Proxy Test Successful',
          description: `The SEO proxy is working correctly for ${testPath}. Check console for details.`,
        });
      } else {
        toast({
          title: 'SEO Proxy Test Failed',
          description: result.error || 'Unknown error occurred during testing.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('SEO Proxy test error:', error);
      toast({
        title: 'Test Error',
        description: 'Failed to test SEO proxy. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyProxy = async () => {
    try {
      console.log('🔍 Running comprehensive SEO Proxy verification...');
      
      const result = await verifySEOProxy();
      setLastTest(result);

      if (result.success) {
        toast({
          title: 'SEO Proxy Verification Complete',
          description: result.summary || 'All paths are working correctly.',
        });
      } else {
        toast({
          title: 'SEO Proxy Verification Issues',
          description: result.error || 'Some paths may not be working correctly.',
          variant: 'destructive',
        });
      }

      onRefresh();
    } catch (error) {
      console.error('SEO Proxy verification error:', error);
      toast({
        title: 'Verification Error',
        description: 'Failed to verify SEO proxy. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          SEO Proxy for Crawlers (Active Solution)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">How This Works:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Automatically detects search engine crawlers (Google, Bing, etc.)</li>
            <li>• Serves optimized SEO content to crawlers</li>
            <li>• Serves regular React app to human users</li>
            <li>• No manual file management needed</li>
            <li>• Updates automatically when SEO data changes</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Supported Crawlers:</h4>
          <div className="text-sm text-blue-800 grid grid-cols-2 gap-1">
            <div>• Googlebot</div>
            <div>• Bingbot</div>
            <div>• Screaming Frog</div>
            <div>• FacebookBot</div>
            <div>• TwitterBot</div>
            <div>• LinkedInBot</div>
            <div>• SEMrush</div>
            <div>• Ahrefs</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Test SEO Proxy</h4>
          <div className="flex gap-2">
            <Input
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              placeholder="/path/to/test"
              className="flex-1"
            />
            <Button
              onClick={handleTestProxy}
              disabled={isTestingProxy}
              variant="outline"
            >
              {isTestingProxy ? (
                <>
                  <TestTube2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube2 className="mr-2 h-4 w-4" />
                  Test Path
                </>
              )}
            </Button>
          </div>
        </div>

        {lastTest && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              {lastTest.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              Last Test Results
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Status: {lastTest.success ? 'Success' : 'Failed'}</div>
              {lastTest.summary && <div>Summary: {lastTest.summary}</div>}
              {lastTest.error && <div>Error: {lastTest.error}</div>}
            </div>
          </div>
        )}

        <Button
          onClick={handleVerifyProxy}
          disabled={isTestingProxy}
          className="w-full"
          size="lg"
        >
          {isTestingProxy ? (
            <>
              <Globe className="mr-2 h-4 w-4 animate-spin" />
              Verifying SEO Proxy...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Verify SEO Proxy for All Pages
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500">
          <strong>For Testing:</strong> Use the test button to simulate how crawlers will see your pages. 
          The verification will test multiple page types to ensure everything is working correctly.
        </div>
      </CardContent>
    </Card>
  );
};
