
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Service {
  name: string;
  icon: string;
  details: string;
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

  const addService = () => {
    const newService: Service = {
      name: '',
      icon: 'Wrench',
      details: ''
    };
    updateContentData('services', [...services, newService]);
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    updateContentData('services', updatedServices);
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updatedServices = services.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    );
    updateContentData('services', updatedServices);
  };

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

        <div className="space-y-4">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Service {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`service-name-${index}`}>Service Name</Label>
                  <Input
                    id={`service-name-${index}`}
                    value={service.name}
                    onChange={(e) => updateService(index, 'name', e.target.value)}
                    placeholder="Emergency Services"
                  />
                </div>

                <div>
                  <Label htmlFor={`service-icon-${index}`}>Icon</Label>
                  <Select
                    value={service.icon}
                    onValueChange={(value) => updateService(index, 'icon', value)}
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

                <div>
                  <Label htmlFor={`service-details-${index}`}>Details</Label>
                  <Textarea
                    id={`service-details-${index}`}
                    value={service.details}
                    onChange={(e) => updateService(index, 'details', e.target.value)}
                    placeholder="Description of the service..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {services.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No services added yet.</p>
              <p className="text-sm">Click "Add Service" to create your first service.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesFields;
