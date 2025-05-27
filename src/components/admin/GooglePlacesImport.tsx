
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImportResult {
  success: boolean;
  imported: number;
  restaurants: Array<{
    name: string;
    id: string;
    status: string;
  }>;
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
      
      const { data, error } = await supabase.functions.invoke('fetch-google-restaurants');

      if (error) {
        throw error;
      }

      console.log('Import completed:', data);
      setImportResult(data);

      toast({
        title: "Import Completed",
        description: `Successfully imported ${data.imported} restaurants from Google Places.`,
      });

    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import restaurants from Google Places. Please try again.",
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
                    Import Successful!
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

            {importResult.success && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  Imported {importResult.imported} restaurants. They are pending approval in the admin dashboard.
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
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Note: Imported restaurants will require admin approval before appearing on the website.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GooglePlacesImport;
