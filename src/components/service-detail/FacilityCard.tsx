
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react';

interface Facility {
  name: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;
  services?: string[];
  description?: string;
}

interface FacilityCardProps {
  facility: Facility;
}

const FacilityCard = ({ facility }: FacilityCardProps) => {
  const handlePhoneCall = (phone: string): void => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (whatsapp: string): void => {
    window.open(`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{facility.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {facility.description && (
          <p className="text-gray-600">{facility.description}</p>
        )}
        
        {facility.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{facility.address}</span>
          </div>
        )}

        {facility.hours && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>{facility.hours}</span>
          </div>
        )}

        {facility.services && facility.services.length > 0 && (
          <div>
            <h5 className="font-medium mb-2">Services:</h5>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {facility.services.map((service: string, serviceIndex: number) => (
                <li key={serviceIndex}>{service}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {facility.phone && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePhoneCall(facility.phone!)}
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
          )}
          {facility.whatsapp && (
            <Button
              size="sm"
              variant="outline"
              className="text-green-600"
              onClick={() => handleWhatsApp(facility.whatsapp!)}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityCard;
