
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { EditFormData } from '@/hooks/admin/types';

interface RestaurantEditFormProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const RestaurantEditForm = ({ editForm, onFormChange }: RestaurantEditFormProps) => {
  return (
    <>
      <div>
        <Label htmlFor="edit-name">Restaurant Name</Label>
        <Input
          id="edit-name"
          value={editForm.name || ''}
          onChange={(e) => onFormChange({ name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-category">Category</Label>
        <Input
          id="edit-category"
          value={editForm.category || ''}
          onChange={(e) => onFormChange({ category: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-address">Address</Label>
        <Input
          id="edit-address"
          value={editForm.address || ''}
          onChange={(e) => onFormChange({ address: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={editForm.description || ''}
          onChange={(e) => onFormChange({ description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            value={editForm.phone || ''}
            onChange={(e) => onFormChange({ phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="edit-whatsapp">WhatsApp</Label>
          <Input
            id="edit-whatsapp"
            value={editForm.whatsapp || ''}
            onChange={(e) => onFormChange({ whatsapp: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-website">Website</Label>
          <Input
            id="edit-website"
            value={editForm.website || ''}
            onChange={(e) => onFormChange({ website: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            value={editForm.email || ''}
            onChange={(e) => onFormChange({ email: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-image-url">Main Image URL</Label>
        <Input
          id="edit-image-url"
          value={editForm.image_url || ''}
          onChange={(e) => onFormChange({ image_url: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="edit-closed-for-season"
          checked={editForm.closed_for_season || false}
          onCheckedChange={(checked) => 
            onFormChange({ closed_for_season: checked as boolean })
          }
        />
        <Label htmlFor="edit-closed-for-season" className="text-sm font-medium">
          Closed for Season
        </Label>
      </div>
    </>
  );
};

export default RestaurantEditForm;
