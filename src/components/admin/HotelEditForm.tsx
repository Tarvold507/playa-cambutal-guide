
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getAmenityIcon } from '@/utils/amenityIcons';
import type { EditFormData } from '@/hooks/admin/types';

interface HotelEditFormProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const commonAmenities = [
  'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service', 'Parking', 
  'Air Conditioning', 'Pet Friendly', 'Beach Access', 'Airport Shuttle',
  'Business Center', 'Laundry Service', 'Concierge', 'Ocean View'
];

const HotelEditForm = ({ editForm, onFormChange }: HotelEditFormProps) => {
  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    const currentAmenities = editForm.amenities || [];
    const updatedAmenities = checked
      ? [...currentAmenities, amenity]
      : currentAmenities.filter(a => a !== amenity);
    onFormChange({ amenities: updatedAmenities });
  };

  const handleGalleryImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const currentImages = editForm.gallery_images || [];
      onFormChange({ gallery_images: [...currentImages, url] });
    }
  };

  const handleGalleryImageRemove = (index: number) => {
    const currentImages = editForm.gallery_images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    onFormChange({ gallery_images: updatedImages });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Hotel Name</Label>
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
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="edit-full-description">Full Description</Label>
        <Textarea
          id="edit-full-description"
          value={editForm.full_description || ''}
          onChange={(e) => onFormChange({ full_description: e.target.value })}
          rows={4}
        />
      </div>

      {/* Pricing & Expedia Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edit-price-from">Price From (USD)</Label>
          <Input
            id="edit-price-from"
            type="number"
            value={editForm.price_from || ''}
            onChange={(e) => onFormChange({ price_from: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="edit-commission-rate">Commission Rate (%)</Label>
          <Input
            id="edit-commission-rate"
            type="number"
            step="0.1"
            value={editForm.commission_rate || ''}
            onChange={(e) => onFormChange({ commission_rate: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="edit-rating">Rating</Label>
          <Input
            id="edit-rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={editForm.rating || ''}
            onChange={(e) => onFormChange({ rating: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-expedia-id">Expedia Hotel ID</Label>
          <Input
            id="edit-expedia-id"
            value={editForm.expedia_hotel_id || ''}
            onChange={(e) => onFormChange({ expedia_hotel_id: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="edit-affiliate-url">Expedia Affiliate URL</Label>
          <Input
            id="edit-affiliate-url"
            value={editForm.affiliate_url || ''}
            onChange={(e) => onFormChange({ affiliate_url: e.target.value })}
          />
        </div>
      </div>

      {/* Premium Listing Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Images */}
      <div>
        <Label htmlFor="edit-image-url">Main Image URL</Label>
        <Input
          id="edit-image-url"
          value={editForm.image_url || ''}
          onChange={(e) => onFormChange({ image_url: e.target.value })}
        />
      </div>

      <div>
        <Label>Gallery Images</Label>
        <div className="space-y-2">
          {(editForm.gallery_images || []).map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={url}
                onChange={(e) => {
                  const updatedImages = [...(editForm.gallery_images || [])];
                  updatedImages[index] = e.target.value;
                  onFormChange({ gallery_images: updatedImages });
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleGalleryImageRemove(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleGalleryImageAdd}
            className="w-full"
          >
            Add Gallery Image
          </Button>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {commonAmenities.map((amenity) => {
            const IconComponent = getAmenityIcon(amenity);
            const isChecked = (editForm.amenities || []).includes(amenity);
            
            return (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleAmenityToggle(amenity, checked as boolean)}
                />
                <label 
                  htmlFor={`amenity-${amenity}`} 
                  className="flex items-center gap-1 text-sm cursor-pointer"
                >
                  <IconComponent className="w-3 h-3" />
                  {amenity}
                </label>
              </div>
            );
          })}
        </div>
        
        {/* Custom amenities display */}
        {editForm.amenities && editForm.amenities.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm">Selected Amenities:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {editForm.amenities.map((amenity, index) => {
                const IconComponent = getAmenityIcon(amenity);
                return (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <IconComponent className="w-3 h-3" />
                    {amenity}
                    <button
                      type="button"
                      onClick={() => handleAmenityToggle(amenity, false)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelEditForm;
