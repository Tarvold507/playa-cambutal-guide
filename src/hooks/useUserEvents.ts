
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserEvent {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  location: string;
  host: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  image_url?: string;
  approved: boolean;
  user_id: string;
  created_at: string;
}

export const useUserEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);

  const fetchUserEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserEvents(data || []);
    } catch (error) {
      console.error('Error fetching user events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<UserEvent>) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .eq('user_id', user?.id); // Extra safety check

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });

      fetchUserEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user?.id); // Extra safety check

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "Your event has been deleted successfully.",
      });

      fetchUserEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, [user]);

  return {
    userEvents,
    loading,
    fetchUserEvents,
    updateEvent,
    deleteEvent,
  };
};
