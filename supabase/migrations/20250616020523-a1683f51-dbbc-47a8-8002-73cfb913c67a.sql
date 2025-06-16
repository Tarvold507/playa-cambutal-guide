
-- Create a function to generate recurring event instances
CREATE OR REPLACE FUNCTION generate_recurring_event_instances(
  p_event_series_id UUID,
  p_master_event_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_series RECORD;
  v_pattern RECORD;
  v_master_event RECORD;
  v_current_date DATE;
  v_end_date DATE;
  v_instance_count INTEGER := 0;
  v_max_instances INTEGER := 100; -- Safety limit
  v_day_of_week INTEGER;
BEGIN
  -- Get the event series info
  SELECT * INTO v_series FROM event_series WHERE id = p_event_series_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event series not found';
  END IF;

  -- Get the recurrence pattern
  SELECT * INTO v_pattern FROM recurrence_pattern WHERE event_series_id = p_event_series_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recurrence pattern not found';
  END IF;

  -- Get the master event
  SELECT * INTO v_master_event FROM events WHERE id = p_master_event_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Master event not found';
  END IF;

  -- Set the starting date (skip the first occurrence as it's the master event)
  v_current_date := v_master_event.event_date;
  
  -- Calculate end date based on pattern
  IF v_pattern.end_type = 'by_date' AND v_pattern.end_date IS NOT NULL THEN
    v_end_date := v_pattern.end_date;
  ELSIF v_pattern.end_type = 'after_count' AND v_pattern.end_count IS NOT NULL THEN
    v_max_instances := v_pattern.end_count;
  ELSE
    -- If 'never', we'll use the safety limit
    v_max_instances := 52; -- Default to 1 year of weekly events
  END IF;

  -- Generate instances based on pattern type
  IF v_pattern.pattern_type = 'weekly' THEN
    LOOP
      -- Move to next occurrence
      IF v_pattern.days_of_week IS NOT NULL AND array_length(v_pattern.days_of_week, 1) > 0 THEN
        -- Find next occurrence based on days of week
        v_day_of_week := EXTRACT(DOW FROM v_current_date);
        v_current_date := v_current_date + INTERVAL '1 day';
        
        -- Find the next occurrence that matches the pattern
        WHILE NOT (EXTRACT(DOW FROM v_current_date) = ANY(v_pattern.days_of_week)) LOOP
          v_current_date := v_current_date + INTERVAL '1 day';
          -- Safety check to prevent infinite loop
          IF v_current_date > v_master_event.event_date + INTERVAL '1 year' THEN
            EXIT;
          END IF;
        END LOOP;
      ELSE
        -- Default weekly interval
        v_current_date := v_current_date + (v_pattern.interval_value || ' weeks')::INTERVAL;
      END IF;

      -- Check if we should stop
      IF v_pattern.end_type = 'by_date' AND v_current_date > v_end_date THEN
        EXIT;
      END IF;
      
      IF v_instance_count >= v_max_instances - 1 THEN -- -1 because master event counts as first
        EXIT;
      END IF;

      -- Create the event instance
      INSERT INTO events (
        title,
        description,
        full_description,
        location,
        host,
        event_date,
        start_time,
        end_time,
        image_url,
        user_id,
        event_series_id,
        is_series_master,
        series_instance_date,
        approved
      ) VALUES (
        v_master_event.title,
        v_master_event.description,
        v_master_event.full_description,
        v_master_event.location,
        v_master_event.host,
        v_current_date,
        v_master_event.start_time,
        v_master_event.end_time,
        v_master_event.image_url,
        v_master_event.user_id,
        p_event_series_id,
        false, -- Not a series master
        v_current_date,
        false -- Instances start as unapproved, will be approved when series is approved
      );

      v_instance_count := v_instance_count + 1;
    END LOOP;

  ELSIF v_pattern.pattern_type = 'daily' THEN
    LOOP
      v_current_date := v_current_date + (v_pattern.interval_value || ' days')::INTERVAL;
      
      IF v_pattern.end_type = 'by_date' AND v_current_date > v_end_date THEN
        EXIT;
      END IF;
      
      IF v_instance_count >= v_max_instances - 1 THEN
        EXIT;
      END IF;

      INSERT INTO events (
        title, description, full_description, location, host, event_date, start_time, end_time,
        image_url, user_id, event_series_id, is_series_master, series_instance_date, approved
      ) VALUES (
        v_master_event.title, v_master_event.description, v_master_event.full_description,
        v_master_event.location, v_master_event.host, v_current_date, v_master_event.start_time,
        v_master_event.end_time, v_master_event.image_url, v_master_event.user_id,
        p_event_series_id, false, v_current_date, false
      );

      v_instance_count := v_instance_count + 1;
    END LOOP;

  ELSIF v_pattern.pattern_type = 'monthly' THEN
    LOOP
      IF v_pattern.day_of_month IS NOT NULL THEN
        -- Monthly by date (e.g., 15th of each month)
        v_current_date := (DATE_TRUNC('month', v_current_date) + (v_pattern.interval_value || ' months')::INTERVAL + (v_pattern.day_of_month - 1 || ' days')::INTERVAL)::DATE;
      ELSE
        -- Default monthly interval
        v_current_date := v_current_date + (v_pattern.interval_value || ' months')::INTERVAL;
      END IF;
      
      IF v_pattern.end_type = 'by_date' AND v_current_date > v_end_date THEN
        EXIT;
      END IF;
      
      IF v_instance_count >= v_max_instances - 1 THEN
        EXIT;
      END IF;

      INSERT INTO events (
        title, description, full_description, location, host, event_date, start_time, end_time,
        image_url, user_id, event_series_id, is_series_master, series_instance_date, approved
      ) VALUES (
        v_master_event.title, v_master_event.description, v_master_event.full_description,
        v_master_event.location, v_master_event.host, v_current_date, v_master_event.start_time,
        v_master_event.end_time, v_master_event.image_url, v_master_event.user_id,
        p_event_series_id, false, v_current_date, false
      );

      v_instance_count := v_instance_count + 1;
    END LOOP;
  END IF;

  RETURN v_instance_count;
END;
$$;
