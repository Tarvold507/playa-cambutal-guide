
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

  // Try to find today's hours - handle case insensitive matching
  let todayHours = hours[currentDay];
  if (!todayHours) {
    // Try lowercase version
    todayHours = hours[currentDay.toLowerCase()];
  }
  
  console.log('Today hours for', currentDay, ':', todayHours);
  
  if (!todayHours || todayHours.toLowerCase().trim() === 'closed' || todayHours.trim() === '') {
    console.log('Restaurant is closed today or no hours available');
    return false;
  }

  // Handle mixed time formats like "12:00 - 8:00 PM"
  const timeRange = parseTimeRange(todayHours);
  console.log('Parsed time range:', timeRange);
  
  if (!timeRange) {
    console.log('Failed to parse time range');
    return false;
  }

  const { openTime, closeTime } = timeRange;

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

// Helper function to parse time ranges with mixed formats
const parseTimeRange = (timeStr: string): { openTime: string; closeTime: string } | null => {
  try {
    const cleanTime = timeStr.trim().replace(/\s+/g, ' ');
    console.log('Parsing time range:', cleanTime);
    
    // Use regex to split on various dash patterns with flexible spacing
    const dashPattern = /\s*[-–—]\s*/;
    const parts = cleanTime.split(dashPattern);
    
    if (parts.length !== 2) {
      console.log('Could not split time range into two parts');
      return null;
    }

    let [openTimeStr, closeTimeStr] = parts.map(part => part.trim());
    
    // Handle mixed formats like "12:00 - 8:00 PM"
    // If the first time has no AM/PM but second time does, assume first is AM
    const hasOpenAMPM = /\s*(AM|PM)$/i.test(openTimeStr);
    const hasCloseAMPM = /\s*(AM|PM)$/i.test(closeTimeStr);
    
    if (!hasOpenAMPM && hasCloseAMPM) {
      // Extract AM/PM from close time to determine open time format
      const closeHour = parseInt(closeTimeStr.split(':')[0]);
      const isClosePM = /PM$/i.test(closeTimeStr);
      
      // If close time is PM and after 6, assume open time is AM
      // If close time is AM or early PM, might need to infer
      if (isClosePM && closeHour >= 6) {
        openTimeStr += ' AM';
      } else {
        // For ambiguous cases, check the hour
        const openHour = parseInt(openTimeStr.split(':')[0]);
        if (openHour >= 1 && openHour <= 11) {
          openTimeStr += ' AM';
        } else {
          openTimeStr += ' PM';
        }
      }
    }

    const openTime = convertTo24Hour(openTimeStr);
    const closeTime = convertTo24Hour(closeTimeStr);

    if (!openTime || !closeTime) {
      return null;
    }

    return { openTime, closeTime };
  } catch (error) {
    console.error('Error parsing time range:', error);
    return null;
  }
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
      const hourNum = parseInt(hours, 10);
      
      // Only accept valid 24-hour times
      if (hourNum >= 0 && hourNum <= 23) {
        const formatted = `${hours.padStart(2, '0')}:${minutes}`;
        console.log('Already 24-hour format, formatted:', formatted);
        return formatted;
      }
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

export const convertTo12Hour = (time24h: string): string => {
  try {
    const [hours, minutes] = time24h.split(':');
    let hourNum = parseInt(hours, 10);
    
    const modifier = hourNum >= 12 ? 'PM' : 'AM';
    
    if (hourNum === 0) {
      hourNum = 12; // 12 AM
    } else if (hourNum > 12) {
      hourNum = hourNum - 12; // Convert to 12-hour
    }
    
    return `${hourNum}:${minutes} ${modifier}`;
  } catch (error) {
    console.error('Error converting to 12-hour format:', error);
    return time24h; // Return original if conversion fails
  }
};

export const getOrderedDays = (): string[] => {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
};

export const formatHoursForDisplay = (hours: Record<string, string>): Array<{ day: string; hours: string }> => {
  const orderedDays = getOrderedDays();
  return orderedDays.map(day => {
    let dayHours = hours[day] || hours[day.toLowerCase()] || 'Closed';
    
    // Convert to 12-hour format for display
    if (dayHours !== 'Closed' && dayHours.trim() !== '') {
      const timeRange = parseTimeRange(dayHours);
      if (timeRange) {
        const { openTime, closeTime } = timeRange;
        const open12h = convertTo12Hour(openTime);
        const close12h = convertTo12Hour(closeTime);
        dayHours = `${open12h} - ${close12h}`;
      }
    }
    
    return {
      day,
      hours: dayHours
    };
  });
};

export const getCurrentPanamaTime = (): { currentDay: string; currentTime: string; fullDateTime: string } => {
  const now = new Date();
  return {
    currentDay: formatInTimeZone(now, PANAMA_TIMEZONE, 'EEEE'),
    currentTime: formatInTimeZone(now, PANAMA_TIMEZONE, 'HH:mm'),
    fullDateTime: formatInTimeZone(now, PANAMA_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz')
  };
};
