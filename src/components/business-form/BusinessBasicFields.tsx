
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';

const businessTypeOptions = {
  surf: ['Lessons', 'Rentals', 'Shop', 'Repair'],
  fitness: ['Yoga Classes', 'Personal Training', 'Group Fitness', 'Wellness Retreats'],
  tours: ['Wildlife Tours', 'Hiking Tours', 'Cultural Tours', 'Photography Tours'],
  fishing: ['Fishing Charters', 'Fishing Guides', 'Equipment Rental', 'Fishing Tours'],
};

interface BusinessBasicFieldsProps {
  control: Control<any>;
  selectedCategory: string;
}

const BusinessBasicFields: React.FC<BusinessBasicFieldsProps> = ({ control, selectedCategory }) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
                {selectedCategory && businessTypeOptions[selectedCategory as keyof typeof businessTypeOptions]?.map((type) => (
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
        control={control}
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
    </>
  );
};

export default BusinessBasicFields;
