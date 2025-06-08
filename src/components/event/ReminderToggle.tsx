
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReminderToggleProps {
  reminderChecked: boolean;
  settingReminder: boolean;
  onToggle: (checked: boolean) => void;
}

const ReminderToggle = ({ reminderChecked, settingReminder, onToggle }: ReminderToggleProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="reminder"
        checked={reminderChecked}
        onCheckedChange={onToggle}
        disabled={settingReminder}
      />
      <label htmlFor="reminder" className="text-sm cursor-pointer">
        {t('events.remindMe')}
      </label>
    </div>
  );
};

export default ReminderToggle;
