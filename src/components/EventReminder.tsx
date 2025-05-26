
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
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

interface EventReminderProps {
  event: Event;
}

const EventReminder = ({ event }: EventReminderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminderChecked, setReminderChecked] = useState(false);
  const [settingReminder, setSettingReminder] = useState(false);

  // Debug logging
  console.log('EventReminder - Current user:', user);
  console.log('EventReminder - Event ID:', event.id);
  console.log('EventReminder - User ID:', user?.id);

  // Check if user already has a reminder set for this event
  useEffect(() => {
    const checkExistingReminder = async () => {
      if (!user || !event) {
        console.log('EventReminder - No user or event, skipping reminder check');
        return;
      }

      console.log('EventReminder - Checking existing reminder for user:', user.id, 'event:', event.id);

      try {
        const { data, error } = await supabase
          .from('user_event_reminders')
          .select('id')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .maybeSingle();

        if (error) {
          console.error('EventReminder - Error checking existing reminder:', error);
          return;
        }

        console.log('EventReminder - Existing reminder data:', data);
        setReminderChecked(!!data);
      } catch (error) {
        console.error('EventReminder - Exception checking existing reminder:', error);
        setReminderChecked(false);
      }
    };

    checkExistingReminder();
  }, [user, event]);

  const handleReminderToggle = async (checked: boolean) => {
    console.log('EventReminder - Toggle called with checked:', checked);
    console.log('EventReminder - Current user in toggle:', user);
    console.log('EventReminder - User email:', user?.email);
    console.log('EventReminder - User ID:', user?.id);
    console.log('EventReminder - Event ID:', event.id);

    if (!user) {
      console.log('EventReminder - No user found, showing auth required toast');
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
        console.log('EventReminder - Attempting to INSERT reminder');
        console.log('EventReminder - Insert data:', {
          user_id: user.id,
          event_id: event.id,
        });

        // Add reminder
        const { data, error } = await supabase
          .from('user_event_reminders')
          .insert({
            user_id: user.id,
            event_id: event.id,
          })
          .select();

        console.log('EventReminder - Insert response data:', data);
        console.log('EventReminder - Insert response error:', error);

        if (error) {
          console.error('EventReminder - Insert error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        toast({
          title: "Reminder set!",
          description: "You'll be notified 12 hours before this event starts.",
        });
      } else {
        console.log('EventReminder - Attempting to DELETE reminder');
        
        // Remove reminder
        const { data, error } = await supabase
          .from('user_event_reminders')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .select();

        console.log('EventReminder - Delete response data:', data);
        console.log('EventReminder - Delete response error:', error);

        if (error) {
          console.error('EventReminder - Delete error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        toast({
          title: "Reminder removed",
          description: "You will no longer receive notifications for this event.",
        });
      }
      
      setReminderChecked(checked);
      console.log('EventReminder - Successfully updated reminder state to:', checked);
    } catch (error: any) {
      console.error('EventReminder - Exception in toggle:', error);
      console.error('EventReminder - Error stack:', error.stack);
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

  return (
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
  );
};

export default EventReminder;
