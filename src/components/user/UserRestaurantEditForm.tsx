
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(restaurant.id, formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
