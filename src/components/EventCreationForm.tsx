
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useCreateEvent } from '@/hooks/useEvents'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

const eventFormSchema = z.object({
  title: z.string().min(3, 'Event name must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  host: z.string().min(2, 'Host name must be at least 2 characters'),
  event_date: z.date({
    required_error: 'Please select an event date',
  }),
  time: z.string().min(1, 'Please specify event time'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  full_description: z.string().min(20, 'Event details must be at least 20 characters'),
  image_url: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  event_type: z.enum(['classes', 'social', 'kids'], {
    required_error: 'Please select an event type',
  }),
})

type EventFormData = z.infer<typeof eventFormSchema>

interface EventCreationFormProps {
  onSuccess: () => void
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ onSuccess }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const createEvent = useCreateEvent()

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      location: '',
      host: '',
      time: '',
      description: '',
      full_description: '',
      image_url: '',
      event_type: undefined,
    },
  })

  const onSubmit = async (data: EventFormData) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create an event.',
        variant: 'destructive',
      })
      return
    }

    try {
      await createEvent.mutateAsync({
        title: data.title,
        location: data.location,
        host: data.host,
        event_date: format(data.event_date, 'yyyy-MM-dd'),
        description: `${data.description} | Time: ${data.time} | Type: ${data.event_type}`,
        full_description: data.full_description,
        image_url: data.image_url || undefined,
      })

      toast({
        title: 'Event submitted successfully!',
        description: 'Your event has been submitted for admin approval.',
      })

      form.reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Please log in to create an event.
        </p>
        <Button onClick={() => window.location.href = '/auth'}>
          Log In
        </Button>
      </div>
    )
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="event_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
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
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Time</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="event_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="classes">Classes</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
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
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createEvent.isPending}
          >
            {createEvent.isPending ? 'Submitting...' : 'Submit Event'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EventCreationForm
