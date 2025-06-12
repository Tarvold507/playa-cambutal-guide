
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';

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

interface Service {
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

interface ServicesFieldsProps {
  contentData: any;
  updateContentData: (field: string, value: any) => void;
}

const AVAILABLE_ICONS = [
  'Stethoscope',
  'Waves', 
  'Car',
  'ShieldCheck',
  'School',
  'Wrench'
];

const ServicesFields = ({ contentData, updateContentData }: ServicesFieldsProps) => {
  const services: Service[] = contentData.services || [];
  const title = contentData.title || '';
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  const addService = () => {
    const newService: Service = {
      name: '',
      icon: 'Wrench',
      details: '',
      fullDescription: '',
      contacts: [],
      emergencyNumbers: [],
      facilities: [],
      sales: [],
      rentals: [],
      repair: [],
      hours: ''
    };
    updateContentData('services', [...services, newService]);
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    updateContentData('services', updatedServices);
    if (selectedServiceIndex >= updatedServices.length) {
      setSelectedServiceIndex(Math.max(0, updatedServices.length - 1));
    }
  };

  const updateService = (index: number, field: keyof Service, value: any) => {
    const updatedServices = services.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    );
    updateContentData('services', updatedServices);
  };

  // Determine service type
  const getServiceType = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('car') || name.includes('vehicle') || name.includes('rental') || name.includes('transport')) {
      return 'vehicle';
    }
    if (name.includes('maintenance') || name.includes('repair') || name.includes('handyman')) {
      return 'maintenance';
    }
    return 'default';
  };

  // Contact management functions
  const addContact = (serviceIndex: number, fieldName: 'contacts' | 'sales' | 'repair') => {
    const service = services[serviceIndex];
    const newContact: Contact = {
      name: '',
      type: '',
      description: ''
    };
    const updatedContacts = [...(service[fieldName] || []), newContact];
    updateService(serviceIndex, fieldName, updatedContacts);
  };

  const removeContact = (serviceIndex: number, contactIndex: number, fieldName: 'contacts' | 'sales' | 'repair') => {
    const service = services[serviceIndex];
    const updatedContacts = (service[fieldName] || []).filter((_, i) => i !== contactIndex);
    updateService(serviceIndex, fieldName, updatedContacts);
  };

  const updateContact = (serviceIndex: number, contactIndex: number, field: keyof Contact, value: string, fieldName: 'contacts' | 'sales' | 'repair') => {
    const service = services[serviceIndex];
    const updatedContacts = (service[fieldName] || []).map((contact, i) =>
      i === contactIndex ? { ...contact, [field]: value } : contact
    );
    updateService(serviceIndex, fieldName, updatedContacts);
  };

  // Emergency number management functions
  const addEmergencyNumber = (serviceIndex: number) => {
    const service = services[serviceIndex];
    const newEmergency: EmergencyNumber = {
      name: '',
      number: '',
      description: ''
    };
    const updatedNumbers = [...(service.emergencyNumbers || []), newEmergency];
    updateService(serviceIndex, 'emergencyNumbers', updatedNumbers);
  };

  const removeEmergencyNumber = (serviceIndex: number, emergencyIndex: number) => {
    const service = services[serviceIndex];
    const updatedNumbers = (service.emergencyNumbers || []).filter((_, i) => i !== emergencyIndex);
    updateService(serviceIndex, 'emergencyNumbers', updatedNumbers);
  };

  const updateEmergencyNumber = (serviceIndex: number, emergencyIndex: number, field: keyof EmergencyNumber, value: string) => {
    const service = services[serviceIndex];
    const updatedNumbers = (service.emergencyNumbers || []).map((emergency, i) =>
      i === emergencyIndex ? { ...emergency, [field]: value } : emergency
    );
    updateService(serviceIndex, 'emergencyNumbers', updatedNumbers);
  };

  // Facility management functions
  const addFacility = (serviceIndex: number, fieldName: 'facilities' | 'rentals') => {
    const service = services[serviceIndex];
    const newFacility: Facility = {
      name: '',
      description: '',
      services: []
    };
    const updatedFacilities = [...(service[fieldName] || []), newFacility];
    updateService(serviceIndex, fieldName, updatedFacilities);
  };

  const removeFacility = (serviceIndex: number, facilityIndex: number, fieldName: 'facilities' | 'rentals') => {
    const service = services[serviceIndex];
    const updatedFacilities = (service[fieldName] || []).filter((_, i) => i !== facilityIndex);
    updateService(serviceIndex, fieldName, updatedFacilities);
  };

  const updateFacility = (serviceIndex: number, facilityIndex: number, field: keyof Facility, value: any, fieldName: 'facilities' | 'rentals') => {
    const service = services[serviceIndex];
    const updatedFacilities = (service[fieldName] || []).map((facility, i) =>
      i === facilityIndex ? { ...facility, [field]: value } : facility
    );
    updateService(serviceIndex, fieldName, updatedFacilities);
  };

  const selectedService = services[selectedServiceIndex];
  const serviceType = selectedService ? getServiceType(selectedService.name) : 'default';

  const renderContactSection = (fieldName: 'contacts' | 'sales' | 'repair', title: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Button
          type="button"
          size="sm"
          onClick={() => addContact(selectedServiceIndex, fieldName)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Contact
        </Button>
      </div>
      
      {selectedService[fieldName]?.map((contact, contactIndex) => (
        <Card key={contactIndex} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium">Contact {contactIndex + 1}</h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeContact(selectedServiceIndex, contactIndex, fieldName)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Contact Name"
              value={contact.name}
              onChange={(e) => updateContact(selectedServiceIndex, contactIndex, 'name', e.target.value, fieldName)}
            />
            <Input
              placeholder="Type (e.g., Dealership, Mechanic)"
              value={contact.type}
              onChange={(e) => updateContact(selectedServiceIndex, contactIndex, 'type', e.target.value, fieldName)}
            />
            <Input
              placeholder="Phone"
              value={contact.phone || ''}
              onChange={(e) => updateContact(selectedServiceIndex, contactIndex, 'phone', e.target.value, fieldName)}
            />
            <Input
              placeholder="WhatsApp"
              value={contact.whatsapp || ''}
              onChange={(e) => updateContact(selectedServiceIndex, contactIndex, 'whatsapp', e.target.value, fieldName)}
            />
            <Input
              placeholder="Email"
              value={contact.email || ''}
              onChange={(e) => updateContact(selectedServiceIndex, contactIndex, 'email', e.target.value, fieldName)}
            />
            <Input
              placeholder="Website"
              value={contact.website || ''}
              onChange={(e) => updateContact(selectedServiceIndex, contactIndex, 'website', e.target.value, fieldName)}
            />
          </div>
          <Textarea
            placeholder="Description"
            value={contact.description || ''}
            onChange={(e) => updateContact(selectedServiceIndex, contactIndex, 'description', e.target.value, fieldName)}
            rows={2}
            className="mt-3"
          />
        </Card>
      ))}
    </div>
  );

  const renderFacilitySection = (fieldName: 'facilities' | 'rentals', title: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Button
          type="button"
          size="sm"
          onClick={() => addFacility(selectedServiceIndex, fieldName)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Facility
        </Button>
      </div>
      
      {selectedService[fieldName]?.map((facility, facilityIndex) => (
        <Card key={facilityIndex} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium">Facility {facilityIndex + 1}</h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeFacility(selectedServiceIndex, facilityIndex, fieldName)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Facility Name"
              value={facility.name}
              onChange={(e) => updateFacility(selectedServiceIndex, facilityIndex, 'name', e.target.value, fieldName)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Address"
                value={facility.address || ''}
                onChange={(e) => updateFacility(selectedServiceIndex, facilityIndex, 'address', e.target.value, fieldName)}
              />
              <Input
                placeholder="Phone"
                value={facility.phone || ''}
                onChange={(e) => updateFacility(selectedServiceIndex, facilityIndex, 'phone', e.target.value, fieldName)}
              />
              <Input
                placeholder="WhatsApp"
                value={facility.whatsapp || ''}
                onChange={(e) => updateFacility(selectedServiceIndex, facilityIndex, 'whatsapp', e.target.value, fieldName)}
              />
              <Input
                placeholder="Hours"
                value={facility.hours || ''}
                onChange={(e) => updateFacility(selectedServiceIndex, facilityIndex, 'hours', e.target.value, fieldName)}
              />
            </div>
            <Textarea
              placeholder="Description"
              value={facility.description || ''}
              onChange={(e) => updateFacility(selectedServiceIndex, facilityIndex, 'description', e.target.value, fieldName)}
              rows={2}
            />
            <Textarea
              placeholder="Services offered (one per line)"
              value={facility.services?.join('\n') || ''}
              onChange={(e) => updateFacility(selectedServiceIndex, facilityIndex, 'services', e.target.value.split('\n').filter(s => s.trim()), fieldName)}
              rows={3}
            />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="services-title">Section Title</Label>
        <Input
          id="services-title"
          value={title}
          onChange={(e) => updateContentData('title', e.target.value)}
          placeholder="Local Services"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Services</Label>
          <Button type="button" onClick={addService} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No services added yet.</p>
            <p className="text-sm">Click "Add Service" to create your first service.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Service List */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold mb-3">Select Service</h3>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <Button
                    key={index}
                    variant={selectedServiceIndex === index ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedServiceIndex(index)}
                  >
                    {service.name || `Service ${index + 1}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Service Details */}
            <div className="lg:col-span-3">
              {selectedService && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Edit Service</CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeService(selectedServiceIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Basic Service Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Service Name</Label>
                        <Input
                          value={selectedService.name}
                          onChange={(e) => updateService(selectedServiceIndex, 'name', e.target.value)}
                          placeholder="Emergency Services"
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Select
                          value={selectedService.icon}
                          onValueChange={(value) => updateService(selectedServiceIndex, 'icon', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_ICONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {icon}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Brief Description</Label>
                      <Textarea
                        value={selectedService.details}
                        onChange={(e) => updateService(selectedServiceIndex, 'details', e.target.value)}
                        placeholder="Short description for the card..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Full Description</Label>
                      <Textarea
                        value={selectedService.fullDescription || ''}
                        onChange={(e) => updateService(selectedServiceIndex, 'fullDescription', e.target.value)}
                        placeholder="Detailed description for the modal..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Hours</Label>
                      <Input
                        value={selectedService.hours || ''}
                        onChange={(e) => updateService(selectedServiceIndex, 'hours', e.target.value)}
                        placeholder="Monday-Friday 9:00 AM - 5:00 PM"
                      />
                    </div>

                    {/* Dynamic Tabs based on service type */}
                    {serviceType === 'vehicle' && (
                      <Tabs defaultValue="sales" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="sales">Sales</TabsTrigger>
                          <TabsTrigger value="rentals">Rentals</TabsTrigger>
                          <TabsTrigger value="repair">Repair</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sales" className="space-y-4">
                          {renderContactSection('sales', 'Sales & Dealerships')}
                        </TabsContent>

                        <TabsContent value="rentals" className="space-y-4">
                          {renderFacilitySection('rentals', 'Rental Companies')}
                        </TabsContent>

                        <TabsContent value="repair" className="space-y-4">
                          {renderContactSection('repair', 'Repair Services')}
                        </TabsContent>
                      </Tabs>
                    )}

                    {serviceType === 'maintenance' && (
                      <div className="space-y-4">
                        {renderContactSection('contacts', 'Contact Information')}
                      </div>
                    )}

                    {serviceType === 'default' && (
                      <Tabs defaultValue="contacts" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="contacts">Contacts</TabsTrigger>
                          <TabsTrigger value="emergency">Emergency Numbers</TabsTrigger>
                          <TabsTrigger value="facilities">Facilities</TabsTrigger>
                        </TabsList>

                        <TabsContent value="contacts" className="space-y-4">
                          {renderContactSection('contacts', 'Contact Information')}
                        </TabsContent>

                        <TabsContent value="emergency" className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Emergency Numbers</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addEmergencyNumber(selectedServiceIndex)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Number
                            </Button>
                          </div>
                          
                          {selectedService.emergencyNumbers?.map((emergency, emergencyIndex) => (
                            <Card key={emergencyIndex} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium">Emergency {emergencyIndex + 1}</h5>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeEmergencyNumber(selectedServiceIndex, emergencyIndex)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  placeholder="Emergency Service Name"
                                  value={emergency.name}
                                  onChange={(e) => updateEmergencyNumber(selectedServiceIndex, emergencyIndex, 'name', e.target.value)}
                                />
                                <Input
                                  placeholder="Phone Number"
                                  value={emergency.number}
                                  onChange={(e) => updateEmergencyNumber(selectedServiceIndex, emergencyIndex, 'number', e.target.value)}
                                />
                              </div>
                              <Textarea
                                placeholder="Description"
                                value={emergency.description || ''}
                                onChange={(e) => updateEmergencyNumber(selectedServiceIndex, emergencyIndex, 'description', e.target.value)}
                                rows={2}
                                className="mt-3"
                              />
                            </Card>
                          ))}
                        </TabsContent>

                        <TabsContent value="facilities" className="space-y-4">
                          {renderFacilitySection('facilities', 'Facilities')}
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesFields;
