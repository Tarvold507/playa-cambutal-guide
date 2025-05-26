
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
