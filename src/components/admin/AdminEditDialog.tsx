import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import HotelEditForm from './HotelEditForm';

interface EditFormData {
  type?: 'event' | 'business' | 'restaurant' | 'hotel';
  id?: string;
  title?: string;
  location?: string;
  host?: string;
  description?: string;
  name?: string;
  category?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  image_url?: string;
  hours?: Record<string, string>;
  gallery_images?: string[];
  menu_images?: string[];
  amenities?: string[];
  affiliate_url?: string;
  expedia_hotel_id?: string;
  price_from?: number;
  commission_rate?: number;
  policies?: Record<string, any>;
  full_description?: string;
  rating?: number;
  [key: string]: any;
}

interface AdminEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
  onSave: () => void;
}

const AdminEditDialog = ({ isOpen, onClose, editForm, onFormChange, onSave }: AdminEditDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit {editForm.type === 'event' ? 'Event' : 
                  editForm.type === 'business' ? 'Business Listing' : 
                  editForm.type === 'restaurant' ? 'Restaurant Listing' :
                  'Hotel Listing'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {editForm.type === 'event' ? (
            <>
              {/* Event form fields - keep existing code */}
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
          ) : editForm.type === 'business' ? (
            <>
              {/* Business form fields - keep existing code */}
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
          ) : editForm.type === 'restaurant' ? (
            <>
              {/* Restaurant form fields - keep existing code */}
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
            </>
          ) : (
            <HotelEditForm
              editForm={editForm}
              onFormChange={onFormChange}
            />
          )}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={onSave}>
              {t('common.save')} Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditDialog;
