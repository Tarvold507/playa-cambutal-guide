
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import ReminderToggle from './event/ReminderToggle';
import { useEventReminder } from './event/useEventReminder';

interface Event {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  location: string;
  host: string;
  event_date: string;
  image_url?: string;
}

interface EventReminderProps {
  event: Event;
}

const EventReminder = ({ event }: EventReminderProps) => {
  const { user } = useAuth();
  const { reminderChecked, settingReminder, handleReminderToggle } = useEventReminder(event);

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-blue-600" />
          <span className="font-medium">Event Reminder</span>
        </div>
        
        {user ? (
          <ReminderToggle
            reminderChecked={reminderChecked}
            settingReminder={settingReminder}
            onToggle={handleReminderToggle}
          />
        ) : (
          <div className="text-sm text-gray-600">
            <Link to="/auth" className="text-blue-600 hover:underline">
              Sign in
            </Link>
            {' '}to set reminders
          </div>
        )}
      </div>
    </div>
  );
};

export default EventReminder;
