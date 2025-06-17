
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, MapPin } from 'lucide-react';
import type { RestaurantListing } from '@/hooks/useRestaurantListings';

interface UserRestaurantEditFormProps {
  restaurant: RestaurantListing;
  onSave: (restaurantId: string, updates: Partial<RestaurantListing>) => void;
  onCancel: () => void;
}

const UserRestaurantEditForm = ({ restaurant, onSave, onCancel }: UserRestaurantEditFormProps) => {
  const [formData, setFormData] = useState({
    name: restaurant.name,
    description: restaurant.description || '',
    category: restaurant.category,
    address: restaurant.address,
    phone: restaurant.phone || '',
    whatsapp: restaurant.whatsapp || '',
    website: restaurant.website || '',
    email: restaurant.email || '',
    image_url: restaurant.image_url || '',
    latitude: restaurant.latitude || null,
    longitude: restaurant.longitude || null,
  });

  const [galleryImages, setGalleryImages] = useState<string[]>(restaurant.gallery_images || []);
  const [menuImages, setMenuImages] = useState<string[]>(restaurant.menu_images || []);
  const [hours, setHours] = useState(restaurant.hours || {
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(restaurant.id, {
      ...formData,
      gallery_images: galleryImages,
      menu_images: menuImages,
      hours
    });
  };

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addImageUrl = (type: 'gallery' | 'menu', url: string) => {
    if (!url.trim()) return;
    
    if (type === 'gallery') {
      setGalleryImages(prev => [...prev, url.trim()]);
    } else {
      setMenuImages(prev => [...prev, url.trim()]);
    }
  };

  const removeImage = (type: 'gallery' | 'menu', index: number) => {
    if (type === 'gallery') {
      setGalleryImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setMenuImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Restaurant Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mexican">Mexican</SelectItem>
              <SelectItem value="Italian">Italian</SelectItem>
              <SelectItem value="Seafood">Seafood</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="Fast Food">Fast Food</SelectItem>
              <SelectItem value="Coffee & Cafe">Coffee & Cafe</SelectItem>
              <SelectItem value="Bar & Grill">Bar & Grill</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          required
        />
      </div>

      {/* Location Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude || ''}
            onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="e.g., 7.2335"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude || ''}
            onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="e.g., -80.1030"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Location coordinates help customers find you</p>
            <p className="text-blue-600">You can find these on Google Maps by right-clicking your location</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => handleInputChange('whatsapp', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          type="url"
          value={formData.image_url}
          onChange={(e) => handleInputChange('image_url', e.target.value)}
        />
      </div>

      {/* Hours */}
      <div>
        <Label className="text-base font-semibold">Hours of Operation</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {Object.entries(hours).map(([day, time]) => (
            <div key={day} className="flex items-center space-x-2">
              <Label className="w-20 text-sm">{day}:</Label>
              <Input
                value={time}
                onChange={(e) => setHours(prev => ({ ...prev, [day]: e.target.value }))}
                placeholder="9:00 AM - 5:00 PM or Closed"
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <Label className="text-base font-semibold">Gallery Images</Label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              id="gallery-input"
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
                const input = document.getElementById('gallery-input') as HTMLInputElement;
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
              id="menu-input"
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
                const input = document.getElementById('menu-input') as HTMLInputElement;
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

      <div className="flex gap-2">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserRestaurantEditForm;
