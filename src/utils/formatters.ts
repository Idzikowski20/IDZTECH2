
import { format, formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

/**
 * Format a date in Polish locale
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd.MM.yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: pl });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format relative time in Polish locale (e.g., "2 dni temu")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { locale: pl, addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};
