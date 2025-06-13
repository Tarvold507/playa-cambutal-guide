
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useEventReminder = (event: Event) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminderChecked, setReminderChecked] = useState(false);
  const [settingReminder, setSettingReminder] = useState(false);

  useEffect(() => {
    const checkExistingReminder = async () => {
      if (!user || !event) {
        console.log('EventReminder - No user or event, skipping reminder check');
        setReminderChecked(false);
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
          setReminderChecked(false);
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
  }, [user, event.id]);

  const handleReminderToggle = async (checked: boolean) => {
    console.log('EventReminder - Toggle called with checked:', checked);

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
        
        const { data, error } = await supabase
          .from('user_event_reminders')
          .insert({
            user_id: user.id,
            event_id: event.id,
          })
          .select()
          .single();

        if (error) {
          console.error('EventReminder - Insert error details:', error);
          throw error;
        }

        console.log('EventReminder - Insert successful:', data);
        toast({
          title: "Reminder set!",
          description: "You'll be notified before this event starts.",
        });
        setReminderChecked(true);
      } else {
        console.log('EventReminder - Attempting to DELETE reminder');
        
        const { error } = await supabase
          .from('user_event_reminders')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);

        if (error) {
          console.error('EventReminder - Delete error details:', error);
          throw error;
        }

        console.log('EventReminder - Delete successful');
        toast({
          title: "Reminder removed",
          description: "You will no longer receive notifications for this event.",
        });
        setReminderChecked(false);
      }
    } catch (error: any) {
      console.error('EventReminder - Exception in toggle:', error);
      
      // Reset the checkbox state on error
      setReminderChecked(!checked);
      
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSettingReminder(false);
    }
  };

  return {
    reminderChecked,
    settingReminder,
    handleReminderToggle,
  };
};
