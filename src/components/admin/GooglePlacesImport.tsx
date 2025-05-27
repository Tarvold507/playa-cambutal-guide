
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Download, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImportResult {
  success: boolean;
  imported: number;
  total_found?: number;
  processed?: number;
  restaurants: Array<{
    name: string;
    id: string;
    status: string;
  }>;
  message?: string;
  error?: string;
  details?: string;
  help?: string;
}

const GooglePlacesImport: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const handleImport = async () => {
    setImporting(true);
    setImportResult(null);

    try {
      console.log('Starting Google Places import...');
      
      // Get the current session to include auth headers
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to import restaurants');
      }

      const { data, error } = await supabase.functions.invoke('fetch-google-restaurants', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Import completed:', data);
      setImportResult(data);

      if (data.success && data.imported > 0) {
        toast({
          title: "Import Completed",
          description: `Successfully imported ${data.imported} restaurants from Google Places.`,
        });
      } else if (data.success && data.imported === 0) {
        toast({
          title: "Import Completed",
          description: data.details || data.message || "No new restaurants were imported.",
          variant: "default",
        });
      } else {
        toast({
          title: "Import Failed",
          description: data.details || data.error || "Failed to import restaurants from Google Places.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Import failed:', error);
      const errorResult = {
        success: false,
        imported: 0,
        restaurants: [],
        error: 'Import failed',
        details: error.message || 'An unexpected error occurred while importing restaurants.'
      };
      setImportResult(errorResult);
      
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import restaurants from Google Places. Please check the configuration and try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Google Places Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Import restaurants from Google Places for Cambutal, Panama. This will fetch real restaurant data including photos, contact information, and hours.
        </p>

        <Button 
          onClick={handleImport}
          disabled={importing}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {importing ? 'Importing Restaurants...' : 'Import from Google Places'}
        </Button>

        {importResult && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              {importResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    Import Completed!
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">
                    Import Failed
                  </span>
                </>
              )}
            </div>

            {importResult.success ? (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  Imported {importResult.imported} restaurants from {importResult.total_found || 0} found. 
                  {importResult.imported > 0 ? ' They are pending approval in the admin dashboard.' : ''}
                </p>
                {importResult.restaurants.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-green-700 font-medium">Imported restaurants:</p>
                    <ul className="text-xs text-green-700 mt-1">
                      {importResult.restaurants.map((restaurant) => (
                        <li key={restaurant.id}>• {restaurant.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {importResult.details && (
                  <p className="text-xs text-green-700 mt-2">{importResult.details}</p>
                )}
                {importResult.message && (
                  <p className="text-xs text-green-700 mt-2">{importResult.message}</p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  {importResult.error || 'Import failed'}
                </p>
                {importResult.details && (
                  <p className="text-xs text-red-700 mt-1">
                    {importResult.details}
                  </p>
                )}
                {importResult.help && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      <strong>Solution:</strong> {importResult.help}
                    </p>
                    <a 
                      href="https://console.cloud.google.com/apis/credentials" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mt-1"
                    >
                      Open Google Cloud Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>Note: Imported restaurants will require admin approval before appearing on the website.</p>
          <p>Make sure your Google Places API key allows server-side requests without HTTP referrer restrictions.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GooglePlacesImport;
