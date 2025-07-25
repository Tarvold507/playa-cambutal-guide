import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Download, CheckCircle, AlertCircle, ExternalLink, Trash2, Search } from 'lucide-react';
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
  search_type?: string;
}

interface CleanupResult {
  success: boolean;
  deleted: number;
  message?: string;
  error?: string;
  details?: string;
}

const GooglePlacesImport: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
  const { toast } = useToast();

  const handleCleanup = async () => {
    setCleaning(true);
    setCleanupResult(null);

    try {
      console.log('Starting restaurant data cleanup...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to clean restaurant data');
      }

      const { data, error } = await supabase.functions.invoke('clean-restaurant-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Cleanup completed:', data);
      setCleanupResult(data);

      if (data.success) {
        toast({
          title: "Cleanup Completed",
          description: `Successfully deleted ${data.deleted} unapproved restaurant listings.`,
        });
      } else {
        toast({
          title: "Cleanup Failed",
          description: data.details || data.error || "Failed to clean restaurant data.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Cleanup failed:', error);
      const errorResult = {
        success: false,
        deleted: 0,
        error: 'Cleanup failed',
        details: error.message || 'An unexpected error occurred while cleaning restaurant data.'
      };
      setCleanupResult(errorResult);
      
      toast({
        title: "Cleanup Failed",
        description: error.message || "Failed to clean restaurant data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCleaning(false);
    }
  };

  const handleImport = async (searchByName = false) => {
    setImporting(true);
    setImportResult(null);

    try {
      console.log('Starting Google Places import...', { searchByName, restaurantName });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to import restaurants');
      }

      const requestBody = searchByName && restaurantName 
        ? { restaurantName: restaurantName.trim() }
        : {};

      const { data, error } = await supabase.functions.invoke('fetch-google-restaurants', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: requestBody,
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
      <CardContent className="space-y-6">
        <p className="text-gray-600">
          Import restaurants from Google Places for Cambutal, Panama. You can either import all restaurants in the area or search for a specific restaurant by name.
        </p>

        {/* Restaurant Name Search */}
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
          <Label htmlFor="restaurant-name" className="text-sm font-medium">
            Search for Specific Restaurant (Optional)
          </Label>
          <div className="flex gap-2">
            <Input
              id="restaurant-name"
              placeholder="Enter restaurant name (e.g., 'Villa Cambutal')"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleImport(true)}
              disabled={importing || !restaurantName.trim()}
              variant="outline"
            >
              <Search className="w-4 h-4 mr-2" />
              {importing ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <p className="text-xs text-blue-700">
            Enter a restaurant name to search specifically for that establishment in the Cambutal area.
          </p>
        </div>

        {/* Main Import Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleCleanup}
            disabled={cleaning}
            variant="outline"
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {cleaning ? 'Cleaning Database...' : 'Clean Database'}
          </Button>

          <Button 
            onClick={() => handleImport(false)}
            disabled={importing}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {importing ? 'Importing Restaurants...' : 'Import All Restaurants'}
          </Button>
        </div>

        {cleanupResult && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              {cleanupResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    Cleanup Completed!
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">
                    Cleanup Failed
                  </span>
                </>
              )}
            </div>

            {cleanupResult.success ? (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  {cleanupResult.message}
                </p>
              </div>
            ) : (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  {cleanupResult.error || 'Cleanup failed'}
                </p>
                {cleanupResult.details && (
                  <p className="text-xs text-red-700 mt-1">
                    {cleanupResult.details}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {importResult && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              {importResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    Import Completed!
                  </span>
                  {importResult.search_type === 'name_based' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Name Search
                    </span>
                  )}
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
          <p>Use "Clean Database" to remove all unapproved imported restaurants before importing fresh data.</p>
          <p>Make sure your Google Places API key allows server-side requests without HTTP referrer restrictions.</p>
          <p>For specific restaurant searches, try variations of the name if initial search doesn't find results.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GooglePlacesImport;
