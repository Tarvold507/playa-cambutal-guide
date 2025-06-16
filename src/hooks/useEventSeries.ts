
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EventSeries {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  full_description?: string;
  location: string;
  host: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurrencePattern {
  id: string;
  event_series_id: string;
  pattern_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval_value: number;
  days_of_week?: number[];
  day_of_month?: number;
  week_of_month?: number;
  day_of_week_monthly?: number;
  end_type: 'never' | 'after_count' | 'by_date';
  end_count?: number;
  end_date?: string;
  created_at: string;
}

export const useEventSeries = () => {
  return useQuery({
    queryKey: ['event-series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_series')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventSeries[];
    },
  });
};

export const useCreateEventSeries = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      seriesData: Omit<EventSeries, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
      recurrencePattern: Omit<RecurrencePattern, 'id' | 'event_series_id' | 'created_at'>;
      firstEventDate: string;
      startTime?: string;
      endTime?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Create event series
      const { data: series, error: seriesError } = await supabase
        .from('event_series')
        .insert({
          ...data.seriesData,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (seriesError) throw seriesError;

      // Create recurrence pattern
      const { error: patternError } = await supabase
        .from('recurrence_pattern')
        .insert({
          ...data.recurrencePattern,
          event_series_id: series.id,
        });

      if (patternError) throw patternError;

      // Create master event
      const { data: masterEvent, error: eventError } = await supabase
        .from('events')
        .insert({
          title: data.seriesData.title,
          description: data.seriesData.description || '',
          full_description: data.seriesData.full_description,
          location: data.seriesData.location,
          host: data.seriesData.host,
          event_date: data.firstEventDate,
          start_time: data.startTime,
          end_time: data.endTime,
          image_url: data.seriesData.image_url,
          event_series_id: series.id,
          is_series_master: true,
          series_instance_date: data.firstEventDate,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Generate recurring instances using the database function
      const { data: instanceCount, error: functionError } = await supabase
        .rpc('generate_recurring_event_instances', {
          p_event_series_id: series.id,
          p_master_event_id: masterEvent.id
        });

      if (functionError) {
        console.error('Error generating recurring instances:', functionError);
        // Don't fail the entire operation, just log the error
        toast({
          title: "Warning",
          description: `Event series created but some recurring instances may not have been generated: ${functionError.message}`,
          variant: "destructive",
        });
      } else {
        console.log(`Generated ${instanceCount} recurring event instances`);
      }

      return series;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-series'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      toast({
        title: "Event series created!",
        description: "Your recurring event series and all instances have been created and are pending approval.",
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

export const useRecurrencePattern = (seriesId: string) => {
  return useQuery({
    queryKey: ['recurrence-pattern', seriesId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurrence_pattern')
        .select('*')
        .eq('event_series_id', seriesId)
        .single();

      if (error) throw error;
      return data as RecurrencePattern;
    },
    enabled: !!seriesId,
  });
};
