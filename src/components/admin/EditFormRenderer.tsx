
import EventEditForm from './EventEditForm';
import BusinessEditForm from './BusinessEditForm';
import RestaurantEditForm from './RestaurantEditForm';
import HotelEditForm from './HotelEditForm';
import type { EditFormData } from '@/hooks/admin/types';

interface EditFormRendererProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const EditFormRenderer = ({ editForm, onFormChange }: EditFormRendererProps) => {
  switch (editForm.type) {
    case 'event':
      return <EventEditForm editForm={editForm} onFormChange={onFormChange} />;
    case 'business':
      return <BusinessEditForm editForm={editForm} onFormChange={onFormChange} />;
    case 'restaurant':
      return <RestaurantEditForm editForm={editForm} onFormChange={onFormChange} />;
    case 'hotel':
      return <HotelEditForm editForm={editForm} onFormChange={onFormChange} />;
    default:
      return null;
  }
};

export default EditFormRenderer;
