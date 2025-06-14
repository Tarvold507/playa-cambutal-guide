
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EventReminder {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  events: {
    id: string;
    title: string;
    description: string;
    location: string;
    host: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    image_url?: string;
  };
}

export const useUserEventReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [eventReminders, setEventReminders] = useState<EventReminder[]>([]);

  const fetchEventReminders = async () => {
    if (!user) {
      console.log('useUserEventReminders - No user, clearing reminders');
      setEventReminders([]);
      return;
    }
    
    console.log('useUserEventReminders - Fetching reminders for user:', user.id);
    console.log('useUserEventReminders - User object:', user);
    setLoading(true);
    
    try {
      // First, let's check what's in the user_event_reminders table
      const { data: allReminders, error: allError } = await supabase
        .from('user_event_reminders')
        .select('*');
      
      console.log('useUserEventReminders - All reminders in table:', allReminders);
      console.log('useUserEventReminders - All reminders error:', allError);

      // Now fetch user's specific reminders with events joined
      const { data, error } = await supabase
        .from('user_event_reminders')
        .select(`
          id,
          event_id,
          user_id,
          created_at,
          events (
            id,
            title,
            description,
            location,
            host,
            event_date,
            start_time,
            end_time,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('useUserEventReminders - User reminders query result:', data);
      console.log('useUserEventReminders - User reminders error:', error);

      if (error) {
        console.error('useUserEventReminders - Error fetching reminders:', error);
        console.error('useUserEventReminders - Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('useUserEventReminders - Fetched reminders:', data?.length || 0);
      setEventReminders(data || []);
    } catch (error: any) {
      console.error('useUserEventReminders - Exception fetching reminders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your event reminders",
        variant: "destructive",
      });
      setEventReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const removeReminder = async (reminderId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to remove reminders",
        variant: "destructive",
      });
      return;
    }

    console.log('useUserEventReminders - Removing reminder:', reminderId);
    
    try {
      const { error } = await supabase
        .from('user_event_reminders')
        .delete()
        .eq('id', reminderId)
        .eq('user_id', user.id); // Add user_id check for security

      if (error) {
        console.error('useUserEventReminders - Error removing reminder:', error);
        throw error;
      }

      console.log('useUserEventReminders - Reminder removed successfully');
      toast({
        title: "Reminder removed",
        description: "Event reminder has been removed successfully.",
      });

      // Refresh the list
      await fetchEventReminders();
    } catch (error: any) {
      console.error('useUserEventReminders - Exception removing reminder:', error);
      toast({
        title: "Error",
        description: "Failed to remove reminder",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log('useUserEventReminders - useEffect triggered, user.id:', user?.id);
    fetchEventReminders();
  }, [user?.id]);

  return {
    eventReminders,
    loading,
    fetchEventReminders,
    removeReminder,
  };
};
