

import { format, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

const PANAMA_TIMEZONE = 'America/Panama';

export const formatInPanamaTime = (date: Date | string, formatStr: string = 'PPP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, PANAMA_TIMEZONE, formatStr);
};

export const formatTimeWithDefaults = (timeValue: string): string => {
  if (!timeValue) return '';
  
  // If the time doesn't include minutes (e.g., "14" becomes "14:00")
  if (timeValue.length <= 2) {
    return `${timeValue.padStart(2, '0')}:00`;
  }
  
  // If time is in format "HH:MM", ensure minutes default to 00 if not specified
  const [hours, minutes] = timeValue.split(':');
  const formattedHours = hours.padStart(2, '0');
  const formattedMinutes = minutes ? minutes.padStart(2, '0') : '00';
  
  return `${formattedHours}:${formattedMinutes}`;
};

export const calculateEndTime = (startTime: string): string => {
  if (!startTime) return '';
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHour = (hours + 1) % 24;
  
  return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const toPanamaTime = (date: Date): Date => {
  return toZonedTime(date, PANAMA_TIMEZONE);
};

export const parseEventDatePanama = (dateString: string): Date => {
  // If the date string doesn't include time, treat it as local Panama date
  if (!dateString.includes('T') && !dateString.includes(' ')) {
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date in Panama timezone
    const localDate = new Date(year, month - 1, day);
    return toPanamaTime(localDate);
  }
  
  return toPanamaTime(typeof dateString === 'string' ? parseISO(dateString) : dateString);
};

export const formatDateForDB = (date: Date): string => {
  return formatInPanamaTime(date, 'yyyy-MM-dd');
};

