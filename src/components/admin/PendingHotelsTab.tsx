
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Check, X, MapPin, Star, ExternalLink } from 'lucide-react';

interface PendingHotelsTabProps {
  pendingHotels: any[];
  onApprove: (id: string) => void;
  onEdit: (item: any) => void;
  onReject: (id: string) => void;
}

const PendingHotelsTab = ({ pendingHotels, onApprove, onEdit, onReject }: PendingHotelsTabProps) => {
  if (pendingHotels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No pending hotel listings.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {pendingHotels.map((hotel) => (
        <Card key={hotel.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {hotel.name}
                  <Badge variant="secondary">{hotel.category}</Badge>
                  {hotel.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{hotel.rating}</span>
                    </div>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.address}</span>
                </div>
                {hotel.price_from && (
                  <div className="text-lg font-semibold text-venao-dark mt-2">
                    From ${hotel.price_from}/{hotel.currency || 'USD'} per night
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(hotel)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => onApprove(hotel.id)}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => onReject(hotel.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <p className="text-gray-700 mb-4">{hotel.description}</p>
                
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Commission Rate:</span> {hotel.commission_rate}%
                  </div>
                  <div>
                    <span className="font-medium">Reviews:</span> {hotel.review_count || 0}
                  </div>
                  <div>
                    <span className="font-medium">Expedia ID:</span> {hotel.expedia_hotel_id || 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(hotel.created_at).toLocaleDateString()}
                  </div>
                </div>

                {hotel.affiliate_url && (
                  <div className="mt-4">
                    <a 
                      href={hotel.affiliate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-venao-dark hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Expedia Listing
                    </a>
                  </div>
                )}
              </div>
              
              <div>
                {hotel.image_url && (
                  <img 
                    src={hotel.image_url} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {hotel.profiles && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Submitted by:</span> {hotel.profiles.name} ({hotel.profiles.email})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingHotelsTab;
