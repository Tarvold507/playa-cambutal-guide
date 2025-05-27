
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { EditFormData } from '@/hooks/admin/types';

interface EventEditFormProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const EventEditForm = ({ editForm, onFormChange }: EventEditFormProps) => {
  return (
    <>
      <div>
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          value={editForm.title || ''}
          onChange={(e) => onFormChange({ title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-location">Location</Label>
        <Input
          id="edit-location"
          value={editForm.location || ''}
          onChange={(e) => onFormChange({ location: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-host">Host</Label>
        <Input
          id="edit-host"
          value={editForm.host || ''}
          onChange={(e) => onFormChange({ host: e.target.value })}
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
    </>
  );
};

export default EventEditForm;
