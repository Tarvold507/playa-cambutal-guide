
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useCreateEvent } from '@/hooks/useEvents'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import EventBasicInfoFields from './event-form/EventBasicInfoFields'
import EventDateTimeFields from './event-form/EventDateTimeFields'
import EventDescriptionFields from './event-form/EventDescriptionFields'
import EventImageFields from './event-form/EventImageFields'

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
        form.setValue('image_url', result)
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
        <EventBasicInfoFields control={form.control} />
        <EventDateTimeFields control={form.control} />
        <EventDescriptionFields control={form.control} />
        <EventImageFields 
          control={form.control} 
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
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
