
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { EditFormData } from '@/hooks/admin/types';

interface BusinessEditFormProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const BusinessEditForm = ({ editForm, onFormChange }: BusinessEditFormProps) => {
  return (
    <>
      <div>
        <Label htmlFor="edit-name">Business Name</Label>
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
    </>
  );
};

export default BusinessEditForm;
