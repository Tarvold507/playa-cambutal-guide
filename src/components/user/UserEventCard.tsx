
import React from 'react';
import { Calendar, Clock, MapPin, User, Edit, Trash2, Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserEvent } from '@/hooks/useUserEvents';
import { parseEventDate, getDayName } from '@/utils/dateUtils';
import { formatInPanamaTime } from '@/utils/timezoneUtils';

interface UserEventCardProps {
  event: UserEvent;
  onEdit: (event: UserEvent) => void;
  onDelete: (eventId: string) => void;
}

const UserEventCard: React.FC<UserEventCardProps> = ({ event, onEdit, onDelete }) => {
  const eventDate = parseEventDate(event.event_date);
  const dayOfWeek = getDayName(eventDate.getDay());

  const handleEdit = () => {
    onEdit(event);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Create a date object with the time for formatting
    const timeDate = new Date(`2000-01-01T${timeString}`);
    return formatInPanamaTime(timeDate, 'h:mm a');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{dayOfWeek}, {formatInPanamaTime(eventDate, 'MMM d, yyyy')}</span>
              </div>
              {(event.start_time || event.end_time) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {event.start_time && formatTime(event.start_time)}
                    {event.start_time && event.end_time && ' - '}
                    {event.end_time && formatTime(event.end_time)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={event.approved ? 'default' : 'secondary'}>
              {event.approved ? 'Approved' : 'Pending'}
            </Badge>
            {event.event_series_id && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                {event.is_series_master ? 'Series Master' : 'Instance'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.host}</span>
          </div>

          {event.description && (
            <p className="text-sm text-gray-700 line-clamp-2">
              {event.description}
            </p>
          )}

          {event.image_url && (
            <div className="rounded-md overflow-hidden">
              <img 
                src={event.image_url} 
                alt={event.title}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserEventCard;
