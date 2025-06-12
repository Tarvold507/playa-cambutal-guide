

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
  sales?: Contact[];
  rentals?: Facility[];
  repair?: Contact[];
  hours?: string;
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail | null;
}

const ServiceDetailModal = ({ isOpen, onClose, service }: ServiceDetailModalProps) => {
  if (!service) return null;

  // Determine service type based on service name
  const isVehicleService = service.name.toLowerCase().includes('car') || 
                          service.name.toLowerCase().includes('vehicle') || 
                          service.name.toLowerCase().includes('rental') ||
                          service.name.toLowerCase().includes('transport');
  
  const isMaintenanceService = service.name.toLowerCase().includes('maintenance') ||
                              service.name.toLowerCase().includes('repair') ||
                              service.name.toLowerCase().includes('handyman');

  // For vehicle services, use new fields or map from old ones
  const salesData = service.sales || service.emergencyNumbers || [];
  const rentalsData = service.rentals || service.facilities || [];
  const repairData = service.repair || [];

  const hasEmergencyNumbers = service.emergencyNumbers && service.emergencyNumbers.length > 0;
  const hasFacilities = service.facilities && service.facilities.length > 0;
  const hasContacts = service.contacts && service.contacts.length > 0;
  const hasSales = salesData.length > 0;
  const hasRentals = rentalsData.length > 0;
  const hasRepair = repairData.length > 0;

  const handlePhoneCall = (phone: string): void => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (whatsapp: string): void => {
    window.open(`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`, '_blank');
  };

  const handleWebsite = (website: string): void => {
    window.open(website, '_blank');
  };

  const renderContactCard = (contact: Contact | EmergencyNumber, index: number, isEmergency: boolean = false): JSX.Element => (
    <Card key={index} className={isEmergency ? "bg-red-50 border-red-200" : ""}>
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
                {'number' in contact ? contact.number : 'Call'}
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

  const renderFacilityCard = (facility: Facility, index: number): JSX.Element => (
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
              {facility.services.map((service: string, serviceIndex: number): JSX.Element => (
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

          {/* Vehicle Services Tabs */}
          {isVehicleService && (
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {hasSales && <TabsTrigger value="sales">Sales</TabsTrigger>}
                {hasRentals && <TabsTrigger value="rentals">Rentals</TabsTrigger>}
                {hasRepair && <TabsTrigger value="repair">Repair</TabsTrigger>}
              </TabsList>

              {hasSales && (
                <TabsContent value="sales" className="space-y-4">
                  <h3 className="text-lg font-semibold">Sales & Dealerships</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {salesData.map((contact: Contact | EmergencyNumber, index: number): JSX.Element => renderContactCard(contact, index))}
                  </div>
                </TabsContent>
              )}

              {hasRentals && (
                <TabsContent value="rentals" className="space-y-4">
                  <h3 className="text-lg font-semibold">Vehicle Rentals</h3>
                  <div className="grid gap-4">
                    {(rentalsData as Facility[]).map((facility: Facility, index: number): JSX.Element => renderFacilityCard(facility, index))}
                  </div>
                </TabsContent>
              )}

              {hasRepair && (
                <TabsContent value="repair" className="space-y-4">
                  <h3 className="text-lg font-semibold">Repair Services</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {repairData.map((contact: Contact | EmergencyNumber, index: number): JSX.Element => renderContactCard(contact, index))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}

          {/* Maintenance Services - Contacts Only */}
          {isMaintenanceService && hasContacts && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {service.contacts?.map((contact: Contact, index: number): JSX.Element => renderContactCard(contact, index))}
              </div>
            </div>
          )}

          {/* Default Services Tabs */}
          {!isVehicleService && !isMaintenanceService && (
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
                    {service.emergencyNumbers?.map((emergency: EmergencyNumber, index: number): JSX.Element => renderContactCard(emergency, index, true))}
                  </div>
                </TabsContent>
              )}

              {hasFacilities && (
                <TabsContent value="facilities" className="space-y-4">
                  <h3 className="text-lg font-semibold">Local Facilities</h3>
                  <div className="grid gap-4">
                    {service.facilities?.map((facility: Facility, index: number): JSX.Element => renderFacilityCard(facility, index))}
                  </div>
                </TabsContent>
              )}

              {hasContacts && (
                <TabsContent value="contacts" className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {service.contacts?.map((contact: Contact, index: number): JSX.Element => renderContactCard(contact, index))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;

