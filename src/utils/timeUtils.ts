
import { formatInTimeZone } from 'date-fns-tz';

const PANAMA_TIMEZONE = 'America/Panama';

export const isRestaurantOpen = (hours: Record<string, string>): boolean => {
  const now = new Date();
  
  // Get current day and time in Panama timezone
  const currentDay = formatInTimeZone(now, PANAMA_TIMEZONE, 'EEEE'); // Full day name like "Monday"
  const currentTime = formatInTimeZone(now, PANAMA_TIMEZONE, 'HH:mm'); // 24-hour format
  
  console.log('=== Restaurant Open Check Debug ===');
  console.log('Panama timezone check:', {
    currentDay,
    currentTime,
    panamaTime: formatInTimeZone(now, PANAMA_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz')
  });

  const todayHours = hours[currentDay];
  console.log('Today hours for', currentDay, ':', todayHours);
  console.log('Raw hours string characters:', Array.from(todayHours || '').map(char => `"${char}" (${char.charCodeAt(0)})`));
  
  if (!todayHours || todayHours.toLowerCase() === 'closed') {
    console.log('Restaurant is closed today or no hours available');
    return false;
  }

  // Use regex to split on various dash patterns with flexible spacing
  // This handles: -, –, —, and multiple spaces around them
  const dashPattern = /\s*[-–—]\s*/;
  const timeRange = todayHours.split(dashPattern);
  console.log('Time range split with regex:', timeRange);
  
  // Fallback: try other common separators if regex split didn't work
  if (timeRange.length !== 2) {
    console.log('Regex split failed, trying fallback methods...');
    
    // Try splitting on common variations
    const fallbackPatterns = [' - ', ' – ', ' — ', '-', '–', '—', ' to ', ' TO '];
    let splitSuccess = false;
    
    for (const pattern of fallbackPatterns) {
      const testSplit = todayHours.split(pattern);
      if (testSplit.length === 2) {
        timeRange.length = 0;
        timeRange.push(...testSplit);
        console.log(`Fallback split successful with pattern "${pattern}":`, timeRange);
        splitSuccess = true;
        break;
      }
    }
    
    if (!splitSuccess) {
      console.log('All splitting methods failed. Time range:', timeRange);
      console.log('Original string length:', todayHours.length);
      return false;
    }
  }

  const openTimeStr = timeRange[0].trim();
  const closeTimeStr = timeRange[1].trim();
  console.log('Open time string:', openTimeStr);
  console.log('Close time string:', closeTimeStr);

  const openTime = convertTo24Hour(openTimeStr);
  const closeTime = convertTo24Hour(closeTimeStr);
  console.log('Converted open time:', openTime);
  console.log('Converted close time:', closeTime);

  if (!openTime || !closeTime) {
    console.log('Failed to convert times');
    return false;
  }

  // Convert times to minutes since midnight for reliable numeric comparison
  const currentMinutes = timeToMinutes(currentTime);
  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);
  
  console.log('Time comparison (minutes since midnight):', {
    current: currentMinutes,
    open: openMinutes,
    close: closeMinutes
  });

  const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  console.log('Restaurant is open:', isOpen);
  console.log('=== End Debug ===');

  return isOpen;
};

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const convertTo24Hour = (time12h: string): string | null => {
  try {
    // Clean up the input string - remove extra whitespace
    const cleanTime = time12h.trim().replace(/\s+/g, ' ');
    
    console.log('Converting time:', cleanTime);
    
    // If already in 24-hour format (like "16:30")
    if (/^\d{1,2}:\d{2}$/.test(cleanTime)) {
      const [hours, minutes] = cleanTime.split(':');
      // Ensure proper formatting with leading zeros
      const formatted = `${hours.padStart(2, '0')}:${minutes}`;
      console.log('Already 24-hour format, formatted:', formatted);
      return formatted;
    }

    // Handle 12-hour format (like "4:30 PM")
    const timeMatch = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) {
      console.log('Failed to match time format for:', cleanTime);
      return null;
    }

    let [, hours, minutes, modifier] = timeMatch;
    let hourNum = parseInt(hours, 10);

    console.log('Parsed 12-hour format:', { hours: hourNum, minutes, modifier });

    // Convert 12-hour to 24-hour
    if (hourNum === 12) {
      hourNum = modifier.toUpperCase() === 'AM' ? 0 : 12;
    } else if (modifier.toUpperCase() === 'PM') {
      hourNum += 12;
    }

    const converted = `${hourNum.toString().padStart(2, '0')}:${minutes}`;
    console.log('Converted to 24-hour:', converted);
    return converted;
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
