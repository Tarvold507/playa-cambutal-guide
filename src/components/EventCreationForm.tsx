
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Upload } from 'lucide-react'
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
  start_time: z.string().min(1, 'Please specify start time'),
  end_time: z.string().min(1, 'Please specify end time'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  full_description: z.string().min(20, 'Event details must be at least 20 characters'),
  image_url: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  event_type: z.enum(['class', 'social', 'kids'], {
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      location: '',
      host: '',
      start_time: '',
      end_time: '',
      description: '',
      full_description: '',
      image_url: '',
      event_type: undefined,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        form.setValue('image_url', result) // For now, using base64. In production, upload to storage
      }
      reader.readAsDataURL(file)
    }
  }

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
        start_time: data.start_time,
        end_time: data.end_time,
        description: `${data.description} | Type: ${data.event_type}`,
        full_description: data.full_description,
        image_url: data.image_url || undefined,
      })

      toast({
        title: 'Event submitted successfully!',
        description: 'Your event has been submitted for admin approval.',
      })

      form.reset()
      setImageFile(null)
      setImagePreview('')
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
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

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
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
                  <SelectItem value="class">Class</SelectItem>
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

        <div className="space-y-4">
          <FormLabel>Event Image</FormLabel>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> event image
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input 
                  id="image-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="Event preview" 
                  className="max-w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Or enter image URL</FormLabel>
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
          </div>
        </div>

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
