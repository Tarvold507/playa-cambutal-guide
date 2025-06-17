
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, MapPin } from 'lucide-react';
import { useRestaurantListings } from '@/hooks/useRestaurantListings';

interface RestaurantFormData {
  name: string;
  description: string;
  category: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
}

interface RestaurantSubmissionFormProps {
  onSuccess?: () => void;
}

const RestaurantSubmissionForm: React.FC<RestaurantSubmissionFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<RestaurantFormData>();
  const { submitRestaurant } = useRestaurantListings();
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [menuImages, setMenuImages] = useState<string[]>([]);
  const [hours, setHours] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: ''
  });

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

  const onSubmit = async (data: RestaurantFormData) => {
    setLoading(true);
    try {
      await submitRestaurant({
        ...data,
        hours,
        gallery_images: galleryImages,
        menu_images: menuImages,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
      reset();
      setGalleryImages([]);
      setMenuImages([]);
      setHours({
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: ''
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Your Restaurant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Restaurant name is required' })}
                placeholder="Enter restaurant name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seafood">Seafood</SelectItem>
                  <SelectItem value="Cafe">Cafe</SelectItem>
                  <SelectItem value="Bar & Tapas">Bar & Tapas</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Panamanian">Panamanian</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                  <SelectItem value="Fast Food">Fast Food</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('category', { required: 'Category is required' })} />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your restaurant"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                {...register('address', { required: 'Address is required' })}
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            {/* Location Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register('latitude', { 
                    setValueAs: (v) => v === '' ? undefined : parseFloat(v),
                    validate: (v) => v === undefined || (v >= -90 && v <= 90) || 'Latitude must be between -90 and 90'
                  })}
                  placeholder="e.g., 7.2335"
                />
                {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...register('longitude', { 
                    setValueAs: (v) => v === '' ? undefined : parseFloat(v),
                    validate: (v) => v === undefined || (v >= -180 && v <= 180) || 'Longitude must be between -180 and 180'
                  })}
                  placeholder="e.g., -80.1030"
                />
                {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>}
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
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+507 6123-4567"
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                {...register('whatsapp')}
                placeholder="+5076123567"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="restaurant@example.com"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Main Image */}
          <div>
            <Label htmlFor="image_url">Main Image URL</Label>
            <Input
              id="image_url"
              {...register('image_url')}
              placeholder="https://example.com/image.jpg"
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

          {/* Image Management */}
          <div className="space-y-4">
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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Restaurant'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RestaurantSubmissionForm;
