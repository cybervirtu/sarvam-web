/**
 * Date utilities for Sarvam_web
 */

/**
 * Gets the current date in YYYY-MM-DD format based on local time.
 */
export const getTodayDateString = (): string => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Checks if a YYYY-MM-DD string is today.
 */
export const isToday = (dateStr: string): boolean => {
    return dateStr === getTodayDateString();
};

/**
 * Checks if a YYYY-MM-DD string is before today.
 */
export const isOverdue = (dateStr: string): boolean => {
    const today = getTodayDateString();
    return dateStr < today;
};

/**
 * Formats a YYYY-MM-DD string for display.
 */
export const formatDisplayDate = (dateStr: string): string => {
    if (isToday(dateStr)) return 'Today';

    const date = new Date(dateStr);
    const today = new Date(getTodayDateString());

    // Check for yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    // Check for tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';

    // Default formatting
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
};
