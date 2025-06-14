
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
        console.log('EventReminder - User:', user?.id);
        console.log('EventReminder - Event:', event?.id);
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
          console.error('EventReminder - Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setReminderChecked(false);
          return;
        }

        console.log('EventReminder - Existing reminder check result:', data);
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
    console.log('EventReminder - Current user:', user);
    console.log('EventReminder - Current event:', event);

    if (!user) {
      console.log('EventReminder - No user found, showing auth required toast');
      toast({
        title: "Authentication required",
        description: "Please sign in to set event reminders.",
        variant: "destructive",
      });
      return;
    }

    if (!event || !event.id) {
      console.error('EventReminder - No valid event found');
      toast({
        title: "Error",
        description: "Invalid event data. Please try again.",
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
          event_id: event.id
        });
        
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
          console.error('EventReminder - Insert error breakdown:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        console.log('EventReminder - Insert successful:', data);
        toast({
          title: "Reminder set!",
          description: `You'll be notified before "${event.title}" starts.`,
        });
        setReminderChecked(true);
      } else {
        console.log('EventReminder - Attempting to DELETE reminder');
        console.log('EventReminder - Delete criteria:', {
          user_id: user.id,
          event_id: event.id
        });
        
        const { error } = await supabase
          .from('user_event_reminders')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);

        if (error) {
          console.error('EventReminder - Delete error details:', error);
          console.error('EventReminder - Delete error breakdown:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        console.log('EventReminder - Delete successful');
        toast({
          title: "Reminder removed",
          description: `You will no longer receive notifications for "${event.title}".`,
        });
        setReminderChecked(false);
      }
    } catch (error: any) {
      console.error('EventReminder - Exception in toggle:', error);
      console.error('EventReminder - Full error object:', JSON.stringify(error, null, 2));
      
      // Reset the checkbox state on error
      setReminderChecked(!checked);
      
      let errorMessage = "Failed to update reminder. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for specific RLS or permission errors
      if (error.code === '42501' || error.message?.includes('policy')) {
        errorMessage = "You don't have permission to set reminders. Please make sure you're logged in.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
