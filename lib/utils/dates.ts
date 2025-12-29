import { format, addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Maximum allowed date range in days
 */
export const MAX_DATE_RANGE = 90;

/**
 * Warning threshold for date range in days
 */
export const WARNING_DATE_RANGE = 30;

/**
 * Get all dates in a range (inclusive)
 * Returns array of Date objects from start to end
 */
export function getDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(start);
  const endDate = new Date(end);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

/**
 * Format date for display to users
 * Examples: "Monday, Jan 15, 2025" or "Jan 15, 2025"
 */
export function formatDateForDisplay(date: Date, includeDay: boolean = true): string {
  if (includeDay) {
    return format(date, 'EEEE, MMM d, yyyy');
  }
  return format(date, 'MMM d, yyyy');
}

/**
 * Format date for short display (e.g., in calendar)
 * Example: "Jan 15"
 */
export function formatDateShort(date: Date): string {
  return format(date, 'MMM d');
}

/**
 * Format date for API/database (ISO string)
 * Example: "2025-01-15"
 */
export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse date from various formats
 * Handles Date objects, ISO strings, and date-only strings
 */
export function parseDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }
  return parseISO(date);
}

/**
 * Validate date range
 * Returns { valid: boolean, error?: string }
 */
export interface DateRangeValidation {
  valid: boolean;
  error?: string;
  warning?: string;
}

export function validateDateRange(start: Date | string, end: Date | string): DateRangeValidation {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  // Check if start is before end
  if (isAfter(startDate, endDate) || startDate.getTime() === endDate.getTime()) {
    return {
      valid: false,
      error: 'Start date must be before end date'
    };
  }

  // Check if dates are in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isBefore(startDate, today)) {
    return {
      valid: false,
      error: 'Start date cannot be in the past'
    };
  }

  // Check date range length
  const daysDifference = differenceInDays(endDate, startDate) + 1; // +1 to include both start and end

  if (daysDifference > MAX_DATE_RANGE) {
    return {
      valid: false,
      error: `Date range cannot exceed ${MAX_DATE_RANGE} days. Current range is ${daysDifference} days.`
    };
  }

  // Add warning for large date ranges
  if (daysDifference > WARNING_DATE_RANGE) {
    return {
      valid: true,
      warning: `Date range is ${daysDifference} days. Large date ranges may be harder for participants to fill out.`
    };
  }

  return { valid: true };
}

/**
 * Get the number of days in a date range (inclusive)
 */
export function getDateRangeLength(start: Date | string, end: Date | string): number {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  return differenceInDays(endDate, startDate) + 1;
}

/**
 * Check if a date is within a range (inclusive)
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return (date >= start && date <= end);
}

/**
 * Get day of week name
 * Example: "Monday", "Tuesday", etc.
 */
export function getDayOfWeek(date: Date): string {
  return format(date, 'EEEE');
}

/**
 * Get short day of week name
 * Example: "Mon", "Tue", etc.
 */
export function getDayOfWeekShort(date: Date): string {
  return format(date, 'EEE');
}

/**
 * Get single letter day of week
 * Example: "M", "T", "W", etc.
 */
export function getDayOfWeekLetter(date: Date): string {
  return format(date, 'EEEEE');
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Format date range for display
 * Example: "Jan 15 - Jan 20, 2025"
 */
export function formatDateRange(start: Date, end: Date): string {
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();

    if (startMonth === endMonth) {
      // Same month and year: "Jan 15 - 20, 2025"
      return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
    } else {
      // Different months, same year: "Jan 15 - Feb 20, 2025"
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
  } else {
    // Different years: "Dec 30, 2024 - Jan 5, 2025"
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  }
}
