
import { Checkbox } from '@/components/ui/checkbox';

interface ReminderToggleProps {
  reminderChecked: boolean;
  settingReminder: boolean;
  onToggle: (checked: boolean) => void;
}

const ReminderToggle = ({ reminderChecked, settingReminder, onToggle }: ReminderToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="reminder"
        checked={reminderChecked}
        onCheckedChange={onToggle}
        disabled={settingReminder}
      />
      <label htmlFor="reminder" className="text-sm cursor-pointer">
        Remind me 12 hours before this event
      </label>
    </div>
  );
};

export default ReminderToggle;
