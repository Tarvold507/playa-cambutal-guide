
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DayPickerSingleProps } from 'react-day-picker';

interface AutoCloseCalendarProps extends DayPickerSingleProps {
  onSelect: (date: Date | undefined) => void;
  onClose?: () => void;
  className?: string;
}

const AutoCloseCalendar: React.FC<AutoCloseCalendarProps> = ({ 
  onSelect, 
  onClose, 
  className,
  ...props 
}) => {
  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    // Auto-close after selection
    if (date && onClose) {
      setTimeout(() => onClose(), 100);
    }
  };

  return (
    <Calendar
      {...props}
      onSelect={handleSelect}
      className={cn("pointer-events-auto", className)}
    />
  );
};

export default AutoCloseCalendar;
