/**
 * Italian Timezone Utilities
 * Ensures all date operations use Rome timezone (Europe/Rome) regardless of user location
 * Critical for vacation rental availability in Italian properties
 */

import { format, isBefore, startOfDay, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * Get current date in Italian timezone (Europe/Rome)
 * Always returns the current date as it would be displayed in Italy
 */
export function getTodayInItaly(): Date {
  const now = new Date();
  const italianTimeString = now.toLocaleDateString("en-CA", { timeZone: "Europe/Rome" });
  return new Date(italianTimeString + 'T00:00:00.000Z');
}

/**
 * Get start of today in Italian timezone
 * Replacement for date-fns startOfToday() that uses Italian timezone
 */
export function startOfTodayInItaly(): Date {
  return startOfDay(getTodayInItaly());
}

/**
 * Check if a date is before today in Italian timezone
 * Critical for preventing bookings on past dates regardless of user timezone
 */
export function isBeforeTodayInItaly(date: Date): boolean {
  const todayInItaly = startOfTodayInItaly();
  return isBefore(date, todayInItaly);
}

/**
 * Format date for Italian context with proper locale
 * Ensures consistent date display for Italian property bookings
 */
export function formatDateForItaly(date: Date, formatString: string): string {
  return format(date, formatString, { locale: it });
}

/**
 * Convert date to Italian timezone-aware string (YYYY-MM-DD)
 * Used for API calls and date comparisons
 */
export function formatDateForAPI(date: Date): string {
  // Convert to Italian timezone first, then format
  const italianDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Rome" }));
  return format(italianDate, 'yyyy-MM-dd');
}

/**
 * Validate if a date range is valid in Italian timezone context
 * Prevents booking issues caused by timezone discrepancies
 */
export function isValidDateRangeInItaly(
  checkinDate: Date | undefined, 
  checkoutDate: Date | undefined
): boolean {
  if (!checkinDate || !checkoutDate) return false;
  
  const todayInItaly = startOfTodayInItaly();
  
  // Check-in must not be in the past (Italian time)
  if (isBefore(checkinDate, todayInItaly)) return false;
  
  // Check-out must be after check-in
  if (!isBefore(checkinDate, checkoutDate)) return false;
  
  return true;
}

/**
 * Get timezone offset info for debugging
 * Helps identify timezone-related issues in analytics
 */
export function getTimezoneDebugInfo() {
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTime = now.toLocaleString();
  const italianTime = now.toLocaleString("it-IT", { timeZone: "Europe/Rome" });
  
  return {
    userTimezone,
    userTime,
    italianTime,
    userOffset: now.getTimezoneOffset(),
    timestamp: now.toISOString()
  };
}

/**
 * Create a date object from YYYY-MM-DD string in Italian timezone context
 * Ensures date parsing is consistent with Italian calendar logic
 */
export function parseDateInItaly(dateString: string): Date {
  // Parse the date string and ensure it's interpreted in Italian context
  const parsed = parseISO(dateString + 'T12:00:00.000Z'); // Noon to avoid timezone edge cases
  return parsed;
}