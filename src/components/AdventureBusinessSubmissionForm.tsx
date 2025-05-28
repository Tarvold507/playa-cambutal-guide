
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
import { Plus } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const selectedCategory = form.watch('category');

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
        });

      if (error) throw error;

      toast({
        title: "Submission Successful",
        description: "Your business listing has been submitted for review. You'll be notified once it's approved.",
      });

      form.reset();
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
          Submit Adventure Business
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Adventure Business</DialogTitle>
          <DialogDescription>
            Share your adventure business with visitors to Playa Cambutal. All submissions require admin approval.
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
                  <FormLabel>Adventure Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select adventure category" />
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
              <Button type="submit" disabled={isSubmitting}>
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
