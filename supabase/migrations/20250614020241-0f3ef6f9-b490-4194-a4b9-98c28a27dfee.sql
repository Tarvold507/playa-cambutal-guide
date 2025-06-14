
-- Remove the user_event_reminders table and related structures
DROP TABLE IF EXISTS public.user_event_reminders CASCADE;

-- Remove the event_reminders table if it exists
DROP TABLE IF EXISTS public.event_reminders CASCADE;

-- Remove the event_reminders_view if it exists
DROP VIEW IF EXISTS public.event_reminders_view CASCADE;

-- Remove any functions related to event reminders
DROP FUNCTION IF EXISTS public.send_event_reminders() CASCADE;
