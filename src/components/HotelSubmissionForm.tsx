
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const HotelSubmissionForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    full_description: '',
    category: '',
    address: '',
    latitude: '',
    longitude: '',
    expedia_hotel_id: '',
    affiliate_url: '',
    commission_rate: '',
    image_url: '',
    price_from: '',
    currency: 'USD',
    rating: '',
    review_count: ''
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const categories = ['Resort', 'Hotel', 'Boutique', 'Eco', 'Hostel', 'Cabanas', 'Vacation Rental'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  const addGalleryImage = () => {
    if (newImageUrl.trim() && !galleryImages.includes(newImageUrl.trim())) {
      setGalleryImages([...galleryImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeGalleryImage = (imageUrl: string) => {
    setGalleryImages(galleryImages.filter(img => img !== imageUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a hotel listing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('hotel_listings')
        .insert({
          name: formData.name,
          description: formData.description,
          full_description: formData.full_description || formData.description,
          category: formData.category,
          address: formData.address,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          expedia_hotel_id: formData.expedia_hotel_id || null,
          affiliate_url: formData.affiliate_url,
          commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
          image_url: formData.image_url || null,
          gallery_images: galleryImages,
          amenities: amenities,
          policies: {},
          rating: formData.rating ? parseFloat(formData.rating) : null,
          review_count: formData.review_count ? parseInt(formData.review_count) : 0,
          price_from: formData.price_from ? parseFloat(formData.price_from) : null,
          currency: formData.currency,
          user_id: user.id,
          approved: false
        });

      if (error) throw error;

      toast({
        title: "Hotel submitted successfully!",
        description: "Your hotel listing has been submitted for review. You'll be notified once it's approved.",
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error submitting hotel:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your hotel listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Sign in required</h3>
          <p className="text-gray-600 mb-4">Please sign in to submit a hotel listing.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add Your Hotel to Cambutal Directory</CardTitle>
        <p className="text-gray-600">Submit your property for inclusion in our accommodation listings.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Hotel Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-venao-dark"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="full_description">Full Description</Label>
            <Textarea
              id="full_description"
              name="full_description"
              value={formData.full_description}
              onChange={handleInputChange}
              rows={5}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Expedia Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expedia_hotel_id">Expedia Hotel ID</Label>
              <Input
                id="expedia_hotel_id"
                name="expedia_hotel_id"
                value={formData.expedia_hotel_id}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="commission_rate">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                name="commission_rate"
                type="number"
                step="0.1"
                value={formData.commission_rate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="affiliate_url">Expedia Affiliate URL *</Label>
            <Input
              id="affiliate_url"
              name="affiliate_url"
              type="url"
              value={formData.affiliate_url}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Pricing & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="price_from">Price From</Label>
              <Input
                id="price_from"
                name="price_from"
                type="number"
                step="0.01"
                value={formData.price_from}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-venao-dark"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="PAB">PAB</option>
              </select>
            </div>
            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="review_count">Review Count</Label>
              <Input
                id="review_count"
                name="review_count"
                type="number"
                value={formData.review_count}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="image_url">Main Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleInputChange}
            />
          </div>

          {/* Gallery Images */}
          <div>
            <Label>Gallery Images</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="url"
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button type="button" onClick={addGalleryImage} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {galleryImages.map((imageUrl, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  Image {index + 1}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeGalleryImage(imageUrl)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Enter amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeAmenity(amenity)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Hotel Listing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelSubmissionForm;
