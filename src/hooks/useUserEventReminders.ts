
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
    if (!user) return;
    
    setLoading(true);
    try {
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

      if (error) throw error;
      setEventReminders(data || []);
    } catch (error) {
      console.error('Error fetching event reminders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your event reminders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('user_event_reminders')
        .delete()
        .eq('id', reminderId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Reminder removed",
        description: "Event reminder has been removed successfully.",
      });

      fetchEventReminders();
    } catch (error) {
      console.error('Error removing reminder:', error);
      toast({
        title: "Error",
        description: "Failed to remove reminder",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEventReminders();
  }, [user]);

  return {
    eventReminders,
    loading,
    fetchEventReminders,
    removeReminder,
  };
};
