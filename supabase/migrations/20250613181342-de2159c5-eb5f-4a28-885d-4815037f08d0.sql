
-- Check if RLS is enabled and show existing policies
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_event_reminders';

-- Show existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_event_reminders';
