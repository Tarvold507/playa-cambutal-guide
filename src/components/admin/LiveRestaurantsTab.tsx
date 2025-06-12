
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Clock, Phone, Globe, MessageCircle } from 'lucide-react';

interface LiveRestaurantsTabProps {
  liveRestaurants: any[];
  onEdit: (item: any) => void;
}

const LiveRestaurantsTab = ({ liveRestaurants, onEdit }: LiveRestaurantsTabProps) => {
  if (liveRestaurants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No live restaurant listings.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {liveRestaurants.map((restaurant) => (
        <Card key={restaurant.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {restaurant.name}
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Live
                  </Badge>
                  <Badge variant="secondary">{restaurant.category}</Badge>
                  {restaurant.closed_for_season && (
                    <Badge variant="destructive">Closed for Season</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(restaurant)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <p className="text-gray-700 mb-4">{restaurant.description}</p>
                
                {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hours of Operation:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(restaurant.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}:</span>
                          <span className="text-gray-600">{hours as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {restaurant.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                  {restaurant.whatsapp && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{restaurant.whatsapp}</span>
                    </div>
                  )}
                  {restaurant.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={restaurant.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-venao-dark hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Created:</span> {new Date(restaurant.created_at).toLocaleDateString()}
                  </div>
                </div>

                {restaurant.gallery_images && restaurant.gallery_images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Gallery ({restaurant.gallery_images.length} images)</h4>
                  </div>
                )}

                {restaurant.menu_images && restaurant.menu_images.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium mb-2">Menu Images ({restaurant.menu_images.length} images)</h4>
                  </div>
                )}
              </div>
              
              <div>
                {restaurant.image_url && (
                  <img 
                    src={restaurant.image_url} 
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {restaurant.profiles && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Submitted by:</span> {restaurant.profiles.name} ({restaurant.profiles.email})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveRestaurantsTab;
