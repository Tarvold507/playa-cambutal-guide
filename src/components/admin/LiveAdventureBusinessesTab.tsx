
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

interface LiveAdventureBusinessesTabProps {
  liveAdventureBusinesses: any[];
  onEdit: (item: any) => void;
}

const LiveAdventureBusinessesTab = ({ liveAdventureBusinesses, onEdit }: LiveAdventureBusinessesTabProps) => {
  if (liveAdventureBusinesses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No live adventure business listings.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {liveAdventureBusinesses.map((business) => (
        <Card key={business.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {business.business_name}
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Live
                  </Badge>
                  <Badge variant="secondary">{business.category}</Badge>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{business.address || business.location}</span>
                </div>
                <div className="text-sm font-medium text-venao-dark mt-1">
                  {business.business_type}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(business)}
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
                <p className="text-gray-700 mb-4">{business.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  {business.whatsapp && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>WhatsApp: {business.whatsapp}</span>
                    </div>
                  )}
                  {business.hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Hours: {business.hours}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Business Type:</span> {business.business_type}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {business.category}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(business.created_at).toLocaleDateString()}
                  </div>
                  {business.approved_at && (
                    <div>
                      <span className="font-medium">Approved:</span> {new Date(business.approved_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {business.website && (
                  <div className="mt-4">
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-venao-dark hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              
              <div>
                {business.image_url && (
                  <img 
                    src={business.image_url} 
                    alt={business.business_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {business.profiles && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Submitted by:</span> {business.profiles.name} ({business.profiles.email})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveAdventureBusinessesTab;
