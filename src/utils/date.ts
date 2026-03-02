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
    if (!dateStr) return false;
    return dateStr.split('T')[0] === getTodayDateString();
};

/**
 * Checks if a YYYY-MM-DD string is before today.
 */
export const isOverdue = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const today = getTodayDateString();
    return dateStr.split('T')[0] < today;
};

/**
 * Formats a YYYY-MM-DD string for display.
 */
export const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const dateOnly = dateStr.split('T')[0];
    if (isToday(dateOnly)) return 'Today';

    const date = new Date(dateStr);
    const today = new Date(getTodayDateString());

    // Check for yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateOnly === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    // Check for tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateOnly === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';

    // Default formatting
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
};

/**
 * Returns an array of YYYY-MM-DD strings for the next 7 days, including today.
 */
export const getNext7Days = (): string[] => {
    const days: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date.toISOString().split('T')[0]);
    }

    return days;
};
