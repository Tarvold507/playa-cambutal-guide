
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TimeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  value = '',
  onChange,
  placeholder = 'Select time',
  className,
  disabled = false,
}) => {
  const [hours, minutes] = value ? value.split(':') : ['', ''];

  const handleHourChange = (newHour: string) => {
    const currentMinutes = minutes || '00';
    onChange(`${newHour}:${currentMinutes}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    const currentHours = hours || '00';
    onChange(`${currentHours}:${newMinute}`);
  };

  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { value: hour, label: hour };
  });

  // Restricted minute options
  const minuteOptions = [
    { value: '00', label: '00' },
    { value: '15', label: '15' },
    { value: '30', label: '30' },
    { value: '45', label: '45' },
  ];

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={hours} onValueChange={handleHourChange} disabled={disabled}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="flex items-center text-muted-foreground">:</span>
      
      <Select value={minutes} onValueChange={handleMinuteChange} disabled={disabled}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minuteOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
