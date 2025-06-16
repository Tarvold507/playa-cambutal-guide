
import React from 'react';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AutoCloseCalendarProps extends CalendarProps {
  onSelect: (date: Date | undefined) => void;
  onClose?: () => void;
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
