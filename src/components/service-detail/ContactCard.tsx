
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, ExternalLink } from 'lucide-react';

interface Contact {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  type: string;
  description?: string;
}

interface EmergencyNumber {
  name: string;
  number: string;
  description?: string;
}

interface ContactCardProps {
  contact: Contact | EmergencyNumber;
  isEmergency?: boolean;
}

const ContactCard = ({ contact, isEmergency = false }: ContactCardProps) => {
  const handlePhoneCall = (phone: string): void => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (whatsapp: string): void => {
    window.open(`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`, '_blank');
  };

  const handleWebsite = (website: string): void => {
    window.open(website, '_blank');
  };

  return (
    <Card className={isEmergency ? "bg-red-50 border-red-200" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-semibold ${isEmergency ? 'text-red-800' : ''}`}>{contact.name}</h4>
            {'type' in contact && contact.type && (
              <p className={`text-sm mt-1 ${isEmergency ? 'text-red-600' : 'text-gray-600'}`}>{contact.type}</p>
            )}
            {contact.description && (
              <p className={`text-sm mt-1 ${isEmergency ? 'text-red-600' : 'text-gray-600'}`}>{contact.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {('phone' in contact && contact.phone) && (
              <Button
                size="sm"
                className={isEmergency ? "bg-red-600 hover:bg-red-700" : ""}
                variant={isEmergency ? "default" : "outline"}
                onClick={() => handlePhoneCall(contact.phone!)}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            )}
            {('number' in contact && contact.number) && (
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handlePhoneCall(contact.number)}
              >
                <Phone className="w-4 h-4 mr-1" />
                {contact.number}
              </Button>
            )}
            {'whatsapp' in contact && contact.whatsapp && (
              <Button
                size="sm"
                variant="outline"
                className="text-green-600"
                onClick={() => handleWhatsApp(contact.whatsapp!)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            )}
            {'website' in contact && contact.website && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleWebsite(contact.website!)}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Website
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
