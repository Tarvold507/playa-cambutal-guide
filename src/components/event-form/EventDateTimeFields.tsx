
import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Control, useFormContext } from 'react-hook-form';
import AutoCloseCalendar from '@/components/ui/auto-close-calendar';
import { formatInPanamaTime, calculateEndTime, formatTimeWithDefaults } from '@/utils/timezoneUtils';

interface EventDateTimeFieldsProps {
  control: Control<any>;
}

const EventDateTimeFields: React.FC<EventDateTimeFieldsProps> = ({ control }) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { setValue } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="event_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Event Date</FormLabel>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      formatInPanamaTime(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <AutoCloseCalendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  onClose={() => setDatePickerOpen(false)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field}
                  onChange={(e) => {
                    const formattedTime = formatTimeWithDefaults(e.target.value);
                    field.onChange(formattedTime);
                    
                    // Auto-calculate end time
                    const endTime = calculateEndTime(formattedTime);
                    if (endTime) {
                      setValue('end_time', endTime);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field}
                  onChange={(e) => {
                    const formattedTime = formatTimeWithDefaults(e.target.value);
                    field.onChange(formattedTime);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default EventDateTimeFields;
