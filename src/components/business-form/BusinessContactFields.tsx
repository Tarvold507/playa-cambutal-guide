
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface BusinessContactFieldsProps {
  control: Control<any>;
}

const BusinessContactFields: React.FC<BusinessContactFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Main Street, Cambutal Village" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Details (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Near the beach, behind the market" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
        control={control}
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
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., https://yourwebsite.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BusinessContactFields;
