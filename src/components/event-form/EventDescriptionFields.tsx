
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

interface EventDescriptionFieldsProps {
  control: Control<any>;
}

const EventDescriptionFields: React.FC<EventDescriptionFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Brief description of your event"
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="full_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Details</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Detailed description of your event, including what participants can expect, requirements, etc."
                className="min-h-[120px]"
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

export default EventDescriptionFields;
