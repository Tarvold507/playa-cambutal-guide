import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useUpdateEvent } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import { UserEvent } from '@/hooks/useUserEvents';
import AutoCloseCalendar from '@/components/ui/auto-close-calendar';
import { formatDateForDB, parseEventDate } from '@/utils/dateUtils';
import { formatInPanamaTime, formatTimeWithDefaults, calculateEndTime } from '@/utils/timezoneUtils';

const eventEditSchema = z.object({
  title: z.string().min(3, 'Event name must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  host: z.string().min(2, 'Host name must be at least 2 characters'),
  event_date: z.date({
    required_error: 'Please select an event date',
  }),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  full_description: z.string().optional(),
  image_url: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
});

type EventEditData = z.infer<typeof eventEditSchema>;

interface UserEventEditFormProps {
  event: UserEvent;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserEventEditForm: React.FC<UserEventEditFormProps> = ({ 
  event, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const updateEvent = useUpdateEvent();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const form = useForm<EventEditData>({
    resolver: zodResolver(eventEditSchema),
    defaultValues: {
      title: event.title,
      location: event.location,
      host: event.host,
      event_date: parseEventDate(event.event_date),
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      description: event.description,
      full_description: event.full_description || '',
      image_url: event.image_url || '',
    },
  });

  const onSubmit = async (data: EventEditData) => {
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        title: data.title,
        location: data.location,
        host: data.host,
        event_date: formatDateForDB(data.event_date),
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        description: data.description,
        full_description: data.full_description || null,
        image_url: data.image_url || null,
      });

      toast({
        title: 'Success',
        description: 'Event updated successfully!',
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host Name</FormLabel>
                <FormControl>
                  <Input placeholder="Event host" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
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
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <TimeSelector
                    value={field.value}
                    onChange={(time) => {
                      const formattedTime = formatTimeWithDefaults(time);
                      field.onChange(formattedTime);
                      
                      // Auto-calculate end time
                      const endTime = calculateEndTime(formattedTime);
                      if (endTime) {
                        form.setValue('end_time', endTime);
                      }
                    }}
                    placeholder="Select start time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <TimeSelector
                    value={field.value}
                    onChange={(time) => {
                      const formattedTime = formatTimeWithDefaults(time);
                      field.onChange(formattedTime);
                    }}
                    placeholder="Select end time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
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
          control={form.control}
          name="full_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Details (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of your event"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/event-image.jpg"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateEvent.isPending}>
            {updateEvent.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserEventEditForm;
