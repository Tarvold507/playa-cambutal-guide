
import { Calendar, MapPin, User } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Event {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  location: string;
  host: string;
  event_date: string;
  image_url?: string;
}

interface EventModalHeaderProps {
  event: Event;
}

const EventModalHeader = ({ event }: EventModalHeaderProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        <DialogDescription>
          {event.description || "View event details and set reminders"}
        </DialogDescription>
      </DialogHeader>
      
      {event.image_url && (
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>{formatDate(event.event_date)}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <User className="h-5 w-5" />
          <span>Hosted by {event.host}</span>
        </div>
      </div>
    </>
  );
};

export default EventModalHeader;
