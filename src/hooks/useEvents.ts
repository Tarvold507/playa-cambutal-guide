
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
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

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('approved', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });
};

export const useUserEvents = () => {
  return useQuery({
    queryKey: ['user-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'approved' | 'user_id' | 'created_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event submitted!",
        description: "Your event is pending approval and will be visible once approved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useEventReminders = () => {
  return useQuery({
    queryKey: ['event-reminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_event_reminders')
        .select(`
          id,
          event_id,
          events (
            id,
            title,
            event_date,
            location
          )
        `);

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateEventReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_event_reminders')
        .insert({
          user_id: user.user.id,
          event_id: eventId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-reminders'] });
      toast({
        title: "Reminder set!",
        description: "You'll be notified before this event starts.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
