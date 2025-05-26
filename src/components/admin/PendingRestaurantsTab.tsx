
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Edit, MapPin, Phone, Clock } from 'lucide-react';

interface PendingRestaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  image_url?: string;
  hours: any;
  gallery_images: string[];
  menu_images: string[];
  created_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

interface PendingRestaurantsTabProps {
  pendingRestaurants: PendingRestaurant[];
  onApprove: (id: string) => void;
  onEdit: (restaurant: PendingRestaurant) => void;
  onReject: (id: string) => void;
}

const PendingRestaurantsTab: React.FC<PendingRestaurantsTabProps> = ({
  pendingRestaurants,
  onApprove,
  onEdit,
  onReject,
}) => {
  if (pendingRestaurants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No pending restaurant listings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRestaurants.map((restaurant) => (
        <Card key={restaurant.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <Badge variant="outline">{restaurant.category}</Badge>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.address}</span>
                  </div>
                  {restaurant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted by: {restaurant.profiles?.name} ({restaurant.profiles?.email})
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(restaurant.created_at).toLocaleDateString()}
                </p>
              </div>
              {restaurant.image_url && (
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-24 h-24 object-cover rounded-lg ml-4"
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {restaurant.description && (
              <p className="text-gray-700 mb-4">{restaurant.description}</p>
            )}
            
            {/* Hours Display */}
            {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Hours:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(restaurant.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span>{day}:</span>
                      <span>{hours || 'Closed'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Images */}
            {restaurant.gallery_images && restaurant.gallery_images.length > 0 && (
              <div className="mb-4">
                <p className="font-medium mb-2">Gallery Images ({restaurant.gallery_images.length}):</p>
                <div className="flex gap-2 overflow-x-auto">
                  {restaurant.gallery_images.slice(0, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  ))}
                  {restaurant.gallery_images.length > 5 && (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                      +{restaurant.gallery_images.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu Images */}
            {restaurant.menu_images && restaurant.menu_images.length > 0 && (
              <div className="mb-4">
                <p className="font-medium mb-2">Menu Images ({restaurant.menu_images.length}):</p>
                <div className="flex gap-2 overflow-x-auto">
                  {restaurant.menu_images.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Menu ${index + 1}`}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  ))}
                  {restaurant.menu_images.length > 3 && (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                      +{restaurant.menu_images.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => onApprove(restaurant.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => onEdit(restaurant)}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => onReject(restaurant.id)}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingRestaurantsTab;
