
// Utility functions for handling dates and day-of-week conversions
// PostgreSQL uses: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

import { formatInPanamaTime, parseEventDatePanama } from './timezoneUtils';

export const POSTGRES_DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export const DAY_NAMES = {
  [POSTGRES_DAYS_OF_WEEK.SUNDAY]: 'Sunday',
  [POSTGRES_DAYS_OF_WEEK.MONDAY]: 'Monday',
  [POSTGRES_DAYS_OF_WEEK.TUESDAY]: 'Tuesday',
  [POSTGRES_DAYS_OF_WEEK.WEDNESDAY]: 'Wednesday',
  [POSTGRES_DAYS_OF_WEEK.THURSDAY]: 'Thursday',
  [POSTGRES_DAYS_OF_WEEK.FRIDAY]: 'Friday',
  [POSTGRES_DAYS_OF_WEEK.SATURDAY]: 'Saturday',
} as const;

export const DAY_NAMES_SHORT = {
  [POSTGRES_DAYS_OF_WEEK.SUNDAY]: 'Sun',
  [POSTGRES_DAYS_OF_WEEK.MONDAY]: 'Mon',
  [POSTGRES_DAYS_OF_WEEK.TUESDAY]: 'Tue',
  [POSTGRES_DAYS_OF_WEEK.WEDNESDAY]: 'Wed',
  [POSTGRES_DAYS_OF_WEEK.THURSDAY]: 'Thu',
  [POSTGRES_DAYS_OF_WEEK.FRIDAY]: 'Fri',
  [POSTGRES_DAYS_OF_WEEK.SATURDAY]: 'Sat',
} as const;

/**
 * Convert JavaScript Date.getDay() result to PostgreSQL day-of-week
 * JavaScript: 0=Sunday, 1=Monday, ..., 6=Saturday
 * PostgreSQL: 0=Sunday, 1=Monday, ..., 6=Saturday
 * They match, so no conversion needed
 */
export const jsDateToPgDay = (jsDay: number): number => {
  return jsDay;
};

/**
 * Convert PostgreSQL day-of-week to JavaScript Date.getDay() format
 * PostgreSQL: 0=Sunday, 1=Monday, ..., 6=Saturday
 * JavaScript: 0=Sunday, 1=Monday, ..., 6=Saturday
 * They match, so no conversion needed
 */
export const pgDayToJsDate = (pgDay: number): number => {
  return pgDay;
};

/**
 * Get the day name from PostgreSQL day-of-week number
 */
export const getDayName = (pgDay: number): string => {
  return DAY_NAMES[pgDay as keyof typeof DAY_NAMES] || 'Unknown';
};

/**
 * Get the short day name from PostgreSQL day-of-week number
 */
export const getDayNameShort = (pgDay: number): string => {
  return DAY_NAMES_SHORT[pgDay as keyof typeof DAY_NAMES_SHORT] || 'Unk';
};

/**
 * Format date to YYYY-MM-DD format for database storage using Panama timezone
 */
export const formatDateForDB = (date: Date): string => {
  return formatInPanamaTime(date, 'yyyy-MM-dd');
};

/**
 * Parse date string and ensure it's in Panama timezone
 */
export const parseEventDate = (dateString: string): Date => {
  return parseEventDatePanama(dateString);
};

/**
 * Get the day of week for a given date string in Panama timezone
 */
export const getDayOfWeekFromDate = (dateString: string): number => {
  const date = parseEventDate(dateString);
  return jsDateToPgDay(date.getDay());
};

/**
 * Format array of day numbers to readable string
 */
export const formatDaysOfWeek = (days: number[]): string => {
  if (!days || days.length === 0) return 'No days selected';
  
  const sortedDays = [...days].sort();
  return sortedDays.map(day => getDayNameShort(day)).join(', ');
};
