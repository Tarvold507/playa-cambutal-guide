import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Clock, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminderChecked, setReminderChecked] = useState(false);
  const [settingReminder, setSettingReminder] = useState(false);

  if (!event) return null;

  // Check if user already has a reminder set for this event
  useEffect(() => {
    const checkExistingReminder = async () => {
      if (!user || !event) return;

      try {
        const { data, error } = await supabase
          .from('user_event_reminders')
          .select('id')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking existing reminder:', error);
          return;
        }

        setReminderChecked(!!data);
      } catch (error) {
        console.error('Error checking existing reminder:', error);
        setReminderChecked(false);
      }
    };

    checkExistingReminder();
  }, [user, event]);

  const handleReminderToggle = async (checked: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to set event reminders.",
        variant: "destructive",
      });
      return;
    }

    setSettingReminder(true);
    
    try {
      if (checked) {
        // Add reminder
        const { error } = await supabase
          .from('user_event_reminders')
          .insert({
            user_id: user.id,
            event_id: event.id,
          });

        if (error) {
          console.error('Error setting reminder:', error);
          throw error;
        }

        toast({
          title: "Reminder set!",
          description: "You'll be notified 12 hours before this event starts.",
        });
      } else {
        // Remove reminder
        const { error } = await supabase
          .from('user_event_reminders')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);

        if (error) {
          console.error('Error removing reminder:', error);
          throw error;
        }

        toast({
          title: "Reminder removed",
          description: "You will no longer receive notifications for this event.",
        });
      }
      
      setReminderChecked(checked);
    } catch (error: any) {
      console.error('Reminder error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder. Please try again.",
        variant: "destructive",
      });
      // Don't update the checkbox state if there was an error
    } finally {
      setSettingReminder(false);
    }
  };

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
          <DialogDescription>
            {event.description || "View event details and set reminders"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
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

          {event.description && (
            <div>
              <h3 className="font-semibold mb-2">About this event</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          {event.full_description && (
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{event.full_description}</p>
            </div>
          )}

          {/* Reminder Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Event Reminder</span>
              </div>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder"
                    checked={reminderChecked}
                    onCheckedChange={handleReminderToggle}
                    disabled={settingReminder}
                  />
                  <label htmlFor="reminder" className="text-sm cursor-pointer">
                    Remind me 12 hours before this event
                  </label>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <Link to="/auth" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                  {' '}to set reminders
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
