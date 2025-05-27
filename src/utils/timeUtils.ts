
import { formatInTimeZone } from 'date-fns-tz';

const PANAMA_TIMEZONE = 'America/Panama';

export const isRestaurantOpen = (hours: Record<string, string>): boolean => {
  const now = new Date();
  
  // Get current day and time in Panama timezone
  const currentDay = formatInTimeZone(now, PANAMA_TIMEZONE, 'EEEE'); // Full day name like "Monday"
  const currentTime = formatInTimeZone(now, PANAMA_TIMEZONE, 'HH:mm'); // 24-hour format
  
  console.log('Panama timezone check:', {
    currentDay,
    currentTime,
    panamaTime: formatInTimeZone(now, PANAMA_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz')
  });

  const todayHours = hours[currentDay];
  
  if (!todayHours || todayHours.toLowerCase() === 'closed') {
    return false;
  }

  // Parse hours like "11:00 AM - 10:00 PM" or "11:00 - 22:00"
  const timeRange = todayHours.split(' - ');
  if (timeRange.length !== 2) {
    return false;
  }

  const openTime = convertTo24Hour(timeRange[0].trim());
  const closeTime = convertTo24Hour(timeRange[1].trim());

  if (!openTime || !closeTime) {
    return false;
  }

  return currentTime >= openTime && currentTime <= closeTime;
};

export const convertTo24Hour = (time12h: string): string | null => {
  try {
    // If already in 24-hour format
    if (/^\d{2}:\d{2}$/.test(time12h)) {
      return time12h;
    }

    // Handle 12-hour format
    const [time, modifier] = time12h.split(' ');
    if (!time || !modifier) {
      return null;
    }

    let [hours, minutes] = time.split(':');
    if (!hours || !minutes) {
      return null;
    }

    if (hours === '12') {
      hours = '00';
    }
    if (modifier.toUpperCase() === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  } catch (error) {
    console.error('Error converting time:', error);
    return null;
  }
};

export const getOrderedDays = (): string[] => {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
};

export const formatHoursForDisplay = (hours: Record<string, string>): Array<{ day: string; hours: string }> => {
  const orderedDays = getOrderedDays();
  return orderedDays.map(day => ({
    day,
    hours: hours[day] || 'Closed'
  }));
};

export const getCurrentPanamaTime = (): { currentDay: string; currentTime: string; fullDateTime: string } => {
  const now = new Date();
  return {
    currentDay: formatInTimeZone(now, PANAMA_TIMEZONE, 'EEEE'),
    currentTime: formatInTimeZone(now, PANAMA_TIMEZONE, 'HH:mm'),
    fullDateTime: formatInTimeZone(now, PANAMA_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz')
  };
};
