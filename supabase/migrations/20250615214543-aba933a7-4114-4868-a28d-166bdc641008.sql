
-- Create event_series table to group related recurring events
CREATE TABLE public.event_series (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  location TEXT NOT NULL,
  host TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recurrence_pattern table to store recurrence rules
CREATE TABLE public.recurrence_pattern (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_series_id UUID NOT NULL REFERENCES public.event_series(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('daily', 'weekly', 'monthly', 'custom')),
  interval_value INTEGER NOT NULL DEFAULT 1,
  days_of_week INTEGER[], -- For weekly: [0,1,2,3,4,5,6] where 0=Sunday
  day_of_month INTEGER, -- For monthly by date (1-31)
  week_of_month INTEGER, -- For monthly by position (1-5, -1 for last)
  day_of_week_monthly INTEGER, -- For monthly by day (0-6)
  end_type TEXT NOT NULL CHECK (end_type IN ('never', 'after_count', 'by_date')),
  end_count INTEGER, -- Number of occurrences if end_type = 'after_count'
  end_date DATE, -- End date if end_type = 'by_date'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add columns to events table for series support
ALTER TABLE public.events ADD COLUMN event_series_id UUID REFERENCES public.event_series(id) ON DELETE CASCADE;
ALTER TABLE public.events ADD COLUMN is_series_master BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN series_instance_date DATE; -- Original scheduled date for this instance
ALTER TABLE public.events ADD COLUMN is_exception BOOLEAN NOT NULL DEFAULT false; -- True if this instance was modified from series template

-- Create exceptions table for cancelled or rescheduled instances
CREATE TABLE public.series_exceptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_series_id UUID NOT NULL REFERENCES public.event_series(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  exception_type TEXT NOT NULL CHECK (exception_type IN ('cancelled', 'rescheduled')),
  new_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL, -- If rescheduled, points to new event
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_series_id, exception_date)
);

-- Add RLS policies for new tables
ALTER TABLE public.event_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurrence_pattern ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series_exceptions ENABLE ROW LEVEL SECURITY;

-- Event series policies
CREATE POLICY "Users can view their own event series" 
  ON public.event_series 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own event series" 
  ON public.event_series 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event series" 
  ON public.event_series 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event series" 
  ON public.event_series 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Recurrence pattern policies
CREATE POLICY "Users can view recurrence patterns for their series" 
  ON public.recurrence_pattern 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create recurrence patterns for their series" 
  ON public.recurrence_pattern 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update recurrence patterns for their series" 
  ON public.recurrence_pattern 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete recurrence patterns for their series" 
  ON public.recurrence_pattern 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

-- Series exceptions policies
CREATE POLICY "Users can view exceptions for their series" 
  ON public.series_exceptions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create exceptions for their series" 
  ON public.series_exceptions 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update exceptions for their series" 
  ON public.series_exceptions 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete exceptions for their series" 
  ON public.series_exceptions 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.event_series 
    WHERE id = event_series_id AND user_id = auth.uid()
  ));

-- Add trigger for updating event_series updated_at
CREATE OR REPLACE TRIGGER update_event_series_updated_at
  BEFORE UPDATE ON public.event_series
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
