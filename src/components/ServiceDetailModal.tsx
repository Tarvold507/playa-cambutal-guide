
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import ServiceTabs from './service-detail/ServiceTabs';

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

          <ServiceTabs
            isVehicleService={isVehicleService}
            isMaintenanceService={isMaintenanceService}
            salesData={salesData}
            rentalsData={rentalsData}
            repairData={repairData}
            emergencyNumbers={service.emergencyNumbers}
            facilities={service.facilities}
            contacts={service.contacts}
            hasSales={hasSales}
            hasRentals={hasRentals}
            hasRepair={hasRepair}
            hasEmergencyNumbers={hasEmergencyNumbers}
            hasFacilities={hasFacilities}
            hasContacts={hasContacts}
          />

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
