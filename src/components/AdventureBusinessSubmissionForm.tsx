
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCMSImages } from '@/hooks/useCMSImages';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Upload, X } from 'lucide-react';

const formSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  category: z.enum(['surf', 'fitness', 'tours', 'fishing'], {
    required_error: 'Please select a category',
  }),
  business_type: z.string().min(1, 'Business type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  hours: z.string().min(1, 'Hours of operation are required'),
  whatsapp: z.string().min(1, 'WhatsApp contact is required'),
  location: z.string().min(1, 'Location is required'),
  image_url: z.string().optional(),
});

const businessTypeOptions = {
  surf: ['Lessons', 'Rentals', 'Shop', 'Repair'],
  fitness: ['Yoga Classes', 'Personal Training', 'Group Fitness', 'Wellness Retreats'],
  tours: ['Wildlife Tours', 'Hiking Tours', 'Cultural Tours', 'Photography Tours'],
  fishing: ['Fishing Charters', 'Fishing Guides', 'Equipment Rental', 'Fishing Tours'],
};

const AdventureBusinessSubmissionForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadImage, uploading } = useCMSImages();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: '',
      category: undefined,
      business_type: '',
      description: '',
      hours: '',
      whatsapp: '',
      location: '',
      image_url: '',
    },
  });

  const selectedCategory = form.watch('category');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue('image_url', '');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a business listing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage, 'business-images');
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from('adventure_business_listings')
        .insert({
          user_id: user.id,
          business_name: values.business_name,
          category: values.category,
          business_type: values.business_type,
          description: values.description,
          hours: values.hours,
          whatsapp: values.whatsapp,
          location: values.location,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast({
        title: "Submission Successful",
        description: "Your business listing has been submitted for review. You'll be notified once it's approved.",
      });

      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting business listing:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your business listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Button disabled variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Sign in to Submit Business
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-venao-dark hover:bg-venao-dark/90">
          <Plus className="w-4 h-4 mr-2" />
          Submit Your Business
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Business</DialogTitle>
          <DialogDescription>
            Share your business with visitors to Playa Cambutal. All submissions require admin approval.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="surf">Surf</SelectItem>
                      <SelectItem value="fitness">Fitness & Wellness</SelectItem>
                      <SelectItem value="tours">Tours & Nature</SelectItem>
                      <SelectItem value="fishing">Fishing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!selectedCategory}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCategory && businessTypeOptions[selectedCategory].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Business Image</FormLabel>
              <div className="flex flex-col space-y-2">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Business preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Upload a photo of your business</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Services</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your services and what makes your business unique..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours of Operation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daily 8:00 AM - 6:00 PM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., +507-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Beach, Village Center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || uploading}>
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdventureBusinessSubmissionForm;
