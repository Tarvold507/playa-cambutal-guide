
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
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import BusinessBasicFields from './business-form/BusinessBasicFields';
import BusinessContactFields from './business-form/BusinessContactFields';
import BusinessImageUpload from './business-form/BusinessImageUpload';

const formSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  category: z.enum(['surf', 'fitness', 'tours', 'fishing'], {
    required_error: 'Please select a category',
  }),
  business_type: z.string().min(1, 'Business type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  hours: z.string().min(1, 'Hours of operation are required'),
  whatsapp: z.string().min(1, 'WhatsApp contact is required'),
  location: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  image_url: z.string().optional(),
});

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
      address: '',
      website: '',
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
          location: values.location || null,
          address: values.address,
          website: values.website || null,
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
            <BusinessBasicFields control={form.control} selectedCategory={selectedCategory} />
            <BusinessImageUpload 
              imagePreview={imagePreview}
              uploading={uploading}
              onImageSelect={handleImageSelect}
              onRemoveImage={removeImage}
            />
            <BusinessContactFields control={form.control} />

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
