
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactCard from './ContactCard';
import FacilityCard from './FacilityCard';

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

interface ServiceTabsProps {
  isVehicleService: boolean;
  isMaintenanceService: boolean;
  salesData: (Contact | EmergencyNumber)[];
  rentalsData: Facility[];
  repairData: (Contact | EmergencyNumber)[];
  emergencyNumbers?: EmergencyNumber[];
  facilities?: Facility[];
  contacts?: Contact[];
  hasSales: boolean;
  hasRentals: boolean;
  hasRepair: boolean;
  hasEmergencyNumbers: boolean;
  hasFacilities: boolean;
  hasContacts: boolean;
}

const ServiceTabs = ({ 
  isVehicleService, 
  isMaintenanceService,
  salesData,
  rentalsData,
  repairData,
  emergencyNumbers,
  facilities,
  contacts,
  hasSales,
  hasRentals,
  hasRepair,
  hasEmergencyNumbers,
  hasFacilities,
  hasContacts
}: ServiceTabsProps) => {
  if (isVehicleService) {
    return (
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
              {salesData.map((contact, index) => (
                <ContactCard key={index} contact={contact} />
              ))}
            </div>
          </TabsContent>
        )}

        {hasRentals && (
          <TabsContent value="rentals" className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Rentals</h3>
            <div className="grid gap-4">
              {rentalsData.map((facility, index) => (
                <FacilityCard key={index} facility={facility} />
              ))}
            </div>
          </TabsContent>
        )}

        {hasRepair && (
          <TabsContent value="repair" className="space-y-4">
            <h3 className="text-lg font-semibold">Repair Services</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {repairData.map((contact, index) => (
                <ContactCard key={index} contact={contact} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    );
  }

  if (isMaintenanceService && hasContacts) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {contacts?.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
        </div>
      </div>
    );
  }

  return (
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
            {emergencyNumbers?.map((emergency, index) => (
              <ContactCard key={index} contact={emergency} isEmergency={true} />
            ))}
          </div>
        </TabsContent>
      )}

      {hasFacilities && (
        <TabsContent value="facilities" className="space-y-4">
          <h3 className="text-lg font-semibold">Local Facilities</h3>
          <div className="grid gap-4">
            {facilities?.map((facility, index) => (
              <FacilityCard key={index} facility={facility} />
            ))}
          </div>
        </TabsContent>
      )}

      {hasContacts && (
        <TabsContent value="contacts" className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {contacts?.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ServiceTabs;
