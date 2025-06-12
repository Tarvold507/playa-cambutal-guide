
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MessageCircle, MapPin, Clock, ExternalLink } from 'lucide-react';

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

interface Facility {
  name: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;
  services?: string[];
  description?: string;
}

interface ServiceDetail {
  name: string;
  icon: string;
  details: string;
  fullDescription?: string;
  contacts?: Contact[];
  emergencyNumbers?: EmergencyNumber[];
  facilities?: Facility[];
  hours?: string;
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail | null;
}

const ServiceDetailModal = ({ isOpen, onClose, service }: ServiceDetailModalProps) => {
  if (!service) return null;

  const hasEmergencyNumbers = service.emergencyNumbers && service.emergencyNumbers.length > 0;
  const hasFacilities = service.facilities && service.facilities.length > 0;
  const hasContacts = service.contacts && service.contacts.length > 0;

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`, '_blank');
  };

  const handleWebsite = (website: string) => {
    window.open(website, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{service.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {service.fullDescription && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About This Service</h3>
              <p className="text-gray-600">{service.fullDescription}</p>
            </div>
          )}

          {service.hours && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hours
              </h3>
              <p className="text-gray-600">{service.hours}</p>
            </div>
          )}

          <Tabs defaultValue="emergency" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {hasEmergencyNumbers && <TabsTrigger value="emergency">Emergency Numbers</TabsTrigger>}
              {hasFacilities && <TabsTrigger value="facilities">Facilities</TabsTrigger>}
              {hasContacts && <TabsTrigger value="contacts">Contacts</TabsTrigger>}
            </TabsList>

            {hasEmergencyNumbers && (
              <TabsContent value="emergency" className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact Numbers</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {service.emergencyNumbers?.map((emergency, index) => (
                    <Card key={index} className="bg-red-50 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-red-800">{emergency.name}</h4>
                            {emergency.description && (
                              <p className="text-sm text-red-600 mt-1">{emergency.description}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handlePhoneCall(emergency.number)}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            {emergency.number}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}

            {hasFacilities && (
              <TabsContent value="facilities" className="space-y-4">
                <h3 className="text-lg font-semibold">Local Facilities</h3>
                <div className="grid gap-4">
                  {service.facilities?.map((facility, index) => (
                    <Card key={index}>
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
                              {facility.services.map((service, serviceIndex) => (
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
                  ))}
                </div>
              </TabsContent>
            )}

            {hasContacts && (
              <TabsContent value="contacts" className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {service.contacts?.map((contact, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.type}</p>
                          {contact.description && (
                            <p className="text-sm text-gray-600">{contact.description}</p>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            {contact.phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePhoneCall(contact.phone!)}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </Button>
                            )}
                            {contact.whatsapp && (
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
                            {contact.website && (
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
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
