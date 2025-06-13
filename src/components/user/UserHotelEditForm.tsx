
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserHotel } from '@/hooks/useUserHotels';

interface UserHotelEditFormProps {
  hotel: UserHotel;
  onSave: (hotelId: string, updates: Partial<UserHotel>) => void;
  onCancel: () => void;
}

const UserHotelEditForm = ({ hotel, onSave, onCancel }: UserHotelEditFormProps) => {
  const [formData, setFormData] = useState({
    name: hotel.name,
    description: hotel.description || '',
    full_description: hotel.full_description || '',
    category: hotel.category,
    address: hotel.address,
    affiliate_url: hotel.affiliate_url,
    price_from: hotel.price_from || 0,
    currency: hotel.currency || 'USD',
    image_url: hotel.image_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(hotel.id, formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Hotel Name</Label>
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
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Resort">Resort</SelectItem>
              <SelectItem value="Boutique">Boutique</SelectItem>
              <SelectItem value="Hostel">Hostel</SelectItem>
              <SelectItem value="Vacation Rental">Vacation Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_description">Full Description</Label>
        <Textarea
          id="full_description"
          value={formData.full_description}
          onChange={(e) => handleInputChange('full_description', e.target.value)}
          rows={4}
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

      <div className="space-y-2">
        <Label htmlFor="affiliate_url">Booking URL</Label>
        <Input
          id="affiliate_url"
          type="url"
          value={formData.affiliate_url}
          onChange={(e) => handleInputChange('affiliate_url', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price_from">Price From</Label>
          <Input
            id="price_from"
            type="number"
            value={formData.price_from}
            onChange={(e) => handleInputChange('price_from', Number(e.target.value))}
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="MXN">MXN</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
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

export default UserHotelEditForm;
