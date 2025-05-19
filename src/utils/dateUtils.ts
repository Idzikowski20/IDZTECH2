
/**
 * Format a date string to a localized format
 * @param dateString ISO date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

/**
 * Calculate and format estimated reading time
 * @param content HTML content string
 * @returns Formatted reading time string
 */
export const formatReadingTime = (content: string): string => {
  if (!content) return '1 min';
  
  // Strip HTML tags to get just text
  const text = content.replace(/<[^>]*>/g, '');
  
  // Average reading speed (words per minute)
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  return `${minutes} min`;
};
