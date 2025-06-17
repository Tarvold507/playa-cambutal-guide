
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Plus, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { EditFormData } from '@/hooks/admin/types';

interface RestaurantEditFormProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const RestaurantEditForm = ({ editForm, onFormChange }: RestaurantEditFormProps) => {
  const [galleryImages, setGalleryImages] = useState<string[]>(
    editForm.gallery_images || []
  );
  const [menuImages, setMenuImages] = useState<string[]>(
    editForm.menu_images || []
  );

  const addImageUrl = (type: 'gallery' | 'menu', url: string) => {
    if (!url.trim()) return;
    
    if (type === 'gallery') {
      const newImages = [...galleryImages, url.trim()];
      setGalleryImages(newImages);
      onFormChange({ gallery_images: newImages });
    } else {
      const newImages = [...menuImages, url.trim()];
      setMenuImages(newImages);
      onFormChange({ menu_images: newImages });
    }
  };

  const removeImage = (type: 'gallery' | 'menu', index: number) => {
    if (type === 'gallery') {
      const newImages = galleryImages.filter((_, i) => i !== index);
      setGalleryImages(newImages);
      onFormChange({ gallery_images: newImages });
    } else {
      const newImages = menuImages.filter((_, i) => i !== index);
      setMenuImages(newImages);
      onFormChange({ menu_images: newImages });
    }
  };

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

      {/* Location Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-latitude">Latitude</Label>
          <Input
            id="edit-latitude"
            type="number"
            step="any"
            value={editForm.latitude || ''}
            onChange={(e) => onFormChange({ latitude: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="e.g., 7.2335"
          />
        </div>
        
        <div>
          <Label htmlFor="edit-longitude">Longitude</Label>
          <Input
            id="edit-longitude"
            type="number"
            step="any"
            value={editForm.longitude || ''}
            onChange={(e) => onFormChange({ longitude: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="e.g., -80.1030"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Location coordinates help customers find the restaurant</p>
            <p className="text-blue-600">You can find these on Google Maps by right-clicking the location</p>
          </div>
        </div>
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

      {/* Gallery Images */}
      <div>
        <Label className="text-base font-semibold">Gallery Images</Label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              id="admin-gallery-input"
              placeholder="Enter image URL"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  addImageUrl('gallery', input.value);
                  input.value = '';
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const input = document.getElementById('admin-gallery-input') as HTMLInputElement;
                addImageUrl('gallery', input.value);
                input.value = '';
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {galleryImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-5 h-5 opacity-0 group-hover:opacity-100"
                  onClick={() => removeImage('gallery', index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Images */}
      <div>
        <Label className="text-base font-semibold">Menu Images</Label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              id="admin-menu-input"
              placeholder="Enter menu image URL"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  addImageUrl('menu', input.value);
                  input.value = '';
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const input = document.getElementById('admin-menu-input') as HTMLInputElement;
                addImageUrl('menu', input.value);
                input.value = '';
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {menuImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Menu ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-5 h-5 opacity-0 group-hover:opacity-100"
                  onClick={() => removeImage('menu', index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="edit-is-premium"
            checked={editForm.is_premium || false}
            onCheckedChange={(checked) => 
              onFormChange({ is_premium: checked as boolean })
            }
          />
          <Label htmlFor="edit-is-premium" className="text-sm font-medium">
            Premium Listing
          </Label>
        </div>
      </div>
      {editForm.is_premium && (
        <div>
          <Label htmlFor="edit-display-order">Display Order (Premium)</Label>
          <Input
            id="edit-display-order"
            type="number"
            value={editForm.display_order || 0}
            onChange={(e) => onFormChange({ display_order: parseInt(e.target.value) || 0 })}
            placeholder="Lower numbers appear first"
          />
        </div>
      )}
    </>
  );
};

export default RestaurantEditForm;
