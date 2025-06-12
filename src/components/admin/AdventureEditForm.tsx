
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { EditFormData } from '@/hooks/admin/types';

interface AdventureEditFormProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const AdventureEditForm = ({ editForm, onFormChange }: AdventureEditFormProps) => {
  // Handle hours field which can be string or object
  const getHoursValue = () => {
    if (typeof editForm.hours === 'string') {
      return editForm.hours;
    }
    if (typeof editForm.hours === 'object' && editForm.hours !== null) {
      // Convert object to string representation
      return Object.entries(editForm.hours)
        .map(([day, time]) => `${day}: ${time}`)
        .join(', ');
    }
    return '';
  };

  const handleHoursChange = (value: string) => {
    onFormChange({ hours: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            value={editForm.business_name || ''}
            onChange={(e) => onFormChange({ business_name: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="business_type">Business Type</Label>
          <Input
            id="business_type"
            value={editForm.business_type || ''}
            onChange={(e) => onFormChange({ business_type: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={editForm.category || ''}
            onChange={(e) => onFormChange({ category: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={editForm.location || editForm.address || ''}
            onChange={(e) => onFormChange({ location: e.target.value, address: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={editForm.description || ''}
          onChange={(e) => onFormChange({ description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={editForm.whatsapp || ''}
            onChange={(e) => onFormChange({ whatsapp: e.target.value })}
            placeholder="+507 1234-5678"
          />
        </div>

        <div>
          <Label htmlFor="hours">Hours</Label>
          <Input
            id="hours"
            value={getHoursValue()}
            onChange={(e) => handleHoursChange(e.target.value)}
            placeholder="Mon-Fri 9AM-5PM"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={editForm.website || ''}
            onChange={(e) => onFormChange({ website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={editForm.image_url || ''}
            onChange={(e) => onFormChange({ image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default AdventureEditForm;
