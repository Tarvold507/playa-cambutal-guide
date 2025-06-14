
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReminderToggleProps {
  reminderChecked: boolean;
  settingReminder: boolean;
  hasUnsavedChanges: boolean;
  onToggle: (checked: boolean) => void;
  onSave: () => void;
}

const ReminderToggle = ({ 
  reminderChecked, 
  settingReminder, 
  hasUnsavedChanges,
  onToggle, 
  onSave 
}: ReminderToggleProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="reminder"
          checked={reminderChecked}
          onCheckedChange={onToggle}
          disabled={settingReminder}
        />
        <label htmlFor="reminder" className="text-sm cursor-pointer">
          {t('events.remindMe')}
          {hasUnsavedChanges && (
            <span className="text-orange-600 ml-1">*</span>
          )}
        </label>
      </div>
      
      {hasUnsavedChanges && (
        <Button
          onClick={onSave}
          disabled={settingReminder}
          size="sm"
          className="h-7"
        >
          <Save className="h-3 w-3 mr-1" />
          {settingReminder ? 'Saving...' : 'Save'}
        </Button>
      )}
    </div>
  );
};

export default ReminderToggle;
