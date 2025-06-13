
import { useUserEventReminders } from '@/hooks/useUserEventReminders';
import EventReminderCard from './EventReminderCard';

const EventRemindersSection = () => {
  const { eventReminders, loading, removeReminder } = useUserEventReminders();

  if (loading) {
    return <div className="text-center py-8">Loading your event reminders...</div>;
  }

  if (eventReminders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">You haven't set any event reminders yet.</p>
        <p className="text-sm text-gray-400">
          Browse events and set reminders to get notified before they start.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Event Reminders</h2>
      <p className="text-gray-600">
        Events you've set reminders for. You'll be notified before these events start.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventReminders.map((reminder) => (
          <EventReminderCard
            key={reminder.id}
            reminder={reminder}
            onRemove={removeReminder}
          />
        ))}
      </div>
    </div>
  );
};

export default EventRemindersSection;
