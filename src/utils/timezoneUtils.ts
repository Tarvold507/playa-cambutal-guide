
import { toZonedTime, fromZonedTime, format as formatTz } from 'date-fns-tz';
import { format, parse, addHours } from 'date-fns';

const PANAMA_TIMEZONE = 'America/Panama';

/**
 * Convert a date to Panama timezone
 */
export const toPanamaTime = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return toZonedTime(dateObj, PANAMA_TIMEZONE);
};

/**
 * Convert a Panama timezone date to UTC for database storage
 */
export const fromPanamaTime = (date: Date): Date => {
  return fromZonedTime(date, PANAMA_TIMEZONE);
};

/**
 * Format a date in Panama timezone
 */
export const formatInPanamaTime = (date: Date | string, formatString: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatTz(dateObj, formatString, { timeZone: PANAMA_TIMEZONE });
};

/**
 * Parse event date ensuring it's treated as Panama time
 */
export const parseEventDatePanama = (dateString: string): Date => {
  // If the date string doesn't include time, treat it as local Panama date
  if (!dateString.includes('T') && !dateString.includes(' ')) {
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date in Panama timezone
    const localDate = new Date(year, month - 1, day);
    return toPanamaTime(localDate);
  }
  
  return toPanamaTime(dateString);
};

/**
 * Format date for database storage (YYYY-MM-DD) in Panama timezone
 */
export const formatDateForDBPanama = (date: Date): string => {
  return formatInPanamaTime(date, 'yyyy-MM-dd');
};

/**
 * Format time with default minutes to :00
 */
export const formatTimeWithDefaults = (timeString: string): string => {
  if (!timeString) return '';
  
  // If time doesn't include minutes, add :00
  if (timeString.length === 2 && /^\d{2}$/.test(timeString)) {
    return `${timeString}:00`;
  }
  
  // If time is like "14:" add 00
  if (timeString.endsWith(':')) {
    return `${timeString}00`;
  }
  
  return timeString;
};

/**
 * Calculate end time as 1 hour after start time
 */
export const calculateEndTime = (startTime: string): string => {
  if (!startTime) return '';
  
  try {
    // Parse the start time
    const parsedStartTime = parse(startTime, 'HH:mm', new Date());
    // Add 1 hour
    const endTime = addHours(parsedStartTime, 1);
    // Format back to HH:mm
    return format(endTime, 'HH:mm');
  } catch (error) {
    console.error('Error calculating end time:', error);
    return '';
  }
};
