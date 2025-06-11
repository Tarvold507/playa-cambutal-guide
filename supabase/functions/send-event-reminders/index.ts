
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EventReminderData {
  id: string;
  user_id: string;
  event_id: string;
  reminder_sent: boolean;
  created_at: string;
  events: {
    id: string;
    title: string;
    description: string;
    location: string;
    host: string;
    event_date: string;
    start_time: string;
  };
  profiles: {
    name: string;
    email: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting event reminder check...');

    // Calculate the time 12 hours from now
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + 12);
    
    // Get the date in YYYY-MM-DD format for comparison
    const reminderDate = reminderTime.toISOString().split('T')[0];
    
    // Calculate the target hour (12 hours from now)
    const targetHour = reminderTime.getHours();
    
    console.log(`Looking for events on ${reminderDate} around hour ${targetHour}`);

    // Query with proper joins using service role to bypass RLS
    const { data: reminders, error } = await supabase
      .from('user_event_reminders')
      .select(`
        id,
        user_id,
        event_id,
        reminder_sent,
        created_at,
        events:event_id (
          id,
          title,
          description,
          location,
          host,
          event_date,
          start_time
        ),
        profiles:user_id (
          name,
          email
        )
      `)
      .eq('reminder_sent', false)
      .eq('events.event_date', reminderDate);

    if (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }

    console.log(`Found ${reminders?.length || 0} potential reminders`);

    if (!reminders || reminders.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No reminders to send' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const emailsSent = [];
    const errors = [];

    for (const reminder of reminders as EventReminderData[]) {
      try {
        // Ensure we have the necessary data
        if (!reminder.events || !reminder.profiles) {
          console.log(`Skipping reminder ${reminder.id} - missing event or profile data`);
          continue;
        }

        // Parse the event start time to check if it's within the 12-hour window
        let eventHour = 0;
        if (reminder.events.start_time) {
          const timeParts = reminder.events.start_time.split(':');
          eventHour = parseInt(timeParts[0]);
        }

        // Check if this event should have a reminder sent (within 1 hour of the 12-hour mark)
        const hourDiff = Math.abs(eventHour - targetHour);
        if (hourDiff > 1 && hourDiff < 23) { // Allow 1-hour window, accounting for 24-hour wrap
          continue;
        }

        console.log(`Sending reminder for event: ${reminder.events.title} to ${reminder.profiles.email}`);

        // Here you would integrate with your email service (like Resend)
        // For now, we'll just log the email content and mark as sent
        
        const emailContent = {
          to: reminder.profiles.email,
          subject: `Reminder: ${reminder.events.title} is starting soon!`,
          html: `
            <h2>Event Reminder</h2>
            <p>Hi ${reminder.profiles.name},</p>
            <p>This is a friendly reminder that the event "${reminder.events.title}" is starting in approximately 12 hours.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>${reminder.events.title}</h3>
              <p><strong>Date:</strong> ${new Date(reminder.events.event_date).toLocaleDateString()}</p>
              ${reminder.events.start_time ? `<p><strong>Time:</strong> ${reminder.events.start_time}</p>` : ''}
              <p><strong>Location:</strong> ${reminder.events.location}</p>
              <p><strong>Host:</strong> ${reminder.events.host}</p>
              ${reminder.events.description ? `<p><strong>Description:</strong> ${reminder.events.description}</p>` : ''}
            </div>
            
            <p>We hope to see you there!</p>
            <p>Best regards,<br>Playa Cambutal Events Team</p>
          `
        };

        console.log('Email content prepared:', emailContent);

        // Mark reminder as sent
        const { error: updateError } = await supabase
          .from('user_event_reminders')
          .update({ reminder_sent: true })
          .eq('id', reminder.id);

        if (updateError) {
          console.error('Error updating reminder status:', updateError);
          errors.push({ reminder_id: reminder.id, error: updateError.message });
        } else {
          emailsSent.push({
            reminder_id: reminder.id,
            event_title: reminder.events.title,
            recipient: reminder.profiles.email
          });
        }

      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
        errors.push({ reminder_id: reminder.id, error: error.message });
      }
    }

    console.log(`Processed ${emailsSent.length} reminders successfully`);
    if (errors.length > 0) {
      console.log(`Encountered ${errors.length} errors:`, errors);
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${reminders.length} reminders`,
        emails_sent: emailsSent.length,
        errors: errors.length,
        details: { emailsSent, errors }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-event-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
